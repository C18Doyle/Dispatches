import {
  NODES,
  NEWSPAPER_EVENTS,
  ENDINGS,
  START_NODE_ID,
  LORE_NODE_IDS,
  LORE_EVENT_ID,
  TRANSITION_EVENT_ID,
  ACT2_ENTRY_NODES,
  ACT2_SKIP_NODE_ID,
  getTemperamentReading,
} from "./data";
import type { GameState, Resource, Resources, FontSize, Difficulty, Option, Gate, Temperament, Roll } from "./types";
import { STARTING_MONEY, FRITZ_ADVICE_LIMIT } from "./types";

const RESOURCES: Resource[] = ["voltage", "biomass", "secrecy"];
export const CRISIS_THRESHOLD = -7;
export const FAILURE_THRESHOLD = -10;

export function clamp(n: number): number {
  return Math.max(-10, Math.min(10, n));
}

export function initialState(
  fontSize: FontSize = "medium",
  musicEnabled = true,
  musicVolume = 0.45,
  sfxEnabled = true,
  sfxVolume = 0.6
): GameState {
  return {
    screen: "MENU",
    screenBeforeSettings: "MENU",
    fontSize,
    musicEnabled,
    musicVolume,
    sfxEnabled,
    sfxVolume,
    difficulty: "MEDIUM",
    money: 0,
    currentNodeId: START_NODE_ID,
    activeBranch: "UNIVERSAL",
    resources: { voltage: 0, biomass: 0, secrecy: 0 },
    temperament: { voice: 0, bond: 0 },
    flags: {},
    activeNewspaper: null,
    pendingAfterNewspaper: null,
    pendingOutcomeText: null,
    pendingOutcomeKind: "CHOICE",
    pendingOutcomeStamps: null,
    pendingRoll: null,
    pendingOptionLabel: null,
    pendingOptionQuote: null,
    shownCrises: [],
    shownOneShot: [],
    endingId: null,
    history: [],
    fritzAdviceUsesLeft: FRITZ_ADVICE_LIMIT,
    fritzAdviceRevealed: false,
    fritzFavorUsed: false,
  };
}

// A roll with no `scaling` just returns its stored chance, unchanged. One
// with `scaling` moves that chance with a live resource, clamped into a
// sane range so no combination of resource extremes can push it out of
// (0, 1) — used both to actually resolve CONDUCT_EXPERIMENT below and by
// App.tsx to show the player the real odds before and while they gamble.
export function effectiveRollChance(roll: Roll, resources: Resources): number {
  if (!roll.scaling) return roll.chance;
  const { resource, perPoint, min = 0.1, max = 0.95 } = roll.scaling;
  const raw = roll.chance + resources[resource] * perPoint;
  return Math.max(min, Math.min(max, raw));
}

export function isOptionLocked(resources: Resources, gate?: Gate): boolean {
  if (!gate) return false;
  return resources[gate.resource] < gate.minThreshold;
}

export function isOptionAffordable(money: number, difficulty: Difficulty, moneyCost?: number): boolean {
  if (!moneyCost || difficulty !== "HARD") return true;
  return money >= moneyCost;
}

export function isOptionFlagLocked(flags: Record<string, boolean>, requiresFlag?: string): boolean {
  if (!requiresFlag) return false;
  return !flags[requiresFlag];
}

export function isOptionUnavailable(
  resources: Resources,
  money: number,
  difficulty: Difficulty,
  flags: Record<string, boolean>,
  option: Option
): boolean {
  return (
    isOptionLocked(resources, option.gate) ||
    !isOptionAffordable(money, difficulty, option.moneyCost) ||
    isOptionFlagLocked(flags, option.requiresFlag)
  );
}

export type Action =
  | { type: "OPEN_SETTINGS" }
  | { type: "CLOSE_SETTINGS" }
  | { type: "OPEN_RESEARCH" }
  | { type: "CLOSE_RESEARCH" }
  | { type: "SET_FONT_SIZE"; size: FontSize }
  | { type: "SET_MUSIC_ENABLED"; enabled: boolean }
  | { type: "SET_MUSIC_VOLUME"; volume: number }
  | { type: "SET_SFX_ENABLED"; enabled: boolean }
  | { type: "SET_SFX_VOLUME"; volume: number }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "START_GAME" }
  | { type: "ADVANCE_PROLOGUE" }
  | { type: "ENTER_STORY" }
  | { type: "SKIP_TO_ACT2" }
  | { type: "HYDRATE"; state: GameState }
  | { type: "SELECT_OPTION"; optionIndex: number }
  | { type: "CONDUCT_EXPERIMENT" }
  | { type: "CONTINUE_OUTCOME" }
  | { type: "DISMISS_NEWSPAPER" }
  | { type: "ASK_FRITZ_ADVICE" }
  | { type: "USE_FRITZ_FAVOR"; resource: Resource }
  | { type: "RESTART" };

function applyStamps(resources: Resources, stamps: Partial<Record<Resource, number>>): Resources {
  const next: Resources = { ...resources };
  for (const r of RESOURCES) {
    const delta = stamps[r] ?? 0;
    if (delta !== 0) next[r] = clamp(next[r] + delta);
  }
  return next;
}

function clampTemperament(n: number): number {
  return Math.max(-8, Math.min(8, n));
}

function applyTemperament(temperament: Temperament, delta?: Partial<Temperament>): Temperament {
  if (!delta) return temperament;
  return {
    voice: clampTemperament(temperament.voice + (delta.voice ?? 0)),
    bond: clampTemperament(temperament.bond + (delta.bond ?? 0)),
  };
}

function checkFailureEnding(resources: Resources): string | null {
  const failed = RESOURCES.find((r) => resources[r] <= FAILURE_THRESHOLD);
  return failed ? `ENDING_CRISIS_${failed.toUpperCase()}` : null;
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "RESTART":
      return initialState(state.fontSize, state.musicEnabled, state.musicVolume, state.sfxEnabled, state.sfxVolume);

    // Restores a full state saved by the autosave in App.tsx. The caller is
    // responsible for validating it first (a saved currentNodeId that no
    // longer exists after a content update, say) — this just installs it.
    case "HYDRATE":
      return action.state;

    case "OPEN_SETTINGS":
      return { ...state, screenBeforeSettings: state.screen, screen: "SETTINGS" };

    case "CLOSE_SETTINGS":
      return { ...state, screen: state.screenBeforeSettings };

    case "OPEN_RESEARCH":
      return { ...state, screen: "RESEARCH" };

    case "CLOSE_RESEARCH":
      return { ...state, screen: "MENU" };

    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.size };

    case "SET_MUSIC_ENABLED":
      return { ...state, musicEnabled: action.enabled };

    case "SET_MUSIC_VOLUME":
      return { ...state, musicVolume: action.volume };

    case "SET_SFX_ENABLED":
      return { ...state, sfxEnabled: action.enabled };

    case "SET_SFX_VOLUME":
      return { ...state, sfxVolume: action.volume };

    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.difficulty };

    case "START_GAME":
      return { ...state, screen: "PROLOGUE" };

    case "ADVANCE_PROLOGUE":
      return { ...state, screen: "CHAPTER_CARD" };

    case "ENTER_STORY":
      return {
        ...state,
        screen: "NODE",
        currentNodeId: START_NODE_ID,
        activeBranch: "UNIVERSAL",
        money: state.difficulty === "HARD" ? STARTING_MONEY : 0,
      };

    // Lets a returning player (one who has already finished a run) skip
    // straight to the first branch-defining choice, bypassing the ~7 nodes
    // of Act I that never fork regardless of what's picked. Resources start
    // at the Triangle's center rather than wherever a real Act I playthrough
    // would have left them, and the 3 requiresFlag callbacks tied to early
    // choices are simply unavailable this run — both are disclosed in the
    // button's own copy, not hidden.
    case "SKIP_TO_ACT2":
      return {
        ...state,
        screen: "NODE",
        currentNodeId: ACT2_SKIP_NODE_ID,
        activeBranch: "UNIVERSAL",
        money: state.difficulty === "HARD" ? STARTING_MONEY : 0,
        resources: { voltage: 0, biomass: 0, secrecy: 0 },
        temperament: { voice: 0, bond: 0 },
        flags: {},
      };

    case "DISMISS_NEWSPAPER": {
      if (!state.activeNewspaper || !state.pendingAfterNewspaper) return state;
      const target = state.pendingAfterNewspaper;
      const shownOneShot = [...state.shownOneShot, state.activeNewspaper.id];
      const node = NODES[target];
      return {
        ...state,
        screen: "NODE",
        currentNodeId: target,
        activeBranch: node ? node.branch : state.activeBranch,
        activeNewspaper: null,
        pendingAfterNewspaper: null,
        shownOneShot,
        fritzAdviceRevealed: false,
      };
    }

    case "SELECT_OPTION": {
      const node = NODES[state.currentNodeId];
      if (!node) return state;
      const option = node.options[action.optionIndex];
      if (!option) return state;
      if (isOptionUnavailable(state.resources, state.money, state.difficulty, state.flags, option)) return state;

      const spend = state.difficulty === "HARD" && option.moneyCost ? option.moneyCost : 0;
      const gain = state.difficulty === "HARD" && option.moneyDelta ? option.moneyDelta : 0;
      const money = Math.max(0, state.money - spend + gain);
      const history = [...state.history, { nodeId: state.currentNodeId, optionIndex: action.optionIndex }];

      if (option.roll) {
        // The temperament nudge, where an option carries one, reflects the
        // choice to attempt this — it applies regardless of how the roll
        // itself lands, since the roll's stamps already cover the outcome.
        return {
          ...state,
          money,
          history,
          temperament: applyTemperament(state.temperament, option.temperamentDelta),
          screen: "EXPERIMENT",
          pendingRoll: option.roll,
          pendingOptionLabel: option.label,
          pendingOptionQuote: option.quote,
          pendingAfterNewspaper: option.nextNodeId,
        };
      }

      const nextResources = applyStamps(state.resources, option.stamps);
      const nextTemperament = applyTemperament(state.temperament, option.temperamentDelta);
      const nextFlags = option.setFlags
        ? { ...state.flags, ...Object.fromEntries(option.setFlags.map((f) => [f, true])) }
        : state.flags;
      const failureEnding = checkFailureEnding(nextResources);
      const target = failureEnding ?? option.nextNodeId;

      return {
        ...state,
        money,
        resources: nextResources,
        temperament: nextTemperament,
        flags: nextFlags,
        history,
        screen: "OUTCOME",
        pendingOutcomeText: option.outcome,
        pendingOutcomeKind: "CHOICE",
        pendingOutcomeStamps: option.stamps,
        pendingAfterNewspaper: target,
      };
    }

    case "CONDUCT_EXPERIMENT": {
      if (!state.pendingRoll || !state.pendingAfterNewspaper) return state;
      const roll = state.pendingRoll;
      const chance = effectiveRollChance(roll, state.resources);
      const success = Math.random() < chance;
      const result = success ? roll.success : roll.failure;

      const nextResources = applyStamps(state.resources, result.stamps);
      const nextFlags = result.setFlags
        ? { ...state.flags, ...Object.fromEntries(result.setFlags.map((f) => [f, true])) }
        : state.flags;
      const failureEnding = checkFailureEnding(nextResources);
      // A roll's success/failure branch may name its own destination (a real
      // structural payoff for the gamble, not just different flavor text);
      // falls back to the option's shared nextNodeId when it doesn't.
      const target = failureEnding ?? result.nextNodeId ?? state.pendingAfterNewspaper;

      return {
        ...state,
        resources: nextResources,
        flags: nextFlags,
        screen: "OUTCOME",
        pendingOutcomeText: result.outcome,
        pendingOutcomeKind: success ? "SUCCESS" : "FAILURE",
        pendingOutcomeStamps: result.stamps,
        pendingAfterNewspaper: target,
        pendingRoll: null,
        pendingOptionLabel: null,
        pendingOptionQuote: null,
      };
    }

    case "ASK_FRITZ_ADVICE": {
      if (state.difficulty === "EASY") return state; // Easy already shows the preview for free
      if (state.fritzAdviceUsesLeft <= 0) return state;
      if (state.fritzAdviceRevealed) return state;
      return { ...state, fritzAdviceUsesLeft: state.fritzAdviceUsesLeft - 1, fritzAdviceRevealed: true };
    }

    case "USE_FRITZ_FAVOR": {
      if (state.fritzFavorUsed) return state;
      // Boosting voltage or biomass costs 2 secrecy — a separate resource,
      // so the two deltas apply cleanly. Boosting secrecy itself can't use
      // "cost 2 secrecy" as the price (that was a duplicate object key that
      // silently discarded the +3 entirely, netting a flat -2), so it pays
      // for its own +3 out of the other two meters instead.
      const favorStamps: Partial<Record<Resource, number>> =
        action.resource === "secrecy" ? { secrecy: 3, biomass: -1, voltage: -1 } : { [action.resource]: 3, secrecy: -2 };
      const boosted = applyStamps(state.resources, favorStamps);
      const failureEnding = checkFailureEnding(boosted);
      if (failureEnding) {
        return {
          ...state,
          resources: boosted,
          fritzFavorUsed: true,
          flags: { ...state.flags, fritzPatron: true },
          screen: "ENDING",
          endingId: failureEnding,
        };
      }
      return {
        ...state,
        resources: boosted,
        fritzFavorUsed: true,
        flags: { ...state.flags, fritzPatron: true },
      };
    }

    case "CONTINUE_OUTCOME": {
      const target = state.pendingAfterNewspaper;
      if (!target) return state;

      if (target.startsWith("ENDING_")) {
        return {
          ...state,
          screen: "ENDING",
          endingId: target,
          pendingOutcomeText: null,
          pendingOutcomeStamps: null,
          pendingAfterNewspaper: null,
        };
      }

      // One-shot newspaper triggers, checked in a fixed priority order so at
      // most one fires per transition.
      let newspaperId: string | null = null;
      if (LORE_NODE_IDS.includes(target) && !state.shownOneShot.includes(LORE_EVENT_ID)) {
        newspaperId = LORE_EVENT_ID;
      } else if (ACT2_ENTRY_NODES.includes(target) && !state.shownOneShot.includes(TRANSITION_EVENT_ID)) {
        newspaperId = TRANSITION_EVENT_ID;
      } else {
        const crisisResource = RESOURCES.find((r) => state.resources[r] <= CRISIS_THRESHOLD);
        if (crisisResource) {
          const crisisId = `CRISIS_${crisisResource.toUpperCase()}`;
          if (!state.shownCrises.includes(crisisId)) newspaperId = crisisId;
        }
      }

      if (newspaperId) {
        const event = NEWSPAPER_EVENTS[newspaperId];
        const shownCrises = event.type === "crisis" ? [...state.shownCrises, newspaperId] : state.shownCrises;
        return {
          ...state,
          screen: "NEWSPAPER",
          activeNewspaper: event,
          pendingOutcomeText: null,
          pendingOutcomeStamps: null,
          pendingAfterNewspaper: target,
          shownCrises,
        };
      }

      const nextNode = NODES[target];
      return {
        ...state,
        screen: "NODE",
        currentNodeId: target,
        activeBranch: nextNode ? nextNode.branch : state.activeBranch,
        pendingOutcomeText: null,
        pendingOutcomeStamps: null,
        pendingAfterNewspaper: null,
        fritzAdviceRevealed: false,
      };
    }

    default:
      return state;
  }
}

export function resolveEndingText(state: GameState): {
  headline: string;
  title: string;
  text: string;
  temperamentLabel: string | null;
} {
  const ending = state.endingId ? ENDINGS[state.endingId] : undefined;
  if (!ending) return { headline: "", title: "Unknown", text: "", temperamentLabel: null };

  let headline = ending.headline;
  let text = ending.text;
  if (ending.variants) {
    const match = ending.variants.find((v) => state.flags[v.flag]);
    if (match) {
      headline = match.headline;
      text = match.text;
    }
  }

  // The crisis/failure endings already read as abrupt and final on their
  // own — the temperament epilogue only follows a full narrative ending,
  // where there's actually a "what became of it" left to add.
  if (ending.kind === "narrative") {
    const reading = getTemperamentReading(state);
    return { headline, title: ending.title, text: `${text}\n\n${reading.epilogue}`, temperamentLabel: reading.label };
  }
  return { headline, title: ending.title, text, temperamentLabel: null };
}
