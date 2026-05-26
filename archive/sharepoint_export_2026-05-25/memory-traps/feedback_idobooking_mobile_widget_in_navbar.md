---
name: IdoBooking widgets w #navbar — display:none ukrywa na mobile zamknięte menu
description: System wkłada widget jezykowy/wyszukiwarki do #navbar, który ma display:none gdy mobile menu zamknięte. Position:absolute nie pomaga. Fix przez JS DOM move.
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

System IdoBooking wkłada `.page-top__language` (i podobne widgety) WEWNĄTRZ `#navbar` element. Na mobile:
- Menu zamknięte → `#navbar { display: none }` → cała subtree ukryta (w tym widget)
- Menu otwarte → `#navbar { display: block }` → widget visible TYLKO w dropdownie menu

Klient często chce widget widoczny w nagłówku ZAWSZE (np. między logo a MENU button) — niezależnie od stanu menu.

CSS `position: absolute` NIE wystarczy — `display: none` na ancestor ukrywa CAŁĄ subtree, includes absolute-positioned children.

# Fix — JS DOM move

Przenieść widget Z `#navbar` (display:none parent) DO `header.menu-wrapper` lub bezpośrednio `header`:

```javascript
function placeLangSelector() {
  var wrap = document.querySelector('.page-top__language');
  var header = document.querySelector('header.default13');
  if (!wrap || !header) return;
  var isMobile = window.innerWidth <= 991;

  if (isMobile) {
    // Mobile — move OUT of #navbar
    var menuWrapper = header.querySelector('.menu-wrapper');
    var target = menuWrapper || header;
    if (target && wrap.parentElement !== target) {
      target.appendChild(wrap);
      wrap.dataset.frMobilePlacement = '1';
    }
  } else {
    // Desktop — RESTORE to original #navbar > .navbar-nav
    var navbarNav = document.querySelector('#navbar .navbar-nav');
    if (wrap.dataset.frMobilePlacement && navbarNav && wrap.parentElement !== navbarNav) {
      navbarNav.appendChild(wrap);
      delete wrap.dataset.frMobilePlacement;
    }
  }
}
```

# Kluczowe szczegóły

1. **Conditional na viewport** — desktop wrap zostaje w original #navbar (gdzie jest expected pozycja)
2. **Marker dataset** — `frMobilePlacement` flag aby wiedzieć kiedy restore na desktop
3. **NIE handle window.resize** — w praktyce user nie resize'uje w trakcie sesji, page reload działa za nas

# Pułapka

Run `placeLangSelector()` w `boot()` + 5 retries (50/200/600/1500/3000 ms) bo system może dynamicznie modyfikować DOM. `dataset.frMobilePlacement` zapobiega duplikatom move.

# Reference: Fair Rentals v1.58/v1.59

Plik: `_source/FR_KONIEC_BODY_ZRODLO.html` w `forceShowLanguageToggler`. Klient chciał flagi inline w nagłówku na mobile.
