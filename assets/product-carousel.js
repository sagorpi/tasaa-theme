if (!customElements.get('tasaa-product-carousel')) {
  customElements.define('tasaa-product-carousel', class extends HTMLElement {
    connectedCallback() {
      queueMicrotask(() => {
        this.track = this.querySelector('[data-carousel-track]');
        if (!this.track) return;
        this.abort?.abort();
        this.abort = new AbortController();
        const options = { signal: this.abort.signal };
        this.prev = this.querySelector('[data-carousel-prev]');
        this.next = this.querySelector('[data-carousel-next]');
        const move = (direction) => {
          const items = [...this.track.children];
          const current = items.findIndex(item => item.getBoundingClientRect().left >= this.track.getBoundingClientRect().left - 2);
          const target = items[Math.max(0, Math.min(items.length - 1, current + direction))];
          if (target) this.track.scrollBy({ left: target.getBoundingClientRect().left - this.track.getBoundingClientRect().left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        };
        this.prev.addEventListener('click', () => move(-1), options);
        this.next.addEventListener('click', () => move(1), options);
        this.track.addEventListener('scroll', () => this.update(), { ...options, passive: true });
        this.observer?.disconnect();
        this.observer = new ResizeObserver(() => this.update());
        this.observer.observe(this.track);
        this.update();
      });
    }
    update() {
      const max = this.track.scrollWidth - this.track.clientWidth;
      this.prev.disabled = this.track.scrollLeft <= 2;
      this.next.disabled = this.track.scrollLeft >= max - 2;
      this.querySelector('[data-carousel-controls]').hidden = max <= 2;
    }
    disconnectedCallback() { this.abort?.abort(); this.observer?.disconnect(); }
  });
}
