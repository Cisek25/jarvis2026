---
name: px-over-rem-when-system-root-10px
description: 🔥 Gdy system ma `html { font-size: 10px }` (IdoBooking default13), ZAWSZE pisz typography w absolutnym `px` — nie rem. NIE próbuj resetować root do 16px — łamie to systemowe style które były pisane pod 10px.
type: instinct
scope: all-clients
trigger: styling typography dla klienta IdoBooking / user 'za małe' lub 'za duże' po modyfikacji
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — 5 iteracji fails v1.7→v1.8.6
supersedes: instinct 023 (html=16px reset — wycofany)
priority: CRITICAL-FIRST-DAY
---

# Instynkt: PX nad REM w IdoBooking

## Historia bólu (AP v1.7 → v1.8.6)
1. **v1.7**: bumpnąłem typography z 16px → 17px, ale rules w rem.
   html=10 → `0.85rem = 8.5px` = user "za małe"
2. **v1.8.2**: kolejne bumpnięcie, rules w rem. Wciąż html=10.
   `0.95rem = 9.5px` = user "za małe"
3. **v1.8.5**: ODKRYŁEM html=10px. Zrobiłem `html { 16px !important }`.
   Wszystkie rem renderują 1.6x większe. User: **"rozjechało całkowicie, za duże"**.
4. **v1.8.6**: revert do html=10px + wszystkie moje rules w absolutnym px.
   Problem rozwiązany.

## Reguła (twarda)

### ❌ Nie rób
```css
html { font-size: 16px !important; }  /* resetuje system */
.{prefix}-kicker { font-size: 0.85rem !important; }  /* zależne od root */
```

### ✅ Rób
```css
/* System zostaje z html=10px (nie ruszamy!) */

/* Nasze rules — zawsze w px */
.{prefix}-kicker { font-size: 13px !important; }
.{prefix}-card-title { font-size: 22px !important; }
.{prefix}-card-desc { font-size: 15px !important; }
.nav-link.nav-link { font-size: 14px !important; }  /* double-class dla specyficzności */
```

## Checklist dla typography w IdoBooking

1. **Sprawdź root**: `getComputedStyle(document.documentElement).fontSize`
   - Jeśli `10px` → NIE używaj rem w swoich rules
   - Jeśli `16px` → rem OK ale px też bezpieczniejsze
2. **Wszystkie moje font-size** → absolute `px`
3. **Wszystkie letter-spacing** → absolute `px` (nie em!)
4. **Padding na tekstach** → `px`
5. **Dla responsive**: `@media` + px (nie rem-scaling)

## Wyjątek: clamp() OK
```css
h2 { font-size: clamp(24px, 4vw, 40px) !important; }
```
Bo wszystkie wartości w px, `vw` to viewport — niezależne od root.

## Weryfikacja po wklejeniu
```javascript
// DevTools:
Array.from(document.querySelectorAll('.{prefix}-kicker, .nav-link, h2, p'))
  .slice(0, 20)
  .map(el => ({
    sel: el.tagName + '.' + (el.className||'').slice(0,20),
    fs: getComputedStyle(el).fontSize
  }));
// Oczekiwane: wszystkie w px, brak nieczytelnych <12px
```

## Dlaczego NIE zresetować html=16px
Alternatywa "zresetuj root do 16px" wygląda atrakcyjnie bo:
- Teoretycznie wszystkie rem działają znów jak "normal"
- Nasz kod może używać standard rem convention

Ale:
- **System custom rules** (app.css) często używają `1.4rem` zakładając
  że to 14px. Po reset do 16px renderują się 22.4px — za duże
- **Flatpickr, Slick, inne JS libs** osadzone w IdoBooking używają rem
  wartości bazujących na 10px root
- **Efekt domina**: naprawiając nav-link psujesz date-picker, formatki,
  offer cards, system widgetów

**Bezpieczniej**: pisać własne reguły w px, nie ruszać system.

## Case study AP — measured impact
Po revert html=16px → 10px (v1.8.5 → v1.8.6):
- Nav-link 1rem → 10px (za małe, ale system mialı 1rem rule o niższej specyficzności, da się pokonać)
- Moje rules: `nav-link.nav-link { 14px !important }` (double-class trick) → wygrywa
- System flatpickr etc. działa normalnie, nie rozwalony

## Double-class trick
Gdy system rule ma więcej `:not()` = wyższa specyficzność:
```css
/* System (wysoka specyficzność przez :not chain) */
body header.default13 .navbar a[href]:not(.logo):not(.navbar-brand):not([class*="btn"]) {
  font-size: 1rem !important;  /* = 10px w IdoBooking */
}

/* Nasze — double class bumps specyficzność */
.nav-link.nav-link { font-size: 14px !important; }
```

`.nav-link.nav-link` liczy się jako **2 klasy** (nie jedna) — mimo że
element ma klasę tylko raz, selector w CSS liczy wystąpienia.

## Referencja
- Client: apartamenty-parkowe (client58154)
- 5 iteracji v1.7→v1.8.6 to discovery i fix tej konwencji
- CSS patch: `AP_CSS_EDYTOR.css` §12c + v1.8.6 + v1.8.7
- **Supersedes**: instinct 023 (html=16px reset) — wycofany, za ryzykowny
- Related: instinct 020 (CSS specificity beats order)

## Dla nowych klientów IdoBooking
Pierwszy krok przed jakąkolwiek typografią:
1. Otwórz devtools na live site klienta
2. `getComputedStyle(document.documentElement).fontSize`
3. Jeśli 10px → od razu wiesz że ZAWSZE pisz w px (i tylko px)
4. Jeśli 16px → normal CSS zasady
