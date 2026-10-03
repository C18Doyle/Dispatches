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
  southRussia: {
    id: "southRussia",
    label: "Armed Forces of South Russia",
    coalition: "white", // nominally under Kolchak's Supreme Ruler authority from June 1919 -- see Denikin/Kolchak dossiers. Practically independent throughout.
    shortTag: "AFSR", // identity — fixed regardless of skin choice
    commander: "General Anton Denikin",
    seat: "AFSR General Staff, Tsaritsyn",
    thesis: "One war. A White movement nominally united under Kolchak but fought, in practice, as an independent campaign — managing the shape of a defeat, not chasing an alternate victory.",
    start: "kornilovsDeath18",

    initialMeters: {
      manpower: 0,
      materiel: 0,
      rail: 0,
    },
    triangleAxes: [
      { key: "manpower", label: "MANPOWER" },
      { key: "materiel", label: "FOREIGN MATÉRIEL" },
      { key: "rail", label: "RAIL CONTROL" },
    ],
    initialLegitimacy: 0, // zero-baseline, same convention as the triangle — historical choices carry {} here too
    plannedEnding: {
      date: "NOVEMBER 1920",
      title: "The Crimea Evacuation",
      note:
        "Not Denikin's April 1920 resignation — that's a command handover mid-story. Wrangel's final evacuation from Crimea is the real terminus: the last organized White military-political entity in European Russia physically leaves. Should land after his land-reform gambit pays off or fails, so a player who backed reform feels it mattered even in defeat.",
    },
    hardMode: {
      key: "cohesionStrain",
      label: "Volunteer Army Cohesion",
      capitalName: "KALABUKHOV MODE",
      capitalLabel: "COHESION CAPITAL",
      description:
        "No rewind, no meter dashboard — only staff reports. Five points of Cohesion Capital to spend on centralizing choices that override the Cossack Hosts' objections. Spend all five and the coalition doesn't survive it — Cossack contingents desert or turn on the rearguard at the fifth override, the campaign ending in mutiny, not battlefield defeat. Named for the Kuban Rada chairman hanged in November 1919 for the crime of negotiating separately — the same instinct, spent five times running.",
      buttonLabel: "OPEN COMMAND",
      maxCap: 5,
      maxEndingId: "endingCossackMutiny",
    },

    NEWSPAPER_MASTHEAD: "VELIKAYA ROSSIYA",
    NEWSPAPER_SUBHEAD: "Great Russia — as read at AFSR field headquarters",
    ADVISOR_DOSSIERS: {
      kornilov: {
        role: "Commander-in-Chief, Volunteer Army (until April 13, 1918)",
        bio:
          "Former commander of the Petrograd Military District under the Provisional Government, arrested and imprisoned after his failed August 1917 attempt to establish a military dictatorship. Escaped to organize the Volunteer Army in the Don region with Alekseev after the Bolshevik seizure of power.",
        fate:
          "Killed on April 13, 1918, when a Red artillery shell struck the single room of his farmhouse headquarters near Ekaterinodar. His death was concealed from the army for a time to prevent a collapse in morale; he was buried in secret.",
        faction: "Volunteer Army Founding Command",
        rank: 0,
      },
      alekseev: {
        role: "Political leader, Volunteer Army",
        bio:
          "Former Chief of Staff of the Imperial Russian Army under the Tsar and briefly Supreme Commander-in-Chief under the Provisional Government. Co-founded the Volunteer Army with Kornilov, taking political leadership while Kornilov held military command.",
        fate:
          "Died of heart failure in Ekaterinodar in October 1918, six months after Kornilov, having lived just long enough to see the Volunteer Army retake the city it had failed to capture under his and Kornilov's joint leadership.",
        faction: "Volunteer Army Founding Command",
        rank: 0,
      },
      denikin: {
        role: "Commander-in-Chief, AFSR — nominally subordinate to Kolchak's Supreme Ruler government from June 1919",
        bio:
          "Career Imperial Army officer of humble birth, risen on merit rather than aristocratic connection. Committed to a unified, centrally-governed Russia and instinctively suspicious of regional autonomy movements — a position that put him at odds with the Cossack Hosts and Ukrainian nationalists whose cooperation his campaign depended on. On June 12, 1919, he formally submitted to Kolchak's authority, telegraphing: 'Safety of cause lies in a single high commander-in-chief... I yield to Admiral Kolchak and recognize him as Supreme Governor Russian state and commander-in-chief Russia Army.' The recognition was real but purely symbolic — it changed nothing about AFSR's operational independence, which every later decision from this command reflects.",
        fate:
          "Named Kolchak's successor as Supreme Ruler in December 1919; briefly held that title himself, in name only, from January to April 1920 — while personally commanding the Novorossiysk evacuation and the retreat that followed. Resigned command in April 1920 after the retreat into Crimea, handing over to Wrangel. Died in exile in the United States in 1947, having spent his final years urging émigrés not to side with Nazi Germany against the USSR.",
        faction: "AFSR High Command",
        rank: 0,
      },
      wrangel: {
        role: "Commander, Caucasus Army",
        bio:
          "Opposed the Moscow Directive's broad-front advance from the outset, arguing for concentrating the Whites' considerable cavalry strength on the Volga axis and securing the rear before pushing further. Privately dismissive of the directive's chances.",
        fate:
          "Succeeded Denikin as Commander-in-Chief in April 1920, held Crimea for six more months, and organized the November 1920 evacuation of the remaining White forces. Died in Brussels in 1928.",
        faction: "AFSR High Command",
        rank: 1,
      },
      shatilov: {
        role: "Chief of Staff, Armed Forces of South Russia / Russian Army (from April 1920)",
        bio:
          "Wrangel's closest staff officer and confidant, serving as his chief of staff through the entire Crimean period. Co-signed, with Konovalets, the letter proposing cooperation to Makhno's insurgent staff in June 1920 — an overture Makhno's own council answered by executing the messenger who delivered it.",
        fate:
          "Evacuated with the rest of the command in November 1920. Remained one of Wrangel's closest associates in emigration, active in the Russian All-Military Union alongside Kutepov. Died in Cannes in 1954, one of the few senior AFSR/Russian Army commanders to die of natural causes rather than assassination, execution, or violence.",
        faction: "AFSR High Command",
        rank: 1,
      },
      kutepov: {
        role: "Commander, 1st Army Corps; head of the Novorossiysk/Crimea evacuation effort",
        bio:
          "A straightforward, respected combat officer with no real background in politics or administration — as Governor-General of the Black Sea region in 1918 he executed suspected looters and pogrom perpetrators without much regard for legal process. Oversaw the evacuation commission at Novorossiysk in 1920.",
        fate:
          "Evacuated to Gallipoli with his corps after Crimea fell, eventually settling in Paris as chairman of the Russian All-Military Union, an émigré veterans' organization that ran sabotage operations into the USSR. Kidnapped off a Paris street by Soviet OGPU agents on January 26, 1930; died of a heart attack during the struggle. His body was never found.",
        faction: "AFSR High Command",
        rank: 1,
      },
      krivoshein: {
        role: "Head of Government, South Russia (from April 1920)",
        bio:
          "Agriculture minister under Nicholas II and Stolypin's closest collaborator on the land reforms of 1906–11, which broke up the peasant commune and created a class of individual smallholders. Brought in by Wrangel in April 1920 to give the Crimea a civil government, he wrote the land law of May 1920 — peasants purchasing, through the state, the land they already worked. It was the measure White commanders had been advised to adopt since 1918 and had refused every time.",
        fate:
          "The law had seven months to work in a peninsula under siege, which was not enough to test whether it would have changed anything in 1918. Evacuated with the rest in November 1920. Died in Berlin in 1921, a year after the government he had been brought in to build.",
        faction: "Crimean Government",
        rank: 1,
      },
      ulagai: {
        role: "Commander, Kuban Expeditionary Force",
        bio:
          "Led the roughly 4,500-man landing across the Sea of Azov in August 1920, timed to coincide with the land law's rollout in the hope of linking up with Kuban partisan networks and widening the Northern Tauride offensive.",
        fate:
          "The expedition lasted barely three weeks before being forced to withdraw — the hoped-for peasant and Cossack rising in the Kuban never materialized at the scale needed to hold the bridgehead.",
        faction: "AFSR High Command",
        rank: 2,
      },
      holman: {
        role: "Brigadier-General, head of the British Military Mission to South Russia",
        bio:
          "Led Britain's military mission from mid-1919, overseeing the delivery of over 200,000 rifles and substantial artillery to the AFSR. At Novorossiysk personally promised Denikin that British forces would see the women and children of White officers evacuated safely, and stood on the harbor mole through the night of March 26 supervising the Don Cossacks' embarkation himself.",
        fate:
          "Left South Russia with the evacuation's completion. His personal emotional investment in the people he'd promised to save was noted by those who served under him — described by one contemporary as visibly overwhelmed by what he witnessed on the docks.",
        faction: "British Military Mission",
        rank: 2,
      },
    },

    NODE_ATLAS: [
      { id: "kornilovsDeath18", date: "APRIL 1918", title: "Ekaterinodar: The Shell That Changed Command" },
      { id: "ekaterinodarAssault18", date: "APRIL 1918", title: "Ekaterinodar: One More Day" },
      { id: "afterEkaterinodar18", date: "APRIL 1918", title: "Ekaterinodar: What the Foothold Bought" },
      { id: "moscowDirective19", date: "JULY 1919", title: "Tsaritsyn: The Directive" },
      { id: "kievConvergence19", date: "AUGUST 1919", title: "Kiev: Whose Flag" },
      { id: "volgaThrust19", date: "AUGUST 1919", title: "The Volga: How Far" },
      { id: "volgaOverextension19", date: "SEPTEMBER 1919", title: "The Volga: An Empty Rendezvous" },
      { id: "rearSecurity19", date: "SEPTEMBER 1919", title: "Ukraine: The Insurgent Rear" },
      { id: "peregonovka19", date: "SEPTEMBER 1919", title: "Peregonovka: The Trap That Broke" },
      { id: "makhnosAftermath19", date: "OCTOBER 1919", title: "Peregonovka: What the Depot Bought" },
      { id: "orelCulmination19", date: "OCTOBER 1919", title: "Orel: The Culmination" },
      { id: "cossackDesertion19", date: "NOVEMBER 1919", title: "The Don: Going Home" },
      { id: "volgaCossackDesertion19", date: "NOVEMBER 1919", title: "The Volga: Riding for Home" },
      { id: "kubanCoup19", date: "NOVEMBER 1919", title: "Ekaterinodar: The Rada's Price" },
      { id: "kubanRadaReorganized19", date: "DECEMBER 1919", title: "Ekaterinodar: A Rada That Says Yes" },
      { id: "kharkovLine19", date: "DECEMBER 1919", title: "Kharkov: A Line That Might Hold" },
      { id: "kharkovEncirclement19", date: "DECEMBER 1919", title: "Kharkov: The Threat of the Ring" },
      { id: "afterTheCavalryStrike19", date: "DECEMBER 1919", title: "Kharkov: The Cavalry's Aftermath" },
      { id: "kubanQuotaAftermath19", date: "JANUARY 1920", title: "Ekaterinodar: The Gap on the Record" },
      { id: "novorossiysk20", date: "MARCH 1920", title: "Novorossiysk: The Ships" },
      { id: "voroshilovsCavalry20", date: "MARCH 1920", title: "The Mole: Whoever Holds It Last" },
      { id: "moleRearguardFate20", date: "MARCH 1920", title: "The Mole: The Rearguard's Own Minutes" },
      { id: "wrangelsDismissal20", date: "FEBRUARY 1920", title: "Sevastopol: The Baron's Letter" },
      { id: "wrangelsReassignment20", date: "FEBRUARY 1920", title: "Field Command: A Quieter Argument" },
      { id: "sevastopolCouncil20", date: "APRIL 1920", title: "Sevastopol: The Council of Commanders" },
      { id: "landLawDecision20", date: "MAY 1920", title: "Sevastopol: The Land Law" },
      { id: "northernTauride20", date: "JUNE 1920", title: "Tauride: Neither Bayonets Nor Deeds" },
      { id: "wrangelsEnvoy20", date: "JULY 1920", title: "Vrem'evka: The Letter to Makhno" },
      { id: "crimeaDefensePrep20", date: "OCTOBER 1920", title: "Sevastopol: Preparing for the End" },
    ],
    NODE_TOTAL: 29,
    ENDINGS_GALLERY: [
      { id: "endingBizerte", title: "The Bizerte Fleet", classification: "historical" },
      { id: "endingTheCouncilAtSevastopol20", title: "The Council at Sevastopol", classification: "speculative" },
      { id: "endingSecondNovorossiysk", title: "Second Novorossiysk", classification: "speculative" },
      { id: "endingArmyDissolved20", title: "The Army That Dissolved", classification: "speculative" },
      { id: "endingCossackMutiny", title: "The Mutiny", classification: "speculative" },
      { id: "endingTheArmyThatDidNotComeBack18", title: "The Army That Did Not Come Back", classification: "speculative" },
      { id: "endingTheLineThatBroke19", title: "The Line That Broke", classification: "speculative" },
    ],
    ENDING_CLASSIFICATION: {
      endingBizerte: "historical",
      endingTheCouncilAtSevastopol20: "speculative",
      endingSecondNovorossiysk: "speculative",
      endingArmyDissolved20: "speculative",
      endingCossackMutiny: "speculative",
      endingTheArmyThatDidNotComeBack18: "speculative",
      endingTheLineThatBroke19: "speculative",
    },

    resolveNode(nodeId, flags = {}, meters = {}) {
      switch (nodeId) {
        // -------------------------------------------------------------------
        case "kornilovsDeath18":
          return {
            date: "APRIL 1918",
            title: "Ekaterinodar: The Shell That Changed Command",
            bulletin: {
              headline: "PEACE WITH GERMANY, SIX WEEKS OLD",
              body: "Brest-Litovsk, signed 3 March: Poland, Finland, the Baltics, and all of Ukraine surrendered to German occupation — a quarter of the old empire. Trotsky's own delegation walked out twice before signing. Lenin's argument carried the room: a government that does not survive the winter builds socialism nowhere. That government is what this command now exists to fight.",
              meanwhile: {
                siberia: "No organized front here yet. The Czechoslovak Legion — 50,000 men working their way east along the Trans-Siberian under an agreement with the Bolsheviks to evacuate peacefully — is still six weeks from the clash that will end that agreement and open this front entirely.",
                bolsheviks: "The peace bought survival, not consensus. The Left Socialist-Revolutionaries who shared power with the Bolsheviks broke over the treaty within weeks, and their own uprising against the government they helped form is still four months off.",
              },
            },
            historicalRecord: true,
            situation:
              "A Red artillery shell has found the one room in the farmhouse headquarters where Kornilov was standing. He is dead — a fact his own staff are keeping from the Volunteer Army for now, for fear that losing the man who founded this movement will collapse what little cohesion four thousand exhausted men retreating across frozen steppe still have. Command has passed to you. Kornilov's assault on Ekaterinodar, the Kuban Cossack capital, is five days old and has made no real progress against a Red garrison more than twice the Volunteers' number.",
            choices: [
              {
                label: "Call off the assault. Withdraw north toward the Don rather than continue a fight Kornilov's death has made yours to lose or preserve.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I did not ask for this command in the middle of a battle I did not plan. What I will not do is spend the army that's left on a city we do not currently have the strength to take, in a fight that was already going badly before this morning.",
                },
                historical: true,
                setFlags: { ekaterinodarChoice: "withdraw" },
                impact: {},
                next: "moscowDirective19",
                outcome:
                  "The withdrawal begins that evening — the retreat that becomes known as the Ice March, back across the frozen Kuban steppe toward the Don. It is not the last time this army fights for Ekaterinodar: reinforced and reorganized, it returns to take the city for real in August. By January 1919 the Volunteer Army has unified with the Don Cossack forces into the Armed Forces of South Russia, and this command's real campaign — the one that reaches its high-water mark at Tsaritsyn a year from now — begins in earnest.",
              },
              {
                label: "Press the assault. Honor Kornilov's plan and gamble that the city falls before the army does.",
                advisor: {
                  name: "Alekseev",
                  quote:
                    "Abandoning the fight the same day our commander dies looks like exactly the weakness this movement cannot afford to show. I have heard that argument made with real conviction. I have not yet heard anyone explain how it survives contact with a garrison twice our number, under a man who has held command for a single day and did not draw up this attack.",
                },
                historical: false,
                setFlags: { ekaterinodarChoice: "press" },
                gate: (m) => m.manpower >= -4,
                disabledReason: "Pressing a second day against a garrison this size requires an army that can still absorb the losses. This one cannot.",
                impact: { manpower: -3 },
                next: "ekaterinodarAssault18",
                outcome:
                  "The assault continues under a commander who inherited a battle plan he didn't design, against a garrison that outnumbers his own force more than two to one.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of pressing Kornilov's assault.
        // historicalRecord false throughout: nothing about this specific
        // continuation happened. Both choices are speculative; the roll
        // reflects genuine uncertainty about whether pressing further, this
        // outnumbered, this early into an unplanned command, could plausibly
        // gain anything.
        case "ekaterinodarAssault18":
          return {
            date: "APRIL 1918",
            title: "Ekaterinodar: One More Day",
            bulletin: {
              headline: "THE WAR IN THE WEST GOES ON WITHOUT US",
              body: "Germany's spring offensive has been running on the Western Front since 21 March — fifty divisions transferred from the east, freed by the peace Russia signed at Brest-Litovsk three weeks earlier. The Allies are being pushed back toward Amiens by men who were facing Russian guns in November. Every officer in this army understands the arithmetic: the troops now breaking the British Fifth Army are there because Russia left the war. It is the central grievance of the White movement and the reason Allied support for it will exist at all.",
              meanwhile: {
                siberia: "No front here yet. The Czechoslovak Legion is still moving east along the Trans-Siberian under Bolshevik agreement, six weeks from the Chelyabinsk clash that opens this theatre.",
                bolsheviks: "The government has moved the capital from Petrograd to Moscow in March, out of reach of the German advance the peace was supposed to have stopped.",
              },
            },
            historicalRecord: false,
            situation:
              "A second day of assault has gained a foothold on the city's outskirts but nothing resembling a breakthrough. The garrison's numbers haven't meaningfully thinned. Every hour spent pressing is an hour the army isn't using to withdraw in good order while it still can.",
            choices: [
              {
                label: "Press one more day. The foothold gained might be the beginning of something, not the end of it.",
                advisor: {
                  name: "Alekseev",
                  quote:
                    "I have already told you what I think the odds are. I am telling you now that a foothold thrown away a day early is a foothold we never actually get to test the value of.",
                },
                historical: false,
                impact: { manpower: -3 },
                next: "afterEkaterinodar18",
                outcome:
                  "The extra day is spent. Whether it was ever going to turn a foothold into a breakthrough against a garrison this size, nothing in the record settles. The roll does.",
                uncertain: (() => {
                  const paysOffWeight = modWeight(25, meterPct(meters.manpower));
                  return [
                    {
                      weight: paysOffWeight,
                      title: "The foothold expands",
                      setFlags: { secondDayOutcome: "expanded" },
                      impact: { manpower: 3, rail: 2 },
                      outcome:
                        "Against real odds, the extra pressure opens a genuine gap in the garrison's line. It isn't the city falling — but it's enough of a foothold that the eventual withdrawal happens from a stronger position than the assault's second day looked like it would leave.",
                    },
                    {
                      weight: 100 - paysOffWeight,
                      title: "The foothold costs more than it holds",
                      setFlags: { secondDayOutcome: "collapsed" },
                      impact: { manpower: -3 },
                      outcome:
                        "The garrison's numbers simply outlast the pressure. The foothold doesn't expand — it erodes, and the eventual withdrawal happens later and from a worse position than calling it a day earlier would have left.",
                    },
                  ];
                })(),
              },
              {
                label: "Withdraw now. A foothold that hasn't become a breakthrough after two days isn't going to on the third.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I said at the outset I would not spend this army on a city we cannot currently take. Two days of proof that the garrison holds is enough proof. I am not waiting for a third.",
                },
                historical: false,
                impact: { manpower: 2 },
                next: "moscowDirective19",
                outcome:
                  "The withdrawal begins a day later than it would have if the assault had been called off immediately after Kornilov's death — thinner and later than the historical Ice March, but not thinner still for having gambled a third day on a foothold that was never likely to become more than that.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different immediate aftermath
        // depending on whether the foothold expanded or collapsed.
        // historicalRecord false throughout, entirely counterfactual.
        case "afterEkaterinodar18":
          if (flags.secondDayOutcome === "expanded") {
            return {
              date: "APRIL 1918",
              title: "Ekaterinodar: What the Foothold Bought",
              historicalRecord: false,
              situation:
                "The gap in the garrison's line is real, and it's tempting — a genuine opening this army did not have two days ago. It is also the kind of opening a battered, newly-commanded force could easily overreach trying to exploit. Whether to push through it now, while it's real but the army holding it is exhausted, or consolidate the gain and begin the withdrawal from a stronger position than the historical retreat had, is the actual choice this rare piece of good news has created.",
              choices: [
                {
                  label: "Push through the gap now, while it's open. An exhausted army that hesitates may lose the opening entirely.",
                  advisor: {
                    name: "Alekseev",
                    quote:
                      "I did not argue for the extra day so that we could stop the moment it actually worked. The gap is real. Gaps this size do not stay open for commanders who wait to be certain.",
                  },
                  historical: false,
                  setFlags: { footholdChoice: "push_through" },
                  impact: { manpower: -2, rail: 1 },
                  next: "moscowDirective19",
                  outcome:
                    "The push goes through the gap. It is a gamble on an exhausted army — and it is the kind of gamble that, win or lose, this command will still be living with the consequences of a year from now.",
                },
                {
                  label: "Consolidate the gain. Begin the withdrawal now, from a genuinely stronger position than the historical retreat ever had.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I would rather withdraw from a position we actually hold than gamble it chasing more than we have any right to expect an exhausted army to take. The gain is real. I intend to keep it real rather than risk it becoming another overreach.",
                  },
                  historical: false,
                  setFlags: { footholdChoice: "consolidate" },
                  impact: { manpower: 2 },
                  next: "moscowDirective19",
                  outcome:
                    "The withdrawal begins from the strongest position this counterfactual branch has managed — a modest improvement over the historical Ice March's own starting conditions, banked rather than risked on a further push.",
                },
              ],
            };
          }
          return {
            date: "APRIL 1918",
            title: "Ekaterinodar: What the Collapse Cost",
            historicalRecord: false,
            situation:
              "The foothold eroded rather than held, and the third day's losses are worse than the second's. What's left of the assault force now has to withdraw from a genuinely weaker position than even the historical retreat started from — the question is whether to attempt an immediate, urgent withdrawal while any organization remains, or take a day to reorganize first, at the cost of the garrison's continued pressure.",
            choices: [
              {
                label: "Withdraw immediately, disorganized or not. Every additional hour under this pressure costs more than reorganizing would save.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I would rather retreat badly organized than lose more of this army to a garrison that has already proven it can outlast whatever pressure we bring to bear. We go now.",
                },
                historical: false,
                setFlags: { collapseChoice: "immediate_withdrawal" },
                impact: { manpower: -1 },
                next: "moscowDirective19",
                outcome:
                  "The withdrawal happens at once, in worse order than the historical Ice March managed. This counterfactual branch begins its own year of campaign history from a harder starting point than the retreat that happened — a real, compounding cost from a gamble that didn't pay off.",
              },
              {
                label: "Take a day to reorganize first, accepting the continued pressure in exchange for a more orderly withdrawal.",
                advisor: {
                  name: "Alekseev",
                  quote:
                    "I was wrong about the foothold. I am not certain compounding that mistake with a disorganized retreat is the correction it looks like — a day spent reorganizing under pressure is costly, but a retreat that falls apart entirely is costlier still.",
                },
                historical: false,
                setFlags: { collapseChoice: "reorganize_first" },
                impact: { manpower: -3, materiel: -1 },
                uncertain: [
                  {
                    weight: 65,
                    title: "The reorganisation holds and the army gets clear",
                    setFlags: { ekaterinodarSurvival: "extracted" },
                    impact: {},
                    next: "moscowDirective19",
                    outcome:
                      "The extra day under pressure costs more men, and the withdrawal that follows holds together because of it. The army gets clear of Ekaterinodar as an army. Whether the trade was worth it stays unresolved, and this branch carries the question forward into the year still ahead of it.",
                  },
                  {
                    weight: 35,
                    title: "Sorokin's counterattack catches the reorganisation",
                    setFlags: { ekaterinodarSurvival: "destroyed" },
                    impact: { manpower: -3 },
                    next: "endingTheArmyThatDidNotComeBack18",
                    outcome:
                      "The day spent reorganising is the day the garrison uses. Sorokin's forces come out of Ekaterinodar against a force still forming up to leave, and what was a withdrawal becomes a pursuit across open steppe with nothing prepared behind it.",
                  },
                ],
                next: "moscowDirective19",
                outcome:
                  "The order goes out to hold one more day and reorganise before withdrawing, with the garrison still pressing.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // ENDING — April 1918. Until this existed, this campaign's earliest
        // ending was April 1920: two full years in which the Volunteer Army
        // could not actually be destroyed no matter what was done to it. It
        // came far closer than that. historicalRecord false for the
        // destruction; everything describing the real Ice March is documented.
        // ---------------------------------------------------------------------
        // ENDING — the mid-war collapse. Until this existed the campaign had
        // nothing terminal between April 1918 and April 1920, which meant two
        // years of accumulated rail and manpower damage with no consequence
        // attached to it. Reached only by arriving at the Kharkov encirclement
        // with the rail net already wrecked AND choosing to fight it out
        // rather than withdraw — a decision the meters make genuinely
        // unaffordable rather than merely unwise.
        case "endingTheLineThatBroke19":
          return {
            isEnding: true,
            title: "The Line That Broke",
            date: "DECEMBER 1919",
            badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "There is no retreat to the Kuban, no Novorossiysk, and no Crimea, because the army does not get that far as an army. Budyonny's cavalry closes both flanks around Kharkov while this command is still committing its own reserves to the centre, and the encirclement holds. What comes out the other side is not a fighting force conducting a withdrawal — it is columns moving south independently, without a rail net to move them on and without the matériel to fight for the ground they cross.\n\nThe historical AFSR retreated from Kharkov in December 1919 badly, and survived it. The difference here is not the decision at Kharkov alone: it is arriving at that decision with the railways already too degraded to move a reserve, too little matériel to hold a line, and a cavalry arm already spent. The historical army had margin for one bad choice at Kharkov. This one had none, and spent it anyway.\n\nDenikin does not resign at Sevastopol in April, because there is no Sevastopol council to convene — no organised remnant reaches the Crimea to be argued over. Wrangel's Russian Army, the land law, the Northern Tauride, the November evacuation that got a hundred and forty-six thousand people out: none of it happens. The southern front simply ends in Ukraine in the last month of 1919, four months early, and the Red Army turns its full weight east and west a season sooner than the record shows."
          };

        case "endingTheArmyThatDidNotComeBack18":
          return {
            isEnding: true,
            title: "The Army That Did Not Come Back",
            date: "APRIL 1918",
            badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "The Volunteer Army does not survive Ekaterinodar. There is no second campaign, no Moscow Directive, no Orel, no Novorossiysk, and no Crimea — none of it occurs, because the force it would have been fought by is broken on the Kuban steppe in April 1918 by a garrison it should not have spent a third day in front of.\n\nThe real margin here was thin enough that this is not a large counterfactual. Kornilov was killed by a shell at his headquarters at Elizavetinskaya on 13 April 1918; Denikin called off the assault and extracted roughly four thousand men, and the First Kuban Campaign — the Ice March — reached the Don in May with the army intact but barely. Everything the AFSR later became grew from those four thousand. An army that stayed one day longer in front of Sorokin's garrison is not a different army by much. It is the same army, minus the extraction.\n\nWhat follows is what the White movement in south Russia looked like without a Volunteer Army at its centre: Cossack hosts defending their own territory and negotiating separately, German-backed formations in the Ukraine with their own priorities, and no unified command for the Allies to recognise, supply, or blame. Denikin, if he is among the four thousand who do not get clear, does not write the five volumes. There is no Novorossiysk to answer for, and no Bizerte to sail to.\n\nThe war is still won by the same side. It is won faster, against opponents who never combine, and the version of it that gets written afterward has no southern front worth arguing about — which is its own kind of erasure, and not obviously a kinder one than the record the historical army earned.",
          };

        case "moscowDirective19":
          return {
            date: "JULY 1919",
            title: "Tsaritsyn: The Directive",
            bulletin: {
              headline: "FOURTEEN MONTHS OF NEWS, LATE",
              body: "Two items this front's own dispatches have been too consumed by the fighting to properly register. November: an armistice ends the war in Europe — not a victory for either side, and Allied troops remain on Russian soil with no reason for it committed to paper. March: Moscow declares itself the seat of a new Communist International, on the record for carrying revolution past Russia's own borders. No single battle this year has done more to keep Allied funding flowing than that declaration.",
              meanwhile: {
                siberia: "Kolchak's own spring offensive, which briefly reached the Volga in April, has already broken. The Red counteroffensive out of Buguruslan has his armies falling back toward the Urals — the collapse that becomes general by autumn.",
                bolsheviks: "The Eighth Party Congress's internal fight over military policy was formally settled in March by compromise commission. It settled less than the resolution suggests; this southern front, now advancing, is what actually occupies Moscow's attention.",
              },
            },
            historicalRecord: true,
            situation:
              "Tsaritsyn has fallen. In five weeks the AFSR has taken Kharkov, Ekaterinoslav, and now the Volga bastion. The question on every staff officer's desk is what comes next. Wrangel wants the offensive concentrated — mass the cavalry, secure the flanks, advance methodically up the Volga. You are drafting Directive No. 08878." +
              (flags.ekaterinodarSurvival === "extracted"
                ? " This command reached Tsaritsyn a year later than it would have if Ekaterinodar in 1918 had gone differently, and by a harder road — the extra day spent reorganising the withdrawal is still the reason the order of battle behind this directive looks the way it does."
                : ""),
            choices: [
              {
                label: "Issue the broad-front directive: converge on Moscow from Kharkov, Tsaritsyn, and the Don simultaneously.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Every man in this army has dreamed of marching on Moscow since the day the Volunteer Army was founded. We do not have the luxury of a methodical campaign — momentum is the only weapon that has not failed us yet.",
                },
                historical: true,
                setFlags: { directiveIssued: "broad" },
                impact: {},
                next: "kievConvergence19",
                outcome:
                  "The directive goes out on three axes at once. Poltava falls within the month. But the supply lines behind the advance stretch thinner with every mile, and the single-track rail network south of Kursk is already showing signs of strain.",
              },
              {
                label: "Overrule the broad front. Concentrate the cavalry on the Volga axis first, as Wrangel proposes.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Give me every mounted division you can spare and secure Astrakhan on my flank, and I will put fifty thousand sabres somewhere the Red Army cannot ignore. Spread the same men across three fronts and none of them will be strong enough to matter.",
                },
                historical: false,
                setFlags: { directiveIssued: "concentrated" },
                impact: { manpower: 1, materiel: 1, rail: 3 },
                next: "volgaThrust19",
                outcome:
                  "Wrangel gets his concentration order, over open objection from officers who see it as favoring the Caucasus Army's own commander. The advance is slower out of the gate, but the rail lines behind it stay intact.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // NEW round 22 — the "Kiev convergence," a real gap identified in
        // round21 research and only cleared to write once a second
        // independent source (Wikipedia's dedicated "Ukrainian anti-Soviet
        // campaign (1919)" article, corroborating the dedicated "Capture of
        // Kiev by the White Army" article) confirmed the node-grade facts:
        // Bredov's White advance guard and Kravs's/Petliura's UPR corps
        // reached Kiev within hours of each other on 30-31 August 1919, a
        // flag incident during the Ukrainian victory parade produced an
        // exchange of fire, and Bredov's ultimatum forced roughly 3,000
        // Ukrainian troops disarmed and the rest withdrawn 25km west, with
        // negotiated prisoner/weapon exchanges. Only the historical choice
        // below (A) is drawn directly from that record; B and C are
        // plausible alternate command decisions at the same crossroads,
        // consistent with Denikin's and Wrangel's already-documented
        // positions elsewhere in this file, not additional historical
        // claims. downstream continuity in rearSecurity19 reads
        // flags.kievApproach.
        case "kievConvergence19":
          return {
            date: "AUGUST 1919",
            title: "Kiev: Whose Flag",
            historicalRecord: true,
            situation:
              "The broad-front advance has reached Kiev from the south just as Ukrainian People's Republic forces close on it from the west — General Antin Kravs's Galician and Zaporizhzhia corps, some eighteen thousand men under Petliura's overall command, have already skirmished their way into the outskirts and are planning a victory parade for the morning of the 31st. Lieutenant-General Nikolai Bredov's advance guard, roughly six thousand strong, is a day behind them and closing on the same bridges. Two armies that have never coordinated a single operation between them are about to occupy the same city within hours of each other, and nobody on either side has decided what happens when they meet.",
            choices: [
              {
                label: "Let Bredov use his own judgment: enter alongside the Ukrainian parade, then demand Kravs's army disarm and withdraw the moment friction gives grounds for it.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Petliura's government has never been recognized by this command and will not be now, on the strength of a parade. If his troops are inside Kiev when Bredov arrives, they leave Kiev — armed or not, however that has to happen.",
                },
                historical: true,
                setFlags: { kievApproach: "assert_exclusive" },
                impact: {},
                next: "rearSecurity19",
                outcome:
                  "It happens almost exactly as feared. Ukrainian troops marching on Duma Square and Bredov's volunteers entering the city collide within the same hour on the 31st; when Colonel Salsky's men pull down the Russian tricolor someone had raised beside their own flag, a White cavalryman is shot dead in the scuffle that follows. Bredov's ultimatum goes out that afternoon. By evening some three thousand of Kravs's men have been disarmed, and what's left of the Ukrainian force is negotiating a twenty-five-kilometer withdrawal west, under a mutual exchange of prisoners and weapons Bredov didn't have to offer and did anyway. Petliura's army — the one force in the theater that might have kept fighting the Reds alongside this one — is now an enemy instead, exactly the outcome Denikin's own instinct for a unified command has produced at every turn so far.",
              },
              {
                label: "Restrain Bredov. Hold outside the city overnight and negotiate a provisional joint arrangement rather than enter alongside the parade at all.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "We do not have eighteen thousand extra men to spend making a point about whose flag flies over a city hall. Let Kravs have his parade. An army that fights the Reds without us costs this command less than a city that fights us instead.",
                },
                historical: false,
                setFlags: { kievApproach: "provisional_accommodation" },
                impact: { manpower: 1, materiel: -2, rail: -1 },
                next: "rearSecurity19",
                outcome:
                  "Bredov holds his lead elements at the Chain Bridge overnight rather than crossing into the parade. It buys an uneasy standoff instead of a shooting one — no cavalryman dies over a flag, and Kravs's force stays intact rather than being disarmed. It also means none of the roughly three thousand rifles that came with those disarmed men ever reaches AFSR stores, and Denikin's own staff spend the next fortnight arguing with a joint administration over which side's gendarmerie actually runs the city — an argument this command is no better equipped to win than it was to avoid.",
              },
              {
                label: "Preempt entirely. Push Bredov's advance guard forward a day early to deny Kravs's corps the city outright, before any parade can happen.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Whoever is inside the walls when the other side arrives makes the rules for what happens next. I would rather Bredov's men be inside those walls a day early than negotiate anything with a force that got there first.",
                },
                historical: false,
                setFlags: { kievApproach: "preempt" },
                gate: (m) => m.manpower >= -3,
                disabledReason: "An accelerated forced march on Kiev, contesting the approach roads before Kravs's corps completes its occupation, is not something an army already this depleted can mount.",
                impact: { manpower: -4, materiel: 1, rail: 1 },
                next: "rearSecurity19",
                outcome:
                  "Bredov pushes the advance guard forward a day early, forcing the pace along roads Kravs's own corps was still using to close on the city. It costs the column real strength — men and horses spent winning a footrace rather than negotiating one. It also means there is no parade to interrupt and no flag to fight over: the Ukrainian force finds White pickets already on the Chain Bridge and turns west without ever formally entering the city it spent four days marching to reach. Kravs's corps survives intact, at large, and entirely unreconciled to a command that never gave it the chance to negotiate anything.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the speculative Moscow Directive
        // choice. Both choices here are historical:false — there is no "real"
        // resolution to compare against once you're this far into a
        // counterfactual, so historicalRecord is false for the whole node and
        // neither option carries the historical:true flag.
        case "volgaThrust19":
          return {
            date: "AUGUST 1919",
            title: "The Volga: How Far",
            historicalRecord: false,
            situation:
              "Wrangel's concentrated cavalry has done what the broad front never managed — a narrow but unmistakable breakthrough up the Volga axis, with supply lines still largely intact. Denikin's own letters to Kolchak have spoken of a hoped-for junction near Saratov. The question is whether to press that hope now, while the breakthrough is real, or consolidate the gain and accept that a link-up this ambitious was never likely to hold even if reached.",
            choices: [
              {
                label: "Press north toward Saratov, chasing the junction with Kolchak's retreating forces.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I said at Tsaritsyn that concentration would buy us something the broad front couldn't. I did not say it would buy us everything Denikin has been writing to Omsk about. Pressing this far outruns the supply we actually have.",
                },
                historical: false,
                impact: { manpower: -3, rail: -4 },
                next: "volgaOverextension19",
                outcome:
                  "The advance presses north. By the time it's clear Kolchak's own army is already collapsing faster than any junction could reach it, the overextension has cost real ground back at the original breakthrough point.",
              },
              {
                label: "Consolidate the Volga gains rather than chase a junction that was never likely to hold.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A real gain we can hold is worth more than a hoped-for one we cannot. I did not argue for concentration so we could spend the advantage it bought chasing a rendezvous with an army that may not exist by the time we get there.",
                },
                historical: false,
                impact: { manpower: 2, rail: 2 },
                next: "volgaCossackDesertion19",
                outcome:
                  "The gain holds, briefly. It does not change the outcome of the war Kolchak's own campaign is already losing on the other side of this history — but it costs less than the reach for Saratov would have.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of pressing the Volga thrust north.
        // historicalRecord false: this is a real cross-campaign consequence,
        // not an invented one — Kolchak's own retreat past the Urals is
        // already written into Siberia's chain on this same timeline, so an
        // advance chasing his army finds it genuinely wasn't there to find.
        case "volgaOverextension19":
          return {
            date: "SEPTEMBER 1919",
            title: "The Volga: An Empty Rendezvous",
            historicalRecord: false,
            situation:
              "The advance has reached the point where Denikin's letters imagined meeting Kolchak's forces. There is nothing there to meet — Kolchak's own army, on the other side of this same war, is already well past the Urals and still retreating. The overextended line has bought a junction with an army that was never actually going to arrive, and now has to decide how to get itself back before that overextension costs more than the gesture toward Omsk was ever worth.",
            choices: [
              {
                label: "Withdraw immediately, in whatever order can be managed, rather than hold ground that never had a purpose beyond the junction.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I did not argue against this thrust to watch us compound the error by holding the empty end of it a day longer than necessary. Pull back now, while the withdrawal is still a choice rather than something the Reds make for us.",
                },
                historical: false,
                setFlags: { volgaOverextensionChoice: "withdraw_immediate" },
                impact: { manpower: 2 },
                next: "volgaCossackDesertion19",
                outcome:
                  "The withdrawal begins at once. It is not clean — nothing about this thrust was ever going to end clean — but it happens before the overextended position becomes a trap rather than merely an expensive gesture.",
              },
              {
                label: "Hold the position briefly, on the theory that abandoning ground immediately after reaching it looks worse than a short, deliberate pause.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I understand the appeal of not looking like we panicked the moment we discovered the junction was empty. I do not think the appearance of composure is worth the actual exposure it costs to maintain it here, this far from anything resembling support.",
                },
                historical: false,
                setFlags: { volgaOverextensionChoice: "brief_hold" },
                impact: { manpower: -3, rail: -2 },
                next: "volgaCossackDesertion19",
                outcome:
                  "The brief hold costs exactly what holding an exposed, purposeless position costs. The eventual withdrawal happens anyway, from a worse position than an immediate one would have, for the sake of an appearance that doesn't actually survive contact with how thin this line already was.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the Volga-axis consolidation.
        // Deliberately its own node rather than a re-route into
        // cossackDesertion19: that node's prose is written for the
        // Orel-axis retreat specifically ("the retreat from Orel has not
        // stopped at Kursk"), and Wrangel's concentrated cavalry on this
        // branch never went near Orel. Same desertion dynamic, different
        // cause and different command voice reaching it.
        case "volgaCossackDesertion19":
          return {
            date: "NOVEMBER 1919",
            title: "The Volga: Riding for Home",
            historicalRecord: false,
            situation:
              "Wrangel's cavalry never reached Orel and never retreated from it — but the general collapse of the AFSR's central front has left the Volga gains isolated regardless, and the same Cossack units that made the breakthrough possible are now within reach of their own Don and Kuban villages for the first time since the advance began. They are not waiting for orders to go home. Wrangel's own command is watching men who broke the Red center a season ago simply ride south without him." +
              (flags.volgaOverextensionChoice === "brief_hold"
                ? " The brief hold at the empty rendezvous is fresh in every trooper's memory: days spent standing on ground chosen for a junction with an army that was never coming. Men who have just been asked to hold nothing for the sake of appearances are not in a receptive frame of mind about what they are asked to hold next."
                : flags.volgaOverextensionChoice === "withdraw_immediate"
                ? " The withdrawal from the empty rendezvous was ordered the moment it was clear there was nothing there to meet. It cost less than holding would have, and it also confirmed for every Cossack in the column that this command will not spend them on gestures — which is a reputation worth something, though not obviously enough to keep a man from riding home."
                : ""),
            choices: [
              {
                label: "Order the Cossack Hosts held in the line under threat of court-martial for desertion.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Wrangel's axis or the center, it makes no difference — an army that answers to its own province before its own command is not an army I can plan around. Hold them by discipline, wherever the breach opens.",
                },
                historical: false,
                setFlags: { volgaCossackDiscipline: "enforced" },
                impact: {},
                costsCapital: true,
                next: "wrangelsDismissal20",
                outcome:
                  "The order reaches Wrangel's staff the same way it reached the center's — as instruction from a headquarters that no longer controls the ground between itself and the men it's ordering. Whether it holds a single rider in place is a separate question from whether it was issued.",
              },
              {
                label: "Let Wrangel handle it his own way — release the Cossacks formally rather than contest a departure already underway.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I built this axis on their sabres. I am not going to answer their going home with a court-martial order from a command that was never out here with us. Release them, and let what's left of this army be the men who chose to stay.",
                },
                historical: false,
                setFlags: { volgaCossackDiscipline: "released" },
                impact: { manpower: -2 },
                next: "wrangelsDismissal20",
                outcome:
                  "Wrangel releases them himself, ahead of any order from the center — the same substance as the broad front's decision, reached independently, for reasons specific to an axis the rest of the AFSR's command was never present on.",
              },
            ],
          };


        case "rearSecurity19":
          return {
            date: "SEPTEMBER 1919",
            title: "Ukraine: The Insurgent Rear",
            bulletin: {
              headline: "VERSAILLES SETTLES EUROPE. RUSSIA IS NOT IN THE ROOM.",
              body: "The treaty signed at Versailles on 28 June formally ended the war Russia entered in 1914 and left in 1918. No Russian government of any description was represented — not this command, not Omsk, not Moscow. Article 116 voids the Brest-Litovsk treaty outright and obliges Germany to respect the independence of territories that were Russian on 1 August 1914. The borders of the empire this army is fighting to restore are being determined by a conference none of its claimants attended.",
              meanwhile: {
                siberia: "Kolchak\'s front is in general retreat toward the Urals after the failure of the spring offensive; the Allied recognition Omsk was promised in exchange for a commitment to the Constituent Assembly has not materialised in any binding form.",
                bolsheviks: "Moscow was excluded from Versailles entirely and treats its exclusion as confirmation of what the Comintern declared in March — that this order is one to be overturned, not joined.",
              },
            },
            historicalRecord: true,
            situation:
              "Makhno's Revolutionary Insurgent Army has broken out behind the front, striking rail depots and supply columns across the AFSR's rear areas in Ukraine. Every division pulled back to hunt insurgents is a division not advancing on Moscow. Every division left forward is a rail line left undefended." +
              (flags.kievApproach === "assert_exclusive"
                ? " Kiev itself is quiet for the moment — the ultimatum that cleared Petliura's army from the city three weeks ago left this command holding it outright, but also left Makhno's insurgents the one force in this rear area still willing to fight rather than negotiate."
                : flags.kievApproach === "provisional_accommodation"
                ? " Kiev's joint administration is still an open argument, and it is consuming staff time this rear-security crisis can't spare — a second irregular problem competing with Makhno's for attention neither has enough of."
                : flags.kievApproach === "preempt"
                ? " Kiev held without a fight, but the forced march that secured it left the divisions that made it there in no shape to also chase insurgents through this same rear area now."
                : ""),
            choices: [
              {
                label: "Divert two divisions to secure the rear. The advance can afford to slow.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "A line of supply that can be cut at will is not a line of supply. I would rather arrive at Moscow a month late with the army intact than arrive on schedule and starving.",
                },
                historical: false,
                setFlags: { rearSecured: true },
                gate: (m) => m.rail >= -5,
                disabledReason: "Rail capacity too degraded to redeploy two divisions rearward without stripping the front's own supply movement.",
                impact: { manpower: -2, materiel: 2, rail: 3 },
                next: "peregonovka19",
                outcome:
                  "The diversion buys the rail network breathing room, but it is two fewer divisions on the line that matters when the Red counteroffensive begins.",
              },
              {
                label: "Keep every division on the offensive. Accept the losses to rail and supply as the cost of momentum.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Momentum is the one advantage we still hold over an enemy who outnumbers us on every front. Trade it for rear-area policing against irregulars and we have handed Trotsky the only thing he was missing.",
                },
                historical: true,
                setFlags: { rearSecured: false },
                impact: {},
                next: "orelCulmination19",
                outcome:
                  "The offensive continues at full strength. Behind it, insurgent raids on the Ekaterinoslav–Kharkov line go unanswered, and matériel bound for the front sits in depots the rail network can no longer reliably reach.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of diverting divisions to hunt
        // Makhno's insurgents. historicalRecord true: the attempted
        // encirclement near Peregonovka and its outcome are real, regardless
        // of exactly how command handles the moment the trap starts to leak.
        case "peregonovka19":
          return {
            date: "SEPTEMBER 1919",
            title: "Peregonovka: The Trap That Broke",
            historicalRecord: true,
            situation:
              "The diverted divisions have Makhno's exhausted Insurgent Army encircled near the village of Peregonovka after a four-hundred-mile pursuit — by every visible measure this should be a rout in the AFSR's favor. But reports overnight describe unusual movement inside the pocket, and the encircling line, thinned by the pursuit itself, has gaps nobody has had time to reinforce before dawn.",
            choices: [
              {
                label: "Press the attack at dawn as planned. The numerical advantage should close the pocket before Makhno can organize anything.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "We did not divert two divisions from the front to hesitate at the moment they finally have him cornered. Close the ring at first light.",
                },
                historical: true,
                setFlags: { peregonovkaChoice: "press" },
                impact: {},
                next: "orelCulmination19",
                outcome:
                  "The attack presses forward — directly into a counterattack Makhno has been organizing in the dark. The encircling line breaks. What follows is one of the more complete reversals either side manages in this whole campaign: an ammunition depot destroyed, rail lines behind the front severed, and the two divisions diverted to end this problem instead badly mauled by it.",
              },
              {
                label: "Pull the weakest sections of the line back overnight to consolidate, even if it lets part of Makhno's force slip out.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A cornered force that senses weakness in the ring finds it. I would rather close this trap a little later with a line that actually holds than lose the encirclement entirely to a gap we saw and chose not to fix.",
                },
                historical: false,
                setFlags: { peregonovkaChoice: "consolidate" },
                impact: { manpower: 2 },
                next: "makhnosAftermath19",
                outcome:
                  "The consolidation happens overnight. Whether reinforcing the visible gaps holds against a commander whose whole reputation was built on finding the gaps nobody reinforced in time is a real point of uncertainty — the historical record shows what pressing the attack cost. It does not show whether caution would have cost less.",
                uncertain: (() => {
                  const heldWeight = modWeight(35, meterPct(meters.manpower));
                  return [
                    {
                      weight: heldWeight,
                      title: "The consolidated line holds",
                      setFlags: { peregonovkaOutcome: "held" },
                      impact: { manpower: 3, materiel: 2 },
                      outcome:
                        "The reinforced line absorbs the breakout attempt without collapsing outright. It costs the operation its decisive victory — Makhno's force fragments and scatters rather than being destroyed wholesale, but the depot and the rail line behind the front survive intact.",
                    },
                    {
                      weight: 100 - heldWeight,
                      title: "Makhno finds the gap anyway",
                      setFlags: { peregonovkaOutcome: "broke_through" },
                      impact: { manpower: -4, rail: -3 },
                      outcome:
                        "The consolidation isn't enough. Makhno's breakout finds a seam in the reinforced line regardless, and the result is close enough to the historical rout that the caution bought little beyond the illusion of having tried something different.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different content depending on which
        // uncertain outcome the consolidation roll produced. historicalRecord
        // false throughout: downstream of an already-speculative response to
        // a real battle.
        case "makhnosAftermath19":
          if (flags.peregonovkaOutcome === "held") {
            return {
              date: "OCTOBER 1919",
              title: "Peregonovka: What the Depot Bought",
              historicalRecord: false,
              situation:
                "The depot and rail line survived intact — an incomplete success against a commander this front has learned to fear for good reason. Makhno's scattered forces haven't been destroyed, only dispersed, and reports are already coming in of small raiding parties re-forming along the same rail corridor the depot was built to protect. Whether to pursue the scattered remnants while they're weak, or accept the partial win and redirect the effort that pursuit would cost toward the front proper, is a real choice this unusual success has created.",
              choices: [
                {
                  label: "Pursue the scattered remnants. A commander this dangerous left even partially intact tends not to stay that way for long.",
                  advisor: {
                    name: "Wrangel",
                    quote:
                      "We have not actually beaten him. We have inconvenienced him, and a man with his record does not stay inconvenienced. I would rather spend the effort finishing this now than explain, in three months, why we let him reconstitute.",
                  },
                  historical: false,
                  setFlags: { makhnoPursuit: "pursued" },
                  impact: { manpower: -2, rail: 1 },
                  next: "orelCulmination19",
                  outcome:
                    "The pursuit goes out after the scattered remnants. It costs effort the front proper could have used — and it is, in its way, an acknowledgment that the depot's survival was never the same thing as Makhno's defeat.",
                },
                {
                  label: "Accept the partial win. Redirect the effort toward the front rather than chase scattered raiders.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I did not commit divisions to this operation to spend more of them chasing raiders through country we do not fully control. The depot held. That is the result we can actually use, and I intend to use it where it matters most right now.",
                  },
                  historical: false,
                  setFlags: { makhnoPursuit: "not_pursued" },
                  impact: { manpower: 2, materiel: -1 },
                  next: "orelCulmination19",
                  outcome:
                    "The effort redirects to the front instead. Makhno's scattered forces are left to reconstitute on their own schedule — a deferred cost, traded for resources the actual crisis at Orel needs more urgently right now.",
                },
              ],
            };
          }
          return {
            date: "OCTOBER 1919",
            title: "Peregonovka: Counting What's Left",
            historicalRecord: false,
            situation:
              "The breakout found its gap regardless of the consolidation, and what follows is close enough to the historical rout that the difference barely registers on the ledger — the depot damaged, the rail line behind the front cut, the two divisions diverted to end this problem instead mauled by it. The question now isn't whether this was a defeat. It's whether the divisions that survived it are still capable of contributing to the front, or whether they need to be written off as combat-ineffective for the near term.",
            choices: [
              {
                label: "Commit what's left of the divisions to the front regardless of their condition. There isn't time to wait for them to recover.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I know exactly what condition they're in. Orel is not going to wait politely for them to recover from it, and I will not let a defeat we already paid for cost us the divisions on top of the depot.",
                },
                historical: false,
                setFlags: { makhnoAftermathChoice: "commit_regardless" },
                impact: { manpower: -2 },
                next: "orelCulmination19",
                outcome:
                  "The divisions go to the front under strength, still absorbing what Peregonovka cost them. It is not the reinforcement the front needed — it is what's actually available, sent anyway, because the alternative was sending nothing.",
              },
              {
                label: "Write them off as combat-ineffective for now. Rebuild before committing them rather than compound the loss.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Sending divisions this mauled into the next fight does not make them useful sooner. It makes the next defeat theirs as well, on top of this one. I would rather have fewer effective divisions at Orel than the same number in name only.",
                },
                historical: false,
                setFlags: { makhnoAftermathChoice: "rebuild_first" },
                impact: { manpower: 1, materiel: -1 },
                next: "orelCulmination19",
                outcome:
                  "The divisions are held back to rebuild rather than committed under strength. The front proceeds to Orel without them — one more piece of the campaign's overall strength that Peregonovka's actual cost, not just its narrated outcome, has quietly removed from the board.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "orelCulmination19":
          return {
            date: "OCTOBER 1919",
            title: "Orel: The Culmination",
            bulletin: {
              headline: "THE REPUBLIC'S WORST MONTH",
              body: "By most later accounts, this month is the closest the Soviet government comes to losing the war outright — not on one front but three, in the same few weeks, by circumstance rather than by any coordination between the White commands.",
              meanwhile: {
                siberia: "Kolchak's spring offensive, which briefly reached the Volga in the west, has been reversed entirely. His armies are falling back toward Omsk with no defensive line holding, in a retreat that will not really stop until Chita, a year and two thousand miles later.",
                bolsheviks: "General Yudenich's separate White army has reached the outskirts of Petrograd itself — close enough that the city's fall was treated inside the Council of People's Commissars as a genuine possibility, not a remote one. Trotsky personally organizes the city's defense.",
              },
            },
            historicalRecord: true,
            context:
              "Orel is 250 miles from Moscow. The AFSR has advanced roughly 400 miles in four months on an offensive that began at Tsaritsyn in June, and its line now runs some 700 miles from Kiev to Tsaritsyn, held by fewer than 100,000 combat effectives. The Red Southern Front opposing it has been reorganized under Alexander Yegorov, with Stalin as its senior political member, and is concentrating a strike group south of Orel — Latvian riflemen, a Estonian brigade, and Primakov's cavalry — specifically to cut the salient at its base rather than meet it head-on.",
            situation:
              "Orel has fallen — two hundred miles from Moscow, the deepest the Volunteer Army will ever reach. The Red Southern Front has been reorganized under new command and is throwing everything it has into a counteroffensive. Kuban Cossack officers are asking, openly now, whether they are fighting for Moscow or for Denikin's Moscow." +
              (flags.directiveIssued === "broad"
                ? " Orel was reached on three axes at once, which is why it was reached at all and why there is nothing concentrated anywhere to hold it with."
                : "") +
              (flags.peregonovkaChoice === "press"
                ? " The divisions that pressed the attack at Peregonovka arrived here already spent, and are the ones now being asked to hold the furthest point of the advance."
                : flags.peregonovkaChoice === "consolidate"
                ? " Consolidating at Peregonovka kept these divisions in better condition than they would otherwise be. It also let a portion of Makhno's force out of the pocket, and the rear behind Orel has been feeling it since."
                : "") +
              (flags.makhnoAftermathChoice === "commit_regardless"
                ? " The divisions mauled at Peregonovka were sent forward without rebuilding, and they are here, under strength, counted in the order of battle at full value."
                : flags.makhnoAftermathChoice === "rebuild_first"
                ? " The divisions mauled at Peregonovka were written off as combat-ineffective and held back to rebuild. They are not here, and the formations that are have absorbed their share of the front accordingly."
                : ""),
            choices: [
              {
                label: "Order the Kornilov Division to hold Orel at all costs. No withdrawal.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "We did not come two hundred miles to give it back without a fight. Hold Orel and the whole character of this war changes.",
                },
                historical: true,
                setFlags: { orelHeld: "attempted" },
                impact: {},
                aftermath:
                  "Orel was retaken by the Red Army on 20 October 1919, eight days after it fell. The Kornilov Division — one of the AFSR's four named 'coloured' regiments and among its most reliable formations — was badly cut up holding it. Neither the Volunteer Army nor any other White force came closer to Moscow at any point in the war. The line from Orel to the Black Sea did not stabilise again.",
                costsCapital: true,
                next: "cossackDesertion19",
                outcome:
                  "The order to hold is given. What happens at Orel over the following two weeks is the actual hinge of the whole campaign — written next.",
              },
              {
                label: "Order a fighting withdrawal to the Kursk–Kharkov line instead. Preserve the army over the ground.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Ground we can retake. An army we cannot. Hold Orel with exhausted troops against a rested counteroffensive and you will lose both the city and the men in it.",
                },
                historical: false,
                setFlags: { orelHeld: "withdrawn" },
                impact: { manpower: 1, rail: 1 },
                aftermath:
                  "No fighting withdrawal from Orel was ordered historically; the city was held and lost. What the record does show is what happened to the AFSR's retreats once they began without prepared positions behind them — the withdrawal from Kharkov in December and the retreat to Novorossiysk in March both degraded from ordered movement into something closer to rout within weeks. A withdrawal ordered early is betting that this one would behave differently.",
                next: "kharkovLine19",
                outcome:
                  "The withdrawal order goes out over Denikin's private reservations. Whether an orderly fighting withdrawal is something exhausted, badly-coordinated Cossack and Volunteer units can actually execute under counteroffensive pressure — as opposed to sliding into the kind of rout that historically overtook the retreat months later at Novorossiysk — is disputed among historians of the campaign; the roll stands in for their disagreement.",
                // Round 23: was two independent modWeight(X, 50) literals
                // that only summed to 100 by coincidence of both hardcoding
                // the same neutral meterValue. Rewritten to the shared-
                // variable/complement pattern used everywhere else in this
                // file, so the two outcomes stay complementary once the
                // meterValue argument is actually live.
                uncertain: (() => {
                  const holdsWeight = modWeight(55, meterPct(meters.manpower));
                  return [
                    {
                      weight: holdsWeight,
                      title: "The withdrawal holds together",
                      setFlags: { withdrawalOutcome: "orderly" },
                      impact: { manpower: 2, rail: 1 },
                      outcome:
                        "The line falls back to Kursk in reasonable order. It costs ground, not the army — a rare piece of good news amid a campaign running out of it.",
                    },
                    {
                      weight: 100 - holdsWeight,
                      title: "The withdrawal frays",
                      setFlags: { withdrawalOutcome: "disorderly" },
                      impact: { manpower: -3, materiel: -1 },
                      outcome:
                        "Coordination between the Volunteer divisions and the Cossack rearguard breaks down within days. What was meant to be an orderly fallback becomes, in places, indistinguishable from the retreat Wrangel was trying to avoid.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of withdrawing from Orel rather than
        // holding it. historicalRecord false throughout: this is what the
        // preserved-but-battered army does next, not a real recorded event.
        case "kharkovLine19":
          return {
            date: "DECEMBER 1919",
            title: "Kharkov: A Line That Might Hold",
            historicalRecord: false,
            situation:
              "The army that survived the withdrawal from Orel is bruised but intact, falling back toward Kharkov and Kursk with its cavalry still largely together. Whether that's enough to stop the Red advance here, rather than simply postpone it, is unclear — the rear-area insurgency and the Cossacks' own war-weariness were never contingent on what happened at Orel specifically, and neither has gone away." +
              (flags.rearSecured === true
                ? " The two divisions diverted to the rear earlier in the autumn are the reason the Ekaterinoslav–Kharkov line is still carrying matériel at all. They are also two divisions not in front of Budyonny now."
                : flags.rearSecured === false
                ? " Nothing was ever diverted to secure the rear, and the supply line behind this position has been cut and repaired often enough that its capacity is now a guess rather than a figure."
                : ""),
            choices: [
              {
                label: "Commit the preserved cavalry to a real defensive stand at the Kharkov-Kursk line.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "We preserved this army specifically so it would still be capable of a fight when it mattered. If Kharkov is not where it matters, I do not know what would qualify — but I will not pretend the rear-area problems that were never about Orel have solved themselves in the meantime.",
                },
                historical: false,
                setFlags: { kharkovLine: "stand" },
                impact: { manpower: -3, rail: 2 },
                next: "kharkovEncirclement19",
                gate: (m) => m.manpower >= -3 && m.materiel >= -5,
                disabledReason: "A set-piece defensive stand needs both an army capable of standing and the shells to hold with — this command is short of one or both.",
                outcome:
                  "The stand is made. It buys real time — weeks the historical retreat didn't have — before the broader collapse catches up with the line anyway.",
              },
              {
                label: "Continue the withdrawal further south rather than commit to another costly stand.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have watched this army spend itself on lines that were never going to hold indefinitely. Preserving the army a second time, rather than spending it again on a position I am not convinced we can actually keep, is not cowardice. It may be the only strategy left that hasn't already failed once.",
                },
                historical: false,
                setFlags: { kharkovLine: "withdraw" },
                impact: { manpower: 3, materiel: 1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The withdrawal continues without a stand at Kharkov. More of the army reaches the eventual Crimean evacuation intact — at the cost of every mile of Ukraine given up without a fight, and everything that implies about the campaign's remaining credibility.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of standing at Kharkov. historical-
        // Record true: this is where the speculative "preserved army" thread
        // rejoins the real December 1919 Kharkov operation — real numbers
        // (roughly 47,000 White infantry and 23,000 cavalry against 58,000
        // Red infantry and 13,000 cavalry, per Soviet Southern Front
        // records), real commanders, and the real, documented dynamic: it
        // was specifically the threat of encirclement, not simple weight of
        // numbers, that broke the historical defense and turned an orderly
        // withdrawal into a disorderly one.
        case "kharkovEncirclement19":
          return {
            date: "DECEMBER 1919",
            title: "Kharkov: The Threat of the Ring",
            historicalRecord: true,
            situation:
              "The line is holding against direct pressure — but Budyonny's cavalry and the 14th Army under Uborevich are maneuvering around both flanks, exactly the encirclement that broke the historical defense here regardless of how hard the center held. The choice isn't whether the line can take another day of frontal pressure. It's whether to commit the preserved cavalry to breaking the flanking threat before the ring closes, or accept the historical logic and withdraw while the door is still open." +
              (flags.withdrawalOutcome === "orderly"
                ? " The withdrawal from Orel held together, which is the only reason there is a coherent line here to be flanked rather than a rout already in progress."
                : flags.withdrawalOutcome === "disorderly"
                ? " The withdrawal from Orel came apart on the way here. The line holding against frontal pressure is doing so with units that arrived out of order and have not been fully sorted since."
                : ""),
            choices: [
              {
                label: "Commit the cavalry to strike Budyonny's flanking force directly, betting on breaking the encirclement before it closes.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A ring that never closes is not a ring. If we can break the force forming it before the flanks meet, we have not merely held Kharkov — we have taken the initiative away from the one commander on that side who has consistently had it. I do not think the odds are good. I think they are worth taking.",
                },
                historical: false,
                setFlags: { kharkovEncirclementChoice: "counterattack" },
                // The counterattack is survivable with a functioning rear.
                // Without one it is where the campaign ends.
                // Thresholds set from measured distributions at this node:
                // manpower reaches -6 at the low end, materiel similarly. Rail is
                // NEVER negative here (measured min +2), so gating on rail made
                // this ending literally unreachable.
                // Single axis, deliberately. A compound AND across two axes made
                // this unreachable in 6000 simulated runs: the gate above already
                // requires manpower >= -4 to select, and southRussia materiel only
                // moves 9 times in the whole campaign, so it rarely reaches -3.
                // This choice costs 4 manpower, so post-choice <= -6 is reachable
                // from any pre-choice value of -2 or worse.
                nextIf: (m) => (m.manpower <= -6 ? "endingTheLineThatBroke19" : null),
                impact: { manpower: -4 },
                next: "afterTheCavalryStrike19",
                gate: (m) => m.manpower >= -4,
                disabledReason: "committing cavalry to a deliberate strike requires a force that can still absorb the loss of one — this command's manpower is already too depleted to risk it.",
                outcome:
                  "The counterattack goes in against Budyonny's own cavalry — arguably the single most dangerous force on the entire Southern Front to have picked this fight with. Whether striking first breaks the encirclement, or simply spends the preserved cavalry against the one Red formation built and commanded specifically to win exactly this engagement, the record does not settle. The dice carry it.",
                uncertain: (() => {
                  const breaksWeight = modWeight(25, meterPct(meters.manpower));
                  return [
                    {
                      weight: breaksWeight,
                      title: "The flanking force is genuinely disrupted",
                      setFlags: { kharkovEncirclementOutcome: "disrupted" },
                      impact: { manpower: 2, rail: 3 },
                      outcome:
                        "Against real odds, the strike catches Budyonny's formation still maneuvering into position and buys a measurable delay. Kharkov doesn't hold indefinitely — nothing was ever going to make it hold indefinitely — but the withdrawal that eventually follows happens on this army's own schedule, not one forced by a closing ring.",
                    },
                    {
                      weight: 100 - breaksWeight,
                      title: "Budyonny's cavalry does exactly what it is built to do",
                      setFlags: { kharkovEncirclementOutcome: "routed" },
                      impact: { manpower: -3, rail: -2 },
                      outcome:
                        "The counterattack meets a cavalry force that has broken every White formation it has faced this autumn, and does so again. What follows is close to the historical record's own description of what happens after Kharkov falls: an orderly retreat becoming a disorderly one, with less of the army intact to make it than the historical timeline had.",
                    },
                  ];
                })(),
              },
              {
                label: "Withdraw now, while the flanks haven't closed, rather than gamble the preserved cavalry on breaking them.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have already said what I think of spending this army further on ground I am not convinced we can keep. I think that argument applies with more force, not less, when the enemy doing the threatening is the one cavalry commander on that front who has not yet been wrong about what he can actually accomplish.",
                },
                historical: true,
                setFlags: { kharkovEncirclementChoice: "withdraw_early" },
                impact: {},
                next: "wrangelsDismissal20",
                outcome:
                  "The withdrawal begins before the ring closes — matching, in substance, what the historical record shows actually happened: the threat of encirclement, not a battle lost outright, is what ends the defense of Kharkov. The city falls on schedule, in mid-December. The army that pulls back from it is bruised rather than shattered, which is the whole reason this branch preserved it in the first place.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the cavalry strike against
        // Budyonny, genuinely different content depending on which uncertain
        // outcome the roll produced. historicalRecord false throughout: this
        // whole thread is counterfactual from kharkovLine19 onward, but the
        // choice here is shaped by real, earned consequences of the roll
        // rather than converging on identical content regardless of outcome.
        case "afterTheCavalryStrike19":
          if (flags.kharkovEncirclementOutcome === "disrupted") {
            return {
              date: "DECEMBER 1919",
              title: "Kharkov: A Withdrawal on Its Own Schedule",
              historicalRecord: false,
              situation:
                "The disrupted flanking force has bought something rare in this whole campaign: a withdrawal happening on this army's own timeline rather than one forced by a closing ring. The cavalry that won that delay is spent and needs weeks it may not get before it's fit for another engagement. Whether to give it those weeks, at the cost of momentum in the wider retreat, or fold it back into the line under strength, is a real choice this unusual breathing room has actually created.",
              choices: [
                {
                  label: "Give the cavalry the recovery time. A force this depleted committed too soon is a force wasted twice.",
                  advisor: {
                    name: "Wrangel",
                    quote:
                      "We spent this cavalry to buy exactly this kind of choice — the ability to decide our own pace instead of having Budyonny decide it for us. I would rather use the time we bought than spend it proving we didn't actually need it.",
                  },
                  historical: false,
                  setFlags: { cavalryRecovery: "granted" },
                  impact: { manpower: 2 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "The recovery time is given. The wider retreat moves without its strongest cavalry component for several weeks — a cost paid deliberately, for a formation that reaches Novorossiysk in better condition than it would have otherwise.",
                },
                {
                  label: "Fold it back into the line under strength. The wider retreat can't afford to wait on any single formation's recovery.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I understand what that cavalry bought us. I am not convinced the rest of this retreat can afford to pay it back in weeks we may not actually have before the next crisis this war hands us.",
                  },
                  historical: false,
                  setFlags: { cavalryRecovery: "denied" },
                  impact: { manpower: -1, rail: 1 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "The cavalry returns to the line under strength, its rare breathing room spent almost as soon as it was won. The wider retreat moves faster for it — at the cost of a formation that never quite recovers what the strike against Budyonny cost it.",
                },
              ],
            };
          }
          return {
            date: "DECEMBER 1919",
            title: "Kharkov: What the Cavalry Cost",
            historicalRecord: false,
            situation:
              "Budyonny's cavalry did what it was built to do, and what's left of the formation that struck at it is not fit to fight again soon. The retreat toward Novorossiysk now has a real gap where a cavalry screen should be — the same kind of exposure Peregonovka and Chelyabinsk have already shown what happens when reconnaissance and flank cover simply aren't there. Whether to slow the whole retreat to compensate, or accept the exposure and press on at the pace the broader collapse already demands, is the actual choice left by a gamble that didn't pay off.",
            choices: [
              {
                label: "Slow the retreat to compensate for the missing cavalry screen, even though time is exactly what this army doesn't have.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Slowing down against an enemy who has no intention of slowing down is one kind of expensive. Marching past a cavalry force we have just proven we cannot outfight, blind, with no screen, is a different and worse kind. I know which one I am choosing.",
                },
                historical: false,
                setFlags: { cavalryLossResponse: "slow_down" },
                impact: { manpower: -1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The retreat slows to compensate for the gap. It is a partial hedge against the exposure — and it spends time this army was already running out of before this gamble cost it a cavalry screen on top of everything else.",
              },
              {
                label: "Press on at the pace the collapse already demands. There isn't a version of this retreat that has time to spare regardless.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I will not pretend the exposure is acceptable. I will say that a retreat which slows itself down every time something goes wrong was never going to reach the coast in any condition worth calling an army, and something has been going wrong in this war for months.",
                },
                historical: false,
                setFlags: { cavalryLossResponse: "press_on" },
                impact: { manpower: -2, rail: -1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The retreat presses on without compensating for the gap. The exposure the missing cavalry screen created doesn't produce a specific new disaster before reaching Novorossiysk — but it's one more accumulated cost on an army that has been absorbing them since well before Kharkov, on top of whatever this specific gamble already took from it.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "cossackDesertion19":
          return {
            date: "NOVEMBER 1919",
            title: "The Don: Going Home",
            historicalRecord: true,
            situation:
              "The retreat from Orel has not stopped at Kursk. As it passes back through Don and Kuban territory, whole Cossack units are simply leaving the line — not mutinying, not surrendering, just riding home to defend their own farms and villages now that the front has come to them. The Volunteer Army divisions still in the line are asking why they should hold ground the Cossacks themselves have abandoned.",
            choices: [
              {
                label: "Order the Cossack Hosts held in the line under threat of court-martial for desertion.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "An army where each contingent fights only for its own province is not an army — it is an alliance of convenience, and alliances of convenience dissolve at the first serious pressure. I would rather hold them by discipline than lose the line by their absence.",
                },
                historical: true,
                setFlags: { cossackDiscipline: "enforced" },
                impact: {},
                costsCapital: true,
                next: "wrangelsDismissal20",
                outcome:
                  "The order is issued. Whether it stops a Cossack rider from turning his horse toward the Don when the front is his own front now is a separate question from whether the order was given.",
              },
              {
                label: "Formally release Cossack units to defend their home territories, folding it into the operational plan.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "They are leaving whether we authorize it or not. The only choice left to us is whether that departure happens as a coordinated withdrawal we can still direct, or as the kind of collapse that takes the men still willing to fight with it.",
                },
                historical: false,
                setFlags: { cossackDiscipline: "released" },
                impact: { manpower: -3 },
                next: "kubanCoup19",
                outcome:
                  "The release is formalized rather than fought. The line gets thinner by the same number of men either way — but the army that remains knows its command told them the truth about what was happening, rather than issuing an order everyone could see would not hold.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of formally releasing Cossack units
        // rather than disciplining them. The leniency emboldens exactly the
        // autonomy movement Denikin already distrusted.
        case "kubanCoup19":
          return {
            date: "NOVEMBER 1919",
            title: "Ekaterinodar: The Rada's Price",
            historicalRecord: true,
            situation:
              "The concession at the front has emboldened the Kuban Rada's separatist Black Sea faction to move faster than anyone expected — open talk of a separate peace, a delegation already treating with Ukraine's government as though the Rada were its own state. General Pokrovsky has surrounded the Rada's chambers with troops and demanded the surrender of the faction's leaders, Alexei Kalabukhov chief among them, on charges of treason. Wrangel is present and has made his approval of the move plain.",
            choices: [
              {
                label: "Let the coup proceed. Kalabukhov and the Black Sea faction's leaders are handed over for court-martial.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I said releasing them from the line rather than disciplining them would cost us something. It cost us exactly this — a Rada that believed leniency meant we had lost the authority to answer a coup with force. We have not.",
                },
                historical: true,
                setFlags: { kubanCoup: "proceeds" },
                impact: {},
                costsCapital: true,
                next: "kubanRadaReorganized19",
                outcome:
                  "Kalabukhov is hanged on November 7, a sign reading 'For treason to the Motherland and Cossackdom' left on his chest. The Rada is reorganized under Denikin loyalists. It does not restore the trust the earlier leniency was meant to buy — a considerable portion of the Kuban Cossacks still in the army's ranks do not forgive this either.",
              },
              {
                label: "Overrule Pokrovsky. Negotiate with the Rada's separatist faction rather than crush it by force.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have spent this entire campaign arguing that a unified command cannot tolerate a private peace negotiated behind its back. Say it now, after already choosing leniency once, and it reads as inconsistency rather than principle. I am honestly not certain the reading is wrong.",
                },
                historical: false,
                setFlags: { kubanCoup: "negotiated" },
                impact: { manpower: 1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The coup is called off. Whether genuine tolerance of Kuban autonomy, this late and this inconsistently applied, holds the coalition together better than Pokrovsky's crackdown did is a real question — the historical record shows what the crackdown cost. It does not show whether the alternative would have cost less — so that half is rolled.",
                uncertain: (() => {
                  const holdsWeight = modWeight(35, meterPct(meters.manpower));
                  return [
                    {
                      weight: holdsWeight,
                      title: "The coalition actually holds",
                      setFlags: { kubanNegotiationOutcome: "holds" },
                      impact: { manpower: 2 },
                      outcome:
                        "The Rada's separatist faction, taken seriously rather than crushed, actually stands down. It is a rare moment where restraint reads as strength rather than weakness — though how long it lasts, with the broader retreat still coming, is its own open question.",
                    },
                    {
                      weight: 100 - holdsWeight,
                      title: "The faction reads restraint as an opening, not a concession",
                      setFlags: { kubanNegotiationOutcome: "emboldened" },
                      impact: { manpower: -3 },
                      outcome:
                        "The negotiated tolerance doesn't hold. Emboldened rather than reassured, the separatist faction pushes further — exactly the outcome Denikin's own private reservations about inconsistency warned this choice risked.",
                    },
                  ];
                })(),
              },
              {
                label: "Go further than Pokrovsky asked to go. Dissolve the Rada outright and skip the court-martial — have them shot.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "You are describing exactly what Pokrovsky proposed to me directly, and exactly what your own commander-in-chief told him in person he would not permit. I am not going to pretend I heard that instruction if you are asking me to help you overrule it a second time.",
                },
                historical: false,
                setFlags: { kubanCoup: "dissolved_outright" },
                impact: { manpower: -2 },
                next: "wrangelsDismissal20",
                outcome:
                  "Denikin's own memoir records the version of this that actually happened: Pokrovsky asked for exactly this — a coup, dissolution, arrests, shootings without trial — and was told directly and personally that it would not be permitted. Here, it is permitted. There is no Rada left to reorganize, loyalist or otherwise, because there is no Rada left. What replaces it in the Kuban districts, for the rest of this war, is a military administration answering to nobody the Cossacks themselves elected, and the manpower cost of that is not a one-time figure — it compounds through every subsequent request this command makes of a people who no longer have a body to make requests through.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the Kalabukhov hanging and Rada
        // reorganization. historicalRecord false: this is what the
        // reorganized body's actual reliability looks like in practice, not
        // a documented event — but grounded in the real, well-established
        // pattern that installed loyalist bodies of this kind frequently
        // proved compliant on paper while doing little to actually deliver
        // the Cossack manpower and cooperation the reorganization was meant
        // to secure.
        case "kubanRadaReorganized19":
          return {
            date: "DECEMBER 1919",
            title: "Ekaterinodar: A Rada That Says Yes",
            historicalRecord: false,
            situation:
              "The reorganized Rada, purged of its separatist faction and staffed with Denikin loyalists, votes exactly as asked at every session. Mobilization orders for the Kuban Host go out through it without formal objection. Whether that formal compliance is translating into Cossack units actually reporting for duty, rather than simply a body that says yes while its own constituency quietly doesn't, is a separate question command hasn't yet tested directly." +
              (flags.kubanCoup === "proceeds"
                ? " Kalabukhov was hanged in November with a placard on his chest. The men now voting yes attended that, and so did the constituency they answer to."
                : flags.kubanCoup === "negotiated"
                ? " The Rada was reorganized without a hanging, which leaves its loyalist majority holding its seats by arrangement rather than by fear. Whether that makes their compliance worth more or simply easier to withdraw is untested."
                : ""),
            choices: [
              {
                label: "Test it directly. Order the reorganized Rada to deliver a specific mobilization quota within the month.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A Rada that votes correctly and a Host that actually reports for duty are not the same thing, and I would rather find out which one we have now than discover the gap once we're depending on it at the front.",
                },
                historical: false,
                setFlags: { kubanQuotaTest: "ordered" },
                impact: { manpower: -1 },
                next: "kubanQuotaAftermath19",
                outcome:
                  "The quota is set and the answer comes back within weeks: the reorganized Rada's compliance was real on paper and considerably thinner in the villages asked to supply the men. It isn't outright refusal — it's the kind of quiet shortfall that doesn't announce itself as defiance but adds up the same way.",
                uncertain: (() => {
                  const deliversWeight = modWeight(30, meterPct(meters.manpower));
                  return [
                    {
                      weight: deliversWeight,
                      title: "The quota is substantially met",
                      setFlags: { kubanQuotaOutcome: "met" },
                      impact: { manpower: 3 },
                      outcome:
                        "Against the more cynical expectation, the reorganized body's authority turns out to carry real weight in the villages after all — the mobilization quota comes in close to what was asked.",
                    },
                    {
                      weight: 100 - deliversWeight,
                      title: "The quota falls well short",
                      setFlags: { kubanQuotaOutcome: "shortfall" },
                      impact: { manpower: -4 },
                      outcome:
                        "The quota comes in at a fraction of what was ordered. The Rada's compliance, it turns out, extended exactly as far as the vote and no further — the villages it nominally speaks for were never actually asked, and don't especially feel bound by an answer given on their behalf.",
                    },
                  ];
                })(),
              },
              {
                label: "Don't test it. A demand that exposes the gap is worse than an untested assumption that the arrangement is working.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Not asking the question is its own kind of answer, and I know it. I would still rather retreat with an untested arrangement than retreat having proven, formally and on the record, that the Kuban no longer actually supplies this army.",
                },
                historical: false,
                setFlags: { kubanQuotaTest: "avoided" },
                impact: {},
                next: "wrangelsDismissal20",
                outcome:
                  "No quota is set, no gap is formally exposed. Whatever the reorganized Rada's authority is worth in the villages remains untested — which means it also remains, for now, whatever anyone still needs to believe it is.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different content depending on
        // whether the mobilization quota was actually met. historicalRecord
        // false throughout.
        case "kubanQuotaAftermath19":
          if (flags.kubanQuotaOutcome === "met") {
            return {
              date: "JANUARY 1920",
              title: "Ekaterinodar: A Body Worth Trusting, Maybe",
              historicalRecord: false,
              situation:
                "The quota came in close to what was asked — a surprise, and one that raises its own question. Does the reorganized Rada's demonstrated authority mean it's worth relying on for further requests as the retreat continues, or was this one quota an exception that a second, harder demand won't repeat?" +
                (flags.kubanQuotaTest === "ordered"
                  ? " The quota was ordered deliberately to find this out rather than assumed, which means the answer is now on the record where every other regional body can read it too."
                  : ""),
              choices: [
                {
                  label: "Press a second, larger request while the arrangement is proving itself. Test the ceiling, not just the floor.",
                  advisor: {
                    name: "Wrangel",
                    quote:
                      "One quota met tells us the arrangement can work. It does not tell us how far it stretches, and I would rather find that limit now, while we still have some choice in the timing, than discover it later when we don't.",
                  },
                  historical: false,
                  setFlags: { kubanSecondRequest: "pressed" },
                  impact: { manpower: 2 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "The second request goes out, larger than the first. Whether the reorganized Rada's real authority extends this far is a question this decision has now forced into the open a second time, sooner than the arrangement had necessarily earned the right to be tested again.",
                },
                {
                  label: "Don't press further. One successful quota is a real result — spending it testing for a ceiling risks losing what was actually gained.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I would rather bank one genuine success than risk it chasing a second that may simply prove the first was luck rather than a working arrangement. We can test the ceiling later, if there's a later left to test it in.",
                  },
                  historical: false,
                  setFlags: { kubanSecondRequest: "not_pressed" },
                  impact: { manpower: 2 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "No second request follows. The one genuine success stands on its own, untested further — a modest gain banked rather than risked on a ceiling nobody can currently be certain is there.",
                },
              ],
            };
          }
          return {
            date: "JANUARY 1920",
            title: "Ekaterinodar: The Gap on the Record",
            historicalRecord: false,
            situation:
              "The shortfall is now formally documented — the reorganized Rada asked for men it could not deliver, and everyone from Ekaterinodar to the front knows it. Whether to discipline the Rada's leadership publicly for the failure, or quietly absorb the shortfall and avoid a second confrontation this army can't currently afford, is the real choice a documented failure has now created.",
            choices: [
              {
                label: "Discipline the Rada's leadership publicly. A quota this badly missed can't go unaddressed without teaching every other body watching that quotas are optional.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I understand the argument for quiet absorption. I do not think it survives contact with every other regional body currently deciding whether its own quotas are enforceable, based entirely on what happens to this one.",
                },
                historical: false,
                setFlags: { kubanShortfallResponse: "disciplined" },
                impact: { manpower: -1 },
                costsCapital: true,
                next: "wrangelsDismissal20",
                outcome:
                  "The discipline is public. It answers the question of whether quotas are enforceable — at a cost, measured in exactly the kind of Cossack resentment this whole reorganization was supposed to be moving past rather than compounding.",
              },
              {
                label: "Absorb the shortfall quietly. A second confrontation with the Kuban isn't one this retreat can currently afford.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Letting this go unanswered teaches every other body watching exactly the wrong lesson. It teaches it anyway. A second open confrontation with the Kuban, on top of everything this retreat is already managing, is a point I do not currently have the army left to afford making.",
                },
                historical: false,
                setFlags: { kubanShortfallResponse: "absorbed" },
                impact: { manpower: 1, materiel: -1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The shortfall is absorbed without public consequence. It costs nothing immediate — and it teaches every other body watching exactly the lesson Wrangel warned it would, quietly, without anyone having to say so directly.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "novorossiysk20":
          return {
            date: "MARCH 1920",
            title: "Novorossiysk: The Ships",
            historicalRecord: true,
            situation:
              "The retreat has run out of road. Over a hundred thousand troops, Cossacks, and civilian refugees are crowded into Novorossiysk with the Red Army days away, and the British have told you plainly that their ships can carry perhaps five or six thousand people at a time. Kutepov's evacuation commission has to decide, in practice, who those ships are for — there is no version of this that gets everyone out." +
              (flags.cossackDiscipline === "enforced"
                ? " The court-martial order issued against the departing Cossack Hosts is still nominally in force. It is being enforced by nobody, against men who are standing on the same docks asking for the same berths."
                : flags.cossackDiscipline === "released"
                ? " The Cossack Hosts were formally released to their own territories rather than held. A portion of them are here anyway, having found the front waiting for them at home, and they arrive with no particular claim on ships allocated to units that stayed."
                : "") +
              (flags.orelHeld === "attempted"
                ? " The Kornilov Division, ordered to hold Orel at all costs, is not among the formations queuing for embarkation at full strength."
                : "") +
              (flags.kubanCoup === "dissolved_outright"
                ? " There has been no Kuban Rada to answer to since November, and the military administration that replaced it has no standing to tell any Cossack unit that its claim on these ships is any better or worse than another's."
                : ""),
            choices: [
              {
                label: "Prioritize the Volunteer Army's combat units. Cossack formations, horses, and heavy equipment are left to fend for themselves.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I will not pretend to you that this is a decision I can defend on paper. It is the decision that gets the core of a fighting force to Crimea instead of losing all of it here. I do not expect it to be forgiven, by the men we leave or by history.",
                },
                historical: true,
                setFlags: { novorossiyskPolicy: "volunteer_priority" },
                impact: {},
                next: "sevastopolCouncil20",
                outcome:
                  "Roughly forty thousand make it onto the ships. Tens of thousands more — Kuban Cossacks prominent among them, along with soldiers separated from their units in the chaos and civilians who reached the docks too late — do not. Denikin's own later account of the scenes on the quayside does not soften what happened here, and this history will not soften it either.",
              },
              {
                label: "Hold a defensive perimeter longer to run more evacuation waves, accepting the risk of being overrun before the last ships leave.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Every additional hour we hold this perimeter is an hour bought with men who are, by definition, not on a ship. I am not going to pretend that arithmetic troubles me less than it should. It is still the arithmetic. Once the Reds are within artillery range of the harbor, holding longer stops being generosity and starts being a second disaster stacked on the first.",
                },
                historical: false,
                setFlags: { novorossiyskPolicy: "extended_perimeter" },
                impact: { manpower: -4, materiel: -3 },
                next: "voroshilovsCavalry20",
                gate: (m) => m.manpower >= -3,
                disabledReason: "holding an extended perimeter requires troops to hold it — this army's manpower is already too depleted to spare a rearguard this size.",
                outcome:
                  "The perimeter holds a day and a half longer than it did historically. Whether that window gets meaningfully more people onto ships, or simply costs the rearguard that bought it without changing how many boats were ever going to be available, is not a question this decision resolves cleanly either way.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of holding the extended perimeter.
        // historicalRecord true: the cavalry breakthrough that actually took
        // the port on March 27 is real, commanded by the same Voroshilov
        // whose Tsaritsyn conduct this campaign's Bolshevik counterpart may
        // already have addressed — or left unaddressed — eighteen months
        // earlier.
        case "voroshilovsCavalry20":
          return {
            date: "MARCH 27, 1920",
            title: "The Mole: Whoever Holds It Last",
            historicalRecord: true,
            situation:
              "The extended perimeter has bought its day and a half — and now Voroshilov's cavalry is through the line, closing on the harbor itself while General Holman personally supervises the Don Cossacks' embarkation on the mole. Denikin has already ordered the Volunteer Army's remaining units rushed aboard first, leaving the far more numerous Don Cossacks to wait their turn on a dock that may not have a turn left to give them.",
            choices: [
              {
                label: "Hold the mole with whatever rearguard remains, buying the last possible minutes for the Don Cossacks still waiting to board.",
                advisor: {
                  name: "Holman",
                  quote:
                    "I have made promises on this dock I intend to keep as far as it is physically possible to keep them. If a rearguard can buy the time to get more of these men aboard, I will ask for exactly that, knowing what it costs the men who provide it.",
                },
                historical: true,
                setFlags: { moleChoice: "held" },
                impact: {},
                next: "moleRearguardFate20",
                outcome:
                  "The rearguard holds as long as it can. Cossacks arriving without their horses shoot them on the dock rather than leave them to the Reds — the docks fill with the sound and the sight of it, a detail contemporary accounts don't soften and this one won't either. Voroshilov's cavalry takes the port on the 27th regardless. What the rearguard bought was measured in boarding slots, not in the battle's outcome.",
              },
              {
                label: "Order the last ships to cast off now rather than wait for a rearguard that may not survive to matter.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "A ship that waits for a rearguard that breaks anyway saves no one. It only risks the men already aboard for the sake of a gesture. I have made harder calls than this one on less certainty, and I am not going to dress this one up as anything more complicated than it is: leave with what we have.",
                },
                historical: false,
                setFlags: { moleChoice: "departed" },
                impact: { manpower: 3 },
                next: "sevastopolCouncil20",
                outcome:
                  "The last ships cast off without waiting on the rearguard's outcome. Fewer of the Don Cossacks still on the mole make it aboard — the decision trades a chance at marginally more evacuees for the certainty of not losing the ones already loaded. Voroshilov's cavalry takes an emptier port than it otherwise would have, which was never really the point of the choice either way.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of holding the rearguard at the
        // mole. historicalRecord false: the specific choice about how to use
        // the rearguard's own remaining minutes is invented texture, not a
        // documented order — but it follows directly from the real,
        // established fact that the rearguard's holding action bought
        // boarding time rather than a battlefield outcome.
        case "moleRearguardFate20":
          return {
            date: "MARCH 27, 1920",
            title: "The Mole: The Rearguard's Own Minutes",
            historicalRecord: false,
            situation:
              "The rearguard has done what it was asked — bought minutes, not the battle. Voroshilov's cavalry is closing on its position now, not just the harbor behind it. Whether those last minutes belong to an orderly scramble for the rearguard's own boarding, or to holding discipline long enough to cover whichever Don Cossacks are still crossing the mole, is a decision that has to be made by the men holding the line, not by anyone still safely aboard a ship." +
              (flags.moleChoice === "held"
                ? " The ships were held rather than cast off, which is what bought these minutes and what makes the men on the mole worth something more than a gesture. It also means the ships are still within range of what is coming."
                : ""),
            choices: [
              {
                label: "Signal the rearguard to break for the boats now, while there may still be room.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "They have already done what was asked of them. I will not ask a rearguard for one more minute of discipline on the theory that it serves anyone but my own conscience about how this reads afterward. Signal them to break.",
                },
                historical: false,
                setFlags: { rearguardFate: "signaled_to_break" },
                impact: { manpower: 2 },
                next: "sevastopolCouncil20",
                outcome:
                  "The signal goes out. Some of the rearguard makes it aboard in the scramble that follows — not cleanly, not in order, but more of them than a straight sacrifice would have saved. What it costs is the last few Don Cossack stragglers who were counting on the rearguard's discipline holding a few minutes longer than it did.",
              },
              {
                label: "Hold discipline. The rearguard's job was to cover the crossing, and the crossing isn't finished yet.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "I have spent this entire evacuation deciding who gets a place on a ship and who doesn't. I am not going to spend the rearguard's own discipline on the theory that they have already earned the right to stop covering the men still behind them.",
                },
                historical: false,
                setFlags: { rearguardFate: "held_discipline" },
                impact: { manpower: -2 },
                next: "sevastopolCouncil20",
                outcome:
                  "Discipline holds. More of the crossing Don Cossacks make it to the boats for it — and fewer of the rearguard itself does. It is the arithmetic every rearguard action in this war has come down to eventually, stated plainly rather than left as an implication.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // The command crisis after Novorossiysk. Every existing ending in this
        // campaign happens at the 1920 evacuation and is a variant of the same
        // military outcome; this node opens the only other kind of ending the
        // record actually offers — being removed rather than defeated.
        // historicalRecord true: Denikin convened senior commanders at
        // Sevastopol on 4 April 1920 in the wake of Novorossiysk, the council
        // named Wrangel, and Denikin resigned and left for Constantinople the
        // same day aboard a British destroyer.
        // ---------------------------------------------------------------------
        // The decision Denikin actually faced weeks before the council he's
        // already forced into by novorossiysk20's own outcome. historicalRecord
        // true: Wrangel wrote and circulated a report blaming Denikin's own
        // strategy for the Moscow campaign's failure — he had called the
        // Moscow Directive a "death sentence" back in 1919 — and Denikin
        // dismissed him along with Lukomsky and Shatilov in early February.
        // Wrangel left for Constantinople on 8 February. He is recalled from
        // there, not simply reassigned in-theatre, which the existing
        // sevastopolCouncil20 context already states but this is the node
        // where that choice actually gets made rather than just reported.
        case "wrangelsDismissal20":
          return {
            date: "FEBRUARY 1920",
            title: "Sevastopol: The Baron's Letter",
            bulletin: {
              headline: "THE SAME MONTH, TWO THOUSAND MILES EAST",
              body: "This command must settle its own dispute with a critical general in the same weeks a far harsher verdict is being carried out, two thousand miles east, against the man who was on paper its own nominal senior. That seniority was never worth anything in practice, and is about to be worth nothing at all.",
              meanwhile: {
                siberia: "Admiral Kolchak — recognized by this command's own Commander-in-Chief as Supreme Ruler of Russia — was shot at Irkutsk on 7 February, handed over by the Czechoslovak Legion in exchange for its own safe passage. What remains of his government dissolves with him.",
                bolsheviks: "With Kolchak's execution and this front's own collapse now visible, Moscow's attention is beginning to turn toward the question that will define the rest of the year: how far west the Red Army's own ambitions should now reach.",
              },
            },
            historicalRecord: true,
            context:
              "Wrangel has done what serving officers are not supposed to do: written a report blaming this command's own strategy for the Moscow campaign's collapse, and let it circulate among enough senior officers that half the room already knows its contents by heart. He called the Moscow Directive a 'death sentence' when it was issued last year. He was right about the outcome, if not necessarily for the reasons he gave, and being right in writing, in front of an audience, is its own kind of insubordination regardless of the accuracy.",
            situation:
              "Novorossiysk has not happened yet, but everyone in this room can see the shape of what is coming. Wrangel's report is not wrong about the strategic picture. Whether that makes it more dangerous to leave unanswered or less deserves an actual answer, rather than an instinct, is the whole of what has to be decided here.",
            choices: [
              {
                label: "Dismiss him. A command that tolerates a general publishing his own case against it in front of the officer corps has already lost something no reassignment gets back.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I am not punishing him for being right. I am removing him because an army whose senior officers believe they may simply publish their disagreements and be heard over their own commander's head is an army that has already stopped being a single command in anything but name.",
                },
                historical: true,
                setFlags: { wrangelDismissal: "dismissed" },
                impact: { manpower: -1 },
                next: "novorossiysk20",
                aftermath:
                  "Wrangel is dismissed alongside Lukomsky and Shatilov, and sails for Constantinople on 8 February. He is not the only general this decision removes, and Novorossiysk — three weeks away — will make the removal of exactly this kind of criticism look considerably worse in hindsight than it looked in the room where it was decided.",
                outcome:
                  "The dismissal order goes out. Wrangel leaves for exile within days, a Commander-in-Chief this command still formally answers to, now watching the war he predicted from a hotel room on the Bosphorus.",
              },
              {
                label: "Keep him. Bring the criticism into the planning room instead of pushing the man who made it out of it.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I did not write that report to be dismissed for it. I wrote it because I believe the strategy is wrong and I am prepared to say so to your face rather than only in a document that circulates behind it. If you want a different answer from me, put me somewhere I can actually give one.",
                },
                historical: false,
                setFlags: { wrangelDismissal: "retained" },
                impact: { manpower: 1 },
                next: "novorossiysk20",
                outcome:
                  "Wrangel keeps his command. It does not resolve the underlying dispute — he still believes the strategy is wrong, and the strategy has not changed — but it keeps a capable, difficult general inside the tent rather than writing about it from outside one, for whatever that turns out to be worth once Novorossiysk actually arrives.",
              },
              {
                // Added round 22 — southRussia had only 1 of 27 nodes with a
                // third option, against siberia 2/19 and bolsheviks 5/21.
                // This is a plausible middle course on a real, well-documented
                // dispute (Wrangel's report and its content are real; a
                // reassignment-rather-than-exile response is an ordinary
                // administrative option this command had and didn't take —
                // not a claim about what it actually did), leading to its own
                // downstream fork per the FORK PRINCIPLE, not just a numbers
                // variant that reconverges immediately.
                label: "Reassign him to a subordinate field command instead. Remove him from the room where the report was read, not from the army.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Dismissal answers the insubordination. It does not answer whether he was right, and I am not yet convinced those are the same question. Give him a corps to prove his case with, if he believes it that strongly, and let the results argue for him instead of a memorandum.",
                },
                historical: false,
                setFlags: { wrangelDismissal: "reassigned" },
                impact: { manpower: 1, materiel: -1 },
                next: "wrangelsReassignment20",
                outcome:
                  "Wrangel is neither dismissed nor kept where he was. He is handed a field command and told, in substance, to make his argument with results instead of memoranda — a middle course that answers the insubordination without discarding the general or the criticism outright.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // NEW round 22 — deep fork downstream of reassigning rather than
        // dismissing or retaining Wrangel at the February council.
        // historicalRecord false throughout: this specific command
        // arrangement is invented, a plausible administrative middle course
        // on a real dispute, not a documented historical event. Converges
        // back into novorossiysk20, same as the other two branches from
        // wrangelsDismissal20.
        case "wrangelsReassignment20":
          return {
            date: "FEBRUARY 1920",
            title: "Field Command: A Quieter Argument",
            historicalRecord: false,
            situation:
              "Wrangel has his corps. The question the reassignment didn't actually settle is what kind of corps to give a general whose whole public argument is that this command's strategy has been wrong — a real formation with the strength to prove his case, or a nominal one that keeps him occupied without giving the criticism anything to point to if it turns out he was right.",
            choices: [
              {
                label: "Give him a genuine formation, understrength but real, and let his handling of it answer the argument either way.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I did not write that report to be handed a name and no men behind it. Give me something real to command and I will either prove the criticism or prove myself wrong — either result is more useful to this army than a memorandum nobody has to test.",
                },
                historical: false,
                // Round 23: gated — this is a real (if thin) formation pulled
                // out of the line, which an army already bleeding manpower
                // cannot spare for an internal political experiment, however
                // useful the answer would be. Threshold matches this
                // campaign's usual manpower-gate cluster (-3 to -4).
                gate: (m) => m.manpower >= -4,
                disabledReason: "a real formation means real troops pulled out of the line — this command's manpower is already too depleted to spare them for an internal political test.",
                setFlags: { wrangelReassignmentScale: "real_command" },
                impact: { manpower: 2, rail: -1 },
                next: "novorossiysk20",
                outcome:
                  "The corps is real, if thin. Wrangel commands it the way he commanded the Caucasus Army — competently, and without ever stopping being the general whose criticism this whole arrangement was built to answer without fully accepting.",
              },
              {
                label: "Give him a nominal post instead — occupied, visibly still serving, without the strength to prove anything either way.",
                advisor: {
                  name: "Shatilov",
                  quote:
                    "A real command answers his criticism by testing it, which is a risk if he happens to be right. A nominal one answers it by never letting the test happen at all — quieter, and considerably less likely to hand him a victory to point to afterward.",
                },
                historical: false,
                setFlags: { wrangelReassignmentScale: "nominal_post" },
                impact: { manpower: -1 },
                next: "novorossiysk20",
                outcome:
                  "The post is real enough to satisfy the letter of the reassignment and thin enough to prove nothing. Wrangel serves, visibly, without ever getting the formation that would have let his argument be tested rather than merely repeated — which settles the immediate insubordination question at the cost of leaving the strategic one exactly where it was.",
              },
            ],
          };

        case "sevastopolCouncil20":
          return {
            date: "APRIL 1920",
            title: "Sevastopol: The Council of Commanders",
            bulletin: {
              headline: "TWO FRONTS CHANGE SHAPE AT ONCE",
              // Conditional on the February decision, which is settled by the
              // time this fires. The earlier version asserted the succession
              // was already resolved — it is the very thing this node decides.
              body:
                "The same week this command's own succession is put to a council, a new war two thousand miles to the west is being decided — and will do more to determine this army's remaining lifespan than anything said in this room." +
                (flags.wrangelDismissal === "dismissed"
                  ? " The general most of the room expects to be named was dismissed in February and has spent the interval in Constantinople."
                  : flags.wrangelDismissal === "retained"
                  ? " The general most of the room expects to be named never left, having been kept on in February over the objection of everyone who wanted him gone."
                  : flags.wrangelDismissal === "reassigned"
                  ? " The general most of the room expects to be named spent February and March commanding a field formation instead of a headquarters desk — neither exiled nor kept in the room where his report was read."
                  : ""),
              meanwhile: {
                siberia: "Admiral Kolchak was shot at Irkutsk two months ago. What remains of his Siberian armies is a leaderless retreat converging on Transbaikal, increasingly dependent on the same Ataman Semyonov most of its own officers despise.",
                bolsheviks: "Polish forces under Piłsudski are about to launch a major offensive into Ukraine, taking Kiev within the month. The war that results will occupy a substantial share of the Red Army's own reserves for the rest of this year — reserves that would otherwise be free to concentrate against the Crimea sooner.",
              },
            },
            historicalRecord: true,
            context:
              "Novorossiysk cost the AFSR its cohesion as much as its numbers: tens of thousands left on the quays, the Don and Kuban formations broken as organised bodies, and a command whose authority over the Cossack hosts had been the war's central political problem since 1918. What remains has reached the Crimea. The senior commanders have been summoned to Sevastopol." +
              (flags.wrangelDismissal === "dismissed"
                ? " Wrangel — dismissed from the army in February after months of open criticism of the Moscow Directive — is back in the peninsula, recalled from exile in Constantinople, and is the name every officer in the room already knows is the alternative."
                : flags.wrangelDismissal === "retained"
                ? " Wrangel never left. He is in the room as the general whose February report predicted exactly this outcome, still in command, and is the name every officer in the room already knows is the alternative — with the added weight of having been kept rather than recalled."
                : flags.wrangelDismissal === "reassigned"
                ? (flags.wrangelReassignmentScale === "real_command"
                    ? " Wrangel spent the interval commanding a real formation rather than sitting in exile or at this headquarters — and whatever the field results actually were, he arrives at this council as a general who was tested rather than merely retained or removed."
                    : " Wrangel spent the interval in a post real enough to satisfy the letter of his reassignment and thin enough to settle nothing — neither vindicated nor discredited, which leaves the room no clearer verdict on his February criticism than it had in February.")
                : ""),
            situation:
              "The council is not a mutiny and nobody in the room pretends otherwise. It is a room of men who have just watched an evacuation go the way Novorossiysk went, being asked, in effect, whether the command that presided over it should continue. Wrangel has not asked for the position and does not need to. The question is whether to put it to them and abide by the answer, or to remain and fight the Crimea's defence as the man who lost Novorossiysk — with everything that means for what any subsequent order is worth.",
            choices: [
              {
                label: "Put the succession to the council and abide by it. Resign if they name Wrangel.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have commanded this army since Kornilov died in front of Ekaterinodar. I will not command it as a man they have agreed among themselves to tolerate. If they want Wrangel, they should say so to my face and I will go the same day.",
                },
                historical: true,
                setFlags: { sevastopolCouncil: "resigned" },
                impact: {},
                aftermath:
                  "Denikin put the succession to the council on 4 April 1920, accepted its answer, resigned the same day and sailed for Constantinople aboard a British destroyer. He never held command again and spent the rest of his life writing the war's history rather than fighting it — dying in Michigan in 1947, having refused German offers to front a Russian force against the Soviet Union. The war continued for another seven months under Wrangel.",
                next: "landLawDecision20",
                outcome:
                  "The council names Wrangel. The resignation follows within hours and the destroyer sails the same day. What is left of this command passes intact to a successor who has spent a year arguing it was being handled wrongly — and now has the Crimea, the summer, and the chance to prove it.",
              },
              {
                label: "Remain in command. Refuse to make the Crimea's defence hostage to a council of subordinates.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Frunze will be at Perekop before the summer is out. I would rather answer to a commander the army has doubts about than spend the spring establishing which of us the army prefers while the isthmus goes unprepared.",
                },
                historical: false,
                setFlags: { sevastopolCouncil: "remained" },
                impact: { manpower: -1 },
                aftermath:
                  "No such refusal happened. What the record does show is what the succession actually bought: a reorganised army under a new name, the Krivoshein land law, the Northern Tauride offensive, and an evacuation in November that got nearly 146,000 people out of the Crimea in good order — the thing Novorossiysk had failed to do six weeks earlier. All of it required a commander the army had agreed to follow.",
                next: "endingTheCouncilAtSevastopol20",
                outcome:
                  "The refusal is stated plainly and changes nothing about the room it is stated in.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — reached only by resigning at the Sevastopol council. This is
        // the campaign's one non-military ending: the command does not lose a
        // battle here, it loses the room.
        case "endingTheCouncilAtSevastopol20":
          return {
            isEnding: true,
            title: "The Council at Sevastopol",
            date: "APRIL 1920",
            badge: "◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "There is no last stand to describe and no evacuation under fire. The command simply stops being obeyed.\n\nHistorically Denikin put the succession to the council, accepted its answer, resigned the same day and sailed for Constantinople aboard a British destroyer — and the war went on for another seven months under Wrangel, who reorganised the army, published Krivoshein's land law in May, took the Northern Tauride in June, and in November got nearly 146,000 people out of the Crimea in the good order Novorossiysk had failed to manage. All of that required a commander the army had agreed to follow, arrived at in a room in Sevastopol on 4 April 1920.\n\nRefusing that room does not prevent the succession; it only removes the part where it is done cleanly. Orders continue to be issued from this headquarters and continue to be read as the position of a man the senior commanders have already decided about. Wrangel is not in the peninsula to take over, because he left rather than sit as a standing alternative, and there is no orderly moment later at which he can be brought back. Perekop is prepared by a staff that does not know whose signature matters. What the historical AFSR salvaged in November was salvaged by a chain of command that had settled the question in April, and this one never does.\n\nDenikin lived until 1947 and wrote five volumes about this war, and refused in the Second World War to lend his name to a German-sponsored Russian force on the grounds that he had never fought for anything except Russia. That epitaph belongs to the man who went quietly. It is not obviously available to the one who didn't.",
          };

        case "landLawDecision20":
          return {
            date: "MAY 1920",
            title: "Sevastopol: The Land Law",
            bulletin: {
              headline: "LONDON WITHDRAWS. THE SUPPLIES STOP WITH IT.",
              body: "British support, which sustained this army through 1919 — the rifles, the shells, the uniforms, the tanks at Tsaritsyn — is being wound down. The British mission has advised plainly that continuing the war can have only one outcome and has pressed for negotiation with Moscow instead. The material that arrived through Novorossiysk for a year arrives no longer. Whatever this government does about the land question, it now does with what it already holds.",
              meanwhile: {
                siberia: "What remains of the eastern front has crossed into Manchuria or is converging on Chita under Japanese-backed protection; the Allied intervention there is winding down on the same logic.",
                bolsheviks: "Poland invaded Ukraine in April and took Kiev in May. The Red Army\'s counteroffensive is beginning — and every division committed to it is a division not yet turned toward the Crimea.",
              },
            },
            historicalRecord: true,
            situation:
              "Wrangel has replaced Denikin, and Krivoshein — his new Prime Minister, once the most liberal minister the Tsar ever had — is pushing a land law: peasants can purchase, through the state as intermediary, the land they already work. A White general in exile will later say plainly that if Denikin had published this exact law two years earlier, the outcome of the whole war might have been different. It is May 1920. There is no more time left to test that theory gently." +
              (flags.sevastopolCouncil === "resigned"
              ? " The law arrives over a signature the army agreed on at Sevastopol three weeks ago, which is the only reason a measure this radical can be issued at all without the Kuban reading it as a trick."
              : "") +
            (flags.novorossiyskPolicy === "volunteer_priority"
                ? " The Cossack formations left on the Novorossiysk mole six weeks ago are a matter of record in every stanitsa this law would need to reach. Krivoshein is aware of it and is proposing the law anyway."
                : flags.novorossiyskPolicy === "extended_perimeter"
                ? " Holding an extended perimeter at Novorossiysk got more people onto the ships and cost the rearguard that did the holding. The districts this law has to be administered through are being garrisoned by whoever came back."
                : ""),
            choices: [
              {
                label: "Adopt the Land Law as Krivoshein has drafted it: peasant purchase through state intermediation, landowners compensated.",
                advisor: {
                  name: "Krivoshein",
                  quote:
                    "This does not make us the party of the peasant. It makes us the government that stopped asking the peasant to fight for men who still owned the land under his feet — which may be the only thing left in this war we still have the standing to do something about.",
                },
                historical: true,
                setFlags: { landLawPolicy: "purchase_model" },
                impact: {},
                next: "northernTauride20",
                outcome:
                  "The Land Law is published. It is more than Denikin ever offered, and far too late to matter to most of the peasants it targets. Among the Volunteer Army's own officer corps — many of them landowners themselves — it does not go without resentment.",
              },
              {
                label: "Push further. Confiscate and redistribute immediately, without payment or state intermediation.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A purchase requirement is what keeps this from being indistinguishable from what the Bolsheviks already hand out for free — I grant the argument. What I doubt is that we have the time left to preserve that distinction at the pace of a formal land registry. We are not negotiating on a schedule that rewards patience.",
                },
                historical: false,
                setFlags: { landLawPolicy: "immediate_confiscation" },
                impact: { manpower: 2 },
                costsCapital: true,
                next: "northernTauride20",
                outcome:
                  "The radical version is announced instead. It buys real peasant goodwill faster than the historical law ever did — and it costs the officer corps' own patience with Wrangel's government almost immediately, several resigning in protest within the month.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // Shared waypoint for both landLawDecision20 branches — the Northern
        // Tauride operation happened regardless of the exact reform's shape,
        // so this is where the peasant/Green dimension of the war finally
        // gets real weight, not just a Cossack- and officer-corps-focused
        // story. historicalRecord true: the operation, Ulagai's expedition,
        // and their failure are all real.
        case "northernTauride20":
          return {
            date: "JUNE 1920",
            title: "Tauride: Neither Bayonets Nor Deeds",
            historicalRecord: true,
            situation:
              "Wrangel's forces have broken out of the Crimean bottleneck into Tauride province — real ground, and the exact territory where the land law is supposed to prove itself faster than bayonets ever could. General Ulagai is proposing an expeditionary force across the Sea of Azov to the Kuban, to link with White partisan networks and widen the offensive before the Red Army can concentrate against it. The alternative is to hold what's been taken and let the reform actually be tested here first.",
            choices: [
              {
                label: "Commit Ulagai's force to the Kuban expedition. Widen the offensive while the initiative is real.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "We do not have the men to hold Tauride and wait patiently for a land law to change peasant opinion on its own schedule. If Ulagai can bring the Kuban's own partisan networks into this, the reform gets an army behind it instead of a pamphlet.",
                },
                historical: true,
                setFlags: { taurideChoice: "kuban_expedition" },
                gate: (m) => m.rail >= -3,
                disabledReason: "Mounting an amphibious expedition to the Kuban requires the rail and port capacity to stage it. Neither is available.",
                impact: {},
                next: "wrangelsEnvoy20",
                outcome:
                  "Ulagai's 4,500 men land in the Kuban. The expedition lasts three weeks before it's forced to withdraw — and in Tauride and Ukraine alike, the peasants the whole operation was supposed to win over simply don't rally to the White cause. Not out of active hostility in every case. Out of a settled distrust that one land law, arriving this late, was never going to undo.",
              },
              {
                label: "Hold the Tauride gains. Let the land law's actual effects on the ground be tested before overextending further.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Momentum has its appeal, I won't deny it. A reform announced three weeks ago has not had time to change a single mind in the Kuban, and sending Ulagai chasing partisan networks there doesn't buy that reform more time to work — it spends men we need to hold what's already ours.",
                },
                historical: false,
                setFlags: { taurideChoice: "consolidate" },
                impact: { manpower: 2 },
                next: "wrangelsEnvoy20",
                outcome:
                  "The Kuban expedition never sails. Tauride is held a little more securely for it — and the land law's reception among the peasantry there is no warmer for the caution. The deeper problem was never really timing alone; it was three years of White governance the peasantry had already learned not to trust, and no single policy, however well defended, was going to undo that on its own.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // The other prong of "widening the offensive": not military
        // reinforcement but a political one. historicalRecord true for both
        // the letter and its reception — Wrangel really did send this,
        // Makhno really did execute the messenger. Fills a genuine gap: the
        // campaign previously jumped straight from June 1920 to October with
        // nothing between, and this is a real, precisely dated event sitting
        // exactly in that gap.
        case "wrangelsEnvoy20":
          return {
            date: "JULY 1920",
            title: "Vrem'evka: The Letter to Makhno",
            historicalRecord: true,
            context:
              "By April 1920 the British had told Wrangel plainly that continuing the war bought him no further support — General Percy's mission warned that prolonging the struggle 'can have only one result,' and pressed him toward negotiating with the Bolsheviks directly. Wrangel refused, at whatever cost, and instead widened his own search for allies: overtures to the Don and Kuban Cossacks, an offer of cooperation to Poland and Petliura's Ukraine, and now — on the strength of nothing more than the Soviet press's own repeated, and false, claims that Makhno was already secretly working with him — a letter to the one force in south Russia that has spent three years fighting everybody, Reds and Whites alike, with equal conviction." +
              (flags.taurideChoice === "kuban_expedition"
                ? " Ulagai's own landing in the Kuban was itself a search for exactly this kind of ally — this letter is a second front of the same logic, not a departure from it."
                : flags.taurideChoice === "consolidate"
                ? " Having chosen to consolidate rather than widen the offensive into the Kuban, this letter is the one place this command is still reaching for an ally beyond the ground it already holds."
                : ""),
            situation:
              "Shatilov and Konovalets have drafted a letter to 'the Ataman of the insurrectionary troops, Makhno,' proposing arms, ammunition, and specialists in exchange for coordinated action against the Bolsheviks — sealed at Melitopol on 18 June. Whether to actually send it is still, technically, an open question. Makhno has never given this command the smallest reason to expect anything but contempt in return.",
            choices: [
              {
                label: "Send it. If there is any chance Makhno answers, the offensive needs every ally it can find.",
                advisor: {
                  name: "Shatilov",
                  quote:
                    "I have drafted the letter myself, and I will tell you plainly I do not expect an answer worth having. I also do not think we can afford to have declined an opening we never actually tested, if this offensive runs out of men before it runs out of ground.",
                },
                historical: true,
                setFlags: { makhnoOutreach: "sent" },
                impact: {},
                next: "crimeaDefensePrep20",
                aftermath:
                  "The messenger, a twenty-eight-year-old named Ivan Mikhailov, delivers the letter to the Makhnovist staff at Vrem'evka on 9 July. Makhno's own recorded answer is immediate: 'Any delegate sent from Wrangel, or from anyone on the right, should be executed on the spot, and no answer will be given.' Mikhailov is shot within the hour. The Makhnovists publish both the letter and their reply in their own press specifically to put the record straight — Soviet newspapers had been claiming a secret Makhno-Wrangel alliance for weeks, and this is the answer to that claim as much as it is an answer to Wrangel.",
                outcome:
                  "The letter goes out under Shatilov and Konovalets's signatures. What comes back is not a reply.",
              },
              {
                label: "Don't send it. Whatever this buys against the Bolsheviks isn't worth the propaganda if it fails badly.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I have read what the Soviet papers are already saying about an alliance between us that has never existed. Sending this letter and having it answered with an execution does not disprove that story to anyone inclined to believe it — it simply gives them a fresher version of the same lie to print.",
                },
                historical: false,
                setFlags: { makhnoOutreach: "withheld" },
                impact: {},
                next: "crimeaDefensePrep20",
                outcome:
                  "The letter is drafted and never sent. Makhno never has occasion to answer an offer that never reaches him, and Trotsky's Southern Front never gets the specific, embarrassing proof — a hanged messenger, publicly announced — that the alliance the Soviet press has been inventing for weeks was fiction all along. The rumor persists a little longer for want of the one thing that would have killed it outright.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "crimeaDefensePrep20":
          return {
            date: "OCTOBER 1920",
            title: "Sevastopol: Preparing for the End",
            bulletin: {
              headline: "THE LAST TWO WHITE FRONTS, THE SAME MONTH",
              body: "This is the last month any organized White force still holds ground anywhere in Russia. Here and two thousand miles east, both fronts are converging on the same ending at almost the same time — the first and only occasion this war has synchronized that way.",
              meanwhile: {
                siberia: "The Far Eastern Republic — the Bolshevik-tolerated buffer state formed in April — has just moved its capital to Chita itself, as Japanese forces complete their withdrawal from Transbaikal. What remains of the White retreat there is converging on the same city.",
                bolsheviks: "The Polish war has just concluded with an armistice; formal peace talks are underway at Riga. Frunze's Southern Front, no longer needing to share reserves with the Polish front, is free to turn its full attention to Perekop.",
              },
            },
            historicalRecord: true,
            situation:
              "Frunze's Southern Front is massing against Perekop and the Sivash crossings — the same offensive already being planned on the other side of this history. Every ship, every dock allocation, every logistics officer spent now on preparing a possible evacuation is a resource not spent reinforcing the isthmus defenses. Novorossiysk happened because no one prepared for it in advance. There is still time not to repeat that." +
              (flags.taurideChoice === "kuban_expedition"
                ? " Ulagai's expedition to the Kuban has already come back, and what it came back with is a shorter list of formations available to hold the isthmus than the one this decision was supposed to be choosing from."
                : flags.taurideChoice === "consolidate"
                ? " Holding the Tauride gains rather than widening the offensive means the formations are at least where they are needed. It has not bought enough of them to make the isthmus defensible and prepare an evacuation at the same time."
                : "") +
              (flags.makhnoOutreach === "sent"
                ? " The Soviet press has had a genuine hanged messenger to print since July instead of an invented alliance, and Frunze's own Southern Front headquarters have made full use of it — proof, in their telling, that this command reached for the one ally in south Russia disqualified by every principle it claims to be fighting for."
                : ""),
            choices: [
              {
                label: "Quietly begin organizing evacuation logistics now, in parallel with the defense, before the line actually breaks.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I do not intend to explain to the men on that isthmus that I was drawing up passenger manifests while they held the line. I also do not intend to preside over a second Novorossiysk because I refused to plan for the version of this that has already happened once.",
                },
                historical: true,
                setFlags: { evacuationPrep: "advance" },
                impact: {},
                next: "finalReckoning20",
                outcome:
                  "The preparation happens quietly, alongside the defense rather than instead of it. It is the reason the eventual Crimean evacuation moves some 145,000 people off the peninsula in reasonable order — the one piece of this whole campaign that does not end in the kind of chaos Novorossiysk did.",
              },
              {
                label: "Commit every available resource to the defense itself. No evacuation planning until the line is actually broken.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "I understand the caution after Novorossiysk. I am telling you that every dock official and every requisitioned ship spent on a evacuation we may not need is a rifle, a shell, or a horse the isthmus does not get — and the isthmus is what decides whether we need the ships at all.",
                },
                historical: false,
                setFlags: { evacuationPrep: "none" },
                impact: { manpower: 2 },
                next: "finalReckoning20",
                outcome:
                  "Every spare resource goes to the defense instead. It marginally strengthens the line at Perekop — and if that line breaks anyway, as it does on the other side of this history, whatever evacuation follows will have to be improvised from nothing, the way Novorossiysk was.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // CHECKPOINT — not a real decision, a decision-gated routing node.
        // Gate was originally the accumulated manpower meter (<= -6). Changed
        // deliberately: raw meter arithmetic could be triggered by a string
        // of unrelated small losses that have nothing to do with the army
        // actually dissolving as an organized body, and it let the triangle
        // — meant to track logistics, not drive the plot — decide which of
        // three fundamentally different endings this run gets. The dissolved
        // ending is now earned specifically by the reckless-gamble chain at
        // Ekaterinodar: pressing Kornilov's doomed assault, and having that
        // gamble actually fail. Two real decisions in direct sequence, not
        // an arithmetic side-effect of the whole campaign.
        case "finalReckoning20":
          if (flags.ekaterinodarChoice === "press" && flags.secondDayOutcome === "collapsed") {
            return this.resolveNode("endingArmyDissolved20");
          }
          return this.resolveNode(flags.evacuationPrep === "advance" ? "endingBizerte" : "endingSecondNovorossiysk");

        // ---------------------------------------------------------------------
        // ENDING — reachable only via a specific decision chain: pressing
        // Kornilov's doomed assault at Ekaterinodar, and having it fail.
        // historicalRecord false: no organized evacuation attempt this small
        // in scale is documented; what's real is the underlying dynamic —
        // an army gutted by its own command's opening gamble, two and a
        // half years before the evacuation this ending replaces, never
        // fully recovers the manpower base the historical AFSR had.
        case "endingArmyDissolved20":
          return {
            isEnding: true,
            title: "The Army That Dissolved",
            date: "OCTOBER–NOVEMBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "There is no evacuation to describe, orderly or otherwise, because by the time Frunze's offensive reaches Perekop there is no longer a coherent army left to evacuate. The damage traces back to a single decision two and a half years earlier: pressing Kornilov's assault on Ekaterinodar rather than calling it off the day he died, and watching that gamble fail outright. An army that started that many men short of its historical strength never closed the gap — every later choice, good or bad, was made by a smaller command than the one that actually fought this war. Units break contact independently rather than as a retreating force. Some reach the coast in scattered groups and find passage where they can. Most don't.\n\nThis is not the historical record — the real AFSR, battered as it was, remained a fighting force capable of Wrangel's genuinely organized evacuation all the way to the end. Kornilov's death broke the assault off immediately in that history; what's speculative here is a command that chose to honor his plan instead, and never stopped paying for it." +
              (flags.collapseChoice === "reorganize_first"
                ? "\n\nThe extra day taken to reorganize before withdrawing from Ekaterinodar bought a more orderly retreat out of a failed assault. It did not buy back the men the assault had already cost, and the arithmetic that ends here was fixed before that reorganization began."
                : flags.collapseChoice === "immediate_withdrawal"
                ? "\n\nThe immediate withdrawal from Ekaterinodar was the right call made too late to matter. It saved what could still be saved from a decision that had already spent what could not."
                : "") +
              (flags.volgaCossackDiscipline
                ? "\n\nThe Cossacks on the Volga axis went home regardless of whether they were ordered to stay or released to go. On this path it made no difference which: an army already this far below the strength it needed had nothing to hold them with except an order, and an order was never what was keeping them."
                : ""),
          };

        // ---------------------------------------------------------------------
        // ENDINGS
        // ---------------------------------------------------------------------
        case "endingBizerte":
          return {
            isEnding: true,
            title: "The Bizerte Fleet",
            date: "NOVEMBER 1920 – FEBRUARY 1921",
            badge: "HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "The evacuation Wrangel spent months quietly preparing empties Crimea in five days: some 145,000 soldiers, officials, and civilians aboard over a hundred ships, bound first for Constantinople. Judged against everything else this war has been, it is orderly — the one evacuation in this war that does not become a byword for chaos the way Novorossiysk did. The warships continue on to Bizerte in French Tunisia, interned there until 1924, when France recognizes the Soviet government and the fleet is sold for scrap where it sits at anchor.\n\nThe people are a separate problem than the ships. France finances refugee camps at Gallipoli and on Lemnos, roughly 24,000 in the first and over 10,000 in the second by that November — conditions in both are harsh, typhoid and starvation among them. The two camps produce two different outcomes. At Gallipoli, Kutepov imposes a brutal discipline that holds the First Army Corps together as a body, later mythologized among émigrés as the 'Gallipoli miracle.' On Lemnos, no such regime takes hold; morale collapses, and many of the Cossack units there accept repatriation to Soviet Russia rather than face indefinite exile. The same evacuation produces both a myth of resilience and a wave of men choosing to go back to the country that was, by every other measure, still hunting people like them.\n\nGetting the fleet out clean was never the same question as what happened to the people left on the dock. Behind the evacuation, in Crimea itself, a Red Terror follows under Béla Kun and Rosalia Zemlyachka — historians' estimates of the executions range from roughly 12,000 to well over 50,000, many of them soldiers who surrendered on the promise of an amnesty that was never honored."
              + (flags.landLawPolicy === "immediate_confiscation"
                  ? "\n\nAmong the émigré communities that form around these camps, the radical Land Law is remembered in a way the historical purchase-model version never was — not as vindication, since the war was lost either way, but as the one policy in this whole campaign that arrived without a landowner's asterisk attached to it. It does not change where anyone ended up. It changes, slightly, what the survivors tell themselves about whether the Whites ever actually meant it about the peasant."
                  : "\n\nThe Land Law, in whichever form it took, becomes one more entry in the long postwar argument among émigrés about what, if anything, could have been done differently. It settles nothing.")
              + " Wrangel learned Denikin's lesson about preparing for defeat. It did not extend to the people this evacuation could not carry, and it did not decide, for the ones it did, whether exile would harden them or break them." +
              (flags.rearguardFate === "held_discipline"
                ? "\n\nThe rearguard on the Novorossiysk mole held discipline to the end and covered the crossing rather than breaking for the boats. Almost none of them are in Bizerte. The men who are know it, and the fact sits in the fleet's own accounting of itself for as long as the fleet exists — the ships were filled, in part, by men who chose not to run for them."
                : flags.rearguardFate === "signaled_to_break"
                ? "\n\nThe rearguard was signaled to break for the boats while there was still time, and some of them made it. What that decision cost was the Don Cossacks still crossing behind them, and that arithmetic is not one the fleet's officers discuss in Bizerte. Everyone aboard understands the trade that was made on their behalf."
                : "") +
              (flags.kharkovEncirclementChoice === "counterattack"
                ? "\n\nThe cavalry spent against Budyonny at Kharkov is not in these ships either. It bought the withdrawal that made this evacuation reachable, and it did so by ceasing to exist as a formation. The Bizerte rolls list units that arrived at strength and units that arrived as names."
                : ""),
          };

        case "endingSecondNovorossiysk":
          return {
            isEnding: true,
            title: "Second Novorossiysk",
            date: "NOVEMBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "Without an evacuation already in motion when the Perekop line finally breaks, the withdrawal to the docks happens the way Novorossiysk did nine months earlier — improvised, overcrowded, working from ships that were never actually requisitioned in advance. Fewer of the roughly 145,000 who historically made it out get a berth this time. More are left behind for the Red Terror under Béla Kun and Rosalia Zemlyachka that follows regardless of how the evacuation itself went — that atrocity was never contingent on this choice, only its scale plausibly was."
              + (flags.ekaterinodarChoice === "press"
                  ? "\n\nThis is a command that has been running a deficit since Ekaterinodar in April 1918 — pressing Kornilov's assault against a garrison twice its size cost it a deeper hole to climb out of than the historical retreat ever had, and two and a half years later, at the other end of the war, that deficit hasn't closed. It has compounded. The generals who evacuate Crimea unprepared this time are, in a real sense, the same command that never fully recovered from choosing to press an unwinnable second day outside a city that was never the war's actual turning point."
                  : "\n\nThis command withdrew from Ekaterinodar in good order in April 1918, at the very start, when Denikin first inherited a battle he didn't plan. That early discipline bought it nothing durable by November 1920 — the same unprepared scramble at the docks, the same reputation lost in a single uncoordinated week. Some costs in this war were never really about which choices you made. They were about how much time the war itself was willing to give any choice to matter.")
              + "\n\nWrangel's reputation as the general who learned Denikin's lesson does not survive contact with a defeat he chose not to finish preparing for in time. This is not the historical record. It is what a serious accounting of the war would call a plausible cost of the alternative — not a certainty, but not a stretch either." +
              (flags.cavalryLossResponse === "press_on"
                ? "\n\nThe retreat was pressed on at the pace the collapse demanded rather than slowed to compensate for the missing cavalry screen. More of the army reached the coast. Less of it arrived in any condition to be embarked in an order anyone had planned, which is a distinction that matters enormously on a quay and not at all on a map."
                : flags.cavalryLossResponse === "slow_down"
                ? "\n\nThe retreat was slowed to compensate for the missing cavalry screen, and the army that reached the coast was more coherent than the one that would have arrived at speed. It was also smaller, and it arrived later, into a harbor where the ships had already begun making their own decisions about who to wait for."
                : "") +
              (flags.kharkovLine === "stand"
                ? "\n\nThe stand at the Kharkov–Kursk line is the reason there was still a formed army to evacuate rather than a crowd. It is also the reason the evacuation happened here, improvised, instead of somewhere further south with time to prepare it."
                : ""),
          };

        // ---------------------------------------------------------------------
        // HARD MODE ENDING — triggers whenever Volunteer Army Cohesion
        // (cohesionStrain) reaches 100, at whatever node the player happens
        // to be on. Not tied to a single historical event — it's the
        // culmination of the real, repeated pattern this campaign's own
        // content already documents: the Kalabukhov hanging, disciplinary
        // crackdowns on Cossack units, centralizing overrides of Cossack
        // objections, accumulated past the point the coalition can absorb.
        case "endingCossackMutiny":
          return {
            isEnding: true,
            title: "The Mutiny",
            date: "DATE VARIES — TRIGGERED BY ACCUMULATED COHESION STRAIN",
            badge: "SPECULATIVE — HARD MODE COLLAPSE",
            classification: "speculative",
            epilogue:
              "It does not happen all at once, and it is not a single order anyone gives. It is the accumulated weight of every choice that answered a Cossack Host's objection with central authority instead of accommodation — the Kalabukhov hanging, the discipline enforced on units that wanted to go home, every moment the chain of command chose control over consent. Somewhere on the retreat, a Kuban or Don contingent that has simply had enough turns on the rearguard it was supposed to be protecting, or rides for home in numbers too large to discipline.\n\nThis is not what happened historically — the real AFSR held together, badly and at real cost, all the way to Crimea. It is what an accumulation of exactly this kind of choice makes plausible: a command that never lost a decisive battle to the Red Army, undone instead by an army that stopped trusting it. The war doesn't end here. This command's part in it does.\n\nWhat follows for the Cossacks themselves is not speculative. The Don and Kuban Hosts that rode home to defend their own stanitsas found the front arriving there anyway, and the Soviet policy of decossackization — the January 1919 directive and everything that followed from it — did not distinguish between Cossacks who had fought to the end and Cossacks who had gone home early. Those who reached the coast in time joined the emigration; those who did not were absorbed into a Soviet order that spent the next decade dismantling the Host system as a category. Leaving the line bought individual men time. It did not buy the thing they left to protect." +
              (flags.kubanShortfallResponse === "disciplined"
                ? "\n\nThe Kuban Rada's leadership was disciplined publicly for the quota it failed to deliver. Every stanitsa that heard about it filed the lesson away, and the men who eventually turned on the rearguard did not need to be told twice what this command did to Kuban bodies that disappointed it."
                : flags.kubanShortfallResponse === "absorbed"
                ? "\n\nThe Kuban quota shortfall was absorbed quietly rather than punished. It bought nothing in the end — a command that had already answered enough Cossack objections with force did not get credit for the one time it didn't."
                : "") +
              (flags.kubanNegotiationOutcome === "emboldened"
                ? "\n\nThe Rada's separatist faction, negotiated with rather than crushed, read the restraint as weakness and moved further. What breaks here was already breaking then; this is only where it finished."
                : ""),
          };

        default:
          return null;
      }
    },
  },

  // =========================================================================
  // SIBERIA — Kolchak, Provisional All-Russian Government
  // =========================================================================
  siberia: {
    id: "siberia",
    label: "Provisional All-Russian Government",
    coalition: "white", // Supreme Ruler government -- see kolchak/denikin dossiers for the real, purely symbolic chain of command with AFSR
    shortTag: "OMSK", // identity — fixed regardless of skin choice
    commander: "Admiral Alexander Kolchak",
    seat: "Supreme Ruler's Staff, Omsk",
    thesis: "One war. A White movement nominally united under Kolchak but fought, in practice, as an independent campaign — managing the shape of a defeat, not chasing an alternate victory.",
    start: "omskCoup18",

    initialMeters: {
      manpower: 0,
      materiel: 0,
      rail: 0,
    },
    triangleAxes: [
      { key: "manpower", label: "MANPOWER" },
      { key: "materiel", label: "FOREIGN MATÉRIEL" },
      { key: "rail", label: "RAIL CONTROL" },
    ],
    initialLegitimacy: 0,
    plannedEnding: {
      date: "LATE 1920",
      title: "Dissolution Under Semyonov",
      note:
        "Not the Vladivostok government of 1922 -- that was a genuinely different political entity with different leadership; carrying this command seat that far is a stretch past what the same seat can plausibly claim. End on the Kappelite remnant's absorption into, and Semyonov's own collapse in, the Transbaikal -- keeps the actual command thread intact rather than borrowing a later, unrelated story's ending.",
    },
    hardMode: {
      key: "authorityErosion",
      label: "Ataman Authority",
      capitalName: "JANIN MODE",
      capitalLabel: "AUTHORITY CAPITAL",
      description:
        "No rewind, no meter dashboard — only staff reports. Five points of Authority Capital to spend asserting sole command over nominally subordinate atamans and, critically, over the Czechoslovak Legion units who control the rail line this whole retreat depends on. Spend all five and the Legion withdraws its protection at the fifth override — the campaign ending the way it really did: betrayal, not defeat in the field. Named for General Janin, whose Allied guarantee of protection meant exactly as much as the Legion's own convenience allowed.",
      buttonLabel: "OPEN COMMAND",
      maxCap: 5,
      maxEndingId: "endingLegionWithdraws",
    },

    NEWSPAPER_MASTHEAD: "SIBIRSKAYA RECH",
    NEWSPAPER_SUBHEAD: "Siberian Speech — as read at Omsk",
    ADVISOR_DOSSIERS: {
      vologodsky: {
        role: "Prime Minister, Provisional All-Russian Government",
        bio:
          "A moderate Siberian regionalist politician who chaired the Council of Ministers through the Directory's collapse and the transfer of power to Kolchak, having concluded that a single military authority was the only alternative to total governmental breakdown.",
        fate:
          "Remained Prime Minister under Kolchak until November 1919, resigning as the government's collapse became undeniable. Died in exile in Harbin in 1925.",
        faction: "Council of Ministers",
        rank: 1,
      },
      boldyrev: {
        role: "Commander-in-Chief, Directory Forces; briefly Supreme Ruler on the path where Kolchak redirected the office to him",
        bio:
          "A career general and founding member of the Union for the Regeneration of Russia, a moderate anti-Bolshevik coalition that included Kadets and Right SRs. On record as more sympathetic to the Directory's socialist wing than most of the officers who ended it — the reason Kolchak first proposed redirecting the Supreme Ruler offer to him rather than accepting it himself.",
        fate:
          "Historically declined any role once Kolchak's coup succeeded, and left for Japan ten days later. Returned to Vladivostok in 1920 as commander of the Far East's forces, was arrested by the Red Army in 1922, declared willingness to serve the Soviet government, taught for a decade in Novosibirsk, and was shot in 1933 on a fabricated espionage charge.",
        faction: "Union for the Regeneration of Russia",
        rank: 1,
      },
      kolchak: {
        role: "Supreme Ruler, Provisional All-Russian Government — recognized as supreme commander of all White forces by Denikin, Yudenich, and Miller from June 1919",
        bio:
          "Former Imperial Navy admiral with no experience commanding land armies before assuming supreme power in November 1918. Relied heavily on his chief of staff for operational planning and never fully resolved his authority over the regional atamans who controlled the rail line behind his own front. His recognition as supreme commander by every other major White general in mid-1919 was genuine and diplomatically significant — it secured Allied recognition of his government as Russia's legitimate authority — but it never translated into actual coordination with AFSR a continent away. The two campaigns fought, in practice, entirely independent wars against the same enemy.",
        fate:
          "Renounced supreme power on January 4, 1920, as his government collapsed, naming Denikin as his successor. Handed over by the Czechoslovak Legion to the Bolshevik-aligned Irkutsk Political Centre in exchange for safe passage east. Executed by firing squad on February 7, 1920; his body was put through the ice of the frozen Angara River and never recovered.",
        faction: "Provisional All-Russian Government",
        rank: 0,
      },
      gajda: {
        role: "Commander, Siberian Army",
        bio:
          "A Czechoslovak Legion officer turned Russian general, celebrated for the capture of Perm in December 1918 and popular with his troops. Pushed hard for continuing the offensive north toward a junction with Allied forces at Archangel rather than diverting south.",
        fate:
          "Dismissed by Kolchak in July 1919 after the offensive's collapse. In November 1919 organized an armed revolt against Kolchak's government in Vladivostok, which failed. Returned to Czechoslovakia, became leader of the country's small fascist party, and died in Prague in 1948.",
        faction: "Siberian Army",
        rank: 1,
      },
      kappel: {
        role: "Commander-in-Chief, Eastern Front (from mid-December 1919)",
        bio:
          "Appointed to lead the retreat as Kolchak's authority collapsed, trusted by the rank and file in a way few other White commanders in Siberia were. Insisted on keeping the retreating army together as a fighting force rather than letting it dissolve into separate columns.",
        fate:
          "Suffered severe frostbite crossing a frozen river during the retreat, developed pneumonia, and transferred command to General Voitsekhovsky on January 21, 1920. Died four days later, on January 25, 1920, at Nizhneozyornaya.",
        faction: "Eastern Front Command",
        rank: 1,
      },
      voitsekhovsky: {
        role: "Corps commander, Eastern Front",
        bio:
          // Round 23: fleshed out from a 150-char stub. Cross-verified against
          // two independent Wikipedia articles (his own biography page and
          // the Great Siberian Ice March page) for Kappel's death date and
          // the succession — both agree on 26 January 1920.
          "A Czechoslovak Legion commander from December 1917, he took Chelyabinsk in May 1918 and transferred to Kolchak's Russian command in March 1919 as commander of the 2nd Ufa Corps, rising to command the whole 2nd Army by October — already the army's most experienced field officer well before Kappel's death made him its last one.",
        fate:
          "Took command of the Eastern Front on Kappel's death from pneumonia on 26 January 1920 and led the remnant into Transbaikal, evacuating via Vladivostok to Istanbul that November. Settled in Czechoslovakia, rose to army general, and led its underground resistance after the 1939 German occupation. Abducted by Soviet SMERSH from Prague in 1945, he died in the Ozerlag Gulag camp in 1951 — the only advisor in this file whose Civil War service ended in a Soviet prison camp anyway, three decades and a second world war later.",
        faction: "Eastern Front Command",
        rank: 2,
      },
      semyonov: {
        role: "Ataman of the Transbaikal Cossack Host; Japanese-backed autocrat of Chita",
        bio:
          "Ruled Transbaikal from 1918 with Japanese military backing and nominal, largely theoretical subordination to Kolchak's government. His own troops developed a well-documented reputation among the civilian population for theft, arson, and murder — a record the Kappelite officer corps despised him for even while depending on his territory to survive.",
        fate:
          "Lost Chita in October 1920 and retreated to Manchuria. Lived in exile in China and Japan, drawing a Japanese government pension. Captured by Soviet forces in Manchuria in 1945 and executed in Moscow the following year.",
        faction: "Transbaikal Cossack Host",
        rank: 1,
      },
      sakharov: {
        role: "Chief of Staff, Western Army; later Commander-in-Chief (Nov 1919 – Jan 1920)",
        bio:
          "Argued through the spring 1919 offensive for concentrating the dispersed White armies on a single central axis toward Kazan rather than splitting toward Gajda's Archangel and Denikin's Saratov junctions — a position he restated at length in his own postwar memoir, which is not a disinterested account of a plan he had proposed himself. Given supreme command in the war's final, hopeless stretch after Dieterichs' dismissal.",
        fate:
          "Commanded through the retreat from Omsk and the worst of the Great Siberian Ice March before being replaced by Kappel in January 1920. Escaped through Harbin. Died in emigration in Belgium in 1935.",
        faction: "Western Army",
        rank: 1,
      },
      diterichs: {
        role: "Commander, 3rd Army; briefly Minister of War under Kolchak (August 1919)",
        bio:
          "A staff officer known for internal discipline and self-confidence rather than a record of dramatic field command before this war. Ordered the July 1919 counterattack to retake Chelyabinsk's rail junction from the advancing Red 3rd Army under Frunze.",
        fate:
          "Later led the last White government in the Russian Far East (the Priamurye government) in 1922, framing his cause explicitly as a religious crusade, before its final collapse that October. Died of tuberculosis in Shanghai in September 1937.",
        faction: "Siberian Army Command",
        rank: 2,
      },
    },

    NODE_ATLAS: [
      { id: "omskCoup18", date: "NOVEMBER 1918", title: "Omsk: The Offer Kolchak First Refused" },
      { id: "boldyrevsFirstWeek18", date: "NOVEMBER 1918", title: "Omsk: The First Week" },
      { id: "reluctanceAftermath18", date: "NOVEMBER 1918", title: "Chita: What the Delay Signals" },
      { id: "semyonovResponse18", date: "DECEMBER 1918", title: "Chita: A Small, Real Opening" },
      { id: "springOffensive19", date: "MARCH 1919", title: "Omsk: The Spring Offensive" },
      { id: "saratovJunction19", date: "MAY 1919", title: "The Southern Flank" },
      { id: "exposedFlank19", date: "MAY 1919", title: "The Flank: What the Reserves Found" },
      { id: "ufaCounteroffensive19", date: "JUNE 1919", title: "Ufa: The Red Counteroffensive" },
      { id: "chelyabinskGrinder19", date: "JULY 1919", title: "Chelyabinsk: The Grinder" },
      { id: "diterichsOverruled19", date: "AUGUST 1919", title: "The General Overruled" },
      { id: "thirdArmySuccessor19", date: "SEPTEMBER 1919", title: "Third Army: Who Replaces a Capable General" },
      { id: "railPriority19", date: "NOVEMBER 1919", title: "Omsk: The Evacuation Trains" },
      { id: "janinsWord19", date: "DECEMBER 1919", title: "The General's Word" },
      { id: "iceMarchDecision19", date: "DECEMBER 1919", title: "The Trakt: Who Rides, Who Walks" },
      { id: "eichesPursuit20", date: "JANUARY 1920", title: "The Distance Eiche Closed" },
      { id: "irkutskUltimatum20", date: "FEBRUARY 1920", title: "Irkutsk: The Ultimatum" },
      { id: "semyonovMerger20", date: "MARCH 1920", title: "Chita: A Loathed Necessity" },
      { id: "manchurianBorder20", date: "APRIL 1920", title: "The Border: Whoever Asks Permission" },
      { id: "chitaFall20", date: "OCTOBER 1920", title: "Chita: The Plug Comes Out" },
    ],
    NODE_TOTAL: 19,
    ENDINGS_GALLERY: [
      { id: "endingManchuria", title: "The Manchurian Border", classification: "historical" },
    { id: "endingBoldyrevsOmsk18", title: "Boldyrev's Omsk", classification: "speculative" },
    { id: "endingOmskFalls19", title: "Omsk Falls", classification: "speculative" },
      { id: "endingTheAdmiralAtIrkutsk20", title: "The Admiral at Irkutsk", classification: "historical" },
      { id: "endingManchuriaEarly", title: "The Army That Left First", classification: "speculative" },
      { id: "endingDispersedAtTheBorder", title: "Dispersed at the Border", classification: "historical" },
      { id: "endingColumnScattered20", title: "The Column That Scattered", classification: "speculative" },
      { id: "endingLegionWithdraws", title: "The Legion Withdraws", classification: "speculative" },
    ],
    ENDING_CLASSIFICATION: {
      endingManchuria: "historical",
      endingBoldyrevsOmsk18: "speculative",
      endingOmskFalls19: "speculative",
      endingTheAdmiralAtIrkutsk20: "historical",
      endingManchuriaEarly: "speculative",
      endingDispersedAtTheBorder: "historical",
      endingColumnScattered20: "speculative",
      endingLegionWithdraws: "speculative",
    },

    resolveNode(nodeId, flags = {}, meters = {}) {
      switch (nodeId) {
        // -------------------------------------------------------------------
        case "omskCoup18":
          return {
            date: "NOVEMBER 1918",
            title: "Omsk: The Offer Kolchak First Refused",
            bulletin: {
              headline: "THE LEGION THAT MADE THIS WAR POSSIBLE",
              body: "There is a government to overthrow here because of an army that is not Russian. Roughly 50,000 men of the Czechoslovak Legion — former Austro-Hungarian prisoners organized under an emerging Czechoslovak National Council — were evacuating peacefully east under Bolshevik agreement. A clash at Chelyabinsk in May, followed by Moscow's order to disarm them outright, ended that agreement. The Legion answered by seizing the Trans-Siberian station by station. That seizure broke Bolshevik control of Siberia — not any Russian faction's own initiative.",
              meanwhile: {
                southRussia: "Seven months after Kornilov's death at Ekaterinodar, the Volunteer Army survives under Denikin, still a modest force based in the Kuban — not yet the major southern threat it becomes through 1919.",
                bolsheviks: "The Left SR uprising was crushed in July; an assassination attempt on Lenin himself in August has hardened the government's own security apparatus considerably. The Republic is fighting for its life on several fronts now, not just this one.",
              },
            },
            historicalRecord: true,
            situation:
              "Cossack troops under ataman Krasilnikov arrested the Directory's Socialist-Revolutionary members overnight, purging the government's left wing without your explicit order — though you did nothing to discourage it either. What remains of the Council of Ministers is now offering you, War Minister for barely two weeks, supreme power with emergency authority. You are on record as having refused it once already this morning.",
            choices: [
              {
                label: "Accept the offer. Take supreme power with full emergency authority as Supreme Ruler.",
                advisor: {
                  name: "Vologodsky",
                  quote:
                    "The Directory is already gone in every way that matters — the only open question left is whether Russia's government has one authority or none at all. I am asking you to accept the first option before events settle on the second for us.",
                },
                historical: true,
                setFlags: { omskCoupChoice: "accept" },
                impact: {},
                next: "springOffensive19",
                outcome:
                  "The office is accepted. You are named Supreme Ruler, promote yourself to full admiral, and inherit a government that exists because Cossacks it does not fully control decided it should. The Left SR reaction is immediate — a small Omsk uprising in late December is put down by the same Cossacks and Czech Legion troops who made this possible, roughly five hundred executed. It will not be the last time this government's authority over the men enforcing it is more theoretical than real.",
              },
              {
                label: "Press for a collective military council instead of sole authority, before accepting the role if that arrangement fails.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I did not ask to be the answer to this question by myself. I would rather propose that three of us hold this authority jointly than accept alone a title Cossacks I don't fully command just handed me by removing everyone who might have argued the point.",
                },
                historical: false,
                setFlags: { omskCoupChoice: "council_first" },
                impact: { rail: -2 },
                next: "reluctanceAftermath18",
                outcome:
                  "The Council of Ministers considers the proposal and rejects it within the day — a single authority is exactly what the cabinet was trying to establish by removing the Directory's left wing in the first place. You accept the Supreme Ruler title anyway, a few hours later than history recorded it, having spent those hours on record as reluctant rather than willing.",
              },
              {
                label: "Redirect the offer to Boldyrev, as you argued when it was first raised this morning — and mean it this time.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I told the Council this morning that the post belongs to Boldyrev, as a member of the Directory and its own commander-in-chief, and I meant it before I let myself be talked into a second conversation. He is still in this city. I am not going to spend the rest of the day being persuaded out of the answer I already gave once.",
                },
                historical: false,
                setFlags: { omskCoupChoice: "redirect_boldyrev" },
                impact: { rail: -1 },
                next: "boldyrevsFirstWeek18",
                outcome:
                  "The redirection holds this time. Boldyrev has not yet left for Japan — that departure, historically, is still ten days off — and he is in Omsk to receive an office he did not ask for from a War Minister who is refusing, for the second time today, to be the answer to a question that was never really about him personally.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — reached only by Kolchak following through on redirecting
        // the office to Boldyrev, which he raised in the room and then let
        // himself be argued out of. historicalRecord false for the premise;
        // Boldyrev's actual career facts used here (Union for the
        // Regeneration of Russia, the eventual Japan posting he does NOT
        // take on this branch, his real 1922 arrest and 1933 execution) are
        // documented and are deliberately NOT transplanted wholesale onto a
        // counterfactual government they never actually served — the
        // epilogue says so explicitly rather than papering over it.
        // ---------------------------------------------------------------------
        // Second chapter for the Boldyrev divergence — the ending previously
        // resolved after a single choice at omskCoup18, which is exactly the
        // shallow-fork pattern this project's own conventions rule out. Gives
        // the divergence one real decision of its own before it terminates.
        // Grounded in what actually distinguished Boldyrev's real politics:
        // the arrested Directory members (Avksentiev, Zenzinov, and others)
        // were expelled abroad rather than harmed, and a genuinely more
        // moderate Supreme Ruler is the one figure in the room with real
        // standing to argue for bringing them back into the government.
        case "boldyrevsFirstWeek18":
          return {
            date: "NOVEMBER 1918",
            title: "Omsk: The First Week",
            historicalRecord: false,
            context:
              "The Council of Ministers has already made its own preference clear: a single conservative authority, the Directory's moderate socialist wing removed from the government entirely. Avksentiev, Zenzinov, and the other arrested Directory members are being held for expulsion abroad rather than harmed — the Council's idea of restraint. Boldyrev's own political sympathies run the other way, toward the men now being escorted to the border.",
            situation:
              "A week into the office he twice tried to decline, Boldyrev has to decide what kind of government this actually is. Arguing for the arrested men's reinstatement costs him whatever goodwill the Council extended him for lack of an alternative in the room. Accepting their expulsion as settled keeps the peace with a cabinet that never wanted him and governs exactly as reactively as it would have under Kolchak.",
            choices: [
              {
                label: "Press for the arrested Directory members' reinstatement. Spend the goodwill; it's what the office is for.",
                advisor: {
                  name: "Boldyrev",
                  quote:
                    "I did not take this post to preside over the same government with a different name on the door. If I am not willing to spend what little standing I have on the one thing I actually believe, the Council can find someone who agrees with them completely and save us all the pretense.",
                },
                historical: false,
                setFlags: { boldyrevFirstWeek: "reinstatement_pressed" },
                impact: {},
                next: "endingBoldyrevsOmsk18",
                outcome:
                  "The Council refuses outright — Avksentiev and Zenzinov are already at the border, and reversing the expulsion now would read as reinstalling exactly the government the coup existed to remove. Boldyrev presses the argument anyway, and loses it in his first week, which tells every minister in the room exactly how much authority the new Supreme Ruler actually carries.",
              },
              {
                label: "Accept the expulsion as settled. A fight over it now costs more than it can possibly buy.",
                advisor: {
                  name: "Boldyrev",
                  quote:
                    "I have been in this office a week and I do not yet have the standing to win a fight with the Council over men already on a train to the frontier. I would rather keep the authority I have and spend it on something I can actually change than lose it in the first week proving a point that changes nothing for Avksentiev either way.",
                },
                historical: false,
                setFlags: { boldyrevFirstWeek: "expulsion_accepted" },
                impact: {},
                next: "endingBoldyrevsOmsk18",
                outcome:
                  "The expulsion stands unopposed. Boldyrev keeps the Council's tolerance and spends none of it — on this or, as it turns out, on much else. The government he presides over looks, in its first week, very much like the one Kolchak would have run.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — the mid-war collapse for Siberia. The campaign previously
        // jumped from November 1918 straight to February 1920; the entire
        // 1919 collapse, which is the actual substance of this front's
        // history, had no terminal outcome attached to it. Reached by losing
        // the rail argument with the Legion while the rail net is already
        // gone — the two things this whole campaign runs on.
        case "endingOmskFalls19":
          return {
            isEnding: true,
            title: "Omsk Falls",
            date: "NOVEMBER 1919",
            badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "The evacuation does not happen, because an evacuation requires trains and this government no longer commands any. The Legion holds the junctions; the government's own echelons sit on sidings east of the city while the Fifth Army enters it. What leaves Omsk leaves on foot, in November, in Siberia.\n\nHistorically Omsk fell on 14 November 1919 and the government got out — badly, chaotically, with the gold reserve and most of the ministries strung along the Trans-Siberian for two thousand miles, but out. That withdrawal was the thing that made the Great Siberian Ice March possible at all, and made Kappel's column, and Irkutsk, and eventually Chita. None of it is available to a command that reaches November with no rail control left to spend.\n\nKolchak is taken at Omsk rather than handed over at Irkutsk three months later. There is no Political Centre transaction, no Legion bargain, no interrogation transcripts running to nine sessions. The Supreme Ruler's government ends in the city it governed from, which is a tidier end than the historical one and not a better one — the record it leaves is shorter, and the men who would have walked two thousand miles to reach Chita mostly do not leave the Irtysh."
          };

        case "endingBoldyrevsOmsk18":
          return {
            isEnding: true,
            title: "Boldyrev's Omsk",
            date: "NOVEMBER 1918",
            badge: "◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "The Council of Ministers, having spent the morning removing the Directory's left wing specifically to install a single authority, is not enthusiastic about a redirection to a general most of them regard as barely less socialist than the men they just arrested. They accept it anyway, for lack of an alternative in the room, and Vasily Boldyrev — commander-in-chief of the Directory's own forces, a founding member of the Union for the Regeneration of Russia, and a man on record as more sympathetic to the moderate socialists than to the officers who just cleared his path — becomes Supreme Ruler instead of Kolchak." +
              (flags.boldyrevFirstWeek === "reinstatement_pressed"
                ? " He tests that reputation almost immediately, pressing for the arrested Directory members' reinstatement against a Council that refuses outright — and loses, in his first week, which settles the question of how much real authority came with the title."
                : flags.boldyrevFirstWeek === "expulsion_accepted"
                ? " He does not test that reputation. The Council's expulsion of the arrested Directory members stands unopposed, and the government he presides over looks, from its first week, very much like the one it replaced."
                : "") +
              "\n\nNone of this claims the war goes differently. The military position east of the Urals in November 1918 is what it is regardless of whose name is on the office — the numbers, the rail capacity, and the Red Army's growing organisational advantage were never a function of this specific appointment. A more moderate Supreme Ruler might hold the SR delegations closer and govern with less of the naked reaction that alienated the peasantry Kolchak's own government needed; whether that changes anything material by 1919 is a genuinely open question, and one the record does not settle" +
              (flags.boldyrevFirstWeek === "reinstatement_pressed"
                ? " — though a man who loses his first real fight with his own cabinet is not obviously the one who gets to answer it."
                : ".") +
              "\n\nWhat it does not do is follow Kolchak. He is a decorated admiral relieved of a title he twice tried to refuse, not a prisoner and not a target — where he goes and what becomes of him afterward is simply not part of this account — this account was always about the office, not the man. Boldyrev's own later record is real and is not quietly repurposed here: historically he went to Japan ten days after this point, returned to Vladivostok in 1920, signed a neutral-zone agreement with the Japanese as commander of the Far East's forces, was arrested when the Red Army took Vladivostok in November 1922, declared his willingness to serve the Soviet government, taught at a research institute in Novosibirsk for a decade, and was shot in August 1933 on a fabricated espionage charge. None of that happened to a man who was Supreme Ruler. A general who takes this office in November 1918 is not living that career, and no honest account can say which parts of it he keeps.",
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the council proposal being
        // rejected. historicalRecord false: this is what having the
        // reluctance on record does to how regional commanders read the new
        // government, not a documented event.
        case "reluctanceAftermath18":
          return {
            date: "NOVEMBER 1918",
            title: "Chita: What the Delay Signals",
            historicalRecord: false,
            situation:
              "Word of the hesitation has reached Ataman Semyonov in Chita before the ink on your acceptance is dry. He was never going to fully acknowledge Omsk's authority regardless — but a Supreme Ruler who is on record proposing to share the title looks, to a man already inclined to treat Omsk as one voice among several, like confirmation rather than news.",
            choices: [
              {
                label: "Address it directly. Send a formal communication asserting the title is not, in practice, negotiable.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I would rather correct the record now, plainly, than let a private hesitation calcify into a public precedent. Semyonov was never going to be an easy subordinate. I don't need to hand him a documented reason to be a harder one.",
                },
                historical: false,
                setFlags: { reluctanceResponse: "assert" },
                impact: { rail: -1 },
                next: "semyonovResponse18",
                outcome:
                  "The message goes out. Whether it actually changes Semyonov's calculation, or simply gives him a formal statement to point to as evidence Omsk feels the need to insist, is open. The roll answers it.",
                uncertain: (() => {
                  const landsWeight = modWeight(40, meterPct(meters.rail));
                  return [
                    {
                      weight: landsWeight,
                      title: "The assertion lands",
                      setFlags: { reluctanceOutcome: "accepted" },
                      impact: { rail: 2 },
                      outcome:
                        "Semyonov's public posture toward Omsk doesn't visibly change, but the private correspondence between his staff and the capital grows measurably more cooperative in the following weeks — a small, real gain that costs nothing further to have tried for.",
                    },
                    {
                      weight: 100 - landsWeight,
                      title: "The assertion reads as exactly the insistence it feared looking like",
                      setFlags: { reluctanceOutcome: "backfired" },
                      impact: { rail: -3 },
                      outcome:
                        "Semyonov's response is polite and entirely unchanged in substance. If anything, having a formal assertion of authority to not-quite-comply with gives his own staff a cleaner story for why cooperation with Omsk continues to lag.",
                    },
                  ];
                })(),
              },
              {
                label: "Let it pass without comment. A response risks confirming there was ever a real question to answer.",
                advisor: {
                  name: "Vologodsky",
                  quote:
                    "Silence has its own risk — it can read as confidence or as evasion depending entirely on who's already inclined to distrust you. With Semyonov, I suspect it reads as the latter regardless of what we actually do.",
                },
                historical: false,
                setFlags: { reluctanceResponse: "ignore" },
                impact: {},
                next: "springOffensive19",
                outcome:
                  "Nothing is said. Semyonov's cooperation with Omsk continues on the same limited, self-interested terms it was already operating on before any of this — the hesitation neither helped nor meaningfully worsened a relationship that was never going to be straightforward.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different content depending on how
        // Semyonov actually responded. historicalRecord false throughout.
        case "semyonovResponse18":
          if (flags.reluctanceOutcome === "accepted") {
            return {
              date: "DECEMBER 1918",
              title: "Chita: A Small, Real Opening",
              historicalRecord: false,
              situation:
                "The improved private correspondence with Semyonov's staff is slight but unmistakable — the kind of opening that could plausibly be built on with a further, concrete request, or left alone as a fragile gain not worth risking on a bigger ask. Whether to press for something more substantial while the door is genuinely, if narrowly, open is a real choice this rare cooperation has created.",
              choices: [
                {
                  label: "Press for something concrete — a specific commitment on rail cooperation — while the opening is real.",
                  advisor: {
                    name: "Kolchak",
                    quote:
                      "A private correspondence that grows warmer costs us nothing if we never actually spend it on anything. I would rather test what this opening is worth in practice than let it remain a pleasant but unused fact about Semyonov's staff.",
                  },
                  historical: false,
                  setFlags: { semyonovOpeningChoice: "pressed" },
                  impact: { rail: 2 },
                  next: "springOffensive19",
                  outcome:
                    "The request goes out, specific and concrete. It tests the opening rather than just enjoying it — and whatever the answer, it's an answer, not the ambiguous warmth of correspondence that was never actually asked to produce anything.",
                },
                {
                  label: "Leave it alone. A fragile gain not yet asked to prove anything is safer than one that's just been tested and found wanting.",
                  advisor: {
                    name: "Vologodsky",
                    quote:
                      "I understand the appeal of testing what we have. I would rather bank a small, real improvement than risk discovering, by asking for more, that it was smaller than it looked.",
                  },
                  historical: false,
                  setFlags: { semyonovOpeningChoice: "preserved" },
                  impact: { rail: 1 },
                  next: "springOffensive19",
                  outcome:
                    "The opening is left untested, preserved as a modest, real improvement rather than risked on a bigger ask. Whether that caution was warranted or simply left value on the table is a question this decision doesn't resolve either way.",
                },
              ],
            };
          }
          return {
            date: "DECEMBER 1918",
            title: "Chita: The Assertion That Didn\'t Land",
            bulletin: {
              headline: "THE ARMISTICE ENDS THE LEGION\'S REASON FOR BEING HERE",
              body: "The war the Czechoslovak Legion took up arms to reach ended on 11 November. A Czechoslovak state exists, recognised at Paris. The men holding the Trans-Siberian from Penza to Vladivostok are no longer soldiers working their way toward a front — they are an army waiting for ships, in a country whose civil war is not theirs. Their commanders have begun treating their remaining time in Russia as a question of extraction. Nothing about this government\'s dependence on that railway has changed.",
              meanwhile: {
                southRussia: "The Volunteer Army has been consolidated as the Armed Forces of South Russia under Denikin, and the Armistice has freed Allied shipping to reach Novorossiysk with supplies for the first time in quantity.",
                bolsheviks: "The Armistice annulled Brest-Litovsk. German forces are withdrawing from Ukraine, and the Red Army is moving into the vacuum they leave behind.",
              },
            },
            historicalRecord: false,
            situation:
              "The assertion backfired, and Semyonov's staff now has a cleaner story for continued non-cooperation than they had before Omsk tried to correct the record. Whether to escalate the assertion further — formally, on the record, risking an open rupture — or quietly let the matter drop and accept that this particular approach didn't work, is the real choice a failed assertion has left behind.",
            choices: [
              {
                label: "Escalate. A half-measure that backfired is worse than either full commitment or none — press the point formally.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I have already tried the moderate version of this and watched it hand Semyonov's staff an excuse instead of a correction. I am not inclined to leave the record standing at 'attempted and failed' when escalating it costs little more than the attempt already did.",
                },
                historical: false,
                setFlags: { assertionEscalation: "escalated" },
                impact: { rail: -2 },
                next: "springOffensive19",
                outcome:
                  "The assertion is pressed further, formally, on the record. It risks the open rupture the original message was specifically designed to avoid — an escalation of a relationship that was already the campaign's most persistent authority problem before this exchange made it more so.",
              },
              {
                label: "Let it drop. The approach didn't work; repeating it more forcefully isn't likely to work better.",
                advisor: {
                  name: "Vologodsky",
                  quote:
                    "I said at the outset that silence carries its own risk. I did not say every risk is worth answering with a bigger version of the same failed approach. Let this one go.",
                },
                historical: false,
                setFlags: { assertionEscalation: "dropped" },
                impact: {},
                next: "springOffensive19",
                outcome:
                  "The matter is allowed to drop. The relationship with Semyonov returns to its baseline — no worse than it was before the assertion, no better either, the whole exchange a real but ultimately inconclusive attempt to correct a problem that was never going to be solved by correspondence alone.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "springOffensive19":
          return {
            date: "MARCH 1919",
            title: "Omsk: The Spring Offensive",
            bulletin: {
              headline: "MOSCOW DECLARES FOR WORLD REVOLUTION",
              body: "A congress in Moscow this month declares itself the Communist International, aim stated plainly: revolution beyond Russia's own borders. Foreign delegate attendance was thin, several parties represented in name only — but the declaration answers the one question every Allied government has been weighing: whether Bolshevik Russia means to stay inside its own borders. On the record now, it does not.",
              meanwhile: {
                southRussia: "A comparatively quiet stretch for the AFSR — Denikin's forces regrouping through the winter before the summer offensive that becomes the Moscow Directive in July.",
                bolsheviks: "The Eighth Party Congress is meeting in this same city, this same month — the Military Opposition's fight over relying on ex-Imperial officers is being argued in parallel with the Comintern's own founding sessions.",
              },
            },
            historicalRecord: true,
            situation:
              "Your armies have broken the Red center and are approaching the Volga — the largest White force in Russia, at its historical high point. Denikin has written from the south, proposing a junction at Saratov for a combined march on Moscow. Gajda argues for continuing north instead, toward Vyatka and a link with the Allied force at Archangel." +
              (flags.assertionEscalation === "escalated"
                ? " The formal escalation with Semyonov has left the Transbaikal rear on worse terms than it was. Neither axis under discussion here can be supplied through a rear that is now openly contested."
                : flags.assertionEscalation === "dropped"
                ? " The Semyonov question was allowed to drop. The Transbaikal rear is exactly as reliable as it was before the attempt, which is to say the supply for either axis rests on an ataman's continued goodwill."
                : ""),
            choices: [
              {
                label: "Continue the northward drive toward Vyatka, pursuing the Archangel junction.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "The Allied force at Archangel is real, supplied, and waiting. Denikin's proposal asks us to abandon a plan already succeeding for one that exists only in a letter.",
                },
                historical: true,
                setFlags: { offensiveDirection: "north" },
                impact: {},
                next: "ufaCounteroffensive19",
                outcome:
                  "The northward push continues. It gains ground for another month before the overextension Denikin's letter warned about starts to show in the supply returns.",
              },
              {
                label: "Divert south toward Saratov, attempting the junction with Denikin's forces.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "Denikin is right that a combined front is worth more than two fronts advancing alone. Whether we can actually reach Saratov before the Red reserves reach us first is a separate question entirely.",
                },
                historical: false,
                setFlags: { offensiveDirection: "south" },
                impact: { manpower: -1, materiel: -1, rail: -1 },
                costsCapital: true,
                next: "saratovJunction19",
                outcome:
                  "The diversion order overrides Gajda's standing dispositions without his agreement — a decision that will not be forgotten. The southward march begins, exposed on a flank it was never prepared to defend.",
              },
              {
                label: "Neither flank. Concentrate on the central axis — drive straight west on Kazan and Nizhny Novgorod.",
                advisor: {
                  name: "Sakharov",
                  quote:
                    "Gajda wants Archangel and Denikin wants Saratov, and both of them are asking this army to march away from the only objective that ends the war. The Red centre is what broke in March. Kazan is the road to Moscow and it is open now in a way it will not be in June.",
                },
                historical: false,
                setFlags: { offensiveDirection: "centre" },
                impact: { manpower: -1, rail: 1 },
                aftermath:
                  "No central concentration was attempted. The Siberian Army went north under Gajda and the Western Army south-west under Khanzhin, and the gap between them was where Frunze's counteroffensive went in at Buguruslan in late April. Sakharov's argument for concentration was made at the time and made again at length in his 1923 emigre account, which is not a neutral source about a plan he proposed himself.",
                next: "ufaCounteroffensive19",
                outcome:
                  "Both flank proposals are refused and the weight goes to the centre. It concentrates a force that was dangerously dispersed, and it does so along the axis where the Red command has the shortest distance to reinforce — Kazan is close to Moscow in both directions.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the speculative southward-diversion
        // choice at the spring offensive. historicalRecord false throughout.
        case "saratovJunction19":
          return {
            date: "MAY 1919",
            title: "The Southern Flank",
            historicalRecord: false,
            situation:
              "The southward diversion toward Denikin has exposed a flank Gajda's original northern plan never had to worry about. Word from the south is that Denikin's own forces are pushing toward Tsaritsyn — the junction Kolchak proposed might genuinely be within reach. It might also be the reason the Red reserves massing to the east go unnoticed until they've already turned this army's undefended flank.",
            choices: [
              {
                label: "Continue toward the junction. The political value of a combined White front may be worth the flank risk.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "A combined front with Denikin is worth more to the movement than any ground either of us holds alone. That calculation is considerably easier to make from a desk in Omsk than it will be to defend on the flank it actually costs, and I am not going to pretend otherwise to make it sound braver.",
                },
                historical: false,
                setFlags: { saratovChoice: "continue" },
                impact: { manpower: -4, rail: -2 },
                next: "exposedFlank19",
                outcome:
                  "The push continues. The exposed flank is exactly as costly as feared — by the time contact with Denikin's forces looks even theoretically possible, the eastern reserves this diversion ignored have already begun the counteroffensive that was always coming regardless.",
              },
              {
                label: "Pull back from the junction attempt and shore up the exposed flank instead.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "I opposed this diversion from the start, but I will not pretend reversing it now is free. It is still better than losing the flank entirely to a counteroffensive we should have seen coming the moment we turned south.",
                },
                historical: false,
                setFlags: { saratovChoice: "withdraw" },
                impact: { manpower: 2, rail: 3 },
                next: "ufaCounteroffensive19",
                outcome:
                  "The withdrawal from the junction attempt happens in time to matter, if only barely. The flank holds a little longer than it otherwise would have — not because the underlying position was ever strong, but because the exposure was corrected before the counteroffensive fully arrived.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of continuing the Saratov push.
        // historicalRecord false throughout: this is what the ignored
        // eastern reserves actually do once they arrive, not a documented
        // event.
        case "exposedFlank19":
          return {
            date: "MAY 1919",
            title: "The Flank: What the Reserves Found",
            historicalRecord: false,
            situation:
              "The eastern reserves have reached the flank the southward push left uncovered, and they haven't wasted the opening. What's left of the army pressing toward Saratov now has to decide whether to abandon the junction attempt outright to meet the threat, or trust that the political value of reaching Denikin is still worth fighting through an active counteroffensive rather than turning to face it.",
            choices: [
              {
                label: "Turn to meet the counteroffensive directly. The junction can wait; the flank can't.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "I told you what this would cost when you overruled me. I am not going to spend more time being right about it than it takes to actually turn this army around and face the threat that's already here.",
                },
                historical: false,
                setFlags: { exposedFlankChoice: "turn_to_meet" },
                impact: { manpower: -2, rail: 2 },
                next: "ufaCounteroffensive19",
                outcome:
                  "The army turns to face the threat rather than press on. It costs the Saratov attempt entirely — the junction that was never going to happen anyway is now also not going to be the reason this army says it turned back.",
              },
              {
                label: "Press on toward Saratov anyway. Fight through the counteroffensive rather than let it dictate the campaign's direction.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "There is an argument for turning back, and I have heard it stated correctly. What I do not believe is that an army which reverses its own strategic direction every time a Red counteroffensive materializes was ever going to reach a junction with anyone, on any axis, at any point in this war.",
                },
                historical: false,
                setFlags: { exposedFlankChoice: "press_on" },
                impact: { manpower: -3, rail: -2 },
                next: "ufaCounteroffensive19",
                gate: (m) => m.manpower >= -5,
                disabledReason: "fighting through an active counteroffensive requires an army still capable of fighting through one — this force is already too depleted to press on rather than turn.",
                outcome:
                  "The push continues through the counteroffensive rather than around it. It costs considerably more than turning to meet the threat would have — and it doesn't produce a junction with Denikin either, since the Red reserves were never actually the only obstacle between here and Saratov.",
              },
            ],
          };

        case "ufaCounteroffensive19":
          return {
            date: "JUNE 1919",
            title: "Ufa: The Red Counteroffensive",
            bulletin: {
              headline: "PARIS WILL RECOGNISE OMSK. ON CONDITIONS.",
              body: "The Allied Supreme Council has replied to this government\'s request for recognition with terms rather than an answer: a commitment to convene a Constituent Assembly, to accept the independence of Poland and Finland, to honour Russia\'s foreign debts, and to submit other border questions to the League of Nations. Recognition is offered against a promise about what this government would do after winning a war it is currently losing. Denikin has already accepted this command\'s seniority; the Allies have not.",
              meanwhile: {
                southRussia: "Denikin took Kharkov in June and is preparing the order that becomes the Moscow Directive — the southern front at its strongest exactly as this one breaks.",
                bolsheviks: "The Red counteroffensive out of Buguruslan has already reversed the spring advance. Moscow\'s attention is turning south, toward the front that is still growing.",
              },
            },
            historicalRecord: true,
            situation:
              "The Red counteroffensive has broken through and retaken Ufa. Your armies are falling back toward the Urals with their supply lines already strained. The mountains offer a natural defensive line — but holding them means committing reserves you may need for the much longer retreat behind them." +
              (flags.offensiveDirection === "north"
                ? " The northern drive toward Vyatka and the Archangel junction is now a salient pointing at nothing, and the units in it are the ones furthest from the line the Urals would have to be held with."
                : flags.offensiveDirection === "south"
                ? " The southward diversion toward Denikin never reached him, and the counteroffensive has arrived while the army is still strung out along an axis chosen for a junction that did not happen."
                : flags.offensiveDirection === "centre"
                ? " The army went west in one body rather than splitting toward Archangel or Saratov, so there is no gap between two armies for the counteroffensive to enter. It has come at the concentration head-on instead, which is a different problem and not obviously a smaller one."
                : ""),
            choices: [
              {
                label: "Stand at the Urals. Commit the reserves to holding the line.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "Give up the mountains without a fight and there is no natural line between here and Omsk. We hold here, or we do not hold anywhere.",
                },
                historical: false,
                setFlags: { uralsStand: true },
                impact: { manpower: -3, materiel: -2, rail: 3 },
                next: "chelyabinskGrinder19",
                gate: (m) => m.manpower >= -3 && m.materiel >= -5,
                disabledReason: "Holding a fixed line requires reserves to commit and the matériel to equip them — the reserves exist on paper and cannot be armed to stand.",
                outcome:
                  "The reserves go into the Urals line. It slows the Red advance for several weeks — at a cost the army can less and less afford to pay again.",
              },
              {
                label: "Withdraw in good order toward the Trans-Siberian. Preserve the army for the line at Omsk.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "The mountains are not the war. The railway is the war — it is the only thing keeping this army fed, armed, and moving. Spend men holding rock and you will still lose the line that matters.",
                },
                historical: true,
                setFlags: { uralsStand: false },
                impact: {},
                next: "railPriority19",
                outcome:
                  "The withdrawal continues past the Urals largely intact. But it concedes the last natural obstacle between the front and Omsk itself, with nothing but open steppe and a single rail line behind it.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of committing reserves to a stand at
        // the Urals. historicalRecord true: the battle for Chelyabinsk and
        // its outcome are real regardless of exactly how command handles the
        // counterattack decision within it.
        case "chelyabinskGrinder19":
          return {
            date: "JULY 1919",
            title: "Chelyabinsk: The Grinder",
            bulletin: {
              headline: "DENIKIN AT HIS HIGH-WATER MARK",
              body: "This front is fighting for a rail junction it cannot afford to lose, in the same weeks the southern White front reaches the furthest extent of its own advance. Two theatres, one movement, moving in opposite directions.",
              meanwhile: {
                southRussia: "Kharkov fell to Denikin's forces at the end of June. On 3 July he issues the Moscow Directive, ordering a broad-front advance on the capital — the most ambitious single order of the entire war, and the one the southern command is currently executing at full confidence.",
                bolsheviks: "The 'Military Opposition' fight from March's Party Congress is still unsettled in practice even where it was formally resolved on paper. Trotsky remains under real internal criticism even as the southern front, the one actually threatening Moscow, continues to worsen.",
              },
            },
            historicalRecord: true,
            situation:
              "The reserves committed to the Urals line have reached Chelyabinsk, and General Diterichs is proposing a counterattack to retake the city's rail junction before Frunze's 3rd Army can fully consolidate around it — a strike that, if it works, could stabilize the whole southern flank of the retreat. Frunze's forces are already massing for exactly this contingency." +
              (flags.uralsStand === true
                ? " These are the reserves committed to standing at the Urals rather than withheld for the retreat behind it. Diterichs is proposing to spend them a second time, on the argument that the first commitment only makes sense if it is followed through."
                : ""),
            choices: [
              {
                label: "Commit to Diterichs' counterattack. Throw the reserves into retaking the city.",
                advisor: {
                  name: "Diterichs",
                  quote:
                    "Today the army must deliver a decisive blow to the Chelyabinsk group, or every mile we have already spent holding the Urals line was spent for nothing. This is the moment that decision either pays for itself or doesn't.",
                },
                historical: true,
                setFlags: { chelyabinskChoice: "counterattack" },
                impact: {},
                next: "railPriority19",
                outcome:
                  "The counterattack goes in on July 29 — directly into Frunze's prepared flanking strike. What follows becomes known simply as the Chelyabinsk grinder: roughly 15,000 men captured, the reserves that were meant to stabilize the southern flank instead consumed by it. The army does not recover its strategic initiative after this. It never really had the chance to.",
              },
              {
                label: "Decline the counterattack. Pull the reserves back to a more defensible line rather than commit them to urban fighting.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I do not relish overruling Diterichs on the ground. I relish even less the prospect of losing the reserves we already sacrificed the Urals timeline to preserve, in a fight inside a city Frunze has clearly built his own plan around.",
                },
                historical: false,
                setFlags: { chelyabinskChoice: "withdraw" },
                impact: { manpower: 3 },
                next: "diterichsOverruled19",
                outcome:
                  "The counterattack is called off. The reserves survive intact — the grinder simply doesn't happen this way. What doesn't change is the broader collapse: Chelyabinsk falls regardless, the strategic initiative is gone regardless, and this choice's real effect is on how many men are still alive to retreat further, not on whether the retreat itself continues.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of overruling Diterichs on the
        // ground. historicalRecord false: the specific aftermath is
        // invented, but it tests something real already in his own dossier
        // — a man who would go on to frame his own last command, two years
        // later, explicitly as a religious crusade. Being overruled here, by
        // an admiral he privately regards as a British-installed political
        // appointee rather than a real soldier, is exactly the kind of
        // grievance that account makes plausible.
        case "diterichsOverruled19":
          return {
            date: "AUGUST 1919",
            title: "The General Overruled",
            historicalRecord: false,
            situation:
              "Diterichs has accepted the countermanded order without public objection — but the request to relieve him of Third Army command, quietly submitted the following week, is sitting on your desk. Whether to accept it and let him go, or refuse it and keep a capable but visibly resentful general in place, is a real command decision with no clean answer.",
            choices: [
              {
                label: "Accept the resignation request. A commander who no longer trusts your judgment isn't one you can rely on regardless of his competence.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I would rather lose a capable general who has already told me, in every way but directly, that he does not trust this command's judgment, than keep him in place and discover exactly how far that distrust extends the next time I need to overrule him.",
                },
                historical: false,
                setFlags: { diterichsHandling: "released" },
                impact: { manpower: -1 },
                next: "thirdArmySuccessor19",
                outcome:
                  "Diterichs is released from Third Army command. The Eastern Front loses a genuinely capable officer over a disagreement that, in the broader collapse already underway, may not have mattered much either way — but the precedent of a general who can simply request his way out of a command he disagrees with is its own real cost.",
              },
              {
                label: "Refuse the request. Keep Diterichs in command and address the resentment directly rather than lose the officer.",
                advisor: {
                  name: "Diterichs",
                  quote:
                    "I did not submit that request lightly, and I will not pretend a refusal resolves what prompted it. But if you are asking me to stay, I will stay — competently, and without the illusion that this settles what I actually think about how that order was given.",
                },
                historical: false,
                setFlags: { diterichsHandling: "retained" },
                impact: { manpower: 2 },
                next: "railPriority19",
                outcome:
                  "Diterichs stays. The competence is retained; the resentment isn't resolved, only deferred — carried forward, unaddressed, into a command relationship that this decision has made no more trusting than it already wasn't.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of releasing Diterichs. historical-
        // Record false: this specific succession decision is invented.
        case "thirdArmySuccessor19":
          return {
            date: "SEPTEMBER 1919",
            title: "Third Army: Who Replaces a Capable General",
            historicalRecord: false,
            situation:
              "Third Army needs a new commander, and the two realistic candidates represent a trade-off this command has faced before: a proven but politically cautious senior officer with no independent standing to challenge future orders, or a less experienced but genuinely talented younger commander whose independence is exactly what made Diterichs difficult in the first place.",
            choices: [
              {
                label: "Promote the cautious senior officer. Competence that won't argue is worth more right now than competence that might.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I have just spent a command decision on a general whose independence became a liability. I am not eager to install his replacement's replacement on the same trajectory within the year.",
                },
                historical: false,
                setFlags: { thirdArmySuccessor: "cautious" },
                impact: { manpower: -1, rail: 1 },
                next: "railPriority19",
                outcome:
                  "The cautious officer takes command. Third Army gets a commander unlikely to repeat Diterichs' problem — and, by the same logic, one less likely to make the kind of independent judgment call that occasionally justified Diterichs' confidence in the first place.",
              },
              {
                label: "Promote the talented but independent younger officer. The Front needs genuine ability more than it needs another compliant appointment.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I understand the caution after Diterichs. I would still rather have a commander capable of a genuinely good independent decision under pressure than one whose main qualification is being unlikely to make one at all.",
                },
                historical: false,
                setFlags: { thirdArmySuccessor: "independent" },
                impact: { manpower: 2, rail: -1 },
                next: "railPriority19",
                outcome:
                  "The independent officer takes command. Third Army gets the talent — and this command has, by its own recent history, just accepted the risk that the next disagreement over an order won't stay as contained as this one eventually was.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "railPriority19":
          return {
            date: "NOVEMBER 1919",
            title: "Omsk: The Evacuation Trains",
            historicalRecord: true,
            context:
              "The Trans-Siberian east of Omsk is a single track. Roughly 60,000 Czechoslovak Legion troops control its stations and junctions under an arrangement that made them responsible for guarding the line rather than fighting on it, and their commander answers to the French general Maurice Janin, not to Omsk. Kolchak's own train carries what remains of the imperial gold reserve seized at Kazan in 1918 — some 500 tons of bullion. Omsk falls on 14 November. Roughly a million refugees, soldiers, and officials are trying to move east along one line at the same time.",
            situation:
              "Omsk is being evacuated. The Trans-Siberian has one track and far more trains than it can move at once — government trains, army trains, refugee trains, and the Czechoslovak Legion's own trains, all converging on the same line. The Legion controls the junctions. What moves, and in what order, is no longer entirely your decision to make." +
              (flags.diterichsHandling === "released"
                ? " Diterichs, who argued for abandoning Omsk before it came to this, is no longer in a position to say so. The evacuation he wanted is happening on the schedule he warned it would happen on."
                : flags.diterichsHandling === "retained"
                ? " Diterichs is still in command and has not mentioned that he argued for abandoning Omsk before it came to this. His staff have mentioned it for him."
                : "") +
              (flags.thirdArmySuccessor === "independent"
                ? " Third Army's new commander has already begun making dispositions without waiting for confirmation from a headquarters that is currently loading onto trains."
                : flags.thirdArmySuccessor === "cautious"
                ? " Third Army's new commander is waiting for orders from a headquarters that is currently loading onto trains, which is exactly the behavior he was promoted for."
                : ""),
            choices: [
              {
                label: "Assert priority for the government and gold reserve trains over the Legion's own.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "The Legion has fought alongside us for a year and profited from every mile of that railway. If they will not yield the junction to their own government's evacuation, say so plainly and we will know exactly where we stand.",
                },
                historical: true,
                setFlags: { railPriorityAsserted: true },
                impact: { materiel: -1 },
                costsCapital: true,
                gate: (m) => m.rail >= -4,
                disabledReason: "Rail control too degraded — the Legion holds the junctions outright and a demand from this headquarters would not reach the men operating the switches.",
                aftermath:
                  "The Legion did not yield the junctions. Kolchak's train was repeatedly sidetracked in favour of Legion echelons through November and December, and he was reduced to travelling under Legion guard rather than his own. The Supreme Ruler of Russia spent the last two months of his government waiting on sidings for permission to move along a railway his government nominally owned.",
                next: "iceMarchDecision19",
                outcome:
                  "The order is given. Whether the Legion honors it, and what that answer costs the authority of a government that no longer controls its own evacuation, is written next.",
              },
              {
                label: "Concede priority to the Legion's trains and negotiate passage for the rest.",
                advisor: {
                  name: "Sakharov",
                  quote:
                    "You do not have the leverage to make demands of the men holding the only railway east of here. I argued once for concentrating this army instead of splitting it, and lost that argument too — I am not going to lose a second one to pride when the answer is this obvious. Negotiate, and you may still get your trains through. Demand, and you will not.",
                },
                historical: false,
                setFlags: { railPriorityAsserted: false },
                // Conceding priority is the pragmatic call — unless the rail
                // position is already so bad that conceding means having nothing.
                nextIf: (m) => (m.rail <= -6 ? "endingOmskFalls19" : null),
                impact: { rail: 1 },
                next: "janinsWord19",
                outcome:
                  "The concession is made quietly, without an order on record. Whether yielding the junction buys the Legion's continued cooperation, or merely postpones the same betrayal by a few weeks once Bolshevik forces are closer to Irkutsk, is a real point of dispute — the Legion's own command was neither unified nor fully in control of its constituent units by this point in the retreat. Which way it fell here is rolled.",
                uncertain: (() => {
                  const cooperativeWeight = modWeight(40, meterPct(meters.rail));
                  return [
                    {
                      weight: cooperativeWeight,
                      title: "The concession buys real cooperation",
                      setFlags: { legionOutcome: "cooperative" },
                      impact: { rail: 2 },
                      outcome:
                        "The Legion honors the arrangement further than expected. It is not loyalty — it is self-interest in an orderly eastward evacuation — but for now the government trains keep moving.",
                    },
                    {
                      weight: 100 - cooperativeWeight,
                      title: "The concession only delays the reckoning",
                      setFlags: { legionOutcome: "delayed_betrayal" },
                      impact: { rail: -2 },
                      outcome:
                        "Individual Legion units continue prioritizing their own trains regardless of the arrangement. The concession bought weeks, not safety — and the question of what happens when Bolshevik forces close on Irkutsk has only been postponed.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of conceding rail priority to the
        // Legion. Both choices historical:false — General Janin's actual
        // betrayal of Kolchak happens on a fixed historical timeline (January
        // 1920) regardless of this earlier choice, so nothing here is trying
        // to avert it. What differs is whether the government's own posture
        // toward Janin's guarantee going in is trusting or wary.
        case "janinsWord19":
          return {
            date: "DECEMBER 1919",
            title: "The General's Word",
            historicalRecord: false,
            situation:
              "With rail priority already conceded, General Janin — the Allied commander who actually controls whether the Legion cooperates at all — is offering something more formal: his personal guarantee of safe passage for the Supreme Ruler's train, in exchange for placing the evacuation openly under his protection rather than negotiating piecemeal with individual Legion units.",
            choices: [
              {
                label: "Accept Janin's guarantee. Place the evacuation formally under Allied protection.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I do not particularly trust a general who regards me as a British instrument he was never consulted about installing. I trust the alternative — negotiating separately with every Legion unit between here and Irkutsk — even less.",
                },
                historical: false,
                setFlags: { janinChoice: "accepted" },
                impact: { rail: 3, materiel: 2 },
                next: "irkutskUltimatum20",
                outcome:
                  "The guarantee is accepted, formally, in writing. It changes nothing about what happens in January — Janin gives his word to protect Kolchak and orders the handover to the Political Centre days later regardless. Among White émigrés afterward, he becomes known simply as 'the general without honor.' This choice bought a smoother December. It did not buy a different January.",
              },
              {
                label: "Decline the formal guarantee. Continue negotiating passage independently rather than depend on Janin's word.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "A guarantee that depends entirely on one foreign general's discretion is not a guarantee — it is a hope with better paperwork. I would rather retain whatever independent leverage this government still has than trade it for a document.",
                },
                historical: false,
                setFlags: { janinChoice: "declined" },
                impact: { rail: -2, materiel: -2 },
                next: "irkutskUltimatum20",
                outcome:
                  "The formal guarantee is declined. It does not meaningfully change the eventual outcome — Janin's authority over the Legion's cooperation was never actually contingent on Kolchak's own consent to it — but whether independent negotiation in the following weeks buys any marginal improvement in the trains' treatment is unsettled. The roll settles it.",
                uncertain: (() => {
                  const gainsWeight = modWeight(30, meterPct(meters.rail));
                  return [
                    {
                      weight: gainsWeight,
                      title: "Independent negotiation buys small, real concessions",
                      setFlags: { janinDeclinedOutcome: "marginal_gain" },
                      impact: { rail: 2 },
                      outcome:
                        "Working the individual Legion units directly, rather than through Janin's office, produces a handful of small, real concessions on train scheduling. It changes nothing about January. It changes something about the weeks leading up to it.",
                    },
                    {
                      weight: 100 - gainsWeight,
                      title: "Independent negotiation gains nothing Janin's guarantee wouldn't have",
                      setFlags: { janinDeclinedOutcome: "no_gain" },
                      impact: { rail: -1 },
                      outcome:
                        "The individual units defer to Janin's office regardless of who's asking. Declining the formal guarantee preserved a principle without buying any practical advantage over the alternative.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        case "iceMarchDecision19":
          return {
            date: "DECEMBER 1919",
            title: "The Trakt: Who Rides, Who Walks",
            historicalRecord: true,
            situation:
              "Krasnoyarsk has fallen and the Trans-Siberian behind it is no longer a way out. What remains of the army under General Kappel is striking east overland, across the frozen Kan and Yenisei, in temperatures that kill exposed skin in minutes. A typhus outbreak is spreading through the column. The sick and wounded are slowing the march to a pace that may cost everyone still capable of walking their chance of reaching Chita alive." +
              (flags.railPriorityAsserted === true
                ? " The order asserting government priority over the Legion's trains is what the overland march is the answer to. It was given, it was not honored, and the column is walking."
                : flags.railPriorityAsserted === false
                ? " Priority was conceded to the Legion rather than demanded from it. The concession bought passage for some trains and not for this column, which is walking regardless."
                : ""),
            choices: [
              {
                label: "Press forward at full pace. Combat-effective troops keep moving; the worst-off are left with the trains that can no longer keep up.",
                advisor: {
                  name: "Kappel",
                  quote:
                    "I take no comfort in this order, and I will not pretend to anyone that I do. But a column that stops for every man who cannot walk becomes a column that saves no one — least of all the men we stopped for.",
                },
                historical: true,
                setFlags: { iceMarchPolicy: "press_forward" },
                impact: {},
                next: "irkutskUltimatum20",
                outcome:
                  "The order goes out and the column keeps moving. Entire trainloads of typhus-stricken men are left behind on the track — some rail cars freeze shut with the sick still inside them. It is the decision the record actually shows: roughly 30,000 reach Chita by March. The ones who don't are not softened by the operational logic that left them.",
              },
              {
                label: "Hold the column together. The sick and wounded stay with the main body regardless of pace.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I understand the arithmetic against this. I am telling you that an army which abandons its own sick to freeze in locked railcars is not an army I am confident will hold together for whatever comes after this march, whatever the pace bought us.",
                },
                historical: false,
                setFlags: { iceMarchPolicy: "held_together" },
                impact: { manpower: -2 },
                costsCapital: true,
                next: "eichesPursuit20",
                outcome:
                  "The column moves as one, at the pace of its slowest wagons. Whether the men and matériel this costs against the pursuing Red 5th Army are outweighed by whatever cohesion a column that didn't abandon its own sick carries forward is a real, unresolved question — the historical record shows what leaving them cost in lives saved by speed. It does not show what holding together would have cost in everything else.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of holding the column together at a
        // slower pace. historicalRecord false: this specific engagement is
        // invented, but Genrich Eiche's Red 5th Army pursuit of the retreat
        // is real, and the reduced pace is a direct, checkable consequence
        // of the choice at iceMarchDecision19.
        case "eichesPursuit20":
          return {
            date: "JANUARY 1920",
            title: "The Distance Eiche Closed",
            historicalRecord: false,
            situation:
              "The slower pace has cost the column exactly what it was expected to: Genrich Eiche's pursuing Red 5th Army has closed the gap enough that its advance elements are now in contact with the rearguard. Voitsekhovsky has to decide whether to turn and fight to buy the main column time, or keep moving and accept that the rearguard will absorb whatever the pursuit throws at it without support." +
              (flags.iceMarchPolicy === "held_together"
                ? " The column was kept together at the pace of its slowest wagons rather than broken into a fast element and an abandoned one. This contact is the bill for that decision, arriving on schedule."
                : ""),
            choices: [
              {
                label: "Turn the rearguard to fight. Buy the column time at the cost of the men holding the line.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I did not argue for holding the column together so that the first contact with Eiche's advance guard scatters it anyway. A rearguard that actually fights buys real distance. One that simply keeps retreating buys nothing but a shorter chase.",
                },
                historical: false,
                setFlags: { eichePursuitChoice: "fight" },
                impact: { manpower: -3 },
                next: "irkutskUltimatum20",
                gate: (m) => m.manpower >= -3,
                disabledReason: "a rearguard that fights needs a rearguard capable of fighting — this column's manpower is already too depleted to spare one.",
                outcome:
                  "The rearguard turns and holds long enough for the column to widen its lead. It's a small vindication of the choice to hold together in the first place — bought, as everything on this march has been, at a cost measured in the men who did the holding.",
              },
              {
                label: "Keep the whole column moving. Accept the rearguard's exposure rather than slow down further to support it.",
                advisor: {
                  name: "A Column Staff Officer",
                  quote:
                    "General Kappel made the argument for speed himself, before the frostbite took him off the column entirely. I am only repeating it now because he no longer can. I am not going to pretend slowing down again to reinforce a rearguard skirmish is free — but it was never his argument that it would be.",
                },
                historical: false,
                setFlags: { eichePursuitChoice: "continue" },
                impact: { manpower: 1 },
                next: "irkutskUltimatum20",
                outcome:
                  "The column keeps moving without turning to reinforce the contact. The rearguard absorbs what the pursuit throws at it alone — costly in a different way than the fight would have been, and no cleaner a resolution to the argument this whole branch started with.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "irkutskUltimatum20":
          return {
            date: "FEBRUARY 1920",
            title: "Irkutsk: The Ultimatum",
            bulletin: {
              headline: "THE OTHER WHITE FRONT IS ALSO COLLAPSING",
              body: "Not the only White army in general retreat this month. Two thousand miles west, the same arithmetic runs on its own schedule, against its own version of the same exhausted logistics.",
              meanwhile: {
                southRussia: "Denikin's own front has broken entirely. Novorossiysk, the port his retreating army is converging on, will be the site of a chaotic evacuation within weeks — tens of thousands left on the docks, the Cossack formations that made up much of his army effectively dissolving as organized units.",
                bolsheviks: "With Denikin's collapse in the south now visible and this front's own end approaching, Moscow's attention is beginning to turn toward a question that will define the rest of the year: how far west the Red Army's own ambitions should now reach.",
              },
            },
            historicalRecord: true,
            situation:
              "Kappel is dead; Voitsekhovsky commands what is left of the army, one day's march from Irkutsk, where the Political Centre holds Kolchak prisoner. An ultimatum has already gone to the city: let the army pass unopposed, and release the Admiral. The Reds have not answered it with a release. They have answered it with defenses.",
            choices: [
              {
                label: "Attack. Force the issue at Irkutsk and try to take Kolchak back by strength.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "He would not have left any of us to a Political Centre firing squad if the positions were reversed, and I am not prepared to be the man who decided it was more practical to leave him to one. We go in.",
                },
                historical: true,
                setFlags: { irkutskChoice: "assault" },
                impact: {},
                uncertain: [
                  {
                    title: "The column holds together and goes on east",
                    weight: 70,
                    setFlags: { irkutskAssaultOutcome: "column_survives" },
                    impact: { manpower: -2 },
                    next: "semyonovMerger20",
                    outcome:
                      "The assault reaches Innokentievskaya, seven kilometers from the city, before the line holds. Kolchak is executed before dawn on February 7 — the Bolshevik command's own stated reason is to remove the army's motive for taking the city at all. By the 8th, what is left of the army bypasses Irkutsk and continues east without him, still recognisably a formation.",
                  },
                  {
                    title: "The assault breaks the column as well as failing",
                    weight: 30,
                    setFlags: { irkutskAssaultOutcome: "column_broken" },
                    impact: { manpower: -3 },
                    next: "endingTheAdmiralAtIrkutsk20",
                    outcome:
                      "The assault reaches Innokentievskaya and stops there. Kolchak is shot before dawn on February 7. What breaks with him is the column's own reason to remain a column — the formation that historically bypassed the city and went on does not re-form here, and the men who tried to reach him go east as individuals or not at all.",
                  },
                ],
                next: "semyonovMerger20",
                outcome:
                  "The order goes out. Voitsekhovsky's men move on the city with the Admiral seven kilometers away and a Political Centre garrison between.",
              },
              {
                label: "Do not attack. Accept the Political Centre's terms and bypass the city, prioritizing the army's survival over the rescue.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I have already told you what I think of leaving him. I am telling you now, separately, what a failed assault against a fortified city with an army this exhausted actually costs — because that arithmetic does not go away just because the other argument is the more honorable one.",
                },
                historical: false,
                setFlags: { irkutskChoice: "bypass" },
                impact: { manpower: 3 },
                next: "semyonovMerger20",
                outcome:
                  "The army bypasses Irkutsk without contesting it. Kolchak is executed regardless, on the same timeline, for the same stated reason — the Bolshevik command was not, in the end, negotiating in good faith on his release either way. What this choice changes is not his fate. It is how many of the men following Voitsekhovsky are still alive to reach Chita.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // ENDING — the campaign ending at Irkutsk in February 1920 rather than
        // at the Manchurian border eight months later. Every other ending in
        // this campaign is a variant of "where did the column get to"; this is
        // the one where the government itself ends, and it ends first.
        // Reached by pressing the assault at Irkutsk and having it fail badly
        // enough that the column stops being an army with anywhere to go.
        // historicalRecord true for everything it describes: the handover, the
        // execution, and the Ushakovka.
        case "endingTheAdmiralAtIrkutsk20":
          return {
            isEnding: true,
            title: "The Admiral at Irkutsk",
            date: "FEBRUARY 1920",
            badge: "◆ HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "The assault does not take the city, and after it fails there is no longer a government to retreat on behalf of. Kolchak was handed to the Political Centre by the Czechoslovak Legion on 15 January 1920, passed from them to the Bolshevik Revolutionary Committee, interrogated over nine sessions whose transcripts survive, and shot alongside his prime minister Viktor Pepelyaev before dawn on 7 February. The bodies were pushed under the ice of the Ushakovka. There is no grave.\n\nWhat this account records is not the death — that was never in doubt — but the fact that this command spent itself trying to prevent it and stopped existing in the attempt. Kappel was already dead of frostbite and pneumonia at Utai three weeks earlier. Voitsekhovsky's column, which historically bypassed the city and went on to reach Chita and then Manchuria as a formation, does not do so here. Men go east in groups, or they do not go east.\n\nThe Supreme Ruler's government lasted fourteen months. It was recognised by nobody who mattered, funded by a gold reserve it could not move along its own railway, and defended at the end by an army that had to choose between saving him and saving itself. Choosing him was defensible, and it was also the end of both.",
          };

        case "semyonovMerger20":
          return {
            date: "MARCH 1920",
            title: "Chita: A Loathed Necessity",
            historicalRecord: true,
            situation:
              "What is left of the army has reached Transbaikal, and with it, Ataman Semyonov — a Japanese-backed warlord whose own troops have a documented reputation for theft, arson, and murder against the civilians they're supposed to be protecting. Voitsekhovsky's officers loathe him without exception. He also controls the only functioning territory and supply base left to retreat into. He is offering to fold what remains of the Eastern Front into his own command as a single Far Eastern Army." +
              (flags.irkutskChoice === "assault"
                ? " The assault at Innokentievskaya spent men this column no longer has, and did not recover the Admiral. Semyonov is making his offer to a force that arrives smaller than it needed to be and without the man whose authority would have been the argument against accepting."
                : flags.irkutskChoice === "bypass"
                ? " Bypassing Irkutsk preserved the column at the cost of leaving Kolchak to the Political Centre. Semyonov is making his offer to officers who are intact, and who know exactly what was traded to keep them that way."
                : "") +
              (flags.irkutskAssaultOutcome === "column_survives"
                ? " That the column re-formed at all after Innokentievskaya is the only reason there is anything here for Semyonov to fold into his command. It was not a certainty on the night, and the officers who held it together know how close it ran."
                : ""),
            choices: [
              {
                label: "Accept the merger. Fold the army into Semyonov's command structure to survive the winter.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I do not ask any of you to respect him. I ask you to recognize that an army that refuses shelter on principle, in this condition, in this season, is not making a stand — it is simply choosing a slower way to stop existing.",
                },
                historical: true,
                setFlags: { semyonovChoice: "merged" },
                impact: {},
                costsCapital: true,
                next: "chitaFall20",
                outcome:
                  "The Far Eastern Army is formed, nominally unified, in practice an uneasy coalition the officers who agreed to it did not stop resenting. It will not hold together for long — the same command tension that made this decision hard does not resolve just because the merger went through.",
              },
              {
                label: "Refuse. Attempt independent passage toward Manchuria rather than serve under Semyonov.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I have said what I think of him plainly enough already. What I have not said is what an unsupplied march to the Chinese border, right now, in the state this army is actually in, is likely to cost — and I do not think that cost is smaller than the one we're trying to avoid.",
                },
                historical: false,
                setFlags: { semyonovChoice: "refused" },
                impact: { manpower: -3 },
                next: "manchurianBorder20",
                outcome:
                  "The army moves independently rather than merge. It reaches Manchuria diminished by the attempt — the same border Voitsekhovsky himself eventually crossed anyway, months later, after actually breaking with Semyonov for real. This crossing comes faster, and thinner.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of refusing the Semyonov merger and
        // attempting independent passage. historicalRecord true: Chinese
        // border policy toward unaffiliated White forces is real and well
        // documented — over 11,000 White soldiers, Semyonov's and Kappelite
        // troops alike, were disarmed at the Sino-Russian border and shipped
        // to Vladivostok regardless of which banner they arrived under, and
        // Ataman Dutov's independently-commanded Orenburg Cossacks — who
        // answered to no one but themselves — were separately disarmed and
        // interned by Chinese authorities in Xinjiang. Going it alone was
        // never obviously safer.
        case "manchurianBorder20":
          return {
            date: "APRIL 1920",
            title: "The Border: Whoever Asks Permission",
            bulletin: {
              headline: "THE INTERVENTION ENDS. JAPAN DOES NOT LEAVE.",
              body: "American forces completed their withdrawal from Vladivostok on 1 April; the British and French are gone. Japan alone remains, with roughly seventy thousand men in the Maritime Province and Transbaikal and no announced date for leaving. The intervention that justified itself in 1918 as a way to reconstitute an eastern front against Germany has outlived the German war by seventeen months, and what is left of it has nothing to do with Germany at all.",
              meanwhile: {
                southRussia: "Denikin resigned at Sevastopol on 4 April after Novorossiysk. Wrangel has the Crimea and roughly seven months in which to hold it.",
                bolsheviks: "A Far Eastern Republic has been proclaimed at Verkhneudinsk this month — a buffer state Moscow tolerates precisely to avoid a direct confrontation with the Japanese forces still ashore.",
              },
            },
            historicalRecord: true,
            situation:
              "The column has reached the Manchurian frontier without Semyonov's Japanese-backed diplomatic standing to smooth the crossing. Chinese border authorities, wary of White 'Russia one and indivisible' ambitions on their own territory, are demanding the column disarm before being permitted through — the same treatment independently-commanded White forces have received elsewhere on this frontier, regardless of how loathed or trusted their nominal patron was.",
            choices: [
              {
                label: "Comply. Surrender arms at the border rather than risk a confrontation with Chinese forces the column can't win.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "We left Semyonov specifically to avoid answering to someone else's authority, and now I am recommending we answer to China's instead. I do not see a version of reaching safety from here that doesn't run through someone else's terms.",
                },
                historical: true,
                setFlags: { borderChoice: "disarm" },
                impact: {},
                next: "endingDispersedAtTheBorder",
                outcome:
                  "The column disarms at the border, as thousands of other White troops — Semyonov's own men among them — do at crossings up and down this frontier regardless of their command affiliation. Most are eventually moved on toward Vladivostok or dispersed to make their own way home. Refusing Semyonov bought independence from one authority. It did not buy exemption from every authority this border answers to.",
              },
              {
                label: "Refuse to disarm. Attempt to force or negotiate passage while keeping the column armed.",
                advisor: {
                  name: "Kappel's Former Staff Officer",
                  quote:
                    "The principle is sound enough on paper. Paper is not what a Chinese garrison responds to — they have disarmed better-supplied columns than ours without much trouble at all. We already walked away from one loathed authority. I see no reason to assume this one has more patience than the last.",
                },
                historical: false,
                setFlags: { borderChoice: "refuse" },
                impact: { manpower: -2 },
                next: "endingDispersedAtTheBorder",
                outcome:
                  "The standoff doesn't hold. Chinese forces disarm the column regardless — the precedent set elsewhere on this same frontier by Dutov's independently-commanded Cossacks, disarmed and interned in Xinjiang despite answering to no White government at all, was never really about which banner a column carried. It was about whose territory this actually was.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — for the manchurianBorder20 branch specifically. A genuinely
        // different fate than endingManchuria/endingManchuriaEarly, because
        // this command explicitly left Semyonov's orbit rather than falling
        // with it. historicalRecord true: the Chinese disarmament policy and
        // the dispersal/Grodekovo movement are both documented in period
        // consular telegrams, not invented for this ending.
        case "endingDispersedAtTheBorder":
          return {
            isEnding: true,
            title: "Dispersed at the Border",
            date: "APRIL–NOVEMBER 1920",
            badge: "HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "There is no Far Eastern Army left to dissolve, because this command never joined one. What's left of it is disarmed at the Manchurian frontier and, per the pattern documented up and down this border through 1920, mostly disperses — men making their own way home individually, or moving on toward the Japanese-controlled zone around Vladivostok rather than staying together as a fighting force. A parallel case makes the point plainly: Ataman Dutov's independently-commanded Orenburg Cossacks, who answered to no White government at all, were disarmed and interned by Chinese authorities in Xinjiang all the same. Command structure was never really what determined this outcome."
              + (flags.omskCoupChoice === "council_first"
                  ? "\n\nThere is a real symmetry here, whether or not anyone living through it noticed it: a command that opened, in November 1918, by proposing to share supreme power rather than hold it alone closes, in 1920, by refusing to fold itself into someone else's authority even when doing so might have offered more protection than going it alone actually provided. The instinct toward shared or independent authority over centralized command turns out to have been consistent from the very first morning to the very last border crossing — for whatever that consistency was worth against a Chinese garrison that disarmed columns regardless of the principle behind them."
                  : "\n\nThe command that disperses at this border accepted supreme, undivided authority without hesitation at the very start, in November 1918. It ends the same way it began — asserting its own independent standing right up to the border that made the assertion irrelevant. Confidence and consistency, it turns out, are not the same thing as leverage.")
              + "\n\nThe command that has held this seat since November 1918 ends here too — not in Semyonov's betrayal, and not in a battle, but in a column that simply stops being a column, man by man, at a border that was never going to let it cross intact regardless of whose command it left or refused to join." +
              (flags.borderChoice === "disarm"
                ? "\n\nAgreeing to disarm at the frontier is what made the crossing possible and what made it final. Chinese authorities interned the column on the terms they set; the weapons went into Chinese armories, and the men went into camps that emptied slowly into the same Harbin streets everyone else reached anyway."
                : flags.borderChoice === "refuse"
                ? "\n\nRefusing to disarm kept the column an army for a few more days and cost it the orderly crossing. The border was crossed regardless, in worse order, by men who had insisted on remaining soldiers right up to the moment it stopped being a category anyone was willing to recognize."
                : "") +
              (flags.legionOutcome === "delayed_betrayal"
                ? "\n\nThe Legion's cooperation, bought by conceding the junctions at Omsk, lasted precisely as long as the Legion's own interests did. Nobody who reached this border was surprised by that. A few of them had said so at the time."
                : ""),
          };

        // ---------------------------------------------------------------------
        // HARD MODE ENDING — triggers whenever Ataman Authority (authority-
        // Erosion) reaches 100, at whatever node the player happens to be on.
        // Not tied to a single date — it's the accumulated culmination of the
        // pattern the campaign's real content already shows: Kolchak's
        // subordinates overridden once too often, the Legion's cooperation
        // withdrawn the way Janin's own guarantee historically was.
        case "endingLegionWithdraws":
          return {
            isEnding: true,
            title: "The Legion Withdraws",
            date: "DATE VARIES — TRIGGERED BY ACCUMULATED AUTHORITY EROSION",
            badge: "SPECULATIVE — HARD MODE COLLAPSE",
            classification: "speculative",
            epilogue:
              "It is not a single betrayal — it is the accumulated pattern of every override that came before it: an ataman's objection dismissed once too often, a subordinate commander's judgment overruled past the point of trust, the rail line's actual controllers reminded one time too many that this government's authority was more nominal than real even to the people nominally protecting it. Somewhere on the retreat, the Czechoslovak Legion — the only force that actually controls whether this command's trains move at all — formally withdraws its cooperation.\n\nThis is the same betrayal Janin's real, documented conduct toward Kolchak shows the Legion was capable of regardless of the path that led here — the pattern was always live. What accumulated authority erosion changes is not whether the Legion could withdraw its protection. It's how much authority this command had left to withdraw it from by the time it did.\n\nThe Legion's own priority was never in dispute, and it was never Omsk. Sixty thousand Czech and Slovak soldiers wanted passage east to Vladivostok and ships to a country that had existed for barely a year. They got both. The arrangement that delivered Kolchak to the Political Centre at Irkutsk in January 1920 secured their trains and a share of what remained of the imperial gold reserve's transit, and the last of them sailed from Vladivostok in September. They went home. The government whose protection they had nominally been guaranteeing did not survive the winter they left it in." +
              (flags.janinDeclinedOutcome === "marginal_gain"
                ? "\n\nNegotiating passage independently, without Janin's formal guarantee, did buy the trains marginally better treatment than the guarantee would have. It is a small thing to have been right about, and it does not offset what the withdrawal of cooperation costs here."
                : flags.janinDeclinedOutcome === "no_gain"
                ? "\n\nNegotiating passage independently bought nothing the formal guarantee wouldn't have. Both roads led to a Legion that answered to its own timetable, and the choice between them turned out to be a choice about self-respect rather than outcomes."
                : ""),
          };

        // -------------------------------------------------------------------
        case "chitaFall20":
          return {
            date: "OCTOBER 1920",
            title: "Chita: The Plug Comes Out",
            bulletin: {
              headline: "BOTH REMAINING WHITE FRONTS, THE SAME MONTH",
              body: "This front and the one remaining in the south reach their endings in the same weeks — the first time in the whole war either front's timeline has actually lined up with the other's.",
              meanwhile: {
                southRussia: "Wrangel's Crimea is preparing its own defense at Perekop, and — quietly, alongside that defense rather than instead of it — its own evacuation. The lesson of Novorossiysk, eight months ago, was that failing to prepare for a retreat in advance costs more than admitting one might be necessary.",
                bolsheviks: "The Polish war has just ended in an armistice, with formal peace talks opening at Riga. Frunze's Southern Front, freed from sharing reserves with the Polish front, is about to turn its full weight against the Crimea within weeks.",
              },
            },
            historicalRecord: true,
            situation:
              "The Far Eastern Republic's National Revolutionary Army and Red partisan forces are closing on Chita — the last chokepoint keeping direct Soviet control off the Trans-Siberian's eastern stretch. Japanese support that has propped up this position for two years is withdrawing under the Gongota Agreement. Semyonov wants to hold. What remains of the Kappelite command has to decide whether holding a doomed position is worth the men it costs." +
              (flags.semyonovChoice === "merged"
                ? " The merger was accepted, which is why Semyonov gets to say what he wants at all. The officers who loathed him then are the ones being asked to die for his position now."
                : ""),
            choices: [
              {
                label: "Make a real stand at Chita rather than abandon the position without a fight.",
                advisor: {
                  name: "Semyonov",
                  quote:
                    "I have held this city since 1918 against worse odds than these, and against men who thought their reasons for wanting it were better than mine. I am not asking anyone to die for my own authority, though I would let them think that if it moved them faster. Everything east of here answers to whoever holds Chita. I intend for that to still be me.",
                },
                historical: true,
                setFlags: { chitaDefense: "stand" },
                impact: {},
                next: "chitaReckoning20",
                outcome:
                  "The defense holds for a time before Chita falls on October 22. Semyonov's remaining forces retreat toward Manchuria — the position could not be held indefinitely against Japan's withdrawal and the NRA's numbers, whatever the defense actually cost to mount.",
              },
              {
                label: "Withdraw toward the Manchurian border immediately rather than commit to a defense of Chita.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "Holding this city buys Semyonov's authority a few more weeks. It does not change where any of us end up when those weeks run out. I would rather cross that border with an army than without one.",
                },
                historical: false,
                setFlags: { chitaDefense: "immediate_withdrawal" },
                impact: { manpower: 3 },
                costsCapital: true,
                next: "chitaReckoning20",
                outcome:
                  "The withdrawal begins before Chita actually falls, over Semyonov's open objection. More men reach Manchuria intact — and the decision to abandon his capital without a fight is not one Semyonov, or the officers who still answer to him, forget quickly.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // CHECKPOINT — meter-gated routing, not a decision. If accumulated
        // manpower this run has actually sustained is catastrophic, the
        // column crossing into Manchuria isn't a coherent retreating force
        // anymore — it's scattered groups making the crossing individually,
        // which is a genuinely different ending than either organized
        // border crossing this campaign already had. Gate was originally
        // the accumulated manpower meter (<= -6) — changed for the same
        // reason as southRussia's finalReckoning20: raw meter arithmetic
        // isn't the same thing as a genuinely reckless command decision, and
        // the triangle shouldn't be the thing routing to a different ending.
        // Earned now by the Saratov-junction gamble specifically: pressing
        // toward the junction against the flank warning, then pressing on
        // again once the counteroffensive actually hit the exposed flank.
        case "chitaReckoning20":
          if (flags.saratovChoice === "continue" && flags.exposedFlankChoice === "press_on") {
            return this.resolveNode("endingColumnScattered20");
          }
          return this.resolveNode(flags.chitaDefense === "stand" ? "endingManchuria" : "endingManchuriaEarly");

        // ---------------------------------------------------------------------
        // ENDING — reachable only via the Saratov-junction decision chain:
        // pressing for the junction against the flank warning, then pressing
        // on again once the counteroffensive actually exposed the flank.
        // historicalRecord false: no scattered, non-organized crossing at
        // this scale is documented; the real Kappelite-Semyonovite column
        // that crossed in October 1920 remained cohesive enough to be
        // described as an army. What's real is the underlying mechanism —
        // a force gutted by that specific double-down loses the capacity to
        // cross as a body it would otherwise have kept.
        case "endingColumnScattered20":
          return {
            isEnding: true,
            title: "The Column That Scattered",
            date: "OCTOBER–NOVEMBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "There is no organized column crossing into Manchuria to describe, because by the time Chita falls there isn't one left to organize. The damage traces to the Saratov junction: pressing for the link-up against the flank warning, and then, once the counteroffensive actually landed on that exposed flank, pressing on toward Saratov anyway rather than turning to meet it. The force that reaches Chita is smaller than the one that would have turned back at either warning, and it never recovers the difference. Groups of a few dozen, a few hundred, cross the border independently, on their own initiative, answering to no unified command by the time they actually reach it. Some find their way to Harbin. Most simply disperse into the same uncertain exile the organized column eventually reached — just without ever having been a column to begin with.\n\nThis is not the historical record — the real retreat, battered as it genuinely was, remained cohesive enough to be called an army all the way to the Manchurian border. What's speculative here is a command that doubled down on the Saratov gamble twice in direct sequence, and paid for both." +
              (flags.reluctanceResponse === "assert"
                ? "\n\nThe title was asserted formally, early, against the officers who questioned it. Authority insisted upon in November 1918 is worth nothing to a column dispersing across a frozen border two years later, and the men crossing it individually are not consulting anyone about whether they are permitted to."
                : flags.reluctanceResponse === "ignore"
                ? "\n\nThe question of the title was left to pass without comment, which was the wiser handling and made no difference at all. Command that is never tested formally still dissolves informally, and this is what that looks like when it happens."
                : ""),
          };

        // ---------------------------------------------------------------------
        // ENDINGS
        // ---------------------------------------------------------------------
        case "endingManchuria":
          return {
            isEnding: true,
            title: "The Manchurian Border",
            date: "OCTOBER 1920",
            badge: "HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "Chita falls on October 22, 1920, after a defense that could not outlast the loss of Japanese support and the National Revolutionary Army's numbers. What remains of Semyonov's Far Eastern Army — Kappelites and Transbaikal Cossacks alike, a coalition built on necessity rather than trust — retreats across the border into Manchuria. Many settle into Harbin's already-large Russian émigré community; some later take service with regional Chinese warlords, or find themselves, decades on, still displaced when Japan occupies Manchuria outright."
              + (flags.omskCoupChoice === "council_first"
                  ? "\n\nThe hesitation at Omsk, two years and one command earlier, is a footnote by now — nobody crossing into Harbin in October 1920 is thinking about a proposal for collective leadership that lasted a few hours before being rejected. But the pattern it set, of an authority that had to assert itself rather than simply holding it, runs in a more or less straight line from that first morning to this border. Whether asserting it harder at the start would have changed anything by the end is exactly the kind of counterfactual this crossing doesn't get to answer."
                  : "\n\nThe command that crosses this border is, in the narrowest sense, the same one that accepted supreme power without hesitation in November 1918. Confidence at the start bought nothing durable by the end — the same dissolution, on the same schedule, regardless.")
              + "\n\nThe command seat held since the Omsk coup in November 1918 ends here — not in a lost battle, but in a border crossed. Dissolution into exile, not defeat in the field, is how this story was always going to end; the only real question was ever how many of the men following that command survived to make the crossing." +
              (flags.eichePursuitChoice === "fight"
                ? "\n\nThe rearguard that turned to fight Eiche's advance elements bought the column the lead it needed to reach this border. It did not make the crossing itself. The formation that survives to be interned is, in a real sense, the one that was covered by men who are not here to be interned with it."
                : flags.eichePursuitChoice === "continue"
                ? "\n\nThe column kept moving and let the rearguard absorb the pursuit unsupported. More men reached the border for it. The decision is recorded in nobody's memoir as anything other than the correct one, which is its own kind of comment on what this retreat had become by then."
                : "") +
              (flags.chelyabinskChoice === "counterattack"
                ? "\n\nDiterichs' counterattack at Chelyabinsk was committed to and did not stabilize the flank it was meant to. The reserves it spent were the ones that would otherwise have been available for exactly this stretch of the retreat, and their absence shaped who was still walking by the Manchurian border."
                : ""),
          };

        case "endingManchuriaEarly":
          return {
            isEnding: true,
            title: "The Army That Left First",
            date: "OCTOBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "The withdrawal begins before Chita actually falls, against Semyonov's open objection. More of the column reaches Manchuria intact than the historical retreat managed. The cost is Semyonov's trust — and by extension, whatever fragile authority was holding this coalition of convenience together in the first place.\n\nHistorians broadly agree the eventual outcome, dissolution into exile, was not seriously in doubt by this point in the war regardless of the exact shape the defense took. What this choice actually changes is not the destination — it's whether the men following Voitsekhovsky get to say they chose the moment they left, rather than had it chosen for them by a city falling around them.\n\nManchuria was not a refuge so much as a waiting room nobody was called out of. Harbin, already a Russian railway city before the war, absorbed tens of thousands of them — officers driving cabs, selling what they carried, running restaurants for other exiles. Some drifted on to Shanghai, some to Europe, some eventually accepted Soviet amnesties and went back to outcomes that varied from unremarkable to fatal. The Japanese backing that had propped up Semyonov's Transbaikal evaporated with the withdrawal in 1922, and the men who left Chita a few weeks early ended up in exactly the same cities as the men who left it a few weeks late. The margin this choice bought was real, and it was measured in casualties on the road, not in destinations." +
              (flags.janinChoice === "accepted"
                ? "\n\nJanin's formal guarantee was accepted, and Janin's guarantee is the one documented fact of this whole retreat that most reliably meant nothing. The evacuation placed under Allied protection was protected exactly as far as Allied interests extended, which stopped at Irkutsk. Leaving Chita early was, among other things, a decision made by men who had already learned what a guarantee was worth."
                : flags.janinChoice === "declined"
                ? "\n\nThe formal Allied guarantee was declined and passage negotiated unit by unit instead. It changed less than it should have — but the command that walks away from Chita early is the same one that had already decided not to rely on anyone else's protection, and the two decisions belong to the same instinct."
                : ""),
          };

        default:
          return null;
      }
    },
  },
};

// =============================================================================
// BOLSHEVIKS — Revolutionary Military Council of the Republic (Revvoensoviet)
// =============================================================================
// Design note, not to be quietly dropped: this campaign does NOT share the
// "managing the shape of a defeat" thesis the other two were built around —
// the Reds won the Civil War. Its moral weight comes from a different place:
// not loss, but what winning required (grain requisitioning, the Cheka, and
// eventually Kronstadt/Tambov once the "main" war is technically over). Don't
// let content sessions default back to a defeat-shaped arc out of habit —
// check every ending draft against what this campaign is actually about.
CAMPAIGNS.bolsheviks = {
  id: "bolsheviks",
  label: "Revolutionary Military Council of the Republic",
  coalition: "red",
  shortTag: "RVS", // identity — fixed regardless of skin choice
  commander: "Leon Trotsky, People's Commissar for War",
  seat: "Revvoensoviet Staff Train",
  thesis: "One war. A Red Army under central command — not the shape of a defeat but the cost of winning: what the Revolution's victory actually required, and of whom.",
  start: "revvoensovietFormed18",

  initialMeters: {
    mobilization: 0,
    warIndustry: 0,
    reliability: 0,
  },
  triangleAxes: [
    { key: "mobilization", label: "MOBILIZATION" },
    { key: "warIndustry", label: "WAR INDUSTRY" },
    { key: "reliability", label: "POLITICAL RELIABILITY" },
  ],
  initialLegitimacy: 0, // "Worker-Peasant Support" — zero-baseline, same convention as the triangle
  plannedEnding: {
    date: "MARCH 1921",
    title: "Kronstadt",
    note:
      "Deliberately past 'the war ends.' This campaign's whole thesis is the cost of winning, not the shape of a defeat — ending at Wrangel's evacuation would let it close on a clean military victory and dodge that. Kronstadt is the moment the war's winners answer to their own sailors and workers for what winning cost. That's the real ending, not the tidy one.",
  },
  hardMode: {
    key: "centralizationBacklash",
    label: "Centralization Backlash",
    capitalName: "ORGBURO MODE",
    capitalLabel: "AUTHORITY CAPITAL",
    description:
      "No rewind, no meter dashboard — only staff reports. Five points of Authority Capital to spend overriding regional Party figures who distrust centralized command — Stalin and Voroshilov's real conflict with Trotsky at Tsaritsyn is the textbook case. Spend all five and the Central Committee moves against you at the fifth override — the campaign ending in political removal, not battlefield defeat. Named for the Orgburo, the real Party body whose job was exactly this: deciding, administratively and without a battlefield involved, who stays in a post and who doesn't.",
    buttonLabel: "OPEN COMMAND",
    maxCap: 5,
    maxEndingId: "endingCentralCommitteeMoves",
  },

  NEWSPAPER_MASTHEAD: "IZVESTIA",
  NEWSPAPER_SUBHEAD: "News — organ of the All-Russian Central Executive Committee",
  ADVISOR_DOSSIERS: {
    trotsky: {
      role: "Chairman, Revolutionary Military Council; People's Commissar for War",
      bio:
        "Built the Red Army from near-total collapse by insisting on conventional military discipline, unified command, and — most controversially within his own party — reliance on ex-Imperial officers ('military specialists') under Bolshevik commissar oversight, over the objection of Party members who saw this as a betrayal of revolutionary principle.",
      fate:
        "Chaired the Revvoensoviet until January 1925. Expelled from the Party in 1927, exiled from the USSR in 1929. Assassinated in Mexico City in August 1940 on Stalin's order.",
      faction: "Revvoensoviet",
      rank: 0,
    },
    stalin: {
      role: "Political Commissar, Southern Front (Tsaritsyn)",
      bio:
        "Sent to Tsaritsyn in June 1918 to secure grain shipments, he stayed to take a direct hand in the city's military defense alongside Voroshilov — openly contemptuous of the ex-Tsarist 'specialists' Trotsky's doctrine depended on, and willing to appeal past Trotsky directly to Lenin when overruled.",
      fate:
        "Recalled from Tsaritsyn in October 1918 after Trotsky threatened Voroshilov with court-martial. The conflict was not forgotten by either man. Stalin became General Secretary of the Party in 1922 and, after Lenin's death, systematically removed Trotsky from power.",
      faction: "Southern Front / Party",
      rank: 1,
    },
    tukhachevsky: {
      role: "Commander, Western Front (Polish war, 1920); Commander, Suppression of Kronstadt (1921)",
      bio:
        "A Guards lieutenant before the war and a German prisoner who escaped on his fifth attempt, he joined the Bolsheviks in 1918 and had an army at twenty-five. His advance to the Vistula in August 1920 covered nearly 400 miles in six weeks and stopped at the gates of Warsaw with his left flank uncovered — the Cavalry Army it needed was committed at Lwów under a different front. He commanded the assault across the ice at Kronstadt seven months later.",
      fate:
        "Blamed the loss of Warsaw on the South-Western Front's refusal to release the Cavalry Army; Stalin, that front's political member, blamed Tukhachevsky's overextension. The two men argued it in print through the 1920s and never settled it. Tukhachevsky became a Marshal of the Soviet Union in 1935 and was arrested, convicted in a closed proceeding, and shot in June 1937. Budyonny and Voroshilov — the other principals in the Vistula argument — sat on the tribunal that condemned him. He was posthumously exonerated in 1957.",
      faction: "Western Front",
      rank: 2,
    },
    budyonny: {
      role: "Cavalry Corps Commander, Southern Front",
      bio:
        "A former Imperial Army cavalry NCO, one of the few senior Red cavalry commanders who rose from the ranks rather than through the voenspetsy system. Pushed hard for concentrating scattered cavalry divisions into a single strategic-scale formation rather than parceling them out to individual infantry armies.",
      fate:
        "Commanded the First Cavalry Army through its formation in November 1919 and its decisive role in breaking Denikin's retreat. Survived the purges of the 1930s that killed most of his fellow Civil War-era commanders, becoming one of the Soviet Union's first Marshals.",
      faction: "Southern Front Cavalry",
      rank: 2,
    },
    frunze: {
      role: "Commander, Southern Front (from 1920)",
      bio:
        "A career revolutionary rather than a military specialist by original training, he proved to be one of the Red Army's most effective operational commanders — the Perekop-Sivash operation against Wrangel's Crimea defenses is generally regarded as his signature achievement of the war.",
      fate:
        "Went on to lead Soviet military reforms in the early 1920s and briefly headed the Revvoensoviet after Trotsky. Died in October 1925 during surgery Stalin had pressured him to undergo — a death Boris Pilnyak's fictionalized account later suggested was no accident, though this remains disputed among historians rather than established fact.",
      faction: "Southern Front",
      rank: 2,
    },
    kamenev: {
      role: "Commander-in-Chief of the Red Army (from July 1919)",
      bio:
        "A former Imperial Army colonel who replaced Vatsetis as Commander-in-Chief, generally credited (though the exact authorship of the competing plans is still disputed by historians) with the Southern Front strategy that eventually broke Denikin's advance.",
      fate:
        "Remained a senior Red Army commander through the 1920s and early 1930s. Died of natural causes in 1936, shortly before the purges that would very likely have killed him had he lived a few years longer.",
      faction: "Red Army High Command",
      rank: 1,
    },
    smirnov: {
      role: "Leader, Military Opposition faction",
      bio:
        "A former factory worker and Old Bolshevik who had never held a weapon before the Civil War forced him to. Commanded real respect from the soldiers who served under him at Sviyazhsk in 1918, and later played a direct role in the operations that led to Kolchak's defeat and execution. Led the Military Opposition's genuine, if ultimately unsuccessful, push at the 8th Congress to limit reliance on ex-Tsarist specialist officers.",
      fate:
        "Later joined the Left Opposition and was expelled from the Party in 1927. Arrested in 1933, brought before the first Moscow Trial in August 1936 on fabricated charges of plotting with Trotsky against Stalin, and executed the same month.",
      faction: "Military Opposition",
      rank: 2,
    },
    kalinin: {
      role: "Chairman, All-Russian Central Executive Committee",
      bio:
        "The Soviet state's nominal head, from a peasant background himself — sent to Kronstadt on March 1, 1921, to address the sailors directly, alongside Fleet Commissar Kuzmin. The government's own account of that meeting concedes it went badly, hardening the rebellion rather than calming it.",
      fate:
        "Remained the USSR's ceremonial head of state until 1946, a rare senior Bolshevik of his generation to die of natural causes rather than execution or purge, in June 1946.",
      faction: "Central Executive Committee",
      rank: 1,
    },
    lenin: {
      role: "Chairman, Council of People's Commissars",
      bio:
        "Backed Trotsky's authority over the Southern Front's own chain of command in the Tsaritsyn dispute, and over the Military Opposition at the 8th Congress — while remaining, throughout, the one figure both Trotsky and Stalin needed to stay on good terms with rather than each other.",
      fate:
        "Suffered a severe stroke in May 1922, a second in December 1922, and a third in March 1923 that left him unable to speak. Died on January 21, 1924, having spent his final year largely incapacitated while Stalin, Trotsky, and others maneuvered for succession around him.",
      faction: "Council of People's Commissars",
      rank: 0,
    },
  },

  NODE_ATLAS: [
    { id: "revvoensovietFormed18", date: "SEPTEMBER 1918", title: "The Staff Train: A Council of War" },
    { id: "tsaritsynCrisis18", date: "OCTOBER 1918", title: "Tsaritsyn: A Question of Command" },
    { id: "tsaritsynAftermath18", date: "NOVEMBER 1918", title: "Tsaritsyn: What Comes of the First Decision" },
    { id: "stalinsRecall18", date: "DECEMBER 1918", title: "Moscow: A Second Recall" },
    { id: "grainRequisition18", date: "DECEMBER 1918", title: "The Grain Committees" },
    { id: "stalinsNewPosting18", date: "JANUARY 1919", title: "Moscow: How Real a Posting" },
    { id: "supplyShortfall19", date: "JANUARY 1919", title: "The Shell Ledger" },
    { id: "supplyRationingConsequence19", date: "FEBRUARY 1919", title: "Moscow: Two Commanders, One Complaint" },
    { id: "militaryOppositionCongress19", date: "MARCH 1919", title: "The Eighth Congress: A Vote Twice" },
    { id: "congressFallout19", date: "MARCH 1919", title: "After the Vote: What to Do With the Defeated" },
    { id: "smirnovReassignment19", date: "MARCH 1919", title: "Moscow: What to Do With a Marginalized Commander" },
    { id: "southernFrontPlan19", date: "JULY 1919", title: "Moscow: Two Plans, One Front" },
    { id: "donbasMobilization19", date: "AUGUST 1919", title: "Yuzovka: Miners, Not Soldiers" },
    { id: "donbasAttrition19", date: "SEPTEMBER 1919", title: "Yuzovka: What's Left of the Battalions" },
    { id: "reinforcedBattalionsTest19", date: "OCTOBER 1919", title: "Yuzovka: The Name Under Fire" },
    { id: "cavalryArmyDebate19", date: "NOVEMBER 1919", title: "Voronezh: One Army or Many" },
    { id: "distributedPursuit19", date: "DECEMBER 1919", title: "The Screen That Wasn't There" },
    { id: "polishWar20", date: "AUGUST 1920", title: "The Vistula: Warsaw or Lwów" },
    { id: "perekopAssault20", date: "NOVEMBER 1920", title: "Perekop: The Last Isthmus" },
    { id: "compressedEvacuation20", date: "NOVEMBER 1920", title: "The Clock Wrangel Didn't Have" },
    { id: "kronstadt21", date: "MARCH 1921", title: "Kronstadt: Soviets Without Us" },
  ],
  NODE_TOTAL: 21,
  ENDINGS_GALLERY: [
    { id: "endingIceBroken", title: "The Ice Broken", classification: "historical" },
    { id: "endingTheVistula20", title: "The Vistula", classification: "historical" },
    { id: "endingTheAutumnCrisis19", title: "The Autumn Crisis", classification: "speculative" },
    { id: "endingTheIsland21", title: "The Island", classification: "speculative" },
    { id: "endingHollowVictory21", title: "A Hollow Victory", classification: "speculative" },
    { id: "endingUnlikelyPrecedent", title: "An Unlikely Precedent", classification: "speculative" },
    { id: "endingCentralCommitteeMoves", title: "The Central Committee Moves", classification: "speculative" },
  ],
  ENDING_CLASSIFICATION: {
    endingIceBroken: "historical",
    endingTheVistula20: "historical",
    endingTheAutumnCrisis19: "speculative",
    endingTheIsland21: "speculative",
    endingHollowVictory21: "speculative",
    endingUnlikelyPrecedent: "speculative",
    endingCentralCommitteeMoves: "speculative",
  },

  resolveNode(nodeId, flags = {}, meters = {}) {
    switch (nodeId) {
      // ---------------------------------------------------------------------
      case "revvoensovietFormed18":
        return {
          date: "SEPTEMBER 1918",
          title: "The Staff Train: A Council of War",
          bulletin: {
            headline: "PEACE BOUGHT TIME, NOT CONSENSUS",
            body: "Brest-Litovsk, March: a quarter of the old empire's population and most of its heavy industry, ceded to Germany over furious internal opposition. Trotsky's own delegation walked out twice before Lenin's argument won the room — a government destroyed by continuing the war builds socialism nowhere. The intervention came anyway. British, French, now American and Japanese troops have landed at Archangel and Vladivostok this same month, declared purpose the Legion's evacuation and Allied matériel. In practice: material support for whichever anti-Soviet force each army happens to be standing near.",
            meanwhile: {
              southRussia: "The Volunteer Army survives Kornilov's death at Ekaterinodar back in April and is rebuilding under Denikin — still a modest, Kuban-based force, not yet unified under the AFSR name that arrives in January.",
              siberia: "The Czechoslovak Legion's May revolt has broken Bolshevik authority across Siberia entirely. A moderate coalition government — the Ufa Directory — is forming this same month to unite the region's anti-Bolshevik factions, though it will not survive the winter either.",
            },
          },
          historicalRecord: true,
          situation:
            "The Republic has been declared a single armed camp. You chair the new Revolutionary Military Council with sweeping authority over every front — and an army built from a collapsed one, led in most technical respects by men who fought for the Tsar. The Military Opposition faction argues that trusting former Imperial officers, even under commissar watch, betrays the revolution that just overthrew them.",
          choices: [
            {
              label: "Commit to the voenspetsy system: ex-Imperial officers under Bolshevik commissar oversight, army-wide.",
              advisor: {
                name: "Trotsky",
                quote:
                  "We did not abolish the General Staff's competence when we abolished its politics. A commissar at every officer's shoulder costs us nothing we cannot afford and saves us everything an army built from enthusiasm alone would lose on the first real battlefield.",
              },
              historical: true,
              setFlags: { specialistPolicy: "voenspetsy" },
              impact: {},
              next: "tsaritsynCrisis18",
              outcome:
                "The policy is confirmed and expanded. Competent command returns to units that had none — at the cost of trust the Party's own base does not yet extend to men who wore the Tsar's uniform a year ago.",
            },
            {
              label: "Reject wholesale reliance on specialists. Build command up from proven revolutionary cadres instead.",
              advisor: {
                name: "Stalin",
                quote:
                  "Ruthless competence from a man who despises everything this army stands for is not competence we can rely on when it matters. I would rather have officers who bleed for the revolution than ones who merely tolerate it.",
              },
              historical: false,
              setFlags: { specialistPolicy: "cadres" },
              impact: { mobilization: 2, warIndustry: -3, reliability: 4 },
              next: "militaryOppositionCongress19",
              outcome:
                "The Military Opposition's position wins ground it did not historically hold. Political reliability rises — so does the number of fronts commanded by men learning tactics under fire, against opponents who are not.",
            },
            {
              label: "Split the difference: specialists at senior staff and planning level only, revolutionary cadres in direct troop command.",
              advisor: {
                name: "Lenin",
                quote:
                  "A clean policy in either direction has its appeal — I understand why both sides want one. What the army actually needs is not obviously the same thing. A former Imperial colonel drafting the operational plan and a man the troops actually trust leading them into it are not incompatible positions, whatever this argument between Trotsky and the Opposition would like to pretend.",
              },
              historical: false,
              setFlags: { specialistPolicy: "split_command" },
              impact: { mobilization: 1, warIndustry: -1, reliability: 2 },
              next: "tsaritsynCrisis18",
              outcome:
                "The split holds in principle — specialists plan, cadres command — and immediately runs into the same problem it was meant to avoid: a plan a field commander doesn't trust the author of is a plan that gets modified, ignored, or quietly not executed the moment the fighting starts. The compromise reduces the scale of the trust problem. It does not resolve it.",
            },
          ],
        };

      // ---------------------------------------------------------------------
      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of backing the Military Opposition's
      // line at the Revvoensoviet's formation. historicalRecord true here,
      // unusually, because the Congress itself and its vote margins are real
      // regardless of which policy line the player backed beforehand — what's
      // speculative is that this player has more standing in the room than
      // history gave the Opposition, having already committed to their line.
      case "militaryOppositionCongress19":
        return {
          date: "MARCH 1919",
          title: "The Eighth Congress: A Vote Twice",
          bulletin: {
            headline: "THE SAME CONGRESS SEASON FOUNDS AN INTERNATIONAL",
            body: "This Congress's own fight over military policy runs in the same city, the same month, as a larger declaration: the founding of a Communist International, on the record for carrying revolution beyond Russia's borders. Foreign delegate attendance was thin, several parties represented in name only — but no single battle this year will do more to convince the Allied governments this war is worth continuing to fund against.",
            meanwhile: {
              southRussia: "Denikin's forces are regrouping through the winter, still short of the offensive strength that produces the Moscow Directive in July.",
              siberia: "Kolchak's own spring offensive is underway, launched this same month — briefly reaching toward the Volga before the Red counteroffensive out of Buguruslan reverses it by early summer.",
            },
          },
          historicalRecord: true,
          situation:
            "The Military Opposition — delegates uneasy with the Party's shrinking control over an army increasingly led by ex-Tsarist officers and filled with conscripted peasants — has forced the military question onto the floor of the Party's Eighth Congress. In the closed military-section vote, their position actually wins, 37 to 20. The full Congress still has to vote. Having already sided with their line in September, you have real standing in this room that the historical Opposition never had.",
          choices: [
            {
              label: "Press the advantage from the closed-session win. Push for the Opposition's platform in the full Congress vote.",
              advisor: {
                name: "Smirnov",
                quote:
                  "We won the room that actually understands the army's condition. If we cannot carry that into the full Congress, the closed vote was worth nothing but the appearance of a debate we were always going to lose anyway.",
              },
              historical: false,
              setFlags: { congressChoice: "press" },
              // Threshold tightened round 22 (-4 -> -2): simulation showed
              // this campaign's three gated axes binding in only ~13-14% of
              // runs against southRussia's ~45-51% and siberia's ~18-19%,
              // meaning choices here carried less real consequence than the
              // other two campaigns. See dispatches-1922-round22-recommendations.md.
              gate: (m) => m.reliability >= -2,
              disabledReason: "Political reliability too low to press an advantage — a command this distrusted does not win a floor fight, it becomes one.",
              impact: { reliability: 3, mobilization: -2 },
              next: "congressFallout19",
              outcome:
                "The push happens — and the full Congress votes it down anyway, 174 to 95, the same margin history recorded regardless of the closed session's result. What's different is that this defeat lands harder, on delegates who genuinely believed the closed-session win meant something more than a symbolic concession.",
            },
            {
              label: "Take the closed-session win as leverage for a negotiated concession rather than forcing an unwinnable floor fight.",
              advisor: {
                name: "Trotsky",
                quote:
                  "You have already shown me the closed vote can go against my policy. I am telling you plainly that more red commanders trained at the Academy is a concession I can actually make. A floor fight I have to win by 79 votes is not a negotiation — it's a formality neither of us needs.",
              },
              historical: true,
              setFlags: { congressChoice: "negotiate" },
              impact: {},
              next: "southernFrontPlan19",
              outcome:
                "The negotiated path holds. It produces, historically, exactly the concession Trotsky describes — increased training of proletarian 'red commanders' at the General Staff Academy — without forcing a floor fight neither side was fully certain of winning cleanly.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of pressing the Opposition's advantage
        // into a full-Congress defeat. historicalRecord false: the specific
        // aftermath scene is invented, since the historical path (negotiate)
        // never produced this defeat to have an aftermath from.
        case "congressFallout19":
          return {
            date: "MARCH 1919",
            title: "After the Vote: What to Do With the Defeated",
            historicalRecord: false,
            situation:
              "The floor defeat is worse for morale than a clean loss would have been — delegates who believed the closed-session win meant something are now watching Smirnov's faction absorb a public rebuke instead. How you handle the Opposition's leadership in the weeks after matters for whether this becomes a closed chapter or an open wound.",
            choices: [
              {
                label: "Marginalize the Opposition's leadership publicly. Make clear that further factional organizing won't be tolerated.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "A defeated faction that is allowed to regroup as though nothing happened will simply relitigate this fight at the next Congress. I would rather close this argument decisively now than refight it every six months.",
                },
                historical: false,
                setFlags: { congressFallout: "marginalized" },
                impact: { reliability: -3 },
                costsCapital: true,
                next: "smirnovReassignment19",
                outcome:
                  "Smirnov and his allies are sidelined from further military-policy influence. The argument doesn't resurface at the next Congress — it simply goes underground, resentment intact, waiting for a moment less favorable to central authority than this one.",
              },
              {
                label: "Quietly fold some of the Opposition's concerns into policy without public concessions, defusing resentment without a rematch.",
                advisor: {
                  name: "Smirnov",
                  quote:
                    "I do not need a victory lap. I need to know the men who voted for us in the closed session aren't simply going to watch their concerns disappear because the full floor happened to go the other way.",
                },
                historical: false,
                setFlags: { congressFallout: "absorbed" },
                impact: { reliability: 2, mobilization: -1 },
                next: "southernFrontPlan19",
                outcome:
                  "Quiet accommodation replaces public discipline. It costs a little operational efficiency — some of the Opposition's preferences do make it into practice, informally, in ways the historical negotiated settlement never had to accommodate — and it buys something closer to real reconciliation than a formal defeat would have.",
              },
            ],
          };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of marginalizing Smirnov's faction.
        // historicalRecord false: this specific reassignment decision is
        // invented, but it tests a real tension already established in his
        // own dossier — Smirnov was a genuinely capable field commander
        // (Sviyazhsk, 1918) as well as a political dissenter, and marginal-
        // izing the politician doesn't make the competent officer disappear.
        case "smirnovReassignment19":
          return {
            date: "MARCH 1919",
            title: "Moscow: What to Do With a Marginalized Commander",
            historicalRecord: false,
            situation:
              "Smirnov is politically sidelined, but the Southern Front still needs commanders who can deliver results in the field, and his record at Sviyazhsk the previous year is not in serious dispute even among the people who just voted down his politics. Leaving him without a real command wastes a genuine asset. Giving him one hands a marginalized dissenter exactly the kind of visible field success that rebuilds political standing.",
            choices: [
              {
                label: "Assign him a real field command anyway. The Front needs competent officers more than it needs a tidy political narrative.",
                advisor: {
                  name: "Lenin",
                  quote:
                    "I did not spend my own career choosing between competence and loyalty when I could help it, and I am not going to start recommending it now on someone else's behalf. Use the man. Watch him. Those are not mutually exclusive instructions.",
                },
                historical: false,
                setFlags: { smirnovAssignment: "field_command" },
                impact: { mobilization: 2 },
                next: "southernFrontPlan19",
                outcome:
                  "Smirnov gets a field command, and performs in it about as well as his record predicted. The marginalization holds politically — he is not restored to military-policy influence — but the Front is better for having a genuinely capable officer in a genuinely operational role, whatever that means for how cleanly this decision reads on paper.",
              },
              {
                label: "Keep him away from field command as well. A marginalization that still hands him visible successes isn't really a marginalization.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "What we lose operationally is real, and I am not pretending otherwise. What it costs the argument we just won — watching the man we just defeated politically become, inside a month, the name attached to this Front's next real victory — is worse, and considerably harder to explain at the next Congress.",
                },
                historical: false,
                setFlags: { smirnovAssignment: "sidelined" },
                impact: { mobilization: -2, reliability: -1 },
                next: "southernFrontPlan19",
                outcome:
                  "Smirnov stays away from field command. The political marginalization holds cleanly — and the Front does without a commander whose competence nobody in the room, including the people who just voted against him, seriously disputed.",
              },
            ],
          };

      case "tsaritsynCrisis18":
        return {
          date: "OCTOBER 1918",
          title: "Tsaritsyn: A Question of Command",
          bulletin: {
            headline: "GERMANY IS COLLAPSING. THE PEACE THAT COST US UKRAINE MAY NOT OUTLIVE HER.",
            body: "Bulgaria has capitulated; the Ottoman position is disintegrating; the German army is falling back across the Western Front and Berlin has begun approaching Washington about terms. If Germany surrenders, the Brest-Litovsk treaty that cost the Republic Ukraine, the Baltics, and a quarter of its population becomes a dead letter — annulled by the victors, not by us. The peace Lenin was denounced across the Party for signing may be voided within weeks by events entirely outside this government\'s control.",
            meanwhile: {
              southRussia: "Denikin\'s Volunteer Army has taken the Kuban and is consolidating; German withdrawal from Ukraine will open ground that the AFSR is better placed to occupy than the Republic is.",
              siberia: "A moderate coalition government at Ufa is being pushed aside; within weeks an admiral in Omsk will be Supreme Ruler, and the eastern front will have a single command for the first time.",
            },
          },
          historicalRecord: true,
          situation:
            "Stalin and Voroshilov have secured Tsaritsyn against Krasnov's Don Cossacks — the same city Wrangel's Caucasus Army will fight to take from the Red 10th Army eight months from now. But they have done it by sidelining the specialist officers your own policy sent them, and now telegraph Lenin directly, over your head, accusing your command of incompetence." +
            (flags.specialistPolicy === "split_command"
              ? " The compromise policy was supposed to keep exactly this from happening — specialists confined to staff and planning, revolutionary cadres in direct troop command, so neither side would have grounds to route around the other. It hasn't worked at Tsaritsyn: Voroshilov commands the city outright, and the planning officers this command did send report being consulted only after decisions are already made."
              : ""),
          choices: [
            {
              label: "Assert central authority. Threaten Voroshilov with court-martial and have Stalin recalled from the front.",
              advisor: {
                name: "Trotsky",
                quote:
                  "Tsaritsyn obeys the Revvoensoviet, or it explains to the Republic why it does not. I did not build a unified command to watch it dissolve into a dozen private armies the moment a Party figure decides his instincts outrank the General Staff.",
              },
              historical: true,
              setFlags: { tsaritsynOutcome: "recalled" },
              impact: {},
              costsCapital: true,
              next: "grainRequisition18",
              outcome:
                "The recall order goes through Lenin, who backs the Revvoensoviet's authority over the Southern Front's own chain of command. Stalin leaves Tsaritsyn — the dispute itself does not end here, and will not be forgotten by either man. Whether Voroshilov's own forces treat a recall of his patron as an order to fall in line or as one more reason to resent a command that was never out here with them is a separate, genuinely open question.",
              // Added round 22 — bolsheviks previously had only 1 uncertain
              // choice in the whole campaign (vs. 7 in southRussia, 4 in
              // siberia). The recall itself is fixed historical fact; how
              // cleanly Voroshilov's own command actually absorbs it is the
              // kind of secondary detail the record doesn't settle.
              uncertain: (() => {
                const smoothWeight = modWeight(55, meterPct(meters.reliability));
                return [
                  {
                    weight: smoothWeight,
                    title: "Voroshilov falls in line",
                    setFlags: { voroshilovCompliance: "smooth" },
                    impact: { mobilization: 1 },
                    outcome:
                      "Whatever Voroshilov says privately, Tsaritsyn's defenses pass to the officers the Revvoensoviet actually sent without a second confrontation. The recall holds as more than a piece of paper.",
                  },
                  {
                    weight: 100 - smoothWeight,
                    title: "The city quietly keeps answering to Voroshilov anyway",
                    setFlags: { voroshilovCompliance: "friction" },
                    impact: { mobilization: -2, reliability: -1 },
                    outcome:
                      "The recall order is obeyed on paper. In practice, the officers arriving to take up the posts it specifies find a garrison that still checks with Voroshilov before it checks with them — a chain of command that was never really broken, just made harder to see.",
                  },
                ];
              })(),
            },
            {
              label: "Conciliate. Let Tsaritsyn's command stand as it is rather than force a rupture with Stalin.",
              advisor: {
                name: "Stalin",
                quote:
                  "The city held. That is the only test that matters to the men who fought for it, and it should be the only test that matters to you. Discipline a commander for winning and you will find fewer of them willing to win the next city.",
              },
              historical: false,
              setFlags: { tsaritsynOutcome: "conciliated" },
              impact: { reliability: -3, mobilization: 2 },
              next: "tsaritsynAftermath18",
              outcome:
                "The authority of the Revvoensoviet goes untested at Tsaritsyn. The precedent is not lost on every other front commander watching to see what centralized command actually means in practice.",
            },
            {
              label: "Separate the two questions. Discipline Voroshilov specifically for bypassing the specialists — but leave Stalin's political oversight of the city in place.",
              advisor: {
                name: "Lenin",
                quote:
                  "The complaint against Tsaritsyn was always really two complaints wearing one telegram — a military commander who ignored the General Staff, and a political commissar who backed him. I am not convinced both problems require the same solution, or that solving them together is actually simpler than solving them apart.",
              },
              historical: false,
              setFlags: { tsaritsynOutcome: "split_discipline" },
              impact: { reliability: -1, mobilization: 1 },
              next: "tsaritsynAftermath18",
              outcome:
                "Voroshilov is formally reprimanded for the specialist question specifically; Stalin's political role at Tsaritsyn goes untouched. It is a narrower assertion of authority than the full recall, and a less complete concession than leaving both men alone — whether splitting the two questions actually resolves either one, or just produces a result nobody involved reads as a clear outcome, is genuinely unclear even to the people making the decision.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of leaving Stalin and Voroshilov's
      // command at Tsaritsyn unchecked. historicalRecord false: the specific
      // scene is invented, but it's grounded in the well-established, broadly
      // uncontested characterization of the Tsaritsyn group's real hostility
      // to voenspetsy coordination in this period.
      case "tsaritsynAftermath18":
        // Genuinely different situation text depending on which upstream
        // choice led here — a real continuity bug, not a stylistic gap.
        // "conciliated" means Voroshilov was never actually disciplined, so
        // "left unchecked" is accurate. "split_discipline" means Voroshilov
        // WAS already reprimanded on the specialist question specifically —
        // describing him as still operating completely unchecked
        // contradicts what that choice's own outcome text just said.
        if (flags.tsaritsynOutcome === "split_discipline") {
          return {
            date: "NOVEMBER 1918",
            title: "Tsaritsyn: What a Narrow Reprimand Didn't Reach",
            historicalRecord: false,
            situation:
              "Voroshilov's formal reprimand covered the specialist question specifically — the exact orders he was disciplined for bypassing. It didn't cover the broader pattern underneath it: Stalin's own political authority at Tsaritsyn, left untouched by design, still favors loyalists over men who know the terrain in every appointment that isn't the one narrow issue already addressed. A voenspets colonel assigned to the sector has just resigned rather than continue serving under a command that routes around his orders in every way except the one that was formally corrected.",
            choices: [
              {
                label: "Extend the reprimand's logic. Address the broader pattern, not just the single incident already corrected.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "A narrow correction that leaves the underlying pattern untouched was never going to hold past the first new resignation. I would rather finish the argument now than relitigate it one voenspets colonel at a time.",
                },
                historical: false,
                setFlags: { tsaritsynAftermath: "extended" },
                impact: { reliability: 3, mobilization: -2 },
                next: "stalinsRecall18",
                outcome:
                  "The intervention widens past the single reprimand into the broader pattern it was always going to eventually have to address. It costs more now than addressing it fully the first time would have — narrow corrections rarely stay narrow once the underlying problem resurfaces.",
              },
              {
                label: "Let the narrow reprimand stand as the full response. A second intervention risks looking like the first one wasn't real.",
                advisor: {
                  name: "Stalin",
                  quote:
                    "You already drew a line once. Redrawing it now, wider, tells every command watching that the first line was never the real one — which is a worse lesson than one more resignation over an appointment that was always going to favor trust over unfamiliarity.",
                },
                historical: false,
                setFlags: { tsaritsynAftermath: "held_narrow" },
                impact: { reliability: -2, mobilization: 1 },
                next: "grainRequisition18",
                outcome:
                  "The narrow reprimand stands as the complete response. The broader pattern it didn't reach continues — a coordination gap the specific correction was never going to close on its own.",
              },
            ],
          };
        }
        return {
          date: "NOVEMBER 1918",
          title: "Tsaritsyn: The Cost of Being Right",
          historicalRecord: false,
          situation:
            "Left unchecked, Stalin and Voroshilov's command at Tsaritsyn has kept doing what it was already doing before you declined to intervene — sidelining the specialist officers assigned to coordinate rail movement and artillery placement in favor of men they trust politically over men who actually know the terrain. A voenspets colonel assigned to the sector has just resigned rather than continue serving under a command that routes around his orders. His replacement is a political appointee with no comparable experience.",
          choices: [
            {
              label: "Reassert Revvoensoviet authority now, even though the moment to do it cleanly at Tsaritsyn has already passed.",
              advisor: {
                name: "Trotsky",
                quote:
                  "I let this stand once already. I am not required to let a second resignation pass unanswered simply because the first one did. This is precisely the drift a unified command exists to stop.",
              },
              historical: false,
              setFlags: { tsaritsynAftermath: "reasserted" },
              impact: { reliability: 4, mobilization: -3 },
              next: "stalinsRecall18",
              outcome:
                "The intervention comes late enough to look like it, and costs more political capital than acting at Tsaritsyn itself would have. Stalin does not forget being overruled twice on the same question.",
            },
            {
              label: "Let it stand. A second intervention this soon would look like the first decision was a mistake.",
              advisor: {
                name: "Stalin",
                quote:
                  "You already decided this question once. Reversing yourself now teaches every front commander watching that your decisions are provisional until someone complains loudly enough — which is a worse lesson for the army than one voenspets colonel's resignation.",
              },
              historical: false,
              setFlags: { tsaritsynAftermath: "unaddressed" },
              impact: { reliability: -4, mobilization: 1 },
              next: "grainRequisition18",
              outcome:
                "The resignation stands unaddressed. The coordination gap it leaves behind is small but structural — the kind that compounds quietly rather than announcing itself as a single costly failure.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of overruling Stalin a second time.
      // historicalRecord false: this specific recall scene is invented, but
      // it's grounded in a real, well-documented fact — Stalin's actual
      // recall from the Southern Front happened in this same general window,
      // and the personal friction with Trotsky it hardened outlasted the
      // Civil War itself by decades.
      case "stalinsRecall18":
        return {
          date: "DECEMBER 1918",
          title: "Moscow: A Second Recall",
          historicalRecord: false,
          situation:
            "The order recalling Stalin from the Southern Front a second time has gone through Lenin without objection — the Revvoensoviet's authority holds, again, on paper. Whether it costs more than it buys is a separate question from whether it was won.",
          choices: [
            {
              label: "Reassign Stalin to a role with real responsibility, rather than let the recall read as pure punishment.",
              advisor: {
                name: "Lenin",
                quote:
                  "A capable man humiliated twice in one year is not a man who forgets it quietly. Give him something real to do and the recall reads as reassignment. Give him nothing and it reads exactly like what it is.",
              },
              historical: false,
              setFlags: { stalinRecallHandling: "reassigned" },
              impact: { reliability: 2 },
              next: "stalinsNewPosting18",
              outcome:
                "Stalin is given a genuine new posting rather than left idle. It does not undo the resentment — nothing was ever going to — but it denies the recall the cleanest possible reading as a pure humiliation.",
            },
            {
              label: "Leave the reassignment unresolved. The recall itself is the message; a new posting can wait.",
              advisor: {
                name: "Trotsky",
                quote:
                  "I am not in the business of softening a decision I believe was correct. If the message is uncomfortable, it should be — that is what makes it a message rather than a formality.",
              },
              historical: false,
              setFlags: { stalinRecallHandling: "unresolved" },
              impact: { reliability: -2 },
              costsCapital: true,
              next: "grainRequisition18",
              outcome:
                "The recall stands with no immediate reassignment. Whatever this costs in Stalin's own long memory of the incident is not a cost this war's own timeline gets to see paid — but the ledger, whoever eventually reads it, will show it was opened here.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of giving Stalin a genuine new
        // posting rather than leaving the recall unresolved. historicalRecord
        // false: the specific posting and its handling here are invented,
        // testing what "real responsibility" actually requires of the people
        // who have to decide how much genuine authority to attach to it.
        case "stalinsNewPosting18":
          return {
            date: "JANUARY 1919",
            title: "Moscow: How Real a Posting",
            historicalRecord: false,
            situation:
              "The new posting holds up on paper — a role with content, not a face-saving formality. Whether it comes with the authority the title implies, or with enough oversight attached that everyone involved understands it's still probationary, is a decision that hasn't been made yet. The distinction matters more to how this plays out than the posting's name does." +
              (flags.stalinRecallHandling === "unresolved"
                ? " The recall itself was left to stand as the whole of the message, which means this posting is the first thing said to him since. It will be read as the answer to a question nobody formally asked."
                : ""),
            choices: [
              {
                label: "Give the posting real authority, with minimal additional oversight beyond what any comparable role would get.",
                advisor: {
                  name: "Lenin",
                  quote:
                    "A reassignment that comes wrapped in obvious extra scrutiny is not actually a reassignment — it is the recall, continued, with better paperwork. If we are going to do this, we should do it in a way he can't reasonably read as another humiliation.",
                },
                historical: false,
                setFlags: { postingAuthority: "real" },
                impact: { reliability: 3, mobilization: -1 },
                next: "grainRequisition18",
                outcome:
                  "The posting carries genuine authority. It costs a measure of central oversight over a man the Revvoensoviet has already clashed with twice — a trust extended, not merely gestured at.",
              },
              {
                label: "Attach real but discreet oversight. The posting is genuine; so is the reasonable caution around handing it over cleanly.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "I am willing to call this a real posting. I am not willing to pretend two prior conflicts didn't happen simply because we're both being polite about the reassignment. The oversight stays — quietly, but it stays.",
                },
                historical: false,
                setFlags: { postingAuthority: "supervised" },
                impact: { reliability: -1, mobilization: 1 },
                next: "grainRequisition18",
                outcome:
                  "The oversight stays, discreetly. The posting is real enough to deny it's a pure humiliation, supervised enough that it never quite becomes the clean trust Lenin's own instinct argued for — a genuine middle position, and one that satisfies neither the full-trust nor the full-caution argument completely.",
              },
            ],
          };

      // ---------------------------------------------------------------------
      case "grainRequisition18":
        return {
          date: "DECEMBER 1918",
          title: "The Grain Committees",
          historicalRecord: true,
          situation:
            "The cities are starving and the army cannot be fed on requisition quotas that keep falling short. The Committees of Poor Peasants and the food-requisitioning detachments can be pushed harder in newly held territory — grain the Republic needs, taken from villages that increasingly see the detachments as a second occupying army." +
            (flags.tsaritsynOutcome === "recalled"
              ? " Tsaritsyn is being administered by a command that has just been publicly overruled from Moscow, and its grain is being counted by men who noticed." +
                (flags.voroshilovCompliance === "friction"
                  ? " The garrison's own requisition returns are late and thin — the same quiet non-compliance that greeted the recall order itself, applied now to the grain count."
                  : "")
              : flags.tsaritsynAftermath === "unaddressed"
              ? " Tsaritsyn's own arrangement was left to stand. The requisition apparatus there answers, in practice, to Stalin and Voroshilov rather than to this office, and the figures it reports should be read accordingly."
              : ""),
          choices: [
            {
              label: "Intensify requisitioning in reconquered territory. The army and the cities eat first.",
              advisor: {
                name: "Trotsky",
                quote:
                  "An army that starves does not win the argument about how grain should be distributed — it simply loses, and the argument is settled by Denikin instead. This is not a policy I am fond of. It is the one that keeps the front supplied through the winter.",
              },
              historical: true,
              setFlags: { requisitionPolicy: "intensified" },
              // Threshold tightened round 22 (-6 -> -3), same bite-rate
              // rationale as above -- kept more conservative than the
              // historical:false gates since this is the historical choice
              // itself (walked by walk-historical.js).
              gate: (m) => m.reliability >= -3,
              disabledReason: "Intensified requisitioning depends on detachments that follow orders in hostile villages. These would not come back.",
              impact: {},
              next: "southernFrontPlan19",
              outcome:
                "The quotas rise. Grain moves to the cities and the front in the short term — and in villages the detachments pass through twice, the distinction between 'the Revolution' and 'the men taking our harvest' is getting harder to draw.",
              // Added round 22, same bolsheviks-uncertain-mechanic rationale
              // as tsaritsynCrisis18 above. The intensification itself is
              // fixed historical policy; whether a given district's
              // resentment stays sullen or tips into open resistance to the
              // detachments is the genuinely contested part — peasant
              // uprisings against requisitioning were a real, recurring
              // feature of this period, not a uniform response.
              uncertain: (() => {
                const containedWeight = modWeight(55, meterPct(meters.reliability));
                return [
                  {
                    weight: containedWeight,
                    title: "Resentment stays sullen, not open",
                    setFlags: { requisitionUnrest: "contained" },
                    impact: { mobilization: 1 },
                    outcome:
                      "The detachments meet the usual hostility and nothing worse. Villages hide grain, drag their feet, and comply — and the quotas, this winter, are met.",
                  },
                  {
                    weight: 100 - containedWeight,
                    title: "A district goes over to open resistance",
                    setFlags: { requisitionUnrest: "revolt" },
                    impact: { mobilization: -2, reliability: -2 },
                    outcome:
                      "One reconquered district doesn't just resent the second pass — it fights it. A requisitioning detachment is driven out at gunpoint before Cheka units restore control, and the episode is the kind villages two counties over hear about within the week.",
                  },
                ];
              })(),
            },
            {
              label: "Ease requisitioning in newly held areas. Buy peasant tolerance at the cost of the supply shortfall.",
              advisor: {
                name: "Stalin",
                quote:
                  "Squeeze a village twice in one winter and you will not need Denikin's army to lose it — it will simply stop being ours in anything but name. There is a cost to that arithmetic too, even if it does not show up on a supply ledger.",
              },
              historical: false,
              setFlags: { requisitionPolicy: "eased" },
              impact: { mobilization: -3, warIndustry: -3 },
              next: "supplyShortfall19",
              outcome:
                "The detachments pull back from their harshest quotas. Whether that buys lasting tolerance or merely delays the same unrest by a season is not a settled question — it is the question the next several years of this policy will actually answer.",
            },
            {
              label: "Dissolve the Committees of Poor Peasants. Fold requisitioning into the regular local Soviets instead.",
              advisor: {
                name: "Kalinin",
                quote:
                  "The kombedy were built to fight the village soviets, not to feed the cities, and in most districts that is exactly and only what they have accomplished. Merge them back into the soviets they were set up to override, and let the requisitioning answer to a body the village has some standing to argue with.",
              },
              historical: false,
              setFlags: { requisitionPolicy: "restructured" },
              impact: { mobilization: 1 },
              next: "southernFrontPlan19",
              outcome:
                "The decree goes out and the kombedy are folded into the re-elected local soviets over the following weeks — this reform is real and dated to this exact winter, though the game follows the intensification thread as its main line; here, this command chose the administrative fix instead. Quotas do not fall. Whether a peasant can tell the difference between a committee and a soviet once both are taking the same grain is a separate question from whether the Republic can.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of easing requisitioning. The peasant-
      // tolerance trade-off has a concrete operational cost: thinner reserves
      // heading into a winter with two active fronts. historicalRecord false
      // — this specific rationing scene is invented, grounded in the broadly
      // uncontested fact that Red Army supply was genuinely strained across
      // multiple simultaneous fronts through this period.
      case "supplyShortfall19":
        return {
          date: "JANUARY 1919",
          title: "The Shell Ledger",
          historicalRecord: false,
          situation:
            "The eased quotas have left magazine reserves thinner than planned heading into a winter where both the Southern Front against Denikin and the Eastern Front against Kolchak need resupply simultaneously. The war industry commissariat's honest assessment is that it can fully equip one front's spring operations, or partially equip both — not both fully." +
            (flags.requisitionPolicy === "intensified"
              ? " The detachments were pushed harder in reconquered territory, and the shortfall arrived anyway. What intensification bought was not grain but a countryside that now treats the requisition parties as an enemy formation."
              : flags.requisitionPolicy === "restructured"
              ? " The kombedy were folded into the local soviets rather than pushed harder, which changed who answers for the quota without changing the quota. The shortfall is the same one every path through this decision arrives at — institutional reform was never going to be a substitute for grain that does not exist."
              : ""),
          choices: [
            {
              label: "Prioritize the Southern Front. Denikin's advance is the more immediate threat to the capital.",
              advisor: {
                name: "Trotsky",
                quote:
                  "Kolchak is further from Moscow in every sense that matters militarily. If we starve one front of shells this spring, it should not be the one closest to deciding the whole war by summer.",
              },
              historical: false,
              setFlags: { supplyPriority: "south" },
              impact: { warIndustry: 3, reliability: -2 },
              next: "southernFrontPlan19",
              outcome:
                "The South gets priority. The Eastern Front's spring operations against Kolchak go forward under-supplied — a cost, even if it isn't the one that determines how this war's own chapter, on this front, ends.",
            },
            {
              label: "Split supply evenly between both fronts rather than gamble the war on prioritizing one direction.",
              advisor: {
                name: "War Industry Commissariat Official",
                quote:
                  "I would rather have two fronts slightly underequipped than one front confident and one front collapsing. An even split does not win either campaign quickly. It also does not lose either one for a shortage we could have prevented.",
              },
              historical: false,
              setFlags: { supplyPriority: "split" },
              impact: { warIndustry: -1, mobilization: 1 },
              next: "supplyRationingConsequence19",
              outcome:
                "The split holds. Neither front gets what a full-priority allocation would have bought it — the Southern Front's own campaign against Denikin proceeds with exactly the margin this choice left it, no more.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of splitting supply evenly rather
        // than prioritizing one front. historicalRecord false: this specific
        // consequence is invented, testing what an even split actually costs
        // in practice once both fronts discover neither got what a full
        // allocation would have.
        case "supplyRationingConsequence19":
          return {
            date: "FEBRUARY 1919",
            title: "Moscow: Two Commanders, One Complaint",
            historicalRecord: false,
            situation:
              "Both front commanders have now formally objected to the split allocation — not because either believes the other front deserves nothing, but because each is certain his own front is the one that actually needed the full quota. Whether to hold the split as policy or quietly favor whichever front's complaint sounds more urgent this week is now a recurring administrative choice rather than a single decision already made." +
              (flags.supplyPriority === "split"
                ? " The split was chosen deliberately over giving either front its full quota. Both commanders know that, which is why neither is treating his objection as a request rather than a grievance."
                : ""),
            choices: [
              {
                label: "Hold the split as firm policy. Neither front gets to argue its way into a larger share through persistence.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "A policy that bends every time a front commander complains loudly enough is not a policy — it is an invitation to complain loudly. I would rather hold an imperfect split than reward whichever commander is most persistent this month.",
                },
                historical: false,
                setFlags: { rationingConsequence: "held_firm" },
                impact: { reliability: 2, warIndustry: -1 },
                next: "southernFrontPlan19",
                outcome:
                  "The split holds regardless of complaint. Both fronts learn, over the following weeks, that the allocation is not actually negotiable — which costs some goodwill and buys a predictability neither front had reason to expect otherwise.",
              },
              {
                label: "Quietly adjust allocation toward whichever front's need looks most acute in the moment.",
                advisor: {
                  name: "War Industry Commissariat Official",
                  quote:
                    "I understand the argument for a fixed policy. I am the one who has to explain to whichever front is actually collapsing this week why the ledger says the allocation was decided in January and isn't up for revision in February.",
                },
                historical: false,
                setFlags: { rationingConsequence: "adjusted" },
                impact: { warIndustry: 2, reliability: -2 },
                next: "southernFrontPlan19",
                outcome:
                  "The allocation flexes toward whichever front's need is most acute this week. It's more responsive than the firm split — and it means neither commander can actually plan against a fixed number, which has its own real cost that doesn't show up on the same ledger the flexibility was meant to protect.",
              },
            ],
          };

      // ---------------------------------------------------------------------
      case "southernFrontPlan19":
        return {
          date: "JULY 1919",
          title: "Moscow: Two Plans, One Front",
          bulletin: {
            headline: "VERSAILLES REDRAWS EUROPE. THE REPUBLIC IS NOT INVITED.",
            body: "The treaty signed at Versailles on 28 June settles the war Russia bled in for three years, and no Russian delegation of any kind attended. Article 116 obliges Germany to abandon Brest-Litovsk and to respect the independence of every territory that was Russian in August 1914 — a clause written for the Republic\'s benefit by governments currently arming the armies trying to destroy it. The Comintern\'s argument in March, that this order will not admit a workers\' state and must be overturned rather than joined, has been answered in the most direct terms available.",
            meanwhile: {
              southRussia: "Denikin took Kharkov in June and has issued the Moscow Directive — a broad-front advance on the capital, the most ambitious White order of the war.",
              siberia: "Kolchak\'s front is in retreat toward the Urals, and the Allied recognition Omsk was offered came attached to conditions about a Constituent Assembly it has no position to convene.",
            },
          },
          historicalRecord: true,
          situation:
            "Denikin's Moscow Directive is spreading across every axis of the Southern Front at once — the same order the AFSR's own staff drafted at Tsaritsyn. Lenin has just demanded the Republic become 'a single armed camp' against it. Sergei Kamenev, newly installed as Commander-in-Chief, proposes concentrating the Republic's reserves toward Tsaritsyn and the Kuban Cossack lands — uncertain territory, but a direct strike at the base Denikin's whole campaign depends on. Several of your own commissars argue instead for the Donbas: denser rail, a Ukrainian industrial workforce presumed friendlier to the Revolution, and none of the risk of marching Red conscripts through hostile Cossack country. Even historians who have gone through the surviving orders still dispute which plan was actually whose." +
              (flags.specialistPolicy === "voenspetsy"
                ? " Kamenev holds his post because this command committed to the specialist system army-wide. The plan carries the authority of that decision and the resentment it generated in equal measure."
                : flags.specialistPolicy === "cadres"
                ? " Kamenev is proposing this to a command that rejected wholesale reliance on ex-Imperial officers. His professional judgment arrives with less institutional weight behind it than the office would normally carry."
                : flags.specialistPolicy === "split_command"
                ? " Kamenev occupies exactly the senior planning role the split-command compromise reserved for specialists. Whether that compromise means his plan gets executed as written by cadre commanders in the field is the question this decision is about to test."
                : "") +
              (flags.requisitionUnrest === "revolt"
                ? " The grain detachments' open clash with a reconquered district this past winter is still fresh enough that every plan touching Ukrainian ground gets read, this week, against that news."
                : flags.requisitionUnrest === "contained"
                ? " The requisitioning push that fed this front over the winter held without open revolt — one less complication in a plan that has enough already."
                : ""),
          choices: [
            {
              label: "Back Kamenev. Concentrate the reserves toward Tsaritsyn and the Kuban.",
              advisor: {
                name: "Trotsky",
                quote:
                  "Every argument for the Donbas route assumes the workers there rise to meet us the moment we arrive. I would rather stake this offensive on ground we can actually take than on a rising we can only hope for.",
              },
              historical: true,
              setFlags: { southernPlan: "tsaritsyn" },
              impact: {},
              costsCapital: true,
              next: "cavalryArmyDebate19",
              outcome:
                "The plan is approved. It does not stop Orel from falling in October — the same defeat already written into the record on the other side of this front — but it is the plan the Republic actually fought behind, whichever staff officer's name history eventually settles on it belonging to.",
            },
            {
              label: "Overrule Kamenev. Concentrate through the Donbas instead, on the denser rail and the industrial workforce.",
              advisor: {
                name: "Unnamed Southern Front Commissar",
                quote:
                  "We keep asking Cossack villages to be neutral ground for an army they have every reason to distrust. The Donbas does not require that leap of faith from anyone — the rail is ours, and so, mostly, are the workers standing next to it.",
              },
              historical: false,
              setFlags: { southernPlan: "donbas" },
              impact: { mobilization: -1, warIndustry: 2 },
              next: "donbasMobilization19",
              outcome:
                "The reserves shift north instead. Denikin's Moscow Directive and the Southern Front's response were never actually decided against each other this way — whether trading the Kuban's uncertainty for the Donbas's rail lines would have blunted the advance any faster than what actually happened at Orel is not something history left any way to find out.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of the Donbas concentration plan.
      // historicalRecord false: this specific mobilization scene is invented,
      // grounded in the broadly documented (if less individually famous than
      // Peregonovka or Chelyabinsk) practice of raising worker battalions
      // from Donbas mining and industrial towns during this period.
      case "donbasMobilization19":
        return {
          date: "AUGUST 1919",
          title: "Yuzovka: Miners, Not Soldiers",
          historicalRecord: false,
          situation:
            "The Donbas concentration has the rail and the industry behind it — and hard limits. The miners and factory workers being raised into worker battalions to reinforce the line are committed revolutionaries in a way conscripted peasants often aren't, but they are not trained infantry, and Denikin's approaching regulars are." +
            (flags.southernPlan === "donbas"
              ? " This is the axis this command chose over Kamenev's Tsaritsyn plan. The worker battalions are the resource that choice assumed would be there, and this is the first look at what it actually consists of."
              : ""),
          choices: [
            {
              label: "Commit the worker battalions to the line as front-line infantry, trusting political commitment to offset the training gap.",
              advisor: {
                name: "Unnamed Southern Front Commissar",
                quote:
                  "These men have more reason to hold this ground than any conscript brought in from outside the region. I would rather trust that than hold them back and explain to Denikin's army why we declined the help.",
              },
              historical: false,
              setFlags: { donbasChoice: "front_line" },
              // Threshold tightened round 22 (-5 -> -2), same bite-rate
              // rationale as the reliability gates above.
              gate: (m) => m.warIndustry >= -2,
              disabledReason: "War industry cannot arm the worker battalions for front-line use — committing them unequipped is not mobilization, it is disposal.",
              impact: { mobilization: 3, reliability: 2 },
              next: "donbasAttrition19",
              outcome:
                "The battalions go into the line directly. Commitment is real — competence against regular infantry takes longer to build than either side has time for, and the cost shows in the casualty returns before it shows anywhere else.",
            },
            {
              label: "Use the battalions for rear-area and rail defense instead, keeping trained units on the front line.",
              advisor: {
                name: "Frunze",
                quote:
                  "Enthusiasm is not a substitute for the drill that keeps a line from breaking under pressure it has never actually faced. Let them hold what they can actually hold, and put the men who already know how to do this where the fighting is hardest.",
              },
              historical: false,
              setFlags: { donbasChoice: "rear_area" },
              impact: { warIndustry: 2, mobilization: -2 },
              next: "cavalryArmyDebate19",
              outcome:
                "The battalions take rear-area and rail-defense duty instead, freeing trained units for the front proper. It's the more cautious use of a genuinely motivated force — and it means the Donbas's own worker mobilization ends up contributing less directly to the actual fighting than its architects had hoped.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of committing the worker battalions
        // to the front line. historicalRecord false: this specific attrition
        // scene is invented, grounded in the broadly documented pattern that
        // worker/militia formations raised for revolutionary commitment
        // rather than training routinely suffered heavy losses and were
        // absorbed into regular units once their original cohesion broke
        // down under sustained combat.
        case "donbasAttrition19":
          return {
            date: "SEPTEMBER 1919",
            title: "Yuzovka: What's Left of the Battalions",
            historicalRecord: false,
            situation:
              "Three weeks of front-line fighting have done what everyone privately expected: the worker battalions have taken losses regular formations with real training wouldn't have, and the survivors are scattered across understrength companies that no longer function as the distinct units the Donbas mobilization was built around. Whether to keep them nominally intact — a symbol worth preserving even at reduced effectiveness — or formally merge the survivors into regular infantry is now an administrative decision rather than a hypothetical one." +
              (flags.donbasChoice === "front_line"
                ? " They were committed to the front line rather than held for rear-area duty, which is why this decision exists at all. Nobody who argued for that commitment is arguing now that the losses were unforeseeable."
                : ""),
            choices: [
              {
                label: "Merge the survivors into regular infantry formations. Effectiveness now matters more than the symbol.",
                advisor: {
                  name: "Frunze",
                  quote:
                    "I did not want them on the line in the first place, and I am not going to argue for keeping a symbolic formation together now that keeping it together costs actual combat effectiveness. Merge them where they'll do the most good.",
                },
                historical: false,
                setFlags: { donbasAttritionChoice: "merged" },
                impact: { mobilization: -1, warIndustry: 1 },
                next: "cavalryArmyDebate19",
                outcome:
                  "The survivors are folded into regular units. The Donbas worker battalions, as a distinct formation, effectively cease to exist within the month — the men who fought in them don't, and many carry the experience into whatever unit absorbs them next.",
              },
              {
                label: "Keep the battalions nominally intact, reinforced with fresh conscripts, even at reduced combat value.",
                advisor: {
                  name: "Unnamed Southern Front Commissar",
                  quote:
                    "These men earned the name on the unit rolls with actual blood. I am not prepared to dissolve that into an anonymous infantry company because it would be more administratively tidy. Reinforce them and keep the name.",
                },
                historical: false,
                setFlags: { donbasAttritionChoice: "reinforced" },
                impact: { mobilization: 1, warIndustry: -1 },
                next: "reinforcedBattalionsTest19",
                outcome:
                  "The battalions stay nominally intact, refilled with conscripts who weren't part of the original mobilization. The name and the symbolic continuity survive; the specific character of a genuinely worker-raised formation, refilled with men mobilized the ordinary way, largely doesn't.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of reinforcing rather than merging.
        // historicalRecord false: this specific test is invented, grounded
        // in the plain, unsentimental question the reinforcement decision
        // actually raised — a unit refilled with ordinary conscripts either
        // performs like the formation whose name it carries, or it doesn't.
        case "reinforcedBattalionsTest19":
          return {
            date: "OCTOBER 1919",
            title: "Yuzovka: The Name Under Fire",
            historicalRecord: false,
            situation:
              "The reinforced battalions have taken their first real engagement since being refilled, and the results are what an honest assessment would have predicted: competent, ordinary infantry performance, nothing like the committed, disproportionate fighting the original worker mobilization was known for. The name on the unit rolls is doing more work now than the men wearing it — whether to keep pretending the distinction still means something, or quietly stop treating the formation as anything other than a regular unit that happens to carry a symbolic name, is the actual choice the test has forced.",
            choices: [
              {
                label: "Keep the symbolic treatment. The name still matters for morale and recruitment even if the fighting record no longer distinguishes it.",
                advisor: {
                  name: "Unnamed Southern Front Commissar",
                  quote:
                    "The name was never really about this specific engagement's casualty ratio. It is about what recruiting posters and Party newspapers can still say honestly about where these men came from — and that much is still true, whatever the fighting looked like this time.",
                },
                historical: false,
                setFlags: { battalionNameTreatment: "symbolic_kept" },
                impact: { mobilization: 1 },
                next: "cavalryArmyDebate19",
                outcome:
                  "The symbolic treatment continues. The gap between the name's meaning and the unit's actual character widens quietly, unaddressed, the way most administrative fictions do when nobody has an immediate reason to correct them.",
              },
              {
                label: "Stop the pretense. Reclassify the formation as an ordinary unit rather than maintain a distinction the fighting no longer supports.",
                advisor: {
                  name: "Frunze",
                  quote:
                    "I would rather have an honest ledger than a flattering one. If the unit fights like ordinary infantry, it should be carried on the rolls as ordinary infantry — the name was never going to change what actually happens on the line either way.",
                },
                historical: false,
                setFlags: { battalionNameTreatment: "reclassified" },
                impact: { mobilization: -2, reliability: 1 },
                next: "cavalryArmyDebate19",
                outcome:
                  "The formation is formally reclassified. It costs some of the recruiting and morale value the name still carried — and it settles, honestly rather than symbolically, exactly the question the merge-or-reinforce decision was always actually about.",
              },
            ],
          };

      // ---------------------------------------------------------------------
      case "cavalryArmyDebate19":
        return {
          date: "NOVEMBER 1919",
          title: "Voronezh: One Army or Many",
          bulletin: {
            headline: "BOTH WHITE FRONTS BREAKING AT ONCE",
            body: "The Whites' furthest advance of the entire war has just been reversed here. Two thousand miles east, the same collapse hits the other front, the same weeks, for largely unrelated reasons.",
            meanwhile: {
              southRussia: "Orel, the deepest point the AFSR ever reached, was retaken on 20 October. Denikin's forces are now in a general retreat that will not meaningfully stop until Novorossiysk, five months from now.",
              siberia: "Omsk itself, Kolchak's own capital, is being evacuated this month as his government falls back along the Trans-Siberian. The eastern front is collapsing in parallel with the southern one, on its own timetable, without either command coordinating the timing.",
            },
          },
          historicalRecord: true,
          context:
            "The Red Army's cavalry problem is structural: the Cossack hosts, historically the empire's mounted arm, largely went to the Whites, leaving the Republic to build mounted formations from peasants, ex-Imperial troopers, and whoever could ride. Budyonny's 1st Cavalry Corps has operated as an oversized independent formation since June and performed well at Voronezh and Kastornoye in October. What is being proposed is not new units but a change in doctrine — a permanent army-level cavalry command, the first in modern European practice.",
          situation:
            "Orel and Voronezh have broken Denikin's advance — the same collapse already written into the record on the other side of this front. Budyonny and Voroshilov are pressing you to formally concentrate the scattered cavalry corps into a single unified Cavalry Army under centralized command, arguing that mounted formations parceled out piecemeal to infantry armies have consistently underperformed what a concentrated cavalry force could do against a retreating enemy." +
              (flags.southernPlan === "tsaritsyn"
                ? " They are making the argument from a Tsaritsyn axis this command already chose to concentrate on, which makes it harder to answer — Budyonny is asking for cavalry command in the theater he has just been proven right about."
                : flags.southernPlan === "donbas"
                ? " They are making the argument having been overruled once already on the Donbas question. Budyonny is not raising that, and is clearly aware he does not need to."
                : ""),
          choices: [
            {
              label: "Approve the unified Cavalry Army under Budyonny's command.",
              advisor: {
                name: "Budyonny",
                quote:
                  "Hitch my divisions to an infantry army and you get an infantry army's war fought at an infantry army's walking pace — I have watched it happen twice already and buried good men to it both times. Give me the corps together, one command, my command, and I will show this front what cavalry actually does when nobody is holding its reins.",
              },
              historical: true,
              setFlags: { cavalryDoctrine: "unified" },
              aftermath:
                "The 1st Cavalry Army was formed on 17 November 1919 under Budyonny, with Voroshilov and Shchadenko on its revolutionary military council. It became the war's decisive manoeuvre formation — driving the AFSR from Rostov, and later fighting in the Polish war of 1920, where it was also blamed for the failure at Warsaw. Its command group mattered well past the Civil War: Budyonny and Voroshilov both became Marshals of the Soviet Union, and both survived the purges that removed most of the officers who had criticised them.",
              impact: {},
              next: "perekopAssault20",
              outcome:
                "The First Cavalry Army is formally constituted. It becomes the instrument that turns Denikin's retreat from a fighting withdrawal into a rout — exploiting exactly the kind of open, disorganized retreat the concentration argument was built to punish.",
              // Added round 22, same bolsheviks-uncertain-mechanic rationale
              // as above. The formation itself, and its eventual role, are
              // fixed by the aftermath text below — the roll only varies how
              // quickly the newly concentrated command actually gets moving,
              // which doesn't contradict anything the aftermath states.
              uncertain: (() => {
                const decisiveWeight = modWeight(60, meterPct(meters.mobilization));
                return [
                  {
                    weight: decisiveWeight,
                    title: "The concentration pays off immediately",
                    setFlags: { cavalryPursuitTempo: "decisive" },
                    impact: { mobilization: 2 },
                    outcome:
                      "Budyonny's staff have the scattered corps acting as one formation within days, not weeks. The pursuit outruns Denikin's own retreat almost from the start.",
                  },
                  {
                    weight: 100 - decisiveWeight,
                    title: "The new command takes weeks to actually function as one army",
                    setFlags: { cavalryPursuitTempo: "lagging" },
                    impact: { mobilization: -1, warIndustry: -1 },
                    outcome:
                      "Combining corps that spent the summer operating separately into one functioning command isn't instant — supply columns built for smaller formations, staffs unused to coordinating at this scale. The Army that will eventually decide this front takes real time to become the thing its own founding argument promised.",
                  },
                ];
              })(),
            },
            {
              label: "Keep cavalry distributed among the infantry armies as integral support rather than a separate strategic arm.",
              advisor: {
                name: "Southern Front Staff Officer",
                quote:
                  "An infantry army without its own cavalry screen is blind on its flanks the moment the enemy moves faster than it does. I understand the argument for concentration. I do not think every infantry commander who loses his cavalry to a separate command will agree it was worth it.",
              },
              historical: false,
              setFlags: { cavalryDoctrine: "distributed" },
              // Leaving cavalry dispersed is defensible on its own. It is not
              // defensible with the war industry gone and the army unreliable.
              // Measured at this node: warIndustry p10 = -3, reliability p10 = -5.
              // The old -5/-4 pair required two near-worst-case values at once and
              // fired in 0.1% of runs.
              // Single axis. The compound version fired in 0.08% of runs: this
              // choice ADDS +1 reliability, so a post-choice value of -5 required
              // a pre-choice -6 AND a simultaneous warIndustry low. Reliability
              // alone is the axis this decision is actually about.
              nextIf: (m) => (m.reliability <= -4 ? "endingTheAutumnCrisis19" : null),
              impact: { mobilization: -2, reliability: 1 },
              next: "distributedPursuit19",
              outcome:
                "The cavalry stays distributed. Whether a concentrated Cavalry Army would have exploited Denikin's collapse any faster than divisions still tied to their infantry armies' pace is exactly the kind of operational counterfactual no record settles — the historical record shows what the concentrated version did. It does not show what the alternative would have.",
            },
            {
              label: "Concentrate the two strongest corps into one reinforced corps — short of a full, separately-commanded Army.",
              advisor: {
                name: "Kamenev",
                quote:
                  "Budyonny is not wrong that piecemeal cavalry underperforms. I am not convinced the answer has to be an Army-scale command answering over the Front's own head to the center. A reinforced corps tests his argument without settling, in the same order, a much larger question about who commands what.",
              },
              historical: false,
              setFlags: { cavalryDoctrine: "reinforced_corps" },
              impact: { mobilization: -1, reliability: 2 },
              next: "perekopAssault20",
              outcome:
                "The middle path is taken. The reinforced corps performs better than fully distributed cavalry would have and worse than Budyonny's own later claims for the full Cavalry Army suggest it might have — a real improvement, not the singular instrument the historical Cavalry Army became, and one that leaves the larger command question this choice was partly about still unresolved rather than decided by circumstance.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of keeping cavalry distributed among
      // infantry armies rather than concentrating it. historicalRecord false:
      // this specific engagement is invented, testing the real operational
      // trade-off the Southern Front staff officer's own quote raises.
      case "distributedPursuit19":
        return {
          date: "DECEMBER 1919",
          title: "The Screen That Wasn't There",
          historicalRecord: false,
          situation:
            "An infantry army pursuing Denikin's retreat has outrun its own reconnaissance — the cavalry that would normally screen its flank is still attached elsewhere, exactly the gap the distributed-cavalry argument was supposed to prevent by keeping each army's own horsemen close. A White rearguard cavalry detachment has been spotted maneuvering somewhere on that unscreened flank, and nobody can currently say exactly where.",
          choices: [
            {
              label: "Halt the pursuit until cavalry reconnaissance can be arranged, even if it costs the army its momentum.",
              advisor: {
                name: "Southern Front Staff Officer",
                quote:
                  "I argued for keeping the cavalry close specifically so this wouldn't happen. Having made that argument, I am not prepared to press an advance blind into ground where I can't currently say what's actually out there.",
              },
              historical: false,
              setFlags: { distributedPursuitChoice: "halt" },
              impact: { mobilization: -2 },
              next: "polishWar20",
              outcome:
                "The pursuit halts until the flank is actually screened. It costs real time against a retreating enemy who doesn't wait politely for reconnaissance — exactly the trade-off distributing the cavalry was supposed to avoid, showing up anyway in a different form.",
            },
            {
              label: "Press the pursuit regardless. The retreating force is unlikely to risk a serious counterattack this late in its collapse.",
              advisor: {
                name: "Unnamed Infantry Army Commander",
                quote:
                  "Denikin's army is coming apart. I am not going to hand it a week's grace because we can't currently locate one rearguard cavalry detachment that is, by every reasonable estimate, more interested in escaping than in attacking us.",
              },
              historical: false,
              setFlags: { distributedPursuitChoice: "press" },
              impact: { mobilization: 2 },
              next: "perekopAssault20",
              outcome:
                "The pursuit continues. The estimate holds — the White detachment is retreating, not attacking — but the gap in reconnaissance was real regardless of how this particular gamble resolved, and it is exactly the gap a concentrated Cavalry Army was built specifically not to have.",
            },
          ],
        };

      // ---------------------------------------------------------------------
      case "perekopAssault20":
        return {
          date: "NOVEMBER 1920",
          title: "Perekop: The Last Isthmus",
          bulletin: {
            headline: "THE LAST TWO WHITE FRONTS END TOGETHER",
            body: "What happens here, from the other side, is the same event: Wrangel's own staff are watching this exact assault from inside the peninsula it is aimed at.",
            meanwhile: {
              southRussia: "This is Wrangel's own account of this exact battle, seen from the losing side — the Sivash crossing, the isthmus turned from the flank, and the evacuation order that follows within days.",
              siberia: "The Far Eastern Republic is now the sole authority in Transbaikal, its capital just relocated to Chita as Japanese forces withdraw. What remains of the White retreat there has either already crossed into Manchuria or is making its final approach to the border.",
            },
          },
          historicalRecord: true,
          situation:
            "Wrangel's remnant is fortified behind the Turkish Wall at Perekop and the Chongar crossings — the last dry-land approach into Crimea, the same peninsula whose evacuation is already the terminus written into the other side of this history. Frunze's plan calls for a frontal assault on the Wall timed with something riskier: a night crossing of the Sivash, the shallow, wind-exposed 'Rotten Sea,' to turn the White defense from a direction no one has fortified." +
              (flags.cavalryDoctrine === "unified"
                ? " The Cavalry Army approved a year ago is available for the exploitation phase, which is the part of this plan that only works if something is waiting behind the Wall once it breaks."
                : flags.cavalryDoctrine === "reinforced_corps"
                ? " The reinforced corps is what there is for the exploitation phase — enough to follow a breakthrough, not enough to turn one into the encirclement Frunze's plan assumes on paper."
                : flags.cavalryDoctrine === "distributed"
                ? " The cavalry remains parceled out among the infantry armies. Frunze's plan assumes a concentrated exploitation force behind the breakthrough, and this front does not have one."
                : "") +
              (flags.cavalryPursuitTempo === "decisive"
                ? " A year on, the Cavalry Army still moves the way it did from its first week under concentrated command — fast, and as one formation rather than several."
                : flags.cavalryPursuitTempo === "lagging"
                ? " The Cavalry Army took real time to gel as a single command a year ago, and some of that early coordination friction has never fully gone away."
                : ""),
          choices: [
            {
              label: "Commit to the combined plan — the frontal assault on Perekop timed with the night crossing of the Sivash.",
              advisor: {
                name: "Frunze",
                quote:
                  "The Wall is built to stop an army that comes straight at it. It was not built to stop one that doesn't. Wading the Sivash at night, in November, is going to cost lives — I'm not going to dress that up. So does another winter spent besieging Perekop head-on. I know which cost I'd rather explain afterward.",
              },
              historical: true,
              setFlags: { perekopPlan: "sivash_crossing" },
              // Threshold tightened round 22 (-5 -> -3) -- historical choice,
              // kept more conservative than the historical:false gates.
              gate: (m) => m.reliability >= -3,
              disabledReason: "A night crossing of the Sivash requires formations that will not dissolve in the dark. These will.",
              impact: {},
              next: "kronstadt21",
              outcome:
                "The crossing succeeds. Blücher's division fords the Sivash overnight and turns the Perekop defense from the rear — the maneuver that actually breaks Wrangel's line and starts the retreat that ends, on the other side of this history, at the Crimean docks.",
            },
            {
              label: "Rely on a massed frontal assault against the Turkish Wall alone. Skip the Sivash crossing's risk.",
              advisor: {
                name: "Southern Front Staff Officer",
                quote:
                  "I am not questioning that the crossing worked. I am pointing out that it worked — it was not guaranteed to, and an army that drowns fording an inlet at night in November has not flanked anything. There is a version of this plan that doesn't require the Sivash to cooperate.",
              },
              historical: false,
              setFlags: { perekopPlan: "frontal_only" },
              impact: { mobilization: -3, reliability: 1 },
              next: "compressedEvacuation20",
              // Deliberately ungated. Every other choice at this node carries a
              // gate, so gating this one too can leave the node with zero
              // available choices — an actual softlock, observed in simulation
              // before this was removed. The frontal assault is the desperate
              // fallback: always available, precisely because it is the option
              // that needs no advantage to attempt.
              outcome:
                "The Wall is taken by weight of numbers alone, without the flanking maneuver. It costs more men and more time than the historical crossing did — Wrangel's defense holds a little longer, and the evacuation it eventually forces happens on a delayed clock rather than the one already written into the record.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of the delayed, frontal-only Perekop
      // assault. historicalRecord true: the real evacuation timeline this
      // delay compresses is documented down to the day — Red forces broke
      // through on November 11, Wrangel's evacuation order went out on the
      // 13th, and the entire operation was complete by the 16th. There was
      // almost no slack in that schedule even in the version that actually
      // happened.
      case "compressedEvacuation20":
        return {
          date: "NOVEMBER 1920",
          title: "The Ports: What the Pursuit Is For",
          historicalRecord: false,
          context:
            "Perekop has fallen and Wrangel's evacuation is under way from five Crimean ports. Historically the Southern Front did not race the ships: Frunze had already offered Wrangel's officers an amnesty by radio on 11 November, and the Red advance into the peninsula was rapid but did not seriously contest the embarkation. Some 145,693 people left on 126 vessels between 13 and 16 November, and the Republic let them go.",
          situation:
            "The delay at Perekop has compressed a schedule that had almost no slack in it. Wrangel's staff are loading against a clock that is shorter than the one they actually had, and the Southern Front is close enough to the ports to make the difference between an evacuation and a rout — if it presses. What has to be decided here is not how the Whites load their ships. It is whether the Republic spends the men and the days required to reach the quays before they finish, or lets the Crimea empty and takes the peninsula without a fight for it.",
          choices: [
            {
              label: "Press the pursuit to the ports. Take the quays before the loading finishes.",
              advisor: {
                name: "Frunze",
                quote:
                  "I offered them an amnesty and I meant it, but an amnesty is a political instrument and the men on those ships are the ones who will be back with French guns in three years if they are anywhere at all. If we can reach the quays, I would rather this ended in the Crimea than in Constantinople.",
              },
              historical: false,
              setFlags: { compressedEvacuation: "press_ports" },
              // Threshold tightened round 22 (-5 -> -2), same bite-rate
              // rationale as the reliability/warIndustry gates above.
              gate: (m) => m.mobilization >= -2,
              disabledReason: "Racing an evacuation to the quays requires formations able to force a march. This front has none to spare.",
              impact: { mobilization: 1 },
              next: "kronstadt21",
              outcome:
                "The pursuit is pressed to the water. Whether a Red Army arriving at a loading quay produces a captured evacuation or the kind of chaos Novorossiysk became eight months ago has no settled answer. The roll supplies one.",
              uncertain: (() => {
                const holdsWeight = modWeight(45, meterPct(meters.mobilization));
                return [
                  {
                    weight: holdsWeight,
                    title: "The quays are reached and the evacuation is cut short",
                    setFlags: { compressedEvacOutcome: "cut_short" },
                    impact: { mobilization: 2 },
                    outcome:
                      "Advance elements reach two of the five ports while loading is still under way. Substantially fewer than the historical 145,693 get out. What the Republic gains is an emigration too small to organise itself abroad; what it acquires is responsibility for everyone left standing on the quay.",
                  },
                  {
                    weight: 100 - holdsWeight,
                    title: "The pursuit arrives to find the ships already gone",
                    setFlags: { compressedEvacOutcome: "arrived_late" },
                    impact: { mobilization: -3, warIndustry: -1 },
                    outcome:
                      "The pursuit is pressed hard, costs the formations doing it, and reaches the ports after the last vessels have cleared. The Crimea is taken either way. The difference is that it is taken by an army that has just spent itself racing an evacuation it did not catch.",
                  },
                ];
              })(),
            },
            {
              label: "Let them go. Take the Crimea without contesting the embarkation.",
              advisor: {
                name: "Kamenev",
                quote:
                  "The peninsula is the objective and the peninsula is ours in either case. Storming a loading quay against men with nothing left to lose costs us formations we will want in the spring, in exchange for prisoners we would then have to feed.",
              },
              historical: true,
              setFlags: { compressedEvacuation: "let_them_go" },
              impact: {},
              aftermath:
                "This is what happened. The Southern Front did not seriously contest the embarkation; 145,693 people left on 126 vessels between 13 and 16 November 1920, and the fleet reached Constantinople. What followed for those who stayed is a separate matter: the Crimean repressions under Béla Kun and Rozalia Zemlyachka killed a disputed number of remaining officers and civilians over the following months, with estimates ranging from several thousand to tens of thousands.",
              next: "kronstadt21",
              outcome:
                "The ports are left alone. The last vessels clear on 16 November and the Crimea is occupied without a fight for the quays — the Civil War's European front effectively over, at a cost the Republic did not have to pay in men.",
            },
          ],
        };

      // ---------------------------------------------------------------------
      // -----------------------------------------------------------------------
      // The Polish war. Every other ending in this campaign is a variant of
      // Kronstadt in March 1921 — the Republic winning, and the argument being
      // about what winning cost. This node is the one place the record offers
      // an unambiguous Soviet defeat, and it happens four months earlier and
      // against an external enemy rather than its own sailors.
      // historicalRecord true: the advance on Warsaw, the argument over the
      // Cavalry Army's axis, and Tukhachevsky's own later account of it.
      case "polishWar20":
        return {
          date: "AUGUST 1920",
          title: "The Vistula: Warsaw or Lwów",
          historicalRecord: true,
          context:
            "The Polish–Soviet war has run since spring. Piłsudski took Kiev in May; the counteroffensive threw him back nearly 400 miles, and by August Tukhachevsky's Western Front is at the Vistula with Warsaw in front of it. Lenin's calculation is explicit and political: a Red Army entering Warsaw brings the revolution to Germany. The 1st Cavalry Army, under Budyonny with Stalin as the South-Western Front's political member, is committed at Lwów, 250 miles to the south — and Tukhachevsky's exposed left flank needs it at Warsaw.",
          situation:
            "The order to transfer the Cavalry Army north has been issued and is not being obeyed with any urgency. Lwów is close to falling and the men in front of it can see that; Warsaw is a different front's problem. Command has to decide whether to force the transfer against a front command that plainly does not want to make it, or accept the southern axis and let Tukhachevsky close on Warsaw with his flank as it is.",
          choices: [
            {
              label: "Force the transfer. The Cavalry Army goes north to Warsaw regardless of what Lwów costs.",
              advisor: {
                name: "Tukhachevsky",
                quote:
                  "My left flank is open and everyone in this room knows which formation is supposed to be covering it. If Lwów falls a month later than it might have, the Republic survives that. If the Vistula goes badly with the cavalry 250 miles away, I would like it on the record whose decision that was.",
              },
              historical: false,
              setFlags: { polishAxis: "north" },
              impact: { mobilization: -2 },
              aftermath:
                "The transfer was ordered and was not carried out in time; the Cavalry Army remained engaged at Lwów through the decisive days. Whether its presence at Warsaw would have changed the outcome is one of the genuinely open questions of the war — Piłsudski's counterstroke from the Wieprz struck a gap that existed for reasons beyond one formation's position, and Soviet cipher security had been broken by Polish cryptanalysts throughout.",
              next: "endingTheVistula20",
              outcome:
                "The cavalry turns north, late and under protest. It arrives into a battle already being decided by Piłsudski's counterstroke out of the Wieprz, and the Western Front's collapse is not prevented by it — only witnessed by more of the Republic's best cavalry than would otherwise have been there.",
            },
            {
              label: "Accept the southern axis. Take Lwów, and let the Western Front carry Warsaw on its own.",
              advisor: {
                name: "Stalin",
                quote:
                  "The South-Western Front has an objective in front of it and the men to take it. I am not going to break off an operation that is working in order to reinforce one that may not, on the argument that Warsaw is worth more than Galicia because Warsaw is closer to Berlin.",
              },
              historical: true,
              setFlags: { polishAxis: "south" },
              impact: {},
              aftermath:
                "This is what happened. The Cavalry Army stayed south, Warsaw was lost between 12 and 25 August in what Polish accounts call the Miracle on the Vistula, and the Western Front was driven back several hundred miles. The Treaty of Riga in March 1921 fixed a border well east of the Curzon Line. The recriminations over whose decision lost Warsaw ran in Soviet military print for years afterward and were never settled on the merits.",
              next: "endingTheVistula20",
              outcome:
                "Lwów holds the Cavalry Army's attention. Warsaw is decided without it, and decided against the Republic.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // ENDING — the Republic's one clear defeat, and the campaign's only
      // ending that is not about Kronstadt.
      // -----------------------------------------------------------------------
      // ENDING — the Republic's own mid-war collapse. Every other bolshevik
      // ending sits in 1920-21 and assumes the war is won; October 1919 is
      // the month it very nearly was not, and the campaign had no way to
      // represent that. Reached by arriving at the Orel crisis with the
      // war industry exhausted and the army politically unreliable.
      case "endingTheAutumnCrisis19":
        return {
          isEnding: true,
          title: "The Autumn Crisis",
          date: "OCTOBER 1919",
          badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "Orel does not hold. The Southern Front gives way along the Kursk axis while Yudenich's separate army is still inside sight of Petrograd, and for a period of weeks the Republic is fighting for Moscow and Petrograd simultaneously with formations it cannot equip and cannot fully trust.\n\nHistorically this month is the closest the Soviet government came to losing the war, and it held — barely, and for reasons that were as much about White disorganisation as Red strength. Denikin's three axes never coordinated; Yudenich's advance ran out of supply at the gates; the Latvian riflemen and Primakov's cavalry arrived at Orel in time. Remove the war industry that armed those formations and the political reliability that held them together, and the same month goes the other way.\n\nWhat follows is not a White victory in any clean sense — no White commander was in a position to govern what they were taking, and the historical record makes that abundantly clear. It is the end of this particular government, and the beginning of something considerably less legible: a Russia without a Bolshevik state and without any settled alternative to it, fought over by armies whose only real point of agreement was what they were against. The Civil War does not end in 1921 on this path. Nobody involved would recognise the question of when it ended."
        };

      case "endingTheVistula20":
        return {
          isEnding: true,
          title: "The Vistula",
          date: "AUGUST 1920 – MARCH 1921",
          badge: "◆ HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "The Red Army does not enter Warsaw. Between 12 and 25 August 1920, Piłsudski's counterstroke out of the Wieprz cuts into the gap on Tukhachevsky's left and rolls the Western Front back several hundred miles; tens of thousands of Red Army men are taken prisoner, and tens of thousands more are interned across the East Prussian border. The revolution does not reach Germany by this route or any other.\n\nThe Treaty of Riga, signed in March 1921 in the same month as Kronstadt, fixes a Soviet–Polish border well east of the line Britain had proposed, and the Republic accepts it because it has nothing left to spend on refusing. This is the Civil War's one unambiguous defeat for the side that won the Civil War.\n\nNo one involved accepts responsibility for it." +
            (flags.polishAxis === "north"
              ? " The order to transfer the Cavalry Army was given; it was not executed with any urgency, and it reached Warsaw after the battle that mattered. Tukhachevsky's staff call it a refusal in every account written afterward. The South-Western Front calls it an order arriving too late for an army already fully engaged at Lwów to disengage cleanly from — a different failure than the one it gets blamed for, and a distinction that convinces nobody outside the room where it's made."
              : " Tukhachevsky's Western Front blames the South-Western Front's outright refusal to release the Cavalry Army; the South-Western Front blames a Western Front that overextended 400 miles from its supply and lost its own left flank before the cavalry question was even decided.") +
            " Both arguments are still being made in print years afterward, by men who will spend the rest of their careers in the same rooms as each other.",
        };

      case "kronstadt21":
        return {
          date: "MARCH 1921",
          title: "Kronstadt: Soviets Without Us",
          bulletin: {
            headline: "THE ONLY WAR STILL RUNNING",
            body: "The Civil War's other two major fronts have already ended. Whatever this fortress represents, it is not a continuation of the war against organized White armies. That war is over.",
            meanwhile: {
              southRussia: "Finished four months ago. Wrangel's fleet reached Constantinople in November; close to 150,000 people evacuated with it. No organized White force remains west of the Urals.",
              siberia: "Also effectively finished. What survived the retreat crossed into Manchuria months ago, disarmed at the border by Chinese authorities regardless of which White command it had answered to. The Far Eastern Republic, the Bolshevik-tolerated buffer state, is currently holding its own Constituent Assembly — a state doing through negotiation what this fortress is asking the Republic to do by force of demand.",
            },
          },
          historicalRecord: true,
          situation:
            "The White armies are beaten — Wrangel's Crimea already fell four months ago, on the other side of this history. This is not that war. The sailors of the Kronstadt naval garrison, who backed the October Revolution as firmly as anyone in this room, have raised a Provisional Revolutionary Committee and issued fifteen demands: free Soviet elections, an end to grain requisitioning, release of imprisoned socialists. They are not White. They are asking the Revolution to keep the promises it made to people like them in 1917." +
            (flags.polishAxis === "north"
              ? " The Cavalry Army was pulled north to the Vistula and arrived too late to matter. Formations that spent August on the Polish border are among those now being ordered onto the ice, and they have already been asked once this year to win something the Republic then lost anyway."
              : flags.polishAxis === "south"
              ? " The Cavalry Army stayed at Lw\u00f3w while Warsaw was lost. Every senior man in this room has spent the winter being asked, in print and in committee, whose decision that was — and arrives at Kronstadt with an appetite for a result nobody can argue about."
              : "") +
            (flags.perekopPlan === "sivash_crossing"
              ? " The Sivash crossing worked. The men who waded the Rotten Sea in November are, in some cases, the same men now being ordered across the ice at Kronstadt against sailors who are not Wrangel."
              : flags.perekopPlan === "frontal_only"
              ? " Perekop was taken frontally, at a cost the Sivash crossing was designed to avoid. The formations available for an assault across the ice are thinner for it, and this one has to be made anyway."
              : ""),
          choices: [
            {
              label: "Demand unconditional surrender. Order Tukhachevsky to take the fortress by force across the ice before the spring thaw.",
              advisor: {
                name: "Trotsky",
                quote:
                  "I know exactly who is inside that fortress and what they fought for in 1917 — better than most of the men now arguing for patience. None of that changes the arithmetic. A rebellion at Kronstadt, this close to Petrograd, with the ice still crossable, is not a grievance the Republic has the luxury of negotiating on their timeline instead of ours.",
              },
              historical: true,
              setFlags: { kronstadtChoice: "assault" },
              impact: {},
              costsCapital: true,
              next: "kronstadtReckoning21",
              outcome:
                "The ultimatum goes out — surrender or be 'shot like partridges.' The first assault on March 8 fails badly enough that one regiment mutinies rather than continue it. The second, on March 17-18, succeeds. Somewhere between 1,200 and 2,000 are executed after the surrender, mostly without trial; thousands more are sent to the Solovki camp. Some who fled across the ice to Finland are later lured back by an amnesty that is not honored.",
            },
            {
              label: "Open real negotiations on the demands themselves rather than issue an ultimatum.",
              advisor: {
                name: "Kalinin",
                quote:
                  "I do not think 'Soviets without Communists' is a demand this government can simply grant — but free elections and an end to requisitioning are not White Guard demands, whatever we are calling this in the newspapers. I think we owe it to the men who made the Revolution possible to at least test whether this is negotiable before we decide it isn't.",
              },
              historical: false,
              setFlags: { kronstadtChoice: "negotiate" },
              impact: { reliability: 3, mobilization: -2 },
              next: "kronstadtReckoning21",
              outcome:
                "Negotiations open instead of an ultimatum. Whether this fortress, this close to Petrograd, this armed, stands down through negotiation rather than force is not a question the record answers with confidence — the historical record shows what the ultimatum produced. It does not show what genuine negotiation would have.",
            },
            {
              label: "Neither yet. Wait for the thaw — an assault becomes impossible, but so does the fortress's link to Petrograd.",
              advisor: {
                name: "Kamenev",
                quote:
                  "In three weeks the ice is gone and nobody crosses it in either direction. They cannot march on Petrograd and we cannot storm them, and a garrison on an island with no relief and no harvest is a different negotiating partner in May than it is in March. The cost of waiting is that the Congress watches us wait.",
              },
              historical: false,
              setFlags: { kronstadtChoice: "wait_for_thaw" },
              impact: { mobilization: -2, reliability: 1 },
              aftermath:
                "The thaw was the reason the assault happened when it did rather than an alternative to it: the ice was the only approach, and Tukhachevsky's timetable was set by how long it would hold. Waiting was argued in the sense that several members pressed for negotiation while the ice lasted, but no proposal to deliberately let the crossing close and besiege the island through the summer was adopted. What the record does show is that the fortress had limited provisions and the Baltic Fleet's own coal stocks were nearly exhausted.",
              next: "kronstadtReckoning21",
              outcome:
                "The ultimatum is not issued and the assault is not ordered. The ice goes out in the last week of March and takes the question with it — Kronstadt becomes an island the Republic cannot reach and cannot be threatened from, holding fifteen demands nobody has answered, through a summer in which the NEP quietly grants the largest of them.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // CHECKPOINT — decision-gated routing, not a meter check. The
      // historical assault happens regardless of what came before it —
      // that part isn't contingent on the player. What genuinely differs is
      // how it reads: a command that answered every earlier regional
      // objection with centralized force rather than accommodation has no
      // reservoir of goodwill left for the NEP concession to draw on, and
      // the suppression reads as naked capitulation-by-force rather than
      // the real historical "wins by force, concedes by policy" complexity
      // — a distinct ending, not a text variant. Gate was originally the
      // accumulated legitimacy meter (<= -6) alongside the assault flag;
      // changed to two specific centralizing decisions in direct sequence,
      // for the same reason as the other two campaigns' checkpoints — the
      // triangle shouldn't be what decides which ending a run gets.
      case "kronstadtReckoning21":
        if (flags.kronstadtChoice === "wait_for_thaw") {
          return this.resolveNode("endingTheIsland21");
        }
        if (flags.kronstadtChoice === "assault" && flags.requisitionPolicy === "intensified" && flags.congressChoice === "press") {
          return this.resolveNode("endingHollowVictory21");
        }
        return this.resolveNode(flags.kronstadtChoice === "assault" ? "endingIceBroken" : "endingUnlikelyPrecedent");

      // -----------------------------------------------------------------------
      // ENDING — the fortress neither stormed nor negotiated with, left on the
      // far side of open water. Distinct from endingUnlikelyPrecedent, which is
      // a negotiated settlement: this one settles nothing and lets the question
      // expire instead.
      case "endingTheIsland21":
        return {
          isEnding: true,
          title: "The Island",
          date: "MARCH – SEPTEMBER 1921",
          badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "The ice goes out in the last week of March and the question goes with it. No ultimatum is issued, no assault is ordered, and the Provisional Revolutionary Committee finds itself governing an island that cannot be reached and cannot reach anywhere else. Fifteen demands remain on the table with nobody obliged to answer them.\n\nHistorically the ice was the whole timetable. Tukhachevsky's assault went in on 17–18 March because the crossing would not hold much longer, and the fortress fell before the thaw could make the question academic. Letting it become academic instead costs the Republic the thing the assault was actually for, which was never the island: it was the demonstration that a Soviet could not overrule the Party and survive the experience. Kronstadt spends the summer as a standing example that it can.\n\nWhat undercuts the garrison is not force. The Tenth Party Congress, sitting the same month, ends grain requisitioning — the sailors' first and largest demand — and the New Economic Policy grants in April what the fortress asked for in March. By August the committee is arguing about what it is still for, in a garrison on short rations with the Baltic Fleet's coal nearly gone. The demands about free elections and imprisoned socialists are not granted and are not refused; they simply stop being urgent to anyone on the mainland.\n\nSome of the garrison leaves for Finland over the summer in small boats. Some stay. There is no massacre to record, no Solovki transports, and no amnesty dishonoured, because there is no surrender to dishonour it after. There is also no moment at which the Revolution has to say out loud what it would do to people who were on its own side in 1917 — which is either mercy or evasion, and this Revolution has spent three years demonstrating how hard those two are to tell apart from the inside.",
        };

      // -----------------------------------------------------------------------
      // ENDING — reachable only via the historical assault choice combined
      // with two specific centralizing decisions: intensifying requisitioning
      // in reconquered territory, and pressing the Congress floor fight
      // rather than negotiating. historicalRecord false: the assault and its
      // casualty figures are real and identical to endingIceBroken's — what's
      // speculative is the domestic and international reading of it, which
      // the real record doesn't separately track by which policy path a
      // government took to get there.
      case "endingHollowVictory21":
        return {
          isEnding: true,
          title: "A Hollow Victory",
          date: "MARCH 1921",
          badge: "SPECULATIVE — SAME EVENT, DIFFERENT RECKONING",
          classification: "speculative",
          epilogue:
            "The assault happens exactly as it did historically — the failed March 8 attempt, the mutiny, the successful second assault on the 17th-18th, the executions, Solovki. None of that is different. What's different is that this command arrives at Kronstadt having chosen intensified requisitioning over restraint in reconquered territory, and having pressed the Congress floor fight rather than folding the Opposition's concerns in quietly. Two decisions, not an accumulated total — but the two that mattered most for whether anyone still extends this government the benefit of the doubt. There is no reservoir of revolutionary goodwill left for the NEP announcement, in the same month, to draw on.\n\nHistorically, even sympathetic observers can read Lenin's NEP as a genuine, if late, course correction — grain requisitioning ended in the same breath as the sailors who died protesting it were executed, an uncomfortable but real complexity. Here, with those two decisions already on the record, nobody extends that same benefit of the doubt. The concession reads as exactly what it looks like on its surface: capitulation dressed as policy, offered only after the guns had already answered the actual argument. The Revolution wins Kronstadt by force either way. Only one version of this command still gets to claim it conceded anything freely." +
            (flags.smirnovAssignment === "sidelined"
              ? "\n\nSmirnov was kept away from field command as well as policy — marginalized completely rather than partially. The Military Opposition's people learned from it what the sailors are learning now: that disagreement inside this structure is not answered, it is administered. They arrived at the same conclusion two years apart, by the same route."
              : flags.smirnovAssignment === "field_command"
              ? "\n\nSmirnov was given a real field command despite the political marginalization, and performed in it. It was the one moment this command distinguished between a man's disagreement and a man's usefulness. Nobody at Kronstadt is being offered that distinction."
              : "") +
            (flags.rationingConsequence === "held_firm"
              ? "\n\nThe supply split was held as firm policy against both fronts' objections. Consistency of that kind is a virtue in an allocation table and something else entirely when it becomes the only answer this command knows how to give."
              : ""),
        };

      // ---------------------------------------------------------------------
      // ENDINGS
      // ---------------------------------------------------------------------
      case "endingIceBroken":
        return {
          isEnding: true,
          title: "The Ice Broken",
          date: "MARCH 1921",
          badge: "HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "The second assault takes the fortress on March 17–18, after the first attempt on March 8 fails badly enough that one regiment mutinies rather than continue it. Somewhere between 1,200 and 2,000 rebels are executed afterward, most without trial; thousands more are sent to Solovki, the first major Soviet concentration camp. Some who escaped across the ice to Finland are later lured home by an amnesty that is not honored."
            + (flags.congressFallout === "marginalized" || flags.tsaritsynOutcome === "recalled"
                ? "\n\nNone of that surprises anyone who watched this command's pattern from the beginning — Tsaritsyn, the Congress fallout, every regional objection answered the same way. Kronstadt is not a break from how this command has governed. It is that pattern's largest, and last, application."
                : "\n\nEven a command that chose accommodation more often than not, when it had the choice, arrives at the same ultimatum in the end — a reminder that not every outcome in this war actually turned on what came before it, however much most of the earlier ones did.")
            + (flags.compressedEvacOutcome === "arrived_late"
                ? "\n\nThe pursuit to the Crimean ports was pressed hard four months ago and arrived after the ships had cleared — a formation spent racing something it did not catch. The same appetite for a decisive result, and the same willingness to spend men reaching for one, is what puts this command on the ice at Kronstadt rather than at a negotiating table."
                : flags.compressedEvacOutcome === "cut_short"
                ? "\n\nThe pursuit reached two of the five Crimean ports before the loading finished, and the emigration that left was too small to organise itself abroad. It worked. A command that has recently been proved right about pressing an advantage to the water is not a command inclined to hear that a fortress full of sailors is a different kind of problem."
                : "")
            + "\n\nIn the same month, at the same Party Congress that ratifies the suppression, Lenin also introduces the New Economic Policy — ending the forced grain requisitioning that was the sailors' own core grievance. The Revolution wins the argument by force and concedes it by policy in the same breath. The question was never whether the Bolsheviks would win the Civil War. It was what winning actually cost, and to whom. This is the answer." +
            (flags.compressedEvacuation === "press_ports"
              ? "\n\nThe Crimean quays were contested four months ago rather than conceded. Whatever the pursuit caught, what it established was that this command does not let an enemy leave when it has the means to stop them — and the sailors in the fortress are, by the Party's own account of them, no longer being counted as anything but an enemy."
              : flags.compressedEvacuation === "let_them_go"
              ? "\n\nWrangel's people were let go from the Crimean ports four months ago without a fight for the quays: a hundred and forty-five thousand of them, on the reasoning that the peninsula was the objective and prisoners were a burden. That restraint was extended to a defeated enemy army. It is not extended here, to men who were on this side of the war in 1917 and are asking the Revolution to keep its word."
              : "") +
            (flags.distributedPursuitChoice === "press"
              ? "\n\nThe pursuit after Orel was pressed without cavalry reconnaissance, on the reasoning that a retreating enemy is not a dangerous one. The habit of assuming a broken opponent stays broken is the same habit that reads fifteen demands from Kronstadt as a White plot."
              : ""),
        };

      case "endingUnlikelyPrecedent":
        return {
          isEnding: true,
          title: "An Unlikely Precedent",
          date: "MARCH 1921",
          badge: "SPECULATIVE — PLAUSIBLE, NOT WISH-FULFILLMENT",
          classification: "speculative",
          epilogue:
            "Negotiation is genuinely attempted instead of an ultimatum. Whether an armed garrison this close to Petrograd, with the ice still crossable and the Party's own authority stretched thin by three years of civil war, could actually have been talked down rather than assaulted is a real point of dispute among historians — the sailors' core demand, 'Soviets without Communists,' asked the Party to surrender exactly the thing it was least willing to give up. Even historians sympathetic to the rebels mostly conclude a negotiated outcome was unlikely to hold for long, not that it was impossible to attempt."
            + (flags.congressChoice === "negotiate"
                ? "\n\nThis isn't the first time this command has chosen negotiation over an ultimatum with an internal faction it had the raw authority to simply crush. The Military Opposition got the same treatment back at the Eighth Congress, and it held — a genuine concession, not a collapse. Whether that same instinct can talk down an armed garrison the way it once talked down a losing faction in a closed committee room is the actual question this ending is testing, and it's a harder one than the Congress ever posed."
                : "\n\nThis command pressed its advantage at the Eighth Congress rather than negotiate the last time an internal faction pushed back — and won that fight in the end, if at real cost to the delegates who believed the closed-session result meant something. Attempting negotiation now, at Kronstadt, is a genuine departure from that pattern, not a continuation of it. Whether it's a departure this command can actually sustain under a fortress's guns is precisely what the historical record doesn't get to answer.")
            + "\n\nNo one gets to find out for certain whether it would have worked. What remains is the question the historical ultimatum foreclosed the moment it went out." +
            (flags.postingAuthority === "real"
              ? "\n\nThere is one prior data point. Stalin's reassignment after Tsaritsyn was given real authority rather than supervised authority — a genuine restoration of trust to a man this command had every institutional reason to keep on a short leash. It was the same instinct that is being extended to Kronstadt now, on a far larger scale and with far less margin for being wrong about it."
              : flags.postingAuthority === "supervised"
              ? "\n\nThere is one prior data point, and it cuts the other way. Stalin's reassignment after Tsaritsyn came with discreet oversight attached — trust extended and quietly hedged at the same time. Whether an offer of negotiation from a command with that habit reads as genuine to men who have been on the receiving end of the Revolution's hedged trust is not a question the fortress is obliged to answer generously."
              : ""),
        };

      // -----------------------------------------------------------------------
      // HARD MODE ENDING — triggers whenever Centralization Backlash reaches
      // 100, at whatever node the player happens to be on. Not tied to a
      // single date — it's the culmination of the real, repeated pattern
      // this campaign's own content documents: Tsaritsyn, the Congress
      // fallout, every override of a regional commander's judgment in favor
      // of central authority, accumulated past what the Party will tolerate.
      case "endingCentralCommitteeMoves":
        return {
          isEnding: true,
          title: "The Central Committee Moves",
          date: "DATE VARIES — TRIGGERED BY ACCUMULATED CENTRALIZATION BACKLASH",
          badge: "SPECULATIVE — HARD MODE COLLAPSE",
          classification: "speculative",
          epilogue:
            "It is not a purge, and it does not need to be dramatic to be final. It is the accumulated weight of every regional commander overruled, every faction's objection answered with central authority rather than accommodation, every Tsaritsyn-style conflict resolved the same way — until enough of the men whose cooperation this command actually depends on have concluded that centralization has stopped being a wartime necessity and started being the point. The Central Committee doesn't need a battlefield defeat to remove a chairman who has made that many enemies among people whose support he needs to keep functioning.\n\nThis is not the historical Trotsky's fate in 1919 — his real removal came years later, for different reasons, after this war was already won. It is what an accumulation of exactly this kind of decision makes plausible: a command that never lost the war to the Whites, undone instead by the same Party apparatus it was built to serve.\n\nRemoval in 1919 or 1920 is not removal in 1927. There are no show trials yet, no expulsions from the Party, no ice axe. A chairman removed at this point is reassigned — a commissariat, a diplomatic posting, a committee with a long name and no army attached to it. The war goes on and is won without him, and the official histories written afterward find it steadily easier not to mention which specific decisions the Revvoensoviet's first chairman made or when. That is its own kind of ending: not a defeat, not a purge, simply a career redirected early enough that the record has room to close over it." +
            (flags.battalionNameTreatment === "symbolic_kept"
              ? "\n\nThe worker battalions kept their name after the men who earned it were gone, refilled with conscripts who had never been miners. Maintaining a symbol past the point where it described anything real is the same administrative reflex that ends this command's career: the form preserved, the substance quietly replaced, and everyone involved agreeing not to mention the gap."
              : flags.battalionNameTreatment === "reclassified"
              ? "\n\nThe worker battalions were reclassified honestly as ordinary units once the original mobilization was gone. It was the correct call and it cost something — a command willing to say plainly that a symbol had stopped meaning anything is a command that accumulates people who would rather it hadn't."
              : "") +
            (flags.donbasAttritionChoice === "reinforced"
              ? "\n\nThe Donbas battalions were reinforced and kept in the line rather than merged away. The regional Party figures who raised those men have long memories about who spent them, and some of them are in the room when this decision gets made."
              : ""),
        };

      default:
        return null;
    }
  },
};

// =============================================================================
// PROVISIONAL GOVERNMENT — Petrograd, 1917 (Round 24 — first slice, NOT a
// finished campaign; see the BACKLOG note and the Round 24 build log doc for
// what this covers and what it deliberately does not yet)
// =============================================================================
// Design note: every other campaign in this file starts at 0 on all three
// triangle axes and treats 0 as "what actually happened." This campaign is
// the one place in the file where "what actually happened" is *itself* the
// event the other three campaigns already take as fixed, unquestioned
// backstory (Kornilov's failed coup and arrest, in the AFSR dossier; the
// Bolshevik seizure of power, in every campaign's early bulletins). That
// means the historical choice at every node here MUST resolve to the same
// facts already written into those three campaigns' text — this campaign
// does not get to quietly rewrite what they already assert as settled. Only
// the divergent branch (Kornilov's advance actually reaching Petrograd) is
// free to go somewhere those three campaigns don't already describe — and
// where it goes, it goes somewhere that makes the other three campaigns'
// entire premise not happen, which the ending for that branch says outright
// rather than glossing over.
//
// Scope, stated plainly: this covers the April Crisis through the Kornilov
// Affair (April-August 1917) from the Provisional Government's own seat —
// not the Petrograd Soviet's or the Bolsheviks' side of the same months, and
// not the February Revolution itself (which was a leaderless street event no
// single seat of command actually directed — see the bulletin recap below
// for how it's handled instead) or the October Revolution as a playable
// node (it is this campaign's terminus, not a node inside it, for the same
// reason: by the time it happens the Provisional Government is not
// commanding the outcome, it is failing to survive it).
CAMPAIGNS.provisionalGov17 = {
  id: "provisionalGov17",
  label: "The Provisional Government",
  coalition: "provisional",
  shortTag: "PG",
  commander: "Alexander Kerensky, Minister of War",
  seat: "Mariinsky Palace, Petrograd",
  thesis:
    "Dual power, one palace: hold a coalition together against a war the front no longer wants to fight, a Soviet that can make any decree meaningless in the street, and a right that increasingly says the whole experiment should end. Not a campaign about winning the revolution — one about whether this government still exists by October.",
  start: "aprilCrisis17",
  hasFrontMap: false, // Petrograd, 1917 is one city and a handful of institutions, not a multi-front war -- the shared front-map/atlas-geography system this file uses for the other three campaigns doesn't fit here, and building a bespoke version of it is out of scope for this round. BriefingScreen checks this flag and hides "VIEW FRONT MAP" accordingly.

  initialMeters: {
    authority: 0,
    frontDiscipline: 0,
    sovietRelations: 0,
  },
  triangleAxes: [
    { key: "authority", label: "STATE AUTHORITY" },
    { key: "frontDiscipline", label: "FRONT DISCIPLINE" },
    { key: "sovietRelations", label: "SOVIET RELATIONS" },
  ],
  initialLegitimacy: 0,
  plannedEnding: {
    date: "OCTOBER 1917",
    title: "The Winter Palace Falls",
    note:
      "The historical terminus, not a defeat this command can avert by playing well -- every choice in this campaign shapes how isolated the government is by October, not whether October happens. That's deliberate: a version of this campaign where good play prevents the Bolshevik seizure of power would contradict what every other campaign in this file already treats as settled fact.",
  },
  hardMode: {
    key: "decreeCapital",
    label: "Rule By Decree",
    capitalName: "BONAPARTIST MODE",
    capitalLabel: "DECREE CAPITAL",
    description:
      "No rewind, no meter dashboard -- only cabinet minutes. Five points of Decree Capital to spend ruling by ministerial emergency power instead of negotiating with the Soviet Executive Committee's own delegates. Spend all five and the government hasn't out-argued the Soviet, it has stopped pretending dual power was ever a partnership -- named for the word Kerensky's own allies on the moderate left used, from the first coalition onward, for exactly the outcome they hoped backing him would prevent.",
    buttonLabel: "OPEN CABINET",
    maxCap: 5,
    maxEndingId: "endingKornilovsRepublic17",
  },

  NEWSPAPER_MASTHEAD: "VESTNIK VREMENNOGO PRAVITELSTVA",
  NEWSPAPER_SUBHEAD: "Herald of the Provisional Government -- as read at the Mariinsky Palace",

  ADVISOR_DOSSIERS: {
    kerensky: {
      role: "Minister of War, later Minister-Chairman",
      bio:
        "A lawyer and Duma deputy before 1917, the only man to hold high office simultaneously in the Provisional Government and, in its first months, as a deputy chairman of the Petrograd Soviet -- dual power's contradictions embodied in one person rather than argued between two institutions. Became Minister of War in the first coalition formed after this campaign's opening crisis, then Minister-Chairman from July after the second.",
      fate:
        "Fled Petrograd by car on 25 October (7 November NS) to rally General Krasnov's Cossacks at the front; the counter-attack collapsed at Pulkovo within days, and he never returned to Russian soil in a position of power. Lived another fifty-three years in exile, mostly in France and the United States, and died in New York in 1970 -- long enough to see nearly the entire war this file's other campaigns describe fought and finished.",
      faction: "Provisional Government, Coalition Cabinet",
      rank: 0,
    },
    kornilov: {
      role: "Supreme Commander-in-Chief (from 19 July/1 August 1917)",
      bio:
        "An escaped Austrian prisoner of war with a real battlefield reputation, appointed Supreme Commander by Kerensky himself after the June Offensive's collapse, on Kornilov's own condition that the government back restoring the death penalty and formal discipline at the front. What exactly Kerensky authorized before Kornilov's own advance on Petrograd in late August is still disputed -- an intermediary, Vladimir Lvov, carried proposals between them that each man afterward described differently, and whether this was a deliberate coup from the start or a plan Kerensky first encouraged and then publicly recast as mutiny is a real historians' argument, not settled the way the coup's failure itself is.",
      fate:
        "Arrested and held with the other generals implicated at Bykhov Monastery, under a guard lenient enough that he escaped in the chaos of the Bolshevik seizure of power that November, disguised as a Turkoman soldier. Made his way south to the Don. See the Armed Forces of South Russia campaign for what he does next -- and how it ends.",
      faction: "Supreme Command, Army General Staff",
      rank: 0,
    },
    tsereteli: {
      role: "Petrograd Soviet Executive Committee; Minister of Posts and Telegraphs, later Interior",
      bio:
        "A Georgian Menshevik released from Siberian exile in March 1917, and the real architect of the coalition this campaign's opening crisis produces -- the leading voice of 'revolutionary defencism' (hold the front, seek a negotiated peace without annexations, and work with the Provisional Government rather than against it) against the Soviet's own more radical minority. The government's ability to speak with the Soviet's actual majority at all runs through him more than through Kerensky.",
      fate:
        "Opposed the July rising as recklessness that could only help the government's enemies, then opposed the Bolshevik seizure of power in October just as firmly. Left Russia in 1921 after the Georgian Menshevik republic he helped lead was itself overrun by the Red Army, and died in exile in New York in 1959.",
      faction: "Petrograd Soviet, Menshevik-SR Majority",
      rank: 1,
    },
    miliukov: {
      role: "Foreign Minister (until the April Crisis)",
      bio:
        "A historian by training and the Kadet (Constitutional Democrat) party's leading figure for two decades before 1917, and the most articulate voice in this Cabinet for the argument that the new government's legitimacy abroad depends on honoring the old empire's commitments, war aims included -- the position the note bearing his name states plainly enough that its publication becomes this campaign's opening crisis.",
      fate:
        "Resigned days after the note's publication rather than soften its language. Remained active in Kadet politics through 1917 and the years after, opposed both the Bolsheviks and, eventually, most of the White movement's own leadership on questions of what postwar Russia should look like, and died in exile in France in 1943.",
      faction: "Kadet Party, First Coalition Cabinet",
      rank: 1,
    },
  },

  NODE_ATLAS: [
    { id: "aprilCrisis17", date: "APRIL 1917", title: "Petrograd: The Note That Became Public" },
    { id: "juneOffensive17", date: "JUNE 1917", title: "The Southwestern Front: An Offensive With a Government's Name On It" },
    { id: "julyDays17", date: "JULY 1917", title: "Petrograd: The Days the Machine Guns Came Out" },
    { id: "kornilovAffair17", date: "AUGUST 1917", title: "Petrograd: The General's Trains" },
  ],
  NODE_TOTAL: 4,
  ENDINGS_GALLERY: [
    { id: "endingWinterPalaceFalls17", title: "The Winter Palace Falls", classification: "historical" },
    { id: "endingKornilovsRepublic17", title: "The General's Republic", classification: "speculative" },
  ],
  ENDING_CLASSIFICATION: {
    endingWinterPalaceFalls17: "historical",
    endingKornilovsRepublic17: "speculative",
  },

  resolveNode(nodeId, flags = {}, meters = {}) {
    switch (nodeId) {
      // -----------------------------------------------------------------
      case "aprilCrisis17":
        return {
          date: "APRIL 1917",
          title: "Petrograd: The Note That Became Public",
          bulletin: {
            headline: "AN EMPIRE ENDS WITHOUT A COMMAND STRUCTURE TO END IT",
            body:
              "Nine weeks ago there was a Tsar. The abdication itself -- 2 March, at Pskov, after five days of strikes, a garrison mutiny, and a Duma committee that formed to fill the vacuum before anyone had decided it should -- wasn't a decision this government made; it inherited the result. Power split on arrival between this Cabinet, appointed by the old Duma's committee, and the Petrograd Soviet of Workers' and Soldiers' Deputies, elected in the same chaotic week and controlling the garrison, the railways, and the printing presses this government needs to be obeyed at all. Neither side calls the other illegitimate. Neither side can act without the other's cooperation, either.",
            meanwhile: {
              southRussia: "Does not exist yet as a command. The Volunteer Army's founders are still serving officers of an army that answers, for now, to this government.",
              siberia: "Does not exist yet as a command. The Czechoslovak Legion is still an Allied unit in transit through Russian territory, over a year from the revolt that will make Siberia a front at all.",
              bolsheviks: "Lenin is still in Zurich. The Bolshevik faction inside the Petrograd Soviet is a small, radical minority, not yet the majority that any of this campaign's choices will help build.",
            },
          },
          historicalRecord: true,
          situation:
            "Foreign Minister Miliukov's note to the Allies, reaffirming this government's commitment to the war and to the territorial gains the old regime promised itself, has leaked into print exactly as written -- with none of the 'peace without annexations' language the Soviet's own Executive Committee has spent weeks getting this Cabinet to publicly accept. Armed soldiers and workers are demonstrating outside the Mariinsky Palace. A counter-demonstration of officers and cadets has also formed. Nobody has fired anything yet. Miliukov is not offering to resign on his own.",
          choices: [
            {
              label: "Back Miliukov. The note states this government's actual policy; reversing it because a crowd formed outside the palace teaches every future crowd that a crowd is how policy gets made here.",
              advisor: {
                name: "Miliukov",
                quote: "I have not lied to the Allies about what we intend. I am being asked to lie to them instead, and to call the lie clarification. I would rather resign than sign my name to it.",
              },
              historical: false,
              setFlags: { aprilCrisisChoice: "standFirm" },
              impact: { authority: -2, sovietRelations: -3 },
              next: "juneOffensive17",
              outcome:
                "The note stands as written. The demonstrations don't stop; they harden, and the officer counter-demonstration hardens with them. Miliukov keeps his portfolio for now, at the cost of a Soviet Executive Committee that no longer takes this Cabinet's public commitments at face value.",
            },
            {
              label: "Accept the Soviet's terms: clarify the note's language, and bring Soviet-aligned socialists into the Cabinet itself rather than governing over their objections.",
              advisor: {
                name: "Tsereteli",
                quote: "A coalition is not a concession. It is the only version of this government that can actually issue an order and have it obeyed past the palace gates. I would rather share the Cabinet than keep the whole of it and none of the authority that comes with it.",
              },
              historical: true,
              setFlags: { aprilCrisisChoice: "coalition" },
              impact: {},
              next: "juneOffensive17",
              outcome:
                "Miliukov and War Minister Guchkov resign within days. On 5 May a reorganized coalition cabinet is sworn in with six socialist ministers, Kerensky moving from Justice to War among them -- the first time the Soviet's own people sit in the government rather than merely supervising it from outside.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // Reached by both aprilCrisis17 choices with no flags-conditional
      // branch here — check-continuity.js flags this every run, and it's a
      // deliberate, accepted convergence, not a gap: this is a 4-node
      // chain, not a wide tree, and April's choice is already read forward
      // (see julyDays17's situation text) rather than forked into two
      // separate versions of June that would say the same thing anyway.
      case "juneOffensive17":
        return {
          date: "JUNE 1917",
          title: "The Southwestern Front: An Offensive With a Government's Name On It",
          bulletin: {
            headline: "THE FIRST FREE PRESS IN THE EMPIRE'S HISTORY IS ALSO ARGUING FOR THE ARMY TO STOP FIGHTING",
            body:
              "Censorship lifted with the old regime, and the range of what Russian newspapers now openly print, from Kadet papers demanding the offensive to Bolshevik ones calling every day of continued war a crime against the men fighting it, is itself something the old empire never had to govern through. The army's own soldier committees -- elected, and empowered by the Soviet's own Order No. 1 to countermand officers -- are reading all of it.",
            meanwhile: {
              southRussia: "Brusilov is still Supreme Commander for one more month; the officers who will found the Volunteer Army are watching the front committees test how much authority survives contact with an elected soldier vote.",
              siberia: "Does not exist yet as a command. Still over a year from the Czechoslovak Legion's revolt.",
              bolsheviks: "Not yet a command, and not yet arguing this from inside a government -- the Bolsheviks' position that the offensive is a crime against the men fighting it is currently a minority opinion in the Soviet, not yet the policy of anything.",
            },
          },
          historicalRecord: true,
          situation:
            "As the new War Minister, you campaigned across the front for this offensive personally, on the argument that Russia keeps its seat among the Allies -- and its claim on any postwar settlement -- only by fighting, not merely by surviving. The Southwestern Front attacks at dawn on 18 June. The first two days go well: real ground, real prisoners. What happens after that is not yet written.",
          choices: [
            {
              label: "Commit the reserves forward the moment the initial advance succeeds, to turn a local gain into an actual breakthrough before the front stabilizes again.",
              advisor: {
                name: "Kerensky",
                quote: "I did not spend three weeks telling exhausted men why this offensive matters so that we could stop the day it started working. A gain we don't press is a gain we'll have spent for nothing at all.",
              },
              historical: true,
              setFlags: { offensiveChoice: "pressForward" },
              impact: { frontDiscipline: 1 },
              next: "julyDays17",
              outcome:
                "The reserves go in. What the roll below decides is not whether the offensive succeeds in the end -- it doesn't -- but how much of the army survives finding that out.",
              uncertain: (() => {
                const holdsWeight = modWeight(30, meterPct(meters.frontDiscipline));
                return [
                  {
                    weight: holdsWeight,
                    title: "The advance stalls in good order",
                    setFlags: { offensiveOutcome: "contained" },
                    impact: { frontDiscipline: 1 },
                    outcome:
                      "The German-Austrian counterattack on 6 July still breaks the front near Tarnopol, exactly as it did in the record -- committing the reserve doesn't change that. It does mean the retreat that follows is a retreat, with formations still answering to their officers, rather than the wholesale collapse the same counterattack produced where units had already stopped listening to anyone.",
                  },
                  {
                    weight: 100 - holdsWeight,
                    title: "The retreat becomes a rout",
                    setFlags: { offensiveOutcome: "routed" },
                    impact: { frontDiscipline: -4, authority: -1 },
                    outcome:
                      "The reserve is caught up in the same collapse it was meant to prevent. Entire divisions stop being military units capable of receiving orders, in numbers even the front committees can't spin as discipline holding. The word for what the newspapers do with this by the second week of July is not 'setback.'",
                  },
                ];
              })(),
            },
            {
              label: "Hold the reserves back and consolidate the initial gain, rather than gambling everything on turning two good days into something larger.",
              advisor: {
                name: "General Kornilov",
                quote: "An army this ready to stop fighting on its own does not get better with caution. Every day this offensive doesn't visibly succeed is a day the men decide for themselves that it already failed.",
              },
              historical: false,
              setFlags: { offensiveChoice: "consolidate", offensiveOutcome: "consolidated" },
              impact: { frontDiscipline: 2, authority: -1 },
              next: "julyDays17",
              outcome:
                "The offensive halts on its own initial gains rather than reaching for more. It reads, within days, as an admission that the government's own showpiece attack didn't believe in itself past the second day -- which does less damage to the army in the field than the historical collapse, and considerably more to the government's standing with everyone hoping this offensive would prove the new order could still fight a war.",
            },
          ],
        };

      // -----------------------------------------------------------------
      case "julyDays17":
        return {
          date: "JULY 1917",
          title: "Petrograd: The Days the Machine Guns Came Out",
          bulletin: {
            headline:
              flags.offensiveOutcome === "routed"
                ? "THE FRONT'S COLLAPSE REACHES THE CAPITAL"
                : "THE OFFENSIVE'S NEWS REACHES THE CAPITAL BEFORE THE ARMY DOES",
            body:
              flags.offensiveOutcome === "routed"
                ? "Word of the rout at the front has beaten the wounded home, and the First Machine Gun Regiment -- under orders to reinforce a front it has no confidence in -- is the spark rather than a footnote. Armed soldiers, sailors from Kronstadt, and factory workers are in the streets demanding the Soviet itself take power outright, not merely negotiate with this Cabinet."
                : "Word that the offensive has stalled rather than broken through is enough on its own. Armed soldiers, sailors from Kronstadt, and factory workers are in the streets demanding the Soviet itself take power outright, not merely negotiate with this Cabinet.",
            meanwhile: {
              bolsheviks: "The Party's own Central Committee did not order this and is not fully in control of it -- Lenin is not even in the city when it starts. That will not be the story told about it afterward.",
              southRussia: "Does not exist yet as a command. The garrison units this Cabinet is deciding whether it can even still rely on are, for now, still the same imperial army the Volunteer Army's founders currently still serve in.",
              siberia: "Does not exist yet as a command. The Czechoslovak Legion is still an Allied unit in transit through Russian territory, over a year from the revolt that will make it a front.",
            },
          },
          historicalRecord: true,
          situation:
            "For four days the city has been armed and in the streets, and the rising has no single command giving it direction -- which makes it harder to negotiate with and, this Cabinet's staff believe, easier to break, if there are still loyal units left to do the breaking with." +
            (flags.aprilCrisisChoice === "standFirm"
              ? " The coalition that never formed in April is being felt now: there is no socialist minister in this room whose own presence might have kept the Soviet's moderate majority talking instead of watching the streets to see who wins."
              : ""),
          choices: [
            {
              label: "Bring in loyal front-line units to clear the streets, arrest the Bolshevik leadership reachable in the city, and shut down the Party's press -- but stop short of an outright ban on the party itself.",
              advisor: {
                name: "Tsereteli",
                quote: "Breaking the rising is not the same decision as outlawing every man who marched in it. One is restoring order the Soviet's own moderate majority already wants restored. The other makes martyrs of people this government may need to still be talking to in a month.",
              },
              historical: true,
              setFlags: { julyDaysChoice: "targetedCrackdown" },
              impact: { sovietRelations: 1, frontDiscipline: -1 },
              next: "kornilovAffair17",
              outcome:
                "Loyalist units restore order within days. Trotsky is arrested; Lenin, warned in time, goes into hiding and crosses into Finland within days, not returning to the city until October. The Bolshevik press is shut down for a matter of weeks, not permanently, and the party itself is never formally outlawed -- a targeted defeat, not an eradication.",
            },
            {
              label: "Use the moment to move against the Bolshevik party as an organization outright -- outlaw it, not merely its individual leaders, while the rising has discredited it in front of the Soviet's own moderate majority.",
              advisor: {
                name: "Kerensky",
                quote: "I understand the argument for restraint. I am less persuaded of it every week this party spends organizing against a government it has no intention of ever recognizing as legitimate.",
              },
              historical: false,
              gate: (m) => m.authority >= -3,
              disabledReason:
                "the Cabinet's own authority to make a decree like this actually stick is already too thin -- an outright ban announced by a government this weak reads as a threat it cannot enforce, not a real one.",
              setFlags: { julyDaysChoice: "outrightBan" },
              impact: { sovietRelations: -3, authority: 1 },
              next: "kornilovAffair17",
              outcome:
                "The ban is issued. It costs the Soviet Executive Committee's own patience more than it costs the Bolsheviks any real capacity -- a party used to operating illegally under the old regime does not stop existing because this government's decree says it should, and the moderate socialists whose cooperation this Cabinet needs for everything else now have their own reasons to wonder what 'temporary emergency measure' will be reached for next.",
            },
          ],
        };

      // -----------------------------------------------------------------
      case "kornilovAffair17":
        return {
          date: "AUGUST 1917",
          title: "Petrograd: The General's Trains",
          bulletin: {
            headline: "THE COMMANDER YOU APPOINTED IS MOVING ON THE CAPITAL",
            body:
              "Six weeks ago you made Kornilov Supreme Commander yourself, over the objections of the Soviet's own left, because the front needed someone the officer corps still believed in. What passed between you and him through the intermediary Lvov this past week -- an agreed plan to suppress a Bolshevik rising nobody has actually staged yet, or a coup you encouraged and are now publicly disowning -- is a question the two of you will spend the rest of your lives answering differently. What isn't in dispute: General Krymov's Third Cavalry Corps is moving on Petrograd by rail, and you have just publicly dismissed Kornilov and called it mutiny." +
              (flags.offensiveChoice === "pressForward"
                ? " Kornilov's own case for the appointment always ran through June -- that a War Minister who pressed the offensive forward understood, as he did, that an army without discipline stops being an army. He is, in effect, invoking your own June decision against you now."
                : " Kornilov never had much use for the June Offensive's caution, and says so to anyone who asks -- an army you preferred to consolidate rather than push, in his account, is exactly the kind of army you're now relying on to stop him."),
            meanwhile: {
              bolsheviks: "Not yet a command. Trotsky is in prison; Lenin is in Finland. Whether the Party's own moment is still to come depends more on how this crisis resolves than on anything the Central Committee decides on its own this month.",
              southRussia: "Does not exist yet as a command. Kornilov's own officers -- Denikin among them -- are watching this crisis from the front, and several will follow him into whatever comes next regardless of how it ends here.",
              siberia: "Does not exist yet as a command. Still over a year from the Czechoslovak Legion's revolt that will make Siberia a front at all.",
            },
          },
          historicalRecord: true,
          situation:
            "The garrison alone may not be enough to stop an advancing cavalry corps. The Soviet Executive Committee -- including the Bolsheviks you moved against three weeks ago -- is offering to arm every willing hand in the city, Red Guards included, to help stop it." +
            (flags.julyDaysChoice === "outrightBan"
              ? " The Executive Committee's offer comes anyway, which is either proof the Soviet's moderate majority separates this crisis from last month's ban on principle, or proof this Cabinet has nothing left to bargain with and the Soviet knows it."
              : ""),
          choices: [
            {
              label: "Accept the Soviet's offer. Arm everyone willing to fight, including the Bolshevik Red Guards, and worry about what that arming makes possible afterward.",
              advisor: {
                name: "Tsereteli",
                quote: "You are asking whether arming them is dangerous. It is. The alternative is finding out in person whether Krymov's corps stops itself, and I do not like that answer any better.",
              },
              historical: true,
              impact: {},
              next: "endingWinterPalaceFalls17",
              outcome:
                "Word is enough. Railway workers refuse to move Krymov's trains; soldiers' committees the general is counting on send delegations to negotiate instead of fighting. The advance dissolves without a real battle, over three days, and Kornilov is arrested at Mogilev. Nobody had to test whether the Red Guards you just armed would give the weapons back.",
            },
            {
              label: "Refuse the Soviet's Red Guards. Rely on whatever units still answer directly to this government, and try to negotiate Kornilov down instead.",
              advisor: {
                name: "Kerensky",
                quote: "I removed one general this month for exceeding his authority. I am not eager to arm the men most likely to decide, having stopped him, that they don't need to hand the rifles back to a government that only trusted them once.",
              },
              historical: false,
              gate: (m) => m.sovietRelations >= -6 && m.frontDiscipline >= -2,
              disabledReason:
                "there is no longer a loyal garrison left to rely on instead -- every choice that damaged relations with the Soviet also cost the units that were never going to fight for this government without the Soviet's own backing behind the order, and a front that's already come apart doesn't leave a garrison worth relying on regardless.",
              setFlags: { kornilovAffairChoice: "refusedRedGuards" },
              impact: { sovietRelations: -2, authority: 1 },
              outcome:
                "The order goes out to rely on the garrison alone. Whether that garrison actually holds against a cavalry corps this government has no independent way to stop is not something cabinet minutes get to decide.",
              uncertain: (() => {
                const holdsWeight = modWeight(35, meterPct(meters.frontDiscipline));
                return [
                  {
                    weight: holdsWeight,
                    title: "The garrison holds without them",
                    setFlags: { kornilovOutcome: "garrisonHeld" },
                    impact: { frontDiscipline: 1 },
                    next: "endingWinterPalaceFalls17",
                    outcome:
                      "It's close enough that staff afterward disagree about whether it was ever really in doubt, but the garrison and the same railway refusals that happened in the record are enough on their own. Kornilov is arrested. The Soviet notices, plainly, that it was asked to stand aside from its own defense of the capital -- and remembers it.",
                  },
                  {
                    weight: 100 - holdsWeight,
                    title: "Krymov's Cossacks reach the city",
                    setFlags: { kornilovOutcome: "cityFell" },
                    impact: { authority: -4 },
                    next: "endingKornilovsRepublic17",
                    outcome:
                      "The garrison that was supposed to hold does not, and there is no armed Soviet militia in reserve to make up the difference this time. Krymov's corps reaches central Petrograd inside the week.",
                  },
                ];
              })(),
            },
          ],
        };

      // -----------------------------------------------------------------
      // ENDING -- the historical terminus. Everything this text asserts as
      // fact is already load-bearing backstory in every other campaign in
      // this file; nothing here is new information, only the close-up view
      // of an event the other three treat as settled and offstage.
      // -----------------------------------------------------------------
      case "endingWinterPalaceFalls17":
        return {
          isEnding: true,
          title: "The Winter Palace Falls",
          date: "OCTOBER 1917",
          badge: "◆ HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "Whatever this Cabinet did differently through the summer, October does not move. The Kornilov Affair's real casualty was never the general's advance, which dissolved in three days without much of a fight -- it was the last plausible argument that this government still had the right's confidence and the left's cooperation at the same time. Arming the Soviet's Red Guards to stop Kornilov left several thousand rifles in Bolshevik-organized hands that were never collected back, and a Petrograd Soviet whose Bolshevik share of seats, negligible in April, is now a majority. On the night of 24-25 October the Military Revolutionary Committee -- a Soviet body, not this Cabinet's -- takes the telephone exchange, the State Bank, the bridges, and the Winter Palace itself by the early hours of the 26th, with barely a shot fired in its actual defense. Kerensky is already gone, driving south in a borrowed car to find loyal troops that mostly do not exist anymore.\n\nEverything the rest of this file's campaigns take as their own opening backstory starts here: the Council of People's Commissars formed that same week; the Constituent Assembly elected in November and dissolved by force in January when it returns a non-Bolshevik majority; Brest-Litovsk signed in March, ceding a quarter of the empire to end a war this government spent this whole campaign trying to keep fighting; and, within weeks of that peace, the civil war that the Armed Forces of South Russia, the Siberian government, and the Revolutionary Military Council fight through 1922. None of that changes no matter how well or badly this Cabinet is played. What changes is only how much warning the men who found the Volunteer Army in the Don that winter had, and how isolated a government it was that fell." +
            (flags.kornilovAffairChoice === "refusedRedGuards" && flags.kornilovOutcome === "garrisonHeld"
              ? "\n\nThe Soviet's Red Guards were never actually armed for this crisis, in this branch -- the garrison held on its own, on the same railway refusals that happened in the record. It changes remarkably little about October. The Bolsheviks' rifles come from elsewhere over the following two months regardless, and a Soviet Executive Committee that watched this Cabinet decline its help once, and survive anyway, extends noticeably less benefit of the doubt the second time its cooperation is asked for."
              : ""),
        };

      // -----------------------------------------------------------------
      // ENDING -- the one genuinely open counterfactual this campaign
      // carries. Reached only via the "refuse the Red Guards" branch AND an
      // unlucky roll (or via hard mode's Decree Capital running out).
      // Deliberately explicit that this is not a "better" outcome for
      // anyone in it, and that it erases the premise the other three
      // campaigns in this file are built on -- said outright, not implied.
      // -----------------------------------------------------------------
      case "endingKornilovsRepublic17":
        return {
          isEnding: true,
          title: "The General's Republic",
          date: "AUGUST 1917",
          badge: "◇ SPECULATIVE -- DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "Krymov's Third Cavalry Corps was perhaps fifteen thousand men against a capital of over two million -- the real historical margin was that thin, and it held on railway refusals and soldier committees that simply declined to fight, not on any garrison actually stopping the advance by force. Take the Soviet's Red Guards out of the defense and that thin margin does not hold. Krymov's Cossacks reach central Petrograd; Kornilov, following behind, is not arrested at Mogilev but is in the capital inside the week, and this Cabinet is not the government that survives the encounter.\n\nWhat forms afterward is not the historical dictatorship the word 'Bonapartist' was already being used to warn against that same month -- Kornilov's own program, so far as he ever stated one plainly, was closer to a military-backed government of national unity than personal rule, with the death penalty and labor conscription he'd wanted since taking command extended well past the front. Kerensky's own fate in this branch is unresolved by anything the record can settle: arrested alongside the rest of the Cabinet is the most likely outcome contemporaries would have expected, though nothing here should be read as claiming more certainty about that than the record actually supports.\n\nSay plainly what this branch means for the rest of this file: it does not happen. There is no Bolshevik seizure of power in October, because the Petrograd Soviet that would have staged it has just watched a military government take the capital by force with the left's own militia unable or unwilling to stop it. No Council of People's Commissars, no Brest-Litovsk, no Constituent Assembly dissolved by a Bolshevik decree instead of a Cossack one. Whatever civil war follows a Kornilov government's attempt to actually govern a country still fighting a war it cannot win is not the war the Armed Forces of South Russia, the Siberian government, or the Revolutionary Military Council in this file were built to fight -- it is a different war, against a different opponent, that this file does not contain. That is not a coy way of saying 'to be continued.' It means this branch's ending is genuinely the end of what this file can tell you about what happens next.",
        };

      default:
        return null;
    }
  },
};

export { modWeight, meterPct, applyImpact, clampTriangle, resolveNode };

// =============================================================================
// PREVIEW SCREENS
// =============================================================================
// Everything below this line is a standalone preview build, not your production
// screen components (I still don't have the real BriefingScreen/OutcomeScreen/
// EndScreen source — see the top-of-file note). This lets you review the actual
// content and the known-risk-odds mechanic wired end to end before you decide
// how much of this markup, if any, is worth carrying into the real App shell.
//
// Visual conventions matched from your 1941 screenshots: black top bar, cream
// card backgrounds, monospace uppercase labels, bold serif headlines, dashed-
// border hard-mode lock in demo builds, and a per-campaign cipher-block header
// in place of IGHQ's numeric groups — reskinned per campaign, not copied, per
// the note about the 甲/乙/丙 lettering not transferring.
//
// Odds are shown on the choice card itself, before selection — "known-risk
// gambling," per your instruction — not revealed only after the fact.

import React, { useState, useEffect } from "react";
import { resolveChoice, afterOutcome } from "./logic";

// Real Google Fonts, loaded once at the App root. This is a self-contained
// convenience for previewing the file as-is — in the real production build,
// move these @import lines (or equivalent <link> tags) into index.html /
// your CSS entry point instead, so they're preloaded rather than blocking on
// first paint inside the React tree.
function FontImports() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Archivo:wght@500;600;700&family=Oswald:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Playfair+Display:wght@700;900&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Courier+Prime&display=swap');
    `}</style>
  );
}

// Tailwind's text-* classes are rem-based, meaning they scale off the ROOT
// html element's font-size, not any wrapping div's — so the only way to make
// a "Text Size" setting genuinely rescale every text-xs/text-sm/text-2xl
// etc. across the whole app is to actually change the root font-size, not
// wrap things in a scaled container (which rem units would ignore).
const TEXT_SIZE_PX = { small: 14, normal: 16, large: 19 };
function TextScaleStyle({ textSize }) {
  return <style>{`html { font-size: ${TEXT_SIZE_PX[textSize] || 16}px; }`}</style>;
}

// SKINS are FIXED per campaign — not player-selectable. Every skin renders
// the same layout slots (TopBar -> meters -> header device -> date/title/
// badge -> situation -> choices), so the campaigns feel like one cohesive
// game despite looking different. Real named-hex palettes and real Google
// Fonts, not Tailwind's default color ramps and system font stacks — those
// produced the generic look that prompted this rewrite. Cohesion device:
// body text stays Source Serif 4 across all three skins — same voice,
// different accents — while display and mono faces differ per skin.
//
// Uses inline style={} for every custom color and font, NOT Tailwind
// arbitrary-value syntax (bg-[#hex], font-['Name']). First attempt used
// arbitrary values and it broke completely when actually previewed — this
// in-chat sandbox has no Tailwind JIT build step, so those classes silently
// generated zero CSS: black background bleeding through from a parent, text
// falling back to default link-blue, borders falling back to default gray.
// Inline styles need no build step and render identically here and in a
// real compiled app, so that's what every color/font token uses now.
const CAMPAIGN_SKINS = {
  southRussia: "elegy",
  siberia: "frontier",
  bolsheviks: "agitprop",
  provisionalGov17: "telegram",
};

const SKINS = {
  // ELEGY — South Russia / AFSR. Subject: Imperial-era chancery
  // correspondence, black-bordered mourning stationery (a real 19th/20th
  // century Russian convention), wax seals, ledger bookkeeping. "A mourning
  // border, not a battle flag."
  elegy: {
    name: "The Elegy",
    ground: "#241C14",
    paper: "#E8E1D3",
    paperDim: "#B8AA8E",
    ink: "#2B2016",
    inkMuted: "#6B5C47",
    accent: "#5C1A1A",
    accentLight: "#7A2E2E",
    dark: false,
    headerStyle: "seal",
    displayFont: "'Cormorant', serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  // FRONTIER — Siberia / Omsk. Subject: Trans-Siberian Railway telegraph
  // offices, verst distance markers, rail-tie rhythm, frost and cold steel
  // rather than warm chancery tones.
  frontier: {
    name: "The Frontier",
    ground: "#12181C",
    paper: "#DCE4E6",
    paperDim: "#9FB0B5",
    ink: "#0D1417",
    inkMuted: "#4A5C63",
    accent: "#2C5270",
    accentLight: "#3E6D8F",
    dark: false,
    headerStyle: "railmarker",
    displayFont: "'Archivo', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  // AGITPROP — Bolsheviks / Revvoensoviet. Subject: wartime-scarcity
  // lithograph printing — 2-3 ink colors, cheap paper, hand-cut lettering.
  // Signature device: a censor/priority stamp, not a decorative skew block.
  agitprop: {
    name: "The Agitprop",
    ground: "#1C1410",
    paper: "#D9C9A3",
    paperDim: "#B8A87D",
    ink: "#0F0B08",
    accent: "#B31E23",
    accentLight: "#7A1418",
    dark: true,
    headerStyle: "stamp",
    displayFont: "'Oswald', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  // TELEGRAM — Provisional Government / Petrograd 1917. Subject: the
  // telegraph office and the mass-printed political proclamation — the
  // first free press the empire ever had, run by a government that never
  // has quite enough authority to match it. Gold rather than blood-red or
  // mourning-maroon: gilt, provisional, and — deliberately — a shade that
  // reads as slightly hollow next to the other three skins' conviction.
  telegram: {
    name: "The Telegram",
    ground: "#1A2430",
    paper: "#EDE6D6",
    paperDim: "#B7AD98",
    ink: "#1D2530",
    inkMuted: "#5B6270",
    accent: "#8A6D1F",
    accentLight: "#A98A34",
    dark: false,
    headerStyle: "telegram",
    displayFont: "'Playfair Display', serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
};

// Body text stays 'Source Serif 4' across all three skins — same voice,
// different accents — that's the deliberate cohesion device. Display and
// mono faces differ per skin above.
const BODY_FONT = "'Source Serif 4', serif";

function skinFor(campaignId) {
  return SKINS[CAMPAIGN_SKINS[campaignId]];
}

// ============================================================================
// FRONT MAP — real geography (Round 22+). Was a hand-placed schematic
// through Round 21 (see the old comment this replaced, preserved in
// CIVILWAR_MAP_NOTES below FrontMapScreen along with the full account of
// what changed). Coordinates are now projected from each city's actual
// lat/long, and the backdrop is real coastline/lake data — not eyeballed.
// Every city below is a real place that appears in an actual written
// node's title or content; nothing here is decorative or invented to fill
// space on the map.
// Each city carries an explicit label anchor. Before this, every label
// rendered to the right at a fixed offset, which made the southern cluster
// (Perekop / Sevastopol / Novorossiysk / Ekaterinodar) and the Don cluster
// (Yuzovka / The Don / Tsaritsyn) overlap into an unreadable smear on a
// phone screen. Anchors are hand-placed to fan labels away from neighbours.
//   anchor: "e" | "w" | "n" | "s"  — which side of the marker the label sits
// Each place carries:
//   anchor — which side of the marker the label sits (see labelPos)
//   kind   — "city" | "region" | "fortification". Marker SHAPE follows this.
//            Two of these entries are not cities and must not be sized as
//            though they were: "The Don" is a Cossack host territory, not a
//            settlement, and Perekop is a fortified isthmus of a few thousand
//            people whose importance is entirely positional. Sizing either by
//            population would mean inventing a number or drawing them as
//            insignificant, and both would be wrong.
//   pop    — population in thousands, c.1914–1917, for cities only. Figures
//            are order-of-magnitude accurate rather than precise: wartime
//            Russian urban populations swung enormously with refugees,
//            garrisons, and evacuation, and no single census covers the
//            period cleanly. Marker AREA scales with population.
//   control — documented changes of hands, as [YYYYMM, side]. Read as
//            "from this month, this side held it." Sides: "red", "white",
//            "other" (German, Ukrainian, Allied, or Japanese-backed control
//            that is neither Red nor White in this game's sense), and
//            "contested" where control genuinely alternated faster than a
//            monthly resolution can express. Marker FILL follows this, at
//            the date of the situation currently in front of the player.
// Shared across all three campaigns — a single alphabetical list rather than
// per-campaign, since a confused player usually doesn't know which
// campaign's vocabulary a term even belongs to. Terms actually used
// elsewhere in this file; nothing added for completeness's own sake.
const GLOSSARY = [
  { term: "AFSR", definition: "Armed Forces of South Russia — the formal name of Denikin's, then Wrangel's, combined White command in the south from January 1919 onward. Encompasses the Volunteer Army, the Don Army, and Kuban/Terek Cossack formations under one nominal command." },
  { term: "Cheka", definition: "The Bolshevik security and secret police apparatus, founded December 1917, tasked with suppressing counter-revolution and enforcing Party authority. Predecessor to the OGPU, then NKVD." },
  { term: "Comintern", definition: "The Communist International, founded in Moscow in March 1919 — an organization explicitly committed to spreading revolution beyond Russia's own borders. Its founding is a major reason Allied support for the Whites hardened through 1919." },
  { term: "Directory", definition: "The Ufa Directory — a short-lived, broadly moderate coalition government formed in September 1918 to unite Siberia's anti-Bolshevik factions. Overthrown by Kolchak's coup in November 1918, the event that opens the siberia campaign." },
  { term: "Duma", definition: "Russia's elected legislature under the old imperial and Provisional Government systems, largely defunct by the period this game covers, but still the reference point every faction's own claim to legitimate authority is implicitly measured against." },
  { term: "Kombedy", definition: "Committees of Poor Peasants — Bolshevik village-level bodies established in mid-1918 to organize grain requisitioning and identify 'kulaks.' Dissolved and folded into regular local soviets by December 1918 after their conflict with existing village authority became unworkable." },
  { term: "NEP", definition: "The New Economic Policy, announced by Lenin at the Tenth Party Congress in March 1921 — the same month as Kronstadt — replacing forced grain requisitioning with a tax in kind and permitting limited private trade. A major, if late, course correction." },
  { term: "Politburo", definition: "The Bolshevik Party's small inner leadership body, formally established in 1919, where the Civil War's most consequential decisions were actually argued and made — distinct from the much larger, more ceremonial Council of People's Commissars (Sovnarkom)." },
  { term: "Prikaz", definition: "A formal military order or directive in Russian usage — the word appears throughout Red and White command communications alike, and simply means an order given the weight of a written command." },
  { term: "Rada", definition: "A council or assembly — used generically, but in this game specifically refers to the Kuban Rada, the elected body representing the Kuban Cossack Host, whose separatist ambitions and eventual violent suppression run through the southRussia campaign." },
  { term: "Revvoensoviet", definition: "The Revolutionary Military Council of the Republic — the Bolshevik government's central body for running the war effort, chaired by Trotsky. The seat commanded in the bolsheviks campaign." },
  { term: "Sivash", definition: "A shallow, wind-exposed lagoon separating the Crimean peninsula from the mainland east of Perekop — nicknamed the 'Rotten Sea.' Its unexpected fordability at low water was what let Frunze's forces turn the Perekop defenses from the flank in November 1920." },
  { term: "Sovnarkom", definition: "The Council of People's Commissars — the Bolshevik government's formal executive cabinet, chaired by Lenin. Larger and more public-facing than the Politburo, which held the real decision-making weight." },
  { term: "Stavka", definition: "General headquarters — the seat of supreme military command, a term inherited from the old Imperial Russian Army and used by multiple factions in this war for their own senior command structures." },
  { term: "Voenspetsy", definition: "Ex-Imperial Russian Army officers recruited into Red Army service as military specialists, over the strong objections of the 'Military Opposition' faction inside the Bolshevik Party who saw the practice as a betrayal of revolutionary principle." },
  { term: "White / Red", definition: "The two main sides of the war in shorthand — White for the loose, often mutually distrustful anti-Bolshevik coalition (monarchists, liberals, Cossack hosts, regional separatists), Red for the Bolshevik-led Soviet government and its Red Army. Neither side was ever as unified internally as the label suggests." },
];

// City coordinates below are real, not schematic: an equirectangular
// projection (standard parallel 53°N -- true scale along every meridian
// and along that parallel, the honest standard choice for a mid-latitude
// regional map) over verified real-world lat/long for every place named,
// looked up individually (Wikipedia infobox coordinates) rather than
// eyeballed. Scale is uniform: 1 unit ~= 7.0 km. See CIVILWAR_MAP_NOTES
// below FrontMapScreen for the full account of what changed and why.
const CITIES = {
  petrograd: { name: "Petrograd", x: 146.4, y: 64.5, anchor: "e", kind: "city", pop: 2400,
    control: [[191710, "red"]] },
  kronstadt: { name: "Kronstadt", x: 141.3, y: 63.6, anchor: "s", kind: "city", pop: 50,
    control: [[191710, "red"], [192103, "contested"], [192104, "red"]] },
  moscow: { name: "Moscow", x: 216.4, y: 131.0, anchor: "e", kind: "city", pop: 1800,
    control: [[191711, "red"]] },
  orel: { name: "Orel", x: 201.6, y: 175.3, anchor: "w", kind: "city", pop: 76,
    control: [[191711, "red"], [191910, "white"], [191911, "red"]] },
  voronezh: { name: "Voronezh", x: 231.7, y: 196.0, anchor: "w", kind: "city", pop: 94,
    control: [[191711, "red"], [191909, "white"], [191910, "red"]] },
  warsaw: { name: "Warsaw", x: 57.4, y: 187.1, anchor: "s", kind: "city", pop: 880,
    control: [[191811, "other"], [192008, "contested"], [192009, "other"]] },
  kharkov: { name: "Kharkov", x: 203.1, y: 222.7, anchor: "w", kind: "city", pop: 244,
    control: [[191804, "other"], [191901, "red"], [191906, "white"], [191912, "red"]] },
  // Added round 22, alongside the kievConvergence19 node -- verified via
  // Wikipedia infobox coordinates and the "1919 Kiev city census" (544,368)
  // and "Battle of Kiev (January 1919)" / "Capture of Kiev by the White
  // Army" / "Battle of Kiev (December 1919)" articles for the control dates.
  kiev: { name: "Kiev", x: 148.5, y: 215.4, anchor: "n", kind: "city", pop: 544,
    control: [[191812, "other"], [191902, "red"], [191908, "white"], [191912, "red"]] },
  yuzovka: { name: "Yuzovka (Donbas)", x: 218.2, y: 254.1, anchor: "n", kind: "city", pop: 70,
    control: [[191804, "contested"], [191912, "red"]] },
  don: { name: "The Don", x: 240.1, y: 263.6, anchor: "e", kind: "region",
    control: [[191805, "white"], [192001, "red"]] },
  saratov: { name: "Saratov", x: 297.0, y: 198.2, anchor: "e", kind: "city", pop: 240,
    control: [[191711, "red"]] },
  tsaritsyn: { name: "Tsaritsyn", x: 282.5, y: 243.1, anchor: "e", kind: "city", pop: 130,
    control: [[191711, "red"], [191906, "white"], [192001, "red"]] },
  ekaterinodar: { name: "Ekaterinodar", x: 229.3, y: 301.6, anchor: "e", kind: "city", pop: 100,
    control: [[191802, "red"], [191808, "white"], [192003, "red"]] },
  novorossiysk: { name: "Novorossiysk", x: 218.0, y: 306.6, anchor: "s", labelNudge: [35, 14], kind: "city", pop: 67,
    control: [[191808, "white"], [192003, "red"]] },
  perekop: { name: "Perekop", x: 178.8, y: 283.6, anchor: "w", kind: "fortification",
    control: [[191904, "white"], [192011, "red"]] },
  sevastopol: { name: "Sevastopol", x: 177.2, y: 308.4, anchor: "s", kind: "city", pop: 74,
    control: [[191812, "other"], [191904, "white"], [192011, "red"]] },
  ufa: { name: "Ufa", x: 391.9, y: 147.4, anchor: "n", kind: "city", pop: 100,
    control: [[191711, "red"], [191807, "white"], [191812, "red"], [191903, "white"], [191906, "red"]] },
  chelyabinsk: { name: "Chelyabinsk", x: 443.9, y: 140.6, anchor: "s", kind: "city", pop: 70,
    control: [[191805, "white"], [191907, "red"]] },
  omsk: { name: "Omsk", x: 558.7, y: 143.3, anchor: "n", kind: "city", pop: 130,
    control: [[191806, "white"], [191911, "red"]] },
  krasnoyarsk: { name: "Krasnoyarsk", x: 745.4, y: 127.0, anchor: "n", kind: "city", pop: 70,
    control: [[191806, "white"], [192001, "red"]] },
  irkutsk: { name: "Irkutsk", x: 854.6, y: 186.1, anchor: "n", kind: "city", pop: 90,
    control: [[191807, "white"], [192001, "contested"], [192003, "red"]] },
  chita: { name: "Chita", x: 942.6, y: 189.9, anchor: "n", kind: "city", pop: 70,
    control: [[191809, "other"], [192010, "red"]] },
};

// MAP_VIEWBOX matches the projection above: width 1000 (same order of
// magnitude as the old schematic map, so marker/stroke/font constants
// tuned for it stay sane), height derived from the real padded lat/long
// extent (Warsaw to Chita, Arctic fringe to the Caucasus coast).
const MAP_VIEWBOX = { w: 1000, h: 372 };

// Real coastline + major-lake water fill, clipped to the map's extent and
// projected the same way as the cities above -- Natural Earth 50m
// coastline/ocean/lakes data (fetched fresh; verified reachable), not
// hand-drawn. Filled with evenodd so each polygon's holes (islands in a
// bay, etc.) punch correctly from a single <path>.
const WATER_PATHS = [
  "M 353.6 272.0 L 354.2 271.8 L 354.9 272.8 L 355.4 273.0 L 357.4 272.0 L 358.1 270.9 L 358.7 270.4 L 360.6 271.0 L 362.9 271.0 L 364.0 272.0 L 364.3 272.6 L 365.3 275.5 L 364.4 277.5 L 364.3 278.6 L 364.7 279.6 L 365.0 283.1 L 364.1 286.7 L 362.6 289.7 L 361.5 293.0 L 362.1 294.2 L 364.5 295.6 L 365.6 296.8 L 364.4 297.2 L 362.8 297.0 L 359.2 295.8 L 358.2 295.7 L 354.6 295.9 L 351.6 295.7 L 349.7 296.6 L 348.5 296.4 L 347.4 298.4 L 346.9 300.2 L 346.0 301.5 L 344.9 302.4 L 344.6 303.3 L 344.7 304.4 L 345.1 305.1 L 346.6 306.7 L 347.5 308.2 L 348.7 308.4 L 349.3 308.8 L 349.7 309.6 L 348.1 309.4 L 346.2 310.0 L 345.0 309.6 L 343.2 308.0 L 338.9 308.1 L 337.8 308.8 L 337.5 309.6 L 337.4 311.5 L 337.6 312.4 L 338.1 312.8 L 341.5 313.8 L 342.9 314.9 L 344.0 318.7 L 345.2 322.0 L 345.9 323.6 L 346.8 324.7 L 347.4 326.2 L 347.5 328.3 L 347.4 331.1 L 350.4 331.4 L 351.2 332.3 L 352.6 335.3 L 353.1 336.0 L 353.7 336.3 L 354.8 335.8 L 355.9 336.0 L 356.7 337.1 L 358.8 336.8 L 359.4 337.0 L 359.8 337.7 L 360.2 341.0 L 360.0 343.0 L 358.5 348.2 L 358.6 351.6 L 358.8 353.3 L 359.9 357.3 L 361.3 359.9 L 362.3 362.5 L 362.4 362.4 L 362.1 360.3 L 362.6 355.3 L 361.9 354.4 L 362.8 351.5 L 363.4 350.2 L 365.3 348.3 L 366.4 348.5 L 369.7 347.7 L 370.9 347.8 L 371.8 348.4 L 374.2 357.5 L 375.0 358.9 L 378.9 362.6 L 379.7 363.8 L 380.1 365.5 L 380.1 367.5 L 379.5 368.0 L 378.5 368.4 L 376.8 367.8 L 376.3 368.4 L 376.9 370.6 L 376.0 370.6 L 375.1 370.2 L 372.0 371.3 L 371.0 371.0 L 369.6 368.6 L 368.7 368.4 L 367.7 369.0 L 366.9 369.2 L 365.1 368.5 L 364.3 367.5 L 363.1 365.1 L 362.2 370.7 L 361.9 372.0 L 332.3 372.0 L 329.8 368.9 L 327.6 365.3 L 326.4 360.9 L 323.7 355.7 L 322.2 353.2 L 319.5 350.6 L 318.0 346.9 L 316.6 344.2 L 314.1 340.1 L 313.2 339.0 L 313.0 336.9 L 312.3 335.4 L 311.3 334.4 L 310.7 333.4 L 311.2 330.4 L 310.9 327.8 L 311.1 325.8 L 312.4 319.8 L 311.6 320.6 L 310.7 325.1 L 310.4 321.5 L 309.7 318.1 L 309.2 316.4 L 308.4 314.9 L 306.5 312.5 L 305.4 311.8 L 303.9 311.3 L 303.6 310.8 L 303.4 310.0 L 303.5 309.1 L 303.9 307.6 L 305.8 305.6 L 306.3 304.1 L 307.0 305.0 L 307.3 303.6 L 308.4 301.7 L 309.6 298.6 L 310.0 297.4 L 310.2 295.4 L 310.9 294.9 L 311.2 294.3 L 311.3 292.5 L 310.7 291.3 L 310.8 291.2 L 312.3 292.8 L 312.5 291.7 L 313.0 291.2 L 314.2 291.6 L 317.3 290.4 L 318.3 289.7 L 320.5 287.2 L 321.5 287.2 L 322.4 288.0 L 322.8 287.8 L 323.0 287.5 L 322.6 286.6 L 322.4 284.8 L 323.6 284.6 L 326.2 283.2 L 326.6 281.7 L 327.7 281.6 L 327.4 280.1 L 328.1 279.2 L 328.9 279.7 L 328.7 277.9 L 333.9 276.7 L 335.0 276.1 L 337.9 273.5 L 339.0 272.2 L 340.5 272.2 L 343.8 269.6 L 346.2 268.5 L 347.3 268.7 L 350.4 269.8 L 351.7 271.3 L 353.6 272.0 Z M 315.1 293.2 L 315.5 294.6 L 315.7 293.3 L 315.3 291.8 L 315.0 292.3 L 315.1 293.2 Z M 359.8 295.3 L 360.5 295.7 L 360.6 295.5 L 360.7 294.8 L 360.4 293.9 L 359.9 293.7 L 359.4 294.6 L 359.8 295.3 Z M 337.8 300.9 L 337.4 301.7 L 337.6 302.8 L 338.1 302.1 L 338.3 300.8 L 337.8 300.9 Z M 336.0 300.8 L 335.2 301.4 L 334.9 303.1 L 335.9 304.8 L 336.4 304.9 L 336.7 304.4 L 335.9 304.0 L 335.3 302.9 L 335.4 301.9 L 336.1 301.2 L 336.0 300.8 Z",
  "M 30.2 72.5 L 30.7 72.7 L 31.3 72.4 L 34.1 70.4 L 35.5 68.9 L 37.9 67.3 L 38.1 66.2 L 37.5 64.4 L 36.1 62.2 L 34.4 61.6 L 33.7 61.1 L 34.0 59.5 L 32.4 58.1 L 31.0 57.7 L 30.2 57.0 L 28.7 55.3 L 28.2 54.1 L 25.4 55.0 L 24.7 53.5 L 24.4 53.3 L 22.5 53.3 L 21.4 52.3 L 21.7 50.6 L 21.0 48.3 L 21.1 47.8 L 20.6 43.2 L 21.0 42.6 L 20.7 41.9 L 20.4 41.5 L 20.6 40.3 L 20.3 38.4 L 21.1 37.1 L 20.9 36.1 L 22.2 36.6 L 23.5 36.7 L 23.0 35.8 L 22.6 33.8 L 23.9 29.0 L 24.4 28.3 L 25.1 28.0 L 24.2 27.5 L 23.1 26.3 L 22.6 24.9 L 22.7 24.3 L 23.0 23.6 L 24.5 24.5 L 25.2 24.5 L 25.9 23.7 L 27.0 23.7 L 28.1 22.5 L 29.0 22.1 L 27.7 21.2 L 28.4 20.2 L 27.6 18.5 L 27.5 17.8 L 27.7 17.6 L 28.1 18.4 L 29.5 18.4 L 29.3 19.1 L 30.2 19.1 L 31.0 18.2 L 33.0 17.4 L 33.4 15.9 L 31.6 15.8 L 31.9 15.3 L 33.7 14.8 L 34.4 12.9 L 36.8 12.5 L 36.8 12.2 L 36.2 12.0 L 36.4 11.7 L 38.5 12.0 L 40.4 10.2 L 40.9 8.9 L 41.6 8.2 L 42.9 9.0 L 43.0 7.7 L 44.5 8.5 L 45.1 8.4 L 45.7 7.2 L 46.9 6.0 L 49.7 5.2 L 51.3 4.3 L 52.1 3.5 L 54.2 2.6 L 55.1 2.0 L 56.0 0.0 L 80.5 0.0 L 78.9 1.5 L 76.6 2.7 L 74.1 4.9 L 72.0 5.5 L 72.0 6.5 L 70.7 7.9 L 70.0 7.7 L 69.9 8.2 L 70.2 8.7 L 69.5 8.5 L 69.2 8.8 L 69.9 10.3 L 70.0 10.8 L 68.1 11.9 L 65.9 12.4 L 65.0 12.0 L 62.6 12.5 L 62.8 14.0 L 63.6 15.1 L 61.9 15.2 L 61.7 16.6 L 59.2 19.1 L 58.5 20.7 L 58.3 21.8 L 58.9 25.1 L 60.4 26.2 L 60.6 27.3 L 60.7 28.1 L 59.8 31.8 L 61.0 33.0 L 62.6 36.4 L 63.1 38.2 L 63.0 38.5 L 62.1 38.8 L 62.7 39.9 L 62.2 39.9 L 62.3 41.0 L 62.2 43.1 L 61.9 44.9 L 61.0 46.6 L 60.8 48.1 L 61.2 51.3 L 61.3 53.4 L 61.5 54.0 L 63.2 55.0 L 64.3 54.2 L 65.0 54.0 L 65.5 55.4 L 66.3 55.5 L 69.4 57.1 L 72.5 57.4 L 71.8 59.0 L 71.9 59.3 L 72.5 59.4 L 72.6 59.9 L 72.3 60.2 L 71.4 60.3 L 71.1 61.0 L 71.4 61.1 L 71.1 62.0 L 71.3 63.0 L 73.1 63.0 L 74.1 62.6 L 74.7 61.9 L 75.2 60.1 L 75.6 60.1 L 76.4 61.9 L 77.2 62.7 L 78.4 63.1 L 78.3 63.9 L 76.1 66.2 L 76.7 66.4 L 78.2 66.0 L 80.9 63.7 L 83.4 64.0 L 89.3 62.8 L 90.3 63.1 L 91.0 62.7 L 91.8 61.7 L 97.1 60.4 L 98.2 59.5 L 100.0 59.3 L 101.9 58.2 L 102.5 59.2 L 102.9 59.2 L 104.7 58.0 L 105.5 58.1 L 105.6 57.6 L 104.8 55.9 L 105.5 55.9 L 107.2 57.0 L 108.8 56.7 L 109.6 56.1 L 109.9 54.7 L 110.7 53.5 L 111.0 53.5 L 110.2 56.0 L 110.3 56.9 L 112.1 56.2 L 114.3 56.0 L 115.5 55.1 L 116.7 54.8 L 119.2 56.1 L 119.8 55.7 L 121.2 55.5 L 122.1 55.0 L 126.1 54.4 L 129.3 52.7 L 130.6 53.8 L 130.3 55.7 L 129.1 54.9 L 129.3 55.8 L 130.5 57.5 L 132.1 58.2 L 134.6 60.4 L 137.5 60.7 L 139.4 60.3 L 140.8 60.4 L 142.3 61.6 L 143.3 63.1 L 145.1 64.2 L 145.0 65.0 L 144.7 65.5 L 140.3 64.2 L 135.3 63.5 L 134.7 64.1 L 133.4 66.2 L 131.5 66.6 L 130.1 66.4 L 129.3 65.9 L 128.7 66.4 L 128.4 67.7 L 127.6 68.4 L 126.4 67.9 L 125.6 66.9 L 124.9 67.0 L 124.5 67.9 L 125.0 70.6 L 124.4 71.9 L 123.3 72.8 L 118.0 72.2 L 114.5 72.2 L 113.4 71.9 L 111.2 70.6 L 109.6 70.6 L 103.2 69.3 L 100.5 69.2 L 100.6 70.5 L 99.9 71.1 L 94.5 71.1 L 91.6 72.1 L 89.7 71.9 L 87.7 73.4 L 86.6 73.5 L 86.9 74.7 L 84.0 75.0 L 81.2 76.3 L 81.4 77.7 L 81.0 78.9 L 81.4 79.4 L 80.6 80.7 L 81.3 82.7 L 83.0 82.8 L 82.7 83.3 L 81.6 83.9 L 81.4 84.8 L 81.9 86.1 L 83.1 87.3 L 83.2 88.4 L 83.8 89.6 L 87.2 91.1 L 88.3 90.7 L 89.3 89.2 L 89.8 89.2 L 91.1 89.7 L 91.3 90.5 L 90.7 91.1 L 90.5 93.6 L 89.2 96.7 L 88.9 98.7 L 89.5 100.9 L 89.9 106.0 L 89.7 107.2 L 88.7 108.5 L 85.4 111.1 L 82.7 111.7 L 79.2 109.8 L 77.8 106.1 L 73.1 101.7 L 72.2 99.7 L 66.4 101.7 L 64.3 102.1 L 61.7 106.1 L 61.4 107.5 L 61.2 109.1 L 60.7 110.9 L 59.8 112.3 L 58.0 114.0 L 57.6 117.0 L 57.5 123.0 L 57.8 126.7 L 57.9 130.1 L 59.6 135.8 L 59.3 137.6 L 59.6 138.7 L 59.1 144.1 L 57.3 144.6 L 56.3 144.5 L 53.5 143.3 L 56.0 140.1 L 57.6 137.4 L 58.3 135.3 L 58.4 133.2 L 57.5 136.6 L 55.9 139.3 L 54.3 141.4 L 52.7 143.1 L 51.6 143.8 L 48.8 143.7 L 47.5 144.3 L 47.2 147.0 L 46.4 148.8 L 45.4 150.3 L 43.5 152.0 L 42.1 152.8 L 38.0 153.4 L 36.6 153.1 L 35.0 152.1 L 34.2 150.8 L 32.8 147.1 L 33.4 147.1 L 36.3 148.9 L 35.9 148.0 L 31.7 145.6 L 29.4 145.6 L 27.1 145.9 L 21.5 147.3 L 17.9 149.4 L 14.8 150.1 L 11.3 154.3 L 8.5 154.9 L 0.0 157.6 L 0.0 142.8 L 0.7 142.7 L 1.2 141.6 L 1.2 140.7 L 0.0 139.9 L 0.0 124.4 L 3.0 124.7 L 5.9 124.2 L 7.8 125.1 L 9.4 123.6 L 10.9 119.1 L 11.5 117.7 L 12.8 115.8 L 14.5 110.1 L 14.1 108.2 L 14.0 107.0 L 15.5 104.4 L 15.7 103.2 L 15.3 102.2 L 15.1 101.0 L 15.1 99.1 L 14.8 98.3 L 15.2 96.7 L 16.1 96.6 L 16.2 92.7 L 16.8 91.9 L 15.7 88.4 L 18.3 87.5 L 17.0 86.0 L 14.0 85.5 L 13.2 85.7 L 11.5 85.2 L 12.5 84.7 L 18.8 84.9 L 20.0 84.0 L 22.4 82.9 L 23.4 81.6 L 25.5 80.7 L 26.4 79.9 L 27.0 80.1 L 29.6 78.4 L 31.3 77.7 L 32.2 76.5 L 32.6 74.8 L 33.4 74.7 L 34.5 74.2 L 34.0 73.1 L 33.5 72.9 L 32.4 73.5 L 31.2 73.6 L 30.6 74.1 L 29.9 74.4 L 28.4 74.2 L 28.3 73.7 L 30.2 72.5 Z M 17.9 111.4 L 19.6 107.9 L 19.5 106.7 L 20.2 106.1 L 19.3 105.7 L 19.0 106.2 L 17.7 109.8 L 16.4 112.8 L 15.5 113.2 L 13.4 118.1 L 13.2 119.4 L 13.3 122.2 L 13.6 123.2 L 14.0 123.3 L 14.5 122.5 L 16.9 114.3 L 17.5 113.7 L 17.9 111.4 Z M 30.0 112.5 L 31.0 112.3 L 31.9 111.6 L 32.3 109.8 L 33.2 108.6 L 35.3 107.3 L 35.7 106.1 L 36.1 105.5 L 37.3 104.9 L 36.2 103.5 L 36.4 100.0 L 37.7 99.4 L 38.1 98.3 L 38.9 97.9 L 37.2 96.6 L 36.7 96.9 L 36.3 98.0 L 35.5 97.5 L 33.8 98.0 L 32.5 99.2 L 29.9 102.4 L 29.8 104.1 L 30.1 105.8 L 29.6 106.9 L 30.6 109.1 L 31.3 109.9 L 30.6 111.0 L 30.0 112.5 Z M 39.5 97.5 L 39.7 96.5 L 41.4 95.9 L 39.5 95.6 L 38.6 96.7 L 39.0 97.4 L 39.5 97.5 Z M 66.9 96.4 L 67.6 96.3 L 68.4 95.8 L 69.1 94.5 L 69.5 92.7 L 70.5 91.8 L 71.7 91.5 L 73.9 91.6 L 74.2 91.1 L 76.3 89.5 L 76.8 89.4 L 77.7 88.4 L 79.6 88.1 L 79.3 87.6 L 76.1 85.7 L 74.8 85.4 L 73.5 85.8 L 72.1 85.3 L 70.0 86.1 L 69.5 87.2 L 68.5 87.1 L 67.7 87.7 L 66.9 87.2 L 65.6 87.4 L 66.8 89.1 L 66.2 90.3 L 65.5 90.5 L 65.8 91.1 L 68.7 92.8 L 66.8 95.4 L 66.7 95.9 L 66.9 96.4 Z M 77.1 85.6 L 79.0 86.7 L 79.8 86.5 L 79.9 86.1 L 79.7 85.0 L 78.1 84.5 L 77.5 84.8 L 77.1 85.6 Z M 74.3 82.2 L 75.0 82.9 L 75.8 82.1 L 76.6 82.0 L 76.3 80.7 L 75.6 79.5 L 73.9 79.2 L 73.6 78.2 L 73.1 78.0 L 72.5 78.1 L 71.7 79.0 L 71.3 79.8 L 67.4 80.3 L 68.5 81.0 L 69.9 81.1 L 70.8 81.6 L 71.5 83.3 L 71.4 84.0 L 72.1 84.3 L 73.2 84.0 L 74.3 82.2 Z M 33.3 77.7 L 32.4 78.0 L 32.0 79.0 L 32.6 78.9 L 33.3 77.7 Z M 34.6 71.6 L 35.3 71.0 L 35.3 70.9 L 34.6 70.7 L 34.1 71.0 L 33.8 71.8 L 34.1 72.4 L 34.6 71.6 Z M 53.6 62.8 L 53.2 62.4 L 52.5 62.3 L 51.6 62.8 L 52.4 63.0 L 52.8 63.3 L 53.5 63.2 L 53.6 62.8 Z M 48.1 62.0 L 48.2 60.6 L 48.5 60.4 L 49.6 60.4 L 50.2 59.3 L 48.6 57.9 L 47.2 57.8 L 46.7 57.0 L 46.1 57.3 L 45.7 57.9 L 46.5 58.7 L 46.3 60.0 L 45.7 60.1 L 45.6 58.9 L 44.8 59.2 L 44.6 59.8 L 45.3 61.9 L 45.8 62.2 L 48.1 62.0 Z M 44.2 60.8 L 44.6 60.9 L 44.2 59.6 L 43.5 59.6 L 43.2 60.5 L 43.3 61.2 L 43.7 61.3 L 44.2 60.8 Z M 66.2 58.2 L 66.9 58.1 L 66.0 57.2 L 66.4 57.1 L 66.0 56.5 L 65.3 56.0 L 65.2 56.3 L 65.4 56.9 L 65.0 57.1 L 65.2 57.4 L 66.2 58.2 Z M 68.1 57.8 L 67.6 58.9 L 68.7 59.7 L 68.9 60.4 L 69.4 60.8 L 70.4 60.9 L 70.2 60.3 L 69.8 59.8 L 69.9 59.2 L 70.9 58.7 L 70.3 57.8 L 69.8 58.0 L 68.6 57.6 L 68.1 57.8 Z M 65.6 60.3 L 64.7 60.3 L 64.1 60.7 L 64.0 61.7 L 64.4 61.8 L 65.3 61.2 L 65.6 60.3 Z M 62.8 60.7 L 62.2 61.1 L 62.0 61.5 L 62.5 61.9 L 63.3 61.8 L 63.5 61.2 L 63.4 60.8 L 62.8 60.7 Z M 60.2 55.9 L 61.5 55.8 L 61.7 55.1 L 60.2 54.0 L 59.9 53.3 L 59.5 53.6 L 59.4 53.9 L 59.7 55.1 L 60.2 55.9 Z M 60.8 12.5 L 61.3 12.6 L 61.4 11.9 L 60.8 11.6 L 59.5 12.2 L 59.4 11.9 L 59.6 11.3 L 58.1 11.3 L 58.8 12.6 L 59.8 13.3 L 60.3 13.2 L 60.8 12.5 Z",
  "M 28.2 371.2 L 23.6 368.3 L 21.7 366.1 L 20.0 364.7 L 14.8 362.0 L 9.6 358.8 L 8.5 357.6 L 8.6 355.9 L 10.9 353.7 L 11.3 352.8 L 11.0 351.5 L 9.1 350.8 L 3.8 351.2 L 1.5 350.9 L 0.0 349.9 L 0.0 317.7 L 1.2 319.5 L 1.8 319.5 L 0.0 316.9 L 0.0 311.3 L 1.5 313.1 L 2.2 312.4 L 0.0 309.6 L 0.0 308.8 L 2.5 311.9 L 4.4 313.7 L 2.6 313.4 L 1.1 313.9 L 1.7 315.3 L 4.7 319.5 L 8.9 323.5 L 8.9 324.9 L 9.3 325.6 L 10.7 325.9 L 13.2 325.3 L 15.2 326.5 L 18.1 327.7 L 20.3 330.6 L 22.2 332.1 L 26.0 336.3 L 21.1 333.5 L 19.5 333.7 L 21.5 334.4 L 24.6 336.5 L 26.9 337.1 L 30.2 339.7 L 33.6 342.9 L 34.8 342.8 L 34.5 343.5 L 34.7 343.8 L 37.2 345.9 L 39.4 348.9 L 40.0 350.6 L 41.5 351.9 L 42.7 352.1 L 43.7 353.2 L 43.7 355.5 L 42.9 356.8 L 42.4 359.0 L 42.8 362.0 L 42.6 364.0 L 42.6 366.8 L 41.4 371.1 L 41.6 372.0 L 28.6 372.0 L 28.2 371.2 Z M 23.2 337.1 L 22.3 337.2 L 26.2 338.7 L 24.9 337.6 L 23.2 337.1 Z M 18.8 335.1 L 20.8 335.2 L 19.9 334.5 L 18.8 334.2 L 17.5 334.4 L 15.7 334.0 L 15.8 334.6 L 16.5 335.3 L 17.6 335.6 L 18.8 335.1 Z M 14.5 330.3 L 13.1 330.5 L 14.7 331.6 L 16.0 332.0 L 20.9 331.9 L 16.1 331.1 L 15.7 330.5 L 14.5 330.3 Z M 13.8 327.8 L 13.5 328.9 L 14.2 329.4 L 17.0 329.6 L 18.0 328.9 L 17.5 328.3 L 13.8 327.8 Z M 2.3 317.6 L 2.1 317.0 L 0.5 315.5 L 1.1 316.5 L 2.3 317.6 Z M 4.1 319.6 L 3.4 318.4 L 2.5 317.8 L 3.5 319.4 L 4.1 319.6 Z",
  "M 84.2 372.0 L 83.6 370.9 L 83.8 369.7 L 85.5 369.7 L 86.8 370.1 L 88.3 369.1 L 89.7 367.1 L 90.6 366.6 L 91.4 366.8 L 92.6 367.8 L 93.6 368.0 L 95.7 366.2 L 96.6 365.8 L 98.0 366.8 L 98.7 366.6 L 100.4 367.5 L 103.8 368.2 L 105.3 369.4 L 106.2 371.9 L 112.8 371.7 L 112.6 372.0 L 93.1 372.0 L 93.5 371.8 L 93.6 370.4 L 93.5 370.0 L 92.9 369.1 L 92.0 369.0 L 91.0 370.7 L 91.0 371.3 L 91.8 372.0 L 84.2 372.0 Z",
  "M 117.2 370.7 L 118.9 368.3 L 119.6 366.2 L 121.9 365.5 L 123.6 365.9 L 126.0 364.4 L 127.2 364.6 L 131.8 366.1 L 133.5 365.6 L 133.9 364.8 L 134.5 362.1 L 133.4 361.8 L 127.7 358.3 L 126.2 356.9 L 124.8 354.1 L 124.2 352.1 L 124.5 350.3 L 124.2 349.1 L 121.6 344.3 L 120.9 343.4 L 119.4 342.4 L 122.0 338.6 L 123.3 337.9 L 123.4 333.6 L 123.7 331.0 L 124.7 329.6 L 125.6 327.6 L 127.4 327.1 L 128.8 327.7 L 129.7 325.9 L 130.0 321.2 L 130.7 318.3 L 130.5 313.3 L 131.0 312.1 L 132.5 310.0 L 132.9 308.9 L 132.1 309.0 L 132.1 308.4 L 132.5 307.9 L 132.5 306.6 L 133.2 305.1 L 132.9 303.4 L 133.3 302.6 L 133.7 302.2 L 134.8 302.5 L 134.4 303.3 L 134.7 305.3 L 134.4 306.0 L 139.3 304.6 L 140.0 302.4 L 140.9 296.6 L 140.3 293.5 L 139.7 292.6 L 139.7 291.2 L 139.9 290.6 L 140.5 290.1 L 141.8 290.5 L 145.6 288.3 L 148.4 284.5 L 149.8 282.0 L 150.4 280.4 L 151.1 277.4 L 154.4 276.3 L 156.1 276.4 L 156.9 276.2 L 157.8 274.4 L 158.5 273.8 L 158.2 275.6 L 160.5 276.1 L 161.4 275.9 L 161.7 274.7 L 161.8 271.5 L 160.3 266.9 L 161.1 267.8 L 162.1 270.6 L 162.3 272.6 L 162.1 273.7 L 162.4 274.9 L 163.1 276.0 L 163.9 276.7 L 166.0 277.2 L 168.2 276.4 L 166.1 278.6 L 163.9 278.1 L 161.5 277.9 L 159.9 277.4 L 158.4 277.4 L 159.9 278.7 L 162.7 279.4 L 162.8 280.0 L 162.6 280.4 L 160.5 281.0 L 161.0 281.7 L 161.9 281.6 L 163.0 282.0 L 167.2 284.9 L 170.3 284.1 L 171.7 284.2 L 174.2 283.4 L 174.7 284.2 L 176.3 285.3 L 177.9 284.7 L 178.6 287.0 L 176.7 288.8 L 174.9 289.9 L 173.6 290.2 L 170.6 292.7 L 167.5 295.7 L 167.9 296.5 L 168.5 296.9 L 170.0 296.4 L 171.4 296.6 L 174.0 299.0 L 174.7 299.4 L 176.0 299.1 L 177.5 300.5 L 178.1 303.6 L 177.3 307.2 L 176.6 308.5 L 176.5 309.2 L 178.5 311.1 L 179.4 311.7 L 180.9 311.8 L 182.5 311.3 L 184.5 309.4 L 186.3 306.5 L 188.7 305.2 L 190.3 304.9 L 192.2 305.2 L 192.8 303.7 L 194.8 302.4 L 195.9 300.5 L 196.8 300.2 L 197.8 300.5 L 199.7 302.0 L 201.5 301.6 L 203.1 301.7 L 204.7 301.1 L 205.3 298.4 L 206.4 295.8 L 203.7 294.8 L 202.6 294.9 L 201.7 295.4 L 201.1 296.2 L 199.3 295.7 L 198.6 295.9 L 196.7 297.2 L 195.7 297.1 L 194.9 296.5 L 193.9 295.0 L 191.6 290.9 L 190.0 286.4 L 189.9 283.2 L 192.0 281.9 L 193.6 279.2 L 194.2 280.3 L 194.0 281.7 L 191.5 284.5 L 192.6 284.2 L 193.3 283.5 L 193.8 282.9 L 195.2 280.1 L 199.3 276.3 L 201.2 275.6 L 202.8 275.9 L 203.6 275.7 L 205.1 274.5 L 206.3 274.1 L 207.5 274.0 L 208.5 274.8 L 209.9 273.1 L 211.0 272.3 L 212.6 271.6 L 213.8 271.6 L 215.7 269.1 L 218.4 268.8 L 221.8 269.0 L 224.7 267.5 L 225.6 266.5 L 227.4 266.1 L 225.4 267.9 L 226.5 268.0 L 229.0 267.5 L 229.9 266.0 L 231.5 266.0 L 232.5 268.6 L 232.2 269.6 L 230.9 269.9 L 227.8 271.8 L 224.3 273.3 L 224.8 274.5 L 224.9 275.6 L 222.3 275.0 L 219.8 276.4 L 217.8 276.1 L 218.3 277.7 L 219.3 279.7 L 219.9 280.1 L 220.8 279.9 L 223.1 282.3 L 224.8 284.8 L 221.8 284.7 L 220.8 287.2 L 220.8 285.9 L 220.2 285.4 L 219.4 286.2 L 218.6 289.4 L 216.9 291.7 L 216.4 293.1 L 216.3 294.2 L 216.9 294.3 L 217.0 295.3 L 216.7 296.1 L 213.0 297.2 L 212.6 297.8 L 211.5 297.3 L 210.3 296.0 L 209.2 295.3 L 207.8 296.2 L 209.9 297.5 L 209.3 298.1 L 206.9 299.1 L 206.9 299.7 L 207.2 300.1 L 210.0 301.0 L 212.5 302.5 L 213.2 303.6 L 213.9 305.5 L 214.4 306.3 L 215.2 306.9 L 217.3 307.5 L 218.7 306.9 L 221.8 311.3 L 223.1 312.0 L 226.2 312.9 L 226.9 313.4 L 232.8 319.6 L 234.6 322.3 L 238.0 326.4 L 241.1 328.9 L 243.7 331.6 L 247.2 332.9 L 249.4 335.0 L 250.0 336.6 L 252.8 338.1 L 253.5 339.3 L 255.2 347.5 L 256.1 350.3 L 256.1 352.7 L 255.5 354.5 L 252.8 359.0 L 248.4 362.4 L 247.1 362.7 L 245.8 364.0 L 241.8 366.3 L 240.5 366.6 L 239.2 366.1 L 238.4 366.3 L 237.4 366.0 L 233.7 364.0 L 228.2 365.4 L 225.4 366.7 L 223.7 366.9 L 219.2 365.7 L 217.8 364.5 L 214.6 363.9 L 211.1 362.8 L 210.4 361.3 L 208.4 359.9 L 207.1 360.1 L 205.8 361.6 L 204.8 361.4 L 203.6 360.4 L 202.7 358.9 L 201.4 354.9 L 200.2 354.4 L 196.7 355.6 L 194.2 354.1 L 192.5 351.6 L 192.5 350.5 L 192.8 349.4 L 191.4 348.8 L 189.0 350.5 L 183.6 350.4 L 175.9 349.5 L 174.9 349.7 L 171.7 351.5 L 167.8 352.9 L 165.6 354.1 L 163.5 356.4 L 157.5 360.6 L 156.4 363.2 L 155.5 364.0 L 151.2 364.4 L 146.8 362.6 L 142.7 363.3 L 137.0 362.1 L 135.3 362.2 L 134.8 362.9 L 134.4 365.6 L 135.0 366.7 L 136.4 368.2 L 137.4 368.8 L 142.1 369.5 L 142.0 369.9 L 134.4 371.3 L 133.1 372.0 L 115.4 372.0 L 117.2 370.7 Z M 159.2 281.9 L 157.9 280.3 L 158.5 282.1 L 159.8 282.8 L 164.1 283.7 L 162.8 282.9 L 159.2 281.9 Z",
  "M 219.8 0.7 L 216.6 1.5 L 214.7 2.8 L 210.3 1.3 L 205.1 0.0 L 220.3 0.0 L 219.8 0.7 Z",
  "M 142.2 43.8 L 142.1 43.3 L 142.5 42.9 L 144.3 43.7 L 144.4 42.8 L 145.3 42.4 L 145.2 41.6 L 145.9 40.3 L 145.8 39.4 L 148.0 39.8 L 148.4 39.2 L 149.3 39.0 L 149.2 37.9 L 150.7 35.9 L 151.7 35.2 L 153.3 36.2 L 154.0 37.7 L 155.3 37.3 L 156.0 38.0 L 156.6 37.6 L 157.7 38.8 L 158.8 40.9 L 159.2 40.2 L 161.7 42.4 L 167.7 45.7 L 168.3 47.6 L 170.0 49.4 L 170.7 52.2 L 171.3 52.5 L 171.7 53.3 L 170.5 55.8 L 169.6 55.2 L 168.4 55.0 L 169.1 57.2 L 168.3 57.8 L 168.5 59.6 L 168.2 60.2 L 166.1 61.1 L 165.1 61.0 L 164.5 60.4 L 163.2 59.9 L 161.1 59.5 L 159.8 59.7 L 158.8 60.8 L 158.9 61.4 L 158.2 62.9 L 158.5 64.0 L 157.9 64.8 L 154.1 64.6 L 153.5 64.3 L 154.5 63.4 L 154.0 62.2 L 154.1 61.2 L 153.2 60.4 L 152.7 59.3 L 151.6 56.4 L 150.9 56.4 L 150.9 55.7 L 150.4 54.5 L 148.6 53.5 L 148.3 52.3 L 148.6 51.3 L 148.5 50.6 L 148.3 50.1 L 146.3 47.5 L 142.1 44.6 L 141.8 44.1 L 142.2 43.8 Z",
  "M 908.0 135.9 L 907.4 137.8 L 907.0 140.1 L 907.1 142.4 L 906.0 146.1 L 905.6 148.2 L 905.0 148.9 L 904.8 150.0 L 904.5 152.9 L 904.5 154.8 L 905.1 156.2 L 904.9 157.1 L 904.6 158.0 L 901.8 161.7 L 901.7 164.0 L 901.5 164.7 L 900.1 164.7 L 899.9 164.2 L 900.4 161.6 L 899.7 161.0 L 899.3 161.1 L 898.2 162.0 L 895.3 166.7 L 898.3 165.5 L 899.0 165.8 L 899.7 167.7 L 899.6 168.6 L 899.1 169.4 L 897.6 170.4 L 896.6 170.0 L 894.0 172.2 L 893.1 173.1 L 893.4 174.2 L 893.0 175.0 L 890.3 177.4 L 889.7 178.3 L 888.0 179.4 L 886.2 179.6 L 884.3 180.4 L 881.6 182.1 L 880.1 183.2 L 878.8 185.5 L 878.3 185.7 L 875.8 184.7 L 874.1 185.6 L 873.7 186.3 L 873.5 187.1 L 873.8 188.1 L 872.9 191.4 L 870.8 194.3 L 869.1 195.5 L 860.6 198.3 L 859.8 198.9 L 858.2 199.0 L 853.4 198.1 L 850.2 196.6 L 849.2 195.6 L 849.9 195.0 L 853.2 194.4 L 857.1 194.2 L 858.3 193.8 L 858.8 193.1 L 859.7 192.8 L 863.1 192.2 L 867.0 189.0 L 869.7 184.6 L 871.6 182.6 L 875.4 180.3 L 878.3 176.9 L 879.7 174.8 L 879.4 174.4 L 878.5 174.5 L 879.2 173.2 L 881.3 171.0 L 885.8 167.9 L 885.9 166.9 L 886.7 165.1 L 890.8 161.3 L 892.4 159.3 L 893.7 156.2 L 894.7 154.5 L 895.9 151.1 L 897.7 148.2 L 898.3 146.2 L 899.1 144.6 L 899.3 144.1 L 899.0 143.8 L 900.3 142.6 L 901.4 139.9 L 901.8 136.6 L 901.6 134.5 L 902.1 133.9 L 905.3 130.7 L 907.1 130.7 L 907.9 131.0 L 908.9 132.3 L 908.0 133.9 L 908.0 135.9 Z M 888.3 168.6 L 887.8 168.5 L 886.2 170.3 L 880.6 173.1 L 880.3 173.6 L 880.3 174.5 L 884.8 173.2 L 886.8 171.3 L 888.0 170.6 L 888.3 168.6 Z",
  "M 205.0 41.6 L 204.5 43.3 L 204.7 44.3 L 204.4 45.0 L 201.9 46.6 L 199.8 48.4 L 200.1 49.1 L 199.5 49.6 L 196.6 48.6 L 195.2 46.9 L 192.6 47.5 L 192.3 46.9 L 190.8 46.5 L 189.9 47.2 L 189.5 46.4 L 189.4 45.6 L 189.8 44.5 L 190.3 44.3 L 192.9 44.5 L 193.6 44.9 L 192.1 45.2 L 191.9 45.3 L 192.0 45.6 L 192.7 46.3 L 195.6 46.6 L 196.4 47.2 L 196.9 47.0 L 197.4 45.9 L 197.4 45.2 L 196.9 43.7 L 195.7 41.9 L 192.8 39.9 L 187.8 37.2 L 185.5 34.9 L 184.8 33.8 L 186.9 34.7 L 187.4 34.1 L 187.4 32.7 L 186.9 31.7 L 184.2 29.0 L 184.2 27.5 L 183.4 26.3 L 181.6 25.2 L 181.3 23.7 L 181.8 23.5 L 182.3 23.8 L 184.9 27.5 L 185.1 28.5 L 186.7 29.8 L 187.9 30.2 L 188.0 29.9 L 187.8 28.8 L 188.1 27.8 L 187.6 26.3 L 188.3 26.3 L 188.4 25.9 L 186.8 23.1 L 187.1 23.1 L 189.8 26.7 L 190.3 28.7 L 191.6 30.4 L 192.5 30.8 L 193.0 30.1 L 191.8 28.0 L 194.6 29.3 L 195.1 29.2 L 196.7 27.9 L 196.8 27.1 L 196.5 26.0 L 194.7 23.4 L 192.8 22.8 L 190.8 21.4 L 189.8 22.3 L 188.9 21.8 L 187.7 20.3 L 186.4 17.8 L 186.5 17.3 L 186.9 17.1 L 188.5 18.2 L 190.5 18.7 L 195.8 22.1 L 196.2 21.7 L 198.4 23.4 L 199.0 24.3 L 199.2 26.1 L 198.4 29.5 L 197.8 30.4 L 198.0 31.0 L 199.2 32.4 L 199.7 34.0 L 200.8 35.6 L 201.5 37.2 L 203.3 39.7 L 204.8 41.0 L 205.0 41.6 Z M 194.7 31.7 L 194.3 30.5 L 193.8 30.4 L 193.2 31.9 L 192.9 33.9 L 193.3 34.2 L 194.0 33.7 L 194.7 31.7 Z",
  "M 226.8 93.5 L 223.7 93.4 L 223.5 93.7 L 224.3 95.0 L 222.8 94.4 L 222.5 93.7 L 222.5 92.1 L 222.2 91.5 L 219.5 90.5 L 219.1 90.7 L 214.5 85.5 L 212.0 84.2 L 212.0 81.8 L 213.5 83.2 L 214.6 83.7 L 214.4 84.6 L 215.7 85.6 L 215.9 86.5 L 216.8 86.4 L 216.6 85.2 L 220.8 86.7 L 221.0 85.2 L 220.0 84.6 L 219.6 83.8 L 219.7 83.5 L 220.3 83.4 L 220.0 81.6 L 219.3 81.6 L 218.4 80.8 L 217.3 80.5 L 216.1 81.0 L 215.3 81.9 L 215.0 81.4 L 215.1 80.6 L 217.0 79.0 L 217.2 78.4 L 216.7 76.9 L 220.0 76.6 L 220.3 77.4 L 221.6 77.8 L 221.8 77.3 L 221.3 76.2 L 221.5 76.1 L 222.9 76.8 L 224.1 76.6 L 223.3 77.9 L 222.4 78.4 L 219.2 77.8 L 218.7 78.2 L 221.2 80.1 L 227.3 86.6 L 229.6 87.4 L 229.7 87.7 L 229.4 88.3 L 229.7 89.6 L 228.4 90.0 L 228.0 90.6 L 227.9 91.3 L 227.9 93.2 L 227.8 93.4 L 226.7 92.0 L 226.2 91.8 L 226.0 92.1 L 226.8 93.5 Z",
  "M 605.8 340.8 L 604.5 341.1 L 601.8 343.0 L 601.6 344.0 L 600.3 346.0 L 598.4 346.9 L 594.8 347.1 L 592.7 346.8 L 589.4 345.2 L 586.4 344.6 L 585.9 342.9 L 586.0 342.5 L 588.2 342.0 L 593.1 340.1 L 596.7 339.2 L 598.6 339.5 L 600.0 338.7 L 603.6 338.3 L 605.4 338.1 L 604.2 339.6 L 604.3 340.2 L 605.9 340.5 L 605.8 340.8 Z",
  "M 664.5 256.7 L 663.9 258.6 L 663.3 259.2 L 662.8 259.0 L 656.9 254.2 L 653.4 252.9 L 651.1 251.0 L 651.3 250.4 L 655.1 250.1 L 655.6 249.5 L 656.0 248.4 L 654.6 246.4 L 654.6 245.6 L 654.9 244.9 L 654.9 242.6 L 655.4 240.7 L 656.5 239.1 L 658.0 237.8 L 660.8 236.7 L 661.6 235.9 L 661.4 234.7 L 659.0 231.8 L 657.2 231.4 L 656.0 230.0 L 655.0 229.3 L 654.4 228.2 L 656.7 228.8 L 658.0 228.4 L 659.4 227.0 L 660.1 226.9 L 660.1 227.3 L 658.7 228.4 L 657.9 230.0 L 663.2 234.7 L 663.9 235.9 L 663.6 236.5 L 656.7 239.9 L 655.8 241.4 L 655.5 242.9 L 656.8 247.4 L 659.7 248.1 L 659.6 248.4 L 657.4 248.8 L 656.6 249.6 L 656.5 250.1 L 661.0 253.0 L 663.7 254.0 L 664.9 254.9 L 665.4 255.5 L 664.5 256.7 Z",
  "M 821.2 200.3 L 820.2 206.9 L 818.5 209.7 L 818.1 210.8 L 817.9 212.1 L 818.2 213.0 L 817.2 214.0 L 815.5 214.7 L 815.4 214.1 L 816.0 210.7 L 816.5 204.9 L 816.4 202.7 L 817.5 200.4 L 817.3 199.2 L 819.0 196.9 L 821.2 200.3 Z",
  "M 739.3 216.0 L 740.4 215.0 L 745.6 212.1 L 746.3 212.4 L 746.5 212.9 L 746.4 214.0 L 747.3 215.8 L 749.1 216.9 L 749.1 217.4 L 750.1 218.1 L 747.5 219.4 L 745.8 221.7 L 742.8 222.5 L 740.7 220.3 L 740.1 217.8 L 739.3 216.0 Z",
  "M 409.8 354.6 L 408.5 355.6 L 405.3 356.6 L 403.6 354.0 L 402.6 354.2 L 402.9 350.3 L 403.7 346.9 L 404.6 345.0 L 405.7 344.5 L 407.2 345.7 L 408.0 347.4 L 407.8 348.2 L 408.5 349.7 L 408.7 351.2 L 410.1 352.4 L 410.3 353.4 L 409.8 354.6 Z",
  "M 119.5 92.4 L 118.8 90.5 L 117.0 88.1 L 116.3 85.0 L 114.5 82.5 L 114.5 81.2 L 115.8 80.1 L 117.6 79.5 L 119.8 79.3 L 121.3 79.7 L 121.9 80.8 L 122.6 87.6 L 122.4 88.2 L 120.4 90.4 L 120.2 91.9 L 119.5 92.4 Z",
  "M 415.1 300.0 L 415.5 297.5 L 416.8 295.6 L 417.0 293.6 L 417.7 292.7 L 417.8 290.6 L 418.4 288.8 L 419.6 288.8 L 419.3 288.1 L 419.7 287.5 L 421.7 287.9 L 421.9 287.1 L 422.8 287.4 L 423.4 286.3 L 424.0 286.2 L 423.5 287.9 L 422.1 287.8 L 420.3 289.5 L 419.9 292.6 L 418.9 293.1 L 418.0 294.8 L 417.6 297.9 L 418.1 300.0 L 416.8 302.0 L 417.2 302.3 L 417.0 303.4 L 417.5 305.0 L 416.9 305.7 L 416.6 309.0 L 416.2 310.0 L 415.0 311.2 L 414.0 311.1 L 413.8 310.7 L 413.8 309.7 L 414.6 308.4 L 413.7 304.5 L 414.5 301.1 L 415.1 300.0 Z",
  "M 437.9 284.3 L 438.6 283.0 L 437.6 280.2 L 436.2 281.5 L 434.0 279.8 L 432.0 280.5 L 430.6 279.2 L 430.7 277.1 L 433.4 275.1 L 434.2 276.4 L 434.6 278.2 L 435.1 276.3 L 436.3 277.2 L 437.8 276.2 L 437.8 275.8 L 435.7 274.2 L 435.7 273.8 L 436.3 273.7 L 438.5 274.3 L 438.1 276.9 L 439.2 278.7 L 441.6 279.0 L 442.8 278.2 L 442.2 277.0 L 443.1 276.5 L 443.3 275.9 L 445.3 275.4 L 443.0 279.1 L 443.1 280.1 L 442.3 282.4 L 440.0 283.5 L 439.0 284.8 L 438.2 284.8 L 437.9 284.3 Z",
  "M 612.5 274.3 L 613.1 273.3 L 613.8 273.5 L 614.7 274.7 L 614.9 275.9 L 614.7 276.5 L 613.5 276.9 L 612.8 279.1 L 611.5 280.3 L 609.8 279.9 L 609.0 280.1 L 608.2 279.8 L 607.5 279.9 L 607.2 280.2 L 607.4 281.2 L 607.3 281.5 L 606.1 280.6 L 604.6 281.1 L 603.7 281.0 L 601.7 279.4 L 599.7 279.6 L 597.6 278.2 L 596.8 278.2 L 596.1 278.7 L 595.0 278.4 L 594.4 279.0 L 592.0 278.4 L 591.0 277.7 L 586.2 277.4 L 584.2 278.1 L 582.6 277.7 L 580.2 278.1 L 579.0 276.7 L 579.0 276.2 L 579.7 275.9 L 579.6 275.5 L 578.7 275.5 L 578.2 276.5 L 578.6 278.3 L 578.2 278.7 L 577.7 278.7 L 577.2 277.9 L 577.0 278.0 L 576.3 279.4 L 575.2 278.9 L 574.4 279.6 L 573.4 279.8 L 572.1 284.5 L 570.0 286.1 L 568.3 285.9 L 567.4 286.1 L 567.1 287.1 L 567.6 289.5 L 567.1 290.1 L 567.7 291.4 L 565.7 293.6 L 565.6 294.0 L 565.5 296.5 L 566.2 297.1 L 566.2 297.8 L 566.1 300.5 L 566.0 301.0 L 565.7 301.2 L 565.9 302.1 L 565.7 302.3 L 564.9 301.9 L 564.7 299.1 L 563.2 297.9 L 561.5 295.2 L 561.0 293.9 L 559.3 292.4 L 559.4 291.6 L 560.2 290.4 L 559.4 289.3 L 559.8 288.9 L 560.5 289.1 L 562.2 286.0 L 561.5 285.2 L 561.3 283.8 L 561.7 283.3 L 562.6 282.9 L 563.1 283.2 L 563.7 282.9 L 564.6 283.2 L 564.9 282.9 L 565.0 282.7 L 564.2 281.6 L 564.9 280.3 L 565.6 279.4 L 567.4 278.7 L 568.3 278.0 L 568.8 277.0 L 569.7 276.3 L 570.0 275.2 L 570.7 274.2 L 573.7 273.2 L 575.1 273.2 L 576.2 274.1 L 577.5 274.6 L 582.2 273.2 L 585.8 273.8 L 586.7 274.2 L 588.2 276.0 L 590.3 275.5 L 591.5 276.2 L 594.2 276.3 L 595.1 277.3 L 595.6 277.2 L 596.0 276.5 L 599.6 275.8 L 601.7 275.9 L 604.3 276.7 L 605.9 278.7 L 606.3 278.0 L 606.5 276.3 L 606.8 275.7 L 607.2 275.8 L 607.3 276.4 L 607.6 276.3 L 608.6 274.7 L 609.1 274.3 L 610.3 274.7 L 610.9 273.5 L 611.9 273.7 L 612.5 274.3 Z",
  "M 195.2 298.0 L 192.0 296.1 L 191.7 295.3 L 192.1 294.2 L 191.4 292.1 L 189.1 290.3 L 188.9 289.6 L 188.0 288.8 L 186.5 289.6 L 187.7 287.5 L 187.6 287.1 L 187.2 286.9 L 186.8 287.7 L 186.2 287.5 L 185.5 288.0 L 185.3 286.2 L 183.6 285.7 L 183.6 286.9 L 183.4 287.1 L 183.0 285.8 L 182.5 285.2 L 181.8 285.0 L 181.1 285.6 L 180.7 285.2 L 180.2 283.9 L 179.6 284.1 L 179.0 283.3 L 179.0 282.8 L 180.3 282.5 L 182.8 283.9 L 182.8 283.3 L 183.4 283.0 L 183.3 281.9 L 183.5 282.0 L 184.6 283.3 L 187.0 283.6 L 187.0 284.4 L 186.3 284.6 L 185.9 285.8 L 186.4 286.5 L 187.4 285.9 L 188.2 283.4 L 188.6 283.6 L 189.0 284.4 L 188.7 284.8 L 188.6 285.4 L 189.3 285.8 L 189.8 288.7 L 190.5 289.5 L 193.1 294.6 L 195.6 297.7 L 195.2 298.0 Z",
  "M 138.9 29.7 L 138.4 30.4 L 138.6 30.9 L 139.2 31.6 L 139.8 31.9 L 140.5 31.6 L 141.2 32.5 L 141.4 33.4 L 140.9 33.7 L 140.9 34.1 L 138.0 35.9 L 136.5 37.8 L 135.0 38.0 L 134.9 38.4 L 131.3 36.9 L 130.4 37.4 L 130.2 37.8 L 131.6 37.9 L 131.9 38.2 L 130.9 38.7 L 131.0 39.9 L 129.9 40.1 L 129.8 40.6 L 127.7 42.0 L 127.8 42.3 L 128.9 42.3 L 130.7 41.7 L 131.2 42.0 L 132.6 43.6 L 131.9 44.3 L 127.1 46.3 L 123.8 46.5 L 123.3 45.8 L 123.2 45.1 L 124.0 44.6 L 126.2 45.0 L 125.0 43.9 L 123.0 43.6 L 120.8 44.2 L 119.7 43.9 L 118.7 43.4 L 118.9 42.9 L 118.3 42.4 L 117.4 42.4 L 117.3 41.6 L 117.7 40.7 L 117.4 40.1 L 117.6 39.9 L 117.4 37.2 L 117.9 36.6 L 118.2 39.1 L 119.2 39.2 L 119.4 37.7 L 119.7 38.4 L 120.5 38.3 L 122.0 37.1 L 122.2 36.7 L 120.7 35.4 L 120.6 35.2 L 120.8 34.8 L 123.1 36.5 L 124.9 39.5 L 125.6 38.8 L 126.1 38.9 L 126.6 37.7 L 126.9 35.7 L 128.6 35.4 L 129.5 34.2 L 132.1 34.4 L 132.4 33.8 L 131.4 33.4 L 129.9 31.8 L 128.2 30.6 L 123.6 29.5 L 123.4 29.2 L 123.2 26.4 L 122.4 24.8 L 120.0 25.1 L 118.8 23.8 L 117.6 24.1 L 116.5 22.9 L 116.3 22.5 L 118.0 23.4 L 118.6 22.5 L 120.5 23.8 L 121.2 23.5 L 120.6 22.1 L 120.7 20.4 L 121.2 19.6 L 121.0 18.7 L 121.3 17.2 L 121.0 17.0 L 120.4 17.4 L 120.1 18.1 L 119.5 17.9 L 118.7 17.3 L 117.9 15.7 L 116.5 14.4 L 116.8 13.8 L 116.6 11.2 L 117.1 10.9 L 117.1 10.5 L 116.1 7.9 L 115.4 7.4 L 115.0 7.8 L 114.4 7.4 L 113.8 6.5 L 116.5 7.5 L 117.0 8.5 L 117.0 9.0 L 116.8 9.1 L 118.2 10.7 L 118.0 12.4 L 117.3 13.4 L 119.0 15.4 L 120.1 15.7 L 120.6 15.5 L 122.1 16.6 L 122.2 15.8 L 121.8 14.8 L 122.1 14.2 L 122.9 14.6 L 122.9 15.3 L 123.3 15.5 L 124.4 15.1 L 125.4 15.6 L 127.7 15.1 L 125.8 16.8 L 126.1 18.0 L 125.7 18.5 L 125.8 18.9 L 126.9 20.7 L 126.9 21.1 L 130.6 23.3 L 132.9 25.5 L 132.1 25.6 L 130.7 25.0 L 129.1 23.7 L 129.8 23.7 L 129.7 23.4 L 127.9 22.3 L 127.0 22.7 L 126.0 24.8 L 125.3 24.6 L 125.7 23.1 L 124.9 20.7 L 124.2 20.0 L 122.9 20.2 L 122.1 20.9 L 122.0 21.3 L 122.4 21.7 L 122.0 22.4 L 122.9 23.3 L 123.5 24.8 L 124.7 25.2 L 124.8 25.6 L 124.0 26.9 L 124.1 27.6 L 127.0 27.6 L 127.0 27.3 L 127.4 27.1 L 128.2 27.9 L 129.8 28.1 L 130.2 27.2 L 131.0 26.4 L 130.7 25.5 L 131.7 26.1 L 132.7 27.9 L 132.4 28.7 L 131.9 28.8 L 132.3 29.5 L 135.8 28.9 L 137.1 29.0 L 137.3 28.2 L 136.8 27.3 L 136.5 25.4 L 136.8 24.9 L 136.8 24.1 L 136.4 22.9 L 136.6 22.1 L 137.1 22.1 L 137.4 23.2 L 138.0 23.4 L 139.9 25.0 L 140.1 24.9 L 139.6 23.7 L 140.0 22.2 L 140.6 22.0 L 141.3 22.5 L 142.8 24.8 L 141.9 25.5 L 141.3 26.7 L 140.1 26.7 L 139.7 27.4 L 140.1 28.1 L 143.1 29.1 L 143.3 29.6 L 142.6 29.8 L 140.7 29.3 L 139.7 29.4 L 138.9 29.7 Z M 122.8 17.2 L 123.3 18.4 L 125.0 19.8 L 125.4 19.7 L 124.9 16.1 L 123.4 16.2 L 122.9 16.5 L 122.8 17.2 Z M 121.3 42.6 L 120.8 41.5 L 118.8 40.6 L 117.9 41.2 L 120.4 43.3 L 120.9 43.2 L 121.3 42.6 Z M 124.0 39.6 L 123.8 39.2 L 123.0 39.3 L 121.8 38.9 L 121.5 39.8 L 119.7 39.9 L 122.0 41.2 L 123.5 40.5 L 124.0 39.6 Z M 128.6 39.4 L 129.1 38.0 L 129.5 37.7 L 129.3 36.5 L 128.9 36.1 L 127.5 36.0 L 127.0 36.3 L 127.3 38.3 L 126.7 39.0 L 126.8 39.7 L 126.5 40.5 L 126.6 41.3 L 129.1 40.5 L 129.1 40.0 L 128.6 39.4 Z M 138.2 31.1 L 137.0 29.6 L 134.1 29.7 L 131.1 30.4 L 131.0 31.1 L 131.2 31.8 L 132.3 32.3 L 133.4 33.7 L 133.8 34.8 L 135.2 35.2 L 136.4 34.7 L 136.9 33.7 L 137.2 32.1 L 138.5 32.5 L 138.2 31.1 Z",
  "M 664.5 256.7 L 663.9 258.6 L 663.3 259.2 L 662.8 259.0 L 656.9 254.2 L 653.4 252.9 L 651.1 251.0 L 651.3 250.4 L 655.1 250.1 L 655.6 249.5 L 656.0 248.4 L 654.6 246.4 L 654.6 245.6 L 654.9 244.9 L 654.9 242.6 L 655.4 240.7 L 656.5 239.1 L 658.0 237.8 L 660.8 236.7 L 661.6 235.9 L 661.4 234.7 L 659.0 231.8 L 657.2 231.4 L 656.0 230.0 L 655.0 229.3 L 654.4 228.2 L 656.7 228.8 L 658.0 228.4 L 659.4 227.0 L 660.1 226.9 L 660.1 227.3 L 658.7 228.4 L 657.9 230.0 L 663.2 234.7 L 663.9 235.9 L 663.6 236.5 L 656.7 239.9 L 655.8 241.4 L 655.5 242.9 L 656.8 247.4 L 659.7 248.1 L 659.6 248.4 L 657.4 248.8 L 656.6 249.6 L 656.5 250.1 L 661.0 253.0 L 663.7 254.0 L 664.9 254.9 L 665.4 255.5 L 664.5 256.7 Z",
  "M 114.1 18.0 L 115.7 18.3 L 114.9 18.4 L 115.0 18.9 L 113.6 19.0 L 114.6 20.8 L 114.3 21.3 L 114.8 21.9 L 113.8 21.7 L 113.0 22.7 L 113.3 23.8 L 114.1 24.0 L 113.9 24.4 L 112.2 23.8 L 111.8 22.2 L 111.5 22.4 L 111.6 22.9 L 110.8 25.1 L 109.3 25.8 L 109.2 26.6 L 108.8 26.2 L 109.1 25.0 L 110.1 24.9 L 110.1 24.5 L 110.5 23.9 L 110.2 23.1 L 108.9 22.7 L 107.8 22.9 L 107.5 23.4 L 107.5 24.0 L 108.2 25.8 L 107.9 26.3 L 106.9 26.0 L 106.4 26.4 L 106.4 27.2 L 105.7 26.1 L 105.1 25.7 L 104.8 26.0 L 105.2 27.3 L 104.7 28.3 L 104.7 29.4 L 104.0 28.4 L 103.5 29.3 L 103.5 30.5 L 104.0 31.3 L 103.2 31.8 L 103.0 32.2 L 101.8 32.5 L 101.7 33.0 L 102.3 33.5 L 101.5 34.2 L 101.3 35.0 L 101.6 35.3 L 102.5 34.6 L 102.1 36.3 L 102.4 38.0 L 101.2 38.2 L 101.1 39.7 L 101.8 40.2 L 100.8 40.8 L 100.9 42.2 L 101.2 42.7 L 105.0 43.5 L 106.0 44.5 L 106.3 44.2 L 106.2 43.7 L 106.8 42.6 L 107.8 41.6 L 107.5 42.5 L 107.7 43.6 L 106.9 43.3 L 106.6 43.5 L 107.1 44.8 L 107.0 45.2 L 107.5 46.0 L 106.1 48.2 L 105.4 48.2 L 105.9 47.5 L 106.2 46.0 L 105.5 44.9 L 104.8 44.6 L 104.0 44.9 L 102.0 43.2 L 101.6 43.4 L 101.9 44.3 L 100.7 45.7 L 101.4 46.7 L 101.3 47.2 L 100.9 47.2 L 100.2 46.2 L 99.5 46.6 L 99.0 46.4 L 100.0 45.1 L 100.4 43.9 L 100.1 43.1 L 99.5 43.6 L 99.0 42.6 L 98.2 42.0 L 97.5 40.0 L 97.4 39.1 L 98.2 38.5 L 99.4 38.3 L 99.6 37.6 L 99.5 36.9 L 97.8 35.5 L 97.6 35.0 L 98.6 35.2 L 99.3 35.0 L 99.9 34.1 L 98.6 33.6 L 98.7 33.2 L 100.5 32.8 L 100.8 31.8 L 101.6 31.6 L 102.1 30.7 L 101.2 30.1 L 100.4 29.9 L 100.1 29.4 L 102.0 29.5 L 102.5 29.1 L 102.7 28.2 L 104.1 27.0 L 104.5 25.5 L 104.2 24.7 L 103.7 24.8 L 102.9 23.2 L 102.2 23.0 L 101.7 21.7 L 103.1 21.3 L 103.2 20.5 L 103.5 20.1 L 104.2 20.2 L 104.1 19.6 L 103.5 19.0 L 103.8 18.5 L 103.9 17.8 L 104.6 17.2 L 103.6 15.5 L 101.5 14.6 L 100.8 15.3 L 100.6 16.3 L 99.8 16.2 L 99.1 15.7 L 99.9 14.9 L 99.8 13.7 L 101.6 12.3 L 101.6 12.9 L 102.1 13.6 L 103.2 14.3 L 103.6 13.7 L 104.3 14.0 L 106.0 15.9 L 105.3 15.9 L 105.3 16.2 L 108.7 19.5 L 108.8 20.1 L 108.1 20.1 L 106.2 18.5 L 105.8 18.6 L 105.3 20.4 L 105.0 20.4 L 105.5 21.6 L 104.4 21.4 L 103.5 21.9 L 103.6 23.2 L 104.6 24.3 L 105.4 24.1 L 105.7 23.4 L 106.1 23.4 L 106.2 23.9 L 105.9 24.5 L 106.0 25.0 L 106.7 25.5 L 107.0 24.3 L 106.9 22.9 L 108.5 22.0 L 108.6 21.6 L 109.5 21.6 L 109.7 20.5 L 108.6 18.5 L 108.6 18.1 L 110.6 20.4 L 112.7 22.0 L 113.0 21.8 L 113.1 20.6 L 110.6 17.4 L 112.2 18.4 L 112.3 17.9 L 112.0 16.9 L 112.2 16.4 L 114.7 15.3 L 115.1 15.5 L 114.6 15.8 L 114.1 16.7 L 114.3 17.1 L 113.8 17.1 L 113.7 17.4 L 114.1 18.0 Z",
  "M 319.5 156.3 L 319.8 149.4 L 321.1 148.6 L 322.9 148.2 L 323.6 147.3 L 324.1 145.1 L 324.0 142.8 L 326.9 140.4 L 327.0 138.4 L 325.8 136.0 L 326.0 135.3 L 326.5 135.5 L 327.6 137.6 L 328.3 137.9 L 328.8 137.6 L 328.5 137.0 L 328.5 134.8 L 328.9 134.4 L 328.9 135.6 L 329.7 136.6 L 332.9 136.9 L 335.0 136.4 L 335.8 135.7 L 338.6 136.2 L 339.6 135.7 L 341.4 135.9 L 347.0 134.7 L 348.5 135.2 L 349.0 134.9 L 349.0 133.6 L 348.3 132.1 L 348.5 130.7 L 349.1 129.8 L 348.9 131.9 L 349.5 133.0 L 350.6 132.7 L 351.8 131.6 L 353.5 131.9 L 353.0 132.4 L 351.7 132.3 L 351.4 133.6 L 349.8 134.1 L 349.6 135.0 L 348.5 136.0 L 346.5 135.2 L 346.2 135.6 L 346.6 136.7 L 346.3 137.3 L 345.2 136.4 L 343.4 135.8 L 342.0 136.5 L 333.9 138.4 L 332.0 140.0 L 329.8 141.2 L 329.7 142.2 L 329.2 142.8 L 327.5 142.7 L 325.5 143.5 L 324.8 144.6 L 325.1 145.8 L 326.3 146.2 L 325.3 147.4 L 325.1 148.7 L 324.4 149.7 L 324.5 150.2 L 324.1 151.0 L 324.1 151.6 L 321.9 152.0 L 320.9 152.7 L 320.6 153.6 L 321.1 155.1 L 322.1 156.2 L 323.5 156.8 L 323.9 158.2 L 325.6 158.7 L 328.0 157.8 L 332.4 155.3 L 332.5 155.9 L 330.5 156.9 L 329.6 158.3 L 327.5 160.0 L 327.5 160.9 L 328.7 162.6 L 328.9 163.8 L 326.6 161.7 L 326.3 162.2 L 326.0 165.2 L 326.2 166.3 L 327.8 166.9 L 333.8 167.1 L 334.1 167.6 L 333.5 168.1 L 330.1 167.9 L 328.4 168.4 L 327.9 169.2 L 327.6 170.3 L 323.5 170.4 L 323.1 169.7 L 326.7 169.9 L 327.4 169.5 L 327.4 169.0 L 325.3 167.8 L 325.5 167.5 L 324.1 164.5 L 324.5 161.7 L 323.6 159.9 L 321.2 157.4 L 319.5 156.3 Z",
  "M 849.3 165.3 L 849.5 167.0 L 849.3 167.1 L 848.2 166.1 L 847.0 165.9 L 846.6 166.6 L 846.4 167.3 L 846.6 171.3 L 845.9 173.1 L 845.6 171.2 L 845.6 165.7 L 845.0 164.1 L 841.1 162.3 L 841.7 161.8 L 843.5 162.5 L 844.4 162.0 L 842.4 157.9 L 842.2 156.5 L 842.5 154.4 L 843.4 152.3 L 844.0 152.2 L 844.4 151.2 L 844.1 149.0 L 842.7 146.5 L 843.0 144.3 L 844.5 142.3 L 845.1 140.5 L 845.0 138.2 L 844.1 135.3 L 843.7 132.1 L 843.1 130.5 L 842.3 129.4 L 841.6 126.1 L 839.6 124.8 L 837.9 124.6 L 837.0 125.7 L 835.0 125.5 L 834.5 126.0 L 832.6 126.7 L 832.8 127.7 L 832.6 128.7 L 831.9 129.8 L 831.9 130.6 L 832.7 131.4 L 833.6 131.6 L 833.7 132.0 L 833.3 132.5 L 833.8 133.0 L 836.0 133.6 L 836.5 134.4 L 835.8 136.6 L 836.1 137.9 L 836.9 138.5 L 836.1 139.3 L 835.0 141.4 L 833.9 142.2 L 835.9 138.7 L 835.3 136.5 L 835.7 135.1 L 835.7 134.6 L 833.5 135.8 L 830.8 136.4 L 830.5 135.6 L 832.6 134.7 L 832.5 134.1 L 830.9 132.6 L 830.7 130.7 L 830.3 130.2 L 826.3 128.0 L 825.8 127.4 L 830.0 127.5 L 830.2 126.0 L 829.6 125.0 L 830.0 124.3 L 830.0 122.9 L 830.6 122.6 L 830.9 122.5 L 831.5 123.4 L 832.4 123.5 L 832.0 124.5 L 832.3 125.1 L 835.2 123.5 L 835.3 123.1 L 837.2 123.1 L 837.3 122.2 L 837.8 121.6 L 838.4 121.8 L 838.8 123.1 L 840.4 122.9 L 841.1 123.9 L 842.6 123.7 L 842.5 126.4 L 843.0 128.4 L 844.7 131.7 L 844.5 134.1 L 845.6 137.3 L 845.8 139.5 L 845.3 142.7 L 844.1 145.0 L 843.8 146.2 L 845.0 149.7 L 845.1 151.3 L 845.7 153.8 L 846.8 156.4 L 846.2 156.2 L 845.4 154.1 L 844.9 153.5 L 843.7 155.1 L 843.3 156.6 L 843.9 158.9 L 845.2 160.9 L 845.5 162.5 L 846.5 164.0 L 847.5 164.7 L 849.3 165.3 Z",
  "M 919.4 23.0 L 920.8 20.4 L 920.5 19.9 L 920.5 19.1 L 920.3 18.2 L 917.4 17.2 L 915.6 16.0 L 913.5 15.9 L 913.5 15.0 L 914.1 14.2 L 914.0 13.6 L 910.4 13.0 L 909.7 12.5 L 912.2 12.3 L 913.0 11.9 L 913.1 10.2 L 910.9 8.8 L 909.4 8.9 L 907.9 9.7 L 905.4 8.5 L 908.4 8.5 L 910.3 5.8 L 910.7 5.9 L 910.8 6.2 L 910.4 6.6 L 910.6 7.2 L 911.7 8.0 L 914.0 8.5 L 915.2 9.6 L 913.9 11.8 L 914.6 12.6 L 915.8 12.6 L 916.5 12.0 L 918.2 12.9 L 918.4 13.2 L 917.8 13.8 L 916.3 14.3 L 916.3 14.8 L 918.4 15.8 L 919.8 14.3 L 919.3 10.8 L 919.9 9.2 L 920.3 9.0 L 920.6 10.1 L 920.3 12.3 L 920.5 13.0 L 921.6 13.9 L 923.5 13.7 L 924.3 13.1 L 924.5 12.3 L 924.1 11.2 L 925.6 11.2 L 927.6 12.3 L 928.4 14.2 L 926.9 15.7 L 926.9 16.4 L 928.5 17.3 L 929.7 17.1 L 930.0 16.2 L 929.6 15.5 L 929.7 13.7 L 929.0 10.8 L 926.8 9.7 L 927.7 9.2 L 929.3 9.3 L 929.7 8.9 L 930.2 9.0 L 929.8 9.7 L 929.9 11.8 L 930.8 13.8 L 932.7 14.6 L 933.1 15.4 L 932.3 15.8 L 932.0 18.3 L 930.2 19.5 L 927.0 17.8 L 925.9 18.2 L 925.6 17.9 L 924.5 18.0 L 923.6 17.8 L 922.8 17.1 L 922.8 16.7 L 925.0 16.2 L 925.2 15.1 L 926.4 14.6 L 927.0 13.8 L 927.0 13.2 L 926.5 12.6 L 925.7 12.8 L 925.1 13.5 L 924.6 14.5 L 923.9 15.0 L 920.9 15.7 L 920.8 16.7 L 922.2 18.2 L 923.0 21.3 L 922.0 22.9 L 922.4 24.2 L 921.8 24.4 L 921.7 24.8 L 922.1 25.3 L 924.7 25.5 L 925.3 26.4 L 925.3 26.7 L 923.8 26.1 L 922.7 26.5 L 922.5 27.2 L 924.7 28.3 L 924.2 28.7 L 922.3 28.1 L 921.7 28.6 L 921.8 29.6 L 922.8 30.8 L 921.3 31.8 L 919.4 31.8 L 913.4 30.2 L 912.3 29.5 L 910.9 29.7 L 909.5 30.4 L 906.2 33.1 L 905.6 35.1 L 905.2 34.9 L 905.1 33.3 L 905.9 31.6 L 905.8 30.8 L 906.6 31.1 L 907.6 30.8 L 910.8 28.4 L 913.5 28.6 L 915.2 29.6 L 919.8 30.9 L 920.4 29.9 L 920.1 28.2 L 920.9 27.6 L 921.3 26.8 L 920.9 24.8 L 920.2 24.0 L 919.1 23.6 L 917.7 24.2 L 916.9 23.3 L 919.4 23.0 Z"
];

// Bare land silhouette (the water polygon's complement within the map's
// bounding box), painted first so unclaimed/unknown territory still reads
// as land rather than page background.
const LAND_PATH = "M 1000.0 0.0 L 1000.0 372.0 L 361.9 372.0 L 362.2 370.7 L 363.1 365.1 L 364.3 367.5 L 365.1 368.5 L 366.9 369.2 L 367.7 369.0 L 368.7 368.4 L 369.6 368.6 L 371.0 371.0 L 372.0 371.3 L 375.1 370.2 L 376.0 370.6 L 376.9 370.6 L 376.5 369.5 L 376.3 368.4 L 376.8 367.8 L 378.5 368.4 L 379.5 368.0 L 380.1 367.5 L 380.1 365.5 L 379.7 363.8 L 378.9 362.6 L 376.0 359.9 L 375.0 358.9 L 374.2 357.5 L 371.8 348.4 L 370.9 347.8 L 369.7 347.7 L 366.4 348.5 L 365.3 348.3 L 363.4 350.2 L 362.8 351.5 L 361.9 354.4 L 362.6 355.3 L 362.1 360.3 L 362.4 362.4 L 362.3 362.5 L 361.3 359.9 L 359.9 357.3 L 358.8 353.3 L 358.6 351.6 L 358.5 348.2 L 360.0 343.0 L 360.2 341.0 L 359.8 337.7 L 359.4 337.0 L 358.8 336.8 L 357.2 336.8 L 356.7 337.1 L 355.9 336.0 L 354.8 335.8 L 353.7 336.3 L 353.1 336.0 L 352.6 335.3 L 351.2 332.3 L 350.4 331.4 L 347.4 331.1 L 347.5 328.3 L 347.4 326.2 L 346.8 324.7 L 345.9 323.6 L 345.2 322.0 L 344.0 318.7 L 342.9 314.9 L 342.5 314.4 L 341.5 313.8 L 338.1 312.8 L 337.6 312.4 L 337.4 311.5 L 337.5 309.6 L 337.8 308.8 L 338.9 308.1 L 343.2 308.0 L 345.0 309.6 L 346.2 310.0 L 348.1 309.4 L 349.7 309.6 L 349.3 308.8 L 348.7 308.4 L 348.0 308.5 L 347.5 308.2 L 346.6 306.7 L 345.1 305.1 L 344.7 304.4 L 344.6 303.3 L 344.9 302.4 L 346.0 301.5 L 346.9 300.2 L 347.4 298.4 L 348.5 296.4 L 349.7 296.6 L 351.6 295.7 L 354.6 295.9 L 358.2 295.7 L 359.2 295.8 L 362.8 297.0 L 364.4 297.2 L 365.6 296.8 L 364.5 295.6 L 362.1 294.2 L 361.5 293.0 L 362.6 289.7 L 364.1 286.7 L 365.0 283.1 L 364.7 279.6 L 364.3 278.6 L 364.4 277.5 L 365.3 275.5 L 364.3 272.6 L 364.0 272.0 L 362.9 271.0 L 360.6 271.0 L 358.7 270.4 L 358.1 270.9 L 357.4 272.0 L 355.4 273.0 L 354.9 272.8 L 354.2 271.8 L 353.6 272.0 L 351.7 271.3 L 350.8 270.0 L 350.4 269.8 L 346.2 268.5 L 343.8 269.6 L 340.5 272.2 L 339.0 272.2 L 337.9 273.5 L 335.0 276.1 L 333.9 276.7 L 328.7 277.9 L 328.9 279.7 L 328.1 279.2 L 327.4 280.1 L 327.7 281.6 L 326.6 281.7 L 326.4 282.6 L 326.2 283.2 L 323.6 284.6 L 322.4 284.8 L 322.6 286.6 L 323.0 287.5 L 322.8 287.8 L 322.4 288.0 L 321.5 287.2 L 320.5 287.2 L 318.3 289.7 L 317.3 290.4 L 314.2 291.6 L 313.0 291.2 L 312.5 291.7 L 312.3 292.8 L 311.1 291.4 L 310.7 291.3 L 311.3 292.5 L 311.3 293.7 L 311.2 294.3 L 310.9 294.9 L 310.2 295.4 L 310.0 297.4 L 309.6 298.6 L 308.4 301.7 L 307.3 303.6 L 307.0 305.0 L 306.3 304.1 L 305.8 305.6 L 303.9 307.6 L 303.5 309.1 L 303.4 310.0 L 303.6 310.8 L 303.9 311.3 L 305.4 311.8 L 306.5 312.5 L 308.4 314.9 L 309.2 316.4 L 309.7 318.1 L 310.4 321.5 L 310.7 325.1 L 311.6 320.6 L 312.4 319.8 L 311.1 325.8 L 310.9 327.8 L 311.2 330.4 L 310.7 333.4 L 311.3 334.4 L 312.3 335.4 L 313.0 336.9 L 313.2 339.0 L 314.1 340.1 L 316.6 344.2 L 318.0 346.9 L 319.5 350.6 L 322.2 353.2 L 323.7 355.7 L 326.4 360.9 L 327.1 363.9 L 327.6 365.3 L 329.8 368.9 L 332.3 372.0 L 133.1 372.0 L 133.5 371.6 L 134.4 371.3 L 142.0 369.9 L 142.1 369.5 L 137.4 368.8 L 136.4 368.2 L 135.0 366.7 L 134.4 365.6 L 134.8 362.9 L 135.3 362.2 L 137.0 362.1 L 142.7 363.3 L 146.8 362.6 L 151.2 364.4 L 155.5 364.0 L 156.4 363.2 L 157.5 360.6 L 163.5 356.4 L 165.6 354.1 L 167.8 352.9 L 171.7 351.5 L 174.9 349.7 L 175.9 349.5 L 183.6 350.4 L 189.0 350.5 L 191.4 348.8 L 192.8 349.4 L 192.5 350.5 L 192.5 351.6 L 193.4 353.1 L 194.2 354.1 L 196.7 355.6 L 200.2 354.4 L 201.4 354.9 L 202.7 358.9 L 203.6 360.4 L 204.8 361.4 L 205.8 361.6 L 206.6 360.5 L 207.1 360.1 L 208.4 359.9 L 210.4 361.3 L 211.1 362.8 L 214.6 363.9 L 217.8 364.5 L 219.2 365.7 L 223.7 366.9 L 225.4 366.7 L 228.2 365.4 L 233.7 364.0 L 237.4 366.0 L 238.4 366.3 L 239.2 366.1 L 240.5 366.6 L 241.8 366.3 L 245.8 364.0 L 247.1 362.7 L 248.4 362.4 L 249.6 361.6 L 252.8 359.0 L 255.5 354.5 L 256.1 352.7 L 256.1 350.3 L 255.2 347.5 L 253.5 339.3 L 252.8 338.1 L 250.0 336.6 L 249.4 335.0 L 247.2 332.9 L 244.2 332.0 L 243.7 331.6 L 241.1 328.9 L 238.0 326.4 L 234.6 322.3 L 232.8 319.6 L 226.9 313.4 L 226.2 312.9 L 223.1 312.0 L 221.8 311.3 L 218.7 306.9 L 217.3 307.5 L 216.0 307.3 L 215.2 306.9 L 214.4 306.3 L 213.9 305.5 L 213.2 303.6 L 212.5 302.5 L 210.0 301.0 L 207.2 300.1 L 206.9 299.7 L 206.9 299.1 L 209.3 298.1 L 209.9 297.5 L 207.8 296.2 L 209.2 295.3 L 210.3 296.0 L 211.5 297.3 L 212.6 297.8 L 213.0 297.2 L 216.7 296.1 L 217.0 295.3 L 216.9 294.3 L 216.3 294.2 L 216.4 293.1 L 216.9 291.7 L 218.6 289.4 L 219.4 286.2 L 220.2 285.4 L 220.8 285.9 L 220.8 287.2 L 221.8 284.7 L 223.9 284.9 L 224.8 284.8 L 223.1 282.3 L 220.8 279.9 L 219.9 280.1 L 219.3 279.7 L 218.3 277.7 L 217.8 276.1 L 219.8 276.4 L 221.6 275.2 L 222.3 275.0 L 224.9 275.6 L 224.8 274.5 L 224.3 273.3 L 226.1 272.3 L 227.8 271.8 L 230.9 269.9 L 232.2 269.6 L 232.5 268.6 L 231.5 266.0 L 229.9 266.0 L 229.0 267.5 L 226.5 268.0 L 225.4 267.9 L 226.3 266.9 L 227.1 266.5 L 227.4 266.1 L 225.6 266.5 L 224.7 267.5 L 221.8 269.0 L 218.4 268.8 L 215.7 269.1 L 213.8 271.6 L 212.6 271.6 L 211.0 272.3 L 209.9 273.1 L 208.5 274.8 L 207.5 274.0 L 206.3 274.1 L 205.1 274.5 L 203.6 275.7 L 202.8 275.9 L 201.2 275.6 L 199.3 276.3 L 195.2 280.1 L 193.8 282.9 L 193.3 283.5 L 192.6 284.2 L 191.5 284.5 L 194.0 281.7 L 194.2 280.3 L 193.6 279.2 L 192.0 281.9 L 189.9 283.2 L 189.9 285.0 L 190.0 286.4 L 190.5 288.1 L 191.6 290.9 L 193.9 295.0 L 194.9 296.5 L 195.7 297.1 L 196.7 297.2 L 198.6 295.9 L 199.3 295.7 L 201.1 296.2 L 201.7 295.4 L 202.6 294.9 L 203.7 294.8 L 206.4 295.8 L 205.3 298.4 L 204.7 301.1 L 203.1 301.7 L 201.5 301.6 L 199.7 302.0 L 197.8 300.5 L 196.8 300.2 L 195.9 300.5 L 194.8 302.4 L 192.8 303.7 L 192.2 305.2 L 190.3 304.9 L 188.7 305.2 L 186.3 306.5 L 184.5 309.4 L 182.5 311.3 L 180.9 311.8 L 179.4 311.7 L 178.5 311.1 L 176.5 309.2 L 176.6 308.5 L 177.3 307.2 L 178.1 303.6 L 178.0 302.4 L 177.5 300.5 L 176.0 299.1 L 174.7 299.4 L 174.0 299.0 L 171.4 296.6 L 170.0 296.4 L 168.5 296.9 L 167.9 296.5 L 167.5 295.7 L 170.6 292.7 L 173.6 290.2 L 174.9 289.9 L 176.7 288.8 L 178.6 287.0 L 178.3 285.7 L 177.9 284.7 L 176.3 285.3 L 174.7 284.2 L 174.2 283.4 L 171.7 284.2 L 170.3 284.1 L 167.2 284.9 L 165.8 284.1 L 163.0 282.0 L 161.9 281.6 L 161.0 281.7 L 160.5 281.0 L 162.6 280.4 L 162.8 280.0 L 162.7 279.4 L 161.3 278.8 L 159.9 278.7 L 158.4 277.4 L 159.9 277.4 L 161.5 277.9 L 163.9 278.1 L 166.1 278.6 L 168.2 276.4 L 166.0 277.2 L 163.9 276.7 L 163.1 276.0 L 162.4 274.9 L 162.1 273.7 L 162.3 272.6 L 162.1 270.6 L 161.1 267.8 L 160.3 266.9 L 161.8 271.5 L 161.7 274.7 L 161.4 275.9 L 160.5 276.1 L 158.2 275.6 L 158.5 273.8 L 157.8 274.4 L 156.9 276.2 L 156.1 276.4 L 154.4 276.3 L 151.1 277.4 L 150.4 280.4 L 149.8 282.0 L 148.4 284.5 L 145.6 288.3 L 141.8 290.5 L 140.5 290.1 L 139.9 290.6 L 139.7 291.2 L 139.7 292.6 L 140.3 293.5 L 140.9 296.6 L 140.0 302.4 L 139.3 304.6 L 134.4 306.0 L 134.7 305.3 L 134.4 303.3 L 134.8 302.5 L 133.7 302.2 L 133.3 302.6 L 132.9 303.4 L 133.2 305.1 L 132.5 306.6 L 132.5 307.9 L 132.1 308.4 L 132.1 309.0 L 132.9 308.9 L 132.5 310.0 L 131.0 312.1 L 130.5 313.3 L 130.7 318.3 L 130.0 321.2 L 129.7 325.9 L 128.8 327.7 L 127.4 327.1 L 125.6 327.6 L 124.7 329.6 L 123.7 331.0 L 123.4 333.6 L 123.3 337.9 L 122.6 338.4 L 122.0 338.6 L 119.4 342.4 L 120.9 343.4 L 121.6 344.3 L 122.6 346.5 L 124.2 349.1 L 124.5 350.3 L 124.2 352.1 L 124.8 354.1 L 126.2 356.9 L 127.7 358.3 L 133.4 361.8 L 134.5 362.1 L 133.9 364.8 L 133.5 365.6 L 131.8 366.1 L 127.2 364.6 L 126.0 364.4 L 125.2 364.8 L 123.6 365.9 L 121.9 365.5 L 119.6 366.2 L 118.9 368.3 L 117.2 370.7 L 115.4 372.0 L 112.6 372.0 L 112.8 371.7 L 108.7 372.0 L 106.2 371.9 L 105.3 369.4 L 103.8 368.2 L 100.4 367.5 L 98.7 366.6 L 98.0 366.8 L 96.6 365.8 L 95.7 366.2 L 93.6 368.0 L 92.6 367.8 L 91.4 366.8 L 90.6 366.6 L 89.7 367.1 L 88.3 369.1 L 86.8 370.1 L 85.5 369.7 L 83.8 369.7 L 83.6 370.9 L 84.2 372.0 L 41.6 372.0 L 41.4 371.1 L 41.9 369.1 L 42.6 366.8 L 42.6 364.0 L 42.8 362.0 L 42.4 359.0 L 42.9 356.8 L 43.7 355.5 L 43.7 353.2 L 42.7 352.1 L 41.5 351.9 L 40.0 350.6 L 39.4 348.9 L 37.2 345.9 L 34.7 343.8 L 34.5 343.5 L 34.8 342.8 L 33.6 342.9 L 30.2 339.7 L 26.9 337.1 L 24.6 336.5 L 21.5 334.4 L 19.5 333.7 L 21.1 333.5 L 26.0 336.3 L 25.4 335.5 L 24.2 334.5 L 22.2 332.1 L 20.3 330.6 L 18.1 327.7 L 15.2 326.5 L 13.2 325.3 L 10.7 325.9 L 9.3 325.6 L 8.9 324.9 L 8.9 323.5 L 4.7 319.5 L 1.7 315.3 L 1.1 313.9 L 2.6 313.4 L 4.4 313.7 L 2.5 311.9 L 0.0 308.8 L 0.0 157.6 L 8.5 154.9 L 11.3 154.3 L 13.1 152.0 L 14.8 150.1 L 17.9 149.4 L 19.1 148.6 L 21.5 147.3 L 27.1 145.9 L 29.4 145.6 L 31.7 145.6 L 35.9 148.0 L 36.3 148.9 L 35.1 148.3 L 33.4 147.1 L 32.8 147.1 L 34.2 150.8 L 35.0 152.1 L 36.6 153.1 L 38.0 153.4 L 42.1 152.8 L 43.5 152.0 L 45.4 150.3 L 46.4 148.8 L 47.2 147.0 L 47.5 144.3 L 48.8 143.7 L 51.6 143.8 L 52.7 143.1 L 54.3 141.4 L 55.9 139.3 L 57.5 136.6 L 57.9 135.4 L 58.2 133.7 L 58.4 133.2 L 58.3 135.3 L 57.6 137.4 L 56.0 140.1 L 53.5 143.3 L 56.3 144.5 L 57.3 144.6 L 59.1 144.1 L 59.6 138.7 L 59.3 137.6 L 59.6 135.8 L 59.0 133.2 L 57.9 130.1 L 57.8 126.7 L 57.5 123.0 L 57.6 117.0 L 58.0 114.0 L 59.8 112.3 L 60.7 110.9 L 61.2 109.1 L 61.4 107.5 L 61.7 106.1 L 64.3 102.1 L 66.4 101.7 L 72.2 99.7 L 73.1 101.7 L 76.8 105.0 L 77.8 106.1 L 79.2 109.8 L 82.7 111.7 L 85.4 111.1 L 88.7 108.5 L 89.7 107.2 L 89.9 106.0 L 89.5 100.9 L 88.9 98.7 L 89.2 96.7 L 90.5 93.6 L 90.7 91.1 L 91.3 90.5 L 91.1 89.7 L 89.8 89.2 L 89.3 89.2 L 88.3 90.7 L 87.2 91.1 L 86.2 90.4 L 83.8 89.6 L 83.2 88.4 L 83.1 87.3 L 81.9 86.1 L 81.4 84.8 L 81.6 83.9 L 82.7 83.3 L 83.0 82.8 L 81.3 82.7 L 80.6 80.7 L 81.2 80.0 L 81.4 79.4 L 81.0 78.9 L 81.1 78.3 L 81.4 77.7 L 81.2 76.3 L 84.0 75.0 L 86.9 74.7 L 86.6 73.5 L 87.7 73.4 L 89.7 71.9 L 91.6 72.1 L 94.5 71.1 L 99.9 71.1 L 100.6 70.5 L 100.5 69.2 L 103.2 69.3 L 109.6 70.6 L 111.2 70.6 L 113.4 71.9 L 114.5 72.2 L 118.0 72.2 L 123.3 72.8 L 124.4 71.9 L 125.0 70.6 L 124.5 67.9 L 124.9 67.0 L 125.6 66.9 L 126.4 67.9 L 127.6 68.4 L 128.4 67.7 L 128.7 66.4 L 129.3 65.9 L 130.1 66.4 L 131.5 66.6 L 133.4 66.2 L 134.7 64.1 L 135.3 63.5 L 140.3 64.2 L 144.7 65.5 L 145.0 65.0 L 145.1 64.2 L 143.3 63.1 L 142.3 61.6 L 140.8 60.4 L 139.4 60.3 L 137.5 60.7 L 134.6 60.4 L 132.1 58.2 L 130.5 57.5 L 129.3 55.8 L 129.1 54.9 L 130.3 55.7 L 130.6 53.8 L 129.3 52.7 L 126.1 54.4 L 122.1 55.0 L 121.2 55.5 L 119.8 55.7 L 119.2 56.1 L 116.7 54.8 L 115.5 55.1 L 114.3 56.0 L 112.1 56.2 L 110.3 56.9 L 110.2 56.0 L 110.5 54.8 L 111.0 54.0 L 111.0 53.5 L 110.7 53.5 L 109.9 54.7 L 109.6 56.1 L 108.8 56.7 L 107.2 57.0 L 105.5 55.9 L 104.8 55.9 L 105.6 57.6 L 105.5 58.1 L 104.7 58.0 L 102.9 59.2 L 102.5 59.2 L 101.9 58.2 L 100.0 59.3 L 98.2 59.5 L 97.1 60.4 L 91.8 61.7 L 91.0 62.7 L 90.3 63.1 L 89.3 62.8 L 83.4 64.0 L 80.9 63.7 L 78.2 66.0 L 76.7 66.4 L 76.1 66.2 L 76.6 65.6 L 77.6 64.9 L 78.3 63.9 L 78.4 63.1 L 77.2 62.7 L 76.4 61.9 L 75.6 60.1 L 75.2 60.1 L 74.7 61.9 L 74.1 62.6 L 73.1 63.0 L 71.3 63.0 L 71.1 62.0 L 71.4 61.1 L 71.1 61.0 L 71.4 60.3 L 72.3 60.2 L 72.6 59.9 L 72.5 59.4 L 71.9 59.3 L 71.8 59.0 L 72.5 57.4 L 69.4 57.1 L 66.3 55.5 L 65.5 55.4 L 65.0 54.0 L 64.3 54.2 L 63.2 55.0 L 61.5 54.0 L 61.3 53.4 L 61.2 51.3 L 60.8 48.1 L 61.0 46.6 L 61.9 44.9 L 62.2 43.1 L 62.3 41.0 L 62.1 40.3 L 62.2 39.9 L 62.7 39.9 L 62.1 38.8 L 62.3 38.6 L 63.0 38.5 L 63.1 38.2 L 62.6 37.0 L 62.6 36.4 L 61.0 33.0 L 59.8 31.8 L 60.7 28.1 L 60.4 26.2 L 58.9 25.1 L 58.3 21.8 L 58.7 19.9 L 59.2 19.1 L 61.7 16.6 L 61.9 15.2 L 63.6 15.1 L 62.8 14.0 L 62.6 12.5 L 65.0 12.0 L 65.9 12.4 L 68.1 11.9 L 70.0 10.8 L 69.9 10.3 L 69.2 8.8 L 69.5 8.5 L 70.2 8.7 L 69.9 8.2 L 70.0 7.7 L 70.7 7.9 L 72.0 6.5 L 72.0 5.5 L 74.1 4.9 L 76.6 2.7 L 78.9 1.5 L 80.5 0.0 L 205.1 0.0 L 210.3 1.3 L 214.1 2.8 L 214.7 2.8 L 216.6 1.5 L 219.8 0.7 L 220.3 0.0 L 1000.0 0.0 Z M 0.0 0.0 L 56.0 0.0 L 55.1 2.0 L 54.2 2.6 L 52.1 3.5 L 51.3 4.3 L 49.7 5.2 L 46.9 6.0 L 45.7 7.2 L 45.1 8.4 L 44.5 8.5 L 43.0 7.7 L 42.9 9.0 L 41.6 8.2 L 40.9 8.9 L 40.4 10.2 L 38.5 12.0 L 36.4 11.7 L 36.2 12.0 L 36.8 12.2 L 36.8 12.5 L 34.4 12.9 L 33.7 14.8 L 31.9 15.3 L 31.6 15.8 L 33.4 15.9 L 33.0 17.4 L 31.0 18.2 L 30.2 19.1 L 29.3 19.1 L 29.5 18.4 L 28.1 18.4 L 27.7 17.6 L 27.5 17.8 L 27.6 18.5 L 28.4 20.2 L 27.7 21.2 L 28.7 21.7 L 29.0 22.1 L 28.1 22.5 L 27.0 23.7 L 25.9 23.7 L 25.2 24.5 L 24.5 24.5 L 23.0 23.6 L 22.7 24.3 L 22.6 24.9 L 23.1 26.3 L 24.2 27.5 L 25.1 28.0 L 24.4 28.3 L 23.9 29.0 L 22.6 33.8 L 23.0 35.8 L 23.5 36.7 L 22.2 36.6 L 20.9 36.1 L 21.1 37.1 L 20.3 38.4 L 20.6 40.3 L 20.4 41.5 L 20.7 41.9 L 21.0 42.6 L 20.6 43.2 L 20.8 43.6 L 21.1 47.8 L 21.0 48.3 L 21.7 50.6 L 21.4 52.3 L 22.5 53.3 L 24.4 53.3 L 24.7 53.5 L 25.4 55.0 L 26.1 54.9 L 28.2 54.1 L 28.7 55.3 L 30.2 57.0 L 31.0 57.7 L 32.4 58.1 L 34.0 59.5 L 33.7 61.1 L 34.4 61.6 L 36.1 62.2 L 37.5 64.4 L 38.1 66.2 L 37.9 67.3 L 35.5 68.9 L 34.1 70.4 L 31.9 71.8 L 31.3 72.4 L 30.7 72.7 L 30.2 72.5 L 28.3 73.7 L 28.4 74.2 L 29.9 74.4 L 30.6 74.1 L 31.2 73.6 L 32.4 73.5 L 33.5 72.9 L 34.0 73.1 L 34.5 74.2 L 33.4 74.7 L 32.6 74.8 L 32.2 76.5 L 31.3 77.7 L 29.6 78.4 L 27.0 80.1 L 26.4 79.9 L 25.5 80.7 L 23.4 81.6 L 22.4 82.9 L 20.0 84.0 L 18.8 84.9 L 12.5 84.7 L 11.5 85.2 L 12.5 85.3 L 13.2 85.7 L 14.0 85.5 L 17.0 86.0 L 18.3 87.5 L 17.4 88.0 L 15.7 88.4 L 16.8 91.9 L 16.2 92.7 L 16.1 96.6 L 15.2 96.7 L 14.8 98.3 L 15.1 99.1 L 15.1 101.0 L 15.3 102.2 L 15.7 103.2 L 15.5 104.4 L 14.0 107.0 L 14.1 108.2 L 14.5 110.1 L 13.4 114.3 L 12.8 115.8 L 11.5 117.7 L 10.9 119.1 L 9.4 123.6 L 7.8 125.1 L 5.9 124.2 L 4.8 124.2 L 3.0 124.7 L 0.0 124.4 L 0.0 0.0 Z M 0.0 139.9 L 1.2 140.7 L 1.2 141.6 L 0.7 142.7 L 0.4 142.9 L 0.0 142.8 L 0.0 139.9 Z M 0.0 309.6 L 1.0 311.1 L 2.2 312.4 L 1.7 312.7 L 1.5 313.1 L 0.3 311.8 L 0.0 311.3 L 0.0 309.6 Z M 0.0 316.9 L 1.7 319.2 L 1.8 319.6 L 1.2 319.5 L 0.0 317.7 L 0.0 316.9 Z M 0.0 372.0 L 0.0 349.9 L 1.5 350.9 L 3.8 351.2 L 9.1 350.8 L 11.0 351.5 L 11.3 352.8 L 10.9 353.7 L 8.6 355.9 L 8.5 357.6 L 9.6 358.8 L 14.8 362.0 L 20.0 364.7 L 21.7 366.1 L 23.6 368.3 L 28.2 371.2 L 28.6 372.0 L 0.0 372.0 Z M 91.8 372.0 L 91.0 371.3 L 91.0 370.7 L 92.0 369.0 L 92.9 369.1 L 93.6 370.4 L 93.4 371.2 L 93.5 371.8 L 91.8 372.0 Z M 17.9 111.4 L 17.5 113.7 L 16.9 114.3 L 14.5 122.5 L 14.0 123.3 L 13.6 123.2 L 13.3 122.2 L 13.2 119.4 L 13.4 118.1 L 15.5 113.2 L 16.4 112.8 L 17.7 109.8 L 18.1 108.4 L 19.0 106.2 L 19.3 105.7 L 20.2 106.1 L 19.5 106.7 L 19.6 107.9 L 17.9 111.4 Z M 30.0 112.5 L 30.6 111.0 L 31.3 109.9 L 30.6 109.1 L 30.2 107.8 L 29.6 106.9 L 30.1 105.8 L 29.8 104.1 L 29.9 102.4 L 32.5 99.2 L 33.8 98.0 L 35.5 97.5 L 36.3 98.0 L 36.7 96.9 L 37.2 96.6 L 38.9 97.9 L 38.1 98.3 L 37.7 99.4 L 36.4 100.0 L 36.2 103.5 L 37.3 104.9 L 36.1 105.5 L 35.7 106.1 L 35.3 107.3 L 33.8 108.1 L 33.2 108.6 L 32.3 109.8 L 31.9 111.6 L 31.0 112.3 L 30.0 112.5 Z M 39.5 97.5 L 39.0 97.4 L 38.6 96.7 L 39.5 95.6 L 41.4 95.9 L 39.7 96.5 L 39.5 97.5 Z M 66.9 96.4 L 66.7 95.9 L 66.8 95.4 L 68.7 92.8 L 67.9 92.6 L 67.2 91.9 L 65.8 91.1 L 65.5 90.5 L 66.2 90.3 L 66.8 89.1 L 65.6 87.4 L 66.2 87.1 L 66.9 87.2 L 67.7 87.7 L 68.5 87.1 L 69.5 87.2 L 70.0 86.1 L 72.1 85.3 L 73.5 85.8 L 74.8 85.4 L 76.1 85.7 L 79.3 87.6 L 79.6 88.1 L 77.7 88.4 L 76.8 89.4 L 76.3 89.5 L 74.2 91.1 L 73.9 91.6 L 71.7 91.5 L 70.5 91.8 L 69.5 92.7 L 69.1 94.5 L 68.4 95.8 L 67.6 96.3 L 66.9 96.4 Z M 77.1 85.6 L 77.5 84.8 L 78.1 84.5 L 79.7 85.0 L 79.9 86.1 L 79.8 86.5 L 79.0 86.7 L 77.1 85.6 Z M 74.3 82.2 L 73.2 84.0 L 72.1 84.3 L 71.4 84.0 L 71.5 83.3 L 70.8 81.6 L 69.9 81.1 L 68.5 81.0 L 67.4 80.3 L 71.3 79.8 L 71.7 79.0 L 72.5 78.1 L 73.1 78.0 L 73.6 78.2 L 73.9 79.2 L 75.6 79.5 L 76.3 80.7 L 76.6 82.0 L 75.8 82.1 L 75.0 82.9 L 74.3 82.2 Z M 33.3 77.7 L 32.6 78.9 L 32.0 79.0 L 32.4 78.0 L 33.3 77.7 Z M 34.6 71.6 L 34.1 72.4 L 33.8 71.8 L 34.1 71.0 L 34.6 70.7 L 35.3 70.9 L 34.6 71.6 Z M 53.6 62.8 L 53.5 63.2 L 52.8 63.3 L 52.4 63.0 L 51.6 62.8 L 52.5 62.3 L 53.2 62.4 L 53.6 62.8 Z M 48.2 60.6 L 48.1 62.0 L 45.8 62.2 L 45.3 61.9 L 44.6 59.8 L 44.8 59.2 L 45.6 58.9 L 45.7 60.1 L 46.3 60.0 L 46.5 58.7 L 45.7 57.9 L 46.1 57.3 L 46.7 57.0 L 47.2 57.8 L 48.6 57.9 L 50.2 59.3 L 49.6 60.4 L 48.5 60.4 L 48.2 60.6 Z M 44.6 60.9 L 43.9 60.9 L 43.7 61.3 L 43.3 61.2 L 43.2 60.5 L 43.5 59.6 L 44.2 59.6 L 44.6 60.9 Z M 66.2 58.2 L 65.2 57.4 L 65.0 57.1 L 65.4 56.9 L 65.2 56.3 L 65.3 56.0 L 66.0 56.5 L 66.4 57.1 L 66.0 57.2 L 66.9 58.1 L 66.2 58.2 Z M 67.6 58.9 L 68.1 57.8 L 68.6 57.6 L 69.8 58.0 L 70.3 57.8 L 70.9 58.7 L 69.9 59.2 L 69.8 59.8 L 70.2 60.3 L 70.4 60.9 L 69.4 60.8 L 68.9 60.4 L 68.7 59.7 L 67.6 58.9 Z M 65.6 60.3 L 65.3 61.2 L 64.4 61.8 L 64.0 61.7 L 64.1 60.7 L 64.7 60.3 L 65.6 60.3 Z M 62.8 60.7 L 63.4 60.8 L 63.5 61.2 L 63.3 61.8 L 62.5 61.9 L 62.0 61.5 L 62.8 60.7 Z M 61.5 55.8 L 60.2 55.9 L 59.7 55.1 L 59.4 53.9 L 59.5 53.6 L 59.9 53.3 L 60.2 54.0 L 61.7 55.1 L 61.5 55.8 Z M 60.8 12.5 L 60.3 13.2 L 59.8 13.3 L 58.8 12.6 L 58.1 11.3 L 59.6 11.3 L 59.4 11.9 L 59.5 12.2 L 60.1 12.1 L 60.8 11.6 L 61.4 11.9 L 61.3 12.6 L 60.8 12.5 Z M 23.2 337.1 L 24.9 337.6 L 26.2 338.7 L 22.3 337.2 L 23.2 337.1 Z M 18.8 335.1 L 17.6 335.6 L 16.5 335.3 L 15.8 334.6 L 15.7 334.0 L 17.5 334.4 L 18.8 334.2 L 19.9 334.5 L 20.8 335.2 L 18.8 335.1 Z M 14.5 330.3 L 15.7 330.5 L 16.1 331.1 L 20.9 331.9 L 16.0 332.0 L 14.7 331.6 L 13.1 330.5 L 14.5 330.3 Z M 13.8 327.8 L 17.5 328.3 L 18.0 328.9 L 17.0 329.6 L 15.5 329.6 L 14.2 329.4 L 13.5 328.9 L 13.8 327.8 Z M 2.3 317.6 L 1.1 316.5 L 0.5 315.5 L 2.1 317.0 L 2.3 317.6 Z M 4.1 319.6 L 3.5 319.4 L 2.8 318.6 L 2.5 317.8 L 3.4 318.4 L 4.1 319.6 Z M 157.9 280.3 L 159.2 281.9 L 162.8 282.9 L 164.1 283.7 L 159.8 282.8 L 158.5 282.1 L 158.1 281.3 L 157.9 280.3 Z M 315.1 293.2 L 315.0 292.3 L 315.3 291.8 L 315.7 293.3 L 315.7 294.3 L 315.5 294.6 L 315.1 293.2 Z M 359.8 295.3 L 359.4 294.6 L 359.9 293.7 L 360.4 293.9 L 360.7 294.8 L 360.6 295.5 L 360.5 295.7 L 359.8 295.3 Z M 337.8 300.9 L 338.3 300.8 L 338.1 302.1 L 337.6 302.8 L 337.4 301.7 L 337.8 300.9 Z M 336.0 300.8 L 336.1 301.2 L 335.4 301.9 L 335.3 302.9 L 335.9 304.0 L 336.7 304.4 L 336.4 304.9 L 335.9 304.8 L 334.9 303.1 L 335.2 301.4 L 336.0 300.8 Z";

// Zone-of-control shading. NOT a hand-drawn front line -- that would assert
// geography this project hasn't verified (exactly where the line ran
// between two known points). Each cell is a Voronoi region ("closer to
// this city than to any other city on the map," clipped to land) computed
// once from the same 22 verified city positions above. Colour is applied
// live, per campaign, from the SAME controlAt(city, atDate) lookup the
// city markers already use -- so this layer adds a technique, not a new
// historical claim. See CIVILWAR_MAP_NOTES below FrontMapScreen.
const ZONE_CELLS = {
  chelyabinsk: "M 499.3 372.0 L 428.7 372.0 L 411.0 0.0 L 502.5 0.0 L 499.3 372.0 Z",
  chita: "M 901.5 0.0 L 1000.0 0.0 L 1000.0 372.0 L 895.7 372.0 L 901.5 0.0 Z",
  don: "M 271.4 311.3 L 226.5 276.1 L 227.1 272.0 L 227.8 271.8 L 230.9 269.9 L 232.2 269.6 L 232.4 269.2 L 232.5 268.6 L 231.5 266.0 L 229.9 266.0 L 229.0 267.5 L 227.8 267.7 L 233.6 230.6 L 255.9 222.8 L 271.4 311.3 Z",
  ekaterinodar: "M 233.3 364.1 L 233.7 364.0 L 237.4 366.0 L 238.4 366.3 L 239.2 366.1 L 240.5 366.6 L 241.8 366.3 L 245.8 364.0 L 247.1 362.7 L 248.4 362.4 L 252.8 359.0 L 255.5 354.5 L 256.1 352.7 L 256.1 350.3 L 255.2 347.5 L 253.5 339.3 L 252.8 338.1 L 250.0 336.6 L 249.4 335.0 L 247.2 332.9 L 244.2 332.0 L 243.7 331.6 L 241.1 328.9 L 238.0 326.4 L 234.6 322.3 L 232.8 319.6 L 226.9 313.4 L 226.2 312.9 L 225.0 312.6 L 220.9 287.0 L 221.8 284.7 L 223.1 284.7 L 223.9 284.9 L 224.8 284.8 L 223.1 282.3 L 220.8 279.9 L 220.5 280.0 L 226.5 276.1 L 271.4 311.3 L 295.6 372.0 L 234.6 372.0 L 233.3 364.1 Z M 220.7 285.9 L 220.8 285.9 L 220.8 286.1 L 220.7 285.9 Z",
  irkutsk: "M 830.7 0.0 L 901.5 0.0 L 895.7 372.0 L 757.7 372.0 L 830.7 0.0 Z",
  kharkov: "M 175.0 235.6 L 176.7 201.3 L 213.6 198.0 L 222.1 223.3 L 195.6 258.3 L 175.0 235.6 Z",
  kiev: "M 139.3 140.2 L 159.8 139.5 L 176.7 201.3 L 175.0 235.6 L 132.6 287.7 L 89.1 324.8 L 109.4 144.1 L 139.3 140.2 Z",
  krasnoyarsk: "M 757.7 372.0 L 659.5 372.0 L 647.8 0.0 L 830.7 0.0 L 757.7 372.0 Z",
  kronstadt: "M 143.9 63.4 L 143.3 63.1 L 142.3 61.6 L 140.8 60.4 L 139.4 60.3 L 137.5 60.7 L 134.6 60.4 L 132.1 58.2 L 130.5 57.5 L 129.3 55.8 L 129.1 54.9 L 130.3 55.7 L 130.6 53.8 L 129.3 52.7 L 126.1 54.4 L 122.1 55.0 L 121.2 55.5 L 119.8 55.7 L 119.2 56.1 L 116.7 54.8 L 115.5 55.1 L 114.3 56.0 L 112.1 56.2 L 111.0 56.5 L 110.3 56.9 L 110.2 56.0 L 110.5 54.8 L 111.0 54.0 L 111.0 53.5 L 110.7 53.5 L 109.9 54.7 L 109.6 56.1 L 108.8 56.7 L 107.2 57.0 L 105.5 55.9 L 104.8 55.9 L 105.6 57.6 L 105.5 58.1 L 104.7 58.0 L 103.7 58.5 L 102.9 59.2 L 102.5 59.2 L 101.9 58.2 L 100.0 59.3 L 98.2 59.5 L 97.1 60.4 L 95.2 61.0 L 94.2 61.0 L 91.8 61.7 L 91.0 62.7 L 90.3 63.1 L 89.3 62.8 L 83.4 64.0 L 80.9 63.7 L 78.2 66.0 L 76.7 66.4 L 76.1 66.2 L 76.6 65.6 L 77.6 64.9 L 78.3 63.9 L 78.4 63.1 L 77.9 62.8 L 77.2 62.7 L 76.4 61.9 L 75.6 60.1 L 75.2 60.1 L 75.0 60.5 L 74.7 61.9 L 74.5 62.3 L 73.1 63.0 L 71.3 63.0 L 71.1 62.0 L 71.4 61.1 L 71.1 61.0 L 71.4 60.3 L 72.3 60.2 L 72.6 59.9 L 72.5 59.4 L 71.9 59.3 L 71.8 59.0 L 72.5 57.4 L 71.9 57.5 L 69.4 57.1 L 66.3 55.5 L 65.5 55.4 L 65.0 54.0 L 64.3 54.2 L 63.2 55.0 L 61.5 54.0 L 61.3 53.4 L 61.2 51.3 L 60.8 48.1 L 61.0 46.6 L 61.7 45.6 L 61.9 44.9 L 62.2 43.1 L 62.3 41.0 L 62.1 40.3 L 62.2 39.9 L 62.7 39.9 L 62.6 39.5 L 62.1 38.8 L 62.3 38.6 L 63.0 38.5 L 63.1 38.2 L 62.6 37.0 L 62.6 36.4 L 61.0 33.0 L 59.8 31.8 L 60.7 28.1 L 60.6 27.3 L 60.4 26.2 L 58.9 25.1 L 58.3 21.8 L 58.5 20.7 L 58.7 19.9 L 59.2 19.1 L 61.7 16.6 L 61.9 15.2 L 63.6 15.1 L 62.8 14.0 L 62.6 13.3 L 62.6 12.5 L 65.0 12.0 L 65.9 12.4 L 68.1 11.9 L 70.0 10.8 L 69.9 10.3 L 69.2 8.8 L 69.5 8.5 L 70.2 8.7 L 69.9 8.2 L 70.0 7.7 L 70.7 7.9 L 72.0 6.5 L 72.0 5.5 L 74.1 4.9 L 76.6 2.7 L 78.9 1.5 L 80.5 0.0 L 147.7 0.0 L 143.9 63.4 Z M 139.3 140.2 L 109.4 144.1 L 89.7 107.2 L 89.9 106.0 L 89.5 100.9 L 88.9 98.7 L 89.2 96.7 L 90.5 93.6 L 90.7 91.1 L 91.2 90.8 L 91.3 90.5 L 91.1 89.7 L 89.8 89.2 L 89.3 89.2 L 88.3 90.7 L 87.2 91.1 L 86.2 90.4 L 83.8 89.6 L 83.2 88.4 L 83.1 87.3 L 81.9 86.1 L 81.4 84.8 L 81.6 83.9 L 82.7 83.3 L 83.0 82.8 L 81.3 82.7 L 81.2 82.3 L 80.6 80.7 L 81.2 80.0 L 81.4 79.4 L 81.0 78.9 L 81.1 78.3 L 81.4 77.7 L 81.2 76.3 L 84.0 75.0 L 86.9 74.7 L 86.6 73.5 L 87.7 73.4 L 89.7 71.9 L 91.6 72.1 L 94.5 71.1 L 99.9 71.1 L 100.6 70.5 L 100.5 69.2 L 101.5 69.4 L 103.2 69.3 L 109.6 70.6 L 111.2 70.6 L 113.4 71.9 L 114.5 72.2 L 118.0 72.2 L 123.3 72.8 L 124.4 71.9 L 125.0 70.6 L 124.8 69.1 L 124.5 67.9 L 124.9 67.0 L 125.6 66.9 L 126.4 67.9 L 127.6 68.4 L 128.4 67.7 L 128.7 66.4 L 129.3 65.9 L 130.1 66.4 L 131.5 66.6 L 133.4 66.2 L 134.7 64.1 L 135.3 63.5 L 140.3 64.2 L 143.8 65.2 L 139.3 140.2 Z M 79.5 88.1 L 79.3 87.6 L 79.6 88.1 L 79.5 88.1 Z M 77.7 84.7 L 78.1 84.5 L 79.7 85.0 L 79.9 86.1 L 79.8 86.5 L 79.0 86.7 L 78.7 86.5 L 77.7 84.7 Z M 74.9 79.4 L 75.6 79.5 L 76.3 80.7 L 76.6 82.0 L 76.3 82.1 L 74.9 79.4 Z M 64.7 60.3 L 65.6 60.3 L 65.2 61.3 L 64.7 60.3 Z M 32.6 0.0 L 56.0 0.0 L 55.1 2.0 L 54.2 2.6 L 52.1 3.5 L 51.3 4.3 L 49.7 5.2 L 46.9 6.0 L 45.7 7.2 L 45.1 8.4 L 44.5 8.5 L 43.0 7.7 L 42.9 9.0 L 41.6 8.2 L 40.9 8.9 L 40.4 10.2 L 38.8 11.7 L 32.6 0.0 Z M 65.2 57.4 L 65.0 57.1 L 65.4 56.9 L 65.2 56.3 L 65.3 56.0 L 66.0 56.5 L 66.4 57.1 L 66.0 57.2 L 66.9 58.1 L 66.2 58.2 L 65.2 57.4 Z M 68.1 57.8 L 68.6 57.6 L 69.8 58.0 L 70.3 57.8 L 70.9 58.7 L 69.9 59.2 L 69.8 59.8 L 70.2 60.3 L 70.4 60.9 L 69.4 60.8 L 68.9 60.4 L 68.7 59.7 L 67.6 58.9 L 67.9 58.5 L 68.1 57.8 Z M 60.8 12.5 L 60.3 13.2 L 59.8 13.3 L 58.8 12.6 L 58.1 11.3 L 59.6 11.3 L 59.4 11.9 L 59.5 12.2 L 60.1 12.1 L 60.8 11.6 L 61.4 11.9 L 61.3 12.6 L 60.8 12.5 Z",
  moscow: "M 214.1 2.8 L 214.7 2.8 L 216.6 1.5 L 219.8 0.7 L 220.3 0.0 L 306.4 0.0 L 265.1 136.9 L 221.8 165.0 L 173.6 120.5 L 214.1 2.8 Z",
  novorossiysk: "M 198.4 355.0 L 200.2 354.4 L 201.4 354.9 L 202.7 358.9 L 203.6 360.4 L 204.8 361.4 L 205.8 361.6 L 206.6 360.5 L 207.1 360.1 L 208.4 359.9 L 210.4 361.3 L 211.1 362.8 L 214.6 363.9 L 217.8 364.5 L 219.2 365.7 L 223.7 366.9 L 225.4 366.7 L 228.2 365.4 L 233.3 364.1 L 234.6 372.0 L 198.6 372.0 L 198.4 355.0 Z M 197.5 299.5 L 198.2 296.1 L 198.6 295.9 L 199.3 295.7 L 201.1 296.2 L 201.7 295.4 L 202.6 294.9 L 203.7 294.8 L 206.4 295.8 L 205.3 298.4 L 204.7 301.1 L 203.1 301.7 L 201.5 301.6 L 199.7 302.0 L 198.6 301.0 L 197.5 300.4 L 197.5 299.5 Z M 220.7 285.9 L 220.7 286.7 L 220.8 287.2 L 220.9 287.0 L 225.0 312.6 L 223.1 312.0 L 221.8 311.3 L 218.7 306.9 L 217.3 307.5 L 216.0 307.3 L 215.2 306.9 L 214.4 306.3 L 213.9 305.5 L 213.2 303.6 L 212.5 302.5 L 210.0 301.0 L 207.2 300.1 L 206.9 299.7 L 206.9 299.1 L 209.3 298.1 L 209.9 297.5 L 207.8 296.2 L 208.5 295.6 L 209.2 295.3 L 210.3 296.0 L 211.5 297.3 L 212.6 297.8 L 213.0 297.2 L 216.7 296.1 L 217.0 295.3 L 216.9 294.3 L 216.6 294.4 L 216.3 294.2 L 216.4 293.1 L 216.9 291.7 L 218.6 289.4 L 219.4 286.2 L 220.2 285.4 L 220.7 285.9 Z",
  omsk: "M 659.5 372.0 L 499.3 372.0 L 502.5 0.0 L 647.8 0.0 L 659.5 372.0 Z",
  orel: "M 159.8 139.5 L 173.6 120.5 L 221.8 165.0 L 213.6 198.0 L 176.7 201.3 L 159.8 139.5 Z",
  perekop: "M 175.0 235.6 L 195.6 258.3 L 200.4 275.9 L 199.3 276.3 L 195.2 280.1 L 193.8 282.9 L 192.6 284.2 L 191.9 284.5 L 191.5 284.5 L 194.0 281.7 L 194.2 280.3 L 193.6 279.2 L 192.0 281.9 L 191.1 282.3 L 189.9 283.2 L 189.9 285.0 L 190.0 286.4 L 190.5 288.1 L 191.6 290.9 L 193.9 295.0 L 194.9 296.5 L 195.7 297.1 L 196.7 297.2 L 198.2 296.1 L 197.5 299.5 L 168.9 294.3 L 170.6 292.7 L 173.6 290.2 L 174.9 289.9 L 176.7 288.8 L 178.6 287.0 L 178.3 285.7 L 177.9 284.7 L 176.3 285.3 L 174.7 284.2 L 174.2 283.4 L 171.7 284.2 L 170.3 284.1 L 167.2 284.9 L 165.8 284.1 L 163.0 282.0 L 161.9 281.6 L 161.0 281.7 L 160.5 281.0 L 161.1 280.7 L 162.6 280.4 L 162.8 280.0 L 162.7 279.4 L 161.3 278.8 L 159.9 278.7 L 158.4 277.4 L 159.9 277.4 L 161.5 277.9 L 163.9 278.1 L 166.1 278.6 L 168.2 276.4 L 166.0 277.2 L 163.9 276.7 L 163.1 276.0 L 162.4 274.9 L 162.1 273.7 L 162.3 272.6 L 162.1 270.6 L 161.3 268.8 L 161.1 267.8 L 160.3 266.9 L 161.1 268.9 L 161.4 270.2 L 161.8 271.5 L 161.7 274.7 L 161.4 275.9 L 160.5 276.1 L 158.2 275.6 L 158.5 273.8 L 157.8 274.4 L 156.9 276.2 L 156.1 276.4 L 154.4 276.3 L 151.1 277.4 L 150.4 280.4 L 149.8 282.0 L 148.4 284.5 L 145.6 288.3 L 145.3 288.6 L 143.2 289.7 L 132.6 287.7 L 175.0 235.6 Z M 159.2 281.9 L 162.8 282.9 L 164.1 283.7 L 159.8 282.8 L 158.5 282.1 L 158.1 281.3 L 157.9 280.3 L 158.7 281.4 L 159.2 281.9 Z",
  petrograd: "M 173.6 120.5 L 159.8 139.5 L 139.3 140.2 L 143.8 65.2 L 144.7 65.5 L 145.0 65.0 L 145.1 64.2 L 143.9 63.4 L 147.7 0.0 L 205.1 0.0 L 210.3 1.3 L 214.1 2.8 L 173.6 120.5 Z",
  saratov: "M 265.1 136.9 L 306.4 0.0 L 310.9 0.0 L 363.6 271.7 L 362.9 271.0 L 360.6 271.0 L 358.7 270.4 L 358.1 270.9 L 357.8 271.5 L 357.4 272.0 L 355.4 273.0 L 354.9 272.8 L 354.2 271.8 L 353.6 272.0 L 351.7 271.3 L 350.8 270.0 L 350.4 269.8 L 347.3 268.7 L 346.2 268.5 L 344.2 269.4 L 264.3 197.9 L 265.1 136.9 Z M 367.2 290.0 L 363.9 287.1 L 365.0 283.1 L 364.7 279.6 L 364.3 278.6 L 364.4 277.5 L 364.7 277.0 L 367.2 290.0 Z",
  sevastopol: "M 89.1 324.8 L 132.6 287.7 L 143.2 289.7 L 141.8 290.5 L 140.5 290.1 L 139.9 290.6 L 139.7 291.2 L 139.7 292.6 L 140.3 293.5 L 140.9 296.6 L 140.0 302.4 L 139.3 304.6 L 134.4 306.0 L 134.7 305.3 L 134.4 303.3 L 134.8 302.5 L 133.7 302.2 L 133.3 302.6 L 132.9 303.4 L 133.2 305.1 L 132.5 306.6 L 132.5 307.9 L 132.1 308.4 L 132.1 309.0 L 132.9 308.9 L 132.5 310.0 L 131.0 312.1 L 130.5 313.3 L 130.7 318.3 L 130.0 321.2 L 129.7 325.9 L 128.8 327.7 L 127.4 327.1 L 125.6 327.6 L 124.7 329.6 L 123.7 331.0 L 123.4 333.6 L 123.3 337.9 L 122.6 338.4 L 122.0 338.6 L 119.4 342.4 L 120.9 343.4 L 121.6 344.3 L 122.6 346.5 L 124.2 349.1 L 124.5 350.3 L 124.2 352.1 L 124.8 354.1 L 126.2 356.9 L 127.7 358.3 L 133.4 361.8 L 134.5 362.1 L 133.9 364.8 L 133.5 365.6 L 131.8 366.1 L 127.2 364.6 L 126.0 364.4 L 125.2 364.8 L 123.6 365.9 L 121.9 365.5 L 119.6 366.2 L 118.9 368.3 L 117.2 370.7 L 115.4 372.0 L 112.6 372.0 L 112.8 371.7 L 110.7 371.7 L 108.7 372.0 L 107.3 371.8 L 106.2 371.9 L 105.3 369.4 L 103.8 368.2 L 100.4 367.5 L 98.7 366.6 L 98.0 366.8 L 96.6 365.8 L 95.7 366.2 L 93.6 368.0 L 92.6 367.8 L 91.4 366.8 L 90.6 366.6 L 89.7 367.1 L 88.3 369.1 L 86.8 370.1 L 85.5 369.7 L 83.8 369.7 L 83.6 370.9 L 84.2 372.0 L 71.7 372.0 L 89.1 324.8 Z M 197.5 299.5 L 197.5 300.4 L 196.8 300.2 L 195.9 300.5 L 194.8 302.4 L 192.8 303.7 L 192.2 305.2 L 190.3 304.9 L 188.7 305.2 L 186.3 306.5 L 184.5 309.4 L 182.5 311.3 L 180.9 311.8 L 179.4 311.7 L 178.5 311.1 L 176.5 309.2 L 176.6 308.5 L 176.9 308.2 L 177.3 307.2 L 178.1 303.6 L 178.0 302.4 L 177.5 300.5 L 176.0 299.1 L 174.7 299.4 L 174.0 299.0 L 171.4 296.6 L 170.0 296.4 L 168.5 296.9 L 167.9 296.5 L 167.5 295.7 L 168.9 294.3 L 197.5 299.5 Z M 198.6 372.0 L 133.1 372.0 L 133.5 371.6 L 134.4 371.3 L 138.8 370.4 L 142.0 369.9 L 142.1 369.5 L 137.4 368.8 L 136.4 368.2 L 135.0 366.7 L 134.4 365.6 L 134.8 362.9 L 135.3 362.2 L 137.0 362.1 L 142.7 363.3 L 146.8 362.6 L 151.2 364.4 L 155.5 364.0 L 156.4 363.2 L 157.5 360.6 L 163.5 356.4 L 165.6 354.1 L 167.8 352.9 L 171.7 351.5 L 174.9 349.7 L 175.9 349.5 L 183.6 350.4 L 189.0 350.5 L 191.4 348.8 L 192.8 349.4 L 192.5 350.5 L 192.5 351.6 L 193.4 353.1 L 194.2 354.1 L 196.7 355.6 L 198.4 355.0 L 198.6 372.0 Z M 91.0 371.3 L 91.0 370.7 L 91.7 369.4 L 92.0 369.0 L 92.9 369.1 L 93.6 370.4 L 93.4 371.2 L 93.5 371.8 L 93.1 372.0 L 91.8 372.0 L 91.0 371.3 Z",
  tsaritsyn: "M 255.9 222.8 L 264.3 197.9 L 344.2 269.4 L 341.5 271.3 L 340.5 272.2 L 340.0 272.3 L 339.0 272.2 L 337.9 273.5 L 335.0 276.1 L 333.9 276.7 L 332.7 277.1 L 331.4 277.2 L 331.0 277.5 L 329.6 277.6 L 328.7 277.9 L 328.9 279.7 L 328.1 279.2 L 327.4 280.1 L 327.7 281.6 L 326.6 281.7 L 326.4 282.6 L 326.2 283.2 L 323.6 284.6 L 322.4 284.8 L 322.6 286.6 L 323.0 287.5 L 322.8 287.8 L 322.4 288.0 L 321.5 287.2 L 320.5 287.2 L 318.3 289.7 L 317.3 290.4 L 314.2 291.6 L 313.6 291.5 L 313.0 291.2 L 312.5 291.7 L 312.3 292.8 L 311.1 291.4 L 310.8 291.2 L 310.7 291.3 L 311.3 292.5 L 311.3 293.7 L 311.2 294.3 L 310.9 294.9 L 310.2 295.4 L 310.0 297.4 L 309.6 298.6 L 308.4 301.7 L 307.3 303.6 L 307.0 305.0 L 306.6 304.7 L 306.3 304.1 L 305.8 305.6 L 303.9 307.6 L 303.5 309.1 L 303.4 310.0 L 303.6 310.8 L 303.9 311.3 L 305.4 311.8 L 306.5 312.5 L 308.4 314.9 L 309.2 316.4 L 309.7 318.1 L 310.4 321.5 L 310.7 325.1 L 311.6 320.6 L 312.4 319.8 L 312.3 321.1 L 311.7 323.0 L 311.1 325.8 L 310.9 327.8 L 311.2 330.4 L 310.7 333.4 L 311.3 334.4 L 312.3 335.4 L 313.0 336.9 L 313.2 339.0 L 314.1 340.1 L 316.6 344.2 L 318.0 346.9 L 319.5 350.6 L 322.2 353.2 L 323.7 355.7 L 326.4 360.9 L 327.1 363.9 L 327.6 365.3 L 329.8 368.9 L 330.7 370.2 L 332.3 372.0 L 295.6 372.0 L 271.4 311.3 L 255.9 222.8 Z M 367.2 290.0 L 393.2 372.0 L 361.9 372.0 L 362.2 370.7 L 363.1 365.1 L 364.3 367.5 L 365.1 368.5 L 366.9 369.2 L 367.7 369.0 L 368.7 368.4 L 369.6 368.6 L 371.0 371.0 L 372.0 371.3 L 374.1 370.4 L 375.1 370.2 L 376.0 370.6 L 376.9 370.6 L 376.5 369.5 L 376.3 368.4 L 376.8 367.8 L 378.5 368.4 L 379.5 368.0 L 380.1 367.5 L 380.2 366.5 L 380.1 365.5 L 380.0 364.6 L 379.7 363.8 L 378.9 362.6 L 376.0 359.9 L 375.0 358.9 L 374.2 357.5 L 372.8 351.9 L 371.8 348.4 L 371.4 347.9 L 370.9 347.8 L 369.7 347.7 L 366.4 348.5 L 365.3 348.3 L 364.7 348.7 L 363.4 350.2 L 362.8 351.5 L 361.9 354.4 L 362.6 355.3 L 362.1 360.3 L 362.4 362.4 L 362.3 362.5 L 361.3 359.9 L 359.9 357.3 L 358.8 353.3 L 358.6 351.6 L 358.5 348.2 L 359.1 346.0 L 360.0 343.0 L 360.2 341.0 L 359.8 337.7 L 359.4 337.0 L 358.8 336.8 L 357.2 336.8 L 356.7 337.1 L 355.9 336.0 L 354.8 335.8 L 353.7 336.3 L 353.1 336.0 L 352.6 335.3 L 352.1 333.8 L 351.2 332.3 L 350.4 331.4 L 347.4 331.1 L 347.3 330.2 L 347.5 328.3 L 347.4 326.2 L 346.8 324.7 L 345.9 323.6 L 345.2 322.0 L 344.0 318.7 L 342.9 314.9 L 342.5 314.4 L 341.5 313.8 L 338.1 312.8 L 337.6 312.4 L 337.4 311.5 L 337.5 309.6 L 337.8 308.8 L 338.9 308.1 L 343.2 308.0 L 345.0 309.6 L 345.6 309.9 L 346.2 310.0 L 348.1 309.4 L 349.7 309.6 L 349.3 308.8 L 348.7 308.4 L 348.0 308.5 L 347.5 308.2 L 346.6 306.7 L 345.1 305.1 L 344.7 304.4 L 344.6 303.3 L 344.9 302.4 L 346.0 301.5 L 346.9 300.2 L 347.4 298.4 L 348.5 296.4 L 349.7 296.6 L 351.6 295.7 L 354.6 295.9 L 358.2 295.7 L 359.2 295.8 L 362.8 297.0 L 364.4 297.2 L 365.6 296.8 L 364.5 295.6 L 362.1 294.2 L 361.5 293.0 L 362.6 289.7 L 363.9 287.1 L 367.2 290.0 Z M 315.0 292.3 L 315.3 291.8 L 315.7 293.3 L 315.7 294.3 L 315.5 294.6 L 315.1 293.2 L 315.0 292.3 Z M 359.4 294.6 L 359.9 293.7 L 360.4 293.9 L 360.7 294.8 L 360.6 295.5 L 360.5 295.7 L 359.8 295.3 L 359.4 294.6 Z M 338.3 300.8 L 338.1 302.1 L 337.9 302.5 L 337.6 302.8 L 337.4 301.7 L 337.8 300.9 L 338.3 300.8 Z M 336.1 301.2 L 335.4 301.9 L 335.3 302.9 L 335.9 304.0 L 336.7 304.4 L 336.4 304.9 L 335.9 304.8 L 334.9 303.1 L 335.2 301.4 L 336.0 300.8 L 336.1 301.2 Z",
  ufa: "M 428.7 372.0 L 393.2 372.0 L 367.2 290.0 L 364.7 277.0 L 365.3 275.5 L 364.3 272.6 L 363.6 271.7 L 310.9 0.0 L 411.0 0.0 L 428.7 372.0 Z",
  voronezh: "M 213.6 198.0 L 221.8 165.0 L 265.1 136.9 L 264.3 197.9 L 255.9 222.8 L 233.6 230.6 L 222.1 223.3 L 213.6 198.0 Z",
  warsaw: "M 38.8 11.7 L 38.5 12.0 L 36.4 11.7 L 36.2 12.0 L 36.8 12.2 L 36.8 12.5 L 35.0 13.0 L 34.4 12.9 L 33.7 14.8 L 31.9 15.3 L 31.6 15.8 L 33.4 15.9 L 33.0 17.4 L 31.0 18.2 L 30.7 18.7 L 30.2 19.1 L 29.3 19.1 L 29.5 18.4 L 28.1 18.4 L 27.7 17.6 L 27.5 17.8 L 27.6 18.5 L 28.4 20.2 L 28.0 20.9 L 27.7 21.2 L 27.9 21.5 L 28.7 21.7 L 29.0 22.1 L 28.1 22.5 L 27.0 23.7 L 25.9 23.7 L 25.2 24.5 L 24.5 24.5 L 23.9 24.0 L 23.0 23.6 L 22.7 24.3 L 22.6 24.9 L 23.1 26.3 L 24.2 27.5 L 25.1 28.0 L 24.4 28.3 L 23.9 29.0 L 22.6 33.8 L 23.0 35.8 L 23.5 36.7 L 22.2 36.6 L 20.9 36.1 L 21.1 37.1 L 20.3 38.4 L 20.6 40.3 L 20.4 41.5 L 20.7 41.9 L 21.0 42.6 L 20.6 43.2 L 20.8 43.6 L 21.1 47.8 L 21.0 48.3 L 21.7 50.6 L 21.4 52.3 L 22.5 53.3 L 24.4 53.3 L 24.7 53.5 L 25.4 55.0 L 26.1 54.9 L 27.4 54.3 L 28.2 54.1 L 28.7 55.3 L 30.2 57.0 L 31.0 57.7 L 32.4 58.1 L 34.0 59.5 L 33.7 61.1 L 34.4 61.6 L 36.1 62.2 L 36.8 63.1 L 37.1 63.8 L 37.5 64.4 L 38.1 66.2 L 37.9 67.3 L 35.5 68.9 L 34.1 70.4 L 32.5 71.6 L 31.9 71.8 L 31.3 72.4 L 30.7 72.7 L 30.2 72.5 L 28.3 73.7 L 28.4 74.2 L 29.9 74.4 L 30.6 74.1 L 31.2 73.6 L 32.4 73.5 L 33.5 72.9 L 34.0 73.1 L 34.5 74.2 L 33.4 74.7 L 32.6 74.8 L 32.2 76.5 L 31.3 77.7 L 29.6 78.4 L 28.4 79.4 L 27.0 80.1 L 26.4 79.9 L 25.5 80.7 L 23.4 81.6 L 22.4 82.9 L 20.0 84.0 L 18.8 84.9 L 12.5 84.7 L 11.5 85.2 L 12.5 85.3 L 13.2 85.7 L 14.0 85.5 L 17.0 86.0 L 18.3 87.5 L 17.4 88.0 L 15.7 88.4 L 16.8 91.9 L 16.2 92.7 L 16.1 96.6 L 15.2 96.7 L 14.8 98.3 L 15.1 99.1 L 15.1 101.0 L 15.3 102.2 L 15.7 103.2 L 15.5 104.4 L 14.0 107.0 L 14.1 108.2 L 14.3 109.0 L 14.5 110.1 L 13.4 114.3 L 12.8 115.8 L 11.5 117.7 L 10.9 119.1 L 9.4 123.6 L 8.7 124.5 L 7.8 125.1 L 5.9 124.2 L 4.8 124.2 L 3.0 124.7 L 0.0 124.4 L 0.0 0.0 L 32.6 0.0 L 38.8 11.7 Z M 65.2 61.3 L 64.4 61.8 L 64.0 61.7 L 64.1 60.7 L 64.7 60.3 L 65.2 61.3 Z M 76.3 82.1 L 75.8 82.1 L 75.0 82.9 L 74.3 82.2 L 73.2 84.0 L 72.1 84.3 L 71.4 84.0 L 71.5 83.3 L 70.8 81.6 L 69.9 81.1 L 68.5 81.0 L 67.4 80.3 L 71.3 79.8 L 71.7 79.0 L 72.5 78.1 L 73.1 78.0 L 73.6 78.2 L 73.9 79.2 L 74.9 79.4 L 76.3 82.1 Z M 78.7 86.5 L 77.1 85.6 L 77.7 84.7 L 78.7 86.5 Z M 79.5 88.1 L 77.7 88.4 L 76.8 89.4 L 76.3 89.5 L 75.4 90.3 L 74.2 91.1 L 73.9 91.6 L 71.7 91.5 L 70.5 91.8 L 69.5 92.7 L 69.1 94.5 L 68.4 95.8 L 67.6 96.3 L 66.9 96.4 L 66.7 95.9 L 66.8 95.4 L 68.4 93.5 L 68.7 92.8 L 67.9 92.6 L 67.2 91.9 L 65.8 91.1 L 65.5 90.5 L 66.2 90.3 L 66.6 89.8 L 66.8 89.1 L 65.6 87.4 L 66.2 87.1 L 66.9 87.2 L 67.7 87.7 L 68.5 87.1 L 68.9 87.0 L 69.5 87.2 L 70.0 86.1 L 72.1 85.3 L 72.8 85.4 L 73.5 85.8 L 74.8 85.4 L 76.1 85.7 L 79.3 87.6 L 79.5 88.1 Z M 109.4 144.1 L 89.1 324.8 L 71.7 372.0 L 41.6 372.0 L 41.4 371.1 L 41.9 369.1 L 42.6 366.8 L 42.6 364.0 L 42.8 362.0 L 42.5 360.6 L 42.4 359.0 L 42.9 356.8 L 43.4 356.2 L 43.7 355.5 L 43.7 353.2 L 42.7 352.1 L 41.5 351.9 L 40.0 350.6 L 39.4 348.9 L 37.2 345.9 L 34.7 343.8 L 34.5 343.5 L 34.8 342.8 L 33.6 342.9 L 30.2 339.7 L 26.9 337.1 L 24.6 336.5 L 21.5 334.4 L 19.5 333.7 L 21.1 333.5 L 26.0 336.3 L 25.4 335.5 L 24.2 334.5 L 22.2 332.1 L 20.3 330.6 L 18.1 327.7 L 15.2 326.5 L 13.2 325.3 L 10.7 325.9 L 9.9 325.9 L 9.3 325.6 L 8.9 324.9 L 8.9 323.5 L 7.7 322.2 L 6.2 321.0 L 4.7 319.5 L 1.7 315.3 L 1.1 313.9 L 2.6 313.4 L 3.4 313.4 L 4.4 313.7 L 2.5 311.9 L 0.0 308.8 L 0.0 157.6 L 8.5 154.9 L 11.3 154.3 L 12.3 153.2 L 13.1 152.0 L 14.8 150.1 L 17.9 149.4 L 19.1 148.6 L 21.5 147.3 L 27.1 145.9 L 29.4 145.6 L 31.7 145.6 L 35.9 148.0 L 36.3 148.9 L 35.1 148.3 L 33.4 147.1 L 32.8 147.1 L 34.2 150.8 L 35.0 152.1 L 36.6 153.1 L 38.0 153.4 L 42.1 152.8 L 43.5 152.0 L 45.4 150.3 L 46.4 148.8 L 47.2 147.0 L 47.5 144.3 L 48.8 143.7 L 51.6 143.8 L 52.7 143.1 L 54.3 141.4 L 55.9 139.3 L 57.5 136.6 L 57.9 135.4 L 58.2 133.7 L 58.4 133.2 L 58.3 135.3 L 57.6 137.4 L 56.0 140.1 L 53.5 143.3 L 54.2 143.7 L 55.2 143.9 L 56.3 144.5 L 57.3 144.6 L 59.1 144.1 L 59.5 141.3 L 59.6 138.7 L 59.3 137.6 L 59.6 135.8 L 59.0 133.2 L 57.9 130.1 L 57.8 126.7 L 57.5 123.0 L 57.6 117.0 L 58.0 114.0 L 59.8 112.3 L 60.7 110.9 L 61.2 109.1 L 61.4 107.5 L 61.7 106.1 L 64.3 102.1 L 66.4 101.7 L 69.1 100.6 L 72.2 99.7 L 73.1 101.7 L 76.8 105.0 L 77.8 106.1 L 79.2 109.8 L 82.7 111.7 L 85.4 111.1 L 88.7 108.5 L 89.7 107.2 L 109.4 144.1 Z M 1.2 140.7 L 1.2 141.6 L 0.7 142.7 L 0.4 142.9 L 0.0 142.8 L 0.0 139.9 L 1.2 140.7 Z M 1.0 311.1 L 2.2 312.4 L 1.7 312.7 L 1.5 313.1 L 0.3 311.8 L 0.0 311.3 L 0.0 309.6 L 1.0 311.1 Z M 1.7 319.2 L 1.8 319.6 L 1.2 319.5 L 0.0 317.7 L 0.0 316.9 L 1.7 319.2 Z M 0.0 349.9 L 1.5 350.9 L 3.8 351.2 L 9.1 350.8 L 10.1 351.0 L 11.0 351.5 L 11.3 352.8 L 10.9 353.7 L 9.8 354.6 L 8.6 355.9 L 8.5 357.6 L 9.6 358.8 L 14.8 362.0 L 20.0 364.7 L 21.7 366.1 L 23.6 368.3 L 28.2 371.2 L 28.6 372.0 L 0.0 372.0 L 0.0 349.9 Z M 17.5 113.7 L 16.9 114.3 L 14.5 122.5 L 14.0 123.3 L 13.6 123.2 L 13.3 122.2 L 13.2 119.4 L 13.4 118.1 L 15.5 113.2 L 16.4 112.8 L 17.7 109.8 L 18.1 108.4 L 19.0 106.2 L 19.3 105.7 L 20.2 106.1 L 19.5 106.7 L 19.6 107.9 L 17.9 111.4 L 17.5 113.7 Z M 30.6 111.0 L 31.3 109.9 L 30.6 109.1 L 30.2 107.8 L 29.6 106.9 L 30.1 105.8 L 29.8 104.1 L 29.9 102.4 L 31.3 100.8 L 32.5 99.2 L 33.8 98.0 L 35.5 97.5 L 36.3 98.0 L 36.7 96.9 L 37.2 96.6 L 37.8 96.9 L 38.9 97.9 L 38.1 98.3 L 37.7 99.4 L 36.4 100.0 L 36.2 103.5 L 37.3 104.9 L 36.1 105.5 L 35.7 106.1 L 35.3 107.3 L 33.8 108.1 L 33.2 108.6 L 32.3 109.8 L 31.9 111.6 L 31.0 112.3 L 30.0 112.5 L 30.6 111.0 Z M 39.0 97.4 L 38.6 96.7 L 39.5 95.6 L 40.9 95.7 L 41.4 95.9 L 39.7 96.5 L 39.5 97.5 L 39.0 97.4 Z M 32.6 78.9 L 32.0 79.0 L 32.4 78.0 L 33.3 77.7 L 32.6 78.9 Z M 34.3 71.9 L 34.1 72.4 L 33.8 71.8 L 34.1 71.0 L 34.6 70.7 L 35.3 70.9 L 35.3 71.0 L 34.3 71.9 Z M 53.5 63.2 L 52.8 63.3 L 52.4 63.0 L 51.7 63.0 L 51.6 62.8 L 51.9 62.5 L 52.5 62.3 L 53.2 62.4 L 53.6 62.8 L 53.5 63.2 Z M 48.1 62.0 L 45.8 62.2 L 45.3 61.9 L 44.6 59.8 L 44.8 59.2 L 45.6 58.9 L 45.7 60.1 L 46.3 60.0 L 46.5 58.7 L 45.7 57.9 L 46.1 57.3 L 46.7 57.0 L 47.2 57.8 L 48.6 57.9 L 49.4 58.5 L 49.5 58.8 L 50.1 59.0 L 50.2 59.3 L 49.6 60.4 L 49.0 60.3 L 48.2 60.6 L 48.1 62.0 Z M 43.9 60.9 L 43.7 61.3 L 43.3 61.2 L 43.2 60.5 L 43.5 59.6 L 44.2 59.6 L 44.6 60.9 L 43.9 60.9 Z M 63.4 60.8 L 63.5 61.2 L 63.3 61.8 L 62.5 61.9 L 62.0 61.5 L 62.2 61.1 L 62.8 60.7 L 63.4 60.8 Z M 60.2 55.9 L 59.7 55.1 L 59.4 53.9 L 59.5 53.6 L 59.9 53.3 L 60.2 54.0 L 61.7 55.1 L 61.5 55.8 L 60.2 55.9 Z M 24.9 337.6 L 26.2 338.7 L 22.3 337.2 L 23.2 337.1 L 24.9 337.6 Z M 17.6 335.6 L 16.5 335.3 L 16.1 335.0 L 15.8 334.6 L 15.7 334.0 L 17.5 334.4 L 18.8 334.2 L 19.9 334.5 L 20.8 335.2 L 18.8 335.1 L 17.6 335.6 Z M 15.7 330.5 L 16.1 331.1 L 20.9 331.9 L 20.2 332.1 L 16.0 332.0 L 14.7 331.6 L 13.1 330.5 L 14.5 330.3 L 15.7 330.5 Z M 15.2 327.8 L 17.5 328.3 L 18.0 328.9 L 17.8 329.2 L 17.0 329.6 L 15.5 329.6 L 14.2 329.4 L 13.5 328.9 L 13.8 327.8 L 15.2 327.8 Z M 1.1 316.5 L 0.5 315.5 L 2.1 317.0 L 2.3 317.6 L 1.1 316.5 Z M 3.5 319.4 L 2.8 318.6 L 2.5 317.8 L 3.4 318.4 L 4.1 319.6 L 3.5 319.4 Z",
  yuzovka: "M 222.1 223.3 L 233.6 230.6 L 227.8 267.7 L 226.5 268.0 L 225.4 267.9 L 226.3 266.9 L 227.1 266.5 L 227.4 266.1 L 225.6 266.5 L 224.7 267.5 L 221.8 269.0 L 218.4 268.8 L 215.7 269.1 L 213.8 271.6 L 212.6 271.6 L 211.0 272.3 L 209.9 273.1 L 208.5 274.8 L 207.5 274.0 L 206.3 274.1 L 205.1 274.5 L 203.6 275.7 L 202.8 275.9 L 201.2 275.6 L 200.4 275.9 L 195.6 258.3 L 222.1 223.3 Z M 226.5 276.1 L 220.5 280.0 L 219.9 280.1 L 219.3 279.7 L 218.3 277.7 L 217.8 276.1 L 219.8 276.4 L 221.6 275.2 L 222.3 275.0 L 224.9 275.6 L 224.8 274.5 L 224.3 273.3 L 227.1 272.0 L 226.5 276.1 Z",
};

// Fill colours for control state. Deliberately fixed rather than skin-derived:
// the whole point is that Red and White read as different sides at a glance,
// and a skin's single accent colour cannot carry that distinction.
const CONTROL_COLORS = {
  red: "#b03a2e",
  white: "#5b6e8c",
  contested: "#b8860b",
  other: "#7a7a72",
  unknown: "#8a8a82",
};

// Unvisited markers need to stay visible against BOTH the light and dark
// paper skins. The old approach (white(0.8) / black(0.45) matching the
// page background) failed exactly the way it sounds like it would: on a
// light cream page, a near-white fill is nearly invisible. Tinting the
// control colour itself instead — same hue as the visited marker, just
// pale — reads on any background because it's never close to either
// extreme.
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Parse a node's display date ("OCTOBER 1919", "OCTOBER-NOVEMBER 1920") into
// a comparable YYYYMM integer. Takes the FIRST month named in a range.
const MONTH_NUMS = {
  JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
  JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
};
function dateToYYYYMM(dateStr) {
  if (!dateStr) return null;
  const up = dateStr.toUpperCase();
  const year = (up.match(/\b(19\d{2})\b/) || [])[1];
  if (!year) return null;
  let month = 1;
  for (const [name, num] of Object.entries(MONTH_NUMS)) {
    const idx = up.indexOf(name);
    if (idx !== -1) { month = num; break; }
  }
  return parseInt(year, 10) * 100 + month;
}

function controlAt(city, yyyymm) {
  if (!city.control || !city.control.length) return "unknown";
  if (yyyymm == null) return "unknown";
  let side = "unknown";
  for (const [from, s] of city.control) {
    if (yyyymm >= from) side = s;
    else break;
  }
  return side;
}

// Marker radius from population. Area scales with population, so radius
// scales with its square root — Petrograd at 2.4m should dwarf Orel at 76k
// without making Orel disappear, hence the floor.
function markerRadius(city) {
  if (!city.pop) return 6;
  return 3 + 11 * Math.sqrt(city.pop / 2400);
}

// Every decision node and ending, mapped to the real city its content is
// actually set in or centered on. Built directly from the node titles and
// situation text already written — not a separate invented layer.
const NODE_TO_CITY = {
  wrangelsDismissal20: "sevastopol",
  wrangelsReassignment20: "sevastopol",
  sevastopolCouncil20: "sevastopol",
  endingTheCouncilAtSevastopol20: "sevastopol",
  endingTheAdmiralAtIrkutsk20: "irkutsk",
  polishWar20: "warsaw",
  endingTheVistula20: "warsaw",
  // South Russia
  kornilovsDeath18: "ekaterinodar",
  ekaterinodarAssault18: "ekaterinodar",
  afterEkaterinodar18: "ekaterinodar",
  moscowDirective19: "tsaritsyn",
  kievConvergence19: "kiev",
  volgaThrust19: "tsaritsyn",
  volgaOverextension19: "tsaritsyn",
  volgaCossackDesertion19: "tsaritsyn",
  rearSecurity19: "yuzovka",
  peregonovka19: "yuzovka",
  makhnosAftermath19: "yuzovka",
  orelCulmination19: "orel",
  cossackDesertion19: "don",
  kubanCoup19: "ekaterinodar",
  kubanRadaReorganized19: "ekaterinodar",
  kubanQuotaAftermath19: "ekaterinodar",
  kharkovLine19: "kharkov",
  kharkovEncirclement19: "kharkov",
  afterTheCavalryStrike19: "kharkov",
  endingTheLineThatBroke19: "kharkov",
  novorossiysk20: "novorossiysk",
  voroshilovsCavalry20: "novorossiysk",
  moleRearguardFate20: "novorossiysk",
  landLawDecision20: "sevastopol",
  northernTauride20: "perekop",
  wrangelsEnvoy20: "perekop",
  crimeaDefensePrep20: "sevastopol",
  endingBizerte: "sevastopol",
  endingSecondNovorossiysk: "novorossiysk",
  endingArmyDissolved20: "sevastopol",
  endingCossackMutiny: "don",
  endingTheArmyThatDidNotComeBack18: "ekaterinodar",
  // Siberia
  omskCoup18: "omsk",
  boldyrevsFirstWeek18: "omsk",
  reluctanceAftermath18: "chita",
  semyonovResponse18: "chita",
  springOffensive19: "omsk",
  saratovJunction19: "saratov",
  exposedFlank19: "saratov",
  ufaCounteroffensive19: "ufa",
  chelyabinskGrinder19: "chelyabinsk",
  diterichsOverruled19: "chelyabinsk",
  thirdArmySuccessor19: "chelyabinsk",
  railPriority19: "omsk",
  janinsWord19: "omsk",
  endingBoldyrevsOmsk18: "omsk",
  endingOmskFalls19: "omsk",
  iceMarchDecision19: "krasnoyarsk",
  eichesPursuit20: "krasnoyarsk",
  irkutskUltimatum20: "irkutsk",
  semyonovMerger20: "chita",
  manchurianBorder20: "chita",
  chitaFall20: "chita",
  endingManchuria: "chita",
  endingManchuriaEarly: "chita",
  endingDispersedAtTheBorder: "chita",
  endingColumnScattered20: "chita",
  endingLegionWithdraws: "omsk",
  // Bolsheviks
  revvoensovietFormed18: "moscow",
  militaryOppositionCongress19: "moscow",
  congressFallout19: "moscow",
  smirnovReassignment19: "moscow",
  tsaritsynCrisis18: "tsaritsyn",
  tsaritsynAftermath18: "tsaritsyn",
  stalinsRecall18: "moscow",
  stalinsNewPosting18: "moscow",
  grainRequisition18: "moscow",
  supplyShortfall19: "moscow",
  supplyRationingConsequence19: "moscow",
  southernFrontPlan19: "tsaritsyn",
  donbasMobilization19: "yuzovka",
  donbasAttrition19: "yuzovka",
  reinforcedBattalionsTest19: "yuzovka",
  cavalryArmyDebate19: "voronezh",
  distributedPursuit19: "voronezh",
  endingTheAutumnCrisis19: "orel",
  perekopAssault20: "perekop",
  compressedEvacuation20: "sevastopol",
  kronstadt21: "kronstadt",
  endingIceBroken: "kronstadt",
  endingHollowVictory21: "kronstadt",
  endingUnlikelyPrecedent: "kronstadt",
  endingCentralCommitteeMoves: "moscow",
  endingTheIsland21: "kronstadt",
};

// Inline-style helpers. IMPORTANT: these return real style objects, not
// Tailwind classNames — see the comment above SKINS for why (arbitrary-
// value Tailwind classes don't render in this sandbox, no JIT build step).
//
// ROOT-CAUSE FIX (this round): every helper below now branches on
// skin.dark. Previously screenStyle()/mutedTextStyle() always used `paper`
// as the background and `ink` as text color regardless of the skin's dark
// flag — correct for the two light skins (Elegy, Frontier), completely
// backwards for the dark Agitprop skin, where `paper` was meant to be the
// light TEXT color against a dark `ground` background, not the background
// itself. That's exactly what the screenshot showed: Agitprop rendering
// with a cream background and low-contrast pale-tan muted text instead of
// its intended dark ground with light text.
function screenStyle(skin) {
  return skin.dark
    ? { backgroundColor: skin.ground, color: skin.paper, fontFamily: BODY_FONT }
    : { backgroundColor: skin.paper, color: skin.ink, fontFamily: BODY_FONT };
}
function cardStyle(skin, borderWidth = 2) {
  return { borderColor: skin.accent, borderWidth, borderStyle: "solid", fontFamily: BODY_FONT };
}
function accentTextStyle(skin) {
  return { color: skin.accent };
}
function accentBorderStyle(skin) {
  return { borderColor: skin.accent };
}
function accentBgStyle(skin) {
  return { backgroundColor: skin.accent, color: skin.dark ? skin.ground : skin.paper };
}
function mutedTextStyle(skin) {
  // paperDim is a light muted tone — correct for dark-skin text, wrong
  // (too low-contrast) as muted text on a light paper background.
  return skin.dark ? { color: skin.paperDim } : { color: skin.inkMuted };
}
function primaryTextStyle(skin) {
  return { color: skin.dark ? skin.paper : skin.ink };
}
function displayFontStyle(skin) {
  return { fontFamily: skin.displayFont };
}
function monoFontStyle(skin) {
  return { fontFamily: skin.monoFont };
}
function dividerStyle(skin) {
  return { borderColor: skin.dark ? "rgba(217,201,163,0.25)" : skin.inkMuted };
}


function cipherGroups(seedStr) {
  // Deterministic pseudo-cipher digits from a node id — flavor only, not a
  // claim about real historical cryptography.
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  const groups = [];
  for (let i = 0; i < 8; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    groups.push(String(h % 100000).padStart(5, "0"));
  }
  return groups;
}

function TopBar({ title, onClose, menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-black text-white px-4 py-3 flex items-center justify-between relative">
      <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-sm">
        ✕
      </button>
      <div className="font-mono text-sm">{title}</div>
      {menuItems && menuItems.length > 0 ? (
        <>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-sm"
          >
            ···
          </button>
          {menuOpen && (
            <div className="absolute right-4 top-14 bg-stone-950 border border-white/30 font-mono text-xs z-10 min-w-[220px]">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    item.onClick();
                  }}
                  className="px-4 py-3 cursor-pointer border-b border-white/10 last:border-b-0 hover:bg-stone-800"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-sm">···</div>
      )}
    </div>
  );
}

function CipherBlock({ campaign, node, skin, reduceMotion }) {
  const groups = cipherGroups(node?.title || campaign.id);
  const originatorMap = {
    southRussia: "AFSR Field Staff",
    siberia: "Supreme Ruler's Staff, Omsk",
    bolsheviks: "Revvoensoviet Staff Train",
    provisionalGov17: "Cabinet Chancery, Mariinsky Palace",
  };
  const addresseeMap = {
    southRussia: "Volunteer Army Command",
    siberia: "Siberian Army Command",
    bolsheviks: "Southern Front Command",
    provisionalGov17: "Petrograd Garrison Staff",
  };

  return (
    <div className="p-4 border-2 text-xs" style={{ ...screenStyle(skin), borderColor: skin.accent, ...monoFontStyle(skin) }}>
      {/* Header device — the one element that's structurally different per
          skin, not just recolored. Everything else in this block keeps the
          same slot order across all three. */}
      {skin.headerStyle === "seal" && (
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={accentBorderStyle(skin)}>
            <div className="absolute inset-1 rounded-full border opacity-60" style={accentBorderStyle(skin)} />
            <div className="font-bold tracking-wide" style={{ ...accentTextStyle(skin), fontSize: "10px" }}>{campaign.shortTag}</div>
          </div>
          <div style={mutedTextStyle(skin)}>DISPATCH — ENCIPHERED</div>
        </div>
      )}
      {skin.headerStyle === "railmarker" && (
        <div className="mb-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-1 h-2" style={{ backgroundColor: i % 2 === 0 ? skin.accent : "transparent" }} />
            ))}
          </div>
          <div className="mt-1" style={mutedTextStyle(skin)}>{campaign.shortTag} — VERST 0, TELEGRAPH LINE</div>
        </div>
      )}
      {skin.headerStyle === "stamp" && (
        <div className="mb-3 relative">
          <div className="absolute right-0 top-0 w-16 h-16 rounded-full border-2 flex items-center justify-center opacity-90" style={{ ...accentBorderStyle(skin), transform: reduceMotion ? "none" : "rotate(-9deg)" }}>
            <div className="font-bold text-center leading-tight" style={{ ...accentTextStyle(skin), ...displayFontStyle(skin), fontSize: "9px" }}>
              RESTRICTED<br />{campaign.shortTag}
            </div>
          </div>
          <div style={{ ...mutedTextStyle(skin), maxWidth: "60%" }}>ENCIPHERED DISPATCH</div>
        </div>
      )}
      {skin.headerStyle === "telegram" && (
        <div className="mb-3">
          <div className="tracking-widest font-bold mb-1" style={{ ...accentTextStyle(skin), fontSize: "10px" }}>
            {"· — ·· — ·"} {campaign.shortTag} {"· — ·· — ·"}
          </div>
          <div style={mutedTextStyle(skin)}>TELEGRAPH OFFICE, PETROGRAD — PRIORITY</div>
        </div>
      )}

      <div className="tracking-widest mb-3" style={mutedTextStyle(skin)}>
        {groups.slice(0, 4).join(" ")}
        <br />
        {groups.slice(4).join(" ")}
      </div>
      <div className="border-t-2 border-dashed my-3" style={{ borderColor: skin.paperDim }} />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div style={mutedTextStyle(skin)}>DATE</div>
          <div className="font-bold">{node?.date || "—"}</div>
        </div>
        <div>
          <div style={mutedTextStyle(skin)}>DISPATCH NO.</div>
          <div className="font-bold">{groups[0].slice(0, 2)}</div>
        </div>
        <div>
          <div style={mutedTextStyle(skin)}>CLASSIFICATION</div>
          <div className="font-bold">RESTRICTED</div>
        </div>
      </div>
      <div className="mt-3">
        <div style={mutedTextStyle(skin)}>ORIGINATOR</div>
        <div className="font-bold">{originatorMap[campaign.id]}</div>
        <div className="mt-1" style={mutedTextStyle(skin)}>ADDRESSEE</div>
        <div className="font-bold">{addresseeMap[campaign.id]}</div>
      </div>
    </div>
  );
}

function TriangleMeters({ campaign, meters, skin }) {
  const borderColor = { borderColor: skin.dark ? skin.paperDim : skin.ink };
  const dividerColor = { borderColor: skin.paperDim };
  // Label column gets a fixed width so the bar itself is always the same
  // size regardless of label length — "MOBILIZATION" and "POLITICAL
  // RELIABILITY" were squeezing the flex-1 bar to different widths before,
  // which is exactly the misaligned-bars bug being fixed here.
  const labelStyle = { width: "108px", flexShrink: 0, lineHeight: 1.2 };
  return (
    <div className="border-2 p-4" style={{ ...borderColor, ...monoFontStyle(skin) }}>
      {campaign.triangleAxes.map(({ key, label }) => {
        const val = meters[key];
        const pct = Math.max(-10, Math.min(10, val));
        return (
          <div key={key} className="flex items-center mb-2 text-xs">
            <span style={labelStyle}>{label}</span>
            <div className="flex-1 mx-3 border-2 h-5 relative flex" style={borderColor}>
              <div className="w-1/2 h-full relative border-r" style={dividerColor}>
                {pct < 0 && (
                  <div className="h-full absolute right-0" style={{ backgroundColor: skin.accent, width: `${(Math.abs(pct) / 10) * 100}%` }} />
                )}
              </div>
              <div className="w-1/2 h-full relative">
                {pct > 0 && <div className="h-full" style={{ backgroundColor: skin.accent, width: `${(pct / 10) * 100}%` }} />}
              </div>
            </div>
            <span className="w-10 text-right flex-shrink-0">{val > 0 ? `+${val}` : val}</span>
          </div>
        );
      })}
      <div className="text-xs mt-2" style={mutedTextStyle(skin)}>
        All three axes start at 0 — the historical baseline. Plus/minus tracks divergence from what actually happened, capped ±10.
      </div>
    </div>
  );
}

function RecordsListScreen({ onOpen, onOpenWarRecord, onOpenSettings, savedRun, onResume }) {
  const campaigns = Object.values(CAMPAIGNS);
  const whiteCampaigns = campaigns.filter((c) => c.coalition === "white");
  const redCampaigns = campaigns.filter((c) => c.coalition === "red");
  // Neither White nor Red — 1917's dual-power government, chronologically
  // before either side of the Civil War exists. Filtered separately rather
  // than folded into "whiteCampaigns" (it is not a White campaign, and
  // treating it as one would misstate exactly the thing its own thesis is
  // about) or generalized into a loop over every coalition value that
  // happens to exist — a third, deliberately-labeled section is clearer
  // than a generic one for a menu this small.
  const provisionalCampaigns = campaigns.filter((c) => c.coalition === "provisional");
  // Shared stamp-red across the whole shell — deliberately not any one
  // campaign's own accent colour, since this menu sits before the player
  // has picked a side.
  const stampRed = "#8a1f1f";

  // Deliberately neutral shell — one consistent tone for the whole menu,
  // not each campaign's own skin. The distinct look (palette, fonts,
  // signature device) only kicks in once a campaign is actually opened;
  // the main menu shouldn't feel like three different apps stitched
  // together before the player has picked one.
  function CampaignCard(c) {
    return (
      <div
        key={c.id}
        onClick={() => onOpen(c.id)}
        className="cursor-pointer relative"
        style={{ background: "#e9e1cc", border: "1px solid #1a1712", padding: "12px 14px", marginBottom: 12 }}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 12,
            border: `1px solid ${stampRed}`,
            color: stampRed,
            fontSize: 9,
            letterSpacing: 1,
            padding: "1px 6px",
            background: "#f2ecdc",
            fontFamily: "'Courier Prime', monospace",
            transform: `rotate(${c.coalition === "white" ? 3 : c.coalition === "red" ? -2 : 1}deg)`,
          }}
        >
          {c.shortTag}
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 17, color: "#1a1712" }}>{c.label}</div>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#5c5647", marginTop: 2 }}>
          {c.commander}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f2ecdc", minHeight: "100%" }}>
      <TopBar title="dispatches-1922" onClose={() => {}} />
      <div style={{ padding: "16px 16px 10px", borderBottom: "2px double #1a1712" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Courier Prime', monospace",
            fontSize: 9,
            letterSpacing: 2,
            color: "#7a6f5c",
            marginBottom: 8,
          }}
        >
          <span>FILE NO. 1922</span>
          <span style={{ color: stampRed }}>RESTRICTED</span>
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 34, color: "#1a1712", lineHeight: 1 }}>
          DISPATCHES
          <br />
          1922
        </div>
      </div>

      {savedRun && (() => {
        const savedCampaign = CAMPAIGNS[savedRun.campaignId];
        let savedNode = null;
        try {
          savedNode = savedCampaign.resolveNode(savedRun.nodeId, savedRun.flags, savedRun.meters);
        } catch (e) {
          savedNode = null;
        }
        if (!savedNode) return null;
        return (
          <div style={{ padding: "14px 16px 0" }}>
            <div
              onClick={onResume}
              className="cursor-pointer"
              style={{
                border: `2px solid ${stampRed}`,
                background: "#f2ecdc",
                padding: "12px 14px",
              }}
            >
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 4 }}>
                ▶ RESUME COMMAND
              </div>
              <div style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 15, color: "#1a1712" }}>
                {savedCampaign.label} — {savedNode.title}
              </div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#5c5647", marginTop: 2 }}>
                {savedNode.date} · {savedRun.visitedNodes.length} {savedRun.visitedNodes.length === 1 ? "position" : "positions"} on the record
              </div>
            </div>
          </div>
        );
      })()}

      {provisionalCampaigns.length > 0 && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 6 }}>
            PETROGRAD, 1917 — BEFORE THE WAR
          </div>
          {provisionalCampaigns.map((c) => CampaignCard(c))}
        </div>
      )}

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 6 }}>
          THE WHITE MOVEMENT
        </div>
        {whiteCampaigns.map((c) => CampaignCard(c))}
      </div>

      <div style={{ padding: "6px 16px 0" }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 6 }}>
          THE RED ARMY
        </div>
        {redCampaigns.map((c) => CampaignCard(c))}
      </div>

      <div
        style={{
          height: 6,
          margin: "8px 0",
          background: `repeating-linear-gradient(90deg, ${stampRed}, ${stampRed} 6px, transparent 6px, transparent 12px)`,
        }}
      />

      <div className="px-4 pb-8">
        <div
          onClick={onOpenWarRecord}
          className="cursor-pointer"
          style={{
            border: "1px solid #1a1712",
            color: "#1a1712",
            padding: 14,
            fontFamily: "'Courier Prime', monospace",
            fontSize: 13,
            background: "#e9e1cc",
            marginBottom: 10,
          }}
        >
          ▶ WAR RECORD
        </div>
        <div
          onClick={onOpenSettings}
          className="cursor-pointer"
          style={{
            border: "1px solid #1a1712",
            color: "#1a1712",
            padding: 14,
            fontFamily: "'Courier Prime', monospace",
            fontSize: 13,
            background: "#e9e1cc",
          }}
        >
          ▶ SETTINGS
        </div>
      </div>
    </div>
  );
}

function CampaignDetailScreen({ campaignId, onEnter, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const written = c.NODE_ATLAS.length;
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="inline-block border-2 font-bold px-3 py-1 text-sm" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
          {c.shortTag}
        </div>
        <div className="text-3xl font-bold mt-3" style={displayFontStyle(skin)}>{c.label}</div>
        <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{c.commander} · {c.seat}</div>
        <div className="text-sm mt-4 leading-relaxed">{c.thesis}</div>
        <div className="border-t-2 mt-4 pt-4 text-xs" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {written} DECISIONS WRITTEN · {c.ENDINGS_GALLERY.length} ENDINGS · KNOWN-RISK ODDS
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEnter(c.id, false)}
            className="flex-1 border-2 font-bold py-3"
            style={{ borderColor: skin.dark ? skin.paperDim : skin.ink, ...monoFontStyle(skin) }}
          >
            OPEN COMMAND
          </button>
          <button
            onClick={() => onEnter(c.id, true)}
            className="flex-1 border-2 font-bold py-3 text-sm"
            style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}
          >
            ✕ {c.hardMode.capitalName}
          </button>
        </div>
        <div className="text-xs mt-3" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{c.hardMode.description}</div>
      </div>
    </div>
  );
}

function WarRoomScreen({ campaignId, hardModeEnabled, onStart, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-3xl font-bold" style={displayFontStyle(skin)}>{c.label}</div>
        {hardModeEnabled ? (
          <div className="border-2 mt-3 p-4" style={{ borderColor: skin.accent }}>
            <div className="text-xs font-bold" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
              ✕ {c.hardMode.capitalName} — {"●".repeat(c.hardMode.maxCap)}
            </div>
            <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>No rewind. Decisions final. Full meter dashboard hidden below the capital counter.</div>
          </div>
        ) : (
          <div className="text-sm mt-3" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>Full meter visibility, known-risk odds shown before every gamble.</div>
        )}
        <div className="mt-6">
          <TriangleMeters campaign={c} meters={c.initialMeters} skin={skin} />
        </div>
        <button
          onClick={() => onStart(c.id)}
          className="mt-6 w-full font-bold py-3"
          style={{ ...accentBgStyle(skin), ...monoFontStyle(skin) }}
        >
          {hardModeEnabled ? `ENTER COMMAND — ${c.hardMode.capitalName}` : "ENTER COMMAND"}
        </button>
      </div>
    </div>
  );
}

function OddsBadge({ entries, skin }) {
  return (
    <div className="border-2 px-2 py-1 mt-2 text-xs" style={{ borderColor: skin.dark ? skin.paperDim : skin.ink, ...monoFontStyle(skin) }}>
      ⚠ CONTESTED — {entries.map((e, i) => `${e.weight}% ${e.title}`).join(" / ")}
    </div>
  );
}

function ChoiceCard({ choice, skin, meters, hardMode, hardModeEnabled, capitalRemaining, onChoose }) {
  const blocked = typeof choice.gate === "function" && !choice.gate(meters);
  const costsCapital = hardModeEnabled && choice.costsCapital === true;
  return (
    <div
      className="border-2 p-4 mb-3"
      style={{ borderColor: blocked ? skin.paperDim : (skin.dark ? skin.paperDim : skin.ink), borderStyle: blocked ? "dashed" : "solid", opacity: blocked ? 0.75 : 1 }}
    >
      <div className="font-bold text-lg" style={displayFontStyle(skin)}>{choice.label}</div>
      {costsCapital && (
        <div className="inline-block border-2 mt-2 px-2 py-1 text-xs font-bold" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}>
          ✕ COSTS 1 {hardMode.capitalLabel}
        </div>
      )}
      {choice.advisor && (
        <div className="mt-2 border-l-4 pl-3 text-xs italic" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          "{choice.advisor.quote}"
          <div className="not-italic font-bold mt-1" style={primaryTextStyle(skin)}>— {choice.advisor.name.toUpperCase()}</div>
        </div>
      )}
      {choice.historical && (
        <div className="text-xs mt-2" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>◆ HISTORICAL RECORD</div>
      )}
      {choice.uncertain && <OddsBadge entries={choice.uncertain} skin={skin} />}
      {blocked ? (
        <div className="mt-3 text-xs" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
          ✕ NOT AVAILABLE — {choice.disabledReason}
        </div>
      ) : (
        <button onClick={() => onChoose(choice)} className="mt-3 border-2 font-bold px-4 py-2 text-sm" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
          ISSUE THE ORDER
        </button>
      )}
    </div>
  );
}

// Real typewriter reveal, not a fake toggle. Reveals in word-sized chunks
// rather than character-by-character — character reveal on a 300-800 word
// situation/epilogue block is a genuinely bad reading experience even at a
// fast interval, and doesn't match what "typewriter" actually reads as in
// prose this long. instantText=true renders the full text immediately, no
// animation at all — this is what actually makes the settings toggle real.
function TypewriterText({ text, instant, className, style }) {
  const words = React.useMemo(() => text.split(" "), [text]);
  const [shown, setShown] = useState(instant ? words.length : 0);

  React.useEffect(() => {
    setShown(instant ? words.length : 0);
    if (instant) return;
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= words.length) {
          clearInterval(id);
          return n;
        }
        return n + 2;
      });
    }, 35);
    return () => clearInterval(id);
  }, [text, instant, words.length]);

  return (
    <div className={className} style={style}>
      {words.slice(0, shown).join(" ")}
    </div>
  );
}

// Interstitial shown between the outcome of a choice and the next War Room,
// only on nodes that carry a `bulletin` field. Not skippable via a close
// icon (none is offered) — grounding the player before the next decision,
// not another menu to back out of. This is the ONLY place bulletin content
// appears; there is deliberately no browse-anytime archive of it — showing
// up unprompted, tied to the moment it's relevant, is the whole design.
function BulletinScreen({ campaignId, nodeId, flags, meters, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const node = c.resolveNode(nodeId, flags, meters);
  const bulletin = node && node.bulletin;
  const skin = skinFor(c.id);
  if (!bulletin) {
    // Should be unreachable — App only routes here when bulletin exists —
    // but if it ever isn't, don't strand the player on a blank screen.
    onContinue();
    return null;
  }
  const others = Object.values(CAMPAIGNS).filter((oc) => oc.id !== c.id);
  const paperFont = "'Playfair Display', serif";
  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: "#1a1712" }}>
      <div className="flex-1 p-6 flex items-center">
        <div className="w-full mx-auto" style={{ backgroundColor: "#f2ecdc", border: "1px solid #1a1712", color: "#1a1712", maxWidth: 480 }}>
          {/* Masthead */}
          <div style={{ textAlign: "center", padding: "12px 12px 6px", borderBottom: "4px double #1a1712" }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, display: "flex", justifyContent: "space-between", padding: "0 2px 6px", color: "#4a453c" }}>
              <span>DISPATCH</span>
              <span>{c.NEWSPAPER_SUBHEAD}</span>
            </div>
            <div style={{ fontFamily: paperFont, fontWeight: 900, fontSize: 32, letterSpacing: 1, lineHeight: 0.95 }}>
              {c.NEWSPAPER_MASTHEAD}
            </div>
          </div>
          {/* Dateline bar */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", borderBottom: "1px solid #1a1712", fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 1, color: "#4a453c" }}>
            <span>{node.date}</span>
            <span>SINGLE SHEET</span>
          </div>
          {/* Headline + body */}
          <div style={{ padding: "12px 14px 4px", borderBottom: "2px solid #1a1712" }}>
            <div style={{ fontFamily: paperFont, fontWeight: 700, fontSize: 17, lineHeight: 1.15, textAlign: "center" }}>
              {bulletin.headline}
            </div>
          </div>
          <div style={{ padding: "12px 14px", fontFamily: "'PT Serif', serif", fontSize: 13, lineHeight: 1.55, textAlign: "justify" }}>
            {bulletin.body}
          </div>
          {/* Meanwhile */}
          <div style={{ margin: "0 14px 14px", borderTop: "1px solid #1a1712", paddingTop: 8 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 1.5, color: "#4a453c", marginBottom: 6 }}>
              MEANWHILE
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {others.map((oc) => {
                const text = bulletin.meanwhile && bulletin.meanwhile[oc.id];
                if (!text) return null;
                return (
                  <div key={oc.id} style={{ flex: 1, borderLeft: "2px solid #6b6152", paddingLeft: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 10.5, fontFamily: "'PT Serif', serif" }}>{oc.shortTag}</div>
                    <div style={{ fontSize: 10, color: "#3a352c", lineHeight: 1.4, marginTop: 2, fontFamily: "'PT Serif', serif" }}>{text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <button
          onClick={onContinue}
          className="w-full border-2 font-bold py-3 mx-auto block"
          style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin), maxWidth: 480 }}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// Added round 22 — previously the only persistent read on "what is this
// command actually being judged against" was the raw meter dashboard;
// campaign.thesis and campaign.plannedEnding already existed in CAMPAIGNS
// data but were never surfaced during play, only in documentation outside
// the game itself. This doesn't invent an objectives system with its own
// tracked sub-goals — it's a plain-language, always-one-click-away restatement
// of data the file already carries, collapsed by default for the same
// screen-space reason BACKGROUND is.
function ObjectivesPanel({ campaign, skin }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-l-2 mt-3 pl-3 py-1 text-xs leading-relaxed cursor-pointer"
      style={{ borderColor: skin.accent, ...mutedTextStyle(skin) }}
      onClick={() => setOpen((v) => !v)}
    >
      <div
        className="font-bold tracking-widest mb-1 flex items-center justify-between"
        style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}
      >
        <span>OBJECTIVES</span>
        <span>{open ? "▾" : "▸"}</span>
      </div>
      {open && (
        <div>
          <div className="mb-2">{campaign.thesis}</div>
          <div className="mb-2" style={monoFontStyle(skin)}>
            <span className="font-bold">PLANNED TERMINUS: </span>
            {campaign.plannedEnding.title} — {campaign.plannedEnding.date}
          </div>
          <div className="mb-2">
            {campaign.triangleAxes.map((a) => a.label).join(" · ")} track this command's real logistics.
            Zero is the historical baseline — it moves only when a choice diverges from what actually
            happened, in either direction.
          </div>
          {campaign.hardMode && (
            <div style={monoFontStyle(skin)}>
              <span className="font-bold">{campaign.hardMode.capitalName}: </span>
              {campaign.hardMode.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BriefingScreen({ campaignId, nodeId, meters, flags, hardModeEnabled, hardModeValue, instantText, reduceMotion, onChoose, onClose, onOpenMap, onOpenTimeline }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const node = c.resolveNode(nodeId, flags, meters);
  const capitalRemaining = c.hardMode.maxCap - hardModeValue;
  // Collapsed by default and reset per node — background is reference
  // material for a player who wants it, not something that should eat
  // screen space on every single decision whether they asked for it or not.
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  useEffect(() => { setBackgroundOpen(false); }, [nodeId]);
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        {hardModeEnabled && (
          <div className="border-2 p-3 mb-3 flex items-center justify-between" style={{ borderColor: skin.accent }}>
            <div className="text-xs font-bold" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
              {c.hardMode.capitalName} — NO REWIND, NO DASHBOARD BELOW THIS POINT
            </div>
            <div className="text-lg tracking-widest" style={accentTextStyle(skin)}>
              {"●".repeat(capitalRemaining)}{"○".repeat(c.hardMode.maxCap - capitalRemaining)}
            </div>
          </div>
        )}
        <TriangleMeters campaign={c} meters={meters} skin={skin} />
        <ObjectivesPanel campaign={c} skin={skin} />
        <div className="flex gap-2 mt-3">
          {c.hasFrontMap !== false && (
            <button
              onClick={onOpenMap}
              className="flex-1 border-2 py-2 text-xs font-bold"
              style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}
            >
              ▶ VIEW FRONT MAP
            </button>
          )}
          <button
            onClick={onOpenTimeline}
            className="flex-1 border-2 py-2 text-xs font-bold"
            style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}
          >
            ▶ KEY EVENTS
          </button>
        </div>
        <div className="mt-4">
          <CipherBlock campaign={c} node={node} skin={skin} reduceMotion={reduceMotion} />
        </div>
        <div className="mt-4">
          <div className="text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{node.date}</div>
          <div className="text-2xl font-bold mt-1" style={displayFontStyle(skin)}>{node.title}</div>
          <div
            className="inline-block text-xs mt-2 px-2 py-1 border-2 font-bold"
            style={{
              ...monoFontStyle(skin),
              ...primaryTextStyle(skin),
              borderColor: node.historicalRecord ? (skin.dark ? skin.paper : skin.ink) : skin.paperDim,
              borderStyle: node.historicalRecord ? "solid" : "dashed",
            }}
          >
            {node.historicalRecord ? "◆ HISTORICAL RECORD" : "◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE"}
          </div>
          {node.context && (
            <div
              className="border-l-2 mt-4 pl-3 py-1 text-xs leading-relaxed cursor-pointer"
              style={{ borderColor: skin.accent, ...mutedTextStyle(skin) }}
              onClick={() => setBackgroundOpen((v) => !v)}
            >
              <div className="font-bold tracking-widest mb-1 flex items-center justify-between" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
                <span>BACKGROUND</span>
                <span>{backgroundOpen ? "▾" : "▸"}</span>
              </div>
              {backgroundOpen && node.context}
            </div>
          )}
          <TypewriterText text={node.situation} instant={instantText} className="text-sm mt-4 leading-relaxed" />
        </div>
        <div className="mt-6">
          {node.choices.map((choice, i) => (
            <ChoiceCard
              key={i}
              choice={choice}
              skin={skin}
              meters={meters}
              hardMode={c.hardMode}
              hardModeEnabled={hardModeEnabled}
              capitalRemaining={capitalRemaining}
              onChoose={() => onChoose(choice, node)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OutcomeScreen({ campaignId, resolvedText, aftermath, meters, hardModeValue, hardModeMaxed, hardModeEnabled, deltas, onContinue, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const triangleDeltaEntries = Object.entries(deltas.triangle);
  const hasAnyChange = triangleDeltaEntries.length > 0;
  const axisLabel = (key) => (c.triangleAxes.find((a) => a.key === key) || {}).label || key;
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-xs tracking-widest" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>OUTCOME</div>
        <div className="text-sm mt-4 leading-relaxed whitespace-pre-line">{resolvedText}</div>

        {aftermath && (
          <div className="border-l-2 mt-5 pl-3 py-1 text-xs leading-relaxed" style={{ borderColor: skin.accent, ...mutedTextStyle(skin) }}>
            <div className="font-bold tracking-widest mb-1" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
              WHAT FOLLOWED
            </div>
            {aftermath}
          </div>
        )}

        {/* Explicit delta statement — this is what actually answers "did
            anything change." A bar shifting 1-2 points out of ±10 is easy to
            miss; this isn't. */}
        <div className="border-2 mt-5 p-3 text-xs" style={{ borderColor: skin.accent, ...monoFontStyle(skin) }}>
          {hasAnyChange ? (
            <>
              <div className="font-bold mb-1" style={accentTextStyle(skin)}>METER CHANGE THIS TURN</div>
              {triangleDeltaEntries.map(([key, d]) => (
                <div key={key}>{axisLabel(key).toUpperCase()}: {d > 0 ? `+${d}` : d}</div>
              ))}

            </>
          ) : (
            <div className="font-bold" style={mutedTextStyle(skin)}>NO METER CHANGE — HISTORICAL BASELINE (this was the historical choice, or the meter was already at its ±10 cap)</div>
          )}
        </div>

        <div className="mt-4">
          <TriangleMeters campaign={c} meters={meters} skin={skin} />
        </div>
        {hardModeEnabled && (
          <div className="border-2 border-dashed mt-4 p-3 text-xs" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin) }}>
            <div className="font-bold">{c.hardMode.capitalName}: {"●".repeat(c.hardMode.maxCap - hardModeValue)}{"○".repeat(hardModeValue)} ({c.hardMode.maxCap - hardModeValue} of {c.hardMode.maxCap} remaining)</div>
            {hardModeMaxed && <div className="font-bold mt-1" style={accentTextStyle(skin)}>⚠ COMMAND ENDS HERE</div>}
          </div>
        )}
        <button onClick={onContinue} className="mt-6 w-full font-bold py-3" style={{ ...accentBgStyle(skin), ...displayFontStyle(skin) }}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// Real rail connections — the Trans-Siberian main line (Moscow-Ufa-
// Chelyabinsk-Omsk-Krasnoyarsk-Irkutsk-Chita) is not a stylistic choice:
// it's the actual route Kolchak's whole campaign and retreat followed,
// which is exactly why the front map should show it as track, not an
// arbitrary connecting line. Southern lines (Moscow-Orel-Kharkov-
// Ekaterinodar-Novorossiysk, the Donbas network around Yuzovka, the
// Perekop isthmus as Crimea's only land route in) are equally real.
const RAIL_LINES = [
  ["petrograd", "moscow"],
  ["moscow", "warsaw"],
  ["moscow", "orel"],
  ["orel", "kharkov"],
  ["kharkov", "yuzovka"],
  ["kharkov", "ekaterinodar"],
  ["ekaterinodar", "novorossiysk"],
  ["ekaterinodar", "perekop"],
  ["perekop", "sevastopol"],
  ["moscow", "voronezh"],
  ["voronezh", "tsaritsyn"],
  ["tsaritsyn", "saratov"],
  ["saratov", "don"],
  ["don", "ekaterinodar"],
  ["moscow", "ufa"],
  ["ufa", "chelyabinsk"],
  ["chelyabinsk", "omsk"],
  ["omsk", "krasnoyarsk"],
  ["krasnoyarsk", "irkutsk"],
  ["irkutsk", "chita"],
];

// Shared by FrontMapScreen and EndingScreen — one map renderer, not two
// copies of the same rail logic drifting apart over time.
function SituationMapSvg({ visitedCityIds, currentCityId, skin, compact = false, atDate = null }) {
  function RailSegment({ a, b, active }) {
    const p1 = CITIES[a];
    const p2 = CITIES[b];
    if (!p1 || !p2) return null;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(2, Math.floor(len / 18));
    const ties = [];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = p1.x + dx * t;
      const y = p1.y + dy * t;
      const nx = -dy / len;
      const ny = dx / len;
      ties.push(
        <line
          key={i}
          x1={x - nx * 4}
          y1={y - ny * 4}
          x2={x + nx * 4}
          y2={y + ny * 4}
          stroke={active ? skin.accent : skin.paperDim}
          strokeWidth={active ? 1.5 : 1}
          opacity={active ? 0.8 : 0.4}
        />
      );
    }
    return (
      <g>
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={active ? skin.accent : skin.paperDim} strokeWidth={active ? 2 : 1.2} opacity={active ? 0.9 : 0.45} />
        {ties}
      </g>
    );
  }

  // Label geometry per anchor. Sizes are tuned for a ~380px-wide phone
  // viewport, where the old 11px-on-a-1000-unit-viewBox labels rendered
  // at roughly 4 physical pixels — legible on a desktop preview and not
  // on the device anyone actually plays this on. Shrunk from the old
  // schematic map's sizes (16/19px gaps) for Round 22's real-geography
  // map: several real clusters (Perekop/Sevastopol, Novorossiysk/
  // Ekaterinodar, the Don/Yuzovka, Petrograd/Kronstadt) sit only a few
  // real-world km apart, far closer than the old hand-spread schematic
  // ever placed them — smaller text is what keeps those readable rather
  // than mashed together, on top of the anchor choices below that already
  // point each pair's label away from its nearest neighbour.
  function labelPos(city, big) {
    const gap = big ? 12 : 9;
    let p;
    switch (city.anchor) {
      case "w":
        p = { x: city.x - gap, y: city.y + 5, textAnchor: "end" };
        break;
      case "n":
        p = { x: city.x, y: city.y - gap, textAnchor: "middle" };
        break;
      case "s":
        p = { x: city.x, y: city.y + gap + 8, textAnchor: "middle" };
        break;
      default:
        p = { x: city.x + gap, y: city.y + 5, textAnchor: "start" };
        break;
    }
    // Manual nudge for the handful of real clusters where anchor choice
    // alone can't separate two labels — Novorossiysk/Ekaterinodar sit
    // ~12 projected units (~85km) apart, closer together than either
    // label's own text width at any legible font size. A leader-line-free
    // offset (still anchored conceptually to the marker, just pushed
    // further along the same general direction) is the standard
    // cartographic fix for a real dense cluster, and is a display-only
    // nudge — it doesn't move the marker itself or change its geography.
    if (city.labelNudge) {
      p = { ...p, x: p.x + city.labelNudge[0], y: p.y + city.labelNudge[1] };
    }
    return p;
  }

  // Zone-of-control fill per city, evaluated live from the same
  // controlAt() the markers use — see ZONE_CELLS's own comment for why
  // this is a Voronoi tessellation of verified points rather than a
  // hand-drawn front line. Kept at low opacity so the real coastline (and
  // the city markers on top of it) stay the primary read.
  const zoneOpacity = skin.dark ? 0.38 : 0.30;

  return (
    <svg viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`} className="w-full h-auto" style={{ backgroundColor: skin.dark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.03)" }}>
      {/* Round 23: contested zones and markers get a diagonal-hatch pattern
          on top of their fill, not just a different hue. CONTROL_COLORS.red
          (#b03a2e) and .contested (#b8860b) are the pair most likely to
          collapse under red-green colorblindness, and until now status on
          this map was color-only — nothing else distinguished them. The
          hatch also happens to fit the existing mapVoice copy ("amber where
          it changed hands too often to say") better than a flat fill did:
          visibly unsettled, not just differently colored. */}
      <defs>
        <pattern id="contestedHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" fill={CONTROL_COLORS.contested} fillOpacity={zoneOpacity} />
          <line x1="0" y1="0" x2="0" y2="6" stroke={skin.dark ? "#000" : "#fff"} strokeWidth="2" opacity="0.35" />
        </pattern>
      </defs>
      {/* Real geography, bottom to top: bare land, then zone-of-control
          shading (Voronoi cells clipped to land, coloured by who's known
          to have held the nearest city as of this date), then real
          coastline/lake water on top so nothing bleeds into the sea. */}
      <path d={LAND_PATH} fill={skin.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.035)"} stroke="none" />
      {Object.entries(ZONE_CELLS).map(([cid, d]) => {
        const city = CITIES[cid];
        if (!city || !d) return null;
        const side = controlAt(city, atDate);
        const sideColor = CONTROL_COLORS[side] || CONTROL_COLORS.unknown;
        const fillValue = side === "contested" ? "url(#contestedHatch)" : sideColor;
        return <path key={cid} d={d} fill={fillValue} fillOpacity={side === "contested" ? 1 : zoneOpacity} fillRule="evenodd" stroke="none" />;
      })}
      {WATER_PATHS.map((d, i) => (
        <path key={i} d={d} fill={skin.dark ? "rgba(120,150,180,0.22)" : "rgba(70,110,150,0.16)"} fillRule="evenodd" stroke="none" />
      ))}
      <text x="130" y="355" fontSize="12" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.7">BLACK SEA</text>
      <text x="342" y="345" fontSize="11" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.7">CASPIAN SEA</text>
      <text x="880" y="160" fontSize="10" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.7">L. BAIKAL</text>

      {/* No drawn theatre boundary or divider — the coastline is the real
          one now, so a fictional frame would only compete with it. The
          west/east labelling that boundary used to carry moves to plain
          floating labels near each cluster instead. */}
      <text x="70" y="24" fontSize="12" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.8">SOUTH RUSSIA &amp; UKRAINE</text>
      <text x="560" y="24" fontSize="12" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.8">THE TRANS-SIBERIAN — EASTERN FRONT</text>

      {/* Staff-map furniture: north arrow and a rough scale, both against a
          small backing plate now that they can sit over coloured zones
          rather than empty margin. Scale recomputed for the real
          projection: uniform ~7.0 km per unit at this map's standard
          parallel, so 500 miles (~805 km) is ~115 units. */}
      <g opacity="0.85">
        <rect x="932" y="278" width="52" height="56" fill={skin.dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)"} stroke="none" />
        <line x1="958" y1="326" x2="958" y2="290" stroke={skin.paperDim} strokeWidth="1.5" />
        <path d="M 958 284 L 953 296 L 963 296 Z" fill={skin.paperDim} />
        <text x="958" y="342" fontSize="13" textAnchor="middle" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }}>N</text>
      </g>
      <g opacity="0.85">
        <rect x="770" y="332" width="130" height="26" fill={skin.dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)"} stroke="none" />
        <line x1="778" y1="344" x2="893" y2="344" stroke={skin.paperDim} strokeWidth="1.5" />
        <line x1="778" y1="338" x2="778" y2="350" stroke={skin.paperDim} strokeWidth="1.5" />
        <line x1="835" y1="340" x2="835" y2="348" stroke={skin.paperDim} strokeWidth="1" />
        <line x1="893" y1="338" x2="893" y2="350" stroke={skin.paperDim} strokeWidth="1.5" />
        <text x="835" y="356" fontSize="11" textAnchor="middle" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }}>APPROX. 500 MILES</text>
      </g>

      {RAIL_LINES.map(([a, b]) => {
        const active = visitedCityIds.includes(a) && visitedCityIds.includes(b);
        return <RailSegment key={`${a}-${b}`} a={a} b={b} active={active} />;
      })}
      {Object.entries(CITIES).map(([cid, city]) => {
        const visited = visitedCityIds.includes(cid);
        const isCurrent = cid === currentCityId;
        if (compact && !visited) return null;
        const lp = labelPos(city, isCurrent);
        const fontSize = isCurrent ? 14 : visited ? 12 : 10.5;
        const r = markerRadius(city);
        const side = controlAt(city, atDate);
        const sideColor = CONTROL_COLORS[side] || CONTROL_COLORS.unknown;
        // Visited places are filled with the controlling side's colour.
        // Unvisited ones are outlined in it — so the front is readable
        // across the whole map, while the command's own track still reads
        // as the darker, solid one.
        const fill = visited ? sideColor : hexToRgba(sideColor, 0.28);
        const stroke = sideColor;
        const strokeW = isCurrent ? 3.5 : visited ? 2 : 2.25;
        // Round 23: contested markers also get a dashed stroke, the same
        // non-color signal as the hatched zone fill above — see that
        // comment for why color alone wasn't enough here.
        const strokeDash = side === "contested" ? "3 2" : undefined;
        return (
          <g key={cid}>
            {/* Current location gets a ring so it's findable at a glance
                without hunting for the largest marker — necessary now that
                marker size means population, not importance to this run. */}
            {isCurrent && (
              <circle cx={city.x} cy={city.y} r={r + 9} fill="none" stroke={skin.accent} strokeWidth="1.5" opacity="0.55" />
            )}
            {city.kind === "region" ? (
              // Host territory, not a settlement — drawn as a diamond so it
              // never reads as a town with an implied population.
              <path
                d={`M ${city.x} ${city.y - 8} L ${city.x + 8} ${city.y} L ${city.x} ${city.y + 8} L ${city.x - 8} ${city.y} Z`}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeDasharray={strokeDash}
              />
            ) : city.kind === "fortification" ? (
              // Fortified position — a square. Perekop mattered for where it
              // was, not for how many people lived there.
              <rect
                x={city.x - 6}
                y={city.y - 6}
                width="12"
                height="12"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeDasharray={strokeDash}
              />
            ) : (
              <circle
                cx={city.x}
                cy={city.y}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeDasharray={strokeDash}
              />
            )}
            {/* Halo stroke behind the label keeps it readable where it has
                to cross a rail line. */}
            <text
              x={lp.x}
              y={lp.y}
              textAnchor={lp.textAnchor}
              fontSize={fontSize}
              fontWeight={isCurrent || visited ? 700 : 400}
              stroke={skin.dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)"}
              strokeWidth="3.5"
              strokeLinejoin="round"
              fill="none"
              style={{ fontFamily: skin.monoFont }}
            >
              {city.name}
            </text>
            <text
              x={lp.x}
              y={lp.y}
              textAnchor={lp.textAnchor}
              fontSize={fontSize}
              fontWeight={isCurrent || visited ? 700 : 400}
              fill={visited ? (skin.dark ? skin.paper : skin.ink) : skin.paperDim}
              style={{ fontFamily: skin.monoFont }}
            >
              {city.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// CIVILWAR_MAP_NOTES — Round 22 map rebuild: what changed and why.
//
// Through Round 21 the Front Map was a hand-placed schematic: CITIES held
// invented x/y on a 1000x440 canvas, with a drawn dashed "theatre boundary"
// and two freehand sea blobs standing in for real geography. Craig asked
// for "a real historical coloured svg map like we've done for Dispatches
// 1940." Before building anything, that request got checked against what's
// actually true of the two titles rather than assumed equivalent:
//
//   - 1940's Checkpoint Map (see dispatches-1940-specs.md) is built from
//     Python matplotlib/basemap + shapely, with per-country region polygons
//     mostly dissolved straight from MODERN country borders — only Poland/
//     Germany/Czechoslovakia/Hungary needed hand-authoring to their WWII-era
//     shapes, because WWII fronts mostly still ran along recognizable
//     national borders. None of that pipeline or its output exists in this
//     environment; it isn't a port, it's a from-scratch build.
//   - The Russian Civil War doesn't have that shortcut. Fronts ran through
//     gubernias and rail corridors, not countries — modern Russia/Ukraine
//     borders are nearly useless as a source of 1918-21 region shapes, so
//     matching 1940 region-for-region would mean hand-authoring ~20+
//     boundaries with no existing taxonomy, a materially bigger and riskier
//     undertaking than 1940 was.
//
// Asked to choose the scope with that tradeoff stated plainly, Craig picked
// the middle option: real coastline/geography as the backdrop, plus broad
// zone-of-control shading rather than 1940's fine per-region system. What
// got built:
//
//   1. CITIES coordinates are no longer invented. Every one of the 21
//      places was looked up individually (Wikipedia infobox coordinates,
//      not guessed) and projected with a standard equirectangular
//      projection at a 53°N standard parallel -- true scale along every
//      meridian and along that parallel, the ordinary honest choice for a
//      mid-latitude regional map, and (conveniently) also the more legible
//      one: a degree of longitude really is shorter than a degree of
//      latitude this far north, so the geographically correct compression
//      also keeps the map from being an unreadable sliver on a phone.
//      "don" uses Novocherkassk (the historical Don Host capital) as its
//      point, since "The Don" was never a settlement.
//   2. WATER_PATHS / LAND_PATH are real coastline, ocean, and major-lake
//      geometry -- Natural Earth 50m data, fetched fresh from the
//      nvkelso/natural-earth-vector GitHub mirror (verified reachable from
//      this environment) and clipped/simplified to the map's extent.
//      Worth recording one non-obvious find: Natural Earth's dedicated
//      *coastline* layer does NOT include the Caspian Sea's shoreline at
//      all (checked directly, not assumed) -- the Caspian only appears in
//      the *ocean* polygon layer, which is what WATER_PATHS is actually
//      built from.
//   3. ZONE_CELLS is deliberately NOT a hand-drawn front line. A front line
//      between two verified points is new geography this project hasn't
//      verified -- precisely the kind of guess "verify, don't guess" exists
//      to rule out. Instead each city gets a Voronoi cell ("closer to this
//      city than to any other city on the map," clipped to the land
//      polygon), computed once from the same 21 verified positions. Colour
//      is applied live in SituationMapSvg from controlAt(city, atDate) --
//      the SAME function and the SAME control-by-date data the city
//      markers already used pre-Round-22. No new historical claim was
//      introduced; an existing verified fact was extended into a
//      tessellation, an honest technique rather than an invented boundary.
//   4. The drawn dashed "theatre boundary" and the freehand sea blobs are
//      gone -- a fictional frame over real coastline would only compete
//      with it. The orientation labels that boundary used to carry
//      ("SOUTH RUSSIA" / "EASTERN FRONT") are now plain floating text near
//      each cluster instead.
//
// What this is NOT: a claim about where any front line precisely ran on
// any given date. The zone shading is nearest-known-point shading, and
// FrontMapScreen's own in-world copy still says so ("Distances are
// approximate; the line positions are not surveyed").
// ============================================================================

// Added round 22, alongside the real-geography Voronoi zone shading. The
// zone fills and city-marker colours were already explained in prose inside
// mapVoice.body below, but a paragraph is not something a player glances at
// mid-decision — a compact swatch key next to the map itself is. "Own"/
// "enemy" swap per campaign coalition (bolsheviks reads Red as itself,
// white/siberia read White as itself) rather than hard-coding "white"/"red"
// as fixed labels.
function MapLegendRow({ campaignId, skin }) {
  const ownSide = CAMPAIGNS[campaignId].coalition; // "white" or "red"
  const enemySide = ownSide === "red" ? "white" : "red";
  const ownLabel = campaignId === "bolsheviks" ? "THE REPUBLIC — YOUR FORCES" : "AFSR / OWN FORCES — YOUR COMMAND";
  const enemyLabel = campaignId === "bolsheviks" ? "THE WHITES" : "THE RED ARMY";
  const items = [
    { color: CONTROL_COLORS[ownSide], label: ownLabel },
    { color: CONTROL_COLORS[enemySide], label: enemyLabel },
    // Round 23: hatched, not just colored — matches the diagonal-hatch fill
    // and dashed marker outline the map itself now uses for contested
    // territory, so the legend swatch actually previews what's on the map
    // rather than promising a solid color the map doesn't use anymore. See
    // SituationMapSvg's own comment for why (red/contested collapse under
    // red-green colorblindness with color as the only signal).
    { color: CONTROL_COLORS.contested, hatched: true, label: "CONTESTED — CHANGED HANDS THIS MONTH" },
    { color: CONTROL_COLORS.other, label: "OTHER FORCES — NATIONALIST, ALLIED, OR HOST-GOVERNED" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 px-1">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span
            style={{
              width: 10,
              height: 10,
              minWidth: 10,
              background: it.hatched
                ? `repeating-linear-gradient(45deg, ${it.color}, ${it.color} 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)`
                : it.color,
              display: "inline-block",
              border: it.hatched ? "1px dashed rgba(0,0,0,0.55)" : "1px solid rgba(0,0,0,0.35)",
            }}
          />
          <span className="text-[10px]" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function FrontMapScreen({ campaignId, visitedNodes, skin, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const visitedCityIds = [];
  for (const nid of visitedNodes) {
    const cid = NODE_TO_CITY[nid];
    if (cid && !visitedCityIds.includes(cid)) visitedCityIds.push(cid);
  }
  const currentCityId = visitedCityIds[visitedCityIds.length - 1];
  const currentCity = CITIES[currentCityId];
  // Control on this map is shown as of the situation the player is actually
  // looking at, not as of some fixed date — these cities changed hands
  // repeatedly, and a single snapshot would be wrong for most of the war.
  const currentNodeId = visitedNodes[visitedNodes.length - 1];
  const currentNode = currentNodeId ? c.resolveNode(currentNodeId, {}, {}) : null;
  const atDate = dateToYYYYMM(currentNode && currentNode.date);

  // In-world framing per command. The map is a thing a staff officer put on
  // the table, not a progress tracker — so the copy is addressed to the
  // commander reading it, and says what the marks mean in operational
  // terms rather than in terms of nodes, runs, and content.
  const mapVoice = {
    southRussia: {
      heading: "OPERATIONS SECTION — SITUATION AS PLOTTED",
      body:
        "Sketched from telegraph traffic and whatever the rail staff could confirm this morning, sir. Distances are approximate; the line positions are not surveyed and should not be read as such. Marks are drawn to the size of the place, sir — Moscow and Petrograd are what they are, and Perekop is a square because it is a position and not a town. The Don is marked as host country, not a city. Colour is who held it as of this date: our own in blue, the Reds in red, amber where it changed hands too often that month to say. Filled marks are where your orders have already reached; open ones are the war other men are fighting. The track drawn is the track that exists, and runs bright where both ends are within your movements.",
      footer: "The Kuban and the Don are behind you. Everything north of Kharkov is a question of how far the rails hold.",
    },
    siberia: {
      heading: "STAFF SECTION — SITUATION AS PLOTTED",
      body:
        "Compiled from station reports, Supreme Ruler, and they arrive a day late at best. Distances approximate. Marks are sized to the place itself, Supreme Ruler — Omsk against Chita tells you something the old map did not. Colour is who held it as of this date: ours in blue, Red in red, amber where it turned over faster than a report can follow. Filled marks are the points your own command has answered for; open ones are the rest of the war. The line drawn east is the Trans-Siberian itself: one track, every echelon competing for it, bright where both ends lie within your movement.",
      footer: "Everything depends on the single line east. There is no second route and no road worth the name.",
    },
    bolsheviks: {
      heading: "OPERATIONS SECTION — SITUATION AS PLOTTED",
      body:
        "Plotted from front telegrams and rail dispatches, comrade. Distances rough — this is not a survey map and the Republic has no time to make one. Marks are sized to the place, comrade — Moscow and Petrograd carry the weight the Republic actually rests on. Colour is who holds each as of this date: the Republic in red, the Whites in blue, amber where the month is too confused to call. Filled marks are where the Council's own decisions have landed; open ones are the rest of the war, real and ongoing. The track shown is the network as it stands, bright where both ends lie within your operations.",
      footer: "Moscow at the centre, and every front a spoke off it. That is the whole problem of this war in one drawing.",
    },
  }[c.id];

  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold" style={displayFontStyle(skin)}>{c.label}</div>
        <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {mapVoice.heading}
        </div>

        {currentCity && (
          <div
            className="border-2 mt-4 px-3 py-2 text-xs"
            style={{ borderColor: skin.accent, ...monoFontStyle(skin) }}
          >
            <span style={mutedTextStyle(skin)}>PRESENT POSITION OF COMMAND — </span>
            <span className="font-bold" style={accentTextStyle(skin)}>{currentCity.name.toUpperCase()}</span>
            <span style={mutedTextStyle(skin)}>
              {"  ·  "}{visitedCityIds.length} {visitedCityIds.length === 1 ? "position" : "positions"} on the record
            </span>
          </div>
        )}

        <div className="border-2 mt-3" style={{ borderColor: skin.accent }}>
          <SituationMapSvg visitedCityIds={visitedCityIds} currentCityId={currentCityId} skin={skin} atDate={atDate} />
        </div>

        <MapLegendRow campaignId={c.id} skin={skin} />

        <div className="text-xs mt-3 leading-relaxed" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {mapVoice.body}
        </div>
        <div className="text-xs mt-3 leading-relaxed italic" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {mapVoice.footer}
        </div>

        <button onClick={onClose} className="mt-6 w-full border-2 font-bold py-3" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}>
          RETURN TO COMMAND
        </button>
      </div>
    </div>
  );
}

/**
 * Round 23 — the "Context/Key Events timeline" named in the file's own
 * BACKLOG comment as still-missing. Scope, stated plainly: this lists the
 * situations this run has actually passed through, in order, with date and
 * title — a legible record of the sequence, replacing "scroll the front
 * map's marker list and infer it." It does NOT reconstruct and display
 * which literal choice text was clicked at each stop (that would mean
 * matching current flags back against each node's choices' setFlags, which
 * gets genuinely ambiguous once an uncertain roll's own setFlags are mixed
 * in on top of the base choice's) — the date+title sequence is what's
 * actually reliable to show, and is what "timeline" means here.
 */
function TimelineScreen({ campaignId, visitedNodes, flags, meters, skin, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const entries = visitedNodes
    .map((nid) => {
      let node;
      try {
        node = c.resolveNode(nid, flags, meters);
      } catch (e) {
        node = null;
      }
      if (!node) return null;
      return { id: nid, date: node.date, title: node.title, historicalRecord: node.historicalRecord, isEnding: !!node.isEnding };
    })
    .filter(Boolean);
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold" style={displayFontStyle(skin)}>{c.label}</div>
        <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          KEY EVENTS — THIS RUN, IN ORDER
        </div>
        <div className="text-xs mt-2 leading-relaxed" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          Every situation this command has actually been in, in the order it reached them —
          {" "}{entries.length} so far.
        </div>

        <div className="mt-4">
          {entries.map((e, i) => (
            <div key={`${e.id}-${i}`} className="flex gap-3 py-2" style={{ borderBottom: i < entries.length - 1 ? `1px solid ${skin.paperDim}` : "none" }}>
              <div className="flex-shrink-0 w-5 text-right" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin), fontSize: 11 }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
                  {e.date}
                  {e.isEnding && <span style={accentTextStyle(skin)}> · ENDING</span>}
                </div>
                <div className="font-bold" style={displayFontStyle(skin)}>{e.title}</div>
              </div>
              <div className="flex-shrink-0 text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
                {e.historicalRecord ? "◆" : "◇"}
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 w-full border-2 font-bold py-3" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}>
          RETURN TO COMMAND
        </button>
      </div>
    </div>
  );
}

function EndStubScreen({ onClose }) {
  return (
    <div className="bg-black min-h-full text-white">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="border-2 border-dashed border-white/40 p-6 font-mono text-sm">
          DEMO CHAIN ENDS HERE. This branch hasn't reached a written ending yet —
          the node graph runs out before its planned endpoint. Not every path
          through every campaign has a real ending written; check
          ENDINGS_GALLERY for which ones do.
        </div>
        <button onClick={onClose} className="mt-6 w-full border-2 border-white font-mono font-bold py-3">
          RETURN TO RECORDS
        </button>
      </div>
    </div>
  );
}

function EndingScreen({ campaignId, endingId, flags, visitedNodes, instantText, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const ending = c.resolveNode(endingId, flags);
  const isHistorical = ending.classification === "historical";
  const visitedCityIds = [];
  for (const nid of [...visitedNodes, endingId]) {
    const cid = NODE_TO_CITY[nid];
    if (cid && !visitedCityIds.includes(cid)) visitedCityIds.push(cid);
  }
  const finalCityId = NODE_TO_CITY[endingId] || visitedCityIds[visitedCityIds.length - 1];
  // Three endings carry a "DATE VARIES — ..." string rather than a month,
  // because they trigger on an accumulated condition rather than at a fixed
  // point. Those won't parse, and an unparsed date would grey out every
  // marker on the map. Fall back to the last dated node the player actually
  // passed through, which is the correct answer anyway: that IS when this
  // run ended.
  let endingDate = dateToYYYYMM(ending && ending.date);
  if (endingDate == null) {
    for (let i = visitedNodes.length - 1; i >= 0; i--) {
      const n = c.resolveNode(visitedNodes[i], flags, {});
      const d = dateToYYYYMM(n && n.date);
      if (d != null) { endingDate = d; break; }
    }
  }
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-xs tracking-widest" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {ending.date} — ENDING REACHED
        </div>
        <div className="text-3xl font-bold mt-2" style={displayFontStyle(skin)}>{ending.title}</div>
        <div
          className="inline-block text-xs mt-3 px-2 py-1 border-2 font-bold"
          style={{
            ...monoFontStyle(skin),
            ...primaryTextStyle(skin),
            borderColor: isHistorical ? (skin.dark ? skin.paper : skin.ink) : skin.paperDim,
            borderStyle: isHistorical ? "solid" : "dashed",
          }}
        >
          {ending.badge}
        </div>
        {finalCityId && (
          <div className="border-2 mt-5" style={{ borderColor: skin.paperDim }}>
            <SituationMapSvg visitedCityIds={visitedCityIds} currentCityId={finalCityId} skin={skin} compact atDate={endingDate} />
            <div className="text-xs px-3 py-2" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
              WHERE THIS COMMAND'S STORY ENDS: {CITIES[finalCityId]?.name?.toUpperCase()}
            </div>
          </div>
        )}
        <TypewriterText text={ending.epilogue} instant={instantText} className="text-sm mt-5 leading-relaxed whitespace-pre-line" />
        <button onClick={onClose} className="mt-8 w-full font-bold py-3" style={{ ...accentBgStyle(skin), ...displayFontStyle(skin) }}>
          RETURN TO RECORDS
        </button>
      </div>
    </div>
  );
}

function WarRecordScreen({ onClose, onOpenSection, discovery }) {
  const totalNodes = Object.values(CAMPAIGNS).reduce((sum, c) => sum + c.NODE_ATLAS.length, 0);
  const totalEndings = Object.values(CAMPAIGNS).reduce((sum, c) => sum + c.ENDINGS_GALLERY.length, 0);
  // Round 23: counts against the persistent discovery log, not the raw
  // written total — this is what "not what a given save has actually
  // reached" in the file's own BACKLOG note meant. discoveredNodes/Endings
  // is {} until a run has actually been played in this browser.
  const discoveredNodes = Object.values(discovery.nodes || {}).reduce((sum, byId) => sum + Object.keys(byId).length, 0);
  const discoveredEndings = Object.values(discovery.endings || {}).reduce((sum, byId) => sum + Object.keys(byId).length, 0);
  // Same field-dossier shell as the main menu and Settings — this screen is
  // reached directly from the menu and previously sat on stark black, which
  // read as a different application.
  const stampRed = "#8a1f1f";
  const ink = "#1a1712";
  const mono = "'Courier Prime', monospace";
  const rows = [
    { key: "atlas", label: "DISCOVERY ATLAS", detail: `${discoveredNodes} of ${totalNodes} situation reports discovered` },
    { key: "endingsgallery", label: "ENDINGS GALLERY", detail: `${discoveredEndings} of ${totalEndings} named endings reached` },
    { key: "dossiers", label: "COMMAND DOSSIERS", detail: "The advisors, and what became of them" },
    { key: "glossary", label: "GLOSSARY", detail: "Terms & abbreviations" },
    { key: "howtoread", label: "HOW TO READ THE REPORTS", detail: "Badges, meters, and what the odds mean" },
  ];
  return (
    <div style={{ background: "#f2ecdc", minHeight: "100%" }}>
      <TopBar title="dispatches-1922" onClose={onClose} />

      <div style={{ padding: "16px 16px 10px", borderBottom: `2px double ${ink}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9, letterSpacing: 2, color: "#7a6f5c", marginBottom: 8 }}>
          <span>FILE NO. 1922</span>
          <span style={{ color: stampRed }}>WAR RECORD</span>
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 30, color: ink, lineHeight: 1 }}>
          THE WAR RECORD
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px" }}>
        {rows.map((r) => (
          <div
            key={r.key}
            onClick={() => onOpenSection(r.key)}
            style={{
              background: "#e9e1cc",
              border: `1px solid ${ink}`,
              padding: "12px 14px",
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <div style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 16, color: ink }}>
              {r.label}
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "#5c5647", marginTop: 2 }}>
              {r.detail}
            </div>
          </div>
        ))}

        <div
          style={{
            height: 3,
            margin: "14px 0",
            background: `repeating-linear-gradient(90deg, ${stampRed}, ${stampRed} 5px, transparent 5px, transparent 10px)`,
          }}
        />

        <div style={{ fontFamily: mono, fontSize: 10, color: "#6b6252", lineHeight: 1.55 }}>
          Round 22: a RESUME COMMAND now saves your last run (one slot, this browser only —
          not multiple save slots), and the OBJECTIVES panel on every situation report restates
          the campaign's own thesis and terminus in plain language. Round 23: the atlas and
          endings gallery below now track what THIS browser has actually discovered, across
          every run you've played here — not just the run in progress, and not everything
          ever written. Still local to this browser only: the discovery log lives in the same
          storage as the save, so a different device or a cleared browser starts it over.
        </div>
      </div>
    </div>
  );
}

function DiscoveryAtlasScreen({ onClose, discovery }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>Discovery Atlas</div>
        {Object.values(CAMPAIGNS).map((c) => {
          const skin = skinFor(c.id);
          const found = discovery.nodes[c.id] || {};
          const foundCount = c.NODE_ATLAS.filter((n) => found[n.id]).length;
          return (
            <div key={c.id} className="mb-6">
              <div className="inline-block border-2 font-bold px-3 py-1 text-sm mb-2" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
                {c.shortTag}
              </div>
              <div className="font-mono text-xs text-stone-500 mb-2">{foundCount} OF {c.NODE_ATLAS.length} SITUATION REPORTS DISCOVERED</div>
              {c.NODE_ATLAS.map((n) => {
                const isFound = !!found[n.id];
                return (
                  <div key={n.id} className="border-b border-stone-300 py-2 flex items-center justify-between" style={{ opacity: isFound ? 1 : 0.45 }}>
                    <div>
                      <div className="font-mono text-xs text-stone-500">{isFound ? n.date : "UNDATED"}</div>
                      <div className="font-bold" style={{ fontFamily: BODY_FONT }}>{isFound ? n.title : "Not yet reached"}</div>
                    </div>
                    <div className="font-mono text-xs text-stone-500 flex-shrink-0 pl-2">{isFound ? "●" : "○"}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EndingsGalleryScreen({ onClose, discovery }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>Endings Gallery</div>
        {Object.values(CAMPAIGNS).map((c) => {
          const skin = skinFor(c.id);
          const found = discovery.endings[c.id] || {};
          const foundCount = c.ENDINGS_GALLERY.filter((e) => found[e.id]).length;
          return (
            <div key={c.id} className="mb-6">
              <div className="inline-block border-2 font-bold px-3 py-1 text-sm mb-2" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
                {c.shortTag}
              </div>
              <div className="font-mono text-xs text-stone-500 mb-2">{foundCount} OF {c.ENDINGS_GALLERY.length} ENDINGS REACHED</div>
              {c.ENDINGS_GALLERY.map((e) => {
                const isFound = !!found[e.id];
                return (
                  <div key={e.id} className="border-b border-stone-300 py-2 flex items-center justify-between" style={{ opacity: isFound ? 1 : 0.45 }}>
                    <div className="font-bold" style={{ fontFamily: BODY_FONT }}>{isFound ? e.title : "Not yet reached"}</div>
                    <div className="font-mono text-xs text-stone-500 flex-shrink-0 pl-2">
                      {isFound ? (e.classification === "historical" ? "◆ HISTORICAL" : "◇ SPECULATIVE") : "○"}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GlossaryScreen({ onClose }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-1" style={{ fontFamily: BODY_FONT }}>Glossary</div>
        <div className="font-mono text-xs text-stone-500 mb-6 leading-relaxed">
          Terms used elsewhere in this game, alphabetical, shared across all three campaigns rather than sorted by side — the vocabulary here mostly doesn't respect which command you're playing.
        </div>
        {GLOSSARY.map((g, i) => (
          <div key={i} className="border-b border-stone-300 py-3">
            <div className="font-bold text-sm tracking-wide" style={{ fontFamily: BODY_FONT }}>{g.term}</div>
            <div className="font-mono text-xs text-stone-600 mt-1 leading-relaxed">{g.definition}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandDossiersScreen({ onClose }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>Command Dossiers</div>
        {Object.values(CAMPAIGNS).map((c) => {
          const skin = skinFor(c.id);
          const advisors = Object.values(c.ADVISOR_DOSSIERS).sort((a, b) => a.rank - b.rank);
          return (
            <div key={c.id} className="mb-6">
              <div className="inline-block border-2 font-bold px-3 py-1 text-sm mb-2" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
                {c.shortTag}
              </div>
              {advisors.map((a, i) => (
                <div key={i} className="border-b border-stone-300 py-3">
                  <div className="font-bold" style={{ fontFamily: BODY_FONT }}>{a.role}</div>
                  <div className="font-mono text-xs text-stone-600 mt-1">{a.bio}</div>
                  <div className="font-mono text-xs text-stone-500 mt-2 italic">{a.fate}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsScreen({ textSize, setTextSize, reduceMotion, setReduceMotion, instantText, setInstantText, soundOn, setSoundOn, musicOn, setMusicOn, onClose }) {
  // Matches the main menu's field-dossier treatment: cream stock, stamp-red
  // section rules, Courier for labels, Playfair for the header. Deliberately
  // NOT a campaign skin — Settings sits outside any campaign, same as the
  // main menu it's reached from.
  const stampRed = "#8a1f1f";
  const ink = "#1a1712";
  const mono = "'Courier Prime', monospace";

  function Row({ label, value, onClick, note, live }) {
    return (
      <div
        style={{
          background: "#e9e1cc",
          border: `1px solid ${ink}`,
          padding: "10px 12px",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: ink, flex: 1 }}>
            {label}
          </div>
          <button
            onClick={onClick}
            style={{
              border: `1px solid ${ink}`,
              background: value === "ON" || (value && value !== "OFF") ? stampRed : "transparent",
              color: value === "ON" || (value && value !== "OFF") ? "#f2ecdc" : ink,
              fontFamily: mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              padding: "5px 12px",
              flexShrink: 0,
              minWidth: 74,
              cursor: "pointer",
            }}
          >
            {value}
          </button>
        </div>
        {note && (
          <div style={{ fontFamily: mono, fontSize: 10, color: "#6b6252", marginTop: 6, lineHeight: 1.45 }}>
            {!live && (
              <span style={{ color: stampRed, fontWeight: 700 }}>NOT YET WIRED — </span>
            )}
            {note}
          </div>
        )}
      </div>
    );
  }

  function SectionRule({ children }) {
    return (
      <div style={{ marginTop: 18, marginBottom: 8 }}>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700 }}>
          {children}
        </div>
        <div
          style={{
            height: 3,
            marginTop: 4,
            background: `repeating-linear-gradient(90deg, ${stampRed}, ${stampRed} 5px, transparent 5px, transparent 10px)`,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ background: "#f2ecdc", minHeight: "100%" }}>
      <TopBar title="dispatches-1922" onClose={onClose} />

      <div style={{ padding: "16px 16px 10px", borderBottom: `2px double ${ink}` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: 2,
            color: "#7a6f5c",
            marginBottom: 8,
          }}
        >
          <span>FILE NO. 1922</span>
          <span style={{ color: stampRed }}>STAFF USE</span>
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 30, color: ink, lineHeight: 1 }}>
          SETTINGS
        </div>
      </div>

      <div style={{ padding: "4px 16px 32px" }}>
        <SectionRule>READING</SectionRule>
        <Row
          label="TEXT SIZE"
          value={textSize.toUpperCase()}
          onClick={() => setTextSize((v) => (v === "small" ? "normal" : v === "normal" ? "large" : "small"))}
          live
          note="Rescales the whole application, not just situation text."
        />
        <Row
          label="INSTANT TEXT"
          value={instantText ? "ON" : "OFF"}
          onClick={() => setInstantText((v) => !v)}
          live
          note="Skips the word-by-word reveal on situation and ending text."
        />

        <SectionRule>PRESENTATION</SectionRule>
        <Row
          label="REDUCE MOTION"
          value={reduceMotion ? "ON" : "OFF"}
          onClick={() => setReduceMotion((v) => !v)}
          live
          note="Drops the stamp-tilt transform on dispatch headers and transitions."
        />

        <SectionRule>AUDIO</SectionRule>
        <Row
          label="SOUND EFFECTS"
          value={soundOn ? "ON" : "OFF"}
          onClick={() => setSoundOn((v) => !v)}
          note="Toggle is real and its state persists, but this build ships no audio assets — typewriter, stamp, and dice sounds do not exist yet."
        />
        <Row
          label="MUSIC"
          value={musicOn ? "ON" : "OFF"}
          onClick={() => setMusicOn((v) => !v)}
          note="Same — the switch works, there is nothing behind it."
        />

        <div
          style={{
            marginTop: 22,
            borderTop: `1px solid ${ink}`,
            paddingTop: 10,
            fontFamily: mono,
            fontSize: 10,
            color: "#6b6252",
            lineHeight: 1.55,
          }}
        >
          Every setting above that is not marked otherwise is fully wired. The two audio
          toggles are marked because they are not — they are honest switches attached to
          nothing, kept visible rather than hidden so the gap is legible rather than
          disguised.
        </div>
      </div>
    </div>
  );
}

function HowToReadScreen({ onClose }) {
  const items = [
    ["◆ HISTORICAL RECORD", "This is the choice that was actually made. Its triangle impact is always zero — it's the baseline everything else is measured against, not a reward for picking it."],
    ["◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE", "A genuine counterfactual, argued from the same evidence as the historical choice, not an invented alternative. Its impact shows how it diverges from what actually happened."],
    ["⚠ CONTESTED — odds shown", "Real historiographical uncertainty, not a random skin on a settled fact. Odds are shown before you choose — known-risk, not a hidden roll."],
    ["Triangle meters (±10, start at 0)", "Zero is the historical baseline for that campaign's three axes. Plus or minus tracks divergence from the record, not an absolute strength score."],
    ["Hard mode meter", "A campaign-specific erosion track, not part of the zero-baseline system. Rises when a subordinate's judgment gets overridden by central authority; at 100 the campaign ends in something other than battlefield defeat."],
  ];
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>How to Read the Reports</div>
        {items.map(([label, body], i) => (
          <div key={i} className="border-b border-stone-300 py-3">
            <div className="font-mono text-sm font-bold">{label}</div>
            <div className="font-mono text-xs text-stone-600 mt-1">{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Save / resume — added round 22. Previously flagged as a real gap (see the
// header note and WarRecordScreen's own text, both now stale and updated
// alongside this). Single slot, "your last run" — not save slots, not
// autosave-every-screen. Persisted only at the two screens whose full
// content is reconstructable from {campaignId, nodeId, flags, meters} alone
// (briefing, bulletin) so a resume never has to fake transient text (an
// outcome screen's resolved roll text, for instance, isn't saved and isn't
// meant to be — resuming mid-outcome would need to re-derive a dice roll
// that already happened, which is exactly the kind of save-schema trap the
// header note's 1940 reference warns about). Wrapped in try/catch per this
// environment's localStorage guidance — a viewer in private browsing, or
// with storage blocked, should never see play break because of this.
const SAVE_KEY = "dispatches1922_save_v1";
const SAVE_SCHEMA_VERSION = 1;

// Old node id -> new node id. Add an entry whenever a node is renamed, so saves made before the rename still
// resume (see docs/SAVES.md). Empty today: no node has been renamed since the schema version was introduced.
const NODE_ALIASES = {};
// SAVE_MIGRATIONS[n] upgrades a save from schema version n to n + 1. Add one whenever SAVE_SCHEMA_VERSION is
// bumped, so an update upgrades players' saves instead of wiping them. A save with no way forward is discarded.
const SAVE_MIGRATIONS = {};
const aliasNode = (id) => (typeof id === "string" && Object.prototype.hasOwnProperty.call(NODE_ALIASES, id) ? NODE_ALIASES[id] : id);

/** Upgrades a parsed save to the current schema and applies node aliases. Returns null if it cannot be used. */
function migrateSave(saved) {
  if (!saved || typeof saved !== "object") return null;
  let version = saved.schemaVersion;
  if (!Number.isInteger(version) || version < 1 || version > SAVE_SCHEMA_VERSION) return null; // unknown, or from a newer build
  let s = saved;
  while (version < SAVE_SCHEMA_VERSION) {
    const step = SAVE_MIGRATIONS[version];
    if (!step) return null;
    s = step(s);
    version += 1;
    if (!s || typeof s !== "object") return null;
    s.schemaVersion = version;
  }
  if (Object.keys(NODE_ALIASES).length) {
    s = { ...s, nodeId: aliasNode(s.nodeId) };
    if (Array.isArray(s.visitedNodes)) s.visitedNodes = s.visitedNodes.map(aliasNode);
  }
  return s;
}

function readSave() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = migrateSave(JSON.parse(raw));
    if (!parsed || parsed.schemaVersion !== SAVE_SCHEMA_VERSION) return null;
    if (!parsed.campaignId || !CAMPAIGNS[parsed.campaignId]) return null;
    if (!parsed.nodeId || !parsed.meters || !parsed.flags || !Array.isArray(parsed.visitedNodes)) return null;
    // Defensive: a save pointing at a node id that no longer exists (content
    // edited out from under an old save) should be discarded, not crash the
    // resume.
    try {
      const node = CAMPAIGNS[parsed.campaignId].resolveNode(parsed.nodeId, parsed.flags, parsed.meters);
      if (!node) return null;
    } catch (e) {
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeSave(snapshot) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, ...snapshot }));
  } catch (e) {
    // best-effort only — quota exceeded, storage disabled, private window.
    // Never blocks play.
  }
}

function clearSave() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    // best-effort
  }
}

// Round 23: a persistent discovery log, separate from the single-slot save
// above. The save is cleared the moment a run ends (see clearSave() calls
// in handleContinueFromOutcome) — that's correct for "resume where you left
// off," but it means nothing survives a completed run to answer "what has
// this player actually found," which is exactly what WarRecordScreen's
// atlas/endings-gallery counts were silently promising and not delivering
// (they showed everything ever WRITTEN, not anything about a given
// player). This key accumulates across every run, every campaign, forever
// — an unlock log, not a resumable state — and is never cleared by
// clearSave().
const DISCOVERY_KEY = "dispatches1922_discovered_v1";
const DISCOVERY_SCHEMA_VERSION = 1;

function readDiscovery() {
  const empty = { schemaVersion: DISCOVERY_SCHEMA_VERSION, nodes: {}, endings: {} };
  try {
    const raw = window.localStorage.getItem(DISCOVERY_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== DISCOVERY_SCHEMA_VERSION) return empty;
    return {
      schemaVersion: DISCOVERY_SCHEMA_VERSION,
      nodes: parsed.nodes && typeof parsed.nodes === "object" ? parsed.nodes : {},
      endings: parsed.endings && typeof parsed.endings === "object" ? parsed.endings : {},
    };
  } catch (e) {
    return empty;
  }
}

/** Marks one id discovered under `kind` ("nodes" | "endings") for a campaign
 * and persists it. Returns the updated log (or null on a storage failure —
 * best-effort, never blocks play), so callers can setDiscovery(result)
 * directly instead of re-reading storage. */
function addDiscovered(current, campaignId, kind, id) {
  if (!id) return current;
  const already = current[kind][campaignId] && current[kind][campaignId][id];
  if (already) return current;
  const next = {
    ...current,
    [kind]: {
      ...current[kind],
      [campaignId]: { ...(current[kind][campaignId] || {}), [id]: true },
    },
  };
  try {
    window.localStorage.setItem(DISCOVERY_KEY, JSON.stringify(next));
  } catch (e) {
    // best-effort only — the in-memory state below still updates for this
    // session even if persistence fails.
  }
  return next;
}

export function App() {
  const [screen, setScreen] = useState("records");
  const [campaignId, setCampaignId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [resolvedText, setResolvedText] = useState("");
  const [resolvedAftermath, setResolvedAftermath] = useState("");
  // Explicit deltas from the choice just made, so the Outcome screen can
  // state plainly what changed (or that nothing did) instead of relying on
  // the player to notice a bar shifting by 1-2 points out of a ±10 range —
  // "historical = zero impact" is correct by design, but looks identical to
  // a broken meter if nothing on screen says so directly.
  const [lastDeltas, setLastDeltas] = useState({ triangle: {} });
  // Every node id this run has actually passed through, in order — feeds the
  // front map. Reset on campaign start, appended to every time a real
  // (non-ending) node is reached.
  const [visitedNodes, setVisitedNodes] = useState([]);
  // Settings — persist for the session only, deliberately NOT part of the
  // save/resume snapshot below (round 22): these are viewer display
  // preferences, not run state, and bundling them into a run save would mean
  // resuming a saved game could silently change how the CURRENT session's
  // settings look. textSize and reduceMotion are fully wired
  // (root font-size scale; stamp-tilt/rotation transforms skipped).
  // instantText is wired into TypewriterText below. sound and music are
  // real, visible toggles with no audio assets behind them yet — scaffolded
  // honestly, not faked as functional.
  const [textSize, setTextSize] = useState("normal"); // 'small' | 'normal' | 'large'
  const [reduceMotion, setReduceMotion] = useState(false);
  const [instantText, setInstantText] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [meters, setMeters] = useState(null);
  const [hardModeValue, setHardModeValue] = useState(0);
  const [hardModeMaxed, setHardModeMaxed] = useState(false);
  // Hard mode is opt-in, off by default — selected per campaign on
  // WarRoomScreen, not a background process that runs during every regular
  // playthrough regardless of whether the player chose it.
  const [hardModeEnabled, setHardModeEnabled] = useState(false);
  // Accumulated flags from every choice made this run, keyed by whatever
  // name each node's setFlags object uses. Every choice in every campaign
  // has defined setFlags since the first node was written — the engine
  // never actually collected them into anything until now, so nothing that
  // referenced "does the player's earlier choice matter here" could
  // actually check that. This is what makes ending variance possible.
  const [flags, setFlagsState] = useState({});
  // Lazily read once on mount — a save written by a previous visit to this
  // page (same browser, same artifact origin). null if none, malformed, or
  // storage unavailable; readSave() never throws.
  const [savedRun, setSavedRun] = useState(() => readSave());
  // Round 23: persistent discovery log — see addDiscovered()'s comment.
  // Never reset by handleStart or cleared by clearSave(); only ever grows.
  const [discovery, setDiscovery] = useState(() => readDiscovery());

  // Persist only from the two fully-reconstructable screens (see the save
  // helpers' comment above). Runs after every render where one of these
  // values actually changed, so it stays current without a dedicated write
  // call at every setter site.
  useEffect(() => {
    if (!campaignId || !nodeId || !meters || (screen !== "briefing" && screen !== "bulletin")) return;
    writeSave({
      campaignId,
      nodeId,
      meters,
      flags,
      visitedNodes,
      hardModeValue,
      hardModeMaxed,
      hardModeEnabled,
      screen,
      savedAt: Date.now(),
    });
    // Not tracked in savedRun state here — that state is only what the
    // RESUME banner reads, and it's refreshed explicitly on return to the
    // records screen (toRecords) rather than on every single write, which
    // would re-render the menu constantly for no visible reason while a
    // run is in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, nodeId, meters, flags, visitedNodes, hardModeValue, hardModeMaxed, hardModeEnabled, screen]);

  function handleResume() {
    const save = readSave();
    if (!save) { setSavedRun(null); return; }
    setCampaignId(save.campaignId);
    setNodeId(save.nodeId);
    setMeters(save.meters);
    setFlagsState(save.flags);
    setVisitedNodes(save.visitedNodes);
    setHardModeValue(save.hardModeValue || 0);
    setHardModeMaxed(!!save.hardModeMaxed);
    setHardModeEnabled(!!save.hardModeEnabled);
    setScreen(save.screen === "bulletin" ? "bulletin" : "briefing");
    // Backfill discovery for a save written before this log existed, or any
    // node the save/discovery writes otherwise missed — cheap, idempotent
    // (addDiscovered no-ops on an id already marked), and means resuming an
    // old save doesn't silently understate what this player has found.
    setDiscovery((prev) => {
      let next = prev;
      for (const nid of save.visitedNodes) next = addDiscovered(next, save.campaignId, "nodes", nid);
      return next;
    });
  }

  function toRecords() {
    // Refresh the resume banner's own state against what's actually on
    // disk — a run that just reached an ending clears its save (below) and
    // the banner should disappear the moment the player is back at the menu.
    setSavedRun(readSave());
    setScreen("records");
    setCampaignId(null);
  }

  function handleStart(id) {
    const c = CAMPAIGNS[id];
    setCampaignId(id);
    setMeters({ ...c.initialMeters });
    setHardModeValue(0); // capital spent so far — 0 means all 5 points available
    setHardModeMaxed(false);
    setFlagsState({});
    setVisitedNodes([c.start]);
    setNodeId(c.start);
    setScreen("briefing");
    setDiscovery((prev) => addDiscovered(prev, id, "nodes", c.start));
  }

  function handleChoose(choice, node) {
    // Defensive: the UI already hides the order button for a gated choice,
    // but if this ever gets called for one anyway, refuse rather than
    // silently apply an order the player wasn't actually shown as available.
    if (typeof choice.gate === "function" && !choice.gate(meters)) return;
    const c = CAMPAIGNS[campaignId];
    // All the arithmetic (roll, impact, clamp, capital, destination) lives in logic.ts.
    const res = resolveChoice({
      choice,
      meters,
      campaign: c,
      hardModeEnabled,
      hardModeValue,
      rand: Math.random,
      helpers: { applyImpact, clampTriangle },
    });
    // Explicit deltas (post-clamp) so the Outcome screen can say plainly what changed.
    setLastDeltas({ triangle: res.triangleDeltas });
    setMeters(res.meters);
    setHardModeValue(res.hardModeValue);
    setHardModeMaxed(res.hardModeMaxed);
    setFlagsState((prev) => ({ ...prev, ...res.newFlags }));
    const destination = res.destination;
    if (destination && destination !== "END_STUB") {
      setVisitedNodes((prev) => (prev.includes(destination) ? prev : [...prev, destination]));
      // `destination` can itself be an ending id; res.discoveryKind classifies it so an ending
      // reached this way still lands in the endings half of the discovery log.
      setDiscovery((prev) => addDiscovered(prev, campaignId, res.discoveryKind, destination));
    }
    setResolvedText(res.text);
    setResolvedAftermath(res.aftermath);
    setScreen("outcome");
    setNodeId(destination);
  }

  function handleContinueFromOutcome() {
    const c = CAMPAIGNS[campaignId];
    const next = afterOutcome({ campaign: c, nodeId, flags, meters, hardModeMaxed });
    if (next.screen === "ending") {
      if (next.hardCollapse) {
        // Hard-mode collapse takes priority over whatever node was actually next.
        setNodeId(next.endingId);
        setDiscovery((prev) => addDiscovered(prev, campaignId, "endings", next.endingId));
      }
      setScreen("ending");
      clearSave(); // run is over — nothing left to resume
    } else if (next.screen === "end") {
      setScreen("end");
      clearSave(); // demo chain ends here — same "run is over" case
    } else {
      setScreen(next.screen);
    }
  }

  function handleContinueFromBulletin() {
    setScreen("briefing");
  }

  return (
    <div className="w-full h-full min-h-screen font-sans" style={{ maxWidth: 600, margin: "0 auto", overflowX: "hidden" }}>
      <FontImports />
      <TextScaleStyle textSize={textSize} />
      {screen === "records" && (
        <RecordsListScreen
          onOpen={(id) => { setCampaignId(id); setHardModeEnabled(false); setScreen("detail"); }}
          onOpenWarRecord={() => setScreen("warrecord")}
          onOpenSettings={() => setScreen("settings")}
          savedRun={savedRun}
          onResume={handleResume}
        />
      )}
      {screen === "warrecord" && (
        <WarRecordScreen onClose={toRecords} onOpenSection={setScreen} discovery={discovery} />
      )}
      {screen === "atlas" && <DiscoveryAtlasScreen onClose={() => setScreen("warrecord")} discovery={discovery} />}
      {screen === "endingsgallery" && <EndingsGalleryScreen onClose={() => setScreen("warrecord")} discovery={discovery} />}
      {screen === "dossiers" && <CommandDossiersScreen onClose={() => setScreen("warrecord")} />}
      {screen === "glossary" && <GlossaryScreen onClose={() => setScreen("warrecord")} />}
      {screen === "settings" && (
        <SettingsScreen
          textSize={textSize}
          setTextSize={setTextSize}
          reduceMotion={reduceMotion}
          setReduceMotion={setReduceMotion}
          instantText={instantText}
          setInstantText={setInstantText}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          onClose={() => setScreen("records")}
        />
      )}
      {screen === "howtoread" && <HowToReadScreen onClose={() => setScreen("warrecord")} />}
      {screen === "detail" && (
        <CampaignDetailScreen
          campaignId={campaignId}
          onEnter={(id, hardMode) => { setHardModeEnabled(hardMode); setScreen("warroom"); }}
          onClose={toRecords}
        />
      )}
      {screen === "warroom" && (
        <WarRoomScreen
          campaignId={campaignId}
          hardModeEnabled={hardModeEnabled}
          onClose={toRecords}
          onStart={handleStart}
        />
      )}
      {screen === "bulletin" && meters && (
        <BulletinScreen
          campaignId={campaignId}
          nodeId={nodeId}
          flags={flags}
          meters={meters}
          onContinue={handleContinueFromBulletin}
        />
      )}
      {screen === "briefing" && meters && (
        <BriefingScreen
          campaignId={campaignId}
          nodeId={nodeId}
          meters={meters}
          flags={flags}
          hardModeEnabled={hardModeEnabled}
          hardModeValue={hardModeValue}
          instantText={instantText}
          reduceMotion={reduceMotion}
          onChoose={handleChoose}
          onClose={toRecords}
          onOpenMap={() => setScreen("map")}
          onOpenTimeline={() => setScreen("timeline")}
        />
      )}
      {screen === "map" && (
        <FrontMapScreen
          campaignId={campaignId}
          visitedNodes={visitedNodes}
          skin={skinFor(campaignId)}
          onClose={() => setScreen("briefing")}
        />
      )}
      {screen === "timeline" && (
        <TimelineScreen
          campaignId={campaignId}
          visitedNodes={visitedNodes}
          flags={flags}
          meters={meters}
          skin={skinFor(campaignId)}
          onClose={() => setScreen("briefing")}
        />
      )}
      {screen === "outcome" && (
        <OutcomeScreen
          campaignId={campaignId}
          resolvedText={resolvedText}
          aftermath={resolvedAftermath}
          meters={meters}
          hardModeValue={hardModeValue}
          hardModeMaxed={hardModeMaxed}
          hardModeEnabled={hardModeEnabled}
          deltas={lastDeltas}
          onContinue={handleContinueFromOutcome}
          onClose={toRecords}
        />
      )}
      {screen === "ending" && (
        <EndingScreen campaignId={campaignId} endingId={nodeId} flags={flags} visitedNodes={visitedNodes} instantText={instantText} onClose={toRecords} />
      )}
      {screen === "end" && <EndStubScreen onClose={toRecords} />}
    </div>
  );
}

export default App;
