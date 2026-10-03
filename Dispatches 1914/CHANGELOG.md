# Dispatches 1914 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- Desktop layout: the content column is now 600px wide (was 760px) and hides sideways overflow, matching the other games. Phones are unchanged.
### Fixed
- Phone layout: the WAR RECORD card on the menu was wider than the screen (missing box-sizing), causing 20px of sideways scrolling at 375px. It now fits like the other cards.
### Added
- `check:orphans` in the fast tests (all 54 nodes and endings reachable).

## 1.0.0 (migration baseline)
- Pure logic layer (src/50-57) and seeded UI baseline (24 runs) recorded; behaviour identical to the shipped build.
- This game keeps no saved state (nothing is written to localStorage during a run).
