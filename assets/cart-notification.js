class CartNotification extends HTMLElement {
  constructor() {
    super();
    this.notification = this.querySelector('#cart-notification');
    this.announcement = this.querySelector('[data-cart-announcement]');
    this.notification.querySelector('button').addEventListener('click', () => this.close());
    this.notification.addEventListener('keydown', event => {
      if (event.key === 'Escape') this.close();
    });
    this.notification.addEventListener('pointerenter', () => this.pause());
    this.notification.addEventListener('pointerleave', () => this.resume());
    this.notification.addEventListener('focusin', () => this.pause());
    this.notification.addEventListener('focusout', () => queueMicrotask(() => this.resume()));
  }

  open() {
    clearTimeout(this.timer);
    this.started = null;
    this.notification.hidden = false;
    // Restart the countdown for successive additions, without stealing focus.
    this.notification.classList.remove('active');
    this.notification.getBoundingClientRect();
    this.notification.inert = false;
    this.notification.setAttribute('aria-hidden', 'false');
    this.notification.classList.add('active');
    this.announcement.textContent = '';
    clearTimeout(this.announcementTimer);
    this.announcementTimer = setTimeout(() => { this.announcement.textContent = 'Added to cart!'; }, 50);
    this.remaining = 3000;
    this.resume();
  }

  pause() {
    if (!this.started) return;
    this.remaining = Math.max(0, this.remaining - (performance.now() - this.started));
    this.started = null;
    clearTimeout(this.timer);
  }

  resume() {
    if (!this.notification.classList.contains('active') || this.notification.matches(':hover, :focus-within')) return;
    clearTimeout(this.timer);
    this.started = performance.now();
    this.timer = setTimeout(() => this.close(), this.remaining);
  }

  close() {
    clearTimeout(this.timer);
    clearTimeout(this.announcementTimer);
    this.started = null;
    if (this.notification.contains(document.activeElement)) this.activeElement?.focus({ preventScroll: true });
    this.notification.classList.remove('active');
    this.notification.inert = true;
    this.notification.setAttribute('aria-hidden', 'true');
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
    clearTimeout(this.announcementTimer);
  }

  renderContents(parsedState) {
    this.getSectionsToRender().forEach(section => {
      const target = document.getElementById(section.id);
      const content = new DOMParser().parseFromString(parsedState.sections[section.id], 'text/html').querySelector('.shopify-section');
      if (target && content) target.innerHTML = content.innerHTML;
    });
    this.open();
  }

  getSectionsToRender() {
    return [{ id: 'cart-icon-bubble' }];
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}
customElements.define('cart-notification', CartNotification);
