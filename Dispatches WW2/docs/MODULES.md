# From one assembled file to real modules

Status (November 2026): plan written; first slice done (`src/shell-core.js`). Nothing else has moved.

## Why

`src/App.jsx` is about 50,000 lines and 4 MB, assembled from 26 parts in `src/parts/` that share one scope (`npm run assemble`, checked by `npm run roundtrip`). That has served the game well: any part can use any name, and the UI baseline proves each change. Its costs grow with the game:

- **No code-splitting.** The bundle (about 10 MB) carries all six commands, both maps and every battle, though a player opens one command at a time.
- **No boundaries.** A part can depend on any other part's names without saying so; `tools/check-undefined.mjs` exists to catch a name that was never declared.
- **Tools read text.** Many checks find what they need by slicing `App.jsx` or a part as text (the `PACIFIC_MAP` closure, the `SPECIAL_EVENTS` array, the parts list for translations).

## Where it should end

- `src/app/` holds modules in place of the parts: one per command's campaign (`campaigns/german.jsx` …), the shared registries (`registries/…`), the maps, the battle screens, the report screens, the app shell, and `App.jsx` as a small root that imports them.
- Each command's campaign, battles and map data load with `import()` when the command is picked (esbuild `splitting: true` with `format: "esm"`).
- The tools load the modules through esbuild (as `packages/testkit/src/load-campaigns.mjs` already does for `App.jsx`) instead of slicing text.
- `assemble`, `split` and `roundtrip` are retired at the end, not before.

## Order (each step a PR with the UI baseline identical)

1. **Leaf modules that import nothing of the game.** Done: `src/rules.ts`, `src/logic.ts`, `src/logic-pacific.ts`, `src/effort.ts`, and now `src/shell-core.js` (settings kept between visits, full screen, crash reports, keyboard and controller). Part 00-head imports them.
2. **The shared style and registries** (`paper`, `STATUS_LABELS`, `localiseDate`, the date and meter helpers): a module the screens import. This is what lets the rest of part 47 (the settings rows, the menu, the journal, the records) become a module.
3. **The campaigns** (parts 10 to 16, with `src/data/*.json`): one module per command exporting its campaign object; `CAMPAIGNS` becomes a map of loaders. The composite commands (part 16) import their two source files.
4. **The registries built from the campaigns** (parts 20, 29: atlas, notes, forks, intel): modules that import the campaigns they read.
5. **The maps** (parts 30, 33, 36, 37): the Pacific map is already a closure (`PACIFIC_MAP`), which makes it the easiest.
6. **The screens** (parts 25, 26, 35, 38 to 46) and **the app** (part 50).
7. **Code-splitting**: `CAMPAIGNS[id]` loaded with `import()` on the war-room screen; a loading state there.
8. **Retire** `assemble`, `split`, `roundtrip` and `check-undefined` (TypeScript's own checking covers it once names are imported).

## What has to change in the tools

These read `App.jsx` or `src/parts/*` as text today: `add-missing-atlas`, `balance`, `check-battle-sketch`, `check-conditions`, `check-events`, `check-map`, `check-map-front`, `check-map-ops`, `check-orphans`, `check-share-card`, `check-staffs-reading`, `check-structure`, `check-undefined`, `i18n`, `split-ussr-zones`, `tests/migration.test.mjs`, and in the test kit `migration-check.mjs` and `split.mjs`. Each moves to loading the module it checks (through esbuild) when that module moves, in the same PR. `tools/i18n.mjs` reads `src/shell-core.js` as of the first slice; every new module with interface text must be added to its list.

## Risks

- **Circular imports.** The registries read the campaigns and the screens read both; a careless cut makes a cycle that esbuild accepts and that fails at run time. Step 2 exists to break the worst of them first.
- **A zip opened from disk.** Split chunks are loaded with `import()`, which a browser blocks for `file://` pages. The download variant should stay one bundle (esbuild without splitting); the web and Steam builds can split.
- **Behaviour.** Every step must leave the 96-run UI baseline identical (`npm run verify:baseline`) and the save fixtures loading; a step that changes either is not a refactor.
