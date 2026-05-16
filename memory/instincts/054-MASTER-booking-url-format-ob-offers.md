# Instinct 054 — MASTER: BOOKING_URL filter format `ob[N]`

**Pochodzenie:** piekary13, sesja 2026-05-08 v4. Klient reported "iframe pokazuje wszystkie oferty zamiast tylko obiekt".

## Problem

Chcąc otworzyć silnik rezerwacji IdoBooking w iframe-modal Z FILTREM na konkretne oferty obiektu, błędnie używałem formatu:

```
https://client23326.idobooking.com/book-now/booking/defaultchoice/currency/0/language/0/location/16,23&showOtherOffers=1&transparentbackground=1&from_own_button=1
```

Ten format **NIE FILTRUJE** lub `showOtherOffers=1` literalnie znaczy "pokaż TEŻ inne oferty" → silnik ignoruje location.

## Fix — poprawny format

Filtrowanie idzie przez **ID OFERT** (`ob[N]`), nie przez ID lokalizacji:

```
https://client23326.idobooking.com/book-now/booking/defaultchoice/currency/0/language/0?ob[183]&ob[192]&ob[193]&ob[184]&ob[185]&ob[186]&ob[187]&ob[188]&ob[189]&ob[190]&ob[191]&transparentbackground=1&from_own_button=1
```

Struktura:
- Path: `/book-now/booking/defaultchoice/currency/0/language/0`
- Query: `?` SEPARATOR (nie `&` po path), potem `ob[NUMER_OFERTY]` per oferta + `&` separator
- Dodatkowe: `transparentbackground=1` (białe tło), `from_own_button=1` (ukrycie systemowych elementów)

## Skąd wziąć ID ofert

Panel IdoBooking → Oferty → lista ofert. Każda ma ID widoczne w URL podglądu (`/offer/{ID}/{slug}`).

Dla piekary13: 11 apartamentów to ID 183-193.

## Weryfikacja przez Playwright MCP

```js
window.pkOpenBooking();
await new Promise(r => setTimeout(r, 1500));
const iframe = document.querySelector('.pk-booking-modal__iframe');
const url = new URL(iframe.src);
const obParams = Array.from(url.searchParams.entries()).filter(([k]) => k.startsWith('ob['));
// obParams.length powinien == liczba apartamentów
```

## Symptom z perspektywy klienta

"Przycisk REZERWUJ pokazuje wszystkie oferty zamiast samego obiektu" / "Iframe nie jest ograniczony do moich apartamentów".

## Aktualizacja przy dodawaniu/usuwaniu ofert

Gdy klient doda nową ofertę — dodaj `ob[NEW_ID]` w BOOKING_URL w KONIEC_BODY.html. Usuwając — usuń odpowiedni ob[N].
