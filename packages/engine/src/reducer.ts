/**
 * The turn-resolution reducer. Pure and deterministic: reduce(def, state, action)
 * returns a new state, never mutates, never reads Math.random / Date / DOM.
 * Randomness arrives inside the action (CONDUCT_EXPERIMENT.roll).
 */
import { applyAxisDelta, applyStamps, checkFailureEnding, effectiveRollChance, isOptionUnavailable } from "./rules";
import type { Action, GameDefinition, GameState } from "./schema";

export function createInitialState(def: GameDefinition): GameState {
  const { config, content } = def;
  return {
    phase: "MENU",
    difficulty: config.defaultDifficulty,
    money: 0,
    currentNodeId: content.startNodeId,
    activeBranch: config.startBranch,
    resources: Object.fromEntries(config.resources.map((r) => [r.id, r.start])),
    axes: Object.fromEntries(config.axes.map((a) => [a.id, 0])),
    flags: {},
    activeInterludeId: null,
    pendingTarget: null,
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
    adviceUsesLeft: config.assist?.adviceLimit ?? 0,
    adviceRevealed: false,
    favorUsed: false,
  };
}

const withFlags = (flags: Record<string, boolean>, set?: string[]) =>
  set ? { ...flags, ...Object.fromEntries(set.map((f) => [f, true])) } : flags;

export function reduce(def: GameDefinition, state: GameState, action: Action): GameState {
  const { config, content } = def;
  const rules = config.difficulties[state.difficulty];

  switch (action.type) {
    case "RESTART":
      return createInitialState(def);

    // Installs a saved state as-is. The caller validates it first (a saved
    // currentNodeId that no longer exists after a content update, say).
    case "HYDRATE":
      return action.state;

    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.difficulty };

    case "START_GAME":
      return { ...state, phase: "PROLOGUE" };

    case "ADVANCE_PROLOGUE":
      return { ...state, phase: "CHAPTER_CARD" };

    case "ENTER_STORY":
      return {
        ...state,
        phase: "NODE",
        currentNodeId: content.startNodeId,
        activeBranch: config.startBranch,
        money: rules.startingMoney,
      };

    // Returning-player shortcut past the non-branching opening. Resources, axes
    // and flags reset to start values; history and one-shot bookkeeping carry over.
    case "SKIP_TO_ACT2":
      if (!config.skipToNodeId) return state;
      return {
        ...state,
        phase: "NODE",
        currentNodeId: config.skipToNodeId,
        activeBranch: config.startBranch,
        money: rules.startingMoney,
        resources: Object.fromEntries(config.resources.map((r) => [r.id, r.start])),
        axes: Object.fromEntries(config.axes.map((a) => [a.id, 0])),
        flags: {},
      };

    case "DISMISS_INTERLUDE": {
      if (!state.activeInterludeId || !state.pendingTarget) return state;
      const target = state.pendingTarget;
      const node = content.nodes[target];
      return {
        ...state,
        phase: "NODE",
        currentNodeId: target,
        activeBranch: node ? node.branch : state.activeBranch,
        activeInterludeId: null,
        pendingTarget: null,
        shownOneShot: [...state.shownOneShot, state.activeInterludeId],
        adviceRevealed: false,
      };
    }

    case "SELECT_OPTION": {
      const node = content.nodes[state.currentNodeId];
      if (!node) return state;
      const option = node.options[action.optionIndex];
      if (!option) return state;
      if (isOptionUnavailable(def, state, option)) return state;

      const spend = rules.enforceMoney && option.moneyCost ? option.moneyCost : 0;
      const gain = rules.enforceMoney && option.moneyDelta ? option.moneyDelta : 0;
      const money = Math.max(0, state.money - spend + gain);
      const history = [...state.history, { nodeId: state.currentNodeId, optionIndex: action.optionIndex }];
      // The axis nudge reflects the choice itself, so it applies even when a roll follows.
      const axes = applyAxisDelta(def, state.axes, option.axisDelta);

      if (option.roll) {
        return {
          ...state,
          money,
          history,
          axes,
          phase: "ROLL",
          pendingRoll: option.roll,
          pendingOptionLabel: option.label,
          pendingOptionQuote: option.quote,
          pendingTarget: option.nextNodeId,
        };
      }

      const resources = applyStamps(def, state.resources, option.stamps);
      const failureEnding = checkFailureEnding(def, resources);
      return {
        ...state,
        money,
        resources,
        axes,
        flags: withFlags(state.flags, option.setFlags),
        history,
        phase: "OUTCOME",
        pendingOutcomeText: option.outcome,
        pendingOutcomeKind: "CHOICE",
        pendingOutcomeStamps: option.stamps,
        pendingTarget: failureEnding ?? option.nextNodeId,
      };
    }

    case "CONDUCT_EXPERIMENT": {
      if (!state.pendingRoll || !state.pendingTarget) return state;
      const roll = state.pendingRoll;
      const success = action.roll < effectiveRollChance(roll, state.resources);
      const result = success ? roll.success : roll.failure;

      const resources = applyStamps(def, state.resources, result.stamps);
      const failureEnding = checkFailureEnding(def, resources);
      return {
        ...state,
        resources,
        flags: withFlags(state.flags, result.setFlags),
        phase: "OUTCOME",
        pendingOutcomeText: result.outcome,
        pendingOutcomeKind: success ? "SUCCESS" : "FAILURE",
        pendingOutcomeStamps: result.stamps,
        // A branch may name its own destination; otherwise the option's shared one stands.
        pendingTarget: failureEnding ?? result.nextNodeId ?? state.pendingTarget,
        pendingRoll: null,
        pendingOptionLabel: null,
        pendingOptionQuote: null,
      };
    }

    case "ASK_ADVICE":
      if (!rules.adviceEnabled || state.adviceUsesLeft <= 0 || state.adviceRevealed) return state;
      return { ...state, adviceUsesLeft: state.adviceUsesLeft - 1, adviceRevealed: true };

    case "USE_FAVOR": {
      const assist = config.assist;
      const stamps = assist?.favors[action.resource];
      if (!assist || !stamps || state.favorUsed) return state;
      const resources = applyStamps(def, state.resources, stamps);
      const next = { ...state, resources, favorUsed: true, flags: { ...state.flags, [assist.favorFlag]: true } };
      const failureEnding = checkFailureEnding(def, resources);
      return failureEnding ? { ...next, phase: "ENDING" as const, endingId: failureEnding } : next;
    }

    case "CONTINUE_OUTCOME": {
      const target = state.pendingTarget;
      if (!target) return state;

      if (target.startsWith("ENDING_")) {
        return {
          ...state,
          phase: "ENDING",
          endingId: target,
          pendingOutcomeText: null,
          pendingOutcomeStamps: null,
          pendingTarget: null,
        };
      }

      // At most one interlude per transition: one-shot triggers in config order,
      // then the first resource at its crisis level (once per run).
      let interludeId: string | null = null;
      const trigger = config.interludeTriggers.find((t) => t.onEnterNodes.includes(target) && !state.shownOneShot.includes(t.interludeId));
      if (trigger) {
        interludeId = trigger.interludeId;
      } else {
        const crisis = config.resources.find((r) => r.crisisAt !== undefined && (state.resources[r.id] ?? 0) <= r.crisisAt);
        if (crisis?.crisisInterludeId && !state.shownCrises.includes(crisis.crisisInterludeId)) interludeId = crisis.crisisInterludeId;
      }

      const interlude = interludeId ? content.interludes[interludeId] : undefined;
      if (interlude) {
        return {
          ...state,
          phase: "INTERLUDE",
          activeInterludeId: interlude.id,
          pendingOutcomeText: null,
          pendingOutcomeStamps: null,
          pendingTarget: target,
          shownCrises: interlude.kind === "crisis" ? [...state.shownCrises, interlude.id] : state.shownCrises,
        };
      }

      const nextNode = content.nodes[target];
      return {
        ...state,
        phase: "NODE",
        currentNodeId: target,
        activeBranch: nextNode ? nextNode.branch : state.activeBranch,
        pendingOutcomeText: null,
        pendingOutcomeStamps: null,
        pendingTarget: null,
        adviceRevealed: false,
      };
    }

    default:
      return state;
  }
}
