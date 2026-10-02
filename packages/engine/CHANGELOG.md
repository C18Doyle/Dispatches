# @dispatches/engine changelog

Versioning: the engine is consumed by source path, so the version is a communication tool, not a package
resolution. Bump the minor for new optional capability, the major for anything that needs game changes.
A game's `config.json` `schemaVersion` changes only when that game's saved state shape changes.

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
