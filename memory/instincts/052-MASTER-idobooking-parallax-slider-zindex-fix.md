# Instinct 052 — MASTER: IdoBooking parallax-slider z-index trap

**Pochodzenie:** piekary13, sesja 2026-05-08…2026-05-11. Diagnoza przez Chrome DevTools MCP.

## Problem

IdoBooking ustawia systemowo `.parallax-slider { z-index: -2 }` w hero homepage. To powoduje że obraz hero **NIE JEST WIDOCZNY** mimo że:
- bg image jest ustawiony (`backgroundImage: url(...)`)
- `<img>` jest załadowany (`naturalWidth > 0`, `complete: true`)
- Element ma poprawne wymiary

Przyczyna techniczna: `.section.parallax` ma `position: relative` ALE `z-index: auto` — to **nie tworzy containing stacking context**. Bez stacking context, ujemny z-index slidera (`-2`) ucieka w górę aż za tło body — slider rendered ZA body bg.

## Fix (obowiązkowy dla każdego nowego projektu IdoBooking z fullpage hero)

```css
.parallax-slider {
  z-index: 0 !important;
}
.section.parallax {
  z-index: 1 !important;
}
.parallax-slider .parallax-image,
.parallax-slider .parallax-image img,
.parallax-slider .parallax-image picture {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}
.parallax-slider .parallax-image img {
  object-fit: cover !important;
  opacity: 1 !important;
}
```

Po fix: hero image widoczne, hero overlay z `z-index: 10` nadal nad obrazem.

## Symptom z perspektywy klienta

"Nie widać zdjęcia w tle na stronie głównej" / "Hero jest pusty/szary" / "Powinno być automatycznie panelowe".

## Jak zdiagnozować

Chrome DevTools MCP `evaluate_script`:
```js
const slider = document.querySelector('.parallax-slider');
const cs = getComputedStyle(slider);
// Sprawdź: cs.zIndex, cs.backgroundImage, slider.getBoundingClientRect()
```

Jeśli `zIndex: "-2"` i obraz jest set → to ten trap.

## Powiązane

- Instinct 053 (body.page-index selector)
- Lesson o Chrome DevTools MCP diagnoza ukrytych obrazów
