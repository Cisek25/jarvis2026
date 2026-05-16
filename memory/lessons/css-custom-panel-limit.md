# CRITICAL LESSON — IdoBooking custom.css LIMIT ~60KB / ~360 rules

**Data odkrycia:** 2026-04-20
**Klient dotknięty:** Apartamenty Parkowe Gniezno v2.0 (catastrophic failure)

## Problem

Panel IdoBooking (Wygląd i treści → Style → Arkusz stylów edytor) **OBCIĄŁ** wklejony CSS z 3356 rules do 360 rules. Serwowany plik: `customStyles/default13/custom1/custom.css` — wszystkie reguły **po ~360 rules są WYCIĘTE**.

## Dowód

Apartamenty Parkowe v2.0, 2026-04-20:
- Wklejono: `AP_CSS_EDYTOR.css` — 125KB, 3356 linii
- Serwowano: `custom.css?v=1776677997` — 360 rules
- **Wszystkie `:root { --ap-forest ... }` i całe L3 (warstwa 3) wycięte**
- Strona na produkcji: BIAŁA, bez kolorów, bez fontów — bo L3 zawierało wszystkie zmienne

## Oznaki że Twój CSS został ucięty

```js
// Sprawdź na produkcji w DevTools
const rs = getComputedStyle(document.documentElement);
rs.getPropertyValue('--ap-forest')  // Jeśli "" → CSS ucięty
document.body.classList.contains('ap-theme')  // Jeśli false → body rules wycięte
[...document.styleSheets].find(s => s.href?.includes('customStyles'))?.cssRules.length  // < Twoje rule count → ucięte
```

## Rozwiązanie

1. **HARD LIMIT: 60KB / ~300 rules dla custom.css.** Nie więcej.
2. **NIE wklejaj całego L1+L2+L3.** Zamiast:
   - L1 (93KB) — **WYBIERAĆ** tylko krytyczne traps specifyczne dla template danego klienta (`default13`, `default11`, etc.). Maks ~80 rules.
   - L2 (19KB) — **POMINĄĆ jeśli używasz własnego prefiksu** (`ap-*`, `md-*`). L2 dodaje `ido-*` duplikaty.
   - L3 — **TYLKO najważniejsze komponenty widoczne na stronie**. Maks ~200 rules.
3. **Kolejność w pliku:** najpierw `:root` z vars, potem override IdoBooking vars, potem reguły komponentów.
4. **Waliduj ROZMIAR po wklejeniu**: otwórz DevTools → Network → `custom.css` → sprawdź ile rules ma.

## Wzorzec optymalnego minimalnego CSS

```css
/* 1. NADPISZ IdoBooking vars FIRST (najwyższy priorytet) */
:root, html {
  --maincolor1: #TWOJKOLOR !important;
  --supportcolor1: #AKCENT !important;
  --btn_large: #TWOJKOLOR !important;
  --bgcolor1: #TLO !important;
  /* + własne vars */
  --ap-forest: #TWOJKOLOR;
}

/* 2. Body/html fonty (~3 rules) */
body, html { font-family: var(--ap-body) !important; background: var(--bgcolor1) !important; }

/* 3. Krytyczne traps (~20 rules) */
.container-hotspot { display: none !important; }
.footer-contact-baner, .footer-contact-baner::before, .footer-contact-baner::after { background: var(--maincolor1) !important; }
header .menu-wrapper.bgd-color-light { background: transparent !important; }

/* 4. Stylizacja elementów systemowych (~50 rules) */
.iai-menu a { color: var(--maincolor1); }
#iai_booking_location { border-color: var(--maincolor1); }
...

/* 5. Własne sekcje .ap-* TYLKO najważniejsze (~150-200 rules) */
.ap-hero { ... }
.ap-section { ... }
.ap-offer-card { ... }
...
```

## Jak TRACK'ować rozmiar

```bash
# Policz rules w pliku przed wklejeniem
grep -c "{" clients/KLIENT/DO_WKLEJENIA/AP_CSS_EDYTOR.css
# Cel: < 300

# Rozmiar
du -h clients/KLIENT/DO_WKLEJENIA/AP_CSS_EDYTOR.css
# Cel: < 60KB
```

## Dodać do QA validator

Dodać sprawdzenie w `library/qa/ux-validator.js`:
```js
{
  id: 'UX-110',
  severity: 'critical',
  name: 'CSS custom.css limit (IdoBooking)',
  check(files) {
    for (const [file, content] of Object.entries(files)) {
      if (!file.endsWith('.css')) continue;
      const size = content.length;
      const rules = (content.match(/\{/g) || []).length;
      if (size > 60000 || rules > 320) {
        return [{ file, detail: `CSS za duży — ${Math.round(size/1024)}KB / ${rules} rules. Limit IdoBooking: 60KB / 320 rules.` }];
      }
    }
    return [];
  }
}
```

## Kluczowa zasada

**NIGDY nie pakuj całego L1+L2+L3 do custom.css w IdoBooking.** Zawsze robić MINIMALNY zestaw: vars override + system element styling + tylko kluczowe componenty.
