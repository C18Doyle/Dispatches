# Dispatches 1914 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased
### Content: the German Supreme Command, 1914-1918, from 11 decisions to 23
- Twelve new decisions, each tied to a dated, sourced event: the two corps sent to East Prussia (25 Aug 1914), Ypres and the Channel ports (Nov 1914), Gorlice or a wide envelopment (Apr 1915), the Serbian campaign (Sep 1915), the Somme "no ground to give" order (Jul 1916), the Hindenburg Programme (Aug 1916), the retirement to the Siegfried Line and what to leave behind (Feb 1917), help for Vienna at Caporetto (Sep 1917), the Bad Homburg council and the Russian declaration (Feb 1918), the Aisne offensive past the Vesle (May 1918), the Black Day and the Spa council (Aug 1918) and the reply to Wilson's third note (Oct 1918).
- Earlier choices now shape later scenes: the two corps and the Marne, the Russian declaration and the Brest-Litovsk settlement, the Aisne salient and July.
- A new adviser dossier (Kuhl, Chief of Staff of Army Group Rupprecht) and two more OHL bulletins (ten now).
- The armistice epilogue records every one of the new decisions.
- `claims/`: a register of the checkable claims in the campaign's text (71 claims on 23 nodes), each with a kind, sources and a check status, `check-claims.js` (new nodes must arrive with claims logged; the list of unlogged nodes can only shrink) and `claims-worksheet.js`, which writes a reviewer worksheet for the independent fact-check. Only 13 claims have been read against a source so far (web pages); the rest are marked as drafted.
### Changed
- Balance after the added decisions, measured with `montecarlo.js` and `measure-erosion.js`: the Brest-Litovsk full settlement now releases divisions (manpower +1), and hard mode relieves the Chief at 7 erosion rather than 5 (the historical line carries five of the thirteen erosion-tagged choices, so it is not relieved). Under random play the eight standard endings fall between 3% and 26% of runs and every one is reached (the hard-mode ending in about one run in six); historical play still ends at "The Request".
- The restricted-submarine branch at Pless no longer jumps to the armistice; it continues through the same chain as the others.
- Re-recorded the committed `tests/saves/ohl-hard.json`: it had been recorded from an unreleased build and the only difference was the erosion track's denominator after the retune above. No shipped save was changed.
### Added
- Saved files: the run in progress is saved after every step and offered as "File in progress" on the menu, including a pending outcome screen. Starting a new file replaces it.
- A Standard / Hard mode switch on the menu. Hard mode adds the erosion track already in the rules; each command's card says what pressure it represents, and at the limit a fixed ending follows.
- The War Record is real: dossiers (opened by meeting each adviser in play), an atlas of decisions reached and an endings gallery, kept in the browser across runs.
- The historical record on every outcome screen: whether the order was the one the command gave (or what the historical command chose instead), and, where a roll stands for a real disagreement between historians, the dispute as written.
- Text size setting (Standard, Larger, Largest).
- Accessibility: a main landmark and heading structure on every screen, focus outlines, button states announced.
- `check-anachronisms.js`: titles, ranks, state names and terms checked against each node's date (a Marshal's baton before it was conferred, "Soviet" before 1917, a state before it existed). Part of `npm run validate`, which is now in `npm test`.
- Tests: six saved-file fixtures and a migration helper test (docs/SAVES.md), 24 recorded hard-mode playthroughs (four of them end on screens whose line-break fix, from 1.0.1, is listed in tests/baseline/known-diffs.json), and render checks for all of the above.

## 1.0.1 (2026-10-04)
### Fixed
- Seven ending screens of the German OHL campaign (the home front collapsing first, the front giving way, fighting on into 1919, an early negotiation, worse terms, an army that still exists, the east held and the west lost) showed the characters "\\n\\n" in the middle of their text instead of a paragraph break. The text is now broken into paragraphs as written.
### Added
- `check-text-integrity.js`, part of the validator suite: finds literal escape sequences, "undefined" or "NaN" interpolated into prose, doubled spaces and unclosed quotes in every string of every node. Run against 1.0.0 it reports exactly the seven endings above.

## 1.0.0 (2026-10-03): first public release
### Playable
- Three commands, each a branching graph of dated decisions with advisor positions, dossiers and bulletins: the German Oberste Heeresleitung (20 decisions), the French Grand Quartier Général (20) and the Russian Stavka (17), with 9 endings each (one per command is the hard-mode ending, see Known).
- BEF, AOK and the Ottoman command appear greyed out as "No content yet".
- Built for phones first: a column at most 600px wide, no sideways scrolling.
### Known
- The game keeps no saved state: closing the page ends the run.
- Hard mode exists in the rules (an erosion track with a forced ending per command) and is tested, but the menu has no switch for it yet.
- The historical claims have been checked by their author only; an independent fact-check is planned (see the game's CLAUDE.md).
### Changed
- The game is titled Dispatches 1914 on the title screen (File No. 1914) and in the page title; it used to say 1918.
### Quality
- All 54 decisions and endings are reachable (`npm run check:orphans`); 24 seeded playthroughs replay identically (`npm run verify:baseline`); the build loads cleanly in Chromium and WebKit on a phone and a desktop viewport.
- Fixed before release: the WAR RECORD card on the menu was wider than a phone screen (20px of sideways scrolling).
