# Playtesting Dispatches: Dracula

**Status, stated plainly: no human has played this game.** What exists is automated, and one check against the printed novel. 240 recorded runs replay
identically through the rules (`npm run verify:baseline`); an exhaustive search reaches every scene, all 15 endings and every lock on every difficulty
(`npm run validate`); three simulated players (random, cautious, bold) collapse and finish at sane rates (`npm run check:balance`); 24 headless playthroughs
through the real screens replay identically (`npm run verify:ui`); the screens are checked for names, headings, focus and contrast (`npm run check-a11y`); the
text is checked for em dashes, stock words and repeated habits (`npm run check:writing`, `npm run check:repetition`); and every statement the game makes about the
book, and every line that is Stoker's own, is checked against the 1897 text (`npm run check:claims`, `npm run check:quotations`). None of that says whether the game
is clear, fair, frightening or worth finishing.

The player is the Count. That is a deliberate and uncomfortable choice, made by the author, and a tester's reaction to it matters more than any number above.

## What to ask a tester to do
1. Play to an ending on a phone on **The Nobleman** (Medium), without help. Note where you stopped reading.
2. Play again on **The Exile** (Hard). Did the gold change how you chose, or only annoy you?
3. Choose a different track at Carfax (the Quiet Colony, the Court, the Storm). Did it feel like a different game, or the same one with new scenery?
4. On the ending screen, read "What You Carried" and "In the Novel". Did the first match what you remember doing? Was the second interesting or a lecture?
5. Open the Ledger from the title page. Could you tell where to look for an ending you had not found?
6. Press Copy Summary and paste it into a comment on the game's page, with whatever you want to say.

## What to look for
- **On the new look:** which of the four themes people choose, and whether the dark red edge when a reserve runs low reads as tension or as a fault. Whether the sound effects help or annoy.
- **A phone check nobody has done:** play on a real Android phone and a real iPhone (Safari and Chrome), including the Save Card button and the share sheet.
- A venture whose odds felt wrong (they are shown before you commit, and strain says so when a shortage makes them worse).
- A choice that was locked and a lock whose reason was unclear (the hidden Manner and Longing are deliberately not named).
- A scene that echoed a choice you did not make (the italic lines under a scene's description). That is a bug.
- Anything that reads like the writer was in a hurry: a repeated phrase, a sentence that says nothing, a scene that explains its own point.
- **Whether playing the Count is too comfortable.** The game does not show what he does to the people he feeds on, and gives the player reasons to restrain as well as to take. If a tester finds it glib or finds the restraint false, say which scenes.
- Anything a screen reader read badly. Every screen puts focus on its heading.
- A screen where the text is too long for a phone.
- Strength falls on any path that never feeds. That is deliberate; say whether it felt unfair or only tense.

## For a reader who knows the novel
The novel's text (Project Gutenberg #345) is in `claims/source/` and the game's statements about it are in `claims/novel-notes.json`, each with a passage found in the named
chapter. A first pass against the text corrected several things written from memory (the carriers, the box counts, the Suicide's Seat, the Demeter's crew). What a passage
cannot show is that the novel never does something. Four such claims are left for a reader to confirm or correct:
- The Count never travels with a household to Antwerp or anywhere else.
- London is never put under fog for days by the Count.
- The Count never makes a stand at Carfax.
- The Count never carries Mina with him to the pass.

Also worth a reader's eye: the "In the Novel" notes (the ending screen), the nineteen "Book's Road" notes, and the places where the game says what the book does about the three women
(it gives them a night's hunting on the hill pastures in place of the living child the book gives them, and says so only by what it leaves out).

## The demo
`npm run build` also writes `dist/demo/index.html`: the same game, locked at the end of Act I. On arriving at the first scene of a track, the player sees an
"End of Act I" screen: all of Act I has been played, including the choice that decides the track, and none of Act II. A run that collapses first (a reserve
driven to -10) still ends normally in either build. `npm run check:demo` plays both builds and checks that. Whether the lock should come there, or earlier or later,
is a question for testers too.

## The second seat
Mina's campaign is on the title page as a button (see `CLAUDE.md`). It has had no more playtesting than the Count's, and it was written first, so its tone is the one the Count's was matched to. Worth asking testers: did they find the button, did they play both, and did either seat feel like the other with the names changed?

## Before trusting the results
Five or six testers will find the big problems and too few to find the balance ones. Balance is measured by simulation (`scripts/balance_check.ts`), not by playtest. The simulated careful and bold players
almost never collapse, and a random player collapses about a sixth of the time, so a human who ignores the reserves will meet a collapse and one who watches them will not. If testers find it too easy, the
levers are the strain figures in `config.json` and the heaviest costs in `events.json`.

## Decisions waiting for the author
- Whether the four absence claims above are true of the book.
- The year. The text never names it; most readers say 1893. The game says nothing.
- Whether the generated score (`src/score.ts`) is right, or the game wants a composed track.
- Publishing: the demo points at the draft page `dispatches/dispatches-dracula`; the full game's target is still REPLACE_ME in `itch.json`. Nothing has been pushed. Cover art.
- Whether the two seats should read each other's choices (they do not yet).
- Whether to build the Sherlock crossover proposed in `docs/proposals/SHERLOCK_AND_DRACULA.md`.
