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
- Orders of Battle. An order that is a real engagement opens a planning screen: name an officer, choose an approach, place a pool of counters across the arms (the pool is 4 to 8, by the state of the meters). The enemy's setup is drawn hidden and one line of intelligence, right three times in four, points at it. The plan moves the odds of the order's roll toward the better outcome (at most 20 points, weights kept inside 5 to 95), charges the meters up to two points in all, and the next report echoes how it was fought. "Let the staff plan it" plays the record's own odds exactly; so does switching "Take control of battle planning" off on the war-room screen. Four battles: the June Offensive (1917), Ekaterinodar (1918), Peregonovka and Orel (1919). The Bolsheviks and Siberia have none yet. Easy mode shows what each counter is worth. src/battle.ts (typed, ported from 1914), src/parts/35-battles.jsx, tests/battle.test.mjs, sources in claims/battles-round1.md.
- The front map has a month stepper ("Earlier month" and "Later month"): the control of each place is shown as of any month this run has been through. Later months stay closed.
- Key Events has a second view, "The war at large": what every command was deciding, month by month, up to the month the run has reached, built from the four situation atlases (a new report appears in it with no extra work). Later months and the player's own unvisited branches stay hidden. tests/timeline.test.mjs.
- Easy mode, one of three ways to open a command (with Standard and the hard mode). Each command has a name of its own: Tachanka Command (South Russia), Teplushka Command (Siberia), Armoured Train Command (Bolsheviks), Samovar Command (1917). Every order shows its effect on the meters, a contested order lists every outcome with its odds, and the last order can be taken back (the report returns exactly as it was, and an ending seen only in the outcome is not left discovered). The saved run records the mode. tests/easy-mode.test.mjs; 24 Easy runs in the UI baseline, two of them taking an order back.
- Accessibility pass: a main landmark, a level-1 heading on every screen, the meters exposed as meters (role meter with value and text), the campaign cards and the objectives and background panels reachable and usable from the keyboard, a named close control, focus moved to the page and the view scrolled to the top on each new screen, reduced motion taken from the system setting (and the typewriter off with it), and two accent colours made readable (the Agitprop red and the Telegram gold were under 4.5:1). tools/check-a11y.mjs plays four runs and the menus and fails on any of these; it is part of test:fast.
- The 1917 Provisional Government campaign grows from 4 reports to 10: the May commissars and Soldiers' Declaration, the Supreme Command (Kornilov's terms), the Moscow State Conference, the September Directory, the Democratic Conference and the morning of 24 October. Three reports have three choices. Adviser lines in this campaign are positions, not speech: the eight old quotes were rewritten the same way. New adviser dossier: Savinkov. Sources in claims/provisional-government-round1.md; several lines are marked there as not yet read.
- The 1917 hard mode (Decree Capital) can now be played to its end: six choices cost capital, and the fifth point ends the campaign at a new ending, The Cabinet That Governed Alone (speculative). Before, no 1917 choice cost capital, and the hard-mode ending was The General's Republic.
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
