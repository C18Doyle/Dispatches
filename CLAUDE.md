# Dispatches Code (series monorepo)

One folder per game plus a shared engine. Read the folder's own `CLAUDE.md` before editing in it.

| Folder | State |
|---|---|
| `packages/engine/` | Shared pure engine `@dispatches/engine`. Read its CLAUDE.md before changing it: every game depends on it. |
| `Dispatches Frankenstein/` | Migrated to the engine. TypeScript. `npm test` green. |
| `Dispatches 1940/` | Partly migrated: buildable, `src/logic.ts` extracted (incl. battle subgame resolution), headless UI baseline, audits green. Not on the shared engine yet. |
| `Dispatches 1941/` | Partly migrated: buildable, `src/logic.ts` extracted, UI-differential baseline. Content is code in `src/App.jsx`; not on the shared engine yet. |
| `Dispatches 1922/` | Partly migrated: buildable, `src/logic.ts` extracted, headless UI baseline, validators in `tools/`. Not on the shared engine yet. |
| `Dispatches 1914/` | Cleanest layout: pure logic layer (src/50-57), campaign-per-file, headless UI baseline. Reference shape for the engine "node provider" mode. |

## Commands (repo root)
- `npm run install:all` installs every game's dependencies. `npm test` runs each game's `test:fast` plus the engine equivalence test (a few minutes). `npm run test:slow` runs the long behaviour baselines (1940: ~20 min). `node tools/run-all.mjs --fast 1941` runs one game.
- Per game: `npm run test:fast`, `npm run verify:baseline`, `npm run release` (tests, build, zips and `RELEASE.json` into `releases/<version>/`).
- Shared tooling: `packages/engine` (engine + `CHANGELOG.md`), `packages/testkit` (headless UI-differential driver, split/assemble, content checks, release zipper). `docs/ROADMAP.md` is the status of the migration; `docs/NEW_GAME_CHECKLIST.md` is the recipe for a new game. CI is `.github/workflows/ci.yml` (not pushed anywhere yet).

## Rules for the whole repo
- Never read a whole large source file. Use Grep and ranged Read. `1940/src/App.jsx` alone is ~1.9 MB.
- Every game now has: a build, a seeded UI baseline, typed `src/logic.ts` (or a pure engine layer), and a `CLAUDE.md`. Content is still code in 1914/1922/1940/1941; only Frankenstein is data.
- Edit `src/parts/*` in 1922/1940/1941 (not the assembled `src/App.jsx`); `npm run build` assembles. 1914 edits `src/*.jsx`.
- Migrating a game to TypeScript and the engine: first record its current behaviour as a fixture, then refactor against it (the Frankenstein commit history is the template).
- Shipped builds live on itch.io; the source here is the truth. Keep builds reproducible (`npm run build` per game).
- Commit per logical step. `node_modules/`, `dist/`, `builds/` are git-ignored.
- Windows host: keep scripts cross-platform (no `mkdir -p`, `cp`, `rm -rf`).
