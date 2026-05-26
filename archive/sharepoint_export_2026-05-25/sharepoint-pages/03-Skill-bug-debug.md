# Skill - idosell-bug-debug

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-bug-debug`

## Czym jest to narzędzie?

Systematic debugging dla zgłoszeń klienta IdoSell/IdoBooking. Łączy `superpowers:systematic-debugging` + `engineering:debug` z JARVIS-specific memory (18+ udokumentowanych pułapek) aby pominąć 5-iteracji sagi i trafić w root cause od razu.

Skill **wymusza dyscyplinę**: zanim Claude napisze pierwszy Edit, musi przeprowadzić diagnozę przez 8 kroków, postawić 3-5 hipotez i potwierdzić root cause przez MCP chrome-devtools.

## Dlaczego to istnieje (lesson learned)

**Fair Rentals v1.58 → v1.62 saga**: 5 wersji żeby naprawić bug "po menu close flagi znikają na mobile":

| Wersja | Diagnoza | Fix | Skutek |
|--------|----------|-----|--------|
| v1.58 | wrap.visibility = hidden | `wrap.visibility = visible !important` | Bug wrócił |
| v1.59 | Cache po stronie usera | Cache-bust query | Bug wrócił |
| v1.60 | aria-expanded źle ustawione | aria-only detection | Bug wrócił |
| v1.61 | Trzeba multi-signal | MutationObserver + periodic check + 5-layer defense | Bug WCIĄŻ wrócił |
| v1.62 | **Root cause**: orphan outside-click handler ustawiał `#language_menu.display = none` | viewport guard `if (window.innerWidth <= 991) return` | FIX |

4 wersje stracone na **wrong element** (wrap.visibility) zamiast root cause (dziecko #language_menu).

**Lesson**: Jeśli bug WRACA po fixie — diagnoza była **WRONG**, nie insufficient. NIE eskaluj defensywności. RE-INVESTIGATE od zera.

**Cel**: 1.5 wersji per fix (vs średnia 3.4 z FairRentals v1.49→v1.69 = 21 wersji na 6 issues).

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-bug-debug
```

Lub naturalnie — wklej zgłoszenie klienta:

```
Klient pisze: "Na iPhone po kliknięciu MENU flagi przy języku znikają.
Trzeba odświeżyć stronę żeby wróciły."
```

Skill aktywuje się gdy widzi: zgłoszenie błędu, screenshot, PDF z uwagi.

## 10-step mandatory workflow

### Step 1: PROHIBIT ad-hoc fixing
**STOP** — nie pisz Edit'ów. Zaczynamy od diagnozy.

### Step 2: Read client report słowo po słowie
- Co dokładnie user napisał?
- UA, viewport, urządzenie?
- Screenshot — co konkretnie vs co powinno być?
- Powtórz: "Widzę: X. Spodziewam się: Y. Reprodukcja: Z."

### Step 3: Load JARVIS memory
```bash
cat ~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md
```
Czy w 18+ feedback files jest ten pattern?

### Step 4: Live reprodukcja via MCP chrome-devtools

```
1. mcp__chrome-devtools__new_page (klient URL)
2. mcp__chrome-devtools__emulate (mobile/desktop wg user)
3. mcp__chrome-devtools__navigate_page (reload + ignoreCache=true)
4. mcp__chrome-devtools__evaluate_script (zmierz stan bugu)
5. mcp__chrome-devtools__take_screenshot (potwierdź visual)
```

Pixel-perfect measurement: top/bottom/left/right + width/height + computed styles.

### Step 5: Hypothesis chain (3-5 hipotez PRZED fix)

```
H1: Sanitizer wyciął style="" → check live DOM
H2: Cache po stronie usera → check ?v= param
H3: Naszа reguła ma za niską specificity → grep CSS
H4: System CSS override → znajdź w live computed styles
H5: JS handler wyłącza element → grep + console listeners
```

Ranguj wg likelihood. Test NAJWYŻSZEJ pierwszej.

### Step 6: Binary search (jeśli > 1 hipoteza pasuje)

| Test | Wynik | Conclusion |
|------|-------|------------|
| Disable JS → bug nadal? | TAK | CSS issue |
| Disable JS → bug nadal? | NIE | JS issue |
| Disable CSS rule by rule (DevTools) | znajdź której wyłączenie naprawia | ta jest problem |
| Responsive: 360 / 768 / 1280 | tylko 1 viewport? | media query issue |

### Step 7: Root cause confirmation
**Złota zasada**: zanim napiszesz Edit, MUSISZ POKAZAĆ w MCP:
- Aktualną wartość property
- Jak ją zmienisz (np. injection przez `evaluate_script`)
- Live test że zmiana naprawia (screenshot before/after)

### Step 8: Implement fix
- Edit dokładnie ten 1 selector / 1 line który MCP pokazał problem
- NIE dodawaj defensywności (MutationObserver, periodic check, timeout)
- Jeśli kusze cię "dla pewności jeszcze X" → STOP. Refactor inny issue.

### Step 9: Verify in MCP (po deploy)
- Hard refresh
- Run Step 4 measurements again
- Compare pixel measurements (before vs after)

### Step 10: Update JARVIS memory (jeśli nowy trap)

```bash
# /Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_<short-name>.md
cat > <path> << 'EOF'
---
name: <short title>
description: <100-char summary trapu>
type: feedback
originSessionId: <session-id>
---
# Problem
<co user widzi, kontekst>
# Detection
<jak znaleźć, MCP commands>
# Fix
<exact CSS/JS change>
# Reference
<klient + wersja>
EOF
```

Plus dodaj 1-liner do `MEMORY.md` index.

## Anti-patterns (RED FLAGS — stop and re-investigate)

| Anti-pattern | Co oznacza | Co zrobić |
|-------------|-----------|-----------|
| "Dodam jeszcze 1 warstwę defensywności" | Diagnoza była ZŁA | Re-investigate od zera |
| "Może timeout potrzebny dłuższy" | Nie rozumiesz sync flow | Sprawdź sync flow w DevTools |
| "Może MutationObserver pomoże" | Nie wiesz co ustawia property | Find orphan handler |
| "Może 5 selektorów z !important" | Walka z noise zamiast root cause | Find ONE which wins, reszta to noise |
| "Już 3 razy próbowałem tej kategorii fixu" | Cykl powtarzasz | STOP. Re-investigate |

## Element invisible — 4-property checklist

Najczęstszy debug: "element jest niewidoczny". NIE zgaduj, SPRAWDŹ wszystkie 4:

| Property | Skutek | Jak sprawdzić |
|----------|--------|---------------|
| `display: none` | Element NIE renderuje (zero space) | `getComputedStyle(el).display` |
| `visibility: hidden` | Element renderuje ale niewidoczny (zajmuje miejsce) | `getComputedStyle(el).visibility` |
| `opacity: 0` | Przezroczysty (zajmuje miejsce) | `getComputedStyle(el).opacity` |
| `width/height: 0` | Element ma 0 rozmiar (collapsed) | `el.getBoundingClientRect()` |

Plus **parent/child chain** — bo bug może być w **dziecku** elementu który checkujesz, nie w samym elemencie.

## Przykład: Fair Rentals v1.58→v1.62 saga (5 prób, 4 stracone)

### Client report
```
Klient: "Na iPhone po kliknięciu MENU flagi przy języku znikają. Trzeba odświeżyć żeby wróciły."
UA: iPhone Safari 18.0, viewport 390x844
```

### v1.58: WRONG diagnosis #1
- **Hipoteza**: wrap.visibility = hidden
- **Fix**: `wrap.visibility = visible !important`
- **Test po deploy**: bug wrócił po jednym kliku MENU
- **Lesson**: nie sprawdziłem `wrap` w MCP przed fixem

### v1.59: WRONG diagnosis #2
- **Hipoteza**: cache po stronie usera (klient widzi stary CSS)
- **Fix**: cache-bust query
- **Test**: bug wrócił
- **Lesson**: incognito test by od razu wykluczył cache

### v1.60: WRONG diagnosis #3
- **Hipoteza**: aria-expanded źle ustawione
- **Fix**: aria-only detection
- **Test**: bug wrócił
- **Lesson**: tracked symptom, nie cause

### v1.61: WRONG diagnosis #4 (ESKALACJA DEFENSYWNOŚCI)
- **Hipoteza**: trzeba multi-signal detection
- **Fix**: MutationObserver + periodic check + 5-layer defense
- **Test**: bug WCIĄŻ wrócił
- **RED FLAG**: 4 warstwy defensywności bez znajdowania root cause

### v1.62: RIGHT diagnosis (re-investigation od zera)
- **Step 1**: load page w MCP, otwórz menu, zamknij menu, zmierz `#language_menu`
- **Discovery**: `getComputedStyle(#language_menu).display = "none"` — KTOŚ go ustawia
- **Find handler**: grep body_bottom.js → outside-click handler bez viewport guard
- **Root cause**: orphan handler z desktop dropdown era ustawiał `display: none` na każdym kliku outside togglera. Na mobile (gdzie ten widget jest inline flex) → flagi znikały.
- **Fix**: dodać `if (window.innerWidth <= 991) return;` w outside-click handler
- **Test**: PASS

### Lesson saved to memory

`feedback_iterative_debugging_discipline.md`:

> Jeśli bug wraca po fixie — diagnosis was WRONG, not insufficient.
> Nie eskaluj defensywności (MutationObserver, periodic check). Re-investigate root cause z zero.

`feedback_responsive_handler_viewport_guard.md`:

> Każdy desktop-only JS handler MUSI mieć `window.innerWidth > 991` guard. Inaczej psuje mobile state.

`feedback_element_invisible_debug_checklist.md`:

> Element invisible? Sprawdź 4 properties + parent chain + children chain. Nie tylko jedną.

## Output template

`clients/<klient>/BUG_<data>_<short-name>.md`:

```markdown
# Bug: <title> — <klient> — <data>

## Client report
- User: <co napisał>
- UA/viewport: <iPhone Safari 18.0 / 390x844>
- Screenshot: <path>

## Reproduction
1. Open <URL>
2. Click <element>
3. Observe: <actual>
4. Expected: <should be>

## Hypothesis chain
- H1 (NAJWAŻNIEJSZA): <hypothesis>
  - Test: <MCP command>
  - Result: PASS/FAIL
- H2: ...

## Root cause
<exact selector + property + why>

## Fix
- File: <path>
- Line: <number>
- Change: <before → after>
- JARVIS memory ref: <feedback_*.md if applicable>

## Verification
- Pre-fix MCP measurement: <values>
- Post-fix MCP measurement: <values>
- Pixel diff: <X px>

## Lessons (if new trap)
- Added to: <path to new feedback_*.md>
- Updated MEMORY.md
```

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| Bug report z root cause | `clients/<klient>/BUG_<date>_<name>.md` | Markdown z hipotezami + MCP measurements |
| Pre/post fix screenshots | `clients/<klient>/BUG_<date>_<name>_{before,after}.png` | PNG |
| Nowy trap (jeśli odkryty) | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_*.md` | Markdown |
| MEMORY.md index update | `~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md` | 1-liner |

## Powiązane skille

- **Uses**: `superpowers:systematic-debugging`, `engineering:debug`
- **Calls into**: MCP `chrome-devtools` (live verify)
- **Feeds into**: [/idosell-deploy-cr](02-Skill-deploy-cr.md) (post-fix CR)
- **Updates**: `~/.claude/projects/-Users-user-Desktop-jarvis/memory/`

## Wymagania

- Claude Code z aktywnym MCP `chrome-devtools` (do live reproduction)
- Dostęp do strony klienta (URL live)
- Zgłoszenie klienta (PDF / email / screenshot)
- Opcjonalnie: dostęp do panelu (do test deploy po fix)

## Success metric

| Przed skill | Po skill |
|-------------|----------|
| 3.4 wersji na fix average | 1.5 wersji na fix |
| Fair Rentals v1.49→v1.69 = 21 wersji na 6 issues | 1.5 × 6 = 9 wersji na 6 issues (cel) |
| Klient widzi 5 prób fix | Klient widzi 1-2 prób fix |
| Eskalacja defensywności (MutationObserver, layers) | Surgical edit 1 selector / 1 line |
