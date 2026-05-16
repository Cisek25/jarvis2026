---
name: seo-file-format-clean
description: SEO_TYTULY_{KLIENT}.md ma być CZYSTY do copy-paste — bez komentarzy JARVIS, bez kresek bulletów, bez liczników znaków w tekście, bez uzasadnień SEO. Tylko 4 pola per strona per język.
type: instinct
scope: all-clients
trigger: tworzenie SEO_TYTULY_{KLIENT}.md dla nowego klienta lub audyt istniejącego
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "tam nie ma byc zadnych twoich uwag jarvis, tylko ma być np. Wizytówka (...) i zrób to w prostej formie do skopiowania i wklejenia"
---

# Instynkt: SEO file — clean copy-paste format

## Co NIE robić
❌ Nie dodawaj sekcji "Uzasadnienie:", "Keyword focus:", "Uwagi krytyczne"
❌ Nie dodawaj liczników znaków w tekście (np. "(149/150 znaków)")
❌ Nie używaj markdown bullet points (`- **Nazwa**:`)
❌ Nie używaj emoji, ikonek, separatorów typu "───"
❌ Nie dodawaj tabelki "podsumowanie znaków"
❌ Nie dodawaj metadata jak "Data:", "Status:", "Wersja:"
❌ Nie używaj myślników ("–") jako separatorów między polami

User explicit feedback: "tam nie ma byc zadnych twoich uwag jarvis,
(...) bez żadnych kresek po prostu do skopiowania, bez komentarzy,
(...) zrób to w prostej formie do skopiowania i wklejenia"

## Co robić — FORMAT WZORCOWY

```markdown
SEO — {Nazwa Klienta}


STRONA GŁÓWNA (PL)

Nazwa:
{treść do wklejenia}

Podpis pod nazwą:
{treść do wklejenia}

META Tytuł:
{treść do wklejenia}

META Opis:
{treść do wklejenia}


OFERTA (PL)

Nazwa:
{treść}

Podpis pod nazwą:
{treść}

META Tytuł:
{treść}

META Opis:
{treść}


[...itd. dla każdej podstrony PL, potem EN]
```

## Zasady zawartości pól

### Nazwa (panel)
- Krótkie (1-3 słowa)
- To co widać w menu nawigacji
- Przykład: "Strona główna", "Oferta", "O nas", "Kontakt"

### Podpis pod nazwą
- Max 60 znaków
- Krótki opis czego strona dotyczy (wyświetlany w panelu)
- Przykład: "Lista wszystkich apartamentów z możliwością rezerwacji"

### META Tytuł
- 50-60 znaków (max 60 żeby się zmieścił w SERP)
- Format: "{Temat strony} — {Nazwa obiektu} {Miasto}"
  lub: "{Akcja CTA} | {Nazwa obiektu}"
- Przykład: "Apartamenty Parkowe Gniezno — Noclegi w centrum"

### META Opis
- **MAX 150 znaków ZE SPACJAMI** (zasada JARVIS z CLAUDE.md)
- Kończymy kropką
- Zawiera: temat, benefit, konkretne liczby/fakty
- Przykład: "Komfortowe apartamenty w zabytkowej willi w Gnieźnie.
  3 apartamenty z pełnym wyposażeniem, parking, WiFi. 50m od
  przystanku, 30 min do Poznania." (149 znaków)

## Lista podstron per klient (min.)

Standard 8 podstron × 2 języki = 16 sekcji SEO:

PL: Strona główna, Oferta, O nas, Galeria, Lokalizacja, Kontakt, Regulamin
EN: Homepage, Offers, About us, Gallery, Location, Contact, Terms & Conditions

Jeśli klient ma więcej podstron (Atrakcje, Blog, FAQ itp.) — dodaj
zachowując ten sam format.

## Weryfikacja przed oddaniem
1. Plik wygląda jak lista do wklejenia — **żaden komentarz JARVIS**
2. Wszystkie META Opisy <=150 znaków (zliczyć osobno, NIE pokazuj liczby w pliku)
3. Wszystkie META Tytuły <=60 znaków
4. PL + EN symetrycznie (ta sama liczba podstron)
5. Znaki polskie (ą, ś, ć, ż, ń) zachowane

## Kiedy DOZWOLONE jest dodać coś poza 4 polami
- **Początek pliku**: jedna linia nagłówka "SEO — {Nazwa Klienta}"
- **Pusta linia** między sekcjami dla czytelności
- NIC WIĘCEJ. Jeśli masz ochotę dodać notatkę/komentarz — zamiast tego
  zapisz ją do memory/clients_data/{klient}.json w pole "seo_notes".

## Referencja
- Client: apartamenty-parkowe (client58154)
- User feedback 2026-04-21: "tam nie ma byc zadnych twoich uwag jarvis"
- Przykład wzorcowy: `clients/apartamenty-parkowe/DO_WKLEJENIA/SEO_TYTULY_AP.md`
  po refactorze 2026-04-21
