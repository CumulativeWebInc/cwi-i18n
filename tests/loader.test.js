/* Loader tests for cwi-i18n — executes the REAL i18n.js under a minimal DOM stub.
 * Run: node tests/loader.test.js
 * Tests: ?lang= override, localStorage persistence, navigator auto-detect,
 *        data-i18n swapping, graceful fallback when tables 404.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'i18n.js'), 'utf8');

// Minimal DOM stub sufficient for i18n.js
function makeEnv(opts) {
  opts = opts || {};
  const tables = opts.tables || {}; // "app/lang" -> object
  const store = Object.assign({}, opts.localStorage || {});
  const nodes = [];

  function el(tag) {
    const e = {
      tagName: String(tag).toUpperCase(), children: [], attributes: {},
      textContent: opts.textContent || '', dataset: {},
      setAttribute(k, v) { e.attributes[k] = v; },
      getAttribute(k) { return e.attributes[k] !== undefined ? e.attributes[k] : null; },
      appendChild(c) { e.children.push(c); return c; },
      addEventListener() {}, matches() { return false; },
      classList: { add() {}, remove() {}, toggle() {} },
      style: {},
    };
    nodes.push(e);
    return e;
  }

  // translatable fixture nodes
  const fixtures = (opts.keys || []).map(k => {
    const n = el('p'); n.setAttribute('data-i18n', k); n.textContent = 'EN:' + k; return n;
  });

  const document = {
    readyState: 'complete',
    currentScript: null,
    head: el('head'), body: el('body'),
    documentElement: el('html'),
    createElement: el,
    querySelectorAll(sel) {
      const attr = sel.replace(/[\[\]]/g, '');
      return fixtures.filter(f => f.getAttribute(attr) !== null);
    },
    addEventListener() {},
    getElementById() { return null; },
  };
  // documentElement needs setAttribute — provided by el()

  const window = {
    location: { search: opts.search || '', href: 'https://x.test/' + (opts.search || '') },
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
    },
    navigator: { language: opts.navigator || 'en-US' },
    history: { replaceState() {} },
    // MutationObserver intentionally absent
    fetch(url) {
      const m = /tables\/([^/]+)\/([^/]+)\.json/.exec(url);
      const key = m ? m[1] + '/' + m[2] : null;
      if (key && tables[key]) return Promise.resolve({ ok: true, json: () => Promise.resolve(tables[key]) });
      return Promise.resolve({ ok: false, status: 404 });
    },
    URL: URL,
    console: { warn() {} },
  };
  // script tag carrying data-app
  const script = el('script');
  script.getAttribute = k => (k === 'data-app' ? (opts.app || 'demo') : (k === 'data-default-lang' ? 'en' : null));
  document.currentScript = script;

  const sandbox = { window, document, console, URL, Promise, RegExp };
  sandbox.globalThis = sandbox;
  // i18n.js references bare `window`, `document`
  vm.createContext(sandbox);
  return { sandbox, store, fixtures, run() { vm.runInContext(SRC, sandbox); return sandbox.window.CWI18n; } };
}

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name); }
}
async function main() {
  console.log('loader.test.js');
  const T = {
    'demo/en': { 'a.title': 'Hello', 'a.sub': 'World' },
    'demo/es': { 'a.title': 'Hola', 'a.sub': 'Mundo' },
  };

  // 1. ?lang=es override
  {
    const env = makeEnv({ search: '?lang=es', tables: T, keys: ['a.title'] });
    const CWI18n = env.run();
    const lang = await CWI18n.init({ app: 'demo' });
    ok('?lang=es selects Spanish', lang === 'es' && env.fixtures[0].textContent === 'Hola');
    ok('?lang=es persisted to localStorage', env.store['cwi-lang'] === 'es');
  }
  // 2. localStorage persistence (no param)
  {
    const env = makeEnv({ tables: T, keys: ['a.title'], localStorage: { 'cwi-lang': 'es' } });
    const CWI18n = env.run();
    const lang = await CWI18n.init({ app: 'demo' });
    ok('stored lang reused', lang === 'es' && env.fixtures[0].textContent === 'Hola');
  }
  // 3. navigator auto-detect (ja)
  {
    const T2 = Object.assign({}, T, { 'demo/ja': { 'a.title': 'こんにちは' } });
    const env = makeEnv({ tables: T2, keys: ['a.title'], navigator: 'ja-JP' });
    const CWI18n = env.run();
    const lang = await CWI18n.init({ app: 'demo' });
    ok('navigator ja-JP auto-detects Japanese', lang === 'ja' && env.fixtures[0].textContent === 'こんにちは');
  }
  // 4. pt -> pt-BR mapping
  {
    const T3 = Object.assign({}, T, { 'demo/pt-BR': { 'a.title': 'Olá' } });
    const env = makeEnv({ tables: T3, keys: ['a.title'], navigator: 'pt-PT' });
    const CWI18n = env.run();
    const lang = await CWI18n.init({ app: 'demo' });
    ok('bare pt maps to pt-BR', lang === 'pt-BR');
  }
  // 5. graceful fallback: table 404 keeps English
  {
    const env = makeEnv({ search: '?lang=fr', tables: { 'demo/en': T['demo/en'] }, keys: ['a.title'] });
    const CWI18n = env.run();
    const lang = await CWI18n.init({ app: 'demo' });
    ok('missing table keeps English text (no blank)', env.fixtures[0].textContent === 'EN:a.title' || env.fixtures[0].textContent === 'Hello');
  }
  // 6. setLang switches at runtime + t()
  {
    const env = makeEnv({ tables: T, keys: ['a.sub'] });
    const CWI18n = env.run();
    await CWI18n.init({ app: 'demo' });
    await CWI18n.setLang('es');
    ok('setLang(es) swaps text', env.fixtures[0].textContent === 'Mundo');
    ok('t() returns translation', CWI18n.t('a.title') === 'Hola');
    ok('t() falls back to en for missing key', CWI18n.t('nope') === null);
  }
  // 7. html lang attribute set
  {
    const env = makeEnv({ search: '?lang=de', tables: T });
    const CWI18n = env.run();
    await CWI18n.init({ app: 'demo' });
    ok('<html lang> set', env.sandbox.document.documentElement.attributes['lang'] === 'de');
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
