# 057 — Mobile booking widget: search-first order swap

## Kiedy stosować

Każdy klient IdoBooking z hero typu `.{prefix}-hero-wrap--split` zawierającym
`.{prefix}-hero__grid` z dwoma children (text + search-card). Na ≤767px MUSI być
order swap: **search-card pierwszy, hero-text drugi**.

## Dlaczego

UX pattern Booking.com / Airbnb / Vrbo: primary action (booking widget) above the
fold na mobile. Bez tego user musi przewijać aby zobaczyć przycisk rezerwacji
i bounce rate rośnie. Konkretny case: Apartamenty Parkowe v1.9.0 — hero text
(kicker + h1 + lead + facts) zajmował ~340px, search card 320-600px. Razem
przekraczały viewport 667-844px → search szedł poniżej fold ORAZ overflowował
wizualnie na następną sekcję (`.ap-about`) o 119px na iPhone 12.

## Implementacja

```css
@media (max-width: 767.98px) {
  html body .{prefix}-hero-wrap--split .{prefix}-hero__grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
    align-items: stretch !important;
  }
  /* Order swap */
  html body .{prefix}-hero-wrap--split .{prefix}-hero__grid .{prefix}-hero__search-card,
  html body .{prefix}-hero-wrap--split .{prefix}-hero__grid #{prefix}-search {
    order: 1 !important;
  }
  html body .{prefix}-hero-wrap--split .{prefix}-hero__grid .{prefix}-hero__text {
    order: 2 !important;
  }
}
```

## Verification

Test na 4 viewportach (chrome-devtools MCP emulate viewport+touch+mobile UA):
- iPhone SE 375×667 (najmniejszy modern)
- iPhone 12 390×844 (popularny)
- Pixel 7 412×915 (Android)
- Galaxy S20 360×740 (mała Android)

Assertions:
- `search.bottom <= window.innerHeight + 1` (above fold)
- `search.bottom <= about.top` (no overlap with next section)
- `submit.bottom <= window.innerHeight + 30` (submit reachable)

## Combine z 058 (specificity war)

W IdoBooking często NIE wystarcza `html body .X` (specificity 23). Custom.css
może mieć rules z `0,3,3` (33) + !important. Użyj selektora z prefixem
`.{prefix}-hero-wrap--split` przed wszystkim aby osiągnąć specificity 33+.

## Plik referencyjny

`clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` §(9), commit v1.9.1.
