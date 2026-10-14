/** Every scene has a place on the sketch map, every place is real, and the map the scene is on is one the map can draw. */
import { def } from "../src/game";
import { PLACES, SCENE_PLACE } from "../src/map";

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error("FAIL: " + m);
};
for (const id of Object.keys(def.content.nodes)) {
  const p = SCENE_PLACE[id];
  if (!p) fail(`scene ${id} has no place on the map`);
  else if (!PLACES[p]) fail(`scene ${id} is at "${p}", which is not a place`);
}
for (const id of Object.keys(SCENE_PLACE)) if (!def.content.nodes[id]) fail(`the map places "${id}", which is not a scene`);
for (const [id, p] of Object.entries(PLACES)) {
  const [w, h] = p.map === "london" ? [200, 120] : [240, 160];
  if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) fail(`place ${id} is off its map`);
}
const sceneTotal = Object.keys(def.content.nodes).length;
if (failures) process.exit(1);
console.log(`Map check passed: ${sceneTotal} scenes placed on ${Object.keys(PLACES).length} places.`);
