# IdoSell Accessibility Audit Skill

## Description
WCAG 2.1 AA accessibility audit for IdoSell/IdoBooking sites. Combines automated checks (axe-core via Lighthouse) with manual keyboard/screen-reader testing via MCP chrome-devtools. Generates compliance report for client.

## Trigger
- New client sign-off (mandatory)
- Quarterly health check (active clients)
- After major UI changes
- "audyt dostępności", "WCAG", "accessibility", "a11y check"
- `/idosell-a11y-audit` slash command
- Polish compliance: ustawa o dostępności cyfrowej (april 2019) — applies to public-facing booking sites

## Why this exists

Polish law requires WCAG 2.1 AA compliance for public-facing sites. Booking sites for tourists, business clients — all in scope.

Plus: ~15% population has some disability (visual, motor, cognitive). Compliance = bigger market reach.

## Workflow (4-layer audit)

### Layer 1: Automated scan (Lighthouse + axe-core)
Via `design:accessibility-review` skill OR `roier-seo` skill (Lighthouse includes axe).

Output: list of WCAG criteria with PASS/FAIL.

### Layer 2: Manual MCP keyboard test

Run via `mcp__chrome-devtools__*`:

```javascript
// Keyboard nav check
1. Press Tab → first focusable element should be "skip to main content" link
2. Tab through entire homepage → log focus order
3. Each focusable element: visible focus ring? (outline ≥2px, contrast ≥3:1)
4. Press Enter on each link/button → activates
5. Press Esc on modal → closes
6. Form fields: Tab through, Enter submits (no mouse)
```

### Layer 3: Color contrast verification

For each visible text element:
```javascript
// MCP eval script
const elements = document.querySelectorAll('*');
const issues = [];
elements.forEach(el => {
  if (!el.textContent.trim()) return;
  const cs = getComputedStyle(el);
  const fg = cs.color;
  const bg = cs.backgroundColor; // walk up tree if transparent
  const fontSize = parseFloat(cs.fontSize);
  const isLarge = fontSize >= 24 || (fontSize >= 18 && cs.fontWeight >= 700);
  const minRatio = isLarge ? 3.0 : 4.5;
  const ratio = calculateContrast(fg, bg);
  if (ratio < minRatio) issues.push({ el, fg, bg, ratio, required: minRatio });
});
```

WCAG AA requires:
- Normal text: 4.5:1 contrast ratio
- Large text (24px+ or 18px+ bold): 3:1
- Non-text (icons, UI components): 3:1
- Hover/focus states: same rules

### Layer 4: Touch target check (mobile)

```javascript
// 44×44 px minimum for touch targets
const targets = document.querySelectorAll('a, button, input, [role="button"], [role="link"]');
targets.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    log('Touch target za mały:', el, rect);
  }
});
```

WCAG 2.5.5 (Level AAA) but recommended even for AA — Polish mobile usage 70%+.

### Step 5: Semantic HTML check

| Check | Method |
|-------|--------|
| One H1 per page | `document.querySelectorAll('h1').length === 1` |
| Heading order (h1→h2→h3, no skips) | walk DOM, log violations |
| All images have alt | `[...document.querySelectorAll('img')].filter(i=>!i.alt)` |
| Decorative images have `alt=""` | distinguished from missing alt |
| Form labels associated | `<label for>` matches `<input id>` |
| ARIA roles valid | `aria-label` na elementach bez wbudowanego label |
| Landmarks present | `<header>`, `<nav>`, `<main>`, `<footer>` |
| Lang attribute | `<html lang="pl">` (lub matching content) |

### Step 6: Specific IdoSell traps

| Trap | Check | Fix |
|------|-------|-----|
| Litepicker keyboard nav | Tab → arrows do navigate dates → Enter to select | Add `data-plugins="keyboardnav"` |
| Mobile menu trap focus | When menu open, Tab cycles within menu (not body) | Add `aria-hidden="true"` on body when menu open |
| Language flags | `<a aria-label="Polski">` not just `<img alt="">` | Add aria-label to flag links |
| Booking form errors | Visually marked AND announced to screen reader | `aria-live="polite"` on error container |
| Modal "Powered by IdoBooking" | If modal opens, focus trapped + Esc closes | System default — verify |

### Step 7: Generate report

`clients/<klient>/AUDIT_A11Y_<date>.md`:

```markdown
# WCAG 2.1 AA Audit — <klient> — <data>

## Overall compliance: <X>%

## Layer 1 — Automated (Lighthouse)
- A11y score: 92/100
- 3 violations found:
  - heading-order: skipped from h2 to h4 (3 pages)
  - color-contrast: 2 elements below 4.5:1
  - image-alt: 1 image missing alt

## Layer 2 — Keyboard navigation
- ✓ Tab order logical (top→bottom, left→right)
- ✗ Focus ring invisible on yellow buttons (contrast 2.8:1, needs 3:1)
- ✓ Enter activates all CTAs
- ✗ Mobile menu doesn't trap focus when open (Tab escapes to body)

## Layer 3 — Color contrast
| Element | FG | BG | Ratio | Required | Status |
|---------|-----|-----|-------|----------|--------|
| .fr-btn--primary text | #1a1a18 | #e2d700 | 8.2 | 4.5 | ✓ |
| .fr-cta-dark text | #555 | #1a1a18 | 3.1 | 4.5 | ✗ |
| .fr-meta-text | #999 | #FFFFFF | 2.8 | 4.5 | ✗ |

## Layer 4 — Touch targets
- 5 elements below 44×44 px on mobile:
  - Language flag links (32×24 px)
  - Footer social icons (24×24 px)
  - Calendar day cells (33×33 px on subpage)

## Layer 5 — Semantic HTML
- ✓ One H1 per page
- ✗ Heading order skipped h2→h4 on /atrakcje
- ✗ 1 image missing alt: hero on /dla-biznesu
- ✓ Form labels associated
- ✓ Landmarks present

## Layer 6 — IdoSell-specific
- ✓ Litepicker keyboard nav working
- ✗ Mobile menu doesn't trap focus
- ✓ Language flags have aria-label
- ✓ Booking errors announced

## Priority fixes (ranked)

### P0 (blockers for AA compliance):
1. Fix color contrast on `.fr-cta-dark` and `.fr-meta-text` (change #555/#999 → #707070 minimum)
2. Add focus trap to mobile menu
3. Add alt text to hero image on /dla-biznesu

### P1 (improvements):
4. Enlarge touch targets to ≥44×44 px (flags, calendar cells)
5. Fix heading order on /atrakcje (insert h3 between h2 and h4)

### P2 (nice-to-have):
6. Add `prefers-reduced-motion` media query for animations
7. Add visible focus ring on yellow CTA buttons (currently relies on browser default)

## Compliance level after fixes
- Estimated WCAG 2.1 AA compliance: 98% (with P0+P1)
- AAA-level checks (touch targets, contrast 7:1): ~85%

## References
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Ustawa o dostępności cyfrowej (PL)](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20190000848)
```

### Step 8: Add to JARVIS memory if new trap
Jeśli znaleziono nowy IdoSell-specific a11y issue → `feedback_idobooking_a11y_<short>.md`.

## Integration

- Uses: `design:accessibility-review` (WCAG framework)
- Uses: `roier-seo` (Lighthouse a11y score)
- Uses: MCP `chrome-devtools` (manual tests)
- Outputs: `clients/<klient>/AUDIT_A11Y_<date>.md`
- Updates: `~/.claude/projects/-Users-user-Desktop-jarvis/memory/<klient>.md`

## Success metric

Aim for: **WCAG 2.1 AA compliance ≥95%** on every client.
Polish law requires AA — anything less = legal risk for client (publicly accessible site).
