# Lesson — Stopka IdoBooking ma `transform` na rodzicu, łamie `position: fixed` widgetów

**Data:** 2026-05-08
**Klient:** GeoStay (grzybek)
**Kategoria:** CSS spec trap, fixed positioning broken by transformed ancestor

## Problem

Klient wkleił WhatsApp FAB (`<a class="gs-wa-fab">`) z CSS:
```css
.gs-wa-fab {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 9998 !important;
}
```

User report: **"jest w stopce, nie pływa wysoko"**. Widget renderował się w stopce strony (np. y=5987 px na długiej podstronie homepage), nie w prawym dolnym rogu okna.

Live diagnoza:
```javascript
const fab = document.querySelector('.gs-wa-fab');
const cs = window.getComputedStyle(fab);
const rect = fab.getBoundingClientRect();
// cs.position = 'fixed' ✓
// cs.bottom = '24px' ✓
// rect.top = 5987 (powinno być ~700)
// rect.bottom + 24 = przesunięty o tysiące px
// fab.parentElement.className = 'footer-contact-add' ❌
```

CSS jest poprawnie zastosowany. Problem: **rodzic ma `transform`** który zmienia containing block widgetu z viewport na siebie.

## Root cause (CSS spec)

[W3C CSS Transforms Level 1](https://www.w3.org/TR/css-transforms-1/#transform-rendering):

> For elements whose layout is governed by the CSS box model, **any value other than `none` for the `transform` property establishes a containing block for `position: fixed` descendants**.

Inne właściwości z tym samym efektem:
- `transform` (any value, including `translateZ(0)`, `translate(0, 0)`)
- `filter` (any value)
- `perspective` (any value other than `none`)
- `will-change: transform`, `will-change: filter`
- `backdrop-filter`

Jeśli **dowolny przodek** ma jedną z powyższych — `position: fixed` **przestaje być viewport-relative**, staje się relative do tego przodka (jak `position: absolute`).

## Diagnoza w IdoBooking default13

Stopka systemowa (`<div class="footer-contact-add">`, `<footer class="footer">`) renderuje się z efektem:
- `transform: translateZ(0)` (GPU acceleration)
- `will-change: transform` (animacje hover)
- `filter: drop-shadow(...)` (subtle shadow)

Klient wkleił widget WhatsApp w **globalną stopkę HTML** (Treści → Stopka), system osadził go wewnątrz `.footer-contact-add` → widget wpadł pod containing block stopki.

## Fix — JS teleport do `<body>` root

Inline `<script>` po widgecie który przenosi go z dowolnego rodzica do `<body>` bezpośrednio:

```html
<a class="gs-wa-fab" href="...">...</a>
<script>(function(){
  var f = document.querySelectorAll('.gs-wa-fab');
  if (!f.length) return;
  if (f[0].parentElement !== document.body) document.body.appendChild(f[0]);
  for (var i = 1; i < f.length; i++) f[i].remove();
})();</script>
```

Po teleportacji widget jest dzieckiem `<body>` (gdzie nie ma transformu na ancestor), `position: fixed` znów jest viewport-relative.

Live verify:
```javascript
// Po teleport
const rect = document.querySelector('.gs-wa-fab').getBoundingClientRect();
// rect.bottom = window.innerHeight - 24 ✓
// rect.right = window.innerWidth - 24 ✓
// parent = BODY ✓
```

## Pull dlaczego CSS-only fix nie istnieje

Próbowałem (nie działa):
- `position: sticky` — wymaga scroll context, nie ucieka z transformowanego rodzica
- `position: absolute` z `top: ...` calc(100vh - X) — nadal containing block to przodek z transform
- `inset: auto 24px 24px auto !important` — sama nie pomaga
- Wyższy z-index — nie wpływa na containing block, tylko stacking
- `contain: layout` na widgecie — wewnętrzny scope, nie wycofuje z transformu rodzica

**JS jest jedynym skutecznym fixem** — fizyczne przeniesienie elementu w DOM tree.

## Fix alternatywny (gorszy)

Jeśli klient nie pozwala JS (CSP restrictive, paranoja security):
- Wkleić widget wprost do `<body>` zaraz po `<header>` przez plik **template** strony (jeśli IdoBooking pozwala edytować template — rzadko)
- Albo dodać `transform: none !important` na **wszystkie potencjalne przodki** widgetu (kruche, łatwo złamać przy update systemu)

JS teleport to czyste, idempotentne rozwiązanie.

## Common mistakes

- ❌ Wkleić tylko HTML (bez JS teleport) myśląc że CSS `!important` wystarczy — nie wystarczy, jeśli ancestor ma `transform`
- ❌ Próbować naprawić przez wyższy z-index — bez zmiany containing block, nadal przyklejony do stopki
- ❌ Zakładać że `position: fixed` zawsze działa względem viewport — w 2026 roku zwykle TAK, ale `transform` na ancestor to znana pułapka

## Lekcja

**Każdy floating widget (FAB, modal, sticky CTA, cookie banner) wklejony w body przez CMS — DODAJ inline JS teleport do `<body>` root**. To 200 znaków JS, działa zawsze, idempotentne (uruchom ile chcesz razy).

```html
<script>(function(){var f=document.querySelectorAll(".SELECTOR");if(!f.length)return;if(f[0].parentElement!==document.body)document.body.appendChild(f[0]);for(var i=1;i<f.length;i++)f[i].remove();})();</script>
```

Selector zmienić na klasę widgetu. Reszta uniwersalna.

## Reference

- W3C transform spec: https://www.w3.org/TR/css-transforms-1/#transform-rendering
- Stack Overflow: https://stackoverflow.com/questions/15194313/transform3d-not-working-with-position-fixed-children
- Instinct 050 — pełna implementacja WhatsApp FAB z teleport JS
