# JARVIS Toolkit — Instalacja

Krok-po-kroku jak zainstalować w Claude Code (lub Claude Agent SDK).

**Wymagania**:
- Claude Code zainstalowany (`https://docs.claude.com/claude-code`)
- macOS, Linux lub WSL2 (Windows)
- Terminal access

---

## 1. Skopiuj skille do `~/.claude/skills/`

```bash
# Z folderu rozpakowanego ZIP:
cp skills/*.md ~/.claude/skills/

# Weryfikacja
ls ~/.claude/skills/idosell-*.md
# Powinno pokazać 7 plików
```

**Lokalizacja**: `~/.claude/skills/` (user-level, dostępne globalnie)

## 2. Skopiuj agents do `~/.claude/agents/`

```bash
cp agents/*.md ~/.claude/agents/

ls ~/.claude/agents/idosell-*.md
# Powinno pokazać 2 pliki:
# - idosell-project-manager.md
# - idosell-webdev.md
```

## 3. Stwórz memory folder

```bash
mkdir -p ~/.claude/projects/-Users-user-Desktop-jarvis/memory/

# Skopiuj patterns + workflows + reference + memory-traps
cp memory-traps/*.md ~/.claude/projects/-Users-user-Desktop-jarvis/memory/
cp patterns/*.md ~/.claude/projects/-Users-user-Desktop-jarvis/memory/
cp workflows/*.md ~/.claude/projects/-Users-user-Desktop-jarvis/memory/
cp reference/*.md ~/.claude/projects/-Users-user-Desktop-jarvis/memory/
```

**UWAGA**: Path zawiera `-Users-user-Desktop-jarvis` — to konwencja Claude Code (encoded project path). Jeśli Twój username NIE jest `user`, dostosuj:
```bash
# Sprawdź swój username
echo $USER

# Adjust path
mkdir -p ~/.claude/projects/-Users-<TWOJ_USERNAME>-Desktop-jarvis/memory/
```

## 4. Stwórz initial MEMORY.md (index)

```bash
cat > ~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md << 'EOF'
# JARVIS Memory Index

Last update: <data instalacji>

## 🪤 System Traps (apply ALL to every new client)
$(ls ~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_*.md | xargs -I {} basename {})

## 🧩 Patterns
- pattern_baseline_v2.md — "Jak budujemy strony 2026-05"
- pattern_idosell_websites.md — Master rules (52KB, 44 traps)
- pattern_idobooking_overview.md
- pattern_cross_project.md

## 🛠️ Workflows
- workflow_new_client_kickoff.md — 6-phase procedure
- workflow_idosell_generator.md

## 📚 Reference
- reference_idobooking_seo_audit.md

## 👥 Active Clients
(dodaj tu po pierwszym kliencie — pattern client_<name>.md)

## 🚀 JARVIS Skills (zainstalowane w ~/.claude/skills/)
- idosell-website-builder, idosell-deploy-cr, idosell-bug-debug
- idosell-seo-audit, idosell-a11y-audit, idosell-e2e-test
- idosell-memory-consolidate
EOF
```

## 5. Stwórz folder dla projektów klientów

```bash
mkdir -p ~/Desktop/jarvis/clients/
mkdir -p ~/Desktop/jarvis/templates/

# Skopiuj templates
cp templates/* ~/Desktop/jarvis/templates/

ls ~/Desktop/jarvis/templates/
# Powinno pokazać: BRIEF_KLIENTA.docx, FAQ_WSPOLPRACA.docx + PDF wersje
```

## 6. Configure Claude Code permissions

W `~/.claude/settings.json` (lub `~/.claude/settings.local.json`) dodaj:

```json
{
  "permissions": {
    "allow": [
      "Bash(grep:*)",
      "Bash(find:*)",
      "Bash(curl:*)",
      "Bash(python3:*)",
      "Bash(wc:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Read(/Users/<TWOJ>/Desktop/jarvis/**)",
      "Read(/Users/<TWOJ>/.claude/skills/**)",
      "Read(/Users/<TWOJ>/.claude/agents/**)",
      "Read(/Users/<TWOJ>/.claude/projects/**)",
      "Edit(/Users/<TWOJ>/Desktop/jarvis/**)",
      "Write(/Users/<TWOJ>/Desktop/jarvis/**)"
    ]
  }
}
```

## 7. Test instalacji

W Claude Code (nowa sesja) napisz:
```
Pokaż mi listę dostępnych skille zaczynających się od "idosell-"
```

Claude powinien znaleźć 7 skilli. Plus:
```
Pokaż memory feedback files
```

Powinien zobaczyć 17 `feedback_*.md`.

## 8. Pierwszy klient — start

```bash
# Folder dla klienta
mkdir -p ~/Desktop/jarvis/clients/<nowa-nazwa>/{DO_WKLEJENIA,_source,docs,tests}
cd ~/Desktop/jarvis/clients/<nowa-nazwa>/

# Wyślij BRIEF_KLIENTA.docx + FAQ_WSPOLPRACA.docx klientowi
# Czekaj na wypełniony brief
```

W Claude Code:
```
Nowy klient IdoSell. Panel: https://clientXXXXX.idobooking.com/
Brief w załączniku: <BRIEF_filled.pdf>

Trigger idosell-website-builder Phase 0 RECON.
```

Skill automatycznie:
1. Czyta MEMORY.md
2. Czyta pattern_baseline_v2.md i pattern_idosell_websites.md
3. Aplikuje 44 system traps z memory-traps/
4. Buduje strone

## 9. Workflow per faza

| Faza | Skill | Trigger |
|------|-------|---------|
| Brief intake | (manual) | Wyślij `BRIEF_KLIENTA.docx` |
| RECON | `idosell-website-builder` | "nowy klient" |
| Build | `idosell-website-builder` | continue |
| Pre-deploy | `idosell-deploy-cr` | "wklej w panel" |
| Deploy | (user manual) | Wklej w panel IdoSell |
| Post-deploy | `idosell-seo-audit` | po deploy |
| Test | `idosell-e2e-test` | regression check |
| Sign-off | `idosell-a11y-audit` | przed sign-off |
| Bug | `idosell-bug-debug` | klient zgłasza |
| Monthly | `idosell-memory-consolidate` | ostatni piątek miesiąca |

## 10. Troubleshooting

**Problem**: Claude Code nie widzi skilli
```bash
# Sprawdź czy w odpowiednim folderze
ls ~/.claude/skills/

# Restart Claude Code
# Skille są ładowane przy starcie sesji
```

**Problem**: Agent nie znajduje memory files
```bash
# Sprawdź path w agencie
grep "memory/" ~/.claude/agents/idosell-webdev.md

# Adjust username jeśli inny niż 'user'
sed -i.bak 's|/-Users-user-|/-Users-<TWOJ>-|g' ~/.claude/agents/idosell-*.md
```

**Problem**: Sandbox blokuje operacje w `~/.claude/projects/`
- Niektóre operacje (mkdir, cp, rm) blokowane przez Claude Code sandbox
- Workaround: Read + Write tool zamiast bash mv/cp
- Edit tool dla in-place modifications

## 11. Aktualizacje

Jak otrzymasz nową wersję JARVIS toolkit:
```bash
# Backup current
mv ~/.claude/skills/idosell-*.md ~/.claude/skills/idosell-backup-$(date +%Y%m%d)/

# Install new
cp skills/*.md ~/.claude/skills/
```

Memory traps i patterns mogą być aktualizowane bez backupu — są addytywne.

## 12. Wsparcie

**Kontakt**: Damian Cisowski — damian.cisowski@iaisa.com
**Zespół**: IdoBooking (IAI S.A.)
**Repo wewnętrzne**: (gdy będzie utworzone)

## 13. Co dalej

Po instalacji:
1. Przeczytaj `patterns/pattern_baseline_v2.md` (overview stack)
2. Przejrzyj `workflows/workflow_new_client_kickoff.md` (6-fazowy proces)
3. Otwórz `skills/idosell-website-builder.md` (master workflow)
4. Zaczynaj pierwszego klienta — skille auto-trigguer się gdy je wywołasz w prompt

---

**Powodzenia!** 🚀

Pełna dokumentacja per skill w plikach `.md` w folderze `skills/`.
