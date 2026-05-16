---
name: MASTER-PLAYBOOK-idobooking-default13
description: 🔥 NAJWAŻNIEJSZY instinct — master playbook dla wszystkich klientów IdoBooking template default13. Wszystkie lekcje z sesji apartamenty-parkowe (AP v1.0 → v1.8.8) skonsolidowane. Przeczytaj PRZED rozpoczęciem jakiegokolwiek klienta.
type: master-instinct
scope: all-clients (IdoBooking default13)
added: 2026-04-21
priority: READ-FIRST-DAY
supersedes: none (complements 001-024)
---

# 🔥 JARVIS MASTER PLAYBOOK — IdoBooking default13

## SPIS TREŚCI
1. [FIRST-DAY CHECKLIST](#first-day)
2. [Typography](#typography)
3. [Header & Logo](#header)
4. [Featured Offers (Wyróżnione)](#featured)
5. [Subpage Layout](#subpages)
6. [Mobile](#mobile)
7. [Common bugs](#bugs)
8. [Code patterns (copy-paste)](#patterns)

---

## 🚨 FIRST-DAY CHECKLIST {#first-day}

Gdy dostajesz nowego klienta IdoBooking, ZANIM napiszesz pierwszy linijk CSS:

```javascript
// 1. Sprawdź html font-size
getComputedStyle(document.documentElement).fontSize
// Expected: "10px" — konwencja IdoBooking default13
// Konsekwencja: WSZYSTKIE własne font-size pisz w ABSOLUTNYM px, NIE rem!

// 2. Sprawdź body class
document.body.className
// np. "page-index ck_dsclr_v2_freeze_bcg fp-viewing-1"
// "fp-viewing-1" = fullpage.js ACTIVE (tylko homepage)

// 3. Sprawdź dostępne CSS vars
getComputedStyle(document.documentElement).getPropertyValue('--maincolor1')
// Jeśli ustawione (np. "#147D3B") — system ma brand colors, NADPISZ je z !important
```

**Jeśli html=10px** (99% przypadków): **NIE RESETUJ do 16px** — łamie systemowe style (flatpickr, slick, widget booking). Używaj px.

---

## 📏 TYPOGRAPHY {#typography}

### Zasady
- **Wszystkie własne reguły w ABSOLUTNYM px** (nie rem, nie em)
- **Minima**:
  - body: 16px
  - Content paragraph: 15-17px
  - Card description: 15-16px
  - Card title H3: 20-24px
  - Section H2: 32-40px
  - Kicker (uppercase): 12-14px z letter-spacing 2px
  - Nav items: 14-15px
  - Small/footer legal: 13-14px
  - NIGDY nic poniżej 12px

### Template CSS (paste at end)
```css
/* Body — per-page */
body:not(.page-offers):not(.page-offer):not(.page-contact) { font-size: 16px !important; }
body.page-offers, body.page-offer, body.page-contact { font-size: 16px !important; }

/* Nav items — DOUBLE-CLASS trick dla specyficzności */
html body header.default13 .nav-link.nav-link,
html body header.default13 .navbar a[href]:not(.logo):not(.navbar-brand):not([class*="btn"]):not(.language__toggler),
html body header.default13 .language__toggler.language__toggler {
  font-size: 14px !important;
  letter-spacing: 1.2px !important;
  padding: 10px 12px !important;
}

/* Kicker */
html body .{prefix}-kicker { font-size: 13px !important; letter-spacing: 2.2px !important; font-weight: 700 !important; }

/* Cards */
html body .{prefix}-card-title { font-size: 22px !important; }
html body .{prefix}-card-desc { font-size: 15px !important; }
html body .{prefix}-card-badge { font-size: 11px !important; letter-spacing: 1.5px !important; }

/* Final CTA */
html body .{prefix}-final-cta h2 { font-size: 40px !important; }
html body .{prefix}-final-cta .{prefix}-kicker { font-size: 14px !important; }

/* Mobile @media 768 */
@media (max-width: 768px) {
  html body .{prefix}-pagehero__title { font-size: 32px !important; }
  html body .{prefix}-card-title { font-size: 20px !important; }
}
```

**Dlaczego double-class `.nav-link.nav-link`**: system ma selektory z `:not()` chain, bardzo wysoka specyficzność. Double-class dodaje extra specyficzność bez komplikowania selektora.

---

## 🎯 HEADER & LOGO {#header}

### Zasady
1. **Klasa scroll:** `.{prefix}-header--scrolled` (double-dash BEM). JS musi ustawiać TĘ SAMĄ klasę co CSS targeters.
2. **Threshold = 1px** — INSTANT biały background po 1px scroll (nie 10!)
3. **No shrink** — header zostaje 88px wysokości, logo zostaje 52px. Shrink = irytujący.
4. **Logo chip TYLKO na hero** (transparent header). Na scrolled i subpage — brak chipu.
5. **Logo max 52px height** (64 padding). Chip padding: 6px 14px, radius 12px.

### Template JS (w `KONIEC_BODY.html`)
```javascript
function initScrollHandler() {
  var header = document.querySelector('header.default13');
  var threshold = 1;  // INSTANT

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('{prefix}-header--scrolled', y > threshold);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Dla homepage z fullpage.js (section 2+ = scrolled)
function initHeaderFullpage() {
  var header = document.querySelector('header.default13');
  if (!header) return;
  function check() {
    var m = document.body.className.match(/fp-viewing-(\d+)/);
    if (m) header.classList.toggle('{prefix}-header--scrolled', parseInt(m[1], 10) > 1);
  }
  new MutationObserver(check).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  check();
}
```

### Template CSS
```css
/* Navbar-toggler TYLKO mobile */
.navbar-toggler { display: none !important; }
@media (max-width: 991.98px) {
  .navbar-toggler {
    display: inline-flex !important;
    min-width: 64px !important;
    min-height: 48px !important;
    padding: 12px 16px !important;
    border: 1px solid rgba({primary-rgb}, 0.35) !important;
    border-radius: 8px !important;
  }
  .navbar-toggler::before {
    content: ''; display: inline-block;
    width: 22px; height: 16px;
    background-image:
      linear-gradient(to bottom, currentColor 2px, transparent 2px),
      linear-gradient(to bottom, currentColor 2px, transparent 2px),
      linear-gradient(to bottom, currentColor 2px, transparent 2px);
    background-position: 0 0, 0 7px, 0 14px;
    background-repeat: no-repeat;
    background-size: 22px 2px, 22px 2px, 22px 2px;
  }
  .navbar-toggler * { pointer-events: none !important; } /* klik łapie button */
  .navbar-toggler::after { content: ''; position: absolute; inset: -4px; } /* extra hit area */
}

/* Fontello icons nie ładuje się — schowaj */
.navbar-toggler .icon-menu, .language__toggler .icon, [class^="icon-"]:not(.ap-icon) {
  display: none !important;
}
```

---

## 🏠 FEATURED OFFERS — Wyróżnione {#featured}

### Reguła ŻELAZNA
**ZERO hardcoded fallback w HTML.** 0 wyróżnionych = `section.style.display='none'`.
Klient ZMIENIA wyróżnione w panelu → strona AUTOMATYCZNIE aktualizuje się.

### DWA patterny (wybierz jeden)

**Pattern A — `.container-hotspot` (MADERA/NAJMAR/AP)**
System renderuje `.container-hotspot` z `.slick-slide > .offer` dla wyróżnionych. Ukrywamy + parsujemy.

```javascript
function buildOfferCards() {
  var hotspot = document.querySelector('.container-hotspot');
  var grid = document.querySelector('.{prefix}-apartments__grid');
  var section = document.querySelector('.{prefix}-apartments');
  if (!grid || !section) return;
  if (grid.hasAttribute('data-featured-loaded')) return;

  if (!hotspot) return;  // retry w setTimeout

  var offers = hotspot.querySelectorAll('.slick-slide:not(.slick-cloned) .offer');
  if (!offers.length) offers = hotspot.querySelectorAll('.offer');

  if (!offers.length) {
    section.style.display = 'none';
    grid.setAttribute('data-featured-loaded', 'empty');
    return;
  }

  // Parse each offer, build cards...
  grid.setAttribute('data-featured-loaded', String(offers.length));
}

function initFeaturedOffers() {
  [0, 400, 1200, 2500].forEach(d => setTimeout(buildOfferCards, d));
  setTimeout(() => {
    // Final guard: po 4s jeśli nadal nie załadowane → hide
    var grid = document.querySelector('.{prefix}-apartments__grid');
    var section = document.querySelector('.{prefix}-apartments');
    if (grid && section && !grid.hasAttribute('data-featured-loaded')) {
      section.style.display = 'none';
    }
  }, 4000);
}
```

**Pattern B — fetch `/pl/offers` (GeoStay)**
Gdy system nie renderuje hotspot, fetchuj stronę ofert:

```javascript
fetch('/pl/offers')
  .then(r => r.text())
  .then(html => {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var offerLinks = doc.querySelectorAll('a[href*="/offer/"]');
    offerLinks.forEach(link => {
      var img = link.querySelector('img');
      if (!img) return;
      // 🔥 WAŻNE: sprawdź BOTH src AND data-src (lazy loading!)
      var imgSrc = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (!imgSrc) return;
      // ... build card
    });
  });
```

### Parsowanie obrazów — zawsze src + data-src
```javascript
var img = offer.querySelector('img[data-src], img[src]');
var imgSrc = img.getAttribute('data-src') || img.getAttribute('src') || img.src || '';
```
**System IdoBooking lazy-loaduje obrazy**. `src` może być `null` lub placeholder. Prawdziwy URL w `data-src`. BEZ tego skrypt parsuje puste obrazki → karty bez zdjęć.

---

## 📄 SUBPAGES {#subpages}

### Reguły
1. **TYLKO `/txt/*` full-width** — override Bootstrap `.container` (1170px → 100%)
2. **NIE `/contact`** — systemowy Bootstrap grid 2-col, override zepsuje
3. **NIE `/offer/*`** — sidebar layout
4. **Podstrony NIE duplikują kontaktu** — tel/email tylko na `/contact`, inne mają link
5. **Atrakcje ZAWSZE ze zdjęciami** — Pexels CDN (nie Wikimedia - 429!)
6. **KAŻDE zdjęcie klikalne** (lightbox) — blacklist approach, nie whitelist
7. **Galeria: `<figure>` nie `<a href>`** — lightbox łapie, nie otwiera w nowej karcie

### Template full-width subpage
```css
body.page-txt main .container,
body.page-txt #pageContent .container {
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}
body.page-txt main .container > .row { margin: 0 !important; }
body.page-txt main .container > .row > [class^="col"] { padding: 0 !important; }

/* NIE stosuj do /contact ani /offer */
```

### Universal lightbox — blacklist
```javascript
function initGalleryLightbox() {
  var EXCLUDE = ['header', 'footer', '.menu-wrapper', '.navbar-brand', '.logo',
                 '.footer-contact-baner', '.powered_by', '.news-container'];
  var imgs = Array.from(document.querySelectorAll('img')).filter(img => {
    if (img.hasAttribute('data-no-lightbox')) return false;
    var link = img.closest('a[href]');
    if (link && link.getAttribute('href') !== '#') return false;  // link nawiguje
    if (EXCLUDE.some(s => img.closest(s))) return false;
    var r = img.getBoundingClientRect();
    if (Math.max(r.width, img.naturalWidth) < 40) return false;  // ikony
    var src = img.getAttribute('src') || img.src || '';
    if (!src || src.startsWith('data:image/svg')) return false;
    return true;
  });
  // ... attach click → open modal
}
```

---

## 📱 MOBILE {#mobile}

### Checklist
1. **Hamburger toggler**: `display: none` desktop, `display: inline-flex` @media <992px
2. **Hit area** min 44x48px + `::after inset: -4px` dla extra tap
3. **Inner elements** `pointer-events: none` — klik łapie button
4. **Menu expanded** → białe tło, items w stacku, `font-family: Inter sans-serif` (nie Playfair!)
5. **Nav items** w menu: bez pill border, z `border-bottom` separator, text-align left
6. **Navbar-reservation mobile**: max-width 140px (nie min!), font 11px, nowrap, 40px height
7. **Breakpoint 480px**: reservation jeszcze mniejszy (110px, 10.5px)

---

## 🐛 COMMON BUGS {#bugs}

### 1. `#filters_submit` (/offers) — brand styling
Default `.btn` ma `padding: 0 20px; border-radius: 0`. Zawsze override:
```css
body.page-offers #filters_submit {
  background: var(--ido-primary) !important;
  border-radius: 6px !important;
  padding: 14px 28px !important;
  font-size: 13px !important;
  letter-spacing: 1.5px !important;
  width: 100% !important;
  min-height: 48px !important;
}
```

### 2. Duplicated `.ap-hero__search-sub`
Hero search card ma label "Sprawdź dostępność" NAD przyciskiem o tej samej treści. Usuń: `display: none`.

### 3. Double arrow `→ →` na CTA
CSS `.ap-hero__cta::after { content: '→' }` + hardcoded `→` w HTML = dwie strzałki.
Fix: usuń z HTML, zostaw CSS.

### 4. `ap-heading-rule` 60px w final-cta
Krótka kreska dekoracyjna obok buttona — user: "dziwna". `display: none` w final-cta.

### 5. Counter dla liczb dziesiętnych (np. 9.6)
```html
<span data-ap-count="96" data-ap-divide="10">9.6</span>
```
```javascript
var divide = parseFloat(el.getAttribute('data-ap-divide')) || 1;
var decimals = divide > 1 ? (String(divide).length - 1) : 0;
// format: (raw / divide).toLocaleString('pl-PL', { minimumFractionDigits: decimals })
```

### 6. 404 na hardcoded images
Gdy klient zmienia oferty — stare offer-ID już nie mają przypisanych zdjęć. **Nigdy nie hardcoduj `/images/objects/pictures/large/X/Y/ID.jpg`**. Zawsze dynamic z fetch lub `.container-hotspot`.

### 7. CSS cascade — specificity > order
Nowsza reguła `!important` NIE wygra jeśli starsza ma wyższą specyficzność. Użyj defensive prefix `html body` + replikacja `:not()` chain starszej reguły.

### 8. SEO file — clean copy-paste
Bez komentarzy JARVIS, bez liczników znaków, bez markdown bullets. Tylko nagłówki sekcji + 4 pola (Nazwa:, Podpis:, META Tytuł:, META Opis:) + treść.

---

## 📋 CODE PATTERNS — copy-paste {#patterns}

### Brand vars override (FIRST in CSS)
```css
:root, html:root {
  --ido-primary:   #147D3B !important;
  --ido-secondary: #0E5C2B !important;
  --ido-dark:      #1A2E1A !important;
  --ido-bg:        #FAFAF8 !important;

  /* Override IdoBooking default13 vars */
  --maincolor1: var(--ido-primary) !important;
  --maincolor2: var(--ido-secondary) !important;
  --supportcolor1: var(--ido-primary) !important;
  --btn_large: var(--ido-primary) !important;
  --bgcolor1: var(--ido-bg) !important;

  /* Fonts */
  --ido-font-heading: 'Playfair Display', Georgia, serif;
  --ido-font-body:    'Inter', system-ui, sans-serif;
}
```

### Final CTA — dark brand section
```css
html body .{prefix}-final-cta {
  background: linear-gradient(135deg, var(--ido-primary), var(--ido-secondary)) !important;
  color: #ffffff !important;
  padding: 96px 24px !important;
  text-align: center !important;
}
html body .{prefix}-final-cta h2 { color: #fff !important; font-size: 40px !important; }
html body .{prefix}-final-cta .{prefix}-kicker {
  display: inline-block !important;
  background: rgba(255,255,255,0.15) !important;
  border: 1.5px solid rgba(255,255,255,0.35) !important;
  padding: 10px 24px !important;
  border-radius: 100px !important;
  color: #fff !important;
  font-size: 14px !important;
}
html body .{prefix}-final-cta .{prefix}-hero__cta {
  background: #fff !important;
  color: var(--ido-primary) !important;
  border: 2px solid #fff !important;
}
```

---

## 📊 HISTORY — AP case study

- **v1.0** (2026-04-16): initial build, żywa zieleń #147D3B + Playfair
- **v2.0** (2026-04-20): FAILED mockup adaptation (CSS 125KB cut by panel)
- **v1.0 ROLLBACK**: user chose original
- **v1.1-1.8.8**: 15 iteracji user feedback. Każda iteracja → nowy instinct (005-024).

**Lekcja meta**: każdy feedback od użytkownika = instinct. Nie powtarzaj tych samych błędów u innych klientów.

---

## 🔗 RELATED INSTINCTS

Wszystkie 005-024 są tutaj skonsolidowane. W razie potrzeby szczegółów, czytaj:

- 005 — filters_submit brand styling
- 006 — header no-shrink + logo top
- 007 — subpage full-width (tylko /txt)
- 008 — no contact duplication + attraction photos
- 009 — SEO file clean format
- 010 — auto-blog listing
- 011 — every image lightbox (blacklist)
- 012 — global typography scale
- 013 — logo chip background (SUPERSEDED by 019)
- 014 — CTA color consistency
- 015 — featured offers no-fallback
- 016 — header scroll class unify
- 017 — fontello icons unavailable
- 018 — navbar-toggler mobile only
- 019 — logo chip conditional + typography minimum
- 020 — CSS specificity beats order
- 021 — typography scope system pages
- 022 — Pexels photo visual verify
- 023 — html font-size 10px trap (SUPERSEDED by 024)
- 024 — px over rem when system root 10px (CURRENT)

**Pre-requisite reading**: CLAUDE.md traps #1-33.
