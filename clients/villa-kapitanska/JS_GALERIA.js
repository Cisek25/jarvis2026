/* ════════════════════════════════════════════════════════════
   VILLA KAPITAŃSKA® — GALERIA — skrypt (galeria.js)
   Filtrowanie, lightbox, klawiatura, dotyk (swipe)
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var grid      = document.getElementById('vkGalleryGrid');
  var lightbox  = document.getElementById('vkLightbox');
  var lbImg     = document.getElementById('vkLbImg');
  var lbCounter = document.getElementById('vkLbCounter');
  var lbSpinner = document.getElementById('vkLbSpinner');
  var lbClose   = document.getElementById('vkLbClose');
  var lbPrev    = document.getElementById('vkLbPrev');
  var lbNext    = document.getElementById('vkLbNext');

  var allItems     = [];
  var visibleItems = [];
  var currentIdx   = 0;

  /* ── Inicjalizacja ──────────────────────────────────────── */
  function init() {
    allItems = Array.prototype.slice.call(
      document.querySelectorAll('.vk-gallery-item')
    );
    visibleItems = allItems.slice();

    /* Klik na kafelek → otwórz lightbox */
    allItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var idx = visibleItems.indexOf(item);
        if (idx === -1) return;
        openLightbox(idx);
      });
    });

    /* Filtry */
    var filters = document.querySelectorAll('.vk-gallery-filter');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(btn.getAttribute('data-filter'));
      });
    });

    /* Lightbox — przyciski */
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', function () { navigate(-1); });
    if (lbNext)  lbNext.addEventListener('click', function () { navigate(1); });
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    /* Klawiatura */
    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'ArrowRight')  navigate(1);
    });

    /* Dotyk (swipe) na lightboxie */
    if (lightbox) {
      var touchStartX = 0;
      lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      lightbox.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
      }, { passive: true });
    }

    /* Nagłówki sekcji — ukryj/pokaż razem z filtrem */
    updateSectionHeaders('all');
  }

  /* ── Filtrowanie ────────────────────────────────────────── */
  function applyFilter(filter) {
    visibleItems = [];
    allItems.forEach(function (item) {
      var cat  = item.getAttribute('data-category');
      var show = (filter === 'all' || cat === filter);
      if (show) {
        item.classList.remove('vk-hidden');
        visibleItems.push(item);
      } else {
        item.classList.add('vk-hidden');
      }
    });
    updateSectionHeaders(filter);
  }

  /* ── Nagłówki sekcji ────────────────────────────────────── */
  function updateSectionHeaders(filter) {
    var headers = document.querySelectorAll('[data-section-for]');
    headers.forEach(function (el) {
      var forCat = el.getAttribute('data-section-for');
      if (filter === 'all' || filter === forCat) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }

  /* ── Lightbox ───────────────────────────────────────────── */
  function openLightbox(idx) {
    currentIdx = idx;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    showImage(currentIdx);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
  }

  function navigate(dir) {
    currentIdx = (currentIdx + dir + visibleItems.length) % visibleItems.length;
    showImage(currentIdx);
  }

  function showImage(idx) {
    var item = visibleItems[idx];
    var src  = item.querySelector('img').getAttribute('data-full') ||
               item.querySelector('img').src;
    var alt  = item.querySelector('img').alt;

    /* Spinner */
    lbSpinner.classList.add('visible');
    lbImg.classList.add('loading');

    var tmpImg = new Image();
    tmpImg.onload = function () {
      lbImg.src = src;
      lbImg.alt = alt;
      lbImg.classList.remove('loading');
      lbSpinner.classList.remove('visible');
    };
    tmpImg.onerror = function () {
      lbSpinner.classList.remove('visible');
      lbImg.classList.remove('loading');
    };
    tmpImg.src = src;

    /* Licznik */
    lbCounter.textContent = (idx + 1) + ' / ' + visibleItems.length;

    /* Strzałki — ukryj jeśli 1 zdjęcie */
    var multiple = visibleItems.length > 1;
    lbPrev.style.display = multiple ? '' : 'none';
    lbNext.style.display = multiple ? '' : 'none';
  }

  /* ── Start ──────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
