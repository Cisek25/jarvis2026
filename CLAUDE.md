# JARVIS — IdoBooking Site Builder Playbook

> **Auto-loaded by Claude at every session.** Czytaj top-to-bottom dla pełnego kontekstu, lub skacz do TOC.
> Wersja: 4.0 (2026-05-25 — JARVIS Overhaul). Poprzednia: v3.17 w [docs/archive/CLAUDE.md.v3.17-backup-2026-05-25](docs/archive/CLAUDE.md.v3.17-backup-2026-05-25).

---

## TOC

- [§0. TLDR — Jak czytać + workflow w 5 minut](#0-tldr--jak-czytać--workflow-w-5-minut)
- [§1. Project Overview](#1-project-overview)
- [§2. Workflow 6-Phase (nowy klient od briefa do delivery)](#2-workflow-6-phase-nowy-klient-od-briefa-do-delivery)
- [§3. Baseline — co każdy klient dostaje](#3-baseline--co-każdy-klient-dostaje)
- [§4. Traps Encyclopedia (63 system traps)](#4-traps-encyclopedia-63-system-traps) ⏳ partial
- [§5. Instincts (35 reaction patterns)](#5-instincts-35-reaction-patterns) ⏳ partial
- [§6. Lessons Learned (26)](#6-lessons-learned-26) ⏳ partial
- [§7. Variety Guidelines (20 vibes mapping)](#7-variety-guidelines-20-vibes-mapping)
- [§8. Deployment Checklist](#8-deployment-checklist)
- [§9. Post-deploy Iterations Playbook](#9-post-deploy-iterations-playbook)
- [§10. Emergency Debugging (trigger-driven)](#10-emergency-debugging-trigger-driven)
- [§A. Memory Cross-References](#a-memory-cross-references)

> ⏳ Sekcje §4-§6 zawierają TOP 10-15 najważniejszych entries każdej kategorii — pełne 63+35+26 są w `memory/feedback_*.md`. CLAUDE.md powinno mieć w kolejnej wersji wszystko inline (planowane w v4.1).

---

## §0. TLDR — Jak czytać + workflow w 5 minut

### Co robi JARVIS

Brief klienta → kompletny package (CSS + JS + body_top HTML + INSTRUKCJA.txt) gotowy do wklejenia w panel IdoBooking. Klient nie pisze ani jednej linii kodu — JARVIS generuje wszystko.

### 20 vibes (design language) — AI-driven design

Każdy klient wybiera (lub JARVIS proponuje) jeden z 20 zdefiniowanych "vibes": `luxury-heritage`, `modern-minimal`, `rustic-warm`, `modern-coastal`, `urban-bold`, `wellness-calm`, `heritage-warm`, `family-friendly`, `boutique-romantic`, `scandi-clean`, `mountain-rugged`, `mediterranean-villa`, `art-deco-vintage`, `eco-glamping`, `business-corporate`, `winter-alpine`, `asian-zen`, `industrial-loft`, `garden-cottage`, `tropical-resort`.

Vibe determinuje: paletę kolorów, fonty, sygnaturę layoutu, rekomendowane warianty per sekcja (hero/about/gallery/cta/etc.), interakcje hover, dividery, dark mode.

Cała konfiguracja: [library/templates/vibe-presets.json](library/templates/vibe-presets.json) (890 linii, 20 vibes).

### 10-warstwowa biblioteka CSS

JARVIS składa per-klient CSS z 10 warstw modułowych:

| Layer | Plik | Lines | Zawartość |
|---|---|---|---|
| 1 | [library/css/layer1-traps.css](library/css/layer1-traps.css) | ~700 | 47-63 systemowych bug-fixów IdoBooking |
| 2 | [library/css/layer2-components.css](library/css/layer2-components.css) | ~960 | Komponenty .ido-* (nav/footer/btn/form/modal/card) |
| 3 | [library/css/layer3-offer-page-base.css](library/css/layer3-offer-page-base.css) | ~600 | Booking form, price chip, gallery, amenities |
| 4 | [library/css/layer4-variety-patterns.css](library/css/layer4-variety-patterns.css) | ~4000 | 70 wariantów sekcji (Hero×10, About×8, Gallery×8, CTA×8, Features×6, Testimonials×6, Location×5, FAQ×4, Nav×8, Footer×7) |
| 5 | [library/css/layer5-color-systems.css](library/css/layer5-color-systems.css) | ~1600 | 20 vibes × kolor tokens + dark mode per vibe (60 blocks) |
| 6 | [library/css/layer6-typography-systems.css](library/css/layer6-typography-systems.css) | ~1900 | 20 vibes × typography (Google Fonts + h1-h4 clamp) |
| 7 | [library/css/layer7-interactions.css](library/css/layer7-interactions.css) | ~720 | Hover×8, scroll reveals×5, modal anim×4, loading×3, form validation×3 |
| 8 | [library/css/layer8-dividers-patterns.css](library/css/layer8-dividers-patterns.css) | ~1000 | SVG dividers, patterns, organic blobs, textures, vibe accents |
| 9 | (rezerwa: animations layer) | — | — |
| 10 | (rezerwa: dark mode utilities — obecnie w layer5) | — | — |

Per-klient CSS = L1+L2+L3 (base) + L4 (per vibe variants) + L5+L6 (vibe colors+fonts) + L7+L8 (interactions+accents). Trafia jako jeden plik `CSS_EDYTOR.css` do panelu IdoBooking.

### Workflow nowego klienta — 6 phase, ~3-4h

```
Phase 0  RECON         (panel ID, default13?, fullpage.js?, języki)
Phase 1  BRIEF+TOKENS  (parse brief, wybór vibe, design tokens z layer5)
Phase 2  CSS SKELETON  (compose z 10 layers + per-vibe variants)
Phase 3  KONIEC_BODY   (JS modules z library/js + per-client init)
Phase 4  BODY_TOP HTML (8 podstron)
Phase 5  LIVE VERIFY   (MCP audyt: 4 punkty kontrolne)
Phase 6  INSTRUKCJA+DELIVERY
```

Pełen workflow w [§2 niżej](#2-workflow-6-phase-nowy-klient-od-briefa-do-delivery).

### Trigger phrases user-frustracji → MCP NATYCHMIAST

Gdy user pisze jedno z poniższych, ZAWSZE odpal Chrome DevTools MCP zanim odpowiesz:

- "sprawdz", "sprawdź"
- "pokaż mi", "pokaz mi"
- "na pewno?"
- "weź zrób audyt"
- "dalej źle", "wciąż nie działa"
- "wkleiłem dwa i jest fatalnie"
- "nie widzę zmiany"

**Lesson**: Wizualna interpretacja screenshota zawodzi przy małym viewport + DPR scaling. Computed style przez MCP nigdy nie kłamie. (Apartamenty Parkowe v1.11.0 — zielona ramka MENU "wyglądała OK" ale była nadal zielona; klient zauważył drugiej iteracji.)

### Trigger phrases user-clarifying → brief upgrade

- "to się powtarza" / "miałeś to już" → **NATYCHMIAST** zapisz lesson w `memory/feedback_<topic>.md` + update MEMORY.md
- "co to ma być?" → user bez kontekstu, pokaż design doc lub odpowiedni brief
- "jak długo to potrwa?" → estimacja ZAWSZE ze splitu na fazy (np. "Phase 2 CSS ~45min + Phase 4 HTML 8 podstron ~90min = 2h15")

### Co JARVIS robi automatycznie (don't ask, just do)

1. Live verify przez MCP po każdej znaczącej zmianie CSS/JS klienta
2. Zapis nowych traps + lessons do memory/ + MEMORY.md gdy wykryje nowy bug pattern
3. Cross-file grep przy text changes (lesson z Solidne Apartamenty: hardcoded data w initLeafletMap, body_top i CSS — wszędzie)
4. Powered by IdoBooking visibility audit (filter:none, 240×56, opacity ≥0.85 — wymóg licencyjny)
5. Mobile breakpoint test (375px, 768px, 991px, 1280px) zawsze, nie tylko desktop

### Co JARVIS NIE robi (klient/Damian musi)

1. Zamówienie domeny + SSL
2. Zdjęcia obiektu (klient dostarcza, my optymalizujemy)
3. Treści marketingowe (klient dostarcza, my formatujemy)
4. Tłumaczenia (zewnętrzny proces lub klient)
5. Wklejenie do panelu (klient sam — INSTRUKCJA.txt prowadzi krok-po-kroku)
6. Decyzje biznesowe (cennik, promocje, polityki)

---

## §1. Project Overview

### Co to JARVIS

Lokalny pipeline (Node.js server + biblioteka CSS/JS + skill agents) do tworzenia stron klientów na platformie IdoBooking — saas booking engine dla obiektów noclegowych. JARVIS automatyzuje 95% pracy designerskiej + dewelopskiej; pozostałe 5% to brand decisions klienta (kolory, fonty, treści) zebrane przez strukturalny brief.

### Kontekst IdoBooking jako platformy

IdoBooking to system rezerwacji z mocno ograniczonym CMS-em. Klient ma 4 miejsca gdzie wkleja kod:

1. **Arkusz stylów CSS** (jeden globalny `custom.css` na cały serwis) — wpływa na wszystkie podstrony
2. **HEAD** (meta, Google Fonts, structured data JSON-LD)
3. **body_top** per podstrona (sekcje HTML, nad system-rendered content)
4. **body_bottom** per podstrona (JavaScript moduły)

Limit body_bottom = ~62KB (silent truncate WAF, [memory/feedback_idobooking_body_bottom_size_limit.md](.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_idobooking_body_bottom_size_limit.md)). Limit body_top = ~32KB. CSS = ok ~200KB.

System dostarcza domyślny szablon (`default13` jest najnowszy 2024+) z headerem, footerem, listami ofert, formularzem rezerwacji. JARVIS nadpisuje to swoim brand-specific designem przez CSS specificity wars + JS DOM rewrites.

### Klient — typowy profil

- Małe-średnie obiekty noclegowe: apartamenty, hostele, pensjonaty, glamping, agroturystyka, hotele butikowe
- 1-50 obiektów w portfolio
- Operator nie-techniczny: musi mieć INSTRUKCJA.txt krok-po-kroku
- Polski rynek głównie + okazjonalnie EN/DE/ES (lokalizacje turystyczne)

### Ile klientów

Stan na 2026-05-26: ~24 klientów w [clients/](clients/) — patrz [data/clients.json](data/clients.json) dla aktualnego statusu (active/archived).

### Stack techniczny

- **Pure CSS** — 3-warstwowa architektura per klient (L1 traps + L2 components + L3 engine = composed do jednego `custom.css`)
- **Vanilla JS** (zero frameworks) — moduły w `library/js/` z prefiksem `ido-*`
- **Markdown** — briefy, dokumentacja, INSTRUKCJA.txt
- **JSON** — metadata (vibe-presets, page-templates, klienci)
- **Chrome DevTools MCP** — live verification, snapshot, computed style queries
- **Playwright MCP** — opcjonalne E2E testy flow rezerwacji

### Zero dependencies on Node ecosystem dla klienta

Wynikowy kod wklejany do IdoBooking jest pure HTML+CSS+JS — żadnych npm, build steps, frameworks. To wymóg platformy (klient nie ma build pipeline).

---

## §2. Workflow 6-Phase (nowy klient od briefa do delivery)

### Pre-flight: pliki które MUSZĄ istnieć przed startem

```
clients/<nazwa-klienta>/
  BRIEF.md                            ← wypełniony brief (template z templates/BRIEF_NEW_CLIENT.md)
  <opcjonalnie: assets od klienta>
    zdjecia/                           ← chronione przed cleanupem
    logo.png / logo.svg
    moodboard.pdf
```

Jeśli brief nie istnieje → STOP, poproś klienta o wypełnienie [templates/BRIEF_NEW_CLIENT.md](templates/BRIEF_NEW_CLIENT.md).

### Phase 0 — RECON (~15 min)

**Cel**: zweryfikować dane z briefa i wykryć ukryte assumptions.

Kroki:

1. Odczytaj `clients/<nazwa>/BRIEF.md`
2. Waliduj REQUIRED fields (engine ID, prefix, language, podstrony)
3. Otwórz panel klienta przez Chrome DevTools MCP:
   - URL: `https://client<NUMER>.idobooking.com/`
   - Sprawdź: `body.className` zawiera `default13`? (jeśli nie, większość JARVIS baseline NIE BĘDZIE działać)
   - Sprawdź: czy `#fullpage` lub `.fp-section` jest na home? (jeśli tak → fullpage.js, scrollY=0 zawsze, specjalne traps)
   - Sprawdź: czy `.container-hotspot` istnieje? (wyróżnione oferty na home — kluczowe dla logic w KONIEC_BODY)
   - Sprawdź: liczba obiektów w `/offers` (klient może podać "11" w briefie ale w panelu jest 122 = shared engine multi-property = brand-neutral mode!)
4. Walidacja vibe:
   - Jeśli klient wybrał w briefie → przyjmij
   - Jeśli pusto → na podstawie target + nazwy + lokalizacji zaproponuj 2-3 vibes z `vibe-presets.json`, opisz dlaczego, poproś o wybór
5. Logo:
   - URL/plik weryfikuj `curl -sI <url>` → 200?
   - SVG czy PNG? (SVG preferowane dla retina)
   - Jest "logo na ciemnym tle" oraz "logo na jasnym tle"? (potrzebne dla nav transparent vs solid)

**Output Phase 0**: jeden Markdown w `clients/<nazwa>/PHASE0_RECON.md` z weryfikacjami + wybranym vibe + confirmed prefix.

### Phase 1 — BRIEF + DESIGN TOKENS (~20 min)

**Cel**: ustalić ostateczny design tokens (kolory, fonty, radius, shadow) per klient.

Kroki:

1. Z `vibe-presets.json` skopiuj `palette` + `darkmode_palette` + `fonts` dla wybranego vibe
2. Jeśli klient w briefie podał własne kolory brand → OVERRIDE primary/secondary (zachowaj cream/bg/text/shadows z presetu)
3. Jeśli klient podał własne fonty → OVERRIDE heading/body
4. Stwórz `clients/<nazwa>/DESIGN_TOKENS.md` jako single source of truth dla CSS w Phase 2.

### Phase 2 — CSS SKELETON (~45 min)

**Cel**: złożyć finalny `CSS_EDYTOR.css` z 10 layers, podstawiając per-vibe tokens.

Kroki:

1. Compose order (top to bottom):
   ```
   /* ============ HEAD === */
   /* Google Fonts @import (z layer6 dla wybranego vibe) */

   /* ============ ROOT === */
   :root {
     /* Z layer5 — wybrany vibe block kopiowany jako :root, NIE [data-vibe=] */
     --<prefix>-primary: ...
   }

   /* ============ LAYER 1 — TRAPS (full) === */
   /* prefix rename: --xx-* → --<prefix>-* */

   /* ============ LAYER 2 — COMPONENTS (full or subset) === */

   /* ============ LAYER 3 — OFFER PAGE (jeśli klient ma /offer/N) === */

   /* ============ LAYER 4 — VARIETY (TYLKO wybrane warianty per vibe) === */

   /* ============ LAYER 6 — TYPOGRAPHY (wybrany vibe block) === */

   /* ============ LAYER 7 — INTERACTIONS (cały) === */

   /* ============ LAYER 8 — DIVIDERS (vibe-specific + 2-3 universal) === */

   /* ============ CUSTOM — per klient override === */
   /* Sekcja końcowa §FR-CLIENT: zachowane gdy klient sam doda regułki */
   ```

2. **Rename `--xx-*` → `--<prefix>-*`** w całym pliku przed save.
3. **Rename `.xx-` classes → `.<prefix>-` classes** w layer4 sekcji.
4. **Dodaj page-context guards** dla rules które są specyficzne per podstrona:
   ```css
   body.page-index .hero { /* tylko home */ }
   body.page-offer .booking-form { /* tylko /offer/N */ }
   ```
   **CRITICAL**: nigdy globalne reguły bez body.page-X.

5. Verify size pliku ≤ 200KB (limit IdoBooking custom.css)

**Output Phase 2**: `clients/<nazwa>/CSS_EDYTOR.css` (przeciętnie 5000-12000 linii zależnie od wybranych wariantów).

### Phase 3 — KONIEC_BODY JS (~30 min)

**Cel**: skomponować JS modules dla wszystkich podstron, z per-podstrona init.

Kroki:

1. Base modules (zawsze):
   - [library/js/ido-base.js](library/js/ido-base.js) — initBookingModal, initFeaturedOffers, initStickyHeader
   - [library/js/ido-feature-detection.js](library/js/ido-feature-detection.js) — window.idoFeatures
   - [library/js/ido-scroll-reveal.js](library/js/ido-scroll-reveal.js)
   - [library/js/ido-lightbox.js](library/js/ido-lightbox.js)
2. Opcjonalne moduły (per warunek):
   - **Brand-neutral mode** (jeśli shared engine multi-property) → [library/js/ido-brand-neutral.js](library/js/ido-brand-neutral.js), podmień placeholdery
3. Per-podstrona init w wrapper IIFE:
   ```js
   (function(){
     if (idoFeatures.isHome) { /* slick init dla galerii, parallax dla hero */ }
     if (idoFeatures.isOfferDetail) { /* custom offer cards, sticky tabs */ }
   })();
   ```
4. **Konkatenacja**: wszystkie moduły w jeden plik `KONIEC_BODY.html` jako `<script>`.
5. **Sprawdzenie rozmiaru** — jeśli >55KB, **minify**.
6. **Walidacja**: NO emoji w kodzie.

**Output Phase 3**: `clients/<nazwa>/KONIEC_BODY.html` <62KB.

### Phase 4 — BODY_TOP HTML 8 podstron (~90 min)

Podstrony (standardowy zestaw):

1. `GLOWNA_PL__body_top.html` (Strona główna): Hero + About teaser + Wyróżnione oferty + Atrakcje teaser + Lokalizacja teaser + CTA dolny
2. `ONAS_PL__body_top.html`
3. `GALERIA_PL__body_top.html`
4. `LOKALIZACJA_PL__body_top.html` (Leaflet map + lista atrakcji)
5. `ATRAKCJE_PL__body_top.html`
6. `APARTAMENTY_PL__body_top.html` (zwykle puste — system /offers renderuje)
7. `REGULAMIN_PL__body_top.html` (FAQ + regulamin)
8. `KONTAKT_PL__body_top.html`

Dla każdej podstrony:

1. Dobierz strukturę HTML z layer4 variant doc
2. Wypełnij treścią z briefu (lub placeholder)
3. Embed brand_name, tel, email, adres w odpowiednich miejscach
4. **CRITICAL no-emoji** — żadnych emoji w HTML inline (WAF)
5. Zapisz każdy plik z prefiksem `<PODSTRONA>_<LANG>__body_top.html`

**Wielojęzyczność** (jeśli klient ma EN/DE/ES): powtórz dla każdego języka.

**Output Phase 4**: 8 plików per język w `clients/<nazwa>/DO_WKLEJENIA/`.

### Phase 5 — LIVE VERIFY (MCP, ~30 min)

**Pre-condition**: klient (lub Damian) wkleił już CSS + KONIEC_BODY + body_top do panelu (sandbox test environment lub live).

4 punkty MCP audit:

1. **Desktop home** (1920×1080): brand colors, fonty, header type, hero variant
2. **Mobile home** (375×812): hamburger menu, mobile search-first order, oferta-card single-column
3. **Offer page** (jeśli istnieje): container-hotspot UKRYTY, nasz {{prefix}}-offers-section pokazany RAZ, price chip layout (prostokąt h64 r12, NIE pill h56), sticky tabs sklejone z headerem przy scroll
4. **Footer**: Powered by IdoBooking widoczne (240×56, opacity ≥0.85), filter: none, wariant SVG zgodny z footer bg

Każdy punkt = screenshot + computed style query.

**Output Phase 5**: `clients/<nazwa>/LIVE_VERIFY_<data>.md` z 4 screenshotami + listą problemów do fixu.

Jeśli problemy → wraca do Phase 2/3/4 dla fixów → ponów verify.

### Phase 6 — INSTRUKCJA + DELIVERY (~20 min)

Struktura `clients/<nazwa>/DO_WKLEJENIA/`:

```
DO_WKLEJENIA/
  CSS_EDYTOR.css                   ← jeden plik, do "Arkusz stylów CSS"
  KONIEC_BODY.html                 ← do "body_bottom"
  HEAD.html                        ← Google Fonts + structured data → do "HEAD"
  GLOWNA_PL__body_top.html
  ONAS_PL__body_top.html
  GALERIA_PL__body_top.html
  LOKALIZACJA_PL__body_top.html
  ATRAKCJE_PL__body_top.html
  APARTAMENTY_PL__body_top.html
  REGULAMIN_PL__body_top.html
  KONTAKT_PL__body_top.html
  (powyższe per inny język jeśli klient ma EN/DE/ES)
  INSTRUKCJA.txt                   ← krok-po-kroku co wkleić gdzie
```

INSTRUKCJA.txt = 8 sekcji defensywnego formatu (pre-flight, CSS, HEAD, podstrony body_top, body_bottom, pozostałe podstrony, weryfikacja, zgłoszenie problemów).

**Output Phase 6**: `clients/<nazwa>/DO_WKLEJENIA/` ZIP-able package + email do klienta.

Po wklejeniu klient daje znać → JARVIS odpala Phase 5 LIVE VERIFY raz jeszcze już na realnym deploy.

---

## §3. Baseline — co każdy klient dostaje

### Layers obowiązkowe (zawsze)

- `layer1-traps.css` — pełny (63 traps system IdoBooking)
- `layer2-components.css` — pełny lub subset (głównie navbar + footer + buttons + forms)
- `layer3-offer-page-base.css` — TYLKO jeśli klient ma `/offer/N/` (większość ma)
- `layer5-color-systems.css` — TYLKO wybrany vibe block (inline jako `:root`)
- `layer6-typography-systems.css` — TYLKO wybrany vibe block + Google Fonts @import

### Layers opcjonalne (per vibe / klient decision)

- `layer4-variety-patterns.css` — TYLKO wybrane warianty per sekcja
- `layer7-interactions.css` — pełny lub subset
- `layer8-dividers-patterns.css` — vibe-specific accents + 2-3 uniwersalne dividery

### JS modules obowiązkowe

- `ido-base.js` — booking modal, featured offers reader, sticky header
- `ido-feature-detection.js` — `window.idoFeatures` probes per page

### JS modules opcjonalne

- `ido-brand-neutral.js` — TYLKO jeśli shared engine multi-property (broker model)
- `ido-scroll-reveal.js` — jeśli vibe ma scroll animations
- `ido-lightbox.js` — jeśli galeria niestandardowa

### Standardowe URL struktura

- `/` (Strona główna, `body.page-index`)
- `/txt/200/Apartamenty` lub równoważnik
- `/txt/201/Galeria`
- `/txt/202/O-nas`
- `/txt/203/Atrakcje`
- `/txt/204/Lokalizacja`
- `/txt/205/Regulamin-i-FAQ`
- `/contact`, `/book-now`, `/offers`, `/offer/<ID>/`

### Standardowy header

- Logo (clickable/non-clickable per per-client decision)
- Menu: Apartamenty + 5-6 podstron + REZERWUJ button
- Wybór języka
- Mobile: hamburger toggle z slide drawer

### Standardowy footer

- VISA/Mastercard payment strip
- Kontakt (tel/email/adres)
- Linki: Regulamin, Polityka prywatności
- **Powered by IdoBooking** 240×56, opacity ≥0.85, filter:none, wariant SVG zgodny z bg footer

### Standardowe sekcje na home

1. Hero (variant per vibe)
2. About teaser (~150 słów + CTA "więcej")
3. Wyróżnione oferty (3-6 kart, czytane z systemu hotspot)
4. Atrakcje teaser (3-4 ikony + krótki opis)
5. Lokalizacja teaser (map snippet + adres)
6. CTA dolny

---

## §4. Traps Encyclopedia (63 system traps) ⏳ PARTIAL

> **Status**: To pełnej sekcji potrzeba inline 63 traps z kodem fix per każdy. Sekcja zostanie ukończona w v4.1.
>
> Autorytatywne źródło **tymczasem**:
>
> - [library/css/layer1-traps.css](library/css/layer1-traps.css) — wszystkie 63 traps jako CSS rules z komentarzem
> - [memory/feedback_*.md](.claude/projects/-Users-user-Desktop-jarvis/memory/) — szczegółowe lessons

### TOP 10 traps które ZAWSZE apply per nowy klient

#### TRAP-01 — Default13 baseline selectors (specificity matched)

**Symptom**: Po wklejeniu naszych override'ów, system reguły z `!important` wciąż wygrywają.

**Root cause**: IdoBooking default13 ma 3 reguły z bardzo wysoką specificity z `!important`:

- `header.default13 .navbar-toggler` (0,2,3 !important)
- `body.page-index header:not(.ap-header--scrolled) a[href]:not(.logo):not([class*="btn"])` (0,5,3 !important)
- `body.page-index header.default13:not(.ap-header--scrolled) .navbar-reservation` (0,3,3 !important)

**Fix**: Twoje override MUSI mieć równą lub wyższą specificity + `!important`:

```css
body.page-index header.default13:not(.ap-header--scrolled) .navbar-reservation {
  background: var(--ap-primary) !important;
  border-color: var(--ap-primary) !important;
}
```

**Apply**: ZAWSZE jeśli klient używa default13.

#### TRAP-02 — container-hotspot duplikuje wyróżnione oferty

**Symptom**: Na `/offer/N/` pokazują się dwa razy wyróżnione apartamenty — raz system slick carousel, raz nasz custom grid.

**Root cause**: System IdoBooking generuje `.container-hotspot` z slick carousel. My budujemy nasz `.{prefix}-offers-section`. Oba istnieją równolegle.

**Fix** w `KONIEC_BODY.html`:

```js
function killHotspotDuplicates() {
  var our = document.querySelector('.{prefix}-offers-section');
  if (our) our.remove();
  var systemHotspot = document.querySelector('.container-hotspot');
  if (systemHotspot) systemHotspot.style.cssText = 'display:none !important;';
}
killHotspotDuplicates();
setTimeout(killHotspotDuplicates, 500);
setTimeout(killHotspotDuplicates, 1500);
setTimeout(killHotspotDuplicates, 3500);
```

W CSS layer1:
```css
.container-hotspot { display: none !important; }
```

**Apply**: ZAWSZE dla klientów z wyróżnionymi ofertami.

#### TRAP-03 — Powered by IdoBooking visibility (wymóg licencyjny)

**Symptom**: Logo "Powered by IdoBooking" w footerze niewidoczne lub z filter:invert co zmienia kolor.

**Fix**:
```css
.powered-by-idobooking img,
.powered-logo,
img[src*="logo_powered_by"] {
  filter: none !important;
  opacity: 1 !important;
  width: 240px !important;
  height: 56px !important;
}
```

Sprawdź wariant SVG (`_on_white.svg` vs `_on_dark.svg`) zgodny z bg footer.

**Apply**: ZAWSZE, audit per każdy projekt.

#### TRAP-04 — Body_bottom 62KB silent truncate

**Symptom**: Skomplikowane JS przestaje działać po wklejeniu, ale w edytorze panelu wygląda OK.

**Root cause**: WAF IdoBooking silently truncates body_bottom field przy ~62KB.

**Fix**: minify JS gdy zbliżasz się do 55KB.

**Apply**: ZAWSZE check size przed deliverem; minify jeśli ≥55KB.

#### TRAP-05 — No emoji w client code (WAF block)

**Symptom**: Save w panelu zwraca błąd 403 lub "Zawartość nie może zostać zapisana".

**Root cause**: WAF IdoBooking odrzuca POST z emoji + panel URLs + tool signatures w polach CSS/JS/HTML.

**Fix**: scan przed save: `grep -P '[\x{1F300}-\x{1F9FF}\x{2600}-\x{26FF}]' file.html`

**Apply**: ZAWSZE check przed deliverem.

#### TRAP-06 — Mobile widget MOVE z #navbar (display:none)

**Symptom**: Custom widget na mobile niewidoczny.

**Root cause**: System `#navbar { display: none }` na mobile.

**Fix**: JS move widget do `.menu-wrapper` przed wyświetleniem (`window.innerWidth <= 991`).

#### TRAP-07 — Litepicker --static centering (inline `left:569px`)

**Symptom**: Datepicker na mobile/tablet "leci" w lewo poza viewport.

**Fix**:
```css
.litepicker.litepicker--static {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  margin: 0 auto !important;
}
```

**Apply**: ZAWSZE jeśli klient używa Litepicker.

#### TRAP-08 — Header `.menu-wrapper` child ma bg

**Symptom**: `header` ustawiony transparent, ale w przeglądarce header ma białe tło.

**Root cause**: Wewnątrz `<header>` jest `<div class="bgd-color-light menu-wrapper">` z `background: white`.

**Fix**:
```css
body.page-index header.default13 .menu-wrapper {
  background: transparent !important;
}
```

**Apply**: ZAWSZE dla vibes z transparent-overlay nav.

#### TRAP-09 — Ken Burns zoom (default13 hero slick)

**Symptom**: Hero zdjęcia na home startują powiększone 110% i powoli zoomują dalej. Klient widzi tylko fragment kompozycji.

**Root cause**: `#parallax_topslider .slick-track img { transform: scale(1.1); transition: 15s }` w default13 baseline.

**Fix**: Wymusić scale(1) na 4 selektorach:
```css
#parallax_topslider .slick-track img,
#parallax_topslider .slick-track img.animate,
.section.parallax .slick-track img,
.section.parallax .slick-track img.animate {
  transform: scale(1) !important;
  transition: none !important;
}
```

**Apply**: ZAWSZE dla klientów default13 z hero slider.

#### TRAP-10 — Cross-file grep przy text changes

**Symptom**: Klient zgłasza "zmieniłem nazwę dzielnicy na X ale wciąż widzę starą Y".

**Root cause**: Hardcoded dane rozsiane między plikami: body_top + body_bottom (np. `initLeafletMap` z district name) + CSS.

**Fix**: ZAWSZE przy text change:
```bash
grep -rn "<stary tekst>" clients/<nazwa>/DO_WKLEJENIA/
```

**Apply**: ZAWSZE przy ANY text change.

### Pozostałe 53 traps

Patrz [library/css/layer1-traps.css](library/css/layer1-traps.css) — każdy ma komentarz nad regułą z opisem symptom + root cause + apply scope.

Pełna lista nazw w [memory/MEMORY.md](.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md) sekcja "System Traps".

---

## §5. Instincts (35 reaction patterns) ⏳ PARTIAL

> Status jak §4 — pełna sekcja będzie w v4.1. TOP 10:

### INSTINCT-01 — User mówi "sprawdz" → MCP NATYCHMIAST

Nie odpowiadaj tekstem bazując na założeniach. ZAWSZE odpal Chrome DevTools MCP, navigate do strony klienta, zrób screenshot, computed style query, return findings.

### INSTINCT-02 — Bug wraca po fixie = diagnoza była ZŁA

Jeśli "naprawiłem X" a klient zgłasza X znowu po godzinie/dniu — root cause był inny. NIE re-aplikuj tego samego fixu. Re-investigate z zero.

### INSTINCT-03 — Po >5 wersji sprintu mandatory CSS refactor

Po 5+ patch versions jednego klienta, CSS staje się "cascade race" z orphan duplicates wygranymi nad fixami. STOP patching, refactor cały plik z nuli używając layer system. (Fair Rentals v1.69 lesson.)

### INSTINCT-04 — Klient nigdy nie czeka na "ja wracam jutro"

Nawet "drobny" bug raportowany przez klienta wymaga response w <2h roboczych. Jeśli nie wiesz teraz, wyślij "Sprawdzam, daję znać w ciągu Xh" — nigdy ciszy.

### INSTINCT-05 — Minimal patch przed expanding scope

Damian preferuje 6-linii fix nad 50-linii refactor. Zacznij od najmniejszej zmiany, pokaż, czekaj na akceptację. NIE prezentuj 3 opcji A/B/C gdy klient zgłosił 1 problem.

### INSTINCT-06 — Cross-file grep przed claim "fix kompletny"

Po edycie pliku X dla tekstowej zmiany, ZAWSZE `grep -rn "<tekst>"` w całym `clients/<nazwa>/`. Update wszystkie hits przed claim done.

### INSTINCT-07 — Live computed style verify zamiast wizualnego

Screenshots interpretowane wizualnie zawodzą przy: low resolution screenshot, DPR scaling, dark mode, subtle border colors. ZAWSZE backup wizualnej oceny computed style query przez MCP.

### INSTINCT-08 — Single-file CSS workflow (Damian preferuje)

NIGDY nie rozdzielaj patches na `PATCH_2026-XX.css` + `ARKUSZ_STYLOW.css` osobno. Damian: "musi być zawsze jeden plik". Replace-all approach.

### INSTINCT-09 — Per-page-context CSS (NIE globalne)

Reguły specyficzne dla podstrony MUSZĄ mieć `body.page-X` prefix. Globalne `.hero { ... }` łamie inne podstrony.

### INSTINCT-10 — Absolute paths zawsze w chat linkach

Claude Code może startować w `.claude/worktrees/<branch>/`. Markdown linki rendowane jako relative path resolves do CWD = często ścieżki kopiują się błędnie. Zawsze pisz `/Users/user/Desktop/jarvis/<path>` w odpowiedziach do usera.

### Pozostałe 25 instincts

Patrz `memory/feedback_*.md` w `.claude/projects/-Users-user-Desktop-jarvis/memory/`.

---

## §6. Lessons Learned (26) ⏳ PARTIAL

> Status jak §4. TOP 8 najważniejszych:

### LESSON-01 — IdoBooking offer description encje HTML

`.offer__description` zwraca `&quot;` jako literalny tekst, nie escapowany. Featured-offer JS MUSI `decodeEntities()` przez textarea-trick PRZED `escapeText`. Solidne Apartamenty v1.2 (2026-05-25).

### LESSON-02 — Object-fit cover + 100vh = anti-responsive

Klient zgłasza "zdjęcie nie zmniejsza się responsywnie". To wbudowane zachowanie `cover` z sztywną wysokością — skaluje W GÓRĘ, nie w dół. Trzy opcje: cover (status quo), contain+bg-color (letterbox), aspect-ratio (łamie fullpage.js). Booking-bydgoszcz 2026-05-25.

### LESSON-03 — Aspect-ratio + min-height = WIDTH overflow

Element z `aspect-ratio + min-height` puchnie WIDTH gdy min-height przekracza naturalną height. Fix: `min-height:0; width:100%; max-width:100%` na mobile. Solidne Apartamenty v1.2.

### LESSON-04 — Mobile widget MOVE z #navbar (display:none)

System `#navbar { display: none }` na mobile. Custom widget tam = niewidoczny. JS move do `.menu-wrapper`.

### LESSON-05 — Live CSS vs source drift

Klientka może wkleić starą/niepełną wersję CSS. `curl <domain>/custom.css` + diff z local source PRZED edycją.

### LESSON-06 — Powered by SVG variant mismatch

IdoBooking ma `_on_white.svg` i `_on_dark.svg`. Mismatch z bg footer = niewidoczne (licensing risk).

### LESSON-07 — Sticky tabs `--fixed` BEM modifier scroll

Sticky tabs na `/offer/N/` (Apartamenty, Galeria, FAQ) muszą używać IntersectionObserver do dodania `--fixed` modifier, NIE pure CSS `position: sticky` (system overrides z `z-index: 1`).

### LESSON-08 — Per-page-context CSS rules

`body.page-index` prefix dla home-only rules. `body.page-offer` dla offer-only. `body.page-txt` dla podstron CMS. Bez prefiksu reguły leakują do innych podstron.

### Pozostałe 18 lessons

Patrz `memory/feedback_*.md` w memory folder.

---

## §7. Variety Guidelines (20 vibes mapping)

### Vibe → recommended section variants

JARVIS automatycznie pickuje warianty z `vibe-presets.json/recommended_variants`. Tabela mapping:

| Vibe | Hero | About | Gallery | CTA | Features | Footer | Nav |
|---|---|---|---|---|---|---|---|
| luxury-heritage | asymmetric-grid | asym-text-img | asym-mosaic | dark-bold | icon-grid-4col | dark-rich | transparent-overlay |
| modern-minimal | centered-typography | split-half | grid-equal | minimal-text | alternating-rows | minimal | solid |
| rustic-warm | split-half | story-narrative | polaroid-stack | side-image | text-list-numbered | compact | transparent-overlay |
| modern-coastal | full-bleed-image | image-mosaic-text | slider-fullscreen | gradient | cards-pop-hover | image-bg | transparent-overlay |
| urban-bold | centered-typography | full-width-quote | masonry | multi-button-row | comparison-table | minimal | solid |
| wellness-calm | centered-typography | split-half | grid-equal | gradient | cards-pop-hover | minimal | solid |
| heritage-warm | overlap-image | founder-portrait-quote | lightbox-thumbs | dark-bold | alternating-rows | dark-rich | transparent-overlay |
| family-friendly | split-half | stat-row-cards | grid-equal | gradient | icon-grid-4col | compact | solid |
| boutique-romantic | overlap-image | asym-text-img | polaroid-stack | side-image | accordion-vertical | compact | transparent-overlay |
| scandi-clean | centered-typography | split-half | grid-equal | minimal-text | alternating-rows | minimal | solid |
| mountain-rugged | parallax-scroll | timeline-vertical | masonry | dark-bold | icon-grid-4col | dark-rich | transparent-overlay |
| mediterranean-villa | full-bleed-image | image-mosaic-text | isotope-filter | side-image | alternating-rows | image-bg | transparent-overlay |
| art-deco-vintage | overlap-image | founder-portrait-quote | isotope-filter | dark-bold | comparison-table | dark-rich | transparent-overlay |
| eco-glamping | full-bleed-image | story-narrative | masonry | gradient | icon-grid-4col | image-bg | transparent-overlay |
| business-corporate | split-half | stat-row-cards | grid-equal | minimal-text | comparison-table | minimal | solid |
| winter-alpine | parallax-scroll | timeline-vertical | lightbox-thumbs | side-image | icon-grid-4col | dark-rich | transparent-overlay |
| asian-zen | minimal-text | full-width-quote | grid-equal | minimal-text | text-list-numbered | minimal | solid |
| industrial-loft | asymmetric-grid | full-width-quote | masonry | dark-bold | comparison-table | dark-rich | solid |
| garden-cottage | split-half | story-narrative | polaroid-stack | side-image | accordion-vertical | compact | transparent-overlay |
| tropical-resort | full-bleed-image | image-mosaic-text | slider-fullscreen | gradient | cards-pop-hover | image-bg | transparent-overlay |

### Anti-duplication tracker

W `vibe-presets.json.history` JARVIS notuje co już zostało użyte per klient. Cel: każdy nowy klient w tym samym vibe powinien wybierać INNY hero variant niż poprzedni klient.

Jeśli klient ma silny brand reason dla konkretnego variant — OK, ignoruj anti-duplication. Ale default: dywersyfikuj.

### Per-vibe interactions style

- **subtle-hover-scale**: luxury, heritage, boutique, art-deco, mountain, winter
- **smooth-fade-reveal**: modern, scandi, coastal, wellness, urban, asian, tropical
- **warm-glow-hover**: rustic, family, eco, garden, mediterranean

### Per-vibe dividers

- **classic-gold-leaf**: luxury, heritage, art-deco
- **wave-soft**: rustic, wellness, boutique, family, garden
- **wave-svg**: coastal
- **wave-sharp**: mountain, winter, industrial
- **wave-organic**: mediterranean, eco, tropical
- **thin-lines**: modern, scandi, urban, business, asian

---

## §8. Deployment Checklist

> ZERO toleration na pominięcie. Pełna checklist przed wysłaniem klientowi.

### Pre-flight

- [ ] `clients/<nazwa>/DO_WKLEJENIA/` istnieje i ma wszystkie 8+ plików
- [ ] CSS_EDYTOR.css ≤ 200KB
- [ ] KONIEC_BODY.html ≤ 60KB (warning >55KB)
- [ ] body_top per podstrona ≤ 30KB każdy
- [ ] INSTRUKCJA.txt obecna i kompletna (8 sekcji defensywnego formatu)

### Code quality

- [ ] NO emoji w żadnym z plików DO_WKLEJENIA/
- [ ] NO panel URLs hardcoded
- [ ] NO tool signatures
- [ ] NO Polish chars w identyfikatorach class/id
- [ ] Wszystkie `url("data:image/svg+xml,...")` URL-encoded poprawnie (`%23` not `#`)
- [ ] Wszystkie hex codes UPPERCASE
- [ ] Prefix CSS klient (`{prefix}-`) zastąpiony WSZĘDZIE (xx- nie powinno występować)

### Traps applied

- [ ] container-hotspot `display: none` w CSS
- [ ] killHotspotDuplicates() w KONIEC_BODY z 4 timeoutami
- [ ] Powered by IdoBooking visibility
- [ ] Powered by SVG variant zgodny z footer bg
- [ ] Default13 baseline selectors matched
- [ ] Ken Burns zoom kill (jeśli default13 hero slider)
- [ ] Sticky tabs `--fixed` BEM z IntersectionObserver
- [ ] Brand-neutral mode (jeśli shared engine multi-property)

### Live verify (MCP)

- [ ] Desktop 1920×1080 — brand colors, fonty, header type
- [ ] Mobile 375×812 — hamburger, search-first order
- [ ] Tablet 768×1024 — graceful degradation
- [ ] Offer page — kill duplicates working, price chip
- [ ] Footer — Powered by widoczne, payment strip OK
- [ ] Lighthouse Mobile ≥80

### Multi-language

- [ ] System button text translation per `html[lang]`
- [ ] Wszystkie body_top files per język
- [ ] hreflang tags w HEAD per podstrona

### Final delivery

- [ ] ZIP package: `<klient>_DO_WKLEJENIA_v<wersja>_<data>.zip`
- [ ] Email do klienta + skrót INSTRUKCJA.txt + nasz email do support
- [ ] Update `data/clients.json` status = "delivered"
- [ ] Update `memory/client_<nazwa>.md` z release notes
- [ ] Update MEMORY.md w sekcji "Active Clients"

---

## §9. Post-deploy Iterations Playbook

### Ticket od klienta arrives

```
1. ACK natychmiast (<30 min):
   "Otrzymaliśmy zgłoszenie. Sprawdzam, daję znać max <2h roboczych>."

2. MCP live verify (15 min):
   - Navigate do strony klienta
   - Reproduce problem
   - Screenshot evidence
   - Computed style query jeśli wizualny problem

3. Diagnose (15-30 min):
   - Sprawdź czy known bug w memory/feedback_*
   - Jeśli nowy: zapisz feedback memory ZARAZ z root cause analysis

4. Fix (30-90 min):
   - Minimal patch first (Damian preferuje)
   - Single-file CSS (replace całość, nie patch separate)
   - Cross-file grep przed claim "done"

5. Live verify (15 min):
   - MCP audit per zmianie
   - Screenshot before/after
   - Computed style confirmation

6. Delivery (10 min):
   - Email klientowi z odpowiedzą + nowymi plikami
   - INSTRUKCJA dla update (zwykle: "Wklej tylko CSS_EDYTOR.css")
   - Update memory client_<nazwa>.md z wersją

7. Sign-off:
   - Klient confirmuje "OK, działa" → zamknij ticket
   - Klient milczy 24h → ping
```

### Iteracje versioning

- v1.0 = first delivery
- v1.1 = bugfix + drobne improvements
- v1.2 = nowa feature
- v2.0 = major redesign / nowy vibe / nowe podstrony

### Anti-pattern: scope creep

NIE proponuj features klient nie poprosił. "Klient prosi X — zrób X. NIE robisz przy okazji Y i Z."

Jeśli przy fixie X widzisz potencjalny Y problem, **mention w odpowiedzi** ale NIE fix bez explicit go-ahead.

---

## §10. Emergency Debugging (trigger-driven)

### Trigger: "strona klienta nie działa wcale (500/blank)"

```
1. curl -I <domain>/  → kod HTTP?
2. Jeśli 500: panel IdoBooking issue → IdoSell support (nie nasz problem)
3. Jeśli 200 ale blank: prawdopodobnie nasz CSS lub JS broke
   - Check JS console przez MCP browser
   - Sprawdź czy ostatnia zmiana była nasza czy klienta
   - REWIND: wklej z naszego ostatniego deliveru zapasowy CSS
```

### Trigger: "after panel update, nasze CSS broke"

IdoBooking sometimes pushes platform updates that break custom CSS:

```
1. MCP navigate, get current DOM structure
2. Diff z naszym oczekiwanym (compare class names, hierarchy)
3. Update CSS selectors aby match nowej struktury
4. Test + deploy
5. Update memory/feedback_idobooking_platform_update_<data>.md
```

### Trigger: "live computed style != source code"

```
1. curl -s <domain>/custom.css > /tmp/live.css
2. diff /tmp/live.css clients/<nazwa>/DO_WKLEJENIA/CSS_EDYTOR.css
3. Jeśli różnice:
   - Klient mógł wkleić starszą wersję
   - Klient mógł edytować sam w panelu
   - Cache CDN stary (force refresh)
```

### Trigger: "klient wysłał screenshot z bugiem"

NIGDY nie wierz wizualnej interpretacji small screenshot. ZAWSZE:

```
1. Klient: "ramka jest zielona zamiast czerwonej"
2. Ty: "Daj sekundę, sprawdzam computed style"
3. MCP navigate → element targeting → getComputedStyle().borderColor
4. Compare z DESIGN_TOKENS.md
5. Confirm bug + plan fix
```

### Trigger: "nic nie zmienia się po wklejeniu"

```
1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Sprawdź czy panel zapisał ("Zapisz" klikał?)
3. Sprawdź WAF block (czy zwracał 403?)
4. Sprawdź body_bottom truncate (jeśli >55KB)
5. Sprawdź emoji w pliku (WAF reject silent)
```

### Trigger: "klient pisze że jest gorzej niż było"

ZAWSZE poważnie. NIE bagatelizuj.

```
1. ACK natychmiast
2. MCP screenshot live current state
3. Compare z naszym last known good
4. Jeśli evidence że poprawiliśmy A ale zepsuliśmy B:
   - Apologize + rewind do last good
   - Diagnose root cause B
   - Plan new fix dla A że nie psuje B
5. Jeśli evidence że klient sam coś edytował:
   - Diplomatically: "Sprawdziliśmy diff — wygląda że w panelu została edycja po naszym deliverze."
   - NIE oskarżaj, tylko fakty + offer rewind
```

---

## §A. Memory Cross-References

> Pełna mapa memory files w `.claude/projects/-Users-user-Desktop-jarvis/memory/`:

### Aktywni klienci (`client_*.md`)

Patrz [memory/MEMORY.md](.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md) sekcja "Active Clients" — 11 aktywnych klientów na stan 2026-05-25.

### System traps (`feedback_*.md`)

26+ system traps documented. Najnowsze (2026-05-25): Ken Burns zoom, object-fit anti-responsive, HTML entities, aspect-ratio overflow, default13 baseline, live verify computed style, cross-file grep, minimal patch preference.

### Patterns (`pattern_*.md`)

- `pattern_baseline_v2.md` — "Jak budujemy strony w 2026-05" distillacja 12 projektów
- `pattern_idosell_websites.md` — master rules dla IdoSell websites
- `pattern_idobooking_overview.md` — platform fundamentals
- `pattern_idosell_clients_db.md` — registry wszystkich klientów

### Workflows (`workflow_*.md`)

- `workflow_new_client_kickoff.md` — 6-phase procedural template
- `workflow_idosell_generator.md` — automation scripts

### Reference docs (`reference_*.md`)

- `reference_idobooking_seo_audit.md` — SEO audit checklist
- `reference_idobooking_api_pricing.md` — Public/pricingOffers API

### JARVIS Skills (zainstalowane w `~/.claude/skills/`)

- `idosell-website-builder` — full pipeline Phase 0-6
- `idosell-deploy-cr` — pre-deploy checklist
- `idosell-bug-debug` — 10-step systematic debug
- `idosell-seo-audit` — Lighthouse + trend tracking
- `idosell-a11y-audit` — WCAG 2.1 AA 4-layer audit
- `idosell-e2e-test` — 8 critical flows per typu klienta
- `idosell-memory-consolidate` — monthly merge duplikaty

---

## Update history

- **v4.0** (2026-05-25) — JARVIS Overhaul: §0-§3 + §7-§10 inline, §4-§6 partial (TOP 10), 10-layer library, 20 vibes, BRIEF template, vibe-presets.json
- v3.17 (2026-05-XX) — pre-overhaul; flat README-style; lessons z Piekary13 v3.0-v3.17 baked in
- v3.x pierwsze versions — basic project overview

---

> **Pytania / problemy z tym dokumentem**: zapisz `memory/feedback_claude_md_<topic>.md` + update MEMORY.md.
