# Writing principles for the Dispatches games

These apply to every word a player reads in every game: situation reports, choices, outcomes, advisers, epilogues, menus,
glossaries, buttons and help text. They exist because machine-written prose has a recognisable manner, and players notice it.
When a rule and a sentence disagree, rewrite the sentence.

## The rules

1. **No em dashes.** Use a full stop, a comma, a colon or a pair of brackets. If a sentence needs two dashes to hold together, it
   is two sentences. An en dash is for ranges (1941–42, pages 12–14) and nothing else. The one allowed use of the long dash is the
   attribution under a real quotation ("— Winston Churchill, House of Commons, 13 May 1940").
2. **Say what happened.** Name the date, place, formation and number. A fact is better than an adjective. If you cannot say what
   the thing was, you do not know enough to write the line yet.
3. **Plain words, short sentences.** Prefer the word a person would say aloud. One idea to a sentence. A long sentence is allowed
   when it is a list of real things, and not otherwise.
4. **No hindsight in the moment.** A report is written on the day. It does not say what will turn out, what historians now think,
   or that someone "will guess wrong". Hindsight belongs in the outcome and the epilogue, and is marked as such.
5. **No rhetorical shapes.** Do not write "it was not X but Y", "not just X, but Y", "less X than Y", "the real question is", "what
   follows is", "in the end". Do not write three adjectives or three clauses for the rhythm of three. Do not end a paragraph on a
   neat line that sums it up.
6. **No stock words.** Avoid: tapestry, testament, landscape (unless it is land), pivotal, stark, sobering, unprecedented, delve,
   navigate (unless it is a ship), underscore, nuanced, intricate, ever-evolving, a double-edged sword, a delicate balance, sealed
   its fate, hung in the balance, the weight of, the shadow of.
7. **Advisers do not speak.** An adviser's line is a third-person summary of a position ("Halder argues that the army cannot
   afford…"). Speech marks are for real quotations that are logged with a source in `claims/quotations.json` and checked by
   `check-quotations`. Do not invent a quotation, and do not polish a real one.
8. **Mark the speculative.** Anything that did not happen says so in its first sentence ("Speculative.", "A modeled alternative.")
   and is labelled `historicalRecord: false` in the data. Do not dress an invention in the voice of the record.
9. **Keep the mechanics out of the story.** The page that shows a number is allowed to say what the number means. The report that
   tells the story does not say "your Manpower falls" or "you lose a point of Initiative".
10. **Do not explain the joke or the lesson.** If a result shows the cost of an order, do not add a sentence that says what the
    cost teaches.
11. **One spelling.** Pick one convention per game (British or American) and keep it. Proper names keep their own spelling.
12. **Be careful with the dead.** Never make a game of the Holocaust or of any atrocity: they are described, briefly and
    accurately, outside the decisions (see the Holocaust section in the 1940 dossiers), and not turned into a choice, a meter or a
    score.

## Before and after

> The plan was bold — perhaps too bold — and Halder knew it.

> The plan was bold. Halder thought it too bold.

> It was not a defeat but a reckoning: the army that crossed the Dnieper would never again be the army that left Kharkov.

> The army that crossed the Dnieper had lost a third of its tanks since Kharkov.

> Zhukov: "This is the moment that will define the war."

> Zhukov wants the reserves held until the Germans have spent themselves, and says so to Stalin.

## How it is checked

`node tools/check-writing.mjs "<game folder>"` lists the em dashes in a game's on-screen text (comments, quotation lines and
attributions are ignored). Add `--strict` to make it fail. 1940 runs it strictly in `test:fast`; the other games are brought up to
it one at a time, and then switch to strict. The other rules need a reader: read the new text aloud before it goes in.
