# 050 — MASTER WhatsApp FAB + JS teleport (omijanie position:fixed broken przez transform na ancestor)

## Kiedy stosować

Klient prosi o **floating WhatsApp button** (FAB) na każdej podstronie. Standardowe `position: fixed` MOŻE NIE DZIAŁAĆ jeśli widget jest wewnątrz rodzica z `transform`, `filter`, `perspective` lub `will-change: transform`.

W IdoBooking default13: stopka systemowa (`<div class="footer-contact-add">`, `<div class="footer__contact">`) ma transform — łamie `position: fixed` widgetów wklejonych w globalną stopkę HTML lub w body_top jeśli renderują się obok systemowej stopki.

## Trap (CSS spec)

> Z [W3C spec](https://www.w3.org/TR/css-transforms-1/#transform-rendering): **For elements whose layout is governed by the CSS box model, any value other than `none` for the `transform` property establishes a containing block for `position: fixed` descendants**.

Czyli: dziecko z `position: fixed` wewnątrz rodzica z `transform` traci viewport-relative pozycjonowanie i staje się pozycjonowane WZGLĘDEM TEGO RODZICA (jak `position: absolute`). Konsekwencja: widget nie pływa po prawej stronie ekranu, tylko siedzi w stopce.

## Diagnoza problemu live

```javascript
() => {
  const fab = document.querySelector('.gs-wa-fab');
  if (!fab) return 'Brak FAB';
  const cs = window.getComputedStyle(fab);
  const rect = fab.getBoundingClientRect();
  return {
    position: cs.position,         // 'fixed' (CSS jest OK)
    bottom: cs.bottom,             // '24px' (CSS jest OK)
    rectTop: rect.top,             // 5987 px ❌ (powinno być ~700)
    rectBottom: window.innerHeight - rect.bottom, // ❌ (powinno być 24)
    parentTag: fab.parentElement.tagName,
    parentClass: fab.parentElement.className   // 'footer-contact-add' (BUG)
  };
}
```

Jeśli `rectTop` jest > viewport height — widget jest pozycjonowany względem rodzica (a nie window). To diagnoza.

## Rozwiązanie — JS teleport do `<body>` root

Dodaj inline `<script>` po widgecie który przenosi go z dowolnego rodzica do `<body>` bezpośrednio. Wtedy żaden ancestor z transform nie istnieje (tylko `<html>` → `<body>` → `<a class="gs-wa-fab">`).

### Snippet (HTML + JS razem, jednolinjkowy)

```html
<a href="https://wa.me/{NUMER}" target="_blank" rel="noopener" class="gs-wa-fab" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149..."/></svg></a><script>(function(){var f=document.querySelectorAll(".gs-wa-fab");if(!f.length)return;if(f[0].parentElement!==document.body)document.body.appendChild(f[0]);for(var i=1;i<f.length;i++)f[i].remove();})();</script>
```

### Co robi skrypt
1. `querySelectorAll('.gs-wa-fab')` — znajduje WSZYSTKIE widgety (gdyby klient wkleił dwa razy do różnych pól w panelu)
2. Jeśli pierwszy nie jest w `<body>` → `document.body.appendChild(first)` przenosi go
3. Pozostałe `f[i].remove()` — usuwa duplikaty

**Dedup ważny**: klient może wkleić snippet do globalnej stopki + body_top → dwa widgety w DOM. Skrypt zostawia tylko 1.

## CSS (do gs_ARKUSZ_STYLOW.css)

```css
/* WhatsApp Floating Button */
.gs-wa-fab {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important;
  background: #25D366 !important;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9998 !important;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease, background 0.25s ease !important;
  text-decoration: none !important;
  cursor: pointer !important;
}
.gs-wa-fab svg { width: 32px !important; height: 32px !important; fill: #fff !important; }
.gs-wa-fab:hover { transform: scale(1.08) !important; background: #20BD5A !important; }

/* Pulse animation */
@keyframes gsWaPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15); }
  50% { box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15), 0 0 0 12px rgba(37, 211, 102, 0); }
}
.gs-wa-fab { animation: gsWaPulse 2.4s ease-in-out infinite; }
.gs-wa-fab:hover { animation: none; }

/* Mobile bp */
@media (max-width: 768px) {
  .gs-wa-fab { bottom: 18px !important; right: 16px !important; width: 54px !important; height: 54px !important; }
  .gs-wa-fab svg { width: 28px !important; height: 28px !important; }
}

/* iOS hover fix */
@media (hover: none) {
  .gs-wa-fab:hover { transform: none !important; }
  .gs-wa-fab:active { transform: scale(0.94) !important; }
}

/* Hide pod modal IdoSell */
body.modal-open .gs-wa-fab,
body.has-overlay .gs-wa-fab { display: none !important; }
```

## Deployment paths (IdoBooking)

3 opcje wklejenia HTML, w kolejności preferencji:

1. **Globalna stopka HTML** — Treści → Konfiguracja stopki → pole HTML. Najlepsze: snippet leci na każdej podstronie systemowej (`/offers`, `/contact`, `/book-now`, `/offer/[id]`, txt/* itd.).
2. **Skrypty śledzące / Koniec BODY** — Marketing → Skrypty → Koniec BODY. Per język. Też globalne.
3. **Body_top każdej podstrony** — fallback gdy A/B nie ma. Działa tylko na naszych txt/* podstronach.

JS teleport pracuje w **każdej z 3 opcji** — gdziekolwiek HTML jest renderowany, JS przenosi go do body.

## Common mistakes

- ❌ Wkleić tylko HTML bez JS teleport → widget siedzi w stopce, nie pływa
- ❌ Wkleić CSS bez `!important` → systemowy CSS IdoBooking nadpisuje pozycję
- ❌ Wkleić HTML w wielu miejscach (stopka + body_top) → widzimy 2 widgety. Dedup w JS to rozwiązuje, ale lepiej wkleić raz.
- ❌ `tel:+995 597 934 445` ze spacjami → niektóre przeglądarki źle dialują. Prawidłowo: `wa.me/995597934445` (bez plus, bez spacji).
- ❌ Bez `target="_blank"` + `rel="noopener"` → otwiera się w tym samym tabie zamiast nowym (gorsze UX).

## Klient: GeoStay (grzybek), 2026-05-08

- Numer: +995 597 934 445 → `wa.me/995597934445`
- 15 plików body_top × WhatsApp snippet w każdym (PL/EN/RU × 5 podstron)
- Plus standalone WHATSAPP_FAB.html do globalnej stopki
- CSS w `gs_ARKUSZ_STYLOW.css` — sekcja "PATCH 2026-05-08 — WhatsApp FAB"

## Reference
- W3C transform spec: https://www.w3.org/TR/css-transforms-1/#transform-rendering
- MDN bug discussion: https://developer.mozilla.org/en-US/docs/Web/CSS/transform#values
