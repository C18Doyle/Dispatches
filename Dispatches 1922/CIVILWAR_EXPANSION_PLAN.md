# Dispatches: Civil War — Content Expansion Plan

Working document. Survives across sessions. Update the STATUS column as batches land.

---

## Baseline at plan creation

| | southRussia | siberia | bolsheviks | total |
|---|---|---|---|---|
| Nodes | 26 | 18 | 21 | **65** |
| Avg choices/node after batch 1+ | 2.00 | 2.11 | 2.24 | — |
| Endings after batch 1 | 5 | 6 | 6 | **17** |
| Endings | 5 | 6 | 5 | **16** |
| Dossiers | 8 | 7 | 9 | **24** |
| Avg choices/node | 2.00 | 2.00 | 2.14 | — |
| Historical spine length | 10 | 8 | 7 | — |

Validation state at baseline: `tsc` clean · 0 dangling targets · all roll weights sum 100 ·
117 flag comparisons / 0 mismatches · **0 write-only flags** · every named advisor has a dossier.

---

## The two structural problems this plan exists to fix

### 1. Fork depth — MEASURED, AND NOT A PROBLEM

An earlier pass in this project claimed 15 shallow forks. **That claim was wrong and is
retracted here so no future session acts on it.**

The bad metric asked "how many steps until the branches share a node," which fires on
every main-line-plus-detour structure — i.e. on the correct structure. The right metric is
**how many nodes are exclusive to each branch**, reachable from it and from no sibling.

Measured result: **40 branching nodes, 0 with no exclusive content on any branch.**

Distribution of total exclusive nodes per fork:

| exclusive nodes | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 14 |
|---|---|---|---|---|---|---|---|---|---|
| forks | 14 | 12 | 7 | 1 | 1 | 2 | 1 | 1 | 1 |

Note `[1, 0]` in the per-branch output does **not** mean a shallow fork — the `0` branch is
the main line, the `1` branch is a detour with its own node. That is the intended shape.

**Do not "fix" fork depth.** If a future session wants deeper forks, the argument has to be
that specific 1-exclusive-node forks deserve a second chapter on their own merits — not
that the graph is structurally shallow, because it isn't.

### 2. Every decision is binary

Not one three-way choice in 64 nodes. Many of these moments historically had a third
course that was actually argued for at the time, and its absence flattens the decision
into a false dilemma. Third options should only be added where a **documented** third
course existed — not invented for symmetry.

---

## Batch plan

Each batch is bounded, independently shippable, and ends with the full validation sweep.

### ADVISOR VOICE & TIMING AUDIT (STATUS: DONE)

Full review of all 140 advisor quotes across the three campaigns, two passes:

**Pass 1 — timing/presence.** Built each advisor's "active window" from their own
dossier's fate text, then checked every quote's node date against it. Found and fixed
FIVE real violations:

- **Wrangel speaking at 3 nodes** (`novorossiysk20`, `voroshilovsCavalry20`,
  `moleRearguardFate20`, all March 1920) — during the exact window
  `wrangelsDismissal20` (built earlier this session) establishes he was in actual exile
  in Constantinople. Replaced with **Kutepov**, who is independently documented as the
  officer who actually ran the Novorossiysk evacuation commission — not a generic
  substitution, the historically correct one. Rewritten in Kutepov's own harder, more
  clipped register rather than just relabeling Wrangel's lines.
- **Gajda speaking at `railPriority19`** (November 1919) — he was dismissed in July 1919
  and by November was actively organizing an armed revolt against this very government
  in Vladivostok. Replaced with **Sakharov**, independently documented as actually
  commanding through the Omsk retreat at this exact date.
- **Kappel speaking at `eichesPursuit20`** (January 1920) — the node's own situation text
  already says "Voitsekhovsky has to decide," a direct internal contradiction with a
  Kappel quote on the same choice. Per his dossier, Kappel was incapacitated by frostbite
  by this point. Replaced with an anonymous "Column Staff Officer" who explicitly
  references carrying Kappel's argument forward because Kappel no longer can — turning
  the fix into foreshadowing for the explicit "Kappel is dead" line the player reaches
  one node later, rather than just erasing the reference.

Checked and cleared as genuinely fine: Voitsekhovsky's pre-1920 appearances (he's
presented as a corps-level candidate being considered for promotion, not falsely shown
in supreme command early), Trotsky's Tsaritsyn quote (doesn't imply personal presence —
consistent with his real armored-train command style), and no post-abdication Kolchak or
post-resignation Denikin quotes were found anywhere.

**Pass 2 — voice distinctiveness.** Pulled every major character's full quote set
together for the first time and found two systemic cross-character tics — the same
multi-clause rhetorical construction being reused as a generic "measured decisiveness"
template regardless of who was speaking:

- `"I am aware of X. I am also aware of Y"` — 9 instances across **6 different
  characters** (Denikin, Kolchak, Wrangel, Trotsky, Frunze). Rewritten into each
  character's own register: Denikin plainer and more morally weary, Kolchak colder and
  more clinical, Wrangel blunter and more contemptuous of hedging, Trotsky more
  rhetorically combative, Frunze more plainly professional.
- `"I understand X. I am less certain Y"` — 6 instances, spanning **both** southRussia
  and bolsheviks (Alekseev, Wrangel, Kutepov, Kolchak, an anonymous staff officer,
  Lenin). Same treatment.

15 quotes rewritten for voice, on top of the 5 fixed for timing — 20 total edits.

**Personality pass, as invited.** Budyonny and Semyonov's single quotes each read
generically determined rather than using their well-documented real personalities —
Budyonny's proud ex-NCO cavalryman swagger, Semyonov's genuine warlord menace dressed as
pragmatism. Both rewritten with sharper, more specific voice.

Standard sweep: 66 nodes, 0 dangling, 126 flag comparisons / 0 mismatches, 0 advisors
without dossiers, spines unchanged at 12/8/7.

### NEW NODE — wrangelsDismissal20 (STATUS: DONE)

Verified via multiple independent sources: Denikin actually dismissed Wrangel (along with
Lukomsky and Shatilov) in early February 1920, over a report Wrangel wrote and circulated
blaming Denikin's own strategy for the Moscow campaign's collapse. Wrangel sailed for
Constantinople on 8 February — genuinely exiled, not just sidelined — then was recalled
after Novorossiysk forced Denikin's own resignation weeks later. The existing
`sevastopolCouncil20` node already referenced this fact in passing ("dismissed... is back
in the peninsula") but never let the player make the actual call. New node makes it a real
decision: dismiss him (historical) or bring the criticism into the planning room instead
(speculative). `sevastopolCouncil20`'s own context is now conditional on which path was
taken, rather than stating the dismissal as an unconditional fact.

**A real, serious bug shipped and caught in the same pass, worth reporting in full rather
than glossing over:** my first attempt inserted the node in the wrong place in the graph —
downstream of `novorossiysk20` rather than upstream of it — creating a direct two-node
cycle (`novorossiysk20 → wrangelsDismissal20 → novorossiysk20`). `walk-historical.js`
caught it immediately: southRussia's spine length jumped from 11 to 200, the script's own
infinite-loop safety cap. Tracing the walk step by step found the exact cycle. The fix
required understanding WHY it was backwards (the new node's own text says "Novorossiysk
has not happened yet" — correctly, since Wrangel's real dismissal predates the evacuation
by weeks — but it had been wired to trigger only after the evacuation, contradicting its
own content) and properly rerouting the real convergence point into `novorossiysk20`
(only 2 distinct source nodes, despite 18 individual choice lines) rather than patching the
wrong location again.

**That fix then caused a second bug from a blanket find-and-replace** run across the whole
file: it correctly rerouted the 18 external references, but also swept up the new node's
own two internal `next` fields, turning them into a direct self-loop. Caught immediately by
re-running the same walk trace rather than assuming the first fix was sufficient — this is
the value of verifying with the actual walker after every structural change, not just
`tsc`, which stayed clean through both broken states.

Final verified state: historical spine walks cleanly through
`cossackDesertion19 → wrangelsDismissal20 → novorossiysk20 → sevastopolCouncil20 → ... →
finalReckoning20` in 12 steps, terminating at a real ending. Standard sweep: 66 nodes,
0 dangling targets, 126 flag comparisons / 0 mismatches, 0 advisors without dossiers,
spines correct at 12/8/7.

### RESTRUCTURE — Newspaper Archive removed from menu, folded into bulletins (STATUS: DONE)

Per direct feedback: the browse-anytime Newspaper Archive screen and its War Record menu
row are GONE. Deleted the component function, the App-level route, and all three
campaigns' NEWSPAPER_ARCHIVE data arrays (61 lines removed cleanly, verified with
bracket-matched deletion, not eyeballed). NEWSPAPER_MASTHEAD/NEWSPAPER_SUBHEAD kept —
BulletinScreen still needs them for the masthead display.

To not lose the content that only lived in the archive, 6 new bulletin trigger nodes were
added (one per campaign's opening node, one per campaign's early-middle node) using
material adapted from the deleted archive entries, now cross-referenced against the other
two campaigns the way the original 9 bulletins already were:

| Node | Campaign | Date | Covers |
|---|---|---|---|
| kornilovsDeath18 | southRussia | Apr 1918 | Brest-Litovsk, campaign's own opening node |
| moscowDirective19 | southRussia | Jul 1919 | 14-month catch-up: Armistice + Comintern |
| omskCoup18 | siberia | Nov 1918 | Czechoslovak Legion origin, campaign's own opening node |
| springOffensive19 | siberia | Mar 1919 | Comintern founding, same city same month |
| revvoensovietFormed18 | bolsheviks | Sep 1918 | Brest-Litovsk retrospective + fresh intervention landings, campaign's own opening node |
| militaryOppositionCongress19 | bolsheviks | Mar 1919 | Comintern founding, literally the same congress season |

Bulletin count now 15 total, 5 per campaign, spanning each campaign's full arc rather than
clustering mid-to-late. Headlines were also cleaned up in this pass — the original 9 had
a redundant "MONTH YEAR — " prefix baked into the headline text even though the masthead
already shows the node's own date separately; stripped programmatically from all 15.

Visual redesign of BulletinScreen applied at the same time, matching the approved
prototype: double-rule masthead border, dateline strip (date + "SINGLE SHEET"), Playfair
Display for masthead/headline, PT Serif for body, Courier Prime for the dateline/meanwhile
label — all three fonts added to the shared FontImports @import alongside the game's
existing font set.

**Verified, not assumed:** 15/15 trigger nodes resolve with a bulletin; 0 meanwhile-key
mismatches (checked programmatically against the actual other-two-campaigns set per node,
not eyeballed); `newspaper` menu row and route confirmed absent; the 3 remaining string
matches for "newspaper" in the file are ordinary prose ("Soviet newspapers had been
claiming...") not leftover feature code. Standard sweep: 65 nodes unchanged, 124 flag
comparisons / 0 mismatches, 0 advisors without dossiers, spines unchanged at 11/8/7.

### NEW FEATURE — Glossary (STATUS: DONE)

Fifth War Record section. 16 terms, single alphabetical list shared across all three
campaigns (a confused player usually doesn't know which campaign's vocabulary a term
belongs to). Covers only terms actually used elsewhere in the file — AFSR, Cheka,
Comintern, Directory, Kombedy, NEP, Politburo, Prikaz, Rada, Revvoensoviet, Sivash,
Sovnarkom, Stavka, Voenspetsy, White/Red — nothing added for completeness's own sake.

**A real bug caught immediately, worth flagging plainly:** the very first edit of this
session — inserting the GLOSSARY constant above CITIES — repeated the exact
str_replace-swallows-the-anchor-line mistake from earlier in this project (the
\`rearSecurity19\` case-label incident). \`const CITIES = {\` was deleted by my own
replacement. Caught it by grepping for the declaration immediately after, before running
tsc even once. Fixed and then verified behaviorally (not just tsc) that both GLOSSARY and
CITIES were intact and correctly sized.

### NEW FEATURE — Newspaper Archive EXTENDED to 1920–21 (STATUS: DONE)

Archive now runs through each campaign's actual endpoint rather than stopping at October
1919: southRussia 8 entries through November 1920 (Kolchak's execution, Wrangel's
succession, the Polish war, the Crimean evacuation), siberia 7 entries through October
1920 (the Far Eastern Republic's founding and its capital moving to Chita — precisely the
same city the campaign's own remnant is converging on), bolsheviks 8 entries through March
1921 (Kolchak's execution, Wrangel's fall, NEP). All chronological, verified — Far Eastern
Republic formation date (6 April 1920, Verkhneudinsk) and capital relocation to Chita
(October 1920) confirmed via multiple independent sources before writing.

### NEW FEATURE — The Bulletin System (STATUS: DONE)

The bigger ask: not a browse-anytime archive but a forced interstitial appearing between
a choice's outcome and the next War Room, at specific narratively major nodes, cross-
referencing what the OTHER TWO campaigns were doing at that exact real date. Nine trigger
nodes, three per campaign, chosen for genuine calendar proximity to major events in the
other two theaters — not evenly spaced for symmetry, but wherever the real history
actually overlapped:

| Node | Campaign | Date | Cross-references |
|---|---|---|---|
| orelCulmination19 | southRussia | Oct 1919 | Kolchak's Tobol collapse; Yudenich at Petrograd's gates |
| sevastopolCouncil20 | southRussia | Apr 1920 | Kolchak's execution (2 months prior); Piłsudski's Kiev offensive opening |
| crimeaDefensePrep20 | southRussia | Oct 1920 | FER capital moving to Chita; Polish armistice freeing Frunze's reserves |
| chelyabinskGrinder19 | siberia | Jul 1919 | Denikin's Moscow Directive, issued the same week |
| irkutskUltimatum20 | siberia | Feb 1920 | Denikin's collapse and Novorossiysk bearing down |
| chitaFall20 | siberia | Oct 1920 | Wrangel quietly prepping the Crimean evacuation, same month |
| cavalryArmyDebate19 | bolsheviks | Nov 1919 | Orel just retaken; Omsk being evacuated the same month |
| perekopAssault20 | bolsheviks | Nov 1920 | Literally the same battle as crimeaDefensePrep20, told from the other side |
| kronstadt21 | bolsheviks | Mar 1921 | Both other wars already over — Wrangel in Constantinople, Manchuria crossed |

Implementation: \`node.bulletin = { headline, body, meanwhile: { campaignId: text, ... } }\`
on the node object itself — no separate lookup table, no date-matching logic, avoiding a
whole class of bug this project has hit before (comparing against a value nobody actually
set). New \`screen === "bulletin"\` state inserted between outcome and briefing in
\`handleContinueFromOutcome\`; \`BulletinScreen\` reads the CURRENT node's own \`.bulletin\`
field and renders "MEANWHILE" for whichever two campaigns are NOT the one being played,
looked up programmatically (\`Object.values(CAMPAIGNS).filter(oc => oc.id !== c.id)\`) rather
than hardcoded per node — so it can't silently show the wrong pairing.

**Verified behaviorally, not just via tsc:** simulated the exact routing logic for a
bulletin node, a non-bulletin node, and an ending node — all three route correctly. Checked
all 9 bulletins' \`meanwhile\` keys programmatically against the actual other-two-campaigns
set for that node's campaign — 9/9 exact matches, no wrong pairings, no typos in campaign
ids.

Standard sweep confirms zero mechanical impact beyond the new screen: 65 nodes unchanged,
124 flag comparisons / 0 mismatches, 0 advisors without dossiers, spines unchanged at
11/8/7.

### NEW FEATURE — The Newspaper Archive (STATUS: DONE)

Direct response to feedback that the Civil War is hard to follow from inside a single
command. Added a fourth War Record section, same pattern as Discovery Atlas / Endings
Gallery / Command Dossiers: `NEWSPAPER_MASTHEAD`, `NEWSPAPER_SUBHEAD`, and a
`NEWSPAPER_ARCHIVE` array (4 entries, chronological) per campaign, rendered as period
front pages rather than the terse BACKGROUND blocks already used for tactical context.

Deliberately covers what the BACKGROUND fields don't: not this campaign's own decisions,
but the wider war around them — why the Bolshevik government existed to fight at all
(Brest-Litovsk), why foreign troops stayed in Russia after WWI ended (the Nov 1918
Armistice, and each campaign explains the "why still here" question from its own side),
why 50,000 armed foreigners are central to the Siberian campaign specifically (the
Czechoslovak Legion's origin), why Allied support for the Whites hardened in 1919 (the
Comintern's founding), and the fact each of the three campaigns is running in parallel
with the other two, who barely know what the others are doing.

Mastheads verified real before use: **Velikaya Rossiya** (published Novorossiysk,
confirmed via an academic citation and an SSEES archive listing) and **Sibirskaya Rech**
(Omsk, confirmed via a Library of Congress newspaper microfilm catalog entry). Izvestia
needed no verification.

Zero impact on game state — pure reference content, no flags, no routing. Standard sweep
confirms nothing else changed: 65 nodes, 124 flag comparisons / 0 mismatches, 0 advisors
without dossiers, spines unchanged at 11/8/7.

### NEW NODE — wrangelsEnvoy20 (STATUS: DONE)

Not a third option — a genuinely new node, found while researching a third option that
didn't pan out. `northernTauride20` (June 1920) previously jumped straight to
`crimeaDefensePrep20` (October 1920) with nothing in between. Verified via multiple
independent sources (Arshinov's own Makhnovist history, Trotsky's own account, Palij):
Wrangel actually sent Shatilov and Konovalets's letter to Makhno proposing cooperation,
sealed at Melitopol 18 June 1920; delivered by a 28-year-old messenger, Ivan Mikhailov, to
the Makhnovist staff at Vrem'evka on 9 July; Makhno's own recorded order was immediate
execution. Precisely dated, multiply sourced, dramatically real, and previously entirely
absent from the game. Built as a real decision (send it / don't) rather than a fixed
cutscene, both choices routing back into `crimeaDefensePrep20`. New `makhnoOutreach` flag
wired into that node immediately (caught by check-flag-values before it could go
write-only). New Shatilov dossier added — caught by check-advisor-coverage.js exactly as
designed, on the first real content addition since the script was written.

### BATCH 1 — Third options where history had one (STATUS: DONE, EXTENDED TWICE)

Third round of additions:

- **kubanCoup19** (southRussia) — "Go further than Pokrovsky asked." Verified via Denikin's
  own memoir (quoted directly in a secondary source): Pokrovsky asked Denikin in person for
  exactly this — coup, dissolution, arrests, shootings without trial — and Denikin
  "absolutely forbade" it, ordering arrest-and-court-martial instead. That means the
  existing "historical" choice (court-martial, hanging) was ALREADY Denikin's restrained
  position — the genuinely harsher option he vetoed was the real gap. Routed AROUND
  kubanRadaReorganized19 rather than through it, since that node's content presupposes a
  reorganized Rada casting votes — false under full dissolution. Wired the new flag value
  into novorossiysk20 instead.

Verified and rejected in this round: **chelyabinskGrinder19** — Budberg's real "hold the
Tobol-Ishim line, wait for winter" proposal is already what the existing "withdraw to a
more defensible line" choice represents. No gap.

### BATCH 1 — Third options where history had one (STATUS: DONE, EXTENDED)

Original delivery (springOffensive19, kronstadt21) plus two more this round, each
verified with a search before writing:

- **omskCoup18** (siberia, campaign's OPENING node) — "Redirect to Boldyrev." Verified:
  Kolchak really did argue the post belonged to Boldyrev when first offered it, then let
  himself be talked out of it. Boldyrev was physically still in Omsk (didn't leave for
  Japan until 10 days later). New ending **Boldyrev's Omsk** — explicitly does NOT claim
  the war goes differently, and does NOT transplant Boldyrev's real 1922 arrest / 1933
  execution onto a government he never actually served in this branch. Says so directly.
- **grainRequisition18** (bolsheviks) — "Dissolve the kombedy, fold into local Soviets."
  Verified: this is the actual December 1918 policy reform (VTsIK decree merging the
  Committees of Poor Peasants into re-elected village soviets), dated to exactly this
  node's month. A REAL BUG caught mid-edit: marked it `historical: true` at first, which
  gave the node two historical choices and collapsed the bolsheviks spine from 7 to 3
  nodes in walk-historical.js. The intensification thread is the game's established
  canonical spine (everything downstream — Kronstadt's grievance — depends on it), so this
  is `historical: false`: real event, not the thread this telling follows.

Fixed in the same pass: **endingTheVistula20** had a path-inconsistent blame narrative —
its epilogue described "the South-Western Front's refusal" regardless of path, but the
"force the transfer" branch's own aftermath said the order was issued and not executed in
time, a different failure than refusal. Split the epilogue by `polishAxis`.

Verified and rejected in this session (see the earlier REJECTED list below for the first
two): `militaryOppositionCongress19` — the existing "negotiate" choice already IS the
historical commission-brokered compromise (Stalin/Yaroslavsky's Military Commission, the
Academy-training concession). No gap.

Delivered:
- `springOffensive19` (siberia) — Sakharov's central axis on Kazan, argued at the time and
  again in his 1923 emigre account. Marked `historical: false`; the aftermath notes the
  source is not neutral about a plan its author proposed.
- `kronstadt21` (bolsheviks) — wait for the thaw. New flag value `wait_for_thaw`, routed to
  a new ending rather than falling through to the negotiate ending.
- New ending **The Island** (`endingTheIsland21`, speculative) — the fortress neither stormed
  nor negotiated with, left on the far side of open water while the NEP grants its largest
  demand anyway.
- `offensiveDirection: "centre"` wired into `ufaCounteroffensive19`.

Verified and REJECTED, so no future session re-proposes them:
- `moscowDirective19` — the "concentrate on Volga axis" alternative already in the node
  IS the historical Wrangel counter-proposal (postpone the offensive, hold the
  Ekaterinoslav–Tsaritsyn line, secure Astrakhan on the flank — Wikipedia "Advance on
  Moscow (1919)"). A third option here would just re-split a proposal already represented.
  No gap.
- Far Eastern Republic "negotiated settlement" at `chitaFall20` (siberia) — checked, and
  the top search result for this was a **fictional alt-history wiki** (kaiserreich.fandom /
  a "Amur-Baikal Opening" scenario), discarded. The real FER was Bolshevik-controlled and
  never offered the Kappelites terms; what actually followed Chita is what
  `endingDispersedAtTheBorder`/`endingManchuria` already cover. No gap — do not build this.

Both stale by this point, corrected here so nothing re-checks them:
- `omskCoup18` — already resolved. Got its third option (redirect to Boldyrev) two batches
  ago; see the wrangelsEnvoy20 section below for the full trail. Not open.
- `tsaritsynCrisis18` — checked directly: this node was never binary. It already has THREE
  choices (assert authority / conciliate / split discipline between Voroshilov and
  Stalin specifically), each historically grounded. No gap, nothing to add.
- `kronstadt21` — assault and negotiate are in. The third course actually argued in the
  Politburo was delay: wait for the thaw, which would make the fortress unassaultable but
  also cut it off from Petrograd. Verify.
- `springOffensive19` — north (Gajda/Archangel) and south (Denikin junction) are in. The
  third was Sakharov's argument for a central axis straight at Moscow via Kazan. Verify.

### BATCH 2 — Endings on axes not yet used (STATUS: DONE)

Delivered:
- **The Army That Did Not Come Back** (southRussia, speculative) — April 1918, via a 35%
  roll on the `collapseChoice: "reorganize_first"` branch at `afterEkaterinodar18`.
  Campaign's earliest ending was April 1920 before this; now April 1918. If the reorganised
  withdrawal is caught by Sorokin's garrison, the Volunteer Army does not survive to fight
  the rest of the war — no Moscow Directive, no Orel, no Crimea.
- Verified and rejected two other candidates (see below) rather than force them.

REJECTED after verification (do not re-propose):
- FER negotiated settlement at `chitaFall20` — no documented basis; top search result for
  this was fictional alt-history content, discarded.
- Third option at `moscowDirective19` — the existing "concentrate" choice already IS the
  documented Wrangel counter-proposal. No gap.
- A Shkuro-led separate Cossack army as a new node (~January 1920, between
  `cossackDesertion19` and `novorossiysk20`) — round 21 flagged this as single-sourced
  (warhistory.org's claim that Denikin "belatedly offered concessions to the Cossacks —
  the greatest being their own army under the Cossack general Andrei Shkuro") and left it
  as a lead needing a second source. Round 23 ran that second search pass: no second
  source corroborates it — not Shkuro's own Wikipedia biography, not Armed Forces of South
  Russia's. Worse, Shkuro's biography documents the opposite dynamic in the same period:
  it's Wrangel, not Denikin, who is recorded refusing Shkuro a command in 1920, prompting
  his resignation — the reverse of "Denikin grants him independence." Closed, not just
  parked — do not re-propose without a genuinely new, independent, dated source.

Existing 16 endings cluster on: military outcome, political removal, external defeat.
Not yet represented:
- **An ending that isn't an ending for the commander** — the campaign continues but this
  command is relieved and reassigned (siberia: Diterichs' actual removal, or Sakharov's).
- **A negotiated outcome** — the Far Eastern Republic buffer state (siberia, 1920) was a
  real negotiated settlement and is currently only a passing reference.
- **An early southRussia ending** — that campaign's earliest ending is April 1920.
  The Ice March's failure in 1918 is a real terminal possibility and is currently
  unreachable as an ending.

### BATCH 3 — Advisor-coverage and dossier expansion (STATUS: DONE)

Delivered:
- **check-advisor-coverage.js saved permanently**, joins the standard sweep. Documents both
  bugs it exists to catch: a speaking advisor with no dossier (Sakharov), and an advisor
  from the wrong campaign entirely (Wrangel/Kutepov on a Bolshevik node, caught last batch).
- **Sakharov dossier added** (siberia) — was speaking in springOffensive19 with no dossier,
  same bug class as the Wrangel/Kutepov perspective break.
- The rest of this batch's original candidate list (Mamontov, Shkuro, Slashchov, Yegorov,
  Uborevich, Primakov) was written from memory before checking the file. Checked now:
  Mamontov and Shkuro have ZERO mentions anywhere in the game text — never proposed for a
  reason, just listed without verifying. Yegorov/Uborevich/Primakov are single-mention
  background flavor, never speaking as advisors, no gameplay weight. Building dossiers for
  them would be padding. Not done, deliberately.

**Lesson for future batches:** candidate lists written from memory in a plan doc are not
verified facts. Check the actual file before treating a plan-doc line item as real scope.

- Fold the advisor-coverage check into a saved script (currently ad-hoc).
- Dossiers for figures referenced in prose but never given one (Mamontov, Shkuro,
  Slashchov, Yegorov, Uborevich, Primakov, Sergey Kamenev vs Lev Kamenev disambiguation).

---

## Rules for every batch

1. **Never add a field the UI doesn't render.** Check the render layer first. The
   `context`/`aftermath` fields were built this way; anything new follows the same order.
2. **Never add a flag without a reader.** `check-flag-values.js` must report 0 write-only
   before a batch is called done.
3. **Verify flag values, don't guess them.** Two shipped bugs came from writing
   `flags.x === "guessed"` against a value that was never assigned.
4. **A new node must be registered in four places:** `NODE_ATLAS`, `NODE_TOTAL`,
   `NODE_TO_CITY`, and — if it's an ending — `ENDINGS_GALLERY` *and*
   `ENDING_CLASSIFICATION`.
5. **Historical spine must still run.** `walk-historical.js` after every batch. If a new
   `historical: true` choice truncates the spine, the branch is wired backwards.
6. **Advisors must be from the right side.** A White general advising the Revvoensoviet is
   structurally valid and semantically absurd; this shipped once already.
7. **Third options only where documented.** No inventing a third course for symmetry.

## Standard sweep (run all of these, every batch)

```
tsc --noEmit --jsx react --allowJs dispatches-1917.jsx
node check-flag-values.js dispatches-1917.jsx     # 0 mismatches, 0 write-only
node check-continuity.js dispatches-1917.jsx      # review new flags
node walk-historical.js dispatches-1917.jsx       # spine still runs
```
Plus, inline: atlas/NODE_TOTAL sync, dangling-target scan including roll branches,
roll weights sum to 100, ending classification match, advisor-dossier coverage.
