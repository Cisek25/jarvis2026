---
name: fontello-icons-unavailable
description: IdoBooking NIE ładuje fontello font dla template default13. Wszystkie `<i class="icon icon-XXX">` renderują się jako brzydkie placeholdery lub emoji (pin lokalizacji zamiast hamburgera!). ZAWSZE ukrywaj fontello i zastępuj inline SVG / CSS-drawn.
type: instinct
scope: all-clients
trigger: nieprawidłowe ikonki w systemowych elementach / mobile menu 'ikona lokalizacji' / language toggler z dziwną ikonką
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "na mobile, menu ma ikonę lokalizacji, ma mieć normalne typowe menu + znaczek ikonka przy zmianie języka nadal występuje, nie ma by tej ikonki"
related: CLAUDE.md trap #14 (FontAwesome not loaded)
---

# Instynkt: Fontello icons nie działają

## Problem
System IdoBooking (default13) dla pewnych podstron renderuje:
```html
<button class="navbar-toggler">
  <i class="icon icon-menu"></i><span>Menu</span>
</button>
<button class="language__toggler">
  <span id="language_label">pl<span><i class="icon icon-arrow_smaller_down"></i></span></span>
</button>
```

Ale **fontello font stylesheet NIE jest ładowany**. Ikonka renderuje
się jako:
- Dziwny placeholder glyph (kwadrat/znak zapytania)
- Emoji fallback (user AP widzi **ikonę lokalizacji/pin zamiast hamburgera**)
- Pusty glyph (nic widocznego, ale zajmuje space)

User zgłasza: "menu ma ikonę lokalizacji" / "znaczek przy języku
nadal występuje".

## Reguła (uniwersalna)

### 1. ZAWSZE ukrywaj fontello/icon elementy
```css
/* Wszystkie systemowe fontello ikonki — ukryj */
.navbar-toggler .icon,
.navbar-toggler i.icon,
.navbar-toggler [class^="icon-"],
.navbar-toggler [class*=" icon-"],
.language__toggler .icon,
.language__toggler i.icon,
button.language__toggler [class^="icon-"],
.page-top__language .icon,
.filter_header .icon,
.filter_header [class^="fa-"] {
  display: none !important;
}
```

### 2. Zastąp inline SVG lub CSS-drawn gdzie potrzebne
Dla hamburger-menu użyj CSS-drawn bars (3 linie gradient):

```css
.navbar-toggler {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  background: transparent !important;
  border: 1px solid rgba(20, 125, 59, 0.35) !important;
  border-radius: 8px !important;
  padding: 10px 14px !important;
  min-height: 44px !important;
  color: var(--ido-primary) !important;
  font-weight: 600 !important;
  letter-spacing: 1.2px !important;
  text-transform: uppercase !important;
}
.navbar-toggler::before {
  content: '' !important;
  display: inline-block !important;
  width: 22px !important;
  height: 16px !important;
  background-image:
    linear-gradient(to bottom, currentColor 2px, transparent 2px),
    linear-gradient(to bottom, currentColor 2px, transparent 2px),
    linear-gradient(to bottom, currentColor 2px, transparent 2px) !important;
  background-position: 0 0, 0 7px, 0 14px !important;
  background-repeat: no-repeat !important;
  background-size: 22px 2px, 22px 2px, 22px 2px !important;
  flex-shrink: 0 !important;
}
```

Dla language toggler (PL / EN) — **nie potrzebujemy ikonki**.
Sam tekst "PL" + padding jest czytelny:

```css
.language__toggler {
  padding: 8px 14px !important;
  font-size: 0.92rem !important;
  font-weight: 600 !important;
  letter-spacing: 1.2px !important;
  text-transform: uppercase !important;
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 6px !important;
  color: inherit !important;
}
```

### 3. FontAwesome (fa-* / fa-solid) — taki sam case
CLAUDE.md trap #14: "FontAwesome NOT loaded — hide broken FA icons".
Dla `.filter_header .fa`, `.fa-angle-down` → replace z CSS chevron:

```css
.filter_header::after {
  content: "" !important;
  width: 10px !important;
  height: 10px !important;
  border-right: 2px solid currentColor !important;
  border-bottom: 2px solid currentColor !important;
  transform: rotate(45deg) !important;
}
```

## Test (po wklejeniu CSS)

### Desktop
- Language toggler → sam napis "PL" w pill, brak ikonki ✓
- Menu items → nie dotyczy (widoczne inline)

### Mobile (375-500px)
- Hamburger button → 3 linie CSS-drawn + tekst "Menu" ✓
- Kliknięcie otwiera menu ✓
- Nie ma pin lokalizacji / innej placeholder ikonki ✓

## Weryfikacja console
```javascript
// Sprawdź czy fontello się załadował
document.fonts.check("16px 'fontello'");  // false w 99% przypadków
document.fonts.check("16px 'iaifonts'");  // IdoBooking używa iaifonts też

// Sprawdź czy jakieś .icon są widoczne
Array.from(document.querySelectorAll('.icon, i.icon, [class^="icon-"]'))
  .filter(i => i.offsetParent && getComputedStyle(i).display !== 'none')
  .map(i => ({ cls: i.className, parent: i.parentElement.tagName }));
// Expected: pusty array lub tylko dopuszczone (fontawesome-free)
```

## Ważna uwaga
**NIE ładuj fontello ręcznie** — to zewnętrzny plik, wzrost size
custom.css + spowolnienie. Zamiast tego **ukrywaj + zastępuj własnym**.
Inline SVG lub CSS-drawn są lekkie, kontrolowane, branded.

## Wyjątki
- `.iaifonts`, `.fontello`, `[class*="icon-"]` **wewnątrz booking
  widget** (`.form-booking`, `#iai_book_form`) — zostawiamy, bo mogą
  mieć inny mechanizm ładowania
- Icon fonty dopuszczone: font-family `iaifonts` (czasem działa)

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS patch: `AP_CSS_EDYTOR.css` §15 (language icon) + §16 (hamburger)
- User feedback: "menu ma ikonę lokalizacji" + "ikonka przy zmianie
  języka nadal występuje"
- Related: CLAUDE.md trap #14 (FontAwesome)
