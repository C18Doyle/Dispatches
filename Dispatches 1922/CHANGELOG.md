# Dispatches 1922 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- Hard mode: South Russia and the Bolsheviks can now reach their capital cap, so The Mutiny and The Central Committee Moves can fire. Wrangel's dismissal and the Novorossiysk evacuation order (South Russia) and the Tsaritsyn reassertion, the intensified requisitioning and the unified Cavalry Army (Bolsheviks) now cost capital. Measured with tools/capital-reach.mjs on greedy play: South Russia reaches 5 on about 25% of runs (3 or 4 before), the Bolsheviks on about 66% (3 before).
- Layout is mobile-first: the whole app is a centred column at most 600px wide on desktop (it was full width). Phones are unchanged.
- tools/monte-carlo.js replaced by tools/monte-carlo.mjs, which plays the real src/logic.ts (seeded). It reports gate-bite rate and which endings are reached. It no longer reproduces the old routing.
### Added
- South Russia: a new report, "Sevastopol: The Radio From Frunze" (11 November 1920), with three choices (keep the offer from the army, refuse it, publish it). The ending epilogue records what happened. Sources in claims/south-russia-round1.md.
- South Russia: a third choice at the Sevastopol council (name the successor by order after hearing the council).
- Adviser lines can be written as a third-person position (no speech marks) with `advisor.position`; new text uses it (docs/WRITING.md rule 7).
- tools/capital-reach.mjs: how much hard-mode capital a run can spend, and which reports offer it.
- Save migrations and node aliases (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`) so an update upgrades saves instead of wiping them (docs/SAVES.md).
- `check:orphans`: every listed node and ending is reachable (hard-mode endings excepted).
- Save-compatibility test (npm run test:saves) with four committed old saves.
### Fixed
- The Bolsheviks ending "A Hollow Victory" could never be reached: it required `requisitionPolicy: intensified` and `congressChoice: press`, which are set on opposite branches of the campaign. It now follows an assault on Kronstadt after either intensified requisitioning or pressing the Eighth Congress (about 9% of random Bolsheviks runs). Five seeded baseline runs now end there instead of at The Ice Broken (recorded in tests/baseline/known-diffs.json).
- A 9px muted header label ("FILE NO. 1922") was below the 4.5:1 contrast ratio; its colour is slightly darker.

## 1.0.0-src (migration baseline)
### Fixed
- A roll outcome that names its own next now routes there. Before, it was ignored unless the choice had no next: provisionalGov17/kornilovAffair17 crashed (4 of 48 recorded runs) and two endings were unreachable (endingTheArmyThatDidNotComeBack18, endingTheAdmiralAtIrkutsk20). Both are now reached.
