# Lesson 013 — Chrome DevTools MCP: diagnoza ukrytych obrazów (HTTP 200 ale niewidoczne)

**Kontekst:** piekary13 sesja 2026-05-08 v6. Klient kilkukrotnie zgłaszał „zdjęcie hero na home nie działa". Trzy razy próbowałem różnych fixów (CSS reveal, fullpage selector, body.page-index) bez sukcesu.

## Co nie zadziałało (klasyczne metody)

1. **curl URL** → HTTP 200, valid JPEG, 333 KB — obraz JEST.
2. **fetch w przeglądarce** → status 200, content-type image/jpeg, size > 0 — obraz JEST przesłany.
3. **Czytanie HTML/CSS źródła** → wszystko wygląda dobrze.

Mimo to obraz NIE BYŁ WIDOCZNY na live. Marnowałem ~3 tury naprawiając niewłaściwe rzeczy (.pk-reveal-left selectors).

## Co zadziałało: Chrome DevTools MCP `evaluate_script`

Wykonałem na żywej stronie:

```js
const slider = document.querySelector('.parallax-slider');
const cs = getComputedStyle(slider);
return {
  width: slider.getBoundingClientRect().width,
  height: slider.getBoundingClientRect().height,
  display: cs.display,
  visibility: cs.visibility,
  opacity: cs.opacity,
  zIndex: cs.zIndex,  // ← KLUCZOWE
  position: cs.position,
  backgroundImage: cs.backgroundImage,
  transform: cs.transform,
};
```

Output zwrócił `zIndex: "-2"`. Plus walk parent chain pokazał że `.section.parallax` ma `z-index: auto` → bez containing stacking context → ujemny z-index slidera ucieka pod body bg.

**Diagnoza w 30 sekund** zamiast godzin domysłów.

## Reguła JARVIS

**Gdy klient zgłasza "X nie działa" a curl/fetch potwierdza że X istnieje:**
1. NIE zgaduj kolejnych CSS fixów na ślepo
2. NATYCHMIAST użyj Chrome DevTools MCP (lub Playwright MCP)
3. `evaluate_script` — pobierz `getComputedStyle` + `getBoundingClientRect` + parent chain stacking
4. Identyfikuj ROOT CAUSE z prawdziwych danych
5. Zastosuj fix targetowany w przyczynę

## Co sprawdzać w `evaluate_script` dla problemów z widocznością

```js
function diagnose(el) {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    visible: rect.width > 0 && rect.height > 0,
    rect: `${rect.width}x${rect.height}`,
    display: cs.display,
    visibility: cs.visibility,
    opacity: cs.opacity,
    zIndex: cs.zIndex,
    position: cs.position,
    transform: cs.transform,
    overflow: cs.overflow,
    clip: cs.clipPath || cs.clip,
    parentChain: /* walk up, log z-index + position */,
  };
}
```

## Powiązane

- Instinct 052 (parallax-slider z-index trap — odkryty przez tę metodę)
- Pattern `049-mobile-tdd-audit-playwright-pattern.md`
- Lesson `live-verification-before-delivery.md`
