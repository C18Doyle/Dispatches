# Dispatches 1922 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- Layout is mobile-first: the whole app is a centred column at most 600px wide on desktop (it was full width). Phones are unchanged.
- tools/monte-carlo.js replaced by tools/monte-carlo.mjs, which plays the real src/logic.ts (seeded). It reports gate-bite rate and which endings are reached. It no longer reproduces the old routing.
### Fixed
- The Bolsheviks ending "A Hollow Victory" could never be reached: it required `requisitionPolicy: intensified` and `congressChoice: press`, which are set on opposite branches of the campaign. It now follows an assault on Kronstadt after either intensified requisitioning or pressing the Eighth Congress (about 9% of random Bolsheviks runs). Five seeded baseline runs now end there instead of at The Ice Broken (recorded in tests/baseline/known-diffs.json).
- A 9px muted header label ("FILE NO. 1922") was below the 4.5:1 contrast ratio; its colour is slightly darker.
### Known
- Hard-mode endings: capital is capped at 5, but one path can spend at most 4 capital-spending choices in South Russia and 3 in the Bolsheviks campaign, so their hard-mode endings (The Mutiny, The Central Committee Moves) cannot fire. Siberia's can. Needs a design decision (lower the cap or add capital-spending choices).
### Added
- Save migrations and node aliases (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`) so an update upgrades saves instead of wiping them (docs/SAVES.md).
- `check:orphans`: every listed node and ending is reachable (hard-mode endings excepted).
- Save-compatibility test (npm run test:saves) with four committed old saves.

## 1.0.0-src (migration baseline)
### Fixed
- A roll outcome that names its own next now routes there. Before, it was ignored unless the choice had no next: provisionalGov17/kornilovAffair17 crashed (4 of 48 recorded runs) and two endings were unreachable (endingTheArmyThatDidNotComeBack18, endingTheAdmiralAtIrkutsk20). Both are now reached.
