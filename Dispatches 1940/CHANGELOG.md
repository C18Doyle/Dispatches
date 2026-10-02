# Dispatches 1940 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- (none yet)

## 1.0.0 (migration baseline)
### Fixed
- Outcome could show the wrong choice's result when the stage re-resolved after the choice's impact.
- End-screen log odds used the re-resolved stage instead of the stage the player faced; now fixed.
- tools/extract_campaigns.js works again (the music import broke the audit extractor).
- This game keeps no saved state (nothing is written to localStorage during a run).
