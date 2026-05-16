# Lesson 006 — IdoBooking URL Slugs Are Case-Sensitive

**Data odkrycia**: 2026-04-16
**Klient**: MIA Apart (client33019)

## Problem

Linki do miast na stronie głównej MIA Apart wskazywały na `/txt/miasta` — strona 404.
Prawdziwy URL podstrony to `/txt/202/Nasze-miasta`.

## Kluczowe ustalenia

1. **URL slugi w IdoBooking zawierają ID numeryczne**: `/txt/{ID}/{Slug}`
2. **Slug jest case-sensitive**: `/txt/miasta` ≠ `/txt/Miasta` ≠ `/txt/202/Nasze-miasta`
3. **Samo zgadywanie sluga NIE WYSTARCZY** — trzeba sprawdzić faktyczny URL w nawigacji strony

## Reguła

**ZAWSZE** weryfikuj URL podstron klienta na żywej stronie (nawigacja menu) lub w panelu CMS.
**NIGDY** nie zakładaj slugi z nazwy podstrony — zawsze sprawdź faktyczny URL z numerem ID.

Wzorzec URL IdoBooking: `/txt/{numeric_id}/{Slug-With-Dashes}`

## Dotyczy
- Linków wewnętrznych w CMS (body_top)
- Custom nawigacji
- Przycisków CTA linkujących do podstron
- Breadcrumbs
