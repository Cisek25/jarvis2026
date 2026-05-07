# Fair Rentals — Release Notes v1.8

**Wersja**: v1.8 — search position fix: floating bottom hero (zamiast top of viewport)
**Data**: 2026-05-07
**Bazuje na**: v1.7

## Powód iteracji

Damian (po v1.7 wklejeniu): "gdzieś w menu się pojawiła źle" + screenshot pokazuje:
- Wyszukiwarka na samej górze strony, blisko headera
- Hero text "WROCŁAW · RODZINNY OPERATOR WYNAJMU" jest pod wyszukiwarką, nie nad nią
- Layout się rozjechał — search wystarczy na top, hero pchnięty w dół

## Diagnoza live (v1.7)

`fp-tableCell` children order:
```
0. <script>          (system)
1. #parallax_topslider  (system photo, y=0, h=1227)
2. .index-info       (search, y=0, h=154) ← na samej górze
3. .fr-hero-wrap     (hero text/photo, y=154, h=1227) ← pod search
```

System renderuje `.index-info` przed `.fr-hero-wrap`. Mój v1.7 force show zadziałał, ale nie zmienił position. Search jest pierwszy w viewport.

## Fix v1.8 — dwa rozwiązania (defense in depth)

### A. JS reorder w `forceShowSystemSearch()`

```javascript
var reorder = function() {
  var fpCell = document.querySelector('.section.parallax > .fp-tableCell');
  var indexInfo = document.querySelector('.index-info');
  var heroWrap = document.querySelector('.fr-hero-wrap');
  if (heroWrap.compareDocumentPosition(indexInfo) & Node.DOCUMENT_POSITION_PRECEDING) {
    fpCell.insertBefore(indexInfo, heroWrap.nextSibling);
  }
};
```

Po reorder: `index-info` jest **po** `.fr-hero-wrap` w DOM order.

### B. CSS sekcja §77 — search jako floating absolute na dole hero

```css
html body.page-index .section.parallax .index-info {
  position: absolute !important;
  bottom: 32px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: calc(100% - 48px) !important;
  max-width: 1148px !important;
  z-index: 10 !important;
}

html body .fr-hero-asym {
  padding-bottom: clamp(180px, 22vh, 240px) !important;
}
```

Search **lewituje na dole hero** (w obrębie viewport razem z hero text/photo). Hero ma padding-bottom żeby tekst nie zachodził na search.

### C. Mobile fallback (≤ 600px)

```css
@media (max-width: 600px) {
  html body.page-index .section.parallax .index-info {
    position: relative !important;  /* NIE absolute na małych ekranach */
    margin: 24px 16px !important;
  }
  html body .fr-hero-asym {
    padding-bottom: clamp(56px, 8vh, 80px) !important;
  }
}
```

Na małych ekranach absolute floating może być za ciasny — wracamy do natural flow z marginesami.

## Walidacja v1.8

```
CSS:  248 KB / 290 KB (zapas 42 KB)
JS:   37 KB
SEO:  8/8 PASS · 0 critical
UX:   27 critical (false positives jak v1.6/v1.7)
```

## Pliki dla Damiana

**2 pliki + hard refresh — OBYDWA**:
1. `FR_ARKUSZ_STYLOW.css` (248 KB) — Wygląd → Arkusz stylów
2. `FR_KONIEC_BODY.html` (37 KB) — Kody śledzące → Koniec BODY

## Smoke test post-paste

```javascript
const tests = [
  ['Search position absolute', getComputedStyle(document.querySelector('.index-info')).position === 'absolute'],
  ['Search bottom 32px', getComputedStyle(document.querySelector('.index-info')).bottom === '32px'],
  ['Hero padding-bottom > 100', parseInt(getComputedStyle(document.querySelector('.fr-hero-asym')).paddingBottom) > 100],
  ['DOM order: hero before index-info', (() => {
    const hero = document.querySelector('.fr-hero-wrap');
    const ii = document.querySelector('.index-info');
    return !!(hero.compareDocumentPosition(ii) & Node.DOCUMENT_POSITION_FOLLOWING);
  })()],
  ['Search visible', document.querySelector('.iai-search').getBoundingClientRect().width > 100],
  ['Hero text above search', document.querySelector('.fr-hero-asym__title').getBoundingClientRect().y < document.querySelector('.iai-search').getBoundingClientRect().y]
];
console.table(tests);
```

## Co Damian powinien zobaczyć

Hero viewport (100vh):
- **Górna część**: kicker "WROCŁAW · RODZINNY OPERATOR WYNAJMU", h1 "Apartamenty Wrocław z opieką, jakiej szukasz", lead, 2 CTA buttons + meta strip
- **Dolna część** (32px od dołu viewport): biała karta search bar z formularzem (Lokalizacja / Przyjazd / Wyjazd / Goście / żółty submit)

Search bar ma **glassmorphism shadow** + lekko nakłada się na photo hero — jak w premium hospitality (baltic-apartments.com style).

## Lessons learned

- **System IdoBooking widget DOM order**: `.index-info` zawsze przed body_top content. Custom hero teleport (`teleportHero()`) ląduje **po** index-info. Override przez JS reorder po teleport.
- **Floating search bar pattern** dla page-index z fp.js: `.fp-tableCell { position: relative }` + `.index-info { position: absolute; bottom; transform: translateX(-50%) }` + hero `padding-bottom`.
- **Mobile fallback**: na ≤600px wracamy do natural flow (relative + margin) bo absolute na wąskich ekranach się gubi.
