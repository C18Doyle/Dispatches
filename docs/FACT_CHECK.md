# Fact-checking Dispatches 1914

Every statement of fact in the reports is logged in `claims/<command>.json` with a status: `drafted` (written from the author's reading, no source on file), `web-checked` (checked against a web page, mostly Wikipedia, which is tertiary) or `independent` (checked against a book or article by a person other than the author). Only `independent` is final. The map lines are drawn by hand from the course of the fighting and are approximate.

## For the reviewer

1. Open `claims/review.html` in a browser. It is one file and needs no connection.
2. Type your name at the top. Every statement shows the report it belongs to, the sources already on file, and four answers: **Confirmed**, **Wrong**, **Needs a source** or **Skip**. A confirmation needs your own source (a page in a book is enough); a "wrong" needs what you say is right.
3. The map lines are at the bottom, each framed on its line: **Fair**, **Wrong** (say where) or **Skip**.
4. Your answers are kept in the browser as you go. **Export** saves a review file (`review-<name>-<date>.json`); send it back. **Import** reads one in again.

## For the maintainer

```bash
npm run review:build                          # regenerates claims/review.html from the claims
npm run review:status                         # counts by status
node tools/apply-review.mjs review.json --dry # what the review would change
npm run review:apply -- review.json           # confirmed -> independent (with the reviewer's source), wrong -> disputed, needs -> a note
npm run validate
```

`apply-review` refuses an unknown claim id, a review with no name, and a confirmation without a source, and applies nothing if any of them occurs. A map verdict is kept in `claims/map-review.json`. A claim marked wrong becomes `disputed`; the text of the report must then be fixed by hand and the claim re-logged.
