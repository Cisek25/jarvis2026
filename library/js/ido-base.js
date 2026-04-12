/* =============================================================
   IDO-BASE.JS — Shared IdoBooking Client Module
   Version: 1.0 | Date: 2026-04-11

   Injected via body_bottom_code (dashboard wraps in <script>).
   Vanilla JS only — no jQuery. Modern browsers primary target.

   Modules:
   01. JS Feature Detection
   02. Scroll Reveal Animations
   03. Smooth Scroll for Anchor Links
   04. Counter Animation
   05. FAQ Accordion Toggle
   06. Mobile Menu Enhancement
   07. Search Widget Placeholder Fix (IdoBooking NaN bug)
   08. Auto-Pull Contact from Footer
   09. Consolidated Scroll Handler
   10. Homepage Detection Utility
   ============================================================= */

(function () {
  'use strict';

  /* =============================================================
     GLOBAL CONFIG — override per client by setting window.idoConfig
     before this script runs, or rely on defaults below.
     ============================================================= */
  var cfg = window.idoConfig || {};

  /* Defaults — can be overridden via window.idoConfig */
  var DEFAULTS = {
    /* Scroll reveal */
    revealThreshold: 0.15,
    revealRootMargin: '0px 0px -50px 0px',

    /* Scroll handler thresholds */
    headerScrollThreshold: 50,
    backToTopThreshold: 400,

    /* Counter animation */
    counterDuration: 2000,

    /* Search widget fix — run at these delays (ms) */
    searchFixDelays: [0, 500, 1500, 3000],

    /* Search field placeholders — override via data-placeholder-from / to / persons */
    placeholderFrom: 'Przyjazd',
    placeholderTo: 'Wyjazd',
    placeholderPersons: 'Osoby',

    /* Homepage pattern — matches /, /pl/, /en/, /de/, etc. */
    homepagePattern: /^\/[a-z]{0,2}\/?$/
  };

  function opt(key) {
    return Object.prototype.hasOwnProperty.call(cfg, key) ? cfg[key] : DEFAULTS[key];
  }

  /* =============================================================
     01. JS FEATURE DETECTION
     Adds 'ido-js' to <html> so CSS can distinguish JS vs no-JS.
     Replaces any noscript/CSS opacity:0 fallback immediately.
     ============================================================= */
  document.documentElement.classList.add('ido-js');

  /* =============================================================
     02. SCROLL REVEAL ANIMATIONS
     Watches .ido-reveal elements with IntersectionObserver.
     Adds .ido-revealed once — then unobserves (one-shot).
     CSS handles the opacity/transform transition.
     ============================================================= */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: make all reveal elements immediately visible */
      var fallbackEls = document.querySelectorAll('.ido-reveal');
      for (var i = 0; i < fallbackEls.length; i++) {
        fallbackEls[i].classList.add('ido-revealed');
      }
      return;
    }

    var revealObs = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('ido-revealed');
          revealObs.unobserve(entries[i].target);
        }
      }
    }, {
      threshold: opt('revealThreshold'),
      rootMargin: opt('revealRootMargin')
    });

    var els = document.querySelectorAll('.ido-reveal');
    for (var j = 0; j < els.length; j++) {
      revealObs.observe(els[j]);
    }
  }

  /* =============================================================
     03. SMOOTH SCROLL FOR ANCHOR LINKS
     Delegation on document — catches all a[href^="#"] clicks.
     CRITICAL: Skips IdoBooking hash routing (#/ prefix).
     Offsets by header height read from --ido-header-h CSS var
     or measured from the first <header> element.
     ============================================================= */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      /* Skip IdoBooking internal hash routing */
      if (hash.indexOf('#/') === 0) return;

      var id = hash.slice(1);
      if (!id) return;

      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      /* Determine header offset */
      var headerH = 0;
      var cssVar = getComputedStyle(document.documentElement)
                    .getPropertyValue('--ido-header-h');
      if (cssVar) {
        headerH = parseInt(cssVar, 10) || 0;
      } else {
        var headerEl = document.querySelector('header, .navbar, .top-bar');
        if (headerEl) headerH = headerEl.offsetHeight;
      }

      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* =============================================================
     04. COUNTER ANIMATION
     Elements: data-ido-count="NUMBER"
     Triggered once by IntersectionObserver.
     Duration: cfg.counterDuration (default 2000ms), ease-out.
     Output: thousands separator via toLocaleString (PL default).
     ============================================================= */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-ido-count'), 10);
    if (isNaN(target)) return;

    var duration = opt('counterDuration');
    var startTime = null;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.round(easeOut(progress) * target);
      el.textContent = current.toLocaleString('pl-PL');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pl-PL');
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counterEls = document.querySelectorAll('[data-ido-count]');
    if (!counterEls.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < counterEls.length; i++) {
        animateCounter(counterEls[i]);
      }
      return;
    }

    var counterObs = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animateCounter(entries[i].target);
          counterObs.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.5 });

    for (var j = 0; j < counterEls.length; j++) {
      counterObs.observe(counterEls[j]);
    }
  }

  /* =============================================================
     05. FAQ ACCORDION TOGGLE
     Finds all .ido-faq__question buttons and wires click toggle.
     Toggles aria-expanded + hidden attribute on .ido-faq__answer.
     CSS (max-height transition on :not([hidden])) handles visuals.

     NOTE: MUST live in body_bottom — CMS body_top strips <script>.
     ============================================================= */
  function initFaq() {
    var questions = document.querySelectorAll('.ido-faq__question');
    if (!questions.length) return;

    for (var i = 0; i < questions.length; i++) {
      (function (btn) {
        /* Ensure initial ARIA state matches hidden attr */
        var answerId = btn.getAttribute('aria-controls');
        var answer = answerId
          ? document.getElementById(answerId)
          : btn.parentNode.querySelector('.ido-faq__answer');

        if (!answer) return;

        /* Sync initial aria-expanded with DOM state */
        var isOpen = !answer.hasAttribute('hidden');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        btn.addEventListener('click', function () {
          var expanded = btn.getAttribute('aria-expanded') === 'true';
          if (expanded) {
            btn.setAttribute('aria-expanded', 'false');
            answer.setAttribute('hidden', '');
          } else {
            btn.setAttribute('aria-expanded', 'true');
            answer.removeAttribute('hidden');
          }
        });

        /* Keyboard: Space / Enter handled natively for <button>.
           Support also clicking on Enter for <div role="button"> fallback. */
        if (btn.tagName !== 'BUTTON') {
          btn.setAttribute('role', 'button');
          btn.setAttribute('tabindex', '0');
          btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              btn.click();
            }
          });
        }
      }(questions[i]));
    }
  }

  /* =============================================================
     06. MOBILE MENU ENHANCEMENT
     - Toggles .ido-menu-open on <body> when .navbar-toggler clicked
     - Closes on outside click
     - Closes on ESC key
     ============================================================= */
  function initMobileMenu() {
    var toggler = document.querySelector('.navbar-toggler');
    if (!toggler) return;

    function openMenu() {
      document.body.classList.add('ido-menu-open');
      toggler.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      document.body.classList.remove('ido-menu-open');
      toggler.setAttribute('aria-expanded', 'false');
    }

    function isMenuOpen() {
      return document.body.classList.contains('ido-menu-open');
    }

    toggler.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Close on click outside the nav */
    document.addEventListener('click', function (e) {
      if (!isMenuOpen()) return;
      var nav = document.querySelector('.navbar, nav, .menu-wrapper');
      if (nav && !nav.contains(e.target) && !toggler.contains(e.target)) {
        closeMenu();
      }
    });

    /* Close on ESC */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) {
        closeMenu();
        toggler.focus();
      }
    });
  }

  /* =============================================================
     07. SEARCH WIDGET PLACEHOLDER FIX
     IdoBooking bug: date fields sometimes render "NaN-aN-aN".
     Clears bad values and sets proper placeholder text.
     Runs 4 times with staggered delays — widget loads async.

     Placeholders configurable via data attributes on .iai-search
     wrapper: data-placeholder-from, data-placeholder-to,
     data-placeholder-persons. Falls back to cfg or DEFAULTS.
     ============================================================= */
  function fixSearchWidget() {
    var searchWrapper = document.querySelector('.iai-search, [class*="iai-search"]');

    /* Read placeholder overrides from DOM data attributes if present */
    var placeholderFrom = (searchWrapper && searchWrapper.getAttribute('data-placeholder-from'))
      || opt('placeholderFrom');
    var placeholderTo = (searchWrapper && searchWrapper.getAttribute('data-placeholder-to'))
      || opt('placeholderTo');
    var placeholderPersons = (searchWrapper && searchWrapper.getAttribute('data-placeholder-persons'))
      || opt('placeholderPersons');

    var fieldMap = {
      'iai_booking_date_from': placeholderFrom,
      'iai_booking_date_to': placeholderTo,
      'iai_booking_persons': placeholderPersons
    };

    var nanPattern = /NaN|aN-aN/i;

    Object.keys(fieldMap).forEach(function (name) {
      var field = document.querySelector(
        '[name="' + name + '"], #' + name
      );
      if (!field) return;

      /* Clear NaN value */
      if (field.value && nanPattern.test(field.value)) {
        field.value = '';
      }

      /* Set placeholder if missing or contains NaN */
      if (!field.getAttribute('placeholder') ||
          nanPattern.test(field.getAttribute('placeholder') || '')) {
        field.setAttribute('placeholder', fieldMap[name]);
      }
    });
  }

  function initSearchWidgetFix() {
    var delays = opt('searchFixDelays');
    for (var i = 0; i < delays.length; i++) {
      (function (delay) {
        setTimeout(fixSearchWidget, delay);
      }(delays[i]));
    }
  }

  /* =============================================================
     08. AUTO-PULL CONTACT FROM FOOTER
     Reads phone/email from footer links and copies them into
     CTA section contact links.

     CRITICAL: .replace(/\s/g, '') strips ALL whitespace from
     phone number — IdoBooking footer sometimes formats as
     "+48 123 456 789" which breaks tel: links.
     ============================================================= */
  function initContactPull() {
    var footer = document.querySelector('.footer, footer, #footer');
    if (!footer) return;

    /* Pull phone */
    var footerPhone = footer.querySelector('a[href^="tel:"]');
    if (footerPhone) {
      var rawPhone = footerPhone.getAttribute('href') || '';
      /* Strip all whitespace characters (IdoBooking bug) */
      var cleanPhone = rawPhone.replace(/\s/g, '');

      var ctaPhones = document.querySelectorAll('.ido-cta-contact[href^="tel:"]');
      for (var i = 0; i < ctaPhones.length; i++) {
        ctaPhones[i].setAttribute('href', cleanPhone);
        /* Also update visible text if it looks like a placeholder */
        if (!ctaPhones[i].textContent.trim() ||
            ctaPhones[i].getAttribute('data-auto-text') !== 'false') {
          var display = cleanPhone.replace('tel:', '');
          ctaPhones[i].textContent = display;
        }
      }
    }

    /* Pull email */
    var footerEmail = footer.querySelector('a[href^="mailto:"]');
    if (footerEmail) {
      var emailHref = footerEmail.getAttribute('href') || '';

      var ctaEmails = document.querySelectorAll('.ido-cta-contact[href^="mailto:"]');
      for (var j = 0; j < ctaEmails.length; j++) {
        ctaEmails[j].setAttribute('href', emailHref);
        if (!ctaEmails[j].textContent.trim() ||
            ctaEmails[j].getAttribute('data-auto-text') !== 'false') {
          ctaEmails[j].textContent = emailHref.replace('mailto:', '');
        }
      }
    }
  }

  /* =============================================================
     09. CONSOLIDATED SCROLL HANDLER
     ONE scroll listener with requestAnimationFrame throttling.
     Handles:
       - Header scroll state: adds .ido-header-scrolled after 50px
       - Back-to-top button visibility after 400px
     ============================================================= */
  function initScrollHandler() {
    var header = document.querySelector('header, .navbar, .top-bar, .default13, .header-wrapper');
    var backToTopBtn = document.querySelector('.ido-back-to-top, #backTop, [id="backTop"]');
    var ticking = false;

    var headerThreshold = opt('headerScrollThreshold');
    var bttThreshold = opt('backToTopThreshold');

    function onScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      /* Header scroll state */
      if (header) {
        if (scrollY > headerThreshold) {
          header.classList.add('ido-header-scrolled');
        } else {
          header.classList.remove('ido-header-scrolled');
        }
      }

      /* Back-to-top visibility */
      if (backToTopBtn) {
        if (scrollY > bttThreshold) {
          backToTopBtn.classList.add('ido-back-to-top--visible');
        } else {
          backToTopBtn.classList.remove('ido-back-to-top--visible');
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    /* Run once on init to set correct state if page loaded mid-scroll */
    onScroll();
  }

  /* =============================================================
     10. HOMEPAGE DETECTION UTILITY
     Regex matches: /, /pl/, /en/, /de/, /fr/, etc.
     Empty lang prefix (just /) and two-letter language codes.
     Exposed as window.idoIsHomepage for use by other scripts.
     ============================================================= */
  window.idoIsHomepage = opt('homepagePattern').test(window.location.pathname);

  /* =============================================================
     11. INIT — DOMContentLoaded guard
     Runs immediately if DOM is already parsed (script at body end
     means this is usually the case), otherwise waits for event.
     ============================================================= */
  function init() {
    initScrollReveal();
    initSmoothScroll();
    initCounters();
    initFaq();
    initMobileMenu();
    initSearchWidgetFix();
    initContactPull();
    initScrollHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
