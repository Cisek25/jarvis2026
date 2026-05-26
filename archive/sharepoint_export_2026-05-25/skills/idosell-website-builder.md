# IdoSell/IdoBooking Website Builder Skill

## Description
Builds complete IdoSell/IdoBooking hotel/apartment websites from client brief. Handles CSS design system, subpages, search widget, system overrides, photo scraping, and multi-language support.

## Trigger
- "nowa strona IdoSell", "nowy klient IdoSell", "zbuduj stronę"
- When user provides a client brief with: panel URL, brand name, colors, font preferences
- /idosell command

## Workflow — New Client

### Phase 0: RECON (before writing any code)
1. Read memory: `idosell-clients-db.md` + `idosell-websites.md`
2. Get from user: panel URL, brand name, color palette, font pair, prefix (2-3 letters)
3. Open panel in browser: check header class, slider images, offers count
4. Scrape /offers → get offer names, prices, person counts, locations
5. Scrape each /offer/{id} → get photos (first landscape image per offer)
6. Scrape /contact → get address, phone, email
7. Check gallery images: `/images/frontpageGallery/pictures/large/`
8. Measure header height via DevTools
9. Note body classes on each page type

### Phase 1: CSS DESIGN SYSTEM (~2000 lines)
Files: `{PREFIX}_ARKUSZ_STYLOW.css`

Must include (in order):
- §0: CSS Variables (colors, fonts, shadows, radii)
- §1: Global resets (`body { font-size: 16px !important }`, html/body border-top, body::before)
- §2: Typography (Merriweather/Playfair/DM Serif + Inter pattern)
- §3: Header (`position: fixed !important`, brand bg, measured padding-top for subpages)
- §4: Hero section (`.parallax-slider::before { display: none }`, gradient overlay, `.index-info` z-index: 1000 + overflow: visible)
- §5: Search widget (pill-bar or card style, labels hidden, placeholders via JS, dropdown styles)
- §6: System overrides (#bounce, #backTop, cookie, skip — HARDCODED hex, not CSS vars!)
- §7: Sections (cards grid, alternating layouts, CTAs)
- §8-§11: Responsive breakpoints (1200, 1024, 768, 480)
- §12+: Subpage-specific (/offers filters+cards, /contact links, custom subpages)
- /offers: filter collapse CSS, SZCZEGOLY button flexbox, .iai-search hidden, orange override
- /contact: link colors, button colors, font-size normalize

### Phase 2: HTML CONTENT
Files per subpage: `{PAGE}_{LANG}__body_top.html`

- Homepage CMS: sections with REAL scraped photos, offer cards linked to /offer/{id}
- Custom subpages: Atrakcje, Galeria, Dla Właścicieli, etc.
- Zero inline styles, zero `<style>` blocks, zero `<script>` tags in body_top!

### Phase 3: JAVASCRIPT
File: `GLOWNA_{LANG}__body_bottom.html` (ONE file, global)

Must include:
- §1: Scroll reveal (IntersectionObserver)
- §2: Smooth scroll (anchor links)
- §3: Mobile menu toggle
- §4: Lazy loading
- §5: Search widget placeholders (0s + 500ms + 1500ms + 3000ms)
- §6: Filter collapse + toggle (if /offers page exists)
- §7: FAQ accordion toggle (if any FAQ exists) — aria-expanded + hidden
- §8: Phone/email from footer (if CTA section exists)

### Phase 4: META + SEO
File: `{PREFIX}_HEAD.html`
- OG tags, Schema.org (LodgingBusiness), Google Fonts link

### Phase 5: QA TESTING (MANDATORY — NEVER SKIP)

#### 5A: Link Verification (run TWICE)
1. Grep ALL `href="..."` from every HTML file
2. For each internal link: fetch HEAD request to `{panelURL}{href}` → must return 200
3. Verify correct URL format: `/txt/{ID}/{Slug}` (NOT `/txt/slug-only`)
4. Check nav links match: compare `<nav>` links on live site with href values in HTML
5. Verify anchor links (`#id`) have matching elements
6. Check `tel:` and `mailto:` contain REAL contact data (NOT placeholders like +48000000000)
7. Log results table: URL | Status | Pass/Fail

#### 5B: Image Verification
1. For each `<img src="...">` : fetch HEAD → must return 200
2. Check naturalWidth > 0 (image actually loads)
3. Verify no placeholder divs remain (grep for `img-placeholder`)
4. Wikimedia URLs ≤600px thumbnail

#### 5C: Mobile-First Responsive Testing (via Playwright)
Test at 3 breakpoints — screenshot each page:
1. **375x812** (iPhone) — all pages
2. **768x1024** (iPad) — all pages
3. **1440x900** (Desktop) — all pages

Check for each:
- Text readable (no overflow, no clipping)
- Images visible (not zero-height)
- Navigation accessible (hamburger menu works)
- Cards stack properly on mobile
- Search widget usable on mobile
- No horizontal scroll

#### 5D: Interaction Testing
1. Search widget: click each dropdown → verify opens
2. FAQ accordion: click each question → verify answer shows
3. Filter toggle (if /offers): click → verify filters show/hide
4. Smooth scroll: click anchor link → verify scroll
5. Mobile menu: click hamburger → verify menu opens

#### 5E: Visual Testing
1. Inject CSS via DevTools → full-page screenshot every page
2. Check contrast: dark text on dark bg = FAIL (use getComputedStyle)
3. Check hero sections: text must be white/light on dark gradients
4. Verify brand colors applied (not system orange #AD5009)

#### 5F: Contact Data Verification
1. Scrape footer on live site → extract real phone + email
2. Compare with all `tel:` and `mailto:` in HTML files
3. If mismatch → auto-fix from footer data

### Phase 6: DOCUMENTATION
File: `INSTRUKCJA.txt`
- Step-by-step paste guide for panel
- List of all files and where they go in panel

## System Traps Checklist (verify ALL):
- [ ] `body { font-size: 16px !important }` (system = 22.4px)
- [ ] `.index-info { z-index: 1000; overflow: visible }`
- [ ] `.parallax-slider::before { display: none }`
- [ ] System `z-index: -1` on inputs → `z-index: 2`
- [ ] System orange #AD5009 → brand color
- [ ] Header: `position: fixed` (NOT sticky!) + correct padding-top
- [ ] Litepicker: `width: fit-content`
- [ ] `.iai-search` hidden on `/offers`
- [ ] body_top strips `<script>` — ALL JS in body_bottom
- [ ] Footer: style via CSS only, never create custom HTML
- [ ] Wikimedia thumbnails max 600px
- [ ] Photo scraping from /offer pages for homepage cards
- [ ] ALL links use `/txt/{ID}/{Slug}` format (NOT `/txt/slug-only`)
- [ ] ALL tel/mailto use REAL data from footer (NOT placeholders)
- [ ] NO img-placeholder divs remaining
- [ ] QA test results logged before delivery

## Lessons Learned v1.66-v1.69 (Fair Rentals 2026-05-19/20)

### Body_top sanitizer wycina inline styles
- `<section style="background-image: url(...)">` w body_top → wycięte przez WAF/sanitizer panelu
- Fix: użyć klasy modyfikator `.foo--with-bg` + reguła w CSS arkuszu
- Reference: `feedback_idobooking_body_top_inline_style_stripped.md`

### Body_bottom 62KB silent truncate
- Panel IdoBooking nie zgłasza błędu gdy body_bottom >62KB
- boot() i tail kodu wycięte → JS nie inicjalizuje
- Run minify_*.py jeśli source HTML >65KB
- Reference: `feedback_idobooking_body_bottom_size_limit.md`

### Powered by IdoBooking WIDOCZNE — wymóg licencyjny
- NIE używaj `display: none` na `.powered_by`, `.powered_by_logo`
- Acceptable: subtle styling (opacity 0.7-1.0, max-height 22px)
- Reference: `feedback_powered_by_idobooking_visible.md`

### `position: absolute + top: 50%` spada gdy parent rośnie
- Logo/hamburger z `top: 50%` zjeżdża gdy mobile menu open (parent .navbar rośnie 65→388px)
- Fix: `top: 12px` (fixed) zamiast 50%
- Reference: `feedback_idobooking_specificity_war.md`

### Litepicker miesiące widoczne (`:has(select)`)
- Reguła `.month-item-name:not(select):not(:has(select))` ukrywała `<strong>maj</strong>`
- Działało na fr-cmd-bar (są `<select>`), ale na podstronie apartamentu (Litepicker --static z tylko `<strong>`) — miesiąc znikał
- Fix: `html body .litepicker .month-item-header:has(select.month-item-name) strong.month-item-name { display: none }`

### Grid `repeat(7, 1fr)` overflow na mobile
- `1fr` = `minmax(auto, 1fr)` → min-content kolumny może być > parent
- Mobile 240px container × 7 cells × 52px content = 364px overflow
- Fix: `repeat(7, minmax(0, 1fr))` — minimum 0, max 1fr
- Reference: ostatnie sesje FairRentals

### iPhone Safari `<select>` z `appearance: none`
- Litepicker dropdowny (`<select class="month-item-name">`) renderują się pusto na iPhone Safari
- Fix: `dropdowns: isDesktop ? {...} : false` — na mobile użyj `<strong>` (text node)

### CSS size ≤450KB (admin OOM at ~500KB)
- Fair Rentals 460KB → admin zgłosił memory error
- Refactor: usunięcie USUNIETE komentarzy + strip indentacji = -50KB
- Use `idosell-css-refactor` skill jeśli zbliżasz się do 450KB

### Google Maps embed BEZ klucza
- `embed/v1/place?key=AIza...` wymaga API key — może wyciekać do GitHub
- Lepiej: `maps.google.com/maps?q=<address>&output=embed` — publiczne, bez klucza
- Reference: incident RPA 2026-05-19

## Linked skills

- **Pre-build**: `idosell-project-manager` (load client memory)
- **Build**: this skill (`idosell-website-builder`)
- **Pre-deploy**: `idosell-deploy-cr` (mandatory code review)
- **Post-deploy**: `idosell-seo-audit` (Lighthouse), `idosell-e2e-test` (regression)
- **Issue handling**: `idosell-bug-debug` (when klient zgłasza)
- **Accessibility**: `idosell-a11y-audit` (sign-off, quarterly)
- **Maintenance**: `idosell-memory-consolidate` (monthly hygiene)
