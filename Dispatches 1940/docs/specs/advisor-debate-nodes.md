# Spec: Advisor-Debate / Dialogue-Option Nodes

Status: SPEC ONLY — not implemented. Craig is interested in the dialogue-options angle
specifically; this scopes it before committing to code.

## The idea

A node subtype where 2-3 advisors argue with each other before the player picks a side,
instead of the current pattern where each choice carries at most one advisor's quote,
disconnected from the others.

## The honest starting observation: the data barely needs to change

Every node already has multiple choices, and several already have a different advisor quoted
on each choice — arguing implicitly, just never rendered as a conversation. `caseYellow40` is
a clean existing example: choice 1 quotes Manstein arguing for the Ardennes plan, choice 2
quotes Halder arguing to hold the original plan — that's already a debate in substance, just
displayed as two separate buttons rather than a transcript.

So the real question isn't "what new data shape does this need" — it's "what's actually new
here beyond presentation?" Two versions, worth treating as separate, sequential pieces of work:

## Version A: presentation only (recommended starting point)

A new rendering path that detects "this node's choices each carry a distinct `advisor.name`"
and, instead of showing one quote inline per choice button, renders a debate transcript above
the choices — advisor portraits/names in sequence, their quotes as dialogue, *then* the choice
buttons below (label text only, since the quote's already been shown in the transcript). No
change to node data at all. Pilot on 3-5 existing nodes that already qualify (caseYellow40 and
similar multi-advisor nodes — worth a quick audit pass to find the best existing candidates
before writing any new content).

**Effort:** UI-component work only, roughly half a day. Zero new save-schema, zero new node
authoring.

## Version B: mechanical — faction favor

If Version A lands well, add real weight: a `factionFavor` tally, tracked as ordinary flags
(e.g. `flags.favoredGuderian = (flags.favoredGuderian || 0) + 1`, set via each choice's
existing `setFlags`, so it needs no new save-schema either — it's just a naming convention).
Once a tally crosses a threshold, a later node can check it and offer a bonus beat — "Guderian,
whose counsel you've favored all war, has one more argument" — the same pattern the game
already uses for `favor`/capital gating, applied per-advisor instead of globally.

**Effort:** small mechanically, but needs new late-game nodes written to pay off the tallies,
so cost scales with how many advisors get this treatment. Recommend picking 2-3 advisors per
campaign with the strongest existing "recurring voice" presence (Guderian and Halder for
German, similar audit needed for Soviet/Allied) rather than doing all of them at once.

## Recommendation

Build Version A first and get it in front of Craig before touching Version B — it's cheap,
reversible, and will make clear whether the debate framing actually adds something or whether
it's fighting the game's existing text density. Version B is a genuine new depth layer but
shouldn't be committed to until A has been seen working.
