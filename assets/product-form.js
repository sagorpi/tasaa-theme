// Preserve the original product fields while adding priced variants as nested cart lines.
function prepareProductAddonData(formData, selectedAddons, groupId) {
  if (!selectedAddons.length) return formData;
  const parentId = formData.get('id');
  const quantity = Math.max(1, parseInt(formData.get('quantity'), 10) || 1);
  if (selectedAddons.some((addon) => !addon.id || String(addon.id) === String(parentId))) {
    throw new Error('This add-on is not available for the selected product. Please uncheck it and try again.');
  }
  const result = new FormData();
  for (const [key, value] of formData.entries()) {
    if (key === 'id' || key === 'quantity' || key === 'selling_plan' || key.startsWith('properties[')) {
      const itemKey = key.startsWith('properties[')
        ? `items[0][properties]${key.slice('properties'.length)}`
        : `items[0][${key}]`;
      result.append(itemKey, value);
    } else {
      result.append(key, value);
    }
  }
  result.set('items[0][quantity]', quantity);
  // Distinguish separate customisations of the same saree in the cart.
  result.set('items[0][properties][_addon_group]', groupId);
  selectedAddons.forEach((addon, index) => {
    const prefix = `items[${index + 1}]`;
    result.append(`${prefix}[id]`, addon.id);
    result.append(`${prefix}[quantity]`, quantity);
    result.append(`${prefix}[parent_id]`, parentId);
    result.append(`${prefix}[properties][Service]`, addon.label);
    result.append(`${prefix}[properties][_addon_group]`, groupId);
  });
  return result;
}

if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.disabled || this.submitButton.getAttribute('aria-disabled') === 'true') return;
        const checkout = evt.submitter?.hasAttribute('data-addon-checkout');
        const checkoutButton = this.querySelector('[data-addon-checkout]');
        this.error = false;

        this.handleErrorMessage();

        if (checkoutButton) checkoutButton.disabled = true;
        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        try {
          const addons = Array.from(this.form.querySelectorAll('[data-addon-variant]:checked:not(:disabled)'))
            .map((input) => ({ id: input.dataset.addonVariant, label: input.dataset.addonLabel }));
          config.body = prepareProductAddonData(formData, addons, window.crypto.randomUUID());
        } catch (error) {
          this.handleErrorMessage(error.message);
          this.submitButton.removeAttribute('aria-disabled');
          this.submitButton.classList.remove('loading');
          this.querySelector('.loading__spinner').classList.add('hidden');
          if (checkoutButton) checkoutButton.disabled = this.submitButton.disabled;
          return;
        }

        const variantId = formData.get('id');
        const quantity = parseInt(formData.get('quantity')) || 1;
        const linesUpdateDeferred = this.createCartLinesUpdateEvent(variantId, quantity);

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              this.error = true;
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: variantId,
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);
              this.dispatchCartErrorEvent(response.description || response.message, 'INVALID');
              linesUpdateDeferred?.reject(new Error(response.description || response.message));

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (checkout) {
              this.resolveCartLinesUpdate(linesUpdateDeferred);
              window.location.assign(`${window.Shopify?.routes?.root || '/'}checkout`);
              return;
            } else if (!this.cart) {
              this.resolveCartLinesUpdate(linesUpdateDeferred);
              window.location = window.routes.cart_url;
              return;
            }

            this.resolveCartLinesUpdate(linesUpdateDeferred);

            const startMarker = CartPerformance.createStartingMarker('add:wait-for-subscribers');
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: variantId,
                cartData: response,
              }).then(() => {
                CartPerformance.measureFromMarker('add:wait-for-subscribers', startMarker);
              });
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    CartPerformance.measure("add:paint-updated-sections", () => {
                      this.cart.renderContents(response.items ? { ...response, key: response.items[0].key, id: response.items[0].id } : response);
                    });
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              CartPerformance.measure("add:paint-updated-sections", () => {
                this.cart.renderContents(response.items ? { ...response, key: response.items[0].key, id: response.items[0].id } : response);
              });
            }
          })
          .catch((e) => {
            console.error(e);
            this.handleErrorMessage('Unable to confirm the cart update. Please check your cart before trying again.');
            this.dispatchCartErrorEvent(e.message || 'Network error', 'SERVICE_UNAVAILABLE');
            linesUpdateDeferred?.reject(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            this.submitButton.removeAttribute('aria-disabled');
            if (checkoutButton) checkoutButton.disabled = this.submitButton.disabled;
            this.querySelector('.loading__spinner').classList.add('hidden');

            CartPerformance.measureFromEvent("add:user-action", evt);
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        const checkoutButton = this.querySelector('[data-addon-checkout]');
        if (checkoutButton) checkoutButton.disabled = disable;
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      createCartLinesUpdateEvent(variantId, quantity) {
        const { CartLinesUpdateEvent } = window.StandardEvents || {};
        if (!CartLinesUpdateEvent) return null;

        const deferred = CartLinesUpdateEvent.createPromise();
        this.dispatchEvent(
          new CartLinesUpdateEvent({
            action: 'add',
            context: 'product',
            lines: [{ merchandiseId: variantId, quantity }],
            promise: deferred.promise,
          })
        );
        return deferred;
      }

      resolveCartLinesUpdate(deferred) {
        if (!deferred) return;
        const { CartLinesUpdateEvent } = window.StandardEvents || {};
        if (!CartLinesUpdateEvent) return;

        const pendingCartDataPromise = typeof CartItems !== 'undefined'
          ? CartItems.fetchCartData()
          : fetch(`${routes.cart_url}.json`).then((response) => response.json());

        pendingCartDataPromise
          .then((cart) => {
            if (!cart?.currency) return deferred.reject(new Error('Missing currency in cart response'));
            deferred.resolve({ cart: CartLinesUpdateEvent.createCartFromAjaxResponse(cart) });
          })
          .catch((e) => deferred.reject(e));
      }

      dispatchCartErrorEvent(message, code) {
        const { CartErrorEvent } = window.StandardEvents || {};
        if (!CartErrorEvent) return;
        this.dispatchEvent(new CartErrorEvent({ error: message, code }));
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}
