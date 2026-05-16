---
name: cta-color-consistency
description: Wszystkie główne przyciski CTA MUSZĄ używać tego samego koloru brandu (--ido-primary). Nigdy nie mieszaj primary/accent/secondary dla tych samych akcji. Klient zauważy i zgłosi.
type: instinct
scope: all-clients
trigger: audyt / klient 'te przyciski się różnią' / budowa nowych komponentów
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "te kolory były stałe, zoabcz, ze np. szczegóły i zastosuj filtry bardzo się różnią na /offers"
---

# Instynkt: CTA jeden kolor — brand primary

## Problem (case AP)
Na `/offers` były dwa wizualnie różne przyciski wykonujące podobne
akcje (nawigacja do apartamentu / zatwierdzenie filtra):
- `#filters_submit` "Zastosuj filtry" — forest green `#147D3B` (`--ido-primary`)
- `.ap-offer-card__cta` "Zobacz szczegóły" — olive `#598700` (`--ap-accent`)
- System `span.btn` "SZCZEGÓŁY" — olive też

Wyglądało jakby to były przyciski z różnych aplikacji. Użytkownik AP
(2026-04-21): "te kolory były stałe (...) bardzo się różnią".

## Reguła (absolutna)

### Primary CTA = `--ido-primary` tylko
Wszystkie przyciski które wywołują akcję "konwersji":
- Rezerwuj / Book / Sprawdź dostępność
- Zastosuj filtry / Filter / Apply
- Zobacz szczegóły / View details
- Zapisz / Subscribe / Wyślij
- CTA w hero, final-cta, offer cards, blog cards CTA

**WSZYSTKIE te same kolory**: `background: var(--ido-primary)`,
border-radius, padding, font-size, letter-spacing — unified.

### Accent kolor = tylko dla badge'y / dekoracji
`--ap-accent` (olive, lime, jakikolwiek drugi kolor brandu) używaj
TYLKO dla:
- Price badge na zdjęciach
- Distance badge ("5 MIN PIESZO")
- Kickers/labels (małe uppercase)
- Hover highlight w menu nav

**NIGDY** dla głównych przycisków akcji.

### Outline vs solid
Jedna konwencja per strona:
- **Solid primary** dla high-intent CTA (Rezerwuj, Wyślij)
- **Outline primary** dla secondary CTA (Szczegóły, Zobacz więcej)
  — ten sam kolor obramowania/tekstu, tylko bez fill. Hover: fill.

## Template CSS (AP v1.7)

```css
/* Primary CTA — hero, final-cta */
.{prefix}-hero__cta,
.{prefix}-final-cta__btn,
.{prefix}-primary-cta {
  background: var(--ido-primary) !important;
  color: #fff !important;
  border: 1px solid var(--ido-primary) !important;
  border-radius: 6px !important;
  padding: 16px 32px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
}
.{prefix}-hero__cta:hover {
  background: var(--ido-secondary) !important;
  border-color: var(--ido-secondary) !important;
  transform: translateY(-1px) !important;
}

/* Secondary CTA — offer-card, "Zobacz szczegóły" */
.{prefix}-offer-card__cta {
  color: var(--ido-primary) !important;   /* NIE --ap-accent! */
  border-color: var(--ido-primary) !important;
  background: transparent !important;
}
.{prefix}-offer-card__cta:hover {
  background: var(--ido-primary) !important;
  color: #fff !important;
}

/* System /offers listing — force primary */
body.page-offers .btn:not(#filters_submit),
body.page-offers button.btn:not(#filters_submit),
body.page-offers a.btn:not(#filters_submit),
body.page-offers span.btn {
  background: var(--ido-primary) !important;
  border-color: var(--ido-primary) !important;
  color: #fff !important;
  border-radius: 6px !important;
  /* + padding/font-size/letter-spacing unified */
}
```

## Checklist przed oddaniem strony
1. ✅ Wszystkie przyciski "Rezerwuj/Book" → ten sam kolor
2. ✅ Wszystkie "Szczegóły/Details" → ten sam kolor (primary, nie accent)
3. ✅ `#filters_submit` i `body.page-offers span.btn` → ten sam bg
4. ✅ Border-radius identyczny (6px dla wszystkich CTA na AP)
5. ✅ Padding konsystentny (14-16px vertical, 24-32px horizontal)
6. ✅ Font-size/letter-spacing unified

## Weryfikacja
```javascript
// DevTools console na /offers:
var btns = Array.from(document.querySelectorAll('.btn, .ap-offer-card__cta'));
btns.map(b => ({
  text: b.textContent.trim().slice(0,30),
  bg: getComputedStyle(b).backgroundColor,
  color: getComputedStyle(b).color
}));
// Sprawdź: primary CTAs mają identyczny bg
```

## Wyjątki (dyskusyjne)
- Destructive action (Anuluj rezerwację, Usuń) — może mieć czerwony
- Ghost button (drugorzędne navigation) — outline/transparent OK jeśli
  kolor (border + text) nadal primary

## Historia
- **AP v1.0-v1.6**: różne kolory przycisków (primary + accent mieszane)
- **AP v1.7 (2026-04-21)**: unification — wszystko `--ido-primary`

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS patch: `AP_CSS_EDYTOR.css` §10 PATCH 2026-04-21 v2
- User feedback: "te kolory były stałe (...) bardzo się różnią"
- Related: instinct 005 (filters_submit brand styling)
