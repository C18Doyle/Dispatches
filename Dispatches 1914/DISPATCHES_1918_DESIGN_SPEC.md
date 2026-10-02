# Dispatches: The Great War — Design Specification

**Status:** Draft v2 for review. Nothing built. No content written.
**Working title:** `Dispatches 1918` (see §1.2 — title decision is open)
**Proposed filename:** `dispatches-greatwar.jsx`

**Changes in v2:** committed to all six campaigns in a single release; major/minor
campaign tiering replaces wave-based release tiering; unified logistical triangle
(Manpower / Munitions / Will) replaces six bespoke meter sets; hard modes specified
with differentiated erosion triggers rather than shared mechanics under six names.

**Changes in v3:** §13 added — eight pre-build conventions settled (calendars, flag
namespacing, advisor rosters under succession, map scope, bulletin voice, contested
roll budget, node ID scheme, art direction). Menu card art claim in §1.5 corrected.

---

## 0. Purpose of this document

This is the design specification that must be settled *before* any node is written.
It exists because the dominant failure mode across 1940, 1941 and 1922 has been
**content exists but is never wired** — flags written and never read, UI built and
never triggered, titles defined and never classified. Those are downstream symptoms
of structure decided late. This document decides structure first.

Every section marked **DECISION REQUIRED** needs Craig's answer before content work
begins. Every section marked **RESEARCH GATE** needs verified sourcing before the
relevant campaign starts, not during.

---

## 1. Scope

### 1.1 The honest scope number

| Title | Campaigns | Span | Nodes | Endings | Dossiers |
|---|---|---|---|---|---|
| Dispatches 1940 | 3 | 1 year | 148 | 88 | 82 |
| Dispatches 1922 | 3 | ~3 years | 67 | 22 | 27 |
| Dispatches 1941 | 2 | in progress | — | — | — |
| **This title** | **6** | **4.3 years** | **~200** | **~55-60** | **~54** |

Larger than 1940 and 1922 combined. The major/minor split in §1.5 is the structural
answer to that number — not a way of shrinking it, but a way of making an uneven
distribution of depth *legible as design* rather than as an unfinished campaign.

### 1.2 Title

`1914` was the original ask and is rejected: 1914 is an opening year with no
resolution, and this series' endings are decision-driven consequences, not
fade-outs. A whole-war title needs a name that isn't a single year, or needs to
take its year from where the campaigns *end*.

Options:
- **Dispatches 1918** — consistent with series convention, and 1918 is where all
  six campaigns resolve. Recommended.
- **Dispatches: The Great War** — breaks the year convention.
- **Dispatches 1914** — actively misleading about scope. Rejected.

**DECISION REQUIRED.** Spec assumes `Dispatches 1918` throughout.

### 1.3 Filename

`dispatches-1917.jsx` is currently the *Civil War* game's on-disk name (never
renamed after the 1922 retitle). Do not name this title anything in the 1914-1917
range or the two files become confusable in every future session. Rename the Civil
War file to `dispatches-1922.jsx` as a prerequisite chore.

Proposed: `dispatches-greatwar.jsx`, in `dispatches/1918/`.

### 1.4 Node density — decision points, not calendar coverage

WWI's decision density is wildly uneven. 1914 (war of movement) and 1918 (Spring
Offensive through armistice) are dense. 1915-1917 are, at the operational level a
supreme commander occupies, comparatively static — the same offensive logic
repeated at different map coordinates.

**Nodes map to genuine command dilemmas, not to months.** A campaign may spend
9 nodes on 1914, 5 on 1915, 6 on 1916, 8 on 1917, 10 on 1918. That is correct and
should not be "balanced." Padding 1915-16 to hit calendar symmetry produces exactly
the shallow-branch filler the series standard forbids.

### 1.5 Major and minor campaigns

All six ship together. The menu distinguishes two tiers.

**Major campaigns — 34-38 nodes, 9-11 endings each:**
- German OHL
- French GQG
- Russian Stavka
- British Empire (BEF & War Cabinet)

**Minor campaigns — 16-20 nodes, 5-6 endings each:**
- Austro-Hungarian AOK
- Ottoman command

Totals: ~4×36 + 2×18 = **~180-190 nodes**, ~50-58 endings.

The tiering is doing real work, not just labelling. Austria-Hungary and the Ottoman
Empire have materially thinner English-language operational sourcing than the four
majors, which is where the no-invented-claims rule bites hardest. A campaign
labelled *minor* is licensed to be 18 nodes; an unlabelled campaign at 18 nodes
reads as unfinished. The label converts a research constraint into a design
statement.

**Minor campaigns are not lower quality.** Same prose standard, same validation
gates, same badge discipline, same ship criteria. Shorter, not thinner. A minor
campaign that fails a ship gate does not ship.

**Menu presentation:** majors presented first as full cards; minors below under a
distinct heading, styled as a secondary tier without looking like DLC or an
afterthought. Six equal cards is a list, not a choice — the hierarchy is what makes
the menu readable. Each card also carries its campaign's calendar convention (§13.1).

Card treatment is typographic per §13.8. An earlier draft of this section said
"theatre art," which assumed an asset pipeline no title in this series has.

---

## 2. Campaign specifications

Each campaign below gives: command seat, tier, span, the campaign's Will label, the
spine (`historical: true` path), the principal dilemmas, and the ending families.
Ending *names* are deliberately not fixed here — naming happens with the prose, and
premature naming has historically produced endings that don't match what the node
actually does.

### 2.1 German OHL — *Oberste Heeresleitung* — MAJOR

**Seat:** Chief of the General Staff. Moltke → Falkenhayn (Sept 1914) →
Hindenburg/Ludendorff (Aug 1916). The seat changing under the player is itself a
design opportunity: the player continues as the office, not the man, and inherits
predecessors' commitments.

**Will axis label:** *Home Front* — blockade pressure, food supply, political
durability. The axis that eventually decides whether the army or the country
breaks first.

**Spine (target 11-12 nodes):** Belgian invasion → Marne halt → Falkenhayn's
Western vs. Eastern priority dispute → Verdun as attrition design → Somme defensive
→ Hindenburg/Ludendorff takeover → unrestricted submarine warfare decision →
Brest-Litovsk terms → Spring Offensive → Hundred Days → armistice request.

**Principal dilemmas:**
- **Westheer vs. Ostheer.** The recurring structural choice. Falkenhayn's
  scepticism about a decisive Eastern victory versus Hindenburg/Ludendorff's
  advocacy is a documented dispute, not an invented one.
- **Unrestricted submarine warfare (Jan-Feb 1917).** The best-documented gamble of
  the war and the natural pivot for US entry (§6). The *decision* was contested;
  the *consequence* is settled and must never be a dice roll.
- **Brest-Litovsk severity.** Harsh terms bought territory and cost divisions to
  garrison it. A real trade with a real Western-Front price.
- **Spring 1918 objective selection.** Documented that operational success outran
  strategic purpose.

**Ending families:** negotiated-peace variants (speculative, badged), armistice-on-
worse-terms, army-collapse-before-home-front, home-front-collapse-before-army,
hard-mode forced ending.

**Reuse risk:** this campaign's shape resembles 1940's OKW — continental power,
early success, overreach, collapse. Mitigate by making *Home Front* do work OKW's
meters didn't: German 1918 is a *domestic* collapse story, not an operational-defeat
story, and the campaign should feel structurally different for that reason.

### 2.2 French GQG — *Grand Quartier Général* — MAJOR

**Seat:** Joffre → Nivelle (Dec 1916) → Pétain (May 1917), with Foch as Allied
generalissimo from spring 1918 changing the player's authority mid-campaign.

**Will axis label:** *Army Morale* — the mutiny axis.

**Spine (target 10-11 nodes):** Plan XVII and the Battle of the Frontiers → Marne
counterattack → race to the sea → 1915 offensives → Verdun defence → Somme
co-operation → Nivelle's promise and the Chemin des Dames → the mutinies → Pétain's
restoration of the army → 1918 defensive-then-offensive → armistice.

**Principal dilemmas:**
- **The 1917 mutinies.** The strongest single dilemma available in this title, and
  unlike anything in 1940, 1941 or 1922: the crisis is *internal legitimacy*, not
  enemy pressure. Concession versus discipline versus both, with the player's own
  army as the opposing force.
- **Verdun: hold or shorten the line.** The decision to defend was political as
  much as military.
- **Coalition subordination, 1918.** Accepting unified command under Foch was a real
  surrender of autonomy for real gain.

**Ending families:** the historical victory (which for France must be written as a
victory that does not feel like one — casualties are settled record and must not be
softened), army-does-not-recover-from-1917, earlier-negotiated-outcome
(speculative, badged), hard-mode forced ending.

**Design note:** this campaign must resist becoming a passive endurance simulator.
The mutiny arc, Verdun, and the Nivelle gamble are its three load-bearing beats and
should be the deepest-written nodes in the title.

### 2.3 Russian Stavka — MAJOR

**Seat:** Grand Duke Nikolai Nikolaevich → Nicholas II assumes personal command
(Sept 1915) → the Provisional Government's command (1917).

**Will axis label:** *Home Stability* — the revolutionary trajectory.

**Spine (target 9-10 nodes):** East Prussian invasion and Tannenberg → Galician
advance → Gorlice-Tarnów and the Great Retreat → the Tsar takes command → Brusilov
Offensive → February Revolution and the collapse of command authority → Kerensky
Offensive → October → Brest-Litovsk.

**Principal dilemmas:**
- **Speed of the 1914 East Prussian advance.** Whether to move before concentration
  was complete, under French pressure. Documented, consequential, a clean opening.
- **Nicholas II assuming command.** The player either advises for or against a
  decision that tied the dynasty's survival to military outcomes. Well-documented
  as contested at the time.
- **The 1917 summer offensive under a government that could not compel obedience.**
  Command without authority — the mirror of the French mutiny node, arrived at from
  the opposite direction.

**Ending families:** collapse-into-revolution (historical spine), separate-peace-
earlier (speculative, badged), army-holds-into-1918 (speculative, badged), hard-mode
forced ending.

**Series payoff:** the terminal nodes should hand explicitly into the situation
Dispatches 1922 opens from. Not a crossover gimmick — a shared factual endpoint,
with the ending text naming the conditions 1922's three campaigns inherit.

### 2.4 British Empire — BEF and War Cabinet — MAJOR

**Seat:** deliberately hybrid. Sir John French → Haig (Dec 1915) at the front, with
Cabinet-level decisions (Asquith → Lloyd George, Dec 1916) reaching the player.

**Will axis label:** *Political Capital* — the civil-military struggle that defines
this campaign.

**Spine (target 10-11 nodes):** BEF deployment and Mons → First Ypres → the shell
crisis → Gallipoli commitment → conscription → Somme → the Haig/Lloyd George
struggle → Passchendaele → convoy adoption → 1918 defence and the Hundred Days.

**Principal dilemmas:**
- **Westerner vs. Easterner.** Concentrate in France, or seek a decision elsewhere.
  The actual strategic argument of the British war, extensively documented on both
  sides.
- **Convoy.** Admiralty resistance is documented and the reversal was decisive. A
  rare WWI decision with a clear, verifiable, large effect.
- **Civil-military authority.** Lloyd George's attempts to constrain Haig,
  including manpower withholding, is documented and genuinely two-sided.

**Scope risk:** Gallipoli, Mesopotamia, Palestine, Salonika, the Western Front and
the naval war are not one command's story. The hybrid Cabinet/BEF seat is the
mechanism that makes multi-theatre choice authentic rather than a cheat — but it
must be established in the campaign's framing node, and the player must never be
placed in operational command of a theatre they did not historically command.

### 2.5 Austro-Hungarian AOK — *Armeeoberkommando* — MINOR

**Seat:** Conrad von Hötzendorf → dismissed by Karl I (1917) → the player continues
as the office under a new emperor with different war aims.

**Will axis label:** *Imperial Cohesion* — multi-national army reliability. The
campaign's identity: an army whose internal loyalty is itself the strategic
variable. No campaign in the series has had an axis meaning quite this.

**Spine (target 7-8 nodes):** the Serbian campaigns → Galicia and Lemberg →
Przemyśl → German-led Gorlice-Tarnów and the beginning of dependency → the Italian
front → Brusilov and near-collapse → Conrad's dismissal and Karl's peace-seeking →
Caporetto → Vittorio Veneto and dissolution.

**Principal dilemmas:**
- **Serbia versus Galicia, 1914.** The documented original sin — dividing effort
  between the punitive war and the real one.
- **Dependency on Germany.** Each acceptance of German command integration buys
  survival and costs autonomy. A cumulative, genuinely tragic trade with a clear
  terminal consequence. This is the campaign's spine and its best mechanic.
- **Karl's peace initiatives.** Documented, and a case where the counterfactual is
  not idle speculation.

**Ending families:** dissolution (historical spine), earlier-separate-peace
(speculative, badged), survival-as-German-satellite (speculative, badged), hard-mode
forced ending.

**RESEARCH GATE:** English-language operational sourcing for AOK is materially
thinner than for OHL/GQG/BEF. Do not begin content until sourcing is confirmed for
the spine specifically. If a spine node cannot be sourced, cut the node — do not
write around it.

### 2.6 Ottoman command — MINOR

**Seat:** the Ottoman war ministry and general staff.

**Will axis label:** *Imperial Control* — provincial and territorial authority.

**Spine (target 7-8 nodes):** entry into the war → Sarikamish → Gallipoli defence →
Kut → the Arab Revolt → Palestine and Mesopotamia → Megiddo → Mudros.

**Principal dilemmas:**
- **Peripheral commitment versus core defence.** The campaign's structural
  question: an empire fighting in more theatres than it can supply.
- **German integration.** Parallel to the Austrian dependency mechanic but with a
  different texture — advisors and matériel rather than command absorption.

**RESEARCH GATE and BLOCKING ISSUE — see §9.** This campaign is specified but must
not be written until §9 is resolved. Build it last regardless of ship strategy.

---

## 3. Shared engine — deltas from 1922

The 1922 engine is the base. It already supports conditional `situation`/`context`/
`bulletin`/`epilogue` construction from flags, `gate`, `nextIf`, weighted
`uncertain[]`, ±10 clamped meters, hard-mode erosion, and per-campaign document
treatments. Little needs to change.

Required additions:

1. **Six-campaign menu with major/minor tiering.** 1922's three-up layout does not
   extend. Needs redesign, not a grid change (§1.5).
2. **Command-seat succession.** Five of six campaigns change commander mid-run.
   Needs a `commanderAt(nodeId)` concept so document headers, advisor rosters and
   voice change with the seat. This is the one genuinely new engine feature, and it
   changes node shape — build it before content, not after.
3. **Per-campaign Will labelling.** The engine meter is `will`; the label rendered
   in the HUD and briefing is per-campaign (§4). Label lives in campaign config, not
   in node data.
4. **Cross-campaign hand-off (Russian → 1922).** Read-only, optional, cosmetic.
   Must degrade silently. Not a save-state system.
5. **Per-campaign document treatments** — six needed, extending the 1940/1922
   convention (OKW field-grid, STAVKA Prikaz, SHAEF memo). Applies to WarRoom,
   BriefingScreen and OutcomeScreen, per series convention.

Explicitly **not** adding: a fourth meter, a tech/production system, a map layer
beyond the existing city markers, or a save system (unless §10 changes).

**Rules carried forward without exception:** never add a field the UI doesn't
render; never add a flag without a reader; never guess a flag value.

---

## 4. The logistical triangle

**Manpower / Munitions / Will.** One triangle, all six campaigns, ±10 clamped,
0 = historical baseline.

### 4.1 Why not Fuel

Fuel is a 1940 concept imported into a war that did not run on it. WWI armies moved
on rail, horses and boots. Fuel is load-bearing only for naval oil conversion, the
Verdun motor supply route, and tanks from late 1916 — meaning the axis would sit at
or near zero across most of six campaigns. A dead axis is worse than a bad one: the
player learns to ignore it, and 1922 already shipped with axes that constrained
almost nothing (measured gate-blocks per run: 0.52 / 0.26 / 0.14).

**Munitions** replaces it. The shell crisis is a defining event in at least three of
the six campaigns and is the scarcity that actually shaped operational choice across
the whole war.

### 4.2 Why not Initiative

Three objections:

1. **It is an output, not a stock.** Manpower and munitions are spent. Initiative is
   the *result* of spending them. A consequence on the resource triangle turns the
   HUD into a scoreboard, and a scoreboard invites exactly the meter-threshold
   thinking this series has deliberately designed against (§5).
2. **It flatlines 1915-1917.** No one held initiative on the Western Front for two
   and a half years. An axis reading zero through the middle of the game is
   decorative.
3. **It is zero-sum and positional**, so it does not clamp sensibly at ±10 the way a
   stock does.

### 4.3 Why Will

Every one of the six commands loses when its will breaks before its manpower does:
Russia in 1917, the French mutinies, the German home front in 1918, Austrian
dissolution, Ottoman collapse. It is the only third axis that explains all six
campaigns' endings, which is the test a shared triangle has to pass.

### 4.4 Per-campaign labelling

Engine axis is `will` everywhere. The rendered label is per-campaign — same
mechanic, campaign-specific name and flavour, exactly as per-campaign document
treatments already work.

| Campaign | Rendered label | What it represents |
|---|---|---|
| German OHL | Home Front | blockade, food, political durability |
| French GQG | Army Morale | the mutiny axis |
| Russian Stavka | Home Stability | the revolutionary trajectory |
| British Empire | Political Capital | civil-military authority |
| Austro-Hungarian | Imperial Cohesion | multi-national reliability |
| Ottoman | Imperial Control | provincial and territorial control |

This replaces v1's six bespoke third axes. One mechanic with six labels is
maintainable and validatable; six mechanics is six times the balancing work and six
chances to ship a decorative meter.

### 4.5 Gate discipline — a numeric ship criterion

**Gate thresholds are set from measured Monte Carlo distributions after each
campaign's spine is written, never from intuition, and never before there is a
distribution to measure.** 1922 shipped a gate requiring a value literally
unreachable in simulation because the threshold was guessed.

**Target: ≥2.0 gate-blocks per run per campaign, measured.** This is an acceptance
criterion, not an aspiration. A campaign below it either gets its thresholds
re-tuned or its meters demoted to explicitly-flavour in the design doc — but not
silently.

### 4.6 Triangle placement

Per series convention, the triangle appears wherever meters are live and
meaningful. Omitted from the pre-campaign War Room screen, where meters are always
0.

---

## 5. Endings

Decision-driven, never meter-threshold — series rule, unchanged. Meters are
informational and flavour.

Majors: 9-11 endings each. Minors: 5-6 each. Total ~50-58.

Every ending carries an accuracy badge:
- **Settled record** — this is what happened.
- **Contested judgment** — historians genuinely disagree about the causation.
- **Speculative counterfactual** — did not happen; the reasoning is laid out.

Every ending must be registered in **both** `ENDINGS_GALLERY` and
`ENDING_CLASSIFICATION`, plus `NODE_ATLAS`, `NODE_TOTAL` and `NODE_TO_CITY`. Missing
any is silent — four-place registration is a checklist item on every ending, not a
thing to remember. `check-classification.js` (§11) automates the check.

**Reachability is a Monte Carlo acceptance criterion.** 1922 shipped with an ending
reachable only via a specific three-flag combination that random simulation never
found. Every non-hard-mode ending must fire in simulation before ship, or be cut.

---

## 6. Folding in the United States

The US is not a campaign — 18 months cannot carry a full-war structure. It enters as
a *consequence* in three places, which is more interesting than a thin seventh
campaign:

1. **German OHL:** the unrestricted submarine warfare node is the causal decision.
   The decision was contested; the consequence was not. Never roll for whether the
   US enters.
2. **British Empire:** the convoy decision determines whether American manpower
   arrives in time to matter.
3. **French GQG and German OHL, 1918:** the amalgamation dispute — whether American
   divisions serve under Allied command or as an independent army — is documented,
   genuinely two-sided, and makes an excellent late node in both campaigns from
   opposite sides.

---

## 7. Hard modes

Six hard modes, one per campaign, per series convention: a separate erosion track
that at maximum forces a campaign-specific ending.

### 7.1 The differentiation problem

1940 and 1922 each ship three hard modes that are mechanically identical — one
erosion track, three names, three forced endings. At three that reads as a
convention. At six it reads as a reskin: a player who runs two will notice the third
is the same thing in a different hat.

**Therefore the modes differ in what *triggers* erosion, not only in what erosion is
called.** Each mode names a real pressure the office faced, and erodes in response
to the specific class of decision that pressure punished. Same track, six different
trigger conditions.

| Campaign | Erosion triggers on | Character of the mode |
|---|---|---|
| German OHL | decisions that spend Home Front for operational gain | the war effort consuming the country that sustains it |
| French GQG | casualty-heavy offensives and post-mutiny discipline choices | political survival of the commander |
| Russian Stavka | decisions that expose the dynasty to military outcomes | court interference in command |
| British Empire | defying or circumventing Cabinet authority | the civil-military struggle turned hostile |
| Austro-Hungarian | each acceptance of German command integration | sovereignty spent to stay in the war |
| Ottoman | peripheral commitments that outrun supply | an empire fighting in more places than it can hold |

Each mode's forced ending is written from its own trigger: the German forced ending
is a home-front collapse, the Austrian is absorption, the British is dismissal. The
forced endings are not six variations of "you lose."

### 7.2 Naming — DEFERRED, and deliberately

Series convention names hard modes after a person or body whose pressure the mode
represents (Führer / NKVD / Yalta; Kalabukhov / Janin / Orgburo). That convention
works when the attribution is verifiable and fair.

Several obvious WWI candidates are contested figures where naming a *difficulty
mode* after them constitutes a historical argument rather than a label. Names are
therefore chosen with each campaign's content, against sourcing, and each one is
checked against the question: *is this attribution defensible to someone who has
read the historiography?*

No names are proposed in this document. Proposing them here would mean inventing
six attributions before any of the six campaigns has been researched.

---

## 8. Prose and historical standards

Unchanged from the series, restated because they are load-bearing:

- Written from inside the commander's perspective. **No fourth-wall meta-language**
  — no "this campaign", "this run", "the player", "this telling". Case-insensitive
  grep is the check; the 1922 first pass missed every capitalised sentence-start.
- Settled history narrated as fact. Contested rolls **only** where serious
  historians disagree.
- **No gamifying settled atrocities or mass-death outcomes.** Casualty figures are
  settled record, stated plainly, never softened and never randomised.
- No invented claims. Every historical detail verified before use.
- One `historical: true` choice per node, exactly.
- Bulletins fire on **arrival**, before the decision — never announcing the outcome
  of the choice about to be made.
- Advisors must belong to the right campaign and be alive, in post, and not yet
  dismissed on the node's date (§11).
- Blocklisted tics: "genuinely", "for once", "the question is", "a real X, not an
  invented one:", "historians of this counterfactual", "X, not Y" as a crutch,
  repeated anaphora openers across adjacent nodes.

**New standard specific to this title:** WWI prose has a strong gravitational pull
toward futility-poetry — mud, rats, a lost generation. That register is a cliché
and, worse, it removes agency, which kills the genre. Commanders in 1916 believed
they were solving a solvable problem. Write them as people solving it.

---

## 9. Ottoman campaign — blocking issue

**Must be resolved before any Ottoman content is written.**

An authentic Ottoman high-command campaign covering 1915-16 cannot route around the
Armenian genocide. It was a decision of the same command apparatus making the
operational decisions in the same months. Omitting it is a falsification;
representing it as a player choice violates the series rule against gamifying
settled atrocities.

The only design position consistent with the series' own standards:

- The genocide is **narrated as settled historical fact** in the campaign's framing
  and at the relevant point in the timeline.
- It is **never a node, never a choice, never a flag, never a meter effect**, and
  never carries an accuracy badge other than settled record.
- The campaign is explicit that the command the player occupies bears
  responsibility. The player is not given the option to have prevented it, because
  the office did not.
- Denialist framings are not represented as a "contested judgment." The record here
  is not what that badge exists for.

This is workable and has been done well elsewhere. But it is a decision to be made
deliberately, with sourcing, and it is real reputational exposure for a solo
developer on a storefront.

**Recommendation:** build last, after all five other campaigns have shipped their
ship-gates. Its minor-tier status makes this sequencing natural.

**DECISION REQUIRED.**

---

## 10. Open decisions

1. **Title** — `Dispatches 1918`? (§1.2)
2. **Ottoman: built last, or cut?** (§9)
3. **Save state.** 1922 shipped without it. Six campaigns is a much longer total
   experience and the absence is more costly here. 1940 has save-schema versioning
   with node-resolution validation on load and could be ported. Port it, or ship
   without again?
4. **Cross-campaign hand-off to 1922** — cosmetic ending text only, or a real read
   of a stored flag? (Note: if save state is ported, this becomes nearly free.)
5. **Does the Civil War file get renamed to `dispatches-1922.jsx` first?**
   Recommended as a prerequisite.
6. **Demo gating.** 1940 uses a `DEMO_BUILD` flag via esbuild `define`. Which
   campaign is the demo — and does the major/minor split make one minor campaign the
   natural free tier?

---

## 11. Validation requirements

All six 1922 validators port directly and are mandatory: `check-flag-values.js`,
`check-continuity.js`, `check-advisor-coverage.js`, `check-gates.js`,
`check-bulletins.js`, `walk-historical.js`.

Three new validators are required by this title's structure:

- **`check-commander-timing.js`** — every advisor and commander seat must be alive,
  in post, and not yet dismissed on the node's date. Five campaigns change commander
  mid-run. The 1922 audit caught Gajda speaking four months after dismissal, Kappel
  speaking after incapacitation, and Wrangel and Kutepov advising the *Bolshevik*
  command. With six campaigns and mid-run succession this failure mode is
  near-certain without automation.
- **`check-classification.js`** — every ending appears in both `ENDINGS_GALLERY` and
  `ENDING_CLASSIFICATION` with a badge. Four-place registration fails silently and
  there will be ~55 endings.
- **`check-will-labels.js`** — every campaign defines a Will label; no node
  hard-codes an axis name in prose that contradicts its campaign's label. Cheap to
  write, and the alternative is a German node talking about Army Morale.

**Per-campaign ship gate — all must pass with reported numbers, not assertions:**

1. `tsc --noEmit --jsx react --allowJs` clean. (Noted: tsc has historically passed
   through deleted declarations, swallowed case labels, calls to deleted functions,
   duplicate keys, infinite routing loops and invented fields. It proves almost
   nothing. It is a floor.)
2. All nine validators, 0 problems.
3. Monte Carlo sweep: every ending except hard-mode endings fires at least once;
   report actual run count and per-ending hit counts.
4. Dead-end / soft-lock sweep: every `next` and `nextIf` target resolves to a real
   node; no node with all choices gated. Report tested combinations and failures.
5. Gate-block rate ≥2.0 per run, measured (§4.5).
6. Hard mode reaches its forced ending from at least three distinct paths.
7. `NODE_TOTAL`, atlas and endings list regenerated from live data, not hand-edited.
8. Playwright render pass through the campaign's historical spine.
9. Case-insensitive meta-language grep, clean.

---

## 12. Recommended first block of work

Not content. In order:

1. Answer §10.
2. Rename `dispatches-1917.jsx` → `dispatches-1922.jsx`; update validator
   invocations and `CLAUDE.md`.
3. Scaffold `dispatches/1918/` with `CLAUDE.md`, `build.mjs`, ported validators, and
   the three new ones written against an empty campaign set.
4. Build the engine deltas in §3 — **commander succession first**, since it changes
   node shape and retrofitting it across ~190 nodes is the expensive version.
5. Write **German OHL only**, spine first, endings last. Run its full ship gate.
   Measure its gate distributions. Only then start French GQG.

Writing one campaign end-to-end before starting a second is the single most useful
discipline available here: it surfaces every structural problem once, at a cost of
12 nodes, instead of six times at a cost of 190.

**Build order:** German OHL → French GQG → Russian Stavka → British Empire →
Austro-Hungarian AOK → Ottoman. Majors before minors; the highest-sourcing-risk
campaign last, when the engine is fully proven and the only remaining variable is
research.

---

## 13. Pre-build conventions

These are settled. They exist because each one is cheap to decide now and expensive
to discover at node 120.

### 13.1 Calendars — authentic per campaign

Each campaign uses the calendar its command actually used. Russia ran on the Julian
calendar until February 1918, meaning the February Revolution fell in March by
Western reckoning and the October Revolution in November.

- **Russian Stavka:** Julian (Old Style) throughout, up to the 1918 changeover.
- **Ottoman:** Rumi calendar usage is a **RESEARCH GATE** — confirm what the
  general staff actually dated documents in before writing, rather than assuming.
- **All others:** Gregorian.

**The campaign select screen states the convention** before the player enters, and
the briefing document header carries it. This is the whole reason authentic dating
is safe to do — the player is told once, up front, rather than being quietly
confused for thirty nodes.

Where a Russian node references a Western event (or vice versa), the *other*
calendar's date appears in parentheses on first mention in that node. Not on every
mention — that reads as a textbook.

**Validator:** `check-dates.js` verifies every node's date field parses, sits inside
its campaign's span, and moves monotonically along the historical spine. A campaign
mixing conventions is the specific thing it catches.

### 13.2 Flag namespacing — prefixed per campaign

Every flag is prefixed with its campaign: `ohl_`, `gqg_`, `stavka_`, `bef_`, `aok_`,
`otto_`. Cross-campaign flags (the Russian → 1922 hand-off, §3.4) use `xc_`.

1922 carries 131 flag comparisons across 67 nodes. This title is ~190 nodes across
six campaigns, and an unprefixed collision compiles cleanly, passes tsc, and never
fires — the series' documented recurring failure mode. `check-flag-values.js` is
extended to fail on any unprefixed flag.

### 13.3 Advisor rosters under succession

The player occupies the **office**, not the man. A change of commander does not
reset the staff and does not multiply dossiers.

- Majors: **10-11 dossiers** each. Minors: **7-8**. Total ~54-58, comparable to 1940.
- Advisors have **entry and exit dates**. Some are present for the whole war, some
  arrive with a new seat, some are dismissed, incapacitated or killed.
- A commander seat change alters the document header, the voice register, and which
  advisors are present — not the roster size.

This makes `check-commander-timing.js` (§11) more load-bearing, not less. Advisors
entering and leaving by date is precisely what produced 1922's errors: Gajda
speaking four months after dismissal, Kappel after incapacitation, and Wrangel and
Kutepov advising the opposing command.

### 13.4 Map

**One shared map** across all campaigns: Europe and the Near East at a zoom that
holds the Western Front, Eastern Front, Italy, the Balkans and the Dardanelles.
`NODE_TO_CITY` extends unchanged.

**Ottoman gets a second map** — Anatolia, the Levant, Mesopotamia and the Caucasus.
The shared map cannot hold Kut and Ypres at a usable zoom.

Camera framing is per campaign: the same map, opening on the relevant theatre.

**Carried-forward fix:** 1922's white markers are invisible against the cream page.
Fix in the engine here rather than rediscovering it. Marker colour is a token, not
a literal.

### 13.5 Bulletins — one press voice per campaign

Six distinct press registers. A German bulletin reading like a British one is a
tell, and the bulletins are one of the strongest devices in 1922.

Each campaign's bulletin voice is defined in its content brief before its first
bulletin is written: source type (official communiqué, national daily, wire),
register, and what it is permitted to know. Occupation and censorship regimes differ
enormously and that difference is characterisation, not decoration.

Rules unchanged: **bulletins fire on arrival, before the decision**, and never
announce the outcome of the choice about to be made. Majors carry 8-10 bulletins,
minors 4-5. `check-bulletins.js` extended to verify voice-tag presence per campaign.

### 13.6 Contested rolls — a floor, not a ceiling

**Minimum 3 per major campaign, minimum 2 per minor. No maximum.**

Written as a floor because the constraint that matters isn't the count — it's
sourcing. Every `uncertain[]` block carries a `dispute` field naming the historical
disagreement it represents and where that disagreement is documented. A roll without
a citable dispute does not ship.

That constraint permits as many rolls as the history genuinely supports, and it is
the reason no cap is needed: a manufactured dispute fails the field, not a quota.

Two hard limits stand:
- **Settled outcomes are never rolled.** Casualty figures, the US entering the war
  after unrestricted submarine warfare, the fact of the armistice. Settled record is
  narrated, not gambled.
- **Endings stay decision-driven.** A roll may shape a route, a cost, or an
  aftermath. A roll may not be the last thing standing between a player's decisions
  and which ending fires. The series' distinguishing feature is that endings are
  consequences; a roll placed at the final junction converts that into a slot
  machine.

`check-rolls.js` verifies weights sum to 100, every branch target resolves, and
every block has a populated `dispute` field.

### 13.7 Node IDs — structured

`{campaign}_{year}_{seq}_{slug}` — e.g. `ohl_1917_03_usw`, `gqg_1917_06_mutinies`.
Endings: `{campaign}_end_{slug}`.

Structured because blanket find-and-replace has already caused real damage here —
one pass in 1922 rerouted 18 correct references and created a self-loop in the new
node. Prefixed, year-scoped IDs make a careless replace fail loudly instead of
silently rewiring a different campaign.

**Validator:** `check-node-ids.js` enforces the pattern, uniqueness, and that a
node's declared year matches its ID.

### 13.8 Art direction

**New visual identity for this title, built typographically.** No illustration
pipeline, no image assets — the same constraint every previous title has worked
under, met with CSS and SVG.

1940 and 1922 are cream field-dossier. This title needs to be visibly its own thing
while remaining recognisably the series. The available levers: period-appropriate
type, paper stock treatment, rule and border language, stamp and endorsement marks,
and per-campaign document treatments (§3.5) that differ more sharply from each other
than 1922's three do.

**DECISION REQUIRED — the direction itself.** "Not cream" is a constraint, not a
direction. Worth settling before the menu is built, since the menu is the first
thing that has to express it.

If the intent was actual illustration rather than typographic identity, that is a
new dependency with real cost and needs deciding explicitly rather than by drift.

---

## 14. Revised validator list

Eleven total. Six ported from 1922, five new.

**Ported:** `check-flag-values.js` (extended: §13.2 prefixes), `check-continuity.js`,
`check-advisor-coverage.js`, `check-gates.js`, `check-bulletins.js` (extended:
§13.5 voice tags), `walk-historical.js`.

**New:** `check-commander-timing.js` (§11), `check-classification.js` (§11),
`check-will-labels.js` (§11), `check-dates.js` (§13.1), `check-rolls.js` (§13.6),
`check-node-ids.js` (§13.7).

That is twelve — `check-will-labels.js` folds into `check-classification.js` if it
proves trivial. Decide when writing them, not now.

The §11 per-campaign ship gate applies unchanged, with all validators required at
0 problems.
