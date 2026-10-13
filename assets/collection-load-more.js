if (!customElements.get('collection-load-more')) {
  customElements.define('collection-load-more', class extends HTMLElement {
    connectedCallback() {
      this.link = this.querySelector('a');
      this.status = this.querySelector('[role="status"]');
      this.grid = this.closest('.collection').querySelector('#product-grid');
      this.collection = this.closest('.collection');
      this.layout = this.closest('.tasaa-collection-layout');
      if (!('IntersectionObserver' in window)) return;
      this.onClick = (event) => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        this.load();
      };
      this.link?.addEventListener('click', this.onClick);
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting) && !this.failed) this.load();
      }, { rootMargin: '0px 0px 300px 0px' });
      this.refreshObserver = new MutationObserver(() => {
        if (this.filtering) {
          this.controller?.abort();
          this.loading = false;
          this.setBusy(false);
          this.observer.disconnect();
        } else if (this.link) {
          this.observer.observe(this);
        }
      });
      this.refreshObserver.observe(this.collection, { attributes: true, attributeFilter: ['class'] });
      if (this.layout) this.refreshObserver.observe(this.layout, { attributes: true, attributeFilter: ['aria-busy'] });
      if (this.link && !this.filtering) this.observer.observe(this);
    }
    disconnectedCallback() {
      this.controller?.abort();
      this.observer?.disconnect();
      this.refreshObserver?.disconnect();
      this.link?.removeEventListener('click', this.onClick);
    }
    get filtering() {
      return this.layout?.getAttribute('aria-busy') === 'true' || this.collection.classList.contains('loading');
    }
    setBusy(busy) {
      this.setAttribute('aria-busy', String(busy));
      this.link?.setAttribute('aria-disabled', String(busy));
      if (this.link) this.link.textContent = busy ? 'Loading…' : 'Load more products';
      this.status.textContent = busy ? 'Loading more products…' : '';
    }
    async load() {
      if (!this.link || this.loading || this.filtering || !this.isConnected) return;
      if (this.localCards) {
        const cards = this.localCards.splice(0, this.localPageSize);
        const restoreFocus = document.activeElement === this.link;
        cards.forEach(card => {
          card.classList.add('scroll-trigger--cancel');
          this.grid.append(card);
        });
        if (restoreFocus) cards[0]?.querySelector('a')?.focus({ preventScroll: true });
        this.status.textContent = `${this.grid.children.length} products shown.`;
        if (!this.localCards.length) {
          this.observer.disconnect();
          this.link.removeEventListener('click', this.onClick);
          this.link.remove();
          this.link = null;
          this.status.textContent = 'You’ve viewed all products in this selection.';
        }
        return;
      }
      this.loading = true;
      this.failed = false;
      this.setBusy(true);
      this.observer.disconnect();
      const controller = new AbortController();
      this.controller = controller;
      const url = new URL(this.link.href);
      url.searchParams.set('section_id', this.dataset.section);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load products');
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (controller.signal.aborted || !this.isConnected || this.filtering) return;
        const nextGrid = doc.querySelector('#product-grid');
        if (!nextGrid || !nextGrid.children.length) throw new Error('Missing product results');
        const firstNew = nextGrid.firstElementChild;
        const restoreFocus = document.activeElement === this.link;
        [...nextGrid.children].forEach(card => {
          card.classList.add('scroll-trigger--cancel');
          this.grid.append(card);
        });
        const nextLink = doc.querySelector('collection-load-more a');
        this.setBusy(false);
        this.status.textContent = `${this.grid.children.length} products shown.`;
        if (restoreFocus) firstNew.querySelector('a')?.focus({ preventScroll: true });
        if (nextLink) {
          this.link.href = nextLink.href;
          this.observer.observe(this);
        } else {
          this.link.removeEventListener('click', this.onClick);
          this.link.remove();
          this.link = null;
          this.status.textContent = 'You’ve viewed all products in this selection.';
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.failed = true;
          this.setBusy(false);
          this.status.textContent = 'Couldn’t load more products. Please try again.';
          if (this.link) this.link.textContent = 'Try again';
        }
      } finally {
        if (this.controller === controller) this.loading = false;
      }
    }
  });
}
