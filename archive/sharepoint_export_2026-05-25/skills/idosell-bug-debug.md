# IdoSell Bug Debug Skill

## Description
Systematic debugging for IdoSell/IdoBooking client bug reports. Combines `superpowers:systematic-debugging` + `engineering:debug` with JARVIS-specific memory (18+ known traps) to skip 5-iteration sagas.

## Trigger
- Client report: "X nie działa", "Y wygląda źle", "po wkleju strona padła"
- PDF with uwagi (numbered points)
- Email z screenshotem z prośbą o naprawę
- `/idosell-bug-debug` slash command

## Why this exists (lesson learned)

Fair Rentals v1.58→v1.62 saga: 5 wersji żeby naprawić "mobile menu cycle flagi znikają" bo skupiłem się na WRONG element (wrap.visibility) zamiast root cause (orphan outside-click handler ustawiał #language_menu.display=none).

**Reference:** `feedback_iterative_debugging_discipline.md` — "Jeśli bug WRACA po fixie — diagnoza była WRONG, nie insufficient".

## Mandatory workflow

### Step 1: PROHIBIT ad-hoc fixing
**STOP** — nie pisz Edit'ów. Zaczynamy od diagnozy.

### Step 2: Read client report słowo po słowie
- Co dokładnie user napisał?
- Jaki UA, viewport, urządzenie?
- Screenshot — co konkretnie widać vs co powinno być?
- Powtórz user words: "Widzę: X. Spodziewam się: Y. Reprodukcja: Z."

### Step 3: Load JARVIS memory
```bash
cat ~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md
```
Czy w 18+ feedback files jest ten sam pattern? Common matches:
- Inline style w body_top → wycięte przez sanitizer
- Body_bottom > 62KB → silent truncate
- Mobile <select> w iPhone Safari → renderuje pusto
- `repeat(7, 1fr)` w gridzie → overflow gdy parent < 7×min-content
- `position: absolute + top: 50%` → spada gdy parent rośnie
- System klasa `.fr-header--scrolled` → różny height na sub-pages
- Cache CSS → user widzi stary po deploy

### Step 4: Live reprodukcja via MCP chrome-devtools
```
1. mcp__chrome-devtools__new_page (klient URL)
2. mcp__chrome-devtools__emulate (mobile/desktop wg user)
3. mcp__chrome-devtools__navigate_page (reload + ignoreCache=true)
4. mcp__chrome-devtools__evaluate_script (zmierz stan bugu)
5. mcp__chrome-devtools__take_screenshot (potwierdź visual)
```
**Pixel-perfect measurement**: top/bottom/left/right + width/height + computed styles.

### Step 5: Hypothesis chain
Wymień **3-5 hipotez** PRZED pisaniem fix:
```
H1: Sanitizer wyciął style="" → check live DOM
H2: Cache po stronie usera → check ?v= param
H3: Naszа reguła ma za niską specificity → grep CSS
H4: System CSS override → znajdź w live computed styles
H5: JS handler wyłącza element → grep + console listeners
```
Ranguj wg likelihood. Test NAJWYŻSZEJ pierwszej.

### Step 6: Binary search (jeśli > 1 hipoteza pasuje)
- Disable JS → bug nadal? → CSS issue
- Disable CSS rule by rule (DevTools) → która wymusza problem?
- Check responsive: 360px / 768px / 1280px → tylko 1 viewport?

### Step 7: Root cause confirmation
**Złota zasada:** zanim napiszesz Edit, MUSISZ POKAZAĆ w MCP:
- Aktualną wartość property
- Jak ją zmienisz (np. injection przez `evaluate_script`)
- Live test że zmiana naprawia (screenshot before/after)

### Step 8: Implement fix
- Edit dokładnie ten 1 selector / 1 line który MCP pokazał problem
- NIE dodawaj defensywności (MutationObserver, periodic check, timeout)
- Jeśli kusze cię "dla pewności jeszcze X" → STOP. Refactor inny issue.

### Step 9: Verify in MCP (po deploy)
- Hard refresh
- Run Step 5 measurements again
- Compare pixel measurements (before vs after)

### Step 10: Update JARVIS memory (jeśli nowy trap)
Jeśli ten bug **nie był** w MEMORY.md, dopisz:
```bash
# /Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_<short-name>.md
cat > <path> << 'EOF'
---
name: <short title>
description: <100-char summary trapu>
type: feedback
originSessionId: <session-id>
---
# Problem
<co user widzi, kontekst>
# Detection
<jak znaleźć, MCP commands>
# Fix
<exact CSS/JS change>
# Reference
<klient + wersja>
EOF
```
Plus dodaj 1-liner do `MEMORY.md` index.

## Anti-patterns (RED FLAGS — stop and re-investigate)

🚨 **"Dodam jeszcze 1 warstwę defensywności"** — diagnoza była ZŁA
🚨 **"Może timeout potrzebny dłuższy"** — nie. Sprawdź sync flow.
🚨 **"Może MutationObserver pomoże"** — pokazuje że nie wiesz co ustawia property
🚨 **"Może 5 selektorów z !important"** — find ONE which wins. Reszta to noise.
🚨 **"Już 3 razy próbowałem tej kategorii fixu"** — STOP. Re-investigate.

## Output template

`clients/<klient>/BUG_<data>_<short-name>.md`:

```markdown
# Bug: <title> — <klient> — <data>

## Client report
- User: <co napisał>
- UA/viewport: <iPhone Safari 18.0 / 390x844>
- Screenshot: <path>

## Reproduction
1. Open <URL>
2. Click <element>
3. Observe: <actual>
4. Expected: <should be>

## Hypothesis chain
- H1 (NAJWAŻNIEJSZA): <hypothesis>
  - Test: <MCP command>
  - Result: PASS/FAIL
- H2: ...

## Root cause
<exact selector + property + why>

## Fix
- File: <path>
- Line: <number>
- Change: <before → after>
- JARVIS memory ref: <feedback_*.md if applicable>

## Verification
- Pre-fix MCP measurement: <values>
- Post-fix MCP measurement: <values>
- Pixel diff: <X px>

## Lessons (if new trap)
- Added to: <path to new feedback_*.md>
- Updated MEMORY.md
```

## Integration

- Uses: `superpowers:systematic-debugging`, `engineering:debug`
- Calls into: MCP `chrome-devtools` for live verify
- Feeds into: `idosell-deploy-cr` (post-fix)
- Updates: `~/.claude/projects/-Users-user-Desktop-jarvis/memory/`

## Success metric

PRZED tym skillem: średnio 3.4 wersje na fix (z analizy historii FairRentals v1.49→v1.69 = 21 wersji na ~6 issues).

CEL po tym skillu: 1.5 wersji na fix. Twarda diagnoza + 1 celny edit + verify.
