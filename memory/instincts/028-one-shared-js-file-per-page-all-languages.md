# INSTYNKT 028: Jeden uniwersalny plik JS dla wszystkich wersji jezykowych

## Regula
Dla KAZDEJ sekcji dynamicznej (wyroznione oferty, galeria, kontakty, wycieczki itd.)
tworzysz JEDEN plik `XX_NAZWA_JS.html` obslugujacy WSZYSTKIE jezyki rownoczesnie.

NIE tworzysz `XX_NAZWA_JS.html`, `XX_NAZWA_JS_EN.html`, `XX_NAZWA_JS_RU.html` osobno.

## Dlaczego
- 1 plik do wklejenia (pole globalne Kody sledzace / Koniec BODY — nie per podstrona)
- 1 miejsce do zmiany — brak desync miedzy wersjami
- Grzybek/GeoStay (2026-04-22): RU mial zupelnie inna logike od PL/EN przez blad przy
  tworzeniu osobnych plikow — hardcoded fallback, inline script w body_top, brak JS_RU.
  Gdyby byl 1 plik — blad niemozliwy.

## Jak stosowac

### Autodetekcja jezyka
```js
var LANG = (document.documentElement.lang || location.pathname.match(/^\/(pl|en|ru|de|cs|uk)\//i)?.[1] || 'pl').toLowerCase().substring(0, 2);
```

### Tabela labelek
```js
var L = {
  pl: { nightly: '/ noc', guests: function(n){ return n===1?'1 osoba':(n<5?n+' osoby':n+' osob'); }, ac: 'Klimatyzacja', from: 'od' },
  en: { nightly: '/ night', guests: function(n){ return n===1?'1 guest':n+' guests'; }, ac: 'Air conditioning', from: 'from' },
  ru: { nightly: '/ nocz', guests: function(n){ return n===1?'1 gost':(n>=2&&n<=4?n+' gostia':n+' gostei'); }, ac: 'Konditsioner', from: 'ot' },
  de: { nightly: '/ Nacht', guests: function(n){ return n+(n===1?' Gast':' Gaste'); }, ac: 'Klimaanlage', from: 'ab' }
}[LANG] || L.pl;
```
(W praktyce uzywaj prawdziwych znakow UTF-8, powyzej latinizacja dla przykladu w tym pliku instinct).

### Uzycie
```js
html += L.from + ' ' + priceNum + currency + ' <span>' + L.nightly + '</span>';
html += buildFeatureIcon(L.guests(parseInt(o.guests, 10)));
html += buildFeatureIcon(L.ac);
```

## Gdzie wkleic w panelu
JEDNO miejsce dla wszystkich jezykow:
- **Panel IdoSell → Administracja → Kody sledzace → Koniec BODY** (globalne, dziala na kazdej podstronie kazdego jezyka)
- LUB jesli klient nie ma dostepu do Kody sledzace: Strona glowna PL → pole "Koniec body"
  i dodatkowo zduplikowac do EN/RU podstron strony glownej

Preferowane: Kody sledzace (1 miejsce, wszystkie strony).

## Struktura pliku JS
```html
<script>
(function() {
  'use strict';
  var LANG = /* autodetect */;
  var L = /* labels table */;
  /* logic uses L.xxx */
})();
</script>
```

Komentarzy JARVIS (URL panelu, "wklej do X", emoji) — NIGDY (instinct 027).

## Wyjatki
Jeden per-jezyk JS dopuszczalny TYLKO gdy logika rozni sie istotnie (np. inny booking engine
per region, inne pola formularza, inny regex parsing). W 99% przypadkow: 1 plik, tabela labelek.
