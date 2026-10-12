// =============================================================================
// THE ADVISERS' TRUST
// =============================================================================
//
// An order that follows an adviser's argument earns that adviser a little trust, and each adviser whose own order was passed over loses a little. Trust
// runs from -3 to +3 and is kept in the file (tr_<id>). It is light on purpose, and it changes what the staff will tell you:
//   * at -2 or below the adviser has gone quiet: their argument is no longer shown on the orders;
//   * at -3 they ask to be relieved (a special event, written from the dossier) and stay gone;
//   * at +3 a trusted adviser brings the file one more check on a belief (68-intel.jsx), once.
// An order's adviser is matched to the command's list of advisers by name (adviserIdFor); an order whose adviser cannot be matched changes no trust.
// =============================================================================

export const TRUST = { min: -3, max: 3, quietAt: -2, goneAt: -3, trustedAt: 3 };

const plain = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();

/** The id of the adviser an order's argument is attributed to, or null: by full name, then by the last or first word of the name. */
export function adviserIdFor(campaignId, name) {
  const c = CAMPAIGNS[campaignId];
  if (!c || !name) return null;
  const n = plain(name);
  const list = c.advisors || [];
  let hit = list.find((a) => plain(a.name) === n || a.id === n.replace(/ /g, ""));
  if (hit) return hit.id;
  const words = n.split(" ");
  hit = list.find((a) => {
    const an = plain(a.name).split(" ");
    return words[words.length - 1] === an[an.length - 1] || a.id === words[words.length - 1] || a.id === words[0] || words[0] === an[0];
  });
  return hit ? hit.id : null;
}

/** An adviser's trust, -3 to +3. */
export function trustOf(flags, id) {
  return Math.max(TRUST.min, Math.min(TRUST.max, Number(flags && flags["tr_" + id]) || 0));
}

/** "gone", "quiet", "trusted" or "normal". */
export function adviserState(flags, id) {
  const t = trustOf(flags, id);
  return t <= TRUST.goneAt ? "gone" : t <= TRUST.quietAt ? "quiet" : t >= TRUST.trustedAt ? "trusted" : "normal";
}

/**
 * The flags after an order is given at a report: +1 for the adviser whose argument was followed, -1 for each other adviser whose own order was passed over,
 * and the check a trusted adviser brings (ix_bonus, once). A gone adviser stays gone.
 */
export function trustAfter(campaignId, nodeId, choice, flags) {
  const camp = CAMPAIGNS[campaignId];
  const node = camp && camp.nodes[nodeId];
  if (!node || !choice) return flags;
  const chosen = adviserIdFor(campaignId, choice.advisor && choice.advisor.name);
  if (!chosen) return flags; // an adviser who cannot be matched changes no trust
  const out = { ...flags };
  const bump = (id, d) => {
    if (!id || out["tr_" + id + "_gone"]) return;
    const before = trustOf(out, id);
    const after = Math.max(TRUST.min, Math.min(TRUST.max, before + d));
    out["tr_" + id] = after;
    if (after <= TRUST.goneAt) out["tr_" + id + "_gone"] = true;
    if (after >= TRUST.trustedAt && !out["tr_" + id + "_bonus"]) {
      out["tr_" + id + "_bonus"] = true;
      out.ix_bonus = (Number(out.ix_bonus) || 0) + 1;
    }
  };
  if (chosen) bump(chosen, 1);
  for (const other of node.choices || []) {
    if (other.id === choice.id) continue;
    const id = adviserIdFor(campaignId, other.advisor && other.advisor.name);
    if (id && id !== chosen) bump(id, -1);
  }
  return out;
}

/** The event that follows an adviser's asking to be relieved: written from the dossier. null unless the adviser has just gone and it has not been shown. */
export function resignationEvent(campaignId, flags, date) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return null;
  for (const a of c.advisors || []) {
    if (flags["tr_" + a.id + "_gone"] && !flags["ev_resign_" + a.id]) {
      const role = a.dossier && a.dossier.role ? a.dossier.role.charAt(0).toLowerCase() + a.dossier.role.slice(1) : "adviser";
      return {
        id: "resign_" + a.id, campaign: campaignId, kind: "The staff",
        date,
        title: a.name + " Asks to Be Relieved",
        paras: [
          a.name + ", " + role + ", has been overruled too often to go on. The request to be relieved is made in writing, and it is granted.",
          "The work of the post is still to be done, and from now on no one in the room says what " + a.name + " would have said.",
        ],
      };
    }
  }
  return null;
}
