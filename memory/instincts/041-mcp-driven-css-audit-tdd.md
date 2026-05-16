---
name: mcp-driven-css-audit-tdd
description: Gdy user mówi "to jest źle" lub "zbadaj", użyj playwright MCP `browser_evaluate` z batch testów (5-50) PASS/FAIL na computed styles zamiast zgadywać przez screenshot. Game-changer w accuracy (50%→90%+).
type: instinct
scope: all-clients
trigger: user "to jest złe" / "popraw" / "zbadaj" / nieprzewidywalny visual bug / specificity conflict / multi-element rendering issue
added: 2026-05-06
source_client: piekary13 (client23326) — sesja 2026-05-06, 13 iteracji ENGINE_CSS, breakthrough po v8
related: instinct 033 (live-audit-TDD-after-deploy — to jest jego rozszerzenie), trap #14c (verify on live)
---

# Instynkt: MCP-driven CSS audit z TDD batch

## Kontekst odkrycia

Sesja Piekary 13 silnik rezerwacji, iteracje v3-v13. Pierwsze 7 iteracji: zgadywałem fixy przez user'owe screenshoty + curl HTML. **50% trafność**. User powtarzał feedback bo problemy zostawały.

Po aktywacji `mcp__playwright__browser_navigate` + `browser_evaluate` na live `client9933.idobooking.com/book-now/`:
- **v8 button audit**: wykrył height 50 vs 48 + width 125 vs 171 (niewidoczne 'na oko')
- **v9 tabs**: 6/6 PASS po inject patch
- **v12 borders**: 4/4 PASS, plus znalazł `.calendar-menu-persons:hover` jako "kafelek wewnątrz kafelka"
- **v13 footer**: zmierzone 244px height → 25px po fix

**Trafność: 90%+** po przejściu na MCP audit.

## Workflow

```
1. NAVIGATE: mcp__playwright__browser_navigate(url)
2. VERIFY: fetch CSS link, sprawdź marker (czy najnowsza wersja na live)
3. AUDIT: browser_evaluate z batch testów PASS/FAIL
4. INJECT: jeśli widzisz problem, wstrzyknij <style> patch via evaluate
5. RE-MEASURE: po patch — pomiar czy fix zadziałał
6. SCREENSHOT: dla user'a + dla siebie (visual confirm)
7. UPDATE: dopiero po PASS — update plik CSS source
```

## Wzorzec batch testów

```javascript
() => {
  const T = [];
  const t = (id, name, actual, expected, pass) =>
    T.push({ id, name, actual: String(actual).slice(0,60), expected, status: pass ? 'PASS' : 'FAIL' });

  const cs = sel => { const el = document.querySelector(sel); return el ? getComputedStyle(el) : null; };

  // Verify version marker
  // Verify computed values
  // Test edge cases
  // Test hover states (jeśli możliwe — lub użyj class:test-hover trick)

  // ...

  return {
    summary: { total: T.length, passes, fails },
    fails: T.filter(x => x.status === 'FAIL'),
    passes_compact: T.filter(x => x.status === 'PASS').map(x => x.id + ' ' + x.name)
  };
}
```

## Inject patch (testowanie fix przed wklejeniem do panelu)

```javascript
const old = document.querySelector('#patch-id');
if (old) old.remove();
const style = document.createElement('style');
style.id = 'patch-id';
style.textContent = `
  html body .X .Y {  /* WYŻSZA specificity dla pewności */
    ...
  }
`;
document.head.appendChild(style);
// Force reflow + re-measure
element.offsetWidth;
```

**Po inject + verify PASS → wtedy aktualizuj plik CSS source**. Inject jest tymczasowy, ale dowodzi że fix działa zanim user wkleja.

## Kiedy szczególnie use'ować

- ✅ User powtarza feedback ("dalej źle") — coś nie wyłapuję wzrokiem
- ✅ Specificity conflict (mój `!important` nie wygrywa)
- ✅ Multi-element issues (parent + child oba dostają hover)
- ✅ Pomiar dimensions (height/width inconsistencies)
- ✅ Verify że CSS na live to faktycznie najnowsza wersja
- ❌ Prosta zmiana koloru gdzie znam selektor i mam pewność

## Common pitfalls

1. **`page.click()` + `evaluate` = context destroy** — po klik navigation context async się zerwie. Workaround: zamiast click, navigate bezpośrednio na URL kolejnego kroku.
2. **Inject mierzony "od razu" daje stare wartości** — JavaScript reflow async. Trick: `element.offsetWidth` przed pomiarem (force reflow).
3. **`viewport resize` resetuje stronę** — po `browser_resize` page leci do `about:blank`. Workaround: resize PRZED navigate, nie po.
4. **Specificity walka mimo `!important`** — równa specificity = cascade order wygrywa. Eskaluj do `html body .X .Y` (0,2,2) lub `.parent .target.modifier` (0,2,2+).

## Referencje
- Sesja Piekary 13 v3-v13: `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css`
- Lekcja: `memory/lessons/engine-styling-iteration-process.md`
- Master TDD audit: instinct 033
