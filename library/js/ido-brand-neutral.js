/* ═══════════════════════════════════════════════════════════════
   IDO-BRAND-NEUTRAL.JS — Broker multi-property mode dla /offer/N/

   Aktywacja: gdy klient ma JEDNĄ domenę portfolio + WIELE obiektów
   na shared engine z innymi obiektami spoza portfolio.

   Przykład (Piekary 1-3): klient ma 11 apartamentów Piekary na engine
   z 122 ogółem (122 = 11 nasze + 111 cudze, np. Mentalis "Sophie Apartment").
   Klient klika na Google "Sophie Apartment" → ląduje pod apart-torun.pl
   z naszą nawigacją "Piekary 1-3" → mylące, niezgodne z brand wybranym.

   Fix: na /offer/N/ podmienić nawigację na portfolio-domain links +
   wstrzyknąć brand banner + zabić duplikaty hotspot section.

   ─── PLACEHOLDERY do podmiany przy użyciu ────────────────────
   {{XX_PREFIX}}        np. pk, mc, sa (2-4 znaki kebab-prefix)
   {{PORTFOLIO_DOMAIN}} np. https://apart-torun.pl (NO trailing slash)
   {{BRAND_NAME}}       np. "Toruńskie Apartamenty"
   {{BRAND_NAME_UPPER}} np. "TORUŃSKIE APARTAMENTY"
   {{BRAND_SUBTITLE}}   np. "Nocleg w topowych toruńskich lokalizacjach"
   ─────────────────────────────────────────────────────────────

   Pattern z TRAP CRITICAL-X (Piekary13 v3.0-v3.17 session):
   - container-hotspot duplicates z naszym {{XX_PREFIX}}-offers-section
   - rozwiązanie: kill obu, zachowanie tylko jednego
   - timeouts: hotspot slick init opóźniony, kill 4x w czasie
   ═══════════════════════════════════════════════════════════════ */

function initOfferPageBranding() {
  var isOfferPage = document.body.classList.contains('page-offer') ||
                    /^\/offer\/\d+/.test(window.location.pathname);
  if (!isOfferPage) return;

  document.body.classList.add('{{XX_PREFIX}}-offer-mode');

  /* ── 1. Replace nav menu with portfolio-domain links ────── */
  var nav = document.querySelector('header.default13 nav, header.default13 .menu');
  if (nav) {
    var ul = nav.querySelector('ul') || nav;

    /* Hide existing system menu items (except logo if it's in nav) */
    ul.querySelectorAll('li').forEach(function (li) {
      var a = li.querySelector('a[href]');
      if (!a || a.querySelector('img')) return; /* skip logo */
      li.style.cssText = 'display:none !important;';
    });

    /* Add portfolio-domain menu items */
    var newMenu = [
      { text: '{{BRAND_NAME}}', href: '{{PORTFOLIO_DOMAIN}}/' },
      { text: 'O nas',          href: '{{PORTFOLIO_DOMAIN}}/o-nas/' },
      { text: 'Regulaminy',     href: '{{PORTFOLIO_DOMAIN}}/regulaminy/' },
      { text: 'Kontakt',        href: '{{PORTFOLIO_DOMAIN}}/kontakt/' }
    ];
    newMenu.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'nav-item {{XX_PREFIX}}-offer-nav-item';
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      a.target = '_blank';
      a.rel = 'noopener';
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  /* ── 2. Insert brand banner under header ───────────────── */
  if (!document.querySelector('.{{XX_PREFIX}}-offer-brand-banner')) {
    var banner = document.createElement('div');
    banner.className = '{{XX_PREFIX}}-offer-brand-banner';
    banner.innerHTML =
      '<div class="{{XX_PREFIX}}-offer-brand-banner__inner">' +
        '<p class="{{XX_PREFIX}}-offer-brand-banner__eyebrow">{{BRAND_NAME_UPPER}}</p>' +
        '<h2 class="{{XX_PREFIX}}-offer-brand-banner__title">{{BRAND_SUBTITLE}}</h2>' +
      '</div>';
    var header = document.querySelector('header.default13');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header.nextSibling);
    }
  }

  /* ── 3. Kill hotspot duplicates ────────────────────────── */
  /* TRAP CRITICAL-X: system .container-hotspot + nasz {{XX_PREFIX}}-offers-section
     pokazują tę samą rzecz dwukrotnie. Kill both, hotspot stays display:none. */
  function killHotspotDuplicates() {
    var our = document.querySelector('.{{XX_PREFIX}}-offers-section');
    if (our) our.remove();
    var systemHotspot = document.querySelector('.container-hotspot');
    if (systemHotspot) systemHotspot.style.cssText = 'display:none !important;';
  }
  killHotspotDuplicates();
  setTimeout(killHotspotDuplicates, 500);  /* po slick init */
  setTimeout(killHotspotDuplicates, 1500); /* po hotspot lazy load */
  setTimeout(killHotspotDuplicates, 3500); /* safety net dla wolnych połączeń */
}

/* Auto-init on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOfferPageBranding);
} else {
  initOfferPageBranding();
}
