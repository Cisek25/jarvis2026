# River Premium Apartments — SEO meta per strona

Wklej dane meta w panelu IdoBooking → Strony → [nazwa strony] → SEO.

---

## Strona główna (`/`)

**Tytuł (title)**:
```
River Premium Apartments — Apartamenty Premium Wrocław z widokiem na Odrę
```

**Opis (description)** (155 znaków):
```
Premium apartamenty w sercu Wrocławia, ul. Księcia Witolda 52. Widok na Odrę, garaż, WiFi, Smart TV. Rezerwuj bezpośrednio — gwarancja najniższej ceny.
```

**Słowa kluczowe**:
apartamenty Wrocław, premium apartamenty Wrocław centrum, noclegi nad Odrą, apartamenty Wrocław Stare Miasto, krótkoterminowy wynajem Wrocław, River Premium Apartments

**OG image**: `https://client58463.idobooking.com/images/frontpageGallery/pictures/large/0/0/1.webp`

**H1 strony**: Wyjątkowe apartamenty
**H2 sekcji**: River Premium Apartments / Oferty pobytu / Opinie zadowolonych Gości / Nasze apartamenty / Gotowy na pobyt nad Odrą?

---

## Apartamenty (`/pokoje` lub system `/offers`)

**Tytuł**:
```
Apartamenty premium we Wrocławiu | River Premium Apartments
```

**Opis**:
```
Cztery wyjątkowe apartamenty A/B/C/D od 35 do 55 m², 2-4 osoby. Pełne wyposażenie, kuchnia, Smart TV, WiFi. Sprawdź dostępność i zarezerwuj online.
```

**H1**: Apartamenty
**H2**: Apartament A / B / C / D

---

## Oferty i promocje (`/oferty-i-promocje` — AUTO w systemie IdoBooking)

**Tytuł**:
```
Oferty i promocje | River Premium Apartments Wrocław
```

**Opis**:
```
Oferta bezzwrotna od 202 zł/noc, długoterminowa od 225 zł/noc, elastyczna od 250 zł/noc. Vouchery prezentowe 1000–2000 zł. Gwarancja najniższej ceny.
```

⚠️ **UWAGA**: Strona AUTO generowana przez IdoBooking. NIE tworzymy własnego CMS page — system renderuje listing ofert. Konfigurujemy w panelu: Konfiguracja → Strona główna → Promocje.

---

## Atrakcje (`/atrakcje`)

**Tytuł**:
```
Atrakcje Wrocławia | River Premium Apartments
```

**Opis**:
```
Co warto zobaczyć w okolicy: ZOO, Panorama Racławicka, Muzeum Narodowe, Opera Wrocławska, Sky Tower. Wszystko w krótkim spacerze od apartamentów.
```

**H1**: Atrakcje w okolicy
**H2**: Wszystkie / Aktywnie / Pozostałe atrakcje / Lato

---

## Restauracja (`/restauracja`)

**Tytuł**:
```
Restauracja Champagne for Breakfast | River Premium Apartments
```

**Opis**:
```
Wyjątkowa restauracja Champagne for Breakfast: śniadania, lunche, obiady, desery. Goście River Premium Apartments otrzymują rabat 10%.
```

**H1**: Restauracja
**H2**: Champagne for Breakfast / Co serwujemy / Zarezerwuj stolik już dziś

---

## Galeria (`/galeria`)

**Tytuł**:
```
Galeria — wnętrza apartamentów | River Premium Apartments
```

**Opis**:
```
Zobacz nasze premium apartamenty od środka — sypialnie, salony, łazienki. Cztery apartamenty A/B/C/D z widokiem na Odrę i centrum Wrocławia.
```

⚠️ **UWAGA**: System IdoBooking generuje galerię w każdym apartamencie automatycznie (`/offer/{id}/{slug}` → tab Galeria). Możemy zostawić własną sekcję CMS lub linkować do system pages.

---

## Kontakt (`/kontakt` — AUTO w systemie IdoBooking)

**Tytuł**:
```
Kontakt | River Premium Apartments Wrocław
```

**Opis**:
```
Skontaktuj się z nami: ul. Księcia Witolda 52, 50-203 Wrocław. Telefon +48 785 818 330. Email rezerwacje@riverpremiumapartments.pl. Recepcja 7:00–23:00.
```

⚠️ **UWAGA**: Strona AUTO generowana przez IdoBooking. Konfigurujemy dane w panelu: Konfiguracja → Dane firmy.

---

## Schema.org JsonLD (do wklejenia w panelu IdoBooking → Konfiguracja → SEO → JSON-LD)

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
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Smart TV", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Pet Friendly", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Elevator", "value": true }
  ],
  "checkinTime": "15:00",
  "checkoutTime": "11:00"
}
```

---

## Hreflang

W każdym head:
```html
<link rel="alternate" hreflang="pl" href="https://riverpremiumapartments.pl/">
<link rel="alternate" hreflang="en" href="https://riverpremiumapartments.pl/en/">
<link rel="alternate" hreflang="x-default" href="https://riverpremiumapartments.pl/">
```

---

## Sitemap.xml

IdoBooking auto-generuje. Sprawdź: `https://client58463.idobooking.com/sitemap.xml` — powinien zawierać wszystkie 7 stron (Home, Pokoje, /offer/10-17, Oferty, Atrakcje, Restauracja, Galeria, Kontakt) + warianty PL/EN.

---

## Lighthouse target

| Strona | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | ≥80 | ≥95 | ≥90 | ≥95 |
| `/pokoje` | ≥85 | ≥95 | ≥90 | ≥95 |
| `/offer/N` (system) | ≥80 | ≥90 | ≥90 | ≥90 |
| `/atrakcje` | ≥85 | ≥95 | ≥90 | ≥95 |
| `/restauracja` | ≥85 | ≥95 | ≥90 | ≥95 |
| `/galeria` | ≥75 (image-heavy) | ≥95 | ≥90 | ≥95 |
| `/kontakt` (system) | ≥85 | ≥95 | ≥90 | ≥90 |
