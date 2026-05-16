# Piekary 13 — Engine CSS Design

**Date**: 2026-05-05
**Client**: piekary13 (IdoBooking client23326)
**Author**: Damian Cisowski
**Status**: Approved → implementation

## Problem

IdoBooking ma **dwa osobne pola CSS** w panelu: jedno dla strony głównej (`/customStyles/.../custom.css`), drugie dla silnika rezerwacji na subdomenie (`client23326.idobooking.com`). Obecnie strona Piekary 13 ma dopracowany custom CSS (burgundy + gold + Playfair), ale silnik rezerwacji wciąż używa systemowych domyślnych styli — wygląda jak generic IdoBooking widget zamiast brandowanej kontynuacji rezerwacji.

Klient prosi o:
1. Ukrycie logo w silniku (header + footer)
2. Powiązanie kolorystyki/układu silnika z dwiema markami: `apart-torun.pl` (stara WP, do zastąpienia) + `client23326.idobooking.com` (nowa Piekary 13)
3. Tylko CSS — bez JS

## Decyzja kierunkowa (zatwierdzona)

**Brand Piekary 13 jako kanon dla silnika** (opcja A z brainstormingu). Uzasadnienie:
- `apart-torun.pl` idzie do zastąpienia (vide brief.md)
- Brand Piekary 13 (burgundy `#722F37` + gold `#C4A882` + cream `#FAFAF5` + Playfair Display + DM Sans) jest gotowy, spójny i heritage-vibe
- Burgundy/gold to klasyka apartamentów heritage — bezpieczne na przyszłą rebrandowaną Apart Toruń
- Engine z brandingiem Piekary daje gościowi spójne UX: strona → klik „Rezerwuj" → silnik wygląda jak ten sam serwis

## Architektura pliku

`clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css` — ~290 linii, 11 sekcji:

| § | Sekcja | Cel |
|---|--------|-----|
| 0a | Google Fonts `@import` (Playfair + DM Sans) | dziedziczenie typografii Piekary |
| 0b | System scheme override `:root !important` (`--maincolor1`, `--supportcolor1`, `--bgcolor1-3`, `--hovercolor1-2`, `--btn_*`, `--widget_header`) | wyrównanie systemu default13 do brand Piekary (trap #15) |
| 0c | Design tokens `--pk-*` | spójność z `CSS_EDYTOR.css` |
| 1 | **Hide logo** (`.navbar-brand img`, `.footer-contact__logo img`) | główny wymóg taska |
| 2 | Base typography (body, h1-h4, p, a) | overall heritage feel |
| 3 | Header silnika (.menu-wrapper, .nav-link, language toggler) | spójny header bez logo |
| 4 | Buttons / CTA — burgundy bg, gold hover, radius 8px, min-height 48px | wszystkie przyciski jeden kolor (trap #23) |
| 5 | Form inputs — cream bg, burgundy focus | clean, spójne |
| 6 | Flatpickr calendar — burgundy selected, gold today | core element silnika |
| 7 | Offer cards — gold price badge, Playfair title | spójny z featured pattern |
| 8 | Footer-contact-baner ::before/::after override | trap #6 (bez tego niebieskie paski) |
| 9 | Mobile @ ≤680px | parytet z homepage |
| 10 | Defensive (Fontello hide, scrollbar) | trap #28 |

## Kluczowe decyzje techniczne

### Zaadresowane CLAUDE.md traps

| Trap | Sekcja | Obsługa |
|------|--------|---------|
| #6 footer ::before/::after | §8 | override obu pseudo + width 100vw zachowane |
| #14b heredoc escape | n/a | użycie Write tool, nie bash heredoc |
| #14c live verify | n/a | client po wklejeniu fetch + count rules |
| #15 default13 vars | §0b | override `!important` na ~14 zmiennych |
| #23 CTA single-color | §4 | wszystkie buttony burgundy, brak miksu |
| #28 Fontello unavailable | §10 | `display:none` + key replacements |
| #30 px nad rem | §2 | wszystko `px` lub `clamp(px)` |

### Świadomie pominięte (YAGNI)

- ❌ JS — user wymaga tylko CSS
- ❌ Layout restructure (grid/flex offerów) — silnik renderuje markup, my tylko style
- ❌ Modyfikacja homepage CSS — to inny scope
- ❌ Hardcoded zdjęcia/loga via background-image (poza fallback) — engine to UI, nie content

## Pliki do utworzenia / modyfikacji

1. **`clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css`** ← deliverable
2. **`clients/piekary13/DO_WKLEJENIA/INSTRUKCJA.txt`** ← dopisać sekcję „Silnik rezerwacji – CSS"
3. **`memory/clients_data/piekary13.json`** ← log akcji + `engine_css_version`
4. **`memory/instincts/035-engine-separate-css-file.md`** ← nowy instinct (engine ma osobne pole CSS, branduj równolegle, zawsze hide logo + footer-baner-pseudo)

## Weryfikacja po wklejeniu

```js
// chrome-devtools evaluate_script
const link = document.querySelector('link[href*="customStyles"][href*="custom"]');
const css = await fetch(link.href).then(r => r.text());
({
  size_KB: (css.length/1024).toFixed(1),         // <290
  has_marker: css.includes('ENGINE_CSS_v1'),     // true
  escaped_important: (css.match(/\\!important/g)||[]).length,  // 0
});
getComputedStyle(document.documentElement).getPropertyValue('--maincolor1');
// expected: " #722F37"
getComputedStyle(document.querySelector('.navbar-brand img')).display;
// expected: "none"
```

## Test plan

| Test | Jak | Expected |
|------|-----|----------|
| Logo ukryte (header) | inspect `.navbar-brand img` | `display: none` |
| Logo ukryte (footer) | inspect `.footer-contact__logo img` | `display: none` |
| Brand color | `getPropertyValue('--maincolor1')` | `#722F37` |
| Buttons jednolite | wszystkie `.btn` | bg `#722F37`, white text |
| Calendar selected | klik daty → check `.flatpickr-day.selected` | bg `#722F37` |
| Footer paski | inspect `.footer-contact-baner::before` | bg `#722F37`, width `100vw` |
| Mobile (@375px) | resize | buttons full-width, calendar 1col |
| No `\!important` w CSS | fetch + regex | 0 wystąpień |
| Rules count | `[...document.styleSheets].reduce(...)` | < 320 |

## Risks

- **Niskie**: silnik IdoBooking renderuje konsystentny markup — selektory są stabilne
- **Średnie**: niektóre wewnętrzne klasy IdoBooking mogą się zmienić przy update default13 → mitigacja: udokumentować w instinct, monitor przy update
- **Niskie**: klient może mieć pole „Logo silnika" w panelu wgrane osobno — CSS hide pokrywa oba (trap #30 logic — instinct 030)
