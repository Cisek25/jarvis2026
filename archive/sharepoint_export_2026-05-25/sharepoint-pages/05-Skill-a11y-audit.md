# Skill - idosell-a11y-audit

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-a11y-audit`

## Czym jest to narzędzie?

WCAG 2.1 AA accessibility audit dla stron IdoSell/IdoBooking. Łączy automated checks (axe-core via Lighthouse) z manual keyboard/screen-reader testami via MCP chrome-devtools. Generuje raport compliance gotowy dla klienta.

## Dlaczego to istnieje

**Polskie prawo wymaga WCAG 2.1 AA** compliance dla publicznie dostępnych stron. Sklepy/strony rezerwacyjne dla turystów, B2B, klientów końcowych — wszystko w scope.

Plus: ~15% populacji ma jakąś niepełnosprawność (wzrokową, ruchową, kognitywną). Compliance = większy rynek + zgodność z prawem.

Reference: [Ustawa o dostępności cyfrowej (2019)](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20190000848).

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-a11y-audit
```

Lub naturalnie:

```
Audyt WCAG 2.1 AA Mountain Prestige — sign-off przed handoff.
```

Skill aktywuje się przy: new client sign-off (mandatory), quarterly health check, po major UI changes.

## 4-layer audit

| Layer | Co testuje | Narzędzie |
|-------|-----------|-----------|
| **Layer 1: Automated** | axe-core (Lighthouse) — 50+ WCAG criteria | `roier-seo` lub `design:accessibility-review` |
| **Layer 2: Keyboard** | Tab order, focus rings, Enter/Esc, modal traps | MCP chrome-devtools eval scripts |
| **Layer 3: Contrast** | Kolor tekst vs bg (4.5:1 normal, 3:1 large) | MCP eval — `calculateContrast()` |
| **Layer 4: Touch targets** | 44×44 px minimum (mobile) | MCP eval — getBoundingClientRect() |

## Layer 1: Automated scan (Lighthouse + axe-core)

Output: lista WCAG criteria z PASS/FAIL.

Typowy output:
```
A11y score: 92/100
3 violations found:
- heading-order: skipped from h2 to h4 (3 pages)
- color-contrast: 2 elements below 4.5:1
- image-alt: 1 image missing alt
```

## Layer 2: Manual MCP keyboard test

```javascript
// Keyboard nav check
1. Press Tab → first focusable element should be "skip to main content" link
2. Tab through entire homepage → log focus order
3. Each focusable element: visible focus ring? (outline ≥2px, contrast ≥3:1)
4. Press Enter on each link/button → activates
5. Press Esc on modal → closes
6. Form fields: Tab through, Enter submits (no mouse)
```

## Layer 3: Color contrast verification

WCAG AA wymaga:

| Element | Minimum ratio |
|---------|---------------|
| Normal text | 4.5:1 |
| Large text (24px+ lub 18px+ bold) | 3:1 |
| Non-text (icons, UI components) | 3:1 |
| Hover/focus states | same rules |

### Przykład kontrastu

| Element | FG | BG | Ratio | Required | Status |
|---------|-----|-----|-------|----------|--------|
| `.fr-btn--primary text` (czarny na żółtym) | #1a1a18 | #e2d700 | **12.6:1** | 4.5 | ✓ PASS |
| `.fr-btn--primary text` (BIAŁY na żółtym) | #FFFFFF | #e2d700 | **1.6:1** | 4.5 | ✗ FAIL |
| `.fr-cta-dark text` (szary na ciemnym) | #555 | #1a1a18 | 3.1:1 | 4.5 | ✗ FAIL |
| `.fr-meta-text` (jasnoszary na białym) | #999 | #FFFFFF | 2.8:1 | 4.5 | ✗ FAIL |

**Lesson**: kolor brand często nie zda kontrastu. Yellow #e2d700 z białym = FAIL. Z czarnym = PASS z dużym marginesem.

## Layer 4: Touch target check (mobile)

WCAG 2.5.5 (Level AAA) — rekomendowane też dla AA, bo PL mobile usage 70%+.

```javascript
const targets = document.querySelectorAll('a, button, input, [role="button"], [role="link"]');
targets.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    log('Touch target za mały:', el, rect);
  }
});
```

## Layer 5: Semantic HTML check

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

## Layer 6: IdoSell-specific traps

| Trap | Check | Fix |
|------|-------|-----|
| **Litepicker keyboard nav** | Tab → arrows do navigate dates → Enter to select | Add `data-plugins="keyboardnav"` |
| **Mobile menu trap focus** | When menu open, Tab cycles within menu (not body) | Add `aria-hidden="true"` na body when menu open |
| **Language flags** | `<a aria-label="Polski">` not just `<img alt="">` | Add aria-label do flag links |
| **Booking form errors** | Visually marked AND announced to screen reader | `aria-live="polite"` na error container |
| **Modal "Powered by IdoBooking"** | If modal opens, focus trapped + Esc closes | System default — verify |
| **System orange #AD5009** | Może mieć słaby kontrast z tekstem | Override na brand color z dobrym contrast |

## Per WCAG criterion mapping

| WCAG 2.1 AA | Layer | IdoSell-specific check |
|-------------|-------|------------------------|
| **1.1.1 Non-text Content** | Layer 5 | Alt text na wszystkich `<img>`, decorative `alt=""` |
| **1.3.1 Info and Relationships** | Layer 5 | Semantic HTML, `<label for>`, ARIA |
| **1.4.3 Contrast (Minimum)** | Layer 3 | 4.5:1 normal, 3:1 large |
| **1.4.10 Reflow** | Layer 4 | Mobile reflow bez horizontal scroll |
| **1.4.11 Non-text Contrast** | Layer 3 | Icons, UI components 3:1 |
| **1.4.12 Text Spacing** | Layer 5 | Line-height ≥1.5, paragraph spacing ≥2× font size |
| **2.1.1 Keyboard** | Layer 2 | Wszystko Tab-reachable, Enter activates |
| **2.4.1 Bypass Blocks** | Layer 2 | Skip-to-content link |
| **2.4.3 Focus Order** | Layer 2 | Logical (top→bottom, left→right) |
| **2.4.6 Headings and Labels** | Layer 5 | Heading order, descriptive labels |
| **2.4.7 Focus Visible** | Layer 2 | Outline ≥2px, contrast ≥3:1 |
| **2.5.5 Target Size (AAA, rec.)** | Layer 4 | 44×44 px minimum |
| **3.1.1 Language of Page** | Layer 5 | `<html lang="pl">` (lub EN/DE) |
| **3.3.2 Labels or Instructions** | Layer 5 | Form labels visible |
| **3.3.3 Error Suggestion** | Layer 6 | Booking errors w `aria-live` |
| **4.1.2 Name, Role, Value** | Layer 5 | ARIA roles valid, programmatically determinable |

## Output report

`clients/<klient>/AUDIT_A11Y_<date>.md`:

```markdown
# WCAG 2.1 AA Audit — Mountain Prestige — 2026-05-20

## Overall compliance: 92%

## Layer 1 — Automated (Lighthouse)
- A11y score: 92/100
- 3 violations:
  - heading-order: skipped h2→h4 (3 pages)
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
| .mp-btn--primary text | #1a1a18 | #c9a77d | 5.8 | 4.5 | ✓ |
| .mp-cta-dark text | #555 | #1a1a18 | 3.1 | 4.5 | ✗ |
| .mp-meta-text | #999 | #FFFFFF | 2.8 | 4.5 | ✗ |

## Layer 4 — Touch targets

5 elements below 44×44 px on mobile:
- Language flag links (32×24 px)
- Footer social icons (24×24 px)
- Calendar day cells (33×33 px on subpage)

## Layer 5 — Semantic HTML
- ✓ One H1 per page
- ✗ Heading order skipped h2→h4 on /atrakcje
- ✗ 1 image missing alt: hero on /dla-biznesu
- ✓ Form labels associated
- ✓ Landmarks present (header/nav/main/footer)

## Layer 6 — IdoSell-specific
- ✓ Litepicker keyboard nav working
- ✗ Mobile menu doesn't trap focus
- ✓ Language flags have aria-label
- ✓ Booking errors announced

## Priority fixes

### P0 (blockers dla AA compliance)
1. Fix color contrast `.mp-cta-dark`, `.mp-meta-text` (#555/#999 → #707070 min)
2. Add focus trap to mobile menu
3. Add alt text do hero na /dla-biznesu

### P1 (improvements)
4. Enlarge touch targets ≥44×44 px (flags, calendar cells)
5. Fix heading order /atrakcje (insert h3 między h2 i h4)

### P2 (nice-to-have)
6. Add `prefers-reduced-motion` media query
7. Visible focus ring na yellow CTA (browser default insufficient)

## Compliance level after fixes
- Estimated WCAG 2.1 AA: 98% (z P0+P1)
- AAA-level (44×44 px, 7:1 contrast): ~85%

## References
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Ustawa o dostępności cyfrowej (PL)](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20190000848)
```

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| WCAG audit report | `clients/<klient>/AUDIT_A11Y_<date>.md` | Markdown z compliance % |
| Priority fixes ranking | Sekcja w `AUDIT_A11Y_<date>.md` | P0/P1/P2 |
| Screenshots violations (kontrast, touch) | `clients/<klient>/AUDIT_A11Y_<date>_violations/` | PNG |
| Trap (jeśli nowy) | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_idobooking_a11y_*.md` | Markdown |
| Client memory entry | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/<klient>.md` | 1-liner |

## Powiązane skille

- **Uses**: `design:accessibility-review` (WCAG framework)
- **Uses**: `roier-seo` (Lighthouse a11y score)
- **Uses**: MCP `chrome-devtools` (manual tests, eval scripts)
- **Updates**: `~/.claude/projects/-Users-user-Desktop-jarvis/memory/<klient>.md`

## Wymagania

- Claude Code z aktywnym MCP `chrome-devtools`
- Lighthouse CLI (via `roier-seo`)
- Strona live (deployed) — HTTPS
- Opcjonalnie: dostęp do screen reader testów (VoiceOver / NVDA) — manual

## Success metric

| Target | Wartość |
|--------|---------|
| WCAG 2.1 AA compliance | ≥95% |
| Polish law (ustawa o dostępności cyfrowej) | Compliant |
| Touch targets ≥44×44 px | 100% |
| Contrast normal text | ≥4.5:1 |
| Contrast large text | ≥3:1 |
| Focus visible | 100% interactive elements |

**Anything less than AA = legal risk dla klienta** (publicznie dostępna strona).

## Anti-patterns

| Anti-pattern | Lepiej |
|--------------|--------|
| "Wygląda dobrze" — bez audytu | Twardy compliance % + violations list |
| Tylko Lighthouse score (Layer 1) | 4 layers (automated + keyboard + contrast + touch) |
| Tylko desktop audit | Mobile + desktop (touch targets critical) |
| Manual eyeballing kolorów | `calculateContrast()` per element |
| Audit raz na launch | Quarterly + po major UI changes |
