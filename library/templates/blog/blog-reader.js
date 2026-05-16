/* ============================================================
   JARVIS BLOG MODULE — Reader & Renderer
   ============================================================

   Cel: JS module ktory:
   - Na stronie-LIST: pobiera manifest JSON, renderuje karty,
     obsluguje filtry per kategoria.
   - Na stronie-POST: dodaje Schema.org BlogPosting markup,
     ladowanie related posts z manifestu.

   Wykrywanie strony: szuka markeru <div data-blog-list> lub
   <div data-blog-post="slug-name"> w DOM.

   Uzycie:
   1. Znajdz/zamien {PREFIX} (np. fr)
   2. Wklej do FR_KONIEC_BODY.html wewnatrz IIFE (przed boot)
   3. Dodaj wywolanie initBlog() w boot()
   4. Hostuj manifest.json pod {origin}/customStyles/default13/custom2/blog-manifest.json
      (lub innym statycznym URL dostepnym dla klienta)
   5. Klient stworzy podstrony /pl/txt/300 (lista) + /pl/txt/301... (posty)
   ============================================================ */

  function initBlog() {
    var listEl = document.querySelector('[data-blog-list]');
    var postEl = document.querySelector('[data-blog-post]');

    if (!listEl && !postEl) return; // not a blog page

    // Resolve manifest URL — same path as page or absolute config
    var manifestUrl = (listEl || postEl).getAttribute('data-manifest-url')
                      || '/customStyles/default13/custom2/blog-manifest.json';

    // Resolve current language from URL
    var lang = 'pl';
    var pathMatch = location.pathname.match(/^\/(pl|en|de)\b/);
    if (pathMatch) lang = pathMatch[1];

    fetch(manifestUrl, { cache: 'no-cache' })
      .then(function(r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function(manifest) {
        if (listEl) renderBlogList(listEl, manifest, lang);
        if (postEl) enhanceBlogPost(postEl, manifest, lang);
      })
      .catch(function(err) {
        if (listEl) {
          listEl.innerHTML = '<div class="{PREFIX}-blog-empty">Nie udalo sie zaladowac wpisow. Sprobuj ponownie pozniej.</div>';
        }
        // Silent fail on post page — Schema.org enhancement only
        if (window.console && console.warn) console.warn('Blog manifest load failed:', err);
      });
  }

  /* ------------------------------------------------------------
     renderBlogList — bierze container + manifest, generuje filtry
     i karty. Reaguje na klikanie filtrow.
     ------------------------------------------------------------ */

  function renderBlogList(container, manifest, lang) {
    var posts = (manifest.posts || []).filter(function(p) {
      return (p.lang || 'pl') === lang && p.published !== false;
    });

    // Sort by date desc (newest first)
    posts.sort(function(a, b) {
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    });

    // Discover unique categories
    var cats = {};
    posts.forEach(function(p) {
      if (p.category) cats[p.category] = (manifest.categories || {})[p.category] || p.category;
    });

    // Build filter chips
    var filterBar = container.querySelector('[data-blog-filters]');
    if (filterBar) {
      var filterHtml = '<button type="button" class="{PREFIX}-blog-filter is-active" data-category="all">'
                        + (manifest.labels && manifest.labels.all_filter || 'Wszystkie') + '</button>';
      Object.keys(cats).forEach(function(key) {
        filterHtml += '<button type="button" class="{PREFIX}-blog-filter" data-category="' + escapeHtml(key) + '">'
                        + escapeHtml(cats[key]) + '</button>';
      });
      filterBar.innerHTML = filterHtml;
    }

    // Render grid
    var grid = container.querySelector('[data-blog-grid]');
    if (!grid) return;

    function renderGrid(filter) {
      var filtered = (filter === 'all')
        ? posts
        : posts.filter(function(p) { return p.category === filter; });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="{PREFIX}-blog-empty">'
                       + (manifest.labels && manifest.labels.empty || 'Brak wpisow w tej kategorii.')
                       + '</div>';
        return;
      }

      grid.innerHTML = filtered.map(function(p) {
        var categoryLabel = (manifest.categories || {})[p.category] || p.category || '';
        return '<a class="{PREFIX}-blog-card" href="' + escapeAttr(p.url) + '">'
          + '<div class="{PREFIX}-blog-card__media">'
            + (p.featuredImage
                ? '<img class="{PREFIX}-blog-card__img" src="' + escapeAttr(p.featuredImage) + '" alt="' + escapeAttr(p.title) + '" loading="lazy" decoding="async" width="800" height="500">'
                : '')
            + (categoryLabel ? '<span class="{PREFIX}-blog-card__category">' + escapeHtml(categoryLabel) + '</span>' : '')
          + '</div>'
          + '<div class="{PREFIX}-blog-card__body">'
            + '<h2 class="{PREFIX}-blog-card__title">' + escapeHtml(p.title || '') + '</h2>'
            + '<p class="{PREFIX}-blog-card__excerpt">' + escapeHtml(p.excerpt || '') + '</p>'
            + '<div class="{PREFIX}-blog-card__meta">'
              + '<span class="{PREFIX}-blog-card__date">' + formatDate(p.publishedAt, lang) + '</span>'
              + (p.readTime ? '<span class="{PREFIX}-blog-card__read-time">' + escapeHtml(p.readTime) + '</span>' : '')
            + '</div>'
          + '</div>'
        + '</a>';
      }).join('');
    }

    // Initial render — all posts
    renderGrid('all');

    // Wire up filter clicks
    if (filterBar) {
      filterBar.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-category]');
        if (!btn) return;
        filterBar.querySelectorAll('[data-category]').forEach(function(b) {
          b.classList.toggle('is-active', b === btn);
        });
        renderGrid(btn.getAttribute('data-category'));
      });
    }
  }

  /* ------------------------------------------------------------
     enhanceBlogPost — szuka biezacego posta w manifescie,
     wstrzykuje Schema.org JSON-LD + renderuje related posts.
     ------------------------------------------------------------ */

  function enhanceBlogPost(postEl, manifest, lang) {
    var slug = postEl.getAttribute('data-blog-post');
    if (!slug) return;

    var post = (manifest.posts || []).find(function(p) {
      return p.slug === slug && (p.lang || 'pl') === lang;
    });
    if (!post) return;

    // 1. Schema.org BlogPosting JSON-LD
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt,
      'image': post.featuredImage,
      'datePublished': post.publishedAt,
      'dateModified': post.updatedAt || post.publishedAt,
      'author': {
        '@type': 'Person',
        'name': post.author || manifest.defaultAuthor || ''
      },
      'publisher': {
        '@type': 'Organization',
        'name': manifest.brand || '',
        'logo': manifest.brandLogo ? {
          '@type': 'ImageObject',
          'url': manifest.brandLogo
        } : undefined
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': location.origin + location.pathname
      }
    };
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // 2. Related posts (same category, exclude current)
    var relatedContainer = document.querySelector('[data-blog-related]');
    if (relatedContainer && post.category) {
      var related = (manifest.posts || [])
        .filter(function(p) {
          return p.slug !== slug
              && p.category === post.category
              && (p.lang || 'pl') === lang
              && p.published !== false;
        })
        .slice(0, 3);

      if (related.length === 0) {
        relatedContainer.style.display = 'none';
        return;
      }

      var html = related.map(function(p) {
        var categoryLabel = (manifest.categories || {})[p.category] || p.category || '';
        return '<a class="{PREFIX}-blog-card" href="' + escapeAttr(p.url) + '">'
          + '<div class="{PREFIX}-blog-card__media">'
            + (p.featuredImage
                ? '<img class="{PREFIX}-blog-card__img" src="' + escapeAttr(p.featuredImage) + '" alt="' + escapeAttr(p.title) + '" loading="lazy" decoding="async" width="800" height="500">'
                : '')
            + (categoryLabel ? '<span class="{PREFIX}-blog-card__category">' + escapeHtml(categoryLabel) + '</span>' : '')
          + '</div>'
          + '<div class="{PREFIX}-blog-card__body">'
            + '<h3 class="{PREFIX}-blog-card__title">' + escapeHtml(p.title || '') + '</h3>'
            + '<p class="{PREFIX}-blog-card__excerpt">' + escapeHtml(p.excerpt || '') + '</p>'
            + '<div class="{PREFIX}-blog-card__meta">'
              + '<span class="{PREFIX}-blog-card__date">' + formatDate(p.publishedAt, lang) + '</span>'
            + '</div>'
          + '</div>'
        + '</a>';
      }).join('');

      var grid = relatedContainer.querySelector('[data-blog-related-grid]');
      if (grid) grid.innerHTML = html;
    }
  }

  /* ─── Helpers ─── */

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso, lang) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      var locales = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE' };
      return d.toLocaleDateString(locales[lang] || 'pl-PL', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }
