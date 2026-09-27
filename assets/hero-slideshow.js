/* A fade carousel with independent mobile timing and no slider dependency. */
if (!customElements.get('hero-slideshow')) {
  customElements.define('hero-slideshow', class extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      this.track = this.querySelector('.hero-slideshow__track');
      this.slides = Array.from(this.querySelectorAll('.hero-slideshow__slide'));
      this.dots = Array.from(this.querySelectorAll('[data-slide]'));
      this.pauseButton = this.querySelector('[data-pause]');
      this.mobile = matchMedia('(max-width: 749px)');
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      this.pauses = new Set();
      this.current = 0;
      this.visible = false;
      this.userPaused = false;
      if (!this.slides.length) return;
      const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: this.controller.signal });
      this.querySelectorAll('[data-direction]').forEach(button => on(button, 'click', () => this.goTo(this.current + Number(button.dataset.direction))));
      this.dots.forEach(button => on(button, 'click', () => this.goTo(Number(button.dataset.slide))));
      if (this.pauseButton) on(this.pauseButton, 'click', () => {
        this.userPaused = !this.userPaused;
        this.updateTimer();
      });
      on(this, 'pointerenter', event => { if (event.pointerType === 'mouse') this.setPause('hover', true); });
      on(this, 'pointerleave', () => this.setPause('hover', false));
      on(this, 'focusin', () => this.setPause('focus', true));
      on(this, 'focusout', event => { if (!this.contains(event.relatedTarget)) this.setPause('focus', false); });
      on(document, 'visibilitychange', () => this.updateTimer());
      on(this.mobile, 'change', () => this.updateTimer());
      on(this.reducedMotion, 'change', () => this.updateTimer());
      on(this, 'keydown', event => {
        if (event.target.matches('input, select, textarea, [contenteditable]')) return;
        const rtl = getComputedStyle(this).direction === 'rtl';
        const steps = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 };
        if (event.key in steps) {
          event.preventDefault();
          this.goTo(this.current + steps[event.key]);
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          this.goTo(event.key === 'Home' ? 0 : this.slides.length - 1);
        }
      });
      on(this.track, 'dragstart', event => event.preventDefault());
      on(this.track, 'pointerdown', event => {
        if (this.dataset.swipe !== 'true' || !event.isPrimary || event.button !== 0 || event.target.closest('button, input, select, textarea')) return;
        this.gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
        this.setPause('gesture', true);
      });
      on(this.track, 'pointermove', event => {
        const gesture = this.gesture;
        if (!gesture || event.pointerId !== gesture.id) return;
        const x = event.clientX - gesture.x;
        const y = event.clientY - gesture.y;
        if (Math.abs(x) > 8 && Math.abs(x) > Math.abs(y)) {
          gesture.dragged = true;
          this.track.setPointerCapture(event.pointerId);
          this.track.dataset.dragging = 'true';
          event.preventDefault();
        }
      });
      on(window, 'pointerup', event => this.endGesture(event));
      on(window, 'pointercancel', event => this.endGesture(event, true));
      on(this.track, 'click', event => {
        if (Date.now() < this.suppressClickUntil) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, { capture: true });
      on(this, 'shopify:block:select', event => {
        const index = this.slides.indexOf(event.target.closest('.hero-slideshow__slide'));
        if (index < 0) return;
        this.setPause('editor', true);
        this.goTo(index);
      });
      on(this, 'shopify:block:deselect', () => this.setPause('editor', false));
      this.observer = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.updateTimer();
      }, { threshold: 0.1 });
      this.observer.observe(this);
      this.resizeObserver = new ResizeObserver(() => this.updateMediaHeight());
      this.slides.forEach(slide => this.resizeObserver.observe(slide.querySelector('.hero-slideshow__media')));
      this.dataset.ready = 'true';
      this.goTo(0);
    }

    goTo(index) {
      if (!this.slides?.length) return;
      this.current = (index + this.slides.length) % this.slides.length;
      this.slides.forEach((slide, i) => {
        const active = i === this.current;
        slide.classList.toggle('is-active', active);
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
        // Start loading the next slide ahead of its transition.
        if (active || i === (this.current + 1) % this.slides.length) {
          const image = slide.querySelector('img');
          if (image) image.loading = 'eager';
        }
      });
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === this.current);
        if (i === this.current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      const counter = this.querySelector('[data-current]');
      if (counter) counter.textContent = this.current + 1;
      this.updateMediaHeight();
      this.updateTimer();
    }

    updateMediaHeight() {
      const media = this.slides[this.current]?.querySelector('.hero-slideshow__media');
      if (media) this.style.setProperty('--hero-media-height', `${media.getBoundingClientRect().height}px`);
    }

    endGesture(event, cancelled = false) {
      const gesture = this.gesture;
      if (!gesture || event.pointerId !== gesture.id) return;
      this.gesture = null;
      delete this.track.dataset.dragging;
      if (this.track.hasPointerCapture(event.pointerId)) this.track.releasePointerCapture(event.pointerId);
      if (gesture.dragged) this.suppressClickUntil = Date.now() + 500;
      const delta = event.clientX - gesture.x;
      if (!cancelled && gesture.dragged && Math.abs(delta) >= 40) {
        const direction = getComputedStyle(this).direction === 'rtl' ? -1 : 1;
        this.goTo(this.current + (delta < 0 ? direction : -direction));
      }
      this.setPause('gesture', false);
    }

    setPause(reason, paused) {
      if (paused) this.pauses.add(reason);
      else this.pauses.delete(reason);
      this.updateTimer();
    }

    updateTimer() {
      clearTimeout(this.timer);
      const autoplay = (this.mobile.matches ? this.dataset.autoplayMobile : this.dataset.autoplay) === 'true';
      const allowed = autoplay && this.slides.length > 1 && !this.reducedMotion.matches;
      if (this.pauseButton) {
        this.pauseButton.hidden = !allowed;
        this.pauseButton.setAttribute('aria-label', this.userPaused ? this.pauseButton.dataset.labelPlay : this.pauseButton.dataset.labelPause);
        this.pauseButton.querySelector('[data-play-icon]').hidden = !this.userPaused;
        this.pauseButton.querySelector('[data-pause-icon]').hidden = this.userPaused;
      }
      const playing = allowed && !this.userPaused && !this.pauses.size && this.visible && !document.hidden;
      this.track.setAttribute('aria-live', playing ? 'off' : 'polite');
      if (!playing) return;
      const interval = Number(this.mobile.matches ? this.dataset.speedMobile : this.dataset.speed) || 5000;
      this.timer = setTimeout(() => this.goTo(this.current + 1), interval);
    }

    disconnectedCallback() {
      clearTimeout(this.timer);
      this.controller?.abort();
      this.controller = null;
      this.observer?.disconnect();
      this.resizeObserver?.disconnect();
    }
  });
}
