/**
 * The year's effort (Dispatches WW2): what a headquarters has to spend each year, and where it goes.
 *
 * 1. The year's new strength. At the first report of a new calendar year, a meter that stands at -5 or lower recovers two points (Manpower: the
 *    year's call-up; Matériel: the year's production), paying what is owed on it first, as any gain does. Initiative is not made in factories and
 *    does not recover. Without it a long war pinned the meters to the floor for its last third (docs/BALANCE.md), and the last decisions stopped
 *    being decisions.
 *
 * 2. The allocation of effort. Four commands share each year's men, ships and aircraft between two claims on them, on a paper shown before the
 *    year's first briefing: the Joint Chiefs between Germany and Japan (1942–45), OKW between the East and the West (1942–44, once Barbarossa
 *    has begun), IGHQ between the army's war and the navy's (1942–45, once the war in the Pacific has opened), STAVKA between the front and the
 *    factories (1942–45). The share moves forces, not luck:
 *      - every Order of Battle on a side starts with more or fewer effort chits, one for each step the year's share moved toward it or away from
 *        it, and one for each step of the year before (what was not built or shipped last year is still missing): at most two either way;
 *      - STAVKA's claims are now and later: the front first gives this year's battles a chit and takes one from next year's, the factories first
 *        the other way round, and the factories add a point of Matériel while the front costs one;
 *      - moving effort between two theatres costs a point of Matériel a step (shipping, time in transit, depots built twice);
 *      - the Joint Chiefs' European shortfall is counted again at Yalta: each step the war against Germany was given less than the record gave it,
 *        over the four years, costs a point of Initiative there (at most three), because the armies in the west stand where their share put them.
 *    The record's share for each year costs nothing and moves nothing, so a file that follows the record plays as the source files were written.
 *    The odds of ordinary orders are never moved: political and moral decisions were not shaped by the shipping programme.
 */
import { clampMeter } from "./logic";

type Flags = Record<string, any>;
type Meters = { manpower: number; fuel: number; initiative: number };

// ---------- The year's new strength ----------
export const RECOVERY_BELOW = -5;
export const RECOVERY_POINTS = 2;
const ARREARS: Record<string, string> = { manpower: "arrearsManpower", fuel: "arrearsFuel" };
/** The flag that holds the last year whose new strength has been counted. */
export const YEAR_FLAG = "yearCounted";

/** The year a report's date names first ("JUNE 1942" 1942, "1943 – 1944" 1943), or null. */
export function reportYear(date: string | null | undefined): number | null {
  const m = String(date || "").match(/19\d{2}/);
  return m ? Number(m[0]) : null;
}

/**
 * The year's new strength, on arriving at a report dated `year` from one dated `prevYear` (the first time, when no year is on file yet). A later
 * year than the last one counted restores the meters that stand at RECOVERY_BELOW or lower. Returns the flags and meters after it, and what was restored (for the briefing's line).
 */
export function yearTurn(flags: Flags, meters: Meters, year: number | null, prevYear: number | null = null): { flags: Flags; meters: Meters; restored: { manpower: number; fuel: number } | null } {
  if (year == null) return { flags, meters, restored: null };
  const last = Number(flags[YEAR_FLAG]) || prevYear || 0;
  if (last && year <= last) return { flags: flags[YEAR_FLAG] ? flags : { ...flags, [YEAR_FLAG]: last }, meters, restored: null };
  let f: Flags = { ...flags, [YEAR_FLAG]: year };
  if (!last) return { flags: f, meters, restored: null };
  const m = { ...meters };
  const restored = { manpower: 0, fuel: 0 };
  for (const k of ["manpower", "fuel"] as const) {
    if (m[k] > RECOVERY_BELOW) continue;
    let gain = RECOVERY_POINTS;
    const owed = Number(f[ARREARS[k]]) || 0;
    if (owed > 0) {
      const pay = Math.min(owed, gain);
      gain -= pay;
      f = { ...f, [ARREARS[k]]: owed - pay };
    }
    const before = m[k];
    m[k] = clampMeter(m[k] + gain);
    restored[k] = m[k] - before;
  }
  if (!restored.manpower && !restored.fuel) return { flags: f, meters: m, restored: null };
  f = { ...f, [`yearRestored_${year}`]: `${restored.manpower},${restored.fuel}` };
  return { flags: f, meters: m, restored };
}

/** What the year's new strength restored in `year`, for the briefing ({ manpower, fuel }), or null. */
export function restoredIn(flags: Flags, year: number | null): { manpower: number; fuel: number } | null {
  const v = year != null ? flags[`yearRestored_${year}`] : null;
  if (!v) return null;
  const [manpower, fuel] = String(v).split(",").map(Number);
  return manpower || fuel ? { manpower, fuel } : null;
}

// ---------- The allocation of effort ----------
export interface EffortPlan {
  /** The years allocated, in order. */
  years: readonly number[];
  /** The three shares, from the first claim first to the second claim first; the middle one is an even hand. */
  options: readonly [string, string, string];
  /** The two claims. For "time", the first is this year's battles and the second next year's. */
  sides: readonly [string, string];
  kind: "theatre" | "time";
  /** The record's share in each year. */
  record: Record<number, string>;
  /** The flag prefix (the American command keeps the one its saves already use). */
  flag: string;
  /** A flag that must be set before the first allocation (the American file: the war in Europe has opened, part 16). */
  opens?: string;
  /** The war the papers describe must be under way in this file (OKW: Barbarossa launched; IGHQ: the war in the Pacific opened). */
  when?: (flags: Flags) => boolean;
}

export const EFFORT_PLANS: Record<string, EffortPlan> = {
  american: {
    years: [1942, 1943, 1944, 1945],
    options: ["germanyFirst", "even", "pacificFirst"],
    sides: ["europe", "pacific"],
    kind: "theatre",
    // Germany came first in principle in 1942 and 1943 and the Pacific had about as much in fact; from 1944 Overlord had first call.
    record: { 1942: "even", 1943: "even", 1944: "germanyFirst", 1945: "germanyFirst" },
    flag: "usEffort_",
    opens: "trkOpen_E",
  },
  german: {
    years: [1942, 1943, 1944],
    options: ["eastFirst", "even", "westFirst"],
    sides: ["east", "west"],
    kind: "theatre",
    // The East had first call from Barbarossa to Kursk; Directive 51 (November 1943) gave the West priority for 1944. Only in a file whose war
    // in the East began in 1941, as the papers say it did.
    record: { 1942: "eastFirst", 1943: "eastFirst", 1944: "westFirst" },
    flag: "effort_",
    when: (f) => f.barbarossa === "launched" || f.barbarossa === "medFirst",
  },
  japan: {
    years: [1942, 1943, 1944, 1945],
    options: ["armyFirst", "even", "navyFirst"],
    sides: ["army", "navy"],
    kind: "theatre",
    // The navy's year in 1942 (Coral Sea, Midway, the Solomons); the services shared 1943 and 1944 (Ichi-Go and A-Go); the army's homeland
    // defence (Ketsu-Go) came first in 1945.
    record: { 1942: "navyFirst", 1943: "even", 1944: "even", 1945: "armyFirst" },
    flag: "effort_",
    when: (f) => !!f.openingVector,
  },
  soviet: {
    years: [1942, 1943, 1944, 1945],
    options: ["frontFirst", "even", "factoriesFirst"],
    sides: ["now", "later"],
    kind: "time",
    // 1942: the strategic reserve and the production built for Uranus; 1943: Kursk, fought from prepared reserves; 1944: Bagration, everything
    // forward; 1945: Berlin, everything forward.
    record: { 1942: "factoriesFirst", 1943: "even", 1944: "frontFirst", 1945: "frontFirst" },
    flag: "effort_",
  },
};

/** Which claim each Order of Battle draws on, by command and battle (the configuration's id). Battles not listed draw on neither. */
export const BATTLE_SIDES: Record<string, Record<string, string>> = {
  german: { kievPocket41: "east", stalingrad: "east", kharkovBackhand43: "east", kursk: "east", crete41: "west", elAlamein: "west", ardennesWacht44: "west" },
  japan: { guadalcanalNaval42: "navy", shoGo44: "navy", iwoJimaJapan45: "army", okinawaJapan45: "army" },
  american: { midwayAllied42: "pacific", watchtowerAllied42: "pacific", philippineSea44: "pacific", iwoJimaAllied45: "pacific", okinawaAllied45: "pacific", omaha: "europe", bastogne44: "europe" },
};

export const MAX_CHITS = 2;
/** The report where the Joint Chiefs' European shortfall is counted, and the most it costs. */
export const RECKONING: Record<string, { at: string; side: string; max: number }> = { american: { at: "yaltaFeb45", side: "europe", max: 3 } };

export const effortPlan = (command: string | null | undefined): EffortPlan | null => (command && EFFORT_PLANS[command]) || null;
/** The flag that holds a command's allocation for a year. */
export function effortFlag(command: string, year: number): string {
  const p = effortPlan(command);
  return `${p ? p.flag : "effort_"}${year}`;
}

/** The year whose allocation is due before a report dated `year`: an allocated year with no allocation yet (and, for the Joint Chiefs, once
 * the war in Europe has opened). */
export function effortDue(command: string, flags: Flags, year: number | null): number | null {
  const p = effortPlan(command);
  if (!p || year == null || !p.years.includes(year)) return null;
  if (p.opens && !flags[p.opens]) return null;
  if (p.when && !p.when(flags)) return null;
  return flags[effortFlag(command, year)] ? null : year;
}

/** Steps toward the second claim the year's share moved from the record's (negative: toward the first); 0 when unallocated. */
export function deviation(command: string, flags: Flags, year: number): number {
  const p = effortPlan(command);
  if (!p) return 0;
  const chosen = flags[effortFlag(command, year)];
  const record = p.record[year];
  if (!chosen || !record || !p.options.includes(chosen)) return 0;
  return p.options.indexOf(chosen) - p.options.indexOf(record);
}

const clampChits = (n: number) => Math.max(-MAX_CHITS, Math.min(MAX_CHITS, n));

/** The effort chits an Order of Battle in `year` gains (positive) or loses from the allocation, for a battle drawing on `side`. */
export function battleChits(command: string, flags: Flags, side: string | null | undefined, year: number | null): number {
  const p = effortPlan(command);
  if (!p || year == null) return 0;
  const now = deviation(command, flags, year);
  const before = deviation(command, flags, year - 1);
  if (p.kind === "time") return clampChits(-now + before); // toward the factories: fewer now, more next year
  if (!side || !p.sides.includes(side)) return 0;
  const sign = side === p.sides[1] ? 1 : -1;
  return clampChits(sign * (now + before));
}

/** The chits an Order of Battle gets, from its command, its configuration id, the report's year and the flags. */
export function chitsForBattle(command: string, flags: Flags, configId: string, year: number | null): number {
  const p = effortPlan(command);
  if (!p) return 0;
  if (p.kind === "time") return battleChits(command, flags, null, year);
  return battleChits(command, flags, (BATTLE_SIDES[command] || {})[configId], year);
}

/** The Matériel a share costs (negative) or adds when it is chosen. */
export function allocationMateriel(command: string, option: string, year: number): number {
  const p = effortPlan(command);
  if (!p) return 0;
  const d = deviation(command, { [effortFlag(command, year)]: option }, year);
  return p.kind === "time" ? d : -Math.abs(d);
}

/**
 * What a share does, for the paper that offers it. For two theatres: the chits this year's battles on each side start with (counting last year's
 * share). For STAVKA: the chits this year's battles start with, and next year's (counting this share alone). And the Matériel it costs or adds.
 */
export function allocationEffect(command: string, option: string, year: number, flags: Flags = {}): { first: number; second: number; materiel: number } {
  const p = effortPlan(command) as EffortPlan;
  const f = { ...flags, [effortFlag(command, year)]: option };
  if (p.kind === "time") return { first: battleChits(command, f, null, year), second: clampChits(deviation(command, f, year)), materiel: allocationMateriel(command, option, year) };
  return { first: battleChits(command, f, p.sides[0], year), second: battleChits(command, f, p.sides[1], year), materiel: allocationMateriel(command, option, year) };
}

/** The shares of the file and the record's, one row per allocated year, for the end of the war. */
export function allocationRecord(command: string, flags: Flags): { year: number; chosen: string; record: string }[] {
  const p = effortPlan(command);
  if (!p) return [];
  return p.years.filter((y) => flags[effortFlag(command, y)]).map((y) => ({ year: y, chosen: flags[effortFlag(command, y)], record: p.record[y] }));
}

/** The Initiative a command's shortfall costs on arriving at a report (the Joint Chiefs at Yalta), or 0. Counted once (flag reckoned_<id>). */
export function reckoningAt(command: string, flags: Flags, nodeId: string): number {
  const r = RECKONING[command];
  const p = effortPlan(command);
  if (!r || !p || r.at !== String(nodeId) || flags[`reckoned_${nodeId}`]) return 0;
  const toward = r.side === p.sides[1] ? 1 : -1;
  const shortfall = p.years.reduce((a, y) => a + Math.max(0, -toward * deviation(command, flags, y)), 0);
  return -Math.min(r.max, shortfall);
}
