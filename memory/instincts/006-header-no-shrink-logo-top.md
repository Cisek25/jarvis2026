---
name: header-no-shrink-logo-top
description: Header ma zostawać w stałym rozmiarze (nie zmniejszać się na scroll) + logo pozycjonowane na GÓRZE nagłówka, nie centrowane pionowo
type: instinct
scope: all-clients
trigger: new-client / header-audit / header-complaints
added: 2026-04-21
source_client: apartamenty-parkowe (client58154)
reference_site: https://client9933.idobooking.com/
---

# Instynkt: Header bez shrinku, logo na górze

## Co
Domyślnie JARVIS-owe klienty dostają "header shrink on scroll": JS dodaje
klasę `.{prefix}-header--scrolled`, CSS redukuje height 88→66px, logo
80→56px. To dawniej wyglądało "pro" ale **użytkownicy tego nie lubią** —
zauważają zmianę rozmiaru jako irytację, nie feature.

Dodatkowo domyślny `.navbar-brand` centruje logo pionowo w środku
menu-wrappera, przez co logo wydaje się "pływać w środku" zamiast
przysiadać na górze nagłówka.

## Reguła
**Przy budowie nowej strony DOMYŚLNIE:**
1. **Header zachowuje stały rozmiar** (np. 88px) niezależnie od scroll.
   Klasa `.{prefix}-header--scrolled` może być nadal aplikowana przez JS
   (dla zmiany tła transparent→white), ale CSS **nie zmienia wysokości
   ani rozmiaru logo**.
2. **Logo pozycjonowane na samej GÓRZE header-a** (`align-self: flex-start`
   + małe padding-top, np. `padding: 6px 14px 0`). NIE `align-items: center`
   na całej kolumnie logo.
3. **Logo ma pełny rozmiar zawsze** (np. `height: 80px` — nie szrinkuje).

## Dlaczego
1. **User apartamenty-parkowe (2026-04-21)**: "on ma byc przeźroczysty tylko,
   cos robisz z nagłówkiem, ze go zmniejszasz"
2. Shrink animuje się asynchronicznie z zawartością → effect "jumping"
3. Logo w centrum pionowym wydaje się tonąć w tle gdy header jest
   transparent — zmniejsza rozpoznawalność brandu
4. Referencja: `client9933.idobooking.com` logo y=5 (prawie na samej górze)

## Jak zastosować (template)
```css
/* Keep full height on both scrolled and unscrolled states */
body header.default13,
body header.default13.{prefix}-header--scrolled,
body header.default13 .menu-wrapper,
body header.default13.{prefix}-header--scrolled .menu-wrapper,
body header.default13 .menu-wrapper .container,
body header.default13.{prefix}-header--scrolled .menu-wrapper .container {
  height: 88px !important;
  min-height: 88px !important;
  max-height: 88px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Logo: TOP of header, not centered */
body header.default13 .navbar-brand,
body header.default13 .logo,
body header.default13.{prefix}-header--scrolled .navbar-brand,
body header.default13.{prefix}-header--scrolled .logo {
  align-self: flex-start !important;
  padding: 6px 14px 0 14px !important;
  margin: 0 !important;
  top: 0 !important;
}

/* Logo: same size always (no shrink) */
body header.default13 .navbar-brand img,
body header.default13.{prefix}-header--scrolled .navbar-brand img,
body header.default13.{prefix}-header--scrolled .menu-wrapper .navbar-brand img {
  height: 80px !important;
  max-height: 80px !important;
  width: auto !important;
  max-width: 280px !important;
  margin: 0 !important;
  display: block !important;
  transition: none !important;
}

/* Nav items: vertical center in 88px (logo top-aligned, nav middle-aligned) */
body header.default13 .menu-wrapper .navbar,
body header.default13.{prefix}-header--scrolled .menu-wrapper .navbar {
  min-height: 88px !important;
  height: 88px !important;
  padding: 0 !important;
  align-items: center !important;
  justify-content: space-between !important;
  transition: none !important;
}

/* Stay consistent: --{prefix}-current-header-h = 88 always (dla .tabs.--fixed top) */
html:root {
  --{prefix}-current-header-h: 88px !important;
}
```

## Kiedy NIE stosować tej reguły
- Gdy klient EXPLICIT prosi o shrink-on-scroll ("chcę żeby header zmniejszał
  się jak zacznę scrollować")
- Gdy design mockup wyraźnie pokazuje różne stany scrolled/unscrolled

Dla wszystkich innych przypadków — stosuj domyślnie ten instynkt.

## Kiedy zachować klasę .{prefix}-header--scrolled
Klasa może być nadal dodawana przez JS (w `KONIEC_BODY.html` — sekcja
"HEADER SHRINK ON SCROLL"), ponieważ często używa się jej do **zmiany tła**
(transparent→white dla czytelności menu po przescrollowaniu przez hero).
Jedyne co blokujemy to **zmiana rozmiarów** (height, logo size, padding).

## Referencja
- Client: apartamenty-parkowe (client58154)
- Referencyjna strona: https://client9933.idobooking.com/
- CSS patch: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css`
  sekcja "PATCH 2026-04-21"
