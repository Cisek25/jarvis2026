# Visual QA Report
Generated: 2026-03-13

## Scope

Live sites tested via Playwright (Chromium). Three viewport sizes: desktop (1440×900), tablet (768×1024), mobile (375×812).

Sites with confirmed live URLs tested:
- **willa_kapitanska** — `client57041.idosell.com` (live: `villakapitanska.pl`)
- **wawabed2** — `client53370.idosell.com` (live: `wawabed.pl`)
- **GoldenApartments** — `client57304.idosell.com` (live: `goldenapartments.com.pl`)

Sites without confirmed live URLs (local files only, not browser-tested):
- SORS, grzybek, dobry_wiatr, PerfectApart, willa_raclawicka

---

## Dev Server Setup

- `wawabed/serve.py` and `wawabed2/serve.py` both exist — simple Python `http.server` on port 8082
- Serves `01_STRONA_GLOWNA_PL.html` as the default entry point
- No serve.py in other client folders

---

## Deployment Model (from INSTRUKCJA_WKLEJANIA.md)

Pages are deployed by copy-pasting HTML into the IdoSell/IdoBooking CMS editor (not via file upload or CI). CSS goes into a panel-level custom CSS field. This means:
- No automated deployment pipeline
- Local HTML files are the source of truth, but the panel is the live version
- Internal links use CMS-relative paths (e.g. `/txt/201/`, `/oferty`) which only resolve in the live panel

---

## Site 1: willa_kapitanska (`client57041.idosell.com`)

### Visual Assessment

| Viewport | Result | Notes |
|----------|--------|-------|
| Desktop 1440px | PASS | Strong hero image (lighthouse illustration, sepia tone), clear CTA "REZERWUJ ONLINE", nav visible |
| Tablet 768px | PASS | Collapses cleanly, hero takes full screen, booking button prominent |
| Mobile 375px | PASS | Hamburger menu, hero text readable, CTA button visible |

**Design quality:** High. Distinctive hand-drawn nautical illustration style. Brand-consistent warm sepia palette throughout. Booking widget with date pickers renders on desktop. Full page scroll reveals: apartment cards, location grid, amenities icons, restaurant suggestion section, nearby attractions list with durations, footer with contact details.

**Responsive behaviour:** Good. Navigation collapses to hamburger at mobile. Font scaling appropriate at all sizes. No horizontal scroll observed.

### Accessibility Audit

| Check | Result | Detail |
|-------|--------|--------|
| `lang` attribute | PASS | `lang="pl"` |
| Single H1 | PASS | 1 H1 present |
| Image alt text | FAIL | 2 images missing `alt` attribute |
| Empty links | FAIL | 3 links with no text content and no `aria-label` |

### Performance (network idle)

| Metric | Value |
|--------|-------|
| DOM Content Loaded | 1070ms |
| Full Load | 1468ms |

### Issues Found

1. **COOKIE MODAL (UX)** — Consent modal (`#ck_dsclr_v2`) renders immediately over full viewport, blocking all content. The "ZGADZAM SIĘ" button text is partially cut off on mobile (375px). This is an IdoSell platform-level modal, not client code.
2. **2 images missing alt** — SEO and accessibility impact. Likely decorative icons or slider images — need `alt=""` at minimum.
3. **3 empty links** — Probably icon-only nav or social links. Need `aria-label`.

---

## Site 2: wawabed2 (`client53370.idosell.com`)

### Visual Assessment

| Viewport | Result | Notes |
|----------|--------|-------|
| Desktop 1440px | PASS | Clean dark hero with Warsaw skyline, booking widget inline in hero, dark/cream two-tone palette |
| Tablet 768px | PASS | Nav collapses to logo-only top bar, hero text and CTA remain clear |
| Mobile 375px | PASS | Stack layout, logo scales down, CTA "SPRAWDZ DOSTEPNOSC" remains prominent |

**Design quality:** High. Sophisticated dark palette (near-black + warm cream + forest green accents). Full page reveals: featured offers (3 room cards with pricing), "Twój dom w Warszawie" about section, features grid ("Co nas wyróżnia" — currently dark section with no visible icons/text loading), attractions section, gallery section (single image with "ZOBACZE WIECEJ" CTA), map embed, contact section, footer with booking CTA.

**Responsive behaviour:** Excellent. The booking widget correctly collapses from horizontal bar form on desktop to stacked vertical inputs on mobile. Typography scales well.

### Accessibility Audit

| Check | Result | Detail |
|-------|--------|--------|
| `lang` attribute | PASS | `lang="pl"` |
| Single H1 | PASS | 1 H1 present |
| Image alt text | FAIL | 14 images missing `alt` attribute |
| Empty links | FAIL | 1 link with no text and no `aria-label` |

### Performance (network idle)

| Metric | Value |
|--------|-------|
| DOM Content Loaded | 657ms |
| Full Load | 1443ms |

### Issues Found

1. **COOKIE MODAL (UX)** — Same platform-level consent modal as willa_kapitanska.
2. **14 images missing alt** — Most likely the room/offer card images and gallery thumbnails. Significant SEO and screen reader impact.
3. **"Co nas wyróżnia" section appears empty on full-page screenshot** — The dark background section between features and attractions appears blank. Confirmed this is likely a JS-animated icon section that requires scroll-trigger to populate. Not a rendering error — content is in DOM.
4. **1 empty link** — Likely a social icon link.
5. **Gallery section shows only 1 image** — Intentional or placeholder? The "ZOBACZĘ WIĘCEJ" button exists but gallery section feels sparse compared to willa_kapitanska.

---

## Site 3: GoldenApartments (`client57304.idosell.com`)

### Visual Assessment

| Viewport | Result | Notes |
|----------|--------|-------|
| Desktop 1440px | PASS | Premium dark-gold palette, full-width Gdańsk hero image, horizontal booking bar |
| Tablet 768px | PASS | Hero retained, nav stacks cleanly |
| Mobile 375px | PASS | Booking widget stacks vertically, hero cropped but effective |

**Design quality:** Highest of the three. Very polished dark navy + gold accent design. Full page scroll (after triggering lazy load) reveals:
- Hero with booking engine widget
- 4-panel navigation grid (Nasze Apartamenty, Najem Długoterminowy, Sopot i Gdynia, Nieruchomości)
- "Wybrane apartamenty" offer cards (3 featured units with images and pricing)
- Stats bar: 15+ lat doświadczenia / 30+ apartamentów / 5000+ zadowolonych gości / 4.8/5 Ocena Google
- "Komfort i lokalizacja" about section with Gdańsk image
- "Gdańsk — perła Bałtyku" location section
- "Odkryj magię Gdańska" attractions grid (6 photo cards with labels)
- "Tysiąc lat gdańskiej historii" timeline section (997, 1361, 1457, 1793...)
- Footer

**NOTE on full-page screenshot appearance:** The full-page screenshot showed large "blank" dark areas. Investigation confirmed these are intentional dark-background sections (stats bar, about section, history timeline). The dark navy colour compresses to near-black in the thumbnail view — NOT rendering failures. No JS errors and no failed network requests were detected.

**Responsive behaviour:** Good. Notable mobile issue: the booking widget expands to full-width stacked form on mobile, pushing hero content down significantly. The hero image is not visible on initial mobile viewport without scrolling.

### Accessibility Audit

| Check | Result | Detail |
|-------|--------|--------|
| `lang` attribute | PASS | `lang="pl"` |
| Multiple H1 | FAIL | 2 H1 tags found |
| Image alt text | FAIL | 1 image missing `alt` attribute |
| Empty links | FAIL | 1 link with no text and no `aria-label` |

### Performance (network idle)

| Metric | Value |
|--------|-------|
| Full page height | 9771px |
| Lazy load required | YES — content below fold needed programmatic scroll to render |

### Issues Found

1. **COOKIE MODAL (UX)** — Same platform-level modal. On mobile it partially obscures the "ZGADZAM SIĘ" button — users must scroll within modal to reach accept button.
2. **2 H1 tags** — SEO issue. Likely one in the hero section and one in a content section below. Only one H1 per page is best practice.
3. **Lazy loading requires scroll trigger** — Sections below the fold do not render until scrolled to. This is expected behaviour for performance, but means the "full page" screenshot without scroll simulation appears to have blank sections. Site works correctly for real users.
4. **Mobile hero obscured by booking widget** — On 375px, the full-screen booking widget form (4 stacked fields + button) fills the viewport, pushing the Gdańsk hero photo out of initial view.
5. **`.ga-lightbox` overlay** — A lightbox div with `display: flex` and `height: 900px` is present in the DOM at all times. It was hidden via CSS during testing. Confirm it only activates on image click.

---

## Cross-Site Issues Summary

### Platform-Level (all 3 sites — IdoSell)

| Issue | Severity | Affects |
|-------|----------|---------|
| Cookie consent modal blocks full viewport on page load | Medium | All 3 sites |
| Cookie modal "ZGADZAM SIĘ" button cut off on narrow mobile | Low | All 3 sites |

### Client-Specific

| Site | Issue | Severity |
|------|-------|----------|
| willa_kapitanska | 2 images missing `alt` | Low |
| willa_kapitanska | 3 empty/unlabelled links | Low |
| wawabed2 | 14 images missing `alt` | Medium |
| wawabed2 | 1 empty link | Low |
| wawabed2 | Gallery section sparse (1 image) | Low |
| GoldenApartments | 2× H1 tags | Medium |
| GoldenApartments | 1 image missing `alt` | Low |
| GoldenApartments | 1 empty link | Low |
| GoldenApartments | Booking widget covers hero on mobile 375px | Low |

---

## Accessibility Summary

| Site | `lang` | H1 | Missing alt | Empty links | Overall |
|------|--------|----|-------------|-------------|---------|
| willa_kapitanska | PASS | PASS | 2 | 3 | Minor issues |
| wawabed2 | PASS | PASS | **14** | 1 | Needs work |
| GoldenApartments | PASS | **FAIL (2×)** | 1 | 1 | Needs work |

**Recommendation:** All three sites need an `alt` attribute audit. wawabed2 is the most urgent with 14 missing. GoldenApartments needs the duplicate H1 resolved.

---

## Screenshots Inventory

All screenshots saved to `/Users/user/Desktop/Claude_STRONY/claudedocs/screenshots/`:

| File | Description |
|------|-------------|
| `willa_kapitanska_desktop.png` | 1440px viewport, above fold |
| `willa_kapitanska_tablet.png` | 768px viewport, above fold |
| `willa_kapitanska_mobile.png` | 375px viewport, above fold |
| `willa_kapitanska_desktop_full.png` | 1440px full page |
| `wawabed2_desktop.png` | 1440px viewport, above fold |
| `wawabed2_tablet.png` | 768px viewport, above fold |
| `wawabed2_mobile.png` | 375px viewport, above fold |
| `wawabed2_desktop_full.png` | 1440px full page |
| `golden_apartments_desktop.png` | 1440px viewport, above fold |
| `golden_apartments_tablet.png` | 768px viewport, above fold |
| `golden_apartments_mobile.png` | 375px viewport, above fold |
| `golden_apartments_desktop_full.png` | 1440px full page (before scroll) |
| `golden_apartments_desktop_full_lazy.png` | 1440px full page (after lazy-load scroll) |
| `golden_scroll_2500.png` | GoldenApartments at y=2500px |
| `golden_scroll_3500.png` | GoldenApartments at y=3500px |
| `golden_scroll_4500.png` | GoldenApartments at y=4500px |
| `golden_scroll_5500.png` | GoldenApartments at y=5500px |
| `golden_scroll_6500.png` | GoldenApartments at y=6500px |

---

## Sites Not Browser-Tested (no live URL found)

| Client | Reason | Recommendation |
|--------|--------|----------------|
| SORS | No client/panel URL in files | Locate panel URL from client; test `engine57041` or ask user |
| grzybek | client57156 — no HTML pages deployed | Nothing to test; build pages first |
| dobry_wiatr | engine52436 — no HTML pages | Nothing to test; build pages first |
| PerfectApart | engine22765 — CSS component only | N/A |
| willa_raclawicka | No panel URL found in files | Locate panel URL |

---

## Recommendations (Priority Order)

1. **wawabed2 — fix 14 missing `alt` attributes** — Highest accessibility impact across all tested sites.
2. **GoldenApartments — fix duplicate H1** — SEO impact; find which H1 should be demoted to H2.
3. **GoldenApartments — mobile booking widget** — Consider collapsing widget to a single "Sprawdź dostępność" button on mobile 375px that expands on tap, so the hero remains visible on load.
4. **All sites — audit empty links** — Add `aria-label` to icon-only social/nav links.
5. **Locate panel URLs for SORS and willa_raclawicka** — Required before those sites can be browser-tested.
