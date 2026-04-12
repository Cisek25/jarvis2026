/**
 * WAWA BED® — JS strony głównej v1
 * Bed & Breakfast w Warszawie — IdoBooking CMS
 * Wklej do: Panel IdoBooking → Ustawienia → body_bottom_code_1
 *
 * Prefiks klas: wb-
 * Wymagania: Vanilla JS, IE11+, bez jQuery
 */

(function () {
  'use strict';

  /* ================================================================
     STAŁE GLOBALNE
     ================================================================ */
  var MAX_OFFERS = 10;
  var AUTOPLAY_INTERVAL = 5000;

  /* ================================================================
     NARZĘDZIA (helpers)
     ================================================================ */

  /** Debounce — opóźnia wywołanie funkcji do czasu spokoju */
  function debounce(fn, delay) {
    var timer;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  /** Prosta animacja rAF z easing */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* ================================================================
     1. SMOOTH SCROLL — przewijanie do kotw
     ================================================================ */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href.length < 2) return;
        var target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ================================================================
     2. REVEAL ANIMATIONS — .wb-reveal → .wb-in
     Fade up z translateY(30px), stagger dzieci
     ================================================================ */
  function initRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      /* Fallback — pokaż wszystkie od razu */
      var allReveal = document.querySelectorAll('.wb-reveal');
      for (var f = 0; f < allReveal.length; f++) {
        allReveal[f].classList.add('wb-in');
      }
      return;
    }

    var els = document.querySelectorAll('.wb-reveal');
    if (!els.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('wb-in');

        /* Stagger dla bezpośrednich dzieci z klasą .wb-stagger */
        var children = el.querySelectorAll('.wb-stagger');
        children.forEach(function (child, idx) {
          child.style.transitionDelay = (idx * 0.12) + 's';
        });

        obs.unobserve(el);
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ================================================================
     3. PARTICLES — złote cząsteczki canvas na .wb-dark-section
     Max 35 cząsteczek, animacja tylko gdy widoczne
     ================================================================ */
  function initParticles() {
    if (!('IntersectionObserver' in window)) return;

    /* Sprawdź czy element ma ciemne tło */
    function isDarkSection(el) {
      var cs = window.getComputedStyle(el);
      var bg = cs.backgroundColor;
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (m) {
        var r = parseInt(m[1], 10);
        var g = parseInt(m[2], 10);
        var b = parseInt(m[3], 10);
        var a = m[4] !== undefined ? parseFloat(m[4]) : 1;
        if (a > 0.3 && r < 80 && g < 80 && b < 100) return true;
      }
      /* Sprawdź gradient */
      var bgImg = cs.backgroundImage || '';
      if (bgImg.indexOf('linear-gradient') !== -1) {
        var colorMatches = bgImg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g) || [];
        var darkCount = 0;
        colorMatches.forEach(function (c) {
          var cm = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
          if (cm && parseInt(cm[1], 10) < 80 && parseInt(cm[2], 10) < 80) darkCount++;
        });
        if (colorMatches.length && darkCount >= colorMatches.length / 2) return true;
      }
      return false;
    }

    /* Zbierz ciemne sekcje: jawne + wykryte */
    var darkSections = [];
    var candidates = document.querySelectorAll(
      '.wb-dark-section, [class*="dark"], [class*="navy"], [class*="dark-bg"]'
    );
    var allSections = document.querySelectorAll('section, .cmshotspot, .section');

    /* Jawnie oznaczone */
    candidates.forEach(function (el) {
      if (el.offsetHeight > 150 && el.offsetWidth > 200) {
        darkSections.push(el);
      }
    });

    /* Automatycznie wykryte */
    allSections.forEach(function (el) {
      if (el.offsetHeight > 200 && el.offsetWidth > 200 && isDarkSection(el)) {
        var already = false;
        darkSections.forEach(function (s) { if (s === el) already = true; });
        if (!already) darkSections.push(el);
      }
    });

    darkSections.forEach(function (section) {
      if (section.querySelector('.wb-particles-canvas')) return;

      var pos = window.getComputedStyle(section).position;
      if (pos === 'static') section.style.position = 'relative';
      section.style.overflow = 'hidden';

      var canvas = document.createElement('canvas');
      canvas.className = 'wb-particles-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;' +
        'pointer-events:none;z-index:1;opacity:0.55;';
      section.insertBefore(canvas, section.firstChild);

      var ctx = canvas.getContext('2d');
      var particles = [];
      var rafId = null;

      function resize() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
      }
      resize();

      /* Liczba cząsteczek zależna od rozmiaru sekcji, max 35 */
      var count = Math.min(35, Math.max(8, Math.floor(
        (section.offsetWidth * section.offsetHeight) / 22000
      )));

      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.6 + 0.4,
          dx: (Math.random() - 0.5) * 0.28,
          dy: -(Math.random() * 0.28 + 0.06),
          alpha: Math.random() * 0.45 + 0.18,
          pulse: Math.random() * Math.PI * 2
        });
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(function (p) {
          p.x += p.dx;
          p.y += p.dy;
          p.pulse += 0.016;

          /* Wrap around granice */
          if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
          if (p.x < -8) p.x = canvas.width + 8;
          if (p.x > canvas.width + 8) p.x = -8;

          var a = p.alpha * (0.65 + 0.35 * Math.sin(p.pulse));

          /* Rdzeń cząsteczki — złoty */
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(194,121,0,' + a + ')';
          ctx.fill();

          /* Poświata / glow */
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(194,121,0,' + (a * 0.12) + ')';
          ctx.fill();
        });

        rafId = requestAnimationFrame(animate);
      }

      /* Animuj tylko gdy sekcja jest widoczna — oszczędność CPU */
      var visObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            resize();
            if (!rafId) animate();
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          }
        });
      }, { threshold: 0.05 });
      visObs.observe(section);

      window.addEventListener('resize', debounce(function () {
        resize();
      }, 250));
    });
  }

  /* ================================================================
     4. KARUZELA OFERT — główna funkcja
     Wyciąga dane z IdoBooking CMS i buduje własną karuzelę
     ================================================================ */

  /**
   * Wyciąga dane oferty z elementu CMS IdoBooking.
   * Obsługuje wiele wariantów selektorów stosowanych przez IdoBooking.
   */
  function extractOfferData(el) {
    var data = {
      title: '',
      link: '',
      image: '',
      area: '',
      persons: '',
      description: '',
      price: '',
      pricePrefix: 'od'
    };

    /* === TYTUŁ + LINK === */
    var titleLink = el.querySelector('h3 a, h2 a, .offer__title a, .objectslist-data a');
    if (titleLink) {
      data.title = titleLink.textContent.trim();
      data.link = titleLink.href;
    } else {
      /* Fallback — szukaj linka z href zawierającym "object" */
      var anyLink = el.querySelector('a[href*="object"], a[href*="offer"]');
      if (anyLink) {
        data.link = anyLink.href;
        if (!data.title) data.title = anyLink.textContent.trim();
      }
    }

    /* === ZDJĘCIE === */
    var imgEl = el.querySelector(
      '.object-icon img, .offer__image img, .objectslist-image img, img[src*="object"], img[data-src]'
    );
    if (imgEl) {
      data.image = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || '';
    } else {
      /* Tło CSS z background-image */
      var bgEl = el.querySelector('[style*="background-image"]');
      if (bgEl) {
        var bgStyle = bgEl.style.backgroundImage || '';
        var bgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (bgMatch) data.image = bgMatch[1];
      }
    }

    /* === POWIERZCHNIA i OSOBY === */
    /* Dedykowane klasy IdoBooking */
    var metersEl = el.querySelector('.accommodation-meters, [class*="meters"], [class*="area"]');
    if (metersEl) data.area = metersEl.textContent.trim().replace(/m2/gi, 'm²');

    var personsEl = el.querySelector(
      '.accommodation-roomspace, [class*="roomspace"], [class*="persons"], [class*="capacity"]'
    );
    if (personsEl) data.persons = personsEl.textContent.trim();

    /* Fallback — wszystkie spany w .offer__info */
    if (!data.area && !data.persons) {
      var infoSpans = el.querySelectorAll('.offer__info span, .objectslist-info span');
      infoSpans.forEach(function (span) {
        var text = span.textContent.trim();
        if ((text.indexOf('m²') !== -1 || text.indexOf('m2') !== -1) && !data.area) {
          data.area = text.replace(/m2/gi, 'm²');
        } else if (text.match(/\d+\s*(os|osob|person)/i) && !data.persons) {
          data.persons = text;
        } else if (text.match(/^\d{1,2}$/) && !data.persons) {
          /* Sama liczba — zakładamy liczbę osób */
          data.persons = text + ' os.';
        }
      });
    }

    /* === OPIS === */
    var descEl = el.querySelector(
      '.offer__description, .offer__hover .offer__description, .objectslist-description, [class*="description"]'
    );
    if (descEl) data.description = descEl.textContent.trim().substring(0, 120);

    /* === CENA === */
    var priceEl = el.querySelector('.offer__price .price, .objectslist-price .price, [class*="price-value"]');
    if (priceEl) data.price = priceEl.textContent.trim();

    var priceLabelEl = el.querySelector('.offer__price small, .objectslist-price small, [class*="price-label"]');
    if (priceLabelEl) data.pricePrefix = priceLabelEl.textContent.trim();

    /* Fallback — wyszukaj wzorzec cenowy "xxx PLN" lub "xxx zł" */
    if (!data.price) {
      var priceText = el.textContent.match(/(\d[\d\s]+)\s*(PLN|zł)/i);
      if (priceText) data.price = priceText[1].trim() + ' ' + priceText[2];
    }

    return data;
  }

  /**
   * Buduje kartę HTML dla oferty
   */
  function createOfferCard(data) {
    var card = document.createElement('div');
    card.className = 'wb-offer-card';

    /* Badge cenowy */
    var badgeHtml = '';
    if (data.price) {
      badgeHtml = '<span class="wb-offer-badge">' +
        data.pricePrefix + ' ' + data.price +
        '</span>';
    }

    /* Szczegóły pokoju */
    var detailsHtml = '';
    if (data.area || data.persons) {
      detailsHtml = '<div class="wb-offer-details">';
      if (data.area) detailsHtml += '<span class="wb-offer-detail"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> ' + data.area + '</span>';
      if (data.persons) detailsHtml += '<span class="wb-offer-detail"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ' + data.persons + '</span>';
      detailsHtml += '</div>';
    }

    /* Opis */
    var descHtml = data.description
      ? '<p class="wb-offer-desc">' + data.description + (data.description.length >= 120 ? '...' : '') + '</p>'
      : '';

    card.innerHTML =
      '<div class="wb-offer-img" style="background-image:url(\'' + data.image + '\')">' +
        badgeHtml +
      '</div>' +
      '<div class="wb-offer-content">' +
        '<h3 class="wb-offer-name">' + (data.title || 'Pokój') + '</h3>' +
        detailsHtml +
        descHtml +
        '<a href="' + (data.link || '#') + '" class="wb-offer-btn">Sprawdź dostępność</a>' +
      '</div>';

    return card;
  }

  /**
   * Logika karuzeli — navigacja stronami, dots, swipe, autoplay
   */
  function buildCarousel(offerDataArr, containerEl) {
    if (!containerEl || !offerDataArr.length) return;

    /* Buduj wrappery */
    var wrap = document.createElement('div');
    wrap.className = 'wb-carousel-wrap';

    var inner = document.createElement('div');
    inner.className = 'wb-carousel-inner';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'wb-carousel-btn wb-carousel-prev';
    prevBtn.setAttribute('aria-label', 'Poprzedni pokój');
    prevBtn.innerHTML = '&#8249;';

    var track = document.createElement('div');
    track.className = 'wb-carousel-track';

    /* Wstaw karty */
    offerDataArr.forEach(function (data) {
      track.appendChild(createOfferCard(data));
    });

    var nextBtn = document.createElement('button');
    nextBtn.className = 'wb-carousel-btn wb-carousel-next';
    nextBtn.setAttribute('aria-label', 'Następny pokój');
    nextBtn.innerHTML = '&#8250;';

    inner.appendChild(prevBtn);
    inner.appendChild(track);
    inner.appendChild(nextBtn);
    wrap.appendChild(inner);

    /* Dots */
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'wb-carousel-dots';
    wrap.appendChild(dotsWrap);

    var currentPage = 0;
    var autoplayTimer = null;
    var isPaused = false;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.ceil(offerDataArr.length / getVisibleCount());
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var total = getTotalPages();
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.className = 'wb-carousel-dot' + (i === currentPage ? ' wb-dot-active' : '');
        dot.setAttribute('aria-label', 'Strona ' + (i + 1));
        (function (pi) {
          dot.addEventListener('click', function () { goToPage(pi); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function goToPage(page) {
      var total = getTotalPages();
      if (page < 0) page = total - 1;
      if (page >= total) page = 0;
      currentPage = page;

      var vis = getVisibleCount();
      /* Szerokość karty = szerokość track / visible — margin 24px */
      var cardWidth = 0;
      if (track.children[0]) {
        /* Oblicz rzeczywistą szerokość karty z marginesem */
        var trackWidth = track.offsetWidth;
        var gap = 24;
        cardWidth = (trackWidth - (gap * (vis - 1))) / vis + gap;
      }

      track.style.transform = 'translateX(-' + (currentPage * vis * cardWidth) + 'px)';

      var dots = dotsWrap.querySelectorAll('.wb-carousel-dot');
      dots.forEach(function (d, idx) {
        d.classList.toggle('wb-dot-active', idx === currentPage);
      });
    }

    buildDots();

    /* Przyciski nawigacji */
    prevBtn.addEventListener('click', function () {
      goToPage(currentPage - 1);
      resetAutoplay();
    });
    nextBtn.addEventListener('click', function () {
      goToPage(currentPage + 1);
      resetAutoplay();
    });

    /* Autoplay */
    function startAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () {
        if (!isPaused) goToPage(currentPage + 1);
      }, AUTOPLAY_INTERVAL);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    /* Pauza na hover */
    wrap.addEventListener('mouseenter', function () { isPaused = true; });
    wrap.addEventListener('mouseleave', function () { isPaused = false; });
    wrap.addEventListener('focusin', function () { isPaused = true; });
    wrap.addEventListener('focusout', function () { isPaused = false; });

    startAutoplay();

    /* Swipe / touch */
    var touchStartX = 0;
    var touchStartY = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diffX = touchStartX - e.changedTouches[0].clientX;
      var diffY = touchStartY - e.changedTouches[0].clientY;
      /* Sprawdź czy to gest poziomy */
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) goToPage(currentPage + 1);
        else goToPage(currentPage - 1);
        resetAutoplay();
      }
    }, { passive: true });

    /* Rebuild dots i reset pozycji przy resize */
    window.addEventListener('resize', debounce(function () {
      currentPage = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
    }, 250));

    /* Wstaw do DOM */
    containerEl.appendChild(wrap);
  }

  /**
   * Główna funkcja inicjalizacji karuzeli ofert
   * Przeszukuje DOM IdoBooking pod kątem elementów ofert
   */
  function initOffersCarousel() {
    /* Szukaj kontenera karuzeli w HTML — musi być umieszczony przez CSS/HTML CMS */
    var carouselContainer = document.querySelector('.wb-carousel-track');
    /* Jeśli HTML wstrzykuje kontener wb-carousel-track przez CMS HTML, użyj nadrzędnego */
    var carouselWrapper = document.querySelector('.wb-carousel-wrap');
    var insertTarget = document.querySelector('.wb-offers-section, [data-wb-carousel]');

    /* Zbierz oferty z IdoBooking */
    var OFFER_SELECTORS = [
      /* Slick slider — promoted objects */
      '.promoted-objects-container .slick-slide:not(.slick-cloned) .offer',
      '.promoted-objects .slick-slide:not(.slick-cloned) .offer',
      /* Bezpośrednie listy */
      '.offerslist .offer',
      '.objects-list .offer',
      '.objectslist .offer',
      /* Hotspot */
      '.cmshotspot .offer',
      /* Fallback ogólny */
      '.offer'
    ];

    var rawOffers = [];
    var usedSelector = '';

    for (var si = 0; si < OFFER_SELECTORS.length; si++) {
      var found = document.querySelectorAll(OFFER_SELECTORS[si]);
      if (found.length > 0) {
        rawOffers = Array.prototype.slice.call(found);
        usedSelector = OFFER_SELECTORS[si];
        break;
      }
    }

    /* Jeśli nie znaleziono przez selektor .offer, szukaj obiektów z linkami do ofert */
    if (!rawOffers.length) {
      var objectLinks = document.querySelectorAll('a[href*="object"], a[href*="/offer/"], .object-icon');
      var parentSet = [];
      objectLinks.forEach(function (link) {
        var parent = link.closest('li, article, .col, .column, [class*="object"]') || link.parentElement;
        if (parent && parentSet.indexOf(parent) === -1) parentSet.push(parent);
      });
      rawOffers = parentSet;
    }

    if (!rawOffers.length) return; /* Brak ofert — nic nie rób */

    /* Deduplikacja po linku */
    var seen = {};
    var uniqueOffers = [];
    rawOffers.forEach(function (el) {
      var data = extractOfferData(el);
      if (data.link && !seen[data.link]) {
        seen[data.link] = true;
        uniqueOffers.push(data);
      } else if (!data.link && data.title && !seen[data.title]) {
        seen[data.title] = true;
        uniqueOffers.push(data);
      }
    });

    /* Ogranicz do MAX_OFFERS */
    if (uniqueOffers.length > MAX_OFFERS) {
      uniqueOffers = uniqueOffers.slice(0, MAX_OFFERS);
    }

    if (!uniqueOffers.length) return;

    /* Znajdź lub utwórz kontener karuzeli */
    var container = document.querySelector('.wb-offers-carousel');
    if (!container) {
      /* Spróbuj wstrzyknąć przed/za źródłem ofert */
      var sourceEl = document.querySelector(
        '.promoted-objects-container, .promoted-objects, .offerslist, .cmshotspot, .objects-list'
      );
      if (sourceEl) {
        container = document.createElement('div');
        container.className = 'wb-offers-carousel';
        sourceEl.parentNode.insertBefore(container, sourceEl);
        /* Ukryj oryginalny kontener CMS */
        sourceEl.style.display = 'none';
      }
    }

    if (!container) return;

    /* Jeśli karuzela już zbudowana — wyczyść */
    if (container.querySelector('.wb-carousel-wrap')) return;

    buildCarousel(uniqueOffers, container);
  }

  /* ================================================================
     5. HERO ENHANCEMENT
     - Poprawka znaku ® w tytule h1
     - Subtelny parallax na scrollu
     ================================================================ */
  function initHeroEnhancement() {
    /* Poprawka ® — zamień na stylowany sup */
    var h1 = document.querySelector('.section.parallax h1, .hero h1, .vk-hero h1');
    if (h1) {
      var target = h1.querySelector('b') || h1;
      var text = target.innerHTML || '';
      if (text.indexOf('®') !== -1 || text.indexOf('&reg;') !== -1) {
        var clean = text.replace(/®|&reg;/g, '');
        target.innerHTML = clean +
          '<sup style="font-size:0.28em;font-weight:400;vertical-align:super;opacity:0.4;' +
          'letter-spacing:0;margin-left:0.1em;">®</sup>';
      }
    }

    /* Parallax hero content na scrollu — delikatne unoszenie */
    var heroSection = document.querySelector('.section.parallax, .wb-hero, .hero');
    if (!heroSection) return;

    var heroContent = heroSection.querySelector('.wb-hero-content, .parallax-content, h1');
    if (!heroContent) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          var heroH = heroSection.offsetHeight;
          if (scrollY < heroH) {
            var shift = scrollY * 0.15;
            var opacity = Math.max(0, 1 - scrollY / (heroH * 0.7));
            heroContent.style.transform = 'translateY(' + shift + 'px)';
            heroContent.style.opacity = opacity;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ================================================================
     6. ART DECO GEOMETRIC DIVIDERS
     Animacja geometrycznych elementów dekoracyjnych na scrollu
     ================================================================ */
  function initArtDecoDividers() {
    if (!('IntersectionObserver' in window)) return;

    var dividers = document.querySelectorAll(
      '.wb-divider, .wb-art-deco, [class*="wb-geo"], [class*="wb-deco"]'
    );
    if (!dividers.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('wb-deco-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    dividers.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'scaleX(0)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      obs.observe(el);
    });

    /* Dodaj styl aktywny dynamicznie */
    if (!document.getElementById('wb-deco-style')) {
      var style = document.createElement('style');
      style.id = 'wb-deco-style';
      style.textContent = '.wb-deco-visible { opacity: 1 !important; transform: scaleX(1) !important; }';
      document.head.appendChild(style);
    }
  }

  /* ================================================================
     7. COUNTER ANIMATION — animacja liczników statystyk
     Obsługuje [data-target] lub tekstowe liczby w .wb-counter
     ================================================================ */
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    var counters = document.querySelectorAll('[data-target].wb-counter, .wb-stat-num[data-target]');
    if (!counters.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);

        var el = entry.target;
        var targetVal = parseFloat(el.getAttribute('data-target'));
        var suffix = el.getAttribute('data-suffix') || '';
        var isFloat = targetVal % 1 !== 0;
        var duration = 1800;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var val = targetVal * easeOutCubic(progress);

          if (isFloat) {
            el.textContent = val.toFixed(1) + suffix;
          } else {
            el.textContent = Math.floor(val).toLocaleString('pl-PL') + suffix;
          }

          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = (isFloat ? targetVal.toFixed(1) : targetVal.toLocaleString('pl-PL')) + suffix;
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { obs.observe(el); });
  }

  /* ================================================================
     8. LAZY IMAGE LOADING — blur-up effect
     Progresywne ładowanie obrazów z efektem rozmycia
     ================================================================ */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    var lazyImgs = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    if (!lazyImgs.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target;

        /* Blur-up: zanim załaduje — rozmyj */
        img.style.filter = 'blur(8px)';
        img.style.transition = 'filter 0.5s ease';

        var src = img.getAttribute('data-src');
        if (src) {
          var tempImg = new Image();
          tempImg.onload = function () {
            img.src = src;
            img.removeAttribute('data-src');
            img.style.filter = 'blur(0)';
          };
          tempImg.src = src;
        } else {
          /* Samo "loading=lazy" — przeglądarka obsługuje natively, dodaj blur transition */
          img.addEventListener('load', function () {
            img.style.filter = 'blur(0)';
          }, { once: true });
        }

        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImgs.forEach(function (img) { obs.observe(img); });
  }

  /* ================================================================
     9. MAP SECTION — leniwe ładowanie iframe Google Maps
     ================================================================ */
  function initMapLazyLoad() {
    if (!('IntersectionObserver' in window)) return;

    var mapContainers = document.querySelectorAll('.wb-map, [data-map-src], .wb-location-map');
    mapContainers.forEach(function (container) {
      var src = container.getAttribute('data-map-src') || container.getAttribute('data-src');
      if (!src) return;

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);

          var iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.style.cssText = 'width:100%;height:100%;border:0;';
          container.appendChild(iframe);
          container.classList.add('wb-map-loaded');
        });
      }, { rootMargin: '300px 0px' });

      obs.observe(container);
    });

    /* Również aktywuj istniejące iframes z data-src */
    var lazyIframes = document.querySelectorAll('iframe[data-src]');
    if (!lazyIframes.length) return;

    var iframeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var iframe = entry.target;
        var src = iframe.getAttribute('data-src');
        if (src) {
          iframe.src = src;
          iframe.removeAttribute('data-src');
        }
        iframeObs.unobserve(iframe);
      });
    }, { rootMargin: '400px 0px' });

    lazyIframes.forEach(function (iframe) { iframeObs.observe(iframe); });
  }

  /* ================================================================
     10. TESTIMONIALS — auto-rotacja opinii gości
     ================================================================ */
  function initTestimonials() {
    var testimonialWrap = document.querySelector('.wb-testimonials, .wb-reviews-slider');
    if (!testimonialWrap) return;

    var items = testimonialWrap.querySelectorAll('.wb-testimonial, .wb-review-item');
    if (items.length < 2) return;

    var current = 0;

    /* Ustaw stan początkowy */
    items.forEach(function (item, idx) {
      item.style.display = idx === 0 ? '' : 'none';
      item.style.transition = 'opacity 0.5s ease';
    });

    function showItem(idx) {
      items[current].style.opacity = '0';
      var prev = current;
      setTimeout(function () {
        items[prev].style.display = 'none';
        current = idx;
        if (current >= items.length) current = 0;
        if (current < 0) current = items.length - 1;
        items[current].style.display = '';
        requestAnimationFrame(function () {
          items[current].style.opacity = '1';
        });
      }, 500);
    }

    /* Auto-rotate co 6 sekund */
    var testimonialTimer = setInterval(function () {
      showItem(current + 1);
    }, 6000);

    /* Pauza na hover */
    testimonialWrap.addEventListener('mouseenter', function () { clearInterval(testimonialTimer); });
    testimonialWrap.addEventListener('mouseleave', function () {
      testimonialTimer = setInterval(function () { showItem(current + 1); }, 6000);
    });
  }

  /* ================================================================
     11. MOBILE MENU ENHANCEMENT
     Ulepszenia dla hamburger menu na urządzeniach mobilnych
     ================================================================ */
  function initMobileMenu() {
    /* IdoBooking CMS używa różnych klas dla menu */
    var hamburgerSelectors = [
      '.menu-toggle',
      '.hamburger',
      '.mobile-menu-btn',
      '[class*="menu-icon"]',
      '[class*="burger"]',
      'button[aria-label*="menu" i]'
    ];

    var hamburger = null;
    for (var hi = 0; hi < hamburgerSelectors.length; hi++) {
      hamburger = document.querySelector(hamburgerSelectors[hi]);
      if (hamburger) break;
    }

    if (!hamburger) return;

    /* Dodaj klasę wb-menu-enhanced */
    hamburger.classList.add('wb-menu-enhanced');

    /* Obsługa ARIA */
    if (!hamburger.getAttribute('aria-expanded')) {
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', (!expanded).toString());
      document.body.classList.toggle('wb-menu-open');
    });

    /* Zamknij menu po kliknięciu poza nim */
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('wb-menu-open')) {
        var nav = document.querySelector('nav, .nav, [class*="navigation"]');
        if (nav && !nav.contains(e.target) && !hamburger.contains(e.target)) {
          document.body.classList.remove('wb-menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });

    /* Zamknij menu przy ESC */
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.keyCode === 27) && document.body.classList.contains('wb-menu-open')) {
        document.body.classList.remove('wb-menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });

    /* Swipe-down zamknięcie menu */
    var swipeStartY = 0;
    document.addEventListener('touchstart', function (e) {
      swipeStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      var diffY = e.changedTouches[0].clientY - swipeStartY;
      if (diffY > 80 && document.body.classList.contains('wb-menu-open')) {
        document.body.classList.remove('wb-menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }

  /* ================================================================
     12. NAV SCROLL — nawigacja zmienia styl po scrollu
     ================================================================ */
  function initNavScroll() {
    var nav = document.querySelector('nav, header, .header, .navbar, [class*="navigation"]');
    if (!nav) return;

    var scrolled = false;

    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      if (y > 80 && !scrolled) {
        nav.classList.add('wb-nav-scrolled');
        document.body.classList.add('wb-nav-scrolled');
        scrolled = true;
      } else if (y <= 80 && scrolled) {
        nav.classList.remove('wb-nav-scrolled');
        document.body.classList.remove('wb-nav-scrolled');
        scrolled = false;
      }
    }, { passive: true });
  }

  /* ================================================================
     13. SCROLL PROGRESS BAR — złoty pasek postępu przewijania
     ================================================================ */
  function initScrollProgress() {
    /* Tylko na dłuższych stronach */
    if (document.documentElement.scrollHeight <= window.innerHeight * 1.5) return;

    var bar = document.createElement('div');
    bar.className = 'wb-scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText =
      'position:fixed;top:0;left:0;height:3px;width:0%;' +
      'background:linear-gradient(90deg,#c27900,#f0a500);' +
      'z-index:99999;transition:width 0.1s linear;pointer-events:none;';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      var pct = (window.pageYOffset / h) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ================================================================
     14. BACK TO TOP — przycisk powrotu na górę
     ================================================================ */
  function initBackToTop() {
    /* IdoBooking często ma #backTop */
    var existing = document.getElementById('backTop');
    if (existing) {
      /* Ulepsz istniejący przycisk */
      existing.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
      existing.style.cssText =
        'display:flex !important;align-items:center;justify-content:center;' +
        'width:48px;height:48px;border-radius:50%;' +
        'background:#c27900;color:#fff;' +
        'box-shadow:0 4px 16px rgba(194,121,0,0.3);' +
        'border:2px solid rgba(255,255,255,0.2);' +
        'transition:background 0.3s,transform 0.3s;' +
        'position:fixed;bottom:24px;right:24px;z-index:9998;cursor:pointer;text-decoration:none;';
      existing.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      existing.addEventListener('mouseenter', function () {
        existing.style.transform = 'scale(1.1) translateY(-2px)';
      });
      existing.addEventListener('mouseleave', function () {
        existing.style.transform = 'scale(1) translateY(0)';
      });
      return;
    }

    /* Stwórz własny przycisk */
    var btn = document.createElement('button');
    btn.className = 'wb-back-top';
    btn.setAttribute('aria-label', 'Powrót na górę');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    btn.style.cssText =
      'display:none;align-items:center;justify-content:center;' +
      'width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;' +
      'background:#c27900;color:#fff;' +
      'box-shadow:0 4px 16px rgba(194,121,0,0.35);' +
      'position:fixed;bottom:24px;right:24px;z-index:9998;' +
      'transition:background 0.3s,transform 0.3s,opacity 0.3s;opacity:0;';
    document.body.appendChild(btn);

    var visible = false;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      if (y > 400 && !visible) {
        btn.style.display = 'flex';
        requestAnimationFrame(function () { btn.style.opacity = '1'; });
        visible = true;
      } else if (y <= 400 && visible) {
        btn.style.opacity = '0';
        setTimeout(function () { btn.style.display = 'none'; }, 300);
        visible = false;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btn.addEventListener('mouseenter', function () {
      btn.style.transform = 'scale(1.1) translateY(-2px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'scale(1) translateY(0)';
    });
  }

  /* ================================================================
     15. STAGGER SECTION CHILDREN — opóźnione pojawianie kart/sekcji
     ================================================================ */
  function initStagger() {
    if (!('IntersectionObserver' in window)) return;

    /* Grupy elementów do stagowania */
    var STAGGER_GROUPS = [
      '.wb-offer-card',
      '.wb-feature-item, .wb-advantage',
      '.wb-room-card',
      '.wb-amenity'
    ];

    STAGGER_GROUPS.forEach(function (selector) {
      var items = document.querySelectorAll(selector);
      if (!items.length) return;

      /* Grupuj rodzeństwo */
      var parents = [];
      items.forEach(function (item) {
        if (parents.indexOf(item.parentElement) === -1) {
          parents.push(item.parentElement);
        }
      });

      parents.forEach(function (parent) {
        var children = parent.querySelectorAll(selector);
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var siblings = parent.querySelectorAll(selector);
            siblings.forEach(function (sib, idx) {
              sib.style.transitionDelay = (idx * 0.1) + 's';
              sib.classList.add('wb-in');
            });
            obs.unobserve(parent);
          });
        }, { threshold: 0.1 });

        children.forEach(function (child) {
          if (!child.classList.contains('wb-reveal')) {
            child.classList.add('wb-reveal');
          }
        });
        obs.observe(parent);
      });
    });
  }

  /* ================================================================
     16. IDOBOOKING CMS — dodatkowe integracje
     Ukrywanie systemowych elementów, które CSS nie obsługuje
     ================================================================ */
  function initCmsIntegrations() {
    /* Ukryj pusty .index-info jeśli nie ma wyszukiwarki */
    var indexInfo = document.querySelector('.index-info');
    if (indexInfo && !indexInfo.querySelector('.iai-search, form')) {
      indexInfo.style.display = 'none';
    }

    /* Ukryj systemowy parallax jeśli mamy własny hero */
    var hasCustomHero = document.querySelector('.wb-hero, .wb-hero-custom');
    if (hasCustomHero) {
      var sysParallax = document.querySelector('.section.parallax');
      if (sysParallax) sysParallax.style.display = 'none';
    }

    /* Normalizacja cen — zamień "od" prefix na jednorodny styl */
    var priceLabels = document.querySelectorAll('.offer__price small');
    priceLabels.forEach(function (label) {
      var text = label.textContent.trim().toLowerCase();
      if (text === 'from' || text === 'od') label.textContent = 'od';
    });

    /* Dodaj loading="lazy" do wszystkich obrazów bez tego atrybutu */
    var imgs = document.querySelectorAll('img:not([loading])');
    imgs.forEach(function (img) {
      /* Nie dodawaj do pierwszych 3 obrazów — mogą być w viewport */
      var allImgs = document.querySelectorAll('img');
      var idx = Array.prototype.indexOf.call(allImgs, img);
      if (idx > 2) img.setAttribute('loading', 'lazy');
    });
  }

  /* ================================================================
     17. ACCESSIBILITY — podstawowe ulepszenia dostępności
     ================================================================ */
  function initAccessibility() {
    /* Focus visible — dodaj klasę gdy użytkownik używa klawiatury */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' || e.keyCode === 9) {
        document.body.classList.add('wb-keyboard-nav');
      }
    });
    document.addEventListener('mousedown', function () {
      document.body.classList.remove('wb-keyboard-nav');
    });

    /* Dodaj skip link jeśli brakuje */
    if (!document.querySelector('[href="#main-content"], [href="#content"], .skip-link')) {
      var skip = document.createElement('a');
      skip.href = '#content';
      skip.textContent = 'Przejdź do treści';
      skip.className = 'wb-skip-link';
      skip.style.cssText =
        'position:absolute;top:-999px;left:8px;z-index:99999;padding:8px 16px;' +
        'background:#c27900;color:#fff;border-radius:0 0 4px 4px;text-decoration:none;' +
        'font-weight:600;transition:top 0.2s;';
      skip.addEventListener('focus', function () { skip.style.top = '0'; });
      skip.addEventListener('blur', function () { skip.style.top = '-999px'; });
      document.body.insertBefore(skip, document.body.firstChild);
    }

    /* Upewnij się, że wszystkie obrazy mają alt */
    var imgsNoAlt = document.querySelectorAll('img:not([alt])');
    imgsNoAlt.forEach(function (img) {
      img.setAttribute('alt', '');
    });
  }

  /* ================================================================
     GŁÓWNA FUNKCJA INIT — wywołuje wszystkie moduły
     ================================================================ */
  function wbInit() {
    /* Natychmiastowe */
    initSmoothScroll();
    initAccessibility();
    initCmsIntegrations();
    initHeroEnhancement();
    initNavScroll();
    initScrollProgress();
    initBackToTop();
    initMobileMenu();

    /* Reveal i animacje */
    initRevealObserver();
    initArtDecoDividers();
    initStagger();
    initCounters();

    /* Multimedia */
    initLazyImages();
    initMapLazyLoad();

    /* Komponenty */
    initTestimonials();

    /* Karuzela ofert — z opóźnieniem by poczekać na CMS render */
    setTimeout(initOffersCarousel, 600);

    /* Particles — z większym opóźnieniem (cięższe obliczeniowo) */
    setTimeout(initParticles, 1000);
  }

  /* ================================================================
     PUNKT WEJŚCIA — obsługa readyState
     Script może być załadowany zanim lub po DOMContentLoaded
     ================================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wbInit);
  } else {
    /* DOM już załadowany */
    wbInit();
  }

  /* Fallback — window.load dla elementów renderowanych po DOMContentLoaded */
  window.addEventListener('load', function () {
    /* Ponów karuzele i particles gdyby CMS renderował lazy */
    setTimeout(initOffersCarousel, 400);
    setTimeout(initParticles, 800);
    initCounters();
    initRevealObserver();
  });

})();
