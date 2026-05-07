# Fair Rentals — Release Notes v1.4

**Wersja**: v1.4 — hero single column + system search FIX (offscreen) + dark premium footer + UX contrast
**Data**: 2026-05-07
**Bazuje na**: v1.3

## Powód iteracji (feedback Damiana po v1.3)

Cytat:
> "Chcę w ogóle bez tego zdjęcia jakby dodatkowego na głównej sekcji/stronie tam gdzie napisy i nie ma w ogóle wyszukiwarki, albo jest jakoś ukryta. Stopka jest totalnie za jasna. Przeprowadź też testy UX wszystkiego, bo kolory są średnie mam wrażenie, czasem za małe kontrasty, różnice, bo zdjęcia przysłaniają, elementy jakieś."

Cztery problemy:
1. Photo column w hero asym do usunięcia — chce hero single column tylko z napisami
2. Wyszukiwarka systemowa nadal niewidoczna mimo v1.3
3. Stopka cream za jasna — chce coś innego (premium dark)
4. UX audit kontrastów / overlay zdjęć / elementów

## Diagnoza live (playwright na v1.3 wklejonym)

**KRYTYCZNE odkrycie systemowego ukrywania `.iai-search`**:

CSS v1.3 z §72 `display: block !important` był aplikowany ALE system app.css IdoBooking ma jeszcze jedną warstwę ukrywania:

```css
.iai-search {
  position: absolute !important;
  left: -9999px !important;
  transform: matrix(1, 0, 0, 1, -550, 0) !important;
  overflow: hidden !important;
}
.index-info {
  position: absolute !important;
  left: 592.5px !important;
  transform: matrix(1, 0, 0, 1, -585, -60) !important;
}
```

System chowa `.iai-search` **OFFSCREEN** (left: -9999px) + dodaje translateX. To stara konwencja accessibility-skip-link, używana przez IdoBooking dla widget'u który normalnie pojawia się dopiero po user interaction.

**Mój v1.3 `display: block` + `visibility: visible` nie wystarczyły** — pozycja absolutna offscreen zostawała.

**Lessons learned**: każdy override systemowego elementu IdoBooking wymaga override **wszystkich 6** properties: `display`, `visibility`, `opacity`, `position`, `left`, `transform` (+ `overflow` dla parent z `overflow: hidden`).

## Zmiany v1.4

### A. Hero — single column (no photo)

```css
html body .fr-hero-asym {
  grid-template-columns: 1fr !important;  /* z 1.05fr 1fr */
  min-height: 56vh !important;            /* z 70vh */
  background: var(--fr-cream) !important;
}
html body .fr-hero-asym__text {
  padding: clamp(96-140px) 24px clamp(48-80px);
  max-width: 880px !important;
  margin: 0 auto !important;
}
html body .fr-hero-asym__media {
  display: none !important;
}
```

Hero teraz: kicker + h1 + lead + 2 CTA buttons + meta strip (9.8/4.7/19/16:00-11:00) — **bez photo column right**, bez glassmorphism badge. Background cream pełny.

### B. System search FIX — position override

```css
html body.page-index .iai-search,
html body.page-index .index-info {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  transform: none !important;
  overflow: visible !important;
}
```

Plus `.iai-search` styling: biała karta z żółtą primary border, shadow heavy `0 24px 60px rgba(0,0,0,0.18)`, padding clamp(20-32px). Form `#iai_book_form` grid 5-col `1.1fr 1fr 1fr 0.85fr auto` (lokalizacja, dateFrom, dateTo, persons, submit).

`.index-info` (parent) margin auto, max-width 1148px, padding 24px sides, margin-bottom 64px — naturalny flow pod hero.

### C. Dark premium footer (override v1.2 cream)

```css
html body footer:not(.fr-disable-light-footer),
html body footer .footer.container {
  background: #0F0F0E !important;
  color: rgba(255, 255, 255, 0.92) !important;
  border-top: 2px solid var(--fr-primary) !important;
}
```

**Layout 3-col + bottom legal row + payment baner**:
- Brand "Fair Rentals" centered top, italic display 28-44px white, separator border
- 3 kolumny: Adres / Telefon / E-mail z labels uppercase muted (rgba 0.55 white)
- Telefon + email: **żółte primary** (`#E2D700`) — kontrast AAA na dark (11.7:1)
- Bottom row: Regulamin + Polityka prywatności inline, separator border-top
- Payment baner: dark bg, Visa/Mastercard z `filter: brightness(1.4) saturate(0.6) opacity(0.78)` (white tint)
- Mobile @991: 2-col, @600: 1-col stack, terms column

**Różnica vs SA**:
- SA stopka: `#2A2226` (warm dark), 3-col grid z brand-text ::before lewa, separator pomiędzy
- FR v1.4 stopka: `#0F0F0E` (premium black), brand-text **centered top with separator**, 3-col info + 1 row legal full-width, payment baner pod
- SA tekstowy color: szary `#5E5E5E` na ciemnym (słaba czytelność)
- FR text: `rgba(255,255,255,0.92)` z żółtymi akcentami dla CTAs (AAA)

### D. UX contrast fixes

| Element | v1.3 | v1.4 |
|---|---|---|
| `.fr-trust-card__meta` | text-muted #7A736B na cream | text-body #3F3A35 (kontrast 11:1) |
| `.fr-trust-card__source` | muted | text-body |
| `.fr-section__header .fr-lead` | muted | text-body |
| `.fr-district__count` | muted weight 600 | text-dark weight 700 |
| `.fr-magazine`, `.fr-final-cta` opacity | reveal animation może stuck na 0 | force `opacity: 1` |
| `.fr-trust-card__link` | mixed | text-dark + 2px border |

Walidator UX-020 false positives wzrosły z 19 do 20 — ze względu na nowy dark footer. Wszystko nadal cascade-blind walidator (białe tekst na ciemnym tle).

## Walidacja v1.4

```
CSS:  233 KB / 290 KB (zapas 57 KB)
SEO:  8/8 PASS · 0 critical
UX:   11 PASS · 7 warnings · 20 critical (false positives — białe na ciemnych)
```

## Pliki zmienione w v1.4

| Plik | v1.3 | v1.4 | Komentarz |
|---|---|---|---|
| `FR_ARKUSZ_STYLOW.css` | 223 KB | 233 KB | +10 KB (sekcja §73 a-d: hero rebuild + system search position fix + dark footer override + UX fixes) |

**HTML bez zmian** — `.fr-hero-asym__media` dalej w DOM ale `display: none` (łatwiej revert v1.5 jeśli Damian zechce wrócić).

## Co Damian musi zrobić

**Wymień 1 plik (CSS only) + hard refresh**:
1. `FR_ARKUSZ_STYLOW.css` (233 KB) — Wygląd → Arkusz stylów

**Sprawdź na live `https://client58360.idobooking.com/pl/`**:
- [ ] Hero asym: **bez prawej kolumny ze zdjęciem** — tylko text, kicker, h1, lead, 2 CTA buttons, meta strip
- [ ] Pod hero **systemowy widget IdoBooking widoczny**: biała karta z 5 polami (Lokalizacja / Przyjazd / Wyjazd / Goście / żółty submit)
- [ ] Stopka **premium DARK** (`#0F0F0E`): brand "Fair Rentals" centrowane top, 3 kolumny info, telefon i email **żółte**, Regulamin/Polityka linia pod
- [ ] Pre-footer (`.fr-final-cta`) widoczna jak należy (opacity 1)
- [ ] Magazine quote widoczna (opacity 1)

## Smoke test (Console DevTools po wklejeniu)

```javascript
// Quick v1.4 verification
const tests = [
  ['Hero asym single column', getComputedStyle(document.querySelector('.fr-hero-asym')).gridTemplateColumns.split(' ').length === 1],
  ['Hero media hidden', getComputedStyle(document.querySelector('.fr-hero-asym__media')).display === 'none'],
  ['System search visible', (() => {
    const el = document.querySelector('.iai-search');
    if (!el) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.position === 'relative' && cs.left === 'auto';
  })()],
  ['index-info naturalny flow', getComputedStyle(document.querySelector('.index-info')).position === 'relative'],
  ['Footer dark', getComputedStyle(document.querySelector('footer')).backgroundColor === 'rgb(15, 15, 14)'],
  ['Footer phone yellow', (() => {
    const a = document.querySelector('footer .footer-contact-phone a');
    return a && getComputedStyle(a).color === 'rgb(226, 215, 0)';
  })()],
  ['Magazine opacity 1', getComputedStyle(document.querySelector('.fr-magazine')).opacity === '1']
];
console.table(tests);
```

## Lesson do zapisania (post-v1.4)

**Lekcja**: System IdoBooking ukrywa `.iai-search` poprzez `position: absolute; left: -9999px` (NIE tylko `display: none`). Każdy override musi pokrywać wszystkie 6 properties:
1. `display: block !important`
2. `visibility: visible !important`
3. `opacity: 1 !important`
4. `position: relative !important`
5. `left: auto !important`
6. `transform: none !important`

Plus parent (`.index-info`) ma to samo. Lesson `lessons/idobooking-iai-search-offscreen-tarpit.md` do zapisania w nowej sesji.

## Co dalej

- v1.4 wklejenie + zwrotka
- Live verify smoke test (sekcja powyżej)
- v1.5 (jeśli zostaną drobne polerowania)
