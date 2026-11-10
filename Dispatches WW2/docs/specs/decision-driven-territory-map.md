# Spec: Decision-Driven Territory Map

Status: SPEC ONLY — not implemented. Scoped at Craig's request, after a playtester suggested a
"monthly report... or even an annotated map" showing where losses/gains of territory occurred,
and Craig asked specifically to scope out the map moving because of what the player actually
chose, rather than the current system's dozen pre-set divergence forks.

## The idea

Right now the Checkpoint Map's region colors are driven by two layers: a per-year snapshot
table (`MAP_YEAR_STATUS`) reflecting the real historical record, and `mapOverrides(year, flags,
meters)`, which lets a handful of specific flags repaint specific regions when the player's run
has genuinely diverged. The map is honest and reactive — but only for the things it's been
told to react to. This spec is about widening that second layer so the map responds to
what the player actually decided, not just to the curated set of moments the game currently
tracks.

## What's missing today (the actual gap) — smaller than it looks

The encouraging finding: **the rendering, reactivity, and UI machinery for this already
exists and already works correctly for arbitrary flags.** `CheckpointMapRegions` calls
`currentRegionStatuses(statusYear, flags, meters)` live, every time the map is opened, reading
whatever `flags` state the player is actually in at that moment — it was never limited to
year boundaries or to a special class of flags. `mapOverrides()` already has a working
per-region note/tooltip system (`note(text, regions)`), and round 4's "flash any region that
changed since the map was last opened" feature (`lastSeenMapStatuses`/`onStatusesChange`)
already exists and would automatically pick up new overrides with zero changes. None of that
needs to be built.

What's actually missing is coverage. I counted it directly:

- **277 distinct flags** get set across the game's choices (`setFlags: {...}`).
- **`mapOverrides()` currently reads 22 of them** — the 12 Historical Divergence fork flags,
  plus about 10 flags from ordinary choices (`suez41`, `med42`, `maltaPath`, `moscowCaptured`,
  `sealion`, `tannenbaum40`, `reichStand`, `eastStand`, `eastern44`, `pathVariant`). So this
  mechanism is already doing exactly what's being asked for, just for a small hand-picked
  slice of the game.
- **255 flags have no map consequence at all.** As far as the Checkpoint Map is concerned,
  most of what the player decides is invisible.

As a rough signal of how many of those 255 are worth wiring in: scanning every choice's
`outcome` text for territorial-capture language ("fell," "captured," "occupied," "liberated,"
"encircled," etc.) — a deliberately loose net, not a precise count — turns up **200 of 632**
outcome passages game-wide (~32%), narrowed to **70 of 285 (~25%) in the German campaign
alone** (97 nodes). Not all of those will turn out to deserve an actual region flip once read
individually — some are about a unit or a person, not a place — but it's the right order of
magnitude for what a real pass would touch.

**Bottom line: this is a content-authoring project, not an engineering one.** The infrastructure
this needs was already built for the Historical Divergence Mode / Checkpoint Map round; the
work here is going back through the existing node text and deciding, node by node, whether a
result deserves a map consequence and what it is — the same kind of pass that wired the 12
fork flags in the first place, just at roughly 10x the scale.

## Proposed design

**1. No new mechanism — extend the existing one.** `mapOverrides()` stays the single place
this logic lives. Each newly-covered flag gets the same treatment the existing 22 already get:
an `if (flags.X === Y && year in range) { o.region = status; note(...) }` block.

**2. Curate, don't mechanize.** The temptation is to script this — walk every flag, guess a
region and status from its name, done. Recommend against it, for the same reason
`GRAND_CAMPAIGN_SEEDS` was designed as "a small, hand-written table" rather than a raw flag
dump: most of the 255 uncovered flags are about doctrine, resource allocation, or a
character's standing, not territory, and forcing all of them through a map consequence would
make regions flip color for reasons that don't read as territorial at all. Only outcomes that
actually describe a place changing hands should get one. Expect the real yield to be well
under the 70/255 upper bound once each is read in context, not mechanically pattern-matched.

**3. Respect the map's existing granularity.** The 28 `MAP_REGIONS` are coarse — "ussr" is one
region covering the entire Soviet Union. The existing precedent for handling a specific,
localized event (Moscow falling) is to flip the *whole* enclosing region and say so
plainly in the note text ("Moscow itself is under Axis occupation..."), the same
simplification the base map's own "illustrated, not surveyed" aesthetic already leans on.
New coverage should follow the same convention rather than trying to invent sub-region
precision the data model doesn't have.

**4. Guard against thrashing.** A region that flips status three times in six months because
three unrelated choices all technically touched it will read as noise, not history. Recommend
a rule of thumb during authoring: a region should generally move at most once or twice per
campaign run outside of the already-modeled contested/front-line states, reserved for
genuinely decisive moments (a capital falling, an island campaign resolving, a front
collapsing) — the same bar the existing 22 overrides already hold themselves to.

**5. Where this meets the monthly-log idea.** This spec makes the underlying data richer; it
doesn't by itself change how the player is told about it. The existing "flash on any region
that changed since you last opened the map" already gives a passive discovery path once more
flags are wired in. A more active one — surfacing "since your last review, Malta fell" inside
the Strategic Review panel — is the text-digest feature from the earlier discussion (option 1)
and stays a separate, later decision; this spec doesn't require it and doesn't block it.

## Scope estimate

- **Plumbing: none.** Nothing above requires a new prop, a new state shape, or a change to
  `CheckpointMapRegions`, `currentRegionStatuses`, or the flash/tooltip systems. This is
  the rare feature request that's pure content on top of an already-finished engine.
- **Content, pilot (German campaign): realistic first slice.** 97 nodes, ~70 candidate outcome
  passages to actually read, likely yielding on the order of 20-30 real new `mapOverrides()`
  entries once the "decisive moments only" filter is applied — comparable in size to the
  12-fork wiring round already done for Historical Divergence Mode, which covered all four
  campaigns at once.
  Recommend doing German alone first and looking at the actual result on the map before
  deciding whether to generalize — same reasoning the divergence-fork spec and the verdict-
  epilogue spec both used ("prototype one campaign, review real output, then decide").
- **Content, all four campaigns:** roughly 4x the pilot, once the pilot has validated the
  curation bar and the note-writing style. Soviet/Allied/Italy weren't separately counted here
  in detail but are comparable in node count and outcome-text density to German.

## Open questions for Craig before implementing

1. Pilot on German only first (recommended), or scope directly to all four campaigns?
2. Is the "decisive moments only, one or two flips per region per run" curation bar right, or
   does Craig want denser coverage even at the cost of a busier-looking map?
3. Does this get built as a standalone round, or paired with the text-digest Strategic Review
   feature (option 1 from the earlier discussion) so the two ship together as one coherent
   "the war record tells you what actually happened" feature?
4. Should newly-covered flags get their own dedicated `note()` text (matching the existing
   22's quality bar — each one is a full sentence of context), or would a shorter, more
   templated note be acceptable at this larger scale to keep the authoring cost down?
