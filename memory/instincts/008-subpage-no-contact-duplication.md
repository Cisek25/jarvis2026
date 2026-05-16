---
name: subpage-no-contact-duplication
description: Podstrony /lokalizacja i /o-nas NIE powtarzają danych kontaktowych (telefon, email, adres, check-in) — te są tylko na /kontakt. Atrakcje w okolicy ZAWSZE ze zdjęciami.
type: instinct
scope: all-clients
trigger: every subpage-build — Lokalizacja, O-nas, Galeria, dodatkowe podstrony
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "w lokalizacji mozemy nie powtarzac kontaktu"
---

# Instynkt: Brak duplikacji danych kontaktowych + zdjęcia atrakcji

## Co NIE robić
❌ **Nie dubluj danych kontaktowych na kilku podstronach** —
klient zapłaci za stronę, a potem zmieni numer telefonu i zapomni
poprawić na 4 różnych miejscach. Już widziałem to w:
- apartamenty-parkowe v1.0 /lokalizacja → sekcja z telefon/email/check-in
  była identyczna z /kontakt → user 2026-04-21 zwrócił uwagę

❌ **Nie twórz kart atrakcji bez zdjęć** — karty tekst-only wyglądają
anemicznie, użytkownik przewinie je bez zainteresowania. Z CLAUDE.md
trap #9: "KAŻDA sekcja MUSI mieć zdjęcie".

## Reguła — /lokalizacja layout
Zawsze ta struktura (PL + EN symetrycznie):

```
1. Page hero (title + subtitle — bez kontaktu)
2. Sekcja mapy (GetHere kicker + krótki text "jak dojechać" + link
   "szczegółowe dane na /kontakt" + iframe mapy)
3. Sekcja atrakcji (6 kart z obrazkami + dystansem + opisem)
4. Final CTA (Sprawdź dostępne terminy)
```

## Gdzie trzymać dane kontaktowe
**Wyłącznie na `/kontakt` (body.page-contact):**
- Telefon (tel:+48...)
- Email (mailto:...)
- Adres pocztowy
- NIP / dane firmy
- Check-in / check-out godziny
- Godziny odbioru
- Formularz kontaktowy (jeśli jest)

**Na innych podstronach** tylko DELIKATNY link do kontaktu:
`<a href="/contact">szczegółowe dane kontaktowe</a>`
(EN: `<a href="/en/contact">contact details</a>`)

## Reguła — atrakcje zawsze ze zdjęciami
Na `/lokalizacja` używaj **wariantu media** karty atrakcji:

```html
<article class="ap-attraction-card ap-attraction-card--media">
  <div class="ap-attraction-card__img">
    <img src="[PEXELS_URL]?auto=compress&cs=tinysrgb&w=800"
         alt="[Opis]" loading="lazy">
    <span class="ap-attraction-card__distance">5 MIN PIESZO</span>
  </div>
  <div class="ap-attraction-card__body">
    <h3 class="ap-attraction-card__name">[Nazwa]</h3>
    <p class="ap-attraction-card__desc">[3-5 zdań opisu]</p>
  </div>
</article>
```

CSS dla `--media` dodany w AP_CSS_EDYTOR.css §5 (PATCH 2026-04-21).

## Źródła zdjęć — co DZIAŁA
✅ **Pexels CDN**: `https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=800`
   - Hotlinking allowed, free license, no attribution required
   - Przed wklejeniem URL → `curl -I URL` → potwierdź HTTP 200
✅ **Unsplash CDN**: `https://images.unsplash.com/photo-{ID}?w=800` — podobnie
✅ **Gallery klienta** z IdoBooking: `/images/frontpageGallery/pictures/large/{id1}/{id2}/{filename}.jpg`

## Źródła zdjęć — czego NIE używać
❌ **Wikimedia** (`upload.wikimedia.org`) — HTTP 429 rate limit
   na hotlinking. Z CLAUDE.md trap #13.
❌ **Google Images** — nie hostują same, links wygasają
❌ **Adobe Stock / Depositphotos / Shutterstock** — płatne licencje

## Jak znaleźć odpowiednie zdjęcia
1. WebSearch: `"{miejscowość} atrakcje pexels unsplash free"`
2. WebFetch: `https://www.pexels.com/search/{miejscowość}/` → wyciągnij
   listę photos z atrybutem src CDN
3. Dla konkretnych landmarków → fallback na generyczne
   ("polish town square", "cathedral gothic", "city park autumn")
4. **VERIFY**: `curl -s -o /dev/null -w "%{http_code}\n" "URL"` → musi być 200

## Case Gniezno (apartamenty-parkowe) — 6 atrakcji + zdjęcia

| # | Atrakcja | Dystans | Pexels photo ID |
|---|----------|---------|-----------------|
| 1 | Park Miejski | 2 min | 35005646 (autumn park) |
| 2 | Rynek Gnieźnieński | 5 min | 17042818 (Polish town hall) |
| 3 | Katedra Gnieźnieńska | 10 min | 15959785 (archcathedral) |
| 4 | Wzgórze Lecha | 12 min | 37144935 (statue+lake+cathedral) |
| 5 | Jezioro Jelonek | 10 min | 14780317 (aerial view) |
| 6 | Muzeum Początków Państwa Polskiego | 11 min | 13455405 (cathedral aerial snow) |

Usunięte (bo to dojazd, nie zwiedzanie):
- Dworzec PKP/PKS (wzmianka w tekście "getting here")
- Autostrada A2 (jw)

## Kiedy stosować
- **Zawsze** przy pierwszym budowaniu `/lokalizacja` dla nowego klienta
- **Audyt** istniejącej `/lokalizacja` — sprawdź czy nie duplikuje /contact
- **Dodawanie podstron** typu "O nas", "Okolica" — ten sam wzorzec

## Referencja
- Client: apartamenty-parkowe (client58154)
- User feedback 2026-04-21: "w lokalizacji mozemy nie powtarzac kontaktu
  o tam jest to samo i po prostu opisz co jest w gnieźnie co obok
  i dodaj zdjęcia bo nie ma, scrapuj z neta"
- Files:
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/LOKALIZACJA_PL__body_top.html`
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/LOKALIZACJA_EN__body_top.html`
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` §5 (attraction-card--media)
