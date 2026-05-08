# SVG logos różnego aspect ratio — force `height` na obu, NIE `max-height`

## Sytuacja (Fair Rentals v1.13-v1.19)

System IdoBooking renderuje `.footer-contact-baner` z dwoma SVG: Visa + Mastercard. Każde SVG ma własny natural aspect ratio:

| Logo | viewBox | Natural size |
|---|---|---|
| **Visa** | `0 0 51.325 15.8` | 51×16 (height **16px**) |
| **Mastercard** | `0 0 143 25` | 143×25 (height **25px**) |

Mastercard jest **56% wyższy** + **2.8× szerszy** od Visa.

## Co próbowałem (5 iteracji)

| v | Próba | Bug |
|---|---|---|
| v1.13 | flex space-between + filter brightness 1.6 saturate 0.3 opacity 0.55 | Logos jedna pod drugą + bardzo blade |
| v1.16 | Pokaż Visa (cofnij hide first span) | Visa visible ale mała |
| v1.17 | flex-wrap row + ::before flex-basis 100% + height 28px | Visa 16, MC 25 — wciąż różne |
| v1.18 | span height 32 + svg max-height 32 width auto + object-fit | SVG natural sizes 16 i 25 — `max-height: 32` nie wymusza skalowania (max nie ścisły, tylko upper bound) |
| v1.19 | **svg height: 24px** (NIE max-height) + width auto | ✅ Visa scale up od 16 → 24 (width ~78), MC scale down od 25 → 24 (width ~137). Equal heights. |

## Lesson

**`max-height` nie wymusza scaling. Jeśli SVG natural height < max-height, SVG renderuje się na natural size.**

**`height: Xpx` (explicit) ALE z `width: auto` skaluje SVG do tej height, zachowując aspect ratio.**

## Pattern poprawny

```css
.footer-contact-baner > span {
  height: 36px !important;       /* container */
  min-width: 80px !important;    /* equal box widths */
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.footer-contact-baner > span svg,
.footer-contact-baner > span img {
  height: 24px !important;       /* FORCE skala — NIE max-height */
  min-height: 24px !important;
  max-height: 24px !important;   /* dodatkowe — pewność na wszystkich rendererach */
  width: auto !important;        /* aspect ratio zachowany */
  max-width: 110px !important;   /* upper bound */
  object-fit: contain !important;
}
```

## Generalizacja

Dla każdej grupy SVG/IMG które chcesz wyrównać visually:
1. **Container span** z fixed height i min-width (równe boxy)
2. **SVG/IMG** z explicit `height: Xpx` + `width: auto`
3. **NIE** używaj samej `max-height` (nie wymusza scaling jeśli natural < max)
4. **Diagnostyka playwright** zawsze: pobierz `getBoundingClientRect()` i `viewBox` dla każdego SVG by zobaczyć natural sizes przed CSS

## Date
2026-05-07 — Fair Rentals v1.19 po 4 iteracjach (v1.13/v1.17/v1.18) prób z max-height
