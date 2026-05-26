# River Premium Apartments — SEO per strona

W panelu IdoBooking → Strony → [nazwa strony] są osobne pola: Nazwa (menu), Podpis, Meta title, Meta description. H1 to nagłówek wewnątrz body_top HTML (osobno).

**5 pól per strona**:

| Pole | Gdzie idzie | Limit | Cel |
|---|---|---|---|
| **Nazwa menu** | Panel IdoBooking → Strony → Nazwa | 1-2 słowa (~6-15 znaków) | Pozycja w nawigacji header/footer |
| **H1 (nagłówek)** | body_top HTML, klasa `.riv-hero__title` lub `.riv-subhero__title` | krótka fraza (~15-40 znaków) | Główny tytuł widoczny na stronie |
| **Podpis** | Panel IdoBooking → Strony → Podpis | 1 zdanie (~60-80 znaków) | Subtitle pod H1, lead |
| **Meta title** | Panel IdoBooking → Strony → Meta title | max 60 znaków | `<title>` w HEAD, wyświetlany w Google |
| **Meta description** | Panel IdoBooking → Strony → Meta description | max 150 znaków | `<meta name="description">`, snippet w Google |

---

## 1. Strona główna (`/`)

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Start |
| **H1 (nagłówek)** | Wyjątkowe apartamenty |
| **Podpis** | Apartamenty premium we Wrocławiu z widokiem na Odrę |
| **Meta title** | River Premium Apartments — Apartamenty Wrocław centrum |
| **Meta description** | Premium apartamenty w sercu Wrocławia, ul. Witolda 52. Widok na Odrę, garaż, WiFi. Rezerwuj — gwarancja najniższej ceny. |

---

## 2. Apartamenty (`/pokoje` lub system `/offers`)

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Apartamenty |
| **H1 (nagłówek)** | Apartamenty |
| **Podpis** | Cztery apartamenty premium A/B/C/D od 35 do 55 m² |
| **Meta title** | Apartamenty Wrocław — River Premium Apartments |
| **Meta description** | Cztery apartamenty A/B/C/D, 35–55 m², 2–4 osoby. Kuchnia, Smart TV, WiFi. Sprawdź dostępność i zarezerwuj online. |

---

## 3. Pojedynczy apartament (`/offer/{id}/{slug}` — system auto)

System bierze nazwę i opis z panelu IdoBooking → Oferty → [apartament] → SEO. Wpisać per apartament. H1 = system-rendered z nazwy oferty.

### Apartament A (`/offer/10/Igielna-101-M1` lub jak system nazwie)

| Pole | Wartość |
|---|---|
| **Nazwa menu** | (nie pojawia się w menu — system auto) |
| **H1 (nagłówek)** | Apartament A — Igielna 10/1 M1 (z nazwy oferty) |
| **Podpis** | 40 m², 2 osoby, sypialnia z dużym łóżkiem |
| **Meta title** | Apartament A — River Premium Apartments Wrocław |
| **Meta description** | Apartament A — 40 m², 2 osoby. Pełne wyposażenie, kuchnia, Smart TV, łazienka z prysznicem. Rezerwuj online. |

### Apartament B

| Pole | Wartość |
|---|---|
| **Nazwa menu** | (nie pojawia się w menu — system auto) |
| **H1 (nagłówek)** | Apartament B — Igielna 10/1 M2 (z nazwy oferty) |
| **Podpis** | 55 m², 4 osoby, dwie sypialnie |
| **Meta title** | Apartament B — River Premium Apartments Wrocław |
| **Meta description** | Apartament B — 55 m², 4 osoby. Dwie sypialnie, salon, kuchnia. Idealny dla rodzin i grup. Rezerwuj online. |

### Apartament C

| Pole | Wartość |
|---|---|
| **Nazwa menu** | (nie pojawia się w menu — system auto) |
| **H1 (nagłówek)** | Apartament C — Igielna 10/1 M3 (z nazwy oferty) |
| **Podpis** | 47 m², 4 osoby, widok na Odrę |
| **Meta title** | Apartament C — River Premium Apartments Wrocław |
| **Meta description** | Apartament C — 47 m², 4 osoby, widok na Odrę. Dwie sypialnie, otwarta przestrzeń dzienna. Rezerwuj online. |

### Apartament D

| Pole | Wartość |
|---|---|
| **Nazwa menu** | (nie pojawia się w menu — system auto) |
| **H1 (nagłówek)** | Apartament D — Igielna 10/1 M4 (z nazwy oferty) |
| **Podpis** | 35 m², 2 osoby, kameralny apartament |
| **Meta title** | Apartament D — River Premium Apartments Wrocław |
| **Meta description** | Apartament D — 35 m², 2 osoby. Kameralna sypialnia, aneks kuchenny, łazienka z prysznicem. Rezerwuj online. |

---

## 4. Oferty i promocje (`/oferty-i-promocje` — system auto)

System sam renderuje H1 z konfiguracji IdoBooking → Oferty. W przypadku potrzeby override'u H1 (jeśli system pozwala) sugerowana wartość poniżej.

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Oferty |
| **H1 (nagłówek)** | Oferty i promocje (system default lub nadpisać w panelu) |
| **Podpis** | Najlepsze warunki rezerwacji od 202 zł/noc |
| **Meta title** | Oferty i promocje — River Premium Apartments Wrocław |
| **Meta description** | Oferta bezzwrotna od 202 zł, długoterminowa 225 zł, elastyczna 250 zł. Vouchery prezentowe. Gwarancja najniższej ceny. |

---

## 5. Atrakcje (`/atrakcje`)

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Atrakcje |
| **H1 (nagłówek)** | Atrakcje w okolicy |
| **Podpis** | Co warto zobaczyć w okolicy apartamentów |
| **Meta title** | Atrakcje Wrocławia — River Premium Apartments |
| **Meta description** | ZOO, Panorama Racławicka, Opera, Muzeum Narodowe, Sky Tower. Wszystkie atrakcje w krótkim spacerze od apartamentów. |

---

## 6. Restauracja (`/restauracja` lub `/txt/201/Restauracja`)

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Restauracja |
| **H1 (nagłówek)** | Restauracja |
| **Podpis** | Champagne for Breakfast — śniadania, lunche, kolacje |
| **Meta title** | Restauracja Champagne for Breakfast — Wrocław |
| **Meta description** | Restauracja w obiekcie. Śniadania, lunche, obiady, desery. Goście River Premium otrzymują 10% rabatu. |

---

## 7. Galeria (`/galeria`)

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Galeria |
| **H1 (nagłówek)** | Galeria |
| **Podpis** | Apartamenty od środka — sypialnie, salony, łazienki |
| **Meta title** | Galeria zdjęć — River Premium Apartments Wrocław |
| **Meta description** | Zobacz nasze premium apartamenty od środka. Cztery apartamenty A/B/C/D z widokiem na Odrę i centrum Wrocławia. |

---

## 8. Kontakt (`/kontakt` — system auto)

System sam renderuje H1. W przypadku potrzeby override'u (jeśli system pozwala) sugerowana wartość poniżej.

| Pole | Wartość |
|---|---|
| **Nazwa menu** | Kontakt |
| **H1 (nagłówek)** | Kontakt (system default lub nadpisać w panelu) |
| **Podpis** | Jesteśmy do dyspozycji 24/7 |
| **Meta title** | Kontakt — River Premium Apartments Wrocław |
| **Meta description** | ul. Księcia Witolda 52, 50-203 Wrocław. Tel +48 785 818 330. Email rezerwacje@riverpremiumapartments.pl. Recepcja 7–23. |

---

## Globalne (panel IdoBooking → Konfiguracja → SEO)

### Schema.org JsonLD

Wklej w "JSON-LD globalny" lub w HEAD strony głównej:

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "River Premium Apartments",
  "description": "Premium apartamenty w centrum Wrocławia z widokiem na Odrę.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Księcia Witolda 52",
    "postalCode": "50-203",
    "addressLocality": "Wrocław",
    "addressCountry": "PL"
  },
  "telephone": "+48-785-818-330",
  "email": "rezerwacje@riverpremiumapartments.pl",
  "url": "https://riverpremiumapartments.pl/",
  "image": "https://client58463.idobooking.com/images/frontpageGallery/pictures/large/0/0/1.webp",
  "priceRange": "202–319 zł/noc",
  "checkinTime": "15:00",
  "checkoutTime": "11:00"
}
```

### Słowa kluczowe (panel SEO)

```
apartamenty Wrocław, premium apartamenty Wrocław centrum, noclegi nad Odrą, apartamenty Wrocław Stare Miasto, krótkoterminowy wynajem Wrocław, River Premium Apartments
```

---

## Lighthouse target po wdrożeniu

| Strona | Performance | A11y | Best Practices | SEO |
|---|---|---|---|---|
| `/` | ≥80 | ≥95 | ≥90 | ≥95 |
| `/pokoje` lub `/offers` | ≥85 | ≥95 | ≥90 | ≥95 |
| `/offer/N` (system) | ≥80 | ≥90 | ≥90 | ≥90 |
| `/atrakcje` | ≥85 | ≥95 | ≥90 | ≥95 |
| `/txt/201/Restauracja` | ≥85 | ≥95 | ≥90 | ≥95 |
| `/galeria` | ≥75 (img-heavy) | ≥95 | ≥90 | ≥95 |
| `/kontakt` (system) | ≥85 | ≥95 | ≥90 | ≥90 |

---

## Konwencja długości (Google)

- Title >60 znaków → Google obcina (zostaje "...")
- Description >150-160 znaków → obcięte
- Title za krótki (<30) = niska ocena
- Description za krótki (<70) = niska ocena

Wszystkie wartości w tym pliku zachowane w bezpiecznych limitach.

---

## Nazwy menu nawigacji (header / footer)

Lista nazw tak jak mają wyglądać w **głównym menu nawigacji** w headerze i w footerze. Maksymalnie 1-2 słowa per pozycja — krótko, czytelnie, mobile-friendly.

### Kolejność w menu (PL)

| # | Nazwa w menu | Link | Strona docelowa |
|---|---|---|---|
| 1 | **Start** | `/` | Strona główna |
| 2 | **Apartamenty** | `/pokoje` lub `/offers` | Lista apartamentów (system lub własna) |
| 3 | **Oferty** | `/oferty-i-promocje` | Oferty i promocje (system auto) |
| 4 | **Atrakcje** | `/atrakcje` | Atrakcje w okolicy |
| 5 | **Restauracja** | `/restauracja` lub `/txt/201/Restauracja` | Restauracja Champagne for Breakfast |
| 6 | **Galeria** | `/galeria` | Galeria zdjęć |
| 7 | **Kontakt** | `/kontakt` | Kontakt (system auto) |

CTA button po prawej stronie nav:

| Nazwa CTA | Link | Cel |
|---|---|---|
| **Rezerwuj** | `/book-now` lub `/offers` | Otwiera engine rezerwacji |

### Footer — sekcja "Nawigacja"

W footerze zachować TĘ SAMĄ kolejność i nazwy menu (spójność użytkownika).

### Zasady nazewnictwa menu

- **Max 1-2 słowa** — długie nazwy łamią się w mobile i wymuszają większy header
- **Bez emoji, bez interpunkcji** — same litery + spacja
- **Wielka pierwsza litera** — "Apartamenty", nie "apartamenty"
- **Zwroty zrozumiałe natychmiast** — gość nie zna brandu, więc "Start" > "Główna" > "Witamy"
- **Spójność header ↔ footer** — te same nazwy w obu miejscach
- **Brak duplikatów** — np. nie obok siebie "Apartamenty" i "Pokoje" (synonimy)

### Mapowanie Nazwa menu ↔ H1 (rozróżnienie)

Klucz: Nazwa menu jest KRÓTKA dla nawigacji, H1 może być DŁUŻSZE i bardziej opisowe na stronie:

| Strona | Nazwa menu (nav) | H1 (nagłówek strony) |
|---|---|---|
| Strona główna | Start | Wyjątkowe apartamenty |
| Apartamenty | Apartamenty | Apartamenty |
| Oferty | Oferty | Oferty i promocje |
| Atrakcje | Atrakcje | Atrakcje w okolicy |
| Restauracja | Restauracja | Restauracja |
| Galeria | Galeria | Galeria |
| Kontakt | Kontakt | Kontakt |

H1 musi być w body_top HTML w klasie `.riv-hero__title` (homepage) lub `.riv-subhero__title` (subpages). Zmiana H1 = edytuj body_top HTML, nie panel.
