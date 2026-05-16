# Lesson 002: Footer gap na podstronach IdoBooking

**Discovered:** 2026-04-16 (Piekary 1-3)
**Severity:** CRITICAL
**Confidence:** 100%

## Problem
Na podstronach (/txt/201/, /txt/202/, itd.) pojawia się kremowa/biała przerwa
między treścią a ciemnym footerem. Wygląda jak bug — klient to zgłasza.

## Root cause
IdoBooking wraps body_top content w `main.page > .container > .row`.
Dodaje pusty element `.gallery-lightbox.row.my-5` z 30px margin.
Wrapper `.container` ma padding.
Element `.big-label` też dodaje margin.

## Rozwiązanie CSS
```css
main.page > .container { padding-top: 0 !important; padding-bottom: 0 !important; }
main.page { padding-bottom: 0 !important; margin-bottom: 0 !important; }
main.page .gallery-lightbox.row { margin: 0 !important; padding: 0 !important; height: 0 !important; overflow: hidden !important; }
main.page .big-label { margin: 0 !important; padding: 0 !important; height: 0 !important; overflow: hidden !important; }
```

## Reguła
ZAWSZE dodawaj ten CSS do KAŻDEGO klienta. Dotyczy WSZYSTKICH podstron.

## Powiązane
- UX-091 w ux-checklist.json
- CLAUDE.md trap: "Subpage footer gap fix"
