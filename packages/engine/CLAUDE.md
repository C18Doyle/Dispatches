# @dispatches/engine

Shared, dependency-free engine for every Dispatches game. Games import it as `"@dispatches/engine"` (a tsconfig path alias to `packages/engine/src/index.ts`; esbuild and tsx honour it). No npm linking, no build step: games compile the engine source directly.

## Contents
- `src/schema.ts` the contract: config, content, flavor and runtime-state types. The source of truth.
- `src/reducer.ts` `createInitialState(def)` and `reduce(def, state, action)`.
- `src/rules.ts` clamping, stamps, locks, roll odds. `conditions.ts` condition evaluator. `epilogue.ts` endings, hidden-axis reading, random-line pools.
- `tools/` shared checks, run from a game folder: `validate_schema.ts <game>`, `verify_baseline.ts <game>`, `check_boundaries.mjs`, plus `load_definition.ts` and `projection.ts`.

## Rules
1. Zero dependencies and zero platform: no React, no DOM or browser globals, no Node APIs, no JSON imports, no `Math.random`/`Date`. Only sibling imports. `tsconfig.json` here has no DOM lib on purpose.
2. Pure and deterministic: `reduce` never mutates its input and takes all randomness from the action.
3. Everything in `schema.ts` stays JSON-serialisable.
4. Never name a game, resource, branch or node inside the engine. Game specifics are data in the game's `config.json`.

## Amending the engine (it affects every game)
1. Prefer a new optional field or a new optional config block over changing existing behaviour. Old content must keep working untouched.
2. Change `schema.ts` first, then the code, then the field tables in `tools/validate_schema.ts`.
3. From each game folder, run `npm test`. Every game that uses the engine must stay green, including `verify:baseline`. Changing a game's recorded behaviour on purpose means re-recording that game's fixture and saying so.
4. Bump `schemaVersion` in a game's `config.json` only if its saved `GameState` shape changed, and change that game's run-save key with it.
5. Game-only needs (maps, battle subgames, audio) belong in that game, not here, until a second game needs the same thing.

## Adding a game
1. Create `<Game>/` with `src/content/<id>/{config,events,flavor}.json`, a `src/game.ts` that builds `def`, and a tsconfig `paths` entry for `@dispatches/engine`.
2. Copy the npm scripts from `Dispatches Frankenstein/package.json`.
3. Run `validate:schema` until clean, then record a baseline from the game's old engine (if it had one) before replacing it, as was done for Frankenstein (see its git history, commit "Add characterization baseline").

Not yet covered by the engine: region maps, battle subgames, multi-campaign selection (1940/1941). Add them here only once a second game needs them.
