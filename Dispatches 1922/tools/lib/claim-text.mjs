// The checkable sentences of every report and adviser dossier: shared by tools/claims-draft.mjs (which logs them) and tools/check-claims.mjs (which fails when a
// logged claim no longer matches the text).
const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const UNIT = /\b(Army|Corps|Division|Regiment|Brigade|Front|Legion|Congress|Conference|Soviet|Committee|Directory|Government|Cabinet|Cossack|Host|battalion|treaty|Treaty|offensive|Offensive|decree|armistice|evacuat\w+)\b/;
const NAME = /(?:[a-z,;] |\(|")[A-Z][a-z]{2,}(?: [A-Z][a-z]{2,})?/; // a capitalised word in the middle of a sentence
const MODELLED = /\b(Speculative|A modeled alternative|modeled|no record|nothing in the record|plausible|would have|might have|could have)\b/i;

export function sentences(text) {
  return String(text || "")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z"'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}
export const checkable = (s) => /\d/.test(s) || MONTH.test(s) || (UNIT.test(s) && NAME.test(s));
export const kindOf = (s) => (/\d/.test(s) && /\b\d[\d,]{2,}\b/.test(s.replace(/\b(1[89]\d\d)\b/g, "")) ? "figure" : "fact");

/** [{ node, where, s }] for one campaign: its reports and endings (resolved with empty flags), then its adviser dossiers (node "dossier:<key>"). */
export function currentClaimText(camp) {
  const meters = Object.fromEntries(camp.triangleAxes.map((a) => [a.key, 0]));
  const out = [];
  const nodeIds = [...camp.NODE_ATLAS.map((a) => a.id), ...(camp.ENDINGS_GALLERY || []).map((e) => e.id)];
  for (const id of nodeIds) {
    const node = camp.resolveNode(id, {}, meters);
    if (!node) continue;
    const add = (where, text) => {
      for (const s of sentences(text)) if (checkable(s) && s.length > 25) out.push({ node: id, where, s });
    };
    if (node.bulletin) {
      add("bulletin", node.bulletin.body);
      for (const [k, v] of Object.entries(node.bulletin.meanwhile || {})) add("meanwhile " + k, v);
    }
    add("background", node.context);
    add("situation", node.situation);
    if (node.epilogue) add("epilogue", node.epilogue);
    const historicalChoice = (node.choices || []).find((c) => c.historical === true);
    if (historicalChoice) {
      add("historical outcome", historicalChoice.outcome);
      add("historical aftermath", historicalChoice.aftermath);
      for (const u of historicalChoice.uncertain || []) if (!MODELLED.test(u.outcome || "")) add("roll: " + (u.title || ""), u.outcome);
    }
  }
  for (const [key, d] of Object.entries(camp.ADVISOR_DOSSIERS || {})) {
    for (const part of ["bio", "fate"]) {
      for (const s of sentences(d[part])) if (checkable(s) && s.length >= 25) out.push({ node: "dossier:" + key, where: "dossier " + part, s });
    }
  }
  return out;
}
