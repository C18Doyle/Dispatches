# Playtesting Dispatches: Frankenstein

**Status, stated plainly: no human playtest of this game has been run.** What exists is automated. 240 recorded runs replay identically through the
rules (`npm run verify:baseline`); an exhaustive search of about 2.1 million game states reaches all 15 endings and every option on every difficulty
(`npm run validate`); three simulated players (random, cautious, bold) collapse and finish at sane rates (`npm run check:balance`); 24 headless
playthroughs through the real screens replay identically (`npm run verify:ui`); and the screens are checked for names, headings, focus and contrast
(`npm run check-a11y`). None of that says whether the game is clear, fair, frightening or worth finishing.

## What to ask a tester to do
1. Play to an ending on a phone on **The Natural Philosopher** (Medium), without help. Note where you stopped reading.
2. Play again on **The Debtor** (Hard). Did the purse change how you chose, or only annoy you?
3. On the ending screen, read "What You Carried" and "In the Novel". Did the first match what you remember doing? Was the second interesting or a lecture?
4. Open the Ledger from the title page. Could you tell where to look for an ending you had not found?
5. Press Copy Summary and paste it into a comment on the game's page, with whatever you want to say.

## What the summary contains
Three lines: the game and the ending title; the difficulty, the number of choices and experiments, and the three meters; and what the run carried (the
witnesses, debts and flaws it left behind, in words). It carries nothing personal, and it is enough to tell which path was played.

## What to look for
- An experiment whose odds felt wrong (they are shown before you commit, and strain says so when a shortage makes them worse).
- A choice that was locked and a lock whose reason was unclear (the hidden Voice and Bond are deliberately not named).
- A scene that echoed an earlier choice you did not make (the italic lines under a scene's description). That is a bug.
- A line in italics under a choice that has a volume and chapter: is it really the book's? The check proves the words are in the 1818 text and in that chapter, not that the
  line suits the choice.
- Anything a screen reader read badly. Every screen puts focus on its heading.
- A screen where the text is too long for a phone.

## For a reader who knows the novel
`claims/novel-notes.json` lists, ending by ending, everything the "In the Novel" notes say. The passages behind the "fact" and "reading" claims are checked
against the 1818 text by `npm run check:claims`. Four "absence" claims (Victor never burns his laboratory; there is no army of creatures; he takes no post and
publishes nothing; the creature never speaks before a crowd) cannot be shown by a passage. They were checked by reading, and a reader who knows the book should
confirm or correct them. The chapters are the 1818 edition's (three volumes); the later 1831 text numbers them differently.

## The demo
`npm run build` also writes `dist/demo/index.html`: the same game, stopped on the three climax scenes (the last choice of each track), where it shows a
"Here the Demo Ends" screen. A run that collapses first (a resource driven to ruin) still ends normally in either build.
`npm run check:demo` plays both builds and checks that. Whether the demo should stop there, or earlier or later, is a question for playtesters too.

## Before trusting the results
Five or six testers will find the big problems and too few to find the balance ones. Balance is measured by simulation (`scripts/balance_check.ts`), not by playtest.

## Decisions waiting for the author
- Release 1.1.0 covers strain, twelve more experiments, three new endings, the Ledger, the quotations and the demo (see the changelog). 1.0.0 was the migration baseline and was never published.
- Whether a reader who knows the book signs off the four "absence" claims before release.
