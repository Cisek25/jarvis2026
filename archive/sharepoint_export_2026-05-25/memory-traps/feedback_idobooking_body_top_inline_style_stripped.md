---
name: IdoBooking body_top — inline style="" wycinany przez CMS sanitizer
description: Atrybut style="" w HTML wklejanym jako body_top jest usuwany przez WAF/sanitizer IdoBooking. Reguły zewnątrz arkusza stylów + klasa modyfikator = bezpieczne podejście.
type: feedback
originSessionId: fairrentals-2026-05-19
---
# Problem

Wklejam do panelu IdoBooking body_top zawierający np.:

```html
<section class="fr-page-hero" style="background-image: url('https://...');">
  ...
</section>
```

Po save panel "zaakceptuje" wklejenie, ale przy renderowaniu strony live:
- atrybut `style=""` jest USUNIĘTY z markup
- klasa pozostaje (albo czasem przywracana do default `--solid` w niektórych przypadkach)
- background-image nie ładuje się, baner jest pusty

To NIE jest cache — to faktyczna transformacja przez sanitizer/WAF na zapisie albo na odczycie.

Przypadek Fair Rentals v1.65 (atrakcje hero):
- Wkleiłem `<section class="fr-page-hero" style="background-image: url('.../0/0/7.jpg');">`
- Live page rendered `<section class="fr-page-hero fr-page-hero--solid">` — sanitizer zarówno wyciął style JAK i przywrócił klasę `--solid`

Powiązane trapy:
- `feedback_no_emoji_client_code.md` — emojis też wycinane przez WAF
- IdoBooking custom.css specificity war (TRAP #31)

# Detection

Jak sprawdzić:
```bash
# Pobierz live page i sprawdź markup
curl -sL -A "Mozilla/5.0" "https://clientXXXXX.idobooking.com/txt/200/Page" | grep -E 'class="my-class[^"]*"' | head -3

# Czy inline style przeszedł:
curl -sL "..." | grep "background-image" | head -3
```

Jeśli `style="background-image:..."` zniknął z DOM live = sanitizer wyciął.

# Fix

**ZAWSZE używaj klas CSS modyfikatorów zamiast inline style w body_top.**

❌ ŹLE (inline style w body_top):
```html
<section class="fr-page-hero" style="background-image: url('https://example.com/photo.jpg');">
```

✅ DOBRZE (klasa CSS + reguła w arkuszu):
```html
<!-- body_top: -->
<section class="fr-page-hero fr-page-hero--attractions">
```

```css
/* arkusz stylów: */
html body .fr-page-hero--attractions {
  background-image: url('https://example.com/photo.jpg') !important;
  background-size: cover !important;
  background-position: center center !important;
}
```

Dlaczego działa:
- Body_top zawiera TYLKO klasy (statyczne, semantyczne) — sanitizer nie ma co wyciąć
- Arkusz stylów ma swobodne URL w `url(...)` — sanitizer nie tnie content arkusza CSS
- Klasy survive sanitizer (klasa to whitelisted atrybut)

# Inne atrybuty które MOGĄ być wycinane

Test każdy z osobna. Podejrzane:
- `style=""` (potwierdzone)
- `onclick=""`, `onload=""` (event handlers — XSS, na pewno wycinane)
- `data-*=""` (niepewne, raczej zachowane)
- `src="data:..."` base64 (możliwe że wycinane)
- `srcset=""` (niepewne)

Zawsze sprawdź live po wklejeniu czy atrybut jest w DOM.

# Workaround dla dynamicznego BG (gdy chcesz różne BG per strona)

Opcja A: każda strona = oddzielna klasa modyfikator + reguła w CSS  
Opcja B: JS w body_bottom ustawia `element.style.backgroundImage` po DOMContentLoaded  
  (JS-set inline style nie jest wycinany, sanitizer nie czyta DOM po runtime)

```html
<!-- body_top -->
<section class="fr-page-hero fr-page-hero--js-bg" data-bg="https://.../photo.jpg">

<!-- body_bottom -->
<script>
  document.querySelectorAll('[data-bg]').forEach(el => {
    el.style.backgroundImage = `url('${el.dataset.bg}')`;
  });
</script>
```

# Reference

Fair Rentals v1.65 — hero baner atrakcji nie wyświetlał się mimo inline `style="background-image: url(...)"`. Fix przez dodanie klasy `.fr-page-hero--attractions` + reguła w `FR_ARKUSZ_STYLOW.css` linia ~5292.
