# Fair Rentals — Plan Sprintów B-E (2026-05-14)

Po Sprint A (v1.28 audyt + 12 punktów rozwiązanych), kolejne pakiety pracy.

---

## Sprint B — Modele współpracy (8% co-host / 10% zarządzanie)

**Priorytet**: WYSOKI (na podstronę "Obsługa najmu")
**Szacowany czas**: 1 sesja (3-4h)
**Status**: pending

### Zakres
- Tabela porównawcza 2 modeli (header z nazwami, wiersze: zakres FR / zakres klienta / cena / formy płatności)
- 2 wyraźne CTA: "Wybieram co-host (8%)" / "Wybieram zarządzanie (10%)"
- Sekcja "Wsparcie wspólne (oba modele)" pod tabelą
- Responsive: tabela → karty na mobile (≤767)
- Tłumaczenia EN i DE (treści jak w polskim mailu Karoliny)

### Lokalizacja
- Plik: `OBSLUGA_NAJMU_PL/EN/DE__body_top.html`
- Nowa sekcja PRZED FAQ (po "Średnie wyniki portfela")
- Klasy CSS: `.fr-compare-models`, `.fr-compare-models__table`, `.fr-compare-models__col--cohost`, `.fr-compare-models__col--manage`
- CSS section: §96. MODELE WSPÓŁPRACY (do FR_ARKUSZ_STYLOW.css)

### Treść do wklejenia (z maila Karoliny — to ostateczna wersja)
```
[CO-HOST 8%]
Tytuł: Model co-host
Subtitle: Konto Booking po Państwa stronie
Cena: 8% wartości rezerwacji brutto
Płatność: miesięczna na podstawie raportów, faktura przez nas

Po Państwa stronie:
- umowa i rozliczenia z Booking.com
- wystawianie faktur Gościom
- organizacja sprzątania
- zakup i pranie pościeli / ręczników
- materiały eksploatacyjne
- bieżące naprawy

Po stronie Fair Rentals:
- przygotowanie apartamentu (wdrożenie operacyjne)
- sesja zdjęciowa
- standardy operacyjne i procedury
- wdrożenie na portale rezerwacyjne
- integracja z channel managerem
- dynamiczne zarządzanie cenami
- pełna obsługa Gości (komunikacja, wsparcie, instrukcje)
- system zarządzania firmą sprzątającą (delegacja zadań)
- wsparcie w rejestracji obiektu (centralne / gminne)

CTA: Wybieram model co-host (8%)
```

```
[ZARZĄDZANIE 10%]
Tytuł: Model zarządzania
Subtitle: My przejmujemy obsługę operacyjną i sprzedażową
Cena: 10% wartości rezerwacji brutto
Płatność: potrącenie z czynszu, rozliczenie miesięczne

Po stronie Fair Rentals:
- własne konta rezerwacyjne (oddzielne od Państwa)
- umowy i rozliczenia z Booking.com
- wystawianie faktur Gościom
- pełna obsługa Gości (komunikacja, check-in)
- zarządzanie cenami i dostępnością
- wdrożenie i marketing
- zarządzanie operacyjne

Po Państwa stronie:
- organizacja sprzątania
- zakup i pranie pościeli / ręczników
- bieżące naprawy
- materiały eksploatacyjne

CTA: Wybieram model zarządzania (10%)
```

```
[WSPÓLNE]
Niezależnie od wybranego modelu:
- wsparcie w rejestracji obiektów (centralne i lokalne)
- doradztwo operacyjne
- optymalizacja przychodów
```

### Acceptance criteria
- [ ] Tabela na desktop ≥768px, karty pionowo na mobile
- [ ] 2 CTA wiodące do `mailto:biuro@fairrentals.pl?subject=Model%20co-host%2C%208%25` (i dla 10%)
- [ ] Wszystkie 3 sekcje (CO-HOST / ZARZĄDZANIE / WSPÓLNE)
- [ ] PL/EN/DE wersje
- [ ] AA contrast tekst na tle
- [ ] TDD: smoke test multi-viewport po implementacji

---

## Sprint C — Sekcja "O nas" (Agnieszka + Małgorzata)

**Priorytet**: ŚREDNI (zależy od dostarczenia zdjęć)
**Szacowany czas**: 2 sesje (1× design + 1× implementacja po zdjęciach)
**Status**: BLOCKED — czekamy na materiały od klienta

### Decyzja layoutowa (do potwierdzenia z klientem)
**Rekomendacja**: osobna podstrona `/o-nas` (id 203 w panelu) — pełnoekranowy storytelling

**Alternatywa**: sekcja na homepage między hero a Apartamentami — krótka karta z linkiem "Poznaj nas →"

### Co potrzebne od klienta
- [ ] 2 zdjęcia portretowe Agnieszki + Małgorzaty (zalecane: studio lub wnętrze apartamentu, format pionowy 3:4)
- [ ] 2-3 zdania historii firmy (kiedy powstała, dlaczego)
- [ ] 1-2 zdania "co nas wyróżnia"
- [ ] (opcjonalnie) zdjęcie zespołowe + 1-2 zdjęcia z pracy operacyjnej (np. sprzątanie, prezentacja apartamentu)

### Layout draft
```
HERO (page-hero)
  Kicker: O NAS
  H1: Agnieszka i Małgorzata
  Lead: Rodzinny biznes z Wrocławia

SEKCJA 1: HISTORIA
  Storytelling: kiedy zaczęłyśmy, dlaczego, jak rosła firma (200-300 słów)
  Side image: portret zespołowy lub jeden z pierwszych apartamentów

SEKCJA 2: NASZE WARTOŚCI (3-4 punktów)
  - Indywidualne zaangażowanie
  - Wysokie standardy ratingów
  - Transparentność
  - Lokalna wiedza

SEKCJA 3: PORTRETY (2-kolumnowe)
  Agnieszka — portret + 2-3 zdania "kim jestem" + obszar odpowiedzialności
  Małgorzata — portret + 2-3 zdania "kim jestem" + obszar odpowiedzialności

CTA: Skontaktuj się z nami / Sprawdź apartamenty
```

### Acceptance criteria
- [ ] Podstrona PL/EN/DE z 4 sekcjami
- [ ] Lazy-load obrazów (z `decoding="async"`)
- [ ] Responsive (mobile portrait → desktop)
- [ ] Schema.org Person markup dla obu (SEO)
- [ ] Link z menu głównego (między "Najem korporacyjny" a "Kontakt"?)
- [ ] Link z homepage hero lub footer
- [ ] TDD multi-viewport

---

## Sprint D — Blog / Baza wiedzy

**Priorytet**: ŚREDNI (po Sprint C)
**Szacowany czas**: 2 sesje (1× struktura + 1× szablon wpisu)
**Status**: pending

### Struktura
- Podstrona `/baza-wiedzy` (lub `/blog`) — lista wpisów
- Filtry kategorii: Dla Gości / Dla Właścicieli / Dla Firm
- Szablon pojedynczego wpisu z auto-spis treści, autor, data, kategoria
- Kategoria-specyficzne meta (Schema.org Article)

### Decyzja IdoBooking
IdoSell ma natywne wsparcie dla podstron (txt/N/Slug) ale nie ma listingu z filtrami. Opcje:
1. **Custom HTML lista**: hardcoded grid z wpisów w podstronie `/baza-wiedzy/body_top` — wymaga manual update przy każdym nowym wpisie. NIE skaluje się.
2. **Każdy wpis = osobna podstrona w panelu** + lista na `/baza-wiedzy` generowana dynamicznie JS-em (czyta `/txt/*` API).
3. **External CMS**: WordPress na subdomenie `blog.fairrentals.pl` lub Ghost.io.

**Rekomendacja**: 2 (custom JS list) jeśli przewidujemy 5-15 wpisów; 3 (WordPress) jeśli więcej + chcemy własny SEO.

### Acceptance criteria (decyzja po konsultacji)
- [ ] Decyzja arch: custom JS vs WordPress
- [ ] Lista z 3 kategoriami + filter UI
- [ ] Szablon wpisu (h1, hero image, meta autor/data, body, CTA)
- [ ] PL/EN/DE
- [ ] SEO: sitemap.xml updates, schema.org Article
- [ ] TDD multi-viewport

---

## Sprint E — Uwagi UX z PDF Agnieszki (23 strony)

**Priorytet**: NISKI-ŚREDNI (równolegle z B/C/D)
**Szacowany czas**: 1-2 sesje (zależy od liczby drobnych korekt)
**Status**: BLOCKED — czekamy na extract treści PDF (problem z PDF reader)

### Zakres (zgadnięty na podstawie maila Agnieszki)
- Akcenty kolorystyczne (delikatne wzmocnienie kontrastu/czytelności)
- Małe poprawki wizualne sekcji
- Drobne uwagi UX (microcopy, spacing, hierarchia)

### Tryb pracy
- 1 sesja: extract treści PDF → lista konkretnych poprawek
- 1 sesja: implementacja CSS/HTML (raczej §97 w arkuszu stylów)
- TDD po każdej grupie zmian (mini-iteracje)

### Acceptance criteria
- [ ] Lista wszystkich uwag z PDF z thumbnailami sekcji
- [ ] Każda uwaga: status (zrobione / odrzucone z powodem / odłożone)
- [ ] CSS dla zaakceptowanych (§97 lub odpowiednia sekcja)
- [ ] Wizualny dyff przed/po
- [ ] TDD multi-viewport

---

## Dependencies + sequencing

```
Sprint A (DONE) ──┬──► Sprint B (modele 8/10) ──► CONTENT READY
                  │
                  ├──► Sprint C (O nas) [BLOCKED on photos]
                  │
                  ├──► Sprint D (Blog) ──► STRATEGY DECISION
                  │
                  └──► Sprint E (UX PDF) ──► PARALLEL (after PDF extract)
```

**Realistic timeline z DZISIAJ (14.05.2026)**:
- 14.05 — Sprint A done, wgranie v1.28
- 16-17.05 — Sprint B (modele)
- 17-19.05 — Sprint C (jeśli zdjęcia dostarczone do 16.05)
- 22-24.05 — Sprint D struktura
- W międzyczasie — Sprint E (uwagi UX)

**Krytyczne nie-tech zadania**:
- Klient: uzupełnienie cenników (punkt 5)
- Klient: dostarczenie zdjęć portretowych
- Klient: decyzja blog WordPress vs custom JS
- Klient: pierwsze treści dla bloga (3-5 wpisów, po jednym z każdej kategorii)

---

## Tracking

Po każdym sprincie:
1. RELEASE_NOTES_v1.X.md (X = sprint letter)
2. Update `memory/clients_data/fairrentals.json` status + iterations_history
3. TDD report (TDD_AUDIT_v1.X.md)
4. Commit + push do feature/fairrentals-v1.0 (lub merge do main jeśli stable)
