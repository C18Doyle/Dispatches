# Dispatches Code: roadmap and status

Order is by dependency. Update the Status column as steps land (each step is its own commit).

| # | Step | Depends on | Status |
|---|---|---|---|
| 3a | 1922: roll outcomes route to their own `next` (two endings become reachable) | none | done |
| 3b | 1941, 1940: end-screen log odds use the stage the player faced | none | todo |
| 6 | Shared UI-differential test kit (`packages/testkit`), one driver core, per-game config; 1941 gets a headless driver | 3a, 3b | todo |
| 3c | Re-record baselines after 3a/3b (diffs inspected, then promoted) | 6 | todo |
| 9 | Campaign-per-file split/assemble for 1941, 1922, 1940 (roundtrip-tested) | 3c | todo |
| 8 | Content rules as machine checks (shared structural checks; 1941 gets validators) | 9 | todo |
| 4 | Shared engine: campaign primitives (`packages/engine/src/campaign.ts`), games' `logic.ts` become thin adapters, 1914 equivalence test | 3c | todo |
| 1 | Root test runner: fast and slow tiers across all games | 4, 8 | todo |
| 2 | CI workflow (files only, you push) | 1 | todo |
| 10 | Release scripts, engine version + changelog | 1 | todo |
| 5 | New-game checklist and root docs | all | todo |

Rule for every step: all existing baselines stay green except where a step deliberately changes behaviour (3a, 3b), and those are re-recorded once and noted in the game's CLAUDE.md.
