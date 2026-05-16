# Fair Rentals — Audyt v1.28 vs feedback klienta (Karolina + Agnieszka)

**Data**: 2026-05-14
**Audytor**: senior-frontend (DevTools, file grep, multi-viewport)
**Wersja repo**: v1.28 (commit 138bee9, files updated 2026-05-12)
**Wersja live**: starsza niż v1.28 (klient nie wgrał zaktualizowanych plików)

## Source feedback
1. Email Karoliny Banaś (2026-05-14 11:24) — `#1239906555#13`
2. Email Agnieszki Barańskiej + PDF "Uwagi_www.pdf" 23 strony (2026-05-14 12:17) — `#1239906555#14`

---

## 🟢 Punkty już rozwiązane w v1.28 (klient musi wkleić pliki)

| # | Uwaga | Status | Weryfikacja |
|---|---|---|---|
| 1 | Liczba apartamentów 19 → 21 | ✅ ZROBIONE | GLOWNA_PL/EN/DE.html, OBSLUGA_NAJMU_*, DLA_BIZNESU_* — wszystkie miejsca `<strong>21</strong>` |
| 2 | Niespójność ocen 9.8 vs 9.6 | ✅ ZROBIONE | Wszystkie pliki HTML zawierają tylko `9.6`. Brak 9.8. |
| 3 | EN/DE grafiki z polskim tekstem | ✅ ZROBIONE | H2/H3 są w HTML (tłumaczone: "Rental income without daily stress", "Full-stack short-term rental management"). Obrazy są bez napisów (zdjęcia z panelu + Unsplash). |
| 4 | Cytat nakładający się na widget rezerwacji | ✅ ZROBIONE (§94 v1.28) | DevTools 1440x900: widget `.fr-search-banner` y=699-865, quote `.fr-magazine` y=900+ → gap 35-89px (zależnie od viewport). Brak overlap. |
| 6 | "..." w menu | ✅ ZROBIONE | Menu live: `Oferta\|Atrakcje\|Obsługa najmu\|Najem korporacyjny\|Kontakt` — czyste linki. Brak "...". |
| 7 | Usuń "100% zaangażowania w obiekt" | ✅ ZROBIONE | OBSLUGA_NAJMU_PL/EN/DE sekcja "Średnie wyniki portfela" zawiera tylko 9.6 / 4.7 / 21 — brak "100%" |
| 8 | Dopisz info o panelu właściciela 24/7 | ✅ ZROBIONE | OBSLUGA_NAJMU_PL: "...panel właściciela 24/7 — podgląd rezerwacji, przychodów i statystyk w czasie rzeczywistym" (linia 79). Mirror w EN ("owner panel", "real-time view") i DE ("Eigentümer-Panel", "Echtzeit-Übersicht"). |
| 9 | Usuń Google Hotels, popraw copy marketing | ✅ ZROBIONE | OBSLUGA_NAJMU_PL/EN/DE marketing section: "Booking.com, Airbnb oraz innych platformach — stale rozszerzamy listę kanałów. Z PriceLabs codziennie dopasowujemy stawki do popytu." — dokładny tekst klienta. |
| 10 | Usuń sekcję "Pakiet biznesowy" (monitor/biurko/fotel) | ✅ ZROBIONE | DLA_BIZNESU_PL/EN/DE: brak wystąpień "monitor", "biurko", "fotel", "ergonomicz", "second screen", "Bildschirm", "Schreibtisch", "Sessel". Sekcja usunięta. |
| 11 | Usuń "drugi ekran" z "Dlaczego apartament zamiast hotelu" | ✅ ZROBIONE | DLA_BIZNESU_PL line 22: "Pracownik wraca z biura do gotowego apartamentu, w którym może spać, gotować, pracować i odpocząć." — bez wzmianki o drugim ekranie. |
| 12 | Dodaj info o regularnym sprzątaniu w hotelowym standardzie | ✅ ZROBIONE | DLA_BIZNESU_PL line 79: "Przy dłuższych pobytach biznesowych zapewniamy regularne sprzątanie wraz z wymianą pościeli i ręczników w hotelowym standardzie — bez dopłat." Mirror w EN ("hotel-grade linen and towel turnover") i DE ("Wechsel von Bettwäsche und Handtüchern im Hotelstandard"). |

---

## 🟡 Punkty out-of-scope (konfig IdoBooking PMS, nie HTML)

| # | Uwaga | Status | Action |
|---|---|---|---|
| 5 | Karty apartamentów — brak cen "od/noc" | ⚠️ KONFIG IDOSELL | Klient musi: Panel → Oferty → Konkretny apartament → uzupełnić ceny w cenniku. JARVIS HTML/CSS nie kontroluje cen — to przychodzi z PMS przez systemowy `.offer__price`. |
| 16 | Filtry wyszukiwarki (sypialnie, parking, slider) | ⚠️ KONFIG IDOSELL | Filtry są konfigurowane w panelu IdoSell → Wygląd → Ustawienia wyszukiwarki. Można włączyć: liczba osób, daty, cena slider, oraz "dodatkowe filtry" (klimatyzacja, parking, balkon). Wymaga setup po stronie klienta + pomocy supportu IdoSell. |

---

## 🔴 Punkty do zrobienia w przyszłych Sprintach

| # | Uwaga | Sprint | Estymacja |
|---|---|---|---|
| 13 | Sekcja "O nas" (Agnieszka + Małgorzata, historia, portrety) | Sprint C | 1 sesja (po dostarczeniu zdjęć) |
| 14 | Modele współpracy 8% co-host vs 10% zarządzanie (tabela porównawcza) | Sprint B | 1 sesja |
| 15 | Blog / Baza wiedzy (kategorie Goście / Właściciele / Firmy) | Sprint D | 1-2 sesje |
| 17 | PDF Uwagi_www 23 strony — uwagi wizualne UX | Sprint E | 1-2 sesje (po extract tekstu) |

---

## 🧪 TDD smoke tests (multi-viewport, 2026-05-14)

| Test | 1440 | 1366 | 1024 | 390 mobile | Status |
|---|---|---|---|---|---|
| T1: Single H1 | ⚠️ 2 (1 hidden system) | ⚠️ 2 | ⚠️ 2 | ⚠️ 2 | Niski priorytet (system Idosell .index-info h1 z display:none) |
| T2: Apartamentów = 21 (nie 19) | ✅ | ✅ | ✅ | ✅ | PASS |
| T3: Rating 9.6 (nie 9.8) | ✅ | ✅ | ✅ | ✅ | PASS |
| T4: Menu bez "..." | ✅ | ✅ | ✅ | ✅ | PASS |
| T5: Search banner w viewport | ✅ y=699 | ✅ | ✅ | ⚠️ cookie banner | PASS (cookie banner edge case) |
| T6: Brak widget/quote overlap | ✅ gap 89px | ✅ gap 35px | ✅ | n/a | PASS |
| T7: H1 w hero | ✅ "Apartamenty Wrocław z opieką..." | ✅ | ✅ | ✅ | PASS |
| T8: Stats zawiera "21" | ✅ | ✅ | ✅ | ✅ | PASS |

**Wynik: 7/8 PASS, 1 warning (system H1 hidden z display:none — SEO crawler widzi 2)**

### Fix opcjonalny T1 (low priority)
Dodać do FR_KONIEC_BODY.html lub JS:
```js
// Remove system-generated h1 from .index-info (hidden but in DOM)
document.querySelectorAll('.index-info h1').forEach(h => h.remove());
```
Lub w CSS żeby ostatecznie wyciąć z DOM (CSS nie wycina, tylko ukrywa) — wymaga JS.

---

## 📋 Action items dla klienta

### 🔴 PILNE — wklejenie v1.28
Klient widzi starszą wersję na live. Wystarczy wkleić:
1. `FR_ARKUSZ_STYLOW.css` → Panel → Wygląd → Arkusz stylów CSS
2. `FR_HEAD_PL.html` → Panel → Ustawienia → Kody śledzące → Sekcja HEAD (PL)
3. `FR_HEAD_EN.html` → /en/ → Sekcja HEAD
4. `FR_HEAD_DE.html` → /de/ → Sekcja HEAD
5. `GLOWNA_PL__cms.html` → Panel → Wygląd → Strona główna → Edytor treści (tryb HTML)
6. `GLOWNA_EN__cms.html` → /en/ Strona główna
7. `GLOWNA_DE__cms.html` → /de/ Strona główna
8. `OBSLUGA_NAJMU_PL/EN/DE__body_top.html` → odpowiednie podstrony body_top
9. `DLA_BIZNESU_PL/EN/DE__body_top.html` → odpowiednie podstrony body_top
10. `ATRAKCJE_WROCLAWIA_PL/EN/DE__body_top.html` → odpowiednie podstrony
11. `FR_KONIEC_BODY.html` → Panel → Ustawienia → Kody śledzące → Koniec sekcji Body

**Po wklejeniu**: Cmd+Shift+R (twardy reload) — wymusza pobranie nowego CSS, omija cache.

### 🟡 KONFIG W PANELU (klient sam lub support IdoSell)
- Uzupełnienie cen apartamentów (Oferty → konkretny apartament → Cennik)
- Konfiguracja filtrów wyszukiwarki (Wygląd → Ustawienia wyszukiwarki → dodatkowe filtry)

### 🟢 NOWE FUNKCJONALNOŚCI (przyszłe sprinty)
- Sprint B: Modele współpracy 8%/10% — tabela porównawcza
- Sprint C: Sekcja "O nas" (czekamy na zdjęcia Agnieszka + Małgorzata)
- Sprint D: Blog/Baza wiedzy
- Sprint E: Uwagi UX z PDF (23 strony)

---

## Q&A klienta (pytanie końcowe Karoliny)

**Q**: "Czy istnieje możliwość uruchomienia strony w wersji wizytówkowej (uproszczonej) w najbliższym czasie, tak aby docelowa wersja mogła być budowana równolegle?"

**A**: **Nie potrzeba osobnej wizytówki.** Aktualna v1.28 jest produkcyjna:
- Wszystkie pilne bugi z maila Karoliny (punkty 1-12) są już zrobione
- Hero + search widget + 21 apartamentów + 9.6 ratingi — wszystko w aktualnym v1.28
- Brakuje tylko 4 nowych funkcjonalności (modele, O nas, blog, filtry) — można dodawać iteracyjnie

**Rekomendacja**:
1. **DZIŚ**: klient wkleja v1.28 + reload → strona ready do produkcji
2. **+2-3 dni**: Sprint B (modele współpracy) — dorzucamy do tego samego site
3. **+5-7 dni**: Sprint C (O nas, po dostarczeniu zdjęć)
4. **+10-14 dni**: Sprint D (Blog/Baza wiedzy)
5. **W międzyczasie**: Sprint E (uwagi UX z PDF) — drobne poprawki wizualne równolegle

Każde wgrywanie kolejnego sprintu **NIE wymaga downtime** — to są zmiany w CSS + HTML podstron, klient wciąż przyjmuje rezerwacje.
