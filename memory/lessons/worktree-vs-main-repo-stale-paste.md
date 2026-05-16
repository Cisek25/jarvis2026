# Lesson — Worktree vs main repo: user wkleja stary plik bo edyty trafiły do worktree

**Data**: 2026-05-06
**Klient**: SORS (sesja Lokalizacja v3)
**Severity**: HIGH — frustrujący user, marnuje czas (2 rundy "nadal nie działa")

## Co się stało

User: *"Edytuj podstronę lokalizacji — dodaj zdjęcia w sekcjach"*

1. Edytowałem 4 pliki: `clients/SORS/DO_WKLEJENIA/05_LOKALIZACJA/lokalizacja_*.html` —
   podmieniłem SVG placeholdery na `<img>` z URL-ami galerii.
2. Powiedziałem userowi: *"gotowe, wklej body_top do panelu"*.
3. User wkleił, ale na live nadal były piktogramy + dodatkowe zdjęcia na dole.
4. Pomyślałem że WAF wyciął coś, że trzeba dodać `<style>` itd. — **2 rundy iteracji w złą stronę**.
5. Dopiero gdy zfetchowałem raw HTML live page, zauważyłem że stare SVG paths są tam dosłownie.
6. Zacząłem grzebać i odkryłem — user pasted ze ścieżki `/Users/user/Desktop/jarvis/clients/SORS/...`,
   a moje edyty były w `/Users/user/Desktop/jarvis/.claude/worktrees/priceless-jackson-c3fc4a/clients/SORS/...`.
7. **Główny folder miał stare pliki z dnia 13 kwietnia. Worktree miał świeże edyty.**

## Root cause

Claude Code w tej sesji uruchomił się w **git worktree** (branch `claude/priceless-jackson-c3fc4a`).
Wszystkie operacje `Read`/`Edit`/`Write` Claude'a działały na ścieżkach worktree.
User natomiast operuje w głównym repo (`/Users/user/Desktop/jarvis/`) — bo tam ma otwarty edytor,
tam wskazuje ścieżki, tam fizycznie kopiuje treść do panelu IdoBooking.

Worktree i main repo to **dwa osobne checkoutu tego samego repo** — pliki mają być zsynchronizowane
przez merge/rebase, ale dopóki branch nie jest zmergowany, są to dwie różne kopie plików na dysku.

## Fix (było potrzebne)

```bash
# Pod koniec edycji — sync z worktree do main repo:
cp /Users/user/Desktop/jarvis/.claude/worktrees/priceless-jackson-c3fc4a/clients/SORS/DO_WKLEJENIA/05_LOKALIZACJA/lokalizacja_*.html \
   /Users/user/Desktop/jarvis/clients/SORS/DO_WKLEJENIA/05_LOKALIZACJA/
```

Po tym user wkleja ze swojej standardowej ścieżki i widzi aktualne pliki.

## Prevention — co zrobić następnym razem

### 1. Na początku sesji — sprawdź czy jesteś w worktree

```bash
git rev-parse --show-toplevel    # ścieżka do bieżącego worktree
git worktree list                 # wszystkie worktreey w repo
```

Jeśli ścieżka zawiera `.claude/worktrees/...` → **jesteś w worktree, nie w main repo**.

W tej sytuacji każdy `Edit`/`Write` należy **zsynchronizować** do main repo zanim user zacznie używać pliku.

### 2. Przed claim "gotowe — wklej do panelu"

Zawsze policz:
```bash
diff -q /Users/user/Desktop/jarvis/clients/SORS/DO_WKLEJENIA/05_LOKALIZACJA/lokalizacja_PL.html \
        /Users/user/Desktop/jarvis/.claude/worktrees/priceless-jackson-c3fc4a/clients/SORS/DO_WKLEJENIA/05_LOKALIZACJA/lokalizacja_PL.html
```

Jeśli pliki różne — `cp` z worktree do main repo PRZED powiedzeniem "gotowe".

### 3. Zawsze podawaj user PEŁNĄ ścieżkę pliku

Nie tylko `lokalizacja_PL.html` ale `/Users/user/Desktop/jarvis/clients/SORS/DO_WKLEJENIA/05_LOKALIZACJA/lokalizacja_PL.html`. Wtedy user (i przyszły Claude) widzi czy ścieżka jest worktree czy main.

### 4. Gdy user mówi "nie działa" — fetch raw HTML PIERWSZY KROK

Zanim doczepisz się do WAF, cache, browser, **zfetchuj live page i porównaj zawartość z plikiem na dysku**:

```js
fetch('/txt/204/Lokalizacja').then(r=>r.text()).then(html => {
  console.log('SVG count:', (html.match(/<svg/g)||[]).length);
  console.log('IMG to /4/0/:', (html.match(/\/4\/0\/\d+\.webp/g)||[]).length);
  console.log('Has hide style:', /\.gallery-lightbox\s*\{[^}]*display\s*:\s*none/.test(html));
});
```

Porównaj te liczby z plikiem `clients/.../lokalizacja_PL.html`. Jeśli **plik na dysku** ma 0 SVG, ale **live HTML** ma 4 SVG — user wkleił **inną wersję pliku** (najpewniej stałą sprzed edycji, np. z main repo gdy edyty są w worktree).

## Anty-pattern (czego unikać)

❌ Zakładać że "skoro edytowałem plik, user wkleja świeżą wersję"
❌ Przy "nie działa" od razu iść w stronę WAF/cache/specificity bez fetchu raw HTML
❌ Podawać user nazwy plików bez pełnej ścieżki — niemożliwe wtedy by zweryfikować czy worktree vs main

## Tag

`worktree`, `git`, `file-sync`, `paste-divergence`, `idobooking`
