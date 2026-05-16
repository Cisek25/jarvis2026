---
name: logo-chip-conditional-and-typography-minimum
description: Logo chip TYLKO na transparentnym hero (gdy potrzebny kontrast). Po scroll lub na subpage — BRAK chipu (menu już białe = chip redundantny i overflow-uje). Typografia: body min 18px, nav 1rem, kicker min 0.95rem, small min 14px.
type: instinct
scope: all-clients
trigger: user 'logo wystaje poza pasek' / 'kwadratu po zjechaniu moze juz nie być' / 'czcionki za małe gdzie są małe'
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 v3 "logo musi byc wyrzej aby nie wystawalo ponad pasek + kwadratu po zjechaniu moze juz nie być + w ogole na calej stronie, gdzie sa małe czcionki, to są one ZA MAŁE"
supersedes: instinct 013 (logo-chip-background — za uniwersalny)
related: instinct 012 (global-typography-scale — bumpnięty)
---

# Instynkt: Chip tylko-na-hero + minima typograficzne

## Co naprawiono

### 1. Logo chip — conditional, nie uniwersalny

**Problem**: Wcześniejszy instinct 013 kazał zawsze dawać chip.
W praktyce na subpage i po scroll menu-wrapper jest **już białe**
— chip z białym tłem na białym tle jest:
- Redundantny (nic nie dodaje wizualnie)
- Overflow-uje header (dodatkowa wysokość padding + shadow)
- Wygląda jak bug (user: "kafelek wystaje ponad pasek")

**Fix**: chip tylko gdy go POTRZEBA — na transparentnym hero.

### 2. Typography — absolutne minima

User zgłasza dwukrotnie: "czcionki za małe". Bumpnijmy do agresywnych
minimów. Apartamenty/B&B audyturium 35-65+, czytają okularami.

## Reguła — Chip conditional

```css
/* Default (subpage, scrolled homepage): BRAK chipu */
body header.default13 .navbar-brand,
body header.default13.ap-header--scrolled .navbar-brand,
body:not(.page-index):not(.ap-homepage) header.default13 .navbar-brand {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 14px !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  max-height: 72px !important;
  display: inline-flex !important;
  align-items: center !important;
  align-self: center !important;
}

/* HERO (transparent header) — chip z białym tłem */
body.page-index header.default13:not(.ap-header--scrolled) .navbar-brand,
body.ap-homepage header.default13:not(.ap-header--scrolled) .navbar-brand {
  background: #ffffff !important;
  padding: 6px 14px !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
  transition: all 0.25s ease !important;
}

/* Logo img — STRICT 52px max, never overflow */
body header.default13 .navbar-brand img,
body header.default13.ap-header--scrolled .navbar-brand img {
  height: 52px !important;
  max-height: 52px !important;
  width: auto !important;
  display: block !important;
  margin: 0 !important;
}
```

Wynik:
- **Homepage hero** (transparent menu) → chip biały, kontrast z tłem hero
- **Homepage scrolled** (menu białe) → logo bez chipu, naturalnie na białym
- **Subpage** (menu białe domyślnie) → logo bez chipu

## Reguła — Typography minimum v2

**Podstawowe minima** (bez wyjątków):

| Element | Minimum | Było v1 |
|---------|---------|---------|
| body | 18px | 17px |
| Content paragraph | 1.1rem | 1.05 |
| Card description | 1.05rem | 1.0 |
| Card title H3 | 1.65rem | 1.55 |
| Kicker (uppercase) | 0.95rem | 0.85 |
| Distance badge | 0.88rem + letter-spacing 2.2 | 0.78 |
| Nav item | 1rem (desktop) / 1.1rem (mobile) | 0.92 |
| Blog title | 1.6rem | 1.5 |
| Blog excerpt | 1.05rem | 1.0 |
| Pagehero subtitle | 1.2rem | 1.15 |
| Small text | 14px (absolute min) | n/a |
| Meta/footer | 0.98rem | n/a |

Template CSS: patrz `AP_CSS_EDYTOR.css` §12c (PATCH 2026-04-21 v3).

## Dlaczego TAK DUŻE

1. **B&B / apartamenty audyturium** — 35-65+, okulary
2. **WCAG AA** — minimum 16px body (my 18px)
3. **Mobile** — tekst na 390px viewport potrzebuje WIĘKSZEJ czcionki niż na desktop
4. **Kiepskie monitory** — klient może mieć stary monitor / zły kąt
5. **Perception** — 17px vs 18px to różnica zauważalna ("wreszcie da się przeczytać")

## Weryfikacja

```javascript
// DevTools console, check all font-sizes below threshold:
var threshold = 14;
Array.from(document.querySelectorAll('*'))
  .filter(el => el.offsetParent && el.children.length === 0 && el.textContent.trim())
  .map(el => ({ el: el.tagName + '.' + el.className.slice(0,30), fs: parseFloat(getComputedStyle(el).fontSize) }))
  .filter(x => x.fs < threshold)
  .slice(0, 20);
// Expected: pusty array (żaden tekst poniżej 14px)
```

## Historia
- **v1.7 (013 + 012)**: chip uniwersalnie, body 17px, kicker 0.85rem
- **v1.8 (obecny)**: user zgłasza "chip wystaje", "czcionki za małe".
  Fix: chip conditional, typography bumpnięta

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS: `AP_CSS_EDYTOR.css` §12 (chip) + §12b (nav) + §12c (typography)
- Supersedes: 013 (logo-chip-background — chip zawsze)
- Related: 012 (global-typography-scale — wartości bumpnięte)
- User: "logo musi byc wyrzej aby nie wystawalo + kwadratu po zjechaniu
  moze juz nie być + czcionki za małe"
