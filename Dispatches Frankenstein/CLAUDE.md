# Dispatches: Frankenstein

Document-driven branching strategy game (React + TypeScript, built with esbuild + Tailwind into one HTML file). Part of the Dispatches series; the engine in `src/engine/` is game-agnostic and meant to be shared.

## Layout
- `src/engine/` pure engine: `schema.ts` (the contract), `reducer.ts`, `rules.ts`, `conditions.ts`, `epilogue.ts`. Import it only via `src/engine/index`.
- `src/content/frankenstein/` game data: `config.json` (rules), `events.json` (nodes, interludes, endings), `flavor.json` (prologue, help, gossip, epilogues).
- `src/game.ts` the only file that binds this game's JSON to the engine (`def`).
- `src/App.tsx`, `main.tsx`, `sfx.ts`, `index.css` UI. `scripts/` validators and tests. `tests/fixtures/baseline.json` recorded behaviour.

## Hard rules
1. `src/engine/` imports nothing outside `src/engine/`: no React, no DOM or browser globals, no storage, no JSON, no `Math.random`/`Date`. Randomness arrives in the action (`CONDUCT_EXPERIMENT.roll`).
2. State changes only through `reduce(def, state, action)`. UI code never assigns into state or mutates its arrays; it dispatches actions. UI-only state (settings, overlays, panels, audio) lives in React `useState`, never in `GameState`.
3. Every JSON file must conform to `schema.ts`. Change the schema first, then the JSON, then `scripts/validate_schema.ts` if a field table changed.
4. Rules and numbers belong in `config.json`, not in code. Resource bounds, crisis/failure thresholds, difficulty behaviour, interlude triggers and Fritz's favor are config. Do not hardcode resource names or ranges in the engine or UI.
5. Content text lives in JSON only. No story text in `.ts`/`.tsx`.
6. No external state libraries. `useReducer` and pure functions only.
7. Every UI screen renders inside `.app-shell` (`max-width: 600px; margin: 0 auto; overflow-x: hidden`). Keep layouts working at 375px wide with no horizontal scroll.
8. Gameplay must not change in a refactor. `npm run verify:baseline` replays 240 recorded runs against the reducer and must stay identical. Re-record the fixture only for an intentional mechanics change, and say so.

## Commands
- `npm test` everything below, in order. Run before finishing any change.
- `npm run typecheck` app (DOM) and engine (`tsconfig.engine.json`, no DOM lib).
- `npm run check:boundaries` enforces rules 1 and 2 by source scan.
- `npm run validate:schema` enforces rule 3 (fields, types, cross-references).
- `npm run verify:baseline` enforces rule 8.
- `npm run validate` exhaustive graph search: reachability, gates, endings, flags.
- `npm run build` writes `dist/index.html` (single file, inlined).

## Working here cheaply
- Story or balance edit: read only `events.json` or `config.json`, then run `npm run validate:schema` and `npm run validate`. Do not open `App.tsx`.
- Engine edit: read `schema.ts` and the one module involved.
- `events.json` is about 115 KB; use Grep or ranged Read, never a whole-file Read.
- Option fields are in `schema.ts` (`Option`). Node ids are strings; ending ids must start with `ENDING_`.

## Gotchas
- Saves from before the engine split are discarded: the run-save key is now `frankenstein_run_save_v2`. Change that key whenever `GameState` changes shape.
- `src/engine.ts` was removed; `src/engine/` is the folder. Always import `./engine/index`.
- `build:audio` and the other scripts must stay cross-platform (Windows): no `mkdir -p`, `cp`.
- This folder syncs to OneDrive. Exclude `node_modules/` from sync if it gets slow.
