---
name: global-typography-scale
description: Na IdoBooking default13 czcionki są za małe. Zawsze skaluj body do 17px bazowo + bigger wartości dla kart atrakcji, blog-card excerpt, stopka kicker (co najmniej 0.85rem, nie 0.72).
type: instinct
scope: all-clients
trigger: audyt UX / klient zgłasza 'za mała czcionka' / budowa nowej strony
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "Wszystkie czcionki sa nadal za małe np. na lokalizacj, np, w stopce niżej: REZERWACJA ledwo to widac"
---

# Instynkt: Czcionki globalnie większe

## Problem
Domyślny CSS JARVIS/IdoBooking ma:
- `body { font-size: 16px }` — OK dla desktop, słabo czytelne na mobile
- `.ap-attraction-card__desc { font-size: 0.95rem }` (~15px) — za mało
- `.ap-kicker { font-size: 0.72rem }` (~11.5px) — ledwo widoczne
- `.ap-blog-card__excerpt { font-size: 0.95rem }` — za mało

Klienci (AP 2026-04-21) zgłaszają: "czcionki są za małe", "REZERWACJA
ledwo to widać". Średni wiek gościa apartamentów = 35-55 lat — czyta okularami.

## Reguła — minimum per typ elementu

| Element | Min font-size |
|---------|---------------|
| body (bazowy) | 17px |
| Paragraph w content | 1.05rem (17-18px) |
| Card description (attraction, blog excerpt) | 1.0rem (17px) |
| Card title H3 | 1.4-1.55rem |
| Kicker (uppercase label) | 0.85rem (14px) — NIE mniejsze |
| Distance badge | 0.78rem (12.5px) z letter-spacing 2px |
| Footer kicker "REZERWACJA" | 1rem (16px) + letter-spacing 3px |
| Nav items | 0.92rem z letter-spacing 1.2px |
| Pagehero subtitle | 1.15rem |
| Pagehero H1 | clamp(2.2rem, 4vw, 3.2rem) |

## Template (copy-paste do CSS klienta)

```css
/* GLOBAL TYPOGRAPHY SCALE-UP */
body, body.default13 {
  font-size: 17px !important;
  line-height: 1.75 !important;
}

body.page-txt p,
body.page-offer p,
.{prefix}-narrative p,
.{prefix}-pagehero__subtitle,
.{prefix}-attraction-card__desc,
.{prefix}-blog-card__excerpt,
.{prefix}-attractions p {
  font-size: 1.05rem !important;
  line-height: 1.75 !important;
}

.{prefix}-attraction-card--media .{prefix}-attraction-card__name {
  font-size: 1.55rem !important;
}
.{prefix}-attraction-card--media .{prefix}-attraction-card__desc {
  font-size: 1.0rem !important;
  line-height: 1.7 !important;
}
.{prefix}-attraction-card--media .{prefix}-attraction-card__distance {
  font-size: 0.78rem !important;
  letter-spacing: 2px !important;
  padding: 7px 14px !important;
}

.{prefix}-kicker,
.{prefix}-pagehero__kicker,
.{prefix}-narrative__kicker,
.{prefix}-blog-card__date,
.{prefix}-final-cta .{prefix}-kicker {
  font-size: 0.85rem !important;
  letter-spacing: 2.5px !important;
  font-weight: 700 !important;
}

.{prefix}-final-cta .{prefix}-kicker {
  font-size: 1rem !important;
  letter-spacing: 3px !important;
  color: #CDE6D6 !important;  /* jasno-zielony, kontrast z ciemnym CTA bg */
  opacity: 1 !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.{prefix}-blog-card__title { font-size: 1.5rem !important; line-height: 1.3 !important; }
.{prefix}-blog-card__excerpt { font-size: 1rem !important; line-height: 1.7 !important; }
.{prefix}-blog-card__date { font-size: 0.8rem !important; letter-spacing: 2px !important; }

.{prefix}-pagehero__subtitle { font-size: 1.15rem !important; line-height: 1.75 !important; }
```

## Dlaczego NIE mniej
- **WCAG 2.1 AA**: body text min 16px, kicker/meta min 14px
- **Wiek audytorium**: apartamenty/B&B = 35-55+ (dostępność)
- **Mobile device scaling**: użytkownik na 390px potrzebuje większej
  czcionki niż na 1440px, ale my robimy rem-based więc skaluje się razem

## Footer kicker — specjalny case
Sekcja `.ap-final-cta` ma ciemne tło (brand primary dark). Kicker
był #A8E6B8 (pastel green) z opacity 0.7 → na ciemnym tle = nieczytelny.
**Fix**: jasniejszy #CDE6D6, opacity 1, letter-spacing 3px, text-shadow.

## Weryfikacja
```javascript
// DevTools console:
getComputedStyle(document.body).fontSize  // powinno być "17px"
Array.from(document.querySelectorAll('.ap-kicker')).map(el => getComputedStyle(el).fontSize);
// żadne <13.6px (=0.85rem)
```

## Referencja
- Client: apartamenty-parkowe (client58154)
- CSS patch: `AP_CSS_EDYTOR.css` §8 PATCH 2026-04-21 v2
- User feedback: "czcionki sa nadal za małe + REZERWACJA ledwo to widac"
