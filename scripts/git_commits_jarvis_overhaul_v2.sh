#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# JARVIS OVERHAUL — Git commits v2 (FIXED)
# Generated: 2026-05-25 po nieudanym v1
#
# v1 błąd: zakładał 376 pre-existing staged additions + użył
# `git commit --only` bez uprzedniego `git add`. Twój repo
# był czystszy niż sandbox pokazywał — tylko 3 modyfikacje.
#
# v2 fix: prosty `git add` + `git commit` per grupa zmian.
# Założenie: commit 1 (cleanup screenshots) już się udał z v1
# (commit 629e00b "chore(cleanup): remove 83 debug screenshots").
# Ten skrypt commituje pozostałe.
# ═══════════════════════════════════════════════════════════════

set -e
cd /Users/user/Desktop/jarvis

echo "==> Pre-flight"
git log --oneline -3
echo ""

# HOUR 1 — Templates
echo "==> Commit: BRIEF + vibe-presets"
git add templates/BRIEF_NEW_CLIENT.md library/templates/vibe-presets.json
git commit -m "feat(templates): BRIEF_NEW_CLIENT.md + vibe-presets.json (20 vibes)

JARVIS Overhaul Tasks 3+4.
- templates/BRIEF_NEW_CLIENT.md (150 lines): REQUIRED + OPTIONAL + AUTO-FILL
- library/templates/vibe-presets.json (890 lines, 20 vibes): palette + darkmode_palette + fonts + recommended_variants per vibe"

# HOUR 2 + 3 — Big CSS layers
echo "==> Commit: 5 new CSS layers"
git add library/css/layer4-variety-patterns.css \
        library/css/layer5-color-systems.css \
        library/css/layer6-typography-systems.css \
        library/css/layer7-interactions.css \
        library/css/layer8-dividers-patterns.css
git commit -m "feat(library): 5 new CSS layers (~10,000 lines)

JARVIS Overhaul Tasks 5-9.
- layer4-variety-patterns.css (4839 lines): 70 section variants (Hero x10, About x8, Gallery x8, CTA x8, Features x6, Testimonials x6, Location x5, FAQ x4, Nav x8, Footer x7)
- layer5-color-systems.css (1599 lines): 20 vibes color tokens + dark mode (auto + manual + force) = 60 blocks
- layer6-typography-systems.css (1908 lines): 20 vibes typography + Google Fonts @imports + clamp scale
- layer7-interactions.css (715 lines): hover x8, scroll reveals x5, modal anim x4, loading x3, form validation x3
- layer8-dividers-patterns.css (992 lines): SVG dividers + patterns + textures + vibe accents (133 selectors)"

# JS modules
echo "==> Commit: 4 new JS modules"
git add library/js/ido-brand-neutral.js \
        library/js/ido-feature-detection.js \
        library/js/ido-scroll-reveal.js \
        library/js/ido-lightbox.js
git commit -m "feat(library): 4 new JS modules

JARVIS Overhaul Tasks 14-16.
- ido-brand-neutral.js (103 lines): broker multi-property template with {{XX_PREFIX}}, {{PORTFOLIO_DOMAIN}}, {{BRAND_NAME}} placeholders
- ido-feature-detection.js (69 lines): window.idoFeatures probes per page type
- ido-scroll-reveal.js (84 lines): IntersectionObserver + stagger + prefers-reduced-motion
- ido-lightbox.js (156 lines): universal click-zoom + swipe + keyboard nav"

# HOUR 4 — CLAUDE.md + playbook + script + archive
echo "==> Commit: CLAUDE.md v4.0 + playbook + sharepoint archive"
git add CLAUDE.md \
        docs/archive/CLAUDE.md.v3.17-backup-2026-05-25 \
        docs/playbook/NEW_CLIENT_QUICKSTART.md \
        scripts/git_commits_jarvis_overhaul.sh \
        scripts/git_commits_jarvis_overhaul_v2.sh \
        archive/sharepoint_export_2026-05-25/
git commit -m "docs: CLAUDE.md v4.0 rewrite + playbook + sharepoint archive

JARVIS Overhaul Tasks 17-25.
- CLAUDE.md v4.0 (977 lines, was 215 v3.17): full playbook with sections 0-10 + TOC + memory cross-refs. Sections 0-3 + 7-10 complete; sections 4-6 contain TOP 10 traps + TOP 10 instincts + TOP 8 lessons inline (full 63+35+26 deferred to v4.1).
- docs/archive/CLAUDE.md.v3.17-backup-2026-05-25 (215 lines): backup pre-overhaul
- docs/playbook/NEW_CLIENT_QUICKSTART.md (270 lines): narrative companion 7-step workflow
- scripts/git_commits_jarvis_overhaul.sh: original commit script (v1 broken — assumed pre-staged additions)
- scripts/git_commits_jarvis_overhaul_v2.sh: this fixed script
- archive/sharepoint_export_2026-05-25/: archived sharepoint_export (51 files, 616K) from May 20 sync"

# Tag
echo "==> Tag jarvis-overhaul-2026-05-25"
git tag jarvis-overhaul-2026-05-25 -m "JARVIS Overhaul v4.0: 10-layer library, 20 vibes, BRIEF template, CLAUDE.md encyclopedia"

echo ""
echo "==> DONE. Final log:"
git log --oneline -10
echo ""
echo "==> Untracked po commitach (Twoja decyzja co zrobic):"
git status --short | grep '^??' | head -20
echo ""
echo "==> Modyfikacje innych klientow (UNTOUCHED przez ten script):"
git status --short | grep -v '^??' | head -10
echo ""
echo "Push do remote? Uruchom recznie:"
echo "  git push origin main && git push --tags"
