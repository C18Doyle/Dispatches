// The Strand: three lines of means under the three gauges. Hours is time in hand (slow, patient work spends it; a quick stroke saves it), Hands is the
// people at your disposal (recruiting and trusting add, spending and alienating subtract), and Wires is your reach (a telegram, a file, the press, an
// informant add; secrecy, flight and silence cut it). One code per option, in the option's order: t = Hours, h = Hands, w = Wires, each with its change.
export const STRAND = {
  "1": ["t-1w+1", "h+1w+1", "t-1w-1"],
  "2": ["h+1w+1", "", "t-1", ""],
  "3": ["t-1", "w+1", "w-1"],
  "4": ["h+1w+1", "h+1", "h-1w-1", "t-1h+1"],
  "5": ["h+2", "h+1", "h-1"],
  "6": ["w+1", "w+1", "h+1w+1"],
  "7": ["t+1", "t-1h+1w+1", "t-1w+1"],
  "7B": ["h+1", "t+1", ""],
  "8": ["h+2w+1", "h+1", "h-1w-1"],
  "9": ["t-1w+1", "h+1", "t-1h+1", "t-1w-1", ""],
  "10": ["", "w+1", "", "w+1"],
  "11": ["h+1w+1", "h+1", "t-1", "w-1"],
  X1: ["t-1", "t-1", "w+1"],
  X2: ["t-1", "t-1", "w+1"],
  X3: ["w+1", "", ""],
  "4B": ["t-1", "t-1", "t-1", "t+1"],
  K1: ["t-1", "w+1", "t-1"],
  K2: ["", "", "h+1"],
  K3: ["t-1", "w+1", ""],
  K4: ["w+1", "h+1", "t+1"],
  K5: ["w+1", "t-1", "h+1"],
  K6: ["", "h-1", "h+1"],
  "5B": ["t-1", "w+1", "h+1"],
  "7D": ["", "", ""],
  "9B": ["h+1", "t-1", "w+1"],
  F1: ["h+1w+1", "h+2", "t-1", "w-1"],
  MA: ["t-1", "w+1", "t-1"],
  MB: ["t-1w+1", "h+1", "w+1"],
  FA: ["w+1", "t-1w+1", "t+1"],
  Y1: ["h+1w+1", "t-1", "t+1", "h+1", "h+1"],
  Y2: ["t-1", "h+1", "w+1", "h-1"],
  Y3: ["t+1", "w+1", "h+1", "t-1"],
  Y4: ["h+1w+1", "t-1", "w+1"],
  Y5: ["h+1", "h+1", "w+1"],
  Y6: ["h+1w+1", "w+1", "t-1", "t-1"],
  Y7: ["", "w+1", "", "h-1"],
  Y8: ["h-1", "h+1w-1", "w+1"],
  Y2B: ["w+1", "w+1", "h-1", "w+1"],
  Y5B: ["w+1", "w+1", "t+1"],
  YX1: ["t-1", "t-1", "t-1"],
  YX2: ["t-1", "w+1", "t-1"],
  YX3: ["w+1", "w+1", ""],
  Y7B: ["t-1", "h+1", ""],
  Y9: ["h+1", "h+1", "h-1", "h+1"],
  Y9B: ["h+1", "w+1", "w+1"],
  Y9C: ["", "", "", ""],
  S1: ["h+1", "h+1", "w+1"],
  S2: ["", "h-1", "t-1", "t-1"],
  S3: ["h+1", "t-1", "h-1"],
  S3B: ["t-1", "w+1", "h+1w+1"],
  S4: ["t-1", "h+1", "h-2"],
  S5: ["w+1", "w+1", "w-1", "t-1", "h-1"],
  S5B: ["h+1", "w+1", "w-1"],
  S6: ["w+1", "w+1", "w+1"],
  S6B: ["h+1", "h+1", "h-1"],
  S7: ["w+1", "h+1", "t-1", "t-1"],
  S8: ["h+1", "", "w-1"],
  S8B: ["", "h+1", "w+1", "", "h+1"],
  S8C: ["", "", "", ""],
  C1: ["w-1", "t+1", "h-1", "", "t+1"],
  C2: ["t-1", "", "w+1h+1"],
  C3: ["h+1", "", "h-1", "t-1"],
  C4: ["w+1h+1", "w-1", "t-1w+1"],
  C4B: ["w+1h+1", "h+1", "w-1"],
  C5: ["", "t-1", "w+1", "t-1"],
  C5B: ["w+1", "h+1", ""],
  C6: ["t-1", "t+1", "w+1", "t-1"],
  C6B: ["h+1", "h+1", "w+1"],
  C7: ["h+1", "w+1", "t-1"],
  C7B: ["", "w+1", "t-1", "h+1"],
  C8: ["h+1", "h-1", "h-1w+1", "h+1", "h-1"],
  C9: ["", "", "", ""],
  C10: ["", "", "h+1", "", "w+1", "h+1"],
  H1: ["w-1", "w+1", "w+1h+1"],
  H2: ["", "w+1", "w-1"],
  H3: ["h+1", "w+1", "w-1"],
  H4: ["", "w+1", ""],
  M1: ["h+1w+1t-1", "w+1t-1", "t-1", "t-1"],
  M2: ["w+1t-1", "t-2w+1", "w+1t-1", "h-1"],
  M3: ["w+1", "t+1", "w-1", "t-1"],
  M4: ["h+1t-1", "t-1", "w+1t-1"],
  M5: ["w+1t-1", "t-1", "w+1t-1"],
  M6: ["w+1t-1", "w+1t-1", "t-1", "t-1"],
  M7: ["t-1", "t-1", "w+1t-1", "t-1"],
  M8: ["h-1", "w+1", "", "", "w-1", "w+1"],
  "10W": ["", "", "", ""],
  K7: ["w+1", "w-1"],
  K8: ["w+1", "w+1h-1", "h+1"],
  MX1: ["", "t-1", "w+1"],
  MX2: ["", "t-1", ""],
  MX3: ["w+1", "", ""],
  M6B: ["w+1", "t-1", ""],
};

/** Applies the table to the scene table in place. Fails loudly if a scene's list does not match its options. */
export function applyStrand(nodes) {
  const NAME = { t: "hours", h: "hands", w: "wires" };
  for (const [id, codes] of Object.entries(STRAND)) {
    const node = nodes[id];
    if (!node) throw new Error(`strand table names a missing scene ${id}`);
    if (codes.length > node.options.length) throw new Error(`strand table for ${id} has ${codes.length} codes but the scene has only ${node.options.length} options`);
    node.options.forEach((o, i) => {
      for (const [, k, v] of (codes[i] ?? "").matchAll(/([thw])([+-]\d)/g)) {
        const targets = o.roll ? [o.roll.success.stamps, o.roll.failure.stamps] : [o.stamps];
        for (const st of targets) st[NAME[k]] = (st[NAME[k]] ?? 0) + Number(v);
      }
    });
  }
  // the standalone cases (shelf 0 and ids starting B, R or G) carry their own numbers
  const missing = Object.keys(nodes).filter((id) => !(id in STRAND) && !/^(0|[BRGL]\d|SX\d|CX\d|A[CY]|Y9D|S8D|M9)$/.test(id));
  if (missing.length) console.log("scenes with no strand codes:", missing.join(", "));
}
