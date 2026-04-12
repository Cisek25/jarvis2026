/**
 * VILLA KAPITAŃSKA® — JS strony głównej v5
 * Wklej do: Panel IdoBooking → Ustawienia → Custom JS
 */

(function () {
  'use strict';

  const MAX_OFFERS = 10;

  /* ================================================================
     1. ANIMACJA GALEONÓW
     ================================================================ */
  var BOATS = [
    /* ═══ A — Wielki Galeon Admiralski, 3 maszty, 10 żagli z wydętymi płótnami ═══ */
    { w:280, h:170, speed:'veryslow',
      svg:'<svg width="280" height="170" viewBox="0 0 280 170" fill="none">' +
        '<path d="M22 108 Q10 102 14 94 L28 86 L220 86 Q234 90 244 102 L246 108 L232 122 L34 122Z" fill="#1B2A4A" stroke="#8B7355" stroke-width="1.2"/>' +
        '<path d="M36 88 Q30 82 36 76 L218 76 Q226 80 222 88" fill="#0F1A30" stroke="#8B7355" stroke-width=".9"/>' +
        '<path d="M218 76 L232 56 Q238 50 240 56 L246 102" fill="#162240" stroke="#C6922A" stroke-width="1"/>' +
        '<rect x="230" y="62" width="6" height="5" rx="1" fill="#4A7A9B" opacity=".6"/>' +
        '<rect x="230" y="72" width="6" height="5" rx="1" fill="#4A7A9B" opacity=".5"/>' +
        '<rect x="230" y="82" width="6" height="5" rx="1" fill="#4A7A9B" opacity=".4"/>' +
        '<line x1="228" y1="55" x2="240" y2="55" stroke="#C6922A" stroke-width="1.5"/>' +
        '<line x1="230" y1="55" x2="230" y2="51" stroke="#C6922A" stroke-width=".6"/>' +
        '<line x1="234" y1="55" x2="234" y2="51" stroke="#C6922A" stroke-width=".6"/>' +
        '<line x1="238" y1="55" x2="238" y2="51" stroke="#C6922A" stroke-width=".6"/>' +
        '<line x1="28" y1="86" x2="2" y2="52" stroke="#8B7355" stroke-width="2.2"/>' +
        '<path d="M2 52 L60 18 L28 86Z" fill="#FFF5E0" fill-opacity=".28" stroke="#C6922A" stroke-width=".6"/>' +
        '<line x1="75" y1="14" x2="75" y2="86" stroke="#8B7355" stroke-width="2.5"/>' +
        '<line x1="48" y1="20" x2="102" y2="20" stroke="#8B7355" stroke-width="1.4"/>' +
        '<line x1="45" y1="44" x2="105" y2="44" stroke="#8B7355" stroke-width="1.6"/>' +
        '<line x1="42" y1="66" x2="108" y2="66" stroke="#8B7355" stroke-width="1.6"/>' +
        '<path d="M50 20 L100 20 L102 38 Q75 48 48 38Z" fill="#FFF5E0" fill-opacity=".88" stroke="#C6922A" stroke-width=".8"/>' +
        '<path d="M47 44 L103 44 L106 62 Q75 74 44 62Z" fill="#FFF5E0" fill-opacity=".92" stroke="#C6922A" stroke-width=".9"/>' +
        '<path d="M44 66 L106 66 L110 83 Q75 96 40 83Z" fill="#FFF5E0" fill-opacity=".94" stroke="#C6922A" stroke-width="1"/>' +
        '<line x1="145" y1="6" x2="145" y2="86" stroke="#8B7355" stroke-width="3"/>' +
        '<rect x="139" y="24" width="12" height="3" rx=".5" fill="#8B7355"/>' +
        '<line x1="112" y1="12" x2="178" y2="12" stroke="#8B7355" stroke-width="1.4"/>' +
        '<line x1="110" y1="32" x2="180" y2="32" stroke="#8B7355" stroke-width="1.6"/>' +
        '<line x1="107" y1="52" x2="183" y2="52" stroke="#8B7355" stroke-width="1.8"/>' +
        '<line x1="105" y1="72" x2="185" y2="72" stroke="#8B7355" stroke-width="1.8"/>' +
        '<path d="M114 12 L176 12 L178 28 Q145 38 112 28Z" fill="#FFF5E0" fill-opacity=".85" stroke="#C6922A" stroke-width=".8"/>' +
        '<path d="M112 32 L178 32 L181 48 Q145 60 109 48Z" fill="#FFF5E0" fill-opacity=".9" stroke="#C6922A" stroke-width=".9"/>' +
        '<path d="M109 52 L181 52 L185 68 Q145 82 105 68Z" fill="#FFF5E0" fill-opacity=".93" stroke="#C6922A" stroke-width="1"/>' +
        '<path d="M107 72 L183 72 L187 85 Q145 98 103 85Z" fill="#FFF5E0" fill-opacity=".95" stroke="#C6922A" stroke-width="1"/>' +
        '<line x1="205" y1="24" x2="205" y2="80" stroke="#8B7355" stroke-width="2"/>' +
        '<line x1="185" y1="30" x2="225" y2="30" stroke="#8B7355" stroke-width="1.2"/>' +
        '<line x1="183" y1="52" x2="227" y2="52" stroke="#8B7355" stroke-width="1.4"/>' +
        '<path d="M187 30 L223 30 L225 46 Q205 56 185 46Z" fill="#FFF5E0" fill-opacity=".87" stroke="#C6922A" stroke-width=".8"/>' +
        '<path d="M185 52 L225 52 L228 68 Q205 78 182 68Z" fill="#FFF5E0" fill-opacity=".9" stroke="#C6922A" stroke-width=".8"/>' +
        '<line x1="2" y1="52" x2="75" y2="14" stroke="#8B7355" stroke-width=".5" opacity=".4"/>' +
        '<line x1="75" y1="14" x2="145" y2="6" stroke="#8B7355" stroke-width=".5" opacity=".35"/>' +
        '<line x1="145" y1="6" x2="205" y2="24" stroke="#8B7355" stroke-width=".5" opacity=".35"/>' +
        '<line x1="28" y1="86" x2="75" y2="14" stroke="#8B7355" stroke-width=".4" opacity=".25"/>' +
        '<line x1="220" y1="76" x2="205" y2="24" stroke="#8B7355" stroke-width=".4" opacity=".25"/>' +
        '<path d="M145 6 L155 0 L155 12Z" fill="#C6922A"/>' +
        '<path d="M75 14 L83 9 L83 19Z" fill="#C6922A" opacity=".85"/>' +
        '<path d="M205 24 L213 19 L213 29Z" fill="#C6922A" opacity=".75"/>' +
        '<rect x="55" y="80" width="5" height="3" rx=".5" fill="#0F1A30" stroke="#8B7355" stroke-width=".4"/>' +
        '<rect x="80" y="80" width="5" height="3" rx=".5" fill="#0F1A30" stroke="#8B7355" stroke-width=".4"/>' +
        '<rect x="105" y="80" width="5" height="3" rx=".5" fill="#0F1A30" stroke="#8B7355" stroke-width=".4"/>' +
        '<rect x="130" y="80" width="5" height="3" rx=".5" fill="#0F1A30" stroke="#8B7355" stroke-width=".4"/>' +
        '<rect x="155" y="80" width="5" height="3" rx=".5" fill="#0F1A30" stroke="#8B7355" stroke-width=".4"/>' +
        '<rect x="180" y="80" width="5" height="3" rx=".5" fill="#0F1A30" stroke="#8B7355" stroke-width=".4"/>' +
        '<path d="M14 118 C55 110 115 126 175 118 C225 110 255 120 272 118" stroke="#4A9ABF" stroke-width="1.5" fill="none"/>' +
        '<path d="M18 128 C55 122 110 134 170 128 C220 120 250 128 268 126" stroke="rgba(74,154,191,.35)" stroke-width="1" fill="none"/>' +
      '</svg>'
    },
    /* ═══ B — Galeon Wojenny, 3 maszty, 7 żagli ═══ */
    { w:210, h:130, speed:'slow',
      svg:'<svg width="210" height="130" viewBox="0 0 210 130" fill="none">' +
        '<path d="M18 84 Q8 78 12 72 L24 66 L168 66 Q180 68 188 78 L190 84 L178 96 L28 96Z" fill="#1B2A4A" stroke="#8B7355" stroke-width="1.1"/>' +
        '<path d="M30 68 Q24 62 30 58 L166 58 Q174 62 170 68" fill="#0F1A30" stroke="#8B7355" stroke-width=".8"/>' +
        '<path d="M166 58 L178 42 Q184 36 186 42 L190 78" fill="#162240" stroke="#C6922A" stroke-width=".9"/>' +
        '<rect x="178" y="48" width="5" height="4" rx="1" fill="#4A7A9B" opacity=".55"/>' +
        '<rect x="178" y="56" width="5" height="4" rx="1" fill="#4A7A9B" opacity=".45"/>' +
        '<line x1="174" y1="40" x2="186" y2="40" stroke="#C6922A" stroke-width="1.2"/>' +
        '<line x1="24" y1="66" x2="4" y2="40" stroke="#8B7355" stroke-width="2"/>' +
        '<path d="M4 40 L48 12 L24 66Z" fill="#FFF5E0" fill-opacity=".25" stroke="#C6922A" stroke-width=".5"/>' +
        '<line x1="58" y1="10" x2="58" y2="66" stroke="#8B7355" stroke-width="2.2"/>' +
        '<line x1="36" y1="16" x2="80" y2="16" stroke="#8B7355" stroke-width="1.3"/>' +
        '<line x1="34" y1="36" x2="82" y2="36" stroke="#8B7355" stroke-width="1.4"/>' +
        '<line x1="32" y1="54" x2="84" y2="54" stroke="#8B7355" stroke-width="1.4"/>' +
        '<path d="M38 16 L78 16 L80 32 Q58 42 36 32Z" fill="#FFF5E0" fill-opacity=".88" stroke="#C6922A" stroke-width=".8"/>' +
        '<path d="M36 36 L80 36 L83 52 Q58 64 33 52Z" fill="#FFF5E0" fill-opacity=".92" stroke="#C6922A" stroke-width=".9"/>' +
        '<line x1="112" y1="4" x2="112" y2="66" stroke="#8B7355" stroke-width="2.8"/>' +
        '<rect x="107" y="18" width="10" height="3" rx=".5" fill="#8B7355"/>' +
        '<line x1="85" y1="10" x2="139" y2="10" stroke="#8B7355" stroke-width="1.3"/>' +
        '<line x1="83" y1="28" x2="141" y2="28" stroke="#8B7355" stroke-width="1.5"/>' +
        '<line x1="81" y1="46" x2="143" y2="46" stroke="#8B7355" stroke-width="1.6"/>' +
        '<path d="M87 10 L137 10 L139 24 Q112 34 85 24Z" fill="#FFF5E0" fill-opacity=".86" stroke="#C6922A" stroke-width=".8"/>' +
        '<path d="M85 28 L139 28 L142 44 Q112 56 82 44Z" fill="#FFF5E0" fill-opacity=".92" stroke="#C6922A" stroke-width=".9"/>' +
        '<path d="M83 46 L141 46 L144 62 Q112 74 80 62Z" fill="#FFF5E0" fill-opacity=".95" stroke="#C6922A" stroke-width="1"/>' +
        '<line x1="158" y1="20" x2="158" y2="62" stroke="#8B7355" stroke-width="1.8"/>' +
        '<line x1="142" y1="26" x2="174" y2="26" stroke="#8B7355" stroke-width="1.1"/>' +
        '<line x1="140" y1="44" x2="176" y2="44" stroke="#8B7355" stroke-width="1.2"/>' +
        '<path d="M144 26 L172 26 L174 40 Q158 48 142 40Z" fill="#FFF5E0" fill-opacity=".87" stroke="#C6922A" stroke-width=".7"/>' +
        '<path d="M142 44 L174 44 L176 58 Q158 66 140 58Z" fill="#FFF5E0" fill-opacity=".9" stroke="#C6922A" stroke-width=".8"/>' +
        '<line x1="4" y1="40" x2="58" y2="10" stroke="#8B7355" stroke-width=".45" opacity=".35"/>' +
        '<line x1="58" y1="10" x2="112" y2="4" stroke="#8B7355" stroke-width=".45" opacity=".3"/>' +
        '<line x1="112" y1="4" x2="158" y2="20" stroke="#8B7355" stroke-width=".45" opacity=".3"/>' +
        '<path d="M112 4 L120 0 L120 8Z" fill="#C6922A"/>' +
        '<path d="M58 10 L64 6 L64 14Z" fill="#C6922A" opacity=".85"/>' +
        '<rect x="45" y="62" width="4" height="3" rx=".4" fill="#0F1A30" stroke="#8B7355" stroke-width=".3"/>' +
        '<rect x="65" y="62" width="4" height="3" rx=".4" fill="#0F1A30" stroke="#8B7355" stroke-width=".3"/>' +
        '<rect x="85" y="62" width="4" height="3" rx=".4" fill="#0F1A30" stroke="#8B7355" stroke-width=".3"/>' +
        '<rect x="105" y="62" width="4" height="3" rx=".4" fill="#0F1A30" stroke="#8B7355" stroke-width=".3"/>' +
        '<rect x="125" y="62" width="4" height="3" rx=".4" fill="#0F1A30" stroke="#8B7355" stroke-width=".3"/>' +
        '<rect x="145" y="62" width="4" height="3" rx=".4" fill="#0F1A30" stroke="#8B7355" stroke-width=".3"/>' +
        '<path d="M12 92 C45 84 90 100 140 92 C178 84 198 92 206 90" stroke="#4A9ABF" stroke-width="1.3" fill="none"/>' +
        '<path d="M15 100 C45 94 85 106 135 100 C175 92 195 98 204 96" stroke="rgba(74,154,191,.35)" stroke-width=".9" fill="none"/>' +
      '</svg>'
    },
    /* ═══ C — Galeon Handlowy, 3 maszty, 5 żagli ═══ */
    { w:160, h:100, speed:'normal',
      svg:'<svg width="160" height="100" viewBox="0 0 160 100" fill="none">' +
        '<path d="M14 66 Q6 60 10 54 L20 50 L128 50 Q138 52 146 60 L148 66 L136 76 L22 76Z" fill="#1B2A4A" stroke="#8B7355" stroke-width="1"/>' +
        '<path d="M24 52 Q18 46 24 42 L126 42 Q132 46 128 52" fill="#0F1A30" stroke="#8B7355" stroke-width=".7"/>' +
        '<path d="M126 42 L136 30 Q140 26 142 30 L148 60" fill="#162240" stroke="#C6922A" stroke-width=".8"/>' +
        '<rect x="136" y="36" width="4" height="3" rx=".8" fill="#4A7A9B" opacity=".5"/>' +
        '<line x1="20" y1="50" x2="4" y2="32" stroke="#8B7355" stroke-width="1.6"/>' +
        '<path d="M4 32 L38 10 L20 50Z" fill="#FFF5E0" fill-opacity=".22" stroke="#C6922A" stroke-width=".5"/>' +
        '<line x1="48" y1="10" x2="48" y2="50" stroke="#8B7355" stroke-width="2"/>' +
        '<line x1="30" y1="16" x2="66" y2="16" stroke="#8B7355" stroke-width="1.2"/>' +
        '<line x1="28" y1="34" x2="68" y2="34" stroke="#8B7355" stroke-width="1.3"/>' +
        '<path d="M32 16 L64 16 L66 30 Q48 40 30 30Z" fill="#FFF5E0" fill-opacity=".88" stroke="#C6922A" stroke-width=".7"/>' +
        '<path d="M30 34 L66 34 L69 48 Q48 58 27 48Z" fill="#FFF5E0" fill-opacity=".93" stroke="#C6922A" stroke-width=".8"/>' +
        '<line x1="88" y1="4" x2="88" y2="50" stroke="#8B7355" stroke-width="2.5"/>' +
        '<line x1="66" y1="10" x2="110" y2="10" stroke="#8B7355" stroke-width="1.3"/>' +
        '<line x1="64" y1="28" x2="112" y2="28" stroke="#8B7355" stroke-width="1.5"/>' +
        '<path d="M68 10 L108 10 L110 24 Q88 34 66 24Z" fill="#FFF5E0" fill-opacity=".86" stroke="#C6922A" stroke-width=".8"/>' +
        '<path d="M66 28 L110 28 L113 44 Q88 56 63 44Z" fill="#FFF5E0" fill-opacity=".93" stroke="#C6922A" stroke-width=".9"/>' +
        '<line x1="120" y1="16" x2="120" y2="46" stroke="#8B7355" stroke-width="1.6"/>' +
        '<line x1="106" y1="22" x2="134" y2="22" stroke="#8B7355" stroke-width="1"/>' +
        '<path d="M108 22 L132 22 L134 36 Q120 44 106 36Z" fill="#FFF5E0" fill-opacity=".87" stroke="#C6922A" stroke-width=".7"/>' +
        '<line x1="4" y1="32" x2="48" y2="10" stroke="#8B7355" stroke-width=".4" opacity=".35"/>' +
        '<line x1="48" y1="10" x2="88" y2="4" stroke="#8B7355" stroke-width=".4" opacity=".3"/>' +
        '<line x1="88" y1="4" x2="120" y2="16" stroke="#8B7355" stroke-width=".4" opacity=".3"/>' +
        '<path d="M88 4 L94 0 L94 8Z" fill="#C6922A"/>' +
        '<path d="M48 10 L53 7 L53 13Z" fill="#C6922A" opacity=".8"/>' +
        '<path d="M8 72 C35 64 70 80 110 72 C140 64 155 72 158 70" stroke="#4A9ABF" stroke-width="1.1" fill="none"/>' +
        '<path d="M10 80 C35 74 65 86 105 80 C135 72 152 78 156 76" stroke="rgba(74,154,191,.3)" stroke-width=".7" fill="none"/>' +
      '</svg>'
    },
    /* ═══ D — Karawela, 2 maszty, żagle łacińskie i prostokątne ═══ */
    { w:110, h:70, speed:'fast',
      svg:'<svg width="110" height="70" viewBox="0 0 110 70" fill="none">' +
        '<path d="M10 46 Q4 42 8 36 L18 32 L82 32 Q90 34 96 42 L98 46 L88 54 L16 54Z" fill="#1B2A4A" stroke="#8B7355" stroke-width=".9"/>' +
        '<path d="M18 34 Q14 30 18 28 L80 28 Q86 30 82 34" fill="#0F1A30" stroke="#8B7355" stroke-width=".6"/>' +
        '<path d="M80 28 L88 22 Q90 20 91 24 L96 42" fill="#162240" stroke="#C6922A" stroke-width=".6"/>' +
        '<line x1="18" y1="32" x2="4" y2="20" stroke="#8B7355" stroke-width="1.2"/>' +
        '<line x1="38" y1="6" x2="38" y2="32" stroke="#8B7355" stroke-width="1.6"/>' +
        '<line x1="22" y1="10" x2="54" y2="10" stroke="#8B7355" stroke-width="1"/>' +
        '<line x1="20" y1="22" x2="56" y2="22" stroke="#8B7355" stroke-width="1.1"/>' +
        '<path d="M24 10 L52 10 L54 20 Q38 28 22 20Z" fill="#FFF5E0" fill-opacity=".9" stroke="#C6922A" stroke-width=".7"/>' +
        '<path d="M22 22 L54 22 L56 30 Q38 38 20 30Z" fill="#FFF5E0" fill-opacity=".93" stroke="#C6922A" stroke-width=".7"/>' +
        '<line x1="70" y1="4" x2="70" y2="30" stroke="#8B7355" stroke-width="1.8"/>' +
        '<line x1="56" y1="8" x2="84" y2="8" stroke="#8B7355" stroke-width="1"/>' +
        '<line x1="54" y1="20" x2="86" y2="20" stroke="#8B7355" stroke-width="1.1"/>' +
        '<path d="M58 8 L82 8 L84 18 Q70 26 56 18Z" fill="#FFF5E0" fill-opacity=".88" stroke="#C6922A" stroke-width=".7"/>' +
        '<path d="M56 20 L84 20 L86 28 Q70 36 54 28Z" fill="#FFF5E0" fill-opacity=".93" stroke="#C6922A" stroke-width=".8"/>' +
        '<line x1="4" y1="20" x2="38" y2="6" stroke="#8B7355" stroke-width=".3" opacity=".35"/>' +
        '<line x1="38" y1="6" x2="70" y2="4" stroke="#8B7355" stroke-width=".3" opacity=".3"/>' +
        '<path d="M70 4 L74 1 L74 7Z" fill="#C6922A"/>' +
        '<path d="M6 50 C25 44 50 56 78 50 C92 46 102 50 108 48" stroke="#4A9ABF" stroke-width=".8" fill="none"/>' +
      '</svg>'
    },
    /* ═══ E — Daleki galeon, mały, uproszczona sylwetka ═══ */
    { w:70, h:44, speed:'fast',
      svg:'<svg width="70" height="44" viewBox="0 0 70 44" fill="none">' +
        '<path d="M6 28 Q3 26 6 23 L12 20 L52 20 Q57 21 62 26 L63 28 L57 34 L10 34Z" fill="#1B2A4A" stroke="#8B7355" stroke-width=".6"/>' +
        '<path d="M52 20 L56 16 Q58 15 59 17 L62 26" fill="#162240" stroke="#C6922A" stroke-width=".4"/>' +
        '<line x1="12" y1="20" x2="4" y2="14" stroke="#8B7355" stroke-width=".8"/>' +
        '<line x1="24" y1="5" x2="24" y2="20" stroke="#8B7355" stroke-width="1.2"/>' +
        '<line x1="15" y1="8" x2="33" y2="8" stroke="#8B7355" stroke-width=".8"/>' +
        '<path d="M17 8 L31 8 L32 16 Q24 20 16 16Z" fill="#FFF5E0" fill-opacity=".88" stroke="#C6922A" stroke-width=".5"/>' +
        '<line x1="44" y1="3" x2="44" y2="20" stroke="#8B7355" stroke-width="1.4"/>' +
        '<line x1="34" y1="6" x2="54" y2="6" stroke="#8B7355" stroke-width=".8"/>' +
        '<path d="M36 6 L52 6 L53 15 Q44 20 35 15Z" fill="#FFF5E0" fill-opacity=".9" stroke="#C6922A" stroke-width=".5"/>' +
        '<path d="M44 3 L47 1 L47 5Z" fill="#C6922A"/>' +
        '<path d="M4 32 C16 28 32 36 50 32 C60 28 66 32 68 30" stroke="#4A9ABF" stroke-width=".6" fill="none"/>' +
      '</svg>'
    }
  ];

  var SPEEDS = {
    veryslow: [60000, 95000],
    slow:     [45000, 70000],
    normal:   [32000, 52000],
    fast:     [22000, 38000]
  };
  var MAX_BOATS_PER_SECTION = 4;

  var BOAT_SECTIONS = [
    '.vk-about-location-strip',
    '.vk-hero',
    '[data-boats]'
  ];

  function rnd(a, b) { return Math.random() * (b - a) + a; }
  function rndInt(a, b) { return Math.floor(rnd(a, b + 1)); }

  function countBoats(section) {
    return section.querySelectorAll('[data-vk-boat]').length;
  }

  function spawnBoat(section) {
    if (countBoats(section) >= MAX_BOATS_PER_SECTION) return;
    var boat   = BOATS[rndInt(0, BOATS.length - 1)];
    var spd    = SPEEDS[boat.speed];
    var scale  = rnd(0.5, 1.3);
    var opac   = rnd(0.18, 0.55);
    var bottom = rnd(4, 55);
    var dur    = rnd(spd[0], spd[1]);
    var dist   = window.innerWidth + boat.w * scale + 60;
    var el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-vk-boat', '1');
    el.style.cssText =
      'position:absolute;bottom:' + bottom + 'px;' +
      'left:' + (-(boat.w * scale) - 24) + 'px;' +
      'opacity:' + opac + ';pointer-events:none;z-index:1;' +
      'transform-origin:left bottom;will-change:transform;';
    el.innerHTML = boat.svg;
    section.appendChild(el);
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / dur, 1);
      el.style.transform = 'scale(' + scale + ') translateX(' + (dist * t) + 'px)';
      if (t >= 1) {
        if (el.parentNode) el.parentNode.removeChild(el);
        /* respawn after long delay only if under limit */
        setTimeout(function () { spawnBoat(section); }, rnd(8000, 20000));
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initBoats() {
    BOAT_SECTIONS.forEach(function (sel) {
      var secs = document.querySelectorAll(sel);
      secs.forEach(function (sec) {
        var pos = window.getComputedStyle(sec).position;
        if (pos === 'static') sec.style.position = 'relative';
        sec.style.overflow = 'hidden';
        /* spawn 1-2 boats at start, rest come gradually */
        setTimeout(function () { spawnBoat(sec); }, rnd(500, 2000));
        setTimeout(function () { spawnBoat(sec); }, rnd(4000, 9000));
        /* recurring gentle spawner every 20-40s */
        setInterval(function () {
          if (Math.random() < 0.4) spawnBoat(sec);
        }, rnd(20000, 40000));
      });
    });
  }

  /* ================================================================
     2. SCROLL REVEAL — .vk-reveal → .vk-in
     ================================================================ */
  function initRevealObserver() {
    var els = document.querySelectorAll('.vk-reveal');
    if (!els.length) return;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('vk-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(function(el) { obs.observe(el); });
  }

  /* ================================================================
     3. SIATKA RYBACKA — fade-in przy scrollu
     ================================================================ */
  function initNetOverlays() {
    var nets = document.querySelectorAll('.vk-net-overlay');
    if (!nets.length) return;
    var netObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('vk-net-visible');
      });
    }, { threshold: 0.05 });
    nets.forEach(function(n) { netObs.observe(n); });
  }

  /* ================================================================
     4. KARUZELA POKOI — zastępuje Slick slider
     ================================================================ */
  function initHotspotSection() {
    /* na /offers karuzela niepotrzebna — obsługuje initOffersPage */
    if (document.body.classList.contains('page-offers')) return;
    var hotspotSection = document.querySelector('.cmshotspot');
    if (!hotspotSection) return;
    var offersContainer = hotspotSection.querySelector('.offerslist');
    if (!offersContainer) return;
    if (hotspotSection.querySelector('.vk-carousel-wrap')) return;

    var slickOffers = offersContainer.querySelectorAll('.slick-slide:not(.slick-cloned) .offer');
    var offers = slickOffers.length
      ? Array.from(slickOffers)
      : Array.from(offersContainer.querySelectorAll('.offer'));
    if (offers.length === 0) return;

    var seen = {};
    var uniqueOffers = [];
    offers.forEach(function(offer) {
      var data = extractOfferData(offer);
      if (data.link && !seen[data.link]) {
        seen[data.link] = true;
        uniqueOffers.push(data);
      }
    });
    if (MAX_OFFERS > 0 && uniqueOffers.length > MAX_OFFERS) {
      uniqueOffers = uniqueOffers.slice(0, MAX_OFFERS);
    }

    var carousel = buildCarousel(uniqueOffers);
    offersContainer.style.display = 'none';
    offersContainer.parentNode.insertBefore(carousel, offersContainer.nextSibling);

    hotspotSection.querySelectorAll('.slick-prev, .slick-next, [class*="slick-arrow"]').forEach(function(a) {
      a.style.display = 'none';
    });

    if (!hotspotSection.querySelector('.vk-hotspot-btn')) {
      var btnContainer = document.createElement('div');
      btnContainer.className = 'vk-hotspot-btn';
      btnContainer.innerHTML = '<a href="/offers">\u2693 WSZYSTKIE KAJUTY</a>';
      carousel.parentNode.insertBefore(btnContainer, carousel.nextSibling);
    }
  }

  function buildGrid(offers) {
    var grid = document.createElement('div');
    grid.className = 'vk-offers-grid';
    offers.forEach(function(data) {
      grid.appendChild(createOfferCard(data));
    });
    return grid;
  }

  function buildCarousel(uniqueOffers) {
    var wrap = document.createElement('div');
    wrap.className = 'vk-carousel-wrap';

    /* ── FLEX INNER: przycisk ← | track | przycisk → ── */
    var inner = document.createElement('div');
    inner.className = 'vk-carousel-inner';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'vk-carousel-btn vk-carousel-btn-prev';
    prevBtn.setAttribute('aria-label', 'Poprzedni');
    prevBtn.innerHTML = '&#8249;';

    var track = document.createElement('div');
    track.className = 'vk-carousel-track';
    uniqueOffers.forEach(function(data) {
      track.appendChild(createOfferCard(data));
    });

    var nextBtn = document.createElement('button');
    nextBtn.className = 'vk-carousel-btn vk-carousel-btn-next';
    nextBtn.setAttribute('aria-label', 'Nast\u0119pny');
    nextBtn.innerHTML = '&#8250;';

    inner.appendChild(prevBtn);
    inner.appendChild(track);
    inner.appendChild(nextBtn);
    wrap.appendChild(inner);

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'vk-carousel-dots';
    wrap.appendChild(dotsWrap);

    var currentPage = 0;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 600) return 1;
      if (w <= 900) return 2;
      return 3;
    }

    function buildDots() {
      var vis = getVisibleCount();
      var totalPg = Math.ceil(uniqueOffers.length / vis);
      dotsWrap.innerHTML = '';
      for (var i = 0; i < totalPg; i++) {
        var dot = document.createElement('button');
        dot.className = 'vk-carousel-dot' + (i === currentPage ? ' active' : '');
        dot.setAttribute('aria-label', 'Strona ' + (i + 1));
        (function(pi) {
          dot.addEventListener('click', function() { goToPage(pi); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function goToPage(page) {
      var vis = getVisibleCount();
      var totalPg = Math.ceil(uniqueOffers.length / vis);
      if (page < 0) page = totalPg - 1;
      if (page >= totalPg) page = 0;
      currentPage = page;
      var cardWidth = track.children[0] ? track.children[0].offsetWidth + 24 : 0;
      track.style.transform = 'translateX(-' + (currentPage * vis * cardWidth) + 'px)';
      var dots = dotsWrap.querySelectorAll('.vk-carousel-dot');
      dots.forEach(function(d, idx) {
        d.classList.toggle('active', idx === currentPage);
      });
    }

    buildDots();

    prevBtn.addEventListener('click', function() { goToPage(currentPage - 1); });
    nextBtn.addEventListener('click', function() { goToPage(currentPage + 1); });

    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToPage(currentPage + 1);
        else goToPage(currentPage - 1);
      }
    }, { passive: true });

    window.addEventListener('resize', function() {
      currentPage = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
    });

    return wrap;
  }

  function extractOfferData(offer) {
    var data = { title: '', link: '', image: '', area: '', persons: '', description: '', price: '', pricePrefix: 'cena od' };
    var titleLink = offer.querySelector('h3 a');
    if (titleLink) { data.title = titleLink.textContent.trim(); data.link = titleLink.href; }
    var img = offer.querySelector('.object-icon img');
    if (img) { data.image = img.getAttribute('data-src') || img.getAttribute('src') || ''; }
    var infoSpans = offer.querySelectorAll('.offer__info span');
    infoSpans.forEach(function(span) {
      var text = span.textContent.trim();
      if (text.includes('m\u00b2') || text.includes('m2') || (text.match(/\d+\s*m/) && !text.includes('z\u0142'))) { data.area = text; }
      else if (text.match(/\d/) && !text.includes('m') && !text.includes('z\u0142')) { data.persons = text; }
    });
    var desc = offer.querySelector('.offer__hover .offer__description');
    if (desc) { data.description = desc.textContent.trim(); }
    var priceEl = offer.querySelector('.offer__price .price');
    if (priceEl) { data.price = priceEl.textContent.trim(); }
    var priceSmall = offer.querySelector('.offer__price small');
    if (priceSmall) { data.pricePrefix = priceSmall.textContent.trim(); }
    return data;
  }

  function createOfferCard(data) {
    var card = document.createElement('div');
    card.className = 'vk-offer-card';
    var badgesHtml = '';
    if (data.area || data.persons) {
      badgesHtml = '<div class="vk-offer-badges">';
      if (data.area) badgesHtml += '<span class="vk-badge"><i class="fas fa-ruler-combined"></i> ' + data.area + '</span>';
      if (data.persons) badgesHtml += '<span class="vk-badge"><i class="fas fa-user"></i> ' + data.persons + '</span>';
      badgesHtml += '</div>';
    }
    var descHtml = data.description ? '<p class="vk-offer-desc">' + data.description + '</p>' : '';
    var priceHtml = data.price
      ? '<div class="vk-price-row">' +
          '<span class="vk-price-label">' + data.pricePrefix + '</span>' +
          '<span class="vk-price-value">' + data.price + '</span>' +
          '<span class="vk-price-suffix">/ noc</span>' +
        '</div>'
      : '';
    card.innerHTML =
      '<a href="' + data.link + '" class="vk-offer-image">' +
        '<img src="' + data.image + '" alt="' + data.title + '" loading="lazy">' +
        badgesHtml +
      '</a>' +
      '<div class="vk-offer-content">' +
        '<h3><a href="' + data.link + '">' + data.title + '</a></h3>' +
        descHtml +
        priceHtml +
        '<a href="' + data.link + '" class="vk-offer-btn">Szczeg\u00f3\u0142y</a>' +
      '</div>';
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      if (data.link) window.location.href = data.link;
    });
    return card;
  }

  /* ================================================================
     5. SMOOTH SCROLL
     ================================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ================================================================
     6. BACK TO TOP — kotwica (anchor icon)
     ================================================================ */
  (function() {
    var anchor = document.createElement('a');
    anchor.id = 'top';
    document.body.insertBefore(anchor, document.body.firstChild);
    var ANCHOR_SVG = '<svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="4" r="3" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<line x1="12" y1="7" x2="12" y2="26" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
      '<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M12 26 Q6 26 2 20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M12 26 Q18 26 22 20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M2 20 L0 17 L5 20Z" fill="currentColor"/>' +
      '<path d="M22 20 L24 17 L19 20Z" fill="currentColor"/>' +
    '</svg>';
    function fixBackTop() {
      var bt = document.getElementById('backTop');
      if (!bt) return false;
      bt.setAttribute('href', '#top');
      /* remove ALL existing child nodes and CMS classes that add icons */
      bt.innerHTML = '';
      bt.className = '';
      bt.innerHTML = ANCHOR_SVG;
      bt.style.cssText = 'display:flex !important;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:#1B2A4A;color:#E8D5A3;box-shadow:0 4px 16px rgba(27,42,74,.3);border:2px solid rgba(232,213,163,.3);transition:background .3s,transform .3s;position:fixed;bottom:24px;right:24px;z-index:9999;cursor:pointer;text-decoration:none;line-height:1;font-size:0;';
      bt.addEventListener('mouseenter', function() { bt.style.background = '#C6922A'; bt.style.transform = 'scale(1.1)'; });
      bt.addEventListener('mouseleave', function() { bt.style.background = '#1B2A4A'; bt.style.transform = 'scale(1)'; });
      bt.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return true;
    }
    if (!fixBackTop()) {
      var iv = setInterval(function() { if (fixBackTop()) clearInterval(iv); }, 200);
      setTimeout(function() { clearInterval(iv); }, 8000);
    }
  })();

  /* ================================================================
     7. PODSTRONA /OFFERS — przebudowa kart na styl wyróżnionych
     ================================================================ */
  function initOffersPage() {
    if (!document.body.classList.contains('page-offers')) return;

    var wrapper = document.querySelector('.offers_wrapper');
    if (!wrapper || wrapper.classList.contains('vk-offers-grid-ready')) return;

    /* ukryj karuzelę cmshotspot */
    var hotspot = document.querySelector('.cmshotspot');
    if (hotspot) hotspot.style.display = 'none';

    /* znajdź kontener kart (.row wewnątrz wrappera lub sam wrapper) */
    var row = wrapper.querySelector('.row');
    var gridParent = row || wrapper;
    gridParent.classList.add('vk-offers-page-grid');

    /* przetwórz każdą kartę */
    var offers = gridParent.querySelectorAll('.offer');
    offers.forEach(function(offer) {
      var imageLink = offer.querySelector('.object-icon');
      if (!imageLink) return;

      /* === Wyciągnij dane info (m², osoby) === */
      var infoEl = offer.querySelector('.offer__info');
      var area = '', persons = '';
      if (infoEl) {
        var metersSpan = infoEl.querySelector('.accommodation-meters');
        var personsSpan = infoEl.querySelector('.accommodation-roomspace');
        if (metersSpan) {
          area = metersSpan.textContent.trim().replace(/m2/gi, 'm\u00b2');
        }
        if (personsSpan) {
          persons = personsSpan.textContent.trim();
        }
      }

      /* === Dodaj badges na zdjęcie === */
      if (area || persons) {
        var badges = document.createElement('div');
        badges.className = 'vk-offer-page-badges';
        if (area) {
          badges.innerHTML += '<span class="vk-offer-page-badge">' +
            '<i class="icon-resize-full"></i> ' + area + '</span>';
        }
        if (persons) {
          badges.innerHTML += '<span class="vk-offer-page-badge">' +
            '<i class="icon-user"></i> ' + persons + '</span>';
        }
        imageLink.appendChild(badges);
      }

      /* === Przenieś opis pod tytuł === */
      var descEl = offer.querySelector('.offer__hover .offer__description');
      if (descEl && descEl.textContent.trim()) {
        var descP = document.createElement('p');
        descP.className = 'vk-offer-page-desc';
        descP.textContent = descEl.textContent.trim();
        var h2 = offer.querySelector('h2');
        if (h2) {
          h2.parentNode.insertBefore(descP, h2.nextSibling);
        }
      }

      offer.classList.add('vk-offers-processed');
    });

    wrapper.classList.add('vk-offers-grid-ready');
  }

  /* ================================================================
     8. UKRYJ PARALLAX na stronach z własnym hero (fallback dla :has)
     ================================================================ */
  function hideSystemParallax() {
    var hasCustomHero = document.querySelector('.vk-galeria-hero') ||
                        document.querySelector('.vka-hero');
    if (!hasCustomHero) return;
    var parallax = document.querySelector('.section.parallax');
    if (parallax) parallax.style.display = 'none';
  }

  /* ================================================================
     9. FIX HERO ® — zmień plain ® na delikatny sup + Cormorant Garamond
     ================================================================ */
  function fixHeroRegistered() {
    var h1 = document.querySelector('.section.parallax h1');
    if (!h1) return;
    var b = h1.querySelector('b');
    var target = b || h1;
    var text = target.textContent;
    if (text.indexOf('®') === -1) return;
    var name = text.replace('®', '');
    target.innerHTML = '<span style="font-family:\'Cormorant Garamond\',serif;font-weight:700;letter-spacing:0.03em;">' +
      name + '</span><sup style="font-size:0.45em;font-weight:400;vertical-align:super;opacity:0.72;letter-spacing:0;">®</sup>';
  }

  /* ================================================================
     10. PARTICLES — iskierki/gwiazdki na ciemnych (navy) sekcjach
     ================================================================ */
  function initParticles() {
    var navySections = [];
    /* Szukaj sekcji z ciemnym/granatowym tłem */
    function isDarkSection(el) {
      var cs = getComputedStyle(el);
      /* Sprawdź background-color (z alpha > 0) */
      var bg = cs.backgroundColor;
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (m) {
        var r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
        var a = m[4] !== undefined ? parseFloat(m[4]) : 1;
        if (a > 0.3 && r < 60 && g < 70 && b < 120) return true;
      }
      /* Sprawdź background-image na gradient z ciemnymi kolorami */
      var bgImg = cs.backgroundImage;
      if (bgImg && bgImg.indexOf('linear-gradient') !== -1) {
        var colors = bgImg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g);
        if (colors && colors.length > 0) {
          var darkCount = 0;
          colors.forEach(function(c) {
            var cm = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
            if (cm && parseInt(cm[1]) < 60 && parseInt(cm[2]) < 70 && parseInt(cm[3]) < 120) darkCount++;
          });
          if (darkCount >= colors.length / 2) return true;
        }
      }
      return false;
    }
    /* Sprawdź sekcje najwyższego poziomu */
    document.querySelectorAll('.cmshotspot, .vk-fullwidth, .vk-about-location-strip, [class*="navy"], [class*="dark"]').forEach(function(el) {
      if (el.offsetHeight > 200 && el.offsetWidth > 200 && isDarkSection(el)) {
        /* Nie dodawaj dzieci sekcji już dodanych */
        var dominated = false;
        navySections.forEach(function(s) { if (s.contains(el) && s !== el) dominated = true; });
        if (!dominated) navySections.push(el);
      }
    });

    navySections.forEach(function(section) {
      if (section.querySelector('.vk-particles')) return;
      section.style.position = section.style.position || 'relative';
      section.style.overflow = 'hidden';
      var canvas = document.createElement('canvas');
      canvas.className = 'vk-particles';
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.6;';
      section.insertBefore(canvas, section.firstChild);

      var ctx = canvas.getContext('2d');
      var particles = [];
      var count = Math.min(40, Math.floor(section.offsetWidth * section.offsetHeight / 25000));

      function resize() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
      }
      resize();

      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          dx: (Math.random() - 0.5) * 0.3,
          dy: -Math.random() * 0.25 - 0.05,
          alpha: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2
        });
      }

      var rafId;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) {
          p.x += p.dx;
          p.y += p.dy;
          p.pulse += 0.015;
          var a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(198,146,42,' + a + ')';
          ctx.fill();
          /* glow */
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(198,146,42,' + (a * 0.15) + ')';
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }

      /* Uruchom tylko gdy sekcja jest widoczna */
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { resize(); animate(); }
          else { cancelAnimationFrame(rafId); }
        });
      }, { threshold: 0.05 });
      obs.observe(section);
    });
  }

  /* ── 18+ ADULTS ONLY NOTE (homepage only) ────────────── */
  function initAdultsNote() {
    if (!document.body.classList.contains('page-index')) return;
    var search = document.querySelector('.iai-search');
    if (!search) return;
    var note = document.createElement('p');
    note.className = 'vk-adults-note';
    note.textContent = 'Tylko dla os\u00F3b doros\u0142ych (18+)';
    search.parentNode.insertBefore(note, search.nextSibling);
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  function vkInit() {
    hideSystemParallax();
    fixHeroRegistered();
    initAdultsNote();
    setTimeout(initHotspotSection, 800);
    initOffersPage();
    initRevealObserver();
    initNetOverlays();
    initSmoothScroll();
    initBoats();
    setTimeout(initParticles, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', vkInit);
  } else {
    vkInit();
  }

})();
