# Dispatches Frankenstein changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Added
- Save-compatibility test (npm run test:saves): committed old saves must still resume and reach an ending.
### Changed
- Resume-save parsing moved to src/runSave.ts (same rules as before; no player-visible change).

## 1.0.0 (migration baseline)
- Content moved to JSON (src/content/frankenstein/) on the shared pure engine. 240 recorded runs (7917 steps) replay identically to the pre-migration engine. Save key frankenstein_run_save_v2 unchanged.
