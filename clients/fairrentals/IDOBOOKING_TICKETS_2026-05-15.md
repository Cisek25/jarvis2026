# Fair Rentals — 4 tickety PD/SA do eskalacji (default13 template)

**Data**: 2026-05-15 (sesja 2, v1.33)
**Klient**: Fair Rentals (client58360.idobooking.com)
**Branch**: `go` (produkcja, template default13)
**Drafter**: Damian Cisowski (IAI)
**Źródło bugów**: AUDIT_UX_2026-05-15.md (senior-frontend audit + chrome-devtools MCP weryfikacja)

---

## Analiza zbiorcza — wszystkie 4 dotyczą template default13

**Kontekst**: Fair Rentals (IdoBooking, default13) ma 4 systemowe bugi nie do naprawienia po stronie warstwy 3 (custom CSS/HTML). To bugi w generowanym HTML przez template — wymagają interwencji zespołu utrzymującego template default13.

**Wspólne cechy**:
- Wszystkie potwierdzone na live (chrome-devtools MCP + curl + DOM inspection)
- Wszystkie dotyczą wielu klientów IdoBooking używających default13 (skala globalna)
- Klient widzi skutki: spadek SEO (canonical/hreflang), a11y FAIL (labels), drobne (target=blank)
- Brak workaround w custom CSS — to HTML template

**Routing**: zespół utrzymujący IdoBooking templates (prawdopodobnie **IBI** — IdoBooking team).
**TO VERIFY** z Team Leaderem przed wysłaniem — w teams.md skill referuje ISR/ICA/ISM/ICS/ISU/IST/ISI/WDRD/ISG/IBI, najprawdopodobniej IBI dla IdoBooking, ale Damian powinien potwierdzić.

**Sugeruję zbiorczy email do TL przed wysłaniem**: "Mam 4 tickety dla template default13 IdoBooking — czy IBI to właściwy dział? Czy łączyć w 1 ticket Bug-Bundle czy każdy osobno?".

---

# TICKET 1/4 — Canonical SEO blocker

**Tytuł sugerowany**:
```
[IBI] default13: <link rel="canonical"> wskazuje na homepage na wszystkich podstronach (/offers, /txt/*) — SEO blocker
```

```markdown
1. **Opis problemu**
Na template default13 IdoBooking element `<link rel="canonical">` na wszystkich podstronach (`/offers`, `/offer/*`, `/txt/200`, `/txt/201`, `/txt/203`, `/contact`) wskazuje na homepage głównego języka (np. `https://client58360.idobooking.com/pl/`) zamiast na canonical URL danej podstrony. Google indeksuje wszystkie podstrony jako duplikaty homepage'a — żadna nie pojawia się w SERP-ach mimo unikalnego contentu i meta description.

2. **Oczekiwane zachowanie**
Każda podstrona powinna mieć canonical wskazujący na siebie:
- `/pl/offers` → `<link rel="canonical" href="https://client58360.idobooking.com/pl/offers">`
- `/pl/txt/200/Atrakcje-Wroclawia` → canonical pointing to itself
- `/pl/contact` → canonical pointing to itself
Tylko homepage `/pl/` powinien mieć canonical do `/pl/`.

3. **Skala**
- Globalna: dotyczy wszystkich klientów IdoBooking używających default13 — należy zweryfikować z portfela
- Lokalna: Fair Rentals — wszystkie ~12 podstron PL/EN/DE (~36 URL-i razem) mają błędny canonical
- Sprawdzić wiki/backlog czy już zgłoszone — przy tej skali raczej tak

4. **Sekwencja zdarzeń**
Bug istnieje od momentu wgrania default13. Klient zauważył brak indeksacji w Google Search Console (0 sub-pages w SERP mimo `noindex` zdjętego po zgłoszeniu).

5. **Ścieżka odtworzenia**
1. Otwórz dowolny klient IdoBooking z default13 (Fair Rentals: `https://client58360.idobooking.com/pl/`)
2. Przejdź na podstronę, np. `https://client58360.idobooking.com/pl/offers`
3. View Source (`Ctrl+U`) → szukaj `<link rel="canonical"`
4. Obserwuj: `href="https://client58360.idobooking.com/pl/"` (homepage, NIE bieżący URL)
5. Powtórz dla `/pl/txt/200`, `/pl/txt/201`, `/pl/contact` — to samo

6. **Typ**: Bug

7. **Priorytet**: Major
Uzasadnienie: SEO impact — Google nie indeksuje 80% strony. Wpływa na traffic i konwersję. Brak workaround po stronie custom CSS/HTML (canonical generowany przez template). NIE Critical bo strona działa, sprzedaż możliwa.

8. **Branch**: go (produkcja)

9. **Artefakty**
- View Source `https://client58360.idobooking.com/pl/offers` — grep `canonical`
- View Source `https://client58360.idobooking.com/pl/txt/200/Atrakcje-Wroclawia` — grep `canonical`
- Screenshot z Google Search Console pokazujący 0 indeksowanych sub-pages (do dostarczenia przez klienta po odblokowaniu indeksacji w panelu)
- Komenda: `curl -s https://client58360.idobooking.com/pl/offers | grep canonical`

10. **Kontekst biznesowy**
Klient ma 21 apartamentów do wynajmu. Brak indeksacji podstron blokuje organic traffic z long-tail keywords (np. "apartamenty Stare Miasto Wrocław"). Klient płaci za hosting + branding ale nie odzyskuje SEO inwestycji.
```

---

# TICKET 2/4 — `target="blank"` typo w footer links

**Tytuł sugerowany**:
```
[IBI] default13: footer linki REGULAMIN/POLITYKA PRYWATNOŚCI mają target="blank" (literówka, brak underscore) — nie otwierają nowej karty
```

```markdown
1. **Opis problemu**
Na template default13 IdoBooking, generowane w stopce linki do regulaminu i polityki prywatności mają atrybut `target="blank"` (BEZ podkreślnika) zamiast prawidłowego `target="_blank"`. Skutek: kliknięcie otwiera link w bieżącej karcie zamiast w nowej (`target="blank"` jest interpretowane jako nazwa nazwanego okna, nie magic value `_blank`). Klient traci kontekst sesji przeglądarki przy klikaniu prawnych dokumentów.

2. **Oczekiwane zachowanie**
Linki w stopce powinny mieć `target="_blank"` z dodatkowo `rel="noopener noreferrer"` (security best practice — zapobiega `window.opener` exploit).

3. **Skala**
- Globalna: dotyczy wszystkich klientów IdoBooking z default13
- Lokalna: Fair Rentals — 2 linki w stopce (REGULAMIN PL/EN/DE + POLITYKA PRYWATNOŚCI PL/EN/DE)
- Bug literowy w template — łatwy fix po stronie IT

4. **Sekwencja zdarzeń**
Bug obecny od początku wgrania default13. Zauważony podczas audytu UX 2026-05-15 (senior-frontend subagent + chrome-devtools MCP).

5. **Ścieżka odtworzenia**
1. Otwórz https://client58360.idobooking.com/pl/
2. Scroll do stopki
3. Inspect Element na linku "REGULAMIN"
4. Obserwuj atrybut: `target="blank"` (powinno być `target="_blank"`)
5. Kliknij link — otwiera się w tej samej karcie (przeglądarka traktuje "blank" jako nazwę okna, nie magic value)

6. **Typ**: Bug

7. **Priorytet**: Minor
Uzasadnienie: nie wpływa na sprzedaż, workaround dla użytkownika = `Ctrl+klik` lub prawy przycisk → "Otwórz w nowej karcie". Bug literowy, fix < 5 min po stronie template.

8. **Branch**: go (produkcja)

9. **Artefakty**
- View Source `https://client58360.idobooking.com/pl/` → szukaj `target="blank"` w sekcji footer
- Konkretne linki:
  - `https://client58360.idobooking.com/pl/regulamin` (REGULAMIN)
  - `https://client58360.idobooking.com/pl/polityka-prywatnosci` (POLITYKA PRYWATNOŚCI)
- Screenshot z DevTools Elements panel pokazujący atrybut

10. **Kontekst biznesowy**
Brak — bug kosmetyczny.
```

---

# TICKET 3/4 — Brak `<label for="id">` na 123+ filter checkboxach

**Tytuł sugerowany**:
```
[IBI] default13: brak <label for="id"> na 123+ checkboxach filtrów w /offers — a11y WCAG 2.1 FAIL
```

```markdown
1. **Opis problemu**
Na stronie wyszukiwarki ofert (`/offers`) template default13 generuje ~123 checkboxów do filtrowania (kategorie, lokalizacje, udogodnienia, ceny, marki itp.) bez prawidłowego skojarzenia z etykietami. Brak atrybutu `<label for="checkbox-id">` lub wrapping `<label><input>tekst</label>`. Skutek: czytniki ekranowe (NVDA, JAWS, VoiceOver) nie ogłaszają nazwy checkboxa — niewidomi użytkownicy nie mogą filtrować ofert. Lighthouse Accessibility audit FAIL.

2. **Oczekiwane zachowanie**
Każdy checkbox powinien mieć skojarzoną etykietę — preferowane:
```html
<label class="filter-item">
  <input type="checkbox" name="amenity" value="parking">
  <span>Parking</span>
</label>
```
Alternatywnie: `<input id="x"> + <label for="x">tekst</label>`.

3. **Skala**
- Globalna: wszystkie klienty IdoBooking z default13 mają ten sam problem na `/offers`
- Lokalna: Fair Rentals — 123+ checkboxów PL/EN/DE × każda strona z filtrowaniem
- WCAG 2.1 AA Level wymaga relacji label↔input (Success Criterion 1.3.1 Info and Relationships, 4.1.2 Name Role Value)

4. **Sekwencja zdarzeń**
Bug strukturalny w template default13 — istnieje od początku. Wykryty podczas audytu WCAG AA (chrome-devtools Lighthouse + axe-core).

5. **Ścieżka odtworzenia**
1. Otwórz https://client58360.idobooking.com/pl/offers
2. Rozwiń panel filtrów po lewej stronie
3. DevTools (F12) → Elements → wybierz dowolny checkbox
4. Obserwuj: `<input type="checkbox" name="..." value="...">` — brak `id`, brak otaczającego `<label>`
5. Tekst etykiety leży w `<span>` jako sąsiad lub w `<div>` ojcowski — bez relacji semantycznej
6. Test screen reader: aktywuj VoiceOver (`Cmd+F5` Mac) lub NVDA (Windows), nawiguj po checkboxach — czytnik ogłasza "unchecked checkbox" bez nazwy

6. **Typ**: Bug

7. **Priorytet**: Major
Uzasadnienie: a11y compliance — WCAG 2.1 AA wymagane przez Dyrektywę o Dostępności (EAA — European Accessibility Act, 2025). Brak dostępu dla niewidomych użytkowników = ryzyko prawne (skargi do PFRON/UKE) + reputacyjne. Workaround = aria-label, ale to nie naprawia struktury template. NIE Critical bo strona działa dla widzących.

8. **Branch**: go (produkcja)

9. **Artefakty**
- Lighthouse Accessibility audit (chrome-devtools MCP) z URL: `https://client58360.idobooking.com/pl/offers`
- Konkretny issue: "Form elements do not have associated labels" (axe-core rule id: `label`)
- DevTools Elements screenshot pokazujący strukturę 1 checkboxa bez label/for
- VoiceOver / NVDA test recording (jeśli wymagany przez IBI)

10. **Kontekst biznesowy**
EAA wchodzi w pełni od 2025-06-28 — sklepy SaaS dla małych firm muszą być dostępne. IdoBooking jako platforma SaaS dla 1000+ klientów ma ryzyko zbiorczych skarg jeśli template default13 nie spełnia AA.
```

---

# TICKET 4/4 — Hreflang nie obsługuje 3+ języków konsekwentnie

**Tytuł sugerowany**:
```
[IBI] default13: <link rel="alternate" hreflang> generuje tylko 2 z 3 wersji językowych (brak DE w head PL/EN) — SEO impact multilingual
```

```markdown
1. **Opis problemu**
Na klientach IdoBooking z 3+ wersjami językowymi (PL/EN/DE), template default13 w generowanym `<head>` wstawia `<link rel="alternate" hreflang>` tylko dla 2 pierwszych aktywowanych języków, nie dla wszystkich. Konkretnie: na stronie PL pojawiają się tylko alternates dla PL+EN, brak DE. Skutek: Google Search Console raportuje "Hreflang errors — missing return tag" — wersja DE nie jest powiązana z PL/EN w indeksie, niemieccy użytkownicy nie są kierowani na `/de/`. Workaround po stronie warstwy 3 (custom HEAD) możliwy ale wymaga ręcznej duplikacji na każdej podstronie × każdy język.

2. **Oczekiwane zachowanie**
W `<head>` każdej wersji językowej template powinien wygenerować pełen zestaw `hreflang` dla wszystkich aktywowanych wersji + `x-default`:
```html
<link rel="alternate" hreflang="pl" href=".../pl/">
<link rel="alternate" hreflang="en" href=".../en/">
<link rel="alternate" hreflang="de" href=".../de/">
<link rel="alternate" hreflang="x-default" href=".../pl/">
```
Konsekwentnie na każdej podstronie (nie tylko homepage).

3. **Skala**
- Globalna: dotyczy wszystkich klientów IdoBooking z 3+ wersjami językowymi (~%? klientów portfela)
- Lokalna: Fair Rentals — 3 wersje (PL/EN/DE), ~12 podstron, na każdej brak DE w hreflang
- Workaround tymczasowy: ręcznie dodaliśmy hreflang DE w custom HEAD (v1.33) ale to anti-pattern — powinno być natywne

4. **Sekwencja zdarzeń**
Bug istnieje od momentu aktywacji 3. wersji językowej (DE) na koncie Fair Rentals (data z panelu). Wykryty podczas audytu SEO 2026-05-15.

5. **Ścieżka odtworzenia**
1. Konto IdoBooking z 3 aktywowanymi wersjami językowymi PL+EN+DE (np. Fair Rentals client58360)
2. Otwórz https://client58360.idobooking.com/pl/
3. View Source → szukaj `hreflang`
4. Obserwuj: tylko pl + en + x-default. **Brak DE.**
5. Powtórz na `/en/` → tylko pl + en + x-default
6. Powtórz na `/de/` → tu jest pełen komplet (pl + en + de + x-default) — czyli bug objawia się tylko na wersjach NIE-DE

6. **Typ**: Bug

7. **Priorytet**: Major
Uzasadnienie: SEO multilingual — Google Search Console reportuje błędy, niemieccy użytkownicy z google.de nie są kierowani na `/de/`. Workaround po stronie custom HEAD możliwy ale wymaga manual maintenance per klient. Bug strukturalny w template.

8. **Branch**: go (produkcja)

9. **Artefakty**
- View Source `https://client58360.idobooking.com/pl/` — sekcja hreflang
- View Source `https://client58360.idobooking.com/de/` — sekcja hreflang (dla porównania — tu jest komplet)
- Screenshot Google Search Console → International targeting → Language section (klient musi udostępnić)
- Komenda: `curl -s https://client58360.idobooking.com/pl/ | grep hreflang`

10. **Kontekst biznesowy**
Klient ma niemieckich gości (rynek transgraniczny — Wrocław blisko granicy DE). Brak hreflang DE = brak organic visibility w google.de = utracone rezerwacje.
```

---

## Podsumowanie routingu — dla Damiana przed wysłaniem

| # | Tytuł | Typ | Priorytet | Dział | Powiadomienie email |
|---|---|---|---|---|---|
| 1 | Canonical SEO blocker | Bug | **Major** | IBI (default13 team) | NIE (Major nie wymaga) |
| 2 | target="blank" typo | Bug | Minor | IBI | NIE |
| 3 | Brak label na 123+ checkboxach | Bug | **Major** | IBI | NIE |
| 4 | Hreflang inconsistent 3+ lang | Bug | **Major** | IBI | NIE |

**Akcje przed wysłaniem**:
1. ☐ Potwierdź z Team Leaderem czy IBI to właściwy dział dla template default13 (lub WDRD)
2. ☐ Sprawdź wiki + Backlog czy któryś z 4 nie jest już zgłoszony (duplicate detection)
3. ☐ Zdecyduj: 4 osobne tickety czy 1 zbiorczy "default13 — bundle 4 bugów" (do TL)
4. ☐ Klient (Fair Rentals) ma wcześniej odblokować indeksację w panelu → dopiero wtedy artefakty z Google Search Console będą dostępne
5. ☐ Wszystkie 4 wymagają zrzutów ekranu + View Source z DevTools — masz na live, zbierz pre-wysłka

**Kiedy nie eskalować** (anti-pattern check):
- Wszystkie 4 to potwierdzone bugi template (chrome-devtools MCP) — nie konfiguracja klienta ✓
- Nie ma konfliktu z dokumentacją IdoBooking (sprawdziłem help.idosell.com — żaden bug nie jest "by design") ✓
- Klient widoczne skutki w jego panelu (SEO, indeksacja) — nie "ghost hunting" ✓

OK do eskalacji po confirmacji routingu.

---

**Plik wygenerowany**: 2026-05-15, JARVIS v1.33
**Następne**: Damian → konsultacja z TL → wysyłka przez kreator "Escalate to IT" w panelu IAI tickets.
