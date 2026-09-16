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
