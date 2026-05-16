---
name: filters-submit-brand-styling
description: /offers #filters_submit ZAWSZE stylizuj brand-harmonized — nie zostawiaj defaultowej systemowej .btn
type: instinct
scope: all-clients
trigger: page-offers / /offers subpage build-or-review
added: 2026-04-21
source_client: apartamenty-parkowe (client58154)
---

# Instynkt: /offers #filters_submit zawsze brand-styled

## Co
Na podstronie **/offers** IdoBooking renderuje formularz filtrów
`#menu_filter_form` z przyciskiem submit `#filters_submit.btn` ("Zastosuj
filtry"). Systemowa klasa `.btn` daje mu ledwo używalny wygląd:
`padding: 0 20px`, `border-radius: 0`, `font-size: 12-14px`, brak cienia,
brak hover effect.

## Reguła
**ZAWSZE przy budowie lub audycie strony klienta dodawaj do custom CSS
override dla `#filters_submit` zgodny z kolorystyką brandu.** Nie dotyczy to
tylko koloru tła (`var(--maincolor1)` — i tak jest) — chodzi o PEŁNĄ
harmonizację z innymi CTA klienta: padding, radius, font-size, letter-spacing,
uppercase, hover z transform+shadow.

## Dlaczego
1. Klient zauważa brzydki przycisk — zgłasza jako bug (apartamenty-parkowe,
   user feedback 2026-04-21).
2. Przycisk jest KLUCZOWĄ akcją na /offers (zatwierdzenie wyboru filtrów →
   conversion).
3. Reszta strony ma brand-owy styl, ten jeden przycisk wyłamuje się wizualnie.
4. Systemowa `.btn` ma `border-radius: 0` i brak padding-y — wygląda jak
   default phpBB z 2008.

## Jak zastosować (template)
```css
body.page-offers #filters_submit,
body.page-offers button#filters_submit,
body.page-offers button#filters_submit.btn,
body.page-offers #filter_buttons #filters_submit {
  background: var(--ido-primary) !important;
  background-image: none !important;
  color: #fff !important;
  border: 1px solid var(--ido-primary) !important;
  border-radius: 6px !important;              /* match inne CTA klienta */
  padding: 14px 28px !important;
  height: auto !important;
  min-height: 48px !important;                /* WCAG touch target */
  width: 100% !important;                     /* sidebar filter — full width */
  font-family: var(--ido-font-body) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
  line-height: 1.2 !important;
  cursor: pointer !important;
  transition: background 0.25s, transform 0.25s, box-shadow 0.25s !important;
  box-shadow: 0 2px 6px rgba(R, G, B, 0.18) !important;  /* R,G,B = primary */
}
body.page-offers #filters_submit:hover {
  background: var(--ido-secondary) !important;
  border-color: var(--ido-secondary) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 16px rgba(R, G, B, 0.28) !important;  /* R,G,B = secondary */
}
body.page-offers #filters_submit:active {
  transform: translateY(0) !important;
  box-shadow: 0 1px 3px rgba(R, G, B, 0.15) !important;
}
body.page-offers #filter_buttons {
  padding-top: 12px !important;
}
```

Radius i padding dostosuj do pozostałych CTA klienta (np. dla MADERY radius
może być 0 lub 2px, dla AP jest 6px). Kluczowe: **spójność z pozostałymi CTA
strony**.

## Gdzie sprawdzić po wklejeniu
1. `https://client{ID}.idobooking.com/offers`
2. `document.getElementById('filters_submit')` — computed styles
3. Screenshot full /offers — czy button nie wyłamuje się wizualnie

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS patch: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css`
  sekcja "PATCH 2026-04-21"
