# Zdjęcia do pobrania — Fair Rentals v1.0

Damianie, poniżej lista wszystkich zewnętrznych URL-i zdjęć użytych w plikach v1.0.
Zdjęcia apartamentów (oferty) zostają w panelu IdoBooking — nie ruszamy.

Te zdjęcia w finalnej wersji powinny zostać pobrane i wgrane do galerii klienta
w panelu (`/images/frontpageGallery/...` lub odpowiednia kategoria), a w plikach
HTML URL-e zostaną podmienione na lokalne ścieżki klienta. Do tego czasu strona
działa z URL-ami Unsplash (zewnętrzny CDN, hotlinking dozwolony — license free).

NIE używamy Wikimedia (HTTP 429 — instinct 029). Tylko Unsplash i Pexels.

## Hero stron i sekcje (8 plików, użyte wielokrotnie)

| Cel | URL | Krótki opis | Strona |
|---|---|---|---|
| Hero główny + OG | https://images.unsplash.com/photo-1522708323590-d24dbb6b0267 | Stylowe wnętrze apartamentu w ciepłej tonacji | Home PL/EN |
| Hero strony O nas (about split) | https://images.unsplash.com/photo-1560448204-e02f11c3d0e2 | Eleganckie wnętrze z naturalnym światłem | Home PL/EN |
| Hero "Dla Biznesu" subpage | https://images.unsplash.com/photo-1497366216548-37526070297c | Wnętrze biurowe / coworking | Dla biznesu PL/EN |
| Hero "Obsługa najmu" subpage | https://images.unsplash.com/photo-1556909114-f6e7ad7d3136 | Klucz w drzwiach apartamentu | Obsługa najmu PL/EN |
| Sekcja workplace (corp split + Dla biznesu split) | https://images.unsplash.com/photo-1582719478250-c89cae4dc85b | Biurko z laptopem w apartamencie | Home PL/EN, Dla biznesu PL/EN |
| Sekcja "Why owners" + reputation | https://images.unsplash.com/photo-1600585154340-be6161a56a0c | Sprzątnięty apartament gotowy na gościa | Obsługa najmu PL/EN |
| Sekcja "How it works" — meeting | https://images.unsplash.com/photo-1554224155-6726b3ff858f | Spotkanie biznesowe / podpis umowy | Obsługa najmu PL/EN, Dla biznesu PL/EN |
| Sekcja "Numbers" reputation | https://images.unsplash.com/photo-1551776235-dde6d4829808 | Klimatyczne wnętrze apartamentu | Obsługa najmu PL/EN |

## Atrakcje Wrocławia (6 zdjęć × 2 lokalizacje użycia: home teaser + atrakcje detail)

| Atrakcja | URL | Komentarz |
|---|---|---|
| Rynek Główny | https://images.unsplash.com/photo-1573599852326-2d4da0bbe613 | UWAGA: zdjęcie to placeholder (kolorowe kamienice), zweryfikuj że pokazuje rzeczywisty Wrocław. Jeśli nie — Pexels search "Wroclaw market square" |
| Ostrów Tumski | https://images.unsplash.com/photo-1568797629192-908b1cce0aaa | UWAGA: placeholder gotyckiej architektury. Zweryfikuj |
| Hala Stulecia | https://images.unsplash.com/photo-1605270012917-bf357a1fae9e | UWAGA: placeholder modernistycznej architektury. Zweryfikuj |
| Bulwary nad Odrą | https://images.unsplash.com/photo-1592454869436-1c350e3a37cd | UWAGA: placeholder rzeki o zmierzchu. Zweryfikuj |
| Park Szczytnicki | https://images.unsplash.com/photo-1551966775-a4ddc8df052b | UWAGA: placeholder parku miejskiego |
| Hydropolis | https://images.unsplash.com/photo-1559925393-8be0ec4767c8 | UWAGA: placeholder wnętrza muzeum |

## Polecane zamienniki specyficzne dla Wrocławia (Pexels — license free)

Te URL-e są placeholder Unsplash. **Rekomenduję pobrać autentyczne zdjęcia
Wrocławia** (Rynek z Ratuszem, Ostrów Tumski z latarniami gazowymi, Hala
Stulecia widok z lotu ptaka itp.) i wgrać do galerii klienta. Następnie podmień
URL-e w plikach:

- `GLOWNA_PL__cms.html` linie ze sekcji "Atrakcje teaser" (4 obrazy)
- `GLOWNA_EN__cms.html` to samo
- `ATRAKCJE_WROCLAWIA_PL__body_top.html` (6 obrazów)
- `ATRAKCJE_WROCLAWIA_EN__body_top.html` (6 obrazów)

### Sugerowane zapytania wyszukiwania Pexels / Unsplash:

```
Rynek Wrocław:           pexels "Wroclaw market square"
Ostrów Tumski:           pexels "Wroclaw cathedral island"
Hala Stulecia:           pexels "Wroclaw centennial hall" or "hala stulecia"
Bulwary Odry:            pexels "Wroclaw odra river" or "Wroclaw bridges"
Park Szczytnicki / Ogród Japoński: pexels "Wroclaw japanese garden"
Hydropolis:              flickr / IG hashtag #hydropolis (pobranie z opfic. strony jeśli mają free)
```

## Jak pobrać i podstawić (workflow Damian)

1. Wejdź na URL Unsplash z tabeli, kliknij "Download free" w wysokiej rozdzielczości (>= 2400px)
2. Wgraj plik do panelu IdoSell: Galeria → Galeria strony głównej → Dodaj
3. Skopiuj URL który nada panel (format `https://client58360.idobooking.com/images/frontpageGallery/pictures/large/{N1}/{N2}/{filename}.jpg`)
4. Podmień URL w odpowiednim pliku HTML (Find & Replace)
5. Zapisz, wklej zaktualizowany plik do panelu

Po podmianie wszystkich 14 URL-i (8 hero/section + 6 atrakcji) ukończony jest
trap #29 (instinct: NIGDY zewnętrzny CDN dla finalnej wersji jeżeli klient ma
galerię własną).

## Co już jest na panelu (z briefu i live)

- Logo: `/images/owner/wideLogo.svg` — gotowe, używane w plikach
- Apartamenty (oferty): 2 wyróżnione testowo, 17 reszta dostępna w panelu
  - Karty Featured Offers na home są generowane automatycznie z panelu (Pattern A)
  - Po zaznaczeniu kolejnych w "Wyróżnione" w panelu — strona się zaktualizuje
