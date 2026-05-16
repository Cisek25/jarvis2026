# 011 — Mobile hero `position:absolute` + content overflow → nakładanie się sekcji

## Problem (Apartamenty Parkowe v1.9.0 — user feedback 2026-05-13)

User: "na różnych telefonach cała wyszukiwarka nie jest widoczna, zasłania
ją np. następna sekcja".

Visual symptom na iPhone 12 (390×844):
- Hero search card kończy się na Y=1081
- `.ap-about` zaczyna się na Y=962
- **Overlap: 119px** — search wizualnie schodzi POD następną sekcję

## Root cause analysis (TDD diagnostic)

```javascript
// chrome-devtools MCP
{
  heroWrap: { position: 'absolute', height: '844px (100vh)' },
  heroGrid:  { height: '1013px', parent: heroWrap },  // CHILD bigger than PARENT
  searchCard: { height: '615px', position: 'static inside heroGrid' },
  sectionParallax: { height: '932px (fullpage forced)' },
  apAbout: { top: 962, position: 'normal flow after parallax' }
}
```

**Mechanizm bugu:**
1. `.ap-hero-wrap` ma `position: absolute !important; height: 100vh !important` (CSS line ~2604)
2. Wewnątrz `.ap-hero__grid` content (text + search) ma 1013px — większy niż 844px parent
3. Absolute parent z overflow:visible NIE rozszerza się na content child
4. `.section.parallax` (fullpage) ma stałe 932px (z fullpage.js inline style)
5. `.ap-about` to NORMALNY flow element AFTER `.section.parallax` — start ~962
6. Wizualnie hero content (1013px) wystaje poza heroWrap (844) → schodzi
   w obszar `.ap-about` (962+) → optycznie "zasłania"

## Fix

CSS §(9) w AP_CSS_EDYTOR.css (z specificity 55, patrz lesson 058):

```css
@media (max-width: 767.98px) {
  html body .ap-hero-wrap--split,
  html body .section.parallax .ap-hero-wrap--split {
    position: relative !important;   /* KEY FIX */
    height: auto !important;
    min-height: calc(100vh - 88px) !important;
    /* ... */
  }
  html body.page-index .section.parallax {
    height: auto !important;
    min-height: 100vh !important;
  }
}
```

`position: relative` na mobile → hero-wrap wraca do normal flow →
expanduje `.section.parallax` → `.ap-about` przesuwa się poniżej hero content.

PLUS: order swap (instinct 057) → search-card pierwszy w `.ap-hero__grid`
aby submit był above fold.

PLUS: kompaktowy search card (specificity 55, instinct 058) → fields 56px
zamiast 98px (43% redukcji wysokości).

## Wynik

| Device | Search h before | Search h after | Overlap before | Overlap after |
|--------|----------------|----------------|----------------|---------------|
| iPhone SE 375×667 | 580px | 321px | 119px | 0 (gap 415) |
| iPhone 12 390×844 | 615px | 321px | 119px | 0 (gap 453) |
| Pixel 7 412×915 | ~620px | 366px | overlap | 0 (gap 479) |
| Galaxy S20 360×740 | ~600px | 309px | overlap | 0 (gap 361) |

## Generalizacja

**Wzorzec**: hero z `position:absolute + height:100vh` na desktop jest OK
(content fits in 800px+ viewport). Na mobile (375-412px width × 667-915px height),
content stack vertical → przekracza 100vh. Trzeba RELATIVE + auto-height na mobile.

**Sygnały** że to ten bug:
1. Search/CTA "znika" lub "schodzi pod" następną sekcję na mobile
2. Hero ma `position:absolute` w CSS
3. Hero content (text + form) razem > viewport height
4. Następna sekcja jest `position:relative` lub `static`

**Testy do napisania** (TDD):
- T2b: `searchRect.bottom <= nextSectionRect.top` (no overlap)
- T2c: `searchRect.bottom <= window.innerHeight` (above fold)
- T2d: `submitRect.bottom <= window.innerHeight + 30` (reachable)

## Referencje

- Commit: Apartamenty Parkowe v1.9.1 (2026-05-13)
- File: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` §(9)
- Related: instinct 057 (search-first order swap), instinct 058 (specificity war)
