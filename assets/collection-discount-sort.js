// Fetch every filtered page before sorting; sorting one page would miss larger discounts.
class CollectionDiscountSort {
  static async collect(doc, request, signal) {
    const cards = [];
    const visited = new Set();
    while (true) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      const container = doc.querySelector('#ProductGridContainer');
      if (!container) throw new Error('Missing collection results');
      cards.push(...container.querySelectorAll('#product-grid > li[data-discount]'));
      const nextPage = container.dataset.nextPage;
      if (!nextPage) break;
      const next = new URL(nextPage, request);
      next.searchParams.set('section_id', request.searchParams.get('section_id'));
      if (next.origin !== request.origin || visited.has(next.href)) throw new Error('Invalid collection pagination');
      visited.add(next.href);
      const response = await fetch(next, { signal });
      if (!response.ok) throw new Error('Unable to load products for discount sorting');
      doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    }
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    return cards.sort((a, b) => Number(b.dataset.discount) - Number(a.dataset.discount));
  }
}
