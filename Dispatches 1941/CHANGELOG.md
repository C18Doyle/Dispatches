# Dispatches 1941 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Changed
- **Advisers argue positions; they no longer speak.** All 337 adviser lines were invented first-person speech ("I would rather keep that air group intact..."). Each is now a third-person position, shown as "Adm. Nagano argues: ...". The four lines that are real quotations (Onishi proposing suicide attacks, Curtin turning to America, MacArthur on arriving in Australia, Groves on radiation) are shown in speech marks and logged with a source in `claims/quotations.json`; `npm run check-quotations` fails on any invented speech. The six doctrine cards state a position too, and the Yamamoto line in the war room is now his remark to Konoe, not a paraphrase in speech marks.
- **The briefs and introductions are one plain sentence or two**, with the editorialising removed.
- **No em dashes in the on-screen text.** `npm run check-writing` fails on a new one (see `../docs/WRITING.md`).

### Fixed
- **Fourteen ending titles that no war could produce are gone** from the endings list (11 of them were listed in the gallery as endings to find): the war always went on to a later decision whose own title came first. Removed: The Line Not Moved, Two Empires Two Different Wars, The War That Waited, A Different Kind of Ready, The Check Removed Before It Was Needed, One Hundred Million Together, Two Hundred Roots One Hour, The Line Nobody Had to Cross, Spent Regardless of the Reason, The Stalemate That Finally Moved, Everything But the Declaration, Europe First Meant Literally, Mercenaries in Everything But Name, Manila Left Behind.

### Added
- **Audit suite** (`npm run audit`, mostly in `test:fast`), ported from 1940 and built on the game's own rules (`tools/audit-lib.mjs`): `check:orphans` now also proves every ending title can be produced; `check-reachability` (gallery entries that no campaign can return, flags written but never read, choices blocked at every meter state); `check-advisor-dates` (an adviser shown after death, removal or capture, before taking a post, or under a title that was not true that month, against the reviewed table `tests/adviser-tenures.json`); `check-outcome-sign` (unhedged triumph or disaster prose beside an impact that points the other way); `check-endings` (no ending takes more than 85% of random wars). Findings that are understood and not yet fixed are listed in `tests/audit-allowlist.json`: 8 adviser date or title errors and 15 flags that are written and never read, to be fixed in the fact-check pass.
- Save migrations and node aliases (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`): an update can now upgrade saves instead of wiping them (docs/SAVES.md).
- Twenty Allied Pacific nodes now live in `src/data/alliedPacific.nodes.json`; text and choices are unchanged.
- `check:orphans` (reachability of every listed node) in the fast tests.
- Save-compatibility test (npm run test:saves) with committed old saves for both campaigns.

## 1.0.0 (migration baseline)
### Fixed
- Crash when a choice's impact re-resolved the stage and dropped or shifted a meter-gated choice (the outcome looked up a choice that no longer existed).
- The end-screen log (odds, passed-over counts) used the re-resolved stage instead of the stage the player faced; it now uses the stage the player faced.
