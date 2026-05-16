---
name: pexels-photo-visual-verify
description: Po wyborze zdjęcia z Pexels ZAWSZE otwórz URL i obejrzyj wizualnie. Atrybut `alt` lub opis w searchu może kłamać ("Drone shot of Gniezno Poland" może pokazywać miasto sąsiednie). Klient natychmiast zauważy.
type: instinct
scope: all-clients
trigger: dodawanie zdjęć do kart atrakcji / galerii / blogu z Pexels/Unsplash
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "Jezioro Jelonek to nie jest to miejsce na zdjęciu"
related: instinct 008 (subpage-no-contact-duplication, zdjęcia atrakcji)
---

# Instynkt: Pexels — weryfikuj wizualnie, nie ufaj opisowi

## Problem
Search Pexels "gniezno" zwraca photos oznaczone tagami. Jedno zdjęcie
opisane jako "Drone shot of Gniezno Poland" — tag może być BŁĘDNY
(photographer dodał tag ale fotka z sąsiedniego miasta) lub OGÓLNY
(aerial view Polski generalnie, bez konkretnego miejsca).

Użyłem ID `14780317` dla karty "Jezioro Jelonek". Klient (mieszka w
Gnieźnie): "to nie jest to miejsce na zdjęciu". Bo fotka pokazuje
Gniezno z lotu ptaka ale inne miejsce, nie Jelonek.

## Reguła

### 1. NIGDY nie ufaj `alt` / opisowi w liście z Pexels search
Opisy są generowane przez photographer-a lub AI. Często wprowadzają
w błąd (miasto sąsiednie, inne jezioro, inne zabytki).

### 2. Otwórz URL zdjęcia → obejrzyj PRZED wstawieniem

Ręcznie:
1. Kliknij w URL: `https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg`
2. Zobacz zdjęcie
3. Czy TO JEST rzeczywiście {attraction}? Jeśli nie pewny — **nie używaj**

Alternatywa: pytaj klienta przed deploy. Lepiej zero obrazka niż zły obrazek.

### 3. Dla konkretnych landmarków — GALERIA klienta
Jeśli klient ma zdjęcia obiektu/okolicy w IdoBooking gallery:
`/images/frontpageGallery/pictures/large/{id}/{id}/{file}.jpg`
**Te są pewne** — klient je wgrał sam.

### 4. Dla generic places (park, rynek) — Pexels OK
Generyczne zdjęcia "autumn park", "medieval town square" — pasują
nawet jeśli nie z tego miasta. User nie zauważy.

### 5. Dla specyficznych landmarków — generic + alt z opisem

Gdy nie masz pewnego zdjęcia konkretnego landmarku:

**❌ Nie rób**: Pexels photo z tagiem "Jezioro Jelonek" jeśli nie
pewny (klient zauważy).

**✅ Rób**: Pexels photo "European lake" z alt "Spokojne jezioro
w parku — refleksy drzew w wodzie". Użytkownik czyta alt jako
ilustrację, a nie dokumentację.

## Bezpieczne zdjęcia dla typowych kart

| Atrakcja typu | Safe Pexels ID | Opis |
|---------------|----------------|------|
| Park miejski | 35005646 | Autumn park avenue Lower Saxony |
| Rynek polski | 17042818 | Poznań Old Town Hall |
| Rynek europejski | 15278400 | Wrocław Market Square |
| Katedra gotycka | 15959785 | Gothic archcathedral European |
| Jezioro spokojne | 29305259 | Autumn lake reflection Hollenstedt |
| Lake + statue | 37144935 | Statue by lake with cathedral |

Te są GENERYCZNE — żaden klient nie zweryfikuje że to "nie jego".

## Kiedy używać konkretnego landmarku
TYLKO gdy masz 100% pewność (np. widziałeś na Wikimedia z georeferencją)
lub klient sam wskazał zdjęcie. W przeciwnym razie — generyczne.

## Weryfikacja po wyborze
```bash
# URL test (200 + sensible size)
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" \
  "https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg"
# 200 + >100KB = working

# Wizualnie:
open "https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg"
# Sprawdź: czy to pasuje do karty? (np. lake, park, cathedral)
```

## Historia AP
- **v1.3** (2026-04-21): wybrane 6 zdjęć dla Lokalizacji, m.in.
  14780317 jako "Jezioro Jelonek" — nie zweryfikowane wizualnie
- **v1.8.4** (2026-04-21): user zgłosił "to nie Jelonek". Zmienione
  na 29305259 (generic European lake) + alt "Spokojne jezioro w parku"

## Referencja
- Client: apartamenty-parkowe (client58154)
- Files: `LOKALIZACJA_PL/EN__body_top.html` karta #5
- User feedback: "Jezioro Jelonek to nie jest to miejsce na zdjęciu"
- Related: instinct 008 (attraction cards ze zdjęciami)
