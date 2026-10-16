import type { ReactNode } from "react";

/**
 * The game's artwork: silhouettes drawn in code, coloured by the theme (CSS variables set from src/themes.json; the .a-* classes are in index.css). Every piece is
 * decorative (aria-hidden): the story and the map list say everything the pictures show. Nothing here loads a file.
 */

const STARS: Array<[number, number, number]> = [
  [12, 10, 0.8], [40, 22, 0.6], [66, 8, 0.9], [92, 30, 0.5], [118, 14, 0.7], [146, 6, 0.6], [172, 26, 0.8], [200, 12, 0.5], [228, 20, 0.9], [254, 8, 0.6],
  [282, 24, 0.7], [310, 6, 0.5], [336, 18, 0.8], [362, 10, 0.6], [388, 28, 0.7], [24, 40, 0.5], [78, 44, 0.6], [134, 38, 0.5], [188, 46, 0.6], [246, 42, 0.5],
  [300, 44, 0.6], [352, 40, 0.5],
];

function Stars({ limit = STARS.length, scale = 1 }: { limit?: number; scale?: number }) {
  return (
    <g className="a-moon" opacity="0.7">
      {STARS.slice(0, limit).map(([x, y, r], i) => (
        <circle key={i} cx={x * scale} cy={y * scale} r={r} />
      ))}
    </g>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="a-st-top" />
        <stop offset="0.6" className="a-st-mid" />
        <stop offset="1" className="a-st-low" />
      </linearGradient>
      <radialGradient id={`${id}-halo`}>
        <stop offset="0" className="a-st-moon" stopOpacity="0.5" />
        <stop offset="1" className="a-st-moon" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" className="a-st-win" stopOpacity="0.6" />
        <stop offset="1" className="a-st-win" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-dawn`} cx="0.5" cy="1" r="0.8">
        <stop offset="0" className="a-st-glow" stopOpacity="0.85" />
        <stop offset="1" className="a-st-glow" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-fog`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="a-st-fog" stopOpacity="0" />
        <stop offset="1" className="a-st-fog" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="a-st-void" stopOpacity="0" />
        <stop offset="1" className="a-st-void" stopOpacity="1" />
      </linearGradient>
    </defs>
  );
}

function Moon({ id, cx, cy, r }: { id: string; cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 3} fill={`url(#${id}-halo)`} />
      <circle className="a-moon" cx={cx} cy={cy} r={r} />
      <circle className="a-far" cx={cx - r * 0.3} cy={cy - r * 0.2} r={r * 0.18} opacity="0.18" />
      <circle className="a-far" cx={cx + r * 0.35} cy={cy + r * 0.3} r={r * 0.24} opacity="0.14" />
    </g>
  );
}

const BAT = "M0 0 C-2 -2 -5 -3 -8 -1 C-7 -3 -9 -5 -12 -6 C-9 -6 -6 -5 -4 -3 C-3 -4 -1 -4 0 -2 C1 -4 3 -4 4 -3 C6 -5 9 -6 12 -6 C9 -5 7 -3 8 -1 C5 -3 2 -2 0 0Z";

function Bats({ at }: { at: Array<[number, number, number]> }) {
  return (
    <g className="a-sil">
      {at.map(([x, y, s], i) => (
        <path key={i} d={BAT} transform={`translate(${x} ${y}) scale(${s})`} className={i % 2 ? "bat-b" : "bat-a"} />
      ))}
    </g>
  );
}

function Pine({ x, y, h }: { x: number; y: number; h: number }) {
  const w = h * 0.34;
  return (
    <g>
      <polygon points={`${x - w},${y} ${x},${y - h} ${x + w},${y}`} />
      <polygon points={`${x - w * 0.8},${y - h * 0.38} ${x},${y - h * 1.12} ${x + w * 0.8},${y - h * 0.38}`} />
      <rect x={x - 1} y={y} width="2" height="4" />
    </g>
  );
}

function Waves({ y, rows, width = 400 }: { y: number; rows: number; width?: number }) {
  const lines = [];
  for (let r = 0; r < rows; r++) {
    let d = `M0 ${y + r * 7}`;
    for (let x = 0; x < width; x += 24) d += ` q6 -${3 + (r % 2)} 12 0 t12 0`;
    lines.push(<path key={r} d={d} className="a-wave" fill="none" strokeWidth="0.9" opacity={0.5 - r * 0.07} />);
  }
  return <g>{lines}</g>;
}

/** The castle, drawn with its base at (0,0) and about 70 wide and 62 high, so it can be set on any crag. */
function Castle() {
  const crenel = [];
  for (let i = 0; i < 6; i++) crenel.push(<rect key={i} x={i * 10} y={-4} width="5" height="5" />);
  return (
    <g>
      <rect x="0" y="-26" width="58" height="26" />
      {crenel}
      <rect x="-6" y="-36" width="13" height="36" />
      <polygon points="-8,-36 0.5,-52 9,-36" />
      <rect x="22" y="-48" width="15" height="48" />
      <polygon points="20,-48 29.5,-66 39,-48" />
      <rect x="52" y="-32" width="13" height="32" />
      <polygon points="50,-32 58.5,-46 67,-32" />
      <rect x="-12" y="0" width="82" height="4" />
      <g className="a-win-fill">
        <rect x="27" y="-38" width="3" height="7" />
        <rect x="-1" y="-24" width="3" height="6" />
        <rect x="56" y="-22" width="3" height="6" />
        <rect x="14" y="-14" width="2.5" height="5" />
      </g>
    </g>
  );
}

type Building = [number, number, number];

function Row({ buildings, base, lit }: { buildings: Building[]; base: number; lit?: number }) {
  const windows: ReactNode[] = [];
  return (
    <g>
      {buildings.map(([x, w, h], i) => {
        if (lit && i % lit === 0) windows.push(<rect key={i} className="a-win-fill" x={x + w / 2 - 1} y={base - h + 6} width="2.2" height="3.4" />);
        return <rect key={`b${i}`} x={x} y={base - h} width={w} height={h} />;
      })}
      <g className="a-win-fill">{windows}</g>
    </g>
  );
}

function PlaceArt({ id, place }: { id: string; place: string }) {
  switch (place) {
    case "castle":
      return (
        <>
          <Moon id={id} cx={196} cy={34} r={13} />
          <Bats at={[[170, 22, 0.9], [226, 44, 0.7], [352, 40, 0.8]]} />
          <path className="a-far" d="M0 92 L38 66 L64 82 L104 50 L146 80 L186 58 L226 86 L400 70 V120 H0Z" />
          <g className="a-sil">
            <path d="M120 120 L150 92 L186 96 L222 80 L252 66 L330 64 L360 78 L400 74 V120Z" />
            <g transform="translate(262 64)">
              <Castle />
            </g>
            <Pine x={20} y={116} h={46} />
            <Pine x={44} y={118} h={34} />
            <Pine x={12} y={120} h={30} />
            <Pine x={372} y={120} h={34} />
            <Pine x={392} y={120} h={44} />
          </g>
        </>
      );
    case "varna":
      return (
        <>
          <Moon id={id} cx={72} cy={28} r={11} />
          <path className="a-far" d="M0 88 Q60 70 120 86 T250 84 T400 78 V120 H0Z" />
          <rect className="a-far" x="0" y="100" width="290" height="20" />
          <g className="a-sil">
            <rect x="282" y="100" width="118" height="20" />
            <Row base={100} buildings={[[300, 14, 18], [316, 12, 26], [330, 18, 20], [350, 14, 30], [366, 18, 22], [386, 14, 26]]} lit={2} />
            <path d="M322 74 q6 -10 12 0z M326 66 v8" />
            <rect x="112" y="98" width="110" height="3" />
            <path d="M118 100 L216 100 L206 110 L128 110Z" />
            <rect x="143" y="52" width="2" height="48" />
            <rect x="168" y="46" width="2" height="54" />
            <rect x="193" y="54" width="2" height="46" />
            <path d="M270 100 V56 L292 62 M270 70 L292 76" fill="none" className="a-stroke" strokeWidth="1.4" />
          </g>
          <g className="a-moon" opacity="0.8">
            <polygon points="146,58 166,58 166,92 146,92" />
            <polygon points="171,52 191,52 191,92 171,92" />
          </g>
          <Waves y={111} rows={2} />
        </>
      );
    case "sea":
      return (
        <>
          <Moon id={id} cx={96} cy={30} r={12} />
          <rect className="a-far" x="0" y="78" width="400" height="42" />
          <g className="a-moon" opacity="0.55">
            <rect x="86" y="80" width="20" height="2" />
            <rect x="89" y="86" width="14" height="2" />
            <rect x="85" y="92" width="22" height="2" />
            <rect x="91" y="98" width="12" height="2" />
            <rect x="87" y="104" width="18" height="2" />
          </g>
          <Waves y={84} rows={5} />
          <g className="a-sil">
            <path d="M205 92 L295 92 L286 103 L214 103Z" />
            <rect x="231" y="26" width="2.4" height="66" />
            <rect x="265" y="32" width="2.4" height="60" />
            <rect x="212" y="90" width="82" height="2" />
          </g>
          <g className="a-moon" opacity="0.88">
            <polygon points="217,48 247,48 245,88 219,88" />
            <polygon points="222,28 242,28 241,46 223,46" />
            <polygon points="251,52 281,52 279,88 253,88" />
            <polygon points="256,34 276,34 275,50 257,50" />
          </g>
        </>
      );
    case "whitby":
      return (
        <>
          <Moon id={id} cx={306} cy={26} r={12} />
          <Bats at={[[330, 40, 0.7]]} />
          <path className="a-far" d="M0 86 Q90 70 180 88 T400 82 V120 H0Z" />
          <g className="a-sil">
            <path d="M0 120 V44 L70 40 L126 48 L168 84 L214 100 L400 102 V120Z" />
            <path
              fillRule="evenodd"
              d="M14 44 V20 L24 16 L34 22 L46 14 L60 20 L72 14 L84 22 L96 18 V44Z M24 42 V28 Q29 19 34 28 V42Z M44 42 V28 Q49 19 54 28 V42Z M64 42 V28 Q69 19 74 28 V42Z"
            />
            <path fillRule="evenodd" d="M96 44 V12 L104 0 L112 12 V44Z M101 40 V16 Q104 10 107 16 V40Z" />
            <Row base={100} buildings={[[196, 16, 14], [214, 18, 20], [234, 14, 12], [250, 20, 24], [272, 14, 16], [288, 18, 20], [310, 16, 12], [328, 22, 18], [352, 14, 14], [370, 20, 20]]} lit={2} />
            <rect x="244" y="62" width="9" height="40" />
            <polygon points="243,62 248.5,44 254,62" />
            <rect x="350" y="64" width="2" height="36" />
            <rect x="372" y="70" width="2" height="30" />
          </g>
          <Waves y={108} rows={2} />
        </>
      );
    case "london": {
      const skyline: Building[] = [[0, 22, 26], [22, 16, 38], [38, 20, 30], [58, 14, 44], [72, 18, 32], [92, 16, 40], [150, 18, 34], [168, 14, 46], [182, 20, 30], [202, 16, 40], [218, 22, 28], [284, 16, 42], [300, 20, 30], [320, 14, 48], [334, 22, 34], [356, 18, 40], [374, 26, 30]];
      return (
        <>
          <Moon id={id} cx={46} cy={28} r={10} />
          <g className="a-sil">
            <rect x="0" y="96" width="400" height="24" />
            <Row base={96} buildings={skyline} lit={2} />
            <polygon points="60,52 65,34 70,52" />
            <polygon points="168,50 175,26 182,50" />
            <rect x="124" y="24" width="18" height="72" />
            <polygon points="122,24 133,4 144,24" />
            <rect x="120" y="60" width="26" height="4" />
            <rect x="244" y="70" width="34" height="26" />
            <path d="M246 70 Q261 36 276 70Z" />
            <rect x="259" y="38" width="4" height="9" />
            <rect x="260" y="30" width="2" height="9" />
            <rect x="257" y="33" width="8" height="1.6" />
          </g>
          <circle className="a-win-fill" cx="133" cy="38" r="5" />
          <rect x="0" y="80" width="400" height="40" fill={`url(#${id}-fog)`} />
        </>
      );
    }
    case "carfax":
      return (
        <>
          <Moon id={id} cx={226} cy={28} r={12} />
          <Bats at={[[200, 24, 0.8], [250, 42, 0.7]]} />
          <path className="a-far" d="M0 84 Q50 74 100 86 T220 84 T330 80 T400 84 V120 H0Z" />
          <g className="a-sil">
            <rect x="296" y="52" width="104" height="44" />
            <rect x="290" y="46" width="112" height="6" />
            <rect x="66" y="66" width="48" height="30" />
            <polygon points="62,66 90,48 118,66" />
            <rect x="122" y="40" width="12" height="56" />
            <polygon points="120,40 128,6 136,40" />
            <rect x="166" y="58" width="94" height="38" />
            <polygon points="158,58 213,30 268,58" />
            <rect x="188" y="20" width="7" height="18" />
            <rect x="236" y="22" width="7" height="18" />
            <rect x="0" y="92" width="400" height="28" />
            <rect x="0" y="88" width="400" height="4" />
            <rect x="40" y="82" width="8" height="10" />
            <rect x="150" y="82" width="8" height="10" />
            <rect x="274" y="82" width="8" height="10" />
            <path d="M16 120 V78 M16 96 L4 84 M16 90 L30 74 M16 104 L28 94 M30 74 L36 66 M4 84 L-2 80" fill="none" className="a-stroke" strokeWidth="2.4" />
          </g>
          <g className="a-win-fill">
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4, 5].map((c) => <rect key={`${r}${c}`} x={304 + c * 16} y={58 + r * 11} width="5" height="6" opacity={(r + c) % 4 === 0 ? 1 : 0.55} />)
            )}
          </g>
        </>
      );
    case "piccadilly": {
      const houses = [];
      for (let i = 0; i < 7; i++) {
        const x = i * 58 - 6;
        const h = 62 + ((i * 17) % 22);
        houses.push(
          <g key={i}>
            <rect x={x} y={102 - h} width="56" height={h} />
            <rect x={x - 2} y={102 - h - 3} width="60" height="4" />
            <rect x={x + 10} y={102 - h - 12} width="5" height="10" />
            <rect x={x + 34} y={102 - h - 10} width="5" height="8" />
          </g>
        );
      }
      const wins = [];
      for (let i = 0; i < 7; i++) {
        const x = i * 58 - 6;
        const h = 62 + ((i * 17) % 22);
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 3; c++) wins.push(<rect key={`${i}${r}${c}`} x={x + 8 + c * 15} y={102 - h + 8 + r * 17} width="6" height="9" opacity={(i + r + c) % 3 === 0 ? 1 : 0.0} />);
      }
      return (
        <>
          <Moon id={id} cx={330} cy={20} r={9} />
          <g className="a-sil">{houses}</g>
          <g className="a-win-fill">{wins}</g>
          <rect className="a-sil" x="0" y="100" width="400" height="20" />
          <circle cx="372" cy="62" r="30" fill={`url(#${id}-glow)`} />
          <g className="a-sil">
            <rect x="370" y="60" width="3" height="46" />
            <rect x="365" y="52" width="13" height="9" />
          </g>
          <rect className="a-win-fill" x="367" y="54" width="9" height="6" />
          <rect x="0" y="82" width="400" height="38" fill={`url(#${id}-fog)`} />
        </>
      );
    }
    case "eastend":
      return (
        <>
          <Moon id={id} cx={352} cy={24} r={9} />
          <g className="a-sil">
            <path d="M0 120 V84 L20 70 L34 84 L52 66 L70 84 L96 74 L120 92 L150 70 L172 88 L200 62 L224 84 L252 72 L280 90 L310 66 L340 84 L370 72 L400 86 V120Z" />
            <rect x="40" y="46" width="6" height="24" />
            <rect x="140" y="44" width="6" height="28" />
            <rect x="196" y="38" width="6" height="26" />
            <rect x="304" y="42" width="6" height="26" />
            <path d="M20 106 Q60 112 100 104" fill="none" className="a-stroke" strokeWidth="1" />
          </g>
          <g className="a-moon" opacity="0.35">
            <path d="M43 44 q-6 -8 2 -14 q8 -6 0 -14" fill="none" className="a-wave" strokeWidth="1.6" />
            <path d="M143 42 q-6 -8 2 -14 q8 -6 0 -14" fill="none" className="a-wave" strokeWidth="1.6" />
          </g>
          <g className="a-win-fill">
            <rect x="60" y="94" width="5" height="7" />
            <rect x="162" y="96" width="5" height="7" />
            <rect x="262" y="94" width="5" height="7" />
            <rect x="350" y="96" width="5" height="7" />
          </g>
          <rect x="0" y="84" width="400" height="36" fill={`url(#${id}-fog)`} />
        </>
      );
    case "dawn":
      return (
        <>
          <rect x="0" y="0" width="400" height="120" fill={`url(#${id}-dawn)`} />
          <path className="a-far" d="M0 98 L40 82 L70 92 L116 70 L160 90 L206 76 L250 94 L400 80 V120 H0Z" />
          <g className="a-sil">
            <path d="M0 120 V102 L90 98 L190 104 L290 96 L400 102 V120Z" />
            <g transform="translate(300 98) scale(0.62)">
              <Castle />
            </g>
            <Pine x={30} y={112} h={34} />
            <Pine x={54} y={114} h={26} />
            <Pine x={370} y={114} h={30} />
          </g>
          <Bats at={[[120, 36, 0.8], [146, 50, 0.6]]} />
        </>
      );
    default:
      return (
        <>
          <Moon id={id} cx={300} cy={32} r={13} />
          <path className="a-far" d="M0 92 L60 70 L120 88 L190 62 L260 88 L330 70 L400 90 V120 H0Z" />
          <path className="a-sil" d="M0 120 V100 L80 94 L200 102 L320 94 L400 100 V120Z" />
        </>
      );
  }
}

/** A frontispiece for a scene: the place, at night, in silhouette. `place` is an id from the seat's ui.map; anything else gets a plain moonlit ridge. */
export function SceneBanner({ place, className = "" }: { place: string; className?: string }) {
  const id = "banner";
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" className={`art-banner ${className}`} aria-hidden="true" focusable="false">
      <Defs id={id} />
      <rect width="400" height="120" fill={`url(#${id}-sky)`} />
      <Stars limit={place === "dawn" ? 6 : 16} />
      <PlaceArt id={id} place={place} />
    </svg>
  );
}

/** The title screen: moon, ridge, the castle, bats, fog. The title is set in HTML over its lower edge. */
export function TitleScene({ className = "" }: { className?: string }) {
  const id = "title";
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className={`art-title ${className}`} aria-hidden="true" focusable="false">
      <Defs id={id} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      <Stars scale={1.0} />
      <g>
        <Moon id={id} cx={116} cy={92} r={34} />
      </g>
      <Bats at={[[150, 70, 1.6], [172, 112, 1.2], [248, 44, 1.4], [330, 120, 1.0], [60, 150, 1.1]]} />
      <path className="a-far" d="M0 190 L50 150 L96 178 L150 128 L210 176 L262 140 L320 182 L400 150 V300 H0Z" />
      <g className="a-sil">
        <path d="M96 300 L140 244 L190 246 L222 214 L240 198 L330 198 L372 214 L400 224 V300Z" />
        <g transform="translate(232 198) scale(1.35)">
          <Castle />
        </g>
        <Pine x={22} y={290} h={110} />
        <Pine x={58} y={296} h={80} />
        <Pine x={92} y={300} h={58} />
        <Pine x={382} y={300} h={70} />
        <path d="M0 300 V262 L40 252 L80 264 L120 258 V300Z" />
      </g>
      <g className="fog-a">
        <ellipse className="a-fog-fill" cx="90" cy="250" rx="140" ry="14" opacity="0.28" />
        <ellipse className="a-fog-fill" cx="320" cy="270" rx="150" ry="16" opacity="0.25" />
      </g>
      <g className="fog-b">
        <ellipse className="a-fog-fill" cx="200" cy="228" rx="170" ry="11" opacity="0.2" />
      </g>
      <rect className="title-fade" y="214" width="400" height="86" fill={`url(#${id}-fade)`} />
    </svg>
  );
}

/** The bat that stands in for the printer's flower in a rule. */
export function BatMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-14 -9 28 14" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <path d={BAT} />
    </svg>
  );
}

/** A small mark for a reserve, by the ids the two seats use. Anything else gets nothing. */
export function ResourceIcon({ id, className = "" }: { id: string; className?: string }) {
  const common = { viewBox: "0 0 16 16", className, "aria-hidden": true as const, focusable: "false" as const, fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (id) {
    case "strength":
      return (
        <svg {...common}>
          <path d="M2.5 3h11M4 3l1.8 10L7.5 3M8.5 3l1.7 10L12 3" />
        </svg>
      );
    case "secrecy":
      return (
        <svg {...common}>
          <path d="M1 8q7-7 14 0q-7 7-14 0z" />
          <circle cx="8" cy="8" r="2" />
        </svg>
      );
    case "dominion":
      return (
        <svg {...common}>
          <path d="M2 12.5V5l3.5 3L8 3l2.5 5L14 5v7.5z" />
        </svg>
      );
    case "nerve":
      return (
        <svg {...common}>
          <path d="M6 7.5h4V14H6zM8 2q2.2 3 0 4.2Q5.8 5 8 2z" />
        </svg>
      );
    case "blood":
      return (
        <svg {...common}>
          <path d="M8 2q5 6 5 8.2a5 5 0 0 1-10 0Q3 8 8 2z" />
        </svg>
      );
    case "fellowship":
      return (
        <svg {...common}>
          <circle cx="5.2" cy="8" r="3.4" />
          <circle cx="10.8" cy="8" r="3.4" />
        </svg>
      );
    default:
      return null;
  }
}
