# @dispatches/engine changelog

Versioning: the engine is consumed by source path, so the version is a communication tool, not a package
resolution. Bump the minor for new optional capability, the major for anything that needs game changes.
A game's `config.json` `schemaVersion` changes only when that game's saved state shape changes.

## 0.3.0 (2026-10)
- JSON-content engine, all new fields optional (Frankenstein's recorded 240 runs, 7,917 steps, still replay identically with its old content): `config.strain` and `roll.about` (a short resource takes probability off the rolls that are about it; `rollStrain`, and `effectiveRollChance` takes the config as a third argument); `node.echoes` (lines added to a scene while a condition holds); `option.requires` / `requiresHint` (an option locked by any condition) and `option.showWhen` (an option not shown unless a condition holds, for example `{ difficulty: "HARD" }`; `isOptionHidden`, `isOptionConditionLocked`); `ending.variants[].when` (a full condition instead of a flag); `flavor.difficultyInfo`.
- Also optional: `quote.kind` ("novel" or "imagined") and `quote.source`, and `flavor.novelNotes`, `flavor.endingHints` and `flavor.flagNotes` (each checked by `validate_schema.ts`: every ending has a note and a hint, every flag a game can set has a note).
- Also optional: `flavor.demoEnd` (the screen a game's demo build stops on; the engine does not know about demos, the game's build does).
- Tools: `record_baseline.ts` re-records a game's behaviour baseline from the reducer (seeded random runs); the projection both tools hash is shared in `project_state.ts`.

## 0.2.0 (2026-10)
- Added `src/campaign.ts`: campaign primitives for code-defined-content games (`pickWeighted`,
  `applyImpact`, `combineImpact`, `applyCeilings`, `endsRun`, `routeNext`, `resolveChoice`, with
  `ChoiceRules` for the three rule families found across 1914, 1922, 1940, 1941: replace vs stack roll
  impact, routing order, roll scaling).
- `tests/campaign-equivalence.test.mjs` proves the primitives match each game's own choice resolution
  (about 140k comparisons across 1914, 1922, 1941, 1940). 1941 and 1940 `logic.ts` now call them.
- No change to the JSON-content engine (Frankenstein): its baseline is unchanged.

## 0.1.0 (2026-10)
- Initial extraction from Frankenstein: `schema.ts` (config/content/flavor contract), pure `reducer.ts`,
  `rules.ts`, `conditions.ts`, `epilogue.ts`. Randomness passed in the action; UI preferences kept out of state.
