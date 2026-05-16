---
name: navbar-toggler-mobile-only
description: `.navbar-toggler` hamburger MUSI mieć default `display: none` z media query dla mobile. NIGDY nie używaj `display: inline-flex !important` bez media query — widać na desktop!
type: instinct
scope: all-clients
trigger: stylowanie mobile hamburger / user 'menu widać na desktop'
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "Znaczek menu mia być tylko na mobile jest też na glownej stronie..."
related: instinct 017 (fontello unavailable)
---

# Instynkt: navbar-toggler tylko na mobile

## Bug (AP v1.8 initial)
Próbowałem naprawić fontello icon w `.navbar-toggler` i napisałem:
```css
.navbar-toggler {
  display: inline-flex !important;
  /* ... other styles */
}
```

PROBLEM: `!important` bez media query nadpisuje domyślne zachowanie
Bootstrap/system który ukrywa toggler na desktop (`@media (min-width: 992px)
{ .navbar-toggler { display: none } }`). W efekcie hamburger widoczny
na **wszystkich rozdzielczościach** — śmiesznie wygląda na 1600px
obok pełnego menu poziomego.

## Reguła

### CSS — default HIDDEN, mobile VISIBLE

```css
/* Desktop default: HIDDEN */
.navbar-toggler {
  display: none !important;
}

/* Mobile (< 992px) — pokaż */
@media (max-width: 991.98px) {
  .navbar-toggler {
    display: inline-flex !important;
    /* hamburger styling */
  }
  .navbar-toggler::before {
    /* CSS-drawn hamburger bars */
  }
}
```

**Breakpoint**: 991.98px (Bootstrap LG) — standard dla
"desktop vs mobile". Można dostosować do 767.98 lub 768px dla
tighter.

### Nigdy nie

❌ `.navbar-toggler { display: inline-flex !important }` — bez media query
❌ `.navbar-toggler { display: block !important }` — j.w.
❌ Styling inside `.navbar-toggler` który działa na desktop (gdy nie
  widać, niepotrzebny)

### Always

✅ Default visibility = `display: none !important`
✅ Mobile breakpoint media query → `display: inline-flex/block !important`
✅ Wszystkie inne style (padding, colors, hamburger bars) też w mobile query

## Weryfikacja

### Desktop 1440px
```javascript
getComputedStyle(document.querySelector('.navbar-toggler')).display
// Expected: "none"
```

### Mobile 375px
```javascript
// Resize to 375
getComputedStyle(document.querySelector('.navbar-toggler')).display
// Expected: "inline-flex" (albo flex/block)
```

## Historia AP v1.7 → v1.8 → v1.8.1
- **v1.7**: brak styling navbar-toggler — default Bootstrap/system styling
- **v1.8**: dodany `display: inline-flex !important` bez media query →
  **bug: hamburger na desktop**
- **v1.8.1** (2026-04-21): default `display: none !important` + media
  query `@media (max-width: 991.98px)`

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS patch: `AP_CSS_EDYTOR.css` §16 (po fixie v1.8.1)
- User feedback: "Znaczek menu mia być tylko na mobile jest też na
  glownej stronie..."
- Related: instinct 017 (fontello hide)
