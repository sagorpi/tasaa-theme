const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const request = new URL('https://shop.test/collections/all?filter.v.availability=1&sort_by=price-descending&section_id=collection');
const card = (discount, id) => ({ dataset: { discount: String(discount) }, id });
const doc = (cards, nextPage = '') => ({ querySelector: () => ({ dataset: { nextPage }, querySelectorAll: () => cards }) });
function fixture(fetch, nextDoc) {
  const context = { URL, DOMException, fetch, DOMParser: class { parseFromString() { return nextDoc; } } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('assets/collection-discount-sort.js', 'utf8') + '\nthis.Sort = CollectionDiscountSort;', context);
  return context.Sort;
}
test('sorts all pages by percentage, preserving tied order and filtered page URLs', async () => {
  let fetched;
  const sort = fixture(async url => { fetched = url; return { ok: true, text: async () => '' }; }, doc([card(60, 'later'), card(24, 'tie')]));
  const result = await sort.collect(doc([card(0, 'full'), card(24, 'first')], '/collections/all?filter.v.availability=1&sort_by=price-descending&page=2'), request, new AbortController().signal);
  assert.deepEqual(Array.from(result, c => c.id), ['later', 'first', 'tie', 'full']);
  assert.equal(fetched.searchParams.get('filter.v.availability'), '1');
  assert.equal(fetched.searchParams.get('section_id'), 'collection');
});
test('does not return a partial order when a later page fails', async () => {
  const sort = fixture(async () => ({ ok: false }));
  await assert.rejects(sort.collect(doc([card(5, 'first')], '?page=2'), request, new AbortController().signal), /Unable to load/);
});
test('discards results when the filter request is cancelled', async () => {
  const controller = new AbortController();
  const sort = fixture(async () => { controller.abort(); return { ok: true, text: async () => '' }; }, doc([card(60, 'later')]));
  await assert.rejects(sort.collect(doc([card(5, 'first')], '?page=2'), request, controller.signal), { name: 'AbortError' });
});
