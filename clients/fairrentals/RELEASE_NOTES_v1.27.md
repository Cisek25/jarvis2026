# Fair Rentals — Release Notes v1.27

**Data**: 2026-05-12
**Zakres**: Bug fixes z feedbacku klienta (Agnieszka + Małgorzata, współwłaścicielki)
**Charakter**: czysta korekta treści i danych — bez zmian CSS/JS

---

## Co się zmieniło

### Liczba apartamentów: 19 → 21
Globalna wymiana w 13 plikach (~32 wystąpienia). Wszystkie widoczne miejsca:
- Hero lead, hero badge, meta strip, hero stats
- Buttony "Zobacz wszystkie 21 apartamentów" / "See all 21" / "Alle 21 ansehen"
- Stats-asym hero numer
- Trust bar w portfelu
- OBSLUGA_NAJMU narrative + stat
- DLA_BIZNESU "Skala portfela"
- Schema.org meta description (nie ma osobnego pola `numberOfRooms`)
- HEAD meta description + og:description + twitter:description × 3 języki
- SEO_TYTULY 9 wystąpień (Podpis pod nazwą + META Opis)

### Ujednolicenie ocen: 9.8 → 9.6 (wszędzie)
Wcześniej dwie liczby: hero/stats = 9.8 (brand-claim), trust bar = 9.6 (top 6 obiektów z Bookingu). Wyglądało jak sprzeczność — zgodnie z feedbackiem ujednolicone do **9.6** (weryfikowalne, konserwatywne, bezpieczne SEO):
- Schema.org `aggregateRating.ratingValue` × 3 plików HEAD: 9.8 → 9.6
- Hero badge + hero-asym meta strip (PL/EN/DE)
- Stats-asym cell "Średnia ocen na Booking"
- Principles "Sprawdzona jakość"
- OBSLUGA_NAJMU "Dbanie o reputację" + stats
- HEAD meta descriptions × 3 lang
- SEO_TYTULY × 3 lang
- Trust bar zachowany jako 9.6 (już był), label uproszczony z "Średnia Booking top 6 obiektów" → "**Średnia ocen na Booking**"

Karty obiektów (Białowieska 9.6, Kromera 9.4, ...) zachowane bez zmian — to indywidualne oceny pojedynczych apartamentów na Bookingu.

### OBSLUGA_NAJMU — zmiany merytoryczne (PL/EN/DE)

**Sekcja "Średnie wyniki portfela"** — usunięto stat "100% Zaangażowania w obiekt". Grid 4-cell → 3-cell (zostają: 9.6 Booking, 4.7 Google, 21 apartamentów). Uzasadnienie feedbacku: "puste hasło bez wartości informacyjnej".

**Sekcja "Marketing i widoczność"** — usunięto "Google Hotels", przepisane copy zgodnie z propozycją klienta:
> "Profesjonalne zdjęcia, opisy w PL i EN, dystrybucja na Booking.com, Airbnb oraz innych platformach — stale rozszerzamy listę kanałów. Z PriceLabs codziennie dopasowujemy stawki do popytu."

Wersje EN/DE analogiczne ("...and other platforms — we keep expanding the channel list..." / "...weiteren Plattformen — wir erweitern die Kanalliste laufend...").

**Sekcja "Raporty i rozliczenia"** — dopisany kluczowy punkt o panelu właściciela:
> "...Dodatkowo otrzymujesz dostęp do panelu właściciela 24/7 — podgląd rezerwacji, przychodów i statystyk w czasie rzeczywistym, bez konieczności dopytywania."

EN: "...You also get 24/7 access to the owner panel — real-time view of bookings, revenue and statistics..."
DE: "...Zusätzlich erhalten Sie 24/7 Zugriff auf das Eigentümer-Panel — Echtzeit-Übersicht..."

### DLA_BIZNESU — zmiany merytoryczne (PL/EN/DE)

**Intro "Komfort domu, elastyczność hotelu"** — usunięto "miejsce do pracy z drugim ekranem" z listy. Zostaje:
> "Pełny aneks kuchenny, pralka, szybkie Wi-Fi — w naszych apartamentach to standard, nie dopłata."

**Karta "Pakiet biznesowy" usunięta i zastąpiona kartą "Sprzątanie w trakcie pobytu"**:
> "Przy dłuższych pobytach biznesowych zapewniamy regularne sprzątanie wraz z wymianą pościeli i ręczników w hotelowym standardzie — bez dopłat. Pracownik wraca po dniu pracy do gotowego apartamentu."

EN: "In-stay housekeeping" — "...For longer business stays we provide regular cleaning with hotel-grade linen and towel turnover — included, no extra charge."
DE: "Reinigung während des Aufenthalts" — "Bei längeren Geschäftsaufenthalten sorgen wir für regelmäßige Reinigung..."

Ikona SVG = chmurka (dialog box, jak w "Sprzątanie i utrzymanie" w OBSLUGA_NAJMU).

**Use-case "IT & technologia"** — usunięto "Drugi monitor w pakiecie, ergonomiczne biurko". Zostaje:
> "Szybkie Wi-Fi 500/100 Mbit, klimatyzacja w sypialni, ciche miejsce do pracy zdalnej."

EN/DE analogiczne.

### SEO_TYTULY_FAIRRENTALS.md
- 9 wystąpień 19 → 21 (3 strony × 3 języki w META Opis + Podpis pod nazwą)
- 3 wystąpienia 9.8 → 9.6 w META Opis Strona główna (PL/EN/DE)
- Fix typo DE: "amilienunternehmen" → "Familienunternehmen", "BestätigunFg" → "Bestätigung"

---

## Co NIE zostało zmienione (czeka na akcję klienta/Damiana lub na późniejsze wersje)

### Akcje POZA JARVIS (panel IdoBooking / klient)
1. **"..." w menu** — system IdoBooking CMS, nie nasz kod. Damian/klient poprawia w panelu: Strony / Tytuł podstrony (bug analogiczny do v1.24 z cudzysłowami)
2. **Karty apartamentów bez cen "od/noc"** — integracja PMS w panelu. Klient ustawia cenniki sezonowe dla wszystkich 21 apartamentów w Ceny/Sezony
3. **Grafiki EN/DE z napisami po polsku** — wymagana lista konkretnych grafik (skąd? `ZDJECIA_LINKI.md` czy panel?) + dostarczenie czystych wersji bez tekstu. Aktualnie nie wiem które konkretnie grafiki są problematyczne
4. **Cytat nakładający się na widget rezerwacji** — wymaga live audit chrome-devtools po wklejeniu v1.27. Mogę odpalić na `https://client58360.idobooking.com/` jeśli dostanę zielone światło
5. **Zdjęcia portretowe Agnieszki + Małgorzaty** + bio — potrzebne dla v1.28 ("O nas")

### Dystrybucja apartamentów po dzielnicach (UWAGA dla klienta)
Sekcja "Wrocław w czterech odsłonach" ma podział:
- A. Stare Miasto: **5 apartamentów**
- B. Kępa Mieszczańska / Nadodrze: **8 apartamentów**
- C. Karłowice / Zalesie: **4 apartamenty**
- D. Centrum / Krzyki: **2 apartamenty**

Suma = 19. Z 21 zostają **2 nowe apartamenty bez przypisanej dzielnicy**. Klient musi wskazać, gdzie są — zostanie poprawione w v1.28 razem z "O nas".

### Następne wersje (potwierdzone fazowanie)
- **v1.28** — Sekcja "O nas" (osobna podstrona + teaser na home)
- **v1.29** — Dwa modele współpracy na OBSLUGA_NAJMU (tabela 8% co-host / 10% zarządzanie)
- **v1.30** — Filtry zaawansowane (link z hero do `/pl/offers` z natywnym filter sidebar)
- **v1.31** — Blog → Baza wiedzy (3 kategorie w panelu)

---

## Pliki do wklejenia (13)

| Plik | Lokalizacja w panelu IdoBooking | Status |
|------|----------------------------------|--------|
| `FR_HEAD_PL.html` | Strona główna PL → HEAD | ✅ zmieniony |
| `FR_HEAD_EN.html` | Strona główna EN → HEAD | ✅ zmieniony |
| `FR_HEAD_DE.html` | Strona główna DE → HEAD | ✅ zmieniony |
| `GLOWNA_PL__cms.html` | Strona główna PL → CMS treści | ✅ zmieniony |
| `GLOWNA_EN__cms.html` | Strona główna EN → CMS treści | ✅ zmieniony |
| `GLOWNA_DE__cms.html` | Strona główna DE → CMS treści | ✅ zmieniony |
| `OBSLUGA_NAJMU_PL__body_top.html` | /txt/201 PL → body_top | ✅ zmieniony |
| `OBSLUGA_NAJMU_EN__body_top.html` | /txt/201 EN → body_top | ✅ zmieniony |
| `OBSLUGA_NAJMU_DE__body_top.html` | /txt/201 DE → body_top | ✅ zmieniony |
| `DLA_BIZNESU_PL__body_top.html` | /txt/202 PL → body_top | ✅ zmieniony |
| `DLA_BIZNESU_EN__body_top.html` | /txt/202 EN → body_top | ✅ zmieniony |
| `DLA_BIZNESU_DE__body_top.html` | /txt/202 DE → body_top | ✅ zmieniony |
| `SEO_TYTULY_FAIRRENTALS.md` | (referencja, nie wklejasz — to ściąga) | ✅ zmieniony |

**Bez zmian** (nie wklejaj ponownie):
- `FR_ARKUSZ_STYLOW.css` (302 KB — czeka cleanup na v1.28+)
- `FR_KONIEC_BODY.html` (JS bez modyfikacji)
- `ATRAKCJE_WROCLAWIA_PL/EN/DE` (bez zmian — 19th century to historia, nie liczba apartamentów)
- `ZDJECIA_LINKI.md`

---

## Smoke test po wklejeniu (Console snippet)

```javascript
// v1.27 smoke test — sprawdza czy podmiana zadziałała
(function() {
  const checks = {
    hero_21: document.querySelector('.fr-hero-asym__lead')?.textContent.includes('21'),
    hero_no_98: !document.querySelector('.fr-hero-asym__lead')?.textContent.includes('9.8'),
    hero_badge_96: document.querySelector('.fr-hero-asym__badge-num')?.textContent === '9.6',
    button_21: !!Array.from(document.querySelectorAll('.fr-btn--outline')).find(b => b.textContent.includes('21')),
    trust_bar_21: !!Array.from(document.querySelectorAll('.fr-trust__bar-num')).find(n => n.textContent === '21'),
    no_100_stat: !document.body.textContent.match(/100%\s*<\/span>\s*<span[^>]*>Zaangażowania/),
    no_google_hotels: !document.body.textContent.match(/Google Hotels/i),
    no_drugi_monitor: !document.body.textContent.match(/Drugi monitor|second monitor|Zweiter Monitor/i)
  };
  console.table(checks);
  const fails = Object.entries(checks).filter(([k,v]) => !v);
  console.log(fails.length === 0 ? '✓ v1.27 OK' : `✗ ${fails.length} fails: ${fails.map(([k]) => k).join(', ')}`);
})();
```

Uruchom w konsoli na każdej stronie po wklejeniu plików. Wszystkie checki powinny być `true`.

---

## Zmiany w `memory/clients_data/fairrentals.json`

- `version`: v1.19 → **v1.27**
- Dodano `apartmentsCount: 21`
- Dodano `ratings.bookingAverage: "9.6"` z notatką o unifikacji
- Dodano `session3_history_v1_27` (9 wpisów)
- Dodano `plannedRoadmap_v1_28_v1_31` (mapa drogowa kolejnych 4 wersji)

---

## Status feedbacku z 2026-05-12

| # | Pozycja z listy klienta | Status v1.27 |
|---|--------------------------|--------------|
| 1 | Liczba apartamentów 19→21 | ✅ wszędzie |
| 2 | Niespójność ocen 9.8/9.6 | ✅ unifikacja do 9.6 |
| 3 | Grafiki PL w EN/DE | ⏳ wymaga listy + plików od klienta |
| 4 | Nakładający się cytat na widget | ⏳ wymaga live audit |
| 5 | Karty apartamentów bez cen | ⏳ akcja klienta w panelu (PMS) |
| 6 | "..." w menu | ⏳ akcja klienta w panelu (Strony) |
| 7 | "100% zaangażowania" usunąć | ✅ usunięte |
| 8 | Panel właściciela 24/7 dopisek | ✅ dodane |
| 9 | Google Hotels → nowe copy | ✅ podmienione |
| 10 | Pakiet biznesowy usunąć | ✅ usunięte + zastąpione sprzątaniem |
| 11 | "Drugi ekran" usunąć | ✅ usunięte |
| 12 | Sekcja "O nas" Agnieszka+Małgorzata | 🔜 v1.28 |
| 13 | Dwa modele 8%/10% | 🔜 v1.29 |
| 14 | Blog/Baza wiedzy 3 kategorie | 🔜 v1.31 |
| 15 | Filtry w wyszukiwarce | 🔜 v1.30 |
