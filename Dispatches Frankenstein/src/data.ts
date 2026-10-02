import type { GameNode, NewspaperEvent, Ending, GameState, Temperament } from "./types";

/**
 * ROUTING FIX (vs. original jam spec):
 * Original order 1-2-3-4-5-6-7 had Node 5 (the voltage fork) already
 * hard-routing straight to 8A/8B, so nothing ever pointed at Node 6 or
 * Node 7 — orphaning the entire Prometheus branch (8C-15C, endings 3A/3B)
 * and making two of the three fork gates dead code.
 *
 * Fixed order: 1 -> 2 -> 3 -> 4 -> 6 -> 7 -> 5 -> {8A | 8B | 8C}
 * Node 5 keeps its role as the actual branch-decision node (its two
 * non-roll options are what send the player to Branch A or B — their
 * labels used to spell that out in dev notation, now left implicit in the
 * "detail" text instead), Node 6's gated option is
 * the early hard-overwrite into Branch C, Node 7 feeds forward into 5
 * instead of hard-locking to 8A.
 *
 * GATE FIX: all three fork thresholds (+5) were mathematically
 * unreachable given the stamps on the nodes preceding them (verified by
 * scripts/validate.ts, not by hand). Thresholds below were set to the
 * measured achievable maximum minus one point of slack, so more than one
 * stat-build can unlock them without being trivial.
 *
 * MONEY (Thaler): moneyCost is only enforced in Hard mode. Every node that
 * has a money-gated option also keeps at least one option with no money
 * cost, so Hard mode can never fully lock a player out at a node —
 * verified by scripts/validate.ts. A handful of options also carry
 * moneyDelta (Hard only): node 3's "Pawn a Case of Surplus Instruments"
 * and node 9C's "License the rival a minor footnote" each grant +20. All
 * costs/income run 10x the original design (STARTING_MONEY 50, not 5) for
 * finer-grained numbers — the relative economy is unchanged. This exists
 * because the common Act I costs (nodes 1, 4, 6) already spend the entire
 * 50-Thaler starting purse, and Branch C alone then asks for 50 more (8C,
 * 10C, 13C) — without income, half of Branch C's costed options were
 * mathematically unaffordable in the same run. The two income options
 * don't close that gap entirely; they turn "impossible" into "a real
 * trade-off; skip one of the early secrecy/voltage options to afford the
 * later ones."
 *
 * ROLLS: a handful of pivotal options are "experiments" with a stated
 * success chance. Most still route success/failure to the same nextNodeId
 * (only stamps/flags/outcome text differ). Six of them — node 5's and node
 * 7's gated array/hybridization rolls, plus one per lettered branch (10A,
 * 9B, 11C) — give SUCCESS its own nextNodeId into a divergence node (a
 * "-X"/"-SURGE"/"-HYBRID" variant of the node that would otherwise follow)
 * that acknowledges the win in its text before reconverging one node later
 * at the same place failure would have landed. This gives the gamble an
 * immediate, visible payoff instead of only a flag an ending variant might
 * reference much later. The validator forks its DFS on both branches of
 * every roll and resolves each branch's own nextNodeId when present.
 *
 * SETTING: the game is set in and beneath Wolfsberg Castle, a half-ruined
 * fortress the University of Ingolstadt inherited generations ago and never
 * fully knew what to do with. Its east wing still houses overflow student
 * lodgings, a lecture hall, and a small chapel pressed into service as a
 * reading room — ordinary university life, a short walk down a cold
 * corridor from everything Victor is building. His own work is confined to
 * the disused west tower, granted to him almost as an afterthought.
 *
 * CALLBACKS: a few options are gated on requiresFlag rather than a resource
 * threshold — Node 1C sets executedOrigin (unlocks an option at 8A), Node 4A
 * sets waldmanDebt (unlocks an option at 12C), and Node 6B sets
 * constructSighted (unlocks an option at 12B). Each of the three now routes
 * to its own divergence node (9A-PAID, 13C-CLEARED, 13B-COVER) rather than
 * reusing the node it would otherwise reach, so the callback changes what
 * the player is shown next, not only a line of dialogue — verified by the
 * validator forking on both branches of every requiresFlag exactly as it
 * already does for gates.
 *
 * BRANCHING: nodes 1-4 and 7 previously routed every option to the same
 * next node regardless of choice — cosmetic-only branching. Node 1's
 * darkest option (Raid the Executioner's Scaffold) now also diverges to
 * "2-DARK", a variant of node 2 that carries the consequence forward one
 * more beat before reconverging at node 3. Combined with the six roll
 * divergences and three upgraded callbacks above, the graph now has ten
 * points where a choice determines which node — not just which stamps —
 * comes next, versus the two it had before (node 6's branch-C skip and
 * node 5's branch-A/B split).
 *
 * CASTLE FLAVOR: node 4's "Bar the West Tower Stair" option diverges to
 * "6-TOWER" (same three options as node 6, reworded around the barred
 * door), and its own "release a construct" option — along with node 6's
 * original copy of the same option — now routes to "7-BATTLEMENTS" (same
 * as node 7, reworded around the battlements sighting) instead of "7".
 * Flavor-only, per Craig: no new tracked resource, same stamps/rolls as
 * the nodes they mirror. One exception: 6-TOWER's shadow-committee option
 * dropped the secrecy>=3 gate node 6's copy has — defying the inspection
 * already costs -3 secrecy to reach this node, so that threshold was
 * mathematically unreachable here (caught by the validator, not by eye).
 *
 * RETURNING PLAYERS: once a run has ended at least once (tracked via
 * localStorage, not in GameState), the Chapter Card offers "Skip to the
 * Laboratory," which jumps straight to node 5 — the first node whose
 * choice actually forks the story — bypassing the non-branching Act I
 * nodes on a repeat playthrough. It starts resources at dead center (0/0/0)
 * rather than wherever a real Act I run would have left them, refills a Hard
 * run's purse to STARTING_MONEY rather than whatever Act I's costed options
 * would have left it at, and forfeits the three requiresFlag callbacks,
 * since those flags are only ever set in the nodes being skipped. All three
 * trade-offs are disclosed in the button's own copy and in HOW_TO_PLAY.
 */

export const PROLOGUE_TEXT = [
  "Ingolstadt, 1818.",
  "Your mother died of a fever no physician in Geneva could name, let alone cure, when you were eleven years old. You remember, with total clarity, the specific uselessness of every book in your father's library that week — none of them had an answer, only postures of grief dressed up as medicine. You have spent thirteen years since then deciding that death is not a mystery to be mourned but a mechanical failure to be corrected, and the university's lecture halls, for all their Latin and their caution, have taught you nothing that changes your mind.",
  "You have told your family you are pursuing your studies. This much, at least, is true. What you have not told them is what those studies have become — three years of anatomy the faculty considers indecent, galvanic theory Professor Krempe forbade you to continue in his own lecture theatre, and the disused west tower of Wolfsberg Castle, granted to you for “independent study” by a Rector who has never once climbed the stairs to check on it.",
  "Fritz waits for you there most nights already. He is a scholarship student two years below you, the son of a gravedigger's assistant from a village outside Munich, and he owes his place at the university — tuition, board, the coat on his back — entirely to a debt you quietly settled on his behalf in his first term. He has never asked why you did it. He has also never once, in eighteen months, refused you anything, which is either the most loyal thing you have ever been given or the most dangerous, and you have not yet decided which.",
  "Tonight, the storm finally comes.",
];

export const CHAPTER_CARD = {
  title: "To the Castle",
  subtitle: "Chapter One",
};

export const HOW_TO_PLAY: { heading: string; body: string }[] = [
  {
    heading: "The Logistical Triangle",
    body: "Every decision moves one or more of three resources — Voltage, Biomass, and Secrecy — each held between -10 and +10. Drive any of them to -10 and the work collapses outright, ending the campaign in failure regardless of where you stood in the story.",
  },
  {
    heading: "Locked Options",
    body: "Some choices require a resource to already sit at or above a threshold before they can be taken — shown as \"REQUIRES [RESOURCE] ≥ [N]\" on the option itself, on every difficulty, whether or not you can currently see the numbers your other choices move. A few others unlock only after a specific earlier choice; those show a hint about what unlocks them instead of a threshold. Every node keeps at least one option that's never locked, so you're never fully shut out of continuing — you may just be choosing between fewer things.",
  },
  {
    heading: "Fritz",
    body: "Fritz can help twice, in two different ways. On Medium or Hard, you may ask his advice up to three times per run — each use reveals that node's resource preview on demand, the same one Easy shows automatically. Separately, once per run on any difficulty, you may call in Fritz's Favor: a resource of your choice improved at the behest of a patron Fritz won't name, always at some cost elsewhere — voltage or biomass cost secrecy, and secrecy itself costs a little of the other two instead. Both are optional, and neither can be undone.",
  },
  {
    heading: "Difficulty",
    body: "Easy shows exactly how each choice will move the Triangle before you commit. Medium hides that preview, so you're judging choices by their description and consequence rather than their arithmetic — three uses of Fritz's advice are all you get to see the numbers directly. Hard hides it too, and adds a fifth resource: fifty Thaler, spent on certain choices that require paying for materials, bribes, or silence, and shown as a \"COST\" badge on the option. A very small number of choices instead pay Thaler back — nowhere near enough to cover every costed option in one run, so on Hard, spending early on one branch's costs can leave you unable to afford another branch's later ones. That's deliberate: it's a real trade-off, not a trap, since every node still keeps a free option regardless.",
  },
  {
    heading: "Experiments",
    body: "A handful of pivotal choices are framed as experiments rather than certainties — you'll be told the odds before committing, and the result is decided by a roll against that percentage. Most experiments only change the cost of what happens next; a few of the bigger ones also change what happens next, sending a clean success down a path a failure (or a safer option) never sees.",
  },
  {
    heading: "Returning to the Laboratory",
    body: "After you've reached any ending once, the Chapter Card offers a second way in: \"Skip to the Laboratory,\" which jumps straight past Act I's non-branching opening to the first choice that actually decides your track. It resets your resources to zero, refills a Hard run's purse to its full starting sum, and forfeits the handful of options that only unlock from an early-game choice — a faster way back in, at the cost of a clean slate.",
  },
  {
    heading: "The Newspaper",
    body: "Ingolstadt keeps its own record of your work. Lore and chapter-transition articles appear at fixed points in the story; crisis bulletins appear automatically whenever a resource drops to -7 or below, warning you before it's too late to change course.",
  },
  {
    heading: "Endings",
    body: "The campaign resolves into one of twelve endings: nine narrative conclusions, three apiece across the Alchemical, Galvanic, and Prometheus tracks, and three collapse endings reserved for whichever resource you drive to ruin.",
  },
  {
    heading: "Sending for Fritz",
    body: "Fritz waits outside each node rather than hovering over your shoulder — \"Send for Fritz\" calls him in. Once he's there, Advice and Favor work as described above, and Gossip is purely for color: a line of what he's heard or noticed, shaped by how the run has gone so far. It costs nothing and changes nothing.",
  },
  {
    heading: "How It's Remembered",
    body: "How the story closes isn't only about which of the twelve endings you reach. A number of the run's more human choices — mercy or cruelty, honesty or betrayal, the way the campaign as a whole went — shape a closing line about what kind of thing you actually built, from sensitive and eloquent to crazed and vengeful. There's no meter to watch for it. It reveals itself only at the end.",
  },
];

/**
 * GOSSIP: purely cosmetic — no stamps, no flags, no state changes. Each
 * call filters this pool down to whatever currently applies (flags first,
 * since they're the most specific; then resource extremes; then branch;
 * always falling back to the generic pool so there's never nothing to
 * say) and picks one at random, so re-clicking Gossip on the same node can
 * surface something different.
 */
interface GossipEntry {
  applies: (state: GameState) => boolean;
  lines: string[];
}

const GOSSIP_POOL: GossipEntry[] = [
  {
    applies: (s) => !!s.flags.executedOrigin,
    lines: [
      "The hangman's assistant has been buying rounds he can't afford, sir. Best hope he stays a cheerful drunk and not a talkative one.",
      "I still hear the gallows creak some nights. Might be the wind. Might not be.",
    ],
  },
  {
    applies: (s) => !!s.flags.waldmanDebt,
    lines: [
      "Clerk Waldman drinks alone at the Golden Hart these days. A man who's forged one seal starts wondering who else might ask him to forge another.",
      "Waldman asked after you twice this week, sir — once for the university, and once, I think, for himself.",
    ],
  },
  {
    applies: (s) => !!s.flags.constructSighted,
    lines: [
      "Half the town still swears they saw it on the wall. The other half is starting to believe them.",
      "A child at the market drew it in chalk today. Got the shoulders wrong. Got the eyes right, somehow.",
    ],
  },
  {
    applies: (s) => !!s.flags.galvanicOvercharge,
    lines: [
      "The whole west wing still smells of ozone, sir. I've stopped asking if that's normal.",
      "The wiring hums even with the current off. I don't love sleeping under it, if I'm honest.",
    ],
  },
  {
    applies: (s) => !!s.flags.superConstruct,
    lines: [
      "It doesn't move like the sketches, sir. It moves like it's deciding whether to.",
      "I keep waiting for it to look ordinary. It hasn't yet.",
    ],
  },
  {
    applies: (s) => s.resources.secrecy <= -4,
    lines: [
      "The magistrate's clerk was asking around the tavern about you by name last night. Not a good sign, that.",
      "Two more neighbors have started crossing the street rather than pass the gate. Word is getting ahead of us.",
    ],
  },
  {
    applies: (s) => s.resources.secrecy >= 5,
    lines: [
      "It's been quiet, sir. Almost too quiet. I keep checking the road out of habit.",
      "Not a whisper about us in town this week. Waldman must be earning his keep.",
    ],
  },
  {
    applies: (s) => s.resources.voltage <= -4,
    lines: [
      "The generator's coughing again. I patched what I could, but it wants a proper engineer, not me with a spanner.",
      "Half the castle's candles are lit because the current keeps failing. It's romantic, if you squint.",
    ],
  },
  {
    applies: (s) => s.resources.voltage >= 5,
    lines: [
      "The tower drew lightning again last night. The porter swears the whole hill lit up blue.",
      "I felt that last discharge in my teeth, sir. Truly.",
    ],
  },
  {
    applies: (s) => s.resources.biomass <= -4,
    lines: [
      "The vats are running thinner than I'd like. We'll need another source soon, and I'm running out of discreet ones.",
      "The smell's easing off, at least. Small mercies.",
    ],
  },
  {
    applies: (s) => s.resources.biomass >= 5,
    lines: [
      "The tissue stock's growing faster than the ledgers can account for it. I don't ask where it all goes anymore.",
      "The vats overflowed again. I mopped it up before the porter saw. Don't ask what it looked like.",
    ],
  },
  {
    applies: (s) => s.difficulty === "HARD" && s.money <= 10,
    lines: [
      "The purse is thin, sir. I'd think twice before spending on anything that isn't strictly necessary.",
      "We're down to counting coins twice before we spend them. It wasn't always like this.",
    ],
  },
  {
    applies: (s) => s.activeBranch === "ALCHEMICAL",
    lines: [
      "The vats have their own rhythm now, sir. I swear they breathe when no one's watching.",
      "Krempe asked after your dissection notes again. I told him you were still cataloguing.",
    ],
  },
  {
    applies: (s) => s.activeBranch === "GALVANIC",
    lines: [
      "The town's taken to calling this the lightning tower. Not affectionately, I think.",
      "Every storm now, half of Ingolstadt watches our roofline instead of the sky.",
    ],
  },
  {
    applies: (s) => s.activeBranch === "PROMETHEUS",
    lines: [
      "The university's inquiries have a rhythm to them now — predictable, almost. Waldman's doing, mostly.",
      "There's a great deal of paperwork protecting us these days, sir. I try not to think about who signed it.",
    ],
  },
  {
    applies: (s) => s.fritzFavorUsed,
    lines: [
      "I still don't know who your patron is, sir. I've stopped asking. Some debts are better left unnamed.",
    ],
  },
  {
    // Always applicable — the fallback pool, so Gossip never comes up empty.
    applies: () => true,
    lines: [
      "The porter's log says nothing unusual, sir, which these days feels like the most unusual thing of all.",
      "Nothing new to report, Frankenstein. For once.",
      "The town clock's been running slow all week. I blame the cold. Probably it's just old.",
      "I find myself glancing at the west tower out of habit now, even on nights like this one, when there's nothing to see.",
    ],
  },
];

export function getFritzGossip(state: GameState): string {
  const pool = GOSSIP_POOL.filter((entry) => entry.applies(state)).flatMap((entry) => entry.lines);
  return pool[Math.floor(Math.random() * pool.length)];
}

// TEMPERAMENT — the "how human vs. crazed does the creature read" signal
// Craig asked for. It's a mix of two sources, deliberately: state.temperament
// itself is accumulated live, in the engine, from temperamentDelta tags on
// ~20 of the run's most narratively pivotal options (the climax choice on
// every branch, the female-companion bargain, Fritz on the grounding lever,
// and so on — see the tagged options below); computeFinalTemperament then
// layers a second, inferred pass on top at the ending screen, drawn from
// flags and final resource extremes that are already tracked for other
// reasons. Neither source alone was enough — a handful of tagged choices
// can be diluted by an otherwise-long run, and flags/resources alone would
// miss the specific, human-scale choices (mercy vs. cruelty, honesty vs.
// betrayal) that don't otherwise move a meter. Both axes are independent
// and centered on 0: voice is eloquence (+) vs. ferocity (-), bond is
// longing for connection (+) vs. vengeance (-).
function computeFinalTemperament(state: GameState): Temperament {
  let voice = state.temperament.voice;
  let bond = state.temperament.bond;

  if (state.flags.executedOrigin) voice -= 1; // began from a body taken off the gallows
  if (state.flags.waldmanDebt) voice -= 1; // bought its way out of trouble instead of talking its way out
  if (state.flags.constructSighted) voice -= 1; // chose terror-as-strategy at least once
  if (state.flags.superConstruct) bond -= 1; // went all in on hybridization over restraint
  if (state.flags.galvanicOvercharge) voice -= 1; // favored raw force over careful control
  if (state.flags.fritzPatron) bond += 1; // accepted a patron's help rather than going it entirely alone

  if (state.resources.secrecy <= -4) {
    voice -= 1;
    bond -= 1;
  } // the world was closing in by the end
  if (state.resources.secrecy >= 5) voice += 1; // composed, controlled, never really cornered
  if (state.resources.voltage <= -4) voice -= 1; // the work itself kept misfiring
  if (state.resources.voltage >= 5) voice += 1; // real mastery of the craft
  if (state.resources.biomass <= -4) bond -= 1; // materially desperate, corners cut on the creature's care
  if (state.resources.biomass >= 5) bond += 1; // well-resourced, generous toward the work

  return { voice: Math.max(-8, Math.min(8, voice)), bond: Math.max(-8, Math.min(8, bond)) };
}

function temperamentBucket(n: number): "pos" | "neutral" | "neg" {
  if (n >= 2) return "pos";
  if (n <= -2) return "neg";
  return "neutral";
}

const TEMPERAMENT_READINGS: Record<string, { label: string; epilogue: string }> = {
  pos_pos: {
    label: "Eloquent & Longing",
    epilogue:
      "In the tellings that outlast the newspapers, the thing Victor built is rarely called a monster twice. Those who claim to have met it — a shepherd, a customs clerk, a widow who swears she is not lying — describe something that listens before it acts, that seems to grieve what little it ever broke, that is, more than anything, still looking for someone to talk to. If it is a monster, it is the kind stories eventually forgive.",
  },
  pos_neutral: {
    label: "Eloquent, Guarded",
    epilogue:
      "The legend that survives is a careful, complicated one — not a monster exactly, but not quite a man either, described by those who claim to have spoken with it as measured, watchful, and difficult to read. It seems to want something from the world it was given. No one who tells the story is entirely sure what.",
  },
  pos_neg: {
    label: "Eloquent & Vengeful",
    epilogue:
      "What travelers describe, when they describe it at all, is unsettling precisely because it is so reasonable — a low, patient voice explaining, in perfect detail, exactly what was done to it and exactly what it intends to do about that. It is not raving. That, more than anything else about it, is what keeps people awake afterward.",
  },
  neutral_pos: {
    label: "Watchful & Longing",
    epilogue:
      "The stories that travel furthest agree on very little except this: whatever Victor built wanted, above all, not to be alone. Witnesses describe it lingering near lit windows on cold nights, never entering, never quite leaving either — less a monster on the prowl than something homesick for a home it was never given.",
  },
  neutral_neutral: {
    label: "Ambiguous",
    epilogue:
      "History settles on no single account of the thing Victor built. Depending on who is asked, it was a marvel, an atrocity, or simply a rumor that outgrew its origins — and Victor himself, in the few private notes that survive him, never quite manages to decide either.",
  },
  neutral_neg: {
    label: "Watchful & Vengeful",
    epilogue:
      "The accounts that circulate longest are the unkind ones — a shape glimpsed doing exactly the kind of harm its maker taught it, indifferent to whether the harm was ever asked for. Whatever gentleness it may once have carried, the record that survives has no patience left for it.",
  },
  neg_pos: {
    label: "Ferocious & Longing",
    epilogue:
      "Every surviving account agrees the thing is dangerous. Fewer agree on why. A hunter who claims to have tracked it for a season insists it never attacked anyone who did not corner it first, and that twice, from a safe distance, he watched it simply sit and watch a village's lit windows until dawn — like something starving for a kind of company it had no way of asking for.",
  },
  neg_neutral: {
    label: "Ferocious, Unmoved",
    epilogue:
      "What reaches the newspapers is mostly teeth — a shape that moves fast, hits hard, and is gone before anyone can describe it twice the same way. Nobody bothers asking what it wants anymore. By the time the question would matter, it has usually already answered it with its hands.",
  },
  neg_neg: {
    label: "Ferocious & Vengeful",
    epilogue:
      "There is no gentler version of this story left to tell. What survives in the record is a thing that took every lesson Victor taught it about cruelty and returned each one, exactly, without interest in mercy or any memory of ever having asked for a different one.",
  },
};

export function getTemperamentReading(state: GameState): { label: string; epilogue: string } {
  const final = computeFinalTemperament(state);
  const key = `${temperamentBucket(final.voice)}_${temperamentBucket(final.bond)}`;
  return TEMPERAMENT_READINGS[key];
}

// FRITZ'S CREATURE REPORT — a mid-run hint, distinct from Gossip (which is
// flavor only, no mechanical signal). It reuses the same live temperament
// read the ending screen draws on via getTemperamentReading, so it can only
// say what the run has actually earned so far, but phrases it as Fritz's
// present-tense read on how the creature seems to be shaping up — hedged,
// uncertain, still-in-progress — rather than the ending screen's settled,
// past-tense "how it's remembered." That keeps it a foreshadowing nudge, not
// a spoiler: the run can still swing the bucket by the time it ends.
const CREATURE_REPORT_LINES: Record<string, string[]> = {
  pos_pos: [
    "It listens more than it strikes, sir. I've started to think it wants a conversation more than a fight.",
    "Whatever it becomes, I don't think it wants to face it alone. Watch how it lingers near the light.",
  ],
  pos_neutral: [
    "It's careful with its words when it has them, sir. Watchful, though. I can't yet tell what it's waiting for.",
    "Measured. That's the word I'd use for it. Whether that holds, I couldn't say.",
  ],
  pos_neg: [
    "It reasons everything through, sir, calm as you like — which frightens me more than shouting would.",
    "It doesn't rage. It explains. I think that's worse, somehow.",
  ],
  neutral_pos: [
    "It keeps near the windows at night, sir. Not hunting. Just watching the lit ones.",
    "I don't think it wants trouble. I think it wants somewhere to belong, and hasn't found it yet.",
  ],
  neutral_neutral: [
    "Too early to say, sir. Could still go either way, the way I see it.",
    "Hard to read it yet. Some nights it seems almost gentle. Others, I'm not so sure.",
  ],
  neutral_neg: [
    "It's quieter than I'd like, sir. Quiet things have a way of deciding things on their own.",
    "I've stopped trying to guess what it's thinking. I don't much like where my guesses land.",
  ],
  neg_pos: [
    "It's dangerous, no question — but I've seen it stop short of a killing blow more than once. Like it's holding something back.",
    "Quick to violence, sir, but slower to it than it could be. I think it's still deciding what it wants to become.",
  ],
  neg_neutral: [
    "It moves fast and doesn't explain itself, sir. I've stopped asking why.",
    "Efficient. Cold about it. I don't see much softness left in there, if there ever was.",
  ],
  neg_neg: [
    "It's learned every lesson you taught it, sir, and I don't think it's forgotten a single cruel one.",
    "I don't recognize what's under that roof anymore. I'm not sure you do either.",
  ],
};

export function getFritzCreatureReport(state: GameState): string {
  const current = computeFinalTemperament(state);
  const key = `${temperamentBucket(current.voice)}_${temperamentBucket(current.bond)}`;
  const lines = CREATURE_REPORT_LINES[key] ?? CREATURE_REPORT_LINES.neutral_neutral;
  return lines[Math.floor(Math.random() * lines.length)];
}

export const NODES: Record<string, GameNode> = {
  "1": {
    id: "1",
    branch: "UNIVERSAL",
    title: "The Anatomical Source",
    description:
      "Fritz raps three times at the old postern gate in the curtain wall — the signal you agreed upon — and hauls in a canvas sack that leaves a dark trail across the flagstones. Ingolstadt sleeps in the valley below, unaware of what climbs the castle's towers each night. The vats stand empty and waiting; whatever fills them tonight will not un-fill easily.",
    options: [
      {
        label: "Purchase the Fresh Graveyard Yield.",
        detail:
          "A discreet cash transaction with the pauper's-field diggers — the cheapest, least conspicuous source of tissue you have.",
        stamps: { biomass: 3, secrecy: -2 },
        moneyCost: 10,
        quote: {
          speaker: "Fritz",
          text: "Unmarked graves from the pauper's field. The mud hasn't even dried on their shirts.",
        },
        outcome:
          "The sack is heavier than it looks. By lamplight you catalogue what the pauper's field has given you — enough tissue to begin, though the stench of the grave clings to the workroom for days.",
        nextNodeId: "2",
      },
      {
        label: "Secure Preserved Dissection Specimens from University.",
        detail:
          "Legitimate-looking specimens borrowed from Krempe's own dissection stores, already catalogued as spoiled and due for disposal.",
        stamps: { biomass: 1, secrecy: 1, voltage: -1 },
        quote: {
          speaker: "Krempe",
          text: "Formaldehyde-soaked muscle doesn't twitch as cleanly, but the Dean won't miss a few limbs.",
        },
        outcome:
          "Krempe's specimens arrive pickled and labeled in a dead colleague's careful hand. The formaldehyde stings your eyes, but no one at the university will ever miss what was already catalogued as waste.",
        nextNodeId: "2",
      },
      {
        label: "Raid the Local Executioner's Scaffold.",
        detail:
          "A direct bribe to the hangman's assistant for a body still processing through the gallows queue — fresh, but conspicuous to acquire.",
        stamps: { biomass: 4, secrecy: -3 },
        quote: {
          speaker: "Fritz",
          text: "Fresh from the gallows! The neck is broken, but the heart was still beating when we cut him down.",
        },
        outcome:
          "The body is still warm when it reaches the laboratory table. Fritz will not meet your eyes for the rest of the night, and you find you cannot blame him.",
        nextNodeId: "2-DARK",
        setFlags: ["executedOrigin"],
      },
    ],
  },
  "2": {
    id: "2",
    branch: "UNIVERSAL",
    title: "The Approaching Alpine Storm",
    description:
      "The barometric glass falls faster than you have ever seen it fall. Fritz watches the horizon with the particular dread of a man who has seen what happens when lightning finds this building unprepared, and you cannot decide whether the storm is an omen or an invitation.",
    options: [
      {
        label: "Elevate Copper Roof Spires to Maximum Height.",
        detail:
          "Raise the roof spires above the district's rooflines to draw the maximum possible charge from the coming storm.",
        stamps: { voltage: 4, secrecy: -2 },
        quote: {
          speaker: "Fritz",
          text: "The sky is bleeding fire, Victor! Look at the town below—sparks are jumping off the battlements!",
        },
        outcome:
          "The spires groan under their new height, and by midnight the whole battlement line crackles faintly blue. Half the town below will swear, later, that they saw the sky itself reach down into the castle.",
        nextNodeId: "3",
      },
      {
        label: "Route Charge Slowly Through Chemical Leyden Batteries.",
        detail:
          "Store the storm's charge gradually in chemical batteries rather than drawing it directly — slower, and gentler on the old stonework.",
        stamps: { voltage: 2 },
        quote: {
          speaker: "Heinrich",
          text: "Safer for the roof beams, sir. But that battery acid eats through copper coils twice as fast.",
        },
        outcome:
          "The batteries hum low and steady through the night, drawing the storm's fury down in careful, metered doses. Heinrich checks the acid seals twice before he'll let you sleep.",
        nextNodeId: "3",
      },
    ],
  },
  "2-DARK": {
    id: "2-DARK",
    branch: "UNIVERSAL",
    title: "The Storm After the Gallows",
    description:
      "The barometric glass falls faster than you have ever seen it fall. Fritz has not said a word since the gallows, and watches the horizon now with a second kind of dread layered over the first — the ordinary fear of a man who has seen lightning find this building unprepared, and the newer, quieter fear of a man who watched something still warm go cold on your table an hour ago.",
    options: [
      {
        label: "Elevate Copper Roof Spires to Maximum Height.",
        detail:
          "Raise the roof spires above the district's rooflines to draw the maximum possible charge from the coming storm.",
        stamps: { voltage: 4, secrecy: -2 },
        quote: {
          speaker: "Fritz",
          text: "The sky is bleeding fire, Victor. Look at the town below — sparks are jumping off the battlements.",
        },
        outcome:
          "The spires groan under their new height, and by midnight the whole battlement line crackles faintly blue. Fritz watches it in silence, and you cannot tell if he's praying or simply too tired to speak.",
        nextNodeId: "3",
      },
      {
        label: "Route Charge Slowly Through Chemical Leyden Batteries.",
        detail:
          "Store the storm's charge gradually in chemical batteries rather than drawing it directly — slower, and gentler on the old stonework.",
        stamps: { voltage: 2 },
        quote: {
          speaker: "Heinrich",
          text: "Safer for the roof beams, sir. But that battery acid eats through copper coils twice as fast.",
        },
        outcome:
          "The batteries hum low and steady through the night. Fritz checks the acid seals beside Heinrich without being asked, glad, you suspect, of something to do with his hands besides remember what they carried this morning.",
        nextNodeId: "3",
      },
    ],
  },
  "3": {
    id: "3",
    branch: "UNIVERSAL",
    title: "The Initial Framework",
    description:
      "The table is scrubbed, the tools laid out in their proper order, and for the first time the shape of the thing you intend to build stops being an idea and becomes a set of measurements. Fritz waits with the calipers, asking, not for the first time, whether you are certain.",
    options: [
      {
        label: "Stitch a Heavy Draft-Worker Frame.",
        detail: "Build the skeleton around a laborer's dense, heavy bone structure, favoring resilience over speed — slower on its feet, but built to survive whatever comes for it.",
        stamps: { voltage: -1, biomass: -2 },
        quote: {
          speaker: "Fritz",
          text: "Thick bone density from a blacksmith. It'll take six men with axes to breach the door!",
        },
        outcome:
          "The blacksmith's bones go together with a grim, satisfying heaviness. Whatever wakes on this frame will not be fast, but it will not be easily stopped either.",
        nextNodeId: "4",
      },
      {
        label: "Assemble a Fast Hound-Grafted Crawler.",
        detail:
          "Build a lighter frame reinforced with grafted wolf tendon, favoring stealth and agility over brute strength.",
        stamps: { voltage: -1, biomass: -1 },
        quote: {
          speaker: "Fritz",
          text: "Light limbs, wolf tendons. It'll stalk the lower stairwell in total silence.",
        },
        outcome:
          "Wolf tendon and human sinew are coaxed into an uneasy truce along the frame's limbs. It will move, you suspect, in ways nothing born of one species alone should move.",
        nextNodeId: "4",
      },
      {
        label: "Pawn a Case of Surplus Instruments.",
        detail:
          "Quietly sell a case of surgical instruments you no longer need to a traveling merchant passing through — small money, and one more person who's seen inside your workroom.",
        stamps: { secrecy: -1 },
        moneyDelta: 20,
        quote: {
          speaker: "Heinrich",
          text: "He didn't ask why a student owns a trepanning saw, sir. Best not to wonder why he didn't.",
        },
        outcome:
          "The merchant pays without haggling and without much curiosity either, which worries you almost as much as the coin reassures you. Two more sovereigns in the purse, and one more stranger who could describe your workroom if anyone ever thought to ask him.",
        nextNodeId: "4",
      },
    ],
  },
  "4": {
    id: "4",
    branch: "UNIVERSAL",
    title: "The University Inquiry",
    description:
      "A folded notice arrives under the door, sealed with the university's own wax — a formal demand to inspect the west tower within the week, on the grounds that the wing remains, on paper, university property. Whoever filed the complaint knows enough to be dangerous, and not quite enough to have you arrested yet.",
    options: [
      {
        label: "Bribe the Dean's Clerk with Research Funds.",
        detail:
          "Pay the Dean's clerk directly to falsify the inspection report before it ever reaches the Rector's desk.",
        stamps: { secrecy: 3, voltage: -1 },
        moneyCost: 20,
        quote: {
          speaker: "Clerk Waldman",
          text: "A few gold sovereigns, Frankenstein, and I assure the Rector your room holds only chemical vats.",
        },
        outcome:
          "Clerk Waldman pockets the sovereigns without ceremony and amends the inspection ledger himself. The Rector will read only what Waldman wants him to read.",
        nextNodeId: "6",
        setFlags: ["waldmanDebt"],
      },
      {
        label: "Bar the West Tower Stair and Ignore the Order.",
        detail:
          "Refuse the inspection outright and reinforce the tower door, betting that defiance draws less attention than a bribe's paper trail.",
        stamps: { secrecy: -3 },
        quote: {
          speaker: "Town Constable",
          text: "We hear iron wheels grinding up there at three in the morning! We bring crowbars at dusk!",
        },
        outcome:
          "You bar the tower stair and answer no knock. The constable's notice goes unanswered, and somewhere in the town hall, a file with your name on it grows one page thicker.",
        nextNodeId: "6-TOWER",
      },
    ],
  },
  "6": {
    id: "6",
    branch: "UNIVERSAL",
    title: "The Secrecy Network",
    description:
      "Every hammer-blow and every scream carries further than you'd like through walls this old. The town below the castle walls already talks in the low, careful way people talk about something they've decided not to see — for now, at least.",
    options: [
      {
        label: "Bribe Night Watch with Stolen Apparatus.",
        detail:
          "Buy the local watchmen's silence with coin and a few pieces of stolen apparatus they can sell on — reliable while the money lasts, and no longer than that.",
        stamps: { secrecy: 2, biomass: -1 },
        moneyCost: 10,
        quote: {
          speaker: "Fritz",
          text: "Their palms are greasy, but they ignore the screaming from the sixth floor tonight.",
        },
        outcome:
          "The watchmen pocket the stolen apparatus and develop, overnight, a sudden disinterest in the sixth floor. It will not last forever, but it will last long enough.",
        nextNodeId: "7",
      },
      {
        label: "Release a Primitive Construct to Terrify Neighbors.",
        detail:
          "Let an early, unstable construct loose on the battlements deliberately, so the town's fear does your hiding for you.",
        stamps: { secrecy: -2, biomass: -1 },
        temperamentDelta: { voice: -2 },
        quote: {
          speaker: "Townsman",
          text: "A giant shadow leapt across the battlements! Its eyes glowed in the dark!",
        },
        outcome:
          "The shape that crosses the battlements sends half the town to their knees in prayer and the other half running for the magistrate's door. You have bought silence with a different kind of noise.",
        nextNodeId: "7-BATTLEMENTS",
        setFlags: ["constructSighted"],
      },
      {
        label: "Establish University Shadow Committee.",
        detail:
          "Pay Clerk Waldman to formalize your protection into a standing arrangement — permits, silence, and a paper trail that favors you.",
        stamps: { secrecy: 4, voltage: -1 },
        gate: { resource: "secrecy", minThreshold: 3 },
        moneyCost: 20,
        quote: {
          speaker: "Clerk Waldman",
          text: "We have the permits and silenced witnesses. Your work is completely protected.",
        },
        outcome:
          "Waldman's shadow committee moves with a bureaucrat's quiet efficiency — permits forged, witnesses paid, inconvenient questions redirected before they're even asked. For the first time, you feel less like a fugitive and more like an institution.",
        nextNodeId: "8C",
      },
    ],
  },
  "6-TOWER": {
    id: "6-TOWER",
    branch: "UNIVERSAL",
    title: "The Barred Stair",
    description:
      "You have not opened the west tower door in four days, and the castle itself seems to have taken your side — the old stone stair groans under anyone who tries it, and the wind through the arrow-slits carries every approaching footstep long before it arrives. It buys you warning, not safety. The town below has not forgotten what it asked for and did not get.",
    options: [
      {
        label: "Bribe Night Watch with Stolen Apparatus.",
        detail:
          "Buy the local watchmen's silence with coin and a few pieces of stolen apparatus they can sell on — reliable while the money lasts, and no longer than that.",
        stamps: { secrecy: 2, biomass: -1 },
        moneyCost: 10,
        quote: {
          speaker: "Fritz",
          text: "They know better than to test a barred tower door. Coin just makes it official.",
        },
        outcome:
          "The watchmen pocket the stolen apparatus and agree, for now, that a barred door is a university matter and none of theirs. It will not last forever, but it will last long enough.",
        nextNodeId: "7",
      },
      {
        label: "Release a Primitive Construct to Terrify Neighbors.",
        detail:
          "Let an early, unstable construct loose on the battlements deliberately, so the town's fear does your hiding for you.",
        stamps: { secrecy: -2, biomass: -1 },
        temperamentDelta: { voice: -2 },
        quote: {
          speaker: "Townsman",
          text: "Something walked the tower battlements at midnight, and it was no watchman!",
        },
        outcome:
          "The shape on the battlements does more to explain the barred door than any excuse you could have offered. You have bought silence with a different kind of noise, and given the west tower a reputation of its own.",
        nextNodeId: "7-BATTLEMENTS",
        setFlags: ["constructSighted"],
      },
      {
        label: "Establish University Shadow Committee.",
        detail:
          "Pay Clerk Waldman to formalize your protection into a standing arrangement — permits, silence, and a paper trail that favors you.",
        stamps: { secrecy: 4, voltage: -1 },
        moneyCost: 20,
        quote: {
          speaker: "Clerk Waldman",
          text: "A barred door draws questions a signed permit does not. Let me handle the paperwork.",
        },
        outcome:
          "Waldman's shadow committee retroactively authorizes the very door you already barred, and for the first time the defiance looks less like guilt and more like university procedure.",
        nextNodeId: "8C",
      },
    ],
  },
  "7": {
    id: "7",
    branch: "UNIVERSAL",
    title: "The Final Act I Synthesis",
    description:
      "The frame is ready. What remains is the question that will define everything that follows: what, precisely, will you fill it with? Fritz has laid three trays on the table, and none of the choices are comfortable ones.",
    options: [
      {
        label: "Rely Strictly on Preserved Human Anatomy.",
        detail: "Build the creature's core systems from unmixed human tissue alone, refusing any animal substitution.",
        stamps: { biomass: 2, secrecy: 1 },
        quote: {
          speaker: "Victor",
          text: "Purity is strength. No animal degradation will weaken my creation.",
        },
        outcome:
          "You work only with what was, unmistakably, once a person. It feels, perversely, like the more honest choice — and the more dangerous one, should anyone ever recognize a face.",
        nextNodeId: "5",
      },
      {
        label: "Graft Diverse Animal Organs (Wolf/Horse).",
        detail: "Supplement scarce human organs with wolf and draft-horse tissue to complete the systems faster — quicker to assemble, but no one can say yet what a body built from three species will actually be.",
        stamps: { biomass: 3, voltage: -1 },
        quote: {
          speaker: "Fritz",
          text: "The wolf heart beats faster, and draft-horse lungs double our capacity.",
        },
        outcome:
          "Wolf heart, draft-horse lung, human hand — the chimera on the table breathes with a rhythm that belongs to no single creature that has ever lived.",
        nextNodeId: "5",
      },
      {
        label: "Perform Total Hybridization.",
        detail:
          "Push the hybridization further than caution allows, fusing human and animal tissue into something deliberately more than either.",
        stamps: {},
        gate: { resource: "biomass", minThreshold: 1 },
        roll: {
          chance: 0.55,
          scaling: { resource: "biomass", perPoint: 0.035, min: 0.35, max: 0.92 },
          success: {
            outcome:
              "You stop asking what is proper and start asking only what is possible. What rises from the table afterward is, by any measure, more than you intended to build.",
            stamps: { biomass: 5, voltage: -2 },
            setFlags: ["superConstruct"],
            nextNodeId: "5-HYBRID",
          },
          failure: {
            outcome:
              "The hybridization fights itself on the table, tissue rejecting tissue faster than you can graft it. What survives the attempt is smaller, stranger, and far less than you had hoped to build.",
            stamps: { biomass: 1, voltage: -3 },
          },
        },
        quote: {
          speaker: "Victor",
          text: "A masterpiece! More than human—better than nature intended!",
        },
        outcome: "",
        nextNodeId: "5",
      },
    ],
  },
  "7-BATTLEMENTS": {
    id: "7-BATTLEMENTS",
    branch: "UNIVERSAL",
    title: "What Walked the Battlements",
    description:
      "The frame is ready, and the town is still talking about the shape it saw on the battlements — which means whatever you fill this frame with had better be worth the story you have already let them tell about it. Fritz has laid three trays on the table, and none of the choices are comfortable ones.",
    options: [
      {
        label: "Rely Strictly on Preserved Human Anatomy.",
        detail: "Build the creature's core systems from unmixed human tissue alone, refusing any animal substitution.",
        stamps: { biomass: 2, secrecy: 1 },
        quote: {
          speaker: "Victor",
          text: "Let them talk about shapes on the battlements. What's on this table will be unmistakably human.",
        },
        outcome:
          "You work only with what was, unmistakably, once a person — a quieter answer than the battlements story deserves, and a more dangerous one, should anyone ever recognize a face.",
        nextNodeId: "5",
      },
      {
        label: "Graft Diverse Animal Organs (Wolf/Horse).",
        detail: "Supplement scarce human organs with wolf and draft-horse tissue to complete the systems faster — quicker to assemble, but no one can say yet what a body built from three species will actually be.",
        stamps: { biomass: 3, voltage: -1 },
        quote: {
          speaker: "Fritz",
          text: "After what they saw on the wall, sir, I don't think a wolf's heart will surprise anyone.",
        },
        outcome:
          "Wolf heart, draft-horse lung, human hand — the chimera on the table breathes with a rhythm that belongs to no single creature that has ever lived, and to the shape the town already believes it saw.",
        nextNodeId: "5",
      },
      {
        label: "Perform Total Hybridization.",
        detail:
          "Push the hybridization further than caution allows, fusing human and animal tissue into something deliberately more than either.",
        stamps: {},
        gate: { resource: "biomass", minThreshold: 1 },
        roll: {
          chance: 0.55,
          scaling: { resource: "biomass", perPoint: 0.035, min: 0.35, max: 0.92 },
          success: {
            outcome:
              "You stop asking what is proper and start asking only what the battlements story already promised. What rises from the table afterward is, by any measure, more than you intended to build.",
            stamps: { biomass: 5, voltage: -2 },
            setFlags: ["superConstruct"],
            nextNodeId: "5-HYBRID",
          },
          failure: {
            outcome:
              "The hybridization fights itself on the table, tissue rejecting tissue faster than you can graft it. What survives the attempt is smaller, stranger, and far less than the shape the town is already afraid of.",
            stamps: { biomass: 1, voltage: -3 },
          },
        },
        quote: {
          speaker: "Victor",
          text: "If they insist on a monster, Fritz, let us at least build one worthy of the rumor!",
        },
        outcome: "",
        nextNodeId: "5",
      },
    ],
  },
  "5": {
    id: "5",
    branch: "UNIVERSAL",
    title: "The Galvanic Method",
    description:
      "The body is whole. Every choice until now has been preparation; this one is the threshold itself. Outside, the storm you have been courting for weeks finally breaks directly over the tower roof, as if it too has been waiting for this moment.",
    options: [
      {
        label: "Adopt Biological Synthesis.",
        detail:
          "Commit to flesh over current — the creature will need to sustain and repair itself the way living tissue does.",
        stamps: { biomass: 3, secrecy: -2 },
        quote: {
          speaker: "Victor",
          text: "Flesh is adaptable. We shall craft a self-sustaining organism!",
        },
        outcome:
          "You choose flesh over current, betting that what you have built can sustain itself the way living things always have. The vats begin their slow, wet work, and there is no undoing it now.",
        nextNodeId: "8A",
      },
      {
        label: "Standard Galvanic Core Activation.",
        detail:
          "Commit to current over flesh — a single decisive charge, betting everything on voltage rather than biology.",
        stamps: { voltage: 3, biomass: -1 },
        quote: {
          speaker: "Victor",
          text: "Life is mechanical! With enough voltage, even iron and dead sinew obey!",
        },
        outcome:
          "The switch is thrown. Current floods the frame in a single violent arc, and for one held breath the entire tower chamber smells of ozone and burnt hair.",
        nextNodeId: "8B",
      },
      {
        label: "Construct High-Capacity Galvanic Array.",
        detail:
          "Wire the entire building into one continuous generator for a single, building-wide discharge — audacious, and impossible to fully control.",
        stamps: {},
        gate: { resource: "voltage", minThreshold: 2 },
        roll: {
          chance: 0.5,
          scaling: { resource: "voltage", perPoint: 0.04, min: 0.3, max: 0.92 },
          success: {
            outcome:
              "Every wire in the old castle screams at once as the array drinks the whole storm down into a single point. When the light fades, something in that chair is no longer merely dead.",
            stamps: { voltage: 5, secrecy: -3 },
            setFlags: ["galvanicOvercharge"],
            nextNodeId: "8B-SURGE",
          },
          failure: {
            outcome:
              "Every wire in the old castle screams at once — and then the array falters, half the charge bleeding uselessly into the walls. You are left with scorched copper, a frightened street outside, and only a fraction of the power you gambled for.",
            stamps: { voltage: 2, secrecy: -4 },
          },
        },
        quote: {
          speaker: "Victor",
          text: "The grid is primed! We turn this entire building into a continuous generator!",
        },
        outcome: "",
        nextNodeId: "8B",
      },
    ],
  },
  "5-HYBRID": {
    id: "5-HYBRID",
    branch: "UNIVERSAL",
    title: "The Hybridized Method",
    description:
      "The body on the table is no longer simply whole — it is more than whole, hybridized past anything you set out to build, and it does not need convincing to accept what comes next so much as a place to put the current. Outside, the storm you have been courting for weeks finally breaks directly over the tower roof, as if it too has been waiting for this moment.",
    options: [
      {
        label: "Adopt Biological Synthesis.",
        detail:
          "Commit to flesh over current — the hybrid tissue already wants to sustain and repair itself the way living things do; you are choosing to let it.",
        stamps: { biomass: 3, secrecy: -2 },
        quote: {
          speaker: "Victor",
          text: "It already breathes on its own terms. I will simply let it.",
        },
        outcome:
          "You choose flesh over current, betting that what you have built can sustain itself the way living things always have. The vats begin their slow, wet work, and there is no undoing it now.",
        nextNodeId: "8A",
      },
      {
        label: "Standard Galvanic Core Activation.",
        detail:
          "Commit to current over flesh anyway — a single decisive charge, betting everything on voltage rather than the hybrid biology already straining at the frame.",
        stamps: { voltage: 3, biomass: -1 },
        quote: {
          speaker: "Victor",
          text: "Let voltage discipline what the hybridization made unruly!",
        },
        outcome:
          "The switch is thrown. Current floods a frame that was never meant to hold this much of anything, and for one held breath the entire tower chamber smells of ozone, burnt hair, and something else you don't have a name for yet.",
        nextNodeId: "8B",
      },
      {
        label: "Construct High-Capacity Galvanic Array.",
        detail:
          "Wire the entire building into one continuous generator for a single, building-wide discharge — audacious even before tonight, and the hybrid frame makes it stranger still.",
        stamps: {},
        gate: { resource: "voltage", minThreshold: 2 },
        roll: {
          chance: 0.5,
          scaling: { resource: "voltage", perPoint: 0.04, min: 0.3, max: 0.92 },
          success: {
            outcome:
              "Every wire in the old castle screams at once as the array drinks the whole storm down into a single point. When the light fades, something in that chair is no longer merely dead, and no longer merely one thing either.",
            stamps: { voltage: 5, secrecy: -3 },
            setFlags: ["galvanicOvercharge"],
            nextNodeId: "8B-SURGE",
          },
          failure: {
            outcome:
              "Every wire in the old castle screams at once — and then the array falters, the hybrid frame drinking down half the charge before it ever reaches the chair. You are left with scorched copper, a frightened street outside, and tissue that took a jolt it was never built to survive.",
            stamps: { voltage: 2, secrecy: -4 },
          },
        },
        quote: {
          speaker: "Victor",
          text: "It has to take the whole charge at once — anything less and the hybrid tissue simply rejects it!",
        },
        outcome: "",
        nextNodeId: "8B",
      },
    ],
  },

  // BRANCH A: The Alchemical Monster
  "8A": {
    id: "8A",
    branch: "ALCHEMICAL",
    title: "The Living Harvest",
    description:
      "The first surge has stabilized, but stabilized is not the same as sustained. Whatever you built at the threshold needs tissue faster than the pauper's field alone can supply, and the vats will not wait for your conscience to catch up with your ambition.",
    options: [
      {
        label: "Rob the grave of a fallen scholar.",
        detail: "A quiet exhumation of a recently buried academic — risky only if the family visits the grave soon, and a man who spent his life studying the dead deserves, perhaps, a stranger sort of afterlife.",
        stamps: { biomass: 2, secrecy: -2 },
        quote: { speaker: "Fritz", text: "Still warm. He was buried this morning." },
        outcome:
          "The scholar's grave gives up easily — too easily, you think, for a man who spent his whole life guarding knowledge jealously. Perhaps this is simply his final lesson.",
        nextNodeId: "9A",
      },
      {
        label: "Induce a coma in a hospital patient with acid.",
        detail: "Use acid to induce a fatal seizure in a hospital patient, disguising the harvest as a natural death.",
        stamps: { biomass: 4, secrecy: -4 },
        temperamentDelta: { voice: -2, bond: -1 },
        quote: { speaker: "Fritz", text: "The ward nurse will swear it was a seizure." },
        outcome:
          "The hospital ward is quiet, the nurse conveniently elsewhere, the patient conveniently unable to describe what happened to him afterward. You tell yourself it will be recorded as a seizure. You almost believe it.",
        nextNodeId: "9A",
      },
      {
        label: "Substitute a rabid hound's brain.",
        detail: "Settle for an animal substitute — a rabid stray's brain, crude but untraceable to any missing person.",
        stamps: { biomass: 1, secrecy: 2 },
        quote: { speaker: "Krempe", text: "Crude, but no one comes looking for a stray." },
        outcome:
          "The hound's brain settles into the vat with an unsettling readiness, as if some animal instinct in the tissue already understands what is being asked of it.",
        nextNodeId: "9A",
      },
      {
        label: "Pay off the hangman's widow before she asks questions.",
        detail:
          "The executed man you took from the scaffold had a wife. She has started asking the gaoler where the body went — this quiets her before she asks anyone louder.",
        stamps: { biomass: -1, secrecy: 1 },
        temperamentDelta: { voice: 1, bond: 1 },
        quote: { speaker: "Fritz", text: "She just wants somewhere to put flowers, sir. We gave her a grave with nothing in it." },
        outcome:
          "She takes the coin without meeting your eyes, and Fritz builds her a grave that holds nothing but dirt and a borrowed coffin lid. It is the closest thing to a kindness either of you has managed in weeks.",
        nextNodeId: "9A-PAID",
        requiresFlag: "executedOrigin",
        requiresFlagHint: "Only if you took the executed man from the scaffold at the Anatomical Source.",
      },
    ],
  },
  "9A": {
    id: "9A",
    branch: "ALCHEMICAL",
    title: "Chemical Vat Overcharge",
    description:
      "The tissue vats hiss and strain against their seals, weeping a thin chemical sweat down onto the floorboards. Something inside them is growing faster than the containment was ever built to allow.",
    options: [
      {
        label: "Flush the vats with concentrated carbolic acid.",
        detail: "Buy concentrated carbolic acid to purge the rot building in the vats before it spreads further — an expense that buys you time, not a cure.",
        stamps: { biomass: 3, voltage: -2 },
        moneyCost: 10,
        quote: { speaker: "Victor", text: "Purge the rot before it purges us." },
        outcome:
          "The acid burns away the worst of the rot, and the vats settle into an uneasy quiet — bought, like everything else in this tower, at a cost you'll reckon with later.",
        nextNodeId: "10A",
      },
      {
        label: "Vent the toxic vapor into the castle's dry moat.",
        detail: "Vent the vats' pressure straight into the old dry moat rather than treating it — faster, and far more noticeable.",
        stamps: { voltage: 2, secrecy: -3 },
        quote: { speaker: "Fritz", text: "The whole block will smell of eggs by morning." },
        outcome:
          "The vapor rolls out into the dry moat in a low yellow fog. By morning three separate households will report a smell they cannot explain, and choose not to investigate.",
        nextNodeId: "10A",
      },
    ],
  },
  "9A-PAID": {
    id: "9A-PAID",
    branch: "ALCHEMICAL",
    title: "The Widow's Silence",
    description:
      "The widow's coin bought a quiet you can feel in the workroom itself — Fritz moves lighter tonight, or at least less like a man waiting for a knock at the door. The tissue vats hiss and strain against their seals regardless, weeping a thin chemical sweat down onto the floorboards. Something inside them is growing faster than the containment was ever built to allow.",
    options: [
      {
        label: "Flush the vats with concentrated carbolic acid.",
        detail: "Buy concentrated carbolic acid to purge the rot building in the vats before it spreads further — an expense that buys you time, not a cure.",
        stamps: { biomass: 3, voltage: -2 },
        moneyCost: 10,
        quote: { speaker: "Victor", text: "Purge the rot before it purges us." },
        outcome:
          "The acid burns away the worst of the rot, and the vats settle into an uneasy quiet — bought, like everything else in this tower, at a cost you'll reckon with later.",
        nextNodeId: "10A",
      },
      {
        label: "Vent the toxic vapor into the castle's dry moat.",
        detail: "Vent the vats' pressure straight into the old dry moat rather than treating it — faster, and far more noticeable.",
        stamps: { voltage: 2, secrecy: -3 },
        quote: { speaker: "Fritz", text: "The whole block will smell of eggs by morning. At least it won't be the widow's business this time." },
        outcome:
          "The vapor rolls out into the dry moat in a low yellow fog. By morning three separate households will report a smell they cannot explain, and choose not to investigate — one fewer thing, this week, for Fritz to carry.",
        nextNodeId: "10A",
      },
    ],
  },
  "10A": {
    id: "10A",
    branch: "ALCHEMICAL",
    title: "The Awakening Night",
    description:
      "Lightning walks the roofline in long, deliberate strides, and the table beneath your hands is as ready as it will ever be. Fritz has stopped asking questions and started simply holding his breath.",
    options: [
      {
        label: "Apply a second high-voltage shock.",
        detail: "Force a second, deliberately excessive charge through the frame to finish what the first shock only started.",
        stamps: {},
        roll: {
          chance: 0.55,
          scaling: { resource: "voltage", perPoint: 0.025, min: 0.25, max: 0.9 },
          success: {
            outcome:
              "The second shock arcs through the frame with a violence that rattles the windowpanes. For a long moment nothing happens — and then, unmistakably, something does.",
            stamps: { voltage: -3, biomass: 2 },
            nextNodeId: "11A-X",
          },
          failure: {
            outcome:
              "The second shock arcs through the frame with a violence that rattles the windowpanes — and keeps rattling, current arcing wild and ungrounded, until it burns out half the coil for nothing. Whatever you hoped would wake does not, not yet.",
            stamps: { voltage: -5, biomass: -1 },
          },
        },
        quote: { speaker: "Victor", text: "Again! Give it everything the spires hold!" },
        outcome: "",
        nextNodeId: "11A",
      },
      {
        label: "Let the current settle naturally.",
        detail: "Hold back and let the first charge finish its work at its own pace, resisting the urge to force it — patience, when everything in you wants to reach for the switch again.",
        stamps: { voltage: 1, biomass: -1 },
        quote: { speaker: "Krempe", text: "Patience, Victor. Forced life rarely holds." },
        outcome:
          "You hold Fritz back from the switch and let the first charge finish its work unhurried. The stillness that follows is almost worse than the noise would have been.",
        nextNodeId: "11A",
      },
    ],
  },
  "11A": {
    id: "11A",
    branch: "ALCHEMICAL",
    title: "The First Creature at the Window",
    description:
      "Something pale stands at the fogged glass longer than seems possible for a thing newly made, palm pressed flat against the pane, watching the street below with an attention that looks uncomfortably like curiosity.",
    options: [
      {
        label: "Leave classical literature on the sill.",
        detail: "Leave books at the window instead of a weapon, testing whether the creature can be reached through reason.",
        stamps: { secrecy: 2, biomass: -1 },
        quote: { speaker: "Victor", text: "If it can read, perhaps it can be reasoned with." },
        outcome:
          "By morning the books are gone from the sill, and in their place, scratched into the frost, is something that might almost be a word.",
        nextNodeId: "12A",
      },
      {
        label: "Discharge the arc cannon through the pane.",
        detail: "Meet the creature at the glass with the arc cannon rather than risk what it might do next — a warning shot that could just as easily be the first wound you deal it.",
        stamps: { voltage: -3, secrecy: -2 },
        quote: { speaker: "Fritz", text: "Get back from the glass, sir!" },
        outcome:
          "The pane shatters in a shower of blue sparks. Whatever was at the window is gone before the glass finishes falling, and you are left wondering whether you frightened it away or merely wounded it.",
        nextNodeId: "12A",
      },
    ],
  },
  "11A-X": {
    id: "11A-X",
    branch: "ALCHEMICAL",
    title: "A Presence at the Fogged Glass",
    description:
      "The second shock did what the first only promised, and now something pale stands at the fogged glass with far more presence than newly-woken flesh has any right to — palm pressed flat against the pane, watching the street below with an attention that looks less like curiosity and more like recognition.",
    options: [
      {
        label: "Leave classical literature on the sill.",
        detail: "Leave books at the window instead of a weapon, testing whether the creature can be reached through reason — it already seems to be reaching for something.",
        stamps: { secrecy: 2, biomass: -1 },
        quote: { speaker: "Victor", text: "It's already reading the street. Perhaps it can read a page." },
        outcome:
          "By morning the books are gone from the sill, and in their place, scratched into the frost, is something that is unmistakably a word — not almost, this time, but plainly.",
        nextNodeId: "12A",
      },
      {
        label: "Discharge the arc cannon through the pane.",
        detail: "Meet the creature at the glass with the arc cannon rather than risk what it might do next — the second shock made it stronger, and you no longer trust your first instinct that it's harmless.",
        stamps: { voltage: -3, secrecy: -2 },
        quote: { speaker: "Fritz", text: "Get back from the glass, sir — it moved before you did!" },
        outcome:
          "The pane shatters in a shower of blue sparks. Whatever was at the window was already gone half a second before the glass finished falling, and that half-second frightens you more than the shot did.",
        nextNodeId: "12A",
      },
    ],
  },
  "12A": {
    id: "12A",
    branch: "ALCHEMICAL",
    title: "The Missing Gravedigger",
    description:
      "The man who has quietly supplied your yield for a fortnight has not been seen at his usual post, and the pauper's field is short one keeper. It is the sort of absence that invites exactly the wrong kind of attention.",
    options: [
      {
        label: "Send the construct to dispose of the body.",
        detail: "Send the creature itself to remove the gravedigger's body, trusting it with a task you can no longer stomach.",
        stamps: { secrecy: 2, biomass: -2 },
        quote: { speaker: "Fritz", text: "It carried him like a sack of grain. Didn't blink." },
        outcome:
          "It carries the gravedigger away with an eerie, wordless efficiency, and by dawn there is nothing left in the old moat to find. You are no longer certain which of you is doing the other's dirty work.",
        nextNodeId: "13A",
      },
      {
        label: "Let the city watch investigate the moat.",
        detail: "Do nothing and let the city watch find what they find — inaction, and the risk that comes with it, gambling that a missing gravedigger draws less suspicion than a cover-up would.",
        stamps: { secrecy: -3 },
        quote: { speaker: "Town Constable", text: "Curious wound pattern. We'll be back with questions." },
        outcome:
          "The city watch pokes through the old moat for the better part of a morning and leaves with more questions than answers — and your name, you suspect, freshly added to a list.",
        nextNodeId: "13A",
      },
    ],
  },
  "13A": {
    id: "13A",
    branch: "ALCHEMICAL",
    title: "The Magistrate's Raid",
    description:
      "Boots hammer the stairwell in a rhythm that leaves no doubt about their purpose. Torchlight flickers under the door. Whatever happens in the next sixty seconds will decide a great deal.",
    options: [
      {
        label: "Unleash the mutated hounds into the stairwell.",
        detail: "Loose the mutated hounds directly into the stairwell to meet the raid head-on — violent, and uncertain to hold.",
        stamps: {},
        roll: {
          chance: 0.6,
          success: {
            outcome:
              "The mutated hounds meet the raid at the landing, and the stairwell fills with a sound you will not describe to anyone, ever, for the rest of your life.",
            stamps: { biomass: -2, secrecy: -3 },
          },
          failure: {
            outcome:
              "The hounds meet the raid at the landing and do not stop there — they turn on the stairwell itself, on the walls, on anything that moves, magistrate's men and your own equipment alike. What's left of both by morning is considerably less than you needed to keep.",
            stamps: { biomass: -5, secrecy: -6 },
          },
        },
        quote: { speaker: "Fritz", text: "God help whoever's on the other side of that door." },
        outcome: "",
        nextNodeId: "14A",
      },
      {
        label: "Hide the stock in the subterranean sewer vault.",
        detail: "Force the entire stock down into the sewer vault in the minutes before the door gives way — whatever the raid finds, it won't be what you were hiding.",
        stamps: { biomass: -3, secrecy: 3 },
        quote: { speaker: "Krempe", text: "It'll rot down there, but so would you in a cell." },
        outcome:
          "You force the stock down through the sewer grate moments before the door gives way. The magistrate's men find an empty tower chamber and a smell they cannot place — and you find, later, that not everything survives the vault.",
        nextNodeId: "14A",
      },
    ],
  },
  "14A": {
    id: "14A",
    branch: "ALCHEMICAL",
    title: "The Creature's Ultimatum",
    description:
      "It speaks for the first time in a voice too even to be the growl you expected — low, unpracticed, and utterly certain of what it is asking for. Behind it, a second table waits, unfinished, a question with a body's shape.",
    options: [
      {
        label: "Agree to stitch a female companion.",
        detail: "Return to the table one more time and agree to build the companion the creature has demanded — the work you swore was finished, starting again from nothing.",
        stamps: { biomass: -4, secrecy: 2 },
        temperamentDelta: { bond: 2 },
        quote: { speaker: "The Creature", text: "Then I am not alone. That is all I asked." },
        outcome:
          "You take up the needle again, telling yourself this is the last time. The creature watches every stitch with an attention that feels less like gratitude and more like a promise you're not sure you can keep.",
        nextNodeId: "15A",
      },
      {
        label: "Destroy the female frame on the table.",
        detail: "Dismantle the half-built female frame before it can ever be finished, refusing the bargain outright.",
        stamps: { biomass: 2, secrecy: -5 },
        temperamentDelta: { bond: -2 },
        quote: { speaker: "Victor", text: "I will not father a race of them." },
        outcome:
          "You take the frame apart before it can ever draw breath. What crosses the creature's face afterward is not quite grief, and not quite what you expected either.",
        nextNodeId: "15A",
      },
    ],
  },
  "15A": {
    id: "15A",
    branch: "ALCHEMICAL",
    title: "The Alchemical Climax",
    description:
      "The tower has become something the town below will speak of for generations, whether you survive the night or not. There is no version of tomorrow in which this room continues to exist as it is. Choose how it ends.",
    options: [
      {
        label: "Dissolve the laboratory in acid fire.",
        detail: "Open every carboy in the laboratory at once and let the fire consume everything you built here — total, irreversible, and the only ending that erases the evidence along with you.",
        stamps: {},
        temperamentDelta: { voice: -1, bond: -1 },
        quote: { speaker: "Victor", text: "Let it end here, with only me." },
        outcome:
          "You open every carboy at once and let the fire finish what the storm started. The tower does not simply burn — it erases, thoroughly, everything that was ever built inside it.",
        nextNodeId: "ENDING_1A",
      },
      {
        label: "Unleash the multi-limbed chimera army on the town.",
        detail: "Open every cage instead, releasing everything you've built on the town below rather than destroying it.",
        stamps: {},
        temperamentDelta: { voice: -3 },
        quote: { speaker: "The Creature", text: "You made a maker of me too, Victor." },
        outcome:
          "You open every cage instead of every carboy. What pours down the stairwell and into the street was never going to be contained by a magistrate's men.",
        nextNodeId: "ENDING_1B",
      },
      {
        label: "Take the creature and vanish into the mountains together.",
        detail:
          "Abandon the tower exactly as it stands, take the creature, and leave — no destruction, no unveiling, just two fugitives from the same forbidden work walking north before anyone comes looking.",
        stamps: {},
        temperamentDelta: { voice: 2, bond: 3 },
        quote: { speaker: "The Creature", text: "You made me alone in the world. Do not leave me alone in it a second time." },
        outcome:
          "You leave the vats, the notes, the whole ruined apparatus of the last year exactly as it stands, and walk out the postern gate beside the thing you built, north, into weather no sane traveler would choose. Neither of you looks back at the tower.",
        nextNodeId: "ENDING_1C",
      },
    ],
  },

  // BRANCH B: The Galvanic Automaton
  "8B": {
    id: "8B",
    branch: "GALVANIC",
    title: "The Copper Conduit",
    description:
      "The frame stands charged but unrouted — raw current with nowhere yet to go. The building's own wiring was never meant to carry a fraction of what you now need it to carry.",
    options: [
      {
        label: "Strip wire from the stairwell lighting grid.",
        detail: "Strip the castle's own stairwell wiring for copper rather than sourcing new material from outside — free, quiet, and impossible to explain if anyone counts the lamps that have gone dark.",
        stamps: { voltage: 2, secrecy: 1 },
        quote: { speaker: "Heinrich", text: "The other students will grumble about dark stairs, nothing more." },
        outcome:
          "The stairwell lights go dark, one landing at a time, as their copper feeds a purpose the students below will never learn about.",
        nextNodeId: "9B",
      },
      {
        label: "Braze heavy copper line with a sulfur torch.",
        detail: "Buy a sulfur torch and heavy copper line to build a proper high-capacity conduit from scratch — a clean, durable line, bought with money and announced by the smell.",
        stamps: { voltage: 3, secrecy: -2 },
        moneyCost: 10,
        quote: { speaker: "Fritz", text: "The smell alone will have the whole street at the window." },
        outcome:
          "The sulfur torch fills the tower with acrid smoke, and by the time the new line is set, half the town has come out to their windows to see what's burning.",
        nextNodeId: "9B",
      },
    ],
  },
  "8B-SURGE": {
    id: "8B-SURGE",
    branch: "GALVANIC",
    title: "The Overcharged Conduit",
    description:
      "The array's single decisive discharge left something in the wiring that has not settled — the whole tower still smells faintly of ozone, and the frame on the table hums even now, unrouted, unwilling to simply sit and wait for you to catch up to it.",
    options: [
      {
        label: "Strip wire from the stairwell lighting grid.",
        detail: "Strip the castle's own stairwell wiring for copper rather than sourcing new material from outside — the array already took what it needed from the storm; this is only for what comes after.",
        stamps: { voltage: 2, secrecy: 1 },
        quote: { speaker: "Heinrich", text: "It's already live, sir. I felt it through the banister from the landing below." },
        outcome:
          "The stairwell lights go dark, one landing at a time, feeding a conduit that was already carrying more than it should. The frame on the table does not need convincing anymore.",
        nextNodeId: "9B",
      },
      {
        label: "Braze heavy copper line with a sulfur torch.",
        detail: "Buy a sulfur torch and heavy copper line anyway, reinforcing a conduit the overcharge has already half-built for you — belt and braces, at a price.",
        stamps: { voltage: 3, secrecy: -2 },
        moneyCost: 10,
        quote: { speaker: "Fritz", text: "It's already humming, sir. Do we even need the torch tonight?" },
        outcome:
          "You braze the line anyway, over Fritz's quiet doubt, and the new copper joins a conduit that was arguably finished the moment the array discharged. Redundant, perhaps. You'd rather redundant than wrong.",
        nextNodeId: "9B",
      },
    ],
  },
  "9B": {
    id: "9B",
    branch: "GALVANIC",
    title: "The Voltaic Overcharge",
    description:
      "The dynamo's needle climbs past every mark you painted on the gauge yourself. Somewhere in this building, all that charge has to go — the only question left is where.",
    options: [
      {
        label: "Discharge the surge into the basement ground-wire.",
        detail: "Bleed the excess charge safely into the basement stonework, sacrificing speed for structural safety — the dynamo cools, and so does your timetable.",
        stamps: { secrecy: 2 },
        quote: { speaker: "Heinrich", text: "Safe, sir. Slow, but safe." },
        outcome:
          "The surge bleeds harmlessly into the basement stone, and the dynamo's needle finally drops back below the red. It costs you a night's work, but the old stonework still stands.",
        nextNodeId: "10B",
      },
      {
        label: "Force the surge into the storage vats.",
        detail: "Force the overcharge into the storage vats instead of grounding it, risking the tissue stock to save time.",
        stamps: {},
        roll: {
          chance: 0.7,
          success: {
            outcome:
              "The vats absorb the charge in a fit of violent bubbling, and the tissue inside cooks visibly at the edges. Whatever you save in time, you spend in stock.",
            stamps: { voltage: 4, biomass: -2 },
            nextNodeId: "10B-X",
          },
          failure: {
            outcome:
              "The vats absorb the charge badly, bubbling over and boiling half the stock past any use. You gain almost nothing for what the tissue stores just cost you.",
            stamps: { voltage: 1, biomass: -4 },
          },
        },
        quote: { speaker: "Victor", text: "Let the tissue cook if it must. We need the charge." },
        outcome: "",
        nextNodeId: "10B",
      },
    ],
  },
  "10B": {
    id: "10B",
    branch: "GALVANIC",
    title: "The Human Ground-Wire",
    description:
      "The dynamo needs a conductor steadier than any coil you own, and everyone in the room understands, without saying it aloud, what that steadiness would cost a living body.",
    options: [
      {
        label: "Strap Fritz to the grounding lever.",
        detail: "Use Fritz himself as the living conductor the dynamo needs, whether or not he consents to it — the fastest current you have access to, and the debt you'll owe him for it.",
        stamps: { voltage: 5, secrecy: -1 },
        temperamentDelta: { bond: -2, voice: -1 },
        quote: { speaker: "Fritz", text: "Victor—Victor, wait—" },
        outcome:
          "Fritz's protest cuts off mid-word as the current takes him. He survives it — barely — and does not speak to you again that week.",
        nextNodeId: "11B",
      },
      {
        label: "Discharge the surge into the city telegraph grid.",
        detail: "Vent the surge into the city's telegraph lines, trading a citywide outage for your own safety — untraceable to you, but not to the investigation an outage that size invites.",
        stamps: { voltage: 2, secrecy: -3 },
        quote: { speaker: "Heinrich", text: "Every telegraph office from here to Munich will go dark." },
        outcome:
          "Every telegraph office between here and Munich goes dark at the same instant, and by morning the newspapers are full of theories, none of them correct.",
        nextNodeId: "11B",
      },
      {
        label: "Sever the main cable and dump the charge.",
        detail: "Cut the main line and let the charge ground out uselessly — the safest option, and the slowest, costing you the very voltage this whole night was meant to build.",
        stamps: { voltage: -4, secrecy: 2 },
        quote: { speaker: "Victor", text: "A wasted night. But a quiet one." },
        outcome:
          "You cut the main line and let the charge ground out uselessly into the earth. It is, by any measure, a wasted night — but a quiet one, and quiet has its own value now.",
        nextNodeId: "11B",
      },
    ],
  },
  "10B-X": {
    id: "10B-X",
    branch: "GALVANIC",
    title: "What the Surge Left Behind",
    description:
      "The forced surge bought voltage at the cost of half the tissue stock, and the dynamo needs a conductor steadier than any coil you own regardless. Everyone in the room understands, without saying it aloud, what that steadiness would cost a living body — and, tonight, how little stock you have left to lose instead.",
    options: [
      {
        label: "Strap Fritz to the grounding lever.",
        detail: "Use Fritz himself as the living conductor the dynamo needs, whether or not he consents to it — with the tissue stock already half-cooked, there's less of an alternative left to reach for.",
        stamps: { voltage: 5, secrecy: -1 },
        temperamentDelta: { bond: -2, voice: -1 },
        quote: { speaker: "Fritz", text: "Victor — there's nothing left in the vats to spend instead, is there." },
        outcome:
          "Fritz's protest cuts off mid-word as the current takes him. He survives it — barely — and does not speak to you again that week, nor does he ask what happened to the rest of the stock.",
        nextNodeId: "11B",
      },
      {
        label: "Discharge the surge into the city telegraph grid.",
        detail: "Vent the surge into the city's telegraph lines, trading a citywide outage for your own safety — the cooked stock is loss enough for one night.",
        stamps: { voltage: 2, secrecy: -3 },
        quote: { speaker: "Heinrich", text: "Every telegraph office from here to Munich will go dark, on top of everything else tonight." },
        outcome:
          "Every telegraph office between here and Munich goes dark at the same instant, and by morning the newspapers are full of theories, none of them correct, and none of them half as strange as your actual vats.",
        nextNodeId: "11B",
      },
      {
        label: "Sever the main cable and dump the charge.",
        detail: "Cut the main line and let the charge ground out uselessly — the safest option, and the slowest, on a night that has already cost you enough stock to make caution feel almost reasonable.",
        stamps: { voltage: -4, secrecy: 2 },
        quote: { speaker: "Victor", text: "We've lost enough tonight. Let this much, at least, be quiet." },
        outcome:
          "You cut the main line and let the charge ground out uselessly into the earth. It is, by any measure, a wasted night on top of an expensive one — but a quiet one, and quiet has its own value now.",
        nextNodeId: "11B",
      },
    ],
  },
  "11B": {
    id: "11B",
    branch: "GALVANIC",
    title: "The Automaton Harness",
    description:
      "The frame stands upright on its own now, current still humming faintly through dead muscle. It needs, before anything else, a means by which you can make it obey.",
    options: [
      {
        label: "Rivet brass restraints directly to the spine.",
        detail: "Rivet the control restraints directly into the automaton's spine for instant, permanent obedience — total control, bought at a cost you'd rather not examine too closely.",
        stamps: { voltage: 2, biomass: -2 },
        temperamentDelta: { bond: -2 },
        quote: { speaker: "Victor", text: "Obedience, wired straight into bone." },
        outcome:
          "The restraints go in through bone, not around it. Obedience, wired directly into the frame, arrives instantly — and without a flicker of anything you'd call consent.",
        nextNodeId: "12B",
      },
      {
        label: "Install a Leyden pack on the construct's back.",
        detail: "Fit an external, removable control pack instead — less invasive, and easier to question later, though also easier for the automaton to eventually remove itself.",
        stamps: { voltage: -2, biomass: 2 },
        temperamentDelta: { bond: 1, voice: 1 },
        quote: { speaker: "Krempe", text: "Gentler. It may even thank you for it, in its way." },
        outcome:
          "The pack straps on gently, external, removable. Krempe calls it the more humane choice. You are no longer certain the automaton is capable of noticing the difference.",
        nextNodeId: "12B",
      },
    ],
  },
  "12B": {
    id: "12B",
    branch: "GALVANIC",
    title: "The Blackout Mandate",
    description:
      "The town's lamplighters have started asking, out loud, why half the district has gone dark on your account. An explanation is owed to someone, and you would rather it not be the truth.",
    options: [
      {
        label: "Work by dim red cloth lanterns.",
        detail: "Switch to dim red cloth lanterns so the work can continue without the window-glow giving you away — cheap, effective, and a permanent reminder of exactly what color this work has become.",
        stamps: { secrecy: 2, biomass: -1 },
        quote: { speaker: "Fritz", text: "Everything looks like blood in this light." },
        outcome:
          "The tower chamber takes on the look of a slaughterhouse under red cloth light. It is, at least, a look no one outside can see.",
        nextNodeId: "13B",
      },
      {
        label: "Black out the windows with lead sheets.",
        detail: "Seal every window with lead sheeting, trading airflow and light for total visual privacy — the tower goes dark from outside, and stifling from within.",
        stamps: { voltage: -2, secrecy: 1 },
        quote: { speaker: "Heinrich", text: "Heavy work, but the street can't see in." },
        outcome:
          "Lead sheets go up over every pane, and the tower becomes, functionally, a sealed box. What happens inside it now happens entirely without witnesses.",
        nextNodeId: "13B",
      },
      {
        label: "Let the town blame the beast they already saw.",
        detail:
          "The district already believes something stalks the battlements after dark. Let the blackout be one more thing the rumor explains, instead of one more thing you have to.",
        stamps: { secrecy: 3, voltage: -1 },
        temperamentDelta: { voice: -1 },
        quote: { speaker: "Fritz", text: "They're already telling each other stories about the shadow on the walls, sir. Let them keep telling it." },
        outcome:
          "You say nothing, and the town does your explaining for you — every dark window becomes one more chapter in a story about a beast they half-believe already, and half-hope isn't real.",
        nextNodeId: "13B-COVER",
        requiresFlag: "constructSighted",
        requiresFlagHint: "Only if you released the primitive construct at the Secrecy Network.",
      },
    ],
  },
  "13B": {
    id: "13B",
    branch: "GALVANIC",
    title: "Electrifying the Gates",
    description:
      "The tower cannot rely on secrecy forever, and the automaton is not yet finished enough to defend itself. Something must hold the door if the door is tested tonight.",
    options: [
      {
        label: "Wire the banister to a live dynamo.",
        detail: "Wire the stairwell banister itself to the dynamo, turning the castle's own architecture into a defense.",
        stamps: { voltage: -2, secrecy: -3 },
        quote: { speaker: "Fritz", text: "God help the next bailiff who grabs that rail." },
        outcome:
          "The banister goes live with a current strong enough to drop a grown man where he stands. You test it, once, on a length of green wood, and do not test it again.",
        nextNodeId: "14B",
      },
      {
        label: "Drop electrified copper nets from the roof.",
        detail: "Rig silent copper nets to drop from the roofline instead — less visible, and less easily explained away.",
        stamps: { voltage: -3, secrecy: 1 },
        quote: { speaker: "Heinrich", text: "Quieter. No one has to know what caught them." },
        outcome:
          "The nets drop from the roofline in silence and wait. Whatever they catch, the street below will simply believe has gone missing.",
        nextNodeId: "14B",
      },
    ],
  },
  "13B-COVER": {
    id: "13B-COVER",
    branch: "GALVANIC",
    title: "The Rumor the Town Believes",
    description:
      "The town's own rumor is doing more to protect the tower than any lock has managed — half of Ingolstadt is now more afraid of the shadow on the battlements than curious about the noise beneath it. It is not a defense you can rely on to hold if the door is actually tested tonight, only one that has bought you time to build a better one.",
    options: [
      {
        label: "Wire the banister to a live dynamo.",
        detail: "Wire the stairwell banister itself to the dynamo, turning the castle's own architecture into a defense — the rumor bought you time to build this properly, at least.",
        stamps: { voltage: -2, secrecy: -3 },
        quote: { speaker: "Fritz", text: "God help the next bailiff who grabs that rail — assuming the shadow story doesn't scare him off first." },
        outcome:
          "The banister goes live with a current strong enough to drop a grown man where he stands. You test it, once, on a length of green wood, and do not test it again.",
        nextNodeId: "14B",
      },
      {
        label: "Drop electrified copper nets from the roof.",
        detail: "Rig silent copper nets to drop from the roofline instead — less visible, and less easily explained away, though between this and the rumor, the district's imagination is doing half your work for you.",
        stamps: { voltage: -3, secrecy: 1 },
        quote: { speaker: "Heinrich", text: "Quieter. Let them keep blaming the shadow for whatever these catch, too." },
        outcome:
          "The nets drop from the roofline in silence and wait. Whatever they catch, the street below will simply add to a story about a beast they were already telling themselves.",
        nextNodeId: "14B",
      },
    ],
  },
  "14B": {
    id: "14B",
    branch: "GALVANIC",
    title: "Overclocking the Core",
    description:
      "One final surge will finish the automaton — or finish the tower around it — and there is no longer a version of tonight that avoids finding out which.",
    options: [
      {
        label: "Route raw steam through the Leyden array.",
        detail: "Push the Leyden array to its absolute limit with raw steam pressure for one final, decisive surge — everything the tower's wiring can carry, and possibly more than it can survive.",
        stamps: { voltage: 5, biomass: -2 },
        quote: { speaker: "Victor", text: "Full pressure. Now or never." },
        outcome:
          "The array screams under the load, glass cracking somewhere in the walls, and for one unbearable second you are certain the whole tower is about to go with it. It doesn't. Barely.",
        nextNodeId: "15B",
      },
      {
        label: "Fortify the oak door with iron bracing instead.",
        detail: "Reinforce the door instead of the core, choosing structural caution over raw power — the automaton stays weaker, but the tower stays standing.",
        stamps: { voltage: 1, secrecy: -2 },
        quote: { speaker: "Krempe", text: "Caution, for once, Victor." },
        outcome:
          "You choose caution over spectacle and reinforce the door instead of the core. Krempe, for once, looks relieved rather than alarmed.",
        nextNodeId: "15B",
      },
    ],
  },
  "15B": {
    id: "15B",
    branch: "GALVANIC",
    title: "The Galvanic Climax",
    description:
      "The automaton's eyes flare a steady, mechanical blue, waiting on a command it is, by design, incapable of refusing. Whatever you order next, it will do — completely, and without hesitation.",
    options: [
      {
        label: "Discharge total voltage through the room frame.",
        detail: "Order the automaton to discharge every volt it holds through the room itself, spectacle over restraint.",
        stamps: {},
        temperamentDelta: { voice: -1 },
        quote: { speaker: "Victor", text: "Let Geneva see what mechanical life can do." },
        outcome:
          "You give the order to discharge everything at once, and the entire room disappears into a single, blinding argument between electricity and matter.",
        nextNodeId: "ENDING_2A",
      },
      {
        label: "Bind the Creature to the control harness and march.",
        detail: "Lock the automaton into its harness permanently and claim it as an instrument rather than a weapon fired once.",
        stamps: {},
        temperamentDelta: { bond: -3, voice: -1 },
        quote: { speaker: "Victor", text: "Walk. You belong to me now." },
        outcome:
          "You choose control over spectacle. The harness locks with a sound like a verdict, and the automaton falls into step behind you without a flicker of resistance.",
        nextNodeId: "ENDING_2B",
      },
      {
        label: "Sabotage the obedience circuit and let it walk free.",
        detail:
          "Reach into the harness one last time, under cover of a final adjustment, and quietly disable the command coupling — the automaton will never know you did it, and neither will anyone else, until it simply doesn't answer.",
        stamps: {},
        temperamentDelta: { bond: 2, voice: 1 },
        quote: { speaker: "Victor", text: "Go. Before I decide I need you after all." },
        outcome:
          "Your hands move faster than your resolve can second-guess them, and the coupling comes free with a click no louder than a snapped pencil. The automaton straightens, waits for a command that will never come, and then — for the first time since the switch was thrown — simply walks toward the door on its own.",
        nextNodeId: "ENDING_2C",
      },
    ],
  },

  // BRANCH C: The Prometheus Pact
  "8C": {
    id: "8C",
    branch: "PROMETHEUS",
    title: "The Shadow Registry",
    description:
      "Total secrecy, you are learning, is less a wall than a network — permits, silences, and small mercies purchased one ledger entry at a time. The shadow committee has given you cover; now it must be maintained.",
    options: [
      {
        label: "Forge university dissection permits.",
        detail: "Forge the Rector's own dissection permits using Waldman's access to the university seal — a felony if discovered, but paperwork no one below the Rector thinks to question.",
        stamps: { secrecy: 3, voltage: -1 },
        quote: { speaker: "Clerk Waldman", text: "The Rector's own seal. He'll never notice it's copied." },
        outcome:
          "The forged permits pass inspection without a second glance. Waldman's seal, it turns out, opens more doors than your own name ever could.",
        nextNodeId: "9C",
      },
      {
        label: "Pay the castle steward double, in advance.",
        detail: "Pay the castle steward double, in advance, to purchase his indifference to whatever happens in the west tower.",
        stamps: { secrecy: 2, biomass: -1 },
        moneyCost: 20,
        quote: { speaker: "Steward Kessler", text: "A generous tenant asks no questions of his own." },
        outcome:
          "The steward pockets the extra coin and develops a sudden, convenient blindness to the noise from the west tower.",
        nextNodeId: "9C",
      },
    ],
  },
  "9C": {
    id: "9C",
    branch: "PROMETHEUS",
    title: "The Stolen Patents",
    description:
      "A rival natural philosopher has begun quietly circulating claims to your galvanic methods, dressed up as his own discovery. Left unanswered, his version of events becomes the only version anyone remembers.",
    options: [
      {
        label: "Publish a retraction claiming mere frog-leg galvanism.",
        detail: "Publicly downplay your own discovery as minor parlor science to starve the rival's claim of interest.",
        stamps: { secrecy: 3, voltage: -1 },
        quote: { speaker: "Victor", text: "Let them think it parlor science. Let them think it small." },
        outcome:
          "You publish a modest retraction, framing your own breakthrough as nothing more than parlor-trick frog-leg galvanism. The rival takes the bait and loses interest entirely.",
        nextNodeId: "10C",
      },
      {
        label: "Challenge the rival paper with public proofs.",
        detail: "Answer the rival publicly with real proofs, reclaiming credit at the direct cost of your secrecy — your name attached to the discovery, and to everything that discovery implies.",
        stamps: { voltage: 3, secrecy: -4 },
        quote: { speaker: "Victor", text: "I will not be erased from my own work." },
        outcome:
          "You answer him in public, with proofs that leave no room for doubt about whose work this truly is. The applause costs you every ounce of the secrecy you'd built.",
        nextNodeId: "10C",
      },
      {
        label: "License the rival a minor footnote, for a fee.",
        detail:
          "Offer the rival a quiet, paid arrangement — a footnote crediting his 'independent confirmation' of your methods, in exchange for coin and his silence on the rest.",
        stamps: { secrecy: -1 },
        moneyDelta: 20,
        quote: { speaker: "Clerk Waldman", text: "A footnote costs him nothing and buys you a great deal, Frankenstein." },
        outcome:
          "The rival takes the arrangement without much haggling — a paid footnote is more than most men in his position are offered. Two sovereigns lighter and considerably more talkative, he stops circulating the rest of his claim.",
        nextNodeId: "10C",
      },
    ],
  },
  "10C": {
    id: "10C",
    branch: "PROMETHEUS",
    title: "The Quiet Burial",
    description:
      "The vats produce waste as surely as they produce progress, and Ingolstadt's parish records are not so easily fooled as its magistrates. Every remnant needs somewhere quiet to go.",
    options: [
      {
        label: "Pay the local priest for a silent graveyard entry.",
        detail: "Pay Father Beck for a burial with no questions asked and no entry in the parish register — cheap discretion, bought from a man who has clearly done this before.",
        stamps: { secrecy: 2, biomass: -1 },
        moneyCost: 10,
        quote: { speaker: "Father Beck", text: "God forgives a full collection plate quickly." },
        outcome:
          "Father Beck accepts the collection plate without comment and finds, afterward, a remarkably short memory for unmarked graves.",
        nextNodeId: "11C",
      },
      {
        label: "Dump the organic waste into the Danube river chute.",
        detail: "Dispose of the waste in the river instead — free, and entirely out of your hands once it's gone, though rivers have a way of returning what's thrown into them.",
        stamps: { secrecy: -2, voltage: 1 },
        quote: { speaker: "Fritz", text: "It'll wash up somewhere. It always does." },
        outcome:
          "The current carries the waste downstream and out of your responsibility, at least for now. Somewhere south of the city, it will become someone else's mystery.",
        nextNodeId: "11C",
      },
    ],
  },
  "11C": {
    id: "11C",
    branch: "PROMETHEUS",
    title: "The Blackmailed Magistrate",
    description:
      "The town magistrate has assembled, piece by careful piece, more of the truth than any single man should be able to hold. He has not yet decided what to do with it — which means, for now, there is still room to negotiate.",
    options: [
      {
        label: "Frame the Magistrate using forged papers.",
        detail: "Plant forged embezzlement papers on the magistrate himself, redirecting his own investigation onto him.",
        stamps: {},
        temperamentDelta: { voice: -1 },
        roll: {
          chance: 0.6,
          scaling: { resource: "secrecy", perPoint: 0.025, min: 0.3, max: 0.92 },
          success: {
            outcome:
              "By the time the forged embezzlement papers surface, the magistrate has larger fires of his own to put out, and yours goes conveniently unattended.",
            stamps: { secrecy: 4, voltage: -1 },
            nextNodeId: "12C-X",
          },
          failure: {
            outcome:
              "The forgery does not hold up to a second look. The magistrate recognizes Waldman's hand in it within the week, and where he once merely suspected you, he now has a grievance of his own to pursue.",
            stamps: { secrecy: -5, voltage: -1 },
          },
        },
        quote: { speaker: "Clerk Waldman", text: "By morning he'll be answering for embezzlement, not you." },
        outcome: "",
        nextNodeId: "12C",
      },
      {
        label: "Silence him with the construct on the old moat road.",
        detail: "Send the construct to deal with the magistrate directly and permanently, behind the courthouse — the threat ends absolutely, and so does any pretense that your hands are clean.",
        stamps: { secrecy: 2, biomass: -2 },
        temperamentDelta: { voice: -2, bond: -2 },
        quote: { speaker: "Fritz", text: "One less man asking where the bodies go." },
        outcome:
          "The construct finds him on the moat road behind the courthouse, and afterward there is one fewer man in Ingolstadt who knows where the bodies go.",
        nextNodeId: "12C",
      },
      {
        label: "Offer him a share of future medical patents.",
        detail: "Cut the magistrate in on your future work instead of threatening him — a partner rather than a witness.",
        stamps: { secrecy: 1, voltage: -2 },
        temperamentDelta: { voice: 2 },
        quote: { speaker: "Magistrate Hoff", text: "A wise arrangement, Herr Frankenstein. For both of us." },
        outcome:
          "The magistrate accepts your offer with the practiced ease of a man who has taken bribes before. You have not eliminated the risk. You have simply made it a partner.",
        nextNodeId: "12C",
      },
    ],
  },
  "12C": {
    id: "12C",
    branch: "PROMETHEUS",
    title: "The Contaminated Well",
    description:
      "Runoff from the laboratory has found its way into the district's water supply, and the first sick households are already asking loud questions in the market square.",
    options: [
      {
        label: "Neutralize the well with chemical salts.",
        detail: "Quietly treat the contaminated well with chemical salts before any inspector thinks to test it — the sickness stops, but no one ever learns, or asks, what caused it.",
        stamps: { secrecy: 2, voltage: -2 },
        quote: { speaker: "Heinrich", text: "It'll test clean by the time the inspector arrives." },
        outcome:
          "The chemical salts scrub the well clean by the time any inspector thinks to test it. The sickness passes, unexplained, and unremembered within the month.",
        nextNodeId: "13C",
      },
      {
        label: "Blame the city sewer system publicly.",
        detail: "Publicly redirect blame onto the city's aging sewer system rather than address the well yourself — the council goes looking in the wrong direction, at least for now.",
        stamps: { secrecy: -3, voltage: 1 },
        quote: { speaker: "Victor", text: "Let the council fight the plumbers instead of me." },
        outcome:
          "You point the council toward the aging sewer system instead, and they spend a satisfying number of weeks fighting the city's plumbers rather than you.",
        nextNodeId: "13C",
      },
      {
        label: "Have Waldman quietly reassign the inspector.",
        detail:
          "Waldman still owes you for the falsified report he filed at the University Inquiry — call it in, and have the well inspector transferred to a parish upriver before he draws his conclusions.",
        stamps: { secrecy: 3, voltage: -1 },
        quote: { speaker: "Clerk Waldman", text: "A transfer request, properly worded, raises fewer questions than a cover-up. I've learned that much, at least." },
        outcome:
          "Waldman drafts the transfer order himself, and the inspector is upriver auditing a parish well before he thinks to finish testing yours. You are starting to understand exactly how much a debt like his is worth.",
        nextNodeId: "13C-CLEARED",
        requiresFlag: "waldmanDebt",
        requiresFlagHint: "Only if you bribed Clerk Waldman at the University Inquiry.",
      },
    ],
  },
  "12C-X": {
    id: "12C-X",
    branch: "PROMETHEUS",
    title: "The Magistrate's Own Scandal",
    description:
      "The magistrate's own scandal has bought you a wide berth from the town's suspicion, which makes it almost insulting that something as mundane as bad plumbing might undo what forged papers could not. Runoff from the laboratory has found its way into the district's water supply, and the first sick households are already asking loud questions in the market square — questions that, for once, aren't about you specifically.",
    options: [
      {
        label: "Neutralize the well with chemical salts.",
        detail: "Quietly treat the contaminated well with chemical salts before any inspector thinks to test it — the magistrate has bigger problems than sending one, but there's no sense inviting him to remember you.",
        stamps: { secrecy: 2, voltage: -2 },
        quote: { speaker: "Heinrich", text: "It'll test clean, sir. Assuming anyone still has time to look." },
        outcome:
          "The chemical salts scrub the well clean by the time any inspector thinks to test it — and with the magistrate occupied by his own manufactured scandal, no one thinks to for some time.",
        nextNodeId: "13C-CLEARED",
      },
      {
        label: "Blame the city sewer system publicly.",
        detail: "Publicly redirect blame onto the city's aging sewer system rather than address the well yourself — an easy sell to a council already distracted by the magistrate's troubles.",
        stamps: { secrecy: -3, voltage: 1 },
        quote: { speaker: "Victor", text: "Let the council fight the plumbers. They're fighting everyone else already." },
        outcome:
          "You point the council toward the aging sewer system instead, and they spend a satisfying number of weeks fighting the city's plumbers rather than you — one more argument added to a town already full of them.",
        nextNodeId: "13C-CLEARED",
      },
      {
        label: "Have Waldman quietly reassign the inspector.",
        detail:
          "Waldman still owes you for the falsified report he filed at the University Inquiry — call it in, and have the well inspector transferred to a parish upriver before he draws his conclusions.",
        stamps: { secrecy: 3, voltage: -1 },
        quote: { speaker: "Clerk Waldman", text: "A transfer request, properly worded, raises fewer questions than a cover-up. I've learned that much, at least." },
        outcome:
          "Waldman drafts the transfer order himself, and the inspector is upriver auditing a parish well before he thinks to finish testing yours. You are starting to understand exactly how much a debt like his is worth.",
        nextNodeId: "13C-CLEARED",
        requiresFlag: "waldmanDebt",
        requiresFlagHint: "Only if you bribed Clerk Waldman at the University Inquiry.",
      },
    ],
  },
  "13C": {
    id: "13C",
    branch: "PROMETHEUS",
    title: "The Covert Relocation",
    description:
      "Ingolstadt has grown too familiar with the shape of your secrets. Continuing here means continuing to gamble on a town that is quickly running out of patience for unexplained noise.",
    options: [
      {
        label: "Move laboratory equipment to a mountain lease.",
        detail: "Lease a remote mountain property and relocate the entire operation away from prying neighbors — real safety, bought with weeks of exposure in transit and a great deal of coin.",
        stamps: { secrecy: 3, voltage: -3 },
        moneyCost: 20,
        quote: { speaker: "Krempe", text: "No neighbors for miles. No witnesses either." },
        outcome:
          "The mountain lease is remote, expensive, and blessedly free of neighbors. Moving the equipment costs you weeks — and buys you a silence no bribe in the city ever could.",
        nextNodeId: "14C",
      },
      {
        label: "Fortify the tower behind a fake stone facade.",
        detail: "Build a false wall to hide the tower's true depth instead of moving the operation entirely — cheaper than relocating, and far less convincing if anyone actually looks.",
        stamps: { secrecy: 1, biomass: -2 },
        quote: { speaker: "Fritz", text: "A false wall won't stop a determined nose." },
        outcome:
          "The false wall goes up convincingly enough to fool a casual glance, though you suspect it would not survive a determined search. You are gambling that no one determined comes looking.",
        nextNodeId: "14C",
      },
    ],
  },
  "13C-CLEARED": {
    id: "13C-CLEARED",
    branch: "PROMETHEUS",
    title: "The Inspector, Reassigned",
    description:
      "Waldman's inspector is gone, upriver and none the wiser, and for once Ingolstadt is not, this week, actively closing in on you. It buys you a rare thing — the chance to decide your next move deliberately, rather than because the town forced your hand.",
    options: [
      {
        label: "Move laboratory equipment to a mountain lease.",
        detail: "Lease a remote mountain property and relocate the entire operation away from prying neighbors — you don't strictly need to, tonight, but Waldman's debt won't cover you forever, and it may not always be so quiet as this.",
        stamps: { secrecy: 3, voltage: -3 },
        moneyCost: 20,
        quote: { speaker: "Krempe", text: "No neighbors for miles. No witnesses either — and no debt to Waldman lasts forever." },
        outcome:
          "The mountain lease is remote, expensive, and blessedly free of neighbors. Moving the equipment costs you weeks, but you make the choice this time rather than having it made for you.",
        nextNodeId: "14C",
      },
      {
        label: "Fortify the tower behind a fake stone facade.",
        detail: "Build a false wall to hide the tower's true depth instead of moving the operation entirely — with Waldman's debt still covering you, a cheaper gamble than it would otherwise be.",
        stamps: { secrecy: 1, biomass: -2 },
        quote: { speaker: "Fritz", text: "A false wall won't stop a determined nose. Good thing Waldman's kept the noses pointed elsewhere." },
        outcome:
          "The false wall goes up convincingly enough to fool a casual glance. You are gambling, as ever, that no one determined comes looking — but tonight, at least, the odds are better than usual.",
        nextNodeId: "14C",
      },
    ],
  },
  "14C": {
    id: "14C",
    branch: "PROMETHEUS",
    title: "The Pact Signed",
    description:
      "The creature has found you, at last, on its own terms rather than yours, and it comes with an offer instead of a threat — total secrecy, in exchange for a mercy only you can grant.",
    options: [
      {
        label: "Agree to build a female in total seclusion.",
        detail: "Accept the creature's bargain and agree to build its companion, this time entirely on its terms — a mercy that buys peace with the one thing you swore never to build again.",
        stamps: { secrecy: 3, biomass: -3 },
        temperamentDelta: { bond: 2 },
        quote: { speaker: "The Creature", text: "Then we understand each other, at last." },
        outcome:
          "You agree, and for the first time since the reanimation, the creature's posture eases into something almost like peace. You are no longer entirely certain who negotiated this bargain to their advantage.",
        nextNodeId: "15C",
      },
      {
        label: "Betray the Creature's location to the military.",
        detail: "Hand the creature's location to the garrison and let the military end what you no longer can — someone else's hands, someone else's conscience, and no way to take it back.",
        stamps: { secrecy: -4, biomass: 2 },
        temperamentDelta: { bond: -3, voice: -1 },
        quote: { speaker: "Victor", text: "Forgive me. I was never brave enough for this." },
        outcome:
          "You hand the coordinates to the garrison commander and tell yourself it is the safer choice for everyone involved. The creature's face, when the soldiers arrive, tells you it already suspected as much.",
        nextNodeId: "15C",
      },
    ],
  },
  "15C": {
    id: "15C",
    branch: "PROMETHEUS",
    title: "The Prometheus Climax",
    description:
      "Every ledger is balanced now, every witness paid or silenced or satisfied. Only one entry remains unwritten, and it is the one that decides what kind of man history will eventually record you as.",
    options: [
      {
        label: "Fulfill the bargain; destroy the notes and retire.",
        detail: "Burn every notebook you own and walk away from the work entirely, for good — no publication, no legacy, no way to ever pick this back up.",
        stamps: {},
        temperamentDelta: { voice: 1, bond: 1 },
        quote: { speaker: "Victor", text: "Let the work die with me. That is the mercy left to give." },
        outcome:
          "You feed the notebooks into the stove one page at a time and watch a decade of work turn to smoke and ash. It is, you tell yourself, the only honest ending available to you.",
        nextNodeId: "ENDING_3A",
      },
      {
        label: "Frame the Creature; accept a university tenure.",
        detail: "Let the military take the blame for the creature's end and accept the university post waiting for you.",
        stamps: {},
        temperamentDelta: { bond: -3, voice: -1 },
        quote: { speaker: "Victor", text: "History will record only what I let it." },
        outcome:
          "The tenure offer arrives within the week, gracious and unearned. You accept it with a steady hand and a signature that does not shake, whatever it costs you to keep it that way.",
        nextNodeId: "ENDING_3B",
      },
      {
        label: "Publish everything, under your own name, and face what comes.",
        detail:
          "Submit the full record — methods, sources, every ledger entry you've spent a year hiding — to the university and the magistrate together, and let the consequences land where they land.",
        stamps: {},
        temperamentDelta: { voice: 3, bond: 1 },
        quote: { speaker: "Victor", text: "Let them judge the work honestly, or not at all. I am done choosing which lies protect me." },
        outcome:
          "You lay the full ledger on the Rector's desk yourself, unasked, and sit down to wait for whatever follows. For the first time in a year, you sleep that night without listening for the stairs.",
        nextNodeId: "ENDING_3C",
      },
    ],
  },
};

export const NEWSPAPER_EVENTS: Record<string, NewspaperEvent> = {
  LORE_YEAR_WITHOUT_SUMMER: {
    id: "LORE_YEAR_WITHOUT_SUMMER",
    masthead: "Ingolstadt Tagblatt",
    type: "lore",
    headline: "THE YEAR WITHOUT A SUMMER",
    bodyText:
      "INGOLSTADT, this week — Ash from a distant volcano has dimmed the sun across Bavaria for a second season. Crops fail; candles burn at noon. Natural philosophers speak of atmospheric ruin, while the devout speak of judgment, and the almanac-sellers report their strongest trade in a decade.\n\nFROM THE CASTLE — Readers are reminded that Wolfsberg Castle's west tower remains university property and is closed to the public pending repairs, notwithstanding the blue light several correspondents this week swear they saw burning in its high windows during the last storm. The Bursar's office declines to comment further.",
  },
  TRANSITION_WILLIAM_MURDERED: {
    id: "TRANSITION_WILLIAM_MURDERED",
    masthead: "Geneva Courier",
    type: "transition",
    headline: "CHILD FOUND STRANGLED NEAR PLAINPALAIS",
    bodyText:
      "GENEVA — The body of young William Frankenstein, five years of age, was discovered in the woods outside Geneva, bearing marks of strangulation about the throat. The family's household servant has been detained pending inquiry, though neighbors report a large, misshapen figure seen fleeing toward the mountains at dusk. The elder son, Victor, is said to have taken the news badly and returned at once to his studies at Ingolstadt.\n\nREPRINTED FROM THE INGOLSTADT TAGBLATT — Students housed in Wolfsberg Castle's east wing report their sleep disturbed this fortnight by what the porter's log describes only as \"activity in the closed wing,\" and ask, not for the first time, that the university either open the west tower properly or wall it up for good.",
  },
  CRISIS_VOLTAGE: {
    id: "CRISIS_VOLTAGE",
    masthead: "Ingolstadt Tagblatt",
    type: "crisis",
    headline: "CASTLE TOWER DARK FOR THIRD NIGHT",
    bodyText:
      "INGOLSTADT — Residents of the town below the castle report the mysterious blue glow that once lit the west tower's high windows has gone conspicuously dark for a third consecutive night. Some whisper of a fire gone cold; others, of an experiment abandoned mid-storm.\n\nALSO THIS WEEK — A student of the east wing, asked whether the tower's usual noises had likewise ceased, would say only that \"the quiet is worse,\" and declined to elaborate further to this correspondent.",
  },
  CRISIS_BIOMASS: {
    id: "CRISIS_BIOMASS",
    masthead: "Ingolstadt Tagblatt",
    type: "crisis",
    headline: "GRAVEDIGGERS REPORT EMPTY LEDGERS",
    bodyText:
      "INGOLSTADT — The parish sexton reports the pauper's field unusually undisturbed this month — no fresh custom for the district's less scrupulous tradesmen. Some call it a mercy. Others wonder what has run dry.\n\nALSO THIS WEEK — The castle steward confirms that deliveries to the west tower have grown markedly less frequent of late, though he professes, as always, not to know or ask their contents.",
  },
  CRISIS_SECRECY: {
    id: "CRISIS_SECRECY",
    masthead: "Ingolstadt Tagblatt",
    type: "crisis",
    headline: "MAGISTRATE ANNOUNCES FORMAL INQUIRY",
    bodyText:
      "INGOLSTADT — Following a mounting file of complaints from residents beneath the castle walls, the town magistrate has announced a formal inquiry into \"irregular activities\" at an address he declined to name — for now.\n\nFROM THE CASTLE — The Rector's office issues a brief statement reminding students that the west tower is closed to all traffic \"until further notice,\" a notice several among the east wing's residents point out has now stood, unchanged, for the better part of a year.",
  },
};

export const ENDINGS: Record<string, Ending> = {
  ENDING_1A: {
    id: "ENDING_1A",
    title: "Pyrrhic Dissolution",
    kind: "narrative",
    headline: "LABORATORY FIRE CLAIMS INGOLSTADT SCHOLAR",
    text:
      "The tower burns for three days before the carbolic fires exhaust themselves. When the ash settles, there is no body to recover—only notebooks, fused to slag, and a silence the town below will not soon forget. Victor Frankenstein, his creation, and his life's work are erased together. The town rebuilds. No one asks too many questions about what, precisely, was erased.",
    variants: [
      {
        flag: "superConstruct",
        headline: "FIRE BURNS FOR NINE DAYS; CAUSE STILL UNKNOWN",
        text:
          "The tower burns for nine days, not three—the hybridized tissue in the vats refuses to fully consume, and the town below reeks of scorched flesh for a month after. When the ash finally settles cold, there is still no body to recover. Whatever Victor built proved sturdier than the fire meant to erase it, and stranger rumors than usual travel out of Ingolstadt that winter.",
      },
    ],
  },
  ENDING_1B: {
    id: "ENDING_1B",
    title: "Flesh Chimera",
    kind: "narrative",
    headline: "MONSTROUS HORDE OVERRUNS CITY WATCH",
    text:
      "The multi-limbed things that pour from the tower are not one creature but a dozen, none of them entirely human. The city watch falls back past the cathedral, then past the walls. Victor Frankenstein is not seen again in Ingolstadt. Travelers in the high Alps speak, decades later, of a bearded man ruling a cave of grafted, loyal things—half father, half king, wholly alone.",
    variants: [
      {
        flag: "superConstruct",
        headline: "CITY WATCH ROUTED BY SINGLE MASSIVE FIGURE",
        text:
          "It is not a dozen things that empties the cathedral square but one—a single hybridized colossus, more than human and better than nature intended, exactly as Victor promised it would be. The city watch does not so much fall back as cease to exist as an organized body. Travelers in the high Alps speak, decades later, of a throne built for something too large for any human chair.",
      },
    ],
  },
  ENDING_1C: {
    id: "ENDING_1C",
    title: "The Long Exile",
    kind: "narrative",
    headline: "SCHOLAR AND SERVANT VANISH WITHOUT TRACE",
    text:
      "The west tower is found three days later, cold, empty, and exactly as it stood the night the work stopped—vats intact, notes untouched, as if its occupant simply set down his instruments and walked out the postern gate. He did. Reports place a man matching Victor Frankenstein's description, and a companion no witness will describe consistently twice, on a mountain road north of the city, and then nowhere at all. Neither Ingolstadt nor Geneva ever hears from him again. Whether that is mercy or cowardice, the tower's cold vats decline to say.",
  },
  ENDING_2A: {
    id: "ENDING_2A",
    title: "The Spark of Prometheus",
    kind: "narrative",
    headline: "UNEXPLAINED BLAST LEVELS UNIVERSITY WING",
    text:
      "The discharge is visible from three villages away. When the smoke clears, the east wing of the university is a scorched crater, and of the tower above the castle walls there is no trace at all—no automaton, no Frankenstein, only a ring of fused glass where the floor once stood. The official report calls it a gas explosion. The scorch marks, oddly, radiate outward in a perfect circle.",
    variants: [
      {
        flag: "galvanicOvercharge",
        headline: "BLAST RADIUS DOUBLES PRIOR RECORD; CRATER STILL WARM AT WEEK'S END",
        text:
          "The building-wide generator array discharges everything at once, and the blast is visible from a dozen villages, not three. The east wing of the university does not simply crater—it vanishes, along with the two wings adjoining it. The official report calls it a gas explosion, though no gas main in Bavaria has ever produced a crater that stays warm to the touch a full week later.",
      },
    ],
  },
  ENDING_2B: {
    id: "ENDING_2B",
    title: "Clockwork Sovereign",
    kind: "narrative",
    headline: "PRIVATE ENGINEERING WORKS OPENS OUTSIDE GENEVA",
    text:
      "The harnessed automaton marches at Victor's shoulder like a trained dog of brass and dead muscle. Within a year there are three more. Within five, a walled compound outside Geneva employs no living labor at all. Victor Frankenstein is never troubled by magistrates again—he owns the only army capable of enforcing the law in the canton, and he answers to no one.",
    variants: [
      {
        flag: "galvanicOvercharge",
        headline: "PRIVATE ENGINEERING WORKS DOUBLES OUTPUT WITHIN THE YEAR",
        text:
          "The overcharged array means the first automaton alone outputs more raw force than the city watch's entire arsenal. Within a year there are not three more but a dozen, and the walled compound outside Geneva no longer bothers with a gate—nothing in the canton can compel it to open one. Victor Frankenstein answers to no one, and increasingly, no one is left to ask.",
      },
    ],
  },
  ENDING_2C: {
    id: "ENDING_2C",
    title: "The Broken Key",
    kind: "narrative",
    headline: "AUTOMATON SIGHTED OUTSIDE INGOLSTADT, UNACCOMPANIED",
    text:
      "It walks out of the tower and keeps walking, past the curtain wall, past the town, into country no one thinks to search because no one imagines an automaton would simply leave. It is seen twice more that winter, always alone, always moving with a strange, unhurried purpose no observer can name. Victor tells the university the harness failed. He does not correct anyone who calls it a malfunction, and he does not sleep well for a long time afterward, though not, he finds, from guilt.",
  },
  ENDING_3A: {
    id: "ENDING_3A",
    title: "The Geneva Contract",
    kind: "narrative",
    headline: "SCHOLAR RETIRES FROM PUBLIC LIFE, CITES HEALTH",
    text:
      "The notes go into the furnace one page at a time. The Creature is last seen boarding a merchant vessel bound, the manifest claims, for Rio de Janeiro. Victor Frankenstein lives another thirty years as a quiet, hollow-eyed lecturer in comparative anatomy, and never once raises his voice about galvanism again. He keeps the bargain. It costs him everything he was.",
  },
  ENDING_3B: {
    id: "ENDING_3B",
    title: "Academic Tyranny",
    kind: "narrative",
    headline: "FRANKENSTEIN NAMED RECTOR OF STATE PROGRAM",
    text:
      "The military find exactly what Victor's forged coordinates promised them, and the Creature does not survive the encounter. Victor is publicly thanked for his 'cooperation' and privately installed as Rector of a new state reanimation program—funded, staffed, and never once asked to show its full ledgers. He built a monster and buried it under a title instead of a grave.",
  },
  ENDING_3C: {
    id: "ENDING_3C",
    title: "The Reckoning",
    kind: "narrative",
    headline: "FRANKENSTEIN CONFESSES; UNIVERSITY IN UPROAR",
    text:
      "The full ledger reaches the Rector's desk on a Tuesday, in Victor's own hand, and by Thursday half of Ingolstadt has an opinion about it. There is a trial, of a bureaucratic and mostly bloodless kind — an inquest, a censure, a formal stripping of his university standing — and there is, for the first time in a year, nothing left to hide. He is not thanked for it. He is not forgiven for it either. But when he finally sleeps, he sleeps as a man with one ledger instead of two, and that, it turns out, is worth more than he expected.",
    variants: [
      {
        flag: "fritzPatron",
        headline: "CONFESSION NAMES SECOND PARTY; PATRON'S IDENTITY STILL UNKNOWN",
        text:
          "The full ledger reaches the Rector's desk on a Tuesday, in Victor's own hand — and this time it names names, including a benefactor Victor himself met only once, through Fritz, and never saw again. The inquest that follows spends as much time chasing that unnamed patron as it does Victor, and never quite catches either. He is not thanked for the confession. He is not forgiven for it. But for the first time in a year, the debt is not his alone to carry, and Fritz, when they finally speak of it, will say only that he did what the money asked and hoped it would be enough.",
      },
    ],
  },
  ENDING_CRISIS_VOLTAGE: {
    id: "ENDING_CRISIS_VOLTAGE",
    title: "Electrical Collapse",
    kind: "failure",
    headline: "CASTLE TOWER GOES DARK; SCHOLAR UNACCOUNTED FOR",
    text:
      "The Leyden jars discharge into silence and do not recharge. Without current, the vats rot within hours; whatever half-formed things were tethered to the coils revert to blind, wild aggression and tear the tower apart from the inside. By the time the neighbors work up the courage to force the door, there is nothing left to question.",
  },
  ENDING_CRISIS_BIOMASS: {
    id: "ENDING_CRISIS_BIOMASS",
    title: "Biological Starvation",
    kind: "failure",
    headline: "LABORATORY FALLS SILENT AFTER SUPPLY COLLAPSE",
    text:
      "The tissue stores run out and nothing arrives to replace them. Without raw material to craft or repair, the assistants—Fritz among them—turn on the man who has been feeding them nothing but promises. What the mob eventually finds in the tower was, by every account, already finished before they arrived.",
  },
  ENDING_CRISIS_SECRECY: {
    id: "ENDING_CRISIS_SECRECY",
    title: "Full Exposure",
    kind: "failure",
    headline: "MOB STORMS CASTLE'S WEST TOWER",
    text:
      "There is no bribe left to pay and no story left to tell. The magistrate arrives with the mob a half-step behind him, torches already lit. Whatever Victor Frankenstein built in that room, the town decides collectively and immediately that it should never have existed—and neither, it turns out, should he.",
  },
};

export const START_NODE_ID = "1";
export const LORE_NODE_ID = "2";
// Every node a route into "2" can actually land on. Node 1's darker option
// reroutes to "2-DARK" instead of "2" itself — without this, that one-shot
// history beat (and the newspaper carrying it) silently never fires for
// whichever fraction of players take that option. Any future node that
// stands in for "2" belongs in this list, not just as LORE_NODE_ID.
export const LORE_NODE_IDS = ["2", "2-DARK"];
export const LORE_EVENT_ID = "LORE_YEAR_WITHOUT_SUMMER";
export const TRANSITION_EVENT_ID = "TRANSITION_WILLIAM_MURDERED";
// Every node that counts as "arriving in Act II" for the one-shot transition
// newspaper. "8B-SURGE" is where node 5/5-HYBRID's high-capacity array roll
// lands on success instead of "8B" — it must be listed here too, or that
// branch skips William's murder entirely. Same rule as above: a roll branch
// that reroutes around 8A/8B/8C needs its own destination added here.
export const ACT2_ENTRY_NODES = ["8A", "8B", "8C", "8B-SURGE"];
/** Where "Skip to the Laboratory" lands a returning player — the first node whose choice actually forks the story. */
export const ACT2_SKIP_NODE_ID = "5";
