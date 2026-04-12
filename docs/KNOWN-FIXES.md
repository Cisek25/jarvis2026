# JARVIS — Known Fixes & Patterns (IdoBooking)

## 1. Footer Payment Strip (VISA/Mastercard bar)

**Problem:** IdoBooking renders a colored bar (`.footer-contact-baner`) with payment icons
below the footer. This bar sits inside `.footer.container` (max-width ~1170px),
so on wider screens the background doesn't reach the viewport edges — leaving
colored strips on both sides.

**Root cause:** `.footer-contact-baner` inherits container width, not full viewport.

**Fix — full-width breakout trick:**
```css
.footer-contact-baner {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    margin-left: -50vw !important;
    background: var(--client-dark) !important;
    padding: 16px 20px !important;
    text-align: center !important;
    box-sizing: border-box !important;
}
```

**Payment icons are SVG, not IMG!**
IdoBooking uses inline `<svg>` elements inside `<span>` tags for VISA/Mastercard.
Do NOT target `img` — target `svg` and `svg path`/`svg g` for color changes:
```css
.footer-contact-baner svg {
    height: 20px !important;
    width: auto !important;
    opacity: 0.45 !important;
}
.footer-contact-baner svg path,
.footer-contact-baner svg g {
    fill: rgba(255,255,255,0.5) !important;
}
```

**Fallback selectors** (vary by IdoBooking template version):
- `.footer-contact-baner` — most common (confirmed: Najmar, Madera)
- `.footer__strip` — MountainPrestige
- `.payments-bar` — EcoCamping
- `.footer-bottom` — GoldenApartments
- `.payment-methods` — some templates

**Applied in:** Madera, Najmar

---

## 2. Featured Offers (cmshotspot) — Avoiding Duplicates

**Problem:** When using system `.cmshotspot` (automatic featured offers from panel),
AND the homepage HTML has manually coded offer cards (e.g. `.nj-apartment-card`),
both sets show — creating duplicates.

**Fix:** Hide manual cards via CSS:
```css
.client-apartment-card {
    display: none !important;
}
```

Do NOT remove them from HTML — keep as fallback in case cmshotspot isn't configured.
CSS hide is safer and reversible.

**To enable cmshotspot:** Panel → Oferta → Oferty → zaznacz "Wyróżniona" przy wybranych.

---

## 3. `</script>` HTML Parser Bug

**Problem:** If any JS code (even inside comments or template literals) contains the
literal string `</script>`, the HTML parser closes the `<script>` block prematurely,
breaking all subsequent JS.

**Fix:** Never write `</script>` inside JS. Use alternatives:
- `'</' + 'script>'`
- `'<\/script>'`
- Rewrite the comment to avoid the string entirely

---

## 4. CSS `</script>` is safe

Only JS contexts are affected. CSS can contain the string `</script>` without issues.

---

## 5. IdoBooking DOM Structure (Footer)

Typical structure:
```
<footer>
  <div class="footer container" style="max-width: 1170px">
    <div class="footer__wrapper">
      <div class="row">
        <div class="footer__contact">...</div>
      </div>
    </div>
    <div class="footer__social">...</div>
    <div class="powered_by">...</div>
    <div class="footer-contact-add">...</div>     <!-- usually empty -->
    <div class="footer-contact-baner">            <!-- PAYMENT STRIP -->
      <span><svg>VISA</svg></span>
      <span><svg>Mastercard</svg></span>
    </div>
  </div>
</footer>
```
