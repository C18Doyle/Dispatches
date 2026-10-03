# Writing content for the Dispatches games

One page for adding nodes, choices, endings and campaigns without breaking something a check will catch later.
Rules marked (1914) come from that game's own non-negotiables in `Dispatches 1914/CLAUDE.md` and
`DISPATCHES_1918_DESIGN_SPEC.md`; the others are enforced by the shared checks. Voice and fact-checking notes are the
author's: the games' `HANDOVER.md` / spec files hold them, and this page only points at them.

## 1. Where the content lives
| Game | Edit | Never edit | Node style |
|---|---|---|---|
| Frankenstein | `src/content/frankenstein/{config,events,flavor}.json` | nothing generated | JSON, checked against `packages/engine/src/schema.ts` |
| 1914 | `src/30-campaign-ohl.jsx`, `31-campaign-gqg`, `32-campaign-stavka` | `dispatches-greatwar.jsx` (assembled) | `nodes: { id: {...} }` objects |
| 1922 | `src/parts/10-campaign-southrussia.jsx`, `11-siberia`, `12-bolsheviks`, `13-campaign-provisionalgov17` | `src/App.jsx` (assembled) | `resolveNode` with `case "id":` |
| 1941 | `src/parts/10-campaign-japan.jsx`, `11-campaign-alliedpacific.jsx` | `src/App.jsx` | getters inside `resolveNode` |
| 1940 | `src/parts/10-campaign-german.jsx` … `13-campaign-italy.jsx` | `src/App.jsx` | getters inside `resolveNode` |

1941 *Allied Pacific*: the 20 nodes that are plain data live in `src/data/alliedPacific.nodes.json` (a node's getter in the part is a one-line stub); edit those in the JSON and run `npm run build`. Details and what blocks moving the rest: `docs/DATA_MIGRATION.md`.

Never read a generated file whole (`.claude/settings.json` blocks it). Grep the `src/parts` files instead.

## 2. Anatomy of a node (campaign games)
A node has a `date`, `title`, `situation` (the briefing text) and `choices`. Each choice has:
- `label` (what the player sees) and usually an `advisor` (1914 uses `{ name, position }`, indirect speech, no quotation marks;
  1922, 1940 and 1941 use `{ name, quote }`).
- `impact` (meter changes) and `setFlags` (state later nodes read).
- A destination: `next`, and optionally `nextIf(meters, flags)` to divert on a meter or flag state.
- Optionally `uncertain`: roll outcomes, each with `weight` (all outcomes of one choice sum to 100), `title`, `outcome`, its own
  `impact`/`setFlags`, and optionally its own `next`. A roll outcome that names its own `next` goes there; otherwise the choice's `next`.
- `outcome` (text shown after choosing) and `historical: true` on the choice that matches what really happened.
- Optionally `gate(meters)` with a `disabledReason` shown while it is closed (1941/1940 express this as `disabledReason` alone).
Endings are nodes with `isEnding` (1914: `ending`) and an `epilogue`.

Frankenstein nodes are JSON: `id`, `branch`, `title`, `description`, `options[]` (label, detail, stamps, quote, outcome,
`nextNodeId`, optional `roll`, `gate`, `setFlags`, `axisDelta`, `requiresFlag`). The schema file is the contract.

## 3. Ids and flags
- 1914: node ids must match `campaign_19YY_NN_slug` (for example `ohl_1914_01_aufmarsch`); endings `campaign_end_slug`; flags are
  prefixed with the campaign (`ohl_`, `gqg_`, `stavka_`). `src/57-nodeids.jsx` holds the patterns.
- 1922, 1940, 1941: camelCase ids that end in a two-digit year (`kornilovsDeath18`, `elAlamein`); endings start with `ending`.
- A flag must have a reader. Check flag **values** by looking at where they are set; `flags.x === "guessed"` compiles and never fires.
- Never reuse an id for a different node, and when you rename one add it to `NODE_ALIASES` (docs/SAVES.md).
- No blanket find-and-replace across content (1914): ids are structured so a careless replace fails loudly; keep it that way.

## 4. Rules the checks and the games rely on
1. Exactly one `historical: true` choice per node (1914 enforces it; the shared check reports nodes with none or several).
2. Never leave every choice at a node gated off (softlock). The shared check fails on it.
3. Never gate the historical choice (1914): tighten the gate on a non-historical choice instead.
4. Gate thresholds come from measured distributions (`npm run monte-carlo` in 1922, `node montecarlo.js` in 1914), not intuition.
5. Settled outcomes are narrated, never rolled; every roll in 1914 carries a `dispute` field. No roll at the final junction before an ending: endings are decided by the player (1914).
6. Bulletins fire on **arrival**, before the decision (1914).
7. Do not add a field the UI does not render (check the render layer first).
8. Hard-mode endings: one forced ending per campaign (`hardMode.forcedEndingId` in 1914, `maxEndingId` in 1922); no ordinary path leads to it, and the orphan check knows that.
9. Real people: indirect speech for words that are not documented quotations (1914's deliberate departure). 1922/1940/1941
   put written-in-voice lines inside quotation marks attributed to named people; a fact-check exposure on games that badge their accuracy.

## 5. Adding a node, step by step
1. Write it in the campaign file. Point an existing choice's `next` at it, or the check will report it as an orphan.
2. List it: `NODE_ATLAS` entry (`{ id, date, title }`) in the registries (per campaign in 1922: next to `NODE_TOTAL`; global in
   1940/1941: `src/parts/20-registries-and-gallery.jsx`), and bump `NODE_TOTAL`. 1914 needs no list: its nodes are the list.
3. New ending: add it to `ENDINGS_GALLERY` and `ENDING_CLASSIFICATION` (historical / speculative / ...), and to the map-region table in
   the screens file where the game has one (1922: `30-screens.jsx`, the `endingX: "region"` table).
4. Run, in the game folder: `npm run build`, then `npm run check` (or `audit` in 1940), `npm run check:structure`,
   `npm run check:orphans`. They catch dangling `next`, softlocks, bad roll weights, unreachable nodes and endings, atlas drift.
5. `npm run verify:baseline`. A new node changes it only if the seeded runs reach it; if they do, read the diff, then
   `npm run baseline:accept` (docs/WORKFLOW.md).
6. `npm run smoke:browser` from the repo root for phone and desktop layout, then a line in the game's `CHANGELOG.md`.

## 6. Adding a campaign
Copy the nearest game's campaign part (1922 for modes and hard mode, 1940 for the battle subgame), give it a start node, atlas
and ending tables, register it in the campaign list and the select screen, add a case to `tests/ui.config.mjs` so the seeded
runs play it, add its split point to `split.config.json`, and record the baseline for it. `docs/NEW_GAME_CHECKLIST.md` has the
order that worked for a whole game.

## 7. Writing for a phone
The layout is a column of at most 600px, designed for phones first: a long unbroken paragraph is a wall of text on a 375px
screen. Keep the briefing readable in a few screens, put the decision up front where the story allows it, and avoid wide
tables or fixed-width art. Check the result in `tests/browser-shots/` after `npm run smoke:browser`.

## 8. Historical accuracy
Fact-check dates, names, titles and numbers against a source you can name before they go into a node, and keep the source
beside the node in a comment or in the game's `HANDOVER.md`. 1914 has a documented independent fact-check gate before any
campaign ships (see its CLAUDE.md). Mark counterfactual branches as speculative (`classification: "speculative"`) so the
endings gallery tells the player which is which.
