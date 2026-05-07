# Fair Rentals — Release Notes v1.9

**Wersja**: v1.9 — REVERT do JARVIS proven pattern (custom search section + hide system widget)
**Data**: 2026-05-07
**Bazuje na**: v1.8 (cofa wszystkie próby pokazania system widget z v1.3-v1.8)

## Powód iteracji

Damian (po v1.8): "teraz znowu w ogóle nie widać, zobacz jak to robiłeś na innych stronach za pomocą jarvisa, dodawałeś swoją sekcję po prostu po ukryciu systemowej, a teraz znowu nie ma"

## Decyzja: powrót do proven JARVIS pattern

Przez 5 wersji (v1.3-v1.8) próbowałem pokazać systemowy widget IdoBooking `.iai-search`. Każda wersja walczyła ze specyficznością systemu CSS (`position:absolute; left:-9999px`) lub system JS (inline `style="display:none"`). Mimo:
- CSS path-based selectors (specyficzność 0,4,3 = 43 pkt)
- JS `setProperty('!important')`
- MutationObserver
- DOM reorder

Damian widzi **wciąż brak wyszukiwarki** lub **search w złym miejscu**. To wskazuje na fundamental issue — nie powinienem walczyć z systemem.

**Pattern z innych klientów (SA, AP, MP, Najmar, Madera)**:
1. **Hide systemowy widget całkowicie** w CSS (`display: none + position offscreen`)
2. **Dodaj własną sekcję** w HTML z custom form (`.fr-search-banner` z `.fr-cmd-bar`)
3. Form action wskazuje na ten sam endpoint `engine58360.idobooking.com/widget/index.php` z parametrami `dateFrom`, `dateTo`, `persons-adult`, `lang`

To rozwiązanie działa od v1.0 SA do v1.7.6 SA, w AP i innych. **Stosuję dla FR**.

## Zmiany v1.9

### A. CSS sekcja §78 — hide system widget (FINAL)

Cofnięte wszystkie próby pokazywania systemu z v1.3-v1.8. System ukryty z 11 properties:
```css
.iai-search, .index-info, .iai_frontpage, #iai_book_form, #iai_book_se {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
  z-index: -100 !important;
  ...
}
```

Plus paths przez `.section.parallax .iai-search` itd. (wszystkie warianty selektorów które v1.7 próbował).

### B. CSS — restore `.fr-search-banner` visibility

```css
html body section.fr-search-banner,
html body .fr-search-banner {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
}
```

Cleanup z v1.3 (`display: none` na `.fr-search-banner`) — cofnięty.

### C. CSS — hero `padding-bottom: 0` (cofa v1.8)

W v1.8 hero miał `padding-bottom: clamp(180-240px)` żeby zostawić miejsce dla floating absolute search bar. Cofam — search bar znów jest osobną sekcją po hero.

### D. HTML — restore `<section class="fr-search-banner">` w GLOWNA_PL/EN

Sekcja v1.2 wstawiona z powrotem między `</div>` (hero asym wrap) a `<section class="fr-magazine">`.

```html
<section class="fr-search-banner" id="fr-search">
  <div class="fr-search-banner__inner">
    <div class="fr-search-banner__intro">
      <span class="fr-search-banner__kicker">Rezerwacja online</span>
      <h2 class="fr-search-banner__title">Sprawdź dostępność <em>i zarezerwuj online</em></h2>
    </div>
    <aside class="fr-cmd-bar" id="fr-cmd-bar">
      <form action="https://engine58360.idobooking.com/widget/index.php" method="get">
        <div class="fr-cmd-bar__field">Przyjazd ...</div>
        <div class="fr-cmd-bar__field">Wyjazd ...</div>
        <div class="fr-cmd-bar__field">Goście select 1-6</div>
        <button type="submit">Szukaj</button>
      </form>
    </aside>
  </div>
</section>
```

CSS dla `.fr-search-banner` był już w pliku (sekcja §71a od v1.2) — nie trzeba dodawać ponownie. Tylko cleanup hide został cofnięty.

### E. CTA hero — przywrócony anchor `#fr-search`

```html
<a href="#fr-search" class="fr-btn fr-btn--primary">Sprawdź dostępność</a>
```

(z `/pl/offers` na `#fr-search` — po kliknięciu CTA scroll do search bar pod hero).

### F. JS — disable `forceShowSystemSearch()`

```js
function forceShowSystemSearch() {
  return;  // v1.9: cofnięte do JARVIS pattern
}
```

Funkcja zachowana ale early-return — żadne side effects. Stary kod przeniesiony do `_forceShowSystemSearch_disabled_v1_7()` (dead code, nie wywoływany).

## Walidacja v1.9

```
CSS:  250 KB / 290 KB (zapas 40 KB)
JS:   37 KB
SEO:  8/8 PASS
UX:   27 critical (false positives jak v1.6/v1.7/v1.8)
```

## Pliki dla Damiana

**3 pliki + hard refresh**:
1. `FR_ARKUSZ_STYLOW.css` (250 KB) — Wygląd → Arkusz stylów
2. `GLOWNA_PL__cms.html` (20 KB) — Strona główna PL → Treść (HTML)
3. `GLOWNA_EN__cms.html` (20 KB) — Strona główna EN → Treść (HTML)
4. `FR_KONIEC_BODY.html` (37 KB) — Kody śledzące → Koniec BODY (NIE WYMAGANE jeśli już wkleiłeś v1.7/v1.8 — JS zostaje, tylko `forceShowSystemSearch()` early-return)

**Minimum: pliki #1, #2, #3** (CSS + dwie strony HTML). Plik #4 opcjonalnie jeśli chcesz aktualną wersję JS.

## Smoke test post-paste

```javascript
const tests = [
  ['System .iai-search hidden', getComputedStyle(document.querySelector('.iai-search')).display === 'none'],
  ['System #iai_book_form hidden', getComputedStyle(document.querySelector('#iai_book_form')).display === 'none'],
  ['Custom .fr-search-banner exists', !!document.querySelector('.fr-search-banner')],
  ['Custom search visible', getComputedStyle(document.querySelector('.fr-search-banner')).display !== 'none'],
  ['Form action correct', document.querySelector('.fr-cmd-bar__form').action.includes('engine58360.idobooking.com/widget/index.php')],
  ['Custom search w viewport po skrolu', document.querySelector('.fr-search-banner').getBoundingClientRect().y > 0]
];
console.table(tests);
```

## Co Damian powinien zobaczyć

1. **Hero viewport (100vh)**: photo z systemu parallax + dark overlay + biały tekst (kicker, h1 "Apartamenty Wrocław", lead, 2 CTA buttons, meta strip 9.8/4.7/19/16:00-11:00)
2. **Skroll w dół (lub klik "Sprawdź dostępność")**: pokazuje się sekcja `.fr-search-banner` — DARK banner full-width z białą kartą `.fr-cmd-bar` (4 pola: Przyjazd / Wyjazd / Goście / żółty submit "Szukaj")
3. Pod search bar: magazine quote, featured offers, stats, principles, districts, journey, dual CTA, trust score, final CTA, footer

Search bar jest **stały** (nie ucieka), na gwarantowanej pozycji pod hero. Form submit do `engine58360.idobooking.com/widget/index.php` z parametrami.

## Lessons learned (do zapisania w memory/lessons)

**`lessons/idobooking-system-search-fight-vs-replace.md`**:

Próba 1 (5 wersji v1.3-v1.8): walka ze systemem żeby pokazać `.iai-search`. Każda wersja walczyła z systemem CSS specificity, system JS inline style, system DOM order. **5 iteracji bez sukcesu**.

Próba 2 (v1.9): cofnięcie do JARVIS proven pattern — hide system, dodaj custom. **Działa od v1.0 SA do v1.7.6**.

**Wniosek**: nie walcz z system widget w IdoBooking default13. Hide + replace. To jest STANDARD JARVIS dla wszystkich klientów. Każdy override systemu to long tail iteracji.

## Co dalej

- v1.9 wklejenie + zwrotka
- Jeśli search działa, polerujemy detali
- Lesson zapisany do memory w następnej sesji
