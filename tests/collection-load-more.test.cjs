const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function fixture(fetch) {
  let Component;
  const grid = { children: [], append(card) { this.children.push(card); } };
  let busy = false;
  const link = { href: 'https://shop.test/collections/all?filter.v.availability=1&sort_by=price-ascending&page=2', setAttribute() {}, removeEventListener() {}, remove() { this.removed = true; } };
  const nextGrid = { children: [{ classList: { add() {} }, querySelector() { return null; } }], get firstElementChild() { return this.children[0]; } };
  const parsed = { querySelector: selector => selector === '#product-grid' ? nextGrid : null };
  vm.runInNewContext(fs.readFileSync('assets/collection-load-more.js', 'utf8'), {
    customElements: { get() { return false; }, define(name, constructor) { Component = constructor; } },
    HTMLElement: class {}, URL, AbortController, fetch,
    document: { activeElement: null },
    DOMParser: class { parseFromString() { return parsed; } },
  });
  const component = new Component();
  Object.assign(component, {
    link, grid, status: { textContent: '' }, dataset: { section: 'collection-section' }, isConnected: true,
    collection: { classList: { contains: () => false } },
    layout: { getAttribute: () => busy ? 'true' : null },
    observer: { disconnect() {}, observe() {} }, setAttribute() {},
  });
  return { component, link, grid, setBusy: value => { busy = value; } };
}

test('loads the next page with filters and sorting intact, and stops at the final page', async () => {
  let requested;
  const { component, grid, link } = fixture(async url => { requested = url; return { ok: true, text: async () => '' }; });
  await component.load();
  assert.equal(requested.searchParams.get('filter.v.availability'), '1');
  assert.equal(requested.searchParams.get('sort_by'), 'price-ascending');
  assert.equal(requested.searchParams.get('page'), '2');
  assert.equal(requested.searchParams.get('section_id'), 'collection-section');
  assert.equal(grid.children.length, 1);
  assert.equal(link.removed, true);
  assert.equal(component.link, null);
});

test('ignores duplicate triggers and discards results when a filter update starts', async () => {
  let resolve, requests = 0;
  const { component, grid, setBusy } = fixture(() => { requests++; return new Promise(r => { resolve = r; }); });
  const pending = component.load();
  await component.load();
  assert.equal(requests, 1);
  setBusy(true);
  resolve({ ok: true, text: async () => '' });
  await pending;
  assert.equal(grid.children.length, 0);
});

test('network failures leave existing products and provide a manual retry', async () => {
  const { component, link, grid } = fixture(async () => { throw new Error('Offline'); });
  await component.load();
  assert.equal(component.failed, true);
  assert.equal(component.loading, false);
  assert.equal(link.textContent, 'Try again');
  assert.equal(grid.children.length, 0);
});

test('reveals pre-sorted discount cards in batches without fetching an unsorted server page', async () => {
  const { component, grid, link } = fixture(() => { throw new Error('Should not fetch'); });
  const card = discount => ({ discount, classList: { add() {} } });
  component.localCards = [card(60), card(24), card(0)];
  component.localPageSize = 2;
  await component.load();
  assert.deepEqual(grid.children.map(c => c.discount), [60, 24]);
  assert.equal(link.removed, undefined);
  await component.load();
  assert.deepEqual(grid.children.map(c => c.discount), [60, 24, 0]);
  assert.equal(component.link, null);
});
