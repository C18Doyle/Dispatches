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
- Order of Battle improvements, for all 14 battles: a short "How an Order of Battle works" guide (open the first time, closed afterwards); "Spread effort evenly" and "Clear all effort" buttons; a one-sentence "Your plan so far" summary before the commit button; a "Ground and weather" line for each battle, with matching modifiers on the arms it affects; and a **field decision** in the middle of every battle, written from the real alternatives of that battle (the turn to Prokhorovka, the destroyers at Omaha, the covering force on PQ-17, the road or the high ground in the Alps, and so on). The best answer to a field decision depends on the enemy's hidden setup, so reading the intelligence matters, and some answers cost Manpower, Matériel or Initiative.
- Battle-specific twists: **two-phase battles** (Battle of Britain Day, PQ-17, Second Schweinfurt) have a second hidden enemy setup that is revealed half way through, and the plan is weighed against both; **attrition** (frostbite in the Alps, the cold before Moscow, exposure on Monte Marrone) costs Manpower when the assault is committed too heavily, and the screen says so beforehand; **defensive** battles (Battle of Britain Day) count the enemy's counterattack for half as much again.
- After every battle the report adds a line from military intelligence: whether your orders improved or cost us chance of victory, in points to the nearest five (the change your plan made, never the odds themselves).
- The War Record has a **Battle Record**: each battle you have fought, how many times, how many won, the best result, how many of its enemy setups you have met, and last time's commander and field decision. Battles not yet fought show as blanks. It is recorded when a war ends, like the rest of the record.
- `check-battle-balance` now also checks every field decision (no option may be best under every enemy setup, every option within its limits) and runs the two-phase battles against every pair of enemy setups.
- **Effort, not chits.** The pool a player spreads across a battle's arms is now "effort" (doctrinally, the weight of effort behind the main effort), in points: "Effort in reserve: 2 of 6", "Add effort to Air Attack", "Effort put into Armour carries further under Hoth". Nothing about the rules changed.
- **Matériel, not Fuel.** The second meter is now called Matériel on every screen (men and matériel); its internal key is unchanged, so saves keep working. It stands for fuel, ammunition, steel, shipping and rail together. Under it on the briefing screen sit four readings in words (Fuel & Oil, Ammunition, Armour & Steel, Shipping & Rail: Short, Strained, Adequate or Plentiful) which show which strand your decisions have been feeding or starving, and the outcome screen says which strand a Matériel change fell on. They explain the one number and do not replace it. A choice is filed to a strand by what its text is about, or by an explicit matStrand on the choice; `npm run check-materiel-strands` shows how, and is part of `npm run audit`.
- The four new battles' favourable outcomes now keep the choice's original Manpower, Matériel and Initiative impact (they had carried zero).
- `check:orphans` in the fast tests (all 250 nodes reachable, including the hard-mode-only ones).
- Save-compatibility test (`npm run test:saves`) and a save-migration helper (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`, docs/SAVES.md).

## 6.0.0 (migration baseline)
### Fixed
- Outcome could show the wrong choice's result when the stage re-resolved after the choice's impact.
- End-screen log odds used the re-resolved stage instead of the stage the player faced; now fixed.
- tools/extract_campaigns.js works again (the music import broke the audit extractor).
