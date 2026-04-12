# URL Slug Mapping — EN / DE / ES

**Purpose**: Identifies all Polish URL slugs used in cross-links within EN, DE, and ES HTML files.
These slugs need localized equivalents when the CMS page slugs are translated.

**Status**: Audit only — no files have been modified.

**Date**: 2026-03-13

---

## Summary

Only **2 unique Polish slugs** appear as cross-links in non-Polish language files.
All occurrences are in `<a href="...">` navigation buttons.

The numeric page IDs (`/txt/200/`, `/txt/202/`) are CMS-assigned and must not change.
Only the human-readable slug suffix (after the last `/`) needs localization.

---

## Page ID Reference

Full list of all 9 pages and their CMS IDs (sourced from Polish v2 files):

| CMS ID | Polish file | Polish slug suffix | Page description |
|--------|-------------|-------------------|------------------|
| `/txt/201/` | `01_STRONA_GLOWNA_v2.html` | (homepage, no inbound cross-links found) | Homepage |
| `/txt/202/` | `02_APARTAMENTY_v2.html` | (no inbound cross-links found) | Apartments index |
| `/txt/203/` | `03_EAGLE_NEST_v2.html` | (no inbound cross-links found) | Eagle Nest apt |
| `/txt/204/` | `04_EAGLE_VIEW_v2.html` | (no inbound cross-links found) | Eagle View apt |
| `/txt/200/` | `05_EAGLE_TOWER_v2.html` | `Eagle-Tower-Udogodnienia` | Building amenities |
| `/txt/202/` | `06_LOKALIZACJA_v2.html` | `Atrakcje-w-okolicy`* | Location / Attractions |
| `/txt/202/` | `07_ATRAKCJE_v2.html` | `Atrakcje-w-okolicy` | Nearby attractions |
| `/txt/208/` | `08_GALERIA_v2.html` | (no inbound cross-links found) | Gallery index |
| `/txt/209/` | `09_GALERIA_ZDJECIA_v2.html` | (no inbound cross-links found) | Photo grid |

> *Note: `/txt/202/` appears to serve double duty (Lokalizacja and Atrakcje share the same ID). This may be a pre-existing CMS configuration issue worth verifying.

---

## Polish Slugs Found in EN / DE / ES Files

### Slug 1: `Eagle-Tower-Udogodnienia`

**Polish meaning**: "Eagle Tower Amenities"
**CMS path**: `/txt/200/Eagle-Tower-Udogodnienia`

| Language | Suggested localized slug | Rationale |
|----------|--------------------------|-----------|
| EN | `Eagle-Tower-Amenities` | Direct translation |
| DE | `Eagle-Tower-Ausstattung` | "Ausstattung" = amenities/facilities |
| ES | `Eagle-Tower-Instalaciones` | "Instalaciones" = facilities/amenities |

**Occurrences in non-Polish files**:

| File | Line | Link text |
|------|------|-----------|
| `01_STRONA_GLOWNA_EN.html` | 75 | "All amenities" |
| `08_GALERIA_EN.html` | 86 | *(link text in file)* |
| `01_STRONA_GLOWNA_DE.html` | 74 | "Alle Annehmlichkeiten" |
| `08_GALERIA_DE.html` | 77 | *(link text in file)* |
| `01_STRONA_GLOWNA_ES.html` | 75 | "Todas las instalaciones" |
| `08_GALERIA_ES.html` | 77 | *(link text in file)* |

**Total occurrences**: 6 (2 per language)

---

### Slug 2: `Atrakcje-w-okolicy`

**Polish meaning**: "Attractions in the area / Nearby attractions"
**CMS path**: `/txt/202/Atrakcje-w-okolicy`

| Language | Suggested localized slug | Rationale |
|----------|--------------------------|-----------|
| EN | `Nearby-Attractions` | Matches existing link text "Nearby attractions" |
| DE | `Sehenswuerdigkeiten-in-der-Naehe` | Matches existing link text; ü → ue for URL safety |
| ES | `Atracciones-Cercanas` | Matches existing link text "Atracciones cercanas" |

**Occurrences in non-Polish files**:

| File | Line | Link text |
|------|------|-----------|
| `01_STRONA_GLOWNA_EN.html` | 160 | "Nearby attractions" |
| `06_LOKALIZACJA_EN.html` | 192 | "Nearby attractions" |
| `01_STRONA_GLOWNA_DE.html` | 159 | "Sehenswürdigkeiten in der Nähe" |
| `06_LOKALIZACJA_DE.html` | 172 | "Sehenswürdigkeiten in der Nähe" |
| `01_STRONA_GLOWNA_ES.html` | 160 | "Atracciones cercanas" |
| `06_LOKALIZACJA_ES.html` | 172 | "Atracciones cercanas" |

**Total occurrences**: 6 (2 per language)

---

## Files with No Polish Slugs

The following 21 EN/DE/ES files contain **no Polish URL slugs** in their cross-links:

- `02_APARTAMENTY_EN/DE/ES.html`
- `03_EAGLE_NEST_EN/DE/ES.html`
- `04_EAGLE_VIEW_EN/DE/ES.html`
- `05_EAGLE_TOWER_EN/DE/ES.html`
- `07_ATRAKCJE_EN/DE/ES.html`
- `09_GALERIA_ZDJECIA_EN/DE/ES.html`

---

## Recommended Fix (when ready to implement)

For each language, replace the 4 href values (2 slugs × 2 occurrences per language):

### English (6 files affected: 01, 06, 08)
```
/txt/200/Eagle-Tower-Udogodnienia  →  /txt/200/Eagle-Tower-Amenities
/txt/202/Atrakcje-w-okolicy        →  /txt/202/Nearby-Attractions
```

### German (6 files affected: 01, 06, 08)
```
/txt/200/Eagle-Tower-Udogodnienia  →  /txt/200/Eagle-Tower-Ausstattung
/txt/202/Atrakcje-w-okolicy        →  /txt/202/Sehenswuerdigkeiten-in-der-Naehe
```

### Spanish (6 files affected: 01, 06, 08)
```
/txt/200/Eagle-Tower-Udogodnienia  →  /txt/200/Eagle-Tower-Instalaciones
/txt/202/Atrakcje-w-okolicy        →  /txt/202/Atracciones-Cercanas
```

> **CMS prerequisite**: The slug suffix in the CMS admin must be updated to match before HTML files are changed, otherwise links will 404. Coordinate with site-builder before implementing.

---

## Scope Note

This audit covers only `cms_pages/` template files. If any of these templates have already been pasted into the IdoSell CMS panel for client sites, those live pages will need separate slug updates via the CMS admin interface.
