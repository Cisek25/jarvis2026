---
name: Iterative debugging — gdy bug wraca po fixie, diagnosis was WRONG
description: Po 5 próbach (v1.58→v1.62) żeby naprawić "mobile menu cycle flagi znikają" — lesson: jeśli bug repeats after fix, NIE eskaluj defensywności, RE-INVESTIGATE root cause z zero. Wcześniejsza diagnoza była błędna.
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Anti-pattern: eskalacja defensywności

Bug: "po menu close flagi znikają". Pomyślałem "aria-expanded jest źle" → fix v1.60 aria-only detection. Bug wrócił. Pomyślałem "multi-signal needed" → fix v1.61 z MutationObserver + periodic check + 5-layer defense. Bug WCIĄŻ wrócił.

5 wersji (v1.58-v1.62) naprawiałem niewłaściwy element — `wrap.visibility`. Bug był w **dziecku** `wrap` (`#language_menu.display = none`).

# Lesson

**Jeśli bug wraca po fixie — diagnosis was WRONG, not insufficient.**

Nie eskaluj defensywności (więcej warstw, więcej timeoutów, więcej observers). Wróć do śledzenia od ZERA:

1. **Sprawdź WSZYSTKO** w devtools Computed tab (visibility, display, opacity, width, height, parent chain, children chain)
2. **Find orphan handlers** — `addEventListener('click')` z poprzednich er kodu które nadal działają
3. **Test hypothesis** — symuluj user flow KROK PO KROKU, sprawdź state po KAŻDYM kroku

Patrz: `feedback_element_invisible_debug_checklist.md`

# Anti-pattern checklist

🚨 Czerwone flagi:
- "Dodam jeszcze 1 warstwę defensywności"
- "Może timeout potrzebny dłuższy"
- "Może MutationObserver pomoże"
- "Może setInterval safety net"
- "Może capture phase wystarczy"

Jeśli już 2-3 razy próbowałeś tej samej KATEGORII fixu (timing, observer, force-set) — STOP. Diagnoza była zła. Re-investigate.

# Disciplined debug workflow

Gdy bug wraca:

1. **Re-read bug report słowa po słowach** — może user opisał coś co przeoczyłeś
2. **Live test step-by-step** — symuluj user flow w devtools, snapshot state po każdym kroku
3. **Inspect ALL related elements** — nie tylko ten o którym myślisz że jest problem
4. **Grep all event listeners** związane z user action (np. wszystkie `addEventListener('click')`)
5. **Sprawdź orphan code** — kod z poprzednich er który nadal się odpala
6. **Test hypothesis** w prawdziwym browser BEFORE writing fix

# Reference: Fair Rentals v1.58 → v1.62 saga

- v1.58: zakładałem że `.navbar-collapse` jest hidden mechanism (false — system uses different markup)
- v1.59: skupiałem na move wrap (helped position bug, nie dotyczył cycle bugu)
- v1.60: aria-only detection (dobry kierunek ale nie root cause)
- v1.61: bulletproof multi-layer defense na WRAP visibility — ale bug był w **#language_menu display** nie w wrap visibility
- v1.62: re-investigation pokazała orphan outside-click handler z v1.55 era ustawiał `#language_menu display:none` na każdym kliku poza language widget. Bug FINALLY trafiony.

**Net result**: 4 stracone wersje, 4 niepotrzebne deploys, niepotrzebny stress dla klienta i mnie. Trzeba było re-investigate już po v1.59 nie czekając do v1.62.
