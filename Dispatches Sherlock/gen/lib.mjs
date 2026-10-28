// Authoring helpers. They only build the plain objects that events.json holds; nothing here ships.
export const say = (speaker, text) => ({ speaker, text });

/**
 * One option.
 *   label, detail, who/says (the quotation), outcome, next
 *   stamps {evidence, standing, nerve}, flags [..], axis {heart, company}
 *   gate [resource, min], needFlag [flag, hint], needs [condition, hint], only (showWhen condition)
 *   cost (moneyCost), gain (moneyDelta)
 *   roll { p, scale: [resource, perPoint, min, max], about, ok: {text, stamps, flags, next}, bad: {...} }
 */
export function opt(o) {
  const out = {
    label: o.label,
    detail: o.detail,
    stamps: o.roll ? {} : o.stamps ?? {},
    quote: say(o.who, o.says),
    outcome: o.roll ? "" : o.outcome ?? "",
    nextNodeId: o.next,
  };
  if (o.gate) out.gate = { resource: o.gate[0], minThreshold: o.gate[1] };
  if (o.cost) out.moneyCost = o.cost;
  if (o.gain) out.moneyDelta = o.gain;
  if (o.needFlag) {
    out.requiresFlag = o.needFlag[0];
    out.requiresFlagHint = o.needFlag[1];
  }
  if (o.needs) {
    out.requires = o.needs[0];
    out.requiresHint = o.needs[1];
  }
  if (o.only) out.showWhen = o.only;
  if (!o.roll && o.flags) out.setFlags = o.flags;
  if (o.axis) out.axisDelta = o.axis;
  if (o.roll) {
    const r = o.roll;
    const side = (s) => {
      const x = { outcome: s.text, stamps: s.stamps ?? {} };
      if (s.flags) x.setFlags = s.flags;
      if (s.next) x.nextNodeId = s.next;
      return x;
    };
    out.roll = { chance: r.p };
    if (r.scale) {
      out.roll.scaling = { resource: r.scale[0], perPoint: r.scale[1] };
      if (r.scale[2] !== undefined) out.roll.scaling.min = r.scale[2];
      if (r.scale[3] !== undefined) out.roll.scaling.max = r.scale[3];
    }
    if (r.about) out.roll.about = r.about;
    out.roll.success = side(r.ok);
    out.roll.failure = side(r.bad);
  }
  return out;
}

export function node(id, branch, title, description, options, echoes) {
  const n = { id, branch, title, description, options };
  if (echoes?.length) n.echoes = echoes.map(([when, text]) => ({ when, text }));
  return n;
}

export const flag = (f) => ({ flag: f });
export const res = (resource, op, value) => ({ resource, op, value });
export const all = (...c) => ({ all: c });
export const any = (...c) => ({ any: c });
export const not = (c) => ({ not: c });
