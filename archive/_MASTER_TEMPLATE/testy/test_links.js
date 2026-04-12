/**
 * IdoSell — Universal Link & UX Test Script
 * ==========================================
 * Uruchom w Chrome DevTools Console na dowolnej stronie klienta.
 * Testuje: linki, telefony, emaile, obrazki, system orange, z-index, font-size, offer detail.
 *
 * Użycie:
 *   1. Otwórz stronę w Chrome
 *   2. F12 → Console
 *   3. Wklej cały ten skrypt i naciśnij Enter
 *   4. Wyniki pojawią się w konsoli (tabele + podsumowanie)
 *
 * Testowane strony:
 *   - / (homepage)
 *   - /offers
 *   - /contact
 *   - /txt/NNN/*
 *   - /offer/ID/*
 */
(function idosellLinkTest() {
  'use strict';

  var SYSTEM_ORANGE = 'rgb(173, 80, 9)';
  var EXPECTED_BODY_FONT = 16;
  var results = { pass: [], fail: [], warn: [] };

  function log(type, msg, detail) {
    results[type].push({ msg: msg, detail: detail });
  }

  // ═══════════════════════════════════════
  // TEST 1: All visible links
  // ═══════════════════════════════════════
  var allLinks = Array.from(document.querySelectorAll('a[href]'));
  var visibleLinks = allLinks.filter(function(a) {
    return a.offsetParent !== null && a.offsetWidth > 0;
  });

  console.group('%c[TEST 1] Links on page: ' + window.location.pathname, 'font-weight:bold; font-size:14px');
  console.table(visibleLinks.map(function(a) {
    return {
      href: a.href,
      text: a.textContent.trim().substring(0, 50),
      clickable: window.getComputedStyle(a).pointerEvents !== 'none',
      width: a.offsetWidth,
      height: a.offsetHeight
    };
  }));
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 2: Link href validation
  // ═══════════════════════════════════════
  console.group('%c[TEST 2] Link href validation', 'font-weight:bold; font-size:14px');

  visibleLinks.forEach(function(a) {
    var href = a.getAttribute('href');
    var text = a.textContent.trim().substring(0, 40);

    // /txt/ links must have numeric ID
    if (href && href.startsWith('/txt/') && !/^\/txt\/\d+\//.test(href)) {
      log('fail', 'Broken /txt/ link (missing ID)', { href: href, text: text, expected: '/txt/NNN/Slug' });
    }

    // tel: links should not have spaces
    if (href && href.startsWith('tel:') && /\s/.test(href.replace('tel:', ''))) {
      log('warn', 'Phone href has spaces', { href: href, text: text, fix: 'Remove spaces from phone number' });
    }

    // tel: with empty number
    if (href && href.startsWith('tel:') && href.replace('tel:', '').trim() === '') {
      log('warn', 'Empty phone number', { href: href, text: text });
    }

    // mailto: basic validation
    if (href && href.startsWith('mailto:') && !href.includes('@')) {
      log('fail', 'Invalid mailto link', { href: href, text: text });
    }

    // Empty or hash-only links
    if (href === '#' || href === '') {
      log('warn', 'Empty/placeholder link', { href: href, text: text });
    }

    // Placeholder data
    if (href && (href.includes('000000') || href.includes('placeholder') || href.includes('example.com'))) {
      log('fail', 'Placeholder href', { href: href, text: text });
    }

    // Pointer-events check
    if (window.getComputedStyle(a).pointerEvents === 'none') {
      log('fail', 'Link has pointer-events: none', { href: href, text: text });
    }

    // Zero-size link
    if (a.offsetWidth === 0 || a.offsetHeight === 0) {
      log('warn', 'Zero-size link (invisible)', { href: href, text: text, w: a.offsetWidth, h: a.offsetHeight });
    }
  });
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 3: System orange detection
  // ═══════════════════════════════════════
  console.group('%c[TEST 3] System orange (#AD5009) detection', 'font-weight:bold; font-size:14px');

  var allVisible = Array.from(document.querySelectorAll('*')).filter(function(el) {
    return el.offsetParent !== null && el.offsetWidth > 0;
  });
  var orangeElements = allVisible.filter(function(el) {
    var cs = window.getComputedStyle(el);
    return cs.color === SYSTEM_ORANGE || cs.backgroundColor === SYSTEM_ORANGE;
  });

  if (orangeElements.length > 0) {
    orangeElements.forEach(function(el) {
      log('fail', 'System orange element found', {
        tag: el.tagName,
        class: el.className.substring(0, 60),
        text: el.textContent.trim().substring(0, 40),
        property: window.getComputedStyle(el).color === SYSTEM_ORANGE ? 'color' : 'background'
      });
    });
    console.table(orangeElements.map(function(el) {
      return {
        tag: el.tagName,
        class: el.className.substring(0, 40),
        text: el.textContent.trim().substring(0, 40)
      };
    }));
  } else {
    log('pass', 'No system orange elements found', {});
  }
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 4: Body font-size check
  // ═══════════════════════════════════════
  console.group('%c[TEST 4] Body font-size', 'font-weight:bold; font-size:14px');

  var bodyFontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
  if (bodyFontSize > EXPECTED_BODY_FONT + 1) {
    log('fail', 'Body font-size NOT overridden', { actual: bodyFontSize + 'px', expected: EXPECTED_BODY_FONT + 'px', impact: 'All relative sizes will be 40% too large' });
  } else {
    log('pass', 'Body font-size correct', { actual: bodyFontSize + 'px' });
  }
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 5: Images (broken/missing)
  // ═══════════════════════════════════════
  console.group('%c[TEST 5] Images', 'font-weight:bold; font-size:14px');

  var images = Array.from(document.querySelectorAll('img'));
  var brokenImages = images.filter(function(img) {
    return img.naturalWidth === 0 && img.offsetParent !== null;
  });
  if (brokenImages.length > 0) {
    brokenImages.forEach(function(img) {
      log('warn', 'Broken image', {
        src: img.src.substring(0, 80),
        alt: img.alt,
        parent: img.parentElement ? img.parentElement.className.substring(0, 40) : ''
      });
    });
  } else {
    log('pass', 'All visible images loaded', { count: images.length });
  }
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 6: Search widget (homepage only)
  // ═══════════════════════════════════════
  if (document.body.classList.contains('page-index')) {
    console.group('%c[TEST 6] Search widget', 'font-weight:bold; font-size:14px');

    var indexInfo = document.querySelector('.index-info');
    if (indexInfo) {
      var cs6 = window.getComputedStyle(indexInfo);
      if (cs6.overflow !== 'visible') log('fail', '.index-info overflow not visible', { actual: cs6.overflow });
      else log('pass', '.index-info overflow: visible', {});

      if (parseInt(cs6.zIndex) < 1000) log('fail', '.index-info z-index too low', { actual: cs6.zIndex });
      else log('pass', '.index-info z-index >= 1000', { actual: cs6.zIndex });
    }

    var inputs = document.querySelectorAll('#iai_book_form input, #iai_book_form select');
    inputs.forEach(function(inp) {
      var z = window.getComputedStyle(inp).zIndex;
      if (z === '-1' || z === 'auto') {
        log('warn', 'Search input z-index issue', { id: inp.id, zIndex: z });
      }
    });
    console.groupEnd();
  }

  // ═══════════════════════════════════════
  // TEST 7: Offer detail page checks
  // ═══════════════════════════════════════
  if (document.body.classList.contains('page-offer')) {
    console.group('%c[TEST 7] Offer detail page', 'font-weight:bold; font-size:14px');

    var priceEl = document.querySelector('.offer-price');
    if (priceEl) {
      var w = priceEl.offsetWidth;
      var h = priceEl.offsetHeight;
      if (Math.abs(w - h) > 5) {
        log('fail', 'Price not circular', { width: w, height: h });
      } else {
        log('pass', 'Price circle OK', { width: w, height: h });
      }
    }

    var bookForm = document.querySelector('#iai_book_form');
    if (bookForm) {
      var cs7 = window.getComputedStyle(bookForm);
      if (cs7.display !== 'none' && bookForm.offsetHeight > 10) {
        log('fail', 'Ghost booking form visible', { display: cs7.display, height: bookForm.offsetHeight });
      } else {
        log('pass', 'Booking form hidden', {});
      }
    }

    var rezBtn = document.querySelector('.accommodation-leftbutton');
    if (rezBtn) {
      var fontSize = parseFloat(window.getComputedStyle(rezBtn).fontSize);
      if (fontSize > 16) {
        log('warn', 'ZAREZERWUJ button font too large', { fontSize: fontSize + 'px' });
      } else {
        log('pass', 'ZAREZERWUJ button font OK', { fontSize: fontSize + 'px' });
      }
    }
    console.groupEnd();
  }

  // ═══════════════════════════════════════
  // TEST 8: .iai-search hidden on /offers
  // ═══════════════════════════════════════
  if (document.body.classList.contains('page-offers')) {
    console.group('%c[TEST 8] .iai-search on /offers', 'font-weight:bold; font-size:14px');
    var iaiSearch = document.querySelector('.iai-search');
    if (iaiSearch) {
      var display = window.getComputedStyle(iaiSearch).display;
      if (display !== 'none') {
        log('fail', '.iai-search visible on /offers', { display: display });
      } else {
        log('pass', '.iai-search hidden on /offers', {});
      }
    }
    console.groupEnd();
  }

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  var total = results.pass.length + results.fail.length + results.warn.length;
  console.log('\n');
  console.log(
    '%c' + String.fromCharCode(9556) + Array(45).join(String.fromCharCode(9552)) + String.fromCharCode(9559) + '\n' +
    String.fromCharCode(9553) + '  IDOSELL LINK & UX TEST RESULTS          ' + String.fromCharCode(9553) + '\n' +
    String.fromCharCode(9562) + Array(45).join(String.fromCharCode(9552)) + String.fromCharCode(9565),
    'color: #27ae60; font-weight: bold; font-size: 16px'
  );
  console.log('%cPage: ' + window.location.pathname, 'font-size: 12px');
  console.log('%cDate: ' + new Date().toISOString(), 'font-size: 12px');
  console.log(
    '%cPASS: ' + results.pass.length + '  |  FAIL: ' + results.fail.length + '  |  WARN: ' + results.warn.length,
    'font-size: 14px; font-weight: bold; color: ' + (results.fail.length > 0 ? '#c0392b' : '#27ae60')
  );

  if (results.fail.length > 0) {
    console.group('%cFAILURES', 'color: #c0392b; font-weight: bold');
    results.fail.forEach(function(f) { console.log('  FAIL: ' + f.msg, f.detail); });
    console.groupEnd();
  }
  if (results.warn.length > 0) {
    console.group('%cWARNINGS', 'color: #f39c12; font-weight: bold');
    results.warn.forEach(function(w) { console.log('  WARN: ' + w.msg, w.detail); });
    console.groupEnd();
  }
  if (results.pass.length > 0) {
    console.group('%cPASSED', 'color: #27ae60; font-weight: bold');
    results.pass.forEach(function(p) { console.log('  PASS: ' + p.msg, p.detail); });
    console.groupEnd();
  }

  return {
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    pass: results.pass.length,
    fail: results.fail.length,
    warn: results.warn.length,
    failures: results.fail,
    warnings: results.warn
  };
})();
