# PLAN PIERWSZYCH 30 DNI JAKO PRODUCT OWNER
## IdoBooking — Transition Playbook

> Kontekst: Przejście z Account Managera na Product Ownera w firmie IdoBooking.
> Start: Czerwiec 2026. System: legacy SaaS, Smarty templates, ~1000 paneli (klientów), segment SMB.

---

## TYDZIEŃ 1: DISCOVERY & ORIENTATION (Dni 1-7)

### Dzień 1: AM Handover Document

Zanim zaczniesz nową rolę — przekaż dotychczasowe obowiązki AM:

**Checklist handover:**
- [ ] Lista aktywnych klientów z statusem relacji
- [ ] Otwarte sprawy / eskalacje w toku
- [ ] Pipeline (klienci w procesie wdrożenia)
- [ ] Kontakty kluczowe per klient
- [ ] Przekaż nowemu AM lub rozdziel między zespół
- [ ] Ustal datę graniczną: "od dnia X nie jestem AM"

---

### Dzień 2-3: Audit obecnego stanu produktu (Product Health Snapshot)

**[PO_STRATEGIST]**

**Zbierz dane:**
- [ ] Lista wszystkich zgłoszonych bugów (BOK, Jira/email, Twoje własne notatki z AM)
- [ ] Analiza ticketów supportu: top 10 najczęstszych problemów (z ostatnich 6 miesięcy)
- [ ] Status obecnych projektów dev (nowy Booking Engine, migracja Fakturownia, itp.)
- [ ] Baseline metryki: churn rate, liczba ticketów/miesiąc, aktywni klienci, uptime
- [ ] Metryki: liczba aktywnych klientów, NPS (jeśli istnieje), revenue per plan
- [ ] Dług techniczny: co jest znane ale nienaprawione (patrz: sekcja "Znane Bugi" w bazie wiedzy)

**Output:** Dokument "Product Health Snapshot" — 2-3 strony, fakty i liczby.

---

### Dzień 3-4: Mapowanie stakeholderów + 1:1 rozmowy

**Zadania:**
- [ ] Spotkanie 1:1 z każdym stakeholderem (30 min)
  - Pytania do każdego: "Co Cię najbardziej boli w produkcie?" / "Gdybyś mógł zmienić jedną rzecz?"
  - Stakeholderzy: Zespół Dev, BOK, Account Managers, CEO, Tech Lead
- [ ] Stwórz mapę stakeholderów (influence vs interest matrix)

| Stakeholder | Rola | Czego potrzebuje od PO | Jak często sync |
|-------------|------|------------------------|-----------------|
| Zespół Dev | Wykonawcy | Jasne User Stories, priorytet, AC | Daily standup |
| BOK (L1 Support) | Front-line | Wiedza o planach, ETA fixów | Weekly |
| Account Managers | Głos klienta | Roadmapa, status bugów, nowe features | Bi-weekly |
| Zarząd / CEO | Sponsor | Metryki, ROI, strategia | Monthly review |
| Tech Lead | Tech strategist | Architektura, capacity, dług tech | Weekly |

---

### Dzień 2-3: PO Charter (Karta Roli)

Dokument definiujący zakres decyzyjny Product Ownera. Uzgodnij z CEO/zarządem.

**Zawartość PO Charter:**
- [ ] Zakres decyzyjny PO (co może decydować samodzielnie, co wymaga akceptacji)
- [ ] RACI matrix: kto jest Responsible, Accountable, Consulted, Informed dla kluczowych decyzji
- [ ] Granice roli: co PO robi, a czego NIE robi (np. nie zarządza zespołem dev personalnie)
- [ ] Proces dodawania itemów do sprintu (kto może, kto nie)
- [ ] Proces eskalacji decyzji produktowych

**Template RACI:**

| Decyzja | PO | Tech Lead | CEO | AM Team |
|---------|-----|-----------|-----|---------|
| Priorytet backlogu | A/R | C | I | C |
| Sprint scope | A/R | C | I | I |
| Release timing | C | A/R | I | I |
| Nowy feature > 2 sprinty | R | C | A | C |
| Roadmapa kwartalna | R | C | A | I |

---

### Dzień 4-5: Tech Deep Dive z zespołem Dev

Sesja 2-4h z Tech Leadem / senior devem:

**Agenda:**
- [ ] Architektura systemu — jak zbudowany jest IdoBooking (serwery, DB, cache)
- [ ] Cykl deploymentu — CI/CD, staging, produkcja, feature flags
- [ ] Dług techniczny — co jest znane, co planowane, co blokuje
- [ ] Pojemność zespołu — ile osób, jakie specjalizacje, obecne obciążenie
- [ ] Istniejące narzędzia — Jira/GitHub/inne? Jak team estymuje?
- [ ] Dołączenie do daily standupów (obserwacja, nie prowadzenie)

### Dzień 5-7: Zbuduj Początkowy Backlog + Daily Standups

**Źródła itemów backlogowych:**

1. **Z Twojego doświadczenia AM** (już znasz te problemy):
   - Brak `children` URL param w BE
   - PayPal wyświetlany zamiast IdoPay
   - Brak sekcji Hero w szablonach
   - Overbooking UX (czerwone podświetlenie, ale brak blokady)
   - Brak PESEL/nr dokumentu w formularzu
   - Jeden rachunek bankowy per waluta

2. **Z ticketów supportu** (top powtarzalne):
   - SMS nie wysyłany (4 przyczyny — wymaga lepszego UX)
   - Booking.com eksport na zły email (wymaga IT interwencji)
   - Klienci nie mogą znaleźć prowizji Booking.com (raport vs karta rezerwacji)

3. **Ze strategii firmy**:
   - Nowy Booking Engine 2026
   - Migracja na Fakturownia (kwiecień 2026 — już aktywna gdy startujesz!)
   - Automatyczne paragony (w developmencie)
   - Nowa wersja kalendarza

**Format backlog itema:**
```
ID: IDOS-001
Tytuł: Dodaj parametr children do URL Booking Engine
Typ: Feature
User Story: Jako operator pensjonatu chcę przekazywać liczbę dzieci w linku do BE,
            aby goście nie musieli ręcznie ustawiać filtrów.
AC: Given link z ?persons-children=2
    When gość otwiera BE
    Then filtr dzieci jest ustawiony na 2
RICE: R=800 × I=2 × C=0.8 / E=3 = 427
Priorytet: High
Status: Backlog
Zależności: Nowy Booking Engine
```

**Zadania Tygodnia 1:**
- [ ] Dołącz do istniejących standupów zespołu dev (obserwacja, nie prowadzenie)
- [ ] AM Handover Document przekazany
- [ ] PO Charter uzgodniony z CEO
- [ ] Tech Deep Dive z zespołem dev

---

## TYDZIEŃ 2: FRAMEWORK & TOOLS (Dni 8-14)

### Dzień 8-9: Wybór narzędzi

**[PO_STRATEGIST]**

**WAŻNE**: Przed wyborem nowych narzędzi, zbadaj co zespół już używa (Jira? GitHub Issues? Confluence?). Migracja narzędzi w pierwszych tygodniach to ryzyko.

| Narzędzie | Do czego | Rekomendacja | Dlaczego |
|-----------|----------|--------------|----------|
| Backlog & Sprint | Zarządzanie itemami | **Linear** | Szybki, dev-friendly, RICE scoring, API |
| Dokumentacja | PRD, specs, wiki | **Notion** | Flexible, łatwe linkowanie, templates |
| Roadmapa | Wizualizacja planu | **Linear Roadmap** lub Notion | Zintegrowane z backlogiem |
| User Feedback | Zbieranie opinii klientów | **Canny** lub Google Forms | Bezpośredni głos klienta, nie tylko filtrowany przez AM |
| Komunikacja | Stakeholder updates | **Slack + Loom** | Async, nagrania z komentarzem |
| Analityka | Metryki produktowe | **GA4 + Metabase** | GA4 już zintegrowane z IdoBooking |
| Automatyzacja | Raportowanie | **Make.com** | IdoBooking API compatible |

**Alternatywa budżetowa:** Notion (free) jako all-in-one + GitHub Issues (jeśli dev już używa).

- [ ] Zbadaj istniejące narzędzia zespołu
- [ ] Zdecyduj na narzędzia (konsultacja z dev team i zarządem)
- [ ] Setup backlogu — zaimportuj itemy z Tygodnia 1
- [ ] Stwórz template User Story i Bug Report

### Dzień 10-11: Zdefiniuj Definition of Ready i Definition of Done

**Definition of Ready (DoR) — kiedy item jest gotowy do sprintu:**
- [ ] User Story w formacie "Jako... chcę... aby..."
- [ ] Acceptance Criteria (min. 3 scenariusze Given/When/Then)
- [ ] Mockup lub wireframe (jeśli UI change)
- [ ] Zidentyfikowane zależności (API, integracje, inne itemy)
- [ ] RICE score obliczony
- [ ] Zaakceptowane przez Tech Lead (feasibility check)

**Definition of Done (DoD) — kiedy item jest "skończony":**
- [ ] Kod w review/merged
- [ ] Testy (unit + integration) przechodzą
- [ ] Przetestowane na staging
- [ ] Dokumentacja zaktualizowana (jeśli dotyczy)
- [ ] Release notes przygotowane
- [ ] Stakeholderzy powiadomieni (jeśli dotyczy)

**Zadania Tygodnia 2:**
- [ ] Istniejące narzędzia zespołu zbadane
- [ ] Narzędzie do user feedbacku wybrane

### Dzień 12-14: Pierwszy Sprint Planning

**Sprint 0 (orientacyjny) — cel: Quick Wins**

Wybierz 3-5 itemów o:
- Wysokim RICE score
- Niskim effort (< 3 story points)
- Widocznym impakcie dla klientów lub supportu

**Kandydaci na Quick Wins z bazy wiedzy IdoBooking:**

| Item | Impact | Effort | Dlaczego quick win |
|------|--------|--------|--------------------|
| Fix "PayPal" → "IdoPay" label w BE | Medium | Low | Kosmetyczny bug, frustruje klientów (weryfikuj z dev — znany bug bez fixu) |
| UX warning przy SMS > 480 znaków | High | Low | Top przyczyna "SMS nie wysłany" |
| Dokumentacja top 10 workaroundów dla BOK | High | Low | Zero-code, natychmiastowe zmniejszenie eskalacji |
| Default "accepted" status dla Agoda | Medium | Low | Eliminuje ręczną zmianę per rezerwacja |
| Tooltip przy overbooking warning | Medium | Low | Wyjaśnia że to BY DESIGN, nie bug |

---

## TYDZIEŃ 3: EXECUTION & RHYTHM (Dni 15-21)

### Ustanów ceremonie Agile

| Ceremonia | Kiedy | Czas | Kto | Cel |
|-----------|-------|------|-----|-----|
| Daily Standup | Codziennie 9:30 | 15 min | Dev + PO | Blokery, sync |
| Sprint Planning | Poniedziałek (co 2 tyg) | 1-2h | Dev + PO | Scope sprintu |
| Backlog Refinement | Środa (co tydzień) | 1h | Dev + PO | Doszlifuj itemy |
| Sprint Review | Piątek (co 2 tyg) | 30 min | Wszyscy | Demo, feedback |
| Retro | Piątek (co 2 tyg) | 45 min | Dev + PO | Ulepszanie procesu |
| Stakeholder Update | Piątek (co 2 tyg) | Email/Loom | Stakeholderzy | Postęp, roadmapa |

### Dzień 15-16: Pierwszy "Stakeholder Update"

**Template email/Loom:**
```
Temat: IdoBooking Product Update — Tydzień [X]

🎯 Co robimy w tym sprincie:
- [Item 1] — status: [in progress / done / blocked]
- [Item 2] — status
- [Item 3] — status

📊 Metryki:
- Tickety supportu: [X] (vs [Y] tydzień wcześniej)
- Najczęstszy problem: [...]

🔮 Co planujemy dalej:
- [następny sprint scope]

❓ Potrzebuję decyzji w sprawie:
- [temat wymagający input stakeholdera]
```

### Dzień 17-21: Pierwszy prawdziwy sprint w toku

- [ ] Monitoruj postęp na daily standupach
- [ ] Usuń blokery — Twoja główna wartość jako PO
- [ ] Dokumentuj decyzje w Notion/Wiki (ADR — Architecture Decision Records)
- [ ] Zbieraj feedback od AM-ów na temat wpływu zmian

---

## TYDZIEŃ 4: MEASURE & ADJUST (Dni 22-30)

### Dzień 22-24: Zdefiniuj North Star Metric i KPI

**North Star Metric (propozycja):**
> **Procent klientów aktywnie korzystających z Booking Engine**
> (łączy adopcję produktu z wartością dla klienta — PO ma bezpośredni wpływ)

**KPI Dashboard:**

| KPI | Obecna wartość | Cel (Q3 2026) | Jak mierzysz |
|-----|---------------|---------------|--------------|
| Churn rate (miesięczny) | [zbierz] | < 3% | Panel admin |
| Tickety supportu / klient | [zbierz] | -20% | BOK system |
| Time-to-value (onboarding) | [zbierz] | < 5 dni | Plan wdrożenia |
| Booking Engine conversion | [zbierz] | +15% | GA4 |
| NPS | [zbierz lub uruchom] | > 40 | Ankieta |
| Backlog health (% itemów z DoR) | [zbierz] | > 80% | Linear/Jira |
| Bug fix cycle time | [zbierz] | < 5 dni | Linear/Jira |
| Feature adoption (30d) | [zbierz] | > 40% | GA4 |
| Uptime | [zbierz] | > 99.5% | Monitoring |

### Dzień 25-27: Pierwsza Retrospektywa roli PO

Pytania do siebie:
1. Co poszło dobrze w pierwszym miesiącu?
2. Co było trudniejsze niż myślałem?
3. Gdzie brakuje mi wiedzy? (tech? biznes? proces?)
4. Kto jest moim najważniejszym sojusznikiem w firmie?
5. Czy moje User Stories są wystarczająco jasne dla dev teamu?

### Dzień 28-30: Roadmapa Q3 2026

**Draft roadmapy (na podstawie zebranych danych):**

```
Q3 2026 (Lipiec-Wrzesień)
═══════════════════════════

MUST HAVE (commitment):
├── Nowy Booking Engine — finalizacja i rollout (wymaga osobnego mini-planu migracji: strategia rollout, testy A/B, rollback)
├── Post-migration Fakturownia — stabilizacja i bugfixy
├── Consent Mode v2 natywny [S] (wymóg Google od 2024, regulacyjny)
└── Top 5 Quick Wins z backlogu [S-M]

SHOULD HAVE (target):
├── Dashboard prowizji OTA [M]
├── Ulepszona konfiguracja SMS (UX) [M]
└── API v2 (ulepszony) [L] (strategicznie: lock-in, integracje)

COULD HAVE (stretch):
├── Automatyczne paragony [M]
└── Multi-bank account per waluta [L]

WON'T HAVE (this quarter):
├── Opera PMS integracja (nie nasz segment)
├── Pełna zmiana szablonów (zbyt duży scope)
└── Mobile app redesign
```

---

## BONUS: TWOJE PRZEWAGI JAKO BYŁY AM

Większość PO przychodzi "z zewnątrz" i uczy się produktu od zera. Ty masz:

1. **Empatię klienta** — znasz DOKŁADNIE jakie problemy mają użytkownicy
2. **Wiedzę o workaroundach** — wiesz co działa "mimo systemu" (i co powinno działać natywnie)
3. **Relacje z BOK/Support** — masz naturalnych sojuszników do zbierania feedbacku
4. **Znajomość ograniczeń technicznych** — nie będziesz proponować niemożliwych rozwiązań
5. **Bazę wiedzy** — masz już 76 plików dokumentacji, których żaden nowy PO by nie miał

---

## ZARZĄDZANIE RYZYKAMI TRANZYCJI

| Ryzyko | Prawdop. | Impact | Mitygacja |
|--------|----------|--------|-----------|
| Wpadnięcie w "tryb AM" — gaszenie pożarów | Wysokie | Wysoki | Zasada 80/20: max 20% czasu reactive. Ustal granicę z przełożonym. |
| Opór zespołu dev wobec nowego PO | Średnie | Wysoki | Shadow days w Tygodniu 1, słuchanie przed zmianami, szacunek dla istniejących procesów |
| Brak formalnego mandatu decyzyjnego | Średnie | Wysoki | PO Charter uzgodniony z CEO w Tygodniu 1 |
| Duplikacja ról — kto teraz robi AM? | Pewne | Krytyczny | AM Handover Document w Dniu 1, data graniczna zmiany roli |
| Migracja Fakturownia destabilizuje system | Wysokie | Wysoki | Zarezerwuj 20% capacity sprintu na bugfixy post-migracji |
| Nowy BE bez jasnego właściciela | Średnie | Wysoki | Przejęcie ownership w Tygodniu 1, review stanu z dev |
| Przeciążenie informacyjne | Średnie | Średni | Priorytetyzuj wiedzę: 76 plików ≠ musisz przeczytać wszystko w tydzień |
| Nierealistyczne oczekiwania stakeholderów | Wysokie | Wysoki | PO Charter definiuje co PO robi, Stakeholder Update co 2 tygodnie |

---

## CHECKLIST: 30 DNI

### Tydzień 1
- [ ] AM Handover Document przekazany
- [ ] Product Health Snapshot (dokument)
- [ ] PO Charter uzgodniony z CEO
- [ ] Tech Deep Dive z zespołem dev
- [ ] 1:1 ze wszystkimi stakeholderami
- [ ] Początkowy backlog (min. 20 itemów)
- [ ] Dołączenie do daily standupów (obserwacja)

### Tydzień 2
- [ ] Istniejące narzędzia zespołu zbadane
- [ ] Narzędzie do user feedbacku wybrane
- [ ] Narzędzia wybrane i skonfigurowane
- [ ] DoR i DoD zdefiniowane
- [ ] Pierwszy Sprint Planning przeprowadzony

### Tydzień 3
- [ ] Ceremonie Agile ustalone
- [ ] Pierwszy Stakeholder Update wysłany
- [ ] Sprint w toku, blokery usuwane

### Tydzień 4
- [ ] KPI zdefiniowane, baseline zmierzony
- [ ] Retrospektywa roli PO
- [ ] Roadmapa Q3 2026 (draft)
- [ ] Prezentacja "30 dni — co zrobiłem" dla zarządu
