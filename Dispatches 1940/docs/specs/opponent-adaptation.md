# Spec: Opponent Adaptation

Status: SPEC ONLY — not implemented. This was the item I flagged as riskiest-ROI on the
original brainstorm; Craig is interested anyway, so this spec tries to de-risk it rather than
talk him out of it.

## The idea

Track the player's pattern of choices within a single run, and have the historical opposition
visibly respond to it — an "the enemy has adjusted" beat, rather than every run's opposition
behaving identically regardless of how the player has been playing.

## Restating the risk plainly, because it should drive the design

A single undifferentiated "aggression" counter crossing a threshold and unlocking one generic
"the enemy has adjusted" node will read as arbitrary difficulty scaling, not as the opposition
actually noticing anything — because the player has no way to see what specific pattern
supposedly triggered it. Any version of this worth building has to make the *reason* legible:
the adaptation node has to name the thing it's reacting to, not just penalize.

## Proposed design (narrow, on purpose)

**Track named patterns, not one blended score.** Instead of a single counter, track 2-3
independent, clearly-named tallies via ordinary flags (same convention as the `factionFavor`
idea in the dialogue-options spec) — for example, for the German campaign:
`flags.patternAggressive` (choices that spend manpower/fuel for initiative) and
`flags.patternCautious` (choices that preserve resources over historical boldness). Each
choice that already sets `impact{}` can bump the relevant counter via its existing `setFlags`
— no new mechanical system, just a naming convention layered on what's already there.

**Gate a small number of specific adaptation nodes on specific thresholds**, each one written
to name what it's responding to: "Guderian's push has been read before, and this time the
line is dug in" is legible in a way "the enemy has adjusted" alone is not. This is the part
that actually costs writing time, and it's also the part that determines whether the feature
feels earned — so it shouldn't be rushed to cover many patterns at once.

## Recommendation: pilot narrow before generalizing

Pick **one campaign** (German has the most branch points to draw a pattern from) and **one
pattern** (aggressive/risk-taking play), and write 2-3 adaptation nodes gated on it. Ship that,
see whether it actually lands as intended, and only then decide whether to add a second
pattern or extend to Soviet/Allied. This is the same "prove it small before generalizing"
approach the dialogue-options spec recommends for its own riskier half (Version B), for the
same reason: the mechanical plumbing here is cheap, but the prose cost — and the risk of it
reading as arbitrary rather than earned — scales directly with how many patterns × campaigns
get covered, so there's no reason to commit to more than one pairing up front.

## Scope estimate

Mechanically small (a couple of flag counters, a threshold check, 2-3 new nodes). The
real cost is making those 2-3 nodes good enough to feel like a real response rather than a
gimmick — this is a writing-quality risk more than an engineering one, which is exactly why a
narrow pilot is worth doing before expanding.
