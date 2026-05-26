# IdoSell Memory Consolidate Skill

## Description
Monthly consolidation of JARVIS memory: merge duplicate feedback files, prune stale notes, update MEMORY.md index, refresh client profiles. Wraps `anthropic-skills:consolidate-memory` z JARVIS-specific structure.

## Trigger
- Last Friday of month (cron-like)
- Manual: "consolidate memory", "porządki w pamięci"
- After major project milestone (e.g., client signoff)
- When MEMORY.md > 30 lines (index getting unwieldy)
- `/idosell-memory-consolidate` slash command

## Why this exists

After 5+ projects (FairRentals, RPA, Mountain Prestige, EcoCamping, Madera, Najmar, Mazurski Chill), memory accumulates:
- 18+ feedback files
- Per-client profiles (`mazurski-chill.md`, `najmar.md`, etc.)
- Cross-project patterns
- Old/superseded notes

Bez porządków → MEMORY.md fragmentated, agents reference stale info.

## Two memory bases (legacy structure)

```
/Users/user/.claude/projects/-Users-user/memory/           # OLD (referenced by agents)
├── idosell-clients-db.md
├── idosell-websites.md
├── idobooking-project.md
├── <klient>.md per active project

/Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/  # NEW (this session-created)
├── MEMORY.md (index)
├── feedback_*.md (18 files)
```

**Long-term goal**: consolidate into ONE location. See Step 5.

## Workflow

### Step 1: Inventory
```bash
echo "=== OLD memory ==="
ls -la /Users/user/.claude/projects/-Users-user/memory/
echo ""
echo "=== NEW memory ==="
ls -la /Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/
echo ""
echo "=== File sizes (potential duplicates) ==="
find /Users/user/.claude/projects -name "*.md" -exec wc -l {} \; | sort -rn | head -20
```

### Step 2: Identify duplicates
Read all `feedback_*.md` + similarly named files. Find:
- Same topic, different wording (e.g., 2 files about body_bottom limits)
- Superseded notes (newer feedback overrides older)
- Single-use notes for resolved one-off issues

### Step 3: Merge candidates

For each cluster of related notes:
```markdown
## CLUSTER: body_bottom size + sanitizer
- feedback_idobooking_body_bottom_size_limit.md (62KB silent truncate)
- feedback_idobooking_body_top_inline_style_stripped.md (sanitizer)
- feedback_no_emoji_client_code.md (WAF rejection)

DECISION: keep as separate (3 different mechanisms, each well-scoped)
```

OR:

```markdown
## CLUSTER: language selector behavior
- feedback_idobooking_mobile_widget_in_navbar.md (#navbar display:none)
- feedback_system_button_text_i18n.md (Menu translation)
- feedback_element_invisible_debug_checklist.md (general)

DECISION: merge first two into feedback_idobooking_lang_selector.md
```

### Step 4: Update content
For each kept file:
- Remove deprecated sections (versions older than 3 months)
- Update "Last applied" date
- Add cross-references to related feedback
- Update "Reference" project list

### Step 5: Reorganize structure

**Goal**: single memory location with clear hierarchy:
```
/Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/
├── MEMORY.md                          # Master index (auto-updated)
├── README.md                          # How to navigate this memory
├── traps/                             # IdoSell/IdoBooking system traps
│   ├── body_bottom_62kb_limit.md
│   ├── body_top_inline_style_stripped.md
│   ├── litepicker_static_centering.md
│   └── ... (18+ feedback files moved here)
├── clients/                           # Per-client profiles
│   ├── fairrentals.md
│   ├── rpa.md
│   ├── mountain-prestige.md
│   └── ...
├── patterns/                          # Cross-project patterns
│   ├── apartment-rental-baseline.md
│   ├── camping-baseline.md
│   └── ...
└── workflows/                         # Process knowledge
    ├── new-client-recon.md
    ├── delivery-checklist.md
    └── escalation-runbook.md
```

Migrate old `/Users/user/.claude/projects/-Users-user/memory/` files into new structure.

Update `idosell-project-manager` agent to reference new paths.

### Step 6: Update MEMORY.md index
Auto-generated index format:
```markdown
# JARVIS Memory Index — Updated <date>

## Quick reference
- Total feedbacks: N
- Active clients: M
- Patterns: P
- Last consolidation: <date>

## Traps (system-level)
- [body_bottom 62KB limit](traps/body_bottom_62kb_limit.md) — silent truncate >62KB
- [body_top inline style stripped](traps/body_top_inline_style_stripped.md) — sanitizer wycina
- ...

## Active clients
- [Fair Rentals](clients/fairrentals.md) — v1.69 deployed
- [RPA](clients/rpa.md) — v2.0 deployed
- ...

## Patterns
- [Apartment rental baseline](patterns/apartment-rental-baseline.md) — header, hero, search, cards
- ...

## Recent additions
- 2026-05-19: feedback_idobooking_body_top_inline_style_stripped.md
- 2026-05-19: feedback_orphan_css_rules_audit.md
- ...
```

### Step 7: Archive stale notes
Notes >6 months old + not referenced by any active client:
- Move to `archive/` folder
- Keep accessible but not in main index

### Step 8: Generate report

`claudedocs/MEMORY_CONSOLIDATE_<date>.md`:

```markdown
# Memory Consolidation — <date>

## Before
- Old path: 10 files, X KB
- New path: 19 files, Y KB
- Total: 29 files, Z KB
- MEMORY.md index: 18 entries

## Changes
- Merged 2 files (lang selector behavior)
- Archived 3 stale notes (>6 months, unused)
- Renamed 5 files (clear taxonomy)
- Moved old path → new path (reorganization)

## After
- Single path: 24 files, W KB (-15%)
- MEMORY.md index: 15 entries (clearer)
- Structure: traps/ + clients/ + patterns/ + workflows/

## Updated references
- idosell-project-manager.md: updated 3 paths
- idosell-webdev.md: updated 5 paths
- idosell-website-builder.md: updated index reference
```

### Step 9: Validate
After consolidation:
- Run `idosell-project-manager` (read MEMORY.md → no errors)
- Run `idosell-webdev` (load context → no broken refs)
- Verify all `feedback_*.md` paths in agents resolve

## Integration

- Uses: `anthropic-skills:consolidate-memory` (base reflection logic)
- Updates: `idosell-project-manager.md`, `idosell-webdev.md` paths
- Outputs: `claudedocs/MEMORY_CONSOLIDATE_<date>.md`
- Touches: all `/Users/user/.claude/projects/*/memory/` files

## Schedule

Run **last Friday of each month** OR after major milestone (client launch, big refactor).

Manual run if:
- MEMORY.md > 30 entries
- Duplicate feedback noticed during session
- Path mismatch errors

## Success metric

After consolidate:
- Index entries ≤25 (manageable)
- Zero broken cross-references
- All active clients have updated profile
- Stale notes archived
- Path consistency between agents and files
