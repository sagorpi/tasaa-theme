const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fixture(count = 3) {
  let Carousel;
  let nextTimer = 0;
  const timers = new Map();
  const document = { hidden: false };
  vm.runInNewContext(fs.readFileSync('assets/hero-slideshow.js', 'utf8'), {
    customElements: { get: () => false, define: (_, value) => { Carousel = value; } },
    HTMLElement: class {},
    setTimeout: (callback, delay) => { timers.set(++nextTimer, { callback, delay }); return nextTimer; },
    clearTimeout: id => timers.delete(id),
    getComputedStyle: () => ({ direction: 'ltr' }),
    document,
    Date,
  });
  const element = () => ({
    attributes: {},
    dataset: {},
    classList: { toggle() {} },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    querySelector() { return null; },
  });
  const carousel = new Carousel();
  Object.assign(carousel, {
    slides: Array.from({ length: count }, element),
    dots: Array.from({ length: count }, element),
    track: { ...element(), hasPointerCapture: () => false },
    mobile: { matches: false },
    reducedMotion: { matches: false },
    pauses: new Set(),
    dataset: { autoplay: 'true', autoplayMobile: 'true', speed: '5000', speedMobile: '3000' },
    visible: true,
    current: 0,
    querySelector: () => null,
  });
  return { carousel, timers, document };
}

test('navigation wraps in both directions and excludes inactive slides from focus', () => {
  const { carousel } = fixture();
  carousel.goTo(-1);
  assert.equal(carousel.current, 2);
  assert.deepEqual(carousel.slides.map(s => s.inert), [true, true, false]);
  assert.equal(carousel.dots[2].attributes['aria-current'], 'true');
  carousel.goTo(3);
  assert.equal(carousel.current, 0);
  assert.equal(carousel.dots[2].attributes['aria-current'], undefined);
});

test('autoplay changes from 5 seconds to 3 seconds without duplicate timers', () => {
  const { carousel, timers } = fixture();
  carousel.updateTimer();
  assert.equal([...timers.values()][0].delay, 5000);
  carousel.mobile.matches = true;
  carousel.updateTimer();
  assert.equal(timers.size, 1);
  assert.equal([...timers.values()][0].delay, 3000);
  [...timers.values()][0].callback();
  assert.equal(carousel.current, 1);
});

test('hover and keyboard focus pause independently', () => {
  const { carousel, timers } = fixture();
  carousel.updateTimer();
  carousel.setPause('hover', true);
  carousel.setPause('focus', true);
  carousel.setPause('hover', false);
  assert.equal(timers.size, 0);
  carousel.setPause('focus', false);
  assert.equal(timers.size, 1);
});

test('user pause, hidden tabs, offscreen slides and reduced motion stop autoplay', () => {
  const { carousel, timers, document } = fixture();
  for (const [object, key] of [[carousel, 'userPaused'], [document, 'hidden'], [carousel.reducedMotion, 'matches']]) {
    object[key] = true;
    carousel.updateTimer();
    assert.equal(timers.size, 0);
    object[key] = false;
  }
  carousel.visible = false;
  carousel.updateTimer();
  assert.equal(timers.size, 0);
  carousel.visible = true;
  carousel.updateTimer();
  assert.equal(timers.size, 1);
});

test('single slides and device-disabled autoplay never start a timer', () => {
  const single = fixture(1);
  single.carousel.updateTimer();
  assert.equal(single.timers.size, 0);
  const { carousel, timers } = fixture();
  carousel.mobile.matches = true;
  carousel.dataset.autoplayMobile = 'false';
  carousel.updateTimer();
  assert.equal(timers.size, 0);
});

test('swiping navigates once and suppresses banner-link click-through', () => {
  const { carousel } = fixture();
  carousel.gesture = { id: 1, x: 200, y: 0, dragged: true };
  carousel.endGesture({ pointerId: 1, clientX: 100 });
  assert.equal(carousel.current, 1);
  assert.ok(carousel.suppressClickUntil > Date.now());
  carousel.endGesture({ pointerId: 1, clientX: 100 });
  assert.equal(carousel.current, 1);
});

test('vertical scrolling, short swipes and cancelled gestures do not advance', () => {
  const { carousel } = fixture();
  for (const [dragged, delta, cancelled] of [[false, 70, false], [true, 20, false], [true, 70, true]]) {
    carousel.gesture = { id: 1, x: 0, y: 0, dragged };
    carousel.endGesture({ pointerId: 1, clientX: delta }, cancelled);
    assert.equal(carousel.current, 0);
  }
});

test('theme editor removal clears timers and observers', () => {
  const { carousel, timers } = fixture();
  let cleaned = 0;
  carousel.controller = { abort: () => cleaned++ };
  carousel.observer = { disconnect: () => cleaned++ };
  carousel.resizeObserver = { disconnect: () => cleaned++ };
  carousel.updateTimer();
  carousel.disconnectedCallback();
  assert.equal(timers.size, 0);
  assert.equal(cleaned, 3);
  assert.equal(carousel.controller, null);
});

test('image banners slide in the requested direction across loop boundaries and cancel interrupted animations', () => {
  const { carousel } = fixture();
  const animations = [];
  carousel.dataset.transition = 'slide';
  carousel.track.getBoundingClientRect = () => ({ width: 1000 });
  carousel.slides.forEach(slide => {
    slide.animate = (frames, options) => {
      const animation = { frames, options, cancelled: false, cancel() { this.cancelled = true; } };
      animations.push(animation);
      return animation;
    };
  });
  carousel.goTo(-1);
  assert.equal(carousel.current, 2);
  assert.equal(animations[1].frames[0].transform, 'translateX(-1032px)');
  carousel.goTo(3);
  assert.equal(carousel.current, 0);
  assert.ok(animations[0].cancelled && animations[1].cancelled);
  assert.equal(animations[3].frames[0].transform, 'translateX(1032px)');
  carousel.reducedMotion.matches = true;
  carousel.goTo(1);
  assert.equal(animations.length, 4);
  assert.ok(animations[3].cancelled);
});
