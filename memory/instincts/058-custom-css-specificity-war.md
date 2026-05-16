# 058 — TRAP #31: Custom.css IdoBooking specificity war

## Kiedy stosować

ZAWSZE przy próbie nadpisania CSS w IdoBooking (panel → Arkusz stylów).
Przed napisaniem nowej reguły z !important — najpierw sprawdź w live page
czy istniejąca rule w custom.css nie ma wyższej specificity.

## Symptom

Twoja rule `html body .X { foo: bar !important }` (specificity 0,2,3 = 23)
NIE działa mimo `!important`. Computed style pokazuje wartość z innej reguły.
Console nie wyrzuca błędu — to po prostu cascade rule:

> Same `!important` + różna specificity → wygrywa **wyższa specificity**.
> Same `!important` + same specificity → wygrywa **deklarowana później**.

## Root cause

W IdoBooking po deployment Layer 1 + Layer 2 + Layer 3 są scalone w jeden
`custom.css?v={hash}`. To plik ma ~1000+ rules. Często rules są napisane
defensywnie z 3+ klasami w selektorze (`.{prefix}-hero__search-card .ap-search--vertical .ap-search__field` — specificity 0,3,3 = 33). Twój CSS dla mobile patch ma zwykle 0,2,3 i przegrywa.

## Workflow debugowania

```javascript
// chrome-devtools MCP — znajdź konfliktujące rules
() => {
  const sheet = document.styleSheets[6]; // custom.css zwykle index 6
  const matches = [];
  function recurse(rules, ctx) {
    for (const r of rules) {
      if (r.cssRules) recurse(r.cssRules, ctx + (r.media ? `@${r.media.mediaText} ` : ''));
      if (r.cssText && r.cssText.includes('YOUR-PROBLEM-CLASS') && /YOUR-PROBLEM-PROPERTY/.test(r.cssText)) {
        matches.push({ ctx, sel: r.selectorText, css: r.cssText.slice(0,300) });
      }
    }
  }
  recurse(sheet.cssRules, '');
  return matches;
}
```

Liczenie specificity: `(IDs, classes+attrs+pseudo-classes, elements+pseudo-elements)`.
- `html body .X` = (0, 1, 2) = 12 wait — actually `.X` jest 1 class. Let me recount.
- `html body .X` = `html`(1) + `body`(1) + `.X`(10) = 0,1,2 = ~12. Actually:
  - W specificity calc: ID=100, class=10, element=1
  - `html` = 1
  - `body` = 1
  - `.X` = 10
  - SUMA = 12
- A `.A .B .C` = 30
- Więc `html body .X` (12) PRZEGRYWA z `.A .B .C` (30).

W praktyce: aby pokonać 0,3,3 (33) musisz mieć co najmniej 4 classes
lub jedną ID. Najprostsze:
- Skopiuj cały selector istniejącej reguły
- Dodaj `html body` na początku → +2 elements (12 → 14, nie wystarczy)
- LUB dodaj jeszcze jeden parent class (33 → 43)

## Konkretny example (Apartamenty Parkowe v1.9.1)

PRZED: `html body .ap-search__field { min-height: 44px !important }` (23) — PRZEGRYWA
ISTNIEJĄCA: `.ap-hero__search-card .ap-search--vertical .ap-search__field { min-height: 82px !important }` (33)
NAPRAWA: `html body .ap-hero-wrap--split .ap-hero__search-card .ap-search--vertical .ap-search__field { min-height: 46px !important }` (55) — WYGRYWA

## Live verify

Po napisaniu reguły ALWAYS chrome-devtools MCP → reload → check computed style:
```js
const el = document.querySelector('.YOUR-CLASS');
getComputedStyle(el).minHeight  // sprawdź wartość
```

## Plik referencyjny

`clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` §(9) — commit v1.9.1.
`docs/CLIENT-LESSONS-apartamenty-parkowe.md` TRAP #31.
