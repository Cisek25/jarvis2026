---
name: "Element invisible" debug checklist — 4 możliwe przyczyny + parent/child propagation
description: Element wydaje się invisible — sprawdź WSZYSTKIE 4 właściwości (visibility, opacity, display, parent chain). Nie tylko jedną. Inaczej będzie 5 prób żeby trafić w root cause (Fair Rentals v1.58→v1.62).
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

User zgłasza "element invisible" / "nie widzę". Łatwo zgadnąć jedną przyczynę i fix `visibility: visible !important` — ale jeśli to BYŁ inny mechanizm (np. `display: none` na DZIECKU), naprawiamy zły element i bug zostaje.

Fair Rentals v1.58→v1.62: 5 prób żeby naprawić bug "po menu close flagi znikają". Wszystkie 5 próbowały naprawić `wrap.visibility` — ale wrap był `visibility: visible` cały czas. Bug był w **dziecku** `#language_menu` które miało `display: none` (ustawione przez outside-click handler).

# Checklist debugowania "element invisible"

W devtools (F12 → Inspect element):

## 1. Computed tab — sprawdź WSZYSTKIE 4:

- `display` → jeśli `none` → element NIE renderuje (nie zajmuje miejsca)
- `visibility` → jeśli `hidden` → element renderuje ale niewidoczny (zajmuje miejsce)
- `opacity` → jeśli `0` → przezroczysty (zajmuje miejsce)
- `width/height` → jeśli `0` → element ma 0 rozmiar (collapsed)

## 2. getBoundingClientRect()

```js
const r = element.getBoundingClientRect();
console.log({ w: r.width, h: r.height, top: r.top, left: r.left });
```

Jeśli `width === 0` lub `height === 0` — element jest "obecny" ale visualnie zniknął. Może być spowodowane:
- Parent ma height 0
- Element ma `font-size: 0` z `display: inline-flex` (no children)
- Flex parent z `flex: 0 0 0`

## 3. Parent chain (krytyczne!)

```js
let el = element;
const chain = [];
for (let i = 0; i < 6 && el; i++) {
  const cs = getComputedStyle(el);
  chain.push({
    depth: i,
    tag: el.tagName,
    cls: el.className,
    display: cs.display,
    visibility: cs.visibility,
    h: el.offsetHeight,
    w: el.offsetWidth
  });
  el = el.parentElement;
}
console.table(chain);
```

Jeśli ANY parent ma `display: none` → cała subtree ukryta. Position:absolute na dziecku NIE pomaga.

## 4. Children chain (też krytyczne)

Jeśli element ma rozmiar 8x8 (only padding), sprawdź czy children mają rozmiar 0:

```js
const children = Array.from(element.querySelectorAll('*')).map(c => ({
  tag: c.tagName, cls: c.className, w: c.offsetWidth, h: c.offsetHeight,
  display: getComputedStyle(c).display
}));
```

Bug FR v1.58→v1.62: wrap był 8x8 (padding) — ale `#language_menu` dziecko miało `display: none` ustawione przez orphan click handler. Children width = 0.

# Pułapki

## removeProperty NIE wystarczy

```js
// WRONG — jeśli CSS rule ma visibility:hidden !important, removeProperty nie wystarczy
element.style.removeProperty('visibility');

// RIGHT — force explicit
element.style.setProperty('visibility', 'visible', 'important');
```

Inline `!important` ALWAYS wins over CSS rule `!important` (per CSS spec).

## Sprawdź WSZYSTKO zanim deklarujesz fix

Jeśli `wrap.visibility === 'visible'` ale element niewidoczny — bug jest w:
- jakiś PARENT z display:none / visibility:hidden / opacity:0
- jakieś DZIECKO z display:none / 0 size
- self ma rozmiar 0 (no content, no padding, flex shrunk)

Nie napraw 1 właściwości i zakładaj "fixed". Re-verify z `getBoundingClientRect()` że actual visible.

# Disciplined fix approach

```js
function makeVisible(element) {
  // Self
  element.style.setProperty('display', 'flex', 'important');     // or whatever non-none
  element.style.setProperty('visibility', 'visible', 'important');
  element.style.setProperty('opacity', '1', 'important');
  element.style.setProperty('pointer-events', 'auto', 'important');

  // Cleanup parent chain if needed
  // (don't blindly — check each parent first)

  // Verify after
  const r = element.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) {
    console.warn('Still 0 size — check children/flex layout');
  }
}
```

# Reference

Fair Rentals v1.58→v1.62 — 5 prób żeby trafić root cause bugu menu cycle. Final fix v1.62: skip dropdown handlers na mobile + force `#language_menu display: flex` on close. Lesson: I wasted 4 versions trying to fix `wrap.visibility` when the bug was `#language_menu.display`.
