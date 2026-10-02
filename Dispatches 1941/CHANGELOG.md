# Dispatches 1941 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Added
- Save-compatibility test (npm run test:saves) with committed old saves for both campaigns.

## 1.0.0 (migration baseline)
### Fixed
- Crash when a choice's impact re-resolved the stage and dropped or shifted a meter-gated choice (the outcome looked up a choice that no longer existed).
- The end-screen log (odds, passed-over counts) used the re-resolved stage instead of the stage the player faced; it now uses the stage the player faced.
