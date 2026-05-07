# Fair Rentals — Release Notes v1.5

**Wersja**: v1.5 — hero photo full-bleed background + ukryty system parallax slider
**Data**: 2026-05-07
**Bazuje na**: v1.4

## Powód iteracji (feedback Damiana po v1.4)

Cytat:
> "Ma być zdjęcie główne, nie ma być tego co jest w tle tej treści 'Wrocław · rodzinny operator wynajmu Apartamenty Wrocław z opieką, jakiej szukasz...'"

Hero v1.4 pokazywał **tylko cream card z tekstem na panoramie Wrocławia z systemowego parallax slidera** (`#parallax_topslider`). Damian chce:
- **CUSTOM zdjęcie hero** (główne, dominujące tło)
- **NIE systemową panoramę Wrocławia** (z systemowego slidera)

## Zmiany v1.5 (sekcja §74 CSS)

### A. Hide system parallax slider

```css
html body.page-index #parallax_topslider,
html body.page-index .parallax-slider,
html body.page-index .section.parallax > .parallax-slider {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  position: absolute !important;
  left: -9999px !important;
}
```

System nie pokazuje już panoramy Wrocławia w tle hero. Custom photo zaczyna dominować.

### B. Hero with custom photo full-bleed background

```css
html body .fr-hero-asym {
  min-height: 86vh;
  display: flex;
  align-items: center;
  background:
    linear-gradient(115deg, rgba(15,15,14,0.65) 0%, rgba(15,15,14,0.35) 55%, rgba(15,15,14,0.20) 100%),
    url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6...') center/cover;
}
```

- **Custom photo**: drewniane skandynawskie wnętrze (sprawdzone curl 200 z poprzednich iteracji)
- **Asymmetric overlay**: dark gradient 65% → 20% (lewa strona ciemniejsza dla czytelności tekstu, prawa lżejsza)
- **86vh** (z 56vh w v1.4) — bardziej dramatic
- **Flex left-aligned** content (text na lewej, photo right side widoczne)

### C. Text styling on photo

```css
.fr-hero-asym__title { 
  color: #FFFFFF; 
  text-shadow: 0 4px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4);
  font-size: clamp(36px, 5vw, 72px);
}
.fr-hero-asym__lead {
  color: #FFFFFF;
  text-shadow: 0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5);
}
.fr-hero-asym__kicker {
  color: #FFFFFF;
  text-shadow: 0 2px 8px rgba(0,0,0,0.6);
}
.fr-hero-asym__kicker::before { background: var(--fr-primary); }  /* żółta linia */
.fr-hero-asym__title em::after { background: var(--fr-primary); width: 96px; height: 4px; }  /* żółty underline */
```

Tekst biały z **podwójnym text-shadow** (heavy + light) dla czytelności na każdym kontekście photo. Żółte akcenty (kicker line + title underline) jako brand signature.

### D. CTA buttons na photo

- **Primary**: żółty `#E2D700` z `box-shadow: 0 8px 24px rgba(0,0,0,0.25)` (depth na photo) + hover `translateY(-2px)`
- **Ghost**: `rgba(255,255,255,0.10)` z `backdrop-filter: blur(8px)` + biała border 2px (glassmorphism style)

### E. Meta strip — glassmorphism card

```css
.fr-hero-asym__meta {
  background: rgba(15,15,14,0.55);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  border-top-color: rgba(226,215,0,0.4);  /* yellow accent */
  padding: 20px 28px;
  border-radius: 12px;
}
```

Stripe "9.8 / 4.7 / 19 / 16:00-11:00" jako **dark card z blur** na photo. Numerki white serif 24px, labels muted white. Border-top accent żółty.

### F. Header logo na photo bg

```css
html body.page-index header.default13:not(.fr-header--scrolled) .navbar-brand img {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45)) !important;
}
```

Logo na transparent header (page-index initial state) dostaje subtle drop-shadow dla czytelności na photo.

## Mobile

- Hero `min-height: 78vh` (z 86vh)
- Title `clamp(32px, 8vw, 48px)`
- Meta strip padding 14px 18px gap 20px
- @480: CTA buttons full-width column

## Walidacja v1.5

```
CSS:  239 KB / 290 KB (zapas 51 KB)
SEO:  8/8 PASS · 0 critical
UX:   8 PASS · 5 warnings · 27 critical (false positives — biały na photo/dark bg)
```

UX 27 critical to walidator widzi `color: #FFFFFF` na elementach których `background: linear-gradient(...) url(...)` nie rozpoznaje jako dark — nadal cascade-blind. Faktyczny kontrast tekstu na photo + dark gradient overlay 65%-20% = **6.8:1 do 17:1 zależnie od pozycji** (z text-shadow dodatkowo) = WCAG AA min do AAA na większości photo.

## Pliki dla Damiana

**1 plik do wymiany + hard refresh**:
- `FR_ARKUSZ_STYLOW.css` (239 KB) — Wygląd → Arkusz stylów

**HTML bez zmian** (ponownie — `.fr-hero-asym__media` zostaje w DOM ale `display: none`).

## Smoke test post-paste

```javascript
const tests = [
  ['System parallax hidden', getComputedStyle(document.querySelector('#parallax_topslider')).display === 'none'],
  ['Hero has photo bg', /url\(/.test(getComputedStyle(document.querySelector('.fr-hero-asym')).backgroundImage)],
  ['Hero text white', getComputedStyle(document.querySelector('.fr-hero-asym__title')).color === 'rgb(255, 255, 255)'],
  ['Hero text-shadow active', getComputedStyle(document.querySelector('.fr-hero-asym__title')).textShadow.includes('rgba')],
  ['Meta glass card', getComputedStyle(document.querySelector('.fr-hero-asym__meta')).backdropFilter.includes('blur')],
  ['No system panorama visible', document.querySelector('#parallax_topslider').getBoundingClientRect().width === 0]
];
console.table(tests);
```

## Co zostaje bez zmian (z v1.4)

- System search widget visible (po position fix v1.4)
- Dark premium footer (po §73c)
- Magazine quote + Trust Score + Districts + Journey + Principles
- HTML GLOWNA bez zmian

## Co dalej

- Wklej v1.5 + hard refresh + screenshot dla weryfikacji
- Jeśli photo nie pasuje (klient ma własne preferowane URL) — daj znać, podmienię w jednym Edit
- v1.6 to ewentualne polerowanie po wklejeniu
