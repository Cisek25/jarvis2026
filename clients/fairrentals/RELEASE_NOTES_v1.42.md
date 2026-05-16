# Fair Rentals — Release v1.42 (SZUKAJ field-match + Litepicker pozycja)

**Data**: 2026-05-15 (sesja 11 — klient zgłosił że SZUKAJ vs FIELDS niezgodne + Litepicker przesunięcie)
**Stan przed**: v1.41 (centrowanie pastylki + 3 patche UX)
**Stan po**: v1.42 (SZUKAJ stretch do height FIELD + Litepicker w górnej połowie viewportu)

---

## Problem 1: SZUKAJ wizualnie mniejszy niż FIELD-y (label + input)

**Live audit** (chrome-devtools MCP):
- `.fr-cmd-bar__form`: `display: grid`, `align-items: end`, height 76.39px
- `.fr-cmd-bar__field` (Przyjazd/Wyjazd/Goście): height **76.39px** każde (label 24px + input 52px)
- `.fr-cmd-bar__input` (sam input): height **52px**
- `.fr-cmd-bar__submit` (SZUKAJ po v1.41): height **52px**

Klient: *"Mniejsze wielkościowo od SZUKAJ przyciski, przecież to widać w HTML od razu"*

Klient porównuje **FIELD jako całość** (label + input = 76px) z **SZUKAJ** (52px). Ja w v1.41 zrównałem SZUKAJ z **inputem** (52px), ale nie z **całym fieldem**. SZUKAJ jest grid item w tym samym wierszu co fields, więc powinien zająć **full grid row height (76px)**.

**Fix §107i**: `align-self: stretch` żeby SZUKAJ zajął całą wysokość grid row.

```css
html body.page-index .fr-cmd-bar__form button.fr-cmd-bar__submit,
html body.page-index .fr-search-banner .fr-cmd-bar__form button.fr-cmd-bar__submit,
... {
  align-self: stretch !important;
  height: auto !important;
  min-height: 52px !important;
  padding: 14px 26px !important;
  font-size: 16px !important;
}
```

**Live verified**:
```
Before: szukajHeight 52, fieldHeight 76.39, match: false
After:  szukajHeight 76.39, fieldHeight 76.39, match: TRUE ✓
```

Specificity wzmocniony do (0,4,4) chained: body.page-index + .fr-search-banner + .fr-cmd-bar__form + button.fr-cmd-bar__submit. Pobija wszystkie konkurujące reguły z custom.css.

---

## Problem 2: Litepicker przesunięty + prawa strona ucięta

**Live audit**:
- W systemowym `app.css.gz`:
```css
.litepicker {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```
- Centruje datepicker w **środku viewportu** (mobile-friendly modal pattern)
- Width 718px (2 miesiące desktop)
- Na desktop wygląda jako "przesunięty" — nie pojawia się pod inputem, lecz w centrum
- Plus inline style JS Litepicker (`left: 626.75px; top: 310px`) **PRZEGRYWA** z systemowym CSS

Klient: *"Prawa jego część jest jakaś ucięta na końcu i widać kawałek zdjęcia"*

Na mniejszych viewport (1100-1280) Litepicker 718px szerokości + center → wystaje za prawą krawędź.

**Fix §107k**: Litepicker jako modal **w górnej części viewportu** (top: 20%) + horizontal center + max-width safety:

```css
@media (min-width: 992px) {
  html body .litepicker:not(.mobilefriendly) {
    top: 20% !important;        /* z 50% (środek) → 20% (górna część) */
    left: 50% !important;
    transform: translateX(-50%) !important;  /* tylko X, NIE Y */
    max-width: calc(100vw - 32px) !important;
    max-height: calc(100vh - 80px) !important;
    overflow-y: auto !important;
  }
}
```

**Live verified**:
```
Before: lpTop 450 (middle), lpRight 1430.5 → 9.5px do prawej krawędzi (close to overflow)
After:  lpTop 180 (top 20%), lpRight 1071.5 → 368px margin, horizontally centered
        withinViewport: true ✓
        inUpperHalf: true ✓
        horizontallyCentered: true ✓
```

Klient zobaczy Litepicker:
- Jako modal w **górnej części** viewportu (zaraz pod headerem)
- **Centered horyzontalnie** (nie wystaje za prawą krawędź)
- Z safety `max-width: calc(100vw - 32px)` chroni przed overflow na mniejszych viewport
- Plus `max-height: calc(100vh - 80px)` + `overflow-y: auto` jeśli za wysoki

---

## Zmiany w pliku FR_ARKUSZ_STYLOW.css

| Sekcja | Zmiana |
|---|---|
| §107i | Wzmocniona specificity (chained 4 classes) + `align-self: stretch` + `height: auto` |
| §107k | Przepisana: top 20% + horizontal center transform + max-width/height safety |

---

## Wgranie do panelu — checklista v1.42

1. ☐ Wgrać aktualne [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css)
2. ☐ Cmd+Shift+R w przeglądarce
3. ☐ Verify **home** `/`:
   - SZUKAJ button: wysokość 76px = field height ✓
   - Pola PRZYJAZD/WYJAZD/GOŚCIE wyrównane z SZUKAJ (bottom edge aligned)
4. ☐ Verify **Litepicker**:
   - Klik na "Wybierz datę" → datepicker pojawia się **w górnej części viewportu** (top 20%)
   - Centered horyzontalnie
   - Nie wystaje za prawą krawędź na żadnym viewport >= 768px
5. ☐ Verify na różnych viewport (1100/1280/1440/1920)

---

## Live verified summary

| Element | Before | After |
|---|---|---|
| SZUKAJ height | 52px (= input 52px ale != field 76px) | **76.39px** = field 76.39px ✓ |
| SZUKAJ font/svg (z v1.41) | font 16px, svg 22px | bez zmian (zachowane) ✓ |
| Litepicker pozycja | top 50% (center) | **top 20%** (modal upper) ✓ |
| Litepicker centered horizontally | tak ALE wystawał prawą krawędzią | **tak** + safety max-width ✓ |
| Litepicker withinViewport | borderline (lpRight 1430/1440) | **comfort margin** (lpRight 1071/1440) ✓ |

---

## Status overall

| Bucket | v1.41 | v1.42 |
|---|---|---|
| SZUKAJ height match fields | ❌ 52 vs 76 mismatch | ✅ 76 = 76 stretch |
| Litepicker pozycja | ❌ center, wystawał | ✅ top modal, w viewport |
| Pastylka OD centered (z v1.41) | ✅ | ✅ |
| Zobacz na mapie czarny tekst (z v1.41) | ✅ | ✅ |
| Litepicker arrows aspect (z v1.41) | ✅ | ✅ |

---

## Co dalej

1. **Damian wgrywa** FR_ARKUSZ_STYLOW.css v1.42
2. **Live verify** wszystkich elementów
3. **Pozostałe** akcje klienta panelu (title DE, menu EN/DE kolejność, OG image http→https)
