export type Branch = "UNIVERSAL" | "ALCHEMICAL" | "GALVANIC" | "PROMETHEUS";
export type Resource = "voltage" | "biomass" | "secrecy";

export interface Stamps {
  voltage?: number;
  biomass?: number;
  secrecy?: number;
}

export interface Quote {
  speaker: string;
  text: string;
}

export interface Gate {
  resource: Resource;
  minThreshold: number;
}

export interface RollOutcome {
  outcome: string;
  stamps: Stamps;
  setFlags?: string[];
  /** Overrides the option's own nextNodeId for this branch only. Omit to keep routing identical between success/failure. */
  nextNodeId?: string;
}

/**
 * Makes a roll's odds move with the resource that narratively drives it (more
 * banked biomass makes a hybridization steadier, more voltage makes a second
 * shock likelier to take, and so on), instead of every roll being one flat
 * constant regardless of how the run is actually going. Plain data only, on
 * purpose — GameState (and therefore any pendingRoll on it) is JSON.stringify'd
 * for the mid-run autosave, and a function value here would silently vanish
 * on the next reload.
 */
export interface RollScaling {
  resource: Resource;
  /** Added to (or subtracted from) roll.chance per point the resource sits away from 0. */
  perPoint: number;
  /** Effective-chance floor after scaling. Defaults to 0.1. */
  min?: number;
  /** Effective-chance ceiling after scaling. Defaults to 0.95. */
  max?: number;
}

export interface Roll {
  /** 0-1 probability of success — the base value when scaling is absent, or the value at resource = 0 when it's present. */
  chance: number;
  /** Optional: makes the effective chance move with a live resource instead of staying flat. See effectiveRollChance in engine.ts. */
  scaling?: RollScaling;
  success: RollOutcome;
  failure: RollOutcome;
}

export interface Option {
  label: string;
  detail: string;
  stamps: Stamps;
  quote: Quote;
  outcome: string;
  gate?: Gate;
  moneyCost?: number;
  /** Hard-mode-only money income from taking this option (rare — most of the economy is pure spend). */
  moneyDelta?: number;
  roll?: Roll;
  nextNodeId: string;
  setFlags?: string[];
  /** A small nudge to the creature's tracked temperament — tagged only on the run's pivotal, narratively-significant choices. */
  temperamentDelta?: Partial<Temperament>;
  /** Only selectable once this flag has been set earlier in the run. */
  requiresFlag?: string;
  /** Shown on a requiresFlag option while it's still locked, instead of the raw flag key. */
  requiresFlagHint?: string;
}

export interface GameNode {
  id: string;
  branch: Branch;
  title: string;
  description: string;
  options: Option[];
}

export type NewspaperType = "lore" | "crisis" | "transition";

export interface NewspaperEvent {
  id: string;
  masthead: string;
  headline: string;
  bodyText: string;
  type: NewspaperType;
}

export interface EndingVariant {
  flag: string;
  headline: string;
  text: string;
}

export interface Ending {
  id: string;
  title: string;
  kind: "narrative" | "failure";
  headline: string;
  text: string;
  variants?: EndingVariant[];
}

export interface Resources {
  voltage: number;
  biomass: number;
  secrecy: number;
}

export interface Temperament {
  /** Positive = eloquent and considered; negative = ferocious and violent. */
  voice: number;
  /** Positive = longing for connection; negative = vengeful and severed. */
  bond: number;
}

export type Screen =
  | "MENU"
  | "SETTINGS"
  | "RESEARCH"
  | "PROLOGUE"
  | "CHAPTER_CARD"
  | "NODE"
  | "OUTCOME"
  | "EXPERIMENT"
  | "NEWSPAPER"
  | "ENDING";

export type FontSize = "small" | "medium" | "large";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type OutcomeKind = "CHOICE" | "SUCCESS" | "FAILURE";

export const STARTING_MONEY = 50;

export interface GameState {
  screen: Screen;
  screenBeforeSettings: Screen;
  fontSize: FontSize;
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
  difficulty: Difficulty;
  money: number;
  currentNodeId: string;
  activeBranch: Branch;
  resources: Resources;
  /** Accumulated from temperamentDelta on the choices actually taken; combined with flags/resources at the ending screen for the final reading. */
  temperament: Temperament;
  flags: Record<string, boolean>;
  activeNewspaper: NewspaperEvent | null;
  pendingAfterNewspaper: string | null;
  pendingOutcomeText: string | null;
  pendingOutcomeKind: OutcomeKind;
  /** The resource deltas actually applied by the choice/roll that led to the current Outcome screen — shown there on Medium/Hard, which hide the preview beforehand. */
  pendingOutcomeStamps: Stamps | null;
  pendingRoll: Roll | null;
  pendingOptionLabel: string | null;
  pendingOptionQuote: Quote | null;
  shownCrises: string[];
  shownOneShot: string[];
  endingId: string | null;
  history: { nodeId: string; optionIndex: number }[];
  /** Fritz's on-demand advice: reveals this node's stamp preview. Capped, Medium/Hard only. */
  fritzAdviceUsesLeft: number;
  fritzAdviceRevealed: boolean;
  /** Fritz's Favor: a one-time meter boost brokered by a mysterious patron. */
  fritzFavorUsed: boolean;
}

export const FRITZ_ADVICE_LIMIT = 3;
