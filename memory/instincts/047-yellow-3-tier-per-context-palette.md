# 047 — 3-tier yellow palette per kontekst (czytelność + brand)

## Problem
Jeden żółty signature `#E2D700` (chartreuse z fairrentals.pl) działa na BG pillów z czarnym tekstem (kontrast 11.7:1 AAA), ale:
- Jako **tekst na cream** `#FAF7F2` — kontrast **1.45:1** (WCAG FAIL)
- Jako **tekst na dark** `#0F0F0E` — kontrast **11.7:1** OK ale wygląda **fluo/żarówiasty** (subiektywny feedback Damiana)

## Reguła

**Zdefiniuj 3 tiers żółtego per kontekst. Nie używaj signature primary jako tekst.**

## Pattern (Fair Rentals v1.15)

### CSS variables
```css
:root, html:root {
  --fr-primary: #E2D700;       /* signature, BG na pillach z czarnym tekstem */
  --fr-yellow-text: #C8B43E;   /* muted, ~13% darker, TEKST na DARK */
  --fr-yellow-deep: #8A7300;   /* musztardowy, ~40% darker, TEKST na CREAM */
}
```

### Użycie

**`--fr-primary` #E2D700** — TYLKO jako BG (z czarnym tekstem na nim):
- `.fr-btn--primary` (CTA buttons)
- `.fr-apt-card__price` (price badge)
- `.fr-cmd-bar__submit` (search submit)
- Hero glassmorphism badge num

**`--fr-yellow-text` #C8B43E** (kontrast na dark ~7.5:1 AAA) — TEKST na DARK:
- Magazine quote em / cudzysłów / atrybucja
- Stats asymmetric hero kicker + duże numbery
- Trust bar 4 cells
- Final CTA kicker pill
- Footer phone/email/tagline + yellow gradient separator
- Hero kicker line + title em underline

**`--fr-yellow-deep` #8A7300` (kontrast na cream ~5:1 AA) — TEKST na CREAM:
- Principles `01/02/03` italic numerki
- Districts pins `A/B/C/D`
- Trust card source dot + link border
- Section kicker rule
- Principles head em underline
- Journey timeline filled circle + line connector
- District hover border

## Generalizacja

Dla każdego klienta z signature żółtym (chartreuse, mustard, gold, lemon):

| Tier | Modifier | Użycie |
|---|---|---|
| **Primary** | original signature | BG na pillach/buttons (czarny tekst) |
| **Text-dark** | -13-15% lightness | TEKST + akcenty na dark backgrounds |
| **Text-cream** | -40% lightness | TEKST + akcenty na cream/light backgrounds |

## Sprawdzenie kontrastu

Przed zatwierdzeniem palety:
- Tekst-dark: ratio ≥ 4.5:1 na #0F0F0E (AAA aim 7:1)
- Tekst-cream: ratio ≥ 4.5:1 na #FAF7F2 (AAA aim 7:1)
- BG na czarnym tekście: ratio ≥ 7:1

Tools: webaim.org/resources/contrastchecker

## Last updated
2026-05-07 — Fair Rentals v1.15 (po feedbacku "na ciemnym za żarówiasty, na cream kontrast za słaby")
