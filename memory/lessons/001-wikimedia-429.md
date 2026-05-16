# Lesson 001: Wikimedia hotlinking returns HTTP 429

**Discovered:** 2026-04-16 (Piekary 1-3)
**Severity:** CRITICAL
**Confidence:** 100%

## Problem
URLs z `upload.wikimedia.org` użyte jako `src` obrazów zwracają HTTP 429 (Too Many Requests).
Wikimedia rate-limituje hotlinking — obrazy nie ładują się na stronie.

## Rozwiązanie
1. **Pexels** — `https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=800` — działa
2. **Unsplash** — `https://images.unsplash.com/photo-{ID}?w=600&q=80` — działa, ale nie zgaduj ID (sprawdź w przeglądarce)
3. **IdoBooking gallery** — `/images/frontpageGallery/pictures/large/{a}/{b}/{filename}` — zawsze działa jako fallback

## Reguła
NIGDY nie używaj Wikimedia jako CDN. Inne źródła zewnętrzne (Pexels, Unsplash) są OK.

## Powiązane
- UX-003 w ux-checklist.json
- CLAUDE.md trap #10
