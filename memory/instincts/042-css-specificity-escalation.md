---
name: css-specificity-escalation
description: Gdy `!important` rule nie wygrywa, NIE dodawaj kolejnego `!important` (już jest!) — eskaluj specificity selektora. Standardowa drabina 0,1,0 → 0,2,2 → 0,3,2.
type: instinct
scope: all-clients
trigger: rule z !important nie wygrywa / computed style pokazuje stare wartości / specificity conflict z system CSS
added: 2026-05-06
source_client: piekary13 — wielokrotnie w sesji 2026-05-06 (v6, v7, v9, v12, v13)
related: instinct 041 (MCP-driven audit pomaga zdiagnozować specificity), trap #15 (default13 system vars override)
---

# Instynkt: Specificity escalation drabina

## Kontekst

W sesji Piekary 13 silnik rezerwacji **5 razy** napotkałem ten sam problem: moja regule z `!important` (specificity 0,1,0) nie wygrywała z system CSS o tej samej specificity 0,1,0. Cascade order dawał czasem system rule pierwszeństwo (lub mój inject był zbyt wcześnie w cascade).

Klasyczna pułapka: dodanie kolejnego `!important` NIE pomoże — już jest. **Trzeba ESKALOWAĆ specificity**.

## Drabina specificity

```
LEVEL 1 — single class       (0,1,0)    .calendar-menu-from
   ↓ FAIL? Eskaluj.
LEVEL 2 — body + class       (0,1,1)    body .calendar-menu-from
   ↓ FAIL? Eskaluj.
LEVEL 3 — html body + 2 cls  (0,2,2)    html body .X .Y
   ↓ FAIL? Eskaluj.
LEVEL 4 — full chain         (0,3,2)    ul.main-nav li.btn-main-nav.active
   ↓ FAIL? Eskaluj.
LEVEL 5 — element.style       (1,0,0,0)  setAttribute('style', ...)  /* nuclear */
```

## Konkretne przypadki z piekary13

### v7 — header transparent
```css
/* FAIL: */ header { background: transparent !important; }  /* 0,0,1 */
/* OK:   */ body header { background: transparent !important; }  /* 0,0,2 */
```

### v9 — tabs OFERTA active burgundy
```css
/* FAIL: */ .btn-main-nav.active { bg: burgundy !important; }  /* 0,2,0 */
/* OK:   */ ul.main-nav li.btn-main-nav.active { bg: burgundy !important; }  /* 0,3,2 */
```

### v10 — FILTRY box-shadow none
```css
/* FAIL: */ .btn-modal-link { box-shadow: none !important; }
/* (konfliktowało z .btn-big z mojego §4 — równa specificity 0,1,0) */
/* OK:   */ body a.btn-modal-link.btn-big { box-shadow: none !important; }  /* 0,2,2 */
```

### v12 — tile borders
```css
/* FAIL: */ .calendar-menu-from { border: 1px solid cream3 !important; }
/* (v8 miał border: transparent !important — equal specificity, cascade wins?) */
/* OK:   */ html body .calendar-menu .calendar-menu-from { border: 1px solid cream3 !important; }  /* 0,2,2 */
```

### v13 — footer_links horizontal
```css
/* FAIL: */ .footer_links a { display: inline-block !important; }
/* (system robił width:100% z większą specificity gdzieś) */
/* OK:   */ html body .footer_wrapper .footer_links > a { display: inline-block !important; }  /* 0,2,3 */
```

## Workflow gdy fix nie działa

1. **Diagnoza MCP**: `browser_evaluate` → matched_rules dla elementu, znajdź wszystkie konflikty
2. **Sprawdź cascade order**: czy mój patch jest later? (powinien wygrać przy równej specificity)
3. **Sprawdź specificity faktyczną**: użyj CSS specificity calculator (mentally counting)
4. **Eskaluj**: dodaj 1-2 levels (body/html body / parent class)
5. **Re-test**: jeśli wciąż FAIL, eskaluj dalej

## Anti-pattern

```css
/* ❌ ZŁE — kolejny !important nie pomoże */
.x { color: red !important !important !important; }

/* ❌ ZŁE — `style attribute` jako routine fix
   (tylko jako last-resort diagnostic, NIE w produkcji) */
element.setAttribute('style', '...');

/* ✅ DOBRE — eskalacja specificity selektora */
html body .parent .x.modifier { color: red !important; }
```

## Edge cases

- **`<a>` w `<li>`**: matchuje też `li > a` selektor — często system CSS używa `.parent li a {...}` (0,1,2). Mój `.x` (0,1,0) NIE wygra.
- **System z gzip CSS**: minified, hard to read. Use MCP `matched_rules_for_tile` żeby widzieć faktycznie matched z full selektory.
- **Equal specificity → cascade**: gdy dwa rules mają tę samą specificity i oba `!important`, cascade order rozstrzyga. Mój patch dodany przez `<style>` tag w head jest LATER → powinien wygrać. Jeśli nie wygrywa, prawdopodobnie system rule ma WYŻSZĄ specificity niż mi się wydaje.

## Referencje

- Sesja piekary13 v7-v13 — wszystkie iteracje używały escalation
- Master `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css` — używa `html body .X .Y` w 12+ miejscach
- Related: instinct 041 (MCP audit pomaga zdiagnozować) + trap #15 (system vars override z !important)
