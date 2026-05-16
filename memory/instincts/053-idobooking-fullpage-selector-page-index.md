# Instinct 053 — IdoBooking fullpage selector: body.page-index

**Pochodzenie:** piekary13, sesja 2026-05-08 v5.

## Problem

Na home page IdoBooking używa fullpage.js. Naturalna myśl: targetować przez `.fp-section` lub `body[class*="fp-viewing-"]`. **OBA SĄ ZAWODNE:**

- `.fp-section` — w piekary13 IdoBooking renderuje sekcje jako `.section` (BEZ prefiksu `fp-`). Selektor nie matchuje.
- `body[class*="fp-viewing-"]` — fullpage.js dodaje tę klasę dopiero PO inicie JS. W pierwszej fazie renderowania CSS body ma tylko `page-index` → race condition, fix nie aplikuje się od razu.

## Fix — JEDYNY pewny selektor home page

```css
body.page-index .pk-reveal,
body.page-index .pk-reveal-left,
body.page-index .pk-asym__img img {
  /* override */
}
```

`body.page-index` jest dodawane SYSTEMOWO przez IdoBooking dla podstrony głównej. Pojawia się od pierwszego pixela renderowania CSS, niezależnie od stanu fullpage JS.

## Defensywnie

Można dodać `.fp-section` i `body[class*="fp-viewing-"]` jako fallback, ale nie polegać:
```css
body.page-index X,
.fp-section X,
body[class*="fp-viewing-"] X { ... }
```

## Use case

- Wymuszanie `.pk-reveal*` widoczne (opacity:1) na home — fullpage.js zerwie IntersectionObserver
- `background-attachment: scroll` na parallax — fixed bg nie działa w transformowanym kontekście fullpage
- Wszelkie CSS overrides specyficzne dla home page

## Powiązane

- Instinct 052 (parallax-slider z-index)
- Lesson o fullpage-js-scroll
