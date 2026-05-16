# Lesson 004: Footer ::before/::after pseudo-elementy z systemowego CSS

**Discovered:** 2026-04-13 (MountainPrestige)
**Severity:** CRITICAL
**Confidence:** 100%

## Problem
Granatowe paski widoczne po bokach footera mimo nadpisania background na elemencie.

## Root cause
System `app.css` ustawia:
```css
.footer-contact-baner::before {
  background: #3E475E;
  width: 100vw;
}
```
Override samego `.footer-contact-baner { background: ... }` NIE WYSTARCZY.
Pseudo-elementy mają swoją deklarację i trzeba je nadpisać OSOBNO.

## Rozwiązanie
```css
.footer-contact-baner::before,
.footer-contact-baner::after {
  background: var(--{prefix}-dark) !important;
}
```

## Reguła
Przy KAŻDYM override footera, ZAWSZE nadpisz też ::before i ::after.

## Powiązane
- UX-090 w ux-checklist.json
- CLAUDE.md trap #6
