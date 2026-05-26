# Quickstart — Nowy klient od briefa do delivery

> Narrative companion do [CLAUDE.md §2 Workflow 6-Phase](../../CLAUDE.md#2-workflow-6-phase-nowy-klient-od-briefa-do-delivery).
> CLAUDE.md = rigid checklist dla Claude. Ten dokument = narrative dla Damiana.
> Czytasz raz, zapamiętasz wzorzec.

## TLDR

```
Brief → JARVIS pracuje 3-4h → Damian dostaje gotowy package → Klient wkleja → Live verify → Sign-off → Iteracje per ticket
```

7 kroków poniżej.

---

## Krok 1: Otrzymujesz brief od klienta

Klient (lub Damian z notatkami z rozmowy z klientem) wypełnia [templates/BRIEF_NEW_CLIENT.md](../../templates/BRIEF_NEW_CLIENT.md).

Brief ma 4 sekcje:
1. **REQUIRED** — identyfikacja, brand, stack, target, język, podstrony. Bez tego JARVIS nie wystartuje.
2. **OPTIONAL** — vibe, inspiracje, kolory brand, fonty, must-have features, hard NO, tone of voice.
3. **AUTO-FILL** — JARVIS uzupełni puste pola jeśli klient nie sprecyzował.
4. **Kontakt** — dane Damiana ↔ klient + dane do publikacji na stronie.

Zapisujesz brief jako `clients/<nazwa-klienta>/BRIEF.md`.

**Convention dla `<nazwa-klienta>`**: kebab-case, lowercase, ASCII tylko (nie używa polskich znaków). Przykłady: `piekary13`, `mountain-prestige`, `solidne-apartamenty`, `booking-bydgoszcz`.

---

## Krok 2: Triggerujesz JARVIS

W chacie z Claude (Claude Code, terminal lub IDE):

> wykonaj brief klienta <nazwa>

Lub bardziej formalne:

> Wykonaj pełen workflow nowego klienta dla `clients/<nazwa>/BRIEF.md`. Phase 0-6.

Claude załaduje CLAUDE.md auto przy starcie sesji = już ma cały kontekst.

JARVIS automatycznie:
1. Czyta `clients/<nazwa>/BRIEF.md`
2. Waliduje REQUIRED fields (jeśli czegoś brakuje → STOP, pyta Damiana)
3. Infer vibe jeśli puste w briefie (z target + brand description)
4. Confirmuje wybór wraz z Damianem (1 pytanie z 2-3 opcjami)
5. Phase 0 — RECON (MCP otwiera panel klienta, sprawdza default13, fullpage.js, hotspot)

---

## Krok 3: JARVIS pracuje (3-4h)

Workflow z [CLAUDE.md §2](../../CLAUDE.md#2-workflow-6-phase-nowy-klient-od-briefa-do-delivery):

| Phase | Czas | Output |
|---|---|---|
| 0 — RECON | 15 min | `PHASE0_RECON.md` z weryfikacjami panelu |
| 1 — BRIEF+TOKENS | 20 min | `DESIGN_TOKENS.md` z paletą + fontami + variants |
| 2 — CSS SKELETON | 45 min | `CSS_EDYTOR.css` (5000-12000 linii) composed z 10 layers |
| 3 — KONIEC_BODY JS | 30 min | `KONIEC_BODY.html` <62KB z modułami JS |
| 4 — BODY_TOP 8 podstron | 90 min | 8 plików `<PODSTRONA>_PL__body_top.html` per język |
| 5 — LIVE VERIFY (po Twoim wklejeniu w sandbox) | 30 min | `LIVE_VERIFY_<data>.md` z 4 screenshotami |
| 6 — INSTRUKCJA + DELIVERY | 20 min | `DO_WKLEJENIA/` complete + ZIP |

**Real-time updates per phase**: Claude raportuje status po każdej fazie. Możesz przerywać + redirect jeśli widzisz że coś nie tak.

**Decision points**: zwykle 2-3 razy podczas workflow, Claude pyta Cię o decyzję (wybór vibe variant, logo clickable/non, EN+DE tłumaczenie zlecisz nam czy klient sam).

---

## Krok 4: Delivery do Damiana

Po Phase 6 dostajesz folder `clients/<nazwa>/DO_WKLEJENIA/`:

```
DO_WKLEJENIA/
├── CSS_EDYTOR.css                   # do Arkusz stylów CSS w panelu
├── KONIEC_BODY.html                 # do body_bottom każdej podstrony
├── HEAD.html                        # do HEAD
├── GLOWNA_PL__body_top.html         # do podstrony Strona Główna body_top
├── ONAS_PL__body_top.html
├── GALERIA_PL__body_top.html
├── LOKALIZACJA_PL__body_top.html
├── ATRAKCJE_PL__body_top.html
├── APARTAMENTY_PL__body_top.html
├── REGULAMIN_PL__body_top.html
├── KONTAKT_PL__body_top.html
├── (powyższe per inny język jeśli klient ma EN/DE/ES)
└── INSTRUKCJA.txt                   # step-by-step dla klienta
```

Plus dokumenty w `clients/<nazwa>/`:
- `BRIEF.md` (oryginalny brief)
- `PHASE0_RECON.md` (notatki z reconnu)
- `DESIGN_TOKENS.md` (kolory/fonty/variants per ten klient)
- `LIVE_VERIFY_<data>.md` (po Phase 5)

---

## Krok 5: Klient wkleja w panel

INSTRUKCJA.txt w `DO_WKLEJENIA/` prowadzi klienta krok-po-kroku:

1. Login do panelu IdoBooking
2. BACKUP obecnego CSS (kopia do txt — anti-disaster)
3. Wklejenie CSS_EDYTOR.css → "Arkusz stylów CSS"
4. Wklejenie HEAD.html → pole HEAD
5. Per podstrona: wklejenie body_top + body_bottom
6. Weryfikacja własna (lista 6 punktów: logo, kolory, podstrony, oferty, footer, mobile)
7. Zgłoszenie problemów do nas (jeśli coś nie działa)

Czas dla klienta: ~2h (zależy od liczby podstron + języków).

Klient **nie** edytuje kodu samemu — jeśli edytuje, JARVIS straci synchronizację. Klient zgłasza zmianę do nas, my robimy.

---

## Krok 6: Live verify (Damian + Claude przez MCP)

Po klienta confirm "wkleiłem wszystko, dajcie znać czy OK":

> sprawdz na żywo <domain-klienta>

Trigger `sprawdz` = JARVIS NATYCHMIAST odpala Chrome DevTools MCP, navigate do strony klienta, audytuje 4 punkty:

1. Desktop 1920×1080 home — screenshot + brand colors + fonty
2. Mobile 375×812 home — hamburger, search-first order
3. Offer page (jeśli istnieje) — kill duplicates, price chip layout, sticky tabs
4. Footer — Powered by IdoBooking visibility + payment strip

Output: lista findings (najpierw critical, potem nice-to-have).

Jeśli wszystko OK → email klientowi "Sign-off, gotowe do publikacji".
Jeśli problemy → mini-iteracja (zobacz Krok 7).

---

## Krok 7: Iteracje (każdy ticket od klienta)

Klient po jakimś czasie zgłasza:
- "Można zmienić kolor przycisku rezerwacji na ciemniejszy?"
- "Na mobile menu się rozjeżdża"
- "Dodaj informację o promocji zimowej"
- "Zmieniliśmy regulamin, prześlemy nową wersję"

Workflow per ticket (z [CLAUDE.md §9](../../CLAUDE.md#9-post-deploy-iterations-playbook)):

```
1. ACK (<30 min)
2. MCP live verify — reproduce problem
3. Diagnose — czy known w memory/feedback_*? Jeśli nie → zapisz feedback memory
4. Fix — minimal patch first
5. Live verify po fixie
6. Delivery — email klientowi z update + INSTRUKCJA dla wgrania
7. Sign-off — klient potwierdza, Ty closujesz ticket
```

Versioning: v1.0 (first delivery) → v1.1 (bugfix) → v1.2 (nowa feature) → v2.0 (major redesign).

---

## Wzorce na które uważać (read CLAUDE.md jeśli wątpliwość)

### Trigger phrases dla MCP NATYCHMIAST

User pisze: "sprawdz", "pokaż mi", "na pewno?", "weź zrób audyt", "dalej źle", "wciąż nie działa"

→ ZAWSZE MCP screenshot + computed style query zanim odpowiesz.

### Per-page-context CSS

Reguły specyficzne podstrony MUSZĄ mieć `body.page-X` prefix:
```css
body.page-index .hero { ... }   /* tylko home */
body.page-offer .booking-form { ... }   /* tylko /offer/N */
```

Globalne `.hero { ... }` bez `body.page-X` łamie inne podstrony.

### Minimal patch first

Damian preferuje 6-linii fix nad 50-linii refactor. NIE prezentuj 3 opcji A/B/C gdy klient zgłosił 1 problem. Zacznij od najmniejszej zmiany.

### Single-file CSS workflow

NIGDY nie rozdzielaj patches na `PATCH_X.css` + `ARKUSZ.css` osobno. Klient dostaje JEDEN plik (replace całość).

### Cross-file grep przy text changes

Zmieniasz tekst w body_top? `grep -rn "<tekst>"` w `clients/<nazwa>/DO_WKLEJENIA/` — sprawdź czy nie jest hardcoded w innych miejscach (CSS, JS, inne podstrony).

### NO emoji w client code (WAF block)

Plik wklejany w panel = zero emoji. WAF IdoBooking blokuje silent. Scan przed deliverem.

---

## Co Damian decyduje sam (Claude nie zadaje pytań)

- Wybór klienta do pracy
- Kiedy wysłać email z odpowiedzią
- Negocjacje cenowe / SLA
- Eskalacja do IdoSell support (jeśli problem po stronie panelu)
- Akceptacja sign-off (klient → Damian → Claude)

## Co Claude decyduje sam (Damian akceptuje post-fact)

- Wybór konkretnego variant per sekcja (z `recommended_variants` per vibe)
- Wybór wariantu palety (jeśli klient nie sprecyzował)
- Optymalizacje CSS (rename --xx- → --<prefix>-)
- Minify decisions
- Cross-language tłumaczenia (zachowuje POL jako autoritative, EN/DE = oznaczone <!-- TRANSLATE -->)

## Co Claude pyta Damiana (DO NOT proceed without answer)

- Pierwszy wybór vibe (jeśli klient nie sprecyzował)
- Logo clickable czy non-clickable (per per-client decision)
- Brand-neutral mode tak/nie (jeśli wykryje shared engine multi-property)
- Czy klient ma /offer/N (jeśli RECON nie potwierdzi)
- Czy chcesz mock content czy zostawić placeholder
- Czy chcesz dark mode toggle UI w nawigacji

---

## FAQ

### Klient w briefie nie wybrał vibe — co JARVIS zrobi?

Analizuje target + nazwę + lokalizację + tone of voice. Proponuje 2-3 vibes z [vibe-presets.json](../../library/templates/vibe-presets.json) z uzasadnieniem. Damian wybiera.

Przykład: "Apartament w zabytkowej kamienicy w Toruniu, target luxury 40+ pary, formalny tone" → JARVIS proponuje `luxury-heritage` + `heritage-warm` + `boutique-romantic`.

### Klient ma własne kolory brand — JARVIS użyje vibe palette czy jego?

Override: primary + secondary z briefa. Zachowane z presetu: cream, bg, text, shadows (zachowują design balance vibe).

### Klient ma własne fonty — czy JARVIS użyje?

Tak, override heading + body z briefa. Sprawdź czy Google Font istnieje (curl Google Fonts API).

### Wieloojęzyczność — kto tłumaczy?

JARVIS NIE tłumaczy. Pisze placeholder po POL ze znacznikiem `<!-- TRANSLATE EN -->`, `<!-- TRANSLATE DE -->`. Klient lub osobny proces tłumaczy. JARVIS wymienia placeholder na finalny tekst.

### Klient dodał nowy apartament — co JARVIS robi?

Featured offers reader (JS w KONIEC_BODY) automatycznie czyta wszystkie apartamenty oznaczone "Wyróżnione" w panelu. Klient zaznacza nowy apart → wyświetla się automatycznie. Bez code change.

Jeśli klient chce dodać nowy apart do menu lub dedykowaną podstronę — to wymaga update naszych body_top.

### Co jeśli panel IdoBooking się zaktualizuje i nasze CSS broke?

Trigger emergency w [CLAUDE.md §10](../../CLAUDE.md#10-emergency-debugging-trigger-driven). MCP navigate → diff DOM → update selectors → test → deploy. Plus zapisz `memory/feedback_idobooking_platform_update_<data>.md` dla future reference.

### Klient sam edytował CSS w panelu — co JARVIS zrobi?

`curl <domain>/custom.css` → diff z naszym source. Jeśli różnice = klient edytował. Diplomatically zapytaj klienta co zmienił. Jeśli accidentally → rewind do naszego ostatniego deliveru. Jeśli intencjonalnie → integrate jego zmiany do naszego source i regenerate dla future syncs.

---

## Update history

- v1.0 (2026-05-25) — first version, JARVIS Overhaul Plan Task 25

---

> Update tego dokumentu: edytuj inline + update memory `memory/workflow_new_client_kickoff.md`.
