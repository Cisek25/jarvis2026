#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# JARVIS OVERHAUL — Git commits script
# Generated: 2026-05-25 (session blocked by sandbox from running git)
#
# Usage:
#   1. Review the repo state first:
#        cd /Users/user/Desktop/jarvis
#        git status --short | head -20
#        git log --oneline -5
#   2. Run individual commits below or whole script:
#        bash scripts/git_commits_jarvis_overhaul.sh
#   3. Each commit uses targeted --only with explicit paths.
#      Pre-existing 376 staged additions remain UNTOUCHED.
#
# Background context:
# - Repo has 466 pre-existing pending changes (376 staged adds, 16 AD, 5 AM)
#   from previous unfinished sessions. User decision: leave them in staging.
# - Plan's "git add -A" approach would bundle unrelated work — NOT used.
# - Each commit below stages ONLY the files for that specific JARVIS overhaul task.
# - piekary13/DO_WKLEJENIA/* deletions in staging (AD) are PRE-EXISTING, not JARVIS overhaul.
# ═══════════════════════════════════════════════════════════════

set -e
cd /Users/user/Desktop/jarvis

echo "==> Pre-flight check"
git --version
git status --short | head -3
echo ""

# ───────────────────────────────────────────────────────────────
# HOUR 1
# ───────────────────────────────────────────────────────────────

echo "==> Commit 1: cleanup screenshots + archive sharepoint_export"
git add archive/sharepoint_export_2026-05-25/
git commit --only \
  archive/sharepoint_export_2026-05-25 \
  "clients/PerfectApart/Zrzut ekranu 2026-03-27 o 10.02.09.png" \
  "clients/najmar/645743262_1414543097382912_5573200428426224516_n.jpg" \
  -m "chore(cleanup): remove 83 debug screenshots + archive sharepoint_export

- Delete 58 root-level MCP debug screenshots (mc-*, bydgoszcz-*, sa-*, ap-blik-*, v6-v13-*, offer10-*, mobile-*)
- Delete 20 .tmp_brief/*.png debug screenshots (preserve .py scripts + sa_*_LIVE extracts)
- Delete 5 client-folder leftover images
- Move sharepoint_export/ (616K, 51 files) to archive/sharepoint_export_2026-05-25/

NOTE: 78 root screenshots + 20 .tmp_brief screenshots were untracked,
so they don't appear in this commit — only the 2 staged client deletes
and the sharepoint_export move are tracked here.

JARVIS Overhaul Plan Task 1+2."

echo "==> Commit 2: BRIEF_NEW_CLIENT template"
git commit --only \
  templates/BRIEF_NEW_CLIENT.md \
  -m "feat(templates): add BRIEF_NEW_CLIENT.md — structured intake form

150-line markdown brief with REQUIRED (engine ID, prefix, default13,
fullpage.js, language, sections) + OPTIONAL (vibe, palette, fonts,
inspirations, features) + AUTO-FILL (JARVIS fills empty fields).

20 vibes table for client to pick from.
JARVIS Overhaul Plan Task 3."
# If commit fails because path not staged: git add templates/BRIEF_NEW_CLIENT.md && retry above

echo "==> Commit 3: vibe-presets.json (20 vibes)"
git add library/templates/vibe-presets.json
git commit --only \
  library/templates/vibe-presets.json \
  -m "feat(library): add vibe-presets.json — 20 design vibes with palettes/fonts/variants

890-line JSON. Each vibe has:
- palette (10 named colors: primary/secondary/cream/bg/text/text-soft/text-muted + variants)
- darkmode_palette (6 colors for layer10 dark mode)
- fonts (heading + body + google_import URL)
- recommended_variants (per-section variant picks: hero, about, gallery, cta, features, testimonials, footer, nav)
- layout_signature, interactions, dividers
- target_examples (which JARVIS clients use this vibe)

Vibes: luxury-heritage, modern-minimal, rustic-warm, modern-coastal,
urban-bold, wellness-calm, heritage-warm, family-friendly, boutique-romantic,
scandi-clean, mountain-rugged, mediterranean-villa, art-deco-vintage,
eco-glamping, business-corporate, winter-alpine, asian-zen, industrial-loft,
garden-cottage, tropical-resort.

JARVIS Overhaul Plan Task 4."

# ───────────────────────────────────────────────────────────────
# HOUR 2 — Big CSS layers (written by background subagents)
# ───────────────────────────────────────────────────────────────

echo "==> Commit 4: layer5 — color systems for 20 vibes"
git add library/css/layer5-color-systems.css
git commit --only \
  library/css/layer5-color-systems.css \
  -m "feat(library): layer5-color-systems.css — color tokens for 20 vibes (~3500 lines)

Per-vibe [data-vibe=\"X\"] blocks defining --xx-* CSS variables:
- primary/secondary (4 shades each)
- cream/cream2/cream3 tonal range
- text/text-soft/text-muted
- shadow-sm/md/lg
- gradient-primary/accent
- radius/radius-lg/ease

Auto-dark via @media (prefers-color-scheme: dark) +
manual-dark via [data-mode=\"dark\"] / .force-dark.

JARVIS Overhaul Plan Task 5."

echo "==> Commit 5: layer6 — typography systems"
git add library/css/layer6-typography-systems.css
git commit --only \
  library/css/layer6-typography-systems.css \
  -m "feat(library): layer6-typography-systems.css — type system per vibe (~1500 lines)

Google Fonts @imports + per-vibe [data-vibe=\"X\"] blocks:
- --xx-font-heading, --xx-font-body, --xx-font-display
- h1-h4 with clamp() scale
- p, xx-lead, xx-caption, xx-eyebrow, xx-drop-cap
- letter-spacing + line-height tokens

Vibe-tuned sizes (luxury 36-64px H1, modern-minimal 44-80px H1,
business-corporate 32-52px H1, etc).

JARVIS Overhaul Plan Task 6."

echo "==> Commit 6: layer4 — variety patterns (70 variants)"
git add library/css/layer4-variety-patterns.css
git commit --only \
  library/css/layer4-variety-patterns.css \
  -m "feat(library): layer4-variety-patterns.css — 70 section variants (~4000 lines)

Modular .xx-<section>--<variant> blocks for 9 section types:
- Hero (10): asymmetric-grid, full-bleed-image, split-half, centered-typography, overlap-image, video-bg, parallax-scroll, slider-multi, mosaic-collage, minimal-text
- About (8): asym-text-img, split-half, full-width-quote, timeline-vertical, stat-row-cards, image-mosaic-text, story-narrative, founder-portrait-quote
- Gallery (8): asym-mosaic, masonry, slider-fullscreen, grid-equal, polaroid-stack, isotope-filter, lightbox-thumbs, carousel-3-cards
- CTA (8): dark-bold, gradient, full-bleed-image-overlay, minimal-text, side-image, sticky-bottom-bar, countdown-timer, multi-button-row
- Features (6): icon-grid-4col, text-list-numbered, alternating-rows, comparison-table, cards-pop-hover, accordion-vertical
- Testimonials (6): slider-fullwidth, grid-3col, single-quote-big, video-grid, masonry-mixed, carousel-photos
- Location (5): full-bleed-map, split-text-map, info-cards-map, dual-location-tabs, interactive-points
- FAQ (4): accordion-classic, two-column-grid, sidebar-search, tabs-categorized
- Navigation (8): transparent-overlay, solid, megamenu, side-drawer, scroll-spy, hamburger-only, sticky-compact, pill-tabs
- Footer (7): minimal, compact, dark-rich, image-bg, multi-column, centered, social-focus

BEM naming: .xx-<section>__<element>. References layer5/6 variables.
JARVIS picks 1 variant per section per client from vibe-presets.json.

JARVIS Overhaul Plan Task 7."

# ───────────────────────────────────────────────────────────────
# HOUR 3
# ───────────────────────────────────────────────────────────────

echo "==> Commit 7: layer7 — interactions"
git add library/css/layer7-interactions.css
git commit --only \
  library/css/layer7-interactions.css \
  -m "feat(library): layer7-interactions.css — hover/reveal/modal/loading (~800 lines)

- Hover effects (8): scale, glow, slide-underline, lift, color-shift, rotate-3d, brightness-pop, border-grow
- Scroll reveals (5): fade, slide-left, zoom, stagger, parallax
- Modal animations (4): fade-in, slide-up, slide-right, scale-bounce
- Loading states (3): skeleton-pulse, spinner, dot-loader
- Form validation visuals (3): valid, error, error-msg

JARVIS Overhaul Plan Task 8."

echo "==> Commit 8: layer8 — dividers + patterns + textures"
git add library/css/layer8-dividers-patterns.css
git commit --only \
  library/css/layer8-dividers-patterns.css \
  -m "feat(library): layer8-dividers-patterns.css — visual accents (~1000 lines)

- Curved dividers (5): SVG-based shape masks
- Wave dividers (5): soft, double, sharp, organic, thin
- Geometric patterns (5): dots, lines, triangles, hexagon, diamond
- Organic shapes (5): soft blob, spike blob, etc.
- Texture overlays (5): paper, fabric, grunge, noise, watercolor
- Vibe-specific accents (luxury gold leaf, art-deco sunburst, mountain topo)

All SVG inline, no external assets.
JARVIS Overhaul Plan Task 9."

echo "==> Commit 9: layer10 — dark mode for 20 vibes"
git add library/css/layer10-darkmode.css
git commit --only \
  library/css/layer10-darkmode.css \
  -m "feat(library): layer10-darkmode.css — dark mode variants for all 20 vibes (~1800 lines)

Three activation modes per vibe:
1. Auto: @media (prefers-color-scheme: dark)
2. Toggle: [data-mode=\"dark\"]
3. Always: .force-dark

Plus dark-mode utilities (img brightness, iframe filter).
Variables overridden match layer5 schema using darkmode_palette from vibe-presets.json.

JARVIS Overhaul Plan Task 10."

echo "==> Commit 10: layer1-traps expanded (47 -> 63 traps)"
git add library/css/layer1-traps.css
git commit --only \
  library/css/layer1-traps.css \
  -m "feat(library): layer1-traps.css — expand 47 to 63 system traps

Added 8 new traps from 2026-05-25 auto-memory:
- Ken Burns zoom (default13 hero slick)
- object-fit cover + 100vh anti-responsive
- HTML entities in offer.description
- aspect-ratio + min-height = WIDTH overflow
- default13 baseline selectors (3 must be matched)
- Live paste verification via computed style
- Text change cross-file grep
- Minimal patch preference

Added 8 from Piekary v3.0-v3.17 session:
- Global header position relative kills sticky stack
- Sticky tabs --fixed BEM modifier scroll
- Slick cloned slides break featured offers order
- /tabs__item div+span not anchor
- /offer/N container-hotspot duplicates
- Apart-torun.pl shared engine multi-property
- Logo not clickable per-client
- Powered by visibility v4 (filter:none + 240x56)

JARVIS Overhaul Plan Task 11."

echo "==> Commit 11: layer2-components expanded"
git add library/css/layer2-components.css
git commit --only \
  library/css/layer2-components.css \
  -m "feat(library): layer2-components.css — ~30 new component variants

Navbar (4): transparent, solid, compact, mega
Footer (6): minimal, compact, dark-rich, image-bg, multi-column, centered
Buttons (6): primary, secondary, ghost, link, danger, icon-only
Forms (5): standard, inline, search, contact-rich, booking
Modals (5): centered, slide-up, sidebar, fullscreen, bottom-sheet
Cards (6): plain, elevated, bordered, image-top, image-side, glass
Counters (4): big-number, animated, ring, bar
Timeline (3): vertical, horizontal, stepper

JARVIS Overhaul Plan Task 12."

echo "==> Commit 12: layer3-offer-page expanded"
git add library/css/layer3-offer-page-base.css
git commit --only \
  library/css/layer3-offer-page-base.css \
  -m "feat(library): layer3-offer-page-base.css — 16 new variants

Booking form (4): standard, sticky-side, modal-trigger, inline-pricing
Price display (4): chip, circle, pill, banner
Gallery (4): carousel, grid, masonry, fullscreen
Amenities (4): icon-grid, list-checked, accordion, table

JARVIS Overhaul Plan Task 13."

echo "==> Commit 13: ido-brand-neutral.js"
git add library/js/ido-brand-neutral.js
git commit --only \
  library/js/ido-brand-neutral.js \
  -m "feat(library): ido-brand-neutral.js — broker multi-property mode template

initOfferPageBranding() with {{XX_PREFIX}}, {{PORTFOLIO_DOMAIN}},
{{BRAND_NAME}}, {{BRAND_SUBTITLE}} placeholders.

3 behaviors on /offer/N pages:
1. Replace nav menu with portfolio-domain links
2. Insert brand banner below header
3. Kill hotspot duplicates (system + custom collision)

Extracted from Piekary13 KONIEC_BODY pattern.
JARVIS Overhaul Plan Task 14."

echo "==> Commit 14: ido-feature-detection.js"
git add library/js/ido-feature-detection.js
git commit --only \
  library/js/ido-feature-detection.js \
  -m "feat(library): ido-feature-detection.js — window.idoFeatures probes

Detects per page: isHome, isOfferDetail, isOffersList, isTxt, isContact,
hasDefault13, hasFullpageJs, hasSlick, hasLitepicker, hasHotspot,
hasBookForm, pageId, offerId, language, viewport sizes.

debug=1 URL param enables console.log.
JARVIS Overhaul Plan Task 15."

echo "==> Commit 15: ido-scroll-reveal + ido-lightbox"
git add library/js/ido-scroll-reveal.js library/js/ido-lightbox.js
git commit --only \
  library/js/ido-scroll-reveal.js \
  library/js/ido-lightbox.js \
  -m "feat(library): ido-scroll-reveal.js + ido-lightbox.js modules

scroll-reveal: IntersectionObserver pattern, activates .xx-reveal -> .xx-in
lightbox: universal click-to-zoom for galleries, ESC + overlay close

JARVIS Overhaul Plan Task 16."

# ───────────────────────────────────────────────────────────────
# HOUR 4 — CLAUDE.md rewrite
# ───────────────────────────────────────────────────────────────

echo "==> Commit 16: backup current CLAUDE.md"
git add docs/archive/CLAUDE.md.v3.17-backup-2026-05-25
git commit --only \
  docs/archive/CLAUDE.md.v3.17-backup-2026-05-25 \
  -m "docs(archive): backup CLAUDE.md v3.17 before overhaul rewrite

JARVIS Overhaul Plan Task 17."

echo "==> Commit 17-21: CLAUDE.md rewrite (one big commit or split per section)"
git add CLAUDE.md
git commit --only \
  CLAUDE.md \
  -m "docs(claude.md): full encyclopedia rewrite v4.0 (~2700 lines)

Replaces v3.17 with comprehensive playbook. Sections:
- §0 TLDR + workflow overview (5min read)
- §1 Project Overview
- §2 Workflow 6 Phase (Brief -> Recon -> CSS -> JS -> HTML -> Verify -> Delivery)
- §3 Baseline — what every client gets
- §4 ALL 63 traps inline (with code examples + evidence refs)
- §5 ALL 35 instincts inline
- §6 ALL 26 lessons inline
- §7 Variety Guidelines + 20 vibes mapping
- §8 Deployment Checklist
- §9 Post-deploy Iterations Playbook
- §10 Emergency Debugging Trigger-driven

Auto-loaded by Claude every session = JARVIS knows everything from message 1.

JARVIS Overhaul Plan Task 18-24."

echo "==> Commit 22: NEW_CLIENT_QUICKSTART playbook"
git add docs/playbook/NEW_CLIENT_QUICKSTART.md
git commit --only \
  docs/playbook/NEW_CLIENT_QUICKSTART.md \
  -m "docs(playbook): NEW_CLIENT_QUICKSTART.md — narrative companion

7-step narrative for human operator: brief -> trigger -> JARVIS works ->
delivery -> client pastes -> live verify -> iterations.

Companion to CLAUDE.md §2 (which is rigid checklist).
JARVIS Overhaul Plan Task 25."

# ───────────────────────────────────────────────────────────────
# Tag final state
# ───────────────────────────────────────────────────────────────

echo "==> Tag: jarvis-overhaul-2026-05-25"
git tag jarvis-overhaul-2026-05-25 -m "JARVIS Overhaul complete: 10-layer library + brief template + CLAUDE.md encyclopedia"

echo ""
echo "==> All commits done. Final log:"
git log --oneline -25
echo ""
echo "==> Pre-existing pending state (UNTOUCHED, for your review):"
git status --short | awk '{print $1}' | sort | uniq -c | sort -rn
echo ""
echo "DONE. Push to remote if ready: git push origin main && git push --tags"
