/* ==========================================================
   SORS — Apartamenty: Embed offers into apartment cards
   Plik JS do wklejenia na podstronie Apartamenty (txt/201)
   ========================================================== */

(function () {
  'use strict';

  function embedOffers() {
    const hotspot = document.querySelector('.cmshotspot');
    if (!hotspot) return;

    const offers = hotspot.querySelectorAll('.offer');
    if (!offers.length) return;

    const aptItems = document.querySelectorAll('.et-apt__item');
    if (!aptItems.length) return;

    // Map: offer name keyword → offer element
    const offerMap = {};
    offers.forEach(function (offer) {
      const link = offer.querySelector('a.object-icon');
      const href = link ? link.getAttribute('href') : '';
      const img = offer.querySelector('img');
      const price = offer.querySelector('.offer__price .price');
      const meters = offer.querySelector('.accommodation-meters');
      const persons = offer.querySelector('.accommodation-roomspace');

      // Determine name by URL
      var key = '';
      if (href.toLowerCase().indexOf('eagle-nest') > -1) key = 'nest';
      if (href.toLowerCase().indexOf('eagle-view') > -1) key = 'view';

      if (key) {
        offerMap[key] = {
          href: href,
          imgSrc: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : '',
          imgAlt: img ? img.getAttribute('alt') : '',
          price: price ? price.textContent.trim().replace(/\s+/g, ' ') : '',
          meters: meters ? meters.textContent.trim() : '',
          persons: persons ? persons.textContent.trim() : '',
        };
      }
    });

    // Match each apt card to its offer
    aptItems.forEach(function (card) {
      // Guard: skip if already embedded (prevents double execution)
      if (card.querySelector('.et-apt__img')) return;

      var nameEl = card.querySelector('.et-apt__name');
      if (!nameEl) return;
      var name = nameEl.textContent.trim().toLowerCase();

      var offer = null;
      var correctHref = '';
      if (name.indexOf('nest') > -1) {
        offer = offerMap['nest'];
        correctHref = offer ? offer.href : '';
      } else if (name.indexOf('view') > -1) {
        offer = offerMap['view'];
        correctHref = offer ? offer.href : '';
      }

      if (!offer) return;

      // --- Fix link if needed ---
      var btn = card.querySelector('.et-btn');
      if (btn && correctHref) {
        btn.setAttribute('href', correctHref);
      }

      // --- Create image element ---
      if (offer.imgSrc) {
        var imgWrap = document.createElement('a');
        imgWrap.className = 'et-apt__img';
        imgWrap.href = correctHref;

        var img = document.createElement('img');
        img.src = offer.imgSrc;
        img.alt = offer.imgAlt || '';
        img.loading = 'lazy';
        imgWrap.appendChild(img);

        // Insert image before the num element (at the top of the card)
        var numEl = card.querySelector('.et-apt__num');
        if (numEl) {
          card.insertBefore(imgWrap, numEl);
        } else {
          card.insertBefore(imgWrap, card.firstChild);
        }
      }

      // --- Create price bar ---
      var priceBar = document.createElement('div');
      priceBar.className = 'et-apt__pricebar';

      var priceHTML = '';
      if (offer.price) {
        priceHTML += '<span class="et-apt__price-label">od</span>';
        priceHTML += '<span class="et-apt__price-value">' + offer.price + '</span>';
        priceHTML += '<span class="et-apt__price-suffix">/ noc</span>';
      }
      priceBar.innerHTML = priceHTML;

      // Insert price bar before the button
      if (btn) {
        btn.parentNode.insertBefore(priceBar, btn);
      } else {
        card.appendChild(priceBar);
      }
    });

    // --- Hide original cmshotspot section (only the hotspot, not parent container) ---
    hotspot.style.display = 'none';
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(embedOffers, 300);
    });
  } else {
    setTimeout(embedOffers, 300);
  }
})();
