/**
 * The American effort split (Dispatches WW2). Once a year from 1942, after Arcadia has opened the war in Europe, the Joint Chiefs share the
 * year's men, ships and aircraft between the war against Germany and the war against Japan: Germany first, an even hand, or the Pacific first.
 * The share moves the odds of the year's contested orders in both theatres. The odds written into the two source files are the record's, so
 * they are measured from the record's share for that year: an allocation as the record made it leaves every roll as written, and each step
 * away from it (Germany first to even, even to the Pacific first) makes one theatre's rolls EFFORT_STEP points better and the other's as
 * much worse. Probability moves between a choice's best and worst outcomes (by the sum of their meter impacts), as strain moves it; an
 * outcome never falls below 5% of the whole. Orders that open an Order of Battle keep their own arithmetic.
 */
import { impactSum } from "./logic-pacific";

export type Theatre = "europe" | "pacific";
export type Allocation = "germanyFirst" | "even" | "pacificFirst";
type Flags = Record<string, any>;

/** The years the Joint Chiefs allocate, in order. */
export const EFFORT_YEARS: readonly number[] = [1942, 1943, 1944, 1945];
/** The three allocations, Germany first to the Pacific first; the index is the step toward the Pacific. */
export const ALLOCATIONS: readonly Allocation[] = ["germanyFirst", "even", "pacificFirst"];
/** The share of the effort that goes to the war against Germany, in percent. */
export const EUROPE_SHARE: Record<Allocation, number> = { germanyFirst: 65, even: 50, pacificFirst: 35 };
/** How the record shared the effort in each year. In 1942 and 1943 Germany came first in principle and the Pacific had as much in fact; from
 * 1944 Overlord had first call on men, landing craft and aircraft. */
export const RECORD_ALLOCATION: Record<number, Allocation> = { 1942: "even", 1943: "even", 1944: "germanyFirst", 1945: "germanyFirst" };
/** The points of probability one step of allocation moves (a step is 15% of the effort). */
export const EFFORT_STEP = 6;
const FLOOR = 0.05;

/** The flag that holds a year's allocation. */
export const effortFlag = (year: number): string => `usEffort_${year}`;

/** The year a report's date names first ("JUNE 1942" 1942, "1943 – 1944" 1943), or null. */
export function reportYear(date: string | null | undefined): number | null {
  const m = String(date || "").match(/19\d{2}/);
  return m ? Number(m[0]) : null;
}

/** The year whose allocation is due before a report: an allocated year with no allocation yet, once the war in Europe has opened. */
export function effortDue(flags: Flags, year: number | null, europeOpen: boolean): number | null {
  if (!europeOpen || year == null || !EFFORT_YEARS.includes(year)) return null;
  return flags[effortFlag(year)] ? null : year;
}

/** The points the year's allocation moves a theatre's odds by: positive is better, negative worse, 0 when the year is unallocated. */
export function effortPoints(flags: Flags, theatre: Theatre, year: number | null): number {
  if (year == null) return 0;
  const chosen = flags[effortFlag(year)] as Allocation | undefined;
  const record = RECORD_ALLOCATION[year];
  if (!chosen || !record || !ALLOCATIONS.includes(chosen)) return 0;
  const towardPacific = ALLOCATIONS.indexOf(chosen) - ALLOCATIONS.indexOf(record);
  const points = towardPacific * EFFORT_STEP;
  return theatre === "pacific" ? points : -points;
}

/** What an allocation does in a year, for the screen that offers it: the points for each theatre. */
export function allocationEffect(allocation: Allocation, year: number): { europe: number; pacific: number } {
  const flags = { [effortFlag(year)]: allocation };
  return { europe: effortPoints(flags, "europe", year), pacific: effortPoints(flags, "pacific", year) };
}

/** The share the record gave each theatre, and what the player gave, for the end of the file: one row per allocated year. */
export function allocationRecord(flags: Flags): { year: number; chosen: Allocation | null; record: Allocation }[] {
  return EFFORT_YEARS.filter((y) => flags[effortFlag(y)]).map((y) => ({ year: y, chosen: (flags[effortFlag(y)] as Allocation) || null, record: RECORD_ALLOCATION[y] }));
}

/**
 * The stage with the odds of its contested orders moved by the year's allocation. Each moved choice carries `effort` ({ points, theatre }),
 * which the briefing shows, and what is shown is what is rolled.
 */
export function effortStage<T extends { choices?: any[] } | null | undefined>(stage: T, flags: Flags, theatre: Theatre, year: number | null): T {
  if (!stage || !stage.choices) return stage;
  const points = effortPoints(flags, theatre, year);
  if (!points) return stage;
  const choices = stage.choices.map((choice: any) => {
    const u = choice.uncertain;
    if (!u || u.length < 2 || choice.keyBattleSubgame) return choice;
    const sums = u.map((v: any) => impactSum(v.impact || choice.impact));
    const best = sums.indexOf(Math.max(...sums));
    const worst = sums.indexOf(Math.min(...sums));
    if (best === worst || sums[best] === sums[worst]) return choice;
    const total = u.reduce((a: number, v: any) => a + v.weight, 0);
    // Better odds take from the worst outcome and give to the best; worse odds the other way. Neither falls below the floor.
    const [from, to] = points > 0 ? [worst, best] : [best, worst];
    const moved = Math.min(u[from].weight - total * FLOOR, (total * Math.abs(points)) / 100);
    if (moved <= 0) return choice;
    const uncertain = u.map((v: any, i: number) => (i === from ? { ...v, weight: v.weight - moved } : i === to ? { ...v, weight: v.weight + moved } : v));
    return { ...choice, uncertain, effort: { points: points > 0 ? Math.round((moved / total) * 100) : -Math.round((moved / total) * 100), theatre } };
  });
  return { ...stage, choices } as T;
}
