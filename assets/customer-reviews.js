/* Progressive enhancement: Judge.me remains the source of genuine reviews. */
(() => {
  const mounted = new WeakSet();
  const modalReviewCache = new WeakMap();
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    el.className = className;
    if (text) el.textContent = text;
    return el;
  };
  const text = (el, selector) => el.querySelector(selector)?.textContent.trim() || '';
  const button = (label, className, action) => {
    const el = make('button', className, label);
    el.type = 'button';
    el.addEventListener('click', action);
    return el;
  };
  function mount(root) {
    if (mounted.has(root)) return;
    mounted.add(root);
    const photoLabel = root.hasAttribute('data-sample-reviews') ? 'Sample catalogue photo' : 'Customer photo';
    root.querySelector('[data-sample-review-sort]')?.addEventListener('change', event => {
      const list = root.querySelector('.jdgm-review-list');
      const cards = [...list.children];
      const sort = event.target.value;
      cards.sort((a, b) => sort === 'highest'
        ? Number(b.dataset.sampleRating) - Number(a.dataset.sampleRating)
        : sort === 'lowest'
          ? Number(a.dataset.sampleRating) - Number(b.dataset.sampleRating)
          : Number(a.dataset.sampleOrder) - Number(b.dataset.sampleOrder));
      list.append(...cards);
    });
    let signature = '';
    let preview;
    let back;
    let timer;
    const tabletGallery = matchMedia('(min-width: 750px)');
    const desktopGallery = matchMedia('(min-width: 990px)');
    const expand = () => {
      root.classList.add('tasaa-reviews--all');
      back.hidden = false;
      back.focus({ preventScroll: true });
      root.scrollIntoView({ block: 'start' });
    };
    const render = () => {
      const widget = root.querySelector('.jm-review-widget');
      const source = [...root.querySelectorAll('.jm-review-item')];
      if (!widget || !source.length) return; // Empty/unsupported widgets keep their native UI.
      const reviews = readModalReviews(root);
      // Keep each attachment with its owner, even when reviews reuse an image URL.
      const photos = reviews.flatMap(review => review.photos.map(photo => ({ ...photo, review })));
      const photoKey = value => { const url = new URL(value, location.href); return url.origin + url.pathname; };
      const seen = new Set(photos.map(photo => photoKey(photo.full)));
      root.querySelectorAll('.jm-media-grid img').forEach(img => {
        try {
          const url = new URL(img.currentSrc || img.src, location.href);
          if (!['https:', 'http:'].includes(url.protocol) || seen.has(photoKey(url.href))) return;
          seen.add(photoKey(url.href));
          url.searchParams.set('width', '1200');
          // Gallery-only media has no trustworthy author until its review is loaded.
          photos.push({ thumb: img.src, full: url.href });
        } catch (_) { /* Ignore incomplete media while the widget loads. */ }
      });
      const heading = text(widget, '.jm-review-widget-minimal-header__title') || 'Customer Reviews';
      const summary = [...widget.querySelectorAll('.jm-average-rating-display p')].map(el => el.textContent.trim()).filter(Boolean).join(' · ');
      const galleryLimit = desktopGallery.matches ? 9 : tabletGallery.matches ? 7 : 5;
      const nextSignature = JSON.stringify({ reviews, photos, heading, summary, galleryLimit });
      if (nextSignature === signature && preview?.isConnected) return;
      signature = nextSignature;
      preview?.remove();
      back?.remove();
      preview = make('div', 'tasaa-reviews-preview');
      const header = make('div', 'tasaa-reviews-preview__header');
      const intro = make('div', '');
      intro.append(make('h2', 'tasaa-reviews-preview__heading', heading));
      if (summary) intro.append(make('p', 'tasaa-reviews-preview__summary', summary.replace(/\s+/g, ' ')));
      header.append(intro);
      const write = widget.querySelector('[data-testid="write-review-button"]');
      if (write) header.append(button('Write a review', 'tasaa-reviews-preview__write', () => { expand(); write.click(); }));
      preview.append(header);
      if (photos.length) {
        const gallery = make('div', 'tasaa-review-gallery');
        const visiblePhotos = Math.min(photos.length, galleryLimit);
        gallery.dataset.count = visiblePhotos;
        gallery.style.setProperty('--review-gallery-columns', Math.max(1, Math.ceil((visiblePhotos - 1) / 2)));
        photos.slice(0, visiblePhotos).forEach((photo, index) => {
          const tile = button('', 'tasaa-review-gallery__tile', () => openGallery(photos, index, tile, photoLabel));
          tile.setAttribute('aria-label', `View ${photoLabel.toLowerCase()} ${index + 1} of ${photos.length}`);
          const img = make('img', '');
          img.src = photo.thumb;
          img.alt = `${photoLabel} ${index + 1}`;
          img.loading = 'lazy';
          tile.append(img);
          if (index === visiblePhotos - 1 && photos.length > visiblePhotos) {
            tile.append(make('span', 'tasaa-review-gallery__more', `+${photos.length - visiblePhotos}`));
            tile.setAttribute('aria-label', `View photo gallery, ${photos.length - visiblePhotos} more photos`);
          }
          gallery.append(tile);
        });
        preview.append(gallery);
      }
      const track = make('div', 'tasaa-review-slider');
      track.tabIndex = 0;
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Customer reviews carousel');
      reviews.forEach(review => {
        const card = make('article', 'tasaa-review-card');
        const top = make('div', 'tasaa-review-card__top');
        if (review.score) {
          const filled = Math.max(0, Math.min(5, Math.round(Number(review.score) || 0)));
          const rating = make('span', 'tasaa-review-card__rating');
          rating.setAttribute('role', 'img');
          rating.setAttribute('aria-label', `${review.score} out of 5 stars`);
          const star = make('span', '', '★'.repeat(filled) + '☆'.repeat(5 - filled));
          star.setAttribute('aria-hidden', 'true');
          rating.append(star);
          top.append(rating);
        }
        if (review.title) top.append(make('h3', 'tasaa-review-card__title', review.title));
        if (review.date) top.append(make('span', 'tasaa-review-card__date', review.date));
        card.append(top);
        if (review.body) card.append(make('p', 'tasaa-review-card__body', review.body));
        const footer = make('div', 'tasaa-review-card__footer');
        if (review.name) footer.append(make('span', '', review.name));
        if (review.verified) footer.append(make('span', 'tasaa-review-card__verified', review.verified));
        card.append(footer);
        track.append(card);
      });
      const step = direction => track.scrollBy({ left: direction * (track.firstElementChild.getBoundingClientRect().width + 12), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      track.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
      });
      preview.append(track);
      if (reviews.length > 1) {
        const controls = make('div', 'tasaa-review-slider__controls');
        controls.append(button('←', '', () => step(-1)), button('→', '', () => step(1)));
        controls.children[0].setAttribute('aria-label', 'Previous reviews');
        controls.children[1].setAttribute('aria-label', 'Next reviews');
        preview.append(controls);
      }
      const show = button('Show all reviews', 'tasaa-reviews-show-all', () => {
        openReviewModal(root, show, photoLabel);
      });
      show.setAttribute('aria-haspopup', 'dialog');
      const chevron = make('span', '', '›');
      chevron.setAttribute('aria-hidden', 'true');
      show.append(chevron);
      preview.append(show);
      back = button('‹ Back to review highlights', 'tasaa-reviews-back', () => {
        root.classList.remove('tasaa-reviews--all');
        back.hidden = true;
        show.focus({ preventScroll: true });
        root.scrollIntoView({ block: 'start' });
      });
      back.hidden = !root.classList.contains('tasaa-reviews--all');
      widget.before(preview, back);
      root.classList.add('tasaa-reviews-enhanced');
    };
    new MutationObserver(mutations => {
      if (mutations.every(m => m.target.closest?.('.tasaa-reviews-preview, .tasaa-reviews-back'))) return;
      clearTimeout(timer);
      timer = setTimeout(render, 100);
    }).observe(root, { childList: true, subtree: true, characterData: true });
    const resizeGallery = () => {
      if (root.isConnected) render();
      else {
        tabletGallery.removeEventListener('change', resizeGallery);
        desktopGallery.removeEventListener('change', resizeGallery);
      }
    };
    tabletGallery.addEventListener('change', resizeGallery);
    desktopGallery.addEventListener('change', resizeGallery);
    render();
  }
  function readModalReviews(root) {
    return [...root.querySelectorAll('.jm-review-item')].map(el => {
      const body = el.querySelector('.jdgm-review-content__body-content, .jm-review-content__body');
      const paragraphs = body ? [...body.querySelectorAll('p')] : [];
      const review = {
        score: Number(el.querySelector('.jm-star-rating')?.getAttribute('aria-label')?.match(/[\d.]+/)?.[0]) || 0,
        title: text(el, '.jm-review-content__title'),
        body: paragraphs.length ? paragraphs.map(p => p.textContent.trim()).join('\n\n') : body?.textContent.trim() || '',
        name: text(el, '.jm-reviewer-info__name'),
        date: text(el, '.jm-reviewer-info__details > .jm-cluster:nth-child(2) > .jm-text'),
        verified: text(el, '.jm-reviewer-info__verified-badge, .jm-verified-badge'),
        photos: [...el.querySelectorAll('.jm-media-thumbnail-list__thumbnail img')].flatMap(img => {
          try {
            const url = new URL(img.currentSrc || img.src, location.href);
            if (!['http:', 'https:'].includes(url.protocol)) return [];
            url.searchParams.set('width', '1200');
            return [{ thumb: img.src, full: url.href }];
          } catch (_) { return []; }
        }),
      };
      review.id = el.dataset.reviewId || el.dataset.id || el.dataset.sampleOrder || JSON.stringify(review);
      return review;
    });
  }

  function nextReviewPage(root) {
    // Use Judge.me's own pagination, so no API key or duplicate review store is needed.
    return [...root.querySelectorAll('.jm-review-widget button, .jm-review-widget a')].find(el => {
      const label = (el.getAttribute('aria-label') || el.textContent).trim();
      return !el.disabled && el.getAttribute('aria-disabled') !== 'true' && !el.hidden &&
        (/^(load more(?: reviews)?|next(?: page| reviews)?)$/i.test(label) || el.classList.contains('jdgm-paginate__next-page'));
    });
  }

  function waitForReviewChange(root, action, signal) {
    const before = JSON.stringify(readModalReviews(root));
    return new Promise((resolve, reject) => {
      const finish = error => {
        observer.disconnect();
        clearTimeout(timeout);
        signal.removeEventListener('abort', abort);
        error ? reject(error) : resolve();
      };
      const abort = () => finish(new Error('Closed'));
      const observer = new MutationObserver(() => {
        const reviews = readModalReviews(root);
        if (reviews.length && JSON.stringify(reviews) !== before) finish();
      });
      const timeout = setTimeout(() => finish(new Error('Reviews did not load. Please try again.')), 12000);
      observer.observe(root, { childList: true, subtree: true, characterData: true });
      signal.addEventListener('abort', abort, { once: true });
      action();
    });
  }

  function openReviewModal(root, opener, photoLabel) {
    if (document.querySelector('.tasaa-reviews-modal[open]')) return;
    const dialog = make('dialog', 'tasaa-reviews-modal');
    dialog.setAttribute('aria-label', root.hasAttribute('data-sample-reviews') ? 'Sample customer reviews' : 'Customer reviews');
    const panel = make('div', 'tasaa-reviews-modal__panel');
    const close = button('×', 'tasaa-reviews-modal__close', () => dialog.close());
    close.setAttribute('aria-label', 'Close reviews');
    close.autofocus = true;
    panel.append(close);
    if (root.hasAttribute('data-sample-reviews')) {
      panel.append(make('p', 'tasaa-reviews-modal__notice', 'Sample reviews for design testing — catalogue photos, not customer feedback.'));
    }
    const nativeSort = root.querySelector('[data-sample-review-sort], .jm-sort-filter__select');
    const sort = (readModalReviews(root).length > 1 || nextReviewPage(root)) ? nativeSort?.cloneNode(true) : null;
    if (sort) {
      sort.removeAttribute('id');
      sort.removeAttribute('data-sample-review-sort');
      sort.className = 'tasaa-reviews-modal__sort';
      sort.setAttribute('aria-label', 'Sort reviews');
      sort.value = nativeSort.value;
      const toolbar = make('div', 'tasaa-reviews-modal__toolbar');
      toolbar.append(sort);
      panel.append(toolbar);
    }
    const list = make('div', 'tasaa-reviews-modal__list');
    const status = make('p', 'tasaa-reviews-modal__status');
    status.setAttribute('role', 'status');
    const more = button('Load More', 'tasaa-reviews-modal__more', () => loadBatch());
    const spinner = make('div', 'tasaa-reviews-modal__spinner');
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', 'Loading reviews');
    spinner.hidden = true;
    panel.append(list, status, more, spinner);
    dialog.append(panel);
    const controller = new AbortController();
    const saved = modalReviewCache.get(root);
    let reviews = saved && saved.sortValue === nativeSort?.value ? saved.reviews : readModalReviews(root);
    const save = () => modalReviewCache.set(root, { sortValue: nativeSort?.value, reviews });
    let shown = 0;
    let busy = false;
    const merge = () => {
      const ids = new Set(reviews.map(review => review.id));
      readModalReviews(root).forEach(review => {
        if (!ids.has(review.id)) { reviews.push(review); ids.add(review.id); }
      });
      save();
    };
    const appendReview = review => {
      const card = make('article', 'tasaa-reviews-modal__review');
      const top = make('div', 'tasaa-reviews-modal__meta');
      if (review.score) {
        const stars = make('span', 'tasaa-reviews-modal__stars', '★'.repeat(Math.min(5, Math.round(review.score))) + '☆'.repeat(5 - Math.min(5, Math.round(review.score))));
        stars.setAttribute('role', 'img');
        stars.setAttribute('aria-label', `${review.score} out of 5 stars`);
        top.append(stars);
      }
      if (review.date) top.append(make('span', 'tasaa-reviews-modal__date', review.date));
      card.append(top);
      if (review.name) {
        const author = make('div', 'tasaa-reviews-modal__author');
        const avatar = make('span', 'tasaa-reviews-modal__avatar');
        avatar.setAttribute('aria-hidden', 'true');
        avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="7" r="3.5"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></svg>';
        author.append(avatar, make('span', '', review.name));
        if (review.verified) author.append(make('span', 'tasaa-reviews-modal__verified', review.verified));
        card.append(author);
      }
      if (review.title) card.append(make('h3', 'tasaa-reviews-modal__title', review.title));
      if (review.body) {
        const body = make('p', 'tasaa-reviews-modal__body', review.body);
        card.append(body);
        if (review.body.length > 360) {
          body.classList.add('is-collapsed');
          const readMore = button('Read more', 'tasaa-reviews-modal__read-more', () => {
            const collapsed = body.classList.toggle('is-collapsed');
            readMore.textContent = collapsed ? 'Read more' : 'Read less';
            readMore.setAttribute('aria-expanded', String(!collapsed));
          });
          readMore.setAttribute('aria-expanded', 'false');
          card.append(readMore);
        }
      }
      if (review.photos.length) {
        const media = make('div', 'tasaa-reviews-modal__photos');
        review.photos.forEach((photo, index) => {
          const tile = button('', '', () => openGallery(review.photos, index, tile, photoLabel, review));
          tile.setAttribute('aria-label', `View ${photoLabel.toLowerCase()} ${index + 1} from ${review.name || 'review'}`);
          const img = make('img', '');
          img.src = photo.thumb;
          img.alt = `${photoLabel} ${index + 1}`;
          img.loading = 'lazy';
          tile.append(img);
          media.append(tile);
        });
        card.append(media);
      }
      list.append(card);
    };
    const showBatch = () => {
      reviews.slice(shown, shown + 5).forEach(appendReview);
      shown = Math.min(shown + 5, reviews.length);
      status.textContent = '';
      more.hidden = shown >= reviews.length && !nextReviewPage(root);
    };
    const setBusy = value => {
      busy = value;
      more.disabled = value;
      more.setAttribute('aria-busy', String(value));
      spinner.hidden = !value;
      if (value) status.textContent = '';
      if (sort) sort.disabled = value;
      list.setAttribute('aria-busy', String(value));
    };
    const loadBatch = async () => {
      if (busy) return;
      setBusy(true);
      try {
        while (reviews.length < shown + 5) {
          const next = nextReviewPage(root);
          if (!next) break;
          const count = reviews.length;
          await waitForReviewChange(root, () => next.click(), controller.signal);
          merge();
          if (reviews.length === count) break;
        }
        if (!controller.signal.aborted) showBatch();
      } catch (error) {
        if (!controller.signal.aborted) status.textContent = error.message;
      } finally { setBusy(false); }
    };
    sort?.addEventListener('change', async () => {
      setBusy(true);
      try {
        await waitForReviewChange(root, () => {
          nativeSort.value = sort.value;
          nativeSort.dispatchEvent(new Event('change', { bubbles: true }));
        }, controller.signal);
        reviews = readModalReviews(root);
        save();
        shown = 0;
        list.replaceChildren();
        showBatch();
      } catch (error) {
        if (!controller.signal.aborted) status.textContent = error.message;
      } finally { setBusy(false); }
    });
    const previousOverflow = document.documentElement.style.overflow;
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      controller.abort();
      document.documentElement.style.overflow = previousOverflow;
      dialog.remove();
      const target = opener.isConnected ? opener : root.querySelector('.tasaa-reviews-show-all');
      target?.focus({ preventScroll: true });
    }, { once: true });
    document.body.append(dialog);
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    save();
    if (reviews.length < 5 && nextReviewPage(root)) loadBatch();
    else showBatch();
  }

  function openGallery(photos, start, opener, photoLabel, owner) {
    const dialog = make('dialog', 'tasaa-review-lightbox');
    dialog.setAttribute('aria-label', `${photoLabel}s and review details`);
    const close = button('←', 'tasaa-review-lightbox__close', () => dialog.close());
    close.setAttribute('aria-label', 'Close photo gallery');
    const stage = make('div', 'tasaa-review-lightbox__stage');
    const img = make('img', 'tasaa-review-lightbox__image');
    stage.append(img);
    const count = make('p', 'tasaa-review-lightbox__count');
    count.setAttribute('aria-live', 'polite');
    const details = make('section', 'tasaa-review-lightbox__details');
    details.setAttribute('aria-label', 'Review for this photo');
    let index = start;
    let bodyObserver;
    let slideAnimations = [];
    let outgoing;
    const clearSlide = () => {
      slideAnimations.forEach(animation => animation.cancel());
      slideAnimations = [];
      outgoing?.remove();
      outgoing = null;
    };
    const update = offset => {
      clearSlide();
      const shouldSlide = offset && photos.length > 1 && matchMedia('(max-width: 749px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (shouldSlide) {
        outgoing = img.cloneNode();
        outgoing.classList.add('tasaa-review-lightbox__outgoing');
        outgoing.setAttribute('aria-hidden', 'true');
        outgoing.alt = '';
        stage.append(outgoing);
      }
      bodyObserver?.disconnect();
      index = (index + offset + photos.length) % photos.length;
      const photo = photos[index];
      const review = photo.review || owner;
      img.src = photo.full;
      img.alt = `${photoLabel} ${index + 1} of ${photos.length}`;
      if (shouldSlide) {
        const direction = Math.sign(offset);
        const timing = { duration: 320, easing: 'cubic-bezier(.22,.61,.36,1)' };
        const leaving = outgoing;
        slideAnimations = [
          leaving.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }], timing),
          img.animate([{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }], timing),
        ];
        slideAnimations[0].onfinish = () => leaving.remove();
      }
      count.textContent = `${index + 1} / ${photos.length}`;
      details.replaceChildren();
      details.scrollTop = 0;
      details.hidden = !review;
      if (!review) return;
      if (photoLabel === 'Sample catalogue photo') details.append(make('p', 'tasaa-review-lightbox__sample', 'Sample review · Catalogue photo'));
      const top = make('div', 'tasaa-review-lightbox__heading');
      if (review.score) {
        const rating = make('span', 'tasaa-review-lightbox__rating', `${review.score} ★`);
        rating.setAttribute('aria-label', `${review.score} out of 5 stars`);
        top.append(rating);
      }
      if (review.title) top.append(make('h3', 'tasaa-review-lightbox__title', review.title));
      if (top.childElementCount) details.append(top);
      if (review.body) {
        const body = make('p', 'tasaa-review-lightbox__body', review.body);
        body.id = 'tasaa-photo-review-body';
        details.append(body);
        const more = button('Read more', 'tasaa-review-lightbox__read-more', () => {
          const expanded = more.getAttribute('aria-expanded') !== 'true';
          more.setAttribute('aria-expanded', String(expanded));
          more.textContent = expanded ? 'Read less' : 'Read more';
          body.classList.toggle('is-expanded', expanded);
        });
        more.setAttribute('aria-expanded', 'false');
        more.setAttribute('aria-controls', body.id);
        details.append(more);
        more.hidden = true;
        // Measure the actual clamp so short reviews never show an unnecessary link.
        bodyObserver = new ResizeObserver(() => {
          if (more.getAttribute('aria-expanded') === 'false') more.hidden = body.scrollHeight <= body.clientHeight + 1;
        });
        bodyObserver.observe(body);
      }
      if (review.name) details.append(make('p', 'tasaa-review-lightbox__name', review.name));
      const meta = [review.verified, review.date].filter(Boolean).join(' · ');
      if (meta) details.append(make('p', 'tasaa-review-lightbox__meta', meta));
    };
    dialog.append(close, count, stage, details);
    if (photos.length > 1) {
      const prev = button('‹', 'tasaa-review-lightbox__prev', () => update(-1));
      const next = button('›', 'tasaa-review-lightbox__next', () => update(1));
      prev.setAttribute('aria-label', 'Previous photo');
      next.setAttribute('aria-label', 'Next photo');
      dialog.append(prev, next);
    }
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); update(e.key === 'ArrowRight' ? 1 : -1); }
    });
    let touchStart;
    img.addEventListener('touchstart', e => {
      touchStart = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    }, { passive: true });
    img.addEventListener('touchend', e => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) update(dx < 0 ? 1 : -1);
    }, { passive: true });
    img.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
    const previousOverflow = document.documentElement.style.overflow;
    dialog.addEventListener('close', () => {
      bodyObserver?.disconnect();
      clearSlide();
      document.documentElement.style.overflow = previousOverflow;
      dialog.remove();
      if (opener.isConnected) opener.focus({ preventScroll: true });
    }, { once: true });
    document.body.append(dialog);
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    update(0);
  }
  const discover = () => document.querySelectorAll('#judgeme_product_reviews, #tasaa-sample-reviews').forEach(mount);
  discover();
  // App blocks can be inserted after page load and replaced in the theme editor.
  new MutationObserver(discover).observe(document.body, { childList: true });
  document.addEventListener('shopify:section:load', discover);
  if (!document.querySelector('#judgeme_product_reviews, #tasaa-sample-reviews')) {
    const pending = new MutationObserver(() => {
      if (document.querySelector('#judgeme_product_reviews, #tasaa-sample-reviews')) { discover(); pending.disconnect(); }
    });
    pending.observe(document.body, { childList: true, subtree: true });
  }
})();
