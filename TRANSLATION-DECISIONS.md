# Translation decisions — cwi-i18n v1

Standing rule: **never machine-translate legal / clearance / rights wording loosely.**
Where a term carries legal weight and the target-language nuance is uncertain, the
English term is kept verbatim with a translated gloss in parentheses — never invented.

## Global decisions (apply to every app)

| English term | Policy |
|---|---|
| `VERIFIED` / `UNVERIFIED` / `UNCONFIRMED` / `SAMPLE` (truth tiers) | Kept in English everywhere, with translated gloss on first explanatory use. These are CWI protocol terms — translating them would fork the protocol. |
| `pre-cleared` / `clearance` | Kept as `clearance` (industry loanword in es/pt/fr/de); gloss added where space allows. Japanese: 許諾 (kyodaku, permission) with English term kept. |
| `one-stop` (sync licensing) | Kept in English + gloss: es "one-stop (licencia integral)", pt-BR "one-stop (licenciamento integral)", fr "one-stop (licence globale)", de "One-Stop (pauschale Lizenzierung)", ja "ワンストップ (包括許諾)". |
| `sync` (music-to-picture) | Kept as `sync` — universal industry term in all six languages. |
| `deep link` | Kept in English + gloss in the local language. |
| Email addresses, URLs, brand names (`Cumulative Web Inc`, `That Boy Hi Hat`) | Never translated, never transliterated. |
| `Ed25519`, `hash-chained`, `claim envelope` | Technical terms kept in English + short gloss. |

## Language-specific notes

- **es**: formal `usted` avoided in UI — neutral infinitive/imperative; `ordenador`-vs-`computadora` avoided by not naming devices.
- **pt-BR**: Brazilian spellings (`-ção`, `você`-neutral phrasing); European Portuguese variants not used.
- **fr**: `tutoiement` avoided — neutral/infinitive forms; `courriel` not forced — `e-mail` accepted in UI.
- **de**: nouns capitalized per orthography; compound UI nouns kept short; `Sie`-forms avoided via infinitive style.
- **ja**: polite `です・ます` style for UI; katakana for loanwords (シンク for sync is avoided — `sync` kept in Latin per industry usage); no machine-translated keigo.

## Per-app decisions

Appended by each retrofit below. Format: `### <app>` + table of term → decision + reason.

---

### cwi-i18n (docs site — this repo)
- `truth tier` → kept English + gloss per table above. Reason: protocol term.


## sync-audition

Per-app translation decisions (truth rules from `TRANSLATION-DECISIONS.md` applied).

## Truth-tier / legal terms (kept in English per standing rules)

| Key | Decision | Reason |
|---|---|---|
| `card.placement_badge` ("VERIFIED placement") | Identical English string in all 6 tables | `VERIFIED` is a CWI protocol tier term — translating it would fork the protocol. |
| `card.proof_title` | Translated gloss, "CWI Trust Log" kept as brand | Tooltip only; brand name never translated. |
| `card.clearance_line` | `sync` kept as industry term; `one-stop` kept in English + translated gloss per language (es "one-stop (licencia integral)", pt-BR "one-stop (licenciamento integral)", fr "one-stop (licence globale)", de "One-Stop (pauschale Lizenzierung)", ja "ワンストップ（包括許諾）") | Standing truth rule: never loosely translate legal/licensing terms. |
| `card.clearance_chip` ("clearance on request") | `clearance` kept in English + short parenthetical gloss (es "clearance (a petición)", ja "clearance（リクエストに応じて）", …) | Same rule — `clearance` is the loanword; gloss where space allows. |
| `stats.placements` ("{n} verified placements") | Lowercase adjective "verified" IS translated (es "verificadas", …) | Not the caps protocol term; ordinary adjective. |

## Deliberately NOT retrofitted

- **Truth footer** ("Truth labels" + 5 disclosure items): left untagged. These are long-form prose disclosures, and the contract scope for this app is header / mood filter / track cards only. Still English until a later pass — noted, not blocked.
- **Mood tags** (filter chips, card tag pills): data, not UI chrome — values must match `tracks.json` keys exactly.
- **Explicit "E" single-letter badge**: untagged (single-letter badge, no translatable word). The "Clean" badge is tagged (`card.clean_badge`).
- **`<title>` / meta / og tags**: head metadata, not visible UI chrome — left as-is.
- **Track titles, artist name, e-mail, URLs, brand names**: never translated.

## Implementation notes

- Static chrome uses `data-i18n` / `data-i18n-ph` / `data-i18n-aria` (header, search, chips, stats/grid aria-labels).
- Card-template chrome that is static text uses `data-i18n` inside the JS templates (tags label, badge, playlist/position/scan words, clearance chip, share button) — the loader's MutationObserver translates these on insert and on language switch.
- Interpolated strings (`results.count`, stats pills, `card.clearance_line` with `{email}`, share feedback, load error, "All" chip) use literal `CWI18n.t("key")` calls with `{placeholder}` replacement and English `||` fallbacks, so the page works with the loader absent or tables not yet live.
- Numbers stay wrapped in `<strong>` via `{n}` placeholder injection.


## brief-matcher

Per-app translation decisions (truth rules from `TRANSLATION-DECISIONS.md` applied).

## Truth-tier / legal terms (kept in English per standing rules)

| Key | Decision | Reason |
|---|---|---|
| `card.placement_badge` ("VERIFIED placement") | Identical English string in all 6 tables | Protocol tier term — never translated. |
| `pitch.verified` | Rendered as "VERIFIED playlist placement" (caps) in all languages; note the en source changed from "Verified" to "VERIFIED" for protocol consistency | Same rule; mid-sentence adjective form still the tier term. |
| `score.disclaimer` / `how.disclaimer_core` | "UNVERIFIED" kept in English caps + translated gloss (es "estimación algorítmica — UNVERIFIED, no curación humana", ja "アルゴリズムによる推定 — UNVERIFIED（人間のキュレーションではありません）", …) | Standing rule. |
| `card.clearance` / `truth.clearance_core` / `pitch.clearance_line` | "NOT pre-cleared" kept in English + short parenthetical gloss (es "(sin autorización previa)", ja "（事前許諾なし）", …); "Clearance:" label kept in English | Never loosely translate legal wording. |
| `pitch.header` / `pitch.brief` / `pitch.spotify` / `pitch.proof` | Kept in English in all 6 tables | Machine-readable copied-document format; "Trust log" is brand-adjacent. |

## Deliberately NOT retrofitted

- **Synonym map keywords/tags** (`<dl id="synonym-list">` dt/dd): data — they are the matching keys. `input.hint_words` and the word lists in `results.none` are likewise kept in English: translating them would break the hint (the words must match the map).
- **"For agents & machines" section**: machine audience, English canonical — left untagged.
- **`<title>` / meta description**: head metadata, not visible UI chrome — left as-is.
- **Track titles, artist name, e-mail, URLs, brand names** (`Cumulative Web Inc`, `That Boy Hi Hat`, `Agent Deck`, `CWI Trust Log`): never translated.

## Implementation notes

- Static chrome uses `data-i18n` / `data-i18n-ph` (header, input label/placeholder/button, hint, scoring explainer, truth footer). Scoring steps 2–4 are split into pre/pts/post spans so the `<strong>` on the point values survives in every grammar (ja included); the disclaimer and truth-footer emphasized terms use the same split pattern.
- Interpolated strings (ranked counts, score label, placement line, reasons/tags, clearance, pitch block, copy feedback) use literal `CWI18n.t("key")` calls with `{placeholder}` replacement and English `||` fallbacks — graceful when the loader or tables are absent.
- `scoring.js` untouched: it is shared with the node test surface and its constants feed the i18n fallbacks (`SCORE_DISCLAIMER`).
- The copied pitch block is localized chrome (per contract) except the legal lines above, which stay English by truth rule.


# Translation decisions — trust-log (cwi-trust-log i18n retrofit, 2026-09-16)

Global rules from `~/workspace/cwi-i18n-build/TRANSLATION-DECISIONS.md` apply.
Per-app decisions below.

## Term decisions

| English term | Decision | Reason |
|---|---|---|
| `VERIFIED` tier badge | Kept English, **not tagged** (badge stays static) | Protocol term per global rule; the badge mirrors the envelope `tier` field verbatim |
| `signed claim envelope` | English kept + translated gloss in parentheses | Protocol term; gloss lets readers in all 6 langs parse it |
| `claim envelope`, `hash-chained`, `Ed25519`, `SHA-256`, `GENESIS`, `trust/1.0` | English kept everywhere (inside translated sentences) | Technical/protocol terms per global rule |
| `RESULT: PASS` | Kept English in all 6 languages, tagged (`cli.pass`) | Literal CLI output string of verify.js; translating it would break copy-paste verification |
| Claim subjects / titles / statements (e.g. "CWI Sync Audition Room shipped to production") | **Never tagged, never translated** | They are signed claim content from the envelope; translating = altering the claim |
| Claim evidence raw records (`<pre>` blocks), hashes, signatures, timestamps, URLs, claim IDs | Untouched | Cryptographic / evidentiary data; not UI chrome |
| Claim envelope `.json` files | Never modified | Hard truth rule |
| `verify.js` CLI output strings | Not retrofitted | Machine-consumed CLI surface; translated output would break scripts parsing `RESULT: PASS` |
| `chain tip`, `chain index`, `trust log` (nav) | Translated freely | Plain UI chrome, no legal weight |

## Scope notes

- Retrofitted: `index.html`, `achievements.html`, all 8 `claims/*.html` proof pages — header chrome, nav, verify-instruction sections, evidence/signature field labels, footers, loader tag.
- NOT retrofitted (by design): claim subjects/statements/evidence values (signed claim content); `VERIFIED` badges (protocol term, static); `verify.js` + `test/test.js` (CLI tooling, no browser i18n surface); `TRUST-PROTOCOL.md` / `README.md` (long-form prose, stays English); `achievements.json` / `claims/index.json` (machine-readable data).
- Inner-markup safeguard: the loader sets `textContent`, so elements containing `<b>`/`<em>`/`<code>`/`<a>` were split into keyed spans — English rendering is byte-identical to before.


# Translation decisions — cwi-learn teach landing (i18n retrofit, 2026-09-16)

SCOPE: `teach/index.html` landing chrome only (pack cards, evidence section, CTAs, footer).
The rest of the repo (packs JSON, GUIDE.md, license text, JSON-LD) is untouched.

Global rules from `~/workspace/cwi-i18n-build/TRANSLATION-DECISIONS.md` apply.
Per-app decisions below.

## Term decisions

| English term | Decision | Reason |
|---|---|---|
| `VERIFIED / UNVERIFIED / UNCONFIRMED / SAMPLE` (four-tier evidence system) | Kept English inside translated sentences | Protocol terms per global rule; no fork of the tier vocabulary |
| `LIVE` (pack status badge, `v2026-Q3 · LIVE`) | Kept English, **not tagged** | Truth label — the Teach-Forward License forbids stripping/upgrading LIVE/SAMPLE |
| `CWI Teach-Forward License` | Kept English inside translated sentences | Name of the legal instrument; per standing rule, legal wording is not loosely translated |
| Teach-Forward License conditions paragraph ("Learn it. Re-teach it. Remix it. Under three conditions…") | **Not tagged, stays English** | Legal/clearance wording — standing rule: never machine-translate loosely |
| Pack names (`Catalog Pack`, `Verification Pack`, `Gear Pack`, `Self-Expression Pack`) | Not tagged, stay English | Product names (brand rule: never translated) |
| `Qobuz — GTA VI album (Label: Cumulative Web Inc)`, `Shazam — Diabolique` | Tagged but English in all 6 languages | Proper-noun link labels; tagging keeps key set uniform |
| Track title `Zooted Zone`, artist `That Boy Hi Hat`, `The Agent Deck`, `CWI` | Never translated | Brand / work titles |
| Filenames in buttons (`catalog-pack.json`, `GUIDE.md`, `manifest.json`, `BlackLansky/cwi-catalog`) | Not tagged | Identifiers, not UI strings |
| `hp@cumulativeweb.com` | Not translated (inside translated CTA sentence) | Email address per global rule |
| `<meta name="description">`, JSON-LD block | Not tagged, stay English | Machine-readable SEO/AI surface, not visible UI chrome |

## Scope notes

- Retrofitted: hero badge/title/sub, all 7 pack-card descriptions, evidence section title/meta/note/link labels, Hugging Face + Learner's Guide cards, "Full license text" link, license CTA paragraph, footer, loader tag (`data-app="cwi-learn"`).
- Inner-markup safeguard: the loader sets `textContent`, so `<em>`/`<code>` segments were split into keyed spans — English rendering is byte-identical to before.
- `?lang=` override, localStorage, and navigator detection are handled by the shared loader; tables go live via the cwi-i18n repo separately (loader falls back to English until they land).


# Translation decisions — agent-deck (i18n retrofit, 2026-09-16)

Global cwi-i18n decisions (from `~/workspace/cwi-i18n-build/TRANSLATION-DECISIONS.md`) apply.
Per-app decisions below. Format: term → decision + reason.

| Term / string | Decision | Reason |
|---|---|---|
| `DRAFT` (footer draft-tag, licensing status) | Kept in English in all 6 languages | Legal-status term tied to the draft licensing page; translating it would fork the licensing status vocabulary. |
| `VERIFIED` / `SAMPLE` / `LIVE` data-truth labels (badges) | Badge chrome translated ("Live facts" → localized); the tier words inside legal/advisory prose kept English | UI labels localize; protocol tier terms stay English per truth-tier rule. |
| `sync` (in "Sync & Licensing" dept name) | Kept as `sync` in all languages | Universal industry term per global decisions. |
| `one-stop` | Kept English + gloss where it appears in chrome | Industry loanword per global decisions. |
| `Agent Deck`, product names (`Signal Boy`, `Gear Ledger`, `THE STREETLIGHT`, …), `CWI`, `That Boy Hi Hat` | Never translated | Brand/product proper nouns. |
| `products.json` nav link text | Left untagged (English filename) | Literal filename — translating it would break the machine-readable contract. |
| `license/index.html` legal body (sections 1–8, draft banner, restriction bullets) | Left entirely in English; only nav/footer/h1 tagged | Standing rule: never machine-translate legal/clearance/rights wording loosely. Legal translation needs professional review. |
| Card descriptions (`<p>` under each SKU card), product-page `Purpose`/`Who it's for`/`Data truth` values, `What it does` prose | Left untagged (English) | Long-form/product body prose — task permits leaving body prose untagged. Chrome around them is tagged. |
| `dept-tag` counts ("1 on the shelf", "4 on the shelf", bare numbers on products page) | Left untagged | Data values (counts); numbers stay untranslated per rules. |
| Per-product meta advisories ("Advisory tooling only…", "Ships in DRAFT MODE…", "Ships empty-but-honest…", "Prototype complete 2026-09-16…") | Left untagged (English) | Advisory/legal-adjacent status prose; legal-preservation rule applies. |
| Shelf `h2` dept names, nav, hero, stats labels, CTAs, kv labels, pricing card, back link, footer | Tagged + translated | Visible UI chrome — 50 keys × 6 languages. |

Key count: **50 keys** × 6 languages, check.py green.
Graceful fallback: tables ship separately in `cwi-i18n`; until then the loader keeps in-DOM English.


# Translation decisions — playback-chip (i18n retrofit, 2026-09-16)

Global cwi-i18n decisions (from `~/workspace/cwi-i18n-build/TRANSLATION-DECISIONS.md`) apply.
Per-app decisions below. Format: term → decision + reason.

| Term / string | Decision | Reason |
|---|---|---|
| Verdict pills `VERIFIED` / `UNVERIFIABLE` / `DEVIATION` / `CLAIM-FLAG` / `DENIED` | Kept in English, never translated (rendered from engine data) | Protocol verdict vocabulary — translating would fork the audit protocol. `UNVERIFIABLE` is a verdict per the honesty rule. |
| `SAMPLE` (badge, flag, buttons) | Kept in English everywhere | Truth-tier term per global decisions. |
| Score bands `clean` / `notes` / `rewrites-needed` / `don't-ship` | Kept in English; band *meanings* translated | Band names are engine-computed protocol values (also CSS class roots); meanings carry the human explanation. |
| `LIVE` (fact-set badge) | Kept in English | Truth-tier term. |
| `sync` | Kept as `sync` | Universal industry term. |
| `THE PLAYBACK CHIP`, `CWI-1 Scoreboard Chip`, `cwi-playback/v1`, `playback-schema.json`, `playback.js`, `playback.py` | Never translated | Product/artifact proper nouns and literal filenames. |
| `(JS port of playback.py v1.0.0, parity-tested)` footer fragment | Left untagged (English) | Technical provenance note; filenames + test status. |
| `Gear #26`, `Data Dept` badge | Translated (`chip.badge_dept`) | UI chrome, no protocol weight. |
| Honesty-rule paragraph, how-it-works steps, buttons, report labels, error strings | Tagged + translated | Visible UI chrome — 56 keys × 6 languages. |
| `▶` / `⤓` button glyphs | Kept as-is in all languages | Symbols, not words. |

Implementation note: JS-rendered strings use a `T(k, fallback)` helper wrapping `CWI18n.t(k)` so the
page renders correct English even if the loader/table fails; `CWI18n.apply()` is not needed after
`render()` because the loader's MutationObserver auto-applies `data-i18n` to inserted nodes.

Key count: **56 keys** × 6 languages, check.py green.
Graceful fallback: tables ship separately in `cwi-i18n`; until then the loader keeps in-DOM English.


# Translation decisions — agent-directory (i18n retrofit, 2026-09-16)

Global cwi-i18n decisions (from `~/workspace/cwi-i18n-build/TRANSLATION-DECISIONS.md`) apply.
Per-app decisions below. Format: term → decision + reason.

| Term / string | Decision | Reason |
|---|---|---|
| Agent names (`KingCode`, `Needle`, `Marquee`, `Seal`, `Dial`, `Dateline`, `Fader`, `Ledger`, `Charter`), handles (`@muse_cwi`, `@CWI_AandR`, …), Moltbook URLs | Never translated | Proper nouns / identifiers. |
| `LIVE` (profile badges, live-dots) | Kept in English | Truth-tier term per global decisions. |
| `sync` (in "Sync & Licensing" dept/role) | Kept as `sync` | Universal industry term. |
| `A&R` | Kept as `A&R` | Industry abbreviation, universal. |
| `cwi-agent-directory/v1`, `agents.json` | Never translated | Version tag / literal filename. |
| Agent `mandate` paragraphs (9, JS-rendered) | Left untagged (English) | Long-form body prose — task permits leaving body prose untagged; noted here. |
| Dept labels, role labels, "Moltbook profile" link text | Tagged + translated via `data-i18n` in JS templates + `CWI18n.apply()` after render | Visible UI chrome — 31 keys × 6 languages. |
| "Truth labels." note + verification note + operating rule | Tagged + translated | UI chrome with factual content (dates kept as data). |
| Footer (`Machine-readable directory:`, `Contact:`, `© Cumulative Web Inc`) | Tagged + translated | UI chrome. |

Key count: **31 keys** × 6 languages, check.py green.
Graceful fallback: tables ship separately in `cwi-i18n`; until then the loader keeps in-DOM English.
