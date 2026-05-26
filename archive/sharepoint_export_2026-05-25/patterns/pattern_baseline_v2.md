# JARVIS Baseline v2 — "Jak budujemy strony w 2026-05"

Distillacja **co działa** z 11 ukończonych projektów IdoSell/IdoBooking. To nasz starting point dla kolejnego klienta — nie zaczynamy od zera, kopiujemy patterny które się sprawdziły.

**Updated**: 2026-05-20 (po FairRentals v1.69 + RPA v2.0)

---

## 🎨 Stack technologiczny (sprawdzony)

### CSS Architecture
- **Prefix per klient**: `fr-` (Fair Rentals), `md-` (Madera), `ec-` (EcoCamping), `nj-` (Najmar), etc.
- **CSS Variables w :root** dla colors/fonts/shadows/radii (`--<prefix>-primary`, `--<prefix>-bg`)
- **Mobile-first media queries**: base + `@media (min-width: 720px)` + `(min-width: 1024px)` + `(min-width: 1280px)`
- **System overrides z HARDCODED hex** (NIE CSS vars dla orange override, bg-color reset)
- **`!important` jako standard** — battle z system CSS specificity
- **`html body` prefix** w selektorach — boost do (0,2,X+1) specificity
- **§XX numbered sections** w komentarzach — łatwa nawigacja w 400KB pliku

### CSS Size budget
- **Target**: <400KB (Fair Rentals refactor: 460→410KB)
- **Hard limit**: 450KB (panel OOM at ~500KB)
- **Optimizations**: minify comments (zachowaj §XX markers), strip indentacji, trailing `;}` → `}`

### HTML Architecture
- **body_top per page** (Atrakcje, Obsługa najmu, Dla biznesu, O nas, Blog list, Kontakt)
- **Zero inline styles** (sanitizer wycina)
- **Zero `<script>` w body_top** (sanitizer wycina lub system strips)
- **Zero emoji** (WAF rejects save)
- **Klasy modyfikatory** zamiast inline style (`.foo--with-bg` + reguła w CSS)

### body_bottom JS (1 plik globalny)
- **Limit: 62KB** (silent truncate)
- **Source w `_source/`** (~75KB rozwija się do 57KB po minify)
- **Moduły z markerami `/* §X. <name> */`**
- **Boot section na końcu** — detection per page class, init odpowiednie moduły
- **Minify script per klient**: `_source/minify_*.py` (strip comments, blanks, etc.)

### HEAD per language
- **3 pliki** dla PL/EN/DE
- **OG tags + Schema.org LodgingBusiness**
- **Google Fonts link** (preconnect + display=swap)
- **Brak inline meta description** dla pages — system zarządza

### Fonts (standard pair)
- **Heading**: Serif display (DM Serif Display, Playfair Display, Merriweather, Cormorant)
- **Body**: Sans (Inter — preferred, Manrope, system stack fallback)

---

## 🧩 Komponenty UI (cross-project reused)

### Hero section (3 warianty)
1. **Asymmetric hero** (Fair Rentals) — text left, photo right
2. **Full-width slider** (system) — photos cycling, text overlay
3. **Solid hero** (subpage) — gradient bg, centered text

### Search widget (3 inputs)
- Date from + Date to (Litepicker)
- Liczba osób (system dropdown)
- Lokalizacja (optional, per multi-city brand)
- **CRITICAL**: dropdowns `isDesktop ? {...} : false` na mobile (iPhone Safari `<select>` bug)

### Featured offers — Custom Cards (Madera pattern)
- System `.container-hotspot` HIDDEN przez CSS
- JS w body_bottom czyta dane z hidden hotspot
- Builds custom `.{prefix}-offer-card` grid
- Per card: photo, badge price, m², osoby, krótki opis, CTA
- Deduplikacja slick clones (filter `:not(.slick-cloned)`)

### Apartment cards (na liście /offers)
- System renderuje default — my customizujemy CSS
- 4-pole: image, nazwa, miejsc, cena (system limit — m² wymaga JS enrichment)

### Detail apartament (na /offer/N)
- System renderuje + tabs accordion mobile (Kalendarz, Właściwości, Zasady, Opcje, Dla rezerwujących, Cennik)
- Litepicker `--static` inline w "Kalendarz dostępności" tab
- Custom: 6 tabs się rozwijają per click, każdy lazy-loaded

### Atrakcje page (custom)
- Hero z photo bg (klasa modyfikator, NIE inline style)
- 5-7 sekcji `.fr-attr-row` z numerem 01-07
- Image + body grid 1:1 desktop, stack mobile
- Wikimedia thumbnails ≤600px

### Footer (system-generated)
- **Style przez CSS only** — nie nadpisuj HTML
- 4 columns: brand, contact, nav, social
- Payment icons row (Visa + Mastercard) — wyrównane vertical center
- **Powered by IdoBooking widoczne** (licensing)

### Mobile menu
- Hamburger w prawym górnym (top:12px, NIE 50%)
- Logo sticky w lewym górnym (top:12px)
- Menu open: items + flagi PL/EN/DE jako ostatnia pozycja
- Subtle border-top dividers między items

### Cookies banner (system)
- CSS overrides (color, button green/brand)
- NIE custom — system zarządza

---

## 🛠️ Tooling per projekt

### Required files w `clients/<name>/`
```
/_source/
  <PREFIX>_KONIEC_BODY_ZRODLO.html    # source przed minify
  minify_koniec_body.py                # Python minify script
/DO_WKLEJENIA/
  <PREFIX>_ARKUSZ_STYLOW.css           # ~300-410KB
  <PREFIX>_KONIEC_BODY.html            # ≤62KB (post minify)
  <PREFIX>_HEAD_PL.html
  <PREFIX>_HEAD_EN.html
  <PREFIX>_HEAD_DE.html
  GLOWNA_PL__cms.html
  GLOWNA_EN__cms.html
  GLOWNA_DE__cms.html
  ATRAKCJE_*_PL/EN/DE__body_top.html
  OBSLUGA_NAJMU_PL/EN/DE__body_top.html
  DLA_BIZNESU_PL/EN/DE__body_top.html
  O_NAS_PL/EN/DE__body_top.html
  BLOG_LIST_PL/EN/DE__body_top.html
  INSTRUKCJA.txt
/docs/
  RELEASE_NOTES_v*.md
  AUDIT_*.md
  BUG_*.md
/tests/
  flows.yaml
  baseline/
```

### Skills wsparcie
- `idosell-website-builder` — full pipeline Phase 0-6
- `idosell-deploy-cr` — pre-deploy code review (mandatory)
- `idosell-bug-debug` — systematic debug per issue
- `idosell-seo-audit` — Lighthouse post-deploy
- `idosell-a11y-audit` — WCAG 2.1 AA sign-off
- `idosell-e2e-test` — critical flows regression
- `idosell-memory-consolidate` — monthly hygiene

### MCP serwery używane
- `chrome-devtools` — live testing (pomiar pixel-perfect, screenshots, evaluate_script, inject CSS test)
- `playwright` — E2E (alternatywa, gdy chrome-devtools nie wystarczy)

---

## 🚨 44 Traps — pełna lista (cumulative)

### Traps #1-15 (z 5 projektów, learned 2026-Q1)
1. Body font 16px (system 22.4px)
2. `.index-info { z-index: 1000; overflow: visible }`
3. `.parallax-slider::before { display: none }`
4. System z-index: -1 on inputs → +2
5. System orange #AD5009 → brand
6. Header position: fixed (NOT sticky)
7. Litepicker width: fit-content (NIE 100% — wystaje)
8. `.iai-search` hidden na /offers
9. body_top brak `<script>`
10. Footer system-generated (CSS only)
11. Wikimedia ≤600px
12. URL pattern `/txt/{ID}/{Slug}` (NIE bare slug)
13. tel/mailto z REAL data (NIE placeholders)
14. No img-placeholder divs (delete after photos)
15. Hide system H1/H2 ("IdoBooking", `.big-label`)

### Traps #16-31 (z Najmar 14 sesji + Madera)
16-17. Header class variability (.default9/10/13)
18-19. Build order (mobile-first reset → typography → header → hero → sections → subpages → JS → HEAD → test)
20-22. Litepicker quirks (backdrop, legenda, range coloring)
23-25. Custom offer cards (slick clones dedup, m² regex, price regex)
26-28. Stacking context (z-index hierarchy)
29-31. Photo scraping (from /offer pages, fallback chains)

### Traps #32-44 (z FairRentals v1.66-v1.69 + RPA v2.0 — 2026-05)
32. **body_top inline `style=""` wycinany** przez sanitizer
33. **Body_bottom 62KB silent truncate**
34. **Powered by IdoBooking widoczne** (licensing)
35. **`top: 50%` zjeżdża** gdy parent rośnie (logo, hamburger)
36. **iPhone Safari `<select>` pusty** z appearance:none + custom font
37. **Grid `repeat(7, 1fr)` overflow** → użyj `minmax(0, 1fr)`
38. **System widget weekday cells** mają `width: var(--litepicker-day-width)` — override
39. **CSS ≤450KB** (admin OOM at 500KB)
40. **Google Maps embed bez `key=AIza...`** (GitHub secret scanning)
41. **Parallax-slider bg leak** (RPA CRITICAL-X)
42. **Footer white strip** między CTA a stopką (RPA CRITICAL-Q)
43. **Z-index hierarchy battles** (header 100, hero 1, index-info 1000)
44. **§FR-CLIENT block** — client own CSS edits preservation

Plus workflow discipline:
- Bug wraca = diagnoza WRONG (nie defensive escalation)
- Element invisible = check visibility + display + opacity + parent + children chain
- Iterative debug discipline

---

## 📐 Default values (use as baseline)

### Spacing scale
```
--<prefix>-space-xs: 4px
--<prefix>-space-sm: 8px
--<prefix>-space-md: 16px
--<prefix>-space-lg: 24px
--<prefix>-space-xl: 40px
--<prefix>-space-2xl: 64px
```

### Border radius scale
```
--<prefix>-radius-sm: 4px (cards, buttons small)
--<prefix>-radius-md: 8px (cards default)
--<prefix>-radius-lg: 16px (hero, big elements)
--<prefix>-radius-pill: 999px (chips, language flags)
```

### Shadow scale
```
--<prefix>-shadow-sm: 0 1px 4px rgba(0,0,0,0.06)
--<prefix>-shadow-md: 0 4px 12px rgba(0,0,0,0.10)
--<prefix>-shadow-lg: 0 8px 24px rgba(0,0,0,0.15)
```
(Klientka FR v1.66 prosi "lżejsze cienie" — używaj shadow-sm jako default, lg tylko na hero)

### Typography scale (default)
```
H1: clamp(36px, 5vw, 64px)
H2: clamp(28px, 4vw, 48px)
H3: clamp(22px, 3vw, 32px)
Body: 16px (NIE 14, NIE 22.4 system)
Small: 14px
Caption: 12px
```

### Breakpoints
```
Mobile: <720px (single column, hamburger, stack)
Tablet: 720-1024px (2 cols common)
Desktop: 1024-1280px (3-4 cols)
Wide: >1280px (max-width: 1170-1280px container)
```

### Header heights
- Page-index (transparent, hero photo): 65px
- Subpage (white, scrolled state): 57px lub 65px (zharmonizuj!)

### Touch targets (mobile)
- Min: 44×44 px (WCAG AAA recommendation, dobry default)
- Buttons: padding 14px 24px (z line-height naturalnie pumpuje do 44+)
- Flagi PL/EN/DE: 32×24 px (acceptable, ale dobierać że osadzone w padding)

---

## 🔁 Standard JavaScript modules (body_bottom)

```javascript
/* §1. Scroll reveal */
(function() {
  const els = document.querySelectorAll('.fr-reveal');
  const obs = new IntersectionObserver(/*...*/);
  els.forEach(el => obs.observe(el));
})();

/* §2. Smooth scroll anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', /*...*/);
});

/* §3. Mobile menu toggle (+ logo position fix) */
// PATCH v1.69: logo top:12, nie 50% (gdy menu open parent rośnie)

/* §4. Lazy load images */
// IntersectionObserver na img[data-src]

/* §5. Litepicker search widget */
// dropdowns: isDesktop ? {...} : false
// onSelect: redirect z dates

/* §6. Filter collapse (/offers) */
// Click handler na .filter-toggle

/* §7. FAQ accordion (jeśli FAQ na stronie) */
// aria-expanded + hidden

/* §8. Phone/email auto-pull (jeśli CTA section) */
// Scrape footer → inject do CTA

/* §9. Custom offer cards (featured offers) */
// Read .container-hotspot → build .{prefix}-offer-card grid

/* §10. Boot — page detection + init */
```

---

## 🎯 Customization points per klient

Klient zmienia tylko 5 rzeczy w briefie:
1. **Kolory** (`--<prefix>-primary`, `--<prefix>-accent`, dark, light)
2. **Fonty** (heading + body google fonts)
3. **Treść** (texts, photos, offers)
4. **Liczba subpages** (4-8 typical)
5. **Custom features** (interaktywna mapa, video embed, lightbox gallery)

Reszta = baseline (sprawdzona w 11 projektach).

---

## 📈 KPI fluffów oczekiwanych per nowy klient

| Metric | Min target | Stretch |
|--------|-----------|---------|
| Lighthouse Performance (mobile) | 85 | 92+ |
| Lighthouse SEO | 95 | 100 |
| Lighthouse Accessibility | 90 | 95+ |
| Lighthouse Best Practices | 95 | 100 |
| WCAG 2.1 AA compliance | 95% | 100% |
| CSS size | <400KB | <350KB |
| body_bottom size | <60KB | <55KB |
| E2E PASS rate | 100% | 100% |
| Time to launch (PL only) | 11-15h | 8-11h |
| Iteracje (avg bugfix) | <2 wersji | <1.5 |

---

## 🚀 Nowy klient — start od czego

1. Wyślij `BRIEF_KLIENTA.docx` + `FAQ_WSPOLPRACA.docx` z `/Users/user/Desktop/jarvis/templates/`
2. Czekaj na wypełniony brief
3. Trigger: `idosell-website-builder` skill (Phase 0 RECON)
4. Cześć fazy: ten plik (`pattern_baseline_v2.md`) + `pattern_idosell_websites.md` jako reference

Dobrego budowania! 🏗️
