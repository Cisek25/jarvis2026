# Skill - idosell-deploy-cr

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-deploy-cr`

## Czym jest to narzędzie?

**Obowiązkowy** code review przed wklejeniem dowolnego pliku do panelu IdoSell/IdoBooking. Wykrywa wycieki kluczy API, pułapki sanitizera, przekroczenie limitów rozmiarów, naruszenia licencji oraz 18 udokumentowanych pitfalli ze zrealizowanych projektów.

Sprawdzenie trwa ~5 minut. Brak sprawdzenia kosztuje 2-5h cleanupu po wpadce + zniechęconego klienta.

## Dlaczego to istnieje

Każdy deploy bez code review może skutkować:

- **Public secret leak** — Google Maps API key w embed URL → GitHub secret scanning alert
- **Admin OOM** — CSS > 500KB powoduje memory error w panelu
- **Sanitizer crash** — inline `style=""` w body_top wycięty → strona renderuje broken
- **Silent JS truncation** — body_bottom > 62KB → boot() i tail wycinane, panel nie zgłasza błędu
- **Licensing breach** — `display: none` na `.powered_by` = naruszenie wymogu IAI/IdoBooking
- **WAF rejection** — emoji w body_top → IdoSell odrzuca save
- **Cache miss** — user widzi stary CSS po deploy, klient zgłasza "wciąż nie działa"

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-deploy-cr
```

Lub naturalnie:

```
Wkleiłem CSS, ale obraz hero nie ładuje się. Sprawdź zanim wkleję body_top.
```

Skill auto-aktywuje się gdy user mówi "wklej w panel", "deploy", "gotowe do wkleju" lub w post-mortem ("wkleiłem").

## 5 BLOCKERS (jakikolwiek FAIL = NIE deployujemy)

| # | Check | Co eliminuje | Jak sprawdzić |
|---|-------|--------------|---------------|
| 1 | **Secret / API key scan** | Wycieki kluczy do GitHub (Google Maps API, Stripe, GitHub tokens, OpenAI) | `grep -rE "AIza\|sk_live_\|gh[pousr]_\|sk-\|Bearer" <files>` |
| 2 | **body_bottom ≤62KB** | Silent JS truncation (panel nie zgłasza, boot() wycięte) | `wc -c FR_KONIEC_BODY.html` < 63488 |
| 3 | **body_top sanitizer safety** | Strip inline `style=""`, `<script>`, `<style>`, emoji, dane osobowe | `grep -E 'style="\|<script>\|<style>' body_top.html` |
| 4 | **Powered by IdoBooking widoczne** | Naruszenie wymogu licencyjnego IAI | `grep -E "\.powered_by.*display:\s*none" CSS` |
| 5 | **No hardcoded client URL** | Forbidden: `https://client12345.idobooking.com/` poza CSS asset paths | `grep -E "client\d+\.ido" files` |

## 4 STRONG WARNINGS (FIX przed deploy)

| # | Check | Próg | Jak fix |
|---|-------|------|---------|
| 6 | **CSS size ≤450KB** | OOM przy ~500KB (admin) | Run `idosell-css-refactor` skill — strip USUNIETE comments + indent |
| 7 | **!important consistency** | System CSS wins inaczej | Baseline: `html body .selector` + `!important` |
| 8 | **Mobile viewport tested** | 390x844 (iPhone) minimum | MCP chrome-devtools emulate + screenshot |
| 9 | **Cache-busting** | Po deploy hard refresh | Cmd+Shift+R lub incognito |

## 3 RECOMMENDED CHECKS

| # | Check | Wartość |
|----|-------|---------|
| 10 | **Diff vs previous version** | `git diff HEAD -- clients/<klient>/DO_WKLEJENIA/` |
| 11 | **JARVIS memory cross-check** | Read `MEMORY.md`, sprawdź czy nowa zmiana matchuje istniejący trap |
| 12 | **Linked files consistency** | CSS klasy muszą matchować JS selektory; nowe klasy = używane w HTML AND styled w CSS |

## Workflow — krok po kroku

### Step 1: Identyfikacja plików

```
Files about to deploy:
- clients/mountain-prestige/DO_WKLEJENIA/MP_ARKUSZ_STYLOW.css → CSS field
- clients/mountain-prestige/DO_WKLEJENIA/GLOWNA_PL__body_bottom.html → body_bottom field
```

### Step 2: Run wszystkie BLOCKERS

Skill wykonuje 5 skanów + size checks. Format output:

```
✓ Secret scan: PASS (0 matches)
✓ body_bottom size: 57.3 KB / 62 KB limit
✓ body_top inline-style check: PASS
✓ Powered by: visible (opacity 0.9)
✓ No hardcoded API keys
```

### Step 3: Strong warnings

Same format, PASS/FAIL per check.

### Step 4: Decision

| Stan | Akcja |
|------|-------|
| Wszystkie BLOCKERS PASS | ✓ APPROVED FOR DEPLOY |
| Jakikolwiek BLOCKER FAIL | NIE DEPLOYUJEMY — lista violations + fix steps |
| Warnings FAIL | DEPLOY OK ale wymaga follow-up (np. minify, cache-bust) |

### Step 5: Post-deploy verification

Po confirmacji deploy:

```
1. curl -sI https://client<ID>.idobooking.com/ → 200/301
2. Reload main page w MCP chrome-devtools, take screenshot
3. Hard refresh check (?v=<timestamp> na CSS URL)
4. Cross-check live HTML for expected changes
```

### Step 6: Output report

Skill generuje:

```markdown
# Code Review v1.X — Mountain Prestige — 2026-05-20

## Files deployed
- MP_ARKUSZ_STYLOW.css (98 KB)
- GLOWNA_PL__body_bottom.html (57 KB)

## Blockers
- [✓] Secret scan
- [✓] Size limits (CSS 98/450, body_bottom 57/62)
- [✓] body_top sanitizer safety
- [✓] Powered by visible
- [✓] No hardcoded URLs

## Warnings
- [✓] CSS 98 KB < 450 KB threshold
- [✓] Mobile viewport 390x844 tested
- [✓] !important consistency verified

## Live verification (post-deploy)
- Live: HTTP 200
- CSS file: 200 (98 KB)
- Screenshot saved: clients/mountain-prestige/post_deploy_v1.0.png

## Decision: ✓ APPROVED
```

Zapis: `clients/<klient>/CR_<deploy-version>_<date>.md`.

## Przykład: scan body_bottom przed deploy

### Input

```bash
$ wc -c clients/fairrentals/DO_WKLEJENIA/FR_KONIEC_BODY.html
72845 clients/fairrentals/DO_WKLEJENIA/FR_KONIEC_BODY.html
```

### Output skill (BLOCKER FAIL)

```
✗ body_bottom size: 72.8 KB > 62 KB LIMIT
  Skutek: panel SILENT TRUNCATES po ~62KB
  - boot() function defined at line 1703 (po ~64KB) → NIE wykona się
  - DOMContentLoaded listener po linii ~1850 → NIE rejestruje
  - IIFE close })(); wycięte → parser absorbuje HTML jako script

DECISION: NIE DEPLOYUJEMY

Fix steps:
1. Run minify: python3 _source/minify_v2.py < FR_KONIEC_BODY.html > FR_KONIEC_BODY.min.html
2. Verify: wc -c FR_KONIEC_BODY.min.html → musi być < 62KB
3. Re-run /idosell-deploy-cr
4. Po deploy: load live page, sprawdź console — boot() musi exist
```

## Co skill eliminuje (konkretne incidenty)

| Incident | Klient | Rok | Eliminowane przez |
|----------|--------|-----|-------------------|
| Google Maps API key w embed URL → GitHub alert | RPA | 2026-05-19 | Blocker #1 |
| body_bottom 70KB → boot() wycięte → JS dead | Fair Rentals | 2026-05-18 | Blocker #2 |
| Inline `style="background-image"` wycięte przez sanitizer | Fair Rentals v1.65 | 2026-05-19 | Blocker #3 |
| `.powered_by { opacity: 0.35 }` — naruszenie licencji | Mazurski Chill | 2026-04-15 | Blocker #4 |
| Hardcoded `client34211.idobooking.com` w body_top | Mountain Prestige | 2026-03-28 | Blocker #5 |
| Admin OOM przy CSS 460KB | Fair Rentals | 2026-05-20 | Warning #6 |
| !important nie wygrywał — specificity 0,3,3 vs 0,2,3 | Apartamenty Parkowe | 2026-05-13 | Warning #7 |
| Emoji w body_top → IdoSell WAF reject save | EcoCamping | 2026-04-22 | Blocker #3 |

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| Code review report | `clients/<klient>/CR_<deploy-version>_<date>.md` | Markdown z PASS/FAIL |
| Post-deploy screenshot | `clients/<klient>/post_deploy_<date>.png` | PNG |
| JARVIS memory entry (jeśli new trap) | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_*.md` | Markdown |

## Powiązane skille

- **Before**: [/idosell-website-builder](01-Skill-website-builder.md) — produces files
- **After**: [/idosell-seo-audit](04-Skill-seo-audit.md) — Lighthouse post-deploy
- **After**: [/idosell-e2e-test](06-Skill-e2e-test.md) — critical flows regression
- **Memory updates**: jeśli new trap discovered → `~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_*.md`

## Wymagania

- Claude Code z aktywnym MCP `chrome-devtools` (do post-deploy verification)
- Dostęp do panelu klienta (do deploy testowego)
- `grep`, `wc`, `curl` — standardowe Unix tools
- Python 3.9+ (do minify scripts jeśli body_bottom > 60KB)

## NIE pomijaj tego skill

| Bez code review | Po code review |
|-----------------|----------------|
| 2-5h cleanupu po wpadce | 5 minut review |
| Klient zgłasza "padło" via email | Self-detect przed klientem |
| GitHub secret leak email od security team | Zero leaków w 11 projektach |
| Admin OOM = panel down = klient nie może edytować | Zero OOM incidentów (po introduction) |
| Sanitizer crash = strona renderuje broken | Zero crash w 11 projektach |
