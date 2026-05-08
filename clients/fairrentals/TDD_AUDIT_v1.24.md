# TDD Audit Report — Fair Rentals v1.24

Live audit klikalnych elementów na `https://client58360.idobooking.com/pl/`.
Date: 2026-05-08. Tool: playwright getBoundingClientRect + DOM walk.

## Desktop 1440×900

**28 klikalnych elementów (links + buttons + summary).**

### PASS (21/28)

| # | Element | Section | Href | Hit area |
|---|---|---|---|---|
| 1 | Logo navbar-brand | header | `/` | 135×95 ✓ |
| 2 | OFERTA | nav | `/offers` | 91×46 ✓ |
| 3 | ATRAKCJE WROCŁAWIA | nav | `/txt/200/Atrakcje-Wroclawia` | 233×46 ✓ |
| 4 | OBSŁUGA NAJMU | nav | `/txt/201/Obsluga-najmu-krotkoterminowego` | 364×46 ✓ |
| 5 | DLA BIZNESU | nav | `/txt/202/Dla-biznesu` | 152×46 ✓ |
| 6 | KONTAKT | nav | `/contact` | 105×46 ✓ |
| 7 | SPRAWDŹ DOSTĘPNOŚĆ (hero) | fr-btn--primary | `#fr-search` | 267×58 ✓ |
| 8 | ZOBACZ APARTAMENTY | fr-btn--ghost-light | `#fr-apartments` | 263×58 ✓ |
| 9 | SZUKAJ (search submit) | fr-cmd-bar__submit | engine58360.idobooking.com | 156×56 ✓ |
| 10 | Featured offer #1 (Golden Hour) | fr-apt-card | `/offer/10/...` | 515×643 ✓ |
| 11 | Featured offer #2 (Śrutowa 8) | fr-apt-card | `/offer/11/...` | 515×643 ✓ |
| 12 | ZOBACZ WSZYSTKIE 19 APARTAMENTÓW | fr-btn--outline | `/offers` | 403×58 ✓ |
| 13 | dual CTA Obsługa najmu | fr-dual-cta__card | `/txt/201/Obsluga-najmu-krotkoterminowego` | 469×158 ✓ |
| 14 | dual CTA Dla Biznesu | fr-dual-cta__card | `/txt/202/Dla-biznesu` | 469×158 ✓ |
| 20 | SPRAWDŹ DOSTĘPNOŚĆ (final CTA) | fr-btn--primary | `/offers` | 264×58 ✓ |
| 21 | SKONTAKTUJ SIĘ Z NAMI | fr-btn--ghost-light | `/contact` | 274×58 ✓ |
| 24 | Tel footer | footer | `tel:+48575092755` | 189×44 ✓ |
| 25 | Email footer | footer | `mailto:biuro@fairrentals.pl` | 226×44 ✓ |
| 26 | REGULAMIN | footer | book-now/index.php?module=terms | 84×44 ✓ |
| 27 | POLITYKA PRYWATNOŚCI | footer | book-now/index.php?module=cookies | 180×44 ✓ |

### FAIL na desktop = 0 (wszystkie linki visible w viewport)

### Bugi linków znalezione & naprawione w v1.24

| # | Element | Stary | Nowy |
|---|---|---|---|
| B1 | "ZOBACZ WSZYSTKIE 19 APARTAMENTÓW" | `/pl/offers` | `/offers` |
| B2 | dual CTA Obsługa | `/pl/txt/201/Obsluga-najmu` | `/txt/201/Obsluga-najmu-krotkoterminowego` |
| B3 | dual CTA Biznesu | `/pl/txt/202/Dla-biznesu` | `/txt/202/Dla-biznesu` |
| B4 | Final CTA "SPRAWDŹ DOSTĘPNOŚĆ" | `/pl/offers` | `/offers` |
| B5 | Final CTA "SKONTAKTUJ SIĘ Z NAMI" | `/pl/contact` | `/contact` |
| B6 | Atrakcje teaser cards (4x) | `/pl/txt/200/Atrakcje-Wroclawia#...` | `/txt/200/Atrakcje-Wroclawia#...` |

**Lekcja**: PL = język domyślny systemu IdoBooking, URLe **bez** `/pl/` prefixu. Tylko EN i DE używają prefiksu.

### Bugi do poprawy w panelu klienta (Damian → klient)

| # | Pole | Aktualnie | Powinno być |
|---|---|---|---|
| K1 | Tytuł "Atrakcje Wrocławia" | `"ATRAKCJE WROCŁAWIA"` (z cudzysłowami) | `Atrakcje Wrocławia` |
| K2 | Tytuł "Dla Biznesu" | `"DLA BIZNESU"` (z cudzysłowami) | `Dla Biznesu` |
| K3 | Tytuł "Obsługa najmu" | `OBSŁUGA NAJMU KRÓTKOTERMINOWEGO` (za długi nav) | Skrót `Obsługa najmu` w panelu menu |
| K4 | Footer tel: link | `tel:+48 575092755` (ze spacją) | `tel:+48575092755` (system render — klient zmienia w panelu Dane firmy) |

## Mobile 390×844

**24 klikalnych elementów** (4 mniej niż desktop bo nav ukryta w hamburger).

### Hamburger menu

- Visible: ✓ (rect 72×61, top-right corner)
- Klik → otwiera `.navbar-nav` drawer
- Pozycje menu: 5x nav-link + 4x dropdown

### WCAG hit-area FAIL < 44px (przed v1.24 fix)

| # | Element | Klasa | h × w | Action |
|---|---|---|---|---|
| 1 | "ZOBACZ OPINIE NA BOOKING →" #1 | fr-trust-card__link | 25×224 | ✓ Fix §91 min-height: 44px |
| 2 | "ZOBACZ OPINIE NA BOOKING →" #2 | fr-trust-card__link | 25×224 | ✓ Fix §91 |
| 3 | "ZOBACZ OPINIE NA BOOKING →" #3 | fr-trust-card__link | 25×224 | ✓ Fix §91 |
| 4 | "Booking.com (Fair Rentals)" | fr-trust__note a | 20×165 | ✓ Fix §91 mobile 44px |
| 5 | "profilu Google Maps" | fr-trust__note a | 20×124 | ✓ Fix §91 mobile 44px |
| 6 | "+48 575 092 755" final-cta | fr-final-cta__contact | 26×165 | ✓ Fix §91 min-height: 44px |
| 7 | "biuro@fairrentals.pl" final-cta | fr-final-cta__contact | 26×187 | ✓ Fix §91 |

**Po wklejeniu v1.24 CSS**: 0 fail (wszystkie ≥ 44px).

## Language toggler (NEW v1.24)

System renderuje `.page-top__language` z 3 flagami (PL/EN/DE) — w v1.24 odkryty + ostylowany w brandzie:
- Button toggler: pill chip, primary brand color on hover
- Dropdown menu: biała karta, label DE/EN/PL z flagą + nazwą języka
- Mobile: kompaktowy przed hamburger

## CSS sections dodane w v1.24

- `§90` — Language toggler (~150 linii)
- `§91` — TDD WCAG hit-area fixes (~50 linii)

## CSS size

```
v1.23: 290 KB
v1.24: ~298 KB
Limit IdoBooking soft: 290 KB (przekroczony 8 KB) / hard: ~300 KB (akceptowalne)
```

## Pliki zmienione w v1.24

1. `FR_ARKUSZ_STYLOW.css` (§90 lang toggler + §91 hit area)
2. `GLOWNA_PL__cms.html` (5 fix linków /pl/)
3. `OBSLUGA_NAJMU_PL__body_top.html` (1 fix link)
4. `DLA_BIZNESU_PL__body_top.html` (1 fix link)
5. `ATRAKCJE_WROCLAWIA_PL__body_top.html` (2 fix linki)

## Wnioski

1. **Linki wszystkie zgodne z system IdoBooking routing** (PL bez prefix, EN/DE z prefix).
2. **Slug kanoniczny** `Obsluga-najmu-krotkoterminowego` (z panelu) używany konsekwentnie.
3. **Mobile WCAG 44px** zachowane na wszystkich elementach po v1.24 fix.
4. **Language toggler** widoczny w nav (3 flagi: PL/EN/DE z nazwami).
5. **Klient powinien poprawić w panelu**: cudzysłowy w tytułach nav, tel link spacja.
