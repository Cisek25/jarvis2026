---
name: featured-fetch-lazy-src-handling
description: 🔥 Gdy fetchujesz `/pl/offers` dla featured-offers pattern, system IdoBooking lazy-loaduje obrazy — prawdziwy URL jest w `data-src`, nie `src`. ZAWSZE czytaj oba: `img.getAttribute('data-src') || img.getAttribute('src') || img.src`.
type: instinct
scope: all-clients (IdoBooking default13)
added: 2026-04-21
source_client: grzybek/geostay (client57156) — discovery 2026-04-21
related: 015 (featured offers no-fallback), 022 (photo verify)
priority: CRITICAL
---

# Instynkt: data-src lazy loading + 404 hardcoded images

## Problem (GeoStay case 2026-04-21)

Zdjęcia na homepage w sekcji "Nasze apartamenty" NIE ŁADOWAŁY SIĘ (404).

Diagnoza:
1. **Hardcoded fallback**: `<img src="/images/objects/pictures/large/0/1/29.jpg">` dla offer 10. Klient usunął offer 10, teraz ma offer 16 z innym ID zdjęcia → **404**.
2. **JS auto-sync z `/pl/offers`** miał zastąpić fallback, ALE parsował `img.getAttribute('src')` który zwracał `null`, bo system używa **lazy loading z `data-src`**.

Wynik: JS not rendering (imgSrc pusty) → fallback hardcoded stays → user widzi broken images.

## DWIE reguły

### A. ZAWSZE sprawdź BOTH src + data-src

```javascript
// ❌ Źle (JS nie widzi obrazów lazy-loaded)
var imgSrc = img.getAttribute('src') || '';

// ✅ Dobrze
var imgSrc = img.getAttribute('data-src')
          || img.getAttribute('src')
          || img.src
          || '';
if (!imgSrc) return;  // skip offers bez obrazków
```

System IdoBooking lazy-loaduje offers w `/offers` listing. Dopóki user nie scrolluje, `src` jest pusty lub placeholder. **Fetch statycznego HTML** z `/offers` **wyciąga data-src atrybut**, nie src.

### B. ZERO hardcoded fallback (instinct 015)

Nie pisz statycznego `<img src="/images/.../large/X/Y/Z.jpg">` w CMS. Po zmianie oferty przez klienta → stare URLe 404.

```html
<!-- ❌ Źle -->
<div class="apt-grid">
  <a href="/pl/offer/10/Batumi-View"><img src="/images/.../29.jpg"></a>
</div>

<!-- ✅ Dobrze -->
<div class="apt-grid" id="apt-grid" data-offers-loaded="pending">
  <!-- JS fills this from /pl/offers — or hides section if 0 -->
</div>
```

### C. Hide section gdy 0 ofert

```javascript
function renderOffers(offers) {
  var grid = document.getElementById('apt-grid');
  var section = document.querySelector('.apartments');
  if (!grid) return;

  if (offers.length === 0) {
    if (section) section.style.display = 'none';
    grid.setAttribute('data-offers-loaded', 'empty');
    return;
  }

  grid.setAttribute('data-offers-loaded', String(offers.length));
  // ... render cards
}
```

## Pełny template JS (Pattern B — fetch /offers)

```javascript
(function() {
  var LANG = (document.documentElement.lang || 'pl').substring(0, 2);
  var OFFERS_URL = '/' + LANG + '/offers';

  function parseOffers(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var offers = [];
    var seen = {};
    doc.querySelectorAll('a[href*="/offer/"]').forEach(function(link) {
      var img = link.querySelector('img');
      if (!img) return;
      var href = link.getAttribute('href');
      if (seen[href]) return;
      seen[href] = true;

      // 🔥 CRITICAL: data-src first, src fallback
      var imgSrc = img.getAttribute('data-src')
                || img.getAttribute('src')
                || img.src
                || '';
      if (!imgSrc) return;

      offers.push({
        href: href,
        imgSrc: imgSrc,
        name: img.getAttribute('alt') || '',
        // ... inne pola
      });
    });
    return offers;
  }

  function renderOffers(offers) {
    var grid = document.getElementById('apt-grid');
    var section = document.querySelector('.apartments');
    if (!grid) return;
    if (offers.length === 0) {
      if (section) section.style.display = 'none';
      grid.setAttribute('data-offers-loaded', 'empty');
      return;
    }
    grid.setAttribute('data-offers-loaded', String(offers.length));
    // ... build + insert cards
  }

  fetch(OFFERS_URL)
    .then(function(r) { return r.text(); })
    .then(function(html) { renderOffers(parseOffers(html)); })
    .catch(function() {
      var section = document.querySelector('.apartments');
      if (section) section.style.display = 'none';
    });
})();
```

## Weryfikacja live

```javascript
// DevTools console na homepage:
document.getElementById('apt-grid').getAttribute('data-offers-loaded')
// "3" = 3 offers rendered OK
// "empty" = 0 offers, section hidden
// "pending" = JS jeszcze nie fetched

// Sprawdź czy obrazy z /offers mają data-src:
fetch('/pl/offers').then(r => r.text()).then(html => {
  var doc = new DOMParser().parseFromString(html, 'text/html');
  var imgs = Array.from(doc.querySelectorAll('a[href*="/offer/"] img')).slice(0, 3);
  return imgs.map(i => ({
    src: i.getAttribute('src'),
    dataSrc: i.getAttribute('data-src')
  }));
});
// Typowy output: { src: null, dataSrc: "/images/objects/.../173.jpg" }
// JEŻELI dataSrc has value → musisz parsować oba!
```

## Referencja

- Client: grzybek/geostay (client57156)
- Problem: 2026-04-21 — zdjęcia 404 w sekcji "Nasze apartamenty"
- Fix: `00_STRONA_GLOWNA.html` + `00_STRONA_GLOWNA_EN.html` — JS parser data-src + usunięty hardcoded fallback
- Related: 015 (zero hardcoded), 022 (visual verify Pexels)

## Meta-lekcja

Każdy featured-offers pattern (MADERA/NAJMAR .container-hotspot OR GeoStay fetch /offers) MUSI obsługiwać lazy loading. System IdoBooking lazy-loaduje offer images **wszędzie** — w hotspot, w /offers listing, w /offer detail. **Default: czytaj data-src, fallback src**.
