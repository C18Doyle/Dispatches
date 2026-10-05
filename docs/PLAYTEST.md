# Playtesting Dispatches 1914

**Status, stated plainly: no human playtest of 1914 has been run.** Everything below is how to run one. What has been
done instead is automated: 80 seeded playthroughs replay identically (`npm run verify:baseline`), every ending of every
command is reached by simulation (`montecarlo.js`, `check:orphans`), and the historical line of every command is checked
to reach its settled ending in both modes (`check-historical-ending.js`). None of that says whether the game is clear,
fair or worth playing.

## What to ask a tester to do
1. Play one command to an ending on a phone, standard mode, without help. Note where you stopped reading.
2. Play a second command in hard mode.
3. Open the War Record and the Echoes tab. Was anything unclear?
4. Open "A note for the author" on an ending screen and paste the line into a comment on the game's page
   (https://dispatches.itch.io/dispatches-1914#comments) with whatever you want to say.

## What the note contains
`Dispatches 1914 | <command> | <mode> | ending <id> | decisions <n> | marks: <every flag the run set>`. The marks are the
whole path (each decision sets one), so a run can be reconstructed and replayed with `node tools/_trace.cjs`-style
scripts or by setting flags in a test. It carries nothing personal.

## What to look for
- A choice whose consequence was not what its label suggested.
- A date, name, place or number that looks wrong (say which node: the title is in the note's neighbouring text).
- A choice that was greyed out, and whether the reason was clear.
- A screen where the text was too long for a phone.
- Anything a screen reader read badly. Each new screen puts focus on its heading.

## Before trusting the results
Five or six testers is enough to find the big problems and too few to find the balance ones. Balance is measured by
simulation (see each campaign's header in `src/`), not by playtest.
