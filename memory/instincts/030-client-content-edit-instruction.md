---
name: Client-facing edit instruction (exception, not default)
description: Normalnie nie dostarczamy instrukcji edycji klientom, ale gdy klient prosi o samodzielne podmiany tekstów/zdjęć — zawsze w tym samym formacie (backup first, text-only edits, images via panel gallery, footer via Lokalizacja ID1, logo warning)
type: feedback
---

## Zasada bazowa

**Domyślnie JARVIS NIE pisze instrukcji edycji dla klienta.** Klient dostaje gotową stronę do wklejenia (`DO_WKLEJENIA/`) i to my utrzymujemy kod. Instrukcje pisze się TYLKO gdy:

- klient wprost prosi o możliwość samodzielnych edycji,
- klient zgłasza nieaktualne treści i chce mieć kontrolę nad korektami między releasami,
- klient ma własnego copywritera / asystenta, który będzie podmieniał teksty.

**Why:** instrukcje są ryzykiem — klient łamie HTML, my dostajemy ticket na naprawę. Pisząc instrukcję przerzucamy na klienta odpowiedzialność za zrozumienie kodu, więc musi być maksymalnie defensywna (backup first, czego NIE ruszać, jak cofnąć zmianę).

## Jak piszemy — stała struktura 8 sekcji

Gdy już piszemy instrukcję edycji, trzymamy się formatu:

1. **Backup przed edycją (KONIECZNE)** — zawsze na początku, pogrubione, z krokami `Ctrl+A` → `Ctrl+C` → plik `.txt` z datą per strona.
2. **Podmiana tekstu** — `Ctrl+F` w edytorze HTML, przykład poprawny vs. połamany tag, przypomnienie że każda podstrona osobno.
3. **Podmiana zdjęcia** — 3 kroki: (a) upload do galerii strony w panelu, (b) prawy przycisk → „Kopiuj adres obrazu", (c) podmiana `src="..."` w HTML. Zawsze uwaga o `alt=""`.
4. **Stopka** — wyjaśnienie że idzie z `Lokalizacja ID=1` (link do panelu), i że rozszerzenie stopki wymaga kodu od nas.
5. **Logo na silniku rezerwacji** — ostrzeżenie że podmiana w panelu odbija się na innych obiektach tego klienta; rekomendacja ukrycia logo + opcjonalny restyling silnika.
6. **Czego NIE ruszać** — lista (script, class, id, data-\*, komentarze HTML, bloki strukturalne).
7. **Co podmieniać wolno** — lista (tekst między tagami, `src`, `alt`, telefon/email/URL).
8. **Jak cofnąć zmianę** — krok po kroku z backupu.

## Ton

- Język polski, 2. osoba („zrób", „skopiuj"), bezpośrednio.
- Bez emoji (zgodnie z feedback_no_emoji_client_code).
- Bez żargonu („frontend", „DOM", „tag" używamy tylko z wyjaśnieniem).
- Przykłady kodu w blokach ```.
- Sekcje oddzielone `---`.
- Data na końcu: `*Dokument aktualny na dzień: YYYY-MM-DD*`.

## How to apply

- **Gdy klient pyta "jak mam podmienić…?"** — przed odpowiedzią pojedynczą wiadomością, zasugeruj że napiszesz pełną instrukcję do pliku (jednorazowy koszt, klient ma zasób na stałe).
- **Zapisuj plik** jako `clients/{klient}/DO_WKLEJENIA/INSTRUKCJA_EDYCJI_KLIENT.md` (nie mieszać z istniejącym `INSTRUKCJA.txt`, który jest instrukcją wklejania kodu do panelu — inna sprawa).
- **Referuj do załączników klienta** tylko jeśli klient sam je przysłał (np. „zał. 3", „zał. 4") — nie wymyślaj numeracji.
- **Nie pisz tutorialu HTML od zera** — zakładamy że klient widzi kod w edytorze i potrzebuje wiedzieć CO wolno ruszyć, nie JAK działa HTML.

## Referencja

Pierwszy wzorcowy dokument: `clients/piekary13/DO_WKLEJENIA/INSTRUKCJA_EDYCJI_KLIENT.md` (2026-04-23, klient prosił po zgłoszeniu nieaktualnych treści — malowidła/sień).
