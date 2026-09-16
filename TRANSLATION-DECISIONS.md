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
