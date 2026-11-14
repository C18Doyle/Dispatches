/**
 * Adviser rivalries (Dispatches WW2). Pairs of advisers who were at odds in the record: following one costs the other half a point of trust on
 * top of the usual rule (logic.ts and logic-pacific.ts, trustAfter), even when the rival did not argue this decision, as long as the rival has
 * been heard in this file. A rival who sat on the decision and was passed over loses a point in all.
 *
 * Every pair is a documented quarrel, named in `why` (shown on the adviser's line). Claims: claims/rivalries-and-effort-round1.json.
 */
export interface Rivalry {
  a: string;
  b: string;
  why: string;
}

export const RIVALRIES: readonly Rivalry[] = [
  // OKW
  { a: "Rommel", b: "Kesselring", why: "Rommel and Kesselring argued over Malta, the supply of North Africa and the defence of Italy." },
  { a: "Guderian", b: "Kluge", why: "Guderian and Kluge quarrelled from 1941; in 1943 Kluge asked Hitler's leave to challenge Guderian to a duel." },
  { a: "Raeder", b: "Göring", why: "Raeder and Göring fought over naval aviation, and over who would carry Sea Lion." },
  // STAVKA
  { a: "Zhukov", b: "Konev", why: "Stalin set Zhukov and Konev racing each other for Berlin." },
  // The British and American files (SHAEF's advisers)
  { a: "Montgomery", b: "Patton", why: "Montgomery and Patton raced each other across Sicily and competed for fuel in 1944." },
  { a: "Montgomery", b: "Bradley", why: "Bradley broke with Montgomery after the Ardennes and refused to serve under him again." },
  { a: "Churchill", b: "Marshall", why: "Churchill wanted the Mediterranean; Marshall wanted France, and argued against every delay." },
  // Comando Supremo
  { a: "Badoglio", b: "Graziani", why: "Badoglio and Graziani were enemies from Libya to the Republic of Salò." },
  { a: "Badoglio", b: "Cavallero", why: "Cavallero replaced Badoglio as Chief of the General Staff after the defeat in Greece." },
  // IGHQ
  { a: "Tojo", b: "Togo", why: "Togo resigned as Foreign Minister in 1942 rather than accept Tojo's Greater East Asia Ministry." },
  { a: "Anami", b: "Yonai", why: "In August 1945 Yonai argued for accepting the Potsdam terms and Anami against." },
  { a: "Sugiyama", b: "Nagano", why: "The army's and the navy's chiefs of staff bargained over every ship, aircraft and ton of steel." },
  // The Joint Chiefs (CINCPAC's advisers)
  { a: "MacArthur", b: "Nimitz", why: "MacArthur and Nimitz each wanted the main effort for his own road to Japan." },
];

/** The rivals of an adviser, by name. */
export function rivalsOf(name: string | null | undefined): Rivalry[] {
  if (!name) return [];
  return RIVALRIES.filter((r) => r.a === name || r.b === name);
}

/** The other adviser in a rivalry. */
export const rivalName = (r: Rivalry, name: string): string => (r.a === name ? r.b : r.a);
