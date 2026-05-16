---
name: logo-chip-background
description: Logo w headerze MUSI mieć własne tło (biały chip/pill) żeby było widoczne zarówno na transparent hero jak i na white menu-wrapper. Nigdy nie licz na kontrast samego obrazka PNG.
type: instinct
scope: all-clients
trigger: logo niewidoczne / klient zgłasza 'logo się gubi' / audyt header / buduja strony
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "logo fatalnie jest jakos widoczne, zrobic w jakims okragłym takim przycisku ala białym"
---

# Instynkt: Logo w chipie tła

## Problem
Logo klienta (PNG z `/images/owner/wideLogo.png`) ma przezroczyste tło.
Na różnych kontekstach headera wygląda inaczej:
- Hero homepage (transparent header + dark hero image) → logo z drop-shadow widoczne
- Subpage (white menu-wrapper bg) → logo kolorowe widoczne, ale **logo w bieli/kremie lub logo z białymi detalami znika**
- Scrolled homepage (white menu-wrapper) → j.w.

Każde logo działa inaczej — logo z delikatnymi kolorami (jasny zielony
na białym tle) = nieczytelne. Logo tekstowe = widoczne wszędzie.

## Reguła
**Zawsze opakowuj logo w biały "chip" z padding i border-radius.**
Zapewnia kontrast na każdym tle bez zależności od PNG.

```css
body header.default13 .navbar-brand,
body header.default13.{prefix}-header--scrolled .navbar-brand {
  background: #ffffff !important;
  padding: 8px 18px !important;
  border-radius: 14px !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.08) !important;
  align-self: center !important;
  margin: 10px 12px !important;
  transition: box-shadow 0.25s ease, transform 0.25s ease !important;
}
body header.default13 .navbar-brand:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px) !important;
}
body header.default13 .navbar-brand img {
  height: 62px !important;
  max-height: 62px !important;
}
@media (max-width: 768px) {
  body header.default13 .navbar-brand {
    padding: 6px 12px !important;
    margin: 6px !important;
    border-radius: 10px !important;
  }
  body header.default13 .navbar-brand img { height: 52px !important; }
}

/* Usuń drop-shadow na samym obrazie — chip daje kontrast */
body.page-index header.default13:not(.{prefix}-header--scrolled) .navbar-brand img {
  filter: none !important;
}
```

## Warianty chipu
- **Biały pill** (rounded 14px) — domyślny, uniwersalny kontrast
- **Biały okrągły** (border-radius: 100%) — gdy logo kwadratowe/okrągłe
  (nie szerokie wideLogo)
- **Zielony/brandowy** — dla klientów których logo jest białe (AP nie
  pasuje bo logo ma biały napis)

## Kiedy NIE stosować
- Klient ma logo tekstowe (CSS-generated, bez PNG) — wtedy stylizuj text
- Logo jest już wyraźnie kontrastowe i świetnie widoczne na każdym tle
- Klient explicit odrzuca (rzadko)

## Dlaczego to ważne
1. **Rozpoznawalność brandu** — logo musi być widoczne od pierwszej sekundy
2. **UX** — użytkownik traci orientację, nie wie "na czyjej stronie jest"
3. **Accessibility** — min contrast dla grafik 3:1 (WCAG 1.4.11)
4. **Client perception** — "profesjonalna strona" kontra "amatorska"

## Weryfikacja
Po wklejeniu zrób screenshot:
1. Homepage hero (transparent header + dark image) — logo w białym chipie widoczne ✓
2. Homepage scrolled (white menu-wrapper) — chip nadal widoczny, shadow nie znika ✓
3. Subpage /kontakt — jak wyżej ✓
4. Mobile 390px — chip mniejszy, padding 6px 12px ✓

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS patch: `AP_CSS_EDYTOR.css` §9 PATCH 2026-04-21 v2
- User feedback: "fatalnie jest jakos widoczne, oni maja takie białe"
  (referencja: client9933 ma white menu-wrapper domyślnie)
