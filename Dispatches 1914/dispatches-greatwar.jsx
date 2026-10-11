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
// Twenty-three decision nodes, 1914 to the armistice, and nine endings. Facts and
// the attested wording of each choice are logged in claims/ as they are written.
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
  { id: "kuhl", name: "Kuhl", from: "1916-08-29", to: "1918-11-11",
    dossier: { role: "Chief of Staff, Army Group Crown Prince Rupprecht",
      bio: "Chief of staff to the army group on the British front from the autumn of 1916. Argued for giving up the Somme bulge and going back to the new position behind it, and planned the withdrawal that followed.",
      fate: "Wrote extensively on the war and its operations after it. Died in 1958." } },
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
// Set from measured distribution (measure-erosion.js, montecarlo.js hard): 13 of 48
// choices are erosion-tagged and the historical line carries five of them, so at 7
// the historical run survives and a player who keeps spending standing is relieved.
CAMPAIGNS.ohl.hardMode.erosionMax = 7;

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
        next: "ohl_1914_12_twocorps",
        outcome:
          "The right goes forward at the weight the plan requires. Lorraine gives " +
          "ground it was always expected to give, and the newspapers there will have to " +
          "be managed. The left wing's commanders, who wanted to meet the French and " +
          "win something, are told to hold and wait, and they do not forget it. " +
          "Everything now depends on the right wing reaching Paris before its men and " +
          "horses reach the end of what they can do.",
      },
      {
        id: "lorraine",
        label: "Reinforce Lorraine — take the victory the left is offering",
        advisor: { name: "Tappen", position:
          "A beaten French army in Lorraine is a real result. The right can be strong enough without being everything." },
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { ohl_lorraine: "reinforced" },
        erodes: "spend_will",
        next: "ohl_1914_12_twocorps",
        outcome:
          "Corps go south. There is fighting in Lorraine that the plan did not ask for, " +
          "and a French attack is met and beaten there, which is reported at home as a " +
          "victory. The right wing goes forward lighter than the plan assumed, by " +
          "exactly the corps that went south. Nobody in this building can say yet what " +
          "that will cost, and nobody will be able to say until September.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  ohl_1914_12_twocorps: {
    year: 1914, date: "1914-08-25", city: "Koblenz",
    title: "Two Corps for the East",
    advisors: ["moltke", "tappen"],
    situation: (flags) =>
      "The news from East Prussia comes in pieces and none of it is good. Eighth Army has " +
      "had a new commander and a new chief of staff for two days. Russian armies are " +
      "across the frontier in two places, and the province is emptying of people ahead " +
      "of them.\n\n" +
      "In the west the reports are of victory on every sheet. Namur has fallen. The " +
      "French are falling back along the whole front, and the right wing is still " +
      "advancing, at the end of what its men and horses can do.\n\n" +
      (flags.ohl_lorraine === "reinforced"
        ? "The corps sent to Lorraine are not on the right to be counted, so anything " +
          "taken from it now is taken from a wing that was already lighter than the plan assumed."
        : "The right went forward at the weight the plan asked for, so any corps taken " +
          "from it now is a corps the plan counted on."),
    context:
      "The Supreme Command holds no reserve of its own. Anything sent east has to be " +
      "taken from an army in the line and put on a train, and a corps on a train is " +
      "fighting nowhere for as long as the journey lasts.",
    choices: [
      {
        id: "send",
        label: "Send the Guard Reserve Corps and XI Corps east by rail",
        historical: true,
        advisor: { name: "Moltke", position:
          "The war in the west is as good as won, and a province of the Empire is being overrun. Two corps from the winning wing is not too much to ask." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { ohl_twocorps: "sent" },
        next: "ohl_1914_02_marne",
        outcome:
          "The Guard Reserve Corps comes out of Second Army and XI Corps out of Third, and " +
          "both are on the railways the same day. The battle in East Prussia is fought and " +
          "won without them; they detrain after it is over. The right wing goes on in the " +
          "west two corps lighter than it was on the morning the order was written.",
      },
      {
        id: "keep",
        label: "Keep both corps on the right wing and leave the east to the army already there",
        advisor: { name: "Tappen", position:
          "A corps taken off the right is a corps the plan counted on. The east can be held on the ground it has. The west can only be won at weight." },
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_twocorps: "kept" },
        next: "ohl_1914_02_marne",
        outcome:
          "Speculative. Both corps stay where the plan put them. The new command in " +
          "East Prussia fights with the army it has, and the right wing goes forward at " +
          "a strength the plan could count on. Whether the eastern army could have held " +
          "without them is not something the record can settle. What is certain is that " +
          "the province goes on being overrun while the matter is argued, and that " +
          "the Chief has to answer for it.",
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
      (flags.ohl_twocorps === "sent"
        ? "\n\nTwo corps that would have stood on the right are in East Prussia, and the " +
          "wing is thinner by that much."
        : flags.ohl_twocorps === "kept"
          ? "\n\nBoth corps the east asked for stayed on the right, and the wing is at " +
            "the strength the plan asked for."
          : "") +
      "\n\nWhat to order is not the difficulty. Knowing what to order is." +
      (flags.xc_marne_french === "delayed" ? "\n\nThere is no French attack on the flank. The armies on the left are still withdrawing, and the only pressure on the gap is the one the German armies have made themselves." : ""),
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
              "different hours, some of them with the enemy close behind. The line on the " +
              "Aisne is held, but the cost of getting to it is higher than it needed to be, " +
              "and the recriminations start before the digging does. The officers who were " +
              "not told in time say so, loudly. The Chief's authority over the armies, " +
              "already thin, is thinner at the end of it." },
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
          "Aisne happens regardless, since the gap is there whoever sees it; only the " +
          "authorship changes. The officers at headquarters are left to explain to the " +
          "Kaiser where the Chief has gone.",
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
        next: "ohl_1914_13_ypres",
        outcome:
          "The Supreme Command's weight stays in the west. The eastern command will " +
          "argue against this for two years, and will eventually argue its way into " +
          "this building. In the meantime the divisions that might have gone east to " +
          "finish a Russian army go into the line in France instead, and the war " +
          "settles into the shape the new Chief expects: a long struggle for a decision " +
          "on the one front where he believes one is possible.",
      },
      {
        id: "east",
        label: "Shift the weight east — finish Russia first",
        advisor: { name: "Hindenburg", position:
          "Space in the east is not an argument against victory there. It is the reason victory there is possible." },
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { ohl_theatre: "east" },
        erodes: "spend_will",
        next: "ohl_1914_13_ypres",
        outcome:
          "Speculative. Divisions go east that historically stayed west. The eastern " +
          "command gets the resources it spent two years demanding, and acquires the " +
          "responsibility that comes with them. The west is held thinner than it was, " +
          "by an army that has just been stopped on the Marne and is digging in. " +
          "Whether Russia can be finished with the extra divisions is the whole bet, " +
          "and the record gives no answer.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-11
  ohl_1914_13_ypres: {
    year: 1914, date: "1914-11-04", city: "Ypres",
    title: "The Channel Ports",
    advisors: ["falkenhayn", "tappen"],
    situation:
      "Antwerp has fallen and the race to the sea has ended without a result. What is " +
      "left of the plan is the coast. If the line can be broken at Ypres, the Channel " +
      "ports lie behind it, and so do the British army's communications with them.\n\n" +
      "Fourth Army is made up largely of reserve corps raised since August, men with a " +
      "few weeks' training behind them. Their first assaults near Langemarck went in in " +
      "mass and lost very heavily for little ground.\n\n" +
      "The east is asking for every corps that can be spared. Winter is close, and with " +
      "it the end of the season for attacking anywhere.",
    context:
      "Falkenhayn took the General Staff to find a way of winning, and the coast is the " +
      "last open place for it in the west. A Chief who stops here has to say what he " +
      "will do instead.",
    choices: [
      {
        id: "press",
        label: "Make one more concentrated attack at Ypres before the winter",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "The coast is the one place in the west where a result is still possible. If it is not taken now it will not be taken." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { ohl_flanders: "pressed" },
        next: "ohl_1915_14_gorlice",
        outcome:
          "The last concentrated attack goes in in the second week of November, with " +
          "fresh divisions and a heavy bombardment. It makes ground at several points " +
          "and does not make the breakthrough, and the local fighting dies away by the " +
          "end of the month. The front in Flanders has settled into lines that will " +
          "move very little for years. The reserve corps that made the attack are left " +
          "to bury what remains of them.",
      },
      {
        id: "break",
        label: "Break off in Flanders and send the fresh divisions east for the winter",
        advisor: { name: "Hindenburg", position:
          "The east is the front where Russia can still be hurt this year. A division in Flanders is a division the eastern armies do not have." },
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { ohl_flanders: "broken" },
        next: "ohl_1915_14_gorlice",
        outcome:
          "Speculative. The attack is cancelled with the Channel ports still behind the " +
          "British line, and the fresh divisions go east by rail. The eastern armies go " +
          "into the winter stronger than they were. The front in the west stays where " +
          "the autumn left it, and the coast is never again as open as it is this week. " +
          "The Chief who gave up the last chance of a decision in the west has to say " +
          "what he will try instead.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-04
  ohl_1915_14_gorlice: {
    year: 1915, date: "1915-04-15", city: "Gorlice",
    title: "Where the Ally Is Breaking",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "The Austro-Hungarian army fought through the winter in the Carpathians at heavy " +
      "cost. Przemyśl has fallen with its whole garrison. Conrad has told Berlin that " +
      "the army cannot hold the Carpathians without German help, and Falkenhayn fears " +
      "that if it does not get it Vienna will look for a separate peace.\n\n" +
      (flags.ohl_theatre === "east"
        ? "The weight of the Supreme Command is already in the east, and the argument is " +
          "about how it is to be used."
        : "The weight of the Supreme Command is in the west, and anything sent east is " +
          "taken from it.") +
      "\n\nHindenburg and Ludendorff want an offensive out of East Prussia and Courland " +
      "to cut off the Russian armies in Poland. Falkenhayn thinks it would take more " +
      "divisions than he can spare and commit the army to the depths of Russia, where " +
      "no end can be reached.",
    context:
      "A breakthrough pushes the enemy back. An envelopment, if it works, destroys him. " +
      "The first costs a few corps and a few weeks. The second costs more of both, and " +
      "needs the enemy to stay where he is while it is prepared.",
    choices: [
      {
        id: "gorlice",
        label: "Form a new army under Mackensen and break through at Gorlice and Tarnów",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "An ally that collapses takes the whole eastern front with it. A breakthrough relieves it and costs a fraction of what a campaign in Russia would." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { ohl_gorlice: "mackensen", xc_gorlice: "mackensen" },
        next: "ohl_1915_15_serbia",
        outcome:
          "An Eleventh Army is made up under Mackensen and moved to Galicia by rail. The " +
          "offensive opens on 2 May and the Russian front in western Galicia gives way. By " +
          "the end of the summer Russia has lost Poland and part of the Baltic provinces, " +
          "and its armies have been driven back some hundreds of miles without being " +
          "destroyed. Hindenburg and Ludendorff count it as a victory that was not used " +
          "for an encirclement; Falkenhayn counts it as the result the operation was " +
          "designed to produce.",
      },
      {
        id: "envelop",
        label: "Back Hindenburg's plan: a wide envelopment out of East Prussia and Courland",
        advisor: { name: "Hindenburg", position:
          "Break the Russian front where it stands and the Russian army walks away. Go round it, and it does not." },
        gate: (m) => m.manpower >= -1,
        disabledReason: "There are not the divisions for both a relief of the ally and an envelopment",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { ohl_gorlice: "envelop", xc_gorlice: "envelop" },
        erodes: "spend_will",
        next: "ohl_1915_15_serbia",
        outcome:
          "Speculative. Divisions are drawn east in larger numbers than the Galician " +
          "plan needed, for an operation whose object is to encircle the Russian armies " +
          "in Poland. The Austro-Hungarian front has to hold with what it has in the " +
          "meantime, and the west is left with whatever is not needed elsewhere. An " +
          "envelopment needs the enemy to stay where he is until it closes, and that is " +
          "the part nobody here can promise.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  ohl_1915_15_serbia: {
    year: 1915, date: "1915-09-06", city: "Belgrade",
    title: "A Road to Constantinople",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "Bulgaria has signed with the Central Powers. The military convention puts " +
      (flags.xc_pless === "own"
        ? "the German and Bulgarian armies under Mackensen, with the Austro-Hungarian Third Army keeping its own commander and taking its orders from AOK, "
        : "German, Austro-Hungarian and Bulgarian armies under Mackensen, ") +
      "with the task of " +
      "defeating the Serbian army and opening a land connection between Hungary and " +
      "Bulgaria.\n\n" +
      "That connection is the only way to get German guns and shells to the Ottoman " +
      "Empire, which has held the Dardanelles since the landings in April and is short " +
      "of both.\n\n" +
      "The price is divisions taken from other fronts in the season when the Allies " +
      "attack in the west.",
    context:
      "The Serbian army has turned back three Austro-Hungarian invasions. A campaign " +
      "against it has to be fast, and finished before the weather closes the mountain " +
      "roads.",
    choices: [
      {
        id: "serbia",
        label: "Agree the campaign: attack Serbia under Mackensen in October",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "A line open to Constantinople shuts the Balkans against the Entente and feeds the Turks. It takes a handful of divisions and a month." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_serbia: "attacked" },
        next: "ohl_1916_04_verdun",
        outcome:
          "The attack opens in the first week of October, from the north and, with the " +
          "Bulgarian armies, from the east. Belgrade falls within days. The Serbian " +
          "army and a long column of civilians retreat west and south over the " +
          "mountains of Albania in the winter. By the new year German supplies are " +
          "moving to Constantinople by rail, and the Ottoman army has the guns it was " +
          "short of. Serbia is gone as a front.",
      },
      {
        id: "wait",
        label: "Decline the Balkan commitment and keep every division in the west for the autumn",
        advisor: { name: "Tappen", position:
          "The Allies attack in the west in the autumn. A division sent to Serbia is a division the line will want in October." },
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_serbia: "declined" },
        next: "ohl_1916_04_verdun",
        outcome:
          "Speculative. The Serbian army is left alone and the divisions stay in France " +
          "and Belgium. The land route to Constantinople stays closed, and the Ottoman " +
          "army goes on short of what Germany could have sent it, guns and shells above " +
          "all. The Allies attack in the west in the autumn against a line that has all " +
          "its divisions in it. Bulgaria, having signed, is left with nothing to do but " +
          "wait.",
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
            next: "ohl_1916_14_somme",
            outcome:
              "The guns do the work and the infantry is not spent taking ground for its own " +
              "sake. The French come on to the artillery as expected, in counter-attacks " +
              "that cost them far more than the ground is worth. The ledger is grim on both " +
              "sides and the German column of it is smaller than it might have been. The " +
              "operation does what the memorandum said it would, which is the only thing " +
              "that can be said for it." },
          { weight: 55, title: "Fifth Army reads the directive as an order to take the fortress", historicalBranch: true,
            impact: { manpower: -2, will: -1 },
            setFlags: { ohl_verdunExec: "fortress" },
            next: "ohl_1916_14_somme",
            outcome:
              "The Crown Prince's headquarters takes the instruction to mean the city, and " +
              "the operation becomes what the directive was meant to avoid: German infantry " +
              "attacking prepared positions on ground that has no value except that the " +
              "attack has already been made for it. The distinction between the two " +
              "readings stops mattering somewhere in March, and by then the army that was " +
              "meant to bleed the French is bleeding beside them." },
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
        next: "ohl_1916_14_somme",
        outcome:
          "Speculative. No offensive on the Meuse. The shells and the five divisions " +
          "stay in hand and the army in the west spends 1916 waiting, which is a " +
          "coherent strategy and an intolerable one to explain to a country that has " +
          "been told the war is being won. When the British and French attack in the " +
          "summer they find a line with its reserves behind it. The Chief has kept his " +
          "army and has nothing to show for it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-07
  ohl_1916_14_somme: {
    year: 1916, date: "1916-07-02", city: "Charleville",
    title: "No Ground to Give",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "The British and French attacked on the Somme yesterday, after a week of " +
      "bombardment. In most places the German line has held. At the southern end, " +
      "where French and British lines meet, it has not, and Second Army has to say what " +
      "it will do about ground it has already lost.\n\n" +
      (flags.ohl_verdun === "declined"
        ? "No German army is committed on the Meuse, so the reserves are in hand. They " +
          "are also the only reserves there are."
        : "The reserves are on the Meuse, where the offensive is still being fed. What " +
          "can be spared for the Somme is what the Meuse does not need, which is very " +
          "little.") +
      "\n\nThe question put to the Chief is a rule rather than an operation. Either " +
      "every yard lost is to be retaken at once, or the line may bend.",
    context:
      "A position that is retaken the day after it is lost is held at the price of the " +
      "counter-attack. A position that is given up is held by fewer men, but only if " +
      "the line behind it is ready.",
    choices: [
      {
        id: "hold",
        label: "Order that no ground is to be given up and any ground lost is to be retaken at once",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "A line that gives way once will be asked to give way again. The rule has to be that it does not." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { ohl_somme: "held" },
        next: "ohl_1916_05_relief",
        outcome:
          "The order goes to Second Army in the first days of July. Counter-attacks are " +
          "made at once and, because they are made at once, most of them are made " +
          "piecemeal, against ground the enemy has already begun to fortify. The line holds through the " +
          "summer and the autumn. The cost, counted in the divisions that pass through " +
          "it, is among the heaviest of the war.",
      },
      {
        id: "elastic",
        label: "Let Second Army give up ground where holding it costs more than it is worth",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_somme: "elastic" },
        next: "ohl_1916_05_relief",
        outcome:
          "Speculative. Ground is given where it cannot be held cheaply and a second " +
          "line is built behind it. The front moves back by a few kilometres in places. " +
          "Fewer men are lost in counter-attacks, and the retreat has to be explained " +
          "at home as something other than a defeat. The officers who hold that no yard " +
          "may be given up say so, and the Chief has to decide whether he is willing to " +
          "be overruled by his own caution.",
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
        next: "ohl_1916_15_programme",
        outcome:
          "The army in the west stops attacking and starts building. The line is " +
          "shortened and the ground given up is left useless behind it. Divisions are " +
          "freed. What they are to be used for is the next question and it is already " +
          "being answered somewhere other than in this building, in the arithmetic of " +
          "ships and tonnage. For the first time since 1914 this headquarters has a " +
          "reserve and no plan to spend it on.",
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
        next: "ohl_1916_15_programme",
        outcome:
          "Speculative. The effort continues into weather and against a Somme front " +
          "that is being reinforced faster than it is being broken. The divisions that " +
          "would have been rebuilt are not rebuilt, and the shell reserve that was " +
          "meant to last the winter goes into the mud in November. The new Chiefs have " +
          "kept the old Chief's policy for the sake of consistency, and will be asked " +
          "in the spring what it bought.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-09
  ohl_1916_15_programme: {
    year: 1916, date: "1916-08-31", city: "Pless",
    title: "Twice the Guns by Spring",
    advisors: ["hindenburg", "ludendorff"],
    situation: (flags) =>
      "The Third Supreme Command has looked at what the army fires and what the " +
      "factories make, and has found them a long way apart. " +
      (flags.ohl_somme === "held"
        ? "The Somme is consuming shells faster than they are being filled."
        : "The Somme is consuming shells at a rate no one had planned for.") +
      "\n\nLudendorff's programme asks for munitions output to be doubled and the " +
      "supply of guns and machine guns to be tripled by the spring of 1917. Doing it " +
      "means skilled men taken from the front and put back in the factories, and every " +
      "man and woman of working age put under an obligation to work, which only a " +
      "law can do.\n\n" +
      "The War Ministry and the industrialists say the targets cannot be met. The " +
      "railways and the coal supply are already stretched.",
    context:
      "A programme this size will be tested not against what factories can make, but " +
      "against the coal that heats them, the wagons that move the coal, and the food " +
      "the workers eat. The Supreme Command has authority over none of the three.",
    choices: [
      {
        id: "full",
        label: "Adopt the programme at full size and ask the Reichstag for a labour service law",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The war will be decided by what each side can put in the field next year. We have to produce more than the enemy, whatever it takes to do it." },
        impact: { manpower: 0, munitions: 2, will: -1 },
        setFlags: { ohl_programme: "full" },
        next: "ohl_1917_06_pless",
        outcome:
          "The programme is issued on 31 August, and the Auxiliary Service " +
          "Law passes the Reichstag in December, though with amendments that the " +
          "Supreme Command did not want. Output rises, but nowhere near the targets. " +
          "The winter of 1916 and 1917 brings a failed potato harvest, a coal famine " +
          "and a railway system that cannot move what is made. It is remembered as the " +
          "turnip winter.",
      },
      {
        id: "moderate",
        label: "Adopt a smaller programme that the railways and the coal supply can carry",
        advisor: { name: "Tappen", position:
          "A target that cannot be met is worse than a smaller one that can. The army needs the shells it is promised." },
        impact: { manpower: 1, munitions: -1, will: 1 },
        setFlags: { ohl_programme: "moderate" },
        next: "ohl_1917_06_pless",
        outcome:
          "Speculative. The targets are set below what the Supreme Command asked for " +
          "and nearer what the economy could deliver. Fewer skilled men are taken from " +
          "the front, and less is demanded of the railways. The army has fewer guns in " +
          "the spring than it would have had if the programme had been met, and it has " +
          "fewer than it was told to expect.",
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
        setFlags: { ohl_usw: "unrestricted", ohl_usEntry: "certain", xc_usw: "unrestricted" },
        next: "ohl_1917_12_alberich",
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
        setFlags: { ohl_usw: "restricted", ohl_usEntry: "deferred", xc_usw: "restricted" },
        erodes: "spend_will",
        next: "ohl_1917_12_alberich",
        outcome:
          "Speculative. The U-boats stay under prize rules, American neutrality is not " +
          "forced, and the war in the west continues on the ground with no instrument " +
          "for changing it. The Supreme Command has declined the only decisive-looking " +
          "option it had and now has to find another. The Chancellor has won the " +
          "argument, and the soldiers who lost it will remember who won it when the " +
          "next one comes round.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-02
  ohl_1917_12_alberich: {
    year: 1917, date: "1917-02-04", city: "Pless",
    title: "Back to the Siegfried Line",
    advisors: ["kuhl", "ludendorff"],
    bulletin: {
      voice: "ohl", date: "1917-02-02", source: "Official communiqué",
      text:
        "The Supreme Command has taken every measure for the security of the western " +
        "front through the coming spring. No change in the position is contemplated.",
    },
    situation: (flags) =>
      "Behind the Somme front, since September, a new position has been under " +
      "construction: concrete, wire and deep dugouts, on a line that cuts across the " +
      "base of the great bulge the front now makes between Arras and the Aisne. It is " +
      "shorter by some forty kilometres and needs thirteen or fourteen fewer divisions " +
      "to hold it.\n\n" +
      "Crown Prince Rupprecht's army group has asked for permission to go back to it. " +
      "The army commanders in the bulge do not want to go. Ludendorff has resisted " +
      "giving up ground that cost so much to hold.\n\n" +
      (flags.ohl_usw === "unrestricted"
        ? "The submarine campaign began on 1 February, and the army's part in it is to " +
          "free divisions for the spring. A shortened line would do that."
        : "The army has no new instrument for ending the war, and the next campaign has " +
          "to be fought with what the line can spare.") +
      "\n\nIf the army goes back, the ground it leaves will be of use to whoever " +
      "follows it. The only argument is about whether it should be.",
    context:
      "The retirement would take about six weeks to prepare. What is left behind has " +
      "to be decided before it begins, since the order will have to go out down to the " +
      "pioneers who carry it out.",
    choices: [
      {
        id: "devastate",
        label: "Withdraw to the new line and destroy what the enemy could use in the ground left behind",
        historical: true,
        advisor: { name: "Kuhl", position:
          "To go on holding the bulge is to wear out the divisions holding it. A shorter line gives them back." },
        impact: { manpower: 3, munitions: 0, will: -1 },
        setFlags: { ohl_alberich: "devastated" },
        next: "ohl_1917_07_chancellor",
        outcome:
          "The Kaiser's order is signed on 4 February, and the army begins to go back " +
          "in March. Roads are mined, wells fouled, villages burned, orchards cut and " +
          "the civilian population sent away. The British and French follow into " +
          "empty country and take weeks to bring up their railways. The destruction " +
          "is reported across neutral countries, and it does the army's name no good.",
      },
      {
        id: "spare",
        label: "Withdraw to the new line, leaving the ground as it is",
        advisor: { name: "Crown Prince Rupprecht", position:
          "The ground can be given up without being destroyed. The destruction harms Germany's name abroad more than it harms the enemy." },
        impact: { manpower: 2, munitions: 0, will: 0 },
        setFlags: { ohl_alberich: "spared" },
        next: "ohl_1917_07_chancellor",
        outcome:
          "Speculative. The army goes back to the new line, and the villages and roads " +
          "behind it are left standing. The enemy moves up faster than he did, over " +
          "roads and through towns that are whole. The retirement frees the divisions " +
          "it was meant to free, and no report of burned villages goes to the neutral " +
          "press. What the army gains in good name it loses in the weeks it would have " +
          "gained by delaying the pursuit.",
      },
      {
        id: "stay",
        label: "Refuse the withdrawal and hold the bulge through the summer",
        advisor: { name: "Ludendorff", position:
          "Ground that has been paid for in blood should not be given up without a battle." },
        gate: (m) => m.manpower >= 0,
        disabledReason: "The divisions that would hold the longer line are not there",
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { ohl_alberich: "held" },
        erodes: "spend_will",
        next: "ohl_1917_07_chancellor",
        outcome:
          "Speculative. The army stays in the bulge. The new line is finished and empty " +
          "behind it. The enemy attacks the old line in the spring, with the divisions " +
          "that would have been freed still in it, and the army holds the ground it was " +
          "told not to give up at a cost that the commanders who proposed the " +
          "withdrawal had already put in writing. Ludendorff has kept his ground and " +
          "spent his reserve.",
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
        next: "ohl_1917_13_caporetto",
        outcome:
          "Bethmann Hollweg leaves the chancellorship in July. His successors govern " +
          "with the Supreme Command's approval and without much else. The military " +
          "direction of the war is now the direction of the war, and every domestic " +
          "failure from here belongs to this headquarters whether it caused it or not. " +
          "The Reichstag passes its resolution anyway, and the Chancellor who might " +
          "have answered it is gone.",
      },
      {
        id: "tolerate",
        label: "Leave the Chancellor in place and accept the resolution",
        advisor: { name: "Bethmann Hollweg", position:
          "A resolution the Reichstag has voted for is worth more to the country than one the army permits it to vote for." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { ohl_chancellor: "kept" },
        next: "ohl_1917_13_caporetto",
        outcome:
          "Speculative. The civil government survives the summer with its authority " +
          "intact, which means the Supreme Command has a colleague rather than a " +
          "subordinate, and an argument to lose every time it wants something. The " +
          "Reichstag resolution goes through, and the army is told by its own " +
          "government what the war is for. Ludendorff and Hindenburg have to decide " +
          "whether they will go on serving a government they tried to remove.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-09
  ohl_1917_13_caporetto: {
    year: 1917, date: "1917-09-10", city: "Kreuznach",
    title: "Help for Vienna",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "Eleven battles on the Isonzo have brought the Austro-Hungarian army close to the " +
      "end of what it can do, and another Italian attack is expected before the winter. " +
      "The Emperor Charles has asked Berlin for help: heavy guns, and divisions to take " +
      "over in the east so that Austrian ones can be moved to Italy.\n\n" +
      "Ludendorff has judged that six to eight German divisions can be spared until " +
      "the winter, now that the east has gone quiet. " +
      (flags.ohl_chancellor === "removed"
        ? "There is a new Chancellor, chosen with the Supreme Command's approval, and " +
          "the Chancellery's view carries little weight in this room."
        : "The Chancellor remains, and the Supreme Command has to take his government's " +
          "view of the matter into account.") +
      "\n\nDivisions sent to Italy are divisions not in reserve behind the line in " +
      "Flanders, where the British have been attacking since July.",
    context:
      "An Italian collapse would not end the war. It might keep Austria-Hungary in it. " +
      "The alternative is to leave Vienna to its own front and decide later what that " +
      "costs.",
    choices: [
      {
        id: "send",
        label: "Send German divisions to the Isonzo and take command of the offensive",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "Austria-Hungary has to be kept in the war. A blow on the Isonzo is the cheapest way of doing it." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_caporetto: "sent", xc_caporetto: "sent" },
        next: "ohl_1918_12_faustschlag",
        outcome:
          "A Fourteenth Army is made up of German and Austro-Hungarian divisions under " +
          "Otto von Below. The offensive opens on 24 October and the Italian line at " +
          "Caporetto breaks. The Italians retreat to the Piave, and the Allies send " +
          "divisions to hold them. Austria-Hungary does not leave the war, and Germany " +
          "has bought it a winter at the price of six or seven divisions and a good " +
          "deal of its own attention.",
      },
      {
        id: "refuse",
        label: "Send guns and staff officers but no divisions",
        impact: { manpower: 1, munitions: -1, will: 0 },
        setFlags: { ohl_caporetto: "refused", xc_caporetto: "refused" },
        next: "ohl_1918_12_faustschlag",
        outcome:
          "Speculative. Vienna gets the artillery it asked for and not the divisions. " +
          "The Isonzo line holds, or it does not, on the strength of an army that has " +
          "been strained to the limit. Whatever happens there, the divisions stay in " +
          "Flanders, where the British are still attacking. The Emperor has asked his " +
          "ally for a great deal and been given a little, and he will remember the " +
          "proportion when the question of peace comes up.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-02
  ohl_1918_12_faustschlag: {
    year: 1918, date: "1918-02-13", city: "Bad Homburg",
    title: "Neither War nor Peace",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "On 10 February the Russian delegation at Brest-Litovsk declared that Russia " +
      "would not sign the treaty and considered the war over. It then went home. " +
      "There is no treaty, and the armistice that covers the line will run out on " +
      "the 17th.\n\n" +
      "The Kaiser has called a council at Bad Homburg. The Foreign Secretary and the " +
      "Chancellor are troubled by the size of what the military and the nationalists " +
      "want to take in the east. The soldiers want to move at once, while the " +
      "Russian army is dissolving and the Baltic provinces and Ukraine are open.\n\n" +
      (flags.ohl_caporetto === "sent"
        ? "The German divisions sent to Italy have come out of it, and the army has to " +
          "decide where to use them."
        : "The divisions that did not go to Italy are where they were, and the army has " +
          "to decide where to use them.") +
      " Every division that stays in the east is one that is not in France in March." +
      (flags.xc_ukraine === "kept" ? "\n\nVienna has told Berlin that no Austro-Hungarian division will go into Ukraine. The occupation, and the grain, will be German work alone." : ""),
    context:
      "The advance, if it is made, needs no plan. The Russian army is not resisting. " +
      "What it needs is a decision about how much of the east the Empire will hold " +
      "when it stops.",
    choices: [
      {
        id: "advance",
        label: "End the armistice and resume the advance on the 18th",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The Russians have refused to sign. They will sign when they see what refusing costs them." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { ohl_faust: "advanced" },
        next: "ohl_1918_08_brest",
        outcome:
          "The advance begins on 18 February, along the whole front from the Baltic to " +
          "Ukraine. German and Austro-Hungarian divisions go forward with almost no " +
          "fighting, by rail where the lines are whole. Minsk is taken on the 21st, and " +
          "Kiev on 2 March. On 3 March the Russian government signs the treaty that it " +
          "refused to sign on the 10th. The army has what it marched for, and has to " +
          "garrison it.",
      },
      {
        id: "accept",
        label: "Accept the declaration and let the armistice run out without advancing",
        advisor: { name: "Kühlmann", position:
          "Russia will have to be part of any settlement in Europe. A peace taken at the point of an advance is a peace that will have to be revised." },
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_faust: "declared" },
        next: "ohl_1918_08_brest",
        outcome:
          "Speculative. The armies stay where they are. The Russian government has " +
          "declared the war ended, and there is no treaty and no further advance. " +
          "Divisions that would have been marching are free to be moved. The Baltic " +
          "provinces and Ukraine stay open and uncertain, and the annexationists at " +
          "home regard the opportunity as thrown away. Whether the Russian declaration " +
          "would have held, with a German army at the line, is a question of what the " +
          "army was prepared to ignore.",
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
    situation: (flags) =>
      (flags.ohl_faust === "declared"
        ? "Russia has declared the war over and gone home. There is no treaty, and what " +
          "the army holds in the east is what it held when the armistice ran out. "
        : "Russia is out. ") +
      "What follows is not a military question but it will be answered " +
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
        impact: { manpower: 2, munitions: 1, will: 1 },
        setFlags: { ohl_brest: "maximal" },
        erodes: "spend_will",
        next: "ohl_1918_09_michael",
        outcome:
          "The terms are severe and the territory is enormous. Around fifty divisions " +
          "come west; by the twenty-first of March a hundred and ninety-two of the " +
          "army's divisions are on the Western Front. The rest are administering the " +
          "prize, and they stay there. The Chief has what the annexationists wanted, " +
          "and the divisions he would have wanted in France are in Ukraine and the " +
          "Baltic, counting grain and signing receipts.",
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
          "that did not want it. The army has the weight it asked for in the spring. " +
          "Whether it is enough to win, or only enough to lose more slowly, is not a " +
          "question the figures settle.",
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
            next: "ohl_1918_13_aisne",
            outcome:
              "Sixty-five kilometres of ground and the largest breakthrough since the line " +
              "stopped moving. Amiens is threatened and not taken. The armies on the flanks " +
              "are too worn to widen the front, the direction of the advance no longer " +
              "serves the envelopment it was meant to serve, and what has been gained is a " +
              "salient exposed on every side. Losses among the best divisions are far " +
              "beyond what can be replaced." },
          { weight: 40, title: "The exploitation reaches the junction",
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { ohl_michaelResult: "amiens" },
            next: "ohl_1918_13_aisne",
            outcome:
              "Speculative. The adaptive method finds the seam and the exploitation carries " +
              "to the junction. The British and French are separated on the ground. What " +
              "that is worth depends entirely on what can be moved through the gap before " +
              "it closes, and the answer to that is not encouraging: the railways behind " +
              "the advance are broken, the horses are starving, and the divisions at the " +
              "head of it have been marching for a week." },
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
        next: "ohl_1918_13_aisne",
        outcome:
          "Speculative. Effort is concentrated and diversions refused. Whether the " +
          "junction can be reached and held is a question the logistics may answer " +
          "before the enemy does. The divisions that would have gone wherever the line " +
          "gave way are held for the one objective, and the Chief has staked the whole " +
          "offensive on a single railway junction, without any second plan if the road " +
          "to it proves too long.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-05
  ohl_1918_13_aisne: {
    year: 1918, date: "1918-05-29", city: "Avesnes",
    title: "Past the Vesle",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "The attack on the Aisne was meant to be a diversion. Its purpose was to draw " +
      "Allied reserves south, away from Flanders, where the real blow against the " +
      "British was to fall in July.\n\n" +
      "It has gone far better than planned. The French line broke on the first day, " +
      "and by the second the German armies were over the Vesle, which was where the " +
      "plan said they should stop. Soissons fell today. The Marne is a day's march " +
      "away, and beyond it, Paris.\n\n" +
      (flags.ohl_michaelResult === "amiens"
        ? "The junction at Amiens was reached in March, and the British are still in the " +
          "war. What was won there did not end it."
        : "The March offensive did not end the war, and this is the second time in " +
          "ten weeks that the army has broken a line without being able to end the " +
          "fight.") +
      "\n\nDivisions held back for Flanders have already been sent south to feed the " +
      "advance." +
      (flags.xc_command1918 === "national" ? "\n\nIntelligence from the other side shows two Allied commands still giving separate orders, and the reserves going where each thinks best, not where the whole front needs them." : ""),
    context:
      "A diversion that succeeds becomes a second main effort, and takes the divisions " +
      "meant for the first. What is spent here cannot be used in Flanders.",
    choices: [
      {
        id: "exploit",
        label: "Exploit the breakthrough and send the army on to the Marne",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The French line has gone. An opportunity like this does not come twice, and it would be a crime not to use it." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { ohl_aisne: "exploited" },
        erodes: "spend_will",
        next: "ohl_1918_10_salient",
        outcome:
          "The advance goes on beyond the Vesle to the Ourcq and the Marne, which the " +
          "leading units reach on 30 May. It makes a deep salient, with a long and " +
          "narrow base, held by divisions that were being kept for the attack in " +
          "Flanders. When the advance stops in early June, the Flanders attack is " +
          "put off, and then put off again.",
      },
      {
        id: "halt",
        label: "Halt on the Vesle as planned and keep the reserves for Flanders",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_aisne: "halted" },
        next: "ohl_1918_10_salient",
        outcome:
          "Speculative. The army stops where the plan said it should, with a gain that " +
          "was never in the plan, and the reserves go back to the north. The attack in " +
          "Flanders goes ahead as designed, against a British army that has had time to " +
          "prepare for it. Paris is not threatened, and the country is told so. Whether " +
          "the Chief who passed up the Marne could have won a battle in Flanders is a " +
          "question only the Flanders battle could have answered.",
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
      (flags.ohl_aisne === "exploited"
        ? "\n\nThe salient on the Marne has the longest flank of all, and the army that " +
          "made it is the army holding it."
        : "") +
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
        next: "ohl_1918_14_blackday",
        outcome:
          "Speculative. The armies come back to a line they can hold and a reserve " +
          "exists again. At home, the maps in the newspapers move backwards for the " +
          "first time since March, and no communiqué makes that mean anything else. The " +
          "army has more men in September than it would otherwise have had, and the " +
          "country has less faith. A retirement is easier to order than to explain, and " +
          "the explaining falls to this headquarters.",
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
        next: "ohl_1918_14_blackday",
        outcome:
          "The salients are held and the divisions holding them are consumed doing it. " +
          "The retreat, when it comes, comes at a time chosen by the enemy rather than " +
          "by this headquarters. The ground taken in the spring is given up anyway, but " +
          "at the cost of the divisions that held it through the summer, and the army " +
          "that has to fall back in the autumn is a smaller one than the army that " +
          "could have fallen back in July.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-08
  ohl_1918_14_blackday: {
    year: 1918, date: "1918-08-14", city: "Spa",
    title: "The Black Day",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "On 8 August British, Australian and Canadian troops attacked east of Amiens " +
      "with tanks, aircraft and a short, sudden bombardment. The German line gave way " +
      "on a wide front, and some divisions did not fight. Thousands of men were taken " +
      "prisoner. Ludendorff called it the black day of the German army.\n\n" +
      (flags.ohl_salient === "shortened"
        ? "The line had been shortened in July and the reserve restored, which is why " +
          "the break was closed. It is still a break."
        : "The salients held in July are the ground the attack came through. Divisions " +
          "that should have been resting were holding them.") +
      "\n\nThe Kaiser is at Spa, and the council meets today. The Foreign Secretary is " +
      "there, and so are the two soldiers who spent the spring promising a decision " +
      "in the west." +
      (flags.xc_command1918 === "national" ? "\n\nThe attack at Amiens fell on a front where the British and French commands had not been put under one hand, and it shows in how slowly the French reserves came up." : ""),
    context:
      "A command that declares the offensive over has to say what it will do instead. " +
      "One answer is to stand on the defensive and let the country find out why. The " +
      "other is to try again before the Americans arrive in strength.",
    choices: [
      {
        id: "defensive",
        label: "Go over to the strategic defensive and let the Foreign Secretary open an approach",
        historical: true,
        advisor: { name: "Hintze", position:
          "A defensive in the west has to go with an approach to the enemy. The army alone cannot end this." },
        attested: { by: "Ludendorff", text: "the black day of the German Army",
          source: "Ludendorff, My War Memories, on 8 August 1918" },
        impact: { manpower: 2, munitions: 0, will: -1 },
        setFlags: { ohl_blackday: "defensive" },
        next: "ohl_1918_11_request",
        outcome:
          "The council agrees on a defensive in the west, with the aim of making the " +
          "enemy tired of fighting. The Foreign Secretary is asked to find out, through " +
          "neutral channels, what terms are possible. The army goes on giving ground in " +
          "orderly stages through September. The decision is not announced, and the " +
          "country goes on reading communiqués that describe a different war from the " +
          "one it is losing.",
      },
      {
        id: "offensive",
        label: "Plan another offensive before the Americans arrive in strength",
        impact: { manpower: -2, munitions: -1, will: 1 },
        gate: (m) => m.manpower >= -3,
        disabledReason: "There are not the divisions left for another offensive",
        setFlags: { ohl_blackday: "offensive" },
        erodes: "spend_will",
        next: "ohl_1918_11_request",
        outcome:
          "Speculative. Another attack is prepared for September, with divisions taken " +
          "from the quiet sectors. It is a smaller operation than any of the spring's, " +
          "and it is aimed at a front that the enemy has had time to reinforce. The " +
          "divisions are drawn from sectors that were holding only because they were " +
          "quiet, and the Chief has chosen to spend them on one more attempt rather " +
          "than keep them to fall back on.",
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
        next: "ohl_1918_15_wilson",
        outcome:
          "The request goes forward. A government is assembled to carry it and does. " +
          "Within a few years a great many people who were in this building will " +
          "explain that the army was never beaten and that the request came from " +
          "somewhere else. The army goes on retreating in order, and the country learns " +
          "from a note to an American President what its own headquarters decided a " +
          "week ago. It is the last decision that is entirely this headquarters' own.",
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
          "it lasts as long as the line does. The government that has not been asked to " +
          "ask for anything goes on governing a population that is eating turnips. The " +
          "Chief has kept the choice for himself, and the people behind him have not " +
          "been consulted about the price.",
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
          "unbroken, from a position that can still be described as strong. The enemy " +
          "governments have to decide whether to treat with an army that has not been " +
          "beaten in the field, and whether to believe an offer that comes from the " +
          "Supreme Command rather than from a government. Nothing the record shows can " +
          "say what they would have answered, and the ending does not pretend to.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  ohl_1918_15_wilson: {
    year: 1918, date: "1918-10-24", city: "Spa",
    title: "A Reply Wilson Will Not Take",
    advisors: ["ludendorff", "hindenburg"],
    situation:
      "The request went out in the first week of October, over the signature of a new " +
      "Chancellor, Prince Max of Baden. President Wilson has replied three times. The " +
      "third reply, on 23 October, says that the United States will deal only with " +
      "representatives of the German people, and will demand terms that make it " +
      "impossible for Germany to renew the war.\n\n" +
      "Ludendorff, who asked for an armistice on 29 September, has changed his mind. " +
      "He reads the reply as a demand for surrender, and he believes the army can still " +
      "hold a line through the winter.\n\n" +
      "Prince Max holds the exchange of notes to be the government's business and not " +
      "the army's.\n\n" +
      "Telegrams to the armies go out over the Supreme Command's signature, and nobody " +
      "else's.",
    context:
      "An order to the army that contradicts the government's course is a political " +
      "act. It is also something the Supreme Command has the power to issue without " +
      "anyone's agreement.",
    choices: [
      {
        id: "order",
        label: "Issue an order to the army rejecting the terms and calling for resistance",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The army has to know that these terms are unacceptable, and that it is to go on fighting while it is still in a position to." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_wilson: "order" },
        erodes: "spend_will",
        dispute:
          "The order is dated 24 October in most accounts and 25 October in some. " +
          "Accounts also differ about its purpose. Ludendorff's position afterwards " +
          "was that the third note had changed the situation and that the army had to " +
          "be told so. The government read it as an attempt to wreck the negotiation " +
          "by going over its head to the army, and the Chancellor demanded his " +
          "dismissal.",
        next: "ohl_end_armistice",
        outcome:
          "The order goes out to the armies without the Chancellor's knowledge. It " +
          "reaches the press, and the Chancellor demands that Ludendorff be dismissed " +
          "or he will go himself. On the 26th the Kaiser accepts Ludendorff's " +
          "resignation and keeps Hindenburg. Ludendorff is replaced by Groener, and the " +
          "armistice request stands. The army is told one thing by its headquarters and " +
          "another by its government, in the same week.",
      },
      {
        id: "accept",
        label: "Leave the reply to the government and tell the army only what the Chancellor allows",
        advisor: { name: "Hindenburg", position:
          "The notes are a matter for the government. The army's business is to hold its ground while they are answered." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_wilson: "accepted" },
        next: "ohl_end_armistice",
        outcome:
          "Speculative. No order is issued. The government answers the third note " +
          "without a quarrel with the army, and Ludendorff stays in his post to the " +
          "end. What the army is told about the negotiation is left to the Chancellor, " +
          "who tells it what he thinks it can bear. The Supreme Command has given up " +
          "the last instrument it had of independent action, and it has done so in the " +
          "week when the army most needs to believe it has one.",
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
      "Two corps for the east: " + (flags.ohl_twocorps === "kept" ? "kept on the right." : "sent to East Prussia by rail.") + "\n" +
      "Ypres, November 1914: " + (flags.ohl_flanders === "broken" ? "broken off." : "one more concentrated attack.") + "\n" +
      "The eastern front, 1915: " + (flags.ohl_gorlice === "envelop" ? "a wide envelopment." : "a breakthrough at Gorlice.") + "\n" +
      "Serbia: " + (flags.ohl_serbia === "declined" ? "declined." : "attacked in October 1915.") + "\n" +
      "The Meuse: " + (flags.ohl_verdun === "declined" ? "declined." : (flags.ohl_verdunExec === "fortress" ? "fought as a battle for the fortress." : "fought as the directive was written.")) + "\n" +
      "The Somme: " + (flags.ohl_somme === "elastic" ? "ground given where it was dear." : "no ground to be given up.") + "\n" +
      "The Hindenburg Programme: " + (flags.ohl_programme === "moderate" ? "a smaller programme." : "adopted at full size.") + "\n" +
      "The submarines: " + (flags.ohl_usw === "restricted" ? "held under prize rules." : "unrestricted from 1 February 1917.") + "\n" +
      "Weight of effort after the Marne: " + (flags.ohl_theatre === "east" ? "shifted east." : "held in the west.") + "\n" +
      "Posture for 1917: " + (flags.ohl_1917posture === "offensive" ? "continued offensive effort." : "defensive, rebuilding.") + "\n" +
      "American entry: " + (flags.ohl_usEntry === "deferred" ? "deferred." : "brought on by the decision of 9 January 1917.") + "\n" +
      "The retirement to the Siegfried Line: " + (flags.ohl_alberich === "held" ? "refused." : flags.ohl_alberich === "spared" ? "made, with the ground left standing." : "made, with the ground destroyed.") + "\n" +
      "Italy, autumn 1917: " + (flags.ohl_caporetto === "refused" ? "guns and staff officers, no divisions." : "German divisions and the offensive at Caporetto.") + "\n" +
      "February 1918: " + (flags.ohl_faust === "declared" ? "the Russian declaration accepted." : "the advance resumed on the 18th.") + "\n" +
      "Brest-Litovsk: " + (flags.ohl_brest === "narrow" ? "narrow settlement, divisions released west." : "maximal settlement, divisions retained in garrison.") + "\n" +
      "Spring 1918: " + (flags.ohl_michael === "amiensfirst" ? "Amiens named as the objective." : "breakthrough taken as the objective.") + "\n" +
      "The Aisne, May 1918: " + (flags.ohl_aisne === "halted" ? "halted on the Vesle." : "exploited to the Marne.") + "\n" +
      "After 8 August: " + (flags.ohl_blackday === "offensive" ? "another offensive planned." : "the strategic defensive.") + "\n" +
      "September 1918: " + (flags.ohl_request === "refused" ? "the request was refused." : flags.ohl_request === "early" ? "terms were sought early." : "requested through a new civil government.") + "\n" +
      "The third American note: " + (flags.ohl_wilson === "accepted" ? "left to the government." : "answered by an order to the army, and Ludendorff's resignation.") + "\n\n" +
        "What actually happened: The request went to President Wilson on 3 and 4 " +
        "October, the Kaiser's abdication was announced on 9 November, and the " +
        "armistice was signed at Compiegne on the morning of 11 November. The peace " +
        "was signed at Versailles on 28 June 1919. The Supreme Command's account, " +
        "that an undefeated army had been betrayed at home, was in print within a " +
        "year.",
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
      "front for a country that had stopped being able to supply one.\n\nWhat " +
      "actually happened: The army retreated in order to the end. The collapse came " +
      "from behind it: the sailors' mutiny at Kiel at the start of November, " +
      "councils of workers and soldiers spreading through the cities, and the " +
      "Kaiser's abdication on 9 November, when a republic was proclaimed in Berlin. " +
      "The blockade had been felt in hunger since the turnip winter of 1916 and " +
      "1917. The claim that an undefeated army had been stabbed in the back by its " +
      "own home front grew out of exactly this. The Treaty of Versailles, signed on " +
      "28 June 1919, was then presented in Germany as a peace imposed on a country " +
      "that had never been beaten.",
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
      "Speculative. The historical German army retreated in order to the end and " +
      "was never broken open in the field. Spending it harder than it was spent " +
      "leaves nothing for anyone to reinterpret afterwards.\n\nWhat actually " +
      "happened: The army never broke open in the field. Between July and November " +
      "it fell back from the Marne to the Meuse and the Scheldt, giving up ground " +
      "and prisoners, but it kept a front, and its units marched home in order " +
      "after the armistice. That the army could be said to have been undefeated, " +
      "and that its leaders afterwards said so, depended on the front never having " +
      "been breached in daylight, which this ending takes away. The officers who " +
      "made that claim in the years after the war were describing a front that, in " +
      "the days of the armistice, they still held.",
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
      "having been held.\n\nWhat actually happened: There was no winter line. The " +
      "request went to President Wilson in the first week of October, his replies " +
      "made the Allied terms plain by the end of the month, and the armistice was " +
      "signed on 11 November. The Allies had a larger campaign in preparation for " +
      "1919, with more tanks and a growing American army, and it was never needed. " +
      "Whether the German front could have held through the winter was never " +
      "tested. The terms of the armistice were severe, but they were the terms of " +
      "an army that still had a front, which was one reason the war ended when it " +
      "did.",
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
      "Entente's willingness to treat with an unbeaten German army in September " +
      "1918 is not something the record can settle, and this ending does not " +
      "pretend it can.\n\nWhat actually happened: No approach was made in " +
      "September. The first request to Wilson went on 3 and 4 October, from a new " +
      "government under Prince Max of Baden, after Ludendorff had told a council at " +
      "Spa on 29 September that the army could not wait. Wilson replied three times " +
      "and each reply set a harder condition. The Allies never had to answer an " +
      "offer from an army that was still intact, because none was made. The Allies' " +
      "public position throughout was that there could be no talk of peace with the " +
      "old system of government in Germany, and that decided the order in which " +
      "things happened.",
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
      "asking side still has when it asks.\n\nWhat actually happened: The armistice " +
      "was signed in the railway carriage at Compiegne at about five in the morning " +
      "of 11 November, by a delegation led by the civilian politician Matthias " +
      "Erzberger and not by a soldier, who had been given seventy-two hours to " +
      "accept. The terms required the evacuation of occupied territory and of the " +
      "left bank of the Rhine, the surrender of guns, aircraft, submarines and much " +
      "of the fleet, and kept the blockade in force until the peace. The delegation " +
      "had no authority to bargain and little to bargain with, and the one " +
      "concession it did obtain, a small reduction in the numbers of guns and " +
      "machine guns to be surrendered, did not change the character of the terms.",
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
      "different amount.\n\nWhat actually happened: Neither condition was met. The " +
      "eastern settlement was the harsh one, and about fifty divisions came west " +
      "from it, not all that might have. The salients were held through July and " +
      "the army that asked for an armistice in the autumn was a worn army with few " +
      "reserves. The armistice required it to leave France, Belgium and " +
      "Alsace-Lorraine within fourteen days and to give up its heavy equipment, " +
      "whatever state it was in. The army's condition was not the thing that made " +
      "the terms, which were made by the Allies' own view of what they needed in " +
      "order not to fight again.",
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
      "Speculative. Territory is only an asset if it can be held with fewer men " +
      "than it releases.\n\nWhat actually happened: Germany did hold the east when " +
      "the war ended, with Brest-Litovsk in force and its troops in the Baltic " +
      "provinces and Ukraine. The armistice annulled the treaty and told the troops " +
      "in the former Russian territories to withdraw when the Allies judged the " +
      "moment suitable. Many stayed, in the Baltic, into 1919, where Freikorps " +
      "units fought against the Bolsheviks and the new Baltic governments. The " +
      "prize was held for a winter after the war that was meant to secure it. The " +
      "eastern settlement that the Supreme Command spent the war trying to secure " +
      "was undone in a single clause, and the armies that were to hold it were the " +
      "same armies that went home.",
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
      "The office continues. The occupant does not.\n\nWhat actually happened: " +
      "Ludendorff was dismissed on 26 October 1918, after the order to the army " +
      "that answered Wilson's third note, and Hindenburg stayed. Groener took his " +
      "place as First Quartermaster General, and on 9 November he told the Kaiser " +
      "at Spa that the army no longer stood behind him. The Kaiser left for the " +
      "Netherlands the next day. The office went on after its occupants had gone, " +
      "as the epilogue says. Ludendorff left for Sweden, in civilian clothes and " +
      "dark glasses, a few days afterwards, and Hindenburg remained at his post " +
      "until the army was home. The Supreme Command that had set out in 1916 to win " +
      "the war by force of will ended it as the object of a quarrel among the " +
      "people it had governed.",
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
// Erosion cap set after measurement (measure-erosion.js, montecarlo.js hard): the historical line carries five of the 11 erosion-tagged choices, so at 6 the historical run survives and about one random run in ten is relieved.
CAMPAIGNS.gqg.hardMode.erosionMax = 6;

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
        next: "gqg_1914_12_retreat",
        outcome:
          "The attacks go in and are stopped in front of positions the doctrine said " +
          "would give way. The Battle of the Frontiers costs the army more men in three " +
          "weeks than anyone in this building has budgeted for a year, and the German " +
          "right comes on through Belgium regardless. The regiments that went forward " +
          "in red trousers learn what machine guns and heavy howitzers do to a bayonet " +
          "charge, and the lesson is paid for in full.",
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
        next: "gqg_1914_12_retreat",
        outcome:
          "Speculative. Formations move left earlier than they historically did. Fewer " +
          "men are spent on the frontier and more are in front of the sweep, at the " +
          "price of an army told on its first day that its doctrine was mistaken. The " +
          "officers who built their careers on the attack have to be persuaded that the " +
          "plan they were taught is the wrong one, and some of them will not be, " +
          "whatever the reports from Belgium say.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  gqg_1914_12_retreat: {
    year: 1914, date: "1914-08-25", city: "Vitry-le-Francois",
    title: "The Order to Go Back",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The attacks in Lorraine and the Ardennes have been stopped. On the left, the " +
      "Fifth Army has been beaten on the Sambre and the British at Mons, and Namur has " +
      "fallen. German columns are coming through Belgium on a front wider than anyone " +
      "here allowed for.\n\n" +
      (flags.gqg_opening === "shifted"
        ? "Formations were moved left before the frontier battles, and the left is " +
          "stronger than it would have been. It is still being outflanked."
        : "The attacks on the frontier took the divisions that the left would have wanted.") +
      "\n\nThe armies cannot be held where they stand, because the line is being turned. " +
      "They can be taken back in order, to a line from which they can fight again, and " +
      "a new army can be made from the divisions that Lorraine no longer needs.",
    context:
      "A retreat that is ordered keeps the army in one piece. One that is forced on " +
      "it by the enemy does not. The difficulty is to say so in a country that has " +
      "been told the frontier battles were going well.",
    choices: [
      {
        id: "withdraw",
        label: "Order the withdrawal of the armies and form a new army on the left",
        historical: true,
        advisor: { name: "Joffre", position:
          "A battle lost with the armies destroyed ends the war. A retreat in order only postpones the battle." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_retreat: "ordered" },
        next: "gqg_1914_13_sack",
        outcome:
          "General Instruction No. 2 goes out on 25 August. The armies are to fall back, " +
          "first to the Somme and later to the Marne, and a new Sixth Army is to be made up " +
          "by rail and assembled near Amiens. The withdrawal is long and hard, but the " +
          "armies come out of it in a shape to fight, and the Germans have to follow them " +
          "a long way from their railheads.",
      },
      {
        id: "stand",
        label: "Make a stand on the Sambre and the Meuse and fight where the armies are",
        gate: (m) => m.manpower >= -1,
        disabledReason: "The armies cannot take another battle on this line",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { gqg_retreat: "stand" },
        erodes: "costly_offensive",
        next: "gqg_1914_13_sack",
        outcome:
          "Speculative. No withdrawal is ordered, and the armies fight another battle " +
          "where they stand while the German right wing goes round them. If the line " +
          "holds, the army has kept its ground. If it does not, there is nothing behind " +
          "it to fall back on, and the Commander-in-Chief has lost the war's first " +
          "month's armies in a single afternoon, with the capital open behind them and " +
          "the government still in it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  gqg_1914_13_sack: {
    year: 1914, date: "1914-09-03", city: "Bar-sur-Aube",
    title: "The Generals Who Failed",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The retreat has gone on for ten days and several of the officers who were given " +
      "armies and corps in August have not been equal to them. The Fifth Army's " +
      "commander has argued with the Commander-in-Chief and with the British and has " +
      "told anyone who would listen that the plan was wrong.\n\n" +
      (flags.gqg_retreat === "stand"
        ? "The armies fought a battle they might have avoided, and the officers who lost it are the ones " +
          "now being asked to fight the next."
        : "The armies have come back in order, and the officers who brought them back are " +
          "among those the Commander-in-Chief is now weighing.") +
      "\n\nThe army was built on the belief that the attack would win the war, and the " +
      "officers promoted by that belief are the ones it failed. Removing them says that " +
      "the doctrine failed too.",
    context:
      "A Commander-in-Chief who sacks a general during a retreat takes the " +
      "responsibility for the replacement. The man who is put in may do no better, and " +
      "the army will watch what happens to the next one.",
    choices: [
      {
        id: "relieve",
        label: "Relieve the commanders who have failed, by name and at once",
        historical: true,
        advisor: { name: "Joffre", position:
          "An officer who cannot carry out the plan has to be replaced by one who can, and the army needs to see that it is done." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_sack: "relieved" },
        next: "gqg_1914_02_marne",
        outcome:
          "Lanrezac is relieved of the Fifth Army on 3 September and replaced by Franchet " +
          "d'Esperey. In the first months of the war three army commanders, ten corps " +
          "commanders and thirty-eight division commanders are removed, and officers such " +
          "as Foch, Petain and Nivelle rise to fill their places. The army learns that " +
          "failure costs a command, and the officers who remain act as men who know it.",
      },
      {
        id: "keep",
        label: "Keep the commanders in place and send staff officers to correct them",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_sack: "kept" },
        next: "gqg_1914_02_marne",
        outcome:
          "Speculative. The commanders stay, with officers from General Headquarters " +
          "beside them to see that the orders are carried out. Nobody is publicly " +
          "blamed, and the army keeps the leaders it has. The orders arrive at the " +
          "armies through two channels, and in the first week of September both are " +
          "needed. The army does not learn that failure costs a command, and the " +
          "officers who failed in August are still giving orders in the battle that " +
          "comes.",
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
          "and attack tomorrow. Whether they can is a question about men, not maps.") +
      (flags.gqg_sack === "relieved"
        ? "\n\nThe commanders who were not equal to August are gone, and the men who " +
          "replaced them were chosen for the moment that has come."
        : flags.gqg_sack === "kept"
          ? "\n\nThe commanders who were not equal to August are still in their commands."
          : ""),
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
        setFlags: { gqg_marne: "attacked", xc_marne_french: "attacked" },
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
            next: "gqg_1914_14_race",
            outcome:
              "The armies turn. The gap between the German First and Second Armies opens " +
              "and is exploited, and the invasion stops short of the decision it needed. " +
              "The war that follows is a different war from the one everyone prepared for, " +
              "and it will last four years. The French army that attacks on the Marne is " +
              "exhausted, short of shells and not sure of its own success, and does not " +
              "know until days afterwards that it has won." },
          { weight: 35, title: "The counterattack is contained and the line settles further south",
            impact: { manpower: -1, will: -1 },
            setFlags: { gqg_marneResult: "contained" },
            next: "gqg_1914_14_race",
            outcome:
              "Speculative. The turn is made and does not achieve the separation it needed. " +
              "The invasion is stopped, later and further south, and the line that congeals " +
              "runs across more of France than it historically did. The government is back " +
              "in Bordeaux, and Paris is shelled. The army has fought a great battle and " +
              "kept the capital, and has to explain to the country why it is still giving " +
              "up villages." },
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
        setFlags: { gqg_marne: "delayed", xc_marne_french: "delayed" },
        next: "gqg_1914_14_race",
        outcome:
          "Speculative. The withdrawal continues past the Marne and the flank closes. " +
          "The army is in better condition and the ground behind it is French, and " +
          "there is markedly less of it. The Germans reach the Seine, and the capital " +
          "is invested or abandoned. The Commander-in-Chief has kept his army in being " +
          "and lost the chance the Military Governor of Paris was pressing on him, " +
          "which does not come back.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  gqg_1914_14_race: {
    year: 1914, date: "1914-09-24", city: "Chatillon-sur-Seine",
    title: "To the Sea",
    advisors: ["joffre", "foch"],
    situation: (flags) =>
      "The Germans have been stopped on the Marne and have dug in on the Aisne, and " +
      "the French attacks on the Aisne have not moved them. " +
      (flags.gqg_marneResult === "contained"
        ? "The line stopped further south than it might have, and there is less ground to work with."
        : "The line is where the armies stopped them, and it is open at the north.") +
      "\n\nNeither side has a flank it can turn except in the north, between the Oise and " +
      "the sea. Whoever extends the line first with fresh troops can outflank the other " +
      "on that side, and both headquarters have seen it. The French Second Army, under " +
      "Castelnau, is being brought from Lorraine to do it.",
    context:
      "Each attempt to turn the flank is answered by an attempt to turn the new flank, and " +
      "the line grows by the length of the extension. The ports and the coalfields lie " +
      "at its end.",
    choices: [
      {
        id: "extend",
        label: "Bring the Second Army north and keep extending the left toward the sea",
        historical: true,
        advisor: { name: "Joffre", position:
          "The north is open and the Channel ports and the mines lie in it. Whoever gets there first keeps them." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { gqg_race: "extended" },
        next: "gqg_1915_03_grignotage",
        outcome:
          "Castelnau's Second Army forms south of Amiens and begins to advance on 22 " +
          "September, with the Sixth Army alongside from the 23rd. When the Germans arrive " +
          "at Arras, Joffre detaches the northern part of the Second Army as a new Tenth Army " +
          "and puts both under Foch, who from 5 October forbids a retirement from the town. " +
          "Neither side turns the other's flank. By the middle of October the line runs to " +
          "the sea.",
      },
      {
        id: "dig",
        label: "Stop manoeuvring and dig in along the Aisne",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_race: "dug" },
        next: "gqg_1915_03_grignotage",
        outcome:
          "Speculative. The Second Army stays in Lorraine and the left wing is not " +
          "extended. The line is shorter, and the north is open to the German army for " +
          "as long as it takes the Allies to close it. The Channel ports and the " +
          "coalfields are within reach of an enemy that has just been stopped, and the " +
          "British, who are moving north themselves, find the ground they meant to hold " +
          "already contested, with no French army beside them to share it.",
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
        next: "gqg_1915_14_salonika",
        outcome:
          "Artois and Champagne are fought and the second position holds both times. " +
          "The line moves by yards. The cost is entered in a ledger that the Chamber " +
          "will eventually read, and the soldiers who go forward in the autumn go with " +
          "no illusion left about what the first day will give them. The occupied " +
          "departments are no nearer, and the Commander-in-Chief has no other policy to " +
          "put in place of the one that has not worked.",
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
        next: "gqg_1915_14_salonika",
        outcome:
          "Speculative. The offensives are scaled to the artillery available. The army " +
          "enters 1916 stronger and the government enters it having explained for " +
          "twelve months why nothing was attempted. The enemy fortifies the occupied " +
          "departments undisturbed, and the British, who have begun raising their great " +
          "army, are told that the French have decided to wait for them. Whether the " +
          "alliance can bear a French year of waiting is the question.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-10
  gqg_1915_14_salonika: {
    year: 1915, date: "1915-10-05", city: "Chantilly",
    title: "Divisions for the Balkans",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "Bulgaria has signed with the Central Powers and German, Austro-Hungarian and " +
      "Bulgarian armies are about to attack Serbia. The French government has decided " +
      "to send troops to Salonika to support Serbia.\n\n" +
      "General Joffre regards the expedition as a diversion of divisions from the " +
      "front in France. " +
      (flags.gqg_1915 === "limited"
        ? "The army has been building its artillery rather than attacking, and divisions are available."
        : "The divisions are being used in Champagne, where the autumn offensive is being fought.") +
      "\n\nThe officer proposed to command the force is General Sarrail, whom Joffre " +
      "dismissed from the Third Army in July. Sarrail has friends in the Chamber, and " +
      "the government would rather not quarrel with them.",
    context:
      "The expedition is a political decision. The generals are being asked to carry out " +
      "an operation they did not choose, from forces they were planning to use elsewhere.",
    choices: [
      {
        id: "send",
        label: "Carry out the government's decision and detach divisions for Salonika",
        historical: true,
        advisor: { name: "Joffre", position:
          "A division in the Balkans is a division that is not in France. I have said so, and I will do what the government decides." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { gqg_salonika: "sent" },
        next: "gqg_1915_15_chantilly",
        outcome:
          "The first Allied troops land at Salonika on 5 October, and Sarrail arrives on " +
          "the 12th to command them. They are too late and too few to save Serbia, whose " +
          "army and many civilians withdraw through the mountains of Albania in the winter. " +
          "The force stays at Salonika as the Army of the Orient for the rest of the war, " +
          "and for the rest of the war it is argued about.",
      },
      {
        id: "refuse",
        label: "Decline to detach divisions and keep every formation on the western front",
        gate: (m) => m.will >= 0,
        disabledReason: "The command cannot refuse a decision of the government and keep its place",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_salonika: "refused" },
        next: "gqg_1915_15_chantilly",
        outcome:
          "Speculative. No force is sent, or one too small to matter. The divisions " +
          "stay in France, and the government has been told by its general that he will " +
          "not carry out what it decided. Serbia is left to the armies that invade it. " +
          "The ministry and the Chamber, which have been trying for months to bring the " +
          "Commander-in-Chief under their authority, are given the best reason they " +
          "have yet had for doing it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-12
  gqg_1915_15_chantilly: {
    year: 1915, date: "1915-12-06", city: "Chantilly",
    title: "Everyone Attacks at Once",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The Allies attacked separately in 1915, each when it could, and the Germans " +
      "moved their reserves from one front to the other on interior lines and met each " +
      "attack in turn. " +
      (flags.gqg_1915 === "limited"
        ? "The French army spent the year building its guns instead of attacking, so the " +
          "argument is made from a position of less loss."
        : "The French army attacked in Artois and Champagne at heavy cost.") +
      "\n\nThe Commander-in-Chief has called a conference at General Headquarters of the " +
      "military representatives of France, Britain, Russia, Italy and Serbia. His proposal " +
      "is to attack on every front at about the same time in 1916, so that the Germans " +
      "cannot move their reserves from one to the other.",
    context:
      "Coordination is easy to agree and hard to carry out. It binds the French army to " +
      "a date set with allies who have their own difficulties, and the date will arrive " +
      "whatever has happened to the French army by then.",
    choices: [
      {
        id: "combined",
        label: "Propose simultaneous offensives on every front in 1916",
        historical: true,
        advisor: { name: "Joffre", position:
          "Separate attacks lose to interior lines. If every front pushes at once, the Germans cannot answer all of them." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_chantilly: "combined" },
        next: "gqg_1916_04_verdun",
        outcome:
          "The conference of 6 to 8 December unanimously supports the proposal. The " +
          "French, British, Russian and Italian armies are to attack together in 1916, " +
          "and the Franco-British share is to be on the Somme. It is a plan that depends " +
          "on all four armies being ready in the same summer, and it is made two months " +
          "before the Germans attack at Verdun.",
      },
      {
        id: "free",
        label: "Keep French freedom of action and attack when and where the army chooses",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_chantilly: "free" },
        next: "gqg_1916_04_verdun",
        outcome:
          "Speculative. The conference ends without a fixed scheme for 1916. Each army " +
          "plans its own campaign, and the French army is free to choose its time and " +
          "place. The Germans keep the advantage of interior lines, and the French keep " +
          "the freedom to refuse a battle that has been fixed in advance. The Russians " +
          "and the Italians, who came to be told when to attack, go home without a " +
          "date, and the British wonder what the French will do alone.",
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
    situation: (flags) =>
      "The guns were taken out of the Verdun forts and sent to the field army, which " +
      "was defensible when the sector was quiet and is now the situation. The Germans " +
      "are attacking into a fortress zone that is a fortress mainly on the map.\n\n" +
      "There is a case for shortening the line, giving up the east bank, and refusing " +
      "the battle on ground of the enemy's choosing. It is militarily coherent. It " +
      "would also mean announcing that Verdun has been abandoned, and no government in " +
      "France survives that announcement." +
      (flags.xc_naroch === "refused" ? "\n\nJoffre has asked the Russians for an offensive and been told that it will come with the others in the summer, not before. Until then the Germans can take what they need from the east." : ""),
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
          "has personally been to Verdun by 1917. The cost in men is terrible, and " +
          "spread across the army rather than falling on a few divisions, so the army " +
          "that comes out is not the army that went in.",
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
          "authorised it does not last the spring. The fortress, which stood for the " +
          "whole nation, is given up without the defence it expected, and the country " +
          "learns of it from a communiqué. What the Germans take cheaply they hold, and " +
          "the symbol they were seeking is theirs.",
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
      "for the remaining years of the war." +
      (flags.xc_chantilly === "declined" ? "\n\nThe Russian representative at Chantilly gave no date for an offensive in the east, and the Somme is the only combined blow the Allies are certain to make." : ""),
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
        next: "gqg_1916_14_douaumont",
        outcome:
          "The French share of the Somme is smaller than promised and is made. Pressure " +
          "comes off Verdun, where the Germans have to send their reserves north, and " +
          "the alliance holds, with the British learning to attack at the cost of their " +
          "volunteer army. The ledger grows. The French divisions on the Somme take " +
          "ground on the southern flank and are not asked to do the impossible, but " +
          "they are asked to do it a second time within the year.",
      },
      {
        id: "defer",
        label: "Defer the French contribution and let the British attack alone",
        advisor: { name: "Joffre", position:
          "We cannot fight two battles of this size in one summer. One of them has to be someone else's." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_somme: "deferred" },
        next: "gqg_1916_14_douaumont",
        outcome:
          "Speculative. The British attack on the Somme substantially alone. Divisions " +
          "are preserved. What is spent instead is the assumption, on the other side of " +
          "the Channel, that France will be there when the plan says so. The British " +
          "army, which has raised its great force for this battle, takes the first " +
          "day's losses without a French attack beside it, and the alliance is asked " +
          "how the plan agreed at Chantilly came to be kept by one partner only.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-10
  gqg_1916_14_douaumont: {
    year: 1916, date: "1916-10-21", city: "Verdun",
    title: "Taking Back the Fort",
    advisors: ["petain", "mangin", "joffre"],
    bulletin: {
      voice: "gqg", date: "1916-10-20", source: "Communique officiel",
      text:
        "Artillery activity on the right bank of the Meuse is reported at the normal " +
        "level for the season. The situation is unchanged.",
    },
    situation: (flags) =>
      "Fort Douaumont has been in German hands since 25 February, and Fort Vaux since " +
      "June. The German army has not been able to go on at Verdun since the summer, and " +
      "the French army holds the line in front of both forts.\n\n" +
      (flags.gqg_verdun === "shortened"
        ? "The east bank was given up in February, and the forts lie in ground the army " +
          "would have to retake before it could think of taking them."
        : "Both banks were held, by rotation, and most of the army has been through the " +
          "sector.") +
      "\n\nGeneral Mangin, who commands the part of the line from Fleury to the Meuse, " +
      "proposes to retake Douaumont with three divisions behind a creeping barrage after " +
      "a bombardment of several days. It would be the first French attack at Verdun that " +
      "was meant to win ground rather than to hold it.",
    context:
      "An attack that succeeds at Verdun would be worth more in the country than in " +
      "the line. One that fails would cost divisions the army has been trying to rest.",
    choices: [
      {
        id: "retake",
        label: "Authorise Mangin's attack to retake Douaumont",
        historical: true,
        advisor: { name: "Mangin", position:
          "The fort can be taken back if the guns do their work first and the infantry stays close behind the barrage." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { gqg_douaumont: "retaken" },
        next: "gqg_1916_06_nivelle",
        outcome:
          "The bombardment begins on 21 October and the infantry goes forward on the 24th. " +
          "By the evening Douaumont is French again and some six thousand prisoners have " +
          "been taken, and Vaux follows by 2 November. A second blow on 15 December pushes " +
          "the line back almost to where it stood in February, with more than eleven " +
          "thousand prisoners. The army that had been told to hold at Verdun now knows it can also " +
          "take ground there.",
      },
      {
        id: "wait",
        label: "Stay on the defensive at Verdun and keep the divisions for the spring",
        gate: (m) => m.will >= 0,
        disabledReason: "Another winter with the forts in German hands cannot be explained to the country",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_douaumont: "waited" },
        next: "gqg_1916_06_nivelle",
        outcome:
          "Speculative. No attack is made. The divisions are rested and the shells are " +
          "kept for the spring, and the forts stay where they are through the winter. " +
          "The Commander-in-Chief goes into December without the success that would " +
          "have helped him to keep his command, and the ministers who are looking for a " +
          "reason to replace him are given an empty autumn to put in front of the " +
          "Chamber. The soldiers at Verdun spend another winter looking at Douaumont.",
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
        next: "gqg_1917_12_calais",
        outcome:
          "Nivelle takes the command in December. Lyautey leaves the war ministry " +
          "rather than sign the plan, and is replaced in March by Painleve, who is no " +
          "more convinced but stays to argue. The army is told that the rupture will " +
          "take forty-eight hours, and it believes what it is told, because it has been " +
          "waiting two and a half years to be told it. The promise that is made is the " +
          "one that will be broken, in front of the soldiers.",
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
        next: "gqg_1917_12_calais",
        outcome:
          "Speculative. The limited-objective doctrine takes the top command a year " +
          "early. There is no forty-eight hour promise to fail, and no government " +
          "receives the victory it was told to expect. The politicians who wanted a " +
          "decisive result get a patient general, and a patient general is the one the " +
          "Chamber has not been asking for. The army avoids the Aisne, and has to find " +
          "out whether the waiting is bearable without a miracle in prospect.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-02
  gqg_1917_12_calais: {
    year: 1917, date: "1917-02-26", city: "Calais",
    title: "The British Under a French General",
    advisors: ["nivelle", "lyautey"],
    situation: (flags) =>
      "The conference at Calais is ostensibly about the railways that will carry the " +
      "spring offensive. In practice it is about command. Lloyd George, with the " +
      "approval of the British war cabinet, proposes that for the duration of the " +
      "offensive the British army should be placed under Nivelle's direction. He has " +
      "not told Haig or Robertson.\n\n" +
      "Nivelle's plan depends on the British attack at Arras and on a single will " +
      "directing both armies. He has argued for it since taking the command, and the " +
      "British prime minister is offering it to him." +
      (flags.xc_calais === "refused" ? "\n\nThe British Commander-in-Chief and the Chief of the Imperial General Staff have already told London that they will not serve under a French general, and Nivelle has to settle how far he can go without them." : ""),
    context:
      "A subordination that is carried out against the wishes of the commander subordinated " +
      "does not stay carried out. Whatever is agreed here will be argued over the next day.",
    choices: [
      {
        id: "accept",
        label: "Accept the British army under Nivelle's direction for the offensive",
        historical: true,
        advisor: { name: "Nivelle", position:
          "Two armies attacking the same line must be one instrument for as long as the attack lasts." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_calais: "subordinated" },
        next: "gqg_1917_07_chemin",
        outcome:
          "By the Calais agreement of 27 February Haig is formally subordinated to Nivelle for " +
          "the duration of the offensive. The next day Haig and Robertson tell Lloyd George " +
          "they will resign rather than carry it out, and the arrangement is watered down " +
          "with more freedom for the British commander. The conference leaves mistrust " +
          "between the British government and its generals, and it sets back the case for " +
          "unified command until the spring of 1918.",
      },
      {
        id: "agreement",
        label: "Decline the subordination and coordinate with Haig by agreement",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_calais: "agreement" },
        next: "gqg_1917_07_chemin",
        outcome:
          "Speculative. No arrangement is made over the British commander's head. The " +
          "two armies coordinate by agreement between headquarters, as they have since " +
          "1914, and the offensive is fitted to what Haig will agree to. Nivelle goes " +
          "into the spring with the plan he proposed and less control over the part " +
          "that was to be British. The generals keep their authority over their own " +
          "armies, and the politicians who wanted to supervise them are left with " +
          "nothing to supervise.",
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
      "the ridge pay for the promise." +
      (flags.xc_petrograd === "promised" ? "\n\nThe Allied missions at Petrograd were given a date for a Russian offensive in the spring, and the staff in Paris expects it in the east in these same weeks. An attack stopped here is stopped while the Allies have been told to expect two." : ""),
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
            next: "gqg_1917_13_directive",
            outcome:
              "The offensive is halted on 9 May having taken ground and not the ridge, at a " +
              "cost around a hundred and eighty-seven thousand French casualties. What " +
              "follows is not a collapse of the front. Units refuse to move up to attack " +
              "while continuing to hold the line they are in, and it spreads. The men are " +
              "not deserting. They are bargaining, over leave, food and the promise that no " +
              "one will be sent forward like that again." },
          { weight: 40, title: "Indiscipline stays local and is contained",
            impact: { will: -1 },
            setFlags: { gqg_mutinyScale: "contained" },
            next: "gqg_1917_13_directive",
            outcome:
              "Speculative. Refusals appear in the divisions worst used and do not " +
              "propagate beyond them. The crisis is real, smaller, and survivable without a " +
              "change of doctrine. The command punishes a few units and moves on, and the " +
              "lesson that the army cannot be asked for another rupture is learned in a few " +
              "places rather than across the whole front. The Commander-in-Chief who made " +
              "the promise is blamed for the failure and not for the army's condition." },
        ],
      },
      {
        id: "halt",
        label: "Halt at the undertaking given — stop the offensive",
        advisor: { name: "Painleve", position:
          "The promise was forty-eight hours. It is the third day. There is nothing further to discuss." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { gqg_chemin: "halted", gqg_mutinyScale: "contained" },
        next: "gqg_1917_13_directive",
        outcome:
          "Speculative. The attack is broken off on the undertaking that was given. The " +
          "army is told the truth on the third day rather than the twenty-third, and " +
          "the commander who made the promise has to survive having kept it. The " +
          "casualties are fewer, and the army that comes out of April is angry with its " +
          "general and not yet with its government. Whether that difference is enough " +
          "to prevent the refusals is something no one can say.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-05
  gqg_1917_13_directive: {
    year: 1917, date: "1917-05-19", city: "Compiegne",
    title: "Battles That Can Be Won",
    advisors: ["petain", "painleve"],
    situation: (flags) =>
      "Petain has been Commander-in-Chief for four days. Nivelle has gone, and Foch is " +
      "Chief of the General Staff. " +
      (flags.gqg_chemin === "halted"
        ? "The offensive was stopped at the undertaking the government had been given."
        : "The offensive went on past the forty-eight hours it was supposed to run.") +
      " Units have begun to refuse orders to go back to the line.\n\n" +
      "What the army is to be asked to do this summer has to be decided before anything " +
      "else, because every plan depends on it. One school wants a great offensive kept " +
      "in view, so that the army and the Allies see that France still intends to attack. " +
      "The other holds that the army can do no more than attacks with limited " +
      "objectives, where the guns do the work and the infantry stops at what it has " +
      "taken." +
      (flags.xc_usw === "restricted" ? "\n\nThe Americans are not in the war and will not be, which leaves the recovery of the army to France's own resources alone." : ""),
    context:
      "The remedy for the army has several parts, and leave and the hearing of " +
      "grievances are the part the soldiers will notice. The directive is the part the " +
      "staff will read.",
    choices: [
      {
        id: "limited",
        label: "Issue the directive: limited objectives only, until the army has recovered",
        historical: true,
        advisor: { name: "Petain", position:
          "The army must be given battles it can win, with the guns doing most of the work. It cannot be given another rupture to attempt." },
        impact: { manpower: 1, munitions: 0, will: 1 },
        setFlags: { gqg_directive: "limited" },
        next: "gqg_1917_08_mutinies",
        outcome:
          "Directive No. 1 is dated 19 May. It sets out the method of limited-objective " +
          "attacks, on narrow fronts and with the guns doing most of the work, and it " +
          "ends the plan for a breakthrough. Other directives follow on the use of the " +
          "tanks and aircraft that are reaching the front. It is the part of the remedy " +
          "that the staff will read, and the army will judge it by whether the " +
          "attacks it describes are made as described.",
      },
      {
        id: "offensive",
        label: "Keep a great offensive in preparation for the summer",
        gate: (m) => m.will >= -2,
        disabledReason: "An army in this condition cannot be ordered to prepare another great offensive",
        impact: { manpower: -2, munitions: -1, will: -1 },
        setFlags: { gqg_directive: "offensive" },
        erodes: "costly_offensive",
        next: "gqg_1917_08_mutinies",
        outcome:
          "Speculative. The army is told to prepare for another attempt in the summer. " +
          "Units that have refused to return to the line are asked to prepare to " +
          "attack, and the grievances that sent them there are still there when the " +
          "order arrives. The new Commander-in-Chief has promised the soldiers that " +
          "they will not be used as they were in April, and breaks the promise within a " +
          "month. The army, which has been counting on him, decides what to make of it.",
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
          "what most accounts credit with ending the crisis in six weeks. A command " +
          "that offers nothing and punishes everything has asked an army that is " +
          "bargaining to choose between bargaining and breaking, and the army has not " +
          "yet chosen.",
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
          "information is no longer a military question. The ministers who read it have " +
          "to decide whether to tell the Chamber, the Allies or the enemy, and each " +
          "choice is a political risk. The Commander-in-Chief has declared that he " +
          "cannot do what he was appointed to do, and has handed the decision to " +
          "someone else.",
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
        next: "gqg_1918_12_link",
        outcome:
          "The fort and village are taken and the operation stops on its objective. The " +
          "Germans give up the remainder of the ridge and go back across the Ailette. " +
          "The cost is a fraction of April's and the ground is greater. The army " +
          "notices, which is the point of it. The soldiers who were promised battles " +
          "they could win are given one, and a French attack does what the staff said " +
          "it would.",
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
        next: "gqg_1918_12_link",
        outcome:
          "Speculative. The attack goes past the line it announced. Whatever ground " +
          "that gains, it costs the one thing the summer was spent rebuilding: the " +
          "army's belief that when this command names a limit, the limit is real. The " +
          "divisions that were told they would stop on the objective find themselves " +
          "ordered to go on, and the officers who gave them the promise have to decide " +
          "whether to carry out the order or to tell them the truth.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  gqg_1918_12_link: {
    year: 1918, date: "1918-03-24", city: "Dury",
    title: "Which Way to Fall Back",
    advisors: ["petain", "clemenceau"],
    situation:
      "The German offensive opened on the British Fifth and Third Armies on 21 March, " +
      "and the British are being driven back. Haig asked Petain on the first evening for " +
      "three divisions, and the French Fifth Corps was sent. On the 22nd he asked for " +
      "three more and Petain ordered the Third Army forward. Haig now asks for twenty " +
      "divisions at Amiens.\n\n" +
      "Petain is afraid that the attack on the British is a diversion and that the " +
      "main blow will fall on the French in Champagne. By Haig's account, the " +
      "government has told him to cover Paris. If the British keep falling back, the French will have to choose " +
      "between staying in contact with them and covering the capital, and the two lie " +
      "in different directions.",
    context:
      "Each army has a line of retreat that it cannot give up. They diverge, and the " +
      "gap between them is where the Germans are going.",
    choices: [
      {
        id: "reserve",
        label: "Put two armies in reserve in the Somme valley and refuse the twenty divisions",
        historical: true,
        advisor: { name: "Petain", position:
          "I can give what I can spare. I cannot strip Champagne and the road to Paris on the strength of one attack." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_link: "reserve" },
        dispute:
          "The account of the meeting at Dury on the evening of 24 March comes mainly " +
          "from Haig's diary and reports, in which Petain, back from a Cabinet meeting " +
          "at which he had been told to cover Paris, says he may have to break contact with " +
          "the British. French accounts and later historians differ about whether he " +
          "threatened it or only explained the limits that the government's order and " +
          "the risk in Champagne put on him. What is not disputed is that he placed two " +
          "armies under Fayolle in reserve in the Somme valley and that he refused the " +
          "twenty divisions.",
        next: "gqg_1918_10_doullens",
        outcome:
          "Two French armies under Fayolle are placed in reserve in the Somme valley, and " +
          "Petain presses the British Fifth Army to keep in touch with the French Fifth " +
          "Corps on its right. The twenty divisions are not sent. Haig comes away believing " +
          "that the French may let the link go to cover Paris. The question of a single " +
          "commander for both armies is put at Doullens two days later.",
      },
      {
        id: "allin",
        label: "Send the whole reserve north to keep contact with the British at once",
        gate: (m) => m.manpower >= -3,
        disabledReason: "There is not the reserve to cover both the link and Paris",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { gqg_link: "allin" },
        erodes: "costly_offensive",
        next: "gqg_1918_10_doullens",
        outcome:
          "Speculative. Every division that can be moved goes north, and the junction " +
          "with the British holds. Champagne and the road to Paris are left to what " +
          "remains. If the main blow falls there, the French army has nothing to meet " +
          "it with, and the government that told its general to cover the capital has " +
          "to decide what it meant. If the blow does not fall there, the " +
          "Commander-in-Chief has won, and no one will know how near he came to losing.",
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
    situation: (flags) =>
      "The German offensive has opened a gap on the British front and the two armies " +
      "are being pushed apart. Each has a line of retreat, and the two lines diverge: " +
      "the British toward the Channel ports, the French toward Paris. Followed " +
      "separately, they lose the war between them without either being beaten.\n\n" +
      "Holding them together requires one authority over both, which means a French " +
      "commander accepting that his armies can be committed by someone other than " +
      "himself, or a British one accepting the same. Nobody has been willing to concede " +
      "this in three and a half years." +
      (flags.gqg_link === "reserve"
        ? "\n\nTwo French armies are in reserve in the Somme valley, and Haig has been told " +
          "that the French may not be able to keep the link."
        : flags.gqg_link === "allin"
          ? "\n\nThe French reserve has gone north to keep the link, and Champagne is open."
          : ""),
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
        attested: { by: "Foch", text: "I would fight in front of Amiens. I would fight in Amiens.",
          source: "At Doullens, 26 March 1918, as recorded" },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_command1918: "unified", xc_command1918: "unified" },
        next: "gqg_1918_13_aisne",
        outcome:
          "Coordinating authority over the Allied armies goes to Foch, and grows into " +
          "general command. The two retreats become one defence. What has been given up " +
          "is the independence of the French command, and it is not given back. Petain " +
          "goes on commanding the French armies, and Foch decides where they and the " +
          "British will fight. Haig accepts the arrangement, because he is losing, and " +
          "the arrangement lasts because it works.",
      },
      {
        id: "national",
        label: "Keep national command and coordinate by agreement",
        advisor: { name: "Petain", position:
          "I will not have French divisions committed to cover a British withdrawal by a man who does not answer to France." },
        gate: (m) => m.will >= -2,
        disabledReason: "The crisis is past the point where coordination by agreement can be defended",
        attested: { by: "Clemenceau", text: "Je fais la guerre.",
          source: "Speech to the Chamber, 8 March 1918" },
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { gqg_command1918: "national", xc_command1918: "national" },
        erodes: "costly_offensive",
        nextIf: (m) => (m.manpower <= -6 ? "gqg_end_coalitionfails" : null),
        next: "gqg_1918_13_aisne",
        outcome:
          "Speculative. Command stays national and coordination stays a matter of " +
          "agreement between headquarters that disagree. The gap between the two armies " +
          "is now a matter of goodwill under artillery fire. Each commander commits his " +
          "reserves according to his own judgment of his own danger, and each is right " +
          "to do so. The two retreats go on diverging, and the Germans, who have been " +
          "looking for exactly that, are given the time to find it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-05
  gqg_1918_13_aisne: {
    year: 1918, date: "1918-05-26", city: "Provins",
    title: "The Front Line Is Full",
    advisors: ["petain", "foch"],
    situation: (flags) =>
      "A German attack is expected between Reims and Soissons, and the Chemin des Dames, " +
      "where the offensive of 1917 was fought, is a sector likely to take it. " +
      (flags.gqg_command1918 === "unified"
        ? "There is a single Allied command now, and Foch is directing reserves from one end of the front to the other."
        : "The two commands are coordinating, and the reserves are where each put them.") +
      "\n\nPetain's order is defence in depth: a lightly held front line, and the battle " +
      "fought behind it, out of reach of the guns. The commander of the Sixth Army, " +
      "General Duchene, does not accept it. He has packed his divisions into the front " +
      "line, because he is not willing to give up an inch of French ground without a " +
      "fight.",
    context:
      "An army commander who disobeys his orders on the eve of the battle cannot easily " +
      "be replaced before it begins. The man who replaces him will not know the ground.",
    choices: [
      {
        id: "leave",
        label: "Leave the Sixth Army's dispositions as its commander has made them",
        historical: true,
        advisor: { name: "Petain", position:
          "The order is clear, and I have given it. Whether it is being carried out is for the army commander to answer for." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { gqg_aisne: "forward" },
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "The bombardment on 27 May falls on a front line packed with men. The line " +
          "breaks, and the Germans cross the Aisne and take nineteen kilometres in " +
          "three days, with Paris within their reach. Duchene is relieved of his " +
          "command by Clemenceau on 9 June. The order that would have prevented it had " +
          "been given, and not obeyed. The army learns again what a bombardment does to " +
          "a trench that is full, and the lesson costs it a great many men.",
      },
      {
        id: "depth",
        label: "Enforce defence in depth and have the front line thinned before the attack",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_aisne: "depth" },
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "Speculative. The front line is cleared of all but a screen, and the " +
          "divisions are moved back behind the ridge. The bombardment falls on little " +
          "and the attack still comes and still gains ground, but it comes on into " +
          "depth, and the army is not broken on the first morning. Duchene is told to " +
          "carry out an order he has publicly despised, and may do so unwillingly. " +
          "Whether the battle behind the ridge would have held is something the record " +
          "cannot show.",
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
      "months ago." +
      (flags.gqg_aisne === "forward"
        ? "\n\nThe Aisne broke on 27 May, and the salient this attack is aimed at is the one that " +
          "came out of it."
        : flags.gqg_aisne === "depth"
          ? "\n\nThe German attack in May went in against a front held in depth, and it gained " +
            "less ground than it might have."
          : ""),
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
        nextIf: (m) => (m.will <= -6 ? "gqg_end_armybreaks" : null),
        next: "gqg_1918_14_americans",
        uncertain: [
          { weight: 70, title: "The initiative changes hands and does not change back", historicalBranch: true,
            impact: { will: 1 },
            setFlags: { gqg_1918Result: "turned" },
            outcome:
              "The counterattack goes in out of the forest and the salient begins to close. " +
              "The initiative changes hands and does not change back. From here the " +
              "fighting is continuous, and it is going one way. The Germans, who have " +
              "attacked five times since March, find themselves counting divisions they do " +
              "not have, and the army that would not attack fourteen months ago goes " +
              "forward behind its tanks and its guns with something close to confidence." },
          { weight: 30, title: "The blow lands on an enemy already withdrawing",
            impact: { manpower: -1 },
            setFlags: { gqg_1918Result: "coincided" },
            outcome:
              "Speculative. The reserve is committed against a salient that was being given " +
              "up regardless. The ground comes back and the last fresh divisions in France " +
              "are spent taking what was going to be evacuated. The credit goes to the " +
              "Commander who gave the order, and the cost is borne by the divisions that " +
              "carried it out. The Allied armies will go on attacking, but they will do so " +
              "with fewer fresh troops than they would have had if the blow had waited." },
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
          "taking it was the thing declined. The army that has been rebuilt since 1917 " +
          "is kept as a reserve rather than spent as an instrument, and the Germans are " +
          "left to fall back on their own schedule, with their own divisions, and to " +
          "find a new line, which they do.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  gqg_1918_14_americans: {
    year: 1918, date: "1918-09-02", city: "Bombon",
    title: "An American Army, or American Divisions",
    advisors: ["foch", "petain"],
    situation:
      "The American First Army is preparing to attack the Saint-Mihiel salient. On 30 " +
      "August Foch told Pershing that the attack should be reduced to little more than a " +
      "demonstration, and that two thirds of the First Army's troops should be given to " +
      "Haig and to the French generals to be used where the fighting is.\n\n" +
      "Pershing will not accept it. He has said throughout that the Americans will fight " +
      "as an army. The French and British armies are tired, and every American division " +
      "that is put into their lines is a division they do not have to find.",
    context:
      "An army fights better under its own commander, in its own sector. A division " +
      "that is lent can be used at once, and lent divisions go where they are needed.",
    choices: [
      {
        id: "army",
        label: "Back Pershing: an American army with its own sector in the Meuse and the Argonne",
        historical: true,
        advisor: { name: "Petain", position:
          "The Americans will do more as an army with a front of their own than as battalions scattered through other armies." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_americans: "army" },
        next: "gqg_1918_15_grand",
        outcome:
          "On 2 September Petain and Pershing meet Foch. Supported by Petain, Pershing " +
          "offers to take responsibility for the whole sector from Pont-a-Mousson, " +
          "through the valley of the Meuse, to the Argonne forest, and the dispute is " +
          "resolved on that basis. The American First Army pinches out the Saint-Mihiel " +
          "salient on 12 September and moves to attack in the Meuse-Argonne. The tired " +
          "armies of the Allies get a new ally that fights under its own flag.",
      },
      {
        id: "split",
        label: "Hold to the plan: distribute the American divisions among the Allied armies",
        advisor: { name: "Foch", position:
          "The battle is where the fighting is, and the divisions should be used there. A demonstration at Saint-Mihiel is worth less than that." },
        gate: (m) => m.will >= -2,
        disabledReason: "The coalition cannot take another quarrel over the American army",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_americans: "split" },
        next: "gqg_1918_15_grand",
        outcome:
          "Speculative. The American divisions are put into the British and French " +
          "armies. The tired armies are reinforced at once, and the Americans fight in " +
          "other commanders' battles. The American government has said it will not " +
          "allow this to be done, and it has to be told the answer. The coalition has " +
          "gained the divisions and lost the goodwill of the one partner it cannot do " +
          "without, and the cost of that appears in the autumn.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  gqg_1918_15_grand: {
    year: 1918, date: "1918-09-12", city: "Bombon",
    title: "Everyone Into the Battle",
    advisors: ["foch", "petain"],
    situation: (flags) =>
      "The Americans have pinched out the Saint-Mihiel salient today. " +
      (flags.gqg_americans === "split"
        ? "The American divisions are in the Allied armies, and the Allied armies are the stronger for them."
        : "The American First Army stands on its own sector, and is about to attack on it.") +
      "\n\nSince July the Germans have been going back, and since 8 August the " +
      "British have been attacking at Amiens. Foch has a plan to put it all together: a " +
      "series of great attacks along the whole front, each aimed at cutting the " +
      "German lines of communication, so that the success of any one of them lets the " +
      "whole line advance.\n\n" +
      "The French army is asked to attack with the rest, and it is the army that was " +
      "nursed through the summer of 1917 that has to do it.",
    context:
      "A general offensive uses every reserve at the same time. If it fails, there is " +
      "nothing behind it, and the army has been told since May 1917 that it would not " +
      "be asked for a rupture again.",
    choices: [
      {
        id: "concentric",
        label: "Order the concentric offensives: four attacks from 26 September",
        historical: true,
        advisor: { name: "Foch", position:
          "A single attack the Germans can meet with their reserves. Four attacks on four fronts in four days they cannot meet at all." },
        impact: { manpower: -1, munitions: -1, will: 2 },
        setFlags: { gqg_grand: "concentric" },
        erodes: "costly_offensive",
        next: "gqg_1918_16_senlis",
        outcome:
          "The attacks open on 26 September with the Americans in the Meuse-Argonne, on " +
          "the 27th with the British First and Third Armies toward Cambrai, on the 28th in " +
          "Flanders, and on the 29th against the Hindenburg Line on the Saint-Quentin canal, " +
          "by the British Fourth Army and the French First. German reserves are pulled " +
          "across the whole front, and by the beginning of October it is giving way.",
      },
      {
        id: "limited",
        label: "Go on with limited attacks, one front at a time, and keep the army in hand",
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Allied governments will not accept an autumn without a general offensive",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_grand: "limited" },
        next: "gqg_1918_16_senlis",
        outcome:
          "Speculative. The attacks go on as they have since August, each on its own " +
          "front and its own date. The Germans can move their reserves from one to " +
          "another, and the winter comes with the line still on German ground. The " +
          "armies are spared the heavy cost of a general offensive and the Allied " +
          "governments are asked to explain a pause that the enemy does not take. The " +
          "war goes into 1919, as it was always going to.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  gqg_1918_16_senlis: {
    year: 1918, date: "1918-10-25", city: "Senlis",
    title: "What to Ask For",
    advisors: ["foch", "petain", "clemenceau"],
    situation:
      "The Germans have asked President Wilson for an armistice, and the Allied " +
      "governments have asked their generals what terms the armies need. Foch has " +
      "called a conference at Senlis and has put the question to each of the " +
      "commanders in turn.\n\n" +
      "Haig has urged moderation, telling the British government that the German army " +
      "is far from beaten. Petain's view is harder than Haig's. Pershing's is harder " +
      "than either: he would push the Germans back into Germany, so that the people at " +
      "home understand that their army has been beaten in the field.\n\n" +
      "The terms have to be strong enough that the Germans cannot go back to the war, " +
      "and not so strong that they refuse them.",
    context:
      "An armistice that leaves the German army on French ground and in good order is " +
      "an invitation to start again. One that is refused costs another winter.",
    choices: [
      {
        id: "bridgeheads",
        label: "Ask for the occupation of the Rhine bridgeheads and a heavy surrender of equipment",
        historical: true,
        advisor: { name: "Foch", position:
          "An armistice has to leave the Germans unable to resume the war. A line on the Rhine does that, and nothing less does." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_senlis: "bridgeheads" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "gqg_end_armybreaks"
          : (flags.gqg_command1918 === "national") ? "gqg_end_costlier"
          : (flags.gqg_mutinyResponse === "both" && m.manpower >= -3) ? "gqg_end_intact"
          : null,
        next: "gqg_end_victory",
        outcome:
          "With Clemenceau's agreement Foch takes the soldiers' views and then, acting " +
          "on his own authority as Allied commander, makes his own list of terms. The " +
          "armistice conditions include the occupation of strategic positions, with the " +
          "bridgeheads over the Rhine, so that the Allies hold military superiority " +
          "while the peace is made. The Germans, who asked for terms, are given " +
          "conditions that would make a resumption of the war impossible, and they " +
          "sign.",
      },
      {
        id: "moderate",
        label: "Ask for terms the German army can accept, as Haig urged",
        advisor: { name: "Haig", position:
          "The German army is far from beaten. Terms it cannot accept will be refused and the war will go on." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_senlis: "moderate" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "gqg_end_armybreaks"
          : (flags.gqg_command1918 === "national") ? "gqg_end_costlier"
          : (flags.gqg_mutinyResponse === "both" && m.manpower >= -3) ? "gqg_end_intact"
          : null,
        next: "gqg_end_victory",
        outcome:
          "Speculative. The terms asked for are those that the British commander " +
          "thought the German army could accept, with fewer demands for positions on " +
          "the Rhine. The armistice is easier to sign and gives the Allies less to hold " +
          "while the peace is made. The French, who want a frontier they can defend, " +
          "find that the terms leave Germany with an army, a river and a case that it " +
          "was never beaten in the field.",
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
      "The order to go back: " + (flags.gqg_retreat === "stand" ? "a stand on the Sambre and the Meuse." : "the withdrawal ordered on 25 August.") + "\n" +
      "The commanders: " + (flags.gqg_sack === "kept" ? "kept in place." : "the failures relieved.") + "\n" +
      "The race to the sea: " + (flags.gqg_race === "dug" ? "stopped on the Aisne." : "the left extended to the sea.") + "\n" +
      "Salonika: " + (flags.gqg_salonika === "refused" ? "no divisions sent." : "the Army of the Orient sent.") + "\n" +
      "Chantilly: " + (flags.gqg_chantilly === "free" ? "French freedom of action kept." : "simultaneous offensives proposed for 1916.") + "\n" +
      "Douaumont: " + (flags.gqg_douaumont === "waited" ? "left in German hands for the winter." : "retaken in October 1916.") + "\n" +
      "Calais: " + (flags.gqg_calais === "agreement" ? "the British army left under its own commander." : "the British army placed under Nivelle for the offensive.") + "\n" +
      "May 1917: " + (flags.gqg_directive === "offensive" ? "a great offensive kept in preparation." : "limited objectives, by Directive No. 1.") + "\n" +
      "March 1918, the link: " + (flags.gqg_link === "allin" ? "the whole reserve sent north." : "two armies in reserve in the Somme valley, twenty divisions refused.") + "\n" +
      "The Aisne, May 1918: " + (flags.gqg_aisne === "depth" ? "defence in depth enforced." : "the front line left full.") + "\n" +
      "The Americans: " + (flags.gqg_americans === "split" ? "divided among the Allied armies." : "an army with its own sector.") + "\n" +
      "The autumn offensives: " + (flags.gqg_grand === "limited" ? "limited attacks, front by front." : "four concentric offensives from 26 September.") + "\n" +
      "The armistice terms: " + (flags.gqg_senlis === "moderate" ? "the moderate terms Haig urged." : "the Rhine bridgeheads and heavy surrender of equipment.") + "\n" +
      "1918 command: " + (flags.gqg_command1918 === "national" ? "national throughout." : "unified from March.") + "\n\n" +
        "What actually happened: The armistice came into force at eleven o'clock on " +
        "the morning of 11 November 1918. France recovered Alsace-Lorraine and the " +
        "occupied departments, and about 1.4 million French soldiers had been " +
        "killed. Foch received his baton as Marshal of France and Petain his in " +
        "December; Clemenceau, who had held the government together, lost the " +
        "presidential election of January 1920 and left politics.",
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
      "deliberately kept narrow. Removing half of that pairing is the " +
      "counterfactual, and the evidence points where this ending points.\n\nWhat " +
      "actually happened: The army recovered in weeks. Petain stopped the " +
      "offensives, gave the men regular leave and better food, visited the " +
      "divisions himself and listened to the grievances, and the courts-martial of " +
      "the summer handed down several hundred death sentences, of which a few dozen " +
      "were carried out. The exact count is still argued about. The army that " +
      "returned to the line in the autumn of 1917 attacked at La Malmaison, and in " +
      "1918 it counterattacked. Pétain's reputation, in the army and in France, was " +
      "made in these weeks by what he refused to do as much as by what he did.",
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
      "involved could see what refusing it would cost.\n\nWhat actually happened: " +
      "At Doullens on 26 March 1918 Foch was given the coordination of the Allied " +
      "armies on the Western Front, and the front held in front of Amiens. His " +
      "powers were widened in the weeks that followed, and in April he was given " +
      "the title of Commander-in-Chief of the Allied armies. The British and French " +
      "armies stayed joined, and the two retreats that this ending describes did " +
      "not happen. Haig, who had been reluctant, accepted the arrangement, and " +
      "Pershing, when the Americans were brought in, agreed to it with " +
      "qualifications of his own.",
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
      "difference is measured in the only currency that has been counted " +
      "here.\n\nWhat actually happened: The unified command moved reserves between " +
      "the British and French sectors through the spring and summer, and the autumn " +
      "offensives were planned as a single design, which the national commanders in " +
      "this ending do not have. The war ended in November 1918, a year before the " +
      "Allies' own planners expected it to. Some 1.4 million French soldiers had " +
      "been killed by the end of it. Foch's authority was extended in stages and " +
      "was never unlimited, but it was enough to make a single plan out of what had " +
      "been two. It was the first time in the war that a single will directed the " +
      "whole Allied front.",
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
      "by 1918. What the ledger looked like at the end of it was.\n\nWhat actually " +
      "happened: The French army that fought in 1918 had been rebuilt after the " +
      "mutinies, but it was short of men, and its commanders husbanded it in the " +
      "summer and spent it in the autumn. France ended the war with some 1.4 " +
      "million dead, among the largest shares of its young men that any great power " +
      "lost. An army kept intact is one that was not asked, in 1918, for what the " +
      "autumn offensives asked of it, and this ending is built on that not having " +
      "happened. The question of whether it was spent too freely in the last weeks, " +
      "or not freely enough, was argued about by veterans and historians for " +
      "decades afterwards.",
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
      "produces when nobody spends it.\n\nWhat actually happened: The German " +
      "offensives of 1918 did end, as this ending says, but the Allies did not wait " +
      "for them to. The counterattack of 18 July, the British attack at Amiens on 8 " +
      "August and the great offensives of late September brought the war to an end " +
      "in November. The Allied staffs had been preparing a larger campaign for " +
      "1919, with tanks and a growing American army, and it was never needed. Foch " +
      "and the Allied governments did not accept the waiting that this ending " +
      "describes, and the argument between caution and attack was settled by the " +
      "German collapse before it could be settled by anyone else.",
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
      "Speculative. No French government of 1917 could have signed terms leaving " +
      "the occupied departments in German hands and survived the signing.\n\nWhat " +
      "actually happened: No French government approached Germany in 1917. The " +
      "spring brought the Sixtus affair, a private approach by the Austrian Emperor " +
      "through his brother-in-law, Prince Sixtus of Bourbon-Parma, which came to " +
      "nothing and was exposed in April 1918. Painleve's brief ministry in the " +
      "autumn of 1917 gave way to Clemenceau's on 16 November, which was formed to " +
      "make war to the end and did. A negotiated peace in 1917 would have left " +
      "Germany in occupation of northern France and most of Belgium, and no French " +
      "cabinet could have signed it and remained in office. The idea that peace " +
      "might have been had in that year survived in French politics as an " +
      "accusation for years.",
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
      "Speculative. The historical German offensives came near enough to Paris to " +
      "be shelled from range and no nearer. What kept them there was reserves " +
      "committed at moments somebody chose.\n\nWhat actually happened: The German " +
      "offensive of the spring reached the Marne at Chateau-Thierry at the end of " +
      "May, within about sixty kilometres of Paris, and was stopped in early June " +
      "by French and American divisions. Paris was shelled by a long-range gun from " +
      "the end of March and bombed from the air, and many people left. The " +
      "government did not leave. Clemenceau stayed in the capital, and the " +
      "offensives were halted short of it. The Germans were stopped on the Marne, " +
      "and in July the counterattack began that turned the year.",
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
      "Command in a republic is held on terms. The terms were always the casualty " +
      "list.\n\nWhat actually happened: Clemenceau removed General Duchene after " +
      "the Aisne but kept Petain as Commander-in-Chief of the French armies to the " +
      "end of the war, under Foch. The Chamber's committees went on supervising the " +
      "command closely, and the Prime Minister visited the front. The fall that " +
      "this ending describes did not happen. France went into the autumn of 1918 " +
      "with the command and the government working, as they had to, in a mutual " +
      "suspicion that neither side ever fully dropped. Clemenceau had said that the " +
      "war was too serious to be left to the generals, and he acted on it, but he " +
      "never removed the man whom the army trusted most.",
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
        next: "stavka_1914_12_tannenberg",
        outcome:
          "Both armies cross the frontier ahead of their supply. The First Army comes " +
          "on from the north-east and the Second from the south, and between them lie " +
          "the lakes and a railway network the enemy can use and they cannot. The " +
          "French are told that the promise has been kept, and it has, to the letter. " +
          "The cost of keeping it will be counted in the first fortnight, by two armies " +
          "that cannot reach each other.",
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
        next: "stavka_1914_12_tannenberg",
        outcome:
          "Speculative. The advance waits for the armies to be ready to make it " +
          "together. The instrument is better and the alliance is worse, and the second " +
          "of those will be raised at every conference for the rest of the war. The " +
          "French, who were promised an offensive in the first fortnight, fight the " +
          "opening battles with the Germans' whole attention on them, and they are told " +
          "by their ally that the army is not yet ready.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  stavka_1914_12_tannenberg: {
    year: 1914, date: "1914-08-08", city: "Baranovichi",
    title: "The Second Army Is Marching Away From Its Bread",
    advisors: ["grandduke", "zhilinsky", "samsonov"],
    situation: (flags) =>
      "The First Army crossed the frontier on the 4th. The Second, coming up from the " +
      "south, is going in today, 8 August (21 August in the west). " +
      (flags.stavka_prussia === "concentrated"
        ? "The concentration was finished before the advance, and the Second Army has more behind it than it would have had."
        : "It went in before its concentration was finished and before its supply could follow.") +
      "\n\nGeneral Zhilinsky, who commands both armies from the North-Western Front, wants " +
      "the German Eighth Army pressed hard after the first battle at Gumbinnen and is " +
      "not satisfied with the pace. The corps commanders of the Second Army complain " +
      "that they are marching away from their railheads and their bread. The two armies " +
      "are too far apart to help each other, and the wireless messages that pass between " +
      "them are sent in clear.",
    context:
      "The question put to this headquarters is whether to let the orders of the front " +
      "commander stand. Nothing in the situation will be clearer in a week than it is today.",
    choices: [
      {
        id: "press",
        label: "Leave Zhilinsky's orders in force: both armies press on",
        historical: true,
        advisor: { name: "Zhilinsky", position:
          "The enemy is going back and has to be kept going. Stopping to bring up supply gives him time to turn." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { stavka_tannenberg: "pressed" },
        next: "stavka_1914_02_galicia",
        outcome:
          "The Second Army goes on north. Between 13 and 17 August (26 and 30 August in " +
          "the west) the German Eighth Army surrounds it and almost destroys it, and " +
          "General Samsonov shoots himself. The First Army, which could not help, is " +
          "turned back a fortnight later. The invasion of East Prussia, begun to keep a " +
          "promise to the French, ends with the Second Army gone.",
      },
      {
        id: "halt",
        label: "Halt the Second Army at the frontier until its supply and the First Army come up",
        gate: (m) => m.will >= -1,
        disabledReason: "A halt in the first week of the invasion cannot be explained to the French",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { stavka_tannenberg: "halted" },
        next: "stavka_1914_02_galicia",
        outcome:
          "Speculative. The Second Army stops where it is and the invasion loses a " +
          "week. The German Eighth Army has that week to decide what to do about two " +
          "Russian armies that have stopped, and the French have been told by their " +
          "ally that the offensive they asked for is not coming at the pace promised. " +
          "The army gets its bread and its wireless sorted out, and it pays for both " +
          "with the time that was the whole purpose of the invasion.",
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
        next: "stavka_1914_03_przemysl",
        outcome:
          "The South-Western Front takes Lemberg and drives toward the passes. It is " +
          "the largest Russian success of the war so far and it is against the wrong " +
          "empire, and everyone in this building knows it. The Austrian army has been " +
          "beaten and thrown back, and the prisoners and the captured guns are real. " +
          "The Germans, who are the enemy that matters, are fighting in the north on a " +
          "front that no one has reinforced.",
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
        next: "stavka_1914_03_przemysl",
        outcome:
          "Speculative. Divisions go north from a front that was winning to a front " +
          "that was not. The Austrians get the winter to recover in and the Germans get " +
          "a second opportunity on ground they have already fought over. The army that " +
          "was driving toward the passes is told to stop, and the army that was beaten " +
          "in East Prussia is given the divisions it asked for, with an enemy in front " +
          "of it that has just destroyed one Russian army and is looking for another.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  stavka_1914_03_przemysl: {
    year: 1914, date: "1914-10-28", city: "Baranovichi",
    title: "The Fortress Behind Our Lines",
    advisors: ["grandduke", "brusilov"],
    situation: (flags) =>
      "On 28 October (10 November in the west) the Austro-Hungarian fortress of Przemysl " +
      "is cut off again, with a garrison of about 120,000 men inside it. The first siege " +
      "was lifted when the relieving army came up, and the assault the Third Army ordered " +
      "before that, after a short bombardment, got nowhere and cost some forty thousand men in " +
      "three days.\n\n" +
      "The fortress sits on the main railway between Lvov and Cracow, and the Austrians " +
      "will try to relieve it again. The guns that could reduce it quickly are not here, " +
      "and the army that would storm it is the army that is needed to hold the line " +
      "outside." +
      (flags.xc_kolubara === "declined" ? "\n\nRussian intelligence reports that the Austro-Hungarian divisions meant for a third invasion of Serbia have been kept in Galicia, and that the relief of the fortress will be made in more strength than it would otherwise have been." : ""),
    context:
      "A fortress that is starved costs the besiegers an army and a winter. A fortress " +
      "that is stormed costs them men, and the first attempt showed what that price " +
      "is. Neither is free, and the garrison inside will eat the winter's stores " +
      "while the choice is argued.",
    choices: [
      {
        id: "invest",
        label: "Invest the fortress and starve it out, with no frontal assaults",
        historical: true,
        advisor: { name: "Brusilov", position:
          "Men are not shells. Without the guns to break the forts, an assault is only a way of spending the army, and the garrison cannot eat what it does not have." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { stavka_przemysl: "invested" },
        next: "stavka_1914_04_lodz",
        outcome:
          "The Eleventh Army settles round the fortress and does not attack it. The " +
          "garrison eats through its stores over the winter, the relief attempts through " +
          "the Carpathians fail in the snow, and the commandant surrenders on 9 March " +
          "(22 March in the west) with well over a hundred thousand men. It is slow, and " +
          "it keeps an army tied to the place for the whole winter, but it spends no " +
          "more men on the forts than the first assault did.",
      },
      {
        id: "storm",
        label: "Take it by assault before the Austrians can come back",
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "A hundred and twenty thousand men are inside it and the railway to Cracow runs past its walls. The fortress has to be taken, and the sooner the better." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There are not the men to spare for a second assault on the forts",
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { stavka_przemysl: "stormed" },
        next: "stavka_1914_04_lodz",
        outcome:
          "Speculative. The assault goes in before the relieving army is back and before " +
          "the guns are, on the same forts that stopped the first one. Some of the " +
          "outer works fall and the rest do not, and the casualty lists that come back " +
          "are the ones the earlier assault produced, with the added knowledge that " +
          "this was known. The fortress holds into the winter all the same, and the " +
          "army that stormed it is smaller when the Austrians return.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-11
  stavka_1914_04_lodz: {
    year: 1914, date: "1914-11-03", city: "Baranovichi",
    title: "An Army Turned North",
    advisors: ["grandduke", "ruzsky"],
    bulletin: {
      voice: "stavka", date: "1914-11-01", source: "Communique of the Staff",
      text:
        "Our troops continue their advance on the left bank of the Vistula. In the " +
        "region of Wloclawek the enemy has been in contact with our forces.",
    },
    situation:
      "On 3 November (16 November in the west) the offensive into Silesia is two days " +
      "old. Ruzsky's armies, the Second, Fifth and Fourth, are to cross the German " +
      "frontier, and the Grand Duke has approved the plan.\n\n" +
      "Meanwhile the German Ninth Army has been moved by rail to the Thorn area and has " +
      "struck the right flank of the Russian line, in the neighbourhood of Wloclawek " +
      "and Kutno. It is aimed at the city of Lodz, at cutting it off from Warsaw and " +
      "surrounding the troops in it. The Fifth Army, under Plehve, is the one that can " +
      "meet it, and it is facing the wrong way.",
    context:
      "Turning the Fifth Army north gives up the invasion of Silesia on the day it " +
      "begins, and it asks a hundred kilometres of marching of men who are not " +
      "expecting it. Going on into Silesia leaves the Second Army to meet a German " +
      "army with what it has.",
    choices: [
      {
        id: "turn",
        label: "Turn the Fifth Army north against the German thrust and give up the Silesian offensive",
        historical: true,
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "The German army is on our flank and Lodz is the point. Silesia can wait until the flank is safe, and the Fifth Army is the only one near enough to make it safe." },
        dispute:
          "Lodz is read two ways. On the field the Russian armies avoided the " +
          "encirclement that was intended for them and a German corps was surrounded " +
          "and broke out; the Russians kept the city until they chose to leave it and " +
          "fell back to the Bzura only at the end of November. At the level of the " +
          "campaign the invasion of Germany was stopped and Russia never again came so " +
          "close to German soil. Both are true, and the weight given to either decides " +
          "whether the battle is called a Russian victory or a German one.",
        uncertain: [
          { weight: 60, title: "The army escapes and the offensive is lost", historicalBranch: true,
            impact: { manpower: -1, munitions: 0, will: 0 },
            setFlags: { stavka_lodzResult: "escaped" },
            next: "stavka_1915_01_masuria",
            outcome:
              "The Fifth Army covers some hundred and sixteen kilometres in two days and " +
              "strikes the German flank. The Germans are not able to close the ring " +
              "round Lodz, and one of their own corps is nearly surrounded and " +
              "breaks out. At the end of November the Russian line falls back to the " +
              "Bzura and the Rawka. The Silesian offensive is not made, and the winter " +
              "will be spent on the defensive. The army has kept itself and lost its chance." },
          { weight: 40, title: "The flank is covered and the offensive is only delayed",
            impact: { manpower: 0, munitions: 0, will: 1 },
            setFlags: { stavka_lodzResult: "covered" },
            next: "stavka_1915_01_masuria",
            outcome:
              "Speculative. The Fifth Army reaches the flank in time to turn the " +
              "German attack back instead of only absorbing it, and the Second Army is " +
              "not made to give ground. The Silesian offensive is put off for a few weeks " +
              "and not abandoned, and the two armies that were to make it are still in " +
              "being when the winter closes the roads. Whether it can then be made at " +
              "all is a different question, and nothing in the autumn answers it." },
        ],
      },
      {
        id: "silesia",
        label: "Press on into Silesia and let the Second Army hold Lodz with what it has",
        advisor: { name: "Ruzsky", position:
          "The way to answer a blow at our flank is to be in Germany before it lands. The plan was to cross the frontier, and the army that crosses it is the one the enemy has to answer." },
        gate: (m) => m.will >= -3,
        disabledReason: "Nobody at headquarters will answer for leaving the flank open",
        impact: { manpower: -1, munitions: -1, will: 2 },
        setFlags: { stavka_lodz: "silesia" },
        next: "stavka_1915_01_masuria",
        outcome:
          "Speculative. The Fifth Army crosses the frontier and the Second is left to meet " +
          "the German Ninth Army alone at Lodz. It is a gamble on the two armies " +
          "passing in the night, and the Germans, who had expected the Russians to " +
          "turn, have to decide what to do. A Russian army on German soil is something " +
          "the war has not seen, and whether it can stay there is " +
          "something the war does not get to find out.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-01
  stavka_1915_01_masuria: {
    year: 1915, date: "1915-01-24", city: "Baranovichi",
    title: "A Warning From the Tenth Army",
    advisors: ["grandduke", "ruzsky"],
    situation:
      "On 24 January (6 February in the west) the commander of the Tenth Army, " +
      "Sievers, has warned the Northwest Front that an attack is coming. His army " +
      "holds a long line on the East Prussian border, with the Twentieth Corps in the " +
      "forests round Augustow, and it could be drawn back to the Niemen.\n\n" +
      "The front commander, Ruzsky, is not persuaded. The border line is the anchor of " +
      "the whole position in East Prussia, and Plehve's Twelfth Army is assembling " +
      "a hundred kilometres to the south-west to take the offensive in its turn.",
    context:
      "Giving up the border gives up the anchor that Stavka has been planning " +
      "round, and gives it up on a warning. Holding it risks the army that holds " +
      "it, in forest, in winter, and a long way from the nearest road that would " +
      "carry it out.",
    choices: [
      {
        id: "hold",
        label: "Hold the border line and trust the front commander's judgment",
        historical: true,
        advisor: { name: "Ruzsky", position:
          "The border is the line the plan is built on. A warning is not an attack, and an army that retreats on every one has no line at all." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { stavka_masuria: "held" },
        next: "stavka_1915_12_carpathians",
        outcome:
          "On 25 January (7 February in the west) the Germans attack in a snowstorm and " +
          "within ten days have outflanked the Tenth Army and driven it out of East " +
          "Prussia. The Twentieth Corps is cut off in the forest near Augustow and " +
          "surrenders on 9 February (22 February in the west), with its losses put at " +
          "some 34,000 men. Much of the Tenth Army gets away. The quartermaster-general " +
          "afterwards calls it a great German success: it cost Russia the anchor it had " +
          "planned around.",
      },
      {
        id: "pull",
        label: "Draw the Tenth Army back to the Niemen before the blow falls",
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "If the Tenth Army says it is going to be struck, then it should not be where the blow will fall. A line can be taken again and a corps cannot." },
        gate: (m) => m.will >= -2,
        disabledReason: "Giving up the border on a subordinate's warning is not something the front commander will accept",
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { stavka_masuria: "pulled" },
        next: "stavka_1915_12_carpathians",
        outcome:
          "Speculative. The Tenth Army falls back toward the Niemen before the blow, and " +
          "the Germans, when they attack, find less to surround. The " +
          "Twentieth Corps is out of the forest and in the line, and the border that " +
          "was to be the anchor of the position is given up without a battle. It " +
          "is a retreat made on a subordinate's warning, which is what the front " +
          "commander said it would be.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-03
  stavka_1915_12_carpathians: {
    year: 1915, date: "1915-03-09", city: "Baranovichi",
    title: "Przemysl Has Fallen",
    advisors: ["grandduke", "brusilov"],
    situation: (flags) =>
      "Przemysl has fallen today, 9 March (22 March in the west), after a siege that " +
      "began in September. About 117,000 men and nine generals are taken. " +
      (flags.stavka_1914theatre === "prussia"
        ? "Divisions were taken from the south in the autumn for the northern effort, and the Carpathian armies are thinner than they would have been."
        : "Galicia was reinforced in the autumn, and the Carpathian armies are as strong as they have been.") +
      "\n\nThrough the winter the Austrian armies have been trying to relieve the fortress " +
      "across the mountains, and the Russian armies have been fighting them in the " +
      "Carpathian passes. The cost of it to the Austro-Hungarian army alone is put " +
      "at about 800,000 men between January and April, and most of the loss is to " +
      "weather and disease. The Russian armies' own losses are nearly as high, and " +
      "easier to make good.\n\n" +
      "The question for Stavka is what the armies in the mountains are to do now that " +
      "the fortress they were covering is gone.",
    context:
      "A crossing of the Carpathians would put Russian armies on the Hungarian plain. " +
      "It would also stretch a line that is short of shells and short of rifles, over " +
      "passes that are blocked with snow.",
    choices: [
      {
        id: "press",
        label: "Press on over the Carpathians into Hungary",
        historical: true,
        impact: { manpower: 0, munitions: -1, will: 2 },
        setFlags: { stavka_carpathians: "pressed" },
        next: "stavka_1915_03_retreat",
        outcome:
          "The armies in the mountains go on through the spring, with the passes full of " +
          "snow and the guns short of shells. The Austro-Hungarian army loses about " +
          "800,000 men in the Carpathians between January and April, and Russian losses " +
          "are nearly as high. The ground gained there is not held for long: the German " +
          "attack in May turns the whole of it.",
      },
      {
        id: "halt",
        label: "Halt in the passes and use the spring to refit",
        impact: { manpower: 1, munitions: 1, will: -1 },
        setFlags: { stavka_carpathians: "halted" },
        next: "stavka_1915_03_retreat",
        outcome:
          "Speculative. The armies hold the passes they have and stop attacking. The " +
          "rifles and shells that would have been spent in the snow are kept, and the " +
          "Austrians have the spring to recover. Przemysl has been taken and nothing " +
          "more is asked of it. The army is less tired when the German blow comes in " +
          "May, and no one will be able to say whether it would have held, because the " +
          "shells it saved would not have been enough.",
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
          "looks, from Petrograd, exactly like losing the war. The armies fall back " +
          "through the summer, burning what they cannot carry, with the population " +
          "moving east in front of them. By the autumn the front has shortened and the " +
          "army has survived, and the Emperor has found someone to blame for the loss.",
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
          "and the army behind the map does not. The shell shortage that a retreat " +
          "would have escaped is met in front of the guns, and the divisions that are " +
          "lost in the salient are the ones that would have been the army's reserve in " +
          "the autumn. The Germans are left to choose their moment.",
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
            next: "stavka_1915_05_sventsiany",
            outcome:
              "Alekseyev takes charge of operations and the line stabilises through the " +
              "autumn. Four hundred miles away, competent ministers are dismissed and " +
              "replaced by the Empress's nominees, and the belief that the court is working " +
              "against the war spreads through people who are not revolutionaries and were " +
              "not going to be. The Emperor is now answerable for every defeat at the " +
              "front, and the capital is run by people he cannot supervise." },
          { weight: 40, title: "The presence steadies both",
            impact: { will: 1 },
            setFlags: { stavka_commandResult: "steadied" },
            next: "stavka_1915_05_sventsiany",
            outcome:
              "Speculative. The Emperor at headquarters is visible to the army in a way he " +
              "has not been, the operations are conducted by a professional, and the " +
              "arrangements in the capital hold together better than they historically did. " +
              "It requires the court to behave differently, which is the part of this that " +
              "is speculation. The ministers who warned him against going to the front have " +
              "to be shown wrong, and the Empress, who has been left in charge, has to be " +
              "content with her part." },
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
        next: "stavka_1915_05_sventsiany",
        outcome:
          "Speculative. The Grand Duke stays and the Emperor stays in Petrograd. There " +
          "remains a commander who can be dismissed if 1916 goes badly, and a sovereign " +
          "in his capital while the arrangements there are made. The Grand Duke, whom " +
          "the court distrusts, is left in command of an army that is retreating, and " +
          "the blame for the retreat falls where it has been falling, on a man who is " +
          "not the Emperor and cannot be replaced from outside.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-08
  stavka_1915_05_sventsiany: {
    year: 1915, date: "1915-08-29", city: "Mogilev",
    title: "A Gap Fifty Kilometres Wide",
    advisors: ["alekseyev", "polivanov"],
    situation:
      "In the last days of August (the second week of September in the west) the " +
      "Germans have broken through at Sventsiany, where the Fifth and Tenth Armies " +
      "join. Six cavalry divisions have gone through north of Vilkomir, pushed back " +
      "the little Russian cavalry in the way, and are riding for Vileika and " +
      "Molodechno. A gap some fifty kilometres wide has opened between the two " +
      "fronts.\n\n" +
      "The Emperor has been in command for six days. The only force at hand to send " +
      "against the breach is a newly raised army that has not yet been under fire.",
    context:
      "Cavalry with no infantry or artillery to support it runs out of strength " +
      "quickly. It also runs a long way before it does, and into ground where the " +
      "railway the army depends on is only a day's ride off.",
    choices: [
      {
        id: "counter",
        label: "Counterattack at once with the new army and close the gap",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "Cavalry without infantry cannot hold what it has run through. The answer to a gap is to go in at its neck with what we have, not to give up the ground behind it." },
        impact: { manpower: 1, munitions: 0, will: 1 },
        setFlags: { stavka_sventsiany: "counterstroke" },
        next: "stavka_1915_06_chantilly",
        outcome:
          "Detachments of the newly raised Second Army stop the German cavalry on 2 and 3 " +
          "September (15 and 16 September in the west), when it has been without " +
          "infantry or guns for some days, and the counterstroke throws it back from " +
          "the Molodechno district. The breach itself is closed on 19 September " +
          "(2 October in the west). The Germans have got into the rear again and " +
          "have not been able to hold what they got, and the front, from here, " +
          "settles into trenches.",
      },
      {
        id: "withdraw",
        label: "Let the cavalry run out and withdraw the line to a shorter front",
        advisor: { name: "Polivanov", position:
          "The new army is the only reserve at hand, and it has never been tried. If it is lost there is little behind it. A shorter line can be held with what is left." },
        gate: (m) => m.will >= -2,
        disabledReason: "The court will not hear of another withdrawal six days after the Emperor took the command",
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { stavka_sventsiany: "withdrew" },
        next: "stavka_1915_06_chantilly",
        outcome:
          "Speculative. The line falls back behind the breach and the new army stays " +
          "out of it. The cavalry, left to itself, does what cavalry does for a few " +
          "days and then stops for want of anything to carry on with, and the front " +
          "is shorter and worse placed than the one that was given up. The army has " +
          "its reserve, untried, and the Emperor, six days into the command, has a " +
          "retreat to his name that was not forced on him.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-11
  stavka_1915_06_chantilly: {
    year: 1915, date: "1915-11-23", city: "Mogilev",
    title: "A Plan for Every Front at Once",
    advisors: ["alekseyev", "polivanov"],
    situation:
      "In the first week of December in the west, Joffre has called the Allied " +
      "military representatives to his headquarters at Chantilly: France, Britain, " +
      "Italy, Serbia and Russia. His plan is that in 1916 the Allies attack on all " +
      "fronts at once, so that the Germans cannot move troops from one threatened " +
      "front to the next. Until then each is to wear the enemy down by active " +
      "operations.\n\n" +
      "The conference sets no date. The Russian representative is being asked to " +
      "accept the principle. In 1915, when the Russian line broke at Gorlice, the " +
      "Western Allies were not ready to help.",
    context:
      "Russia can say yes and mean it as an obligation, or say yes and mean it as an " +
      "aspiration, and the French will take it as the first. Saying no leaves the " +
      "armies of the largest ally outside the plan, at the moment when they have " +
      "just lost Poland.",
    choices: [
      {
        id: "commit",
        label: "Accept the plan: Russia will attack when the others do",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "In 1915 the Germans were free to choose their front. In 1916 they should be made to choose among several, and Russia has to be one of them." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { stavka_chantilly: "committed", xc_chantilly: "committed" },
        next: "stavka_1916_02_naroch",
        outcome:
          "The Russian representative accepts the principle of simultaneous " +
          "offensives, and the conference agrees that when any of the allies is " +
          "threatened the others will attack to draw the pressure off. It fixes no " +
          "timetable. Within weeks Joffre and Haig turn it into a joint offensive on " +
          "the Somme. Russia has been put in the plan, and the French will ask for it " +
          "to be kept in the spring.",
      },
      {
        id: "decline",
        label: "Decline to commit until the army has been re-equipped",
        advisor: { name: "Polivanov", position:
          "An army that has lost its guns and half its rifles cannot make a promise to attack by a date, and a promise it cannot keep is worse than the refusal." },
        gate: (m) => m.munitions <= -2,
        disabledReason: "The army's stores are not low enough for a refusal to be believed",
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { stavka_chantilly: "declined", xc_chantilly: "declined" },
        next: "stavka_1916_02_naroch",
        outcome:
          "Speculative. The Russian representative takes the plan home and the " +
          "French get an answer that is neither yes nor no. There is a spring of " +
          "refitting where the other would have been a spring of promises, and the " +
          "alliance, which has just lost Poland, is told by its largest partner " +
          "that it will fight when it can. The Allies make their plans without a " +
          "date from the east.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-02
  stavka_1916_02_naroch: {
    year: 1916, date: "1916-02-24", city: "Mogilev",
    title: "Verdun Asks for an Offensive",
    advisors: ["alekseyev", "polivanov", "brusilov"],
    situation:
      "The Germans have attacked at Verdun, and Joffre has asked Alekseyev directly " +
      "for a Russian offensive that will make them move divisions east. It is what " +
      "the Chantilly agreement promised, a few months early and without a date.\n\n" +
      "Alekseyev has put the question to the three front commanders. After the " +
      "winter's losses on the South-Western Front, any attack would have to come " +
      "from one or both of the others. The place chosen is the junction of the Northern " +
      "and Western Fronts, round Lake Naroch, where Kuropatkin has 266,000 infantry " +
      "and Evert 643,000, against some 495,000 Germans, behind lakes and marsh " +
      "that are still frozen.",
    context:
      "The ground is a thaw away from impassable. The French are fighting for their " +
      "lives and have a claim on the alliance. The Chantilly undertaking was to " +
      "attack together in the summer, and this would be an offensive made months " +
      "ahead of it.",
    choices: [
      {
        id: "launch",
        label: "Attack at Lake Naroch in March, for the French",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The French asked, and the alliance rests on what each does when the other is in trouble. It will not be a good attack, but it will be an attack." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { stavka_naroch: "launched", xc_naroch: "launched" },
        next: "stavka_1916_05_brusilov",
        outcome:
          "The guns open on 5 March (18 March in the west), but the bombardment does not " +
          "cut the German defences, and the columns find them mostly intact and are " +
          "swept from the flank. The Second Army loses some 15,000 men on the first " +
          "day. The Russians take a stretch of the front line and cannot hold the " +
          "ground behind it. On 16 March (29 March in the west) Alekseyev ends the " +
          "assault, and the thaw and the rains halt the rest. It has not helped " +
          "the French.",
      },
      {
        id: "refuse",
        label: "Tell the French that the army will keep its strength for the summer",
        advisor: { name: "Brusilov", position:
          "An offensive made in a hurry, on frozen lakes, is not a gift to the French. The summer is when it can be made to count." },
        gate: (m) => m.will >= -3,
        disabledReason: "The alliance cannot be told no while Verdun is under attack",
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { stavka_naroch: "refused", xc_naroch: "refused" },
        next: "stavka_1916_05_brusilov",
        outcome:
          "Speculative. The answer to Joffre is that Russia will attack with the " +
          "others in the summer, as agreed at Chantilly, and not before. The French, " +
          "who are fighting at Verdun, are not given what they asked for. The army " +
          "keeps the men and the shells that Naroch would have used, and it goes " +
          "into the summer a little stronger.",
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
        next: "stavka_1916_12_kovel",
        outcome:
          "Speculative. The supporting attacks are made and made seriously. The " +
          "Austrian front does not merely bend, and the German divisions sent to shore " +
          "it up come from somewhere they were needed. The other front commanders, who " +
          "have said they will not be ready, are overruled by Stavka and told to attack " +
          "on the day, and whether they obey, and with what, is the whole of the risk. " +
          "The offensive is no longer the work of one front.",
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
            next: "stavka_1916_12_kovel",
            outcome:
              "The offensive succeeds beyond anything this army has managed and breaks the " +
              "Austrian front, forcing German divisions east to hold it. The supporting " +
              "attacks are not pressed. It is exploited as far as one front can exploit " +
              "anything alone, and the divisions that did it are the divisions that will " +
              "not be there next year. Brusilov has done what no one thought could be done " +
              "with the army he had, and he has done it once." },
          { weight: 45, title: "The breakthrough is banked rather than pushed",
            impact: { munitions: -1, will: 1 },
            setFlags: { stavka_brusilovResult: "banked" },
            next: "stavka_1916_12_kovel",
            outcome:
              "Speculative. The front takes what the method wins and stops when the " +
              "exploitation stops paying. The Austrian line is broken, the German divisions " +
              "still come east, and the formations that did it are still formations at the " +
              "end of it. The offensive is smaller than the historical one and costs less, " +
              "and Brusilov is not the figure in the army that the historical one made him. " +
              "Romania, watching, has less to go on, and may come in later or not at all." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-07
  stavka_1916_12_kovel: {
    year: 1916, date: "1916-07-10", city: "Mogilev",
    title: "The Road to Kovel",
    advisors: ["alekseyev", "brusilov"],
    situation: (flags) =>
      "The South-Western Front attacked on 22 May (4 June in the west) and broke the " +
      "Austrian line. " +
      (flags.stavka_brusilov === "supported"
        ? "The other fronts attacked in support, as the order said, and the Germans have had to find reserves for each of them."
        : "The Western Front did not move until ten days later, and its own attack in July took five kilometres and about 80,000 men.") +
      "\n\nAlekseyev has given Brusilov a third army and the Guards, and the front now " +
      "holds some 700,000 men against about 421,000. Brusilov wants to go on for Kovel, " +
      "the railway junction that would carry the front west toward Brest-Litovsk. The " +
      "ground in front of it is marsh and river, and the Germans have been bringing " +
      "divisions to hold it.",
    context:
      "The offensive has already done more than anyone expected of it. Going on costs " +
      "the Guards, who are the best troops left in the army.",
    choices: [
      {
        id: "kovel",
        label: "Order the Guards and the Special Army to take Kovel",
        historical: true,
        advisor: { name: "Brusilov", position:
          "The enemy is still off balance. The junction at Kovel would give the front a road to the west." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { stavka_kovel: "attacked" },
        next: "stavka_1916_13_romania",
        outcome:
          "The preparation begins on 11 July (24 July in the west) and the main attacks " +
          "go in from the 15th (28 July), across the marshes of the Stokhod. By the 26th " +
          "(8 August) the Germans and Austro-Hungarians have stopped them, and on the " +
          "27th (9 August) Brusilov suspends the operation. Kovel is not taken, and the " +
          "Guards, who were the army's best reserve, have been spent on the marsh.",
      },
      {
        id: "hold",
        label: "Stop offensive operations on the Kovel front and hold what has been taken",
        impact: { manpower: 1, munitions: 1, will: -1 },
        setFlags: { stavka_kovel: "held" },
        next: "stavka_1916_13_romania",
        outcome:
          "Speculative. The front holds the ground it has won and the Guards are kept " +
          "in reserve. Brusilov's offensive ends where it stood in July, without the " +
          "attempt on the junction. The Germans use the pause to bring up more " +
          "divisions, and the Guards, who would have been spent on the marshes, are " +
          "still there in the winter when the army needs them. The Commander who has " +
          "been asked for one more effort is told, instead, that the effort is over.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-08
  stavka_1916_13_romania: {
    year: 1916, date: "1916-08-14", city: "Mogilev",
    title: "A New Ally With a Long Frontier",
    advisors: ["alekseyev", "brusilov"],
    situation: (flags) =>
      "Romania enters the war today, 14 August (27 August in the west), encouraged " +
      "by the success of the offensive in Galicia. " +
      (flags.stavka_kovel === "attacked"
        ? "The Guards are on the Stokhod and the front's best reserve is spent."
        : "The Guards are in reserve behind the front.") +
      "\n\nThe Romanian army will attack into Transylvania, while German, Austro-" +
      "Hungarian and Bulgarian forces gather to the north and the south of it. Romania " +
      "has a long frontier and an army that is short of guns and of the experience of " +
      "the war. Russia has promised to help, and the help has to come from the same " +
      "armies that are fighting in Galicia.",
    context:
      "A force sent to Romania is a force taken from the front, where Brusilov has been " +
      "told to stop. A force not sent is an ally left to its own frontier.",
    choices: [
      {
        id: "small",
        label: "Send a small force and promise more if it is needed",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The Romanian front is a sideshow and cannot be allowed to take the armies from the main one." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { stavka_romania: "small" },
        next: "stavka_1916_14_romfront",
        outcome:
          "Three Russian divisions are sent, and they are not properly equipped. The " +
          "Romanian plans go wrong, and the Germans take Bucharest on 23 November (6 " +
          "December in the west). Russia then has to send large reinforcements to keep " +
          "the Germans from the south of the country, and in the weeks that follow the " +
          "front settles in Moldavia, held by a great many Russian divisions that have " +
          "been taken from somewhere else.",
      },
      {
        id: "army",
        label: "Send an army to Romania at once and shorten the line in Galicia to find it",
        gate: (m) => m.manpower >= -3,
        disabledReason: "The army cannot find a force for Romania without breaking the Galician front",
        impact: { manpower: -3, munitions: -2, will: 1 },
        setFlags: { stavka_romania: "army" },
        erodes: "expose_regime",
        next: "stavka_1916_14_romfront",
        outcome:
          "Speculative. A Russian army is sent to Romania in the first weeks, and the " +
          "Galician line is shortened to pay for it. The Romanian front opens with " +
          "stronger support and the Galician front with less, and the army has to find " +
          "the troops in the autumn that it historically found in the winter. Stavka " +
          "has chosen the ally over the front, and the Romanian general staff, who " +
          "never saw the Russians as friends, have to decide whether to accept the " +
          "help.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-11
  stavka_1916_14_romfront: {
    year: 1916, date: "1916-11-29", city: "Mogilev",
    title: "A Front That Is Not Ours",
    advisors: ["alekseyev", "brusilov"],
    situation: (flags) =>
      "On 29 November (12 December in the west) Bucharest has fallen to the army of " +
      "Mackensen, and what is left of the Romanian army is in western Moldavia, with " +
      "the Carpathians behind it and a German-led army coming on from the south.\n\n" +
      (flags.stavka_romania === "army"
        ? "An army was sent to Romania in the summer, at the first request, and it is " +
          "already in the line. "
        : "Three divisions were sent to Romania in the summer, and Alekseyev, who had " +
          "doubted that Romania's entry would be worth having, has seen what it costs. ") +
      "A great movement of Russian troops is under way through November, " +
      "and what it is for is not settled: it may hold the Romanian front, " +
      "under a command that is partly Romanian, or only the Russian frontier " +
      "behind it.",
    context:
      "Taking over the Romanian front lengthens the line the army has to hold, " +
      "in the middle of a winter, with the divisions that were to be spared for the " +
      "spring. Not taking it over leaves the Romanians to be overrun, and the " +
      "alliance that brought them in is the alliance that is asked to rescue them.",
    choices: [
      {
        id: "take",
        label: "Take over the defence of Moldavia and form a Romanian Front under the King",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "I did not want them in the war. They are in it, and the front that stands in Moldavia is our flank. We hold it, or we hold it later with less." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { stavka_romfront: "formed" },
        next: "stavka_1917_01_petrograd",
        outcome:
          "In mid-December the Romanian Front is formed out of the headquarters of the " +
          "Danube Army and the remnants of the Romanian army, nominally under the " +
          "King, with the Russian commander, Sakharov, serving under him. Thirty-six " +
          "infantry and eleven cavalry divisions are said to have been moved " +
          "south in November alone. By the end of the year the line has " +
          "stopped along the Carpathians, the lower Siret and the Danube. Russia has " +
          "a front it did not want, and it holds.",
      },
      {
        id: "limit",
        label: "Hold only the Russian frontier and the Prut, and leave the rest to the Romanians",
        advisor: { name: "Brusilov", position:
          "Every division sent south is a division not sent against the Austrians in the spring. The frontier we have to hold is our own." },
        gate: (m) => m.manpower <= -2,
        disabledReason: "The army is not yet so short of men that the Romanians can be told they are on their own",
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { stavka_romfront: "limited" },
        next: "stavka_1917_01_petrograd",
        outcome:
          "Speculative. The Russian armies stand on their own frontier and the " +
          "Romanian army, with what it has, holds the little of the country that is " +
          "left. The divisions are kept for the spring. The Romanians, who came in on " +
          "the promise of help and had a share of it, are told that the help " +
          "stops at the Prut, and the alliance, which was made up of such promises, has " +
          "one fewer that anyone believes.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-01
  stavka_1917_01_petrograd: {
    year: 1917, date: "1917-01-20", city: "Mogilev",
    title: "The Allied Missions Arrive",
    advisors: ["alekseyev", "ruzsky", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1917-01-18", source: "Communique of the Staff",
      text:
        "On the Romanian front and in the Carpathian region there is no change. " +
        "Along the remainder of the front our scouts have been active.",
    },
    situation:
      "On 20 January (2 February in the west) the Allied missions are at Petrograd: " +
      "the British, led by Lord Milner, who has come to settle two things with the " +
      "Russian government, how the summer's offensives are to be coordinated and how " +
      "Russia is to be supplied with the equipment it has been asking for. At Port " +
      "Romanov thousands of tons of munitions are lying on the docks.\n\n" +
      "Stavka is asked what to tell them about the spring. The Allies want a Russian " +
      "offensive to go in with their own, and the High Command has to say whether " +
      "it can be made.",
    context:
      "The conference is meant to do the thing Chantilly did not: to put dates on " +
      "the promises. Russia is the one partner whose answer depends on the " +
      "weather, the railways and the temper of the capital, and the delegates know " +
      "it, and have come to judge for themselves.",
    choices: [
      {
        id: "postpone",
        label: "Tell the missions that the great offensives must wait until the army is ready",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The army will take the field when it has the guns, the rifles and the railway to carry them, and not on a date written in Petrograd." },
        impact: { manpower: 1, munitions: 1, will: -1 },
        setFlags: { stavka_petrograd: "postponed", xc_petrograd: "postponed" },
        next: "stavka_1917_06_february",
        outcome:
          "General Gurko, speaking for the High Command, tells the conference that " +
          "the great offensives are to be put off. The Allied delegates are " +
          "disappointed, and the conference, which was meant to settle the dates, ends " +
          "with poor results. Less than six weeks later the Emperor abdicates, and " +
          "the question of what the army would have done in the spring is " +
          "put to a different government.",
      },
      {
        id: "promise",
        label: "Promise the missions a Russian offensive in the spring, on the date they ask",
        advisor: { name: "Brusilov", position:
          "A promise that is kept is worth more than a delay that is explained. The army can attack on the south-western front, and the Allies' wish is a reason to do it." },
        gate: (m) => m.will >= -2,
        disabledReason: "Headquarters will not put its name to a date that the railways cannot keep",
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { stavka_petrograd: "promised", xc_petrograd: "promised" },
        next: "stavka_1917_06_february",
        outcome:
          "Speculative. The mission goes home with a date and a promise, and the " +
          "Allied staffs plan round both. The offensive that is made in the spring " +
          "is made by an army that was told to expect it, and by a country that " +
          "has been told it will be, in a winter that is not a good one for either. " +
          "Whether the Emperor is still on the throne when the date comes is a " +
          "question that the missions do not ask and nobody answers.",
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
          "who did not. The generals have acted in the interest of the war, as they " +
          "understood it, and the officers who took the oath to the Emperor are asked " +
          "what it was worth, by their own men.",
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
          "will march on Petrograd, and on very little else. The generals have kept the " +
          "army out of the question of who reigns, and have left the question to the " +
          "people who were already settling it. No one at headquarters is ready to say " +
          "what the army would do if the capital asked it to restore order.",
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
            next: "stavka_1917_12_deathpenalty",
            outcome:
              "The first days go well where the artillery is good and the units are " +
              "willing. Then the willing units are used up, the rest decline to replace " +
              "them, and the counterattack finds a front that is arguing with itself. What " +
              "comes back is not an army that failed at an offensive. It is an army that " +
              "has stopped. The Provisional Government, which ordered the attack, is left " +
              "with a retreat that no committee will agree to halt." },
          { weight: 30, title: "The offensive achieves a limited gain and stops",
            impact: { manpower: -1, will: -1 },
            setFlags: { stavka_kerenskyResult: "limited" },
            next: "stavka_1917_12_deathpenalty",
            outcome:
              "Speculative. The attack takes ground where the committees agreed to it and " +
              "stops where they did not. The government has something to show the allies " +
              "and the army has not been destroyed proving it. The commanders who were told " +
              "that an order is now a proposal discover how much of a proposal can be " +
              "turned into an advance, and the answer is some, in some places, for a short " +
              "time." },
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
        next: "stavka_1917_12_deathpenalty",
        outcome:
          "Speculative. The command puts in writing that the army is not capable of " +
          "offensive operations. The divisions are not spent. The government is left " +
          "holding a war it cannot prosecute and cannot leave. The Allies, who lent the " +
          "money for the offensive, are told in writing that it will not be made, and " +
          "the commander who signed the paper has to wait for the government to decide " +
          "whether it can afford to keep him.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-07
  stavka_1917_12_deathpenalty: {
    year: 1917, date: "1917-07-12", city: "Mogilev",
    title: "Shooting at the Front",
    advisors: ["brusilov", "kerensky"],
    situation: (flags) =>
      "The offensive begun in June has turned into a retreat in Galicia, and units " +
      "are leaving their positions without orders. " +
      (flags.stavka_kerensky === "refused"
        ? "The army had said it could not attack, and the government has not been able to make it do so."
        : "The offensive that was made has ended as the commanders feared it would.") +
      "\n\nThe commander of the South-Western Front has sent the government an " +
      "ultimatum demanding that the death penalty be restored at the front, which " +
      "the Provisional Government abolished in March. The army's committees are " +
      "against it. The Minister of War is being asked whether the orders of the " +
      "command can still be enforced, and the committees will take the answer as " +
      "an answer to the question of who commands the army.",
    context:
      "A penalty that is ordered and not carried out is worse than none. A penalty " +
      "that is carried out by an officer on a soldier who belongs to a committee has " +
      "consequences that the order does not describe.",
    choices: [
      {
        id: "restore",
        label: "Restore the death penalty at the front and set up courts-martial",
        historical: true,
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { stavka_deathpenalty: "restored" },
        next: "stavka_1917_09_riga",
        outcome:
          "Kerensky sends telegraphic orders on 12 July instituting the death penalty " +
          "at the front, in response to the ultimatum. A few days later Kornilov, who " +
          "made the demand, is made Supreme Commander in place of Brusilov. The army's " +
          "committees are against the order, and it widens the distance between them " +
          "and the command. The officers, who wanted the penalty, now have it, and find " +
          "that using it on a unit that has voted against it is a different thing.",
      },
      {
        id: "refuse",
        label: "Refuse to restore it and rely on the commissars and the committees",
        gate: (m) => m.will >= -3,
        disabledReason: "The command cannot hold the retreat together on persuasion alone",
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { stavka_deathpenalty: "refused" },
        next: "stavka_1917_09_riga",
        outcome:
          "Speculative. The penalty is not restored. The retreat in Galicia is left to " +
          "the commissars and the committees, and the commander who made the ultimatum " +
          "has to be answered. The Supreme Command stays with the officers who say that " +
          "discipline can be built on consent. The units that would have been steadied " +
          "by the threat have to be steadied by argument, and the Galician front falls " +
          "back, as it was going to, at its own pace.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-08
  stavka_1917_09_riga: {
    year: 1917, date: "1917-08-19", city: "Mogilev",
    title: "The Daugava Is Crossed",
    advisors: [],
    situation:
      "On 19 August (1 September in the west) the Germans attack at Riga after a " +
      "bombardment of explosive and gas shells, and cross the Daugava south of " +
      "Ikskile. The Twelfth Army, under Parsky, is part of Klembovsky's Northern " +
      "Front, and on paper it outnumbers the force that has attacked it.\n\n" +
      "The Supreme Commander wants Riga held. The commanders on the spot want " +
      "to take the army out of it before it is surrounded, and a rearguard " +
      "of the Forty-third Corps would have to do the holding.",
    context:
      "Riga is a city, a bridge and a symbol, and the Supreme Commander has judged " +
      "most of the infantry to be in poor condition and likely to run. To " +
      "hold it is to find out whether that is true, with the army that has the " +
      "most to lose by the answer.",
    choices: [
      {
        id: "withdraw",
        label: "Let the Twelfth Army withdraw from Riga, covered by a rearguard",
        historical: true,
        advisor: { name: "Klembovsky", position:
          "The army can be taken out of Riga or it can be lost in Riga. A city is worth less than the army that would be left to hold it." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { stavka_riga: "withdrew" },
        next: "stavka_1917_13_kornilov",
        outcome:
          "On 20 August (2 September in the west) Parsky orders Riga abandoned and " +
          "tells the Forty-third Corps to delay the Germans while the army gets away. " +
          "The Twelfth Army escapes encirclement and many guns are left behind. " +
          "The rearguard has heavy losses, and the Latvian Riflemen lose more than " +
          "half their strength. Russian casualties are about 25,000, with " +
          "some 9,000 to 15,000 of them prisoners. Riga is in German hands on 21 " +
          "August (3 September in the west).",
      },
      {
        id: "hold",
        label: "Order the Twelfth Army to hold Riga",
        advisor: { name: "Kornilov", position:
          "Riga should be held. If the infantry will not hold it, the army is in worse shape than the government has been willing to say." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There are not the men on the Daugava to hold a city against a German army",
        impact: { manpower: -2, munitions: -1, will: 1 },
        erodes: "expose_regime",
        setFlags: { stavka_riga: "held" },
        next: "stavka_1917_13_kornilov",
        outcome:
          "Speculative. The Twelfth Army is ordered to stand, and what stands is a " +
          "fraction of what is on the books. The bombardment and the crossing " +
          "do what they did to the army that withdrew, to an army that has been " +
          "told to remain, and the line behind it is not yet a line. Whether " +
          "the infantry could have held is answered the hard way. The risk is " +
          "an army encircled in a city it was ordered to hold.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-08
  stavka_1917_13_kornilov: {
    year: 1917, date: "1917-08-27", city: "Mogilev",
    title: "The Supreme Commander Is Dismissed by Telegram",
    advisors: ["alekseyev", "kerensky"],
    situation: (flags) =>
      "Riga has fallen. The Supreme Commander, General Kornilov, who has held the post " +
      "since 18 July (31 July in the west), believes that a Bolshevik rising in " +
      "Petrograd is near, and he has ordered General Krymov's Third Cavalry Corps to " +
      "move toward the capital.\n\n" +
      "This morning, 27 August (9 September in the west), Kerensky telegraphed " +
      "Kornilov's dismissal, believing that the movement of the corps is the beginning of " +
      "a coup. " +
      (flags.stavka_deathpenalty === "restored"
        ? "The Supreme Commander is the officer who made the demand on which the death penalty was restored."
        : "The Supreme Commander is the officer whose demand was refused in July.") +
      "\n\nKornilov is at this headquarters, and the corps is on the road. The order to " +
      "stop it can come from one of two men, and they are not speaking to each other.",
    context:
      "Whether this is a coup or a misunderstanding is not clear from here, and is not " +
      "going to be settled in the next three days. The corps will arrive at Petrograd " +
      "or it will not.",
    choices: [
      {
        id: "refuse",
        label: "Refuse the dismissal and let the cavalry corps go on",
        historical: true,
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { stavka_kornilov: "refused" },
        dispute:
          "Whether Kornilov meant to take power or to carry out an arrangement made " +
          "with the government is disputed. Kerensky took the movement of the corps " +
          "for a coup, after an exchange of messages through an intermediary that the " +
          "two men understood differently, and Kornilov afterwards denied that he meant " +
          "to overthrow the government.",
        next: "stavka_1917_08_october",
        outcome:
          "The movement of 28 to 31 August (10 to 13 September in the west) collapses " +
          "without a battle. The Petrograd Soviet sets up a Committee for the Struggle " +
          "Against Counter-Revolution on the 28th, and the corps comes apart through low " +
          "morale and desertion. By the 30th the affair is over, Kornilov is under " +
          "arrest, and Alekseyev has come back as Chief of Staff. The Bolsheviks, who " +
          "were being blamed for July, come out of it with far more prestige.",
      },
      {
        id: "obey",
        label: "Obey the dismissal and recall the cavalry",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { stavka_kornilov: "obeyed" },
        next: "stavka_1917_08_october",
        outcome:
          "Speculative. The dismissal is accepted and the corps is turned back before " +
          "it reaches the capital. There is no march and no collapse of one. The " +
          "officers of the army have seen their commander dismissed by a telegram, and " +
          "the soviets have not been called out to defend anything. The Provisional " +
          "Government has been spared the test of what the army would have done, and " +
          "the army has been spared learning that its generals could not be trusted " +
          "with it.",
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
      (flags.stavka_kornilov === "refused"
        ? "\n\nThe Supreme Commander of the summer was arrested after the August affair, and " +
          "the army's officers have not forgotten it."
        : flags.stavka_kornilov === "obeyed"
          ? "\n\nThe Supreme Commander of the summer obeyed his dismissal in August, and the " +
            "army's officers have not forgotten that either."
          : "") +
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
        next: "stavka_1917_14_armistice",
        outcome:
          "The headquarters holds what it can hold and takes no side, which turns out " +
          "not to be a position that exists. The front dissolves by desertion rather " +
          "than by defeat, and the officer corps disperses toward the places where the " +
          "next war is being organised. The men go home with their rifles, and the " +
          "Germans, who have no need to attack, are content to watch. The army is not " +
          "defeated. It is demobilised without anyone having given the order.",
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
          "it, several months earlier than it historically did. The officers who go to " +
          "the Don with their men carry the German war with them as an afterthought, " +
          "and the Germans, who see an army turn on itself, wait for it to finish.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-11
  stavka_1917_14_armistice: {
    year: 1917, date: "1917-11-09", city: "Mogilev",
    title: "The Order to Open Talks",
    advisors: ["dukhonin"],
    situation:
      "The Council of People's Commissars has telephoned the Chief of Staff, who is now " +
      "acting as Supreme Commander. The order is to approach the German command " +
      "at once and propose an armistice on the whole front.\n\n" +
      "The front is held by men who are mostly going home, and the headquarters " +
      "commands them by the courtesy of their committees. The men who gave the order " +
      "say they speak for the soldiers and the people, and the soldiers' committees " +
      "have not said that they do not.",
    context:
      "To obey is to recognise the new authority and to open a negotiation the army " +
      "cannot stop. To refuse is to be dismissed, and a headquarters that has been " +
      "dismissed by wireless has nobody it can command.",
    choices: [
      {
        id: "refuse",
        label: "Decline the order: it can come only from a government the army and the country support",
        historical: true,
        advisor: { name: "Dukhonin", position:
          "An order to open negotiations has to come from a government that the army and the country stand behind, and this one has not shown that it does." },
        attested: { by: "Dukhonin", text: "a government sustained by the army and the country",
          source: "Reply to the Council of People's Commissars, 9 November 1917 (Old Style)" },
        impact: { manpower: -1, munitions: 0, will: -2 },
        setFlags: { stavka_armistice: "refused" },
        next: "stavka_end_brest",
        outcome:
          "Dukhonin gives evasive answers and then a refusal, and is dismissed on the " +
          "telephone line, and the commissars announce that Ensign Krylenko is " +
          "Supreme Commander in his place. Krylenko comes to Mogilev with sailors. On " +
          "20 November (3 December in the west) Dukhonin gives himself up and is " +
          "killed by a mob at the railway station, despite Krylenko's attempt to stop it.",
      },
      {
        id: "obey",
        label: "Carry out the order and approach the German command",
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { stavka_armistice: "obeyed" },
        next: "stavka_end_brest",
        outcome:
          "Speculative. The headquarters sends the proposal to the German command under " +
          "its own name. The new government has what it asked for and the army has a " +
          "commander it has not dismissed. The officers who would not have done it " +
          "leave for the Don, where Alekseyev is already beginning to gather them. The " +
          "headquarters has recognised an authority that it did not choose, and its " +
          "Chief of Staff is alive at the end of the month.",
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
      "The Second Army, August 1914: " + (flags.stavka_tannenberg === "halted" ? "halted at the frontier for its supply." : "left to press on.") + "\n" +
      "The Carpathians, March 1915: " + (flags.stavka_carpathians === "halted" ? "halted in the passes to refit." : "pressed on into the mountains.") + "\n" +
      "The Guards, summer 1916: " + (flags.stavka_kovel === "held" ? "kept in reserve." : "sent at the Stokhod for Kovel.") + "\n" +
      "Romania: " + (flags.stavka_romania === "army" ? "an army sent at once." : "three divisions sent.") + "\n" +
      "The death penalty: " + (flags.stavka_deathpenalty === "refused" ? "not restored." : "restored at the front on 12 July 1917.") + "\n" +
      "The Kornilov affair: " + (flags.stavka_kornilov === "obeyed" ? "the dismissal obeyed." : "the dismissal refused, and the march collapsed.") + "\n" +
      "Przemysl, winter 1914: " + (flags.stavka_przemysl === "stormed" ? "assaulted." : "invested and starved out.") + "\n" +
      "Lodz, November 1914: " + (flags.stavka_lodz === "silesia" ? "the Silesian offensive pressed on." : flags.stavka_lodzResult === "covered" ? "the Fifth Army turned north and covered the flank." : "the Fifth Army turned north and the Silesian offensive was given up.") + "\n" +
      "East Prussia, February 1915: " + (flags.stavka_masuria === "pulled" ? "the Tenth Army was drawn back to the Niemen." : "the border line was held and the Twentieth Corps lost.") + "\n" +
      "Sventsiany, September 1915: " + (flags.stavka_sventsiany === "withdrew" ? "the line was shortened." : "the breach was met by counterattack.") + "\n" +
      "Chantilly, December 1915: " + (flags.stavka_chantilly === "declined" ? "no commitment was made." : "Russia joined the plan for simultaneous offensives.") + "\n" +
      "Lake Naroch, March 1916: " + (flags.stavka_naroch === "refused" ? "the French request was declined." : "the offensive was made.") + "\n" +
      "The Romanian Front, December 1916: " + (flags.stavka_romfront === "limited" ? "only the Russian frontier was held." : "a front was formed in Moldavia under the King.") + "\n" +
      "The Allied missions, January 1917: " + (flags.stavka_petrograd === "promised" ? "a spring offensive was promised." : "the great offensives were put off.") + "\n" +
      "Riga, August 1917: " + (flags.stavka_riga === "held" ? "the Twelfth Army was ordered to hold." : "the Twelfth Army withdrew.") + "\n" +
      "The order to open talks: " + (flags.stavka_armistice === "obeyed" ? "carried out." : "declined; Dukhonin dismissed and killed.") + "\n" +
      "October 1917: " + (flags.stavka_october === "resisted" ? "the new authority was refused recognition." : "the headquarters took no side.") + "\n\n" +
      "The officers of this headquarters disperse toward the Don, toward Siberia, and " +
      "toward the new Republic's own army. What they do next is not this war." +
      "\n\n" +
      "What actually happened: The treaty was signed on 3 March 1918 and ratified " +
      "in the weeks after. It was annulled by the armistice of 11 November, and " +
      "the Soviet government repudiated it on 13 November. Poland, Finland and " +
      "the Baltic states became independent, and the rest of the lost territory " +
      "was fought over in the civil war that was already under way."
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
      "nothing in the field replaces it.\n\nWhat actually happened: The front did " +
      "dissolve. Desertion had been heavy since the summer, and after the " +
      "revolution of October the armistice signed at Brest-Litovsk on 2 December " +
      "(15 December in the west) only recognised what had occurred. The old army " +
      "was demobilised by decree over the winter of 1917 and 1918, and the men went " +
      "home. Nobody knows how many deserted, and the figures that are given are " +
      "estimates made by people who had reasons to make them large or small. What " +
      "remained of the front's formations was handed to the new government's " +
      "commissars, and some of its officers took what they could and went south.",
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
      "Speculative. The historical terms were severe. They were signed by people " +
      "who still had something, if only the ability to walk out of the " +
      "room.\n\nWhat actually happened: The Soviet delegation signed the treaty at " +
      "Brest-Litovsk on 3 March 1918, after the German advance of 18 February had " +
      "shown that nothing stood in its way. Russia gave up Poland, the Baltic " +
      "provinces and Ukraine and recognised Finland. Lenin insisted on signing " +
      "against the objections of the colleagues who wanted to go on with a " +
      "revolutionary war, and the terms were as heavy as they were because the " +
      "signatories had so little to bargain with. The treaty took away roughly a " +
      "third of the Empire's population and a great part of its coal, iron and " +
      "grain, and Russia was left with what was behind the line the Germans had " +
      "reached.",
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
      "Speculative. The historical civil war began from the same material a few " +
      "months later. Beginning it here means beginning it with the Germans still in " +
      "the field and the front not yet settled by treaty.\n\nWhat actually " +
      "happened: Alekseyev went to Novocherkassk in November, after the October " +
      "rising, and began to gather the officers who became the Volunteer Army. " +
      "Kornilov escaped from the prison at Bykhov and made his way to the Don. The " +
      "civil war began on the Don that winter, while the German front was left to " +
      "the armistice. The war that most of these officers died in was the one that " +
      "started early in the south, and not the one at the front. The generals' war " +
      "was against the soviets, and in some regions it lasted until 1920 and later.",
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
      "beyond the margin.\n\nWhat actually happened: No part of the front held. The " +
      "Germans resumed the advance on 18 February 1918, when the armistice had run " +
      "out, and the Russian formations that remained, with few officers and fewer " +
      "men, did not resist. Minsk was taken on 21 February, and Kiev on 2 March, " +
      "almost without fighting, and the treaty was signed on 3 March. The army of " +
      "this ending is one that was still there when the Germans arrived, and it was " +
      "not. The treaty that followed was the same treaty, with the same terms, and " +
      "was signed by a government that had been left with the same options.",
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
      "thing and remain the dynasty.\n\nWhat actually happened: Russia did not " +
      "leave the war on its own initiative in 1917. It was taken out of it by " +
      "revolution, first in March, when the Provisional Government that replaced " +
      "the monarchy pledged to continue the war with the Allies, and again in " +
      "November, when the government that replaced that one did not. The Emperor, " +
      "who in this ending makes a separate peace, did not do so, and the Allies' " +
      "loans went on until the revolution. A separate peace was talked about in the " +
      "Empire's last years, and the talk was one of the things that discredited the " +
      "court.",
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
      "have behaved differently over eighteen months, which is a great deal to ask " +
      "of a counterfactual.\n\nWhat actually happened: The capital did not hold " +
      "together. The strikes and the mutiny of the Petrograd garrison at the end of " +
      "February, Old Style, brought down the monarchy within about a week, and the " +
      "Emperor abdicated on 2 March (15 March in the west), while he was on his way " +
      "from headquarters to the capital. The political order that this ending " +
      "preserves did not survive the winter, and the army was told afterwards that " +
      "its command had advised it. The army heard of the abdication from its own " +
      "commanders, and its attitude to the Provisional Government that followed was " +
      "formed in the weeks after.",
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
      "oldest argument about this front. It is not going to be settled " +
      "here.\n\nWhat actually happened: Russia kept its obligations to the Allies " +
      "through 1917. The Provisional Government pledged to fight on and ordered the " +
      "offensive of June, whose failure left the army incapable of another, and the " +
      "Allies continued to supply it and to lend to its government until the " +
      "revolution of November. The army that honoured the promise made to the " +
      "French in 1914 and again in 1917 was not left in a condition to honour " +
      "another. That the Allies' own governments had not done more to equip the " +
      "Russian army before 1917 was a complaint on the Russian side for years.",
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
      "The staff is dispersed to other duties. The war continues without them and " +
      "does not go better.\n\nWhat actually happened: Alekseyev was Supreme " +
      "Commander from 2 March to 22 May 1917, when Brusilov replaced him. Brusilov " +
      "was replaced by Kornilov in July, and Kornilov was dismissed in August and " +
      "arrested. The Supreme Command changed hands several times in six months, and " +
      "each change was a political act. The reorganisations this ending describes " +
      "came as the war's own course and did not depend on any one decision. The " +
      "Provisional Government's difficulty in finding a Supreme Commander who both " +
      "the army and the ministers trusted was one of the signs of its weakness. " +
      "None of them held the post long enough to carry out a plan of his own, and " +
      "the army noticed.",
  },
};

// =============================================================================
// BRITISH EMPIRE — BEF AND WAR CABINET — HISTORICAL SPINE
// =============================================================================
//
// DESIGN. The seat is hybrid by design (spec §2.4). The office hears two kinds of
// voice: the field commander's (French, then Haig) and the Cabinet's (Asquith, then
// Lloyd George). Cabinet-level nodes are dated and framed as the Cabinet's decision
// reaching this office; no node puts the office in operational command of a theatre
// it did not command. The first node says so.
//
// SOURCING NOTE. Advisors carry `position`, not `quote`. A position is attributed to
// a named person only where the record supports it; where it does not, the choice
// carries no adviser. Claims are logged in claims/bef.json.
// =============================================================================

CAMPAIGNS.bef.startNode = "bef_1914_01_warcouncil";

CAMPAIGNS.bef.commanders = [
  { id: "french", name: "Sir John French", title: "Commander-in-Chief, British Expeditionary Force",
    from: "1914-08-04", to: "1915-12-20" },
  { id: "haig", name: "Sir Douglas Haig", title: "Commander-in-Chief, British Armies in France",
    from: "1915-12-21", to: "1918-11-11" },
];

CAMPAIGNS.bef.advisors = [
  { id: "french", name: "Sir John French", from: "1914-08-04", to: "1915-12-20",
    dossier: { role: "Commander-in-Chief, British Expeditionary Force, 1914-1915",
      bio: "A cavalry officer who commanded the BEF from its landing. Quarrelled with the French commander on the left of the line, wished to take the army out of it after Le Cateau, and gave a newspaper correspondent the facts about the shell shortage in May 1915.",
      fate: "Replaced in December 1915 and made Commander-in-Chief of the Home Forces. Lord Lieutenant of Ireland from 1918." } },
  { id: "haig", name: "Sir Douglas Haig", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Corps and army commander; Commander-in-Chief from December 1915",
      bio: "Commanded I Corps in 1914 and the First Army at Loos. Believed throughout in the possibility of a decisive breakthrough in the west, and in the duty of the army to keep attacking. Mistrusted by Lloyd George from the start of his premiership.",
      fate: "Created Earl Haig in 1919. Led the veterans' movement that became the British Legion until his death in 1928." } },
  { id: "kitchener", name: "Lord Kitchener", from: "1914-08-05", to: "1916-06-05",
    dossier: { role: "Secretary of State for War, 1914-1916",
      bio: "Came to the War Office on 5 August 1914, expected a long war and began raising a new army. Sent the first divisions to France in fewer numbers than promised and kept control of the rest.",
      fate: "Drowned on 5 June 1916 when HMS Hampshire was sunk on the way to Russia." } },
  { id: "asquith", name: "Asquith", from: "1914-08-04", to: "1916-12-05",
    dossier: { role: "Prime Minister, 1908-1916",
      bio: "Led the Liberal government into the war and the coalition that followed in May 1915. Presided over a Cabinet that decided by agreement and was criticised for it.",
      fate: "Resigned on 5 December 1916 and was succeeded by Lloyd George. Never held office again." } },
  { id: "lloydgeorge", name: "Lloyd George", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Chancellor, Minister of Munitions, Secretary of State for War, then Prime Minister from December 1916",
      bio: "Built the Ministry of Munitions from nothing in 1915. As Prime Minister distrusted the generals' judgement and tried to hold the army's manpower and strategy in civil hands.",
      fate: "Prime Minister until 1922." } },
  { id: "robertson", name: "Robertson", from: "1914-08-04", to: "1918-02-11",
    dossier: { role: "Quartermaster-General and Chief of Staff of the BEF; Chief of the Imperial General Staff from December 1915",
      bio: "Rose from the ranks. As Chief of the Imperial General Staff he was the Cabinet's principal military adviser and an advocate of concentrating in France. Backed Haig against Lloyd George until the Supreme War Council divided them.",
      fate: "Forced to resign as Chief of the Imperial General Staff in February 1918. Field Marshal in 1920." } },
  { id: "wilson", name: "Henry Wilson", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Sub-Chief of Staff of the BEF; liaison with the French; Chief of the Imperial General Staff from February 1918",
      bio: "Drew up the pre-war plans with the French staff, and was close to them throughout. Lloyd George's military favourite after 1917, and Robertson's successor.",
      fate: "Field Marshal in 1919. Shot dead outside his London home in June 1922." } },
  { id: "jellicoe", name: "Jellicoe", from: "1914-08-04", to: "1917-12-24",
    dossier: { role: "Commander-in-Chief of the Grand Fleet; First Sea Lord from December 1916",
      bio: "Commanded the fleet at Jutland. As First Sea Lord in the spring of 1917 was the Admiralty's head when the submarine campaign was at its worst and the convoy system was adopted.",
      fate: "Dismissed from the Admiralty in December 1917. Governor-General of New Zealand 1920 to 1924." } },
  { id: "churchill", name: "Churchill", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "First Lord of the Admiralty to May 1915; Minister of Munitions from July 1917",
      bio: "The chief advocate of the naval attack on the Dardanelles, and its political casualty. Served on the Western Front in 1915 and 1916 and returned to the government in July 1917.",
      fate: "Prime Minister in the next war." } },
  { id: "rawlinson", name: "Rawlinson", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Corps commander; Fourth Army commander at the Somme and at Amiens",
      bio: "Planned the Somme as a series of limited advances, and was told by Haig to aim higher. Directed the Fourth Army's attack at Amiens on 8 August 1918.",
      fate: "Commander-in-Chief in India from 1920. Died there in 1925." } },
  { id: "milner", name: "Milner", from: "1916-12-09", to: "1918-11-11",
    dossier: { role: "Member of the War Cabinet; Secretary of State for War from April 1918",
      bio: "A member of Lloyd George's five-man War Cabinet from its formation. Sent to France by the Prime Minister on 24 March 1918 and signed for Britain at Doullens.",
      fate: "Colonial Secretary 1919 to 1921." } },
];

CAMPAIGNS.bef.bulletinVoice = {
  source: "General Headquarters communiqué, as released through the Press Bureau and printed in the London papers",
  register: "Terse and hopeful, giving ground and prisoners in place of losses, with no word about casualties",
  defined: true,
};

CAMPAIGNS.bef.hardMode.forcedEndingId = "bef_end_relieved";
// Set from measurement (montecarlo.js hard, check-historical-ending.js): the historical line carries four erosion-tagged choices and survives at 5; about one random run in eleven is relieved.
CAMPAIGNS.bef.hardMode.erosionMax = 5;

CAMPAIGNS.bef.nodes = {

  // ---------------------------------------------------------------- 1914-08
  bef_1914_01_warcouncil: {
    year: 1914, date: "1914-08-12", city: "London",
    title: "Where the Army Lands",
    advisors: ["kitchener", "wilson", "asquith"],
    situation:
      "The Cabinet has decided that the Expeditionary Force will go to France, and on " +
      "6 August it decided that the first force would be four infantry divisions and the " +
      "cavalry division, not the six that had been promised. What is left to settle is " +
      "where it is to assemble.\n\n" +
      "The General Staff's plan, drawn up with the French by Henry Wilson, puts the " +
      "British on the left of the French armies, at Maubeuge, close to the frontier and " +
      "to the Belgians. Kitchener, who came to the War Office on 5 August, thinks the " +
      "army too small and too precious to be put so far forward, and would have it " +
      "assemble at Amiens, farther back, where it could strike once the route of the " +
      "German advance is known. Haig takes the same view.",
    context:
      "The office that sits at this table hears the Cabinet and the field commanders " +
      "both. It has no army of its own to command. It decides what the Cabinet decides, " +
      "and what the Cabinet can be made to hear from the generals, in the order they " +
      "arrive.",
    choices: [
      {
        id: "maubeuge",
        label: "Assemble at Maubeuge, on the French left, as the General Staff's plan says",
        historical: true,
        advisor: { name: "Henry Wilson", position:
          "The plan was made with the French, and the French have built theirs on it. Move the army and the left of their line is left to guess." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_landing: "maubeuge" },
        next: "bef_1914_02_seine",
        outcome:
          "After a three-hour meeting on 12 August in which Kitchener argues his case, the " +
          "Prime Minister overrules him, and the army assembles at Maubeuge. It takes its " +
          "place on the left of the French Fifth Army, and fights its first battle at Mons " +
          "on 23 August and begins the retreat that night. The soldiers who landed on the " +
          "French left are the ones who will bear the first German blow, and have no one " +
          "behind them to take it.",
      },
      {
        id: "amiens",
        label: "Assemble at Amiens, farther back, as Kitchener wants",
        advisor: { name: "Lord Kitchener", position:
          "Put the army where it can counterattack once the German line of march is known. In Belgium it would have to retreat almost at once and abandon its supplies." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { bef_landing: "amiens" },
        next: "bef_1914_02_seine",
        outcome:
          "Speculative. The army assembles at Amiens and takes the field some days later " +
          "and some distance behind the French left. It is fresher and less exposed when " +
          "the Germans arrive, and the French Fifth Army has the British for neighbours at " +
          "a later date than it expected. The French staff, who built their plan on " +
          "Maubeuge, are told by their ally that the army will not be there.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  bef_1914_02_seine: {
    year: 1914, date: "1914-09-01", city: "Paris",
    title: "Behind the Seine",
    advisors: ["french", "kitchener"],
    bulletin: {
      voice: "bef", date: "1914-08-31", source: "Communiqué of General Headquarters",
      text:
        "The British force continues to co-operate with the French armies in " +
        "the movements now in progress. The troops are in good heart.",
    },
    situation: (flags) =>
      "The army has fought at Mons and at Le Cateau and has been marching south for " +
      "nine days. " +
      (flags.bef_landing === "amiens"
        ? "It came into the line later than the French armies, and fresher. "
        : "") +
      "Sir John French, shaken by his losses and by the failure of the French on his " +
      "right to support him, is considering taking the army out of the line to refit " +
      "behind the Seine.\n\n" +
      "Joffre has urged him not to, and so has the President of the Republic, through " +
      "the British ambassador. Kitchener has crossed to Paris to see him, in the " +
      "uniform of a field marshal, and has put the matter in front of the Cabinet.",
    context:
      "The army has been the whole of Britain's land force in the field. Taking it out " +
      "of the line, even for a week, tells the French that the British are leaving the " +
      "alliance's battle at its worst moment.",
    choices: [
      {
        id: "stay",
        label: "Keep the army in the line, taking care not to be outflanked",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "The army must stay in the line with the French. It can take care not to be outflanked, but it cannot leave." },
        attested: { by: "Kitchener", text: "an instruction",
          source: "Telegram to the Cabinet, 1 September 1914" },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { bef_seine: "stayed" },
        dispute:
          "No independent account exists of what passed between French and Kitchener " +
          "when they spoke alone at the embassy on 1 September. French recorded it " +
          "afterwards as an agreement. Kitchener's telegram to the Cabinet records an " +
          "instruction. What is not disputed is that the army stayed in the line and that " +
          "each man had a different view of what had been said.",
        next: "bef_1914_03_ypres",
        outcome:
          "Kitchener telegraphs the Cabinet that the army will remain in the line, taking " +
          "care not to be outflanked, and tells French to regard the telegram as an " +
          "instruction. The retreat goes on for four more days. On 6 September the army " +
          "turns with the French. The commander of the BEF has been told by his own " +
          "government that he is not free to leave the alliance, and does not forget it.",
      },
      {
        id: "seine",
        label: "Withdraw behind the Seine to refit before returning to the line",
        gate: (m) => m.will >= 0,
        disabledReason: "The Cabinet will not allow the army to leave the line at this moment",
        impact: { manpower: 1, munitions: 0, will: -3 },
        setFlags: { bef_seine: "withdrew" },
        next: "bef_1914_03_ypres",
        outcome:
          "Speculative. The army leaves the line and marches for the Seine. The French " +
          "Fifth Army's left is open for a week at the moment that the Germans are turning " +
          "inside Paris, and the opening has to be filled from the French reserves. The " +
          "British are rested, and are told by their ally that they have left the line " +
          "at the hour they were most needed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  bef_1914_03_ypres: {
    year: 1914, date: "1914-10-21", city: "Saint-Omer",
    title: "The Last of the Old Army",
    advisors: ["french", "haig"],
    situation:
      "The army has been moved north from the Aisne to Flanders, to defend the Channel " +
      "ports and to join the Belgians and the French in a line to the sea. General " +
      "Foch commands the northern group of French armies without formal authority over " +
      "the British or the Belgians, and he and French agreed on 10 October to combine " +
      "their forces north and east of Lille.\n\n" +
      "Today German reserve corps made up of volunteers have begun to attack at " +
      "Langemarck in dense columns. They lose very heavily and gain little. Behind them " +
      "the German command is assembling fresh divisions for a larger blow.",
    context:
      "The ports are the army's supply line. A line farther back would be easier to " +
      "hold and would give up Ypres, and the Belgian coast with it.",
    choices: [
      {
        id: "hold",
        label: "Hold the Ypres line and the line to the coast with everything that arrives",
        historical: true,
        advisor: { name: "Haig", position:
          "The line has to be held where it stands. A step back at Ypres lets the Germans in front of the ports." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { bef_ypres: "held" },
        next: "bef_1915_04_dardanelles",
        outcome:
          "The line holds through the battle, which runs from 19 October to 22 November. " +
          "British losses between 14 October and the end of November are about 58,000. " +
          "Of the eighty-four infantry battalions that went to France in August, seventy-five " +
          "are under three hundred strong by 3 November, and eighteen are under one hundred. " +
          "The pre-war regular army has been spent, and the Channel ports are still in " +
          "Allied hands.",
      },
      {
        id: "coast",
        label: "Fall back toward the coast and shorten the line to cover Dunkirk and Calais",
        gate: (m) => m.will >= -1,
        disabledReason: "The French and the Belgians cannot be told that Ypres is to be given up",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { bef_ypres: "withdrew" },
        next: "bef_1915_04_dardanelles",
        outcome:
          "Speculative. The army withdraws toward a shorter line nearer the coast. Fewer " +
          "men are lost in the first weeks, and the Germans take Ypres and the high ground " +
          "round it, with the Belgian coast behind them. The ports are covered, and are " +
          "within range of guns that were not there before. The Belgian army, which has " +
          "been told to stand on the Yser, learns that its ally has stepped back.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-03
  bef_1915_04_dardanelles: {
    year: 1915, date: "1915-03-10", city: "London",
    title: "The Last Regular Division",
    advisors: ["kitchener", "churchill", "asquith"],
    situation: (flags) =>
      "The Navy is attacking the Dardanelles, in the belief that ships alone can force " +
      "the Straits, and an Anglo-French fleet has been bombarding the forts since 19 " +
      "February. " +
      (flags.bef_ypres === "withdrew"
        ? "The old army was not spent at Ypres, and there are formations that could be spared."
        : "The old army was spent at Ypres, and what is left at home is the new army, still in training.") +
      "\n\nOn 16 February Kitchener agreed to send the 29th Division, the last regular " +
      "division in Britain, to Lemnos as a back-up if the fleet should need an army. " +
      "Four days later he delayed its departure, and the War Council was not told. It " +
      "has still not sailed. Its release is the Cabinet's to give.",
    context:
      "The Navy's attack needs no soldiers. If it succeeds, the army was not wanted. If " +
      "it fails, the army is the only way left to try again, and it will have to go " +
      "by sea to a coast the enemy has had weeks to prepare.",
    choices: [
      {
        id: "release",
        label: "Release the 29th Division and prepare an army for the Dardanelles in case the fleet fails",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "If the fleet goes through, the army is there to occupy what it takes. If it does not, there is no other way." },
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { bef_dardanelles: "army" },
        next: "bef_1915_05_shells",
        outcome:
          "The division sails on 10 March. The fleet attacks on the 18th and loses three " +
          "battleships, and its commander calls off the attempt. The decision to try " +
          "again by land has been taken in effect before the fleet has failed, and the " +
          "troops go ashore on 25 April. The Cabinet has started a campaign in a second " +
          "theatre while the first is short of shells.",
      },
      {
        id: "hold",
        label: "Keep the division at home for France and leave the Dardanelles to the Navy",
        advisor: { name: "Winston Churchill", position:
          "The ships can do it alone, and if they cannot, then it is a decision the Cabinet can take when it sees what they have done." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { bef_dardanelles: "navy" },
        next: "bef_1915_05_shells",
        outcome:
          "Speculative. The 29th Division stays in England and goes to France in due " +
          "course. The Navy attacks on 18 March and fails with no army within reach to " +
          "follow it, and the enterprise ends with the fleet withdrawing. The Cabinet " +
          "has spent three battleships and a good deal of prestige on an attempt it was " +
          "not prepared to follow up.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-05
  bef_1915_05_shells: {
    year: 1915, date: "1915-05-14", city: "Saint-Omer",
    title: "The Times Prints It",
    advisors: ["french", "kitchener", "lloydgeorge"],
    bulletin: {
      voice: "bef", date: "1915-05-12", source: "Communiqué of General Headquarters",
      text:
        "Our troops have gained ground at several points on the front north of " +
        "Festubert. The artillery has done good work. The operations continue.",
    },
    situation:
      "On 9 May the British attacked at Aubers Ridge and were stopped with heavy " +
      "losses. Sir John French holds that the failure was due to a shortage of " +
      "high-explosive shells, and he has told so to Colonel Repington, the military " +
      "correspondent of The Times, who is at his headquarters.\n\n" +
      "The article will be in tomorrow's paper. The government has said the supply is " +
      "in hand. The Admiralty is in a quarrel over the Dardanelles that has already " +
      "put the Cabinet under strain.",
    context:
      "The shortage is real, and the War Office has not made it known. A statement " +
      "from the army to the press that the government is failing it is an act of war " +
      "against the government, whether it is meant as one or not.",
    choices: [
      {
        id: "tell",
        label: "Let the correspondent tell the country about the shortage",
        historical: true,
        advisor: { name: "Sir John French", position:
          "The army has been sent into battle without the shells to win it, and the country should be told who is responsible." },
        impact: { manpower: 0, munitions: 2, will: 0 },
        setFlags: { bef_shells: "told" },
        erodes: "defy_authority",
        dispute:
          "French's reasons for giving Repington the information are argued. One view " +
          "holds that he wished to bring the shortage before the country, which is what " +
          "followed. Another holds that he was looking for an explanation of the failure at " +
          "Aubers Ridge that did not fall on his own plans. Both can be true.",
        next: "bef_1915_06_loos",
        outcome:
          "The Times prints it on 14 May under a headline blaming the limited supply for " +
          "the checked attacks. On 15 May Fisher resigns as First Sea Lord over the " +
          "Dardanelles, and on the 17th the Liberal government gives way to a coalition. " +
          "Lloyd George becomes Minister of Munitions on 25 May, and the Munitions of War " +
          "Act follows. The army has the shells it wanted within a year, and has told the " +
          "country that the government was neglecting it.",
      },
      {
        id: "private",
        label: "Keep the shortage between General Headquarters and the War Office",
        advisor: { name: "Lord Kitchener", position:
          "The supply is being dealt with. A public quarrel between the army and the government helps nobody but the enemy." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { bef_shells: "private" },
        next: "bef_1915_06_loos",
        outcome:
          "Speculative. The shortage is pressed in letters and in conversation, and the " +
          "country is not told. The coalition does not come in May, and the Ministry of " +
          "Munitions is created later or not at all. The army goes on fighting with the " +
          "shells it has through the summer, and the quarrel between the Commander-in-Chief " +
          "and the Secretary of State goes on out of sight.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-08
  bef_1915_06_loos: {
    year: 1915, date: "1915-08-21", city: "London",
    title: "An Attack on Ground the Army Does Not Want",
    advisors: ["kitchener", "french", "haig"],
    situation: (flags) =>
      "Joffre is planning a great offensive in Artois and in Champagne for the autumn, " +
      "and has asked the British to attack beside him at Loos, south of the La Bassee " +
      "canal. French and Haig both regard the ground as unsuitable: it is flat, " +
      "overlooked by slag-heaps, and held by a line that has been fortified for a " +
      "year.\n\n" +
      (flags.bef_shells === "told"
        ? "The Ministry of Munitions is a few weeks old, and its first output has not reached the front. "
        : "The shell supply is still the army's chief grievance. ") +
      "Kitchener's view on 21 August is that the British must support the French " +
      "offensive, whatever the army thinks of the ground.",
    context:
      "The alliance is under strain. The French have been carrying most of the war " +
      "on the Western Front for a year, and have made it clear what they think of " +
      "British commitment.",
    choices: [
      {
        id: "attack",
        label: "Attack at Loos as Joffre asks, with the new divisions and with gas",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "We must support the French offensive, even if we dislike the ground. The alliance matters more than the terrain." },
        impact: { manpower: -1, munitions: -2, will: 0 },
        setFlags: { bef_loos: "attacked" },
        next: "bef_1915_07_reserves",
        outcome:
          "Kitchener overrules French and Haig on 21 August, and the attack is made. " +
          "The first British use of gas on the Western Front is on 25 September, and " +
          "it fails to silence the defenders and in places drifts back over the " +
          "British lines. The two commanders go into the battle against their own " +
          "advice, and each knows that the other will be asked who was responsible " +
          "for what happens.",
      },
      {
        id: "limited",
        label: "Refuse the ground at Loos and offer a smaller operation elsewhere",
        advisor: { name: "Haig", position:
          "The ground at Loos is bad. It would be better to attack somewhere else, or not to attack at all." },
        gate: (m) => m.will >= 0,
        disabledReason: "The Secretary of State has already given the order",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { bef_loos: "refused" },
        erodes: "defy_authority",
        next: "bef_1915_08_evacuate",
        outcome:
          "Speculative. The army tells Kitchener that it will not attack at Loos and " +
          "offers a smaller operation farther north. The French are given less than " +
          "they asked for, and say so. The army saves the casualties of the battle and " +
          "pays for them in the French staff's opinion of its ally. The Secretary of " +
          "State, who gave the order, has been told by his own generals that it will " +
          "not be carried out, and has to decide what to do about it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  bef_1915_07_reserves: {
    year: 1915, date: "1915-09-25", city: "Saint-Omer",
    title: "Where the Reserve Stands",
    advisors: ["french", "haig"],
    bulletin: {
      voice: "bef", date: "1915-09-24", source: "Communiqué of General Headquarters",
      text:
        "The bombardment on the front south of the La Bassee canal has been " +
        "maintained for several days. The weather is favourable.",
    },
    situation:
      "The attack at Loos has opened with success at the start. The general reserve, " +
      "XI Corps, three divisions made up of the Guards and the 21st and 24th, is " +
      "under the Commander-in-Chief's own hand and is held some four and a half miles " +
      "behind the line.\n\n" +
      "Haig, whose First Army is making the attack, wants the reserve close behind it, " +
      "so that it can go through if the line breaks. Foch has the same view. The two " +
      "new divisions have only just landed in France and have marched a long way.",
    context:
      "A reserve that is near can be used when the opening comes. One that is far has to " +
      "march to it, and the opening is not there when it arrives.",
    choices: [
      {
        id: "keep",
        label: "Keep XI Corps under the Commander-in-Chief's own hand until the break is certain",
        historical: true,
        advisor: { name: "Sir John French", position:
          "A reserve placed in the front line's hands is a reserve spent. I will release it when I know what is wanted." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { bef_reserves: "held" },
        dispute:
          "Responsibility for the late arrival of the reserves is still argued. French's " +
          "account puts it on Haig's request, which he says came too late. Haig's account " +
          "puts it on French's decision to keep the reserve so far back. Both accounts " +
          "agree on the result: the reserves crossed their start line at about six in the " +
          "evening.",
        uncertain: [
          { weight: 60, title: "The reserves arrive too late to use the opening", historicalBranch: true,
            impact: { manpower: -1 },
            setFlags: { bef_reservesResult: "late" },
            next: "bef_1915_08_evacuate",
            outcome:
              "The reserves do not reach the front until the evening of the first day, " +
              "and go into the attack tired, in the dark, against a German second line " +
              "that has been reinforced. British casualties at Loos by 8 October are " +
              "59,247. French's handling of the reserve is the main charge made against " +
              "him afterwards, and it is made by the army commanders under him, in " +
              "letters to the King's household." },
          { weight: 40, title: "The reserves arrive in time and are stopped by the second line",
            impact: { will: 1 },
            setFlags: { bef_reservesResult: "stopped" },
            next: "bef_1915_08_evacuate",
            outcome:
              "Speculative. The reserves reach the front earlier than they did, and meet " +
              "the German second position held in strength. They are stopped there with " +
              "the divisions that went before them, and the opening, if there was one, is " +
              "not used. The argument about where the reserve should have stood is lost " +
              "for both commanders, and the casualty list is longer." },
        ],
      },
      {
        id: "release",
        label: "Put XI Corps at Haig's disposal close behind the attack",
        advisor: { name: "Haig", position:
          "The reserve has to be where the commander of the attack can use it the moment the line gives way." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { bef_reserves: "released" },
        next: "bef_1915_08_evacuate",
        outcome:
          "Speculative. The reserve stands close behind the first line and goes forward " +
          "in the first hours. Whether it takes the German second position, or is " +
          "stopped in front of it with the first divisions, is not something the record " +
          "can answer. The Commander-in-Chief has given up control of the one force that " +
          "he might have used to exploit a success of his own.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-11
  bef_1915_08_evacuate: {
    year: 1915, date: "1915-11-22", city: "London",
    title: "A Campaign That Has Stopped",
    advisors: ["kitchener", "churchill", "asquith"],
    situation: (flags) =>
      "The landing at Gallipoli in April was followed by months of fighting on three " +
      "small beachheads, and the army is held on ground that it cannot leave and cannot " +
      "advance from. General Hamilton has been replaced by General Monro, who proposed " +
      "evacuation on arrival. Kitchener has gone out to see the ground for himself and " +
      "has come to agree. " +
      (flags.bef_dardanelles === "navy"
        ? "No army was ever landed, and the question that is put to the Cabinet is different: whether to begin a campaign at all."
        : "Winter is coming, and the Cabinet has to decide whether to stay.") +
      "\n\nThe army in Gallipoli numbers some 93,000 men and 200 guns. The alternative " +
      "to evacuating is to reinforce it, with divisions that France and Salonika are also " +
      "asking for.",
    context:
      "The decision belongs to the Cabinet, and this office carries it out. An " +
      "evacuation in the face of the enemy is the hardest operation in war, and the " +
      "estimates of what it would cost run as high as half the force.",
    choices: [
      {
        id: "evacuate",
        label: "Evacuate Anzac and Suvla now, and Helles when the others are clear",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "Having seen the ground myself, I do not believe the army can do more there than hold, and holding it through the winter is not worth the price." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_evacuate: "evacuated" },
        next: "bef_1915_09_succession",
        outcome:
          "The Cabinet decides on 22 November to evacuate Anzac and Suvla. The evacuation " +
          "of Anzac begins on 15 December, with 36,000 men taken off in five nights, and " +
          "the last party leaves in the early hours of 20 December. The British leave " +
          "Helles on the night of 8 January 1916. Some hundred thousand men are taken off " +
          "secretly and with very small loss, which is the most successful part of the " +
          "whole campaign, and which is also its end.",
      },
      {
        id: "stay",
        label: "Reinforce the army and stay through the winter",
        advisor: { name: "Winston Churchill", position:
          "The campaign has not yet been given the force it needed. To leave now is to say that everything spent has been spent for nothing." },
        gate: (m) => m.manpower >= -2,
        disabledReason: "The divisions for another attempt are not there, and France is asking for them",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { bef_evacuate: "stayed" },
        erodes: "defy_authority",
        next: "bef_1915_09_succession",
        outcome:
          "Speculative. Divisions are sent to the Dardanelles that would otherwise go to " +
          "France or Salonika, and the army stays on three beachheads through the winter. " +
          "Whether the reinforced army can do what the first could not is not something " +
          "the record can say. Kitchener, who has seen the ground, has been overruled " +
          "by the people who have not.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-12
  bef_1915_09_succession: {
    year: 1915, date: "1915-12-15", city: "London",
    title: "A New Commander-in-Chief",
    advisors: ["asquith", "robertson", "haig", "french"],
    situation:
      "Loos has been fought and lost, and the charge against Sir John French is that he " +
      "mishandled the reserves. Haig has written to the King's household about it. The " +
      "Prime Minister and the Secretary of State have decided that the Commander-in-Chief " +
      "has to go.\n\n" +
      "French is offered the chance to resign. The officers under him have given " +
      "their opinion of who should take his place, and the opinion of the army " +
      "commanders is for Haig. The other name is Robertson's, who is Chief of Staff of " +
      "the army and has no wish to leave the War Office.",
    context:
      "A change of Commander-in-Chief changes what the army will be asked to do. Haig " +
      "believes more strongly than French in the possibility of a decisive blow, and " +
      "is less willing to be told otherwise.",
    choices: [
      {
        id: "haig",
        label: "Accept French's resignation and appoint Haig",
        historical: true,
        advisor: { name: "Robertson", position:
          "The army has lost faith in its Commander-in-Chief. The right man to follow him is the one the army trusts." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_succession: "haig" },
        next: "bef_1916_10_conscription",
        outcome:
          "French resigns on 15 December and goes home as Commander-in-Chief of the Home " +
          "Forces. Haig takes over on 21 December, and Robertson goes to the War Office as " +
          "Chief of the Imperial General Staff two days later. The new Commander-in-Chief " +
          "has been chosen by the army and not by the Cabinet, and the Cabinet will remember " +
          "that when it has cause to disagree with him.",
      },
      {
        id: "keep",
        label: "Keep French in command through the winter and decide in the spring",
        advisor: { name: "Sir John French", position:
          "My handling of the reserves was my own judgment, and the army has not suffered by it so much as my critics say." },
        gate: (m) => m.will >= 1,
        disabledReason: "The Prime Minister cannot keep a commander the army's own generals are writing against",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { bef_succession: "french" },
        next: "bef_1916_10_conscription",
        outcome:
          "Speculative. French stays through the winter and is replaced in the spring " +
          "if the army still wants it. The planning for the summer is done by a " +
          "Commander-in-Chief whose own army commanders have lost confidence in him, " +
          "and who has been told so. The letters that Haig and others have been writing " +
          "go on, and the Cabinet has shown that it will not act on them. The Prime " +
          "Minister keeps a commander he does not trust, and the army knows it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-01
  bef_1916_10_conscription: {
    year: 1916, date: "1916-01-05", city: "London",
    title: "Compulsion",
    advisors: ["asquith", "lloydgeorge", "kitchener", "robertson"],
    situation:
      "The army has been raised by volunteers, and the volunteers are running out. The " +
      "Derby scheme, a canvass of every man of military age in the country, has produced " +
      "fewer men than were expected, and many of the unmarried men who attested have " +
      "not come forward.\n\n" +
      "Asquith has promised that married men will not be called before the single ones " +
      "are, and he is about to bring in a Bill to compel the single. Many Liberals and " +
      "the whole of the Labour movement are against compulsion on principle, and the " +
      "Home Secretary is going to resign.",
    context:
      "The army needs men for the offensive that has been agreed with the French for the " +
      "summer. Compulsion is the way to get them, and a political price must be paid " +
      "for it.",
    choices: [
      {
        id: "compel",
        label: "Bring in a Bill to compel the unmarried men",
        historical: true,
        advisor: { name: "Robertson", position:
          "The army cannot be kept up to strength by volunteers. If we are to fight the war that we are fighting, the men will have to be called." },
        impact: { manpower: 3, munitions: 0, will: -1 },
        setFlags: { bef_conscription: "compulsion" },
        next: "bef_1916_11_somme",
        outcome:
          "The Military Service Act receives the royal assent on 27 January and takes effect " +
          "on 17 February. Thirty-five Liberal members vote against it, with thirteen " +
          "Labour members and the Irish Nationalists, and the Home Secretary, Sir John " +
          "Simon, resigns. A second Act in May extends liability to married men. The army " +
          "has its drafts for the summer, and the Cabinet has spent some of the goodwill " +
          "it had in the country.",
      },
      {
        id: "voluntary",
        label: "Keep to the voluntary system and extend the Derby scheme",
        advisor: { name: "Asquith", position:
          "A promise has been given to the country and the Labour movement, and a government that breaks it may not be able to govern." },
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { bef_conscription: "voluntary" },
        next: "bef_1916_11_somme",
        outcome:
          "Speculative. The voluntary system is kept, and the Derby scheme is extended with " +
          "more pressure on the men who have not come forward. The Cabinet keeps the " +
          "peace with the Labour movement and the Liberals. The army reaches the summer " +
          "with fewer men than it was told to expect, and the offensive is planned for " +
          "an army of a smaller size.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-05
  bef_1916_11_somme: {
    year: 1916, date: "1916-05-16", city: "Montreuil",
    title: "A Breakthrough, or a Bite",
    advisors: ["haig", "rawlinson", "robertson"],
    bulletin: {
      voice: "bef", date: "1916-05-14", source: "Communiqué of General Headquarters",
      text:
        "There is nothing of importance to report on the British front. Our patrols " +
        "have been active, and the enemy's artillery has been less so.",
    },
    situation:
      "The offensive agreed at Chantilly is to be made on the Somme, with the British " +
      "to the north of the river and the French to the south. Haig, who has commanded " +
      "the army for five months, wants a great breakthrough, followed by cavalry " +
      "pouring through the gap into open country.\n\n" +
      "Rawlinson, whose Fourth Army will make the attack, has little faith in a " +
      "breakthrough. His plan is for limited advances to take the high ground, a pause " +
      "to break up the German counter-attacks, and then another advance. He has " +
      "submitted it and Haig has said it is not ambitious enough.",
    context:
      "A plan that tries for a breakthrough needs more men, more guns and more reserves " +
      "than the army has, and is judged by whether the gap opens. One that tries for " +
      "a bite is judged by the ground it holds, and is a smaller thing to promise.",
    choices: [
      {
        id: "compromise",
        label: "Approve Rawlinson's plan, with the cavalry ready for exploitation if the line breaks",
        historical: true,
        advisor: { name: "Haig", position:
          "The plan must aim at a real success. If the line breaks, the cavalry must be there to go through it." },
        impact: { manpower: -2, munitions: -2, will: 0 },
        setFlags: { bef_somme: "compromise" },
        dispute:
          "Whether the Somme was an exercise in futility or a necessary stage in wearing " +
          "down the German army is disputed, and has been since 1916. Critics point to " +
          "the cost of the first day and the lack of any breakthrough. Defenders point to " +
          "the strain placed on the German army, and to the lessons that the British army " +
          "learned. The plan itself is usually described as an uneasy compromise between " +
          "two different ideas of what the attack was for.",
        uncertain: [
          { weight: 70, title: "A costly first day and no breakthrough", historicalBranch: true,
            impact: { manpower: -1 },
            setFlags: { bef_sommeResult: "attrition" },
            next: "bef_1916_12_tanks",
            outcome:
              "The plan that emerges is a compromise between the two ideas, and Rawlinson " +
              "has in practice ignored much of what the Commander-in-Chief asked for. The " +
              "attack opens on 1 July after a week of bombardment, and the first day " +
              "costs the army some 57,000 casualties, nearly 20,000 of them killed. The " +
              "battle goes on until November without a breakthrough. It is the largest " +
              "British battle of the war so far, and the biggest the army has ever " +
              "fought." },
          { weight: 30, title: "The bombardment does more than the record shows",
            impact: { will: 1 },
            setFlags: { bef_sommeResult: "gain" },
            next: "bef_1916_12_tanks",
            outcome:
              "Speculative. The bombardment does more damage to the German wire and " +
              "dugouts than it did, and the infantry reach their first objectives along " +
              "more of the front. The gains are real and are not followed by a " +
              "breakthrough, and the cavalry are not used. The Commander-in-Chief has a " +
              "better first day to report, and the same argument about what it was for." },
        ],
      },
      {
        id: "bitehold",
        label: "Adopt Rawlinson's method in full: limited advances, and no attempt at a breakthrough",
        advisor: { name: "Rawlinson", position:
          "The army is not able to break the line in one blow. It can take the high ground and hold it, and then do it again." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { bef_somme: "bitehold" },
        next: "bef_1916_12_tanks",
        outcome:
          "Speculative. The plan aims only at the ground that can be taken and held, with " +
          "the cavalry kept back. The first day's attack is smaller in its aims and not " +
          "necessarily smaller in its cost, since the German positions are what they are. " +
          "The Commander-in-Chief has decided that his army is not what he thought it " +
          "was, and tells the French that their ally will make a smaller contribution " +
          "than the one agreed at Chantilly.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-09
  bef_1916_12_tanks: {
    year: 1916, date: "1916-09-13", city: "Montreuil",
    title: "Forty-Nine Tanks",
    advisors: ["haig", "lloydgeorge"],
    situation:
      "The first tanks are in France: some sixty of them, of which forty-nine are " +
      "ready to fight. Lloyd George, when he was Minister of Munitions, ordered a " +
      "hundred of them in February. The officers who built them, with Colonel Swinton " +
      "at their head, want them held back until enough are ready for a mass attack on " +
      "ground that has been chosen for them, so that the first use is a surprise.\n\n" +
      "The Somme has been going on for ten weeks, and the army needs a success. Haig is " +
      "eager to try the new machines as soon as they are ready, and the Fourth Army's " +
      "attack on the 15th is the next chance.",
    context:
      "A weapon can be used once for the first time. Spent in small numbers on a " +
      "difficult field, it teaches the enemy what to expect, and held back, it is " +
      "not available when it is needed.",
    choices: [
      {
        id: "now",
        label: "Use the forty-nine tanks in the attack of 15 September",
        historical: true,
        advisor: { name: "Haig", position:
          "The machines are ready, and the army needs every help it can get. They should go in as soon as there are enough to make a difference." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { bef_tanks: "used" },
        dispute:
          "Whether the first use of the tanks on the Somme was premature is argued. " +
          "Swinton and others held that it threw away the surprise for a limited success. " +
          "Haig's defenders hold that the army could not wait, and that the lessons of the " +
          "first use were what made the later successes possible. Both agree that the " +
          "results on the day were mixed.",
        uncertain: [
          { weight: 60, title: "A limited success, and the surprise is gone", historicalBranch: true,
            impact: { will: 0 },
            setFlags: { bef_tanksResult: "spent" },
            next: "bef_1917_13_calais",
            outcome:
              "Forty-nine tanks go into the attack at Flers and Courcelette on 15 " +
              "September, and many break down or are ditched before they reach the German " +
              "line. A few help in the capture of Flers and give the infantry some help " +
              "where they reach it. The Germans learn what the new weapon is. The tank's " +
              "first battle is a limited success, and its surprise is gone for good." },
          { weight: 40, title: "The lessons outweigh the lost surprise",
            impact: { will: 1 },
            setFlags: { bef_tanksResult: "lessons" },
            next: "bef_1917_13_calais",
            outcome:
              "Speculative. The first use teaches the staff more than the enemy. The " +
              "crews, the infantry and the gunners learn how the machines can be used " +
              "together, and the improvements that follow make the later attacks " +
              "possible. The Germans, who have seen a few tanks, are slow to see what " +
              "they mean. The surprise was spent, and it bought what a surprise could " +
              "not." },
        ],
      },
      {
        id: "wait",
        label: "Hold the tanks until enough are ready for a surprise attack on chosen ground",
        advisor: { name: "Colonel Swinton", position:
          "A weapon used in handfuls on a bad field is a weapon thrown away. Wait until there are enough to make a surprise." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { bef_tanks: "held" },
        next: "bef_1917_13_calais",
        outcome:
          "Speculative. The tanks are held back, and the attack of 15 September goes in " +
          "without them. The army has to fight on the Somme with what it had before, " +
          "and the tanks are kept for a mass attack the following year, on ground " +
          "chosen for them. The Germans do not see the machine until it comes in force.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-02
  bef_1917_13_calais: {
    year: 1917, date: "1917-02-26", city: "Calais",
    title: "Under a French General",
    advisors: ["lloydgeorge", "haig", "robertson"],
    bulletin: {
      voice: "bef", date: "1917-02-24", source: "Communiqué of General Headquarters",
      text:
        "Local operations on the Ancre front have been carried out by our " +
        "troops with satisfactory results. The enemy is retiring at some " +
        "points.",
    },
    situation: (flags) =>
      "Lloyd George has been Prime Minister for eleven weeks. He does not believe " +
      "in the Somme policy, and has accepted a plan of Nivelle's that offers a quick " +
      "decision at the Aisne. " +
      (flags.bef_somme === "bitehold"
        ? "The army made a smaller attack on the Somme, and is stronger than it would have been."
        : "The army is tired after the Somme.") +
      "\n\nThe conference at Calais is called, on the face of it, to discuss the railways " +
      "that will carry the spring offensive. Lloyd George, with the approval of the " +
      "War Cabinet, has a different purpose: to place the British army under Nivelle for " +
      "the duration of the offensive. He has not told Haig or Robertson.",
    context:
      "A Prime Minister who can put the army under a foreign general is a Prime " +
      "Minister who can put it under anyone. Haig and Robertson have to decide what " +
      "they will accept, and what they will resign over.",
    choices: [
      {
        id: "accept",
        label: "Accept the arrangement for the duration of the offensive, under protest",
        historical: true,
        advisor: { name: "Lloyd George", position:
          "The Allies have spent two years losing separately. Under a single direction for one campaign, the army will at least be used as part of a whole." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { bef_calais: "accepted", xc_calais: "accepted" },
        erodes: "defy_authority",
        next: "bef_1917_14_convoy",
        outcome:
          "By the Calais agreement of 27 February Haig is formally subordinated to Nivelle " +
          "for the duration of the offensive. The next day Haig and Robertson tell the " +
          "Prime Minister that they will resign rather than carry it out, and the " +
          "arrangement is watered down, with more freedom for the British. The conference " +
          "leaves mistrust between the British government and its generals that lasts " +
          "to the end of the war, and sets back the cause of unified command until " +
          "the spring of 1918.",
      },
      {
        id: "refuse",
        label: "Refuse the subordination and offer to coordinate by agreement",
        advisor: { name: "Robertson", position:
          "The army cannot be placed under the orders of a foreign general by a Prime Minister who has not consulted its own commander." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_calais: "refused", xc_calais: "refused" },
        next: "bef_1917_14_convoy",
        outcome:
          "Speculative. The Cabinet is told that the army will not serve under Nivelle, " +
          "and the Prime Minister has to decide whether to overrule his generals or " +
          "give way. The offensive goes forward with the British under their own " +
          "commander, and the French are told they have an ally who will cooperate " +
          "and will not obey. Lloyd George's opinion of his generals is confirmed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-04
  bef_1917_14_convoy: {
    year: 1917, date: "1917-04-30", city: "London",
    title: "The Admiralty and the Convoy",
    advisors: ["lloydgeorge", "jellicoe"],
    bulletin: {
      voice: "bef", date: "1917-04-28", source: "Communiqué of the Admiralty",
      text:
        "The weekly return of arrivals and sailings of merchant vessels at ports of the " +
        "United Kingdom shows that shipping continues to move in the usual volume.",
    },
    situation: (flags) =>
      (flags.xc_usw === "restricted"
        ? "The Germans are keeping to prize rules, and the losses at sea are a fraction of what the Admiralty feared, but they are as high as the country can bear, and the case for convoy is being argued on arithmetic and not on alarm. "
        : "April has been the worst month of the war at sea: 373 ships of 873,754 tons " +
          "sunk, Allied and neutral, and the rate has not eased. ") +
      (flags.bef_dardanelles === "navy"
        ? "The Navy's strength has not been drawn off to a second theatre, and the escorts exist in greater numbers."
        : "The Navy's destroyers are spread across several theatres.") +
      "\n\nThe Admiralty has argued for two years against convoy: that it would " +
      "bunch the ships into targets, that there are not enough escorts, and that the " +
      "ports could not handle the arrivals. Its anti-submarine division has " +
      "recommended it, and the First Sea Lord, Jellicoe, has approved a trial. The Prime " +
      "Minister is going to the Admiralty to see for himself.",
    context:
      "Britain has some weeks of wheat in the country. A decision about convoy is a " +
      "decision about whether the war can be kept going at all, and the Cabinet has " +
      "to decide how hard to press it.",
    choices: [
      {
        id: "convoy",
        label: "Order the convoy system tried at once, in the Atlantic trade",
        historical: true,
        advisor: { name: "Lloyd George", position:
          "The losses are such that it must be tried. Whatever the objections, we cannot go on losing ships at this rate." },
        impact: { manpower: 0, munitions: 1, will: 2 },
        setFlags: { bef_convoy: "adopted" },
        dispute:
          "Lloyd George later said that he forced convoy on an unwilling Admiralty. The " +
          "Admiralty's own anti-submarine division had recommended it on 26 April, and " +
          "Jellicoe had approved the plan on the 27th, three days before the visit. " +
          "Historians differ over how much the Prime Minister's pressure changed what the " +
          "Admiralty was already doing.",
        next: "bef_1917_15_ypres3",
        outcome:
          "The first convoy leaves Gibraltar on 10 May, seventeen ships with two " +
          "escorts, and arrives safely in Britain twelve days later. The system is " +
          "extended through the summer, and the losses fall. The decision that mattered " +
          "most was made in the same week as the visit, and its credit is argued over " +
          "by the people who made it. It is among the few decisions of the war whose " +
          "effect is clear.",
      },
      {
        id: "patrols",
        label: "Leave the matter to the Admiralty and continue with patrols and sweeps",
        advisor: { name: "Jellicoe", position:
          "Convoy needs escorts that we have not got, and a system of ports that cannot take the arrivals. We must try the other methods first." },
        impact: { manpower: 0, munitions: -2, will: -2 },
        setFlags: { bef_convoy: "delayed" },
        nextIf: (m) => (m.will <= -5 ? "bef_end_shipping" : null),
        next: "bef_1917_15_ypres3",
        outcome:
          "Speculative. The Admiralty goes on with patrols, sweeps and hunting groups, " +
          "and convoy is tried later. Shipping losses continue at about the April rate " +
          "through the summer, and the stock of wheat in the country falls. The Prime " +
          "Minister has asked the Admiralty to hurry and been told that it is doing " +
          "all it can.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-07
  bef_1917_15_ypres3: {
    year: 1917, date: "1917-07-25", city: "London",
    title: "Flanders Again",
    advisors: ["haig", "robertson", "lloydgeorge", "milner"],
    bulletin: {
      voice: "bef", date: "1917-07-23", source: "Communiqué of General Headquarters",
      text:
        "Our artillery has been active on the Ypres front, and has dealt " +
        "effectively with the enemy's batteries. Aerial reconnaissance has been " +
        "continuous.",
    },
    situation: (flags) =>
      "Haig wants an offensive in Flanders, to break out of the Ypres salient, take " +
      "the Belgian coast and the submarine bases on it, and relieve the French, whose " +
      "army has not recovered from the spring. " +
      (flags.bef_calais === "accepted"
        ? "The Calais arrangement is a few months old, and its memory is not a good one."
        : "The Prime Minister's confidence in his generals is not high.") +
      "\n\nLloyd George does not believe it can succeed. The Allies have only a small " +
      "superiority in Flanders and parity in artillery, and the Americans are coming. " +
      "He would rather wait. Robertson backs Haig, and is the Cabinet's military " +
      "adviser.",
    context:
      "A Prime Minister can veto an offensive. He cannot replace the Commander-in-Chief " +
      "and the Chief of the Imperial General Staff together without a political " +
      "crisis, and the War Cabinet is divided about whether it would be worth one.",
    choices: [
      {
        id: "authorise",
        label: "Allow Haig's offensive in Flanders to go ahead",
        historical: true,
        advisor: { name: "Robertson", position:
          "The army has to be allowed to fight. A veto means taking the responsibility for a campaign that the Cabinet will not conduct itself." },
        impact: { manpower: -2, munitions: -2, will: -1 },
        setFlags: { bef_ypres3: "authorised" },
        dispute:
          "Whether the Third Battle of Ypres was justified is disputed. Its defenders " +
          "point to the strain it put on the German army and the need to relieve the " +
          "French. Its critics point to the cost, the mud and the small ground gained. " +
          "The casualty figures for both sides are themselves argued over.",
        next: "bef_1918_16_manpower",
        outcome:
          "Lloyd George grudgingly withdraws his veto, and the offensive opens on 31 July. " +
          "It runs until 10 November, in rain and mud that the guns have made, and ends " +
          "with the village of Passchendaele taken and the Belgian coast still in German " +
          "hands. The Prime Minister's distrust of Haig, and of Robertson who backed him, " +
          "is now settled, and he begins to look for a way to deal with both.",
      },
      {
        id: "veto",
        label: "Veto the offensive and wait for the American army",
        advisor: { name: "Lloyd George", position:
          "I will not be a party to another Somme. The army should wait until the Americans are in the line and then attack with enough men." },
        gate: (m) => m.will >= 1,
        disabledReason: "A Prime Minister cannot veto the Commander-in-Chief and the Chief of the Imperial General Staff together",
        impact: { manpower: 2, munitions: 1, will: -3 },
        setFlags: { bef_ypres3: "vetoed" },
        erodes: "defy_authority",
        next: "bef_1918_16_manpower",
        outcome:
          "Speculative. The Flanders offensive is not allowed, and the army spends the " +
          "summer on smaller operations. The French, who were expecting the British to " +
          "relieve them, are told that they must wait. The Prime Minister has used his " +
          "authority over the generals once, and has made it clear that he will use it " +
          "again. Haig and Robertson have to decide whether to accept the decision or " +
          "to resign, and the Cabinet has to decide what it will do if they do.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-01
  bef_1918_16_manpower: {
    year: 1918, date: "1918-01-09", city: "London",
    title: "The Line and the Men",
    advisors: ["lloydgeorge", "haig", "robertson"],
    situation: (flags) =>
      "The army is about 70,000 men short, and expects a German offensive in the spring. " +
      "The War Cabinet has decided to send 100,000 men of the best category to France " +
      "in the next months, against the 615,000 the army has asked for, and to hold " +
      "another 120,000 at home as a reserve. " +
      (flags.bef_ypres3 === "vetoed"
        ? "The army was spared the losses of a long autumn, and is stronger than it would have been."
        : "The losses of the autumn in Flanders have not been made good.") +
      "\n\nPetain has asked the British to take over more of the French front, down " +
      "to Barisis, a line that would need six more divisions in the front. The French " +
      "have been carrying the war for longer and are in worse condition." +
      (flags.xc_usw === "restricted" ? "\n\nThe Americans are not coming. The United States is not at war with Germany, and the Allies cannot count on a single division from her in 1918." : ""),
    context:
      "To take the front is to go into the spring with a longer line and fewer men to " +
      "hold it. To refuse is to tell the French that their ally is keeping its men " +
      "for itself.",
    choices: [
      {
        id: "extend",
        label: "Take over the line to Barisis as Petain asks, with the men the Cabinet allows",
        historical: true,
        advisor: { name: "Haig", position:
          "The French are asking what they need. We will take the line, and I will ask the Cabinet for the men to hold it." },
        impact: { manpower: -2, munitions: 0, will: 0 },
        setFlags: { bef_manpower: "extended" },
        dispute:
          "Whether the Cabinet's holding back of men left the Fifth Army too weak to " +
          "stand in March is one of the oldest quarrels of the war. The Prime Minister " +
          "said afterwards that the army had more men than it had a year before. Haig's " +
          "supporters said that the men were in the wrong places and the line was " +
          "longer. The figures can be read either way.",
        next: "bef_1918_17_reserve",
        outcome:
          "The British take over the sector as far as Barisis, a front needing six " +
          "more divisions. Between January and the end of March the army receives " +
          "174,379 men, some 32,000 of them Dominion troops, and does not reach its strength. " +
          "The Fifth Army, which holds the longest and weakest part of the line, has " +
          "a front of forty-two miles with fourteen infantry divisions.",
      },
      {
        id: "refuse",
        label: "Refuse the extension until the reinforcements arrive",
        advisor: { name: "Robertson", position:
          "The army cannot take on a longer line without more men. The French must wait until the men are in France." },
        gate: (m) => m.will >= -1,
        disabledReason: "The Cabinet has already told the French that the line will be taken over",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { bef_manpower: "refused" },
        erodes: "defy_authority",
        next: "bef_1918_17_reserve",
        outcome:
          "Speculative. The extension is delayed, and the French are told that they " +
          "must hold what they have for some weeks longer. The British line is shorter " +
          "when the German offensive comes, and the French line is longer. Clemenceau " +
          "and Petain say what they think of an ally who takes the French armies' " +
          "losses and gives them nothing in return.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  bef_1918_17_reserve: {
    year: 1918, date: "1918-03-01", city: "Montreuil",
    title: "A Reserve for the Whole Front",
    advisors: ["haig", "wilson"],
    situation: (flags) =>
      "At the Rapallo conference in November the Allied governments set up a Supreme " +
      "War Council at Versailles, with a general reserve under an executive committee " +
      "to be chaired by Foch. Lloyd George hoped that it would limit the authority of " +
      "Haig and of Robertson. " +
      (flags.bef_manpower === "extended"
        ? "Robertson resigned on 11 February and Henry Wilson is Chief of the Imperial General Staff."
        : "Robertson resigned on 11 February over the general reserve, and Henry Wilson is Chief of the Imperial General Staff.") +
      "\n\nThe Council has asked each army to contribute divisions to the general " +
      "reserve. Haig has been told to find them, from an army that is short of men " +
      "and holding a longer front than it did. Petain and Clemenceau are against the " +
      "scheme too.",
    context:
      "A Commander-in-Chief who refuses a decision of the Supreme War Council is " +
      "refusing the government that sent him. He has Petain and Clemenceau on his " +
      "side, and the Prime Minister has to decide whether to dismiss him.",
    choices: [
      {
        id: "refuse",
        label: "Decline to give up divisions for the general reserve",
        historical: true,
        advisor: { name: "Haig", position:
          "I cannot give up divisions to a committee that will decide where they go, when the German attack is expected on my own front." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_reserve: "refused" },
        erodes: "defy_authority",
        next: "bef_1918_18_doullens",
        outcome:
          "In the first days of March Haig refuses to carry out the Council's order. " +
          "With Petain and Clemenceau, who also oppose the measure, he defeats the " +
          "scheme. The Prime Minister decides it is too late, with a great German " +
          "attack expected, to replace him. The general reserve is never formed, and " +
          "the offensive opens on 21 March against armies that have no common reserve.",
      },
      {
        id: "comply",
        label: "Give up the divisions asked for and accept Foch's committee",
        advisor: { name: "Henry Wilson", position:
          "A reserve under a single direction can be moved to wherever the blow falls. Without one, each army will be fighting alone." },
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { bef_reserve: "complied" },
        next: "bef_1918_18_doullens",
        outcome:
          "Speculative. The British divisions are put into the general reserve, and the " +
          "French and Italian contributions follow. The reserve exists when the German " +
          "offensive opens, and can be sent to the threatened sector. It is under a " +
          "committee, and the army that gave the divisions has fewer in its own line on " +
          "21 March. Whether the committee moves them in time, and in the right " +
          "direction, is the thing that nobody can say beforehand.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  bef_1918_18_doullens: {
    year: 1918, date: "1918-03-26", city: "Doullens",
    title: "Somebody to Coordinate",
    advisors: ["haig", "milner", "wilson"],
    situation: (flags) =>
      "The German offensive has driven the Fifth Army back across the old Somme " +
      "battlefield, and the British and French armies are being pushed apart. " +
      (flags.bef_reserve === "complied"
        ? "The general reserve exists, but it is under a committee, and the committee has to agree."
        : "There is no general reserve, and each army is fighting for itself.") +
      "\n\nHaig asked on 25 March for Wilson and Milner to come to France at once, and " +
      "said that he wanted General Foch, or some other determined general, given " +
      "supreme command of the operations. Milner has been sent by the Prime Minister, " +
      "with the powers to settle the matter.",
    context:
      "A British Commander-in-Chief who accepts a French general's orders is " +
      "giving up what no British commander has given up before. The alternative is " +
      "two armies falling back in different directions.",
    choices: [
      {
        id: "foch",
        label: "Accept Foch to coordinate the operations of all the armies",
        historical: true,
        advisor: { name: "Milner", position:
          "There must be one man to direct the whole battle, and Foch is the man the Prime Minister and the French government will accept." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_doullens: "foch", xc_command1918: "unified" },
        next: "bef_1918_19_backs",
        outcome:
          "At the Hotel de Ville at Doullens on 26 March, Haig accepts the appointment of " +
          "Foch to coordinate the reserves of all nationalities wherever he sees fit, " +
          "and Milner, using the powers the Prime Minister has given him, agrees for " +
          "the British government. The decision means that no commander will again be " +
          "able to hold back his divisions because of national feeling, and that Haig " +
          "must now ask rather than order.",
      },
      {
        id: "national",
        label: "Keep the British command independent and coordinate with the French by agreement",
        advisor: { name: "Haig", position:
          "The army is fighting for its life, and it must be commanded by the man who knows it best." },
        gate: (m) => m.will >= -2,
        disabledReason: "The government has already sent Milner to settle the matter",
        impact: { manpower: -2, munitions: 0, will: 0 },
        setFlags: { bef_doullens: "national", xc_command1918: "national" },
        erodes: "defy_authority",
        nextIf: (m) => (m.manpower <= -8 ? "bef_end_ports" : null),
        next: "bef_1918_19_backs",
        outcome:
          "Speculative. The two armies go on conferring and agreeing, and the British " +
          "Commander-in-Chief keeps his own command. The gap between the armies is a " +
          "matter of goodwill under shellfire, and each army considers its own line of " +
          "retreat first. The Germans have the time that the Allied headquarters take " +
          "to agree, and use it. Milner, who was sent to settle the matter, goes home " +
          "without having settled it, and has to say why.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-04
  bef_1918_19_backs: {
    year: 1918, date: "1918-04-11", city: "Montreuil",
    title: "With Our Backs to the Wall",
    advisors: ["haig", "wilson"],
    bulletin: {
      voice: "bef", date: "1918-04-09", source: "Communiqué of General Headquarters",
      text:
        "Fighting has been in progress since the early morning north and south of " +
        "Armentieres. The enemy's attacks have been met by our troops, and the " +
        "situation is being dealt with.",
    },
    situation:
      "The German attack on 9 April on the Lys, where the Portuguese were holding the " +
      "line, has driven the British back and brought the Germans within reach of the " +
      "Channel ports. The army has been fighting for three weeks, and the reserves " +
      "that were to have come from France are not yet in the line.\n\n" +
      "The commanders in the north are asking for orders. The ports are not far away.",
    context:
      "An order that forbids any retirement may save a position and may waste a " +
      "division that was holding it. An order that permits one may be read as a " +
      "signal that the whole line is giving way.",
    choices: [
      {
        id: "order",
        label: "Issue an order to the army: every position held, and no retirement",
        historical: true,
        advisor: { name: "Haig", position:
          "The army has to be told that there is nowhere to go. A withdrawal now would not stop at one line." },
        attested: { by: "Haig", text: "Every position must be held to the last man: there must be no retirement.",
          source: "Special Order of the Day, 11 April 1918" },
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { bef_backs: "order" },
        next: "bef_1918_20_hundreddays",
        outcome:
          "The Special Order of the Day is issued on 11 April. It says that there must be " +
          "no retirement, that with our backs to the wall and believing in the justice " +
          "of our cause each man must fight on to the end, and that the French Army is " +
          "moving rapidly to our support. The line holds in front of the ports, and " +
          "the German offensive on the Lys is brought to a halt before the end of the " +
          "month.",
      },
      {
        id: "withdraw",
        label: "Authorise a withdrawal in Flanders to a shorter line, giving up the ground won in 1917",
        advisor: { name: "Henry Wilson", position:
          "A shorter line is a stronger line. The ground at Ypres was won at great cost and is of no use if the army is lost holding it." },
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { bef_backs: "withdrew" },
        next: "bef_1918_20_hundreddays",
        outcome:
          "Speculative. The army falls back in Flanders to a line nearer the coast, " +
          "giving up the ground that was taken at so great a cost in 1917. The line " +
          "is shorter and fewer men are needed to hold it. The Germans reach the " +
          "ground that the Third Battle of Ypres was fought to win, and the ports lie " +
          "within gun range of a line that has not been tested.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  bef_1918_20_hundreddays: {
    year: 1918, date: "1918-09-01", city: "Montreuil",
    title: "The Cabinet Grows Anxious",
    advisors: ["haig", "wilson", "rawlinson"],
    bulletin: {
      voice: "bef", date: "1918-08-30", source: "Communiqué of General Headquarters",
      text:
        "Our troops have made progress east of Bapaume and north of the Somme. " +
        "Prisoners to the number of several thousand have been taken in the " +
        "past week.",
    },
    situation: (flags) =>
      "Since the attack at Amiens on 8 August the British armies have been advancing " +
      "almost without a pause. " +
      (flags.bef_doullens === "foch"
        ? "Foch directs the whole front, and his plan is for a series of attacks that will not let the Germans rest."
        : "The French and British commanders are coordinating the advance by agreement.") +
      "\n\nOn 31 August Henry Wilson sent Haig a personal telegram, warning him against " +
      "taking unnecessary losses in storming the Hindenburg Line. The War Cabinet, he " +
      "said, would become anxious if the army suffered heavy punishment in attacking it " +
      "without success. The Cabinet is also worried about keeping troops at home, " +
      "because of a police strike.",
    context:
      "To pause is to give the Germans time to fall back and consolidate behind the " +
      "strongest line on the front. To go on is to attack the Hindenburg Line against " +
      "the wishes of the Cabinet that the army serves.",
    choices: [
      {
        id: "attack",
        label: "Go on attacking, and prepare the assault on the Hindenburg Line",
        historical: true,
        advisor: { name: "Haig", position:
          "To stop now would cost more than to go on. The enemy has to be given no time to settle behind the Hindenburg Line." },
        attested: { by: "Haig", text: "wretched lot",
          source: "Haig on the War Cabinet, in reply to Wilson, 1 September 1918" },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { bef_hundreddays: "attacked" },
        erodes: "defy_authority",
        dispute:
          "How far the Hundred Days were won by the British army, and how far by the " +
          "whole weight of the coalition and the collapse of the German army, is " +
          "argued. The British armies took a very large share of the prisoners and the " +
          "guns. Their critics say that the German army was already beaten when the " +
          "attacks of September began.",
        next: "bef_1918_21_armistice",
        outcome:
          "Haig answers Wilson the next day, calling the War Cabinet a wretched lot, and " +
          "argues that attacking the Germans now will cost less than letting them " +
          "consolidate. Byng, Horne and Rawlinson all agree. On 29 September the British " +
          "Fourth Army and the French First attack across the Saint-Quentin canal and " +
          "break the Hindenburg Line. The Cabinet's anxiety has been set aside, and is not " +
          "vindicated by what follows.",
      },
      {
        id: "pause",
        label: "Heed the Cabinet and halt the attacks while the army is rested",
        advisor: { name: "Henry Wilson", position:
          "The Cabinet does not want the army to take heavy losses attacking the Hindenburg Line without success. A pause would give time to prepare." },
        gate: (m) => m.will >= -2,
        disabledReason: "Foch has ordered the attacks to go on",
        attested: { by: "Wilson", text: "the war cabinet would become anxious",
          source: "Telegram to Haig, 31 August 1918" },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { bef_hundreddays: "paused" },
        next: "bef_1918_21_armistice",
        outcome:
          "Speculative. The attacks are halted for some weeks and the army rests, and " +
          "the Cabinet is relieved. The Germans use the time to reach the Hindenburg " +
          "Line and settle behind it. The assault on it, when it comes, comes against a " +
          "line that is held, with the winter near. Foch, who has ordered the attacks " +
          "to go on, has to be told that the British are not going to attack, and has " +
          "to decide what to make of the news.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  bef_1918_21_armistice: {
    year: 1918, date: "1918-10-19", city: "London",
    title: "What to Ask For",
    advisors: ["lloydgeorge", "haig", "milner"],
    situation:
      "The Germans have asked President Wilson for an armistice, and the Allied " +
      "governments are asking their commanders what the armies would need. Haig has " +
      "been asked by the War Cabinet what terms he would advise.\n\n" +
      "His view is that the German army is far from beaten. It has retreated in order " +
      "and has fought hard, and its command still has men and guns. The French and " +
      "the Americans, he believes, are asking for more than the Germans will " +
      "accept. His advice is moderate.",
    context:
      "Terms that are too hard will be refused and the war will go on into the winter. " +
      "Terms that are too soft will be called a betrayal by the people who have " +
      "carried it for four years, and a pause for the German army to recover in.",
    choices: [
      {
        id: "moderate",
        label: "Advise moderation: terms the German army can accept, and no more",
        historical: true,
        advisor: { name: "Haig", position:
          "The German army is not beaten, and a peace that asks for more than it will give will not be signed. It is better to take what is offered." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_armistice: "moderate" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "bef_end_haigsacked"
          : flags.bef_evacuate === "stayed" ? "bef_end_easterners"
          : (flags.bef_somme === "bitehold" && flags.bef_ypres3 === "vetoed") ? "bef_end_bitehold"
          : flags.bef_reserve === "complied" ? "bef_end_reserve"
          : flags.bef_conscription === "voluntary" ? "bef_end_volunteers"
          : null,
        next: "bef_end_victory",
        outcome:
          "Haig tells the War Cabinet on 19 October that the German army is far from " +
          "beaten, and urges moderation. At Senlis, on 25 October, Foch asks the " +
          "commanders for their views, and then, with Clemenceau's agreement, makes his " +
          "own list of terms, which includes the occupation of the Rhine bridgeheads. " +
          "The British government accepts what the Allies decide.",
      },
      {
        id: "hard",
        label: "Support the harder terms the French and Americans want",
        advisor: { name: "Lloyd George", position:
          "The Germans must be left unable to resume the war. A line on the Rhine would do that." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_armistice: "hard" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "bef_end_haigsacked"
          : flags.bef_evacuate === "stayed" ? "bef_end_easterners"
          : (flags.bef_somme === "bitehold" && flags.bef_ypres3 === "vetoed") ? "bef_end_bitehold"
          : flags.bef_reserve === "complied" ? "bef_end_reserve"
          : flags.bef_conscription === "voluntary" ? "bef_end_volunteers"
          : null,
        next: "bef_end_victory",
        outcome:
          "Speculative. The British government joins the French and the Americans in " +
          "asking for terms that leave the German army unable to resume the war. The " +
          "armistice is harder to sign, and it is signed. The Commander-in-Chief has " +
          "given his advice and been overruled, and the army that he commanded is " +
          "asked to occupy the ground that the terms require.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  bef_end_victory: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "The Hundred Days",
    advisors: ["haig", "lloydgeorge"],
    situation:
      "The armistice comes into force at eleven in the morning. The British armies, " +
      "which began the year holding the longest line in France and short of men, have " +
      "ended it advancing on a broad front, with a large share of the prisoners and guns " +
      "taken since August to their credit.\n\n" +
      "The army that landed in August 1914 has been replaced several times over, and " +
      "the Cabinet that sent it has been replaced twice. The argument between the " +
      "generals and the politicians is not over, and will be carried on in print for " +
      "the next twenty years.",
    ending: { family: "victory-and-an-argument", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "Landing, August 1914: " + (flags.bef_landing === "amiens" ? "assembled at Amiens." : "assembled at Maubeuge.") + "\n" +
      "The Seine, September 1914: " + (flags.bef_seine === "withdrew" ? "the army withdrew to refit." : "the army kept to the line.") + "\n" +
      "Ypres, 1914: " + (flags.bef_ypres === "withdrew" ? "the line was shortened toward the coast." : "the line was held.") + "\n" +
      "The Dardanelles, March 1915: " + (flags.bef_dardanelles === "navy" ? "left to the Navy." : "the 29th Division released.") + "\n" +
      "The shortage of shells: " + (flags.bef_shells === "private" ? "kept inside the army." : "told to the press.") + "\n" +
      "Loos: " + (flags.bef_loos === "refused" ? "the ground was refused." : flags.bef_reserves === "released" ? "attacked, with the reserve close behind." : "attacked, with the reserve held back" + (flags.bef_reservesResult === "stopped" ? ", and stopped by the second line." : ", and arriving too late.")) + "\n" +
      "Gallipoli, November 1915: " + (flags.bef_evacuate === "stayed" ? "reinforced." : "evacuated.") + "\n" +
      "December 1915: " + (flags.bef_succession === "french" ? "French kept for the winter." : "Haig appointed.") + "\n" +
      "1916: " + (flags.bef_conscription === "voluntary" ? "the voluntary system kept." : "compulsion for single men.") + "\n" +
      "The Somme: " + (flags.bef_somme === "bitehold" ? "limited advances only." : flags.bef_sommeResult === "gain" ? "a compromise plan, with larger first-day gains than the record shows." : "a compromise plan, and a costly first day.") + "\n" +
      "The tanks: " + (flags.bef_tanks === "held" ? "held back." : flags.bef_tanksResult === "lessons" ? "used on 15 September, to the lasting benefit of the staff." : "used on 15 September, and the surprise spent.") + "\n" +
      "Calais, February 1917: " + (flags.bef_calais === "refused" ? "the subordination refused." : "accepted under protest.") + "\n" +
      "Convoy: " + (flags.bef_convoy === "delayed" ? "left to patrols." : "tried from May 1917.") + "\n" +
      "Flanders, 1917: " + (flags.bef_ypres3 === "vetoed" ? "vetoed." : "authorised.") + "\n" +
      "January 1918: " + (flags.bef_manpower === "refused" ? "the extension of the line refused." : "the line extended to Barisis.") + "\n" +
      "The general reserve: " + (flags.bef_reserve === "complied" ? "divisions given." : "refused.") + "\n" +
      "Doullens: " + (flags.bef_doullens === "national" ? "national command kept." : "Foch accepted to coordinate.") + "\n" +
      "April 1918: " + (flags.bef_backs === "withdrew" ? "a withdrawal in Flanders authorised." : "an order that there be no retirement.") + "\n" +
      "September 1918: " + (flags.bef_hundreddays === "paused" ? "the attacks paused." : "the attacks continued against the Hindenburg Line.") + "\n" +
      "The armistice terms: " + (flags.bef_armistice === "hard" ? "the harder terms supported." : "moderation advised.") + "\n\n" +
      "What actually happened: The armistice came into force at eleven o'clock on 11 November 1918. The British Army had lost some 673,000 dead and missing in the war, and 1.6 million wounded. Haig was made an earl, and Lloyd George won an election in December. The quarrel over Passchendaele, the manpower of 1918 and the Somme became part of the national memory of the war.",
  },

  bef_end_ports: {
    year: 1918, date: "1918-04-04", city: "Montreuil",
    title: "The Ports",
    advisors: ["haig"],
    situation:
      "The two armies went on consulting and agreeing while the German attack went " +
      "on. The British fell back toward the ports, which were their supply, and the French " +
      "fell back toward Paris, which was their capital, and the gap between them " +
      "widened with every day that the two staffs spent in agreeing about it.\n\n" +
      "Neither army was beaten. The ground between them was, and it was ground that " +
      "neither was willing to be responsible for.",
    ending: { family: "coalition-fracture", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Unified command was accepted in the same week at Doullens, with " +
      "the British Prime Minister's representative present, and for the very reason " +
      "that this ending describes. Everyone concerned could see what the " +
      "alternative was. What actually happened: Foch was given the coordination of " +
      "the Allied armies on 26 March 1918 and the title of Commander-in-Chief of " +
      "the Allied armies in April, and the line held in front of Amiens. The " +
      "Germans' offensive on the Lys, in April, was held short of the ports. The " +
      "two retreats of this ending did not take place. The Allied front was never " +
      "so close to splitting as it was in the last week of March, and the " +
      "arrangement made at Doullens was a pragmatic one, which survived because it " +
      "worked. Haig accepted Foch's coordination and found that it cost him little.",
  },

  bef_end_haigsacked: {
    year: 1918, date: "1918-10-24", city: "London",
    title: "The Prime Minister Chooses",
    advisors: ["lloydgeorge"],
    situation:
      "The Prime Minister had been looking for a way to be rid of the Commander-in-Chief " +
      "since the autumn of 1917, and had been told each time that it was not the moment. " +
      "The Cabinet's account of what the army had been given and what it had done with it " +
      "was now a matter of record, and his political capital was spent.\n\n" +
      "The government falls, or the Commander-in-Chief does. In this version it is " +
      "the Commander-in-Chief.",
    ending: { family: "civil-authority-prevails", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Lloyd George considered replacing Haig more than once and never " +
      "did it. What actually happened: the Prime Minister's distrust of the " +
      "Commander-in-Chief lasted to the end of the war, and he gave Robertson's " +
      "post to Wilson and made the Supreme War Council at Versailles, but Haig was " +
      "never dismissed. Haig remained in command to the armistice. After the war " +
      "Haig was given a peerage and £100,000, while Lloyd George's memoirs spent a " +
      "great many pages on the generals. The Prime Minister's quarrel with the " +
      "generals was carried on in the Maurice debate of May 1918, in which he was " +
      "accused of misleading the House about the army's strength, and he won it. It " +
      "left him with the government and Haig with the army, and neither forgave the " +
      "other.",
  },

  bef_end_shipping: {
    year: 1917, date: "1917-08-30", city: "London",
    title: "A Winter's Wheat",
    advisors: ["lloydgeorge"],
    situation:
      "The convoy was tried late, and by then the stock of wheat in the country was " +
      "down to a few weeks. Food was rationed by the voluntary scheme, and then by " +
      "a compulsory one, and the Cabinet found itself discussing the arithmetic of " +
      "shipping tonnage in the place of the strategy of the war.\n\n" +
      "The army was kept at its strength in France, and the country that fed it was " +
      "being asked to eat less.",
    ending: { family: "shipping-crisis-deepens", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Convoy was tried in May 1917, and losses fell through the " +
      "summer. What actually happened: the first convoy left Gibraltar on 10 May " +
      "and arrived twelve days later; the system was extended to the Atlantic " +
      "trade, and by the end of the year the monthly losses were a fraction of " +
      "April's. Food was rationed in 1918 and the country was never close to " +
      "starvation. The delay that this ending supposes would have cost a good many " +
      "ships and a good deal of the Cabinet's confidence in the Admiralty. " +
      "Britain's wheat reserves were low in the spring of 1917, and the margin was " +
      "a matter of weeks. The Cabinet's anxiety was real, and the decision that " +
      "relieved it was taken by the Admiralty and the Prime Minister at about the " +
      "same time, for reasons that the two men afterwards gave differently.",
  },

  bef_end_easterners: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "Another Front",
    advisors: ["churchill"],
    situation:
      "The army stayed at Gallipoli through the winter and was reinforced from " +
      "the divisions that would have gone to France. The campaign in the East became " +
      "the second front of the war for Britain, and the Western Front was held with " +
      "what the Eastern one left over.\n\n" +
      "When the end came it was in France, as it was always going to be, and the " +
      "armies that finished it were smaller than they might have been.",
    ending: { family: "the-other-strategy", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Cabinet voted to evacuate Gallipoli, and did so with very " +
      "small loss. What actually happened: the evacuation of Anzac and Suvla was " +
      "completed on 20 December 1915 and of Helles on 8 and 9 January 1916, after " +
      "which the troops went to Egypt and to France. The Gallipoli campaign cost " +
      "about a quarter of a million casualties on each side, and the argument about " +
      "whether another strategy could have succeeded began in 1915 and is not " +
      "settled. The argument between the men who wanted to win the war in France " +
      "and those who wanted a different front was never settled by the result. " +
      "Churchill and Lloyd George held the second view and Robertson and Haig the " +
      "first, and both sides could point to something that supported them.",
  },

  bef_end_bitehold: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "Smaller Battles",
    advisors: ["rawlinson"],
    situation:
      "The Somme was fought as a series of limited advances, and Flanders was not " +
      "fought at all. The army that came to the spring of 1918 was stronger than the " +
      "one that did, and the Prime Minister had less to hold against the " +
      "Commander-in-Chief.\n\n" +
      "The war ended in the same month. It cost fewer lives to get there.",
    ending: { family: "attrition-without-the-great-battles", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Rawlinson's plan for the Somme was a series of limited " +
      "advances, and it was modified by Haig. What actually happened: the battle " +
      "began on 1 July 1916 with 57,000 casualties on the first day, nearly 20,000 " +
      "of them dead, and went on until November. The Third Battle of Ypres ran from " +
      "31 July to 10 November 1917. The army's casualty figures for those two " +
      "campaigns are among the most argued about in British history, and the " +
      "counterfactual in this ending is the one that critics of Haig have been " +
      "proposing since. Rawlinson's own method, which he applied at Amiens in " +
      "August 1918 with tanks and aircraft and a great weight of guns, was a series " +
      "of bites with the pauses reduced, and was the method by which the Hundred " +
      "Days were fought. Whether it could have been used earlier is the question " +
      "the critics ask.",
  },

  bef_end_reserve: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "A Reserve for the Whole Front",
    advisors: ["wilson"],
    situation:
      "The general reserve was formed, under Foch's committee at Versailles, and it " +
      "was there on 21 March. Divisions were moved to the threatened sector within " +
      "days, and the German attack met a line that had a second line behind it.\n\n" +
      "The British army had given up men that it was short of, and the Commander-in-Chief " +
      "had lost an argument with the Prime Minister. The war ended in November.",
    ending: { family: "unified-reserve", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The general reserve was proposed by the Supreme War Council and " +
      "defeated by Haig, Petain and Clemenceau. What actually happened: Robertson, " +
      "who opposed it, was forced to resign on 11 February 1918 and replaced by " +
      "Wilson. In the first days of March Haig refused to carry out the order. " +
      "After the German offensive began on 21 March, Foch was given the " +
      "coordination of the reserves at Doullens, which did what the general reserve " +
      "was meant to do. Foch's coordination of the reserves after Doullens, and the " +
      "transfer of French divisions to the British front in the spring, did in " +
      "practice what the general reserve had been meant to do, and the Supreme War " +
      "Council's committee at Versailles was never again the centre of Allied " +
      "strategy.",
  },

  bef_end_volunteers: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "An Army of Volunteers",
    advisors: ["lloydgeorge"],
    situation:
      "The voluntary system was kept. The Derby scheme was extended and the " +
      "recruiting posters were reprinted, and the army at the front was kept " +
      "up to strength by the men who came forward.\n\n" +
      "It was a smaller army. The Cabinet had kept the peace with the Labour " +
      "movement, and the army had paid the price in the summer of 1916.",
    ending: { family: "no-conscription", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Military Service Act was passed in January 1916, and a " +
      "second in May extended it to married men. What actually happened: the Act " +
      "received the royal assent on 27 January and came into force on 17 February; " +
      "thirty-five Liberals voted against it, and the Home Secretary, Sir John " +
      "Simon, resigned. A third Act in 1918 raised the upper age to fifty-one. " +
      "Without compulsion the army could not have been kept up to the strength that " +
      "the war required. Britain was the only one of the great powers to fight the " +
      "first two years of the war without conscription. The army that the voluntary " +
      "system produced, the largest ever raised in Britain, was the army that " +
      "fought on the Somme, and its losses there were what made compulsion " +
      "unavoidable.",
  },

  bef_end_relieved: {
    year: 1918, date: "1918-05-01", city: "London",
    title: "The Cabinet Decides",
    advisors: ["lloydgeorge"],
    situation:
      "There is no single act that did this. There is a file, and in it a Commander-in-Chief " +
      "who had told the press what the Cabinet had not, refused an order of the " +
      "Supreme War Council, and attacked against the Cabinet's anxiety and its wishes. " +
      "Each one could be defended, and the sum of them could not.\n\n" +
      "The Prime Minister decides that it is the moment, and the Commander-in-Chief is " +
      "told that he is to hand over.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "What actually happened: Lloyd George wanted to be rid of Haig and did not do " +
      "it. He removed Robertson in February 1918 and Jellicoe in December 1917, but " +
      "kept Haig through the German offensive and the Hundred Days. Haig remained " +
      "in command until the armistice and was made an earl in 1919. The order to " +
      "relieve him is the one that this office could have given, and the one that " +
      "was never given. The Commander-in-Chief's position was never as secure as it " +
      "appeared, and the Prime Minister's power to remove him was not in doubt. " +
      "What kept Haig in command was the Cabinet's own sense that it could not " +
      "afford a crisis with the German offensive about to come and the army behind " +
      "him.",
  },
};

// =============================================================================
// AUSTRO-HUNGARIAN AOK — HISTORICAL SPINE
// =============================================================================
//
// The campaign's identity (spec §2.5): an army whose internal loyalty is itself the
// strategic variable, and whose every acceptance of German direction buys survival
// and costs autonomy. Each such acceptance is tagged for hard mode (cede_sovereignty).
//
// RESEARCH GATE. Closed on 2026-10-04: the spine was checked against English-language
// sources node by node before writing (see claims/aok.json). The spec's rule stands: a
// node that cannot be sourced is cut, not written around.
//
// SOURCING NOTE. Advisors carry `position`, not `quote`, and a position is attributed
// to a named person only where the record supports it.
// =============================================================================

CAMPAIGNS.aok.startNode = "aok_1914_01_serbia";

CAMPAIGNS.aok.commanders = [
  { id: "conrad", name: "Conrad von Hotzendorf", title: "Chief of the General Staff",
    from: "1914-07-28", to: "1917-02-28" },
  { id: "arz", name: "Arz von Straussenburg", title: "Chief of the General Staff",
    from: "1917-03-01", to: "1918-11-03" },
];

CAMPAIGNS.aok.advisors = [
  { id: "conrad", name: "Conrad", from: "1914-07-28", to: "1917-02-28",
    dossier: { role: "Chief of the General Staff, 1906-1917",
      bio: "Planned the army's deployment against both Serbia and Russia and believed throughout in the offensive. His relations with the German Chief of Staff were poor, and he went to war in 1916 against Italy without German support.",
      fate: "Dismissed by Emperor Karl on 1 March 1917. Commanded an army group in the Tyrol until July 1918, when he was dismissed again." } },
  { id: "friedrich", name: "Archduke Friedrich", from: "1914-07-28", to: "1916-12-01",
    dossier: { role: "Supreme Commander of the Army, 1914-1916",
      bio: "Held the supreme command in name, with Conrad directing operations beneath him.",
      fate: "Replaced as Supreme Commander by the new Emperor on 2 December 1916." } },
  { id: "potiorek", name: "Potiorek", from: "1914-07-28", to: "1914-12-08",
    dossier: { role: "Military Governor of Bosnia; commander of the forces against Serbia",
      bio: "Commanded the Balkan forces in the opening invasions of Serbia, all of which failed.",
      fate: "Relieved in December 1914 after the defeat on the Kolubara." } },
  { id: "karl", name: "Karl I", from: "1916-11-21", to: "1918-11-11",
    dossier: { role: "Emperor-King from 21 November 1916; Supreme Commander from 2 December",
      bio: "Succeeded his great-uncle in the third winter of the war, took the supreme command himself and wanted a peace that would keep the monarchy together. His secret approach to France through his brother-in-law was exposed in April 1918.",
      fate: "Relinquished any share in the government of Austria on 11 November 1918 and left for exile. Died in Madeira in 1922." } },
  { id: "arz", name: "Arz von Straussenburg", from: "1917-03-01", to: "1918-11-03",
    dossier: { role: "Chief of the General Staff, March 1917 to November 1918",
      bio: "Chosen by the new Emperor for a conciliatory manner and not for his strategic independence. Accepted responsibility for the failure of the June 1918 offensive and offered his resignation, which was refused.",
      fate: "Resigned on 3 November 1918. Died in Budapest in 1935." } },
  { id: "czernin", name: "Czernin", from: "1916-12-22", to: "1918-04-14",
    dossier: { role: "Foreign Minister, December 1916 to April 1918",
      bio: "Served an Emperor who wished for peace and an alliance that did not allow it. Resigned after the exposure of the Emperor's letters to France.",
      fate: "Left office on 14 April 1918." } },
  { id: "tisza", name: "Tisza", from: "1914-07-28", to: "1917-05-23",
    dossier: { role: "Prime Minister of Hungary, 1913-1917",
      bio: "Held the Hungarian half of the monarchy to the war, and was the strongest voice in the common ministers' councils against concessions to the Slav nationalities.",
      fate: "Resigned in May 1917. Assassinated in October 1918." } },
  { id: "boroevic", name: "Boroevic", from: "1915-05-23", to: "1918-11-03",
    dossier: { role: "Commander on the Isonzo front; army group commander in 1918",
      bio: "A Croat from the old military border who held the Isonzo through eleven battles, and quarrelled with Conrad over the plan for the offensive of June 1918.",
      fate: "Retired in 1919." } },
];

CAMPAIGNS.aok.bulletinVoice = {
  source: "Communique of the Imperial and Royal General Staff, as printed in the Vienna and Budapest press",
  register: "Courteous, formal and sparing; reverses become 'movements', and the allied army is mentioned warmly",
  defined: true,
};

CAMPAIGNS.aok.hardMode.forcedEndingId = "aok_end_relieved";
// Set from measurement (montecarlo.js hard, check-historical-ending.js): the historical line carries three cede_sovereignty choices and survives at 4; about one random run in five is relieved.
CAMPAIGNS.aok.hardMode.erosionMax = 4;
CAMPAIGNS.aok.researchGate = { open: false, note: "Closed on 2026-10-04 after a node-by-node sourcing check; see claims/aok.json." };

CAMPAIGNS.aok.nodes = {

  // ---------------------------------------------------------------- 1914-08
  aok_1914_01_serbia: {
    year: 1914, date: "1914-08-01", city: "Vienna",
    title: "The Swing Force",
    advisors: ["conrad", "potiorek", "tisza"],
    situation:
      "The monarchy is at war with Serbia, and Russia mobilised on 30 July. The army's " +
      "deployment is built on a division of the force into three: a Balkan group for " +
      "Serbia, a larger group in Galicia for Russia, and a swing force between them " +
      "that can be sent to either, depending on whether Russia comes in.\n\n" +
      "Russia is coming in. What is not settled is where the swing force, the Second " +
      "Army, is to go first. The Chief of the General Staff has planned a war on " +
      "two fronts, and the war on the second front has already begun.",
    context:
      "The railways have been timetabled for months, and a train that is sent the " +
      "wrong way cannot easily be sent back. An army that goes to Serbia first is " +
      "not in Galicia when the Russians cross the frontier.",
    choices: [
      {
        id: "serbia",
        label: "Send the swing force to Serbia first, as the plan says, and settle that war quickly",
        historical: true,
        advisor: { name: "Potiorek", position:
          "Serbia has to be dealt with at once. With the swing force the Balkan army can finish it before Russia is ready." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { aok_serbia: "first" },
        next: "aok_1914_02_recall",
        outcome:
          "The swing force is sent to the Serbian frontier and the invasion goes in on " +
          "12 August, with some 460,000 men in the Balkan armies. It is a poor " +
          "campaign: the force is stopped by the Serbian army and loses a great " +
          "deal for no result. After about ten days of inactivity the swing force is " +
          "ordered north, to a front that has by then started without it.",
      },
      {
        id: "galicia",
        label: "Send the swing force to Galicia from the start and hold Serbia with the Balkan group alone",
        advisor: { name: "Tisza", position:
          "The danger is Russia, and the army has to be where the danger is. Serbia can wait." },
        gate: (m) => m.will >= -3,
        disabledReason: "The monarchy has gone to war to punish Serbia, and the war on Serbia cannot be seen to wait",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { aok_serbia: "galicia" },
        next: "aok_1914_02_recall",
        outcome:
          "Speculative. The swing force goes north at once and the Balkan group holds the " +
          "Serbian frontier on its own. The army in Galicia is stronger when the Russians " +
          "arrive, and the punishment of Serbia is postponed. The Hungarian and Austrian " +
          "governments, who have declared war for exactly that purpose, have to decide " +
          "whether they will accept an army that is looking the other way.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  aok_1914_02_recall: {
    year: 1914, date: "1914-08-18", city: "Przemysl",
    title: "Too Late to Be Wanted",
    advisors: ["conrad", "potiorek"],
    situation: (flags) =>
      "The Russian armies are across the frontier in Galicia in greater strength than the " +
      "General Staff had allowed for. " +
      (flags.aok_serbia === "galicia"
        ? "The swing force is already in Galicia, and the Balkan group is watching Serbia alone."
        : "The swing force has been in the south for ten days and has done nothing there.") +
      "\n\nThe Chief of the General Staff has to decide whether the Second Army is to be " +
      "taken out of the Balkan campaign and sent north. It will take days by rail, and " +
      "the Balkan commander has asked that it be allowed to finish what it has begun.",
    context:
      "An army that leaves one campaign for another arrives with its men tired by " +
      "the journey and its place in the line already taken by the formations that " +
      "were there.",
    choices: [
      {
        id: "recall",
        label: "Recall the Second Army from the Serbian front and send it north",
        historical: true,
        advisor: { name: "Conrad", position:
          "The decisive war is in Galicia. The Second Army must be in it, whatever has to be given up in the south." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { aok_recall: "recalled" },
        next: "aok_1914_03_galicia",
        outcome:
          "The Second Army is taken out of the Balkan force and sent north by rail. It " +
          "reaches Galicia too late to take part in the first battles, and its absence " +
          "from the Serbian front lets the Serbs gather themselves for the next " +
          "campaign. The troops have been marched, entrained and sent a long way for " +
          "neither of the two fronts, and the army has lost a fortnight it could not afford.",
      },
      {
        id: "stay",
        label: "Leave the Second Army in Serbia to finish the campaign",
        advisor: { name: "Potiorek", position:
          "The campaign is not finished. To take the Second Army away now is to give up what has been paid for." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "The front in Galicia cannot be held without the Second Army",
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { aok_recall: "stayed" },
        next: "aok_1914_03_galicia",
        outcome:
          "Speculative. The Second Army stays in the south and the Balkan campaign is " +
          "pushed on. The army in Galicia meets the Russians without it. Whether " +
          "Serbia is beaten in the time that the Second Army has is not something the " +
          "record can say, and the northern front is thinner than the General Staff " +
          "expected it to be.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  aok_1914_03_galicia: {
    year: 1914, date: "1914-08-22", city: "Przemysl",
    title: "Into Russian Poland",
    advisors: ["conrad", "friedrich"],
    bulletin: {
      voice: "aok", date: "1914-08-21", source: "Communique of the General Staff",
      text:
        "The Imperial and Royal armies have begun operations on the northern front. " +
        "The troops are in the highest spirits. Details cannot be given at present.",
    },
    situation: (flags) =>
      "Conrad has concentrated the First, Third and Fourth Armies in Galicia along a " +
      "front of some 280 kilometres, with about 950,000 men. " +
      (flags.aok_recall === "stayed"
        ? "The Second Army is still in Serbia, and the northern armies are without it."
        : "The Second Army is on its way from the south.") +
      "\n\nHis plan is an offensive north into Russian Poland, to strike the Russian " +
      "armies as they come forward, before they have concentrated. The Russians are " +
      "stronger than he expected and have two armies on his southern flank that his plan " +
      "has not accounted for. The alternative is to wait behind the San and let them come.",
    context:
      "The army was built to attack, and its training, its doctrine and its Chief " +
      "of Staff believe in it. The army that waits behind a river is not the army " +
      "that has been prepared.",
    choices: [
      {
        id: "offensive",
        label: "Launch the offensive north into Russian Poland",
        historical: true,
        advisor: { name: "Conrad", position:
          "The initiative has to be taken before the Russians are ready. An army that waits has already lost the first battle." },
        impact: { manpower: -3, munitions: -1, will: -1 },
        setFlags: { aok_galicia: "offensive" },
        dispute:
          "Why the Galician campaign failed is argued. One view blames Conrad's plan, which " +
          "left the southern flank exposed. Another blames the Russian strength, which the " +
          "General Staff had underestimated. The casualty figures for the battle are " +
          "themselves disputed, from about 420,000 men in Herwig's reckoning to 324,000 in " +
          "Buttar's.",
        uncertain: [
          { weight: 70, title: "Early victories, then the collapse before Lemberg", historicalBranch: true,
            impact: { manpower: -1, will: -1 },
            setFlags: { aok_galiciaResult: "lemberg" },
            next: "aok_1914_04_rawa",
            outcome:
              "The First Army wins at Krasnik, taking some 6,000 prisoners, and the Fourth " +
              "wins at Komarow, taking some 20,000. Then the southern flank gives way: " +
              "the Russians under Brusilov and Ruzsky break the Third Army at the Gnila Lipa " +
              "and take Lemberg. The army falls back a hundred miles to the Carpathians, " +
              "leaving the fortress of Przemysl behind it, and has lost a great part of its " +
              "regular officers and men." },
          { weight: 30, title: "The offensive is checked early and the army keeps its line",
            impact: { manpower: 1 },
            setFlags: { aok_galiciaResult: "checked" },
            next: "aok_1914_04_rawa",
            outcome:
              "Speculative. The offensive meets the Russians earlier and in greater strength " +
              "than it did, and is checked before the flank is turned. The army falls back " +
              "less far and with fewer losses, and Lemberg is held for some weeks longer. " +
              "It is a defeat that can be called a withdrawal, and the General Staff, " +
              "which believed in the attack, has been shown what it can do." },
        ],
      },
      {
        id: "san",
        label: "Stand on the defensive behind the San and let the Russians come on",
        advisor: { name: "Archduke Friedrich", position:
          "The army is in a position to wait. It does not have to attack before it knows what the Russians have." },
        gate: (m) => m.will >= -3,
        disabledReason: "The General Staff's doctrine and the German ally's expectation both call for an offensive",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { aok_galicia: "defensive" },
        next: "aok_1914_04_rawa",
        outcome:
          "Speculative. The army stands behind the San and takes the Russian attack there, " +
          "with the fortress of Przemysl on its flank. It loses fewer men in the first " +
          "weeks than in the offensive, and the Russians come on at their own pace. The " +
          "Germans, who were told that the Austro-Hungarian army would take the " +
          "initiative in the south, are told instead that it will defend.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  aok_1914_04_rawa: {
    year: 1914, date: "1914-09-06", city: "Przemysl",
    title: "A Decisive Blow Meets Another",
    advisors: ["conrad", "friedrich"],
    situation:
      "On 6 September the armies are three days into the great battle in Galicia. " +
      "Conrad's plan is a decisive blow by Auffenberg's Fourth Army, which has turned " +
      "south-east to deliver it, and the army to its left, under Archduke Joseph " +
      "Ferdinand, has been left with four infantry and two cavalry divisions to face " +
      "north.\n\n" +
      "The Russians have turned too. Ruzsky's Third Army, persuaded to swing north-west, " +
      "is coming straight at Auffenberg, so that the blow and the Russian advance meet " +
      "head on. The Austro-Hungarian armies are outnumbered by two to one, and on " +
      "the northern flank Plehve's Fifth Army is advancing from Komarow and the " +
      "Russian Twenty-first Corps reaches beyond the left of the line.",
    context:
      "Breaking off now is a retreat in the middle of the first great battle, with " +
      "the northern flank open and the fortress of Przemysl behind it. Going on is a " +
      "gamble that the Fourth Army wins before the flank is turned.",
    choices: [
      {
        id: "blow",
        label: "Let the blow go on: the Fourth Army attacks as ordered",
        historical: true,
        advisor: { name: "Conrad", position:
          "A battle of this size is decided by one army breaking another, and the Fourth Army is the one that can do it. A retreat now would give the Russians the victory for nothing." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { aok_rawa: "blow" },
        next: "aok_1914_05_kolubara",
        outcome:
          "The blow meets the Russian advance and does not break it. On 9 September " +
          "Auffenberg begins to retreat west toward the San, outnumbered two to one " +
          "and with his northern flank exposed, and the armies fall back to the " +
          "Dunajec and the Biala. Przemysl is left behind them to be besieged by " +
          "the Russians. The plan has been tried in the place where it was meant " +
          "to work, and it has not worked.",
      },
      {
        id: "breakoff",
        label: "Break off the battle now and fall back behind the San",
        advisor: { name: "Friedrich", position:
          "If the northern flank is open and the enemy is twice our number, then the army should leave the field while it is still an army and fight again behind the river." },
        gate: (m) => m.will >= -3,
        disabledReason: "The command will not order a retreat in the middle of its first great battle",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_rawa: "brokeoff" },
        next: "aok_1914_05_kolubara",
        outcome:
          "Speculative. The orders go out on 6 September for the armies to disengage and " +
          "fall back behind the San before the Russian flank closes. The Fourth " +
          "Army is intact, the northern wing has not been turned, and the retreat is " +
          "made in order, three days earlier than it was. The fortress is besieged " +
          "all the same. What the army has lost is the battle it did not fight, " +
          "and the hope that it would have won it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  aok_1914_05_kolubara: {
    year: 1914, date: "1914-10-10", city: "Vienna",
    title: "A Third Invasion",
    advisors: ["conrad", "potiorek"],
    situation:
      "In the first days of October the Emperor has personally authorised a third " +
      "invasion of Serbia, after two had failed and after the high command had " +
      "hesitated. Potiorek, who commands the Balkan forces, means to go in " +
      "at the beginning of November.\n\n" +
      "Every division that goes into Serbia is a division that is not in Galicia, " +
      "where the Russians have driven the armies back since the Rawa battle.",
    context:
      "A third attempt on Serbia is the one the monarchy went to war to make. " +
      "Declining it means telling the Emperor that the war's first purpose " +
      "has to wait.",
    choices: [
      {
        id: "invade",
        label: "Authorise Potiorek's third invasion of Serbia",
        historical: true,
        advisor: { name: "Potiorek", position:
          "Serbia is the reason for the war, and the Serbian army has been beaten twice back from its own ground. A third blow, with the whole of the Balkan force, will finish it." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { aok_kolubara: "invaded", xc_kolubara: "invaded" },
        next: "aok_1915_04_carpathians",
        outcome:
          "The offensive opens on 6 November and reaches the Kolubara on 16 November. " +
          "The Serbs give up Belgrade at the end of the month and the Austro-Hungarians " +
          "enter it on 1 December; on 2 December the Serbs counterattack, and by " +
          "15 December the capital is theirs again. The army has lost more than two " +
          "hundred thousand men, the monarchy's prestige has suffered badly, and " +
          "Potiorek is relieved on 22 December.",
      },
      {
        id: "decline",
        label: "Decline the invasion and hold the Balkan divisions for Galicia",
        advisor: { name: "Conrad", position:
          "The war will be decided against Russia. Every division spent in the Balkans is one that the Galician front will need before the winter is out." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Emperor has already given his word for the invasion",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_kolubara: "declined", xc_kolubara: "declined" },
        next: "aok_1915_04_carpathians",
        outcome:
          "Speculative. The Emperor's authorisation is put aside, and the Balkan force " +
          "stands on the Drina and the Sava while the divisions that can be spared go " +
          "north. Serbia is left unbeaten and Potiorek unrewarded, and Budapest, " +
          "which wanted Serbia, says so. Galicia has the divisions, and the monarchy " +
          "has the army it would have lost in the mountains of Serbia in the winter.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-01
  aok_1915_04_carpathians: {
    year: 1915, date: "1915-01-23", city: "Teschen",
    title: "Relieving a Fortress Through the Snow",
    advisors: ["conrad", "friedrich"],
    bulletin: {
      voice: "aok", date: "1915-01-21", source: "Communique of the General Staff",
      text:
        "The fortress of Przemysl continues to hold. In the Carpathians our troops " +
        "have repulsed several attacks. The weather is severe.",
    },
    situation: (flags) =>
      "Przemysl has been surrounded by the Russians since the autumn, with a garrison " +
      "of about 127,000 soldiers and 18,000 civilians. " +
      (flags.aok_galiciaResult === "checked"
        ? "The army was not driven back so far in the summer, and has more to attempt with."
        : "The army fell back in September to the Carpathians and has been there since.") +
      "\n\nConrad wants to relieve it, by an offensive through the mountains in the " +
      "dead of winter, over passes under snow, with troops that have fought since " +
      "August and are short of everything. The fortress's supplies are running down, and the " +
      "army's honour, as the General Staff reads it, is in the garrison.",
    context:
      "The fortress is useless if it is not relieved and a disaster if it falls. The " +
      "relief may cost more men than the fortress holds.",
    choices: [
      {
        id: "relieve",
        label: "Press the winter offensive through the Carpathians to relieve Przemysl",
        historical: true,
        advisor: { name: "Conrad", position:
          "The garrison has to be relieved. An army that leaves 130,000 men to be taken has lost more than the battle." },
        impact: { manpower: -3, munitions: -1, will: 0 },
        setFlags: { aok_carpathians: "pressed" },
        next: "aok_1915_07_przemysl",
        outcome:
          "The offensives through the mountains go on from January to April and fail. " +
          "Austro-Hungarian casualties in the Carpathians in those months are reported as " +
          "some 800,000, most of them from the weather and disease, and the garrison of " +
          "Przemysl surrenders on 22 March with some 117,000 men. About half of the army " +
          "that went to war in 1914 is gone, and what is left is a mixture of the old " +
          "regiments and raw drafts.",
      },
      {
        id: "hold",
        label: "Hold the passes with what the army has and leave the fortress to break out or surrender",
        advisor: { name: "Archduke Friedrich", position:
          "The army cannot do more in the mountains in winter than it has done. The garrison has to decide for itself." },
        gate: (m) => m.will >= -4,
        disabledReason: "The General Staff cannot be seen to abandon the fortress",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { aok_carpathians: "held" },
        next: "aok_1915_07_przemysl",
        outcome:
          "Speculative. The relief is not attempted and the army holds the line of the " +
          "passes. The garrison breaks out, or it does not, and surrenders in the spring " +
          "with its stores gone. The army has kept the men that the Carpathian winter would " +
          "have cost it, and has told the monarchy that the fortress it was told to be proud " +
          "of was not worth the winter.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-02
  aok_1915_07_przemysl: {
    year: 1915, date: "1915-02-27", city: "Teschen",
    title: "Telling the Fortress",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "The fortress of Przemysl has been shut in for months, with a garrison of well " +
      "over a hundred thousand men, and the winter in the Carpathians is costing " +
      "the army heavily, mostly in cold and sickness.\n\n" +
      (flags.aok_carpathians === "held"
        ? "The passes were held in January and the fortress left to itself, and the " +
          "commandant, Kusmanek, has heard it from nobody. "
        : "The relief attempts have been made through the snow, and Boroevic's Third " +
          "Army has pressed forward again in February without breaking through. ") +
      "By the end of the month Conrad has to tell Kusmanek whether any further " +
      "attempt to relieve him will be made.",
    context:
      "Telling a garrison that nothing more is coming is telling it to " +
      "surrender or break out. Not telling it is leaving it to eat its stores while " +
      "the army that would relieve it is spent in the passes.",
    choices: [
      {
        id: "none",
        label: "Tell the fortress that no further relief will be attempted",
        historical: true,
        advisor: { name: "Conrad", position:
          "The army cannot be spent in the passes any longer. The fortress has to be told the truth, so that its commandant can do what he can with it." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { aok_przemyslend: "none" },
        next: "aok_1915_05_gorlice",
        outcome:
          "Conrad tells Kusmanek by the end of February that no further relief will " +
          "be tried. On 19 March the commandant orders a breakout, which is " +
          "repelled, and on 22 March he surrenders with some 117,000 men. The " +
          "expected Russian advance into Hungary does not come, but the loss is a " +
          "serious blow to the army's morale.",
      },
      {
        id: "third",
        label: "Order a third relief attempt through the passes",
        advisor: { name: "Friedrich", position:
          "A fortress with a hundred thousand men in it is worth another attempt. The army is better spent in the mountains than given up behind the walls." },
        gate: (m, flags) => m.manpower >= -4 && flags.aok_carpathians !== "held",
        disabledReason: "There is no army left in the passes to send, or the passes were never contested",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { aok_przemyslend: "third" },
        next: "aok_1915_05_gorlice",
        outcome:
          "Speculative. A third attempt goes in at the end of the winter, with what the " +
          "second left of the army, over the same snow. Whether it reaches the " +
          "fortress is something nobody knows, and the garrison is told to hold " +
          "until it comes. The army that makes it is smaller than the one that " +
          "made the second, and the spring, when the Russians come on again, " +
          "finds it so.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-04
  aok_1915_05_gorlice: {
    year: 1915, date: "1915-04-13", city: "Teschen",
    title: "A German Commander for the Offensive",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "The army has lost about half of the force that entered the war. " +
      (flags.aok_carpathians === "held"
        ? "The Carpathian winter was not fought through, and the army is stronger than it would have been, though still beaten."
        : "The Carpathian winter has taken what the autumn left.") +
      "\n\nConrad has told Berlin that the monarchy cannot go on without help, and the German " +
      "Chief of Staff, Falkenhayn, has concluded that Vienna may look for a separate " +
      "peace if it is not given some. Falkenhayn's plan is a concentrated German " +
      "offensive in western Galicia, at Gorlice and Tarnow, under a German commander. " +
      "The Austro-Hungarian Fourth Army is to be placed under the new German army." +
      (flags.xc_gorlice === "envelop" ? "\n\nBerlin has not accepted Falkenhayn's plan. The weight of the German effort is going north, to an envelopment out of East Prussia and Courland, and what is offered in Galicia is smaller." : ""),
    context:
      "The army that accepts a German commander is saved by him. It is also an army " +
      "that has been shown it cannot defend its own frontier, and the shadow of that does " +
      "not go away.",
    choices: [
      {
        id: "accept",
        label: "Accept the offensive under Mackensen, with the Fourth Army placed under German command",
        historical: true,
        advisor: { name: "Conrad", position:
          "The army cannot stand another winter like this one. If the price of relief is a German commander, it has to be paid." },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { aok_gorlice: "german" },
        erodes: "cede_sovereignty",
        next: "aok_1915_06_isonzo",
        outcome:
          "The offensive opens on 2 May under a German general with a German army at its " +
          "head. By 6 May Mackensen reports 60,000 prisoners, and by June the Russians have " +
          "been driven out of Galicia, with Lemberg retaken on 22 June. Austria-Hungary " +
          "is saved. It is saved by an ally who now commands the operations on its own " +
          "territory, and the arrangement is not undone for the rest of the war.",
      },
      {
        id: "own",
        label: "Insist that the offensive be commanded by an Austro-Hungarian general",
        advisor: { name: "Archduke Friedrich", position:
          "The monarchy's armies cannot be commanded by a foreigner on the monarchy's own ground. The alliance is not a protectorate." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Germans have said the offensive will be German-led or it will not be made",
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { aok_gorlice: "own" },
        next: "aok_1915_06_isonzo",
        outcome:
          "Speculative. Austria-Hungary asks for an offensive under an Austro-Hungarian " +
          "commander and is told that the Germans will not make it on those terms, or makes " +
          "it with a smaller force. The army goes into the summer with the Russians still " +
          "in the passes, and the monarchy's command of its own armies is intact and " +
          "untested.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-05
  aok_1915_06_isonzo: {
    year: 1915, date: "1915-05-23", city: "Teschen",
    title: "A Third Enemy",
    advisors: ["conrad", "boroevic"],
    situation:
      "Italy has declared war on the monarchy today, after nine months of bargaining " +
      "over what she would take for staying neutral. The front on the Isonzo and in the " +
      "Tyrol is held by a few weak formations and the frontier garrisons, because the " +
      "army that would have held it is in Galicia.\n\n" +
      "Conrad has never believed that Italy would stay out and has wanted a war with " +
      "her for years. He has not got the army for it now. What has to be decided is what to move " +
      "south, and how much of the Galician front to give up to move it.",
    context:
      "The ground on the Isonzo favours the defender, and the Italians have a long " +
      "way to climb. An army that holds there can be small, and one that attacks " +
      "from the Tyrol has to be much larger.",
    choices: [
      {
        id: "isonzo",
        label: "Hold the Isonzo line with the army that can be spared, under Boroevic, and attack nowhere",
        historical: true,
        advisor: { name: "Boroevic", position:
          "The Isonzo is a position that a small army can hold if it holds it with its whole heart. It must not be spent in attacks." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { aok_isonzo: "held" },
        next: "aok_1915_08_pless",
        outcome:
          "Boroevic's army digs in on the heights above the Isonzo and holds them against " +
          "the Italian attacks that begin in June. There are eleven battles on the Isonzo " +
          "before the autumn of 1917, and each is fought on ground that the defender has " +
          "had time to prepare. The front is held, and costs the army a great many men " +
          "and the monarchy a great deal of its patience.",
      },
      {
        id: "attack",
        label: "Move a strong force south at once and attack Italy before she is ready",
        advisor: { name: "Conrad", position:
          "Italy must be struck at once, before she has mobilised, and not left to choose her time." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There is no army to spare from Galicia for an offensive in the south",
        impact: { manpower: -3, munitions: -1, will: 0 },
        setFlags: { aok_isonzo: "attacked" },
        next: "aok_1915_08_pless",
        outcome:
          "Speculative. A strong force is sent to the south and attacks across the frontier " +
          "in the first weeks of the war with Italy. It takes some ground and is stopped " +
          "by the Italian army, which has had time to mobilise, and the troops taken from " +
          "Galicia have to be replaced by Germans. The monarchy has now two active " +
          "fronts and is further in debt to its ally.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  aok_1915_08_pless: {
    year: 1915, date: "1915-09-08", city: "Pless",
    title: "A Convention at Pless",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "On 8 September Falkenhayn and Conrad meet at Pless to sign a military " +
      "convention that calls for an immediate attack on Serbia. The plan on the " +
      "table puts it under a German field marshal, Mackensen, with a German army, " +
      "the Austro-Hungarian Third Army under Kovess, and, if Bulgaria comes in, " +
      "a Bulgarian one beneath him.\n\n" +
      (flags.aok_gorlice === "own"
        ? "At Gorlice an Austro-Hungarian command was insisted on, and it is a " +
          "precedent that Berlin has not forgotten. "
        : "At Gorlice a German commander was accepted, and this would be the second " +
          "time. ") +
      "Serbia has been beaten off three times by the monarchy's own " +
      "armies, and nobody at the table has to be reminded of it.",
    context:
      "A German commander over Austro-Hungarian troops is a thing the " +
      "monarchy has said it would not accept, and has accepted. The case " +
      "for refusing is that the attack on Serbia is the monarchy's own " +
      "war. The case for accepting is that Falkenhayn has the divisions " +
      "and the monarchy has not.",
    choices: [
      {
        id: "mackensen",
        label: "Sign: Mackensen commands the attack, with the Third Army under him",
        historical: true,
        advisor: { name: "Conrad", position:
          "The monarchy has failed three times alone. The Germans have the divisions and the Bulgarians are being brought in, and the war with Serbia must be ended." },
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { aok_pless: "mackensen", xc_pless: "mackensen" },
        next: "aok_1916_06_montenegro",
        outcome:
          "Mackensen takes the supreme command over the German Eleventh Army, the " +
          "Austro-Hungarian Third Army and the Bulgarian First. The attack opens on 6 " +
          "October and Austro-Hungarian troops enter Belgrade on 8 October; Bulgaria " +
          "declares war on 14 October. In November the Serbian army withdraws across " +
          "the mountains of Albania and Montenegro. Serbia is eliminated as a " +
          "threat, and a land route to the Ottoman Empire is open.",
      },
      {
        id: "own",
        label: "Sign only if the Third Army keeps its own commander and AOK's orders",
        advisor: { name: "Friedrich", position:
          "Serbia is the monarchy's quarrel and the monarchy's army should end it. A command that is German takes the credit for it." },
        gate: (m) => m.will >= -3,
        disabledReason: "Berlin has already named the commander, and AOK cannot now refuse it",
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { aok_pless: "own", xc_pless: "own" },
        next: "aok_1916_06_montenegro",
        outcome:
          "Speculative. Falkenhayn does not agree to everything, and the convention " +
          "that is signed at Pless has two commanders where the other had one. The " +
          "attack is made later and by less, and the Austro-Hungarian army is " +
          "again on the ground that has broken it three times. Whether it wins, " +
          "with the Bulgarians coming in, is not something the convention can " +
          "say. The monarchy has kept what it asked to keep.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-01
  aok_1916_06_montenegro: {
    year: 1916, date: "1916-01-04", city: "Teschen",
    title: "The Mountains Beyond Serbia",
    advisors: ["conrad", "friedrich"],
    situation:
      "Serbia has been overrun, and its army, with the King, a great many civilians " +
      "and the government, is making its way through the mountains of Albania " +
      "toward the Adriatic coast, in the winter, in a retreat in which many tens " +
      "of thousands will die. Montenegro, which stayed in the war, has not followed " +
      "them into exile.\n\n" +
      "Conrad has other plans for the spring, in the Trentino. The divisions that " +
      "would take Montenegro are divisions that cannot be moved to Italy, and " +
      "the campaign would open tomorrow.",
    context:
      "Montenegro is small and its army is not large, and the campaign " +
      "against it would be short. A short campaign still costs the divisions " +
      "that are in the Balkans something, and a month.",
    choices: [
      {
        id: "attack",
        label: "Open the campaign against Montenegro at once",
        historical: true,
        advisor: { name: "Conrad", position:
          "The Balkans are to be finished while the Serbs are in flight and the Montenegrins alone. The divisions go north when it is done." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { aok_montenegro: "attacked" },
        next: "aok_1916_07_strafe",
        outcome:
          "The campaign opens on 5 January. The Montenegrins win at Mojkovac and are " +
          "defeated within two weeks, and their army does not follow the Serbs into " +
          "exile. The monarchy has taken a second kingdom. The divisions that did it " +
          "are in the mountains in the middle of the winter, a long way from the " +
          "Trentino.",
      },
      {
        id: "halt",
        label: "Stop at the frontier and move the divisions toward the Italian front",
        advisor: { name: "Friedrich", position:
          "The Serbs are beaten and Montenegro will not move. The divisions are wanted in the Trentino, and every week they spend in the Albanian snow is a week the spring offensive loses." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Balkan command has been promised the campaign",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_montenegro: "halted" },
        next: "aok_1916_07_strafe",
        outcome:
          "Speculative. The divisions stay on the frontier and are moved north, and " +
          "Montenegro is left with its army and its king. The western Balkans are " +
          "not closed and the Adriatic is not Austrian from end to end. The " +
          "spring offensive in the Trentino has its divisions rested and earlier, " +
          "and the little kingdom, if it is still at war in March, has to be " +
          "watched.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-05
  aok_1916_07_strafe: {
    year: 1916, date: "1916-05-14", city: "Teschen",
    title: "The Punishment Expedition",
    advisors: ["conrad", "friedrich"],
    bulletin: {
      voice: "aok", date: "1916-05-12", source: "Communique of the General Staff",
      text:
        "The situation on all fronts is unchanged. On the Isonzo the artillery is " +
        "active. Our troops in the Tyrol are in good condition.",
    },
    situation: (flags) =>
      "Conrad has prepared an offensive from the Trentino, down onto the Venetian plain " +
      "behind the Italian armies on the Isonzo, to be launched tomorrow. He asked " +
      "Falkenhayn for German divisions for it, and Falkenhayn refused: he is attacking " +
      "at Verdun, and did not consult Conrad about it either.\n\n" +
      (flags.aok_gorlice === "own"
        ? "The Eastern Front is held by an army that has kept its command and has had less help."
        : "The Eastern Front is quiet, and held by an army the Germans have taught the habit of leaning on.") +
      " To make the attack with Austro-Hungarian troops alone Conrad has taken six or eight " +
      "of his best divisions out of Galicia, with all his mountain artillery, and " +
      "put raw recruits in their places.",
    context:
      "The Russians have not attacked since the summer of 1915, and the General Staff " +
      "believes that they cannot. If it is right, the offensive in the Tyrol is a " +
      "bargain. If it is wrong, the Galician front has been left bare.",
    choices: [
      {
        id: "strafe",
        label: "Launch the Trentino offensive with the army's own troops, taking the divisions from Galicia",
        historical: true,
        advisor: { name: "Conrad", position:
          "Italy has to be punished for the betrayal, and the Galician front is quiet enough to be thinned. This is the chance." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { aok_strafe: "launched" },
        next: "aok_1916_08_brusilov",
        outcome:
          "On 15 May some 2,000 guns open on the Italian lines and the infantry attacks " +
          "along a front of fifty kilometres. For the first days it succeeds, since it has " +
          "surprise. Then it slows in the mountains and meets the Italian reserves, and it is " +
          "still in the mountains when the Russians attack in Galicia, against a front that " +
          "has been stripped of its best divisions and filled with the newest.",
      },
      {
        id: "keep",
        label: "Cancel the offensive and keep the divisions in Galicia",
        advisor: { name: "Archduke Friedrich", position:
          "The army has no strength to waste on an attack that its ally will not support. The Russian front is what matters." },
        gate: (m) => m.will >= -3,
        disabledReason: "The offensive has been prepared for months and the Emperor and the General Staff have staked their name on it",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { aok_strafe: "cancelled" },
        next: "aok_1916_08_brusilov",
        outcome:
          "Speculative. The offensive in the Trentino is not made, and the divisions " +
          "stay where they are in Galicia. The Italians are left alone on the Isonzo, " +
          "and the General Staff has to tell the monarchy that the punishment of Italy " +
          "has been put off. When the Russians attack in June they find the divisions " +
          "that have not gone.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-06
  aok_1916_08_brusilov: {
    year: 1916, date: "1916-06-16", city: "Teschen",
    title: "The Front Gives Way",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "The Russians attacked on 4 June along the whole front from the Styr to the " +
      "Bukovina, and in ten days they have driven a wedge ninety kilometres wide and " +
      "sixty deep, taking some 133,600 prisoners. The Fourth and Seventh Armies are coming " +
      "apart. " +
      (flags.aok_strafe === "cancelled"
        ? "The divisions that were kept in Galicia have held better than the raw recruits would have, and the front is bending and not breaking."
        : "The divisions that would have held the line are in the Tyrol, and the raw recruits in their places have not held.") +
      "\n\nThe offensive in the Trentino is still going on, in mountains and rain. The German " +
      "command is pressing Conrad to stop it and send his divisions back.",
    context:
      "A front that has broken has to be mended from somewhere, and the only place " +
      "with troops is the one the army was trying to win. An ally that has been " +
      "refused is now being asked for help.",
    choices: [
      {
        id: "halt",
        label: "Halt the Trentino offensive and send the divisions back to Galicia",
        historical: true,
        advisor: { name: "Conrad", position:
          "The attack in the south has to be given up. The front in the east is the one that matters, and it is giving way." },
        impact: { manpower: -2, munitions: 0, will: -1 },
        setFlags: { aok_brusilov: "halted" },
        next: "aok_1916_09_supreme",
        outcome:
          "Conrad stops the Trentino offensive on 16 June and sends divisions back to " +
          "Galicia. German divisions are sent to the Austro-Hungarian front as well, and " +
          "mixed with Austro-Hungarian formations so as to hold them together. The Fourth " +
          "and Seventh Armies are almost destroyed, and the army never again has the " +
          "strength to make an offensive of its own. The blow to the monarchy's " +
          "prestige is lasting, particularly among its Slav subjects.",
      },
      {
        id: "continue",
        label: "Press on in the Trentino and ask the Germans to hold Galicia",
        advisor: { name: "Archduke Friedrich", position:
          "The attack in the south is on the point of success. It would be a mistake to abandon it now." },
        gate: (m) => m.will >= -4,
        disabledReason: "The Germans have refused, and there is nothing left in Galicia to hold the line with",
        impact: { manpower: -3, munitions: -1, will: 1 },
        setFlags: { aok_brusilov: "continued" },
        erodes: "cede_sovereignty",
        next: "aok_1916_09_supreme",
        outcome:
          "Speculative. The offensive in the south is kept up and the Germans are asked to " +
          "hold the East. They send what they have, and take control of the front in return. " +
          "The Italians are driven back a little farther, and the Russians a great deal " +
          "farther. The army has staked everything on a single front and has asked an ally " +
          "to cover its loss on the other.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-09
  aok_1916_09_supreme: {
    year: 1916, date: "1916-09-03", city: "Teschen",
    title: "One Supreme Command",
    advisors: ["conrad", "tisza", "friedrich"],
    situation: (flags) =>
      "Hindenburg and Ludendorff took over the German command on 29 August, and they " +
      "want a single supreme command for all the armies of the Central Powers, under the " +
      "German Emperor. " +
      (flags.aok_brusilov === "halted"
        ? "The Austro-Hungarian front has been broken in the summer and is held up by German divisions."
        : "The Austro-Hungarian front is held by a mixture of formations with German troops among them.") +
      "\n\nThe Archduke and Conrad are ambivalent: the proposal would end the " +
      "pretence that the monarchy commands its own armies, though it would only " +
      "put into words what the summer has made plain. The Hungarian Prime Minister does " +
      "not want the Hungarian regiments under a foreign commander.",
    context:
      "To refuse is to keep a command that cannot be used. To accept is to say, " +
      "in writing and in front of the other allies, that the monarchy's army is " +
      "no longer commanded from Vienna.",
    choices: [
      {
        id: "accept",
        label: "Agree to the Supreme War Command under the German Emperor",
        historical: true,
        advisor: { name: "Conrad", position:
          "It is what the position already is. There is more to be gained from having it said than from denying it." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { aok_supreme: "accepted" },
        erodes: "cede_sovereignty",
        next: "aok_1917_10_sixtus",
        outcome:
          "Austria-Hungary agrees on 3 September, Bulgaria and the Ottoman Empire on the " +
          "6th, and the Supreme War Command is set up on the 7th. From then on the German " +
          "Emperor is formally the supreme commander of the armed forces of the Central " +
          "Powers, and Hindenburg holds the effective command. The monarchy has " +
          "agreed to have its army directed from Berlin and keeps its own staff to carry " +
          "out the orders.",
      },
      {
        id: "refuse",
        label: "Refuse, and keep the monarchy's armies under their own command",
        advisor: { name: "Tisza", position:
          "The Hungarian regiments cannot be commanded by a foreigner. The monarchy has to keep the control of its own army." },
        gate: (m) => m.will >= -3,
        disabledReason: "The monarchy depends on German divisions and German supplies, and cannot refuse the German terms",
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { aok_supreme: "refused" },
        next: "aok_1917_10_sixtus",
        outcome:
          "Speculative. The proposal is refused and the monarchy keeps its own command. The " +
          "Germans are not pleased, and arrange the support of the front in the east " +
          "less generously than they might. The army is still commanded from Vienna, " +
          "and depends for what it has on the goodwill of an ally that has been told " +
          "it is not trusted.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-03
  aok_1917_10_sixtus: {
    year: 1917, date: "1917-03-24", city: "Baden",
    title: "The Emperor's Letter",
    advisors: ["arz", "karl", "czernin"],
    bulletin: {
      voice: "aok", date: "1917-03-22", source: "Communique of the General Staff",
      text:
        "The situation on all fronts is unchanged. His Majesty the Emperor and King has " +
        "been pleased to visit the headquarters, and has expressed his satisfaction.",
    },
    situation: (flags) =>
      "Karl has been Emperor for four months, and took the supreme command himself on " +
      "2 December. He dismissed Conrad on 1 March, and put Arz of Straussenburg in his " +
      "place, a man who does not argue with him. " +
      (flags.aok_supreme === "accepted"
        ? "The monarchy's army is under the German Supreme War Command."
        : "The monarchy still commands its own army, to the annoyance of its ally.") +
      "\n\nHe believes the war cannot be won, and that if it goes on the monarchy will come " +
      "apart. Through his brother-in-law, Prince Sixtus of Bourbon-Parma, an officer " +
      "in the Belgian army, he has opened a channel to the French President. He is " +
      "about to write a letter, and he has told the army and the foreign minister.",
    context:
      "A peace that Berlin does not know about is a peace made behind an ally's back. " +
      "A peace that Berlin does know about does not happen.",
    choices: [
      {
        id: "secret",
        label: "Support the Emperor's approach to France and keep it from the German command",
        historical: true,
        advisor: { name: "Czernin", position:
          "The monarchy cannot hold out another winter. The Emperor is right to try, and it cannot be done in front of Berlin." },
        attested: { by: "Karl I", text: "the just claims of France relating to Alsace-Lorraine",
          source: "Letter to Prince Sixtus of Bourbon-Parma, 24 March 1917 (in translation)" },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { aok_sixtus: "secret" },
        dispute:
          "Karl's letter of 24 March 1917 told the French President that he would support " +
          "France's just claim to Alsace-Lorraine. When Clemenceau published one of the letters " +
          "in April 1918 Karl denied that he had written it, and the dispute over what he had " +
          "meant, and what Czernin knew, was never settled. The letters themselves are " +
          "generally accepted as genuine.",
        next: "aok_1917_11_caporetto",
        outcome:
          "The letter goes on 24 March and nothing comes of it: the French want a " +
          "price in Alsace-Lorraine and in Italian territory that the monarchy " +
          "cannot pay. In April 1918 Clemenceau publishes the letters, and Karl " +
          "denies them. Czernin resigns, and the German command, which had not been " +
          "told, has been given the reason to treat Vienna as an ally to be watched.",
      },
      {
        id: "separate",
        label: "Make Austria's willingness to leave the war known to Berlin, as the price of going on",
        advisor: { name: "Arz von Straussenburg", position:
          "If the Emperor means to leave the war, the German command should be told, and the alliance can then decide what it will do." },
        gate: (m) => m.will >= -3,
        disabledReason: "The monarchy cannot threaten its ally with a separate peace while it is held up by that ally's divisions",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { aok_sixtus: "separate" },
        nextIf: (m) => (m.will >= -3 ? "aok_end_separate" : null),
        next: "aok_1917_11_caporetto",
        outcome:
          "Speculative. The Emperor tells Berlin that the monarchy needs peace and means to " +
          "have it, and the German command has to decide whether to meet him or to " +
          "overrule him. The French, who have heard the same message by another road, " +
          "are in no hurry to answer. The alliance, which had been held together " +
          "by what neither partner said to the other, has to survive the saying of it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-09
  aok_1917_11_caporetto: {
    year: 1917, date: "1917-09-01", city: "Baden",
    title: "Help on the Isonzo",
    advisors: ["arz", "boroevic", "karl"],
    situation: (flags) =>
      "Eleven battles on the Isonzo have brought the army to the end of what it can do on " +
      "that front, and another Italian attack is expected before the winter. The " +
      "Emperor has written to the German Emperor and asked for help: heavy guns, and " +
      "divisions to take over in the east so that Austrian ones can be moved to Italy.\n\n" +
      "Ludendorff says that six to eight German divisions can be spared until the " +
      "winter. They would form a new army, under a German general, with Austro-Hungarian " +
      "divisions in it, and attack at the northern end of the Isonzo front." +
      (flags.xc_caporetto === "refused" ? "\n\nBerlin has already answered that it will send guns and staff officers and no divisions, so what is left to settle is whether the army can do anything on the Isonzo alone." : ""),
    context:
      "An army that asks for help on a front that it has held alone for two years " +
      "is asking the ally to take the front's best success from it.",
    choices: [
      {
        id: "german",
        label: "Ask for German divisions and accept a German-commanded army at Caporetto",
        historical: true,
        advisor: { name: "Arz von Straussenburg", position:
          "The army cannot hold another battle on the Isonzo by itself. A German-led blow is the best chance of keeping the front." },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { aok_caporetto: "german" },
        erodes: "cede_sovereignty",
        next: "aok_1917_12_pursuit",
        outcome:
          "A Fourteenth Army is made up of German and Austro-Hungarian divisions, under " +
          "the German general Otto von Below. The offensive opens on 24 October and the " +
          "Italian line at Caporetto breaks. The Italians retreat to the Piave, and the " +
          "Allies send divisions to hold them. The monarchy is saved from the Italian " +
          "armies once more, and has been shown again that it is saved by someone else.",
      },
      {
        id: "defend",
        label: "Stay on the defensive on the Isonzo and ask only for guns",
        advisor: { name: "Boroevic", position:
          "The Isonzo can be held, as it has been before, if the army is given the guns and left to do it." },
        gate: (m) => m.manpower >= -6,
        disabledReason: "The army has not the divisions left to hold a twelfth battle on its own",
        impact: { manpower: -2, munitions: -1, will: -1 },
        setFlags: { aok_caporetto: "defend" },
        next: "aok_1917_12_pursuit",
        outcome:
          "Speculative. The Germans send guns and staff officers and no divisions, and the " +
          "army meets the next Italian attack on the Isonzo with what it has. The line " +
          "holds or it does not, on the strength of troops who have been defending it " +
          "since 1915. Whatever happens, the Emperor has not asked again for the help that " +
          "the monarchy needed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-11
  aok_1917_12_pursuit: {
    year: 1917, date: "1917-11-10", city: "Baden",
    title: "The Line Is the Piave",
    advisors: ["arz", "boroevic", "karl"],
    situation:
      "By 10 November the Italians have made a stand on the Piave and on Monte Grappa. " +
      "Since 24 October the armies have advanced more than a hundred kilometres toward " +
      "Venice, some units twenty-five kilometres on the first day.\n\n" +
      "The supply lines are stretched to breaking, and the troops are tired and " +
      "short of food; the Germans who made the breakthrough have the same trouble. " +
      "The question for the Emperor's staff is whether the line that has been reached " +
      "is the line to hold.",
    context:
      "An army that stops lets the enemy dig in and rebuild. An army that goes on " +
      "has to do it from the end of a railway that cannot carry what it needs, " +
      "against an enemy that is now fighting on its own ground.",
    choices: [
      {
        id: "push",
        label: "Mount one more push over the Piave and on Monte Grappa",
        historical: true,
        advisor: { name: "Boroevic", position:
          "The enemy is beaten and has not yet dug in. A pause now gives him the weeks he needs, and a line that is not pushed will have to be fought for later." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { aok_pursuit: "push" },
        next: "aok_1918_14_ukraine",
        outcome:
          "The last push runs from 15 November to 23 December and is repelled at the " +
          "First Battle of Monte Grappa, which secures the Italian positions south of " +
          "the Piave. Cadorna has been replaced by Diaz, and the Italian army, much " +
          "reduced, is rebuilt behind the river. The front, from here to the end, is " +
          "on the Piave.",
      },
      {
        id: "halt",
        label: "Halt on the line already won and dig in for the winter",
        advisor: { name: "Arz", position:
          "The army has been three weeks on the road, with its supply a hundred kilometres behind it. What it has won is worth holding, and it is not worth spending it to win a little more." },
        gate: (m) => m.will >= -4,
        disabledReason: "The Emperor will not hear of stopping while the Italians are in flight",
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { aok_pursuit: "halted" },
        next: "aok_1918_14_ukraine",
        outcome:
          "Speculative. The armies halt on the line they have reached and the engineers " +
          "come forward with the railway. The winter is spent on ground that was " +
          "Italian a month ago, with the Italians using the same weeks to rebuild what " +
          "they lost. The army has not been spent on the last push, and it has not " +
          "taken the last ground either, and what it will be asked to do in the " +
          "summer is the same thing.",
      },
    ],
  },


  // ---------------------------------------------------------------- 1918-02
  aok_1918_14_ukraine: {
    year: 1918, date: "1918-02-12", city: "Baden",
    title: "Grain From the East",
    advisors: ["arz", "karl", "czernin"],
    situation:
      "On 9 February the Central Powers signed a treaty with the Ukrainian People's " +
      "Republic, and the Rada has invited German and Austro-Hungarian troops into " +
      "Ukraine. The Central Powers have accepted, to secure food supplies for their " +
      "armies and their populations.\n\n" +
      "The monarchy is short of food. The divisions that would go east are " +
      "divisions that are not on the Italian front, where an offensive is " +
      "wanted for the summer.",
    context:
      "The grain is in Ukraine and will be taken by somebody. A German occupation " +
      "alone takes what the Germans need first. An Austro-Hungarian army in " +
      "the country has a claim to some, and it is paid for in divisions.",
    choices: [
      {
        id: "occupy",
        label: "Send Austro-Hungarian divisions into Ukraine to secure the grain",
        historical: true,
        advisor: { name: "Czernin", position:
          "The peace with Ukraine was made for bread. If the monarchy is not in the country when the grain is taken, then the Germans will have it and the towns will go without." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { aok_ukraine: "occupied", xc_ukraine: "occupied" },
        next: "aok_1918_12_piave",
        outcome:
          "Austro-Hungarian troops go into Ukraine in the weeks that follow, and on " +
          "13 March, with Ukrainian troops, they secure Odessa. The occupation is " +
          "meant to secure food supplies for the armies and the populations, and " +
          "the divisions that make it are not available for any other front. " +
          "The army that goes east is the monarchy's own, and it goes for the grain.",
      },
      {
        id: "keep",
        label: "Keep the divisions for the Italian front and leave Ukraine to the Germans",
        advisor: { name: "Arz", position:
          "The summer offensive is the army's last chance to end the war in the south, and it needs every division it has. The bread has to come by another road." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "The towns cannot be told that the army will not go for the grain",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_ukraine: "kept", xc_ukraine: "kept" },
        next: "aok_1918_12_piave",
        outcome:
          "Speculative. The divisions stay on the Italian side and the occupation of " +
          "Ukraine is a German affair, with the Germans taking the first share of the " +
          "grain. The towns of the monarchy have what the Germans send, and the " +
          "army has the divisions the offensive needs. " +
          "The summer comes with the army larger and the cities colder and " +
          "hungrier than they might have been.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-05
  aok_1918_12_piave: {
    year: 1918, date: "1918-05-20", city: "Baden",
    title: "Two Thrusts, Two Generals",
    advisors: ["arz", "boroevic", "karl"],
    bulletin: {
      voice: "aok", date: "1918-05-18", source: "Communique of the General Staff",
      text:
        "On the Italian front there is nothing of importance to report. The troops are " +
        "being rested and supplied. Our allies are making good progress in France.",
    },
    situation: (flags) =>
      "Karl approved the plan for a final offensive against Italy after a meeting at " +
      "Bolzano in February, and Ludendorff strongly recommended it, hoping to draw " +
      "Allied troops from France. " +
      (flags.aok_caporetto === "german"
        ? "The army has the memory of Caporetto to go on, and the Germans have taken their divisions away again."
        : "The army has the memory of eleven defensive battles and no victory to go on.") +
      "\n\nConrad, commanding in the Tyrol, wants to attack from the mountains toward Asiago and " +
      "Vicenza. Boroevic, on the Piave, wants to attack across the river. Each says " +
      "his is the right way. They cannot be reconciled, and the army has one army's " +
      "worth of reserves.",
    context:
      "An offensive on two fronts with half the force on each is two attacks that " +
      "may be too weak. One that goes on a single axis means one of the two commanders " +
      "has been refused.",
    choices: [
      {
        id: "divide",
        label: "Give each commander his own thrust and divide the forces equally",
        historical: true,
        advisor: { name: "Arz von Straussenburg", position:
          "The Emperor and I cannot choose between the two plans. Each will have what he asks for." },
        impact: { manpower: -3, munitions: -2, will: -2 },
        setFlags: { aok_piave: "divided" },
        dispute:
          "Whether a concentrated attack would have succeeded is argued. The Italian command " +
          "had been warned of the exact day and was ready, which suggests that any plan " +
          "would have failed. Others hold that the division of the forces between two " +
          "unrelated thrusts made certain what was only likely, and that Arz's attempt " +
          "to satisfy two strong personalities was the cause.",
        uncertain: [
          { weight: 70, title: "Both thrusts fail and the army loses its last strength", historicalBranch: true,
            impact: { manpower: -1, will: -1 },
            setFlags: { aok_piaveResult: "failed" },
            next: "aok_1918_13_vittorio",
            outcome:
              "The offensive opens at 3 a.m. on 15 June. The Italian commander, forewarned of " +
              "the day, opens his bombardment at 2.30 on the crowded trenches. The army loses " +
              "118,042 men, of whom 11,643 are killed, against Italian losses of 87,181. The " +
              "Emperor orders the retreat on 20 June, and by the 23rd the Italians have " +
              "recovered all they lost. Arz offers his resignation and is refused, and " +
              "Conrad is dismissed on 15 July." },
          { weight: 30, title: "One thrust gets across the river and holds a bridgehead",
            impact: { manpower: 1 },
            setFlags: { aok_piaveResult: "bridgehead" },
            next: "aok_1918_13_vittorio",
            outcome:
              "Speculative. One of the two attacks gets over the river in strength and holds a " +
              "bridgehead for some weeks before it is thrown back. The losses are heavy and " +
              "smaller than they were, and the army has something to show for them. It is " +
              "not enough to change the war, and it is enough to keep the Emperor's " +
              "government from asking at once for terms." },
        ],
      },
      {
        id: "concentrate",
        label: "Choose one thrust, and concentrate every available division on it",
        advisor: { name: "Boroevic", position:
          "Only one plan can be carried out with the army that is left. The Piave is the place, and the whole army should be put into it." },
        gate: (m) => m.manpower >= -6,
        disabledReason: "The army has not the reserves to hold a concentrated attack and a defensive front at once",
        impact: { manpower: -3, munitions: -2, will: -1 },
        setFlags: { aok_piave: "concentrated" },
        nextIf: (m) => (m.will >= -3 ? "aok_end_piave" : null),
        next: "aok_1918_13_vittorio",
        outcome:
          "Speculative. All the available divisions are put into a single attack, and Conrad's " +
          "army in the mountains is left on the defensive. The Italian command is " +
          "forewarned, and faces one attack and not two. Whether it breaks through, or fails " +
          "in a more concentrated way, is something the record cannot show. One of the two " +
          "commanders has been overruled, and has to be told.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  aok_1918_13_vittorio: {
    year: 1918, date: "1918-10-28", city: "Baden",
    title: "Units That No Longer Obey",
    advisors: ["arz", "boroevic", "karl"],
    situation: (flags) =>
      "On 16 October the Emperor issued a proclamation making the Austrian half of the " +
      "monarchy a federal union, and it was too late to hold anything together. " +
      (flags.aok_piave === "concentrated"
        ? "The army made one great attack in June and is weaker than it would have been."
        : "The army lost the June offensive and has never recovered.") +
      "\n\nThe Italians attacked on 24 October, the anniversary of Caporetto, and the " +
      "units of the army are refusing orders, one nationality after another. Boroevic's " +
      "counter-attack on the 27th failed because his troops would not obey. " +
      "The Chief of the General Staff has to say what the army is to do.",
    context:
      "An army that cannot be ordered to attack can still be ordered to retire. One " +
      "that cannot be ordered to do either is asking for terms in the only way it " +
      "can, by dissolving.",
    choices: [
      {
        id: "armistice",
        label: "Order the general retreat and ask for an armistice at once",
        historical: true,
        advisor: { name: "Arz von Straussenburg", position:
          "The army can no longer be made to fight. The only thing left to do is to bring it out in order and to ask for terms." },
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { aok_vittorio: "armistice" },
        nextIf: (m, flags) =>
          m.will <= -9 ? "aok_end_dissolution"
          : flags.aok_serbia === "galicia" ? "aok_end_galiciafirst"
          : flags.aok_piave === "concentrated" ? "aok_end_piave"
          : flags.aok_sixtus === "separate" ? "aok_end_separate"
          : null,
        next: "aok_end_dissolution",
        outcome:
          "The high command orders a general retreat on 28 October and asks the Italians for " +
          "an armistice. The armistice of Villa Giusti is signed on 3 November at 3.20 in " +
          "the afternoon, to take effect twenty-four hours later, after the Italian general " +
          "refuses to stop the fighting at once. The Italians take some 448,000 prisoners, " +
          "about a third of the army, with 24 generals. Arz resigns on 3 November.",
      },
      {
        id: "german",
        label: "Ask the German command to take over the front and fight on with the troops that will still obey",
        advisor: { name: "Karl I", position:
          "The army is the one thing left that the monarchy has. If the Germans can hold the line with it, it should be held." },
        gate: (m) => m.will >= -6,
        disabledReason: "There is no German reserve left to take over a front, and the army will not wait for one",
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { aok_vittorio: "german" },
        erodes: "cede_sovereignty",
        nextIf: (m) => (m.manpower >= -6 ? "aok_end_satellite" : null),
        next: "aok_end_dissolution",
        outcome:
          "Speculative. The Emperor asks the German Emperor to take the front, and the " +
          "German command takes over what it can of it. The army's units that will still " +
          "obey are put under German officers, and the rest are sent home. The monarchy " +
          "continues to exist, as a country whose armies are commanded from Berlin and " +
          "whose government is a guest of the alliance.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  aok_end_dissolution: {
    year: 1918, date: "1918-11-03", city: "Villa Giusti",
    title: "The Army Goes Home",
    advisors: ["arz"],
    situation:
      "The armistice is signed in a villa near Padua, and the army that signed it is " +
      "no longer an army. The Czechs, the Poles, the South Slavs and the Hungarians have " +
      "gone home as regiments, with their weapons, to the countries that they now " +
      "belong to. What is left is a staff, a number of Austrian German and " +
      "Hungarian regiments in good order, and several hundred thousand prisoners.\n\n" +
      "The monarchy ends as the army did: not with a battle, but because each part of " +
      "it decided it had a better place to be.",
    ending: { family: "dissolution", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "Serbia and Galicia, 1914: " + (flags.aok_serbia === "galicia" ? "the swing force sent to Galicia first." : "the swing force sent to Serbia first, then recalled.") + "\n" +
      "The offensive into Russian Poland: " + (flags.aok_galicia === "defensive" ? "refused, and the army stood behind the San." : flags.aok_galiciaResult === "checked" ? "launched, and checked before the flank was turned." : "launched, and ended at Lemberg.") + "\n" +
      "Rawa, September 1914: " + (flags.aok_rawa === "brokeoff" ? "the battle broken off and the army drawn back behind the San." : "the decisive blow left to go on, and the retreat to the Dunajec.") + "\n" +
      "Serbia, autumn 1914: " + (flags.aok_kolubara === "declined" ? "the third invasion declined." : "the third invasion made, and Belgrade lost again.") + "\n" +
      "Przemysl, 1915: " + (flags.aok_carpathians === "held" ? "the passes held, and the fortress left to its fate." : "relief pressed through the Carpathian winter.") + "\n" +
      "Przemysl, February 1915: " + (flags.aok_przemyslend === "third" ? "a third relief attempt ordered." : "the fortress told that no more relief would come.") + "\n" +
      "Gorlice: " + (flags.aok_gorlice === "own" ? "an Austro-Hungarian command insisted on." : "a German commander accepted.") + "\n" +
      "Italy: " + (flags.aok_isonzo === "attacked" ? "attacked at once." : "the Isonzo held.") + "\n" +
      "Serbia, September 1915: " + (flags.aok_pless === "own" ? "the attack made under AOK's own orders." : "the attack made under Mackensen.") + "\n" +
      "Montenegro, January 1916: " + (flags.aok_montenegro === "halted" ? "left alone, and the divisions moved north." : "the campaign opened at once.") + "\n" +
      "The Trentino, May 1916: " + (flags.aok_strafe === "cancelled" ? "the offensive cancelled." : "launched, with the Galician divisions taken for it.") + "\n" +
      "June 1916: " + (flags.aok_brusilov === "continued" ? "the offensive in the south kept up." : "the offensive halted and the divisions sent back.") + "\n" +
      "The Supreme War Command: " + (flags.aok_supreme === "refused" ? "refused." : "accepted.") + "\n" +
      "March 1917: " + (flags.aok_sixtus === "separate" ? "the Emperor's wish for peace put to Berlin." : "the Emperor's approach to France kept from the German command.") + "\n" +
      "Caporetto: " + (flags.aok_caporetto === "defend" ? "the Isonzo defended without German divisions." : "a German-commanded army accepted.") + "\n" +
      "November 1917: " + (flags.aok_pursuit === "halted" ? "the armies halted on the line they had won." : "one more push over the Piave and on Monte Grappa.") + "\n" +
      "February 1918: " + (flags.aok_ukraine === "kept" ? "the divisions kept for the Italian front." : "divisions sent into Ukraine for the grain.") + "\n" +
      "June 1918: " + (flags.aok_piave === "concentrated" ? "one thrust, with the whole army." : flags.aok_piaveResult === "bridgehead" ? "two thrusts, one of which held a bridgehead for a time." : "two thrusts, and the forces divided.") + "\n" +
      "October 1918: " + (flags.aok_vittorio === "german" ? "the German command asked to take the front." : "the retreat ordered and an armistice asked for.") + "\n\n" +
      "What actually happened: The armistice of Villa Giusti came into effect on 4 November 1918. The Italians had taken about 448,000 prisoners, a third of the army, and some 5,600 guns. Emperor Karl issued a proclamation on 11 November that recognised the right of the Austrian people to decide the form of the state, without using the word abdication. The monarchy was succeeded by Austria, Hungary, Czechoslovakia and the Kingdom of Serbs, Croats and Slovenes.",
  },

  aok_end_separate: {
    year: 1917, date: "1917-07-15", city: "Vienna",
    title: "Out, Early",
    advisors: ["karl"],
    situation:
      "The Emperor told his ally what he intended, and the ally has to decide what to do " +
      "about it. The German command has the power to occupy the monarchy and does not " +
      "use it. The French and the British, who were not waiting for the offer, have to " +
      "consider whether they believe it, and whether a peace on those terms leaves them " +
      "with an enemy or with an ally.\n\n" +
      "The monarchy has ceased to be a belligerent in all but name.",
    ending: { family: "earlier-separate-peace", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Emperor's letters to France did not lead to a separate " +
      "peace. What actually happened: the letter of 24 March 1917 was followed by " +
      "meetings and messages through the spring, and nothing was agreed, since the " +
      "French wished for concessions to Italy that Vienna would not make. The " +
      "Austro-Hungarian army went on fighting until October 1918, and in April 1918 " +
      "Clemenceau published the letters, and Czernin resigned. The German command " +
      "never fully trusted Vienna again. The Sixtus affair is one of the few " +
      "episodes of the war in which a counterfactual is not idle: the Emperor did " +
      "try, and the obstacle was the price asked in territory and the ally he could " +
      "not leave. The attempt made the German command wary of Vienna, and the " +
      "Emperor's denial in 1918 damaged his word with both sides.",
  },

  aok_end_satellite: {
    year: 1918, date: "1918-11-03", city: "Baden",
    title: "A Province of the Alliance",
    advisors: ["karl"],
    situation:
      "The German command took over the front, and the army that was left was put " +
      "under German officers, who had no idea of the languages in which their " +
      "soldiers spoke and no time to learn them. The monarchy's governments were " +
      "consulted about the occupation and not asked.\n\n" +
      "It survives, in a form that no one in Vienna imagined in 1914: a state with a " +
      "court, a parliament and a foreign minister, and no army of its own.",
    ending: { family: "survival-as-a-satellite", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Emperor did not ask the German command to take over the " +
      "Italian front in October 1918. What actually happened: the Germans had no " +
      "reserve to give, and were themselves asking for an armistice by the second " +
      "week of November. The dependence on Germany that had grown since Gorlice in " +
      "May 1915, through the Supreme War Command of September 1916 and the " +
      "German-commanded army at Caporetto, was already complete, and ended with the " +
      "Central Powers' defeat. The monarchy's armies were never formally put under " +
      "German command, but each acceptance of a German commander or a German plan, " +
      "from Mackensen's army in 1915 to the Fourteenth Army in 1917, took something " +
      "from what the Austro-Hungarian General Staff decided for itself. The " +
      "historians who call the monarchy a satellite by 1918 are describing that " +
      "process.",
  },

  aok_end_galiciafirst: {
    year: 1918, date: "1918-11-03", city: "Villa Giusti",
    title: "The Right War First",
    advisors: ["arz"],
    situation:
      "The swing force went to Galicia, and the army that met the Russians in August 1914 " +
      "was stronger by a whole army. The first battles were fought on equal terms, and " +
      "the losses of the autumn were smaller.\n\n" +
      "Serbia was left alone for a year. The monarchy had gone to war to punish her, and " +
      "the war went on without it. In the end the army reached the same armistice by a " +
      "road that cost it less.",
    ending: { family: "galicia-first", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Second Army was sent to Serbia first, and then recalled. " +
      "What actually happened: the Balkan campaign of August 1914 cost the army " +
      "heavily and gained nothing. The Second Army was recalled to Galicia, where " +
      "it arrived too late for the first battles, and Conrad lost a great part of " +
      "the army's regular strength in the first six months of the war. The " +
      "monarchy's armies were never again as strong as they had been when they " +
      "marched in August. The decision to divide the army in the first month of the " +
      "war, between a punitive campaign in the south and the real war in the north, " +
      "is the one most often called the monarchy's original mistake. It meant that " +
      "neither campaign was fought with the whole army, and it is hard to find a " +
      "historian who defends it.",
  },

  aok_end_piave: {
    year: 1918, date: "1918-11-03", city: "Villa Giusti",
    title: "One Blow",
    advisors: ["boroevic"],
    situation:
      "The army put its whole strength into one attack, and it was a great one. It did " +
      "not break the Italian line, and it was not entirely beaten. It took more of the " +
      "ground, and held it longer than the other had, and the army that was left at the " +
      "end of the summer had still something to hold together.\n\n" +
      "The war ended in November, as it was going to end.",
    ending: { family: "concentrated-offensive", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The offensive of June 1918 was made in two thrusts, and failed. " +
      "What actually happened: the Italian command was forewarned of the day and " +
      "opened its bombardment half an hour before the Austro-Hungarian guns, and " +
      "the army lost 118,042 men, against Italian losses of 87,181. The retreat was " +
      "ordered on 20 June and by the 23rd the Italians had recovered all that they " +
      "had lost. The failure struck, in the words of one account, a major blow to " +
      "the army's morale and cohesion. The offensive of June 1918 was the last the " +
      "monarchy made, and the army that made it had been promised that it would be " +
      "the one that ended the war. The failure was followed by dismissals, by the " +
      "first open refusals of orders among the national units, and by the Emperor's " +
      "attempt, in October, to remodel the state.",
  },

  aok_end_relieved: {
    year: 1918, date: "1918-06-25", city: "Baden",
    title: "The Emperor Changes His Chief",
    advisors: ["karl"],
    situation:
      "There was no single decision that did it. There was a series of agreements to German " +
      "direction, each of which could be defended and each of which was a little less " +
      "of the army's command, until the day came when it was hardly worth the name.\n\n" +
      "The Emperor decides that he needs a Chief of Staff who can say no to the Germans, " +
      "and has none to hand.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "What actually happened: Arz remained Chief of the General Staff until 3 " +
      "November 1918, after offering his resignation over the failure of the June " +
      "offensive, which the Emperor refused. Conrad was dismissed on 15 July. The " +
      "Emperor did not find a Chief of Staff who could say no to the Germans, since " +
      "the army's dependence on them was not a matter that a change of Chief could " +
      "undo, and by the end of the war it was the Emperor himself who had no " +
      "command left to give. The Chief of the General Staff had few choices of his " +
      "own by 1918: the Emperor ruled in the army's name, the Germans directed its " +
      "operations, and the army's regiments increasingly answered to the national " +
      "councils at home. Arz's resignation, when it came on 3 November, was a " +
      "matter of form.",
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

// -----------------------------------------------------------------------------
// FRONT MAP DATA (generated by tools/_mkmap.cjs; land outline: Natural Earth, public domain)
// -----------------------------------------------------------------------------

export const MAP_VIEW = { width: 600, height: 354, lon: [-9, 46], lat: [42, 62] };

/** City -> [x, y] in MAP_VIEW units. Every node's `city` must be here (check-maps.js). */
export const MAP_CITIES = {"Amiens":[123.3,214.3],"Antwerp":[146.2,190.8],"Avesnes":[141.1,210.3],"Bad Homburg":[192.2,208.3],"Baden":[275.2,247.6],"Bar-sur-Aube":[149.6,243.7],"Baranovichi":[382,157],"Belgrade":[321.4,304.1],"Berdichev":[410,214.2],"Berlin":[244.4,167.8],"Bombon":[128.7,236.8],"Brest-Litovsk":[356.5,175.2],"Calais":[118.5,195.6],"Chantilly":[125.1,226.7],"Charleville":[149.7,216.5],"Chatillon-sur-Seine":[148,250.3],"Chemin des Dames":[138.5,222.1],"Compiegne":[129.1,222.7],"Doullens":[123.7,209.6],"Dury":[123.1,215.9],"Gorlice":[329,218.4],"Kiev":[431.1,204.4],"Koblenz":[181,206],"Kreuznach":[184,215.1],"La Malmaison":[137.1,221.8],"London":[96.8,185.7],"Luxembourg":[165.1,219.3],"Lvov":[360.3,215.2],"Mogilev":[429.2,143.4],"Montreuil":[117.4,204.3],"Novocherkassk":[535.6,258.1],"Paris":[123.8,232.6],"Petrograd":[429.2,36.6],"Pless":[304.9,212.9],"Provins":[134.2,237.9],"Przemysl":[346.6,216.3],"Pskov":[407.2,74],"Saint-Omer":[122.8,199.1],"Saint-Quentin":[134.1,215.1],"Senlis":[126.3,226.4],"Soissons":[134.5,223.4],"Spa":[162.1,203.7],"Tarnopol":[377.3,220.4],"Teschen":[301.4,216.8],"Verdun":[156.9,227.3],"Vienna":[276.8,244.1],"Villa Giusti":[227.8,293.6],"Villers-Cotterets":[132,225.7],"Vitry-le-Francois":[148.1,235.1],"Ypres":[129.7,197.4]};

export const MAP_LAND_PATH = "M344.9 59.8L345.7 60.2L346.4 60.1L347.1 59.8L348.7 60.1L352.3 62.2L352.6 62.8L350.5 63.1L350.0 63.8L349.5 64.2L348.9 64.4L347.8 65.3L346.4 66.2L346.1 66.7L343.6 66.6L342.2 67.0L341.1 68.0L340.7 69.9L339.8 71.4L339.0 71.9L338.2 72.0L337.9 71.4L339.8 68.8L340.2 68.1L339.3 67.7L338.6 67.0L336.9 66.2L336.6 65.5L337.4 65.2L337.8 64.6L338.0 64.0L336.7 62.0L337.4 61.7L338.2 61.8L339.1 62.3L340.0 61.7L341.1 61.8L341.8 60.5L343.3 60.1L344.1 59.7L344.9 59.8ZM306.3 73.7L305.4 74.1L304.9 75.4L304.1 75.6L303.4 76.0L303.2 79.9L304.5 81.5L303.8 81.7L303.1 82.1L302.7 82.8L302.2 84.2L300.4 85.0L299.8 85.6L298.8 87.0L298.3 88.9L297.3 89.7L296.1 89.9L296.8 88.3L297.7 87.0L296.8 86.2L296.3 84.7L295.7 83.7L296.2 82.5L295.9 80.6L296.0 78.7L296.8 77.7L297.6 76.9L299.0 75.1L300.4 73.8L302.4 73.2L303.3 73.7L303.7 72.6L304.4 72.3L305.0 72.6L306.3 73.7ZM235.3 110.0L235.3 111.8L234.6 112.6L233.5 113.0L232.6 113.5L231.7 114.4L231.5 115.7L232.1 116.6L233.3 117.1L233.6 118.8L232.6 119.7L230.1 120.6L229.8 122.7L229.9 124.3L229.8 125.5L229.6 127.2L227.6 127.9L226.3 125.4L226.3 124.4L225.8 123.2L225.8 122.2L225.3 120.6L223.4 120.2L222.6 120.1L221.6 120.4L220.0 118.1L220.3 115.7L219.6 114.4L219.5 113.3L219.0 112.8L218.3 112.5L217.9 111.1L218.7 110.8L220.6 111.0L221.7 110.6L223.2 108.3L223.4 107.2L225.0 107.0L225.8 107.8L225.6 109.2L225.7 111.0L226.7 111.5L227.5 110.2L227.8 109.6L228.4 108.0L228.2 107.3L227.6 106.8L229.5 105.3L231.5 104.1L232.6 104.0L233.8 104.3L234.8 104.7L235.4 105.1L235.7 105.6L235.0 106.9L234.8 107.6L235.3 110.0ZM214.3 113.1L214.8 114.0L215.3 116.0L216.2 118.2L215.8 119.1L216.1 120.3L215.8 121.6L214.1 123.0L212.1 123.0L210.1 122.4L207.1 121.0L206.9 120.3L205.7 117.6L205.8 114.8L207.2 114.4L210.4 113.1L211.1 113.3L211.9 114.0L212.8 114.0L214.1 113.0ZM201.6 339.7L201.3 342.3L201.5 343.1L201.9 343.6L202.1 344.2L202.4 351.1L201.3 354.0L192.6 354.0L193.1 353.2L193.1 352.3L192.5 351.9L191.9 351.1L191.6 350.1L192.1 349.4L192.8 349.0L192.3 347.9L191.6 347.7L192.4 346.4L193.2 344.3L194.3 343.2L196.3 342.6L196.9 342.3L197.3 341.5L197.9 341.0L198.5 341.1L199.1 341.4L199.8 341.4L200.0 340.4L199.9 339.6L200.0 337.3L200.3 336.0L201.4 336.6L201.4 337.3L201.6 338.8L201.6 339.7ZM64.3 61.7L64.3 63.1L64.0 64.1L63.1 65.1L61.0 66.6L57.0 69.9L54.6 71.5L54.3 72.3L54.2 73.4L55.6 73.6L56.1 74.0L55.8 74.6L53.7 76.5L53.1 78.3L54.7 78.2L56.0 77.9L58.6 76.8L61.0 76.0L62.2 75.9L64.5 76.6L66.0 76.3L67.0 76.3L73.7 76.4L75.5 76.1L76.8 76.5L77.8 77.7L78.8 79.8L78.2 81.1L77.1 82.3L76.1 83.9L75.9 84.8L75.7 85.8L75.4 86.7L73.5 90.9L71.7 93.3L70.9 94.9L69.9 96.3L68.9 97.1L67.9 97.6L64.9 98.3L64.1 98.7L63.1 99.4L62.1 99.8L63.3 99.7L64.5 99.3L66.7 99.2L69.3 100.6L69.0 101.7L68.0 102.6L65.7 102.8L63.5 104.8L62.5 105.4L61.5 105.7L60.2 105.6L57.9 105.1L56.8 104.5L57.8 105.4L58.8 105.9L64.9 107.0L67.2 105.7L69.8 105.7L74.8 107.9L76.2 109.6L78.2 112.0L79.3 112.9L80.1 113.8L80.6 115.1L81.6 119.3L82.6 123.4L84.1 127.9L84.7 129.1L85.6 130.0L89.9 132.0L90.9 132.7L92.5 134.6L94.2 136.7L95.6 138.2L97.3 139.5L96.5 140.2L95.9 141.2L96.4 142.6L97.0 144.0L98.3 146.2L99.5 148.5L98.6 148.0L98.0 148.0L96.3 147.2L95.2 146.3L93.1 146.6L92.0 146.5L91.0 146.5L92.9 147.0L95.0 147.1L99.6 151.0L101.1 153.4L102.1 156.5L101.4 157.9L100.4 158.8L99.5 159.8L98.7 161.0L101.2 162.7L102.4 162.4L102.9 161.8L103.8 160.4L104.3 159.9L105.9 159.7L107.2 159.8L108.5 160.1L109.7 160.0L112.1 160.6L113.2 161.2L116.3 163.6L116.9 165.0L117.2 166.8L117.2 168.7L116.7 170.5L116.1 172.1L115.8 174.1L115.6 174.9L115.2 175.4L113.6 177.1L112.5 177.8L111.6 177.5L112.1 178.7L112.1 179.7L111.2 180.5L110.2 180.8L108.6 180.4L106.4 181.8L108.0 182.5L108.3 183.3L107.9 184.6L106.9 185.2L105.8 185.4L104.6 185.5L103.7 185.8L102.8 186.4L103.9 186.1L104.7 186.4L105.2 187.5L107.9 188.3L109.2 188.3L111.9 188.0L113.2 188.1L113.6 189.2L113.4 191.5L109.6 193.9L108.8 195.2L108.6 196.0L106.6 195.9L105.7 196.7L104.0 197.3L102.7 197.9L101.5 198.7L100.4 198.9L96.0 198.0L93.3 198.1L89.6 198.9L88.7 198.7L87.3 198.0L85.8 197.4L84.2 197.2L82.7 196.5L83.6 197.9L81.6 199.2L80.7 199.4L79.8 199.4L77.8 199.8L76.0 199.6L76.3 200.5L76.8 201.3L76.0 201.7L72.6 201.1L71.7 201.8L70.4 201.5L69.2 200.6L67.9 199.9L66.5 199.6L65.4 199.7L61.0 201.2L60.1 202.7L59.7 204.8L59.1 206.7L58.0 208.1L56.8 208.4L55.6 207.3L53.4 206.2L52.6 205.5L51.3 206.1L50.4 206.1L49.0 206.4L46.6 207.3L45.6 207.9L43.5 209.6L43.1 210.0L42.4 211.7L41.2 212.0L40.1 210.9L38.9 210.5L37.6 210.9L36.9 211.5L36.5 210.1L37.4 208.9L39.9 208.0L42.1 205.8L43.2 204.4L43.6 203.6L44.1 203.1L44.8 202.9L45.1 202.1L48.2 198.6L48.4 197.9L48.6 196.5L48.8 195.1L51.3 194.2L52.5 191.4L56.3 190.6L58.8 190.7L61.4 191.2L62.7 191.3L64.0 191.1L65.0 190.3L66.7 187.5L67.7 186.3L68.9 185.2L69.9 183.9L71.7 181.6L70.5 182.4L69.1 183.7L68.3 184.4L65.7 185.2L64.6 185.9L62.6 187.6L59.3 187.4L57.1 185.2L55.7 184.2L55.2 184.1L54.6 184.4L53.3 184.7L52.0 184.6L52.6 183.6L53.5 183.0L51.5 182.6L51.0 182.3L50.3 181.6L48.8 181.5L48.0 181.7L46.7 182.6L44.7 183.6L42.3 182.2L41.8 181.6L41.8 180.4L41.5 179.4L40.8 179.1L41.6 177.9L42.7 177.1L44.9 176.2L48.4 174.3L50.4 173.5L52.2 172.1L52.9 171.2L53.5 170.0L54.0 168.6L54.8 167.4L54.0 167.1L53.7 166.2L53.8 165.3L54.1 164.5L53.8 163.5L53.3 162.5L53.3 161.7L53.4 160.8L52.1 160.9L50.6 161.1L49.4 161.7L48.2 162.6L47.1 162.7L47.1 162.1L47.6 161.2L48.8 160.1L50.1 159.1L50.6 158.3L51.0 157.4L51.6 156.7L53.4 155.4L56.6 153.9L58.4 154.0L59.7 153.8L60.8 153.3L61.9 153.1L64.4 154.7L63.6 152.3L64.7 151.8L66.4 153.9L66.9 154.1L68.2 153.8L67.7 153.4L66.4 153.1L65.8 152.4L64.7 150.2L64.8 148.9L65.5 147.6L66.3 146.3L65.6 146.1L65.1 145.6L65.0 144.4L65.2 143.3L66.5 142.3L66.9 140.8L67.1 139.2L66.9 138.5L65.5 138.6L64.9 138.9L64.3 139.4L63.6 139.3L62.0 137.5L61.0 136.2L59.2 133.3L59.0 131.6L60.4 127.9L62.5 125.5L65.1 124.7L60.7 124.5L59.4 124.8L58.3 125.8L57.6 126.1L56.9 126.2L56.3 126.7L55.7 127.4L55.0 127.8L53.7 127.7L53.1 127.8L52.3 126.8L51.2 126.8L50.1 127.7L48.9 128.2L47.5 127.6L45.6 126.6L44.8 127.9L44.6 129.4L43.3 128.1L42.2 126.4L41.8 125.4L41.8 124.2L42.4 123.7L43.0 124.1L44.0 121.2L46.0 117.5L46.7 116.5L47.1 115.0L47.1 114.1L46.6 113.3L44.8 111.5L44.8 110.1L45.0 108.4L45.5 107.4L48.2 107.3L47.2 106.8L45.3 105.3L45.8 103.4L45.2 104.2L44.4 105.7L42.6 106.4L42.4 107.2L41.5 107.4L41.3 108.2L40.9 107.4L40.9 106.2L41.2 105.0L41.7 104.1L43.7 102.1L42.7 102.7L40.5 104.6L39.4 105.9L39.1 106.6L39.6 109.3L39.4 110.3L37.6 117.0L37.2 117.7L36.6 118.1L35.7 118.0L35.2 117.5L35.4 116.1L36.2 112.9L36.5 112.0L37.1 111.1L38.1 109.7L37.4 109.9L36.9 109.5L37.0 105.2L37.6 103.8L37.8 101.8L38.3 100.0L38.9 98.7L39.4 97.1L40.0 96.4L40.2 95.3L41.0 94.1L41.6 92.8L37.5 96.2L36.5 96.8L35.2 96.6L34.2 96.3L33.4 95.5L33.0 94.0L32.1 94.0L31.3 93.7L32.3 92.7L34.1 92.4L35.7 91.1L34.2 90.2L35.6 89.2L37.2 86.7L37.5 84.4L36.7 83.3L36.5 82.6L35.0 81.8L34.7 80.8L35.4 79.7L36.1 79.2L37.3 78.8L36.2 78.4L35.8 77.9L35.5 77.1L36.1 74.7L36.4 73.9L37.0 72.9L39.8 73.0L40.5 72.5L41.9 72.9L39.3 70.0L39.8 68.3L39.8 67.0L40.7 66.3L43.0 66.4L43.3 65.5L42.7 64.7L42.7 64.0L42.8 63.4L42.8 62.1L43.5 60.8L44.5 60.4L45.7 60.7L46.8 61.8L48.7 60.9L49.8 61.7L52.5 60.9L56.1 60.6L58.2 60.1L60.5 59.9L62.6 59.3L64.9 59.6L64.8 60.4L64.3 61.7ZM19.9 122.9L20.7 123.1L21.5 122.5L22.4 120.7L23.0 120.6L23.7 120.7L25.1 120.5L27.5 119.6L28.6 119.6L30.2 120.0L31.3 120.0L32.3 121.3L32.9 123.4L34.1 125.4L35.8 127.1L35.9 128.2L35.3 128.8L34.0 129.5L34.1 130.2L34.9 129.8L35.6 129.7L37.3 129.8L37.9 130.6L38.3 131.8L38.5 132.7L38.3 133.8L37.4 132.5L36.9 132.1L36.3 131.9L36.6 133.1L36.5 134.9L37.6 135.0L37.0 136.8L35.9 137.3L34.6 137.4L34.3 138.1L34.1 138.9L33.4 140.0L32.5 140.7L31.4 140.6L30.3 140.0L30.8 140.7L31.0 141.3L30.2 141.5L29.4 141.4L28.9 142.6L29.2 143.7L29.8 144.4L30.2 146.1L30.6 147.9L31.2 149.1L31.3 150.5L31.2 151.1L31.3 152.4L31.2 154.0L31.9 156.4L32.2 157.7L32.4 160.6L31.9 161.7L31.3 162.7L30.9 163.9L30.6 165.2L30.4 167.4L29.0 169.9L28.4 170.5L27.7 170.9L29.2 172.6L27.9 173.4L26.6 173.7L25.1 173.2L24.2 173.3L23.3 173.9L22.8 174.0L22.2 172.6L21.8 174.1L20.9 174.5L19.5 174.4L17.0 174.8L16.1 175.3L15.7 175.9L15.4 176.7L14.5 177.4L12.7 177.9L11.4 179.4L10.3 180.1L9.3 180.3L8.5 179.6L7.8 178.9L6.5 179.0L7.1 179.7L7.2 180.7L7.1 181.6L6.5 182.1L5.7 182.2L4.5 183.2L2.9 183.4L2.0 184.4L0.0 184.9L0.0 165.8L2.4 165.0L0.8 164.4L0.1 163.6L0.0 156.4L0.8 155.6L0.0 155.3L0.0 136.5L2.8 136.9L4.5 137.5L4.7 136.2L4.1 135.5L4.8 134.5L5.8 133.8L6.4 133.4L7.8 133.0L8.4 132.6L8.8 131.3L9.4 130.2L5.9 130.8L2.6 129.5L3.1 128.7L3.8 128.1L5.0 127.7L5.8 126.9L6.8 125.9L6.4 124.5L6.6 123.5L7.4 122.9L7.6 122.0L7.9 121.3L9.4 121.1L10.9 120.4L13.1 120.4L13.6 120.6L13.5 119.5L14.5 119.4L15.1 120.4L15.6 120.9L15.7 121.7L15.4 122.4L14.9 122.9L15.4 123.5L14.6 124.4L15.5 124.0L16.6 123.1L16.6 122.3L16.4 121.3L16.0 120.5L16.2 119.5L16.8 118.9L18.5 118.6L17.8 117.5L18.4 117.4L19.1 117.7L20.1 118.5L21.1 119.2L22.2 119.7L21.2 120.8L19.9 121.5L19.4 122.3L19.9 122.9ZM600.0 0.0L600.0 354.0L461.1 354.0L462.3 353.7L465.2 354.0L478.4 354.0L480.1 352.9L481.7 353.5L553.6 354.0L552.7 351.4L551.8 347.0L550.8 342.3L550.0 340.9L546.9 339.3L546.1 337.5L543.7 335.2L540.3 334.2L539.6 333.7L536.6 330.8L534.3 328.9L533.2 327.9L529.3 323.4L527.2 320.4L520.5 313.5L519.7 313.0L516.1 312.0L514.7 311.2L511.1 306.2L509.5 306.9L508.1 306.7L507.2 306.3L506.3 305.6L505.7 304.7L504.9 302.6L504.0 301.4L501.2 299.7L498.0 298.7L497.6 297.6L500.4 296.5L501.2 295.8L499.8 294.9L498.8 294.3L499.6 293.7L500.4 293.3L501.6 294.1L503.0 295.5L504.2 296.1L504.7 295.4L508.9 294.2L509.2 293.3L509.2 292.2L508.5 292.1L508.5 290.9L509.1 289.3L511.0 286.7L512.0 283.2L512.9 282.3L513.5 282.9L513.5 283.7L513.6 284.3L514.2 283.1L514.7 281.5L516.1 281.5L517.1 281.8L518.1 281.6L516.2 278.9L513.6 276.2L512.5 276.4L511.8 276.0L510.6 273.8L510.2 271.9L511.3 272.0L512.4 272.3L514.5 271.0L515.2 270.8L516.5 271.2L518.2 271.4L518.1 270.2L517.5 268.8L519.6 267.8L521.4 267.2L525.0 265.1L526.6 264.7L526.8 263.6L526.3 262.0L525.8 260.7L523.9 260.7L522.9 262.4L520.0 263.0L518.7 262.8L519.8 261.7L520.7 261.3L519.0 261.3L518.0 262.4L515.0 263.9L510.8 263.8L507.7 264.2L505.5 267.0L504.2 267.0L502.3 267.7L501.1 268.6L499.6 270.5L498.4 269.7L497.0 269.7L495.6 270.2L494.0 271.5L493.0 271.8L491.2 271.4L489.0 272.1L484.4 276.4L482.8 279.6L482.2 280.2L481.4 281.0L480.6 281.4L482.4 279.1L483.0 278.3L483.2 277.6L483.2 276.6L482.5 275.4L480.7 278.5L479.7 278.9L478.4 279.8L478.3 281.9L478.4 283.4L479.0 285.4L480.3 288.5L482.8 293.0L484.1 294.6L485.0 295.3L486.1 295.4L488.2 294.0L489.1 293.8L491.1 294.3L491.8 293.4L492.8 292.9L494.1 292.8L495.6 293.2L497.2 293.9L496.5 295.5L495.8 296.8L495.6 298.2L495.2 299.7L493.4 300.4L491.5 300.4L489.5 300.8L488.8 300.2L488.3 299.6L487.4 299.1L486.2 298.8L485.2 299.2L483.9 301.3L481.7 302.7L481.0 304.4L478.8 304.0L476.9 304.3L474.2 305.8L472.2 309.1L469.9 311.1L468.1 311.8L466.4 311.5L465.3 310.9L463.1 308.8L463.2 308.0L464.0 306.6L464.9 302.5L464.7 301.2L464.2 299.2L462.5 297.6L461.0 297.9L460.2 297.5L457.3 294.7L455.7 294.5L453.9 295.1L453.3 294.7L452.8 293.7L456.3 290.4L459.7 287.6L461.2 287.4L463.3 286.1L465.4 284.1L465.1 282.6L464.7 281.5L463.6 281.8L462.9 282.2L461.0 281.0L460.4 280.1L457.6 281.0L456.0 280.9L452.5 281.7L450.9 280.9L447.7 278.6L446.5 278.1L445.4 278.2L444.9 277.5L445.6 277.1L446.4 277.0L447.2 276.8L447.4 275.6L445.7 275.0L444.2 274.9L443.2 274.2L442.4 273.4L444.2 273.4L445.9 274.0L448.7 274.2L451.2 274.8L451.9 274.0L453.3 272.7L451.1 273.2L448.7 272.6L447.8 271.8L447.0 270.6L446.7 269.3L446.9 268.1L446.6 265.8L445.8 263.8L445.5 262.7L444.6 261.7L445.5 264.0L445.8 265.4L446.3 266.8L446.2 270.4L445.9 271.7L444.9 272.0L443.5 271.8L442.2 271.4L442.5 269.4L441.8 270.1L440.7 272.1L439.8 272.4L437.9 272.1L434.1 273.4L433.9 274.8L433.3 276.7L432.8 277.8L432.6 278.5L431.0 281.3L427.9 285.5L425.5 286.8L424.4 287.6L423.5 287.9L422.0 287.5L421.4 288.1L421.1 288.8L421.1 290.3L421.9 291.3L422.5 294.8L422.2 296.3L422.0 297.5L421.9 298.2L421.5 301.2L421.1 302.4L420.6 303.7L415.1 305.2L415.4 304.5L415.3 303.2L415.1 302.2L415.6 301.3L414.4 301.0L413.8 301.5L413.4 302.4L413.7 304.3L413.1 305.3L412.9 305.9L412.9 307.3L412.5 307.9L412.4 308.6L413.3 308.4L412.9 309.6L411.2 312.0L410.7 313.4L410.8 318.9L410.1 322.2L410.0 323.2L409.8 327.4L408.7 329.4L407.1 328.7L405.1 329.3L404.0 331.5L403.4 332.2L402.8 333.0L402.5 335.9L402.4 340.7L401.7 341.3L401.0 341.5L398.0 345.7L399.7 346.9L400.4 347.8L401.7 350.3L403.4 353.2L403.6 354.0L307.2 354.0L306.8 352.9L304.3 349.6L301.4 347.3L301.4 346.5L300.6 346.4L298.2 344.7L296.3 342.8L292.6 339.9L290.0 339.2L286.4 336.9L284.1 336.0L285.0 335.8L286.0 335.8L291.5 338.9L290.9 338.1L290.0 337.4L289.5 337.0L287.2 334.3L285.1 332.6L282.6 329.4L279.3 328.1L277.0 326.7L275.7 326.9L274.1 327.3L273.2 327.4L272.6 327.1L272.1 326.2L272.2 325.6L272.1 324.7L270.8 323.3L269.0 321.9L267.3 320.2L263.9 315.6L263.1 314.1L263.8 313.8L264.9 313.5L265.9 313.5L267.0 313.8L266.0 312.8L264.8 311.8L261.6 307.9L260.7 306.1L260.6 304.1L260.8 301.4L260.2 299.5L257.8 296.9L256.9 295.6L255.1 294.9L254.3 294.9L253.8 295.9L253.5 298.1L251.9 300.9L251.4 302.2L250.5 303.8L249.8 303.9L248.1 301.1L246.9 299.0L246.7 298.0L246.6 296.8L245.6 292.4L246.3 291.8L247.0 291.4L247.9 290.5L248.5 289.8L246.9 287.3L246.1 287.3L245.1 288.3L242.3 287.2L241.7 287.7L241.3 288.6L240.3 289.6L239.0 290.1L237.4 291.3L235.8 292.1L234.5 292.7L233.8 292.6L235.0 291.3L232.9 292.2L232.1 293.0L231.8 294.4L231.5 296.6L232.2 297.2L233.4 300.2L234.8 301.5L234.5 302.7L234.2 303.6L233.3 304.5L232.6 303.9L231.8 305.8L232.4 311.0L233.4 314.6L234.4 316.2L236.6 318.7L239.0 320.0L243.2 324.2L245.6 325.5L246.1 326.2L247.6 329.4L248.8 333.1L250.1 338.9L251.0 341.8L252.9 345.0L256.8 349.7L260.4 353.1L261.8 354.0L228.7 354.0L227.0 352.6L225.1 348.9L223.6 347.6L221.4 346.5L220.2 347.0L219.3 346.6L219.7 346.1L220.0 344.5L217.5 340.9L216.0 339.8L215.6 339.0L215.3 338.1L215.0 337.4L214.3 337.0L212.9 336.9L212.9 335.1L213.1 333.8L213.0 332.7L212.2 329.7L210.8 327.2L210.0 321.2L209.3 319.5L207.8 318.2L204.3 316.8L199.5 313.0L198.5 312.9L195.6 311.4L193.8 311.1L191.5 312.5L188.6 316.2L186.3 320.0L185.5 320.8L182.6 322.1L179.9 322.7L177.4 324.0L176.5 324.6L173.1 328.5L171.4 329.7L171.1 330.4L170.8 331.7L169.9 332.8L169.0 333.3L167.0 333.8L164.9 335.0L164.0 334.5L161.5 334.6L160.1 333.1L157.2 332.2L156.2 330.2L154.9 330.1L154.0 330.1L153.4 329.1L153.4 328.4L152.5 328.7L151.8 328.7L151.0 329.3L150.4 329.2L149.6 329.7L148.7 329.5L146.3 328.4L144.3 327.8L143.6 327.4L143.1 326.3L142.4 325.8L140.9 326.3L140.3 327.1L139.5 328.1L133.7 332.9L132.7 334.9L131.5 337.8L131.4 339.2L131.9 343.5L133.1 345.8L133.5 347.5L134.1 347.9L134.3 348.9L133.3 349.4L132.6 351.1L133.4 352.0L133.6 354.0L1.3 354.0L1.2 352.1L2.5 350.3L3.4 349.1L2.0 349.0L2.1 348.1L2.5 347.7L3.0 346.7L2.5 346.3L2.1 345.7L2.1 344.0L2.2 343.4L2.1 342.7L0.1 343.6L0.0 341.6L0.7 340.4L0.0 339.7L0.0 331.8L1.4 330.4L3.6 330.7L5.0 330.3L6.3 329.5L7.0 329.3L8.2 328.5L8.1 327.5L7.8 326.7L8.1 326.0L9.4 325.2L10.9 324.0L12.5 323.8L14.2 322.8L15.3 323.4L16.3 323.2L17.5 324.0L18.9 325.8L21.1 326.5L22.9 325.9L26.0 325.8L27.5 326.0L30.3 325.6L31.9 325.8L34.4 324.9L36.4 326.0L40.2 326.5L42.5 327.4L48.8 328.9L51.2 329.0L54.4 328.1L55.7 327.5L57.0 327.9L58.8 327.1L59.8 327.2L60.9 328.3L65.0 329.7L66.0 328.5L66.8 328.3L69.7 329.0L72.7 330.5L74.2 330.6L76.4 330.2L78.3 329.2L80.4 328.6L82.0 326.3L83.5 318.2L84.6 308.7L85.4 306.9L86.4 306.4L85.6 305.1L85.1 305.7L84.9 306.4L85.2 298.0L85.6 294.8L86.4 291.5L87.9 292.8L89.2 294.1L89.8 295.3L90.7 299.2L91.3 300.1L92.2 300.9L91.8 300.0L91.2 299.3L90.2 294.1L89.6 292.6L88.6 291.4L85.4 288.8L85.1 288.2L85.0 287.3L86.0 287.3L86.9 287.8L86.5 286.7L86.1 284.5L85.8 279.6L85.8 278.7L85.7 277.7L84.7 277.5L83.9 277.4L83.0 277.0L78.7 274.1L77.2 271.1L75.7 268.9L75.3 267.9L75.4 266.9L76.2 264.8L75.5 263.5L74.8 263.3L74.2 262.6L74.8 261.5L75.2 260.8L76.1 260.7L77.2 260.9L78.3 261.5L79.2 261.7L76.6 260.0L72.5 260.6L71.6 260.3L70.9 260.0L70.6 258.7L71.2 258.2L71.7 257.2L71.1 256.4L70.3 256.2L69.1 256.2L68.0 256.4L68.4 254.8L67.8 254.4L67.0 254.6L65.8 254.8L64.7 254.5L63.7 253.2L63.1 253.2L61.9 252.9L61.1 252.8L59.9 252.2L55.6 250.7L53.8 250.5L52.1 251.2L51.2 250.9L50.4 250.0L49.9 248.4L47.1 247.1L47.7 246.3L49.0 246.1L50.4 245.5L51.0 244.8L49.8 243.9L49.0 243.7L48.2 242.7L48.8 242.3L50.1 242.6L51.9 242.4L51.3 241.7L50.6 241.5L48.8 241.2L48.2 241.5L46.7 241.4L46.4 240.5L46.2 239.8L46.7 238.3L48.8 236.8L53.9 235.3L56.1 235.5L57.7 235.2L59.5 234.3L60.3 233.4L62.9 232.9L65.4 233.8L67.7 237.1L68.8 238.3L71.5 236.3L75.5 236.4L76.3 237.5L76.6 236.6L77.4 235.5L78.0 236.0L78.3 236.6L82.5 236.4L83.2 236.3L82.0 235.5L81.1 233.6L80.9 226.5L79.7 224.6L78.4 221.4L77.8 219.6L77.7 218.9L77.9 218.0L79.6 218.0L80.8 218.3L83.3 217.6L84.5 218.1L84.4 219.5L84.7 221.4L85.2 222.2L85.8 223.2L87.7 223.1L89.8 223.7L92.5 223.8L96.4 224.9L98.0 224.2L99.7 223.0L102.7 222.2L101.2 221.9L99.6 221.1L99.4 220.2L99.6 219.4L100.2 217.7L104.9 214.8L108.3 214.0L111.8 212.4L113.5 210.8L114.7 208.8L115.6 207.9L115.1 207.2L115.4 199.3L115.8 197.9L116.4 196.7L117.5 195.9L119.1 194.9L124.9 193.5L125.7 193.0L130.5 190.0L133.4 188.5L134.7 188.0L135.6 187.7L137.4 187.6L138.7 188.2L140.5 188.4L142.0 187.7L143.1 188.3L144.3 187.9L143.3 187.6L141.9 186.8L139.9 187.5L138.5 186.7L137.3 186.7L136.6 186.1L135.8 185.1L136.4 184.5L139.0 184.1L140.6 184.5L143.4 186.6L144.1 186.6L144.8 186.4L144.4 185.8L143.7 185.5L142.7 184.9L141.9 184.1L143.8 183.9L143.3 182.8L141.2 180.4L141.6 179.7L142.1 178.3L142.7 177.1L144.1 176.0L145.9 173.5L147.1 171.5L148.0 169.2L149.2 162.7L149.6 161.6L150.2 160.3L151.0 160.6L151.5 160.9L153.4 160.0L156.6 157.6L157.6 155.5L158.5 154.6L162.3 152.6L164.3 152.1L167.5 151.9L169.8 151.6L172.5 151.5L173.6 152.6L174.2 153.5L175.2 154.0L176.7 154.3L176.2 153.5L175.1 152.6L175.4 150.8L175.7 149.5L176.8 147.7L177.7 147.2L181.4 147.0L185.5 147.1L187.3 149.7L186.6 151.0L187.6 151.6L188.5 150.3L188.7 149.0L190.4 149.5L190.8 150.2L190.8 152.3L191.3 149.5L191.0 147.4L191.2 145.5L191.8 144.4L192.2 143.8L195.2 144.5L198.6 144.1L199.9 144.9L202.7 148.7L203.7 149.3L204.9 149.5L203.3 148.7L199.8 144.1L198.7 143.5L197.1 143.4L196.1 142.9L195.5 142.2L195.3 141.6L195.4 137.0L194.7 136.3L193.9 136.1L192.5 136.4L192.3 135.3L192.5 134.6L194.5 134.0L195.8 133.3L195.9 132.1L195.0 131.1L194.1 129.3L192.9 127.6L192.7 124.1L192.4 123.1L191.7 121.5L192.8 121.2L192.6 118.1L192.2 116.5L189.2 114.9L186.9 113.3L187.4 107.9L187.7 106.5L186.8 103.7L186.9 100.5L187.2 95.5L188.0 95.3L190.6 96.2L191.5 96.3L192.1 97.1L192.8 97.4L193.3 96.6L193.5 95.1L195.1 93.2L196.3 92.5L197.1 92.1L197.9 92.9L198.5 93.8L198.7 91.9L199.1 88.3L197.6 87.7L196.3 88.2L195.0 90.5L193.9 93.4L192.0 93.6L190.6 94.5L189.2 93.6L188.4 92.9L188.4 91.8L188.6 91.1L190.1 88.8L192.2 86.5L194.3 86.6L195.8 85.8L196.8 85.8L199.6 85.9L201.1 85.4L202.4 84.4L205.3 80.0L206.9 78.2L210.1 77.6L213.1 75.5L213.9 75.5L212.5 77.0L212.3 77.6L212.1 78.5L213.1 80.6L212.9 81.8L213.0 84.2L212.1 85.4L211.0 88.1L210.5 88.5L210.4 91.6L210.5 92.4L210.4 95.2L211.5 96.4L212.6 97.0L216.5 97.0L216.9 97.5L217.4 98.4L217.0 99.9L216.6 101.0L215.5 101.9L214.1 102.6L213.2 102.7L211.9 101.3L211.3 101.7L210.8 102.4L209.7 106.1L209.3 108.6L208.4 108.4L207.5 108.4L206.2 109.0L206.9 109.5L207.5 110.4L206.2 111.4L205.2 112.4L204.8 113.1L203.6 114.0L202.8 115.2L203.2 116.6L203.3 117.8L203.7 119.2L203.4 120.3L201.9 121.8L201.3 123.2L202.6 123.2L203.4 123.5L203.9 123.9L204.4 124.5L204.0 125.2L204.5 127.3L206.1 127.8L206.8 128.5L207.5 129.7L207.6 131.3L206.6 132.5L205.8 133.2L208.8 133.0L209.1 133.6L209.6 134.4L211.2 133.8L215.2 136.0L217.7 134.9L218.3 134.9L218.9 136.6L218.3 138.4L216.1 140.3L216.6 141.4L217.3 141.7L219.3 141.4L222.5 142.6L223.2 142.2L225.8 139.6L226.9 139.0L230.3 138.6L230.9 137.6L232.3 136.6L233.2 135.5L235.4 133.3L237.6 133.7L238.9 134.1L240.3 134.3L241.6 136.6L244.9 139.1L247.9 138.9L249.0 141.2L249.4 144.2L250.4 145.1L251.2 145.7L253.6 146.3L256.2 147.4L257.3 148.0L257.1 147.3L257.1 145.9L257.0 144.7L254.7 144.1L252.8 143.8L251.4 144.0L250.1 143.7L249.8 142.7L250.1 141.6L249.5 141.0L249.0 140.5L249.0 139.3L251.3 141.0L253.2 142.5L255.1 142.9L258.7 141.3L265.0 139.1L271.6 137.1L273.2 136.9L274.8 136.5L275.3 135.7L275.9 135.2L276.8 133.9L278.8 131.8L282.4 131.0L283.7 130.1L286.5 128.7L292.8 127.1L295.5 126.8L298.1 126.8L300.4 128.0L302.8 129.5L303.3 130.4L302.0 129.8L300.0 128.5L299.3 128.4L301.0 132.5L301.8 134.0L303.7 135.1L305.2 135.4L309.9 134.8L311.6 133.9L312.0 133.5L313.7 132.0L314.8 130.4L315.7 128.3L315.9 126.9L316.1 125.3L317.5 124.7L320.7 124.7L322.1 124.0L323.8 122.1L325.6 119.8L326.2 118.8L327.4 116.8L327.9 115.5L328.2 113.6L328.5 113.0L328.5 113.8L328.4 115.3L327.6 117.7L325.7 120.7L322.8 124.2L323.7 124.7L324.8 124.8L326.1 125.5L327.2 125.6L329.3 125.1L329.7 122.0L329.8 119.1L329.5 117.8L329.9 115.8L329.1 113.0L327.9 109.5L327.9 105.8L327.8 105.0L327.4 101.6L327.6 94.9L328.1 91.6L330.1 89.7L331.1 88.2L331.7 86.2L331.9 84.3L332.3 82.8L335.2 78.4L337.6 77.9L340.7 76.7L344.2 75.7L344.9 77.0L345.3 78.0L349.5 81.5L350.6 82.8L352.2 86.9L356.1 89.0L359.2 88.3L360.6 87.3L363.1 85.4L364.2 84.1L364.4 82.7L364.0 77.1L363.3 74.6L363.5 73.1L363.6 72.4L365.1 68.9L365.3 66.2L365.8 65.8L365.8 64.5L364.3 64.0L363.1 65.0L362.6 65.7L361.3 66.1L360.1 65.4L357.5 64.4L356.8 63.1L356.6 61.8L355.2 60.6L354.7 59.1L354.9 58.1L356.1 57.5L356.5 56.9L354.9 57.0L354.5 56.3L353.8 54.5L354.4 53.8L354.7 53.1L354.2 52.5L354.3 51.9L354.7 51.2L354.5 49.7L356.1 48.8L357.6 48.2L360.9 47.9L360.6 46.5L361.9 46.5L364.2 44.7L366.4 45.0L369.6 43.9L375.7 43.9L376.6 43.2L376.5 42.5L376.5 41.8L377.6 42.0L379.6 41.9L386.9 43.3L388.6 43.3L391.1 44.7L392.4 45.1L396.4 45.1L402.5 45.8L403.7 44.8L404.3 43.3L404.1 41.6L403.8 40.3L404.3 39.3L405.1 39.2L405.9 40.3L407.3 40.8L408.3 40.1L408.6 38.7L409.3 38.1L410.2 38.6L411.8 38.8L413.1 38.7L414.0 38.4L414.4 38.0L414.7 37.1L415.4 36.1L416.2 35.4L421.9 36.2L426.8 37.6L427.2 37.1L427.3 36.2L426.1 35.4L425.2 34.9L424.1 33.3L422.4 32.0L420.8 31.8L418.6 32.3L415.3 32.0L412.5 29.5L410.7 28.8L409.3 26.9L409.0 25.8L410.4 26.7L410.6 25.8L410.7 24.6L410.0 23.8L409.2 23.4L405.6 25.3L401.4 25.9L400.0 26.6L398.4 26.7L397.8 27.2L395.4 25.9L393.5 26.1L392.2 27.1L389.7 27.3L388.4 27.7L387.6 28.1L387.5 27.1L387.8 25.7L388.4 24.9L388.0 24.3L387.2 25.6L386.8 27.1L386.0 27.9L384.1 28.2L382.2 27.0L381.3 27.0L381.9 27.9L382.3 28.8L381.2 29.2L380.1 29.8L379.2 30.7L378.1 29.5L376.9 30.0L375.9 30.8L373.8 31.0L372.6 32.0L370.4 32.6L369.3 32.6L366.6 33.4L365.7 34.6L364.9 35.0L363.7 34.7L360.3 35.2L357.0 36.0L355.6 36.0L354.1 35.6L352.7 36.7L351.1 38.2L349.3 38.7L348.7 38.5L349.2 37.7L350.3 37.0L351.2 35.9L351.2 35.0L350.7 34.7L350.0 34.6L349.0 33.6L348.1 31.7L347.4 32.1L347.1 33.6L346.4 34.4L345.8 34.7L343.2 34.9L343.0 34.1L343.3 32.8L343.3 31.8L344.3 31.8L344.6 30.9L343.8 30.8L344.5 29.0L343.9 28.7L341.0 28.3L337.5 26.5L336.6 26.5L336.0 24.9L335.2 25.1L334.0 26.0L333.0 25.3L332.0 24.9L331.8 24.1L331.8 23.1L331.7 21.8L331.4 20.4L331.2 18.3L331.4 16.6L332.2 15.5L332.5 14.7L332.9 12.7L333.0 10.4L332.7 9.6L333.4 9.1L333.0 8.4L332.7 7.9L333.7 7.6L333.3 5.9L333.2 5.2L332.4 3.3L331.5 1.5L330.1 0.2L288.4 0.0L288.1 0.6L287.7 2.4L288.0 3.9L288.2 4.6L288.7 5.6L287.3 5.5L285.8 4.9L286.0 6.1L285.1 7.5L285.2 8.8L285.4 9.6L285.1 10.9L285.6 11.4L285.8 12.2L285.4 12.8L285.7 15.1L286.0 17.9L285.8 18.6L286.7 21.0L286.5 21.9L286.4 23.0L287.6 24.1L288.6 24.1L289.7 24.0L290.5 25.0L290.8 25.9L291.7 25.9L293.2 25.1L294.1 24.9L294.7 26.4L296.3 28.2L297.3 29.0L298.9 29.4L300.6 30.9L300.4 32.7L301.1 33.3L303.1 34.0L303.8 34.9L304.2 35.8L304.7 36.4L305.4 38.4L305.1 39.7L304.3 40.1L302.4 41.5L301.5 42.5L300.9 43.1L298.9 44.4L298.2 44.7L297.6 45.3L296.9 45.7L296.3 45.5L294.2 46.7L296.0 47.5L296.8 47.2L297.5 46.6L298.2 46.5L298.8 46.6L299.6 46.1L300.7 46.1L301.3 47.3L300.0 47.9L299.1 48.0L298.6 49.9L298.1 50.8L295.6 52.0L294.3 53.1L292.7 53.9L292.0 53.7L291.0 54.6L288.6 55.6L287.4 57.0L284.7 58.2L283.4 59.2L279.7 59.3L276.2 59.1L275.0 59.5L276.2 59.7L277.0 60.2L278.0 59.9L280.2 60.2L281.3 60.4L282.8 62.1L281.7 62.7L279.8 63.1L280.5 65.4L281.1 67.0L280.4 68.0L280.3 72.3L279.3 72.3L278.8 74.1L279.1 75.0L279.1 77.2L279.3 78.4L279.8 79.6L279.6 80.9L277.9 83.8L278.0 85.2L278.3 86.0L278.5 87.3L277.7 89.8L277.2 91.9L276.5 93.7L275.1 95.8L274.4 97.3L272.7 102.3L271.9 103.2L270.8 104.0L269.7 103.3L268.6 102.9L267.4 103.0L265.4 103.5L262.4 103.1L259.5 103.3L258.7 103.8L259.1 105.6L258.0 105.9L257.0 105.3L256.1 105.9L255.3 106.6L253.8 108.2L253.3 109.2L253.1 111.0L253.9 112.6L254.6 114.5L252.8 116.9L251.8 116.9L248.8 116.3L243.5 117.8L238.8 116.6L239.3 115.4L239.3 114.5L239.6 113.1L239.7 111.6L239.7 110.6L239.3 109.6L238.2 108.3L235.5 103.8L234.8 101.9L234.2 101.1L236.8 102.0L237.8 101.5L237.2 100.1L236.6 99.4L236.2 98.4L237.5 98.1L238.4 98.2L239.1 97.1L238.7 95.3L237.7 94.7L236.9 94.5L235.3 91.6L233.7 90.1L230.7 84.5L229.7 80.6L228.7 81.0L228.2 79.3L227.8 77.6L227.8 76.5L226.2 75.8L226.2 75.0L225.8 71.3L224.2 70.8L223.1 68.7L222.9 64.8L221.8 64.1L220.9 64.3L220.9 63.3L221.1 62.4L220.6 58.8L220.5 55.5L220.0 54.5L219.8 53.3L220.0 52.3L220.3 51.7L221.4 51.6L222.4 52.4L222.2 51.2L219.6 50.6L218.2 50.2L217.6 50.1L216.4 49.8L215.4 47.9L214.3 46.2L214.2 45.5L214.2 42.4L213.9 41.1L213.8 39.6L213.1 40.8L213.5 42.7L212.6 43.5L211.6 43.9L211.7 45.0L212.3 46.4L212.0 48.1L209.9 52.0L209.2 52.9L208.2 52.6L206.8 53.7L205.6 53.8L205.1 52.6L203.3 51.0L202.4 51.1L203.2 51.9L204.0 52.9L203.5 53.6L203.1 54.0L202.4 54.3L199.8 55.6L200.7 56.5L199.9 57.6L199.0 57.7L198.5 58.2L198.3 58.8L195.6 60.7L191.2 65.5L188.8 66.8L187.3 68.2L185.9 68.2L184.1 69.4L179.6 70.4L176.7 70.0L174.6 70.4L173.5 69.6L173.3 69.0L173.6 68.3L172.4 68.1L172.0 69.3L170.1 69.1L169.7 68.6L170.2 67.7L171.2 66.8L170.8 66.2L169.0 66.2L167.9 66.1L164.2 64.2L163.4 63.1L160.4 61.5L159.1 59.8L158.4 57.9L158.4 56.2L158.8 53.6L159.4 52.9L162.1 53.8L164.7 55.4L166.0 54.1L167.6 53.1L164.7 54.0L163.8 53.3L162.4 52.0L162.4 51.4L163.1 50.7L163.3 49.8L163.0 48.9L163.1 47.8L164.2 46.6L165.8 45.3L167.0 44.2L168.2 43.4L166.7 43.6L165.4 44.4L163.8 45.8L161.9 46.9L160.6 47.3L159.9 47.6L158.9 48.0L157.8 49.5L156.7 50.1L154.6 50.2L154.2 49.1L154.8 45.1L155.4 43.1L156.1 41.7L157.1 41.5L157.9 40.5L158.5 40.5L159.0 41.0L161.2 41.4L162.2 40.1L163.6 39.9L166.0 38.6L164.3 38.7L163.3 38.7L161.8 39.0L161.0 38.8L160.7 37.8L161.3 36.9L163.6 34.8L164.4 33.9L164.8 33.1L165.2 31.3L167.4 29.2L169.3 28.2L169.9 29.0L169.4 31.6L169.4 32.7L170.9 28.9L171.5 28.0L172.2 27.4L174.0 26.9L174.5 26.3L172.4 26.5L167.4 28.0L165.3 29.3L164.7 30.3L163.3 31.8L162.6 32.7L162.3 34.2L161.5 34.9L160.3 35.2L158.8 37.0L158.1 38.5L156.6 39.6L155.6 40.5L154.8 41.7L153.9 41.3L153.9 40.2L154.0 38.3L154.8 37.1L155.1 35.8L154.6 34.6L155.0 33.9L155.6 33.9L156.8 34.2L158.1 34.2L160.3 33.2L159.9 32.7L159.0 32.6L157.3 32.7L155.9 31.8L154.7 30.0L154.2 27.5L154.6 26.8L158.7 24.3L159.8 23.2L159.2 23.1L157.6 24.5L155.4 25.3L154.0 24.1L153.3 22.9L152.8 20.2L153.0 18.8L152.8 17.0L153.8 16.4L154.8 16.7L155.9 16.9L158.3 16.7L163.5 15.6L166.8 16.3L168.2 16.2L170.3 15.3L172.1 15.2L173.5 15.9L174.2 16.7L174.4 17.8L175.0 18.5L175.1 17.4L175.0 16.1L180.5 14.6L181.1 14.0L178.9 13.8L178.3 12.4L179.5 10.3L178.2 11.1L177.6 12.7L177.8 13.9L177.6 14.5L176.4 14.8L173.9 14.9L172.3 14.3L170.8 14.0L170.3 13.6L170.5 12.7L169.6 13.4L169.0 15.0L167.8 15.3L164.5 14.7L159.8 15.1L157.7 15.9L156.3 15.8L153.9 14.4L152.9 13.3L152.6 11.0L152.8 10.0L154.6 9.6L155.5 9.6L156.4 9.1L155.7 8.8L154.6 8.1L153.8 6.7L152.7 6.3L151.9 5.1L151.7 3.4L152.0 2.1L152.6 1.7L154.0 2.0L157.8 1.8L161.4 3.1L163.8 3.8L168.7 3.4L171.6 2.3L168.0 2.6L165.1 2.6L160.0 1.4L157.9 0.9L155.7 1.1L154.5 0.8L154.0 0.0ZM285.8 334.1L285.0 334.2L280.2 334.1L278.7 333.8L277.2 332.8L278.4 332.2L279.9 332.5L280.4 333.2L284.3 333.8L285.8 334.1ZM447.4 279.6L448.9 280.5L447.4 280.2L444.0 279.4L442.5 278.6L442.1 277.8L441.9 276.6L442.7 277.8L443.3 278.4L447.4 279.6ZM348.3 56.2L347.4 57.0L346.8 56.7L345.4 58.3L344.1 58.6L343.3 58.2L343.4 57.5L342.7 55.5L341.5 54.9L340.0 54.9L338.8 54.1L343.2 53.6L343.7 52.6L344.6 51.6L345.3 51.6L345.9 51.8L345.9 52.5L348.1 53.2L348.9 54.5L349.2 56.0L348.3 56.2ZM50.1 138.3L47.9 140.6L47.0 140.2L46.2 140.4L46.4 139.5L46.9 137.6L47.9 136.9L49.0 134.9L49.9 134.4L50.4 134.6L50.9 136.8L50.2 137.6L50.1 138.3ZM42.5 116.0L41.1 116.0L40.0 115.4L39.4 112.9L39.6 112.1L40.2 111.4L40.9 111.2L41.6 111.7L42.5 113.7L42.6 115.2L42.5 116.0ZM35.2 100.1L30.8 101.1L29.3 101.0L29.5 100.2L30.7 99.9L31.2 97.5L29.4 96.4L29.4 95.6L30.7 94.8L31.6 94.8L32.4 95.4L33.3 96.7L34.5 96.9L35.3 97.5L35.2 100.1ZM31.3 107.4L31.7 109.7L32.1 111.1L31.8 112.3L30.0 113.2L29.4 112.9L29.8 112.0L29.4 111.0L29.6 110.2L27.8 111.4L27.6 110.3L27.7 109.6L28.2 108.8L29.0 108.4L30.4 107.9L31.3 107.4ZM33.0 109.5L32.3 109.6L31.9 108.9L31.9 108.1L32.3 107.5L33.7 106.6L33.0 106.3L33.4 105.4L34.9 104.3L35.7 104.1L34.9 106.1L33.0 109.5ZM83.9 25.9L84.1 27.1L84.7 26.8L85.6 28.0L86.7 27.5L86.5 28.6L85.8 31.7L85.5 33.2L85.1 35.3L84.6 35.9L84.2 37.4L83.4 37.0L84.0 34.7L84.3 33.4L84.1 32.7L83.7 32.1L82.8 32.0L82.0 32.3L81.8 31.5L80.6 31.3L80.1 30.8L81.0 30.1L81.9 30.2L83.2 29.5L82.4 27.1L81.3 26.9L81.2 26.2L81.8 26.0L82.8 24.8L84.0 24.6L83.9 25.9ZM52.4 153.6L54.0 153.9L53.6 154.6L52.4 155.4L51.5 156.2L50.5 156.9L50.0 156.2L48.5 154.7L48.4 152.5L49.5 151.9L51.1 151.9L52.4 153.6ZM64.8 52.6L65.5 53.0L66.7 53.4L67.5 53.4L68.0 53.9L67.7 54.8L66.9 55.0L65.5 54.2L63.6 54.5L63.0 54.2L62.9 53.3L62.1 53.7L61.6 52.8L61.7 52.0L62.1 50.8L62.7 50.5L63.8 50.7L64.9 51.3L65.3 52.1L64.8 52.6ZM30.6 64.4L29.2 67.4L28.1 68.3L26.7 69.2L28.0 69.2L28.3 70.1L26.4 71.8L25.3 72.4L24.1 73.9L23.4 73.9L22.8 74.8L22.3 75.2L21.7 75.0L20.9 74.1L22.3 73.2L23.4 72.1L21.8 71.3L21.2 70.7L22.0 69.9L21.4 69.5L20.8 69.1L20.8 68.4L20.9 67.6L21.5 66.9L22.4 67.0L23.1 67.6L23.9 67.3L24.8 67.4L24.1 65.8L24.6 65.1L26.8 64.0L29.5 62.2L30.1 61.9L30.6 63.1L30.6 64.4ZM31.2 79.5L31.1 80.3L30.9 81.3L31.2 82.3L31.2 82.9L32.0 83.5L34.0 83.9L36.0 83.7L36.3 84.5L35.0 85.9L33.7 87.4L32.9 87.7L32.3 84.9L31.0 85.3L29.8 85.2L29.2 84.9L28.8 84.3L27.9 82.7L25.3 82.1L24.6 81.2L24.4 80.7L25.0 79.7L25.7 79.9L26.4 79.5L26.0 78.7L28.6 77.8L28.8 76.7L30.0 77.0L30.9 78.1L31.2 79.5ZM19.6 76.4L20.8 77.4L19.8 79.1L18.3 79.1L16.2 77.9L16.4 77.2L17.0 76.9L18.3 76.8L18.9 76.9L19.6 76.4ZM316.2 29.2L317.3 29.2L318.2 29.8L319.0 30.4L318.5 32.0L317.7 31.9L317.1 32.0L316.7 32.7L316.7 33.7L314.2 33.9L313.6 33.6L312.8 31.3L312.9 30.7L313.5 30.4L314.0 31.6L314.7 31.5L314.9 30.7L314.9 30.0L314.3 29.5L314.4 28.5L315.1 28.2L315.8 29.1ZM278.5 101.1L277.9 101.9L277.1 100.7L277.0 97.6L277.2 96.1L279.6 90.7L280.7 90.2L282.2 86.9L282.5 85.4L283.2 84.1L283.6 82.9L284.6 82.6L284.2 83.5L284.3 84.4L282.4 88.8L281.9 91.3L281.2 92.0L278.5 101.1ZM262.8 123.5L260.6 123.3L258.4 122.1L258.7 119.7L259.3 118.6L263.3 121.3L263.3 122.4L262.8 123.5ZM247.8 134.8L248.0 136.0L247.7 136.6L246.5 135.6L245.2 135.6L244.5 137.2L242.1 135.8L241.8 135.1L242.0 132.6L241.9 132.0L242.5 131.3L242.6 130.3L243.7 129.3L244.6 129.2L244.9 130.1L245.4 130.7L246.9 131.4L247.3 132.1L246.6 133.0L246.6 134.1L247.8 134.8ZM235.1 124.5L233.0 124.6L231.1 125.8L230.4 125.4L230.7 124.6L231.5 124.0L231.9 123.5L232.1 122.8L233.7 123.3L234.2 123.6L235.1 124.5ZM222.1 125.8L224.1 126.9L225.4 126.9L226.2 127.3L226.5 128.0L226.5 129.6L225.6 130.0L224.6 129.9L223.2 130.5L218.6 127.9L218.7 125.8L218.8 125.0L221.0 124.7L222.1 125.8ZM215.3 128.3L214.1 127.0L214.8 125.6L215.3 124.6L216.6 123.0L217.4 121.1L217.3 122.8L215.6 127.5L215.3 128.3ZM188.8 127.7L188.7 125.5L189.9 122.9L189.9 123.6L189.5 125.1L192.3 125.8L189.2 126.6L188.8 127.7ZM86.6 200.2L85.6 200.8L85.4 201.5L84.5 202.0L81.7 200.6L81.6 199.9L83.1 199.4L83.9 198.7L85.7 199.4L86.6 200.2ZM259.7 301.3L258.4 301.7L257.8 301.0L256.5 300.3L255.8 299.5L256.6 298.3L257.1 296.9L257.8 297.7L258.6 299.3L259.0 299.7L259.7 301.3ZM263.9 312.6L262.9 312.2L262.2 311.6L261.8 310.9L260.9 310.0L260.6 309.0L259.2 306.8L259.0 306.3L259.7 307.1L260.2 307.7L261.9 309.1L263.1 310.9L264.4 312.4L263.9 312.6ZM263.9 320.0L263.3 320.2L260.6 316.4L260.4 315.6L261.3 316.5L263.9 320.0ZM256.2 306.9L256.2 307.6L255.5 306.7L255.1 305.2L254.3 302.7L254.2 302.0L254.6 301.2L254.6 300.5L254.0 298.3L254.8 297.9L254.9 299.5L255.2 300.4L256.0 301.4L255.8 303.2L256.0 305.8L256.2 306.9ZM340.1 28.8L341.5 29.2L342.0 29.1L342.7 30.0L341.6 30.6L341.5 31.4L342.0 31.8L342.1 32.5L341.0 32.5L340.5 31.9L340.2 31.2L339.7 30.7L339.0 30.3L339.4 29.8L339.6 29.1Z";

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

// ---------- strain: a command that is short of something finds contested orders harder ----------
//
// Below -2, each point a meter is short moves STRAIN.perPoint of weight on a contested roll from its best outcome to its worst, to
// at most STRAIN.max points, and never below STRAIN.floor on the best outcome. The meter is the one the order is about. It applies
// only to rolls (a settled outcome is narrated, never rolled), it is worked out from the meters at the moment of the order, and the
// same function feeds the screen and the roll, so the player is shown what is rolled.

export const STRAIN = { from: -2, perPoint: 3, max: 15, floor: 5 };

const sumImpact = (impact) => METER_AXES.reduce((s, a) => s + ((impact && impact[a]) || 0), 0);

/** The meter a contested order is about: the one its outcomes move most, in total. */
export function strainMeterOf(choice) {
  const branches = choice.uncertain && choice.uncertain.length ? choice.uncertain.map((b) => b.impact || choice.impact) : [choice.impact];
  let best = METER_AXES[0];
  let bestTotal = -1;
  for (const axis of METER_AXES) {
    const total = branches.reduce((s, imp) => s + Math.abs((imp && imp[axis]) || 0), 0);
    if (total > bestTotal) {
      bestTotal = total;
      best = axis;
    }
  }
  return best;
}

/** { uncertain, points, meter }: the order's contested outcomes after strain (the same array when there is none). */
export function strainedUncertain(choice, meters) {
  const u = choice.uncertain;
  if (!u || u.length < 2) return { uncertain: u, points: 0, meter: null };
  const meter = strainMeterOf(choice);
  const lack = Math.max(0, STRAIN.from - (meters ? meters[meter] : 0));
  if (!lack) return { uncertain: u, points: 0, meter };
  const sums = u.map((b) => sumImpact(b.impact || choice.impact));
  const best = sums.indexOf(Math.max(...sums));
  const worst = sums.indexOf(Math.min(...sums));
  if (best === worst || sums[best] === sums[worst]) return { uncertain: u, points: 0, meter };
  const moved = Math.min(STRAIN.max, lack * STRAIN.perPoint, u[best].weight - STRAIN.floor);
  if (moved <= 0) return { uncertain: u, points: 0, meter };
  return {
    uncertain: u.map((b, i) => (i === best ? { ...b, weight: b.weight - moved } : i === worst ? { ...b, weight: b.weight + moved } : b)),
    points: moved,
    meter,
  };
}

/** For the easy modes: what an order does to each meter, as { axis: [lowest, highest] } over its outcomes. Axes it leaves alone are left out. */
export function previewImpact(choice) {
  const branches = choice.uncertain && choice.uncertain.length ? choice.uncertain.map((b) => b.impact || choice.impact) : [choice.impact];
  const out = {};
  for (const axis of METER_AXES) {
    const values = branches.map((imp) => (imp && imp[axis]) || 0);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    if (lo !== 0 || hi !== 0) out[axis] = [lo, hi];
  }
  return out;
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
    branch = rollUncertain(strainedUncertain(choice, meters).uncertain, rng);
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
export function snapshotRun({ campaignId, nodeId, flags, meters, hardState, visited, pendingNextId = null, pendingOutcome = null, pendingRecord = null, easy = false, taken = [], history = [] }) {
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
    // Added in 1.3.0, all optional: a save made before them has none and resumes as a standard (or hard) run with no rewind history.
    easy: Boolean(easy),
    taken: Array.isArray(taken) ? taken : [],
    history: Array.isArray(history) ? history.slice(-REWIND_LIMIT) : [],
    savedAt: Date.now(),
  };
}

/** How many orders the easy mode can take back. */
export const REWIND_LIMIT = 40;

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
  return { schemaVersion: RECORD_SCHEMA_VERSION, nodes: {}, advisers: {}, endings: [], runs: 0, hardRuns: 0, xc: {} };
}

export function loadRecord() {
  const raw = readJson(RECORD_KEY);
  if (!raw || raw.schemaVersion !== RECORD_SCHEMA_VERSION) return emptyRecord();
  const merged = { ...emptyRecord(), ...raw };
  if (!merged.xc || typeof merged.xc !== "object" || Array.isArray(merged.xc)) merged.xc = {};
  return merged;
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

// ---------- echoes between commands ----------
//
// A choice in one command can leave a mark that another command reads. The marks are flags starting "xc_". They are
// remembered in the war record and handed to the next run as its starting flags. Every reader paragraph is written
// for the NON-historical value only, so a player who never departs from the record never sees an echo, and a fresh
// record plays exactly as before.

export const ECHOES = {
  xc_command1918: {
    label: "Allied command, spring 1918",
    historical: "unified",
    values: { unified: "Unified under Foch at Doullens, as it was.", national: "Left national: the Allied armies kept their separate commands." },
    setBy: "French GQG, British Empire", readBy: "German OHL (May and August 1918)",
  },
  xc_usw: {
    label: "Submarine warfare, 1917",
    historical: "unrestricted",
    values: { unrestricted: "Unrestricted from 1 February 1917, as it was.", restricted: "Held under prize rules: the United States stays out." },
    setBy: "German OHL", readBy: "British Empire (convoy, 1918 manpower), French GQG (May 1917)",
  },
  xc_marne_french: {
    label: "The French counterattack on the Marne",
    historical: "attacked",
    values: { attacked: "The flank was attacked, as it was.", delayed: "The withdrawal went on without a counterattack." },
    setBy: "French GQG", readBy: "German OHL (September 1914)",
  },
  xc_calais: {
    label: "The British under Nivelle, February 1917",
    historical: "accepted",
    values: { accepted: "Accepted under protest, as it was.", refused: "Refused: the British would not serve under a French general." },
    setBy: "British Empire", readBy: "French GQG (February 1917)",
  },
  xc_gorlice: {
    label: "The German plan for 1915 in the east",
    historical: "mackensen",
    values: { mackensen: "A breakthrough at Gorlice under Mackensen, as it was.", envelop: "A wide envelopment out of East Prussia and Courland." },
    setBy: "German OHL", readBy: "Austro-Hungarian AOK (April 1915)",
  },
  xc_caporetto: {
    label: "German help for Austria-Hungary, autumn 1917",
    historical: "sent",
    values: { sent: "German divisions sent to the Isonzo, as they were.", refused: "Guns and staff officers only." },
    setBy: "German OHL", readBy: "Austro-Hungarian AOK (September 1917)",
  },
  xc_chantilly: {
    label: "Russia at Chantilly, December 1915",
    historical: "committed",
    values: { committed: "Russia accepted the plan for simultaneous offensives, as it did.", declined: "Russia declined to commit to a date until the army was re-equipped." },
    setBy: "Russian Stavka", readBy: "French GQG (the Somme, July 1916)",
  },
  xc_naroch: {
    label: "Lake Naroch, March 1916",
    historical: "launched",
    values: { launched: "A Russian offensive at Lake Naroch for the French, as it was.", refused: "The French were told to wait for the summer." },
    setBy: "Russian Stavka", readBy: "French GQG (Verdun, February 1916)",
  },
  xc_petrograd: {
    label: "The Allied missions in Petrograd, January 1917",
    historical: "postponed",
    values: { postponed: "The great offensives were put off, as they were.", promised: "A Russian offensive was promised for the spring, on the Allies' date." },
    setBy: "Russian Stavka", readBy: "French GQG (the Chemin des Dames, April 1917)",
  },
  xc_pless: {
    label: "The convention at Pless, September 1915",
    historical: "mackensen",
    values: { mackensen: "The Austro-Hungarian Third Army under Mackensen, as it was.", own: "The Third Army kept its own commander and AOK's orders." },
    setBy: "Austro-Hungarian AOK", readBy: "German OHL (the attack on Serbia, September 1915)",
  },
  xc_kolubara: {
    label: "Serbia, October 1914",
    historical: "invaded",
    values: { invaded: "A third invasion of Serbia, as it was.", declined: "The Balkan divisions were held for Galicia." },
    setBy: "Austro-Hungarian AOK", readBy: "Russian Stavka (Przemysl, October 1914)",
  },
  xc_ukraine: {
    label: "Grain from Ukraine, February 1918",
    historical: "occupied",
    values: { occupied: "Austro-Hungarian divisions went into Ukraine, as they did.", kept: "The divisions stayed on the Italian front." },
    setBy: "Austro-Hungarian AOK", readBy: "German OHL (the end of the armistice, February 1918)",
  },
};

/** Remember every xc_ flag a run has set. Returns the same record if nothing changed. */
export function noteEchoes(record, flags) {
  const xc = { ...(record.xc || {}) };
  let changed = false;
  for (const [k, v] of Object.entries(flags || {})) {
    if (k.startsWith("xc_") && xc[k] !== v) { xc[k] = v; changed = true; }
  }
  return changed ? { ...record, xc } : record;
}

/** The starting flags of a new run: the echoes already in the record. */
export function echoSeed(record) {
  return { ...(record.xc || {}) };
}

// ---------- settings ----------

export const TEXT_SIZES = ["s", "m", "l"];

export function defaultSettings() {
  return { schemaVersion: 1, textSize: "s", sound: false };
}

export function sanitizeSettings(raw) {
  const base = defaultSettings();
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== 1) return base;
  return { ...base, textSize: TEXT_SIZES.includes(raw.textSize) ? raw.textSize : base.textSize, sound: raw.sound === true };
}

export function loadSettings() {
  return sanitizeSettings(readJson(SETTINGS_KEY));
}

export function saveSettings(settings) {
  return writeJson(SETTINGS_KEY, settings);
}


// =============================================================================
// EASY MODE NAMES AND THE COMMAND RANK
// =============================================================================
//
// The easy mode is named for a famous machine of each army, as the other games' easy modes are. The rank is a score out of
// 100 in five parts, shown on the end screen with its parts, so a player can see what it was made of. It is a judgment
// about how the command fared, not a historical claim: the tier given to each ending below is the game's own reading of how
// that ending left the army and the state, and it is checked (check-rank.js) so that every ending has one.
// =============================================================================

/** The easy mode of each command, by the gun, aeroplane or vehicle the army was known for. */
export const EASY_NAMES = {
  ohl: "Big Bertha",
  gqg: "Soixante-Quinze",
  stavka: "Ilya Muromets",
  bef: "Mother",
  aok: "Skoda",
  otto: "Yildirim",
};

/**
 * How each ending left the command: 0 ruin, 1 poor, 2 as the record left it (or an acceptable counterfactual), 3 better than the
 * record. A game judgment, not a claim about history.
 */
export const ENDING_TIER = {
  ohl_end_armistice: 2,
  ohl_end_homefirst: 1,
  ohl_end_armyfirst: 1,
  ohl_end_holdout: 1,
  ohl_end_negotiated: 3,
  ohl_end_worseterms: 1,
  ohl_end_intact: 3,
  ohl_end_dictated: 2,
  ohl_end_relieved: 0,
  gqg_end_victory: 2,
  gqg_end_armybreaks: 0,
  gqg_end_coalitionfails: 1,
  gqg_end_costlier: 1,
  gqg_end_intact: 3,
  gqg_end_defensive: 2,
  gqg_end_negotiated: 3,
  gqg_end_paris: 0,
  gqg_end_relieved: 0,
  stavka_end_brest: 2,
  stavka_end_disintegration: 1,
  stavka_end_dissolved: 0,
  stavka_end_civilwar: 0,
  stavka_end_holds: 3,
  stavka_end_separate: 1,
  stavka_end_steadied: 3,
  stavka_end_alliance: 2,
  stavka_end_relieved: 0,
  bef_end_victory: 2,
  bef_end_ports: 0,
  bef_end_haigsacked: 2,
  bef_end_shipping: 1,
  bef_end_easterners: 2,
  bef_end_bitehold: 2,
  bef_end_reserve: 3,
  bef_end_volunteers: 1,
  bef_end_relieved: 0,
  aok_end_dissolution: 2,
  aok_end_separate: 1,
  aok_end_satellite: 1,
  aok_end_galiciafirst: 2,
  aok_end_piave: 2,
  aok_end_relieved: 0,
};

/** Rank titles by the score they start at. The easy mode cannot rise past EASY_RANK_CAP (an index into RANKS). */
export const RANKS = [
  { min: 0, title: "Staff Captain" },
  { min: 35, title: "Major" },
  { min: 50, title: "Colonel" },
  { min: 65, title: "General" },
  { min: 80, title: "Field Marshal" },
];
export const EASY_RANK_CAP = 3;

/** "easy", "hard" or "standard": the mode a run was played in. */
export function modeOf(hardState, easy) {
  return hardState && hardState.enabled ? "hard" : easy ? "easy" : "standard";
}

/** The orders a run gave that the command's own hard-mode track counts against it (the same tag the erosion track uses). */
export function costlyOrders(campaignId, taken) {
  const c = CAMPAIGNS[campaignId];
  if (!c || !Array.isArray(taken)) return 0;
  let n = 0;
  for (const t of taken) {
    const node = c.nodes[t && t.node];
    const choice = node && (node.choices || []).find((ch) => ch.id === t.choice);
    if (choice && erosionFromChoice(campaignId, choice)) n += 1;
  }
  return n;
}

/**
 * The command rank for a closed file. `taken` is the list of { node, choice } the run gave. Returns { score, rank, parts }, where each
 * part is { id, label, points, max, note }.
 */
export function rankFor({ campaignId, endingId, meters, hardState, easy, taken }) {
  const m = meters || emptyMeters();
  const mode = modeOf(hardState, easy);
  const sum = METER_AXES.reduce((s, a) => s + m[a], 0);
  const standing = Math.max(0, Math.min(30, Math.round((sum + 30) / 2)));
  const tier = ENDING_TIER[endingId] ?? 1;
  const dry = METER_AXES.filter((a) => m[a] <= -5).length;
  const reserves = Math.max(0, 15 - 5 * dry);
  const costly = costlyOrders(campaignId, taken);
  const restraint = Math.max(0, 10 - 2 * costly);
  const modePoints = { easy: 5, standard: 10, hard: 15 }[mode];
  const parts = [
    { id: "standing", label: "Standing at the close", points: standing, max: 30, note: `the three meters together stood at ${sum > 0 ? "+" : ""}${sum}` },
    { id: "ending", label: "The ending", points: tier * 10, max: 30, note: ["a ruin", "a poor ending", "an ending near the record", "better than the record"][tier] },
    { id: "reserves", label: "Nothing run dry", points: reserves, max: 15, note: dry ? `${dry} meter${dry === 1 ? "" : "s"} ended at -5 or worse` : "no meter ended at -5 or worse" },
    { id: "restraint", label: "Restraint", points: restraint, max: 10, note: costly ? `${costly} order${costly === 1 ? "" : "s"} that cost the command standing` : "no order that cost the command standing" },
    { id: "mode", label: "The mode", points: modePoints, max: 15, note: { easy: "easy mode", standard: "standard mode", hard: "hard mode" }[mode] },
  ];
  const score = parts.reduce((s, p) => s + p.points, 0);
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (score >= r.min) idx = i;
  });
  if (mode === "easy") idx = Math.min(idx, EASY_RANK_CAP);
  return { score, rank: RANKS[idx].title, parts, mode };
}

// =============================================================================
// GLOSSARY
// =============================================================================
//
// Words and places a reader may not know, defined once. On each screen the first mention of a term in the story text is
// underlined; pressing it shows the definition. People are not here: they have dossiers. Each definition is meant to be
// plain fact and kept short; check-glossary.js checks that every term is used in the game and that none is defined twice.
// `match` is a regular expression (default: the term itself), `ci` makes it case-insensitive.
// =============================================================================

export const GLOSSARY = [
  { id: "general-staff", term: "General Staff", def: "The permanent body of officers that plans and directs an army. Each great power ran its war through its general staff and the officer who headed it." },
  { id: "supreme-commander", term: "Supreme Commander", def: "The Russian title for the officer who commanded all the armies. Grand Duke Nikolai Nikolaevich held it until September 1915, when Tsar Nicholas II took it himself." },
  { id: "corps", term: "corps", ci: true, def: "A formation of two or more divisions under a general: the level between a division and an army." },
  { id: "army-group", term: "army group", ci: true, def: "A command over several armies at once, one level above an army." },
  { id: "salient", term: "salient", ci: true, def: "A bulge in a front line that pushes into enemy ground, so that it can be fired on from more than one side." },
  { id: "barrage", term: "barrage", ci: true, def: "A heavy, sustained artillery bombardment. A creeping barrage moves forward ahead of the infantry at a set pace." },
  { id: "tank", term: "tank", ci: true, match: "tanks?", def: "An armoured, tracked vehicle carrying guns. The British first used tanks in action on 15 September 1916, on the Somme." },
  { id: "convoy", term: "convoy", ci: true, match: "convoys?", def: "Merchant ships sailing together under naval escort. The Royal Navy adopted the system in 1917 against submarine attack." },
  { id: "blockade", term: "blockade", ci: true, def: "Using warships to stop a country's trade by sea. The Royal Navy's blockade restricted Germany's imports throughout the war." },
  { id: "conscription", term: "conscription", ci: true, def: "Compulsory military service. Britain relied on volunteers until the Military Service Act of January 1916." },
  { id: "shell-shortage", term: "shell shortage", ci: true, def: "In May 1915 the British commander blamed a lack of high-explosive shells for a failed attack, and the press took up the charge. It helped bring in a coalition government and a Ministry of Munitions." },
  { id: "unrestricted", term: "unrestricted submarine warfare", ci: true, def: "Sinking merchant ships without warning, neutrals' included. Germany adopted it on 1 February 1917, and the United States declared war in April." },
  { id: "hindenburg-programme", term: "Hindenburg Programme", def: "The German plan of August 1916 to raise munitions and weapons output sharply, named for the new head of the army, Field Marshal Hindenburg." },
  { id: "war-cabinet", term: "War Cabinet", def: "The body of ministers that directed the British war. In December 1916 Lloyd George replaced the large Cabinet with a War Cabinet of five." },
  { id: "admiralty", term: "Admiralty", def: "The British government department that ran the Royal Navy, under a minister, the First Lord, and an admiral, the First Sea Lord." },
  { id: "reichstag", term: "Reichstag", def: "The German national parliament. It voted the money for the war, but the army answered to the Kaiser, not to it." },
  { id: "kaiser", term: "Kaiser", def: "The German word for emperor. The German Kaiser in this war was Wilhelm II." },
  { id: "provisional-government", term: "Provisional Government", def: "The Russian government formed after the Tsar abdicated in March 1917. It ruled until the Bolsheviks seized power in November." },
  { id: "soviet", term: "Soviet", def: "A council of elected workers' and soldiers' deputies. In 1917 the Petrograd Soviet shared power with the Provisional Government." },
  { id: "old-style", term: "Old Style", def: "The Julian calendar, which Russia used until February 1918. In this war it ran thirteen days behind the Western calendar. Dates in the Russian command are given Old Style, with the Western date in brackets." },
  { id: "central-powers", term: "Central Powers", def: "Germany, Austria-Hungary, the Ottoman Empire and Bulgaria." },
  { id: "entente", term: "Entente", def: "The alliance of France, Russia and Britain, later joined by Italy, Romania, the United States and others." },
  { id: "armistice", term: "armistice", ci: true, def: "An agreement to stop fighting, short of a peace treaty. The one signed on 11 November 1918 ended the war in the west." },
  { id: "stavka", term: "Stavka", def: "The supreme headquarters of the Russian army: the command you hold in this game." },
  { id: "bef", term: "BEF", def: "The British Expeditionary Force: the army sent to France in August 1914, and the name for the British forces on the Western Front." },
  { id: "galicia", term: "Galicia", def: "The Austrian province north of the Carpathians, now divided between south-eastern Poland and western Ukraine. It was the main Austro-Russian battlefield." },
  { id: "carpathians", term: "Carpathians", match: "Carpathians?", def: "The mountain range between Galicia and Hungary. Fighting there in the winter of 1914-15 cost both armies heavily." },
  { id: "przemysl", term: "Przemysl", def: "A fortress city in Galicia. The Russians besieged it from late 1914 and it surrendered in March 1915; German and Austro-Hungarian troops retook it in June." },
  { id: "lemberg", term: "Lemberg", def: "Now Lviv, the capital of Galicia. The Russians took it in September 1914 and lost it in June 1915." },
  { id: "gorlice", term: "Gorlice", def: "The town in Galicia where, in May 1915, German and Austro-Hungarian armies broke the Russian front in the Gorlice-Tarnow offensive." },
  { id: "isonzo", term: "Isonzo", def: "The river on the Italian-Austrian front, where twelve battles were fought between 1915 and 1917." },
  { id: "trentino", term: "Trentino", def: "The Italian-speaking Alpine region then held by Austria. Austria-Hungary attacked Italy from it in May 1916." },
  { id: "caporetto", term: "Caporetto", def: "The Austro-German offensive of October 1917 that broke the Italian line on the Isonzo." },
  { id: "salonika", term: "Salonika", def: "The Greek port where Allied troops landed in October 1915 to help Serbia. It became a front against Bulgaria." },
  { id: "dardanelles", term: "Dardanelles", def: "The narrow strait between the Aegean and the Sea of Marmara. The Allies tried to force it in 1915." },
  { id: "gallipoli", term: "Gallipoli", def: "The peninsula on the strait's European shore, where Allied troops landed in April 1915 and from which they withdrew by January 1916." },
  { id: "marne", term: "Marne", def: "The river east of Paris. The battle of September 1914 stopped the German advance, and a second battle in July 1918 stopped the last one." },
  { id: "ypres", term: "Ypres", def: "The Belgian town the Allies held in a salient, fought over in 1914, 1915 and 1917." },
  { id: "loos", term: "Loos", def: "The British and French offensive of September 1915 in Artois, in which the British first used poison gas and the new volunteer divisions first fought." },
  { id: "verdun", term: "Verdun", def: "The French fortress city on the Meuse. The German attack began there in February 1916 and the fighting lasted until December." },
  { id: "somme", term: "Somme", def: "The river in Picardy where the British and French attacked from 1 July to November 1916." },
  { id: "chantilly", term: "Chantilly", def: "The town that held the French headquarters. The Allies met there in December 1915 and November 1916 to plan their offensives together." },
  { id: "chemin-des-dames", term: "Chemin des Dames", def: "The ridge north of the Aisne, where the French offensive of April 1917 failed." },
  { id: "doullens", term: "Doullens", def: "The town where, on 26 March 1918, Allied leaders agreed to put Foch in charge of coordinating their armies." },
  { id: "brest-litovsk", term: "Brest-Litovsk", def: "The town where Russia signed a peace with the Central Powers on 3 March 1918." },
  { id: "hundred-days", term: "Hundred Days", def: "The Allied advance from 8 August 1918 to the armistice on 11 November." },
];

/** What the game leaves out: shown on the menu. */
export const LEAVES_OUT = [
  "The war here is the war as the commands in this game saw it from headquarters. Most of it is not in view: the colonies and the fighting outside Europe, the war at sea beyond what a headquarters decided about it, the smaller allies and their armies, and the hunger and work of the home fronts.",
  "The people the orders fell on are in the meters and not in the story. Millions of soldiers died, and millions of civilians were driven from their homes, starved, imprisoned or killed. The German army killed thousands of Belgian and French civilians in the invasion of 1914, and in 1915 the Russian army's headquarters ordered the border regions laid waste and their peoples expelled: about half a million Jews and a quarter of a million Germans were deported into the interior.",
  "Some of the worst events of the war were crimes, not decisions a general could take, and the game does not offer them as choices. One is the killing of Armenians in the Ottoman Empire from 1915, which the International Association of Genocide Scholars affirmed in 1997 was a genocide.",
];
// Source for the expulsions: Great Retreat (Russian), Wikipedia (wp-greatretreat in claims/sources.json): Yanushkevich, backed by the Grand Duke, ordered the army to devastate the border territories and expel the "enemy" nations; about 500,000 Jews and 250,000 Germans were deported.
// Source for the last sentence: the IAGS resolution on the Armenian Genocide, passed unanimously at its Montreal conference, 13 June 1997
// (genocidescholars.org, "IAGS Armenian Genocide Resolution"). It says the mass murder of over a million Armenians in 1915 meets the UN
// Convention's definition of genocide.

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
  .dg-root summary{list-style:none}
  .dg-root summary::-webkit-details-marker{display:none}
  .dg-map{display:block;width:100%;height:auto;border:1.5px solid ${THEME.rule};background:${THEME.paper};margin:10px 0 18px}
  .dg-attested{font-size:13px;margin-top:8px;color:${THEME.inkSoft}}
  .dg-attested cite{font-style:normal;font-size:12px}
  .dg-attested-tag{display:inline-block;border:1px solid currentColor;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:1px 5px}
  .dg-choice:hover:not(:disabled) .dg-quote,.dg-choice:hover:not(:disabled) .dg-attested{color:${THEME.paperRaised}}
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
  .dg-badge{display:inline-block;border:2px solid ${THEME.accent};color:${THEME.accent};text-transform:uppercase;
    font-size:10px;font-weight:700;letter-spacing:.2em;padding:5px 10px;margin-bottom:14px;transform:rotate(-1.5deg);
    box-shadow:inset 0 0 0 2px ${THEME.paper},inset 0 0 0 3px ${THEME.accent}}
  .dg-badge-contested{border-style:double;border-width:4px;box-shadow:none}
  .dg-badge-speculative{border-style:dashed}
  .dg-root h1:focus{outline:none}
  .dg-note-box{border:1.5px solid ${THEME.rule};padding:12px;margin:14px 0}
  .dg-note-box textarea{width:100%;box-sizing:border-box;font:inherit;font-size:12px;min-height:110px;background:${THEME.paperRaised};color:${THEME.ink};border:1px solid ${THEME.rule}}
  .dg-note-box a{color:${THEME.accent}}
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
  .dg-term{background:none;border:0;border-bottom:1px dotted currentColor;font:inherit;color:inherit;cursor:pointer;padding:0;margin:0}
  .dg-defn{display:block;border-left:3px solid ${THEME.accent};padding:4px 0 4px 10px;margin:8px 0 14px;font-size:13px;color:${THEME.inkSoft}}
  .dg-preview{display:inline-block;border:1px solid currentColor;font-size:11px;letter-spacing:.08em;padding:3px 7px;margin:0 6px 8px 0}
  .dg-record-mark{display:inline-block;border:1px solid ${THEME.accent};color:${THEME.accent};font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:2px 6px;margin:0 6px 8px 0}
  .dg-choice:hover:not(:disabled) .dg-record-mark{color:${THEME.paperRaised};border-color:${THEME.paperRaised}}
  .dg-strain{display:block;font-size:12px;color:${THEME.accent};margin:0 0 8px;font-weight:700}
  .dg-choice:hover:not(:disabled) .dg-strain{color:${THEME.paperRaised}}
  .dg-rank{border:1.5px solid ${THEME.rule};padding:14px;margin:18px 0}
  .dg-rank h2{font-family:${THEME.serif};font-size:26px;margin:0 0 4px}
  .dg-rank ul{list-style:none;margin:10px 0 0;padding:0;font-size:12px}
  .dg-rank li{display:flex;justify-content:space-between;gap:10px;border-top:1px solid ${THEME.rule};padding:6px 0}
  .dg-rank li span.n{color:${THEME.inkSoft}}
  .dg-fs-m .dg-prose,.dg-fs-m .dg-choice .lab{font-size:17px}
  .dg-fs-m .dg-bulletin,.dg-fs-m .dg-quote,.dg-fs-m .dg-entry,.dg-fs-m .dg-banner p{font-size:15px}
  .dg-fs-l .dg-prose,.dg-fs-l .dg-choice .lab{font-size:19px}
  .dg-fs-l .dg-bulletin,.dg-fs-l .dg-quote,.dg-fs-l .dg-entry,.dg-fs-l .dg-banner p{font-size:17px}
`;

function Stamp({ children }) {
  return <span className="dg-stamp">{children}</span>;
}

const TEXT_SIZE_LABELS = { s: "Standard", m: "Larger", l: "Largest" };
const FEEDBACK_URL = "https://dispatches.itch.io/dispatches-1914#comments";

/** A short typewriter tick or a stamp thud, made with the browser's own audio. Off unless the player turned it on. */
let audioCtx = null;
function playSound(kind) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const stamp = kind === "stamp";
    o.type = stamp ? "sine" : "square";
    o.frequency.setValueAtTime(stamp ? 80 : 1900, t);
    g.gain.setValueAtTime(stamp ? 0.3 : 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (stamp ? 0.25 : 0.035));
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t);
    o.stop(t + (stamp ? 0.3 : 0.05));
  } catch (e) { /* no audio: carry on silently */ }
}

/** The note a player can paste into a bug report or a playtest comment: the whole path, from the flags. */
function runNote(campaignId, nodeId, flags, mode, visited) {
  const c = CAMPAIGNS[campaignId];
  const marks = Object.keys(flags).sort().map((k) => k + "=" + flags[k]).join(" ");
  return ["Dispatches 1914", c.shortName, mode === "hard" ? "hard mode" : mode === "easy" ? "easy mode" : "standard", "ending " + nodeId,
    "decisions " + (visited.length - 1), "marks: " + marks].join(" | ");
}

// ---------- the glossary: the first mention of a term on a screen is underlined ----------

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const GLOSS_RES = GLOSSARY.map((g) => ({
  g,
  re: new RegExp(`(^|[^\\p{L}\\p{N}_-])(${g.match || escapeRe(g.term)})(?![\\p{L}\\p{N}_-])`, g.ci ? "iu" : "u"),
}));

/** Splits each text into { t, g? } segments, giving the first mention of each glossary term across all the texts, in order, its entry. Pure. */
function markFirstMentions(texts) {
  const used = new Set();
  return texts.map((text) => {
    if (typeof text !== "string" || !text) return [];
    const hits = [];
    for (const { g, re } of GLOSS_RES) {
      if (used.has(g.id)) continue;
      const m = re.exec(text);
      if (m) hits.push({ g, start: m.index + m[1].length, end: m.index + m[1].length + m[2].length });
    }
    hits.sort((a, b) => a.start - b.start);
    const segs = [];
    let pos = 0;
    for (const h of hits) {
      if (h.start < pos) continue; // inside a term already taken
      used.add(h.g.id);
      if (h.start > pos) segs.push({ t: text.slice(pos, h.start) });
      segs.push({ t: text.slice(h.start, h.end), g: h.g });
      pos = h.end;
    }
    if (pos < text.length) segs.push({ t: text.slice(pos) });
    return segs;
  });
}

/** A paragraph of story text whose glossary terms can be pressed for their definition. */
function GlossText({ segs, className = "dg-prose" }) {
  const [open, setOpen] = useState(null);
  const def = open ? GLOSSARY.find((g) => g.id === open) : null;
  return (
    <div className={className}>
      {segs.map((s, i) =>
        s.g ? (
          <button type="button" key={i} className="dg-term" aria-expanded={open === s.g.id} onClick={() => setOpen(open === s.g.id ? null : s.g.id)}>{s.t}</button>
        ) : (
          <React.Fragment key={i}>{s.t}</React.Fragment>
        )
      )}
      {def && <span className="dg-defn" role="note"><b>{def.term}.</b> {def.def}</span>}
    </div>
  );
}

function MenuScreen({ onPick, onRecord, savedRun, onResume, onDiscard, mode, onMode, settings, onSettings, record }) {
  const hardOn = mode === "hard";
  const easyOn = mode === "easy";
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
        {playable && easyOn && EASY_NAMES[cid] && (
          <p style={{ marginTop: 6 }}>Easy: {EASY_NAMES[cid]} Command</p>
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
            {savedRun.hardState.enabled ? " · hard mode" : savedRun.easy ? " · easy mode" : ""}
          </p>
          <p className="small">Starting a new file replaces this one.</p>
          <button className="dg-btn" onClick={onResume}>Resume file</button>{" "}
          <button className="dg-btn" onClick={onDiscard}>Discard</button>
        </section>
      )}

      <div className="dg-seg" role="group" aria-label="Difficulty">
        <button aria-pressed={easyOn} onClick={() => onMode("easy")}>Easy mode</button>
        <button aria-pressed={mode === "standard"} onClick={() => onMode("standard")}>Standard</button>
        <button aria-pressed={hardOn} onClick={() => onMode("hard")}>Hard mode</button>
      </div>
      <p className="dg-note">
        {hardOn
          ? "Hard mode adds an erosion track. Each command's office faced its own kind of pressure; at the limit its freedom to choose ends and a fixed ending follows."
          : easyOn
          ? "Easy mode shows what each order will do to the three meters, marks the order the command really gave, and lets you take back the last order. It cannot reach the highest rank."
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
        <div className="dg-count">Sound</div>
        <div className="dg-seg" role="group" aria-label="Sound">
          {[[false, "Off"], [true, "Typewriter"]].map(([v, label]) => (
            <button key={label} aria-pressed={settings.sound === v} onClick={() => onSettings({ ...settings, sound: v })}>{label}</button>
          ))}
        </div>
      </details>
      <details>
        <summary>▶ WHAT THIS GAME LEAVES OUT</summary>
        {LEAVES_OUT.map((p, i) => (
          <p key={i} className="dg-note">{p}</p>
        ))}
      </details>
      <details>
        <summary>▶ FEEDBACK</summary>
        <p className="dg-note">
          Found a mistake in the history, or want to say what the game was like to play? Say so on the{" "}
          <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" style={{ color: THEME.accent }}>game's page</a>.
          When a file closes, a note with the path you took is ready to paste.
        </p>
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

/** Where the headquarters sits, on the campaign's own stretch of Europe, with the route taken so far. */
function FrontMap({ campaignId, node, visited }) {
  const camp = CAMPAIGNS[campaignId];
  const cities = [...new Set(Object.values(camp.nodes).map((n) => n.city))].filter((c) => MAP_CITIES[c]);
  if (!cities.length || !MAP_CITIES[node.city]) return null;
  const trail = visited.map((id) => camp.nodes[id] && camp.nodes[id].city).filter((c, i, a) => MAP_CITIES[c] && c !== a[i - 1]);
  // Frame the last few headquarters, not the whole campaign, so the western front is readable.
  const focus = [...new Set([...trail.slice(-6), node.city])];
  const xs = focus.map((c) => MAP_CITIES[c][0]);
  const ys = focus.map((c) => MAP_CITIES[c][1]);
  const pad = 26;
  let x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
  let w = Math.max(...xs) + pad - x0, h = Math.max(...ys) + pad - y0;
  const aspect = MAP_VIEW.width / MAP_VIEW.height;
  const minW = 150;
  if (w < minW) { x0 -= (minW - w) / 2; w = minW; }
  if (w / h < aspect) { const nw = h * aspect; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / aspect; y0 -= (nh - h) / 2; h = nh; }
  const s = w / MAP_VIEW.width;
  // Only the places the file has been to: later headquarters are not given away.
  const shown = [...new Set([...trail, node.city])];
  const [hx, hy] = MAP_CITIES[node.city];
  return (
    <svg className="dg-map" viewBox={`${x0} ${y0} ${w} ${h}`} role="img" aria-label={`Map of the front. The headquarters is at ${node.city}.`}>
      <path d={MAP_LAND_PATH} fill={THEME.paperRaised} stroke={THEME.inkSoft} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      {trail.length > 1 && (
        <polyline points={trail.map((c) => MAP_CITIES[c].join(",")).join(" ")} fill="none" stroke={THEME.accent}
          strokeWidth="1.4" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
      )}
      {shown.map((c) => (
        <circle key={c} cx={MAP_CITIES[c][0]} cy={MAP_CITIES[c][1]} r={3.4 * s}
          fill={trail.includes(c) ? THEME.accent : THEME.inkSoft} opacity={trail.includes(c) ? 1 : 0.55} />
      ))}
      {shown.filter((c) => c !== node.city && MAP_CITIES[c][0] > x0 && MAP_CITIES[c][0] < x0 + w && MAP_CITIES[c][1] > y0 && MAP_CITIES[c][1] < y0 + h).map((c) => (
        <text key={"l" + c} x={MAP_CITIES[c][0] + 5 * s} y={MAP_CITIES[c][1] + 4 * s} fontSize={11 * s} fill={THEME.inkSoft} stroke={THEME.paperRaised}
          strokeWidth={3 * s} paintOrder="stroke" fontFamily={THEME.mono}>{c}</text>
      ))}
      <circle cx={hx} cy={hy} r={7 * s} fill="none" stroke={THEME.ink} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <text x={hx + 10 * s} y={hy - 8 * s} fontSize={17 * s} fill={THEME.ink} stroke={THEME.paper} strokeWidth={4 * s}
        paintOrder="stroke" fontFamily={THEME.mono}>{node.city}</text>
    </svg>
  );
}

/** "Manpower -2 · Will +1" or, for a contested order, "Manpower -3 to +1". */
function previewText(choice, labels) {
  const p = previewImpact(choice);
  const fmt = (n) => (n > 0 ? "+" + n : String(n));
  const parts = METER_AXES.filter((a) => p[a]).map((a) => `${labels[a]} ${p[a][0] === p[a][1] ? fmt(p[a][0]) : `${fmt(p[a][0])} to ${fmt(p[a][1])}`}`);
  return parts.length ? parts.join(" · ") : "No change to the meters";
}

function RankPanel({ result }) {
  return (
    <section className="dg-rank" aria-label="Your command">
      <div className="dg-count">Your command</div>
      <h2>{result.rank}</h2>
      <div className="dg-note" style={{ margin: 0 }}>{result.score} out of 100</div>
      <ul>
        {result.parts.map((p) => (
          <li key={p.id}>
            <span>{p.label}: <span className="n">{p.note}</span></span>
            <b>{p.points}/{p.max}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NodeScreen({ campaignId, node, meters, hardState, visited, flags, nodeId, easy, canRewind, rank, mode, onRewind, onChoose, onHome }) {
  const c = CAMPAIGNS[campaignId];
  const years = [1914, 1915, 1916, 1917, 1918];
  const [situationSegs, contextSegs, epilogueSegs] = useMemo(() => markFirstMentions([node.situation, node.context, node.epilogue]), [node]);
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
      <GlossText key={nodeId + "-situation"} segs={situationSegs} />

      {node.context && (
        <details>
          <summary>▶ SHOW BACKGROUND</summary>
          <GlossText key={nodeId + "-context"} segs={contextSegs} />
        </details>
      )}
      {node.city && MAP_CITIES[node.city] && (
        <details>
          <summary>▶ SHOW THE MAP</summary>
          <FrontMap campaignId={campaignId} node={node} visited={visited || []} />
        </details>
      )}

      {node.ending ? (
        <>
          <div className={`dg-badge dg-badge-${node.ending.badge}`}>{BADGE_LABELS[node.ending.badge]}</div>
          {node.epilogue && <GlossText key={nodeId + "-epilogue"} segs={epilogueSegs} />}
          {rank && <RankPanel result={rank} />}
          <details>
            <summary>▶ A NOTE FOR THE AUTHOR</summary>
            <div className="dg-note-box">
              <p className="dg-note" style={{ marginTop: 0 }}>
                A line that records the path you took. Paste it into a comment on the{" "}
                <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">game's page</a> with whatever you want to say.
              </p>
              <textarea readOnly aria-label="Note with the path taken" value={runNote(campaignId, nodeId || "", flags || {}, mode, visited || [])}
                onFocus={(e) => e.target.select()} />
            </div>
          </details>
          <button className="dg-btn" onClick={onHome}>Return to file</button>
        </>
      ) : (
        <>
          <h2 className="dg-order">Issue Order</h2>
          {easy && canRewind && (
            <p><button className="dg-btn" onClick={onRewind}>Take back the last order</button></p>
          )}
          {node.choices.map((ch) => {
            const strain = strainedUncertain(ch, meters);
            return (
            <button key={ch.id} className="dg-choice" disabled={ch.blocked}
              onClick={() => onChoose(ch)}>
              <div className="lab">{ch.label}</div>
              {ch.blocked && <div className="dg-cost">✕ {ch.disabledReason}</div>}
              {easy && ch.historical && <span className="dg-record-mark">✓ The order the command gave</span>}
              {easy && !ch.blocked && <span className="dg-preview">{previewText(ch, node.meterLabels)}</span>}
              {strain.points > 0 && (
                <span className="dg-strain">Strain: {node.meterLabels[strain.meter]} is short, so the odds are {strain.points} points worse</span>
              )}
              {ch.erodes && hardState.enabled && <div className="dg-cost">✕ Costs standing</div>}
              {ch.advisor && (
                <div className="dg-quote">
                  {ch.advisor.name} argues: {ch.advisor.position}
                </div>
              )}
              {ch.attested && (
                <div className="dg-attested">
                  <span className="dg-attested-tag">On the record</span>{" "}
                  {ch.attested.by}: “{ch.attested.text}” <cite>— {ch.attested.source}</cite>
                </div>
              )}
            </button>
            );
          })}
        </>
      )}
    </main>
  );
}

function OutcomeScreen({ campaignId, outcome, record, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const [outcomeSegs, recordSegs] = useMemo(() => markFirstMentions([outcome, record && record.text]), [outcome, record]);
  return (
    <main className="dg-root">
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <h1 className="dg-docrow" style={{ margin: "18px 0 16px" }}><span>{c.docLabel} · OUTCOME</span></h1>
      <hr className="dg-rule" />
      <GlossText key={"o-" + String(outcome).slice(0, 24)} segs={outcomeSegs} />
      {record && (
        <details>
          <summary>▶ THE HISTORICAL RECORD</summary>
          <GlossText key={"r-" + String(outcome).slice(0, 24)} segs={recordSegs} />
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
        {[["dossiers", "Dossiers"], ["atlas", "Atlas"], ["endings", "Endings"], ["echoes", "Echoes"], ["glossary", "Glossary"]].map(([id, label]) => (
          <button key={id} className="dg-btn" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "echoes" && (
        <section>
          <p className="dg-note">A choice in one command can change what another command faces. Marks are kept here; nothing echoes unless you have departed from the record.</p>
          {Object.entries(ECHOES).map(([flag, e]) => {
            const v = (record.xc || {})[flag];
            return v === undefined ? (
              <div key={flag} className="dg-entry locked"><span className="meta">{e.label}</span> Not yet set.</div>
            ) : (
              <div key={flag} className="dg-entry">
                <div className="meta">{e.label}</div>
                <div className="t">{e.values[v] || v}</div>
                <div className="meta">{v === e.historical ? "As in the record." : "Echoes in: " + e.readBy + ". Set in: " + e.setBy + "."}</div>
              </div>
            );
          })}
        </section>
      )}
      {tab === "glossary" && (
        <section>
          <p className="dg-note">Words and places in the files. In the story text, the first mention of each on a screen is underlined: press it for the definition.</p>
          {[...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)).map((g) => (
            <div key={g.id} className="dg-entry">
              <div className="t">{g.term}</div>
              <div>{g.def}</div>
            </div>
          ))}
        </section>
      )}
      {tab !== "echoes" && tab !== "glossary" && playable.map((cid) => {
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
  const [mode, setMode] = useState("standard"); // the menu's choice: "easy", "standard" or "hard"
  const [runEasy, setRunEasy] = useState(false); // the run in hand is an easy run
  const [taken, setTaken] = useState([]); // the orders the run has given: { node, choice }
  const [history, setHistory] = useState([]); // the state before each order, for the easy mode's take-back
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

  // A new screen puts keyboard and screen-reader focus on its heading, so the change is announced.
  const firstScreen = useRef(true);
  useEffect(() => {
    if (firstScreen.current) { firstScreen.current = false; return; }
    const h = document.querySelector("main h1");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }, [screen, nodeId]);
  useEffect(() => { saveRecord(record); }, [record]);

  // A node on screen counts as seen, and so do the advisers present at it.
  useEffect(() => {
    if (screen !== "node" || !campaignId || !nodeId || !node) return;
    setVisited((v) => (v.includes(nodeId) ? v : [...v, nodeId]));
    setRecord((r) => noteNodeSeen(r, campaignId, nodeId, node.advisors || []));
    if (node.ending && endedRun.current !== runKey) {
      endedRun.current = runKey;
      if (settings.sound) playSound("stamp");
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
      campaignId, nodeId, flags, meters, hardState, visited, easy: runEasy, taken, history,
      pendingNextId: screen === "outcome" && pending ? pending.nextId ?? null : null,
      pendingOutcome: screen === "outcome" && pending ? pending.outcome ?? null : null,
      pendingRecord: screen === "outcome" && pending ? pending.record ?? null : null,
    }));
  }, [screen, campaignId, nodeId, flags, meters, hardState, pending, visited, runEasy, taken, history]);

  const start = (cid) => {
    setCampaignId(cid);
    setFlags(echoSeed(record));
    setMeters(emptyMeters());
    setHardState({ ...emptyHardState(), enabled: mode === "hard" });
    setRunEasy(mode === "easy");
    setTaken([]);
    setHistory([]);
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
    setRunEasy(Boolean(s.easy));
    setTaken(Array.isArray(s.taken) ? s.taken : []);
    setHistory(Array.isArray(s.history) ? s.history : []);
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
    if (settings.sound) playSound("tick");
    const r = chooseNext(campaignId, ch, flags, meters, hardState);
    if (runEasy) setHistory((h) => [...h, { nodeId, flags, meters, hardState, visited, taken }].slice(-REWIND_LIMIT));
    setTaken((t) => [...t, { node: nodeId, choice: ch.id }]);
    setFlags(r.flags); setMeters(r.meters); setHardState(r.hardState);
    setRecord((rec) => noteEchoes(rec, r.flags));
    setPending({ ...r, record: historicalNote(node, ch) });
    setScreen(r.outcome ? "outcome" : "node");
    if (!r.outcome) setNodeId(r.nextId);
  };

  const cont = () => {
    setNodeId(pending?.nextId ?? null);
    setPending(null);
    setScreen("node");
  };

  // Easy mode: take back the last order, restoring the state it was given from.
  const rewind = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setFlags(last.flags); setMeters(last.meters); setHardState(last.hardState); setVisited(last.visited); setTaken(last.taken);
    setPending(null);
    setNodeId(last.nodeId);
    setScreen("node");
  };

  const runMode = modeOf(hardState, runEasy);
  const rank = useMemo(
    () => (node && node.ending ? rankFor({ campaignId, endingId: nodeId, meters, hardState, easy: runEasy, taken }) : null),
    [node, campaignId, nodeId, meters, hardState, runEasy, taken]
  );

  return (
    <div className={`dg-fs-${settings.textSize}`} style={{ display: "contents" }}>
      <style>{css}</style>
      {screen === "menu" && (
        <MenuScreen onPick={start} onRecord={() => setScreen("record")} savedRun={savedRun}
          onResume={resume} onDiscard={discard} mode={mode} onMode={setMode}
          settings={settings} onSettings={setSettings} record={record} />
      )}
      {screen === "record" && <RecordScreen record={record} onBack={home} />}
      {screen === "outcome" && (
        <OutcomeScreen campaignId={campaignId} outcome={pending.outcome} record={pending.record} onContinue={cont} />
      )}
      {screen === "node" && node && (
        <NodeScreen campaignId={campaignId} node={node} meters={meters}
          hardState={hardState} visited={visited} flags={flags} nodeId={nodeId} easy={runEasy} canRewind={history.length > 0}
          rank={rank} mode={runMode} onRewind={rewind} onChoose={choose} onHome={home} />
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
