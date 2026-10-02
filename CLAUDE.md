# Dispatches Code (series monorepo)

One folder per game plus a shared engine. Read the folder's own `CLAUDE.md` before editing in it.

| Folder | State |
|---|---|
| `packages/engine/` | Shared pure engine `@dispatches/engine`. Read its CLAUDE.md before changing it: every game depends on it. |
| `Dispatches Frankenstein/` | Migrated to the engine. TypeScript. `npm test` green. |
| `Dispatches 1940/` | Unmigrated. JSX, one 1.9 MB `src/App.jsx`, four campaigns, maps, Tone audio, own audit tools (`npm run audit`). |
| `Dispatches 1941/` | Unmigrated. JSX (`dispatches-pacific.jsx`), map JSON, map tool. |
| `Dispatches 1922/` | Unmigrated. JSX (`dispatches-1917.jsx` is the 1922 game), validators and jsdom tests. |
| `Dispatches 1914/` | Source not on disk yet (Cowork container `/mnt/user-data/outputs/dispatches-1918/`). |

## Rules for the whole repo
- Never read a whole large source file. Use Grep and ranged Read. `1940/src/App.jsx` alone is ~1.9 MB.
- Unmigrated games keep their own tooling and conventions until they are migrated; do not impose the engine rules on them piecemeal.
- Migrating a game to TypeScript and the engine: first record its current behaviour as a fixture, then refactor against it (the Frankenstein commit history is the template).
- Shipped builds live on itch.io; the source here is the truth. Keep builds reproducible (`npm run build` per game).
- Commit per logical step. `node_modules/`, `dist/`, `builds/` are git-ignored.
- Windows host: keep scripts cross-platform (no `mkdir -p`, `cp`, `rm -rf`).
