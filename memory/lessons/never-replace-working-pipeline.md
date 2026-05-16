# CRITICAL LESSON — NIE zastępuj działającego pipeline'u eksperymentem

**Data:** 2026-04-20
**Klient:** Apartamenty Parkowe Gniezno
**Koszt błędu:** 3 iteracje (v2.0, v2.1, v2.2) × ~2h pracy + frustracja klienta + rollback do v1.0

## Co się stało

User miał **działający pipeline v1.0 JARVIS** (żywa zieleń #147D3B + Playfair Display) dla Apartamentów Parkowych. Dostarczył mi:
1. Brief klienta (`Brief-booking_v2.docx`)
2. Mockup designu z Claude frontend-design (`Downloads/sites/apartamenty-parkowe/` — React SPA)

Intencja użytkownika: **dodać design z mockupu do istniejącego pipeline'u JARVIS**.

Moja interpretacja: **zbudować wszystko od nowa w stylu mockupu**.

## 3 nieudane iteracje

### v2.0 (125KB CSS, 3356 rules)
- Zbudowałem od zera używając `.ap-*` prefixu
- Ignorowałem L1 traps shared (zamiast reuse)
- Dodałem `<nav>`, `<hero>`, `<footer>` w body_top — duplikaty elementów systemu IdoBooking
- Panel OBCIĄŁ CSS do 360 rules → strona biała bez kolorów/fontów

### v2.1 (32KB CSS, 223 rules)
- Zredukowałem CSS do limitu
- Dodałem override IdoBooking `--maincolor1, --btn_large` itp.
- Stylizacja systemowa zaczęła działać (menu, footer, widget)
- ALE: `.ap-reveal` + `opacity:0` + IntersectionObserver w fullpage.js = **wszystkie sekcje ukryte**
- User: "brakuje silnika rezerwacji, kolorystyka, fonty, menu nie działa"

### v2.2 (60KB CSS, 249 rules)
- Wróciłem do v1.0 bazy + podmieniłem design tokens
- Usunąłem `.ap-hero-wrap` (duplikat systemowego hero)
- Dodałem marquee, bigquote, mosaic gallery
- User: "nic nie działa zrób strone od nowa jako jarvis, bo widze, ze ten desing nie działa dobrze" → **ROLLBACK DO V1.0**

## Root causes mojego błędu

1. **Przy pierwszym zadaniu założyłem że "design + JARVIS" = "rebuild everything"**. Powinienem był zapytać najpierw.
2. **Nie uszanowałem działającej bazy**. v1.0 JARVIS było dobrze przetestowane dla 5+ klientów (Najmar, SORS, Madera, MountainPrestige). Moja v2.x była nieprzetestowanym eksperymentem.
3. **Adaptacja mockupu frontend-design do IdoBooking jest NIETRYWIALNA** — mockup to standalone React SPA, IdoBooking to CMS z własnym headerem/footerem/widgetami/fullpage.js. Próba 1:1 daje duplikaty, konflikty, niepewne zachowanie w różnych templateach.
4. **Próbowałem naprawić eksperymentalne rozwiązanie zamiast wrócić do działającego**. Każda kolejna "naprawka" (v2.1, v2.2) dodawała złożoność zamiast zmniejszać.

## ZASADY na przyszłość

### 🔴 KRYTYCZNE — jeśli user daje działający pipeline + mockup

1. **ZAPYTAJ**: czy chce design w całości, czy tylko tokeny (kolory/fonty)?
2. **DOMYŚLNIE ZAKŁADAJ**: tylko design tokens swap w istniejącym pipeline'ie.
3. **NIGDY nie zastępuj działającej bazy** — tylko **ewoluuj**.
4. **Każda zmiana większa niż design tokens** = nowa propozycja do zatwierdzenia PRZED kodowaniem.

### 🟡 Jeśli naprawdę trzeba rebuild

1. Zostaw działający v1.0 nietknięty w `DO_WKLEJENIA/`
2. Nowy eksperyment → `DO_WKLEJENIA_v2_experimental/`
3. Testuj na WŁASNYM panelu testowym (NIE na produkcji klienta)
4. Dopiero po potwierdzeniu: swap folderów

### 🟡 Kiedy zatrzymać się i cofnąć

Jeśli user mówi:
- "nie działa" — 1 iteracja
- "nadal nie działa" — ROLLBACK natychmiast, nie kolejna "naprawka"
- "zrób od nowa" — przywróć v1.0, nie buduj v3.0

**Jedna nieudana iteracja = sygnał. Dwie = hard stop. Trzy = katastrofa.**

## Konkretne detekcje

- User używa słów "nic nie działa", "totalnie", "fatalnie", "od nowa" → **STOP, rollback, nie kontynuuj**
- User używa "zrób strone od nowa jako jarvis" → **v1.0 restore, nie budowa nowego**
- Jeśli po 2 iteracjach nie masz działającego rozwiązania → **ZAPYTAJ przed trzecią**, nie kontynuuj na ślepo

## Co zachować z nieudanych prób

Nie wszystko było marne:
- ✅ 4 lekcje technical w `memory/lessons/` (CSS limit, IdoBooking vars, system-first, live-verify)
- ✅ 4 traps dodane do `CLAUDE.md` (#14-17)
- ✅ Poznanie template default13 i jego CSS vars
- ✅ Diagnostyka chrome-devtools workflow

Te zasoby pomogą PRZYSZŁYM próbom adaptacji designu do IdoBooking — ale tylko wtedy gdy user EXPLICITLY o to poprosi i zaakceptuje ryzyko.

## TL;DR

**Pracujący v1.0 JARVIS > 3x nieudane v2.x eksperymenty.**
Kiedy user daje design do "połączenia z JARVIS", domyślnie rób TYLKO swap design tokens (kolory + fonty) — bez zmian architektury, bez przepisywania, bez eksperymentów.
