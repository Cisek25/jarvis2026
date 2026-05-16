---
name: engine-separate-css-file
description: IdoBooking ma OSOBNE pole "Arkusz stylów CSS" dla silnika rezerwacji (subdomena clientXXXXX.idobooking.com), niezależne od pola CSS strony. Branduj silnik równolegle, zawsze hide logo header+footer, override system vars, override footer-contact-baner ::before/::after.
type: instinct
scope: all-clients
trigger: klient prosi o stylowanie silnika / "silnik wygląda inaczej niż strona" / hide logo w silniku / klient wskazuje URL clientXXXXX.idobooking.com obok własnej domeny
added: 2026-05-05
source_client: piekary13 (client23326) — task 2026-05-05 "ukrywamy logo w silniku, musimy zrobić osobny plik CSS, tylko do silnika rezerwacji, bo on jest osobny"
related: instinct 030 (footer-logo-separate-field — engine też ma osobne pole logo footer), trap #6 (footer ::before), trap #15 (default13 system vars), trap #28 (Fontello unavailable)
---

# Instynkt: Silnik rezerwacji ma osobny CSS

## Kontekst

IdoBooking serwuje silnik rezerwacji na osobnej subdomenie: `client{ID}.idobooking.com`. To są ekrany:
- Lista ofert (`/offer`, `/offers` na subdomenie)
- Detal oferty + kalendarz
- Formularz rezerwacji
- Modale (kontakt, dane gościa)
- Strona finalizacji (Przelewy24/PayU embed)

Każda z tych stron renderuje **default13** template (jak strona główna), ale ma **osobne pole CSS w panelu**:
- Strona: `Wygląd → Edytor CSS` → ląduje w `/customStyles/default13/custom1/custom.css`
- Silnik: `Silnik rezerwacji → Arkusz stylów CSS` → osobny URL, osobna kontrola

Jeśli klient wkleił piękny CSS strony ale ZAPOMNIAŁ o silniku → gość klika „Rezerwuj" i wpada na ekran z domyślnymi systemowymi kolorami (zielony+pomarańczowy z `333333.css.gz`). Doświadczenie zerwane.

## Reguła

**Każdy klient z brandowanym frontem MUSI mieć ENGINE_CSS.css**. To nie jest opcja, to standard delivery.

## Zawartość minimalna ENGINE_CSS.css

1. **`@import` Google Fonts** — te same co strona
2. **`:root !important` override systemowych vars** (trap #15):
   - `--maincolor1`, `--maincolor1_rgba`, `--maincolor2`
   - `--supportcolor1`, `--supportcolor2`
   - `--bgcolor1`, `--bgcolor2`, `--bgcolor3`, `--bgaside`
   - `--hovercolor1`, `--hovercolor2`
   - `--widget_header`, `--btn_large`, `--btn_medium`
3. **Hide logo header+footer**:
   ```css
   .navbar-brand img,
   .footer-contact__logo img { display: none !important; }
   .navbar-brand,
   .footer-contact__logo { padding: 0 !important; width: 0 !important; }
   ```
4. **Typography** — body font + heading font (px nie rem; trap #30)
5. **Buttons jednolite** (trap #23) — `.btn`, `#filters_submit`, `.iai-booking-search`, `.s-btn`, `input[type=submit]`
6. **Form inputs** — `.s-input`, `.form-control`, `input`, `textarea`, `select`
7. **Flatpickr calendar** — selected/inRange/today/disabled (zawsze obecny w silniku)
8. **Offer cards** — `.offer`, `.offer__price`, `.offer__title`, `.accommodation-meters/-roomspace`
9. **Footer-contact-baner** — bg + `::before`/`::after` override (trap #6)
10. **Mobile @ ≤680px** — typography scale, full-width buttons
11. **Defensive** — Fontello hide (trap #28), scrollbar, ::selection

## Co NIE robić

- ❌ Nie kopiować całego CSS strony do silnika — silnik renderuje INNE komponenty (Flatpickr, oferty, formularze), nie potrzebuje hero/featured-grid/galery
- ❌ Nie dawać JS — często klient ma dostęp tylko do CSS w polu silnika (chyba że osobne pole "Koniec body silnika" — sprawdź w panelu)
- ❌ Nie zmieniać layoutu — silnik generuje markup, my tylko style
- ❌ Nie używać `\!important` z bash heredoc (trap #14b) — Write tool

## Weryfikacja po wklejeniu (live)

```js
// chrome-devtools evaluate_script lub DevTools console
const link = document.querySelector('link[href*="customStyles"][href*="custom"]');
const css = await fetch(link.href).then(r => r.text());
({
  size_KB: (css.length/1024).toFixed(1),
  has_marker: css.includes('ENGINE_CSS_v1'),
  escaped_important: (css.match(/\\!important/g)||[]).length,  // 0
  rules_count: [...document.styleSheets].reduce((a,s)=>{
    try { return a + s.cssRules.length } catch { return a }
  }, 0),
});
// Plus assertions:
getComputedStyle(document.documentElement).getPropertyValue('--maincolor1');
// expected: brand color, np. " #722F37"
getComputedStyle(document.querySelector('.navbar-brand img')).display;
// expected: "none"
getComputedStyle(document.querySelector('.btn, .iai-booking-search')).backgroundColor;
// expected: brand RGB
```

## Workflow per nowy klient

1. Po skończeniu strony (CSS_EDYTOR.css), rozegrać palette + fonty
2. Stworzyć `ENGINE_CSS.css` w `clients/{klient}/DO_WKLEJENIA/`
3. Skopiować szkielet z piekary13 lub innego klienta z engine CSS, zamienić tokens
4. Dopisać KROK do `INSTRUKCJA.txt` — „Silnik rezerwacji → Arkusz stylów"
5. Update `memory/clients_data/{klient}.json` → field `engine_css.version`
6. Live verify wg blocku powyżej

## Referencje

- **piekary13** — pierwszy pełny ENGINE_CSS.css (588 linii, 20KB):
  `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css`
- **SORS** — minimalny engine CSS (tylko hide ownerów contact):
  `clients/SORS/DO_WKLEJENIA/engine.css`
- Design plan: `docs/plans/2026-05-05-piekary13-engine-css-design.md`
