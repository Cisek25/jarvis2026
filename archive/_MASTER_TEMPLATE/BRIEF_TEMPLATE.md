# Brief — Nowa Strona IdoSell/IdoBooking

Wypełnij ten formularz i wrzuć do Claude. System automatycznie zbuduje stronę.

---

## 1. Dane Klienta

| Pole | Wartość |
|------|---------|
| **Nazwa firmy** | |
| **Client ID** | clientXXXXX |
| **URL panelu** | https://clientXXXXX.idosell.com/ |
| **Domena** (jeśli jest) | |
| **Telefon** (bez spacji!) | +48XXXXXXXXX |
| **Email** | |
| **Adres** | |

## 2. Typ Obiektu

Zaznacz co pasuje:
- [ ] Pokoje (hotel/pensjonat)
- [ ] Apartamenty
- [ ] Domki/Ville
- [ ] Namioty/Glamping
- [ ] Inne: _______________

**Liczba ofert w panelu**: ___
**Nazwy ofert** (np. "Pokój Deluxe", "Apartament Morski"):
1.
2.
3.
4.

## 3. Styl Wizualny

### Paleta kolorów (wybierz jedną lub opisz swoją):

**A) Nature** — zieleń + drewno (pensjonaty, ekoturystyka)
- Primary: #4A6741 (mech) | Secondary: #8B7355 (drewno) | BG: #F5F1EB (krem)

**B) Ocean** — granat + piasek (nadmorskie)
- Primary: #1B3A5C (ocean) | Secondary: #D4A574 (piasek) | BG: #F8F6F2 (perła)

**C) Gold Luxury** — złoto + ciemny (premium)
- Primary: #C8A45C (gold) | Secondary: #2C2C2C (dark) | BG: #1A1A1A (night)

**D) Mountain** — brąz + kamień (góry)
- Primary: #6B4226 (brąz) | Secondary: #8C8C7A (kamień) | BG: #F4F0E8 (piaskowiec)

**E) Fresh** — niebieski + biel (nowoczesne)
- Primary: #2E86AB (sky) | Secondary: #A4C3B2 (mint) | BG: #FFFFFF (biel)

**F) Warm** — terakota + oliwka (wiejskie, agro)
- Primary: #C4572A (terakota) | Secondary: #7C8C56 (oliwka) | BG: #FAF5EF (len)

**Wybór**: ___ (A/B/C/D/E/F lub opisz: ___________________)

### Fonty (wybierz parę lub opisz):

| # | Heading (nagłówki) | Body (tekst) | Charakter |
|---|-------------------|--------------|-----------|
| 1 | Playfair Display | Inter | Elegancki, luxury |
| 2 | Merriweather | Inter | Klasyczny, ciepły |
| 3 | DM Serif Display | Inter | Nowoczesna elegancja |
| 4 | Cormorant Garamond | Lato | Wyrafinowany, lekki |
| 5 | Montserrat | Open Sans | Nowoczesny, czysty |
| 6 | Libre Baskerville | Source Sans 3 | Tradycyjny, czytelny |
| 7 | Lora | Nunito | Miękki, przystępny |
| 8 | Cinzel | Raleway | Monumentalny, premium |

**Wybór**: ___ (1-8 lub opisz: ___________________)

## 4. Podstrony

### Strona główna — co ma zawierać:
- [ ] Hero (slider ze zdjęciami z panelu)
- [ ] Karty ofert (zdjęcia i linki do pokoi/apartamentów)
- [ ] Sekcja "O nas" / features
- [ ] Sekcja lokalizacja / mapa / okolicy
- [ ] CTA (rezerwuj teraz)
- [ ] Inne: _______________

### Podstrony — jakie potrzebne:
- [ ] Atrakcje okolicy
- [ ] Galeria
- [ ] Cennik (jeśli nie systemowy)
- [ ] Dla Właścicieli (B2B landing)
- [ ] Regulamin
- [ ] FAQ
- [ ] Inne: _______________

## 5. Zdjęcia

- [ ] Klient ma zdjęcia w panelu (slider + oferty)
- [ ] Trzeba znaleźć na Wikimedia Commons (podaj lokalizację: ___________)
- [ ] Klient dostarczy osobno

## 6. Wersja Językowa

- [ ] Tylko PL
- [ ] PL + EN
- [ ] PL + EN + DE
- [ ] Inne: _______________

## 7. Uwagi Dodatkowe

(cokolwiek specjalnego — np. logo, specjalne sekcje, integracje, promo bar):

_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

## Dla Claude — Workflow po otrzymaniu briefu:

1. **Recon** → Otwórz panel, zmierz header, sprawdź oferty, zdjęcia
2. **Design** → Ustaw prefix, kolory, fonty z briefu
3. **CSS** → Zbuduj §0-§14 z MASTER_TEMPLATE, zamień placeholdery
4. **HTML** → Homepage CMS + podstrony z PRAWDZIWYMI zdjęciami
5. **JS** → body_bottom z 8 sekcjami
6. **TEST** → Uruchom test_links.js + test_full_audit.js na KAŻDEJ stronie
7. **AUDIT** → Grade A na każdej stronie
8. **INSTRUKCJA** → Wypełnij INSTRUKCJA_TEMPLATE.txt danymi klienta
9. **DELIVER** → Folder DO_WKLEJENIA gotowy
