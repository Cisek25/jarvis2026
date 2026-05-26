# Skill - idosell-memory-consolidate

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-memory-consolidate`

## Czym jest to narzędzie?

Monthly consolidation pamięci JARVIS: merge duplicate feedback files, prune stale notes, update MEMORY.md index, refresh client profiles. Wrapuje `anthropic-skills:consolidate-memory` z JARVIS-specific structure.

## Dlaczego to istnieje

Po 11+ projektach (Fair Rentals, RPA, Mountain Prestige, EcoCamping, Madera, Najmar, Mazurski Chill, Apartamenty Parkowe, etc.) pamięć JARVIS akumuluje:

- 18+ feedback files
- 9+ per-client profiles (`mazurski-chill.md`, `najmar.md`, etc.)
- 5+ cross-project patterns
- 2+ workflow procedures
- Old/superseded notes

**Bez porządków** → MEMORY.md fragmentated, agenci referencują stale info, duplikaty mylą Claude przy nowych projektach.

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-memory-consolidate
```

Lub naturalnie:

```
Konsoliduj pamięć JARVIS — ostatni piątek miesiąca.
```

## Kiedy uruchamiać

| Trigger | Frequency |
|---------|-----------|
| **Last Friday of month** | cron-like (recommended) |
| Manual | Po major project milestone (e.g., client signoff) |
| Auto-suggest | Gdy MEMORY.md > 30 entries |
| Manual | Duplicate feedback noticed during session |
| Manual | Path mismatch errors w agentach |

## 9-step workflow

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

Czytaj wszystkie `feedback_*.md` + similarly named files. Find:

- Same topic, different wording (e.g., 2 files o body_bottom limits)
- Superseded notes (newer feedback overrides older)
- Single-use notes dla resolved one-off issues

### Step 3: Merge candidates

Per cluster of related notes:

```markdown
## CLUSTER: body_bottom size + sanitizer
- feedback_idobooking_body_bottom_size_limit.md (62KB silent truncate)
- feedback_idobooking_body_top_inline_style_stripped.md (sanitizer)
- feedback_no_emoji_client_code.md (WAF rejection)

DECISION: keep as separate (3 different mechanisms, każdy well-scoped)
```

LUB:

```markdown
## CLUSTER: language selector behavior
- feedback_idobooking_mobile_widget_in_navbar.md (#navbar display:none)
- feedback_system_button_text_i18n.md (Menu translation)
- feedback_element_invisible_debug_checklist.md (general)

DECISION: merge first two into feedback_idobooking_lang_selector.md
```

### Step 4: Update content

Per kept file:
- Remove deprecated sections (versions older than 3 months)
- Update "Last applied" date
- Add cross-references to related feedback
- Update "Reference" project list

### Step 5: Reorganize structure

**Goal**: single memory location z clear hierarchy.

```
/Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/
├── MEMORY.md              # Master index (auto-updated)
├── README.md              # Jak nawigować
├── traps/                 # System traps
├── clients/               # Per-client profiles (private)
├── patterns/              # Cross-project patterns
└── workflows/             # Process knowledge
```

### Step 6: Update MEMORY.md index

Auto-generated format:

```markdown
# JARVIS Memory Index — Updated 2026-05-20

## Quick reference
- Total feedbacks: 18
- Active clients: 9
- Patterns: 5
- Last consolidation: 2026-05-20

## Traps (system-level)
- [body_bottom 62KB limit](traps/body_bottom_62kb_limit.md) — silent truncate >62KB
- [body_top inline style stripped](traps/body_top_inline_style_stripped.md) — sanitizer wycina
- ...

## Active clients
- [Fair Rentals](clients/fairrentals.md) — v1.69 deployed
- [RPA](clients/rpa.md) — v2.0 deployed
- ...
```

### Step 7: Archive stale notes

Notes >6 months stare + not referenced by any active client:
- Move to `archive/` folder
- Keep accessible ale nie w main index

### Step 8: Generate report

`claudedocs/MEMORY_CONSOLIDATE_<date>.md`:

```markdown
# Memory Consolidation — 2026-05-20

## Before
- Old path: 10 files, 45 KB
- New path: 19 files, 82 KB
- Total: 29 files, 127 KB
- MEMORY.md index: 18 entries

## Changes
- Merged 2 files (lang selector behavior)
- Archived 3 stale notes (>6 months, unused)
- Renamed 5 files (clear taxonomy)
- Moved old path → new path (reorganization)

## After
- Single path: 24 files, 108 KB (-15%)
- MEMORY.md index: 15 entries (clearer)
- Structure: traps/ + clients/ + patterns/ + workflows/

## Updated references
- idosell-project-manager.md: updated 3 paths
- idosell-webdev.md: updated 5 paths
- idosell-website-builder.md: updated index reference
```

### Step 9: Validate

Po consolidacji:
- Run `idosell-project-manager` (read MEMORY.md → no errors)
- Run `idosell-webdev` (load context → no broken refs)
- Verify wszystkie `feedback_*.md` paths w agentach resolve

## Naming convention

### Prefix-based taxonomy

| Prefix | Co to | Lokalizacja | Przykład |
|--------|-------|-------------|----------|
| `feedback_*` | System traps i lessons learned | `traps/` (po reorg) | `feedback_idobooking_body_bottom_size_limit.md` |
| `client_*` | Per-client profile (private) | `clients/` | `client_fairrentals.md` |
| `pattern_*` | Cross-project architectural patterns | `patterns/` | `pattern_apartment_rental_baseline.md` |
| `workflow_*` | Process procedures | `workflows/` | `workflow_new_client_kickoff.md` |
| `archive_*` | Stale notes (>6 months unused) | `archive/` | `archive_feedback_old_litepicker.md` |

### Co w każdej kategorii

| Kategoria | Zawiera | Przykłady |
|-----------|---------|-----------|
| **feedback_*** | System traps IdoSell/IdoBooking + debug lessons | 62KB body_bottom truncate, sanitizer style strip, specificity wars, mobile traps |
| **client_*** | Per-klient memory (kronika sesji, traps, status) — **PRIVATE** | Filled brief, deploy history, znane issues, kontakt operatora |
| **pattern_*** | Cross-project knowledge (re-usable architectures) | Apartment rental CSS baseline, camping site layout, business apartments FAQ |
| **workflow_*** | Step-by-step procedures | New client kickoff (6 faz), deploy procedure, escalation runbook |
| **archive_*** | Old/superseded notes | Old Litepicker fix (pre-v1.5), deprecated header pattern |

## Przykład: konsolidacja w praktyce

### Before (May 2026)

```
~/.claude/projects/-Users-user-Desktop-jarvis/memory/
├── MEMORY.md (28 entries)
├── feedback_absolute_paths_vsc.md
├── feedback_client_edit_instruction.md
├── feedback_element_invisible_debug_checklist.md
├── feedback_idobooking_body_bottom_size_limit.md
├── feedback_idobooking_body_top_inline_style_stripped.md
├── feedback_idobooking_litepicker_static_centering.md
├── feedback_idobooking_map_location_mismatch.md
├── feedback_idobooking_mobile_search_first.md
├── feedback_idobooking_mobile_widget_in_navbar.md
├── feedback_idobooking_specificity_war.md
├── feedback_iterative_debugging_discipline.md
├── feedback_no_emoji_client_code.md
├── feedback_orphan_css_rules_audit.md
├── feedback_powered_by_idobooking_visible.md
├── feedback_preserve_client_css_block.md
├── feedback_responsive_handler_viewport_guard.md
├── feedback_system_button_text_i18n.md
├── client_ecocamping.md
├── client_fairrentals.md
├── client_mazurski_chill.md
├── client_mountain_prestige.md
├── client_najmar.md
├── client_piekary13.md
├── client_river_premium_apartments.md
├── client_sors.md
├── client_wca.md
├── pattern_baseline_v2.md
├── pattern_cross_project.md
├── pattern_idobooking_overview.md
└── pattern_idosell_clients_db.md
```

### After (po consolidate)

```
~/.claude/projects/-Users-user-Desktop-jarvis/memory/
├── MEMORY.md (20 entries — cleaner)
├── README.md
├── traps/
│   ├── body_bottom_62kb_limit.md
│   ├── body_top_inline_style_stripped.md
│   ├── element_invisible_debug.md
│   ├── lang_selector_behavior.md  (← merged 2 files)
│   ├── litepicker_static_centering.md
│   ├── map_location_mismatch.md
│   ├── mobile_search_first.md
│   ├── no_emoji_in_client_code.md
│   ├── orphan_css_rules_audit.md
│   ├── powered_by_visible.md
│   ├── preserve_client_css_block.md
│   ├── responsive_handler_viewport_guard.md
│   ├── specificity_war.md
│   └── system_button_text_i18n.md
├── clients/         # private — 9 plików
├── patterns/        # 4 cross-project
└── workflows/       # 2 procedures
```

Změny: 30 plików → 28 plików, MEMORY.md 28 → 20 entries, jasna taxonomy (traps/clients/patterns/workflows).

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| Consolidation report | `claudedocs/MEMORY_CONSOLIDATE_<date>.md` | Markdown z before/after |
| Updated MEMORY.md | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md` | Auto-regenerated index |
| Reorganized files | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/{traps,clients,patterns,workflows}/` | Moved/renamed |
| Archive | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/archive/` | Old notes |
| Updated agent paths | `~/.claude/agents/idosell-*.md` | Path refs refreshed |

## Powiązane skille

- **Uses**: `anthropic-skills:consolidate-memory` (base reflection logic)
- **Updates**: `idosell-project-manager.md`, `idosell-webdev.md` paths
- **Outputs**: `claudedocs/MEMORY_CONSOLIDATE_<date>.md`
- **Touches**: wszystkie `/Users/user/.claude/projects/*/memory/` files

## Wymagania

- Dostęp do `/Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/`
- Dostęp do `/Users/user/.claude/agents/` (do path updates)
- Backup recommended przed consolidacją (git commit / archive folder)

## Success metric

Po consolidate:

| Metryka | Cel |
|---------|-----|
| Index entries | ≤25 (manageable) |
| Broken cross-references | 0 |
| Active clients z updated profile | 100% |
| Stale notes archived | Wszystkie >6 months unused |
| Path consistency między agentami i files | 100% |

## Anti-patterns

| Anti-pattern | Lepiej |
|--------------|--------|
| Bez consolidacji 6+ months | Monthly cadence (last Friday) |
| Manual cleanup bez plan | Structured 9-step workflow |
| Delete = data loss | Move to archive/ (recoverable) |
| Tylko rename bez update agent paths | Skill aktualizuje agent references też |
| Duplikaty zostają | Find + merge clusters przed kept-files |
