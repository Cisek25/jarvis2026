---
name: featured-offers-no-fallback
description: Sekcja "Nasze apartamenty/Our offers" na homepage MUSI być automatyczna z systemowych Wyróżnionych (container-hotspot). ZERO hardcoded fallback w HTML. 0 wyróżnionych = hide całej sekcji. Dynamiczna lista updateuje się gdy klient zmienia w panelu.
type: instinct
scope: all-clients
trigger: budowa homepage / sekcja "wyróżnione oferty" / audyt
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "Nasze apartamenty ta sekcja ma być automatycznie z wyroznionych, cemu zrobiłeś hard coded 3 obiekty w panelu i jak jest np 0 wyronionych to je widac? Zmien to 0 ma byc rowne zero, nie wiem po co ten hard code?"
---

# Instynkt: Featured offers — ZERO hardcoded fallback

## Problem (AP v1.0-v1.6)
Homepage miała 3 hardcoded `<article class="ap-offer-card">` w HTML
jako "fallback" gdy JS nie zadziała. Konsekwencje:
- Gdy klient ma **0 wyróżnionych** w panelu → hardcoded cards i tak widać
- Gdy klient **zmienia** wyróżnione (usuwa/dodaje) → hardcoded się nie
  zmienia, więc strona pokazuje stare dane obok nowych
- Gdy klient **dodaje nowy apartament** jako wyróżniony → nie pojawia
  się jeśli JS padnie lub zdeduplikuje

User: "jak jest np 0 wyróżnionych to je widać" — klient test-uje z 0
w panelu, widzi 3 stare. Frustracja.

## Reguła

### HTML (body_top homepage)
```html
<section class="ap-apartments" id="ap-apartments">
  <div class="ap-apartments__header">
    <span class="ap-kicker">Oferta</span>
    <h2>Nasze <em>apartamenty</em></h2>
  </div>

  <!-- Grid wypełniany AUTOMATYCZNIE przez buildOfferCards()
       z systemowych "Wyróżnionych ofert" (.container-hotspot).
       Sekcja jest UKRYWANA gdy 0 wyróżnionych. -->
  <div class="ap-apartments__grid ap-featured-fallback"></div>
</section>
```

**ZERO** hardcoded `<article>` w środku grid.

### JS (AP_KONIEC_BODY.html §13)
```javascript
function buildOfferCards() {
  var hotspot = document.querySelector('.container-hotspot');
  var grid = document.querySelector('.ap-apartments__grid');
  var section = document.querySelector('.ap-apartments');
  if (!grid || !section) return;

  // Guard — raz tylko
  if (grid.hasAttribute('data-ap-featured-loaded')) return;

  if (!hotspot) return;  // retry later

  var offers = hotspot.querySelectorAll('.slick-slide:not(.slick-cloned) .offer');
  if (!offers.length) offers = hotspot.querySelectorAll('.offer');

  // 0 wyróżnionych → hide section
  if (!offers.length) {
    section.style.display = 'none';
    grid.setAttribute('data-ap-featured-loaded', 'empty');
    return;
  }

  // >0 → build cards (code snipped)
  grid.classList.remove('ap-featured-fallback');
  grid.setAttribute('data-ap-featured-loaded', String(cards.length));
  // ... generate cards
}

function initFeaturedOffers() {
  [0, 400, 1200, 2500].forEach(function (delay) {
    setTimeout(buildOfferCards, delay);
  });

  // Final guard po 4s: jeśli nadal brak hotspot → hide
  setTimeout(function () {
    var grid = document.querySelector('.ap-apartments__grid');
    var section = document.querySelector('.ap-apartments');
    if (grid && section && !grid.hasAttribute('data-ap-featured-loaded')) {
      section.style.display = 'none';
      grid.setAttribute('data-ap-featured-loaded', 'empty');
    }
  }, 4000);
}
```

### Dlaczego retry z różnymi delay
System IdoBooking renderuje `.container-hotspot` asynchronicznie przez
Slick carousel (zewnętrzny JS `index.js`). Typowy timeline:
- 0ms — body_top już w DOM, ale hotspot jeszcze nie
- 400ms — zazwyczaj hotspot pojawia się tu
- 1200-2500ms — na wolnym łączu
- 4000ms — final guard (albo się pojawi, albo jest 0 wyróżnionych)

## Testy które MUSZĄ pass

### Test 1: Klient ma 3 wyróżnione
- Sekcja widoczna
- 3 karty z brand-styled design
- Klik → `/offer/{id}/slug` ✓

### Test 2: Klient usuwa wyróżnione → 0
- Reload strony
- Sekcja "Nasze apartamenty" **znika** (`display: none`)
- Pusty gap nie występuje (następna sekcja jedzie w górę)

### Test 3: Klient dodaje 4te wyróżnione
- Reload
- Wszystkie 4 karty renderują
- Grid `minmax(280px, 1fr)` responsive

### Test 4: Bardzo wolny link + retry
- Throttle do 3G
- Po 4s: karty renderują (jeśli były) lub sekcja hidden (jeśli 0)

## Co NIE robić

❌ **Nie dodawaj hardcoded `<article class="ap-offer-card">` w HTML body_top**.
   Nawet "na wszelki wypadek". User zobaczy je gdy coś pójdzie nie tak.

❌ **Nie rób fallback "pokażemy przykładowe apartamenty jeśli JS padnie"**.
   JS nie pada (już to testujemy z retry). Lepsze: hide section niż
   pokazać fake offers.

❌ **Nie zapomnij o `data-ap-featured-loaded` guard**. Bez tego JS wpada
   w infinite loop przy retry — odczytuje tą samą listę wielokrotnie.

❌ **Nie używaj `.ap-featured-fallback` jako CSS selector z display:block**.
   Ta klasa = "grid nie wypełniony, czeka na JS". CSS nie powinien jej
   używać do pokazywania cokolwiek.

## CSS
```css
/* Default: grid widoczny ale pusty — czeka na JS */
.ap-apartments__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  min-height: 0;           /* nie rezerwuj miejsca */
}

/* Gdy JS załadował 0 → section hidden przez style.display='none' z JS */
/* Gdy JS załadował N>0 → grid ma karty, section widoczna */
```

## Weryfikacja live
```javascript
// DevTools console na /
document.querySelector('.ap-apartments__grid').getAttribute('data-ap-featured-loaded');
// "3" = 3 karty OK; "empty" = 0 wyróżnionych, section hidden; null = JS nie ran yet
```

## Referencja
- Client: apartamenty-parkowe (client58154)
- JS: `AP_KONIEC_BODY.html` §13 buildOfferCards + initFeaturedOffers
- HTML: `GLOWNA_PL/EN__cms.html` — section z pustym gridem
- User feedback 2026-04-21: "0 ma byc rowne zero, nie wiem po co ten hard code?
  I pamietaj, ze to ma dzialac, jak dodac też nowe oviekty w wyroznioncyh
  to jest bardzo wazne, zebys to dobrze zrobil i przetestowal."
- Related: MADERA/NAJMAR ten sam pattern (CLAUDE.md "Wyróżnione oferty
  — OBOWIĄZKOWY WZORZEC")
