# Dispatches 1922 — Next-Batch Recommendations

Follow-on to `dispatches-1922-validation-round19.md`. That pass confirmed the file
matches HANDOVER.md's claimed state; this one goes further — re-derives structural
metrics fresh (not just re-running the six saved scripts) and prioritizes what's
actually worth doing next. Measured, not guessed, per this project's own rule.

One housekeeping note first: the `1941-comparison-reference.md` you attached is
about a different title (Dispatches 1941's map-reactivity code vs 1940's) — it
doesn't apply here, no Checkpoint Map / status-override system exists in this
file to check it against. Saying so plainly rather than forcing a comparison
that doesn't fit, per that doc's own instructions.

---

## Priority 1 — bounded, no research required, ready for the next session

### 1a. Fix `NODE_TO_CITY` (7 missing registrations)
Already reported in the validation doc. One atlas node (`volgaCossackDesertion19`)
and six endings are silently absent from the Front Map / ending-screen city
lookup. Not a crash — just a dropped map marker or a wrong fallback city on the
ending screen. My best-guess mapping (read each epilogue, matched against
sibling nodes' existing city assignments) is in that report; `endingTheAutumnCrisis19`
has two plausible answers that disagree, worth your own read before committing.

### 1b. Retire two stale "KNOWN GAP" claims in the header comment
The file's top comment (~line 61-64) still says `manchurianBorder20` and
`distributedPursuit19` both dead-end at `END_STUB` with no written payoff.
**Checked directly — both are wrong.** `manchurianBorder20` resolves to
`endingDispersedAtTheBorder`, a fully-written historical ending with its own
dossier-quality epilogue and flag-conditional variants. `distributedPursuit19`
routes onward into `polishWar20` or `perekopAssault20`, both of which reach real
endings further down the graph. Grepping the whole file for the literal string
`"END_STUB"` turns up zero data-level uses — there are currently no dead ends
anywhere in the graph (confirmed independently: 8,000-run Monte Carlo per
campaign, 0 crashes, 0 no-choice terminations). The comment is just out of date;
worth deleting that paragraph so a future session doesn't go looking for a gap
that's already closed.

### 1c. Fold the NODE_TO_CITY check into a validator
None of the six saved scripts check it, which is exactly how 1a slipped through
every sweep that's been run so far. Natural home is `check-continuity.js` or
`check-gates.js` — a one-function addition, same pattern as the other five.

---

## Priority 2 — verified imbalances, real research required before writing

These are measured gaps, not proposals — writing any of them still needs the
same "documented third course, verified via search" discipline the plan doc
already enforces. Flagging *where* the gap is, not what should fill it.

### 2a. southRussia is far behind on third options
Fresh count, all 67 nodes: **southRussia has exactly 1 three-choice node out of
27** (`kubanCoup19`). Siberia has 2 of 19. Bolsheviks has 5 of 21 — proportionally
five times southRussia's rate. Every batch that's added a third option so far has
gone to siberia or bolsheviks; southRussia hasn't had one since `kubanCoup19`.
It's also the largest campaign (27 nodes, more choices than the other two
combined), so it has the most real estate for this to matter. Worth being the
explicit target of the next "third options where documented" research pass,
rather than defaulting to wherever the last session left off.

### 2b. bolsheviks barely uses the `uncertain` (dice-roll) mechanic
1 roll-based choice across the whole campaign, vs southRussia's 7 and siberia's
4. The file's own backlog note flagged this ratio as too low project-wide
("only 2 of ~26 written choices... expand this once more content exists") — that
was written when the ratio was 2/26; it's now 12/139 game-wide, but almost
entirely absent from one of the three campaigns specifically. Per the series
rule, a roll only belongs where "serious historians genuinely disagree" — so
this isn't "add rolls to hit a number," it's "check whether bolsheviks has
genuinely contested moments that aren't currently dramatized as one."

### 2c. Gate bite rate — re-measured, still lopsided
Re-ran a fresh 8,000-run Monte Carlo per campaign (independent of HANDOVER's
own number, not just trusting it): **45% of southRussia runs hit at least one
gate block, 18% of siberia's, 13% of bolsheviks'.** Directionally the same shape
HANDOVER.md already reports and calls "not solved" — bolsheviks' three gated
axes (mobilization, warIndustry, reliability) exist but rarely bind in practice.
Confirms the gap is still live, not something later batches quietly fixed.
Per the project's own rule ("set thresholds from measured distributions, not
intuition"), the fix is to pull bolsheviks' actual meter-value distribution
from a Monte Carlo run and re-derive gate thresholds from it, the same way
prior threshold bugs got fixed — not to guess tighter numbers.

---

## Priority 3 — already acknowledged, just consolidated and prioritized

Nothing new here — pulled together from HANDOVER's "Known weak points" and the
file's own BACKLOG comment so it reads as one punch list instead of two.

1. **5 convergence points still need manual continuity review**
   (`wrangelsDismissal20`, `northernTauride20`, `wrangelsEnvoy20` in southRussia;
   `irkutskUltimatum20` in siberia; `tsaritsynCrisis18` in bolsheviks) — each is
   reached by multiple paths with no flag-conditional branch, per
   `check-continuity.js`. Not automatically bugs; each needs reading against
   every path that reaches it. Bounded, well-scoped homework for one session.
2. **No save state, no objectives system.** Structural, not content — the War
   Record currently lists everything written rather than what a given
   playthrough actually uncovered. Larger lift than anything above.
3. **Audio toggles wired to nothing.** Honestly scaffolded (marked NOT YET
   WIRED in Settings, per HANDOVER), not silently broken — but still open.
4. **Three visual chrome directions mocked up, none committed** (White
   chancery telegraph / Trans-Siberian frontier telegraph / constructivist
   poster) — a design decision waiting on you, not a content gap.
5. **Steam evaluation not started** — Mac build infra, Steamworks SDK, AI
   content disclosure under current Valve policy. Series-wide, not 1922-specific.

---

## What I'd actually do first

Priority 1 is a few hours of mechanical work with no research risk — good
opener for the next session regardless of what else you pick. Of Priority 2,
**2a (southRussia third options)** is the one with the clearest payoff: it's
the campaign with the most content already, currently getting the least
structural variety, and the plan doc's own rejected-candidates list shows
you've already done the legwork of ruling out several false starts elsewhere —
southRussia hasn't had that pass yet.
