# River Premium Apartments — SEO per strona

W panelu IdoBooking → Strony → [nazwa strony] są 4 osobne pola SEO. Wklej dane poniżej.

**Limity**:
- Nazwa: krótko, ~30-50 znaków (visible w menu/breadcrumb)
- Podpis: 1 zdanie, ~60-80 znaków (subtitle pod H1)
- Meta title: max 60 znaków (Google obcina powyżej)
- Meta description: max 150 znaków (Google obcina powyżej)

---

## 1. Strona główna (`/`)

| Pole | Wartość |
|---|---|
| **Nazwa** | Strona główna |
| **Podpis** | Apartamenty premium we Wrocławiu z widokiem na Odrę |
| **Meta title** | River Premium Apartments — Apartamenty Wrocław centrum |
| **Meta description** | Premium apartamenty w sercu Wrocławia, ul. Witolda 52. Widok na Odrę, garaż, WiFi. Rezerwuj — gwarancja najniższej ceny. |

---

## 2. Apartamenty (`/pokoje` lub system `/offers`)

| Pole | Wartość |
|---|---|
| **Nazwa** | Apartamenty |
| **Podpis** | Cztery apartamenty premium A/B/C/D od 35 do 55 m² |
| **Meta title** | Apartamenty Wrocław — River Premium Apartments |
| **Meta description** | Cztery apartamenty A/B/C/D, 35–55 m², 2–4 osoby. Kuchnia, Smart TV, WiFi. Sprawdź dostępność i zarezerwuj online. |

---

## 3. Pojedynczy apartament (`/offer/{id}/{slug}` — system auto)

System bierze nazwę i opis z panelu IdoBooking → Oferty → [apartament] → SEO. Wpisać per apartament:

### Apartament A (`/offer/10/Igielna-101-M1` lub jak system nazwie)

| Pole | Wartość |
|---|---|
| **Nazwa** | Apartament A — Igielna 10/1 M1 |
| **Podpis** | 40 m², 2 osoby, sypialnia z dużym łóżkiem |
| **Meta title** | Apartament A — River Premium Apartments Wrocław |
| **Meta description** | Apartament A — 40 m², 2 osoby. Pełne wyposażenie, kuchnia, Smart TV, łazienka z prysznicem. Rezerwuj online. |

### Apartament B

| Pole | Wartość |
|---|---|
| **Nazwa** | Apartament B — Igielna 10/1 M2 |
| **Podpis** | 55 m², 4 osoby, dwie sypialnie |
| **Meta title** | Apartament B — River Premium Apartments Wrocław |
| **Meta description** | Apartament B — 55 m², 4 osoby. Dwie sypialnie, salon, kuchnia. Idealny dla rodzin i grup. Rezerwuj online. |

### Apartament C

| Pole | Wartość |
|---|---|
| **Nazwa** | Apartament C — Igielna 10/1 M3 |
| **Podpis** | 47 m², 4 osoby, widok na Odrę |
| **Meta title** | Apartament C — River Premium Apartments Wrocław |
| **Meta description** | Apartament C — 47 m², 4 osoby, widok na Odrę. Dwie sypialnie, otwarta przestrzeń dzienna. Rezerwuj online. |

### Apartament D

| Pole | Wartość |
|---|---|
| **Nazwa** | Apartament D — Igielna 10/1 M4 |
| **Podpis** | 35 m², 2 osoby, kameralny apartament |
| **Meta title** | Apartament D — River Premium Apartments Wrocław |
| **Meta description** | Apartament D — 35 m², 2 osoby. Kameralna sypialnia, aneks kuchenny, łazienka z prysznicem. Rezerwuj online. |

---

## 4. Oferty i promocje (`/oferty-i-promocje` — system auto)

| Pole | Wartość |
|---|---|
| **Nazwa** | Oferty i promocje |
| **Podpis** | Najlepsze warunki rezerwacji od 202 zł/noc |
| **Meta title** | Oferty i promocje — River Premium Apartments Wrocław |
| **Meta description** | Oferta bezzwrotna od 202 zł, długoterminowa 225 zł, elastyczna 250 zł. Vouchery prezentowe. Gwarancja najniższej ceny. |

---

## 5. Atrakcje (`/atrakcje`)

| Pole | Wartość |
|---|---|
| **Nazwa** | Atrakcje |
| **Podpis** | Co warto zobaczyć w okolicy apartamentów |
| **Meta title** | Atrakcje Wrocławia — River Premium Apartments |
| **Meta description** | ZOO, Panorama Racławicka, Opera, Muzeum Narodowe, Sky Tower. Wszystkie atrakcje w krótkim spacerze od apartamentów. |

---

## 6. Restauracja (`/restauracja` lub `/txt/201/Restauracja`)

| Pole | Wartość |
|---|---|
| **Nazwa** | Restauracja |
| **Podpis** | Champagne for Breakfast — śniadania, lunche, kolacje |
| **Meta title** | Restauracja Champagne for Breakfast — Wrocław |
| **Meta description** | Restauracja w obiekcie. Śniadania, lunche, obiady, desery. Goście River Premium otrzymują 10% rabatu. |

---

## 7. Galeria (`/galeria`)

| Pole | Wartość |
|---|---|
| **Nazwa** | Galeria |
| **Podpis** | Apartamenty od środka — sypialnie, salony, łazienki |
| **Meta title** | Galeria zdjęć — River Premium Apartments Wrocław |
| **Meta description** | Zobacz nasze premium apartamenty od środka. Cztery apartamenty A/B/C/D z widokiem na Odrę i centrum Wrocławia. |

---

## 8. Kontakt (`/kontakt` — system auto)

| Pole | Wartość |
|---|---|
| **Nazwa** | Kontakt |
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

## Konwencja długości (Google):
- Title >60 znaków → Google obcina (zostaje "...")
- Description >150-160 znaków → obcięte
- Title za krótki (<30) = niska ocena
- Description za krótki (<70) = niska ocena

Wszystkie wartości w tym pliku zachowane w bezpiecznych limitach.
