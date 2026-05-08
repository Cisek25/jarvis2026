# 046 MASTER — IdoBooking dwa zagnieżdżone elementy z TĄ SAMĄ klasą — używaj `>` direct child

## Co odkryto
System IdoBooking renderuje struktury w których ten sam class name pojawia się jako parent **ORAZ** child:

```
<footer>
  <div class="footer container">         ← OUTER
    <div class="footer container">       ← INNER (TA SAMA klasa)
      <div class="footer__wrapper">
        <ul class="footer__contact">...</ul>
      </div>
    </div>
    <div class="footer-contact-baner">...</div>
  </div>
</footer>
```

Selektor `.footer.container` matchuje **OBA** levels.

## Skutek (Fair Rentals v1.12 bug)

CSS:
```css
html body footer .footer.container {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
}
```

Aplikuje grid 3-col do **outer** I **inner**. Pseudo `::before` (brand) i `::after` (tagline) na outer wpadają jako grid cells (nie block flow). Layout chaos: brand lewa col, inner środek col, tagline prawa col, copyright extra col, baner extra row.

## Reguła

**Gdy konfigurujesz layout (display, grid, flex) na klasie która może być zagnieżdżona w sobie — używaj `>` direct child kombinatorów żeby kontrolować specific level.**

## Pattern

### Złe (matchuje wszystkie levels)
```css
html body footer .footer.container { display: grid; ... }
```

### Dobre (tylko outer, direct child of footer)
```css
html body footer > .footer.container { display: block; ... }
html body footer > .footer.container > .footer.container { display: block; max-width: 1100px; }
```

### Lub: użyj :not() żeby wykluczyć inner
```css
html body footer .footer.container:not(.footer.container .footer.container) { /* tylko outer */ }
```

(Ale `>` direct child czytelniejsze)

## Inne klasy systemu IdoBooking podejrzane o double-nesting
Sprawdź playwright DOM tree przed dodaniem reguł na:
- `.footer.container` (verified — OUTER + INNER)
- `.row` (Bootstrap container — może być nested)
- `.col-12 .col` etc (Bootstrap columns — często nested)
- `.section.parallax` (raczej tylko jeden level, ale weryfikuj)

## Diagnostyka
```javascript
// Playwright/DevTools — sprawdź czy klasa pojawia się 2x w DOM tree
Array.from(document.querySelectorAll('.footer.container')).length
// Expected 1 ALE może być 2 jeśli double-nested
```

Jeśli >1 — używaj `>` direct child kombinatorów.

## Last updated
2026-05-07 — Fair Rentals v1.13 footer rebuild po diagnozie playwright (v1.12 grid layout chaos)
