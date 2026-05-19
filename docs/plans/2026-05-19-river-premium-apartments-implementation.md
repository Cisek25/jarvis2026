# River Premium Apartments — IdoBooking Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Zmigrować witrynę riverpremiumapartments.pl (obecnie Profitroom) na IdoBooking template `default13`, dostarczając 7 stron PL+EN jako copy-paste DO_WKLEJENIA dla panelu klienta.

**Architecture:** Bazowe komponenty JARVIS (`ido-*`) z theming pod brand RPA (granat `#051B3D` + złoto-brąz `#978C71` + Bodoni Moda/DM Sans). 2 custom komponenty: `riv-amenities` (6 ikon) i `riv-offer-card` (featured offers MADERA pattern). CSS w 3 warstwach: L1+L2 niezmienione, L3 ~250 linii theme.

**Tech Stack:** HTML5 + CSS3 (vanilla, brak preprocesorów) + Vanilla JS (ES6+, no jQuery). Verification: Playwright MCP dla browser preview, Lighthouse audit. Target: IdoBooking template `default13`.

**Design doc**: [docs/plans/2026-05-19-river-premium-apartments-migration-design.md](docs/plans/2026-05-19-river-premium-apartments-migration-design.md)

**Branch**: `claude/sad-almeida-23de31` (already on worktree)

---

## Phase 0 — Setup (~30 min)

### Task 0.1: Initialize client folder structure

**Files:**
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/`
- Create: `clients/river-premium-apartments/.gitignore`

**Step 1: Create folder structure**

```bash
cd /Users/user/Desktop/jarvis/.claude/worktrees/sad-almeida-23de31
mkdir -p clients/river-premium-apartments/DO_WKLEJENIA
```

**Step 2: Add gitignore for build artifacts**

Create `clients/river-premium-apartments/.gitignore`:
```
# Recon screenshots are committed, but never commit build temp files
*.tmp
*.log
.DS_Store
```

**Step 3: Commit**

```bash
git add clients/river-premium-apartments/.gitignore clients/river-premium-apartments/DO_WKLEJENIA/
git commit -m "RPA: init DO_WKLEJENIA folder + gitignore"
```

### Task 0.2: Create memory/clients_data entry

**Files:**
- Create: `memory/clients_data/river-premium-apartments.json`

**Step 1: Write client metadata**

Create `memory/clients_data/river-premium-apartments.json`:
```json
{
  "slug": "river-premium-apartments",
  "brand": "River Premium Apartments",
  "owner_entity": "Andrzej Kowalski Fundacja Rodzinna",
  "domain": "riverpremiumapartments.pl",
  "city": "Wrocław",
  "address": "ul. Księcia Witolda 52, 50-203 Wrocław",
  "phones": ["+48 785 818 330", "+48 698 076 020"],
  "email": "rezerwacje@riverpremiumapartments.pl",
  "languages": ["pl", "en"],
  "apartments_count": 4,
  "apartments": [
    { "code": "A", "size_sqm": 40, "max_guests": 2 },
    { "code": "B", "size_sqm": 55, "max_guests": 4 },
    { "code": "C", "size_sqm": 47, "max_guests": 4 },
    { "code": "D", "size_sqm": 35, "max_guests": 2 }
  ],
  "brand_tokens": {
    "primary": "#051B3D",
    "primary_alt": "#12334C",
    "secondary": "#978C71",
    "secondary_alt": "#7E674B",
    "font_heading": "Bodoni Moda",
    "font_body": "DM Sans"
  },
  "platform_migration": {
    "from": "Profitroom (template buenos_aires)",
    "to": "IdoBooking (template default13)"
  },
  "css_prefix": "riv-",
  "status": "in_progress_v1.0",
  "design_doc": "docs/plans/2026-05-19-river-premium-apartments-migration-design.md",
  "blockers": [
    "Logo SVG/PNG hi-res — klient dostarczy",
    "Restauracja content (nazwa, menu, godziny, zdjęcia) — klient dostarczy",
    "Treści EN unikalne — scrape ze źródła + tłumaczenie",
    "IdoBooking panel ofert A-D nie istnieje — fallback static cards"
  ],
  "traps_to_apply": [
    "html font-size 10px → wszystko w PX",
    "fullpage.js detection via MutationObserver",
    "body_top hero teleport do .section.parallax .fp-tableCell",
    ".menu-wrapper child bg (nie header)",
    "Featured offers MADERA pattern",
    "Zero emoji + zero generator comments (WAF-safe)",
    "Powered by IdoBooking footer (opacity ≥0.85)"
  ],
  "created": "2026-05-19",
  "last_updated": "2026-05-19"
}
```

**Step 2: Commit**

```bash
git add memory/clients_data/river-premium-apartments.json
git commit -m "RPA: add client metadata to memory/clients_data"
```

---

## Phase 1 — Layer 3 Theme + HOMEPAGE PL (Day 1, ~6h)

### Task 1.1: Layer 3 base — `:root` tokens + default13 global overrides

**Files:**
- Create: `clients/river-premium-apartments/_build/L3-01-base.css`

**Step 1: Write Layer 3 base CSS**

Create `clients/river-premium-apartments/_build/L3-01-base.css`:
```css
/* ============================================================
   RIVER PREMIUM APARTMENTS — Layer 3 Theme (default13 override)
   Brand: navy #051B3D + beige #978C71
   Fonts: Bodoni Moda (heading) + DM Sans (body)
   ============================================================ */

/* §1 — Brand tokens */
:root {
  --riv-navy:      #12334C;
  --riv-navy-dark: #051B3D;
  --riv-gold:      #7E674B;
  --riv-beige:     #978C71;
  --riv-bg:        #FFFFFF;
  --riv-ink:       #1A1A1A;
  --riv-muted:     #6B6B6B;
  --riv-line:      rgba(151, 140, 113, 0.3);

  --riv-font-heading: 'Bodoni Moda', Georgia, 'Times New Roman', serif;
  --riv-font-body:    'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --riv-radius-sm: 4px;
  --riv-radius-md: 8px;
  --riv-shadow-card: 0 8px 24px rgba(5, 27, 61, 0.08);
  --riv-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* §2 — default13 global overrides */
body {
  font-family: var(--riv-font-body) !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  color: var(--riv-ink) !important;
  background: var(--riv-bg) !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--riv-font-heading) !important;
  color: var(--riv-navy-dark) !important;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 1.2;
}

h1 { font-size: 48px; line-height: 52px; }
h2 { font-size: 32px; line-height: 38px; font-weight: 600; }
h3 { font-size: 22px; line-height: 28px; font-weight: 600; }

@media (max-width: 767px) {
  h1 { font-size: 32px; line-height: 38px; }
  h2 { font-size: 24px; line-height: 30px; }
  h3 { font-size: 20px; line-height: 26px; }
}

a {
  color: var(--riv-navy-dark);
  text-decoration: none;
  transition: color var(--riv-transition);
}
a:hover { color: var(--riv-beige); }

button, .btn { font-family: var(--riv-font-body); }

/* §3 — focus states (WCAG AA) */
:focus-visible {
  outline: 2px solid var(--riv-beige);
  outline-offset: 2px;
}
```

**Step 2: Verify** — Read the file back to confirm correct save.

**Step 3: Continue to Task 1.2 (no commit yet, will batch L3 commits)**

### Task 1.2: Layer 3 — header + footer theming

**Files:**
- Create: `clients/river-premium-apartments/_build/L3-02-header-footer.css`

**Step 1: Write header + footer CSS**

Create `clients/river-premium-apartments/_build/L3-02-header-footer.css`:
```css
/* ============================================================
   §4 — Header (default13 + fullpage.js transparent state)
   ============================================================ */
header { background: transparent !important; }

header .menu-wrapper {
  background: var(--riv-bg);
  padding: 16px 40px;
  transition: background var(--riv-transition), padding var(--riv-transition);
  border-bottom: 1px solid var(--riv-line);
}

@media (max-width: 991px) {
  header .menu-wrapper { padding: 12px 16px; }
}

header .menu-wrapper .nav-link,
header .menu-wrapper a:not(.btn) {
  color: var(--riv-navy-dark) !important;
  font-family: var(--riv-font-body);
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 12px 20px;
}

header .menu-wrapper .nav-link:hover {
  color: var(--riv-beige) !important;
}

/* Logo placeholder (text version, swap when SVG arrives) */
.riv-logo {
  font-family: var(--riv-font-heading);
  font-size: 18px;
  font-weight: 600;
  color: var(--riv-navy-dark);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

/* Transparent state on fullpage section 1 */
.riv-header--transparent .menu-wrapper {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.riv-header--transparent .menu-wrapper .nav-link,
.riv-header--transparent .menu-wrapper a:not(.btn) {
  color: #FFFFFF !important;
}
.riv-header--transparent .riv-logo { color: #FFFFFF; }

/* ============================================================
   §5 — Footer (granat ciemny, 3 kolumny, Powered by IdoBooking)
   ============================================================ */
footer {
  background: var(--riv-navy-dark) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  padding: 64px 40px 32px;
}

footer h2, footer h3, footer .footer__title {
  color: #FFFFFF !important;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

footer a {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 14px;
  line-height: 2;
}
footer a:hover { color: var(--riv-beige) !important; }

footer .powered_by {
  opacity: 0.9 !important;          /* memory: licensing requirement ≥0.85 */
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 767px) {
  footer { padding: 48px 16px 24px; }
}
```

**Step 2: Continue to Task 1.3.**

### Task 1.3: Layer 3 — hero + split components theming

**Files:**
- Create: `clients/river-premium-apartments/_build/L3-03-hero-split.css`

**Step 1: Write hero + split CSS**

Create the file with:
```css
/* ============================================================
   §6 — Hero (ido-hero extended, fullscreen 80vh)
   ============================================================ */
.ido-hero, .riv-hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #FFFFFF;
  overflow: hidden;
}

.ido-hero::before, .riv-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(5, 27, 61, 0.35), rgba(5, 27, 61, 0.55));
  z-index: 1;
}

.ido-hero__media, .riv-hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.ido-hero__media img, .riv-hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.ido-hero__content, .riv-hero__content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 24px;
}

.ido-hero__title, .riv-hero__title {
  color: #FFFFFF !important;
  font-size: 64px;
  line-height: 1.0;
  font-weight: 400;
  margin: 0 0 24px;
}

.ido-hero__subtitle, .riv-hero__subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  line-height: 1.6;
  font-family: var(--riv-font-body);
  margin: 0 0 32px;
}

@media (max-width: 767px) {
  .ido-hero, .riv-hero { min-height: 70vh; }
  .ido-hero__title, .riv-hero__title { font-size: 36px; }
  .ido-hero__subtitle, .riv-hero__subtitle { font-size: 16px; }
}

/* Hero small (subpages) */
.riv-hero--small { min-height: 40vh; }
.riv-hero--small .riv-hero__title { font-size: 48px; }

/* ============================================================
   §7 — Split (ido-split, ido-split-reverse)
   ============================================================ */
.ido-split, .ido-split-reverse {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 80px 40px;
  max-width: 1280px;
  margin: 0 auto;
}

.ido-split-reverse .ido-split__media,
.ido-split-reverse .ido-split__content { order: 0; }
.ido-split-reverse .ido-split__media { order: 1; }

.ido-split__media img {
  width: 100%;
  height: auto;
  border-radius: var(--riv-radius-sm);
  box-shadow: var(--riv-shadow-card);
}

.ido-split__content h2 {
  margin: 0 0 24px;
  font-size: 36px;
}

.ido-split__content p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--riv-ink);
  margin: 0 0 16px;
}

.ido-split__cta {
  display: inline-block;
  margin-top: 16px;
}

@media (max-width: 767px) {
  .ido-split, .ido-split-reverse {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 48px 16px;
  }
  .ido-split-reverse .ido-split__media { order: 0; }
}
```

**Step 2: Continue to Task 1.4.**

### Task 1.4: Layer 3 — cards, features, testimonials, cta, faq, gallery, map

**Files:**
- Create: `clients/river-premium-apartments/_build/L3-04-components.css`

**Step 1: Write component theming CSS**

Create the file with full component styles. Pattern: theme bazowe `ido-*` z brand kolorami. Each component ~30-50 linii:
```css
/* §8 — Cards (ido-cards 2/3/4-col grid) */
.ido-cards { display: grid; gap: 24px; padding: 64px 40px; max-width: 1280px; margin: 0 auto; }
.ido-cards--2-col { grid-template-columns: repeat(2, 1fr); }
.ido-cards--3-col { grid-template-columns: repeat(3, 1fr); }
.ido-cards--4-col { grid-template-columns: repeat(4, 1fr); }

.ido-cards__item {
  background: var(--riv-bg);
  border: 1px solid var(--riv-line);
  border-radius: var(--riv-radius-md);
  overflow: hidden;
  transition: transform var(--riv-transition), box-shadow var(--riv-transition);
}
.ido-cards__item:hover { transform: translateY(-4px); box-shadow: var(--riv-shadow-card); }

.ido-cards__media { aspect-ratio: 16/10; overflow: hidden; }
.ido-cards__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.ido-cards__item:hover .ido-cards__media img { transform: scale(1.05); }

.ido-cards__body { padding: 24px; }
.ido-cards__title { font-size: 22px; margin: 0 0 12px; color: var(--riv-navy-dark); }
.ido-cards__desc { font-size: 14px; color: var(--riv-muted); line-height: 1.6; margin: 0 0 16px; -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
.ido-cards__cta { display: inline-block; padding: 10px 0; color: var(--riv-navy-dark); font-size: 14px; font-weight: 500; border-bottom: 1px solid var(--riv-beige); text-transform: uppercase; letter-spacing: 0.08em; }

@media (max-width: 767px) {
  .ido-cards--2-col, .ido-cards--3-col, .ido-cards--4-col { grid-template-columns: 1fr; }
  .ido-cards { padding: 48px 16px; }
}

/* §9 — Features (ido-features 3-6 ikon SVG inline) */
.ido-features { display: grid; gap: 32px; padding: 64px 40px; max-width: 1280px; margin: 0 auto; }
.ido-features--3-col { grid-template-columns: repeat(3, 1fr); }
.ido-features--6-col { grid-template-columns: repeat(6, 1fr); }

.ido-features__item { text-align: center; padding: 16px; }
.ido-features__icon { width: 48px; height: 48px; margin: 0 auto 16px; color: var(--riv-beige); }
.ido-features__icon svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 1.5; }
.ido-features__title { font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--riv-navy-dark); margin: 0; }

@media (max-width: 767px) {
  .ido-features--6-col { grid-template-columns: repeat(3, 1fr); }
  .ido-features--3-col { grid-template-columns: 1fr; }
}

/* §10 — Testimonials (ido-testimonials karuzela lub static grid) */
.ido-testimonials { padding: 80px 40px; max-width: 1280px; margin: 0 auto; background: rgba(151, 140, 113, 0.05); }
.ido-testimonials__title { text-align: center; margin: 0 0 48px; }
.ido-testimonials__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.ido-testimonials__item { background: var(--riv-bg); padding: 32px; border-radius: var(--riv-radius-md); border: 1px solid var(--riv-line); }
.ido-testimonials__rating { color: var(--riv-beige); margin-bottom: 12px; font-size: 18px; }
.ido-testimonials__quote { font-family: var(--riv-font-heading); font-size: 18px; line-height: 1.6; color: var(--riv-navy-dark); margin: 0 0 16px; font-style: italic; }
.ido-testimonials__author { font-size: 14px; color: var(--riv-muted); }
.ido-testimonials__source { font-size: 12px; color: var(--riv-beige); text-transform: uppercase; letter-spacing: 0.08em; }
@media (max-width: 767px) { .ido-testimonials__grid { grid-template-columns: 1fr; } }

/* §11 — CTA (ido-cta, ido-cta-dark) */
.ido-cta { padding: 80px 40px; text-align: center; max-width: 800px; margin: 0 auto; }
.ido-cta__title { font-size: 36px; margin: 0 0 16px; }
.ido-cta__subtitle { font-size: 16px; color: var(--riv-muted); margin: 0 0 32px; }
.ido-cta-dark { background: var(--riv-navy-dark); color: #FFFFFF; padding: 80px 40px; text-align: center; }
.ido-cta-dark .ido-cta__title { color: #FFFFFF; }
.ido-cta-dark .ido-cta__subtitle { color: rgba(255, 255, 255, 0.85); }
.ido-cta__btn, .btn-primary { display: inline-block; background: var(--riv-navy-dark); color: #FFFFFF !important; padding: 14px 36px; font-size: 14px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid var(--riv-navy-dark); transition: all var(--riv-transition); min-height: 44px; }
.ido-cta__btn:hover, .btn-primary:hover { background: var(--riv-navy); border-color: var(--riv-navy); }
.ido-cta-dark .ido-cta__btn { background: var(--riv-beige); color: var(--riv-navy-dark) !important; border-color: var(--riv-beige); }
.ido-cta-dark .ido-cta__btn:hover { background: var(--riv-gold); border-color: var(--riv-gold); color: #FFFFFF !important; }

/* §12 — FAQ (ido-faq accordion) */
.ido-faq { padding: 64px 40px; max-width: 800px; margin: 0 auto; }
.ido-faq__item { border-bottom: 1px solid var(--riv-line); }
.ido-faq__question { padding: 20px 0; font-family: var(--riv-font-heading); font-size: 18px; font-weight: 600; color: var(--riv-navy-dark); cursor: pointer; display: flex; justify-content: space-between; align-items: center; min-height: 44px; }
.ido-faq__answer { padding: 0 0 20px; font-size: 16px; line-height: 1.7; color: var(--riv-ink); display: none; }
.ido-faq__item.is-open .ido-faq__answer { display: block; }
.ido-faq__icon { transition: transform var(--riv-transition); }
.ido-faq__item.is-open .ido-faq__icon { transform: rotate(45deg); }

/* §13 — Gallery (ido-gallery masonry) */
.ido-gallery { padding: 64px 40px; max-width: 1280px; margin: 0 auto; }
.ido-gallery__filters { display: flex; gap: 12px; justify-content: center; margin-bottom: 40px; flex-wrap: wrap; }
.ido-gallery__filter { padding: 8px 16px; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid var(--riv-line); background: transparent; cursor: pointer; min-height: 44px; }
.ido-gallery__filter.is-active { background: var(--riv-navy-dark); color: #FFFFFF; border-color: var(--riv-navy-dark); }
.ido-gallery__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.ido-gallery__item { aspect-ratio: 4/3; overflow: hidden; cursor: pointer; }
.ido-gallery__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.ido-gallery__item:hover img { transform: scale(1.05); }
@media (max-width: 767px) { .ido-gallery__grid { grid-template-columns: 1fr; } }

/* §14 — Map */
.ido-map { padding: 64px 0; max-width: 1280px; margin: 0 auto; }
.ido-map iframe { width: 100%; height: 480px; border: 0; }
```

**Step 2: Continue to Task 1.5.**

### Task 1.5: Layer 3 — `riv-amenities` (custom 6-icon grid)

**Files:**
- Create: `clients/river-premium-apartments/_build/L3-05-riv-amenities.css`

**Step 1: Write custom amenities CSS**

Create the file:
```css
/* ============================================================
   §15 — RIV-AMENITIES (6 ikon SVG: Widok / Garaż / WiFi / Zwierzęta / Smart TV / Winda)
   ============================================================ */
.riv-amenities {
  padding: 48px 40px;
  max-width: 1280px;
  margin: 0 auto;
  border-top: 1px solid var(--riv-line);
  border-bottom: 1px solid var(--riv-line);
}
.riv-amenities__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}
.riv-amenities__item {
  text-align: center;
  padding: 8px;
}
.riv-amenities__icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  color: var(--riv-beige);
}
.riv-amenities__icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.riv-amenities__label {
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--riv-navy-dark);
  font-weight: 500;
  line-height: 1.4;
}

@media (max-width: 991px) {
  .riv-amenities__grid { grid-template-columns: repeat(3, 1fr); gap: 32px; }
}
@media (max-width: 480px) {
  .riv-amenities__grid { grid-template-columns: repeat(2, 1fr); }
}
```

**Step 2: Continue to Task 1.6.**

### Task 1.6: Layer 3 — `riv-offer-card` (featured offers MADERA pattern)

**Files:**
- Create: `clients/river-premium-apartments/_build/L3-06-riv-offer-card.css`

**Step 1: Write riv-offer-card CSS**

Create the file:
```css
/* ============================================================
   §16 — Featured Offers (MADERA pattern: hide system carousel, build custom cards)
   ============================================================ */

/* Hide system slick carousel completely */
.container-hotspot,
.cmshotspot { display: none !important; }

/* Grid for offers and apartments */
.riv-offers-grid,
.riv-apartments-grid {
  display: grid;
  gap: 24px;
  padding: 0 40px;
  max-width: 1280px;
  margin: 0 auto;
}
.riv-offers-grid { grid-template-columns: repeat(3, 1fr); }
.riv-apartments-grid { grid-template-columns: repeat(2, 1fr); }

@media (max-width: 991px) {
  .riv-offers-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 680px) {
  .riv-offers-grid,
  .riv-apartments-grid { grid-template-columns: 1fr; padding: 0 16px; }
}

/* Card */
.riv-offer-card {
  background: var(--riv-bg);
  border: 1px solid var(--riv-line);
  border-radius: var(--riv-radius-md);
  overflow: hidden;
  transition: transform var(--riv-transition), box-shadow var(--riv-transition);
  display: flex;
  flex-direction: column;
}
.riv-offer-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--riv-shadow-card);
}

.riv-offer-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  display: block;
}
.riv-offer-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.riv-offer-card:hover .riv-offer-card__img { transform: scale(1.05); }

.riv-offer-card__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--riv-navy-dark);
  color: #FFFFFF;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 2px;
  z-index: 2;
}

.riv-offer-card__body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.riv-offer-card__name {
  font-family: var(--riv-font-heading);
  font-size: 22px;
  font-weight: 600;
  color: var(--riv-navy-dark);
  margin: 0 0 8px;
  line-height: 1.3;
}

.riv-offer-card__desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--riv-muted);
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.riv-offer-card__meta {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--riv-navy);
}
.riv-offer-card__meta li {
  display: flex;
  align-items: center;
  gap: 6px;
}
.riv-offer-card__meta svg {
  width: 16px;
  height: 16px;
  stroke: var(--riv-beige);
  fill: none;
  stroke-width: 1.5;
}

.riv-offer-card__cta {
  margin-top: auto;
  display: inline-block;
  padding: 10px 0;
  color: var(--riv-navy-dark);
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid var(--riv-beige);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  align-self: flex-start;
  min-height: 44px;
}
.riv-offer-card__cta:hover { color: var(--riv-beige); }

/* §17 — Client-added rules placeholder (DO NOT MODIFY ABOVE THIS LINE) */
/* === §RIV-CLIENT === */
/* Klient może tu dopisać własne reguły. JARVIS update zostawia tę sekcję as-is. */
/* === END §RIV-CLIENT === */
```

**Step 2: Continue to Task 1.7.**

### Task 1.7: Merge L1 + L2 + L3 into ARKUSZ_STYLOW.css

**Files:**
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/ARKUSZ_STYLOW.css`
- Read: `library/css/layer1-traps.css`, `library/css/layer2-components.css`

**Step 1: Concatenate L1 + L2 + L3 files**

```bash
cd /Users/user/Desktop/jarvis/.claude/worktrees/sad-almeida-23de31

# Verify L1 and L2 exist
ls -la library/css/

# Concatenate with section markers
cat library/css/layer1-traps.css \
    library/css/layer2-components.css \
    clients/river-premium-apartments/_build/L3-01-base.css \
    clients/river-premium-apartments/_build/L3-02-header-footer.css \
    clients/river-premium-apartments/_build/L3-03-hero-split.css \
    clients/river-premium-apartments/_build/L3-04-components.css \
    clients/river-premium-apartments/_build/L3-05-riv-amenities.css \
    clients/river-premium-apartments/_build/L3-06-riv-offer-card.css \
    > clients/river-premium-apartments/DO_WKLEJENIA/ARKUSZ_STYLOW.css

# Verify line count (~3300 expected)
wc -l clients/river-premium-apartments/DO_WKLEJENIA/ARKUSZ_STYLOW.css
```

**Step 2: Verify** — Open in Read and confirm structure: L1 traps → L2 components → §1-17 from L3.

**Step 3: Commit L3 build + ARKUSZ_STYLOW**

```bash
git add clients/river-premium-apartments/_build/ clients/river-premium-apartments/DO_WKLEJENIA/ARKUSZ_STYLOW.css
git commit -m "RPA: Layer 3 theme CSS + ARKUSZ_STYLOW.css merge (L1+L2+L3, ~3300 lines)"
```

### Task 1.8: HOMEPAGE_PL — head + body_top

**Files:**
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_PL__head.html`
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_PL__body_top.html`

**Step 1: Write HEAD with meta + Google Fonts + JsonLD**

Create `HOMEPAGE_PL__head.html`:
```html
<meta name="description" content="River Premium Apartments — apartamenty premium w centrum Wrocławia, z widokiem na Odrę. Garaż, WiFi, Smart TV, dla par i rodzin. Zarezerwuj online.">
<meta property="og:type" content="website">
<meta property="og:title" content="River Premium Apartments — Apartamenty Wrocław">
<meta property="og:description" content="Apartamenty premium w sercu Wrocławia, ul. Księcia Witolda 52. Widok na Odrę, garaż, WiFi, Smart TV.">
<meta property="og:image" content="https://wa-uploads.profitroom.com/riverpremiumapartments/1920x1080/17235494363263_7162b41e-eb6c-4152-bbb1-438e5cb64c59.jpg">
<meta property="og:locale" content="pl_PL">
<meta name="twitter:card" content="summary_large_image">

<link rel="alternate" hreflang="pl" href="https://riverpremiumapartments.pl/">
<link rel="alternate" hreflang="en" href="https://riverpremiumapartments.pl/en/">
<link rel="alternate" hreflang="x-default" href="https://riverpremiumapartments.pl/">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "River Premium Apartments",
  "description": "Apartamenty premium w centrum Wrocławia z widokiem na Odrę.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Księcia Witolda 52",
    "postalCode": "50-203",
    "addressLocality": "Wrocław",
    "addressCountry": "PL"
  },
  "telephone": "+48-785-818-330",
  "email": "rezerwacje@riverpremiumapartments.pl",
  "url": "https://riverpremiumapartments.pl/",
  "image": "https://wa-uploads.profitroom.com/riverpremiumapartments/1920x1080/17235494363263_7162b41e-eb6c-4152-bbb1-438e5cb64c59.jpg"
}
</script>
```

**Step 2: Write body_top with 8 sekcji**

Create `HOMEPAGE_PL__body_top.html` — pełne sekcje hero → intro → amenities → oferty → about → testimonials → apartamenty → cta-dark. Wzorować się na `clients/madera/DO_WKLEJENIA/HOMEPAGE_PL__body_top.html` (struktura) i recon source data (treści, zdjęcia).

Kluczowe punkty:
- Hero: `<section class="riv-hero" data-component-id="riv-hero">` z img src z recon (1920x1080 Profitroom hero)
- Intro: `<section class="ido-split-reverse">` z H2 "River Premium Apartments" + treść (scrape ze źródła + dopracowanie)
- Amenities: `<section class="riv-amenities">` z 6 items × `<svg>` icon inline + label
- Oferty pobytu: `<section class="ido-cards ido-cards--3-col riv-offers-grid riv-featured-fallback">` z 3 hardcoded fallback cards
- About sticky: `<section class="ido-split">`
- Testimonials: `<section class="ido-testimonials">` z 3 opinii (placeholder)
- Apartamenty: `<section class="ido-cards riv-apartments-grid riv-featured-fallback">` z 4 fallback cards A-D
- CTA-dark: `<section class="ido-cta-dark">` z REZERWUJ

**Step 3: Verify HTML validity**

```bash
# Quick syntax check (no tags unclosed)
grep -c "<section" clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_PL__body_top.html
grep -c "</section>" clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_PL__body_top.html
# Should be equal
```

**Step 4: Continue to Task 1.9.**

### Task 1.9: HOMEPAGE — body_bottom (shared PL+EN, fullpage + hero teleport + featured offers reader + lightbox)

**Files:**
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE__body_bottom.html`

**Step 1: Write body_bottom JS**

Create the file with:
```html
<script>
(function() {
  'use strict';

  /* === 1. fullpage.js detection — header transparent on section 1 === */
  function setupFullpageHeader() {
    var body = document.body;
    var headerWrapper = document.querySelector('.menu-wrapper') || document.querySelector('header');
    if (!headerWrapper) return;
    
    function updateHeader() {
      var match = body.className.match(/fp-viewing-(\d+)/);
      var section = match ? parseInt(match[1], 10) : -1;
      if (section === 0 || section === 1) {
        document.documentElement.classList.add('riv-header--transparent');
      } else {
        document.documentElement.classList.remove('riv-header--transparent');
      }
    }
    
    var observer = new MutationObserver(updateHeader);
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
    updateHeader();
  }

  /* === 2. Hero teleport — body_top hero into .section.parallax .fp-tableCell === */
  function teleportHero() {
    var hero = document.querySelector('.riv-hero');
    var target = document.querySelector('.section.parallax .fp-tableCell') 
              || document.querySelector('.fp-section .fp-tableCell');
    if (hero && target && !target.contains(hero)) {
      target.appendChild(hero);
    }
  }

  /* === 3. Featured offers reader (MADERA pattern) === */
  function buildRivCards(gridSelector, fallbackHide) {
    var hotspot = document.querySelector('.container-hotspot, .cmshotspot');
    var grid = document.querySelector(gridSelector);
    if (!hotspot || !grid) return;

    var slides = hotspot.querySelectorAll('.slick-slide:not(.slick-cloned) .offer, .offer');
    var cards = [];
    var seen = {};

    Array.prototype.forEach.call(slides, function(offer) {
      var hrefEl = offer.querySelector('a.object-icon, a[href*="oferta"]');
      if (!hrefEl) return;
      var href = hrefEl.href;
      if (seen[href]) return;
      seen[href] = true;

      var imgEl = offer.querySelector('img[data-src], img[src]:not([src*="img-blank"])');
      var img = imgEl ? (imgEl.dataset.src || imgEl.src) : '';
      var title = (offer.querySelector('h3 a, h3') || {}).textContent;
      var desc = (offer.querySelector('.offer__description') || {}).textContent;
      var areaMatch = ((offer.querySelector('.accommodation-meters') || {}).textContent || '').match(/([\d,.]+)\s*m/i);
      var guestsMatch = ((offer.querySelector('.accommodation-roomspace') || {}).textContent || '').match(/(\d+)/);
      var priceMatch = ((offer.querySelector('.offer__price .price') || {}).textContent || '').match(/([\d,.]+)/);

      cards.push({
        href: href,
        img: img,
        title: (title || '').trim(),
        desc: (desc || '').trim(),
        area: areaMatch ? areaMatch[1] : '',
        guests: guestsMatch ? guestsMatch[1] : '',
        price: priceMatch ? priceMatch[1] : ''
      });
    });

    if (!cards.length) return;

    grid.innerHTML = cards.map(function(c) {
      return '<article class="riv-offer-card">' +
        '<a href="' + c.href + '" class="riv-offer-card__media">' +
          '<img src="' + c.img + '" alt="' + c.title + '" loading="lazy" class="riv-offer-card__img"/>' +
          (c.price ? '<span class="riv-offer-card__badge">od ' + c.price + ' zł/noc</span>' : '') +
        '</a>' +
        '<div class="riv-offer-card__body">' +
          '<h3 class="riv-offer-card__name">' + c.title + '</h3>' +
          (c.desc ? '<p class="riv-offer-card__desc">' + c.desc + '</p>' : '') +
          '<ul class="riv-offer-card__meta">' +
            (c.area ? '<li><svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/></svg> ' + c.area + ' m²</li>' : '') +
            (c.guests ? '<li><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg> ' + c.guests + ' os.</li>' : '') +
          '</ul>' +
          '<a href="' + c.href + '" class="riv-offer-card__cta">Sprawdź</a>' +
        '</div>' +
      '</article>';
    }).join('');
    grid.classList.remove('riv-featured-fallback');
  }

  /* === 4. Init === */
  function init() {
    setupFullpageHeader();
    teleportHero();
    buildRivCards('.riv-apartments-grid');
    buildRivCards('.riv-offers-grid');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
```

**Step 2: Verify size** — body_bottom should be <60KB per memory rule (`feedback_idobooking_body_bottom_size_limit`).

```bash
wc -c clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE__body_bottom.html
# Expected: <10KB (this is minimal, plenty of room)
```

**Step 3: Commit Phase 1**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_PL__head.html \
        clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_PL__body_top.html \
        clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE__body_bottom.html
git commit -m "RPA: HOMEPAGE_PL (head + body_top 8 sections) + body_bottom (fullpage, hero teleport, featured offers reader)"
```

---

## Phase 2 — HOME EN + POKOJE + GALERIA (Day 2, ~6h)

### Task 2.1: HOMEPAGE_EN — head + body_top

**Files:**
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_EN__head.html`
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_EN__body_top.html`

**Step 1: Translate HEAD to EN** — copy HOMEPAGE_PL__head.html, change `lang=pl_PL → en_US`, translate description/og.

**Step 2: Translate body_top** — copy HOMEPAGE_PL__body_top.html, translate ALL text (h1/h2/h3/p/buttons). Keep structure identical.

Tłumaczenia kluczowe:
- "Wyjątkowe apartamenty" → "Exceptional apartments"
- "Apartamenty" → "Apartments"
- "Oferty pobytu" → "Stay offers"
- "Opinie zadowolonych Gości" → "Reviews from satisfied guests"
- "REZERWUJ" → "BOOK NOW"
- "ZOBACZ WIĘCEJ" → "SEE MORE"

**Step 3: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/HOMEPAGE_EN__*.html
git commit -m "RPA: HOMEPAGE_EN translation"
```

### Task 2.2: POKOJE (Apartamenty) PL + EN

**Files:**
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/POKOJE_PL__head.html`
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/POKOJE_PL__body_top.html`
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/POKOJE_EN__head.html`
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/POKOJE_EN__body_top.html`
- Create: `clients/river-premium-apartments/DO_WKLEJENIA/POKOJE__body_bottom.html`

**Step 1: head** — title "Apartamenty | River Premium Apartments", description "Cztery apartamenty A/B/C/D 35-55 m², 2-4 osoby, w centrum Wrocławia".

**Step 2: body_top struktura**:
- `<section class="riv-hero riv-hero--small">` (40vh, banner)
- `<section class="ido-split-reverse">` (intro + amenities icons)
- `<section class="ido-cards ido-cards--2-col riv-apartments-grid riv-featured-fallback">` (4 karty A/B/C/D)
- `<section class="ido-split">` (sticky "Co wyróżnia nasze apartamenty")
- `<section class="ido-cta">` (CTA "Masz pytania?")

**Step 3: body_bottom** — same featured offers reader as HOMEPAGE (no fullpage on subpage, no teleport).

**Step 4: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/POKOJE_*
git commit -m "RPA: POKOJE (Apartamenty) PL + EN — 4 apartment cards with featured offers fallback"
```

### Task 2.3: GALERIA PL + EN

**Files:**
- 5 plików: GALERIA_PL__head, GALERIA_PL__body_top, GALERIA_EN__head, GALERIA_EN__body_top, GALERIA__body_bottom

**Step 1: head** — title "Galeria | River Premium Apartments".

**Step 2: body_top**:
- Hero-small "Galeria"
- Filtry kategorii (Apartamenty/Wnętrza/Restauracja/Otoczenie)
- Grid masonry — placeholdery na ~24 zdjęcia (klient dostarczy)
- CTA REZERWUJ

**Step 3: body_bottom**:
- Filter toggle JS (klik filter → hide/show items by data-category)
- Lightbox init (z ido-base.js)

**Step 4: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/GALERIA_*
git commit -m "RPA: GALERIA PL + EN (masonry grid, category filters, lightbox)"
```

---

## Phase 3 — OFERTY + ATRAKCJE + KONTAKT (Day 3, ~6h)

### Task 3.1: OFERTY PL + EN

**Step 1-3**: 3 sekcje główne (hero-small, 3 karty cenowe full, FAQ), body_bottom = featured offers reader (gdyby panel skonfigurowany).

**Step 4: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/OFERTY_*
git commit -m "RPA: OFERTY I PROMOCJE PL + EN (3 price tiers + FAQ)"
```

### Task 3.2: ATRAKCJE PL + EN

**Step 1-3**: Hero-small + mapa + 6-9 kart atrakcji (Rynek, Ostrów Tumski, ZOO, Hala Stulecia, Park Szczytnicki, Most Tumski) + split komunikacja.

**Zdjęcia atrakcji**: Unsplash search (verified URLs, curl -sI 200), nie Wikimedia.

**Step 4: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/ATRAKCJE_*
git commit -m "RPA: ATRAKCJE PL + EN (6 attractions with Unsplash images, map)"
```

### Task 3.3: KONTAKT PL + EN + Schema.org

**Step 1-3**: Hero-small + dane kontaktowe + mapa Google embedded + formularz + JsonLD `LocalBusiness` z geo coords.

Google Maps embed:
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503...!2sul.+Ksi%C4%99cia+Witolda+52,+50-203+Wroc%C5%82aw" 
        loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

**Step 4: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/KONTAKT_*
git commit -m "RPA: KONTAKT PL + EN (Google Maps embed, LocalBusiness JsonLD)"
```

---

## Phase 4 — RESTAURACJA + polish (Day 4, ~5h)

### Task 4.1: RESTAURACJA PL + EN (z placeholderami na treści klienta)

**Step 1**: Pełna 7-sekcyjna strona (hero + koncept + karta dań + godziny + rezerwacja CTA + galeria + FAQ).

**Step 2**: PLACEHOLDER markers w HTML (komentarze `<!-- TODO-RPA: client to provide menu PDF -->` itd.) — Damian wie co podmienić gdy klient dostarczy.

**Step 3: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/RESTAURACJA_*
git commit -m "RPA: RESTAURACJA PL + EN (full structure with placeholders for client content)"
```

### Task 4.2: A11y polish + final pass

**Step 1**: Audytuj wszystkie 14 body_top na:
- `alt=""` (must have sensowne lub `alt="" role="presentation"` dla dekoracyjnych)
- Heading hierarchy (jedna H1, sekcje H2, karty H3, bez przeskoków)
- ARIA labels na buttonach-ikonach (np. social media, language switch, mobile menu)
- `lang="pl"` lub `lang="en"` na `<html>` (system ustawia, ale weryfikuję)
- Focus states widoczne (CSS already has, verify)

**Step 2**: Audyt kontrastu — sprawdź w designtools że beige `#978C71` na navy `#051B3D` daje 4.5:1+ (powinno być OK), beige na white = 3.2:1 (NIE używać dla tekstu na białym, tylko dla bordów/decorative).

**Step 3: Commit**

```bash
git add clients/river-premium-apartments/DO_WKLEJENIA/
git commit -m "RPA: a11y polish (alt, heading hierarchy, ARIA, focus states)"
```

---

## Phase 5 — Review + Delivery (Day 5, ~4h)

### Task 5.1: UX validator (jeśli istnieje)

**Step 1**: 

```bash
# Check if validator exists
ls library/qa/ 2>/dev/null
# If exists:
node library/qa/ux-validator.js clients/river-premium-apartments/DO_WKLEJENIA 2>/dev/null || echo "Validator not built yet — manual review"
```

**Step 2**: Jeśli walidator istnieje i critical > 0, napraw przed kontynuacją.

### Task 5.2: Lighthouse audit 7 stron × 2 (mobile + desktop)

**Note**: Wymaga uruchomionego dev preview LUB wgranego na test domenę. Damian uruchamia, Claude audytuje przez chrome-devtools MCP.

**Step 1**: Dla każdej strony × każdego viewport:
- Performance ≥ 85
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO ≥ 95

**Step 2**: Spisać wyniki w `clients/river-premium-apartments/_recon/lighthouse-v1.0.md`.

### Task 5.3: Chrome-devtools live audit — wszystkie strony × mobile + desktop

**Step 1**: Dla każdej strony × każdego viewport:
- `getComputedStyle(document.documentElement).fontSize` → "10px" (default13)
- Header transparent stan na home section 1
- Mobile menu działa < 991px
- Featured offers fallback widoczny gdy brak danych w panelu
- Google Maps embed renderuje
- Console: 0 errors
- Network: 0 failed requests

**Step 2**: Screenshots każdej strony × każdego viewport → `_recon/screenshots/v1.0-*/`.

### Task 5.4: Fixes per audit findings

Iterate jak są problemy.

### Task 5.5: Write RELEASE_NOTES_v1.0.md

**Files:**
- Create: `clients/river-premium-apartments/RELEASE_NOTES_v1.0.md`

**Step 1**: Wzorować się na `clients/MountainPrestige/RELEASE_NOTES_v1.14.md`:
- Co dostarczono (lista plików)
- Trapy zaadresowane (z numerami known-fixes / instincts)
- Golden path test (klient powinien sprawdzić: home → /pokoje → klik karty → /oferta → form rezerwacji)
- Known limitations (logo placeholder do podmiany, treści restauracji TBD, EN proofreading)
- Co klient powinien sprawdzić po wklejeniu (lista 8-10 punktów)

**Step 2: Commit**

```bash
git add clients/river-premium-apartments/RELEASE_NOTES_v1.0.md
git commit -m "RPA: RELEASE_NOTES_v1.0 — delivery summary, traps addressed, golden path"
```

### Task 5.6: Memory update

**Files:**
- Modify: `memory/clients_data/river-premium-apartments.json`
- Modify: `memory/MEMORY.md` (add entry if pattern emerged)

**Step 1**: Update client metadata:
```json
{
  "status": "delivered_v1.0",
  "delivery_date": "2026-05-19",
  "version": "1.0",
  "lighthouse_scores": { "performance": 88, "accessibility": 96, "seo": 100, ... },
  "files_delivered": 30,
  "css_lines": 3300,
  "js_lines": 800
}
```

**Step 2**: Jeśli nowy pattern emerged (np. Profitroom→IdoBooking migration), dopisz instinct:
- Create: `memory/instincts/{NN}-profitroom-migration-pattern.md`
- Update: `memory/INDEX.md` (jeśli istnieje)

**Step 3: Commit**

```bash
git add memory/
git commit -m "RPA: update memory/clients_data + add Profitroom→IdoBooking migration instinct (if applicable)"
```

### Task 5.7: Final tag + PR readiness

**Step 1**:

```bash
git log --oneline | head -20    # przegląd commitów
git tag rpa-v1.0
```

**Step 2: Open PR** (jeśli wymagane przez team workflow):

```bash
gh pr create --title "River Premium Apartments v1.0 — IdoBooking migration" --body "$(cat <<'EOF'
## Summary
- Migracja riverpremiumapartments.pl z Profitroom na IdoBooking template default13
- 7 stron × 2 języki (PL/EN) = 30 plików dostawy w `clients/river-premium-apartments/DO_WKLEJENIA/`
- Wzorzec featured offers MADERA + custom riv-amenities/riv-offer-card
- Trapy default13 udokumentowane i zaadresowane

## Test plan
- [ ] Lighthouse 7×2 viewport mobile + desktop (≥85/95/90/95)
- [ ] Chrome-devtools live audit po wklejeniu w panel test klienta
- [ ] Golden path: home → /pokoje → klik karty → /oferta → form rezerwacji
- [ ] WCAG AA contrast verify
- [ ] Logo placeholder → podmiana po dostarczeniu SVG przez klienta
- [ ] Treści Restauracji TODO → podmiana po dostarczeniu menu/zdjęć

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Klient nie dostarczy logo SVG na czas | Wysoka | Text-logo Bodoni Moda jako placeholder, podmiana later w v1.1 |
| Treści Restauracji opóźnione | Wysoka | Pełna struktura z TODO markers, klient/Damian podmienia bezpośrednio w panelu |
| EN tłumaczenie niskiej jakości | Średnia | Damian audyt + ew. native speaker review v1.0.1 |
| IdoBooking ofert A-D nadal puste przy delivery | Wysoka | Fallback static cards działają, JS reader przejmie automatycznie po wprowadzeniu |
| fullpage.js zmieni się w nowym default13 | Niska | MutationObserver na class wzorzec stabilny; instinct 003 dokumentuje |
| Lighthouse performance < 85 z powodu Google Maps embed | Średnia | `loading="lazy"` na iframe; ew. zamiana na placeholder image + onclick |
| WAF odrzuci paste body_top z powodu znaków | Niska | Memory `feedback_no_emoji_client_code` — zero emoji/comments; verify każdy plik |

## Definition of Done

- [ ] Wszystkie 30 plików w `DO_WKLEJENIA/` zatwierdzone i scommitowane
- [ ] Lighthouse 7×2 viewport spełnia targety
- [ ] Chrome-devtools live audit zielony na test domenie
- [ ] WCAG AA contrast verified (axe DevTools 0 violations)
- [ ] `RELEASE_NOTES_v1.0.md` napisany i przeglądnięty
- [ ] `memory/clients_data/river-premium-apartments.json` zaktualizowany
- [ ] PR otwarty (jeśli workflow tego wymaga)
- [ ] Damian rozsyła Andrzejowi Kowalskiemu paczkę + instrukcję uruchomienia

---

**Plan complete. 30 plików, 5 commitów per faza, 17 atomic tasks rozłożonych na 5 dni.**
