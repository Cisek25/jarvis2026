---
name: IdoBooking custom.css specificity war — TRAP #31
description: custom.css w IdoBooking ma rules z specificity 0,3,3+!important — twoje rules muszą mieć >= specificity, nie wystarczy !important.
type: feedback
originSessionId: 4fb3c5e2-0bd7-4c31-8aa2-14648119333e
---
Plik `custom.css?v=...` w IdoBooking (sheet 6 zwykle) zawiera CSS klienta z LAYER 1+2+3
po deployment. Rules typu `.ap-hero__search-card .ap-search--vertical .ap-search__field { min-height: 82px !important; padding: 16px 18px !important }` mają specificity 0,3,3 = 33 + `!important`.

**Why:** Próby nadpisania z `html body .X` (specificity 0,2,3 = 23) PRZEGRYWAJĄ mimo `!important`.
Cascade rule: gdy obie reguły mają `!important`, wygrywa **wyższa specificity**, nie pozycja w pliku.
Przy tej samej specificity → wygrywa później deklarowana. Bez tej reguły false confidence "moje !important wygra".

**How to apply (debug workflow):**
1. Otwórz stronę w chrome-devtools MCP, znajdź element z computed style nie pasującym do twoich rules
2. Iteruj `document.styleSheets`, dla każdego accessible sheet znajdź rules z matching selectorem przez walk po cssRules
3. Skopiuj selector istniejącej rule, dodaj jeden poziom (`html body` lub `.parent .X`) → wyższa specificity → wygrywa
4. Live verify przed delivery

**Examples:**
- Pokonanie `.ap-hero__search-card .ap-search--vertical .ap-search__field` (33): `html body .ap-hero-wrap--split .ap-hero__search-card .ap-search--vertical .ap-search__field` (55) — wins
- Pokonanie `.ap-navbar-reservation` w mobile button: `html body header.default13 .navbar-reservation` (33) — same specificity, declared later → wins

Plik trap reference: `docs/CLIENT-LESSONS-apartamenty-parkowe.md` v1.9.1.
