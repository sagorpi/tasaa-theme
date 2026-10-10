const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../assets/delivery-estimate.js'), 'utf8');
function render(now, min = '5', max = '7') {
  let Element;
  let cleared = false;
  const RealDate = Date;
  class Clock extends RealDate {
    constructor(...args) { super(...(args.length ? args : [now])); }
  }
  vm.runInNewContext(source, {
    Date: Clock, Intl, HTMLElement: class {},
    customElements: { get: () => undefined, define: (_, type) => { Element = type; } },
    setInterval: () => 1, clearInterval: () => { cleared = true; },
  });
  const element = new Element();
  const output = {};
  element.dataset = { minDays: min, maxDays: max };
  element.querySelector = () => output;
  element.connectedCallback();
  assert.equal(element.hidden, false);
  element.disconnectedCallback();
  assert.equal(cleared, true);
  return output.textContent;
}
test('uses the India calendar date rather than UTC date', () => {
  assert.equal(render('2026-10-05T19:00:00Z'), '11 October – 13 October');
});
test('handles month boundaries and leap years', () => {
  assert.equal(render('2028-02-27T12:00:00Z', '2', '4'), '29 February – 2 March');
});
test('includes years for a range crossing New Year', () => {
  assert.equal(render('2026-12-25T12:00:00Z'), '30 December 2026 – 1 January 2027');
});
test('supports same-day estimates and clamps reversed ranges', () => {
  assert.equal(render('2026-10-06T12:00:00Z', '0', '0'), '6 October – 6 October');
  assert.equal(render('2026-10-06T12:00:00Z', '7', '5'), '13 October – 13 October');
});
