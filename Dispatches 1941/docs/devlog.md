# Dispatches 1941: devlog, October 2026

Dispatches 1941 is the Pacific war from two chairs: Imperial General Headquarters (`japan`) and CINCPAC (`alliedPacific`). This log covers the month that brought it up to the standard of Dispatches 1940: what was done, in the order it landed, what broke on the way, and what is still open. Pull request numbers are the repository's (C18Doyle/Dispatches).

## Where it stands

- 139 reports, 60 gallery endings, two commands, three difficulties plus the two hard modes (Fanatical Resolve for IGHQ, Coalition Resolve for CINCPAC).
- Advisers argue third-person positions (332 of them). Four real quotations are marked as such and logged.
- Three Orders of Battle: Midway (CINCPAC), the November battles off Guadalcanal (IGHQ) and the Philippine Sea (CINCPAC).
- A 72-term glossary, a "What this game leaves out" section, a command rank on the end screen, a theater map of 36 regions dated by the day.
- The UI baseline is 64 headless playthroughs. The audit and test scripts (logic, reachability, advisers, outcome sign, endings, rolls, map, glossary, battle balance, undefined names, writing, quotations, accessibility, battle resume, saves) run in `npm run test:fast`.

## What was done, in order

### Advisers, facts and writing (#39, #41)
- All 337 adviser lines had been written as invented first-person speech. Each is now a third-person position ("Adm. Nagano argues: ..."). The four lines that are real quotations keep speech marks and are logged in `claims/quotations.json` with their source; `tools/check-quotations.cjs` fails on an unlogged one.
- About 600 passages were rewritten: speculative reports now say so in their first sentence, commentary about the game itself ("the likelier outcome, and the one history's own...") was removed, and the briefs were cut to a sentence or two.
- Every report was read against the standard histories. Corrections include the Doolittle Raid casualties, Bataan prisoner numbers and POW death rates, the Hull Note date and the Proposal B that preceded it, the date the Kido Butai sailed, Kokoda, Ke-Go, Attu, Savo, Tarawa, Lockwood's torpedo tests (1942, in Australia), the Franck Report (Compton did not sign it, so the adviser is now Franck), and the bat-bomb node's date. Sources and what is still unchecked are in `claims/facts-round1.json`.
- Advisers and titles now match the month: Yamamoto no longer advises in 1944, and a post is shown as held in that month (`ADVISOR_TITLE_BY_DATE`).
- No em dashes in on-screen text (`tools/check-writing.mjs`, `docs/WRITING.md`).

### The audit suite (#40)
Ported from 1940 and built on the game's own rules (`tools/audit-lib.mjs`): reachability (20,000 random wars per command plus the hard modes), adviser dates against reviewed tenures, outcome sign, endings and the ranks they give, orphans. Fourteen ending titles that no war could produce were removed, and thirteen stale classifications.

### Meters, difficulty and Easy mode (#42)
- The meters work as in 1940: green up, red down, sliding bars, and three readings under each (Readiness: Training, Forces, Morale; Pipeline: Fuel & Oil, Shipping, Industry; Initiative: Intelligence, Command, Tempo).
- Difficulty is chosen in the war room (Easy, Normal, Hard), each with a plain summary. Easy has its own fun names (Shinano Command for IGHQ, Mark 14 Command for CINCPAC), shows what each choice does to the meters, marks the choice the record made, and allows rewind. Not in the demo.

### Rank, end-screen map, rolls (#43)
- The end screen gives a command rank, Private to General, out of 100, from five things the player can see: how the war ended, the condition of the command, the battles, the decisions against the record, and the objectives.
- The end screen carries the theater map with a slider to review the war report by report.
- Five contested rolls that ignored the state of the war now respond to a meter, as the other 36 already did (`check-rolls` fails on a flat one).

### Glossary and what the game leaves out (#44)
72 terms, underlined with dots on first mention in a report. A "What This Game Leaves Out" section on the title page covers Nanjing, Unit 731, the forced brothels, the prisoners and internees, and what the Allies did, in plain terms and kept outside the decisions. The source choice for that section is still the author's to confirm.

### The Order of Battle (#45)
Ported from 1940. The player places a pool of effort across four arms, picks a commander and one of two approaches, buys intelligence on the enemy's hidden setup (or lets the staff plan), makes a field decision, and reads the battle as dispatches before the roll. The plan moves the roll by at most 30 points and costs the meters at most one a meter and two in all; the next report says how the battle was fought. Choices that open a battle are marked "Leads to battle planning". A battle can be put down and picked up (Save and leave the field). The hard modes put orders from above on each battle.
- `tools/check-battle-balance.mjs` evaluates the engine in a sandbox and fails on a hedge exploit, a staff plan worse than careless play, no reason to read the enemy, or a registry that does not match its hosting choice.
- `tests/battle-resume.test.mjs` saves in the planning screen and in the report, resumes in a fresh page and damages the save.
- `tools/check-undefined.mjs` type-checks the assembled `App.jsx` and fails on a name used and never declared. The parts share one scope and nothing else catches this.

### The map (#47)
- China was one polygon marked "contested" for five years. It is now eight zones, the Dutch East Indies five and the Philippines three. The Manchuria pin became the Manchukuo polygon.
- `tools/split-pacific-zones.mjs` cuts them from the country outlines along straight lines (Node only; there is no Python on the machine). It checks that every landmark city falls in its zone and that no area is lost. The borders are schematic and the code says so.
- The map showed the end of the report's year, which gave away the year's outcomes. It now shows the state on the day the report opens (`MAP_TIMELINE`, as in 1940), the slider steps back month by month, and the end screen uses the same dates.
- `check-map` checks the timeline, the year-end table derived from it, every route, and that every report's date can be read. Dates and what is unchecked: `claims/map-dates-round1.json`.

### Strain and arrears (#48)
A meter below -4 takes points off the best outcome of the contested decisions it touches (up to 12, shown in red on the decision, and used by the roll). What a cost takes below -10 is owed (up to 3, kept in the save) and paid before later gains raise the meter. The audits play stages through the same function the app does.

### Interface and accessibility (#49)
A first-run guide on the first report; map labels with a halo (they were unreadable on the dark red of a Japanese-held zone); unique map ids; a text summary of the map for a screen reader; `check-a11y` (names, ids, heading levels, alt text, focus, palette contrast); the UI baseline widened from 24 to 64 runs.

## What went wrong, and what it taught

- **A subagent, against the standing rule.** Fact lookups were once handed to a subagent. It was disclosed to the author at once, and later lookups were done directly with web search.
- **The hover bug (found by the author's screenshot).** A hovered choice went black with black text. The cause was an old fallback stylesheet injected unlayered, which beats Tailwind v4's layered utilities whatever their specificity, so `hover:text-white` lost to `text-black`. The same stylesheet sits in 1940 and the fix (wrapping it in `@layer utilities`) went to both (#46).
- **Two battle facts were wrong at first writing**: Kusaka commanded the 11th Air Fleet in November 1942, not the Southeast Area Fleet, and Rabaul is about 650 miles from Guadalcanal, not 560. Caught while checking the map dates, fixed in #47. The lesson is the claims register: anything from memory is marked `unchecked` in the file, and the file is the to-do list.
- **CI.** #42's first run timed out at an hour and passed on a rerun. A UI baseline records page text, so any change to a screen's text re-records all of it; read the first-difference step before accepting.
- **Shell quoting.** Patch scripts with regexes or backslashes fail in the shell; they were written with the file tool, with a replacement-count assert per edit.

## Open

- Unchecked rows in `claims/map-dates-round1.json` and `claims/battles-round1.json` (many map dates, and Vice Admiral Calhoun's post as commander of the Service Force).
- More battles: Watchtower (drafted, not committed), Okinawa on both sides, Iwo Jima on both sides, Sho-Go. Each needs a win/loss roll added to its hosting choice and a speculative "loss" outcome.
- More nodes into JSON (twenty Allied Pacific nodes are there now).
- Early branching (China/Burma, the Indian Ocean, Soviet entry) and release readiness (a `PLAYTEST.md`, itch targets, a demo funnel) were not started.
- Month-level dating of the overrides (they are still year-level).
- Nobody has played the new battles or read the Pacific zone borders who knows the ground.
