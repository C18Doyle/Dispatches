#!/usr/bin/env node
/*
 * split-ussr-zones.mjs
 *
 * Splits the three army-group zones that tools/build_region_geometry.py writes into assets/maps/regions.json
 * (ussrNorth, ussrCenter, ussrSouth) into nine finer ones, so the map can show Leningrad, Belorussia, Central Russia,
 * Ukraine, the Don, the Caucasus and the Soviet rear changing hands separately (docs/specs/eastern-front-subdivision.md).
 *
 * Why a separate step: the Python pipeline needs shapely, which not every machine has, and the new borders are plain
 * straight lines and two real borders, so plain polygon splitting is enough. Run it after build_region_geometry.py:
 *
 *   python tools/build_region_geometry.py && node tools/split-ussr-zones.mjs
 *
 * It refuses to run if the file already holds the finer zones. Nothing outside the three old zones is touched; the old
 * zones' outer outlines are kept vertex for vertex, so no sliver can open up against Poland, the Baltics, Romania,
 * Finland or the coast, and the old North/Center and Center/South border lines stay valid.
 *
 * Method. Each old zone's rings are cut by every line that bounds a new zone (the whole set at once, so that two
 * neighbouring pieces always share exactly the same vertices), the resulting faces are sorted into new zones by a
 * position rule, and each zone's faces are merged by cancelling the edges they share. The two real borders (Belarus-
 * Russia and Ukraine-Russia) are the simplified chains of the vertices that the two countries' outlines share in
 * tools/geo_pipeline/countries.geojson. Everything else is a straight line, listed in buildLines() below with the reason.
 *
 * Usage: node tools/split-ussr-zones.mjs [--check]   (--check writes nothing and prints the landmark and area report)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = process.env.GAME_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..");
const REGIONS_PATH = process.env.REGIONS_PATH || join(ROOT, "assets", "maps", "regions.json");
const COUNTRIES_PATH = join(ROOT, "tools", "geo_pipeline", "countries.geojson");
const OUT_PATH = process.env.OUT_PATH || REGIONS_PATH;
const CHECK_ONLY = process.argv.includes("--check");

const OLD = ["ussrNorth", "ussrCenter", "ussrSouth"];
// New zone ids, in the order they are written, with the old zone each one lies in.
const NEW_ZONES = [
  ["ussrLeningrad", "ussrNorth"],
  ["ussrNorthRear", "ussrNorth"],
  ["ussrBelarus", "ussrCenter"],
  ["ussrMoscow", "ussrCenter"],
  ["ussrUrals", "ussrCenter"],
  ["ussrUkraine", "ussrSouth"],
  ["ussrDon", "ussrSouth"],
  ["ussrCaucasus", "ussrSouth"],
  ["ussrAsia", "ussrSouth"],
];

// ---------------------------------------------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------------------------------------------
const EPS = 1e-7; // every cutting line is shifted this far so that no vertex of the (0.01-degree) rings lies on one

const ringArea = (r) => {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
  return a / 2;
};
const ccw = (r) => (ringArea(r) >= 0 ? r : r.slice().reverse());
const pkey = (p) => p[0] + "," + p[1];

// A cutting line through p and q. value() > 0 on the left of p->q (the "+" side).
function makeLine(p, q) {
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  return {
    p, q, dx: dx / len, dy: dy / len,
    value: (pt) => nx * (pt[0] - p[0]) + ny * (pt[1] - p[1]) - EPS,
    t: (pt) => (pt[0] - p[0]) * (dx / len) + (pt[1] - p[1]) * (dy / len),
  };
}

// The crossing of segment a-b (values va, vb of opposite sign), computed on the endpoints in a fixed order so that
// the two pieces that share the edge get bit-identical points.
function crossing(L, a, b) {
  let A = a, B = b;
  if (a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) { A = b; B = a; }
  const va = L.value(A), vb = L.value(B);
  const s = va / (va - vb);
  return [A[0] + s * (B[0] - A[0]), A[1] + s * (B[1] - A[1])];
}

// Splits one counter-clockwise ring by a line into the rings on its two sides. Returns [{ring, side}].
function splitRing(ring, L) {
  const n = ring.length;
  const val = ring.map((p) => L.value(p));
  const pos = val.map((v) => v > 0);
  if (pos.every(Boolean)) return [{ ring, side: 1 }];
  if (pos.every((x) => !x)) return [{ ring, side: -1 }];
  const nodes = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    nodes.push({ pt: ring[i], side: pos[i] ? 1 : -1, cross: false });
    if (pos[i] !== pos[j]) nodes.push({ pt: crossing(L, ring[i], ring[j]), cross: true });
  }
  const crossings = nodes.filter((nd) => nd.cross);
  crossings.sort((a, b) => L.t(a.pt) - L.t(b.pt));
  crossings.forEach((c, i) => { c.rank = i; });
  // chains: from a crossing, through the vertices of one side, to the next crossing
  const m = nodes.length;
  const first = nodes.findIndex((nd) => nd.cross);
  const chains = [];
  for (let k = 0; k < m; ) {
    const startIdx = (first + k) % m;
    const start = nodes[startIdx];
    const pts = [start.pt];
    let side = 0;
    let len = 1;
    while (true) {
      const nd = nodes[(startIdx + len) % m];
      pts.push(nd.pt);
      if (nd.cross) { chains.push({ start, end: nd, pts, side }); break; }
      side = nd.side;
      len++;
    }
    k += len;
    if (k >= m) break;
  }
  const out = [];
  for (const side of [1, -1]) {
    // directed edges of this side: its chains, and the inside intervals of the cutting line, directed with the side on the left
    const outgoing = new Map(); // start crossing -> edge
    for (const ch of chains) if (ch.side === side) outgoing.set(ch.start, { pts: ch.pts, to: ch.end, kind: "chain" });
    for (let r = 0; r + 1 < crossings.length; r += 2) {
      const lo = crossings[r], hi = crossings[r + 1];
      const from = side === 1 ? lo : hi;
      if (outgoing.has(from)) throw new Error("splitRing: two outgoing edges at one crossing (the ring is not simple, or the line grazes it)");
      if (side === 1) outgoing.set(lo, { pts: [lo.pt, hi.pt], to: hi, kind: "cut" });
      else outgoing.set(hi, { pts: [hi.pt, lo.pt], to: lo, kind: "cut" });
    }
    const used = new Set();
    for (const [startNode, edge0] of outgoing) {
      if (used.has(startNode) || edge0.kind !== "chain") continue;
      const ringPts = [];
      let node = startNode;
      let guard = 0;
      while (!used.has(node) && guard++ < 10000) {
        used.add(node);
        const e = outgoing.get(node);
        if (!e) { ringPts.length = 0; break; }
        for (let i = 0; i < e.pts.length - 1; i++) ringPts.push(e.pts[i]);
        node = e.to;
      }
      if (ringPts.length >= 3) out.push({ ring: ringPts, side });
    }
  }
  return out;
}

function pointInRing(pt, ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
// A point strictly inside a simple ring: the middle of the widest interior interval of a scan line through the middle.
function interiorPoint(ring) {
  const ys = ring.map((p) => p[1]);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  let best = null;
  for (const f of [0.5, 0.37, 0.63, 0.25, 0.75, 0.12, 0.88]) {
    const y = ymin + (ymax - ymin) * f;
    const xs = [];
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if (yi > y !== yj > y) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const w = xs[k + 1] - xs[k];
      if (!best || w > best.w) best = { w, pt: [(xs[k] + xs[k + 1]) / 2, y] };
    }
    if (best && best.w > 0) break;
  }
  return best ? best.pt : ring[0];
}

// Merges counter-clockwise faces into rings by cancelling the edges two faces share.
function mergeFaces(faces) {
  const edges = new Map();
  const add = (a, b) => {
    const k = pkey(a) + "|" + pkey(b), rk = pkey(b) + "|" + pkey(a);
    if (edges.has(rk)) edges.delete(rk);
    else edges.set(k, [a, b]);
  };
  for (const f of faces) for (let i = 0; i < f.length; i++) { const a = f[i], b = f[(i + 1) % f.length]; if (pkey(a) !== pkey(b)) add(a, b); }
  const out = new Map();
  for (const [, [a, b]] of edges) { const k = pkey(a); if (!out.has(k)) out.set(k, []); out.get(k).push({ a, b }); }
  const rings = [];
  const used = new Set();
  for (const [k0, list] of out) {
    for (const e0 of list) {
      const ek0 = pkey(e0.a) + "|" + pkey(e0.b);
      if (used.has(ek0)) continue;
      const ring = [];
      let e = e0;
      let guard = 0;
      while (guard++ < 200000) {
        const ek = pkey(e.a) + "|" + pkey(e.b);
        if (used.has(ek)) break;
        used.add(ek);
        ring.push(e.a);
        const cands = (out.get(pkey(e.b)) || []).filter((c) => !used.has(pkey(c.a) + "|" + pkey(c.b)));
        if (!cands.length) break;
        if (cands.length === 1) e = cands[0];
        else {
          // a pinch point: take the edge that turns furthest to the left of the one just walked, which keeps each ring simple
          const ang = (u, v) => Math.atan2(v[1] - u[1], v[0] - u[0]);
          const inA = ang(e.a, e.b);
          let best = null;
          for (const c of cands) {
            let d = ang(c.a, c.b) - inA;
            while (d <= -Math.PI) d += 2 * Math.PI;
            while (d > Math.PI) d -= 2 * Math.PI;
            if (!best || d > best.d) best = { d, c };
          }
          e = best.c;
        }
        if (pkey(e.a) === pkey(e0.a) && pkey(e.b) === pkey(e0.b)) break;
      }
      if (ring.length >= 3) rings.push(ring);
    }
  }
  return rings;
}

// Douglas-Peucker on an open polyline.
function simplifyLine(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let dmax = 0, idx = 0;
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / len;
    if (d > dmax) { dmax = d; idx = i; }
  }
  if (dmax <= tol) return [a, b];
  return simplifyLine(pts.slice(0, idx + 1), tol).slice(0, -1).concat(simplifyLine(pts.slice(idx), tol));
}

// ---------------------------------------------------------------------------------------------------------------
// The borders. Real ones from the raw outlines, straight ones by hand.
// ---------------------------------------------------------------------------------------------------------------
function sharedChain(gj, nameA, nameB) {
  const get = (n) => gj.features.find((f) => f.properties.name === n);
  const polys = (f) => (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates);
  const keys = new Set();
  for (const poly of polys(get(nameB))) for (const ring of poly) for (const p of ring) keys.add(p[0] + "," + p[1]);
  const ring = polys(get(nameA)).map((p) => p[0]).sort((a, b) => b.length - a.length)[0];
  const n = ring.length - 1;
  const flag = Array.from({ length: n }, (_, i) => keys.has(ring[i][0] + "," + ring[i][1]));
  let best = [];
  for (let s = 0; s < n; s++) {
    if (!flag[s] || flag[(s + n - 1) % n]) continue;
    const run = [];
    for (let j = s; flag[j % n] && run.length < n; j++) run.push(ring[j % n]);
    if (run.length > best.length) best = run;
  }
  return best;
}

// Straight lines are given as [x1, y1, x2, y2]; the "+" side is the left of the direction of travel.
// Every line below is listed with the zones it separates and why it is where it is.
function buildLines(gj) {
  const lines = {};
  // North: Leningrad and Karelia (west) from the northern rear (east). 38E runs between Karelia and Arkhangelsk Oblast;
  // everything east of it (Arkhangelsk, Vologda, Komi, the northern Urals, the Arctic islands) was never a front.
  lines.north = [[38, 40, 38, 90]];
  // Center: the Belarus-Russia border (real: the simplified chain from the Latvian tripoint to the Ukrainian one, with
  // 0.07 degrees of tolerance) cuts Belorussia from Central Russia; 46E is the bend of the Volga, east of which (the east
  // bank at Gorky, Kazan, Kuibyshev, Saratov, the southern Urals) the war never came.
  lines.beltBelarus = simplifyLine(sharedChain(gj, "Belarus", "Russia"), 0.07);
  lines.volga = [[46, 40, 46, 90]];
  // South: the Ukraine-Russia border (real, as above) cuts Ukraine from the Don; 46.3N is the Manych depression, the old
  // line between the Don steppe and the Kuban and the Caucasus; 46.5E keeps the Volga at Stalingrad and Saratov inside
  // the Don zone (the east bank is Soviet rear); 50.8E is the Caspian, east of which lie Mangyshlak and Central Asia; and
  // 36.65E is the Kerch strait, which puts Crimea with Ukraine (the outlines give it to Russia) and the Taman peninsula
  // and the Kuban with the Caucasus.
  lines.beltUkraine = simplifyLine(sharedChain(gj, "Ukraine", "Russia"), 0.07);
  lines.manych = [[20, 46.3, 90, 46.3]];
  lines.volgaSouth = [[46.5, 30, 46.5, 90]];
  lines.caspian = [[50.8, 30, 50.8, 90]];
  lines.kerch = [[36.65, 30, 36.65, 90]];
  return lines;
}

function allCuts(lines) {
  const cuts = { ussrNorth: [], ussrCenter: [], ussrSouth: [] };
  const seg = ([x1, y1, x2, y2]) => makeLine([x1, y1], [x2, y2]);
  cuts.ussrNorth.push(seg(lines.north[0]));
  cuts.ussrCenter.push(seg(lines.volga[0]));
  // Belarus: one cutting line per segment of the border chain, plus the closing line toward Latvia
  const chain = lines.beltBelarus;
  for (let i = 0; i + 1 < chain.length; i++) cuts.ussrCenter.push(makeLine(chain[i], chain[i + 1]));
  cuts.ussrCenter.push(makeLine([26.5, 57.9], chain[0]));
  for (const k of ["manych", "volgaSouth", "caspian", "kerch"]) cuts.ussrSouth.push(seg(lines[k][0]));
  const uchain = lines.beltUkraine;
  for (let i = 0; i + 1 < uchain.length; i++) cuts.ussrSouth.push(makeLine(uchain[i], uchain[i + 1]));
  // the straight edges that close the two cells (they only matter where the old zones reach them)
  cuts.ussrSouth.push(makeLine([uchain[0][0], 40], [uchain[0][0], 60]));
  cuts.ussrSouth.push(makeLine([uchain[uchain.length - 1][0], 30], [uchain[uchain.length - 1][0], 60]));
  cuts.ussrCenter.push(makeLine([chain[chain.length - 1][0], 40], [chain[chain.length - 1][0], 60]));
  return cuts;
}

// The position rules. Each takes a point inside the old zone and says which new zone it belongs to.
function makeRules(lines) {
  // the cell of everything west and south of a chain, closed far outside the zone
  const westOf = (chain, closePts) => closePts.concat(chain.slice().reverse());
  // Belarus: west of the Belarus-Russia border chain, south of the closing line toward Latvia
  const bChain = lines.beltBelarus;
  const belarusCell = [[-30, 40]].concat(
    [[-30, 60], [26.5, 57.9]], bChain, [[bChain[bChain.length - 1][0], 40]]
  );
  const uChain = lines.beltUkraine;
  const ukraineCell = [[-30, 30], [-30, 53], [uChain[0][0], 53]].concat(uChain, [[uChain[uChain.length - 1][0], 30]]);
  return {
    ussrNorth: (p) => (p[0] < 38 ? "ussrLeningrad" : "ussrNorthRear"),
    ussrCenter: (p) => {
      if (p[0] >= 46) return "ussrUrals";
      return pointInRing(p, belarusCell) ? "ussrBelarus" : "ussrMoscow";
    },
    ussrSouth: (p) => {
      const [x, y] = p;
      if (y >= 46.3) {
        if (x >= 46.5) return "ussrAsia";
        return pointInRing(p, ukraineCell) ? "ussrUkraine" : "ussrDon";
      }
      if (x >= 50.8) return "ussrAsia";
      return x < 36.65 ? "ussrUkraine" : "ussrCaucasus";
    },
    _cells: { belarusCell, ukraineCell },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------------------------------------------
const reg = JSON.parse(readFileSync(REGIONS_PATH, "utf8"));
if (reg.ussrLeningrad) {
  console.error("regions.json already holds the finer Eastern Front zones; regenerate it with build_region_geometry.py first.");
  process.exit(CHECK_ONLY ? 0 : 1);
}
const gj = JSON.parse(readFileSync(COUNTRIES_PATH, "utf8"));
const lines = buildLines(gj);
const cuts = allCuts(lines);
const rules = makeRules(lines);

const result = {}; // new zone id -> { faces: [], originalKeys }
for (const [id] of NEW_ZONES) result[id] = [];
const allFaces = []; // {zone, ring, old}
const report = [];
for (const oldId of OLD) {
  const origKeys = new Set();
  let oldArea = 0;
  for (const raw of reg[oldId].rings) {
    const ring0 = ccw(raw.map((p) => [p[0], p[1]]));
    oldArea += Math.abs(ringArea(ring0));
    for (const p of ring0) origKeys.add(pkey(p));
    let pieces = [ring0];
    for (const L of cuts[oldId]) pieces = pieces.flatMap((r) => splitRing(r, L).map((x) => x.ring));
    for (const f of pieces) {
      const zone = rules[oldId](interiorPoint(f));
      result[zone].push(f);
      allFaces.push({ zone, ring: f, old: oldId });
    }
  }
  const sum = allFaces.filter((f) => f.old === oldId).reduce((a, f) => a + Math.abs(ringArea(f.ring)), 0);
  report.push(`${oldId}: area ${oldArea.toFixed(3)} -> faces ${sum.toFixed(3)} (${allFaces.filter((f) => f.old === oldId).length} faces)`);
  result.__orig = result.__orig || new Set();
  for (const k of origKeys) result.__orig.add(k);
}
const origKeys = result.__orig;
delete result.__orig;

// Merge, clean and round
const round2 = (v) => Math.round(v * 100) / 100;
function cleanRing(ring) {
  // drop crossing-created vertices that lie on a straight run, then round to the file's 0.01-degree grid
  let r = ring.slice();
  for (let changed = true; changed; ) {
    changed = false;
    const out = [];
    for (let i = 0; i < r.length; i++) {
      const a = r[(i + r.length - 1) % r.length], b = r[i], c = r[(i + 1) % r.length];
      const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      const isOrig = origKeys.has(pkey(b));
      if (!isOrig && Math.abs(cross) < 1e-9) { changed = true; continue; }
      out.push(b);
    }
    r = out;
    if (r.length < 3) break;
  }
  const rounded = r.map((p) => [round2(p[0]), round2(p[1])]);
  return rounded.filter((p, i) => i === 0 || p[0] !== rounded[i - 1][0] || p[1] !== rounded[i - 1][1]);
}
const zonesOut = {};
const zoneReport = [];
for (const [id] of NEW_ZONES) {
  const rings = mergeFaces(result[id]);
  const cleaned = rings.map(cleanRing).filter((r) => r.length >= 3 && Math.abs(ringArea(r)) > 1e-6);
  const area = cleaned.reduce((a, r) => a + Math.abs(ringArea(r)), 0);
  zonesOut[id] = cleaned.sort((a, b) => Math.abs(ringArea(b)) - Math.abs(ringArea(a))).map((r) => r.slice().reverse());
  zoneReport.push(`${id}: ${cleaned.length} ring(s), area ${area.toFixed(3)}, faces ${result[id].length}`);
}

// Label point: the interior point furthest from the outline, searched on a grid inside the largest ring. The rear zones
// reach 80E, far beyond every campaign frame (src/parts/30-warroom-and-maps.jsx, CAMPAIGN_MAP_BBOX: the Soviet frame
// ends at 62E, the German at 55E), so their labels are searched in a window of longitudes where they read well: inside
// the German frame (a label centred west of about 51E is whole there) for Northern Russia and Volga & Urals, and for
// Central Asia between 56.9E and 58.5E: the German frame does not draw that at all (a label past 820 px is skipped,
// rather than drawn cut in half) and the Soviet frame, which ends at 62E, shows it whole.
const LABEL_WINDOW = { ussrNorthRear: [44, 48], ussrUrals: [48, 51], ussrAsia: [56.9, 58.5] };
let labelWindow = [-180, 180];
function distToRing(pt, ring) {
  let d = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, ay] = ring[j], [bx, by] = ring[i];
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((pt[0] - ax) * dx + (pt[1] - ay) * dy) / (dx * dx + dy * dy || 1)));
    d = Math.min(d, Math.hypot(pt[0] - (ax + t * dx), pt[1] - (ay + t * dy)));
  }
  return d;
}
function labelPoint(rings, id) {
  labelWindow = LABEL_WINDOW[id] || [-180, 57];
  const main = rings[0];
  const xs = main.map((p) => p[0]), ys = main.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const lo = Math.max(x0, labelWindow[0]), hi = Math.min(x1, labelWindow[1]);
  const step = Math.max((hi - lo) / 60, (y1 - y0) / 60, 0.02);
  let best = null;
  for (let x = lo; x <= hi; x += step) for (let y = y0; y <= y1; y += step) {
    if (!pointInRing([x, y], main)) continue;
    const d = distToRing([x, y], main);
    if (!best || d > best.d) best = { d, p: [x, y] };
  }
  return best ? [round2(best.p[0]), round2(best.p[1])] : [round2(main[0][0]), round2(main[0][1])];
}

// Checks against named places
const places = {
  Leningrad: [30.31, 59.94, "ussrLeningrad"], Murmansk: [33.08, 68.97, "ussrLeningrad"], Petrozavodsk: [34.35, 61.78, "ussrLeningrad"],
  Pskov: [28.33, 57.82, "ussrLeningrad"], Novgorod: [31.27, 58.52, "ussrLeningrad"], Arkhangelsk: [40.54, 64.54, "ussrNorthRear"], Vologda: [39.89, 59.22, "ussrNorthRear"],
  Minsk: [27.57, 53.9, "ussrBelarus"], Vitebsk: [30.2, 55.19, "ussrBelarus"], Gomel: [30.98, 52.43, "ussrBelarus"], Mogilev: [30.34, 53.9, "ussrBelarus"], Bobruisk: [29.23, 53.14, "ussrBelarus"],
  Smolensk: [32.04, 54.78, "ussrMoscow"], Bryansk: [34.37, 53.25, "ussrMoscow"], Orel: [36.08, 52.97, "ussrMoscow"], Moscow: [37.62, 55.75, "ussrMoscow"], Tula: [37.62, 54.19, "ussrMoscow"],
  Kalinin: [35.92, 56.86, "ussrMoscow"], Rzhev: [34.33, 56.26, "ussrMoscow"], Vyazma: [34.29, 55.21, "ussrMoscow"], Velikiye_Luki: [30.54, 56.34, "ussrMoscow"], Voronezh: [39.2, 51.67, "ussrMoscow"],
  Gorky: [44.0, 56.33, "ussrMoscow"], Kazan: [49.12, 55.79, "ussrUrals"], Kuybyshev: [50.15, 53.2, "ussrUrals"], Saratov: [46.03, 51.53, "ussrUrals"], Ufa: [55.97, 54.74, "ussrUrals"], Chelyabinsk: [61.4, 55.15, "ussrUrals"], Magnitogorsk: [58.98, 53.41, "ussrUrals"],
  Sverdlovsk: [60.6, 56.84, "ussrNorthRear"], Perm: [56.25, 58.01, "ussrNorthRear"],
  Kiev: [30.52, 50.45, "ussrUkraine"], Kharkov: [36.23, 49.99, "ussrUkraine"], Odessa: [30.73, 46.48, "ussrUkraine"], Dnepropetrovsk: [35.05, 48.46, "ussrUkraine"],
  Stalino: [37.8, 48.0, "ussrUkraine"], Sevastopol: [33.53, 44.6, "ussrUkraine"], Kerch: [36.47, 45.35, "ussrUkraine"], Poltava: [34.55, 49.59, "ussrUkraine"], Kishinev: [28.86, 47.01, "ussrUkraine"],
  Kursk: [36.19, 51.73, "ussrDon"], Belgorod: [36.59, 50.6, "ussrDon"], Rostov: [39.72, 47.23, "ussrDon"], Stalingrad: [44.5, 48.71, "ussrDon"], Taganrog: [38.93, 47.21, "ussrDon"],
  Krasnodar: [38.98, 45.04, "ussrCaucasus"], Maikop: [40.1, 44.61, "ussrCaucasus"], Novorossiysk: [37.77, 44.72, "ussrCaucasus"], Grozny: [45.69, 43.32, "ussrCaucasus"], Mozdok: [44.65, 43.75, "ussrCaucasus"],
  Tbilisi: [44.79, 41.72, "ussrCaucasus"], Baku: [49.87, 40.41, "ussrCaucasus"], Stavropol: [41.97, 45.04, "ussrCaucasus"],
  Astrakhan: [48.04, 46.35, "ussrAsia"], Tashkent: [69.24, 41.3, "ussrAsia"], Alma_Ata: [76.89, 43.24, "ussrAsia"],
};
const ringsOf = (id) => zonesOut[id];
const inZone = (id, pt) => ringsOf(id).some((r) => pointInRing(pt, r));
let bad = 0;
const placeReport = [];
for (const [name, [x, y, want]] of Object.entries(places)) {
  const got = NEW_ZONES.map(([id]) => id).filter((id) => inZone(id, [x, y]));
  const ok = got.length === 1 && got[0] === want;
  if (!ok) { bad++; placeReport.push(`  MISMATCH ${name} (${x}, ${y}): expected ${want}, in [${got.join(", ")}]`); }
}
console.log(report.join("\n"));
console.log(zoneReport.join("\n"));
const totalOld = OLD.reduce((a, id) => a + reg[id].rings.reduce((s, r) => s + Math.abs(ringArea(r)), 0), 0);
const totalNew = NEW_ZONES.reduce((a, [id]) => a + zonesOut[id].reduce((s, r) => s + Math.abs(ringArea(r)), 0), 0);
console.log(`area old ${totalOld.toFixed(3)} new ${totalNew.toFixed(3)} (difference ${(totalNew - totalOld).toFixed(4)})`);
console.log(`landmarks: ${Object.keys(places).length - bad} of ${Object.keys(places).length} in the expected zone`);
if (placeReport.length) console.log(placeReport.join("\n"));

// Borders between the new zones inside each old zone: the edges two faces of different zones share
const faceEdges = new Map(); // undirected key -> [{zone, a, b}]
for (const f of allFaces) {
  for (let i = 0; i < f.ring.length; i++) {
    const a = f.ring[i], b = f.ring[(i + 1) % f.ring.length];
    if (pkey(a) === pkey(b)) continue;
    const k = [pkey(a), pkey(b)].sort().join("|");
    if (!faceEdges.has(k)) faceEdges.set(k, []);
    faceEdges.get(k).push({ zone: f.zone, a, b });
  }
}
const borderSegs = [];
for (const [, list] of faceEdges) {
  if (list.length === 2 && list[0].zone !== list[1].zone) borderSegs.push([list[0].a, list[0].b]);
}
// chain segments into polylines
function chainSegments(segs) {
  const byEnd = new Map();
  const add = (k, s) => { if (!byEnd.has(k)) byEnd.set(k, []); byEnd.get(k).push(s); };
  segs.forEach((s) => { s.used = false; add(pkey(s[0]), s); add(pkey(s[1]), s); });
  const lines = [];
  for (const s of segs) {
    if (s.used) continue;
    s.used = true;
    let line = [s[0], s[1]];
    for (const dir of ["end", "start"]) {
      for (;;) {
        const tip = dir === "end" ? line[line.length - 1] : line[0];
        const nxt = (byEnd.get(pkey(tip)) || []).filter((c) => !c.used);
        if (nxt.length !== 1) break; // stop at a junction or an end
        const c = nxt[0];
        c.used = true;
        const other = pkey(c[0]) === pkey(tip) ? c[1] : c[0];
        if (dir === "end") line.push(other);
        else line.unshift(other);
      }
    }
    lines.push(line);
  }
  return lines;
}
const rawBorders = chainSegments(borderSegs);
function cleanLine(line) {
  let r = line.slice();
  for (let changed = true; changed; ) {
    changed = false;
    const out = [r[0]];
    for (let i = 1; i < r.length - 1; i++) {
      const a = out[out.length - 1], b = r[i], c = r[i + 1];
      const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (!origKeys.has(pkey(b)) && Math.abs(cross) < 1e-9) { changed = true; continue; }
      out.push(b);
    }
    out.push(r[r.length - 1]);
    r = out;
  }
  const rounded = r.map((p) => [round2(p[0]), round2(p[1])]);
  return rounded.filter((p, i) => i === 0 || p[0] !== rounded[i - 1][0] || p[1] !== rounded[i - 1][1]);
}
const newBorders = rawBorders.map(cleanLine).filter((l) => l.length >= 2);
console.log(`new border lines: ${newBorders.length} (${newBorders.reduce((a, l) => a + l.length, 0)} points)`);

if (bad) {
  console.error("A landmark is in the wrong zone; nothing was written.");
  process.exit(1);
}
if (CHECK_ONLY) process.exit(0);

// Write: the nine zones where the three stood, the new borders appended to the old ones
const outObj = {};
for (const [k, v] of Object.entries(reg)) {
  if (k === "ussrNorth") for (const [id, old] of NEW_ZONES) { if (old === "ussrNorth") outObj[id] = { rings: zonesOut[id], label: labelPoint(zonesOut[id], id) }; }
  else if (k === "ussrCenter") for (const [id, old] of NEW_ZONES) { if (old === "ussrCenter") outObj[id] = { rings: zonesOut[id], label: labelPoint(zonesOut[id], id) }; }
  else if (k === "ussrSouth") for (const [id, old] of NEW_ZONES) { if (old === "ussrSouth") outObj[id] = { rings: zonesOut[id], label: labelPoint(zonesOut[id], id) }; }
  else if (k === "__interiorBorders__") outObj[k] = v.concat(newBorders);
  else outObj[k] = v;
}
writeFileSync(OUT_PATH, JSON.stringify(outObj));
console.log("wrote", OUT_PATH);
