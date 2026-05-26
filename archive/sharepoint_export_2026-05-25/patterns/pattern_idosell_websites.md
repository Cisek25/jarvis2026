# IdoSell Website Building System

## Quick Reference
- **Architecture doc**: `/Users/user/Desktop/Claude_STRONY/claudedocs/idosell-system-architecture.md` (MAIN REFERENCE)
- Client starter guide: `/Users/user/Desktop/Claude_STRONY/claudedocs/client-starter-guide.md`
- Master template: `/Users/user/Desktop/Claude_STRONY/cms_pages/`
- All projects: `/Users/user/Desktop/Claude_STRONY/`

## Platform Essentials
- Container: **1170px** max-width (`.container` class, Bootstrap-based)
- Full-width escape: `width: 100vw; margin-left: calc(-50vw + 50%);`
- Body classes: `page-index`, `page-txt`, `page-offers`, `page-offer`
- CMS content lands in: `.cms-html` (homepage), `.txt-text` (subpages)
- System H1 hide: `h1.big-label { display: none !important; }`

## CMS Panel Fields
- **CSS**: Wygląd → Arkusz stylów CSS (global, one file)
- **Subpage HTML**: Treści → Strony tekstowe → [page] → "Początek sekcji Body"
- **Subpage JS**: Same page → "Koniec sekcji Body"
- **Global HEAD**: Ustawienia → Kody śledzące → Sekcja Head
- **Global end BODY**: Ustawienia → Kody śledzące → Koniec BODY
- **Homepage content**: Wygląd → Strona główna → Edytor treści → HTML mode

## ZASADA: Pliki JS — ZAWSZE z tagami `<script>`
- **KAŻDY plik .js** wklejany do panelu MUSI zaczynać się od `<script>` i kończyć `</script>`
- Panel IdoSell wkleja treść jako HTML (body_top/body_bottom) — bez tagów script JS się nie wykona
- Dotyczy: body_bottom, koniec BODY, per-page JS
- **CMS body_top STRIPUJE `<script>` tagi!** — cały JS TYLKO w body_bottom

## Search Widget (Booking Engine) — SYSTEM TRAPS
- Main class: `.iai-search` > `#iai_book_se.iai_frontpage` > `#iai_book_form`
- Form fields: `.datefrom.widget__option`, `.dateto.widget__option`
- formbutton = **DIV**, nie button! Selector: `#iai_book_form .formbutton`
- `#iai_book_form` starts with INLINE `style="display:none"` — `display:flex !important` overrides it
- `.iai_book_trigger` = toggle button — ALWAYS hide: `.iai_book_trigger { display: none !important; }`
- `.showlocation.widget__option` = lokalizacja pole — hide on single-location sites
- **OUTER WRAPPER** `#iai_book_se.iai_frontpage` needs `background: transparent` or creates dark box
- **BEST APPROACH** for luxury single-location: build custom JS search → hide `.iai-search { display:none }`
  - Custom form uses `input[type="text"]` + mini JS datepicker (NOT `type="date"` — unreliable on mobile)
  - Redirect to `/offers?date_from=&date_to=&persons=`
- **ALWAYS hide on /offers**: `body.page-offers .iai-search { display: none !important; }`
- `.page-top__language` = PL selector — ALWAYS set `color: #F5F0E8` (system default is rgb(40,40,40) = black on dark bg!)
- `.bgd-color-light.menu-wrapper` = WHITE nav header on subpages — ALWAYS override to dark bg
- `.powered_by_logo img` = "on_white" SVG variant — ALWAYS `filter: brightness(0) invert(1)` on dark bg
- `footer a, .footer__contact a` = system default rgb(40,40,40) = BLACK — ALWAYS override to light color!
- `.footer-contact-baner` = payment logos (VISA/MC) — ALWAYS match bg to footer bg (avoid "strips")
- `body.page-offers .accommodation-buttons a` = SZCZEGÓŁY button — use `display:flex; align-items:center; height:auto; padding:9px 20px`
- `/offers cards`: `.offers-container { background: dark }`, `.accommodation-rest h2 a { color: cream }`
- `/offers SZCZEGÓŁY button na różnych poziomach` = FIX: `accommodation-rest { display:flex; flex-direction:column }` + `accommodation-buttons { margin-top: auto }` — button zawsze na dole
- `/offers filtry` = ZAWSZE domyślnie ukryte, toggle button via JS `initOffersFilters()` — klasa `mc-filters-open` na `.filter_items`
- `footer-contact-baner` = "pasy" na bokach bo inny bg niż footer → FIX: użyj `background-image: url(gallery photo)` z overlay `rgba(14,18,25,0.8)` zamiast flat color
- `/kontakt auto-linki "ZOBACZ OFERTĘ", "SPRAWDŹ NA MAPIE"` = systemowe, niewidoczne przez ciemny bg → zawsze dodawaj `body.page-txt a[href*="/offers"], a[href*="google.com/maps"] { color: #C8A45C }`
- **KONTAKT podstrona może być niedostępna do edycji** — jeśli klient mówi że nie ma dostępu, NIE twórz KONTAKT HTML do wklejenia. Tylko CSS w arkuszu stylów. PAMIĘTAJ O TYM ZAWSZE — nie pytaj, nie twórz pliku!
- **GALERIA + SEKCJE FULL WIDTH** — ZAWSZE `width:100vw; margin-left:calc(-50vw+50%); box-sizing:border-box;` na custom sekcjach `.pk-section` etc. System container ogranicza do 1170px!
- **SYSTEM SEARCH BAR na homepage** — ZAWSZE ukryj: `.page-index .search-engine, .page-index .iai-search, .page-index .index-search { display:none !important }` — na KAŻDYM projekcie!
- **SYSTEM PLACEHOLDER "WYPEŁNIJ TO POLE..."** — ZAWSZE ukryj: `.description_place, .index-description, .section-description { display:none !important }`
- **VISA/MC FOOTER STRIP** — ZAWSZE styluj! `.footer__strip, .footer-contact-baner { background:#111 !important }` + `img { filter:brightness(0) invert(1); opacity:0.5 }` — na KAŻDYM projekcie bez wyjątku!
- **JASNA PALETA = JASNE SEKCJE** — jeśli user wybrał jasną paletę, NIE rób ciemnych sekcji (pk-section--dark) na homepage. Counters, Ciekawostki, CTA — wszystko jasne/cream/burgundy, NIGDY #1A1A1A bg.
- **HERO BUTTONS Z-INDEX** — hero overlay buttons MUSZĄ mieć `z-index:100+` żeby być nad system search barem
- **`.index-info` BLOKUJE KLIKNIĘCIA NA HERO** — system `.index-info` ma `position:absolute; z-index:1000`. Zawiera H1 placeholder + H2 "IdoBooking" + button. ZAWSZE: `.index-info { pointer-events:none !important; z-index:1 !important }` + ukryj H1/H2/button
- **SYSTEM GREEN BUTTON** — agresywny override na WSZYSTKICH button-like elementach: `button, .btn, .btn-success, input[type="submit"], .formbutton { background: BRAND !important }`
- **`.footer-contact-baner`** — DOKŁADNY selektor na VISA/MC strip! System default bg: `#3E475E`. ZAWSZE: `.footer-contact-baner { background: FOOTER_COLOR !important }`. NIE `.footer__strip` — to INNY element!
- **`.offers-container` bg `#292929`** — system default CIEMNY. ZAWSZE override: `.offers-container { background: #fff !important }` na jasnych tematach
- **`.offer-wrapper` bg `#292929`** — system default CIEMNY na detail page. ZAWSZE: `.page-offer .offer-wrapper, .offer-right-wrapper { background: #fff !important }`
- **`.filter_items` bg `#292929`** — system filtrów CIEMNE. ZAWSZE override na jasnych tematach
- **`.btn-success`** — system zielone buttony (ZAREZERWUJ TERAZ, ZASTOSUJ FILTRY). ZAWSZE override: `.btn-success { background: BRAND !important }`
- **Wikimedia URLs** — WERYFIKUJ URL przed użyciem! `Toru%C5%84_-_Rynek_Staromiejski.jpg` NIE ISTNIEJE → użyj `Rynek_Staromiejski_w_Toruniu1.jpg`
- **Folder projektu** = zawsze TYLKO `DO_WKLEJENIA/` z plikami. Stare wersje poza folderem = usuwaj na bieżąco.
- `/kontakt` i inne podstrony = użyj inline CSS w pliku, redukuj: hero padding 48px (nie 88px), tytuły clamp(28px,..,48px) (nie 80px), karty padding 24px (nie 40px), ikony 48px (nie 72px)
- `WPROWADZ.txt` = utwórz plik z instrukcjami co wpisać w panelu (h1/h2, menu, dane kontaktowe, nazwy domków)
- System icons `[class*="icon-"]` = ORANGE #AD5009 — ALWAYS override globally to brand gold
- ALL `.btn, a.btn, button.btn` = ORANGE #AD5009 — ALWAYS override to brand color globally
- `body.page-offer` = strony detalu domku `/offer/ID/nazwa` — ZAWSZE dodawaj dark theme! Klasy: `.offer-wrapper`, `.col-lg-9`, `.col-lg-3`, `.offer-right-wrapper`, `.offer-gallery` = białe domyślnie
- Logo na ciemnym headerze = ZAWSZE `img[src*="Logo"], img[src*="wideLogo"] { filter: brightness(0) invert(1) }` — logo musi być białe na ciemnym tle
- Filtry toggle `<button>` = ZAWSZE `btn.type = 'button'` w JS, inaczej domyślnie type=submit → przeładowanie strony!
- System search widget: NIE używaj `display:none` jeśli chcesz wypełnić pola przez JS. Używaj `position:absolute; left:-9999px` — widget wciąż dostępny dla `generateWidgetIdoSellBooking()`
- Custom search form submit → ZAWSZE najpierw spróbuj `generateWidgetIdoSellBooking()`, potem fallback `/offers`
- Duplikat sekcji "Nasze Stodoły" w CMS HTML + JS → usuń z HTML, zostaw tylko JS-generowaną
- **Search form w hero POWYŻEJ tekstu**: jeśli `.index-info` ma absolute/relative positioning, wstaw search WEWNĄTRZ `.index-info` (`indexInfo.appendChild(wrapper)`) NIE po nim. Dodaj `.index-info { display:flex; flex-direction:column; align-items:center }`
- **`body.page-offer` ZAWSZE ukryj `.iai-search`** → `body.page-offer .iai-search { display:none }`. Poprzednio błędnie robiłem `display:block` co tworzyło czarny pusty box
- **`body.page-offer` cennik karty** = białe `.period-price` → zawsze dark: `body.page-offer .period-price { background:#141C28; border: rgba(200,164,92,0.18) }`
- **`body.page-offer` nawigacja tabs** = białe `.nav-tabs .nav-link` → zawsze dark bg, `color:#A8A29A`, active = gold border-bottom
- **`body.page-offer` orange tekst** = telefon/email/0,00zł → `a[href*="tel:"], a[href*="mailto:"] { color:#C8A45C }`
- **ZA CIEMNA STRONA** = użyj KREMOWYCH SEKCJI dla treści: O nas `#F8F4EE`, Udogodnienia `#F0EBE0`, Opinie `#F8F4EE`. Dark tylko: Hero, Nasze Stodoły JS, Galeria, CTA, Footer. Zmień kolory nagłówków/tekstu na tych sekcjach na dark `#1A1612`
- **Footer strips**: footer + footer-contact-baner MUSZĄ mieć IDENTYCZNY kolor bg. Inaczej widoczne "pasy" na bokach. Zawsze: `footer, .footer-contact-baner { background: SAME_COLOR }`
- **ZAREZERWUJ TERAZ split**: `white-space: nowrap` na przycisku rezerwacji
- **Kontakt ZOBACZ OFERTĘ/SPRAWDŹ NA MAPIE**: system generuje w `.location-contact a`, `.nasze-lokalizacje a`. Zawsze: `[class*="location"] a { color: #C8A45C }`
- **`body.page-offer` tabs** = `.tabs .tabs__item` (NIE `.nav-tabs .nav-link` Bootstrap!). Override: `background:#141C28; color:#8A8378`
- **`body.page-offer` cennik** = `table` wewnątrz `.season-row_sub` (NIE `.period-price`!). Override: `body.page-offer [class*="season"] table { background:#141C28 }`
- **`body.page-offer` opcje dodatkowe orange** = `<strong>` w `.addonsList`. Override: `body.page-offer .addonsList strong { color:#C8A45C }`
- **Datepicker `position:fixed` nie działa gdy ancestor ma `clip-path`** → przenieś `dpEl` do `document.body` przez `document.body.appendChild(dpEl)` ZANIM użytkownik kliknie. Bez tego datepicker jest zawsze w złym miejscu!
- **Review card footer czarny** = USUŃ klasę `.mc-review-card__footer` z HTML. Zastąp `<footer class="mc-review-card__footer">` przez `<p class="mc-review-card__author"><strong>Imię</strong><span>Miasto</span></p>`. Dodaj `<span class="mc-review-card__qmark">❝</span>` na początku każdej karty. W CSS: `.mc-review-card__footer { display:none }` i nowe klasy `__author`, `__qmark`
- **Galeria równe odstępy** = KRYTYCZNE: `figure.mc-relax__photo { margin:0 !important; padding:0 !important }` — HTML `<figure>` ma UA default margin `1em 40px` który psuje row-gap. Bez zerowania: pionowy gap WIĘKSZY od poziomego. Potem: `row-gap:12px; column-gap:12px` explicit na gridzie. Zarówno w main CSS jak i inline `<style>` w CMS HTML.
- **Slider 1 zdjęcie** = ZAWSZE dodawaj: `.parallax-slider .slick-slide:not([data-slick-index="0"]):not(.slick-current) { display:none }` + `.parallax-slider .slick-arrow, .slick-dots { display:none }` + `.parallax-slider::before { display:none }`
- **SYSTEM SCHEME CSS VARIABLES** = KRYTYCZNE! System scheme (np. `333333.css.gz`) definiuje `--maincolor1` (akcent), `--supportcolor1` (orange), `--bgcolor2/3`. ZAWSZE nadpisuj w `html:root { --maincolor1: BRAND_COLOR !important; --maincolor1_rgba: R,G,B !important; --supportcolor1: BRAND_COLOR2 !important; }` — inaczej system green/teal/orange przenika do h4, linków, filtrów
- **System h2 font-size gigantyczny** = system default13 robi h2 ~36px, h3 ~32px, .price ~32px. ZAWSZE limituj globalnie: `h2 { font-size: clamp(22px,2.5vw,32px) !important }` + `.price { font-size: 22px !important }`
- **`span.btn` na /offers** = system `line-height:49px` + `height` fixed → przycisk SZCZEGÓŁY jest OGROMNY. FIX: `span.btn { line-height:1.4 !important; height:auto !important; display:inline-block !important }`
- **Czarna poświata na hero** = `.section.parallax::after` gradient `rgba(0,0,0,0.7-0.95)` = ciemna ramka dookoła. Fix: usuń górną/środkową część gradientu, zostaw tylko delikatny gradient dolny
- **Tabs /offer granatowe kafelki** = `body.page-offer .tabs__item { background-color: transparent }` — NIE nadawaj osobnego tła, tabs muszą być przezroczyste
- **Search field klikalny — JEDYNE NIEZAWODNE ROZWIĄZANIE**: Użyj `<label for="input-id">` zamiast `<span>`. Przeglądarka NATYWNIE przekazuje klik z labela do inputa (focus). Otwieraj datepicker przez `input.addEventListener('focus', openDp)`. Zamykaj przez `blur` event z `setTimeout(200ms)`. W datepicker div: `mousedown` z `e.preventDefault()` żeby nie kradł focusa z inputa. BEZ żadnych sztuczek mousedown/stopPropagation/dispatchEvent!
- **Datepicker closing bug** — `click` event na field div propaguje do `document` close listener. ROZWIĄZANIE: focus/blur zamiast click events, `<label for>` zamiast `<span>`. Nie używaj `stopPropagation` + `dispatchEvent` — race condition!
- **Litepicker day headers** = `.month-item-weekdays-row div { color:#6B6560 }` — domyślnie rgb(40,40,40) = CZARNE niewidoczne
- **Tabs active orange** = `.tabs__item.active { border-bottom: 3px solid #C8A45C }` + `::after/before { background:#C8A45C }` — system nie używa `.nav-link` tylko `.tabs__item`
- **`body.page-offer` header scrolled biały** = `body.page-offer header.default13 { background: rgba(14,18,25,0.96) }` — system zmienia header przy scrollowaniu
- **Footer baner "pasy" na bokach** = `.footer-contact-baner` jest WEWNĄTRZ `.footer.container` (Bootstrap max-width 1140px). Fix: `position:relative; left:50%; margin-left:-50vw; width:100vw` — wyrwij z containera na pełną szerokość. ZAWSZE też `html { overflow-x: hidden }`
- **Opinie design** = ciemne karty z KREMOWYM tłem sekcji. HTML: `<p class="mc-review-card__author"><strong>Imię</strong><span>Miasto</span></p>` zamiast `<footer class="mc-review-card__footer">`. Dodaj `<span class="mc-review-card__qmark">❝</span>`. `footer { display:none }`. W CSS: `card { background:#FFFFFF; border-left:3px solid #C8A45C; box-shadow:subtle }`.
- **Galeria homepage równe odstępy** = ZAWSZE: `figure.mc-relax__photo { margin:0; padding:0 }` — UA default margin `<figure>` psuje row-gap! + `row-gap:12px; column-gap:12px` explicit. Zarówno w CSS jak i inline style w CMS HTML.
- **Search kafelki klikalne — JEDYNE NIEZAWODNE**: `<label for="input-id">` zamiast `<span>` + `input.addEventListener('focus', openDp)`. Datepicker: `document.body.appendChild(dpEl)` + `mousedown { e.preventDefault() }` w pickerze. Zamykaj `blur` + setTimeout 200ms. BEZ click/stopPropagation/dispatchEvent — race condition!
- **Calendar legend duży** = `.iai-calendar-legend, [class*="availability"] { font-size:11px; padding:6px; max-height:44px }` na page-offer
- **Kontakt za duże** = inline CSS w `.mc-kt-hero__title`, `.mc-kt-card` — silne override z `!important`
- **Pusty ciemny obszar pod galerią** = `.offer-gallery { padding-bottom:0 }` na page-offer
- **Slider 1 zdjęcie nie rotuje** = SYSTEM TRAP — ZAWSZE dodawaj: `.parallax-slider .slick-slide:not([data-slick-index="0"]):not(.slick-current) { display:none }` + `.parallax-slider .slick-arrow, .slick-dots { display:none }` + `.parallax-slider::before { display:none }` + `.parallax-slider .slick-track { animation:none; transition:none }`
- **Czarna poświata na hero** = `.section.parallax::after` gradient `rgba(0,0,0,0.7-0.95)` = ciemna ramka wokół. FIX: gradient tylko na dole, top = `rgba(0,0,0,0)`. Używaj: `background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(14,18,25,0.6) 85%, rgba(14,18,25,0.88) 100%)`
- **Tabs /offer granatowe kafelki** = `.tabs__item { background:transparent !important; border:none }` — NIE nadawaj navy bg, tabs MUSZĄ być przezroczyste i zlewać się z tłem
- **`/offers` h4 "Filtruj wyniki" orange** = `#menu_filter h4` z `color:rgb(173,80,9)`. FIX: `body.page-offers #menu_filter h4 { color:#C8A45C }`
- **Legenda kalendarza szersza niż kalendarz** = `.col-12.mt-3 { max-width:700px; margin:0 auto }` na page-offer
- **Inline CSS w CMS HTML** = ZAWSZE dodawaj `<style>` blok na końcu GLOWNA_PL__cms.html dla overrideów galerii — inline style zawsze wygrywa z `<link>` arkuszem gdy dokument się ładuje
- Persons dropdown chevron fix (tiny 8x8 system button):
```css
#ec-search-dock .widget__option.iai_input-small .iai_widget_btn {
  position: absolute !important;
  top: 50% !important; right: 16px !important; left: auto !important;
  transform: translateY(-50%) !important;
  width: 20px !important; height: 20px !important;
  opacity: 1 !important; font-size: 0 !important;
  background: transparent !important; border: none !important;
}
#ec-search-dock .widget__option.iai_input-small .iai_widget_btn::after {
  content: '' !important; display: block !important;
  width: 8px !important; height: 8px !important;
  border-right: 2px solid var(--ec-text-light) !important;
  border-bottom: 2px solid var(--ec-text-light) !important;
  transform: rotate(45deg) !important; margin: 2px auto 0 !important;
}
#ec-search-dock .widget__option.iai_input-small {
  padding-right: 44px !important;
}
```

## Offer Page Tabs System Traps (discovered 2026-04-07)
- **Tab text is in NESTED SPAN**: System `offer.css.gz` → `.tabs__item > span { font-size:1.3rem; text-transform:uppercase; letter-spacing:0.05rem }`. Custom CSS on `.tabs__item` alone does NOT affect font! MUST target `.tabs__item > span, .tabs__item span`
- **Sticky class is `--fixed`**: System JS adds CSS class `--fixed` to `.tabs` element on scroll (NOT inline styles, NOT `.sticky`). Selector: `.tabs.--fixed { position:fixed; top:60px; left:0; width:100vw }`
- **Fixed tabs inherit container offset**: When `.tabs` becomes `position:fixed`, it keeps container's `left` margin (e.g. 630px). MUST override: `left:0 !important; width:100vw !important; margin:0 !important`
- **CSS specificity fights with `!important`**: When both system and custom use `!important`, highest specificity wins. Use `body header.default13 .navbar-brand img` to beat `.navbar-brand img`. Prefix with `body` to add specificity
- **System hides H1 `big-label`**: On offer pages, `h1.big-label` has `visibility:hidden` from system. Override: `display:block !important; visibility:visible !important`
- **Mobile tabs = accordion**: On mobile (<480px), system automatically converts `.tabs` to vertical accordion with expand/collapse buttons. No custom mobile tab CSS needed — system handles it
- **Tab overflow solution**: Desktop: `display:flex; flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none` + target span font to 0.625rem (10px). Tablet (991px): 0.5625rem (9px). Mobile: system accordion kicks in

## File Naming Convention
```
DO_WKLEJENIA/
  [PREFIX]_ARKUSZ_STYLOW.css
  [PREFIX]_HEAD.html
  [PREFIX]_KONIEC_BODY_JS.html
  [PAGE]_[LANG]__body_top.html      (HTML content)
  [PAGE]_[LANG]__body_bottom.html   (JavaScript)
  INSTRUKCJA.txt
```

## CSS Prefix Convention
2-3 letter per client: vk-, md-, mc-, wb-, ga-, ca-, et-

## Key System Classes (don't override destructively)
- `.defaultsb` / `.default13` (header), `.navbar`, `.navbar-nav`, `.navbar-brand`
- `.section.parallax`, `.parallax-slider`, `.parallax-image`, `.slick-*`
- `.customtext.animated` (contains search widget)
- `footer`, `.footer-wrapper`, `.footer-contact`, `.powered_by`
- `.iai-search`, `.iai_frontpage`, `#iai_book_form`

## CRITICAL: Footer is SYSTEM-GENERATED — Style via CSS Only!
- Footer (`footer`, `.footer-wrapper`, `.footer-contact`) is rendered by IdoSell system
- **NEVER create custom footer HTML** in body_top files — it will duplicate!
- Content comes from panel settings (address, phone, email, social links)
- **Style ONLY via CSS** in the main stylesheet — override colors, fonts, layout
- Override pattern:
```css
footer, .footer-wrapper {
  background: #BRAND_DARK !important;
  color: #BRAND_LIGHT !important;
  font-family: var(--PREFIX-font-body) !important;
}
footer a { color: #BRAND_ACCENT !important; }
footer a:hover { color: #BRAND_LIGHTER !important; }
.powered_by { /* IdoBooking credit — style but don't hide */ }
```

## System Elements Outside CMS Control
These elements are injected by IdoSell/IdoBooking system JS, NOT inside body_top.
**CSS variables (var(--ec-*)) may NOT work on them — always use hardcoded hex values!**

### Scroll Arrow (`#bounce`)
- System scroll-down indicator, `position: fixed`, default orange
- Override pattern:
```css
#bounce {
  background-color: #HEXCOLOR !important;
  background: #HEXCOLOR !important;
  left: auto !important;
  right: 32px !important;
  transform: none !important;
  margin-left: 0 !important;
}
```

### Back-to-Top Button (`#backTop`)
- System scroll-to-top button, default orange
- Override: `#backTop { background: #HEXCOLOR !important; }`

### Cookie Banner (`.ck_dsclr_v2`)
- Privacy consent banner, button `.ck_dsclr__btn_v2`, close X `.ck_dsclr_x_v2`, links `.ck_dsclr_v2 a`
- Override pattern:
```css
.ck_dsclr__btn_v2 { background: #HEXCOLOR !important; }
.ck_dsclr__btn_v2:hover { background: #LIGHTER_HEX !important; }
.ck_dsclr_v2 a { color: #LIGHT_ACCENT !important; }
.ck_dsclr_x_v2 { color: #LIGHT_ACCENT !important; }
```

### Skip Links (`.skip_link`)
- Accessibility skip navigation, default orange
- Override: `.skip_link { background: #HEXCOLOR !important; }`

## Images
- Slider: `/images/frontpageGallery/pictures/large/X/Y/ZZ_full.jpg`
- Offers: `/images/objects/pictures/large/X/Y/ZZ.jpg`
- Logo: `/images/owner/wideLogo.png`
- Max 10MB, system serves responsive via `<picture><source>`

## Languages
- Manual duplication per language tab in CMS
- URL prefix: `/de/`, `/en/` etc.
- Same page ID, different language content
- Menu auto-switches per language
- **EN must be FULLY consistent with PL** — every feature (zone cards, popups, buttons, CTAs) must exist in both

## CSS Specificity Lessons (Critical!)
- System styles use 2-class selectors (e.g., `.ec-popup--wide .ec-popup__close`)
- When overriding inside nested components, use FULL parent chain:
  - WRONG: `.ec-popup__topbar .ec-popup__close { position: static }` (loses to 2-class system rule)
  - RIGHT: `.ec-popup--wide .ec-popup__topbar .ec-popup__close { position: static !important }`
- Always add `!important` when overriding system absolute positioning
- Test popup/modal elements by inspecting computed styles, not just writing CSS

## IdoSell System Traps (learned from Najmar, apply to ALL clients)

### Body font-size 22.4px
- IdoSell sets `body { font-size: 22.4px }` (140% of 16px html base)
- **ALWAYS reset**: `body { font-size: 16px !important; }` in every project
- Without this: /offers cards, /contact text, calendar legends — all 40% too big

### Stacking Context Trap (Slick Slider)
- `.slick-slide.slick-current` gets `z-index: 999` from Slick carousel
- `.index-info` (search widget parent) default `z-index: 2`
- Dropdowns inside `.index-info` are TRAPPED — z-index: 9999 won't escape parent context
- **FIX**: `.index-info { z-index: 1000 !important; }` (above slick 999)
- **ALSO**: `.index-info { overflow: visible !important; }` (overflow:hidden clips dropdowns!)

### System z-index: -1 on inputs
- IdoSell sets `z-index: -1` on ALL search form inputs
- Makes them unclickable (behind parent layer)
- **FIX**: `#iai_book_form input, #iai_book_form select { z-index: 2 !important; }`

### System positioning on .index-info and #iai_book_form
- System applies inline `top: 477px; left: 965px; transform: matrix(...)`
- **ALWAYS reset**: `top: 0; left: 0; transform: none; position: relative;`

### .parallax-slider::before dark overlay
- System pseudo-element with `rgba(0,0,0,0.3)` — darkens hero
- **FIX**: `.parallax-slider::before { display: none !important; }`

### Header position
- `position: sticky` creates gaps on subpages
- **USE**: `position: fixed` + subpage `padding-top: [header-height]px`

### System orange (#AD5009 / rgb(173,80,9))
- Default brand color for buttons, links, filters on /offers, /contact
- Override globally: `.btn { background: #BRAND !important; border-color: #BRAND !important; }`

### Litepicker calendar width
- Default renders at 944px, content only ~720px → white space
- **FIX**: `.litepicker { width: fit-content !important; }`

### Litepicker backdrop (ciemny overlay za kalendarzem)
- System `.litepicker-backdrop` has `display: none` inline even when calendar opens (backdrop option disabled in config)
- **`::before` on `.litepicker` NIE DZIALA** — `position: fixed` wewnatrz `position: fixed` parenta nie pokrywa pelnego viewportu prawidlowo. Nawet przy opacity 0.95 hero images przebijaja.
- **FIX**: Prawdziwy DOM element `#ga-calendar-backdrop` w `<body>`:
  - CSS: `position: fixed; inset: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9998; pointer-events: none; display: none;`
  - `.active` klasa: `display: block`
  - JS: MutationObserver na `.litepicker` (attributeFilter: ['style']) toggluje `.active` przy open/close
- z-index 9998 = tuz pod litepicker (9999), nad calą stroną
- Opacity 0.85 neutralizuje ciepłe hero images (0.5-0.7 za mało dla warm-toned photos)

### Litepicker legenda (.litepicker__legend)
- System class: `.litepicker__legend` (NIE `.container__footer` ktory nie istnieje w DOM)
- Children: `.legend__halfBegin`, `.legend__halfEnd`
- **FIX**: `border-radius: 0 0 16px 16px` (bottom corners) + `.container__months` `border-radius: 16px 16px 0 0` (top only) → tworza jednolity box
- Font/color match: `font-size: 11px; color: var(--prefix-muted); font-family: var(--prefix-font)`
- `clip-path: inset(-1px -60px -60px -60px)` — obcina gorny cien, zostawia dolny/boczne

### Persons dropdown (CSS)
- System renders UL.persons_list with overflow:auto and limited height → scrollbar on 8+ items
- **FIX**: `overflow: visible; max-height: none; height: auto;`
- Compact width: 80px, padding: 5px 12px per li

### Persons dropdown toggle (JS) — CRITICAL TRAP!
- `widget-temp.js:1254` attaches click handler on INPUT via `addEventListener` — captures function BY REFERENCE
- `togglePersonsList()` ONLY toggles `.visible` class on `#iai_persons_list` + `aria-expanded` on button
- `handlePersonSelection()` sets INLINE `style="display: none"` after user selects a value
- **BUG**: Inline `display: none` BEATS CSS `.visible { display: block }` → second click adds `.visible` but list stays hidden
- **TRAP 1**: Overriding `window.togglePersonsList = newFn` does NOT affect captured reference — system handler still calls original
- **TRAP 2**: Adding custom click handler on `#person_section` (parent) causes DOUBLE-TOGGLE — system handler on INPUT (child) fires via event bubbling → net zero change
- **FIX (CSS only)**:
```css
#iai_persons_list.visible {
    display: block !important;
}
```
- `!important` in CSS beats inline `style="display: none"` — cleanest solution
- **FIX (JS)**: Do NOT add click handlers on `#person_section` — let system handler toggle `.visible`. Only add document click for close-on-outside:
```javascript
document.addEventListener('click', function(e) {
  if (!e.target.closest('#person_section')) {
    var pl = document.getElementById('iai_persons_list');
    if (pl) pl.classList.remove('visible');
  }
});
```
- **RULE**: Never fight system event listeners — work WITH them via CSS `!important`

### Ghost booking form (#iai_book_form.d-none)
- On `/offer/` pages, `#iai_book_form` has Bootstrap `d-none` class
- BUT system CSS overrides it to `display: grid` → visible 244x58px white/gray box below ZAREZERWUJ button
- **FIX**: `body.page-offer #iai_book_form.d-none { display: none !important; height: 0 !important; }`

### Offer price circle not circular
- `.offer-price` on `/offer/` pages: system renders 244x161px (non-square) with `border-radius:100px` → oval
- `<small>` "Od" at 32px, `<span>` price at 48px — body font-size relative, HUGE
- **FIX**: Force `width:150px; height:150px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center;` + explicit font-sizes (small 13px, span 26px)

### FontAwesome NOT loaded in IdoSell
- `.fa`, `.fa-angle-down` etc. render as 0x0 invisible (fontFamily: Inter, not FontAwesome)
- Affects filter chevrons on /offers page
- **FIX**: CSS-only chevron via `::after { border-right: 2px solid; border-bottom: 2px solid; transform: rotate(45deg); }` + `[aria-expanded="true"]::after { transform: rotate(-135deg); }`

### Featured Offers ("Wyroznione oferty") — MADERA APPROACH (PROVEN)
- **What**: Panel marks rooms as "wyroznione" → system generates `.container-hotspot` → **MY JS reads data and builds custom cards**
- **DOM structure**: `.container-hotspot > .offerslist.slick-initialized > .offer`
- **Offer data selectors**: `.object-icon img[data-src]` (image), `.offer-name a` / `h3 a` (title), `.offer__description` (desc), `.offer__info` (m2 + guests), `.amount` (price), `a[href*="offer"]` (link)
- **ALWAYS HIDE SYSTEM**: `.container-hotspot { display: none !important }` in CSS
- **JS in body_bottom**: Read offers from hidden hotspot → deduplicate (slick clones share href) → build custom HTML → insert in DOM
- **Retry mechanism**: `setInterval` 300ms x 50 tries — hotspot loads async
- **Guard**: `if (document.querySelector('.ec-offers-section')) return true;` prevents duplicate builds
- **Parse info**: `"35,00 m2 4"` → regex `/([\d,.]+)\s*m2/i` for area, split on `m2` for guests
- **Images**: Use `data-src` (lazy-load attr) first, fallback to `src`
- **Card template**: `<a href class="[prefix]-offer-card">` with `__img`, `__body`, `__name`, `__desc`, `__meta`, `__price`, `__cta`
- **Insert point**: Before CTA section (`.ec-section--green`, `.mc-cta-section`, etc.)
- **Responsive grid**: 3→2→1 columns via CSS grid
- **RULE**: NIGDY nie styluj systemowego `.container-hotspot` — ZAWSZE ukryj i buduj custom karty
- Used in: Madera (md-), Mazurski Chill (mc-), EcoCamping (ec-)

### Leaflet Map `[class*="map"]` Trap (Contact Page)
- `[class*="map"]` wildcard selector matches BOTH `a.map_link` AND internal `.leaflet-map-pane`
- Applying `overflow:hidden; border-radius:8px` to `.leaflet-map-pane` clips ALL tile children → map invisible (0x0)
- **FIX**: Use `.leaflet-container` to target ONLY the outer map container:
```css
body.page-contact .leaflet-container {
  border-radius: 8px !important;
  overflow: hidden !important;
}
```
- **ALSO**: `[class*="btn"]` wildcard catches Leaflet zoom buttons → add `:not([class*="leaflet"])` exclusion:
```css
body.page-contact [class*="btn"]:not([class*="leaflet"]) { /* gold styling */ }
```
- **RULE**: Never use `[class*="map"]` for Leaflet maps — always `.leaflet-container`

### Contact Page Button Centering
- System `.contact__btn` has `display:flex` but `justify-content:normal` (default)
- "Rezerwuj online" button text appears left-aligned in wide button
- **FIX**: `body.page-contact .contact__btn { justify-content:center !important; align-items:center !important; text-align:center !important; }`

## Workflow for ALL IdoSell projects
1. Czytaj memory file klienta na start sesji
2. Otwórz CSS + stronę live w przeglądarce
3. Autonomicznie używaj agentów (ui-ux-designer, code-reviewer, Explore)
4. Każdą zmianę testuj live przez Chrome DevTools CSS inject
5. Screenshot → weryfikuj → dopiero potem zapisuj do pliku
6. Nie pytaj usera o każdy krok — działaj samodzielnie

## Interactive Map Zone Cards Pattern
- Use `data-ec-zone="zonename"` attribute on pins (NOT `data-ec-pin` which is tooltip-only)
- Each zone card MUST have its own unique image — never reuse the same image for all cards
- Zone detail panel `#ecZonePanel` with `.ec-zone-card[data-zone="x"]` children
- JS shows/hides cards based on matching pin's `data-ec-zone` value
- Both PL and EN must have identical zone card structure

## CRITICAL BUILD RULES (from user, non-negotiable)
1. **ALL CSS in ONE file** — ZERO `<style>` blocks in HTML files. Every selector goes into the main `[PREFIX]_ARKUSZ_STYLOW.css`. No exceptions, no inline styles, no embedded stylesheets.
2. **System element overrides FROM DAY 1** — #bounce, #backTop, cookie banner, skip links, formbutton — all colored with brand hex HARDCODED (not CSS vars!) in the FIRST CSS build. Never leave for "later fix".
3. **No promo/rabat bar** unless client specifically uses one. Each project is individual.
4. **Verify client offering** — "apartamenty" vs "pokoje" vs "domki" vs "namioty" — use the CORRECT term from their actual offers, not generic.
5. **Folder structure = osobne foldery per podstrona** (SORS pattern):
   - `DO_WKLEJENIA/00_CSS.css` (jeden plik CSS)
   - `DO_WKLEJENIA/01_GLOWNA/glowna_PL.html`, `glowna_EN.html`...
   - `DO_WKLEJENIA/02_APARTAMENTY/apartamenty_PL.html`...
   - Numeracja folderów odpowiada kolejności podstron
   - NIE duplikuj folderów — jeden folder per podstronę, bez wersji roboczych obok
5. **Client's own photos first** — if client has photos uploaded in panel (slider gallery), use those URLs before Wikimedia/external.
6. **USE ALL AVAILABLE AGENTS & SKILLS** — at every stage of website work, actively use:
   - **ui-ux-designer** — audyt wizualny po każdej zmianie, review UI
   - **frontend-developer** — budowanie komponentów, responsive, accessibility
   - **seo-specialist** — audyt SEO, meta tags, structured data, Lighthouse
   - **code-reviewer** — review CSS/HTML jakości przed dostarczeniem
   - **debugger** — diagnozowanie problemów na żywo (poświata, layout, z-index)
   - **test-engineer** — testowanie cross-browser, responsive breakpoints
   - **context-manager** — utrzymywanie kontekstu projektu między sesjami
   - **search-specialist** — research (zdjęcia, informacje o lokalizacji)
   - Skills: frontend-design, ui-design-system, roier-seo, browser-automation
   - MCP: chrome-devtools / playwright do inspekcji live site
   - **Zasada**: Nie rób ręcznie tego co agent zrobi lepiej. Deleguj.

## CRITICAL: Reset body font-size to 16px
- IdoSell system sets `body { font-size: 22.4px }` (140% of html 16px)
- This makes ALL text on /offers, /contact, /txt 40% too large
- **FIX**: Always add from day 1:
```css
body {
  font-size: 16px !important;
}
```

## CRITICAL: Hide system H2 "IdoBooking" on hero
- System generates `<h2>IdoBooking</h2>` inside `.index-info` on homepage
- Shows at ~50px white text overlapping H1
- **FIX**: Always hide:
```css
.index-info h2, .section.parallax h2 { display: none !important; }
```

## CRITICAL: Global .btn override (system orange #AD5009)
- System uses `rgb(173,80,9)` on `.btn` elements across ALL pages
- **FIX**: Global override in CSS reset section:
```css
.btn:not(.slick-arrow) {
  background-color: #BRAND_HEX !important;
  border-color: #BRAND_HEX !important;
}
```

## Standard Checklist for Every New Project
1. Override all orange system elements to brand color (hardcoded hex):
   - `#bounce` (scroll arrow)
   - `#backTop` (back to top)
   - `.ck_dsclr__btn_v2` (cookie banner)
   - `.skip_link` (accessibility)
   - `.formbutton` (search widget button)
2. Hide `.iai-search` on `body.page-offers`
3. Fix persons dropdown chevron (`.iai_input-small .iai_widget_btn`)
4. Style Litepicker calendar with brand colors
5. Full-width search widget styling (glass morphism pattern)
6. EN version with full parity to PL
7. **ALWAYS style /offers and /contact subpages FROM DAY 1** (see below)
8. **Header: `position: fixed` NOT `sticky`** (see below)
9. **Kill `.parallax-slider::before` system dark overlay** (see below)
10. **Reset `.index-info` system positioning** (see below)

## CRITICAL: Header Must Be `position: fixed` (NOT `sticky`)
- `position: sticky; top: 0` creates a ~95px gap on subpages (/offers, /contact, /txt)
- The gap shows the dark slider/parallax behind the header = "czarna poświata"
- **FIX**: Use `position: fixed !important;` for header + add `padding-top: 95px` on subpage body classes
- Subpage body classes: `body.page-offers`, `body.page-offer`, `body.page-contact`, `body.page-txt`
```css
body.page-offers,
body.page-offer,
body.page-contact,
body.page-txt {
  padding-top: 95px !important;
}
```

## CRITICAL: Kill ALL System Dark Overlays on Slider
Two separate system pseudo-elements cause dark glow ("czarna poświata"):
1. `.parallax-slider::before` — `background: rgba(0,0,0,0.3)` (30% black)
2. `.parallax-image::after` — `background: rgb(0,0,0); opacity: 0.3` (30% black on EACH slide image)
- **FIX**: Kill BOTH from day 1:
```css
.parallax-slider::before,
.parallax-image::after {
  background: transparent !important;
  display: none !important;
  opacity: 0 !important;
}
```

## CRITICAL: Header Must Be Fully Opaque White, No Shadow
- `rgba(255,255,255,0.97)` lets 3% of dark photo bleed through — use `#fff`
- `box-shadow` creates visible dark line at header/photo boundary — use `none`
```css
.defaultsb, .default13, header.header {
  background: #fff !important;
  box-shadow: none !important;
}
```

## CRITICAL: Gradient Overlay — ONLY on `.section.parallax` (Full-Width)
- `.index-info` is only 1170px wide — gradient on it creates visible dark edges on sides
- Use `.section.parallax::after` for full-width gradient, DISABLE `.index-info::after`
```css
.section.parallax::after {
  /* full-width white-to-transparent top fade + dark bottom for text */
  background: linear-gradient(to bottom,
    rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 12%,
    rgba(255,255,255,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%) !important;
}
.index-info::after { display: none !important; content: none !important; }
```

## CRITICAL: Reset `.index-info` System Positioning
- System applies `top: 477px`, `left: 965px`, `transform: matrix(...)` to `.index-info`
- This pushes the search widget completely off-screen
- **FIX**: Always reset from day 1:
```css
.index-info {
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: auto !important;
  transform: none !important;
}
```

## CRITICAL: Style /offers and /contact FROM DAY 1
- System uses orange `rgb(173, 80, 9)` on /offers page elements (filter h4, .btn buttons)
- NEVER leave subpages unstyled — override system orange in the FIRST CSS build
- Required overrides for /offers:
```css
body.page-offers h4,
body.page-offers .sidebar h4 {
  color: #BRAND_COLOR !important;
  font-family: var(--PREFIX-font-heading) !important;
}
body.page-offers .btn,
body.page-offers button.btn,
body.page-offers a.btn {
  background: #BRAND_COLOR !important;
  color: #fff !important;
  border: none !important;
}
body.page-offers .btn:hover {
  background: #BRAND_LIGHTER !important;
}
```
- /contact page: verify form elements, buttons, links are all brand-colored

## Header Class Varies Per Template
- Header class is NOT always `.defaultsb` — it depends on the template:
  - `.defaultsb` (some templates)
  - `.default13` (other templates, e.g., Najmar)
- **ALWAYS inspect the live site** to find the actual header class before writing CSS
- Use multiple selectors to be safe:
```css
.defaultsb,
#defaultsb,
.default13,
.navbar-wrapper,
header.header {
  /* header styles */
}
```

## Key Decisions (2026-03-24 brainstorm)
1. Strona główna: treść w **Edytorze treści CMS** (HTML mode), NIE w "Początek Body"
2. Wyróżnione oferty: systemowe, przejmujemy wygląd CSS (`.cmshotspot .offer`)
3. News: **ukryć na głównej** (`page-index .news-container display:none`), blog żyje pod `/news`
4. Blog content: zasilać pod AI search/SEO (artykuły o okolicy, poradniki, eventy)
5. Standardized workflow: CSS → HEAD → Homepage CMS → Subpages body_top/bottom → JS → INSTRUKCJA
6. File naming: `[PAGE]_[LANG]__body_top.html`, `__body_bottom.html`, `__cms.html` (homepage)
7. Silnik na podstronach txt: ukrywamy CSS (`page-txt .iai-search display:none`)

## Photo Scraping Pattern (from offer pages)
- Offer images: `/images/objects/pictures/large/{X}/{Y}/{ID}.jpg`
- Small thumbnails: `/images/objects/pictures/small/{X}/{Y}/{ID}.jpg`
- Gallery images: `/images/frontpageGallery/pictures/large/{X}/{Y}/{ID}.jpg` or `{ID}_full.jpg`
- To scrape: fetch each `/offer/{id}/{slug}`, parse DOM for `.offer-gallery img, .slick-slide img`
- Filter: only `/large/` URLs, deduplicate
- Use first landscape-oriented image (width > height) for homepage cards
- Pattern: `fetch('/offer/ID/Slug') → parse → extract img[src*="/large/"]`

## Subpage Checklist — DO AUTOMATICALLY for every client
1. **Strona główna** (homepage CMS) — hero, rooms/offers cards (with REAL photos scraped from /offer pages), features, location, CTA
2. **/offers** — ALWAYS style: filter sidebar collapse+toggle, offer cards, SZCZEGOLY button flexbox centering, hide .iai-search, system orange override
3. **/offer/[id]** — gallery, price display, amenities
4. **/contact** — links green, buttons green, font-size normalize
5. **Custom subpages** (Atrakcje, Galeria, Dla Wlascicieli, etc.) — per client needs
6. **EN version** — full translation of ALL subpages, consistent features

## JavaScript Patterns — body_bottom ONLY!
- **CMS body_top STRIPS `<script>` tags!** — ALL JavaScript MUST go in body_bottom (global end-of-body)
- **FAQ accordion toggle**: `aria-expanded` + `hidden` attribute on answer div. Selector: `.PREFIX-faq-item__btn` click handler.
- **Filter collapse/toggle**: Remove `.show` from `.filter_content` on page load, add click handler on `.filter_header` to toggle `.show`
- **Search widget placeholders**: Set via JS (system loads form async), run at 0s + 500ms + 1500ms + 3000ms
- **Phone/email from footer**: `document.querySelector('footer a[href^="tel:"]')` → update CTA contacts. Auto-updates when user changes in panel.
- **Scroll reveal**: IntersectionObserver on `.PREFIX-reveal` elements
- **Smooth scroll**: `a[href^="#"]` click handler with `scrollIntoView`

## CSS Specificity — Nuclear Options
- System uses `.class` (specificity 0,1,0) and `.parent .child` (0,2,0)
- When system wins: add element type `section.class h2.class` (0,2,2) or double class `h2.class1.class2` (0,3,1)
- ALWAYS use `!important` on color overrides for dark-bg sections
- Example: `section.nj-owners-hero h2.nj-section-title.nj-section-title--light { color: #FFF !important; }`
- Dark hero/CTA sections need: title white, eyebrow light accent, subtitle white 85%, button white outline, labels light accent

## Header Measurement
- ALWAYS measure actual header height via DevTools (varies per client: 95px, 120px, 175px...)
- padding-top for subpages = header height + 10px
- Header class varies: `.defaultsb`, `.default13`, etc. — check per client!
- `position: fixed` (NOT sticky!) — sticky creates gap on subpages

## Stacking Context Traps
- Slick slider `.slick-current` has `z-index: 999`
- `.index-info` (search widget container) MUST have `z-index: 1000` to be ABOVE slider
- `.index-info` MUST have `overflow: visible` for dropdowns
- fullpage.js `.fp-section` creates stacking context → needs z-index management
- Litepicker calendar: `width: fit-content` (default 944px is too wide)
- System puts `z-index: -1` on ALL form inputs → override with `z-index: 2 !important`

## /offers Page — Complete Styling Guide
### Filter sidebar
| Selector | Fix |
|----------|-----|
| `.filter_header` | Click handler → toggle `.show` on next sibling `.filter_content` |
| `.filter_content.collapse` | `:not(.show) { display: none }` + `.show { display: block }` |
| `.filter_header .fa-angle-down` | **FontAwesome NOT LOADED in IdoSell!** Hide with `display: none` |
| `.filter_header::after` | CSS-only chevron: `border-right + border-bottom` rotated 45deg, animate to -135deg on expand |
| `h4` in sidebar | System orange → brand color |
| `.btn-filter` / `.btn[name="filter"]` | System orange → brand color |

### Filter Chevron Pattern (GLOBAL — FA not loaded in IdoSell!)
FontAwesome `.fa-angle-down` icons render as invisible 0x0 elements (fontFamily: "Inter", no glyph).
**ALWAYS use CSS-only chevrons via `::after`**:
```css
/* Hide broken FA icon */
body.page-offers .filter_header .fa-angle-down,
body.page-offers .filter_header .fa {
  display: none !important;
}
/* CSS-only chevron — always visible, no FA dependency */
body.page-offers .filter_header::after {
  content: "" !important;
  display: inline-block !important;
  width: 10px !important; height: 10px !important;
  border-right: 2px solid #BRAND_HEX !important;
  border-bottom: 2px solid #BRAND_HEX !important;
  transform: rotate(45deg) !important;
  transition: transform 0.3s ease !important;
  flex-shrink: 0 !important;
  margin-left: 12px !important; margin-top: -3px !important;
}
/* Rotate UP when expanded */
body.page-offers .filter_header[aria-expanded="true"]::after {
  transform: rotate(-135deg) !important;
  margin-top: 3px !important;
}
```
- Filter header: flex layout, border, rounded corners, hover effect
- Chevron: pure CSS borders (no font dependency!)
- aria-expanded toggle via JS in body_bottom

### Offer cards
| Selector | Fix |
|----------|-----|
| `.accommodation-buttons > a > span.btn` | Flexbox centering (height/line-height/padding conflict) |
| `.accommodation-item h2, h3` | Brand font, normalized size |
| `.accommodation-price` | Font-size normalize |
| `h1.big-label` | `display: none` |

## Body Font-Size Reset — CRITICAL
```css
body { font-size: 16px !important; }
```
IdoSell sets body to 22.4px (140% of 16px html). Without reset, EVERYTHING on subpages is 40% too large.

## Wikimedia Commons CDN Rules
- Thumbnails 700-900px: BLOCKED by Wikimedia CDN in IdoSell context
- Thumbnails <=600px: ALWAYS work
- Thumbnails 1200px: UNSTABLE
- **Rule**: ALL Wikimedia URLs must use `/600px-` maximum
- Alternative: use client's own photos from panel gallery

## CRITICAL: Phone Number Space Trap
- IdoSell panel stores phone as `tel:+48 883791911` (WITH SPACE between +48 and number)
- This makes `tel:` links broken on mobile (space in href = invalid phone number)
- **Appears EVERYWHERE**: footer, /contact, /offer pages, CTA buttons
- Footer phone is system-generated — cannot fix via CSS/HTML
- **FIX in JS (body_bottom §8)**: When auto-pulling phone from footer to CTA buttons:
```javascript
ctaPhone.href = footerPhone.href.replace(/\s/g, '');
```
- **FIX in panel**: User MUST remove space from phone in panel settings
- **TEST**: Check ALL `a[href^="tel:"]` on every page for spaces

## CRITICAL: /txt/ URL Pattern — Must Include Numeric ID
- IdoSell CMS pages use pattern: `/txt/NNN/Slug` (e.g., `/txt/202/Dla-Wlascicieli`)
- Without numeric ID → `/txt/dla-wlascicieli` → **404 NOT FOUND**
- **ALWAYS use full path** with ID in all link hrefs
- **TEST**: Verify ALL `/txt/` links match `/^\/txt\/\d+\//` pattern

## CRITICAL: Two Different Emails on Offer Pages
- System-generated offer contact uses email from OFFER SETTINGS (e.g., `service24@poczta.onet.pl`)
- Footer/CTA uses email from PANEL SETTINGS (e.g., `marior1@op.pl`)
- These are DIFFERENT emails — not a bug, but user should verify both are correct
- **CHECK**: Are offer contact emails matching the owner's actual email?

## Testing Workflow — MANDATORY for Every Project

### Test Script: `testy/test_links.js`
Every project MUST have a test script in `testy/` folder. Run in Chrome Console (F12) on each page.

### 8 Standard Tests:
1. **All visible links** — list with href, text, clickable status, dimensions
2. **Link href validation** — broken /txt/ (missing ID), phone spaces, invalid mailto, placeholders, pointer-events:none, zero-size
3. **System orange detection** — scan ALL visible elements for `rgb(173, 80, 9)`
4. **Body font-size** — must be 16px (not system 22.4px)
5. **Broken images** — `naturalWidth === 0` on visible images
6. **Search widget** (homepage) — `.index-info` overflow:visible, z-index >= 1000
7. **Offer detail page** — price circle circular, ghost form hidden, ZAREZERWUJ font <= 16px
8. **Expected nav links** — verify /offers, /contact, /txt/NNN/* all present

### Pages to Audit (EVERY project):
- `/` (homepage)
- `/offers`
- `/contact`
- ALL `/txt/NNN/*` subpages
- ALL `/offer/ID/*` individual offers (check EACH one!)

### Audit Checklist Per Page:
```
[ ] bodyFont === 16px
[ ] orangeCount === 0
[ ] brokenImages === 0 (or explained — missing panel photos)
[ ] brokenTxtLinks === 0
[ ] phone links have no spaces
[ ] email links are clickable (pointer-events !== 'none')
[ ] (offers) priceCircle is circular (w === h ± 5px)
[ ] (offers) ghostForm hidden
[ ] (offers) ZAREZERWUJ font <= 16px
[ ] (homepage) search widget z-index >= 1000
[ ] (homepage) .index-info overflow: visible
```

### When to Run Tests:
1. **After first CSS build** — baseline audit
2. **After each session of fixes** — regression check
3. **Before delivery to user** — final audit
4. **After user pastes to panel** — live verification

## Master Template Structure
```
[CLIENT]/
  DO_WKLEJENIA/
    [PREFIX]_ARKUSZ_STYLOW.css      ← ALL CSS, zero inline styles
    [PREFIX]_HEAD.html               ← Google Fonts, meta viewport
    [PREFIX]_KONIEC_BODY_JS.html     ← Global JS (body_bottom)
    GLOWNA_PL__cms.html              ← Homepage CMS content
    GLOWNA_PL__body_bottom.html      ← Homepage-specific JS
    ATRAKCJE_PL__body_top.html       ← Subpage content
    [MORE_PAGES]_PL__body_top.html
    INSTRUKCJA.txt                    ← Paste guide for user
  testy/
    test_links.js                     ← Chrome Console test script
    test_offers.js                    ← Offer page specific tests (optional)
  claudedocs/
    audit_report.md                   ← Full audit results
```

## Build Order (Optimized from 5 Projects)
1. **Recon** — open panel, scrape offer photos, measure header height, identify header class
2. **CSS reset section** — body 16px, system orange override, header fixed, dark overlay kill
3. **CSS hero section** — slider, gradient, H1/H2, search widget with ALL traps fixed
4. **CSS subpages** — /offers (filters, cards, hide .iai-search), /contact, /offer detail
5. **Homepage CMS** — hero text, offer cards with REAL photos, features, CTA
6. **Custom subpages** — per client (Atrakcje, Galeria, Dla Wlascicieli, etc.)
7. **JS body_bottom** — FAQ toggle, filter collapse, search placeholders, phone/email auto-pull
8. **HEAD** — Google Fonts link
9. **TEST** — run test script on ALL pages, fix issues
10. **AUDIT** — full 8-page audit, compile report
11. **INSTRUKCJA** — paste guide for user
12. **EN version** — after PL is verified

---

## Lessons v1.66-v1.69 (Fair Rentals + RPA — May 2026)

### Trap #32: body_top inline `style="background-image: url(...)"` wycinany przez sanitizer
- Symptom: hero baner pusty mimo wkleju z inline style
- Detection: live curl pokazuje `<section class="fr-page-hero">` bez `style` attribute
- Fix: użyj klasy modyfikator (`fr-page-hero--attractions`) + reguła w arkuszu stylów
- Reference: `feedback_idobooking_body_top_inline_style_stripped.md`

### Trap #33: Body_bottom 62KB SILENT TRUNCATE
- Symptom: JS nie inicjalizuje, brak boot() w console
- Limit: ~62KB (precisely tested at 63488 bytes)
- Fix: minify script (zachowaj source w `_source/`), trim verbose comments
- Reference: `feedback_idobooking_body_bottom_size_limit.md`

### Trap #34: Powered by IdoBooking — wymóg licencyjny
- WSZYSCY klienci muszą mieć `.powered_by` widoczne w stopce
- Acceptable: `opacity: 0.7-1.0`, `max-height: 22px`
- Forbidden: `display: none`, `visibility: hidden`, `opacity: 0`
- Audit każdy projekt na sign-off

### Trap #35: `position: absolute + top: 50%` zjeżdża gdy parent rośnie
- Logo/hamburger z `top: 50%` na header → spada w środek menu gdy menu open (parent .navbar rośnie 65→388px)
- Fix: `top: 12px` (fixed pixel) zamiast `top: 50% + translateY(-50%)`
- Apply do logo, hamburger, language selector

### Trap #36: Litepicker `<select>` z `appearance:none` pusty na iPhone Safari
- Symptom: header kalendarza pokazuje pusto zamiast "maj" / "czerwiec"
- iPhone Safari nie renderuje selected option text gdy custom font + `appearance:none`
- Fix: `dropdowns: isDesktop ? {...} : false` — na mobile użyj `<strong>maj</strong>` plain text
- Apply do każdego Litepicker init na mobile

### Trap #37: Grid `repeat(7, 1fr)` overflow gdy content > parent
- `1fr` = `minmax(auto, 1fr)` — kolumny mają min-content size
- 7 cells × content "niedz." (52px each) = 364px overflow gdy parent 290px
- Fix: `repeat(7, minmax(0, 1fr))` — minimum 0, max 1fr (kompresuje)
- Apply do `.litepicker .container__days`, `.month-item-weekdays-row`

### Trap #38: System widget weekday cells z `width: var(--litepicker-day-width)`
- Litepicker system CSS ustawia `width: 52px` na każdej komórce weekday
- Override grid `minmax(0, 1fr)` — komórki spillover
- Fix: `html body .litepicker .month-item-weekdays-row > div { width: auto !important; min-width: 0 !important; }`

### Trap #39: CSS ≤450KB (admin OOM at ~500KB)
- Fair Rentals 460KB → admin zgłosił memory error w panelu
- Refactor: usunięcie USUNIETE komentarzy + strip indentacji = -50KB
- Cel: build CSS poniżej 400KB od początku (compact comments)
- Use `idosell-css-refactor` skill jeśli zbliżasz się do 450KB

### Trap #40: Google Maps embed z `key=AIza...` triggers GitHub secret scanning
- Public demo key Google używany w setkach tutoriali → GitHub secret scanning alert
- Fix: użyj `maps.google.com/maps?q=<address>&output=embed` (publiczny embed, BEZ klucza)
- NIGDY nie zostawiaj `embed/v1/place?key=AIza...` w panelu

### Trap #41: Parallax-slider bg leak (RPA CRITICAL-X v1.9)
- Dark gradient overlay na slider widoczny przez full-width sections
- Fix: aggressive `.parallax-slider::before { display: none !important }` + bg-color reset
- Affects hero section visibility on mobile

### Trap #42: Footer white strip (RPA CRITICAL-Q v2.0)
- System footer pokazuje white strip pomiędzy CTA a stopką
- Fix: `html body footer { margin-top: 0 !important; padding-top: 0 !important; }`

### Trap #43: Z-index hierarchy battles
- Header musi mieć z-index ≥100 żeby przykryć hero
- Hero parallax-slider z-index 1
- Index-info z-index 1000 (search widget musi być nad sliderem)
- Litepicker z-index 99999
- Cookie banner z-index 100000

### Trap #44: §FR-CLIENT block (client custom CSS preservation)
- Klient czasem sam dodaje regułki bezpośrednio w panelu CSS
- Pattern: section §99-CLIENT na końcu pliku z client edycjami
- NIE NADPISYWAĆ przy update — preserve as-is, replace całość przy delivery
- Reference: `feedback_preserve_client_css_block.md`

### Workflow Discipline (z v1.58→v1.62 sagi)
- Jeśli bug WRACA po fixie → diagnoza była WRONG, nie insufficient
- NIE eskaluj defensywności (MutationObserver, periodic check, more timeouts)
- Re-investigate z zero: sprawdź WSZYSTKO (visibility + display + opacity + parent + children chain)
- Reference: `feedback_iterative_debugging_discipline.md`, `feedback_element_invisible_debug_checklist.md`

### Mandatory pre-deploy checks (skill: idosell-deploy-cr)
1. Secret scan (AIza, sk_live, gh_*, Bearer tokens) — BLOCK if found
2. body_bottom size <62KB — BLOCK if exceeded
3. body_top brak `<script>`, `<style>`, inline `style="bg-image"`, emoji — BLOCK
4. Powered by IdoBooking visible (no `display:none`) — BLOCK
5. CSS ≤450KB recommended (warning)
6. Mobile viewport tested (390x844x3 minimum)

### Mandatory post-deploy verify (skills: idosell-seo-audit + idosell-e2e-test)
1. `curl -sI https://client<ID>.idobooking.com/` → 200/301
2. Lighthouse audit mobile + desktop (Performance, SEO, A11y, BP)
3. 8 critical flows E2E (homepage → search → results → detail → booking)
4. Visual regression vs baseline screenshots
