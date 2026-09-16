#!/usr/bin/env python3
"""Key-coverage test for cwi-i18n retrofits.
Usage: check.py --src <dir-with-html-js> --tables <dir-with-<lang>.json> [--langs en,es,pt-BR,fr,de,ja]
Extracts data-i18n* keys from *.html and CWI18n.t("...") calls from *.js,
then asserts every key exists in every language table. Exit 1 on any miss.
"""
import argparse, json, os, re, sys

HTML_ATTRS = ['data-i18n', 'data-i18n-ph', 'data-i18n-title', 'data-i18n-aria']
T_CALL = re.compile(r"""CWI18n\.t\(\s*["']([^"']+)["']\s*\)""")

def extract(src):
    keys = set()
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            if f.endswith('.html'):
                s = open(p, encoding='utf-8', errors='replace').read()
                for a in HTML_ATTRS:
                    keys.update(re.findall(re.escape(a) + r'\s*=\s*["\']([^"\']+)["\']', s))
            elif f.endswith('.js') and 'i18n' not in f:
                s = open(p, encoding='utf-8', errors='replace').read()
                keys.update(T_CALL.findall(s))
    return keys

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--tables', required=True)
    ap.add_argument('--langs', default='en,es,pt-BR,fr,de,ja')
    a = ap.parse_args()
    langs = a.langs.split(',')
    keys = extract(a.src)
    print(f'found {len(keys)} i18n keys in {a.src}')
    tables = {}
    for l in langs:
        p = os.path.join(a.tables, l + '.json')
        if not os.path.exists(p):
            print(f'FAIL missing table: {p}'); return 1
        tables[l] = json.load(open(p, encoding='utf-8'))
    fails = 0
    for k in sorted(keys):
        for l in langs:
            v = tables[l].get(k)
            if not isinstance(v, str) or not v.strip():
                print(f'FAIL key "{k}" missing/empty in {l}.json'); fails += 1
    # en-first rule: en.json must not contain keys absent from source
    extra = set(tables['en']) - keys
    if extra:
        print(f'WARN {len(extra)} en keys not found in source (dead keys): {sorted(extra)[:8]}')
    if fails:
        print(f'{fails} missing translations'); return 1
    print(f'OK: {len(keys)} keys x {len(langs)} languages all present')
    return 0

if __name__ == '__main__':
    sys.exit(main())
