// The Return (The Empty House, April 1894): the second major case on the shelf. Plan: PLAN_SECOND_CASE.md. Scenes E1 to E23 in three files,
// and the endings, cards and flavour with the last.
import { returnAct1 } from "./return1.mjs";
import { returnYard, returnStreet, returnQuiet } from "./return2.mjs";
import { returnAct3, returnEndings, returnInterludes, returnTriggers, returnFlavor } from "./return3.mjs";

export const returnNodes = [...returnAct1, ...returnYard, ...returnStreet, ...returnQuiet, ...returnAct3];
export { returnEndings, returnInterludes, returnTriggers, returnFlavor };
