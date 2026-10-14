# Dispatches: Sherlock

Document-driven branching strategy game (React + TypeScript, built with esbuild + Tailwind into one HTML file). You are Sherlock Holmes in 1891, hunting Professor Moriarty: Act I in London (a short spine, then an early fork at scene F1, about the fourth choice, that picks one of four arcs), then one of four roads (Scotland Yard, the Baker Street Irregulars, Mycroft and Whitehall, or flight across Europe to the Reichenbach Falls, which can continue into the years away and the return). It follows the outline of Conan Doyle's *The Final Problem* (1893); most scenes and minor characters are invented. Part of the Dispatches series; the engine is the shared package `../packages/engine` (imported as `@dispatches/engine`). Read its CLAUDE.md before changing it: other games depend on it. The shape is Frankenstein's, re-skinned (see that game's CLAUDE.md for the long form of the rules).

## Layout
- `src/content/sherlock/` game data: `config.json` (rules), `events.json` (scenes, interludes, endings), `flavor.json` (prologue, help, gossip, readings, "In the Canon" notes, flag notes).
- `src/game.ts` the only file that binds this game's JSON to the engine. `src/App.tsx`, `main.tsx`, `ledger.ts`, `runSave.ts`, `sfx.ts`, `index.css` UI; `src/map.tsx` the sketch map (every scene has a place in `SCENE_PLACE`), `src/art.tsx` the line-art plates on the cards. No music files: the atmosphere and every sound are synthesised in `sfx.ts`.
- `claims/canon-notes.json` the register behind the "In the Canon" notes. `scripts/` validators and tests. `tests/fixtures/baseline.json` recorded engine behaviour; `tests/baseline/ui` recorded UI runs; `tests/saves` old saves.

## Story shape
- Gauges (resources, -10..10, crisis card at -7, ruin at -10): **Evidence** (what a court would accept), **Standing** (Yard, magistrates, press), **Nerve** (Holmes's own health). Hidden axes **Heart** and **Company** pick the "How it's remembered" reading (nine of them) and Watson's Notebook lines.
- Branches: `WEB` (Act I), then `YARD` (Y1-Y9 with Y2B, Y5B, Y7B, the study examination YX1-YX3 and a three-step finale Y9/Y9B/Y9C), `STREET` (S1-S8 with S3B, S5B, S6B and a three-step finale S8/S8B/S8C), `MYCROFT` (M1-M8) or `CONTINENT` (C1-C10 with C4B-C7B), then `HIATUS` (H1-H4, the years away).
- **Act I flow**: 1, 2, 3 (a rooftop chase leads through the examination X1-X3), then **F1 "The First Move"** (flags `leanYard` / `leanStreet` / `leanMycroft` / `leanFlight`). Each lean has its own arc: Yard goes 4 (with a side-case detour 4B, K1-K6), Street goes 5 (and 5B), Whitehall goes MA, MB, and Flight goes FA (which can also take the cases). All four meet at 6 (Larch), 7 / 7B (the ledger, with 7D if the break-in is found), 8 (Watson; saying nothing leads to the dray 9 and 9B), 10 (the Professor's visit) and 11, which now only confirms the road (or lets you change it: each road's option is open if you chose it at F1 or earned it since; the Continent is always open).
- **Trust**: four hidden axes `trustWatson`, `trustLestrade`, `trustMycroft`, `trustWiggins` (-4..4; the UI shows any axis whose id starts with `trust`). Options unlock on them with `requires`. **Hard-only options** use `showWhen: { difficulty: "HARD" }`.
- Rolls are called **gambits** in the UI; the engine still calls them experiments (`CONDUCT_EXPERIMENT`). The helper panel is "Baker Street" (Watson's advice, Mycroft's Favour, Overheard talk, Watson's Notebook).
- **Gauge coupling** (`config.coupling`, engine 0.4.0): while a gauge is short, a gain in another is one point smaller; the scene screen says so while it is true. **Repair options** (a night at Watson's, Lestrade vouching) are offered once, to a man at the bottom, and loop back to their own scene.
- Money is pounds, enforced on Hard only. Dates are written 4 January 1891 (UK, no US order), and no on-screen text uses dashes.

## Hard rules
Same as Frankenstein: the engine imports nothing outside its folder; state changes only through `reduce`; rules and numbers belong in `config.json`; story text lives in JSON only; no state libraries; every screen inside `.app-shell` (600px column, works at 375px); gameplay must not change in a refactor (`verify:baseline`).

## Commands
- `npm test` everything below, in order. `npm run typecheck`, `check:boundaries`, `validate:schema`, `check:claims` (canon register), `check:map`, `verify:baseline` (engine, 240 runs), `validate` (exhaustive graph search with dominance pruning, about four minutes: options whose conditions ask for "at most" or "not set" are left out of the search and checked instead for redundancy and by witness runs; ruin endings are proven by witness runs; coupling may only subtract), `check:balance`, `test:saves`, `test:ledger`, `verify:ui` (builds, plays 24 headless runs), `check-a11y`.
- `npm run build` writes `dist/index.html`. `npm run ui:accept` after `verify:ui` when screens changed on purpose; `npm run record:baseline` only for an intended mechanics change.

## Editing content
- Read only the JSON you are changing (events.json is about 190 KB: Grep or ranged Read), then `npm run validate:schema` and `npm run validate`. A flag a scene sets must be read by an echo, an ending variant or a `requiresFlag`, and have a line in `flavor.json` `flagNotes`.
- The exhaustive search keys on the flags that gate options, so a flag that only flavours an ending adds no states. Keep a free option (no gate, no cost) in every scene.
- After a content change: `npm run test:fast`; `npm run ui:accept` if the headless runs changed (check they all still end).
- Bump the run-save key in `App.tsx` and `SAVE_SCHEMA_VERSION` only if `GameState` changes shape; add node aliases to `runSave.ts` when a scene id is renamed.

## Not done
- No release wiring yet: no `itch.json` target, no tag in `release.yml`/`verify-release`, no version beyond 0.1.0. No human playtest (see PLAYTEST.md). Eight claims in `claims/canon-notes.json` rest on the author's memory of the stories and need a reader's check.
