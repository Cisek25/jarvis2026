# Fair Rentals — Audyt 29 punktów PDF Agnieszki + status v1.29 + v1.30

**Data**: 2026-05-14
**Źródło**: `/Users/user/Downloads/Uwagi_www.pdf` (17 stron, 6 zrzutów screenshotów)
**Audytor**: senior-frontend (PDF text extraction via subagent + live DevTools verification)

---

## 🟢 Już rozwiązane przed audytem PDF (v1.28 / v1.29)

| PDF # | Sekcja | Problem | Status / fix |
|---|---|---|---|
| **P7a** | Menu główne — scroll | "Spory przeskok przy zwijaniu menu" | ✅ §94 v1.28 — hero centered, search inline |
| **P7b** | Menu — scrolled | "Logotyp wygląda za duży w zwiniętej wersji" | ✅ **§98 v1.30 — JUŻ NAPRAWIONE** (height 80→48px scrolled) |
| **P5** | Cytat | "Otwarcie cudzysłowu, brak zamknięcia" | ⚠️ Sprawdzić w cytacie Karoliny Banaś — `magazine__quote` |
| **P12c** | Filtry — żółty button | "Biały tekst na #E2D700 nieczytelny" | ✅ §96a v1.29 — cookie button fix (ten sam wzorzec dla wszystkich .ck żółtych) |
| **P10b** | Stopka — metody płatności | "Tło ucięte po prawej" | ⚠️ Sprawdzić `.footer-contact-baner` |
| **P21** | FAQ edycja | "Gdzie edytować treść?" | ℹ️ Pytanie nie problem — odpowiedź: Panel → Treści → /txt/201 |

---

## 🟡 Out-of-scope (konfig IdoBooking lub treść panelu)

| PDF # | Sekcja | Problem | Action |
|---|---|---|---|
| P15c | Cennik apartamentu | "Błędna data: rok 2028" | **KLIENT**: Panel → Oferty → konkretny apartament → Cennik → sprawdzić daty obowiązywania (pewnie ma 2028 zamiast 2026) |
| P12a | Filtry oferty | "Nie działa rozwijanie filtrów" | **KLIENT** lub support Idosell — to interaktywność systemowa wyszukiwarki |

---

## 🔴 DO ZROBIENIA — Sprint F (Mass UX fixes z PDF)

### F1 — Wersja językowa (P1, top priority)
- **P1a**: hover czcionka mało czytelna → kontrast hover dla language toggler items
- **P1b**: ikona strzałki nie wyśrodkowana + za mała → align flex; min-height ikony
- **P1c**: lista wersji nie wyrównana pionowo → flex column align
- **P1d**: klik w rozwinięty PL nie zamyka → JS toggle logic
- **P1e**: flagi przed skrótem (PL/EN/DE) → SVG/emoji flagi prefix

### F2 — CTA + Hover (P2, P6)
- **P2**: hover button przeskok → usunąć `transform: translateY` lub `scale`, zostawić tylko `background`
- **P6a**: hover cały blok rośnie → zmienić na `transform: scale` tylko na `__img` (kadr)
- **P6b**: `body .fr-apt-card` artefakt bg na obrazku → debug
- **P6c**: info wielkość/osoby zlewa się z tłem → zwiększyć kontrast text na ciemnym tle (`color: rgba(255,255,255,0.78)` → `0.92`)

### F3 — Kalendarz (P3)
- **P3**: ucięte strzałki kalendarza → litepicker arrows padding/overflow

### F4 — Widget rezerwacji (P4)
- **P4a**: powiększyć czcionkę i ikonę przycisku SZUKAJ
- **P4b**: button SZUKAJ niespójny rozmiar z polami → wymusić `height: 100%` lub matching min-height

### F5 — Widget liczb (P8)
- **P8**: tekst "Każdy odebrany osobiście..." mało czytelny → szary ALE bardziej widoczny (`#a8a8a8` → `#cfcfcf` lub `#d4d4d4`)

### F6 — Widget "Nie tylko dla Gości" (P9)
- **P9**: sekcje zlewają się → wyodrębnić wizualnie "Dla właścicieli" + "Dla biznesu" (border-left z gold accent, padding-left, gap)

### F7 — Stopka (P10a)
- **P10a**: telefon + e-mail nie w jednej linii → flex align-items center; vertical-align baseline

### F8 — Menu aktywne pozycje (P11, P18)
- **P11**: brak aktywnej pozycji w menu na /offers → `.nav-link.active` style
- **P18**: aktywna kategoria mało czytelna → wzmocnić accent (underline + bold + color)

### F9 — Oferta — filtry (P12)
- **P12b**: tekst "Zastosuj filtry" niewyśrodkowany → align-items center
- **P12c**: cena wyróżnić kolorystycznie → przyklejać do brand color (gold #8a7300 deep)

### F10 — Oferta — teksty (P13)
- **P13**: ucięte teksty → `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` lub `line-clamp: 2`

### F11 — Szczegóły apartamentu (P14, P15a-b, P16, P17)
- **P14a**: "Cena" + "Zarezerwuj teraz" niewyśrodkowane → flex center
- **P14b**: bloczek z ceną → ciemne tło (var(--fr-dark))
- **P15a**: niewyśrodkowany tekst "Zarezerwuj teraz"
- **P15b**: kolor ceny zlewa się z przyciskiem → kontrast/inny color
- **P16**: ujednolicić font-size dla przejrzystości → revisit typography hierarchy
- **P17**: scrolled menu nachodzi na sekcje → `padding-top: header_height` lub `scroll-margin-top`

### F12 — Obsługa najmu (P19, P20)
- **P19**: nagłówek "Dla Właścicieli" → poprawić odstępy obramowania
- **P20**: tel/email nieczytelne → kontrast

### F13 — Kontakt (P22)
- **P22a**: linki "zobacz ofertę" / "sprawdź na mapie" → kontrast/style
- **P22b**: tel/email kontrast
- **P22c**: "Nasze lokalizacje" przenieść pod "Dane do przelewów", 100% width

### F14 — Mobile (P23-P29, **CAŁY OSOBNY MINI-SPRINT**)
- **P24a-f**: menu mobilne — kompleksowy redesign (cienie loga, podlewka, alignment, scrolled)
- **P25**: widget "Jak to działa" mobile → naprawić layout
- **P26**: przycisk "powrót na górę" off-screen → `right: 16px` + `bottom: 16px` + `position: fixed`
- **P27**: szczegóły apartamentu mobile → brakuje odstępu
- **P28**: dziwnie ułożone dane kontaktowe → reorganizacja
- **P29**: horizontal scroll bug → `overflow-x: hidden` na body / html + sprawdzić wszystkie elementy które wystają

---

## Priorytetyzacja (estymowane czasy)

### 🔴 HIGH — najbardziej widoczne, krytyczne UX
| Bundle | Zakres | Estimat |
|---|---|---|
| F1 + F8 | Wersja językowa + aktywne menu | 1h |
| F2 + F6c | Hover przeskok + kontrast tekstów | 30min |
| F14-P29 | Horizontal scroll bug mobile | 30min |
| F14-P24 | Mobile menu redesign | 1.5h |
| F4 | Widget SZUKAJ | 20min |
| F9 + F10 | Filtry oferty + ucięte teksty | 45min |

**Razem HIGH: ~4-5h pracy**

### 🟡 MEDIUM — kosmetyczne ale liczne
| Bundle | Zakres | Estimat |
|---|---|---|
| F3 | Kalendarz strzałki | 15min |
| F5 + F12 | Kontrast tekstów (szary jaśniejszy) | 30min |
| F7 + F10a | Stopka layout | 20min |
| F11 (P14-P17) | Szczegóły apartamentu | 1h |
| F13 (P22) | Kontakt redesign | 45min |

**Razem MEDIUM: ~2.5h pracy**

### 🟢 LOW — drobiazgi
| Punkt | Zakres | Estimat |
|---|---|---|
| P5 | Brakujący cudzysłów | 5min |
| P10b | Tło stopki ucięte | 10min |
| P26 | Back-to-top button | 10min |

**Razem LOW: ~30min**

---

## Status overall

| Bucket | Liczba punktów | Status |
|---|---|---|
| ✅ Już zrobione (v1.28-v1.30) | 6 | DONE |
| ⚠️ Out-of-scope (panel Idosell) | 2 | KLIENT |
| 🔴 Do zrobienia w Sprint F | 21 | TODO |
| **Total** | **29** | — |

**Estymowany czas Sprint F**: 7-8h (rozłożone na 2 sesje)

---

## Następne kroki

1. **Dziś**: klient wkleja v1.30 (zawiera v1.29 + §98 logo fix). To rozwiązuje P7 całkowicie.
2. **Następna sesja (Sprint F1)**: bundle HIGH priority (4-5h):
   - Wersja językowa redesign
   - Hover behavior fix
   - Mobile horizontal scroll bug
   - Mobile menu redesign
   - Widget SZUKAJ
   - Filtry oferty + ellipsis na kartach
3. **Kolejna sesja (Sprint F2)**: bundle MEDIUM + LOW (3h)
4. **Klient w międzyczasie**:
   - Panel → SEO → wyłącz noindex
   - Panel → Oferty → uzupełnij cenniki (cena "od/noc")
   - Panel → Cennik apartamentu → sprawdzić "rok 2028"
   - Filtry wyszukiwarki — Wygląd → Ustawienia wyszukiwarki

---

## Decyzja architektoniczna do potwierdzenia z user

**P14b**: "Bloczek z ceną zrobić w ciemnym kolorze". 
Obecnie wygląd cream/light. Klient prefer dark contrast. To globalna zmiana — wymaga jednorazowej decyzji "tak/nie" przed implementacją. Klient w PDF dał już sugestię, więc raczej tak.

**P22c**: "Nasze lokalizacje przenieść pod Dane do przelewów, 100% width".
Wymaga reorganizacji layoutu sekcji Kontakt — może wymagać dyskusji z klientem o gridzie końcowym.
