# Instinct 032 — Linki do polityk (cookies/terms/privacy) → modal iframe zamiast nowej karty

## Kontekst odkrycia
2026-04-23, klient EcoCamping (client57820).
User uwaga: linki "Polityka prywatności", "Regulamin", "Cookies" w stopce otwierały się w nowej karcie jako bezstylowe strony IdoBooking (`?module=cookies`, `?module=terms`) — brzydko i out-of-brand.

## Zasada
**Linki do systemowych polityk IdoBooking ZAWSZE przechwytuj i otwieraj w modal popup z iframe** zamiast nowej karty. User nie wychodzi ze strony, layout brandowany.

## Selektor linków do polityk
```js
'a[href*="module=cookies"], ' +
'a[href*="module=terms"], ' +
'a[href*="module=privacy"], ' +
'a[href*="/pl/cookies"], ' +
'a[href*="/pl/regulamin"], ' +
'a[href*="/pl/polityka"], ' +
'a[href*="/en/cookies"], ' +
'a[href*="/en/terms"], ' +
'a[href*="/en/privacy"]'
```

(Dostosuj ścieżki per klient — niektórzy mają `/txt/{ID}/Polityka-prywatnosci`.)

## CSS modalu (wzorzec)
```css
.{prefix}-policy-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 99999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.{prefix}-policy-modal--active { display: flex; }

.{prefix}-policy-modal__box {
    width: min(900px, 100%);
    height: min(700px, 90vh);
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 80px rgba(0,0,0,0.3);
}

.{prefix}-policy-modal__close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border: none;
    background: var(--brand-dark);
    color: #fff;
    border-radius: 50%;
    font-size: 22px;
    cursor: pointer;
    z-index: 2;
}

.{prefix}-policy-modal__iframe {
    width: 100%;
    height: 100%;
    border: 0;
}
```

## JS (wklejać do body_bottom — NIE body_top, trap #34!)
```js
(function(){
  function createPolicyModal(){
    if (document.getElementById('policyModal')) return;
    var m = document.createElement('div');
    m.id = 'policyModal';
    m.className = '{prefix}-policy-modal';
    m.innerHTML =
      '<div class="{prefix}-policy-modal__box">' +
        '<button type="button" class="{prefix}-policy-modal__close" aria-label="Zamknij">×</button>' +
        '<iframe class="{prefix}-policy-modal__iframe" src="about:blank"></iframe>' +
      '</div>';
    document.body.appendChild(m);

    m.addEventListener('click', function(e){
      if (e.target === m || e.target.classList.contains('{prefix}-policy-modal__close')){
        m.classList.remove('{prefix}-policy-modal--active');
        document.body.style.overflow = '';
        m.querySelector('iframe').src = 'about:blank';
      }
    });
  }

  document.addEventListener('click', function(e){
    var link = e.target.closest(
      'a[href*="module=cookies"], a[href*="module=terms"], ' +
      'a[href*="module=privacy"], a[href*="regulamin"], ' +
      'a[href*="polityka"], a[href*="cookies"]'
    );
    if (!link) return;
    // nie przechwytuj linków otwieranych w nowej karcie celowo (target="_blank" przez ctrl-click itp.)
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    createPolicyModal();
    var modal = document.getElementById('policyModal');
    modal.querySelector('iframe').setAttribute('src', link.href);
    modal.classList.add('{prefix}-policy-modal--active');
    document.body.style.overflow = 'hidden';
  }, true);
})();
```

## Kiedy stosować
- **Każdy klient IdoBooking** — poprawa UX stopki, trzymanie usera na stronie
- **Zawsze łącz z trap #34** — skrypt do body_bottom/Koniec BODY (nie body_top)
- **Wersje językowe**: jeden skrypt obsługuje wszystkie języki (instinct 028)

## Referencja
- EcoCamping: `clients/ecocamping/DO_WKLEJENIA/CSS_EDYTOR.css` (sekcja `.ec-policy-modal`)
- EcoCamping: `clients/ecocamping/DO_WKLEJENIA/GLOWNA_PL__body_bottom.html` §9
