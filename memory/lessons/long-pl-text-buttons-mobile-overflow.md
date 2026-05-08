# Długi polski tekst w przyciskach = mobile horizontal overflow

## Sytuacja (Fair Rentals v1.26)

Mobile audit playwright 390×844 wykrył:
```
horizontal_overflow: true
doc_scrollWidth: 405 px
viewport_w: 390 px
overflowing element: .fr-btn--outline "ZOBACZ WSZYSTKIE 19 APARTAMENTÓW" w: 383 px
```

Cały dokument jest 15 px szerszy niż viewport — user dostaje horizontal scrollbar.

## Diagnoza

CTA button:
```html
<a href="/offers" class="fr-btn fr-btn--outline">Zobacz wszystkie 19 apartamentów</a>
```

CSS:
```css
.fr-btn {
  padding: 0 24px;
  font-size: 14px;
  white-space: nowrap;  /* default dla button-like */
}
```

Math:
- Tekst PL: "ZOBACZ WSZYSTKIE 19 APARTAMENTÓW" = ~31 znaków × 11px (uppercase letterspacing) = ~335px
- Padding: 24×2 = 48px
- Total: 335 + 48 = **383px** > viewport mobile 390 - margin 8×2 = 374

Polski tekst jest **30-40% dłuższy** niż angielski (`See all 19 apartments` = 22 znaki).

## Lekcja

**Polish text w buttonach na mobile zawsze sprawdzać overflow.** Patterns:
- "Sprawdź dostępność" (18 znaków)
- "Zobacz wszystkie 19 apartamentów" (31 znaków)
- "Skontaktuj się z nami" (20 znaków)
- "Sprawdź ofertę dla Właścicieli" (29 znaków)

Wszystkie powyżej ~22 znaków × 14px font-size + padding 48px **przekraczają mobile 390 viewport**.

## Fix — mobile button rules

```css
@media (max-width: 600px) {
  html body .fr-btn,
  html body .fr-btn--outline {
    max-width: calc(100% - 32px) !important;
    white-space: normal !important;       /* allow wrap */
    padding: 14px 18px !important;        /* z 0 24px */
    font-size: 12px !important;           /* z 14 */
    line-height: 1.3 !important;
    letter-spacing: 1.2px !important;     /* z 1.6 */
    text-align: center !important;
    word-break: break-word !important;
  }
}
```

**Kluczowe**:
1. `white-space: normal` — pozwala wrap na 2 linie
2. `max-width: calc(100% - 32px)` — gwarantuje że nie przekroczy viewport (z 16px margin po obu stronach)
3. `word-break: break-word` — fallback gdy słowo za długie
4. Mniejszy font + padding = compact button

## Side effect

Button na mobile może być na 2 linie (jak "ZOBACZ WSZYSTKIE 19 / APARTAMENTÓW"). To **akceptowalne UX** — alternatywa to ucinanie text lub overflow.

## Audit checklist dla nowych klientów

**Przed delivery, sprawdzić każdy `.fr-btn` na mobile**:
1. `getBoundingClientRect().width` na viewport 390
2. Jeśli > 360 → fix CSS lub skróć tekst
3. Skróć tekst tylko jeśli możliwe bez utraty znaczenia (np. "Zobacz wszystkie" zamiast "Zobacz wszystkie 19 apartamentów")
4. Jeśli nie da się skrócić → mobile rule allow wrap

## Powiązane

- instinct 049 mobile TDD audit playwright pattern
- instinct 024 px-not-rem-when-system-root-10px

## Date
2026-05-08 — Fair Rentals v1.26 mobile button overflow fix
