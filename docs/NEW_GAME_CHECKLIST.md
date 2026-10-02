# New game (or newly imported game) checklist

What we did five times, in the order that worked. Each step ends with something you can run.

1. **Folder and import.** `Dispatches <Name>/` with the unbundled source (not the esbuild output). Commit it untouched as the baseline commit.
2. **Make it build.** `package.json` (`type: module` for new tooling), `build.mjs`, `src/main.jsx`, a `build` script. Keep scripts cross-platform: no `mkdir -p`, `cp`, `rm -rf`, `zip`; run CLIs through `node`. Build must produce the same artifact you ship.
3. **Run what already exists.** Any validators, smoke or render tests the game came with, before changing anything. Record which pass and which fail on purpose.
4. **Record behaviour before touching it.**
   - Add `tests/ui.config.mjs` for the shared driver in `packages/testkit` (copy the closest game's: 1914 for a simple menu, 1922 for modes, 1940 for battle screens).
   - Record from the unmodified build (`node ../packages/testkit/src/cli.mjs record legacy <bundle>`), record again, and diff: runs must be byte-identical or the driver is not deterministic yet.
   - Save as `tests/baseline/ui`. If legacy runs crash, that is a finding, not a failure: the compare treats a baseline crash as "must match up to the crash".
5. **Extract the logic.** Put choice resolution, routing, log entries and arrival decisions in `src/logic.ts` (typed, no React/DOM/storage/sound/`Math.random`; content passed in). Use the engine's `campaign.ts` primitives for the rules. Wire `App.jsx` to it, changing nothing else.
6. **Prove it.** `npm run verify:baseline` identical (or only documented differences in `tests/baseline/known-diffs.json`), plus the engine equivalence test if the game's rules are new (add it to `packages/engine/tests/campaign-equivalence.test.mjs`).
7. **Stale-state check.** Dynamic stages re-resolve from flags/meters after a choice applies its impact. The outcome screen and log must read the stage the player faced (`seenStage = outcomeStage || stage`), not a re-resolved one. This caused crashes in 1941 and wrong-choice outcomes in 1940.
8. **Split the big file.** `split.config.json` (one part per campaign, plus head, registries, screens, app), `npm run roundtrip` byte-identical, and make `build` assemble first (copy 1941's `build.mjs` block).
9. **Content checks.** `tools/check-structure.mjs` (shared structural checks) and any game-specific validators. Findings you accept go in `tests/content-allowlist.json`; new ones fail.
10. **Wire it into the repo.** `test:fast` (and `test:slow` if the baseline takes minutes) and `release` scripts in the game's `package.json`, add the folder to `tools/run-all.mjs`, a `CLAUDE.md` (layout, commands, rules, known legacy behaviour), a row in the root `README.md` and `CLAUDE.md`.
11. **Commit per step.** `npm run release` when ready: it runs `test:fast`, builds, zips and writes `RELEASE.json`.

Gotchas we hit:
- Shell heredocs and tool calls can silently drop backslashes in regexes. Write config files with an editor tool and check the result.
- esbuild's tsconfig `paths` makes `@dispatches/engine` work without npm linking.
- React 19 with jsdom needs the media, scroll and fetch shims that are already in the test kit.
- OneDrive syncs `node_modules`; exclude it from sync.
