# IdoSell Deploy Code Review Skill

## Description
Pre-deploy code review for IdoSell/IdoBooking sites. MANDATORY before pasting any file to client panel. Catches security leaks, sanitizer traps, size limits, licensing violations, and JARVIS-known pitfalls from 20+ projects.

## Trigger
- User says "wklej w panel", "deploy", "gotowe do wkleju", "wkleiłem" (post-mortem)
- Before sending any CSS, body_top, body_bottom, HEAD file to client
- `/idosell-deploy-cr` slash command
- Auto-invoke when file `clients/*/DO_WKLEJENIA/*.{html,css}` is about to be referenced as "ready"

## Mandatory Pre-Deploy Checklist

### 🔴 BLOCKERS (any FAIL = do NOT deploy)

#### 1. Secret / API key scan
```bash
# Run on ALL files going to panel
grep -rE "AIza[0-9A-Za-z_-]{35}|sk_live_[0-9a-zA-Z]+|gh[pousr]_[0-9a-zA-Z]+|sk-[A-Za-z0-9]{40,}|Bearer\s+[A-Za-z0-9]{20,}" <files>
```
- Google Maps embed: use `maps.google.com/maps?q=...&output=embed` (NO key needed)
- Analytics: G-XXX / GTM-XXX OK (public), `AIza...` = SECRET = BLOCK
- IdoBooking tokens, payment keys → BLOCK

#### 2. body_bottom size ≤62KB (HARD LIMIT)
- Panel IdoBooking silently truncates body_bottom >62KB
- boot() and tail are cut → page breaks
- **Check:** `wc -c FR_KONIEC_BODY.html` → must be < 63488 bytes
- If close: run minify script (`_source/minify_*.py`)
- Reference: `feedback_idobooking_body_bottom_size_limit.md`

#### 3. body_top must NOT contain:
- `<script>` tags (system strips them)
- `<style>` blocks (use ARKUSZ_STYLOW.css instead)
- Inline `style="background-image: url(...)"` — sanitizer wycina (reference: `feedback_idobooking_body_top_inline_style_stripped.md`)
- Emoji characters (IdoSell WAF rejects save — reference: `feedback_no_emoji_client_code.md`)
- Personal data (RODO: no client emails/phones/addresses outside designated fields)

#### 4. Powered by IdoBooking visible (licensing requirement)
```bash
grep -c "powered_by" <ARKUSZ_STYLOW.css>
# Must NOT match any `display: none !important` on `.powered_by` or `.powered_by_logo`
```
- Reference: `feedback_powered_by_idobooking_visible.md`
- Acceptable: `opacity: 0.7-1.0`, `max-height: 18-30px`
- Forbidden: `display: none`, `visibility: hidden`, `opacity: 0`

#### 5. No hardcoded client URL except panel domain
- Forbidden: hardcoded `https://client12345.idobooking.com/...` outside CSS asset references
- Acceptable: relative paths `/offer/N/slug`, `/contact`, `/txt/200/Page`

### 🟡 STRONG WARNINGS (FIX before deploy)

#### 6. CSS size ≤450KB recommended (admin OOM at ~500KB)
- Reference: incident 2026-05-20 (Fair Rentals)
- Run `idosell-css-refactor` if approaching limit

#### 7. !important consistency
- New rules use `!important` (system CSS wins otherwise)
- Specificity: `html body .selector` baseline

#### 8. Mobile viewport tested
- 390x844x3 (iPhone) minimum
- All text readable, no horizontal scroll
- Touch targets ≥44×44px

#### 9. Cache-busting
- After deploy, instruct user to **hard refresh** (Cmd+Shift+R)
- Or open in incognito to bypass cache

### 🟢 RECOMMENDED CHECKS

#### 10. Diff against previous version
```bash
git diff HEAD -- clients/<klient>/DO_WKLEJENIA/
# Or compare with last commit on feature/<klient>-vX.X branch
```

#### 11. JARVIS memory cross-check
- Read `~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md`
- Check if any feedback applies to current change

#### 12. Linked files consistency
- If editing CSS, also check body_bottom.js (selektory match)
- If new class added, ensure used in HTML AND styled in CSS

## Workflow Steps

### Step 1: Identify files
```
- Which file(s) about to be deployed?
- Path: `clients/<klient>/DO_WKLEJENIA/<file>`
- Target panel field (CSS / body_top / body_bottom / HEAD)
```

### Step 2: Run all blockers
For each file run grep scans + size checks. Output:
```
✓ Secret scan: PASS
✓ Size (body_bottom only): X KB / 62 KB limit
✓ body_top inline-style check: PASS
✓ Powered by: visible (opacity 0.9)
✓ No hardcoded API keys
```

### Step 3: Strong warnings
Same format, mark each PASS/FAIL.

### Step 4: Decision
- All BLOCKERS PASS → ✅ APPROVED FOR DEPLOY
- Any BLOCKER FAIL → ❌ DO NOT DEPLOY. List violations + fix steps.

### Step 5: Post-deploy verification
After user confirms deploy:
1. `curl -sI https://client<ID>.idobooking.com/` → must be 200/301
2. Reload main page in MCP chrome-devtools, take screenshot
3. Hard refresh check (`?v=<timestamp>` on CSS URL)
4. Cross-check live HTML for expected changes

### Step 6: Output report
Save to: `clients/<klient>/CR_<deploy-version>_<date>.md`

```markdown
# Code Review v1.X — <klient> — <data>

## Files deployed
- ARKUSZ_STYLOW.css (XXX KB)
- FR_KONIEC_BODY.html (XX KB)

## Blockers
- [✓] Secret scan
- [✓] Size limits
- [✓] body_top sanitizer safety
- [✓] Powered by visible
- [✓] No hardcoded URLs

## Warnings
- [✓] CSS size 410 KB < 450 KB threshold

## Live verification (post-deploy)
- Live: HTTP 200
- CSS file: 200
- Screenshot saved: <path>

## Decision: ✅ APPROVED
```

## JARVIS Memory Cross-References

This skill auto-loads checks from:
- `feedback_idobooking_body_bottom_size_limit.md`
- `feedback_idobooking_body_top_inline_style_stripped.md`
- `feedback_no_emoji_client_code.md`
- `feedback_powered_by_idobooking_visible.md`
- `feedback_idobooking_specificity_war.md`
- `feedback_preserve_client_css_block.md`

Plus the master `idosell-website-builder.md` trap checklist.

## Integration with other skills

- **Before:** `idosell-webdev` produces files
- **After:** `idosell-seo-audit` runs Lighthouse post-deploy
- **After:** `idosell-e2e-test` runs critical flows
- **Memory update:** if new trap discovered, add to `~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_*.md`

## DO NOT skip this skill

Each deploy without code review = potential:
- Public secret leak (GitHub secret scanning alerts)
- Cache flush + admin OOM (CSS too large)
- Powered by violation (licensing breach)
- Body_top sanitizer crash (page renders broken)
- Body_bottom silent truncation (JS errors in console)

Code review = 5 minut. Cleanup po wpadce = 2-5h + zniechęcony klient.
