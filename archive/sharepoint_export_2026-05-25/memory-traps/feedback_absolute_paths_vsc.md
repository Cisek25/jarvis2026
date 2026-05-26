---
name: Absolute paths in chat links (VSC opens worktree by default)
description: This user runs Claude Code from worktree dirs; relative links open old/wrong files in VSC. Always use absolute /Users/user/Desktop/jarvis/... paths in markdown links.
type: feedback
originSessionId: 787e71f9-d664-434d-ad57-37c9fa46bc2e
---
W projektach `/Users/user/Desktop/jarvis/` (i podobnych z 19+ git worktrees w `.claude/worktrees/`) zawsze pisz markdown linki z **absolutną ścieżką** `/Users/user/Desktop/jarvis/<path>`, nie ze ścieżką względną do cwd.

**Why:** Claude Code w tym projekcie startuje w `.claude/worktrees/<branch>/` (cwd). VSC po kliknięciu "Open in VSC" interpretuje link relatywnie do cwd → ląduje w worktree z **starym commit** (np. 138bee9 z 5/14). Mój edit idzie do głównego repo `/Users/user/Desktop/jarvis/clients/...`, więc user otwiera niewłaściwy (stary) plik. Reguła z system prompt mówi "use path relative to working directory" — w tym projekcie to NIE działa.

**How to apply:**
- Każdy markdown link w czacie: `[label](/Users/user/Desktop/jarvis/<path>)` lub `[label:LINE](/Users/user/Desktop/jarvis/<path>:LINE)`.
- Nigdy nie: `[label](clients/...)` ani `[label](../clients/...)`.
- Dotyczy też file:// linków: `[label](file:///Users/user/Desktop/jarvis/<path>)` jest OK, ale zwykły absolutny path też działa w VSC.
- Wpis w organizacji: 19+ worktreesy z `claude/<name>` branchami żyją w `.claude/worktrees/` — nie ufaj że są aktualne, edytuj zawsze w głównym repo.
