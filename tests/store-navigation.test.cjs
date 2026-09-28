const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup(reduced = false) {
  const timers = new Map();
  const animations = [];
  let id = 0;
  const target = () => ({ handlers: {}, addEventListener(type, fn) { this.handlers[type] = fn; } });
  const animate = (frames, options) => {
    let finish;
    const animation = { frames, options, cancelled: false, finished: new Promise(resolve => { finish = resolve; }), cancel() { this.cancelled = true; }, finish() { finish(); } };
    animations.push(animation);
    return animation;
  };
  const items = [{ animate }, { animate }];
  const content = { animate, querySelectorAll: () => items };
  const summary = { ...target(), nextElementSibling: content, dataset: {}, setAttribute() {}, focus() {} };
  const details = { ...target(), open: false, querySelector: () => summary, contains: x => x === summary, closest: () => null };
  const menu = details;
  const header = { querySelectorAll: selector => selector.includes('inline-menu') ? [menu] : [] };
  const document = { ...target(), querySelector: () => header };
  vm.runInNewContext(fs.readFileSync('assets/store-navigation.js', 'utf8'), {
    document, AbortController, matchMedia: query => ({ ...target(), matches: query.includes('reduced') ? reduced : true }),
    getComputedStyle: () => ({ opacity: '1' }), setTimeout: fn => { timers.set(++id, fn); return id; }, clearTimeout: key => timers.delete(key)
  });
  return { menu, summary, details, animations, timers };
}
test('hover uses delayed close and re-entry cancels a pending fade-out', async () => {
  const f = setup();
  f.menu.handlers.pointerenter({ pointerType: 'mouse' });
  assert.equal(f.details.open, true);
  assert.equal(f.animations[0].options.duration, 250);
  assert.equal(f.animations[2].options.delay, 200);
  f.menu.handlers.pointerleave();
  assert.equal(f.details.open, true);
  [...f.timers.values()][0]();
  const closing = f.animations.at(-1);
  assert.equal(closing.options.duration, 400);
  f.menu.handlers.pointerenter({ pointerType: 'mouse' });
  closing.finish();
  await Promise.resolve();
  assert.equal(f.details.open, true);
  assert.equal(closing.cancelled, true);
});
test('click and Escape close disclosures; reduced motion removes delays', async () => {
  const f = setup(true);
  f.summary.handlers.click({ preventDefault() {}, stopPropagation() {}, detail: 0 });
  assert.equal(f.details.open, true);
  assert.ok(f.animations.every(a => a.options.duration === 0 && !a.options.delay));
  f.menu.handlers.keydown({ key: 'Escape', stopPropagation() {} });
  f.animations.at(-1).finish();
  await Promise.resolve();
  assert.equal(f.details.open, false);
});

test('mouse click after hover keeps a placeholder menu open', () => {
  const f = setup();
  f.summary.dataset.menuUrl = '#';
  f.menu.handlers.pointerenter({ pointerType: 'mouse' });
  const animationCount = f.animations.length;
  f.summary.handlers.click({ preventDefault() {}, stopPropagation() {}, detail: 1 });
  assert.equal(f.details.open, true);
  assert.equal(f.animations.length, animationCount);
});
