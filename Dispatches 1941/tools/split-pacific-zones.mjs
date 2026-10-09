#!/usr/bin/env node
/*
 * split-pacific-zones.mjs
 *
 * Splits three of the regions that tools/build_pacific_map_geometry.py writes into assets/maps/pacific-regions.json, so the map can show
 * the war on a finer grain than one blob each:
 *
 *   china        -> manchuria, northChina, eastChina, southChina, hunanGuangxi, freeChina, yanan, farWest
 *   indies       -> sumatra, java, borneo, celebes, eastIndies
 *   philippines  -> luzon, visayas, mindanao
 *
 * (The Manchuria pin is replaced by the polygon of the same id.) Run it after the Python script, which writes the three unsplit regions:
 *
 *   python tools/build_pacific_map_geometry.py && node tools/split-pacific-zones.mjs
 *
 * It refuses to run on a file that is already split. Nothing outside the three old regions is touched. The borders are straight lines in
 * longitude and latitude, chosen as the nearest straight line to the province or front line they stand for (the reasons are in ZONES
 * below): the map is schematic at this grain and says so. The dates on which each zone changes hands are in MAP_TIMELINE
 * (src/parts/30-screens.jsx), with sources in claims/map-dates-round1.json.
 *
 * Method. Each old region's rings are converted to longitude/latitude and carved zone by zone: a zone is the union of one or more convex
 * polygons, each carved out of what is left by splitting every ring along each edge of the polygon in turn. A crossing is computed on its
 * two end points in a fixed order, so the two pieces that share a cut get bit-identical vertices and no sliver opens between zones. The
 * pieces of one zone are merged by cancelling the edges they share. What is left after the last carve is the last zone.
 *
 * Usage: node tools/split-pacific-zones.mjs [--check]   (--check writes nothing and prints the landmark and area report)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PATH = process.env.REGIONS_PATH || join(ROOT, "assets", "maps", "pacific-regions.json");
const CHECK_ONLY = process.argv.includes("--check");

// ---------------------------------------------------------------------------------------------------------------------------
// The zones. Each: id, the old region it is cut from, the convex polygons whose union it is ([lon, lat], counter-clockwise, drawn
// well beyond the coast so only the cut lines matter), or null for "whatever is left of the old region".
// ---------------------------------------------------------------------------------------------------------------------------
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const ZONES = [
  // ---- China. Order matters: each zone is carved from what the earlier ones left.
  // Manchukuo: north and east of a line from the Great Wall at Shanhaiguan to the Hulunbuir salient; the west edge is the Mongolian
  // border (x=115 lies well outside it); the south edge is the sea. Rehe (Chengde) is inside, as it was from 1933; Beijing and
  // Tangshan are outside.
  { id: "manchuria", from: "china", polys: [[[121.0, 38.0], [145, 38.0], [145, 60], [115.0, 60], [115.0, 41.0]]] },
  // The far west: Xinjiang, Tibet, Qinghai and Xikang, west of 102E and north of 28.2N. Never a front, no Japanese presence, not under
  // Chongqing's day-to-day control.
  { id: "farWest", from: "china", polys: [rect(60, 28.2, 102.0, 60)] },
  // The Shaanxi-Gansu-Ningxia Border Region, the Communist base around Yan'an (Suide to Qingyang, the Yellow River to the Gansu hills).
  { id: "yanan", from: "china", polys: [rect(107.0, 35.2, 110.9, 37.8)] },
  // Guangdong: Canton fell in October 1938. Hainan and the Leizhou peninsula are two more pieces; 111.3E is the Guangxi border, 25.2N
  // the Nanling mountains, 117.2E the Fujian border.
  { id: "southChina", from: "china", polys: [rect(111.3, 15, 117.2, 25.2), rect(108.0, 17.5, 111.3, 20.5), rect(109.9, 20.5, 111.3, 25.2)] },
  // Hunan and Guangxi: the ground of Ichi-Go in 1944 (Changsha, Hengyang, Guilin, Liuzhou, Nanning). Free China until April 1944.
  { id: "hunanGuangxi", from: "china", polys: [rect(107.8, 21.0, 114.3, 30.2), rect(105.8, 21.0, 107.8, 25.4)] },
  // East China: the lower and middle Yangtze, Zhejiang, Jiangxi and Fujian, south of the Longhai railway (34N, Xuzhou stays north)
  // and east of 114.3E (112.6E north of 30.2N, so Wuhan is inside and Yichang and Xiangyang are not).
  { id: "eastChina", from: "china", polys: [rect(114.3, 21.0, 125, 34.0), rect(112.6, 30.2, 114.3, 34.0)] },
  // North China: Hebei, Shandong, Shanxi, Henan north of 34N, and the Inner Mongolia of the Japanese-backed Mengjiang government.
  { id: "northChina", from: "china", polys: [rect(110.9, 34.0, 125, 55), rect(107.0, 37.8, 110.9, 55)] },
  // Everything left: Chongqing's China (Sichuan, Yunnan, Guizhou, southern Shaanxi, Gansu, western Hubei, Alxa).
  { id: "freeChina", from: "china", polys: null },

  // ---- The Dutch East Indies.
  // Java, Madura and Bali: south of 5.97S (Lampung's tip is at 5.93S) plus the Java Sea islands east of the Sunda Strait; 115.8E is the
  // Lombok Strait, the start of the Lesser Sundas.
  { id: "java", from: "indies", polys: [rect(104, -12, 115.8, -5.97), rect(105.87, -5.97, 115.8, -5.0)] },
  // Sumatra with Bangka, Belitung, Riau and the Natunas: west of 108.5E.
  { id: "sumatra", from: "indies", polys: [rect(90, -7, 108.5, 12)] },
  // Kalimantan: 108.5E to the Makassar Strait (118.4E).
  { id: "borneo", from: "indies", polys: [rect(108.5, -5.0, 118.4, 8)] },
  // Sulawesi with Sangihe, Talaud, Buton and the Tukang Besi islands: 118.4E to 126.2E, north of 7S.
  { id: "celebes", from: "indies", polys: [rect(118.4, -7.0, 126.2, 6.5)] },
  // The Moluccas, the Lesser Sundas, Timor and Dutch New Guinea.
  { id: "eastIndies", from: "indies", polys: null },

  // ---- The Philippines.
  // Luzon with Mindoro, Marinduque and the Bicol peninsula: north of a line from 11.7N at 116E to 13.0N at 128E, which keeps Samar and
  // Masbate with the Visayas.
  { id: "luzon", from: "philippines", polys: [[[116.0, 11.7], [128.0, 13.0], [128.0, 25], [116.0, 25]]] },
  // Mindanao with the Sulu archipelago: south of a line from 8.3N at 121E to 9.9N at 127.5E (Cebu, Negros, Bohol and Siquijor stay with
  // the Visayas), east of 121E, and the Sulu and Tawi-Tawi islands west of it.
  { id: "mindanao", from: "philippines", polys: [[[121.0, 8.3], [121.0, 2.0], [127.5, 2.0], [127.5, 9.9]], rect(119.0, 3.0, 121.0, 7.3)] },
  // Everything left: Panay, Negros, Cebu, Bohol, Leyte, Samar, Masbate and Palawan.
  { id: "visayas", from: "philippines", polys: null },
];

// Places that must land in a given zone (the report fails otherwise). Longitude, latitude.
const LANDMARKS = {
  manchuria: [["Harbin", 126.6, 45.8], ["Shenyang", 123.4, 41.8], ["Changchun", 125.3, 43.9], ["Dalian", 121.6, 38.9], ["Chengde", 117.9, 41.0], ["Qiqihar", 123.9, 47.35], ["Hailar", 119.7, 49.2]],
  northChina: [["Beijing", 116.4, 39.9], ["Tianjin", 117.2, 39.1], ["Taiyuan", 112.55, 37.9], ["Jinan", 117.0, 36.65], ["Qingdao", 120.4, 36.1], ["Zhengzhou", 113.6, 34.75], ["Baotou", 110.0, 40.65], ["Hohhot", 111.7, 40.8], ["Shijiazhuang", 114.5, 38.0], ["Xuzhou", 117.2, 34.27], ["Luoyang", 112.45, 34.65]],
  eastChina: [["Shanghai", 121.5, 31.2], ["Nanjing", 118.8, 32.05], ["Hangzhou", 120.2, 30.3], ["Wuhan", 114.3, 30.6], ["Nanchang", 115.9, 28.7], ["Fuzhou", 119.3, 26.1], ["Xiamen", 118.1, 24.5], ["Hefei", 117.3, 31.85]],
  southChina: [["Guangzhou", 113.3, 23.1], ["Hong Kong", 114.2, 22.3], ["Shantou", 116.7, 23.35], ["Haikou", 110.35, 20.0], ["Zhanjiang", 110.4, 21.2], ["Shaoguan", 113.6, 24.8]],
  hunanGuangxi: [["Changsha", 113.0, 28.2], ["Hengyang", 112.6, 26.9], ["Guilin", 110.3, 25.3], ["Liuzhou", 109.4, 24.3], ["Nanning", 108.35, 22.8], ["Baise", 106.6, 23.9]],
  freeChina: [["Chongqing", 106.55, 29.55], ["Chengdu", 104.07, 30.67], ["Kunming", 102.7, 25.0], ["Guiyang", 106.7, 26.6], ["Xi'an", 108.95, 34.3], ["Hanzhong", 107.0, 33.1], ["Lanzhou", 103.8, 36.05], ["Yichang", 111.3, 30.7], ["Xiangyang", 112.1, 32.0], ["Yinchuan", 106.2, 38.5]],
  yanan: [["Yan'an", 109.5, 36.6], ["Suide", 110.2, 37.5], ["Qingyang", 107.6, 35.7]],
  farWest: [["Lhasa", 91.1, 29.65], ["Urumqi", 87.6, 43.8], ["Kashgar", 76.0, 39.5], ["Xining", 101.8, 36.6], ["Dunhuang", 94.7, 40.1], ["Chamdo", 97.2, 31.1]],
  sumatra: [["Medan", 98.7, 3.6], ["Palembang", 104.75, -2.95], ["Padang", 100.35, -0.95], ["Lampung", 105.25, -5.4], ["Pangkal Pinang", 106.1, -2.1]],
  java: [["Batavia", 106.8, -6.2], ["Surabaya", 112.75, -7.25], ["Bandung", 107.6, -6.9], ["Yogyakarta", 110.4, -7.8], ["Denpasar", 115.2, -8.65]],
  borneo: [["Balikpapan", 116.8, -1.25], ["Tarakan", 117.6, 3.3], ["Pontianak", 109.3, 0.0], ["Banjarmasin", 114.6, -3.3], ["Samarinda", 117.15, -0.5]],
  celebes: [["Manado", 124.85, 1.5], ["Makassar", 119.4, -5.15], ["Kendari", 122.5, -3.95], ["Palu", 119.9, -0.9]],
  eastIndies: [["Ambon", 128.2, -3.7], ["Kupang", 123.6, -10.2], ["Ternate", 127.4, 0.8], ["Jayapura", 140.7, -2.55], ["Biak", 136.1, -1.2], ["Sorong", 131.25, -0.9], ["Mataram", 116.1, -8.6], ["Merauke", 140.4, -8.5]],
  luzon: [["Manila", 120.98, 14.6], ["Baguio", 120.6, 16.4], ["Legazpi", 123.7, 13.15], ["Calapan", 121.2, 13.4], ["Aparri", 121.6, 18.35]],
  visayas: [["Cebu", 123.9, 10.3], ["Iloilo", 122.55, 10.7], ["Tacloban", 125.0, 11.25], ["Bacolod", 122.95, 10.65], ["Puerto Princesa", 118.7, 9.75], ["Dumaguete", 123.3, 9.3], ["Catbalogan", 124.9, 11.8]],
  mindanao: [["Davao", 125.6, 7.1], ["Zamboanga", 122.1, 6.9], ["Cagayan de Oro", 124.65, 8.45], ["Jolo", 121.0, 6.05], ["Cotabato", 124.25, 7.2], ["Tawi-Tawi", 119.95, 5.05]],
};

// ---------------------------------------------------------------------------------------------------------------------------
// Geometry helpers (the cutting method of tools/split-ussr-zones.mjs in Dispatches 1940, which this follows)
// ---------------------------------------------------------------------------------------------------------------------------
const EPS = 1e-7;
const ringArea = (r) => {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
  return a / 2;
};
const ccw = (r) => (ringArea(r) >= 0 ? r : r.slice().reverse());
const pkey = (p) => p[0] + "," + p[1];

function makeLine(p, q) {
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  return {
    value: (pt) => nx * (pt[0] - p[0]) + ny * (pt[1] - p[1]) - EPS,
    t: (pt) => (pt[0] - p[0]) * (dx / len) + (pt[1] - p[1]) * (dy / len),
  };
}
function crossing(L, a, b) {
  let A = a, B = b;
  if (a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) { A = b; B = a; }
  const va = L.value(A), vb = L.value(B);
  const s = va / (va - vb);
  return [A[0] + s * (B[0] - A[0]), A[1] + s * (B[1] - A[1])];
}
// Splits one counter-clockwise ring by a line into the rings on its two sides: [{ring, side}], side 1 being the left of the line.
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
    const outgoing = new Map();
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

// Carves one convex polygon (counter-clockwise) out of a list of rings: { inside, outside }.
function carve(rings, poly) {
  // zero-area slivers (a ring squeezed to a line by an earlier cut) have no inside to split and only confuse the crossing walk
  const solid = (r) => r.length >= 3 && Math.abs(ringArea(r)) > 1e-9;
  let inside = rings.filter(solid);
  const outside = [];
  for (let i = 0; i < poly.length; i++) {
    const L = makeLine(poly[i], poly[(i + 1) % poly.length]);
    const next = [];
    for (const ring of inside) { let pieces; try { pieces = splitRing(ring, L); } catch (e) { throw new Error(`${e.message} [polygon edge ${i}, ring of ${ring.length} points near ${ring[0].map((v) => v.toFixed(2))}]`); } for (const piece of pieces) if (solid(piece.ring)) (piece.side === 1 ? next : outside).push(piece.ring); }
    inside = next;
  }
  return { inside, outside };
}

// A later cut can split an edge of one face where the face across it keeps one long edge (a T-junction), and then the two edges do not
// cancel. Every face edge is therefore split at each vertex of another face that lies on it, before faces are merged.
function withTJunctions(faces) {
  const pts = [];
  const seen = new Set();
  for (const f of faces) for (const p of f) if (!seen.has(pkey(p))) { seen.add(pkey(p)); pts.push(p); }
  return faces.map((f) => {
    const out = [];
    for (let i = 0; i < f.length; i++) {
      const a = f[i], b = f[(i + 1) % f.length];
      out.push(a);
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len2 = dx * dx + dy * dy;
      if (!len2) continue;
      const len = Math.sqrt(len2);
      const on = [];
      for (const p of pts) {
        if ((p[0] === a[0] && p[1] === a[1]) || (p[0] === b[0] && p[1] === b[1])) continue;
        const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
        if (t <= 0 || t >= 1) continue;
        if (Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / len < 5e-6) on.push([t, p]);
      }
      on.sort((u, v) => u[0] - v[0]);
      for (const [, p] of on) out.push(p);
    }
    return out;
  });
}

// Merges counter-clockwise faces into rings by cancelling the edges two faces share.
function mergeFaces(faces0) {
  // Crossings on the same line, computed from different pairs of end points, differ in the last digits; snapping to a micro-degree makes
  // equal points equal.
  const snap = (v) => Math.round(v * 1e6) / 1e6;
  const snapped = faces0
    .map((f) => f.map((p) => [snap(p[0]), snap(p[1])]).filter((p, i, a) => i === 0 || pkey(p) !== pkey(a[i - 1])))
    .filter((f) => f.length >= 3 && Math.abs(ringArea(f)) > 1e-9);
  const faces = withTJunctions(snapped);
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
  for (const [, list] of out) {
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
function centroid(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f;
    cx += (ring[j][0] + ring[i][0]) * f;
    cy += (ring[j][1] + ring[i][1]) * f;
  }
  return [cx / (3 * a), cy / (3 * a)];
}

// ---------------------------------------------------------------------------------------------------------------------------
const file = JSON.parse(readFileSync(PATH, "utf8"));
const P = file.meta.projection;
const toLL = ([x, y]) => [P.originLon + (x - P.padX) / P.scaleX, P.originLat - (y - P.padY) / P.scaleY];
const toXY = ([lon, lat]) => [Math.round((P.padX + (lon - P.originLon) * P.scaleX) * 10) / 10, Math.round((P.padY + (P.originLat - lat) * P.scaleY) * 10) / 10];

if (file.meta.zonesSplit) {
  console.error("pacific-regions.json is already split (meta.zonesSplit). Regenerate it with tools/build_pacific_map_geometry.py first.");
  process.exit(CHECK_ONLY ? 0 : 1);
}

const result = {}; // zone id -> LL faces
const old = {};
for (const id of new Set(ZONES.map((z) => z.from))) old[id] = file.regions[id].rings.map((r) => ccw(r.map(toLL)));
for (const [oldId, rings0] of Object.entries(old)) {
  let remaining = rings0;
  for (const zone of ZONES.filter((z) => z.from === oldId)) {
    if (!zone.polys) { result[zone.id] = remaining; remaining = []; continue; }
    const faces = [];
    for (const poly of zone.polys) {
      const { inside, outside } = carve(remaining, poly);
      faces.push(...inside);
      remaining = outside;
    }
    result[zone.id] = faces;
  }
}

const zones = {};
const report = [];
for (const zone of ZONES) {
  const rings = (result[zone.id].length > 1 ? mergeFaces(result[zone.id]) : result[zone.id]).map(ccw);
  const facesArea = result[zone.id].reduce((t, r) => t + Math.abs(ringArea(r)), 0);
  const mergedArea = rings.reduce((t, r) => t + Math.abs(ringArea(r)), 0);
  if (Math.abs(facesArea - mergedArea) > 1e-3) throw new Error(`zone ${zone.id}: merging the faces changed the area (${facesArea.toFixed(4)} -> ${mergedArea.toFixed(4)})`);
  const xy = rings.map((r) => r.map(toXY).filter((p, i, a) => i === 0 || pkey(p) !== pkey(a[i - 1]))).filter((r) => r.length >= 3 && Math.abs(ringArea(r)) > 0.25);
  if (!xy.length) throw new Error(`zone ${zone.id} came out empty`);
  // label: the interior point of the largest ring, or its centroid if that lies inside it
  const largest = rings.slice().sort((a, b) => Math.abs(ringArea(b)) - Math.abs(ringArea(a)))[0];
  let lab = centroid(largest);
  if (!pointInRing(lab, largest)) lab = interiorPoint(largest);
  zones[zone.id] = { rings: xy, label: toXY(lab).map((v) => Math.round(v * 10) / 10) };
  const area = rings.reduce((s, r) => s + Math.abs(ringArea(r)), 0);
  report.push([zone.id, rings.length, area]);
}

// Landmarks and conservation of area
let failures = 0;
for (const [zid, list] of Object.entries(LANDMARKS)) {
  for (const [name, lon, lat] of list) {
    const inZone = (id) => zones[id].rings.some((r) => pointInRing(toXY([lon, lat]), r));
    let hits = Object.keys(zones).filter(inZone);
    // The outlines are simplified, so a coastal city or a small island can sit just outside every polygon: then the nearest zone within
    // 0.7 degrees counts.
    if (!hits.length) {
      const dist = (id) => Math.min(...zones[id].rings.flatMap((r) => r.map((p) => Math.hypot(toLL(p)[0] - lon, toLL(p)[1] - lat))));
      const near = Object.keys(zones).map((id) => [id, dist(id)]).sort((a, b) => a[1] - b[1])[0];
      if (near[1] < 0.7) hits = [near[0]];
    }
    if (!hits.includes(zid)) {
      failures++;
      console.log(`LANDMARK  ${name} (${lon}, ${lat}) should be in ${zid}; it is in ${hits.join(", ") || "no zone"}`);
    }
  }
}
for (const oldId of Object.keys(old)) {
  const before = old[oldId].reduce((s, r) => s + Math.abs(ringArea(r)), 0);
  const after = ZONES.filter((z) => z.from === oldId).reduce((s, z) => s + report.find((r) => r[0] === z.id)[2], 0);
  const drift = Math.abs(after - before) / before;
  console.log(`${oldId.padEnd(12)} area before ${before.toFixed(2)} after ${after.toFixed(2)} (${(drift * 100).toFixed(4)}% drift)`);
  if (drift > 0.002) { failures++; console.log(`AREA      ${oldId}: the zones do not add up to the old region`); }
}
for (const [id, n, area] of report) console.log(`  ${id.padEnd(13)} ${String(n).padStart(3)} ring(s)  area ${area.toFixed(2).padStart(8)} sq deg  label ${zones[id].label.join(",")}`);
if (failures) {
  console.log(`\n${failures} problem(s).`);
  process.exit(1);
}
console.log("\nAll landmarks are in their zones.");
if (CHECK_ONLY) process.exit(0);

// Write: the old regions are replaced by their zones, in place; the Manchuria pin goes.
const regions = {};
for (const [id, val] of Object.entries(file.regions)) {
  if (old[id]) for (const z of ZONES.filter((q) => q.from === id)) regions[z.id] = zones[z.id];
  else regions[id] = val;
}
delete file.pins.manchuria;
file.regions = regions;
file.meta.zonesSplit = { china: ZONES.filter((z) => z.from === "china").map((z) => z.id), indies: ZONES.filter((z) => z.from === "indies").map((z) => z.id), philippines: ZONES.filter((z) => z.from === "philippines").map((z) => z.id) };
writeFileSync(PATH, JSON.stringify(file));
console.log(`wrote ${PATH}`);
