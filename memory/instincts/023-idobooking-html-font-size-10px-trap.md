---
name: idobooking-html-font-size-10px-trap
description: 🔥 CRITICAL — IdoBooking default13 ustawia `html { font-size: 10px }` (stara konwencja 62.5%). Wszystkie rem-based wartości są 10× MNIEJSZE niż myślisz. `1rem = 10px` nie 16. Zawsze dodaj `html { font-size: 16px !important }` na początku custom.css.
type: instinct
scope: all-clients
trigger: każdy nowy klient IdoBooking default13 / audyt typografii / 'czcionki za małe'
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — discovery 2026-04-21
priority: CRITICAL-FIRST-DAY
---

# Instynkt: IdoBooking root font-size 10px bug 🔥

## Bug
System template IdoBooking default13 ma w app.css:
```css
html { font-size: 10px; }
```

To stara konwencja "62.5%" (10/16 = 62.5%) popularna około 2015 żeby
uprościć rem math (1.4rem = 14px zamiast 22.4px).

**PROBLEM**: wszystkie WSPÓŁCZESNE narzędzia, snippety, template-y zakładają
że `html { font-size: 16px }` (CSS default). Gdy programista pisze
`font-size: 1rem` na nav-link myśląc 16px → renderuje się 10px.

## Symptomy (jak wykryć)
- User: "czcionki wszędzie za małe" — typowy red flag
- User: "menu ledwo widać" — nav-link 1rem = 10px
- User: "REZERWACJA kicker mały" — 0.95rem = 9.5px
- DevTools → html element → `font-size: 10px` w app.css.gz

## Weryfikacja
```javascript
// DevTools console:
getComputedStyle(document.documentElement).fontSize
// Expected: "16px" (standard)
// BUG: "10px"
```

## FIX — dodaj NA SAMYM POCZĄTKU custom.css

```css
/* FIRST RULE w custom.css — reset do standard CSS defaults */
html,
html.default13,
html.no-js,
html:root {
  font-size: 16px !important;
}
```

To sprawi że wszystkie rem-values renderują się prawidłowo:
- 1rem = 16px (standard)
- 0.95rem = 15.2px (kicker czytelny)
- 1.5rem = 24px (H3 card)
- 2.5rem = 40px (H2 section)

## Co wpływa na INNE style
Reguły które były pisane pod html=10px (np. systemowe app.css
`font-size: 1.4rem` = 14px) po naszym fixie renderują się 1.6× większe:
`1.4rem * 16px = 22.4px`.

W praktyce NIE jest to problem bo:
- System app.css ma `body { font-size: 16px }` który resetuje rem-base
  dla children
- Większość systemowych rules używa px nie rem
- Override w `body` wystarcza bo dziedziczenie

Jeśli zauważysz że jakiś systemowy element się rozepchł — dodaj
point-fix:
```css
body.page-X .system-element { font-size: 14px !important; }
```

## Kiedy JEST problem (rzadkie)
Gdy system klienta ma custom.css pisany pod html=10px konwencję (np.
stare klienty IdoBooking). Nagły reset może popsuć. Sprawdź:

```bash
grep -E "font-size:\s*\d+\.\d*rem" clients/{klient}/DO_WKLEJENIA/*.css | head
```

Jeśli większość rules używa `1.4rem`, `1.6rem`, `2.4rem` itp. (a nie
`px`) → klient był pisany pod 10px root. Wtedy zanim resetujesz:
1. Dodaj html=16px fix
2. Sprawdź live — co się popsulo
3. Konwertuj rem → px w stylach klienta (lub zostaw html=10px)

## Czemu to CRITICAL
1. **Instant user feedback** — klient natychmiast widzi że "wszystko małe"
2. **Cascade effect** — bug psuje dosłownie KAŻDĄ rem-based regułę
3. **Debugging jest trudny** — wszystko wydaje się działać (reguły aplikują się)
   ale computed 10x za małe. Bez sprawdzenia `html { font-size }` łatwo przegapić
4. **AP v1.7-v1.8** stracił 5 iteracji na fix czcionek który nie działał
   bo root cause = html=10px, a ja podbiłem rem myśląc że 1rem=16px

## Dodaj do CLAUDE.md traps
Ta bomba zasługuje na pozycję #1 w CRITICAL TRAPS. Bez tego fixa każdy
nowy klient zacznie z "czcionki za małe" bug.

## Referencja
- Client: apartamenty-parkowe (client58154) — discovery 2026-04-21 v1.8.5
- CSS patch: `AP_CSS_EDYTOR.css` §12c (pierwsza reguła: html=16px)
- User: "WSZYSTKIE czcionki globalnie, menu za małe, REZERWACJA ledwo widać"
- Related: instincts 012, 019 (wcześniejsze typography bumps nie działały bo
  próbowały rem-values ale html=10px)

## Historia rozwiązywania (AP case study)
- v1.7: bumpnąłem body do 17px, kicker do 0.85rem → user: "za małe" (bo 8.5px)
- v1.8.2: body 18px, kicker 0.95rem → user: "za małe" (bo 9.5px)
- v1.8.5: **ODKRYTE** html=10px → fix `html { 16px !important }` → 1rem=16
  naprawdę działa → user satisfied (po wklejeniu)

**Lekcja**: przed bumpnięciem typografii ZAWSZE sprawdź
`getComputedStyle(document.documentElement).fontSize` — jeśli nie 16px,
fix root PRZED jakimkolwiek rem-value work.
