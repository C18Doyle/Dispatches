# Dispatches Code

One folder per game. Each is a standalone project (own package.json, src/, scripts/).

| Folder | Status |
|---|---|
| Dispatches Frankenstein | Refactored: pure engine in `src/engine/`, content in JSON, `npm test` green, baseline-verified. See its CLAUDE.md. |
| Dispatches 1914 | Source is in a Cowork container (`/mnt/user-data/outputs/dispatches-1918/`, 16 files in `src/`). Not on disk yet. |
| Dispatches 1922 | Imported (`dispatches-1917.jsx` is the 1922 game; validators, tests, docs). `geo/` map pipeline left out. JSX. |
| Dispatches 1940 | `src/App.jsx` imported (single 1.5 MB JSX). Full project (build.mjs, assets, package.json) still in the Cowork session outputs. |
| Dispatches 1941 | Imported (dispatches-pacific.jsx, map JSON, map-build tool, theme audio). JSX, not TS. |

Shared engine: lives in `Dispatches Frankenstein/src/engine/` for now. Once it is stable it moves to a shared `engine/` package that every game imports.

## Export prompt (paste into each game's original Cowork chat)
"Write this game's complete unbundled source to Documents\Dispatches\<Game>: src/ (TypeScript/TSX, not the esbuild bundle), scripts/, audio/, assets/, package.json, tsconfig, tailwind and esbuild configs. Normal project folder, not a zip."
