# Projekt: Baza Wiedzy IdoBooking

## Lokalizacja
`/Users/user/idobooking-knowledge-base/`

## Cel projektu
Zweryfikowana baza wiedzy systemu IdoBooking (IdoSell Booking) służąca jako:
1. **Źródło wiedzy dla agenta AI** odpowiadającego klientom (`klient/`)
2. **Podręcznik dla pracowników supportu** (`pracownik/`)

## Kontekst
- Dane wyjściowe pochodzą z 2933 rozmów Gemini AI z klientami — Gemini **często halucynował**
- Źródło prawdy: oficjalna dokumentacja https://pomoc.idobooking.com (94 artykuły, 9 kategorii)
- Pliki klient/ zweryfikowane i poprawione vs oficjalna dokumentacja
- Pliki pracownik/ NIE zweryfikowane (score "low" w verification-status.json)

## Status faz (stan: 2026-02-20)

| Faza | Status | Opis |
|------|--------|------|
| Faza 1: Weryfikacja klient/ | ✅ DONE | 36+2 plików zweryfikowanych z pomoc.idobooking.com |
| Faza 2: Uzupełnienie braków | ✅ DONE | +2 klient (galeria, regulamin), +3 pracownik (pricelabs, zamki, konfiguracja) |
| Faza 3: Metadata | ✅ DONE | index.json, topics-map.json, verification-status.json |
| Faza 4: Panel stary vs nowy | ❌ TODO | Wymaga dostępu do paneli client9933 i client55004 |
| Faza 5: README finalizacja | ✅ DONE | README.md i 00-START.md zaktualizowane |

## Co zostało do zrobienia

### Faza 4 (opcjonalna) — Panel stary vs nowy
- `pracownik/panel-nowy/` jest PUSTY — trzeba udokumentować nowy panel (client55004)
- Wymaga dostępu do panelu lub screenów
- Panel stary (`pracownik/panel-stary/`) ma 3 pliki ale NIE zweryfikowane

### Weryfikacja plików pracownik/
- Wszystkie 21 plików pracownik/ mają score "low" (brak tagów [ZWERYFIKOWANE])
- Treść powstała z rozmów Gemini — może zawierać halucynacje
- Priorytet niższy niż klient/ bo to dokumentacja wewnętrzna

### Tagi [DO WERYFIKACJI] w klient/
- 96 wystąpień DO WERYFIKACJI w plikach klient/ (78) i pracownik/ (18)
- Oznaczają fragmenty wymagające dodatkowego potwierdzenia
- 16 plików klient/ ma score "medium" (mają zarówno ZWERYFIKOWANE jak i DO WERYFIKACJI)

## Kluczowe pliki
- `PLAN.md` — pełny plan z postępami wszystkich faz
- `klient/00-START.md` — instrukcja i mapa plików dla agenta AI
- `metadata/index.json` — indeks 62 plików (tytuł, kategoria, audience, opis)
- `metadata/topics-map.json` — 15 tematów → pliki + keywords PL
- `metadata/verification-status.json` — status weryfikacji każdego pliku
- `metadata/gemini_categorized.json` — 2933 rozmów (8.2 MB)

## Statystyki
- 62 pliki .md łącznie (38 klient + 24 pracownik)
- 498x [ZWERYFIKOWANE], 208x [Z DOSWIADCZENIA], 96x [DO WERYFIKACJI]
- 15 tematów pokrytych z rozmów Gemini

## Zasady pracy przy tym projekcie
- Język plików: **polski** (bez polskich znaków diakrytycznych w treści, bo tak było od początku)
- Źródło prawdy: pomoc.idobooking.com — jeśli coś się nie zgadza, wierzyć oficjalnej dokumentacji
- Weryfikacja: fetch oficjalnego artykułu → porównaj → popraw → zmień tag DO WERYFIKACJI → ZWERYFIKOWANE
- User nie chce być pytany — "zaczynaj o nic nie pytaj kontynuuj"
- Można też brać info z idobooking.com (nie tylko pomoc.idobooking.com)

## Jak kontynuować
1. Przeczytaj `PLAN.md` w projekcie
2. Sprawdź co zostało (Faza 4, weryfikacja pracownik/, tagi DO WERYFIKACJI)
3. Kontynuuj bez pytania — user preferuje autonomiczną pracę
