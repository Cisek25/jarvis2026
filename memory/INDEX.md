# JARVIS Memory Index

## Per-klient pamięć
Każdy klient ma swój plik w `memory/clients_data/` z historią zmian, trapów, preferencjami.

## Instincts (wyuczone wzorce)
Automatycznie zbierane z sesji — `memory/instincts/` — wzorce, które się powtarzają.

## Lessons Learned
Błędy popełnione raz NIE powinny się powtórzyć — `memory/lessons/`.

---

## Pliki

| Plik | Opis |
|---|---|
| `clients/*.json` | Per-klient: kolory, fonty, trapy, historia zmian |
| `instincts/*.md` | Wyuczone wzorce: "zawsze sprawdź X przed Y" |
| `lessons/*.md` | Konkretne błędy + rozwiązania |
| `session-log.jsonl` | Log sesji (append-only) |

---

## Ostatnio dodane (2026-05-15, Fair Rentals sesja v1.32→v1.46)

### Nowe instincts
- **`instincts/020-blog-v4-systemic-news-scraper.md`** — Blog na IdoBooking: scraper systemowego `/news` (NIE custom HTML/manifest). Wzorzec źródłowy: Apartamenty Parkowe (client58154). Klient pisze w Panel→Wygląd→Aktualności, zero edycji kodu po dodaniu posta. Reusable template w `library/templates/blog/`.

### Nowe lessons
- **`lessons/015-same-specificity-css-rules-conflict.md`** — Stare reguły CSS o TEJ SAMEJ specificity konkurują z nowymi przez source order. USUWAJ stare reguły przed dodaniem nowych, nie polegaj tylko na `!important`. Live audit przez `document.styleSheets.cssRules` walk.
- **`lessons/016-idobooking-app-css-litepicker-center-trap.md`** — Systemowy app.css ma `.litepicker { left:50%; top:50%; transform: translate(-50%, -50%) }` które wymusza center pattern. Inline style JS Litepicker NIE wygrywa. Override przez własny modal pattern z `top: 20%` + `transform: translateX(-50%)` + max-width safety.
- **`lessons/017-idobooking-template-default13-button-patterns.md`** — Default13 ma min. 3 różne button patterny (sidebar `.accommodation-reservation`, cennik `.btn.btn-reverse`, search `.fr-cmd-bar__submit`). Sprawdzaj DOM przez chrome-devtools PRZED pisaniem CSS — 1 selector NIE wystarczy.

### Updated clients_data
- **`clients_data/fairrentals.json`** — version v1.28 → v1.46, +session_history_2026_05_15_v1_29_to_v1_46 (14 sesji w 1 dniu), +8 new traps learned, +6 new JS functions, +4 new CSS sections (§105-§108), +8 new deliverables
