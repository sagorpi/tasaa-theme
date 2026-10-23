if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
        this.content = this.querySelector('[role="document"]');
        this.dialog = this.querySelector('dialog');
        this.dialog.addEventListener('cancel', (event) => {
          event.preventDefault();
          this.hide();
        });
        this.zoomButton = this.querySelector('[data-gallery-zoom]');
        this.pointers = new Map();
        this.onResize = () => this.hasAttribute('open') && this.fitImage();
        this.querySelector('[data-gallery-previous]').addEventListener('click', () => this.navigate(-1));
        this.querySelector('[data-gallery-next]').addEventListener('click', () => this.navigate(1));
        this.zoomButton.addEventListener('click', () => this.toggleZoom());
        this.addEventListener('keydown', (event) => {
          if (event.target.closest('deferred-media, product-model')) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            this.navigate(event.key === 'ArrowLeft' ? -1 : 1);
          }
        });
        this.content.addEventListener('click', (event) => {
          if (this.suppressClick) { this.suppressClick = false; return; }
          if (this.isImage && (event.target === this.activeMedia || (event.target === this.content && this.clickedImage))) {
            this.toggleZoom();
          } else if (event.target === this.content) {
            this.hide();
          }
        });
        this.content.addEventListener('dragstart', (event) => {
          if (this.isImage) event.preventDefault();
        });
        this.content.addEventListener('pointerdown', (event) => this.pointerDown(event));
        this.content.addEventListener('pointermove', (event) => this.pointerMove(event));
        this.content.addEventListener('pointerup', (event) => this.pointerEnd(event));
        this.content.addEventListener('pointercancel', (event) => this.pointerEnd(event, true));
      }

      connectedCallback() {
        super.connectedCallback();
        window.addEventListener('resize', this.onResize);
      }

      disconnectedCallback() {
        window.removeEventListener('resize', this.onResize);
      }

      show(opener) {
        this.suppressClick = false;
        this.clickedImage = false;
        super.show(opener);
        this.dialog.showModal();
        this.dialog.focus({ preventScroll: true });
        this.items = Array.from(this.content.children).filter((item) => item.hasAttribute('data-media-id'));
        const mediaId = opener.getAttribute('data-media-id');
        this.index = Math.max(0, this.items.findIndex((item) => item.dataset.mediaId === mediaId));
        this.querySelectorAll('[data-gallery-previous], [data-gallery-next]').forEach((button) => {
          button.hidden = this.items.length < 2;
        });
        this.showActiveMedia();
      }

      hide() {
        if (!this.hasAttribute('open')) return;
        this.pointers.clear();
        this.animation?.cancel();
        this.dialog.close();
        super.hide();
      }

      navigate(direction) {
        if (this.items.length < 2) return;
        this.index = (this.index + direction + this.items.length) % this.items.length;
        this.showActiveMedia(direction);
      }

      showActiveMedia(direction = 0) {
        this.animation?.cancel();
        window.pauseAllMedia();
        this.items.forEach((item, index) => {
          item.classList.toggle('active', index === this.index);
          item.setAttribute('aria-hidden', index === this.index ? 'false' : 'true');
        });
        this.activeMedia = this.items[this.index];
        this.isImage = this.activeMedia?.tagName === 'IMG';
        this.classList.toggle('is-image', this.isImage);
        this.zoomButton.hidden = !this.isImage;
        this.pointers.clear();
        this.fitImage();
        if (this.isImage) {
          if (direction && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.animation = this.activeMedia.animate([
              { transform: `translate(calc(-50% + ${direction * 60}px), -50%)`, opacity: 0 },
              { transform: 'translate(-50%, -50%)', opacity: 1 },
            ], { duration: 260, easing: 'ease-out' });
          }
        } else if (this.activeMedia?.matches('deferred-media')) {
          this.activeMedia.loadContent();
        }
        this.querySelector('[data-gallery-status]').textContent = `${this.index + 1} / ${this.items.length}`;
      }

      fitImage() {
        this.scale = 1;
        this.panX = this.panY = 0;
        if (this.isImage) {
          const image = this.activeMedia;
          const ratio = Number(image.getAttribute('width')) / Number(image.getAttribute('height'));
          this.baseWidth = Math.min(this.content.clientWidth, this.content.clientHeight * ratio);
          this.baseHeight = this.baseWidth / ratio;
          image.style.width = `${this.baseWidth}px`;
          image.style.height = `${this.baseHeight}px`;
          image.sizes = `${Math.ceil(this.baseWidth * 2)}px`;
        }
        this.applyZoom();
      }

      applyZoom() {
        const zoomed = this.isImage && this.scale > 1.01;
        this.classList.toggle('is-zoomed', zoomed);
        this.zoomButton.setAttribute('aria-pressed', String(zoomed));
        this.zoomButton.setAttribute('aria-label', zoomed ? 'Zoom out' : 'Zoom in');
        if (!this.isImage) return;
        const limitX = Math.max(0, (this.baseWidth * this.scale - this.content.clientWidth) / 2);
        const limitY = Math.max(0, (this.baseHeight * this.scale - this.content.clientHeight) / 2);
        this.panX = Math.max(-limitX, Math.min(limitX, this.panX));
        this.panY = Math.max(-limitY, Math.min(limitY, this.panY));
        this.activeMedia.style.transform = `translate(-50%, -50%) translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
      }

      toggleZoom() {
        if (!this.isImage) return;
        this.animation?.cancel();
        const previousTransform = this.activeMedia.style.transform;
        this.scale = this.scale > 1.01 ? 1 : 2;
        this.panX = this.panY = 0;
        this.applyZoom();
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
          this.animation = this.activeMedia.animate([
            { transform: previousTransform },
            { transform: this.activeMedia.style.transform },
          ], { duration: 220, easing: 'ease-out' });
        }
      }

      pointerDown(event) {
        this.clickedImage = event.target === this.activeMedia;
        if (!this.isImage || event.button !== 0) return;
        this.animation?.cancel();
        this.content.setPointerCapture(event.pointerId);
        this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (this.pointers.size === 1) {
          this.suppressClick = false;
          this.gesture = { x: event.clientX, y: event.clientY, panX: this.panX, panY: this.panY, scale: this.scale };
        } else if (this.pointers.size === 2) {
          const [a, b] = [...this.pointers.values()];
          this.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
          this.pinchScale = this.scale;
          this.suppressClick = true;
        }
      }

      pointerMove(event) {
        if (!this.pointers.has(event.pointerId)) return;
        this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const dx = event.clientX - this.gesture.x;
        const dy = event.clientY - this.gesture.y;
        if (Math.hypot(dx, dy) > 8) this.suppressClick = true;
        if (this.pointers.size === 2) {
          const [a, b] = [...this.pointers.values()];
          this.scale = Math.min(2.5, Math.max(1, this.pinchScale * Math.hypot(a.x - b.x, a.y - b.y) / (this.pinchDistance || 1)));
          this.applyZoom();
        } else if (this.gesture.scale > 1.01) {
          this.panX = this.gesture.panX + dx;
          this.panY = this.gesture.panY + dy;
          this.applyZoom();
        }
      }

      pointerEnd(event, cancelled = false) {
        if (!this.pointers.has(event.pointerId)) return;
        const wasPinching = this.pointers.size > 1;
        this.pointers.delete(event.pointerId);
        if (this.pointers.size) {
          const [point] = this.pointers.values();
          this.gesture = { ...point, panX: this.panX, panY: this.panY, scale: this.scale, pinched: true };
          return;
        }
        const dx = event.clientX - this.gesture.x;
        const dy = event.clientY - this.gesture.y;
        if (!cancelled && !wasPinching && !this.gesture.pinched && this.gesture.scale === 1 && this.scale === 1 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          this.suppressClick = true;
          this.navigate(dx < 0 ? 1 : -1);
        }
      }
    }
  );
}
