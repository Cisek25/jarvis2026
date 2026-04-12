# JARVIS — IdoBooking Site Builder

## Co to jest JARVIS
Automatyczny system tworzenia i zarządzania stronami klientów IdoBooking.
Lokalna aplikacja Node.js z dashboardem w przeglądarce (localhost:3000).
Cel: każdy pracownik może stworzyć nową stronę klienta bez wiedzy o CSS/HTML.

## Uruchomienie
```
cd JARVIS
node server.js
```
Lub kliknij `start.bat` (Windows). Dashboard otworzy się na http://localhost:3000

## Struktura projektu

```
JARVIS/
├── server.js              ← Serwer HTTP (localhost:3000)
├── start.bat              ← Windows launcher
├── package.json           ← Metadane projektu
├── CLAUDE.md              ← TEN PLIK — kontekst dla Claude
│
├── core/                  ← SILNIK (do zbudowania)
│   └── (generator.js, css-merger.js, html-builder.js, exporter.js)
│
├── data/                  ← DANE WSPÓŁDZIELONE
│   ├── clients.json       ← 18 klientów z kolorami, fontami, statusami
│   ├── palettes.json      ← 6 palet kolorów (A-F)
│   └── fonts.json         ← 8 par fontów Google
│
├── library/               ← BIBLIOTEKA KOMPONENTÓW
│   ├── css/
│   │   ├── layer1-traps.css       ← 799 linii — bug-fixy IdoBooking (wspólne)
│   │   └── layer2-components.css  ← 961 linii — komponenty ido-* (wspólne)
│   ├── js/
│   │   └── ido-base.js            ← 489 linii — 10 modułów JS (wspólne)
│   └── templates/
│       └── component-templates.json ← 13 szablonów HTML z {{placeholderami}}
│
├── clients/               ← FOLDERY KLIENTÓW (gotowe pliki)
│   ├── ecocamping/        ← DO_WKLEJENIA, CSS, HTML, JS
│   ├── GoldenApartments/
│   ├── MountainPrestige/
│   ├── SORS/
│   ├── villa-kapitanska/
│   ├── wawabed/
│   └── ... (17 klientów)
│
├── dashboard/             ← FRONTEND UI
│   └── index.html         ← Dashboard HTML (7 widoków, wizard, builder)
│
├── docs/                  ← DOKUMENTACJA
│   ├── BRAINSTORM-PIPELINE-V1.md
│   ├── 01-mega-prompt-idobooking-agent-swarm.md
│   └── 02-plan-30-dni-product-owner.md
│
└── archive/               ← STARE PLIKI (referencja)
    ├── _MASTER_TEMPLATE/  ← Stary template master
    ├── _GENERATOR/        ← Stary Python generator
    ├── claudedocs/        ← Dokumentacja, audyty CSV
    ├── cms_pages/         ← CMS pages (SORS?)
    └── crewai-idobooking/ ← Próba z CrewAI
```

## Architektura CSS — 3 warstwy

IdoBooking to SaaS z ograniczonym CMS. Wklejamy kod w 4 miejsca:
1. Arkusz stylów CSS
2. HEAD (meta, Google Fonts)
3. body_top (sekcje HTML)
4. body_bottom (JavaScript)

CSS budujemy z 3 warstw:
- **Warstwa 1** (layer1-traps.css): bug-fixy systemu IdoBooking — NIGDY nie zmienia się per klient
- **Warstwa 2** (layer2-components.css): komponenty z prefixem ido-* — NIGDY nie zmienia się per klient
- **Warstwa 3** (generowana): :root z kolorami + hardcoded hex — JEDYNE co się zmienia per klient (~50-100 linii)

Konkatenacja: L1 + L2 + L3 = finalny CSS wklejany do panelu.

## Komponenty (13 sztuk)
hero, split, split-reverse, features, cards, cta, cta-dark, stats, faq, gallery, about, map, testimonials

Każdy klient używa tych samych komponentów — różni się tylko:
- Kolory (6 zmiennych CSS: primary, secondary, accent, bg, dark, light)
- Fonty (heading + body z Google Fonts)
- Treść (teksty, zdjęcia, telefon, email)

## Klienci (18)
EcoCamping, GoldenApartments, MountainPrestige, WawaBed, SORS, Najmar,
Villa Kapitańska, Mazurski Chill, Madera, Dobry Wiatr, CityApart Szczecin,
Grzybek, Piekary 13, Willa Racławicka, PerfectApart, WCA, WawaBed2

## Dashboard — 7 widoków
1. Dashboard — statystyki, lista klientów
2. Klienci — tabela z filtrami
3. Nowy Klient — wizard 5 kroków
4. CSS Generator — łączenie 3 warstw
5. Page Builder — komponenty drag & drop
6. Podgląd Kodu — CSS/HEAD/JS/HTML/Instrukcja
7. Checklist — interaktywna lista z progress bar

## Wyróżnione oferty — OBOWIĄZKOWY WZORZEC

System IdoBooking generuje na stronie głównej element `.container-hotspot` (wewnątrz `.cmshotspot`)
z karuzelą Slick zawierającą oferty zaznaczone jako "Wyróżnione" w panelu (Oferta → Oferty → checkbox).

**ZAWSZE** implementujemy wyróżnione oferty w ten sposób (wzorzec MADERA/NAJMAR):

### Jak to działa (3 elementy)

#### 1. CSS — ukryj systemowy carousel
```css
.container-hotspot {
  display: none !important;
}
```
System generuje brzydki slick carousel — ukrywamy go i budujemy własne karty.

#### 2. JS (body_bottom) — czytaj dane i buduj karty
Skrypt w `<script>` na końcu body:
- Szuka `.container-hotspot` w DOM
- Iteruje po `.slick-slide:not(.slick-cloned) .offer` (WAŻNE: pomijaj klony slick!)
- Fallback: jeśli slick nie zainicjalizowany → `.offer` bezpośrednio
- Deduplikuje po `href` (slick tworzy duplikaty)
- Z każdej `.offer` wyciąga:
  - `href` → z `a.object-icon`
  - `img` → z `img[data-src]` lub `img[src]`
  - `title` → z `h3 a`
  - `desc` → z `.offer__description`
  - `area` → z `.accommodation-meters` (regex: `/([\d,.]+)\s*m/i`)
  - `guests` → z `.accommodation-roomspace` (regex: `/(\d+)/`)
  - `price` → z `.offer__price .price` (regex: `/([\d,.]+)/`)
- Buduje HTML kart z klasami `{prefix}-offer-card` i wstawia do grida
- Usuwa klasę fallback z grida (`.nj-featured-fallback` / analogiczną)

#### 3. CSS — styluj własne karty
Karty `{prefix}-offer-card` z:
- Zdjęcie (aspect-ratio 16/10, object-fit cover, hover scale)
- Badge ceny (absolute top-left na zdjęciu, kolor brand)
- Body: tytuł, opis (line-clamp 3), meta (m² + osoby z ikonkami SVG)
- Przycisk CTA (kolor brand)
- Grid: 2 kolumny desktop, 1 kolumna mobile (breakpoint 680px)

### Prefiks klas per klient
Każdy klient ma swój prefiks CSS: `md-` (Madera), `nj-` (Najmar), itd.
Klasy kart to: `{prefix}-offer-card`, `{prefix}-offer-card__img`, `{prefix}-offer-card__name`, etc.

### Referencyjne implementacje
- **MADERA** (zaawansowana, z grupowaniem po markach):
  - CSS: `clients/madera/madera.css` → sekcja "WYRÓŻNIONE OFERTY"
  - JS: `clients/madera/DO_WKLEJENIA/HOMEPAGE_PL__body_bottom.html` → "CUSTOM OFFER CARDS"
- **NAJMAR** (prosta, bez grupowania):
  - CSS: `clients/najmar/DO_WKLEJENIA/NJ_ARKUSZ_STYLOW.css` → sekcja §6 + §6b
  - JS: `clients/najmar/DO_WKLEJENIA/GLOWNA_PL__body_bottom.html` → §8

### CMS HTML (body_top / edytor treści)
W sekcji "Nasze pokoje/apartamenty" dodaj:
- Nagłówek sekcji + subtitle
- Pusty grid z klasą fallback (np. `.nj-apartments__grid.nj-featured-fallback`)
- Opcjonalnie: hardcoded karty jako fallback (ukryte CSS-em)
- JS w body_bottom wypełni grid automatycznie

### Kiedy stosować
- **Nowa strona**: ZAWSZE dodawaj wyróżnione oferty na stronę główną
- **Aktualizacja**: jeśli klient ma wyróżnione oferty w panelu a na stronie ich nie widać,
  dodaj ten mechanizm (CSS hide + JS reader + custom cards)
- **Bez wyróżnionych**: jeśli `.container-hotspot` nie istnieje na stronie, skrypt się nie odpali — bezpieczne

## GitHub repo
https://github.com/Cisek25/claude-strony — kopia plików klientów

## PLAN ROZWOJU

### FAZA 1 — Porządek (TERAZ) ✅
- [x] Zebrać wszystko w jeden folder JARVIS
- [x] Struktura: library/ data/ clients/ dashboard/
- [x] Serwer localhost:3000
- [ ] Przetestować dashboard po przeniesieniu
- [ ] Przetestować CSS 3-warstwowy na jednym kliencie (ecocamping)

### FAZA 2 — Silnik generatora
- [ ] core/generator.js — generuje L3 (theme CSS) z config klienta
- [ ] core/css-merger.js — automatyczne L1+L2+L3
- [ ] core/html-builder.js — składa strony z szablonów
- [ ] core/exporter.js — pakiet DO_WKLEJENIA/ jednym kliknięciem

### FAZA 3 — Dashboard v2
- [ ] Podgląd live (iframe z wygenerowaną stroną)
- [ ] Import istniejących klientów (z DO_WKLEJENIA)
- [ ] Export ZIP
- [ ] Wersje językowe (EN, DE)

### FAZA 4 — Inteligencja (opcjonalnie, wymaga API)
- [ ] Claude API do generowania treści/tłumaczeń
- [ ] Automatyczny audyt kodu (Puppeteer)
- [ ] Podpowiedzi dla operatora
