# CSS Audit — Booking Sites Team
**Status**: Complete
**Date**: 2026-03-13
**Auditor**: css-specialist (preliminary) + template-dev (completed after Task #1)

---

## Files Audited

| File | Client | Type | Lines (approx) |
|------|--------|------|----------------|
| `cms_pages/00_CUSTOM_CSS_v2.css` | Eagle Tower Benidorm | Master template | 708 |
| `wawabed2/custom.css` | WawaBed B&B v2 | Full site CSS | 1280 |
| `wawabed/custom.css` | WawaBed B&B v1 | Full site CSS | ~900+ |
| `willa_raclawicka/00_CUSTOM_CSS.css` | Willa Racławicka | Section CSS | 497 |
| `dobry_wiatr/custom.css` | Dobry Wiatr Chalupy | Functional fixes | 249 |
| `GoldenApartments/golden_widget.css` | Golden Apartments | Search widget | 479 |
| `GoldenApartments/wyszukiwarka-restyling.css` | Golden Apartments | Search widget v2 | 463 |
| `GoldenApartments/silnik/wyszukiwarka.css` | Golden Apartments | Search widget v3 | 658 |
| `grzybek/DO_WKLEJENIA/gs_ARKUSZ_STYLOW.css` | GeoStay (Grzybek) | Full site CSS | 80+ |
| `SORS/glowna_redesign.css` | SORS | Homepage redesign | 80+ |

Also found but not yet fully read:
- `SORS/apartamenty_embed.css`
- `SORS/glowna_oferty.css`
- `GoldenApartments_stare/*` (legacy/archived)
- `willa kapitanska new/ostateczny.css`
- `PerfectApart/kod-rabatowy.css`

---

## Summary of Findings

### 1. Naming Convention & Prefix System

**Good practices found:**
- `et-` prefix: Eagle Tower template (master CSS) — consistent BEM-like naming
- `wb-` prefix: WawaBed — consistent across v1 and v2
- `wr-` prefix: Willa Racławicka — consistent
- `gs-` prefix: GeoStay/Grzybek — consistent

**Issues:**
- **GoldenApartments has 3 separate search widget CSS files** (`golden_widget.css`, `wyszukiwarka-restyling.css`, `silnik/wyszukiwarka.css`) with overlapping selectors and slightly different values. This is a maintenance liability — unclear which is canonical.
- SORS uses `et-` prefix (from master template) but also mixes in plain selectors like `.pictogram`, creating ambiguity.
- `dobry_wiatr/custom.css` uses no prefix at all — targets system selectors directly (`.printItemRow`, `.tooltip-wrapper`).

---

### 2. Full-Width Escape Pattern

Three different techniques are used to escape IdoSell's 1170px container:

| Client | Technique | Code |
|--------|-----------|------|
| Eagle Tower (master) | Negative margin + calc | `margin-left: calc(-50vw + 585px); width: 100vw` |
| WawaBed v2 | Transform translateX(-50%) | `width: 100vw; margin-left: 50%; transform: translateX(-50%)` |
| GeoStay | Same as WawaBed v2 | `left: 50%; transform: translateX(-50%)` |

**Issue**: Two different full-width escape strategies exist. The master template uses negative margin; client files use transform-based approach. They are functionally equivalent, but inconsistent. Should standardize on one approach.

**Recommendation**: Adopt the `margin-left: 50%; transform: translateX(-50%)` approach (WawaBed/GeoStay) as it's more widely understood and doesn't require knowing the container max-width (585px = 1170/2). Update master template accordingly.

---

### 3. CSS Custom Properties (Variables) Usage

| Client | Uses `:root` variables | Quality |
|--------|----------------------|---------|
| WawaBed v2 | Yes — concise set | Good — 15 vars |
| WawaBed v1 | Yes — very extensive | Overkill — 50+ vars including spacing tokens |
| Willa Racławicka | No — hardcoded hex only | Poor |
| Eagle Tower master | No — hardcoded hex only | Poor |
| GeoStay | Yes — comprehensive | Good |
| GoldenApartments | No — hardcoded hex throughout | Poor |
| Dobry Wiatr | No variables | N/A (functional-only file) |

**Issue**: The master template (`00_CUSTOM_CSS_v2.css`) does NOT use CSS custom properties. Brand color `#00579E` appears hardcoded ~15+ times. If a client wants a color change, every instance must be updated manually.

**Recommendation**: Add `:root` variables block to master template at minimum for primary color, dark background, and light background.

---

### 4. Color Palette Consistency

**GoldenApartments — 3 different accent color values across 3 files:**

| File | CTA/Button color | Accent gold |
|------|-----------------|-------------|
| `golden_widget.css` | `#AD5009` (orange-brown) | `#C9A96E` |
| `wyszukiwarka-restyling.css` | `#C8841D` (amber) | `#C8841D` |
| `silnik/wyszukiwarka.css` | `#AD5009` (orange-brown) | `#C9A96E` |

The v2 restyling file (`wyszukiwarka-restyling.css`) uses a noticeably different amber color scheme vs the other two files. This inconsistency suggests v2 was a rebrand attempt that wasn't fully committed to.

**WawaBed v1 vs v2:**
- v1: `--wb-gold: #C19A6B` — warmer brown-gold
- v2: `--wb-gold: #C19A6B` — same value, but v2 removes `--wb-brown` variables
- Both versions coexist in filesystem, unclear which is deployed

---

### 5. `!important` Usage

| File | !important count (approx) | Assessment |
|------|--------------------------|------------|
| Eagle Tower master | ~5–10 | Minimal — only for system overrides |
| WawaBed v2 | 0 (own classes) / ~30 (IdoBooking overrides) | Appropriate |
| GoldenApartments search widget | ~200+ | Excessive but necessary for widget overrides |
| GeoStay | Mix — own classes use `!important` | Problematic |
| Willa Racławicka | 0 | Clean |
| Dobry Wiatr | ~60+ | High but mostly tooltip hacks |

**Issue**: GeoStay (`gs_ARKUSZ_STYLOW.css`) applies `!important` to its own custom classes (`.gs-section`, `.gs-container`, `.gs-h1`, `.gs-h2`), not just system overrides. This is an anti-pattern — own classes should not need `!important`.

**Recommendation**: Remove `!important` from all GeoStay custom classes. Reserve `!important` only for IdoSell/IdoBooking system overrides.

**STATUS**: Fixed (2026-03-13) — stripped `!important` from all own `.gs-` classes. Retained in `.gs-section` (container escape) and all `body.page-*` / system override selectors. Reduced from 898 → 242 `!important` declarations.

---

### 6. Responsive Design Breakpoints

Breakpoints used across files:

| Client | Breakpoints |
|--------|-------------|
| Eagle Tower master | 1200px, 900px, 860px, 768px, 680px, 480px |
| WawaBed v2 | 1024px, 768px, 480px |
| WawaBed v1 | 1280px, 1024px, 900px, 768px, 640px, 480px, 360px |
| Willa Racławicka | 1100px, 768px, 550px |
| GoldenApartments search | 1100px, 850px, 540px, 380px |
| Dobry Wiatr | 767px |

**Issue**: No standard breakpoint set. Eagle Tower master uses 6 different breakpoints; WawaBed v2 uses only 3. The values are inconsistent (767px vs 768px, 850px vs 860px vs 900px).

**Recommendation**: Standardize on 4 breakpoints:
- `1200px` — wide desktop → standard
- `1024px` — tablet landscape
- `768px` — tablet portrait / mobile landscape
- `480px` — mobile

---

### 7. Font Loading

| Client | Fonts | Loading method |
|--------|-------|---------------|
| WawaBed v1 & v2 | Playfair Display + Source Sans 3 | `@import` in CSS |
| Willa Racławicka | Playfair Display + Lato | Referenced but no `@import` seen in this file |
| GeoStay | Cormorant Garamond + Inter | `@import` in CSS |
| GoldenApartments | Montserrat | Hardcoded in `font-family` declarations, no `@import` |
| Eagle Tower master | None | Uses system fonts only |

**Issue**: GoldenApartments references `'Montserrat', sans-serif` in ~20 places but has no `@import` for the font. Montserrat likely loads from IdoSell's global CSS or a `<link>` tag elsewhere, but this is fragile.

**Issue**: Using `@import` for Google Fonts inside CSS is a performance anti-pattern (blocks render). Should use `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` instead.

---

### 8. IdoSell/IdoBooking System Overrides

Different approaches to overriding system selectors:

| Client | Approach |
|--------|---------|
| WawaBed v2 | Scoped overrides under `.page-offers`, `.cmshotspot` |
| WawaBed v1 | Very broad — applies to body/h1/h2/a globally |
| GoldenApartments | Widget-specific (`#iai_book_form`, `.litepicker`) |
| Dobry Wiatr | Targeted functional fixes for tooltip behavior |
| Eagle Tower master | Minimal — `#pageContent`, `h1.big-label`, `.txt-text` |

**Issue**: WawaBed v1 resets `body { font-family }`, `h1-h4 { font-family }`, and `a { color }` globally. This can bleed into IdoSell system pages (booking engine, account pages) and cause visual regressions. WawaBed v2 partially improves this but still has global `body` reset.

**Recommendation**: All global resets (`body`, `h1-h6`, `a`) should be scoped under a wrapper class (e.g., `.wb-page`) or CMS-specific containers.

---

### 9. Duplicate / Legacy Files

**GoldenApartments has version proliferation:**
```
GoldenApartments/
  golden_widget.css           ← version 1
  wyszukiwarka-restyling.css  ← version 2 (different color scheme)
  silnik/wyszukiwarka.css     ← version 3 (most complete, numbered sections)
  silnik/wyszukiwarka-active.css ← unclear purpose
```

The `silnik/wyszukiwarka.css` appears to be the canonical/latest version (has animation keyframes, fullpage.js z-index fixes, 4 breakpoints). The other two are likely superseded but not deleted.

**GoldenApartments_stare/** — entire directory of old versions still present.

**Recommendation**: Archive/delete superseded files. Keep only `silnik/wyszukiwarka.css` as the active search widget CSS for Golden Apartments.

---

### 10. Accessibility Concerns

| Issue | Location |
|-------|---------|
| `.visuallyhidden` uses deprecated `clip: rect(0,0,0,0)` instead of modern `clip-path: inset(50%)` | GoldenApartments all widget files |
| No `prefers-reduced-motion` media query on any animation | All files |
| Color contrast not verified for `rgba(255,255,255,0.55)` text on dark backgrounds | WawaBed, Eagle Tower |

**Recommendation**: Add `@media (prefers-reduced-motion: reduce)` block to at least the master template.

---

## Priority Issues Summary

| Priority | Status | Issue | Affected Files |
|----------|--------|-------|---------------|
| HIGH | OPEN | GoldenApartments has 3 conflicting search widget CSS files | `golden_widget.css`, `wyszukiwarka-restyling.css`, `silnik/wyszukiwarka.css` |
| HIGH | FIXED | Master template has no CSS variables — colors hardcoded | `00_CUSTOM_CSS_v2.css` |
| HIGH | FIXED | GeoStay uses `!important` on own classes | `gs_ARKUSZ_STYLOW.css` |
| MEDIUM | OPEN | Two different full-width escape strategies | All files |
| MEDIUM | OPEN | No standardized breakpoint system | All files |
| MEDIUM | OPEN | WawaBed global resets can bleed into booking engine | `wawabed/custom.css`, `wawabed2/custom.css` |
| MEDIUM | OPEN | GoldenApartments references Montserrat without `@import` | All Golden widget files |
| LOW | FIXED | No `prefers-reduced-motion` support | Master template updated |
| LOW | OPEN | `@import` Google Fonts in CSS (performance) | `wawabed/custom.css`, `wawabed2/custom.css`, `grzybek/gs_ARKUSZ_STYLOW.css` |
| LOW | OPEN | Legacy files and directories not cleaned up | `GoldenApartments_stare/`, duplicate widget files |

---

## Recommendations for Template Improvements (when Task #1 completes)

Once the master template audit (Task #1) is done, the following should be merged back:

1. **Add `:root` variables** to `00_CUSTOM_CSS_v2.css`:
   ```css
   :root {
     --et-primary: #00579E;
     --et-primary-hover: #1D4ED8;
     --et-bg-dark: #00579E;
     --et-bg-muted: #EBF4FB;
     --et-text: #111;
     --et-text-muted: #555;
     --et-border: #e0e0e0;
     --et-max-width: 1170px;
   }
   ```

2. **Standardize full-width escape** to `margin-left: 50%; transform: translateX(-50%)` approach

3. **Add breakpoint variables** or document standard breakpoints in a comment block at top of master

4. **Add `prefers-reduced-motion` block** for all transitions/animations

5. **Document IdoSell override scope** — which selectors are system vs custom

---

## Additional Findings (template-dev, post Task #1 completion)

### 11. Willa Racławicka (`willa_raclawicka/00_CUSTOM_CSS.css`) — 497 lines

**Strengths:**
- Consistent `wr-` prefix, good BEM structure
- Color palette documented as comments at top (tokens listed but not as `:root` variables)
- Clean responsive breakpoints (1100px, 768px, 550px)
- No `!important` abuse on own classes
- Card component with image overlay, badge, and flex body is well-structured

**Issues:**
- Color tokens documented in a comment block but NOT implemented as CSS custom properties — `#D4A853` appears hardcoded ~15 times
- Targets `body.page-index` globally — could affect non-custom pages if class is reused
- References `'Playfair Display'` and `'Lato'` but no `@import` — assumes fonts loaded elsewhere
- Image aspect ratio technique uses `padding-bottom: 66.66%` (legacy hack) — could use `aspect-ratio: 3/2` instead

---

### 12. Dobry Wiatr (`dobry_wiatr/custom.css`) — 249 lines

**Purpose:** Functional fixes only — header layout, tooltip behavior patch.

**Strengths:**
- File is correctly scoped to system selectors only (no custom components)
- Tooltip CSS-only keyboard-accessible hack is sophisticated and well-commented (uses `:focus-within` + `:has()`)
- Single breakpoint (767px) appropriate for this narrow-scope fix file

**Issues:**
- ~60 `!important` declarations — justified since all target IdoBooking system components
- Does NOT use any prefix (targets `.tooltip-wrapper`, `.printItemRow` directly) — acceptable since these are system class overrides, not custom components
- `html:not(.touch)` selector depends on IdoBooking adding `.touch` class to `<html>` — fragile if that behavior changes

---

### 13. Willa Kapitańska New (`willa kapitanska new/ostateczny.css`) — large file

**Strengths:**
- Best use of CSS custom properties in the entire project — comprehensive `:root` block with named tokens for colors, fonts, and transitions
- Uses `--vk-` prefix consistently throughout
- Documents the IdoBooking font override challenge explicitly and solves it with `html body` specificity increase (no `!important` needed except on the font itself)
- Creative decorative elements (CSS grid overlay, SVG wave separators, animated boat)

**Issues:**
- `html body { font-family: ... !important }` and `html body h1-h6 { font-family: ... !important }` — while a clever specificity trick, this is still a global override that can affect IdoBooking system pages
- Complex custom CSS (animations, decorative elements) increases maintenance burden

---

### 14. Cross-Cutting Summary: Client Design Approaches

| Client | Design Style | Color Scheme | Font Approach | Variables |
|--------|-------------|-------------|---------------|-----------|
| Eagle Tower | Minimal, border-divided | Blue corporate | System fonts | Yes (fixed — 10 `--et-*` tokens) |
| WawaBed | Boutique B&B | Warm gold | Playfair + Source Sans | Yes (v2 — 15 `--wb-*` tokens) |
| Willa Racławicka | Dark luxury | Dark charcoal + gold | Playfair + Lato | Yes (fixed — 13 `--wr-*` tokens) |
| Willa Kapitańska | Nautical premium | Navy + gold | Cormorant + Lato | Yes (comprehensive `--vk-*`) |
| Dobry Wiatr | System fix only | N/A | N/A | N/A (system overrides only) |
| GeoStay | Light editorial | Neutral | Cormorant + Inter | Yes (comprehensive `--gs-*`) |
| GoldenApartments | Search widget | Amber/brown | Montserrat | Yes (fixed — 8 `--ga-*` tokens) |
| SORS | Minimal | Blue/neutral | System | Yes (inherits `--et-*` from master) |

---

### 15. Additional Files Audited (css-specialist, post Task #3 completion)

Previously listed as "not fully read" — now audited:

**`SORS/apartamenty_embed.css`** (84 lines):
- Extends `et-apt` component from master template with image wrapper and price bar
- Was using hardcoded `#00579E` and `#c8dff0` → fixed to `var(--et-brand)` / `var(--et-muted-card)` (Task #11)
- No `!important` abuse — clean

**`SORS/glowna_oferty.css`** (25 lines):
- System selector overrides for offer listing images only
- No custom classes, `!important` throughout is appropriate
- No changes needed

**`PerfectApart/kod-rabatowy.css`** (187 lines):
- Fixed-position promo code bar widget
- Uses `body:has(...)` for CSS-only discount badge logic — sophisticated
- Entirely system overrides with `#2a2a3a` dark bg and `#2563eb` blue CTAs — no tokenization needed

**`GoldenApartments/silnik/wyszukiwarka-active.css`** (25 lines):
- Supplementary JS-dependent active/focus states for search form fields
- Uses `#AD5009` orange for active label/icon — part of `--ga-orange` token family
- Left as-is (separate widget supplement file, `--ga-` vars not inherited here)

`GoldenApartments_stare/` and `wawabed/wawabed.css` — legacy/superseded, not audited.

---

## Fixes Applied (2026-03-13)

Summary of issues that were resolved during this session:

| Issue | Fix Applied | Files |
|-------|------------|-------|
| Master template: no CSS variables | Added `:root` with 10 `--et-*` tokens; replaced all ~15 hardcoded `#00579E` instances | `cms_pages/00_CUSTOM_CSS_v2.css` |
| Master template: no `prefers-reduced-motion` | Added `@media (prefers-reduced-motion: reduce)` block | `cms_pages/00_CUSTOM_CSS_v2.css` |
| Master template: utility class gaps | Added `.et-btn-group`, `.et-cta-bar__actions`, `.et-amenities--2`, `.et-section--compact` | `cms_pages/00_CUSTOM_CSS_v2.css` |
| Willa Racławicka: no CSS variables | Added `:root` with 13 `--wr-*` tokens; replaced all hardcoded hex values with `var()` | `willa_raclawicka/00_CUSTOM_CSS.css` |
| GoldenApartments: no CSS variables | Added `:root` with 8 `--ga-*` tokens; replaced all brand colors with `var()` | `GoldenApartments/silnik/wyszukiwarka.css` |
| GeoStay: `!important` on own classes | Stripped `!important` from all `.gs-` own classes (898 → 242); retained in container escape + system overrides | `grzybek/DO_WKLEJENIA/gs_ARKUSZ_STYLOW.css` |
| SORS embed: hardcoded master template colors | Updated to `var(--et-brand)` and `var(--et-muted-card)` | `SORS/apartamenty_embed.css` |
| Stale filename in installation guide | Fixed `00_CUSTOM_CSS.css` → `00_CUSTOM_CSS_v2.css` reference | `cms_pages/INSTRUKCJA_WKLEJANIA.md` |

**Issues NOT fixed (require broader decision or out of scope):**
- GoldenApartments 3-file proliferation — needs client decision on which file is deployed
- WawaBed global resets bleeding into booking engine — requires live testing before touching
- Breakpoint standardization — cross-cutting change, deferred
- `@import` Google Fonts performance — CMS-level change, not CSS-only
- Legacy `GoldenApartments_stare/` cleanup — needs confirmation before deletion

These are lower priority as the main clients and patterns are covered above.
