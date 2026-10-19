// Draws the itch.io artwork (cover, banner) as SVG inside an HTML page and renders it with Playwright.
//   node itch/art/make.mjs            (from "Dispatches Sherlock", after `npm run build`, because it borrows the bundled fonts in dist/fonts.css)
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { houndstooth } from "../../scripts/houndstooth.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const out = join(here, "..");
const fonts = readFileSync(join(root, "dist", "fonts.css"), "utf8");

const INK = "#241b13";
const CREAM = "#f1e8d3";
const BRASS = "#e0b360";
const BRASS_DIM = "#b8893f";
const BLOOD = "#7b2a1d";

/** Small seeded generator so that every render of the web is the same. */
const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** The Professor's web: threads from the lens to the edges of the picture, with a few rings, and a knot at the end of each thread. */
function web(cx, cy, r, w, h, seed) {
  const rand = rng(seed);
  const parts = [];
  const n = 15;
  const ends = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + (rand() - 0.5) * 0.25;
    const len = Math.hypot(w, h) * (0.55 + rand() * 0.25);
    ends.push([ang, len]);
    const x2 = cx + Math.cos(ang) * len;
    const y2 = cy + Math.sin(ang) * len;
    parts.push(`<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${CREAM}" stroke-opacity="0.22" stroke-width="1"/>`);
  }
  for (const k of [1.45, 1.9, 2.5, 3.2, 4.1]) {
    const pts = ends.map(([ang]) => {
      const jitter = 1 + (rand() - 0.5) * 0.06;
      return `${(cx + Math.cos(ang) * r * k * jitter).toFixed(1)},${(cy + Math.sin(ang) * r * k * jitter * 0.96).toFixed(1)}`;
    });
    parts.push(`<polygon points="${pts.join(" ")}" fill="none" stroke="${CREAM}" stroke-opacity="${(0.2 - k * 0.02).toFixed(2)}" stroke-width="0.9"/>`);
  }
  for (const [ang] of ends) {
    for (const k of [1.9, 3.2]) {
      if (rand() < 0.45) parts.push(`<circle cx="${(cx + Math.cos(ang) * r * k).toFixed(1)}" cy="${(cy + Math.sin(ang) * r * k * 0.96).toFixed(1)}" r="2.6" fill="${BRASS}" fill-opacity="0.55"/>`);
    }
  }
  return parts.join("\n");
}

/** What the lens shows: the Reichenbach Falls at dusk, and two figures on the ledge. Drawn in a 200 x 200 box centred on the origin. */
function falls() {
  const lines = [];
  // the water: falling lines from the lip of the upper ledge into the mist
  for (let i = 0; i < 26; i++) {
    const x = -14 + i * 1.8 + (i % 3) * 0.4;
    lines.push(`<line x1="${x.toFixed(1)}" y1="-34" x2="${(x + (i % 2 ? 1.2 : -1.2)).toFixed(1)}" y2="${(40 + (i % 5) * 6).toFixed(1)}" stroke="#f4f1e6" stroke-opacity="${(0.55 + (i % 4) * 0.1).toFixed(2)}" stroke-width="${i % 3 ? 0.9 : 1.6}"/>`);
  }
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2d3a44"/>
        <stop offset="0.45" stop-color="#7f8d8f"/>
        <stop offset="0.8" stop-color="#d9c79d"/>
        <stop offset="1" stop-color="#f1dca6"/>
      </linearGradient>
      <linearGradient id="gorge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2b2622"/>
        <stop offset="1" stop-color="#4c4a47"/>
      </linearGradient>
      <radialGradient id="mist" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#f4f1e6" stop-opacity="0.9"/>
        <stop offset="1" stop-color="#f4f1e6" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="-110" y="-110" width="220" height="220" fill="url(#sky)"/>
    <path d="M-110 -10L-82 -46L-58 -22L-36 -62L-8 -30L18 -68L46 -34L70 -58L110 -20V110H-110Z" fill="#53606a" fill-opacity="0.75"/>
    <path d="M-110 4L-70 -12L-40 6L-6 -8L30 8L62 -6L110 10V110H-110Z" fill="#3b4349" fill-opacity="0.9"/>
    <path d="M-110 -34L-70 -40L-52 -30L-40 -2L-36 60L-40 110H-110Z" fill="url(#gorge)"/>
    <path d="M110 -44L68 -50L48 -36L38 0L40 70L36 110H110Z" fill="url(#gorge)"/>
    <path d="M-54 -34L-14 -36L-14 -30L-54 -28Z" fill="#1d1915"/>
    <path d="M-52 -33L-14 -35M-50 -30L-14 -31M-48 -28L-18 -29" stroke="#6c6358" stroke-width="0.7"/>
    ${lines.join("\n")}
    <ellipse cx="2" cy="52" rx="46" ry="22" fill="url(#mist)"/>
    <ellipse cx="-6" cy="70" rx="64" ry="18" fill="url(#mist)" opacity="0.8"/>
    <g fill="#14100c">
      <!-- the ledge on the left, and the two of them on it -->
      <path d="M-110 -2L-70 -4L-52 -34L-30 -34L-24 -26L-52 -18L-44 40L-50 110H-110Z" opacity="0.95"/>
      <circle cx="-37" cy="-46" r="3.4"/>
      <path d="M-41 -42L-33 -42L-31 -24L-35 -22L-37 -10L-41 -10L-40 -24Z"/>
      <path d="M-41 -44h8l-1-3.4h-6z"/>
      <circle cx="-26" cy="-45" r="3.2"/>
      <path d="M-30 -41L-22 -41L-20 -24L-24 -22L-25 -10L-29 -10L-28 -24Z"/>
      <path d="M-31 -38L-24 -34M-24 -38L-31 -33" stroke="#14100c" stroke-width="1.6" fill="none"/>
    </g>
    <path d="M-110 110L110 110L110 70C60 82 10 90 -40 84C-80 80 -100 90 -110 96Z" fill="#f4f1e6" fill-opacity="0.35"/>
  `;
}

/** The whole picture. */
function art({ w, h, lens, text, ground = true }) {
  const { cx, cy, r } = lens;
  const ang = Math.PI / 4;
  const hx1 = cx + Math.cos(ang) * (r + 2);
  const hy1 = cy + Math.sin(ang) * (r + 2);
  const hlen = r * 0.95;
  const hx2 = cx + Math.cos(ang) * (r + hlen);
  const hy2 = cy + Math.sin(ang) * (r + hlen);
  const scale = r / 100;
  const ht = houndstooth("#2a2016", "#3d2f20", Math.max(3, Math.round(w / 190)));
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fonts}
html,body{margin:0;padding:0;background:#2b2118}
.stage{position:relative;width:${w}px;height:${h}px;overflow:hidden;
  background-color:#2b2118;
  background-image:
    radial-gradient(ellipse 60% 60% at ${((cx / w) * 100).toFixed(0)}% ${((cy / h) * 100).toFixed(0)}%, rgba(224,179,96,0.28), transparent 70%),
    radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.5)),
    ${ht.uri};
  background-size:auto,auto,${ht.size}px ${ht.size}px;
  }
svg{position:absolute;inset:0}
.t{position:absolute;left:${text.x}px;top:${text.y}px;color:${CREAM};width:${text.w}px}
.kicker{font-family:'Rokkitt','Lora',serif;font-weight:700;letter-spacing:0.42em;text-transform:uppercase;color:${BRASS};font-size:${text.kicker}px}
.title{font-family:'Playfair Display','Georgia',serif;font-weight:900;font-style:italic;line-height:0.98;font-size:${text.title}px;margin:${text.title * 0.12}px 0 ${text.title * 0.16}px;text-shadow:0 2px 0 rgba(0,0,0,0.55),0 6px 24px rgba(0,0,0,0.6)}
.rule{height:2px;width:${text.w * 0.38}px;background:linear-gradient(90deg,${BRASS},transparent);margin:0 0 ${text.title * 0.14}px}
.sub{font-family:'Lora',serif;font-style:italic;font-size:${text.sub}px;color:${CREAM};opacity:0.92;line-height:1.35}
.sub b{font-family:'Rokkitt',serif;font-style:normal;letter-spacing:0.18em;text-transform:uppercase;color:${BRASS};font-weight:700;font-size:${text.sub * 0.78}px}
.foot{position:absolute;left:${text.x}px;bottom:${text.foot}px;font-family:'Rokkitt',serif;font-weight:700;letter-spacing:0.38em;text-transform:uppercase;font-size:${text.kicker * 0.8}px;color:${BRASS_DIM}}
</style></head><body><div class="stage">
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <defs><radialGradient id="glow" cx="${cx / w}" cy="${cy / h}" r="0.62"><stop offset="0" stop-color="#e0b360" stop-opacity="0.32"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>
  ${ground ? web(cx, cy, r, w, h, 7) : ""}
  <!-- the handle -->
  <line x1="${hx1.toFixed(1)}" y1="${hy1.toFixed(1)}" x2="${hx2.toFixed(1)}" y2="${hy2.toFixed(1)}" stroke="#14100c" stroke-width="${(r * 0.17).toFixed(1)}" stroke-linecap="round" opacity="0.5" transform="translate(${r * 0.04},${r * 0.05})"/>
  <line x1="${hx1.toFixed(1)}" y1="${hy1.toFixed(1)}" x2="${(hx1 + (hx2 - hx1) * 0.18).toFixed(1)}" y2="${(hy1 + (hy2 - hy1) * 0.18).toFixed(1)}" stroke="${BRASS_DIM}" stroke-width="${(r * 0.15).toFixed(1)}" stroke-linecap="butt"/>
  <line x1="${(hx1 + (hx2 - hx1) * 0.18).toFixed(1)}" y1="${(hy1 + (hy2 - hy1) * 0.18).toFixed(1)}" x2="${hx2.toFixed(1)}" y2="${hy2.toFixed(1)}" stroke="${BLOOD}" stroke-width="${(r * 0.17).toFixed(1)}" stroke-linecap="round"/>
  <line x1="${(hx1 + (hx2 - hx1) * 0.28).toFixed(1)}" y1="${(hy1 + (hy2 - hy1) * 0.28).toFixed(1)}" x2="${(hx1 + (hx2 - hx1) * 0.9).toFixed(1)}" y2="${(hy1 + (hy2 - hy1) * 0.9).toFixed(1)}" stroke="#a63f2b" stroke-width="${(r * 0.04).toFixed(1)}" stroke-linecap="round" opacity="0.7" transform="translate(${-r * 0.03},${-r * 0.03})"/>
  <!-- the lens -->
  <circle cx="${cx}" cy="${cy}" r="${r + r * 0.1}" fill="#14100c" opacity="0.55" transform="translate(${r * 0.05},${r * 0.07})"/>
  <clipPath id="lensclip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
  <g clip-path="url(#lensclip)"><g transform="translate(${cx},${cy}) scale(${scale.toFixed(3)})">${falls()}</g></g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#rim)" stroke-width="${(r * 0.1).toFixed(1)}"/>
  <defs><linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d68c"/><stop offset="0.5" stop-color="#b8893f"/><stop offset="1" stop-color="#6b4f24"/></linearGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r - r * 0.05}" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.5"/>
  <path d="M${cx - r * 0.78} ${cy - r * 0.2} A ${r * 0.8} ${r * 0.8} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.78}" stroke="#fff" stroke-opacity="0.55" stroke-width="${(r * 0.035).toFixed(1)}" fill="none" stroke-linecap="round"/>
</svg>
<div class="t">
  <div class="kicker">Sherlock Holmes</div>
  <div class="title">${text.title1}<br>${text.title2}</div>
  <div class="rule"></div>
  <div class="sub"><b>London, 1891</b><br>${text.sub1}</div>
</div>
<div class="foot">A Dispatches game</div>
</div></body></html>`;
}

const jobs = [
  {
    name: "cover",
    w: 630,
    h: 500,
    scale: 2,
    spec: {
      lens: { cx: 430, cy: 236, r: 132 },
      text: { x: 30, y: 118, w: 300, kicker: 11, title: 54, sub: 14.5, foot: 26, title1: "The Final", title2: "Problem", sub1: "One major case and four minor<br>from the case-book" },
    },
  },
  {
    name: "banner",
    w: 1920,
    h: 540,
    scale: 1,
    spec: {
      lens: { cx: 1470, cy: 250, r: 215 },
      text: { x: 150, y: 52, w: 1000, kicker: 21, title: 92, sub: 25, foot: 26, title1: "The Final", title2: "Problem", sub1: "A deduction game of the Professor's web,<br>the Yard, the street and the Falls" },
    },
  },
];

const browser = await chromium.launch();
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.scale });
  await page.setContent(art({ w: j.w, h: j.h, lens: j.spec.lens, text: j.spec.text }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(out, `${j.name}.png`) });
  console.log(`wrote itch/${j.name}.png (${j.w * j.scale}x${j.h * j.scale})`);
  await page.close();
}
await browser.close();
