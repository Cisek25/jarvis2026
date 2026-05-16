# Lesson 005 — IdoBooking Booking Engine: Guest Count Parameter

**Data odkrycia**: 2026-04-16
**Klient**: MIA Apart (client33019) — custom search widget
**Źródło**: Test na baltic-apartments.com (client10176) — natywny widget IdoBooking

## Problem

Custom search widget budował URL z parametrami `persons=5` i `adults=5`.
Silnik rezerwacyjny IdoBooking **IGNOROWAŁ oba** i pokazywał domyślnie 1-2 osoby.

## Rozwiązanie

Jedyny prawidłowy parametr URL dla liczby gości to:

```
persons-adult
```

**NIE** `persons`, **NIE** `adults`, **NIE** `roomspace` — wszystkie ignorowane.

### Jak odkryto

1. Testowano `persons`, `adults`, `roomspace` w URL — silnik ignorował
2. Na sugestię klienta sprawdzono baltic-apartments.com (natywny widget IdoBooking)
3. Natywny widget generuje URL: `?language=1&persons-adult=5&from_own_button=1`
4. Z parametrem `persons-adult=5` silnik poprawnie pokazuje "LICZBA OSÓB: 5 OS."

### Dodatkowe parametry natywnego widgetu
- `language=1` — język (1=PL)
- `persons-adult=N` — liczba dorosłych gości
- `from_own_button=1` — oznaczenie kliknięcia z własnego buttona
- `dateFrom=YYYY-MM-DD` — data zameldowania
- `dateTo=YYYY-MM-DD` — data wymeldowania

### Uwaga o systemowym elemencie
- `#iai_booking_persons` w DOM — to selektor systemowego selecta (bez atrybutu `name`!)
- Ten select NIE jest submitowany przez formularz — widget JS buduje URL ręcznie
- Jeśli budujesz custom widget, musisz sam dodać `persons-adult` do URL

## Reguła

**ZAWSZE** używaj `persons-adult` jako parametr URL przy przekierowaniu do silnika rezerwacyjnego IdoBooking. Dotyczy:
- Custom search widgetów (jak MIA Apart)
- Przycisków "Rezerwuj" z pre-filtrami
- Jakichkolwiek linków do silnika z parametrami gości
