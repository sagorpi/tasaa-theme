if (!customElements.get('image-link-scroll')) {
  customElements.define('image-link-scroll', class extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const on = (target, event, callback, options = {}) => target.addEventListener(event, callback, { ...options, signal: this.controller.signal });
      this.track = this.querySelector('.image-links__track');
      this.items = [...this.querySelectorAll('.image-links__item')];
      this.buttons = [...this.querySelectorAll('[data-step]')];
      this.controls = this.querySelector('.image-links__controls');
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
      this.buttons.forEach(button => on(button, 'click', () => this.move(Number(button.dataset.step))));
      on(this.track, 'scroll', () => this.update(), { passive: true });
      on(this.track, 'keydown', event => {
        const rtl = getComputedStyle(this).direction === 'rtl';
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') this.scrollTo(0);
        else if (event.key === 'End') this.scrollTo(this.track.scrollWidth);
        else this.move((event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1));
      });
      // Touch and trackpad use native scrolling. Add direct dragging for a mouse.
      on(this.track, 'pointerdown', event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        this.drag = { id: event.pointerId, x: event.clientX, scroll: this.track.scrollLeft, moved: false };
      });
      on(this.track, 'pointermove', event => {
        if (!this.drag || event.pointerId !== this.drag.id) return;
        const delta = event.clientX - this.drag.x;
        if (Math.abs(delta) < 5 && !this.drag.moved) return;
        this.drag.moved = true;
        this.track.dataset.dragging = 'true';
        this.track.setPointerCapture(event.pointerId);
        this.track.scrollLeft = this.drag.scroll - delta;
        event.preventDefault();
      });
      const release = event => {
        if (!this.drag || event.pointerId !== this.drag.id) return;
        if (this.drag.moved) this.suppressClickUntil = Date.now() + 400;
        if (this.track.hasPointerCapture(event.pointerId)) this.track.releasePointerCapture(event.pointerId);
        delete this.track.dataset.dragging;
        this.drag = null;
      };
      on(window, 'pointerup', release);
      on(window, 'pointercancel', release);
      on(this.track, 'dragstart', event => event.preventDefault());
      on(this.track, 'click', event => {
        if (Date.now() < this.suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
      }, { capture: true });
      on(this, 'shopify:block:select', event => {
        const item = event.target.closest('.image-links__item');
        if (item) this.scrollTo(this.items.indexOf(item) * this.step());
      });
      this.observer = new ResizeObserver(() => this.update());
      this.observer.observe(this.track);
      this.update();
    }
    step() {
      return (this.items[0]?.getBoundingClientRect().width || 0) + (parseFloat(getComputedStyle(this.track).columnGap) || 0);
    }
    move(direction) { this.scrollTo(Math.abs(this.track.scrollLeft) + direction * this.step()); }
    scrollTo(position) {
      const max = Math.max(0, this.track.scrollWidth - this.track.clientWidth);
      const target = Math.min(max, Math.max(0, position));
      this.track.scrollTo({ left: target * (getComputedStyle(this).direction === 'rtl' ? -1 : 1), behavior: this.reduced.matches ? 'auto' : 'smooth' });
    }
    update() {
      const max = this.track.scrollWidth - this.track.clientWidth;
      const position = Math.abs(this.track.scrollLeft);
      if (this.controls) this.controls.hidden = max <= 1;
      this.buttons.forEach(button => { button.disabled = Number(button.dataset.step) < 0 ? position <= 1 : position >= max - 1; });
    }
    disconnectedCallback() { this.controller?.abort(); this.controller = null; this.observer?.disconnect(); }
  });
}
