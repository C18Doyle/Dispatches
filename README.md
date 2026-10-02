# Dispatches Code

One folder per game. Each is a standalone project (own package.json, src/, scripts/).

| Folder | Status |
|---|---|
| Dispatches Frankenstein | Source imported. `src/engine/schema.ts` drafted. Refactor in progress. |
| Dispatches 1914 | Awaiting source export |
| Dispatches 1922 | Awaiting source export |
| Dispatches 1940 | `src/App.jsx` imported (single 1.5 MB JSX). Full project (build.mjs, assets, package.json) still in the Cowork session outputs. |
| Dispatches 1941 | Imported (dispatches-pacific.jsx, map JSON, map-build tool, theme audio). JSX, not TS. |

Shared engine: lives in `Dispatches Frankenstein/src/engine/` for now. Once it is stable it moves to a shared `engine/` package that every game imports.

## Export prompt (paste into each game's original Cowork chat)
"Write this game's complete unbundled source to Documents\Dispatches\<Game>: src/ (TypeScript/TSX, not the esbuild bundle), scripts/, audio/, assets/, package.json, tsconfig, tailwind and esbuild configs. Normal project folder, not a zip."
