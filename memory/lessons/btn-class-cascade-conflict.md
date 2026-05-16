# Bug: System utility classes cascading konflikt

**Data**: 2026-05-06
**Klient**: piekary13 — silnik rezerwacji v10
**Severity**: medium (visual artifact, nie bug funkcjonalny)

## Symptom

User screenshot pokazywał że "FILTRY tile" w search bar wygląda jak osobny "wyróżniony" box z subtle ramką + box-shadow. Cały search bar miał uniform cream tle, ale tile FILTRY wyróżniał się.

## Root cause

DOM:
```html
<div class="col-lg-3 filterFilter">
  <a class="btn-modal-link btn-big">FILTRY</a>
</div>
```

`<a>` ma DWA system utility classes: `.btn-modal-link` (modal trigger button) + `.btn-big` (large variant).

Mój v9 §4 reguła stylowała wszystkie `.btn-big` jako primary CTA:
```css
.btn,
.btn-primary,
.btn-default,
.btn-big,                                /* ← TUTAJ */
... {
  background: var(--pk-burgundy) !important;
  box-shadow: 0 2px 8px rgba(114, 47, 55, 0.15);
  padding: 14px 28px !important;
  min-height: 48px !important;
  ...
}
```

Mój v9 §4b miał OVERRIDE dla `.btn-modal-link`:
```css
.btn-mobile-loggedin,
.btn-modal-link,
.show-login-form {
  background: transparent !important;
  border: 0 !important;
  color: var(--pk-burgundy) !important;
}
```

Override zerował **bg + border + color**, ale **NIE box-shadow ani padding ani min-height**. Te wartości dziedziczyły z `.btn-big` reguły.

Plus equal specificity (oba 0,1,0) → cascade order rozstrzygał.

## Visual effect

`<a class="btn-modal-link btn-big">FILTRY</a>`:
- bg: transparent (override OK) ✓
- border: 0 (override OK) ✓
- box-shadow: `rgba(114, 47, 55, 0.15) 0px 2px 8px` ❌ z `.btn-big`
- padding: `14px 28px` ❌ z `.btn-big`
- min-height: `48px` ❌ z `.btn-big`

= drobny burgundy halo cieniowy → user widział jako "wyróżniona ramka".

## Fix

Override §4b z **wyższą specificity** + dopisanie pozostałych właściwości:

```css
body a.btn-modal-link,
body a.btn-modal-link.btn-big,
body .btn-modal-link.btn-big {
  box-shadow: none !important;       /* NEW — wymazuje §4 */
  padding: 8px 16px !important;       /* NEW — override 14px 28px */
  min-height: auto !important;        /* NEW — override 48px */
  height: auto !important;
  background: transparent !important;
  border: 0 !important;
}
```

Specificity 0,2,2 vs §4 0,1,0 — wygrywa. Zerowane wszystkie 6 właściwości naraz.

## General principle

**Gdy element ma multiple utility classes** (np. `.btn-modal-link.btn-big`), reguły dla każdej klasy sumują się przez cascade. Override musi:

1. Targetować specifically (np. `.btn-modal-link.btn-big`, nie tylko `.btn-modal-link`)
2. Mieć WYŻSZĄ specificity niż każda z reguł utility
3. Wyzerować WSZYSTKIE właściwości wnoszone przez utility (nie tylko bg/color)

## Diagnoza MCP

```javascript
// Find all matched rules dla elementu — pokazuje wszystkie konflikty
const filtry = document.querySelector('a.btn-modal-link');
const rules = [];
for (const ss of document.styleSheets) {
  try {
    for (const r of ss.cssRules || []) {
      if (r.selectorText && r.style && (r.style.boxShadow || r.style.padding)) {
        if (filtry.matches(r.selectorText) ||
            r.selectorText.split(',').some(s => filtry.matches(s.trim()))) {
          rules.push({
            sheet: ss.href ? ss.href.slice(-30) : 'inline',
            sel: r.selectorText.slice(0, 100),
            boxShadow: r.style.boxShadow,
            padding: r.style.padding,
            important: r.style.getPropertyPriority('padding')
          });
        }
      }
    }
  } catch(e) {}
}
return rules;
```

Pokazuje **wszystkie matched rules** + ich shadow/padding values + specificity context. Łatwo zobaczyć który rule wygrywa.

## Anti-pattern

```css
/* ❌ Zerowanie tylko bg/color, ignorując shadow/padding/min-height */
.btn-modal-link {
  background: transparent !important;
  color: red !important;
  /* ALE .btn-big shadow/padding pozostaje */
}
```

```css
/* ✅ Pełen override z wyższą specificity */
body .btn-modal-link.btn-big {
  background: transparent !important;
  color: red !important;
  box-shadow: none !important;
  padding: 8px 16px !important;
  min-height: auto !important;
  height: auto !important;
}
```

## Kiedy szczególnie uważać

- IdoBooking system utility classes: `.btn`, `.btn-big`, `.btn-primary`, `.btn-grenade`, `.btn-green`, `.btn-modal-link`, `.btn-mobile-*`, `.btn-aside-*`, `.btn-nav*`, `.btn-currency`
- Bootstrap utility classes: `.col-*`, `.row`, `.container`, `.text-center`
- Combined: `<a class="btn btn-big btn-modal-link">` ma 3 reguł.

## Referencje

- Sesja piekary13 v9-v10 — fix dla FILTRY
- Plik: `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css` §4b
- Instinct 042 (specificity escalation) — workflow gdy konflikt
- Instinct 041 (MCP audit) — diagnoza matched rules
