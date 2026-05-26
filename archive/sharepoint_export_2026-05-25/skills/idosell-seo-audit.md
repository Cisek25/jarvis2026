# IdoSell SEO + Performance Audit Skill

## Description
Post-deploy SEO and performance audit for IdoSell/IdoBooking sites. Runs Lighthouse, tracks trend over time, identifies quick wins. Generates client-ready report with hard numbers (Performance/SEO/A11y/BP scores).

## Trigger
- After every deploy (auto when `idosell-deploy-cr` reports SUCCESS)
- Before client sign-off / handoff
- Monthly health check for long-running clients
- "audyt SEO", "Lighthouse score", "PageSpeed", "performance check"
- `/idosell-seo-audit` slash command

## Workflow

### Step 1: Baseline check
Run on 3 key pages per client:
- Homepage: `https://client<ID>.idobooking.com/`
- Offer detail: `/offer/<N>/<slug>`
- Static page: `/txt/200/<Page>` (Atrakcje / Dla biznesu / Obsługa)

### Step 2: Run Lighthouse via `roier-seo` skill
Uses `Skill` tool to invoke `roier-seo` which delivers:
- Performance score (0-100)
- SEO score (0-100)
- Accessibility score (0-100)
- Best Practices score (0-100)
- Core Web Vitals: LCP, CLS, INP, FCP, TTFB

Run mobile + desktop variants → 6 audits total per check.

### Step 3: Compare with previous audit
```bash
# Trend file
clients/<klient>/AUDIT_LH_HISTORY.json
```
- New audit appends as row: `{date, page, viewport, perf, seo, a11y, bp, lcp, cls, inp}`
- Detect regression: any score drop >5 pts = ALARM
- Trend graph: rising/stable/declining

### Step 4: Quick wins identification

Common IdoSell issues + fixes:

| Issue | Lighthouse flag | Fix |
|-------|----------------|-----|
| Images without lazy loading | `unused-javascript`, `total-byte-weight` | Add `loading="lazy"` to all `<img>` |
| Images without explicit dimensions | `unsized-images` | Add `width=""` `height=""` attributes |
| Missing alt text | `image-alt` | Add `alt=""` to all `<img>` |
| H1 missing/duplicated | `heading-order` | One `<h1>` per page, semantic order |
| Missing meta description | `meta-description` | Add via HEAD.html (`<meta name="description" content="...">`) |
| No structured data | `structured-data` | Schema.org LodgingBusiness w HEAD.html |
| Render-blocking CSS | `render-blocking-resources` | Minify CSS, defer non-critical |
| Render-blocking JS | `render-blocking-resources` | `defer` on script tags |
| Slow LCP | `largest-contentful-paint` | Optimize hero image (WebP, proper size) |
| CLS issue | `cumulative-layout-shift` | Reserve space for dynamic content (aspect-ratio) |
| Missing favicon | `installable-manifest` | Add `<link rel="icon">` in HEAD.html |
| OG tags missing | `meta-og` | Add OG tags in HEAD.html |
| Non-secure links | `is-on-https` | Replace `http://` with `https://` |

### Step 5: Prioritize by impact/effort
```
Impact: High (>5 pt score boost) | Medium (2-5) | Low (<2)
Effort: 5min | 15min | 1h+

Top 5 fixes = ranked by Impact / Effort ratio
```

### Step 6: Generate report

`clients/<klient>/AUDIT_LH_<date>.md`:

```markdown
# Lighthouse Audit — <klient> — <data>

## Scores summary

| Page | Viewport | Perf | SEO | A11y | BP | LCP | CLS |
|------|----------|------|-----|------|-----|------|-----|
| / | mobile | 87 | 100 | 92 | 100 | 2.3s | 0.02 |
| / | desktop | 95 | 100 | 92 | 100 | 1.4s | 0.01 |
| /offer/10/X | mobile | 84 | 95 | 88 | 100 | 2.6s | 0.05 |
| ...

## Trend vs last audit (<date>)

| Metric | Last | Now | Δ |
|--------|------|-----|---|
| Mobile Perf | 82 | 87 | +5 ✓ |
| Mobile SEO | 100 | 100 | = |
| Mobile A11y | 88 | 92 | +4 ✓ |
| Mobile LCP | 3.1s | 2.3s | -0.8s ✓ |

## Top 5 priority fixes

1. **[Impact: HIGH, Effort: 15min]** Convert hero image to WebP — save ~400KB, improve LCP by ~0.5s
2. **[HIGH, 5min]** Add `loading="lazy"` to apartment cards images — save bandwidth
3. **[MEDIUM, 5min]** Add `width="x" height="y"` to all images — prevent CLS
4. **[MEDIUM, 30min]** Implement LodgingBusiness Schema.org markup
5. **[LOW, 5min]** Add missing alt text on 3 images in /atrakcje

## Comparison with competitors
(Optional: run roier-seo on 2-3 competitor URLs for context)

## Recommendations
- Critical fix this week: <#1>
- Plan for next sprint: <#2, #3>
- Backlog: <#4, #5>
```

### Step 7: Auto-fix simple cases (optional)
If `--auto-fix` flag:
- Add `loading="lazy"` to all images in body_top files
- Add explicit `width`/`height` attrs (measure naturalWidth/Height)
- Generate alt text from filename heuristics
- Update HEAD.html with missing meta tags

### Step 8: Update client memory
```bash
echo "AUDIT_LH_<date>: Perf <X>, SEO <Y>, A11y <Z>" >> ~/.claude/projects/-Users-user-Desktop-jarvis/memory/<klient>.md
```

## Integration

- Calls into: `roier-seo` skill (the actual Lighthouse engine)
- Optional: `marketing:seo-audit` for keyword + content gap analysis
- Updates JARVIS per-client memory
- Outputs to: `clients/<klient>/AUDIT_LH_*.md` + `AUDIT_LH_HISTORY.json`

## Success metrics

Target scores for IdoSell sites (mobile):
- Performance: ≥85 (IdoSell base is around 75-80, custom CSS can push to 85-92)
- SEO: 100 (achievable with meta tags + Schema.org + alt + headings)
- Accessibility: ≥90 (use `idosell-a11y-audit` for deeper WCAG check)
- Best Practices: 100 (no console errors, HTTPS, etc.)

## When to run

| Trigger | Frequency |
|---------|-----------|
| After deploy | Immediately (post-CR) |
| New client launch | Mandatory before sign-off |
| Active client | Monthly |
| Stale client (>6 months) | Quarterly |
| After IdoBooking system update | Immediately |

## Anti-pattern

❌ "Strona wygląda dobrze" bez liczb → klient nie ma czym argumentować z konkurencją
✅ "Performance 87/100 mobile, +12 punktów względem konkurencji" → twardy fact
