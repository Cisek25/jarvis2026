---
name: Powered by SVG variant mismatch with footer bg
description: IdoBooking serwuje 2 wersje SVG _on_white / _on_dark. Jeśli klient ma ciemną stopkę a SVG to _on_white, badge niewidoczny = naruszenie licencji.
type: feedback
originSessionId: 25c3c84c-4be9-4f6b-a50a-131306fde9b0
---
# Powered by IdoBooking — SVG variant must match footer bg

## Rule
IdoBooking serwuje DWA warianty Powered by SVG:
- `/images/panel/newBrand/powered_by_idoBooking_on_white.svg` (ciemne logo dla **białych** teł)
- `/images/panel/newBrand/powered_by_idoBooking_on_dark.svg` (białe logo dla **ciemnych** teł)

Każdy nowy klient: **zweryfikuj że variant SVG matches footer background**. Mismatch = badge wizualnie niewidoczny mimo poprawnego CSS (visibility:visible, opacity ≥0.85) = potencjalne naruszenie licencji.

**Why:** Fair Rentals v1.70 audit (2026-05-20). Klientka zgłaszała "nie widzę Powered by w stopce".
Diagnoza CSS: `display:flex`, `visibility:visible`, `opacity:0.85`, w DOM ✅. ALE:
- SVG src: `powered_by_idoBooking_on_white.svg` (ciemne logo)
- Footer bg: `rgb(10, 10, 9)` (czarna stopka)
- Wynik: ciemne logo na ciemnym tle = wizualnie invisible
Wymóg licencyjny IdoBooking: badge MUSI być widoczny.

**How to apply:**
1. Audyt każdej nowej strony i przy każdym sign-off:
   ```javascript
   // In MCP playwright/chrome-devtools:
   const pb = document.querySelector('.powered_by_logo');
   const footer = document.querySelector('footer');
   const svgVariant = pb.src.match(/on_(white|dark)\.svg/)?.[1];
   const footerBg = getComputedStyle(footer).backgroundColor;
   // Check if variant matches: _on_white needs light footer, _on_dark needs dark footer
   ```
2. Jeśli mismatch:
   - **Opcja A** (rekomendowane): CSS filter dla cross-platform pewności:
     ```css
     html body .powered_by .powered_by_logo,
     html body footer img[src*="powered_by_idoBooking"] {
       filter: brightness(0) invert(1) !important;  /* ciemne → białe */
       opacity: 0.85 !important;
     }
     ```
     Działa zawsze niezależnie od variant SVG.
   - **Opcja B**: zmień src w body_bottom JS (jeśli klient woli swap SVG):
     ```javascript
     document.querySelectorAll('img.powered_by_logo').forEach(img => {
       img.src = img.src.replace('_on_white.svg', '_on_dark.svg');
     });
     ```

## Detection (MCP)
```javascript
const pb = document.querySelector('.powered_by_logo');
const footer = pb?.closest('footer');
const bg = footer ? getComputedStyle(footer).backgroundColor : null;
const variant = pb?.src.includes('_on_white') ? 'dark logo' : pb?.src.includes('_on_dark') ? 'light logo' : '?';
// Compute footer luminance — < 0.5 = dark bg
// If dark logo (variant 'dark') + dark footer (luminance < 0.5) = MISMATCH
```

## Reference
- Fair Rentals v1.70 P0-2: patch `clients/fairrentals/DO_WKLEJENIA/PATCH_v1.70.css` §113b
- Licensing memory: `feedback_powered_by_idobooking_visible.md` (existing, extend with this)
- Apply per: all clients with bg na footer != white during audit pass
