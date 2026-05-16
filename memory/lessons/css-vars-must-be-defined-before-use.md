---
name: css-vars-must-be-defined-before-use
description: `var(--fr-dark)` resolves do EMPTY STRING jeśli `--fr-dark` nie jest zdefiniowane w :root. Background ignoruje regułę → element zostaje z parent bg. Zawsze sprawdź czy zmienna jest defined zanim użyjesz w CSS — szczególnie po refactoringu palette nazewnictwa.
type: lesson
scope: all-clients
severity: medium
trigger: dodajesz `style="background: var(--fr-X);"` lub `color: var(--fr-X)` → element nie ma oczekiwanego koloru / renderuje się z parent background
added: 2026-05-15
source_client: fairrentals — sesja 15 Sprint C, sekcja stats "O nas" miała tło CREAM zamiast DARK mimo `<section style="background: var(--fr-dark);">`
related: instinct 015 (zero hardcoded fallback), lesson idobooking-css-vars-default13
---

# Lekcja: Undefined CSS var → silent fail (background stays parent)

## Symptom

Klient zgłasza: "**Na podstronie O nas ledwo widać napisów, jak białe na kremowym tle, zmień kolor**"

Sekcja stats (`<section class="fr-narrative" style="background: var(--fr-dark);">` z labels w `rgba(255,255,255,0.85)`) renderowała się z **białymi labels na CREAM tle** zamiast **białe na DARK**.

## Diagnoza

DevTools inspect:
```javascript
const root = getComputedStyle(document.documentElement);
const frDark = root.getPropertyValue('--fr-dark');
// Result: "" (EMPTY STRING)

const frBgAlt = root.getPropertyValue('--fr-bg-alt');
// Result: "#F4ECE2"
```

**`--fr-dark` był NIE zdefiniowany w :root.** `var(--fr-dark)` resolves do empty value. `background: ;` to invalid → ignored → element dziedziczy parent background (cream z `--fr-bg-alt`).

## Root cause

CSS `:root` w FR_ARKUSZ_STYLOW.css zawierał:
```css
:root {
  --fr-primary: #E2D700;
  --fr-cream: #F0EAE0;
  --fr-bg: #FAF7F2;
  --fr-bg-alt: #F4ECE2;
  --fr-text-dark: #0F0F0E;
  --fr-text-body: #3F3A35;
  --fr-text-muted: #7A736B;
  /* NIE było --fr-dark, --fr-dark-deep, --fr-primary-dark */
}
```

W komponencie nowo dodanym używałem `var(--fr-dark)` — pewnie myśląc że jest standardowa nazwa. NIE BYŁO. Browser silently fail.

## Fix

Dodać brakujące zmienne do `:root`:

```css
:root {
  --fr-primary: #E2D700;
  --fr-text-dark: #0F0F0E;
  /* ... istniejące ... */
  
  /* Dark theme colors — używane w sekcjach z ciemnym tłem */
  --fr-dark: #0F0F0E;
  --fr-dark-deep: #050505;
  --fr-primary-dark: #806C00;  /* gold deep — AA contrast na cream tle */
}
```

Plus dla robustness — używaj fallback w `var()`:
```css
/* DOBRE — fallback gdy zmienna nie defined */
background: var(--fr-dark, #0F0F0E) !important;
color: var(--fr-text-dark, #0F0F0E) !important;

/* ZŁE — bez fallback, silent fail */
background: var(--fr-dark);
```

## Dodatkowa lekcja — modifier zamiast inline style

Inline style `<section style="background: var(--fr-dark);">` w HTML body_top:
1. Łatwo zapomnieć
2. Trudno debug (DevTools pokaże `background:` empty)
3. Hard-coded — nie skaluje (np. dark mode preferencje)

Lepiej dodać **modifier klasę BEM**:
```html
<!-- ZAMIAST inline style: -->
<section class="fr-narrative fr-narrative--dark">

<!-- CSS dla modifier: -->
.fr-narrative.fr-narrative--dark {
  background: var(--fr-dark, #0F0F0E) !important;
  color: var(--fr-cream, #F0EAE0) !important;
}

.fr-narrative--dark .fr-about__stat-label {
  color: rgba(240, 234, 224, 0.88) !important;
}
```

Plus DODATKOWO: dla default light sections automatic dark text:
```css
/* Auto-contrast — gdy parent nie dark, force dark text */
.fr-narrative:not(.fr-narrative--dark) .fr-about__stat-label {
  color: rgba(15, 15, 14, 0.78) !important;
}
```

Tak nawet jeśli klient zapomni dodać `--dark` modifier, labels będą ciemne na jasnym tle → czytelne.

## Workflow gdy element nie ma oczekiwanego koloru

```javascript
// 1. Sprawdź computed style
const el = document.querySelector('.your-section');
const cs = getComputedStyle(el);
console.log('bg:', cs.backgroundColor);

// 2. Sprawdź czy używana zmienna jest defined
const root = getComputedStyle(document.documentElement);
console.log('--fr-dark:', root.getPropertyValue('--fr-dark'));
// Jeśli pusto → zmienna NIE defined

// 3. Sprawdź wszystkie zmienne dla pewności
const allVars = [];
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (rule.style?.cssText.includes('--')) {
        allVars.push(rule.cssText.match(/--[a-z-]+/g));
      }
    }
  } catch(e) {}
}
console.log('Defined vars:', [...new Set(allVars.flat())]);
```

## Prevention

1. **Naming convention check**: gdy używasz `var(--fr-X)`, GREP w CSS file żeby zobaczyć czy `--fr-X` jest defined.
2. **Always fallback**: `var(--fr-X, #fallback)` — jeśli zmienna missing, fallback zadziała.
3. **Modifier klasy zamiast inline style**: cleaner + debuggable + scalable.
4. **Auto-contrast pattern**: dla każdej `--dark` section dodaj `:not()` reverse rule dla `--light` default.

## Referencje

- Source client: fairrentals — Sprint C v1.32, sekcja stats nie renderowała się z dark bg
- Fix: §104a + dodane vars w :root (FR_ARKUSZ_STYLOW.css)
- Plus refactor: `style="background: var(--fr-dark);"` → `class="fr-narrative--dark"` w O_NAS_PL/EN/DE
- Related instincts: 015 (zero hardcoded fallback — ale TUTAJ fallback w var() jest OK)
- Related lessons: idobooking-css-vars-default13
