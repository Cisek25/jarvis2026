# BRAINSTORM: IdoBooking Automated Website Pipeline

> Kompletna analiza, architektura i plan budowy systemu automatyzacji tworzenia stron klientów.
>
> **Data:** 2026-04-11 | **Wersja:** 1.0

---

## SPIS TRESCI

1. [Executive Summary](#1-executive-summary)
2. [Analiza stanu obecnego](#2-analiza-stanu-obecnego)
3. [Zidentyfikowane problemy](#3-zidentyfikowane-problemy)
4. [Wizja: Pipeline Brief → Strona](#4-wizja-pipeline-brief--strona)
5. [Architektura CSS: 3 warstwy](#5-architektura-css-3-warstwy)
6. [Biblioteka komponentow](#6-biblioteka-komponentow)
7. [Generator v2](#7-generator-v2)
8. [Claude Code Skills](#8-claude-code-skills)
9. [Brief-to-Code Pipeline](#9-brief-to-code-pipeline)
10. [Testowanie i QA](#10-testowanie-i-qa)
11. [Dashboard klientow](#11-dashboard-klientow)
12. [Plan implementacji](#12-plan-implementacji)
13. [Otwarte pytania](#13-otwarte-pytania)

---

## 1. Executive Summary

### Co mamy
- **18+ projektow klientow** na platformie IdoBooking (Smarty templates, Bootstrap 4.3.1)
- **Generator v1** (Python): config.json → 5 plikow (CSS, HTML homepage, JS, META, instrukcja)
- **Knowledge Base v2.0**: 576 linii dokumentacji pulapek, wzorcow, checklist
- **Master Template**: szablon CSS (563 linie) + HEAD + JS + instrukcja wklejania
- **18 udokumentowanych system traps** (bugi IdoBooking)

### Glowne problemy
| Problem | Wplyw | Priorytet |
|---------|-------|-----------|
| **40-60% kodu CSS powtarza sie** miedzy klientami | Maintenance nightmare, bugi | KRYTYCZNY |
| **Reczne wklejanie** 15-30 plikow do CMS per klient | 30-60 min per deploy, bledy | WYSOKI |
| **Brak biblioteki komponentow** | Kazdy klient od zera | WYSOKI |
| **Generator pokrywa 20% zakresu** | Tylko homepage, brak podstron | SREDNI |
| **Brak automatycznych testow** | Bugi przechodza na produkcje | SREDNI |
| **Multi-language recznie** | 4x praca dla 4 jezykow | NISKI |

### Cel koncowy
```
Klient daje brief → User wrzuca do Claude → Claude generuje WSZYSTKO →
Pliki gotowe do wklejenia w DO_WKLEJENIA/ → Deploy + auto-test
```

### Szacowany ROI
- **Obecny czas per klient**: 3-5h (generowanie + deploy + testowanie)
- **Po automatyzacji**: 30-60 min (brief → generate → paste → verify)
- **Oszczednosc**: ~70% czasu = ~40-60h przy aktualizacji calego portfolio

---

## 2. Analiza stanu obecnego

### 2.1 Architektura szablonu IdoBooking

```
Smarty Template Engine (.tpl)
├── 71 template files
├── 40+ component templates
├── Bootstrap 4.3.1 (Grid + Reboot only)
├── 220 LESS stylesheets (14 color schemes)
├── jQuery 3.3.1 + Slick Carousel + Leaflet.js
└── Webpack build system
```

**Kluczowe zmienne Smarty:**
- `{$action}` — typ strony (index, offers, offer, contact, txt, news, opinions)
- `{$objects}` — lista ofert/pokoi
- `{$ownerData}` — dane wlasciciela (telefon, email, adres)
- `{$ownCode['head_code']}` — custom kod w HEAD
- `{$ownCode['body_bottom_code']}` — custom JS na koncu BODY
- `{$mainColor}` — kolor brandowy z panelu

**Injection points (gdzie wstawiamy kod):**
1. **Edytor CSS** — globalny arkusz stylów (czysty CSS, bez `<style>`)
2. **HEAD** — meta tagi, Google Fonts, preload
3. **Poczatek BODY** — skip-link, noscript (rzadko uzywane)
4. **Koniec BODY** — `<script>` z calym custom JS
5. **CMS content** — HTML sekcje stron (tryb HTML edytora)

### 2.2 Generator v1

**Wejscie:** `config.json` z:
- Paleta kolorow (10 wartosci)
- Fonty (heading + body + Google import URL)
- Hero (tytuly, CTA)
- Kontakt (telefon, email)
- Nawigacja (menu items)
- Opcjonalnie: featured offers, booking URL

**Wyjscie:** 5 plikow w `DO_WKLEJENIA/`:
1. `CSS_EDYTOR.css` (1140 linii) — pelny arkusz z podstawionymi kolorami
2. `GLOWNA_PL__body_top.html` (135 linii) — hero + intro homepage
3. `JS_BASE.html` (310 linii) — minified vanilla JS
4. `META_SEO.html` — meta tagi + structured data
5. `INSTRUKCJA.txt` — kroki wklejania

**Funkcje transformacji:**
- `hex_to_rgb()` — konwersja na rgba()
- `darken_hex()` — automatyczne ciemniejsze warianty
- `lighten_hex()` — automatyczne jasniejsze warianty

**Ograniczenia generatora v1:**
- Generuje TYLKO homepage (brak podstron: O nas, Galeria, Atrakcje, FAQ)
- CSS jest monolityczny (caly szablon w jednym pliku)
- Brak multi-language
- Brak generowania podstron CMS
- Brak walidacji konfiguracji
- Brak testow wyjsciowych

### 2.3 Portfolio klientow

**Generator-based (9):** ecocamping, GoldenApartments, MountainPrestige, madera, mazurski_chill, najmar, piekary13, SORS, grzybek

**Manual/Custom (7):** wawabed, villa-kapitanska, dobry_wiatr, CityApartSzczecin, PerfectApart, wawabed2, willa_raclawicka

**Sredni CSS per klient:** 1,200 linii (od 186 do 5,424)

### 2.4 Istniejace zasoby ktore mozemy wykorzystac

| Zasob | Lokalizacja | Stan |
|-------|------------|------|
| Knowledge Base v2.0 | `03-starter-kit/IDOBOOKING-KNOWLEDGE-BASE.md` | Aktualny, 576 linii |
| Master Template CSS | `_MASTER_TEMPLATE/DO_WKLEJENIA/TEMPLATE_ARKUSZ_STYLOW.css` | Aktualny, 563 linie |
| Master Template JS | `_MASTER_TEMPLATE/DO_WKLEJENIA/TEMPLATE_KONIEC_BODY_JS.html` | Aktualny, 141 linii |
| Brief Template | `_MASTER_TEMPLATE/BRIEF_TEMPLATE.md` | Aktualny, 127 linii |
| Design System | `_MASTER_TEMPLATE/DESIGN_SYSTEM.md` | Aktualny, 6 palet + 8 par fontow |
| Checklist | `_MASTER_TEMPLATE/CHECKLIST.md` | Aktualny, 71 linii |
| Generator v1 | `_GENERATOR/generate.py` | Dzialajacy, wymaga rozszerzenia |
| Trap Tracker | `_GENERATOR/trap_tracker.json` | 18 bugów udokumentowanych |
| Template Source | `template-source/` (71 .tpl) | Skopiowany do analizy |
| 34 agentow Claude | `claude-config/agents/` | Gotowe definicje |
| Mega-prompt v2.1 | `01-mega-prompt-idobooking-agent-swarm.md` | Tryby PO/DEV/API/DATA/UX |

---

## 3. Zidentyfikowane problemy

### PROBLEM 1: Duplikacja CSS (KRYTYCZNY)

**Stan:** Kazdy klient dostaje pelna kopie CSS (~1200 linii), z czego:
- ~150 linii to trap fixes (identyczne w kazdym projekcie)
- ~400 linii to component styles (prawie identyczne, roznia sie kolorem)
- ~200 linii to page-specific overrides (/offers, /offer, /contact — te same)
- ~100 linii to responsive breakpoints (te same)
- ~50-100 linii to unikalne customizacje klienta
- ~200 linii to komentarze i struktura

**Duplikaty znalezione w KAZDYM projekcie:**
```css
/* Te same reguly powtarzaja sie 8-18 razy: */
body { font-size: 16px !important; }
.btn:not(.slick-arrow) { background-color: var(--...) !important; }
h1.big-label { display: none !important; }
.parallax-slider::before { display: none !important; }
.defaultsb { position: fixed !important; z-index: 1100 !important; }
body.page-offers .iai-search { display: none !important; }
.offer-price { width: 150px !important; height: 150px !important; border-radius: 50% !important; }
/* ... i 30+ wiecej regul */
```

**Rozwiazanie:** 3-warstwowa architektura CSS (patrz sekcja 5)

### PROBLEM 2: Brak biblioteki komponentow

**Stan:** Kazdy klient implementuje te same layouty od zera:
- Split-column (tekst + zdjecie) — znalezione w 6+ projektach
- Stats bar (liczby + etykiety) — znalezione w 3+ projektach
- Feature grid (ikony + opisy) — znalezione w 6+ projektach
- Offer cards (zdjecie + nazwa + cena) — we WSZYSTKICH projektach
- Hero section — we WSZYSTKICH projektach
- FAQ accordion — w 3+ projektach

Kazdy raz: inna nazwa klasy, inna struktura HTML, inne drobne roznice w CSS.

**Rozwiazanie:** Uniwersalna biblioteka komponentow z prefixem `ido-` (patrz sekcja 6)

### PROBLEM 3: Reczny deployment

**Stan:** Dla kazdego klienta trzeba recznie:
1. Otworzyc panel IdoBooking
2. Wkleic CSS do edytora stylów
3. Wkleic HEAD do kodow sledzacych
4. Wkleic JS do konca BODY
5. Dla kazdej podstrony: wkleic HTML do body_top i/lub body_bottom
6. Ustawic tytuly i meta opisy per strona
7. Sprawdzic czy slider dziala
8. Hard refresh i weryfikacja

**Laczny czas:** 30-60 min per klient, 15-30 operacji copy-paste

**Rozwiazanie:** Ustrukturyzowany folder DO_WKLEJENIA z jasnymi nazwami plikow + instrukcja krok po kroku (juz istnieje, ale wymaga rozszerzenia o podstrony)

### PROBLEM 4: Generator pokrywa ~20% zakresu

**Stan:** Generator tworzy tylko:
- CSS (pelny) ✓
- Homepage HTML ✓
- JS (pelny) ✓
- META ✓
- Instrukcje ✓

**Nie tworzy:**
- Podstron CMS (O nas, Galeria, Atrakcje, FAQ, Cennik) ✗
- Wersji jezykowych (EN, DE) ✗
- Structured Data JSON-LD (tylko meta tagi) ✗
- Podstron /offers, /contact styling (jest w CSS, ale nie osobne pliki) ✗
- Testow ✗

### PROBLEM 5: Brak testow automatycznych

**Stan:** Testowanie jest reczne. Istniejace narzedzia:
- `test_links.js` — sprawdza linki na stronie (wklejane w console)
- `test_full_audit.js` — pelny audyt (font size, orange, broken imgs)
- CHECKLIST.md — reczna checklista

**Brakuje:**
- Automatyczne testy responsive (mobile, tablet)
- Testy kontrastu kolorow (WCAG AA)
- Testy wydajnosci (Lighthouse)
- Testy po deploy (weryfikacja wklejenia)
- Screenshoty porownawcze

**Rozwiazanie:** Puppeteer MCP + custom test skrypty (patrz sekcja 10)

### PROBLEM 6: Multi-language to mnoznik pracy

**Stan:** Niektorzy klienci maja 2-4 wersje jezykowe:
- villa-kapitanska: PL + EN + DE + ES
- Kazda wersja to osobny plik HTML z tym samym layoutem, innym tekstem
- 4 jezyki = 4x pliki do utrzymania

**Rozwiazanie:** System tlumaczen (JSON/YAML) + generator wersji jezykowych

---

## 4. Wizja: Pipeline Brief → Strona

### Flow docelowy

```
┌─────────────────────────────────────────────────────────────────┐
│                    BRIEF-TO-SITE PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [1] BRIEF              [2] PARSE              [3] GENERATE     │
│  ┌──────────┐          ┌──────────┐          ┌──────────────┐   │
│  │ User     │  paste   │ Claude   │  config  │ Claude +     │   │
│  │ wypelnia │ ──────→  │ parsuje  │ ──────→  │ Generator    │   │
│  │ brief    │          │ brief    │          │ tworzy pliki │   │
│  └──────────┘          └──────────┘          └──────────────┘   │
│                                                      │           │
│                                                      ▼           │
│  [6] DEPLOY            [5] PREVIEW            [4] OUTPUT        │
│  ┌──────────┐          ┌──────────┐          ┌──────────────┐   │
│  │ User     │  paste   │ User     │  files   │ DO_WKLEJENIA/│   │
│  │ wkleja   │ ◄──────  │ previewuje│ ◄──────  │ gotowe pliki │   │
│  │ do CMS   │          │ lokalnie │          │ + instrukcja │   │
│  └──────────┘          └──────────┘          └──────────────┘   │
│       │                                                          │
│       ▼                                                          │
│  [7] TEST              [8] FIX (if needed)   [9] DONE          │
│  ┌──────────┐          ┌──────────┐          ┌──────────┐      │
│  │ Puppeteer│  issues  │ Claude   │  fixed   │ Klient   │      │
│  │ auto-test│ ──────→  │ naprawia │ ──────→  │ gotowy!  │      │
│  │ live site│          │ problemy │          │          │      │
│  └──────────┘          └──────────┘          └──────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Krok po kroku

**Krok 1: BRIEF**
User wypelnia `BRIEF_TEMPLATE.md`:
- Dane klienta (nazwa, ID, domena, kontakt)
- Typ obiektu (hotel/apartamenty/domki/glamping)
- Paleta kolorow (wybor A-F lub custom)
- Fonty (wybor 1-8 lub custom)
- Podstrony (checkboxy co potrzebne)
- Zdjecia (skad)
- Jezyki
- Uwagi specjalne

**Krok 2: PARSE**
Claude czyta brief i wyciaga:
- Prefix BEM (2-3 litery z nazwy)
- Pelna paleta kolorow (primary, secondary, accent, bg, dark, light + auto-warianty)
- Para fontow + Google Fonts URL
- Lista podstron do wygenerowania
- Struktura homepage (jakie sekcje)
- Dane kontaktowe
- Wersje jezykowe

**Krok 3: GENERATE**
Claude generuje pliki uzywajac:
- **Warstwa 1:** system-traps.css (gotowa, kopiowana)
- **Warstwa 2:** component-library.css (gotowa, kopiowana)
- **Warstwa 3:** client-theme.css (generowana z palety)
- → Konkatenacja 3 warstw = finalny CSS
- Homepage HTML z komponentami biblioteki
- Podstrony HTML
- JS (body_bottom) z konfiguracja klienta
- HEAD (Google Fonts + viewport)
- META (structured data JSON-LD)
- INSTRUKCJA.txt

**Krok 4: OUTPUT**
Pliki laduja w `projekt_PO/mac-files/[KLIENT]/DO_WKLEJENIA/`:
```
DO_WKLEJENIA/
├── [PREFIX]_CSS_EDYTOR.css        → Panel: Wyglad → Arkusz stylow
├── [PREFIX]_HEAD.html             → Panel: Ustawienia → HEAD
├── [PREFIX]_KONIEC_BODY_JS.html   → Panel: Ustawienia → Koniec BODY
├── GLOWNA_PL__cms.html            → Strona glowna (edytor HTML)
├── O_NAS_PL__body_top.html        → Podstrona O nas
├── GALERIA_PL__body_top.html      → Podstrona Galeria
├── ATRAKCJE_PL__body_top.html     → Podstrona Atrakcje
├── FAQ_PL__body_top.html          → Podstrona FAQ
├── GLOWNA_EN__cms.html            → Homepage EN (jesli multi-lang)
├── structured-data.json           → Referencja (wklejane w HEAD)
└── INSTRUKCJA.txt                 → Kroki wklejania
```

**Krok 5: PREVIEW**
User otwiera pliki HTML w przegladarce lub Claude generuje preview screenshot

**Krok 6: DEPLOY**
User wkleja pliki do panelu IdoBooking wg INSTRUKCJA.txt

**Krok 7: TEST**
Claude uruchamia testy przez Puppeteer MCP:
- Otwiera strone klienta
- Sprawdza: font size 16px, brak orange, zdjecia laduja sie, linki dzialaja
- Robi screenshoty desktop + mobile
- Raportuje wyniki

**Krok 8: FIX**
Jesli testy wykryja problemy — Claude poprawia pliki

**Krok 9: DONE**
Klient gotowy, dane zapisane w client-database

---

## 5. Architektura CSS: 3 warstwy

### Problem ktory rozwiazujemy

Obecnie KAZDY klient dostaje ~1200 linii CSS, z czego ~80% to ten sam kod. Gdy znajdziemy nowego buga w IdoBooking — musimy poprawic 18 plikow reczne.

### Rozwiazanie: 3 warstwy

```
┌─────────────────────────────────────────────┐
│          FINALNY CSS KLIENTA                 │
│  (konkatenacja 3 warstw, ~700 linii)        │
├─────────────────────────────────────────────┤
│                                              │
│  WARSTWA 3: client-theme.css (~50-100 linii)│
│  • :root { --ido-primary: #4A6741; ... }    │
│  • Unikalne customizacje klienta            │
│  • JEDYNY plik generowany per klient        │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  WARSTWA 2: ido-components.css (~400 linii) │
│  • .ido-hero, .ido-split, .ido-stats        │
│  • .ido-features, .ido-cards, .ido-faq      │
│  • Responsive, animacje, accessibility      │
│  • WSPOLNA dla WSZYSTKICH klientow          │
│  • Parametryzowana przez CSS variables      │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  WARSTWA 1: ido-system-traps.css (~150 linii│
│  • 18+ trap fixes (font-size, z-index, etc.)│
│  • Page-specific overrides (/offers, /offer)│
│  • System element overrides (#bounce, etc.) │
│  • WSPOLNA dla WSZYSTKICH klientow          │
│  • Aktualizowana gdy IdoBooking sie zmienia │
│                                              │
└─────────────────────────────────────────────┘
```

### Warstwa 1: ido-system-traps.css

Zawiera WSZYSTKIE znane bug-fixy IdoBooking. Jeden plik, utrzymywany centralnie.

```css
/* ido-system-traps.css — v1.0 — NIGDY NIE EDYTUJ PER KLIENT */

/* TRAP #1: Body font-size 22.4px → 16px */
body { font-size: 16px !important; }

/* TRAP #2: System orange #AD5009 */
.btn:not(.slick-arrow) {
  background-color: var(--ido-primary) !important;
  border-color: var(--ido-primary) !important;
  color: #fff !important;
}

/* ... 16+ more traps ... */
```

**Uwaga:** Elementy ktore wymagaja HARDCODED hex (nie CSS vars) — #bounce, #backTop, .ck_dsclr__btn_v2 — sa w warstwie 3 (client-theme) bo zmieniaja sie per klient.

### Warstwa 2: ido-components.css

Uniwersalne komponenty uzywajace CSS variables. Prefix: `ido-`.

```css
/* ido-components.css — v1.0 — WSPOLNA BIBLIOTEKA */

/* === Hero Section === */
.ido-hero { ... }
.ido-hero__title { ... }
.ido-hero__subtitle { ... }
.ido-hero__cta { ... }

/* === Split Layout === */
.ido-split { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.ido-split--reverse { /* img po lewej */ }
.ido-split__img img { width: 100%; border-radius: var(--ido-radius); }

/* === Feature Grid === */
.ido-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
.ido-feature { text-align: center; padding: 40px 24px; }

/* === Stats Bar === */
.ido-stats { display: flex; justify-content: center; gap: 48px; }
.ido-stat__number { font-size: 3rem; font-family: var(--ido-font-heading); color: var(--ido-primary); }

/* === Offer Cards === */
.ido-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px; }
.ido-card { ... }
.ido-card:hover { transform: translateY(-8px); }

/* === FAQ Accordion === */
.ido-faq { ... }
.ido-faq__question { ... }
.ido-faq__answer { ... }

/* === CTA Section === */
.ido-cta { ... }

/* === Gallery Grid === */
.ido-gallery { ... }

/* === Responsive === */
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }

/* === Animations === */
.ido-reveal { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
.ido-revealed { opacity: 1; transform: translateY(0); }

/* === Accessibility === */
@media (prefers-reduced-motion: reduce) { ... }
```

### Warstwa 3: client-theme.css

Generowana automatycznie z briefu. Minimum kodu per klient.

```css
/* [BRAND] — Client Theme — Generated [DATE] */

/* === Design Tokens === */
:root {
  --ido-primary: #4A6741;
  --ido-secondary: #8B7355;
  --ido-accent: #A8B89C;
  --ido-bg: #F5F1EB;
  --ido-dark: #2C2C2C;
  --ido-light: #F7F5F0;
  --ido-font-heading: 'Merriweather', Georgia, serif;
  --ido-font-body: 'Inter', system-ui, sans-serif;
  --ido-radius: 12px;
  --ido-header-h: 95px;
}

/* === Hardcoded System Elements (CSS vars nie dzialaja) === */
#bounce { background: #4A6741 !important; }
#backTop { background: #4A6741 !important; }
.ck_dsclr__btn_v2 { background: #4A6741 !important; }
.skip_link { background: #4A6741 !important; }
.formbutton { background: #4A6741 !important; }

/* === Unikalne customizacje klienta (jesli potrzebne) === */
/* np. custom hero height, specjalny layout sekcji, etc. */
```

### Proces konkatenacji

```
ido-system-traps.css + ido-components.css + client-theme.css
                              ↓
                    [PREFIX]_CSS_EDYTOR.css
                              ↓
                Panel IdoBooking → Edytor CSS
```

**Zysk:**
- Nowy trap fix → aktualizacja 1 pliku zamiast 18
- Nowy komponent → aktualizacja 1 pliku
- Nowy klient → generujemy TYLKO ~50-100 linii (warstwa 3)

---

## 6. Biblioteka komponentow

### Lista komponentow

Na podstawie analizy 18 projektow — te elementy pojawiaja sie najczesciej:

| Komponent | Czestotliwosc | Priorytet |
|-----------|---------------|-----------|
| **Hero Section** | 18/18 (100%) | P0 |
| **Offer Cards** | 18/18 (100%) | P0 |
| **Feature Grid** (ikony + tekst) | 12/18 (67%) | P0 |
| **Split Layout** (tekst + zdjecie) | 10/18 (56%) | P0 |
| **CTA Section** (call to action) | 15/18 (83%) | P0 |
| **Stats Bar** (liczby) | 6/18 (33%) | P1 |
| **FAQ Accordion** | 5/18 (28%) | P1 |
| **Gallery Grid** | 8/18 (44%) | P1 |
| **Testimonials** | 4/18 (22%) | P2 |
| **Map Section** | 6/18 (33%) | P2 |
| **Blog/News Cards** | 3/18 (17%) | P2 |
| **Pricing Table** | 2/18 (11%) | P3 |
| **Team Grid** | 1/18 (6%) | P3 |

### Spec kazdego komponentu

#### HERO (.ido-hero)
```
Cel: Banner na stronie glownej
Warianty:
  - .ido-hero--image (tlo: zdjecie)
  - .ido-hero--video (tlo: video autoplay)
  - .ido-hero--slider (tlo: slick carousel — uzywa systemowego slidera)
Content: tytul (h1), podtytul (p), CTA button (a)
Overlay: gradient czarny 60%→0%
Min-height: 85vh desktop, 60vh tablet, 50vh mobile
Accessibility: CTA z aria-label, video z aria-hidden
```

#### SPLIT LAYOUT (.ido-split)
```
Cel: Sekcja 50/50 tekst + zdjecie
Warianty:
  - .ido-split (tekst po lewej, zdjecie po prawej)
  - .ido-split--reverse (odwrocony)
  - .ido-split--dark (ciemne tlo)
Content: kicker (span), heading (h2), paragraf (p), optional CTA
Responsive: stack na mobile (1 kolumna)
```

#### FEATURE GRID (.ido-features)
```
Cel: Siatka ikon + tekstow (np. WiFi, Parking, Sniadania)
Layout: auto-fit grid, min 250px, gap 32px
Content per item: ikona/emoji, heading (h3), opis (p)
Warianty:
  - .ido-features--3col (wymuszenie 3 kolumn)
  - .ido-features--2col (wymuszenie 2 kolumn)
  - .ido-features--cards (z cieniem i border-radius)
Hover: translateY(-4px) + shadow
```

#### OFFER CARDS (.ido-cards)
```
Cel: Karty pokoi/apartamentow z linkami
Layout: auto-fill grid, min 300px, gap 28px
Content per card: zdjecie (img), nazwa (h3), cena (span), link (a)
Hover: translateY(-8px) + shadow + image scale 1.05
Image: overflow hidden, aspect-ratio 4/3
Link: cala karta klikalna (card-link pattern)
```

#### CTA SECTION (.ido-cta)
```
Cel: Call-to-action z kontaktem i przyciskiem rezerwacji
Layout: centered, full-width background
Content: heading, telefon (link tel:), email (link mailto:), CTA button
Warianty:
  - .ido-cta--dark (ciemne tlo, jasny tekst)
  - .ido-cta--accent (tlo w kolorze primary)
JS integration: auto-pull telefon z footer (phone space fix)
```

#### STATS BAR (.ido-stats)
```
Cel: Liczby/metryki (np. "50 pokoi", "10 lat doswiadczenia")
Layout: flex row, centered, gap 48px
Content per stat: number (duzy), label (maly)
JS: counter animation (data-ido-count attribute)
Responsive: wrap na mobile
```

#### FAQ ACCORDION (.ido-faq)
```
Cel: Pytania i odpowiedzi
ARIA: aria-expanded, aria-controls, role="region", aria-labelledby
Animation: max-height transition
JS: toggle w body_bottom (bo CMS body_top stripuje <script>!)
Print: wszystkie odpowiedzi otwarte
```

#### GALLERY GRID (.ido-gallery)
```
Cel: Siatka zdjec z lightbox
Layout: CSS grid, auto-fill, min 200px
Lightbox: click → fullscreen modal z nawigacja
Lazy loading: loading="lazy" na wszystkich img
Responsive: 3 kolumny desktop, 2 tablet, 1 mobile
```

### HTML Template per komponent

Kazdy komponent ma ustandaryzowany HTML:

```html
<!-- .ido-split — przyklad -->
<div class="ido-section ido-section--white">
  <div class="ido-container">
    <div class="ido-split ido-reveal">
      <div class="ido-split__text">
        <span class="ido-kicker">O NAS</span>
        <h2 class="ido-heading">Naglowek sekcji</h2>
        <p>Opis sekcji z treścia od klienta.</p>
        <a href="/offers" class="ido-btn">Sprawdz oferte</a>
      </div>
      <div class="ido-split__img">
        <img src="URL_ZDJECIA" alt="Opis zdjecia" loading="lazy">
      </div>
    </div>
  </div>
</div>
```

---

## 7. Generator v2

### Co sie zmienia vs v1

| Aspekt | Generator v1 | Generator v2 |
|--------|-------------|-------------|
| Wejscie | config.json | BRIEF_TEMPLATE.md (parsowany przez Claude) |
| CSS | Monolityczny (1140 linii) | 3 warstwy (system + components + theme) |
| HTML | Tylko homepage | Homepage + wszystkie podstrony |
| JS | Jeden plik | Modularny (base + per-component) |
| Jezyki | Tylko PL | PL + EN + DE + custom |
| Testy | Brak | Puppeteer auto-test |
| SEO | Tylko meta | Meta + JSON-LD + OG tags |
| Output | 5 plikow | 10-20 plikow (zalezne od briefu) |

### Nowa struktura config

```json
{
  "client": {
    "name": "EcoCamping Spytkowice",
    "id": "client12345",
    "domain": "ecocamping.com.pl",
    "url": "https://client12345.idosell.com",
    "phone": "+48123456789",
    "email": "kontakt@ecocamping.com.pl",
    "address": {
      "street": "Spytkowicka 10",
      "city": "Spytkowice",
      "zip": "34-116",
      "country": "PL"
    }
  },
  "template": {
    "type": 11,
    "prefix": "ec",
    "header_height": 95,
    "header_class": ".default13"
  },
  "design": {
    "palette": "A",
    "colors": {
      "primary": "#4A6741",
      "secondary": "#8B7355",
      "accent": "#A8B89C",
      "bg": "#F5F1EB",
      "dark": "#2C2C2C",
      "light": "#F7F5F0"
    },
    "fonts": {
      "pair": 3,
      "heading": "DM Serif Display",
      "body": "Inter",
      "google_url": "family=DM+Serif+Display&family=Inter:wght@300;400;500;600"
    }
  },
  "pages": {
    "homepage": {
      "sections": ["hero", "about-split", "offers-cards", "features", "cta", "stats"],
      "hero": {
        "title": "EcoCamping Spytkowice",
        "subtitle": "Glamping w sercu natury",
        "cta_text": "Zarezerwuj pobyt",
        "cta_url": "/offers"
      }
    },
    "subpages": ["o-nas", "galeria", "atrakcje", "faq"],
    "languages": ["pl", "en"]
  },
  "offers": [
    { "name": "Namiot Safari Deluxe", "url": "/offer/1", "img": "URL", "price": "od 299 PLN/noc" },
    { "name": "Namiot Safari Standard", "url": "/offer/2", "img": "URL", "price": "od 199 PLN/noc" }
  ],
  "features": [
    { "icon": "🏕️", "title": "50 namiotów", "desc": "Komfortowe namioty safari" },
    { "icon": "🌲", "title": "5 hektarów", "desc": "Zielony teren nad rzeką" },
    { "icon": "🍳", "title": "Śniadania", "desc": "Domowe śniadania w cenie" }
  ],
  "faq": [
    { "q": "Czy można z psem?", "a": "Tak, zwierzęta są mile widziane." },
    { "q": "Jak dojechać?", "a": "Z Krakowa autostradą A4..." }
  ],
  "seo": {
    "type": "LodgingBusiness",
    "subtype": "Campground"
  }
}
```

### Proces generowania (Claude)

```
1. Claude czyta BRIEF_TEMPLATE.md
2. Claude parsuje → tworzy config (jak wyzej)
3. Claude czyta ido-system-traps.css (warstwa 1)
4. Claude czyta ido-components.css (warstwa 2)
5. Claude generuje client-theme.css (warstwa 3) z config.colors
6. Claude konkatenuje: L1 + L2 + L3 → [PREFIX]_CSS_EDYTOR.css
7. Claude generuje HTML dla kazdej strony z config + komponentow
8. Claude generuje JS (body_bottom) z config
9. Claude generuje HEAD (fonts + viewport)
10. Claude generuje INSTRUKCJA.txt
11. Zapisuje wszystko w DO_WKLEJENIA/
```

---

## 8. Claude Code Skills

### Proponowane komendy

```
/new-client [nazwa]
  → Tworzy folder w mac-files/[nazwa]/
  → Kopiuje DO_WKLEJENIA/ template
  → Tworzy pusty brief

/parse-brief
  → Czyta BRIEF_TEMPLATE.md z biezacego folderu klienta
  → Waliduje (brakujace pola, format telefonu, kolory)
  → Generuje config.json
  → Wyswietla podsumowanie

/generate-all
  → Czyta config.json
  → Generuje WSZYSTKIE pliki do DO_WKLEJENIA/
  → Wyswietla liste wygenerowanych plikow

/generate-css
  → Generuje tylko CSS (3 warstwy → konkatenacja)

/generate-page [nazwa]
  → Generuje jedna strone (np. /generate-page galeria)

/test-site [url]
  → Otwiera strone w Puppeteer
  → Uruchamia testy (font-size, orange, broken imgs, links)
  → Robi screenshoty desktop + mobile
  → Raportuje wyniki

/clients
  → Listuje wszystkich klientow z mac-files/
  → Status: generated / deployed / tested

/update-traps
  → Aktualizuje ido-system-traps.css
  → Regeneruje CSS dla WSZYSTKICH klientow
```

---

## 9. Brief-to-Code Pipeline

### Ulepszony brief

Istniejacy BRIEF_TEMPLATE.md jest dobry. Proponowane rozszerzenia:

**Dodac sekcje:**

1. **Zrodlo zdjec** — linki do zdjec lub "z panelu" (Claude musi wiedziec skad pobrac)
2. **Teksty sekcji** — krotkie opisy dla "O nas", "Dlaczego my" etc.
3. **FAQ** — pytania i odpowiedzi (jesli potrzebne)
4. **Oferty z cenami** — nazwy + ceny + zdjecia URL (lub "z panelu")
5. **Mapa** — wspolrzedne GPS lub adres
6. **Social media** — linki do FB, IG, TripAdvisor

### Workflow parsowania

```
Brief (markdown)
  → Claude parsuje tabele i checkboxy
  → Validacja:
    - Czy telefon jest bez spacji? (+48XXXXXXXXX)
    - Czy kolory sa prawidlowe hex? (#XXXXXX)
    - Czy wybrano fonty?
    - Czy sa zdjecia?
  → Generuje config.json
  → Jesli brakuje danych → pyta usera (AskUserQuestion)
```

### Mapping brief → components

| Brief checkbox | Komponent CSS | HTML template |
|---------------|---------------|---------------|
| Hero (slider) | .ido-hero--slider | hero-slider.html |
| Karty ofert | .ido-cards | offer-cards.html |
| "O nas" / features | .ido-split | split-section.html |
| Lokalizacja / mapa | .ido-map | map-section.html |
| CTA | .ido-cta--dark | cta-section.html |
| Atrakcje okolicy | .ido-features | features-grid.html |
| Galeria | .ido-gallery | gallery-grid.html |
| FAQ | .ido-faq | faq-accordion.html |

---

## 10. Testowanie i QA

### Automatyczne testy (Puppeteer MCP)

```javascript
// Test suite per strona klienta:
const tests = [
  // 1. Font size
  { name: 'body-font-16px',
    check: () => getComputedStyle(document.body).fontSize === '16px' },

  // 2. No system orange
  { name: 'no-orange-#AD5009',
    check: () => !document.querySelector('[style*="#AD5009"], [style*="rgb(173, 80, 9)"]') },

  // 3. Broken images
  { name: 'no-broken-images',
    check: () => [...document.images].every(img => img.naturalWidth > 0) },

  // 4. Broken links
  { name: 'no-broken-links',
    check: () => /* fetch all a[href] and verify */ },

  // 5. Phone format
  { name: 'phone-no-spaces',
    check: () => document.querySelector('a[href^="tel:"]')?.href.match(/^\+?\d+$/) },

  // 6. Viewport meta
  { name: 'viewport-meta-present',
    check: () => !!document.querySelector('meta[name="viewport"]') },

  // 7. Responsive
  { name: 'no-horizontal-scroll',
    check: () => document.body.scrollWidth <= window.innerWidth },

  // 8. Search widget
  { name: 'search-widget-visible',
    check: () => /* na homepage: .iai-search visible */ },
];
```

### Screenshot comparison

```
Per klient, per breakpoint:
- Desktop (1440px)
- Tablet (768px)
- Mobile (375px)

Strony:
- / (homepage)
- /offers
- /offer/[first]
- /contact
- /txt/[first-subpage]
```

### Raport

```
╔═══════════════════════════════════════════════╗
║  TEST REPORT: EcoCamping (client12345)        ║
╠═══════════════════════════════════════════════╣
║  Page: / (homepage)                           ║
║  ✅ body-font-16px                            ║
║  ✅ no-orange                                 ║
║  ✅ no-broken-images                          ║
║  ✅ phone-no-spaces                           ║
║  ✅ viewport-meta                             ║
║  ⚠️  horizontal-scroll (10px overflow)        ║
║  Score: 5/6 (83%)                             ║
╠═══════════════════════════════════════════════╣
║  Page: /offers                                ║
║  ✅ All tests passed                          ║
║  Score: 6/6 (100%)                            ║
╚═══════════════════════════════════════════════╝
```

---

## 11. Dashboard klientow

### Opcja A: Claude Code workflow (rekomendowana)

Zamiast tradycyjnego web dashboard — system komend Claude Code:

```
/clients                    → Lista klientow + status
/client ecocamping          → Szczegoly klienta
/new-client "Nazwa"         → Nowy projekt
/generate-all               → Generuj pliki
/test-site https://...      → Testuj live site
/update-traps               → Aktualizuj CSS base
```

**Zalety:**
- Zero maintenance (nie trzeba hostowac dashboard)
- Claude ma pelny kontekst (brief, config, pliki)
- Natural language queries ("pokaz mi klientow z paleta Nature")
- Zintegrowane z workflow (generowanie + testowanie w jednym flow)

### Opcja B: Lokalny HTML dashboard (alternatywa)

Prosty `index.html` z JavaScript, czytajacy pliki lokalne:

```
┌─────────────────────────────────────────────────┐
│  IdoBooking Client Dashboard                     │
├──────┬──────────────────────────────────────────┤
│      │                                           │
│ [+]  │  Client: EcoCamping Spytkowice           │
│ eco  │  ID: client12345                          │
│ gold │  Template: 11 | Palette: Nature           │
│ mtn  │  Status: ✅ Generated | ⚠️ Not tested    │
│ wawa │                                           │
│ sors │  Files:                                   │
│ najm │  ├── CSS_EDYTOR.css (742 lines)          │
│ ...  │  ├── HEAD.html                            │
│      │  ├── KONIEC_BODY_JS.html                  │
│      │  ├── GLOWNA_PL__cms.html                  │
│      │  └── INSTRUKCJA.txt                       │
│      │                                           │
│      │  [Generate] [Test] [Open Panel]           │
│      │                                           │
└──────┴──────────────────────────────────────────┘
```

### Opcja C: clients.json (baza danych)

Niezaleznie od UI — potrzebujemy centralnej bazy klientow:

```json
{
  "clients": [
    {
      "name": "EcoCamping Spytkowice",
      "id": "client12345",
      "folder": "ecocamping",
      "template": 11,
      "palette": "A",
      "prefix": "ec",
      "status": "deployed",
      "last_generated": "2026-04-10",
      "last_tested": "2026-04-10",
      "test_score": "100%",
      "languages": ["pl", "en"],
      "notes": "50 namiotow safari, sezon V-IX"
    }
  ]
}
```

---

## 12. Plan implementacji

### Faza 1: Fundament (CSS + Komponenty)

**Deliverables:**
1. `ido-system-traps.css` — wyodrebnione trap fixes
2. `ido-components.css` — biblioteka 8 komponentow (hero, split, features, cards, cta, stats, faq, gallery)
3. `ido-base.js` — wspolny JS (reveal, smooth scroll, FAQ toggle, counter, phone fix)
4. Uaktualniony `BRIEF_TEMPLATE.md` z nowymi sekcjami
5. `clients.json` — baza klientow

**Testy:** Wygenerowac CSS dla 1 istniejacego klienta (np. ecocamping) i porownac z oryginalem

### Faza 2: Generator v2

**Deliverables:**
1. Nowy workflow generowania (Claude-based zamiast Python)
2. Szablony HTML dla WSZYSTKICH typow podstron
3. Multi-language support (PL + EN generowane automatycznie)
4. Ulepszony config.json schema
5. Automatyczna konkatenacja 3 warstw CSS

**Testy:** Wygenerowac KOMPLETNA strone dla 1 nowego klienta

### Faza 3: Claude Skills

**Deliverables:**
1. Skill `/new-client`
2. Skill `/generate-all`
3. Skill `/test-site`
4. Skill `/clients`
5. Workflow: brief → parse → generate → output

**Testy:** End-to-end: brief → pliki gotowe do wklejenia

### Faza 4: Testowanie

**Deliverables:**
1. Test suite Puppeteer (8+ testow per strona)
2. Screenshot comparison (3 breakpoints)
3. Raport HTML/markdown z wynikami
4. Integracja z `/test-site` skill

### Faza 5: Rollout

**Deliverables:**
1. Migracja 1-2 istniejacych klientow na nowy system (weryfikacja)
2. Dokumentacja (README, CLAUDE.md update)
3. Szkolenie workflow (jak uzywac systemu)

---

## 13. Otwarte pytania

### Do usera:

1. **Jarvis** — co to jest? AI assistant? Automation tool? Custom software?
   - Jak go chcesz polaczyc z tym systemem?
   - Czy Jarvis ma API?

2. **IdoBooking API** — czy masz dostep do API panelu klienta?
   - Gdyby tak — moglibysmy automatycznie wklejac pliki (zamiast recznego copy-paste)
   - Jakie masz uprawnienia w panelach klientow?

3. **Priorytet klientow** — na jakim kliencie chcesz testowac pierwszy?
   - Nowy klient (od zera)?
   - Istniejacy klient (migracja)?

4. **Zdjecia** — skad bierzesz zdjecia?
   - Klienci dostarczaja?
   - Z panelu IdoBooking (slider/oferty)?
   - Wikimedia Commons?
   - Stock?

5. **Budzet na narzedzia** — czy moge uzyc:
   - Node.js / npm (do build scriptu)?
   - Python (do generatora)?
   - Czy wolisz ze wszystko bylo czysto w Claude Code (bez zewnetrznych narzedzi)?

6. **Jak klient daje brief?** —
   - Email z opisem?
   - Wypelnia formularz?
   - Rozmowa telefoniczna (Ty notujesz)?
   - Klient wypelnia BRIEF_TEMPLATE.md?

7. **Co z obecnym portfolio?**
   - Czy istniejacych 18 klientow chcesz przeniesc na nowy system?
   - Czy nowy system jest tylko dla NOWYCH klientow?
   - Ktory klient jest "wzorcowy" (najlepiej zrobiony)?

8. **Desktop vs Mobile priority?**
   - Jaki % uzytkownikow jest na mobile?
   - Czy mobile-first czy desktop-first?

---

## Podsumowanie

Ten brainstorm opisuje:
- **Pelna analize** istniejacego systemu (18 klientow, 71 templatek, 18 trapow)
- **3-warstwowa architekture CSS** rozwiazujaca problem duplikacji
- **Biblioteke 8 komponentow** pokrywajaca 90% potrzeb
- **Pipeline brief → kod** z Claude jako silnikiem
- **5-fazowy plan implementacji**
- **System testowania** z Puppeteer MCP

Nastepny krok: odpowiedzi na otwarte pytania (sekcja 13) → potem implementacja Fazy 1.

---
*Wygenerowano przez Claude Code | Pipeline v1.0*
