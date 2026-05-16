---
name: MASTER-page-index-fullwidth-and-system-hides
description: Master instinct — body.page-index TEZ wymaga override .container (max-width:100%) + ukrycia systemowych H1/H2/.cmshotspot przed naszym hero. Trap #18 dotychczas pokrywał tylko /txt/*, ale strona główna ma identyczny problem. Bez tego strona renderuje się w 1170px ramce z duplikatami widgetu rezerwacji.
type: master-instinct
scope: all-clients (IdoBooking default13, page-index)
added: 2026-05-04
source_clients: solidneapartamenty v1.0 (user feedback "Strona nie jest rozciągnięta na całą szerokość, jarvis powinien to umieć")
priority: APPLY-DAY-ONE
extends: 007 (subpage-full-width)
---

# MASTER — Strona główna full-width + ukrycie duplikatów systemu

## Problem

Trap #18 (CLAUDE.md) i instinct 007 mówią TYLKO o `/txt/*`:
> "Podstrony /txt/* MUSZĄ być full-width — override systemowego .container. ❌ NIE dotyczy /contact ani /offer!"

Ale strona główna (`body.page-index`) MA TEN SAM PROBLEM. System wkłada body_top do
`<div class="section_sub container">` z `max-width: 1170px`. Bez override:

- Hero, Featured, Locations, Final CTA — wszystkie obcięte do 1170px
- Białe paski ~75px po bokach na desktopie >1170px
- User feedback: "Strona nie jest rozciągnięta na całą szerokość, co jest nie do zaakceptowania"

PLUS: na page-index system DODATKOWO renderuje:

1. **Systemowe `<h1>`** z meta-title strony (np. "Wynajem Apartamentów w Polsce — Komfort i Lokalizacja") — widoczne ZA naszym hero
2. **Systemowe `<h2>`** = "IdoBooking" (template branding) — często niewidoczne ale obecne
3. **`.cmshotspot`** = container z systemową sekcją "Wyróżnione Oferty" + searcher widget z dropdownami (Lokalizacja / Początek / Koniec / Goście). PRZED naszym JS który parsuje `.container-hotspot` i buduje custom karty — system już wyrenderował własny widget!

`.container-hotspot` to TYLKO carousel slick wewnątrz `.cmshotspot`. Ukrycie samego `.container-hotspot` zostawia widoczne:
- Header sekcji "Wyróżnione Oferty"
- Systemowy formularz wyszukiwania (searcher)
- Dwie wyszukiwarki na stronie (nasza w hero + systemowa pod hero)

## Reguła

**NA KAŻDEJ stronie głównej NA STARCIE:**

1. Override `.container` na `body.page-index` analogicznie do `body.page-txt`
2. Hide systemowych H1/H2 wewnątrz `.section.parallax`
3. Hide CAŁY `.cmshotspot` (nie tylko `.container-hotspot`)
4. Hide systemowych searcherów (`.searcher`, `#booking-engine-form`, `.iai-booking-search`)

## Template CSS — paste at the end of theme

```css
/* PAGE-INDEX FULL WIDTH + SYSTEM DUPLICATE HIDE */

html body.page-index main .container,
html body.page-index #pageContent .container,
html body.page-index main > .container,
html body.page-index .section_sub.container {
  max-width: 100% !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

html body.page-index main .container > .row,
html body.page-index #pageContent .container > .row {
  margin: 0 !important;
}

html body.page-index main .container > .row > [class^="col"],
html body.page-index #pageContent .container > .row > [class^="col"] {
  padding: 0 !important;
}

html body.page-index main { padding: 0 !important; }

/* Hide system H1 + H2 placeholders before our hero */
html body.page-index .section.parallax h1:not([class*="{prefix}-"]),
html body.page-index .section.parallax h2:not([class*="{prefix}-"]),
html body.page-index .section.parallax > h1,
html body.page-index .section.parallax > h2,
html body.page-index .section.parallax .fp-tableCell > h1:not([class*="{prefix}-"]),
html body.page-index .section.parallax .fp-tableCell > h2:not([class*="{prefix}-"]) {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  position: absolute !important;
  left: -9999px !important;
}

/* Hide entire .cmshotspot (system search widget + Wyroznione Oferty header) */
html body .cmshotspot,
html body .row.cmshotspot,
html body .section_sub.cmshotspot {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Hide system search widgets if rendered outside of cmshotspot */
html body.page-index .searcher,
html body.page-index .iai-booking-search:not(.{prefix}-search),
html body.page-index .booking-search:not(.{prefix}-search),
html body.page-index #booking-engine-form:not(.{prefix}-search),
html body.page-index form[action*="search"]:not(.{prefix}-search):not([class*="{prefix}-"]),
html body.page-index .searcher_default,
html body.page-index .row.searcher,
html body.page-index .page-header,
html body.page-index .breadcrumb,
html body.page-index .breadcrumbs {
  display: none !important;
}
```

## Weryfikacja na live (chrome-devtools)

```javascript
// 1. Container full-width?
getComputedStyle(document.querySelector('body.page-index main .container')).maxWidth
// Powinno: "none" lub "100%" — NIE "1170px"

// 2. .cmshotspot ukryty?
getComputedStyle(document.querySelector('.cmshotspot')).display
// Powinno: "none"

// 3. Systemowe headings ukryte?
Array.from(document.querySelectorAll('.section.parallax h1, .section.parallax h2'))
  .filter(h => h.offsetParent !== null && !h.className.match(/{prefix}-/))
  .length
// Powinno: 0

// 4. Hero w pełnej szerokości?
document.querySelector('.{prefix}-hero-wrap').getBoundingClientRect().width
// Powinno: ~window.innerWidth (np. 1920 dla desktop), NIE 1170
```

## Powiązane

- **Trap #18** (CLAUDE.md) — tylko `/txt/*`, ten instinct rozszerza na `page-index`
- **Instinct 007** — subpage full-width (precedens)
- **Instinct 026** — featured offers Pattern A — wymaga ukrycia `.cmshotspot` (nie tylko `.container-hotspot`)
- **Trap #14** — custom.css limit (te dodatkowe reguły to ~600 bajtów, bezpieczne)

## Meta-lekcja

Każdy nowy klient **na page-index** MUSI dostać:
1. Override `.container` (full-width)
2. Hide `.cmshotspot` (cały, nie tylko `.container-hotspot`)
3. Hide systemowe H1/H2 w `.section.parallax`
4. Hide system searcher

Bez tego pokażesz klientowi stronę z DWIEMA wyszukiwarkami i białymi marginesami — gwarantowany feedback "to nie tak miało wyglądać".

User Solidne Apartamenty (2026-05-04): "czemu nie ukryłeś starej wyszukiwarki systemowej? Widać dwie. Strona nie jest rozciągnięta na całą szerokość, co jest nie do zaakceptowania, ponieważ to się powtarza, jarvis powinien to umieć".
