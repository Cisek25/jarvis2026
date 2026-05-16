# Lesson 003: fullpage.js blokuje window.scrollY na homepage

**Discovered:** 2026-04-13 (MountainPrestige)
**Severity:** CRITICAL
**Confidence:** 100%

## Problem
Header NIGDY nie zmienia się na "scrolled" (biały/przezroczysty) po przewinięciu.
`window.scrollY` zawsze = 0. Klasa `{prefix}-header--scrolled` nigdy się nie dodaje.

## Root cause
IdoBooking homepage używa fullpage.js — nie scrolluje strony normalnie,
tylko przesuwa sekcje CSS transformami. `window.scrollY` zawsze = 0.

## Rozwiązanie
MutationObserver na `body.className.match(/fp-viewing-(\d+)/)`:
- sekcja 1 = hero (not scrolled)
- sekcja 2+ = scrolled (header zmienia styl)
- Na podstronach (bez fullpage): normalny scroll listener

## Reguła
ZAWSZE sprawdź czy strona używa fullpage.js (`html.fp-enabled`).
Jeśli tak — NIGDY nie polegaj na window.scrollY.

## Powiązane
- CLAUDE.md trap #1
- KNOWN-FIXES.md: TRAP CRITICAL-QQ
