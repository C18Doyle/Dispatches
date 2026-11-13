// The Professor (January to March 1887): the fourth major case on the shelf, set before them all. Plan: PLAN_THIRD_CASE.md. Scenes P1 to P23 in three files,
// the endings, cards and flavour with the last.
import { profAct1 } from "./prof1.mjs";
import { profAct2 } from "./prof2.mjs";
import { profAct3, profEndings, profInterludes, profTriggers, profFlavor } from "./prof3.mjs";

export const profNodes = [...profAct1, ...profAct2, ...profAct3];
export { profEndings, profInterludes, profTriggers, profFlavor };
