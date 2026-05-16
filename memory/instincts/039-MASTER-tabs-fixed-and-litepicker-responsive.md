---
name: 039-MASTER-tabs-fixed-and-litepicker-responsive
description: System .tabs.--fixed na /offer ma max-width:1140px wymuszony przez app.css IdoBooking. Override potrzebuje max-width:none + width:100vw, nie wystarczy width:100%. Litepicker container__months wymaga responsive grid 2-col na desktop + flex-column na mobile.
type: instinct
created: 2026-05-04
relatedTraps: ["#18 page-index/page-txt fullwidth", "#15 IdoBooking vars override"]
---

# .tabs.--fixed (drugie menu na /offer) + Litepicker responsive

## TRAP A — sticky tabs bar (drugie menu na podstronie apartamentu)

System IdoBooking renderuje na `body.page-offer` zakładki nawigacji apartamentu
(Kalendarz / Właściwości / Zasady / Cennik / Wyposażenie / Opinie) jako
`<div class="tabs">`. Po przewinięciu strony JavaScript systemu dodaje klasę
`--fixed` (BEM modifier) — wtedy zakładki przyklejają się do góry.

**Bug**: System `app.css` ma regułę `.tabs { max-width: 1140px }` (Bootstrap-like).
Gdy wpiszesz tylko:
```css
.tabs.--fixed { width: 100% !important; }
```
to NIE wystarczy. `width:100%` z `max-width:1140px` (system) = effective 1140px.
Element fixed wyląduje przesunięty na lewo (left:0) z pasem białego po prawej.

User widzi to jako "drugie menu które wygląda dziwnie / przesunięte".

**Fix**:
```css
html body .tabs.--fixed,
html body.page-offer .tabs.--fixed,
html body .tabs.tabs--fixed,
html body .tabs.sticky {
  position: fixed !important;
  top: 95px !important;
  left: 0 !important; right: 0 !important;
  inset-inline: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;        /* ← KRYTYCZNE — defeat system 1140 */
  min-width: 0 !important;
  margin: 0 !important;
  padding: 0 24px !important;
  z-index: 100 !important;
  background: rgba(255, 255, 255, 0.98) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  box-sizing: border-box !important;
}

/* Wewnętrzny content wycentrowany do max 1320px */
html body .tabs.--fixed > * {
  max-width: 1320px !important;
  width: 100% !important;
  margin: 0 auto !important;
  display: flex !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
}
```

**Verification**:
```js
window.scrollTo(0, 2500);
const tabs = document.querySelector('.tabs.--fixed');
const r = tabs.getBoundingClientRect();
console.log({ x: r.x, w: r.width, vp: window.innerWidth });
// Expected: x: 0, w ≈ window.innerWidth (allow scrollbar 15px diff)
```

## TRAP B — Litepicker responsive 2-month layout

Kiedy używasz Litepicker dla custom search widget LUB system IdoBooking
(używa Litepicker dla rezerwacji apartamentu), domyślne CSS daje:
- `numberOfMonths: 2, numberOfColumns: 1` → 2 miesiące **stacked vertically**
- `numberOfMonths: 1` → 1 miesiąc (za mało na desktop UX rezerwacji range)

**Bug 1**: Init z `numberOfMonths: 1` na homepage = user widzi tylko 1 miesiąc.
**Bug 2**: System render `.container__months.columns-2` jakimś flex-direction:column.

**Fix JS** (nasz custom init, np. `.sa-cmd-bar__form`):
```js
var isDesktop = window.matchMedia('(min-width: 720px)').matches;
new Litepicker({
  ...
  numberOfMonths: isDesktop ? 2 : 1,
  numberOfColumns: isDesktop ? 2 : 1,
  mobileFriendly: true,
  ...
});
```

**Fix CSS** (override system Litepicker + zapewni grid layout niezależnie od config):
```css
/* Litepicker main container nie może mieć fixed width 326 */
html body .litepicker .container__main {
  width: auto !important;
  max-width: none !important;
}

/* Desktop ≥720px: zawsze 2 kolumny side-by-side */
@media (min-width: 720px) {
  html body .litepicker .container__months,
  html body .litepicker .container__months.columns-2 {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 24px !important;
    width: auto !important;
    min-width: 660px !important;
  }
  html body .litepicker .container__months > .month-item {
    flex: 0 0 auto !important;
    width: 100% !important;
    min-width: 0 !important;
  }
}

/* Mobile <720px: 1 miesiąc (czytelność na małym ekranie) */
@media (max-width: 719px) {
  html body .litepicker .container__months {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
  }
  html body .litepicker .container__months > .month-item { width: 100% !important; }
  html body .litepicker { max-width: calc(100vw - 24px) !important; }
}
```

## Kiedy stosować

**ZAWSZE** dla nowego klienta z `body.page-offer` (każda strona apartamentu).
**ZAWSZE** gdy implementujesz custom search widget z Litepicker (homepage, hero search bar).
**ZAWSZE** gdy IdoBooking renderuje system kalendarz dostępności na /offer (ma własny Litepicker — nasze CSS go też złapie).

## Live verification (3 viewports — trap #5 metodologia)

| Test | Desktop 1440 | iPhone 390 |
|---|---|---|
| `.tabs.--fixed` rect.x | 0 | hidden (system response) |
| `.tabs.--fixed` rect.w | ≈ window.innerWidth | n/a |
| Litepicker `display` | grid | flex |
| Litepicker `flex-direction` | n/a (grid) | column |
| Litepicker `gridTemplateColumns` | 1fr 1fr | none |

## Referencja

Klient: solidneapartamenty (v1.6, 2026-05-04)
- Plik CSS: `clients/solidneapartamenty/DO_WKLEJENIA/SA_CSS_EDYTOR.css`
  - Linia ~4582: `.tabs.--fixed` rule
  - Linia ~3088: Litepicker responsive media queries
- Plik JS: `clients/solidneapartamenty/DO_WKLEJENIA/SA_KONIEC_BODY.html`
  - Linia ~454: Litepicker init z `isDesktop ? 2 : 1`
