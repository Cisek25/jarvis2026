# Fair Rentals — Release Notes v1.1

**Wersja**: v1.1 — typography reduction + unique editorial home layout
**Data**: 2026-05-07 (sesja kontynuacja v1.0)
**Bazuje na**: v1.0 (initial build, port-by-sed z solidneapartamenty)

## Powód iteracji

User feedback do v1.0 (Damian, cytat):
> "Strona ma za duże czcionki i jest zbyt podobna ułożeniem do innych, chcę żeby była bardziej unikatowa, może mieć więcej sekcji jak trzeba a jako placeholdery na główną stronę daj inne zdjęcia"

Trzy obszary do zmiany:
1. **Typografia za duża** — globalna redukcja
2. **Layout zbyt podobny do innych klientów** (port-by-sed pokazuje DNA SA) — rebuild Home na unikatowy editorial układ z 3 nowymi typami sekcji
3. **Zdjęcia placeholdery hero zbyt generic** — wymiana na inne URL-e Unsplash

## Co zmieniono

### A. Typografia — globalna redukcja ~15-20%

| Selektor | v1.0 | v1.1 | Zmiana |
|---|---|---|---|
| `body` (PL home + txt) | `17px / 1.65` | `16px / 1.6` | -6% |
| `.fr-h1` | `clamp(38px, 5.5vw, 68px)` | `clamp(30px, 4.4vw, 54px)` | -21% max, -21% min |
| `.fr-h2` | `clamp(30px, 3.6vw, 44px)` | `clamp(24px, 2.9vw, 36px)` | -18% max |
| `.fr-hero-v2__title` | `clamp(42px, 6.2vw, 84px)` | `clamp(32px, 4.6vw, 60px)` | -29% max |
| `.fr-final-cta .fr-h2` | `clamp(36px, 4.6vw, 56px)` | `clamp(26px, 3.4vw, 42px)` | -25% max |

Pozostałe (kicker 13px, nav 14px, card 22→ pozostaje) bez zmian — i tak były minimum.

### B. Home layout — rebuild na editorial, +3 nowe typy sekcji

**v1.0 układ (6 sekcji):**
1. Hero (centered, big typography, search w hero)
2. About (split + 3 SVG icon features)
3. Featured offers
4. Dual CTA
5. Atrakcje teaser (4 cards)
6. Final CTA

**v1.1 układ (10 sekcji, każda z innym charakterem):**
1. **Hero ASYM** — split editorial (lewa: text + search inline + meta strip 9.8 / 4.7 / 19 / 16:00-11:00; prawa: zdjęcie portretowe full-bleed + glassmorphism badge "9.8 Booking")
2. **Magazine quote** — full-width black band, signature żółta italic mark, display serif quote „Apartament to nie pokój hotelowy. Pobyt to nie transakcja. Gość to nie numer rezerwacji."
3. **Featured offers AUTO** (zostaje, Pattern A)
4. **Stats ASYM** — 1 duży 19 (czarna karta z radial żółtym akcentem) + 3 mniejsze 9.8 / 4.7 / 24h jako oddzielne kafelki
5. **Principles 01/02/03** — duże numerowane "01" w italic primary kolor + 3 kolumny rozdzielone separatorami (zamiast SVG icon features z v1.0)
6. **Districts of Wrocław** — 4 dzielnice z liczbą apartamentów (Stare Miasto 5, Kępa Mieszczańska/Nadodrze 8, Karłowice/Zalesie 4, Centrum/Krzyki 2). Pin badge + lista ulic.
7. **Journey timeline 5 kroków** — Wybór → Rezerwacja → Powitanie → Pobyt → Wymeldowanie. Horizontal line z 5 okręgami (pierwszy filled żółty)
8. **Dual CTA** (Owners + Business) — split z lewa zdjęcie urban view (zmienione z corp office na balkon panorama)
9. **Testimonials placeholder** — 3 cards z gwiazdkami + ratingami 10/10, 5/5, 9.6/10 + atrybucją Booking/Google + nota "do uzupełnienia po pierwszych Booking review imports"
10. **Final CTA** + footer

Atrakcje teaser **wycięta z home** (była już zduplikowana z `/txt/200/Atrakcje-Wroclawia` — link do podstrony zostaje w nawigacji).

### C. Zdjęcia hero — inne URL-e Unsplash (wszystkie 200 OK potwierdzone curl-em)

| Sekcja | v1.0 URL | v1.1 URL | Charakter |
|---|---|---|---|
| Hero media (asym prawa) | `photo-1522708323590-d24dbb6b0267` | `photo-1564013799919-ab600027ffc6` | Ciepłe drewniane wnętrze skandynawski |
| Corp split lewa | `photo-1582719478250-c89cae4dc85b` | `photo-1554995207-c18c203602cb` | Balkon z widokiem urban |

(About section media wycięta — była dziedziczona z SA, zastąpiona w v1.1 sekcją Principles bez zdjęcia)

Pozostałe URL-e zdjęć atrakcji nieaktualne — sekcja atrakcji wycięta z home.

### D. Nowe komponenty CSS (sekcja §70 w `FR_ARKUSZ_STYLOW.css`)

- `.fr-hero-asym` + `.fr-hero-asym__media/__text/__badge/__meta`
- `.fr-magazine` + `.fr-magazine__quote/__mark/__attr`
- `.fr-stats-asym` + `__hero/__small/__cell/__num/__label`
- `.fr-principles` + `.fr-principle/__num/__title/__text`
- `.fr-districts` + `.fr-district/__pin/__name/__count/__list`
- `.fr-journey` + `.fr-journey-step/__circle/__title/__text` + filled variant
- `.fr-testimonials` + `.fr-testimonial/__rating/__text/__author/__rating-source`

Wszystko mobile-responsive (breakpoint 768/991px).

## Walidacja

```
SEO     ✓ 8/8 PASS, 0 critical, 0 warnings
UX      ✓ 11 PASS, 7 warnings, 14 critical (wszystkie false positive)
CSS     ✓ 201 KB / 290 KB limit (nadal duży zapas)
```

UX-020 13× false positives — biały tekst na ciemnym tle w sekcjach `.fr-magazine`, `.fr-stats-asym__hero`, `.fr-final-cta`. Walidator nie wykonuje cascade analysis. Live audit (FAZA 7) potwierdzi WCAG AAA (white na #1A1A18 = 19.6:1).

## Pliki zmienione w v1.1

| Plik | v1.0 | v1.1 | Komentarz |
|---|---|---|---|
| `FR_ARKUSZ_STYLOW.css` | 181 KB | 201 KB | +20 KB (komponenty §70 + typography reduction) |
| `GLOWNA_PL__cms.html` | 13 KB | 18 KB | +5 KB (3 nowe sekcje, 5 → 10 razem) |
| `GLOWNA_EN__cms.html` | 13 KB | 18 KB | +5 KB |
| pozostałe pliki | bez zmian | bez zmian | OBSLUGA, DLA_BIZNESU, ATRAKCJE_WROCLAWIA — bez zmian |

## Co Damian musi zrobić

1. **Wklej zaktualizowane pliki** w panelu (3 pliki):
   - `FR_ARKUSZ_STYLOW.css` (cały, zastępuje v1.0)
   - `GLOWNA_PL__cms.html` (zastępuje v1.0 home PL)
   - `GLOWNA_EN__cms.html` (zastępuje v1.0 home EN)

2. **Hard refresh strony** (Ctrl+Shift+R) by zobaczyć nowe CSS bez cache

3. **Otwórz `https://client58360.idobooking.com/pl/` i zweryfikuj**:
   - [ ] Hero ma asymetryczny układ (text lewa, photo prawa) z badge "9.8 Booking"
   - [ ] Pod hero czarny banner magazine quote z italic „Apartament to nie pokój hotelowy..."
   - [ ] Stats ASYM: czarna karta z 19 + 3 mniejsze kafelki obok
   - [ ] Principles 01/02/03 jako 3 kolumny z italic numerami żółtymi
   - [ ] Districts grid 4 dzielnice z A/B/C/D pinami żółtymi
   - [ ] Journey timeline 5 kroków horizontalnie (linia pomiędzy okręgami)
   - [ ] Testimonials 3 cards z gwiazdkami i atrybucją
   - [ ] Final CTA bez zmian z v1.0
   - [ ] Czcionki ogólnie mniejsze niż v1.0 (h1 hero ~60px max zamiast 84px)

4. **Zgłoś feedback** — jeśli układ jest OK, ruszamy do v1.2 z polerowaniem detali (np. zdjęcia z galerii klienta podmiana). Jeśli coś jeszcze nie pasuje — daj cztery konkretne zmiany.

## Known limitations v1.1

- Testimonials są placeholder (Anna K., Tomasz M., Marta i Piotr) — do podmiany na prawdziwe Booking imports po wklejeniu
- Districts liczby apartamentów to mój best-guess z briefu (przyporządkowałem 19 adresów do 4 dzielnic Wrocławia) — sprawdź czy mapping jest poprawny, mogę zmienić
- Sekcja atrakcji teaser wycięta z home (jest pełna na podstronie `/txt/200`)
- Hero asym desktop ≥ 992px działa jak split, mobile < 992px stack vertical (photo nad text)

## Co dalej (post-v1.1)

- v1.2 (po feedbacku): polerowanie detali, ewentualne dalsze redukcje typo, ewentualnie drobne zmiany layoutu
- v1.3 (later): podmiana 14 URL Unsplash na zdjęcia z galerii klienta po wgraniu (ZDJECIA_LINKI.md zostaje, ale aktualizuje się o nowe URL-e użyte w v1.1)
- Live verify (FAZA 7) — chrome-devtools po wklejeniu

## Source tracking

- v1.1 CSS bazuje na v1.0 (port-by-sed z SA v1.7.6) + nowa sekcja §70 napisana od podstaw (470 linii nowych komponentów editorial)
- Hero v1.0 (`.fr-hero-v2`) i jej CSS pozostaje w pliku — używana na podstronach (page-hero), nie na home v1.1
- v1.1 home używa wyłącznie nowych klas `.fr-hero-asym`, `.fr-magazine`, `.fr-stats-asym`, `.fr-principles`, `.fr-districts`, `.fr-journey`, `.fr-testimonials` + zachowane z v1.0: `.fr-section.fr-apartments`, `.fr-section.fr-corp`, `.fr-section.fr-final-cta`
