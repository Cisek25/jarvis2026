---
name: live-audit-TDD-after-deploy
description: 🔥 Po każdym deploy CSS/HTML/JS na live — JARVIS URUCHAMIA automatyczny audyt w stylu TDD (Test-Driven-Development). Explicit expected vs actual, PASS/FAIL per test, 3 viewporty (desktop 1440 + iPhone 390 + Android 360), pełny zakres podstron. Bez audytu — NIE potwierdzaj "gotowe".
type: instinct
scope: all-clients
trigger: user wkleił CSS/HTML/JS do panelu / user mówi "wklelilem zrób audyt" / user zgłasza problem i chce weryfikacji / przed oddaniem pakietu delivery klientowi
added: 2026-04-23
priority: MANDATORY-AFTER-DEPLOY
source_client: apartamenty-parkowe (client58154) — v1.8.14 audyt live (7 viewportów/URLów × 85 testów)
supersedes: 003-check-live-after-paste (rozszerza o TDD-styl explicit testy)
---

# 🔥 LIVE AUDIT PO DEPLOY — metodologia TDD

## DLACZEGO

Tradycyjnie Jarvis robił "sprawdź czy działa" — jakościowe, niemierzalne,
pomijalne defekty. **TDD-style audit** = każdy wymaganie ma explicit
expected value, testowany na żywo przez Playwright/chrome-devtools MCP,
raportowany PASS/FAIL. Wtedy:

1. Nie pomylę "wygląda dobrze" z "działa poprawnie"
2. Regresje łapię od razu (nowy deploy psujący stare fixy)
3. Dostarczam KLIENTOWI RAPORT, nie "chyba OK"
4. Uczę się na cyfrach (np. "v1.8.14: 66/85 PASS, 3 real bugs")

## KIEDY STOSOWAĆ — 4 TRIGGERY

1. **Po wklejeniu CSS/HTML/JS przez klienta** ("wkliłem, sprawdź")
2. **Przy zgłoszeniu problemu** (nie zgaduj, zmierz)
3. **Przed oddaniem pakietu delivery** (własny self-check)
4. **Po większym refactoringu** (regresje)

## WORKFLOW — 6 KROKÓW

### KROK 1 — Określ test cases (expected values)

Przed odpaleniem playwright, SPISZ explicit expectations. Format:

```
| Element | Expected value | Viewport |
|---|---|---|
| Hero title text | zawiera "apartament" i "rytm" | 1440/390/360 |
| Sticky color | rgb(255, 255, 255) | 390/360 |
| BLIK src | /images/.../5.svg | wszędzie |
| Pagehero subtitle font-size | >= 17px | 390/360 |
```

Bez tego — audit staje się eksploracją, nie testem.

### KROK 2 — Weryfikacja cache / version fingerprint

```javascript
// Czy najnowszy CSS faktycznie trafił na live?
const link = document.querySelector('link[href*="custom.css"]');
const css = await fetch(link.href).then(r => r.text());
return {
  version_query: link.href.match(/v=(\d+)/)?.[1],
  size_KB: Math.round(css.length / 1024),
  has_latest_patch_marker: css.includes('PATCH 2026-XX-XX vX.Y.Z'),
  important_count: (css.match(/!important/g) || []).length,
  escaped_important: (css.match(/\\!important/g) || []).length,  // trap #14c
};
```

Jeśli `has_latest_patch_marker === false` — CSS NIE jest wklejony, przerwij
audit i powiadom klienta.

### KROK 3 — Odpal testy per viewport

3 obowiązkowe viewporty:
- **Desktop 1440×900** — smoke, regresje
- **iPhone 390×844** — touch, flex column, fullpage.js
- **Android 360×800** — mniejszy viewport, różne media queries

Opcjonalne:
- Desktop 1920×1080 (wide monitor)
- iPad 768×1024 (tablet)

Per viewport → wszystkie kluczowe podstrony:
`/`, `/offers`, `/contact`, `/txt/200/O-nas`, `/txt/201/Galeria`,
`/txt/202/Lokalizacja`, `/txt/203/Blog`, `/offer/1/Studio` (pierwsza oferta)

### KROK 4 — Template testów (playwright evaluate)

```javascript
() => new Promise(r => setTimeout(() => {
  const T = [];
  const t = (n, actual, expected, fn) => T.push({
    test: n,
    expected,
    actual,
    status: (fn ? fn(actual, expected) : actual === expected) ? 'PASS' : 'FAIL'
  });

  // KATEGORIE TESTÓW:

  // 1. CONTENT (teksty, URLe, atrybuty)
  t('Hero title zawiera "apartament"', heroTitle?.textContent, 'apartament', (a,e) => a?.includes(e));

  // 2. COMPUTED CSS (kolory, font-size, display, overflow)
  t('Sticky color white', getComputedStyle(sticky).color, 'rgb(255, 255, 255)');
  t('Subtitle font-size >= 17px', parseFloat(getComputedStyle(sub).fontSize), 17, (a) => a >= 17);

  // 3. LAYOUT (rect, offsetHeight, getBoundingClientRect)
  t('Form fields touch 42+', fields.every(f => f.offsetHeight >= 42), true);
  t('Card fits viewport width', card.offsetWidth <= window.innerWidth, true);

  // 4. INTERACTIVITY (click, scroll, focus)
  window.scrollTo(0, 600);
  setTimeout(() => {
    t('Sticky visible after scroll>400', sticky.classList.contains('is-visible'), true);
    r(T);
  }, 500);
}, 1500))
```

### KROK 5 — Raport w formie tabeli

```markdown
## TESTS SUMMARY

| Kategoria | PASS | FAIL | Uwagi |
|---|---|---|---|
| Desktop homepage | 19/20 | 1 | 1 false alarm selektor |
| iPhone 390 | 14/18 | 4 | 2 real bugs, 2 false |
| Android 360 | 9/9 | 0 | — |
| /offers mobile | 12/13 | 1 | false alarm |
| /O-nas mobile | 11/14 | 3 | 2019 nie wkl. + 11px typo |
| **TOTAL** | **65/74** | **9** | **3 real bugs** |

## REAL BUGS (do naprawy)

### BUG #1 — Typography 11px na /txt/*
- Expected: subtitle 19px, narrative 17px
- Actual: 11px (rem × html 10px)
- Root cause: ...
- Fix: v1.8.15 double-class selector

### BUG #2 — ...
```

### KROK 6 — False alarms vs real bugs

NIE każdy FAIL = real bug. Odrzuć:
- **Selektory null** (selektor nie matchuje — mój błąd)
- **Nieistotne elementy** (Google Maps iframe vs Leaflet — zależy od konfiguracji)
- **Mobile niedostępne features** (max-width: none na mobile = OK)

Zostaw tylko bugi które klient widzi jako PROBLEM.

## KOD-TEMPLATE — gotowe bloki do reuse

### A) CSS specificity debugger
```javascript
// Wypisz wszystkie reguły matchujące element + specyficzność
const el = document.querySelector('.ap-pagehero__subtitle');
const rules = [];
for (const sheet of document.styleSheets) {
  try {
    const walker = (list) => {
      for (const rule of list) {
        if (rule.cssRules) walker(rule.cssRules);
        if (rule.selectorText && el.matches(rule.selectorText) && rule.style.fontSize) {
          rules.push({
            sel: rule.selectorText.substring(0, 100),
            size: rule.style.fontSize,
            // ⚠️ UWAGA: rule.style.getPropertyPriority używa 'font-size' (z myślnikiem), NIE 'fontSize'
            imp: rule.style.getPropertyPriority('font-size') === 'important',
            media: rule.parentRule?.conditionText,
          });
        }
      }
    };
    walker(sheet.cssRules);
  } catch (e) {}
}
console.table(rules);
```

### B) Live CSS file verification
```javascript
async function verifyCss(patchMarker) {
  const link = document.querySelector('link[href*="custom.css"]');
  const css = await fetch(link.href).then(r => r.text());
  return {
    version_query: link.href.match(/v=(\d+)/)?.[1],
    size_KB: Math.round(css.length / 1024),
    has_patch: css.includes(patchMarker),
    has_escaped_important: /\\!important/.test(css),  // trap #14c
  };
}
// Użycie: await verifyCss('PATCH 2026-04-23 v1.8.15');
```

### C) Systematic test run
```javascript
async function runAudit(viewports = [[1440,900], [390,844], [360,800]]) {
  const pages = ['/', '/offers', '/contact', '/txt/200/O-nas', '/txt/202/Lokalizacja'];
  const results = {};
  for (const [w, h] of viewports) {
    await page.setViewportSize({ width: w, height: h });
    for (const path of pages) {
      await page.goto('https://SITE' + path);
      // run tests...
      results[`${w}x${h} ${path}`] = /* test results */;
    }
  }
  return results;
}
```

## CZERWONE FLAGI — kiedy przerwać audit

1. **Patch marker NIE w CSS** → klient nie wkleił, poinformuj i przerwij
2. **5+ PASS a realne problemy** → testy są za łatwe, napisz lepsze
3. **`!important` escaped (`\!important`)** → trap #14c, bash heredoc bug
4. **CSS size > 290KB** → zbliżamy się do limitu 320 rules panelu, ostrzeż

## REFERENCJA

- Client: apartamenty-parkowe (client58154), v1.8.14 audyt
- 7 viewportów/URL × 85 testów → 3 real bugs wykryte
  - BUG #1: ONAS_PL nie wklejone (content regression)
  - BUG #2: typography 11px (CSS specificity konflikt — lesson 008)
  - BUG #3: section.parallax overflow hidden (CSS specificity)
- Fix v1.8.15 z double-class + mirror blacklisty :not()

## ZAPAMIĘTAJ JARVIS

**Nie pisz "gotowe" bez audytu TDD.**
**Nie pisz "działa" bez explicit expected/actual.**
**Nie pisz "naprawione" bez FAIL → PASS transition w tabeli.**

Dostarczasz klientowi **MIERZALNY WYNIK**, nie opinię.
