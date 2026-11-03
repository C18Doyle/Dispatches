# A second major case: a plan

The shelf already holds one major case and four minor ones (`src/casebook.ts`, scene `0`). This is the plan for a second major case. Nothing here is built.

## The choice

| | The Empty House (1894) | The Hound of the Baskervilles (1889) |
|---|---|---|
| Fit with what exists | Very close: it is the return after the Falls, Moran is already set up (S3, S8B, C10, the "air-gun" hooks), and `ENDING_THE_RETURN` already points at it | Distant: a different cast, a different country, and Holmes is off the page for half of it |
| Size | 25 to 30 scenes, one night and the days before it | 55 to 70 scenes, a week on the moor |
| Mechanics | Hours, Hands and Wires matter most (a stakeout is all three); disguises and the deadline events carry over | Needs a new idea: Holmes and Watson apart, so reports instead of presence |
| Risk | Low | High: a real shift of point of view and of the UI |
| Canon check | Already downloaded and checked (Gutenberg #108) | New text to check (#2852) |

**Recommendation: build The Empty House first, as "The Return" (about 28 scenes), and keep the Hound as the third major case.** It reuses nearly everything, it pays off the Reichenbach ending, and it tests the shelf with two major cases before a larger change is risked.

## The Return: outline

Dates run from Monday 2 April to Saturday 7 April 1894 (the Park Lane murder was on 30 March, a Friday).

**Act I, the empty chair (6 scenes).** Holmes comes back to a London that has been told he is dead. A choice of how to return decides who knows: Mycroft only, Mrs Hudson, or Watson, with the "faint" scene as one option. Mycroft supplies money and the names that matter (Moran, and the other member of the Professor's gang whom the trial left at liberty). The Adair case is the cover for the real hunt.

**Act II, three ways to hunt him (about 16 scenes).** The Yard, the street and Whitehall roads of The Final Problem become three methods here, each a short run of 4 to 5 scenes:
- the Yard: the inquest, Lestrade's file and the card-club evidence;
- the street: Wiggins's boys, now grown a little, watching Camden House (the empty house opposite 221B);
- the quiet road: no one is told, and you work from Mycroft's rooms.

Each road ends at the same place by a different hand: the wax bust in the window.

**Act III, the night (6 to 7 scenes).** The empty house in the dark, the bust, the air-gun and Moran's arrival. A three-step finale with a second chance (the pattern of Y9C, S8D and M9), so that capture needs preparation and not one roll.

**Endings (8):** Moran taken alive; Moran taken with the Yard's credit; Moran escapes to the Continent; Watson is hurt; the gun is fired and the bust is destroyed; a quiet arrangement through Mycroft; the Professor's last man walks free; a ruin ending through the Strand.

## What carries over, what is new

- **Reused:** the gauges, the Strand, the board and web (a new web: Moran's people), the Case-Book shelf (a second card in "The Major Cases"), deadlines and answers (`gen/reactions.mjs`, the engine trigger), disguises, per-volume saves, the demo (a second lock scene), the validator, the style, continuity and layout checks.
- **New:** a branch id (`RETURN`), about 28 scenes in `gen/`, 8 endings with plates, a new calendar and map section (Park Lane, Camden House opposite 221B), claims for the Empty House (all primary, checked against #108), and entries in `claims/continuity.json`.
- **Not needed:** any engine change.

## Steps, in order

1. Write the outline of every scene with its dates and flags (one day).
2. Add `RETURN` to `VOLUMES`, the shelf, the map and the calendar tables, and a demo lock.
3. Write the scenes and endings in `gen/return.mjs`, in three passes (Acts I, II, III), running `npm run gen`, `check:prose`, `check:style` and `validate` after each.
4. Check every claim against the text and add the people to the continuity bible.
5. Balance with `check:balance` (a cautious player should capture Moran about three times in five) and re-record the baselines.
6. Read ten transcripts.

## Open questions for the author

- Should the major cases be playable in either order? (Yes is simpler; the saves and the Ledger already allow it.)
- Does the Return count the choices made in The Final Problem? (Recommended: no, as the minor cases share nothing; but an unlocked line for a player who finished `ENDING_THE_EMPTY_GRAVE` or `ENDING_THE_RETURN` would be a small gift.)
