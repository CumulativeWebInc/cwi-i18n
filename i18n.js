/* CWI i18n loader v1.0 — zero-dependency internationalization for CWI web properties.
 *
 * Integration (one line):
 *   <script src="https://cumulativewebinc.github.io/cwi-i18n/i18n.js" data-app="<app-id>"></script>
 *
 * Convention:
 *   - Static text:  <p data-i18n="hero.tagline">English fallback text</p>
 *   - Attributes:   data-i18n-ph="search.placeholder"   (placeholder)
 *                   data-i18n-title="card.title_attr"    (title)
 *                   data-i18n-aria="nav.menu_label"      (aria-label)
 *   - Dynamic JS:   CWI18n.t("key")  — returns translated string or null
 *                   CWI18n.apply()    — re-scan DOM after dynamic renders
 *
 * Language resolution (first match wins):
 *   1. ?lang=xx query parameter (also persisted)
 *   2. localStorage "cwi-lang" (set by the switcher)
 *   3. navigator.language on first visit (mapped to the nearest supported code)
 *   4. data-default-lang on the script tag, else "en"
 *
 * Tables live at https://cumulativewebinc.github.io/cwi-i18n/tables/<app>/<lang>.json
 * If a table fetch fails, the page keeps its in-DOM English text — never blanks.
 * License: MIT. (c) Cumulative Web Inc.
 */
(function () {
  'use strict';

  var TABLES_BASE = 'https://cumulativewebinc.github.io/cwi-i18n/tables';
  var STORE_KEY = 'cwi-lang';
  var SUPPORTED = ['en', 'es', 'pt-BR', 'fr', 'de', 'ja'];
  var NATIVE = {
    'en': 'English',
    'es': 'Español',
    'pt-BR': 'Português (BR)',
    'fr': 'Français',
    'de': 'Deutsch',
    'ja': '日本語'
  };

  function normalize(code) {
    if (!code) return null;
    code = String(code).replace('_', '-');
    var low = code.toLowerCase();
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (SUPPORTED[i].toLowerCase() === low) return SUPPORTED[i];
    }
    var base = low.split('-')[0];
    // Map bare language prefixes to the closest supported variant.
    var prefixMap = { en: 'en', es: 'es', pt: 'pt-BR', fr: 'fr', de: 'de', ja: 'ja' };
    return prefixMap[base] || null;
  }

  function queryLang() {
    try {
      var m = new RegExp('[?&]lang=([^&]*)').exec(window.location.search);
      return m ? normalize(decodeURIComponent(m[1])) : null;
    } catch (e) { return null; }
  }

  function storedLang() {
    try { return normalize(window.localStorage.getItem(STORE_KEY)); }
    catch (e) { return null; }
  }

  function browserLang() {
    try { return normalize(window.navigator.language || window.navigator.userLanguage); }
    catch (e) { return null; }
  }

  function fetchTable(app, lang) {
    var url = TABLES_BASE + '/' + encodeURIComponent(app) + '/' + encodeURIComponent(lang) + '.json';
    return window.fetch(url, { cache: 'default' }).then(function (r) {
      if (!r.ok) throw new Error('i18n table HTTP ' + r.status);
      return r.json();
    });
  }

  var state = { app: null, lang: 'en', table: {}, fallback: {}, ready: false, queue: [] };

  function t(key) {
    if (Object.prototype.hasOwnProperty.call(state.table, key)) return state.table[key];
    if (Object.prototype.hasOwnProperty.call(state.fallback, key)) return state.fallback[key];
    return null;
  }

  function setAttr(el, attr, value) {
    if (value === null || value === undefined) return;
    if (attr === 'text') el.textContent = value;
    else el.setAttribute(attr, value);
  }

  function applyTo(root) {
    var scope = root || document;
    var jobs = [
      ['data-i18n', 'text'],
      ['data-i18n-ph', 'placeholder'],
      ['data-i18n-title', 'title'],
      ['data-i18n-aria', 'aria-label']
    ];
    jobs.forEach(function (job) {
      var sel = '[' + job[0] + ']';
      var nodes = scope.querySelectorAll ? scope.querySelectorAll(sel) : [];
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.__cwi18n === state.lang + ':' + job[0]) continue;
        var v = t(el.getAttribute(job[0]));
        if (v !== null) { setAttr(el, job[1], v); el.__cwi18n = state.lang + ':' + job[0]; }
      }
    });
  }

  function apply() { applyTo(document); }

  function renderSwitcher() {
    if (document.getElementById('cwi-lang-btn')) {
      var lbl = document.getElementById('cwi-lang-code');
      if (lbl) lbl.textContent = state.lang.toUpperCase().replace('PT-BR', 'PT');
      return;
    }
    var css = '#cwi-lang-btn{position:fixed;right:14px;bottom:14px;z-index:2147483647;' +
      'width:46px;height:46px;border-radius:50%;border:1px solid #3a3a3a;background:#111;' +
      'color:#f5c518;font:700 12px/1 system-ui,sans-serif;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.5)}' +
      '#cwi-lang-btn:active{transform:scale(.94)}' +
      '#cwi-lang-menu{position:fixed;right:14px;bottom:68px;z-index:2147483647;background:#161616;' +
      'border:1px solid #3a3a3a;border-radius:12px;padding:6px;min-width:170px;' +
      'box-shadow:0 8px 28px rgba(0,0,0,.6);display:none}' +
      '#cwi-lang-menu.open{display:block}' +
      '#cwi-lang-menu button{display:flex;width:100%;gap:10px;align-items:center;background:none;border:0;' +
      'color:#eee;font:500 14px/1.4 system-ui,sans-serif;padding:10px 12px;border-radius:8px;cursor:pointer;text-align:left}' +
      '#cwi-lang-menu button:hover{background:#262626}' +
      '#cwi-lang-menu button[aria-current="true"]{color:#f5c518;font-weight:700}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.id = 'cwi-lang-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Language / Idioma / Langue / Sprache / 言語');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>' +
      '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
      '&nbsp;<span id="cwi-lang-code">' + state.lang.toUpperCase().replace('PT-BR', 'PT') + '</span>';
    var menu = document.createElement('div');
    menu.id = 'cwi-lang-menu';
    menu.setAttribute('role', 'menu');
    SUPPORTED.forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'menuitemradio');
      b.setAttribute('aria-current', code === state.lang ? 'true' : 'false');
      b.dataset.lang = code;
      b.textContent = NATIVE[code];
      b.addEventListener('click', function () { setLang(code, { persist: true, syncUrl: true }); closeMenu(); });
      menu.appendChild(b);
    });
    function closeMenu() { menu.classList.remove('open'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); menu.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== btn) closeMenu();
    });
    document.body.appendChild(btn);
    document.body.appendChild(menu);
  }

  function setLang(lang, opts) {
    opts = opts || {};
    lang = normalize(lang) || 'en';
    var jobs = [fetchTable(state.app, 'en').catch(function () { return {}; })];
    if (lang !== 'en') jobs.push(fetchTable(state.app, lang).catch(function () { return {}; }));
    return Promise.all(jobs).then(function (res) {
      state.fallback = res[0] || {};
      state.table = res[1] || {};
      state.lang = lang;
      document.documentElement.setAttribute('lang', lang);
      if (opts.persist !== false) {
        try { window.localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      }
      if (opts.syncUrl) {
        try {
          var u = new URL(window.location.href);
          u.searchParams.set('lang', lang);
          window.history.replaceState(null, '', u.toString());
        } catch (e) {}
      }
      apply();
      renderSwitcher();
      // Refresh aria-current states in the menu.
      var menu = document.getElementById('cwi-lang-menu');
      if (menu) {
        for (var i = 0; i < menu.children.length; i++) {
          menu.children[i].setAttribute('aria-current',
            menu.children[i].dataset.lang === lang ? 'true' : 'false');
        }
      }
      return lang;
    });
  }

  function getLang() { return state.lang; }

  function observe() {
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n && n.nodeType === 1) applyTo(n.nodeType === 1 && n.matches && n.matches('[data-i18n],[data-i18n-ph],[data-i18n-title],[data-i18n-aria]') ? n.parentNode || document : n);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init(opts) {
    opts = opts || {};
    state.app = opts.app || (document.currentScript && document.currentScript.getAttribute('data-app'));
    if (!state.app) { if (window.console) console.warn('[cwi-i18n] no app id: add data-app="<app>" to the script tag'); return Promise.resolve('en'); }
    var def = normalize(opts.defaultLang) || 'en';
    var lang = queryLang() || storedLang() || browserLang() || def;
    if (queryLang()) { try { window.localStorage.setItem(STORE_KEY, lang); } catch (e) {} }
    return setLang(lang, { persist: false }).then(function (l) {
      state.ready = true;
      renderSwitcher();
      observe();
      state.queue.forEach(function (fn) { try { fn(l); } catch (e) {} });
      state.queue = [];
      return l;
    });
  }

  window.CWI18n = {
    init: init, t: t, apply: apply, setLang: setLang, getLang: getLang,
    supported: SUPPORTED.slice(),
    nativeName: function (c) { return NATIVE[c] || c; },
    ready: function (fn) { if (state.ready) fn(state.lang); else state.queue.push(fn); }
  };

  // Auto-init when loaded with data-app on the script tag.
  function auto() {
    var s = document.currentScript;
    if (s && s.getAttribute('data-app')) {
      init({ app: s.getAttribute('data-app'), defaultLang: s.getAttribute('data-default-lang') || 'en' });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
  else auto();
})();
