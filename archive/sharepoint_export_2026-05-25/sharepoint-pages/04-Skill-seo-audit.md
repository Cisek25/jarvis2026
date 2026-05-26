# Skill - idosell-seo-audit

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-seo-audit`

## Czym jest to narzędzie?

Post-deploy SEO i performance audit dla stron IdoSell/IdoBooking. Wywołuje Lighthouse (przez `roier-seo`), śledzi trendy w czasie, identyfikuje quick wins. Generuje raport gotowy dla klienta z twardymi liczbami (Performance/SEO/A11y/BP scores).

## Dlaczego to istnieje

"Strona wygląda dobrze" bez liczb = klient nie ma czym argumentować z konkurencją. "Performance 87/100 mobile, +12 punktów względem konkurencji" = twardy fact w handoff.

IdoSell domyślnie ma Performance ~75-80 (mobile) — custom CSS + lazy loading + Schema.org może pchnąć do 85-92.

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-seo-audit
```

Lub naturalnie:

```
Po deploy v1.6 Mountain Prestige — zrób audyt SEO i Lighthouse score.
```

Skill aktywuje się automatycznie po SUCCESS z `idosell-deploy-cr`, lub manualnie przed sign-off / handoff.

## 4 metryki Lighthouse

| Metryka | Cel mobile | Cel desktop | Co mierzy |
|---------|-----------|-------------|-----------|
| **Performance** | ≥85 | ≥95 | LCP, FCP, CLS, INP, TTFB, TBT |
| **SEO** | 100 | 100 | Meta tags, headings, alt text, Schema.org, mobile-friendly |
| **Accessibility (A11y)** | ≥90 | ≥90 | Kontrast, alt, labels, ARIA, heading order |
| **Best Practices (BP)** | 100 | 100 | HTTPS, console errors, deprecated APIs, image aspect ratios |

## Workflow

### Step 1: Baseline check
Run na 3 kluczowych stronach per klient:

- Homepage: `https://client<ID>.idobooking.com/`
- Offer detail: `/offer/<N>/<slug>`
- Static page: `/txt/200/<Page>` (Atrakcje / Dla biznesu / Obsługa)

### Step 2: Run Lighthouse via `roier-seo` skill

Mobile + desktop = 6 audytów total per check (3 strony × 2 viewporty).

Output per audit:
- Performance score (0-100)
- SEO score (0-100)
- Accessibility score (0-100)
- Best Practices score (0-100)
- Core Web Vitals: LCP, CLS, INP, FCP, TTFB

### Step 3: Compare with previous audit

Trend file: `clients/<klient>/AUDIT_LH_HISTORY.json`

Nowy audit appendowany jako wiersz:
```json
{
  "date": "2026-05-20",
  "page": "/",
  "viewport": "mobile",
  "perf": 87,
  "seo": 100,
  "a11y": 92,
  "bp": 100,
  "lcp": 2.3,
  "cls": 0.02,
  "inp": 180
}
```

Detect regression: jakikolwiek score drop >5 pts = ALARM.

### Step 4: Quick wins identification

## Common IdoSell issues + fixes

| Issue | Lighthouse flag | Fix | Impact |
|-------|----------------|-----|--------|
| Images bez lazy loading | `unused-javascript`, `total-byte-weight` | Add `loading="lazy"` do wszystkich `<img>` | HIGH |
| Images bez explicit dimensions | `unsized-images` | Add `width=""` `height=""` | MEDIUM (CLS) |
| Missing alt text | `image-alt` | Add `alt=""` do wszystkich `<img>` | HIGH (SEO + A11y) |
| H1 missing/duplicated | `heading-order` | One `<h1>` per page, semantic order | HIGH (SEO) |
| Missing meta description | `meta-description` | Add via HEAD.html | HIGH (SEO) |
| No structured data | `structured-data` | Schema.org LodgingBusiness w HEAD.html | MEDIUM (SEO rich) |
| Render-blocking CSS | `render-blocking-resources` | Minify CSS, defer non-critical | HIGH (Perf) |
| Render-blocking JS | `render-blocking-resources` | `defer` on script tags | HIGH (Perf) |
| Slow LCP | `largest-contentful-paint` | Optimize hero image (WebP, proper size) | HIGH (Perf) |
| CLS issue | `cumulative-layout-shift` | Reserve space (aspect-ratio) | MEDIUM (Perf) |
| Missing favicon | `installable-manifest` | Add `<link rel="icon">` | LOW |
| OG tags missing | `meta-og` | Add OG tags w HEAD.html | MEDIUM (Social) |
| Non-secure links | `is-on-https` | Replace `http://` z `https://` | HIGH (BP) |

### Step 5: Prioritize by impact/effort

```
Impact: High (>5 pt score boost) | Medium (2-5) | Low (<2)
Effort: 5min | 15min | 1h+

Top 5 fixes = ranked by Impact / Effort ratio
```

### Step 6: Generate report

`clients/<klient>/AUDIT_LH_<date>.md`:

```markdown
# Lighthouse Audit — Mountain Prestige — 2026-05-20

## Scores summary

| Page | Viewport | Perf | SEO | A11y | BP | LCP | CLS |
|------|----------|------|-----|------|-----|------|-----|
| / | mobile | 87 | 100 | 92 | 100 | 2.3s | 0.02 |
| / | desktop | 95 | 100 | 92 | 100 | 1.4s | 0.01 |
| /offer/10/X | mobile | 84 | 95 | 88 | 100 | 2.6s | 0.05 |
| /offer/10/X | desktop | 93 | 95 | 88 | 100 | 1.5s | 0.02 |
| /txt/200/Atrakcje | mobile | 89 | 100 | 95 | 100 | 1.9s | 0.01 |
| /txt/200/Atrakcje | desktop | 96 | 100 | 95 | 100 | 1.1s | 0.01 |

## Trend vs last audit (2026-05-13)

| Metric | Last | Now | Δ |
|--------|------|-----|---|
| Mobile Perf | 82 | 87 | +5 ✓ |
| Mobile SEO | 100 | 100 | = |
| Mobile A11y | 88 | 92 | +4 ✓ |
| Mobile LCP | 3.1s | 2.3s | -0.8s ✓ |
```

## Top 5 quick wins ranking (przykład)

```
1. [Impact: HIGH, Effort: 15min] Convert hero image to WebP
   → save ~400KB, improve LCP by ~0.5s
   → expected score boost: +6 pts mobile Perf

2. [HIGH, 5min] Add loading="lazy" to apartment cards images
   → save bandwidth
   → expected: +3 pts mobile Perf

3. [MEDIUM, 5min] Add width="x" height="y" to all images
   → prevent CLS
   → expected: +2 pts mobile Perf, CLS -0.03

4. [MEDIUM, 30min] Implement LodgingBusiness Schema.org markup
   → expected: +5 pts SEO + rich results eligibility

5. [LOW, 5min] Add missing alt text on 3 images in /atrakcje
   → expected: +1 pt A11y, +1 pt SEO
```

### Step 7: Auto-fix simple cases (optional `--auto-fix` flag)

Skill może auto-zaaplikować:
- Add `loading="lazy"` do wszystkich images w body_top files
- Add explicit `width`/`height` attrs (measure naturalWidth/Height)
- Generate alt text z filename heuristics
- Update HEAD.html z missing meta tags

### Step 8: Update client memory

```bash
echo "AUDIT_LH_2026-05-20: Perf 87 (+5), SEO 100, A11y 92 (+4), LCP 2.3s (-0.8s)" \
  >> ~/.claude/projects/-Users-user-Desktop-jarvis/memory/mountain-prestige.md
```

## Kiedy uruchamiać

| Trigger | Frequency |
|---------|-----------|
| Po deploy | Immediately (post-CR) |
| New client launch | Mandatory przed sign-off |
| Active client | Monthly |
| Stale client (>6 months) | Quarterly |
| Po IdoBooking system update | Immediately |

## Trend tracking — przykład historii

`clients/mountain-prestige/AUDIT_LH_HISTORY.json`:

```json
[
  {"date": "2026-03-01", "page": "/", "viewport": "mobile", "perf": 76, "seo": 95, "a11y": 84, "lcp": 3.5},
  {"date": "2026-03-15", "page": "/", "viewport": "mobile", "perf": 79, "seo": 100, "a11y": 88, "lcp": 3.1},
  {"date": "2026-04-01", "page": "/", "viewport": "mobile", "perf": 82, "seo": 100, "a11y": 88, "lcp": 3.1},
  {"date": "2026-05-13", "page": "/", "viewport": "mobile", "perf": 82, "seo": 100, "a11y": 88, "lcp": 3.1},
  {"date": "2026-05-20", "page": "/", "viewport": "mobile", "perf": 87, "seo": 100, "a11y": 92, "lcp": 2.3}
]
```

Trend: rising (76 → 87 mobile Perf w 11 tygodni). Każdy audyt loguje historię — łatwo argumentować klientowi że performance idzie w górę.

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| Lighthouse audit report | `clients/<klient>/AUDIT_LH_<date>.md` | Markdown z tabelami scores |
| Historia trendów | `clients/<klient>/AUDIT_LH_HISTORY.json` | JSON append |
| Top 5 quick wins | Sekcja w `AUDIT_LH_<date>.md` | Ranked by Impact/Effort |
| Auto-fixes (opcjonalnie) | `clients/<klient>/DO_WKLEJENIA/*.html` | Updated files |
| Client memory entry | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/<klient>.md` | 1-liner |

## Powiązane skille

- **Calls into**: `roier-seo` (faktyczny Lighthouse engine)
- **Optional**: `marketing:seo-audit` (keyword + content gap analysis)
- **Updates**: JARVIS per-client memory
- **Before**: [/idosell-deploy-cr](02-Skill-deploy-cr.md) — uruchamia po SUCCESS

## Wymagania

- Claude Code z aktywnym `roier-seo` skill
- Lighthouse CLI (instalowany przez roier-seo)
- Strona live (deployed) z dostępem HTTPS
- Opcjonalnie: marketing:seo-audit dla keyword research

## Success metrics

| Target | Mobile | Desktop |
|--------|--------|---------|
| Performance | ≥85 | ≥95 |
| SEO | 100 | 100 |
| Accessibility | ≥90 | ≥90 |
| Best Practices | 100 | 100 |
| LCP | ≤2.5s | ≤1.5s |
| CLS | ≤0.05 | ≤0.05 |
| INP | ≤200ms | ≤100ms |

## Anti-patterns

| Anti-pattern | Lepiej |
|--------------|--------|
| "Strona wygląda dobrze" bez liczb | "Performance 87/100 mobile, +12 vs konkurencja" |
| Audit raz na launch | Monthly tracking trendu |
| Tylko mobile audit | Mobile + desktop = 6 audytów per check |
| Manual fixes każdy raz | `--auto-fix` dla loading="lazy", width/height, alt |
| Audit bez baseline historii | Historia w `AUDIT_LH_HISTORY.json` = argumentacja trendu |
