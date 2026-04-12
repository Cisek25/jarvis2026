# Template System Audit — cms_pages/
**Date:** 2026-03-13
**Auditor:** template-dev
**Scope:** `/Users/user/Desktop/Claude_STRONY/cms_pages/`

---

## 1. File Inventory

| File | Purpose | Languages |
|------|---------|-----------|
| `00_CUSTOM_CSS_v2.css` | Master stylesheet | — |
| `01_STRONA_GLOWNA_*.html` | Homepage | PL, EN, DE, ES |
| `02_APARTAMENTY_*.html` | Apartment listing | PL, EN, DE, ES |
| `03_EAGLE_NEST_*.html` | Apartment detail: Eagle Nest | PL, EN, DE, ES |
| `04_EAGLE_VIEW_*.html` | Apartment detail: Eagle View | PL, EN, DE, ES |
| `05_EAGLE_TOWER_*.html` | Building amenities | PL, EN, DE, ES |
| `06_LOKALIZACJA_*.html` | Location page | PL, EN, DE, ES |
| `07_ATRAKCJE_*.html` | Nearby attractions | PL, EN, DE, ES |
| `08_GALERIA_*.html` | Gallery index (album links) | PL, EN, DE, ES |
| `09_GALERIA_ZDJECIA_*.html` | Photo grid with lightbox | PL, EN, DE, ES |
| `INSTRUKCJA_WKLEJANIA.md` | Paste instructions for CMS | PL |

**Total:** 37 HTML files + 1 CSS + 1 MD = **39 files**

---

## 2. CSS Architecture (`00_CUSTOM_CSS_v2.css`)

### 2.1 Structure Overview

The CSS is organized into clearly labeled sections (708 lines total):

| Section | Lines | Purpose |
|---------|-------|---------|
| System hides | 1–10 | Hide phone/footer elements injected by IdoSell |
| CMS `h1.big-label` suppression | 12–30 | Removes CMS page title and white gap |
| Container escape (`.et-full`) | 32–53 | Full-width sections breaking out of 1170px container |
| Base typography | 55–63 | `.txt-text` font size/color |
| Sections | 65–93 | `.et-section`, modifiers, `.et-inner` |
| Headings | 95–152 | `.et-label`, `.et-h2`, `.et-h3`, `.et-lead`, `.et-rule` |
| Layout grids | 154–182 | `.et-split` (2-col, 3-col, 4-col) |
| Hero | 184–224 | `.et-hero` and sub-elements |
| Apartment cards | 226–299 | `.et-apt`, `.et-apt__item`, specs |
| Feature list | 301–333 | `.et-features` with em-dash pseudo-element |
| Amenities grid | 335–398 | `.et-amenities`, `.et-amenity` (3-col, border-divided) |
| Specs bar | 400–438 | `.et-specs` (5-col stat bar) |
| Places/locations | 440–478 | `.et-places`, `.et-place` (name, desc, distance) |
| CTA button | 480–522 | `.et-btn`, `.et-btn--ghost`, dark variant |
| Gallery (albums) | 524–570 | `.et-albums`, `.et-album` |
| CTA bar | 572–619 | `.et-cta-bar` (footer bar with button) |
| Intro text | 621–631 | `.et-intro` (large lead paragraph) |
| Photo grid | 633–707 | `.et-photos`, `.et-photo`, overlay/lightbox hover |

### 2.2 Design Tokens (Hardcoded, No CSS Variables)

The design uses consistent values throughout, but they are **hardcoded** — not defined as CSS custom properties:

| Token | Value | Used in |
|-------|-------|---------|
| Brand blue | `#00579E` | Buttons, icons, labels, hero bg, CTA bar |
| Blue hover | `#1D4ED8` | `.et-btn:hover` |
| Muted bg | `#EBF4FB` | `.et-section--muted`, album hover |
| Dark bg | `#00579E` | `.et-section--dark` (same as brand blue) |
| Max width | `1170px` | `.et-inner`, `.et-hero__inner`, `.et-cta-bar__inner` |
| Section padding | `80px 0` | `.et-section` (desktop) |
| Mobile padding | `56px 0` | `.et-section` + `.et-cta-bar` (<=768px) |
| Inner padding | `0 40px` | `.et-inner` (desktop), `0 24px` (mobile) |

**Issue:** No CSS custom properties (`--var`) are used. Changing brand color requires editing ~15+ places.

### 2.3 Responsive Breakpoints

| Breakpoint | Trigger | Affected Elements |
|------------|---------|-------------------|
| `1200px` | Container escape calc changes | `.et-full` margin/width recalculation |
| `900px` | Grid collapse | `.et-split`, `.et-split--3`, `.et-split--4` → 1 column |
| `860px` | Grid collapse | `.et-apt`, `.et-amenities`, `.et-places` → 1 column |
| `768px` | Padding reduction | `.et-inner`, `.et-section`, `.et-specs` (2-col), `.et-cta-bar__inner` → column |
| `680px` | Grid collapse | `.et-albums` → 1 column |
| `480px` | Grid collapse | `.et-photos` → 1 column |

**Issue:** Breakpoints are inconsistent — 6 different values across 4 distinct ranges (900, 860, 768, 680, 480). The 900px and 860px are very close together and could be unified.

### 2.4 CMS Container Escape Technique

The key IdoSell/IdoBooking escape mechanism:

```css
/* Inside .container (max 1170px + 15px padding per side) */
.txt-text .et-full {
    margin-left:  -15px;
    margin-right: -15px;
    width: calc(100% + 30px);
}

/* At >=1200px: viewport-based full-width */
@media (min-width: 1200px) {
    .txt-text .et-full {
        margin-left:  calc(-50vw + 585px);
        margin-right: calc(-50vw + 585px);
        width: 100vw;
    }
}
```

This is the correct approach for IdoSell CMS where `.txt-text` sits inside Bootstrap `.container`. The technique is sound and well-documented.

**Additional CMS overrides:**
- `h1.big-label { display: none !important }` — hides injected page title
- `#pageContent .container { padding-top: 0 !important }` — removes 50px white gap
- `#pageContent .mb-5 { margin-bottom: 0 !important }` — removes Bootstrap margin
- 3 system-level element hides (phone, footer links, addons first-child)

---

## 3. HTML Structure and Class Naming

### 3.1 `et-*` Class Naming Convention

The prefix `et-` stands for "Eagle Tower" (the client). All classes follow **BEM-inspired naming** with the custom prefix:

**Block classes:**
- `.et-section` — section container
- `.et-inner` — max-width centered content wrapper
- `.et-split` — 2-column grid
- `.et-hero` — page hero banner
- `.et-apt` — apartment card grid
- `.et-features` — bullet feature list
- `.et-amenities` — amenity grid (border-divided)
- `.et-specs` — stat bar
- `.et-places` — location list
- `.et-albums` — gallery album grid
- `.et-photos` — photo grid
- `.et-btn` — call-to-action button
- `.et-cta-bar` — footer CTA strip

**Modifier classes (BEM `--` pattern):**
- `.et-section--dark` — dark blue background
- `.et-section--muted` — light blue background
- `.et-split--3` — 3-column split
- `.et-split--4` — 4-column split
- `.et-btn--ghost` — outlined button variant

**Element classes (BEM `__` pattern):**
- `.et-hero__inner`, `.et-hero__kicker`, `.et-hero__title`, `.et-hero__desc`
- `.et-apt__item`, `.et-apt__num`, `.et-apt__name`, `.et-apt__floor`, `.et-apt__desc`, `.et-apt__specs`, `.et-apt__spec`
- `.et-amenity__icon`, `.et-amenity__title`, `.et-amenity__text`
- `.et-spec__val`, `.et-spec__label`
- `.et-place__name`, `.et-place__desc`, `.et-place__dist`
- `.et-album__num`, `.et-album__title`, `.et-album__desc`
- `.et-photo__overlay`
- `.et-cta-bar__inner`, `.et-cta-bar__text`

**Typography utilities:**
- `.et-label` — uppercase eyebrow text
- `.et-h2`, `.et-h3` — heading classes
- `.et-lead` — lead paragraph
- `.et-intro` — large intro text
- `.et-rule` — decorative `<hr>` line

### 3.2 Standard Page Structure

Every sub-page follows this pattern:

```html
<!-- 1. HERO (all sub-pages) -->
<div class="et-full">
  <div class="et-hero">
    <div class="et-hero__inner">
      <span class="et-hero__kicker">...</span>
      <h1 class="et-hero__title">...</h1>
      <p class="et-hero__desc">...</p>
    </div>
  </div>
</div>

<!-- 2–N. CONTENT SECTIONS (varied per page) -->
<div class="et-full">
  <div class="et-section [et-section--dark|et-section--muted]">
    <div class="et-inner">
      <span class="et-label">...</span>
      <h2 class="et-h2">...</h2>
      <hr class="et-rule">
      <!-- content -->
    </div>
  </div>
</div>

<!-- LAST. CTA BAR (all sub-pages) -->
<div class="et-full">
  <div class="et-cta-bar">
    <div class="et-cta-bar__inner">
      <div class="et-cta-bar__text">...</div>
      <div>...</div>
    </div>
  </div>
</div>
```

**Homepage** (`01_STRONA_GLOWNA`) does not use `.et-hero` — opens directly with `.et-section` containing `.et-split` intro.

### 3.3 Inline Styles (Technical Debt)

Several places use `style=""` attributes instead of dedicated CSS classes:

| Location | Inline Style | Issue |
|----------|-------------|-------|
| `.et-apt` (homepage) | `style="border-top:1px solid #e0e0de;margin-top:32px;"` | Should be a class |
| `.et-amenities` in section 5 of Eagle Tower | `style="grid-template-columns: repeat(2, 1fr);"` | Should be `.et-amenities--2` |
| `.et-section` (gallery intro) | `style="padding-top:48px; padding-bottom:48px;"` | Should be `.et-section--compact` or similar |
| `.et-section` (address box) | `style="padding-top:40px; padding-bottom:40px;"` | Same as above |
| Multiple `.et-btn` | `style="margin-right:12px;"` | Should be layout wrapper or button group class |
| `.et-features` list | `style="margin-top:32px;"` or `style="margin-top:0;"` | Contextual overrides |
| `.et-cta-bar__inner` child div | `style="flex-shrink:0;display:flex;gap:12px;flex-wrap:wrap;"` | Should be `.et-cta-bar__actions` class |
| `.et-split` (photo page) | `style="margin-bottom: 48px;"` | Should be a spacing modifier |

**Count:** Approximately 12–15 inline style instances across PL versions alone (multiply by 4 languages = 48–60 total across all files).

### 3.4 Icon System

SVG icons are used inline throughout. All icons are Feather Icons (stroke-based, 24×24 viewBox, `stroke-width="1.5"`). Icons in the CSS have standardized dimensions:

```css
.et-amenity__icon svg {
    width: 22px; height: 22px;
    stroke: currentColor; fill: none;
    stroke-width: 1.5;
    stroke-linecap: round; stroke-linejoin: round;
}
```

**Issue in `03_EAGLE_NEST_v2.html`:** Some SVG icons in the "Sypialnie" section are missing the `width`, `height`, `fill`, `stroke`, and stroke attributes set inline — they rely on inherited CSS. This works when nested in `.et-amenity__icon`, but is fragile. Compare:

```html
<!-- Good (explicit attributes): -->
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ...>

<!-- Fragile (relies on CSS inheritance only): -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
```

Pages 03 and 05 (Eagle Nest and Eagle Tower PL) use fragile SVG format in some sections. All other pages use explicit attributes.

---

## 4. Multi-Language Consistency

### 4.1 Structure Parity

All 4 language versions of each page maintain **identical HTML structure** — only text content changes. This is the correct approach and is consistent across all 9 pages × 4 languages.

### 4.2 Link Consistency Issues

Language versions have mixed handling of internal links. PL comment headers were left in DE/ES files:

| File | Issue |
|------|-------|
| `01_STRONA_GLOWNA_DE.html` | Comment at top: `<!-- GERMAN VERSION -->` but section comments remain in Polish (`<!-- APARTAMENTY — mini preview -->`, `<!-- EAGLE TOWER — budynek -->`) |
| `01_STRONA_GLOWNA_ES.html` | Comments are translated for some sections but not others |
| `06_LOKALIZACJA_*.html` | All language versions use `/txt/202/Atrakcje-w-okolicy` — the URL slug is Polish in all versions (no language-specific URL) |

**Link that is NOT localized in EN/DE/ES versions:**
- `href="/txt/200/Eagle-Tower-Udogodnienia"` — Polish slug embedded in all 4 language versions

This is a known CMS constraint (IdoSell uses the same URL for all languages of a page), but worth documenting.

### 4.3 HTML Entity Handling

All language versions correctly escape `&` as `&amp;` in anchor text and list items (e.g., `H&amp;M`, `Ansehen &amp; buchen`, `Pool &amp; jacuzzi`). Consistent and correct.

### 4.4 Missing Page: `02_APARTAMENTY`

The instruction file references `02_APARTAMENTY.html` but the actual files are `02_APARTAMENTY_v2.html` / `_EN.html` / `_DE.html` / `_ES.html`. The `INSTRUKCJA_WKLEJANIA.md` references `00_CUSTOM_CSS.css` (no `_v2` suffix) — this is stale and should be updated to `00_CUSTOM_CSS_v2.css`.

---

## 5. Issues Summary

### Critical / Functional

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| C1 | `INSTRUKCJA_WKLEJANIA.md` references `00_CUSTOM_CSS.css` (wrong filename) | INSTRUKCJA | Operator error when pasting |
| C2 | Internal URLs use Polish slugs in all language versions | All non-PL files | Links work if CMS maps same URL to all languages, but fragile |

### Structural / Maintainability

| # | Issue | Location | Recommendation |
|---|-------|----------|----------------|
| S1 | No CSS custom properties — brand color `#00579E` hardcoded 15+ times | CSS | Add `:root { --brand: #00579E; --brand-light: #EBF4FB; ... }` |
| S2 | 12–15 inline `style=""` attributes per page | All HTML | Add missing utility/modifier classes |
| S3 | Inconsistent SVG icon format (some fragile, some explicit) | 03, 05 PL | Standardize to explicit attributes |
| S4 | 6 breakpoints with similar values (900px vs 860px) | CSS | Consolidate to 4 breakpoints |
| S5 | `.et-cta-bar__inner` actions div lacks a class | All HTML | Add `.et-cta-bar__actions` |

### Documentation / Minor

| # | Issue | Location | Note |
|---|-------|----------|------|
| D1 | `INSTRUKCJA_WKLEJANIA.md` has stale CSS filename reference | INSTRUKCJA | Update to `_v2` |
| D2 | DE/ES files retain Polish section comments | 01 DE/ES | Cosmetic, no functional impact |
| D3 | `09_GALERIA_ZDJECIA` photo count hardcoded as "58 zdjęć" | PL version | Not localized; needs updating if photos change |

---

## 6. Strengths

- **Clear component system:** The `et-*` BEM-style naming is consistent and self-documenting
- **Dark/muted section alternation:** The `--dark`/`--muted`/default pattern creates good visual rhythm without additional CSS
- **Container escape is correct:** The `calc(-50vw + 585px)` technique is the proper way to break out of IdoSell's Bootstrap container
- **CMS overrides are correct and minimal:** Only 3 system hides + 3 structural overrides; no unnecessary specificity wars
- **Responsive grid handling:** All grids gracefully collapse to single column on mobile
- **SVG icons:** Self-contained, no external dependency, consistent Feather Icons family
- **Inline lightbox integration:** Uses `data-imagelightbox="gallery"` — leverages native IdoSell CMS lightbox without extra JS
- **`loading="lazy"` on all gallery images:** Good performance practice

---

## 7. Recommended Improvements

### Priority 1 — CSS Variables (High Impact, Low Risk)

Add at top of `00_CUSTOM_CSS_v2.css`:

```css
:root {
    --et-brand:       #00579E;
    --et-brand-hover: #1D4ED8;
    --et-muted-bg:    #EBF4FB;
    --et-muted-border:#b3d4ec;
    --et-dark-bg:     #00579E;
    --et-max-width:   1170px;
    --et-section-pad: 80px;
    --et-inner-pad:   40px;
}
```

Then replace all hardcoded color values with `var(--et-brand)` etc. This makes white-labeling for other clients (non-Eagle-Tower) a single-file edit.

### Priority 2 — Missing CSS Classes (Medium Impact)

Add these classes to eliminate inline styles:

```css
/* Button group wrapper */
.et-btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

/* 2-column amenities override */
.et-amenities--2 {
    grid-template-columns: repeat(2, 1fr);
}

/* Compact section (reduced padding) */
.et-section--compact {
    padding-top: 48px;
    padding-bottom: 48px;
}

/* CTA bar actions wrapper */
.et-cta-bar__actions {
    flex-shrink: 0;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
```

### Priority 3 — Fix Instruction File

Update `INSTRUKCJA_WKLEJANIA.md`:
- Line 7: `00_CUSTOM_CSS.css` → `00_CUSTOM_CSS_v2.css`

### Priority 4 — Standardize SVG Icons

In `03_EAGLE_NEST_v2.html` and `05_EAGLE_TOWER_v2.html`, update SVGs in "Sypialnie" / "Komfort" sections to include explicit `width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"` attributes.

### Priority 5 — Breakpoint Consolidation (Low Impact)

Merge 900px and 860px breakpoints into a single `880px` breakpoint (or pick one). The 40px difference is imperceptible.

---

## 8. Component Inventory (Reusable Patterns)

This table documents every reusable component in the system for use when building new client sites:

| Component | Class | Use case |
|-----------|-------|---------|
| Full-width escape | `.et-full` | Any full-width section within CMS container |
| Section | `.et-section` | Content section wrapper with padding |
| Dark section | `.et-section.et-section--dark` | Blue background sections |
| Muted section | `.et-section.et-section--muted` | Light blue background sections |
| Inner wrapper | `.et-inner` | Max-width centered content |
| 2-col split | `.et-split` | Side-by-side content blocks |
| Hero banner | `.et-hero` + sub-elements | Sub-page top banner |
| Feature list | `.et-features` + `<li>` | Bulleted list with em-dash |
| Amenity grid | `.et-amenities` + `.et-amenity` | 3-col icon+text grid (border-divided) |
| Stats bar | `.et-specs` + `.et-spec` | Numerical specs (5-col) |
| Places list | `.et-places` + `.et-place` | Name/description/distance rows |
| Apartment cards | `.et-apt` + `.et-apt__item` | 2-col property cards |
| Gallery albums | `.et-albums` + `.et-album` | 2-col album index cards |
| Photo grid | `.et-photos` + `.et-photo` | 3-col responsive photo grid with lightbox |
| CTA button | `.et-btn` | Primary action button |
| Ghost button | `.et-btn.et-btn--ghost` | Outlined secondary button |
| CTA bar | `.et-cta-bar` | Full-width footer conversion bar |
| Eyebrow label | `.et-label` | Uppercase category label |
| Section heading | `.et-h2` | Main section title (clamp-sized) |
| Lead text | `.et-lead` | Sub-heading paragraph |
| Intro text | `.et-intro` | Large opening paragraph |
| Divider rule | `.et-rule` | Short decorative `<hr>` |

---

## 9. Adaptation Guide for New Clients

When adapting `cms_pages/` for a new client:

1. **Change brand color:** Find/replace `#00579E` → new brand color (15 occurrences in CSS)
2. **Change muted bg:** Find/replace `#EBF4FB` → new tint
3. **Update `.et-section--dark` bg** (same as brand: `#00579E`)
4. **Replace `et-` prefix** in CSS + HTML → new client prefix (e.g., `wp-` for "Willa Przykład")
5. **Update system hides** at top of CSS (phone/footer selectors may differ)
6. **Verify container escape breakpoint** (1170px max-width — may differ on other IdoSell themes)
7. **Update internal link slugs** in HTML files

**Note:** Steps 1–4 are why CSS variables (Priority 1 above) would be valuable — reduces adaptation to ~10 variable changes vs 15+ find/replace operations.

---

*Report generated by template-dev agent. Files audited: 39. Issues found: 10 (2 critical, 5 structural, 3 minor). Strengths documented: 8. Recommended improvements: 5 prioritized actions.*
