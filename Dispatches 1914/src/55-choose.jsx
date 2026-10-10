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
 * Apply a choice. Returns the next node id and updated state. `plan` is an Order of Battle plan (61-battle.jsx) for a choice that hosts one: it
 * moves the weights of the contested roll after strain, charges the meters a little, and leaves flags for the next report.
 *
 * Order matters and matches the handover's description of handleChoose:
 * impact is applied first, then nextIf is evaluated against POST-choice meters,
 * then next is the fallthrough.
 */
export function chooseNext(campaignId, choice, flags, meters, hardState, rng = Math.random, plan = null) {
  let branch = null;
  let battle = null;
  if (choice.uncertain && choice.uncertain.length) {
    let weights = strainedUncertain(choice, meters).uncertain;
    const roll = plan ? battleRoll(choice, plan, meters) : null;
    if (roll) weights = shiftToward(weights, roll.config.winBranch, roll.bonus);
    branch = rollUncertain(weights, rng);
    if (roll) {
      const won = weights.indexOf(branch) === roll.config.winBranch;
      const costs = roll.costsFor(won);
      battle = {
        id: roll.config.id, title: roll.config.title, posture: roll.posture ? roll.posture.id : null, bonus: roll.bonus, won,
        grade: costs.grade, lines: costs.lines, totals: costs.totals, weights: weights.map((b) => b.weight),
        flagsOut: battleFlagsOut(roll.config, plan, costs),
      };
    }
  }

  const impact = branch?.impact ?? choice.impact;
  const setFlags = { ...(choice.setFlags ?? {}), ...(branch?.setFlags ?? {}), ...(battle ? battle.flagsOut : {}) };

  let nextMeters = applyImpact(meters, impact);
  if (battle) nextMeters = applyImpact(nextMeters, battle.totals);
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
    battle,
  };
}
