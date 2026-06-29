# JARVIS — Brief → Contract → Lint (enforcement design)

**Data:** 2026-06-29
**Problem:** Znane trapy (memory/, CLAUDE.md, deploy-cr) NIE są stosowane konsekwentnie. Te same błędy wracają (emoji, `[HARDCODED_*]`, prefiks `xx-`, brak `killHotspotDuplicates`, mobile-nav, Powered-by). Wiedza jest pasywna (proza), brak bramki wymuszającej.

## Diagnoza

Wiedza istnieje i jest dobra — brakuje **egzekucji**. Trapy żyją w markdown, który Claude *może* przeczytać, ale nic nie sprawia że *musi* je zastosować i zweryfikować przed wydaniem. `.claude/hooks/` nie istniało. `CLAUDE.md §4-6` jest „PARTIAL". Brief jest prozą — nic nie mapuje faktów klienta na konkretne trapy.

Kluczowa obserwacja: **prawie wszystkie nawracające błędy są statycznie wykrywalne** w plikach `clients/<klient>/DO_WKLEJENIA/`.

## Rozwiązanie — 3 artefakty + hook

```
clients/<klient>/brief.yaml   ── jedyny ręczny input (fakty, nie proza)
        │ node scripts/jarvis.js contract <klient>
clients/<klient>/BUILD_CONTRACT.md  ── auto: lista MUST-APPLY trapów + checklist
        │ (Claude buduje wg kontraktu)
clients/<klient>/DO_WKLEJENIA/*     ── pliki do panelu
        │ node scripts/jarvis.js lint <klient>     ← BRAMKA (exit≠0 = blokada)
        └ PostToolUse hook auto-odpala lint po zapisie do DO_WKLEJENIA/
```

## Komponenty

1. **`scripts/jarvis-rules.js`** — jedno źródło prawdy:
   - mini-parser YAML (bez zależności; podzbiór: skalary, inline+block listy, 1-poziom map)
   - `classifyFile(name)` → css | body_top | body_bottom | head | doc
   - `contractRules` — `when(brief)→traps[]` (fakt → trapy + linki feedback_*)
   - `lintRules` — uniwersalne BLOKERY + warunkowe signature-checks + WARN
2. **`scripts/jarvis.js`** — CLI: `contract`, `lint`, `lint-hook`.
3. **`templates/brief.template.yaml`** — schemat do wypełniania.
4. **Hook** w `.claude/settings.local.json` (PostToolUse Write|Edit) — auto-lint plików w `DO_WKLEJENIA/`.

## Reguły lintera

**BLOKERY uniwersalne (scope=panel):** B1 emoji · B2 placeholdery (`[HARDCODED_`,`{{`,`{prefix}`,`<NUMER>`) · B3 prefiks `xx-`/`--xx-` · B4 sekrety (AIza/sk_live/gh_/Bearer) · B5 body_bottom >62KB · B6 body_top: `<script>`/`<style>`/inline `style=…url(` · B7 polskie znaki w class/id.

**Warunkowe (signature required, gdy kontrakt mówi że dotyczy):**
- `hotspot` → `killHotspot` w body_bottom + `container-hotspot…display:none` w CSS
- `languages>1` → `hreflang` w HEAD

**WARN (raport, nie blokuje):** Powered-by (filter/opacity) brak · Ken-Burns `scale(1)` brak gdy default13 · hex lowercase · `#` zamiast `%23` w SVG data-URI · e-mail/telefon w JS (RODO).

Fuzzy rzeczy (price-chip layout, brand-neutral, section_sub fullbleed) → tylko w `BUILD_CONTRACT.md` checklist, NIE auto-block (unikamy fałszywych alarmów).

## Zasady

- Każdy bloker da się zdegradować do WARN flagą (`--warn-only` / per-reguła) — linter ma pomagać, nie irytować.
- `jarvis-rules.js` zasila ORAZ kontrakt (co budować) ORAZ linter (co sprawdzić) — spójność.
- Pliki klasyfikowane po wzorcu nazwy, nie dokładnej (nazwy niejednolite między klientami).
- Brief.yaml zastępuje `templates/BRIEF_NEW_CLIENT.md` jako maszynowy input; proza zostaje jako referencja treści.

## Weryfikacja

Dowód: `clients/cityofthekings/brief.yaml` (fakty z memory) → `contract` → `lint` na realnych plikach. Iteruj aż raport sensowny (zero fałszywych blokerów).
