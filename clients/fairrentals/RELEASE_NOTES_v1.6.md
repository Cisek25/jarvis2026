# Fair Rentals — Release Notes v1.6

**Wersja**: v1.6 — przywrócony systemowy parallax + transparent hero + overlay
**Data**: 2026-05-07
**Bazuje na**: v1.5

## Powód iteracji (feedback Damiana po v1.5)

> "Źle, właśnie ma nie być tego, a ma być normalne zdjęcie systemowe... tak jak w innych wdrożeniach"

W v1.5 zrobiłem custom Unsplash URL hardcoded w CSS jako `background-image` na `.fr-hero-asym`. Damian chce **systemowe zdjęcie** z `#parallax_topslider` (które klient wgrywa do panelu IdoBooking, sekcja "Zdjęcia strony głównej / Galeria parallax").

## Zmiany v1.6 (sekcja §75 CSS)

### A. Restore system `#parallax_topslider`

```css
html body.page-index #parallax_topslider,
html body.page-index .parallax-slider {
  display: block !important;
  visibility: visible !important;
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 0 !important;
  overflow: hidden !important;
}
```

Cofnięte ukrycie z v1.5 (`display: none + left: -9999px`). System pokazuje swój slick-slider z fotografiami które klient wgrał do panelu.

Slides + img wewnątrz fill container (`100%` + `object-fit: cover`).

### B. Transparent hero + overlay nad system photo

```css
html body .fr-hero-asym {
  background: transparent !important;
  background-image: none !important;  /* usuń v1.5 hardcoded URL */
}

html body .fr-hero-asym::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, 
    rgba(15,15,14,0.62) 0%, 
    rgba(15,15,14,0.32) 55%, 
    rgba(15,15,14,0.18) 100%);
  z-index: 1;
  pointer-events: none;
}

html body .fr-hero-asym__text {
  position: relative;
  z-index: 3;  /* nad overlay */
}
```

Hero jest **przezroczysty** — pokazuje systemowe photo z `#parallax_topslider` pod sobą. Asymetryczny dark gradient overlay (lewa ciemniejsza dla czytelności tekstu, prawa lżejsza) jest **nad** photo, ale **pod** tekstem.

Z-index hierarchy:
- 0: `#parallax_topslider` (system photo)
- 1: `.fr-hero-asym::after` (gradient overlay)
- 3: `.fr-hero-asym__text` (kicker, h1, lead, CTA, meta)

## Co zachowane z v1.5

- Tekst biały + heavy text-shadow (czytelność na każdym photo z panelu)
- Żółta linia akcent w kicker + żółty underline pod `<em>` w tytule
- CTA primary żółty + ghost glassmorphism
- Meta strip glass card z blur
- `.fr-hero-asym__media` + `__badge` ukryte (custom right-side photo z v1.0-v1.2 — nie wraca)

## Walidacja v1.6

```
CSS:  242 KB / 290 KB (zapas 48 KB)
SEO:  8/8 PASS · 0 critical
UX:   27 critical (false positives — biały tekst na overlay, walidator nadal cascade-blind)
```

## Pliki dla Damiana

**1 plik + hard refresh**:
- `FR_ARKUSZ_STYLOW.css` (242 KB) — Wygląd → Arkusz stylów

## Co Damian powinien zobaczyć

- Hero ma w tle **systemowe zdjęcie** z `#parallax_topslider` (to które klient wgrał do panelu IdoBooking — może być panorama Wrocławia, kamienice, dachy, etc.)
- Text "Apartamenty Wrocław z opieką, jakiej szukasz" + 2 CTA + meta strip nad gradient overlay
- Dark gradient ciemniejszy z lewej (gdzie jest tekst) → lżejszy z prawej (photo bardziej widoczne)

## Smoke test post-paste

```javascript
const tests = [
  ['System parallax visible', getComputedStyle(document.querySelector('#parallax_topslider')).display !== 'none'],
  ['Parallax filling viewport', document.querySelector('#parallax_topslider').getBoundingClientRect().width > 100],
  ['Hero bg transparent', getComputedStyle(document.querySelector('.fr-hero-asym')).backgroundImage === 'none'],
  ['Hero overlay active', (() => {
    const el = document.querySelector('.fr-hero-asym');
    const style = getComputedStyle(el, '::after');
    return style.content !== 'none' && style.position === 'absolute';
  })()],
  ['Text white na overlay', getComputedStyle(document.querySelector('.fr-hero-asym__title')).color === 'rgb(255, 255, 255)'],
  ['Text z-index above overlay', parseInt(getComputedStyle(document.querySelector('.fr-hero-asym__text')).zIndex, 10) >= 3]
];
console.table(tests);
```

## Co dalej

Jeśli klient nie ma jeszcze wgranych zdjęć w panel (`Wygląd → Galeria strony głównej`), system parallax pokaże domyślną panoramę IdoBooking (czerwone dachy Wrocławia którą wcześniej widać było w v1.4).

Aby było photo specifically Fair Rentals, **klient musi wgrać własne zdjęcia do panelu** w sekcji "Zdjęcia strony głównej". System auto-renderuje je w slick-sliderze.

## Lessons learned

Path: cofnięta v1.5 hardcoded URL → `display: none` → przywrócony z `display: block`. **Lekcja**: zanim ukryję systemowy element którego rolę nie znam dokładnie, sprawdzić co się dzieje gdy go ukryję. W tym przypadku Damian preferuje system content (panel-controlled) nad hardcoded developer choices. Standard JARVIS dla wszystkich klientów: **system parallax visible, custom CSS only nad nim**.

Do zapisania: `lessons/system-parallax-visibility-default.md` — system `#parallax_topslider` zostaje WIDOCZNY. Custom photo na hero realizujemy przez `position: absolute; ::after` overlay, NIE przez ukrywanie systemu.
