# Dispatches: Dracula

Document-driven branching strategy game (React + TypeScript, built with esbuild + Tailwind into one HTML file), on the shared engine `../packages/engine` (imported as `@dispatches/engine`). It began as a copy of Frankenstein's shell with new content, so the two games work the same way. Read the engine's CLAUDE.md before changing anything in it: other games depend on it.

**The game is the Count's.** You are Count Dracula, from the castle in April to the last choice at the end of the passage. Act I (castle, boxes, voyage, Whitby, Carfax) is the same for everyone. Act II is one of three tracks, chosen at Carfax: the Quiet Colony (patience), the Court at Carfax (dominion, a household of the marked) and the Storm (wolves, rats and fog). Fifteen endings: four on each track and three collapses.

**Mina's campaign is the second seat.** It is complete (40 scenes, 15 endings), kept in `src/content/mina/`, checked on every `npm test`, and offered on the title page (a button switches seats). See "The second seat" below.

## Layout
- `src/content/<seat>/`: `config.json` (rules), `events.json` (scenes, interludes, endings), `flavor.json` (prologue, help, table talk, epilogues, ending notes, flag notes), `ui.json` (the words around the story: titles, labels, the adviser's panel; shape in `src/seat.ts`) and `checks.json` (what `scripts/validate.ts` needs to know about the seat). Seats: `dracula` (the Count, the default) and `mina`.
- `src/seats.ts` holds both seats' JSON (`SEATS`), says which is playing (`chosenSeatId`: the stored choice in localStorage `dispatches_dracula_seat`, else the build's `--seat=`, else the Count; the demo is always the Count) and switches (`switchSeat` stores the choice and reloads). `src/game.ts` binds the playing seat to the engine as `def`, `ui` and `book`. `@seat/*` (tsconfig paths) still resolves to `src/content/dracula/` for the type-checker, not for the bundle.
- `src/App.tsx`, `main.tsx`, `sfx.ts`, `index.css` UI. `src/ledger.ts` the Ledger. `src/runSave.ts` saved-run parsing. `src/demo.ts` the demo lock.
- `src/themes.json` + `src/theme.ts` the themes (palette tokens become CSS variables; tailwind colours read them); `src/art.tsx` the artwork (SVG in code, coloured by the theme's `art` block). Add a theme by adding an entry to `themes.json`; `npm run check-a11y` checks it.
- `ui.json` `tracks`: each Act II track's plate (picture place, epigraph) and page-glow colour (`--track-tint`); the plate shows on the first scene of the track (`trackPlate` in `App.tsx`).
- `src/card.ts` the share card (canvas PNG of an ending). `src/fonts/` the embedded font files (`scripts/fetch_fonts.mjs` downloads them, cut to the characters in `_chars.txt`; `scripts/lib/fonts.mjs` turns them into @font-face data URIs at build; `npm run check:fonts` checks coverage).
- `itch/` the cover, screenshots and page copy for itch.io (nothing there is uploaded by any script).
- `src/score.ts` the generated score (Web Audio; no audio file). `src/RouteMap.tsx` the route map, drawn from `ui.json`'s `map`.
- `claims/novel-notes.json` every statement the game makes about the novel; `claims/source/dracula-1897.txt` the Gutenberg text (data only). `src/content/<seat>/book.json` the book's road (scenes where the novel's Count does something the game can follow).
- `SCENE_MAP.md` / `SCENE_MAP.mina.md` generated: the scene diagram and the flag table.
- `scripts/` checks. `tests/fixtures/baseline.json` the Count's recorded behaviour; `tests/fixtures/mina-baseline.json` Mina's; `tests/baseline/ui` recorded screens; `tests/saves` committed saves.

## What is Dracula-specific (the Count)
- Reserves (all -10..10, start 0, crisis at -7, collapse at -10): `strength`, `secrecy`, `dominion`. Hidden axes: `manner` (terror low, courtesy high) and `longing` (cold low, lonely high); they pick the nine epilogue readings and open the hidden endings. Money is gold from the castle chest and only matters on Hard.
- The assist character is the Children of the Night (wolves, rats, owls): advice (shows the costs), a night's hunting (`usedTheNight`, the favour), what the rats heard (`flavor.gossip`, each line carries its speaker) and what the old wolf thinks of you (`flavor.creatureReportLines`, keyed by the hidden axes). The engine's field names are Frankenstein's; the words are in `ui.json` and `flavor.json`.
- A "venture" is the engine's roll (`CONDUCT_EXPERIMENT`). The UI says venture; the engine and the JSON still say roll and experiment.
- Act I side scenes (`2-JOURNAL`, `6-SZGANY`, `10-HARBOUR`) work as doors that loop back: scene 2, 6 or 10 has an extra option with `showWhen: { not: { flag: "<x>Settled" } }` that leads to the side scene, whose three options all set that flag and return to the main scene (so the door is gone when you come back). Use the same pattern for any optional beat; the validator copes because the flag changes the state.
- Difficulties differ in rules, not only in what is shown: `strainScale` and `startBonus` in `config.difficulties` (engine 0.7.0; always use `strainFor(config, difficulty)` and `startResourcesFor`, never `config.strain` or `r.start`, where odds or starting reserves are worked out). `npm run check:balance` prints collapse rates per difficulty and requires Easy <= Medium <= Hard.
- Scene ids: `1`..`11`, `9-X`, `10-QUIET`, `11-ASYLUM`, `11-PLAN` are Act I (branch `UNIVERSAL`); `12A`..`19A` (`QUIET`), `12B`..`19B` (`COURT`), `12C`..`19C` (`STORM`). A `-X` suffix (`9-X`, `15A-X`, `16B-X`) is where a failed venture leads. Endings: `ENDING_1A`..`1D`, `2A`..`2D`, `3A`..`3D`, and `ENDING_CRISIS_<RESERVE>` (the validator derives that name from the reserve's id).
- What Mr Harker teaches you in scene 2 (`knowsLaw`, `knowsManners`, `knowsCity`, `knowsDoctors`) opens options later. How many boxes you ship (scene 6) decides which endings can open (`reserveBoxes`).
- Engine 0.5.0 fields used here: `Option.tag` (the "Before dawn" badge, text from `ui.tags`) and `GameConfig.trackers` (the "Beds in England" counter: a base plus rule deltas, shown when `showWhen` holds).
- Statements about the novel: add a claim to `claims/novel-notes.json` (a passage that must be in the text, in the named chapter) when a scene or ending note says what the book does. A choice quotation that is Stoker's own words is marked `quote.kind: "novel"` with `source: "Chapter <Roman>"`; `npm run check:quotations` finds it in the text. Find a passage with `node scripts/find_in_novel.mjs <words>`.
- The year is never named, because the novel does not name it, and the Count's age is never given.

## The second seat (Mina)
- Content: `src/content/mina/` (the same five files). Her Act I is Whitby to the council at Purfleet, then three tracks: the Sacred Rite, the Modern Hunt and the Tie. `config.json` has `"id": "mina"`, so her saves, ledger, settings and theme are stored under their own keys. Her `ui.json` carries `switchSeat`, `defaultTheme` (the light Journal look) and `art` (which picture each scene and ending gets, since she has no map).
- `npm run check:mina` (part of `npm test`) validates her schema, writing, repetition, behaviour baseline (`tests/fixtures/mina-baseline.json`), exhaustive search and balance, then builds a bundle that starts on her seat (`npm run build:mina` writes `dist/mina/index.html`; every bundle contains both seats) and plays it through the real screens.
- Not done yet: a track-by-track rewrite of her `flavor.json` for the Ledger, a route map for her, and echoes between the seats (the Count's `harkerDead`, `harkerFree`, `lucyAtWindow`, `minaMarked` and the rest are the flags her scenes assume).
- Her scenes are written from the other side of the same events: the wolf at Lucy's window, the night visit to Mina's room, the sealed boxes at Carfax. Keep the two consistent when either changes.

## Hard rules
1. The engine imports nothing outside its own folder: no React, no DOM or browser globals, no storage, no JSON, no `Math.random`/`Date`. Randomness arrives in the action.
2. State changes only through `reduce(def, state, action)`. UI-only state lives in React `useState`, never in `GameState`.
3. Every JSON file must conform to `schema.ts`. Change the schema first, then the JSON, then the field tables in `../packages/engine/tools/validate_schema.ts`.
4. Rules and numbers belong in `config.json`. Do not hardcode resource names or ranges in the engine or UI (`App.tsx` draws the meters from the config and every seat-specific word comes from `ui.json`).
5. Story text lives in JSON only.
6. No external state libraries.
7. Every screen renders inside `.app-shell` (`max-width: 600px`). Keep layouts working at 375px wide with no horizontal scroll.
8. Writing follows `../docs/WRITING.md`: no em dashes, plain words, no "not X but Y". `npm run check:writing` fails on an em dash or a stock word and lists the other shapes.
9. Gameplay must not change in a refactor. `npm run verify:baseline` replays 240 recorded runs and `npm run verify:ui` replays 24 runs through the real screens.
10. The Count's seat does not show what he does to the people he feeds on, and does not make a game of it. Keep it to what the novel's own documents imply.

## Commands
- `npm test` runs everything below, in order (typecheck, boundaries, schema, writing, repetition, names, voice, labels, quotations, claims, scene map, baseline, validate, balance, saves, ledger, UI baseline, layout, demo, a11y, Mina's seat). It takes about ten minutes.
- `npm run validate` is the exhaustive search: every scene, ending, lock and `showWhen` option reachable on every difficulty, every flag read, every title unique. It runs in under a minute because a state is identified only by what the rest of the story can still read (see the header of `scripts/validate.ts`). `GAME=mina npm run validate` checks the other seat (on Windows, use `npm run check:mina`).
- `npm run check:balance` plays 600 runs under random, cautious, bold, fallible (a sensible player who misjudges the numbers) and one ruin player per reserve; Hard must cost the fallible player at least 15% of runs, every failure ending must be reached by play, and no option may be worse than a neighbour on every reserve (Mina's `checks.json` allows the 62 she has).
- `npm run check:names` (one name per person, `names.json`), `check:voice` (machine-written habits), `check:labels` (no words typed into the screens: they live in `src/labels.json`, seats may override with `ui.labels`) and `check:layout` (needs a build; `check:layout:all` runs all four looks).
- `npm run record:baseline` re-records the behaviour baseline after an intended change. `npm run ui:accept` accepts the UI baseline after `npm run verify:ui` shows the differences you meant.
- `npx tsx scripts/transcript.ts <seed> <EASY|MEDIUM|HARD> <option index at each scene, comma separated>` prints one scripted run as a player would read it. Use it to read a change in context.
- `npm run check:repetition` counts repeated phrases, sayings used as option details, passages ending on a saying, and over-used words (limits at the top of the script). `npm run report:options` plays 4500 runs and says which options or endings nobody chooses or reaches. `npm run map` rewrites `SCENE_MAP.md` (do it after any scene or flag change; `check:map` fails when it is stale).
- `npm run build` writes three things: `dist/index.html` (the web copy, both seats), `dist/download/` (the same page built with `--pwa`, plus `manifest.webmanifest`, `sw.js`, icons and a README, from `src/pwa/`; works offline and installs from an https host) and `dist/demo/index.html` (the Count's Act I only, locked at the first scene of Act II; Mina's module is replaced by `src/seat-mina.stub.ts`, so her story is not in the file). The release zips each as `full`, `download` and `demo` (`package.json` `release`); `itch.json` says where each is pushed.

## Working here cheaply
- Story or balance edit: Grep `events.json` for the scene id, edit it, then run `validate:schema`, `check:writing`, `validate` and `check:balance`. `events.json` is large; never read the whole file.
- Every flag a choice sets needs a note in `flavor.flagNotes` and a reader: an echo under a later scene, an ending variant, a lock, or a gossip entry. The validator fails otherwise.
- A choice that takes money must leave at least one option in the scene that costs nothing, or Hard can lock a player out.
- A scene reached from a roll's failure branch names its own `nextNodeId` on that branch (see `9-X`).
- Gossip lines carry their speaker in the text ("A rat in Dr Seward's wall: ..."). Choice quotations are imagined; none is Stoker's own sentence (see `PLAYTEST.md`).

## Gotchas
- The run-save key is `<config.id>_run_save_v1`. Change it whenever `GameState` changes shape.
- Seat, theme, run save, ledger and settings are all stored under the seat's config id; the seat choice itself is `dispatches_dracula_seat`.
- The `.dread-veil`, banners and sounds read the lowest reserve (`dread` in `App.tsx`); a new seat's resources need `crisisAt` for the veil to reach its second level.
- The score is generated at run time (`src/score.ts`); there is no audio file. It follows `mood` in `App.tsx` (screen, track, lowest reserve).
- Both seats' `events.json` were generated once from scene scripts and then tuned; edit them directly from here on. A writing pass (the Count's) was applied as id-keyed replacements; keep an option's `detail` a description of what it does and risks, not a saying, and do not let an outcome repeat the opening of the ending it leads to. `check:repetition` will tell you.
- This folder syncs to OneDrive when it lives there. Exclude `node_modules/`.
