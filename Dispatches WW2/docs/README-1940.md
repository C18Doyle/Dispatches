# Dispatches 1940 — V6 working tree

Branching WWII decision game with four playable commands (German/OKW, Soviet/STAVKA,
Allied/SHAEF, and Italian/Comando Supremo — added this project, see "Work completed this
project" below), 222 nodes total. This tree was assembled from the files delivered for the
start of V6 development; see `docs/devlog.md` for what shipped in the version this baseline
came from.

## Layout

- `src/App.jsx` — the game. Single file, ~15,400 lines. `CAMPAIGNS.{german,soviet,allied,
  italy}` holds all node content; the rest is the React shell (map, screens, meters,
  save/load).
- `src/main.jsx`, `src/tailwind.css`, `build.mjs` — the production build pipeline (esbuild +
  Tailwind v4 CLI), reconstructed this session — see "Build pipeline" below.
- `tools/` — the audit scripts referenced in the devlog, plus two added this session.
  - `extract_campaigns.js` — was missing from the delivered files even though
    `check-reachability.js` depends on it and the devlog references it. Transpiles
    `src/App.jsx` with esbuild (JSX stripped, `react`/`tone` stubbed) and writes
    `tools/campaigns_extracted.js`, a requireable CommonJS module exporting `CAMPAIGNS`. Run
    via `npm run extract-campaigns` — it's a build step, gitignored, and regenerated
    automatically by the checks that need it.
  - `check-reachability.js` — simulates randomized playthroughs of all four campaigns
    (normal + hard mode — all four now have one: German Iron/Führer, Soviet Purge/NKVD, Allied
    Coalition/Yalta, Italian Axis, added item 23) and asserts every
    ending title is reachable, every gallery entry maps to a real title, every flag written is
    read, every gated choice is offered at least once, and `NODE_TOTAL` matches the real node
    count. Slices `CAMPAIGNS`' source text generically over however many top-level campaign
    keys actually exist (in source order), rather than a hardcoded 3-way split — the latter
    silently mislabeled every Italy node as "allied" for one draft of this session's work
    before being caught. `check-outcome-sign.js` and `extract_campaigns.js` had the identical
    bug, fixed the same way; `extract-claims.js`'s version of the same bug (also present, not
    caught by the initial review) mislabeled every Italy claim as "allied" in `docs/claims.csv`
    until it was found and fixed too.
  - `check-advisor-dates.js` — flags any named advisor quoted in a node dated after their
    recorded death/capture/removal (the bug class that shipped once with Rommel/Model), and
    fails if a quoted speaker has no `ADVISOR_DOSSIERS` entry and isn't on the script's
    reviewed `ANONYMOUS_VOICE_ALLOWLIST` (added this session) of genuinely anonymous/
    institutional voices — so a real, nameable person can't quietly stay un-date-checked
    forever.
  - `check-pace-text.js` — regression check that an epilogue's "earlier/later than the
    historical [date]" prose agrees with what `projectedEnd()` actually computed.
  - `check-outcome-sign.js` — **new this session**. Flags a choice whose `outcome` prose is an
    unhedged disaster/triumph superlative pointing the opposite direction from its own
    `impact{}` sign. Deliberately narrow (see the script's header comment) — this game's prose
    routinely pairs a costly choice with a net-positive impact on purpose, so only unhedged
    superlatives count, and any hedge word in the same outcome disqualifies it.
  - `extract-claims.js` — pulls every checkable factual assertion (figures, dates, named
    people/operations) out of node prose into `docs/claims.csv`, prioritized, as a source-
    verification work queue.
  - `npm run audit` runs all of the above in sequence — a couple of minutes, since
    `check-reachability` and `check-outcome-sign` each simulate tens of thousands of
    playthroughs.
- `docs/` — devlog (docx + a plain-text extract), audit output (`reachability-report.txt`,
  `advisor-dates-report.txt`), and `claims.csv` — the source-verification work queue (see
  "Claims verification" below for its current state).
- `builds/` — the three itch.io zips (demo, full, unlisted browser-full), built by
  `npm run build` and kept in sync with `src/App.jsx` at each commit that changes it.

## Build pipeline

`build.mjs`, `src/main.jsx`, and `src/tailwind.css` were missing from the delivered V6 files
even though the delivered `builds/*.zip` were clearly esbuild+Tailwind output — reconstructed
this session by reverse-engineering the delivered bundles (bundled deps, JSX runtime mode,
minification). `npm run build` produces `dist/{full,demo}/` and re-zips them into
`builds/*.zip` under the original three filenames (`dispatches-1940-itch.zip` and
`dispatches-1940-UNLISTED-browser-full.zip` are the same "full" build zipped twice, under two
names — diffing the original delivered zips showed they were byte-identical).

## Audits: pre-commit hook and CI

`npm run audit` is wired in two places so a regression can't silently ship:

- **Pre-commit hook** (`.githooks/pre-commit`) — opt in per clone with
  `git config core.hooksPath .githooks`. Not automatic on clone (git has no way to make it so),
  which is why it isn't enabled by default here. Blocks a commit if the audit fails; a
  work-in-progress commit can skip it with `SKIP_AUDIT=1 git commit ...`.
- **GitHub Actions** (`.github/workflows/audit.yml`) — runs `npm run audit` then `npm run build`
  on every push and pull request, once this repo has a GitHub remote.

Note: `npm run audit`'s last step (`extract-claims`) regenerates `docs/claims.csv` from
scratch, which wipes any verdict/source/notes columns filled in by a verification pass — that's
expected (claims.csv is a build artifact), and it's why a claims-verification commit re-fills
those columns after regenerating rather than relying on the audit run to preserve them.

## Claims verification (`docs/claims.csv`)

656 checkable assertions extracted from node prose, prioritized by risk:

- **HIGH (64, a specific number/tonnage/exact date)** — fully verified. 60 accurate, 1
  unverifiable in-universe intelligence estimate, 3 real errors found and fixed (a Falaise
  casualty breakdown that didn't add up, a Kursk minefield density mislabeled anti-tank vs.
  anti-personnel, an HMS Hood casualty line off by two survivors).
- **MED (40, a named person/operation with a year, no precise number)** — fully verified. 28
  VERIFIED (25 clean + 3 minor-variance), 8 N/A (the game's own counterfactual/interpretive
  framing, not an independently checkable claim), 2 PLAUSIBLE (real but not a single discrete
  fact to confirm/deny), 1 UNVERIFIED (a named-official detail in the Stockholm-feelers text
  that couldn't be independently confirmed — left as-is, flagged rather than guessed at), 1
  real error found and fixed: a Berlin-assault branch claimed Rokossovsky's front historically
  converged on Berlin from the north — it didn't; his front's real axis was Stettin and the
  Baltic coast, kept off Berlin in part so it wouldn't become a third claimant alongside Zhukov
  and Konev.
- **LOW (552, everything else flagged)** — not exhaustively verified; that's not a reasonable
  scope for one pass (the 64-row HIGH tier alone took substantial research). Instead every LOW
  row was re-scanned programmatically for a number or quantity the extraction heuristic's regex
  could plausibly have missed (spelled-out quantities like "three hundred thousand", non-year
  multi-digit numbers). That surfaced 24 candidates; 16 were genuine claims and got sourced
  verdicts (15 VERIFIED, 1 real error found and fixed — Rzhev's distance from Moscow was given
  as "barely a hundred miles," actual ~132 miles). The other 8 candidates were false positives
  (proper nouns like "PQ-17"/"Order 227", bare year fragments). The remaining ~528 LOW rows are
  genuinely unreviewed — their verdict columns are blank, same as `extract-claims.js`'s own
  docstring says: a work queue, not a verdict. A future pass could extend the same
  misclassification-rescan idea, or sample-verify a risk-weighted subset.

**Post-Italy update:** adding the Italy campaign (see below) grew the extracted set to 735
claims (82 HIGH, 44 MED, 609 LOW). All verdicts recorded above were carried forward intact
(120 filled verdicts total, unchanged from the pre-Italy count — `extract-claims.js`
regenerates the whole CSV from scratch on every run, so preserving them is a merge step,
keyed on `(campaign, node, node_date, field, claim)` with a looser `(campaign, field, claim)`
fallback for the handful of "shared"-scope rows — e.g. `ADVISOR_DOSSIERS`, the full-clearance
debrief text — whose enclosing-node attribution can shift when new campaign content is
inserted upstream of them in the file). 78 new rows (60 Italy, 18 shared) were unreviewed at
that point.

**Italy verification pass (V7 next-steps item 1, partial):** Italy's HIGH/MED tier (22 rows)
was fully source-verified, catching one real error (see below). A LOW-tier misclassification
rescan (same regex-gap method used on the pre-Italy LOW tier) then covered Italy's LOW rows and
the new Italian advisor dossiers, verifying 30 more rows and catching a second real error (the
`Ambrosio` dossier). Live web search/fetch was unavailable for this whole pass (the tool
returned server errors throughout the session); verification relied on trained historical
knowledge instead, and every affected row's `source` column says so explicitly rather than
implying a fresh citation lookup. Total filled verdicts: **172** (up from 120). The remaining
~563 rows — the pre-existing german/soviet/allied/shared LOW-tier backlog (documented above as
out of scope for one pass) plus Italy/shared LOW rows the rescan heuristic didn't flag — stay
genuinely unreviewed.

Two more real errors found and fixed during this pass (neither reported by Craig — both
self-caught by the verification process): the `nonBelligerence40` outcome said Italy declared
war "five days before Paris fell" (June 10 → June 14 is four days, not five); and the
`Ambrosio` advisor dossier's `bio` field said he "took over Comando Supremo after Tunisia's
collapse," directly contradicting its own `role` field ("Feb–Nov 1943") since Tunisia fell in
May 1943 — caught by cross-checking two fields in the same entry, no external source needed.

## Work completed this project

Each item below is its own commit; `npm run audit` passes clean after all of them.

**V6 baseline punch list:**
1. Player-reported VE-day pace bug — swapped earlier/later date-clause strings in the Soviet
   and Allied epilogues; fixed, with `check-pace-text.js` added as a permanent regression check.
2. 11 write-only flags — 3 dead code (removed), 8 wired into epilogue "thread notes" so the
   content actually reaches players.
3. 16 never-produced endings — 13 first-match-wins shadowing bugs fixed, 3 provably-unreachable
   fallback strings deleted along with their stale gallery entries.
4. Advisor dossiers — added 27 researched entries; fixed a quoted-key parsing blind spot in
   `check-advisor-dates.js` that had silently exempted several advisors from the anachronism
   audit. 110 advisors now dossiered (was 81).
5. `docs/claims.csv` HIGH-tier source verification — see "Claims verification" above.

**Six further improvements/features, done as a batch:**
6. MED/LOW-tier claims verification — see "Claims verification" above.
7. `NODE_HIGHLIGHT_REGIONS` gaps closed (46 nodes across three campaigns were missing a map
   highlight; 9 were deliberately left unhighlighted as genuinely unmatchable to any of the 18
   map regions) and an "arrival pulse" CSS animation added to the theater map — the map is an
   intentionally non-geographic fixed schematic board, so a literal pan/zoom camera wasn't the
   right read of the devlog's "zoom-to-decision camera" note; the pulse is the honest,
   design-consistent equivalent, wired into the existing `reducedMotion` accessibility system.
8. `check-outcome-sign.js` added — see the `tools/` listing above.
9. `npm run audit` wired into a pre-commit hook and CI — see "Audits" above.
10. Build pipeline reconstructed — see "Build pipeline" above.
11. `check-advisor-dates.js` gated on a reviewed anonymous-voice allowlist — see the `tools/`
    listing above.
12. A full-clearance unlock: once a player's save history has earned every `OBJECTIVES` entry
    (23 of them; `record.objectives` already accumulated across runs, this is the payoff for
    that accumulation), `SelectScreen` shows a "Full Clearance" stamp and closing-dossier
    debrief card.

**Four design specs, written but not implemented** (Craig's request, before committing
implementation time): Grand Campaign mode (chain the three original commands into one
timeline), advisor-debate/dialogue-option nodes, a generated verdict epilogue, and opponent
adaptation. Full text in `docs/specs/*.md` and mirrored in the attached claude.ai project.

**Four more items implemented, in Craig's chosen build order** (separate from the specs
above — these were picked directly off the original 15-item brainstorm rather than spec'd
first):
13. **Deeper counterfactual branches (feature 3)** — reworked the Case Yellow "original plan"
    branch (declining the Manstein Ardennes gambit) from a single flavor node into a real
    structural divergence with its own follow-on content, rather than converging back onto the
    historical path after one node.
14. **A fourth playable campaign: Italy/Comando Supremo (feature 2)** — 32 new nodes running
    June 1940 non-belligerence through the war's end in 1945, including a genuine structural
    fork at the September 1943 armistice (Italian Social Republic/Salò vs. the co-belligerent
    Kingdom), each branch with its own ending. Full integration across every subsystem the
    other three campaigns touch (War Room document, advisor dossiers, map highlights, endings
    gallery, objectives, Discovery Atlas, and more — see the commit for the complete list).
    `NODE_TOTAL` moved 190 → 222. Caught and fixed the campaign-slicing bug described above in
    four `tools/*.js` scripts, and caught/reverted a first-draft `twoItalies` objective before
    shipping it that couldn't actually be evaluated from `evaluateObjectives()`'s single-run
    context — it would have made Full Clearance permanently unreachable.
15. **Multi-stage endings (feature 9)** — reworked each campaign's ending into three stages:
    the existing `epilogue()` now serves as "Immediate Aftermath"; a new `oneYearLater()`
    method on all four campaigns adds a second stage, bucketed on each campaign's own major
    branch flags, covering broad national-level context roughly a year past the ending (Cold
    War occupation zones, Nuremberg, Italy's June 1946 republic referendum) rather than
    individual fates; and a new "Where They Ended Up" section requires no new prose at all — it
    surfaces the researched `fate` field `ADVISOR_DOSSIERS` already carries for the officers a
    given run actually leaned on (the existing "Council Followed" tally). Verified with a
    standalone 140,000-run harness calling both stage functions at every simulated ending (0
    errors) plus Playwright end-to-end checks.
16. **Hidden-information choice type (feature 6, lower priority)** — formalized a mechanic that
    existed as dead scaffolding: `concealRoll` was already a recognized choice flag with a
    pre-choice UI guard, but nothing ever set it `true`, so every "contested" choice showed its
    exact odds up front even when its own situation text explicitly framed the decision as made
    blind (Dunkirk's pocket-size estimate, Convoy PQ-17's "an estimate, not a fix"). Wired
    `concealRoll: true` to also drive a new post-hoc reveal on the OutcomeScreen — the true
    odds and what actually happened, shown only after the choice resolves — and applied it to
    one flagship choice per campaign (Dunkirk, the Kharkov overextension pursuit, Convoy PQ-17,
    and Italy's Rome-defense delay gamble after the armistice), rather than retrofitting all
    ~55 existing `uncertain[]` choices, most of which are ordinary contested-outcome drama
    rather than genuine withheld-information decisions.

**Two further items from the V7 next-steps list, done this pass:**
17. Italy claims verification (172 filled verdicts total, two more real errors caught) — see
    "Claims verification" above.
18. A four-campaign Playwright smoke pass: each campaign played end-to-end via a deterministic
    "longest available choice" path to its End Screen, then a rewind exercised from there back
    into the briefing screen. All four reached the End Screen cleanly with all three ending
    stages present (Immediate Aftermath, One Year Later, Where They Ended Up) plus the scorecard
    and decision log, zero page errors, and the rewind mechanic worked correctly in all four.
    The first run of this script reported `ok: false` for all four campaigns despite otherwise-
    clean output — a test-script bug, not an app bug: the End Screen's "Copy After-Action
    Summary" button carries a CSS `uppercase` class, and Playwright's `innerText()` reflects the
    rendered (CSS-transformed) text, so an exact-case substring check against it always misses —
    the same class of casing bug caught earlier in the `concealRoll` reveal's own test script.
    Fixed with a case-insensitive check. The two identical `consoleErrorCount` entries across all
    four runs are `net::ERR_TUNNEL_CONNECTION_FAILED` on the Google Fonts stylesheet request —
    this sandboxed test browser has no external network access, not an app issue. Scope note:
    this is one deterministic path per campaign plus one rewind, not literally every node/screen
    — exhaustive branch coverage is what `check-reachability.js`'s 40,000-run-per-campaign
    simulation is already for; this pass adds real browser rendering/interaction on top of that.
19. **Hidden-information choices extended (V7 next-steps item 5).** Surveyed all 62 `uncertain[]`
    choices for ones whose own situation text explicitly frames the decision as made without
    information the player would want — the same bar the original 4 flagship choices were held
    to — rather than retrofitting broadly. Found 6 more that clear it and tagged them
    `concealRoll: true`: German campaign's `easternQuestion44` "Fortify and deter" (the situation
    text calls whether Stalin intends war "unknowable from your side of the border"),
    `atomicReckoning45`'s "Contest the delivery" (Galland: "one aeroplane we cannot identify in
    advance, on a day we will not be told about"), `normandy`'s "Release Panzer reserves" (the
    Fortitude/Calais deception — "every channel you trust is feeding you the same wrong number"),
    `bagration44`'s "Hedge" (the situation text says outright the German intelligence assessment
    is compromised: "you are being played by professionals, and the assessment on your desk reads
    as your most reliable of the war"), and `kursk`'s "Strike now, in spring" (Soviet
    maskirovka — "you're being fed elements of your own planning through channels you haven't
    found"); plus Allied campaign's `halifaxCrisis40` "Authorize Halifax to quietly test terms"
    (Chamberlain's deciding vote is "the one neither man can predict"). Total now 10 of 62 (up
    from 4). Several other plausible-looking candidates were deliberately left untagged after
    reading their full situation text — historical-controversy framing (`vistulaOder45`'s "press
    for Berlin now," debated by historians in hindsight) and ordinary contested-outcome drama
    without an explicit in-fiction information gap (`greeceWinter40`, `partisans43`,
    `southernPursuit43`, `anzio44`) don't clear the same bar the original 4 were held to. No
    Soviet or Italy additions survived the same reading — not for lack of looking, but because
    none of their remaining `uncertain[]` choices frame the decision as made blind the way these
    six do. Verified with a data-level script confirming all 6 resolve correctly (clean
    100%-summing weights, `concealRoll: true` present) via `tools/campaigns_extracted.js`, plus a
    live Playwright check on `halifaxCrisis40` confirming no odds badge before the choice and the
    correct post-hoc reveal after.
20. **Italy content and gameplay expansion (10 new nodes, 32 → 42).** Craig's request: "3+ choice
    gates, metered gates, deep and speculative forks and an additional 10 nodes" for the Italian
    campaign, which previously had zero meter-gated choices at all. Delivered as:
    - **A deep, speculative fork reactivating `backMussolini` (4 nodes).** The July 1943
      counterfactual choice at `mussoliniCoup43` ("the officer corps rallies to Mussolini against
      the King") previously converged immediately back onto the same `armisticeNegotiation43` path
      as the historical choice, with `positionLabel` intercepting it into a single generic title
      regardless of what followed — the fork existed in name only. It now runs its own four-node
      chain (`romeStandoff43` → `factionSplit43` → `germanExploitation43` → `civilConflictEnd43`,
      all `historicalRecord: false` / `speculative: true`, following the exact disclaimer
      convention Soviet's `sovietFracture42` established) to a genuinely distinct ending, with its
      own `positionLabel`/`projectedEnd`/`epilogue`/`oneYearLater`/`ENDINGS_GALLERY` wiring. The
      old catch-all title ("The Coup That Didn't Take") is now reachable only for one of the two
      real outcomes; the other ("A Republic Founded a Month Early") is new.
    - **A grounded historical fork on Italian Military Internees (3 nodes).** `imiCrisis43` →
      `vaticanChannel44` → `imiOutcome44`, inserted on the co-belligerent branch between
      `salernoAvalanche43` and `monteCassino44` — the roughly 600,000 Italian soldiers Germany
      deliberately denied POW/Geneva status after the armistice (a fact the pre-existing
      `armisticeAnnounce43` text already mentioned in passing but the campaign never otherwise
      addressed), the Vatican's limited informal relief channel, and the documented 80%+ refusal
      rate when Germany later offered better conditions in exchange for RSI or German-industry
      collaboration.
    - **Three further breadth nodes**, each inserted into an existing chain: `herculesExecution41`
      (between `convoyWarMalta41` and `rommelAdvance41` — what actually happens once Operation
      Hercules is authorized but Germany's own airborne assets are fixed on Barbarossa, following
      the `historicalRecord: false` no-`historical:true`-choice convention `caseYellowOriginal40`
      already established for a node only reachable via a prior non-historical branch);
      `alpenvorlandQuestion43` (between `saloRepublic43` and `civilWarPartisans44` — the Alpine and
      Adriatic border provinces Germany removed from RSI authority by decree days after its
      founding, and never returned); and `clnLiaison44` (between `romeLiberation44` and
      `gothicLine44` — the southern government's arms-and-gold support for the CLNAI partisans
      fighting north of the Gothic Line).
    - **4 meter-gated choices** using the established `checkLabel`/`disabledReason` pattern (e.g.
      German's Berlin-envelop and Herkules/Malta gates): the Hercules launch (fuel), the loyalist
      seizure of the Quirinale in `romeStandoff43` (initiative), the Alpenvorland protest
      (initiative), and the CLNAI arms commitment (fuel + manpower) — a campaign that previously
      had none.
    - Every advisor used is already in `ADVISOR_DOSSIERS`, checked against each figure's actual
      documented tenure (e.g. Ambrosio's Feb–Nov 1943 term as Chief of Comando Supremo doesn't
      cover his continued use as an advisor voice into 1944-45, but that pattern was already
      established by five pre-existing nodes before this expansion touched anything, so it wasn't
      treated as a new inconsistency to fix).
    - `NODE_TOTAL` moved 222 → 232 (32 → 42 Italian). `npm run audit` passes clean — 0 new
      reachability warnings beyond the 3 pre-existing Italy dead titles documented in next-steps
      item 3 below (unchanged by this work), no new write-only flags, no dead gates, no advisor
      anachronisms, no outcome/impact sign mismatches. All 9 new HIGH/MED/relevant-LOW claims this
      content introduced were source-verified this pass (Wikipedia: Italian Military Internees,
      Operation Achse, Operationszone Alpenvorland) — see `docs/claims.csv` (176 filled verdicts,
      up from 172). Verified live in the built browser: all 10 new nodes confirmed rendering
      correctly via Playwright across four forced-path playthroughs (Hercules, the full Fork A
      chain end-to-end to its new ending screen, the IMI/CLN chain, and the Alpenvorland node),
      zero console/page errors.
21. **Italy: more meter gates + probability rolls, newspaper coverage, and connective tissue.**
    Craig's request: "more metered gates ... that positive [sic] logistical triangle would unlock
    or block an option and probability roles [sic] ... make sure the newspaper and special events
    are built in and there is connective tissues in the nodes ... without to[o] much UI heavy
    text." Delivered as:
    - **6 choices converted to gate + `uncertain[]` roll combos**, the pattern Soviet's
      `southernVacuum43` established (a `checkLabel`/`disabledReason` meter gate *and* a
      `modWeight`-scaled probability roll on the same choice) but Italy had only used twice before
      (`greeceWinter40`, `armisticeAnnounce43`) against dozens in German/Soviet:
      `greeceWinter40`'s existing reserve-commit roll gained a manpower gate; `eastAfrica41`'s
      guerrilla-holdout choice, `tobruk42`'s pursuit-past-Tobruk choice, `torchTunisia42`'s
      reinforcement rush, `sicilyHusky43`'s hold-the-island choice, and `monteCassino44`'s
      push-for-the-main-assault choice each gained both a gate (fuel or manpower, `<= -3`
      threshold, matching the codebase's existing convention) and a two-outcome weighted roll
      reflecting the genuine historical uncertainty in each (e.g. whether Tobruk's captured fuel
      actually stretches to the frontier, whether a Sicilian Strait reinforcement convoy survives
      interdiction). New roll-outcome flags (`tobrukPursuitResult`, `tunisiaCrossing`,
      `eastAfricaGuerrilla`, `sicilyHoldResult`, `cassinoDirectResult`) are read downstream (see
      next item), keeping the reachability audit's write-only-flag check clean rather than
      excluding them from it.
    - **"Newspaper" (the `WireBulletin`/`STEFANI` wire-service mechanic) confirmed already fully
      automatic for Italy** — no node-level wiring needed, then or now; `shouldShowWireBulletin`
      keys purely off node ID, so it already covered these 6 retrofits and the prior round's 10
      new nodes with zero code changes. What *was* thin was the shared, campaign-agnostic
      `WIRE_HEADLINES` pool for exactly the 1943-45 window most Italy content (and this round's
      gates) sits in — 4 entries. Added 4 more (`italy-armistice`, `anzio-landings`, `rome-falls`,
      `germany-surrenders`), all real world-news items any campaign's wire service would plausibly
      carry, not Italy-only flavor.
    - **"Special events" — no matching mechanic exists anywhere in the codebase** under that name
      or any synonym searched for; this was the one genuinely ambiguous part of the request and
      wasn't guessed at. Best-guess reading is that it refers to the `WireBulletin` system above
      (already functional); flagged back to Craig to confirm or describe what's actually wanted
      rather than building something speculative.
    - **5 connective-tissue additions** — flag-conditional clauses appended to `situation` text,
      following the two existing patterns (`sovietFracture42`'s prior-flag callbacks,
      `southernVacuum43`'s current-meter-state flavor): `alamein42`, `tunisiaCollapse43`,
      `convoyWarMalta41`, `mussoliniCoup43`, and `romeLiberation44` each now reference the
      immediately preceding node's choice (and, where relevant, that choice's roll outcome) in one
      added sentence — kept to single clauses per Craig's explicit "without too much UI heavy
      text" instruction, not a rewrite of the surrounding prose.
    - `npm run audit` passes clean — no new reachability warnings, no write-only flags (the 5 new
      roll-outcome flags are all read via the connective-tissue additions above), no dead gates, no
      advisor anachronisms, no outcome/impact sign mismatches. 0 new HIGH/MED claims (this round
      added mechanics and short flavor text, no new factual claims); `docs/claims.csv` unchanged at
      176 filled verdicts. Verified live in the built browser via Playwright: the full gate/badge
      render path exercised across a 90-step forced playthrough (7 `⛔ Unavailable` gate-badge
      renders observed, zero crashes), and one isolated conservative-meter playthrough confirming
      an enabled gate+roll choice (`eastAfrica41`'s guerrilla option) resolves correctly — contested-
      decision banner, correct title, correct outcome text, correct meter delta — with zero
      console/page errors throughout.
22. **Six deep speculative forks (all four campaigns) + ten more shallow gate/roll/tissue touches.**
    Craig's request: "More metered gates, more rolls, more connective tissue and more long
    speculative nodes... add/make any speculative nodes on the other campaigns deep too" —
    scoped, after clarifying questions, to 2 deep forks per non-Italy campaign (6 total, Italy
    excluded since it was just deepened in items 20-21), 10 more shallow touches spread across all
    four campaigns, Claude's own judgment on which forks. Delivered as:
    - **6 deep forks, one new multi-choice node each**, following an asymmetric-depth pattern: only
      the bolder/riskier of the two existing choices is rerouted through the new node (the other
      choice's `next` is untouched), and the new node reconverges into the existing chain rather
      than manufacturing a wholly separate ending. German: `caseYellowOriginal40` →
      `compressedInvasionWindow40` (a rushed-timetable gate+roll vs. writing off 1940 outright);
      `hitlerDead44` → `valkyrieGovernment44` (a fully speculative post-coup government choosing a
      West-only or all-fronts peace bid — required rewiring all 4 places the `valkyrieSucceeds` flag
      terminates a run, since one new branch now falls through to the normal war-continuation track
      instead). Soviet: `southernVacuum43` → `vacuumOverreach43` (pushing the salient to the Dnieper
      vs. consolidating); `finnishArmistice44` → `finlandOccupationCost44` (harsh vs. narrow
      occupation policy, no honest map-region match for Finland so correctly unmapped). Allied:
      `turkishQuestion44` → `turkishBelligerence44` (pressing for Adana bomber-basing rights, with a
      `cohesionDelta` on refusal); `romeDividend44` → `gothicLineEarly44` (an early-season
      breakthrough attempt vs. probing — caught and fixed a chronology bug here: the node was first
      dated AUTUMN 1944 sitting between two SPRING 1944 nodes, corrected to SPRING 1944 with the
      prose rewritten to match). New real historical advisor (`Clark`) got a proper
      `ADVISOR_DOSSIERS` entry rather than going undossiered; two new anonymous/institutional
      voices (`"Goerdeler's own circle, relayed"`, `"a Kreisau Circle voice, relayed"`) reviewed by
      hand and added to `check-advisor-dates.js`'s allowlist.
    - **10 shallow touches** (gate and/or roll and/or a connective-tissue sentence, no new node) —
      German: `tannenbaum40` (fuel gate on the invade choice), `vlasov43` (initiative gate + new
      roll on committing to Vlasov's army), `normandyCounterattack44` (fuel gate on the Sword
      drive). Soviet: `caucasusDefense42` (manpower gate on holding the Terek rigid),
      `easternWallBreach43` (fuel gate + new roll on the artillery-breakthrough choice),
      `berlinFeb45` (manpower gate on the immediate-assault ending choice — gate only, no new roll,
      to avoid another ending-infrastructure rewire). Allied: `pq17_1942` (fuel gate on holding the
      convoy together, alongside its existing `concealRoll`), `bulgeExploited44` (manpower gate +
      new roll on committing reserves to seal the salient). Italy: `homeFrontBombing43` (fuel gate +
      new roll on air-defense reinforcement), `civilWarPartisans44` (manpower gate + new roll on
      the reprisal-campaign choice). Every new roll-outcome flag is read back in a downstream node's
      `situation` text (e.g. `vlasovResult` in `kursk`, `gothicLineEarlyResult` in `overlordPrep44`,
      `partisanWar44Result` in `gothicLineRSI44`) rather than left write-only.
    - `npm run audit` passes clean at every stage: `NODE_TOTAL` updated 232 → 238 for the 6 new
      nodes, two write-only flags caught and fixed (`turkishBasesResult`, `gothicLineEarlyResult`),
      no new dead titles or reachability gaps beyond the same 7 pre-existing warnings, no advisor
      anachronisms, no directional-date or outcome-sign mismatches, 0 new HIGH/MED claims (all new
      content is either speculative/`historicalRecord: false` or short flavor text). Verified live
      in the built browser via Playwright across all four campaigns: rolls fired with correct
      outcome text and meter deltas in German/Soviet/Allied playthroughs, gate badges (`⛔
      Unavailable`) rendered correctly when Italy's new gates were reached in a resource-depleted
      state, zero console/page errors throughout.
23. **Two bug fixes + a new Italian hard mode ("Axis Mode").** Craig reported three things in one
    message: a hardcoded `tannenbaum40` line that read "With Sea Lion shelved" regardless of what
    the player actually chose for Sea Lion; the Italian Malta invasion having no downstream effect
    on later nodes; and a request to build Italy's missing hard-mode equivalent to German/Soviet/
    Allied's Führer/NKVD/Yalta modes. He also asked, generally, how to stop this class of bug from
    recurring — see the note at the end of this item.
    - **Sea Lion/Tannenbaum fix.** `tannenbaum40`'s `situation` text was a plain string, not
      conditioned on `flags.sealion`, even though three different values (`commit`, `attrition`,
      `east`) can all reach this node (`launched` routes to `sealionDisaster40` instead). Converted
      to a ternary keyed on `flags.sealion`, matching the pattern already used one node downstream
      at `balkans`.
    - **Malta connective tissue + a real chance of success.** Two separate Malta decisions
      (`medStrategy40`'s `flags.medStrategy`, `convoyWarMalta41`/`herculesExecution41`'s
      `flags.maltaQuestion`/`herculesResult`) were never read by any later node's `situation` text —
      worst case, `alamein42` unconditionally stated Rommel's supply line was "still running the
      same thousand-mile gauntlet past Malta," even on paths where Malta had actually been taken.
      Also surfaced and flagged to Craig before fixing: Italy-alone's Hercules attempt
      (`herculesExecution41`) had no success outcome at all, unlike the German campaign's version of
      the same operation — a design gap, not just a wiring one. Craig's answer ("do 1 & 2") covered
      both: `herculesExecution41`'s "launch alone" choice now has a real `uncertain[]` roll (weighted
      by fuel) instead of being deterministic near-failure, and `convoyWarMalta41`, `tobruk42`, and
      `alamein42` all got connective-tissue clauses reading `flags.herculesResult`/`flags.medStrategy`.
    - **Italian "Axis Mode" (🔗), theme: German Trust.** Craig picked the simpler single-throughline
      option over a more complex "regime confidence" design that would've needed to change meaning
      at the 1943 armistice fork. Modeled on the Soviet/Allied pattern (`flags.hardMode = true`,
      a tracked meter via `trustDelta` badge fields + `setFlags` arithmetic, a hard-fail ceiling).
      Full plumbing: campaign-select button, mode name/description, choice badges, a dashboard meter
      (reusing the existing `cohesionLabel()` display function), `seedFlags`, the ending-trigger
      check, `removedFromCommand`, two new achievements ("Rome Acts Alone" / "Case Achse, Early"),
      and a new `ENDINGS_GALLERY` entry ("Rome Stops Being Consulted"). All 4 of Italy's
      ending-infrastructure functions (`projectedEnd`, `positionLabel`, `epilogue`, `oneYearLater`)
      got a `flags.superseded` branch checked *before* the existing `coupResponse === "backMussolini"`
      branch, so it can interrupt even that speculative fork. The new ending is grounded in Case/
      Fall Achse — the real German contingency plan to disarm Italian forces the moment Berlin judged
      Rome untrustworthy, historically executed within hours of the actual September 1943 armistice —
      used here as the mechanism for an early termination when German Trust runs out before the
      historical armistice date arrives on a given playthrough.
    - **A real bug caught by playtesting the new mode before shipping it, not by the audit tooling.**
      The first version seeded `trustDelta` on 4 existing choices and set the hard-fail ceiling at
      `<= -6`, mirroring Allied's magnitude. `check-reachability.js` reported the new ending as
      reachable — but its simulator has a known pre-existing quirk (applies each delta field twice:
      once via the `setFlags` arithmetic, once via a second direct addition) that silently doubles
      every meter delta relative to the real game engine. Manually tracing the fixed node order by
      hand (and confirming with a forced-defiance Playwright run) showed `-6` was mathematically
      unreachable in the actual game: only 4 nodes carried `trustDelta`, one of them
      (`rommelAdvance41`) self-gated its defiant option once trust hit `-3`, and — because that gate
      had no neutral third option — being gated forced the player into the *positive*-trust
      alternative, actively undoing progress toward the ceiling rather than merely stalling it. Fix:
      added a 5th `trustDelta` touch at the existing `mussoliniCoup43` choice (recognizing the King
      reads to Berlin as Rome breaking for the Allies; rallying to Mussolini reads as reaffirmed
      loyalty), removed the self-gate on `rommelAdvance41` entirely (reverted to a plain always-
      available -1/+1 pair, like the other four), and set the ceiling to `-5` — the true floor of a
      fully defiant run through all five always-available touches, verified by hand-tracing every
      possible visit order and then confirmed live: a Playwright run picking the defiant choice at
      all five nodes reaches "COMMAND SUPERSEDED" / "Rome Stops Being Consulted" exactly as
      designed, with the dashboard meter, no-rewind banner, and trust-delta badges all rendering
      correctly and zero console/page errors. This is exactly the "content that exists, is wired,
      and can never be seen" failure class `check-reachability.js`'s own docstring names as the
      recurring bug in this codebase — its simulator's double-counting quirk (left unfixed,
      pre-existing, also present in the Soviet/Allied delta fields) just happened to mask this
      particular instance rather than catch it. Noted in-line as a comment at the ceiling check for
      whoever touches Axis Mode's balance next.
    - `npm run audit` passes clean: `NODE_TOTAL` unchanged (238 — no new node getters, only
      choice/field-level edits), no new dead titles or reachability gaps beyond the same 7
      pre-existing warnings, no advisor anachronisms, no directional-date or outcome-sign
      mismatches. `docs/claims.csv` re-extracted and merged forward (173/174 previously-filled
      verdicts carried over automatically; the one that didn't — `alamein42`'s Malta clause — was
      reviewed by hand: the extractor's regex-based parser doesn't follow the new ternary through to
      its branches, and both branches are either the original already-verified wording or an
      in-fiction counterfactual, so no new verification was needed). 0 remaining unfilled HIGH/MED
      claims. `npm run build` clean.
    - **On Craig's "how do I stop this from happening" question:** this specific bug class —
      a choice's flag never read by a node downstream of it, or a hardcoded line that should have
      been conditional on one — is semantic/narrative-consistency, not structural, and none of the
      four audit scripts (`check-reachability`, `check-advisor-dates`, `check-pace-text`,
      `check-outcome-sign`) can catch it even in principle: they check that flags get read
      *somewhere*, not that every node whose prose plausibly depends on a flag actually reads it.
      The mitigation that's actually been working across this project is a discipline, not a tool:
      whenever a new choice sets a flag that represents a real branch-defining decision (as opposed
      to pure flavor), grep that flag across every node chronologically downstream of it and check
      whether any of their `situation`/`outcome` text makes a claim the flag could contradict. That's
      how this session caught `alamein42`'s Malta contradiction and would have caught Tannenbaum's
      Sea Lion line before it shipped. A lightweight script could flag *candidates* worth checking
      by hand (e.g. any node whose `situation` text contains a proper-noun phrase — "Malta," "Sea
      Lion" — that also appears in an upstream `setFlags` key or advisor quote, without a
      corresponding `flags.X` reference nearby) but it would need human judgment on every hit, the
      same way `check-reachability`'s own warnings do — it's a lead generator, not a gate. Worth
      building if this recurs again; not built this round since it wasn't asked for and a
      false-positive-heavy heuristic script isn't obviously better than the grep-by-hand habit that
      already caught both of today's instances.
24. **Threading the 3 biggest decisions per campaign through the rest of each run.** Craig's
    request: "Could we pick like the 3 biggest choices in each campaign and make sure those
    decisions are reflected in text throughout the rest of the run." Scoped, after clarifying
    questions, to Claude's own picks (confirmed by Craig) for which 12 decisions counted as
    biggest, and "add light mechanics where it fits" over narrative-tissue-only. Research came
    first: 4 parallel research passes (one per campaign) identified each decision's exact flag
    name(s), grepped every current downstream reader, and proposed gap candidates — chronologically
    later nodes that are thematically connected but don't currently reference the flag. 36 tissue
    touches followed, 3 per decision, all using the established ternary-on-flag-value pattern:
    - **German** — Sea Lion/invasion of Britain (`flags.sealion`): `crete41`, `bismarckBreakout41`,
      `atlanticWall43` (light mechanic: a fuel bonus on the Atlantic Wall's "reserve" doctrine
      choice if `sealion === "commit"`, reflecting invasion-barge construction capacity converting
      to bunkers). Moscow-or-Kiev (`flags.eastFront`): `vlasov43`, `kursk`, `bagration44`. Kursk
      strike-early-or-wait (`flags.kursk`): `twoFires1943`, `dnieperStabilized`, plus the
      `flags.eastFront` touch already in `kursk` covers both threads at that node.
    - **Soviet** — initial Barbarossa defense doctrine (`flags.border41`): `smolensk41`,
      `order227_42`, `moscowDefense41`. The Stalingrad/Uranus encirclement decision
      (`flags.uranus42`): `southernPursuit43` (light mechanic: the Rostov pursuit's success-roll
      base weight shifts from 25 to 33 if the envelopment was deep, 18 if shallow — reflecting how
      much of Army Group A was already disorganized by the ring's own tightness),
      `rostovAftermath43`, `southernVacuum43`. The race to Berlin (`flags.berlin45soviet`): only 2
      nodes chronologically follow this decision (the campaign ends shortly after) —
      `berlinRivalryIncident45` and `berlinAssault45`, both touched.
    - **Allied** — North Africa strategy (`flags.secondFront42`): `darlanDeal42`,
      `italyOrOverlord43` (the same Mediterranean-vs-cross-Channel argument relitigated a year
      later), `anzio44`. The Normandy plan, specifically the Omaha crisis response
      (`flags.omahaCrisis44`): `falaise44` (the node both branches converge on), `arnhemPerimeter44`,
      `eisenhowerIntervenes44`. The Ardennes/Bulge response (`flags.bulge44`): `bulgeExploited44`,
      `yaltaFeb45` (the "patton" branch previously got zero callback at all — only
      `bulgeExploited44`'s own derived flag was checked), `berlinDecision45`.
    - **Italy** — war entry timing (`flags.italyEntry`): `alpsFront40`, `greeceDecision40`,
      `homeFrontBombing43`. The 1943 coup response (`flags.coupResponse`, mainline
      `"recognizeKing"` path specifically — the `"backMussolini"` branch already has its own entire
      speculative wing, per item 23): `armisticeNegotiation43`, `twoItalies43`, `romeLiberation44`.
      The armistice path (`flags.italyPath`, RSI vs. co-belligerent): `salernoAvalanche43`
      (co-belligerent), `saloRepublic43` (RSI), `imiCrisis43` (co-belligerent).
    - **A real bug caught mid-round, not by the audit tooling.** While researching the Sea Lion
      thread, tracing `flags.sealion`'s full value set (`commit`/`attrition`/`east`/`launched`)
      against `tannenbaum40`'s ternary — the exact fix from item 23 — surfaced that the ternary
      only covered 3 of the 4 values. The `"launched"` path (Sea Lion actually attempted and
      failed, via `sealionDisaster40` → `sealionAftermath40` → `tannenbaum40`) was never handled,
      so a JS object-lookup miss silently rendered the literal string `"undefined the Balkans not
      yet urgent..."` — a real bug shipped in the very fix meant to close this class of issue,
      and one that couldn't have been caught by `check-reachability`'s simulation-error count,
      because `undefined + string` doesn't throw in JavaScript, it just produces wrong text. Fixed
      by adding the missing `launched` case. Cross-checked the `balkans` node (the pattern
      `tannenbaum40` was modeled on) for the same gap — it already correctly handled all 4 values,
      confirming the omission was specific to the new code, not inherited from the reference
      pattern. This is direct, concrete confirmation of the answer given to Craig's "how do I stop
      this happening" question in item 23: the audit tooling structurally cannot catch this bug
      class, only careful tracing of a flag's full value set against every ternary that keys on it
      can — exactly the discipline that caught this one, immediately after the phase where that
      discipline was written up as the mitigation.
    - `npm run audit` passes clean: `NODE_TOTAL` unchanged (238 — no new nodes, only situation-text
      and, in 2 spots, impact/weight edits on existing choices), no new dead titles or reachability
      gaps beyond the same 7 pre-existing warnings, 0 simulation errors across the 40,000-run-per-
      mode Monte Carlo pass, no advisor anachronisms, no directional-date or outcome-sign
      mismatches (650 resolved choice/outcome pairs checked, up from 649). `docs/claims.csv`
      re-extracted and merged forward clean: all 173 previously-filled verdicts matched and carried
      over automatically this time (no orphaned claims, unlike item 23's one manual re-review), 0
      new HIGH/MED claims requiring verification — the new tissue is entirely connective/speculative
      framing referencing already-established in-game flags, not new hard historical claims.
      `npm run build` clean. Verified live via Playwright: 8 full randomized playthroughs (2 seeds
      × 4 campaigns, 36-73 steps each) with zero page/console errors and zero `"undefined"` text
      leaks anywhere — the specific regression class the caught bug above represents — plus a
      targeted run confirming the Sea Lion "commit" tissue renders correctly at `tannenbaum40`, and
      direct code review confirming both light-mechanic edits (the `atlanticWall43` fuel bonus and
      the `southernPursuit43` weight formula, which appears twice and must stay in sync for the two
      `uncertain[]` outcomes to sum to 100) are internally consistent.

25. **Fixed the paper-wear system's "perfect circle" stains, per external playtest feedback.**
    Craig shared a playtest report (by a tester going by "ZexionHearts") and asked to improve the
    "paper marking and redaction system" — the existing wear-effect layer (`REDACTION_PCT`,
    `WearWaterStains`, `WearManpowerNote`, `WearPaperclipTornCorner`, `TIME_ROTATION_DEG`) that
    visually ages the paper based on the manpower/fuel/initiative meters' severity tiers. The
    report's one concrete, actionable complaint: "I wasn't a huge fan of the perfect circle stains
    on the german paper, but I do like the idea of stains on the paper." It also floated a second,
    much larger idea — stains keyed to *decision type* (war choices bloody the paper, diplomatic
    ones keep it pristine) rather than to the existing meters — which would need a new state
    dimension tagged across ~230 nodes. Scoped via `AskUserQuestion` before touching anything;
    Craig chose the contained fix only (circle-stain shape), not the decision-type mechanic.
    Fixed `WearWaterStains` (`src/App.jsx`, formerly ~line 14561): the old version rendered each
    stain as a flat `border-radius: 50%` circle with a plain radial-gradient fade. Replaced with
    a two-layer "blot" — a main shape using the CSS asymmetric-border-radius blob technique (four
    different corner radii) plus a non-uniform `scale()`, *and* a smaller offset "satellite"
    droplet blob layered beside it, since a single blob alone still reads as a stretched oval at
    ~100px and needs the second offset lobe to actually look irregular. Each stain's gradient was
    also changed from a flat dark-center fade to a "coffee ring" profile (pale center, a darker
    ring nearer the edge, fading past that) to look like an actual dried stain rather than a soft
    blur. All 4 presets got distinct blob shapes/gradient centers so they don't look like the same
    shape reused four times. Purely a presentational change — no flags, node content, or meter
    logic touched, so the reachability/advisor-date/pace/outcome-sign audits aren't affected by
    construction and weren't re-run in full; `npm run build` is clean. Verified visually via
    Playwright: drove a playthrough down through strained → severe fuel/manpower tiers (fuel to
    -5, manpower to -10 — which also reconfirmed the report's other observation, that there's no
    floor gate stopping further manpower-costing choices once manpower is already at -10, noted
    here but not in scope for this fix) and screenshotted the paper at 2, 4, and 6 rendered blot
    elements (matching the `strained`/`severe` stain counts); zero console/page errors throughout,
    and the redaction/manpower-note/torn-corner/rotation effects that share the same render path
    were confirmed still rendering correctly alongside the new stains.

26. **Stopped the paper from drifting during typing, added a real scroll-to-top, and audited
    (not yet fixed) the Italy campaign's choice economy.** Craig's follow-up, verbatim: "Just to
    note they shouldn't move with the paper and after making a selection the page shoudl return
    to the top. Also way too many Italian choices with just two plain options. You cannot seem
    to play a well managed Italian wat [war]." Three separate claims, investigated separately —
    two were real, code-confirmed bugs and got fixed; the third turned out not to be what it
    looked like, but pointed at a real problem underneath.

    **"They shouldn't move with the paper" — the stains drifting during the typewriter
    animation.** `BriefingScreen` is the only screen that uses `Typewriter` (character-by-
    character reveal), and its choice buttons render immediately below the still-growing text,
    not gated on the animation finishing — so the card's height keeps increasing throughout.
    Two compounding causes: (1) all three "screen" wrappers (`BriefingScreen`, `OutcomeScreen`,
    `EndScreen`) used `flex items-center` to vertically center the card in the viewport, so a
    growing card kept re-centering, visibly carrying everything on it — stains included — up the
    screen; (2) `WearWaterStains`' own `top` offsets were percentages of the card's *current*
    height, which itself was changing every frame. Measured with Playwright before touching
    anything (sampling a stain's `getBoundingClientRect().top` every 120ms through a typewriter
    run): 126px of drift from cause (1) alone. Fixed (1) by changing all three wrappers to
    `items-start` — confirmed by re-measurement this alone cut the drift to ~17px, the residual
    from cause (2). Fixed (2) by converting the stains' `top` from percentages to fixed pixel
    offsets from the card's top edge (`left` stays a percentage — width never changes, so
    there's nothing for it to drift against) — a real stain sits at one fixed spot on the page
    regardless of how much text ends up on it, so this is also the more physically correct
    choice, not just the stable one. Re-measured after both fixes: 0px of drift across the full
    animation (14 samples, all exactly 106px).

    **"After making a selection the page should return to the top."** There was no scroll-reset
    logic anywhere in the codebase (confirmed by grep — zero hits for `scrollTo`/
    `scrollIntoView`/`window.scroll`). `BriefingScreen`, `OutcomeScreen`, and `EndScreen` each
    already had a `useEffect` that focuses the heading ref, keyed on the content that identifies
    "this is a new node" (`[reportNumber, stage]` / `[stage, choiceIndex, rollIndex]` /
    `[campaign.id, flags]`) rather than on mount alone, because rewinding can change which node a
    still-mounted `BriefingScreen` is showing without unmounting it. Added `window.scrollTo({
    top: 0, left: 0 })` into each of those same three effects, so the reset fires on every actual
    node change (fresh node, rewind, or outcome-to-next-briefing) rather than only on mount.
    Verified with Playwright: scrolled the page to a nonzero position, made a choice, confirmed
    `window.scrollY === 0` immediately after, across 10 repeated choices in the same run.

    **"Way too many Italian choices with just two plain options" — investigated, and this
    specific framing doesn't hold up.** Walked all four campaigns' `resolveNode` graphs (12,000
    randomized playthroughs per campaign, normal + hard mode, over the same `campaigns_extracted.js`
    harness `check-reachability.js` uses) and tallied how many distinct nodes offer exactly 2
    choices: German 65%, Soviet 91%, Allied 98%, Italy 100%. Italy isn't an outlier — Allied is
    already at 98%. German is the outlier, in the other direction, because it's the campaign that
    got the most 3+-choice deep forks in an earlier round. So "Italy specifically has too many
    binary choices" isn't accurate as stated — it's a codebase-wide pattern outside German, not
    an Italy problem.

    **But "you cannot seem to play a well-managed Italian war" checks out, and it isn't about
    choice count.** The same walk recorded every choice's net resource impact (manpower + fuel +
    initiative, unweighted across `uncertain[]` branches). Average net impact per choice-outcome:
    German −0.47, Soviet −0.36, Allied −0.39, **Italy −0.79** — roughly double the other three.
    Share of choice-outcomes that are net-positive: German 28%, Soviet 39%, Allied 34%, **Italy
    11%**. Sampling 20 of Italy's nodes directly (choice labels + net impact) makes the shape of
    it visible: most decisions are "lose less" rather than "win" — several ("Surrender in
    Tunisia," "El Alamein") offer two options that are both net-negative, with no third option
    and no way to come out ahead either way. Only 3 of the 20 sampled nodes had any net-positive
    option at all. This is plausibly deliberate — Italy's actual WWII arc was one of managed
    decline and subordination to Germany, and the campaign's tone matches that — but it's a real,
    measured, Italy-specific asymmetry, and it's a legitimate reason a player would feel there's
    no way to actually manage the war well regardless of which choices they pick. Not fixed this
    round: rebalancing which choices carry which impact values is a content/design decision
    (how much of the felt "always declining" is intentional vs how many nodes should get a
    genuinely rewarding option added), not a bug fix, and needs Craig's call on scope before
    touching ~40 nodes' impact values. Left as an open question below.

    `npm run build` clean throughout. The stain/scroll fixes are presentational and don't touch
    flags, node content, or meter logic, so the full audit wasn't re-run; verified instead with
    the targeted Playwright measurements described above plus the existing 8-run randomized
    playthrough check (all 4 campaigns, 2 seeds) — zero page/console errors, zero `"undefined"`
    leaks. The Italy choice-economy analysis is read-only investigation; nothing in `src/App.jsx`
    changed as a result of it.

27. **Added Easy Command — a new difficulty tier below Open Command, with a choice-impact
    preview and the historical choice marked.** Craig's request, verbatim: "I want to add an
    easy mode before the regular mode where you can see the impact of your node impacts before
    your choice with the historical choice marked." This was also the first of the two
    playtester recommendations from the original report ("Add an easy or dev mode to show
    exactly what stats will go up with decisions made") — not acted on when that report first
    came in, acted on now that Craig asked directly.

    Investigated before writing anything: the codebase already had exactly the infrastructure
    this needed. Every choice can carry `historical: true` (151 of 238 nodes have one marked —
    the rest are nodes reached only after the player has already diverged from the historical
    record, where no choice *can* be "what happened"), and `proceed()` already does
    `stage.choices.find((c) => c.historical)` to compute the post-hoc "how did you compare to
    history" scoring log. So marking the historical choice needed no new data — just reading a
    field nothing in the UI had exposed yet.

    **New mode: `mode === "easy"`.** Added a fifth mode alongside `open`/`iron`/`purge`/
    `coalition`/`axis`, mechanically identical to Open Command (rewind available, no ceiling,
    no political-capital tracking) — the only difference is what's visible before you choose.
    Added an "◇ Easy Command" button to each campaign's card in `SelectScreen`, positioned
    before "Open Command" per Craig's "before the regular mode." Added an `easy` entry to
    `warRoomModeInfo()` so the War Room briefing screen describes it before entering. Extended
    the "War in Progress" resume card (`SelectScreen`) to show any non-open mode's label via
    the same `warRoomModeInfo()` helper, rather than the pre-existing ad hoc check that only
    special-cased Führer Mode and silently showed nothing for Purge/Coalition/Axis resumes — a
    latent gap, fixed in passing since it was a one-line reuse of code just added for Easy mode.

    **In `BriefingScreen`, gated on `easy`:** each choice button now shows (1) a "◆ What the
    record shows happened" badge when `choice.historical` is true, and (2) a "Δ" impact-preview
    badge. For a plain choice this reads e.g. "Δ Manpower -1, Fuel +1" via a new
    `formatImpactPreview()` helper (omits meters the choice doesn't touch; reads "No meter
    change" for choices that only set flags). For an `uncertain[]` choice it lists each
    branch's title and impact ("Δ Branch A: Manpower -1 · Branch B: Fuel +2"), mirroring
    `v.impact || choice.impact` fallback exactly the way `effectiveChoice()` already resolves it
    for real, so the preview can't drift from what actually happens. One deliberate exception:
    choices with `concealRoll: true` (~10 nodes where the game intentionally hides the odds
    until the outcome screen, as a narrative device representing genuine fog-of-war) show
    neither the branch breakdown nor impacts — "Outcome genuinely uncertain — not even the
    preview can tell you this one" — because Easy Command reducing ordinary friction shouldn't
    quietly undo a different, deliberate design choice elsewhere in the game.

    Icon choice: reused the existing plain-symbol badge vocabulary (⚔ ☭ ★ ⚄ ⛔ ✓ ▲ ▼) rather
    than a pictographic emoji — an early draft used 📜 for the historical badge and it silently
    failed to render as a glyph in the Playwright test browser (a missing-color-emoji-font
    sandbox limit, not necessarily a real-browser problem, but not worth risking) — swapped to
    ◆, which also pairs visually with the ◇ used on the mode-select button itself.

    **Consistency fix:** the paper-wear redaction gate (`campaign.dynamic && mode !== "open"`,
    3 call sites — situation text, epilogue, one-year-later text) previously treated every
    non-open mode as eligible for word redaction. Since Easy Command is a new non-open,
    non-hard mode, left unguarded this would have silently started blacking out words in the
    one mode where showing the player *more* information, not less, is the entire point.
    Changed all 3 to `mode !== "open" && mode !== "easy"`.

    Verified with Playwright: confirmed the Easy Command button renders on every campaign card
    before Open Command; entered Easy Command on OKW and confirmed both badge types render
    correctly on real nodes (screenshotted); ran randomized full-length playthroughs in Easy
    mode on all 4 campaigns (60 steps each) — zero errors, zero `"undefined"` leaks, the Δ
    badge present throughout every run; re-ran the existing Open-Command regression (all 4
    campaigns) to confirm nothing broke there; confirmed Führer Mode still redacts text
    correctly (block-character redaction observed at manpower/fuel severity), so the `mode !==
    "easy"` addition to the redaction gate didn't loosen it for hard modes. Save/resume mode
    persistence was verified by code inspection rather than an end-to-end save/reload (the
    `window.storage` API this game's save system depends on is injected by the real hosting
    platform and isn't present when loading the build directly in a test browser) — `mode` is
    stored and restored as a plain string with no whitelist anywhere in `isValidActiveRun` or
    the save/load path, the same mechanism `iron`/`purge`/`coalition`/`axis` already rely on.
    `npm run build` clean.

28. **Unified the War Room mode label and its explanatory note into one block.** Craig: "when
    you click on your chosen command on the enter the war room box there is a paragraph and a
    break line explaining the nuance of each difficulty. Instead of having the [mode] and text
    separate like the example." Correct as reported — in all 4 War Room doc components
    (`WarRoomDocOKW`, `WarRoomDocComandoSupremo`, `WarRoomDocSTAVKA`, `WarRoomDocSHAEF`) the mode
    name (`modeInfo.label`, e.g. "FÜHRER MODE") rendered right after the letterhead fields, and
    its note (`modeInfo.note`) rendered separately near the bottom of the card after the
    historical-context paragraph and quote — two unrelated-looking pieces of text with no visual
    connection between them.

    Removed the early standalone label `<div>` from all 4 components. Replaced the late
    standalone `<p>{modeInfo.note}</p>` with one unified block — a `2px solid` divider in the
    campaign's accent color, then the mode label as a small caps heading, then the note as body
    text directly beneath it — placed after the quote (and, on OKW/Comando Supremo, before the
    existing VERTEILER/DISTRIBUZIONE distribution-list footer line; STAVKA/SHAEF have no such
    footer, so the block sits directly above the Enter/Back buttons there). Same treatment
    applies to every mode's note, not just Open Command — Easy Command's longer note and each
    hard mode's note render through the identical block.

    Verified with Playwright: built (`npm run build` clean) and screenshotted the War Room
    screen for all 4 campaigns after picking Open Command — each shows the historical paragraph,
    the quote, a single accent-colored rule, then the mode name and its note as one grouped
    block, then (where applicable) the distribution footer, then the buttons. Zero page errors
    across all 4.

29. **Renamed the easy and normal tiers, per-campaign for Easy.** Craig: "let's brainstorm some
    fun names... something that was a failure is easy command, something that was common as
    normal," then, across a few rounds of back-and-forth, settled on one name per campaign for
    Easy (each a real, notorious piece of that nation's WWII military equipment) rather than one
    shared name, and a single shared name for Open Command. Landed on: **Elefant Command**
    (German — the Kursk tank destroyer built with no secondary machine gun, so Soviet infantry
    could kill the crew through the hull), **T-35 Command** (Soviet — the five-turreted "land
    battleship" so unreliable that most of the handful built broke down before reaching the
    front in summer 1941), **Defiant Command** (Allied — the fighter built around a rear gun
    turret with no forward-firing guns, mauled once German pilots worked out its one trick), and
    **Breda Command** (Italian — the Breda 30 light machine gun, notorious for jamming from its
    awkward fixed side magazine). Open Command is renamed **Standard Issue Command** across all
    4 campaigns. The 4 hard-mode names (Führer/NKVD/Yalta/Axis Mode) are unchanged — Craig
    confirmed they're out of scope for this pass.

    **Implementation.** `warRoomModeInfo(mode)` took only `mode`; Easy's label/note now differ
    by campaign, so it's now `warRoomModeInfo(mode, campaignId)`, backed by two new lookup
    tables (`EASY_MODE_NAMES`, `EASY_MODE_NOTES`) keyed by campaign id, with the old shared
    string kept as a fallback if `campaignId` is ever omitted. Each Easy note now opens with a
    sentence on the equipment the mode is named for, then the existing mechanics description
    (impact previews, historical-choice marking, full visibility) — which doubles as exactly the
    "paragraph explaining the nuance" item 28 built a home for. All 3 call sites updated to pass
    campaign context: `WarRoomScreen` (has `campaign.id`), the "War in Progress" resume card (has
    `activeRun.campaignId`), and the `SelectScreen` mode buttons (has `c.id` in the campaign
    map). The 4 button labels ("◇ Easy Command" / locked variant, "Open Command" / locked
    variant) were hardcoded strings; replaced all 4 with calls into `warRoomModeInfo` so the
    button text, the resume label, and the War Room heading can never drift out of sync with
    each other.

    Verified with Playwright: built clean; confirmed each campaign's select-screen buttons read
    "◇ Elefant/T-35/Defiant/Breda Command" and "Standard Issue Command" respectively (including
    the locked-demo variant text); entered Easy Command on all 4 campaigns and screenshotted the
    War Room screen, confirming each shows its own equipment-failure paragraph correctly grouped
    under the campaign-specific heading via the item-28 block. Zero page errors across all runs.

30. **Easy Command no longer shows the campaign's historical scene-setting text in the War
    Room; moved it to a new References section instead.** Craig: "Can you not pull the
    historical description in the war room screen of easy mode. Just put the details on the
    mode and put the detail in the references." The War Room's `CAMPAIGN_WAR_CONTEXT` paragraph
    and `CAMPAIGN_WAR_ROOM_QUOTE` block (the "APRIL 1940 — Poland fell..." style scene-setter,
    plus a period quote) is the same fixed text for a given campaign regardless of mode; in Easy
    Command specifically, it's now skipped entirely, replaced by a single italic line —
    "Campaign background available under References on the main menu." — sitting where it used
    to be, directly above the item-28 mode block. Normal (Standard Issue Command) and all 4 hard
    modes are unaffected; only Easy skips it.

    That text isn't lost — added a new **References** section to the main menu, a sibling to War
    Record/Dossiers/Settings/Credits, structured the same way (an outer `<details>` containing 4
    per-campaign `<details>`, one per `CAMPAIGNS` entry, each showing that campaign's context
    paragraph and quote). This is the same underlying data as the War Room's own copy, not a
    duplicate — one `CAMPAIGN_WAR_CONTEXT`/`CAMPAIGN_WAR_ROOM_QUOTE` source feeding both, so
    there's no risk of the two ever disagreeing.

    **Implementation.** All 4 `WarRoomDoc*` components take a new `easy` boolean prop (`easy={mode
    === "easy"}`, passed from `WarRoomScreen`, which already had `mode` in scope); the existing
    context-paragraph-plus-quote block is now wrapped in `{!easy && (...)}`, with the pointer
    line as the `{easy && (...)}` alternative. No changes to `CAMPAIGN_WAR_CONTEXT` or
    `CAMPAIGN_WAR_ROOM_QUOTE` themselves — same 4-campaign objects, now read from two places.

    Verified with Playwright: built clean; confirmed Easy Command's War Room for OKW no longer
    contains the campaign context text but does show the pointer line; confirmed Standard Issue
    Command's and Führer Mode's War Room screens for OKW are unchanged (context text still
    present); confirmed the new References section expands and its per-campaign sub-sections
    contain the same context text. Zero page errors across all checks.

31. **Wired in a real background music track.** Craig attached a soundtrack file
    ("Reddit_WWII mix.mp3", a ~2:52 mix) and asked to have it wired in. This turned out to be
    the "drop a real track in at the expected path" step a comment in the code was already
    waiting for: `MUSIC_TRACK_SRC = "theme.mp3"` and a `<audio ref={musicRef} src={MUSIC_TRACK_SRC}
    loop preload="none" />` element (mounted once at the app's top level, outside the
    per-screen switch, so it plays continuously across screen transitions) already existed, wired
    to the Settings panel's Music on/off toggle and volume slider — structurally complete but
    silent, because no file existed at that relative path. No code in `src/App.jsx` needed to
    change for this part.

    What *did* need building: nothing copied static assets into the build output before. Added
    `assets/theme.mp3` (the uploaded track, renamed to match `MUSIC_TRACK_SRC`) to the repo, and
    extended `build.mjs` with a `STATIC_ASSETS` list (currently just `theme.mp3`) that gets
    copied into `dist/<variant>/` alongside `index.html`/`bundle.js`/`output.css` for both the
    full and demo builds, and into the itch.io zips via the same `zipDir` step (previously
    hardcoded to exactly those 3 files).

    **Flagging, not blocking**: a "Reddit mix" is very unlikely to be a track Craig holds
    commercial rights to — a compilation like that is typically pulled together from film-score
    or archival-recording sources by whoever posted it, not composed or licensed for redistribution.
    That's a real risk for a game currently sold on itch.io, distinct from whether the wiring
    works. Worth confirming the actual rights situation (a royalty-free replacement, or a
    licensed/commissioned track) before this build goes out, rather than after.

    Verified with Playwright: built clean; confirmed `theme.mp3` lands in both `dist/full/` and
    `dist/demo/` and in the itch.io zip; toggled Music on in Settings and inspected the `<audio>`
    element directly — `readyState: 4` (fully loaded), `paused: false`, `duration: 172.36s`
    (matches the source file), `error: null`. The track is actually playing, not just present.

32. **Grand Campaign, prototyped for real, behind a dev-only build flag.** Craig: "Can we maybe
    prototype the grand campaign before wiring it into the main game. I feel like the itch
    release might be the individual campaign but a steam release could be the grand campaign."
    `docs/specs/grand-campaign-mode.md` (written earlier this project, never implemented) already
    scoped this: chain German → Soviet → Allied into one continuous run, where each leg's ending
    seeds the next leg's starting flags/meters. Decisions locked in with Craig before writing any
    code: Italy excluded for now (its "parallel war" arc doesn't share this fixed timeline the
    way the other three do — revisit later); real plumbing, not a mockup (so the prototype
    actually tests whether the mechanic feels good, not just whether a screen flow looks right);
    fixed chronological order (matches the spec's own recommendation, avoids writing seed
    translations for every possible ordering); Steam-exclusivity left undecided (the build-flag
    approach works either way, so it didn't need deciding yet).

    **Why a build flag, not a separate build.** This is one 16,000-line source file with all 4
    campaigns' data embedded in it — a genuinely separate codebase for Grand Campaign would mean
    two copies of 238 nodes' worth of content that inevitably drift apart. Reused the exact
    pattern already in place for `DEMO_BUILD`: a new `GRAND_CAMPAIGN_ENABLED` constant, gated by
    an esbuild `define` token (`__GRAND_CAMPAIGN__`) that's `false`/absent in the shipped itch
    full and demo builds and `true` only in a new `dist/dev/` build variant (`npm run
    build:dev`) that is never zipped and never touches `builds/`. Same source, same content,
    zero risk of the entry point reaching a player — verified below, not just asserted.

    **What was actually built** (per the spec's own proposed design): `saveRunRecord()` now also
    captures a `record.legacy` snapshot (final flags/meters per campaign) alongside its existing
    summary line. A `GRAND_CAMPAIGN_SEEDS` table holds one pure function per transition
    (`german_soviet`, `soviet_allied`) reading the prior leg's legacy and returning a small,
    curated `{ seedFlags, seedMeters }` — deliberately thin for a first prototype (1 flag per
    transition, a ±1 meter nudge) rather than the spec's recommended 4-6 for a shipped version,
    since the point right now is proving the mechanic works, not finishing the content pass.
    `pickCampaign()` takes an optional `seed` param merged on top of its normal defaults.
    `startGrandCampaign()`/`continueGrandCampaign()` (new) drive a `grandChain` state
    (`{ order, index }`) through the chain. `EndScreen` shows a "Grand Campaign (prototype) — Leg
    X of Y" badge and, on any non-final leg, a "Continue Grand Campaign — <Next Campaign> →"
    button that jumps straight into the next leg's War Room — no return to the main menu.
    `SelectScreen` gets a dashed-border "Grand Campaign" entry point, visible only when
    `GRAND_CAMPAIGN_ENABLED`.

    **The one content touch, in each direction.** German's `sealion` flag (did the campaign
    commit to invading Britain, or pivot east early) becomes Soviet's `legacyGermanOpening`
    flag, acknowledged in one added sentence in the Soviet opening node (`border41`). Soviet's
    final `initiative` meter becomes Allied's `legacyEasternFront` flag, acknowledged similarly
    in the Allied opening node (`narvik40`). Both are written as retrospective echoes ("History
    will note...", "History will eventually record...") rather than claims of simultaneity —
    each campaign keeps its own fixed historical start date regardless of Grand Campaign (Soviet
    always opens June 1941, Allied always opens April 1940, which is actually *before* a Soviet
    leg played first could have "ended"). Grand Campaign was never a shared clock; it's state
    and flavor carried forward, exactly as the spec describes.

    **Flagging, not blocking**: unlike the `DEMO_BUILD` precedent (whose comment claims Terser
    fully strips dead branches per variant), esbuild's minifier does *not* eliminate the
    Grand-Campaign-only code from the full/demo bundles — the string "Grand Campaign" and the
    dead `GRAND_CAMPAIGN_SEEDS`/UI code are still physically present in the shipped itch
    `bundle.js`, just unreachable at runtime (confirmed: 0 render, 0 clickable entry points in
    both `full` and `demo`). Functionally safe, but not literally invisible to someone reading
    the minified source — worth knowing if that distinction matters before this goes further.

    **Verification.** Playwright, on the `dev` build only: confirmed the Grand Campaign entry
    point is absent (0 occurrences, 0 clickable buttons) in `full` and `demo`, present and
    clickable only in `dev`. Played a full German leg through to its ending — "Leg 1 of 3" badge
    correct, "Continue Grand Campaign — Soviet High Command →" button present and correctly
    labeled. Clicked it: landed directly on the Soviet War Room (no menu detour); entering the
    briefing showed the `legacyGermanOpening` text correctly reflecting the German run's actual
    `sealion` choice. Played the Soviet leg through to its ending — "Leg 2 of 3" badge correct.
    Continued into Allied: the `legacyEasternFront` text correctly reflected the Soviet run's
    actual final initiative meter. Played Allied through to its ending: no "Continue Grand
    Campaign" button (correctly absent — last leg). Zero page errors across the entire 3-leg,
    ~150-decision chain. `npm run build` (itch) and `npm run build:dev` (prototype) both clean.

33. **Historical Divergence Mode (a "Historically Accurate Opponent" War Room toggle) + a
    placeholder Checkpoint Map.** Craig, across a long discussion arc: wanted the AI-controlled
    side to occasionally *not* do what it actually did historically, so the player's own forks
    feel forced rather than entirely self-authored, revealed through a variant of the existing
    Wire Bulletin mechanic, paired with a snapshot-per-year map showing revealed divergences.
    Confirmed in `docs/specs/historical-divergence-and-checkpoint-map.md` before any code: Italy
    included, available at every difficulty tier, even 50/50 odds per fork, forks may change
    which ending is reachable (not just flavor text), unlockable after one historically-accurate
    completion of that campaign, and explicitly *not* the same feature as Grand Campaign (item
    32) — they now share an architectural pattern (seed/flag merging into an existing run) but
    ship independently.

    **The toggle and the roll.** Each War Room screen gets a "Historically Accurate Opponent"
    checkbox, ticked by default, disabled with a "Locked until you've completed one
    historically-accurate run of this command" note until `record.campaignsPlayed` (the existing
    end-of-run tracking) includes that campaign. Unticking it and entering the War Room calls a
    new `rollDivergenceForks(campaignId)`, which flips each of that campaign's 3 forks
    independently at 50/50 — so a single run can diverge 0, 1, 2, or all 3 ways, per Craig's "if
    there are 5 forks then sometimes 2 happen, sometimes 5" framing (scaled to 3 per campaign
    here). 12 forks total, 3 per campaign: German (Norway held longer, Moscow's reserves thinner,
    Torch's fleet delayed), Soviet (a slower Barbarossa opening, no Kiev diversion, Stalingrad
    consolidated early), Allied (Narvik reinforced, the Luftwaffe never shifts off airfields, no
    SS armor at Arnhem), Italy (Greek frontier holds firmer, the East African retreat slows,
    Malta convoy losses down).

    **Reveal, not spoiler.** Each fork rolled true is announced the first time its designated
    node is reached, via a new `DIVERGENCE_HEADLINES` table fed through the *same* `WireBulletin`
    component and `screen === "wire"` flow the game already uses for real off-theater news — a
    deliberate reuse, not a new UI. The divergence check in `chooseOption` runs before the
    existing probabilistic real-news check and wins if it matches, so a fork's reveal is never
    randomly skipped in favor of an unrelated headline. Three forks (German Norway, Soviet
    border, Allied Narvik) sit on their campaign's own opening node, which `chooseOption`'s
    trigger can never fire for since it only runs on a *transition* — special-cased directly in
    the rewritten `enterWarRoom`, which checks for a start-node fork immediately after rolling
    and routes to the wire screen before the first briefing if one hit.

    **Ending-level stakes, per Craig's "allow ending-level changes" answer** — the larger-scope
    option over "flavor and meters only." One fork per campaign is ending-capable (Moscow's
    reserves, no Kiev diversion, the Luftwaffe airfield fixation, the East African slowdown):
    each both nudges an existing `uncertain[]` branch's odds by +20 when active (`modWeight(...) +
    (flags.forkX ? 20 : 0)`, mirrored on the complementary branch) *and* gates one brand-new,
    distinctly-titled `positionLabel` branch on the fork flag together with that branch's own
    downstream flag — reusing the pattern already established (documented in each `positionLabel`
    function) where early-run flags are read at the very end to pick a title, so no new engine
    mechanism was needed. 4 new endings, 4 new `ENDINGS_GALLERY` entries: "The Winter That Wasn't
    Supposed to Happen" (OKW), "The Capital That Evacuated Anyway" (STAVKA), "Fighter Command,
    Nearly Spent" (SHAEF), "The Highland War Rome Didn't Plan For" (COMANDO SUPREMO).

    **Containment, deliberately.** Every fork's downstream acknowledgment (a second node's
    `situation` text, appended via the same `+ (flags.forkX ? "..." : "")` pattern used
    elsewhere) was assigned to avoid two independently-rollable forks within one campaign ever
    sharing a node — 3 of the 12 pairings needed a different downstream node than a first pass
    suggested (`border41`, `narvik40`, and `greeceDecision40` each had a natural next node that
    collided with a sibling fork's own primary node) to keep the "just major, not every fork,
    with some downstream awareness" scope Craig asked for from compounding unpredictably.

    **Checkpoint Map — the cheap-snapshot version Craig confirmed** ("it's fine that the map
    doesn't change after each choice... more each year"). A new "Map" button on the briefing
    screen opens `CheckpointMap`, showing a per-campaign, per-year base image
    (`assets/maps/<campaignId>/<year>.png`, from a new `CAMPAIGN_MAP_YEARS` table covering each
    campaign's real node-date span) with a small marker for every fork *already revealed* via its
    Wire Bulletin this run (`flags[fk.flag] && seenWireHeadlines.includes(fk.id)`) — never for a
    rolled-but-unseen fork, so the map can't spoil a divergence before its own reveal does.

    **Placeholder art, generated, not hand-drawn** — Craig's explicit choice over a manual-art
    pipeline for this round. `tools/generate_placeholder_maps.py` renders all 23 needed images
    (German/Allied/Italy 1940-45, Soviet 1941-45), aged with paper grain, a campaign-accent wash,
    a compass rose, and a "PLACEHOLDER ART" watermark so nobody mistakes these for final art
    later. `build.mjs` gained a `STATIC_ASSET_DIRS` list (alongside the existing single-file
    `STATIC_ASSETS`) so `assets/maps/` is recursively copied into every build variant's output
    directory, and `zipDir` now adds that directory into the itch zips with its internal
    structure preserved (the existing `-j`/junk-paths handling stayed for the flat top-level
    files only, since junking would have flattened `assets/maps/<campaign>/<year>.png` into name
    collisions).

    **Real geography, not blob art — round 2 on the same script.** Craig's first look at the 23
    placeholders: "these maps don't look like the European theatre and more just blobs" — accurate
    criticism, since v1 drew a purely synthetic wandering polygon per campaign with no relation to
    actual coastlines. Searched the MCP connector registry for a design/image-gen service first
    (none available); Craig chose "real geography, styled by code" over waiting on an external
    tool. `generate_placeholder_maps.py` now renders actual coastline/border data via
    `mpl_toolkits.basemap` (backed by the `basemap-data` PyPI package, which bundles real
    shapefiles inside the package itself — this sandboxed environment's egress proxy blocks
    ad-hoc CDN fetches like Natural Earth's own distribution servers, so a library that needs a
    runtime download, e.g. `geodatasets`, wasn't usable; a self-contained pip package was), then
    composites the same aged-paper/vignette/accent-wash/compass-rose/watermark treatment on top
    exactly as before — only the base geography layer changed. Each campaign gets its own
    lat/lon bounding box sized to its full node-date span, not just its opening front (`italy`
    reaches south to the Horn of Africa and east to the Levant for its East Africa and Western
    Desert nodes; `soviet` reaches west to Berlin for 1945; `german` and `allied` both reach
    into the Mediterranean/North Africa). One honest caveat worth flagging: `basemap-data`'s
    borders are modern, not 1940s-era — a real cartography pass would need historical border
    data, which is a bigger undertaking than this placeholder round called for. Added a
    palette-quantize step (`Image.quantize(colors=64)`) before saving, since a flat-illustration
    style needs far fewer than 24-bit color depth — cut the shipped `assets/maps/` payload from
    7.7MB to 3.4MB with no visible quality loss, which matters because all 23 images ship inside
    every itch.io build zip. CheckpointMap's fork markers are positioned by a deterministic
    pseudo-percentage formula, not real coordinates (see `CAMPAIGN_MAP_YEARS`/`CheckpointMap` in
    `src/App.jsx`), so no marker-geocoding work was needed to match the new base art. Verified via
    a full production build (`npm run build`) confirming the smaller PNGs still copy into
    `dist/*/assets/maps/` and zip into `builds/*.zip` with directory structure intact, plus an
    in-app Playwright screenshot of the Comando Supremo Checkpoint Map showing the real
    Mediterranean/North Africa coastline rendering correctly inside the actual dialog. The
    node-graph "Continental Situation" map (`EuropeMap`/`TheaterGraph`, in `BriefingScreen`)
    stays the game's primary in-play map per Craig's instruction — this round only replaced the
    Checkpoint Map's base art, it didn't touch that feature.

    **Round 3 — colour each nation by owner, with historical borders.** Craig's next ask, after
    seeing the real-geography art: correct borders, and color each region by who controlled it.
    Before building, laid out the concept and flagged a real constraint: no offline,
    registry-installable dataset of actual 1938-45 political boundaries exists (checked pip and
    npm) — `basemap-data` only has modern borders, so period-accurate shapes would mean hand-
    tracing from reference knowledge, a real accuracy risk in a game that markets itself on being
    historically grounded. Also surfaced a second fork: should ownership color reflect the
    canonical historical timeline only (a static PNG, cheap) or the player's own Historical
    Divergence Mode run (a live overlay reusing `mapOverrides()`, more correct, more work)? Craig
    picked hand-approximating the worst-offender borders, and the dynamic/live option.

    **The data model already existed and didn't need re-researching.** `MAP_YEAR_STATUS` (the
    schematic Continental Situation map's per-region, per-year 1939-45 ownership table) plus
    `mapOverrides()` (which adjusts it live from the player's own Historical Divergence flags) are
    the exact "who owns what, including this run's own divergences" data this needed — reused
    directly rather than rebuilt, so the two maps can never disagree with each other.

    **Region shapes**: `tools/build_region_geometry.py` (new) sources modern country outlines
    from `world-atlas`'s `countries-110m.json` (npm, offline, bundled TopoJSON — converted to
    GeoJSON via `topojson-client` in `tools/geo_pipeline/convert.mjs`), dissolves them with
    shapely into `MAP_REGIONS`' 24 ids exactly as that table already aggregates them (`benelux`,
    `baltics`, `iberia`, `nwAfrica`, `yugoslavia` as unions of their modern successor states; `ussr`
    as Russia+Ukraine+Belarus+Moldova, since Kiev/Kharkov/Kursk/Bagration/the Dnieper are central
    to this game's own German/Soviet text and a Russia-only shape would visibly misrepresent "the
    USSR"). Poland, Germany, and Czechoslovakia — the three where the real WWII-era shape differs
    enough from today's to matter (Poland's eastern Kresy extent, the Corridor splitting German
    East Prussia from the mainland, Czechoslovakia including Slovakia) — get hand-approximated
    interwar polygons instead, built from general historical knowledge of well-documented
    borders, not a traced authoritative source (none was available) — the script's header comment
    says this plainly, as does this entry: stylistically close, not survey-accurate. Output is
    `assets/maps/regions.json` (24 regions, ~20KB after simplification), a new shipped asset.

    **Rendering**: a new `CheckpointMapRegions` component in `src/App.jsx` fetches
    `regions.json` once, reimplements Basemap's exact spherical-Mercator +
    `fix_aspect=False` linear stretch in JS (`CAMPAIGN_MAP_BBOX`, which must be kept in sync with
    `generate_placeholder_maps.py`'s own bbox table or the overlay drifts out of alignment with
    the coastline art), and renders one colored, semi-transparent `<path>` per region as an SVG
    overlay on top of the existing background PNG — colored live from `MAP_YEAR_STATUS` +
    `mapOverrides(statusYear, flags, meters)`, with a legend and existing fork markers layered on
    top of that. `generate_placeholder_maps.py`'s flat campaign-accent wash was dropped (the live
    overlay is the color now); the base art keeps its aging/compass rose/frame/watermark.

    **A spoiler bug this could easily have shipped with, caught before it existed**: EuropeMap
    already knows `MAP_YEAR_STATUS` entries are year-END snapshots, so it caps display to the
    previous year's close until the current node's own choice is `resolved` — showing the node's
    own year would leak the outcome of the decision the player is about to make. CheckpointMap's
    new overlay needed the identical cap (`cappedStatusYear`, threaded a new `resolved` prop) or
    it would have quietly spoiled, e.g., Italy's own neutrality-to-belligerence choice by coloring
    Italy already-committed before the player picks. Playwright-verified directly: opening the
    map at Italy's very first (unresolved) node shows Italy as 1939's "neutral," not 1940's
    "axisAllied," with the caption reading "Ownership shown through end of 1939."

    **Verified**: a projected-overlay-on-real-background contact sheet for all four campaigns
    confirmed alignment (coastlines and region borders line up without a mapping library
    double-check needed — the JS reimplementation of Basemap's projection matched pixel-for-pixel
    in testing); a live Playwright run through German's Fall Tannenbaum choice (invade
    Switzerland) confirmed the SVG's Switzerland `<path fill>` actually changes from neutral to
    contested/axis the moment that flag is set, with no art regenerated — proving the dynamic
    override path, not just the static baseline; full production build confirmed `regions.json`
    ships inside every itch zip alongside the map PNGs; full `npm run audit` clean, no regressions.

    **The unrelated one-line fix Craig confirmed alongside this**: the Allied campaign header
    read `"1942 — 1945"` — SHAEF's actual first node (`narvik40`) is dated April 1940, the same
    off-by-two-years error pattern as prior date-string fixes this project. Corrected to `"1940 —
    1945"`.

    **Verified with Playwright** against the `dev` build (this feature ships in `full`/`demo` too
    — `dev` was just the fastest already-built variant with the fix on it), with a `window.storage`
    shim injected via `addInitScript` (the real API is hosting-platform-injected and absent in a
    bare test browser, per the established note on item 27's save-path verification) so the
    unlock gate could actually be exercised end-to-end rather than only by inspection: confirmed
    the checkbox renders disabled with the locked copy on a fresh record, and enabled with the
    unlocked copy once `campaignsPlayed` includes that campaign; with `Math.random` forced low,
    confirmed all three start-node forks (German, Soviet, Allied) correctly show their Wire
    Bulletin immediately on entering the War Room, with the right agency byline and headline
    text per campaign; with `Math.random` forced high, confirmed German instead lands directly on
    the briefing with no bulletin; confirmed Italy (whose forks don't sit on its start node)
    correctly shows no immediate bulletin even with forks forced on. Played one German run
    through a forced Norway-fork reveal, continued past the bulletin, opened the Map, and
    confirmed it read "1940" (matching the current node's year), showed the placeholder art
    (network request 200, `<img>` rendered), and displayed exactly "1 confirmed divergence" with
    one visible marker — zero before the reveal would have been the bug to catch, and wasn't
    seen. Zero page errors across every scenario. Confirmed by code inspection (values traced
    through `setFlags` in the node graph) that all four ending-capable forks' downstream flags
    (`moscowCaptured`, `moscowPanic: "left"`, `battleOfBritain40: "bigWing"`,
    `eastAfricaGuerrilla: "traction"`) are ordinary reachable flags, not something only a fork
    could produce — the fork narrows an existing outcome's odds, it doesn't invent one.
    `npm run check-reachability` reports the 4 new endings as "never produced," which is a known
    blind spot rather than a bug: the simulator only ever sets flags it discovers inside a node's
    own `setFlags`/`uncertain[].setFlags` literals while randomly walking the graph, and has no
    concept of the War Room toggle or `rollDivergenceForks`, which sets fork flags *before* the
    graph walk even begins — the same class of gap that would already hide any other
    pre-game-state-dependent title from this harness. All prior warnings/hard-checks unchanged.
    `npm run build` and `npm run build:dev` both clean.

    **A second, deeper playtest pass (Craig: "playtest it first") found and fixed two real bugs**
    that the scenario-level Playwright checks above didn't catch, because they're about node
    *order*, not node reachability. Rather than clicking isolated War Room scenarios, this pass
    traced actual choice-by-choice paths through the compiled node graph (a small throwaway BFS
    tool, `tools/find_path.js`, walks `campaign.resolveNode()`'s real `next`/`uncertain` pointers
    to find one) and drove full playthroughs with Playwright to each fork's primary AND downstream
    node, reading the rendered text at both. That surfaced a real defect: two of Italy's three
    downstream acknowledgment nodes — the ones reassigned during the original build to avoid the
    same collision problem noted in the Problem Solving section then — were reassigned to nodes
    that are chronologically *before* their fork's own primary reveal node, not after. `alpsFront40`
    (June 1940) was carrying `forkGreeceResistance`'s acknowledgment text, describing a frontier
    response that, per the story, doesn't happen until `greeceDecision40` in October — a player
    reaching the correct node order would have read about an event four months before it was ever
    revealed to them. Same defect, `compass40` (December 1940) carrying `forkEastAfricaSlow`'s
    acknowledgment for a fork whose primary node, `eastAfrica41`, doesn't occur until May 1941.
    Root cause: both replacement nodes were picked by "reachable from the same campaign, not the
    colliding node" without checking they were reachable *after* the primary node specifically —
    graph reachability and chronological order aren't the same test, and this build only ran the
    first one. Fixed by moving `forkGreeceResistance`'s acknowledgment to `greeceWinter40`
    (November 1940 – March 1941, genuinely downstream of `greeceDecision40`, and already thematically
    about the same Greek-resistance premise) and `forkEastAfricaSlow`'s to `rommelAdvance41`
    (November 1941 – January 1942, genuinely downstream of `eastAfrica41` via `convoyWarMalta41`).
    The other 10 fork/downstream pairings (including the other 2 reassigned-for-collision cases,
    German's `norway40`→`caseYellow40` and Allied's `narvik40`→`dunkirk40`) were audited the same
    way and are all correctly ordered — those two happened to be safe by construction, since both
    primary nodes are their campaign's own start node and nothing can precede a start node.

    Re-verified after the fix: `npm run check-reachability` re-run clean (same 4 known
    false-positive warnings, nothing new); rebuilt `full`/`demo`/`dev` clean; a full scripted
    Playwright playthrough of German's `moscowRace41` fork end to end — War Room toggle through
    12 traced choices to the gamble itself, through to the actual final ending screen — confirmed
    "The Winter That Wasn't Supposed to Happen" renders with the correct "Major Victory" tier and
    a coherent epilogue; a full scripted playthrough of all 3 Italy forks together (forced active
    via a mocked `Math.random`) confirmed all three Wire Bulletins fire at their correct
    chronological points with correct agency bylines, confirmed the fixed `alpsFront40` no longer
    carries the stale text and `greeceWinter40`/`rommelAdvance41` now carry it correctly, and
    carried the run through to "The Highland War Rome Didn't Plan For" with the correct "Minor
    Victory" tier. Zero page errors across both full playthroughs.

    **Not yet done**: the placeholder art is exactly that — a real illustrated-map pass (or a
    licensed/generated replacement) is still open before this should be considered ship-ready,
    the same caveat item 31 raised for the music track. No git commit has been made for this
    round yet.

34. **Checkpoint Map, round 4 — comprehensive historical-accuracy and reactivity pass.** Craig:
    "review the maps and suggest improvements... to make it as historically accurate and reactive
    as possible," then "do all of it except the divergence mode alternate history fun improvements
    suggestion" (the one item flagged as the big optional swing — a "compare to real history"
    alternate-timeline toggle — stayed explicitly out of scope). Ten items, in order:

    **The core reactivity bug this round found and fixed**: `mapOverrides()` — the function both
    maps read to color the player's own run — had zero awareness of any of the 12 Historical
    Divergence forks (item 33). A run with 3 forks active rendered pixel-identical to a fully
    historical run; the entire feature the Checkpoint Map exists to showcase produced no visible
    map effect. Wired all 12 forks to a modest, historically-plausible territorial nudge in their
    own reveal year, ordered so a genuine structural divergence (`pathVariant`, `reichStand`, etc.)
    wins over a fork's smaller nudge if both ever touch the same region/year. One documented
    exception (`forkLuftwaffeShift` has no lower/higher state for Britain to move to in this
    schema — a legitimate note-only case) and one documented real collision (`forkBarbarossaDelay`
    and `forkKievPush` are both Soviet-campaign forks that can independently both roll true and
    both touch `ussr` in 1941 — resolved by ordering `forkKievPush` second, the more narratively
    decisive of the two). Separately fixed 4 pre-existing note-only gaps in the same function
    (`reichStand === "east"`/`"north"`, `moscowCaptured`, `med42 === "malta"` never actually moved
    a region's color despite claiming to in their own note text) plus a silent no-op in
    `reichStand === "west"` (it assigned Czechia to "soviet" when Czechia was already "soviet" for
    1945 — retargeted to Austria, the actually-affected region). Verified live, not just by code
    inspection: with `Math.random` forced low around the War Room roll only (restored immediately
    after, so downstream gameplay rolls stayed real), reached a German node with Norway's fork
    active and confirmed the Checkpoint Map rendered Norway as "Contested" instead of its
    historical "Axis-occupied" — the exact bug this pass fixed, caught in the act of being fixed.

    **Turkey, added as a full 25th `MAP_REGION`** (previously absent, with `turkishQuestion44`/
    `turkishBelligerence44` pointing at Greece as a stand-in). Added to `MAP_REGIONS`,
    `MAP_GRAPH_EDGES` (`greece`-`turkey`), `MAP_REGION_SIZE`, `THEATERS`, all 7 `MAP_YEAR_STATUS`
    year tables ("neutral" 1939-44, "allied" for 1945 — Turkey's real February 1945 symbolic
    declaration of war to qualify for UN founding membership), and `tools/build_region_geometry.py`'s
    `REGION_COUNTRIES` (confirmed "Turkey" exists in the `world-atlas` country list already in use,
    so no new data source was needed). The two `turkishQuestion44`/`turkishBelligerence44`
    `NODE_HIGHLIGHT_REGIONS` entries now correctly point at `turkey` instead of the old stand-in.
    Regenerating `regions.json` surfaced real clipping in the Allied campaign's bbox (Turkey's
    eastern extent, lon ~44.8°, well past the old `urcrnrlon: 35`, cutting off roughly half the
    country) — widened to `42` in both `CAMPAIGN_MAP_BBOX` (`src/App.jsx`) and
    `generate_placeholder_maps.py`'s own bbox table (which must stay in sync or the live SVG
    overlay drifts from the regenerated background art), then regenerated all 24 background PNGs.
    Verified with a Playwright screenshot zoomed on the Aegean: Turkey renders as a complete,
    correctly-shaped, distinctly-colored region in German/Allied/Italy (its full extent fits);
    Soviet's own bbox (which never included the Eastern Mediterranean) clips Turkey's southern
    coast to a small sliver at the frame edge — expected and harmless, since Turkey has no Soviet-
    campaign narrative content.

    **Vichy demarcation line.** A simplified ~18-point 1940-42 line (Spanish frontier near Hendaye,
    north past Bordeaux — the occupied zone reached the Atlantic coast for the U-boat ports — to
    its furthest-north bulge near Tours/Vierzon, back southeast to the Swiss border near Geneva),
    rendered as a dashed stroke over France whenever `statuses.france === "axisAllied"`. Correctly
    appears for 1940-41 and disappears for 1942 onward without any special-casing, because that's
    exactly when the real Vichy south stopped being nominally separate (Case Anton, November 1942)
    and `MAP_YEAR_STATUS[1942].france` was already `"axis"` rather than `"axisAllied"` — the
    baseline data already encoded the right history. Verified live via a scripted playthrough:
    the line is absent at the capped-1939 view, present once the map reads through 1940.

    **Landmark pins** for four strategic points too small to be their own `MAP_REGION`: Gibraltar,
    Malta, Crete, the Dodecanese. Real coordinates, projected through the same Mercator math as
    the region polygons, shown only when a campaign's own bbox actually covers them (never on the
    Soviet map). Verified with a zoomed screenshot showing all four correctly placed relative to
    the actual coastline.

    **Region name labels.** `tools/build_region_geometry.py` now also computes each region's
    `representative_point()` (guaranteed inside the polygon, unlike a centroid, which can land in
    open water for a concave or multi-part shape — Yugoslavia's crescent, Norway's coastline) and
    `regions.json`'s schema changed from a bare ring list per region to `{rings, label}`. Labels
    render at a size tied to the existing `MAP_REGION_SIZE` tier so small countries (Switzerland,
    the Baltics) get smaller text than the USSR or Germany, reducing clutter automatically.

    **City labels** for orientation: a curated 12 (London, Paris, Berlin, Rome, Vienna, Budapest,
    Warsaw, Moscow, Leningrad, Stalingrad, Cairo, Ankara) — capitals plus the two named battles
    this game's own text leans on most — drawn smaller/lighter/italic than region labels so they
    read as background context, not competing markers.

    **Click-to-inspect tooltips**, reusing `mapOverrides()`'s `notes` array, which
    `currentRegionStatuses()` had always discarded. Mirrors `EuropeMap`'s existing
    `selectedRegion`/`notesForRegion` pattern exactly: a region with an active divergence note gets
    a dashed border, `role="button"`, keyboard support, and a bordered panel below the map showing
    the note text on tap — non-diverged regions stay inert. Required removing the SVG's blanket
    `pointer-events-none` (previously the whole overlay was decorative) and pushing `pointerEvents:
    "none"` down onto every other layer individually (labels, the Vichy line, city/landmark
    markers) so only diverged-region paths actually catch clicks. Verified live: clicked a
    dashed-border Switzerland (from the pre-existing Fall Tannenbaum divergence) and confirmed the
    exact note text rendered in the panel.

    **Current-node region highlight**, via `NODE_HIGHLIGHT_REGIONS[campaign.id][nodeId]` — already
    populated data that `EuropeMap` used but `CheckpointMap` never received. Threaded `nodeId` down
    from `BriefingScreen`'s existing prop into `CheckpointMap`, which renders a bright halo ring in
    the campaign's own accent color over the current node's own theater. Verified: opening the map
    at OKW's opening "Weserübung" node highlights Norway specifically.

    **Real split-fill for "divided" status**, replacing the flat `#8a7a5a` stand-in used for
    Germany/Austria at the end of 1945. Added the map's own `<linearGradient>` `<defs>` (west
    Allied-blue / east Soviet-red, matching `TheaterGraph`'s existing convention) under a
    deliberately different id (`checkpointDivideGradient`, not `divideGradient`) — both maps can be
    on screen at once (the briefing's "Show Continental Situation" panel and this modal), so
    reusing the schematic map's own gradient id would have been a duplicate-SVG-id bug, even though
    it would likely have rendered correctly by accident (same stop colors). Verified against real
    Germany geometry in an isolated SVG test: the west/east split lands correctly on the main body,
    and — an unplanned but correct result — the disconnected East Prussia exclave also gets pulled
    mostly into the Soviet half, since a single gradient spans a path's whole combined bounding box.

    **Flash on regions that changed since the map was last opened.** Persisted `lastSeenMapStatuses`
    at the top-level game-state component (not inside `BriefingScreen`, which remounts on every new
    node in the normal cycle — a component-local state there would reset "last seen" every single
    decision and flash the whole map every time). `CheckpointMap` computes the diff against the
    previous close's snapshot and calls a new `onStatusesChange` callback on close to record the
    current one; changed regions get a bright three-pulse SVG `<animate>` that fades to nothing
    rather than a lasting decoration. Verified via a full scripted playthrough tracking every map
    open: 0 flashed regions on repeat opens within the same capped year, 13 flashed on the
    1939→1940 rollover, 7 on 1940→1941 — matching how many regions actually change color at each
    of those year boundaries, with no false positives on an unchanged state.

    **Verification**: `npm run audit` clean throughout (re-run after every sub-item, not just at
    the end); full production build (`npm run build`) and `build:dev` both clean; a ~40-map
    Playwright smoke pass across all 4 campaigns (open the map, click any diverged region, close,
    advance, repeat) with zero page errors. No git commit has been made for this round yet.

35. **Checkpoint Map, round 5 — three visual defects Craig spotted by eye.** Craig: "when the
    colours overlap it changes colour. It shouldn't. Also the original borders shouldn't be visible
    as the game progresses. the Germany border would move and no need to show the original. Also
    the colouring in off Russia needs refinement." All three traced back to the map-art pipeline
    (`tools/build_region_geometry.py`, `tools/generate_placeholder_maps.py`), not `src/App.jsx`
    itself — no game code changed this round, only the generated `assets/maps/regions.json` and the
    24 background PNGs.

    **Root cause of the color-overlap bug**: `regions.json`'s polygons genuinely overlapped on the
    ground. The three hand-authored WWII-era regions (Poland/Germany/Czechoslovakia — round 3, see
    item 33's history) use interwar borders that don't match the *modern* country shapes every other
    region dissolves from (`REGION_COUNTRIES`), so their areas legitimately double-claim territory:
    Poland's 1938 Kresy overlapped the modern-Ukraine/Belarus/Lithuania slice of `ussr`/`baltics` by
    13.7 sq. degrees, Germany's 1937 Silesia overlapped `czechia`/`austria`/`france`/`benelux`, and
    even the three hand-authored regions overlapped each other by up to 2.5 sq. degrees where their
    independently-drawn borders didn't land on the same vertices. Two separate `<path>` elements
    each with `fillOpacity={0.42}` covering the same pixels compose into a third, wrong color at the
    overlap — exactly the visible artifact Craig flagged (confirmed by screenshotting before/after:
    a distinct pale patch inside 1943 Poland, gone after the fix). Fixed at the data layer, not by
    hacking the rendering: `build_region_geometry.py` now treats the hand-authored regions as
    authoritative and subtracts their geometry out of every mechanical (modern-country) region that
    overlaps them, plus resolves the small mutual overlap between the three hand-authored regions
    against a fixed priority order (`germany` > `poland` > `czechia`). Re-measured every pairwise
    region overlap before and after: the worst case dropped from 13.7 sq. degrees to 0.09 (a
    sub-pixel simplification artifact at this map's scale, not a visible defect) across all 300
    region pairs.

    **Root cause of the "original borders" complaint**: the base-map PNGs
    (`generate_placeholder_maps.py`) called Basemap's `drawcountries()`, baking today's political
    borders permanently into the art underneath the dynamic color overlay. Two problems, both
    exactly what Craig described: those borders never move as the game's own front lines do (a
    region shown one solid "Axis" color still had the real Germany/Poland line drawn through the
    middle of it, because that line was static art, not game state), and for the three hand-authored
    regions specifically, the modern line drawn here didn't even correspond to the WWII-era shape
    `CheckpointMapRegions` colors on top of it — a visible seam runs down the middle of Czechoslovakia
    the moment `czechia`'s single dissolved color region overlays the drawn line between modern
    Czechia and Slovakia. Fix: removed the `drawcountries()` call entirely (coastlines stay) and
    regenerated all 24 per-campaign per-year PNGs. The dynamic SVG overlay already draws its own
    per-region border on top, correctly, for whatever year/status is showing — the static layer
    never needed to draw one of its own.

    **Root cause of the Russia coloring defect**: `ussr`'s dissolved geometry (Russia ∪ Ukraine ∪
    Belarus ∪ Moldova) was silently truncated at 65°N — the real Arctic coast reaches past 78°N —
    leaving a large gap north of that line where nothing rendered and the plain aged-paper base
    color showed through, breaking up what should have been one uniform status color into what
    looked like two different regions. Traced to the raw source data: `world-atlas`'s Russia
    feature crosses the antimeridian (lon ±180) and is self-intersecting as plain GeoJSON; the
    previous pipeline's blanket `buffer(0)` repair resolves that kind of self-intersection with an
    even-odd fill rule that (verified directly against the raw feature) discards real area near the
    fold rather than fixing the topology — precisely the missing Arctic coast. Fixed with a targeted
    per-part repair: any invalid part of a MultiPolygon gets its longitude sequence unwrapped
    (removing the raw ±180 jump so the ring reads as one continuous line, rather than folding back
    on itself) before re-validating, with `buffer(0)` staying as the fallback for anything still
    invalid after that. `ussr`'s rendered extent now correctly reaches 80.9°N. Separately clipped
    `ussr`'s geometry to a generous box (lon -25..80, lat 30..85) after the repair — no campaign bbox
    ever shows anything east of 62°E, so the real Siberian/Pacific two-thirds of Russia (thousands of
    coastline vertices, and the part of the antimeridian fold furthest from any bbox) was pure dead
    weight in the shipped file.

    **Verification**: diagnostic script computing every pairwise region-polygon overlap by area,
    run before and after (13.7 sq. degrees worst-case down to 0.09); direct inspection of the raw
    and repaired Russia geometry (confirmed the pre-fix mainland ring capped at lat 64.98, the
    post-fix one reaching 80.92, matching real Arctic Russia); Playwright screenshots of the
    Checkpoint Map across German, Soviet, and Allied campaigns, zoomed in, before and after —
    confirmed the pale overlap patch in Poland is gone, Yugoslavia's interior no longer shows the
    old Serbia/Croatia/Bosnia border seam, and the USSR blob is now one continuous color all the way
    to the frame edge in the Soviet campaign's own bbox. `npm run audit` and a full production build
    (`npm run build`) both clean; no `src/App.jsx` changes were needed for any of the three fixes.
    No git commit has been made for this round yet.

36. **Checkpoint Map, round 6 — colored water and gaps between shapes.** Craig, looking at the
    map again after round 5: "do a tidy up on the bodies of water that are coloured or the random
    title gaps between the shapes. Maybe a rule that based on the colour. The sea blue needs to be
    uncovered and the rest covered." Two related but distinct symptoms, both from the same root
    cause: `regions.json`'s polygons (traced from `world-atlas`, a completely different dataset
    than the coastline `generate_placeholder_maps.py` actually draws with Basemap/GSHHS) were
    never going to align pixel-for-pixel with the background art's own coastline, and every
    region is simplified independently of its neighbors with no shared topology, so two countries
    that meet exactly in the source data end up with two slightly different simplified lines along
    their common border. Depending on which way a given stretch of coastline or border drifted,
    that mismatch shows up as either a region's color bleeding out over drawn sea, or a thin gap
    of bare, uncolored land between two regions that should be touching.

    Took Craig's proposed rule literally rather than trying to out-simplify two independent
    coastline datasets into agreement: **a per-campaign land/sea mask, keyed to the background
    art's own pixels.** `generate_placeholder_maps.py` renders one plain black-sea/white-land
    mask image per campaign (`assets/maps/<id>/mask.png` — one per campaign, not per year, since
    the geography doesn't change year to year), from the exact same Basemap call used for the
    real background art, just filled black/white instead of the aged color palette. `Checkpoint
    MapRegions` (`src/App.jsx`) now defines an SVG `<mask>` from that image and applies it to the
    color-fill layer: an SVG mask reads luminance, so white (land) passes the fill through and
    black (sea, and lakes — rendered black same as sea) blocks it completely, regardless of how a
    region's own polygon happens to fall. That's the "sea blue uncovered" half of Craig's rule,
    and it's a hard guarantee now, not a best-effort alignment.

    For "the rest covered," `build_region_geometry.py`'s `polygon_rings()` now grows each region's
    simplified shape back out with a small buffer (`0.035` degrees, applied *after* simplifying —
    doing it before would just get eaten back by the simplification tolerance) — closing the
    random gaps between neighbors. This only became safe to do because of a second change made at
    the same time: `CheckpointMapRegions` used to give every region's fill its own
    `fillOpacity={0.42}`, which is exactly what let two overlapping semi-transparent fills blend
    into a third, wrong color (the bug round 5 fixed with careful geometry subtraction). Fills are
    now rendered at full opacity inside one shared `<g opacity={0.42}>` — so a sliver of overlap
    the buffer creates between two neighbors just shows whichever one draws on top, never a blend
    — and the buffer's own overshoot past the real coastline into open water is caught by the new
    land mask, so growing regions to close land-side gaps carries no risk of coloring the sea.
    Borders/click-handling were split into their own unmasked pass at their own independent
    opacity, so a region's outline stays a crisp, continuous line at full contrast even where the
    fill above it fades out right at the coast, and diverged-region hit-testing (click/keyboard)
    is unaffected by the fill layer being masked.

    **Verified quantitatively, not just by eye**: wrote a standalone script that rasterizes the
    full region-fill layer the same way the SVG would, compares it pixel-for-pixel against each
    campaign's new land mask, and reports what fraction of land pixels near an actual region
    (i.e. excluding large tracts of Sahara/Arabia that were never modeled as any `MAP_REGION` at
    all — Comando Supremo's bbox reaches that far south for its East Africa content, but this
    project doesn't model those countries as colorable regions, before or after this round) are
    still left uncovered: 1.8-2.8% across the four campaigns, down from double digits before the
    buffer, and what remains is coastal-edge slivers (a jagged fjord or island coastline the mask
    traces differently than even a buffered region polygon) rather than a border seam between two
    named regions. Confirmed the sea side is now a hard zero by construction (masked, not merely
    reduced) rather than re-measuring an approximate percentage. Also re-ran the round-5 pairwise
    overlap check: the buffer intentionally reintroduces small overlaps at nearly every land
    border (up to ~1.2 sq. degrees at Norway/Sweden, versus 13.7 for the round-5 historical-vs-
    modern mismatch this replaced) — expected and harmless now that fills composite as one opaque
    group rather than per-path transparency. Playwright screenshots across German, Soviet, and
    Italian campaigns, zoomed on the Baltic, the Gulf of Finland, and the central Mediterranean —
    all show a clean coastline with no colored sea and no visible border seams at normal viewing
    scale. `npm run audit` and a full production build both clean; confirmed `mask.png` ships in
    all three build zips (`itch`, `demo-itch`, `UNLISTED-browser-full`). No git commit has been
    made for this round yet.

37. **Checkpoint Map, round 7 — Bulgaria and Albania added, plus an accuracy review.** Craig:
    "I think we need to add Bulgaria and Albania to the map for completeness and can you do
    another pas to improve the accuracy of the maps recommend any improvements."

    **Bulgaria and Albania added as full `MAP_REGIONS`**, following the exact pattern Turkey's
    round-4 addition set: a mechanical dissolve of the modern country outline from the same
    `world-atlas` dataset (`REGION_COUNTRIES["bulgaria"] = ["Bulgaria"]`,
    `["albania"] = ["Albania"]` in `tools/build_region_geometry.py`), not a hand trace — both
    countries' modern borders match their WWII-era ones closely enough (unlike Poland/Germany/
    Czechoslovakia) that this carries no historical-accuracy risk of its own. Regenerating
    `assets/maps/regions.json` took the region count from 25 to 27; the round-5/6 overlap-
    subtraction and gap-closing-buffer logic applied to both automatically, with no code changes
    needed there. Checked all four `CAMPAIGN_MAP_BBOX` / `generate_placeholder_maps.py` bboxes
    against both countries' lon/lat extents — all four already cover both comfortably, so unlike
    Turkey (which needed the Allied bbox widened), no bbox or base-map regeneration was needed.

    Added both to every place a `MAP_REGION` needs to exist: `MAP_REGIONS` (schematic x/y — placed
    Albania between Yugoslavia and Greece, Bulgaria between Romania, Yugoslavia, Greece, and
    Turkey), `MAP_GRAPH_EDGES` (bulgaria–romania, bulgaria–yugoslavia, bulgaria–greece,
    bulgaria–turkey, albania–yugoslavia, albania–greece), `MAP_REGION_SIZE` (both "small"), the
    "SOUTHERN EUROPE" `THEATERS` group, and all seven `MAP_YEAR_STATUS` year tables. Statuses
    follow the historical record: Albania was already an Italian possession before this game's
    timeline starts (annexed April 1939), so it's `axisAllied` from 1939, follows Yugoslavia/
    Greece into `contested` for 1942-43 as the domestic partisan war escalates, then `allied` for
    1944-45 — Albania's communist partisans completed their own liberation in November 1944,
    before most of the rest of the Balkans, without a Soviet occupation, so `allied` (not
    `soviet`) is the least-wrong color, the same call already made for Yugoslavia's own 1945 row.
    Bulgaria stayed neutral through 1940, joined the Axis in March 1941 (`axisAllied` 1941-43,
    tracking Romania/Hungary), then switched sides in September 1944 as Soviet troops crossed the
    border — `soviet` for 1944-45, the same trajectory already modeled for Romania's own 1944
    flip.

    Three existing `NODE_HIGHLIGHT_REGIONS` entries got audited for the new regions, using the
    same rule this project has followed since the round-4 "close the gaps" pass: only assign a
    highlight when the node's own text actually references it, never as a guess. Re-read every
    node whose body mentions "Bulgaria" or "Albania" by name (a grep found no additional hits —
    no node discusses either country under an indirect name like "Sofia" or "Tirana" without also
    saying the country outright), plus the neighboring Balkans nodes that don't name either
    country (German `balkans`, Italian `germanRescue41` and `yugoslaviaBalkans41`) to confirm they
    genuinely don't reference them and should stay as they were. Changed: Italian
    `greeceDecision40` and `greeceWinter40` (the Italian invasion of Greece was launched from,
    and the winter counteroffensive pushed back into, Albania — both node bodies discuss this
    explicitly) now highlight `["albania", "greece"]`; Soviet `balkans44` (the node's own advisor
    quotes and choice text discuss Bulgaria switching sides alongside Yugoslavia) now highlights
    `["bulgaria", "yugoslavia", "romania"]`.

    **Verified**: a pairwise overlap-by-area check shows Bulgaria/Albania's overlap with their new
    neighbors (0.12-0.46 sq. degrees) falls in the same range as existing neighbor pairs post the
    round-6 buffer (e.g. Hungary/Czechia 0.36, USSR/Romania 0.56) — nothing anomalous from the two
    additions. Playwright screenshots of the geographic Checkpoint Map across all three affected
    campaigns confirm both new regions render cleanly at normal viewing scale even in the now
    more-crowded Balkans corner: labels for Albania, Bulgaria, Yugoslavia, Greece, Romania, and
    Turkey all stay legible with no overlap; colors match the year tables above (spot-checked by
    sampling rendered pixel color under each label — Bulgaria matches Romania/Hungary's
    axisAllied color and Albania matches Yugoslavia's contested color at the sampled year, exactly
    as the tables specify); the existing "changed since last seen" blue-ring indicator correctly
    picks up Albania and Greece the moment an Italian run's Balkans choices flip their status,
    with no special-casing needed. `npm run audit` and both the production and dev builds are
    clean, with no change to the pre-existing 4/48, 2/36, 2/31, 4/14 "never produced" title
    warnings. No git commit has been made for this round yet.

    **Recommendations from the accuracy pass** (not implemented — Craig said "recommend," these
    are options, not a to-do list): (1) Malta is currently a landmark dot, not a colorable region,
    despite the game having its own dedicated `med42`/`maltaPath` flags and outcome text about
    whether it falls to an Axis invasion — if that narrative weight ever grows, it's a reasonable
    28th region, though it's small enough on a 27-region board that a disc/label there would
    crowd the central Mediterranean further. (2) The map's whole eastern edge stops at Turkey/
    Egypt; several campaigns' text (the Suez threat, the Persian Corridor supply route,
    Rashid Ali's 1941 coup in Iraq) references territory east of what's drawn, and none of that
    is currently a colorable region or even a landmark — extending east to add Iraq/Iran/Syria/
    Palestine would be a genuinely bigger project (new bbox reach on at least the Soviet and
    Italian campaigns, new mechanical regions, new year-status research) rather than a quick
    addition like this round's two. (3) Of the three hand-authored WWII-era borders (Poland/
    Germany/Czechoslovakia), none of this round's work touched or needed to touch them — Bulgaria
    and Albania's modern and 1940s borders are close enough that a fourth hand-authored region
    isn't warranted, but if Craig ever wants a fuller historical-borders pass, Hungary (which
    held Transylvania and parts of Slovakia/Vojvodina 1938-44) and Yugoslavia's Adriatic coast
    (Italy annexed a Dalmatian strip 1941-43) are the next two most narratively-relevant
    candidates. (4) No changes recommended to the round-5/6 mask-and-buffer pipeline itself — it
    absorbed two new regions with zero code changes, which is exactly what it was built to do.

38. **Checkpoint Map, round 8 — Malta, a real border-topology fix, and the double-line/coastal-
    outline stroke removed.** Craig, with two screenshots zoomed on the Poland/Germany/Czechia/
    Austria/Hungary/Yugoslavia corner: "Let's do the Malta and then a better pass at the Poland/
    German/Czech/Hubgary and Yugoslavia borders. Also we don't need the little black outline just
    around the countries especially the sea. Any double border black lines should be clamped
    together into one and there should be little beige gaps between the bigger counties unless a
    country border."

    **Malta added as a full `MAP_REGION`** (round 7's own recommendation) rather than staying a
    `MAP_LANDMARKS` pin. First obstacle: Malta doesn't exist at all in `world-atlas`'s 110m
    dataset this pipeline had used since round 1 — it's below that resolution's size cutoff, along
    with Andorra/Monaco/Vatican/Liechtenstein. Switched `tools/geo_pipeline/convert.mjs` and
    `build_region_geometry.py`'s `REGION_COUNTRIES` to the 50m dataset instead (verified: all 41
    country names already in use resolve unchanged at 50m — a resolution upgrade, not a
    remapping). Second obstacle: the sliver-filter in what's now `extract_rings()` dropped any
    polygon piece under 0.05 sq degrees as noise — Malta's entire area is ~0.03, so it was coming
    out with zero rings (invisible). Fixed by always keeping the largest piece regardless of its
    own size, applying the sliver threshold only to smaller additional pieces. Wired into every
    place a region needs to exist — `MAP_REGIONS`, `MAP_REGION_SIZE` ("small"), the MEDITERRANEAN
    `THEATERS` group, all seven `MAP_YEAR_STATUS` tables (`allied` throughout — Malta was a British
    possession the entire war) — and removed the old `MAP_LANDMARKS` pin so the same island doesn't
    get both a dot and a region polygon. Added `malta` to the four `NODE_HIGHLIGHT_REGIONS` entries
    that are substantively about it (German `herkules42`; Italian `medStrategy40`,
    `convoyWarMalta41`, `herculesExecution41` — each re-read in full to confirm), and taught
    `mapOverrides()` to actually flip `o.malta` to `"axis"` when `flags.med42 === "malta"` or
    `flags.maltaPath` is set — those flags already existed and already changed the note text
    ("Malta is in Axis hands"), but had nothing to color before this round.

    Third obstacle, and the one worth flagging clearly: even with correct geometry and correct
    status logic, Malta was **still invisible** on the actual rendered map. The reason has nothing
    to do with `regions.json` — `CheckpointMapRegions`' color overlay is masked to each campaign's
    own `mask.png` (a land/sea raster rendered separately by `tools/generate_placeholder_maps.py`
    via `mpl_toolkits.basemap`, at `resolution="l"`), and Basemap's "l" resolution silently drops
    any island under its own ~1,000 sq km default `area_thresh` — Malta (~316 sq km) never painted
    a single mask pixel, so the color fill had nothing to show through no matter what the region
    data said. Fixed by bumping both `render_geography()` and `render_land_mask()` to
    `resolution="i"` (~100 sq km threshold, confirmed installed in this environment's
    `basemap-data` package) and regenerating all four campaigns' base art and masks (`python3
    tools/generate_placeholder_maps.py`, ~38s total, no other visible change to the existing
    coastlines). Malta now paints a couple of real pixels — but at this map's scale (one 800×600
    image spanning the entire German-campaign bbox, ~65 degrees of longitude) a couple of pixels
    at 0.42 fill-opacity reads as nothing next to the "Malta" label. Added one more small piece to
    `CheckpointMapRegions`: any `MAP_REGION_SIZE: "small"` region (currently just Malta) also gets
    a small always-visible status-colored dot at its label point, offset above the label text so
    the two don't collide — the same idea as the existing `MAP_CITIES` dot-plus-label, just colored
    by ownership status instead of fixed ink. Without it, Malta would have been "correctly," and
    invisibly, blue.

    **The border-cluster "better pass" — and a real bug found underneath the request.** The actual
    fix here is not what round 8 originally set out to build. The plan going in was: replace the
    round 6 approach (every region simplified and buffered independently, closing gaps but drawing
    every shared border twice) with `topojson.Topology()`'s shared-topology simplification, so a
    border shared by two regions is one arc, simplified once, referenced by both sides — done in
    `build_region_geometry.py`'s new `simplify_with_shared_topology()`, and a new `border_lines()`
    that walks every touching region pair's `boundary.intersection()` (through `shapely.ops.
    linemerge()`, since shapely hands back a shared border as dozens of disjoint 2-point segments
    rather than one line) to produce a single deduplicated `__interiorBorders__` line list —
    rendered once in `CheckpointMapRegions` instead of every region stroking its own outline. That
    part worked exactly as designed and is most of why there's no more double-line/coastal-outline
    problem (next paragraph). But after shipping it, the Poland/Germany/Czechia corner in Craig's
    own screenshots **still showed the beige gap** — shared topology only shares an arc when the
    input coordinates already coincide exactly, which is true for two mechanical regions carved
    from the same `world-atlas` polygon, but not for a hand-authored region's boundary against a
    mechanical neighbor's `.difference()`-derived one, or against another hand-authored region's
    independently-typed coordinates.

    Measured it directly rather than guessing: took the union of every region's precise
    (pre-simplification) geometry and read off every fully-enclosed interior hole. Found 20, of
    which 4 are real (correctly unmapped at 50m: Andorra, San Marino, Liechtenstein, Vatican — each
    within 0.05 degrees of its known real location) and 16 are genuine bugs. The largest, at 0.31
    sq degrees, sits exactly at the Germany/Poland/Czechoslovakia tripoint near Cieszyn/Teschen
    Silesia — Craig's own flagged corner — because all three hand-authored polygons' approach
    vertices there were typed independently and never actually met. Three more (0.17, 0.09, 0.03 sq
    degrees) sit along Germany's hand-typed Dutch/Belgian border, which was never meant to differ
    from modern Germany but was hand-typed anyway and doesn't exactly match Benelux's real
    `world-atlas` vertices. The rest are smaller mismatches at Germany/Austria, Austria/Hungary/
    Czechia (also inside Craig's flagged region), a Poland/Kaliningrad seam, and a couple of purely
    mechanical Alpine tripoints (Switzerland/Austria/Italy, Basel) where even two country polygons
    from the *same* dataset turn out not to be perfectly topologically clean with each other.

    Rather than hand-retype coordinates (the same manual-approximation process that created the
    mismatches in the first place, with the same risk of creating new ones), added
    `close_interior_gaps()`: it finds each hole the way above, excludes anything within 0.5 degrees
    of a known unmapped microstate, and unions every real hole into whichever `final_geoms` region
    sits closest to it. Since a hole's own boundary is made entirely of arcs already belonging to
    its real neighbors, this closes it exactly, by construction — no new hand-picked coordinates,
    same principle `border_lines()` already relies on. Runs once, automatically, as part of `python3
    tools/build_region_geometry.py`; closed all 16 real gaps, correctly left the 4 microstate voids
    alone. Re-checking after the fix: zero remaining holes in the whole map except those same 4.

    **The double-line and coastal-outline removal** Craig also asked for ("we don't need the little
    black outline just around the countries especially the sea," "double border black lines should
    be clamped together into one") is the direct product of the `__interiorBorders__` rewrite above:
    `CheckpointMapRegions` now draws that single deduplicated line list once, unmasked, for the
    ordinary case, and only falls back to stroking a region's own outline for the rarer
    diverged/selected-region highlight (which needs its own dashed emphasis regardless). A region's
    coastal edge was never in `__interiorBorders__` to begin with — nothing else claims that
    boundary — so the base map's own coastline ink is the only line drawn there now, exactly as
    asked.

    **Verified**: `close_interior_gaps` reports "closed 16 border-seam void(s), left 4 unmodeled-
    microstate void(s) alone" on every run; a follow-up hole scan finds zero remaining non-
    microstate gaps anywhere in the map. `python3 tools/build_region_geometry.py` now writes 28
    regions / 8,336 region points / 54 border lines (558 points) / 123,460 bytes. `npm run audit`
    (all four checks) and both the production and dev builds are clean, with the same pre-existing
    3/48, 2/36, 2/31, 4/14 "never produced" title warnings as every prior round — nothing new.
    Playwright screenshots of the rendered game confirm: the Poland/Germany/Czechia tripoint from
    Craig's screenshots is now a clean single line with no beige gap; Malta shows as a small tan
    fleck of land (the base-art fix) with a legible blue status dot beside its label; the diverged-
    region dashed highlight and click/keyboard interaction still work correctly under the two-pass
    border rendering; a spot check of Italy/allied/soviet base art after the `resolution="i"`
    regeneration shows no visible regression elsewhere on the coastlines. No git commit has been
    made for this round yet.

39. **Checkpoint Map, round 9 — a real Baltic coastline gap closed, `close_interior_gaps()`
    generalized to catch coast-touching voids, and two suspected bugs ruled out.** Craig asked for
    the round 8 screenshots to review, then, after I flagged a possible Poland/Lithuania overlap
    and a color "bleed" notch near Warsaw/Germany: "Let's do a pass make it as pixel perfect as
    possible."

    **New methodology, stricter than round 8's.** Rather than eyeballing screenshots or checking
    the claimed union's own topology, wrote a rasterization audit (`/tmp/pixel_audit/
    rasterize_check.py`): render `regions.json`'s lon/lat polygons into each campaign's actual
    800×600 pixel space using the exact same Mercator projection `src/App.jsx` renders with, then
    diff directly against that campaign's real `mask.png` land/sea raster and cluster any
    uncovered land pixels into connected components with `scipy.ndimage.label`. This operates on
    the same coordinate space and data the app itself paints from, so it can't miss what a
    screenshot or a topology check would.

    **The two flagged issues, checked first.** The suspected Poland/Lithuania overlap turned out
    to be real and intentional — Poland's hand-authored 1938 eastern frontier legitimately reaches
    into the historical Kresy (modern western Belarus/Lithuania border country), which is exactly
    where it should sit for this period; not a bug. The Warsaw-area "bleed," however, led to the
    real find below, further west along the same coastal stretch as round 8's tripoint fix rather
    than at a country corner.

    **The real bug: a genuine Baltic coastline gap.** The rasterization audit found up to ~300
    contiguous mask-land pixels around Rügen (~13°E) and Farther Pomerania (~17.4°E) that were real
    land on every campaign's own mask but claimed by no region at all — the literal beige gap
    between countries Craig flagged, just further along the coast. `GERMANY_1937`'s hand-typed
    Baltic coast is a ~10-point straight-line simplification of a considerably more jagged real
    coastline (Rügen's inlet, the Szczecin/Stettin lagoon, Farther Pomerania's own bays), and the
    existing `COASTAL_GROW` buffer (0.02 degrees) is nowhere near enough to close a gap this wide.
    Fixed without hand-typing new coordinates: added `GERMANY_1937_COAST_PATCH_BOX`, unioning the
    hand-authored Germany polygon with modern Germany's *and* modern Poland's own true coastlines
    (Poland's, because this stretch's Farther Pomerania detail belongs to modern Poland even though
    it's inside 1937 Germany), clipped to a box hugging just this stretch. Tuned the box's east edge
    empirically — 17.9°E left a small new notch of its own where the box's straight clip line cut
    across the real jagged coast; tested 18.0/18.05/18.1/18.15°E against `POLAND_1938` for overlap
    and against the audit for the notch, settling on **18.05°E** (zero Poland overlap, notch fully
    closed).

    **`close_interior_gaps()` rewritten to catch coast-touching gaps, not just enclosed holes.**
    Round 8's version found gaps as interior rings of the claimed union's own footprint — which
    structurally can't see a gap that also touches the true coastline, since that reads as a dent
    in the union's *exterior* boundary rather than a hole inside it. Rewrote it to instead diff an
    independently-built "true land" superset (every mechanical region, plus Germany/Poland/Czechia/
    Slovakia's own raw country polygons, plus every hand-authored region's own raw drawn shape,
    intersected with a Europe bounding box) against the claimed union — this catches both shapes
    uniformly. Building it turned up a second real gap: a small residual void in the Moravia-
    Silesia stretch of the Polish/Czech border, where `CZECHOSLOVAKIA_1938`'s own hand-typed line
    cuts the corner on a real jog neither it nor modern Germany/Poland's polygons reach, but modern
    Czechia's own polygon does (confirmed by direct point-containment testing at (18.2°E, 49.75°N)).
    Fixed by adding Czechia and Slovakia to the new method's true-land sources. (One early plot of
    this area, `geom_tatra.png`, appeared to show a much larger gap — a false alarm from my own
    mistake of omitting Germany from that particular plot, not a real second gap; a corrected replot
    confirmed the actual gap was just the Moravia-Silesia sliver above.)

    **Other leads chased and correctly ruled out**, not fixed: the East Prussia/Warsaw "dark seam"
    that started this round is real sea (a bay near Klaipeda/the Curonian Lagoon, outside every
    `REGION_COUNTRIES` entry there) with an `__interiorBorders__` stroke passing nearby, not a
    geometry bug; a general overlap audit found 43-46 pairs of regions overlapping by up to ~0.83
    sq degrees, all expected and harmless given round 6's shared-opacity-group rendering (each
    region draws at full opacity into one shared buffer before the whole buffer gets one uniform
    fill-opacity, so overlaps never blend into a wrong color); a handful of single-digit-to-tens-of-
    pixel gaps in remote peripheral areas (Norwegian fjords, the Finnish archipelago, Aegean
    islands) were left alone as not worth chasing given zero visual significance at normal map zoom
    and no relation to anything Craig flagged.

    **Verified**: `close_interior_gaps` reports "closed 15 border-seam void(s), left 0 unmodeled-
    microstate void(s) alone (4 sub-floor sliver(s) ignored)" — the count of excluded microstate
    voids drops to 0 from round 8's 4 not because the microstates are now claimed, but because this
    round's independently-built true-land source never included Andorra/San Marino/Liechtenstein/
    Vatican's own country shapes in the first place, so they no longer register as gaps to exclude;
    a rasterization audit re-run after the fix shows only the legitimately-sea East Prussia notch
    and the same handful of sub-pixel-significant peripheral gaps as before. `python3 tools/
    build_region_geometry.py` now writes 28 regions / 8,398 region points / 57 border lines (563
    points) / 124,392 bytes. `npm run audit`, both the production and dev builds, and `npm run
    check-reachability` are all clean, with the same pre-existing 3/48, 2/36, 2/31, 4/14 "never
    produced" title warnings as every prior round. Playwright screenshots across all four campaigns
    (German close-up on the fixed Baltic/Moravia-Silesia cluster; full Checkpoint Map renders for
    Soviet, Allied, and Italy) confirm clean borders and coastlines with no new visible regressions.
    No git commit has been made for this round yet.

40. **Checkpoint Map, round 10 — Italy's map re-centered, and a real Caucasus/Central Asia gap
    closed (after a false start splitting out Ukraine, corrected and reverted).** Craig: "The
    Italian map looks centred a little low as although their nodes are more southern. There war
    outcome is driven a lot by what happens in Europe so that may need to be a little more
    visible. Ukraine isn't coloured in. Any final accuracy tweaks welcomed based on risky areas."

    **Italy's bbox, fixed directly.** The old box (`llcrnrlat: -3` to `47`) put Italy's own
    northern border right at the frame's top edge and gave the lower ~80% of the frame to empty
    Sahara — exactly what Craig flagged. Shifted `CAMPAIGN_MAP_BBOX.italy` (and the matching box
    in `tools/generate_placeholder_maps.py`, which must stay in sync — it controls the actual base
    art the color overlay renders against) to `llcrnrlat: 10` / `urcrnrlat: 54`, longitude
    unchanged. Verified via Playwright: Italy now sits in the upper-middle of the frame with
    Central Europe (Germany, Poland, Czechia, Austria) visible above it and North Africa still
    visible below — the war's actual European center of gravity is now in view, as asked.

    **The Ukraine false start.** Read "Ukraine isn't coloured in" as a request — by analogy to
    round 4's Turkey, round 7's Bulgaria/Albania, round 8's Malta — to split Ukraine out of the
    merged "ussr" region into its own bordered, labeled, independently-colored region. Built this
    out in full: a new `REGION_COUNTRIES["ukraine"]` split from `"ussr"`, a `MAP_REGIONS` entry,
    a `MAP_GRAPH_EDGES` adjacency change, historically-researched per-year status for all 7 years
    (axis 1941-42 after Kiev/Kharkov/Odessa fell, contested 1943 as liberation began, soviet
    otherwise), 4 `mapOverrides()` conditions extended, and 11 `NODE_HIGHLIGHT_REGIONS`
    reassignments — regenerated `regions.json`, rebuilt, ran the full audit suite clean, and
    confirmed visually via Playwright that it worked exactly as designed. **Craig corrected this
    mid-review, from a phone screenshot:** "Ukraine doesn't need its own border. I made a mistake.
    It is the bit below the red line that isn't coloured in. I don't think this area changes
    hands and therefore could even be hardcoded. Although I assume it is all USSR." The real
    report was a large uncolored void south/east of Stalingrad — the Caucasus and Central Asia —
    not Ukraine at all, which had in fact already been correctly (if invisibly) painted as part of
    "ussr" the whole time. Reverted the entire Ukraine-split change set back to a single merged
    "ussr" region, restoring every one of the touched locations to its pre-round-10 form.

    **The real fix.** Georgia, Armenia, Azerbaijan, Kazakhstan, Turkmenistan, and Uzbekistan were
    never in `REGION_COUNTRIES` at all — unlike the small, deliberately-excluded microstates
    (Andorra/San Marino/Liechtenstein/Vatican) `close_interior_gaps()` correctly leaves alone, this
    was a large omission the rasterization audit had already independently flagged (tens of
    thousands of uncovered land pixels on the Soviet campaign map) just before Craig's screenshot
    arrived, confirming it was the same real issue. Folded all six into `REGION_COUNTRIES["ussr"]`
    rather than giving them their own region, per Craig's "doesn't need its own border" — this
    land was Soviet-controlled for the entire war (the deepest German thrust, 1942's Caucasus
    offensive, reached Mozdok in Russia's own North Caucasus and never crossed into Georgia,
    Armenia, Azerbaijan, or Central Asia), so Craig's "I don't think this area changes hands" reads
    as correct, and it costs nothing beyond a smaller imprecision than the gap it replaces: these
    six republics now read "contested" gold instead of solid "soviet" red for 1941-43 (the war
    itself never touched them), a real but minor inaccuracy against the blank void it replaces, and
    no new code path. (Not pursued further this round: Craig's own "could even be hardcoded"
    alternative, a bespoke fixed-color mechanism for this area, would read more precisely for
    those three years but adds a new code path for a difference that's hard to see on the actual
    map — worth raising if he wants the extra precision later.)

    **Verified**: `build_region_geometry.py`'s dict re-read to confirm the revert-plus-fix was
    syntactically clean (no leftover separate `"ukraine"` entry). `python3 tools/
    build_region_geometry.py` writes 28 regions (back down from the Ukraine-split's 29) / 8,567
    region points / 56 border lines (572 points) / 126,872 bytes, closing 15 border-seam voids as
    before. A rasterization audit re-run shows the Soviet campaign's uncovered-land share drop
    from a large Caucasus-shaped gap to 0.406% (1,579px, mostly small unrelated peripheral slivers
    already present before this round) — the fix confirmed at the pixel level. `npm run audit`
    (all four checks), `npm run check-reachability`, and both production/dev builds are clean, with
    the same pre-existing 3/48, 2/36, 2/31, 4/14 "never produced" title warnings as every prior
    round. Playwright confirms visually: Ukraine is seamlessly back inside one "USSR" blob with no
    separate border or label, and the area south/east of Stalingrad — reproducing the same framing
    as Craig's own screenshot — is now solid contested-gold, matching the rest of "ussr," with no
    blank beige gap.

41. **Seven main-menu/onboarding fixes, plus a real music-autoplay bug and retiring the old
    schematic map in favor of the Checkpoint Map.** Craig sent all seven in one batch:

    1. **Main menu tagline.** "The main menu says 1939 to 1945. Can this be changed to 1940 and
       also remove '- or debated -'." Changed the subtitle from "...made — or debated — between
       1939 and 1945" to "...made starting in 1940."
    2. **Italy's card description cut off with an ellipsis.** Shortened Italy's `brief` text so
       its first complete sentence (80 characters) fits inside `truncateBrief()`'s 90-character
       budget with no trailing "…", matching how the other three campaigns already render.
    3. **Historical Divergence Mode unlocked from the first run.** "Can the make the historically
       accurate unlock available from the beginning." Removed the `campaignsPlayed`-gated unlock
       in `WarRoomScreen` entirely — the "Historically Accurate Opponent" checkbox is now always
       enabled and ticked by default; there is no more "Locked until you've completed one
       historically-accurate run" state.
    4. **References section removed from the main menu.** "Can you remove the references this is
       too much extra detail." Deleted the collapsible References block (and its now-dangling
       "available under References on the main menu" pointer text in all four campaigns' Easy
       Command War Room docs).
    5. **Credits.** Added "Music — Hyteck9" to the Credits panel, alongside the existing
       design/writing/development placeholder line.
    6. **Music didn't play during the game.** Root cause: `musicOn` defaulted to `false` (the
       same "silent until asked" pattern used for the typewriter sound effects), and even when a
       player did turn it on, the mount-time `play()` call is routinely rejected by the browser's
       autoplay policy until a real user gesture has landed on the page — with nothing to retry
       it afterward. Fixed both halves: `musicOn` now defaults to `true`, and a new listener
       (`pointerdown`/`keydown`/`touchstart`, once) retries `play()` on the very first gesture
       anywhere on the page if it was blocked, so music starts on the player's first click rather
       than staying silent for the rest of the session.
    7. **Checkpoint Map "wasn't visible," and it should replace the old node map.** Craig: "The
       idea is this replaces the nodes contential situation that is there at the moment. Please
       don't remove the nodes map from the build yet just don't make it visible once replaced by
       the more geographically accurate map." Two separate things here:
       - The explicit, actionable part — done. The briefing screen's "Show Continental Situation"
         `<details>` panel (the schematic node-graph `EuropeMap`) is switched off behind a new
         `SHOW_LEGACY_SCHEMATIC_MAP = false` constant, per Craig's "don't remove... just don't
         make it visible." `EuropeMap` itself, `MAP_REGIONS`, `MAP_GRAPH_EDGES`, and every other
         supporting piece are untouched and still used by the separate post-campaign "Continental
         Situation — the Europe this war made" summary, which Craig didn't ask to change.
       - The "map wasn't visible" report itself: Playwright confirms the Checkpoint Map modal,
         its base map art, and the region-coloring overlay all render correctly at both desktop
         and mobile viewport widths when the game is served over HTTP — this rules out a
         rendering defect in `CheckpointMap`/`CheckpointMapRegions`. The likely explanation is
         environmental: a prior delivery this round sent the loose built `index.html` +
         `bundle.js` alone for mobile testing (flagged at the time as missing `assets/maps/`,
         `output.css`, and `theme.mp3` — all of which the page needs to look and work right), and
         if those loose files were what got tested, the map image (and the page's styling and
         music) would never have loaded. No code change was made for this half beyond what's
         already described above — deliveries from here on are the full self-contained build so
         this doesn't recur.

    **Verified.** Rebuilt (`npm run build`) and ran the full `npm run audit` (all five checks) —
    clean, same pre-existing "never produced" title warnings as every prior round, no new ones.
    Playwright confirms all seven items end to end: the tagline text and absence of "or debated";
    Italy's brief rendering complete with no ellipsis; the Historically Accurate Opponent checkbox
    present, enabled, and checked by default on first entry to the War Room, with no "Locked
    until" text anywhere; no "References" section on the main menu; "Music — Hyteck9" in Credits;
    the music `<audio>` element starting paused (blocked by the browser, as expected) and moving
    to playing after one generic click anywhere on the page, not just the Music toggle itself; and
    the briefing screen showing no "Show Continental Situation" panel while the Map button still
    opens a fully-rendered Checkpoint Map. No git commit has been made for this round yet.

## Italy campaign review

A full-aspect review of the Italy/Comando Supremo campaign, done alongside the reachability
triage above, when the campaign stood at 32 nodes and 11 ending titles. **Note:** item 20 above
(10 new nodes, 32 → 42) landed after this review; the counts below are as of the review itself
and are called out where item 20 changed them, rather than silently rewritten.

- **Reachability: the worst ratio of any campaign** — 3 of Italy's 11 ending titles (27%) are
  permanently dead, all confirmed via the same-bar investigation used on the other 6 gaps (see
  item 3 below). The other three campaigns sit at 2-4%. Worth weighing when deciding how much
  fix effort to spend on Italy specifically versus the other three. *Post-item-20: Italy now has
  12 titles (a genuine new one from the `backMussolini` fork), same 3 still dead — 25%, and the
  3 dead titles are unchanged by item 20's work; still worth a decision per item 3 below.*
- **Claims verification: complete for HIGH/MED, and for LOW where it matters.** All 22 HIGH/MED
  Italy claims are source-verified (2 real errors caught and fixed this project — see the Italy
  claims verification section above). 26 LOW-tier claims remain genuinely unreviewed — all
  flavor/dialogue text (advisor quotes, thematic framing), the same kind of content the other
  three campaigns' ~442-row LOW-tier backlog was always scoped out of reviewing exhaustively.
  This isn't a gap specific to Italy; it's the same accepted policy applied consistently.
  *Post-item-20: 4 more HIGH/MED-relevant claims from the new content verified the same pass —
  see item 20 above; 176 filled verdicts total.*
- **No write-only flags, no dead choice gates** — `npm run audit`'s hard checks (which do cover
  Italy) pass clean; these would fail the build if either existed. Still true post-item-20.
- **No TODO/FIXME/placeholder markers** anywhere in the Italy campaign's ~1,500 lines of source.
- **Advisor dossiers: all 14 covered**, no anachronistic quotes (`check-advisor-dates.js` passes;
  the 7 quotes it flags as dossier-less are all German-campaign anonymous voices, none Italian).
  Still 14 post-item-20 — every advisor the new content uses was already dossiered.
- **UI integration**: War Room document, all 32 `NODE_HIGHLIGHT_REGIONS` map mappings, Discovery
  Atlas / Command Dossiers listings, and objectives are all wired — verified at ship time with
  two full Playwright playthroughs (RSI and co-belligerent branches) and again in the later
  four-campaign smoke pass, both with zero runtime errors. *Post-item-20: 42 map mappings now
  (the 10 new nodes are all mapped); re-verified live via Playwright, see item 20.*
- **Node count**: matches `NODE_TOTAL` (a hard-fail check, currently passing). 42 post-item-20.

Net read: Italy is solid on correctness, completeness, and integration — the one real problem
is the reachability gap, which is disproportionately Italy's relative to the other three
campaigns and worth prioritizing if V7 work continues on this campaign specifically.

## Suggested next steps for V7

1. ~~Sample-verify or misclassification-rescan the remaining unreviewed LOW-tier claims~~ —
   **done for Italy** (see item 17 above); the pre-existing german/soviet/allied/shared LOW-tier
   backlog (~442 rows) remains untouched and was always out of scope for one pass.
2. ~~No browser/Playwright pass has covered every screen of all four campaigns~~ — **done**, see
   item 18 above (with the scope caveat noted there: one path per campaign, not exhaustive).
3. **Triaged, fix not yet applied — awaiting a decision on approach.** All 7 warning-level
   reachability gaps were investigated and confirmed as genuine dead titles, not statistical
   rarity: for each, a script tried every combination of available choices (taking the best case
   on every probabilistic roll) to reach `END` without ever setting a flag `positionLabel` checks
   ahead of the target title, and none could. Two are the same first-match-wins shadowing pattern
   already fixed 16 times on the punch list: German's "Collapse ahead of schedule" and "The war
   that never went east" are both permanently shadowed because their branch's only exits
   (`easternCollapse1943`, `atomicReckoning45`) unconditionally set a higher-priority flag first.
   Soviet's "Victory, Priced About the Same" and Allied's "The War, Fought Close to Schedule" are
   the same pattern at campaign scope: Soviet's literal final choice (`berlinAssault45`) has no
   branch that doesn't set an already-checked flag, and Allied's mandatory `darlanDeal42` node has
   only two choices, both explicitly named in `positionLabel`. Italy has the worst ratio of any
   campaign — 3 of its 11 titles (27%, vs. 2-4% for the other three) are dead: "Twenty Months at
   Salò" is shadowed the same way (the RSI branch is a linear chain whose only ending,
   `rsiCollapse45`, always sets `rsiEnd` to one of two already-checked values), "Two Italies, One
   File" is shadowed because the campaign's only 4 `END` points all occur after the armistice fork
   commits `italyPath` (item 20's new content adds a 5th `END` point, `civilConflictEnd43`, but it
   sits upstream of the armistice fork entirely and doesn't touch this shadowing bug either way),
   and "The Command That Lost the Least" (`manpower >= 6`) is a different bug
   entirely — a miscalibrated threshold, not shadowing: a script that greedily takes the
   best-case manpower choice at every single node, including optimistic uncertain-roll outcomes,
   only ever reaches +4 by the end of the campaign, so +6 is arithmetically out of reach given the
   campaign's actual impact values. All 3 Italy titles have ENDINGS_GALLERY entries, so the
   gallery currently advertises 3 unlockable-looking endings players can never actually earn.
   Two viable fix approaches, matching two things this codebase has already done for the same bug
   class: re-prioritize/relax the shadowing conditions so the title becomes reachable (what the
   original punch list did for most of its 16), or delete the dead title and its gallery entry as
   intentionally-abandoned scaffolding (what happened to "The Fortress Left to Starve" and "The
   War History Already Wrote" when the same investigation was run on Soviet previously). Italy's
   threshold bug has a third option: lower the `>= 6` gate to something the campaign can actually
   reach (`>= 4`, per the greedy ceiling) rather than deleting the title outright. Which approach
   fits each of the 7 is a judgment call worth making with Craig before touching code.
4. The four written specs (`docs/specs/*.md` — Grand Campaign mode, advisor-debate nodes, a
   generated verdict epilogue, opponent adaptation) remain unimplemented; Craig's four
   implement-now picks (counterfactual branches, Italy, multi-stage endings, hidden-information
   choices) were a separate, already-completed track. Grand Campaign mode is worth revisiting
   first if this project continues — the spec calls it the highest-leverage remaining item.
5. ~~Hidden-information choices are formalized but only applied to one choice per campaign~~ —
   **extended**, see item 19 above (10 of 62 `uncertain[]` choices now tagged, up from 4). The
   remaining ~52 were read and deliberately left as ordinary contested-outcome drama; a future
   pass could revisit that judgment call, but it isn't a rescan-for-gaps job like item 1 was —
   it's closer to a design read on individual node prose, best done by playing the game rather
   than grepping it.
