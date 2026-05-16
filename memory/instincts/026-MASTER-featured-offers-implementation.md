---
name: MASTER-featured-offers-implementation
description: 🔥 DEFINITYWNY master instinct dla implementacji "Wyróżnione Oferty" na IdoBooking default13. Pattern A (container-hotspot, preferred) vs Pattern B (fetch /offers, fallback). Kompletny kod do copy-paste dla dowolnego klienta.
type: master-instinct
scope: all-clients (IdoBooking default13)
added: 2026-04-22
source_clients: AP (v1.8), MADERA, NAJMAR, GeoStay v1.2
priority: READ-BEFORE-STRONA-GLOWNA
supersedes: 015, 025 (teraz konsolidacja + preferred pattern)
---

# 🔥 MASTER — Featured Offers Implementation

## 🔥 KRYTYCZNE — Gdzie wklejać script

**IdoSell CMS wycina inline `<script>` z pola "Treść" / body_top** (bezpieczeństwo).
Jeśli wkleisz `<script>` w "Edytor treści" HTML — zostanie usunięty, sekcja zostanie pusta.

### ZASADA: 2 OSOBNE PLIKI per język

| Plik | Gdzie wklejać |
|------|---------------|
| `STRONA_GLOWNA.html` | Strona główna → **Treść** (TRYB HTML) — tylko markup, BEZ `<script>` |
| `STRONA_GLOWNA_JS.html` | **Koniec BODY** (body_bottom) / Kody śledzące → script z logiką |

Panel IdoSell → Ustawienia → Kody śledzące → **Koniec BODY (pl)** — to pole akceptuje JS.

Odkryte 2026-04-22 na GeoStay: user wkleił HTML + CSS ale skrypt zniknął z body_top → sekcja pusta.

---

## Kiedy stosować
ZAWSZE gdy klient ma sekcję "Nasze apartamenty", "Polecamy", "Wyróżnione",
"Featured" na homepage z listą obiektów noclegowych.

**To ma działać automatycznie** — klient zaznacza w panelu IdoSell oferty
jako "Wyróżnione", strona aktualizuje się natychmiast. Klient NIGDY nie
edytuje HTML CMS.

---

## DWIE strategie — który Pattern wybrać?

### Pattern A — `.container-hotspot` ✅ PREFERRED
**IdoSell sam renderuje** `.container-hotspot` na stronie głównej z
ofertami zaznaczonymi jako "Wyróżnione" w panelu. Mamy gotowe dane
w DOM po inicjalizacji Slick carousel. **Szybsze, prostsze, dokładniejsze.**

✅ **Używaj gdy:** klient ma dostęp do panelu "Wyróżnione oferty"
(zaznacza max N obiektów).
✅ **Kliencji z Pattern A:** AP, MADERA, NAJMAR, **GeoStay v1.2** (naprawione).

### Pattern B — fetch `/pl/offers`
Fallback gdy Pattern A nie działa (np. klient nie używa "Wyróżnione"
albo template nie renderuje hotspot). Pobieramy HTML z `/pl/offers`,
parsujemy karty, budujemy custom.

⚠️ **Wady Pattern B:**
- Pokazuje WSZYSTKIE oferty (nie tylko wyróżnione) → klient nie ma kontroli
- Extra HTTP request (slower)
- Duplikaty linków (kilka `<a>` per karta)
- Listing page może być systemowo inny niż hotspot struct

### DECISION TREE
```
Czy strona homepage ma .container-hotspot?
 ├─ TAK → Pattern A (parsuj z DOM)
 └─ NIE
    ├─ Klient ma panel "Wyróżnione"? → Pattern A + poczekaj na pojawienie
    └─ Brak wyróżnionych → Pattern B (fetch /pl/offers) lub hide section
```

---

## IMPLEMENTACJA — Pattern A (MASTER TEMPLATE)

### HTML (w CMS body_top homepage)
```html
<section class="{prefix}-apartments" id="{prefix}-apartments">
  <div class="{prefix}-section-header">
    <span class="{prefix}-label">Nasze apartamenty</span>
    <h2 class="{prefix}-h2">Wybierz swoje miejsce</h2>
    <p class="{prefix}-subtitle">Starannie urządzone apartamenty.</p>
  </div>

  <!-- Grid wypełniany AUTOMATYCZNIE przez JS z .container-hotspot
       ZERO hardcoded fallback. 0 wyróżnionych → section hidden. -->
  <div class="{prefix}-apt-grid" id="{prefix}-apt-grid" data-offers-loaded="pending">
    <!-- JS fills or hides section -->
  </div>

  <div style="text-align: center; margin-top: 40px;">
    <a href="/pl/offers" class="{prefix}-btn {prefix}-btn-outline">Zobacz wszystkie apartamenty</a>
  </div>
</section>
```

### CSS (w custom.css klienta)
```css
/* 1. Hide systemowy .container-hotspot (brzydki slick carousel) */
html body .container-hotspot {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. Grid states — fade-in gdy załadowane */
#{prefix}-apt-grid[data-offers-loaded="pending"] {
  min-height: 320px;   /* zapobiega layout shift */
  opacity: 0.3;
  transition: opacity 0.4s ease;
}
#{prefix}-apt-grid[data-offers-loaded]:not([data-offers-loaded="pending"]) {
  opacity: 1;
}
#{prefix}-apt-grid[data-offers-loaded="empty"] {
  display: none !important;
}

/* 3. Card design — dostosuj do brand klienta */
.{prefix}-apt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}
.{prefix}-apt-card { /* ... standard card styling */ }
```

### JavaScript (w CMS body_top ciwka script tag LUB KONIEC_BODY)
```javascript
<script>
(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // PATTERN A — Parse .container-hotspot → build {prefix}-apt-card
  // ═══════════════════════════════════════════════════════════════

  function buildFeatureIcon(label, svgPath) {
    return '<span class="{prefix}-apt-feature">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + svgPath + '</svg>' +
      ' ' + label + '</span>';
  }

  // Parsuje POJEDYNCZY .offer z hotspot
  function parseSystemOffer(offerEl) {
    var link = offerEl.querySelector('a.object-icon') || offerEl.querySelector('a[href*="/offer/"]');
    if (!link) return null;
    var href = link.getAttribute('href');

    // 🔥 CRITICAL: IdoBooking lazy-loaduje obrazy. data-src FIRST, src fallback.
    var img = offerEl.querySelector('img[data-src], img[src], img');
    if (!img) return null;
    var imgSrc = img.getAttribute('data-src') || img.getAttribute('src') || img.src || '';
    if (!imgSrc) return null;

    var titleEl = offerEl.querySelector('h3 a, h3');
    var title = titleEl ? titleEl.textContent.trim() : (img.getAttribute('alt') || '');

    var descEl = offerEl.querySelector('.offer__description');
    var desc = descEl ? descEl.textContent.trim() : '';
    if (desc && desc === title) desc = '';  // dedupe

    // Powierzchnia — .accommodation-meters "40,00 m²"
    var areaEl = offerEl.querySelector('.accommodation-meters');
    var area = '';
    if (areaEl) {
      var m = areaEl.textContent.match(/([\d,.]+)\s*m/i);
      if (m) area = m[1] + ' m²';
    }

    // Osoby — .accommodation-roomspace "3"
    var guestsEl = offerEl.querySelector('.accommodation-roomspace');
    var guests = '2';
    if (guestsEl) {
      var g = guestsEl.textContent.match(/(\d+)/);
      if (g) guests = g[1];
    }

    // Cena — .offer__price .price "66,99 $"
    var priceEl = offerEl.querySelector('.offer__price .price') || offerEl.querySelector('.price');
    var price = '';
    var currency = 'zł';  // default PL
    if (priceEl) {
      var priceTxt = priceEl.textContent.trim();
      var pm = priceTxt.match(/([\d,.]+)/);
      if (pm) price = pm[1].replace(',', '.');
      if (/€/.test(priceTxt)) currency = '€';
      else if (/\$/.test(priceTxt)) currency = '$';
      else if (/₾|GEL/i.test(priceTxt)) currency = '₾';
    }

    return {
      href: href, imgSrc: imgSrc, title: title, desc: desc,
      area: area, guests: guests, price: price, currency: currency
    };
  }

  // Zbuduj karty z listy parsed offers
  function renderCards(offers) {
    var grid = document.getElementById('{prefix}-apt-grid');
    var section = document.querySelector('.{prefix}-apartments');
    if (!grid) return;

    // 0 wyróżnionych → hide całą sekcję. ZERO hardcoded fallback.
    if (!offers.length) {
      if (section) section.style.display = 'none';
      grid.setAttribute('data-offers-loaded', 'empty');
      return;
    }

    grid.setAttribute('data-offers-loaded', String(offers.length));
    var html = '';
    offers.forEach(function(o) {
      var priceNum = Math.round(parseFloat(o.price) || 0);
      html += '<a href="' + o.href + '" class="{prefix}-apt-card">';
      html += '<div class="{prefix}-apt-img">';
      html += '<img src="' + o.imgSrc + '" alt="' + o.title.replace(/"/g, '&quot;') + '" loading="lazy">';
      if (priceNum > 0) {
        html += '<div class="{prefix}-apt-price">od <strong>' + o.currency + priceNum + '</strong> <span>/ noc</span></div>';
      }
      html += '</div>';
      html += '<div class="{prefix}-apt-body">';
      html += '<h3 class="{prefix}-h3">' + o.title + '</h3>';
      if (o.desc) html += '<p class="{prefix}-text">' + o.desc + '</p>';
      html += '<div class="{prefix}-apt-features">';
      // dostosuj feature icons do klienta...
      html += '</div></div></a>';
    });
    grid.innerHTML = html;
  }

  // Parse hotspot → render cards
  function buildFromHotspot() {
    var grid = document.getElementById('{prefix}-apt-grid');
    if (!grid) return;
    var loaded = grid.getAttribute('data-offers-loaded');
    if (loaded && loaded !== 'pending') return;  // już załadowane

    var hotspot = document.querySelector('.container-hotspot');
    if (!hotspot) return false;  // system jeszcze nie wyrenderował

    // Preferuj .slick-slide:not(.slick-cloned) żeby uniknąć duplikatów
    var offerNodes = hotspot.querySelectorAll('.slick-slide:not(.slick-cloned) .offer');
    if (!offerNodes.length) offerNodes = hotspot.querySelectorAll('.offer');

    if (!offerNodes.length) {
      var section = document.querySelector('.{prefix}-apartments');
      if (section) section.style.display = 'none';
      grid.setAttribute('data-offers-loaded', 'empty');
      return true;
    }

    // Deduplikuj po href
    var seen = {}, offers = [];
    Array.prototype.forEach.call(offerNodes, function(node) {
      var parsed = parseSystemOffer(node);
      if (!parsed || seen[parsed.href]) return;
      seen[parsed.href] = true;
      offers.push(parsed);
    });

    renderCards(offers);
    return true;
  }

  // Retry z delays — system renderuje hotspot async przez Slick
  function initFeaturedOffers() {
    [0, 400, 1200, 2500].forEach(function(delay) {
      setTimeout(function() {
        var grid = document.getElementById('{prefix}-apt-grid');
        if (grid) {
          var loaded = grid.getAttribute('data-offers-loaded');
          if (loaded && loaded !== 'pending') return;
        }
        buildFromHotspot();
      }, delay);
    });

    // Final guard po 4s
    setTimeout(function() {
      var grid = document.getElementById('{prefix}-apt-grid');
      var section = document.querySelector('.{prefix}-apartments');
      if (grid) {
        var loaded = grid.getAttribute('data-offers-loaded');
        if (!loaded || loaded === 'pending') {
          if (section) section.style.display = 'none';
          grid.setAttribute('data-offers-loaded', 'empty');
        }
      }
    }, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeaturedOffers);
  } else {
    initFeaturedOffers();
  }
})();
</script>
```

---

## DEBUGGING — Diagnoza live

```javascript
// 1. Czy hotspot istnieje?
document.querySelector('.container-hotspot')
// null = system nie renderuje, brak wyróżnionych w panelu
// Element = OK, jest co parsować

// 2. Ile ofert?
document.querySelectorAll('.container-hotspot .slick-slide:not(.slick-cloned) .offer').length
// Powinno być > 0

// 3. Czy nasz script zadziałał?
document.getElementById('{prefix}-apt-grid').getAttribute('data-offers-loaded')
// "3" = 3 karty wyrenderowane ✓
// "empty" = 0 wyróżnionych, section hidden ✓
// "pending" = JS jeszcze nie ran (czekaj 4s)
// null = fatal error — check console

// 4. Czy obrazki działają?
Array.from(document.querySelectorAll('#{prefix}-apt-grid img')).map(i => ({
  src: i.src,
  loaded: i.complete && i.naturalWidth > 0
}));
// loaded: false = 404 albo src pusty
```

---

## COMMON BUGS (odkryte w sesji AP + GeoStay)

### Bug #1 — Image `src` null (bo lazy-loaded)
**Symptom**: skrypt przetwarza karty ale `imgSrc` jest puste, images 404.
**Fix**: `img.getAttribute('data-src') || img.getAttribute('src') || img.src`
**Źródło**: instinct 025 (GeoStay v1.1).

### Bug #2 — Hardcoded fallback w HTML → 404 po zmianie oferty
**Symptom**: klient usunął offer 10, nowy offer to 16, ale hardcoded
`<img src="/images/large/X/Y/29.jpg">` (offer 10 asset) zwraca 404.
**Fix**: ZERO hardcoded. Pusty grid + JS fills.
**Źródło**: instinct 015 + 025.

### Bug #3 — Duplikaty z .slick-cloned
**Symptom**: pokazuje się 6 kart zamiast 3 (Slick clones each slide for infinite scroll).
**Fix**: `querySelectorAll('.slick-slide:not(.slick-cloned) .offer')` + dedup po href.

### Bug #4 — Section pokazana ale pusta (0 featured, hardcoded "na wszelki wypadek")
**Symptom**: klient NIE ma wyróżnionych, ale na stronie są 3 stare karty
(hardcoded fallback z poprzedniej wersji).
**Fix**: Zero hardcoded. JS hide section gdy 0.
**Źródło**: AP v1.8 (instinct 015).

### Bug #5 — Dwie sekcje apartamentów (systemowa + custom)
**Symptom**: user widzi `.container-hotspot` (system) + `.{prefix}-apartments` (nasza).
**Fix**: CSS `display: none` na `.container-hotspot`.
**Źródło**: GeoStay v1.2.

### Bug #6 — Retry nie startuje (fullpage.js blokuje DOM)
**Symptom**: hotspot pojawia się po 2s dopiero, script sprawdza o 0s i porzuca.
**Fix**: Retry `[0, 400, 1200, 2500]` + final guard po 4s.

---

## CHECKLIST dla nowego klienta

Podczas building homepage:
- [ ] Grid empty w HTML (ZERO hardcoded cards)
- [ ] `data-offers-loaded="pending"` atrybut
- [ ] CSS hide `.container-hotspot`
- [ ] CSS fade-in grid
- [ ] JS parseSystemOffer z `data-src` support
- [ ] JS renderCards hide section gdy 0
- [ ] JS retry [0, 400, 1200, 2500] + final 4s guard
- [ ] Klient zaznaczył ≥1 ofertę jako "Wyróżniona" w panelu IdoSell
- [ ] Live verify: `document.getElementById('{prefix}-apt-grid').getAttribute('data-offers-loaded')` → liczba kart lub "empty"

---

## Referencja (implementacje używane produkcyjnie)

- **AP v1.8** — `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` §13 `buildOfferCards`
- **MADERA** — `clients/madera/...` (Pattern A oryginalny wzorzec)
- **NAJMAR** — `clients/najmar/...` (Pattern A)
- **GeoStay v1.2** — `clients/grzybek/DO_WKLEJENIA/00_STRONA_GLOWNA.html` (parse w inline script)

## Related instincts
- **015** — featured-offers-no-fallback (ZERO hardcoded rule)
- **022** — pexels-photo-visual-verify (jeśli chcesz statyczne zdjęcia fallback — NIE rób tego, ale jeśli musisz: verify)
- **025** — featured-fetch-lazy-src-handling (Pattern B) — teraz backup
- **011** — every-image-lightbox (cards NIE powinny być w lightbox — wrap w `<a href>` żeby link nawigował)

---

## META-LEKCJA dla JARVIS

**NIGDY nie hardkoduj ofert w CMS body_top.** Każda hardcoded karta =
tykająca bomba: klient zmieni coś w panelu → broken images → frustracja.

Pattern A jest DEFAULT. Zero hardcoded. Section hide gdy 0. Pokazuje
TYLKO to co klient zaznaczył jako "Wyróżnione" w panelu. Klient kontroluje
100% zawartości.
