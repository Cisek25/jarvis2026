# Instinct 040 — Zawsze pytaj o weryfikację wklejenia PRZED iterowaniem fixu

**Data**: 2026-05-05
**Klient**: solidneapartamenty (lekcja z v1.7.5 → v1.7.6, gdy user nie wkleił JS file)

## Wzorzec

User zgłasza że fix nie działa. Zaczynasz pisać kolejną iterację. **STOP**.

**ZANIM napiszesz nową iterację, zapytaj user**:
1. *"Czy wkleiłeś `[NAZWA_PLIKU]` do pola `[POLE_PANELU]` w panelu IdoSell?"*
2. *"Zrobiłeś hard refresh (Ctrl+Shift+R / Cmd+Shift+R)?"*
3. *"Czy widzisz w panelu w `[POLE]` tekst `[MARKER_PATCH]`?"* (np. `PATCH v1.7.5`, `alignMonthItems`, etc.)

## Dlaczego

JARVIS pakiety klientów IdoSell mają wiele plików (CSS_EDYTOR, HEAD, body_top per podstrona, KONIEC_BODY).
User często wkleja **TYLKO niektóre** zamiast wszystkich. Najczęstsze pomyłki:

- User wkleja **tylko `SA_CSS_EDYTOR.css`** myśląc że tam są wszystkie zmiany. Ale fix może być w
  `SA_KONIEC_BODY.html` (JS) → JS się nie odpala → fix "nie działa"
- User wkleja CSS ale zapomina o **hard refresh** → przeglądarka serwuje cached stary CSS
- User wkleja w **niewłaściwe pole** w panelu (np. body_bottom zamiast custom.css)

## Praktyczne zastosowanie

### W INSTRUKCJA.md kazdej wersji

ZAWSZE list explicite:

```markdown
### Pliki do wklejenia v1.X.Y:
- `SA_CSS_EDYTOR.css` (ZMIENIONY) → wklej w panelu `Wygląd → Arkusz stylów CSS`
- `SA_KONIEC_BODY.html` (ZMIENIONY) → wklej w panelu `Wygląd → Koniec BODY`
- `GLOWNA_PL__cms.html` (BEZ ZMIAN od v1.X.Y-1, jeśli juz wklejony pomiń)

**Po wklejeniu**: Ctrl+Shift+R (hard refresh by ominąć cache).

**Verification**: w DevTools `Elements` tab szukaj `<!-- PATCH v1.X.Y -->` lub w Console
wpisz `console.log(typeof functionName)` żeby sprawdzić czy JS się załadował.
```

### W odpowiedzi po feedbacku "nie działa"

ZANIM napiszesz "patch v1.X.Z":

```markdown
**Pytanie krytyczne zanim iteruję**: czy w panelu IdoSell:
1. Wkleiłeś `SA_KONIEC_BODY.html` z v1.7.5? (sprawdź `Wygląd → Koniec BODY` — szukaj tekstu `PATCH v1.7.5`)
2. Zrobiłeś hard refresh (Ctrl+Shift+R)?
3. W DevTools Console wpisz: `typeof alignMonthItems` → czy zwraca `'function'` czy `'undefined'`?

Jeśli któryś krok pominięty — fix nie miał szansy zadziałać. Powiedz mi i wtedy
będę wiedział czy iterować, czy "to po prostu nie wkleili".
```

## Anty-pattern (czego unikać)

❌ User mówi "nie działa" → ja od razu piszę nową iterację bez weryfikacji wklejenia
❌ Zakładam że v1.X jest na produkcji bo "wysłałem do INSTRUKCJA.md"
❌ Spędzam 4-6 iteracji aż user się wkurzy

## Kiedy stosować

ZAWSZE gdy:
- User feedback "nadal nie działa" / "dalej źle" / "nic się nie zmieniło"
- Wcześniej była już 1 próba fixu
- Plik dotknięty fix to NIE jest CSS_EDYTOR (np. KONIEC_BODY, body_top html, HEAD)
- Problem dotyczy JS behavior (eventy, alignment, dropdowny, dynamiczne komponenty)

NIE stosuj gdy:
- Pierwsza interakcja z user na temat tego buga
- User wyraźnie pokazuje że fix jest aktywny ale efekt jest zły (np. screenshot DevTools)
- User aktywnie eksperymentuje z code i wie co robi

## Powiązane

- Lesson 011: CSS specificity war (gdy fix jest właściwy ale nie wygrywa specyficznością)
- Trap #14 (CLAUDE.md): IdoSell custom.css size limit + bash heredoc bug
- Trap #34 (CLAUDE.md): IdoSell CMS wycina `<script>` z body_top — JS musi iść do KONIEC_BODY
