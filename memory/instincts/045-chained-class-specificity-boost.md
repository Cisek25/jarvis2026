---
name: chained-class-specificity-boost
description: Gdy potrzebujesz pobić specificity rule z `.foo.bar` lub `:not()` chain bez dodawania nowych klas/elementów — powtórz tę samą klasę 2-4 razy w łańcuchu (`.foo.foo`, `.foo.foo.foo`). Każde powtórzenie liczy się jako osobna klasa w specificity, więc `.x.x.x` ma specificity (0,3,0).
type: instinct
scope: all-clients
trigger: system CSS rule z `:not()` chain ma wyższą specificity niż twoja / `.menuOverflow.nav-item` blokuje override / dodatkowe klasy w grupowym selektorze nadal beat twój patch
added: 2026-05-15
source_client: fairrentals — sesja 14-15 v1.32 (3 przypadki: menu nav-link 14px override, .footer__contact align-items, .powered_by visibility)
related: instinct 042 (specificity escalation drabina), 020 (specificity > order), lesson css-loses-to-system-path-selectors
---

# Instynkt: Chained-class specificity boost

## Kontekst

Czasem **nie można** dodać `body`, `html body`, ani nawet kolejnego ancestora klasy do selektora — bo:
- HTML element nie ma więcej parents z klasami (np. `<a class="nav-link">` w `<li class="nav-item">` w `<ul class="navbar-nav">` — to już wszystkie klasy dostępne)
- Pop wzbroniony bo `body header` już jest w selektorze
- System CSS używa `:not()` chains które dodają 4-7 specificity bez dodawania selectora

W takich przypadkach: **powtórz tę samą klasę kilka razy** w selektorze. Każde powtórzenie liczy się jako osobny komponent specificity (mimo że matchuje TEN SAM element).

## Reguła specyficzności

```
.x        = (0, 1, 0)
.x.x      = (0, 2, 0)  ← powtórzenie tej samej klasy
.x.x.x    = (0, 3, 0)
.x.x.x.x  = (0, 4, 0)
```

Mimo że `.x.x` matchuje TEN SAM element co `.x`, browser liczy każde wystąpienie klasy w selektorze osobno. To dokumentowane zachowanie w CSS Selectors spec.

## Konkretne przypadki z fairrentals v1.32

### Przypadek 1 — Menu nav-link kompaktowy (§103b)

System custom.css (poprzednia warstwa):
```css
/* Specificity (0, 7, 4) — przez 4× :not() chains */
html body header.default13 .navbar a[href]:not(.logo):not(.navbar-brand):not([class*="btn"]):not(.language__toggler) {
  font-size: 14px !important;
  padding: 12px 14px !important;
}
```

Moja pierwsza próba — NIE działała:
```css
@media (min-width: 992px) {
  html body header.default13 .navbar-nav .nav-link {  /* (0, 4, 3) — za nisko */
    font-size: 13px !important;
  }
}
```

Fix — copy EXACT selector z custom.css (cascade order rozstrzyga):
```css
@media (min-width: 992px) {
  html body header.default13 .nav-link.nav-link,
  html body header.default13 .navbar a[href]:not(.logo):not(.navbar-brand):not([class*="btn"]):not(.language__toggler) {
    font-size: 13px !important;
  }
}
```

### Przypadek 2 — Footer contact align center (§104b)

System rule:
```css
.footer__contact { align-items: start; }  /* niewidoczne, ale wygrywało */
```

Moja pierwsza próba:
```css
html body footer .footer__contact { align-items: center !important; }  /* nie wygrało */
```

Fix — chained class:
```css
html body footer .footer__contact.footer__contact { align-items: center !important; }  /* +1 specificity */
html body footer .footer__contact.footer__contact li { align-self: center !important; }
```

### Przypadek 3 — Powered_by IdoBooking visibility (§104d)

System ma 3 rules z `display: none + width: 0 + height: 0 !important`:
```css
html body img.powered_by_logo { display: none; width: 0; height: 0; }
html body footer .footer__social { display: none; }  /* parent ukryty */
```

Mój fix:
```css
/* Parent — chained class boost */
html body footer .footer__social.footer__social {
  display: flex !important; visibility: visible !important;
}
/* Element — chained 2× */
html body footer .footer__social.footer__social .powered_by.powered_by {
  display: inline-flex !important; width: auto !important;
}
/* Img — chained 2× */
html body footer img.powered_by_logo.powered_by_logo {
  display: inline-block !important; width: auto !important; height: 20px !important;
}
```

## Drabina (rozszerzenie instinct 042)

```
LEVEL 1 — single class            .x                  (0, 1, 0)
LEVEL 2 — html body + class       html body .x        (0, 1, 2)
LEVEL 3 — chain dodatkowy class   .x.y                (0, 2, 0)
LEVEL 4 — chained same class      .x.x                (0, 2, 0) ← TU
LEVEL 5 — chained 3×              .x.x.x              (0, 3, 0)
LEVEL 6 — copy exact selector     match system rule + cascade order
LEVEL 7 — inline style attribute  element.style = ... (nuclear)
```

LEVEL 4-5 (chained-class boost) to ELEGANCKIE rozwiązanie gdy:
- HTML jest fixed (nie możesz dodać klas)
- Specificity system rule jest dużo wyższa (np. `:not()` chain)
- Pop kolejnymi ancestorami nie pomaga

## Workflow

```javascript
// 1. Sprawdź computed style + wszystkie matched rules
const el = document.querySelector('.your-target');
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (!rule.selectorText) continue;
      try {
        if (el.matches(rule.selectorText)) {
          console.log(rule.selectorText, '=>', rule.style.cssText);
        }
      } catch(e) {}
    }
  } catch(e) {}
}

// 2. Z wyniku — znajdź WYŻSZY selector niż twój
// 3. Dodaj chained class do twojego selektora żeby pobić
//    LEVEL 4: .footer__contact.footer__contact (boost +1)
//    LEVEL 5: .footer__contact.footer__contact.footer__contact (boost +2)
```

## Anti-pattern

```css
/* ❌ ZŁE — !important już jest, kolejny nie pomoże */
.x { color: red !important; }
/* ↑ Pierwsza próba */
.x { color: red !important; }  /* dodanie kolejnej tej samej reguły = nic */

/* ❌ ZŁE — long anioł wielu selectorów ale TYLKO 1 klasa */
html body header.default13 .navbar > ul > li > a.nav-link  (0, 2, 5)
/* (system rule z :not() ma (0, 7, 4) — twoja wciąż za nisko) */

/* ✅ DOBRE — chained class */
html body header.default13 .nav-link.nav-link  (0, 3, 3)
/* (matchuje ten sam element, ale specificity +1 z chained .nav-link) */
```

## Edge cases

- **`.x.y` ≠ `.x .y`**: chained class (`.x.y`) matchuje JEDEN element z OBOMA klasami. Descendant (`.x .y`) matchuje DZIECKO. Specificity równa (0,2,0 obie), ale selektory MATCHUJĄ INNE elementy.
- **Identycznie powtórzona klasa**: `.x.x` matchuje to samo co `.x`, ale specificity +1. Browser nie deduplikuje.
- **Reverse engineering specificity**: gdy widzisz `:not(.a):not(.b):not(.c)` w system CSS, każde `:not()` to +1 do specificity klasy. 4× `:not()` = +4 punkty.

## Referencje

- Source client: fairrentals v1.32, sesje 14-15 (3 przypadki dokumentowane)
- Spec: https://www.w3.org/TR/selectors-3/#specificity
- Related instincts: 020 (order vs specificity), 042 (escalation drabina)
- Related lessons: css-loses-to-system-path-selectors-and-inline-style
