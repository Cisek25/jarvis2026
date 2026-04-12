# Client Starter Kit Guide

**Purpose**: Step-by-step playbook for adapting the master template to a new client site.
**Audience**: Developer building out a new IdoSell/IdoBooking booking site.
**Master template**: `/Users/user/Desktop/Claude_STRONY/cms_pages/`

---

## Overview

The master template was built for **SORS / Eagle Tower Benidorm** and contains:
- 9 page types × 4 languages (PL, EN, DE, ES) = 36 HTML files
- 1 master CSS file (`00_CUSTOM_CSS_v2.css`) with CSS custom properties
- All `et-*` BEM classes are prefixed "Eagle Tower" — rename for each new client

A full site build requires adapting this template per the steps below. Budget roughly **1–2 hours per client** for a single-language site with existing content, more for multilingual builds.

---

## Step 1 — Create Client Folder

```
/Users/user/Desktop/Claude_STRONY/
└── [client-name]/
    └── DO_WKLEJENIA/        ← files ready to paste into CMS panel
```

Copy the master template files into the new folder:

```bash
cp /Users/user/Desktop/Claude_STRONY/cms_pages/00_CUSTOM_CSS_v2.css  [client]/DO_WKLEJENIA/00_CUSTOM_CSS.css
cp /Users/user/Desktop/Claude_STRONY/cms_pages/01_STRONA_GLOWNA_v2.html  [client]/DO_WKLEJENIA/
# Copy whichever page types apply to this client
```

**Which pages to copy** — use this decision matrix:

| Page file | Copy if... |
|-----------|------------|
| `01_STRONA_GLOWNA` | Always |
| `02_APARTAMENTY` | Client has 2+ apartment units |
| `03–05` apartment subpages | One file per individual apartment unit |
| `06_LOKALIZACJA` | Client wants a dedicated location page |
| `07_ATRAKCJE` | Client wants to showcase nearby attractions |
| `08_GALERIA` | Client has multiple photo albums |
| `09_GALERIA_ZDJECIA` | Client has a single photo gallery |

---

## Step 2 — Rename the CSS Prefix

All CSS classes and HTML references use the `et-` prefix (Eagle Tower). Rename to match the new client:

| Client | Suggested prefix | Example |
|--------|-----------------|---------|
| Willa Kapitańska | `wk-` | `.wk-section`, `.wk-btn` |
| Dobry Wiatr | `dw-` | `.dw-section`, `.dw-btn` |
| Grzybek | `gz-` | `.gz-section`, `.gz-btn` |
| Generic | `[2-letter initials]-` | — |

**In CSS file:** find-replace `et-` → `[prefix]-` (whole word, case-sensitive)
**In each HTML file:** same find-replace

> If the client is a low-priority quick build, skipping the rename is acceptable — the `et-` prefix is invisible to end users. Only rename if the codebase will be maintained long-term or shared.

---

## Step 3 — Customize the :root Design Tokens

Open the CSS file. The **only section you need to edit** for basic rebranding is the `:root` block at the top:

```css
:root {
    --et-brand:        #00579E;  /* PRIMARY: brand color — buttons, headings, dark sections */
    --et-brand-hover:  #1D4ED8;  /* button hover state — usually a lighter/darker variant */
    --et-muted-bg:     #EBF4FB;  /* light tint sections — should be a pale tint of brand */
    --et-muted-border: #b3d4ec;  /* borders in muted sections */
    --et-muted-card:   #c8dff0;  /* card borders in muted sections */
    --et-max-width:    1170px;   /* container width — do NOT change for IdoSell sites */
    --et-section-pad:  80px;     /* desktop section vertical padding */
    --et-section-pad-m: 56px;   /* mobile section vertical padding */
    --et-inner-pad:    40px;     /* desktop horizontal inner padding */
    --et-inner-pad-m:  24px;     /* mobile horizontal inner padding */
}
```

**Minimum changes required:**
1. `--et-brand` → client's primary brand color
2. `--et-brand-hover` → a hover variant (slightly darker or lighter)
3. `--et-muted-bg` → a pale tint derived from the brand color
4. `--et-muted-border` and `--et-muted-card` → slightly deeper tints of `--et-muted-bg`

**Do not change** `--et-max-width` or the padding variables unless the client's IdoSell theme uses a different container width.

**Generating tints:** If the brand color is `#XX`, `--et-muted-bg` should be approximately 90–95% white mixed with the brand color. Use a tool like CSS color-mix or just eyeball a pale version.

### Quick color recipes for 4 pending clients

| Client | Brand color | Muted bg | Notes |
|--------|-------------|----------|-------|
| grzybek | TBD | TBD | Check `custom.css` in `grzybek/` for existing palette |
| dobry_wiatr | TBD | TBD | Check `custom.css` in `dobry_wiatr/` for existing palette |
| PerfectApart | TBD | TBD | Only has `kod-rabatowy.css` — no color reference |
| willa_raclawicka | TBD | TBD | Check `00_CUSTOM_CSS.css` in `willa_raclawicka/` |

---

## Step 4 — Update Page Content

For each HTML page, replace Eagle Tower / SORS content with client content. Work section by section:

### 4.1 Hero Section (all sub-pages)

```html
<div class="et-hero__inner">
    <span class="et-hero__kicker">← PAGE CATEGORY LABEL</span>
    <h1 class="et-hero__title">← MAIN PAGE HEADING</h1>
    <p class="et-hero__desc">← ONE-LINE PAGE DESCRIPTION</p>
</div>
```

Replace kicker, title, and description with client content. Keep the HTML structure identical.

### 4.2 Hero Background Image

The hero uses a CSS background image set per page. Find the hero image URL in the CSS or inline style and replace with the client's photo. IdoSell stores images at:
```
https://[client-id].idosell.com/pol/[path-to-image]
```

### 4.3 Section Content

Each `.et-section` block is self-contained. Replace text content only — do not change class names or HTML structure unless you are adding a new component type.

**Rule:** If the content fits the existing component, use it as-is. Only add new CSS classes when the content genuinely doesn't fit any existing pattern.

### 4.4 CTA Bar (last section on every page)

```html
<div class="et-cta-bar__text">
    <span class="et-label">← EYEBROW TEXT</span>
    <strong>← MAIN CTA HEADLINE</strong>
    <p>← SUPPORTING TEXT</p>
</div>
<div> <!-- button group -->
    <a href="[booking-engine-url]" class="et-btn">← PRIMARY BUTTON TEXT</a>
    <a href="[contact-url]" class="et-btn et-btn--ghost">← SECONDARY BUTTON TEXT</a>
</div>
```

The booking engine URL format: `https://engine[ID].idobooking.com/` or the IdoSell panel's built-in booking link.

### 4.5 Internal Navigation Links

Cross-links between pages use `/txt/[ID]/[slug]` paths. These IDs are assigned by the CMS when pages are created. You won't know the correct IDs until the pages exist in the CMS panel.

**Recommended workflow:**
1. Build all HTML files with placeholder hrefs: `href="#"`
2. Paste all pages into CMS panel (Step 6)
3. Note the `/txt/[ID]/` assigned to each page
4. Go back and update all cross-links in the HTML
5. Re-paste affected pages into CMS

See `/Users/user/Desktop/Claude_STRONY/claudedocs/url-slug-mapping.md` for the Eagle Tower slug reference.

---

## Step 5 — Update Images

All images in the master template reference Eagle Tower / SORS photos. Replace with client photos.

### Image patterns in the template

| Usage | Format | Location |
|-------|--------|----------|
| Hero background | CSS `background-image: url(...)` | Inline style or CSS rule |
| Photo grid | `<a class="et-photo" href="[full]"><img src="[thumb]">` | `09_GALERIA_ZDJECIA` |
| Gallery album covers | `<a class="et-album" style="background-image:url(...)">` | `08_GALERIA` |
| Apartment card photos | `<img src="..." loading="lazy">` | `02_APARTAMENTY`, `03–05` |

### Image hosting

Images are hosted on the IdoSell panel. Upload via:
**Panel → Multimedia → Galeria zdjęć**

URL format after upload:
```
https://[client-id].idosell.com/pol/[path]/[filename].jpg
```

### Photo grid count

The PL version of `09_GALERIA_ZDJECIA_v2.html` has a hardcoded count `"58 zdjęć"`. Update this to match the actual photo count for the client.

### Lazy loading

All `<img>` tags in the template already include `loading="lazy"`. Keep this attribute on all images.

---

## Step 6 — Paste into CMS Panel

Each file type goes to a specific location in the IdoSell admin panel:

### 6.1 CSS (do this first)

**Panel path:** Wygląd → Arkusz stylów CSS → custom.css (or equivalent)

Paste the entire contents of `00_CUSTOM_CSS.css`. This replaces any previous CSS.

> Use Ctrl+A to select all existing content, then paste the new CSS over it.

### 6.2 HTML Pages (sub-pages)

**Panel path:** Treści → Strony tekstowe → [page] → Zawartość

For each page:
1. Create a new text page (or open existing)
2. Switch to HTML / source mode
3. Paste the HTML file contents

**Important:** IdoSell wraps page content in `.txt-text` inside `.container`. The `et-full` container escape handles this automatically — do not add extra wrapper divs.

### 6.3 Homepage (if using HTML on homepage)

**Panel path:** Wygląd → Strona główna → Edytor treści → HTML mode

Some clients (e.g., wawabed) use CSS + JS injection instead of a full HTML homepage. In that case:
- CSS goes to the stylesheet panel
- JS goes to: Ustawienia → Kody śledzące → Koniec BODY

### 6.4 Verify after pasting

After pasting each page:
1. Hard refresh the page (Ctrl+Shift+R) to clear browser cache
2. Check on mobile width (browser DevTools → responsive mode)
3. Verify hero image loads
4. Check all buttons link correctly

---

## Step 7 — Language Versions

Only build language versions if the client explicitly needs multilingual support. Most clients in this project are PL-only.

**When to build multilingual:**
- Client targets international tourists (e.g., SORS in Batumi targets DE/EN/ES speakers)
- Client requests it explicitly

**Minimum viable multilingual approach:**
1. Duplicate the PL HTML file
2. Translate all visible text content only
3. Keep all class names, HTML structure, and URLs identical
4. Add language suffix to filename: `_EN.html`, `_DE.html`, `_ES.html`
5. In CMS panel, create separate text pages for each language under the same URL prefix

**Note on URL slugs:** IdoSell uses the same numeric page ID (`/txt/202/`) for all language versions. The slug suffix can differ per language — see `url-slug-mapping.md` for the Eagle Tower example.

---

## Step 8 — Per-Client Checklist

Use this checklist for each new client build:

### Setup
- [ ] Client folder created: `/Users/user/Desktop/Claude_STRONY/[client-name]/DO_WKLEJENIA/`
- [ ] Master template files copied
- [ ] CSS prefix renamed (or documented decision to skip rename)
- [ ] `:root` design tokens updated with client brand colors

### Content
- [ ] Hero text updated on all pages
- [ ] Hero background images replaced
- [ ] All section text content replaced with client content
- [ ] CTA bar text and booking URL updated
- [ ] Internal cross-links updated (after CMS page IDs known)
- [ ] Photo count updated in gallery page (if applicable)
- [ ] Photo grid images replaced with client photos

### CMS Deployment
- [ ] CSS pasted into panel stylesheet
- [ ] Each HTML page created in CMS panel
- [ ] Page IDs noted for cross-link updates
- [ ] Cross-links updated and pages re-pasted
- [ ] Hard refresh verified on each page
- [ ] Mobile layout checked (375px width minimum)
- [ ] Booking engine URL tested

### Optional
- [ ] HEAD/SEO tags added (meta description, Open Graph)
- [ ] Language versions built (EN/DE/ES) if required
- [ ] Galeria photos uploaded to panel multimedia

---

## Pending Client Build Status

Based on the site inventory (`client-inventory.md`), these 4 clients need full builds from scratch:

| Client | Folder | CSS exists | Notes |
|--------|--------|-----------|-------|
| **grzybek** | `grzybek/` | YES — `custom.css` | client57156.idosell.com |
| **dobry_wiatr** | `dobry_wiatr/` | YES — `custom.css` | engine52436.idobooking.com (IdoBooking, not IdoSell) |
| **PerfectApart** | `PerfectApart/` | partial — discount code CSS only | engine22765.idobooking.com |
| **willa_raclawicka** | `willa_raclawicka/` | YES — `00_CUSTOM_CSS.css` | No panel URL identified |

> **Note on dobry_wiatr and PerfectApart:** These use IdoBooking (not IdoSell). The CMS panel interface and container structure may differ slightly. The CSS container escape technique (`calc(-50vw + 585px)`) should still work, but verify the container max-width in the active IdoBooking theme.

### Recommended build order

1. **grzybek** — has IdoSell panel ID, CSS exists as starting point
2. **willa_raclawicka** — has partial HTML sections already built
3. **dobry_wiatr** — single apartment, simpler scope
4. **PerfectApart** — needs scope clarification (only has a discount code component so far)

---

## Step 9 — Accessibility & QA Sign-off

Based on live QA of existing client sites, every new build must pass these checks before handoff.

### 9.1 Mandatory Accessibility Requirements

These are the issues found across live sites — do not ship without fixing them:

| Check | How to verify | Common failure |
|-------|--------------|----------------|
| Every `<img>` has `alt=""` | Search HTML for `<img` without `alt=` | Offer card images, gallery thumbnails, slider images |
| No duplicate H1 tags | Search HTML for `<h1` | Homepage intro + hero both using `<h1>` |
| Icon-only links have `aria-label` | Search for `<a` with no text child | Social icons, scroll-to-top buttons |
| `lang` attribute on `<html>` | Injected by IdoSell — verify it matches page language | IdoSell usually handles this correctly |

**Quick audit command** (run after building HTML):
```bash
# Count images missing alt
grep -c "<img" file.html
grep -c 'alt=' file.html
# If counts differ, you have missing alt attributes

# Check for multiple H1
grep -c "<h1" file.html
# Should return 1
```

**Alt text guidance:**
- Apartment photos: `alt="[Room name] — [brief description, e.g. living room with sea view]"`
- Gallery thumbnails: `alt=""` (empty is correct for purely decorative images in a gallery lightbox)
- Hero images (CSS background): no alt needed — these are CSS, not `<img>` tags
- Logo: `alt="[Client name] logo"`

### 9.2 Known Platform Issues (IdoSell)

These are platform-level behaviors that affect all sites — they are not client code problems, but developers should be aware:

| Issue | Detail | Workaround |
|-------|--------|-----------|
| Cookie consent modal (`#ck_dsclr_v2`) blocks full viewport on first visit | Standard GDPR modal injected by IdoSell platform | None — platform behavior |
| "ZGADZAM SIĘ" button partially cut off on narrow mobile (375px) | Modal text overflows before button | None — platform behavior; report to IdoSell support if critical |
| Booking widget fills 375px viewport | On mobile, the inline booking form (4 fields + button) can occupy the entire initial viewport | Consider placing the widget lower on the page, or using a collapsed "Check availability" button on mobile |

### 9.3 Visual QA Checklist

Run this check after pasting each page into the CMS panel. Use browser DevTools (F12 → responsive mode):

**Desktop (1440px)**
- [ ] Hero image loads and fills full width
- [ ] Navigation bar visible and links correct
- [ ] No horizontal scrollbar
- [ ] Booking engine widget renders (if on homepage)
- [ ] All `.et-section--dark` sections show white text on colored background
- [ ] All `.et-section--muted` sections show light tint background
- [ ] CTA bar visible at page bottom

**Tablet (768px)**
- [ ] Navigation collapses correctly (hamburger or condensed)
- [ ] Grids collapse: `.et-split` → single column, `.et-apt` → single column
- [ ] Hero text remains readable
- [ ] No content overflow or cut-off text

**Mobile (375px)**
- [ ] Hamburger menu opens and closes
- [ ] Booking widget does not block hero image (if applicable)
- [ ] `.et-amenities` grid collapses to single column
- [ ] Photo grid (`.et-photos`) collapses to single column
- [ ] All text readable without zooming
- [ ] CTA buttons full-width and tappable (min 44px height)

**After full-page scroll (all viewports)**
- [ ] No empty/blank sections (check lazy-loaded content renders)
- [ ] Gallery images load when scrolled into view
- [ ] No broken image placeholders

### 9.4 Pre-Handoff QA Script

For automated screenshot capture of a live page (requires Node.js + Playwright installed):

```javascript
// Save as /tmp/qa_check.mjs and run: node /tmp/qa_check.mjs
import { chromium } from '/Users/user/node_modules/playwright/index.mjs';

const URL = 'https://[client-id].idosell.com/';
const OUT = '/Users/user/Desktop/Claude_STRONY/claudedocs/screenshots/';
const browser = await chromium.launch();

for (const [name, w, h] of [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 375, 812]]) {
  const page = await browser.newPage();
  await page.setViewportSize({width: w, height: h});
  await page.goto(URL, {waitUntil: 'networkidle', timeout: 30000});
  // Hide IdoSell cookie modal
  await page.evaluate(() => {
    const m = document.getElementById('ck_dsclr_v2');
    if (m) m.style.display = 'none';
  });
  await page.screenshot({path: `${OUT}[client-name]_${name}.png`});
  await page.close();
}

await browser.close();
```

---

## Reference Files

| File | Purpose |
|------|---------|
| `/Users/user/Desktop/Claude_STRONY/cms_pages/00_CUSTOM_CSS_v2.css` | Master CSS with :root tokens |
| `/Users/user/Desktop/Claude_STRONY/cms_pages/01_STRONA_GLOWNA_v2.html` | Homepage reference |
| `/Users/user/Desktop/Claude_STRONY/claudedocs/template-audit.md` | Full component inventory and CSS architecture |
| `/Users/user/Desktop/Claude_STRONY/claudedocs/css-audit.md` | Cross-client CSS quality analysis |
| `/Users/user/Desktop/Claude_STRONY/claudedocs/client-inventory.md` | All client sites and their completion status |
| `/Users/user/Desktop/Claude_STRONY/claudedocs/url-slug-mapping.md` | Polish slug mapping for EN/DE/ES |
| `/Users/user/Desktop/Claude_STRONY/claudedocs/qa-report.md` | Visual QA results for willa_kapitanska, wawabed2, GoldenApartments |
| `/Users/user/Desktop/Claude_STRONY/cms_pages/INSTRUKCJA_WKLEJANIA.md` | Original CMS paste instructions |
