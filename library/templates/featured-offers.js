/* ============================================================
   FEATURED OFFERS — Template JS
   Reads system .container-hotspot, builds custom offer cards.

   USAGE:
   1. Copy this into client's body_bottom <script>
   2. Replace PREFIX with client prefix (e.g. "nj", "md", "ec")
   3. Adjust CTA text, price format, etc.
   4. Add matching CSS (see featured-offers.css template)

   REQUIRES in CSS:
   .container-hotspot { display: none !important; }
   ============================================================ */
(function() {
  var PREFIX = '{{PREFIX}}'; // e.g. 'nj', 'md'
  var hotspot = document.querySelector('.container-hotspot');
  if (!hotspot) return;

  /* SVG icons for meta info */
  var iconArea = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>';
  var iconGuests = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>';

  /* Deduplicate — prefer original slides over slick clones */
  var seen = {};
  var offers = [];

  function extractOffer(el) {
    var a = el.querySelector('a.object-icon');
    if (!a) return;
    var href = a.getAttribute('href');
    if (seen[href]) return;
    seen[href] = true;

    var img = el.querySelector('img');
    var title = el.querySelector('h3 a');
    var desc = el.querySelector('.offer__description');
    var metersEl = el.querySelector('.accommodation-meters');
    var guestsEl = el.querySelector('.accommodation-roomspace');
    var priceEl = el.querySelector('.offer__price .price');

    /* Parse area — textContent is like "50,00 m2" */
    var area = '';
    if (metersEl) {
      var am = metersEl.textContent.match(/([\d,.]+)\s*m/i);
      if (am) area = am[1].replace(',00', '').replace('.00', '');
    }

    /* Parse guests */
    var guests = '';
    if (guestsEl) {
      var gm = guestsEl.textContent.match(/(\d+)/);
      if (gm) guests = gm[1];
    }

    /* Parse price */
    var price = '';
    if (priceEl) {
      var pm = priceEl.textContent.match(/([\d,.]+)/);
      if (pm) price = pm[1].replace('.00', '');
    }

    offers.push({
      href: href,
      img: img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '',
      alt: img ? (img.alt || '').trim() : '',
      title: title ? title.textContent.trim() : '',
      desc: desc ? desc.textContent.trim() : '',
      area: area,
      guests: guests,
      price: price
    });
  }

  /* First pass: originals only (non-cloned slick slides) */
  hotspot.querySelectorAll('.slick-slide:not(.slick-cloned) .offer').forEach(extractOffer);

  /* Fallback: if slick not initialized, read all .offer elements */
  if (!offers.length) {
    hotspot.querySelectorAll('.offer').forEach(extractOffer);
  }

  if (!offers.length) return;

  /* Build card HTML */
  function buildCard(o) {
    var meta = '';
    if (o.area) meta += '<span class="' + PREFIX + '-offer-card__meta-item">' + iconArea + o.area + ' m\u00B2</span>';
    if (o.guests) meta += '<span class="' + PREFIX + '-offer-card__meta-item">' + iconGuests + o.guests + ' os.</span>';

    var priceHTML = '';
    if (o.price) {
      priceHTML = '<span class="' + PREFIX + '-offer-card__price">od ' + o.price + ' z\u0142</span>';
    }

    return '<a href="' + o.href + '" class="' + PREFIX + '-offer-card">' +
      '<div class="' + PREFIX + '-offer-card__img">' +
        '<img src="' + o.img + '" alt="' + o.alt + '" loading="lazy">' +
        priceHTML +
      '</div>' +
      '<div class="' + PREFIX + '-offer-card__body">' +
        '<h3 class="' + PREFIX + '-offer-card__name">' + o.title + '</h3>' +
        (o.desc && o.desc !== o.title ? '<p class="' + PREFIX + '-offer-card__desc">' + o.desc + '</p>' : '') +
        (meta ? '<div class="' + PREFIX + '-offer-card__meta">' + meta + '</div>' : '') +
        '<span class="' + PREFIX + '-offer-card__cta">Zobacz szczeg\u00F3\u0142y \u2192</span>' +
      '</div>' +
    '</a>';
  }

  /* Build grid content */
  var cardsHTML = offers.map(function(o) { return buildCard(o); }).join('');

  /* Insert into grid — adjust selector per client */
  var grid = document.querySelector('.' + PREFIX + '-apartments__grid');
  if (grid) {
    grid.innerHTML = cardsHTML;
    grid.classList.remove(PREFIX + '-featured-fallback');
  }
})();
