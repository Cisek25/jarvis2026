---
name: MASTER-subpage-header-default-state-and-offers-traps
description: Master instinct — header DEFAULT state musi byc light bg + dark text (dla wszystkich subpages). Tylko homepage transparent gdy not-scrolled. PLUS /offers system traps #13 (.iai-search hide), #14 (FA icons hide + CSS chevron), #16 (span.btn line-height fix), .index-info z-index reset, system widget fonts. Bez tych regul subpage menu jest white-on-cream (niewidoczne) + /offers ma duplikat search widget + filtry maja broken FA chevrons.
type: master-instinct
scope: all-clients (IdoBooking default13, all subpages)
added: 2026-05-04
source_clients: solidneapartamenty v1.1 (user feedback "nie widac menu, podstrona /offers ma wyszukiwarke")
priority: APPLY-DAY-ONE
extends: 000 (master-playbook), 037 (page-index-fullwidth)
---

# MASTER — Subpage header default state + /offers system traps

## Problem

Po dostarczeniu solidneapartamenty v1.1 user pokazal screenshot /offers gdzie:
- Header transparent + biały tekst → na kremowym tle podstrony INVISIBLE menu
- Logo "w ramce" (chip) — chip biały na kremowym tle wyglada jak losowa karta
- /offers wciąż ma systemowy widget rezerwacji `.iai-search`
- Filtry "udogodnienia" rozwiniete (wszystkie checkboxy widoczne, brak collapse)
- Filter headers z brakujacymi FA ikonami chevron

Source quote: **"nie widac menu i nagle logo zrobiłes w ramce, a o to nie prosiłem, miales je powiekszyc tylko. JARVIS TO WIE, ze ma".**

## Root cause

Domyslny stan headera mial styling **transparent + white text** (dla hero kontrast nad zdjeciem),
a klasa `.{prefix}-header--scrolled` aktywuje stan light. Ale na podstronach gdzie nie ma hero,
JS nie dodaje klasy scrolled (bo `scrollY = 0` w momencie zaladowania). Default state aktywny → white text na cream → invisible.

## Reguła 1 — Header default state = LIGHT (z dark text)

**Domyślny styl header.default13 to LIGHT BG + DARK TEXT**. Tylko homepage `body.page-index` ma override do transparent gdy nie jest scrolled.

```css
/* Default — light bg, dark text (subpages + scrolled state on homepage) */
html body header.default13 {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: saturate(140%) blur(14px) !important;
  box-shadow: var(--sa-shadow-sm) !important;
}

html body header.default13 .nav-link.nav-link {
  color: var(--sa-text-dark) !important;
}

/* Logo NO chip — chip only on homepage transparent */
html body header.default13 .navbar-brand {
  background: transparent !important;
  box-shadow: none !important;
  padding: 6px 0 !important;
}

/* Homepage transparent state — only when NOT scrolled */
html body.page-index header.default13:not(.{prefix}-header--scrolled) {
  background: transparent !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
}

html body.page-index header.default13:not(.{prefix}-header--scrolled) .nav-link.nav-link {
  color: var(--sa-white) !important;
}

html body.page-index header.default13:not(.{prefix}-header--scrolled) .navbar-brand {
  background: rgba(255, 255, 255, 0.96) !important;
  padding: 6px 14px !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 20px rgba(58, 47, 51, 0.12) !important;
}
```

**Każda regula koloru menu/logo/toggler MUSI mieć dwie wersje:**
- Default (light) — dla subpages i scrolled state
- `body.page-index header:not(.scrolled)` — biały tekst dla hero contrast

## Reguła 2 — TRAP #13: Hide `.iai-search` na /offers i /txt

System renderuje `.iai-search` jako pasek wyszukiwarki + `#iai_book_se`. Na /offers ten pasek **duplikuje** sidebar filtrów. Na /txt nie ma sensu.

```css
html body.page-offers .iai-search,
html body.page-offers #iai_book_se,
html body.page-offers #iai_book_form:not(.{prefix}-search),
html body.page-txt .iai-search,
html body.page-txt #iai_book_se,
html body.page-txt #iai_book_form:not(.{prefix}-search) {
  display: none !important;
}
```

## Reguła 3 — TRAP #14: FontAwesome NOT loaded → CSS chevron

System default13 NIE LADUJE FontAwesome. Filter headers z `<i class="fa fa-angle-down">` renderują się jako 0x0 boxy. **Hide FA + CSS chevron z border tricku.**

```css
html body.page-offers .filter_header .fa,
html body.page-offers .filter_header [class^="fa-"],
html body.page-offers .filter_header [class*=" fa-"] {
  display: none !important;
}

html body.page-offers .filter_header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  cursor: pointer !important;
  padding: 14px 18px !important;
  border: 1px solid var(--{prefix}-border-light) !important;
  border-radius: 12px !important;
}

html body.page-offers .filter_header::after {
  content: "" !important;
  width: 9px !important;
  height: 9px !important;
  border-right: 2px solid var(--{prefix}-primary) !important;
  border-bottom: 2px solid var(--{prefix}-primary) !important;
  transform: rotate(45deg) !important;
  transition: transform 0.3s ease !important;
}

html body.page-offers .filter_header[aria-expanded="true"]::after {
  transform: rotate(-135deg) !important;
}

html body.page-offers .filter_content.collapse:not(.show) { display: none !important; }
html body.page-offers .filter_content.collapse.show { display: block !important; }
```

## Reguła 4 — TRAP #16: span.btn line-height 49px

System CSS ustawia `span.btn { line-height: 49px; height: 49px }` co tworzy
ENORMOUS przyciski "SZCZEGOŁY" na ofertach. Reset:

```css
html body.page-offers span.btn,
html body .offer span.btn {
  line-height: 1.4 !important;
  height: auto !important;
  display: inline-flex !important;
  align-items: center !important;
  padding: 11px 24px !important;
}
```

## Reguła 5 — `.index-info` z-index reset

System ustawia `.index-info { z-index: 1000; position: absolute }` co BLOKUJE
pointer events na hero CTAs. Reset z + pointer-events:

```css
html body .index-info {
  z-index: 1 !important;
  pointer-events: none !important;
  overflow: visible !important;
}

html body .index-info * { pointer-events: none !important; }
html body .index-info button,
html body .index-info .navbar-reservation { display: none !important; }
```

## Reguła 6 — System widget fonts (Litepicker, flatpickr, iai-search)

System widgety używają `-apple-system, Roboto, ...` font stack. Force brand body font żeby wszystko spojnie:

```css
html body .litepicker, html body .litepicker *,
html body .flatpickr-calendar, html body .flatpickr-calendar *,
html body .iai-search, html body .iai-search *,
html body #iai_book_form, html body #iai_book_form *,
html body .widget__option, html body .widget__option * {
  font-family: var(--{prefix}-font-body) !important;
}

html body .litepicker .cur-month {
  font-family: var(--{prefix}-font-display) !important;
}
```

## Reguła 7 — Persons dropdown chevron (system btn invisible without FA)

```css
html body #iai_book_form .widget__option.iai_input-small .iai_widget_btn {
  position: absolute !important;
  top: 50% !important; right: 16px !important;
  transform: translateY(-50%) !important;
  width: 20px !important; height: 20px !important;
  font-size: 0 !important;
  background: transparent !important;
}

html body #iai_book_form .widget__option.iai_input-small .iai_widget_btn::after {
  content: '' !important;
  width: 8px !important; height: 8px !important;
  border-right: 2px solid var(--{prefix}-text-dark) !important;
  border-bottom: 2px solid var(--{prefix}-text-dark) !important;
  transform: rotate(45deg) !important;
}
```

## Checklist nowego klienta

- [ ] Header default = light bg + dark text (NIE transparent + white)
- [ ] Transparent state TYLKO na `body.page-index header:not(.scrolled)`
- [ ] Logo chip TYLKO na transparent header (homepage hero)
- [ ] `.iai-search` hidden na /offers + /txt
- [ ] `.filter_header .fa-*` hidden, CSS chevron added
- [ ] `.filter_content.collapse` Bootstrap support
- [ ] `span.btn` line-height fix
- [ ] `.index-info` z-index 1 + pointer-events none
- [ ] System widgets font-family forced to brand
- [ ] Persons chevron CSS replacement
- [ ] FormButton brand styling

## Weryfikacja na live

```javascript
// 1. Header bg na subpage?
getComputedStyle(document.querySelector('header.default13')).backgroundColor
// PASS: rgb(255, 255, 255, 0.98) na subpage
// FAIL: rgba(0, 0, 0, 0) (transparent — bug)

// 2. Nav links visible?
getComputedStyle(document.querySelector('header .nav-link')).color
// PASS: rgb(58, 47, 51) (dark) na subpage
// FAIL: rgb(255, 255, 255) (white invisible on cream)

// 3. .iai-search ukryty na /offers?
document.querySelector('body.page-offers .iai-search:not([style*="display: none"])')
// PASS: null (hidden)

// 4. Filter headers maja chevron?
const filterHeader = document.querySelector('.filter_header');
window.getComputedStyle(filterHeader, '::after').width
// PASS: "9px" lub similar (CSS chevron rendered)

// 5. Logo chip TYLKO na hero?
const navbrand = document.querySelector('.navbar-brand');
const isPageIndex = document.body.classList.contains('page-index');
const isScrolled = document.querySelector('header').classList.contains('sa-header--scrolled');
const bg = getComputedStyle(navbrand).backgroundColor;
// PASS subpage: bg = transparent
// PASS homepage hero (not scrolled): bg = white
// PASS homepage scrolled: bg = transparent
```

## Powiązane

- **Trap #2, #3** (CLAUDE.md) — header `.menu-wrapper` child has bg, JS teleport hero
- **Trap #18** + instinct 037 — page-index full-width + hide system duplicates
- **Instinct 005** — filters_submit brand styling
- **Instinct 013, 019** — logo chip conditional
- **Instinct 017** — fontello icons unavailable
- **Instinct 028** — one shared JS file per page

## Meta-lekcja

**Header default state = light**. Transparent state to wyjątek (homepage hero), nie reguła. JARVIS
ma to zapisane w klientach AP/MADERA/NAJMAR — używaj zawsze tego patternu, nie odkrywaj na nowo.

**/offers ma 4 obowiązkowe overrides**: hide .iai-search (#13), hide FA + CSS chevron (#14),
span.btn line-height (#16), filter collapse Bootstrap. Bez nich strona /offers wygląda jak system bez stylowania.

User SA (2026-05-04): "JARVIS TO WIE, ze ma. tobyc zrobione, sluchaj zalecen jarvisa".
