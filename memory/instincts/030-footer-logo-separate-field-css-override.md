# Instinct 030 — Stopka IdoBooking ma WŁASNY logo osobno od headera → nadpisz w CSS

## Kontekst odkrycia
2026-04-23, klient SORS (Eagle Tower Benidorm, client51651).
User: "logo w stopce musisz nadpisać".

W panelu IdoBooking wgrano nowe logo w nagłówku (`/images/owner/wideLogo.png`), ale stopka dalej pokazywała STARY logotyp z templatki CMS:
- **Header**: `<img src="/images/owner/wideLogo.png?v={ver}">` (150×100, naturalne 160px) — faktyczne logo klienta
- **Footer**: `<img src="/data/frontpage/template/pl/files/cms/logo.svg">` — starszy systemowy plik z templatki

User nie chciał/nie umiał podmienić pola logotypu stopki w panelu — potrzebny override CSS.

## Zasada
**Stopka IdoBooking (`<a class="footer-contact__logo">`) ma osobne pole w panelu** — pliki nie są współdzielone z nagłówkiem. Jeśli klient wgrał nowe logo tylko do headera, stopka dalej pokazuje:
- `/data/frontpage/template/{lang}/files/cms/logo.svg` (z templatki)
- lub ostatnio uploadowany przez panel plik (inny niż header)

## Workflow diagnozy
```js
// chrome-devtools evaluate_script
document.querySelectorAll('header img, .navbar-brand img').forEach(el =>
  console.log('HEADER:', el.src || el.dataset.src));
document.querySelectorAll('.footer-contact__logo img').forEach(el =>
  console.log('FOOTER:', el.src || el.dataset.src));
```
Jeśli src-y różne → override w CSS.

## Override CSS (wzorzec)
```css
/* FOOTER LOGO OVERRIDE — ujednolicenie z headerem */
.footer-contact__logo img { display: none !important; }

.footer-contact__logo {
    display: inline-block !important;
    width: 180px;
    height: 110px;
    background-image: url('/images/owner/wideLogo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    vertical-align: middle;
}

@media (max-width: 768px) {
    .footer-contact__logo {
        width: 150px;
        height: 90px;
    }
}
```

**Dlaczego `<img>` ukrywamy a nie podmieniamy src?** Bo IdoBooking lazy-loadowałby go ponownie przy przeładowaniu (atrybut `data-src` nadpisany z serwera). `background-image` na `<a>` jest stabilny.

## Kiedy stosować
- Klient zgłasza "w stopce inne logo niż w nagłówku"
- Audyt live: `footer-contact__logo img src` ≠ `navbar-brand img src`
- Zmiana brandingu w połowie projektu (header uploaded, footer zapomniany)

## Alternatywa (tylko jeśli klient sam chce)
Panel IdoBooking → **Wygląd → Logo** — sprawdź czy jest osobne pole "Logo stopki". Jeśli tak, polec klientowi wgranie tam tego samego pliku. W praktyce szybciej → CSS override.

## Źródło URL logo
Zawsze bierz z live `document.querySelector('.navbar-brand img').src` — może być `/images/owner/wideLogo.png` lub własny path klienta. **Nie zgaduj**.
