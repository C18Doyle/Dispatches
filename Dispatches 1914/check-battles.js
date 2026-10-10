/** The Orders of Battle (61-battle.jsx, 62-battles.jsx).
 *  Every battle is hosted by a real choice with exactly two contested outcomes; its arms, commanders, approaches and enemy setups are
 *  well formed and written up; and the arithmetic is fair: the staff's own plan plays the record's odds (bonus 0), a plan that reads the
 *  intelligence beats it, a plan that is wrong loses to it, no plan moves the roll more than the clamp, and the roll's weights stay in bounds.
 *  Also: every host choice that carries a `keyBattleSubgame` has a config. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const axes = new Set(E.METER_AXES);
const GRADES = ["clean", "costly", "marginal", "total"];
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;

// hosts named by choices
const hosted = new Map();
for (const { nodeId, node } of E.allNodes()) for (const ch of node.choices || []) if (ch.keyBattleSubgame) hosted.set(ch.keyBattleSubgame.id, `${nodeId}/${ch.id}`);
for (const id of hosted.keys()) if (!E.BATTLES[id]) problems.push(`${hosted.get(id)}: keyBattleSubgame "${id}" has no config in 62-battles.jsx`);

for (const [key, c] of Object.entries(E.BATTLES)) {
  checked++;
  const at = `battle ${key}`;
  if (c.id !== key) problems.push(`${at}: id "${c.id}" does not match its key`);
  const found = E.findNode(c.host && c.host.node);
  const choice = found && (found.node.choices || []).find((x) => x.id === c.host.choice);
  if (!choice) { problems.push(`${at}: host ${JSON.stringify(c.host)} is not a node and choice`); continue; }
  if (!choice.keyBattleSubgame || choice.keyBattleSubgame.id !== key) problems.push(`${at}: the host choice does not carry keyBattleSubgame "${key}"`);
  if (found.campaignId !== c.campaign) problems.push(`${at}: campaign "${c.campaign}" is not the host's (${found.campaignId})`);
  if (!choice.uncertain || choice.uncertain.length !== 2) problems.push(`${at}: the host choice must have exactly two contested outcomes`);
  else if (![0, 1].includes(c.winBranch)) problems.push(`${at}: winBranch must be 0 or 1`);
  for (const f of ["title", "flavor", "conditions"]) if (!c[f] || wc(c[f]) < 4) problems.push(`${at}: no ${f}`);

  const cats = c.categories || [];
  if (cats.length < 3 || cats.length > 5) problems.push(`${at}: ${cats.length} arms (3 to 5)`);
  const ids = new Set(cats.map((k) => k.id));
  if (ids.size !== cats.length) problems.push(`${at}: duplicate arm ids`);
  for (const k of cats) {
    checked++;
    if (!axes.has(k.meter)) problems.push(`${at}/${k.id}: meter "${k.meter}" is not a meter`);
    if (!k.name || !k.context || wc(k.context) < 12) problems.push(`${at}/${k.id}: no name or context`);
    if (!Array.isArray(k.units) || k.units.length < 3) problems.push(`${at}/${k.id}: fewer than three formations listed`);
    if (wc(k.real) < 30) problems.push(`${at}/${k.id}: no account of what happened on the day (${wc(k.real)} words)`);
    if (typeof (c.effectiveness || {})[k.id] !== "number") problems.push(`${at}/${k.id}: no effectiveness`);
  }
  for (const id of Object.keys(c.effectiveness || {})) if (!ids.has(id)) problems.push(`${at}: effectiveness names unknown arm "${id}"`);
  const modsOk = (mods, where) => { for (const id of Object.keys(mods || {})) if (!ids.has(id)) problems.push(`${at}/${where}: modifier names unknown arm "${id}"`); };
  const cmds = c.commanders || [];
  for (const m of cmds) { checked++; if (!ids.has(m.category)) problems.push(`${at}/${m.id}: commander's arm "${m.category}" is unknown`); if (!m.name || !m.role || !m.note) problems.push(`${at}/${m.id}: commander needs a name, role and note`); }
  const apps = c.approaches || [];
  if (apps.length < 2) problems.push(`${at}: fewer than two approaches`);
  for (const a of apps) { modsOk(a.modifiers, a.id); if (!a.name || !a.note) problems.push(`${at}/${a.id}: approach needs a name and a note`); }
  const posts = c.postures || [];
  if (posts.length < 3) problems.push(`${at}: fewer than three enemy setups`);
  const topWeight = Math.max(...posts.map((p) => p.weight || 1));
  if (posts.filter((p) => (p.weight || 1) === topWeight).length !== 1) problems.push(`${at}: the record's setup (the one with the most weight) must be unique`);
  for (const p of posts) { modsOk(p.modifiers, p.id); if (!p.name || wc(p.intel) < 8) problems.push(`${at}/${p.id}: setup needs a name and an intelligence line`); }

  // the echo
  const e = c.echo || {};
  if (!E.findNode(e.node)) problems.push(`${at}: echo node "${e.node}" does not resolve`);
  else if (!choice.uncertain || !choice.uncertain.every((b) => b.next === e.node || !b.next || true)) problems.push(`${at}: echo`);
  for (const g of GRADES) if (wc((e.grade || {})[g]) < 8) problems.push(`${at}: echo has no line for grade "${g}"`);
  for (const id of ids) if (wc((e.neglected || {})[id]) < 4) problems.push(`${at}: echo has no line for a neglected "${id}"`);
  for (const m of cmds) if (wc((e.commander || {})[m.id]) < 4) problems.push(`${at}: echo has no line for commander "${m.id}"`);
  // the host's own next nodes should lead to the echo's node (so the echo is read)
  if (choice.uncertain && !choice.uncertain.some((b) => b.next === e.node)) problems.push(`${at}: no outcome of the host leads to the echo node "${e.node}"`);

  // the arithmetic
  for (const pool of [4, 5, 6, 7, 8]) {
    const staff = E.staffPlanFor(c, pool);
    if (pool >= cats.length && Object.values(staff.allocation).some((n) => n < 1)) problems.push(`${at}: the staff's plan leaves an arm bare at pool ${pool}`);
    const allocs = E.allBattleAllocations(cats, pool);
    for (const p of posts) {
      checked++;
      if (E.battleBonus(c, staff, p, pool) !== 0) problems.push(`${at}: the staff's plan does not play the record's odds under "${p.id}" at pool ${pool}`);
      let best = -99, worst = 99;
      for (const a of allocs) for (const ap of apps) for (const cm of [null, ...cmds]) {
        const b = E.battleBonus(c, { allocation: a, approachId: ap.id, commanderId: cm && cm.id }, p, pool);
        if (Math.abs(b) > E.BATTLE_BONUS_CLAMP) problems.push(`${at}: a bonus of ${b} exceeds the clamp`);
        best = Math.max(best, b); worst = Math.min(worst, b);
      }
      if (pool >= 6 && best < 3) problems.push(`${at}: under "${p.id}" at pool ${pool} the best plan beats the staff's by only ${best} points: the intelligence is worthless`);
      if (pool >= 6 && worst > -5) problems.push(`${at}: under "${p.id}" at pool ${pool} the worst plan loses to the staff's by only ${-worst} points: nothing is at stake`);
    }
  }
  // the weights stay in bounds at the extremes of the bonus
  if (choice.uncertain && choice.uncertain.length === 2) {
    for (const bonus of [-E.BATTLE_BONUS_CLAMP, E.BATTLE_BONUS_CLAMP]) {
      const w = E.shiftToward(choice.uncertain, c.winBranch, bonus).map((b) => b.weight);
      if (w.some((x) => x < E.BATTLE_WEIGHT_BOUNDS[0] || x > E.BATTLE_WEIGHT_BOUNDS[1]) || w[0] + w[1] !== 100) problems.push(`${at}: at a bonus of ${bonus} the weights are ${w.join("/")}`);
    }
  }
  // the pool rule
  const pools = [-10, 0, 10].map((m) => E.battlePoolSize({ manpower: m, munitions: m }));
  if (pools[0] < 4 || pools[2] > 8) problems.push(`${at}: the pool leaves 4 to 8 (${pools.join(", ")})`);
}
process.exit(report("check-battles", problems, checked) ? 1 : 0);
