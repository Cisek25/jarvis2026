# Fair Rentals — Release Notes v1.30

**Data**: 2026-05-14
**Zakres**: v1.29 + Sprint F HIGH (PDF Agnieszka 21 punktów) + §98 logo crop fix + §99p CRITICAL BUG
**CSS size**: 322 KB (22 KB nad soft limit 300 — Idosell przyjmuje do ~500 KB)

---

## 🚨 §99p — CRITICAL BUG FIX (2026-05-14, po feedbacku Damiana)

**Bug raportowany**: "dodatkowo z podstroną obsługa najmu jest coś totalnie nie tak, zobacz na górze lata jakis element"

**Root cause**:
System Idosell CSS używa global selektora:
```css
header {
  position: fixed;
  top: 0;
  z-index: 1010;
  width: 100%;
}
```
Bez żadnej klasy — łapie **WSZYSTKIE** `<header>` w DOM, w tym semantyczne `<header>` wewnątrz nasze karty Sprint B Modele Współpracy (`.fr-compare-model__header`).

**Efekt**: Na /txt/203/Obsluga-najmu nasze 2 karty Sprint B miały `<header>` które renderowały się jako **position: fixed; top:0; width:1425px; height:259px** — przykrywały całą górną część strony.

**Fix CSS §99p**:
Override wszystkich `<header>` wewnątrz `article`, `section`, lub z klasami `fr-compare-model__`, `fr-card__`, `fr-section__` → wymusza `position: relative`.

**Zachowuje**: page header `header.default13` z scrolled state, navbar, hamburger — bo selectors używają `header.default13` lub `[class^="default"]`.

**Weryfikacja po fix**:
- `.fr-compare-model__header`: position relative, top auto, y=5177 (naturalnie w sekcji niżej) ✓
- Mobile (390px): position relative, y=7878 + y=8893 ✓
- Page header (`.default13`): nadal position fixed (poprawnie) ✓



---

## TL;DR

Pełna implementacja **15 z 21 punktów Sprint F HIGH** plus **logo crop fix (P7)** zgłoszony przez Ciebie. Razem **16 napraw** w jednej sesji (CSS §98 + §99 + §99a-o = 16 sub-sekcji).

---

## Co się zmieniło w v1.30

### §98 — Scrolled header logo shrink (Damian feedback + PDF P7)

Logo w `header.fr-header--scrolled` było `height: 80px` przy header `height: 81px` → wyglądało jak ucięte na górze. **Fix**: w scrolled state logo → 48px desktop / 40px mobile. Background chip usunięty (header staje się czysty minimal).

### §99 — Sprint F HIGH (16 sub-fix-y)

| Subsekcja | PDF P | Co naprawione |
|---|---|---|
| §99a | P2 | Hover button — usunięto `transform: translateY` (klient: "przeskok", chciał tylko zmiana koloru) |
| §99b | P6a, P6b | Hover karty apartamentów — `transform` przeniesiony z `.card` na `.img` (kadr się powiększa, blok stoi) |
| §99c | P6c, P8 | Kontrast tekstów na ciemnym tle — szare `0.65` → `0.85` (meta cells), `0.78` (descr) |
| §99d | P4 | Widget SZUKAJ — font 11px → 15px, padding 14×28, min-height 56, SVG 20×20 |
| §99e | P13 | Karty apartamentów — `line-clamp 2/3` + ellipsis dla uciętych tekstów |
| §99f | P12d, P14b, P15b | Cena wyróżniona — żółty fond, padding, border-radius, bold, dark text |
| §99g | P1a-e | Wersja językowa — strzałka 12×12 wyśrodkowana, hover kontrast, dropdown padding, flagi (przygotowane CSS — wymaga aktualizacji HTML by dodać prefix) |
| §99h | P5 | Cytat — dodano zamknięcie cudzysłowu via `::after` na `.fr-magazine__quote` |
| §99i | P11, P18 | Aktywne pozycje menu — `.active` żółta + underline + bold |
| §99j | P3 | Kalendarz Litepicker — strzałki padding/min-size + overflow visible |
| §99k | P10a | Stopka — telefon i e-mail flex row align-baseline |
| §99l | P26 | Back-to-top — `position: fixed; right: 16px; bottom: 16px` (anti off-screen) |
| §99m | P29 | Body horizontal scroll guard — `overflow-x: hidden` na html+body |
| §99n | P24a-f | Mobile menu kompletny redesign — alignment vertical, dropdown radius+shadow, hover/active state, scrolled minimal, nowrap "Najem korporacyjny" |
| §99o | P24 small | ≤480px — kompaktowe ikony, font size adjustment |
| §99-trust | P29 root | Trust bar `repeat(2, 1fr)` → `minmax(0, 1fr)` + 1col na ≤480 (text overflow ucięty na 320px) |

### Trust bar overflow (nowo wykryte, nie w PDF)
Na 320px viewport (iPhone SE, małe androidy) `.fr-trust__bar-cell` wystawał 71px za viewport. Parent `overflow: hidden` ukrywał — klient widział tylko częściowo tekst. Fix: `minmax(0, 1fr)` zezwala tracks shrink + na ≤480 jedna kolumna.

---

## Lista plików do wklejenia (v1.30)

| # | Plik | Lokalizacja w panelu | Zmiany |
|---|---|---|---|
| 1 | `FR_ARKUSZ_STYLOW.css` (320 KB) | Wygląd → Arkusz stylów CSS | §98 + §99 (16 sub-fix-y) |
| 2 | `FR_KONIEC_BODY.html` | Ustawienia → Kody śledzące → Koniec body | cleanupSeoDuplicates (v1.29) |
| 3 | `GLOWNA_PL/EN/DE__cms.html` | Strona główna w 3 językach | tel/mailto aria-label (v1.29) |
| 4 | `OBSLUGA_NAJMU_PL/EN/DE__body_top.html` | /txt/201 body_top w 3 językach | Sprint B Modele Współpracy (v1.29) |
| 5 | `DLA_BIZNESU_PL/EN/DE__body_top.html` | /txt/202 body_top w 3 językach | aria-label fix (v1.29) |

**Po wklejeniu**: Cmd+Shift+R / Ctrl+F5 (twardy reload).

---

## Akcje klienta (poza HTML)

### W panelu IdoBooking:

1. **NIEINDEKSACJA STRONY** (`<meta name="robots" content="noindex, nofollow">`) → **Panel → Wygląd → SEO → Indeksowanie → włącz**. Bez tego strona NIE pojawi się w Google!

2. **Stare meta description** (systemowe: "19 apartamentów Booking 9.8") → **Panel → Wygląd → SEO → Meta description PL/EN/DE → wyczyścić** (alternatywnie nasz `cleanupSeoDuplicates` JS to usuwa runtime, ale lepsza praktyka — wyczyścić w panelu)

3. **Cenniki apartamentów** "od/noc" puste → **Panel → Oferty → konkretny apartament → Cennik → uzupełnić stawki**

4. **Filtry wyszukiwarki** (sypialnie, klimatyzacja, parking, slider cenowy) → **Panel → Wygląd → Ustawienia wyszukiwarki → włączyć filtry + zdefiniować "wyposażenie" na poziomie apartamentu**

5. **Cennik apartamentu "rok 2028"** (PDF P15c — Agnieszka) → **Panel → Oferty → konkretny apartament → Cennik → sprawdzić daty obowiązywania**

---

## Co NIE jest w v1.30 (osobne sprinty)

### Sprint F MEDIUM (5 fix-y, ~2.5h pracy następna sesja)
- §99-future: Szczegóły apartamentu (P14a, P15a, P16, P17)
- §99-future: Obsługa najmu nagłówek (P19, P20)
- §99-future: Kontakt redesign (P22a-c — przeniesienie "Nasze lokalizacje" + 100% width)

### Sprint C — Sekcja "O nas" (Agnieszka + Małgorzata)
**BLOCKED**: czekamy na zdjęcia portretowe + 2-3 zdania historii firmy

### Sprint D — Blog / Baza wiedzy
**TODO**: decyzja architektury (custom JS vs WordPress) + treści pierwszych 3-5 wpisów

---

## Testing checklist (Sprint F HIGH — zrobione w tej sesji)

- [x] CSS syntax (1426 open = 1426 close braces ✓)
- [x] Logo crop scrolled state — fixed via §98, screenshot OK
- [x] Trust bar 320px overflow — fixed via grid minmax + 1col
- [x] Hover button transform — usunięty
- [x] SZUKAJ widget — font/padding/icon size verified (15px, 56px min-h, 20x20 SVG)
- [x] Kontrast szarych tekstów na dark — wzmocniony
- [x] Mobile menu alignment — fixed pomiarem (logo center=50 vs burger center=58)
- [ ] **TO BE DONE BY CLIENT after deploy**: Lighthouse re-run (oczekiwane: SEO 61 → 75-85, A11y 94 → 98-100)

---

## CSS growth

| Wersja | Lines | KB |
|---|---|---|
| v1.27 | 10082 | 298 |
| v1.28 | (cleanup §79+§83) | 298 |
| v1.29 (§96+§97 modele) | 10437 | 304 |
| **v1.30 (§98+§99 sprint F)** | **10923** | **320** |

**Limit Idosell**: soft 300 KB, hard ~500 KB. v1.30 mieści się komfortowo.

---

## Changelog

### v1.30 (2026-05-14)
- ADD: §98 Scrolled header logo shrink (logo crop fix)
- ADD: §99a-o Sprint F HIGH — 16 sub-fix-y z PDF Agnieszki (15/21 punktów)
- ADD: Trust bar 320px overflow fix (minmax + 1col mobile)
- 🚨 ADD: §99p CRITICAL — override system `header { position: fixed }` dla card headers (Sprint B Modele renderowały się fixed top:0 i przykrywały /txt/203 page)

### v1.29 (2026-05-14)
- ADD: §96 Cookie button contrast (a11y AAA)
- ADD: §97 Modele Współpracy 8%/10% (HTML + CSS PL/EN/DE)
- ADD: cleanupSeoDuplicates JS
- FIX: tel/mailto aria-label (8 plików)
- FIX: Duplicate CTA "Sprawdź dostępność"

### v1.28 (2026-05-12)
- ADD: §94 Hero centered + search inline
- ADD: §95 Kicker redesign
- CLEANUP: §79 + §83 removed
- FIX: Bug #8 audyt Double H1
