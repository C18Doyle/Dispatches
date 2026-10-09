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

### Added
- Save migrations and node aliases (`NODE_ALIASES`, `SAVE_MIGRATIONS`, `migrateSave`): an update can now upgrade saves instead of wiping them (docs/SAVES.md).
- Twenty Allied Pacific nodes now live in `src/data/alliedPacific.nodes.json`; text and choices are unchanged.
- `check:orphans` (reachability of every listed node) in the fast tests.
- Save-compatibility test (npm run test:saves) with committed old saves for both campaigns.

## 1.0.0 (migration baseline)
### Fixed
- Crash when a choice's impact re-resolved the stage and dropped or shifted a meter-gated choice (the outcome looked up a choice that no longer existed).
- The end-screen log (odds, passed-over counts) used the re-resolved stage instead of the stage the player faced; it now uses the stage the player faced.
