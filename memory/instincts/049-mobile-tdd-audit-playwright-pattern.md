# 049 — Mobile TDD audit playwright pattern (390×844 + 360×800 + 320×568)

## Kiedy stosować

Po każdej major iteracji (v1.X) live URL klienta — sprawdź mobile UX. Damian feedback typu "sprawdź mobile" lub "elementy nakładają się" wymaga komprehensywnego audit.

## Pattern (5-script playwright)

### Script 1 — Resize i navigate

```javascript
// Mobile 390×844 (iPhone Pro)
await mcp.playwright.browser_resize({ width: 390, height: 844 });
await mcp.playwright.browser_navigate({ url: 'https://client{ID}.idobooking.com/pl/' });
```

### Script 2 — Horizontal overflow detection

```javascript
() => {
  const viewportW = window.innerWidth;
  const docW = document.documentElement.scrollWidth;
  const horizontalOverflow = docW > viewportW;

  // Find ALL elements that overflow viewport
  const overflowing = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > viewportW + 5 || r.left < -5) {
      overflowing.push({
        tag: el.tagName,
        cls: el.className.toString().substring(0, 60),
        x: Math.round(r.x), right: Math.round(r.right), w: Math.round(r.width)
      });
    }
  });

  return { horizontalOverflow, doc_w: docW, viewport_w: viewportW, overflowing_count: overflowing.length, top10: overflowing.slice(0, 10) };
}
```

**PASS**: `horizontalOverflow: false`, `overflowing_count: 0`.

### Script 3 — Sections inventory + overlap detection

```javascript
() => {
  const sections = Array.from(document.querySelectorAll('section, header, footer, .fr-hero-wrap'))
    .filter(el => el.offsetHeight > 50)
    .map(el => {
      const r = el.getBoundingClientRect();
      return {
        cls: el.className.toString().split(' ').filter(c => c.startsWith('fr-')).slice(0, 2).join(' ') || el.tagName,
        y: Math.round(r.y + window.scrollY),
        h: Math.round(r.height),
        bottom: Math.round(r.y + window.scrollY + r.height)
      };
    });

  // Detect overlaps (a.bottom > b.y of next section)
  const overlaps = [];
  for (let i = 0; i < sections.length - 1; i++) {
    const a = sections[i], b = sections[i+1];
    if (a.bottom > b.y + 5) {
      overlaps.push({ above: a.cls, below: b.cls, overlap_px: a.bottom - b.y });
    }
  }
  return { sections, overlaps };
}
```

**PASS**: `overlaps: []` (lub tylko expected overlaps z absolute positioning jak hero search).

### Script 4 — WCAG hit-area + clickable inventory

```javascript
() => {
  const clickables = Array.from(document.querySelectorAll('a, button, summary, [role="button"]'))
    .filter(el => el.offsetHeight > 0);

  const fail44 = clickables.filter(el => {
    const r = el.getBoundingClientRect();
    return r.height < 44 && el.tagName === 'A';
  }).map(el => ({
    text: el.innerText.trim().substring(0, 40),
    h: Math.round(el.getBoundingClientRect().height),
    cls: el.className.toString().substring(0, 50)
  }));

  return { total: clickables.length, fail_44px_count: fail44.length, fail_items: fail44 };
}
```

**PASS**: `fail_44px_count: 0` (WCAG mobile touch target ≥ 44px).

### Script 5 — Hero/search above-fold check

```javascript
() => {
  const search = document.querySelector('.fr-search-banner, .iai-search, .fr-cmd-bar');
  const hero = document.querySelector('.fr-hero-asym, .fr-hero-wrap');
  if (!search || !hero) return { error: 'missing search or hero' };

  const searchY = search.getBoundingClientRect().y + window.scrollY;
  const heroH = hero.offsetHeight;
  const viewportH = window.innerHeight;

  return {
    search_above_fold: searchY < viewportH,
    hero_height: heroH,
    hero_vs_viewport_ratio: (heroH / viewportH).toFixed(2),
    search_y: Math.round(searchY),
    viewport_h: viewportH
  };
}
```

**PASS**: `search_above_fold: true`, `hero_vs_viewport_ratio: < 1.2` (hero nie zajmuje > 120% viewport).

## Common bugs found

| Bug | Diagnoza | Fix |
|---|---|---|
| `.fr-btn--outline` 383px > viewport 390 | Długi PL tekst + padding 24×2 = 48 | `max-width: calc(100% - 32px)` + `white-space: normal` |
| Hero 1226px > viewport 844 | `min-height: 100vh` + padding-bottom za duże na mobile | `min-height: 78vh` + padding-bottom mniejsze |
| Final-cta + footer overlap 24px | `padding-bottom: 80px` final-cta | `padding-bottom: 56px` mobile |
| `<a>` h: 25px (trust card link) | `display: block` text-only bez padding | `min-height: 44px` + `display: inline-flex; align-items: center` |
| Lang menu items "En" ucinane | `flex` z gap, `<img>` flex-shrink default | `grid-template-columns: 28px 1fr` + `min-width: 80` na ::after content |

## Viewport matrix (test wszystkich)

| Device | Width | Height | Use case |
|---|---|---|---|
| iPhone Pro | **390** | **844** | Standard mobile |
| Standard mobile | 360 | 800 | Older phones |
| iPhone SE | 320 | 568 | Edge case |
| iPad portrait | 820 | 1180 | Tablet |
| iPad landscape | 1024 | 768 | Tablet |
| Laptop | 1440 | 900 | Standard desktop |

## Dokumentacja wynik

Zawsze tworz `clients/{slug}/TDD_AUDIT_v{X}.md`:
- Tabela 28+ desktop elementów z hrefs/PASS/FAIL
- Tabela mobile fail-44 z ratami
- Lista bugów linków + co naprawione
- Lista do panelu klienta (rzeczy które klient musi poprawić w panelu IdoBooking)
- CSS sekcja patch z fix-em (np. §92)

## Date
2026-05-08 — Fair Rentals v1.24 (TDD_AUDIT_v1.24.md, 360 linii)
