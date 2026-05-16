---
name: about-page-solo-modifier-pattern
description: Dla podstrony "O nas" przygotuj BEM modifier `--solo` na grid zespołu zamiast hardkodować layout pod konkretną liczbę osób. Klient może mieć 1, 2, 3+ założycieli — modifier pozwala przełączyć między configami bez przebudowy CSS.
type: instinct
scope: idobooking-clients
trigger: budujesz sekcję "O nas / About us / Über uns" z portretami zespołu / klient zmienia liczbę osób w trakcie projektu
added: 2026-05-15
source_client: fairrentals — Sprint C sesja 13-15 (zaczął z 2 założycielkami, klient skorygował na 1)
related: instinct 036 (placeholder pattern), 044 (CMS auto-pull)
---

# Instynkt: Modifier `--solo` dla strony "O nas"

## Problem

Klient w briefie podaje "2 założycielki" — projektujesz 2-kolumnowy grid portretów. Potem w trakcie odkrywa się że:
- Druga osoba nie jest formalnie w spółce
- Klient chce zaczekać z drugą osobą
- Tylko 1 osoba jest gotowa na publiczne wystąpienie

Zamiast przepisywać CSS pod każdą zmianę — używaj **modifier patternu** który pozwala przełączać layout.

## Wzorzec (BEM)

```html
<!-- 1 osoba — solo modifier -->
<div class="fr-about__team fr-about__team--solo">
  <article class="fr-about__member">...</article>
</div>

<!-- 2+ osób — bez modifier -->
<div class="fr-about__team">
  <article class="fr-about__member">...</article>
  <article class="fr-about__member">...</article>
</div>
```

CSS:
```css
/* Default: 1 col mobile, 2 col desktop */
.fr-about__team {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 4vw, 48px);
}

@media (min-width: 768px) {
  .fr-about__team {
    grid-template-columns: 1fr 1fr;
  }
}

/* SOLO modifier — gdy tylko 1 osoba */
.fr-about__team.fr-about__team--solo {
  grid-template-columns: 1fr !important;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  /* Solo na desktop: portret obok bio (horizontal) zamiast pod */
  .fr-about__team--solo .fr-about__member {
    display: grid;
    grid-template-columns: minmax(0, 280px) 1fr;
    gap: clamp(24px, 3vw, 40px);
    align-items: center;
  }

  .fr-about__team--solo .fr-about__member-info {
    text-align: left;  /* bio align lewo (zamiast center) — lepiej dla 1 osoby */
  }
}
```

## Dlaczego to lepsze niż hardcoded

**ZŁE**:
```css
.fr-about__team {
  grid-template-columns: 1fr 1fr;  /* zakłada 2 osoby */
}
```

Gdy klient zmienia na 1 osobę — portrait wisi po lewej z pustym slotem po prawej. Wymaga rewrite.

**DOBRE**:
```css
.fr-about__team {
  grid-template-columns: 1fr;
  /* default 1 col — działa dla każdej liczby na mobile */
}
@media (min-width: 768px) {
  .fr-about__team { grid-template-columns: 1fr 1fr; }
  .fr-about__team--solo { grid-template-columns: 1fr; }
  .fr-about__team--triple { grid-template-columns: 1fr 1fr 1fr; }
}
```

Klient zmienia jedną klasę w HTML — layout się adaptuje.

## Plus: placeholder portretów

Klient rzadko ma profesjonalne portrety w trakcie projektu. **Domyślnie** używaj placeholder gold gradient z initials (zobacz instinct 036).

```html
<!-- Placeholder gdy klient nie dostarczył zdjęcia -->
<div class="fr-about__placeholder fr-about__placeholder--portrait" aria-hidden="true">
  <span class="fr-about__placeholder-initials">AB</span>
</div>

<!-- Po dostarczeniu — zamień na <img> -->
<img src="agnieszka.jpg" alt="Agnieszka Barańska — założycielka Fair Rentals">
```

INSTRUKCJA.txt dla klienta wskazuje DOKŁADNIE gdzie podmienić (find/replace).

## Workflow

1. **Brief**: ustal czy 1, 2, 3+ osób
2. **HTML**: użyj `--solo` / no-modifier / `--triple` zgodnie z liczbą
3. **CSS**: 3 reguły grid-template-columns dla każdego wariantu (default + 2 modifiers)
4. **Placeholder**: gold gradient + initials jeśli zdjęcia czekają
5. **INSTRUKCJA**: opisz klientowi gdzie zamienić placeholder na `<img>` + jakie wymiary zdjęć

## Anti-pattern

```css
/* ❌ ZŁE — hardcoded pod konkretną liczbę */
.about__team {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* "bo klient ma 2 osoby" */
}
```

Klient zmienia na 1 osobę → layout się rozjeżdża → musisz rewrite CSS.

## Referencje

- Source client: fairrentals — `O_NAS_PL/EN/DE__body_top.html` + CSS §102g
- Sesja 13: zaprojektowałem 2 osoby (Agnieszka + Małgorzata)
- Sesja 15: klient skorygował (tylko Agnieszka Barańska) — modifier `--solo` zaadaptował layout bez rewrite
- Related: instinct 036 (placeholder pattern), 040 (verify paste before iterate)
