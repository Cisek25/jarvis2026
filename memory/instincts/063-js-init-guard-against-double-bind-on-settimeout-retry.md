# Instinct 063 — JS init guard: dataset flag przeciwko double bind na setTimeout retry

**Discovered**: 2026-05-16 (Fair Rentals v1.48b — /offers filter click toggle nie działał)
**Severity**: 🟡 IMPORTANT — defensive retry pattern bez guardu = silent break

## Problem

Defensive pattern (init function wywoływana 2× przez `boot()` + `setTimeout 800ms` retry)
jest sensowny — niektóre systemowe widgety renderują się asynchronicznie i pierwszy
init może chybić. ALE bez guardu **każde wywołanie dodaje NOWY event listener**.

Skutek:
- 1. wywołanie: 1 click handler
- 2. wywołanie: 2 click handlery
- User klika 1× → odpalają OBA handlery → toggle + toggle = back to start
- User widzi "nic się nie dzieje"

Przykład antypatternu:
```js
function initFilterCollapse() {
  document.querySelectorAll('.filter_header').forEach(function(header) {
    header.addEventListener('click', function() {  // ❌ dodawane przy KAŻDYM init
      header.nextElementSibling.classList.toggle('show');
    });
  });
}
// W boot:
boot();
setTimeout(initFilterCollapse, 800);  // ❌ 2× addEventListener
```

## Rozwiązanie — dataset flag

```js
function initFilterCollapse() {
  document.querySelectorAll('.filter_header').forEach(function(header) {
    // ✅ Guard: skip jeśli już zbindowany
    if (header.dataset.frCollapseBound === '1') return;
    header.dataset.frCollapseBound = '1';

    header.addEventListener('click', function() {
      header.nextElementSibling.classList.toggle('show');
    });
  });
}
```

Bonus: można sprawdzić w DevTools jakie elementy są zbindowane:
```js
document.querySelectorAll('[data-fr-collapse-bound="1"]')
```

## Alternative — removeEventListener przed re-add

```js
function initFilterCollapse() {
  document.querySelectorAll('.filter_header').forEach(function(header) {
    var handler = function() { /* ... */ };
    header.removeEventListener('click', header._handler);  // remove previous
    header._handler = handler;
    header.addEventListener('click', handler);
  });
}
```

Mniej preferowane — wymaga storage referencji do funkcji. Dataset flag = prostsze.

## Inne dataset flagi w JARVIS

Konwencja: `data-fr-*` (prefix `fr-` jak custom CSS — uniknij kolizji):

- `data-fr-blog-bound="1"` — initBlog scraper zainicjalizowany
- `data-fr-leaflet-init="1"` — Leaflet map zainicjalizowany (chronimy)
- `data-fr-collapse-bound="1"` — filter_header click handler
- `data-fr-tel-cleaned="1"` — tel: link już sanitized

## Pattern Recipe

```js
function initWhatever() {
  document.querySelectorAll('SELECTOR').forEach(function(el) {
    if (el.dataset.frWhateverBound === '1') return;  // 1. guard
    el.dataset.frWhateverBound = '1';                 // 2. set flag

    // 3. side effects (addEventListener, classList.add, style.* etc.)
    el.addEventListener('click', handler);
  });
}
```

## Related

- Instinct 003 (check live after paste — TDD audit)
- Instinct 041 (mcp-driven CSS audit TDD)
- Lesson: `lessons/js-double-bind-on-settimeout-retry.md`
