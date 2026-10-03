# Dispatches 1940 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- Layout is mobile-first: the briefing, outcome and end-screen cards are capped at 600px (they were 672px). Phones are unchanged.
- (none yet)
### Added
- `check:orphans` in the fast tests. Known findings accepted in `tests/orphans-allowlist.json`: 45 reachable nodes are missing from the discovery atlas (it lists 205 while `NODE_TOTAL` says 250 and 245 are reachable), and 5 listed nodes (`eisenhowerIntervenes44`, `stalinTestsTheFront45`, `tehran43`, `quietSector43`, `specialSection41`) were never reached in 30000 random walks, so they may be unreachable or only reachable by a rare path.

## 6.0.0 (migration baseline)
### Fixed
- Outcome could show the wrong choice's result when the stage re-resolved after the choice's impact.
- End-screen log odds used the re-resolved stage instead of the stage the player faced; now fixed.
- tools/extract_campaigns.js works again (the music import broke the audit extractor).
- Known: the save code (`ww2-command-active`, `ww2-command-record`) calls `window.storage`, which 1940 never defines (1941 has a shim). In a normal browser nothing is saved: no Resume, no war record. Not fixed yet (docs/SAVES.md).
