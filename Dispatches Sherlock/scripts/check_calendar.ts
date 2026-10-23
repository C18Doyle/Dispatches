/** Every scene has a date, and a scene that opens with a date in its own text agrees with the calendar table. */
import { def } from "../src/game";
import { SCENE_DATES } from "../src/calendar_dates";

const MONTH: Record<string, number> = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, October: 10, December: 12 };
const re = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),? (\d{1,2}) (January|February|March|April|May|June|October|December)(?: (\d{4}))?/;
let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error("FAIL: " + m);
};
for (const [id, node] of Object.entries(def.content.nodes)) {
  const iso = SCENE_DATES[id];
  if (!iso) {
    fail(`scene ${id} has no date`);
    continue;
  }
  const m = node.description.match(re);
  if (m) {
    const want = `${m[4] ?? "1891"}-${String(MONTH[m[3]]).padStart(2, "0")}-${String(Number(m[2])).padStart(2, "0")}`;
    if (want !== iso) fail(`scene ${id} says ${want} but the calendar says ${iso}`);
    const wd = new Date(Date.UTC(Number(want.slice(0, 4)), Number(want.slice(5, 7)) - 1, Number(want.slice(8, 10)))).getUTCDay();
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (names[wd] !== m[1]) fail(`scene ${id}: ${m[2]} ${m[3]} ${want.slice(0, 4)} was a ${names[wd]}, not a ${m[1]}`);
  }
}
for (const id of Object.keys(SCENE_DATES)) if (!def.content.nodes[id]) fail(`the calendar dates "${id}", which is not a scene`);
if (failures) process.exit(1);
console.log(`Calendar check passed: ${Object.keys(def.content.nodes).length} scenes dated, and every weekday in the text is the right one.`);
