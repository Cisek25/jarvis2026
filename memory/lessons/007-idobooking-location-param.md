# Lesson 007 — IdoBooking Booking Engine: Location Parameter

**Data odkrycia**: 2026-04-16
**Klient**: MIA Apart (client33019) — custom search widget
**Źródło**: Test na baltic-apartments.com (natywny widget) + MIA engine

## Problem

Custom search widget MIA przekierowywał użytkowników do `/offers#warszawa` zamiast do silnika z filtrem lokalizacji. Silnik ignorował tekstowe nazwy miast w URL.

## Rozwiązanie

### Parametr `location` z numerycznymi ID

Silnik IdoBooking akceptuje parametr `location` z **numerycznymi ID** rozdzielonymi **przecinkami**:

```
?location=3,6,7,9,10,11,12
```

### Skąd brać ID lokalizacji?

Każdy klient IdoBooking ma plik `/locations.js` na stronie głównej, który definiuje globalną zmienną:

```javascript
var iai_booking_location = {
  "3": { id: 3, street: "Piwna 45/47", city: "Warszawa", ... },
  "4": { id: 4, street: "Podgrzybkowa 19/2", city: "Jastrzębia Góra", ... },
  ...
};
```

### Natywny widget format

Baltic Apartments natywny widget generuje URL w formacie path-based:
```
/widget/booking/defaultchoice/language/1/location/78/persons-adult/5
```

Ale silnik akceptuje również format query string:
```
/book-now/index.php?language=1&location=78&persons-adult=5
```

### Wiele lokalizacji naraz

Można przekazać listę ID rozdzielonych przecinkami:
```
?location=3,6,7,9,10,11,12,15,16,17,18,20,21,22
```
Silnik filtruje wyniki do tych lokalizacji (ukrywa panel "Lokalizacja" w filtrach).

### Mapowanie nazw → ID

Custom widget powinien:
1. Dynamicznie czytać `iai_booking_location` (global var z locations.js)
2. Grupować po `city` → lista ID
3. Mieć hardcoded fallback na wypadek, gdyby global var nie był dostępny

### MIA Apart — mapowanie lokalizacji (stan na 2026-04-16)

| Miasto | IDs | Liczba |
|--------|-----|--------|
| Warszawa | 3,6,7,9,10,11,12,15,16,17,18,20,21,22 | 14 |
| Jastrzębia Góra | 4,5 | 2 |
| Vila Verde (Cabo Verde) | 13 | 1 |
| Ożarów Mazowiecki | 19 | 1 |

## Reguła

1. **ZAWSZE** przekazuj `location` jako numeryczne ID z `locations.js` (NIE nazwy miast!)
2. **Wiele ID** → rozdziel przecinkami: `location=3,6,7`
3. **Dynamicznie** czytaj `iai_booking_location` jeśli dostępne
4. **Hardcoded fallback** — na wypadek race condition (locations.js nie załadowany)
5. **locations.js** — dostępny na stronie głównej każdego klienta IdoBooking
