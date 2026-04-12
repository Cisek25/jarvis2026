<script>
/* ============================================
   WCA — Wroclaw City Apartments
   Footer + Kontakt + Oferty: poprawki JS
   Wklejic w: panel > body_bottom
   ============================================ */

/* === §0 OFERTY /offers: H1 → "Nasza oferta" === */
(function() {
  var h1 = document.querySelector('h1.big-label');
  if (h1 && h1.querySelector('small')) {
    h1.textContent = 'Nasza oferta';
  }
})();

/* === §1 FOOTER: Drugi email + etykiety === */
(function() {
  var mailLi = document.querySelector('.footer-contact-mail');
  if (!mailLi || document.querySelector('.wca-second-email')) return;

  // Etykieta dla pierwszego emaila
  var label1 = document.createElement('span');
  label1.className = 'wca-email-label';
  label1.textContent = 'Pod Błękitnymi Podkowami:';
  mailLi.insertBefore(label1, mailLi.firstChild);

  // Drugi email z etykieta
  var newLi = document.createElement('li');
  newLi.className = 'footer-contact-mail wca-second-email';

  var label2 = document.createElement('span');
  label2.className = 'wca-email-label';
  label2.textContent = 'Wroclaw City Apartments:';

  var link = document.createElement('a');
  link.href = 'mailto:wroclawcityapartments@gmail.com';
  link.setAttribute('aria-label', 'E-mail: wroclawcityapartments@gmail.com');
  link.textContent = 'wroclawcityapartments@gmail.com';

  newLi.appendChild(label2);
  newLi.appendChild(link);
  mailLi.parentNode.insertBefore(newLi, mailLi.nextSibling);
})();

/* === §2 KONTAKT /contact: Emaile w Dane kontaktowe + lokalizacje === */
(function() {
  if (!document.querySelector('.contact__email') || document.querySelector('.wca-contact-injected')) return;

  /* --- §2a Dane kontaktowe: dwa emaile z etykietami --- */
  var emailLink = document.querySelector('a.contact__email');
  if (emailLink) {
    emailLink.classList.add('wca-contact-injected');
    var parentLi = emailLink.parentElement;

    // Wrapper div zastepujacy pojedynczy link
    var wrapper = document.createElement('div');
    wrapper.className = 'wca-contact-emails-wrapper';

    // Blok 1: Pod Blekitnymi Podkowami
    var block1 = document.createElement('div');
    block1.className = 'wca-contact-email-block';
    var lbl1 = document.createElement('span');
    lbl1.className = 'wca-contact-label';
    lbl1.textContent = 'Pod Błękitnymi Podkowami:';
    var link1 = document.createElement('a');
    link1.href = emailLink.href;
    link1.textContent = emailLink.textContent.trim();
    block1.appendChild(lbl1);
    block1.appendChild(link1);

    // Blok 2: Wroclaw City Apartments
    var block2 = document.createElement('div');
    block2.className = 'wca-contact-email-block';
    var lbl2 = document.createElement('span');
    lbl2.className = 'wca-contact-label';
    lbl2.textContent = 'Wroclaw City Apartments:';
    var link2 = document.createElement('a');
    link2.href = 'mailto:wroclawcityapartments@gmail.com';
    link2.textContent = 'wroclawcityapartments@gmail.com';
    block2.appendChild(lbl2);
    block2.appendChild(link2);

    wrapper.appendChild(block1);
    wrapper.appendChild(block2);

    // Zamien oryginalny <a> na wrapper
    parentLi.replaceChild(wrapper, emailLink);
  }

  /* --- §2b Lokalizacje: email per obiekt + ukryj parking + dedup + grupuj --- */
  var items = document.querySelectorAll('.contact__item');
  var seenWCA = false;
  items.forEach(function(item) {
    if (item.querySelector('.wca-location-email')) return;
    var nameEl = item.querySelector('strong');
    if (!nameEl) return;
    var name = nameEl.textContent.trim().toLowerCase();

    // Ukryj PARKING
    if (name.indexOf('parking') !== -1) {
      item.classList.add('wca-loc-hidden');
      return;
    }

    // Dedup: zostaw tylko 1 WCA entry
    if (name.indexOf('wroclaw') !== -1 || name.indexOf('city') !== -1) {
      if (seenWCA) {
        item.classList.add('wca-loc-hidden');
        return;
      }
      seenWCA = true;
      // Dodaj etykiete dzielnicy
      var lbl = document.createElement('span');
      lbl.className = 'wca-district-label';
      lbl.textContent = 'Śródmieście';
      nameEl.parentNode.insertBefore(lbl, nameEl);
    }

    // Pod Blekitnymi — dodaj etykiete Stare Miasto
    if (name.indexOf('pod b') !== -1 || name.indexOf('błękitn') !== -1 || name.indexOf('blekitn') !== -1) {
      var lbl2 = document.createElement('span');
      lbl2.className = 'wca-district-label';
      lbl2.textContent = 'Stare Miasto';
      nameEl.parentNode.insertBefore(lbl2, nameEl);
    }

    // Email injection
    var email = '';
    if (name.indexOf('pod b') !== -1 || name.indexOf('błękitn') !== -1 || name.indexOf('blekitn') !== -1) {
      email = 'podblekitnymipodkowami@gmail.com';
    } else if (name.indexOf('wroclaw') !== -1 || name.indexOf('city') !== -1 || name.indexOf('apartment') !== -1) {
      email = 'wroclawcityapartments@gmail.com';
    }
    if (!email) return;

    var emailP = document.createElement('p');
    emailP.className = 'wca-location-email';
    var a = document.createElement('a');
    a.href = 'mailto:' + email;
    a.textContent = email;
    emailP.appendChild(a);

    var innerDiv = item.querySelector('div');
    if (innerDiv) {
      var links = innerDiv.querySelector('.contact__links');
      if (links) {
        innerDiv.insertBefore(emailP, links);
      } else {
        innerDiv.appendChild(emailP);
      }
    } else {
      item.appendChild(emailP);
    }
  });
})();

/* === §3 OPINIE /txt/206: Przekierowanie do Google Reviews === */
(function() {
  if (window.location.pathname.indexOf('/txt/206') === -1) return;
  window.location.href = 'https://www.google.com/travel/search?gsas=1&ts=EggKAggDCgIIAxocEhoSFAoHCOoPEAcYCBIHCOoPEAcYCRgBMgIQAA&qs=MhNDZ29JOE1yaWpzZlZtdE12RUFFOAI&ap=ugEHcmV2aWV3cw&ictx=111&hl=pl-PL';
})();

/* === §5 BLOG: Auto-listing z systemowych newsow === */
(function() {
  // Dzialaj na stronie bloga (/txt/207 lub /txt/204)
  var path = window.location.pathname;
  if (path.indexOf('/txt/207') === -1 && path.indexOf('/txt/204') === -1) return;

  // Ukryj H1 systemowe
  var h1 = document.querySelector('h1.big-label');
  if (h1) h1.style.display = 'none';

  // Sprawdz czy na TEJ stronie sa juz .news-item (system moze je dodac)
  var localNews = document.querySelectorAll('.news-item');
  if (localNews.length > 0) {
    buildCards(localNews);
    return;
  }

  // Fetch strony glownej i parsuj artykuly
  fetch('/')
    .then(function(r) { return r.text(); })
    .then(function(html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var items = doc.querySelectorAll('.news-item');
      if (items.length > 0) buildCards(items);
    })
    .catch(function() {});

  function buildCards(items) {
    var grid = document.querySelector('.wca-blog__grid');
    if (!grid) return;
    // Usun stare reczne karty
    grid.innerHTML = '';

    items.forEach(function(item) {
      var titleEl = item.querySelector('a:not(.more-news)');
      var dateEl = item.querySelector('.news-date');
      var contentEl = item.querySelector('.news-content');
      var imgEl = item.querySelector('img');
      if (!titleEl) return;

      var title = titleEl.textContent.trim();
      var href = titleEl.getAttribute('href') || '#';
      var date = dateEl ? dateEl.textContent.trim() : '';
      var excerpt = contentEl ? contentEl.textContent.trim().substring(0, 150) : '';
      var imgSrc = imgEl ? imgEl.getAttribute('src') : '';

      var card = document.createElement('a');
      card.href = href;
      card.className = 'wca-blog-card';
      card.innerHTML =
        '<div class="wca-blog-card__img">' +
          (imgSrc ? '<img src="' + imgSrc + '" alt="' + title + '" loading="lazy">' : '<div style="background:#F5F7FA;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:48px;">&#9997;</div>') +
        '</div>' +
        '<div class="wca-blog-card__body">' +
          '<span class="wca-blog-card__date">' + date + '</span>' +
          '<h3 class="wca-blog-card__title">' + title + '</h3>' +
          '<p class="wca-blog-card__excerpt">' + excerpt + (excerpt.length >= 150 ? '...' : '') + '</p>' +
          '<span class="wca-blog-card__cta">Czytaj więcej &rarr;</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  // Ukryj systemowa sekcje newsow (jesli jest na tej stronie)
  var nc = document.querySelector('.news-container');
  if (nc) nc.style.display = 'none';
})();

/* === §4 /offers: Ukryj parking z filtrow lokalizacji === */
(function() {
  if (window.location.pathname.indexOf('/offers') === -1) return;
  var labels = document.querySelectorAll('.filters label, .custom-checkbox label, [class*="filter"] label');
  labels.forEach(function(label) {
    var text = label.textContent.trim().toLowerCase();
    if (text.indexOf('parking') !== -1 || text.indexOf('grabarska') !== -1) {
      var parent = label.closest('li') || label.closest('div') || label.parentElement;
      if (parent) parent.classList.add('wca-loc-hidden');
    }
  });
  // Backup: ukryj checkboxy z "parking" w name/value
  var checks = document.querySelectorAll('input[type="checkbox"]');
  checks.forEach(function(cb) {
    var next = cb.nextElementSibling || cb.parentElement;
    var text = next ? next.textContent.trim().toLowerCase() : '';
    if (text.indexOf('parking') !== -1 || text.indexOf('grabarska') !== -1) {
      var li = cb.closest('li') || cb.closest('div') || cb.parentElement;
      if (li) li.classList.add('wca-loc-hidden');
    }
  });
})();

/* === §7 LOKALIZACJA DROPDOWN: Ukryj Grabarska/Parking z wyszukiwarki === */
(function() {
  function hideGrabarska() {
    var items = document.querySelectorAll('li, option, [class*="item"], [class*="option"]');
    items.forEach(function(el) {
      var text = el.textContent.trim().toUpperCase();
      if ((text.indexOf('GRABARSKA') !== -1 || text.indexOf('PARKING') !== -1) && text.length < 80) {
        el.style.display = 'none';
      }
    });
  }
  // Uruchom od razu
  hideGrabarska();
  // Obserwuj DOM — dropdown laduje sie dynamicznie
  var observer = new MutationObserver(function() { hideGrabarska(); });
  observer.observe(document.body, { childList: true, subtree: true });
  // Cleanup po 30s (performance)
  setTimeout(function() { observer.disconnect(); }, 30000);
})();

/* === §6 NAVBAR: Przycisk "Rezerwuj" po lewej od logo === */
(function() {
  function initRezButton() {
    if (document.querySelector('.wca-nav-cta-moved')) return true;
    var brand = document.querySelector('.navbar-brand');
    if (!brand) return false;

    // Znajdz Rezerwuj w menu — szukaj po tekscie (a, span, div)
    var rezLink = null;
    var allItems = document.querySelectorAll('.navbar-nav li, .navbar-nav a, .navbar-nav .nav-link, .navbar-nav span');
    allItems.forEach(function(el) {
      var directText = '';
      el.childNodes.forEach(function(n) { if (n.nodeType === 3) directText += n.textContent; });
      var text = (directText || el.textContent || '').trim().toLowerCase();
      if (text === 'rezerwuj' || text === 'book now' || text === 'book online' || text === 'book' || text === 'reserve') {
        rezLink = el;
      }
    });
    if (!rezLink) return false;

    // Ukryj oryginalny element z menu
    var rezLi = rezLink.closest('li') || rezLink;
    rezLi.style.display = 'none';

    // Nowy przycisk przed logo (PL/EN)
    var isEN = document.documentElement.lang === 'en' || window.location.search.indexOf('language=2') !== -1;
    var btn = document.createElement('a');
    btn.className = 'wca-nav-cta wca-nav-cta-moved';
    btn.href = '#';
    btn.textContent = isEN ? 'BOOK NOW' : 'REZERWUJ';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      rezLink.click();
    });
    brand.parentNode.insertBefore(btn, brand);
    return true;
  }

  // Probuj od razu, potem retry co 200ms (navbar moze sie zaladowac pozniej)
  if (!initRezButton()) {
    var attempts = 0;
    var retry = setInterval(function() {
      if (initRezButton() || ++attempts > 15) clearInterval(retry);
    }, 200);
  }
})();
</script>
