---
name: IdoBooking mobile hero — search-first order swap
description: Na mobile (≤767px) hero booking widget powinien być PIERWSZY w ap-hero__grid, marketing text drugi; bez tego search wystaje poniżej fold.
type: feedback
originSessionId: 4fb3c5e2-0bd7-4c31-8aa2-14648119333e
---
Na mobile (≤767px) w klientach IdoBooking z `.ap-hero__grid` (text + search-card),
**search card musi być PIERWSZY**, hero text drugi. Implementacja: `flex-direction: column !important; order: 1 / order: 2`.

**Why:** User feedback Apartamenty Parkowe 2026-05-13: "cała wyszukiwarka nie jest widoczna,
zasłania ją następna sekcja". Hero text (kicker + h1 + lead + facts) zajmuje ~340px,
search card 320-600px. Razem przekraczają 667-844px viewport mobile → search idzie poniżej
fold lub overflowuje na następną sekcję. UX pattern Booking.com / Airbnb potwierdza:
primary action (booking) above the fold.

**How to apply:**
- Każdy nowy klient z `.ap-hero__grid` + `.ap-hero__search-card`: dodaj w mobile media query
  order swap + flex column
- Equivalent dla innych prefixów: `.{prefix}-hero__grid` z dwoma children
- Łącz z trap #31 (specificity war) — używaj `html body .X-hero-wrap--split .X-hero__grid`
  (specificity 0,4,3=43) aby pokonać istniejące rules w custom.css
- Verify na 4 viewportach: 360 (S20), 375 (SE), 390 (12), 412 (Pixel 7) — chrome-devtools
  emulate viewport+touch+mobile UA

Plik referencyjny: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` §(9).
