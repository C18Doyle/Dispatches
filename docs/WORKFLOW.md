# Working in this repo

## Where to keep the repo
Not inside OneDrive. OneDrive locks files while it syncs (we hit `EBUSY` on `dist/` several times), uploads
`node_modules` (hundreds of thousands of files) and can corrupt a `.git` folder. Keep the working copy at
`C:\dev\Dispatches` (or any folder OneDrive does not sync); GitHub is the backup.

## The loop for any change
1. `git switch -c <short-name>` from an up-to-date `main`. One change per branch.
2. Edit. For 1922/1940/1941 edit `src/parts/*`, not the assembled `src/App.jsx`; 1914 edits `src/*.jsx`.
3. In the game folder: `npm run test:fast`. This builds, type-checks, runs the validators and compares the
   seeded UI run against the recorded baseline, and the save-compatibility test where the game keeps saves.
4. Add a line to the game's `CHANGELOG.md` if a player or a balance check would notice the change.
5. Commit, push the branch, open a pull request. CI runs the fast tier on Linux and Windows plus a real-browser
   smoke test. Merge only when it is green. (GitHub only enforces this on private repos with a paid plan, so
   it is a habit: do not merge red.)
6. Releases are separate (see below).

## When the UI baseline fails
`verify:baseline` replays seeded playthroughs and compares a hash of the page text after every click against
`tests/baseline/ui`. A failure means the screens changed. Decide which of these it is:

| It is... | Do this |
|---|---|
| A bug you just introduced | Fix the code. Never touch the baseline. |
| An intended text or balance change | Re-record **only that game**, review the diff, commit it together with the change and a CHANGELOG line. |
| An intended fix of a legacy bug (the old build crashed or was wrong) | Add the run to `tests/baseline/known-diffs.json` with the step it first differs at and a one-line reason, as 1922 and 1940 do. The comparison then allows exactly that difference and nothing else. |

How to accept a change: `npm run verify:baseline` (it fails and leaves its runs in `tests/ui-runs/candidate`), read the
reported differences, then `npm run baseline:accept` in the game folder. That replaces the baseline with those runs
and prints how many differ from the old one. Run `git diff --stat tests/baseline` before committing: a one-line text
tweak should change a few runs, not all of them. It refuses to accept runs that crash unless you pass `--allow-crashes`.
Never accept just to turn a red run green without reading what changed.

The same rule applies to `tests/saves` (old saved runs): they exist to prove old saves still load. If a save
format change is intended, write the migration so the old fixtures still load; only add new fixtures.

## Checks you can run by hand
| Command | What it tells you |
|---|---|
| `npm test` (repo root) | Every game's `test:fast` plus the engine equivalence test (a few minutes) |
| `npm run test:slow` (repo root) | Runs any game's `test:slow` script. None defines one now (1940's 48-run baseline, about 4 minutes on Linux, was the only one and now runs in its `test:fast`) |
| `npm run smoke:browser` (repo root) | Loads each built game in Chromium and WebKit (the engine of iPhone Safari) at phone and desktop size: console errors, blank page, sideways scrolling, text column wider than 600px on desktop. On the phone it also runs axe-core: serious and critical accessibility findings are compared with `tests/a11y-allowlist.json` (a new rule or a higher count fails; `A11Y_LEVEL=minor` shows everything; `--record-a11y` accepts the current state on purpose). First run: `npx playwright install chromium webkit` |
| `npm run check:orphans` (in a game folder) | Nodes in the discovery atlas that no path reaches, reachable nodes missing from it, `NODE_TOTAL` drift, authored endings no path reaches. Exact search over (node, flags) states; for campaigns with too many flags it falls back to 30000 seeded random walks and says so. Accepted findings live in `tests/orphans-allowlist.json` (`--record` rewrites it on purpose) |
| `npm run test:saves` / `npm run test:migration` (1922, 1941; Frankenstein: `test:saves`) | Old saves still resume; the save-migration helper behaves (docs/SAVES.md) |
| `node tools/data-readiness.mjs` | How much of each game's content is plain data (could move to JSON) and what blocks the rest (docs/DATA_MIGRATION.md) |
| `node tools/monte-carlo.mjs 3000` (in `Dispatches 1922`) | Seeded random play on the real rules: gate-bite rate and which endings are ever reached |

## Other guides
- `docs/CONTENT_GUIDE.md`: how to add a node, ending or campaign without tripping a check.
- `docs/SAVES.md`: renaming nodes and changing save formats safely.
- `docs/DATA_MIGRATION.md`: content in JSON (1941 Allied Pacific pilot) and what blocks the rest.

## Releasing a game
1. Update the game's `CHANGELOG.md` and bump `version` in its `package.json` (the tag must match it).
2. Locally, if you want to see it first: `npm run release` in the game folder, then
   `node tools/verify-release.mjs <game>` from the root (checks the zip like itch.io would serve it: `index.html`
   at the root, file limits, hashes, and loads the unzipped files in Chromium).
3. Tag and push: `git tag 1941-v1.0.1` then `git push origin 1941-v1.0.1`. The release workflow runs the tests,
   builds, verifies the zips, attaches them to a GitHub release and, if itch.io is set up, pushes them with butler.

### One-time itch.io setup
- In `itch.json` replace each `REPLACE_ME/...` with your itch.io `user/game-slug`.
- itch.io > Settings > API keys: create a key, then on GitHub: repository Settings > Secrets and variables >
  Actions > New repository secret named `BUTLER_API_KEY`.
- Test without pushing: `node tools/itch-push.mjs 1941 --dry-run`.

## Dependencies
Dependabot opens monthly pull requests (minor and patch only, grouped per folder) for the GitHub Actions and for each game's npm packages. CI decides if one
is safe. Major versions (React 19, Tailwind 4, TypeScript 7) are skipped on purpose: upgrade them by hand, one game at a time, with the baseline result in front of you.
