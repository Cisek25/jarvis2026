# MADERA — Odpowiedz na feedback klientki

## CO ZOSTALO ZMIENIONE W PLIKACH (do wklejenia)

### 1. Nowa strona glowna (PL + EN)
- **Nowe haslo**: "Komfortowe apartamenty przy Parku Slaskim i Stadionie"
  (zamiast "Noclegi Katowice / Zapraszamy")
- **Usunieto "10% nizsze"** — zastapione: "Najlepsza cena bezposrednio"
  (bez konkretnych procentow, bez odwolania do Booking.com)
- **"Trzy marki" → usuniety statyczny blok** — zamiast statycznych kart
  z recznymi zdjeciami, teraz SKRYPT w body_bottom automatycznie czyta
  dane z systemowej sekcji "Wyroznione Oferty" (ukrytej przez CSS)
  i buduje wlasne, ladne karty z: zdjeciem, titulem, opisem, metraza,
  liczba gosci i przyciskiem "Zobacz szczegoly". Grid 2 kolumny,
  hover z podniesieniem karty i zlotym titulem.
  Zdjecia i opisy ciagnie automatycznie z panelu IdoBooking.
  Wystarczy w panelu zaznaczyc ktore pokoje sa "wyroznione"
- **"Dlaczego my?" przeniesione na pozycje 2** — od razu po intro,
  widoczne bez scrollowania (paczkomat, check-in, parking, kontakt, pet-friendly)
- **NOWA sekcja emocjonalna "Wyobraz sobie"** — ciemne tlo, lifestyle copy:
  poranek w Parku, wieczor po koncercie, rodzinny weekend, biznesowy spokoj, Momenti Piccanti
- **Zaktualizowane odleglosci** wg klientki
- **Usunieto duplikat H1** (problem SEO)

### 2. Zaktualizowane ATRAKCJE (PL + EN)
- Park Slaski: "bezposrednio" → "10 min spacerem"
- Stadion Slaski: "2 min pieszo" → "15 min spacerem"
- Intro text dopasowany do nowych odleglosci

### 3. Nowe klasy CSS + JavaScript
- CSS ukrywa systemowe "Wyroznione Oferty" (.container-hotspot → display: none)
- JavaScript czyta dane z ukrytej sekcji i buduje wlasne karty (#md-offers)
  → zaokraglone karty, zlote przyciski, hover z podniesieniem, ciepla paleta
  → grid 2 kolumny (1 kolumna na mobile), ikony SVG dla metrazu i gosci
- Pomocniki (.md-section__actions, ghost button w CTA bar)

---

## CO KLIENTKA MUSI ZMIENIC W PANELU IdoBooking

### A) Tekst w sliderze na stronie glownej (HERO)
Panel → Strona glowna → Slider/Banner → Edytuj
- **Tytul**: zmien z "NOCLEGI KATOWICE" na np.:
  - Opcja 1: "MADERA CENTRUM"
  - Opcja 2: "Apartamenty w Katowicach"
  - Opcja 3: "Twoja baza przy Parku Slaskim"
- **Podtytul**: zmien z "ZAPRASZAMY" na np.:
  - "Pokoje i apartamenty dla rodzin, par i podroznych"
  - lub zostaw puste (tresc jest w body_top)

### B) Kod pocztowy (blad "0000")
Panel → Ustawienia → Dane obiektu → Adres
- Zmien "00-000" na prawidlowy: **40-149**
- Pole "Miasto": **Katowice**
- Pole "Ulica": **Bytomska** (z numerem)

### C) Ceny (za wysokie)
Panel → Cennik → Lista pokoi → edytuj ceny
- Klientka chce, zeby ceny bezposrednie byly NIZSZE niz na Booking.com
  (nawet minimalnie, ale realnie korzystniejsze)
- Sprawdz aktualne ceny na Booking.com z Genius → ustaw u siebie nizej
- Mozna tez ustawic **kupon rabatowy** w panelu → Marketing → Kupony

### D) Zdjecia w galerii — NAPRAWIONE
Galeria zostala przebudowana — zdjecia sa teraz poprawne.
Kazdy typ oferty (Pokoj, Apartament Delux, Loft, Flores, Rooms Silesia,
Momenti Piccanti) ma zdjecia pobrane bezposrednio ze swojej oferty.
- **Trzeba ponownie wklejac pliki galerii** (KROK 5 + KROK 6 w INSTRUKCJA.txt)
- Jesli zdjecia w panelu IdoBooking sa wlasciwe, galeria na stronie
  bedzie je wiernie odzwierciedlac
- Aby zmienic zdjecia w galerii: przyslij nam nowe — zaktualizujemy pliki

### E) Rachunek bankowy — usuniecie imienia
Panel → Ustawienia → Dane platnosci / Dane bankowe
- Zmien nazwe konta z "MADERA AGNIESZKA KAWECKA" na: **MADERA**
  lub **MADERA CENTRUM**
- To samo w ustawieniach firmy (jesli jest pole "Nazwa firmy")
  → zmien na samo "MADERA" lub "MADERA CENTRUM"
  (usunie imie z naglowka na podstronach)

### F) Facebook — weryfikacja linku
- Obecny link na stronie: https://www.facebook.com/share/18S4aYyhoa/
- Jesli klientka ma inny profil/strone na FB → przyslij nowy URL
- Panel → Ustawienia → Media spolecznosciowe → Facebook URL

---

## WYSYLANIE OFERT KLIENTOM (instrukcja)

W panelu IdoBooking mozna wysylac oferty bezposrednio:

1. Wejdz w: **Centrum komunikacji → Wiadomosci → Nowa wiadomosc**
2. Wpisz adres email klienta
3. Wybierz szablon oferty lub napisz wlasna wiadomosc
4. Mozesz dolaczyc link do konkretnego pokoju lub daty:
   - Skopiuj URL ze strony /offers z wybranym pokojem
   - Lub uzyj silnika rezerwacji: `https://engine45553.idobooking.com/search?date_from=...`
5. Kliknij "Wyslij"

**Alternatywa — szybsza metoda:**
- Gdy klient pyta o dostepnosc, sprawdz w kalendarzu wolne terminy
- Skopiuj link do rezerwacji z konkretnymi datami i wyslij emailem/SMS
- Format linku: `https://engine45553.idobooking.com/search?date_from=RRRR-MM-DD&date_to=RRRR-MM-DD`

---

## SYNCHRONIZACJA ZDJEC (Booking.com / Airbnb / IdoBooking)

**Wazne**: Zdjecia w IdoBooking, Booking.com i Airbnb sa NIEZALEZNE.
Zmiana na jednym portalu NIE aktualizuje sie automatycznie na innych.

Aby miec spojne zdjecia na wszystkich platformach:

1. **Zrodlo prawdy = IdoBooking**
   - Wgraj najlepsze zdjecia do panelu IdoBooking:
     Panel → Pokoje → [wybrany pokoj] → Zdjecia → Dodaj
   - Te zdjecia beda widoczne na stronie maderacentrum.pl

2. **Booking.com** — zmien zdjecia recznie:
   - Zaloguj sie na Booking.com Extranet
   - Pokoje → Zdjecia → Podmien na te same co w IdoBooking

3. **Airbnb** — zmien zdjecia recznie:
   - Zaloguj sie na Airbnb Host Dashboard
   - Oferta → Zdjecia → Podmien na te same co w IdoBooking

4. **Zasada**: Zawsze zaczynaj od IdoBooking, potem kopiuj na portale.

---

## WYTYCZNE DO ZDJEC LIFESTYLE

Klientka chce dodac zdjecia z "zyciem" — oto co najlepiej dziala:

### Zdjecia, ktore sprzedaja emocje:
- **Poranek z kawa** — filizanka kawy na stoliku przy oknie, naturalne swiatlo
- **Szczegoly wnetrza** — bukiet kwiatow, poduszki, recznie, swiatlo wieczorne
- **Widok z okna** — zielen, ulica, okolica (nawet przez firanke)
- **Przestrzen gotowa na goscia** — scielone lozko, swiezoscrekwizytow na lozku
- **Kuchnia w uzyciu** — owoce na blacie, otwarta ksiazka kucharska
- **Zewnatrz** — wejscie do budynku, okolica, parking

### Techniczne wskazowki:
- Fotografuj przy NATURALNYM swietle (rano lub popoludniu)
- Telefon trzymaj POZIOMO (16:9)
- Unikaj blysku aparatu (plaska, nieatrakcyjna fotografia)
- Sprztaj przed zdjeciem — mniej = lepiej
- Rozdzielczosc: minimum 1920x1080px (full HD)
- Format: JPG, max 5 MB na zdjecie

### Czego unikac:
- Zdjec z osobami (RODO, prawa do wizerunku)
- Zdjec w ciemnosci lub z blyskem
- Zdjec brudnych/niesprztanych pokoi
- Zdjec w pionie (pionowe zdjecia zle wygladaja w galeriach)

---

## CO KLIENTKA MOZE ROBIC SAMA

1. **Zmiana cen** → Panel → Cennik
2. **Dodawanie/zmiana zdjec** → Panel → Pokoje → Zdjecia
3. **Tekst w sliderze** → Panel → Strona glowna → Slider
4. **Dane adresowe** → Panel → Ustawienia → Dane obiektu
5. **Promocje/kupony** → Panel → Marketing → Kupony
6. **Odpowiadanie na rezerwacje** → Panel → Rezerwacje
7. **Wysylanie ofert** → Centrum komunikacji → Nowa wiadomosc

**Co wymaga naszej pomocy:**
- Zmiana tresci HTML na podstronach (body_top / body_bottom)
- Zmiana CSS (style wizualne)
- Tworzenie nowych podstron
- Debugowanie problemow technicznych
