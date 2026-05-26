# BRIEF NOWEGO KLIENTA — IdoBooking Site

> Wypełnij REQUIRED (sekcja 1) żeby JARVIS wystartował. OPTIONAL (sekcja 2) dopiero gdy masz wytyczne — wszystko puste JARVIS uzupełni sam i pokaże Ci wybory do zaakceptowania.

---

## ⚠ 1. REQUIRED — bez tego JARVIS nie wystartuje

### 🏢 Identyfikacja
- **Nazwa firmy/obiektu**: <!-- np. Piekary 1-3 -->
- **Lokalizacja**: <!-- np. Toruń, woj. kujawsko-pomorskie -->
- **ID panelu IdoBooking — engine**: <!-- np. engine23326 -->
- **ID panelu IdoBooking — client**: <!-- np. client23326 -->
- **Domena docelowa**: <!-- np. apart-torun.pl (puste = uruchamiamy na .idobooking.com) -->

### 🎨 Brand
- **Prefix CSS**: <!-- np. pk- / mc- / sa- — 2-4 znaki, lowercase -->
- **Logo URL/plik**: <!-- /images/owner/logo.png lub załączony plik -->

### 🔧 Stack
- **Default13 theme?**: ☐ Tak ☐ Nie
- **Fullpage.js na home?**: ☐ Tak ☐ Nie
- **Liczba obiektów w portfolio klienta**: <!-- np. 11 -->
- **Liczba obiektów ogółem w panelu** (jeśli shared engine multi-property broker): <!-- np. 122 -->

### 🎯 Target + Język
- **Grupa docelowa**: <!-- np. "luxury 30-50 lat, pary, weekend escape" -->
- **Główny język**: ☐ PL ☐ EN ☐ DE ☐ ES
- **Inne języki**: <!-- np. EN/DE -->

### 📄 Wymagane podstrony (zaznacz)
☐ Strona główna
☐ O nas / O obiekcie
☐ Galeria
☐ Lokalizacja
☐ Atrakcje
☐ Apartamenty (listing)
☐ Regulamin / FAQ
☐ Kontakt

---

## ✨ 2. OPTIONAL — jeśli macie wytyczne

### Vibe (1-3 słowa)

Wybierz spośród 20 presetów (lub opisz własny):

| Vibe | Przykład typu obiektu |
|---|---|
| luxury-heritage | apartament w zabytku, lux hotel, kamienice |
| modern-minimal | nowoczesny apartament, design hotel |
| rustic-warm | agroturystyka, klimat wiejski |
| modern-coastal | morze, plażowe apartamenty |
| urban-bold | hostel, młodzieżowy obiekt |
| wellness-calm | spa, hotel wellness |
| heritage-warm | klasyczny hotel, kamienice |
| family-friendly | rodzinny apartament, dom z dziećmi |
| boutique-romantic | butikowy obiekt dla par |
| scandi-clean | skandynawski minimalizm |
| mountain-rugged | schroniska, chaty górskie |
| mediterranean-villa | wille basenowe (Hiszpania, Włochy) |
| art-deco-vintage | vintage hotel art-deco |
| eco-glamping | eco glamping, off-grid |
| business-corporate | apartament biznes, exec suite |
| winter-alpine | schronisko narty (Karpacz/Zakopane) |
| asian-zen | minimalistyczny styl japoński |
| industrial-loft | loft w mieście (Łódź, Praga, Kraków) |
| garden-cottage | dom letniskowy, cottagecore |
| tropical-resort | nadmorski tropikalny (Egipt, Cypr) |

**Wybrany vibe**: <!-- np. luxury-heritage -->

### Inspiracje
- <!-- URL inspiracji 1 -->
- <!-- URL inspiracji 2 -->

### Kolory brand (jeśli macie)
- **Primary**: <!-- np. #722F37 -->
- **Secondary**: <!-- np. #C4A882 -->
- **Background**: <!-- np. #FAFAF5 -->

### Fonty brand (jeśli macie)
- **Heading**: <!-- np. Playfair Display -->
- **Body**: <!-- np. DM Sans -->

### Must-have features
☐ Booking modal iframe (gość rezerwuje bez wychodzenia)
☐ Brand-neutral mode na /offer/N/ (broker multi-property)
☐ Logo nieklikalne (per Piekary 1-3 decision)
☐ Featured offers slider
☐ Sticky tabs sklejone z headerem na /offer/N/
☐ Dark mode (auto / toggle / always)

### Hard NO
<!-- Czego klient NIE chce na pewno — np. "bez parallax", "bez auto-play wideo" -->

### Tone of voice
<!-- np. "formalny, elegancki, ekskluzywny" — wpływa na copywriting CTA i nagłówków -->

---

## 🤖 3. AUTO-FILL (JARVIS uzupełni puste pola)

| Puste pole | JARVIS automatycznie |
|---|---|
| Vibe | Analizuje target + brand → wybiera z 20 presetów + wyjaśnia dlaczego |
| Paleta | Proponuje 3 warianty palety z `library/templates/vibe-presets.json` |
| Fonty | Dobiera font pair pasujący do vibe (z Google Fonts) |
| Sekcje | Domyślny zestaw 8: home + o nas + galeria + lokalizacja + atrakcje + apartamenty + regulamin + kontakt |
| Hero variant | Z `vibe-presets.json` (np. luxury → asymmetric-grid; minimal → centered-typography) |
| About variant | Per vibe recommendation |
| CTA style | Per vibe (luxury → dark-bold; minimal → minimal-text) |

---

## 📞 4. Kontakt klienta

- **Imię i nazwisko**: <!-- np. Radosław Lewandowski -->
- **Email — do komunikacji wewnętrznej z nami**: <!-- przykład: kontakt@example.com -->
- **Telefon — opcjonalnie**: <!-- przykład: +48 000 000 000 -->

### Główny kontakt do publikacji na stronie

- **Tel**: <!-- np. +48 533 048 666 -->
- **Email**: <!-- np. bok@apart-torun.pl -->
- **Adres**: <!-- np. ul. Piekary 1-3, 87-100 Toruń -->

---

## 📋 5. Po wypełnieniu

1. Zapisz ten plik jako `clients/<nazwa-klienta>/BRIEF.md`
2. Powiedz JARVIS: **„wykonaj brief klienta <nazwa>"**
3. JARVIS odpali Phase 0 → Phase 6 (~3-4 godz pracy)
4. Output: folder `clients/<nazwa>/` z gotowymi plikami do wklejenia w panel IdoBooking

### Co JARVIS wyprodukuje
- `CSS_EDYTOR.css` — pełny stylesheet (composed z 10 layers + design tokens vibe)
- `KONIEC_BODY.html` — moduły JS (init bookings, sliders, featured offers, scroll reveal)
- 8 plików `<PODSTRONA>_PL__body_top.html` per language per podstrona
- `INSTRUKCJA.txt` — step-by-step dla klienta gdzie wkleić każdy plik
- Live verification report — MCP audyt po pierwszym wklejeniu

### Co JARVIS NIE zrobi (na Tobie)
- Zamówienie domeny / SSL
- Zdjęcia obiektu (klient dostarcza)
- Treści marketingowe (klient dostarcza opisy)
- Tłumaczenia (klient lub osobny proces)
- Wklejenie do panelu (klient sam — INSTRUKCJA prowadzi)
