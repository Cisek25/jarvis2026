/* ═══════════════════════════════════════════════════════════════
   IDO-FEATURE-DETECTION.JS — Per-page DOM probes

   Exposes window.idoFeatures = { isHome, isOffer, ... }
   żeby pozostałe moduły JARVIS wiedziały kiedy się odpalać.

   Wczytaj NA POCZĄTKU body_bottom — przed wszystkimi innymi modułami.
   Po wczytaniu idoFeatures jest gotowy dla:
   - ido-base.js (booking modal init, featured offers)
   - ido-brand-neutral.js (offer page detect)
   - ido-scroll-reveal.js (page-type-based reveal selectors)
   - per-client JS (np. {{XX_PREFIX}}-custom.js)
   ═══════════════════════════════════════════════════════════════ */

window.idoFeatures = (function () {
  var body = document.body;
  var path = window.location.pathname;
  var html = document.documentElement;

  return {
    /* ── Page identity (z body.className IdoBooking) ───────── */
    isHome:           body.classList.contains('page-index'),
    isOfferDetail:    body.classList.contains('page-offer'),
    isOffersList:     body.classList.contains('page-offers'),
    isTxt:            body.classList.contains('page-txt'),
    isContact:        body.classList.contains('page-contact'),
    isReservation:    body.classList.contains('page-reservation') ||
                      body.classList.contains('page-bookmaster'),

    /* ── Theme + framework detection ───────────────────────── */
    hasDefault13:     document.querySelector('header.default13') !== null,
    hasFullpageJs:    document.querySelector('#fullpage, .fp-section') !== null,
    hasSlick:         typeof window.jQuery !== 'undefined' &&
                      typeof window.jQuery.fn.slick !== 'undefined',
    hasLitepicker:    typeof window.Litepicker !== 'undefined',
    hasLeaflet:       typeof window.L !== 'undefined',

    /* ── Page elements detection ───────────────────────────── */
    hasHotspot:       document.querySelector('.container-hotspot') !== null,
    hasBookForm:      document.querySelector('#iai_book_form, .iai-search') !== null,
    hasGallery:       document.querySelector('.gallery, .slick-track') !== null,

    /* ── URL params (per page) ─────────────────────────────── */
    pageId:           (path.match(/\/txt\/(\d+)/) || [])[1] || null,
    offerId:          (path.match(/\/offer\/(\d+)/) || [])[1] || null,
    contactId:        (path.match(/\/contact\/(\d+)/) || [])[1] || null,

    /* ── Locale ─────────────────────────────────────────────── */
    language:         html.lang || 'pl',

    /* ── Viewport (live; re-read on resize via getter) ─────── */
    get viewportWidth()  { return window.innerWidth; },
    get isMobile()       { return window.innerWidth <= 991; },
    get isTablet()       { return window.innerWidth > 991 && window.innerWidth <= 1280; },
    get isDesktop()      { return window.innerWidth > 1280; },

    /* ── User preferences ──────────────────────────────────── */
    prefersDarkMode:  window.matchMedia('(prefers-color-scheme: dark)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    /* ── Touch capability ──────────────────────────────────── */
    isTouchDevice:    'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
})();

/* Console log dla debug (uruchom z ?debug=1 na URL) */
if (window.location.search.indexOf('debug=1') !== -1) {
  console.log('[idoFeatures]', window.idoFeatures);
}
