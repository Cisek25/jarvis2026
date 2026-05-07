# Fair Rentals — Release Notes v1.3

**Wersja**: v1.3 — system search widget zamiast custom + hero shrink 70vh
**Data**: 2026-05-07
**Bazuje na**: v1.2

## Powód iteracji (feedback Damiana po v1.2)

Damian, screenshoty:
1. Wyszukiwarka za nisko (pod hero asym 100vh, niewidoczna w viewport bez skrolowania)
2. Widać kawałki systemowej w tle przy zmienionym hero (niespójność)
3. **"Ma być normalnie automatyczne systemowe"** — usuń custom, użyj natywnego widget IdoBooking

## Diagnoza (playwright na live URL)

System renderuje widget IdoBooking wewnątrz `.section.parallax .fp-tableCell .index-info > .iai-search`:
- Form `#iai_book_form` z polami: `iai_booking_location`, `iai_booking_date_from`, `iai_booking_date_to`, `iai_booking_persons`, submit
- Aktualnie ukryty CSS-em (`display: none`) — relikt instinct 037 z poprzednich klientów
- Action: `engine58360.idobooking.com/widget/index.php` (ten sam endpoint co custom)

Custom `.fr-search-banner` (z v1.2) siedzi pod hero — sytuacja gdy użytkownik nie widzi obu searcherów, albo skrolując widzi 2 (custom + odkryty system).

## Zmiany v1.3

### A. Usuń custom `.fr-search-banner`

**HTML**:
- `GLOWNA_PL__cms.html`: usunięta cała sekcja `<section class="fr-search-banner" id="fr-search">...</section>` (~38 linii)
- Hero asym CTA "Sprawdź dostępność" — anchor zmieniony z `#fr-search` na `/pl/offers` (gdzie i tak pokazuje się natywny searcher + listing)
- `GLOWNA_EN__cms.html`: analog (anchor → `/en/offers`)

**CSS**: dodatkowa reguła hide na wypadek leftover w cache:
```css
html body section.fr-search-banner { display: none !important; }
```

### B. Skróć hero asym do 70vh

```css
.fr-hero-asym { min-height: 70vh; }      /* było 100vh */
.fr-hero-asym__media { min-height: 70vh; } /* było 100vh */
```

Powód: system widget natural flow jest **w tej samej `.fp-tableCell` co `.fr-hero-wrap`** (po teleportacji JS). Skrócenie hero powoduje że searcher widget jest widoczny w viewport razem z dolnym fragmentem hero photo.

Mobile (`@991`): hero asym `min-height: auto` — text + photo stack vertical.

### C. Odkryj + style systemowy widget (sekcja §72 CSS)

```css
html body.page-index .iai-search,
html body.page-index .iai_frontpage,
html body.page-index #iai_book_form,
html body.page-index .index-info {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

Plus brand styling:
- Biała karta `.iai-search` w `max-width: 1100px`, padding clamp(20-32px), shadow-lg
- `::before` pseudo z tytułem "Sprawdź dostępność" (DM Serif italic 22px)
- Form grid `1fr 1fr 1fr 0.85fr auto` (location, dateFrom, dateTo, persons, submit)
- Inputs: 48px height, font 14px, cream bg, brand focus outline
- Submit button: żółty primary (`#E2D700`), uppercase 12px letter-spacing 1.4
- Mobile @991: 2-col grid, submit span 2; @480: 1-col

### D. Override `instinct 037` dla Fair Rentals

Instinct 037 mówił: ukryj `.cmshotspot` + system searchers (`.iai-search`) na page-index. Dla Fair Rentals **odwracam** dla searcher (zostawiam ukryte tylko `.cmshotspot` slick — bo go parsujemy via Pattern A). To jest **świadoma decyzja klienta** — nie regresja. Dokumentowane jako lesson `lessons/idobooking-system-search-on-vs-custom.md` (do zapisania w follow-up).

## Walidacja v1.3

```
CSS:  223 KB / 290 KB (z marginesem)
SEO:  8/8 PASS · 0 critical
UX:   11 PASS · 7 warnings · 19 critical (false positives — białe na ciemnych: magazine + stats-asym hero + trust bar + final-cta + fr-search-banner residue CSS)
```

UX-020 19× to nadal cascade-blind walidator — sekcje dark mają biały tekst. Live audit potwierdzi WCAG AAA.

## Pliki zmienione w v1.3

| Plik | v1.2 | v1.3 | Zmiana |
|---|---|---|---|
| `FR_ARKUSZ_STYLOW.css` | 217 KB | 223 KB | +6 KB (sekcja §72 system search show + style) |
| `GLOWNA_PL__cms.html` | 20 KB | 18 KB | -2 KB (usunięta sekcja `.fr-search-banner`) |
| `GLOWNA_EN__cms.html` | 20 KB | 18 KB | -2 KB |

## Co Damian musi zrobić

**Wymień 3 pliki + hard refresh**:
1. `FR_ARKUSZ_STYLOW.css` — Wygląd → Arkusz stylów
2. `GLOWNA_PL__cms.html` — Strona główna PL → Treść
3. `GLOWNA_EN__cms.html` — Strona główna EN → Treść

**Sprawdź na live**:
- [ ] Hero asym ma 70vh wysokości (krótszy niż wcześniej)
- [ ] Pod hero **systemowy widget IdoBooking** jest widoczny: lokalizacja + Przyjazd + Wyjazd + Goście + przycisk
- [ ] Widget styling spójny z brand: biała karta, żółty submit button, brand focus outline
- [ ] Klik "Sprawdź dostępność" w hero przenosi na `/pl/offers`
- [ ] Klik "Zobacz apartamenty" przewija do sekcji featured
- [ ] **Brak custom `.fr-search-banner`** sekcji (pod hero teraz tylko system searcher)
- [ ] Submit form → redirect do `engine58360.idobooking.com/widget/index.php` z dateFrom/dateTo/persons-adult parametrami

## Known limitations v1.3

- System widget IdoBooking ma własny datepicker overlay (nie Litepicker — innym JS-em). Reactive UX może różnić się od custom z v1.2
- Pole `iai_booking_location` to dropdown miasta/dzielnicy (z system locations.js) — wymaga że klient ma poprawnie skonfigurowane lokalizacje w panelu IdoBooking
- Po podmianie templatu IdoSell w przyszłości (np. `default14`) reguły CSS mogą wymagać aktualizacji (ID selektorów `.iai-*` mogą się zmienić)
- Pole "Goście" w widget może być text input zamiast select (system controls) — styling go obejmuje, ale UX jest różny od select dropdownu

## Co dalej

- v1.3 wklejenie + zwrotka
- Live verify: chrome-devtools smoke test po wklejeniu (sekcja 9 z TESTING_STRATEGY)
- Lessons learned: `instinct 037 update` — dla Fair Rentals system search jest VISIBLE; dla SA/AP HIDDEN. Decyzja per-klient.
