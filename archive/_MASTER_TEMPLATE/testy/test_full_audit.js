/**
 * IdoSell — Full Page Audit Script (Run per page)
 * =================================================
 * Bardziej szczegółowy test niż test_links.js.
 * Zwraca JSON z wynikami do porównania między stronami.
 *
 * Użycie: Wklej w Console na każdej stronie, zbierz wyniki.
 */
(function idosellFullAudit() {
  'use strict';
  var cs = window.getComputedStyle;
  var ORANGE = 'rgb(173, 80, 9)';
  var results = {};

  // Basic info
  results.page = window.location.pathname;
  results.timestamp = new Date().toISOString();
  results.bodyFont = parseFloat(cs(document.body).fontSize);
  results.bodyFontOK = results.bodyFont <= 17;

  // Orange scan
  var allEls = Array.from(document.querySelectorAll('*')).filter(function(e) { return e.offsetParent !== null; });
  var orangeEls = allEls.filter(function(e) {
    var s = cs(e);
    return s.color === ORANGE || s.backgroundColor === ORANGE;
  });
  results.orangeCount = orangeEls.length;
  results.orangeDetails = orangeEls.slice(0, 10).map(function(e) {
    return { tag: e.tagName, cls: e.className.substring(0, 50), text: e.textContent.trim().substring(0, 30) };
  });

  // Broken images
  var imgs = Array.from(document.querySelectorAll('img'));
  var broken = imgs.filter(function(i) { return i.naturalWidth === 0 && i.offsetParent !== null; });
  results.totalImages = imgs.length;
  results.brokenImages = broken.length;
  results.brokenImgDetails = broken.map(function(i) {
    return { src: i.src.substring(i.src.lastIndexOf('/') + 1), alt: i.alt, parent: i.parentElement ? i.parentElement.className.substring(0, 40) : '' };
  });

  // Phone links
  results.phones = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(function(a) {
    var href = a.getAttribute('href');
    return {
      href: href,
      text: a.textContent.trim().substring(0, 40),
      hasSpace: /\s/.test(href.replace('tel:', '')),
      isEmpty: href.replace('tel:', '').trim() === ''
    };
  });

  // Email links
  results.emails = Array.from(document.querySelectorAll('a[href^="mailto:"]')).map(function(a) {
    return {
      href: a.getAttribute('href'),
      text: a.textContent.trim().substring(0, 40),
      clickable: cs(a).pointerEvents !== 'none'
    };
  });

  // /txt/ links validation
  results.brokenTxtLinks = Array.from(document.querySelectorAll('a[href]')).filter(function(a) {
    var h = a.getAttribute('href');
    return h && h.startsWith('/txt/') && !/^\/txt\/\d+\//.test(h);
  }).map(function(a) {
    return { href: a.getAttribute('href'), text: a.textContent.trim().substring(0, 40) };
  });

  // Offer detail checks
  if (document.body.classList.contains('page-offer')) {
    var price = document.querySelector('.offer-price');
    results.priceCircle = price ? {
      w: price.offsetWidth, h: price.offsetHeight,
      circular: Math.abs(price.offsetWidth - price.offsetHeight) <= 5
    } : null;

    var form = document.querySelector('#iai_book_form');
    results.ghostFormVisible = form ? (cs(form).display !== 'none' && form.offsetHeight > 10) : false;

    var rezBtn = document.querySelector('.accommodation-leftbutton');
    results.rezBtnFont = rezBtn ? parseFloat(cs(rezBtn).fontSize) : null;
  }

  // Homepage checks
  if (document.body.classList.contains('page-index')) {
    var indexInfo = document.querySelector('.index-info');
    if (indexInfo) {
      var ics = cs(indexInfo);
      results.searchWidget = {
        overflow: ics.overflow,
        zIndex: parseInt(ics.zIndex),
        overflowOK: ics.overflow === 'visible',
        zIndexOK: parseInt(ics.zIndex) >= 1000
      };
    }
  }

  // /offers checks
  if (document.body.classList.contains('page-offers')) {
    var iaiSearch = document.querySelector('.iai-search');
    results.iaiSearchHidden = iaiSearch ? cs(iaiSearch).display === 'none' : true;
  }

  // Score
  var issues = 0;
  if (!results.bodyFontOK) issues++;
  if (results.orangeCount > 0) issues++;
  if (results.brokenTxtLinks.length > 0) issues++;
  if (results.phones.some(function(p) { return p.hasSpace; })) issues++;
  if (results.priceCircle && !results.priceCircle.circular) issues++;
  if (results.ghostFormVisible) issues++;

  results.score = Math.max(0, 10 - issues);
  results.grade = results.score >= 9 ? 'A' : results.score >= 7 ? 'B' : results.score >= 5 ? 'C' : 'F';

  // Output
  console.log('%c[AUDIT] ' + results.page + ' — Grade: ' + results.grade + ' (' + results.score + '/10)',
    'font-weight:bold; font-size:14px; color:' + (results.grade === 'A' ? '#27ae60' : results.grade === 'B' ? '#f39c12' : '#c0392b'));
  console.table({
    'Body font': { value: results.bodyFont + 'px', ok: results.bodyFontOK ? 'YES' : 'NO' },
    'Orange elements': { value: results.orangeCount, ok: results.orangeCount === 0 ? 'YES' : 'NO' },
    'Broken images': { value: results.brokenImages + '/' + results.totalImages, ok: results.brokenImages === 0 ? 'YES' : 'WARN' },
    'Broken /txt/ links': { value: results.brokenTxtLinks.length, ok: results.brokenTxtLinks.length === 0 ? 'YES' : 'NO' },
    'Phone spaces': { value: results.phones.filter(function(p) { return p.hasSpace; }).length, ok: results.phones.every(function(p) { return !p.hasSpace; }) ? 'YES' : 'WARN' }
  });

  return results;
})();
