# Fair Rentals — Release Notes v1.28

**Data**: 2026-05-12
**Zakres**: Hotfix UX hero (Damian feedback) + bug fix audytu + CSS cleanup
**CSS size**: 298.8 KB / 300 KB hard limit (z 1.2 KB buforem)

---

## Co się zmieniło

### §94 — Hero CENTERED + search bar INLINE pod hero (poprawka §93)

**Feedback Damiana po wklejeniu §93**: *"musisz to jakos zmienić, zeby ten cały nagłówek H1 itp tez mieścił się na stornie głównej a pod nim była wyszukiwarka, teraz przesunąłeś go do lewej"*

§93 zrobiło hero full-width ale tekst left-aligned + search bar absolute bottom = wszystko rozjechane. §94 nadpisuje §93:

**Fix CSS §94** (8 reguł, ~3 KB):
- **§94a Hero-wrap = flex column centered**: `display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; padding clamp(96-160 / 48-96); gap clamp(28-56)` — content wycentrowany pionowo w viewport
- **§94b Subtelny gradient na hero-wrap**: `::before linear-gradient(180deg, 0.45→0.20→0.50)` — pokrywa FULL viewport (nie hero-asym box) = zero "kwadratu"
- **§94c Hero-asym = container card centered**: `max-width: 1080; display: flex column; align-items: center` + `::after { display: none }` (relikt §75/§93 wycięty)
- **§94d Hero text wszystko centered**: title/lead/CTA/meta + kicker → `text-align: center` + `align-items: center` + `justify-content: center`
- **§94e Search bar RELATIVE (nie absolute)**: position: relative + max-width: 1100 + margin: 0 auto = inline pod hero, w tym samym viewport
- Mobile @991 + @480: `min-height: auto` (naturalna wysokość) + mniejsze gap/padding

**Efekt na live (po wklejeniu CSS)**:
- Hero text WYCENTROWANY (kicker / H1 / lead / CTA / meta strip)
- Search bar INLINE pod meta strip, ten sam viewport
- Brak ciemnego "kwadratu" w środku — subtle gradient na pełnej szerokości viewportu
- Mobile: naturalna wysokość, content scrolluje jeśli za wysoki

---

### §95 — Kicker redesign (Damian: "ZAUFANIE GOŚCI słabo widoczne, powtarzają się")

**Problem**: `.fr-kicker` był renderowany jako żółty tekst (#E2D700) na pink/cream pill bg (`rgba(231,187,186,0.30)`) → kontrast WCAG fail + na każdej podstronie kilka takich pillów = wizualny szum.

**Fix CSS §95** (5 reguł, ~2.8 KB):
- **§95a**: `.fr-kicker` — usuń pill bg (`transparent`), padding 0, `color: text-dark`, font 13→11px, letter-spacing 2.8px, opacity 0.92 (minimal eyebrow label)
- **§95b**: `::before` horizontal line **28×1.5px** w `--fr-primary-deep` (#8A7300, AA contrast na cream) — yellow accent zachowany, ale wizualnie spokojny
- **§95c**: Kicker w DARK sections (magazine, stats-asym hero, trust-bar, final-cta, search-banner) → kolor `--fr-primary` zachowany (na ciemnym tle widoczny)
- **§95d**: `.fr-stats-asym__hero-kicker` (osobna klasa) — to samo treatment z linią
- **§95e**: Page-hero kicker (subpages /txt/*) — `background: transparent; border-radius: 0` (minimal)

**Efekt**: kickery na cream bg teraz `— ZAUFANIE GOŚCI` (linia żółta + ciemny tekst), powtarzalność akceptowalna, AA contrast OK.

### CSS Cleanup #2 — usunięte §79 + §83 (-2.7 KB)

Po dodaniu §95 CSS osiągnął 302.4 KB → przekroczony 300 KB hard limit. Wycięte obsolete:
- **§79 (v1.10)**: search bar `margin-top: -110px` overlap z hero. §94 z `position: relative` całkowicie unieważnia.
- **§83 (v1.14)**: search bar `bottom: clamp(72-144)` + hero-asym `padding-bottom: clamp(280-440)`. §94 z `position: relative` + flex-column override.

Razem -88 linii / -2.7 KB. CSS: **302.4 → 299.8 KB** (z 240 B buforu pod limit).

---

### §93 → ZASTĄPIONE przez §94 (cofnięte left-align + absolute search)

**Original §93 feedback** (był OK ale niekompletny): *"usuń tą czarną poświatę fr asylum chyba jakies taki, kwadrat, daj o wiele wyżej wyszukiwarkę na głównej stronie"*

**Diagnoza chrome-devtools**: `.fr-hero-asym` renderował się jako **760×1283** (nie full-width!), bo `display: flex` bez explicit width = natural width based on `__text max-width: 760`. Dark `::after` gradient 115deg pokrywał tylko ten 760px prostokąt → wizualnie wyglądało jak ciemna ramka w centrum nad systemową panoramą Wrocławia.

**Fix CSS §93** (7 reguł, ~3 KB):
- (a) `.fr-hero-asym { width: 100% !important; max-width: none; align-self: stretch }` — full-width zamiast 760 centered
- (b) `::after` **radial gradient** ellipse 75%×90% at 28% 50% zamiast linear 115deg → overlay fadeuje do transparent na prawej stronie, eliminuje wizualny "kwadrat"
- (c) `.fr-hero-asym__text { max-width: 760px; margin-left: 0 }` — tekst zachowuje swoją szerokość ale wewnątrz full-width hero (left-aligned)
- (d) `min-height: 100vh → 78vh` (desktop) / `68vh` mobile / `62vh` <480 — krótszy hero
- (e) `padding-bottom: clamp(220-360) → clamp(140-220)` — mniej dead space na dole hero
- (f) Search bar: `bottom: clamp(72-144) → clamp(40-90)` desktop, `clamp(24-56)` mobile = **search bar przesunięty wyżej w viewport**
- (g) Mobile @991 radial gradient z centrum (ellipse 110%×95% at 50% 50%) — lepsza czytelność na portrait

**Efekt na live (po wklejeniu CSS)**:
- Hero full-width: panorama Wrocławia widoczna na całej szerokości, tekst hero left-aligned z miękkim radial fade-out po prawej
- Search bar widoczny **w viewport bez skrolu** na desktop 1440×900 (poprzednio: poza fold, wymagał scroll ~280px)
- Mobile: search bar również w viewport (poprzednio: dół ekranu, kosztem cookie banneru zasłaniającego)

---

### Bug #8 audytu — Double H1 wyeliminowany (9 plików HTML)

Audyt v1.27 wykrył podwójny `<h1>` na podstronach /txt/*:
- H1 #1 (system z panelu "Podpis pod nazwą") — np. "Profesjonalny operator dla Właścicieli mieszkań we Wrocławiu"
- H1 #2 (nasze HTML w `.fr-page-hero__inner`) — np. "Obsługa najmu krótkoterminowego"

SEO impact: Google nie wie co jest głównym tytułem strony → negatywny ranking signal.

**Fix**: zmieniono `<h1 class="fr-page-hero__title">` → `<p class="fr-page-hero__title">` w 9 plikach (styling przejęty z klasy, brak zmian wizualnych):

| Plik | Stary H1 | Status |
|------|----------|--------|
| OBSLUGA_NAJMU_PL__body_top.html | "Obsługa najmu krótkoterminowego" | ✅ → p |
| OBSLUGA_NAJMU_EN__body_top.html | "Short-term rental management" | ✅ → p |
| OBSLUGA_NAJMU_DE__body_top.html | "Verwaltung der Kurzzeitvermietung" | ✅ → p |
| DLA_BIZNESU_PL__body_top.html | "Najem korporacyjny we Wrocławiu" | ✅ → p |
| DLA_BIZNESU_EN__body_top.html | "Corporate housing in Wrocław" | ✅ → p |
| DLA_BIZNESU_DE__body_top.html | "Firmenapartments in Breslau" | ✅ → p |
| ATRAKCJE_WROCLAWIA_PL__body_top.html | "Miasto, w którym warto się zatrzymać" | ✅ → p |
| ATRAKCJE_WROCLAWIA_EN__body_top.html | "A city worth pausing for" | ✅ → p |
| ATRAKCJE_WROCLAWIA_DE__body_top.html | "Eine Stadt, für die es sich lohnt zu pausieren" | ✅ → p |

System H1 (Nazwa z panelu) pozostaje jedynym H1 na stronie. To wymaga jednak by **Damian wkleił SEO_TYTULY_FAIRRENTALS.md do panelu** (każda strona × 3 języki), żeby Nazwa była marketing-driven (np. "Obsługa najmu krótkoterminowego"), nie defaultowa.

---

### CSS Cleanup — usunięte §76 + §77 (-5.7 KB)

**Usunięte sekcje** (linie 8636-8808 = 173 linie):

- **§76 (v1.7)** — system `.iai-search` higher-specificity override (`html body.page-index .section.parallax .iai-search { display: block !important; ... }`). Próba pokazania i wystylowania natywnego widgetu IdoBooking. Walka ze specyficznością systemu app.css.
- **§77 (v1.8)** — system `.iai-search` floating absolute bottom hero — pozycjonowanie natywnego widgetu w hero.

**Powód cięcia**: od **§78 (v1.9)** używamy paradygmatu **hide + replace** — `.iai-search` jest całkowicie ukryta (`display: none`, `position: absolute; left: -9999px`), używamy custom `.fr-search-banner`. Style z §76 i §77 działają na ukryty element = dead code zwiększający wagę CSS bez efektu.

**Rezultat**: CSS 304.5 KB → **298.8 KB** (mieści się w 300 KB hard limit IdoBooking z 1.2 KB buforu).

---

## ❌ Co NIE weszło do v1.28 (deferred / blockery)

### Sekcja "O nas" (Agnieszka + Małgorzata) — deferred do v1.28.1

Czeka na **aset klienta**:
1. Profesjonalne zdjęcia portretowe Agnieszki Banaś + Małgorzaty (jeśli to drugie współwłaścicielstwo)
2. Krótka historia firmy (5-8 zdań)
3. **ID podstrony w panelu** dla `/pl/txt/{ID}/O-nas` (Damian tworzy w panelu)
4. Bio każdej z osób (2-3 zdania o drodze do Fair Rentals)

Po dostarczeniu — v1.28.1: osobna podstrona + teaser na homepage (2 portrety + 2 zdania + CTA "Poznaj nas →").

### Bug #4 (cytat na widget) — w obserwacji

Hotfix §93 częściowo adresuje: hero krótszy (78vh vs 100vh), search bar wyżej (clamp 40-90 vs 72-144), padding-bottom mniejszy (140-220 vs 220-360). Po wklejeniu CSS należy **zweryfikować na live**:
- Czy cytat Karoliny już się nie nakłada na search bar (desktop)?
- Czy mobile również OK?

Jeśli nadal overlap → v1.28.3 z dedicated fix (wyciągnięcie `.fr-search-banner` z hero-wrap do osobnej sekcji).

### Bug #3 (grafiki PL w EN/DE) — czeka na czyste zdjęcia

3 grafiki z baked-in PL tekstem (13.jpg "Kompleksowe...", 14.jpg "Z nami to proste", 15.jpg "Inteligentne...") czekają na podmianę. Klient dostarcza 3 nowe czyste fotografie (bez tekstu) → JARVIS dodaje HTML text overlay z tłumaczeniami EN/DE.

---

## Pliki do wklejenia (11)

| Plik | Co zmienione |
|------|--------------|
| `FR_ARKUSZ_STYLOW.css` | §93 dodany + §76/§77 wycięte (298.8 KB) |
| `OBSLUGA_NAJMU_PL__body_top.html` | `<h1>` → `<p>` w hero title |
| `OBSLUGA_NAJMU_EN__body_top.html` | `<h1>` → `<p>` |
| `OBSLUGA_NAJMU_DE__body_top.html` | `<h1>` → `<p>` |
| `DLA_BIZNESU_PL__body_top.html` | `<h1>` → `<p>` |
| `DLA_BIZNESU_EN__body_top.html` | `<h1>` → `<p>` |
| `DLA_BIZNESU_DE__body_top.html` | `<h1>` → `<p>` |
| `ATRAKCJE_WROCLAWIA_PL__body_top.html` | `<h1>` → `<p>` |
| `ATRAKCJE_WROCLAWIA_EN__body_top.html` | `<h1>` → `<p>` |
| `ATRAKCJE_WROCLAWIA_DE__body_top.html` | `<h1>` → `<p>` |

**Bez zmian** (nie wklejaj ponownie):
- `FR_HEAD_PL/EN/DE.html` — bez zmian od v1.27
- `GLOWNA_PL/EN/DE__cms.html` — bez zmian od v1.27 (homepage żyje z §93 CSS, HTML strukturalnie ten sam)
- `FR_KONIEC_BODY.html` — bez zmian
- `SEO_TYTULY_FAIRRENTALS.md` — bez zmian od v1.27 (Damian wkleja do panelu — patrz audyt)
- `ZDJECIA_LINKI.md`

---

## Smoke test po wklejeniu (Console)

```javascript
// v1.28 smoke test — verify hotfix + cleanup
(function() {
  const hero = document.querySelector('.fr-hero-asym');
  const heroText = document.querySelector('.fr-hero-asym__text');
  const search = document.querySelector('.fr-search-banner');
  const heroH1 = document.querySelectorAll('.fr-page-hero h1.fr-page-hero__title');
  const heroP = document.querySelectorAll('.fr-page-hero p.fr-page-hero__title');
  
  const checks = {
    hero_fullwidth: hero?.getBoundingClientRect().width > 1000,
    hero_not_kwadrat: hero?.getBoundingClientRect().width >= window.innerWidth * 0.95,
    hero_shorter: hero?.getBoundingClientRect().height < window.innerHeight * 1.0,
    search_above_fold: search?.getBoundingClientRect().bottom < window.innerHeight + 100,
    no_double_h1_on_subpages: location.pathname.includes('/txt/') ? heroH1.length === 0 : true,
    fr_page_hero_p_present: location.pathname.includes('/txt/') ? heroP.length > 0 : true
  };
  console.table(checks);
  const fails = Object.entries(checks).filter(([k,v]) => !v);
  console.log(fails.length === 0 ? '✓ v1.28 OK' : `✗ ${fails.length} fails: ${fails.map(([k]) => k).join(', ')}`);
})();
```

Uruchom na home + jednej /txt/* podstronie. Wszystkie checki = `true`.

---

## Akcje Damiana po v1.28

### Wkleić:
1. **CSS** `FR_ARKUSZ_STYLOW.css` (298.8 KB) — pojedynczy paste do "Arkusz stylów CSS" w panelu
2. **9 plików HTML body_top** dla OBSLUGA/DLA_BIZNESU/ATRAKCJE × PL/EN/DE — każdy do odpowiedniego pola w panelu Strony / CMS

### Po wklejeniu sprawdzić na live:
1. Hero homepage: brak ciemnego "kwadratu" w centrum, panorama widoczna na pełną szerokość, tekst hero left-aligned z miękkim fade-out
2. Search bar widoczny na 1440×900 desktop bez skrolu (powyżej fold)
3. Mobile 390 search bar również widoczny
4. **Czy cytat Karoliny już się nie nakłada na widget?** (bug #4 weryfikacja)
5. `/pl/txt/201` — sprawdzić że jest tylko 1 H1 (system z panelu Nazwa), nie 2
6. Lighthouse SEO score: powinien wzrosnąć dzięki single H1

### Akcje w panelu (poza JARVIS, z audytu):
1. **Krótka nazwa "Dla Biznesu"** dla /txt/202 PL/EN/DE → eliminuje "..." w menu (bug #6)
2. **Skopiować SEO_TYTULY** do panelu — wszystkie pola Nazwa/Podpis/META Tytuł/META Opis × 7 stron × 3 jęz.
3. **Slug EN /txt/201** zmień na "Short-term-rental-management" (bug #9)

---

## Zmiany w `memory/clients_data/fairrentals.json`

- `version`: v1.27 → **v1.28**
- Dodano `session4_history_v1_28` (7 wpisów z audytu + hotfixów + cleanup)
- Zaktualizowano `plannedRoadmap` — v1.28 oznaczone jako zrealizowane, dodano v1.28.1 (O nas), v1.28.2 (image overlay)

---

## Status feedbacku z 2026-05-12

| Pozycja klienta / audytu | v1.27 | v1.28 |
|---------------------------|-------|-------|
| 19 → 21 apartamentów | ✅ | ✅ |
| 9.6 / 9.8 unifikacja | ✅ | ✅ |
| 100% stat usunięty | ✅ | ✅ |
| Pakiet biznesowy → Sprzątanie | ✅ | ✅ |
| Google Hotels copy fix | ✅ | ✅ |
| Panel właściciela 24/7 | ✅ | ✅ |
| **Czarna poświata hero ("kwadrat")** | — | ✅ §93 |
| **Search bar wyżej** | — | ✅ §93 |
| **Double H1 /txt/* fix** | — | ✅ |
| **CSS cleanup -5.7KB** | — | ✅ |
| Sekcja "O nas" | 🔜 | 🔜 v1.28.1 (czeka asety) |
| Dwa modele 8%/10% | 🔜 | 🔜 v1.29 |
| Filtry zaawansowane | 🔜 | 🔜 v1.30 |
| Blog/Baza wiedzy | 🔜 | 🔜 v1.31 |
| Bug #4 cytat na widget | ⏳ | 🟡 verify po §93 |
| Bug #6 "..." menu | ⏳ panel | ⏳ panel |
| Bug #3 grafiki PL | ⏳ zdjęcia | ⏳ zdjęcia |
| Bug #7 panel SEO | ⏳ panel | ⏳ panel |
| Bug #9 slug EN /txt/201 | ⏳ panel | ⏳ panel |
