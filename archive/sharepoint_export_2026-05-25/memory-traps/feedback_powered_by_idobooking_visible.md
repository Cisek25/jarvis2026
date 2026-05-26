---
name: Powered by IdoBooking — must be visible in footer
description: Edytując DOWOLNY istniejący projekt IdoBooking/IdoSell, "Powered by IdoBooking" musi pozostać dobrze widoczny w dolnej części strony (stopka). Nie wolno go ukrywać, mocno dimować ani agresywnie skalować w dół.
type: feedback
originSessionId: 0504fd64-5fc0-46b2-b759-a096d5c3d21a
---
Każdy szablon IdoBooking dostarcza w stopce element `.powered_by` / `.powered_by_logo` / `.powered-by` z linkiem do "Powered by IdoBooking". To **wymóg licencyjny/brandingu IAI** i nie wolno tego ukrywać ani skalować do niewidoczności.

**Why:** Klient odkrył to przy projekcie Mazurski Chill — wcześniej nasze CSS-y (trap SS) miały `opacity: 0.35 !important` + `max-width: 80px / max-height: 18px !important` "żeby badge nie psuł estetyki". To narusza wymóg widoczności. Musi być **dobrze widoczne** w dolnej części strony.

**How to apply:**
1. **Na starcie KAŻDEGO nowego/edytowanego projektu** — sprawdź CSS klienta na rules ukrywające/dimujące `.powered_by`, `.powered_by_logo`, `.powered-by` (display:none, opacity <0.7, max-width/height aggressive, visibility:hidden, transform:scale).
2. **Usuń/odwróć** te rules. Cel: opacity ≥ 0.85, rozsądny rozmiar (np. ~140×32px max, lub bez constraint), pozycja w stopce zachowana.
3. **Acceptable styling**: filter (brightness/invert dla dopasowania do bg footera), padding, alignment — OK. Just **must be clearly visible**.
4. **Acceptable alternatives**: jeśli systemowy `.powered_by` nie pasuje wizualnie, można go ukryć i dodać własny dobrze widoczny element ("Powered by IdoBooking" tekstem lub własnym layoutem z logo) — byle w dolnej części strony i czytelny.
5. **NIE wolno**: hide całkowicie bez zastąpienia, opacity <0.5, rozmiar tak mały że nie da się przeczytać/rozpoznać logo.

**Project pattern (Piekary 1-3 fix 2026-05-14 v4 — finalna iteracja):**
- Iteracje:
  - v1 (max-width:160px): klient "jezu strasznie to małe"
  - v2 (240×56 + flex-basis:100% własny rząd): za dużo, klient woli inline
  - v3 (height:40px inline + `filter: brightness(0) invert(1)` = białe na ciemnym): klient zauważył że logo jest BIAŁE, nie natywne kolory IdoBooking
  - **v4 finalny**: inline + height:40px + **filter:none** (zachowaj brand colors)
- **Finalny pattern do skopiowania**:
  ```css
  /* Wrapper — zachowaj systemową pozycję inline w footer row */
  .powered_by, .powered_by_logo, .powered-by,
  footer .powered_by, footer .powered_by_logo {
    display: inline-block !important;
    vertical-align: middle !important;
    visibility: visible !important;
    opacity: 1 !important;
    margin: 0 0 0 8px !important;
    padding: 0 !important;
    background: transparent !important;
  }
  /* Img — zachowaj brand colors + scale 2× */
  .powered_by img, .powered_by_logo img, .powered-by img,
  footer .powered_by img, footer .powered_by_logo img {
    filter: none !important;         /* NIE brightness/invert! brand colors zostają */
    width: auto !important;
    height: 40px !important;         /* 2× natywnego ~20px */
    max-width: none !important;
    max-height: none !important;
    opacity: 1 !important;
    display: inline-block !important;
    vertical-align: middle !important;
  }
  ```
- **Krytyczne zasady**:
  1. **NIE filtruj kolorów** (`filter: brightness(0) invert(1)` = białe logo, zła praktyka, zniekształca brand)
  2. **NIE ukrywaj** (`display:none`, `visibility:hidden`, `opacity:0` na powered_by = naruszenie TOS)
  3. **NIE skaluj w dół poniżej czytelności** (max-width:80px z natywnym 120px = mały zamazany badge)
  4. Pozycja inline w systemowym footer row jest OK — system już to dobrze rozmieszcza
- **Lessons learned**:
  1. Native size IdoBooking powered_by image: ~120×24px → height:40 = ~200×40 displayed (2×)
  2. Klient woli inline w footer row vs własny rząd centered
  3. `max-width:none` + `max-height:none` muszą być explicit (override starych trap-SS)
  4. Brand colors są designed dla różnych tł — działają na dark burgundy bez filter
- Trap reference: CRITICAL-SS REWRITE v4 w CSS_EDYTOR.css (sekcja 36)
- Engine: identyczny pattern w ENGINE_CSS.css §8b (+ rozszerzony o .iai-logo)
- **Library template updated**: `library/css/layer1-traps.css` linia ~419 + komentarz w bug-3 sekcji

**Files to audit (any client edit):**
- `*/DO_WKLEJENIA/CSS_EDYTOR.css` lub `*/CSS_EDYTOR.css` — szukaj `powered_by` selektorów
- Custom.css na engine — może mieć dodatkowe override (rzadziej)
