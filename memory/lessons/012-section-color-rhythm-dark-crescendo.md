# Lesson 012 — Section color rhythm: build-up do DARK crescendo przed dark footer

**Data**: 2026-05-05
**Klient**: solidneapartamenty (v1.6.6 patch)
**Severity**: MEDIUM — UX / wizualny narrative

## Problem

User zgłasza: *"stopka wygląda źle, ma pasy takie jakby sekcje nad i pod, te kremowe kolory,
kolory w dolnej części strony mają mieć sens, czyli sekcje mają mieć kolory"*.

Strona ma sekwencję sekcji od góry do dołu:
- sa-section--bg (warm cream #FBF8F4)
- sa-apartments (cream #FBF8F4)
- sa-locations (cream-alt #F6EFE5)
- sa-corp (cream #FBF8F4)
- sa-attractions (cream-alt #F6EFE5)
- sa-final-cta (gradient liliowy #6E5F69 — off-brand)
- footer (dark #2A2226)

Pomiędzy `.sa-final-cta` a `<footer>` był **30px biały pas** (= `padding-bottom: 30px`
wrappera fullpage `.section.fp-auto-height.pb-5` z `bg: #FFFFFF`). Plus body bg cream pod
wrapperem. Tworzyło to wizualnie **3 nakładające się "pasy"** wokół footera.

User percepcja: footer wygląda "jakby był osobno", "kremowe pasy nad i pod".

## Root cause

Brak świadomej kolorystycznej narracji w sekwencji końcowych sekcji. CTA (sa-final-cta) miało
gradient grey-purple (`#6E5F69 → primary → secondary`) — wyglądał odbarwiony/szary, NIE jak
finałowy crescendo brand. Plus system fullpage.js dodawał padding white między CTA a footer.

## Reguła (design-system principle)

**Color narrative dla strony głównej** (i każdej długiej landing page):

Sekcje powinny **eskalować kolorystycznie** ku finałowi. Im niżej w stronie, tym bardziej
"wzbudzający" kolor — kończąc się **DARK crescendo CTA** który **łączy się z dark footer**
jako jeden wizualny blok.

### Pattern (dla brand z light cream tones + dark accent):

| Sekcja | Bg | Rola |
|---|---|---|
| #1 Hero | photo / overlay | impact opening |
| #2 About | cream light | welcome, czytelność |
| #3 Featured | cream light | kontynuacja |
| #4 Locations/Map | cream alt (delikatnie ciemniejszy) | transition |
| #5 Trust/Stats | cream light | powrót |
| #6 Attractions | **deeper cream** (np. #F0E6D6, ~5% ciemniejszy) | **build-up** |
| **#7 Final CTA** | **DARK gradient brand** (np. `#3A2F33 → #2A2226 → #1F1A1D`) | **CRESCENDO** |
| **#8 Footer** | **DARK** (np. #2A2226) | **continuation** |

### Implementacja (CSS)

```css
/* Build-up before crescendo */
.sa-attractions { background: #F0E6D6 !important; }

/* Final CTA — dark crescendo */
.sa-final-cta {
  background: linear-gradient(180deg, #3A2F33 0%, var(--sa-text-dark) 60%, #1F1A1D 100%) !important;
  /* end color = footer bg = seamless transition */
}

/* Footer flush, no border-top seam */
html body.page-index footer {
  margin-top: 0 !important;
  border-top: none !important;
}

/* Kill any white stripe from system fullpage wrapper */
body.page-index .section.fp-auto-height.pb-5 {
  padding-bottom: 0 !important;
}
```

### Verification

```js
// W DevTools Console:
const sections = document.querySelectorAll('section[class*="sa-section"]');
[...sections].map(s => ({
  cls: s.className.match(/sa-(section--bg|apartments|locations|corp|attractions|final-cta)/)?.[0],
  bg: getComputedStyle(s).backgroundColor
}));
// Expected: rytm light/light/alt/light/deeper/dark
```

## Anty-pattern (czego unikać)

❌ Wszystkie sekcje na tej samej cream bg (monotonia, brak narracji)
❌ Final CTA off-brand color (np. purple gdy brand jest pink/forest)
❌ Hard transition cream → dark bez build-up sekcji ciemniejszej
❌ White/cream stripes między CTA a footerem (system fullpage padding)
❌ Footer z border-top accent line (emphasizuje seam)

## Detekcja kiedy stosować

Triggers:
- Klient zgłasza "stopka wygląda osobno", "kremowe pasy", "footer odstaje"
- Strona główna z 5+ sekcjami z podobnym bg-color
- Final CTA section istnieje ale wygląda jak "kolejna sekcja", nie jak finałowy crescendo
- Footer dark ale sekcja przed nim jest jasna → brak transition

## Powiązane

- Trap #6 (CLAUDE.md): footer-contact-baner ::before pseudo-element
- Trap #18 (CLAUDE.md): subpage full-width override
- Instinct 037: page-index fullwidth + system hides
- Lesson: solidneapartamenty patch v1.6.6 (sekcja 50 CSS)
