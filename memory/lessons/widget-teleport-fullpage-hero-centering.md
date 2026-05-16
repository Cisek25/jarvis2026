# Lesson — Widget teleport do hero + pionowe centrowanie w viewport (fullpage.js)

**Data:** 2026-04-24
**Klient:** EcoCamping (ecocamping)
**Kategoria:** fullpage.js trap + layout centering

## Problem

Wkleiłem custom search widget `.ec-search-wrap` w body_top strony głównej.
User raport: **"w ogóle się nie pojawił"** → chwilę później: **"jest, ale za nisko"** → potem: **"w menu teraz jest za wysoko"**.

3 iteracje zanim widget był tam gdzie user oczekiwał (wyśrodkowany w viewportcie hero).

## Root cause (3 warstwy)

### Warstwa 1 — fullpage.js daje section 2, nie hero
IdoBooking homepage używa fullpage.js ze zdefiniowanymi sekcjami:
- `.section.parallax` = section 1 (hero ze zdjęciem)
- `.section.index-info` = section 2 (content z body_top)

Body_top content domyślnie ląduje w **section 2**, nie w hero. Widget był dostępny dopiero po scrollu w dół — user pierwszego wejścia go nie widział.

**To jest dokumentowany trap #2 w CLAUDE.md** — ale pierwszy raz musiałem aplikować go do widgetu, nie hero-wrap.

### Warstwa 2 — Teleport działa, ale padding=0 = za wysoko
Po teleport do `.section.parallax .fp-tableCell`:
- `.fp-tableCell { display: table-cell; vertical-align: middle }` — centruje pionowo
- Problem: widget wpada pod `header.defaultsb` (position: fixed top: 0, z-index wysoki)
- User: "w menu za wysoko" = widget TOP czasami pod headerem

### Warstwa 3 — Hero za krótkie = widget się nie mieści
Bez `min-height: 100vh` na `.section.parallax` + `.fp-tableCell`, section miała ~400-600px wysokości. Card widgetu + padding nagłówka > wysokość section → overflow lub wizualne nałożenie na treść section 2.

## Fix (3-warstwowy)

### CSS (§33B w CSS_EDYTOR.css)
```css
body.page-index .section.parallax,
body.page-index .section.parallax .fp-tableCell,
body.page-index .section.parallax .fp-tableCell .fp-table {
  min-height: 100vh !important;
}
body.page-index .section.parallax .fp-tableCell {
  display: table-cell !important;
  vertical-align: middle !important;
  padding: 140px 0 60px !important;   /* kompensacja headera (page-top ~36px + navbar ~88px) */
}
@media (max-width: 768px) {
  body.page-index .section.parallax .fp-tableCell {
    padding: 90px 0 40px !important;  /* header mobile ~60px */
  }
}
@media (max-width: 480px) {
  body.page-index .section.parallax .fp-tableCell {
    padding: 80px 0 32px !important;
  }
}
```

### JS teleport (§21 w body_bottom)
```javascript
function teleportEcSearchWidget() {
  var wrap = document.querySelector('.ec-search-wrap');
  var parallax = document.querySelector('.section.parallax');
  if (!wrap || !parallax) return false;
  var target = parallax.querySelector('.fp-tableCell') || parallax;
  if (target.contains(wrap)) return true;
  target.appendChild(wrap);
  wrap.classList.add('ec-search-wrap--teleported');
  return true;
}
/* Initial + burst retries (fullpage.js renderuje z opóźnieniem) */
teleportEcSearchWidget();
[50, 150, 300, 600, 1000, 2000, 4000].forEach(function(d) {
  setTimeout(teleportEcSearchWidget, d);
});
/* MutationObserver (15s) — gdy system re-render sekcje, re-teleport */
```

### CSS dla teleported state
```css
.ec-search-wrap--teleported {
  background: transparent !important;  /* reset cream bg — hero image widoczny */
  padding: 0 24px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ec-search-wrap--teleported .ec-search-card {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(8px);          /* premium glass effect nad zdjęciem */
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
}
```

## Co zadziałało vs nie

| Attempt | Approach | Wynik |
|---|---|---|
| 1 | Widget w body_top bez teleport | ❌ "nie pojawił się" — ląduje w section 2, niewidoczny bez scroll |
| 2 | JS teleport do .fp-tableCell, no padding | ⚠️ "za nisko" na desktop, "za wysoko" (pod headerem) na mobile |
| 3 | Teleport + padding-top 140px desktop / 90px mobile / 80px small | ✅ Widget wyśrodkowany poniżej headera |

## Generalizacja (instinct 034 + trap #2)

Ten problem dotyczy KAŻDEGO klienta który:
1. Ma fullpage.js homepage (`section.parallax`)
2. Chce widget/CTA/hero content od razu w viewportcie na entry

**Wzorzec teleport + padding header-compensation jest UNIWERSALNY.**
Per klient różnią się tylko wartości paddingu (zależne od wysokości jego headera):
- Desktop: zwykle `120-150px` (page-top strip + navbar)
- Mobile: zwykle `80-100px` (sam navbar, page-top hidden)
- Small: `70-90px`

**Audit przed aplikacją per klient:**
```javascript
document.querySelector('header.defaultsb').getBoundingClientRect().height
/* oraz */
document.querySelector('.page-top')?.getBoundingClientRect().height || 0
/* Sum = header total height → padding-top */
```

## Linki
- **Instinct**: `memory/instincts/034-custom-search-widget-flatpickr-port.md`
- **Trap**: CLAUDE.md trap #2 — JS teleport hero
- **Reference impl**: clients/ecocamping/DO_WKLEJENIA/ (§0, §20, §21)
- **AP pattern source**: clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html §11 (teleportHeroWrap)

## Red flag następnym razem

Jeśli user mówi **"widget się nie pojawił"** na homepage z fullpage.js:
- Nie panikuj
- Nie szukaj bug w CSS display/visibility
- **Najpierw sprawdź czy widget wylądował w section 2** (scroll w dół lub `document.querySelector('.ec-search-wrap').closest('.section').className`)
- Jeśli tak → aplikuj teleport pattern z instinct 034

Jeśli user mówi **"widget jest za wysoko/nisko"** po teleport:
- Sprawdź header height w DevTools
- Dostosuj padding-top `.fp-tableCell` w 3 breakpointach
- Weryfikuj na desktop 1440 + mobile 390 + mobile 360
