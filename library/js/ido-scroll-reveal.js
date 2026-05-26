/* ═══════════════════════════════════════════════════════════════
   IDO-SCROLL-REVEAL.JS — IntersectionObserver scroll-trigger

   Aktywacja:
   1. Dodaj klasę `.xx-reveal` (lub własną z prefixem) do elementu.
   2. CSS w layer7 definiuje początkowy stan (opacity:0, transform:translateY).
   3. JS wykrywa wejście w viewport → dodaje `.xx-in` → CSS transition.

   Respektuje prefers-reduced-motion (skip animation, pokaz natychmiast).
   Nie działa na fullpage.js (fp-section ma własny lifecycle).
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /**
   * Initialize scroll reveal on elements matching selector.
   * @param {Object} opts
   * @param {string} opts.selector  — default '.xx-reveal'
   * @param {string} opts.activeClass — default 'xx-in'
   * @param {string} opts.rootMargin — default '0px 0px -10% 0px' (trigger 10% before bottom)
   * @param {number} opts.threshold — default 0.15
   * @param {boolean} opts.once — default true (unobserve after reveal)
   */
  window.initScrollReveal = function (opts) {
    opts = opts || {};
    var selector    = opts.selector    || '.xx-reveal';
    var activeClass = opts.activeClass || 'xx-in';
    var rootMargin  = opts.rootMargin  || '0px 0px -10% 0px';
    var threshold   = opts.threshold !== undefined ? opts.threshold : 0.15;
    var once        = opts.once !== false;

    /* prefers-reduced-motion: pokaż wszystko natychmiast */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add(activeClass);
      });
      return;
    }

    /* IntersectionObserver fallback: pokaż wszystko (stare przeglądarki) */
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add(activeClass);
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          /* Stagger support: child opóźnienia z data-stagger="100" (ms) */
          var stagger = parseInt(entry.target.getAttribute('data-stagger'), 10) || 0;
          if (stagger > 0) {
            var children = entry.target.children;
            for (var i = 0; i < children.length; i++) {
              (function (child, delay) {
                setTimeout(function () { child.classList.add(activeClass); }, delay);
              })(children[i], i * stagger);
            }
          }
          entry.target.classList.add(activeClass);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          /* Replay mode: usuń klasę po wyjściu z viewport */
          entry.target.classList.remove(activeClass);
        }
      });
    }, { rootMargin: rootMargin, threshold: threshold });

    document.querySelectorAll(selector).forEach(function (el) {
      observer.observe(el);
    });

    return observer;
  };

  /* Auto-init for default selector after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.initScrollReveal(); });
  } else {
    window.initScrollReveal();
  }
})();
