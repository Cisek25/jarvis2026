# IdoSell Website Build Checklist

## RECON (przed budową)
- [ ] Otwórz panel klienta, zapisz ID (clientXXXXX)
- [ ] Zmierz header height (DevTools → Elements → header → Computed → height)
- [ ] Zapisz header class (.defaultsb / .default13 / inne)
- [ ] Sprawdź oferty — ile, jakie nazwy, POKOJE/APARTAMENTY/DOMKI/NAMIOTY?
- [ ] Sprawdź zdjęcia w sliderze (ile, jakie URL-e)
- [ ] Sprawdź zdjęcia ofert (ile pokoi ma zdjęcia)
- [ ] Zapisz telefon i email z panelu
- [ ] Sprawdź telefon — CZY MA SPACJĘ? (jeśli tak → popraw w panelu)
- [ ] Ustal: prefix BEM (2-3 litery), kolory, fonty

## CSS BUILD (§0-§14)
- [ ] §0 CSS Variables — wszystkie placeholdery zamienione
- [ ] §1 System traps — WSZYSTKIE 15 trapów obecne
- [ ] §2 Typography — fonty, rozmiary
- [ ] §3 Header — fixed, opaque, no shadow
- [ ] §4 Hero/Slider — min-height, gradient
- [ ] §5 Search widget — z-index 1000, overflow visible, inputs z-index 2
- [ ] §6 Homepage sections — [per client]
- [ ] §7 /offers — orange override, filter collapse, chevrons CSS-only
- [ ] §8 /offer detail — price circle 150x150, ghost form hidden, ZAREZERWUJ 14px
- [ ] §9 /contact — links + buttons brand color
- [ ] §10 /txt subpages — hide .iai-search
- [ ] §11 Footer — dark bg, brand links (CSS only, NO custom HTML!)
- [ ] §12 System elements — #bounce, #backTop, cookie, skip — HARDCODED hex!
- [ ] §13 Responsive — 991, 767, 480 breakpoints
- [ ] §14 Animations — reveal

## HTML BUILD
- [ ] HEAD — Google Fonts link
- [ ] Homepage CMS — hero, oferty z PRAWDZIWYMI zdjęciami, features, CTA
- [ ] Podstrony body_top — [per client]
- [ ] Body_bottom JS — all 8 sections (§1-§8)
- [ ] INSTRUKCJA — wypełniona danymi klienta

## TESTING (OBOWIĄZKOWE!)
- [ ] Homepage (/) — test_links.js: 0 FAIL
- [ ] /offers — test_links.js: 0 FAIL, .iai-search hidden
- [ ] /contact — test_links.js: 0 FAIL
- [ ] KAŻDA /txt/ podstrona — test_links.js: 0 FAIL
- [ ] KAŻDA /offer/ strona — test_full_audit.js: Grade A

## AUDIT PER PAGE
| Strona | bodyFont 16 | orange 0 | broken imgs | broken links | phone OK | score |
|--------|-------------|----------|-------------|--------------|----------|-------|
| / | | | | | | |
| /offers | | | | | | |
| /contact | | | | | | |
| /txt/... | | | | | | |
| /offer/... | | | | | | |

## PRE-DELIVERY
- [ ] Wszystkie /txt/ linki mają format /txt/NNN/Slug (z numerem!)
- [ ] Telefon BEZ spacji w panelu
- [ ] Email poprawny
- [ ] 0 system orange na żadnej stronie
- [ ] Body font 16px na każdej stronie
- [ ] Search widget działa (homepage) — 3 dropdowny klikalne
- [ ] Footer — system-generated, ostylowany CSS
- [ ] Zdjęcia — prawdziwe, nie placeholder
- [ ] INSTRUKCJA.txt wypełniona

## POST-PASTE (po wklejeniu przez usera)
- [ ] Hard refresh (Ctrl+Shift+R) na każdej stronie
- [ ] test_links.js na homepage → 0 FAIL
- [ ] test_full_audit.js na każdej /offer/ → Grade A
- [ ] Search widget klikalne
- [ ] Mobile check (F12 → toggle device)
