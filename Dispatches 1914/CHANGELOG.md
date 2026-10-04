# Dispatches 1914 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

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
