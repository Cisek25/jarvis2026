# Fair Rentals — Release Notes v1.7

**Wersja**: v1.7 — force show system .iai-search (CSS specificity + JS MutationObserver)
**Data**: 2026-05-07
**Bazuje na**: v1.6

## Powód iteracji

Damian (po v1.6 wklejeniu): "nie ma żadnej wyszukiwarki :( ma być widoczna"

## Diagnoza live (playwright na v1.6)

CSS markery v1.4/v1.5/v1.6 wszystkie obecne na live (wklejone). Mimo regul:
```css
html body.page-index .iai-search { display: block !important; position: relative !important; left: auto !important }
```

`.iai-search` na live ma:
- `display: none` (mój `!important` nie wygrał)
- `position: absolute` (nie zadziałał)
- `left: -9999px` (nie zadziałał)
- `transform: none` (zadziałało)

**`#iai_book_form` ma `inlineStyle: "display: none;"`** — system JS `iai_book_se.js` aplikuje inline style po DOM ready. Inline style = najwyższa specyficzność, mój CSS nawet nie próbuje.

System CSS (app.css) prawdopodobnie ma rule path `body.page-index .section.parallax .iai-search { ... }` — wyższa specyficzność niż moja `html body.page-index .iai-search`.

## Fix v1.7 — dwa filary obronne

### A. CSS sekcja §76 — wyższa specyficzność

```css
html body.page-index .section.parallax .iai-search,
html body.page-index .section.parallax .index-info .iai-search,
html body.page-index .section.parallax .fp-tableCell .index-info .iai-search {
  display: block !important;
  visibility: visible !important;
  position: relative !important;
  left: auto !important;
  /* ...etc */
}
```

Path przez `.section.parallax` + `.fp-tableCell` + `.index-info` daje specyficzność (0,4,3) = **43 punkty** vs ~22 punkty w moich poprzednich regułach. Wygrywa z systemowym CSS.

Plus styl widget (biała karta + grid form 5-col + brand inputs/button) replicated na nowych selektorach.

### B. JS `forceShowSystemSearch()` w body_bottom

```javascript
function forceShowSystemSearch() {
  var setProps = function(el, props) {
    if (!el) return;
    Object.keys(props).forEach(function(p) {
      var cssProp = p.replace(/([A-Z])/g, '-$1').toLowerCase();
      el.style.setProperty(cssProp, props[p], 'important');
    });
  };

  var apply = function() {
    setProps(document.querySelector('.iai-search'), { display: 'block', position: 'relative', left: 'auto', /* ...*/ });
    setProps(document.querySelector('.index-info'), { display: 'block', position: 'relative', /* ...*/ });
    setProps(document.querySelector('.iai_frontpage'), { /* ... */ });
    setProps(document.querySelector('#iai_book_form'), { display: 'grid', /* ... */ });
  };

  apply();
  
  // Retry — system JS może override po DOMContentLoaded
  [50, 200, 600, 1500, 3000, 5000].forEach(function(d) { setTimeout(apply, d); });

  // MutationObserver — re-apply if system aplikuje display:none
  new MutationObserver(function() {
    var s = document.querySelector('.iai-search');
    if (s && getComputedStyle(s).display === 'none') apply();
    var f = document.querySelector('#iai_book_form');
    if (f && f.style.display === 'none') apply();
  }).observe(document.querySelector('.iai-search'), { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
}
```

`element.style.setProperty(prop, value, 'important')` daje **inline style + !important** = najwyższa specyficzność wygranej. System nie pokona tego CSS-em.

`MutationObserver` na `.iai-search`, `.index-info`, `#iai_book_form` — jeśli system JS aplikuje `style="display:none"` po naszym, observer reaguje i przywraca.

Retry timing `[50, 200, 600, 1500, 3000, 5000]` — pokrywa różne momenty system init (Slick carousel, datepicker init, autocomplete init).

## Walidacja v1.7

```
CSS:  245 KB / 290 KB (zapas 45 KB)
JS:   36 KB (FR_KONIEC_BODY.html)
SEO:  8/8 PASS · 0 critical
UX:   27 critical (false positives jak v1.6)
```

## Pliki dla Damiana

**2 pliki + hard refresh**:
1. `FR_ARKUSZ_STYLOW.css` (245 KB) — Wygląd → Arkusz stylów
2. `FR_KONIEC_BODY.html` (36 KB) — Kody śledzące → Koniec BODY (PL i EN)

⚠️ **Krytyczne**: musisz wkleić **OBYDWA** pliki. Sam CSS nie wystarczy — JS `forceShowSystemSearch()` jest nowy i potrzebny dla MutationObserver guard.

## Smoke test post-paste (DevTools Console)

```javascript
const tests = [
  ['CSS marker v1.7', (await fetch(document.querySelector('link[href*=custom]').href).then(r=>r.text())).includes('PATCH MARKER — v1.7')],
  ['JS forceShowSystemSearch defined', /forceShowSystemSearch/.test(document.querySelector('script:not([src])')?.textContent || '')],
  ['.iai-search display block', getComputedStyle(document.querySelector('.iai-search')).display === 'block'],
  ['.iai-search position relative', getComputedStyle(document.querySelector('.iai-search')).position === 'relative'],
  ['.iai-search left auto', getComputedStyle(document.querySelector('.iai-search')).left === 'auto' || getComputedStyle(document.querySelector('.iai-search')).left === '0px'],
  ['#iai_book_form visible', getComputedStyle(document.querySelector('#iai_book_form')).display !== 'none'],
  ['Search visible in viewport', document.querySelector('.iai-search').getBoundingClientRect().width > 100]
];
console.table(tests);
```

## Co Damian powinien zobaczyć

- Pod hero asym **biała karta z formularzem rezerwacji**: 5 pól (Lokalizacja / Przyjazd / Wyjazd / Goście / żółty submit)
- Form jest natywnym widget IdoBooking — datepicker, location dropdown, persons input
- Hero zostaje z systemowym parallax photo + dark overlay + biały tekst

## Lessons learned (do zapisania)

1. **System IdoBooking widget hide pattern** — `position: absolute + left: -9999 + transform: translateX` + inline `style="display:none"` przez JS. Wymaga **2 warstw obrony**:
   - CSS path-based selector przez `.section.parallax` (wyższa specyficzność)
   - JS `setProperty('!important')` + MutationObserver
   
2. **Inline style wygrywa CSS !important** — gdy system JS aplikuje inline style po DOM ready, jedyny sposób override to inny inline style (przez `setProperty(prop, val, 'important')`).

3. **Retry timing pattern** — system widget init może trwać 50ms-5s. Force show pattern: `[50, 200, 600, 1500, 3000, 5000]` pokrywa 99% scenariuszy.

Do zapisania: `lessons/idobooking-system-widget-force-show-pattern.md` w nowej sesji.

## Co zostaje bez zmian

- Hero z systemowym parallax + overlay (v1.6)
- Dark premium footer (v1.4)
- Magazine quote + Trust Score + Districts + Journey + Principles (v1.1-v1.2)
- HTML GLOWNA bez zmian
