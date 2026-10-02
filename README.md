# Dispatches Code

One folder per game. Each is a standalone project (own package.json, src/, scripts/).

| Folder | Status |
|---|---|
| Dispatches Frankenstein | Refactored: pure engine in `src/engine/`, content in JSON, `npm test` green, baseline-verified. See its CLAUDE.md. |
| Dispatches 1914 | Imported (split src/, validators, CLAUDE.md; the game is titled 1918 internally). JSX. |
| Dispatches 1922 | Imported (`dispatches-1917.jsx` is the 1922 game; validators, tests, docs). `geo/` map pipeline left out. JSX. |
| Dispatches 1940 | Full source imported (src/App.jsx ~1.9 MB, build.mjs, tools, docs, maps). JSX; own audit scripts. |
| Dispatches 1941 | Imported (dispatches-pacific.jsx, map JSON, map-build tool, theme audio). JSX, not TS. |

Shared engine: `packages/engine/` (`@dispatches/engine`), imported by each game through a tsconfig path alias. Amend it there; each game must stay green (`npm test`).

## Export prompt (paste into each game's original Cowork chat)
"Write this game's complete unbundled source to Documents\Dispatches\<Game>: src/ (TypeScript/TSX, not the esbuild bundle), scripts/, audio/, assets/, package.json, tsconfig, tailwind and esbuild configs. Normal project folder, not a zip."
