# Lesson 014 — Inline `grid-template-columns` trap — RECURRENT

**Kontekst:** piekary13. Trap udokumentowany w `memory/lessons/inline-style-mints-must-remove-not-override.md` (2026-04-16). Powrócił w v7 (2026-05-11) — w worktree wciąż były inline style mimo memory note.

## Co się stało (powtórzenie)

Po redesignie piekary13 (DO_WKLEJENIA_v2 → DO_WKLEJENIA) — w 4 plikach body_top były inline:

```html
<div class="pk-facts" style="grid-template-columns:repeat(3,1fr);">
<div class="pk-features" style="grid-template-columns:repeat(3,1fr);">
<div class="pk-gallery" style="grid-template-columns:repeat(3,1fr); gap:12px;">
```

Na mobile (375px) sekcja `.pk-facts` na home page miała 3 kolumny zamiast 1 → **overflow 251px poza viewport**. Kolumna 2 (offset 241px) i kolumna 3 (offset 427px) wychodziły poza okno przeglądarki.

CSS media queries w CSS_EDYTOR.css @ 768px (2-col) i 480px (1-col) **NIE działały** bo inline style ma wyższą specificity niż class w media query.

## Audit przez Playwright MCP wykrył w 30 sekund

```js
const html = document.documentElement;
const horizontalOverflow = html.scrollWidth > window.innerWidth;
const overflowAmount = html.scrollWidth - window.innerWidth;
// Plus walk DOM looking for elements with right > viewportWidth
```

Output: overflow = 251px na home page przy width 375.

## Fix

1. Usuń `style=""` z wszystkich `<div class="pk-facts|pk-features|pk-gallery">` w body_top
2. Default CSS class ma już `grid-template-columns: repeat(3, 1fr)` → 3 kolumny desktop
3. Media queries @ 768/480 reagują poprawnie → 2/1 kolumny mobile

Jeśli sekcja ma być inna niż default (np. gallery 3-col zamiast default 4-col):
```html
<div class="pk-gallery pk-gallery--3col">  <!-- nowa klasa -->
```
```css
.pk-gallery--3col { grid-template-columns: repeat(3, 1fr); gap: 12px; }
```

## Reguła JARVIS (POWTÓRZONA)

**NIGDY inline `style="grid-template-columns"`.**
Jeśli potrzebujesz override default 3-col / 4-col grid → **stwórz modifier class** (np. `.pk-gallery--3col`, `.pk-features--2col`) z CSS.

## Dlaczego TRAP powraca

Body_top files są kopiowane między klientami i v1/v2/v3 wersjami. Inline styles z early prototypów przeżywają do produkcji bo:
1. Działa na desktop preview
2. Audit mobile nie jest standardową procedurą
3. Memory note z lessons może być pominięty przy szybkim redesignie

## Zapobieganie

**Pre-delivery checklist (każdy projekt):**
- [ ] `grep -rn "style=.grid-template-columns" clients/{X}/DO_WKLEJENIA/*.html` — MUSI być pusty
- [ ] Playwright MCP audit mobile @ 375px → `html.scrollWidth === html.clientWidth`
- [ ] Wszystkie sekcje grid wewnątrz `.pk-section` mają padding/margin neutralny

## Powiązane

- `lessons/inline-style-mints-must-remove-not-override.md` (oryginał z 2026-04-16)
- `instincts/049-mobile-tdd-audit-playwright-pattern.md`
- Pre-delivery checklist
