/* ═══════════════════════════════════════════════════════════════
   IDO-LIGHTBOX.JS — Universal click-to-zoom for galleries

   Aktywacja:
   1. initLightbox() — uruchom raz na końcu body_bottom.
   2. Klika się: <img> w .xx-gallery__item, .xx-section img:not(.xx-no-lightbox).
   3. Klawisze: Esc = zamknij, ←/→ = poprzednie/następne zdjęcie (jeśli w gallery).
   4. Touch: tap on overlay = zamknij, swipe left/right = nav.

   Wymagany CSS w layer7-interactions lub osobno:
   - .xx-lightbox (position: fixed, hidden by default)
   - .xx-lightbox__overlay (rgba bg)
   - .xx-lightbox__img (max-w/h 90%)
   - .xx-lightbox__close, __prev, __next (buttony)
   - .xx-lightbox.xx-active (display block)

   Konfiguracja:
   - selector: default '.xx-gallery__item img, .xx-section img:not(.xx-no-lightbox)'
   - groupSelector: parent .xx-gallery (dla prev/next nav w obrębie grupy)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var modal = null;
  var currentGroup = [];
  var currentIndex = 0;

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'xx-lightbox';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Powiększone zdjęcie');
    modal.innerHTML =
      '<div class="xx-lightbox__overlay" aria-hidden="true"></div>' +
      '<button class="xx-lightbox__close" aria-label="Zamknij">&times;</button>' +
      '<button class="xx-lightbox__prev" aria-label="Poprzednie">&#8249;</button>' +
      '<button class="xx-lightbox__next" aria-label="Następne">&#8250;</button>' +
      '<img class="xx-lightbox__img" src="" alt="">' +
      '<p class="xx-lightbox__caption" aria-live="polite"></p>';
    document.body.appendChild(modal);

    modal.querySelector('.xx-lightbox__close').addEventListener('click', close);
    modal.querySelector('.xx-lightbox__overlay').addEventListener('click', close);
    modal.querySelector('.xx-lightbox__prev').addEventListener('click', function (e) {
      e.stopPropagation();
      nav(-1);
    });
    modal.querySelector('.xx-lightbox__next').addEventListener('click', function (e) {
      e.stopPropagation();
      nav(1);
    });

    /* Touch swipe support */
    var touchStartX = 0;
    modal.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    modal.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 60) nav(dx < 0 ? 1 : -1);
    }, { passive: true });

    return modal;
  }

  function open(img, group) {
    ensureModal();
    currentGroup = group || [img];
    currentIndex = currentGroup.indexOf(img);
    render();
    modal.classList.add('xx-active');
    document.body.style.overflow = 'hidden';
    /* Toggle prev/next buttons based on group size */
    modal.querySelector('.xx-lightbox__prev').style.display =
    modal.querySelector('.xx-lightbox__next').style.display =
      currentGroup.length > 1 ? '' : 'none';
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('xx-active');
    document.body.style.overflow = '';
    /* Clear src after fade-out to free memory */
    setTimeout(function () {
      if (!modal.classList.contains('xx-active')) {
        modal.querySelector('.xx-lightbox__img').src = '';
      }
    }, 400);
  }

  function nav(dir) {
    currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
    render();
  }

  function render() {
    var img = currentGroup[currentIndex];
    if (!img) return;
    var lbImg = modal.querySelector('.xx-lightbox__img');
    var lbCap = modal.querySelector('.xx-lightbox__caption');
    /* Prefer full-res via data-src-full > data-src > src */
    lbImg.src = img.getAttribute('data-src-full') ||
                img.getAttribute('data-src') ||
                img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.getAttribute('data-caption') || img.alt || '';
  }

  /**
   * Initialize lightbox click handlers.
   * @param {Object} opts
   * @param {string} opts.selector — image selector
   * @param {string} opts.groupSelector — parent group for prev/next nav
   */
  window.initLightbox = function (opts) {
    opts = opts || {};
    var selector = opts.selector ||
      '.xx-gallery__item img, .xx-section img:not(.xx-no-lightbox):not(.logo)';
    var groupSel = opts.groupSelector || '.xx-gallery, .xx-section';

    document.addEventListener('click', function (e) {
      var img = e.target.closest(selector);
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();

      /* Build group from parent if matches groupSelector */
      var group = [];
      var parent = img.closest(groupSel);
      if (parent) {
        var siblings = parent.querySelectorAll(selector);
        for (var i = 0; i < siblings.length; i++) group.push(siblings[i]);
      } else {
        group = [img];
      }
      open(img, group);
    });

    document.addEventListener('keydown', function (e) {
      if (!modal || !modal.classList.contains('xx-active')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
    });
  };

  /* Auto-init after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.initLightbox(); });
  } else {
    window.initLightbox();
  }
})();
