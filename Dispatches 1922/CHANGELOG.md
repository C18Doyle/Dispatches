# Dispatches 1922 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- Layout is mobile-first: the whole app is a centred column at most 600px wide on desktop (it was full width). Phones are unchanged.
- tools/monte-carlo.js replaced by tools/monte-carlo.mjs, which plays the real src/logic.ts (seeded). It reports gate-bite rate and which endings are reached. It no longer reproduces the old routing.
### Added
- Save migrations and node aliases (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`) so an update upgrades saves instead of wiping them (docs/SAVES.md).
- `check:orphans`: every listed node and ending is reachable. Known content finding, accepted in `tests/orphans-allowlist.json`: the ending `endingHollowVictory21` (Bolsheviks) cannot be reached, because it needs `requisitionPolicy: intensified` and `congressChoice: press`, which are set on opposite branches of the campaign.
- Save-compatibility test (npm run test:saves) with four committed old saves.

## 1.0.0-src (migration baseline)
### Fixed
- A roll outcome that names its own next now routes there. Before, it was ignored unless the choice had no next: provisionalGov17/kornilovAffair17 crashed (4 of 48 recorded runs) and two endings were unreachable (endingTheArmyThatDidNotComeBack18, endingTheAdmiralAtIrkutsk20). Both are now reached.
