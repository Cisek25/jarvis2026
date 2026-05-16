---
name: Drone video YouTube embed with auto-hide placeholder
description: Klienci chcący wideo (z drona, prezentacyjne) na stronie głównej IdoBooking — zawsze YouTube embed (nie upload), z placeholder ID YOUR_VIDEO_ID i JS auto-hide
type: feedback
---

## Zasada

**Panel IdoSell nie ma sensownego uploadu wideo** (limit ~10 MB, brak transkodowania, jednoplikowy). Wideo z drona (typowo 30-200 MB, MP4/MOV) bezpośrednio nie pójdzie. **Domyślne rozwiązanie: YouTube embed.**

**Why:** YouTube ma darmowe streamowanie, transkoder na każde urządzenie, lazy-load, brak konfliktu z fullpage.js, brak hostingu po stronie klienta. Vimeo działa identycznie (analogiczny iframe), ale YouTube jest standardem znanym każdemu klientowi.

## How to apply

### 1. HTML — sekcja `.ap-video` z placeholder ID

```html
<section class="ap-video" id="ap-drone-video" data-ap-video-id="YOUR_VIDEO_ID">
  <div class="ap-video__inner ap-reveal">
    <div class="ap-video__header">
      <span class="ap-kicker">Z LOTU PTAKA</span>
      <h2>Tytuł <em>akcent</em></h2>
      <span class="ap-heading-rule"></span>
      <p>Krótki opis.</p>
    </div>
    <div class="ap-video__frame">
      <iframe
        src="https://www.youtube-nocookie.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1"
        title="Film"
        loading="lazy"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin">
      </iframe>
    </div>
  </div>
</section>
```

**Kluczowe:**
- `data-ap-video-id="YOUR_VIDEO_ID"` — placeholder, JS sprawdza tę wartość
- `youtube-nocookie.com/embed/...` — domena privacy-enhanced (mniej cookies, lepiej dla RODO)
- `rel=0` (no related videos) + `modestbranding=1` (no YouTube logo)
- `loading="lazy"` — nie ładuje iframe dopóki user nie doscrolluje

### 2. CSS — wrapper z aspect-ratio 16:9

```css
.ap-video__frame {
  position: relative;
  padding-top: 56.25%;     /* 16:9 = 9/16 = 0.5625 */
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
  background: #000;
}
.ap-video__frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```

### 3. JS — auto-hide gdy placeholder

```js
function initDroneVideo() {
  var section = document.getElementById('ap-drone-video');
  if (!section) return;
  var vid = section.getAttribute('data-ap-video-id');
  if (!vid || vid === 'YOUR_VIDEO_ID' || vid.length < 5) {
    section.style.display = 'none';
    return;
  }
  // Podmień iframe src jeśli klient wkleił swój ID w data attr (nie w iframe)
  var iframe = section.querySelector('iframe');
  if (iframe && iframe.src.indexOf('YOUR_VIDEO_ID') > -1) {
    iframe.src = iframe.src.replace(/YOUR_VIDEO_ID/g, vid);
  }
}
```

### 4. Komunikacja z klientem

W mailu/instrukcji:
> "Proszę wgrać film na YouTube (publiczny lub niepubliczny — dostępny tylko z linkiem), a następnie podesłać link. Resztę zrobimy."

**Nie pisz instrukcji jak klient ma sam podmienić ID** — to nasz job. Klient daje link, my w 30 sekund podmieniamy `YOUR_VIDEO_ID` na faktyczne ID i wysyłamy gotowy plik z powrotem.

**Wyjątek:** klient ma własnego copywritera/admina i prosi wprost o samodzielne edycje — wtedy zgodnie z instinct 030 piszemy pełną instrukcję.

## Wskazówki

- **Sekcję umieszczaj POD hero, nie zamiast.** Hero z dużym zdjęciem ładuje się instant, video opóźnia LCP. Lepsze SEO/Lighthouse.
- **Dopóki ID nie podane — sekcja jest ukryta automatycznie.** Klient nigdy nie widzi pustego kwadratu ani błędu.
- **Vimeo zamiast YouTube:** zmień src na `https://player.vimeo.com/video/{ID}?dnt=1` i `allow="autoplay; fullscreen; picture-in-picture"`.

## Referencja

Pierwszy użytek: AP v1.9.0 (2026-05-04, klient Ewa Pokładecka prosiła o video drona zamiast hero zdjęcia).
- HTML: `clients/apartamenty-parkowe/DO_WKLEJENIA/GLOWNA_PL__cms.html` — sekcja `<section class="ap-video">`
- CSS: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` — patch v1.9.0 §(1)
- JS: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` — `initDroneVideo()`
