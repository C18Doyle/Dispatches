# Saved runs: the rules

Players have saved runs in their browsers. A content update that renames a node or changes what a save holds can
silently strand or crash those runs. These rules keep updates safe.

## What each game saves
| Game | Storage key | Saves |
|---|---|---|
| Frankenstein | `frankenstein_run_save_v2` | the whole engine `GameState`, on every change |
| 1922 | `dispatches1922_save_v1` | one run snapshot (campaign, node, meters, flags, visited nodes, hard-mode state) |
| 1941 | `ww2-command-active` | one run (campaign, position, flags, meters, log, visited, history, rewinds) |
| 1914 | none | nothing is written to localStorage during a run |
| 1940 | `ww2-command-active`, `ww2-command-record` (written through `window.storage`) | **does not persist today**: the code saves through `window.storage` (Claude's artifact API) but 1940, unlike 1941, never defines it. Checked in Chromium on the built game: `window.storage` is `undefined` and localStorage stays empty, so on itch.io and Windows there is no Resume and no war record. The fix is the small shim 1941 has in `src/parts/00-head.jsx`; it changes what players experience, so it is waiting for your go-ahead |

(Also stored per game, never as a run: settings, discovered nodes and endings, the war record. Those are bookkeeping;
losing them costs a counter, not a run.)

## The rules
1. **Every save carries a schema version.** Frankenstein: `SAVE_SCHEMA_VERSION` in `src/runSave.ts` (saves written
   before versioning have no field and count as version 1). 1922 and 1941: `SAVE_SCHEMA_VERSION` next to the save code.
2. **Renaming or deleting a node: add it to `NODE_ALIASES`** (`{ oldId: "newId" }`), in `runSave.ts` for Frankenstein or
   the helper block beside `SAVE_SCHEMA_VERSION` in 1922/1941. Saves that point at the old id then resume at the new
   one. Never reuse an old id for a different node.
3. **Changing what a save means or holds: bump `SAVE_SCHEMA_VERSION` and add `SAVE_MIGRATIONS[oldVersion]`**, a function
   that turns a version-n save into a version-n+1 save. Never bump without the migration: with no migration the old
   save is thrown away, which wipes every player's run.
4. **A save from a newer build is refused**, not guessed at. A save that cannot be upgraded is cleared quietly; the
   player never sees a broken Resume button.
5. **Never edit or re-record the committed old saves to make a test pass.** `tests/saves/*` are saves made by earlier
   builds; they must keep loading. Add new fixtures; do not replace old ones.

## The tests that enforce it
- Frankenstein: `npm run test:saves` replays the committed saves through `parseRunSave` and plays each on to an
  ending, and tests the versioning rules (legacy load, round trip, newer version refused, migration chain, aliases,
  missing step refused).
- 1922 and 1941: `npm run test:saves` loads the committed saves into the built game in a headless browser, presses
  RESUME and requires the same screen as when they were recorded; `npm run test:migration` runs the real
  `migrateSave` helper with test tables (steps in order, aliases applied, newer/unversioned/missing-step refused).
- If a game gains saves (1914 has none; 1940 will once it gets the storage shim), copy the 1922 pattern: version field, `NODE_ALIASES`,
  `SAVE_MIGRATIONS`, `migrateSave`, a `tests/saves` fixture and `tests/migration.test.mjs`.

## Worked example: renaming a node in 1941
1. Rename it in `src/parts/11-campaign-alliedpacific.jsx` (and every `next:` that points at it, and the atlas entry).
2. In `src/parts/30-screens.jsx` set `const NODE_ALIASES = { oldNodeId: "newNodeId" };`.
3. `npm run test:fast`. `check:orphans` and `check:structure` catch a dangling or unlisted node; `test:migration`
   proves aliases are applied; `test:saves` proves existing saves still resume.
