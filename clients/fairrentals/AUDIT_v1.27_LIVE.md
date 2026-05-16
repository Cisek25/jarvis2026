# Fair Rentals — Audyt live po wklejeniu v1.27

**Data**: 2026-05-12
**Środowisko**: https://client58360.idobooking.com/ (production)
**Viewporty**: desktop 1440×900, mobile 500×844
**Narzędzie**: chrome-devtools playwright
**Screenshots**: `.claude/worktrees/vigorous-tereshkova-20d71e/audit-v1.27/*.png` (12 plików)

---

## ✅ v1.27 WERYFIKACJA — wszystko na live

Na homepage PL potwierdzone (script eval z DOM):

| Element | Oczekiwane | Live | Status |
|---------|-----------|------|--------|
| Hero lead | "21 starannie urządzonych apartamentów... Booking 9.6" | ✓ obecne | ✅ |
| Hero badge | 9.6 | 9.6 | ✅ |
| Hero meta strip | 9.6 / 4.7 / 21 / 16:00–11:00 | 9.6 / 4.7 / 21 / 16:00–11:00 | ✅ |
| Stats-asym hero num | 21 | 21 | ✅ |
| Stats-asym cells | 9.6 / 4.7 / 24h | 9.6 / 4.7 / 24h | ✅ |
| Trust bar | 9.6 / 4.7 / 21 / 200+ | 9.6 / 4.7 / 21 / 200+ | ✅ |
| Button outline | "Zobacz wszystkie 21 apartamentów" | ✓ | ✅ |
| `9.8` anywhere | brak | **null** (0 wystąpień) | ✅ |
| `19 apartament` | brak | **false** | ✅ |

Schema.org `aggregateRating.ratingValue` = `9.6` (zweryfikowane w HEAD). Wszystkie 3 języki PL/EN/DE potwierdzone — homepage EN ma `"21 thoughtfully furnished apartments... Booking 9.6"` (skrypt EN sprawdzony osobno).

---

## 🔴 BUGI POTWIERDZONE (wymagają fix w v1.28 lub akcji Damiana)

### 🔴 KRYTYCZNY #4: Cytat Karoliny Banaś nakładający się na widget rezerwacji

**Lokalizacja**: PL homepage (i EN/DE z dużą szansą — ten sam HTML), desktop + mobile
**Screenshots**: `02-pl-desktop-search-magazine-overlap.png`, `12-mobile-pl-search-magazine.png`

**Symptom**: White search card (`.fr-search-banner` z `position: absolute`, `z-index: 10`, `bottom: 99px`) wystaje pod hero-wrap i nakrywa pierwszą linię cytatu magazine ("Bardzo rzadko mówimy „nie da się""). Cytat zaczyna się dosłownie 2px pod search bar bottom (y=1184 vs y=1182).

**Diagnoza DOM**:
```
hero-wrap height: 1283px  (CSS min-height: 900px ale content wymusza 1283)
└── search-banner: position absolute, bottom 99px → renderuje się na y=1018-1184
fr-magazine: top=954 (w nast. fullpage section z fp-auto-height)
└── magazine_quote: top=1182  ← O 2px niżej niż search.bottom = 1184
```

**Root cause**: hero-wrap (zawiera hero text + meta strip + search bar w `bottom: 99px`) renderuje 1283px ale jego fullpage section #1 ma 900px height (vh-snap). Hero-wrap "ucieka" z sekcji #1 o 383px → search bar (absolute bottom 99px) ląduje wewnątrz sekcji #2 (gdzie żyje magazine).

**Fix v1.28** (3 opcje, rekomendacja **C**):
- **A) Zmniejszyć hero-wrap height** — redukcja padding-bottom (clamp 280-440 desktop, v1.14) → trudne bez popsucia hero layoutu
- **B) Dodać margin-top do `.fr-magazine`** ≥ 100px desktop / 60px mobile → szybki visual fix, dead space pod hero
- **C) **Reorganizacja**: Wyciągnąć `.fr-search-banner` z hero-wrap, umieścić jako osobną sekcję między hero a magazine** → trwałe rozwiązanie, eliminuje absolute positioning i instinct 045 walki

Decyzja JARVIS: **opcja C** najbardziej zgodna z instinct 045 (system-widget-hide-replace) — search staje się normalnym blokiem w przepływie. Tradeoff: hero traci floating-overlap look z v1.10/v1.11, ale zyskujemy stabilność i brak overlap.

---

### 🔴 KRYTYCZNY #6: "..." w menu głównym

**Lokalizacja**: PL/EN/DE menu na każdej stronie
**DOM evidence**: `<li class="menuOverflow nav-item"><span>...</span>...pokaż więcej menu</li>` + `Kontakt` z `visible: false` (wepchnięty w overflow)

**Root cause**: System IdoBooking auto-collapsuje menu items nieieszczące się w navbar. Trigger: "**Najem korporacyjny we Wrocławiu**" (32 znaki, pełne H1) zajmuje za dużo miejsca → "Kontakt" wypada za krawędź → system pokazuje "..." z dropdown.

**Fix**: **Damian / klient w panelu IdoBooking** — Strony / CMS / /txt/202:
- Pole "**Krótka nazwa**" lub "**Tytuł w menu**" (zależnie od interfejsu): wpisać "**Dla Biznesu**" lub "**Najem korporacyjny**"
- Pole "Nazwa" (H1) zostaw "Najem korporacyjny we Wrocławiu" (marketing-driven)
- Analogicznie dla EN/DE: "For Business" / "Für Unternehmen"

Po zmianie "..." zniknie automatycznie. Patrz wzorzec menu z `SEO_TYTULY_FAIRRENTALS.md` sekcja NAZWY DO MENU (juz tam są krótkie etykiety).

---

### 🟠 #3: Grafiki EN/DE z PL napisami w pikselach

**Lokalizacja**: OBSLUGA_NAJMU PL/**EN**/**DE** sekcje narrative + (15.jpg w OBSLUGA_EN gallery)
**Screenshots**: `06-frontpage-15.png`, `09-frontpage-13.png`, `10-frontpage-14.png`

**3 grafiki znalezione (PL tekst baked-in)**:

| Plik | Tekst PL na obrazie | Gdzie używany |
|------|---------------------|---------------|
| `/images/frontpageGallery/pictures/large/1/0/13.jpg` | "**Kompleksowe zarządzanie najmem**" + checklist (Obsługa / Rezerwacje / Sprzątanie / Naprawy / Przeglądy techniczne) | OBSLUGA_NAJMU PL/EN/DE — pierwszy `.fr-narrative__split` (alt EN OK) |
| `/images/frontpageGallery/pictures/large/1/0/14.jpg` | "**Zarządzanie najmem? Z nami to proste**" + "Z Fair Rentals Twoje mieszkanie nie tylko zarabia, ale też zyskuje na wartości. Co oferujemy?" | OBSLUGA_NAJMU PL/EN/DE — sekcja Cztery kroki |
| `/images/frontpageGallery/pictures/large/1/0/15.jpg` | "**Inteligentne zarządzanie ceną**" + "śledzimy rynek i dostosowujemy stawki, by zwiększyć Twój zysk" | OBSLUGA_NAJMU EN (na innych nieuzywany; alt: "FAIR RENTALS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ - image 1") |

**Fix**: zgodnie z propozycją klienta — **czyste zdjęcia (bez tekstu) + treść jako HTML overlay**. Realizacja:
1. **Klient dostarcza 3 nowe pliki**: czyste fotografie odpowiadające tematycznie (klucze, monety, etc.) bez tekstu
2. Damian wgrywa do panelu zastępując 13.jpg, 14.jpg, 15.jpg (lub jako nowe 16-18.jpg)
3. **JARVIS v1.28+** dodaje absolutny pozycjonowany overlay z tekstem nad obrazami w HTML:
   - PL: zachowane oryginalne stringi
   - EN: "Comprehensive rental management" / "Rental management made simple" / "Smart pricing"
   - DE: "Umfassende Mietverwaltung" / "Mietverwaltung leicht gemacht" / "Intelligentes Pricing"
4. CSS §93 (nowa sekcja) dla `.fr-image-overlay` patternu

Alternatywa (mniej elegancka): klient generuje 6 dodatkowych plików graficznych — wersja EN i DE każdej z 3 grafik (= 9 plików total), Damian wgrywa per język.

---

### 🟡 #5: Format cen "od/noc" — niespójność między home i listing

**Status**: ceny SĄ na wszystkich 21 apartamentach (script potwierdził 21/21 z cenami). Bug pierwotny "**brak wyświetlanych cen**" rozwiązany przez klienta (Damian zaktualizował cennik w panelu).

**Pozostały issue**: format niespójny:
- **Home page** (custom JS parser): `od 230 zł / noc`, `od 404 zł / noc`
- **/offers listing** (system default): `Cena już od 229,50 zł` (brak `/noc`, są grosze)

**Fix v1.30** (zaplanowane razem z filtrami zaawansowanymi): CSS override w `.object-price` na /offers — ukryć "Cena już od" `<small>`, dodać `::after` z " / noc". Albo zostawić "Cena już od" (system) — klient decyduje.

---

### 🟠 NOWY #7 (znalezione przy okazji): Panel SEO nie zaktualizowany do v1.27

**Symptom**: H1 na /offers EN pokazuje "**19** thoughtfully furnished homes across 4 districts" — to "Podpis pod nazwą" z panelu IdoBooking. **Damian nie wkleił SEO_TYTULY_FAIRRENTALS.md do panelu po v1.27 update**.

**Lokalizacje wymagające update w panelu**:

| Strona | Pole | Stara wartość | Nowa wartość (z v1.27 SEO_TYTULY) |
|--------|------|---------------|-------------------------------------|
| /pl/offers | Podpis pod nazwą | "19 starannie..." | **"21 starannie urządzonych mieszkań w 4 dzielnicach"** |
| /en/offers | Podpis pod nazwą | "19 thoughtfully..." | **"21 thoughtfully furnished homes across 4 districts"** |
| /de/offers | Podpis pod nazwą | "19 sorgfältig..." | **"21 sorgfältig eingerichtete Wohnungen in 4 Stadtteilen"** |
| /pl/ | META Opis | "...19 apartamentów..." | "**21 apartamentów... Booking 9.6**" |
| /en/ | META Opis | "...19 apartments... 9.8" | "**21 apartments... Booking 9.6**" |
| /de/ | META Opis | "...19 Apartments... 9.8" | "**21 Apartments... Booking 9.6**" |
| /pl/txt/200 | Nazwa H1 | "ATRAKCJE WROCŁAWIA" (z cudzysłowami?) | "Atrakcje Wrocławia — co warto zobaczyć" |
| /pl/txt/201 | Nazwa H1 + Podpis | obecnie Podpis = H1 (duplikat) | Nazwa = "Obsługa najmu krótkoterminowego", Podpis = "Profesjonalny operator..." |
| /pl/txt/202 | **Krótka nazwa / Tytuł w menu** | (brak — pokazuje pełne H1) | **"Dla Biznesu"** ← FIX bug #6 |

**Akcja**: Damian czyta `DO_WKLEJENIA/SEO_TYTULY_FAIRRENTALS.md`, kopiuje pole-po-polu do panelu dla wszystkich 7 stron × 3 języki = 21 zestawów + sekcja NAZWY DO MENU na dole pliku.

---

### 🟠 NOWY #8: Double H1 na podstronach /txt/*

**Symptom**: Na `/pl/txt/201/Obsluga-najmu` znalezione DWA `<h1>`:
- H1 #1 (system z panelu "Podpis pod nazwą"): "Profesjonalny operator dla Właścicieli mieszkań we Wrocławiu"
- H1 #2 (nasze HTML w `.fr-page-hero__inner`): "Obsługa najmu krótkoterminowego"

**SEO impact**: dwa H1 na jednej stronie = duplicate H1, Google nie wie co jest głównym tytułem strony. Negatywny ranking signal.

**Fix v1.28**: w PL/EN/DE OBSLUGA_NAJMU + DLA_BIZNESU + ATRAKCJE — zmienić `<h1 class="fr-page-hero__title">` na `<p class="fr-page-hero__title">` (zachować styling). System H1 z panelu pozostaje jedynym H1 strony.

CSS §93 → już ma `.fr-page-hero__title` zdefiniowane, wystarczy zmiana tagu w HTML, styling przepisze się.

---

### 🟠 NOWY #9: Slug niespójność EN /txt/201

**Symptom**: URL `/en/txt/201/Short-term-rental-management` redirektuje do `/en/txt/201/Wroclaw-apartments`. System canonical slug dla EN /txt/201 = "Wroclaw-apartments" — błędne (powinno być "Short-term-rental-management" lub podobny EN slug).

**Fix**: Damian w panelu → Strony / CMS / /en/txt/201 → pole "URL (slug)" zmień na: `Short-term-rental-management` lub `Property-management`. Analogicznie sprawdzić slugi DE.

---

## ✅ BUGI ROZWIĄZANE / NIEOBECNE

| # | Pierwotny feedback | Status | Uwaga |
|---|---------------------|--------|-------|
| #5 | Karty bez cen "od/noc" | ✅ częściowo | Ceny SĄ (21/21). Format format home vs listing — v1.30 |
| #2 | Niespójność ocen 9.6/9.8 | ✅ rozwiązane v1.27 | Unifikacja do 9.6 wszędzie |
| #1 | 19 apartamentów | ✅ rozwiązane v1.27 | Wszędzie 21 |

---

## Plan akcji do v1.28 (rekomendacja JARVIS)

### Akcje DAMIANA (panel IdoBooking) — wykonać BEFORE v1.28 build
1. **Skopiować SEO_TYTULY_FAIRRENTALS.md do panelu** (7 stron × 3 języki + sekcja NAZWY DO MENU)
2. **Ustawić "Krótka nazwa" dla /txt/202** w PL/EN/DE → "Dla Biznesu" / "For Business" / "Für Unternehmen" (FIX bug #6)
3. **Slug EN /txt/201** zmienić na `Short-term-rental-management`
4. **Zweryfikować slugi DE** wszystkich /txt/* podstron

### Akcje KLIENTA (Agnieszka + Małgorzata)
1. **Dostarczyć 3 czyste zdjęcia** (bez tekstu PL) do podmiany 13/14/15.jpg w panelu
2. **Wskazać dzielnice 2 nowych apartamentów** (które dodały portfel z 19 do 21) — dla update sekcji Districts
3. **Dostarczyć portrety + bio** Agnieszki i Małgorzaty (do v1.28 — sekcja "O nas")

### Akcje JARVIS w v1.28 (build)
1. **Bug #4 fix**: wyciągnąć `.fr-search-banner` z `.fr-hero-wrap`, umieścić jako osobną sekcję między hero a magazine (opcja C). CSS §93 search-banner-standalone.
2. **Bug #8 fix**: zmienić `<h1 class="fr-page-hero__title">` → `<p class="fr-page-hero__title">` w OBSLUGA / DLA_BIZNESU / ATRAKCJE × 3 jęz.
3. **Sekcja "O nas"** (zaplanowane v1.28) — czeka na portrety + bio
4. **Bug #3 prep**: kod HTML overlay nad obrazami (CSS §94) — gotowe do podpięcia gdy klient dostarczy czyste zdjęcia. PL stringi już w HTML, EN/DE tłumaczenia dodać.

### v1.29+ (zatwierdzone)
- v1.29: Dwa modele współpracy 8% / 10% (tabela na OBSLUGA_NAJMU)
- v1.30: Filtry zaawansowane + fix format cen #5
- v1.31: Blog → Baza wiedzy

---

## Screenshots audytu (12 plików w `audit-v1.27/`)

| Plik | Co pokazuje |
|------|-------------|
| `01-pl-desktop-hero.png` | PL homepage scroll=0 desktop — hero clean ✅ |
| `02-pl-desktop-search-magazine-overlap.png` | **BUG #4** — search bar nakrywa cytat (desktop) |
| `03-pl-offers-cards.png` | /offers PL listing — ceny widoczne, filtry system |
| `04-pl-obsluga-fullpage.png` | OBSLUGA PL fullpage thumbnail |
| `05-system-slider-5jpg.png` | System parallax photo (Wrocław aerial, bez tekstu) |
| `06-frontpage-15.png` | **BUG #3** — 15.jpg "Inteligentne zarządzanie ceną" |
| `07-frontpage-11.png` | 11.jpg = 404 (klient usunął) |
| `08-frontpage-12.png` | 12.jpg = 404 (klient usunął) |
| `09-frontpage-13.png` | **BUG #3** — 13.jpg "Kompleksowe zarządzanie najmem" |
| `10-frontpage-14.png` | **BUG #3** — 14.jpg "Zarządzanie najmem? Z nami to proste" |
| `11-mobile-pl-home.png` | Mobile PL home scroll=0 — hero + meta strip OK |
| `12-mobile-pl-search-magazine.png` | **BUG #4 na mobile** — search nakrywa cytat |

---

## Notatki techniczne dla v1.28

- CSS aktualnie 302 KB / 300 KB hard limit IdoBooking — **cleanup wymagany w v1.28** przed dodaniem nowych reguł (port-by-sed §72-§77 obsolete .iai-search overrides do wycięcia)
- v1.28 oczekiwany przyrost: ~6-8 KB (CSS §93 search-banner-standalone + CSS §94 image-overlay + ~3KB HTML zmiana w tagach H1→P)
- Po v1.28 cleanup target: **CSS ≤ 290 KB** (soft buffer 10KB pod limit)
