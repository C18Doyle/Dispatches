# Dispatches Frankenstein changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- **Shortages change the odds of the experiments.** Below -4, a resource takes 2.5 points off the odds of every experiment that is about it for each point of shortage, up to 12; the option and the experiment screen say so ("Strain: Secrecy is short, so the odds are 7 points worse"). (A mechanics change: the behaviour baseline was re-recorded with `npm run record:baseline`.)
- **Twelve more choices are experiments** (twenty in all): the executioner's scaffold, the dean's clerk, the acid, the gravedigger, the stairwell wiring (and its easier twin), the spine rivets, the raw steam, the public proofs, the mountain relocation (and its easier twin) and the companion in seclusion. Each can fail in its own way, and the failure leaves something behind.
- **Eleven things now carry forward**: a witness, a debt, a flaw in the harness, a ruined cellar. Later scenes say so in italics under the description (`echoes`).
- **The difficulties have names** (The Apprentice, The Natural Philosopher, The Debtor) and their descriptions are content. On The Debtor, five more options are offered only to a man in debt (a moneylender's loan and its repayment, a patent share, a glazier, a toll-keeper) and three scenes remark on the purse.
- **Three new endings**, each behind an option that opens only to what you have been to the creature (the locks say what they need, and the hidden Voice and Bond are not named): The Companion (the Alchemical climax), The Word (the Galvanic climax) and The Witness (the Prometheus climax). 15 endings in all.
### Fixed
- **The three meters were unreadable on the scene screen.** The figures were parchment on a parchment card (invisible) and the labels brass on parchment (about 2.9:1). They are now ink, the figure turns red in a crisis, and each meter has a name and a value for a screen reader.
- **Every screen has a level-1 heading, and a new screen or scene puts focus on its heading** (it was left on the page body, so a screen reader announced nothing); the page returns to the top. The game is inside a main landmark, the settings and how-to-play screens are dialogs, the icons are hidden from a screen reader, and the how-to-play sections are level 2.
- Two palette tokens that failed contrast on the parchment cards were adjusted (blood-bright 4.43:1 to 4.92:1, verdigris-bright 3.34:1 to 4.56:1); the experiment badge and the endings counter use colours that pass.
### Added
- `npm run check:balance` (a cautious player collapses in under 20% of runs; none of three policies may reach only one ending) and `npm run record:baseline`. The graph validator now searches every difficulty with axes tracked, proves every `requires` option is unlockable and every `showWhen` option is shown, and remembers the states it has searched.
- **A UI baseline**: 24 seeded headless playthroughs (eight a difficulty) through the real screens, including Fritz's panel and the timed experiment (`npm run verify:ui`, `npm run ui:accept`), and `npm run check-a11y` (names, ids, heading levels, focus, meters, palette contrast). Both are in `npm test`.
- Saved runs now carry `schemaVersion`; `NODE_ALIASES` and `SAVE_MIGRATIONS` in `src/runSave.ts` let an update upgrade old saves (docs/SAVES.md). Saves written before this have no version and still load.
- Save-compatibility test (npm run test:saves): committed old saves must still resume and reach an ending.
### Changed
- Resume-save parsing moved to src/runSave.ts (same rules as before; no player-visible change).

## 1.0.0 (migration baseline)
- Content moved to JSON (src/content/frankenstein/) on the shared pure engine. 240 recorded runs (7917 steps) replay identically to the pre-migration engine. Save key frankenstein_run_save_v2 unchanged.
