# Skill - idosell-e2e-test

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-e2e-test`

## Czym jest to narzędzie?

End-to-end testing dla stron IdoSell/IdoBooking via MCP chrome-devtools lub Playwright. Definiuje critical flows per typ klienta, uruchamia je przed/po deploy, łapie regresje **PRZED** zgłoszeniem klientki.

Skill zna 8 podstawowych flowów per typu klienta (apartment / camping / business) i dodaje custom flows specyficzne dla każdego projektu.

## Dlaczego to istnieje

User testuje 1 raz w tygodniu. E2E testuje codziennie. Bez E2E:
- Bug znaleziony przez klienta po dniach/tygodniach
- "Działało na deployment, nie wiadomo kiedy padło"
- Brak baseline screenshots → visual regressions niewidoczne

Z E2E: time-to-detect bug <1h after deploy.

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-e2e-test
```

Lub naturalnie:

```
Przed deploy v1.7 Fair Rentals — uruchom critical flows + visual regression.
```

Skill aktywuje się: pre-deploy (auto via `idosell-deploy-cr`), post-deploy regression, new client launch (sign-off), monthly health check, po IdoBooking system update.

## 8 critical flows per typu klienta

### Apartment rental (Fair Rentals, Mountain Prestige, etc.)

| # | Flow | Preconditions | Kroki | Assertions |
|---|------|---------------|-------|------------|
| 1 | Homepage → search → results | viewport 1440x900, `/` | open `/`, click "Sprawdź dostępność", select dates, click Search | URL `/offers`, results visible, no console errors |
| 2 | Browse apartments | viewport 1440x900 | click apartment card → detail page loads → photos visible → "Pokaż dostępność" | Detail page URL `/offer/N/<slug>`, photos loaded (naturalWidth > 0) |
| 3 | Mobile menu | viewport 390x844 | open hamburger → all menu items clickable → language change | Menu visible, items clickable, lang flag click triggers reload |
| 4 | Contact form | viewport 390x844, `/contact` | fill form → submit → confirmation | Confirmation message displayed |
| 5 | Booking flow | viewport 1440x900, `/offer/N` | "Rezerwacja online" → book-now popup → calendar dates → confirm → checkout | book-now widget loads, dates selectable, redirect to checkout |
| 6 | Language switcher | viewport 1440x900 | click PL/EN/DE flag → URL changes (`/`, `/en/`, `/de/`) → content language matches | URL prefix correct, `<html lang>` matches |
| 7 | Footer links | viewport 1440x900 | Regulamin, Polityka prywatności → modal/page opens | Modal opens lub page loads (no 404) |
| 8 | Powered by IdoBooking | viewport 1440x900 | badge visible w stopce, klikalny | `getComputedStyle.opacity >= 0.85`, click → IdoBooking page |

### Camping/glamping (EcoCamping, etc.)

1-6 jak wyżej + dodatkowe:
- **Gallery section** — photos open w lightbox/carousel
- **Map integration** — marker positions correct
- **"Co w cenie" expand/collapse** — accordion działa

### Business apartments (City Apart, Perfect Apart)

1-6 + dodatkowe:
- **"Dla firm" section/page accessible** — link działa, sekcja widoczna
- **FAQ accordion expand/collapse** — aria-expanded toggle
- **Loyalty program info widoczne** (jeśli applicable)

## Workflow

### Step 1: Identify client type + critical flows

Czytaj `clients/<klient>/BRIEF.md` lub memory:

```yaml
Klient: Fair Rentals
Type: apartment rental
Languages: PL, EN, DE
Critical flows: 8 (default for rental)
Custom flows: 1 (Atrakcje page navigation)
```

### Step 2: Build test plan

Per flow definicja w YAML:

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

Per flow pseudo-code:

```javascript
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

  await mcp.take_screenshot(`tests/${flow.name}_PASS.png`);
  return { flow: flow.name, status: 'PASS' };
}
```

### Step 4: Visual regression vs baseline

Per critical flow store baseline screenshots: `clients/<klient>/tests/baseline/`.

Po test run:
- Compare new screenshot vs baseline (visual diff)
- Pixel diff >5% = REGRESSION → alert + diff image saved

### Step 5: Performance during E2E

Dodatkowo zmierz:

| Metryka | Cel | Co znaczy |
|---------|-----|-----------|
| **TTI (Time to Interactive)** | ≤3s | Strona w pełni interactive |
| **Long tasks** | 0 (>50ms blocking main thread) | Smooth user experience |
| **Memory growth** | <10 MB per flow | Bez leaków |
| **Console errors** | 0 | No broken JS |

### Step 6: Generate report

`clients/<klient>/E2E_<date>.md`:

```markdown
# E2E Test Run — Fair Rentals — 2026-05-20

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
- Suspect: book-now-widget.js not loaded — check HEAD.html include

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

## Per-client test files structure

```
clients/<klient>/tests/
├── flows.yaml              # flow definitions
├── baseline/               # baseline screenshots (po sign-off)
│   ├── homepage_mobile.png
│   ├── homepage_desktop.png
│   ├── booking_flow_step3.png
│   └── ...
├── runs/<date>/            # test run output
│   ├── homepage_mobile_PASS.png
│   ├── booking_flow_step3_FAIL.png
│   └── diff_homepage_mobile.png
└── E2E_HISTORY.json        # historical PASS/FAIL trends
```

## Przykład pełnego flow definition

```yaml
flow: "Booking flow — apartment with calendar"
preconditions:
  - viewport: 1440x900 (Desktop)
  - URL: /offer/10/Premium-Apartment
  - cookies: accepted
steps:
  - assert: title contains "Premium Apartment"
  - assert: at least 1 image visible (naturalWidth > 0)
  - click: button[data-action="reservation-online"]
  - wait: 2000ms (popup load)
  - assert: .litepicker visible
  - assert: .litepicker .month-item-name present (calendar rendered)
  - evaluate: |
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 86400000);
      // click first available date in calendar
      const cells = document.querySelectorAll('.litepicker .day-item:not(.is-locked)');
      cells[0].click();
      cells[1].click();
  - wait: 500ms
  - click: button[data-action="confirm-dates"]
  - wait: 2000ms (redirect to checkout)
  - assert: URL contains "/book-now"
  - assert: price visible
expected:
  - no console errors
  - book-now widget loads in <2s
  - calendar months selectable (left/right arrows)
  - selected dates persist after confirm
```

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| E2E test run report | `clients/<klient>/E2E_<date>.md` | Markdown z PASS/FAIL summary |
| Screenshots per flow (PASS/FAIL) | `clients/<klient>/tests/runs/<date>/*.png` | PNG |
| Visual diff images (jeśli regresja) | `clients/<klient>/tests/runs/<date>/diff_*.png` | PNG |
| Historia trendów | `clients/<klient>/E2E_HISTORY.json` | JSON append |
| Baseline (po sign-off) | `clients/<klient>/tests/baseline/*.png` | PNG |
| Flow definitions | `clients/<klient>/tests/flows.yaml` | YAML |

## Powiązane skille

- **Uses**: MCP `chrome-devtools` (primary) lub `playwright` (advanced)
- **Calls into**: `browser-automation` skill — selector patterns
- **Feeds into**: [/idosell-deploy-cr](02-Skill-deploy-cr.md) — E2E PASS required dla deploy
- **Updates**: per-client test history

## Wymagania

- Claude Code z aktywnym MCP `chrome-devtools` lub `playwright`
- Strona live (deployed) — HTTPS
- Baseline screenshots (z poprzedniego successful test run lub sign-off)
- `flows.yaml` per klient (skopiowany z template + custom flows)

## Success metrics

| Metryka | Target |
|---------|--------|
| Critical flow PASS rate | 100% (jakikolwiek FAIL = deploy block) |
| Visual regression alerts | <5% per quarter |
| Test execution time | <5 min per klient (8 flows) |
| Time-to-detect bug | <1h after deploy (vs days/weeks z user reportu) |

## Anti-patterns

| Anti-pattern | Lepiej |
|--------------|--------|
| "User testowanie zamiast E2E" — user testuje 1 raz, E2E codziennie | Automated E2E + manual smoke testing |
| Brittle selectors (np. `body > div:nth-child(3) > .foo`) | Semantic classes (`.mp-booking-cta`) |
| Bez baseline screenshots | Visual regressions niewidoczne — baseline po sign-off |
| Non-idempotent flows | Każdy test może być uruchamiany niezależnie |
| Placeholder data w testach | Realistic data (test offers, real prices) |
| Tylko desktop testing | Mobile + desktop = 2× viewports per flow |
