# Dispatches Code: roadmap and status

Order is by dependency. Update the Status column as steps land (each step is its own commit).

| # | Step | Depends on | Status |
|---|---|---|---|
| 3a | 1922: roll outcomes route to their own `next` (two endings become reachable) | none | done |
| 3b | 1941, 1940: log and routing use the stage the player faced | none | done |
| 6 | Shared UI-differential test kit (`packages/testkit`), one driver core, per-game config | 3a, 3b | done for 1914, 1922, 1941, 1940 |
| 3c | Re-record baselines after 3a/3b (diffs inspected, then promoted) | 6 | done: 1922 (no change), 1941, 1940 (masked proof in 1940 CLAUDE.md) |
| 9 | Campaign-per-file split/assemble for 1941, 1922, 1940 (roundtrip-tested) | 3c | done (parts committed; build assembles; guard against editing the artifact) |
| 8 | Content rules as machine checks (shared structural checks; 1941 gets validators) | 9 | done: `npm run check:structure` in 1941, 1940, 1922 (0 problems found); 1914 keeps its own 13 validators |
| 4 | Shared engine: campaign primitives (`packages/engine/src/campaign.ts`), games' `logic.ts` become thin adapters, equivalence test | 3c | done for 1941 and 1940 (baselines verified), equivalence test covers 1914, 1922, 1941, 1940; 1922 keeps its own pick/impact helpers because its validators evaluate the data section alone |
| 1 | Root test runner: fast and slow tiers across all games | 4, 8 | done: `npm test`, `npm run test:slow`, `node tools/run-all.mjs` |
| 2 | CI workflow (files only, you push) | 1 | done: `.github/workflows/ci.yml` (fast on Linux + Windows; browser smoke on Linux); pushed, green on both |
| 10 | Release scripts, engine version + changelog | 1 | done: `npm run release` per game, engine 0.2.0 + CHANGELOG |
| 5 | New-game checklist and root docs | all | done: `docs/NEW_GAME_CHECKLIST.md`, root CLAUDE.md |

Rule for every step: all existing baselines stay green except where a step deliberately changes behaviour (3a, 3b), and those are re-recorded once and noted in the game's CLAUDE.md.

## Pre-game setup round (2026-10)
Done: shared browser smoke test (`tools/smoke-browser.mjs`, in CI on Linux); save-compatibility tests (Frankenstein, 1922, 1941; 1914 keeps no saves; 1940's saves do not persist, see docs/SAVES.md); release pipeline (`release.yml`, `tools/verify-release.mjs`, `tools/itch-push.mjs`, `itch.json`); `baseline:accept`; per-game CHANGELOGs; `docs/WORKFLOW.md`; Dependabot; actions bumped, npm cache, Ubuntu pinned; 1922 Monte Carlo rewritten on the real rules; data-readiness report.
Decided: 1922, 1940 and 1914 use a mobile-first column of at most 600px (the browser allowlist is now empty). Open decisions: whether to start the JSON pilot (`docs/DATA_MIGRATION.md`); itch.io targets and `BUTLER_API_KEY`.
