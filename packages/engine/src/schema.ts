/**
 * Dispatches engine contract.
 *
 * Pure types and constants only. NO React, NO DOM, NO imports from outside
 * src/engine/. Everything here must be JSON-serialisable: GameState is
 * JSON.stringify'd for autosave, and content files are plain JSON. No
 * functions, Maps, Sets, Dates or class instances anywhere in this file's types.
 *
 * Three layers, each owned by a different file:
 *   GameConfig   -> content/<game>/config.json   (rules: resources, difficulty, thresholds)
 *   GameContent  -> content/<game>/events.json   (nodes, interludes, endings)
 *   FlavorContent-> content/<game>/flavor.json   (prologue, help text, gossip, epilogues)
 * The engine takes a GameDefinition = { config, content, flavor } as an
 * argument. It never imports a specific game.
 */

// ─── Identifiers ──────────────────────────────────────────────────────────
// Branded in docs only; plain strings at runtime so JSON stays trivial.
export type ResourceId = string; // e.g. "voltage" | "biomass" | "secrecy"
export type AxisId = string; // e.g. "voice" | "bond"
export type NodeId = string; // key in content.nodes
export type InterludeId = string; // key in content.interludes
export type EndingId = string; // key in content.endings; by convention starts with "ENDING_"
export type FlagId = string;
export type BranchId = string; // e.g. "UNIVERSAL" | "ALCHEMICAL"

// ─── Resources ────────────────────────────────────────────────────────────
/** Frankenstein: all three resources run -10..10 and start at 0. */
export interface ResourceDef {
  id: ResourceId;
  label: string;
  min: number;
  max: number;
  start: number;
  /** At or below this value a one-shot crisis interlude fires (once per run). Omit for none. */
  crisisAt?: number;
  crisisInterludeId?: InterludeId;
  /** At or below this value the run ends immediately with failureEndingId. Omit for none. */
  failAt?: number;
  failureEndingId?: EndingId;
}

export type Stamps = Record<ResourceId, number>; // sparse in practice; absent key = 0
export type PartialStamps = Partial<Stamps>;

// ─── Conditions (replaces code like GOSSIP_POOL[].applies and flag/resource rules) ───
export type Comparator = "<" | "<=" | ">" | ">=" | "==";

export type Condition =
  | { flag: FlagId }
  | { resource: ResourceId; op: Comparator; value: number }
  | { axis: AxisId; op: Comparator; value: number }
  | { stat: "money"; op: Comparator; value: number }
  | { branch: BranchId }
  | { difficulty: Difficulty }
  | { favorUsed: boolean }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

// ─── Temperament / hidden axes (Frankenstein: voice, bond) ────────────────
export interface AxisDef {
  id: AxisId;
  label: string;
  min: number; // Frankenstein: -8
  max: number; // Frankenstein: 8
  /** Value >= this is "pos", <= -this is "neg", otherwise "neutral". Frankenstein: 2. */
  bucketThreshold: number;
}

/** Applied at the ending (and Fritz's mid-run read) on top of live axis values. Evaluated against state; result clamped to axis bounds. */
export interface AxisRule {
  when: Condition;
  delta: Partial<Record<AxisId, number>>;
}

export interface EpilogueReading {
  label: string;
  epilogue: string;
}

export interface EpilogueConfig {
  /** Exactly two axes: bucket pair forms the key "<bucket(x)>_<bucket(y)>", e.g. "pos_neg". */
  axes: [AxisId, AxisId];
  inferredRules: AxisRule[];
}

// ─── Quotes, gates, rolls ─────────────────────────────────────────────────
export interface Quote {
  speaker: string;
  text: string;
}

export interface Gate {
  resource: ResourceId;
  minThreshold: number;
}

export interface RollOutcome {
  outcome: string;
  stamps: PartialStamps;
  setFlags?: FlagId[];
  /** Overrides the option's nextNodeId for this branch only. */
  nextNodeId?: NodeId;
}

/** Odds move with a resource. Plain data on purpose (see header). */
export interface RollScaling {
  resource: ResourceId;
  /** Added to roll.chance per point of the resource's value (may be negative). */
  perPoint: number;
  /** Floor after scaling. Default 0.1. */
  min?: number;
  /** Ceiling after scaling. Default 0.95. */
  max?: number;
}

export interface Roll {
  /** 0-1 base probability, or the probability at resource value 0 when scaling is set. */
  chance: number;
  scaling?: RollScaling;
  /** The resource this roll is about, for strain (see GameConfig.strain). Defaults to scaling.resource. */
  about?: ResourceId;
  success: RollOutcome;
  failure: RollOutcome;
}

// ─── Content: nodes, interludes, endings ──────────────────────────────────
export interface Option {
  label: string;
  detail: string;
  stamps: PartialStamps;
  quote: Quote;
  outcome: string;
  gate?: Gate;
  /** Enforced only when difficulty.rules.enforceMoney is true. */
  moneyCost?: number;
  /** Same enforcement rule as moneyCost. */
  moneyDelta?: number;
  roll?: Roll;
  nextNodeId: NodeId;
  setFlags?: FlagId[];
  /** Nudge to hidden axes, tagged only on pivotal choices. Applied even if a roll fails. */
  axisDelta?: Partial<Record<AxisId, number>>;
  requiresFlag?: FlagId;
  /** Shown while a requiresFlag option is locked. */
  requiresFlagHint?: string;
  /** The option is shown but locked until this holds (an axis, a resource, a flag, the difficulty...). */
  requires?: Condition;
  /** Shown while a `requires` option is locked. */
  requiresHint?: string;
  /** The option is not shown, and cannot be chosen, unless this holds (for example { difficulty: "HARD" }). */
  showWhen?: Condition;
}

/** Lines added under a scene's description while their condition holds: the player's earlier choices carried forward. */
export interface NodeEcho {
  when: Condition;
  text: string;
}

export interface GameNode {
  id: NodeId;
  branch: BranchId;
  title: string;
  description: string;
  options: Option[];
  echoes?: NodeEcho[];
}

export type InterludeKind = "lore" | "crisis" | "transition";

/** A full-screen story card between nodes (Frankenstein: a newspaper clipping). */
export interface Interlude {
  id: InterludeId;
  /** Source line shown above the headline, e.g. a newspaper name. */
  source: string;
  headline: string;
  bodyText: string;
  kind: InterludeKind;
}

export interface EndingVariant {
  /** One of `flag` or `when` is required. */
  flag?: FlagId;
  when?: Condition;
  headline: string;
  text: string;
}

export interface Ending {
  id: EndingId;
  title: string;
  /** "narrative" endings get the epilogue reading appended; "failure" endings do not. */
  kind: "narrative" | "failure";
  headline: string;
  text: string;
  /** First variant whose flag is set (or whose condition holds) wins. */
  variants?: EndingVariant[];
}

/** events.json */
export interface GameContent {
  startNodeId: NodeId;
  nodes: Record<NodeId, GameNode>;
  interludes: Record<InterludeId, Interlude>;
  endings: Record<EndingId, Ending>;
}

// ─── Config: rules ────────────────────────────────────────────────────────
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface DifficultyRules {
  /** Preview of stamps shown before choosing (EASY: true). */
  showPreview: boolean;
  /** moneyCost / moneyDelta apply (HARD: true). */
  enforceMoney: boolean;
  startingMoney: number;
  /** Can the player spend advice charges to reveal a preview? (MEDIUM/HARD: true). */
  adviceEnabled: boolean;
}

/** One-shot interlude triggered by arriving at one of the listed nodes. Array order = priority; at most one fires per transition. */
export interface InterludeTrigger {
  interludeId: InterludeId;
  onEnterNodes: NodeId[];
}

export interface AssistConfig {
  adviceLimit: number; // Frankenstein: 3
  /**
   * One-time boost. Key = resource the player chooses to boost; value = the
   * stamps applied. Flag set on use (favorFlag).
   */
  favors: Record<ResourceId, PartialStamps>;
  favorFlag: FlagId; // Frankenstein: "fritzPatron"
}

/**
 * Strain: a resource below `threshold` takes `perPoint` of probability off every roll that is about it, for each point below,
 * up to `max`. Shown on the option and the experiment screen.
 */
export interface StrainConfig {
  threshold: number;
  perPoint: number;
  max: number;
}

/** config.json */
export interface GameConfig {
  id: string; // e.g. "frankenstein"
  title: string;
  schemaVersion: number;
  resources: ResourceDef[];
  axes: AxisDef[];
  epilogue?: EpilogueConfig;
  difficulties: Record<Difficulty, DifficultyRules>;
  defaultDifficulty: Difficulty;
  /** Branch active at the start of a run and after skipping ahead. */
  startBranch: BranchId;
  interludeTriggers: InterludeTrigger[];
  assist?: AssistConfig;
  strain?: StrainConfig;
  /** Node to jump to for returning players. Resets resources/axes/flags to start values. */
  skipToNodeId?: NodeId;
}

// ─── Flavor: static text and non-mechanical random lines ──────────────────
export interface GossipEntry {
  when?: Condition; // absent = always applies
  lines: string[];
}

export interface HelpSection {
  heading: string;
  body: string;
}

/** flavor.json — no mechanics depend on anything here. */
export interface FlavorContent {
  prologue: string[];
  chapterCard: Record<string, string>;
  howToPlay: HelpSection[];
  gossip: GossipEntry[];
  /** Keyed "<bucket>_<bucket>", e.g. "pos_neg". */
  epilogueReadings: Record<string, EpilogueReading>;
  /** Mid-run hints, same key scheme; one line chosen by caller-supplied RNG. */
  creatureReportLines: Record<string, string[]>;
  /** Names and one-line descriptions of the difficulties, for the difficulty card and the record. */
  difficultyInfo?: Record<Difficulty, { label: string; blurb: string }>;
}

export interface GameDefinition {
  config: GameConfig;
  content: GameContent;
  flavor: FlavorContent;
}

// ─── Runtime state ────────────────────────────────────────────────────────
/**
 * Where the run is. App-level screens (settings, research panel, menu
 * preferences) are NOT here: they are UI state, owned by the app, and the
 * engine must not know they exist.
 */
export type Phase =
  | "MENU"
  | "PROLOGUE"
  | "CHAPTER_CARD"
  | "NODE"
  | "OUTCOME"
  | "ROLL"
  | "INTERLUDE"
  | "ENDING";

export type OutcomeKind = "CHOICE" | "SUCCESS" | "FAILURE";

export interface HistoryEntry {
  nodeId: NodeId;
  optionIndex: number;
}

export interface GameState {
  phase: Phase;
  difficulty: Difficulty;
  money: number;
  currentNodeId: NodeId;
  activeBranch: BranchId;
  resources: Record<ResourceId, number>;
  axes: Record<AxisId, number>;
  flags: Record<FlagId, boolean>;

  activeInterludeId: InterludeId | null;
  /** Destination to enter after the current outcome / interlude / roll. */
  pendingTarget: NodeId | EndingId | null;
  pendingOutcomeText: string | null;
  pendingOutcomeKind: OutcomeKind;
  /** Deltas actually applied by the choice/roll behind the current OUTCOME screen. */
  pendingOutcomeStamps: PartialStamps | null;
  pendingRoll: Roll | null;
  pendingOptionLabel: string | null;
  pendingOptionQuote: Quote | null;

  shownCrises: InterludeId[];
  shownOneShot: InterludeId[];
  endingId: EndingId | null;
  history: HistoryEntry[];

  adviceUsesLeft: number;
  adviceRevealed: boolean;
  favorUsed: boolean;
}

/**
 * Every random input is supplied by the caller, so reduce(state, action) is
 * deterministic and replayable from `history`.
 */
export type Action =
  | { type: "START_GAME" }
  | { type: "ADVANCE_PROLOGUE" }
  | { type: "ENTER_STORY" }
  | { type: "SKIP_TO_ACT2" }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "SELECT_OPTION"; optionIndex: number }
  /** `roll` is a uniform sample in [0, 1) from the caller's RNG. Success iff roll < effective chance. */
  | { type: "CONDUCT_EXPERIMENT"; roll: number }
  | { type: "CONTINUE_OUTCOME" }
  | { type: "DISMISS_INTERLUDE" }
  | { type: "ASK_ADVICE" }
  | { type: "USE_FAVOR"; resource: ResourceId }
  | { type: "RESTART" }
  | { type: "HYDRATE"; state: GameState };

/**
 * App-owned, persisted separately from GameState, never read by the engine.
 * Lives here only so every game shares one shape.
 */
export interface UiPrefs {
  fontSize: "small" | "medium" | "large";
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
}
