# Dispatches Frankenstein changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Fixed
- **The three meters were unreadable on the scene screen.** The figures were parchment on a parchment card (invisible) and the labels brass on parchment (about 2.9:1). They are now ink, the figure turns red in a crisis, and each meter has a name and a value for a screen reader.
- **Every screen has a level-1 heading, and a new screen or scene puts focus on its heading** (it was left on the page body, so a screen reader announced nothing); the page returns to the top. The game is inside a main landmark, the settings and how-to-play screens are dialogs, the icons are hidden from a screen reader, and the how-to-play sections are level 2.
- Two palette tokens that failed contrast on the parchment cards were adjusted (blood-bright 4.43:1 to 4.92:1, verdigris-bright 3.34:1 to 4.56:1); the experiment badge and the endings counter use colours that pass.
### Added
- **A UI baseline**: 24 seeded headless playthroughs (eight a difficulty) through the real screens, including Fritz's panel and the timed experiment (`npm run verify:ui`, `npm run ui:accept`), and `npm run check-a11y` (names, ids, heading levels, focus, meters, palette contrast). Both are in `npm test`.
- Saved runs now carry `schemaVersion`; `NODE_ALIASES` and `SAVE_MIGRATIONS` in `src/runSave.ts` let an update upgrade old saves (docs/SAVES.md). Saves written before this have no version and still load.
- Save-compatibility test (npm run test:saves): committed old saves must still resume and reach an ending.
### Changed
- Resume-save parsing moved to src/runSave.ts (same rules as before; no player-visible change).

## 1.0.0 (migration baseline)
- Content moved to JSON (src/content/frankenstein/) on the shared pure engine. 240 recorded runs (7917 steps) replay identically to the pre-migration engine. Save key frankenstein_run_save_v2 unchanged.
