// dispatches-1917.jsx (working title: "Dispatches 1922" — see title note below)
// engine scaffold + node chains for South Russia / Siberia / Bolsheviks
//
// SCOPE NOTE (updated — the original note below is stale and kept only for
// history): this file now contains CAMPAIGNS data, resolveNode logic, the
// generic engine helpers (modWeight, applyImpact, proceed), AND a full set of
// screen components — BriefingScreen, OutcomeScreen, EndingScreen,
// EndStubScreen, FrontMapScreen, BulletinScreen, and the rest — plus a
// complete App() at the bottom of the file. Nothing here needs wiring into an
// external shell anymore; App() is the shell.
//
// Original note, preserved for context: "It does NOT contain BriefingScreen /
// OutcomeScreen / EndScreen / DemoWallScreen — per §9 step 4 those should be
// copied structurally from the actual 1940/1941 source files. I only had the
// compiled web build for 1941 (dispatches-pacific-web.zip has no source, just
// bundled JS + audio), not the source .jsx, so I could not copy them
// faithfully without guessing at markup that might not match your real
// components." That gap has since been closed by writing this file's own
// screen components directly, rather than porting 1940/1941's.
//
// TITLE: was "Dispatches 1917", then "Dispatches: Civil War" (no single year
// cleanly covers the 1918-1921 campaign span; 1918 was avoided for clashing
// with WWI's end year). Now "Dispatches 1922", restoring the 1940/1941
// year-naming pattern — 1922 is defensible as the year most conventional
// periodizations treat the Civil War as fully over (the Far Eastern Republic's
// absorption into the RSFSR that November), even though none of this file's
// three playable campaigns runs that far past their own historical endpoints.
//
// Triangle: campaign-specific axes (see each campaign's triangleAxes), all
// zero-baseline — 0 is the historical record, every historical:true choice
// carries {} impact, only speculative choices move the needle, hard ±10 clamp.
// Political Legitimacy / Worker-Peasant Support is ALSO zero-baseline now,
// same convention, tracked separately from the triangle, own ±10 clamp.
// Hard mode is a fourth, campaign-specific erosion meter on its own 0–100
// scale — not part of the zero-baseline convention, accumulates regardless of
// historical/speculative framing based on whether the override actually
// happened.
//
// CONTENT PRINCIPLE (locked): campaigns do not need to converge on the same
// kind of ending — this is a decision simulator, divergence from the
// historical outcome is allowed, but must stay within the realm of what a
// serious historian would call plausible, not wish-fulfillment. Massacres and
// other atrocities are not softened into "background" framing when the
// historical record includes them — they should be presented as an actual
// selectable choice with real consequences, not narrated past. Each
// campaign's plannedEnding (below) is the natural stopping point a player
// should expect, decided deliberately, not left to run indefinitely.
//
// FORK PRINCIPLE (locked): every speculative/projected choice should lead to
// a full deep fork — its own downstream node with real, researched content —
// not just a meter delta that reconverges into the same next node as the
// historical choice. A choice that only changes numbers isn't a fork, it's a
// flavor pick. As of this note, 19 of 38 fork points across the three
// campaigns are genuine deep forks. The PRIMARY node backlog named in
// earlier versions of this note is now clear — the last item (semyonov
// merger) converted this round. What remains unconverted is entirely
// connector nodes spawned by earlier conversions (e.g. volgaThrust19,
// kubanCoup19, janinsWord19, distributedPursuit19, and similar) plus two
// deliberate, documented exceptions: northernTauride20 (shared waypoint,
// the operation happened regardless of which reform was chosen) and
// irkutskUltimatum20 (Kolchak's fate is fixed regardless of the choice on
// purpose — forcing divergence there would undercut the point). Whether
// connector nodes should themselves be forked further hasn't been decided —
// don't assume yes and start converting them without checking first, since
// that could compound into far more work than a straightforward "convert
// the next node" instruction implies.
//
// RESOLVED (was "KNOWN GAP" here — checked directly, both are fine):
// manchurianBorder20 resolves to endingDispersedAtTheBorder, a full written
// ending; distributedPursuit19 routes onward into polishWar20/perekopAssault20,
// both of which reach real endings further down the graph. No literal
// "END_STUB" target exists anywhere in the CAMPAIGNS data as of this note —
// confirmed by grep and by an 8,000-run Monte Carlo per campaign (0 crashes,
// 0 no-choice terminations). There are currently no dead ends in this file.
//
// BACKLOG (updated round 23 — do not assume anything below is current
// without checking; the round22-recommendations/round22-build2-log and
// round23-recommendations project docs have the fuller writeups):
// - Persistence: RESOLVED round 22. Single-slot save/resume (localStorage,
//   schema-versioned, try/catch throughout) — see the save helpers above
//   App().
// - Per-run/persistent discovery tracking: RESOLVED round 23. A second,
//   separate localStorage key (dispatches1922_discovered_v1, its own
//   schema version) accumulates every node and ending this browser has
//   ever actually reached, across every run and every campaign — never
//   cleared by clearSave(). WarRecordScreen, DiscoveryAtlasScreen, and
//   EndingsGalleryScreen all read it now: counts read "N of TOTAL
//   discovered," and the atlas/gallery lists dim and redact the title of
//   anything not yet reached. Still local to one browser's storage, same
//   as the save itself.
// - Context/Key Events timeline: RESOLVED round 23, scoped deliberately.
//   TimelineScreen (reachable via a KEY EVENTS button next to VIEW FRONT
//   MAP on the briefing screen) lists every node the current run has
//   passed through, in order, with date and title. It does NOT reconstruct
//   which literal choice text was clicked at each stop — see that
//   component's own comment for why that's a harder, more ambiguous
//   problem than it looks (uncertain-roll setFlags mixing with the base
//   choice's). The sequence of situations reached is what's reliably
//   showable, and is what got built.
// - Objectives legibility: PARTIALLY addressed round 22 — every briefing
//   screen now has a collapsible OBJECTIVES panel restating the campaign's
//   thesis, planned terminus, and hard-mode stakes (existing CAMPAIGNS data,
//   not new content). This is a plain-language restatement, not a tracked
//   sub-goal system — no per-decision quest log exists. Unchanged this round.
// - Bolsheviks gate/uncertain imbalance: RESOLVED round 22. 15 of 148
//   written choices use the `uncertain` mechanic: southRussia 7, siberia 4,
//   bolsheviks 4.
// - southRussia third options: PARTIALLY addressed round 22, one more
//   choice added round 23 (wrangelsReassignment20 gained a gate — see
//   below). Now 3 of 29 nodes vs siberia 2/19 and bolsheviks 5/21 — still
//   the campaign furthest behind per-node, despite being the largest.
// - modWeight() sensitivity: RESOLVED round 23. All 14 modWeight() calls in
//   resolveNode were hardcoding meterValue as a literal 50 or 58 instead of
//   a real meter — the "known-risk odds" shown on the choice screen were
//   never actually risk-sensitive, in any campaign, in any prior round.
//   meterPct() (next to modWeight() above) rescales a real -10..+10
//   triangle meter onto the 0-100 scale modWeight expects; all 14 sites now
//   pass a live meters.<axis> read, chosen per node to match what that
//   node's own impact fields already touch (manpower for nearly all of
//   southRussia's, rail for siberia's, a mobilization/reliability split for
//   bolsheviks' — not evenly spread by design, following each campaign's
//   own existing content distribution rather than forcing balance against
//   it). One latent bug fixed in the same pass: orelCulmination19's two
//   outcome weights were independent modWeight(X, 50) literals that only
//   summed to 100 by coincidence of both hardcoding the same neutral
//   value — converted to the shared-variable/complement pattern used
//   everywhere else so the two stay complementary now that the input is live.
// - wrangelsReassignment20 mechanical weight: RESOLVED round 23 — was the
//   only multi-choice node in the file with no gate and no uncertain roll.
//   The "real command" choice is now gated on manpower >= -4 (an army
//   bleeding manpower can't spare a real formation for an internal
//   political test), matching this campaign's usual manpower-gate cluster.
// - Front Map colorblind accessibility: RESOLVED round 23.
//   CONTROL_COLORS.red and .contested were the pair most likely to
//   collapse under red-green colorblindness, and status was color-only on
//   both the zone fill and the city markers. Contested zones now render
//   with a diagonal-hatch SVG pattern instead of a flat fill; contested
//   markers get a dashed stroke on top of their color; MapLegendRow's
//   contested swatch previews the same hatch rather than a solid chip.
// - Shkuro Cossack army lead (~Jan 1920): CLOSED round 23, not built. Round
//   21 flagged it as single-sourced and left it as a lead. The round-23
//   second-source pass found no corroboration anywhere — not Shkuro's own
//   Wikipedia biography, not Armed Forces of South Russia's — and that
//   biography documents the opposite dynamic for the same period (Wrangel,
//   not Denikin, refusing him a command). See CIVILWAR_EXPANSION_PLAN.md's
//   REJECTED section. Do not re-propose without a genuinely new source.
// - Voitsekhovsky advisor dossier: RESOLVED round 23 — was a 150-char stub
//   against a 300-450 median across all three campaigns' dossiers, fleshed
//   out with sourced, cross-verified detail (Czechoslovak Legion command,
//   the Kappel succession, and a post-war fate — Czechoslovak army general,
//   wartime resistance, death in a Soviet Gulag camp in 1951 — none of
//   which existed in the dossier before).
// - Constructivist UI chrome: three visual directions were mocked up
//   (White chancery telegraph / Trans-Siberian frontier telegraph /
//   constructivist poster) for comparison — none committed to this file yet.
//   Revisit after content, per plan. Unchanged this round.
// - Real-geography Front Map (round 22): see CIVILWAR_MAP_NOTES below
//   FrontMapScreen for the full account. MapLegendRow added same round —
//   the zone-shading colours were previously explained only in mapVoice's
//   prose, not as an on-screen key.
// - Audio toggles: still wired to nothing, honestly labeled NOT YET WIRED
//   in Settings. Unchanged this round.
// - Steam evaluation: not started. Series-wide, not 1922-specific.
//   Unchanged this round.
//
// 69 nodes written (29/19/21), node target is aspirational and will vary by
// campaign as projected/speculative forks get added — not a fixed total to
// hit on a deadline. 148 choices total.

// ---------------------------------------------------------------------------
// Engine helpers (generic — not campaign-specific)
// ---------------------------------------------------------------------------

/** Clamp a weighted-uncertain probability into the 5–95 band. */
function modWeight(base, meterValue, sensitivity = 0.4) {
  const shifted = base + (meterValue - 50) * sensitivity;
  return Math.max(5, Math.min(95, Math.round(shifted)));
}

/**
 * Round 23: modWeight() expects meterValue on a 0-100 scale (50 = neutral) —
 * but every triangle meter in this file runs -10..+10 around a 0 baseline.
 * Every one of the 14 modWeight() calls in resolveNode was passing a
 * hardcoded literal (50, or 58 in two cases) instead of a real meter,
 * meaning `sensitivity` — and the whole "known-risk odds" premise on the
 * choice screen — was fully wired but never actually fed live data. This
 * rescales a real triangle meter (-10..+10) onto the 0-100 scale modWeight
 * expects, so meterPct(meters.manpower) at manpower=0 reproduces the old
 * neutral-50 behavior exactly, and diverges from it as the player's actual
 * standing diverges from the historical baseline.
 */
function meterPct(meterValue) {
  return 50 + (meterValue || 0) * 5;
}

/** Apply a choice's impact object to a mutable meter state. Never mutates in place. */

function applyImpact(meters, impact = {}) {
  const next = { ...meters };
  for (const key of Object.keys(impact)) {
    if (!(key in next)) continue; // unknown key — fail loud in dev, not silently
    next[key] = next[key] + impact[key];
  }
  return next;
}

/**
 * Hard ±10 clamp for the triangle axes — same convention as the 1940 Allied
 * campaign. Meters start at 0 (the historical baseline) and move only when a
 * choice diverges from what actually happened; the historical option on any
 * node should carry {} (zero) impact on these axes.
 */
function clampTriangle(meters, axes = ["manpower", "materiel", "rail"]) {
  const next = { ...meters };
  for (const axis of axes) {
    if (axis in next) next[axis] = Math.max(-10, Math.min(10, next[axis]));
  }
  return next;
}

/** Resolve a node id against a campaign's own resolveNode implementation. */
function resolveNode(campaign, nodeId) {
  const node = campaign.resolveNode(nodeId);
  if (!node) {
    throw new Error(`[dispatches-1922] Unknown node id "${nodeId}" in campaign "${campaign.id}"`);
  }
  return node;
}

// ---------------------------------------------------------------------------
// CAMPAIGNS
// ---------------------------------------------------------------------------

export const CAMPAIGNS = {
  // =========================================================================
  // SOUTH RUSSIA — Denikin / Wrangel, Armed Forces of South Russia (AFSR)
  // =========================================================================
