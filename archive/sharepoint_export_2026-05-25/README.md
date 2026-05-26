# JARVIS — IdoBooking Website Builder Toolkit

**Autor**: Damian Cisowski (damian.cisowski@iaisa.com)
**Zespół**: IdoBooking (IAI S.A.)
**Wersja**: 1.0 (2026-05-20)
**Status**: Production-ready, sprawdzone na 11 projektach klientów

---

## 🎯 Co to jest

Zestaw narzędzi dla Claude Code (LLM-based dev environment) automatyzujący proces budowy stron klientów IdoSell/IdoBooking. Zawiera:

- **7 skille** (Claude Code skills) — pełen pipeline od briefa do live
- **2 agenty** — autonomiczne builder + project manager
- **17 system traps** — udokumentowane pułapki systemu IdoSell/IdoBooking
- **5 patterns** — wzorce architektoniczne CSS/HTML/JS
- **2 workflows** — proceduralne checklisty
- **2 templates** — formularz Brief + FAQ współpracy dla klientów

**Cel**: redukcja czasu budowy strony klienta z **40-50h** (Fair Rentals — 30+ release notes) do **11-15h** dla PL only, z lepszą jakością i mniej iteracjami bugów.

## 📦 Co jest w paczce

```
JARVIS-IdoBooking-Toolkit/
├── README.md                       # ten plik
├── INSTALL.md                      # instalacja krok-po-kroku
│
├── skills/                         # 7 Claude Code skills
│   ├── idosell-website-builder.md  # Master pipeline Phase 0-6
│   ├── idosell-deploy-cr.md        # Pre-deploy code review (5 blockers)
│   ├── idosell-bug-debug.md        # Systematic debug per issue
│   ├── idosell-seo-audit.md        # Lighthouse + trend tracking
│   ├── idosell-a11y-audit.md       # WCAG 2.1 AA 4-layer audit
│   ├── idosell-e2e-test.md         # Critical flows regression
│   └── idosell-memory-consolidate.md # Monthly knowledge hygiene
│
├── agents/                         # 2 custom Claude Code agents
│   ├── idosell-project-manager.md  # Session lifecycle, briefing
│   └── idosell-webdev.md           # Autonomous builder
│
├── memory-traps/                   # 17 system traps + 1 reference
│   ├── feedback_idobooking_*.md    # Per-trap documentation
│   └── ...
│
├── patterns/                       # 5 system patterns
│   ├── pattern_baseline_v2.md      # "Jak budujemy strony 2026-05"
│   ├── pattern_idosell_websites.md # Master rules (52KB, 44 traps)
│   ├── pattern_idobooking_overview.md
│   ├── pattern_cross_project.md
│   └── workflow_idosell_generator.md
│
├── workflows/
│   └── workflow_new_client_kickoff.md  # 6-phase procedural template
│
├── reference/
│   └── reference_idobooking_seo_audit.md
│
└── templates/                      # Templates dla klientów
    ├── BRIEF_KLIENTA.docx          # Formularz brief (PL)
    ├── BRIEF_KLIENTA.pdf
    ├── FAQ_WSPOLPRACA.docx         # Zasady współpracy (60-dni gwarancja, SLA)
    └── FAQ_WSPOLPRACA.pdf
```

## 🚀 Skille — co robią

### 1. `idosell-website-builder`
**Trigger**: nowy klient od briefa, panel URL
**Workflow**: Phase 0-6 (RECON → CSS → HTML → JS → QA → Delivery → EN/DE)
**Output**: kompletna paczka `DO_WKLEJENIA/` dla klienta

### 2. `idosell-deploy-cr` (MANDATORY)
**Trigger**: przed każdym wkleiem do panelu IdoSell
**Sprawdza**:
- 🔴 Secret scan (Google Maps API key, gh_*, sk_live, Bearer tokens)
- 🔴 body_bottom ≤62KB (panel silent truncate)
- 🔴 body_top: brak `<script>`, inline `style=""`, emoji
- 🔴 Powered by IdoBooking widoczne (wymóg licencyjny)
- 🟡 CSS ≤450KB (admin OOM at 500KB)
- 🟡 Mobile viewport tested

### 3. `idosell-bug-debug`
**Trigger**: klient zgłasza issue
**Workflow**: 10-step systematic debug + memory cross-ref
**Cel**: skrócić v1.58→v1.62 sagi do 1.5 wersji per fix

### 4. `idosell-seo-audit`
**Trigger**: po deploy, monthly health check
**Output**: Lighthouse scores (Perf, SEO, A11y, BP) per page per viewport + trend tracking

### 5. `idosell-a11y-audit`
**Trigger**: sign-off nowego klienta, quartal
**Standard**: WCAG 2.1 AA (zgodność z ustawą o dostępności cyfrowej PL)
**4 layers**: automated (Lighthouse) + manual keyboard + contrast + touch targets

### 6. `idosell-e2e-test`
**Trigger**: pre/post deploy regression check
**Flows**: 8 critical per typu klienta (homepage → search → results → detail → booking)

### 7. `idosell-memory-consolidate`
**Trigger**: monthly hygiene
**Workflow**: merge duplikaty feedback files, archive stale notes, update index

## 🧠 Knowledge base — 17 system traps

Udokumentowane pułapki IdoSell/IdoBooking z 11 projektów:

| # | Trap | Plik |
|---|------|------|
| 32 | body_top inline `style=""` wycinany przez sanitizer | feedback_idobooking_body_top_inline_style_stripped.md |
| 33 | body_bottom 62KB silent truncate | feedback_idobooking_body_bottom_size_limit.md |
| 34 | Powered by IdoBooking — wymóg licencyjny | feedback_powered_by_idobooking_visible.md |
| 35 | `position: absolute + top: 50%` zjeżdża gdy parent rośnie | feedback_idobooking_specificity_war.md |
| 36 | iPhone Safari `<select>` pusty z appearance:none | (w pattern_idosell_websites.md) |
| 37 | Grid `repeat(7, 1fr)` overflow | (w pattern_idosell_websites.md) |
| 38 | System widget weekday cells `width: var(...)` | (w pattern_idosell_websites.md) |
| 39 | CSS ≤450KB (admin OOM) | (w pattern_idosell_websites.md) |
| 40 | Google Maps embed bez `key=AIza...` | (w pattern_idosell_websites.md) |
| - | Map widget location ID mismatch | feedback_idobooking_map_location_mismatch.md |
| - | Litepicker --static centering | feedback_idobooking_litepicker_static_centering.md |
| - | Mobile widget w #navbar (display:none) | feedback_idobooking_mobile_widget_in_navbar.md |
| - | Mobile hero search-first order | feedback_idobooking_mobile_search_first.md |
| - | No emoji w client code (WAF) | feedback_no_emoji_client_code.md |
| - | Preserve client CSS block (§FR-CLIENT) | feedback_preserve_client_css_block.md |
| - | Element invisible debug checklist | feedback_element_invisible_debug_checklist.md |
| - | Iterative debugging discipline | feedback_iterative_debugging_discipline.md |
| - | Orphan CSS rules audit | feedback_orphan_css_rules_audit.md |
| - | Responsive JS handler viewport guard | feedback_responsive_handler_viewport_guard.md |
| - | System button text i18n | feedback_system_button_text_i18n.md |

Pełna lista 44 trapów w `patterns/pattern_idosell_websites.md`.

## 📊 KPI per nowy klient (target)

| Metryka | Target | Achieved (przykład Fair Rentals) |
|---------|--------|----------------------------------|
| Time to launch (PL only) | 11-15h | ~40h (przed JARVIS) → 12h target |
| Lighthouse Performance (mobile) | ≥85 | varies |
| Lighthouse SEO | 100 | 100 (z Schema.org + meta) |
| WCAG 2.1 AA compliance | ≥95% | 92% → 98% (po audit) |
| CSS size | <400KB | 410KB (po refactor) |
| body_bottom size | <60KB | 57KB |
| Bug fix iterations avg | <2 wersji | 5 (przed) → 1.5 (z bug-debug skill) |

## 🎯 Use cases

### Use case 1: Nowy klient zgłasza chęć budowy strony
1. Wyślij klientowi `templates/BRIEF_KLIENTA.docx` + `FAQ_WSPOLPRACA.docx`
2. Otrzymaj wypełniony brief
3. W Claude Code: trigger `idosell-website-builder` (Phase 0 RECON)
4. Reference: `workflows/workflow_new_client_kickoff.md` (step-by-step 6 faz)

### Use case 2: Klient zgłasza bug po deploy
1. Triggeruj `idosell-bug-debug` skill
2. Skill systematically: czyta zgłoszenie → cross-ref `memory-traps/` → MCP chrome-devtools live reprodukcja → root cause → fix → verify
3. Update `client_<name>.md` profile + create `BUG_<date>.md`

### Use case 3: Pre-deploy code review (MANDATORY)
1. Każdy wklej do panelu — wywołaj `idosell-deploy-cr`
2. 5 BLOCKERS + 4 WARNINGS — jeśli FAIL, NIE deploy
3. Auto-check: secrets, sanitizer traps, size limits, Powered by visibility

### Use case 4: Sign-off klienta (audit)
1. `idosell-seo-audit` → Lighthouse scores
2. `idosell-a11y-audit` → WCAG 2.1 AA compliance %
3. `idosell-e2e-test` → 8 critical flows PASS
4. Daj klientowi twarde liczby (90/100 SEO score, 95% WCAG)

## 🔐 Bezpieczeństwo / RODO

**Co JEST w paczce**:
- Skille i agents (kod tooling, brak PII)
- System traps (techniczne lessons, brak PII)
- Patterns (architecture rules, brak PII)
- Templates (puste formularze do wypełnienia)

**Co NIE JEST w paczce** (zostaje prywatnie u developera):
- ❌ `client_*.md` (profile klientów z NIP, telefonem, emailem, adresem)
- ❌ `pattern_idosell_clients_db.md` (lista wszystkich klientów IdoSell)
- ❌ Wypełnione brief klientów
- ❌ Audit reports per klient (zawierają dane)

**Reasoning**: zgodność z RODO/GDPR. Dane klientów (NIP, kontakt, adresy) traktowane jako poufne (vide IAI organization rules).

## 🛠️ Wymagania

- **Claude Code** (lub Claude Agent SDK) — `https://docs.claude.com/claude-code`
- **MCP Chrome DevTools** — `https://github.com/modelcontextprotocol/servers/tree/main/src/chrome-devtools`
- (Opcjonalnie) **Playwright MCP** dla advanced E2E
- **Python 3.9+** — do minify scripts
- **Git** — version control plików klienta

## 📚 Dokumentacja

- `INSTALL.md` — instalacja krok-po-kroku (gdzie wkleić pliki, jak skonfigurować)
- Każdy skill `.md` ma sekcję "Trigger" + "Workflow" + "Output"
- `patterns/pattern_baseline_v2.md` — kompletny stack techniczny
- `patterns/pattern_idosell_websites.md` — 44 system traps z fixami

## 📞 Kontakt

**Damian Cisowski**
Email: damian.cisowski@iaisa.com
Zespół: IdoBooking (IAI S.A.)

Pytania, bugfixy, feature requests — kontakt mailowy.

## 📄 Licencja

Wewnętrzne narzędzia IAI S.A. — do użytku zespołowego.
Nie dystrybuować poza organizację bez zgody.

---

**Ostatnia aktualizacja**: 2026-05-20
**Następna planowana aktualizacja**: po każdym nowym kliencie (dodawanie nowych trapów do memory-traps/)
