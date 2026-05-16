# Lesson — CSS `:not(.show)` specificity bije `@media (max-width)` z mniejszą specificity

**Data**: 2026-05-16
**Projekt**: Fair Rentals v1.48b (/offers mobile filtry display:none)
**Severity**: 🟡 IMPORTANT — silent breakage z cascade

## Symptom

Klient: *"na /offers nie da się otworzyć filtrów"*

MCP audit mobile 375×667:
```js
document.querySelectorAll('.filter_content').forEach(c => {
  console.log({
    class: c.className,                       // 'filter_content collapse'
    display: getComputedStyle(c).display,    // 'none' ❌ wszystkie ukryte
    width: c.offsetWidth                      // 0
  });
});
```

Mobile auto-expand z `@media (max-width: 991px)` NIE działa pomimo `!important`.

## Root cause — cascade specificity

Konflikt 2 reguł CSS:

**Reguła A** (§3235, BEZ @media):
```css
html body.page-offers .filter_content.collapse:not(.show) {
  display: none !important;
}
```
Specificity: `0, 4, 1` (4 klasy/pseudo, 1 tag)

**Reguła B** (§109b, W @media):
```css
@media (max-width: 991px) {
  html body.page-offers .filter_content.collapse {
    display: block !important;
  }
}
```
Specificity: `0, 3, 1` (3 klasy, 1 tag)

**Cascade winner**: REGUŁA A (większy specificity). `@media` NIE jest selektorem dla
specificity — to tylko warunek aktywacji. Gdy oba media match (max-width: 991px =
mobile również matchuje), winneruje wyższy specificity.

**Powód różnicy**: `:not(.show)` w regule A dodaje `+0,1,0` do specificity.

## Fix

3 opcje (kolejność od najlepszej):

### Opcja 1 — opakować Regułę A w `@media (min-width: 992px)`

```css
@media (min-width: 992px) {
  html body.page-offers .filter_content.collapse:not(.show) {
    display: none !important;
  }
}
```

Na mobile (max-width: 991px) Reguła A NIE jest aplikowana → Reguła B z @media wygrywa.

**Najczystsze rozwiązanie**: jednoznacznie rozdzielone desktop/mobile.

### Opcja 2 — match specificity Reguły B

```css
@media (max-width: 991px) {
  /* Dodaj :not(.foo) lub chain class */
  html body.page-offers .filter_content.collapse:not(.foo),
  html body.page-offers.page-offers .filter_content.collapse {
    display: block !important;
  }
}
```

Brzydsze. Wymaga "magic" selektora podnoszącego specificity.

### Opcja 3 — inline style z JS

```js
if (window.innerWidth < 992) {
  document.querySelectorAll('.filter_content').forEach(c => {
    c.classList.add('show');
    c.style.cssText = 'display: block !important; height: auto !important;';
  });
}
```

Inline style ma najwyższy specificity (0,1,0,0,0) — wygrywa nad każdym `!important` w CSS.

## Lesson

`!important` NIE jest "magic override". Sprawdza:
1. **Specificity** (klasy + pseudo + atrybuty + tag)
2. **Source order** (gdy specificity równe — wygrywa później zdefiniowane)
3. `!important` flag (gdy oba mają — wygrywa wyższy specificity)
4. `@media` to **warunek**, nie część specificity

Algorytm cascade specificity (CSS3):
```
(inline_style, ID_count, class_or_pseudo_count, tag_count)
```

`:not(X)` — sam pseudo NIE liczy się do specificity, ALE wnętrze X liczy się normalnie.
`:not(.show)` = `+0,1,0` (za `.show`).

## Quick check w DevTools

Hover na element → **Computed** → szukaj reguły z strikethrough. Strikethrough oznacza
że ją ZWYCIĘŻYŁA inna reguła. Sprawdź którą i czemu (zwykle wyższy specificity widoczny
po prawej).

## Related

- Instinct 020 (CSS specificity beats order)
- Instinct 042 (CSS specificity escalation)
- Instinct 058 (custom CSS specificity war)
- Lesson: `lessons/011-css-specificity-war-js-setproperty-important.md`
