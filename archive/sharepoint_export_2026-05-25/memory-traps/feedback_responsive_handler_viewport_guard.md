---
name: Responsive JS handlers — viewport guard obowiązkowy
description: Event handlery dla DESKTOP-only logic (np. dropdown close on outside-click) MUSZĄ mieć window.innerWidth check. Inaczej na mobile psują state innych elementów (Fair Rentals v1.62 ROOT CAUSE bugu).
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

Implementujesz dropdown na desktop. Dropdown ma:
- Toggler click → open/close
- Outside-click → close

Na mobile ten SAM widget jest INNY (np. flagi inline zamiast dropdown). Toggler hidden via CSS `display: none`.

Bez viewport guard, outside-click handler nadal fires na mobile — i może mieć skutki uboczne. Np. `document.addEventListener('click', closeDropdown)` ustawia `dropdown.style.display = 'none'` przy KAŻDYM kliku outside togglera. Na mobile gdzie ten "dropdown" element jest faktycznie inline flexbox, ustawienie `display:none` LIKWIDUJE flagi.

Fair Rentals v1.62 ROOT CAUSE: outside-click handler z desktop dropdown logic ustawiał `#language_menu { display: none !important }` na każdym kliku poza language widget. Na mobile (gdzie ten sam element MA być inline flex) → flagi znikały po jednym kliku poza widget (np. klik MENU hamburger).

# Pattern — viewport guard

Każdy handler odpowiedzialny za DESKTOP-only state MUSI mieć:

```javascript
btn.addEventListener('click', function(e) {
  // SKIP mobile — handler is for desktop dropdown only
  if (window.innerWidth <= 991) return;
  // ... desktop dropdown logic
});

document.addEventListener('click', function(e) {
  // SKIP mobile — outside-click close is desktop dropdown logic
  if (window.innerWidth <= 991) return;
  // ... close logic
});
```

# Co sprawdzić w istniejącym kodzie

Audit JS pod handlerami z `display: none` / `visibility: hidden` na elementach które na mobile mają być widoczne:

```bash
grep -n "addEventListener" FILE.js
# dla każdego handlera sprawdź czy modyfikuje element który ma inną rolę na mobile
```

Każdy taki handler powinien mieć viewport guard.

# Detection

Jeśli widzisz bug "X znika po kliku Y" — szukaj outside-click / global handlerów które modyfikują X. Sprawdź `addEventListener('click'`  z `document` lub `window` (nie tylko `element.addEventListener`).

# Reference

Fair Rentals v1.62 — finalny fix bugu "mobile menu cycle flagi znikają" po 5 próbach. Wszystkie wcześniejsze fixy próbowały naprawiać wrap.visibility (nie problem). Prawdziwy root cause: orphan outside-click handler z v1.55 era (dropdown) który nadal fired na mobile.

# Pułapka

Klient zgłasza bug → wpadasz w pułapkę "naprawić co user opisuje". User mówi "flagi znikają" → próbujesz naprawić visibility flag. ALE root cause może być w handlerach które uruchamiają się przy SAMEJ akcji (np. klik MENU) i wpływają na flagi BY ACCIDENT (orphan handler from previous era).

Lesson: gdy bug wraca po fixie, diagnosis was WRONG, not insufficient. Re-investigate from scratch, sprawdź **wszystkie handlery** które fire'ują w trakcie problematycznej sequencji.
