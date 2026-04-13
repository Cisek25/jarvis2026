# JARVIS — Known Fixes & Patterns (IdoBooking)

## 🚨🚨🚨 TRAP CRITICAL-QQ — fullpage.js breaks scroll-based shrink (CRITICAL!)

**Discovered:** Mountain Prestige v1.14 (2026-04-13) — LIVE verified via DevTools MCP.

**Symptom:** Header NEVER becomes "scrolled" white even after scrolling.
`window.scrollY` always returns 0. `mp-header--scrolled` class never added.

**Root cause:** IdoBooking homepage uses **fullpage.js** library. It doesn't
use normal scroll — instead uses CSS transforms to move sections. The
window NEVER actually scrolls, so `window.scrollY` stays at 0 forever.
Scroll-based JS shrink detection FAILS.

**Fix — use MutationObserver on body class `fp-viewing-N`:**

```javascript
function initHeaderShrink() {
  var header = document.querySelector(HEADER_SEL);
  if (!header) return;

  function applyState(scrolled) {
    if (scrolled) {
      header.classList.add('{prefix}-header--scrolled');
    } else {
      header.classList.remove('{prefix}-header--scrolled');
    }
    document.documentElement.style.setProperty(
      '--{prefix}-current-header-h',
      scrolled ? '66px' : '88px'
    );
  }

  function checkFullpageState() {
    var match = document.body.className.match(/fp-viewing-(\d+)/);
    if (match) {
      /* fullpage.js active: section 1 = hero, 2+ = scrolled */
      applyState(parseInt(match[1], 10) > 1);
      return true;
    }
    return false;
  }

  /* MutationObserver detects fp-viewing-N class changes */
  var fullpageDetected = checkFullpageState();
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.attributeName === 'class') checkFullpageState();
    });
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  /* Regular scroll handler — works on non-fullpage pages (/offer, /contact) */
  function scrollUpdate() {
    if (document.body.className.match(/fp-viewing-/)) return;  /* skip if fullpage */
    applyState(window.scrollY > 80);
  }
  window.addEventListener('scroll', scrollUpdate, { passive: true });

  if (!fullpageDetected) scrollUpdate();
}
```

**LESSON FOR EVERY JARVIS CLIENT:**
- Check if site uses fullpage.js: `html.fp-enabled` or body class `fp-viewing-N`
- If YES — ALWAYS use MutationObserver on body.className for scroll state
- Regular `window.addEventListener('scroll')` WILL NOT WORK
- Combine both — fullpage for homepage, scroll for subpages

**Applied in:** Mountain Prestige (v1.14)

---

## 🚨 TRAP CRITICAL-RR — Hero height fullpage overrides max-height

**Symptom:** Hero section renders taller than expected, showing background
color strip below hero on initial load. Trying to constrain with `max-height`
fails because fullpage.js forces 100vh via JS.

**Fix — embrace fullpage.js, don't fight it:**
```css
body.page-index .section.parallax {
  margin-top: 0 !important;         /* was -88px (pull-up no longer needed) */
  height: 100vh !important;
  min-height: 100vh !important;
  max-height: none !important;       /* let fullpage control */
  overflow: hidden !important;
}
```

**Why `margin-top: 0` now works:** With fullpage.js, section 1 always takes
100vh (full viewport). Header is fixed over it. No gap at top or bottom.

**Applied in:** Mountain Prestige (v1.14)

---

## 🚨 TRAP CRITICAL-SS — "Powered by IdoBooking" badge visible as gray square

**Symptom:** At footer bottom, visible gray-ish rectangle ~120x88px.

**Root cause:** IdoBooking system renders `.powered_by > .powered_by_logo > img`
with SVG `powered_by_idoBooking_on_white.svg` (designed for WHITE bg).
Default size 120x120 with `filter: brightness(0) invert(1)` (becomes white).
On dark footer, the white-filtered SVG logo appears as prominent box.

**Fix — smaller + low opacity (can't remove entirely per IdoBooking TOS):**
```css
.powered_by,
.powered_by_logo {
  background: transparent !important;
  padding: 12px 0 !important;
  margin: 0 !important;
  text-align: center !important;
}

.powered_by_logo img,
.powered_by img {
  max-width: 80px !important;
  max-height: 18px !important;
  width: auto !important;
  height: auto !important;
  filter: brightness(0) invert(1) opacity(0.35) !important;
  background: transparent !important;
  display: inline-block !important;
}
```

Result: small subtle white badge (80x18px at 35% opacity) instead of
prominent gray square.

**Applied in:** Mountain Prestige (v1.14)

---

## 🚨 TRAP CRITICAL-MM — Make ALL section images zoomable (lightbox)

**Discovered:** Mountain Prestige v1.13.

**Symptom:** User wants ALL hero/section images clickable for fullscreen
zoom (about, location, banners), not just the gallery.

**Fix — extend lightbox JS to all `.{prefix}-zoomable` + section images:**
```javascript
function initGalleryLightbox() {
  var galleryItems = document.querySelectorAll('.{prefix}-gallery__item');
  var aboutImg = document.querySelector('.{prefix}-about__img');
  var locationImg = document.querySelector('.{prefix}-location__img');
  var bannerImgs = document.querySelectorAll('.{prefix}-banner-image img');
  var zoomable = document.querySelectorAll('.{prefix}-zoomable');

  var allItems = [];
  galleryItems.forEach(g => allItems.push({el: g, type: 'gallery'}));
  if (aboutImg) allItems.push({el: aboutImg, type: 'about'});
  if (locationImg) allItems.push({el: locationImg, type: 'location'});
  bannerImgs.forEach(b => allItems.push({el: b.parentElement, type: 'banner', img: b}));

  var imgData = allItems.map(item => {
    var img = item.img || item.el.querySelector('img');
    var caption = item.el.querySelector('.{prefix}-gallery__caption, .{prefix}-banner-image__quote');
    return {
      src: img?.src,
      alt: img?.alt,
      caption: caption?.textContent.trim() || img?.alt,
    };
  }).filter(d => d.src);

  /* ... rest of lightbox logic ... */
}
```

**CSS — cursor hint on all zoomable:**
```css
.{prefix}-about__img, .{prefix}-location__img,
.{prefix}-banner-image, .{prefix}-zoomable {
  cursor: zoom-in !important;
}
```

**Applied in:** Mountain Prestige (v1.13)

---

## 🚨 TRAP CRITICAL-NN — /txt subpages render system H1/H2 above body_top

**Discovered:** Mountain Prestige v1.13 (LIVE verified on /wspolpraca).

**Symptom:** Custom `/txt/{slug}` subpages have content starting too low.
Hidden system H1 (page title from CMS) and H2 render above body_top
content, pushing content down ~100px.

**Root cause:** IdoBooking on `/txt/{slug}` always renders system H1
(filled in panel CMS title field) BEFORE custom body_top content.
Even if H1 is empty in panel, the element exists with margin/padding.

**Fix — hide system first H1/H2 on /txt pages:**
```css
body.page-txt h1.big-label,
body.page-txt > h1:first-of-type,
body.page-txt .container > h1:first-of-type,
body.page-txt main > h1:first-of-type,
body.page-txt .section_sub > h1:first-of-type,
body.page-txt .section_sub > h2:first-of-type,
body.page-txt .container > h2:first-of-type {
  display: none !important;
}

/* Reduce overall top padding */
body.page-txt .section_sub,
body.page-txt main,
body.page-txt .container:not(.footer) {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

body.page-txt section:first-child,
body.page-txt > section:first-of-type {
  padding-top: 100px !important;  /* only for header offset */
}
```

**Applied in:** Mountain Prestige (v1.13) for /wspolpraca, /lokalizacja

---

## 🚨 TRAP CRITICAL-OO — Hero subtitle weak contrast (text-stroke needed)

**Symptom:** "APARTAMENTY PREMIUM W TATRACH" subtitle text blends with
hero image — single text-shadow not enough.

**Fix — 8-directional text-stroke + deep blur (same pattern as menu):**
```css
.{prefix}-hero__subtitle {
  color: #ffffff !important;
  font-weight: 500 !important;
  letter-spacing: 4px !important;
  text-shadow:
    1px 0 0 rgba(0, 0, 0, 0.85),
    -1px 0 0 rgba(0, 0, 0, 0.85),
    0 1px 0 rgba(0, 0, 0, 0.85),
    0 -1px 0 rgba(0, 0, 0, 0.85),
    1px 1px 0 rgba(0, 0, 0, 0.85),
    -1px -1px 0 rgba(0, 0, 0, 0.85),
    1px -1px 0 rgba(0, 0, 0, 0.85),
    -1px 1px 0 rgba(0, 0, 0, 0.85),
    0 2px 14px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.5) !important;
  -webkit-text-stroke: 0.3px rgba(0, 0, 0, 0.4) !important;
}
```

**Applied in:** Mountain Prestige (v1.13)

---

## 🚨 TRAP CRITICAL-PP — Gallery `<a href="/offers">` shows preview link on hover

**Symptom:** Hovering gallery items shows "/offers" URL in browser status
bar (link preview). User wants only image zoom, no link preview.

**Root cause:** Anchor `<a href="/offers">` triggers browser hover preview.
Even with `e.preventDefault()` in JS, hover preview still shows.

**Fix — replace anchor with `<button type="button">` (no href = no preview):**
```html
<!-- BEFORE -->
<a href="/offers" class="{prefix}-gallery__item">...</a>

<!-- AFTER -->
<button type="button" class="{prefix}-gallery__item">...</button>
```

**CSS — button reset:**
```css
.{prefix}-gallery__item {
  /* button reset */
  border: none;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-align: inherit;
  display: block;
  width: 100%;
  height: 100%;
  appearance: none;
  -webkit-appearance: none;
  /* keep existing zoom-in cursor + bg */
}
```

**Applied in:** Mountain Prestige (v1.13)
**Lesson:** When element is purely decorative interactive (lightbox trigger),
use `<button>` not `<a>`. Avoids hover preview + better accessibility.

---

## 🚨 TRAP CRITICAL-HH — .section.fp-auto-height.pb-5 systemic gray bg

**Discovered:** Mountain Prestige v1.12 (LIVE verified).

**Symptom:** Gray horizontal strip (~30px) between last content section
(.mp-final-cta, etc.) and footer on homepage. Appears as "systemic" gray bar.

**Root cause:** IdoBooking fullpage.js wraps body_top content in
`.section.fp-auto-height.pb-5` with:
- `background: rgb(241, 241, 241)` (gray system default)
- `padding-bottom: 30px` (Bootstrap `pb-5` = 3rem)

This gray bg + padding shows as strip between last section and footer.

**Fix — override both properties:**
```css
body.page-index .section.fp-auto-height,
body.page-index .section.fp-auto-height.pb-5,
body.page-index .fp-section.fp-table:not(.parallax) {
  background: var(--{prefix}-bg) !important;
  background-color: var(--{prefix}-bg) !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
```

**Applied in:** Mountain Prestige (v1.12)

---

## 🚨 TRAP CRITICAL-II — Footer empty space after VISA/MC strip

**Symptom:** After the payment strip, there's ~30-70px of dark brown empty
space before page ends. User wants strip to be absolute last visible element.

**Fix — force strip absolute last + kill all siblings below:**
```css
footer, .footer, .page-footer {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.footer-contact-baner,
.footer__strip {
  width: 100vw !important;
  position: relative !important;
  left: 50% !important;
  margin-left: -50vw !important;
  margin: 0 !important;
  padding: 14px 20px !important;
  background: #1C1510 !important;
}

/* Hide anything after the strip */
.footer-contact-baner ~ *,
.footer__strip ~ * {
  display: none !important;
}

.footer.container {
  padding-bottom: 0 !important;
}
```

**Applied in:** Mountain Prestige (v1.12)

---

## 🚨 TRAP CRITICAL-JJ — Scrolled header must be SOLID (not semi-transparent)

**Symptom:** After scrolling past hero, header is semi-transparent
(0.98 opacity), content shows through. User wants SOLID white for
readable content scroll behavior.

**Fix:**
```css
body header.default13.{prefix}-header--scrolled,
body .defaultsb.{prefix}-header--scrolled,
body header.default13.{prefix}-header--scrolled .menu-wrapper,
body header.default13.{prefix}-header--scrolled .bgd-color-light {
  background: #ffffff !important;
  background-color: #ffffff !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
}
```

**Applied in:** Mountain Prestige (v1.12)

---

## 🚨 TRAP CRITICAL-KK — /contact empty .contact__tel shows as white box

**Discovered:** Mountain Prestige v1.12 (LIVE verified).

**Symptom:** Contact page shows phone number in white box, but next to
it — EMPTY white box (small square). System renders 2 `.contact__tel`
elements, one often empty with `href="tel: "` (trailing space).

**Root cause:** IdoBooking system (owner data module) has 2 phone slots.
If client only filled 1, system still renders empty element:
```html
<a class="contact__tel" href="tel:+48535267585">+48 535267585</a>
<a class="contact__tel" href="tel: "></a>  <!-- EMPTY -->
```
My `/contact` CSS gave all these white bg + border → empty box visible.

**Fix — 2 parts:**

1. **CSS** — hide empty elements + remove white boxes:
```css
/* Hide empty contact elements */
body.page-contact .contact__tel:empty,
body.page-contact .contact__email:empty,
body.page-contact a[href="tel:"]:empty,
body.page-contact a[href="tel: "] {
  display: none !important;
}

/* Remove white bg/border from phone/email */
body.page-contact a[href^="tel:"],
body.page-contact a[href^="mailto:"],
body.page-contact .contact__tel,
body.page-contact .contact__email {
  background: transparent !important;
  border: none !important;
  padding: 4px 8px !important;
  color: var(--ido-primary) !important;
  font-weight: 600 !important;
}
```

2. **JS** — hide whitespace-only content (CSS `:empty` doesn't match space):
```javascript
function initContactPageCleanup() {
  if (!document.body.classList.contains('page-contact')) return;

  document.querySelectorAll('.contact__tel, .contact__email, a[href^="tel:"], a[href^="mailto:"]').forEach(function(el) {
    var text = (el.textContent || '').trim();
    var href = (el.getAttribute('href') || '').trim();
    if (!text || text.length < 4 || href === 'tel:' || href === 'tel: ' || href === 'mailto:') {
      el.classList.add('{prefix}-empty');
      el.style.display = 'none';
    }
  });
}
```

**Applied in:** Mountain Prestige (v1.12)

---

## 🚨 TRAP CRITICAL-LL — Gallery items should open lightbox, not navigate

**Symptom:** Homepage bento gallery items link to `/offers` via
`<a href="/offers">`. User wants click to OPEN FULLSCREEN lightbox
(zoom the image) instead of navigate.

**Fix — custom lightbox JS module:**
```javascript
function initGalleryLightbox() {
  var items = document.querySelectorAll('.{prefix}-gallery__item');
  if (!items.length) return;

  /* Create modal once */
  var modal = document.createElement('div');
  modal.className = '{prefix}-lightbox';
  modal.innerHTML = `
    <div class="{prefix}-lightbox__backdrop"></div>
    <button class="{prefix}-lightbox__close">&times;</button>
    <button class="{prefix}-lightbox__prev">&#8249;</button>
    <button class="{prefix}-lightbox__next">&#8250;</button>
    <div class="{prefix}-lightbox__content">
      <img class="{prefix}-lightbox__img" src="" alt="">
      <div class="{prefix}-lightbox__caption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  var imgData = Array.from(items).map(function(i) {
    var img = i.querySelector('img');
    var cap = i.querySelector('.{prefix}-gallery__caption');
    return { src: img?.src, alt: img?.alt, caption: cap?.textContent.trim() };
  });

  var currentIdx = 0;
  function show(idx) { /* ... update modal src + caption ... */ }
  function open(idx) { show(idx); modal.classList.add('--open'); }
  function close() { modal.classList.remove('--open'); }

  items.forEach(function(item, idx) {
    item.addEventListener('click', function(e) {
      e.preventDefault();  /* prevents /offers navigation */
      open(idx);
    });
  });

  /* close button, prev/next, keyboard ESC/← → */
}
```

**CSS:**
```css
.{prefix}-lightbox {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: none;
}
.{prefix}-lightbox.{prefix}-lightbox--open {
  display: flex;
  animation: fade-in 0.3s ease;
}
.{prefix}-lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(20, 15, 10, 0.95);
  backdrop-filter: blur(8px);
}
/* close/prev/next buttons with glass morphism */
```

**Benefit:** Keep `<a href="/offers">` as SEO-friendly fallback. JS
intercepts with `preventDefault()`. If JS fails, navigation still works.

**Applied in:** Mountain Prestige (v1.12)

---

## 🚨 TRAP CRITICAL-GG — Banner quote text blends with image colors

**Discovered:** Mountain Prestige v1.12 (2026-04-13)

**Symptom:** Full-width photo banner dividers with italic serif quotes
(e.g. "Góry są miejscem, gdzie czas zwalnia...") have text that blends
with mountain/forest image colors. White text + soft shadow insufficient
— quote mixes into foliage greens, sky whites, rock grays.

**Root cause:** Banner image backgrounds have varied color regions
(bright sky, dark rocks, mid-tone trees). Simple `text-shadow: 0 2px 16px`
blur doesn't provide enough contrast separation. Single gradient overlay
(0.25→0.45) too subtle on bright images.

**Fix — THREE-LAYER approach (overlay + text-stroke outline + author badge):**

```css
/* 1. STRONGER gradient — darker top/bottom, still transparent middle */
.{prefix}-banner-image__overlay {
  background: linear-gradient(
    180deg,
    rgba(20, 15, 10, 0.55) 0%,
    rgba(20, 15, 10, 0.35) 30%,
    rgba(20, 15, 10, 0.35) 70%,
    rgba(20, 15, 10, 0.65) 100%
  );
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
}

/* 2. Quote text — 8-directional 1.5px outline + deep atmospheric shadow */
.{prefix}-banner-image__quote {
  color: #ffffff;
  font-weight: 500;  /* bolder than 400 */
  text-shadow:
    /* 8-directional outline for stroke effect */
    1.5px 0 0 rgba(0, 0, 0, 0.9),
    -1.5px 0 0 rgba(0, 0, 0, 0.9),
    0 1.5px 0 rgba(0, 0, 0, 0.9),
    0 -1.5px 0 rgba(0, 0, 0, 0.9),
    1.5px 1.5px 0 rgba(0, 0, 0, 0.9),
    -1.5px -1.5px 0 rgba(0, 0, 0, 0.9),
    1.5px -1.5px 0 rgba(0, 0, 0, 0.9),
    -1.5px 1.5px 0 rgba(0, 0, 0, 0.9),
    /* Deep soft blur for atmosphere */
    0 4px 24px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(0, 0, 0, 0.5);
  -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.6);
}

/* 3. Author badge with glass morphism (dark bg + border + blur) */
.{prefix}-banner-image__author {
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 2px;
  display: inline-block;
  text-shadow:
    0 2px 10px rgba(0, 0, 0, 0.9),
    0 0 4px rgba(0, 0, 0, 0.6);
}
```

**Why this works:**
- 8-directional 1.5px shadows create CSS text-stroke outline
  (works on any bg color — even white sky)
- Deep blur shadows (24px, 40px) add atmospheric depth
- `-webkit-text-stroke: 0.5px` adds subpixel outline for modern browsers
- Gradient stronger at top/bottom (where text typically is) preserves
  image beauty in middle

**Applied in:** Mountain Prestige (v1.12)
**Lesson:** When text overlays varied-color images, ALWAYS combine:
1. Darker gradient at text regions
2. Multi-directional outline shadows (not just blur)
3. Optional backdrop-filter blur on text container

---

## 🚨 TRAP CRITICAL-DD — Navbar-brand logo too big → menu-wrapper 235px tall, covers content

**Discovered:** Mountain Prestige v1.11 (2026-04-13), LIVE verified via DevTools MCP.

**Symptom:** Header menu VERY TALL (200+ px), covers H1 and content on
subpages (/contact, /offer/X, etc.). Logo appears huge.

**Root cause:** IdoBooking uses `.navbar-brand` inside `.menu-wrapper`
(NOT `.logo` class). Client-uploaded logos (especially `wideLogo.svg`)
are often large (333x95 or bigger). Without explicit max-height CSS,
the logo dictates header height. `.menu-wrapper` inherits and
grows to fit logo + padding.

**Fix — constrain `.navbar-brand` + `.menu-wrapper` explicitly:**
```css
/* Logo size limits — match BOTH .logo AND .navbar-brand selectors */
header .menu-wrapper .navbar-brand,
header .menu-wrapper .navbar-brand img,
header .navbar-brand,
header .navbar-brand img,
.menu-wrapper .navbar-brand,
.menu-wrapper .navbar-brand img {
  max-height: 56px !important;
  width: auto !important;
  max-width: 240px !important;
  height: auto !important;
}

header .menu-wrapper .navbar {
  min-height: 56px !important;
  height: auto !important;
  padding: 8px 0 !important;
  align-items: center !important;
  justify-content: space-between !important;
}

header .menu-wrapper,
header .menu-wrapper .container {
  max-height: 88px !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* Scrolled state — more compact */
header.{prefix}-header--scrolled .menu-wrapper,
header.{prefix}-header--scrolled .menu-wrapper .container {
  max-height: 66px !important;
}
header.{prefix}-header--scrolled .navbar-brand img {
  max-height: 46px !important;
}
```

**Applied in:** Mountain Prestige (v1.11)
**Lesson:** Always target BOTH `.logo` AND `.navbar-brand` in header CSS.
IdoBooking uses `.navbar-brand` (Bootstrap pattern). Legacy templates
use `.logo`. Explicit max-height prevents oversized client logos from
breaking layout.

---

## 🚨 TRAP CRITICAL-EE — `.tabs.--fixed` width: 100vw not applying (specificity war)

**Discovered:** Mountain Prestige v1.11 (verified live).

**Symptom:** On `/offer/X` page, when scrolling past tabs bar, system
adds `--fixed` class making tabs position:fixed. My L1 rule
`.tabs.--fixed { width: 100vw }` was NOT applying — tabs width
remained at 1140px (container width), shifted left of viewport.

**Root cause:** Some later CSS rule with equal or higher specificity was
overriding the `!important` width. Possibly system inline style or
cascade timing issue.

**Fix — higher specificity + dynamic top via CSS var:**
```css
/* Increase specificity by prefixing with body and html */
body .tabs.--fixed,
body.page-offer .tabs.--fixed,
html body .tabs.--fixed,
.offer-desc-wrapper .tabs.--fixed {
  position: fixed !important;
  top: var(--{prefix}-current-header-h, 88px) !important;
  left: 0 !important;
  right: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1000 !important;
  background: var(--ido-light, #fff) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08) !important;
  transition: top 0.25s ease !important;
}
```

**JS — update CSS var when header shrinks (tabs follow):**
```javascript
function update() {
  // ... existing shrink logic ...
  document.documentElement.style.setProperty(
    '--{prefix}-current-header-h',
    header.classList.contains('{prefix}-header--scrolled') ? '66px' : '88px'
  );
}
```

**Why CSS var vs hardcoded?** Tabs `top` must match CURRENT header height:
- At page top (not scrolled): header = 88px, tabs top = 88px
- After scroll (header shrinks to 66px): tabs top = 66px (no gap)

Without this, 22px gap appears between shrunken header bottom and
fixed tabs top.

**Applied in:** Mountain Prestige (v1.11)

---

## 🚨 TRAP CRITICAL-FF — `.offer-price span` has asymmetric padding → price looks crooked

**Discovered:** Mountain Prestige v1.11.

**Symptom:** Price circle on /offer/X (150x150 gold circle with "Od 280,00 zł")
has the price text shifted right. Circle is correct but content crooked.

**Root cause:** IdoBooking system applies `padding: 0 0 0 5px` (5px left)
on `.offer-price span` element. Breaks flex-center alignment.

**Fix — force zero padding + symmetric centering:**
```css
body.page-offer .offer-price small,
body.page-offer .offer-price span,
.offer-price small,
.offer-price span {
  padding: 0 !important;
  margin: 0 !important;
  text-align: center !important;
  width: 100% !important;
  display: block !important;
}

body.page-offer .offer-price {
  padding: 0 !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 2px !important;
}
```

**Applied in:** Mountain Prestige (v1.11)
**Lesson:** Always inspect system CSS for asymmetric padding/margin on
child elements before assuming container-level flex alignment will work.

---

## 🚨 TRAP CRITICAL-CC — /offers filters open by default (user wants collapsed)

**REMEMBER FOR EVERY CLIENT** — Mountain Prestige v1.11 (2026-04-13), verified live.

**Symptom:** On `/offers` subpage, all filters (Typ obiektu, Udogodnienia,
Powierzchnia, Lokalizacja, etc.) are rendered EXPANDED by default,
cluttering the sidebar. User expects them collapsed — click header to open.

**Root cause:** IdoBooking system renders filters as Bootstrap collapse:
```html
<div class="filter_header" id="filter_header_objectTypes">
  <span><strong>Typ obiektu</strong><i class="fa fa-angle-down"></i></span>
</div>
<div class="filter_content collapse show" id="filter_objectTypes_content">
  ... checkboxes ...
</div>
```

The `show` class on `.filter_content.collapse` means OPEN. System adds it
to all filters on page load. System does NOT provide toggle JavaScript —
headers have NO `data-target` or Bootstrap initialization.

**Fix — CSS (already in Layer 1 TRAP):**
```css
body.page-offers .filter_content.collapse:not(.show) {
  display: none !important;
}
body.page-offers .filter_content.collapse.show {
  display: block !important;
  height: auto !important;
  overflow: visible !important;
}
```

**Fix — JS (module 10b in body_bottom):**
```javascript
function initOffersFilters() {
  if (!document.body.classList.contains('page-offers')) return;

  var filters = document.querySelectorAll('.filter_content.collapse');
  var headers = document.querySelectorAll('.filter_header');
  if (!filters.length || !headers.length) return;

  /* Step 1: collapse all filters on init — remove .show from every one */
  filters.forEach(function(f) { f.classList.remove('show'); });

  /* Step 2: initialize headers with aria-expanded + click handler */
  headers.forEach(function(h) {
    h.setAttribute('aria-expanded', 'false');
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');

    if (h.dataset.mpFilterInit) return;  /* prevent double-bind on retry */
    h.dataset.mpFilterInit = 'true';

    h.addEventListener('click', function() {
      /* System ID pattern: filter_header_X → filter_X_content */
      var match = h.id.match(/filter_header_(.+)/);
      if (!match) return;
      var content = document.getElementById('filter_' + match[1] + '_content');
      if (!content) return;

      var expanded = h.getAttribute('aria-expanded') === 'true';
      h.setAttribute('aria-expanded', !expanded);
      content.classList.toggle('show');
    });

    /* Keyboard accessibility */
    h.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        h.click();
      }
    });
  });
}
```

**Chevron rotation (already in L1 via aria-expanded):**
```css
body.page-offers .filter_header::after {
  content: "" !important;
  /* chevron shape */
  transform: rotate(45deg) !important;
  transition: transform 0.3s ease !important;
}
body.page-offers .filter_header[aria-expanded="true"]::after {
  transform: rotate(-135deg) !important;  /* point up when open */
}
```

**Applied in:** Mountain Prestige (v1.11)
**LESSON: EVERY new client MUST include this JS module for /offers page.**
System's default behavior (all filters open) is never what clients want.

---

## 🚨🚨🚨 TRAP CRITICAL-AA — IdoBooking uses fullpage.js → body_top lands in SECTION 2

**Discovered:** Mountain Prestige v1.10 (2026-04-13) — verified via Chrome DevTools MCP

**KEY ARCHITECTURAL INSIGHT:** IdoBooking homepage (default13 template) uses
**fullpage.js** library. This creates TWO separate `.section` divs:

```
html.fp-enabled
  body.page-index.fp-viewing-1
    main.fullpage-wrapper
      .section.parallax                    ← SECTION 1 (hero image)
        .fp-tableCell
          .index-info (system H1/H2/button/iai_book_se)

      .section.fp-auto-height.fp-section.fp-table   ← SECTION 2 (content)
        .fp-tableCell
          .section_sub.container
            .mp-hero-wrap   ← body_top content LANDS HERE (wrong!)
            .mp-about
            .mp-featured
            .mp-gallery
            ...
```

**Symptom:** Hero wrap with title/search ends up BELOW the hero image
(at y=608 after hero ends) instead of overlaying it. All `position: absolute`
positioning references Section 2, not Section 1 hero.

**Fix — JS teleport hero-wrap INTO .section.parallax:**
```javascript
function teleportHeroWrap() {
  var heroWrap = document.querySelector('.{prefix}-hero-wrap');
  var sectionParallax = document.querySelector('.section.parallax');
  if (!heroWrap || !sectionParallax) return false;
  if (sectionParallax.contains(heroWrap)) return true;

  /* Prefer .fp-tableCell for fullpage.js proper layout */
  var target = sectionParallax.querySelector('.fp-tableCell')
               || sectionParallax;
  target.appendChild(heroWrap);
  return true;
}

/* Retry — fullpage.js may init async */
if (!teleportHeroWrap()) {
  [100, 500, 1500, 3000].forEach(function(delay) {
    setTimeout(teleportHeroWrap, delay);
  });
}
```

**Then CSS — hero-wrap fills section.parallax:**
```css
.section.parallax .{prefix}-hero-wrap,
.section.parallax .fp-tableCell .{prefix}-hero-wrap {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 100px 20px 40px !important;
  z-index: 11 !important;
  pointer-events: none !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: visible !important;
}
```

**Applied in:** Mountain Prestige (v1.10) — LIVE verified via DevTools MCP.
**Critical lesson:** ALWAYS check for `html.fp-enabled` or `.fp-section` in
the DOM. IdoBooking templates that use fullpage.js need JS teleport for
hero overlay content.

---

## 🚨🚨🚨 TRAP CRITICAL-BB — Header looks white BUT `header` bg IS transparent — child `.menu-wrapper` has white bg

**Discovered:** Mountain Prestige v1.10

**Symptom:** CSS `background: transparent !important` applied to `header.default13`
but header still LOOKS white. Computed bg IS `rgba(0, 0, 0, 0)` (transparent).

**Root cause:** IdoBooking header has CHILD element with background:
```html
<header class="default13">
  <script>...</script>
  <div class="bgd-color-light menu-wrapper">  <!-- THIS has white bg -->
    ...menu content...
  </div>
</header>
```

`.bgd-color-light.menu-wrapper` has `background: rgb(255, 255, 255)` from
system CSS. Targeting only `header` doesn't override child bg.

**Fix — target `.menu-wrapper` AND `.bgd-color-light`:**
```css
body.page-index header .menu-wrapper,
body.page-index header .bgd-color-light,
body.{prefix}-homepage header .menu-wrapper,
body.{prefix}-homepage header .bgd-color-light {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  transition: background 0.3s ease !important;
}

/* Scrolled state brings bg back */
body header.{prefix}-header--scrolled .menu-wrapper,
body header.{prefix}-header--scrolled .bgd-color-light {
  background: rgba(255, 255, 255, 0.98) !important;
}

/* Non-homepage always has cream bg */
body:not(.page-index):not(.{prefix}-homepage) header .menu-wrapper {
  background: rgba(250, 246, 237, 0.96) !important;
}
```

**Also style language dropdown + select children:**
```css
body.page-index header:not(.{prefix}-header--scrolled) .language {
  background: transparent !important;
}
body.page-index header:not(.{prefix}-header--scrolled) select {
  background: rgba(0, 0, 0, 0.3) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}
```

**Applied in:** Mountain Prestige (v1.10)
**Critical lesson:** When CSS looks correct but visual bg persists, use
DevTools to inspect CHILDREN of the target element. System CSS often puts
bg on `.menu-wrapper`, `.navbar-wrapper`, or `.header-inner` child,
not on `<header>` itself.

---

## 🚨 TRAP CRITICAL-Z — Breakout trick FAILS with container padding

**Discovered:** Mountain Prestige v1.9 (2026-04-13)

**Symptom:** Hero wrap (with search widget) shifted left, cut off on left
edge. Widget appears offset rather than centered across viewport.

**Root cause:** Standard viewport breakout technique:
```css
.element {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
}
```
Works ONLY if parent's width equals viewport width (no padding). When
parent is `.container` with padding-left/right (Bootstrap default: 15px),
the 50% calculation uses container width (not viewport), creating offset
equal to container padding.

**Fix — use `position: absolute` to escape container entirely:**

```css
/* Ensure positioned reference for absolute child */
body.{prefix}-homepage,
body.page-index {
  position: relative !important;
}

/* Hero wrap: absolute positioning from body (not container) */
.{prefix}-hero-wrap {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: 100vw !important;
  height: 85vh !important;
  margin: 0 !important;
  /* ... rest ... */
}
```

**Consequences:**
- Absolute is OUT of flow → subsequent content flows below system
  `.section.parallax` (which is 85vh in flow) naturally
- No more breakout math, no padding offset
- Independent of container width/padding

**Applied in:** Mountain Prestige (v1.9)
**Lesson:** Viewport breakout trick is fragile. For critical hero
overlays, use `position: absolute` with body as positioned reference.

---

## 🚨 TRAP CRITICAL-V v1.9 — Multi-fallback selectors for homepage detection

**Symptom:** Transparent header CSS not applying. Menu visible with cream
background even on homepage hero.

**Root cause:** `body.page-index` class assumption. IdoBooking templates
inconsistently use:
- `page-index`
- `home`
- `frontpage`
- No specific class (just path-based)

If body doesn't have the expected class, CSS rule never matches.

**Fix — JS-injected class + multi-selector CSS fallbacks:**

**JS (body bottom):**
```javascript
(function detectHomepage() {
  var path = window.location.pathname;
  var isHomepage =
    document.body.classList.contains('page-index') ||
    document.body.classList.contains('home') ||
    document.body.classList.contains('frontpage') ||
    path === '/' ||
    path === '' ||
    /^\/[a-z]{2}\/?$/.test(path) ||  /* /pl/, /en/, etc. */
    document.querySelector('.{prefix}-hero-wrap');  /* presence fallback */

  if (isHomepage) {
    document.body.classList.add('{prefix}-homepage');
    document.documentElement.classList.add('{prefix}-homepage');
  }
})();
```

**CSS (catches any of the possible classes):**
```css
body.page-index header:not(.{prefix}-header--scrolled),
body.{prefix}-homepage header:not(.{prefix}-header--scrolled),
body.home header:not(.{prefix}-header--scrolled),
body.frontpage header:not(.{prefix}-header--scrolled),
html.{prefix}-homepage body header:not(.{prefix}-header--scrolled) {
  background: transparent !important;
  /* ... */
}
```

**Applied in:** Mountain Prestige (v1.9)
**Lesson:** Never rely on a single body class. Always JS-inject your own
identifier AND include multiple CSS selectors for fallback.

---

## 🚨 TRAP CRITICAL-Y — Search widget belongs INSIDE hero-wrap (not separate)

**Discovered:** Mountain Prestige v1.8 (2026-04-13)

**Symptom:** Search widget always ends up "too low" on viewport regardless
of negative margin values. User has to scroll to see it.

**Root cause:** Widget in separate `<section>` after hero = positioned in
content flow AFTER hero section. Even with margin-top: -140px, still lands
in lower portion of viewport. Negative margins don't truly "lift" through
other sections reliably.

**Fix — move widget INSIDE `.{prefix}-hero-wrap` as flex-bottom child:**

**HTML structure:**
```html
<!-- BEFORE (v1.3-v1.7): widget in separate section -->
<div class="{prefix}-hero-wrap">
  <div class="{prefix}-hero__content">...title...</div>
</div>
<section id="search" class="{prefix}-search-wrapper">  <!-- OUTSIDE hero -->
  <form>...</form>
</section>

<!-- AFTER (v1.8): widget INSIDE hero as flex child -->
<div class="{prefix}-hero-wrap">
  <div class="{prefix}-hero__content">...title...</div>
  <div class="{prefix}-hero__search-bar" id="search">  <!-- INSIDE hero -->
    <form>...</form>
  </div>
</div>
```

**CSS:**
```css
.{prefix}-hero-wrap {
  display: flex;
  flex-direction: column;
  overflow: visible;  /* search can peek below if needed */
  padding: 88px 0 40px;
  /* ... existing positioning ... */
}

.{prefix}-hero__content {
  flex: 1;  /* fill space between header padding and search */
  display: flex;
  flex-direction: column;
  justify-content: center;  /* center vertically in available space */
}

.{prefix}-hero__search-bar {
  margin-top: auto;  /* push to bottom of hero */
  padding: 0 20px;
  pointer-events: auto;  /* override parent pointer-events: none */
  z-index: 30;
}

.{prefix}-hero__search-bar .{prefix}-search {
  max-width: 1100px;
  margin: 0 auto;
}
```

**Benefits:**
- Widget ALWAYS visible in viewport (inside 85vh hero)
- No fragile negative margin math
- Clean structure — search is semantically part of hero
- Content (title) auto-centered in remaining space

**Applied in:** Mountain Prestige (v1.8)
**Lesson:** If a widget "always ends up too low", it's probably in the
wrong section. Move it INSIDE the hero container rather than trying to
pull it up with negative margins.

---

## 🚨 TRAP CRITICAL-V v1.8 — Fully transparent header with text-stroke menu

**Discovered:** Mountain Prestige v1.8

**Symptom:** Client wants header fully transparent on homepage hero BUT
menu labels must remain readable on ANY bg color (bright sky/dark
forest/mixed patterns).

**Root cause of earlier approach (semi-dark gradient):** Worked but gave
"cloudy" look that wasn't fully transparent.

**Fix — 8-directional pixel shadow = text-stroke-like outline effect:**
```css
/* Header fully transparent */
body.page-index header.default13:not(.{prefix}-header--scrolled) {
  background: transparent !important;
  backdrop-filter: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}

/* Menu text — 8-directional 1px black shadows create outline */
body.page-index header:not(.{prefix}-header--scrolled) a[href]:not(.logo):not([class*="btn"]) {
  color: #ffffff !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
  text-shadow:
    /* 8-directional outline (N, S, E, W, NE, NW, SE, SW) */
    1px 0 0 rgba(0, 0, 0, 0.95),
    -1px 0 0 rgba(0, 0, 0, 0.95),
    0 1px 0 rgba(0, 0, 0, 0.95),
    0 -1px 0 rgba(0, 0, 0, 0.95),
    1px 1px 0 rgba(0, 0, 0, 0.95),
    -1px -1px 0 rgba(0, 0, 0, 0.95),
    1px -1px 0 rgba(0, 0, 0, 0.95),
    -1px 1px 0 rgba(0, 0, 0, 0.95),
    /* Soft depth blur shadow */
    0 2px 10px rgba(0, 0, 0, 0.85),
    0 0 24px rgba(0, 0, 0, 0.6) !important;
  /* WebKit stroke for extra modern browser safety */
  -webkit-text-stroke: 0.4px rgba(0, 0, 0, 0.5) !important;
}

/* Logo: drop-shadow filter (preserves logo colors) */
body.page-index header:not(.{prefix}-header--scrolled) .logo img {
  filter:
    drop-shadow(0 2px 10px rgba(0, 0, 0, 0.85))
    drop-shadow(0 0 3px rgba(0, 0, 0, 0.6)) !important;
}
```

**Why 8-directional shadows vs `-webkit-text-stroke` alone:**
- `-webkit-text-stroke` doesn't respect anti-aliasing → edges look crude
- 8-directional pixel shadows give softer, native-looking outline
- Combine BOTH for maximum coverage across browsers

**Applied in:** Mountain Prestige (v1.8)
**Lesson:** For "transparent header + visible menu" effect, use
8-directional 1px black shadows as outline stroke. Works on any bg.

---

## 🚨 TRAP CRITICAL-X — Hero CSS bg leak onto entire body

**Discovered:** Mountain Prestige v1.7 (2026-04-13)

**Symptom:** Hero background image visible NOT ONLY in hero section but
across entire scrollable page body — bg "follows" the user down through
all sections.

**Root cause:** CSS `background-image` applied to BOTH `.section.parallax`
AND `.parallax-slider`. In some IdoBooking templates, `.parallax-slider`
has `position: fixed` (for parallax scroll effect). Fixed element with
bg-image renders across entire viewport, regardless of scroll.

**Fix — bg ONLY on `.section.parallax::before` pseudo + explicit clear:**
```css
/* Hero container — contained dimensions, overflow hidden */
body.page-index .section.parallax {
  position: relative !important;
  height: 85vh !important;
  max-height: 85vh !important;
  min-height: 85vh !important;
  overflow: hidden !important;  /* CRITICAL — contain bg within this */
  background-image: none !important;
}

/* Bg image on pseudo-element (independent animation target) */
body.page-index .section.parallax::before {
  content: '' !important;
  position: absolute !important;
  top: -4% !important;
  left: -4% !important;
  right: -4% !important;
  bottom: -4% !important;
  background-image: url('WIKIMEDIA_LANDSCAPE_URL') !important;
  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  z-index: 0 !important;
  pointer-events: none !important;
  animation: {prefix}-ken-burns 22s ease-in-out infinite alternate !important;
}

/* EXPLICITLY clear bg from .parallax-slider (was leaking body-wide) */
body.page-index .parallax-slider,
body.page-index .parallax-slider .slick-list,
body.page-index .parallax-slider .slick-track,
body.page-index .parallax-slider .slick-slide {
  background-image: none !important;
  background-color: transparent !important;
  animation: none !important;
}

/* Position parallax-slider absolutely inside section.parallax */
body.page-index .parallax-slider {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
}
```

**Visible Ken Burns zoom (transform-based, not bg-size):**
```css
@keyframes {prefix}-ken-burns {
  0%   { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.08) translate(-1%, -1%); }
}
```

Why transform over `background-size` animation:
- `background-size: 110% → 120%` = subtle, user doesn't notice
- `transform: scale(1) → scale(1.08)` + translate = clearly visible
- Uses GPU compositing = smoother performance

**Hero text centering (symmetric padding):**
```css
/* v1.6 had asymmetric 88px/140px — text offset up */
/* v1.7: symmetric 100px/100px = truly centered */
.{prefix}-hero__content {
  padding: 100px 24px 100px !important;
  max-width: 1100px;
  margin: 0 auto;
}
```

**Applied in:** Mountain Prestige (v1.7)
**Lesson:** NEVER apply `background-image` to potentially fixed-position
elements. Always contain with parent `overflow: hidden` + pseudo-element
for bg image (easier to animate independently of content).

---

## 🚨 TRAP CRITICAL-U — Hero image missing → CSS bg fallback

**Discovered:** Mountain Prestige v1.6 (2026-04-13)

**Symptom:** Hero area on homepage is empty/gray/default. Client repeatedly
reports "hero photo still not visible" even after other fixes.

**Root cause:** System `.parallax-slider` only renders images uploaded to
panel's frontpageGallery. If client hasn't uploaded — empty slider.
Our CSS/HTML doesn't control system's image loading.

**Fix — inject CSS background on `.section.parallax` + `.parallax-slider`:**
```css
body.page-index .section.parallax,
body.page-index .parallax-slider {
  background-image: url('WIKIMEDIA_LANDSCAPE_URL') !important;
  background-size: cover !important;
  background-position: center 30% !important;
  background-repeat: no-repeat !important;
  background-color: #1a1510 !important;
}

/* Ken Burns on background */
@keyframes {prefix}-ken-burns-bg {
  0%   { background-size: 110% auto; background-position: center 30%; }
  100% { background-size: 120% auto; background-position: center 40%; }
}
body.page-index .section.parallax,
body.page-index .parallax-slider {
  animation: {prefix}-ken-burns-bg 25s ease-in-out infinite alternate;
}
```

**How it works:** CSS bg is ALWAYS there. When client uploads to panel,
system's `<img>` renders ON TOP of background (higher z-index). When not
uploaded, background shows. No 404, no empty area.

**Applied in:** Mountain Prestige (v1.6) using Giewont Wikimedia photo.

---

## 🚨 TRAP CRITICAL-V — Menu invisible on transparent header (strong shadow + semi-dark gradient)

**Discovered:** Mountain Prestige v1.6

**Symptom:** With fully transparent header on homepage top, white menu
text becomes invisible over bright hero image areas (sky, snow, clouds).

**Root cause:** Pure white text without strong background contrast = blends
with bright image parts. Only `text-shadow` isn't enough on mixed bg.

**Fix — subtle dark gradient at top of header + stronger text shadow:**
```css
/* Gradient from dark at top to transparent at bottom of header */
body.page-index header.default13:not(.{prefix}-header--scrolled),
body.page-index .defaultsb:not(.{prefix}-header--scrolled) {
  background: linear-gradient(
    to bottom,
    rgba(26, 21, 16, 0.75) 0%,
    rgba(26, 21, 16, 0.45) 60%,
    rgba(26, 21, 16, 0.0) 100%
  ) !important;
  backdrop-filter: blur(4px) saturate(1.1) !important;
  -webkit-backdrop-filter: blur(4px) saturate(1.1) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* Stronger menu text shadow (triple-layer for depth) */
body.page-index header:not(.{prefix}-header--scrolled) a[href]:not(.logo):not([class*="btn"]) {
  color: #ffffff !important;
  font-weight: 600 !important;
  letter-spacing: 1px !important;
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.85),
    0 0 4px rgba(0, 0, 0, 0.6),
    0 1px 1px rgba(0, 0, 0, 0.8) !important;
}
```

**Applied in:** Mountain Prestige (v1.6)

---

## 🚨 TRAP CRITICAL-W — Image URL verification methodology

**Problem pattern:** Hardcoded fallback image URLs often 404 because:
1. `/clientXXXXX.idobooking.com/images/frontpageGallery/.../N.jpg` — 404 if
   client hasn't uploaded yet
2. Wikimedia URLs with GUESSED hashes (`/5/5f/...`) frequently wrong —
   Wikimedia uses MD5 hash of filename for thumb path

**Fix — methodology for every new client:**
```bash
# 1. Fetch Polish/English Wikipedia page for topic
curl -sL -A "Mozilla/5.0" "https://pl.wikipedia.org/wiki/Zakopane" \
  | grep -oE 'upload\.wikimedia\.org/wikipedia/commons/thumb/[^"]+' \
  | head -10

# 2. For each extracted URL, verify 200 status
curl -sI "https://upload.wikimedia.org/wikipedia/commons/thumb/X/XX/file.jpg/1280px-file.jpg" \
  | grep "HTTP/2"

# 3. Only use URLs that return 200
```

**VERIFIED Wikimedia URLs for Polish mountains (Zakopane/Tatry):**
```
Giewont:
  https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Giewont_T58.jpg/1920px-Giewont_T58.jpg
  https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Giewont_58.3.jpg/1280px-Giewont_58.3.jpg

Dolina Kościeliska:
  https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Tatry_Dolina_Koscieliska_dron_%281%29.jpg/1280px-Tatry_Dolina_Koscieliska_dron_%281%29.jpg

Morskie Oko:
  https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Morskie_Oko_od_schroniska.JPG/1280px-Morskie_Oko_od_schroniska.JPG
  https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Morskie_Oko_i_%C5%82a%C5%84cuch_Tatr.jpg/1280px-Morskie_Oko_i_%C5%82a%C5%84cuch_Tatr.jpg

Kasprowy Wierch:
  https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Kasprowy_Wierch_a1.jpg/1920px-Kasprowy_Wierch_a1.jpg
  https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Kasprowy_Wierch-Kasprov_vrch_winter_1.jpg/1280px-Kasprowy_Wierch-Kasprov_vrch_winter_1.jpg

Tatry panorama:
  https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Tatra_mountains_western_side_2.jpg/1920px-Tatra_mountains_western_side_2.jpg
  https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Tatry_Wysokie_1-T9.jpg/1280px-Tatry_Wysokie_1-T9.jpg
  https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tatry_widok_z_Tarasowek.jpg/1280px-Tatry_widok_z_Tarasowek.jpg

Rysy + other:
  https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Rysy_2.jpg/1280px-Rysy_2.jpg
  https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Dolina_Bia%C5%82ej_Wody_a5.jpg/1280px-Dolina_Bia%C5%82ej_Wody_a5.jpg
```

**Applied in:** Mountain Prestige (v1.6). Saved to JARVIS memory as
permanent URL library for mountain/Zakopane projects.

---

## 🚨 TRAP CRITICAL-R — Layer 1 white gradient washes out hero image

**Discovered:** Mountain Prestige v1.5 (2026-04-13)

**Symptom:** Hero image from panel loads but looks washed out / faded /
partially hidden under a white haze. User reports "main photo not visible"
even though `<img>` is loaded in DOM.

**Root cause:** Layer 1 TRAP #15 applies a strong white gradient overlay:
```css
.section.parallax::after {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.85) 0%,  /* 85% white at top! */
    rgba(255, 255, 255, 0.4)  12%,
    rgba(255, 255, 255, 0)    22%,
    ...
  );
}
```
Original purpose: soften top of hero when header had cream bg.
But with transparent header on homepage, this kills image contrast.

**Fix — override for homepage with subtle dark-only gradient:**
```css
body.page-index .section.parallax::after,
body.page-index .parallax-slider::after {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0)    30%,
    rgba(0, 0, 0, 0)    60%,
    rgba(0, 0, 0, 0.4) 100%
  ) !important;
}
```

**Applied in:** Mountain Prestige (v1.5)

---

## 🚨 TRAP CRITICAL-S — Menu invisible (use [href] fallback selectors)

**Discovered:** Mountain Prestige v1.5 (2026-04-13)

**Symptom:** Header menu items present in DOM but invisible — no text visible
either due to wrong color, low opacity, or missing CSS application.

**Root cause:** IdoBooking system uses varying menu DOM structures across
template versions (`nav > ul > li > a`, or `div.menu > a`, or
`.navbar-nav a`). Specific selectors targeting only one structure miss.

**Fix — universal `[href]` fallback selector:**
Target ANY link in header that's NOT a logo or button = it's a menu item.

```css
/* Universal menu selector — catches all structures */
body header a[href]:not(.logo):not([class*="logo"]):not([class*="btn"]):not([class*="reserv"]):not([class*="lang"]),
body header.default13 a[href]:not(.logo):not([class*="logo"]):not([class*="btn"]):not([class*="reserv"]),
body .defaultsb a[href]:not(.logo):not([class*="logo"]):not([class*="btn"]):not([class*="reserv"]) {
  opacity: 1 !important;
  visibility: visible !important;
  display: inline-block !important;
  padding: 8px 14px !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
}

/* Color by state: */
/* — Non-homepage OR scrolled → dark on cream */
body:not(.page-index) header a[href]:not(.logo):not([class*="btn"]),
body header.{prefix}-header--scrolled a[href]:not(.logo):not([class*="btn"]) {
  color: var(--{prefix}-dark) !important;
  text-shadow: none !important;
}

/* — Homepage top (transparent header) → white with shadow */
body.page-index header:not(.{prefix}-header--scrolled) a[href]:not(.logo):not([class*="btn"]) {
  color: #ffffff !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7) !important;
}

/* Hover always gold */
body header a[href]:not(.logo):not([class*="btn"]):hover {
  color: var(--ido-primary) !important;
}
```

**Applied in:** Mountain Prestige (v1.5)
**Lesson:** Don't rely on system-specific classes like `nav a` or
`ul li a` — use `a[href]:not(.logo):not([class*="btn"])` to catch ALL
header menu links regardless of wrapper structure.

---

## 🚨 TRAP CRITICAL-T — Flatpickr auto-sets checkout (annoying UX)

**Symptom:** User picks check-in date → system automatically sets check-out
to next day. User reports "system adds its own checkout, I want to choose".

**Root cause:** Typical flatpickr pattern auto-fills checkout in onChange:
```javascript
onChange: function(dates) {
  var nextDay = new Date(dates[0]);
  nextDay.setDate(nextDay.getDate() + 1);
  if (checkOut._flatpickr) {
    checkOut._flatpickr.set('minDate', nextDay);
    checkOut._flatpickr.setDate(nextDay);  // ← problem: auto-fills
  }
}
```

**Fix — update min constraint only, DON'T auto-set date:**
```javascript
onChange: function(dates) {
  if (!dates.length) return;
  var nextDay = new Date(dates[0]);
  nextDay.setDate(nextDay.getDate() + 1);
  if (checkOut && checkOut._flatpickr) {
    // Only update constraint
    checkOut._flatpickr.set('minDate', nextDay);

    // Clear checkout if currently-selected is now invalid
    var currentOut = checkOut._flatpickr.selectedDates[0];
    if (currentOut && currentOut <= dates[0]) {
      checkOut._flatpickr.clear();
    }
    // NO auto-setDate — user picks manually
  }
}
```

**Applied in:** Mountain Prestige (v1.5)
**Lesson:** Date range pickers should constrain (minDate) not autofill —
autofill forces user to change something they didn't intend to set.

---

## 🚨 TRAP CRITICAL-O — Layer 2 `.ido-hero__content` covers entire body

**THIS IS THE MOST IMPORTANT TRAP — APPLY TO EVERY CLIENT IMMEDIATELY**

**Discovered:** Mountain Prestige v1.4 (2026-04-13)

**Symptom:** Hero text (from body_top) appears floating over gallery/
middle sections of the page. Menu invisible. Hero image not showing.
All sections "broken" — content overlaps unexpectedly.

**Root cause — architectural bug in Layer 2:**
```css
/* Layer 2 library defines: */
.ido-hero__content {
  position: absolute;
  inset: 0;  /* fills nearest positioned ancestor */
  z-index: 10;
  ...
}
```

**Assumption:** `.ido-hero__content` rendered INSIDE system's
`.section.parallax` (which is position: relative) — so `inset: 0`
fills hero area only.

**Reality:** IdoBooking injects body_top content AFTER
`.section.parallax`, not inside. `.ido-hero__content` with
`inset: 0` then fills nearest positioned ancestor UPWARD → ends
up being body/html → covers entire document.

**Fix — neutralize Layer 2 class + use wrap pattern:**

```css
/* Neutralize Layer 2 absolute positioning */
.ido-hero__content {
  position: relative !important;
  inset: auto !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  z-index: auto !important;
  display: block !important;
}

/* New constrained wrapper — applies to every client */
.{prefix}-hero-wrap {
  position: relative;
  width: 100vw;
  max-width: 100vw;
  left: 50%;
  margin-left: -50vw;
  height: 85vh;            /* match system hero height */
  margin-top: calc(-85vh); /* pull UP over system .section.parallax */
  z-index: 11;
  pointer-events: none;    /* so hero image below is clickable */
  overflow: hidden;
  box-sizing: border-box;
}

.{prefix}-hero__content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 88px 24px 140px;
  gap: 18px;
  color: #fff;
}

/* Interactive elements need pointer-events back */
.{prefix}-hero-wrap a,
.{prefix}-hero-wrap button {
  pointer-events: auto !important;
}

@media (max-width: 768px) {
  .{prefix}-hero-wrap {
    height: 80vh;
    margin-top: calc(-80vh);
  }
}
```

**HTML pattern:**
```html
<!-- BEFORE (BUG): Layer 2 class breaks page layout -->
<div class="ido-hero__content">
  <h1>Title</h1>
  ...
</div>

<!-- AFTER (FIXED): constrained wrap -->
<div class="{prefix}-hero-wrap">
  <div class="{prefix}-hero__content">
    <span class="{prefix}-hero__subtitle">Subtitle</span>
    <h1 class="{prefix}-hero__title">Title</h1>
    <a class="{prefix}-hero__cta" href="#...">CTA</a>
  </div>
</div>
```

**How the wrap works:**
- `.{prefix}-hero-wrap` has `height: 85vh + margin-top: -85vh`
- Takes 85vh in normal flow BUT visually positioned -85vh = overlaps
  system's `.section.parallax` (hero image)
- Children constrained within wrap (85vh × 100vw)
- `pointer-events: none` on wrap → clicks pass through to hero image
- `pointer-events: auto` on a/button → CTA still clickable

**Applied in:** Mountain Prestige (v1.4)
**Should apply to ALL future clients from day 1.**

**Lesson:** When Layer 2 components use `position: absolute; inset: 0;`
they MUST be inside a positioned container OR be wrapped in a
constraining element before insertion into body_top context.

---

## 🚨 TRAP CRITICAL-P — Force menu visibility

**Symptom:** Header menu items invisible or hidden. Could be caused by:
- CRITICAL-O overlay covering header
- System CSS hiding menu elements
- Transparent state conflict

**Fix — aggressive visibility forcing on all header elements:**
```css
header.default13, .defaultsb, #defaultsb {
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 1100 !important;
  display: block !important;
}

header.default13 nav, .defaultsb nav,
header.default13 ul, .defaultsb ul,
header.default13 .menu, .defaultsb .menu {
  visibility: visible !important;
  opacity: 1 !important;
}

header.default13 nav a,
header.default13 ul li a,
header.default13 li a,
.defaultsb nav a, .defaultsb ul li a {
  visibility: visible !important;
  opacity: 1 !important;
}

header.default13 .logo,
header.default13 .logo img {
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-block !important;
}
```

**Applied in:** Mountain Prestige (v1.4)

---

## 🚨 TRAP CRITICAL-Q — Brown/dark strip below payment footer

**Symptom:** Below `.footer-contact-baner` (VISA/MC payment strip),
a strip of different color (usually brown/dark) shows, reaching to
bottom of viewport. Doesn't match footer design.

**Root cause:** System has additional elements after payment strip
(`.powered_by`, `.footer-contact-add`, etc.) with different/no bg.
Or body bg peeks through under footer.

**Fix — force consistent bg on all footer children + html/body:**
```css
html {
  background: var(--{prefix}-bg) !important;
  min-height: 100vh;
}

body, body.default13 {
  background: var(--{prefix}-bg) !important;
  margin: 0 !important;
}

footer, .footer, .page-footer, .footer-wrapper {
  background: var(--{prefix}-dark) !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.powered_by, .footer__bottom, .footer-contact-add, .footer-bottom {
  background: var(--{prefix}-dark) !important;
  margin: 0 !important;
}

.footer-contact-baner, .footer__strip {
  background: #1C1510 !important;
  margin: 0 !important;
  padding: 16px 20px 30px !important;  /* extra bottom */
}

/* Safety: kill anything after strip */
.footer-contact-baner + *, .footer__strip + * {
  background: #1C1510 !important;
  margin: 0 !important;
}
```

**Applied in:** Mountain Prestige (v1.4)

---

## ⚠️ CRITICAL TRAPS (always apply, every new client)

These 3 traps were discovered post-deploy on Mountain Prestige (2026-04-13).
They affect EVERY client that uses custom body_top sections + custom search
widget. Apply preventively in CSS L3 §0 and JS for all new clients.

### TRAP A — Sections not full-width (body_top wrapped in .container)

**Symptom:** Custom sections appear as narrow centered box (~1170px max-width)
instead of spanning full viewport. Side strips of empty bg visible on wide screens.

**Root cause:** IdoBooking CMS wraps body_top content inside `.container`
with `max-width: 1170px`. Sections inheriting parent width get clipped.

**Fix:** Viewport breakout trick on every top-level section + overflow guard.

```css
/* Required globally to prevent horizontal scroll from breakout */
html, body, body.default13 {
  overflow-x: hidden !important;
  max-width: 100vw !important;
}

/* Apply to every {prefix}- top-level section */
.{prefix}-about, .{prefix}-features, .{prefix}-location,
.{prefix}-stats, .{prefix}-services, .{prefix}-cta,
.{prefix}-featured, /* ... etc */ {
  width: 100vw !important;
  max-width: 100vw !important;
  position: relative !important;
  left: 50% !important;
  margin-left: -50vw !important;
  box-sizing: border-box !important;
}

/* Inner wrappers stay constrained for readability */
.{prefix}-section__inner, .{prefix}-grid {
  max-width: 1200px;
  margin: 0 auto !important;
}
```

**Applied in:** Mountain Prestige (v1.1)
**Should retroactively apply to:** all clients using body_top sections

---

### TRAP B — Buttons not clickable (`.index-info *` cascade)

**Symptom:** Custom CTAs, search widget submit, offer card links —
all visible but unresponsive to clicks. No console errors.

**Root cause:** Layer 1 TRAP #8 sets:
```css
.index-info { pointer-events: none !important; }
.index-info * { pointer-events: none !important; }
```

This protects hero area from being blocked by system `.index-info` overlay.
BUT when CMS wraps body_top in `.index-info` (which happens often on
homepage), the cascade kills clicks on ALL custom interactive elements.

**Fix:** Re-enable pointer-events on every interactive element + hero content.
MUST list classes explicitly with !important to beat L1 specificity.

```css
.{prefix}-hero__cta,
.{prefix}-search, .{prefix}-search *,
.{prefix}-offer-card, .{prefix}-offer-card *,
.{prefix}-feature, .{prefix}-service,
.{prefix}-cta a, .{prefix}-cta button,
/* Override specifically inside .index-info */
.index-info .{prefix}-hero__cta,
.index-info .{prefix}-search, .index-info .{prefix}-search *,
.index-info a[href], .index-info button,
.index-info input, .index-info select, .index-info textarea {
  pointer-events: auto !important;
}
```

**Why `*` selector alone is not enough:** Need explicit listing of MP classes
to beat the `.index-info *` rule via equal-or-higher specificity + later in
cascade. Don't rely on universal selectors.

**Applied in:** Mountain Prestige (v1.1)
**Future improvement:** Consider rewriting L1 TRAP #8 to NOT cascade `*`,
only target `.index-info > h1`, `.index-info > h2`, `.index-info > button` —
the specific system elements that need hiding.

---

### TRAP C — `<input type="date">` picker dead

**Symptom:** Date inputs in custom search widget don't open native picker.
User clicks field, nothing happens. No calendar icon visible.

**Root cause:** CSS rule `-webkit-appearance: none` on date inputs:
- Safari: removes native date picker entirely
- Chrome: hides calendar icon (UX dead-end)
- iOS: blocks native date wheel

**Fix 1 — CSS:** Force appearance:auto on date/time inputs:
```css
.{prefix}-search__input[type="date"],
.{prefix}-search__input[type="time"],
.{prefix}-search__input[type="datetime-local"] {
  -webkit-appearance: auto !important;
  appearance: auto !important;
  cursor: pointer !important;
}
```

**Fix 2 — JS:** Add `showPicker()` trigger + click-anywhere-in-field:
```javascript
// Click anywhere in .{prefix}-search__field opens the input's picker
var fields = form.querySelectorAll('.{prefix}-search__field');
fields.forEach(function(field) {
  var input = field.querySelector('input, select');
  if (!input) return;
  field.addEventListener('click', function(e) {
    if (e.target === input) return;
    if (typeof input.showPicker === 'function') {
      try { input.showPicker(); return; } catch(err) {}
    }
    input.focus();
    if (input.click) input.click();
  });
});

// Explicit showPicker on date input click
dateInputs.forEach(function(inp) {
  inp.addEventListener('click', function() {
    if (typeof inp.showPicker === 'function') {
      try { inp.showPicker(); } catch(err) {}
    }
  });
});
```

**Browser support:** `showPicker()` works in Chrome 99+, Safari 16+,
Firefox 101+. Fallback `input.focus()` covers older browsers.

**Applied in:** Mountain Prestige (v1.1)
**Lesson:** NEVER apply blanket `-webkit-appearance: none` to all input
types. Style selects (with custom chevron) yes, but leave date/time/file
inputs with native appearance.

---

### TRAP D — `/offers` has NO per-page body_top editor (CSS + HEAD only)

**Symptom:** Operator tries to create `OBIEKTY_PL__body_top.html` or
similar intro HTML for `/offers` listing page. Can't find where to paste
in the IdoBooking panel. No "Początek BODY" field for /offers.

**Root cause:** `/offers` is a SYSTEM-generated listing page (auto-renders
from offers/categories in panel). IdoBooking exposes NO CMS body_top
editor for this route. Only globally-applied CSS and HEAD are available.

**Same limitation applies to:**
| Page | body_top editor? | Customize via |
|------|------------------|---------------|
| `/` (homepage) | ✓ Yes | body_top HTML |
| `/txt/{slug}` (custom CMS) | ✓ Yes | body_top HTML |
| `/news` (blog) | ~ Sometimes | body_top HTML (system-dependent) |
| `/opinions` | ~ Sometimes | body_top HTML |
| **`/offers`** | ✗ **NO** | Global CSS + HEAD only |
| **`/offer/{id}` (detail)** | ✗ **NO** | Global CSS + HEAD only |
| **`/contact`** | ✗ **NO** | Global CSS + HEAD only |
| `/en/offers`, `/en/offer/X` | ✗ NO | Same CSS with lang selector |

**Fix approach — CSS-only styling for /offers:**

```css
/* Style listing cards, filters, buttons on /offers */
body.page-offers {
  background: var(--{prefix}-bg) !important;
}
body.page-offers .offer {
  background: #fff !important;
  border: 1px solid var(--{prefix}-border) !important;
  /* hover, radius, transitions */
}
body.page-offers .offer h3 {
  font-family: var(--ido-font-heading) !important;
}
body.page-offers .btn-success {
  background: var(--ido-primary) !important;
}
body.page-offers .filter_header {
  /* sidebar filter accordion styling */
}
```

**If client wants intro text above offers list:** Add it to the category
description in Panel → Oferta → Kategorie → opis. System will render
it within the /offers listing. DO NOT attempt body_top.

**NEVER CREATE THESE FILES:**
- `OBIEKTY_*__body_top.html` ❌
- `OFFERS_*__body_top.html` ❌
- `CONTACT_*__body_top.html` ❌
- `OFFER_DETAIL_*__body_top.html` ❌

**Applied in:** Mountain Prestige (v1.1) — removed OBIEKTY_PL__body_top.html
**Lesson:** Confirm every planned page's body_top editor availability
BEFORE creating HTML files. Default assumption for IdoBooking:
only `/` and `/txt/{slug}` support custom body_top.

---

### TRAP E — Search widget must redirect to ENGINE, not /offers

**Symptom:** Custom homepage search form redirects to /offers listing
page. Client wants direct redirect to booking engine (engine.idobooking.com
or similar), skipping /offers entirely.

**Root cause:** Default assumption was "/offers" as target. But
IdoBooking has a separate booking engine at engineXXXXX.idobooking.com
where bookings finalize. Clients want users jumping directly there
from the search widget.

**Fix — 2-tier strategy:**
```javascript
var CONFIG = {
  engineUrl: null,  // null = auto-detect from system form
  engineFallback: 'https://engine{CLIENT_ID}.idobooking.com/',
  preferSystemForm: true
};

function submitSearch(values) {
  // Strategy 1: submit through system's existing #iai_book_form
  // (it knows the correct engine URL already)
  if (CONFIG.preferSystemForm) {
    var sysForm = document.querySelector('#iai_book_form');
    if (sysForm) {
      // Populate system fields (try multiple name conventions)
      var nameMap = {
        checkin: ['checkin_date', 'date_from', 'dateFrom', 'arrival'],
        checkout: ['checkout_date', 'date_to', 'dateTo', 'departure'],
        persons: ['persons', 'guests', 'adults']
      };
      for (var key in nameMap) {
        for (var i = 0; i < nameMap[key].length; i++) {
          var el = sysForm.querySelector('[name="' + nameMap[key][i] + '"]');
          if (el) { el.value = values[key]; break; }
        }
      }
      sysForm.submit();
      return;
    }
  }

  // Strategy 2: direct engine redirect with URL params
  var engineUrl = CONFIG.engineUrl || CONFIG.engineFallback;
  var params = new URLSearchParams();
  if (values.dateFrom) params.set('date_from', values.dateFrom);
  if (values.dateTo) params.set('date_to', values.dateTo);
  if (values.persons) params.set('persons', values.persons);
  window.location.href = engineUrl + '?' + params.toString();
}
```

**Applied in:** Mountain Prestige (v1.2)
**Lesson:** Never hardcode `/offers` as search target. Client's
booking engine URL is the correct destination for search redirects.

---

### TRAP F — Cream strip between header and hero (gap visible)

**Symptom:** On homepage, visible cream/colored strip between fixed
header and hero image. Hero doesn't start at top of viewport.

**Root cause:** Header `position: fixed` with colored bg (e.g. cream)
floats at top. Hero section starts below header in natural flow,
creating a visible gap with cream bg bleeding through.

**Fix:** Pull hero under header + make header transparent on homepage
at scroll=0. Header gains bg only AFTER scrolling past hero.

```css
/* Pull hero under fixed header */
body.page-index .section.parallax,
body.page-index .parallax-slider {
  margin-top: calc(-1 * var(--ido-header-h)) !important;
  min-height: 100vh !important;
  position: relative;
}

/* Transparent header on homepage top (not scrolled past hero) */
body.page-index header.default13:not(.{prefix}-header--scrolled),
body.page-index .defaultsb:not(.{prefix}-header--scrolled) {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
}

/* White menu + logo inversion over hero image */
body.page-index header:not(.{prefix}-header--scrolled) nav a {
  color: #fff !important;
  text-shadow: 0 1px 6px rgba(0,0,0,0.3);
}
body.page-index header:not(.{prefix}-header--scrolled) .logo img {
  filter: brightness(0) invert(1);
}
```

**JS: shrink threshold = hero bottom, not fixed 80px:**
```javascript
function getThreshold() {
  var hero = document.querySelector('.section.parallax, .{prefix}-hero');
  if (hero && isHomepage) {
    return Math.max(80, hero.offsetHeight - 140);
  }
  return 80;
}
```

**Applied in:** Mountain Prestige (v1.2)

---

### TRAP G — Hero needs Ken Burns zoom animation

**Symptom:** Static hero image feels flat and cheap. Premium sites
have subtle motion.

**Fix — CSS-only 20s zoom loop:**
```css
@keyframes {prefix}-ken-burns {
  0%   { transform: scale(1.00); }
  100% { transform: scale(1.08); }
}

.parallax-slider img,
.section.parallax img:not(.logo-img):not([class*="icon"]) {
  animation: {prefix}-ken-burns 20s ease-in-out infinite alternate !important;
  transform-origin: center center;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .parallax-slider img { animation: none !important; }
}
```

**Applied in:** Mountain Prestige (v1.2)
**Note:** Scale 1.08 = subtle. Larger scale (1.15+) feels amateur.

---

### TRAP H — Native date picker is ugly, replace with Flatpickr

**Symptom:** Browser's native `<input type="date">` picker:
- Chrome: gray/blue OS-styled calendar
- Safari: basic spinner wheel
- Firefox: yet another UI
All look "cheap" and don't match premium brand design.

**Fix — Flatpickr library with custom theme:**

1. **HEAD — CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/l10n/pl.js" defer></script>
```

2. **JS — init with polish locale:**
```javascript
function initFlatpickr() {
  if (typeof window.flatpickr === 'undefined') return false;
  var locale = window.flatpickr.l10ns.pl || 'default';

  window.flatpickr(checkInInput, {
    dateFormat: 'Y-m-d',
    altFormat: 'd.m.Y',
    altInput: true,
    minDate: 'today',
    locale: locale,
    disableMobile: true,
    onChange: function(dates) {
      // Auto-advance checkout min to check-in+1
      if (checkOutInput && checkOutInput._flatpickr) {
        var next = new Date(dates[0]);
        next.setDate(next.getDate() + 1);
        checkOutInput._flatpickr.set('minDate', next);
      }
    }
  });
  return true;
}

// Retry until CDN loads (defer async)
if (!initFlatpickr()) {
  var retry = setInterval(function() {
    if (initFlatpickr()) clearInterval(retry);
  }, 200);
}
```

3. **CSS — theme matching brand palette:**
```css
.flatpickr-calendar {
  background: #fff !important;
  border: 1px solid var(--{prefix}-border) !important;
  border-radius: 4px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
}
.flatpickr-day.selected {
  background: var(--ido-primary) !important;
  color: #fff !important;
}
.flatpickr-day.inRange {
  background: rgba({primary-rgb}, 0.15) !important;
}
/* ... ~100 lines for complete theme */
```

**Applied in:** Mountain Prestige (v1.2) — full theme in CSS §H
**Lesson:** Never use raw native date pickers on premium sites.
Flatpickr is small (~30KB), zero deps, fully themeable.

---

### TRAP I — Search widget sitting below hero (not overlapping)

**Symptom:** Custom search form renders AFTER hero section in
separate cream/neutral bg area. Widget looks disconnected from hero,
floats in empty space. Original intent was widget overlapping bottom
of hero image for integrated "hero + search" combined view.

**Root cause:** `margin: -56px auto 0` was insufficient to pull
widget through the section gap. Widget stayed in its own section's bg.

**Fix — aggressive viewport breakout + larger negative margin:**
```css
.{prefix}-search-wrapper {
  position: relative !important;
  width: 100vw !important;
  max-width: 100vw !important;
  left: 50% !important;
  margin-left: -50vw !important;
  margin-top: -88px !important;  /* pull into hero bottom */
  margin-bottom: 60px !important;
  padding: 0 20px !important;
  background: transparent !important;
  z-index: 30 !important;
  box-sizing: border-box !important;
}

@media (max-width: 900px) {
  .{prefix}-search-wrapper {
    margin-top: -40px !important;
  }
}
```

**Applied in:** Mountain Prestige (v1.2)
**Lesson:** Negative margin must be AT LEAST the height of visible
widget overlap (usually 80-120px). Combine with viewport breakout
(width:100vw + left:50% + margin-left:-50vw) for full-bleed effect.

---

### TRAP J — Flatpickr altInput shows gray strips under date input

**Symptom:** Date field shows a gray strip/bar below or around the
formatted date value. Looks like a disabled/readonly browser default.

**Root cause:** `altInput: true` creates a visible formatted input
and hides the real `<input type="date">`, but the real input still
occupies space with browser default readonly styling. The alt input
itself also inherits browser defaults if not explicitly styled.

**Fix — aggressive hide on real, force transparent on alt:**
```css
/* Hide the real flatpickr-input completely */
input.flatpickr-input {
  position: absolute !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  pointer-events: none !important;
}

/* Alt input — explicitly transparent + no browser defaults */
.{prefix}-search__input[readonly],
.{prefix}-search__input.flatpickr-alt-input,
.flatpickr-alt-input.{prefix}-search__input {
  background: transparent !important;
  background-color: transparent !important;
  color: var(--{prefix}-dark) !important;
  cursor: pointer !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none !important;
  appearance: none !important;
}
```

**JS — use altInputClass to preserve brand styling:**
```javascript
flatpickr(input, {
  altInput: true,
  altInputClass: '{prefix}-search__input {prefix}-search__input-alt flatpickr-alt-input',
  // ...
});
```

**Applied in:** Mountain Prestige (v1.3)

---

### TRAP K — Menu items gray/faded (low specificity vs system CSS)

**Symptom:** Header navigation menu text appears light gray or faded
instead of brand-dark. Happens especially in scrolled (white bg) state.

**Root cause:** Simple selectors `header nav a` or
`header.default13 nav a` have lower specificity than some IdoBooking
system selectors (e.g. `ul.nav-header li a`). System CSS wins cascade.

**Fix — increase specificity via body prefix + multiple variants:**
```css
body header.default13 nav a,
body header.default13 .menu a,
body header.default13 .navbar-nav a,
body header.default13 ul li a,
body header.default13 li a,
body .defaultsb nav a,
body .defaultsb ul li a,
body header.default13.{prefix}-header--scrolled nav a,
body header.default13.{prefix}-header--scrolled ul li a {
  color: var(--{prefix}-dark) !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  text-shadow: none !important;
  opacity: 1 !important;
}

body header.default13 nav a:hover,
body header.default13 ul li a:hover {
  color: var(--ido-primary) !important;
}
```

**Applied in:** Mountain Prestige (v1.3)
**Lesson:** When overriding IdoBooking system styles, prefix selectors
with `body` for reliable specificity boost. Always target both
`nav a` AND `ul li a` variants (system uses inconsistent markup).

---

### TRAP L — Client images via frontpageGallery system URLs

**Pattern:** Replace Wikimedia Commons placeholders with client's own
uploaded images via IdoBooking frontpage gallery URL pattern.

**URL structure:**
```
https://client{ID}.idobooking.com/images/frontpageGallery/pictures/large/0/0/{N}.jpg
```
- `{ID}` = client number (e.g. 57060)
- `{N}` = sequential number (1, 2, 3, ... N)
- Uploaded via: Panel → Wygląd → Galeria strony głównej

**HTML with graceful fallback:**
```html
<img
  src="https://client{ID}.idobooking.com/images/frontpageGallery/pictures/large/0/0/1.jpg"
  alt="Description"
  loading="lazy"
  onerror="this.onerror=null;this.src='FALLBACK_URL';">
```

The `onerror` attribute triggers Wikimedia fallback if the client
hasn't uploaded that image yet — prevents broken image icon.

**Typical photo positions on homepage:**
- Hero slider: managed by system panel (auto-selected from gallery)
- About section split image
- Offer card 1 (Apartment A)
- Offer card 2 (Apartment B)
- Gallery grid (5-6 photos)
- Location split image
- Banner image dividers (2 places)

**Applied in:** Mountain Prestige (v1.3) — 12 slots prepared, fallback
to Wikimedia if client gallery empty.

---

### TRAP M — Banner image full-width dividers (between sections)

**Pattern:** Parallax-zoom photo strips between content sections
to break up text-heavy pages and add visual rhythm.

**HTML:**
```html
<section class="{prefix}-banner-image {prefix}-banner-image--parallax">
  <img src="PHOTO_URL" alt="..." loading="lazy">
  <div class="{prefix}-banner-image__overlay">
    <p class="{prefix}-banner-image__quote">
      Editorial quote or brand tagline, <em>italic serif</em>
    </p>
    <span class="{prefix}-banner-image__author">— Brand Name</span>
  </div>
</section>
```

**CSS:**
```css
.{prefix}-banner-image {
  width: 100vw !important;
  max-width: 100vw !important;
  position: relative !important;
  left: 50% !important;
  margin-left: -50vw !important;
  height: 480px;
  overflow: hidden;
}

.{prefix}-banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.{prefix}-banner-image--parallax img {
  animation: {prefix}-ken-burns 30s ease-in-out infinite alternate;
}

.{prefix}-banner-image__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.25) 0%,
    rgba(0,0,0,0.45) 100%
  );
}

.{prefix}-banner-image__quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(26px, 3.5vw, 44px);
  font-style: italic;
  line-height: 1.3;
  max-width: 800px;
}

@media (max-width: 768px) {
  .{prefix}-banner-image { height: 320px; }
}
```

**Applied in:** Mountain Prestige (v1.3) — 2 banners on homepage
(after About, before Services).

---

### TRAP N — Bento-style gallery grid (photo showcase)

**Pattern:** Masonry-like grid with 1 large featured photo + 4 smaller
photos for homepage gallery showcase.

**HTML:**
```html
<section class="{prefix}-gallery">
  <div class="{prefix}-gallery__header">
    <span class="{prefix}-kicker">Galeria</span>
    <h2>Obrazy <em>prestiżu</em></h2>
  </div>
  <div class="{prefix}-gallery__grid">
    <a href="/offers" class="{prefix}-gallery__item {prefix}-gallery__item--large">
      <img src="..." alt="...">
      <span class="{prefix}-gallery__caption">Caption</span>
    </a>
    <a href="/offers" class="{prefix}-gallery__item">...</a>
    <!-- 4 more items -->
  </div>
</section>
```

**CSS:**
```css
.{prefix}-gallery__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 240px 240px;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.{prefix}-gallery__item--large {
  grid-column: span 2;
  grid-row: span 2;
}

.{prefix}-gallery__item:hover img {
  transform: scale(1.06);
}

.{prefix}-gallery__item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.{prefix}-gallery__item:hover::after {
  opacity: 1;
}

.{prefix}-gallery__caption {
  position: absolute;
  left: 20px;
  bottom: 20px;
  color: #fff;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.5s ease;
}

.{prefix}-gallery__item:hover .{prefix}-gallery__caption {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 900px) {
  .{prefix}-gallery__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 200px);
  }
}
```

**Applied in:** Mountain Prestige (v1.3)

---

## 1. Footer Payment Strip (VISA/Mastercard bar)

**Problem:** IdoBooking renders a colored bar (`.footer-contact-baner`) with payment icons
below the footer. This bar sits inside `.footer.container` (max-width ~1170px),
so on wider screens the background doesn't reach the viewport edges — leaving
colored strips on both sides.

**Root cause:** `.footer-contact-baner` inherits container width, not full viewport.

**Fix — full-width breakout trick:**
```css
.footer-contact-baner {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    margin-left: -50vw !important;
    background: var(--client-dark) !important;
    padding: 16px 20px !important;
    text-align: center !important;
    box-sizing: border-box !important;
}
```

**Payment icons are SVG, not IMG!**
IdoBooking uses inline `<svg>` elements inside `<span>` tags for VISA/Mastercard.
Do NOT target `img` — target `svg` and `svg path`/`svg g` for color changes:
```css
.footer-contact-baner svg {
    height: 20px !important;
    width: auto !important;
    opacity: 0.45 !important;
}
.footer-contact-baner svg path,
.footer-contact-baner svg g {
    fill: rgba(255,255,255,0.5) !important;
}
```

**Fallback selectors** (vary by IdoBooking template version):
- `.footer-contact-baner` — most common (confirmed: Najmar, Madera)
- `.footer__strip` — MountainPrestige
- `.payments-bar` — EcoCamping
- `.footer-bottom` — GoldenApartments
- `.payment-methods` — some templates

**Applied in:** Madera, Najmar

---

## 2. Featured Offers (cmshotspot) — Avoiding Duplicates

**Problem:** When using system `.cmshotspot` (automatic featured offers from panel),
AND the homepage HTML has manually coded offer cards (e.g. `.nj-apartment-card`),
both sets show — creating duplicates.

**Fix:** Hide manual cards via CSS:
```css
.client-apartment-card {
    display: none !important;
}
```

Do NOT remove them from HTML — keep as fallback in case cmshotspot isn't configured.
CSS hide is safer and reversible.

**To enable cmshotspot:** Panel → Oferta → Oferty → zaznacz "Wyróżniona" przy wybranych.

---

## 3. `</script>` HTML Parser Bug

**Problem:** If any JS code (even inside comments or template literals) contains the
literal string `</script>`, the HTML parser closes the `<script>` block prematurely,
breaking all subsequent JS.

**Fix:** Never write `</script>` inside JS. Use alternatives:
- `'</' + 'script>'`
- `'<\/script>'`
- Rewrite the comment to avoid the string entirely

---

## 4. CSS `</script>` is safe

Only JS contexts are affected. CSS can contain the string `</script>` without issues.

---

## 5. IdoBooking DOM Structure (Footer)

Typical structure:
```
<footer>
  <div class="footer container" style="max-width: 1170px">
    <div class="footer__wrapper">
      <div class="row">
        <div class="footer__contact">...</div>
      </div>
    </div>
    <div class="footer__social">...</div>
    <div class="powered_by">...</div>
    <div class="footer-contact-add">...</div>     <!-- usually empty -->
    <div class="footer-contact-baner">            <!-- PAYMENT STRIP -->
      <span><svg>VISA</svg></span>
      <span><svg>Mastercard</svg></span>
    </div>
  </div>
</footer>
```
