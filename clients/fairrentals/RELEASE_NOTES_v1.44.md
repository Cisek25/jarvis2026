# Fair Rentals — Release v1.44 (Lead text contrast na subpages)

**Data**: 2026-05-15 (sesja 13)
**Stan przed**: v1.43 (SZUKAJ = INPUT height)
**Stan po**: v1.44 (kontrast lead na page-txt hero — z muted gray na white)

---

## Problem

Klient: *"na podstronie Obsługa najmu krótkoterminowego: 'Powierz nam swój apartament...' — ten napis jest słabo widoczny :/ kontrasty"*

**Live audit chrome-devtools**:
- Element: `<p class="fr-page-hero__lead">`
- Hero: `background-image` (Unsplash photo kluczy w drzwiach apartamentu)
- Hero `::after` overlay: `linear-gradient(rgba(26,26,24, 0.55) 0%, rgba(26,26,24, 0.85) 100%)` — **bardzo ciemny**
- **Title** (#fff white) + text-shadow → kontrast 14:1 ✓ AAA
- **Lead** color: **`#7A736B`** (`--fr-text-muted` sage gray) — na ciemnym overlay → kontrast **~2.5:1 FAIL** WCAG AA (4.5:1 minimum)

**Source bug** (linia 11313 FR_ARKUSZ_STYLOW.css):
```css
html body.page-txt .fr-page-hero__lead,
html body[class*="obsluga"] .fr-page-hero__lead {
  color: var(--fr-text-muted, #4a4a4a) !important;  /* SAGE — przegrywa kontrast */
}
```

Ten override (specificity 0,3,2) wygrywa z poprzednią regułą (linia 4105) `color: rgba(255,255,255, 0.96)` (white, AAA) bo była niższa specificity (0,2,2).

---

## Fix §100c v1.44 (linia 11309-11317)

```css
html body.page-txt .fr-page-hero__lead,
html body[class*="obsluga"] .fr-page-hero__lead {
  font-size: clamp(15px, 1.5vw, 17px) !important;
  line-height: 1.65 !important;
  color: rgba(255, 255, 255, 0.95) !important;             /* z sage gray na white */
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55) !important;  /* wzmocniony shadow */
  max-width: 720px !important;
}
```

**Live verified**:
```
Before: color rgb(122, 115, 107) sage muted → kontrast 2.5:1 FAIL
After:  color rgba(255, 255, 255, 0.95) white → kontrast ~14:1 ✓ AAA
        text-shadow rgba(0,0,0, 0.55) 0px 1px 6px (wzmocniony)
```

---

## Wpływ

Naprawione na WSZYSTKICH page-txt subpages z `fr-page-hero`:
- `/txt/200` — Atrakcje Wrocławia
- `/txt/202` — Dla Biznesu / Corporate housing
- **`/txt/203` — Obsługa najmu** (zgłoszone przez klienta)
- `/txt/204` — O nas
- `/txt/205` — Blog

Wszystkie hero lead'y będą teraz cream-white na ciemnym overlay = AAA kontrast.

---

## Wgranie

1. Wgraj [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css)
2. Cmd+Shift+R
3. Verify na `/txt/203/Obsluga-najmu` (i innych subpages) — tekst lead pod h1 widoczny biały, kontrastujący z dark overlay

---

## Status

| | v1.43 | **v1.44** |
|---|---|---|
| Hero lead na page-txt subpages | ❌ sage gray na dark, kontrast 2.5:1 (FAIL) | ✅ white 95%, kontrast 14:1 (AAA) |
| SZUKAJ height (z v1.43) | ✅ 52px = input | ✅ |
| Litepicker pozycja (z v1.42) | ✅ top 20% | ✅ |
