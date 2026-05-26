# JARVIS — IdoBooking Toolkit

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-*`

## Czym jest to narzędzie?

JARVIS to zestaw 7 skille i 2 agentów dla **Claude Code**, które automatyzują pełny proces budowy strony klienta IdoSell/IdoBooking — od briefa do live deployment. Każdy etap (build, deploy, audit, debug) ma dedykowany skill który wywołuje się przez slash command w naturalnej rozmowie z Claude.

Cel: skrócić czas budowy strony klienta z **~40h** (najdłuższy projekt: Fair Rentals z 30+ release notes) do **11-15h** przy lepszej jakości (Lighthouse ≥85, WCAG 2.1 AA ≥95%) i mniej iteracji bugfix (1.5 vs 5 wersji per issue).

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-website-builder
```

Lub naturalnie:

```
Nowy klient IdoSell. Panel: https://client12345.idobooking.com/
Brief w załączniku: BRIEF_filled.pdf
```

Claude automatycznie aktywuje odpowiednie skille per faza projektu (RECON → CSS → HTML → JS → Deploy CR → SEO → A11y → E2E → Sign-off).

## Dostępne skille

| Skill | Slash | Trigger | Faza |
|-------|-------|---------|------|
| **Website Builder** | `/idosell-website-builder` | "nowy klient", brief od klienta | Build (Phase 0-6) |
| **Deploy Code Review** | `/idosell-deploy-cr` | "wklej w panel", przed deployem | Pre-deploy (MANDATORY) |
| **Bug Debug** | `/idosell-bug-debug` | Klient zgłasza issue | Maintenance |
| **SEO Audit** | `/idosell-seo-audit` | Po deploy, monthly | Post-deploy |
| **A11y Audit** | `/idosell-a11y-audit` | Sign-off, quartal | Sign-off |
| **E2E Test** | `/idosell-e2e-test` | Pre/post deploy regression | QA |
| **Memory Consolidate** | `/idosell-memory-consolidate` | Ostatni piątek miesiąca | Hygiene |

## Knowledge base

Skille korzystają z **udokumentowanej wiedzy z 11 ukończonych projektów**:

| Komponent | Liczba | Co zawiera |
|-----------|--------|------------|
| **System Traps** | 44 udokumentowanych | Pułapki IdoSell/IdoBooking (sanitizer, body_bottom limit, specificity wars, mobile traps) |
| **Per-trap notes** | 17 plików `feedback_*.md` | Symptom → Detection → Fix z konkretnym przykładem |
| **Architecture Patterns** | 4 pliki `pattern_*.md` | CSS/HTML/JS baseline, cross-project patterns |
| **Workflows** | 2 procedury | New client kickoff (6 faz) + generator |
| **Client profiles** | 9 aktywnych | Per-klient memory (kronika sesji, traps, status) — *prywatne* |

## Architektura

```
Claude Code
├── Skills (~/.claude/skills/)        # 7 idosell-*.md
├── Agents (~/.claude/agents/)        # 2 idosell-*.md
└── Memory (~/.claude/projects/jarvis/memory/)
    ├── feedback_*.md (17)            # System traps
    ├── pattern_*.md (5)              # Architecture
    ├── workflow_*.md (2)             # Procedures
    ├── client_*.md (9)               # Per-client (private)
    └── MEMORY.md                     # Master index
```

## Wymagania

- **Claude Code** — Anthropic dev environment (`https://docs.claude.com/claude-code`)
- **MCP Chrome DevTools** — server do pixel-perfect testów live
- **Python 3.9+** — do minify scripts
- Opcjonalnie: **Playwright MCP** (advanced E2E), **Firecrawl MCP** (web research)

## KPI per klient (target)

| Metryka | Cel | Achieved (przykład) |
|---------|-----|---------------------|
| Time to launch (PL only) | 11-15h | Fair Rentals: 40h → cel: 12h |
| Lighthouse Performance (mobile) | ≥85 | Zwykle 87-92 |
| Lighthouse SEO | 100 | 100 z Schema.org + meta |
| WCAG 2.1 AA compliance | ≥95% | Po audit 95-98% |
| CSS size | <400KB | Fair Rentals 410KB (refactor z 460KB) |
| body_bottom size | <60KB | 57KB (limit systemu: 62KB) |
| Bug fix iterations avg | <2 wersji | 1.5 (z bug-debug discipline) |

## Bezpieczeństwo / RODO

Paczka NIE zawiera danych klientów:
- Profile klientów (NIP, telefon, email, adresy) — prywatne
- Lista klientów IdoSell — prywatna
- Wypełnione briefy — prywatne

Tylko techniczna wiedza (skille, traps, patterns) — zgodnie z polityką IAI/RODO.

## Strony szczegółowe

Każdy skill ma własną stronę z opisem, parametrami, przykładami:

- [Skill - idosell-website-builder](01-Skill-website-builder.md) — Master pipeline
- [Skill - idosell-deploy-cr](02-Skill-deploy-cr.md) — Pre-deploy review
- [Skill - idosell-bug-debug](03-Skill-bug-debug.md) — Systematic debug
- [Skill - idosell-seo-audit](04-Skill-seo-audit.md) — Lighthouse
- [Skill - idosell-a11y-audit](05-Skill-a11y-audit.md) — WCAG audit
- [Skill - idosell-e2e-test](06-Skill-e2e-test.md) — Critical flows
- [Skill - idosell-memory-consolidate](07-Skill-memory-consolidate.md) — Knowledge hygiene
- [Trap Library — 44 udokumentowanych pułapek IdoSell](08-Trap-Library.md)

## Status

**Wersja**: 1.0
**Wydana**: 20.05.2026
**Status**: Production-ready (sprawdzone na 11 projektach klientów)
**Kontakt**: damian.cisowski@iaisa.com
