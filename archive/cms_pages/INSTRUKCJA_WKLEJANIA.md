# INSTRUKCJA WKLEJANIA DO CMS IdoSell/IdoBooking

## KROK 1 – CSS (zrób to PIERWSZE)

**Gdzie:** Panel CMS → Arkusz stylów CSS → prawy panel `custom.css`

**Co:** Wklej całą zawartość pliku `00_CUSTOM_CSS_v2.css`

> ⚠️ Zachowaj istniejące linie na początku (ukrycia telefonu) – są już w pliku.

---

## KROK 2 – Strona główna

**Gdzie:** Strony → Strona główna → edycja → pole **Treść** (HTML)
**Plik:** `01_STRONA_GLOWNA.html`
- Tytuł w menu: `Strona główna`
- Nagłówek strony: (zostaw pusty)

---

## KROK 3 – Apartamenty (istniejąca strona /txt/201)

**Gdzie:** Strony → Apartament (już istniejąca) → edycja → pole **Treść** (HTML)
**Plik:** `02_APARTAMENTY.html`
- Tytuł w menu: `Apartamenty`
- Nagłówek strony: `Nasze apartamenty`

---

## KROK 4 – Eagle Nest

**Opcja A (zalecana):** Oferty → znajdź ofertę nr 10 (Eagle Tower Costa Blanca) → edycja → pole Opis
**Opcja B:** Strony → Dodaj nową stronę
**Plik:** `03_EAGLE_NEST.html`
- Tytuł w menu: `Eagle Nest`
- Nagłówek strony: `Eagle Nest`

---

## KROK 5 – Eagle View

**Opcja A (zalecana):** Oferty → znajdź ofertę nr 11 (Eagle View) → edycja → pole Opis
**Opcja B:** Strony → Dodaj nową stronę
**Plik:** `04_EAGLE_VIEW.html`
- Tytuł w menu: `Eagle View`
- Nagłówek strony: `Eagle View`

---

## KROK 6 – Eagle Tower & Udogodnienia (NOWA strona)

**Gdzie:** Strony → **Dodaj nową stronę**
**Plik:** `05_EAGLE_TOWER_UDOGODNIENIA.html`
- Tytuł w menu: `Eagle Tower & Udogodnienia`
- Nagłówek strony: `Eagle Tower & Udogodnienia`
- Widoczna: Tak
- Alias URL: `eagle-tower-udogodnienia`

---

## KROK 7 – Lokalizacja (NOWA strona)

**Gdzie:** Strony → **Dodaj nową stronę**
**Plik:** `06_LOKALIZACJA.html`
- Tytuł w menu: `Lokalizacja`
- Nagłówek strony: `Lokalizacja`
- Widoczna: Tak
- Alias URL: `lokalizacja`

---

## KROK 8 – Atrakcje w okolicy (NOWA strona)

**Gdzie:** Strony → **Dodaj nową stronę**
**Plik:** `07_ATRAKCJE_W_OKOLICY.html`
- Tytuł w menu: `Atrakcje w okolicy`
- Nagłówek strony: `Atrakcje w okolicy`
- Widoczna: Tak
- Alias URL: `atrakcje-w-okolicy`

---

## KROK 9 – Galeria (NOWA strona)

**Gdzie:** Strony → **Dodaj nową stronę**
**Plik:** `08_GALERIA.html`
- Tytuł w menu: `Galeria`
- Nagłówek strony: `Galeria`
- Widoczna: Tak
- Alias URL: `galeria`

> 💡 Po wklejeniu galerii – dodaj zdjęcia przez moduł galerii CMS lub wstaw tagi `<img>` zamiast emoji w sekcjach `.et-gallery-album__thumb`

---

## KROK 10 – Menu (kolejność)

Po dodaniu wszystkich stron, ustaw kolejność w menu:
1. Strona główna
2. Apartamenty
3. Eagle Nest
4. Eagle View
5. Eagle Tower & Udogodnienia
6. Lokalizacja
7. Atrakcje w okolicy
8. Galeria
9. Kontakt

---

## Linki wewnętrzne do sprawdzenia po wklejeniu

W plikach HTML są linki href – upewnij się, że odpowiadają faktycznym URL-om w Twoim CMS:

| Link w kodzie | Gdzie powinien prowadzić |
|---|---|
| `/apartamenty` | strona listingowa apartamentów |
| `/eagle-nest` | podstrona Eagle Nest |
| `/eagle-view` | podstrona Eagle View |
| `/eagle-tower-udogodnienia` | podstrona udogodnień |
| `/lokalizacja` | podstrona lokalizacji |
| `/atrakcje-w-okolicy` | podstrona atrakcji |
| `/galeria` | podstrona galerii |
| `/kontakt` | strona kontakt |

Jeśli CMS generuje inne URL-e (np. z numerami), podmień linki w plikach HTML przed wklejeniem.
