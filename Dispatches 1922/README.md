# Dispatches 1922 — unbundled source

This is the editable, pre-build source for Dispatches 1922. The published
game (the single-file HTML you get from the itch.io package or the
Artifact link) is produced FROM these files by a build step — this folder
is not itself playable in a browser.

## Files

- `dispatches-1917.jsx` — the entire game: all four campaigns
  (southRussia, siberia, bolsheviks, provisionalGov17), UI components,
  screens, and game logic. This is the one file nearly all content and
  code changes happen in.
- `entry.jsx` — the React entry point that mounts the game.
- `input.css` — Tailwind source stylesheet.
- `tailwind.config.js` — Tailwind config.
- `prelude.html` — the HTML shell the build wraps everything in.
- `package.json` / `package-lock.json` — dependencies.
- `check-*.js`, `walk-historical.js` — the custom validators (gates,
  bulletins, continuity, flag values, advisor coverage, full historical
  playthroughs). Run each with `node <script>.js dispatches-1917.jsx`.
- `monte-carlo.mjs` — seeded random-play simulation on the real game logic: gate-bite rate and ending reachability (`node tools/monte-carlo.mjs 3000 [--hard]`).
- `test-round23.js`, `test-round24.js`, `test-save-resume.js` — jsdom
  behavioral UI tests (require a built `bundle_test.js` — see Build below).
- `HANDOVER.md`, `CIVILWAR_EXPANSION_PLAN.md`,
  `IMPROVEMENT_RECOMMENDATIONS.md`, `VALIDATION_REPORT.md` — project docs
  carried over from the build environment.

Not included: `node_modules/` (regenerate with `npm install`), and the
`geo/` map-generation scratch directory (geojson sources, one-off Python
scripts, and sanity-check PNGs used to generate the baked-in front-map
coordinate data) — ask if you want that too, it's a separate, heavier
pipeline from the game source itself.

## Build

```
npm install
npx tailwindcss -i input.css -o output.css --minify
npx esbuild entry.jsx --bundle --minify --format=iife --jsx=automatic --platform=browser --outfile=bundle.js
```

Then concatenate `prelude.html` + `<style>{output.css}</style>` +
`<div id="root"></div>` + `<script>{bundle.js}</script>` into one HTML
file — that final file is the playable, publishable game.
