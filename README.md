# Dispatches Code

One folder per game. Each is a standalone project (own package.json, src/, scripts/).

| Folder | Status |
|---|---|
| Dispatches Frankenstein | Refactored: pure engine in `src/engine/`, content in JSON, `npm test` green, baseline-verified. See its CLAUDE.md. |
| Dispatches 1914 | Builds; logic layer already pure (reference shape); 24-run headless UI baseline; validators/smoke/render green (Ottoman gate fails on purpose). See its CLAUDE.md. |
| Dispatches 1922 | Builds. Pure run logic in `src/logic.ts`; 48-run headless UI baseline; shipped crash fixed; validators green. Content still code in App.jsx. See its CLAUDE.md. |
| Dispatches 1940 | Builds (no-zip on Windows). Pure run logic in `src/logic.ts`; 48-run headless UI baseline; audit tooling repaired. Content still code in App.jsx. See its CLAUDE.md. |
| Dispatches 1941 | Builds (full + demo). Pure run logic extracted to `src/logic.ts`; 24-run UI baseline; shipped crash fixed. Content still code inside App.jsx. See its CLAUDE.md. |

Shared engine: `packages/engine/` (`@dispatches/engine`), imported by each game through a tsconfig path alias. Amend it there; each game must stay green (`npm test`).

## Export prompt (paste into each game's original Cowork chat)
"Write this game's complete unbundled source to Documents\Dispatches\<Game>: src/ (TypeScript/TSX, not the esbuild bundle), scripts/, audio/, assets/, package.json, tsconfig, tailwind and esbuild configs. Normal project folder, not a zip."
