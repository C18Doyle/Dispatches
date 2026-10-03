# Dispatches 1940 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- Layout is mobile-first: the briefing, outcome and end-screen cards are capped at 600px (they were 672px). Phones are unchanged.
### Fixed
- Saves now work outside Claude's artifact environment. The game saved your run and war record through `window.storage`, which only exists there, so on itch.io and Windows there was no Resume and no war record. The same small localStorage-backed `window.storage` that 1941 has is now in 1940.
- The Discovery Atlas listed 205 of the 250 situation reports; 45 reachable nodes were missing, so its per-campaign counts could never reach 250/250. All 250 are listed now.
### Added
- `check:orphans` in the fast tests (all 250 nodes reachable, including the hard-mode-only ones).
- Save-compatibility test (`npm run test:saves`) and a save-migration helper (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`, docs/SAVES.md).

## 6.0.0 (migration baseline)
### Fixed
- Outcome could show the wrong choice's result when the stage re-resolved after the choice's impact.
- End-screen log odds used the re-resolved stage instead of the stage the player faced; now fixed.
- tools/extract_campaigns.js works again (the music import broke the audit extractor).
