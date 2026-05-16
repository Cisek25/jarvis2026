---
name: css-typography-rem-vs-px-11px-bug
description: Na podstronach body.page-txt, elementy z font-size w `rem` renderują się 11px (zamiast 17-19px) bo system IdoBooking ma `html { font-size: 10px }`. Konkurujące reguły rem z wysoką specyficznością (body.page-txt p:not(...):not(...) = 0,0,4,1) biją nasze PX overrides (html body .class = 0,0,1,2). Fix: mirror blacklisty :not() + double-class trick.
type: lesson
scope: all-clients
severity: HIGH
added: 2026-04-23
source_client: apartamenty-parkowe (client58154)
version_fixed: v1.8.15
related: trap #30 (CLAUDE.md), instinct 024-px-over-rem-when-system-root-10px, instinct 020-css-specificity-beats-order
---

# Lekcja: Typography bug 11px na /txt/* — dwa problemy naraz

## OBJAW

Na podstronach typu `/txt/200/O-nas`, `/txt/201/Galeria`, `/txt/202/Lokalizacja`:
- `.ap-pagehero__subtitle` renderuje się **11px** zamiast 19px
- `.ap-narrative p` renderuje się **11px** zamiast 17px
- Tekst praktycznie nieczytelny na mobile (poniżej minimum 14px WCAG)

Na homepage `/` (body.page-index) — OK, 17-19px.

## ROOT CAUSE — dwa problemy nakładają się

### Problem 1: `html { font-size: 10px }` (trap #30)

System IdoBooking default13 ustawia w `app.css`:
```css
html { font-size: 10px; }
```

To konwencja "1rem = 10px" (stara praktyka "62.5%"). **Wszystko co pisze
w rem** skaluje się ×10px. `1.1rem` = 11px, `1.7rem` = 17px.

### Problem 2: CSS specificity konflikt

Moje reguły pisane w absolute PX:
```css
html body .ap-pagehero__subtitle {      /* spec: 0,0,1,2 */
  font-size: 19px !important;
  line-height: 1.7 !important;
}
```

Ale istnieje KONKURENCYJNA reguła (starsza, z rem):
```css
body.page-txt p:not(.ap-offer-card__price):not(.ap-offer-card__meta):not(small) {
  /* specyficzność: body + page-txt class + :not(.x) ×3 + p tag
     = 0,0,4,1  (4 classes, 1 element) */
  font-size: 1.1rem !important;  /* = 11px w systemie html:10px */
}
```

**Specyficzność (0,0,4,1) > (0,0,1,2)** — stara wygrywa przy równych `!important`.

## JAK WYKRYĆ

### Objawy live
Na podstronie `/txt/*` przez DevTools/chrome-devtools MCP:
```javascript
getComputedStyle(document.querySelector('.ap-pagehero__subtitle')).fontSize
// "11px"  ← RED FLAG (powinno być 17-19px)
```

### Sprawdź konkurujące reguły
```javascript
const el = document.querySelector('.ap-pagehero__subtitle');
const rules = [];
for (const sheet of document.styleSheets) {
  try {
    const walker = (list) => {
      for (const rule of list) {
        if (rule.cssRules) walker(rule.cssRules);
        if (rule.selectorText && el.matches(rule.selectorText) && rule.style.fontSize) {
          rules.push({
            sel: rule.selectorText.substring(0, 100),
            size: rule.style.fontSize,
            // ⚠️ getPropertyPriority używa 'font-size' z myślnikiem
            imp: rule.style.getPropertyPriority('font-size') === 'important',
          });
        }
      }
    };
    walker(sheet.cssRules);
  } catch (e) {}
}
console.table(rules);
```

Jeśli wśród reguł widzisz `body.page-txt p:not(...)` z `1.1rem` — to on.

## FIX — 3 strategie (wybrać jedną)

### Strategia A — Mirror blacklisty :not() (NAJLEPSZE, v1.8.15)

Dopisz `.ap-pagehero__subtitle` do selektora z mirror :not():

```css
html body.page-txt p.ap-pagehero__subtitle:not(.ap-offer-card__price):not(.ap-offer-card__meta):not(small),
html body.page-txt .ap-pagehero__subtitle:not(.ap-offer-card__price):not(.ap-offer-card__meta):not(small) {
  font-size: 19px !important;
  line-height: 1.7 !important;
}
```

Specyficzność: `html` + `body.page-txt` + `p.ap-pagehero__subtitle` + 3× `:not()` klasa
= (0, 0, 5, 2) **> (0, 0, 4, 1)** ✅

### Strategia B — Double-class trick

```css
html body .ap-pagehero__subtitle.ap-pagehero__subtitle.ap-pagehero__subtitle {
  font-size: 19px !important;
}
```

Każde dodatkowe wystąpienie tej samej klasy liczy się jako +1 do specyficzności.
Mniej eleganckie ale działa zawsze.

### Strategia C — Refactor starej reguły (IDEALNIE)

Znajdź w CSS `body.page-txt p:not(.ap-offer-card__price)...` i dodaj ją:
```css
body.page-txt p:not(.ap-offer-card__price):not(.ap-offer-card__meta):not(small):not(.ap-pagehero__subtitle) {
  font-size: 1.1rem !important;
}
```

Ale to wymaga ruszania starego kodu — patch strategies A/B są szybsze.

## PREVENTION — piszemy od razu defensywnie

**REGUŁA ŻELAZNA dla klientów IdoBooking default13:**

1. **NIGDY nie pisz font-size w `rem`** (bo rem × 10px = śmieci)
2. **ZAWSZE pisz w absolute `px`** (instinct 024)
3. **Prefixuj `html body`** dla specyficzności (instinct 020)
4. **Jeśli piszesz typography dla podstrony /txt/\***, dodaj scope `body.page-txt` + mirror `:not()` istniejącej reguły

Przykład defensive template:
```css
/* Subtitle na podstronach /txt/* */
html body.page-txt p.ap-pagehero__subtitle:not(.ap-offer-card__price):not(.ap-offer-card__meta):not(small),
html body.page-txt .ap-pagehero__subtitle:not(.ap-offer-card__price):not(.ap-offer-card__meta):not(small),
html body .ap-pagehero__subtitle.ap-pagehero__subtitle.ap-pagehero__subtitle {
  font-size: 19px !important;
  line-height: 1.7 !important;
}
```

Mamy 3 typy selektorów = jeśli jeden nie wygra, wygra drugi.

## REFERENCJA

- **Client**: apartamenty-parkowe (client58154)
- **Wykryte**: v1.8.14 live audit (TDD style test subtitle >=17px → actual 11px FAIL)
- **Fix**: v1.8.15 CSS patch §(1) typography /txt/*
- **Related**:
  - CLAUDE.md trap #30 (html:10px)
  - instinct 020 (specificity beats order)
  - instinct 024 (px over rem)
  - instinct 033 (live audit TDD)
