# Cross-Project Patterns & Lessons Learned
Extracted from 13 projects across IdoSell/IdoBooking platform.

## Design Patterns Across Projects

### Color Palettes by Theme
| Theme | Projects | Primary | Accent | Background |
|-------|----------|---------|--------|------------|
| Gold luxury | Mazurski, WawaBed v1, Willa Kap., Willa Racl. | dark/navy | gold (#C6A96B-#D4A853) | cream/dark |
| Green nature | EcoCamping, Najmar, WawaBed v2 | green (#2D5016-#4A6741) | wood/tan | cream #F5F1EB |
| Blue professional | SORS, CityApart | blue (#00579E-#1a365d) | bright blue #2563eb | white/light blue |
| Mediterranean warm | GeoStay | terracotta #C4704B | olive #6B8F5E | sand #F5EDE3 |
| Maritime navy+gold | Willa Kapitanska | navy #1B2A4A | gold #C6922A | cream #FBF7EC |
| Warm timber | Madera | warm brown | timber tones | #FAF6F0 light |
| Gold accent | GoldenApartments | gold theme | — | — |

### Font Pairings Used
| Heading | Body | Projects |
|---------|------|----------|
| Playfair Display | Inter | Mazurski Chill, WawaBed v1 |
| Playfair Display | Lato | Willa Raclawicka, Willa Kapitanska |
| Playfair Display | Source Sans 3 | WawaBed v2 |
| DM Serif Display | Inter | EcoCamping |
| Merriweather | Inter | Najmar |
| Cormorant Garamond | Inter | GeoStay |
| Signika | System sans | CityApart |
| Cormorant Garamond + Lora | Lato | Willa Kapitanska (4 fonts!) |

**Pattern**: Playfair Display is the most popular heading font (5/13 projects). Inter is the most popular body font (5/13).

### CSS Prefix Convention
Every custom project uses 2-3 letter prefix: ga-, md-, ec-, mc-, nj-, et-, gs-, ca-, wb-, vk-, wr-
Only IdoBooking-minimal projects (Dobry Wiatr, PerfectApart) skip prefixes.

## CSS Size by Project Maturity
| Project | CSS Lines | Stage | Notes |
|---------|-----------|-------|-------|
| Willa Kapitanska | ~4000+ (156KB) | advanced | 4 fonts, SVG animations, compass |
| Najmar | ~4400 | 14 sessions | most iterated, 33 root causes |
| WawaBed v1 | ~5000 (2 files) | production | Art Deco, split stylesheet |
| GeoStay | 1959 | ready | bilingual PL+RU |
| WawaBed v2 | 1279 | alternative | condensed from v1 |
| Willa Raclawicka | 505 | initial | 2 sections only |
| Dobry Wiatr | 272 | minimal | fixes only |
| PerfectApart | 187 | minimal | 1 feature only |

**Pattern**: Full custom design = 1500-5000 lines CSS. Minimal fixes = 200-500 lines.

## Recurring Technical Patterns

### Full-Width Section Escape (used in 8+ projects)
```css
.section-full {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
```

### Card Grid Responsive (standard breakpoints)
- Desktop: 3 columns (>1100px)
- Tablet: 2 columns (768-1100px)
- Mobile: 1 column (<768px)
- Additional: 550px, 480px for fine-tuning

### Image Aspect Ratio Trick (Willa Raclawicka, GeoStay)
```css
.card-img { position: relative; padding-bottom: 66.66%; /* 3:2 */ }
.card-img img { position: absolute; inset: 0; object-fit: cover; }
```

### Gold Accent Line Separator (5+ projects)
```css
.separator { width: 60px; height: 3px; background: var(--accent-gold); margin: 16px auto; }
```

### Hover Card Lift (universal)
```css
.card:hover { transform: translateY(-6px); box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
.card img:hover { transform: scale(1.06); }
```

### Scroll Reveal Animation (WawaBed, Willa Kapitanska, Najmar)
- `.reveal` class + IntersectionObserver → `.in` class
- `opacity: 0; transform: translateY(30px)` → `opacity: 1; transform: none`
- Stagger delays: 0.08s increments per child

## Platform-Specific Lessons

### IdoSell vs IdoBooking
| Feature | IdoSell | IdoBooking |
|---------|---------|------------|
| CSS injection | Panel > Wyglad > Arkusz stylow | Panel CSS editor |
| JS injection | body_bottom (end of body) | Limited |
| CMS content | Edytor tresci (HTML mode) | Widget-based |
| Custom pages | /txt/NNN/Slug | Limited |
| body_top strips | `<script>` tags YES | N/A |
| System orange | #AD5009 everywhere | Different defaults |
| Search widget | .iai-search + #iai_book_form | Different widget |

### IdoBooking-Specific (Dobry Wiatr, PerfectApart, PuckBay)
- Tooltip system is broken out-of-box — needs CSS override
- `:has()` CSS selector works for conditional styling (discount applied → show strikethrough)
- `html:not(.touch)` pattern differentiates desktop/mobile
- Fixed position top bars need z-index: 99999 (system elements compete)
- WordPress integration via Code Snippets plugin OR functions.php
- Widget booking form customization limited (single month calendar max)

## Content Patterns

### Blog/SEO (CityApart model — 16 articles)
- Articles: 5-8 min reads, H2/H3 hierarchy
- Tags: Apartamenty, Poradnik, Przewodnik, Biznes, Gastronomia, Transport, Rodzina, Natura, Eventy
- Each article has: tag badge, date, reading time, tip box, CTA
- Custom bullet: em-dash `—` in brand color (not default dots)
- CTA box at article end: dark bg, white text, booking button

### Multilingual Support
- PL+EN: Madera, EcoCamping (standard)
- PL+DE: Willa Kapitanska (German tourists in Kolobrzeg)
- PL+RU: GeoStay (Russian-speaking market in Batumi)
- PL+EN+DE+ES: SORS (international vacation market Benidorm)
- Pattern: Separate HTML files per language, same CSS, same page IDs

### Schema.org / Structured Data
- Willa Kapitanska: LodgingBusiness + WebSite JSON-LD
- Should be standard for ALL hospitality projects (SEO benefit)

## Image Audit Pattern (learned from SORS 2026-04-01)
**Kiedy**: Przy przypisywaniu zdjęć do sekcji tematycznych (lokalizacja, atrakcje)
**Jak**:
1. Przejrzyj CAŁY album wizualnie (screenshot każdego zdjęcia) — nie zakładaj z ID/nazwy
2. Dokumentuj content w tabeli: ID + krótki opis co widać
3. Dopasuj zdjęcia do tematów sekcji (golf→pole golfowe, plaża→plaża)
4. Jeśli brak idealnego dopasowania → "general area view" lepszy niż niepasujące zdjęcie
5. Po zmianie zdjęcia → zaktualizuj WSZYSTKIE wersje językowe (łatwo pominąć jedną)

**Przykład**: Image 79 (taras z jadalnym stolikiem) był w sekcji "Golf" → zamieniony na 69 (widok z lotu ptaka z fairwayami)

## META Title Pattern (learned from SORS 2026-04-01)
- **Format**: `{Treść strony} — {Brand} | {Lokalizacja/USP}`
- **Limity**: ~60 znaków title, ~155 znaków description
- **Multilingual**: osobne per język (nie automatyczne tłumaczenie — dostosuj do rynku)
- **CMS fields**: "Tytuł META" + "Opis META" w ustawieniach strony
- **Audyt**: sprawdź istniejące META na KAŻDEJ podstronie (często placeholder "Tytuł META" lub "Pokoje")

## Architecture Decisions Log

### CrewAI Pipeline (crewai-idobooking/)
- Multi-agent: CSS Designer → Content Writer → HTML Developer → UX Auditor
- Config-driven: YAML per client (palette, style, pages)
- Templates: hero, gallery, CTA, amenities, features, places
- Output: HTML/CSS files ready for CMS
- Status: Prototype, not production-verified

### Featured Offers System (Madera pattern — RECOMMENDED approach)
- **Mechanism**: Panel "wyroznione oferty" → system auto-generates `.container-hotspot` section
- **DOM**: `.container-hotspot > .row.cmshotspot > .col-12 > h2.big-label.line-label + .offerslist.slick-initialized`
- **Card**: `.offer > a.object-icon (img + .offer__hover > p.offer__description) + h3 > a + .offer__box`
- **Position**: AFTER hero/search bar, BEFORE body_top custom content
- **Images**: Auto from panel — no manual img src needed!
- **Styling pattern**:
  - Full-width bg: `::before` with `width:100vw; left:50%; transform:translateX(-50%)` + parent `z-index:0`
  - Cards: `height: auto !important` (system forces 477px), `border-radius: 12px`
  - Image: `padding-bottom: 62.5%` (16:10) with `position: absolute` on img
  - Hover: gradient overlay `.offer__hover` with `opacity` transition
  - Slick arrows: `border-radius: 50%`, `width/height: 44px`
  - All fonts need `!important` (system uses system-ui)
- **Zones/Strefy** (advanced, baltic-apartments.com reference):
  - `offersSectionLimits = { strefa1: 7, strefa2: 6, strefa3: 6, strefa4: 6 }`
  - Distributes offers across named sections on homepage
  - TODO: investigate for multi-section projects
- **Replaces**: Static HTML cards with empty `<img src="">` (BAD — breaks on image changes)

### Dynamic Offer Embedding (SORS pattern)
- JS reads system `.cmshotspot` grid, injects styled cards
- Keyword matching in URLs for variant detection
- Guard against double execution (check existing elements)
- setTimeout for DOM readiness

### Auto-Sync from /offers (GeoStay pattern)
- Fetch apartment data from /pl/offers and /ru/offers pages
- Parse DOM for offer cards, images, prices
- Inject into homepage with custom styling
- Eliminates manual content duplication

## Project Maturity Tiers

### Tier 1: Full Custom (1500+ CSS lines, custom JS, multiple pages)
Najmar, WawaBed, Willa Kapitanska, EcoCamping, Mazurski Chill, GeoStay, GoldenApartments

### Tier 2: Partial Custom (500-1500 CSS lines, specific sections)
SORS, CityApart, Willa Raclawicka, Madera

### Tier 3: Minimal Fixes (<500 CSS lines, no custom HTML)
Dobry Wiatr, PerfectApart

### Key Insight
Tier 1 projects take 10-14 sessions. Tier 2 take 3-5 sessions. Tier 3 take 1 session.
Most system traps are discovered in Tier 1 projects and then applied preventively to all subsequent builds.
