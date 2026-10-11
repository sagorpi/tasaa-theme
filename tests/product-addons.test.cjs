const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const context = { FormData, customElements: { get: () => true } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/product-form.js'), 'utf8'), context);
const prepare = context.prepareProductAddonData;
function form() {
  const data = new FormData();
  data.set('id', '101');
  data.set('quantity', '2');
  data.set('properties[Gift message]', 'For you & your family');
  data.set('selling_plan', '44');
  data.set('sections', 'cart-icon-bubble,cart-drawer');
  return data;
}
test('no paid selections preserves normal forms and free properties', () => {
  const data = form();
  assert.equal(prepare(data, [], 'test'), data);
});
test('adds multiple paid variants with parent linkage, correct quantity and existing properties', () => {
  const data = prepare(form(), [{ id: '202', label: 'Gift wrap' }, { id: '303', label: 'Petticoat' }], 'unique-group');
  assert.equal(data.get('items[0][id]'), '101');
  assert.equal(data.get('items[0][properties][Gift message]'), 'For you & your family');
  assert.equal(data.get('items[0][selling_plan]'), '44');
  assert.equal(data.get('items[1][id]'), '202');
  assert.equal(data.get('items[2][id]'), '303');
  for (const i of [1, 2]) {
    assert.equal(data.get(`items[${i}][parent_id]`), '101');
    assert.equal(data.get(`items[${i}][quantity]`), '2');
    assert.equal(data.get(`items[${i}][properties][_addon_group]`), 'unique-group');
  }
  assert.equal(data.get('sections'), 'cart-icon-bubble,cart-drawer');
  assert.equal(data.has('id'), false);
});
test('defaults quantities to one and keeps separate customisations distinct', () => {
  const first = form(); first.delete('quantity');
  const a = prepare(first, [{id: '202', label: 'Wrap'}], 'group-a');
  const b = prepare(first, [{id: '202', label: 'Wrap'}], 'group-b');
  assert.equal(a.get('items[1][quantity]'), '1');
  assert.notEqual(a.get('items[0][properties][_addon_group]'), b.get('items[0][properties][_addon_group]'));
});
test('rejects missing variants and circular parent references', () => {
  assert.throws(() => prepare(form(), [{ id: '', label: 'Missing' }], 'x'), /not available/);
  assert.throws(() => prepare(form(), [{ id: '101', label: 'Self' }], 'x'), /not available/);
});

function submissionHarness(response, { checkout = false, failure = false } = {}) {
  let ProductForm, request, redirected, rendered, error;
  const button = { disabled: false, attrs: {}, classList: { add() {}, remove() {} },
    getAttribute(key) { return this.attrs[key]; }, setAttribute(key, val) { this.attrs[key] = val; },
    removeAttribute(key) { delete this.attrs[key]; }, querySelector() { return null; } };
  const checkoutButton = { disabled: false };
  class TestFormData extends FormData {
    constructor(input) { super(); if (input?.fields) for (const [k,v] of input.fields) this.append(k,v); }
  }
  const env = {
    FormData: TestFormData, HTMLElement: class {}, console: { error() {} },
    customElements: { get: () => false, define: (_, cls) => { ProductForm = cls; } },
    fetchConfig: () => ({ headers: {} }), routes: {cart_add_url:'/cart/add.js'},
    document: {activeElement: null}, PUB_SUB_EVENTS: {cartError:'error',cartUpdate:'update'},
    publish: () => Promise.resolve(),
    CartPerformance: {createStartingMarker() {},measureFromMarker() {},measureFromEvent() {},measure(_,fn) {fn();}},
    window: {crypto:{randomUUID:()=> 'test-group'}, Shopify:{routes:{root:'/en/'}},
      location:{pathname:'/products/test',assign(url){redirected=url;}}, variantStrings:{addToCart:'Add to cart'}},
    fetch: async (_, config) => { request=config.body; if(failure) throw new Error('offline'); return {json:async()=>response}; },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/product-form.js'),'utf8'),env);
  const instance = Object.create(ProductForm.prototype);
  Object.assign(instance, {
    form:{fields:[['id','101'],['properties[Remove price tag]','Yes']],
      querySelectorAll:()=>[{dataset:{addonVariant:'202',addonLabel:'Gift wrap'}}]},
    submitButton:button,
    querySelector: selector => selector === '[data-addon-checkout]' ? checkoutButton : {classList:{add(){},remove(){}}},
    handleErrorMessage: message => {error=message;},
    createCartLinesUpdateEvent:()=>null, resolveCartLinesUpdate(){},dispatchCartErrorEvent(){},closest:()=>null,
    cart:{getSectionsToRender:()=>[{id:'cart-icon-bubble'}],setActiveElement(){},
      renderContents(data){rendered=data;},classList:{contains:()=>false}},
  });
  instance.onSubmitHandler({preventDefault(){},submitter:{hasAttribute:()=>checkout}});
  return {instance,button,checkoutButton,result:()=>({request,redirected,rendered,error})};
}
const settle = () => new Promise(resolve=>setImmediate(resolve));
test('normal and floating submissions render the notification after a multi-item response',async()=>{
  const h=submissionHarness({items:[{id:101,key:'parent-key'},{id:202}],sections:{'cart-icon-bubble':'html'}});
  await settle();
  const result=h.result();
  assert.equal(result.request.get('items[1][parent_id]'),'101');
  assert.equal(result.rendered.key,'parent-key');
  assert.equal(result.redirected,undefined);
  assert.equal(h.button.getAttribute('aria-disabled'),undefined);
});
test('Buy it now waits for success before entering locale-aware checkout with selected extras',async()=>{
  const h=submissionHarness({items:[{id:101,key:'parent-key'}]}, {checkout:true});
  assert.equal(h.result().redirected,undefined);
  await settle();
  assert.equal(h.result().redirected,'/en/checkout');
  assert.equal(h.result().request.get('items[0][properties][Remove price tag]'),'Yes');
});
test('sold-out add-ons show an error and never redirect; submission is retryable',async()=>{
  const h=submissionHarness({status:422,description:'Gift wrap is sold out'}, {checkout:true});
  await settle();
  assert.equal(h.result().error,'Gift wrap is sold out');
  assert.equal(h.result().redirected,undefined);
  assert.equal(h.result().rendered,undefined);
  assert.equal(h.checkoutButton.disabled,false);
  assert.equal(h.button.getAttribute('aria-disabled'),undefined);
});
test('network failure does not retry or redirect and tells customers to check their cart',async()=>{
  const h=submissionHarness(null,{checkout:true,failure:true});
  await settle();
  assert.match(h.result().error,/check your cart/);
  assert.equal(h.result().redirected,undefined);
  assert.equal(h.checkoutButton.disabled,false);
});
