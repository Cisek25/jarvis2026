---
name: 009-MASTER-read-jarvis-memory-before-implementing
description: ZAWSZE czytaj memory/instincts/* + memory/lessons/* + CLAUDE.md traps przed implementacją. Klient SA — duzo bugów (polityka modal, lightbox blacklist, filtry collapse, logo size, 10px root font, footer overrides) MIAŁY już istniejące rozwiązania w memory ale je powtórzyłem.
type: lesson
created: 2026-05-04
severity: CRITICAL
source_client: solidneapartamenty (client57511)
source_feedback: "duzo się powtórzyło"
---

# Lesson — Czytaj memory PRZED implementacją (nie po incydencie)

## Kontekst

Klient solidneapartamenty (sesja 2026-05-04) zgłosił 10+ poprawek UX
w trakcie 6 iteracji (v1.0 → v1.6.5). **Większość tych poprawek miała
już udokumentowane rozwiązania w `memory/instincts/`** — gdybym przeczytał
je na początku sesji, **nie powiódł bym tych samych błędów co przy
poprzednich klientach**.

User feedback dosłowny: *"duzo się powtórzyło"*.

## Konkretne przypadki powtórzonych błędów (sesja SA)

| Bug | Istniejący instinct | Co zrobiłem | Co powinienem był zrobić |
|---|---|---|---|
| Polityka prywatności otwiera nową kartę z brzydką stroną IdoBooking | **032** policy-links-modal-iframe-popup | Zostawiłem `target="_blank"` w v1.0 | Od razu dodać modal iframe z body_bottom |
| Najem korporacyjny zdjęcie nieklikalne (data-no-lightbox) | **011** every-image-lightbox (BLACKLIST not whitelist) | Hardcoded `data-no-lightbox` w HTML | Nigdy nie dodawać data-no-lightbox bez konkretnego powodu |
| Filtr TYP OBIEKTU otwarty by default | **005** filters-submit-brand-styling (kontekst /offers) | `keepOpen = idx === 0` w initFilterCollapse | Default ALL collapsed |
| Logo 80px za małe na transparent header | **019** logo-chip-conditional-and-typography-minimum | max-height: 80px | Min 100px dla wide logos |
| Czarny tekst na photo bez kontrastu (Dla-Firm hero) | **020** css-specificity-beats-order | `.sa-page-hero__title { color: white }` bez !important | Globalna h1 rule z !important wymaga !important w specyficznym selektorze |
| Footer "wyspa" Bootstrap 1170px | **037** MASTER-page-index-fullwidth-and-system-hides | Pominąłem footer w fullwidth audit | Każdy element systemowy ograniczony do .container = override do 100vw |
| Tabs --fixed przesunięte na lewo | **039** MASTER-tabs-fixed-and-litepicker-responsive | Brak `max-width: none` w override | width:100% nie wystarcza gdy system ma max-width |
| Litepicker stacked vertically | **039** (tworzony tej sesji ale wzorzec już znany z innych klientów) | numberOfMonths:1, brak responsive grid | 2-month grid od razu od v1.0 |
| Body font-size na rem przy system 10px root | **023+024** idobooking-html-font-size-10px-trap | Część reguł na rem | Wszystkie typo w px |
| Mobile menu napisy niewidoczne | **028** one-shared-js-file-per-page-all-languages + body class checks | Tylko white-color rule na page-index | Override dla mobile dropdown niezależny od page state |

**Razem: 10 powtórzonych błędów**, każdy wymagał osobnej iteracji + fix +
memory update. Łączny koszt sesji: ~6 iteracji zamiast 2-3.

## Reguła bezdyskusyjna

**Na początku KAŻDEJ sesji z klientem, ZANIM napiszesz pierwszą linię
kodu, OBOWIĄZKOWO przeczytaj:**

1. **`memory/clients_data/{nazwa}.json`** — pełna historia klienta + zastosowane traps
2. **`memory/instincts/`** — WSZYSTKIE pliki (są tam reguły zachowań)
   - Szczególnie `000-MASTER-PLAYBOOK-idobooking-default13.md`
   - Wszystkie z prefiksem `MASTER-` (037, 038, 039, 026)
3. **`memory/lessons/`** — wyuczone błędy + ich rozwiązania
4. **`CLAUDE.md` sekcja "CRITICAL TRAPS"** (1-34) — top 34 znanych pułapek

**Nie czytaj wybiórczo "tych co wydają się relevantne" — przeczytaj WSZYSTKO.**
Memory rośnie w czasie — teraz mamy 39 instinktów, 18 lessons. Czytanie
zajmuje ~5 minut (parsowanie nazw plików), zaaplikowanie wszystkich
oszczędza 30-60 minut iteracji.

## Sygnał ostrzegawczy

Jeżeli user mówi:
- "rozmawialiśmy o tym wcześniej..."
- "to już było..."
- "powinieneś o tym wiedzieć..."
- "duzo się powtórzyło..."

→ **NATYCHMIAST przerwij implementację, przeczytaj `ls memory/instincts/`
   i `ls memory/lessons/`, dopasuj relevantne pliki do bieżącego problemu**.

## Workflow start-of-session (NEW)

```
1. cat memory/clients_data/{nazwa}.json | head -100
2. ls memory/instincts/  → lista wszystkich
3. cat memory/instincts/000-MASTER-*.md
4. cat memory/instincts/{prefix}-MASTER-*.md (relevant per task)
5. cat memory/lessons/  → szybki sweep nazw
6. grep -A 2 "CRITICAL TRAPS" CLAUDE.md | head -200
7. — DOPIERO TERAZ — zacznij analizę zgłoszenia użytkownika
```

## Kiedy stosować

- **ZAWSZE** na początku sesji z istniejącym klientem
- **ZAWSZE** gdy user zgłasza powtórzenie ("już było", "rozmawialiśmy")
- **ZAWSZE** przed budową nowego klienta (memory ma wzorce z 18+ klientów)

## Referencja

- Sesja: 2026-05-04 / solidneapartamenty / v1.0 → v1.6.5
- 10 powtórzonych błędów, każdy z istniejącym instinct/lesson
- User feedback bezpośredni: "zapisz, aby w kolejnym projekcie najpierw
  dobrze przeanalizował co juz w jarvisie było uzywane poprawione,
  aby ponownie nie powielać błędów"
