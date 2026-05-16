# Lesson 016 — IdoBooking app.css ma `.litepicker { left:50%; top:50% }` (center pattern wymuszony)

**Data**: 2026-05-15 (sesja 11, Fair Rentals v1.42)
**Klient**: Fair Rentals (client58360)
**Symptom**: Klient zgłosił że Litepicker "wygląda przesunięty" + prawa krawędź ucinana w wąskich viewportach.

---

## Co się stało

Systemowy IdoBooking `app.css.gz` (`https://{klient}.idobooking.com/frontpage-template/template/default13/dist/app.css.gz`) zawiera:

```css
.litepicker {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

**To wymusza CENTER pattern** dla datepickera — pokazuje go w środku viewportu (mobile-friendly modal).

Litepicker JS native pozycjonuje datepicker przez **inline style** (`element.style.left = '...px'; element.style.top = '...px'`) — typowo pod inputem (anchor positioning).

**Problem**: Inline style WIN nad CSS bez `!important`. Ale systemowy `app.css` ma `!important` (lub effective specificity wygrywa). Computed style nadal pokazuje `left: 50%; top: 50%`.

## Symptom dla klienta

Na desktop (1280+ px) Litepicker pojawia się **w środku viewportu** (over hero photo) zamiast pod inputem. Na mniejszych viewport (1100-1280 px) szerokość 718px wystaje za prawą krawędź → klient widzi "uciętą prawą stronę".

## Rozwiązanie (v1.42 §107k)

NIE walcz z inline style JS Litepicker. **Wymuś własny modal pattern** z naszymi wartościami:

```css
@media (min-width: 992px) {
  html body .litepicker:not(.mobilefriendly):not(.--static) {
    /* Modal w górnej części viewportu (NIE środek) */
    top: 20% !important;
    left: 50% !important;
    transform: translateX(-50%) !important;  /* tylko X, NIE Y */
    
    /* Safety dla wąskich viewport */
    max-width: calc(100vw - 32px) !important;
    max-height: calc(100vh - 80px) !important;
    overflow-y: auto !important;
  }
}
```

**Dlaczego top: 20% a nie pod inputem?**
1. Pod inputem = anchor positioning wymaga JS Litepicker który przegrywa z systemowym CSS
2. Modal top: 20% = visually blisko inputów (powyżej fold) ale konsystentny pattern niezależnie od pozycji inputa na stronie
3. Mobile already centered (system zostaje)

**Plus `max-width: calc(100vw - 32px)`** chroni przed overflow — Litepicker NIE wystaje za viewport nawet na 768px.

## Anti-pattern do unikania

```css
/* NIE rób — left/top: auto zniwelowało WSZYSTKO i Litepicker zniknął */
html body .litepicker {
  left: auto !important;
  top: auto !important;
  transform: none !important;
}
```

`auto` wymusza static positioning (Litepicker wraca do document flow) — element ląduje gdzieś indziej (czasem zupełnie poza viewport) bo nie ma inline style.

## Sprawdzenie czy ten problem istnieje

```bash
# 1. Curl systemowy app.css
curl -s "https://{klient}.idobooking.com/frontpage-template/template/default13/dist/app.css.gz" | gunzip | grep -A 5 "\.litepicker {"

# 2. Live audit przez chrome-devtools po klik datepicker
evaluate_script: () => {
  var lp = document.querySelector('.litepicker');
  return {
    inlineStyle: lp.getAttribute('style'),       // z JS Litepicker
    computedLeft: getComputedStyle(lp).left,      // wartość finalna
    computedTransform: getComputedStyle(lp).transform
  };
}
# Jeśli computed left = "50%" a inline style = "626px" → trap potwierdzony
```

## Powiązane

- Memory: lesson `010-litepicker-position-fixed-fullpage.md` (Litepicker + fullpage.js)
- Memory: lesson `css-loses-to-system-path-selectors-and-inline-style.md`
- Klient: Fair Rentals v1.42 (2026-05-15)
- Plik: `clients/fairrentals/DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css` §107k
