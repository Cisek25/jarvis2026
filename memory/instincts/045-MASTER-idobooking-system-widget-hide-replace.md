# 045 MASTER — IdoBooking System Widget: Hide + Replace Pattern

## Kiedy stosować
Każda strona `body.page-index` z systemowym widgetem (`.iai-search`, `.cmshotspot`, etc.) który chcemy zastąpić własnym brandowanym componentem.

## Reguła
**Nie walcz ze specyficznością systemowego widgetu. HIDE go całkowicie + REPLACE custom HTML/CSS.**

## Dlaczego
System IdoBooking renderuje widget w wielu warstwach:
- CSS path-based selektory: `body.page-index .section.parallax .iai-search` (specyficzność 0,4,3 = 43 punktów)
- Inline style runtime przez JS: `<form id="iai_book_form" style="display: none">`
- Pozycjonowanie offscreen: `position: absolute; left: -9999px; transform: translateX(-550px)`

Override przez `html body.page-index .iai-search { display: block !important }` (specyficzność 0,2,2 = 22) **przegrywa**. Mimo `!important`.

5 iteracji (Fair Rentals v1.3-v1.8) walki nie zadziałało:
- v1.3: CSS display:block + position:relative
- v1.4: CSS position fix (left:-9999 → 0)
- v1.7: CSS path-based (43 pkt) + JS setProperty('!important') + MutationObserver
- v1.8: JS DOM reorder + CSS absolute floating

Każda generowała nowy bug (search w złym miejscu, search niewidoczna, layout chaos).

## Pattern (proven SA, AP, MP, Najmar, Madera, FR)

### CSS — hide systemowy
```css
/* Wszystkie path warianty + 11 properties żeby pewne */
html body.page-index .iai-search,
html body.page-index .index-info,
html body.page-index .iai_frontpage,
html body.page-index #iai_book_se,
html body.page-index #iai_book_form,
html body.page-index .section.parallax .iai-search,
html body.page-index .section.parallax .index-info,
html body.page-index .section.parallax .iai_frontpage,
html body.page-index .section.parallax #iai_book_form,
html body.page-index .cmshotspot {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
  z-index: -100 !important;
  opacity: 0 !important;
}
```

### HTML — custom replacement
```html
<section class="fr-search-banner" id="fr-search">
  <div class="fr-search-banner__inner">
    <aside class="fr-cmd-bar">
      <form action="https://engine{ID}.idobooking.com/widget/index.php" method="get">
        <input name="dateFrom" ...>
        <input name="dateTo" ...>
        <select name="persons-adult">...</select>
        <input type="hidden" name="lang" value="pl">
        <button type="submit">Szukaj</button>
      </form>
    </aside>
  </div>
</section>
```

### Form action
**Endpoint zawsze**: `https://engine{ID}.idobooking.com/widget/index.php` (gdzie `{ID}` to klient client number).

**Pola (camelCase)**:
- `dateFrom` (date string YYYY-MM-DD)
- `dateTo`
- `persons-adult` (number)
- `location` (opcjonalnie)
- `lang` (pl/en/de hidden)

## Sygnały że ktoś próbuje walczyć z system zamiast hide+replace

❌ **Złe podejście**:
- "Damian zobaczy systemowy searcher z brandingiem"
- CSS `display: block !important` na `.iai-search`
- JS `setProperty('display', 'block', 'important')` na `.iai-search`
- DOM reorder system widget przez `parentNode.insertBefore`
- MutationObserver guard na system elementy

✅ **Dobre podejście**:
- Hide WSZYSTKICH wariantów ścieżek systemu
- Custom HTML section z own form
- Custom CSS branding na własnym selektorze (`fr-cmd-bar`)
- Form action wskazuje na engine endpoint (system processuje)

## Przyszli klienci
Stosować ten wzorzec dla każdego nowego klienta gdzie chcemy custom search bar. Nigdy nie próbować pokazać systemowego widget — zbyt wiele warstw obrony systemowej.

## Plik źródłowy
- `clients/fairrentals/RELEASE_NOTES_v1.9.md`
- `clients/solidneapartamenty/DO_WKLEJENIA/SA_CSS_EDYTOR.css` (pattern reference)

## Last updated
2026-05-07 — Fair Rentals v1.9 cleanup (po 5 iteracjach walki v1.3-v1.8)
