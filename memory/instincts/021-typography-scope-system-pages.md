---
name: typography-scope-system-pages
description: Globalne `body { font-size }` override NIE może dotyczyć `body.page-offers`, `body.page-offer`, `body.page-contact` — to systemowe podstrony IdoBooking z własnymi layoutami. Typography bump tylko na NASZYCH stronach (page-txt, page-index).
type: instinct
scope: all-clients
trigger: pobumpniecie typography globalnie / user 'na /offers za duże' / systemowe layouty się rozpychają
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 v4 "pozwiększałeś czcionki np. na /offers podstronie, niepotrzebnie"
related: instinct 012 (global-typography-scale), 019 (typography-minimum)
---

# Instynkt: Typography bump TYLKO na naszych stronach

## Problem
Gdy klient mówi "czcionki za małe wszędzie", naturalna reakcja:
```css
body { font-size: 18px !important; }
```

Ale to uderza **WSZĘDZIE**, w tym:
- `/offers` — systemowa lista ofert z kartami, filter sidebar
- `/offer/{id}` — systemowa strona oferty z harmonogramem, widgetem booking
- `/contact` — systemowy formularz kontaktowy, dane firmowe

Systemowe layouty mają OWN font-sizing tuned for 16px. Rozpychamy je
do 18px → chaos: dane firmowe się łamią, filter sidebar deforms, booking
widget ma nieczytelne meta.

User AP (2026-04-21) po v1.8.2: "pozwiększałeś czcionki np. na /offers
podstronie, niepotrzebnie".

## Reguła

### Typography bump — z exclusions
```css
/* NASZE strony: 18px body */
html body:not(.page-offers):not(.page-offer):not(.page-contact),
html body.default13:not(.page-offers):not(.page-offer):not(.page-contact) {
  font-size: 18px !important;
  line-height: 1.75 !important;
}

/* SYSTEMOWE strony — zachowaj 16px */
html body.page-offers,
html body.page-offer,
html body.page-contact {
  font-size: 16px !important;
  line-height: 1.6 !important;
}
```

### Paragraphs — też ograniczone
```css
body.page-txt p:not(.ap-offer-card__price):not(small),
body.page-index .ap-narrative p,
body.page-index .ap-about p,
.ap-pagehero__subtitle,
.ap-attractions p,
.ap-blog-card__excerpt {
  font-size: 1.1rem !important;
}
```

**NIE** rozszerzaj na `body p` generally — złapiesz systemowe paragraphy.

## Gdzie bump DZIAŁA
- `/` (homepage) — nasze body_top
- `/txt/*` (O nas, Galeria, Lokalizacja, Blog, Regulamin)
- Nasze custom body_top sections z prefixem `{prefix}-*`

## Gdzie bump NIE DZIAŁA (exclude)
- `/offers` — system listing
- `/offer/{id}` — system detail
- `/contact` — system contact
- `/en/*` analogicznie — exclude `body.page-offers.en`, etc.
- `/news/{id}` — system news detail (jeśli używamy IdoBooking news jako blog post — wtedy nasze styling w article, ale systemowe layout zostaje)

## Weryfikacja

### Po wklejeniu:
1. `/` → text 18px (duży, komfortowy)
2. `/txt/202/Lokalizacja` → j.w.
3. `/offers` → 16px (systemowy, nie rozpycha)
4. `/offer/1/Studio` → 16px (booking widget natural)
5. `/contact` → 16px (formularz contact natural)

### Console check:
```javascript
console.log('body size:', getComputedStyle(document.body).fontSize);
// Expected: 18px na / /txt, 16px na /offers /offer /contact
```

## Historia AP
- **v1.7** (inst 012): body 17px globalnie — mostly OK
- **v1.8.2** (inst 019): body 18px globalnie — za duże na /offers
- **v1.8.3** (ten instinct): body 18px z exclusions → page-offers /offer /contact: 16px

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS: `AP_CSS_EDYTOR.css` §12c (PATCH 2026-04-21 v4)
- User feedback: "pozwiększałeś czcionki np. na /offers podstronie,
  niepotrzebnie. Posprawdzaj dolne sekcje Rezerwacja"
- Related: instincts 012, 019 (typography); 007 (page-txt only scope)
