# Lesson — Markdown links w odpowiedzi resolve'ują się względem worktree CWD, nie głównego repo

**Data**: 2026-05-14
**Klient**: Piekary 1-3 (sesja flatten DO_WKLEJENIA + galeria + map)
**Severity**: MEDIUM — frustrujący user, błędne dialogi "Ścieżka nie istnieje"

## Co się stało

User: *"podmień zdjęcia w galerii"*

1. Claude pracował w worktree `/Users/user/Desktop/jarvis/.claude/worktrees/thirsty-austin-f72ef9/`.
2. Po analizie zauważył że MAIN repo (`/Users/user/Desktop/jarvis/clients/piekary13/`) ma świeższe pliki (z APARTAMENTY_PL, audytami, etc.) — worktree miał stary commit `138bee9`.
3. Claude **edytował pliki w MAIN repo** (poza worktree) — `Read`/`Write` z absolutnymi ścieżkami do `/Users/user/Desktop/jarvis/clients/piekary13/...`.
4. W podsumowaniu Claude użył markdown links z **relatywnymi ścieżkami**:
   ```markdown
   [GALERIA_PL__body_top.html](clients/piekary13/DO_WKLEJENIA/GALERIA_PL__body_top.html)
   ```
5. User kliknął link → UI resolve'ował relatywną ścieżkę względem **CWD worktree** Claude'a:
   ```
   /Users/user/Desktop/jarvis/.claude/worktrees/thirsty-austin-f72ef9/clients/piekary13/DO_WKLEJENIA/GALERIA_PL__body_top.html
   ```
6. **Ta ścieżka nie istnieje** — w worktree DO_WKLEJENIA miało tylko 5 starych plików bez GALERIA.
7. User dostał dialog "Ścieżka nie istnieje na tym komputerze" → **stracił zaufanie do moich linków**.

## Root cause

Worktree pattern: Claude Code uruchomiony w `.claude/worktrees/{name}/` ma CWD ustawione na worktree. Wszystkie tool wywołania (`Read`, `Write`, `Edit`) z relatywnymi ścieżkami resolve'ują się względem tego CWD.

Markdown linki w odpowiedzi tekstowej Claude'a też są renderowane przez UI z resolve'em względem **CWD Claude'a**, czyli worktree. Nawet jeśli edytowane pliki są w MAIN repo, link `[name](clients/...)` wskazuje na worktree path.

System prompt zawiera instrukcję:
> When referencing files in your responses, format them as markdown links so the user can click to open them. Use the path relative to the working directory as the href.

To działa POPRAWNIE gdy pracujesz w obrębie worktree. **Łamie się** gdy crossujesz worktree boundary (edytujesz pliki w MAIN repo z poziomu worktree).

## Reguła

**Gdy edytujesz pliki POZA bieżącym worktree** (np. w `/Users/user/Desktop/jarvis/clients/...` z worktree CWD), w markdown linkach **używaj ścieżek absolutnych**, nie relatywnych:

```markdown
❌ [GALERIA_PL.html](clients/piekary13/GALERIA_PL.html)
   → UI resolve: {worktree}/clients/piekary13/GALERIA_PL.html → nie istnieje

✅ [GALERIA_PL.html](/Users/user/Desktop/jarvis/clients/piekary13/GALERIA_PL.html)
   → UI resolve: ścieżka absolutna → otwiera plik z MAIN repo

✅ Alternatywa — gdy nie chcesz klikania, użyj plain text bez markdown link:
   ```
   /Users/user/Desktop/jarvis/clients/piekary13/GALERIA_PL.html
   ```
```

## Workflow detekcji

Na początku sesji sprawdź czy worktree CWD ≠ ścieżki edytowanych plików:

```bash
pwd                              # CWD Claude'a (zwykle worktree)
git rev-parse --show-toplevel    # root REPO worktree'a
# jeśli edytujesz files z innej ścieżki absolutnej → użyj absolute paths w markdown
```

Albo prościej: **jeśli edytujesz plik w `/Users/user/Desktop/jarvis/clients/...` (NIE w `/.../worktrees/.../clients/...`), zawsze używaj absolute paths w odpowiedzi**.

## Drugi błąd w tej samej sesji

Ten sam dzień, ten sam plik — user obejrzał wcześniejszą odpowiedź gdzie pisałem o `DO_WKLEJENIA/`, ale później na prośbę usera spłaszczyłem folder (DO_WKLEJENIA usunięty, pliki w `piekary13/`). User wracając do starej odpowiedzi w czacie kliknął link z `DO_WKLEJENIA/` — folder już nie istniał.

**Wniosek dodatkowy**: po większej reorganizacji struktury folderów (rename, flatten, move) — **napisz explicite w odpowiedzi że poprzednie ścieżki są nieaktualne**. Nie zakładaj że user pamięta chronologię zmian.

## Files referencyjne

- `lessons/worktree-vs-main-repo-stale-paste.md` — pokrewny problem (user wkleja stary plik bo edit w worktree)
- System prompt: instrukcja "format files as markdown links" + "path relative to working directory"

## Prevention checklist

Przed wysłaniem odpowiedzi z markdown links sprawdź:
- [ ] Czy pracuję w worktree? (`pwd` zawiera `.claude/worktrees/`)
- [ ] Czy edytowane pliki są w worktree (`{worktree}/...`) czy w main repo (`/Users/user/Desktop/jarvis/clients/...`)?
- [ ] Jeśli pliki w main repo → w odpowiedzi użyj **absolute paths** w markdown linkach
- [ ] Po reorganizacji folderów (rename/flatten/move) → wspomnij w odpowiedzi że stare ścieżki są nieaktualne
