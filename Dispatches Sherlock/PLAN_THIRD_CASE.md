# A third and a fourth major case: a plan

The shelf holds two major cases (The Final Problem, 1891; The Return, 1894) and four minor ones. This plans the next two major cases. **Built in 0.8.0** as The Hound (38 scenes, `gen/hound*.mjs`; Holmes stays Holmes and Watson is his hands, as recommended) and The Professor (23 scenes, `gen/prof*.mjs`); the plan below is as it was written, and the two came out smaller than its estimates (about 60 and about 30 scenes). It follows PLAN_SECOND_CASE.md, whose lessons are written into the steps below.

## The third case: The Hound of the Baskervilles (1889)

Checked against Project Gutenberg #2852 on 2026-11-03: fifteen chapters; Dr James Mortimer calls at Baker Street with the Baskerville manuscript (dated 1742, the legend of Hugo); Sir Charles Baskerville has been found dead on the Yew Alley; Sir Henry arrives at the Northumberland Hotel; a boot is stolen; Holmes sends Watson to the Hall and says that he is staying in London; Watson's letters (chapters 8, 9 and 10) report the Barrymores, the convict Selden, the Stapletons of Merripit House, Laura Lyons of Coombe Tracey and Frankland of Lafter Hall; Holmes, who has been on the moor all along, is found by Watson in a stone hut on the tor; the hound is met on the night of the fog. It is dated by its own letters to October ("Baskerville Hall, October 13th" and "October 15th"); the year 1889 is the usual reckoning, and the stick in chapter 1 is engraved 1884, five years before.

### The design problem

Holmes is away from the page for half of it, and the whole game is in the second person as Holmes. Three ways to meet that:

| | A. Holmes stays Holmes, and Watson is his hands | B. Play Watson on the moor | C. Two players' halves |
|---|---|---|---|
| Fit with the game | Very close: the gauges, the Strand (Hands is already "the people at your disposal"), the telegram and the Case-Book all stand | A new point of view, a new voice for every line, and Holmes's own gauges make no sense | Both of A and B |
| Cost | Moderate: reports as cards, instructions as options | Large | Largest |
| Risk | The player may feel that nothing happens to them while Watson walks the moor | High | High |

**Recommendation: A.** Act I is in London with Holmes. In Act II each scene opens with a report from Watson (a letter card, in his voice) and the options are Holmes's instructions by telegram, with the Hands and Wires gauges as the cost of each. Holmes then goes down to the moor secretly, as in the book, and Act III is Holmes on the tor and in the hut, so the last third is first-hand. No engine change: Watson's letters are scenes' descriptions, set apart by a different plate and the "Report" tag on the card.

### Outline (about 60 scenes, 9 endings)

**Act I, the legend (about 8 scenes, 3 days).** The stick and Dr Mortimer (the first deduction scene: a short examination), the manuscript, the question of what to do about Sir Henry, the hotel, the stolen boot, the cab and the man with the beard, the decision to stay in London. Each choice sets who is trusted on the moor (Mortimer, Barrymore, Stapleton).

**Act II, Watson's reports (about 30 scenes, the 4th to the 20th of October).** Four threads, each of 6 to 8 scenes, that can be followed in any order within the act, and each of which Watson can lose: the Barrymores and the lights in the window; Selden on the moor; the Stapletons and the girl Beryl; Laura Lyons, Frankland and the telegram to Coombe Tracey. Holmes answers each report by telegram, and an answer is a choice; the deadline is Sir Henry's walk on the night of the fog.

**Act III, the tor (about 12 scenes).** Holmes in the stone hut; the man on the tor; the Mire; Selden's death in Sir Henry's coat; Lestrade at Coombe Tracey; the night of the fog with a second chance, as in S8D and The Return's grapple; Stapleton in the Mire.

**Endings (9):** Sir Henry saved and Stapleton in the Mire (the book); Sir Henry saved and Stapleton gone from England; Sir Henry's nerve broken (the book's Dr Mortimer's voyage); Selden saved; Laura Lyons turned; Beryl Stapleton safe (hidden); Sir Henry lost on the moor; Watson hurt; the Strand ruin.

### What carries over, what is new

- **Reused:** the gauges, the Strand, trust axes (add `trustMortimer`, `trustBarrymore` through the existing `trust*` axes in `config.json`; the Company tab reads them without change), the shelf, calendar, map, board and ledger tables, claims, continuity, demo locks (at the end of Act I), the validator and the fuzz.
- **New:** a moor map (a third map in `src/map.tsx`, after London and Europe), a report-card style, about 60 scenes in `gen/hound1.mjs` to `hound4.mjs`, 9 endings with plates, an interlude card for each of Watson's letters.
- **Not needed:** any engine change.

### Steps, in order (lessons from The Return in bold)

1. Write the outline of every scene with its dates, flags and which flag each ending reads. **Every written flag must be read by an echo, an ending variant or a requires, and the validator cannot search a negative condition, so state each fork positively and write the one complement as the only non-searchable option.**
2. Add the volume to `VOLUMES` and the shelf, the map tables, the calendar tables, the demo locks and the check scripts. **Insert it at its place in the shelf's order and update the book indices in `balance_check.ts` and `transcripts.ts`.**
3. Write in four passes (Act I; Act II threads 1 and 2; threads 3 and 4; Act III), running `npm run gen`, `check:prose`, `check:style` and `validate` after each. **Write to the phrase budgets from the first line (a man who, rather, you do not, a good deal), or the style check will ask for rewording afterwards.**
4. Check every claim against #2852 and add the people to the continuity bible.
5. Balance (`check:balance`: a cautious player saves Sir Henry about three times in five), then record the baselines and the layout heights once, at the very end.
6. Read ten transcripts.

Estimate: five to six times the work of The Return (a day of writing for each act), so it should be built a thread at a time, with the demo locked at the end of Act I until the whole is done.

## The fourth case: the Professor (1887)

A prequel to The Final Problem, which has Holmes say that for years he has been conscious of "some power behind the malefactors". It is the one major case in which the criminal is not known at the start, and it fits the Case-Book's shape because nothing in it needs an earlier volume.

**Shape (about 30 scenes, 7 endings).** A winter in 1886 and 1887. Four unrelated crimes (a forged will in Lauder, a bank clerk's suicide in the City, a burglary in Kensington that took nothing, a missing witness at the Old Bailey) each have one detail in common. The board is the whole game: the player pins the details, and the case is solved by seeing which four belong together. The Professor appears only in the last act, as a mild man in a lecture-room, and the endings are about what Holmes does at the first meeting: warn him, keep silent, or try to take him with what is not yet enough. Mrs Stewart of Lauder (1887) is the one fact from the canon that anchors it.

**Why fourth.** It uses the Board and the Web more than any case so far, it has no moor and no map change, and its endings feed the Final Problem's reader. It is also the one in which the player is most likely to meet the criticism that the game has been too kind to Holmes: the best ending is the one in which he takes nothing from the first meeting but a handshake.

**Open question for the author:** should the prequel, being known to end badly (the Reichenbach), be allowed a happy ending at all? Recommended: yes, one, hidden, in which the Professor is stopped in 1887 and The Final Problem never has to be written.

## Open questions for the author

- Is A (Holmes stays Holmes, Watson is his hands) the right way to play the Hound?
- Should the Hound be built in one go, or released a thread at a time with the demo lock moved?
- Which comes first, the Hound or the Professor? (The Professor is half the work and would test the Board before the Hound's moor map is drawn.)
