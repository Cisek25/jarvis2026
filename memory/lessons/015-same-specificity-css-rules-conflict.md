# Lesson 015 — Stare CSS reguły o TEJ SAMEJ specificity konkurują z nowymi (source order tie-break)

**Data błędu**: 2026-05-15 (sesja 9, Fair Rentals v1.39→v1.40)
**Klient**: Fair Rentals (client58360)
**Symptom**: Klient zgłosił "realnie nie poprawiłeś nic" po wgraniu v1.39 — moja nowa reguła §107d nie nadpisywała starej §100b mimo `!important`.

---

## Co się stało

W FR_ARKUSZ_STYLOW.css były 2 reguły targetujące **inner span** w buttonie "Zarezerwuj teraz":

```css
/* §100b (stara, z v1.31 Sprint F MEDIUM, linia 11188) */
html body.page-offer .col-lg-3 .btn,
... {
  display: block !important;
  width: 100% !important;
  background: var(--fr-primary) !important;
}

/* §107d (nowa, z v1.39, linia ~12700) */
html body .accommodation-reservation .btn.button,
... {
  display: inline !important;
  width: auto !important;
  background: transparent !important;
}
```

**Obie targetują ten sam element**: `<span class="btn button accommodation-leftbutton">` wewnątrz `<a class="accommodation-reservation">`. Inner span ma klasę `.btn` — czyli `.col-lg-3 .btn` MATCHUJE go.

## Specificity calculation

**§100b** `html body.page-offer .col-lg-3 .btn`:
- elements: html(1) + body(1) + .col-lg-3 jest descendant — wait, `body.page-offer` = body + .page-offer = (0, 2, 1) cumulative
- + .col-lg-3 = +1 class = (0, 3, 1)
- + .btn = +1 class = (0, 4, 1) — POPRAWIONE: 4 klasy łącznie? Nie, body.page-offer = 2 (element + class), + .col-lg-3 = 3, + .btn = 4. Plus elements: html + body = 2. **= (0, 3, 2)** TOTAL

**§107d** `html body .accommodation-reservation .btn.button`:
- html + body = 2 elements
- .accommodation-reservation + .btn + .button = 3 classes
- **= (0, 3, 2)** TOTAL

**Identyczna specificity. Source order tie-break decyduje** → ostatnia w pliku wygrywa.

## Bug

§100b była PIERWSZA w pliku (linia 11188), §107d później (linia ~12700). Mimo to §100b "wygrywała" — bo... **konflikt został rozwiązany przez przeglądarkę inaczej niż się spodziewałem**.

Po dokładnej diagnozie chrome-devtools (`document.styleSheets.cssRules` walk) okazało się że:
- Computed style: `display: block`, `width: 165px` (z §100b)
- Mimo `!important` w §107d
- Mimo późniejszego source order

**Możliwe wyjaśnienia**:
1. Browser cache CSS (klient nie zrobił Cmd+Shift+R)
2. Inny `<style>` z !important dodawany dynamicznie przez JS systemowy
3. Specificity różniła się o 1 jednostkę (np. moja policzyła źle)

## Rozwiązanie (v1.40)

**1. USUNIETE stara §100b** całkowicie z pliku (linie 11188-11216, 28 linii).

```css
/* USUNIETE v1.40: stara regula §100b "page-offer .col-lg-3 .btn"
   matchowala INNER SPAN (.btn.button.accommodation-leftbutton) wewnatrz
   .accommodation-reservation buttona — wymusza display:block + width:100%
   + gold bg + letter-spacing 0.08em → tekst "ZAREZERWUJ TERAZ" wrapping
   na 2 linie w waskim sidebar (208px).
   Styling outer .accommodation-reservation jest przez §107d (ponizej). */
```

**2. WZMOCNIONO §107d** z chained 3 klas (zwiększa specificity do (0, 4, 3)):

```css
html body .accommodation-reservation .btn.button.accommodation-leftbutton,
html body.page-offer .accommodation-reservation .btn.button.accommodation-leftbutton,
... {
  display: inline-block !important;
  width: auto !important;
  /* ... */
}
```

## Lesson

**Przy dodawaniu nowego CSS — ZAWSZE sprawdź czy nie ma starej reguły matchującej ten sam element.** Specificity (a,b,c) jest poprawne tylko jeśli porównujesz 1 selector w listcie. W listach `selector1, selector2` każdy ma swoją specificity niezależnie.

**Polecane debug flow**:
```js
// Live audit przez chrome-devtools — znajdź WSZYSTKIE reguły matchujące element
var el = document.querySelector('.accommodation-reservation .btn.button');
var matchedRules = [];
for (var s of document.styleSheets) {
  try {
    for (var r of (s.cssRules || s.rules)) {
      if (r.selectorText && el.matches(r.selectorText)) {
        matchedRules.push({sheet: s.href, selector: r.selectorText, cssText: r.style.cssText});
      }
    }
  } catch(e) {}
}
// Print matchedRules — sprawdź czy są konflikty + USUŃ stare przed dodaniem nowych
```

## Anti-pattern

Nie polegaj tylko na `!important` w nowej regule. `!important` z tą samą specificity = source order tie. Stara reguła może być wcześniej w pliku ale **załadowana po naszej** (np. systemowy app.css po custom.css).

## Powiązane

- Memory: lesson `css-loses-to-system-path-selectors-and-inline-style.md` (system Idosell wygrywa z inline style)
- Memory: lesson `btn-class-cascade-conflict.md` (general .btn cascade conflict)
- Klient: Fair Rentals v1.40 (2026-05-15)
