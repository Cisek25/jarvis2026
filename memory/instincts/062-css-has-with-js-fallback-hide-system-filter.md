# Instinct 062 — CSS :has() + JS fallback dla "hide system element by child ID"

**Discovered**: 2026-05-16 (Fair Rentals v1.48b — ukrycie "Typ obiektu" filter)
**Severity**: 🟢 PATTERN (low priority, useful technique)

## Use case

Klient prosi: "ukryj systemowy element X" (np. konkretny filter, button, sekcję).
System IdoBooking nie ma pola w panelu by to wyłączyć. Musimy zrobić to po stronie
CSS/JS.

Element ma **stable ID** (np. `#filter_header_objectTypes`), ale jego rodzic (który
trzeba ukryć, np. `.filter_items`) **nie ma stable identyfikatora**.

## Rozwiązanie — 2 warstwy

### Warstwa 1: CSS `:has()` (preferowane)

```css
html body.page-offers .filter_items:has(#filter_header_objectTypes) {
  display: none !important;
}
```

Wspierane:
- Chrome 105+ (sierpień 2022)
- Safari 15.4+ (marzec 2022)
- Firefox 121+ (grudzień 2023)
- Edge 105+ (sierpień 2022)

→ wszystkie aktualne przeglądarki ostatnich 2-3 lat ✅

### Warstwa 2: JS fallback (dla starszych)

```js
function hideObjectTypeFilter() {
  if (!document.body.classList.contains('page-offers')) return;
  var header = document.getElementById('filter_header_objectTypes');
  if (header && header.parentElement) {
    header.parentElement.style.display = 'none';
  }
}
```

Wywołać w `boot()` lub na początku function która init'uje filtry.

## Inne use cases dla `:has()`

```css
/* Ukryj kartę bez ceny */
.product-card:has(.price-empty) { display: none; }

/* Style row jeśli zawiera checkbox */
tr:has(input[type="checkbox"]:checked) { background: yellow; }

/* Hide section gdy ma 0 children */
section:has(:empty) { display: none; }

/* Style label jeśli powiązany input jest disabled */
label:has(+ input:disabled) { opacity: 0.5; }
```

## Anti-pattern

❌ NIE używaj `:has()` dla "select parent of N" jeśli możesz mieć inline style:
```css
/* BAD: drogie obliczenie cascade */
* { transition: all 0.3s; }
*:has(.error) { color: red; }

/* GOOD: jawny selector */
.form-row.has-error { color: red; }
```

`:has()` ma performance cost (browser musi sprawdzić poddrzewo). Używaj
oszczędnie, dla 1-2 reguł, nie globalnie.

## Related

- Instinct 045 (MASTER idobooking system widget hide/replace)
- Instinct 020 (CSS specificity beats order)
