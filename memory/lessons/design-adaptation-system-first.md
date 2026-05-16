# CRITICAL LESSON — Adaptacja designu: System-First, NIE Content-First

**Data odkrycia:** 2026-04-20
**Klient dotknięty:** Apartamenty Parkowe Gniezno v2.0 (wymaga rebuild na v2.1)

## Problem

Gdy dostaję mockup standalone (np. z Claude frontend-design skill) i mam go zaadaptować do IdoBooking, **NIE MOGĘ traktować strony jak pustej kanwy**. IdoBooking **RENDERUJE WŁASNE SYSTEMOWE ELEMENTY** (header, menu, booking widget, fullpage slider, carousel wyróżnionych ofert, footer-contact-baner) — one istnieją ZAWSZE, niezależnie od treści body_top.

## Błąd w v2.0 Apartamenty Parkowe

Dostałem mockup React SPA (Shell.jsx + App.jsx) z:
- Własny `<Nav>` — pasek menu u góry
- Własny `<Hero>` — fullscreen hero
- Własny `<Footer>` — kontakt + kolumny

Popełniłem błąd: **Przepisałem mockup 1:1 na vanilla HTML** w body_top, dodając `.ap-nav`, `.ap-hero`, `.ap-footer` jako nowe elementy. W wyniku na produkcji:
- System menu IdoBooking (`header.default13 .menu-wrapper`) — **NIEOSTYLOWANY**, domyślny biały pasek
- Mój `.ap-nav` — **NIE WYRENDEROWANY** (body_top nie może dodać fixed navbara na górze — system ma swój header)
- System footer IdoBooking (`.footer-contact-baner`) — **NIEOSTYLOWANY**, granatowe paski
- Mój `.ap-footer` — **WYRENDEROWANY pod systemem** jako duplikat
- Booking widget (`#iai_booking_location`) — **NIEOSTYLOWANY**, domyślny wygląd

## Prawidłowy model mentalny

Mockup = "docelowy wygląd". IdoBooking renderuje elementy które **MUSISZ ZAINTEGROWAĆ**:

| Mockup ma | IdoBooking daje | Strategia |
|-----------|-----------------|-----------|
| `<Nav>` na górze | `<header class="default13"><nav class="iai-menu">...</nav></header>` | **Ostyluj system header**, NIE dodawaj swojego. Użyj `header .menu-wrapper` + `header .iai-menu a` selectors |
| `<Hero>` z tytułem | `.section.parallax .fp-tableCell` (fullpage.js) | **Hero teleport**: wstaw content do `.fp-tableCell`. Tło/slider ze systemu (media picker w panelu), Twoje tylko tytuł+CTA |
| `<Footer>` z kontaktem | `.footer-contact-baner` + `footer[role="contentinfo"]` | **Ostyluj system footer**. Nie dodawaj swojego |
| Booking form | `#iai_booking_location`, `#iai_booking_date_from`, `.form-booking` | **Ostyluj system widget**, NIE zastępuj |
| Lista ofert | `.container-hotspot .slick-slide .offer` (wyróżnione) | **Hide system carousel, JS reader → buduj `.ap-offer-card`** |

## Prawidłowy workflow adaptacji

1. **Odpali live klienta** (DevTools) — sprawdź co IdoBooking generuje:
   ```js
   // Sprawdź template
   document.querySelector('header').className  // → "default13"
   // Sprawdź body class
   document.body.className  // → "page-index ..."
   // Sprawdź fullpage sections
   document.querySelectorAll('.fullpage-wrapper .section').length  // → 2 (hero + content)
   ```

2. **Zmapuj mockup → system**:
   | Mockup element | System selektor |
   |----------------|-----------------|
   | Nav | `header.default13 .menu-wrapper .iai-menu` |
   | Hero | `.section.parallax .fp-tableCell` (teleport tu) |
   | Booking widget | `.form-booking`, `#iai_booking_*` |
   | Footer | `.footer-contact-baner`, `footer[role="contentinfo"]` |
   | Featured offers | `.container-hotspot` (hide → JS reader) |

3. **Zdecyduj: style vs content**:
   - **STYLE** systemowe elementy (menu, booking, footer) — w CSS.
   - **DODAJ** tylko dodatkowe sekcje CONTENT (intro, features, reviews, gallery) w body_top między system hero a system footer.

4. **NIE ADAPTUJ** z mockupu do body_top:
   - ❌ `<nav>` — system ma swoje
   - ❌ Hero-fullscreen z vh:100 na początku body_top — system ma swój slider
   - ❌ `<footer>` — system ma `footer-contact-baner`
   - ❌ Theme picker, cursor glow, fancy SPA features — niezgodne z IdoBooking
   - ❌ React/JSX — IdoBooking body_top to zwykły HTML

## Checklist adaptacji designu

Przed kodowaniem zadaj sobie:
- [ ] Czy ta sekcja istnieje jako element systemowy? (header, footer, hero, booking)
- [ ] Jeśli TAK → stylizuję system (CSS na systemowe klasy)
- [ ] Jeśli NIE → dodaję jako `.ap-section` w body_top
- [ ] Czy mój CSS nadpisuje IdoBooking `--maincolor1, --supportcolor1, --btn_large`?
- [ ] Czy CSS mieści się w <60KB / <300 rules (custom.css limit)?
- [ ] Czy body_top to tylko content (bez navbara, bez footer)?

## Related lessons

- `css-custom-panel-limit.md` — dlaczego custom.css ma limit ~60KB
- `idobooking-css-vars-default13.md` — lista vars do override

## TL;DR

**Mockup frontend-design to WIZJA końcowego wyglądu.** IdoBooking ma system elements. Proces adaptacji to **stylizacja system elements** (80%) + **dodawanie content sections** (20%), NIE przepisywanie mockupu 1:1.
