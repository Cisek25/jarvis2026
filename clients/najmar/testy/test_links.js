/**
 * Najmar / IdoSell — Link & UX Test Script
 * ==========================================
 * Uruchom w Chrome DevTools Console na dowolnej stronie klienta.
 * Testuje: linki, telefony, emaile, obrazki, system orange, z-index, font-size.
 *
 * Użycie:
 *   1. Otwórz stronę w Chrome
 *   2. F12 → Console
 *   3. Wklej cały ten skrypt i naciśnij Enter
 *   4. Wyniki pojawią się w konsoli (tabele + podsumowanie)
 */
(function idosellLinkTest() {
  'use strict';

  const BRAND_COLOR = '#4A6741';
  const SYSTEM_ORANGE = 'rgb(173, 80, 9)';
  const EXPECTED_BODY_FONT = 16;
  const results = { pass: [], fail: [], warn: [] };

  function log(type, msg, detail) {
    results[type].push({ msg, detail });
  }

  // ═══════════════════════════════════════
  // TEST 1: All visible links
  // ═══════════════════════════════════════
  const allLinks = Array.from(document.querySelectorAll('a[href]'));
  const visibleLinks = allLinks.filter(a => a.offsetParent !== null && a.offsetWidth > 0);

  console.group('%c[TEST 1] Links on page: ' + window.location.pathname, 'font-weight:bold; font-size:14px');
  console.table(visibleLinks.map(a => ({
    href: a.href,
    text: a.textContent.trim().substring(0, 50),
    clickable: window.getComputedStyle(a).pointerEvents !== 'none',
    width: a.offsetWidth,
    height: a.offsetHeight
  })));
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 2: Broken internal links (href pattern check)
  // ═══════════════════════════════════════
  console.group('%c[TEST 2] Link href validation', 'font-weight:bold; font-size:14px');

  visibleLinks.forEach(a => {
    const href = a.getAttribute('href');
    const text = a.textContent.trim().substring(0, 40);

    // Internal /txt/ links must have numeric ID: /txt/NNN/Slug
    if (href && href.startsWith('/txt/') && !/^\/txt\/\d+\//.test(href)) {
      log('fail', 'Broken /txt/ link (missing ID)', { href, text, expected: '/txt/NNN/Slug' });
    }

    // tel: links should not have spaces
    if (href && href.startsWith('tel:') && /\s/.test(href.replace('tel:', ''))) {
      log('warn', 'Phone href has spaces', { href, text, fix: 'Remove spaces from phone number' });
    }

    // mailto: basic validation
    if (href && href.startsWith('mailto:') && !href.includes('@')) {
      log('fail', 'Invalid mailto link', { href, text });
    }

    // Empty or hash-only links
    if (href === '#' || href === '') {
      log('warn', 'Empty/placeholder link', { href, text });
    }

    // Check for placeholder data
    if (href && (href.includes('000000') || href.includes('placeholder') || href.includes('example.com'))) {
      log('fail', 'Placeholder href', { href, text });
    }

    // Pointer-events check
    if (window.getComputedStyle(a).pointerEvents === 'none') {
      log('fail', 'Link has pointer-events: none', { href, text });
    }

    // Zero-size link
    if (a.offsetWidth === 0 || a.offsetHeight === 0) {
      log('warn', 'Zero-size link (invisible)', { href, text, w: a.offsetWidth, h: a.offsetHeight });
    }
  });
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 3: System orange detection
  // ═══════════════════════════════════════
  console.group('%c[TEST 3] System orange (#AD5009) detection', 'font-weight:bold; font-size:14px');

  const allVisible = Array.from(document.querySelectorAll('*')).filter(
    el => el.offsetParent !== null && el.offsetWidth > 0
  );
  const orangeElements = allVisible.filter(el => {
    const cs = window.getComputedStyle(el);
    return cs.color === SYSTEM_ORANGE || cs.backgroundColor === SYSTEM_ORANGE;
  });

  if (orangeElements.length > 0) {
    orangeElements.forEach(el => {
      log('fail', 'System orange element found', {
        tag: el.tagName,
        class: el.className.substring(0, 60),
        text: el.textContent.trim().substring(0, 40),
        property: window.getComputedStyle(el).color === SYSTEM_ORANGE ? 'color' : 'background'
      });
    });
    console.table(orangeElements.map(el => ({
      tag: el.tagName,
      class: el.className.substring(0, 40),
      text: el.textContent.trim().substring(0, 40)
    })));
  } else {
    log('pass', 'No system orange elements found', {});
  }
  console.groupEnd();

  // ═══════════════════════════════════════
  // TEST 4: Body font-size check
  // ═══════════════════════════════════════
  console.group('%c[TEST 4] Body font-size', 'font-weight:bold; font-size:14px');

  const bodyFontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
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

  const images = Array.from(document.querySelectorAll('img'));
  const brokenImages = images.filter(img => img.naturalWidth === 0 && img.offsetParent !== null);
  if (brokenImages.length > 0) {
    brokenImages.forEach(img => {
      log('fail', 'Broken image', { src: img.src.substring(0, 80), alt: img.alt });
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

    const indexInfo = document.querySelector('.index-info');
    if (indexInfo) {
      const cs = window.getComputedStyle(indexInfo);
      if (cs.overflow !== 'visible') log('fail', '.index-info overflow not visible', { actual: cs.overflow });
      else log('pass', '.index-info overflow: visible', {});

      if (parseInt(cs.zIndex) < 1000) log('fail', '.index-info z-index too low', { actual: cs.zIndex });
      else log('pass', '.index-info z-index >= 1000', { actual: cs.zIndex });
    }

    // Check inputs z-index
    const inputs = document.querySelectorAll('#iai_book_form input, #iai_book_form select');
    inputs.forEach(inp => {
      const z = window.getComputedStyle(inp).zIndex;
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

    // Price circle
    const priceEl = document.querySelector('.offer-price');
    if (priceEl) {
      const w = priceEl.offsetWidth;
      const h = priceEl.offsetHeight;
      if (Math.abs(w - h) > 5) {
        log('fail', 'Price not circular', { width: w, height: h });
      } else {
        log('pass', 'Price circle OK', { width: w, height: h });
      }
    }

    // Ghost form
    const bookForm = document.querySelector('#iai_book_form');
    if (bookForm) {
      const cs = window.getComputedStyle(bookForm);
      if (cs.display !== 'none' && bookForm.offsetHeight > 10) {
        log('fail', 'Ghost booking form visible', { display: cs.display, height: bookForm.offsetHeight });
      } else {
        log('pass', 'Booking form hidden', {});
      }
    }

    // ZAREZERWUJ button
    const rezBtn = document.querySelector('.accommodation-leftbutton');
    if (rezBtn) {
      const cs = window.getComputedStyle(rezBtn);
      const fontSize = parseFloat(cs.fontSize);
      if (fontSize > 16) {
        log('warn', 'ZAREZERWUJ button font too large', { fontSize: fontSize + 'px' });
      }
    }
    console.groupEnd();
  }

  // ═══════════════════════════════════════
  // TEST 8: Specific link targets (cross-page)
  // ═══════════════════════════════════════
  console.group('%c[TEST 8] Expected link targets', 'font-weight:bold; font-size:14px');

  const expectedLinks = {
    '/offers': 'Oferta nav link',
    '/contact': 'Kontakt nav link',
    '/txt/201/Atrakcje': 'Atrakcje nav link',
    '/txt/202/Dla-Wlascicieli': 'Dla Wlascicieli nav link'
  };

  Object.entries(expectedLinks).forEach(([path, desc]) => {
    const found = visibleLinks.some(a => {
      const url = new URL(a.href, window.location.origin);
      return url.pathname === path;
    });
    if (found) {
      log('pass', desc + ' present', { path });
    } else {
      log('warn', desc + ' NOT found', { path });
    }
  });
  console.groupEnd();

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  const total = results.pass.length + results.fail.length + results.warn.length;
  console.log('\n');
  console.log(
    '%c╔══════════════════════════════════════════╗\n' +
    '║  LINK & UX TEST RESULTS                  ║\n' +
    '╚══════════════════════════════════════════╝',
    'color: #4A6741; font-weight: bold; font-size: 16px'
  );
  console.log('%cPage: ' + window.location.pathname, 'font-size: 12px');
  console.log('%cDate: ' + new Date().toISOString(), 'font-size: 12px');
  console.log(
    '%c✅ PASS: ' + results.pass.length + '  |  ❌ FAIL: ' + results.fail.length + '  |  ⚠️ WARN: ' + results.warn.length,
    'font-size: 14px; font-weight: bold; color: ' + (results.fail.length > 0 ? '#c0392b' : '#27ae60')
  );

  if (results.fail.length > 0) {
    console.group('%c❌ FAILURES', 'color: #c0392b; font-weight: bold');
    results.fail.forEach(f => console.log('  ❌ ' + f.msg, f.detail));
    console.groupEnd();
  }
  if (results.warn.length > 0) {
    console.group('%c⚠️ WARNINGS', 'color: #f39c12; font-weight: bold');
    results.warn.forEach(w => console.log('  ⚠️ ' + w.msg, w.detail));
    console.groupEnd();
  }
  if (results.pass.length > 0) {
    console.group('%c✅ PASSED', 'color: #27ae60; font-weight: bold');
    results.pass.forEach(p => console.log('  ✅ ' + p.msg, p.detail));
    console.groupEnd();
  }

  // Return machine-readable results
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
