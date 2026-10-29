// Five directions for a more traditionally Sherlock look. Each theme is a palette and a set of fonts for Tailwind (the token names are the ones App.tsx
// already uses) plus extra CSS for the things a palette cannot do: the ground, the card, the corners, the dividers, the stamps.
// This is a prototype: nothing here is imported by the game. build.mjs compiles each theme against the real stylesheet, and shoot.mjs plays the real
// build and photographs the same screens in each.

const gf = (families) => `https://fonts.googleapis.com/css2?${families.map((f) => "family=" + f).join("&")}&display=swap`;

export const THEMES = {
  strand: {
    name: "The Strand",
    blurb: "A magazine of 1891 lying open on a baize desk: cream pages, thick and thin rules, engraved headings, drop caps.",
    colors: { void: "#1c150e", void2: "#261c12", parchment: "#f4edd9", "parchment-dim": "#e3d8ba", ink: "#1a1510", "ink-soft": "#3e362b", blood: "#7a1f1a", "blood-bright": "#a52a22", verdigris: "#3a5a40", "verdigris-bright": "#2f6b45", brass: "#a98a4c", "brass-bright": "#d9bd7a", "brass-dim": "#6b5430", ash: "#a39883" },
    fonts: { display: ["'Abril Fatface'", "Georgia", "serif"], heading: ["'Playfair Display SC'", "Georgia", "serif"], body: ["'Old Standard TT'", "Georgia", "serif"], broadsheet: ["'Old Standard TT'", "Georgia", "serif"] },
    fontUrl: gf(["Abril+Fatface", "Playfair+Display+SC:wght@400;700;900", "Old+Standard+TT:ital,wght@0,400;0,700;1,400"]),
    css: `
body { background-color: #1c150e;
  background-image: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,160,80,.16), transparent 65%),
    repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 1px, transparent 1px 3px),
    radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%); }
.parchment-card { background-color: #f4edd9;
  background-image: radial-gradient(circle, rgba(60,40,10,.05) 1px, transparent 1px), linear-gradient(180deg, rgba(120,90,40,.05), transparent 12%, transparent 88%, rgba(120,90,40,.07));
  background-size: 5px 5px, auto; border: 1px solid #1a1510;
  box-shadow: 0 0 0 5px #f4edd9, 0 0 0 6px #1a1510, 0 26px 50px -14px rgba(0,0,0,.85); margin: 6px; }
.parchment-card::before { inset: 7px; border: 3px double rgba(26,21,16,.55); }
.corner-flourish { display: none; }
.parchment-card h1, .parchment-card h2 { font-variant: small-caps; letter-spacing: .02em; }
.parchment-card h2[data-screen-heading] { text-align: center; font-size: 1.9rem; border-bottom: 3px double #1a1510; padding-bottom: .5rem; margin-bottom: 1rem; }
.parchment-card h2[data-screen-heading] + p::first-letter { float: left; font-family: 'Abril Fatface', Georgia, serif; font-size: 3.6em; line-height: .82; padding: .06em .09em 0 0; color: #7a1f1a; }
.parchment-card h2[data-screen-heading] + p { text-align: justify; hyphens: auto; }
.ornament-divider { color: #1a1510; }
.ornament-divider::before, .ornament-divider::after { height: 4px; background: none; border-top: 2px solid currentColor; border-bottom: 1px solid currentColor; }
.stamp { background: transparent; border: 1px solid currentColor; box-shadow: inset 0 0 0 2px #f4edd9, inset 0 0 0 3px currentColor; padding: .2rem .55rem; letter-spacing: .12em; }
.gauge-track { background: #f4edd9 !important; border: 1px solid #1a1510 !important; }
.flicker { text-shadow: 0 2px 0 #000, 0 0 30px rgba(201,160,80,.35); animation: none; }
button.group { background: transparent; border: 1px solid #1a1510; border-left: 5px solid #1a1510; border-radius: 0; }
button.group:hover { background: rgba(26,21,16,.05); }
.font-broadsheet.border-double { border: 3px solid #1a1510; box-shadow: 0 0 0 5px #f4edd9, 0 0 0 6px #1a1510; margin: 6px; }
`,
  },

  parlour: {
    name: "The Baker Street Parlour",
    blurb: "221B by gaslight: green damask on the walls, mahogany and brass, a leather case-book on the table.",
    colors: { void: "#14231b", void2: "#0d1812", parchment: "#efe2c6", "parchment-dim": "#dccdab", ink: "#22160e", "ink-soft": "#4a3526", blood: "#6e1b25", "blood-bright": "#a0323f", verdigris: "#2f5a45", "verdigris-bright": "#3b7a5a", brass: "#c0953a", "brass-bright": "#e8c065", "brass-dim": "#7a5a22", ash: "#aaa088" },
    fonts: { display: ["'Cormorant Garamond'", "Georgia", "serif"], heading: ["'Cormorant SC'", "Georgia", "serif"], body: ["'EB Garamond'", "Georgia", "serif"], broadsheet: ["'Cormorant Garamond'", "Georgia", "serif"] },
    fontUrl: gf(["Cormorant+Garamond:ital,wght@0,500;0,700;1,500;1,700", "Cormorant+SC:wght@500;700", "EB+Garamond:ital,wght@0,400;0,500;1,400"]),
    css: `
body { background-color: #14231b;
  background-image:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,192,101,.2), transparent 70%),
    radial-gradient(circle at 25% 25%, rgba(192,149,58,.13) 0 3px, transparent 4px),
    radial-gradient(circle at 75% 75%, rgba(192,149,58,.13) 0 3px, transparent 4px),
    radial-gradient(ellipse 14px 26px at 50% 50%, rgba(192,149,58,.08), transparent 70%),
    repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 36px),
    linear-gradient(180deg, #17291f, #101d16);
  background-size: auto, 36px 36px, 36px 36px, 36px 36px, auto, auto; }
body { padding-bottom: 56px; }
body::after { content: ""; position: fixed; left: 0; right: 0; bottom: 0; height: 46px; pointer-events: none;
  background: linear-gradient(180deg, #c0953a 0 2px, #3a1d10 2px 6px, #4e2915 6px, #2a140a); box-shadow: 0 -10px 30px rgba(0,0,0,.5); }
.parchment-card { background-color: #efe2c6;
  background-image: radial-gradient(circle at 20% 10%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle, rgba(70,40,10,.045) 1px, transparent 1px);
  background-size: auto, 5px 5px; border: 2px solid #7a5a22; border-radius: 3px;
  box-shadow: inset 0 0 0 3px #efe2c6, inset 0 0 0 4px #c0953a, 0 22px 46px -12px rgba(0,0,0,.9), 0 0 60px -20px rgba(232,192,101,.35); }
.parchment-card::before { inset: 10px; border: 1px dotted rgba(122,90,34,.6); }
.corner-flourish { width: 1.4rem; height: 1.4rem; border: none !important; background: linear-gradient(135deg, #e8c065, #8a6422); }
.corner-flourish.tl { clip-path: polygon(0 0, 100% 0, 0 100%); top: 0; left: 0; }
.corner-flourish.tr { clip-path: polygon(0 0, 100% 0, 100% 100%); top: 0; right: 0; }
.corner-flourish.bl { clip-path: polygon(0 0, 0 100%, 100% 100%); bottom: 0; left: 0; }
.corner-flourish.br { clip-path: polygon(100% 0, 100% 100%, 0 100%); bottom: 0; right: 0; }
.parchment-card h1, .parchment-card h2 { font-weight: 700; letter-spacing: .04em; }
.ornament-divider { color: #7a5a22; }
.stamp { background: #22160e; color: #e8c065 !important; border: 1px solid #c0953a; border-radius: 2px; }
.gauge-track { background: #22160e !important; border: 1px solid #c0953a !important; box-shadow: inset 0 1px 3px #000; }
.flicker { animation: none; text-shadow: 0 0 28px rgba(232,192,101,.55), 0 2px 0 #000; }
button.group { background: rgba(122,90,34,.06); border: 1px solid #7a5a22; border-radius: 2px; box-shadow: inset 0 0 0 2px #efe2c6, inset 0 0 0 3px rgba(192,149,58,.6); }
button.group:hover { background: rgba(192,149,58,.14); }
[role=tab] { border-radius: 2px; box-shadow: inset 0 0 0 2px rgba(0,0,0,.35); letter-spacing: .14em; }
`,
  },

  fog: {
    name: "Gaslit Fog",
    blurb: "A pea-souper in the small hours: night-blue, an amber lamp, a skyline of chimney-pots, pale telegram paper.",
    colors: { void: "#0d1620", void2: "#16222f", parchment: "#e8e5d8", "parchment-dim": "#d0ccbb", ink: "#10151c", "ink-soft": "#2f3a48", blood: "#8f3b1c", "blood-bright": "#c75a2a", verdigris: "#35615a", "verdigris-bright": "#2f7a68", brass: "#d29a3d", "brass-bright": "#f2c060", "brass-dim": "#7d5a22", ash: "#8e9bab" },
    fonts: { display: ["'IM Fell English SC'", "Georgia", "serif"], heading: ["'Cinzel'", "Georgia", "serif"], body: ["'Libre Baskerville'", "Georgia", "serif"], broadsheet: ["'Playfair Display'", "Georgia", "serif"] },
    fontUrl: gf(["IM+Fell+English+SC", "Cinzel:wght@400;600;700", "Libre+Baskerville:ital,wght@0,400;0,700;1,400", "Playfair+Display:ital,wght@0,700;0,900;1,700"]),
    css: `
body { background-color: #0d1620;
  background-image:
    radial-gradient(ellipse 28% 20% at 12% 8%, rgba(242,192,96,.35), transparent 70%),
    radial-gradient(ellipse 60% 30% at 50% 100%, rgba(150,170,190,.20), transparent 70%),
    radial-gradient(ellipse 80% 24% at 20% 70%, rgba(150,170,190,.10), transparent 70%),
    linear-gradient(180deg, #0a121b 0%, #15202d 55%, #223040 100%); }
body::before { content: ""; position: fixed; left: 0; right: 0; bottom: 0; height: 120px; pointer-events: none; opacity: .9;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 120' preserveAspectRatio='none'%3E%3Cpath fill='%23070d14' d='M0 120V78h30V60h14V44h8V60h20V70h26V50h10V34h6V50h12V66h34V40h8V28h6V40h10V76h30V58h18V46h8V58h26V72h30V54h12V38h8V54h16V70h36V84h22V62h10V50h8V62h24V78h40V56h12V42h8V56h20V74h30V86h26V120Z'/%3E%3C/svg%3E") bottom/100% 100% no-repeat; z-index: 0; }
.app-shell { position: relative; z-index: 1; }
.parchment-card { background-color: #e8e5d8;
  background-image: linear-gradient(180deg, rgba(120,140,170,.10), transparent 30%), radial-gradient(circle, rgba(16,21,28,.05) 1px, transparent 1px);
  background-size: auto, 4px 4px; border: 1px solid #10151c; border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(242,192,96,.25), 0 24px 60px -14px rgba(0,0,0,.9), 0 0 80px -20px rgba(242,192,96,.35); }
.parchment-card::before { inset: 6px; border: 1px solid rgba(143,59,28,.35); }
.corner-flourish { border-color: rgba(143,59,28,.7) !important; width: .9rem; height: .9rem; }
.ornament-divider { color: #8f3b1c; }
.stamp { background: rgba(16,21,28,.06); border-radius: 0; }
.gauge-track { background: #0d1620 !important; border: 1px solid rgba(242,192,96,.5) !important; }
.flicker { animation: none; text-shadow: 0 0 34px rgba(242,192,96,.7), 0 0 80px rgba(242,192,96,.3); letter-spacing: .02em; }
button.group { background: rgba(16,21,28,.035); border: 1px solid rgba(16,21,28,.4); border-radius: 0; }
button.group:hover { background: rgba(242,192,96,.15); border-color: #8f3b1c; }
.font-broadsheet.border-double { background: #e1ddc9; }
`,
  },

  casebook: {
    name: "The Case-Book",
    blurb: "Watson's ledger and the Yard's dossier: manila, ruled lines, a red margin, rubber stamps and copperplate notes.",
    colors: { void: "#1b2a23", void2: "#14201a", parchment: "#ead9ad", "parchment-dim": "#d8c593", ink: "#2a1d12", "ink-soft": "#54402b", blood: "#a3261c", "blood-bright": "#c7382c", verdigris: "#3f6b4d", "verdigris-bright": "#4a8a5c", brass: "#b08d57", "brass-bright": "#d6b274", "brass-dim": "#6f5a35", ash: "#9a8f78" },
    fonts: { display: ["'Playfair Display'", "Georgia", "serif"], heading: ["'Cormorant SC'", "Georgia", "serif"], body: ["'IM Fell English'", "Georgia", "serif"], broadsheet: ["'IM Fell English'", "Georgia", "serif"] },
    fontUrl: gf(["Playfair+Display:ital,wght@0,700;0,900;1,700", "Cormorant+SC:wght@500;700", "IM+Fell+English:ital@0;1", "Caveat:wght@500;600"]),
    css: `
body { background-color: #1b2a23;
  background-image: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(214,178,116,.12), transparent 70%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.015) 0 2px, transparent 2px 6px),
    radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%); }
.parchment-card { background-color: #ead9ad;
  background-image:
    linear-gradient(90deg, transparent 2.1rem, rgba(163,38,28,.55) 2.1rem, rgba(163,38,28,.55) calc(2.1rem + 1px), transparent calc(2.1rem + 1px)),
    repeating-linear-gradient(180deg, transparent 0 1.72rem, rgba(90,60,25,.16) 1.72rem calc(1.72rem + 1px)),
    linear-gradient(180deg, rgba(110,80,30,.10), transparent 18%);
  background-size: auto; border: 1px solid rgba(70,45,15,.7); border-radius: 2px;
  box-shadow: 0 2px 0 #cdb97f, 0 3px 0 rgba(70,45,15,.6), 0 26px 50px -14px rgba(0,0,0,.85); padding-left: 3.1rem !important; }
.parchment-card::before { display: none; }
.parchment-card::after { content: ""; position: absolute; top: -12px; right: 2.2rem; width: 15px; height: 46px; border: 3px solid #8f979c; border-radius: 9px; border-top-color: transparent; transform: rotate(4deg); box-shadow: 1px 1px 0 rgba(0,0,0,.3); }
.corner-flourish { display: none; }
.parchment-card h1, .parchment-card h2 { letter-spacing: .05em; }
.ornament-divider { color: #a3261c; }
.ornament-divider::before, .ornament-divider::after { background: none; border-top: 1px solid currentColor; }
.stamp { background: transparent; border: 2px solid currentColor; border-radius: 3px; transform: rotate(-2deg); letter-spacing: .14em; box-shadow: inset 0 0 0 1px currentColor; opacity: .9; }
.gauge-track { background: rgba(42,29,18,.12) !important; border: 1px solid rgba(42,29,18,.7) !important; }
.flicker { animation: none; text-shadow: 0 2px 0 #000; }
button.group { background: rgba(255,255,255,.18); border: 1px solid rgba(42,29,18,.55); border-radius: 0; box-shadow: 3px 3px 0 rgba(42,29,18,.25); }
button.group:hover { background: rgba(255,255,255,.32); }
button.group p.italic { font-family: 'Caveat', cursive; font-style: normal; font-size: 1.15rem; line-height: 1.15; color: #1d3b6b; }
.font-broadsheet.border-double { background: #ead9ad; border: 1px solid #2a1d12; box-shadow: 4px 4px 0 rgba(0,0,0,.45); transform: rotate(-.6deg); }
`,
  },

  tweed: {
    name: "Houndstooth",
    blurb: "The deerstalker and the Inverness cape: houndstooth wool, stitched leather, brass buttons, slab-serif headings.",
    colors: { void: "#2b2118", void2: "#201810", parchment: "#f1e8d3", "parchment-dim": "#ded2b4", ink: "#241b13", "ink-soft": "#4a3b2d", blood: "#7b2a1d", "blood-bright": "#a63f2b", verdigris: "#4a5d3a", "verdigris-bright": "#587a43", brass: "#b8893f", "brass-bright": "#e0b360", "brass-dim": "#6b4f24", ash: "#b0a287" },
    fonts: { display: ["'Playfair Display'", "Georgia", "serif"], heading: ["'Rokkitt'", "Georgia", "serif"], body: ["'Lora'", "Georgia", "serif"], broadsheet: ["'Playfair Display'", "Georgia", "serif"] },
    fontUrl: gf(["Playfair+Display:ital,wght@0,700;0,900;1,900", "Rokkitt:wght@500;700;800", "Lora:ital,wght@0,400;0,600;1,400"]),
    css: `
body { background-color: #2b2118;
  background-image:
    radial-gradient(ellipse 70% 40% at 50% 0%, rgba(224,179,96,.14), transparent 70%),
    repeating-conic-gradient(#3a2c1e 0 25%, #271d14 0 50%),
    repeating-linear-gradient(45deg, rgba(241,232,211,.07) 0 2px, transparent 2px 12px);
  background-size: auto, 28px 28px, auto; background-blend-mode: normal; }
.parchment-card { background-color: #f1e8d3;
  background-image: radial-gradient(circle, rgba(70,45,15,.045) 1px, transparent 1px); background-size: 4px 4px;
  border: 3px solid #5a3f1f; border-radius: 6px;
  box-shadow: inset 0 0 0 5px #f1e8d3, inset 0 0 0 6px rgba(90,63,31,.5), 0 0 0 5px #2b2118, 0 0 0 7px rgba(184,137,63,.7), 0 24px 46px -10px rgba(0,0,0,.85); margin: 8px; }
.parchment-card::before { inset: 9px; border: 2px dashed rgba(90,63,31,.55); border-radius: 3px; }
.corner-flourish { width: .95rem; height: .95rem; border: none !important; border-radius: 50%; background: radial-gradient(circle at 35% 32%, #f1d28a, #b8893f 55%, #6b4f24); box-shadow: 0 1px 2px rgba(0,0,0,.5); }
.corner-flourish.tl { top: 5px; left: 5px; } .corner-flourish.tr { top: 5px; right: 5px; }
.corner-flourish.bl { bottom: 5px; left: 5px; } .corner-flourish.br { bottom: 5px; right: 5px; }
.parchment-card h1, .parchment-card h2 { font-weight: 800; letter-spacing: .03em; text-transform: uppercase; }
.ornament-divider { color: #7b2a1d; }
.ornament-divider::before, .ornament-divider::after { height: 6px; background: repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 12px); opacity: .55; }
.stamp { background: #7b2a1d; color: #f1e8d3 !important; border: 1px dashed #f1e8d3; border-radius: 3px; }
.gauge-track { background: #2b2118 !important; border: 2px solid #b8893f !important; border-radius: 4px; }
.flicker { animation: none; text-shadow: 0 3px 0 #000, 0 0 30px rgba(224,179,96,.4); font-style: italic; }
button.group { background: rgba(123,42,29,.05); border: 2px solid #5a3f1f; border-radius: 5px; }
button.group:hover { background: rgba(184,137,63,.18); }
[role=tab] { border-radius: 999px; }
`,
  },
};
