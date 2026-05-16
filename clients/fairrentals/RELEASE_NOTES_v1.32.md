# Fair Rentals — Release Notes v1.32

**Data**: 2026-05-15
**Zakres**: Sprint C — Sekcja "O nas" (PL + EN + DE)
**CSS size**: 356 KB (12005 linii, 1542 braces ✓)

---

## TL;DR

Pełna podstrona **"O nas"** (`/txt/[ID]/o-nas`) z hero, historią firmy, 4 wartościami, 2 portretami zespołu, 4 statystykami i CTA. PL/EN/DE complete. Placeholdery portretów (gold gradient + initials MB/AB) do podmiany po dostarczeniu zdjęć przez klienta.

---

## 📦 Nowe pliki do wklejenia

| Plik | Cel |
|---|---|
| `O_NAS_PL__body_top.html` | Treść podstrony PL |
| `O_NAS_EN__body_top.html` | Treść podstrony EN |
| `O_NAS_DE__body_top.html` | Treść podstrony DE |
| `FR_ARKUSZ_STYLOW.css` (zaktualizowany, §102) | CSS dla całej sekcji |
| `INSTRUKCJA_O_NAS.txt` | Krok-po-kroku dla Damiana |

---

## Struktura podstrony /o-nas

### §A. HERO (`fr-page-hero`)
- Kicker: "Poznaj nas" / "Meet us" / "Lernen Sie uns kennen"
- H1: "Rodzinna firma z Wrocławia" (w wersjach językowych)
- Lead: krótkie wprowadzenie z liczbami (21 apartamentów, 9 lat)

### §B. HISTORIA FIRMY (`fr-narrative__split`)
- Layout 2-kolumnowy: zdjęcie (placeholder team) + tekst storytelling
- 3 akapity: zaczęcie 2018, dołączenie Agnieszki, dzisiejszy stan

### §C. WARTOŚCI (`fr-about__values`)
- 4 cards grid (1 col mobile / 2 col tablet / 4 col desktop)
- Każda z SVG ikonką + h3 + opis (~2-3 zdania)
- **4 wartości**:
  1. Indywidualne zaangażowanie (osobiste odbieranie apartamentów)
  2. Liczby, którym ufamy (Booking 9.6, Google 4.7)
  3. Transparentność 24/7 (panel właściciela)
  4. Lokalna wiedza (Wrocław od 9 lat + PriceLabs)

### §D. ZESPÓŁ (`fr-about__team`)
- 2 portrety side-by-side (1 col mobile / 2 col desktop)
- Każdy: gold gradient placeholder z initials (MB/AB), nazwisko, rola, bio (~3 zdania), email
- **Małgorzata Banaś** — Gościnność i jakość · malgorzata@fairrentals.pl
- **Agnieszka Banaś** — Operacje i skalowanie · agnieszka@fairrentals.pl

### §E. STATYSTYKI (`fr-about__stats`)
- Ciemne tło, 4 stat boxy (2 col mobile / 4 col desktop)
- 2018 (rok założenia) / 21 (apartamentów) / 9.6 (Booking) / 9 lat (doświadczenia)

### §F. CTA (`fr-final-cta`)
- Kicker + h2 + lead + 2 buttony
- "Zobacz apartamenty" → /offers
- "Powierz nam apartament" → /txt/203/Obsluga-najmu
- Plus contact info (tel + email)

---

## CSS §102 — komponenty

### Klasy
| Klasa | Cel |
|---|---|
| `.fr-about__placeholder` | Gold gradient bg + initials (do podmiany na `<img>`) |
| `.fr-about__placeholder--team` | Wariant zdjęcia zespołowego (4:3) |
| `.fr-about__placeholder--portrait` | Wariant portretu (3:4) |
| `.fr-about__values` | Grid 4 wartości responsive |
| `.fr-about__value` | Pojedyncza karta wartości |
| `.fr-about__value-icon` | Okrąg z SVG ikonką (dark gold #806C00 AA contrast) |
| `.fr-about__team` | Grid 2 portretów (1 col mobile / 2 col desktop) |
| `.fr-about__member` | Pojedynczy portret + bio |
| `.fr-about__member-photo` | Container 3:4 dla zdjęcia |
| `.fr-about__stats` | Grid stats na ciemnym tle |
| `.fr-about__stat-num` | Duża liczba (gold, DM Serif Display) |

### Responsive breakpoints
- ≤480px: values 1 col, stats 2 col, portraits max-width 240px, placeholder 280px min-h
- 481-639px: values 1 col
- 640-767px: values 2 col, team 1 col
- 768-1023px: values 2 col, team 2 col, stats 4 col
- ≥1024px: values 4 col

### A11y
- Wszystkie placeholdery `aria-hidden="true"` (decoration only)
- SVG ikonki `aria-hidden="true"`
- mailto links z `aria-label` zawierającym visible text (WCAG label-content)
- Heading hierarchy: h1 (page-hero) → h2 (sekcje) → h3 (każda wartość, każdy członek)
- Contrast: dark gold #806C00 na białym = 5.4:1 (AA pass)

---

## Akcje dla Damiana

### Wgrywanie (po kolei):
1. Wklej zaktualizowany `FR_ARKUSZ_STYLOW.css` (356 KB) → Panel → Wygląd → Arkusz stylów
2. Utwórz 3 nowe podstrony w panelu (PL/EN/DE) — szczegóły w `INSTRUKCJA_O_NAS.txt`
3. Wklej `O_NAS_PL/EN/DE__body_top.html` w odpowiednie podstrony (tryb HTML)
4. Dodaj pozycje "O NAS" / "ABOUT US" / "ÜBER UNS" w menu (3 języki)
5. Cmd+Shift+R → weryfikacja

### Materiały do dostarczenia od klienta (do podmiany placeholderów):
| Plik | Wymiary | Format |
|---|---|---|
| `team.jpg` (zespół) | 1200×900 px (4:3) | JPG, <300 KB |
| `malgorzata.jpg` | 900×1200 px (3:4) | JPG, <300 KB |
| `agnieszka.jpg` | 900×1200 px (3:4) | JPG, <300 KB |

Sugestia: profesjonalne studio (ciepła tonacja) lub na tle apartamentu Fair Rentals.

### Adresy e-mail osobowe (opcjonalnie):
HTML zawiera `malgorzata@fairrentals.pl` i `agnieszka@fairrentals.pl`. Jeśli skrzynki nie istnieją:
- **Opcja A** (zalecane): utwórz w panelu hostingu — direct contact lepszy dla zaufania klientów
- **Opcja B**: znajdź obie i zastąp przez `biuro@fairrentals.pl`

---

## Treść (draft) — do akceptacji klienta

Cała treść jest **draftem** napisanym na podstawie tonalności marki ("rodzinna firma", "premium-przystępna", "21 apartamentów", "9.6 Booking"). Klient powinien:

1. **Przeczytać i skorygować** historię firmy (sekcja "Jak to się zaczęło"):
   - Zaczęcie 2018 z Małgorzatą (15 lat hotelarstwa)
   - Dołączenie Agnieszki (project manager w tech) po 2 latach
   - Dziś 21 apartamentów, średnia 9.6

2. **Zaakceptować lub poprawić** bio osób:
   - Małgorzata: 15 lat w hotelarstwie, gościnność, jakość, standardy hotelowe
   - Agnieszka: project manager tech, systemy, operacje, panel właściciela

3. **Potwierdzić** dane:
   - Rok założenia: 2018
   - Liczba lat doświadczenia we Wrocławiu: 9 lat

Jeśli któreś dane są inne (np. firma założona w 2017 lub 2019, inne tytuły zawodowe) — daj znać, zaktualizujemy.

---

## CSS growth

| Wersja | Linie | KB |
|---|---|---|
| v1.31 baseline | 11683 | 348 |
| **v1.32 (Sprint C §102)** | **12005** | **356** |

Idosell soft limit 300 KB, hard ~500 KB → komfortowo.

---

## Changelog v1.32

- ADD: §102 Sprint C — sekcja "O nas" (7 sub-sekcji CSS)
- ADD: O_NAS_PL/EN/DE__body_top.html (3 nowe pliki)
- ADD: INSTRUKCJA_O_NAS.txt (krok-po-kroku dla panelu)
- Placeholdery portretów (gold gradient + initials) — TODO zastąpienie zdjęciami
- Treść draft do akceptacji klienta (historia, wartości, bio)

---

## Co zostało (Sprint D)

**Sprint D — Blog / Baza wiedzy**:
- BLOCKED na decyzji architektury: custom JS lista vs WordPress subdomena
- Wymaga decyzji klienta + pierwszych treści

Po wgraniu Sprint C i otrzymaniu zdjęć — można zacząć Sprint D.
