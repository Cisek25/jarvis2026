# IdoSell E2E Test Skill

## Description
End-to-end testing for IdoSell/IdoBooking sites using MCP chrome-devtools or Playwright. Defines critical flows per client, runs them before/after deploy, catches regressions PRZED zgłoszeniem klientki.

## Trigger
- Before deploy (auto via `idosell-deploy-cr`)
- After deploy (regression check)
- New client launch (sign-off requirement)
- Monthly health check
- After IdoBooking system update
- `/idosell-e2e-test` slash command

## Critical flows per client type

### Apartment rental site (Fair Rentals, Mountain Prestige, etc.)
1. **Homepage → search → results**: open `/`, click "Sprawdź dostępność", select dates, click Search → land on /offers with filtered results
2. **Browse apartments**: click apartment card → detail page loads → photos visible → "Pokaż dostępność" works
3. **Mobile menu**: open hamburger → all menu items clickable → language change works → flag click triggers page reload with new lang
4. **Contact form**: navigate to /contact → fill form → submit → confirmation
5. **Booking flow**: detail page → "Rezerwacja online" → book-now popup → calendar dates → confirm → checkout page
6. **Language switcher**: click PL/EN/DE flag → URL changes (/, /en/, /de/) → content language matches
7. **Footer links**: Regulamin, Polityka prywatności → modal/page opens
8. **Powered by IdoBooking**: badge visible w stopce, klikalny

### Camping/glamping site (EcoCamping, etc.)
1-6 jak wyżej + dodatkowe:
- Gallery section: photos open in lightbox/carousel
- Map integration: marker positions correct
- "Co w cenie" expand/collapse

### Business apartments (City Apart, Perfect Apart)
1-6 + dodatkowe:
- "Dla firm" section/page accessible
- FAQ accordion expand/collapse
- Loyalty program info widoczne (jeśli applicable)

## Workflow

### Step 1: Identify client type + critical flows
Read `clients/<klient>/BRIEF.md` or memory:
```
Klient: Fair Rentals
Type: apartment rental
Languages: PL, EN, DE
Critical flows: 8 (default for rental)
Custom flows: 1 (Atrakcje page navigation)
```

### Step 2: Build test plan
For each flow, define:
```yaml
flow: "Mobile menu navigation"
preconditions:
  - viewport: 390x844 (iPhone)
  - URL: /
  - cookies: accepted
steps:
  - click: .navbar-toggler
  - wait: menu visible
  - assert: logo visible (top: 12, sticky)
  - click: nav-link[Atrakcje]
  - wait: page loaded
  - assert: URL contains /atrakcje
  - assert: H1 present
expected:
  - no errors w console
  - no horizontal scroll
  - all images loaded
```

### Step 3: Execute via MCP chrome-devtools

For each flow:
```javascript
// Pseudo-code
async function testFlow(flow) {
  await mcp.new_page(flow.preconditions.url);
  await mcp.emulate(flow.preconditions.viewport);
  await mcp.navigate('reload', { ignoreCache: true });
  
  for (const step of flow.steps) {
    if (step.click) await mcp.evaluate_script(`document.querySelector('${step.click}').click()`);
    if (step.wait) await sleep(step.wait_ms || 1000);
    if (step.assert) {
      const result = await mcp.evaluate_script(step.assert_check);
      if (!result) throw new Error(`Assert failed: ${step.assert}`);
    }
  }
  
  // Capture state
  await mcp.take_screenshot(`tests/${flow.name}_PASS.png`);
  return { flow: flow.name, status: 'PASS' };
}
```

### Step 4: Compare with baseline (regression check)
Per critical flow store baseline screenshots in `clients/<klient>/tests/baseline/`.

After test run:
- Compare new screenshot vs baseline (visual diff)
- Pixel diff >5% = REGRESSION → alert + diff image saved

### Step 5: Performance during E2E
Plus measure:
- TTI (time to interactive) per flow
- Long tasks (>50ms blocking main thread)
- Memory growth (heap snapshot before/after)

### Step 6: Generate report

`clients/<klient>/E2E_<date>.md`:

```markdown
# E2E Test Run — <klient> — <date>

## Summary
- Flows executed: 8
- PASS: 7
- FAIL: 1
- Regressions: 0

## Failures
### Flow 5: "Booking flow"
- Step 3: click "Rezerwacja online" expected popup
- Actual: 500 error w console: `Cannot read property 'init' of undefined`
- Screenshot: tests/Booking_FAIL.png
- Suspect: `book-now-widget.js` not loaded — check HEAD.html include

## Visual regressions
None detected (5% threshold).

## Performance
| Flow | TTI | Long tasks | Memory growth |
|------|-----|-----------|---------------|
| Homepage load | 2.1s | 0 | 8 MB |
| Mobile menu | 1.3s | 0 | 0.5 MB |
| Open calendar | 1.8s | 1 (50ms in Litepicker init) | 1.2 MB |
| Browse apartments | 2.0s avg | 0 | 2.0 MB total |

## Actions
- BLOCK DEPLOY until Booking flow fixed
- Track Litepicker init perf (1 long task, OK threshold)
```

### Step 7: CI integration (future)
Plan: GitHub Action which runs E2E on push to feature branches.

## Per-client test files

Store in: `clients/<klient>/tests/`
- `flows.yaml` — flow definitions
- `baseline/` — baseline screenshots
- `runs/<date>/` — test run output
- `E2E_HISTORY.json` — historical PASS/FAIL trends

## Integration

- Uses: MCP `chrome-devtools` (primary) or `playwright` (advanced)
- Calls into: `browser-automation` skill for selector patterns
- Feeds into: `idosell-deploy-cr` (E2E PASS required for deploy)
- Output: per-client test history

## Success metrics

| Metric | Target |
|--------|--------|
| Critical flow PASS rate | 100% (any FAIL = deploy block) |
| Visual regression alerts | <5% per quarter |
| Test execution time | <5 min per client (8 flows) |
| Time-to-detect bug | <1h after deploy (vs days/weeks z user reportu) |

## Anti-pattern

❌ "User testowanie zamiast E2E" — user testuje 1 raz, E2E codziennie
❌ Brittle selectors (np. `body > div:nth-child(3) > .foo`) — używaj klas semantycznych
❌ Bez baseline screenshots — visual regressions nie złapane
✅ Idempotent flows (każdy test może być uruchamiany niezależnie)
✅ Realistic data (use test offers, not placeholders)
