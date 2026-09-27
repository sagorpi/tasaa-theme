/* Suta-style disclosure timing, retaining native links and keyboard access. */
(() => {
  const controllers = new WeakMap();
  function connect(root) {
    const header = root.querySelector('.store-navigation');
    if (!header || controllers.has(header)) return;
    const controller = new AbortController();
    controllers.set(header, controller);
    const options = { signal: controller.signal };
    const desktop = matchMedia('(min-width: 990px) and (hover: hover)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const menus = [...header.querySelectorAll('.header__inline-menu header-menu')];
    const states = new Map();
    const cancel = state => {
      clearTimeout(state.timer);
      state.animations.forEach(animation => animation.cancel());
      state.animations = [];
      state.version++;
    };
    const close = menu => {
      const state = states.get(menu);
      if (!state.expanded) return;
      cancel(state);
      state.expanded = false;
      state.summary.setAttribute('aria-expanded', 'false');
      const version = state.version;
      const animation = state.content.animate({ opacity: [getComputedStyle(state.content).opacity, 0] }, { duration: reduced.matches ? 0 : 400, easing: 'ease', fill: 'both' });
      state.animations.push(animation);
      animation.finished.then(() => {
        if (state.version !== version) return;
        state.details.open = false;
        animation.cancel();
      }).catch(() => {});
    };
    const open = menu => {
      const state = states.get(menu);
      clearTimeout(state.timer);
      if (state.expanded) return;
      menus.filter(other => other !== menu).forEach(close);
      cancel(state);
      state.expanded = true;
      state.details.open = true;
      state.summary.setAttribute('aria-expanded', 'true');
      state.animations.push(state.content.animate({ opacity: [0, 1] }, { duration: reduced.matches ? 0 : 250, easing: 'ease', fill: 'both' }));
      const items = state.content.querySelectorAll(':scope > li, .mega-menu__list > li');
      items.forEach((item, index) => state.animations.push(item.animate(
        { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0)'] },
        { duration: reduced.matches ? 0 : 150, delay: reduced.matches ? 0 : 100 + index * 100, easing: 'ease', fill: 'both' }
      )));
    };
    menus.forEach(menu => {
      const details = menu.querySelector('details');
      const summary = details.querySelector('summary');
      states.set(menu, { details, summary, content: summary.nextElementSibling, expanded: false, animations: [], version: 0 });
      // Dawn's focus-out handler calls this method; use the same animated close.
      menu.close = () => close(menu);
      summary.addEventListener('click', event => {
        event.preventDefault();
        states.get(menu).expanded ? close(menu) : open(menu);
      }, options);
      menu.addEventListener('pointerenter', event => {
        if (desktop.matches && event.pointerType === 'mouse') open(menu);
      }, options);
      menu.addEventListener('pointerleave', () => {
        if (desktop.matches) states.get(menu).timer = setTimeout(() => close(menu), 250);
      }, options);
      menu.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        event.stopPropagation();
        close(menu);
        summary.focus();
      }, options);
    });
    document.addEventListener('click', event => menus.filter(menu => !menu.contains(event.target)).forEach(close), options);
    desktop.addEventListener('change', () => menus.forEach(close), options);
    controller.signal.addEventListener('abort', () => states.forEach(cancel), { once: true });
    header.querySelectorAll('.menu-drawer__menu > li').forEach((item, index) => item.style.setProperty('--menu-item-index', index));
  }
  connect(document);
  document.addEventListener('shopify:section:load', event => connect(event.target));
  document.addEventListener('shopify:section:unload', event => {
    const header = event.target.querySelector('.store-navigation');
    controllers.get(header)?.abort();
    if (header) controllers.delete(header);
  });
})();
