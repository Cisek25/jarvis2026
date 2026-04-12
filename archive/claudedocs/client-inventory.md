# Client Site Inventory
Generated: 2026-03-13

## Master Template Reference (cms_pages/)

The `cms_pages/` directory is the current master template (v2). It contains:

| File | Page |
|------|------|
| `00_CUSTOM_CSS_v2.css` | Global stylesheet |
| `01_STRONA_GLOWNA_*.html` | Home page (PL + DE + EN + ES + v2) |
| `02_APARTAMENTY_*.html` | Apartments listing (PL + DE + EN + ES + v2) |
| `03_EAGLE_NEST_*.html` | Apartment subpage (PL + DE + EN + ES + v2) |
| `04_EAGLE_VIEW_*.html` | Apartment subpage (PL + DE + EN + ES + v2) |
| `05_EAGLE_TOWER_*.html` | Apartment subpage + amenities (PL + DE + EN + ES + v2) |
| `06_LOKALIZACJA_*.html` | Location page (PL + DE + EN + ES + v2) |
| `07_ATRAKCJE_*.html` | Attractions (PL + DE + EN + ES + v2) |
| `08_GALERIA_*.html` | Gallery container (PL + DE + EN + ES + v2) |
| `09_GALERIA_ZDJECIA_*.html` | Gallery images (PL + DE + EN + ES + v2) |
| `INSTRUKCJA_WKLEJANIA.md` | Deployment instructions |

**Languages:** PL (v2), DE, EN, ES
**Standard page count per language:** 9 pages + CSS

---

## Client Status Matrix

### 1. GoldenApartments (ACTIVE)

| Property | Value |
|----------|-------|
| Folder | `GoldenApartments/` |
| IdoSell panel | `client57304.idosell.com` |
| Booking engine | `engine57304.idobooking.com` |
| Live domain | `goldenapartments.com.pl` |
| Status | **ACTIVE — in production** |

**Files:**
- `golden_widget.css` — widget styling
- `wyszukiwarka-restyling.css` — search bar custom styles
- `silnik/wyszukiwarka.css` — booking engine search CSS
- `zrzuty/` — screenshots folder
- `DO_WKLEJENIA_v3/` — current deploy version
  - `golden_1_ARKUSZ_STYLOW.css` — main stylesheet
  - `KONIEC_BODY_JS.html` — end-of-body JS

**Pages in DO_WKLEJENIA_v3 (current):**

| Page | Status |
|------|--------|
| Strona glowna | CSS + JS only — no HTML page file |
| Nasze Apartamenty (txt/201) | Deployed via older v1/v2 |
| Najem Dlugoterminowy (txt/202) | Deployed via older v1/v2 |
| Sopot i Gdynia (txt/203) | Deployed via older v1/v2 |
| Nieruchomosci (txt/204) | Deployed via older v1/v2 |

**Notes:**
- v3 contains CSS + JS only (panel-level injection)
- Full page HTML files are in `GoldenApartments_stare/` (see below)
- The 4 txt/ subpages are already deployed in the live CMS
- Custom search bar positioning CSS applied directly in IdoSell panel

**Missing vs master template:**
- Galeria page
- Atrakcje page
- Lokalizacja page
- Apartment-level subpages (per unit)
- Multilingual versions (DE, EN, ES)

---

### 2. GoldenApartments_stare (ARCHIVED — older versions)

| Property | Value |
|----------|-------|
| Folder | `GoldenApartments_stare/` |
| IdoSell panel | `client57304.idosell.com` (same client) |
| Status | **ARCHIVED — superseded by current work** |

**Versions present:**
- `DO_WKLEJENIA/` (v1) — 4 subpages + CSS_PODSTRONY.css
- `DO_WKLEJENIA_v2/` — 4 subpages + CSS_PODSTRONY.css

**Pages (both versions identical):**

| File | Page |
|------|------|
| `TRESC_HTML.html` | Main page content |
| `KONIEC_BODY_JS.html` / `KONIEC_BODY_JS_SAFE.html` | End-of-body JS |
| `golden_1_ARKUSZ_STYLOW.css` | Stylesheet |
| `PODSTRONY/01_NASZE_APARTAMENTY.html` | Subpage |
| `PODSTRONY/02_NAJEM_DLUGOTERMINOWY.html` | Subpage |
| `PODSTRONY/03_SOPOT_GDYNIA.html` | Subpage |
| `PODSTRONY/04_NIERUCHOMOSCI.html` | Subpage |
| `PODSTRONY/CSS_PODSTRONY.css` | Subpage styles |

**Notes:** v1 also has `KONIEC_BODY_JS_SAFE.html` and `INSTRUKCJA.txt`. Both versions are functionally identical.

---

### 3. wawabed2 (ACTIVE — current version)

| Property | Value |
|----------|-------|
| Folder | `wawabed2/` |
| IdoSell panel | `client53370.idosell.com` |
| Live domain | `wawabed.pl` |
| Status | **ACTIVE — v2 (current)** |

**Files:**

| File | Description |
|------|-------------|
| `01_STRONA_GLOWNA_PL.html` | Home page (PL) |
| `03_HEAD_CODE.html` | HEAD section (fonts, meta) |
| `04_GALERIA.html` | Gallery page |
| `05_ATRAKCJE.html` | Attractions page |
| `06_KONTAKT.html` | Contact page |
| `custom.css` | Main stylesheet |
| `wawabed.css` | Additional/older CSS |
| `JS_WAWABED.js` | Custom JavaScript |
| `helper.html` | Development helper |
| `serve.py` | Local dev server |
| `ZDJECIA_URLS.txt` | Image URL reference list |

**Pages completed:**

| Page | Status |
|------|--------|
| Strona glowna (PL) | DONE |
| Galeria | DONE |
| Atrakcje | DONE |
| Kontakt | DONE |
| HEAD/SEO tags | DONE |

**Missing vs master template:**
- Apartamenty / individual apartment subpages
- Lokalizacja page
- Multilingual versions (DE, EN, ES) — B&B concept may not require

**Notes:** Warm Vintage / Art Deco style. Images hosted on `client53370.idosell.com`. Has local dev server (`serve.py`).

---

### 4. wawabed (ARCHIVED — older version)

| Property | Value |
|----------|-------|
| Folder | `wawabed/` |
| IdoSell panel | `client53370.idosell.com` (same client) |
| Status | **ARCHIVED — superseded by wawabed2** |

**Files:** `01_STRONA_GLOWNA_PL.html`, `03_HEAD_CODE.html`, `04_GALERIA.html`, `05_ATRAKCJE.html`, `06_KONTAKT.html`, `custom.css`, `JS_WAWABED.js`, `serve.py`, `ZDJECIA_URLS.txt`

**Notes:** Near-identical file structure to wawabed2. Older design iteration, kept for reference.

---

### 5. SORS (ACTIVE — multilingual)

| Property | Value |
|----------|-------|
| Folder | `SORS/` |
| IdoSell panel | Not identified (no client ID in files) |
| Live domain | Not found in files |
| Status | **ACTIVE — PL + 3 languages (DE, EN, ES)** |
| Location | Batumi, Georgia |

**Files:**

| File | Description |
|------|-------------|
| `glowna_redesign_GOTOWE.html` | Home page (PL) |
| `glowna_redesign_GOTOWE_DE.html` | Home page (DE) |
| `glowna_redesign_GOTOWE_EN.html` | Home page (EN) |
| `glowna_redesign_GOTOWE_ES.html` | Home page (ES) |
| `glowna_oferty_GOTOWE.html` | Offers embed (home) |
| `apartamenty_embed_GOTOWE.html` | Apartments embed (txt/201) |
| `apartamenty_embed.css` | Apartments CSS |
| `apartamenty_embed.js` | Apartments JS |
| `glowna_redesign.css` | Home page CSS |
| `glowna_oferty.css` | Offers section CSS |
| `eagle-tower/` | Eagle Tower subpage files (DE, EN, ES, PL v2) |

**eagle-tower/ subfolder:**
- `eagle_tower_GOTOWE.html` (PL)
- `eagle_tower_GOTOWE_DE.html`
- `eagle_tower_GOTOWE_EN.html`
- `eagle_tower_GOTOWE_ES.html`

**Pages completed:**

| Page | PL | DE | EN | ES |
|------|----|----|----|----|
| Strona glowna | DONE | DONE | DONE | DONE |
| Oferty (embed) | DONE | - | - | - |
| Apartamenty embed | DONE | - | - | - |
| Eagle Tower | DONE | DONE | DONE | DONE |

**Missing vs master template:**
- No custom CSS file (separate CSS per component only)
- Galeria page
- Lokalizacja page
- Atrakcje page (images use Wikipedia URLs — placeholder quality)
- Eagle Nest, Eagle View individual pages not found in folder (may be in cms_pages)
- No identifiable client/panel URL

---

### 6. willa kapitanska new (ACTIVE — multilingual)

| Property | Value |
|----------|-------|
| Folder | `willa kapitanska new/` |
| IdoSell panel | `client57041.idosell.com` |
| Booking engine | `engine57041.idobooking.com` |
| Live domain | `villakapitanska.pl` |
| Facebook | `facebook.com/villa.kapitanska/` |
| Status | **ACTIVE — PL + DE (bilingual)** |

**Files:**

| File | Description |
|------|-------------|
| `01_STRONA_GLOWNA_PL.html` | Home page (PL) |
| `01_STRONA_GLOWNA_DE.html` | Home page (DE) |
| `02_GALERIA_PL.html` | Gallery (PL) |
| `02_GALERIA_DE.html` | Gallery (DE) |
| `03_SEO_HEAD_TAGS.html` | HEAD/SEO code |
| `04_ONAS_DE.html` | About us (DE) |
| `04_ONAS_PL.html` | About us (PL) |
| `05_REGULAMIN_DE.html` | Terms/regulations (DE) |
| `05_REGULAMIN_PL.html` | Terms/regulations (PL) |
| `07_ATRAKCJE_DE.html` | Attractions (DE) |
| `07_ATRAKCJE_PL.html` | Attractions (PL) |
| `ostateczny.css` | Main stylesheet |
| `JS_GALERIA.js` | Gallery JavaScript |
| `JS_STRONA_GLOWNA.js` | Home page JavaScript |

**Pages completed:**

| Page | PL | DE |
|------|----|----|
| Strona glowna | DONE | DONE |
| Galeria | DONE | DONE |
| O nas | DONE | DONE |
| Regulamin | DONE | DONE |
| Atrakcje | DONE | DONE |
| SEO/HEAD | DONE | - |

**Missing vs master template:**
- Apartamenty / individual apartment subpages (missing from folder)
- Lokalizacja page
- Missing languages: EN, ES
- No page numbered 06 (gap in sequence — lokalizacja expected)

---

### 7. grzybek (EARLY STAGE)

| Property | Value |
|----------|-------|
| Folder | `grzybek/` |
| IdoSell panel | `client57156.idosell.com` |
| Live domain | Not found |
| Status | **EARLY STAGE — CSS only** |

**Files:**

| File | Description |
|------|-------------|
| `custom.css` | Custom stylesheet |
| `DO_WKLEJENIA/` | Deploy folder (CSS only) |

**DO_WKLEJENIA/ contents:** same `custom.css` (no HTML pages found)

**Pages completed:** None identified

**Missing vs master template:**
- ALL HTML pages (strona glowna, apartamenty, galeria, atrakcje, lokalizacja, kontakt)
- CSS exists but appears to be framework-only
- No content pages whatsoever

---

### 8. dobry_wiatr (EARLY STAGE — CSS only)

| Property | Value |
|----------|-------|
| Folder | `dobry_wiatr/` |
| Booking engine | `engine52436.idobooking.com` |
| Client name | "Dobry Wiatr Chalupy - Villa Baltic Apartament 4" |
| Live domain | Not found |
| Status | **EARLY STAGE — CSS only** |

**Files:**

| File | Description |
|------|-------------|
| `custom.css` | Custom stylesheet |

**Pages completed:** None

**Missing vs master template:**
- ALL HTML pages
- Only CSS present — no content pages at all

**Notes:** Uses IdoBooking engine (not IdoSell). Single apartment property.

---

### 9. PerfectApart (MINIMAL — single CSS)

| Property | Value |
|----------|-------|
| Folder | `PerfectApart/` |
| Booking engine | `engine22765.idobooking.com` |
| Live domain | Not found |
| Status | **MINIMAL — single CSS component** |

**Files:**

| File | Description |
|------|-------------|
| `kod-rabatowy.css` | Discount code banner CSS only |

**Pages completed:** None (CSS component only — not a full site)

**Missing vs master template:**
- ALL pages
- Only a single UI component CSS (discount code bar) present

---

### 10. willa_raclawicka (EARLY STAGE)

| Property | Value |
|----------|-------|
| Folder | `willa_raclawicka/` |
| Live domain | Not found (no client/engine ID in files) |
| Status | **EARLY STAGE — 2 section embeds + CSS** |

**Files:**

| File | Description |
|------|-------------|
| `00_CUSTOM_CSS.css` | Main stylesheet |
| `01_SEKCJA_APARTAMENTY.html` | Apartments section embed |
| `02_SEKCJA_UDOGODNIENIA.html` | Amenities section embed |

**Pages completed:** None (partial sections only)

**Missing vs master template:**
- Full strona glowna
- All standalone pages (galeria, atrakcje, lokalizacja, kontakt)
- No client/panel URL identified
- No multilingual versions

---

## Summary Matrix

| Client | Folder | Client ID | Live Domain | Pages Done | CSS | JS | Stage |
|--------|--------|-----------|-------------|-----------|-----|-----|-------|
| GoldenApartments | `GoldenApartments/` | client57304 | goldenapartments.com.pl | 4 subpages (live) | YES | YES | ACTIVE |
| GoldenApartments (old) | `GoldenApartments_stare/` | client57304 | — | 4 subpages (archived) | YES | YES | ARCHIVED |
| wawabed2 | `wawabed2/` | client53370 | wawabed.pl | 4/9 pages | YES | YES | ACTIVE |
| wawabed (old) | `wawabed/` | client53370 | — | 4/9 pages (archived) | YES | YES | ARCHIVED |
| SORS | `SORS/` | unknown | unknown | 4+/9 pages (PL+DE+EN+ES) | partial | YES | ACTIVE |
| willa kapitanska | `willa kapitanska new/` | client57041 | villakapitanska.pl | 5/9 pages (PL+DE) | YES | YES | ACTIVE |
| grzybek | `grzybek/` | client57156 | unknown | 0/9 pages | YES | — | EARLY |
| dobry_wiatr | `dobry_wiatr/` | engine52436 | unknown | 0/9 pages | YES | — | EARLY |
| PerfectApart | `PerfectApart/` | engine22765 | unknown | 0/9 pages | partial | — | MINIMAL |
| willa_raclawicka | `willa_raclawicka/` | unknown | unknown | 0/9 pages | YES | — | EARLY |

---

## Missing Pages by Client (vs Master Template)

### Standard page set (from cms_pages master):
1. Strona glowna
2. Apartamenty
3-5. Individual apartment pages (Eagle Nest / Eagle View / Eagle Tower equivalent)
6. Lokalizacja
7. Atrakcje
8. Galeria (container)
9. Galeria zdjecia
+ CSS + optional HEAD/SEO code

| Page | GoldenApartments | wawabed2 | SORS | willa_kap | grzybek | dobry_wiatr | PerfectApart | willa_racl |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Strona glowna | YES (via CSS/JS) | YES | YES | YES | NO | NO | NO | NO |
| Apartamenty | partial | NO | partial | NO | NO | NO | NO | partial |
| Apt subpages | NO | NO | Eagle Tower | NO | NO | NO | NO | NO |
| Lokalizacja | NO | NO | NO | NO | NO | NO | NO | NO |
| Atrakcje | NO | YES | placeholder | YES | NO | NO | NO | NO |
| Galeria | NO | YES | NO | YES | NO | NO | NO | NO |
| Kontakt | YES | YES | NO | NO | NO | NO | NO | NO |
| CSS | YES | YES | partial | YES | YES | YES | partial | YES |
| Multilingual | NO | NO | PL+DE+EN+ES | PL+DE | NO | NO | NO | NO |

---

## Key Observations

1. **cms_pages/ is the SORS master** — The master template (09 pages × 4 languages) was built for SORS (Eagle Nest/Eagle View/Eagle Tower property in Spain/Tenerife area).

2. **Two archived clients** — `GoldenApartments_stare/` and `wawabed/` are older versions of the same clients now in `GoldenApartments/` and `wawabed2/`. Safe to treat as reference only.

3. **4 clients need full builds** — grzybek, dobry_wiatr, PerfectApart, willa_raclawicka have zero HTML pages completed.

4. **Lokalizacja is universally missing** — Not a single client has a Lokalizacja page built.

5. **No multilingual for most** — Only SORS (4 langs) and willa_kapitanska (2 langs) have multilingual content. Others are PL-only or unknown.

6. **SORS missing client ID** — No IdoSell/IdoBooking panel URL found in SORS files (uses Wikipedia images as placeholders for attractions).

7. **willa_raclawicka missing client ID** — Only custom domain `willaraclawicka.pl` found indirectly but no panel URL confirmed in folder.

8. **PerfectApart is just a component** — Only a discount code bar CSS. Not a site build project yet.
