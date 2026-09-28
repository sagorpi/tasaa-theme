const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function setup(reduced = false) {
  const animations = [];
  const animate = () => {
    let finish, reject;
    const animation = {
      finished: new Promise((resolve, fail) => { finish = resolve; reject = fail; }),
      finish, cancel() { this.cancelled = true; reject(new Error('cancelled')); },
    };
    animations.push(animation);
    return animation;
  };
  const summary = { attrs: { 'aria-expanded': 'true' }, offsetHeight: 48,
    getAttribute(name) { return this.attrs[name]; }, setAttribute(name, value) { this.attrs[name] = value; },
    nextElementSibling: { animate } };
  const details = { open: false, style: {}, scrollHeight: 192, querySelector: () => summary,
    getBoundingClientRect: () => ({ height: 48 }), animate };
  summary.parentNode = details;
  const source = fs.readFileSync('assets/global.js', 'utf8');
  const context = { MenuDrawer: class {}, customElements: { define() {} }, window: { matchMedia: () => ({ matches: reduced }) },
    document: { activeElement: summary }, trapFocus() {} };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('class HeaderDrawer'), source.indexOf("customElements.define('header-drawer'")) + '\nthis.Drawer = HeaderDrawer;', context);
  const drawer = new context.Drawer();
  drawer.closest = () => true;
  drawer.contains = () => true;
  drawer.querySelector = () => ({});
  drawer.mainDetailsToggle = {};
  return { drawer, details, summary, animations };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('accordion opens despite Dawn changing aria-expanded before the handler', async () => {
  const f = setup();
  f.drawer.onSummaryClick({ currentTarget: f.summary, preventDefault() {} });
  f.animations.forEach(a => a.finish());
  await settle();
  assert.equal(f.details.open, true);
  assert.equal(f.summary.attrs['aria-expanded'], 'true');
  assert.equal(f.details.style.overflow, '');
});

test('rapid accordion reversal cannot be overwritten by an older completion', async () => {
  const f = setup();
  const click = () => f.drawer.onSummaryClick({ currentTarget: f.summary, preventDefault() {} });
  click();
  click();
  click();
  f.animations.forEach(a => a.finish());
  await settle();
  assert.equal(f.details.open, true);
  assert.equal(f.summary.attrs['aria-expanded'], 'true');
  f.drawer.closeSubmenu(f.details);
  f.animations.forEach(a => a.finish());
  await settle();
  assert.equal(f.details.open, false);
  assert.equal(f.summary.attrs['aria-expanded'], 'false');
});
