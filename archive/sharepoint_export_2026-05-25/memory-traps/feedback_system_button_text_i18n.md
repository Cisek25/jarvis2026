---
name: System hardcoded button text — JS i18n per html[lang]
description: IdoBooking hardcoduje text "Menu" na .navbar-toggler nawet w EN/DE wersji strony. Fix: JS translateLabel funkcja per html.lang.
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

System IdoBooking renderuje navbar toggler z hardcoded polish text:

```html
<button class="navbar-toggler" type="button">
  <i class="icon icon-menu"></i>
  <span>Menu</span>  <!-- hardcoded PL na wszystkich językach -->
</button>
```

Na `/en/` i `/de/` user widzi nadal "MENU" (uppercase via CSS). Klient chce poprawnego tłumaczenia.

# Fix — JS translateLabel function

W body_bottom dodaj funkcję która tłumaczy per `html[lang]`:

```javascript
function translateMenuLabel() {
  var toggler = document.querySelector('.navbar-toggler');
  if (!toggler) return;
  var span = toggler.querySelector('span:not(.icon)') || toggler.querySelector('span');
  if (!span) return;
  var lang = (document.documentElement.lang || 'pl').toLowerCase().substring(0, 2);
  var labels = {
    pl: 'Menu',
    en: 'Menu',
    de: 'Menü'   // z umlautem
  };
  span.textContent = labels[lang] || labels.pl;
}

// Wywołanie w boot() + defensive timeouts
translateMenuLabel();
setTimeout(translateMenuLabel, 400);
setTimeout(translateMenuLabel, 1500);
```

CSS `text-transform: uppercase` z systemu renderuje:
- PL/EN: "MENU"
- DE: **"MENÜ"** (z umlautem)

# Defensive timeouts

System może lazy-load lub re-render toggler. Wywołaj `translateMenuLabel()` kilka razy:
- 0ms (immediate w boot)
- 400ms
- 1500ms

`textContent =` jest idempotentne — bezpieczne wielokrotne wywołanie.

# Pattern dla innych system labels

Można rozszerzyć na inne hardcoded teksty systemu:

```javascript
function translateSystemLabels() {
  var lang = (document.documentElement.lang || 'pl').toLowerCase().substring(0, 2);

  // MENU button
  var menuSpan = document.querySelector('.navbar-toggler span:not(.icon)');
  if (menuSpan) {
    var menuLabels = { pl: 'Menu', en: 'Menu', de: 'Menü' };
    menuSpan.textContent = menuLabels[lang] || menuLabels.pl;
  }

  // Inne system labels (przykład — search button, "Pokaż więcej", etc)
  // ...
}
```

# Reference: Fair Rentals v1.60

Plik: `_source/FR_KONIEC_BODY_ZRODLO.html` funkcja `translateMenuLabel()`. Klient zgłosił w PDF Uwagi_2 #5 (jako część mobile menu issues).
