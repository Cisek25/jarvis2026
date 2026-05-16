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


## 🚨🚨🚨 TRAP CRITICAL-TT — 3 OBOWIĄZKOWE WZORCE Z GOLDEN (v1.15)

**Discovered:** MIA Apart v1.0 (2026-04-14) — powtarzające się błędy u każdego nowego klienta.

**Symptomy:**
1. Sekcje custom nie rozciągają tła na pełną szerokość — tło kończy się na 1170px kontenera
2. Hero image wycieka poza hero section i widać go pod całą stroną po scrollu
3. Pod stopką widać biały/kremowy kolor zamiast ciemnego (nie pasuje do footera)

**Root cause:** 3 brakujące wzorce które Golden ma a nowi klienci nie:

### FIX 1 — `isolation: isolate` na sekcjach (full-width bg)

System IdoBooking wkłada body_top HTML w `.container` (max-width:1170px).
Custom sekcje potrzebują `width:100vw; left:50%; margin-left:-50vw` żeby się rozciągnąć.
ALE samo to nie wystarczy — tło nie rozciąga się jeśli parent clip'uje overflow.

**FIX (Golden pattern):**
```css
/* Container musi pozwalać dzieciom na breakout */
.section_sub.container,
.section_sub,
.cms-html,
.container:not(.footer):not(.navbar-container) {
  overflow: visible !important;
}

/* Każda custom sekcja: isolation + breakout */
.{prefix}-about,
.{prefix}-features,
.{prefix}-cities,
.{prefix}-stats,
/* ... ALL custom sections ... */ {
  position: relative !important;
  isolation: isolate;  /* KLUCZOWE — tworzy stacking context */
  width: 100vw !important;
  left: 50% !important;
  margin-left: -50vw !important;
}
```

### FIX 2 — `.section.parallax { isolation: isolate; background: transparent }` (hero leak)

System `.parallax-slider` ma `z-index:-2`. Bez `isolation:isolate` na rodzicu,
slider jest ZA tłem body → albo niewidoczny, albo wycieka na całą stronę
(gdy system daje mu `position: fixed`).

**FIX (Golden pattern):**
```css
.section.parallax {
  isolation: isolate;
  background: transparent !important;
}

/* KRYTYCZNE: slider MUSI być position:relative, NIE fixed! */
.parallax-slider {
  position: relative !important;
  width: 100vw !important;
  height: 100% !important;
  overflow: hidden !important;
  margin-left: calc(-50vw + 50%) !important;
}
```

### FIX 3 — `html { background: var(--ido-dark) }` (overscroll pod stopką)

Body ma `background: var(--ido-bg)` (jasny). Gdy user overscrolluje poniżej footer,
widzi jasny kolor. Footer jest ciemny → kontrast.

**FIX:**
```css
html {
  background: var(--ido-dark, #1A1A1A) !important;
}
```
`html` bg = ciemny (matching footer). `body` bg = jasny (content area).
Efekt: overscroll pod footer = ciemny. Prawidłowo.

### APPLY TO EVERY NEW CLIENT FROM DAY 1

Dodaj te 3 fixy do:
1. `library/css/layer1-traps.css` — nowy §I albo §J
2. Każdy nowy klient L3 — section isolation
3. Generator (core/css-merger.js) kiedy powstanie


---

## CRITICAL-UU — line-height:0 inheritance zabija price badge children

**Klient:** MIA Apart (2026-04-15), ale wzorzec UNIWERSALNY dla każdego
klienta z absolute price badge wewnątrz image containera.

**Symptom:**
> User: "na stronie głównej są dwie pozycje cen, jedna na drugiej"

W rzeczywistości to NIE są dwie ceny — to jedna cena + `<small>` child
z `display: block`, ale oba mają `line-height: 0` → stackują się w
jednej linii wysokości 0px. Wizualnie: "529 złod / doba" — zlepek.

**Root cause:**

```css
/* Image wrapper używa line-height:0 żeby eliminować baseline gap pod <img>.
   To standardowa, BEZPIECZNA praktyka: */
.mi-offer-card__img {
  aspect-ratio: 16/10;
  overflow: hidden;
  line-height: 0;        /* ← usuwa gap pod img */
}
```

**Ale** — `line-height` DZIEDZICZY się na dzieci. Gdy wrzucimy absolute
price badge wewnątrz:

```css
.mi-offer-card__price {
  position: absolute;
  bottom: 20px; right: 20px;
  font-size: 18px;
  padding: 10px 16px;
  /* NIE ustawiamy line-height — DZIEDZICZY 0 z parent .mi-offer-card__img */
}
.mi-offer-card__price small {
  display: block;
  font-size: 10px;
  /* też dziedziczy line-height: 0 */
}
```

Parent ma computed `line-height: 0px` + child `small` też. Oba teksty
renderują się w lini o wysokości 0. Efekt wizualny: teksty się nakładają
(baselines w tym samym miejscu).

**Detection (Chrome DevTools):**

```js
const el = document.querySelector('.mi-offer-card__price');
getComputedStyle(el).lineHeight;  // "0px" ← SMOKING GUN
el.offsetHeight;                  // 20 (tylko padding, zero content)
```

**FIX:**

```css
.mi-offer-card__price {
  line-height: 1.2 !important;          /* override inherited 0 */
  display: inline-flex !important;      /* flex layout dla dwóch linii */
  flex-direction: column;               /* stack "529 zł" + "od/doba" */
  align-items: flex-end;                /* wyrównanie do prawej */
  gap: 2px;                             /* odstęp między liniami */
  min-height: auto;
  height: auto;
}
.mi-offer-card__price small {
  line-height: 1.1 !important;          /* override inherited 0 */
  display: block;
}
```

**Gdzie jeszcze się zdarza:**
- Hero CTA text wewnątrz `.parallax-slider` (też ma line-height:0)
- Banner image overlay quote text
- Gallery caption wewnątrz image wrappera
- Featured offer badge "PREMIUM" — te same warunki

**Prevention:**
Każdy absolute child z tekstem wewnątrz image wrappera MUSI jawnie
ustawić `line-height` (nie liczyć na default).

**W layer1-traps.css:** TRAP #21 (defensive selectors na `[class*="price"]` itp.)


---

## CRITICAL-VV — Wikimedia URL halucynacje (2 problemy w 1)

**Klient:** MIA Apart (2026-04-15), powtarzalny problem z AI generated URLs.

**Symptom:**
- Na podstronie /txt/202/Miasta 4 obrazy nie ładują się
- Browser console: `Failed to load resource: status 404`
- DevTools network: GET upload.wikimedia.org/... → 404
- User: "Sekcja miast nie ma żadnych zdjęć"

**Dwa bugi w jednym:**

### Bug A — AI halucynuje hashe w URL

Wikimedia thumbnail URL structure:
```
https://upload.wikimedia.org/wikipedia/commons/thumb/ X/YZ /filename.ext/NNNpx-filename.ext
                                                       ^^^^^
                                                       2-znakowy MD5 hash
```

AI (w tym ja) CZĘSTO wymyśla hash zamiast weryfikować:
- Zmyślone: `/8/89/POL_Warsaw_Royal_Castle...` → 404
- Prawdziwe: `/9/90/POL_Warsaw_Royal_Castle...` → 200

Ten sam plik, INNY hash. AI zapamięta nazwę ale halucynuje hash.

### Bug B — 1280px thumbnails odrzucane z IdoSell context

Wikimedia nie udostępnia wszystkich rozmiarów dla każdego pliku. Testy:
- 250px, 500px, 600px — zwykle OK
- 1280px — często 404
- 2560px+ — prawie zawsze 404

Z IdoSell referrerem Wikimedia CDN dodatkowo odrzuca > 600px.

### FIX — workflow 3-krokowy (NIGDY nie zgaduj!)

```bash
# Krok 1: scrape real URLs z pl.wikipedia
curl -s "https://pl.wikipedia.org/wiki/Zamek_Kr%C3%B3lewski_w_Warszawie" \
  | grep -oE "upload\.wikimedia\.org/wikipedia/commons/thumb/[^\"]+\.(jpg|JPG)/[0-9]+px-[^\"]+" \
  | head -5

# Krok 2: weź 500-600px (NIE 1280!) z wyniku i zweryfikuj HTTP 200
curl -sI -H "Referer: https://clientNNN.idobooking.com/" "<URL>" | head -3
# Oczekiwane: HTTP/2 200

# Krok 3: dopiero wtedy wklej do HTML
```

### Verified URLs dla MIA Apart (2026-04-15)

```
Warszawa Zamek Królewski (500px):
  /wikipedia/commons/thumb/9/90/POL_Warsaw_Royal_Castle_2008_%283%29.JPG/500px-POL_Warsaw_Royal_Castle_2008_%283%29.JPG

Warszawa PKiN widziany z WFC (600px):
  /wikipedia/commons/thumb/0/05/PKiN_widziany_z_WFC.jpg/600px-PKiN_widziany_z_WFC.jpg

Warszawa Stare Miasto dron (600px):
  /wikipedia/commons/thumb/7/76/Warszawa_Stare_Miasto_%28dron%29.jpg/600px-Warszawa_Stare_Miasto_%28dron%29.jpg

Jastrzębia Góra (500px):
  /wikipedia/commons/thumb/6/64/Jastrzebia-Gora-01.jpg/500px-Jastrzebia-Gora-01.jpg

Cabo Verde — Praia (500px):
  /wikipedia/commons/thumb/6/67/Praia_aerialview.jpg/500px-Praia_aerialview.jpg

Cabo Verde — Santo Antão (500px):
  /wikipedia/commons/thumb/3/31/Santo-antao_agaves.jpg/500px-Santo-antao_agaves.jpg
```

**W layer1-traps.css:** TRAP #22 (workflow rule, no CSS).


---

## CRITICAL-WW — /txt URL numbering: `/txt/<ID>/<slug>`

**Klient:** MIA Apart (2026-04-15).

**Symptom:**
- Menu link pokazuje `/txt/miasta` w href
- Klik → `404 NOT FOUND`
- Ale `/txt/202/Miasta` działa

**Root cause:**

IdoBooking wymaga numerycznego ID w URL CMS podstron:
- ✅ `/txt/202/Miasta` — poprawne
- ❌ `/txt/miasta` — 404
- ❌ `/txt/Miasta` — 404

ID są per-klient (w panelu → CMS → URL edytora pokazuje `/NNN/`).

**FIX:**

W CMS → Menu → link element — zawsze `/txt/<ID>/<slug>`.

W customowych JS (redirects, CTA, breadcrumbs):

```js
// Mapa routes per klient — w __theme.js lub __config.js:
const TXT_ROUTES = {
  miasta: '/txt/202/Miasta',
  onas: '/txt/203/O-nas',
  homestaging: '/txt/201/HomeStaging',
  regulamin: '/txt/NNN/Regulamin',  // sprawdź w panelu
};

function navigateToTxt(key) {
  if (TXT_ROUTES[key]) window.location.href = TXT_ROUTES[key];
}
```

**NIE POMYLIĆ z:**
- `/offers` — listing (bez ID)
- `/offer/10/slug` — detail (ID OFERTY, nie CMS)
- `/contact`, `/book-now/...` — hardcoded (bez ID)
- `/txt/NNN/slug` — **CMS page (z ID)**

**Klient MIA IDs:** 201=HomeStaging, 202=Miasta, 203=O-nas.

**W layer1-traps.css:** TRAP #23 (workflow rule).


---

## CRITICAL-HHH — Icon fonts zepsute przez font unification (TRAP #27)

**Klient:** MIA Apart (2026-04-15), wzorzec UNIWERSALNY.

**Symptom:** Ikony `<i class="icon-piggybank">`, `<i class="icon-shield">` renderują się jako puste miejsca lub hamburger fallback "≡".

**Root cause:** TRAP #27 (font fragmentation fix) force'ował `Inter` na system widgets. Icon fonts fontello/iaifonts też dostały Inter → Unicode glyphs (\e001-\e0FF) nie mapują w Inter.

**FIX:** `i[class*="icon-"], i::before { font-family: 'iaifonts', 'fontello' !important }`

**Zasada:** ZAWSZE pair TRAP #27 (font unify) z TRAP #35 (icon font restore). Dodane jako TRAP #35.


---

## CRITICAL-III — /offer/N right sidebar UX redesign

**Klient:** MIA Apart (2026-04-15).

**Symptom:** "po prawej stronie pod względem UX wszystko jest źle, ceny do lewej nie na środku"

**Root cause:** Price circle bez proper flex center + 3 CTAs wszystkie primary (brak hierarchy) + benefits list z broken hamburger icons.

**FIX — 5 punktów:**
1. Price circle 160×160 + `display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px`
2. `small` + `span` oba `width: 100%; text-align: center; margin: 0; padding: 0`
3. Primary CTA (Rezerwuj) gold bg + box-shadow + hover lift (`translateY(-1px)`)
4. Secondary CTAs (Sprawdź dostępność, Zobacz cennik) **outline style** (border + transparent bg)
5. Benefits `::before { content: '✓'; background: gold; border-radius: 50% }` + hide broken `i.icon-menu`

Dodane jako TRAP #36.


---

## CRITICAL-JJJ — Button text wizualnie nie wycentrowany (matematycznie tak)

**Klient:** MIA Apart (2026-04-15).

**Symptom:** User: "ZAREZERWUJ TERAZ nadal nie jest na środku przycisku, czemu ty tego nie sprawdzasz?"

**Root cause:** `<a class="accommodation-reservation"><span class="btn button accommodation-leftbutton">ZAREZERWUJ</span></a>`. Inner `<span.btn>` dziedziczył `padding: 0 44px` + `min-width: 200px` z ogólnej reguły `.btn` → text przesunięty wewnątrz span, mimo że outer link był flex-centered.

**FIX:** outer link `display: flex; align-items: center; justify-content: center` + inner span **full reset**:
```css
.accommodation-reservation span,
.accommodation-reservation .btn,
.accommodation-reservation .button,
.accommodation-reservation .accommodation-leftbutton {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 0 !important;
  width: auto !important;
  letter-spacing: inherit !important;
  box-shadow: none !important;
  border: none !important;
}
```

**Verified DevTools:** rezerv center 1071 = span center 1071, offset 0px.

**Lesson:** Gdy button ma nested span/div inside anchor, reset WSZYSTKIE inherited styles na inner elementach.


---

## CRITICAL-KKK — Amenity SVG icons invisible (NIE icon fonts!)

**Klient:** MIA Apart (2026-04-15).

**Symptom:** Puste kółka obok "Kuchnia z pełnym wyposażeniem", "Lodówka", "Telewizja" itd.

**Root cause:** Template `default13` na `/offer/N` Udogodnienia renderuje ikony jako **inline `<svg>` wewnątrz `<span aria-hidden>`**, NIE jako `<i class="icon-*">`. TRAP #35 (icon font restore) łapie tylko `<i>`. SVG dziedziczy `color: currentColor` → jeśli parent color biały → SVG niewidoczny.

**DOM structure:**
```html
<li>
  <span aria-hidden="true">
    <svg xmlns="..."><path/></svg>  <!-- NIE <i class="icon-*"> -->
  </span>
  Kuchnia z pełnym wyposażeniem
</li>
```

**FIX:** explicit force fill + stroke + size na WSZYSTKICH SVG elementach w .offer-desc-wrapper:
```css
body.page-offer .offer-desc-wrapper svg,
body.page-offer .offer-desc-wrapper svg *,
body.page-offer .offer-desc-wrapper svg path,
body.page-offer .offer-desc-wrapper svg circle,
body.page-offer .offer-desc-wrapper svg rect,
body.page-offer .offer-desc-wrapper svg line,
body.page-offer .offer-desc-wrapper svg polyline,
body.page-offer .offer-desc-wrapper svg polygon {
  fill: var(--accent) !important;
  stroke: var(--accent) !important;
  color: var(--accent) !important;
  width: 24px !important;
  height: 24px !important;
}
```

**Lesson:** IdoBooking mixuje icon fonts (`<i>`) + inline SVG. Zawsze sprawdź DOM structure przed aplikacją fix. Dodane jako TRAP #37.


---

## CRITICAL-LLL — Cennik `.period-price` ciemny na ciemnym + layout broken

**Klient:** MIA Apart (2026-04-15).

**Symptom:** Cennik na dole offer detail: "02 października 30 września od 529,00 zł ZAREZERWUJ TERAZ" — wszystko zlane w dark box, niewidoczne.

**Root cause:** System injectuje `background: #292929` na `.price-list, .offer-prices, .period-price`. Plus layout raw table/row bez cards.

**FIX:**
1. Wildcard force light bg na wszystkich children
2. Card layout per row: `border; border-radius: 6px; padding: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px`
3. Gold CTA button inside row
4. Price `.price` gold + weight 700 + size 20px

Dodane jako TRAP #38.


---

## CRITICAL-MMM — Tabs nav wyrównany do lewej (system default)

**Klient:** MIA Apart (2026-04-15).

**Symptom:** Tabs "WŁAŚCIWOŚCI POKOJU / ZASADY / OPCJE / DLA REZERW / CENNIK" wyrównane do lewej krawędzi content area zamiast centered.

**Root cause:** System `.tabs` ma `display: flex; justify-content: normal; text-align: left` — `justify-content: normal` to explicit CSS keyword (NIE błąd) — content-like default alignment (do lewej na szerokim viewporcie).

**FIX:**
```css
body.page-offer .tabs,
body.page-offer .tabs.--hideCalendar,
body.page-offer .tabs.--fixed {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  gap: 32px !important;
  padding: 0 24px !important;
}
```

Pamiętaj o `.tabs.--fixed` (sticky scroll state) — też musi być centered.

Dodane jako TRAP #39.


---

## CRITICAL-NNN — Lightbox init używa querySelector (tylko pierwszy!)

**Klient:** MIA Apart (2026-04-15).

**Symptom:** Na /txt/202/Miasta z 3 zdjęciami `.mi-about__img` tylko pierwszy jest klikalny do lightbox.

**Root cause:**
```js
// BAD:
var aboutImg = document.querySelector('.mi-about__img');
if (aboutImg) allItems.push({ el: aboutImg });
```
`querySelector` zwraca TYLKO pierwszy element. Na subpage z wieloma sekcjami `.mi-about__img` reszta nie trafia do lightbox array.

**FIX:**
```js
// GOOD:
var aboutImgs = document.querySelectorAll('.mi-about__img, .mi-location__img');
aboutImgs.forEach(function (a) {
  allItems.push({ el: a, type: 'about' });
});
```

**Lesson:** ZAWSZE używaj `querySelectorAll + forEach` dla collections. `querySelector` tylko gdy pewne że single instance.

Dodane jako TRAP #41.


---

## CRITICAL-OOO — Footer links szare na ciemnym (dark on dark)

**Klient:** MIA Apart (2026-04-15).

**Symptom:** User: "na stopce numer telefonu i email są szare i nie wiem czemu"

**Root cause:** Footer bg = `#1A1A1A` (ido-dark). System/theme daje `footer a { color: var(--primary) }` = `#2A2829` = **dark on dark, contrast ~0**. Telefon, email, Regulamin ledwo czytelne.

**FIX — max specificity** (żeby beat system rules):
```css
html body footer a,
html body footer a:link,
html body footer a:visited,
html body .footer a {
  color: #ffffff !important;
}
html body footer a[href^="tel:"],
html body footer a[href^="mailto:"] {
  color: var(--accent, #C4A97D) !important;
  font-weight: 600 !important;
}
html body footer a:hover { color: var(--accent) !important; text-decoration: underline !important; }
html body footer a[href^="tel:"]:hover { color: #ffffff !important; }
```

**Verified DevTools:** footer a `color: rgb(196, 169, 125)` gold ✅ (było `rgb(42, 40, 41)` dark).

Dodane jako TRAP #40.


---

## CRITICAL-PPP — Miasta features count + O-nas broken Wikimedia URLs

**Klient:** MIA Apart (2026-04-15), dwa related problemy.

**Problem 1 — Miasta tylko 4 features:**

User: "w Co łączy nasze lokalizacje mamy 4 kafelki zamiast 6"

Features grid standard: **2×3 = 6** (lub 3×3 = 9). Nigdy 4 (asymetryczne).

**FIX:** dodane 2 kolejne features (PL+EN):
- **Self check-in** — lockbox, arrival any hour
- **Wsparcie 24/7** — phone/email/WhatsApp

**Problem 2 — O-nas broken images:**

Wikimedia URLs w ONAS_PL/EN były 1280px z broken hashami z poprzedniej sesji (PalacKultury_Panorama_Crop1 `/8/83/`, Sal_Cape_Verde `/a/ab/`, Jastrzebia-Gora-klif `/b/b0/`) → 404.

**FIX:** zmienione na working 500-600px:
- `/0/05/PKiN_widziany_z_WFC.jpg/600px-`
- `/3/31/Santo-antao_agaves.jpg/500px-`
- `/6/64/Jastrzebia-Gora-01.jpg/500px-`

**Lesson:** Poprzednia sesja poprawiła tylko MIASTA_PL/EN + GLOWNA_PL/EN, zapomniała ONAS_PL/EN. ZAWSZE audit WSZYSTKIE 8 HTML plików klienta (PL+EN × 4 subpages: /homepage, /offers, /offer/N, /txt/N/slug) dla broken Wikimedia URLs.

**SUBPAGE AUDIT CHECKLIST** (extended):
- [ ] Features grid count = 6 lub 9 (nigdy 4/5)
- [ ] Wikimedia URLs 500-600px + verified 200
- [ ] Lightbox JS `querySelectorAll` nie `querySelector`
- [ ] Footer links visible (gold tel/mail + white rest)
- [ ] All 8 HTML files audited (PL+EN × 4 subpages)


---

## CRITICAL-EEE — /offer/N detail page dark-on-dark invisible (151 elements)

**Klient:** MIA Apart (2026-04-15), wzorzec UNIWERSALNY.

**Symptom:**
> User: "podstrony ofert są fatalne kolorystycznie, nie widać pół rzeczy bo są czarne"

Na `/offer/10` detail page **151 elementów** miało low contrast:
- "ZAREZERWUJ TERAZ" (contrast: 0.00) — `#2A2829` on `#292929` = niewidoczne
- "Sprawdź dostępność", "Zobacz cennik", telefon, email — niewidoczne
- H1 "Mia Old Town Piwna Apartment" — contrast 0.06
- Udogodnienia, opis, cennik — wszystko niewidoczne

**Root cause:**

System IdoBooking (template `default13`) injectuje **dark background
`#292929`** na kontenerach content offer detail page:

```
.col-lg-9 (main content)         → bg: #292929
.offer-gallery                    → bg: #292929
.offer-right-wrapper (sidebar)    → bg: #292929
.offer-desc-wrapper (descriptions)→ bg: #292929
.room_desc                        → bg: #292929
.price-list, .offer-prices        → bg: #292929
```

Ale **text color dziedziczy z body**: `color: var(--ido-dark, #1A1A1A)`.
Efekt: **ciemny text `#1A1A1A` na ciemnym bg `#292929`** → invisible.

Niektóre buttony mają nawet `color: #2A2829` (mi-primary) na tym samym
`#292929` → **kontrast 0.00** (dosłownie jeden kolor).

**Dlaczego system to robi:** template `default13` był zaprojektowany pod
dark theme dla niektórych klientów IdoBooking. Bez override — kombinacja
brand colors + system dark bg = disaster.

**FIX — force light theme na /offer/N:**

```css
body.page-offer,
body.page-offer main,
body.page-offer .col-lg-9,
body.page-offer .col-lg-3,
body.page-offer .offer-wrapper,
body.page-offer .offer-right-wrapper,
body.page-offer .offer-gallery,
body.page-offer .offer-desc-wrapper,
body.page-offer .room_desc,
body.page-offer .price-list,
body.page-offer .offer-prices,
body.page-offer .offer-details,
body.page-offer [class*="col-md-"] {
  background: var(--ido-bg, #FAFAF8) !important;
  color: var(--ido-dark, #1A1A1A) !important;
}

/* Force dark text na wszystkich child — EXCLUDE buttons + gold price badge */
body.page-offer .col-lg-9 *:not(.btn):not([class*="btn-"]):not(input):not(select):not(.offer-price):not(.offer-price *):not(svg):not(path):not(.accommodation-reservation):not(.accommodation-reservation *):not(.offerCalendar):not(.offerCalendar *):not(.to-offer-prices):not(.to-offer-prices *),
body.page-offer .offer-desc-wrapper *:not(.btn):not([class*="btn-"]):not(input):not(select):not(svg):not(path):not(.btn-success):not(.btn-success *),
body.page-offer .offer-right-wrapper *:not(.btn):not([class*="btn-"]):not(a.accommodation-reservation):not(a.offerCalendar):not(a.to-offer-prices):not(.offer-price):not(.offer-price *):not(svg):not(path) {
  color: var(--ido-dark, #1A1A1A) !important;
}

/* CTA buttons — brand gold z white text */
body.page-offer .accommodation-reservation,
body.page-offer .accommodation-leftbutton,
body.page-offer a.btn-success,
body.page-offer .offerCalendar,
body.page-offer .to-offer-prices,
body.page-offer .btn-reverse {
  background: var(--accent, #C4A97D) !important;
  color: #ffffff !important;
}

/* Price circle badge — gold + white */
body.page-offer .offer-price,
body.page-offer .offer-price *,
body.page-offer .offer-price .price {
  background: var(--accent, #C4A97D) !important;
  color: #ffffff !important;
}

/* Phone/email links */
body.page-offer a[href^="tel:"],
body.page-offer a[href^="mailto:"] {
  color: var(--primary, #2A2829) !important;
  font-weight: 600;
}

/* Amenity icons — gold */
body.page-offer .offer-desc-wrapper svg,
body.page-offer .offer-desc-wrapper [class*="icon-"]:not([class*="leaflet"]) {
  color: var(--accent, #C4A97D) !important;
  fill: var(--accent, #C4A97D) !important;
}

/* Price cennik — gold accent */
body.page-offer .price-list .price,
body.page-offer strong.price {
  color: var(--accent, #C4A97D) !important;
  font-weight: 700 !important;
}
```

**Verified result:** 151 → 9 low-contrast elements (93% reduction).
Remaining 9 są w system widgets (leaflet map popup, language toggler)
— poza UX critical path.

**Testing script (DevTools):**

```js
/* Scan for low-contrast elements on any page: */
let lowContrast = 0;
document.querySelectorAll('h1,h2,h3,h4,p,a,button,span,strong').forEach(el => {
  if (el.offsetHeight === 0 || !el.textContent?.trim()) return;
  const cs = getComputedStyle(el);
  const color = cs.color;
  let bg = 'rgba(0,0,0,0)', p = el;
  while (p) {
    const pbg = getComputedStyle(p).backgroundColor;
    if (pbg && pbg !== 'rgba(0, 0, 0, 0)' && pbg !== 'transparent') { bg = pbg; break; }
    p = p.parentElement;
  }
  const parse = rgb => { const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); return m ? {r:+m[1],g:+m[2],b:+m[3]} : null; };
  const c = parse(color), b = parse(bg);
  if (!c || !b) return;
  const lum = x => (0.2126*x.r + 0.7152*x.g + 0.0722*x.b) / 255;
  if (Math.abs(lum(c) - lum(b)) < 0.25) lowContrast++;
});
console.log('Low contrast elements:', lowContrast);
// Oczekiwane: < 10 (good), > 50 (broken subpage)
```

**W layer1-traps.css:** TRAP #32.


---

## CRITICAL-FFF — Logo: kreska pod + hover underline na logo

**Klient:** MIA Apart (2026-04-15), UNIWERSALNY.

**Symptom:**
> User: "Logo w menu jest nie równe, jak się na nie najedzie to pod nim też
> jest taka kreska jakby do naciskania, i logo musi być trochę wyżej względem
> menu, musi być wycentrowane ładnie"

Logo `.navbar-brand` ma biały 1px kreska pod logo (widoczną static).
Na hover pojawia się dodatkowy underline (z `.nav-link::after`).

**Root cause:**

IdoBooking templates (`default13`, `defaultsb`) dodają `::after`
pseudo-element na `.navbar-brand`:

```css
/* System default13 template: */
.navbar-brand::after {
  content: "";
  display: block;
  background: #ffffff;
  height: 1px;
  width: 100%;
}
```

To może być:
- Część "skip link" a11y pattern
- Accidental effect z reset stylesheet
- Template bug

Dodatkowo custom theme CSS ma hover underline:
```css
.navbar a::after { /* underline animation */ }
/* ↑ "navbar a" łapie też .navbar-brand bo logo jest <a> */
```

**FIX:**

```css
/* Remove system ::after/::before na logo */
header .navbar-brand::after,
header .navbar-brand::before,
header .logo::after,
header .logo::before,
.menu-wrapper .navbar-brand::after,
.menu-wrapper .navbar-brand::before,
header .navbar-brand:hover::after,
header .navbar-brand:focus::after,
header .logo:hover::after {
  display: none !important;
  content: none !important;
  background: none !important;
  height: 0 !important;
  width: 0 !important;
}

/* Logo vertical centering + optical lift */
header .navbar-brand {
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1 !important;
  padding: 0 !important;
  position: relative !important;
  top: -2px;                           /* 2px up dla optical balance */
}
header .navbar-brand img {
  display: block !important;
  vertical-align: middle !important;
}
```

**Dlaczego `top: -2px`?** Optyczne centrowanie ≠ geometryczne. Oko widzi
logo "niżej" niż tekst w tej samej linii gdy oba są middle-aligned geometrycznie.
Lift o 2px daje **optical balance** — logo wygląda "w jednej linii z menu".

**Hover underline (nav-link only, NIE logo):**

```css
/* GOOD: specific selector */
.nav-link::after { /* hover underline */ }

/* BAD — też łapie logo: */
.navbar a::after { /* ... */ }
header a::after { /* ... */ }
```

**Defensive selector w layer1-traps.css:** TRAP #34 — universal.


---

## CRITICAL-GGG v2 — /offers title in H2 > A (anchor ma white, NIE h2!)

**Klient:** MIA Apart (2026-04-15), discovered w follow-up diagnostic.

**Symptom:**
> User: "dalej są białe na białym napisy na /offers"

Nawet po CSS `.offer h2 { color: dark }` nazwa oferty NADAL biała na białym.

**Root cause — DOM structure:**

```html
<!-- System NIE używa .offer class dla listingu! -->
<div class="offers-container">
  <div class="offers_wrapper">
    <div class="accommodation-rest col-md-7 col-xs-12">
      <div class="row">
        <div class="col-md-8 col-xs-12">
          <h2>                                    ← H2 ma color: #1A1A1A (moje CSS OK)
            <a href="/offer/10/..."              ← ALE anchor wewnątrz H2
               style="color: #ffffff">           ← ma system-injected white!
              Mia Old Town Piwna Apartment
            </a>
          </h2>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Dwa subtle problemy:**

### Problem 1: nazwa oferty jest `<h2><a>` (anchor wewnątrz heading)

System default13 wrap'uje tytuł w `<a>` żeby było klikalne. CSS color
dziedziczy z anchora (bliższy ancestor) NIE z h2.

```css
/* BAD (nie dość precyzyjne): */
.offer h2 { color: #1A1A1A; }
/* h2 dostaje dark, ale a wewnątrz ma własny color (system default = white) */

/* GOOD: */
.offer h2, .offer h2 a { color: #1A1A1A; }
```

### Problem 2: system używa `.accommodation-rest` NIE `.offer` class

Moje wcześniejsze CSS łapało tylko `.offer`. System default13 wraps karty
w `.accommodation-rest` (jedyny reason — legacy IdoSell naming).

```
NIE istnieje: .offer .name
ISTNIEJE:    .accommodation-rest h2 a   ← tu jest title
```

Inne system kontenery:
- `.offers-container` — page-level wrapper
- `.offers_wrapper` — listing wrapper (underscore, nie dash!)
- `.accommodation-rest` — card text content
- `.accommodation-listings` — whole listings area

**FIX — universal dark na ALL a in headings + system containers:**

```css
/* H1-H4 anchors zawsze dark na /offers */
body.page-offers h1 a,
body.page-offers h2 a,
body.page-offers h3 a,
body.page-offers h4 a,
body.page-offers h1 a:link,
body.page-offers h2 a:link,
body.page-offers h3 a:link,
body.page-offers h4 a:link,
body.page-offers h1 a:visited,
body.page-offers h2 a:visited,
body.page-offers h3 a:visited,
body.page-offers h4 a:visited {
  color: var(--ido-dark, #1A1A1A) !important;
  text-decoration: none !important;
}
body.page-offers h1 a:hover,
body.page-offers h2 a:hover,
body.page-offers h3 a:hover,
body.page-offers h4 a:hover {
  color: var(--mi-accent, #C4A97D) !important;
}

/* System structures wildcard */
body.page-offers .accommodation-rest *:not(.btn):not([class*="btn-"]):not(.price):not([class*="price"]):not(img):not(svg):not([class*="leaflet"]),
body.page-offers .offers_wrapper *:not(.btn):not([class*="btn-"]):not(.price):not([class*="price"]):not(img):not(svg):not([class*="leaflet"]),
body.page-offers .offers-container *:not(.btn):not([class*="btn-"]):not(.price):not([class*="price"]):not(img):not(svg):not([class*="leaflet"]) {
  color: var(--ido-dark, #1A1A1A) !important;
}

/* Universal: all non-button links dark */
body.page-offers a:not(.btn):not([class*="btn-"]):not([class*="leaflet"]):not([class*="nav-"]):not([href^="tel:"]):not([href^="mailto:"]) {
  color: var(--ido-dark, #1A1A1A) !important;
}
```

**Weryfikacja (DevTools):**

```js
const titleA = document.querySelector('h2 a[href*="/offer/"]');
const cs = getComputedStyle(titleA);
console.log({ color: cs.color, text: titleA.textContent.trim() });
// Oczekiwane: { color: "rgb(26, 26, 26)", text: "Mia Old Town..." }
```

**UWAGA dla audit script:** sprawdzaj **nested elements** — anchor
wewnątrz heading dziedziczy własne style, nie heading's.

**Lesson learned:** NIGDY nie zakładaj że kontener `.offer` istnieje
— system używa template-specific classes (`.accommodation-rest`,
`.product-listing`, etc). ZAWSZE pokryj wszystkie możliwe wrappery
wildcard selectors.

**W layer1-traps.css:** TRAP #33 — zaktualizowany z wszystkimi
system structures + anchor-in-heading handling.


---

## CRITICAL-GGG — /offers page: invisible offer names (white on white)

**Klient:** MIA Apart (2026-04-15).

**Symptom:**
> User: "na /offers nie widać nazw ofert, są białe na białym"

Nazwy ofert ("Mia Old Town Piwna Apartment" itd.) niewidoczne na karcie.

**Root cause:**

1. System renderuje nazwę oferty jako **H2** (template `default13`) LUB **H3**
   (inne templates). Jeśli CSS covers tylko `.offer h3`, H2 NIE dostanie
   override → system default color (biały lub bardzo jasny szary).

2. Karta oferty `.offer` może mieć **background: #ffffff** (system default
   dla card look). Nazwa w bright color + biały bg = invisible.

3. System template zmienia H2/H3 wrapping bez informacji — nie da się
   100% przewidzieć.

**FIX — defensive wildcard:**

```css
/* Cover h1, h2, h3, h4 + wszystkie child children */
body.page-offers .offer h1,
body.page-offers .offer h2,
body.page-offers .offer h3,
body.page-offers .offer h4,
body.page-offers .offer h1 a,
body.page-offers .offer h2 a,
body.page-offers .offer h3 a,
body.page-offers .offer h4 a,
body.page-offers .offer [class*="__name"],
body.page-offers .offer [class*="__title"] {
  color: var(--ido-dark, #1A1A1A) !important;
  font-family: var(--ido-font-heading) !important;
  font-size: 22px !important;
  font-weight: 600 !important;
}

/* Defensive: ALL text inside .offer dark (except buttons + gold price) */
body.page-offers .offer *:not(.btn):not([class*="btn-"]):not(.price):not([class*="price"]):not(img):not(svg):not([class*="leaflet"]) {
  color: var(--ido-dark, #1A1A1A) !important;
}

/* Card bg white, nic nie przecieka */
body.page-offers .offer {
  background: #ffffff !important;
  border: 1px solid var(--mi-border) !important;
}
```

**W layer1-traps.css:** TRAP #33.


---

## SUBPAGE AUDIT CHECKLIST (apply EVERY client, 2026-04-15)

Każdy klient JARVIS MUSI przejść przez audit wszystkich subpage-ów —
system IdoBooking ma dark defaults które trzeba override'ować.

### Subpages do sprawdzenia:

1. **Homepage (/)** ✅ — zwykle OK (customowy content)
2. **/offers** — **`.offer` card: H2/H3 names visible on white bg?**
3. **/offer/N/slug** — **DARK BG TRAP — 151 invisible elements**
4. **/contact** — phone/email visible? no empty white boxes?
5. **/txt/N/slug** — CMS subpages (HomeStaging, O nas, Miasta) — same bg?
6. **/book-now** (modal) — system booking form — theming?

### DevTools contrast audit (run on every subpage):

```js
/* Paste w Console, run na każdej subpage: */
let lowContrast = 0;
const bad = [];
document.querySelectorAll('h1,h2,h3,h4,p,a,button,span,strong,td,li').forEach(el => {
  if (el.offsetHeight === 0 || !el.textContent?.trim()) return;
  const cs = getComputedStyle(el);
  const color = cs.color;
  let bg = 'rgba(0,0,0,0)', p = el;
  while (p) {
    const pbg = getComputedStyle(p).backgroundColor;
    if (pbg && pbg !== 'rgba(0, 0, 0, 0)' && pbg !== 'transparent') { bg = pbg; break; }
    p = p.parentElement;
  }
  const parse = rgb => { const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); return m ? {r:+m[1],g:+m[2],b:+m[3]} : null; };
  const c = parse(color), b = parse(bg);
  if (!c || !b) return;
  const lum = x => (0.2126*x.r + 0.7152*x.g + 0.0722*x.b) / 255;
  if (Math.abs(lum(c) - lum(b)) < 0.25) { lowContrast++; bad.push({el: el.tagName, text: el.textContent.trim().substring(0, 30), color, bg}); }
});
console.table(bad.slice(0, 20));
console.log('TOTAL low contrast:', lowContrast);
```

**Acceptable threshold:** < 10 low-contrast elements na subpage.
**Broken:** > 50 = subpage ma systemic dark-on-dark problem.

### Quick Universal CSS (paste do każdego klienta):

```css
/* UNIVERSAL subpage text visibility — paste w każdym kliencie */
body.page-offer, body.page-offer main { background: var(--bg) !important; color: var(--dark) !important; }
body.page-offer [class*="col-"], body.page-offer [class*="offer-"] {
  background: var(--bg) !important; color: var(--dark) !important;
}
body.page-offer [class*="col-"] *:not(.btn):not([class*="btn-"]):not(.offer-price):not(.offer-price *) {
  color: var(--dark) !important;
}
body.page-offers .offer h1, body.page-offers .offer h2,
body.page-offers .offer h3, body.page-offers .offer h4 {
  color: var(--dark) !important;
}
body.page-offers .offer *:not(.btn):not([class*="btn-"]):not(.price) {
  color: var(--dark) !important;
}
```

**W layer1-traps.css:** TRAP #32 + #33 — universal auto-applied.


---

## CRITICAL-DDD — Dropdown direction UP (bo widget na dole hero)

**Klient:** MIA Apart (2026-04-15), wzorzec UNIWERSALNY.

**Symptom:**
> User: "lokalizacje i goście niech się też wybierają w górę, bo aktualnie jest
> w dole" + "kalendarzyk po naciśnięciu tych przycisków — czy zrobiłeś pod
> względem UX?"

Widget na dole hero (`margin-top: auto`). Native `<select>` i flatpickr
rozwijają się w DÓŁ — opcje/dni znikają za viewport bottom na MacBook 13".

**Root cause:**

### Native `<select>` element
```html
<select><option>...</option></select>
```

Browser decyduje direction dropdown opcji:
- **Chrome/Safari**: zawsze w dół (chyba że za mało miejsca, wtedy auto-up)
- **Firefox**: preferencja down, auto-up jeśli clipped
- **Nie da się kontrolować przez CSS** — browser renderuje popup natywnie

Na widget w hero bottom (y=720) + viewport 800 → opcje idą w dół do
720+200=920 (poza viewport). Browser SOMETIMES auto-flipuje ale NIE
zawsze (zależy od heurystyki).

### Flatpickr kalendarz
```js
flatpickr('.input');
// default position: 'auto' — preferuje w dół
```

Tak samo jak select — kalendarz na 375px rozciągnie się pod viewport.

**FIX — 2 części:**

### Część 1 — Flatpickr `position: 'above auto'`

```js
flatpickr('.my-search__input[type="date"]', {
  position: 'above auto',        // UP by default, flip DOWN jeśli brak miejsca
  showMonths: 1,                 // 1 month na small laptop (było 2 default)
  animate: true,
  // Custom chevron arrows:
  nextArrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  prevArrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  // ... reszta opts
});
```

Flatpickr `position` values:
- `'auto'` (default) — preferuje below
- `'above'` — always above
- `'above auto'` — above preferred, flip below jeśli brak miejsca ← **NAJLEPSZE**
- `'below'` — always below
- `'below auto'` — below preferred, flip above

### Część 2 — Native `<select>` → Custom JS dropdown

Native select niemożliwe kontrolować direction. **Solution: custom dropdown
component** który:
- Zachowuje native `<select>` w DOM (ukryty) dla form submission + a11y
- Dodaje custom trigger (`<div role="combobox">`)
- Dodaje custom list (`<ul role="listbox">` z `position: absolute; bottom: 100%`)
- Kliknięcie opcji → `select.value = X` + dispatch `change` event
- Keyboard: Enter/Space/Arrows/Escape support

**HTML struktura po enhance:**

```html
<div class="mi-search__field mi-search__field--select mi-dropdown-enhanced">
  <label>LOKALIZACJA</label>
  <select aria-hidden="true" style="position:absolute; opacity:0;">
    <option value="all">Wszystkie lokalizacje</option>
    <option value="warszawa">Warszawa</option>
  </select>
  <div class="mi-dropdown__trigger" role="combobox"
       aria-haspopup="listbox" aria-expanded="false" tabindex="0">
    Wszystkie lokalizacje
  </div>
  <ul class="mi-dropdown__list" role="listbox">
    <li class="mi-dropdown__option is-selected" role="option"
        data-value="all">Wszystkie lokalizacje</li>
    <li class="mi-dropdown__option" role="option"
        data-value="warszawa">Warszawa</li>
  </ul>
</div>
```

**CSS — position ABOVE:**

```css
.mi-dropdown__list {
  position: absolute;
  bottom: calc(100% + 8px);       /* ABOVE trigger */
  left: 0; right: 0;
  background: rgba(42, 40, 41, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 169, 125, 0.3);
  border-radius: 6px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.45);
  padding: 6px;
  max-height: 280px;
  overflow-y: auto;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 0.18s, transform 0.18s, visibility 0.18s;
  z-index: 100;
}
.mi-dropdown__list.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.mi-dropdown__option {
  padding: 11px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.mi-dropdown__option:hover { background: rgba(255,255,255,0.08); }
.mi-dropdown__option.is-selected {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}
```

**JS — complete implementation** (copy-paste z layer1-traps.css TRAP #31).

**Weryfikacja (DevTools):**

```js
/* Click trigger: */
document.querySelector('.mi-dropdown__trigger').click();

/* Sprawdź pozycję listy: */
const list = document.querySelector('.mi-dropdown__list.is-open');
const trigger = document.querySelector('.mi-dropdown__trigger');
console.log({
  listTop: list.getBoundingClientRect().top,
  listBottom: list.getBoundingClientRect().bottom,
  triggerTop: trigger.getBoundingClientRect().top,
  opensUpward: list.getBoundingClientRect().bottom < trigger.getBoundingClientRect().top,
  inViewport: list.getBoundingClientRect().top >= 0
});
// Oczekiwane: { ... opensUpward: true, inViewport: true }
```

**Accessibility checklist:**

- [ ] Native `<select>` zostaje w DOM (form submission + screen readers)
- [ ] `aria-hidden="true"` na ukrytym select (nie liczy się dla a11y tree)
- [ ] Trigger: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `tabindex="0"`
- [ ] List: `role="listbox"`
- [ ] Options: `role="option"`, `aria-selected`
- [ ] Keyboard: Enter/Space/ArrowUp/ArrowDown/Escape handlers
- [ ] Outside click closes dropdown
- [ ] Focus management: Escape → focus trigger, Enter → select + close

**UX improvements stosowane tutaj:**

1. **Custom trigger styled** jak rest of widget (brand colors, fonts)
2. **Smooth transition** opacity + transform (imperceptible snap)
3. **Rotating chevron**: `:has(.is-open)::after { transform: rotate(-135deg) }`
4. **Scrollable list** z max-height: 280px + custom scrollbar
5. **Selected option** highlighted brand color (not just checkmark)
6. **Hover state** subtle bg change
7. **Close on outside click** (UX expectation)
8. **One dropdown open at a time** (close others on new open)

**W layer1-traps.css:** TRAP #31 — CSS auto-applied przez `[class*="-dropdown__list"]`
selectors. JS template w komentarzu z PREFIX placeholder.


---

## CRITICAL-CCC — Hero search widget UX + viewport fit (MacBook 13" 800px)

**Klient:** MIA Apart (2026-04-15), wzorzec UNIWERSALNY.

**Symptom:**
> User: "wyszukiwarka powinna być widoczna od razu jak się otwiera na małym
> macu, bo jest za nisko. Przyciski i wszystkie elementy w wyszukiwarce zrób
> pod względem UX/design żeby to było wycentrowane i elementy nie najezdżały
> na siebie"

Wyszukiwarka częściowo obcięta poniżej viewportu na MacBook 13" (1280×800).
Pola różnej szerokości, "Wszystkie lokalizacje" zachodzi na sąsiednie pole.
Submit button innej wysokości niż pola.

**Root cause — 5 problemów collectively:**

### Problem 1 — hero height > viewport on short screens

```css
.section.parallax { height: 85vh; }      /* 680px na 800 viewport — OK */
.mi-hero-wrap { height: 100%; }          /* fill parent */
```

Ale fullpage.js inline-forsuje `.section.parallax { height: 888px }` (ignoruje
CSS 85vh). `.mi-hero-wrap { height: 100% }` rozciąga się więc na 888px — **poza viewport**.
Search bar z `margin-top: auto` ląduje na `888 - padding-bottom(40) = 848`,
czyli **48px POD viewport**.

### Problem 2 — pola różnej szerokości

```css
.mi-search { grid-template-columns: 1.1fr 1.1fr 1fr 1fr auto; }
```

1.1fr vs 1fr = drobne różnice szerokości → wygląda niechlujnie. Plus `auto` na
button → width zależy od content → asymetria.

### Problem 3 — text overflow (zachodzenie na sąsiednie pole)

```css
.mi-search__select { /* brak overflow rules */ }
```

`"Wszystkie lokalizacje"` (18 znaków) w polu 190px szerokim wycieka POZA pole.
Bez `white-space: nowrap + overflow: hidden + text-overflow: ellipsis` tekst
zachodzi na sąsiednie pole `"Goście"`.

### Problem 4 — label + input nie wycentrowane vertically

```css
.mi-search__field { padding: 14px 18px 12px; }  /* asymmetric */
.mi-search__label { margin-bottom: 4px; }
```

Label przy top, input przy bottom. Gap niekonsystentny. Przy hover/focus content shift.

### Problem 5 — submit button height ≠ field height

Field = padding(14+12) + label(~14) + input(~20) = ~60px. Submit = `padding: 0 44px`
+ `min-width: 200px` ale bez `min-height` → wychodzi różna wysokość. Wizualnie widget wygląda zepsuty.

**FIX — 5 punktów:**

### 1. Hero-wrap = viewport height (nie 100% parent)

```css
.mi-hero-wrap {
  height: 100vh !important;        /* nie 100% — fullpage forsuje inline */
  max-height: 100vh !important;
  padding: 88px 0 32px;
}
```

Na 800×1280 viewport → hero-wrap ma dokładnie 800px. Widget z `margin-top: auto`
ląduje na `800 - 32 (padding-bottom) - 8 (margin-bottom) - 65 (widget height) = 695`.
Widget bottom = 760 → **40px gap do viewport bottom**. W pełni widoczny.

### 2. Equal columns grid

```css
.mi-search {
  grid-template-columns: 1fr 1fr 1fr 1fr auto;  /* 4 equal fields */
  gap: 0;                                       /* border separator zamiast gap */
  padding: 6px;
  min-height: 64px;
}
```

Wszystkie 4 pola **dokładnie równa szerokość** (228px na 1280 viewport).
Button `auto` — widen as needed but `min-width: 180px`.

### 3. Text overflow ellipsis

```css
.mi-search__field {
  min-width: 0;                /* KRYTYCZNE — allow children to shrink */
}
.mi-search__input,
.mi-search__select,
.mi-search__label {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  min-width: 0 !important;
}
```

`min-width: 0` na flex/grid items to **must-have** — inaczej `min-content`
default zapobiega shrink, overflow nie działa. Wszystkie textual children
obcinają się "..." zamiast wyciekać.

### 4. Flex center field content

```css
.mi-search__field {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-height: 52px;
  padding: 10px 16px;           /* symmetric, kompakt */
}
.mi-search__label {
  font-size: 11px;              /* było 10 — lepsza czytelność */
  letter-spacing: 1.5px;
  line-height: 1.2;
  margin: 0;
}
```

Label + input wertykalnie wycentrowane. Spójna wysokość.

### 5. Submit matches field height

```css
.mi-search__submit {
  min-height: 52px;             /* = field min-height */
  min-width: 180px;
  align-self: stretch;          /* grid row stretch */
  padding: 0 36px;              /* symmetric kompakt */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

**6. Responsive breakpoints progressive:**

```css
@media (max-width: 1024px) {
  .mi-search { grid-template-columns: 1fr 1fr 1fr auto; }  /* 3 fields */
}
@media (max-width: 900px) {
  .mi-search { grid-template-columns: 1fr 1fr; }  /* 2 × 2 grid */
}
@media (max-width: 540px) {
  .mi-search { grid-template-columns: 1fr; }  /* stack */
}
@media (max-height: 820px) {
  /* Short viewport — MacBook 13", landscape phones */
  .mi-hero-wrap { padding: 88px 0 20px; }
  .mi-hero__title { font-size: clamp(28px, 4.5vw, 48px); }
  .mi-search__field { padding: 8px 14px; min-height: 48px; }
  .mi-search__submit { min-height: 48px; min-width: 160px; }
}
```

**Weryfikacja LIVE (DevTools resize → 1280×800):**

```js
const widget = document.querySelector('.mi-search');
const rect = widget.getBoundingClientRect();
console.log({
  top: rect.top,                      // powinno > 0
  bottom: rect.bottom,                // powinno <= 800 (viewport)
  height: rect.height,                // ~65-71px
  fullyVisible: rect.top >= 0 && rect.bottom <= window.innerHeight
});
```

**Oczekiwane:**
```
{ top: 689, bottom: 760, height: 71, fullyVisible: true }
```

**UX checklist dla każdego hero search widget (apply EVERY client):**

- [ ] `.hero-wrap { height: 100vh; max-height: 100vh }` (nie 100% parent)
- [ ] `.search { grid-template-columns: 1fr 1fr 1fr 1fr auto }` — equal widths
- [ ] `.search__field { min-width: 0; display: flex; justify-content: center }`
- [ ] `.search__label { font-size: 11px; line-height: 1.2; margin: 0 }`
- [ ] `.search__input, .search__select { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0 }`
- [ ] `.search__submit { min-height: 52px; align-self: stretch; min-width: 180px }`
- [ ] Breakpoints: 1024 (3 fields), 900 (2 fields), 540 (stack)
- [ ] `@media (max-height: 820px)` — compact for MacBook 13"
- [ ] DevTools test: resize do 1280×800, widget.fullyVisible === true

**W layer1-traps.css:** TRAP #29 (hero 100vh) + TRAP #30 (widget UX universal).


---

## CRITICAL-BBB — Header scrolled state: "shadow first, then bg white" bug

**Klient:** MIA Apart (2026-04-15), wzorzec UNIWERSALNY.

**Symptom:**
> User: "jak się zjedzie w dół, menu ma najpierw jakby shadow box, a jak się
> zjedzie jeszcze niżej, dopiero wtedy tło robi się białe. Ma się od razu po
> zjechaniu nawet trochę w dół robić białe tło."

Transparent header → scrolled-white header transition wygląda zepsuta:
pierwsze widać cień (box-shadow), potem dopiero tło zaczyna się bielić.

**Root cause — dwa współdziałające bugi:**

### Bug 1 — transition animuje TYLKO background, nie box-shadow

```css
/* typowy pattern w theme CSS: */
.menu-wrapper {
  background: transparent;
  transition: background 0.3s ease;  /* ← ONLY background */
}
.mi-header--scrolled .menu-wrapper {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);  /* ← no transition defined */
}
```

Gdy dodajemy `.mi-header--scrolled` class:
- `background` animuje z `transparent → rgba(0.98)` przez 0.3s
- `box-shadow` **applied INSTANTLY** (bez transition) — bo property nie jest
  wymieniony w `transition`

User widzi **cień pojawiający się natychmiast**, a tło dopiero wchodzi fade-in.

### Bug 2 — background rgba(255, 255, 255, 0.98) semi-transparent

`0.98` = 98% white. Przez pierwsze 100-200ms transition widać semi-transparent
białe tło z tłem hero/content prześwitującym. W połączeniu z **already visible**
shadow → użytkownik interpretuje jako "tylko shadow, bez tła".

Timeline user perspective:
```
t=0ms    add .mi-header--scrolled class (e.g. fp-viewing-1 → fp-viewing-2)
t=0ms    box-shadow: FULL (instant, no transition)
t=0ms    background starts fading: transparent → rgba(0.98) over 300ms
t=100ms  user widzi: cień + 33% white tło  ← "shadow appears first"
t=200ms  user widzi: cień + 66% white tło  ← "tło się dopiero robi białe"
t=300ms  user widzi: cień + 98% white tło  ← full state (ale nadal semi-transp)
```

**FIX — 3 zmiany:**

### Fix 1 — pure #ffffff zamiast rgba(255, 255, 255, 0.98)

`rgba(0.98)` nigdy nie jest w pełni opaque — content prześwituje. `#ffffff` =
pełne solid white, natychmiast wyraźny kontrast.

### Fix 2 — unified transition na background + box-shadow

```css
transition: background 0.15s ease,
            background-color 0.15s ease,
            box-shadow 0.15s ease !important;
```

Obie właściwości animują równocześnie, z tą samą duration. User widzi:
- cień + tło **narastające razem** (sync)
- 0.15s zamiast 0.3s — 2× szybciej, "instant" dla usera

### Fix 3 — explicit `box-shadow: none` w base state

```css
.menu-wrapper {
  box-shadow: none !important;  /* explicit — żeby transition miał start value */
  transition: background 0.15s ease, box-shadow 0.15s ease !important;
}
```

Bez `box-shadow: none` explicit w base state, browser może traktować zmianę
jako "z undefined → value" (instant) zamiast "0→value" (animated).

**Final CSS (paste na KAŻDEGO klienta z transparent header):**

```css
/* Base state (transparent, no shadow) */
body.page-index header .menu-wrapper,
body.page-index header .bgd-color-light,
body.mi-homepage header .menu-wrapper {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  transition: background 0.15s ease,
              background-color 0.15s ease,
              box-shadow 0.15s ease !important;
}

/* Scrolled state (solid white, subtle shadow) */
body.page-index header.mi-header--scrolled .menu-wrapper,
body.mi-homepage header.mi-header--scrolled .menu-wrapper,
body header.mi-header--scrolled .menu-wrapper {
  background: #ffffff !important;
  background-color: #ffffff !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
  transition: background 0.15s ease,
              background-color 0.15s ease,
              box-shadow 0.15s ease !important;
}
```

**Weryfikacja (DevTools scrubbing):**

```js
/* Toggle scrolled class i sample every 50ms: */
const header = document.querySelector('header');
const menuWrapper = document.querySelector('.menu-wrapper');
header.classList.add('mi-header--scrolled');

[0, 50, 100, 150, 200].forEach(delay => {
  setTimeout(() => {
    const cs = getComputedStyle(menuWrapper);
    console.log(`+${delay}ms:`, {
      bg: cs.backgroundColor,
      shadow: cs.boxShadow.substring(0, 60)
    });
  }, delay);
});
```

**Oczekiwane po fix:**
```
+0ms:   bg=rgba(0,0,0,0)                        shadow=rgba(0,0,0,0) 0px 0px
+50ms:  bg=rgba(255,255,255,0.345)              shadow=...,1.4px,8.3px (1/3)
+100ms: bg=rgba(255,255,255,0.85)               shadow=...,3.4px,20.5px (2/3)
+150ms: bg=rgb(255,255,255)                     shadow=...,4px,24px (100%)
+200ms: bg=rgb(255,255,255)                     shadow=...,4px,24px (settled)
```

Progress bg i shadow są **równoległe** (jednakowe proporcje). Pure white
osiągnięte w 150ms (nie 300ms).

**W layer1-traps.css:** TRAP #28 (uniwersalny fix z `body[class*="-homepage"]`
dla dowolnego klienta prefix).


---

## CRITICAL-AAA — Font fragmentation (6+ unique stacks zamiast 2 design fonts)

**Klient:** MIA Apart (2026-04-15), wzorzec UNIWERSALNY.

**Symptom:**
> User: "używasz 10 różnych fontów, a miały być 1 max 2"

Chrome DevTools computed styles pokazują 6-7 unique `font-family` values.
Mimo że projektant chciał tylko 2 fonty (heading Playfair + body Inter).

**Root cause — 6 stacks na stronie MIA (before fix):**

```
1. Inter, system-ui, -apple-system, "Segoe UI", sans-serif  ← 301 elem (CSS var)
2. Inter, sans-serif                                        ← 107 elem (hardcoded bez fallback)
3. -apple-system, "system-ui", Roboto, "Helvetica Neue", ...← 79 elem (Litepicker system default)
4. "Playfair Display", Georgia, serif                       ← 61 elem (proper heading)
5. sans-serif                                               ← 5 elem (browser default)
6. "Playfair Display", serif                                ← 2 elem (Litepicker cur-month)
+ @font-face Montserrat 400/500/700 (IdoBooking app.css, nieużywane, ale loaded)
```

**Rzeczywistość:** 2 design fonts + 4 artifactów.

**Dlaczego 6 stacks zamiast 2:**

### Artifact A — hardcoded `'Inter', sans-serif` bez fallback

Developer copy-paste'uje CSS rule z jednego miejsca:
```css
.my-component { font-family: 'Inter', sans-serif; }
```
W innym miejscu CSS var:
```css
.other-component { font-family: var(--ido-font-body); }
/* var = 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif */
```
Browser reportuje jako **2 różne font-family stacks** mimo że oba renderują Inter.

### Artifact B — Litepicker używa system font

`.litepicker .month-item` dostaje default browser stack (`-apple-system, system-ui, Roboto, ...`)
bo CSS Litepicker nie dziedziczy nic jawnie. Wygląda **INACZEJ** niż reszta strony.

### Artifact C — Montserrat @font-face

IdoBooking `app.css` (system) deklaruje `@font-face { font-family: 'Montserrat' }` w 3
weights. Browser ładuje te 3 pliki fonta, ale nic ich nie używa (żaden element nie ma
`font-family: Montserrat` w computed styles). **Marnowanie bandwidth** (~100KB).

### Artifact D — `sans-serif` dla `<script>/<style>/<title>`

Niewidoczne elementy dostają browser default (`sans-serif`). OK — nie widać ich, ale
liczą się jako unique stack w scanie.

**FIX — 3 etapy:**

### Etap 1 — zunifikuj wszystkie deklaracje fontu w CSS (global replace)

```bash
# W kliencie MI_CSS_EDYTOR.css (lub innym theme CSS):
sed -i '' "s/font-family: 'Inter', sans-serif/font-family: var(--ido-font-body)/g" FILE
sed -i '' "s/font-family: 'Playfair Display', Georgia, serif/font-family: var(--ido-font-heading)/g" FILE
```

Albo w Edit tool: `replace_all: true` dla każdego wariantu.

**Efekt:** 2 stacks `Inter, sans-serif` + `Inter, system-ui, ...` zmerge'ują się w
jeden `Inter, system-ui, -apple-system, 'Segoe UI', sans-serif`.

### Etap 2 — force Inter na system widgets

```css
.litepicker, .litepicker *,
.container__months, .container__months *,
.month-item, .month-item *,
.day-item,
.container__days, .container__days *,
.flatpickr-calendar, .flatpickr-calendar *,
.iai-search, .iai-search *,
#iai_book_form, #iai_book_form *,
input, textarea, select, button,
.widget__option, .widget__option * {
  font-family: var(--ido-font-body) !important;
}
/* Preserve icons */
[class*="icon-"]::before,
[class*="icon-"]::after,
.iaifonts, .fa, .fa-solid, .fa-regular, .fontello {
  font-family: inherit;
}
/* Playfair na kalendarz miesiąc */
.litepicker .cur-month,
.litepicker .month-item-name,
.flatpickr-current-month {
  font-family: var(--ido-font-heading) !important;
}
```

### Etap 3 — zredukuj Google Fonts weights

Developer domyślnie ładuje WSZYSTKIE weights ("just in case"):

```html
<!-- BAD: 11 weights = 11 pobrań = duży bundle -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap">
```

Sprawdź rzeczywiście używane weights (DevTools → Network → filter font → count):

```html
<!-- GOOD: 7 weights, te które się renderują -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;700&display=swap">
```

**Efekt finalny (MIA verified):**

Before: 6 unique stacks → After: **3 stacks → 2 design fonts**
```
Inter              — 106 elem (101 proper + 5 system-injected inline)
Playfair Display   — 40 elem
sans-serif         — 0 elem (script/style hidden z scanu)
```

**Detection (DevTools scan script):**

```js
/* Uruchom na dowolnej stronie żeby policzyć unique font stacks: */
const usage = new Map();
document.querySelectorAll('*').forEach(el => {
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return;
  if (!['SCRIPT','STYLE','TITLE','META','HEAD'].includes(el.tagName)) {
    const hasText = el.textContent?.trim() &&
      Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) return;
    const ff = cs.fontFamily.trim();
    usage.set(ff, (usage.get(ff) || 0) + 1);
  }
});
console.table([...usage.entries()].sort((a,b) => b[1] - a[1]));
```

**Wynik oczekiwany:** max 2-3 stacks widoczne (design fonts + maybe icon fonts).

**W layer1-traps.css:** TRAP #27 (auto-applied universal selectors na Litepicker,
flatpickr, iai-search, form controls).


---

## CRITICAL-ZZ — .index-info widget leak po fix CRITICAL-YY

**Klient:** MIA Apart (2026-04-15), follow-up do CRITICAL-YY.

**Symptom:**
> User: "co ty zrobiłeś?? zobacz co się dzieje" [screenshot pokazujący brzydkie
> pudełka Lokalizacja/Początek/Koniec/Osoby na samej górze strony, przed
> headerem, nad hero]

Brzydki systemowy search widget pojawia się na TOP strony (y=0-80px), NAD
transparent headerem MIA. Custom `.mi-search` (estetyczny, w hero) też jest
widoczny dalej w dół — mamy DWA searche.

**Root cause:**

Systemowy widget `.index-info` zawiera `.iai-search` z default fields
(Lokalizacja, Początek, Koniec, Osoby). Pozycjonowanie:

```css
.index-info {
  position: absolute;     /* system default */
  top: 0 !important;      /* w naszym CSS linia 232 */
  left: 0 !important;
  right: 0 !important;
  /* parent .fp-tableCell wewnątrz .section.parallax */
}
```

**Przy starym `.section.parallax { margin-top: -88px }`:**
- Parent section w page coord `-88` do `812`
- Widget `top: 0` absolute = page coord `-88` — UKRYTY pod/przed headerem
- Użytkownik widzi tylko customowy `.mi-search` w hero

**Po fix CRITICAL-YY `.section.parallax { margin-top: 0; padding-top: 88px }`:**
- Parent section w page coord `0` do `988`
- Widget `top: 0` absolute = page coord `0` — WIDOCZNY w obszarze 0-88px
- Widget ląduje **nad** fixed header (bo z-index może być wyższy niż header'a)

**Czyli fix TRAP #25 (scroll-on-load) odsłonił ukryty element.**

**FIX — ukryj systemowy widget na homepage:**

```css
body.page-index .index-info,
body.mi-homepage .index-info,
body.page-index #iai_book_se,
body.page-index #iai_book_form {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
}
```

**Dlaczego `display: none` jest OK:**
- MIA ma własny `.mi-search` (piękny custom widget w hero)
- Każdy JARVIS klient ma swój prefix (nj/md/mi/...) i własny search
- Systemowy widget jest NADMIAROWY gdy mamy customowy
- Podobny pattern już działał na `/offers` (linia 280) i `/txt` (linia 282)

**UWAGA — nie aplikuj na detail pages:**

Strona `/offer/N` (detail konkretnej oferty) UŻYWA systemowego widgetu
rezerwacji (.iai-search bez .d-none class). NIE ukrywaj na page-offer!
Selektor `body.page-index` (lub `body.mi-homepage`) jest precise — dotyczy
TYLKO homepage.

**Alternatywa (jeśli klient CHCE systemowy widget):**

Przesuń widget pod header zamiast ukrywać:

```css
body.page-index .index-info {
  top: var(--ido-header-h, 88px) !important;  /* było: 0 */
}
```

To pokazuje widget w obszarze pod headerem. Ale nadal kolizja z
customowym `.mi-search` — lepiej ukryć jeden z dwóch.

**Weryfikacja (DevTools):**

```js
/* Po fix: */
getComputedStyle('.index-info').display;           // "none" ✅
document.querySelector('.index-info').offsetHeight;  // 0 ✅
document.querySelector('.mi-search').offsetHeight;   // > 0 ✅ custom visible
window.scrollY;                                    // 0 ✅
```

**W layer1-traps.css:** TRAP #26 (auto-applied uniwersalnymi selektorami
`body.page-index` + `body[class*="-homepage"]` dla dowolnego klienta prefix).


---

## CRITICAL-YY — Scroll-on-load bug przez margin-top:-N na hero + fullpage.js

**Klient:** MIA Apart (2026-04-15), ale wzorzec UNIWERSALNY — dotyczy każdego
klienta z transparent header + fullpage.js homepage (tzn. wszystkich IdoBooking).

**Symptom:**
> User: "Strona nie otwiera się przesunięta do samej góry, jakiś element
> tego przezroczystego menu to robi. Na start nie da się przewinąć do góry."

Strona ładuje się przewinięta o 88px (wysokość header-a). Arrow-up / scroll-to-top
nic nie daje, bo fullpage.js forsuje pozycję section 1. User widzi hero częściowo
przycięte u góry.

**Root cause (3-step chain):**

### Krok 1 — CSS "wciąga" hero pod transparent header

Wzorzec dla transparent header: hero musi zaczynać się OD page top (y=0),
żeby fixed header transparent leżał NAD zdjęciem hero. Standardowo robi się to:

```css
/* TYPOWY ANTI-PATTERN: */
body.page-index .section.parallax {
  margin-top: calc(-1 * var(--ido-header-h)) !important;  /* -88px */
  position: relative !important;
}
```

Hero jest teraz w page coord `-88` do `-88 + 900 = 812`. Header fixed leży nad `0-88`.

### Krok 2 — fullpage.js "koryguje" scroll

IdoBooking uruchamia fullpage.js na homepage (body class `fp-enabled`, `fp-viewing-1`).
fullpage.js na init ROBI: `scrollTo(firstSection.offsetTop)` — żeby pierwsza section
zaczynała się od viewport top.

Hero `.section.parallax` ma `offsetTop: 0` (jest pierwszym elementem w `.fullpage-wrapper`),
ALE przez `margin-top: -88`, jego position w layout flow jest `-88`. fullpage.js widzi
"section 1 zaczyna się w -88, a ja chcę żeby była od 0" → skrolluje page o +88.

Wynik: `window.scrollY: 88` na load.

### Krok 3 — browser history.scrollRestoration persists

Default `history.scrollRestoration: 'auto'` — po każdym reload browser przywraca
poprzednią pozycję scroll. Nawet jeśli user jakoś doścrolluje do 0, następny reload
wraca do 88.

**Detection (DevTools on load):**

```js
window.scrollY;                                        // 88 (powinno 0)
getComputedStyle('.section.parallax').marginTop;       // "-88px"
document.getElementById('pageContent').getBoundingClientRect().top;  // -176
history.scrollRestoration;                             // "auto"
document.body.className;                               // "...fp-viewing-1"
```

**FIX — dwuczęściowy:**

### Part A — CSS (zamień margin-top na padding-top)

```css
body.page-index .section.parallax,
body.mi-homepage .section.parallax,
.page-index .section.parallax {
  margin-top: 0 !important;                             /* było: -88 */
  padding-top: var(--ido-header-h, 88px) !important;    /* zastąp */
  box-sizing: border-box !important;                    /* padding w height */
  position: relative !important;
}
```

**Dlaczego to działa:**
- Hero bg cover image idzie od viewport top (y=0) — pod fixed header'em
- Header transparent leży NA hero image (fixed position, top:0)
- Hero content (tekst, search widget) jest pchnięty w dół o 88px przez `padding-top`
  → nie zachodzi pod header
- `box-sizing: border-box` — padding wliczony w `height: 85vh` (nie dodaje się do total)
- fullpage.js widzi section1 offsetTop=0 → nie koryguje scroll

### Part B — JS (body_bottom, na początku IIFE)

```js
(function () {
  'use strict';

  /* Disable browser history scroll restoration */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function resetScrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  resetScrollToTop();  // sync
  document.addEventListener('DOMContentLoaded', resetScrollToTop);
  window.addEventListener('load', function () {
    if (window.scrollY <= 100) resetScrollToTop();
  });

  /* Retry po fullpage.js async init */
  [100, 300, 600, 1200].forEach(function (delay) {
    setTimeout(function () {
      if (window.scrollY <= 100 && !window.__userScrolled) resetScrollToTop();
    }, delay);
  });

  /* STOP reset gdy user zaczął ręcznie scrollować */
  document.addEventListener('wheel', function () {
    window.__userScrolled = true;
  }, { once: true, passive: true });
  document.addEventListener('touchstart', function () {
    window.__userScrolled = true;
  }, { once: true, passive: true });

  /* ... reszta JS ... */
})();
```

**Dlaczego flaga `__userScrolled`?** Żeby nie "sabotować" user-a gdy ręcznie
przewija w pierwsze 1.2s po load — first wheel/touch event ustawia flagę,
setTimeout reset przestaje działać.

**Weryfikacja (DevTools test):**

```js
/* Po aplikacji fix: */
window.scrollY;                        // 0 ✅
window.scrollTo(0, 1000);              // scrolluje OK
window.scrollY;                        // 1000 ✅
window.scrollTo({top: 0});             // wraca do 0
window.scrollY;                        // 0 ✅
```

**W layer1-traps.css:** TRAP #25 — CSS part auto-applied (selektory uniwersalne).
JS part idzie do body_bottom każdego klienta (na początku IIFE, przed modułami).


---

## CRITICAL-XX — FAQ answer readability floor 16px + opacity ≥ 0.95

**Klient:** MIA Apart (2026-04-15), ale wzorzec UNIWERSALNY.

**Symptom:**
> User: "Często zadawane pytania dalej są za małe, zwłaszcza odpowiedzi"

Designer chciał wizualnej hierarchii: question większe, answer mniejsze.
Ale przesadził — answer `0.95rem` (15.2px) + `opacity: 0.85` = poniżej
WCAG body text floor (16px) + słaby kontrast na jasnym tle.

**Root cause:**

```css
.mi-faq__question {
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);  /* 17-22px — OK */
  font-weight: 600;
}
.mi-faq__answer {
  font-size: 0.95rem;                        /* 15.2px — ZBYT MAŁE */
  line-height: 1.7;
  opacity: 0.85;                             /* SŁABY KONTRAST */
}
```

**FIX:**

```css
.mi-faq__answer {
  padding: 8px 4px 28px;
  font-family: var(--ido-font-body);
  font-size: clamp(1rem, 1.05vw, 1.0625rem);  /* 16-17px responsive */
  line-height: 1.75;                          /* ≥ 1.65 */
  color: var(--mi-text);
  opacity: 0.95;
}
.mi-faq__answer p {
  margin: 0 0 12px;
  font-size: inherit;
  line-height: inherit;
}
.mi-faq__answer p:last-child { margin-bottom: 0; }
```

**Rule of thumb:**
- Question: 17-22px, weight 600
- Answer: **min 16px**, weight 400, line-height ≥ 1.65, opacity ≥ 0.95
- Ratio question/answer: max 1.5:1

**W layer1-traps.css:** TRAP #24.


---

## FOOTER COMPENDIUM (2026-04-15) — lekcje z 18+ klientów

Zebrane wszystkie znane problemy ze stopką IdoBooking. Stosuj jako
checklist przy każdym nowym kliencie.

### Struktura systemowej stopki

```html
<footer class="footer container">
  <!-- 1. VISA/MC payment strip: -->
  <div class="footer-contact-baner">...</div>

  <!-- 2. Contact info (z panelu → Ustawienia → Dane firmy): -->
  <div class="footer-contact-info">
    <p>Adres: Piwna, 00-265 Warszawa</p>
    <p><a href="tel:+48...">+48 501 055 542</a></p>
    <p><a href="mailto:...">...</a></p>
  </div>

  <!-- 3. System linki (Regulamin, Polityka prywatności): -->
  <div class="footer-legal">...</div>

  <!-- 4. Powered by IdoBooking badge (SVG 120x120): -->
  <div class="powered_by"><img src=".../powered_by.svg"></div>

  <!-- 5. Często pusty <div> lub inline spacer -->
</footer>
```

### 8 bugów + FIX-y

#### Bug 1 — `.footer-contact-baner` default `#3E475E` niebieski

ZAWSZE override:

```css
.footer-contact-baner,
.footer__strip {
  background: var(--ido-dark) !important;
  color: #fff !important;
  padding: 20px 24px !important;
  margin: 0 !important;
  width: 100% !important;
}
```

#### Bug 2 — Martwa spacja po VISA strip (30-70px pustki)

Powoduje pusty `<div></div>` + `.powered_by` z paddingiem. FIX:

```css
.footer-contact-baner ~ *,
.footer__strip ~ * {
  display: none !important;
}
.footer.container { padding-bottom: 0 !important; }
```

UWAGA: jeśli `.powered_by` jest PRZED `.footer-contact-baner` — nie ukrywaj!
Sprawdź kolejność w DOM.

#### Bug 3 — "Powered by IdoBooking" biały kwadrat 120x120

IdoBooking TOS wymaga VISIBLE badge — nie można hide. FIX: downsize:

```css
.powered_by img,
.powered_by_logo {
  max-width: 80px !important;
  max-height: 18px !important;
  filter: brightness(0) invert(1) opacity(0.35) !important;
}
.powered_by {
  padding: 12px 0 !important;
  text-align: center !important;
}
```

#### Bug 4 — `.footer.container` Bootstrap padding konflikt

```css
.footer.container,
footer.container,
.footer-wrapper {
  padding: 60px 24px 0 !important;
  max-width: 100% !important;
}
```

#### Bug 5 — Overscroll pokazuje light body-bg pod dark footer

FIX (już TRAP #20):
```css
html { background: var(--ido-dark, #1A1A1A) !important; }
```

#### Bug 6 — Telefon/email w custom CTA sekcji hardcoded

Pull z footera dynamicznie:

```js
document.addEventListener('DOMContentLoaded', () => {
  const tel = document.querySelector('footer a[href^="tel:"]');
  const mail = document.querySelector('footer a[href^="mailto:"]');
  if (tel) {
    document.querySelectorAll('.mi-phone-auto').forEach(el => {
      el.href = tel.href;
      if (!el.dataset.keepText) el.textContent = tel.textContent.trim();
    });
  }
  if (mail) {
    document.querySelectorAll('.mi-email-auto').forEach(el => {
      el.href = mail.href;
      if (!el.dataset.keepText) el.textContent = mail.textContent.trim();
    });
  }
});
```

#### Bug 7 — VISA strip white gap po bokach (calc breakout fail)

```css
/* Option A — strip jako full parent width: */
.footer-contact-baner {
  width: 100% !important;
  margin: 0 !important;
}

/* Option B — strip jako full viewport (jeśli parent nie container): */
.footer-contact-baner {
  width: 100vw !important;
  position: relative;
  left: 50%;
  margin-left: -50vw !important;
}
```

#### Bug 8 — Footer mobile stacking

```css
@media (max-width: 640px) {
  .footer-contact-info {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    text-align: center !important;
  }
  .footer-contact-info .separator,
  .footer-contact-info span:empty { display: none !important; }
}
```

### Footer CHECKLIST (apply every new client)

- [ ] `.footer-contact-baner { background: var(--ido-dark); padding: 20px 24px }`
- [ ] `.footer-contact-baner ~ * { display: none }`
- [ ] `.footer.container { padding: 60px 24px 0 }`
- [ ] `.powered_by img { max-width: 80px; max-height: 18px; filter: invert(1) opacity(0.35) }`
- [ ] `html { background: var(--ido-dark) }` (TRAP #20)
- [ ] JS: pull phone/email z `footer a[href^="tel:"]`
- [ ] Mobile: `.footer-contact-info { flex-direction: column }` < 640px
- [ ] Test: screenshot desktop + mobile, brak white gap


---

## FULL-WIDTH SECTION PATTERNS (2026-04-15) — rozszerzone

### 3 wzorce (wybierz zależnie od parent context)

#### WZORZEC 1 — breakout margin (simple)

Najprostszy, gdy parent bez padding:

```css
.my-section {
  position: relative;
  isolation: isolate;              /* TRAP #19 */
  width: 100vw;
  max-width: 100vw;
  left: 50%;
  margin-left: -50vw;
  padding: 100px 24px;
  box-sizing: border-box;
}
.my-section__inner { max-width: 1200px; margin: 0 auto; }
```

#### WZORZEC 2 — calc breakout (gdy parent ma padding symmetric)

```css
.my-section {
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
  isolation: isolate;
  position: relative;
}
```

**UWAGA:** Parent `.container` z `padding:15px` (Bootstrap) — matematyka
shifts o 15-30px. Wtedy WZORZEC 3.

#### WZORZEC 3 — absolute z body jako positioned parent (hero only)

```css
body.page-index { position: relative; }
.my-hero-section {
  position: absolute;
  top: 0; left: 0; right: 0;
  width: 100%; max-width: 100vw;
  height: 100vh;
  isolation: isolate;
}
```

Out-of-flow → nie pushuje content. Używaj TYLKO hero/top.

### OBOWIĄZKOWE properties (każda full-width section)

```css
.my-section {
  isolation: isolate;              /* TRAP #19 — z-index bleed prevention */
  position: relative;
  box-sizing: border-box;
  overflow: hidden;                /* TRAP #15/17 — block bg leak */
  /* + jeden z 3 wzorców width */
}

/* Parent (TRAP #18): */
.section_sub.container,
.container:not(.footer):not(.navbar-container) {
  overflow: visible !important;
}
```

### Common mistakes ❌

1. **Brak `isolation: isolate`** → z-index wycieka
2. **Brak parent `overflow: visible`** → breakout clipped w .container
3. **`width: 100%` zamiast `100vw`** → zostaje w parent bounds
4. **`margin-left: -50vw` + parent padding** → offset shift
5. **`position: fixed` na `.parallax-slider`** → bg leak na całą stronę
6. **Wiele sekcji bez isolation** → kaskadujący z-index chaos

### Test każdej full-width section (DevTools)

```js
const s = document.querySelector('.my-section');
console.log({
  width: s.offsetWidth,              // powinno = window.innerWidth
  windowWidth: window.innerWidth,
  left: s.getBoundingClientRect().left,  // powinno = 0
  isolation: getComputedStyle(s).isolation,  // "isolate"
  parentOverflow: getComputedStyle(s.parentElement).overflow,  // "visible"
});
```


---


## CRITICAL-TT: VISA/MC Footer Strip — ::before Pseudo-Element + Margin Gap

**Data:** 2026-04-16 (updated)
**Klient:** Piekary 1-3 (client23326)
**Problem:** System `app.css` sets TWO things on `.footer-contact-baner`:
1. `background: rgb(62, 71, 94)` (#3E475E — navy/granatowy)
2. `margin: 15px -10px -40px` — negative margins create gaps
3. **`::before` pseudo-element** with `background: rgb(62, 71, 94)` and `width: 100vw`

The `::before` pseudo-element is the REAL source of the blue/navy strips visible on the left and right sides of the footer. Overriding only `.footer-contact-baner` bg is NOT enough — the `::before` retains the system navy color and bleeds through.

**Root cause:** System uses `::before` as a full-width background layer on `.footer-contact-baner`. Custom CSS overrides the element bg but forgets the pseudo-element.

**Fix (CSS) — MUST override both element AND ::before/::after:**
```css
.footer-contact-baner {
  margin: 0 !important;
  width: 100% !important;
  background: #1A1A1A !important;
  background-color: #1A1A1A !important;
  box-sizing: border-box !important;
}
/* THIS IS THE KEY FIX — without it, navy strips remain! */
.footer-contact-baner::before,
.footer-contact-baner::after {
  background: #1A1A1A !important;
  background-color: #1A1A1A !important;
  display: none !important;
}
```

**ALWAYS CHECK:** When overriding any system element's background, also check `::before` and `::after` pseudo-elements. IdoBooking uses them as background layers on several elements.

**Apply to:** EVERY new client. Check with DevTools:
```js
const b = document.querySelector('.footer-contact-baner');
console.log({
  width: b.offsetWidth,
  windowWidth: window.innerWidth,
  left: b.getBoundingClientRect().left,
  margin: getComputedStyle(b).margin
});
// width should equal windowWidth, left should be 0
```

**Severity:** HIGH — visible on every page, clients notice immediately.


---


## CRITICAL-UU: Universal Lightbox — Every Image Must Be Enlargeable

**Data:** 2026-04-15
**Problem:** Lightbox only initialized on `.pk-gallery__item` images. All other images (subpages, attractions, location photos, about section) have NO lightbox capability. Client explicitly requested 4+ times that EVERY image must be enlargeable.

**Root cause:** `initLightbox()` used narrow selector `.pk-gallery__item` instead of scanning all content images.

**Fix (JS):**
```js
// Collect ALL content images, not just gallery items:
var allImgs = document.querySelectorAll(
  '.pk-section img, .pk-asym img, .pk-gallery img, ' +
  'body:not(.page-index) .main-content img, ' +
  'body:not(.page-index) .content-wrapper img, ' +
  'body:not(.page-index) .txt-content img, ' +
  '[class*="body_top"] img'
);
// Filter out icons (width < 40px), header/footer/modal/nav images
// Attach click handler to each qualifying image
```

**Fix (CSS):**
```css
.pk-section img, .pk-asym img,
body:not(.page-index) .main-content img {
  cursor: zoom-in !important;
}
/* Exclude: */
.pk-feature__icon img, header img, footer img,
.powered_by img, .pk-lightbox img { cursor: default !important; }
```

**Apply to:** EVERY new client. Lightbox must cover ALL page images, not just gallery.

**Severity:** HIGH — clients notice and report repeatedly.


---


## CRITICAL-VV: /contact Page — Multi-Location Leak

**Data:** 2026-04-15
**Klient:** Piekary 1-3 (Mentalis — 122+ objects, multiple locations)
**Problem:** System /contact page shows ALL Mentalis locations from panel (Jagiellończyka, Garbary, etc.), not just Piekary.

**Note:** /contact has NO body_top editor (TRAP D). Cannot inject HTML there.

**Fix (JS in body_bottom):**
```js
function initContactPageFilter(){
  if(!document.body.classList.contains('page-contact') &&
     window.location.pathname.indexOf('/contact') === -1) return;
  // Find all location blocks (divs, h3/h4 headings)
  // Check textContent for 'piekary' keyword
  // Hide any block that does NOT mention 'piekary'
}
```

**Apply to:** Any client with multi-location account where site must show only one location.

**Severity:** MEDIUM — affects /contact only, but looks unprofessional.


---
