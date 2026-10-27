if (!customElements.get('collection-filters')) {
  customElements.define('collection-filters', class extends HTMLElement {
    connectedCallback() {
      this.root = this.closest('.tasaa-collection-layout');
      this.mobile = matchMedia('(max-width: 989px)');
      this.originalImageSizes = new WeakMap();
      this.setColumns(3);
      this.setMobileColumns(this.dataset.mobileColumns);
      this.onClick = this.onClick.bind(this);
      this.onGridClick = (event) => { if (event.target.closest('.cf-active')) this.onClick(event); };
      this.root.addEventListener('click', this.onGridClick);
      this.onProductsAdded = () => this.syncImageSizes();
      this.root.addEventListener('collection:products-added', this.onProductsAdded);
      window.addEventListener('resize', this.onProductsAdded);
      this.onChange = this.onChange.bind(this);
      this.onKey = this.onKey.bind(this);
      this.onHistory = () => { this.close(); this.load(new URL(location.href), false); };
      this.onOutside = (event) => { if (!this.contains(event.target)) this.close(); };
      this.onResize = () => { this.close(); this.syncPanels(); };
      this.onInput = (event) => {
        if (event.target.type !== 'number') return;
        clearTimeout(this.priceTimer);
        this.priceTimer = setTimeout(() => this.apply(), 600);
      };
      this.onSubmit = (event) => { event.preventDefault(); this.apply(); this.close(); };
      this.addEventListener('click', this.onClick);
      this.addEventListener('change', this.onChange);
      this.addEventListener('input', this.onInput);
      this.addEventListener('submit', this.onSubmit);
      this.addEventListener('keydown', this.onKey);
      document.addEventListener('click', this.onOutside);
      window.addEventListener('popstate', this.onHistory);
      this.mobile.addEventListener('change', this.onResize);
      this.syncPanels();
      const initialUrl = new URL(location.href);
      if (initialUrl.searchParams.get('discount_sort') === '1') {
        this.load(initialUrl, false);
      } else if (this.querySelector('.cf-sort-form') && !this.querySelector('.cf-sort-form input:checked')) {
        initialUrl.searchParams.set('sort_by', 'manual');
        this.load(initialUrl, false);
      }
    }
    disconnectedCallback() {
      this.controller?.abort();
      this.root.removeEventListener('click', this.onGridClick);
      this.root.removeEventListener('collection:products-added', this.onProductsAdded);
      window.removeEventListener('resize', this.onProductsAdded);
      clearTimeout(this.priceTimer);
      this.close();
      this.removeEventListener('click', this.onClick);
      this.removeEventListener('change', this.onChange);
      this.removeEventListener('input', this.onInput);
      this.removeEventListener('submit', this.onSubmit);
      this.removeEventListener('keydown', this.onKey);
      document.removeEventListener('click', this.onOutside);
      window.removeEventListener('popstate', this.onHistory);
      this.mobile.removeEventListener('change', this.onResize);
    }
    syncPanels() {
      // Mobile sheets sit outside the sticky toolbar's stacking context.
      const sortPanel = this.querySelector('[data-panel="sort"]');
      const sortParent = this.mobile.matches ? this : this.querySelector('.cf-toolbar');
      if (sortPanel && sortParent && sortPanel.parentElement !== sortParent) {
        const next = this.mobile.matches ? null : this.querySelector('.cf-filter-toggle');
        sortParent.insertBefore(sortPanel, next);
      }
      this.querySelectorAll('[data-panel]').forEach(panel => {
        const opened = this.dataset.openPanel === panel.dataset.panel;
        panel.inert = !opened && (this.mobile.matches || panel.dataset.panel === 'sort');
        if (this.mobile.matches && opened) {
          panel.setAttribute('role', 'dialog');
          panel.setAttribute('aria-modal', 'true');
        } else {
          panel.removeAttribute('role');
          panel.removeAttribute('aria-modal');
        }
      });
      this.querySelectorAll('[data-open]').forEach(button => button.setAttribute('aria-expanded', this.dataset.openPanel === button.dataset.open));
    }
    open(name, trigger) {
      if (this.dataset.openPanel === name) return this.close();
      this.close(false);
      this.trigger = trigger;
      this.dataset.openPanel = name;
      if (this.mobile.matches) {
        this.oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      this.syncPanels();
      const panel = this.querySelector(`[data-panel="${name}"]`);
      const focusTarget = panel.querySelector('button, input, summary');
      focusTarget?.focus({ preventScroll: true });
      if (this.mobile.matches && name === 'sort') {
        // The sheet becomes visible after its opening transition starts.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (this.isConnected && this.mobile.matches && this.dataset.openPanel === name) {
            focusTarget?.focus({ preventScroll: true });
          }
        }));
      }
    }
    close(restoreFocus = true) {
      if (!this.dataset.openPanel) return;
      delete this.dataset.openPanel;
      if (this.oldOverflow !== undefined) {
        document.body.style.overflow = this.oldOverflow;
        this.oldOverflow = undefined;
      }
      this.syncPanels();
      if (restoreFocus) this.trigger?.focus({ preventScroll: true });
    }
    onKey(event) {
      if (!this.dataset.openPanel) return;
      if (event.key === 'Escape') { event.preventDefault(); this.close(); }
      if (event.key !== 'Tab') return;
      const panel = this.querySelector(`[data-panel="${this.dataset.openPanel}"]`);
      const items = [...panel.querySelectorAll('button, input, summary, a[href]')].filter(e => !e.disabled && e.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    setColumns(columns) {
      if (![2, 3, 4].includes(Number(columns))) return;
      this.root.style.setProperty('--collection-columns', columns);
      this.querySelectorAll('[data-columns]').forEach(button => {
        button.setAttribute('aria-pressed', Number(button.dataset.columns) === Number(columns));
      });
    }
    setMobileColumns(columns) {
      if (![1, 2].includes(Number(columns))) return;
      this.root.style.setProperty('--collection-mobile-columns', columns);
      this.querySelectorAll('button[data-mobile-columns]').forEach(button => {
        button.setAttribute('aria-pressed', Number(button.dataset.mobileColumns) === Number(columns));
      });
      this.syncImageSizes();
    }
    syncImageSizes() {
      this.root.querySelectorAll('#product-grid .card__media img').forEach(image => {
        if (!this.originalImageSizes.has(image)) this.originalImageSizes.set(image, image.getAttribute('sizes'));
        const original = this.originalImageSizes.get(image);
        const width = image.closest('.card__media').clientWidth;
        const sizes = this.mobile.matches && width > 0 ? `${width}px` : original;
        if (image.getAttribute('sizes') === sizes) return;
        if (sizes === null) image.removeAttribute('sizes');
        else image.setAttribute('sizes', sizes);
      });
    }
    onClick(event) {
      const mobileGridButton = event.target.closest('button[data-mobile-columns]');
      if (mobileGridButton) { this.setMobileColumns(mobileGridButton.dataset.mobileColumns); return; }
      const gridButton = event.target.closest('[data-columns]');
      if (gridButton) { this.setColumns(gridButton.dataset.columns); return; }
      const trigger = event.target.closest('[data-open]');
      if (trigger) return this.open(trigger.dataset.open, trigger);
      if (event.target.closest('[data-close]')) return this.close();
      if (event.target.closest('[data-clear]')) {
        const url = new URL(this.dataset.url, location.origin);
        url.searchParams.set('sort_by', this.querySelector('[name="sort_by"]:checked')?.value || this.querySelector('.cf-filter-form [name="sort_by"]').value);
        return this.load(url);
      }
      const remove = event.target.closest('[data-remove]');
      if (remove) {
        event.preventDefault();
        const url = new URL(remove.href);
        if (this.discountSort) url.searchParams.set('discount_sort', '1');
        return this.load(url);
      }
      if (event.target.closest('[data-retry]')) this.load(this.pendingUrl);
    }
    onChange(event) {
      if (event.target.name === 'sort_by') {
        const hidden = this.querySelector('.cf-filter-form [name="sort_by"]');
        if (hidden) hidden.value = event.target.value;
        this.close();
      }
      this.apply();
    }
    apply() {
      clearTimeout(this.priceTimer);
      const form = this.querySelector('.cf-filter-form');
      if (form && !form.reportValidity()) return;
      const min = this.querySelector('#CollectionPriceMin');
      const max = this.querySelector('#CollectionPriceMax');
      if (min && max && min.value && max.value && +min.value > +max.value) {
        max.value = min.value;
      }
      const params = new URLSearchParams(form ? new FormData(form) : new FormData(this.querySelector('.cf-sort-form')));
      [...params].forEach(([key, value]) => { if (value === '') params.delete(key); });
      const url = new URL(this.dataset.url, location.origin);
      url.search = params.toString();
      this.load(url);
    }
    async load(url, history = true) {
      url = new URL(url);
      const discountSort = url.searchParams.get('sort_by') === 'discount-descending' || url.searchParams.get('discount_sort') === '1';
      if (discountSort) {
        url.searchParams.set('sort_by', 'price-descending');
        url.searchParams.set('discount_sort', '1');
        url.searchParams.delete('page');
      }
      this.controller?.abort();
      const controller = new AbortController();
      this.controller = controller;
      this.pendingUrl = url;
      this.root.setAttribute('aria-busy', 'true');
      this.querySelector('.cf-error').hidden = true;
      const request = new URL(url);
      request.searchParams.delete('discount_sort');
      request.searchParams.set('section_id', this.dataset.section);
      this.querySelector('.cf-sort-status').textContent = discountSort ? 'Sorting all matching products by discount…' : '';
      try {
        const response = await fetch(request, { signal: controller.signal });
        if (!response.ok) throw new Error('Collection request failed');
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (controller.signal.aborted) return;
        const next = doc.querySelector('collection-filters');
        const grid = doc.querySelector('#ProductGridContainer');
        if (!next || !grid) throw new Error('Collection content missing');
        let remainingCards = [];
        if (discountSort) {
          const cards = await CollectionDiscountSort.collect(doc, request, controller.signal);
          if (controller.signal.aborted || !this.isConnected) return;
          const productGrid = grid.querySelector('ul#product-grid');
          const loader = grid.querySelector('collection-load-more');
          if (productGrid) {
            const pageSize = loader ? Number(grid.dataset.pageSize) || 16 : cards.length;
            remainingCards = cards.slice(pageSize);
            productGrid.replaceChildren(...cards.slice(0, pageSize));
            grid.querySelector('.pagination-wrapper')?.remove();
            if (loader) {
              loader.querySelector('a')?.remove();
              if (remainingCards.length) {
                const link = doc.createElement('a');
                link.href = url.href;
                link.className = 'button button--secondary';
                link.textContent = 'Load more products';
                loader.prepend(link);
              }
            }
          }
        }
        const opened = [...this.querySelectorAll('.cf-group[open]')].map(el => el.id);
        const focused = this.contains(document.activeElement) ? document.activeElement.id : '';
        const body = this.querySelector('[data-filter-body]');
        const scroll = body?.scrollTop;
        if (body) {
          body.innerHTML = next.querySelector('[data-filter-body]').innerHTML;
          opened.forEach(id => { const el = document.getElementById(id); if (el) el.open = true; });
          body.scrollTop = scroll;
        }
        const newSort = next.querySelector('.cf-sort-form');
        if (newSort) this.querySelector('.cf-sort-form').innerHTML = newSort.innerHTML;
        const hiddenSort = this.querySelector('.cf-filter-form [name="sort_by"]');
        if (hiddenSort) hiddenSort.value = next.querySelector('.cf-filter-form [name="sort_by"]').value;
        this.querySelector('[data-count]').textContent = next.querySelector('[data-count]').textContent;
        const filterCount = this.querySelector('[data-filter-count]');
        if (filterCount) {
          const nextCount = next.querySelector('[data-filter-count]');
          filterCount.textContent = nextCount.textContent;
          filterCount.hidden = nextCount.hidden;
          this.querySelector('[data-filter-status]').textContent = next.querySelector('[data-filter-status]').textContent;
        }
        let modalOpenerId = '';
        document.querySelectorAll('body > quick-add-modal').forEach(modal => {
          if (modal.dataset.section !== this.dataset.section) return;
          if (modal.hasAttribute('open')) {
            modalOpenerId = modal.openedBy?.id || '';
            modal.hide(true);
          }
          modal.remove();
        });
        this.root.querySelector('#ProductGridContainer').innerHTML = grid.innerHTML;
        this.syncImageSizes();
        this.discountSort = discountSort;
        if (discountSort) {
          const radio = this.querySelector('[value="discount-descending"]');
          if (radio) radio.checked = true;
          if (hiddenSort) hiddenSort.value = 'discount-descending';
          const loader = this.root.querySelector('collection-load-more');
          if (loader) {
            loader.localCards = remainingCards;
            loader.localPageSize = Number(grid.dataset.pageSize) || 16;
          }
        }
        this.querySelector('.cf-sort-status').textContent = discountSort ? 'Products sorted by discount, highest first.' : '';
        this.root.querySelectorAll('.scroll-trigger').forEach(el => el.classList.add('scroll-trigger--cancel'));
        if (history) window.history.pushState({}, '', url);
        if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
        else if (modalOpenerId) {
          const replacement = document.getElementById(modalOpenerId) ||
            [...this.querySelectorAll('button')].find(button => button.getClientRects().length && !button.disabled);
          replacement?.focus({ preventScroll: true });
        }
        this.syncPanels();
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.querySelector('.cf-error').hidden = false;
          this.querySelector('.cf-sort-status').textContent = '';
        }
      } finally {
        if (this.controller === controller) this.root.removeAttribute('aria-busy');
      }
    }
  });
}
