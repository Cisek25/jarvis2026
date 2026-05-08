# CSS `!important` przegrywa z system path selectors + inline style

## Sytuacja (Fair Rentals v1.3-v1.8)

Próbowałem pokazać systemowy widget `.iai-search` (default ukryty przez IdoBooking app.css). Każda iteracja CSS specificity escalation NIE zadziałała.

## Co próbowałem (5 iteracji)

| v | Próba | Wynik |
|---|---|---|
| v1.3 | `html body.page-index .iai-search { display: block !important; position: relative !important }` | `.iai-search` nadal `display: none, position: absolute, left: -9999px` |
| v1.4 | + `.iai-search { left: 0 !important; transform: none !important; overflow: visible !important }` | Pozycja fix dla `.iai-search` ALE `#iai_book_form` ma inline `style="display: none"` z system JS |
| v1.7 | CSS path-based wyższa specyficzność `html body.page-index .section.parallax .index-info .iai-search` (43 pkt) | Wygrywa CSS-em, ALE search w złym miejscu (top viewport zamiast pod hero) |
| v1.7 | + JS `setProperty('display', 'block', 'important')` na elementach | Inline style + !important = highest specificity, wygrywa system. ALE search renders przed hero w DOM order |
| v1.8 | + JS DOM reorder: `parentNode.insertBefore(indexInfo, heroWrap.nextSibling)` | Search w lepszym miejscu, ALE absolute floating bottom hero nie wygląda dobrze |

## Diagnoza dlaczego CSS przegrywa

System IdoBooking ukrywa `.iai-search` poprzez:
1. **CSS path-based** w `app.css`: `body.page-index .section.parallax .iai-search` (43 pkt)
2. **Position offscreen**: `position: absolute; left: -9999px; transform: translateX(-550px)` (3 properties razem)
3. **Inline style przez JS** runtime: `<form id="iai_book_form" style="display: none">` (najwyższa specyficzność CSS — wygrywa wszystko CSS, tylko inline `!important` może pokonać)

Mój `html body.page-index .iai-search { display: block !important }` (22 pkt) **przegrywa** z 1+2+3 systemu.

## Rozwiązanie definitywne — pattern "hide system + replace custom"

v1.9 — drop walka, zastosuj pattern znany z SA/AP/MP/Najmar/Madera:

1. **Hide system** wszystkimi możliwymi sposobami (11 properties × wszystkie path warianty):
```css
html body.page-index .iai-search,
html body.page-index .index-info,
html body.page-index .iai_frontpage,
html body.page-index #iai_book_form,
html body.page-index .section.parallax .iai-search /* etc */ {
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

2. **Replace custom** — own HTML `<section class="fr-search-banner">` z own form action endpoint `engine{ID}.idobooking.com/widget/index.php`.

System odbiera form submission, nasz UI wygląda jak chcemy.

## Lesson

**CSS specificity war jest tracony zanim się zacznie gdy system aplikuje 3 warstwy obrony (path-based + position + inline). Nie waltz. Hide + replace.**

## Sygnały że jesteś w specificity war

❌ Iteracja > 2 z dodawaniem `!important`
❌ JS `setProperty` z `'important'` na system elementach
❌ MutationObserver guard żeby co 100ms przywracać display:block
❌ DOM reorder system widget przez `parentNode.insertBefore`
❌ `position: relative !important; left: 0 !important; transform: none !important; overflow: visible !important` na samym selektorze

✅ **STOP** — wracaj do pattern "hide system + replace custom"

## Plik referencyjny
- `memory/instincts/045-MASTER-idobooking-system-widget-hide-replace.md`
- `clients/fairrentals/RELEASE_NOTES_v1.9.md` (revert do JARVIS pattern)

## Date
2026-05-07 — Fair Rentals 5-iteration debug (v1.3-v1.8 walka, v1.9 revert)
