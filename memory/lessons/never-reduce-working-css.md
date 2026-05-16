# CRITICAL LESSON — NIGDY nie wycinaj CSS z działającego klienta JARVIS

**Data:** 2026-04-20
**Klient dotknięty:** Apartamenty Parkowe Gniezno
**Koszt błędu:** 5+ iteracji, user wielokrotnie sfrustrowany

## Problem

Dostarczyłem klientowi CSS 20KB / 121 rules, myśląc że "mniej = lepiej", "czyściej", "szybciej do wklejenia". User mówi: "czemu tych linijek css jest tak malo? nie zadzialalo dla offers i contact".

Porównanie:
- **MIA Apart**: 5770 linii / 747 rules / 188KB
- **Najmar**: 5548 linii / 651 rules
- **Madera**: 3280 linii
- **Moje Apartamenty (błąd)**: 657 linii / 100 rules / 16KB  ← **20x mniej**

## Dlaczego było za mało

Myślałem że:
- "L2 komponenty `.ido-*` są nieużywane bo body_top ma `.ap-*`" → wycinałem 938 linii L2
- "Fancy features z MIA nie są potrzebne dla Apartamentów" → wycinałem FAQ, Blog, Cities
- "Minimalne CSS = mniejsze ryzyko panelu obcięcia" → WIĘKSZY mit

## Dlaczego JARVIS POTRZEBUJE pełnego CSS

Pełny CSS pokrywa nie tylko homepage, ale też:

1. **`body.page-offers`** — lista ofert (101 reguł w MIA):
   - Sidebar "Rezerwacja online" (Lokalizacja, Początek, Koniec, Osoby, Cena)
   - Filtruj wyniki (TYP OBIEKTU, UDOGODNIENIA)
   - Karty ofert (obrazek, tytuł, cena, CTA Szczegóły)
   - Filter chevron, offer hover, pagination

2. **`body.page-contact`** — strona kontaktu (55 reguł):
   - H1 "Dane kontaktowe", H2 sekcji
   - Tabela danych właściciela, NIP, Ulica, Adres
   - Mapa Leaflet z border-radius + box-shadow
   - Płatności (VISA, Mastercard)
   - Dane do przelewów

3. **`body.page-offer`** — pojedyncza oferta (149 reguł):
   - Galeria zdjęć
   - Opis apartamentu
   - Udogodnienia (lista ikon)
   - Widget rezerwacji prawa strona
   - Kalendarz dostępności
   - Cennik sezonowy

4. **`body.page-txt`** — strony tekstowe (np. regulamin, polityka)

5. **Systemowe komponenty** — litepicker (kalendarz), flatpickr, widget booking, menu dropdown, slick carousel controls, back-to-top, skip_link, formbutton, .btn variations

6. **Edge cases** — 17 traps CLAUDE.md (#1-17), wzorce MADERA/NAJMAR

**Wszystkie te rzeczy są w pełnym JARVIS CSS (5000+ linii) i muszą być obecne inaczej konkretne podstrony wyglądają domyślnie/brzydko.**

## ZASADA: używaj PORT-by-reference

Gdy robisz nowego klienta JARVIS:

### ❌ NIE RÓB:
- Pisać CSS od zera "minimalny"
- Wycinać L2 komponenty bez weryfikacji że nieużywane
- Wykluczać sekcje MIA typu cities/faq/collab myśląc że klient ich nie ma
- Optymalizować CSS poniżej 3000 linii

### ✅ RÓB:
1. **Skopiuj pełny CSS z najbliższego klienta** (MIA, Najmar, Madera)
2. **Rename prefix**: `sed 's/mi-/ap-/g'` (lub podobne)
3. **Zamień kolory**: `sed 's/#oldColor/#newColor/g'` dla wszystkich tokenów
4. **Zamień fonty** jeśli inne (np. Cormorant → Playfair)
5. **Zamień hardcoded strings**: nazwa klienta w komentarzach

Komenda one-liner:

```bash
cp /Users/user/Desktop/jarvis/clients/mia/DO_WKLEJENIA/MI_CSS_EDYTOR.css {CLIENT}_CSS_EDYTOR.css
sed -i '' \
  -e 's/mi-/{prefix}-/g' \
  -e 's/#2A2829/#{PRIMARY}/g' \
  -e 's/#8C7B6B/#{SECONDARY}/g' \
  -e 's/#C4A97D/#{ACCENT}/g' \
  -e 's/#F5F2EE/#{LIGHT}/g' \
  -e 's/MIA/{CLIENT_NAME}/g' \
  {CLIENT}_CSS_EDYTOR.css
```

Weryfikacja:
```bash
wc -l {CLIENT}_CSS_EDYTOR.css  # > 3000 linii
grep -c 'mi-\|MIA' {CLIENT}_CSS_EDYTOR.css  # powinno być 0
grep -c '\\!important' {CLIENT}_CSS_EDYTOR.css  # musi być 0
```

## Co jeśli klient nie ma jakiejś sekcji (np. FAQ, Cities)?

**ZOSTAW styling niewykorzystany w CSS**. Ten CSS zajmie ~1KB ale nic nie złamie. Klient może w przyszłości dodać sekcję i CSS już będzie gotowy.

**Wniosek**: "czysty" CSS = "niekompletny" CSS. Pełny CSS z działającego klienta to jedyny sensowny start.

## Related lessons

- `bash-heredoc-css-escape.md` — nie dodawaj CSS przez heredoc
- `live-verification-before-delivery.md` — zawsze `fetch` raw CSS
- `never-replace-working-pipeline.md` — nie rewolucjonizuj tego co działa

## TL;DR

**JARVIS CSS = 5000+ linii. Tyle ma MIA, Najmar, Madera. Jeśli masz mniej, to znaczy że wyciąłeś za dużo.**
Port-by-sed z najbliższego klienta to jedyny sensowny start. NIE pisz CSS od zera.
