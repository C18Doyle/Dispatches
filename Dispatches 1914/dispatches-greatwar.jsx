/**
 * Dispatches 1914 — The Great War
 * Single-file React/JSX branching-narrative strategy game.
 *
 * ENGINE LAYER. The UI layer is deliberately absent: art direction is undecided
 * (spec §13.8) and the menu is the first surface that has to express it.
 *
 * Built clean-room from DISPATCHES_1918_DESIGN_SPEC.md. NOT ported from
 * dispatches-1922.jsx — that file was not available. Where this engine's
 * semantics differ from 1922's, 1922 is the authority and this file should be
 * reconciled against it before content work begins. Known points of possible
 * divergence are marked RECONCILE.
 *
 * Validators split this file on the UI_LAYER marker at the bottom.
 */

// =============================================================================
// CONSTANTS
// =============================================================================

export const METER_MIN = -10;
export const METER_MAX = 10;

/** The logistical triangle. Spec §4. `will` is labelled per campaign. */
export const METER_AXES = ["manpower", "munitions", "will"];

/** Accuracy badges. Spec §5. Every ending carries exactly one. */
export const BADGES = {
  SETTLED: "settled",
  CONTESTED: "contested",
  SPECULATIVE: "speculative",
};

export const BADGE_LABELS = {
  settled: "Settled record",
  contested: "Contested judgment",
  speculative: "Speculative counterfactual",
};

export const TIERS = { MAJOR: "major", MINOR: "minor" };

/** Calendar conventions. Spec §13.1. Stated on the campaign select screen. */
export const CALENDARS = {
  gregorian: {
    id: "gregorian",
    label: "Gregorian (New Style)",
    note: "Dates as reckoned in Western Europe.",
  },
  julian: {
    id: "julian",
    label: "Julian (Old Style)",
    note:
      "Dates as reckoned by the Russian command until February 1918. Thirteen " +
      "days behind the Western calendar. Western dates appear in parentheses on " +
      "first mention.",
  },
  rumi: {
    id: "rumi",
    label: "Rumi",
    note: "RESEARCH GATE — confirm Ottoman general staff document dating before use.",
    researchGate: true,
  },
};

/** Hard-mode erosion triggers. Spec §7.1. Each campaign erodes differently. */
export const EROSION_TRIGGERS = {
  SPEND_WILL: "spend_will", // buying operational gain with the will axis
  COSTLY_OFFENSIVE: "costly_offensive", // manpower-expensive attacks
  EXPOSE_REGIME: "expose_regime", // tying the regime to military outcomes
  DEFY_AUTHORITY: "defy_authority", // circumventing civil control
  CEDE_SOVEREIGNTY: "cede_sovereignty", // accepting allied command integration
  OVEREXTEND: "overextend", // commitments beyond supply
};

// =============================================================================
// CAMPAIGN CONFIGURATION
// =============================================================================
//
// Node sets are empty. Content is written per campaign, in the build order at
// spec §12: OHL -> GQG -> STAVKA -> BEF -> AOK -> OTTO. Each campaign passes its
// own ship gate (§11) before the next begins.
//
// `advisors` carries entry/exit dates because advisors come and go with the seat
// (§13.3) and check-commander-timing.js validates against these.
// =============================================================================

export const CAMPAIGNS = {
  ohl: {
    id: "ohl",
    seal: "OHL",
    docLabel: "LAGEBERICHT",
    accent: "#7a2e2e",
    documentTreatment: "Wilhelmine German",
    tier: TIERS.MAJOR,
    name: "Oberste Heeresleitung",
    shortName: "German OHL",
    seat: "Chief of the General Staff",
    calendar: "gregorian",
    flagPrefix: "ohl_",
    willLabel: "Home Front",
    willMeaning: "Blockade, food supply, political durability.",
    span: { from: "1914-08-01", to: "1918-11-11" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "Official communiqué and the national press under wartime censorship",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "ohl_hard",
      name: null, // Deferred by decision. Spec §7.2.
      trigger: EROSION_TRIGGERS.SPEND_WILL,
      forcedEndingId: null,
      description: "The war effort consuming the country that sustains it.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  gqg: {
    id: "gqg",
    seal: "GQG",
    docLabel: "COMPTE RENDU",
    accent: "#2f4858",
    documentTreatment: "French Republican",
    tier: TIERS.MAJOR,
    name: "Grand Quartier Général",
    shortName: "French GQG",
    seat: "Commander-in-Chief",
    calendar: "gregorian",
    flagPrefix: "gqg_",
    willLabel: "Army Morale",
    willMeaning: "The cohesion and obedience of the army itself.",
    span: { from: "1914-08-01", to: "1918-11-11" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "gqg_hard",
      name: null,
      trigger: EROSION_TRIGGERS.COSTLY_OFFENSIVE,
      forcedEndingId: null,
      description: "Political survival of the commander.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  stavka: {
    id: "stavka",
    seal: "STAVKA",
    docLabel: "SVODKA",
    accent: "#5c3a21",
    documentTreatment: "Imperial Russian",
    tier: TIERS.MAJOR,
    name: "Stavka",
    shortName: "Russian Stavka",
    seat: "Supreme Command",
    calendar: "julian",
    flagPrefix: "stavka_",
    willLabel: "Home Stability",
    willMeaning: "The endurance of the political order behind the front.",
    span: { from: "1914-07-19", to: "1918-03-03" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "stavka_hard",
      name: null,
      trigger: EROSION_TRIGGERS.EXPOSE_REGIME,
      forcedEndingId: null,
      description: "Court interference in command.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
    /** Spec §2.3, §3.4. Terminal nodes hand into Dispatches 1922. */
    handsOffTo: "dispatches-1922",
  },

  bef: {
    id: "bef",
    seal: "GHQ",
    docLabel: "SITUATION REPORT",
    accent: "#3d4a2f",
    documentTreatment: "British service",
    tier: TIERS.MAJOR,
    name: "British Expeditionary Force & War Cabinet",
    shortName: "British Empire",
    seat: "Field command and Cabinet",
    calendar: "gregorian",
    flagPrefix: "bef_",
    willLabel: "Political Capital",
    willMeaning: "Standing with the Cabinet and the country.",
    span: { from: "1914-08-04", to: "1918-11-11" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "bef_hard",
      name: null,
      trigger: EROSION_TRIGGERS.DEFY_AUTHORITY,
      forcedEndingId: null,
      description: "The civil-military struggle turned hostile.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  aok: {
    id: "aok",
    seal: "AOK",
    docLabel: "LAGEBERICHT",
    accent: "#6b4a2f",
    documentTreatment: "Habsburg bureaucratic",
    tier: TIERS.MINOR,
    name: "Armeeoberkommando",
    shortName: "Austro-Hungarian AOK",
    seat: "Chief of the General Staff",
    calendar: "gregorian",
    flagPrefix: "aok_",
    willLabel: "Imperial Cohesion",
    willMeaning: "The reliability of a multi-national army.",
    span: { from: "1914-07-28", to: "1918-11-03" },
    targetNodes: [16, 20],
    targetEndings: [5, 6],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "aok_hard",
      name: null,
      trigger: EROSION_TRIGGERS.CEDE_SOVEREIGNTY,
      forcedEndingId: null,
      description: "Sovereignty spent to stay in the war.",
    },
    researchGate: {
      open: true,
      note:
        "English-language operational sourcing for AOK is materially thinner " +
        "than for OHL/GQG/BEF. Confirm spine sourcing before content. If a spine " +
        "node cannot be sourced, cut the node — do not write around it.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  otto: {
    id: "otto",
    seal: "OGS",
    docLabel: "HARP RAPORU",
    accent: "#5a4a6b",
    documentTreatment: "Ottoman staff",
    tier: TIERS.MINOR,
    name: "Ottoman General Staff",
    shortName: "Ottoman command",
    seat: "War ministry and general staff",
    calendar: "rumi",
    flagPrefix: "otto_",
    willLabel: "Imperial Control",
    willMeaning: "Authority over provinces and territory.",
    span: { from: "1914-10-29", to: "1918-10-30" },
    targetNodes: [16, 20],
    targetEndings: [5, 6],
    map: "nearEast",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "otto_hard",
      name: null,
      trigger: EROSION_TRIGGERS.OVEREXTEND,
      forcedEndingId: null,
      description: "An empire fighting in more places than it can hold.",
    },
    researchGate: {
      open: true,
      note:
        "Sourcing gate as AOK, plus the §9 blocking issue. Build last. Do not " +
        "begin content until §9 is resolved and recorded here.",
    },
    /** Spec §9. Blocks content generation for this campaign entirely. */
    blockingIssue: {
      resolved: false,
      ref: "DISPATCHES_1918_DESIGN_SPEC.md §9",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },
};

export const CAMPAIGN_IDS = Object.keys(CAMPAIGNS);



// =============================================================================
// GERMAN OHL — HISTORICAL SPINE
// =============================================================================
//
// Nodes 1914-1917 written and source-checked. 1917-18 interior nodes are NOT yet
// written; ohl_end_armistice currently closes the spine so it stays walkable.
// Remove that shortcut when the interior is filled in.
//
// SOURCING NOTE. Advisors carry `position`, not `quote`. Nothing in this file
// puts words in quotation marks in a real person's mouth unless the wording is
// attested. See the note in CLAUDE.md — this is a deliberate departure from the
// 1940/1941 convention.
// =============================================================================

CAMPAIGNS.ohl.startNode = "ohl_1914_01_aufmarsch";

CAMPAIGNS.ohl.commanders = [
  { id: "moltke", name: "Moltke", title: "Chief of the General Staff",
    from: "1914-08-01", to: "1914-09-14" },
  { id: "falkenhayn", name: "Falkenhayn", title: "Chief of the General Staff",
    from: "1914-09-15", to: "1916-08-29" },
  { id: "hl", name: "Hindenburg and Ludendorff", title: "Third Supreme Command",
    from: "1916-08-30", to: "1918-11-11" },
];

CAMPAIGNS.ohl.advisors = [
  { id: "moltke", name: "Moltke", from: "1914-08-01", to: "1914-09-14",
    dossier: { role: "Chief of the General Staff, 1906-1914",
      bio: "Held the General Staff for eight years and inherited a deployment plan built around a decisive right wing. Directed the opening campaign from Luxembourg, far from armies he could not reliably reach by wire.",
      fate: "Relieved on 14 September 1914 and given the deputy General Staff in Berlin. Died in Berlin in June 1916." } },
  { id: "hentsch", name: "Hentsch", from: "1914-08-01", to: "1914-09-14",
    dossier: { role: "Lieutenant Colonel, intelligence section, OHL",
      bio: "Sent to the army headquarters on the right in September 1914 with oral instructions, because the Supreme Command could not see the front and could not reliably signal it.",
      fate: "OHL later confirmed he had acted correctly in ordering the withdrawal. Some senior officers never accepted it." } },
  { id: "falkenhayn", name: "Falkenhayn", from: "1914-09-14", to: "1916-08-29",
    dossier: { role: "Prussian Minister of War; Chief of the General Staff, 1914-1916",
      bio: "Took the General Staff after the Marne while still Minister of War. Doubted a decisive result was available in the east and looked for one in the west.",
      fate: "Removed on 29 August 1916. Later held field commands in Romania and the Ottoman theatre. Died in 1922." } },
  { id: "knobelsdorf", name: "Schmidt von Knobelsdorf", from: "1914-09-15", to: "1916-08-29",
    dossier: { role: "Chief of Staff, Fifth Army",
      bio: "Chief of staff to the Crown Prince's Fifth Army and the officer who had to turn the Meuse directive into an operation.",
      fate: "Recorded Falkenhayn using the language of exsanguination in planning the offensive." } },
  { id: "crownprince", name: "Crown Prince Wilhelm", from: "1914-09-15", to: "1918-11-11",
    dossier: { role: "Commander, Fifth Army",
      bio: "Commanded the army given the Meuse. Read the directive as an instruction to take the fortress, and said afterwards that no strategy of exhaustion had been explained to him.",
      fate: "Went into exile in the Netherlands after the war." } },
  { id: "hindenburg", name: "Hindenburg", from: "1916-08-29", to: "1918-11-11",
    dossier: { role: "Chief of the General Staff from August 1916",
      bio: "Brought west from the eastern command with Ludendorff after Verdun stalled, the Somme opened, Brusilov's offensive broke the Austrian front and Romania entered the war.",
      fate: "Later President of the Republic." } },
  { id: "ludendorff", name: "Ludendorff", from: "1916-08-29", to: "1918-11-11",
    dossier: { role: "First Quartermaster General",
      bio: "Formally Hindenburg's subordinate and in practice the operational will of the Third Supreme Command.",
      fate: "Left for Sweden in November 1918." } },
  { id: "holtzendorff", name: "Holtzendorff", from: "1915-09-01", to: "1918-08-11",
    dossier: { role: "Chief of the Admiralty Staff",
      bio: "Authored the memorandum of 22 December 1916 arguing that unrestricted submarine warfare could force Britain out within months.",
      fate: "The tonnage projections were not met. Left the Admiralty Staff in 1918." } },
  { id: "bethmann", name: "Bethmann Hollweg", from: "1914-08-01", to: "1917-07-13",
    dossier: { role: "Imperial Chancellor",
      bio: "Argued through 1916 that unrestricted submarine warfare would bring the United States into the war and that the decision rested with the Kaiser rather than the Supreme Command.",
      fate: "Left the chancellorship in July 1917." } },
  { id: "tappen", name: "Tappen", from: "1914-08-01", to: "1916-08-29",
    dossier: { role: "Head of the Operations Division, OHL",
      bio: "Retained at the head of operations across the change of Chief in 1914, one of the few continuities through the transition.",
      fate: "Moved to a field command." } },
];

CAMPAIGNS.ohl.bulletinVoice = {
  source: "Official communiqué of the Supreme Command, as carried by the German press under wartime censorship",
  register: "Impersonal, forward-looking, never conceding a reverse in the language of a reverse",
  defined: true,
};

CAMPAIGNS.ohl.hardMode.forcedEndingId = "ohl_end_relieved";
// Set from measured distribution: 8 of 23 choices are erosion-tagged and a run tops
// out at 7. At 5 the forced ending fires for players who consistently spend standing.
CAMPAIGNS.ohl.hardMode.erosionMax = 5;

CAMPAIGNS.ohl.nodes = {

  // ---------------------------------------------------------------- 1914-08
  ohl_1914_01_aufmarsch: {
    year: 1914, date: "1914-08-04", city: "Koblenz",
    title: "The Weight on the Right",
    advisors: ["moltke", "tappen"],
    situation:
      "The deployment rests on one proposition inherited from Schlieffen and modified " +
      "every year since: that the decisive weight falls on the right, swings wide " +
      "through Belgium, and that everything else in the line exists to make that " +
      "possible. Belgian neutrality is guaranteed by treaty, and the guarantee is " +
      "British.\n\n" +
      "Lorraine is the difficulty. The French will attack there, and the armies on the " +
      "left want to meet them and win something. Every corps that goes to Lorraine is " +
      "a corps not on the right, and the plan was never designed to do both.",
    context:
      "Supreme Command will direct this from Koblenz, and later from Luxembourg — " +
      "hundreds of kilometres behind armies it cannot see. There is no army group " +
      "headquarters between the Chief and seven army commanders. Wireless between the " +
      "Supreme Command and the individual armies is not reliably established, and what " +
      "there is will contend with interference from Paris.",
    choices: [
      {
        id: "right",
        label: "Hold the right at the weight the plan requires — give ground in Lorraine",
        historical: true,
        advisor: { name: "Moltke", position:
          "The plan has one idea in it. Anything that dilutes the right dilutes the only idea." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { ohl_lorraine: "conceded" },
        next: "ohl_1914_02_marne",
        outcome:
          "The right goes forward at weight. Lorraine gives ground it was always " +
          "expected to give, and the newspapers there will have to be managed.",
      },
      {
        id: "lorraine",
        label: "Reinforce Lorraine — take the victory the left is offering",
        advisor: { name: "Tappen", position:
          "A beaten French army in Lorraine is a real result. The right can be strong enough without being everything." },
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { ohl_lorraine: "reinforced" },
        erodes: "spend_will",
        next: "ohl_1914_02_marne",
        outcome:
          "Corps go south. There is fighting in Lorraine that the plan did not ask " +
          "for, and the right wing goes forward lighter than the plan assumed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  ohl_1914_02_marne: {
    year: 1914, date: "1914-09-08", city: "Luxembourg",
    title: "A Gap No One at Headquarters Can See",
    advisors: ["moltke", "hentsch"],
    bulletin: {
      voice: "ohl", date: "1914-09-07", source: "Official communiqué",
      text:
        "The armies in France continue their advance according to plan. The enemy " +
        "withdraws before them. Reports of a French concentration before Paris are " +
        "without operational significance.",
    },
    situation: (flags) =>
      "First and Second Armies have opened a gap between them wide enough to march " +
      "an army through, and the French have found it. Supreme Command is a hundred " +
      "and fifty miles away with no reliable wire to the armies concerned and no " +
      "means of seeing the ground.\n\n" +
      (flags.ohl_lorraine === "reinforced"
        ? "The right was never at the strength the plan assumed. What is happening now " +
          "was implicit in the corps sent to Lorraine six weeks ago."
        : "The right went forward at full weight and has arrived at the end of what " +
          "men and horses can do.") +
      "\n\nWhat to order is not the difficulty. Knowing what to order is.",
    context:
      "An officer sent forward with oral instructions and the authority of the " +
      "Supreme Command can act on what he finds. He can also close the campaign " +
      "on his own judgment, in the Chief's name, before the Chief has heard of it.",
    choices: [
      {
        id: "hentsch",
        label: "Send Hentsch forward with plenipotentiary authority and oral instructions",
        historical: true,
        advisor: { name: "Hentsch", position:
          "I know the sector already. I will need to be able to act on what I find, not report it and wait." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { ohl_marne: "delegated" },
        dispute:
          "Historians divide on where responsibility for the Marne withdrawal lies. " +
          "One line holds that Moltke had lost control of the armies during August and " +
          "could not react when the battle developed; another places the immediate cause " +
          "with Kluck's First Army losing contact with Bülow's Second and opening the gap. " +
          "Whether Hentsch's intervention rescued a collapsing position or ended a " +
          "recoverable one was disputed by senior officers at the time and is disputed still.",
        uncertain: [
          { weight: 55, title: "The withdrawal is ordered and the armies come out intact", historicalBranch: true,
            impact: { manpower: 0, will: -1 },
            setFlags: { ohl_marneResult: "orderly" },
            next: "ohl_1914_03_succession",
            outcome:
              "Hentsch reaches Second Army, finds Bülow already resolved on withdrawal to " +
              "close the gap, and agrees. First and Third Armies are compelled to conform. " +
              "The armies come back to the Aisne in order and begin to dig. Whether they " +
              "were rescued or robbed is argued about at every level of the officer corps, " +
              "and will be argued about long after everyone involved is dead." },
          { weight: 45, title: "The order arrives late and the withdrawal is ragged",
            impact: { manpower: -1, will: -2 },
            setFlags: { ohl_marneResult: "ragged" },
            next: "ohl_1914_03_succession",
            outcome:
              "The instruction reaches the armies unevenly and they break contact at " +
              "different hours. The line on the Aisne is held, but the cost of getting to " +
              "it is higher than it needed to be, and the recriminations start before the " +
              "digging does." },
        ],
      },
      {
        id: "goforward",
        label: "Go forward to the armies yourself and judge the ground in person",
        advisor: { name: "Moltke", position:
          "If the decision is this large it should not be taken by a lieutenant colonel carrying my authority in his pocket." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        gate: (m) => m.manpower >= 0,
        disabledReason: "The armies cannot be left unattended at this strength",
        setFlags: { ohl_marne: "inperson" },
        next: "ohl_1914_03_succession",
        outcome:
          "Speculative. Supreme Command leaves Luxembourg for the front. Whatever is " +
          "gained in judgment is lost in the days it takes to get there and the hours " +
          "in which no one at all is directing seven armies. The withdrawal to the " +
          "Aisne happens regardless; only the authorship changes.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  ohl_1914_03_succession: {
    year: 1914, date: "1914-09-14", city: "Luxembourg",
    title: "The Seat Changes Hands",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "The Military Cabinet informs Moltke that His Majesty considers it too painful " +
      "for him to continue directing operations. Falkenhayn, the Prussian Minister of " +
      "War, takes the General Staff — informally now, formally in October — and holds " +
      "both offices at once.\n\n" +
      (flags.ohl_marneResult === "ragged"
        ? "The manner of the withdrawal has made the change easier to justify and " +
          "harder to survive politically."
        : "The armies are intact on the Aisne. The change is made anyway.") +
      "\n\nWhat arrives with the new Chief is not a new plan. It is the recognition " +
      "that the old one has been spent, and that the war now has to be won by some " +
      "method nobody in this building has yet described.",
    context:
      "Tappen stays at the head of the Operations Division across the transition. " +
      "The office continues; the man does not. Every commitment made before today is " +
      "inherited whole.",
    choices: [
      {
        id: "west",
        label: "Look for the decision in the west — the enemy that can actually be beaten",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "Russia can be pushed back a very long way without ever being finished. Britain and France can be finished. That is where the war is." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { ohl_theatre: "west" },
        next: "ohl_1916_04_verdun",
        outcome:
          "The Supreme Command's weight stays in the west. The eastern command will " +
          "argue against this for two years, and will eventually argue its way into " +
          "this building.",
      },
      {
        id: "east",
        label: "Shift the weight east — finish Russia first",
        advisor: { name: "Hindenburg", position:
          "Space in the east is not an argument against victory there. It is the reason victory there is possible." },
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { ohl_theatre: "east" },
        erodes: "spend_will",
        next: "ohl_1916_04_verdun",
        outcome:
          "Speculative. Divisions go east that historically stayed west. The eastern " +
          "command gets the resources it spent two years demanding, and acquires the " +
          "responsibility that comes with them.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-02
  ohl_1916_04_verdun: {
    year: 1916, date: "1916-02-21", city: "Verdun",
    title: "The Meuse",
    advisors: ["falkenhayn", "knobelsdorf", "crownprince"],
    bulletin: {
      voice: "ohl", date: "1916-02-20", source: "Official communiqué",
      text:
        "Local operations are in preparation on the Meuse. The Supreme Command has " +
        "no announcement to make regarding their scope.",
    },
    situation:
      "The French have stripped the fortress belt around Verdun of heavy guns and " +
      "men. More than a dozen railways can feed the sector. The ground is available.\n\n" +
      "What is not agreed, inside this headquarters, is what the operation is for. " +
      "One reading is that the Meuse is where the French army can be drawn in and " +
      "destroyed by artillery — that the objective is the French army rather than the " +
      "city. The other is that Verdun is a fortress and fortresses are taken. The " +
      "Fifth Army has been given a directive that can be read either way, and its " +
      "commander has read it the second way.",
    context:
      "Two and a half million shells are laid up. Five divisions are promised to " +
      "Fifth Army. Whichever reading is correct, the artillery programme is the same " +
      "for the first week — which is exactly why the ambiguity has survived this long.",
    choices: [
      {
        id: "attrition",
        label: "Make the object the French army — hold the ground, let them counter-attack into the guns",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "They will not give up Verdun. That is the point of choosing it. We do not need the city if they will spend the army defending it." },
        impact: { manpower: -1, munitions: -2, will: -1 },
        setFlags: { ohl_verdun: "attrition" },
        dispute:
          "Falkenhayn's own account rests on a memorandum he says he gave the Kaiser " +
          "around Christmas 1915. The original has never been found; the Prussian army " +
          "archives burned in 1945 and definitive confirmation is no longer possible. " +
          "Some historians treat it as postwar self-justification for an attack that " +
          "simply failed. Foley's reconstruction sets the memorandum aside entirely and " +
          "builds the case from other evidence. Against that, Knobelsdorf, the Crown " +
          "Prince and the Kaiser's adjutant Plessen each separately recorded Falkenhayn " +
          "using the language of exsanguination while planning the offensive.",
        uncertain: [
          { weight: 45, title: "Fifth Army executes the directive as written",
            impact: { manpower: 0 },
            setFlags: { ohl_verdunExec: "asdirected" },
            next: "ohl_1916_05_relief",
            outcome:
              "The guns do the work and the infantry is not spent taking ground for its " +
              "own sake. The French come on to the artillery as expected. The ledger is " +
              "grim on both sides and the German column of it is smaller than it might " +
              "have been." },
          { weight: 55, title: "Fifth Army reads the directive as an order to take the fortress", historicalBranch: true,
            impact: { manpower: -2, will: -1 },
            setFlags: { ohl_verdunExec: "fortress" },
            next: "ohl_1916_05_relief",
            outcome:
              "The Crown Prince's headquarters takes the instruction to mean the city, " +
              "and the operation becomes what the directive was meant to avoid: German " +
              "infantry attacking prepared positions on ground that has no value except " +
              "that the attack has already been made for it. The distinction between " +
              "the two readings stops mattering somewhere in March." },
        ],
      },
      {
        id: "elsewhere",
        label: "Decline the Meuse — hold in the west and wait for the enemy to attack first",
        advisor: { name: "Crown Prince Wilhelm", position:
          "If the object is really the French army and not the city, then say so plainly, or do not begin." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        gate: (m) => m.will >= 1,
        disabledReason: "A year without an offensive cannot be explained at home from here",
        setFlags: { ohl_verdun: "declined" },
        erodes: "spend_will",
        next: "ohl_1916_05_relief",
        outcome:
          "Speculative. No offensive on the Meuse. The shells and the five divisions " +
          "stay in hand and the army in the west spends 1916 waiting — which is a " +
          "coherent strategy and an intolerable one to explain to a country that has " +
          "been told the war is being won.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-08
  ohl_1916_05_relief: {
    year: 1916, date: "1916-08-29", city: "Pless",
    title: "Four Things at Once",
    advisors: ["hindenburg", "ludendorff", "falkenhayn"],
    situation: (flags) =>
      "Verdun has not produced what was promised for it. The Somme has opened. " +
      "Brusilov's offensive has broken the Austrian front and had to be shored up " +
      "with German divisions. Romania has come in against us.\n\n" +
      (flags.ohl_verdun === "declined"
        ? "There was no Meuse offensive to fail, which removes one charge and leaves " +
          "the harder one: a year in the west spent waiting, and three reverses " +
          "elsewhere anyway."
        : "Any one of the four could be absorbed. The four together end Falkenhayn's " +
          "tenure on 29 August.") +
      "\n\nHindenburg takes the General Staff. Ludendorff comes with him as First " +
      "Quartermaster General, formally subordinate, in practice not.",
    context:
      "The plan to win the war before 1917 is finished. What replaces it is not a " +
      "plan to win in 1917 but a decision about what the army is for now that it " +
      "cannot force a result on the ground.",
    choices: [
      {
        id: "defensive",
        label: "Go over to the defensive in the west and rebuild — shorten the line",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We cannot attack in the west next year. Everything follows from admitting that first." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { ohl_1917posture: "defensive" },
        next: "ohl_1917_06_pless",
        outcome:
          "The army in the west stops attacking and starts building. The line is " +
          "shortened and the ground given up is left useless behind it. Divisions are " +
          "freed. What they are to be used for is the next question and it is already " +
          "being answered somewhere other than in this building.",
      },
      {
        id: "press",
        label: "Continue the offensive effort in the west through the winter",
        advisor: { name: "Falkenhayn", position:
          "Stopping now concedes that everything spent since February bought nothing." },
        impact: { manpower: -2, munitions: -2, will: 0 },
        gate: (m) => m.munitions >= -1,
        disabledReason: "The shell reserve will not carry a winter offensive",
        setFlags: { ohl_1917posture: "offensive" },
        erodes: "spend_will",
        next: "ohl_1917_06_pless",
        outcome:
          "Speculative. The effort continues into weather and against a Somme front " +
          "that is being reinforced faster than it is being broken. The divisions that " +
          "would have been rebuilt are not rebuilt.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-01
  ohl_1917_06_pless: {
    year: 1917, date: "1917-01-09", city: "Pless",
    title: "Six Months, by Arithmetic",
    advisors: ["holtzendorff", "bethmann", "ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1917-01-05", source: "Official communiqué",
      text:
        "The peace offer of December has been declined by the enemy governments. The " +
        "Supreme Command notes that the responsibility for the continuation of the war " +
        "now rests where the refusal was made.",
    },
    situation:
      "Holtzendorff's memorandum of 22 December sets out the case in figures: " +
      "unrestricted submarine warfare, six hundred thousand tons a month, and Britain " +
      "is out inside six months — before American strength could be raised, shipped " +
      "and brought to bear. The paper has the appearance of arithmetic and the " +
      "backing of every senior soldier in the Empire.\n\n" +
      "The Chancellor's objection is not about tonnage. It is that this brings the " +
      "United States in, that the figures assume everything runs as projected, and " +
      "that if the six months pass without Britain breaking, there is no second plan " +
      "and a new enemy with no upper limit on its manpower.",
    context:
      "Bethmann Hollweg has maintained throughout that the decision belongs to the " +
      "Kaiser rather than to the Supreme Command. The Crown Council at Pless is the " +
      "form that insistence finally takes. The Kaiser had resisted the memorandum; " +
      "the Entente's rejection of the December peace offer moved him.",
    choices: [
      {
        id: "unrestricted",
        label: "Unrestricted submarine warfare from 1 February",
        historical: true,
        advisor: { name: "Holtzendorff", position:
          "The tonnage figures are conservative and the timetable holds. Six months is not a hope, it is a calculation." },
        impact: { manpower: 0, munitions: 1, will: 2 },
        setFlags: { ohl_usw: "unrestricted", ohl_usEntry: "certain" },
        next: "ohl_1917_07_chancellor",
        outcome:
          "The order is signed on the evening of 9 January and the campaign opens on " +
          "1 February. The early months exceed the projection — April alone runs past " +
          "eight hundred thousand tons. Britain does not leave the war. The United " +
          "States enters it. Both of those were foreseen in this room by different " +
          "people, and the arithmetic was believed over the objection.",
      },
      {
        id: "restricted",
        label: "Hold to restricted warfare and keep the Americans out",
        advisor: { name: "Bethmann Hollweg", position:
          "If the six months pass and Britain is still in, we will have added an enemy and have nothing left to add ourselves." },
        impact: { manpower: 0, munitions: -1, will: -2 },
        gate: (m) => m.will >= -1,
        disabledReason: "The Supreme Command no longer has the standing to overrule the naval staff",
        setFlags: { ohl_usw: "restricted", ohl_usEntry: "deferred" },
        erodes: "spend_will",
        next: "ohl_end_armistice",
        outcome:
          "Speculative. The U-boats stay under prize rules, American neutrality is not " +
          "forced, and the war in the west continues on the ground with no instrument " +
          "for changing it. The Supreme Command has declined the only decisive-looking " +
          "option it had and now has to find another.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-07
  ohl_1917_07_chancellor: {
    year: 1917, date: "1917-07-13", city: "Berlin",
    title: "A Civilian Who Says No",
    advisors: ["ludendorff", "hindenburg", "bethmann"],
    bulletin: {
      voice: "ohl", date: "1917-07-11", source: "Official communiqué",
      text:
        "The Supreme Command has laid before His Majesty its view of the requirements " +
        "of the military situation. It regards the unity of the war effort as the " +
        "first of those requirements.",
    },
    situation: (flags) =>
      "The Reichstag is drafting a resolution for a peace without annexations. The " +
      "Chancellor will not fight it, and the Supreme Command has concluded that a " +
      "Chancellor who will not fight it cannot remain.\n\n" +
      (flags.ohl_usw === "unrestricted"
        ? "Bethmann Hollweg opposed the submarine decision in January and was overruled. " +
          "Six months on, the tonnage has not produced a British collapse and the " +
          "Americans have declared. His judgment is looking better than the arithmetic " +
          "that beat it, which is its own kind of problem for this headquarters."
        : "Bethmann Hollweg carried the January council and the Americans stayed out. " +
          "The Supreme Command lost that argument and has not forgotten it."),
    context:
      "Removing a Chancellor is not a military act and the General Staff has no " +
      "constitutional power to do it. What it has is the threat of resignation by the " +
      "two men whose names the country believes in, and the knowledge that the throne " +
      "will not survive choosing a civilian over them.",
    choices: [
      {
        id: "force",
        label: "Press for the Chancellor's removal",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The war cannot be run from two buildings that disagree. One of them has to stop." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_chancellor: "removed" },
        erodes: "spend_will",
        next: "ohl_1918_08_brest",
        outcome:
          "Bethmann Hollweg leaves the chancellorship in July. His successors govern " +
          "with the Supreme Command's approval and without much else. The military " +
          "direction of the war is now the direction of the war, and every domestic " +
          "failure from here belongs to this headquarters whether it caused it or not.",
      },
      {
        id: "tolerate",
        label: "Leave the Chancellor in place and accept the resolution",
        advisor: { name: "Bethmann Hollweg", position:
          "A resolution the Reichstag has voted for is worth more to the country than one the army permits it to vote for." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { ohl_chancellor: "kept" },
        next: "ohl_1918_08_brest",
        outcome:
          "Speculative. The civil government survives the summer with its authority " +
          "intact, which means the Supreme Command has a colleague rather than a " +
          "subordinate, and an argument to lose every time it wants something.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  ohl_1918_08_brest: {
    year: 1918, date: "1918-03-03", city: "Brest-Litovsk",
    title: "What the East Is Worth",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-03-01", source: "Official communiqué",
      text:
        "Negotiations in the east proceed. The Supreme Command is satisfied that the " +
        "security of the eastern territories will be established on a lasting footing.",
    },
    situation:
      "Russia is out. What follows is not a military question but it will be answered " +
      "in divisions: every square mile taken in the east has to be held, and every " +
      "garrison left behind is a division not on the Western Front in the spring.\n\n" +
      "The army has two hundred and forty-one divisions. The number that can be in " +
      "France in March is the whole of the coming year's argument.",
    context:
      "Roughly fifty divisions can be moved west if the eastern settlement is kept " +
      "narrow. A settlement that takes everything available to be taken will need a " +
      "large part of them to stay where they are and administer it.",
    choices: [
      {
        id: "harsh",
        label: "Take the full settlement — hold what the treaty gives",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We will not get a second chance at the east. Take it now and garrison it, and the west will still have enough." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { ohl_brest: "maximal" },
        erodes: "spend_will",
        next: "ohl_1918_09_michael",
        outcome:
          "The terms are severe and the territory is enormous. Around fifty divisions " +
          "come west; by the twenty-first of March a hundred and ninety-two of the " +
          "army's divisions are on the Western Front. The rest are administering the " +
          "prize, and they stay there.",
      },
      {
        id: "narrow",
        label: "Take a narrow settlement — release the maximum for the west",
        advisor: { name: "Hindenburg", position:
          "The territory is worth nothing if the war is lost in France while we are counting it." },
        impact: { manpower: 2, munitions: 0, will: -1 },
        setFlags: { ohl_brest: "narrow" },
        next: "ohl_1918_09_michael",
        outcome:
          "Speculative. Less is taken and less has to be held. More divisions reach " +
          "France than historically did, and a settlement the annexationists at home " +
          "regard as a betrayal has to be defended in the Reichstag by a government " +
          "that did not want it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  ohl_1918_09_michael: {
    year: 1918, date: "1918-03-21", city: "Saint-Quentin",
    title: "A Hole, and Then",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-03-20", source: "Official communiqué",
      text:
        "His Majesty has arrived at the front. The Supreme Command has no statement " +
        "to make concerning operations in preparation.",
    },
    situation:
      "The decision to attack was taken in January and the preparation has been " +
      "meticulous: Bruchmüller's artillery programme, divisions trained in infiltration, " +
      "surprise preserved across a forty-mile front. For the first time since 1914 " +
      "there are more German divisions in France than Allied ones, and the advantage " +
      "expires the moment American strength arrives in quantity.\n\n" +
      "The preparation is not the difficulty. The objective is. Break between Arras and " +
      "the Oise, wheel north, roll the British against the Channel and destroy them — " +
      "that is the operational plan. There is also a view in this headquarters that the " +
      "breakthrough is the plan, that a hole is made and what follows will follow.",
    context:
      "Amiens is a railway junction, and taking it separates the British from the " +
      "French. It is one of the few objectives on this front whose capture would decide " +
      "something rather than merely gain ground.",
    choices: [
      {
        id: "adaptive",
        label: "Make the breakthrough the objective — exploit wherever the line gives",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "Punch the hole and the rest will develop. That is how it was done in the east." },
        impact: { manpower: -2, munitions: -2, will: 1 },
        setFlags: { ohl_michael: "adaptive" },
        dispute:
          "The operational criticism of the 1918 offensives is well established — that " +
          "Ludendorff pursued tactical success at the expense of the campaign's stated " +
          "aims, redirecting effort daily and dissipating a force sufficient for only " +
          "one decisive frontal blow. Against that, the German army did achieve the " +
          "largest breakthrough of the positional war and came nearer Paris than at any " +
          "point since 1914; whether an Amiens-first plan was executable with the " +
          "logistics available, or whether the offensives were doomed by American " +
          "arithmetic whatever the objective, is not settled.",
        uncertain: [
          { weight: 60, title: "Tactical triumph, operational nothing", historicalBranch: true,
            impact: { manpower: -1, will: -1 },
            setFlags: { ohl_michaelResult: "salient" },
            next: "ohl_1918_10_salient",
            outcome:
              "Sixty-five kilometres of ground and the largest breakthrough since the " +
              "line stopped moving. Amiens is threatened and not taken. The armies on " +
              "the flanks are too worn to widen the front, the direction of the advance " +
              "no longer serves the envelopment it was meant to serve, and what has been " +
              "gained is a salient exposed on every side." },
          { weight: 40, title: "The exploitation reaches the junction",
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { ohl_michaelResult: "amiens" },
            next: "ohl_1918_10_salient",
            outcome:
              "Speculative. The adaptive method finds the seam and the exploitation " +
              "carries to the junction. The British and French are separated on the " +
              "ground. What that is worth depends entirely on what can be moved through " +
              "the gap before it closes, and the answer to that is not encouraging." },
        ],
      },
      {
        id: "amiens",
        label: "Name Amiens as the objective and refuse every diversion from it",
        advisor: { name: "Hindenburg", position:
          "One place, taken, splits their armies. Ground taken anywhere else is only ground." },
        gate: (m) => m.munitions >= -2,
        disabledReason: "A single-objective offensive cannot be sustained on this reserve",
        impact: { manpower: -2, munitions: -3, will: 0 },
        setFlags: { ohl_michael: "amiensfirst" },
        next: "ohl_1918_10_salient",
        outcome:
          "Speculative. Effort is concentrated and diversions refused. Whether the " +
          "junction can be reached and held is a question the logistics may answer " +
          "before the enemy does.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-07
  ohl_1918_10_salient: {
    year: 1918, date: "1918-07-18", city: "Soissons",
    title: "The Widest Line We Have Ever Held",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-07-16", source: "Official communiqué",
      text:
        "The territory under the protection of German arms in the west is greater than " +
        "at any time since 1914. The Supreme Command has every confidence in the " +
        "positions held.",
    },
    situation: (flags) =>
      "By mid-July the German position in the west is the largest it has ever been " +
      "and among the worst it has ever been. " +
      (flags.ohl_michaelResult === "amiens"
        ? "The junction was reached; holding it has cost more than taking it."
        : "The offensives took ground in four directions and decided nothing in any of them.") +
      "\n\nThe salients are deep, the flanks are long, the divisions that made them " +
      "are the divisions that were supposed to hold them, and American formations are " +
      "now arriving faster than they can be counted.\n\n" +
      "Giving up ground bought at this price is not a military problem. It is a " +
      "problem of what can be said afterwards.",
    context:
      "A shortened line can be held by fewer men, with the reserve restored. It also " +
      "concedes, in front of the whole country, that the spring bought nothing.",
    choices: [
      {
        id: "shorten",
        label: "Shorten the line — give up the salients and rebuild the reserve",
        advisor: { name: "Hindenburg", position:
          "The ground was never the point. An army that still exists in September is the point." },
        impact: { manpower: 2, munitions: 1, will: -3 },
        setFlags: { ohl_salient: "shortened" },
        next: "ohl_1918_11_request",
        outcome:
          "Speculative. The armies come back to a line they can hold and a reserve " +
          "exists again. At home, the maps in the newspapers move backwards for the " +
          "first time since March, and no communiqué makes that mean anything else.",
      },
      {
        id: "hold",
        label: "Hold the ground taken",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We do not hand back in July what was paid for in March." },
        impact: { manpower: -3, munitions: -1, will: 0 },
        setFlags: { ohl_salient: "held" },
        erodes: "spend_will",
        next: "ohl_1918_11_request",
        outcome:
          "The salients are held and the divisions holding them are consumed doing it. " +
          "The retreat, when it comes, comes at a time chosen by the enemy rather than " +
          "by this headquarters.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  ohl_1918_11_request: {
    year: 1918, date: "1918-09-29", city: "Spa",
    title: "Who Asks",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-09-27", source: "Official communiqué",
      text:
        "Operations in the west proceed according to the intentions of the Supreme " +
        "Command. Adjustments of the line are made where the situation requires them.",
    },
    situation: (flags) =>
      "The army in the west is retreating in order, on ground it still holds, in front " +
      "of an enemy it can still hurt. What has gone is not the army. It is the " +
      "possibility of any outcome except a worse one later.\n\n" +
      (flags.ohl_salient === "shortened"
        ? "The line is short and held, and the reserve exists. It buys months. It does not buy a different answer."
        : "The divisions that took the salients in the spring are the divisions that were spent holding them.") +
      "\n\nWhat is decided now is not whether an armistice is sought. It is who is " +
      "recorded as having sought it.",
    context: (flags) =>
      flags.ohl_chancellor === "removed"
        ? "There is no civil authority left with standing of its own. It was removed in " +
          "July, by this headquarters, precisely so that it could not act independently — " +
          "and now something is needed that only an independent civil authority can do."
        : "A civil government with its own authority still exists, and can carry a " +
          "request that does not belong to the army alone.",
    choices: [
      {
        id: "military",
        label: "The Supreme Command requests it, and a new civil government carries it",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The request must go now, and it must go through a government that can sign it." },
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { ohl_request: "throughcivil" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "ohl_end_homefirst"
          : m.manpower <= -6 ? "ohl_end_armyfirst"
          : (flags.ohl_brest === "narrow" && flags.ohl_salient === "shortened") ? "ohl_end_intact"
          : null,
        next: "ohl_end_armistice",
        outcome:
          "The request goes forward. A government is assembled to carry it and does. " +
          "Within a few years a great many people who were in this building will explain " +
          "that the army was never beaten and that the request came from somewhere else.",
      },
      {
        id: "fight",
        label: "Refuse the request — fight on into 1919 behind a shortened line",
        advisor: { name: "Hindenburg", position:
          "A defensive line in the west and a winter may produce terms that this month will not." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There are not enough divisions left to hold any line through a winter",
        impact: { manpower: -3, munitions: -2, will: -2 },
        setFlags: { ohl_request: "refused" },
        nextIf: (m, flags) =>
          m.will <= -5 ? "ohl_end_homefirst"
          : m.manpower <= -7 ? "ohl_end_armyfirst"
          : flags.ohl_brest === "maximal" ? "ohl_end_dictated"
          : null,
        next: "ohl_end_holdout",
        outcome:
          "Speculative. No request is made. The army falls back on a line it intends to " +
          "hold through the winter, and the question becomes whether the country behind " +
          "it lasts as long as the line does.",
      },
      {
        id: "openterms",
        label: "Seek terms directly and early, before the line moves again",
        advisor: { name: "Hindenburg", position:
          "Every week we wait, the terms available get worse. They will not improve by themselves." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Supreme Command has no standing left to open a negotiation in its own name",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_request: "early" },
        nextIf: (m) => (m.will <= -4 ? "ohl_end_worseterms" : null),
        next: "ohl_end_negotiated",
        outcome:
          "Speculative. An approach is made while the line in the west is still " +
          "unbroken, from a position that can still be described as strong.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  ohl_end_armistice: {
    year: 1918, date: "1918-11-11", city: "Spa",
    title: "The Request",
    advisors: ["hindenburg"],
    situation: (flags) =>
      "The army in the west is not broken in the sense the word is used in staff " +
      "colleges. It is retreating in order, on ground it still holds, in front of an " +
      "enemy it can still hurt. What has gone is the possibility of any outcome except " +
      "a worse one later.\n\n" +
      (flags.ohl_usw === "unrestricted"
        ? "The submarine campaign did what its critics said it would do and did not do " +
          "what its authors promised. The Americans are here in numbers, and the six " +
          "months in the memorandum expired a long time ago."
        : "The Americans came late and in smaller numbers, and it made a difference of " +
          "months rather than of outcome.") +
      "\n\nThe request goes forward from the Supreme Command. It is a military " +
      "judgment, made by soldiers, and within a few years a great many people who " +
      "were in this building will say it was made by someone else.",
    ending: {
      family: "armistice-requested",
      badge: BADGES.SETTLED,
    },
    epilogue: (flags) =>
      "Chief of the General Staff at the close: Hindenburg. The war ends on the " +
      "eleventh of November.\n\n" +
      "Lorraine, August 1914: " + (flags.ohl_lorraine === "reinforced" ? "reinforced." : "conceded, as the plan required.") + "\n" +
      "The Marne: " + (flags.ohl_marne === "inperson" ? "judged in person at the front." : "delegated forward under plenipotentiary authority.") + "\n" +
      "The Meuse: " + (flags.ohl_verdun === "declined" ? "declined." : (flags.ohl_verdunExec === "fortress" ? "fought as a battle for the fortress." : "fought as the directive was written.")) + "\n" +
      "The submarines: " + (flags.ohl_usw === "restricted" ? "held under prize rules." : "unrestricted from 1 February 1917.") + "\n" +
      "Weight of effort after the Marne: " + (flags.ohl_theatre === "east" ? "shifted east." : "held in the west.") + "\n" +
      "Posture for 1917: " + (flags.ohl_1917posture === "offensive" ? "continued offensive effort." : "defensive, rebuilding.") + "\n" +
      "American entry: " + (flags.ohl_usEntry === "deferred" ? "deferred." : "brought on by the decision of 9 January 1917.") + "\n" +
      "Brest-Litovsk: " + (flags.ohl_brest === "narrow" ? "narrow settlement, divisions released west." : "maximal settlement, divisions retained in garrison.") + "\n" +
      "Spring 1918: " + (flags.ohl_michael === "amiensfirst" ? "Amiens named as the objective." : "breakthrough taken as the objective.") + "\n" +
      "September 1918: " + (flags.ohl_request === "refused" ? "the request was refused." : flags.ohl_request === "early" ? "terms were sought early." : "requested through a new civil government."),
  },


  ohl_end_homefirst: {
    year: 1918, date: "1918-11-09", city: "Berlin",
    title: "The Country Goes First",
    advisors: ["hindenburg"],
    situation:
      "The front is still a front. The armies are on ground they hold and the enemy " +
      "has not walked through them.\n\nWhat has stopped is behind it. Four winters of " +
      "the blockade, a food supply that has been arithmetic rather than diet for two " +
      "years, and a political authority that this headquarters spent and then needed. " +
      "There is no order that reaches this and no reserve that can be moved to it.",
    ending: { family: "home-front-collapse-first", badge: BADGES.CONTESTED },
    epilogue: () =>
      "The army did not break in the field. It was never going to be able to hold a " +
      "front for a country that had stopped being able to supply one.",
  },

  ohl_end_armyfirst: {
    year: 1918, date: "1918-10-20", city: "Spa",
    title: "The Front Gives",
    advisors: ["hindenburg"],
    situation:
      "This is the outcome the Supreme Command spent four years arranging not to have: " +
      "a break in the field, in daylight, with nothing behind it. The divisions asked " +
      "to close it are the divisions that were used up making and then holding the " +
      "spring's ground.\n\nThere is no argument to be had afterwards about whether the " +
      "army was beaten. Everyone can see where it happened.",
    ending: { family: "army-collapse-first", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical German army retreated in order to the end and was " +
      "never broken open in the field. Spending it harder than it was spent leaves " +
      "nothing for anyone to reinterpret afterwards.",
  },

  ohl_end_holdout: {
    year: 1918, date: "1918-11-11", city: "Antwerp",
    title: "A Line for the Winter",
    advisors: ["hindenburg"],
    situation:
      "No request goes forward. The armies come back to a short line, dig, and hold " +
      "it — and holding it works, in the narrow sense that the enemy does not come " +
      "through.\n\nEverything else continues. The blockade continues. The Americans " +
      "continue to arrive. The winter is bought at the price of every division that " +
      "might have been rebuilt in it, and the terms available in the spring are the " +
      "terms available now, minus a winter.",
    ending: { family: "fight-on-into-1919", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The line held. What the line was for did not become clearer for " +
      "having been held.",
  },

  ohl_end_negotiated: {
    year: 1918, date: "1918-09-30", city: "Spa",
    title: "From a Line Still Held",
    advisors: ["hindenburg"],
    situation:
      "The approach is made while the front is unbroken and the maps still show ground " +
      "that was taken rather than ground that was lost. There is a difference between " +
      "negotiating from a position and negotiating after one, and it is the whole of " +
      "the difference available here.\n\nWhether the other side is interested in the " +
      "distinction is a separate matter, and not one this headquarters controls.",
    ending: { family: "earlier-negotiated-outcome", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No German approach on these lines was made at this date. The " +
      "Entente's willingness to treat with an unbeaten German army in September 1918 " +
      "is not something the record can settle, and this ending does not pretend it can.",
  },

  ohl_end_worseterms: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "Terms, Later",
    advisors: ["hindenburg"],
    situation:
      "The approach was made from a headquarters with nothing left to bring to it. " +
      "There is a version of this negotiation in which Germany arrives with an " +
      "unbroken front, an intact reserve and a government that speaks for itself, and " +
      "that version was available earlier at a price this command declined to pay.\n\n" +
      "What arrives instead is a delegation with a signature and no position.",
    ending: { family: "armistice-on-worse-terms", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Terms are not made only by armies. They are made by what the " +
      "asking side still has when it asks.",
  },

  ohl_end_intact: {
    year: 1918, date: "1918-11-11", city: "Spa",
    title: "An Army That Still Exists",
    advisors: ["hindenburg"],
    situation:
      "The eastern settlement was kept narrow and the divisions it would have " +
      "garrisoned came west. The salients were given up in July while giving them up " +
      "was still a decision rather than a consequence. The line is short, the reserve " +
      "is real, and the army that requests an armistice is an army rather than the " +
      "memory of one.\n\nNone of it changes the answer. It changes what is left of " +
      "Germany when the answer arrives.",
    ending: { family: "armistice-from-strength", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Both decisions were available and neither was taken. The " +
      "counterfactual is not that Germany wins; it is that the same defeat costs a " +
      "different amount.",
  },

  ohl_end_dictated: {
    year: 1918, date: "1918-11-11", city: "Kiev",
    title: "Holding the Prize",
    advisors: ["hindenburg"],
    situation:
      "The eastern territories are still garrisoned. The treaty that took them is " +
      "still in force, on paper, and the divisions administering it are still there, " +
      "doing that, while the west is decided without them.\n\nThe Supreme Command " +
      "took everything the east could be made to give and then spent the war holding " +
      "it down. Both halves of that were the same decision.",
    ending: { family: "east-held-west-lost", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Territory is only an asset if it can be held with fewer men than " +
      "it releases.",
  },

  ohl_end_relieved: {
    year: 1918, date: "1918-10-26", city: "Berlin",
    title: "A File Too Thick",
    advisors: ["hindenburg"],
    situation:
      "There is no single order that did this and no single refusal. There is a file, " +
      "and in it a pattern of a Chief who spent the Supreme Command's standing at home " +
      "to buy results in the field, and went on spending it after the results stopped " +
      "arriving.\n\n" +
      "A command that has consumed that much of the country's patience does not get " +
      "to choose the moment it stops. Somebody else chooses, and they choose now.",
    ending: {
      family: "hard-mode-relieved",
      badge: BADGES.CONTESTED,
      hardModeOnly: true,
    },
    epilogue: () =>
      "The office continues. The occupant does not.",
  },
};


// =============================================================================
// FRENCH GQG — HISTORICAL SPINE
// =============================================================================
//
// The 1917 mutinies are the campaign's centrepiece. Design constraint, stated
// explicitly: the repression is NARRATED, never dialled. The player does not set
// a number of executions. The choice is concession, discipline, or both — which
// is the choice the command actually faced. The execution count is itself
// disputed in the literature and the game says so rather than picking one.
// =============================================================================

CAMPAIGNS.gqg.startNode = "gqg_1914_01_frontieres";

CAMPAIGNS.gqg.commanders = [
  { id: "joffre", name: "Joffre", title: "Commander-in-Chief", from: "1914-08-01", to: "1916-12-12" },
  { id: "nivelle", name: "Nivelle", title: "Commander-in-Chief", from: "1916-12-12", to: "1917-05-15" },
  { id: "petain", name: "Petain", title: "Commander-in-Chief", from: "1917-05-15", to: "1918-11-11" },
];

CAMPAIGNS.gqg.advisors = [
  { id: "joffre", name: "Joffre", from: "1914-08-01", to: "1916-12-12",
    dossier: { role: "Commander-in-Chief, 1914-1916",
      bio: "Directed the armies from the Frontiers through the Marne, the 1915 offensives, Verdun and the Somme. Advocated concerted allied attack throughout.",
      fate: "Relieved in December 1916 and made a Marshal of France." } },
  { id: "castelnau", name: "de Castelnau", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Army and army group commander; chief of staff at GQG",
      bio: "Present at most of the war's decisions on the French side without ever holding the top command.",
      fate: "Survived the war. Not made a Marshal." } },
  { id: "gallieni", name: "Gallieni", from: "1914-08-01", to: "1916-05-27",
    dossier: { role: "Military Governor of Paris; later Minister of War",
      bio: "Held Paris in September 1914 and pressed for the counterattack against the exposed German flank.",
      fate: "Left the war ministry in 1916 on grounds of health and died that May." } },
  { id: "petain", name: "Petain", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Commander at Verdun; Commander-in-Chief from May 1917",
      bio: "Made his reputation on the defence of Verdun and the rotation system that fed the army through it. Took the command in May 1917 with the army in open indiscipline.",
      fate: "Restored the army through leave, rest and limited-objective operations. His later history is not this war's." } },
  { id: "nivelle", name: "Nivelle", from: "1916-12-12", to: "1917-05-15",
    dossier: { role: "Commander-in-Chief, December 1916 to May 1917",
      bio: "Came to prominence at Verdun in late 1916 and offered the governments what they wanted to hear: a rupture of the German line in forty-eight hours at a cost of around ten thousand men.",
      fate: "Relieved on 15 May 1917 and sent to North Africa." } },
  { id: "mangin", name: "Mangin", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Corps and army commander",
      bio: "Supported the Nivelle plan and fell with it in April 1917. Returned to command and led the counterattack of July 1918.",
      fate: "Survived the war." } },
  { id: "painleve", name: "Painleve", from: "1917-03-20", to: "1917-11-16",
    dossier: { role: "Minister of War from March 1917",
      bio: "Sceptical of the Nivelle plan from the start. Extracted the promise that the offensive would stop if it had not broken through in forty-eight hours.",
      fate: "Briefly Prime Minister in late 1917." } },
  { id: "foch", name: "Foch", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Army group commander; Allied generalissimo from 1918",
      bio: "Given coordinating authority over the Allied armies in the crisis of March 1918 and general command thereafter.",
      fate: "Marshal of France." } },
  { id: "clemenceau", name: "Clemenceau", from: "1917-11-16", to: "1918-11-11",
    dossier: { role: "Prime Minister from November 1917",
      bio: "Took office committed to prosecuting the war without negotiation and to subordinating the command to the civil power rather than the reverse.",
      fate: "Led the French delegation at the peace conference." } },
  { id: "lyautey", name: "Lyautey", from: "1916-12-12", to: "1917-03-20",
    dossier: { role: "Minister of War, December 1916 to March 1917",
      bio: "Opposed the Nivelle plan and resigned rather than carry it.",
      fate: "Returned to Morocco." } },
];

CAMPAIGNS.gqg.bulletinVoice = {
  source: "Communique officiel of the Grand Quartier General, as printed in the Paris press under censorship",
  register: "Terse, geographic, understating everything; the word 'nibbling' does more work than any adjective",
  defined: true,
};

CAMPAIGNS.gqg.hardMode.forcedEndingId = "gqg_end_relieved";
// Erosion cap set after measurement, same method as OHL. See measure-erosion.js.
CAMPAIGNS.gqg.hardMode.erosionMax = 5;

CAMPAIGNS.gqg.nodes = {

  gqg_1914_01_frontieres: {
    year: 1914, date: "1914-08-14", city: "Vitry-le-Francois",
    title: "Into Lorraine",
    advisors: ["joffre", "castelnau"],
    situation:
      "The plan is an attack into Lorraine and the Ardennes, into the provinces lost " +
      "in 1871, on the shortest line to the frontier. It is built on the conviction " +
      "that the decisive quality in this war will be the willingness to attack, and it " +
      "assumes the German right will not be strong enough to matter.\n\n" +
      "Reports from Belgium suggest the German right is very much strong enough to " +
      "matter. Acting on those reports means abandoning the attack before it has been " +
      "made and conceding that the army's whole doctrine was wrong on the first page.",
    context:
      "Reserve formations are the question underneath the question. The plan assumes " +
      "the Germans will not put reserve corps in the front line. If they do, the right " +
      "wing sweeping through Belgium is half again as strong as anyone has allowed for.",
    choices: [
      {
        id: "attack",
        label: "Attack as planned — Lorraine and the Ardennes",
        historical: true,
        advisor: { name: "Joffre", position:
          "The plan is not a suggestion. Armies that hesitate at the frontier do not recover the initiative later." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { gqg_opening: "asplanned" },
        erodes: "costly_offensive",
        next: "gqg_1914_02_marne",
        outcome:
          "The attacks go in and are stopped in front of positions the doctrine said " +
          "would give way. The Battle of the Frontiers costs the army more men in three " +
          "weeks than anyone in this building has budgeted for a year, and the German " +
          "right comes on through Belgium regardless.",
      },
      {
        id: "shift",
        label: "Break off in Lorraine and move weight left to meet the Belgian sweep",
        advisor: { name: "de Castelnau", position:
          "If the reports are right, the war is being decided on our left while we are attacking on our right." },
        gate: (m) => m.will >= 0,
        disabledReason: "The plan cannot be abandoned before it has been tried without losing the army's confidence",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_opening: "shifted" },
        next: "gqg_1914_02_marne",
        outcome:
          "Speculative. Formations move left earlier than they historically did. Fewer " +
          "men are spent on the frontier and more are in front of the sweep, at the " +
          "price of an army told on its first day that its doctrine was mistaken.",
      },
    ],
  },

  gqg_1914_02_marne: {
    year: 1914, date: "1914-09-05", city: "Paris",
    title: "The Flank in the Open",
    advisors: ["joffre", "gallieni"],
    bulletin: {
      voice: "gqg", date: "1914-09-04", source: "Communique officiel",
      text:
        "Our armies continue their movement in accordance with the intentions of the " +
        "high command. No engagement of importance is reported on the front as a whole.",
    },
    situation: (flags) =>
      "The retreat has been long and orderly and the government has left Paris. The " +
      "German First Army has turned inside the capital rather than around it, and its " +
      "flank is now in the open, in front of a garrison and a field army that have not " +
      "yet been used.\n\n" +
      (flags.gqg_opening === "shifted"
        ? "The formations shifted left in August are in hand and rested. The " +
          "counterattack, if it is made, is made from strength."
        : "The armies have been retreating for two weeks and are being asked to turn " +
          "and attack tomorrow. Whether they can is a question about men, not maps."),
    context:
      "The Military Government of Paris has been arguing for the attack for two days. " +
      "The armies that would make it are the armies that have been walking backwards " +
      "since Charleroi.",
    choices: [
      {
        id: "attack",
        label: "Turn and attack the exposed flank",
        historical: true,
        advisor: { name: "Gallieni", position:
          "The flank is there now. It will not be there next week, and neither will the initiative." },
        impact: { manpower: -1, munitions: -1, will: 3 },
        setFlags: { gqg_marne: "attacked" },
        dispute:
          "Responsibility for the German halt on the Marne is contested from the other " +
          "side of the hill. One tradition holds that German command control had already " +
          "broken down during August and that the withdrawal was self-inflicted; another " +
          "places the immediate cause with the divergence of the German First and Second " +
          "Armies and the gap it opened; a third credits the French counterattack itself. " +
          "How much the outcome was made here and how much at Luxembourg is not settled.",
        uncertain: [
          { weight: 65, title: "The gap opens and the invasion goes back", historicalBranch: true,
            impact: { will: 1 },
            setFlags: { gqg_marneResult: "exploited" },
            next: "gqg_1915_03_grignotage",
            outcome:
              "The armies turn. The gap between the German First and Second Armies opens " +
              "and is exploited, and the invasion stops short of the decision it needed. " +
              "The war that follows is a different war from the one everyone prepared for, " +
              "and it will last four years." },
          { weight: 35, title: "The counterattack is contained and the line settles further south",
            impact: { manpower: -1, will: -1 },
            setFlags: { gqg_marneResult: "contained" },
            next: "gqg_1915_03_grignotage",
            outcome:
              "Speculative. The turn is made and does not achieve the separation it " +
              "needed. The invasion is stopped, later and further south, and the line " +
              "that congeals runs across more of France than it historically did." },
        ],
      },
      {
        id: "continue",
        label: "Continue the withdrawal and attack when the armies are rested",
        advisor: { name: "Joffre", position:
          "An attack made with troops in this condition can fail once and finish everything." },
        gate: (m) => m.manpower >= -2,
        disabledReason: "There is no line further back that can be held with what is left",
        impact: { manpower: 1, munitions: 0, will: -3 },
        setFlags: { gqg_marne: "delayed" },
        next: "gqg_1915_03_grignotage",
        outcome:
          "Speculative. The withdrawal continues past the Marne and the flank closes. " +
          "The army is in better condition and the ground behind it is French, and " +
          "there is markedly less of it.",
      },
    ],
  },

  gqg_1915_03_grignotage: {
    year: 1915, date: "1915-09-25", city: "Chantilly",
    title: "Nibbling",
    advisors: ["joffre", "castelnau", "petain"],
    bulletin: {
      voice: "gqg", date: "1915-09-24", source: "Communique officiel",
      text:
        "Artillery preparation continues in Artois and in Champagne. Our positions " +
        "have been improved at several points.",
    },
    situation:
      "The line runs from the sea to Switzerland and cannot be turned, so it has to be " +
      "broken, and breaking it is what the year has been spent attempting. Artois in " +
      "the spring, Champagne in the autumn, and each time the first position is taken " +
      "and the second is not.\n\n" +
      "Ten departments are under occupation. Waiting is a strategy available to a " +
      "country whose territory is not being administered by the enemy, and France is " +
      "not that country. That fact has decided every offensive of this year and will " +
      "be produced again whenever the arithmetic is raised.",
    context:
      "There is a school inside the army arguing that the material simply is not there " +
      "yet for a rupture, and that offensives should be limited to what artillery can " +
      "actually guarantee. It is not a popular school.",
    choices: [
      {
        id: "press",
        label: "Continue the offensives — the occupied departments will not wait",
        historical: true,
        advisor: { name: "Joffre", position:
          "Every month of quiet is a month the enemy fortifies and a month France is administered from Berlin." },
        impact: { manpower: -2, munitions: -2, will: 0 },
        setFlags: { gqg_1915: "offensive" },
        erodes: "costly_offensive",
        next: "gqg_1916_04_verdun",
        outcome:
          "Artois and Champagne are fought and the second position holds both times. " +
          "The line moves by yards. The cost is entered in a ledger that the Chamber " +
          "will eventually read.",
      },
      {
        id: "limited",
        label: "Limit operations to what the guns can guarantee and build the artillery park",
        advisor: { name: "Petain", position:
          "Fire wins ground and men hold it. In that order, or not at all." },
        gate: (m) => m.will >= -1,
        disabledReason: "A year without an attempt to liberate the occupied departments cannot be defended in the Chamber",
        impact: { manpower: 2, munitions: -1, will: -2 },
        setFlags: { gqg_1915: "limited" },
        next: "gqg_1916_04_verdun",
        outcome:
          "Speculative. The offensives are scaled to the artillery available. The army " +
          "enters 1916 stronger and the government enters it having explained for twelve " +
          "months why nothing was attempted.",
      },
    ],
  },

  gqg_1916_04_verdun: {
    year: 1916, date: "1916-02-25", city: "Verdun",
    title: "The Fortress Has Already Been Stripped",
    advisors: ["petain", "joffre", "castelnau"],
    bulletin: {
      voice: "gqg", date: "1916-02-24", source: "Communique officiel",
      text:
        "A violent attack has been delivered north of Verdun. Our troops have carried " +
        "out the movements ordered. The struggle continues with the greatest vigour.",
    },
    situation:
      "The guns were taken out of the Verdun forts and sent to the field army, which " +
      "was defensible when the sector was quiet and is now the situation. The Germans " +
      "are attacking into a fortress zone that is a fortress mainly on the map.\n\n" +
      "There is a case for shortening the line, giving up the east bank, and refusing " +
      "the battle on ground of the enemy's choosing. It is militarily coherent. It " +
      "would also mean announcing that Verdun has been abandoned, and no government in " +
      "France survives that announcement.",
    context:
      "One road runs into the sector. Everything that reaches Verdun — men, shells, " +
      "food — reaches it along that road, and the battle will be as long as the road " +
      "can be kept working.",
    choices: [
      {
        id: "hold",
        label: "Hold both banks and feed the sector through the road",
        historical: true,
        advisor: { name: "Petain", position:
          "The sector can be held if units are rotated through it rather than left in it. Nothing else about this is negotiable." },
        impact: { manpower: -3, munitions: -2, will: 2 },
        setFlags: { gqg_verdun: "held" },
        next: "gqg_1916_05_somme",
        outcome:
          "Verdun is held, and held by rotation: divisions go in, are used, and come " +
          "out, and most of the French army passes through the sector before the year " +
          "is done. That rotation is why the army survives 1916 and why so much of it " +
          "has personally been to Verdun by 1917.",
      },
      {
        id: "shorten",
        label: "Give up the east bank and hold a shorter line further back",
        advisor: { name: "de Castelnau", position:
          "Ground is not the same as position. We are being invited to defend a name." },
        gate: (m) => m.will >= 2,
        disabledReason: "Abandoning Verdun cannot be survived politically from here",
        impact: { manpower: 2, munitions: 1, will: -4 },
        setFlags: { gqg_verdun: "shortened" },
        next: "gqg_1916_05_somme",
        outcome:
          "Speculative. The line is shortened and the battle the enemy wanted is " +
          "declined. The army is materially stronger for it and the government that " +
          "authorised it does not last the spring.",
      },
    ],
  },

  gqg_1916_05_somme: {
    year: 1916, date: "1916-07-01", city: "Chantilly",
    title: "The Offensive We Agreed To",
    advisors: ["joffre", "foch"],
    situation: (flags) =>
      "The combined offensive on the Somme was agreed at Chantilly when the French " +
      "contribution was to be the larger one. " +
      (flags.gqg_verdun === "shortened"
        ? "The line was shortened in February and the divisions exist. The original French share is still possible."
        : "Verdun has consumed the divisions that were to make it. What France can now put into the Somme is a fraction of what was promised.") +
      "\n\nThe British will attack either way. What is at stake is whether they " +
      "attack beside an ally or in place of one, and what that does to the alliance " +
      "for the remaining years of the war.",
    context:
      "Relieving Verdun is one argument for the Somme. Keeping the coalition intact is " +
      "the other, and it is the one that will still matter in 1918.",
    choices: [
      {
        id: "commit",
        label: "Commit what can be found and attack alongside the British",
        historical: true,
        advisor: { name: "Foch", position:
          "A coalition that attacks separately is two armies. One that attacks together is an alliance." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { gqg_somme: "committed" },
        erodes: "costly_offensive",
        next: "gqg_1916_06_nivelle",
        outcome:
          "The French share of the Somme is smaller than promised and is made. Pressure " +
          "comes off Verdun. The alliance holds, and the ledger grows.",
      },
      {
        id: "defer",
        label: "Defer the French contribution and let the British attack alone",
        advisor: { name: "Joffre", position:
          "We cannot fight two battles of this size in one summer. One of them has to be someone else's." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_somme: "deferred" },
        next: "gqg_1916_06_nivelle",
        outcome:
          "Speculative. The British attack on the Somme substantially alone. Divisions " +
          "are preserved. What is spent instead is the assumption, on the other side of " +
          "the Channel, that France will be there when the plan says so.",
      },
    ],
  },

  gqg_1916_06_nivelle: {
    year: 1916, date: "1916-12-12", city: "Paris",
    title: "Somebody Who Says It Can Be Quick",
    advisors: ["nivelle", "lyautey", "petain"],
    bulletin: {
      voice: "gqg", date: "1916-12-11", source: "Communique officiel",
      text:
        "The Government has under consideration the organisation of the high command. " +
        "The armies of the north and north-east continue to hold their positions.",
    },
    situation:
      "Two million French casualties in twenty-eight months have exhausted the " +
      "government's tolerance for being told that the war will be long. Joffre goes, " +
      "with a Marshal's baton to make the going look like something else.\n\n" +
      "Nivelle came out of Verdun with a reputation and a method, and he is offering " +
      "what nobody else will offer: rupture of the German line in forty-eight hours, " +
      "at a cost he puts around ten thousand. The alternative on the table is Petain's, " +
      "which is that the war cannot be won quickly and should be fought accordingly.",
    context:
      "The Minister of War will not carry the Nivelle plan and will resign rather than " +
      "do it. That is a warning available to anyone who wants to read it as one.",
    choices: [
      {
        id: "nivelle",
        label: "Back Nivelle and the forty-eight hour plan",
        historical: true,
        advisor: { name: "Nivelle", position:
          "The formula worked at Verdun on a small front. There is no reason of principle it cannot work on a large one." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { gqg_command: "nivelle" },
        next: "gqg_1917_07_chemin",
        outcome:
          "Nivelle takes the command in December. Lyautey leaves the war ministry " +
          "rather than sign the plan, and is replaced in March by Painleve, who is no " +
          "more convinced but stays to argue.",
      },
      {
        id: "petain",
        label: "Give the command to Petain and the doctrine of limited objectives",
        advisor: { name: "Petain", position:
          "I can promise the government ground taken at a price it can afford. I cannot promise it the war in two days." },
        gate: (m) => m.will >= -1,
        disabledReason: "A commander offering only a long war cannot be sold to this Chamber",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_command: "petain" },
        next: "gqg_1917_07_chemin",
        outcome:
          "Speculative. The limited-objective doctrine takes the top command a year " +
          "early. There is no forty-eight hour promise to fail, and no government " +
          "receives the victory it was told to expect.",
      },
    ],
  },

  gqg_1917_07_chemin: {
    year: 1917, date: "1917-04-18", city: "Chemin des Dames",
    title: "Forty-Eight Hours, and the Third Day",
    advisors: ["nivelle", "painleve", "mangin"],
    bulletin: {
      voice: "gqg", date: "1917-04-17", source: "Communique officiel",
      text:
        "Our troops attacked this morning between Soissons and Reims. The first German " +
        "positions have been carried at several points. Operations continue.",
    },
    situation: (flags) =>
      (flags.gqg_command === "petain"
        ? "There is no forty-eight hour promise. There is a limited-objective attack on " +
          "the Aisne, planned to take the first position and stop.\n\n"
        : "The promise was forty-eight hours and around ten thousand casualties. The " +
          "first day cost something near forty thousand.\n\n") +
      "The German second position is intact on the ridge, the defenders are in " +
      "quarries that the barrage did not reach, and the machine guns are sited to " +
      "cover every approach. The undertaking given to the Minister of War was that " +
      "this attack would stop if it had not broken through.\n\n" +
      "Stopping means admitting the promise was worthless. Continuing means the men on " +
      "the ridge pay for the promise.",
    context:
      "The army has been told this attack ends the war. It has been told that " +
      "explicitly, by name, in orders. Whatever happens on this ridge happens to an " +
      "army that was given a date.",
    choices: [
      {
        id: "continue",
        label: "Continue the offensive",
        historical: true,
        advisor: { name: "Nivelle", position:
          "The rupture is one more effort away. Stopping now converts a delay into a defeat." },
        impact: { manpower: -3, munitions: -2, will: -3 },
        setFlags: { gqg_chemin: "continued" },
        erodes: "costly_offensive",
        dispute:
          "How much of the 1917 crisis belongs to the offensive itself and how much to " +
          "the promise attached to it remains open. Leonard Smith's reading treats " +
          "the mutinies as closer to industrial action than to military collapse — " +
          "bargaining over leave, food, rest and the treatment of families, by men who " +
          "went on holding the line against attack. On that reading the trigger was the " +
          "breach of an explicit undertaking rather than casualties as such, which were " +
          "not without precedent in this army. Others weight the raw loss more heavily. " +
          "The offensive was not halted at forty-eight hours as promised, and the two " +
          "explanations are not fully separable.",
        uncertain: [
          { weight: 60, title: "The army stops obeying orders to attack", historicalBranch: true,
            impact: { will: -3 },
            setFlags: { gqg_mutinyScale: "widespread" },
            next: "gqg_1917_08_mutinies",
            outcome:
              "The offensive is halted on 9 May having taken ground and not the ridge, " +
              "at a cost around a hundred and eighty-seven thousand French casualties. " +
              "What follows is not a collapse of the front. Units refuse to move up to " +
              "attack while continuing to hold the line they are in — and it spreads." },
          { weight: 40, title: "Indiscipline stays local and is contained",
            impact: { will: -1 },
            setFlags: { gqg_mutinyScale: "contained" },
            next: "gqg_1917_08_mutinies",
            outcome:
              "Speculative. Refusals appear in the divisions worst used and do not " +
              "propagate beyond them. The crisis is real, smaller, and survivable " +
              "without a change of doctrine." },
        ],
      },
      {
        id: "halt",
        label: "Halt at the undertaking given — stop the offensive",
        advisor: { name: "Painleve", position:
          "The promise was forty-eight hours. It is the third day. There is nothing further to discuss." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { gqg_chemin: "halted", gqg_mutinyScale: "contained" },
        next: "gqg_1917_08_mutinies",
        outcome:
          "Speculative. The attack is broken off on the undertaking that was given. The " +
          "army is told the truth on the third day rather than the twenty-third, and the " +
          "commander who made the promise has to survive having kept it.",
      },
    ],
  },

  gqg_1917_08_mutinies: {
    year: 1917, date: "1917-05-29", city: "Compiegne",
    title: "The Army Is Bargaining",
    advisors: ["petain", "painleve", "mangin"],
    bulletin: {
      voice: "gqg", date: "1917-05-28", source: "Communique officiel",
      text:
        "The front is calm. Local artillery activity is reported in the sector of the " +
        "Aisne. There is nothing further to signal.",
    },
    situation: (flags) =>
      (flags.gqg_mutinyScale === "widespread"
        ? "By the end of May the refusals have reached something close to half the " +
          "infantry divisions on the Western Front. Pedroncini's archival count is " +
          "forty-nine divisions destabilised — nine gravely, fifteen seriously, " +
          "twenty-five with isolated but repeated incidents — out of a hundred and " +
          "thirteen. Between thirty and forty thousand men are involved by most counts.\n\n"
        : "The refusals are confined to the divisions worst used on the Aisne. They are " +
          "real, they are repeated, and they have not spread.\n\n") +
      "What they are is the difficulty. These men are not deserting and not " +
      "fraternising. They are holding the line against attack and refusing orders to " +
      "go forward, and their demands are leave, food, rest, and what happens to their " +
      "families. It resembles a strike more than it resembles a collapse.\n\n" +
      "An army that will defend but will not attack is still an army. It is not an " +
      "army that can be ordered to do anything.",
    context:
      "The affair is being kept out of the press entirely. The full extent will not be " +
      "established until archives open two-thirds of a century from now. That secrecy " +
      "is a decision, and it is being taken now, and it means whatever is done here is " +
      "done without any public account of why.",
    choices: [
      {
        id: "both",
        label: "Concede the grievances and try the ringleaders",
        historical: true,
        advisor: { name: "Petain", position:
          "Repression applied without remedy produces a second mutiny. Remedy without repression produces no army at all. It has to be both, and the remedy has to be visible first." },
        impact: { manpower: 1, munitions: 0, will: 3 },
        setFlags: { gqg_mutinyResponse: "both" },
        next: "gqg_1917_09_malmaison",
        outcome:
          "Regular home leave is organised, rest is made real, the food improves, and " +
          "the promise is given that there will be no more offensives of the April " +
          "kind. Alongside it there are around three thousand four hundred courts " +
          "martial and five hundred and fifty-four death sentences, the great majority " +
          "commuted. How many were carried out is disputed in the literature — " +
          "Pedroncini documents forty-three, Rolland puts it near thirty, other counts " +
          "run lower or higher, and the files were closed for a century. The army comes " +
          "back. It comes back to a commander who has promised it something.",
      },
      {
        id: "discipline",
        label: "Restore discipline first and address the grievances afterwards",
        advisor: { name: "Mangin", position:
          "An army that negotiates once will negotiate again. Order first, and the rest when there is order." },
        gate: (m) => m.will >= -4,
        disabledReason: "There is not enough authority left to attempt repression without remedy",
        impact: { manpower: -2, munitions: 0, will: -4 },
        setFlags: { gqg_mutinyResponse: "discipline" },
        erodes: "costly_offensive",
        nextIf: (m) => (m.will <= -7 ? "gqg_end_armybreaks" : null),
        next: "gqg_1917_09_malmaison",
        outcome:
          "Speculative. Discipline is applied without the leave rotation and the " +
          "promise. The historical evidence runs the other way on whether this works: " +
          "the restraint of the repression, and its pairing with real concession, is " +
          "what most accounts credit with ending the crisis in six weeks.",
      },
      {
        id: "report",
        label: "Report to the government that the army cannot be relied on to attack",
        advisor: { name: "Painleve", position:
          "If that is the true state of the army then the Ministry has to be told, whatever it decides to do with the information." },
        gate: (m) => m.will <= -2,
        disabledReason: "The army's condition does not yet warrant telling the government the offensive instrument is gone",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { gqg_mutinyResponse: "reported" },
        next: "gqg_end_negotiated",
        outcome:
          "Speculative. The condition of the army is put in writing to the Ministry " +
          "rather than managed inside the command. What a government does with that " +
          "information is no longer a military question.",
      },
    ],
  },

  gqg_1917_09_malmaison: {
    year: 1917, date: "1917-10-23", city: "La Malmaison",
    title: "A Small Attack That Works",
    advisors: ["petain", "mangin"],
    bulletin: {
      voice: "gqg", date: "1917-10-22", source: "Communique officiel",
      text:
        "Artillery preparation continues on the western portion of the Chemin des " +
        "Dames. Our batteries have registered on the objectives designated.",
    },
    situation: (flags) =>
      (flags.gqg_mutinyResponse === "discipline"
        ? "The army obeys. What it has stopped doing is anything more than obeying.\n\n"
        : "The army has been rested, fed, given leave and promised that it will not be " +
          "asked to do April again. The promise now has to be honoured in a way the men " +
          "can see.\n\n") +
      "The Chemin des Dames is still German. Taking the west end of it with an " +
      "operation limited to what the artillery can guarantee is the doctrine's test " +
      "case: an attack with an announced objective, which stops when it reaches it.\n\n" +
      "It is also, quietly, the only kind of offensive this army will currently accept.",
    context:
      "Clemenceau takes the government in November committed to prosecuting the war " +
      "without negotiation, and to the proposition that the command answers to the " +
      "civil power. Both halves of that are about to matter.",
    choices: [
      {
        id: "limited",
        label: "Attack with a limited objective and stop at it",
        historical: true,
        advisor: { name: "Petain", position:
          "The men will be told exactly where the attack stops, and then it will stop there. That is the whole of the method." },
        impact: { manpower: -1, munitions: -2, will: 3 },
        setFlags: { gqg_malmaison: "limited" },
        next: "gqg_1918_10_doullens",
        outcome:
          "The fort and village are taken and the operation stops on its objective. The " +
          "Germans give up the remainder of the ridge and go back across the Ailette. " +
          "The cost is a fraction of April's and the ground is greater. The army " +
          "notices, which is the point of it.",
      },
      {
        id: "exploit",
        label: "Take the objective and exploit beyond it while the line is broken",
        advisor: { name: "Mangin", position:
          "A broken line is an opportunity. Announcing in advance that we will not use it is a strange way to fight." },
        gate: (m) => m.munitions >= -3,
        disabledReason: "The artillery cannot support an advance beyond the announced objective",
        impact: { manpower: -2, munitions: -1, will: -3 },
        setFlags: { gqg_malmaison: "exploited" },
        erodes: "costly_offensive",
        next: "gqg_1918_10_doullens",
        outcome:
          "Speculative. The attack goes past the line it announced. Whatever ground " +
          "that gains, it costs the one thing the summer was spent rebuilding: the " +
          "army's belief that when this command names a limit, the limit is real.",
      },
    ],
  },

  gqg_1918_10_doullens: {
    year: 1918, date: "1918-03-26", city: "Doullens",
    title: "Somebody Has to Be in Charge of Both",
    advisors: ["foch", "petain", "clemenceau"],
    bulletin: {
      voice: "gqg", date: "1918-03-25", source: "Communique officiel",
      text:
        "The battle continues on the whole front between the Somme and the Oise. Our " +
        "troops, in liaison with the British forces, are carrying out the movements " +
        "required by the situation.",
    },
    situation:
      "The German offensive has opened a gap on the British front and the two armies " +
      "are being pushed apart. Each has a line of retreat, and the two lines diverge: " +
      "the British toward the Channel ports, the French toward Paris. Followed " +
      "separately, they lose the war between them without either being beaten.\n\n" +
      "Holding them together requires one authority over both, which means a French " +
      "commander accepting that his armies can be committed by someone other than " +
      "himself, or a British one accepting the same. Nobody has been willing to concede " +
      "this in three and a half years.",
    context:
      "The Americans are arriving and the question of who commands them is the same " +
      "question, deferred. Whatever is agreed here sets the shape of it.",
    choices: [
      {
        id: "unified",
        label: "Accept unified command — Foch coordinates both armies",
        historical: true,
        advisor: { name: "Foch", position:
          "The two armies must be one instrument or they will be two retreats. I do not need to command them. Somebody does." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_command1918: "unified" },
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "Coordinating authority over the Allied armies goes to Foch, and grows into " +
          "general command. The two retreats become one defence. What has been given up " +
          "is the independence of the French command, and it is not given back.",
      },
      {
        id: "national",
        label: "Keep national command and coordinate by agreement",
        advisor: { name: "Petain", position:
          "I will not have French divisions committed to cover a British withdrawal by a man who does not answer to France." },
        gate: (m) => m.will >= -2,
        disabledReason: "The crisis is past the point where coordination by agreement can be defended",
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { gqg_command1918: "national" },
        erodes: "costly_offensive",
        nextIf: (m) => (m.manpower <= -6 ? "gqg_end_coalitionfails" : null),
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "Speculative. Command stays national and coordination stays a matter of " +
          "agreement between headquarters that disagree. The gap between the two armies " +
          "is now a matter of goodwill under artillery fire.",
      },
    ],
  },

  gqg_1918_11_counteroffensive: {
    year: 1918, date: "1918-07-18", city: "Villers-Cotterets",
    title: "The Turn",
    advisors: ["foch", "mangin", "petain"],
    bulletin: {
      voice: "gqg", date: "1918-07-17", source: "Communique officiel",
      text:
        "The enemy attack east and west of Reims has been contained. Our line is " +
        "everywhere intact. The situation is favourable.",
    },
    situation: (flags) =>
      "The German offensives have taken more ground than anything since 1914 and are " +
      "standing in salients they do not have the men to hold. " +
      (flags.gqg_command1918 === "unified"
        ? "There is one command over the Allied armies and it can move reserves from anywhere to anywhere."
        : "There are two commands, and a counterattack requires them to agree in the time available.") +
      "\n\nThe flank of the Marne salient is open, out of the forest at " +
      "Villers-Cotterets, and the reserve to strike it exists. Committing it now spends " +
      "the last fresh divisions in France on a judgment about an enemy who has " +
      "attacked five times this year.\n\n" +
      "The army being asked to attack is the army that would not attack fourteen " +
      "months ago.",
    choices: [
      {
        id: "strike",
        label: "Commit the reserve against the salient flank",
        historical: true,
        advisor: { name: "Mangin", position:
          "They are in the open and out of reserves. There will not be a better morning than tomorrow." },
        impact: { manpower: -2, munitions: -2, will: 2 },
        setFlags: { gqg_1918: "counterattacked" },
        dispute:
          "Whether the July counterattack seized the initiative or merely arrived as the " +
          "German offensives were exhausting themselves is a live question. The " +
          "operational critique of Ludendorff holds that the spring offensives had " +
          "already failed strategically by mid-July and left an army in exposed salients " +
          "with no reserve, which would suggest the turn was coming regardless. The " +
          "counter-reading is that an unpressed enemy in a salient consolidates, and that " +
          "the timing of the blow is precisely what denied that.",
        nextIf: (m, flags) =>
          m.will <= -6 ? "gqg_end_armybreaks"
          : (flags.gqg_command1918 === "national") ? "gqg_end_costlier"
          : (flags.gqg_mutinyResponse === "both" && m.manpower >= -3) ? "gqg_end_intact"
          : null,
        next: "gqg_end_victory",
        uncertain: [
          { weight: 70, title: "The initiative changes hands and does not change back", historicalBranch: true,
            impact: { will: 1 },
            setFlags: { gqg_1918Result: "turned" },
            outcome:
              "The counterattack goes in out of the forest and the salient begins to " +
              "close. The initiative changes hands and does not change back. From here " +
              "the fighting is continuous, and it is going one way." },
          { weight: 30, title: "The blow lands on an enemy already withdrawing",
            impact: { manpower: -1 },
            setFlags: { gqg_1918Result: "coincided" },
            outcome:
              "Speculative. The reserve is committed against a salient that was being " +
              "given up regardless. The ground comes back and the last fresh divisions " +
              "in France are spent taking what was going to be evacuated." },
        ],
      },
      {
        id: "hold",
        label: "Hold the reserve and let the offensives exhaust themselves",
        advisor: { name: "Petain", position:
          "They will run out without our help. Spending the last reserve to prove a point we can wait for is how this army was ruined before." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_1918: "husbanded" },
        nextIf: (m) =>
          m.will <= -5 ? "gqg_end_armybreaks"
          : m.manpower <= -4 ? "gqg_end_paris"
          : null,
        next: "gqg_end_defensive",
        outcome:
          "Speculative. The reserve stays in hand and the German offensives stop on " +
          "their own, as they were going to. The initiative is not taken, because " +
          "taking it was the thing declined.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  gqg_end_victory: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "The Ten Departments",
    advisors: ["foch", "clemenceau"],
    situation:
      "The armistice is signed in a railway carriage in the forest at Compiegne and " +
      "the occupied departments come back. That was the war aim from the first week " +
      "and it has been achieved, and there is no version of this morning that feels " +
      "like the word victory is doing honest work.\n\n" +
      "The ledger is not a thing to be softened here and will not be. The generation " +
      "that held Verdun and would not attack in 1917 and attacked in 1918 is the " +
      "generation that is not coming back.",
    ending: { family: "victory-that-does-not-feel-like-one", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "August 1914: " + (flags.gqg_opening === "shifted" ? "the plan was abandoned before it was tried." : "the plan was executed as written.") + "\n" +
      "The Marne: " + (flags.gqg_marne === "delayed" ? "the counterattack was deferred." : flags.gqg_marneResult === "contained" ? "attacked, and contained short of a separation." : "the flank was attacked and the gap exploited.") + "\n" +
      "July 1918: " + (flags.gqg_1918Result === "coincided" ? "the blow landed on an enemy already going back." : flags.gqg_1918 === "husbanded" ? "the reserve was held." : "the reserve took the initiative at Villers-Cotterets.") + "\n" +
      "Verdun: " + (flags.gqg_verdun === "shortened" ? "the east bank was given up." : "both banks held, by rotation.") + "\n" +
      "The Aisne: " + (flags.gqg_chemin === "halted" ? "halted on the undertaking given." : "continued past forty-eight hours.") + "\n" +
      "The crisis of 1917: " + (flags.gqg_mutinyResponse === "discipline" ? "answered with discipline first." : "answered with remedy and repression together.") + "\n" +
      "March 1918: " + (flags.gqg_command1918 === "national" ? "command remained national." : "command was unified under Foch.") + "\n" +
      "1915: " + (flags.gqg_1915 === "limited" ? "operations limited to the artillery available." : "offensives in Artois and Champagne.") + "\n" +
      "The Somme: " + (flags.gqg_somme === "deferred" ? "the French contribution was deferred." : "committed alongside the British.") + "\n" +
      "La Malmaison: " + (flags.gqg_malmaison === "exploited" ? "the announced limit was exceeded." : "stopped on its objective.") + "\n" +
      "1918 command: " + (flags.gqg_command1918 === "national" ? "national throughout." : "unified from March."),
  },

  gqg_end_armybreaks: {
    year: 1918, date: "1918-06-01", city: "Compiegne",
    title: "It Does Not Come Back",
    advisors: ["petain"],
    situation:
      "The crisis of 1917 was survivable and was not survived. What made it survivable " +
      "was that the men refusing orders were bargaining rather than breaking, and a " +
      "bargain requires the other side to offer something.\n\n" +
      "An army given nothing does not return to the condition it was in before it " +
      "asked. It holds, less each month, until it is asked to do something it will not " +
      "do at a moment when the enemy is watching.",
    ending: { family: "army-does-not-recover-from-1917", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical army recovered inside six weeks. Most accounts " +
      "credit the pairing — leave, rest, and the promise, alongside a repression " +
      "deliberately kept narrow. Removing half of that pairing is the counterfactual, " +
      "and the evidence points where this ending points.",
  },

  gqg_end_coalitionfails: {
    year: 1918, date: "1918-04-15", city: "Amiens",
    title: "Two Retreats",
    advisors: ["petain"],
    situation:
      "Each army withdrew toward what it could not afford to lose. The British went " +
      "toward their ports and the French toward their capital, and the gap between " +
      "them widened with every mile because both were behaving correctly by their own " +
      "lights.\n\n" +
      "Neither army was beaten. The space between them was.",
    ending: { family: "coalition-fracture", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Unified command was conceded historically, in this month, under " +
      "exactly this pressure. It is the counterfactual precisely because everyone " +
      "involved could see what refusing it would cost.",
  },

  gqg_end_costlier: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "The Same Ending, Later",
    advisors: ["foch"],
    situation:
      "The war is won and the departments come back, and it takes longer and costs " +
      "more than it needed to because two headquarters spent the spring agreeing with " +
      "each other in writing.\n\n" +
      "Every reserve moved late, every counterattack mounted a week after the moment " +
      "for it, every liaison officer riding between two staffs who each had the " +
      "authority to say no.",
    ending: { family: "victory-at-higher-cost", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Unity of command did not win the war. It shortened it, and the " +
      "difference is measured in the only currency that has been counted here.",
  },

  gqg_end_intact: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "An Army That Was Kept",
    advisors: ["petain", "foch"],
    situation:
      "The army that stands at the armistice was rebuilt after 1917 rather than " +
      "merely disciplined, was not spent to prove points in the autumn, and was " +
      "committed once, at the right moment, under a command that could move it.\n\n" +
      "The departments come back. So do more of the men who took them, and that is the " +
      "whole of what was available to be won here.",
    ending: { family: "victory-with-the-army-preserved", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The outcome of the war was not in the gift of this headquarters " +
      "by 1918. What the ledger looked like at the end of it was.",
  },

  gqg_end_defensive: {
    year: 1918, date: "1918-11-11", city: "Chantilly",
    title: "Waiting Correctly",
    advisors: ["petain"],
    situation:
      "The German offensives stopped without being counterattacked, which is what they " +
      "were going to do. The reserve was preserved, the line held, and the initiative " +
      "was left where it lay.\n\n" +
      "It was not wrong. The army is intact and the front is unbroken and the argument " +
      "for waiting was sound every single time it was made. The war simply goes on " +
      "being fought by whoever is willing to start something.",
    ending: { family: "defensive-into-1919", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Husbanding an army is a defensible doctrine and this is what it " +
      "produces when nobody spends it.",
  },

  gqg_end_negotiated: {
    year: 1917, date: "1917-08-01", city: "Paris",
    title: "The Conversation Nobody Was Allowed to Have",
    advisors: ["painleve"],
    situation:
      "With the army in open indiscipline and the Chamber told none of it, an approach " +
      "is made. It is made from a country holding a line it can hold, with ten " +
      "departments still under occupation, which is the whole difficulty: any terms " +
      "available now leave some of France where it currently is.\n\n" +
      "That is why this was never seriously attempted. It is not that nobody thought of " +
      "it.",
    ending: { family: "earlier-negotiated-outcome", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No French government of 1917 could have signed terms leaving the " +
      "occupied departments in German hands and survived the signing.",
  },

  gqg_end_paris: {
    year: 1918, date: "1918-06-10", city: "Paris",
    title: "The Government Leaves Again",
    advisors: ["petain", "foch"],
    situation:
      "The offensives were not counterattacked and were not contained early, and the " +
      "line has come south far enough that the ministries are being packed for the " +
      "second time in this war.\n\n" +
      "The army is not broken and the front is not open. Neither of those facts is " +
      "what anyone in the country is looking at.",
    ending: { family: "german-1918-reaches-further", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical German offensives came near enough to Paris to be " +
      "shelled from range and no nearer. What kept them there was reserves committed " +
      "at moments somebody chose.",
  },

  gqg_end_relieved: {
    year: 1918, date: "1918-06-15", city: "Paris",
    title: "The Chamber Reads the Ledger",
    advisors: ["clemenceau"],
    situation:
      "No single offensive did this. There is a column of figures covering four years " +
      "and a pattern in it: a command that answered every problem with an attack and " +
      "went on answering after the attacks had stopped producing anything but the " +
      "figures.\n\n" +
      "In this Republic the army does not outlast the civil power's patience with it. " +
      "That was settled a long time before this war and it is being demonstrated again " +
      "now.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "Command in a republic is held on terms. The terms were always the casualty list.",
  },
};


// =============================================================================
// RUSSIAN STAVKA — HISTORICAL SPINE
// =============================================================================
//
// DATES ARE JULIAN (Old Style) to 31 January 1918, per spec §13.1 and the
// campaign's calendar field. Western dates appear in parentheses on first
// mention within a node, never on every mention. Brest-Litovsk is dated New
// Style because Russia changed calendars in February 1918 — the change happens
// inside the campaign and the dates reflect it.
//
// Terminal nodes hand into the situation Dispatches 1922 opens from.
// =============================================================================

CAMPAIGNS.stavka.startNode = "stavka_1914_01_prussia";

CAMPAIGNS.stavka.commanders = [
  { id: "grandduke", name: "Grand Duke Nikolai Nikolaevich", title: "Supreme Commander",
    from: "1914-07-19", to: "1915-08-23" },
  { id: "tsar", name: "Nicholas II", title: "Supreme Commander",
    from: "1915-08-23", to: "1917-03-02" },
  { id: "provisional", name: "the Provisional Government's command", title: "Supreme Command",
    from: "1917-03-02", to: "1918-03-03" },
];

CAMPAIGNS.stavka.advisors = [
  { id: "grandduke", name: "Grand Duke Nikolai Nikolaevich", from: "1914-07-19", to: "1915-09-13",
    dossier: { role: "Supreme Commander, 1914-1915",
      bio: "Held the supreme command under regulations granting extraordinary authority answerable only to the Emperor — which also placed him to absorb all the blame when 1915 went as it did.",
      fate: "Removed in August 1915 and appointed Viceroy of the Caucasus." } },
  { id: "zhilinsky", name: "Zhilinsky", from: "1914-07-19", to: "1914-09-17",
    dossier: { role: "Commander, North-Western Front",
      bio: "Directed the two armies sent into East Prussia and the coordination between them that did not occur.",
      fate: "Removed from the front command in September 1914." } },
  { id: "samsonov", name: "Samsonov", from: "1914-07-19", to: "1914-08-17",
    dossier: { role: "Commander, Second Army",
      bio: "Took the Second Army into East Prussia from the south, out of wireless contact and ahead of its supply.",
      fate: "Died during the destruction of his army in August 1914." } },
  { id: "rennenkampf", name: "Rennenkampf", from: "1914-07-19", to: "1914-11-01",
    dossier: { role: "Commander, First Army",
      bio: "Commanded the northern of the two armies in East Prussia. The failure of the two to combine is the centre of every account of the campaign.",
      fate: "Removed from command in late 1914." } },
  { id: "sukhomlinov", name: "Sukhomlinov", from: "1914-07-19", to: "1915-06-13",
    dossier: { role: "Minister of War to 1915",
      bio: "Presided over the munitions position with which Russia entered the war and the shortage that followed.",
      fate: "Dismissed in June 1915 and later prosecuted." } },
  { id: "polivanov", name: "Polivanov", from: "1915-06-13", to: "1916-03-15",
    dossier: { role: "Minister of War, 1915-1916",
      bio: "Took the war ministry during the retreat and worked with the public bodies and war-industry committees the court distrusted.",
      fate: "Dismissed in March 1916." } },
  { id: "alekseyev", name: "Alekseyev", from: "1915-08-23", to: "1917-09-09",
    dossier: { role: "Chief of Staff at Stavka, 1915-1917; Supreme Commander, March to May 1917",
      bio: "Appointed when the Emperor took the supreme command and given charge of operations; by most accounts the effective commander from that point. Held the supreme command under the Provisional Government from March to May 1917 and returned briefly as Chief of Staff at the end of August.",
      fate: "Went to Novocherkassk in November 1917 and began forming the officer organisation that became the Volunteer Army. Died in 1918." } },
  { id: "dukhonin", name: "Dukhonin", from: "1917-08-30", to: "1917-11-20",
    dossier: { role: "Chief of Staff from September 1917; de facto Supreme Commander after October",
      bio: "Took the command by default when the head of the Provisional Government fled, over an army he had very little control of. Declined the new authority's order to open armistice negotiations on the ground that such an order could only come from a government sustained by the army and the country.",
      fate: "Dismissed by wireless and killed by a mob at Mogilev in November 1917." } },
  { id: "brusilov", name: "Brusilov", from: "1914-07-19", to: "1917-07-19",
    dossier: { role: "Army and front commander; Supreme Commander in 1917",
      bio: "Reported in 1915 that a third of the men in some engagements went into action without rifles and waited for casualties to supply them. Devised the 1916 offensive on the South-Western Front.",
      fate: "Held the supreme command briefly in 1917 and later served the Soviet state." } },
  { id: "ruzsky", name: "Ruzsky", from: "1914-07-19", to: "1917-04-25",
    dossier: { role: "Front commander",
      bio: "Commanded the Northern Front and was present at Pskov in March 1917 when the front commanders were canvassed on the abdication.",
      fate: "Left the army in 1917." } },
  { id: "kerensky", name: "Kerensky", from: "1917-03-02", to: "1917-10-25",
    dossier: { role: "Minister of War, later head of the Provisional Government",
      bio: "Attempted to prosecute the war with an army that had already been told, by decree, that its orders were subject to committee.",
      fate: "Left Russia after October." } },
];

CAMPAIGNS.stavka.bulletinVoice = {
  source: "Communique of the Staff of the Supreme Commander, as carried in the Petrograd press under censorship",
  register: "Formal, devotional in its framing, geographic where it can be and silent where it cannot",
  defined: true,
};

CAMPAIGNS.stavka.hardMode.forcedEndingId = "stavka_end_relieved";
// erosionMax set AFTER measurement for this campaign. See measure-erosion.js.
CAMPAIGNS.stavka.hardMode.erosionMax = 4;

CAMPAIGNS.stavka.nodes = {

  stavka_1914_01_prussia: {
    year: 1914, date: "1914-08-04", city: "Baranovichi",
    title: "Before the Concentration Is Finished",
    advisors: ["grandduke", "zhilinsky", "samsonov"],
    bulletin: {
      voice: "stavka", date: "1914-08-02", source: "Communique of the Staff",
      text:
        "The mobilisation proceeds throughout the Empire in exemplary order. The " +
        "armies of the Supreme Commander stand ready upon the western frontier.",
    },
    situation:
      "The French are asking for an offensive into East Prussia now — today, 4 August " +
      "(17 August in the west) — and the undertaking to make one was given before the " +
      "war, in writing, as the price of the alliance and the loans that built the " +
      "railways this army is riding on.\n\n" +
      "The concentration is not finished. Two armies are to go in either side of the " +
      "Masurian Lakes, which means they cannot support one another until they have " +
      "converged past them, and the wireless discipline between them is not what it " +
      "should be.",
    context:
      "Waiting three weeks produces two armies that can operate together. It also " +
      "means the French fight the opening of the war alone, having been promised they " +
      "would not, and they are not likely to forget which it was.",
    choices: [
      {
        id: "advance",
        label: "Advance now — the undertaking to the French was given",
        historical: true,
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "The alliance is the reason this army has railways. We will keep the promise and take the consequences of keeping it." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { stavka_prussia: "early" },
        next: "stavka_1914_02_galicia",
        outcome:
          "Both armies cross the frontier ahead of their supply. The First Army comes " +
          "on from the north-east and the Second from the south, and between them lie " +
          "the lakes and a railway network the enemy can use and they cannot.",
      },
      {
        id: "concentrate",
        label: "Complete the concentration first",
        advisor: { name: "Zhilinsky", position:
          "Two armies that cannot reach each other are not a front. They are two opportunities offered separately." },
        gate: (m) => m.will >= 0,
        disabledReason: "The undertaking to the French cannot be broken in the first fortnight of the war",
        impact: { manpower: 2, munitions: 0, will: -3 },
        setFlags: { stavka_prussia: "concentrated" },
        next: "stavka_1914_02_galicia",
        outcome:
          "Speculative. The advance waits for the armies to be ready to make it " +
          "together. The instrument is better and the alliance is worse, and the second " +
          "of those will be raised at every conference for the rest of the war.",
      },
    ],
  },

  stavka_1914_02_galicia: {
    year: 1914, date: "1914-08-25", city: "Lvov",
    title: "Two Fronts of Our Own",
    advisors: ["grandduke", "brusilov", "rennenkampf"],
    bulletin: {
      voice: "stavka", date: "1914-08-23", source: "Communique of the Staff",
      text:
        "Upon the South-Western Front our troops have carried the enemy positions and " +
        "advance upon Lemberg. In the Prussian theatre operations continue. The Staff " +
        "does not consider it useful to particularise.",
    },
    situation: (flags) =>
      (flags.stavka_prussia === "early"
        ? "East Prussia has gone as it was always liable to go. The Second Army was " +
          "surrounded and destroyed in the country south of the lakes and its commander " +
          "is dead. "
        : "East Prussia was entered late and in order, and the Germans were ready. ") +
      "Against that, Galicia is going extremely well: the Austrians are being pushed " +
      "out of Lemberg and back toward the Carpathians, and the front there is the one " +
      "place in this war where the Russian army is beating somebody.\n\n" +
      "Reinforcing success in Galicia means accepting that East Prussia stays a " +
      "German victory. Renewing in the north means taking the better front's divisions " +
      "to repair the worse one.",
    context:
      "Austria-Hungary can be beaten and Germany, on present evidence, cannot. That is " +
      "an argument for Galicia and it is also an argument for a war that never touches " +
      "the enemy who matters.",
    choices: [
      {
        id: "galicia",
        label: "Reinforce Galicia and press the Austrians",
        historical: true,
        advisor: { name: "Brusilov", position:
          "The Austrians will break where the Germans will not. That is not a reason to stop pushing the Austrians." },
        impact: { manpower: -1, munitions: -2, will: 2 },
        setFlags: { stavka_1914theatre: "galicia" },
        next: "stavka_1915_03_retreat",
        outcome:
          "The South-Western Front takes Lemberg and drives toward the passes. It is " +
          "the largest Russian success of the war so far and it is against the wrong " +
          "empire, and everyone in this building knows it.",
      },
      {
        id: "prussia",
        label: "Renew the effort in East Prussia with divisions from the south",
        advisor: { name: "Rennenkampf", position:
          "A defeat that is not answered becomes a permanent fact. We have one front where the enemy expects nothing further from us." },
        gate: (m) => m.manpower >= 0,
        disabledReason: "The northern armies cannot absorb reinforcement at this strength",
        impact: { manpower: -2, munitions: -2, will: 0 },
        setFlags: { stavka_1914theatre: "prussia" },
        next: "stavka_1915_03_retreat",
        outcome:
          "Speculative. Divisions go north from a front that was winning to a front " +
          "that was not. The Austrians get the winter to recover in and the Germans get " +
          "a second opportunity on ground they have already fought over.",
      },
    ],
  },

  stavka_1915_03_retreat: {
    year: 1915, date: "1915-04-19", city: "Gorlice",
    title: "A Third of the Men Have No Rifle",
    advisors: ["grandduke", "sukhomlinov", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1915-04-17", source: "Communique of the Staff",
      text:
        "In the Carpathian region our troops maintain their positions. Enemy attacks " +
        "in the Gorlice sector have been met. The Supreme Commander has every " +
        "confidence in the valour of the army.",
    },
    situation:
      "The breakthrough at Gorlice-Tarnow is being made with an artillery weight this " +
      "army cannot answer, and it cannot answer it because the shells are not there. " +
      "Brusilov reports men going into action without rifles, waiting for casualties " +
      "among their comrades to supply them.\n\n" +
      "The line in Poland is a salient and holding it is a decision to lose armies in " +
      "it. Giving it up means giving up Warsaw and a great deal of the Empire's western " +
      "territory, and saying so to a court that regards territory as the thing being " +
      "defended.",
    context:
      "The war ministry that presided over the munitions position is still in office. " +
      "The public bodies and war-industry committees offering to fix it are exactly the " +
      "organisations the court most distrusts, because organising anything creates " +
      "people who have organised something.",
    choices: [
      {
        id: "withdraw",
        label: "Give up the Polish salient — trade space for the army",
        historical: true,
        advisor: { name: "Brusilov", position:
          "We can replace ground. We are, at this moment, unable to replace rifles." },
        impact: { manpower: -2, munitions: -2, will: -3 },
        setFlags: { stavka_1915: "withdrew" },
        next: "stavka_1915_04_command",
        outcome:
          "The Great Retreat gives up Poland, Lithuania and much of the western " +
          "provinces and keeps the army in being. It is the correct decision and it " +
          "looks, from Petrograd, exactly like losing the war.",
      },
      {
        id: "hold",
        label: "Hold the salient — the western provinces are the Empire",
        advisor: { name: "Sukhomlinov", position:
          "An empire that withdraws from its own territory in the first year explains that to its subjects for the rest of the war." },
        gate: (m) => m.munitions >= -2,
        disabledReason: "The salient cannot be held without shells that do not exist",
        impact: { manpower: -4, munitions: -1, will: 1 },
        setFlags: { stavka_1915: "held" },
        erodes: "expose_regime",
        next: "stavka_1915_04_command",
        outcome:
          "Speculative. The salient is held for as long as it can be and the armies in " +
          "it are consumed doing it. The map in Petrograd looks better for some months " +
          "and the army behind the map does not.",
      },
    ],
  },

  stavka_1915_04_command: {
    year: 1915, date: "1915-08-23", city: "Mogilev",
    title: "The Emperor Takes the Command",
    advisors: ["grandduke", "alekseyev", "polivanov"],
    bulletin: {
      voice: "stavka", date: "1915-08-21", source: "Communique of the Staff",
      text:
        "His Imperial Majesty has been pleased to visit the Staff of the Supreme " +
        "Commander. The armies continue to occupy the positions assigned to them.",
    },
    situation:
      "On 23 August (5 September in the west) the Emperor assumes the supreme command " +
      "in person, and the Grand Duke goes to the Caucasus.\n\n" +
      "The Council of Ministers has protested nearly to a man and been overruled, and " +
      "several of them will shortly be dismissed for it. The case against is simple: " +
      "the Emperor has no experience of war, and from this day forward every reverse " +
      "at the front is a reverse belonging personally to the throne rather than to a " +
      "commander who can be replaced.\n\n" +
      "The case for is not nothing. The Grand Duke's authority was extraordinary and " +
      "answerable to nobody except the Emperor. Civil and military authority in the " +
      "border regions have not been coordinated at all.",
    context:
      "Whoever holds the title, Alekseyev will run the operations. What actually " +
      "changes with this decision is not where orders come from. It is where blame " +
      "goes, and what happens in the capital while the Emperor is four hundred miles " +
      "away at headquarters.",
    choices: [
      {
        id: "assume",
        label: "The Emperor assumes the command",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "I will conduct the operations. His Majesty's presence at headquarters is a question about the throne, not about the front." },
        impact: { manpower: 0, munitions: 1, will: -2 },
        setFlags: { stavka_command: "tsar" },
        erodes: "expose_regime",
        dispute:
          "The standard verdict is that this was ruinous: it bound the dynasty to " +
          "every military failure and left the capital to the Empress and to Rasputin's " +
          "nominees, with ministers replaced in rapid succession and the court widely " +
          "suspected of treachery. A revisionist line holds that the operational effect " +
          "was slight — Alekseyev ran the front and there is little sign the Emperor " +
          "imposed strategy on him — and that the real causes of collapse lie in " +
          "industrial and administrative weakness that predated 1915. Historians " +
          "continue to divide on how much of the monarchy's fall to assign to the " +
          "autocratic system, to wartime dislocation, and to this man's personality.",
        uncertain: [
          { weight: 60, title: "The front steadies and the capital does not", historicalBranch: true,
            impact: { will: -2 },
            setFlags: { stavka_commandResult: "capitallost" },
            next: "stavka_1916_05_brusilov",
            outcome:
              "Alekseyev takes charge of operations and the line stabilises through the " +
              "autumn. Four hundred miles away, competent ministers are dismissed and " +
              "replaced by the Empress's nominees, and the belief that the court is " +
              "working against the war spreads through people who are not " +
              "revolutionaries and were not going to be." },
          { weight: 40, title: "The presence steadies both",
            impact: { will: 1 },
            setFlags: { stavka_commandResult: "steadied" },
            next: "stavka_1916_05_brusilov",
            outcome:
              "Speculative. The Emperor at headquarters is visible to the army in a way " +
              "he has not been, the operations are conducted by a professional, and the " +
              "arrangements in the capital hold together better than they historically " +
              "did. It requires the court to behave differently, which is the part of " +
              "this that is speculation." },
        ],
      },
      {
        id: "keep",
        label: "Keep the Grand Duke in the supreme command",
        advisor: { name: "Polivanov", position:
          "So long as the command can be replaced, the failures belong to the commander. Once it cannot, they belong to the throne." },
        gate: (m) => m.will >= -2,
        disabledReason: "The court will not be told a second time",
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { stavka_command: "grandduke" },
        next: "stavka_1916_05_brusilov",
        outcome:
          "Speculative. The Grand Duke stays and the Emperor stays in Petrograd. There " +
          "remains a commander who can be dismissed if 1916 goes badly, and a sovereign " +
          "in his capital while the arrangements there are made.",
      },
    ],
  },

  stavka_1916_05_brusilov: {
    year: 1916, date: "1916-05-22", city: "Berdichev",
    title: "An Offensive Without a Concentration",
    advisors: ["brusilov", "alekseyev"],
    bulletin: {
      voice: "stavka", date: "1916-05-20", source: "Communique of the Staff",
      text:
        "Preparations proceed upon the South-Western Front. Enemy positions have been " +
        "subjected to fire at a number of points.",
    },
    situation:
      "Brusilov proposes to attack without the usual massing that tells the enemy " +
      "where the blow is coming: broad-front preparation, several simultaneous " +
      "assaults, no single obvious point of main effort. It denies the defence its " +
      "reserves rather than trying to outweigh them.\n\n" +
      "The other fronts are meant to attack in support. Whether they will is a " +
      "question about the men commanding them, not about the plan.",
    context:
      "This is the one offensive design of the war that solves the problem everyone " +
      "has been failing at. Whether it can be exploited depends entirely on whether " +
      "the rest of the army moves when this front does.",
    choices: [
      {
        id: "support",
        label: "Order the other fronts to attack in support and enforce it",
        advisor: { name: "Brusilov", position:
          "The method will make a hole in the Austrian line. Holding it open is somebody else's front and somebody else's orders." },
        gate: (m) => m.will >= -3,
        disabledReason: "Stavka does not currently have the authority to compel front commanders who do not wish to attack",
        impact: { manpower: -3, munitions: -3, will: 2 },
        setFlags: { stavka_brusilov: "supported" },
        next: "stavka_1917_06_february",
        outcome:
          "Speculative. The supporting attacks are made and made seriously. The " +
          "Austrian front does not merely bend, and the German divisions sent to shore " +
          "it up come from somewhere they were needed.",
      },
      {
        id: "alone",
        label: "Let the South-Western Front attack alone",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The other fronts will attack when they are ready. I am not able to make them ready by ordering it." },
        impact: { manpower: -3, munitions: -2, will: 1 },
        setFlags: { stavka_brusilov: "alone" },
        dispute:
          "What the 1916 offensive cost Russia relative to what it bought is argued. " +
          "One reading holds it as the war's most successful Russian operation and a " +
          "material contribution to the coalition, drawing German divisions east and " +
          "helping to break the Austrian army as an independent force. Another holds " +
          "that unsupported exploitation consumed precisely the trained and willing " +
          "formations the army could least replace, and that the units which would " +
          "still attack in 1917 were the ones that had not been spent here. The two " +
          "readings are not exclusive and the balance between them is not settled.",
        uncertain: [
          { weight: 55, title: "The Austrian front breaks and the cost is borne by the best divisions", historicalBranch: true,
            impact: { manpower: -1, will: 1 },
            setFlags: { stavka_brusilovResult: "costly" },
            next: "stavka_1917_06_february",
            outcome:
              "The offensive succeeds beyond anything this army has managed and breaks " +
              "the Austrian front, forcing German divisions east to hold it. The " +
              "supporting attacks are not pressed. It is exploited as far as one front " +
              "can exploit anything alone, and the divisions that did it are the " +
              "divisions that will not be there next year." },
          { weight: 45, title: "The breakthrough is banked rather than pushed",
            impact: { munitions: -1, will: 1 },
            setFlags: { stavka_brusilovResult: "banked" },
            next: "stavka_1917_06_february",
            outcome:
              "Speculative. The front takes what the method wins and stops when the " +
              "exploitation stops paying. The Austrian line is broken, the German " +
              "divisions still come east, and the formations that did it are still " +
              "formations at the end of it." },
        ],
      },
    ],
  },

  stavka_1917_06_february: {
    year: 1917, date: "1917-03-02", city: "Pskov",
    title: "The Front Commanders Are Asked",
    advisors: ["alekseyev", "ruzsky", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1917-02-28", source: "Communique of the Staff",
      text:
        "Upon the northern and western fronts, scouting activity. The Staff has no " +
        "further communication to make.",
    },
    situation:
      "The capital is in the hands of crowds and of a garrison that will not fire on " +
      "them. The Emperor's train has been stopped at Pskov. From the capital comes a " +
      "question addressed to the army: do the front commanders advise abdication.\n\n" +
      "This is not a military question and there is no version of it in which the army " +
      "is neutral. Advising abdication makes the high command an agent in the fall of " +
      "the dynasty it swore to. Refusing makes it the last institution standing " +
      "between the crowds and the throne, which is a war behind the front while there " +
      "is a war in front of it.",
    context:
      "Whatever government follows will issue orders to this army. Within days, one " +
      "of them will make the authority of officers subject to soldiers' committees. " +
      "Nobody in this room knows that yet, and everybody in it can see the shape of it.",
    choices: [
      {
        id: "advise",
        label: "Advise abdication",
        historical: true,
        advisor: { name: "Ruzsky", position:
          "The alternative is turning the army round to face Petrograd. There is no third thing." },
        impact: { manpower: 0, munitions: 0, will: -3 },
        setFlags: { stavka_february: "advised" },
        next: "stavka_1917_07_kerensky",
        outcome:
          "The front commanders advise abdication and the abdication follows. The army " +
          "has participated in the removal of its sovereign and will spend what is left " +
          "of its existence being told so by people who wanted it done and by people " +
          "who did not.",
      },
      {
        id: "refuse",
        label: "Refuse — the army does not decide who reigns",
        advisor: { name: "Alekseyev", position:
          "If the army answers this question once, it will be asked every question after it." },
        gate: (m) => m.will >= -4,
        disabledReason: "The army no longer has the cohesion to be used against the capital",
        impact: { manpower: -2, munitions: 0, will: -2 },
        setFlags: { stavka_february: "refused" },
        erodes: "expose_regime",
        nextIf: (m) =>
          m.will <= -9 ? "stavka_end_disintegration"
          : m.munitions <= -8 ? "stavka_end_separate"
          : null,
        next: "stavka_1917_07_kerensky",
        outcome:
          "Speculative. The high command declines to advise and the question goes back " +
          "to the capital unanswered. What follows depends on whether any formation " +
          "will march on Petrograd, and on very little else.",
      },
    ],
  },

  stavka_1917_07_kerensky: {
    year: 1917, date: "1917-06-16", city: "Tarnopol",
    title: "An Order Is Now a Proposal",
    advisors: ["kerensky", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1917-06-14", source: "Communique of the Staff",
      text:
        "The armies of the South-Western Front stand in readiness. Meetings have been " +
        "held in a number of units at which the duty of the free Russian soldier was " +
        "explained.",
    },
    situation:
      "The government wants an offensive. It wants it to prove to the allies that " +
      "Russia is still in the war and to prove to Russia that the government can do " +
      "something.\n\n" +
      "The army it wants to use has been told by decree that the authority of its " +
      "officers is subject to committees of its soldiers. Units debate orders before " +
      "executing them, and some debate them instead. An offensive requires men to " +
      "leave a trench and walk toward machine guns because they were told to, and the " +
      "mechanism by which men are told to do that has been formally dismantled.",
    context:
      "The command's position is that this cannot be done. The government's position " +
      "is that the alternative is a government that has done nothing, in a capital " +
      "where doing nothing is being noticed by people with a plan.",
    choices: [
      {
        id: "attack",
        label: "Make the offensive the government has asked for",
        historical: true,
        advisor: { name: "Kerensky", position:
          "The revolution has to be shown to be capable of defending itself. An army that will not attack cannot demonstrate that." },
        impact: { manpower: -3, munitions: -2, will: -3 },
        setFlags: { stavka_kerensky: "attacked" },
        erodes: "expose_regime",
        dispute:
          "Whether the June offensive destroyed what remained of the army's cohesion " +
          "or merely revealed that it had already gone is argued. On one reading the " +
          "failure and the retreat that followed converted a disorganised army into a " +
          "disintegrating one and made October possible. On another, an army whose " +
          "orders were already subject to committee had ceased to be a usable " +
          "instrument in March, and the offensive demonstrated that rather than causing " +
          "it.",
        uncertain: [
          { weight: 70, title: "Initial success, then the units stop", historicalBranch: true,
            impact: { manpower: -2, will: -3 },
            setFlags: { stavka_kerenskyResult: "collapsed" },
            next: "stavka_1917_08_october",
            outcome:
              "The first days go well where the artillery is good and the units are " +
              "willing. Then the willing units are used up, the rest decline to " +
              "replace them, and the counterattack finds a front that is arguing with " +
              "itself. What comes back is not an army that failed at an offensive. It " +
              "is an army that has stopped." },
          { weight: 30, title: "The offensive achieves a limited gain and stops",
            impact: { manpower: -1, will: -1 },
            setFlags: { stavka_kerenskyResult: "limited" },
            next: "stavka_1917_08_october",
            outcome:
              "Speculative. The attack takes ground where the committees agreed to it " +
              "and stops where they did not. The government has something to show the " +
              "allies and the army has not been destroyed proving it." },
        ],
      },
      {
        id: "refuse",
        label: "Tell the government the army cannot attack",
        advisor: { name: "Brusilov", position:
          "I can report what these units will do. I cannot make them into units that will do something else by signing an order." },
        gate: (m) => m.will >= -5,
        disabledReason: "The command has no standing left to refuse the government anything",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { stavka_kerensky: "refused" },
        next: "stavka_1917_08_october",
        outcome:
          "Speculative. The command puts in writing that the army is not capable of " +
          "offensive operations. The divisions are not spent. The government is left " +
          "holding a war it cannot prosecute and cannot leave.",
      },
    ],
  },

  stavka_1917_08_october: {
    year: 1917, date: "1917-10-25", city: "Mogilev",
    title: "Orders From a Building That Changed Hands",
    advisors: ["dukhonin"],
    bulletin: {
      voice: "stavka", date: "1917-10-23", source: "Communique of the Staff",
      text:
        "The Staff continues to direct the armies of the front. Communication with " +
        "Petrograd is intermittent. Units are instructed to remain in their positions " +
        "and to await orders through the usual channels.",
    },
    situation: (flags) =>
      "The government in Petrograd has been removed by people who intend to leave the " +
      "war, and the front is still a front, and the men in it are going home in " +
      "numbers that no longer require a decision from anybody.\n\n" +
      (flags.stavka_kerenskyResult === "collapsed"
        ? "The June offensive used up the formations that would still obey and returned nothing."
        : "Such formations as will still obey are intact, which is a smaller number than it sounds.") +
      "\n\nWhat is left to decide is what this headquarters does with the fact that " +
      "it no longer has a government it recognises and still has an enemy in front of " +
      "it.",
    context:
      "Whatever is chosen, the officers in this building will shortly be choosing " +
      "sides in a different war, on ground that runs from the Don to Siberia. Some of " +
      "them are already choosing.",
    choices: [
      {
        id: "standdown",
        label: "Hold the line and take no part in the political question",
        historical: true,
        advisor: { name: "Dukhonin", position:
          "The units stay where they are, facing the enemy, and take no side. That is the most this headquarters can still order and be obeyed." },
        impact: { manpower: -2, munitions: -2, will: -2 },
        setFlags: { stavka_october: "standdown" },
        nextIf: (m, flags) =>
          m.will <= -9 ? "stavka_end_disintegration"
          : m.manpower <= -10 ? "stavka_end_dissolved"
          : flags.stavka_commandResult === "steadied" ? "stavka_end_steadied"
          : (flags.stavka_kerensky === "refused" && m.manpower >= -6) ? "stavka_end_holds"
          : (flags.stavka_prussia === "early" && flags.stavka_brusilov === "supported") ? "stavka_end_alliance"
          : null,
        next: "stavka_end_brest",
        outcome:
          "The headquarters holds what it can hold and takes no side, which turns out " +
          "not to be a position that exists. The front dissolves by desertion rather " +
          "than by defeat, and the officer corps disperses toward the places where the " +
          "next war is being organised.",
      },
      {
        id: "resist",
        label: "Refuse to recognise the new authority and hold the army together against it",
        advisor: { name: "Dukhonin", position:
          "An order to open negotiations can only come from a government sustained by the army and the country. This one is sustained by neither." },
        gate: (m) => m.manpower >= -5,
        disabledReason: "There are not enough reliable formations left to hold anything together",
        impact: { manpower: -3, munitions: -1, will: -1 },
        setFlags: { stavka_october: "resisted" },
        erodes: "expose_regime",
        next: "stavka_end_civilwar",
        outcome:
          "Speculative. The headquarters declines to recognise the new authority. " +
          "Formations divide according to what their soldiers' committees decide, which " +
          "is the same thing as saying the war at the front has become the war behind " +
          "it, several months earlier than it historically did.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  stavka_end_brest: {
    year: 1918, date: "1918-03-03", city: "Brest-Litovsk",
    title: "Signed at Brest-Litovsk",
    situation:
      "The treaty is signed on 3 March 1918, and the date is New Style because the " +
      "calendar changed in February along with everything else.\n\n" +
      "It gives up Poland, the Baltic provinces, Finland, Ukraine — territory holding " +
      "a large part of the Empire's population, coal and grain. It is signed because " +
      "there is no army left with which to decline it. The front that could not be " +
      "held in 1915 without shells could not be held in 1918 without men, and the men " +
      "walked home.",
    ending: { family: "collapse-into-revolution", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "East Prussia: " + (flags.stavka_prussia === "concentrated" ? "entered after the concentration was complete." : "entered early, on the undertaking to France.") + "\n" +
      "1915: " + (flags.stavka_1915 === "held" ? "the Polish salient was held." : "the salient was given up and the army kept.") + "\n" +
      "August 1915: " + (flags.stavka_command === "grandduke" ? "the Grand Duke retained the supreme command." : "the Emperor assumed the supreme command in person.") + "\n" +
      "1916: " + (flags.stavka_brusilov === "supported" ? "the other fronts attacked in support." : flags.stavka_brusilovResult === "banked" ? "the South-Western Front attacked alone and stopped when exploitation stopped paying." : "the South-Western Front attacked alone and spent its best divisions doing it.") + "\n" +
      "March 1917: " + (flags.stavka_february === "refused" ? "the front commanders declined to advise." : "the front commanders advised abdication.") + "\n" +
      "June 1917: " + (flags.stavka_kerensky === "refused" ? "the offensive was refused." : "the offensive was made.") + "\n" +
      "Autumn 1914: " + (flags.stavka_1914theatre === "prussia" ? "the northern effort was renewed." : "Galicia was reinforced.") + "\n" +
      "The Emperor at headquarters: " + (flags.stavka_commandResult === "steadied" ? "the capital held together in his absence." : flags.stavka_commandResult === "capitallost" ? "the capital did not hold together in his absence." : "the question did not arise.") + "\n" +
      "October 1917: " + (flags.stavka_october === "resisted" ? "the new authority was refused recognition." : "the headquarters took no side.") + "\n\n" +
      "The officers of this headquarters disperse toward the Don, toward Siberia, and " +
      "toward the new Republic's own army. What they do next is not this war.",
  },

  stavka_end_disintegration: {
    year: 1917, date: "1917-11-15", city: "Mogilev",
    title: "It Stops Being an Army",
    situation:
      "There is no moment at which this is decided. There are trains, and men on them, " +
      "and each individual departure is a private decision that nobody has the " +
      "authority to prevent.\n\n" +
      "The front is not broken. It is vacated.",
    ending: { family: "disintegration-without-defeat", badge: BADGES.CONTESTED },
    epilogue: () =>
      "An army is an agreement about who gives orders. Once that agreement lapses, " +
      "nothing in the field replaces it.",
  },

  stavka_end_dissolved: {
    year: 1918, date: "1918-01-20", city: "Mogilev",
    title: "Nothing Left to Sign With",
    situation:
      "The formations that remained were spent in a year that had nothing to spend " +
      "them on. What signs at Brest-Litovsk is a delegation representing a state with " +
      "no instrument at all, and the terms reflect it.",
    ending: { family: "harsher-terms-at-brest", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical terms were severe. They were signed by people who " +
      "still had something, if only the ability to walk out of the room.",
  },

  stavka_end_civilwar: {
    year: 1917, date: "1917-11-20", city: "Novocherkassk",
    title: "The Next War, Early",
    situation:
      "The headquarters refused recognition and the army divided along the line of " +
      "who its soldiers would obey. Formations went south and east with their officers " +
      "or dissolved around them.\n\n" +
      "The German army is still in front of what is left. It will not be the enemy " +
      "that most of these men die fighting.",
    ending: { family: "civil-war-begins-early", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical civil war began from the same material a few months " +
      "later. Beginning it here means beginning it with the Germans still in the field " +
      "and the front not yet settled by treaty.",
  },

  stavka_end_holds: {
    year: 1918, date: "1918-03-03", city: "Mogilev",
    title: "A Front That Was Still There",
    situation:
      "The army was not spent in June and was not asked to answer a political question " +
      "it could not survive answering. It is a smaller army and a worse one than 1914's " +
      "and it is in the field.\n\n" +
      "It does not change what is signed. It changes what the people signing it have " +
      "behind them while they do.",
    ending: { family: "army-holds-into-1918", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No Russian army of March 1918 was in a condition to affect the " +
      "terms. This ending supposes one marginally less far gone, and claims nothing " +
      "beyond the margin.",
  },

  stavka_end_separate: {
    year: 1917, date: "1917-01-15", city: "Petrograd",
    title: "Out, Early, and Alone",
    situation:
      "An approach is made before the capital goes, from an empire that still has a " +
      "front and a government and an army in some order. The terms available are bad. " +
      "They are better than March 1918's, and they cost the alliance permanently.\n\n" +
      "The territory conceded is territory. The alternative on the present trajectory " +
      "is the same territory conceded later by people with nothing to offer.",
    ending: { family: "separate-peace-earlier", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Separate-peace soundings existed and none came to anything. The " +
      "obstacle was never arithmetic. It was that the dynasty could not sign such a " +
      "thing and remain the dynasty.",
  },

  stavka_end_steadied: {
    year: 1918, date: "1918-03-03", city: "Mogilev",
    title: "The Capital Held Together",
    situation:
      "The arrangements in Petrograd did not come apart in the particular way they " +
      "historically did, and the front was not asked to compensate for a government " +
      "that had stopped functioning.\n\n" +
      "The war is still lost in the east and the Empire is still exhausted. What is " +
      "different is that the exhaustion arrives at a state rather than at a vacuum.",
    ending: { family: "political-order-survives-the-war", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative, and the most speculative ending here. It requires the court to " +
      "have behaved differently over eighteen months, which is a great deal to ask of " +
      "a counterfactual.",
  },

  stavka_end_alliance: {
    year: 1917, date: "1917-03-02", city: "Pskov",
    title: "Kept Every Promise",
    situation:
      "Every undertaking to the alliance was honoured on the date it was given. East " +
      "Prussia in the first fortnight, the Carpathians in the winter, the supporting " +
      "attacks in 1916, the offensive in the summer of 1917 — each one made when it " +
      "was asked for and with what was to hand.\n\n" +
      "France was not left to fight 1914 alone and Verdun was not left unrelieved. " +
      "The army that did all of it does not exist any more, and the two facts are the " +
      "same fact.",
    ending: { family: "coalition-obligations-honoured", badge: BADGES.CONTESTED },
    epilogue: () =>
      "Whether Russia was spent for the alliance or by its own arrangements is the " +
      "oldest argument about this front. It is not going to be settled here.",
  },

  stavka_end_relieved: {
    year: 1917, date: "1917-04-25", city: "Mogilev",
    title: "The Command Is Reorganised",
    situation:
      "No single order did this. There is a record covering three years in which this " +
      "headquarters attached the throne to each successive military outcome, and then " +
      "another authority arrived that had watched it happen.\n\n" +
      "A command that spent the regime's standing to buy operations is not a command " +
      "the successor regime keeps.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "The staff is dispersed to other duties. The war continues without them and does " +
      "not go better.",
  },
};

// =============================================================================
// MAPS — spec §13.4
// =============================================================================

export const MAPS = {
  europe: {
    id: "europe",
    label: "Europe and the Near Approaches",
    holds: ["Western Front", "Eastern Front", "Italian Front", "Balkans", "Dardanelles"],
  },
  nearEast: {
    id: "nearEast",
    label: "Anatolia, the Levant, Mesopotamia and the Caucasus",
    holds: ["Caucasus", "Palestine", "Mesopotamia", "Hejaz"],
  },
};

/**
 * Marker colour is a token, never a literal.
 * Carried-forward fix: 1922 shipped white markers invisible against a cream page.
 */
export const MAP_TOKENS = {
  markerDefault: "var(--map-marker)",
  markerActive: "var(--map-marker-active)",
  markerVisited: "var(--map-marker-visited)",
  markerContrastAgainst: "var(--page-bg)",
};

// =============================================================================
// DERIVED REGISTRIES
// =============================================================================
//
// Spec §5 requires every ending registered in four places, and notes that a
// missed registration is silent. Rather than maintain four hand-edited tables,
// all four are DERIVED from node data. A node cannot be in the game and absent
// from the atlas, because the atlas is built from the game.
//
// This removes the entire four-place-registration bug class rather than
// validating against it. NODE_TOTAL is never hand-edited because it cannot be.
// =============================================================================

export function allNodes() {
  const out = [];
  for (const cid of CAMPAIGN_IDS) {
    const c = CAMPAIGNS[cid];
    for (const nid of Object.keys(c.nodes)) {
      out.push({ campaignId: cid, nodeId: nid, node: c.nodes[nid] });
    }
  }
  return out;
}

export function buildNodeAtlas() {
  const atlas = {};
  for (const { campaignId, nodeId, node } of allNodes()) {
    atlas[nodeId] = {
      campaignId,
      year: node.year,
      date: node.date,
      city: node.city ?? null,
      title: node.title,
      isEnding: Boolean(node.ending),
    };
  }
  return atlas;
}

export function buildNodeToCity() {
  const map = {};
  for (const { nodeId, node } of allNodes()) {
    if (node.city) map[nodeId] = node.city;
  }
  return map;
}

export function buildEndings() {
  const out = [];
  for (const { campaignId, nodeId, node } of allNodes()) {
    if (!node.ending) continue;
    out.push({
      id: nodeId,
      campaignId,
      title: node.title,
      family: node.ending.family ?? null,
      badge: node.ending.badge,
      badgeLabel: BADGE_LABELS[node.ending.badge] ?? null,
      hardModeOnly: Boolean(node.ending.hardModeOnly),
    });
  }
  return out;
}

export function nodeTotal() {
  return allNodes().length;
}

export function nodeTotalsByCampaign() {
  const out = {};
  for (const cid of CAMPAIGN_IDS) {
    const nodes = Object.values(CAMPAIGNS[cid].nodes);
    out[cid] = {
      nodes: nodes.length,
      endings: nodes.filter((n) => n.ending).length,
      advisors: CAMPAIGNS[cid].advisors.length,
      bulletins: nodes.filter((n) => n.bulletin).length,
      spine: nodes.filter((n) =>
        (n.choices ?? []).some((ch) => ch.historical)
      ).length,
    };
  }
  return out;
}

// =============================================================================
// METERS
// =============================================================================

export function emptyMeters() {
  return { manpower: 0, munitions: 0, will: 0 };
}

export function clampMeter(v) {
  return Math.max(METER_MIN, Math.min(METER_MAX, v));
}

export function applyImpact(meters, impact) {
  const next = { ...meters };
  if (!impact) return next;
  for (const axis of METER_AXES) {
    if (typeof impact[axis] === "number") {
      next[axis] = clampMeter(next[axis] + impact[axis]);
    }
  }
  return next;
}

/** Label the will axis for the campaign in play. Spec §4.4. */
export function meterLabels(campaignId) {
  const c = CAMPAIGNS[campaignId];
  return {
    manpower: "Manpower",
    munitions: "Munitions",
    will: c ? c.willLabel : "Will",
  };
}

// =============================================================================
// COMMANDER SUCCESSION — spec §3.2, §13.3
// =============================================================================
//
// The player occupies the office, not the man. A seat change alters the document
// header, the voice register, and which advisors are present. It does not reset
// the run or multiply the roster.
// =============================================================================

function withinDate(date, from, to) {
  if (!date) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export function commanderAt(campaignId, date) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return null;
  return c.commanders.find((cmd) => withinDate(date, cmd.from, cmd.to)) ?? null;
}

export function advisorsPresentAt(campaignId, date) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return [];
  return c.advisors.filter((a) => withinDate(date, a.from, a.to));
}

export function isAdvisorPresent(campaignId, advisorId, date) {
  return advisorsPresentAt(campaignId, date).some((a) => a.id === advisorId);
}

// =============================================================================
// HARD MODE — spec §7
// =============================================================================
//
// One erosion track. Six trigger conditions. A choice erodes only if it is
// tagged with the campaign's own trigger, so the same track behaves differently
// in each campaign rather than being one mechanic under six names.
// =============================================================================

export const EROSION_MAX = 10; // fallback only; campaigns set their own

export function erosionMax(campaignId) {
  return CAMPAIGNS[campaignId]?.hardMode?.erosionMax ?? EROSION_MAX;
}

export function emptyHardState() {
  return { enabled: false, erosion: 0 };
}

export function erosionFromChoice(campaignId, choice) {
  const c = CAMPAIGNS[campaignId];
  if (!c || !choice || !choice.erodes) return 0;
  const triggers = Array.isArray(choice.erodes) ? choice.erodes : [choice.erodes];
  return triggers.includes(c.hardMode.trigger) ? (choice.erosionWeight ?? 1) : 0;
}

export function applyErosion(hardState, campaignId, choice) {
  if (!hardState.enabled) return hardState;
  const delta = erosionFromChoice(campaignId, choice);
  if (!delta) return hardState;
  const cap = erosionMax(campaignId);
  return { ...hardState, erosion: Math.min(cap, hardState.erosion + delta) };
}

export function hardModeForcesEnding(hardState, campaignId) {
  return hardState.enabled && hardState.erosion >= erosionMax(campaignId);
}

// =============================================================================
// NODE RESOLUTION
// =============================================================================
//
// RECONCILE: 1922's resolveNode(nodeId, flags, meters) returns the whole node
// with situation/context/bulletin/epilogue optionally built from flags. This
// reproduces that contract from the handover description. Verify against the
// real implementation before content work.
// =============================================================================

function resolveField(field, ctx) {
  return typeof field === "function" ? field(ctx.flags, ctx.meters, ctx) : field;
}

export function findNode(nodeId) {
  for (const cid of CAMPAIGN_IDS) {
    const n = CAMPAIGNS[cid].nodes[nodeId];
    if (n) return { campaignId: cid, node: n };
  }
  return null;
}

export function resolveNode(nodeId, flags = {}, meters = emptyMeters(), hardState = emptyHardState()) {
  const found = findNode(nodeId);
  if (!found) return null;
  const { campaignId, node } = found;
  const ctx = { flags, meters, hardState, campaignId, nodeId };

  const choices = (node.choices ?? []).map((ch) => {
    const blocked = typeof ch.gate === "function" ? !ch.gate(meters, flags) : false;
    return {
      ...ch,
      blocked,
      disabledReason: blocked ? ch.disabledReason ?? null : null,
      label: resolveField(ch.label, ctx),
    };
  });

  return {
    ...node,
    id: nodeId,
    campaignId,
    commander: commanderAt(campaignId, node.date),
    advisorsPresent: advisorsPresentAt(campaignId, node.date),
    meterLabels: meterLabels(campaignId),
    situation: resolveField(node.situation, ctx),
    context: resolveField(node.context, ctx),
    bulletin: resolveField(node.bulletin, ctx),
    epilogue: resolveField(node.epilogue, ctx),
    choices,
    allChoicesBlocked: choices.length > 0 && choices.every((c) => c.blocked),
  };
}

// =============================================================================
// CHOICE RESOLUTION
// =============================================================================

/** Weighted roll over choice.uncertain[]. Weights must sum to 100. */
export function rollUncertain(uncertain, rng = Math.random) {
  const total = uncertain.reduce((s, b) => s + b.weight, 0);
  let r = rng() * total;
  for (const branch of uncertain) {
    r -= branch.weight;
    if (r <= 0) return branch;
  }
  return uncertain[uncertain.length - 1];
}

/**
 * Apply a choice. Returns the next node id and updated state.
 *
 * Order matters and matches the handover's description of handleChoose:
 * impact is applied first, then nextIf is evaluated against POST-choice meters,
 * then next is the fallthrough.
 */
export function chooseNext(campaignId, choice, flags, meters, hardState, rng = Math.random) {
  let branch = null;
  if (choice.uncertain && choice.uncertain.length) {
    branch = rollUncertain(choice.uncertain, rng);
  }

  const impact = branch?.impact ?? choice.impact;
  const setFlags = { ...(choice.setFlags ?? {}), ...(branch?.setFlags ?? {}) };

  const nextMeters = applyImpact(meters, impact);
  const nextFlags = { ...flags, ...setFlags };
  const nextHard = applyErosion(hardState, campaignId, choice);

  let nextId = branch?.next ?? null;
  if (!nextId && typeof choice.nextIf === "function") {
    nextId = choice.nextIf(nextMeters, nextFlags) ?? null;
  }
  if (!nextId) nextId = choice.next ?? null;

  if (hardModeForcesEnding(nextHard, campaignId)) {
    const forced = CAMPAIGNS[campaignId]?.hardMode?.forcedEndingId;
    if (forced) nextId = forced;
  }

  return {
    nextId,
    flags: nextFlags,
    meters: nextMeters,
    hardState: nextHard,
    branch,
    outcome: branch?.outcome ?? choice.outcome ?? null,
    aftermath: branch?.aftermath ?? choice.aftermath ?? null,
  };
}

// =============================================================================
// SPINE
// =============================================================================

/** Exactly one historical: true choice per node. Enforced by walk-historical.js. */
export function historicalChoice(node) {
  return (node.choices ?? []).filter((c) => c.historical);
}

export function walkSpine(campaignId, startId) {
  const c = CAMPAIGNS[campaignId];
  const start = startId ?? c.startNode;
  if (!start) return { path: [], noStartNode: true };
  const path = [];
  const seen = new Set();
  let cur = start;
  while (cur) {
    if (seen.has(cur)) return { path, cycleAt: cur };
    seen.add(cur);
    const node = c.nodes[cur];
    if (!node) return { path, missing: cur };
    path.push(cur);
    if (node.ending) break;
    const hist = historicalChoice(node);
    if (hist.length !== 1) return { path, badHistoricalCount: cur, count: hist.length };
    const ch = hist[0];
    if (ch.uncertain && ch.uncertain.length) {
      const hb = ch.uncertain.filter((b) => b.historicalBranch);
      if (hb.length !== 1) return { path, badHistoricalBranch: cur, count: hb.length };
      cur = hb[0].next ?? ch.next ?? null;
    } else {
      cur = ch.next ?? null;
    }
  }
  return { path };
}

/**
 * What the player is told, after an order, about the historical record. Pure data in, text out.
 * - The order the command really gave is marked `historical: true` on the node (exactly one per node).
 * - A choice whose roll represents a real disagreement carries a `dispute` (spec §13.6): it is shown as written.
 * Returns null on an ending node. Used by the outcome screen and by smoke.js.
 */
export function historicalNote(node, choice) {
  if (!node || !choice || node.ending) return null;
  const hist = (node.choices ?? []).find((c) => c.historical);
  if (!hist) return null;
  const parts = [];
  if (choice.historical) {
    parts.push("The command gave this order.");
  } else {
    parts.push(`The command did not give this order. The historical command chose: ${hist.label.replace(/[.!?]+$/, "")}.`);
  }
  if (choice.dispute) {
    parts.push(`Where the record divides.\n${choice.dispute}`);
  }
  return { historical: Boolean(choice.historical), historicalLabel: hist.label, dispute: choice.dispute ?? null, text: parts.join("\n\n") };
}

// =============================================================================
// NODE ID CONVENTION — spec §13.7
// =============================================================================

export const NODE_ID_PATTERN = /^(ohl|gqg|stavka|bef|aok|otto)_(19(?:1[4-8]))_(\d{2})_([a-z0-9]+)$/;
export const ENDING_ID_PATTERN = /^(ohl|gqg|stavka|bef|aok|otto)_end_([a-z0-9]+)$/;

export function isValidNodeId(id) {
  return NODE_ID_PATTERN.test(id) || ENDING_ID_PATTERN.test(id);
}

// =============================================================================
// SAVES, RECORD AND SETTINGS — docs/SAVES.md
// =============================================================================
//
// Three things live in the browser's localStorage, each with its own key and its own
// schema version:
//   - the saved run (one slot): where the player was, so a closed tab can be resumed
//   - the war record: which nodes, advisers and endings have been seen, across runs
//   - settings: text size
// Everything is wrapped so that storage being unavailable (private windows, blocked
// site data, a test environment) degrades to "nothing persists this session" instead
// of an error. All of it is pure data in and out, so validators and node tests can
// exercise it without a browser.
//
// The rules for changing any of this are in docs/SAVES.md: renaming a node means an
// entry in NODE_ALIASES; changing what a save holds means bumping
// SAVE_SCHEMA_VERSION and adding SAVE_MIGRATIONS[oldVersion]. Never bump without the
// migration: with none, every player's saved run is discarded.
// =============================================================================

export const SAVE_KEY = "dispatches1914_save_v1";
export const RECORD_KEY = "dispatches1914_record_v1";
export const SETTINGS_KEY = "dispatches1914_settings_v1";

export const SAVE_SCHEMA_VERSION = 1;

// Old node id -> new node id. Add an entry whenever a node is renamed, so saves made before the rename still
// resume (see docs/SAVES.md). Empty today: no node has been renamed since saving began.
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
    s = { ...s, nodeId: aliasNode(s.nodeId), pendingNextId: aliasNode(s.pendingNextId) };
    if (Array.isArray(s.visited)) s.visited = s.visited.map(aliasNode);
  }
  return s;
}

// ---------- storage, guarded ----------

const memoryStore = new Map();

function localStore() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch (e) {
    /* blocked */
  }
  return null;
}

export function readJson(key) {
  try {
    const store = localStore();
    const raw = store ? store.getItem(key) : memoryStore.get(key) ?? null;
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function writeJson(key, value) {
  try {
    const raw = JSON.stringify(value);
    const store = localStore();
    if (store) store.setItem(key, raw);
    else memoryStore.set(key, raw);
    return true;
  } catch (e) {
    return false; // quota or blocked: persistence is a convenience, never a requirement
  }
}

export function removeKey(key) {
  try {
    const store = localStore();
    if (store) store.removeItem(key);
    else memoryStore.delete(key);
  } catch (e) {
    /* nothing to do */
  }
}

// ---------- the saved run ----------

/** What is stored for a run in progress. `pendingOutcome` (and `pendingRecord`, the historical note shown with it) are set while the player is on an outcome screen. */
export function snapshotRun({ campaignId, nodeId, flags, meters, hardState, visited, pendingNextId = null, pendingOutcome = null, pendingRecord = null }) {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    campaignId,
    nodeId,
    flags,
    meters,
    hardState,
    visited,
    pendingNextId,
    pendingOutcome,
    pendingRecord,
    savedAt: Date.now(),
  };
}

/** A save is only offered for resume if it parses, is a known version, and still resolves in the current content. */
export function validateSave(saved) {
  if (!saved || typeof saved !== "object") return false;
  if (saved.schemaVersion !== SAVE_SCHEMA_VERSION) return false;
  const campaign = CAMPAIGNS[saved.campaignId];
  if (!campaign || !saved.nodeId) return false;
  if (!saved.meters || typeof saved.meters !== "object" || !saved.flags || typeof saved.flags !== "object") return false;
  if (!saved.hardState || typeof saved.hardState !== "object") return false;
  if (!Array.isArray(saved.visited)) return false;
  try {
    const node = resolveNode(saved.nodeId, saved.flags, saved.meters, saved.hardState);
    if (!node || node.campaignId !== saved.campaignId) return false;
    if (saved.pendingNextId && !resolveNode(saved.pendingNextId, saved.flags, saved.meters, saved.hardState)) return false;
  } catch (e) {
    return false;
  }
  return true;
}

export function loadSavedRun() {
  const raw = readJson(SAVE_KEY);
  if (!raw) return null;
  const migrated = migrateSave(raw);
  if (migrated && validateSave(migrated)) return migrated;
  removeKey(SAVE_KEY); // stale or from a build that cannot be resumed: clear it rather than offer a broken Resume
  return null;
}

export function saveRun(snapshot) {
  return writeJson(SAVE_KEY, snapshot);
}

export function clearSavedRun() {
  removeKey(SAVE_KEY);
}

// ---------- the war record ----------

export const RECORD_SCHEMA_VERSION = 1;

export function emptyRecord() {
  return { schemaVersion: RECORD_SCHEMA_VERSION, nodes: {}, advisers: {}, endings: [], runs: 0, hardRuns: 0 };
}

export function loadRecord() {
  const raw = readJson(RECORD_KEY);
  if (!raw || raw.schemaVersion !== RECORD_SCHEMA_VERSION) return emptyRecord();
  return { ...emptyRecord(), ...raw };
}

export function saveRecord(record) {
  return writeJson(RECORD_KEY, record);
}

const withAdded = (list, items) => {
  const have = new Set(list || []);
  const add = items.filter((x) => !have.has(x));
  return add.length ? [...(list || []), ...add] : list || [];
};

/** The player has seen this node (and met these advisers there). Returns a new record, or the same one if nothing is new. */
export function noteNodeSeen(record, campaignId, nodeId, adviserIds = []) {
  const nodes = withAdded(record.nodes[campaignId], [nodeId]);
  const advisers = withAdded(record.advisers[campaignId], adviserIds);
  if (nodes === record.nodes[campaignId] && advisers === record.advisers[campaignId]) return record;
  return { ...record, nodes: { ...record.nodes, [campaignId]: nodes }, advisers: { ...record.advisers, [campaignId]: advisers } };
}

/** A run has reached this ending. */
export function noteEnding(record, endingId, hardMode) {
  return {
    ...record,
    endings: withAdded(record.endings, [endingId]),
    runs: (record.runs || 0) + 1,
    hardRuns: (record.hardRuns || 0) + (hardMode ? 1 : 0),
  };
}

// ---------- settings ----------

export const TEXT_SIZES = ["s", "m", "l"];

export function defaultSettings() {
  return { schemaVersion: 1, textSize: "s" };
}

export function sanitizeSettings(raw) {
  const base = defaultSettings();
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== 1) return base;
  return { ...base, textSize: TEXT_SIZES.includes(raw.textSize) ? raw.textSize : base.textSize };
}

export function loadSettings() {
  return sanitizeSettings(readJson(SETTINGS_KEY));
}

export function saveSettings(settings) {
  return writeJson(SETTINGS_KEY, settings);
}


// =============================================================================
// UI_LAYER
// =============================================================================
//
// Everything below is render code. Validators split the file here and never
// evaluate it.
//
// PALETTE IS TOKENISED. Art direction is undecided (spec §13.8); this renders in
// the established series idiom so the game is playable now. Changing direction is
// a change to THEME below, not a rewrite of the components.
// =============================================================================

import React, { useState, useMemo, useEffect, useRef } from "react";

const THEME = {
  paper: "#f4efe2",
  paperRaised: "#e9e2cf",
  ink: "#1c1a17",
  inkSoft: "#5d574c",
  rule: "#1c1a17",
  accent: "#7a2e2e",
  inverse: "#0d0c0b",
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"SFMono-Regular", Menlo, Consolas, "Courier New", monospace',
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** IV.1940 — the series' date treatment. */
function romanDate(iso) {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  return `${ROMAN[Number(m)]}.${y}`;
}

const css = `
  .dg-root{background:${THEME.paper};color:${THEME.ink};font-family:${THEME.mono};
    min-height:100%;padding:20px 18px 48px;box-sizing:border-box;line-height:1.6}
  .dg-root button:focus-visible,.dg-root summary:focus-visible{outline:3px solid ${THEME.accent};outline-offset:2px}
  .dg-filerow{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.22em;
    color:${THEME.inkSoft};text-transform:uppercase}
  .dg-filerow .r{color:${THEME.accent}}
  .dg-title{font-family:${THEME.serif};font-weight:700;font-size:44px;line-height:1.02;
    margin:14px 0 18px;letter-spacing:-.01em}
  .dg-rule{border:0;border-top:1.5px solid ${THEME.rule};margin:0 0 22px}
  .dg-sect{font-size:11px;letter-spacing:.22em;color:${THEME.accent};text-transform:uppercase;
    margin:26px 0 12px;font-weight:400}
  .dg-card{position:relative;border:1.5px solid ${THEME.rule};background:${THEME.paperRaised};
    padding:20px 18px;margin-bottom:14px;cursor:pointer;width:100%;text-align:left;
    font:inherit;color:inherit;display:block;box-sizing:border-box}
  .dg-card:hover{background:${THEME.ink};color:${THEME.paper}}
  .dg-card h3{font-family:${THEME.serif};font-size:23px;font-weight:700;margin:0 0 6px;line-height:1.2}
  .dg-card p{margin:0;font-size:13px;color:${THEME.inkSoft}}
  .dg-card:hover p{color:${THEME.paperRaised}}
  .dg-stamp{position:absolute;top:-12px;right:14px;transform:rotate(-3deg);
    border:2px solid ${THEME.accent};color:${THEME.accent};background:${THEME.paper};
    font-size:11px;letter-spacing:.18em;padding:4px 9px}
  .dg-dash{border:0;border-top:4px dashed ${THEME.accent};margin:28px 0 20px}
  .dg-btn{border:1.5px solid ${THEME.rule};background:none;font:inherit;color:inherit;
    padding:8px 12px;font-size:11px;letter-spacing:.14em;cursor:pointer;text-transform:uppercase}
  .dg-btn:hover{background:${THEME.ink};color:${THEME.paper}}
  .dg-docrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    font-size:13px;letter-spacing:.16em;font-weight:700;margin:18px 0 16px}
  .dg-timeline{display:flex;justify-content:space-between;border-top:1.5px solid ${THEME.rule};
    padding-top:6px;font-size:11px;letter-spacing:.1em;margin-bottom:18px}
  .dg-timeline span.on{color:${THEME.accent};font-weight:700}
  .dg-node-date{font-size:13px;letter-spacing:.2em;margin-bottom:6px}
  .dg-node-title{font-family:${THEME.serif};font-size:34px;font-weight:700;line-height:1.08;margin:0 0 18px}
  .dg-prose{white-space:pre-wrap;font-size:15px;margin-bottom:18px}
  .dg-order{font-size:12px;letter-spacing:.22em;font-weight:700;margin:24px 0 12px}
  .dg-choice{width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer;
    border:1.5px solid ${THEME.accent};background:none;padding:16px;margin-bottom:12px;display:block}
  .dg-choice:hover:not(:disabled){background:${THEME.inverse};color:${THEME.paper}}
  .dg-choice:disabled{cursor:not-allowed;opacity:.45}
  .dg-choice .lab{font-size:15px;margin-bottom:8px}
  .dg-quote{font-style:italic;font-size:13px;color:${THEME.inkSoft}}
  .dg-choice:hover:not(:disabled) .dg-quote{color:${THEME.paperRaised}}
  .dg-cost{display:inline-block;border:1px solid currentColor;font-size:10px;
    letter-spacing:.14em;padding:3px 7px;margin-bottom:8px}
  .dg-meters{display:flex;gap:14px;border:1.5px solid ${THEME.rule};padding:12px;
    margin-bottom:18px;font-size:11px;letter-spacing:.1em}
  .dg-meters div{flex:1}
  .dg-meters b{display:block;font-size:18px;font-family:${THEME.serif}}
  .dg-hard{border:1.5px solid ${THEME.accent};color:${THEME.accent};padding:12px;
    font-size:12px;letter-spacing:.14em;margin-bottom:18px}
  .dg-draft{border:1.5px dashed ${THEME.accent};color:${THEME.accent};padding:10px;
    font-size:11px;letter-spacing:.12em;margin-bottom:18px}
  .dg-badge{display:inline-block;border:1.5px solid ${THEME.accent};color:${THEME.accent};
    font-size:10px;letter-spacing:.18em;padding:4px 8px;margin-bottom:14px}
  .dg-bulletin{border-top:1px solid ${THEME.rule};border-bottom:1px solid ${THEME.rule};
    padding:12px 0;margin-bottom:18px;font-size:13px}
  .dg-bulletin .h{font-size:10px;letter-spacing:.2em;color:${THEME.accent};margin-bottom:6px}
  details summary{cursor:pointer;border:1.5px solid ${THEME.rule};padding:10px 12px;
    font-size:12px;letter-spacing:.16em;margin-bottom:16px}
  .dg-banner{border:1.5px solid ${THEME.accent};padding:14px;margin:0 0 18px}
  .dg-banner p{margin:0 0 10px;font-size:13px}
  .dg-banner .small{font-size:12px;color:${THEME.inkSoft}}
  .dg-seg{display:flex;margin:0 0 10px}
  .dg-seg button{flex:1;border:1.5px solid ${THEME.rule};background:none;font:inherit;color:inherit;
    padding:10px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
  .dg-seg button+button{border-left:0}
  .dg-seg button[aria-pressed="true"]{background:${THEME.ink};color:${THEME.paper}}
  .dg-note{font-size:12px;color:${THEME.inkSoft};margin:0 0 14px}
  .dg-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}
  .dg-tabs button[aria-pressed="true"]{background:${THEME.ink};color:${THEME.paper}}
  .dg-entry{border-top:1px solid ${THEME.rule};padding:10px 0;font-size:13px}
  .dg-entry .t{font-family:${THEME.serif};font-size:17px;font-weight:700}
  .dg-entry.locked{color:${THEME.inkSoft}}
  .dg-entry .meta{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${THEME.inkSoft}}
  .dg-count{font-size:11px;letter-spacing:.14em;color:${THEME.inkSoft};margin:0 0 6px}
  .dg-fs-m .dg-prose,.dg-fs-m .dg-choice .lab{font-size:17px}
  .dg-fs-m .dg-bulletin,.dg-fs-m .dg-quote,.dg-fs-m .dg-entry,.dg-fs-m .dg-banner p{font-size:15px}
  .dg-fs-l .dg-prose,.dg-fs-l .dg-choice .lab{font-size:19px}
  .dg-fs-l .dg-bulletin,.dg-fs-l .dg-quote,.dg-fs-l .dg-entry,.dg-fs-l .dg-banner p{font-size:17px}
`;

function Stamp({ children }) {
  return <span className="dg-stamp">{children}</span>;
}

const TEXT_SIZE_LABELS = { s: "Standard", m: "Larger", l: "Largest" };

function MenuScreen({ onPick, onRecord, savedRun, onResume, onDiscard, hardOn, onHard, settings, onSettings, record }) {
  const majors = CAMPAIGN_IDS.filter((c) => CAMPAIGNS[c].tier === TIERS.MAJOR);
  const minors = CAMPAIGN_IDS.filter((c) => CAMPAIGNS[c].tier === TIERS.MINOR);
  const saved = useMemo(() => {
    if (!savedRun) return null;
    try {
      return resolveNode(savedRun.nodeId, savedRun.flags, savedRun.meters, savedRun.hardState);
    } catch (e) {
      return null;
    }
  }, [savedRun]);
  const card = (cid) => {
    const c = CAMPAIGNS[cid];
    const playable = Object.keys(c.nodes).length > 0;
    return (
      <button key={cid} className="dg-card" disabled={!playable}
        style={playable ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
        onClick={() => playable && onPick(cid)}>
        <Stamp>{c.seal}</Stamp>
        <h3>{c.name}</h3>
        <p>{c.seat} · {CALENDARS[c.calendar].label}</p>
        <p style={{ marginTop: 6 }}>
          {playable ? `${Object.keys(c.nodes).length} nodes` : "No content yet"}
        </p>
        {playable && hardOn && c.hardMode.description && (
          <p style={{ marginTop: 6 }}>Hard mode: {c.hardMode.description}</p>
        )}
      </button>
    );
  };
  return (
    <main className="dg-root">
      <div className="dg-filerow"><span>File No. 1914</span><span className="r">Restricted</span></div>
      <h1 className="dg-title">DISPATCHES<br />1914</h1>
      <hr className="dg-rule" />

      {saved && (
        <section className="dg-banner" aria-label="Saved file">
          <p>
            <b>File in progress.</b> {CAMPAIGNS[savedRun.campaignId].shortName} · {romanDate(saved.date)} · {saved.title}
            {savedRun.hardState.enabled ? " · hard mode" : ""}
          </p>
          <p className="small">Starting a new file replaces this one.</p>
          <button className="dg-btn" onClick={onResume}>Resume file</button>{" "}
          <button className="dg-btn" onClick={onDiscard}>Discard</button>
        </section>
      )}

      <div className="dg-seg" role="group" aria-label="Difficulty">
        <button aria-pressed={!hardOn} onClick={() => onHard(false)}>Standard</button>
        <button aria-pressed={hardOn} onClick={() => onHard(true)}>Hard mode</button>
      </div>
      <p className="dg-note">
        {hardOn
          ? "Hard mode adds an erosion track. Each command's office faced its own kind of pressure; at the limit its freedom to choose ends and a fixed ending follows."
          : "Standard: every command plays on the same logistical triangle, with no erosion track."}
      </p>

      <h2 className="dg-sect">Major Commands</h2>
      {majors.map(card)}
      <h2 className="dg-sect">Minor Commands</h2>
      {minors.map(card)}
      <hr className="dg-dash" />
      <button className="dg-card" onClick={onRecord}>
        ▶ WAR RECORD — DOSSIERS, ATLAS, ENDINGS GALLERY
        <p style={{ marginTop: 8 }}>
          {Object.values(record.nodes).reduce((n, l) => n + l.length, 0)} of {nodeTotal()} nodes seen · {record.endings.length} of {buildEndings().length} endings found
        </p>
      </button>
      <details>
        <summary>▶ SETTINGS</summary>
        <div className="dg-count">Text size</div>
        <div className="dg-seg" role="group" aria-label="Text size">
          {TEXT_SIZES.map((s) => (
            <button key={s} aria-pressed={settings.textSize === s} onClick={() => onSettings({ ...settings, textSize: s })}>
              {TEXT_SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      </details>
    </main>
  );
}

function Meters({ meters, labels }) {
  return (
    <div className="dg-meters">
      {METER_AXES.map((a) => (
        <div key={a}>
          <b>{meters[a] > 0 ? `+${meters[a]}` : meters[a]}</b>
          {labels[a].toUpperCase()}
        </div>
      ))}
    </div>
  );
}

function NodeScreen({ campaignId, node, meters, hardState, onChoose, onHome }) {
  const c = CAMPAIGNS[campaignId];
  const years = [1914, 1915, 1916, 1917, 1918];
  return (
    <main className="dg-root">
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow">
        <span>{c.docLabel}</span>
        <button className="dg-btn" onClick={onHome}>Home</button>
      </div>
      <div className="dg-timeline">
        {years.map((y) => (
          <span key={y} className={y === node.year ? "on" : ""}>{y}</span>
        ))}
      </div>

      {node.draft && (
        <div className="dg-draft">
          DRAFT CONTENT — PROSE NOT VERIFIED. NOT FOR SHIP.
        </div>
      )}

      {hardState.enabled && (
        <div className="dg-hard">
          HARD MODE — EROSION {hardState.erosion}/{erosionMax(campaignId)}
        </div>
      )}

      <Meters meters={meters} labels={node.meterLabels} />

      {node.bulletin && typeof node.bulletin === "object" && (
        <div className="dg-bulletin">
          <div className="h">{node.bulletin.source} · {node.bulletin.date}</div>
          {node.bulletin.text}
        </div>
      )}

      <div className="dg-node-date">{romanDate(node.date)}</div>
      <h1 className="dg-node-title">{node.title}</h1>
      <div className="dg-prose">{node.situation}</div>

      {node.context && (
        <details>
          <summary>▶ SHOW BACKGROUND</summary>
          <div className="dg-prose">{node.context}</div>
        </details>
      )}

      {node.ending ? (
        <>
          <div className="dg-badge">{BADGE_LABELS[node.ending.badge]}</div>
          {node.epilogue && <div className="dg-prose">{node.epilogue}</div>}
          <button className="dg-btn" onClick={onHome}>Return to file</button>
        </>
      ) : (
        <>
          <h2 className="dg-order">Issue Order</h2>
          {node.choices.map((ch) => (
            <button key={ch.id} className="dg-choice" disabled={ch.blocked}
              onClick={() => onChoose(ch)}>
              <div className="lab">{ch.label}</div>
              {ch.blocked && <div className="dg-cost">✕ {ch.disabledReason}</div>}
              {ch.erodes && hardState.enabled && <div className="dg-cost">✕ Costs standing</div>}
              {ch.advisor && (
                <div className="dg-quote">
                  {ch.advisor.name} argues: {ch.advisor.position}
                </div>
              )}
            </button>
          ))}
        </>
      )}
    </main>
  );
}

function OutcomeScreen({ campaignId, outcome, record, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  return (
    <main className="dg-root">
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <h1 className="dg-docrow" style={{ margin: "18px 0 16px" }}><span>{c.docLabel} · OUTCOME</span></h1>
      <hr className="dg-rule" />
      <div className="dg-prose">{outcome}</div>
      {record && (
        <details>
          <summary>▶ THE HISTORICAL RECORD</summary>
          <div className="dg-prose">{record.text}</div>
        </details>
      )}
      <button className="dg-btn" onClick={onContinue}>Continue</button>
    </main>
  );
}

function yearsInPost(a) {
  const y = (d) => (d ? d.slice(0, 4) : "");
  return y(a.from) === y(a.to) ? y(a.from) : `${y(a.from)}–${y(a.to)}`;
}

function RecordScreen({ record, onBack }) {
  const [tab, setTab] = useState("dossiers");
  const playable = CAMPAIGN_IDS.filter((cid) => Object.keys(CAMPAIGNS[cid].nodes).length > 0);
  const atlas = buildNodeAtlas();
  const endings = buildEndings();
  return (
    <main className="dg-root">
      <div className="dg-docrow">
        <h1 style={{ margin: 0, font: "inherit" }}>WAR RECORD</h1>
        <button className="dg-btn" onClick={onBack}>Return to file</button>
      </div>
      <hr className="dg-rule" />
      <p className="dg-note">
        {record.runs} {record.runs === 1 ? "file" : "files"} closed · {record.hardRuns} in hard mode. Entries open as you play; the record stays in this browser.
      </p>
      <div className="dg-tabs" role="group" aria-label="Record sections">
        {[["dossiers", "Dossiers"], ["atlas", "Atlas"], ["endings", "Endings"]].map(([id, label]) => (
          <button key={id} className="dg-btn" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {playable.map((cid) => {
        const c = CAMPAIGNS[cid];
        if (tab === "dossiers") {
          const met = record.advisers[cid] || [];
          return (
            <section key={cid}>
              <h2 className="dg-sect">{c.shortName}</h2>
              <p className="dg-count">{c.advisors.filter((a) => met.includes(a.id)).length} of {c.advisors.length} dossiers open</p>
              {c.advisors.map((a) =>
                met.includes(a.id) ? (
                  <details key={a.id} className="dg-entry">
                    <summary><span className="t">{a.name}</span> <span className="meta">{a.dossier.role} · {yearsInPost(a)}</span></summary>
                    <div className="dg-prose">{a.dossier.bio}{"\n\n"}Fate: {a.dossier.fate}</div>
                  </details>
                ) : (
                  <div key={a.id} className="dg-entry locked">File closed. Meet this adviser in play to open it.</div>
                )
              )}
            </section>
          );
        }
        if (tab === "atlas") {
          const ids = Object.keys(c.nodes).filter((id) => !c.nodes[id].ending);
          const seen = record.nodes[cid] || [];
          return (
            <section key={cid}>
              <h2 className="dg-sect">{c.shortName}</h2>
              <p className="dg-count">{ids.filter((id) => seen.includes(id)).length} of {ids.length} decisions reached</p>
              {ids.map((id) => {
                const n = atlas[id];
                return seen.includes(id) ? (
                  <div key={id} className="dg-entry">
                    <div className="meta">{romanDate(n.date)}{n.city ? ` · ${n.city}` : ""}</div>
                    <div className="t">{n.title}</div>
                  </div>
                ) : (
                  <div key={id} className="dg-entry locked"><span className="meta">{n.year}</span> Not yet reached.</div>
                );
              })}
            </section>
          );
        }
        const list = endings.filter((e) => e.campaignId === cid);
        const found = list.filter((e) => record.endings.includes(e.id));
        return (
          <section key={cid}>
            <h2 className="dg-sect">{c.shortName}</h2>
            <p className="dg-count">{found.length} of {list.length} endings found</p>
            {list.map((e) =>
              record.endings.includes(e.id) ? (
                <div key={e.id} className="dg-entry">
                  <div className="meta">{e.badgeLabel}{e.hardModeOnly ? " · hard mode" : ""}</div>
                  <div className="t">{e.title}</div>
                </div>
              ) : (
                <div key={e.id} className="dg-entry locked">Not yet reached{e.hardModeOnly ? " (hard mode)" : ""}.</div>
              )
            )}
          </section>
        );
      })}
    </main>
  );
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [record, setRecord] = useState(loadRecord);
  const [savedRun, setSavedRun] = useState(loadSavedRun);
  const [hardOn, setHardOn] = useState(false);
  const [screen, setScreen] = useState("menu");
  const [campaignId, setCampaignId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [flags, setFlags] = useState({});
  const [meters, setMeters] = useState(emptyMeters());
  const [hardState, setHardState] = useState(emptyHardState());
  const [pending, setPending] = useState(null);
  const [visited, setVisited] = useState([]);
  const [runKey, setRunKey] = useState(0);
  const endedRun = useRef(-1);

  const node = useMemo(
    () => (nodeId ? resolveNode(nodeId, flags, meters, hardState) : null),
    [nodeId, flags, meters, hardState]
  );

  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveRecord(record); }, [record]);

  // A node on screen counts as seen, and so do the advisers present at it.
  useEffect(() => {
    if (screen !== "node" || !campaignId || !nodeId || !node) return;
    setVisited((v) => (v.includes(nodeId) ? v : [...v, nodeId]));
    setRecord((r) => noteNodeSeen(r, campaignId, nodeId, node.advisors || []));
    if (node.ending && endedRun.current !== runKey) {
      endedRun.current = runKey;
      setRecord((r) => noteEnding(r, nodeId, hardState.enabled));
    }
  }, [screen, campaignId, nodeId, runKey]);

  // The run in progress is saved after every step; a finished run clears its save.
  useEffect(() => {
    if (!campaignId || !nodeId || (screen !== "node" && screen !== "outcome")) return;
    if (screen === "node" && node && node.ending) {
      clearSavedRun();
      setSavedRun(null);
      return;
    }
    saveRun(snapshotRun({
      campaignId, nodeId, flags, meters, hardState, visited,
      pendingNextId: screen === "outcome" && pending ? pending.nextId ?? null : null,
      pendingOutcome: screen === "outcome" && pending ? pending.outcome ?? null : null,
      pendingRecord: screen === "outcome" && pending ? pending.record ?? null : null,
    }));
  }, [screen, campaignId, nodeId, flags, meters, hardState, pending, visited]);

  const start = (cid) => {
    setCampaignId(cid);
    setFlags({});
    setMeters(emptyMeters());
    setHardState({ ...emptyHardState(), enabled: hardOn });
    setVisited([]);
    setPending(null);
    setRunKey((k) => k + 1);
    setNodeId(CAMPAIGNS[cid].startNode);
    setScreen("node");
  };

  const resume = () => {
    const s = savedRun;
    if (!s) return;
    setCampaignId(s.campaignId);
    setFlags(s.flags);
    setMeters(s.meters);
    setHardState(s.hardState);
    setVisited(s.visited);
    setPending(s.pendingOutcome ? { nextId: s.pendingNextId, outcome: s.pendingOutcome, record: s.pendingRecord ?? null } : null);
    setRunKey((k) => k + 1);
    setNodeId(s.nodeId);
    setScreen(s.pendingOutcome ? "outcome" : "node");
  };

  const discard = () => { clearSavedRun(); setSavedRun(null); };

  const home = () => {
    setScreen("menu");
    setNodeId(null);
    setCampaignId(null);
    setSavedRun(loadSavedRun());
  };

  const choose = (ch) => {
    const r = chooseNext(campaignId, ch, flags, meters, hardState);
    setFlags(r.flags); setMeters(r.meters); setHardState(r.hardState);
    setPending({ ...r, record: historicalNote(node, ch) });
    setScreen(r.outcome ? "outcome" : "node");
    if (!r.outcome) setNodeId(r.nextId);
  };

  const cont = () => {
    setNodeId(pending?.nextId ?? null);
    setPending(null);
    setScreen("node");
  };

  return (
    <div className={`dg-fs-${settings.textSize}`} style={{ display: "contents" }}>
      <style>{css}</style>
      {screen === "menu" && (
        <MenuScreen onPick={start} onRecord={() => setScreen("record")} savedRun={savedRun}
          onResume={resume} onDiscard={discard} hardOn={hardOn} onHard={setHardOn}
          settings={settings} onSettings={setSettings} record={record} />
      )}
      {screen === "record" && <RecordScreen record={record} onBack={home} />}
      {screen === "outcome" && (
        <OutcomeScreen campaignId={campaignId} outcome={pending.outcome} record={pending.record} onContinue={cont} />
      )}
      {screen === "node" && node && (
        <NodeScreen campaignId={campaignId} node={node} meters={meters}
          hardState={hardState} onChoose={choose} onHome={home} />
      )}
      {screen === "node" && !node && (
        <main className="dg-root">
          <div className="dg-draft">
            Node "{String(nodeId)}" does not resolve. This is a routing bug, not a dead end by design.
          </div>
          <button className="dg-btn" onClick={home}>Home</button>
        </main>
      )}
    </div>
  );
}
