# Draft odpowiedzi do Karoliny Banaś + Agnieszki Barańskiej

**Ticket**: #1239906555#13 + #14
**Data drafu**: 2026-05-14
**Status**: do akceptacji Damiana przed wysłaniem

---

## Wersja 1 — krótka (jeśli klient potrzebuje konkretu)

> Dzień dobry Panie Karolino, Panie Agnieszko,
>
> Dziękujemy za szczegółowy feedback. Mamy bardzo dobre wieści — **większość uwag z maila jest już zaimplementowana w najnowszej wersji strony (v1.28), tylko czeka na wgranie do panelu**.
>
> **Zrobione i czekają na publikację (12 punktów z maila Karoliny):**
> - ✅ Liczba apartamentów poprawiona na 21 (wszystkie sekcje, schema.org, schema.org)
> - ✅ Ocena ujednolicona do 9.6 (wszędzie spójnie)
> - ✅ Sekcja "100% zaangażowania w obiekt" usunięta z "Średnie wyniki"
> - ✅ Dopisana informacja o panelu właściciela 24/7 (Raporty i rozliczenia)
> - ✅ Marketing copy poprawione: usunięto Google Hotels, dodano PriceLabs i listę kanałów
> - ✅ Sekcja "Pakiet biznesowy" (drugi monitor, fotel, biurko) całkowicie usunięta z podstrony Najem korporacyjny
> - ✅ Fragment "drugi ekran" usunięty z "Dlaczego apartament zamiast hotelu"
> - ✅ Dodana informacja o regularnym sprzątaniu w hotelowym standardzie (bez dopłat) dla długich pobytów
> - ✅ Grafiki EN/DE — tytuły są w HTML (tłumaczą się automatycznie), obrazy są bez napisów
> - ✅ Nakładający się cytat na widget rezerwacji — naprawione (search bar przesunięty wyżej, gap z cytatem 89 px na desktop)
> - ✅ "..." w menu — usunięte
>
> **Konfiguracja w panelu IdoSell (klient sam lub support):**
> - Brak cen "od/noc" na kartach — wymaga uzupełnienia cenników w panelu (Oferty → konkretny apartament → Cennik)
> - Filtry wyszukiwarki (sypialnie, klimatyzacja, slider cenowy) — Wygląd → Ustawienia wyszukiwarki, możemy pomóc w konfiguracji
>
> **Czekają na realizację (timing poniżej):**
> - **Modele współpracy (8% co-host vs 10% zarządzanie)** — tabela porównawcza, **2-3 dni**
> - **Sekcja "O nas" (Pani Agnieszka + Małgorzata)** — **prosimy o zdjęcia portretowe + 2-3 zdania historii firmy**, realizacja 2 dni po otrzymaniu materiałów
> - **Blog / Baza wiedzy** — struktura z kategoriami Goście / Właściciele / Firmy, **5-7 dni**
> - **Uwagi UX z PDF Pani Agnieszki (23 strony)** — drobne korekty wizualne, **4-5 dni** równolegle
>
> **Wersja wizytówkowa nie jest potrzebna** — aktualna v1.28 jest produkcyjna. Wgrywamy ją dziś, klient od razu może przyjmować rezerwacje bezpośrednie. Nowe sekcje dorzucamy iteracyjnie, bez downtime.
>
> Pozdrawiam serdecznie,
> Damian Cisowski
> IAI S.A. / IdoBooking

---

## Wersja 2 — pełna (jeśli klient chce szczegółów)

> Dzień dobry Panie Karolino, Panie Agnieszko,
>
> Bardzo dziękujemy za szczegółowy feedback po Państwa stronie — to dla nas cenne, że poświęciły Panie czas na przeanalizowanie strony pod takim kątem. Sprawdziliśmy każdą uwagę pojedynczo, a poniżej zwrotka punkt po punkcie.
>
> ## Stan obecny: większość zmian już zaimplementowana
>
> Po Państwa pierwszych iteracjach feedbacku przygotowaliśmy wersję **v1.28** strony — i okazuje się, że **12 z 12 pilnych punktów z maila Pani Karoliny już jest w tej wersji**. Sprawdziłem to dziś live przez DevTools i grepa plików. Klient widzi obecnie starszą wersję, bo nie został jeszcze wgrany ostatni pakiet do panelu IdoBooking. Wgrywam dziś.
>
> ### Pilne bugi (lista Karoliny):
>
> | # | Uwaga | Status |
> |---|---|---|
> | 1 | Liczba apartamentów 19 → 21 (wszędzie) | ✅ Zrobione w PL/EN/DE |
> | 2 | Niespójność ocen 9.8 vs 9.6 | ✅ Wszędzie 9.6 |
> | 3 | EN/DE grafiki z polskim tekstem | ✅ Teksty w HTML (tłumaczą się automatycznie); obrazy bez napisów |
> | 4 | Cytat nakładający się na widget rezerwacji | ✅ Naprawione w v1.28 (§94 — search bar inline pod hero, gap 89px do cytatu) |
> | 5 | Karty bez cen "od/noc" | ⚠️ Konfiguracja w panelu IdoSell (uzupełnienie cenników) |
> | 6 | "..." w menu | ✅ Menu czyste: Oferta\|Atrakcje\|Obsługa najmu\|Najem korporacyjny\|Kontakt |
>
> ### Zmiany merytoryczne:
>
> | # | Uwaga | Status |
> |---|---|---|
> | 7 | Usunąć "100% zaangażowania w obiekt" | ✅ Usunięte z "Średnie wyniki portfela" |
> | 8 | Dopisać panel właściciela 24/7 | ✅ Dodane w sekcji "Raporty i rozliczenia" (PL/EN/DE) |
> | 9 | Marketing: usunąć Google Hotels | ✅ Aktualny copy: "Booking.com, Airbnb oraz innych platformach — stale rozszerzamy listę kanałów. Z PriceLabs codziennie dopasowujemy stawki do popytu." |
> | 10 | Usunąć sekcję "Pakiet biznesowy" | ✅ Sekcja monitor/fotel/biurko usunięta |
> | 11 | Usunąć "drugi ekran" z "Dlaczego apartament" | ✅ Usunięte |
> | 12 | Dodać info o regularnym sprzątaniu | ✅ Dodana sekcja: "regularne sprzątanie wraz z wymianą pościeli i ręczników w hotelowym standardzie — bez dopłat" |
>
> ## Co zostało do zrobienia
>
> ### 1. Nowe sekcje (do realizacji w kolejnych dniach):
>
> **Modele współpracy 8%/10%** — tabela porównawcza z dwoma CTA (co-host / zarządzanie). Mamy gotowy tekst z Państwa maila, do realizacji **2-3 dni**.
>
> **Sekcja "O nas" (Agnieszka + Małgorzata)** — rekomendujemy osobną podstronę `/o-nas` z portrettami + historią firmy + 3-4 wartościami. Layout: 2-kolumnowy mockup w stylu istniejącej narracji strony. **Prosimy o materiały**:
> - 2 zdjęcia portretowe (najlepiej w studio lub w jednym z apartamentów)
> - 2-3 zdania o historii firmy (kiedy powstała, jak zaczęłyście)
> - 1-2 zdania o tym, co wyróżnia Waszą rodzinną firmę
>
> Po otrzymaniu materiałów — **2 dni roboty**.
>
> **Blog / Baza wiedzy** — struktura z 3 kategoriami (Goście / Właściciele / Firmy) + szablon wpisu + lista. **5-7 dni** robocze. Treści mogą Państwo dostarczać sukcesywnie po publikacji struktury.
>
> ### 2. Konfiguracja w panelu IdoSell (po Państwa stronie):
>
> **Brak cen "od/noc" na kartach** — to nie jest błąd HTML, tylko brak cen w panelu. Idosell PMS automatycznie wyświetla "od X zł/noc" jeśli w `Oferty → konkretny apartament → Cennik` są uzupełnione stawki. Proszę sprawdzić każdy apartament — pewnie brakuje cen w przyszłorocznym sezonie albo dla części apartamentów.
>
> **Filtry wyszukiwarki** (sypialnie, klimatyzacja, parking, dzielnica, slider cenowy) — można je włączyć w `Wygląd → Ustawienia wyszukiwarki`. Część filtrów (klimatyzacja, parking, balkon) wymaga zdefiniowania "wyposażenia" na poziomie apartamentu w panelu. Jeżeli Państwo chcą, możemy pomóc skonfigurować — albo skontaktować się z supportem IdoSell.
>
> ### 3. Uwagi wizualne UX (PDF Pani Agnieszki)
>
> Otrzymaliśmy 23-stronicowy plik z uwagami dotyczącymi prezentacji wizualnej, akcentów kolorystycznych, czytelności. Przeanalizujemy te uwagi w osobnym sprincie i wprowadzimy zmiany **w ciągu 4-5 dni** (równolegle z innymi pracami, bez downtime).
>
> ## Odpowiedź na pytanie końcowe Karoliny
>
> *"Czy istnieje możliwość uruchomienia strony w wersji wizytówkowej?"*
>
> **Nie potrzebujemy osobnej wizytówki.** Aktualna v1.28 jest produkcyjna i odpowiada na wszystkie pilne uwagi. Strategia:
>
> 1. **Dziś** — wgrywam v1.28 do panelu, klient widzi finalny stan z zaktualizowanymi liczbami / ocenami / treściami. Można od razu reklamować i przyjmować rezerwacje bezpośrednie.
> 2. **+2-3 dni** — dorzucam modele współpracy 8%/10% (sekcja na "Obsługa najmu")
> 3. **+5-7 dni** — sekcja "O nas" (po dostarczeniu zdjęć)
> 4. **+10-14 dni** — Blog / Baza wiedzy
> 5. **Równolegle** — drobne korekty UX z PDF Pani Agnieszki
>
> Każdy etap to małe wgrywanie do panelu, bez przerw w dostępności strony.
>
> ## Co potrzebujemy od Państwa
>
> 1. **Akceptacja** wgrania v1.28 dzisiaj (jeśli OK — robię od razu)
> 2. **Materiały dla sekcji "O nas"** — 2 zdjęcia portretowe + 2-3 zdania historii firmy
> 3. **Lista materiałów eksploatacyjnych w panelu** — czy mogą Państwo sprawdzić ceny apartamentów i zdefiniowanie wyposażenia (parking, klimatyzacja itp.)? Albo potwierdzenie, że chcą Państwo żebyśmy pomogli to skonfigurować.
>
> Pozdrawiam serdecznie i jeszcze raz dziękujemy za czas włożony w analizę,
> Damian Cisowski
> IAI S.A. / IdoBooking

---

## Notatki dla Damiana

**Decyzja**: użyć wersji 1 (krótka, konkret) chyba że klient zwykle preferuje pełen kontekst — wtedy wersja 2.

**Co dziś wykonać:**
1. Wgranie v1.28 (lista plików w `AUDIT_v1.28_CLIENT_FEEDBACK.md` — section "Action items")
2. Po wgraniu — pingnięcie Karoliny żeby zrobiła Cmd+Shift+R
3. Zaplanowanie Sprint B (modele współpracy) — najwyższy priorytet po v1.28

**Co napisać klientowi przy wgraniu**:
- Status v1.28 ready
- Lista bugów rozwiązanych (12 punktów)
- Lista konfig do uzupełnienia (cenniki + filtry — proszę o ustalenie czy klient sam, czy pomożemy)
- Lista nowych sekcji w roadmapie (modele/O nas/blog) z dziennymi timinami
- Lista materiałów do dostarczenia (zdjęcia portretowe + history firmy)
