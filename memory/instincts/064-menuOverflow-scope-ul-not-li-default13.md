# Instinct 064 — .menuOverflow scope tylko UL.sub-navi (NIE LI.nav-item) w default13

**Discovered**: 2026-05-16 (Fair Rentals v1.48 — regresja "czarny pasek w menu")
**Severity**: 🟡 IMPORTANT — szerokie selektory łamią nawigację

## Problem

System IdoBooking template default13 używa klasy `.menuOverflow` w **2 różnych
miejscach DOM**:

1. **LI inline w nav listy** (kontener który zawiera 3-kropki toggle gdy menu jest za długie):
   ```html
   <li class="menuOverflow nav-item">
     <button class="nav-toggler">...</button>  <!-- 3 kropki -->
     <ul class="sub-navi">                      <!-- popup pod kropki -->
       <li><a class="nav-link">Blog</a></li>
       <li><a class="nav-link">O nas</a></li>
     </ul>
   </li>
   ```

2. **UL.sub-navi popup** — wyrzucony jako floating dropdown po klik

## Antypattern — szeroki selektor

```css
/* ❌ ŁAPIE OBA: LI inline + UL popup */
html body .menuOverflow {
  background: rgba(15, 15, 14, 0.96) !important;
}
```

Skutek: **LI inline w nav dostaje dark bg = czarny prostokąt w środku nawigacji** (200×32px).
Klient widzi czarny pasek zamiast 3 kropek.

## Pattern — scope na UL.sub-navi

```css
/* Reset LI wrapper transparent */
html body li.menuOverflow,
html body li.menuOverflow.nav-item {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  backdrop-filter: none !important;
}

/* Dark bg TYLKO na popup UL */
html body ul.menuOverflow.sub-navi,
html body .menuOverflow > ul.sub-navi {
  background: rgba(15, 15, 14, 0.96) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(226, 215, 0, 0.15) !important;
  border-radius: 12px !important;
  padding: 8px 0 !important;
  min-width: 200px !important;
}

html body ul.menuOverflow.sub-navi li a {
  color: #fff !important;
  padding: 10px 18px !important;
}

html body ul.menuOverflow.sub-navi li a:hover {
  background: rgba(226, 215, 0, 0.12) !important;
  color: var(--fr-primary) !important;
}
```

## Diagnoza — gdzie szukać dwuznaczności selektorów

Klasy które w default13 są używane w 2+ miejscach (zawsze sprawdź zanim ostylujesz):

| Klasa | Lokalizacje |
|-------|-------------|
| `.menuOverflow` | LI w nav + UL popup (overflow) |
| `.btn` | header reservation + sidebar booking + cennik + filter submit (4 różne button patterny) |
| `.nav-link` | top-level menu items + dropdown menu items |
| `.btn-reverse` | cennik bottom button (NIE accommodation-reservation) |
| `.fa-angle-down` | filter_header chevron + nav dropdown chevron + datepicker |

## Recipe TDD

1. Otwórz `.html` z systemu (lub MCP browser_evaluate)
2. `document.querySelectorAll('.YOUR-CLASS')` → ile elementów?
3. Jeśli > 1: print outerHTML każdego, znajdź różnice (tag, parent, modyfikatory)
4. Zaprojektuj selektor który łapie tylko docelowy: `tag.YOUR-CLASS.modifier` lub `parent > .YOUR-CLASS`
5. Test live MCP po deploy

## Related

- Instinct 020 (CSS specificity beats order)
- Instinct 042 (CSS specificity escalation)
- Instinct 046 (MASTER double-nested-class-direct-child-selectors)
