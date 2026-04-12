# IdoSell/IdoBooking — System Architecture Reference

**Purpose**: Complete technical reference for building client websites on IdoSell platform.
**Audience**: Claude Code — to be used as context when generating pages from brief.
**Last updated**: 2026-03-24

---

## 1. Platform Architecture

### URL Structure
```
client[ID].idosell.com     → panel admin + strona klienta
engine[ID].idobooking.com  → silnik rezerwacji (redirect z client*.idosell.com)
```
Wersje językowe: `/de`, `/en` (prefix w URL).
Podstrony CMS: `/txt/[ID]/[slug]` (ID nadawane przez CMS przy tworzeniu).
Oferta (auto): `/offers` — nie edytowalna w CMS, tylko CSS.
Pojedyncza oferta: `/offer/[ID]/[slug]` — automatyczna.

### Body Classes (per page type)
| Strona | Body class | Edytowalna? |
|--------|-----------|-------------|
| Główna | `page-index` | TAK (CMS + CSS + JS) |
| Podstrona CMS | `page-txt` | TAK (CMS + CSS + JS) |
| Oferta listing | `page-offers` | NIE (tylko CSS) |
| Pojedyncza oferta | `page-offer` | NIE (tylko CSS) |
| Kontakt | `page-contact` | Częściowo (CSS) |
| Promocje | `page-promotions` | Częściowo (CSS) |

### DOM Hierarchy
```
<body class="page-index|page-txt|page-offers">
  <nav class="skiplinkmenu">                    ← a11y skip link (system)
  <header class="defaultsb">                    ← NAGŁÓWEK (system, stylowalny)
    <div class="container page-top">             ← max-width: 1170px
      <div class="page-top__options">            ← telefon, email, social, język
        <button class="page-top__see-widget">    ← "Rezerwuj online" mobile
      <nav class="navbar">                       ← MENU (system, pozycje z panelu)
        <a class="navbar-brand">                 ← LOGO (z panelu)
        <ul class="navbar-nav">                  ← pozycje menu

  <main id="pageContent" class="page">
    <div class="section parallax">               ← HERO + SLIDER (system)
      <div id="parallax_topslider" class="parallax-slider slick-initialized">
        <div class="slick-slide">                ← zdjęcia z panelu (kolejność wrzucenia)
          <picture>
            <img src="/images/frontpageGallery/pictures/large/X/Y/ZZ_full.jpg">
      <div class="customtext animated">          ← ← ← TU JEST SILNIK WYSZUKIWARKI
        <div class="iai-search">
          <div class="iai_frontpage">
            <form id="iai_book_form">
              <div class="datefrom widget__option">
              <div class="dateto widget__option">
              <div class="formbutton">

    <!-- STRONA GŁÓWNA (page-index): -->
    <div class="container">
      <div class="row cmshotspot">               ← Wyróżnione oferty (karuzela system)
    <div class="about-main-description container">
      <div class="cmsbenefits__w100">            ← ← ← STRONA GŁÓWNA CMS CONTENT
      <div class="cms aboutmain">
        <div class="container aboutmain__content">
          <div class="col-12 cms-html">          ← ← ← TU LĄDUJE HTML Z CMS

    <!-- PODSTRONA CMS (page-txt): -->
    <div class="container">
      <h1 class="big-label">                     ← Tytuł strony (system, ukrywamy CSS)
      <div class="row">
        <div class="col-12">
          <div class="txt-text">                 ← ← ← TU LĄDUJE HTML Z CMS
            <div class="mb-5">                   ← każda sekcja CMS owinięta w mb-5

    <!-- STRONA OFERT (page-offers): -->
    <div class="container">
      <div class="col-12 offers_content" id="offers_list">
        <h1 class="big-label">                   ← "Villa Kapitańska" (system)
        <div class="offerslist container">        ← karty ofert (system)

  <footer>                                        ← STOPKA (system, zasilana z panelu)
    <div class="footer-wrapper container">
      <a class="footer-contact__logo">            ← logo
      <div class="footer-contact col-12">         ← telefon, email
      <div class="footer-adress-wrapper">         ← adres, "wyznacz trasę"
    <div class="footer-contact-add">
      <div class="footer-contact-baner">          ← ikony płatności
      <div class="powered_by">                    ← "Powered by IdoSell"
```

---

## 2. Container & Layout System

### Container Width
- **Max-width: 1170px** (stałe, Bootstrap-based)
- **Padding: 0px** (brak paddingu na kontenerze — my dodajemy w sekcjach)

### Full-Width Escape Pattern
CMS content ląduje w `.container` (1170px). Żeby sekcje były full-width:

```css
.[prefix]-full {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
}
```

**UWAGA**: Na stronie głównej content jest w `.cms-html` wewnątrz `.aboutmain__content > .container`.
Na podstronach txt jest w `.txt-text` wewnątrz `.col-12 > .row > .container`.

Obie ścieżki wymagają tego samego escape pattern.

### System Overrides (wymagane na każdej stronie)
```css
/* Ukryj systemowy nagłówek H1 */
h1.big-label { display: none !important; }

/* Usuń marginesy systemowe */
.about-main-description { padding: 0 !important; margin: 0 !important; }
.aboutmain__content { padding: 0 !important; }
.cms-html { padding: 0 !important; }
.txt-text { padding: 0 !important; }
.txt-text > .mb-5 { margin-bottom: 0 !important; }

/* Full-width fix */
.page .container { overflow: visible; }
```

---

## 3. Silnik Wyszukiwarki (Booking Widget)

### Lokalizacja
- Strona główna: ZAWSZE widoczny w `.customtext.animated` wewnątrz `.section.parallax`
- Podstrony txt: WIDOCZNY (slider + silnik też są)
- /offers: WIDOCZNY
- /offer/[id]: BRAK slidera i silnika

### Klasy CSS silnika
```
.iai-search                     → główny wrapper
  .iai_frontpage                → kontener formularza
    .iai_book_trigger           → przycisk mobile "Rezerwacja online"
      span                      → tekst
      b                         → ikona (tło ustawiane inline <style>)
    #iai_book_form              → formularz
      .datefrom.widget__option  → pole "Początek"
        .iaiicon-calendar       → ikona kalendarza
        label                   → "Początek"
        input#iai_booking_date_from
      .dateto.widget__option    → pole "Koniec"
        .iaiicon-calendar       → ikona kalendarza
        label                   → "Koniec"
        input#iai_booking_date_to
      .formbutton               → wrapper przycisku
        button[type="submit"]   → "Rezerwuj online"
```

### Kolor silnika
Kolor akcentu silnika ustawiany jest inline `<style>` wewnątrz `.iai-search`:
```css
.iai_book_trigger b { background: #12374a; }
#iaicalendar td.iaiactiveday { background: #3f51b5; }
```
Kolor pochodzi z panelu (schemat kolorystyczny).

### Ukrywanie silnika na konkretnych stronach
```css
.page-txt .iai-search { display: none !important; }
/* lub na konkretnej podstronie: */
body.page-txt .section.parallax .iai-search { display: none !important; }
```

### Stylowanie silnika (przykład)
```css
.iai-search {
  position: absolute;
  bottom: 40px;
  left: 50vw;
  transform: translateX(-50%);
  z-index: 10;
  /* ... */
}
#iai_book_form {
  display: flex !important;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 20px;
  gap: 16px;
}
.formbutton button {
  background: var(--brand-color);
  color: #fff;
  border-radius: 8px;
  padding: 12px 24px;
}
```

---

## 4. Slider / Hero

### System
- Komponent: Slick Slider (`slick-initialized slick-slider`)
- Zdjęcia: z panelu (Multimedia → Galeria zdjęć → Strona główna)
- Format URL: `/images/frontpageGallery/pictures/large/X/Y/ZZ_full.jpg`
- Kolejność: wg kolejności wrzucenia do panelu
- Responsywne: system sam serwuje odpowiedni rozmiar via `<picture><source>`

### Kontrola slidera CSS
```css
/* Zamróź na jednym slajdzie */
.slick-slide { opacity: 0 !important; }
.slick-slide[data-slick-index="0"] { opacity: 1 !important; }
.slick-prev, .slick-next { display: none !important; }
.slick-dots { display: none !important; }

/* Overlay na sliderze */
.section.parallax { position: relative; }
.section.parallax::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
  z-index: 1;
}
.customtext { position: relative; z-index: 2; }
```

### Hero Text Overlay
Na stronie głównej tekst hero jest w systemowym `<h1>` + subtitle w `.customtext`.
Ale na Willi Kapitańskiej widzimy custom HTML w `.customtext` — to content wpisany w panelu:
- Wizytówka → Konfiguracja strony → Nagłówek strony głównej
- Wizytówka → Konfiguracja strony → Podtytuł strony głównej

---

## 5. Menu / Nawigacja

### System
- Automatyczne z panelu (Treści → Menu)
- Klasy: `.navbar`, `.navbar-nav`, `.navbar-brand`
- Logo: `/images/owner/wideLogo.png` (z panelu)
- Mobile: hamburger (system)
- Pozycje menu: dodawane w panelu, linkują do `/txt/[ID]/[slug]`

### Stylowanie
```css
.navbar { /* tło, padding */ }
.navbar-nav a { /* kolor, font, spacing */ }
.navbar-brand img { /* rozmiar logo */ }
.page-top { /* top bar z telefonem, social */ }
.page-top__options { /* kontener opcji */ }
```

---

## 6. Stopka (Footer)

### System — zasilana z panelu
- Logo, telefon, email, adres — wszystko z danych w panelu
- "WYZNACZ TRASĘ" → link do `/contact`
- Regulamin, Polityka prywatności → systemowe linki
- "Powered by IdoSell" → obowiązkowe

### Klasy
```
footer
  .footer-wrapper.container
    .footer-contact__logo     → logo
    .footer-contact           → telefon, email
    .footer-adress-wrapper    → adres
      .footer-adress          → tekst adresu
      .footer-road            → link "wyznacz trasę"
  .footer-contact-add
    .footer-contact-baner     → ikony płatności (Visa, MC)
    .powered_by               → "Powered by IdoSell"
```

---

## 7. Zdjęcia

### Hosting
Zdjęcia wrzucane w panelu → dostępne pod URL:
```
/images/frontpageGallery/pictures/large/X/Y/ZZ_full.jpg   → slider główna
/images/objects/pictures/large/X/Y/ZZ.jpg                  → zdjęcia ofert
/images/owner/wideLogo.png                                 → logo
```

### Limity
- Max rozmiar: 10MB per zdjęcie
- System sam optymalizuje i serwuje responsive via `<picture><source>`
- Zdjęcia dodane do slidera = galeria frontpage
- Zdjęcie użyte gdzieś na stronie (np. w ofercie) = nie pojawi się w karuzeli

### Użycie w custom HTML
Gdy potrzebujemy zdjęcia w sekcji CMS, podajemy pełny URL:
```html
<img src="/images/frontpageGallery/pictures/large/0/0/74_full.jpg"
     alt="Opis zdjęcia" loading="lazy">
```

---

## 8. Wielojęzyczność

### Mechanizm
- Ręczna duplikacja treści per język
- Każda podstrona CMS ma zakładki językowe (polski, angielski, niemiecki...)
- URL: `/de/txt/[ID]/[slug]`, `/en/txt/[ID]/[slug]`
- Ten sam ID strony, inny prefix językowy
- Menu: system automatycznie serwuje wersję wg języka
- Przełącznik języka: `.language__toggler` (system)

### Flagi
```
.flags a[hreflang="pl"] → /
.flags a[hreflang="de"] → /de
.flags a[hreflang="en"] → /en
```

---

## 9. Pola CMS per podstrona

### Podstrona CMS (txt)
Panel: `/panel/frontpage/editsubpage/id/[ID]`

Każda podstrona ma per język:
| Pole w panelu | Co tam wklejamy | Uwagi |
|---------------|-----------------|-------|
| **Początek sekcji Body** | Czysty HTML (treść strony) | To jest nasz główny content |
| **Koniec sekcji Body** | JavaScript w `<script>` | Animacje, interakcje |
| **Sekcja Head** | Meta tagi, fonty | Tylko jeśli potrzebne per strona |

### Strona główna
Panel: Wygląd → Strona główna → Edytor treści

| Pole | Co wklejamy |
|------|-------------|
| Treść CMS (HTML mode) | Custom HTML strony głównej |
| Nagłówek | H1 na hero |
| Podtytuł | Tekst pod H1 na hero |

### Arkusz stylów CSS
Panel: Wygląd → Arkusz stylów CSS (ACE editor)

**JEDEN GLOBALNY** plik CSS na cały serwis. Zawiera:
- `:root` z design tokens
- System overrides
- Wszystkie sekcje i komponenty
- Stylowanie silnika
- Stylowanie menu/stopki
- Responsive breakpoints

### Head globalny
Panel: Ustawienia → Kody śledzące → Sekcja Head

Google Fonts, OG tags, meta descriptions.

### End Body globalny
Panel: Ustawienia → Kody śledzące → Koniec BODY

Globalny JavaScript (analytics, animacje).

---

## 10. Naming Convention

### Prefix per klient
2-3 literowy prefix od nazwy klienta:
```
vk- → Villa Kapitańska
md- → Madera
mc- → Mazurski Chill
wb- → WawaBed
ga- → Golden Apartments
ca- → CityApart
et- → Eagle Tower (master template)
```

### BEM Pattern
```css
.[prefix]-section           → sekcja (wrapper)
.[prefix]-section--dark     → wariant ciemny
.[prefix]-section--muted    → wariant jasny tint
.[prefix]-inner             → kontener wewnętrzny (max-width)
.[prefix]-full              → full-width escape
.[prefix]-h2                → nagłówek sekcji
.[prefix]-label             → eyebrow text
.[prefix]-rule              → dekoracyjna linia
.[prefix]-btn               → przycisk primary
.[prefix]-btn--ghost        → przycisk outline
.[prefix]-split             → layout 2-kolumnowy
.[prefix]-split__text       → kolumna tekstowa
.[prefix]-split__img        → kolumna ze zdjęciem
.[prefix]-hero              → hero podstrony
.[prefix]-hero__title       → tytuł hero
.[prefix]-hero__kicker      → kategoria nad tytułem
.[prefix]-cta-bar           → pasek CTA na dole strony
.[prefix]-amenities         → grid udogodnień
.[prefix]-places            → lista miejsc/atrakcji
.[prefix]-photos            → grid galerii zdjęć
```

---

## 11. Plik-Folder Structure per klient

```
[client-name]/
├── DO_WKLEJENIA/
│   ├── INSTRUKCJA.txt
│   ├── [PREFIX]_ARKUSZ_STYLOW.css          → panel: Arkusz stylów CSS
│   ├── [PREFIX]_HEAD.html                  → panel: Sekcja Head (globalny)
│   ├── [PREFIX]_KONIEC_BODY_JS.html        → panel: Koniec Body (globalny)
│   ├── STRONA_GLOWNA_PL__body_top.html     → panel: Strona główna CMS
│   ├── ONAS_PL__body_top.html              → panel: txt/[ID] → Początek Body
│   ├── ONAS_PL__body_bottom.html           → panel: txt/[ID] → Koniec Body
│   ├── GALERIA_PL__body_top.html
│   ├── GALERIA_PL__body_bottom.html
│   ├── ATRAKCJE_PL__body_top.html
│   ├── ATRAKCJE_PL__body_bottom.html
│   └── ... (wersje _EN, _DE jeśli wielojęzyczne)
└── [opcjonalne pliki robocze, screenshoty]
```

---

## 12. Wyróżnione Oferty (Featured Offers)

### System
Automatycznie generowane z obiektów oznaczonych jako "wyróżnione" w panelu.
Na stronie głównej wyświetlane jako karuzela Slick Slider.

### Klasy CSS
```
.cmshotspot                          → główny kontener
  .col-12
    h2.big-label.line-label          → "Wyróżnione Oferty" (system)
    .offerslist.slick-initialized    → karuzela Slick
      .slick-prev / .slick-next      → strzałki
      .slick-list
        .slick-track
          .slick-slide
            .offer                   → pojedyncza karta oferty
              a.object-icon          → link + zdjęcie
                img                  → zdjęcie oferty
                .offer__hover        → overlay na hover
                  p.offer__description
              h3                     → nazwa oferty
                a                    → link do oferty
              .offer__box            → info + cena
                .offer__info
                  .accommodation-meters  → metraż (icon + text)
                  .accommodation-roomspace → osoby (icon + text)
                .offer__price
                  small              → "Od"
                  span.price         → cena
```

### Strategia stylowania
Przejmujemy wygląd kart ofert przez CSS, dopasowując do stylu strony:
```css
/* --- Featured Offers Restyle --- */
.cmshotspot h2.big-label {
  /* Nadpisz systemowy nagłówek na nasz styl */
  font-family: var(--[xx]-font-heading) !important;
  color: var(--[xx]-text) !important;
}
.cmshotspot .offer {
  border-radius: var(--[xx]-radius);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}
.cmshotspot .offer:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.cmshotspot .offer h3 a {
  font-family: var(--[xx]-font-heading);
  color: var(--[xx]-text);
}
.cmshotspot .offer__price .price {
  color: var(--[xx]-brand);
  font-weight: 700;
}
.cmshotspot .slick-prev, .cmshotspot .slick-next {
  /* Dostosuj strzałki do brand */
}
/* Ewentualnie ukryj domyślne elementy: */
.cmshotspot h2.big-label { display: none !important; }
/* I dodaj własny nagłówek w CMS HTML nad hotspot */
```

---

## 13. Aktualności / News / Blog

### System
Systemowy moduł bloga, zarządzany w panelu (Treści → Aktualności).
Na stronie głównej automatycznie wyświetla ostatnie wpisy.

### Klasy CSS
```
.news-container                → główny kontener
  h2.big-label.line-label      → "Aktualności" (system)
  .news-wrapper.row
    .news-item.col-md-6.col-12  → pojedynczy wpis
      h3 > a                    → tytuł wpisu
      .news-date                → data
      .news-content             → treść wpisu (HTML)
      a.more-news.btn           → "czytaj więcej"
```

### URL
- Lista newsów: `/news` (lub panel ustawi inny slug)
- Pojedynczy: `/news/[ID]/[slug]`

### Strategia: ukryć na głównej, osobna podstrona
News ukrywamy na stronie głównej:
```css
/* Ukryj news na głównej */
.page-index .news-container { display: none !important; }
```

Blog/aktualności i tak żyją pod `/news` — system generuje tę podstronę.
Stylujemy ją CSS:
```css
/* --- Blog/News Styling --- */
.page-news .news-item {
  border-radius: var(--[xx]-radius);
  background: var(--[xx]-bg-alt);
  padding: 24px;
  margin-bottom: 24px;
}
.page-news .news-item h3 a {
  font-family: var(--[xx]-font-heading);
  color: var(--[xx]-text);
}
.page-news .news-date {
  color: var(--[xx]-text-muted);
  font-size: 0.85rem;
}
.page-news .more-news {
  background: var(--[xx]-brand);
  color: var(--[xx]-white);
  border-radius: var(--[xx]-radius);
}
```

### Treść blogowa pod SEO / AI Search
Aktualności powinny być zasilane treścią wartościową pod wyszukiwarki:
- Artykuły o okolicy, atrakcjach, sezonach
- Poradniki dla gości (co zabrać, jak dojechać)
- Opisy wydarzeń lokalnych
- Sezonowe promocje i oferty specjalne
- Opis udogodnień i zmian w obiekcie

Format wpisu blogowego:
```html
<h3>Tytuł artykułu z frazą kluczową</h3>
<p>Treść minimum 300 słów, naturalna, wartościowa.</p>
<p>Zawierać: frazy lokalne (miasto, region), nazwy atrakcji,
   sezonowość, linki wewnętrzne do ofert.</p>
```

---

## 14. Strona /offers (listing ofert)

### System
Automatycznie generowana, NIE edytowalna w CMS. Tylko CSS.

### Klasy CSS
```
body.page-offers
  .offers_content#offers_list
    h1.big-label                → nazwa obiektu (ukrywamy)
    .offers__label              → etykieta/filtr
    .offerslist.container
      .offers_wrapper.row
        .offer                  → karty ofert (te same co w hotspot)
```

### Stylowanie
```css
/* --- Offers Page --- */
.page-offers .offerslist .offer {
  /* Te same style co w .cmshotspot .offer */
  border-radius: var(--[xx]-radius);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
```

---

## 15. Standardized Workflow

### Kolejność tworzenia plików

```
1. [PREFIX]_ARKUSZ_STYLOW.css        ← PIERWSZY — cały CSS
2. [PREFIX]_HEAD.html                ← Google Fonts, meta
3. STRONA_GLOWNA_PL__cms.html       ← treść głównej (Edytor treści CMS)
4. ONAS_PL__body_top.html           ← podstrona O nas
5. GALERIA_PL__body_top.html        ← podstrona Galeria
6. ATRAKCJE_PL__body_top.html       ← podstrona Atrakcje
7. [inne podstrony]__body_top.html
8. [PREFIX]_KONIEC_BODY_JS.html      ← globalny JS (animacje, fade-in)
9. INSTRUKCJA.txt                    ← instrukcja wklejania
```

### Zasady standardowe

**Strona główna:**
- Treść w Edytorze treści CMS (HTML mode)
- Hero: z panelu (Nagłówek + Podtytuł + slider zdjęć)
- Wyróżnione oferty: system (stylujemy CSS)
- Aktualności: UKRYTE na głównej (CSS `display:none`)
- Sekcje CMS: powitanie, udogodnienia, lokalizacja/odległości, opinie, CTA

**Podstrony CMS (txt):**
- Treść w "Początek sekcji Body" (czysty HTML)
- JS w "Koniec sekcji Body" (jeśli potrzebny)
- Silnik wyszukiwarki: ukryty CSS na podstronach (`display:none`)
- Każda podstrona: hero (CSS background) → sekcje treści → CTA bar

**CSS:**
- JEDEN globalny arkusz
- `:root` design tokens na górze
- System overrides zaraz po tokenach
- Komponenty w logicznej kolejności
- System elements (hotspot, offers, news) na końcu
- Responsive breakpoints: 1200px, 768px, 480px

**JS:**
- JEDEN globalny plik (Koniec BODY)
- Fade-in animations (IntersectionObserver)
- Smooth scroll
- Ewentualne lightbox/galeria

**Pliki:**
- Naming: `[PAGE]_[LANG]__body_top.html` / `__body_bottom.html`
- Strona główna: `__cms.html` (bo idzie do Edytora treści, nie do Body)
- INSTRUKCJA.txt w każdym `DO_WKLEJENIA/`

---

## 16. CSS Architecture Template (FULL)

```css
/* ============================================
   [CLIENT NAME] — Custom Stylesheet
   Panel: client[ID].idosell.com
   Prefix: [xx]-
   ============================================ */

/* --- Design Tokens --- */
:root {
  --[xx]-brand:        #______;   /* kolor główny */
  --[xx]-brand-hover:  #______;   /* hover */
  --[xx]-brand-light:  #______;   /* jasny tint (tła sekcji) */
  --[xx]-text:         #______;   /* kolor tekstu */
  --[xx]-text-muted:   #______;   /* tekst drugorzędny */
  --[xx]-bg:           #______;   /* tło strony */
  --[xx]-bg-alt:       #______;   /* tło alternatywne sekcji */
  --[xx]-white:        #ffffff;
  --[xx]-radius:       8px;       /* border-radius */
  --[xx]-max-width:    1170px;    /* STAŁE — nie zmieniać */
  --[xx]-section-pad:  80px;      /* padding sekcji desktop */
  --[xx]-section-pad-m: 48px;     /* padding sekcji mobile */
  --[xx]-font-heading: 'Playfair Display', serif;
  --[xx]-font-body:    'Inter', sans-serif;
}

/* --- System Overrides --- */
h1.big-label { display: none !important; }
.about-main-description, .aboutmain__content, .cms-html, .txt-text { padding: 0 !important; }
.txt-text > .mb-5 { margin-bottom: 0 !important; }
.page .container { overflow: visible; }

/* --- Full Width Escape --- */
.[xx]-full {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
}

/* --- Sections --- */
.[xx]-section {
  padding: var(--[xx]-section-pad) 0;
}
.[xx]-section--dark {
  background: var(--[xx]-brand);
  color: var(--[xx]-white);
}
.[xx]-section--muted {
  background: var(--[xx]-bg-alt);
}
.[xx]-inner {
  max-width: var(--[xx]-max-width);
  margin: 0 auto;
  padding: 0 24px;
}

/* --- Typography --- */
.[xx]-h2 {
  font-family: var(--[xx]-font-heading);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  color: var(--[xx]-text);
  text-align: center;
  margin-bottom: 16px;
}
.[xx]-label {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.85rem;
  color: var(--[xx]-brand);
  text-align: center;
  display: block;
  margin-bottom: 8px;
}

/* --- Buttons --- */
.[xx]-btn {
  display: inline-block;
  background: var(--[xx]-brand);
  color: var(--[xx]-white);
  padding: 14px 32px;
  border-radius: var(--[xx]-radius);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s, transform 0.2s;
}
.[xx]-btn:hover {
  background: var(--[xx]-brand-hover);
  transform: translateY(-1px);
}
.[xx]-btn--ghost {
  background: transparent;
  border: 2px solid var(--[xx]-brand);
  color: var(--[xx]-brand);
}

/* --- Layout: Split (2 columns) --- */
.[xx]-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

/* --- Hero (subpages) --- */
.[xx]-hero {
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--[xx]-white);
  background-size: cover;
  background-position: center;
}
.[xx]-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
}
.[xx]-hero__inner { position: relative; z-index: 1; }

/* --- CTA Bar --- */
.[xx]-cta-bar {
  background: var(--[xx]-brand);
  color: var(--[xx]-white);
  padding: 48px 0;
  text-align: center;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .[xx]-section { padding: var(--[xx]-section-pad-m) 0; }
  .[xx]-split { grid-template-columns: 1fr; gap: 24px; }
  .[xx]-hero { min-height: 240px; }
}
@media (max-width: 480px) {
  .[xx]-inner { padding: 0 16px; }
  .[xx]-btn { width: 100%; text-align: center; }
}

/* --- Booking Widget Styling --- */
.iai-search {
  position: absolute;
  bottom: 40px;
  left: 50vw;
  transform: translateX(-50%);
  z-index: 10;
  width: auto;
}
#iai_book_form {
  display: flex !important;
  align-items: center;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--[xx]-radius);
  padding: 12px 20px;
  gap: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}
.iai_book_trigger { display: none; }
.widget__option label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--[xx]-text-muted);
}
.widget__option input {
  border: none;
  font-size: 1rem;
  color: var(--[xx]-text);
}
.formbutton button {
  background: var(--[xx]-brand) !important;
  color: var(--[xx]-white) !important;
  border: none;
  border-radius: var(--[xx]-radius);
  padding: 12px 28px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}
.formbutton button:hover {
  background: var(--[xx]-brand-hover) !important;
}
/* Ukryj silnik na podstronach txt */
.page-txt .iai-search { display: none !important; }

/* --- Booking Widget Mobile --- */
@media (max-width: 768px) {
  .iai-search {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    width: 100%;
    padding: 0 16px;
  }
  #iai_book_form {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
  .formbutton button {
    width: 100%;
  }
}

/* --- Featured Offers (Hotspot) Restyle --- */
.cmshotspot {
  padding: var(--[xx]-section-pad) 0;
}
.cmshotspot h2.big-label {
  font-family: var(--[xx]-font-heading) !important;
  color: var(--[xx]-text) !important;
  font-size: clamp(1.75rem, 3vw, 2.5rem) !important;
  text-transform: none !important;
}
.cmshotspot .offer {
  border-radius: var(--[xx]-radius);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  background: var(--[xx]-white);
}
.cmshotspot .offer:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.cmshotspot .offer h3 a {
  font-family: var(--[xx]-font-heading);
  color: var(--[xx]-text);
  text-decoration: none;
}
.cmshotspot .offer__price .price {
  color: var(--[xx]-brand);
  font-weight: 700;
}
.cmshotspot .slick-prev,
.cmshotspot .slick-next {
  width: 44px;
  height: 44px;
  background: var(--[xx]-white);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 5;
}

/* --- Offers Page (/offers) --- */
.page-offers .offerslist .offer {
  border-radius: var(--[xx]-radius);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s;
}
.page-offers .offerslist .offer:hover {
  transform: translateY(-4px);
}
.page-offers h1.big-label { display: none !important; }

/* --- News: UKRYJ NA GŁÓWNEJ --- */
.page-index .news-container { display: none !important; }

/* --- News/Blog Page Styling --- */
.news-container {
  padding: var(--[xx]-section-pad) 0;
}
.news-container h2.big-label {
  font-family: var(--[xx]-font-heading) !important;
  color: var(--[xx]-text) !important;
}
.news-item {
  background: var(--[xx]-bg-alt);
  border-radius: var(--[xx]-radius);
  padding: 24px;
  margin-bottom: 24px;
}
.news-item h3 a {
  font-family: var(--[xx]-font-heading);
  color: var(--[xx]-text);
  text-decoration: none;
}
.news-date {
  color: var(--[xx]-text-muted);
  font-size: 0.85rem;
}
.more-news.btn {
  background: var(--[xx]-brand) !important;
  color: var(--[xx]-white) !important;
  border-radius: var(--[xx]-radius) !important;
  border: none !important;
}

/* --- Menu & Header --- */
.defaultsb {
  background: var(--[xx]-white);
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
}
.navbar-nav a {
  font-family: var(--[xx]-font-body);
  color: var(--[xx]-text) !important;
  font-weight: 500;
  letter-spacing: 0.5px;
}
.navbar-nav a:hover {
  color: var(--[xx]-brand) !important;
}
.page-top {
  background: var(--[xx]-brand);
  color: var(--[xx]-white);
}
.page-top a {
  color: var(--[xx]-white) !important;
}

/* --- Footer --- */
footer {
  background: var(--[xx]-text);
  color: rgba(255,255,255,0.8);
}
footer a {
  color: var(--[xx]-white) !important;
}
.footer-wrapper {
  padding: 48px 0 24px;
}

/* --- Fade-In Animations --- */
.[xx]-fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.[xx]-fade-in.[xx]-visible {
  opacity: 1;
  transform: translateY(0);
}

/* --- Slider Overlay --- */
.section.parallax { position: relative; }
.section.parallax::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%);
  z-index: 1;
  pointer-events: none;
}
.customtext { position: relative; z-index: 2; }
h1.page .big-label--hero,
.section.parallax h1 {
  color: var(--[xx]-white);
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

---

## 17. HTML Section Templates

### Sekcja: Intro z tekstem
```html
<div class="[xx]-full">
  <div class="[xx]-section">
    <div class="[xx]-inner">
      <span class="[xx]-label">Eyebrow</span>
      <h2 class="[xx]-h2">Tytuł sekcji</h2>
      <div class="[xx]-rule"></div>
      <p class="[xx]-text">Treść akapitu.</p>
    </div>
  </div>
</div>
```

### Sekcja: Split (tekst + zdjęcie)
```html
<div class="[xx]-full">
  <div class="[xx]-section [xx]-section--muted">
    <div class="[xx]-inner">
      <div class="[xx]-split">
        <div class="[xx]-split__text">
          <span class="[xx]-label">Eyebrow</span>
          <h2 class="[xx]-h2" style="text-align:left;">Tytuł</h2>
          <p>Treść...</p>
          <a href="#" class="[xx]-btn">Przycisk</a>
        </div>
        <div class="[xx]-split__img">
          <img src="/images/..." alt="Opis" loading="lazy">
        </div>
      </div>
    </div>
  </div>
</div>
```

### Sekcja: Grid udogodnień
```html
<div class="[xx]-full">
  <div class="[xx]-section">
    <div class="[xx]-inner">
      <span class="[xx]-label">Eyebrow</span>
      <h2 class="[xx]-h2">Udogodnienia</h2>
      <div class="[xx]-amenities">
        <div class="[xx]-amenity">
          <div class="[xx]-amenity__icon"><!-- SVG --></div>
          <h3 class="[xx]-amenity__title">Wi-Fi</h3>
          <p class="[xx]-amenity__desc">Opis</p>
        </div>
        <!-- repeat -->
      </div>
    </div>
  </div>
</div>
```

### Sekcja: CTA Bar
```html
<div class="[xx]-full">
  <div class="[xx]-cta-bar">
    <div class="[xx]-inner">
      <h2 style="color:#fff;">Zarezerwuj pobyt</h2>
      <p>Tekst zachęcający.</p>
      <a href="https://engine[ID].idobooking.com/search" class="[xx]-btn"
         style="background:#fff;color:var(--[xx]-brand);">Sprawdź dostępność</a>
    </div>
  </div>
</div>
```

---

## 18. Standard JavaScript Template (Koniec BODY)

```html
<!-- [CLIENT NAME] — Global JavaScript -->
<script>
/* Fade-in on scroll (IntersectionObserver) */
(function() {
  var prefix = '[xx]';
  var els = document.querySelectorAll('.' + prefix + '-fade-in');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add(prefix + '-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function(el) { obs.observe(el); });
  } else {
    /* Fallback: show all */
    els.forEach(function(el) { el.classList.add(prefix + '-visible'); });
  }
})();

/* Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
</script>
```

---

## 19. Standard HEAD Template

```html
<!-- [CLIENT NAME] — Head Tags -->
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=[HEADING_FONT]:wght@400;600;700&family=[BODY_FONT]:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Favicon (opcjonalnie, jeśli klient ma) -->
<!-- <link rel="icon" href="/images/owner/favicon.ico" type="image/x-icon"> -->
```

---

## 20. INSTRUKCJA.txt Template

```
=====================================================
  [CLIENT NAME] — INSTRUKCJA WKLEJANIA DO CMS
=====================================================

Panel CMS: https://client[ID].idosell.com/panel

=====================================================
KROK 1: ARKUSZ STYLÓW CSS
=====================================================
1. Idź do: Wygląd → Arkusz stylów CSS
2. Zaznacz CAŁĄ starą treść (Ctrl+A) i USUŃ
3. Otwórz: [PREFIX]_ARKUSZ_STYLOW.css
4. Skopiuj CAŁĄ zawartość (Ctrl+A, Ctrl+C)
5. Wklej (Ctrl+V) i ZAPISZ

=====================================================
KROK 2: SEKCJA HEAD (globalnie)
=====================================================
1. Idź do: Ustawienia → Kody śledzące → Sekcja Head
2. Wklej zawartość: [PREFIX]_HEAD.html
3. ZAPISZ

=====================================================
KROK 3: KONIEC BODY (globalnie)
=====================================================
1. Idź do: Ustawienia → Kody śledzące → Koniec BODY
2. Wklej zawartość: [PREFIX]_KONIEC_BODY_JS.html
3. ZAPISZ

=====================================================
KROK 4: STRONA GŁÓWNA
=====================================================
1. Idź do: Wygląd → Strona główna → Edytor treści
2. Przełącz na tryb HTML (ikona <>)
3. Zaznacz CAŁĄ starą treść i USUŃ
4. Wklej z: STRONA_GLOWNA_PL__cms.html
5. ZAPISZ
6. Ustaw Nagłówek: [HERO_TITLE]
7. Ustaw Podtytuł: [HERO_SUBTITLE]

=====================================================
KROK 5+: PODSTRONY CMS
=====================================================
Dla każdej podstrony:
1. Idź do: /panel/frontpage/editsubpage/id/[ID]
2. Zakładka odpowiedniego języka

POLE "Początek sekcji Body":
  → Wklej z: [PAGE]_[LANG]__body_top.html

POLE "Koniec sekcji Body":
  → Wklej z: [PAGE]_[LANG]__body_bottom.html
  (jeśli istnieje — nie każda strona potrzebuje JS)

3. ZAPISZ

=====================================================
LISTA PLIKÓW I GDZIE IDZIE
=====================================================
[PREFIX]_ARKUSZ_STYLOW.css      → Arkusz stylów CSS
[PREFIX]_HEAD.html              → Kody śledzące → Head
[PREFIX]_KONIEC_BODY_JS.html    → Kody śledzące → Koniec Body
STRONA_GLOWNA_PL__cms.html     → Strona główna → Edytor treści
[PAGE]_PL__body_top.html        → txt/[ID] → Początek Body
[PAGE]_PL__body_bottom.html     → txt/[ID] → Koniec Body

WAŻNE: Kopiuj CAŁĄ zawartość każdego pliku (Ctrl+A)!
Po wklejeniu: Ctrl+Shift+R na stronie żeby odświeżyć cache.
```

---

## 21. Brief Template (co potrzebuję od klienta)

```yaml
# BRIEF — [Nazwa klienta]

## Dane podstawowe
nazwa_obiektu: ""
typ: "apartamenty | pensjonat | hotel | domki"
lokalizacja: ""
panel_url: "client[ID].idosell.com"
engine_url: "engine[ID].idobooking.com"
domena: ""

## Branding
kolor_glowny: "#"
kolor_dodatkowy: "#"       # opcjonalne
font_naglowki: ""          # np. Playfair Display (default)
font_body: ""              # np. Inter (default)
styl: "elegancki | nowoczesny | rustykalny | minimalistyczny"

## Podstrony (zaznacz które)
- [ ] Strona główna
- [ ] O nas
- [ ] Galeria
- [ ] Atrakcje
- [ ] Lokalizacja
- [ ] Kontakt/Dojazd
- [ ] Regulamin
- [ ] Blog/Aktualności
- [ ] Inne: ___

## Treści per podstrona
### Strona główna
hero_naglowek: ""
hero_podtytul: ""
sekcja_powitanie: ""
udogodnienia: []           # lista: nazwa + opis
odleglosci: []             # np. "150m do plaży"

### O nas
tresc: ""

### Atrakcje
lista: []                  # nazwa + opis + opcjonalnie zdjęcie

## Zdjęcia
slider_glowna: []          # nazwy/opisy zdjęć do wrzucenia w panelu
zdjecia_galeria: []
logo: "url lub plik"

## Języki
- [x] Polski
- [ ] Angielski
- [ ] Niemiecki
- [ ] Inny: ___

## Uwagi dodatkowe
```
