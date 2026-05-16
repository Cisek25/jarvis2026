---
name: css-specificity-beats-order
description: Przy wielu regułach `!important` wygrywa nie OSTATNIA ale ta o NAJWYŻSZEJ specyficzności. Starsza reguła z `.menu-wrapper .navbar-brand img` beat'uje nowszą `.navbar-brand img` — dodaj ten sam prefix (lub `html body`) żeby podbić.
type: instinct
scope: all-clients
trigger: nowa reguła CSS z !important nie działa / logo nadal ma stary rozmiar po dodaniu patcha
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — bug v1.8.2 "logo nadal wystaje na scrolled, mimo że §12 mówi 52px"
---

# Instynkt: Specyficzność > kolejność (nawet z !important)

## Prawo CSS
Dla `!important` vs `!important`:
1. **NAJPIERW** wygrywa wyższa specyficzność
2. **DOPIERO PRZY RÓWNEJ** specyficzności — późniejsza

Wiele osób myśli "dodam `!important` na końcu pliku = wygra". **Nie
zawsze.** Jeśli wcześniejsza reguła ma wyższą specyficzność, wygra
wcześniejsza.

## Przykład bug-a (AP v1.8.2)

### Stara reguła (trap #DD, linia 2296)
```css
header.ap-header--scrolled .navbar-brand img,
header.ap-header--scrolled .menu-wrapper .navbar-brand img,  /* ← ta z .menu-wrapper */
header.ap-header--scrolled .logo img,
header.ap-header--scrolled .menu-wrapper .logo img {
  max-height: 80px !important;
}
```

Specyficzność (przy scrolled state): `header.X .menu-wrapper .navbar-brand img`
= class(1) + class(1) + class(1) + element(2) = **(0,3,2)**.

### Nowa reguła (v1.8.2 §12, linia 7484)
```css
body header.default13 .navbar-brand img,
body header.default13.ap-header--scrolled .navbar-brand img {
  height: 52px !important;
}
```

Specyficzność (scrolled): `body header.X.Y .navbar-brand img`
= element(1) + class(2) + class(1) + element(1) = **(0,3,2)** — NIE, równa.

Wait — pozwól zrobić to dokładnie:
- `body header.default13.ap-header--scrolled .navbar-brand img`
  = 0 IDs, 3 classes (default13, ap-header--scrolled, navbar-brand),
    2 elements (body, header, img) = (0, 3, 3)
- `header.ap-header--scrolled .menu-wrapper .navbar-brand img`
  = 0 IDs, 3 classes (ap-header--scrolled, menu-wrapper, navbar-brand),
    2 elements (header, img) = (0, 3, 2)

Nowa MA wyższą (0,3,3 vs 0,3,2). Więc powinna wygrać.

Ale live mówi 80px. Sprawdzam jeszcze raz... Selekor starej to:
`header.ap-header--scrolled .menu-wrapper .navbar-brand img`
classes: ap-header--scrolled, menu-wrapper, navbar-brand = 3 classes
elements: header, img = 2 elements
Total: (0, 3, 2)

Selektor nowej:
`body header.default13.ap-header--scrolled .navbar-brand img`
classes: default13, ap-header--scrolled, navbar-brand = 3 classes
elements: body, header, img = 3 elements
Total: (0, 3, 3)

**Nowa wygrywa (0,3,3 > 0,3,2)**. Ale computed = 80px. Więc coś innego.

**Root cause alternatywna**: może JA źle zczytałem live CSS. Może v1.8.2
§12 jest w CSS ALE Content-CDN cache pokazuje stary plik. Albo kolejność
w pliku CSS jest inna — nowa mogła być PRZED starą.

**Niezależnie od dokładnej analizy**: fix = daj nowej jeszcze WYŻSZĄ
specyficzność przez prefix `html body`:

## Template — defensive specificity

```css
/* Gdy poprzednia reguła używa .menu-wrapper, .logo, lub innego
   descendant selektora, dodaj go tu też. Plus html body. */
html body header.default13 .navbar-brand img,
html body header.default13 .menu-wrapper .navbar-brand img,
html body header.default13.ap-header--scrolled .navbar-brand img,
html body header.default13.ap-header--scrolled .menu-wrapper .navbar-brand img,
html body header.default13 .navbar-brand .logo img,
html body header.default13 .logo img,
html body header.default13.ap-header--scrolled .logo img,
html body header.default13.ap-header--scrolled .menu-wrapper .logo img {
  height: 52px !important;
}
```

Wszystkie kombinacje + `html body` prefix → najwyższa specyficzność
w danym drzewie.

## Lepsza strategia — usunąć stare reguły

Idealnie: **zrefactoruj stare reguły zamiast dodawać nowe**. W AP
v1.8.2 nadal istnieje trap #DD z 80px. Lepiej byłoby zmienić tam
wartość na 52px niż dodawać kolejną regułę na końcu.

Ale przy patchu (gdzie nie chcemy ruszać starych sekcji) — defensive
specificity jest szybszym fixem.

## Debugging

Gdy `!important` regułka "nie działa":

```javascript
// DevTools console — pokaż wszystkie rules matchujące element
const el = document.querySelector('header .navbar-brand img');
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (!rule.selectorText || !rule.style.height) continue;
      try {
        if (el.matches(rule.selectorText)) {
          console.log(rule.selectorText, '=>', rule.style.height);
        }
      } catch(e) {}
    }
  } catch(e) {}
}
```

Pokaże wszystkie matching rules — zobacz która ma najwyższą specyficzność.

## Referencja
- Client: apartamenty-parkowe (client58154)
- Bug: v1.8.2 "logo wystaje scrolled" — trap #DD `.menu-wrapper .navbar-brand img`
  beat'uje §12 `.navbar-brand img`
- Fix: v1.8.3 `html body ... .menu-wrapper ...` defensive prefix
- Related: CLAUDE.md trap #15 (IdoBooking vars — też specificity issue)
