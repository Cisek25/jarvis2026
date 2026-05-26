---
name: CSS cascade race after multi-version patching
description: Po 5+ wersjach sprintu jedna reguła ma 4-5 duplikatów; cascade race — wygrywa później wprowadzona duplikatka (nie najnowszy fix).
type: feedback
originSessionId: 25c3c84c-4be9-4f6b-a50a-131306fde9b0
---
# CSS Cascade Race — Refactor After 5+ Version Sprint

## Rule
Po sprincie liczącym 5+ wersji (vX.X → vX.X+5) na tym samym selektorze, **MANDATORY refactor pass** zanim dodasz kolejny patch. Inaczej fix nowej wersji może NIE WYGRAĆ z duplikatami starszych iteracji.

**Why:** Fair Rentals v1.69 hamburger fix (2026-05-19/20). Selector `.navbar-toggler` miał:
- Line 286: `display: none` (desktop hide)
- Line 296: `min-height: 48px` (v1.5x mobile chip)
- Line 4138: `min-height: 48px` (v1.6x "force visible" override)
- Line 9175: `min-height: 40px` (v1.69 PATCH #1 — naszla, miała wygrać)
- Line 9352: `min-height: 40px` (v1.69 PATCH #2 — dla scrolled state)

LIVE custom.css miał DODATKOWO regułę na linii ~11365 z `min-height: 48px + padding: 12px 16px`
(stary kod nieczyszczony przy v1.69 deploy). Specificity równa wszystkim 0,2,3 →
last-in-file wins → linia 11365 wygrała → hamburger 57px wystawał z header 65px.

Bug 5-wersji sagi (Fair Rentals v1.58→v1.62 + v1.69 hamburger) — wszystko bo orphan rules nie były usuwane.

**How to apply:**
1. **Trigger**: sprint > 5 wersji na tym samym obszarze (np. hamburger, nav, hero) → wymuś refactor
2. **Detection** przed dodaniem nowej reguły:
   ```bash
   # Count duplicates of same selector + property
   grep -nE "<selector>" file.css | head -20
   # Jeśli >3 reguły match, refactor first
   ```
3. **MCP verification** który exact rule wygrywa:
   ```javascript
   // Iterate stylesheets + walk media rules + check matches()
   for (const sheet of document.styleSheets) {
     // ... see Fair Rentals v1.70 diagnosis script
     // Returns ordered list of matched rules with media + cssText
   }
   ```
4. **Refactor process**:
   - Lista wszystkich reguł matching selektor
   - Identifikuj which winning (last + highest specificity)
   - **Usuń orphan duplikaty** (z poprzednich wersji)
   - Zostaw 1-2 source of truth: jedna dla mobile (`@media max-width`), jedna dla desktop scrolled state
   - Add new fix
5. **Anti-pattern** (RED FLAG):
   - "Już 3× próbowałem dla tego elementu" → STOP, refactor
   - "Dodam jeszcze 1 warstwę z !important" → NIE, root cause = duplikat
   - "Specificity escalation" (chain class names: `.x.x.x`) → tylko ostatnia szansa, nie pierwsza próba

## Detection patterns
- `grep -c "<selector>" file.css` > 3 → warning
- Multi-version sprint na samej sekcji UI (np. nav, hero, footer)
- Klientka mówi "fix wraca po deploy" lub "u mnie nadal źle"
- Computed style ≠ source latest rule (mimo same specificity)

## Reference
- Fair Rentals v1.70 hamburger root cause: 5× `min-height: 48px !important` duplikaty
- Related: `feedback_orphan_css_rules_audit.md` (USUNIETE w komentarzu + orphan rules)
- Related: `feedback_iterative_debugging_discipline.md` (gdy bug wraca, diagnoza wrong)
- Workflow: po każdym sprincie >5 wersji, schedule "CSS refactor session" przed kolejnym fix
