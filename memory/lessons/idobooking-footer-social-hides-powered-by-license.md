---
name: idobooking-footer-social-hides-powered-by-license
description: System Idosell template default13 ma rule `html body footer .footer__social { display: none !important }` która ukrywa parent `.footer__social` — w którym mieści się `.powered_by` (badge "Powered by IdoBooking"). Wymóg licencyjny: badge MUSI być widoczny. Override wymaga chained-class boost + force load lazy img.
type: lesson
scope: idobooking-clients
severity: high (license violation)
trigger: stopka klienta nie pokazuje "Powered by IdoBooking" / Lighthouse audit zgłasza `.powered_by` visible:false / wymóg licencji IdoSell
added: 2026-05-15
source_client: fairrentals — sesja 12-15 v1.30-v1.32, kilka iteracji żeby pobić specificity system rule
related: instinct 045 (chained-class boost), feedback_powered_by_idobooking_visible.md, instinct 027 (no client code emoji — separate)
---

# Lekcja: `.footer__social { display: none }` ukrywa wymagany `.powered_by`

## Wymóg licencyjny

IdoSell licencja dla bookingu wymaga aby **badge "Powered by IdoBooking"** był widoczny w stopce strony klienta. Brak widoczności = naruszenie licencji.

Standard: opacity 0.85+ (nie ukrywać), rozsądny rozmiar (height ~20px), klikalny link do https://www.idosell.com/pl/booking/.

## Symptom

Live audit:
```javascript
const powered = document.querySelector('.powered_by');
getComputedStyle(powered).display;        // "none"
powered.offsetParent;                      // null
powered.querySelector('img').naturalWidth; // 0 (lazy not loaded)
```

Stopka renderuje bez badge.

## Root cause

System `app.css.gz` (lub `custom.css` z poprzedniej iteracji klienta) ma 3 reguły:

```css
/* Rule 1: parent .footer__social ukryty */
html body footer .footer__social {
  display: none !important;
}

/* Rule 2: bezpośrednio .powered_by ukryty */
html body footer .footer__social .powered_by {
  display: none !important;
}

/* Rule 3: img też wyzerowany */
html body img.powered_by_logo {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
```

Wszystkie 3 z `!important`. Specificity (0, 2-3, 1-3) — trudno pobić zwykłym selektorem.

## Powodu dlaczego system ukrywa

Idosell template `default13` był zaprojektowany dla **ZDARENT firm hotelowych** które oryginalnie miały vlastne footer designs (bez Idosell badge). System rule ukrywała badge by `display: none` automatycznie — żeby klient sam mógł wyświetlić gdzie chce.

ALE: dla większości klientów to oznacza **license violation** — badge nigdzie nie pokazany.

## Fix (§101g + §104d w fairrentals)

**Pierwsza próba** — nie zadziałała (specificity za niska):
```css
html body .powered_by, html body .powered_by_logo {
  display: inline-flex !important;
  opacity: 0.85 !important;
}
```

**Druga próba** — też nie zadziałała (system wygrywa):
```css
html body footer .powered_by, html body footer .powered_by_logo {
  display: inline-flex !important;
}
```

**TRZECIA próba** — DZIAŁA (chained-class boost, instinct 045):

```css
/* Parent .footer__social — force visible */
html body footer .footer__social.footer__social {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 16px 0 !important;
  width: 100% !important;
  background: transparent !important;
}

/* Powered_by — chained 2× */
html body footer .footer__social.footer__social .powered_by.powered_by,
html body footer .footer__social.footer__social a.powered_by_logo.powered_by_logo {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 0.85 !important;
  width: auto !important;
  height: auto !important;
}

/* Img — chained 2× (pobija system width:0 height:0) */
html body footer .footer__social.footer__social img.powered_by_logo.powered_by_logo,
html body footer img.powered_by_logo.powered_by_logo {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
  width: auto !important;
  height: 20px !important;
  max-height: 28px !important;
  filter: brightness(0) invert(1) !important;  /* ciemne logo → białe na dark footer */
}

html body footer .powered_by.powered_by:hover {
  opacity: 1 !important;
}
```

**Plus**: img ma `data-src` (lazy load). System lazy loader może nie odpalić jeśli element initially hidden. Trzeba **force load via JS**:

```javascript
/* W FR_KONIEC_BODY.html lub przez script tag */
document.querySelectorAll('.powered_by img[data-src]').forEach(img => {
  if (!img.src || img.src.length < 20) {
    img.src = img.getAttribute('data-src');
  }
});
```

## Pomiary post-fix

```javascript
const powered = document.querySelector('.powered_by');
const img = powered.querySelector('img');

// Wcześniej:
// powered.getBoundingClientRect().width = 0
// img.naturalWidth = 120, displayed width = 0px
// img.complete = true ale niewidoczne

// Po fix:
// powered.getBoundingClientRect().width = 60 ✓
// img.naturalWidth = 120, displayed width = 60px ✓
// img.complete = true, visible ✓
```

## Workflow gdy nowy klient

1. **Live audit po deployment**: szukaj `.powered_by` visibility
2. **Jeśli niewidoczne**: zastosuj §101g + §104d template
3. **Force load** lazy img jeśli `data-src` nie zaaplikowany
4. **Verify** Lighthouse audit nie zgłasza `.powered_by` jako fail

## Prevention dla nowych projektów

W **TEMPLATE bazowym CSS** dla wszystkich klientów IdoBooking dodaj sekcję "Mandatory licence badges":

```css
/* §_BASE_LICENSE. IdoBooking badge widoczność (wymóg licencyjny) */
html body footer .footer__social.footer__social,
html body footer .footer__social.footer__social .powered_by.powered_by,
html body footer img.powered_by_logo.powered_by_logo {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 0.85 !important;
}
```

Dodać do **layer2-components.css** w jarvis library żeby każdy nowy klient automatycznie miał to.

## Referencje

- Source client: fairrentals — sesje 12-15 (3 iteracje zanim chained-class zadziałał)
- Wymóg licencyjny: feedback_powered_by_idobooking_visible.md (zapisane w memory wcześniej)
- Related instincts: 045 (chained-class boost)
- Related lessons: idobooking-css-vars-default13, idobooking-global-header-traps-semantic-tags
- Wymaga: dodać do base layer2-components.css template (TODO dla JARVIS)
