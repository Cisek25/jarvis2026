# Lesson — JS click toggle "nie działa" przez double-bind z setTimeout retry

**Data**: 2026-05-16
**Projekt**: Fair Rentals v1.48b (/offers filter_header click desktop)
**Severity**: 🟡 IMPORTANT — silent UX break

## Symptom

Klient: *"na /offers nie da się otworzyć filtrów"*

MCP desktop 1200px:
```js
const h = document.querySelector('.filter_header');  // 'Typ obiektu'
console.log({
  cursor: getComputedStyle(h).cursor,            // 'pointer' ✅
  ariaExpanded: h.getAttribute('aria-expanded')  // 'false' (set przez nasz JS)
});

// Click test
h.click();
await new Promise(r => setTimeout(r, 300));

console.log({
  ariaExpanded: h.getAttribute('aria-expanded'),  // 'false' nadal ❌ (powinno 'true')
  contentClass: h.nextElementSibling.className,   // 'filter_content collapse' (brak '.show')
  contentDisplay: getComputedStyle(h.nextElementSibling).display  // 'none' nadal ❌
});
```

Filter się NIE rozwija po kliknięciu. `cursor:pointer` jest, `aria-expanded` ustawiony,
ale toggle `.show` nie działa.

## Root cause — duplicate event listeners

`initFilterCollapse()` wywoływany 2 razy w `boot()`:

```js
function boot() {
  // ...
  initFilterCollapse();              // 1st call
  // ...
  setTimeout(initFilterCollapse, 800);  // 2nd call (defensive retry)
}
```

`initFilterCollapse()` (PRZED fix) dodawał click handler **bez guard**:
```js
function initFilterCollapse() {
  document.querySelectorAll('.filter_header').forEach(function(header) {
    var content = header.nextElementSibling;
    header.addEventListener('click', function(e) {
      e.preventDefault();
      var isOpen = content.classList.toggle('show');
      header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}
```

Po 2 wywołaniach: **2 handlery na każdy header**. 

User klika 1×:
1. Handler #1: `.show` toggle: brak → dodany. aria-expanded: false → true.
2. Handler #2 (na tym samym click event): `.show` toggle: dodany → brak. aria-expanded: true → false.

**Net effect**: NIC się nie zmieniło. User widzi: kliknięcie bez efektu.

## Fix — dataset guard

```js
function initFilterCollapse() {
  document.querySelectorAll('.filter_header').forEach(function(header) {
    var content = header.nextElementSibling;
    if (!content || !content.classList.contains('filter_content')) return;

    // ✅ Guard: skip jeśli już zbindowany przy poprzednim wywołaniu
    if (header.dataset.frCollapseBound === '1') return;
    header.dataset.frCollapseBound = '1';

    header.style.cursor = 'pointer';
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('click', function(e) {
      e.preventDefault();
      var isOpen = content.classList.toggle('show');
      header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}
```

## Debug recipe

Gdy "click nie działa" pomimo `cursor: pointer` i set attribute:

1. Sprawdź czy click handler się odpala:
   ```js
   document.querySelector('.filter_header').addEventListener('click', () => console.log('clicked'));
   document.querySelector('.filter_header').click();  // sprawdź czy odpala
   ```

2. Sprawdź ile handlerów: w **DevTools → Elements → Event Listeners panel** (dolna)
   → kliknij element → lista wszystkich event listeners. Jeśli widać `click` 2× → bug.

3. Z console:
   ```js
   // Inspect event listeners (Chrome DevTools only)
   getEventListeners(document.querySelector('.filter_header'))
   // → {click: [{listener: f1, ...}, {listener: f2, ...}]}  ← 2 = bug
   ```

## Pattern — defensive retry without double bind

ZAWSZE używaj guard przy idempotent init pattern:

```js
function initWhatever() {
  document.querySelectorAll('SELECTOR').forEach(el => {
    if (el.dataset.frInitBound === '1') return;  // ← guard
    el.dataset.frInitBound = '1';
    el.addEventListener('event', handler);
  });
}

boot();
setTimeout(initWhatever, 800);   // safe: 2nd call no-op dla już zbindowanych
setTimeout(initWhatever, 2500);  // safe x3
```

## Anti-pattern

❌ NIE używaj `removeEventListener` bez storage referencji:
```js
header.removeEventListener('click', function() {...});  // ❌ NEW function ≠ original
```

Musisz zachować referencję:
```js
header._handler = function() {...};
header.removeEventListener('click', header._handler);
header.addEventListener('click', header._handler);
```

Lub po prostu — **użyj dataset guard** (proste, niezawodne).

## Related

- Instinct 063 (JS init guard against double bind on setTimeout retry)
- Instinct 003 (check live after paste — TDD audit)
- Instinct 041 (mcp-driven CSS audit TDD)
