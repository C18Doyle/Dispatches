/**
 * How a headquarters runs its war (Dispatches WW2): the command style chosen in the war room, the timing of a battle, what a battle's result
 * asks of the next report, the bargain at the Casablanca conference, and the staff's estimate of hidden odds. Pure rules; the screens are in
 * parts 40, 46 and 50. Every rule here leaves a file that never uses it exactly as the source files wrote it.
 */
import { impactSum, clampMeter } from "./logic";

type Flags = Record<string, any>;
type Meters = { manpower: number; fuel: number; initiative: number };
type Impact = Partial<Meters>;

const sumOf = (i: Impact | undefined) => impactSum(i as any);

// ---------- Command style (the war room) ----------
export type Style = "cautious" | "steady" | "audacious";
export const STYLES: readonly Style[] = ["cautious", "steady", "audacious"];
/** Points of probability a style moves on a contested order it suits, and against one it does not. */
export const STYLE_FOR = 6;
export const STYLE_AGAINST = 4;
export const styleOf = (flags: Flags): Style => (flags && STYLES.includes(flags.style) ? flags.style : "steady");

/** A bold order: one whose best outcome raises Initiative (an attack, a race, a risk taken for tempo). */
export function isBold(choice: any): boolean {
  const u = choice.uncertain || [];
  if (u.length < 2) return false;
  const sums = u.map((v: any) => sumOf(v.impact || choice.impact));
  const best = u[sums.indexOf(Math.max(...sums))];
  return ((best.impact || choice.impact || {}).initiative || 0) > 0;
}

/**
 * The stage with the odds of its contested orders moved by the command style: an audacious command is better at bold orders and worse at
 * careful ones, a cautious command the other way round, a steady command leaves every roll as written. Probability moves between an order's best
 * and worst outcomes, as strain moves it, and never below 5% of the whole; Orders of Battle keep their own arithmetic. A moved order carries
 * `style` ({ points }), which the briefing shows.
 */
export function styleStage<T extends { choices?: any[] } | null | undefined>(stage: T, flags: Flags): T {
  const style = styleOf(flags);
  if (!stage || !stage.choices || style === "steady") return stage;
  const choices = stage.choices.map((choice: any) => {
    const u = choice.uncertain;
    if (!u || u.length < 2 || choice.keyBattleSubgame) return choice;
    const suits = (style === "audacious") === isBold(choice);
    const points = suits ? STYLE_FOR : -STYLE_AGAINST;
    const sums = u.map((v: any) => sumOf(v.impact || choice.impact));
    const best = sums.indexOf(Math.max(...sums));
    const worst = sums.indexOf(Math.min(...sums));
    if (best === worst || sums[best] === sums[worst]) return choice;
    const total = u.reduce((a: number, v: any) => a + v.weight, 0);
    const [from, to] = points > 0 ? [worst, best] : [best, worst];
    const moved = Math.min(u[from].weight - total * 0.05, (total * Math.abs(points)) / 100);
    if (moved <= 0) return choice;
    const uncertain = u.map((v: any, i: number) => (i === from ? { ...v, weight: v.weight - moved } : i === to ? { ...v, weight: v.weight + moved } : v));
    return { ...choice, uncertain, style: { points: Math.sign(points) * Math.round((moved / total) * 100), style } };
  });
  return { ...stage, choices } as T;
}

/** What a style costs at each new year: an audacious command spends men, a cautious one gives up tempo. */
export function styleYearCost(flags: Flags): Impact {
  const s = styleOf(flags);
  return s === "audacious" ? { manpower: -1 } : s === "cautious" ? { initiative: -1 } : {};
}

// ---------- The timing of a battle (the Order of Battle) ----------
export interface Timing {
  id: string;
  /** Effort chits the timing adds or takes. */
  chits: number;
  /** A reconnaissance pass the timing brings at no cost: its error rate, or null for none. */
  recon: number | null;
  /** No reconnaissance pass can be bought (the attack goes in before there is time). */
  noRecon?: boolean;
  /** The command style that opens this timing, if only one does. */
  style?: Style;
}
export const TIMINGS: Record<string, Timing> = {
  now: { id: "now", chits: 0, recon: null },
  wait: { id: "wait", chits: -1, recon: 0.1 },
  early: { id: "early", chits: 1, recon: null, noRecon: true, style: "audacious" },
  long: { id: "long", chits: -2, recon: 0, style: "cautious" },
};
/** The timings a command may choose for a battle. */
export function timingsFor(flags: Flags): Timing[] {
  const s = styleOf(flags);
  return Object.values(TIMINGS).filter((x) => !x.style || x.style === s);
}

// ---------- After a battle: what its result asks of the next report ----------
export interface FollowUpOrder {
  id: string;
  impact: Impact;
}
export interface FollowUp {
  kind: "exploit" | "withdraw";
  orders: FollowUpOrder[];
}
/**
 * The order a battle's result forces before the next report: a clean victory offers the pursuit or consolidation, a heavy defeat (the plan itself
 * gave out) demands withdrawal or holding. A costly victory or a narrow defeat asks nothing.
 */
export function followUpFor(grade: string | null | undefined): FollowUp | null {
  if (grade === "clean")
    return {
      kind: "exploit",
      orders: [
        { id: "pursue", impact: { initiative: 2, fuel: -1 } },
        { id: "consolidate", impact: { manpower: 1 } },
      ],
    };
  if (grade === "total")
    return {
      kind: "withdraw",
      orders: [
        { id: "withdraw", impact: { manpower: 1, initiative: -2 } },
        { id: "hold", impact: { manpower: -2 } },
      ],
    };
  return null;
}

/** Meters after an impact, clamped (follow-ups, the style's yearly cost, the conference): no arrears, as a dispatch's cost has none. */
export function applySmall(meters: Meters, impact: Impact): Meters {
  return {
    manpower: clampMeter(meters.manpower + (impact.manpower || 0)),
    fuel: clampMeter(meters.fuel + (impact.fuel || 0)),
    initiative: clampMeter(meters.initiative + (impact.initiative || 0)),
  };
}

// ---------- Casablanca: the bargain over the date and the Mediterranean ----------
export interface ConferenceOption {
  id: string;
  /** The chance (percent) the other delegation accepts, from the delegation's Initiative; null when it is the record's compromise or a gift. */
  roll: boolean;
  /** What a bargain that lands costs or gains at once. */
  impact: Impact;
  /** The flag value a bargain that lands sets (conf_<command>). */
  result: string;
}
export interface Conference {
  /** The report the paper comes before. */
  at: string;
  options: ConferenceOption[];
  /** What a refused bargain costs. */
  refused: Impact;
}
export const CONFERENCES: Record<string, Conference> = {
  // From the War Cabinet's chair: Sicily now and a date for France (the record), the Mediterranean first with no date, or France in 1943.
  british: {
    at: "casablanca43",
    options: [
      { id: "record", roll: false, impact: {}, result: "record" },
      { id: "mediterranean", roll: true, impact: { initiative: 1 }, result: "mediterranean" },
      { id: "france", roll: false, impact: { manpower: -1 }, result: "france" },
    ],
    refused: { initiative: -2 },
  },
  // From the Joint Chiefs' chair: the record's compromise, France in 1943 and no Sicily, or the Mediterranean conceded for thirty per cent for
  // the Pacific (King's figure at Casablanca).
  american: {
    at: "unconditionalSurrender43",
    options: [
      { id: "record", roll: false, impact: {}, result: "record" },
      { id: "france", roll: true, impact: { manpower: -1 }, result: "france" },
      { id: "pacific", roll: true, impact: {}, result: "pacific" },
    ],
    refused: { initiative: -1 },
  },
};
/** The chance (percent) the other delegation accepts a bargain: 50, five points for each point of the delegation's Initiative, 20 to 80. */
export const bargainChance = (meters: Meters): number => Math.max(20, Math.min(80, 50 + 5 * (meters.initiative || 0)));
export const conferenceFlag = (command: string) => `conf_${command}`;
export function conferenceDue(command: string, flags: Flags, nodeId: string | number): Conference | null {
  const c = CONFERENCES[command];
  if (!c || String(nodeId) !== c.at || flags[conferenceFlag(command)]) return null;
  return c;
}
/** Effort chits the bargain gives or takes in a battle, by command and battle. */
const CONFERENCE_CHITS: Record<string, Record<string, Record<string, number>>> = {
  british: { mediterranean: { anzio44: 1, arnhemPerimeter44: -1 }, france: { anzio44: -1, arnhemPerimeter44: 1 } },
  american: { france: { bastogne44: 1 }, pacific: { philippineSea44: 1, bastogne44: -1 } },
};
export function conferenceChits(command: string, flags: Flags, configId: string): number {
  const r = flags[conferenceFlag(command)];
  return (CONFERENCE_CHITS[command] && CONFERENCE_CHITS[command][r] && CONFERENCE_CHITS[command][r][configId]) || 0;
}

// ---------- The staff's estimate of hidden odds ----------
/** What the staff's estimate costs: a point of Initiative. */
export const ESTIMATE_COST = 1;
export const estimateKey = (nodeId: string | number, index: number) => `est_${nodeId}_${index}`;
/** The staff's estimate of a hidden roll: each outcome's share, rounded to the nearest ten per cent (the staff do not know it exactly). */
export function staffEstimate(choice: any): { title: string; percent: number }[] {
  const u = choice.uncertain || [];
  const total = u.reduce((a: number, v: any) => a + v.weight, 0) || 1;
  return u.map((v: any) => ({ title: v.title, percent: Math.round((v.weight / total) * 10) * 10 }));
}
