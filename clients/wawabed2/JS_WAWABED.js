/**
 * WAWABED v2 — JS strony głównej
 * Pole CMS: body_bottom_code_1
 * Vanilla JS, bez jQuery
 */
(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════
     1. REVEAL — animacje przy scrollu
     ════════════════════════════════════════════════════════════ */
  function initReveal() {
    var els = document.querySelectorAll('.wb-reveal');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('wb-reveal--visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('wb-reveal--visible'); });
    }
  }

  /* ════════════════════════════════════════════════════════════
     2. SMOOTH SCROLL — kotwy
     ════════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ════════════════════════════════════════════════════════════
     3. SLICK REFRESH — odświeżenie karuzeli wyróżnionych ofert
     ════════════════════════════════════════════════════════════ */
  function initSlickRefresh() {
    function refresh() {
      if (typeof jQuery !== 'undefined') {
        var s = jQuery('.cmshotspot .offerslist');
        if (s.length && s.hasClass('slick-initialized')) {
          s.slick('refresh');
        }
      }
    }
    if (document.readyState === 'complete') {
      refresh();
    } else {
      window.addEventListener('load', function () {
        setTimeout(refresh, 400);
      });
    }
  }

  /* ════════════════════════════════════════════════════════════
     4. LAZY LOADING FALLBACK
     ════════════════════════════════════════════════════════════ */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;

    var imgs = document.querySelectorAll('img[loading="lazy"]');
    if (!imgs.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var img = e.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      imgs.forEach(function (img) { obs.observe(img); });
    }
  }

  /* ════════════════════════════════════════════════════════════
     INIT
     ════════════════════════════════════════════════════════════ */
  function init() {
    initReveal();
    initSmoothScroll();
    initSlickRefresh();
    initLazyLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
