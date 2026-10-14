# Fact-checking Dispatches 1922

Every checkable statement in the reports and adviser dossiers is a **claim**, logged in `claims/<campaign>.json` with a status:

| status | meaning |
|---|---|
| `drafted` | written from the author's reading; no source on file |
| `web-checked` | read against a web page named in `claims/sources.json` (the `read` field says whether the page was opened or only its search summary was seen) |
| `source-checked` | read against a book, article or primary source |
| `independent` | confirmed by someone other than the author |
| `disputed` | the sources disagree, or a reviewer says it is wrong; the `note` says what |

State of the record: run `npm run review:status`. At the first pass the register held 468 claims: about 84 web-checked, 19 disputed, the rest drafted. Nothing is `independent` yet.

## What is and is not in the register

- In: the bulletin, the background, the situation, the aftermath and outcome of the choice that follows the record, every ending's epilogue, and every adviser's biography and fate, for each sentence that has a date, a figure, a unit or a named event.
- Not in: the text that appears only when a flag has a certain value (the register reads each report with no flags), the battle configs, and the new 1917 reports. Those have their own source tables: `preludes-round1.md` (the preludes and "What this game leaves out"), `south-russia-round1.md`, `provisional-government-round1.md`, `battles-round1.md`, `battles-round2.md`.
- `uncovered.json`: reports with nothing checkable in their text. A report that gains a checkable sentence has to leave that list.

## For the reviewer

1. Open `claims/review.html` in a browser. It is one file and needs no connection.
2. Type your name. Each statement shows the report it belongs to, the sources already on file and four answers: **Confirmed** (give the source you used), **Wrong** (say what is right), **Needs a source**, **Skip**. Disputed statements come first in each campaign.
3. Your answers are kept in the browser. **Export my review** saves `review-<name>-<date>.json`; send it back.

Statements marked `NOT CONFIRMED` in their note are the ones to look at first: they were written in earlier rounds and no source read in the first pass supports them (Kalabukhov's hanging on 7 November 1919, the camp figures at Gallipoli and Lemnos, the Solovki detail at Kronstadt, the quotation 'shot like partridges', the Directory's members, Holman's rifle figures).

## For the maintainer

```
npm run check:claims                          structure, sources, stale claims, coverage (in test:fast)
node tools/claims-draft.mjs                   add the sentences that are new since the last run
node tools/claims-draft.mjs --prune           also remove claims whose text is gone
npm run review:build                          regenerate claims/review.html
npm run review:status                         counts by status
node tools/apply-review.mjs review.json --dry what a review would change
npm run review:apply -- review.json           confirmed -> independent (with the reviewer's source), wrong -> disputed
```

`check:claims` fails on a claim whose text is no longer in the game: after editing a report, run `claims-draft.mjs --prune`, and re-check what changed. A `Wrong` answer turns a claim `disputed`; the report text then has to be fixed by hand, and the claim re-logged.

## Method of the first pass

Sentences were extracted by `tools/claims-draft.mjs`. The highest-risk ones (dates, strengths, named events, biographical dates) were checked by web search and by reading the biography and battle pages on Wikipedia, the 1914-1918-online encyclopedia, US diplomatic telegrams (FRUS) and Soviet-era documents on marxists.org. Where a search summary only was seen, the source is marked as such. About 40 statements were corrected in the text; the corrections are listed in `CHANGELOG.md`.
