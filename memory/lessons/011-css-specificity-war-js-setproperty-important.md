# Lesson 011 — CSS specificity wars vs 3rd-party libs → JS setProperty('important')

**Data**: 2026-05-05
**Klient**: solidneapartamenty (v1.7.1 → v1.7.6, 6 iteracji)
**Severity**: HIGH — wielokrotne nieudane fixy, wkurzony klient

## Problem

Próbuję nadpisać style komponentu 3rd-party (Litepicker, ale dotyczy każdego: Slick, Fancybox,
Flatpickr, etc.). Mój CSS z `!important` i wysoką specyficznością mimo wszystko **nie wygrywa**.
Wizualne efekty kolejnych iteracji są minimalne lub żadne.

## Root cause

**CSS specificity hierarchy** (od najsłabszej do najsilniejszej):

| Poziom | Co | Przykład |
|---|---|---|
| 1 | Type selector | `div { ... }` |
| 2 | Class selector | `.litepicker { ... }` |
| 3 | ID selector | `#picker { ... }` |
| 4 | Inline `style="..."` | `<div style="height: 44px">` |
| 5 | External CSS z `!important` | `.litepicker .x { height: 44px !important }` |
| 6 | **Inline `style="...!important"`** | `<div style="height: 44px !important">` |

3rd-party libraries jak Litepicker często **runtime-injectują własny `<style>` tag z JS**
(zwykle z `!important` na krytycznych property). To poziom 5. Mój external CSS na poziomie 5
walczy z nimi przez **source order** — kto później w cascade wygrywa. To **niedeterministyczne**:

- W lokalnym dev: mój CSS po Litepicker JS → wygrywam
- W produkcji: cache, async loading, kolejność scripts → Litepicker po moim CSS → przegrywam
- Plus klasy generowane runtime (`.no-previous-month`, `.is-flipped`) mogą mieć osobne reguły
  o których nie wiem

## Reguła

**Gdy walczysz z 3rd-party CSS:**

1. **Najpierw spróbuj** zwykłe CSS z `!important` (poziom 5). Często wystarczy.

2. **Jeśli po 1-2 iteracjach nie działa** → **NIE rób kolejnych CSS fixów**. To zmarnowane iteracje.
   Przejdź na **JavaScript inline !important** (poziom 6):

```js
// To produkuje: <div style="height: 44px !important;">
// Wygrywa z absolutnie wszystkim w CSS hierarchy.
element.style.setProperty('height', '44px', 'important');

// NIE TO (poziom 4, przegrywa z external !important):
// element.style.height = '44px';
```

3. **Jeśli library re-renderuje DOM** (Litepicker, Slick, Owl Carousel) → dodaj **MutationObserver**
   żeby re-aplikować inline styles po każdym re-renderze:

```js
var observer = new MutationObserver(function(mutations) {
  // re-apply inline styles
  applyMyStyles();
});
observer.observe(componentRoot, { childList: true, subtree: true });
```

4. **Hookuj się na library events** (jeśli istnieją):
```js
litepickerInstance.on('render', applyMyStyles);
litepickerInstance.on('show', applyMyStyles);
```

5. **Multiple timeouts safety net**: 0ms / 30ms / 100ms / 300ms — łapie zarówno sync layout jak i
   async/lazy renders.

## Kompletny pattern (production-ready)

```js
var setImportant = function(el, prop, val) {
  if (el && el.style && typeof el.style.setProperty === 'function') {
    el.style.setProperty(prop, val, 'important');
  }
};

var applyStyles = function() {
  var elements = container.querySelectorAll('.target-element');
  elements.forEach(function(el) {
    setImportant(el, 'height', '44px');
    setImportant(el, 'min-height', '44px');
    setImportant(el, 'padding', '0');
  });
};

// Apply on init
applyStyles();

// Apply on every DOM change
var observer = new MutationObserver(function() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyStyles, 16);  // ~1 frame debounce
});
observer.observe(container, { childList: true, subtree: true });

// Apply on library events
if (libInstance && libInstance.on) {
  libInstance.on('render', applyStyles);
  libInstance.on('show', function() {
    [0, 30, 100, 300].forEach(function(delay) {
      setTimeout(applyStyles, delay);
    });
  });
}
```

## Antipattern — czego NIE robić

❌ **Iterować CSS bez końca** — jeśli 2 próby nie działają, kolejne 4 też nie zadziałają.
   To CSS specificity war. Trzeba zmienić strategię.

❌ **`element.style.x = val` bez setProperty** — to inline poziom 4. Przegrywa z external `!important` (poziom 5).

❌ **`!important` na każdym CSS rule jako default** — eskaluje wojnę specificity. Lepiej target precise + JS fallback.

❌ **Spędzanie 6 iteracji na CSS** — to red flag. Po 2 iteracjach zatrzymaj się i zmień strategię.

## Detekcja kiedy używać

Triggers do JS-based override:
- 3rd-party JS lib (Litepicker, Slick, Fancybox, Flatpickr, Litepicker, etc.)
- Library runtime-injectuje `<style>` tag (sprawdź `document.querySelectorAll('head style')`)
- 2+ CSS fixy nie zadziałały
- Library ma swoje classy/states dynamicznie (`.no-previous-month`, `.is-active`, etc.)
- Library ma `on('render', ...)` lub podobne events

## Powiązane

- Lesson 010: Litepicker position:fixed na fullpage.js
- Trap #34 (CLAUDE.md): IdoSell CMS wycina inline `<script>` z body_top — JS musi być w body_bottom
- Instinct 039: verify-paste-before-iterating (nigdy nie iteruj bez konfirmacji że plik wklejony)
