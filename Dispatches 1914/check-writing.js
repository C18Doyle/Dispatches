/** The writing, held to a few rules a reader would notice. Every outcome names something (a figure, a place, a person or a unit); the sentence "X is told that" does not turn up
 *  as the way a result is reported (three outcomes at most); an adviser's argument is in that adviser's own voice (it does not speak of the adviser by name), no two arguments
 *  on one report begin with the same three words, and no more than two fifths of the arguments rest on must, has to or cannot. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const NUMBER_WORDS = /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|first|second|third|fourth)\b/i;
const COMMON = /^(The|He|She|It|They|His|Her|Its|Their|Speculative|A|An|In|On|At|By|But|And|When|If|There|This|That|These|Those|No|One|Some|Every|Each|Neither|Both|Whatever|What|Where|While|With|Without|As|After|Before|Because|Once|Instead|Nothing|Nobody|Everything|Most|Many|Few|All|Any|Not|Only|Even|Still|Then|Now|Here|Those|Such|So|Though|Until|Whether)$/;
const strip = (t) => t.replace(/^Speculative\.\s*/, "");
const named = (t) => {
  const body = strip(t);
  if (/\d/.test(body) || NUMBER_WORDS.test(body)) return true;
  const mid = body.replace(/(^|[.!?]\s+)[A-ZÀ-Ý][\wÀ-ÿ'’-]*/g, "$1");
  return (mid.match(/\b[A-ZÀ-Ý][\wÀ-ÿ'’-]+/g) || []).some((w) => !COMMON.test(w));
};
let told = 0, modal = 0, positions = 0;
for (const cid of E.CAMPAIGN_IDS) {
  for (const [nid, node] of Object.entries(E.CAMPAIGNS[cid].nodes)) {
    const openers = {};
    for (const ch of node.choices || []) {
      const outs = [ch.outcome, ...(ch.uncertain || []).map((u) => u.outcome)];
      for (const o of outs) {
        if (typeof o !== "string") continue;
        checked++;
        if (!named(o)) problems.push(`${nid}|${ch.id}: an outcome that names nothing (no figure, place, person or unit)`);
        if (/\bis told (so|that)\b/.test(o)) told++;
      }
      const a = ch.advisor;
      if (a && typeof a.position === "string") {
        checked++;
        positions++;
        const last = a.name.split(" ").filter((w) => w.length > 3).pop();
        if (last && new RegExp("\\b" + last + "\\b").test(a.position)) problems.push(`${nid}|${ch.id}: ${a.name} speaks of himself by name`);
        const three = a.position.split(/\s+/).slice(0, 3).join(" ").toLowerCase();
        if (openers[three]) problems.push(`${nid}: two arguments begin "${three}" (${openers[three]} and ${ch.id})`);
        openers[three] = ch.id;
        if (/\b(must|has to|have to|cannot|needs? to)\b/.test(a.position)) modal++;
      }
    }
  }
}
checked += 2;
if (told > 3) problems.push(`"is told that" reports the result in ${told} outcomes, three at most`);
if (modal / positions > 0.4) problems.push(`${Math.round((modal / positions) * 100)} per cent of the arguments rest on must, has to or cannot; two fifths at most`);
process.exit(report("check-writing", problems, checked) ? 1 : 0);
