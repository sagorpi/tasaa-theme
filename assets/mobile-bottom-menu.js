if (!customElements.get('mobile-bottom-menu')) {
  customElements.define('mobile-bottom-menu', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const opts = { signal: this.controller.signal };
      this.mobile = matchMedia('(max-width: 989px)');
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-search-results]');
      this.status = this.querySelector('[data-search-status]');
      this.empty = this.querySelector('[data-search-empty]');
      this.cache = new Map();
      this.addEventListener('click', event => {
        const open = event.target.closest('[data-open]');
        if (open) this.openPanel(open.dataset.open, open);
        if (event.target.closest('[data-close]')) this.closePanel();
        if (event.target === this.panel) {
          const rect = this.panel.getBoundingClientRect();
          if (event.clientY < rect.top || event.clientY > rect.bottom) this.closePanel();
        }
        if (event.target.closest('[data-floating-cart]')) this.addProduct();
      }, opts);
      this.querySelectorAll('dialog').forEach(panel => panel.addEventListener('cancel', event => {
        event.preventDefault();
        this.closePanel();
      }, opts));
      this.input.addEventListener('input', () => this.search(), opts);
      this.input.form.addEventListener('reset', () => {
        this.input.value = '';
        this.search();
        this.input.focus();
      }, opts);
      this.mobile.addEventListener('change', () => { if (!this.mobile.matches) this.closePanel(true); }, opts);
      this.floating = this.querySelector('[data-floating-cart]');
      this.productInfo = document.querySelector('main product-info[data-update-url="true"]');
      if (this.floating && this.productInfo) {
        this.productObserver = new MutationObserver(() => this.syncProduct());
        this.productObserver.observe(this.productInfo, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'class', 'hidden'] });
        this.syncProduct();
      }
      if (typeof subscribe === 'function') {
        this.unsubscribe = subscribe(PUB_SUB_EVENTS.cartUpdate, () => this.updateCount());
      }
    }
    disconnectedCallback() {
      this.closePanel(true);
      this.controller?.abort();
      this.searchRequest?.abort();
      this.cartRequest?.abort();
      this.productObserver?.disconnect();
      this.unsubscribe?.();
      clearTimeout(this.searchTimer);
      clearTimeout(this.closeTimer);
    }
    openPanel(name, opener) {
      this.closePanel(true);
      this.opener = opener;
      this.panel = this.querySelector(`[data-panel="${name}"]`);
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.panel.showModal();
      opener.setAttribute('aria-expanded', 'true');
      // Flush the closed pose before starting the entrance transition.
      this.panel.getBoundingClientRect();
      this.panel.classList.add('is-open');
      if (name === 'search') this.input.focus();
    }
    closePanel(immediate = false) {
      if (!this.panel) return;
      clearTimeout(this.closeTimer);
      const panel = this.panel;
      const opener = this.opener;
      panel.classList.remove('is-open');
      opener?.setAttribute('aria-expanded', 'false');
      const finish = () => {
        panel.close();
        document.body.style.overflow = this.previousOverflow || '';
        this.panel = null;
        if (this.mobile.matches && this.isConnected) opener?.focus({ preventScroll: true });
      };
      if (immediate || matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
      else this.closeTimer = setTimeout(finish, 450);
    }
    search() {
      clearTimeout(this.searchTimer);
      this.searchRequest?.abort();
      const query = this.input.value.trim();
      this.results.replaceChildren();
      this.empty.hidden = !!query;
      this.status.textContent = query ? 'Finding products…' : '';
      if (!query) return;
      this.searchTimer = setTimeout(() => this.loadResults(query), 250);
    }
    async loadResults(query) {
      const request = new AbortController();
      this.searchRequest = request;
      try {
        let html = this.cache.get(query);
        if (!html) {
          const params = new URLSearchParams({ q: query, 'resources[type]': 'product,collection,query', 'resources[limit]': '6', section_id: 'mobile-search-results' });
          const response = await fetch(`${this.dataset.searchUrl}?${params}`, { signal: request.signal });
          if (!response.ok) throw new Error('Search unavailable');
          const page = new DOMParser().parseFromString(await response.text(), 'text/html');
          const section = page.querySelector('#shopify-section-mobile-search-results');
          if (!section) throw new Error('Search unavailable');
          html = section.innerHTML;
          if (this.cache.size >= 12) this.cache.delete(this.cache.keys().next().value);
          this.cache.set(query, html);
        }
        if (query !== this.input.value.trim() || request.signal.aborted) return;
        this.results.innerHTML = html;
        const count = this.results.querySelectorAll('.mobile-search-product').length;
        this.status.textContent = `${count} product suggestions.`;
      } catch (error) {
        if (error.name !== 'AbortError') this.status.textContent = 'Suggestions are unavailable. Press Search to see all results.';
      }
    }
    syncProduct() {
      const submit = this.productInfo.querySelector('product-form [type="submit"]');
      this.floating.hidden = !submit;
      if (!submit) return;
      const loading = submit.classList.contains('loading');
      this.floating.disabled = submit.disabled || submit.getAttribute('aria-disabled') === 'true';
      this.floating.setAttribute('aria-busy', String(loading));
      const label = loading ? 'Adding…' : submit.disabled ? submit.querySelector('span')?.textContent.trim() : window.variantStrings.addToCart;
      this.floating.querySelector('[data-floating-label]').textContent = !loading && !submit.disabled && this.floating.querySelector('svg') ? 'ADD TO' : label || window.variantStrings.unavailable;
      this.floating.setAttribute('aria-label', label || window.variantStrings.unavailable);
      const error = this.productInfo.querySelector('.product-form__error-message-wrapper:not([hidden]) .product-form__error-message');
      this.querySelector('[data-cart-status]').textContent = error?.textContent.trim() || '';
    }
    addProduct() {
      const submit = this.productInfo?.querySelector('product-form [type="submit"]');
      if (!submit || submit.disabled || submit.getAttribute('aria-disabled') === 'true') return;
      // Submit the original form: selected variant, quantity, properties and validation stay intact.
      submit.form.requestSubmit(submit);
    }
    async updateCount() {
      this.cartRequest?.abort();
      this.cartRequest = new AbortController();
      try {
        const response = await fetch(`${window.routes.cart_url}.js`, { signal: this.cartRequest.signal });
        if (!response.ok) return;
        const cart = await response.json();
        const badge = this.querySelector('[data-cart-count]');
        badge.textContent = cart.item_count;
        badge.hidden = cart.item_count === 0;
      } catch (_) { /* A later cart update or navigation will refresh the count. */ }
    }
  });
}
