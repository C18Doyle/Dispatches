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
- Four early-war Order of Battle screens, one more for each campaign: **the Meuse crossing at Sedan** (German, May 1940), **the Moscow counteroffensive** (Soviet, December 1941), **Battle of Britain Day** (Allied, 15 September 1940) and **the Little St Bernard** (Italian Alps offensive, June 1940). Each puts a roll behind a decision that was a fixed outcome before (the Manstein Plan, the winter counteroffensive, Park's doctrine, the push in the Alps), so the historical result is now the likelier outcome and no longer the certain one. The first outcome of each roll is the text that used to be the choice's own, so the historical line reads the same when the player does well. The Alps are the exception: history there was the unlucky result, so the fortunate outcome is the minority and comes first. The next situation report mentions how the battle went.
- Order of Battle improvements, for all 14 battles: a short "How an Order of Battle works" guide (open the first time, closed afterwards); "Spread chits evenly" and "Clear all chits" buttons; a one-sentence "Your plan so far" summary before the commit button; a "Ground and weather" line for each battle, with matching modifiers on the arms it affects; and a **field decision** in the middle of every battle, written from the real alternatives of that battle (the turn to Prokhorovka, the destroyers at Omaha, the covering force on PQ-17, the road or the high ground in the Alps, and so on). The best answer to a field decision depends on the enemy's hidden setup, so reading the intelligence matters, and some answers cost Manpower, Fuel or Initiative.
- Battle-specific twists: **two-phase battles** (Battle of Britain Day, PQ-17, Second Schweinfurt) have a second hidden enemy setup that is revealed half way through, and the plan is weighed against both; **attrition** (frostbite in the Alps, the cold before Moscow, exposure on Monte Marrone) costs Manpower when the assault is committed too heavily, and the screen says so beforehand; **defensive** battles (Battle of Britain Day) count the enemy's counterattack for half as much again.
- `check-battle-balance` now also checks every field decision (no option may be best under every enemy setup, every option within its limits) and runs the two-phase battles against every pair of enemy setups.
- `check:orphans` in the fast tests (all 250 nodes reachable, including the hard-mode-only ones).
- Save-compatibility test (`npm run test:saves`) and a save-migration helper (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`, docs/SAVES.md).

## 6.0.0 (migration baseline)
### Fixed
- Outcome could show the wrong choice's result when the stage re-resolved after the choice's impact.
- End-screen log odds used the re-resolved stage instead of the stage the player faced; now fixed.
- tools/extract_campaigns.js works again (the music import broke the audit extractor).
