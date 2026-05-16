# CRITICAL LESSON — Weryfikacja NA ŻYWO przed oddaniem

**Data odkrycia:** 2026-04-20
**Klient dotknięty:** Apartamenty Parkowe Gniezno v2.0

## Problem

Oddałem klientowi pakiet `DO_WKLEJENIA` zwalidowany przez `library/qa/run-all-checks.js` (SEO 8/8, UX 11/14 PASS). Klient wkleił → strona **KATASTROFALNIE złamana**: brak kolorów, brak fontów, brak silnika rezerwacji, moje .ap-* sekcje renderują się jak czarny tekst na białym tle.

**Przyczyna**: walidator JARVIS sprawdza **syntaktycznie pliki lokalne**, ale:
- Nie wie czy IdoBooking obcął CSS (nie wie o limicie)
- Nie wie czy moje CSS vars są aplikowane po wklejeniu (IdoBooking vars mają priorytet)
- Nie wie czy moje .ap-* sekcje wyglądają tak jak w mockupie po zderzeniu ze stylami systemu

## Wymóg: LIVE VERIFICATION

**NIE ODDAWAJ plików klientowi dopóki nie:**

1. **Samodzielnie wkleiłeś CSS + HTML + JS do panelu** (chrome-devtools MCP → otwórz panel → wklej)
2. **Otwierasz produkcję w chrome-devtools MCP**
3. **Sprawdzasz:**
   ```js
   // 1. Czy CSS vars zostały zaaplikowane
   const rs = getComputedStyle(document.documentElement);
   rs.getPropertyValue('--maincolor1')  // powinien = TwojeBrand
   rs.getPropertyValue('--ap-forest')   // powinien = TwojeBrand
   rs.getPropertyValue('--btn_large')   // powinien = TwojeBrand

   // 2. Czy body ma klasę ap-theme
   document.body.classList.contains('ap-theme')

   // 3. Czy fonty się wczytały
   [...document.fonts].filter(f => f.status === 'loaded' && f.family.includes('Cormorant')).length

   // 4. Ile rules ma Twój custom CSS
   const mycss = [...document.styleSheets].find(s => s.href?.includes('customStyles'));
   mycss?.cssRules.length  // porównaj z ile miałeś lokalnie

   // 5. Czy hero jest w .fp-tableCell
   document.querySelector('.ap-hero-wrap')?.parentElement?.className  // powinno zawierać fp-tableCell

   // 6. Czy menu systemowe jest ostylowane
   getComputedStyle(document.querySelector('header .menu-wrapper')).backgroundColor

   // 7. Czy booking widget jest ostylowany
   getComputedStyle(document.querySelector('#iai_booking_location')).borderColor
   ```

4. **Zrób screenshot full page** — porównaj z mockupem side-by-side
5. **Przewiń całą stronę** — sprawdź czy wszystkie sekcje się wyrenderowały
6. **Test mobile** — `resize_window(375)` → screenshot → sprawdź responsive

## Dodać do JARVIS pipeline

1. Nowa faza w `library/skills/new-client.md`: **Faza 8 — Live verification**
2. Nowy validator w `library/qa/`: `live-validator.js` (chrome-devtools based)
3. Dodać TodoWrite item: "Live verification w panelu klienta (BLOKUJĄCE)"

## Absolutne minimum przed oddaniem

```
☐ Panel login
☐ CSS wklejony → zapisane → brak błędów w konsoli panelu
☐ body_top wklejony → zapisane
☐ body_bottom wklejony → zapisane
☐ HEAD wklejony → zapisane
☐ Otwarty live URL w chrome-devtools
☐ Screenshot full page
☐ DevTools audit: CSS vars, fonts, hero position, menu style, booking style
☐ Mobile screenshot @375px
☐ Console errors: 0 krytycznych
☐ Porównanie side-by-side z mockupem
```

## TL;DR

**Waliodator lokalny JARVIS ≠ gwarancja działania na produkcji.** Zawsze weryfikuj live ZANIM powiesz klientowi że gotowe.
