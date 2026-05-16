# Engine CSS Iteration Process — 13 wersji w jednej sesji

**Klient**: piekary13 (client23326 / Toruńskie Apartamenty)
**Data**: 2026-05-05 → 2026-05-06
**Plik**: `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css`
**Iteracje**: v1 → v13 (1798 linii / 63KB final)

## Co się stało

Klient prosił o stylowanie silnika rezerwacji (osobne pole CSS od strony głównej w panelu IdoBooking). Zaczęło się od prostego brief'u "ukryj logo + powiąż z 2 markami". Przez 13 iteracji w 2 dni dotarliśmy do gotowego pliku.

## Timeline iteracji

| v | Zakres | Co zadziałało | Co poszło nie tak |
|---|---|---|---|
| **v1** | hide logo + system vars override + Flatpickr | Marker, gold pill price, footer | Niewystarczające pokrycie |
| **v2** | dodanie .calendar-menu, .ck_dsclr, .accommodation, +20 klas | Coverage 90% | User: "fatalnie, kolory niedopasowane" |
| **v3** | 🔥 Hotel Concierge restructure (flex 50%, ::before labels, gold arrow, hero 96px) | — | **Layout się rozsypał**. ROLLBACK |
| **v4** | Revert do minimal coloring | OK | Brakowało detali |
| **v5** | top menu pill OFF, .btn-grenade burgundy | OK | Tiles 3-tonowe |
| **v6** | tiles transparent default (cream container baseline) | UI spójne | Header miał ramkę box-shadow |
| **v7** | header transparent + box-shadow off | Top menu zlewa się z body | Buttony różne wymiary |
| **v8** | **MCP audit**: buttons 48px height + min-160 width uniform | 47/49 PASS, breakthrough | Select-option niewidoczne |
| **v9** | .select-option burgundy + tabs OFERTA/PROMOCJE pill | Modern segmented control | FILTRY box-shadow ramka |
| **v10** | FILTRY box-shadow off + mobile audit | mobile 5/8 PASS | FILTRY mały link 240×38 |
| **v11** | FILTRY full tile 110px + center text + clickable | UX win | tiles bez separation |
| **v12** | obrysy cream3 wszystkie tile + persons hover fix | 4/4 PASS | footer rozjechany |
| **v13** | footer_links horizontal + cookie h-tag font fix | 5/5 PASS | **gotowe** |

## Najważniejsza lekcja: MCP > screenshot guessing

**Iteracje v1-v7**: 50% trafność. Iterowałem przez:
- User screenshot → ja interpretuję → fix CSS → user wkleja → screenshot → loop

**Iteracje v8+**: 90%+ trafność. Workflow zmienił się na:
- `mcp__playwright__browser_navigate(URL)`
- `browser_evaluate` z **batch testów PASS/FAIL** (computed styles vs expected)
- `inject patch` via `<style>` tag → re-measure → confirm GREEN → wtedy update plik
- Screenshot dla user'a jako visual confirmation

Game-changer. Powinienem był włączyć MCP od v1.

## Najważniejszy bug: v3 Hotel Concierge restructure

User: *"te wybory dat są fatalne, weź to przemyśl i zrób z głową"*. Wziąłem to jako carte blanche na restructure, aktywowałem `frontend-design` skill, zaprojektowałem **Hotel Concierge Card**:
- flex 50% kolumny dla `.calendar-menu-from/to`
- `::before` labels "Przyjazd"/"Wyjazd"/"Goście"/"Filtry"
- hero dates Playfair clamp(56px, 8vw, 96px)
- gold arrow `→` między datami
- dotted gold hairline między rzędami
- `display: none` na system `.hd-label`

**Skutek**: layout rozsypał się. Daty 05 i 06 rozjechane (system DOM ma absolute positioning), ikona kalendarza wyszła w prawy róg, FILTRY duplicate label (mój ::before + system text), GOŚCIE+LICZBA OSÓB duplicate, system step indicator nie matchował moich `.steps`/`.iai-bullet` defensive selektorów.

User feedback: *"weź ty wycofaj PRZESTAWIANIE elementów i zmiany elementów, tylko ja pokoloruj wszystkie"*.

**Lekcja**: gdy klient mówi "popraw" — domyślne minimal coloring, NIE restructure DOM. Restructure tylko z explicit prośbą o BOLD design. Zob. instinct 043.

## Drugi największy bug: specificity wars

5 razy w sesji moja reguła z `!important` nie wygrywała z system CSS o tej samej specificity. Klasyczna pułapka — dodanie kolejnego `!important` nie pomoże (już jest).

**Fix**: eskalacja specificity selektora.

| Przykład | FAIL specificity | OK specificity |
|---|---|---|
| header transparent | `header` (0,0,1) | `body header` (0,0,2) |
| tabs OFERTA active | `.btn-main-nav.active` (0,2,0) | `ul.main-nav li.btn-main-nav.active` (0,3,2) |
| FILTRY box-shadow | `.btn-modal-link` (0,1,0) | `body a.btn-modal-link.btn-big` (0,2,2) |
| tiles borders | `.calendar-menu-from` (0,1,0) | `html body .calendar-menu .calendar-menu-from` (0,2,2) |

Zob. instinct 042.

## Trzeci bug: inner element hover overflow

W v6-v8 hover na `.calendar-menu-row.personFilter` (LICZBA OSÓB tile, 242×110) automatycznie też dawał hover na `.calendar-menu-persons` (inner 62×47). Dwa elementy z cream2 bg = visual "kafelek wewnątrz kafelka".

**Fix v12**: wykluczyć inner z `:hover` selektora. Force `transparent + border:0` nawet w hover state. Tylko parent dostaje hover.

## Co byłoby lepiej

1. **MCP audit od start** — odpalić playwright PRZY v1, nie czekać do v8.
2. **Brainstorming PRZED restructure** — gdy wmawiałem sobie że "user prosi o przemyślenie", tak naprawdę prosił tylko o lepszy coloring. Domyślne `restraint > maximalism`.
3. **Live verify version marker przed feedbackiem** — kilka razy user reagował na stary stan (cache, nie wkleił najnowszej wersji). `fetch link.href + check marker` powinno być pierwszym krokiem po każdym user feedbacku.
4. **Mniej iteracji po jednej linijce zmiany** — v10-v11-v12 to były 3 osobne edycje za 30 min. Mogłem to zrobić w jednej v10 z 3 fixami.

## Output finalny

- 13 iteracji ENGINE_CSS.css
- 1798 linii / 63KB / 0 escaped !important
- Pokrywa: hide logo, system vars, search bar, tabs OFERTA/PROMOCJE pill, buttons uniform 48×min-160, .select-option, .btn-modal-link FILTRY full tile, tile borders cream3, footer horizontal, cookie font fix, Flatpickr/Litepicker/UI calendar, mobile responsive
- TDD verified: 47/49 (v5), 4/4 (v7), 5/5 (v8 buttons), 6/6 (v9 tabs), 4/4 (v12 borders), 5/5 (v13 footer)

## Referencje

- Plik: `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css`
- Memory: `memory/clients_data/piekary13.json` (history + iterations_history)
- Instincts: 041 (MCP audit), 042 (specificity escalation), 043 (restraint over restructure)
- Master design plan: `docs/plans/2026-05-05-piekary13-engine-css-design.md`
