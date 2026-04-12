# IdoSell Design System — Referencja

## Palety Kolorów

### A) Nature (pensjonaty, eko, góry)
```css
--color-primary: #4A6741;    /* mech */
--color-secondary: #8B7355;  /* drewno */
--color-accent: #A8B89C;     /* szałwia */
--color-bg: #F5F1EB;         /* krem */
--color-dark: #2C2C2C;       /* węgiel */
--color-light: #F7F5F0;      /* papier */
```
Użyte w: Najmar (Żywiec), EcoCamping (Spytkowice)

### B) Ocean (nadmorskie, jeziora)
```css
--color-primary: #1B3A5C;    /* ocean */
--color-secondary: #D4A574;  /* piasek */
--color-accent: #87CEEB;     /* niebo */
--color-bg: #F8F6F2;         /* perła */
--color-dark: #1A2332;       /* noc morska */
--color-light: #FFFFFF;      /* biel */
```

### C) Gold Luxury (premium, ville, boutique)
```css
--color-primary: #C8A45C;    /* złoto */
--color-secondary: #8B7355;  /* brąz */
--color-accent: #E8D5A3;     /* jasne złoto */
--color-bg: #1A1A1A;         /* noc (dark theme!) */
--color-dark: #0D0D0D;       /* czerń */
--color-light: #F5F5F0;      /* kość słoniowa */
```
Użyte w: Mazurski Chill, GoldenApartments

### D) Mountain (góry, drewno, kamień)
```css
--color-primary: #6B4226;    /* brąz */
--color-secondary: #8C8C7A;  /* kamień */
--color-accent: #A67B5B;     /* cedr */
--color-bg: #F4F0E8;         /* piaskowiec */
--color-dark: #3D2B1F;       /* ciemne drewno */
--color-light: #FAF8F5;      /* krem */
```

### E) Fresh (nowoczesne, miejskie)
```css
--color-primary: #2E86AB;    /* sky */
--color-secondary: #A4C3B2;  /* mint */
--color-accent: #F6C862;     /* słoneczny */
--color-bg: #FFFFFF;          /* biel */
--color-dark: #2C3E50;       /* grafit */
--color-light: #F7F9FC;      /* lodowy */
```

### F) Warm (agroturystyka, wiejskie)
```css
--color-primary: #C4572A;    /* terakota */
--color-secondary: #7C8C56;  /* oliwka */
--color-accent: #E8B86D;     /* miód */
--color-bg: #FAF5EF;         /* len */
--color-dark: #3A2D23;       /* ziemia */
--color-light: #FDF9F3;      /* mleko */
```

---

## Pary Fontów

### 1. Elegancki Luxury
```
Heading: 'Playfair Display', serif
Body: 'Inter', sans-serif
Google: family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600
```
Charakter: High-end, boutique, ville. Użyte w: Mazurski Chill

### 2. Klasyczny Ciepły
```
Heading: 'Merriweather', serif
Body: 'Inter', sans-serif
Google: family=Merriweather:wght@400;700&family=Inter:wght@300;400;500;600
```
Charakter: Pensjonat, tradycja, zaufanie. Użyte w: Najmar

### 3. Nowoczesna Elegancja
```
Heading: 'DM Serif Display', serif
Body: 'Inter', sans-serif
Google: family=DM+Serif+Display&family=Inter:wght@300;400;500;600
```
Charakter: Współczesny premium, glamping. Użyte w: EcoCamping

### 4. Wyrafinowany Lekki
```
Heading: 'Cormorant Garamond', serif
Body: 'Lato', sans-serif
Google: family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;700
```
Charakter: Subtelny, spa, wellness

### 5. Nowoczesny Czysty
```
Heading: 'Montserrat', sans-serif
Body: 'Open Sans', sans-serif
Google: family=Montserrat:wght@400;600;700&family=Open+Sans:wght@300;400;600
```
Charakter: Miejski, apartamenty, biznesowy

### 6. Tradycyjny Czytelny
```
Heading: 'Libre Baskerville', serif
Body: 'Source Sans 3', sans-serif
Google: family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600
```
Charakter: Dworski, historyczny

### 7. Miękki Przystępny
```
Heading: 'Lora', serif
Body: 'Nunito', sans-serif
Google: family=Lora:wght@400;600;700&family=Nunito:wght@300;400;600
```
Charakter: Rodzinny, camping, agroturystyka

### 8. Monumentalny Premium
```
Heading: 'Cinzel', serif
Body: 'Raleway', sans-serif
Google: family=Cinzel:wght@400;700&family=Raleway:wght@300;400;500;600
```
Charakter: Resort, 5-gwiazdkowy, prestiżowy

---

## Layouty Sekcji Homepage

### A) Hero Fullscreen + Search Bar (Standard)
```
┌─────────────────────────────────────┐
│         SLIDER (100vh)              │
│                                     │
│     H1: "Nazwa Obiektu"            │
│     P: tagline                      │
│                                     │
│   ┌─[Kiedy]──[Kiedy]──[Osoby]──🔍─┐│
│   └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### B) Karty Ofert (3-kolumnowy grid)
```
┌───────────┬───────────┬───────────┐
│  [PHOTO]  │  [PHOTO]  │  [PHOTO]  │
│  Pokój 1  │  Pokój 2  │  Pokój 3  │
│  od XXzł  │  od XXzł  │  od XXzł  │
│ [SZCZEG.] │ [SZCZEG.] │ [SZCZEG.] │
└───────────┴───────────┴───────────┘
```

### C) Features (ikony + tekst)
```
    🏔️              🍳              🅿️              📶
  Lokalizacja      Śniadania       Parking          WiFi
  Opis krótki      Opis krótki     Opis krótki      Opis krótki
```

### D) CTA Full-Width (dark bg)
```
┌─────────────────────────────────────┐
│  "Zarezerwuj pobyt w [BRAND]"       │
│  📞 +48... | ✉️ email@...           │
│  [  ZAREZERWUJ TERAZ  ]             │
└─────────────────────────────────────┘
```

### E) O Nas / Lokalizacja (50/50 split)
```
┌──────────────────┬──────────────────┐
│                  │                  │
│    [ZDJĘCIE]     │  Tekst o nas     │
│                  │  lub opis        │
│                  │  lokalizacji     │
│                  │                  │
└──────────────────┴──────────────────┘
```

---

## Responsive Breakpoints (Standard)

```css
/* Tablet landscape */
@media (max-width: 991px) { }

/* Tablet portrait */
@media (max-width: 767px) { }

/* Mobile */
@media (max-width: 480px) { }
```

### Co zmniejszać per breakpoint:
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| H1 hero | 48-56px | 36-42px | 28-32px |
| H2 section | 36-42px | 28-32px | 24-28px |
| Section padding | 80-100px | 60px | 40px |
| Grid columns | 3 | 2 | 1 |
| Search widget | horizontal | horizontal | vertical stack |
| Hero height | 100vh | 80vh | 70vh |

---

## System Override Colors — HARDCODED HEX

Te elementy NIE akceptują CSS variables. Zawsze wstaw surowy hex:

| Element | Selector | Co zmienić |
|---------|----------|------------|
| Scroll arrow | `#bounce` | `background-color: #HEX` |
| Back to top | `#backTop` | `background: #HEX` |
| Cookie button | `.ck_dsclr__btn_v2` | `background: #HEX` |
| Cookie links | `.ck_dsclr_v2 a` | `color: #HEX` |
| Cookie close | `.ck_dsclr_x_v2` | `color: #HEX` |
| Skip link | `.skip_link` | `background: #HEX` |
| Search button | `.formbutton` | `background: #HEX` |

---

## Wzorce z Ukończonych Projektów

| Projekt | Paleta | Fonty | Prefix | Typ | Uwagi |
|---------|--------|-------|--------|-----|-------|
| GoldenApartments | C (Gold) | ? | ga- | Apartamenty | Slider frozen, search centered |
| Madera Centrum | Custom warm | ? | md- | Sub-brandy | 3 sub-brandy, PL+EN |
| EcoCamping | A (Nature) | 3 (DM Serif) | ec- | Glamping | 50 namiotów, V/2026 |
| Mazurski Chill | C (Gold) | 1 (Playfair) | mc- | Ville | Dark luxury theme |
| Najmar | A (Nature) | 2 (Merriweather) | nj- | Pokoje | B2B landing, Żywiec |

---

## CSS Naming Convention (BEM)

```
.PREFIX-section-name           /* sekcja */
.PREFIX-section-name__element  /* element wewnątrz */
.PREFIX-section-name--modifier /* wariant */

Przykład:
.ec-hero                       /* hero section */
.ec-hero__title                /* tytuł w hero */
.ec-hero__title--light         /* jasna wersja tytułu */
.ec-offers                     /* sekcja ofert */
.ec-offers__card               /* karta oferty */
.ec-offers__card--featured     /* wyróżniona karta */
```

---

## Wikimedia Commons — Bezpieczne Użycie

- URL format: `https://upload.wikimedia.org/wikipedia/commons/thumb/X/XX/Filename/600px-Filename`
- **Max 600px** — większe blokowane przez CDN w kontekście IdoSell
- Zawsze sprawdź licencję (CC BY-SA, CC0, Public Domain)
- Preferuj: zdjęcia klienta z panelu > Wikimedia > stock

---

## Quick Start — Nowy Projekt

```
1. Skopiuj _MASTER_TEMPLATE/ do nowego folderu
2. Wypełnij BRIEF_TEMPLATE.md
3. Zamień placeholdery w TEMPLATE_ARKUSZ_STYLOW.css:
   [PREFIX] → ec-
   [COLOR_1] → #2D5016
   [COLOR_2] → #8B7355
   [COLOR_3] → #A8B89C
   [COLOR_BG] → #F5F1EB
   [COLOR_DARK] → #2C2C2C
   [FONT_HEAD] → 'DM Serif Display', serif
   [FONT_BODY] → 'Inter', sans-serif
   [HEADER_H] → 95
4. Zamień [FONT_HEAD_URL] i [FONT_BODY_URL] w HEAD.html
5. Zbuduj homepage CMS i podstrony
6. Uruchom testy na KAŻDEJ stronie
7. Wypełnij INSTRUKCJA.txt
```
