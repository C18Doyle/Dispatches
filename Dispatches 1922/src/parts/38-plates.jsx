// PLATES
// Small woodcut-style illustrations, one scene for each kind of moment, drawn in the ink of the command's own paper. They are drawings, not
// photographs or reconstructions of a real event, and every one is captioned as an illustration.

const PLATE_SCENES = {
  crowd: { caption: "A crowd with banners.", alt: "Black-ink drawing of a crowd of people holding banners on poles under a hatched sky." },
  trench: { caption: "A trench line under shellfire.", alt: "Black-ink drawing of a trench with sandbags, barbed wire and shell bursts over a hatched sky." },
  palace: { caption: "A palace front and a crowd before it.", alt: "Black-ink drawing of a long columned palace front with a dome, and a crowd gathered in the square." },
  staff: { caption: "A staff table: a lamp, a map and men standing at it.", alt: "Black-ink drawing of officers standing round a table with a lamp, in front of a large wall map." },
  train: { caption: "A train on the line.", alt: "Black-ink drawing of a steam locomotive and wagons on a railway, with telegraph poles and smoke." },
  column: { caption: "A column on the march across a winter plain.", alt: "Black-ink drawing of a long column of men and wagons crossing a snow-covered plain under a low sun." },
  riders: { caption: "Cavalry on the skyline.", alt: "Black-ink drawing of a line of horsemen with lances riding along a horizon in a cloud of dust." },
  ships: { caption: "Ships at a mole.", alt: "Black-ink drawing of two steamships with funnels moored at a harbour mole, with a crowd waiting on it." },
  ice: { caption: "A fortress island across the ice.", alt: "Black-ink drawing of a low fortress with towers and a domed church across a wide plain of ice, with small figures on it." },
  farm: { caption: "A farmhouse under shellfire.", alt: "Black-ink drawing of a farmhouse with a chimney, a shell burst above it, bare trees and a fence." },
  telegraph: { caption: "A telegraph line and a station.", alt: "Black-ink drawing of telegraph poles and wires converging on a small station building with a signal post." },
  cart: { caption: "Carts and sacks on a village road.", alt: "Black-ink drawing of horse carts loaded with sacks on a village road between low huts." },
  wall: { caption: "An earthwork across a narrow neck of land.", alt: "Black-ink drawing of a long earth rampart with guns, between water on both sides, under a hatched sky." },
};

function Figure({ x, y, s = 1, ink, banner }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={ink}>
      <circle cx="0" cy="-12" r="3.2" />
      <path d="M -3.6 -8.5 L 3.6 -8.5 L 4.4 3 L -4.4 3 Z" />
      {banner && <path d={`M 5 -26 V 3`} stroke={ink} strokeWidth="1.2" fill="none" />}
      {banner && <path d={`M 5 -26 H ${banner} V -17 H 5 Z`} />}
    </g>
  );
}

// A horse in a gallop, facing right (flip with d = -1), with a rider and lance when `rider` is set.
function Horse({ x, y, s = 1, d = 1, ink, paper, rider }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s * d} ${s})`} fill={ink} stroke={ink}>
      <ellipse cx="0" cy="0" rx="15" ry="6.5" stroke="none" />
      <path d="M 10 -3 L 17 -15 L 24 -12 L 25 -8 L 17 -6 L 15 1 Z" stroke="none" />
      <path d="M 11 4 L 21 15 M 8 5 L 13 16 M -10 5 L -20 14 M -7 6 L -13 16" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M -14 -2 Q -23 -4 -25 5" strokeWidth="2.4" fill="none" />
      {rider && <g stroke="none"><circle cx="1" cy="-19" r="3.4" /><path d="M -3 -16 L 5 -16 L 7 -5 L -5 -5 Z" /><path d="M 5 -14 L 25 -38" stroke={ink} strokeWidth="1.5" /></g>}
    </g>
  );
}

function PlateArt({ id, skin }) {
  const ink = skin.dark ? skin.ground : skin.ink;
  const paper = skin.dark ? skin.paper : skin.paper;
  const mid = skin.dark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.5)";
  const hatch = (y0, y1, step = 4, op = 0.5) => {
    const out = [];
    for (let y = y0; y < y1; y += step) out.push(<line key={y} x1="0" y1={y} x2="400" y2={y} stroke={ink} strokeWidth="0.7" opacity={op} />);
    return out;
  };
  const ground = (y, op = 0.92) => <rect x="0" y={y} width="400" height={150 - y} fill={ink} opacity={op} />;
  switch (id) {
    case "crowd": {
      const heads = [];
      for (let i = 0; i < 26; i++) heads.push(<Figure key={i} x={14 + i * 15 + ((i * 7) % 5)} y={120 - ((i * 13) % 4) * 6} s={1 + ((i * 5) % 3) * 0.12} ink={ink} banner={i % 6 === 2 ? 14 + (i % 3) * 8 : null} />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 70)}<path d="M 0 80 L 60 70 L 110 78 L 190 66 L 260 76 L 330 68 L 400 78 V 100 H 0 Z" fill={ink} opacity="0.35" />{ground(122, 0.3)}{heads}</g>;
    }
    case "trench": {
      const wire = [];
      for (let i = 0; i < 9; i++) wire.push(<path key={i} d={`M ${20 + i * 42} 96 l 10 -14 m -10 0 l 10 14 M ${15 + i * 42} 90 H ${40 + i * 42}`} stroke={ink} strokeWidth="1.2" fill="none" />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 76)}
        <path d="M 290 20 l 6 14 l 14 -6 l -8 12 l 14 6 l -16 2 l 4 14 l -10 -10 l -10 10 l 2 -14 l -16 -2 l 14 -6 l -8 -12 l 14 6 z" fill={ink} opacity="0.85" />
        <path d="M 70 30 l 4 10 l 10 -4 l -6 8 l 10 4 l -12 2 l 2 10 l -8 -7 l -8 7 l 2 -10 l -12 -2 l 10 -4 l -6 -8 l 10 4 z" fill={ink} opacity="0.55" />
        {wire}{ground(104)}
        <path d="M 0 104 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 h 20 v -10 h 22 v 10 H 400 V 150 H 0 Z" fill={ink} />
        {[60, 150, 240, 330].map((x) => <g key={x} fill={paper}><circle cx={x} cy="118" r="3.4" /><path d={`M ${x - 4} 123 h 8 l 1 10 h -10 z`} /><path d={`M ${x + 5} 112 l 12 -20`} stroke={paper} strokeWidth="1.4" fill="none" /></g>)}
      </g>;
    }
    case "palace": {
      const cols = [];
      for (let i = 0; i < 21; i++) cols.push(<rect key={i} x={60 + i * 14} y="52" width="5" height="46" fill={ink} />);
      const crowd = [];
      for (let i = 0; i < 24; i++) crowd.push(<Figure key={i} x={16 + i * 16 + ((i * 3) % 4)} y={133 - ((i * 5) % 3) * 5} s={0.9 + ((i * 7) % 3) * 0.1} ink={ink} banner={i === 5 || i === 15 ? 18 : null} />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 44)}
        <rect x="50" y="98" width="300" height="10" fill={ink} /><rect x="56" y="46" width="288" height="6" fill={ink} />{cols}
        <path d="M 170 46 L 200 24 L 230 46 Z" fill={ink} /><rect x="194" y="12" width="12" height="14" fill={ink} /><path d="M 192 12 L 200 3 L 208 12 Z" fill={ink} />
        {ground(112, 0.3)}{crowd}</g>;
    }
    case "staff": {
      return <g><rect width="400" height="150" fill={paper} />
        <rect x="40" y="14" width="190" height="78" fill="none" stroke={ink} strokeWidth="2.4" />
        <path d="M 52 70 Q 90 38 120 56 T 190 40 M 60 30 Q 110 24 150 34 M 70 82 Q 120 70 160 80 T 220 62" fill="none" stroke={ink} strokeWidth="1.4" />
        <path d="M 80 30 L 96 50 M 150 60 L 130 44" stroke={ink} strokeWidth="2.4" markerEnd="" />
        {ground(112)}
        <rect x="120" y="100" width="190" height="10" fill={paper} stroke={ink} strokeWidth="2" />
        <path d="M 128 110 V 140 M 302 110 V 140" stroke={ink} strokeWidth="5" />
        <path d="M 226 80 h 10 v 8 h -10 z M 231 70 v 10" fill={ink} stroke={ink} strokeWidth="2" /><circle cx="231" cy="64" r="9" fill={paper} opacity="0.35" />
        {[[110, 120, 1.5], [168, 118, 1.6], [262, 118, 1.6], [330, 120, 1.5]].map(([x, y, s], i) => <Figure key={i} x={x} y={y} s={s} ink={ink} />)}
      </g>;
    }
    case "train": {
      const poles = [];
      for (let i = 0; i < 8; i++) poles.push(<path key={i} d={`M ${20 + i * 52} 118 V 58 M ${10 + i * 52} 64 h 20`} stroke={ink} strokeWidth="2" fill="none" />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 58)}
        <path d="M 20 60 Q 70 72 120 60 T 220 60 T 320 60 T 400 60" fill="none" stroke={ink} strokeWidth="1" />{poles}
        <path d="M 66 52 q 14 -22 38 -14 q 24 -16 44 6 q 24 -8 36 12" fill={ink} opacity="0.35" />
        <rect x="30" y="80" width="70" height="32" fill={ink} /><rect x="30" y="68" width="22" height="12" fill={ink} /><rect x="62" y="62" width="9" height="20" fill={ink} />
        <rect x="104" y="84" width="60" height="28" fill={ink} /><rect x="168" y="84" width="60" height="28" fill={ink} /><rect x="232" y="84" width="60" height="28" fill={ink} /><rect x="296" y="84" width="60" height="28" fill={ink} />
        {[42, 62, 86, 120, 150, 184, 214, 248, 278, 312, 342].map((x) => <circle key={x} cx={x} cy="116" r="5.5" fill={paper} stroke={ink} strokeWidth="2" />)}
        <rect x="0" y="121" width="400" height="5" fill={ink} />{ground(130)}</g>;
    }
    case "column": {
      const ppl = [];
      for (let i = 0; i < 20; i++) ppl.push(<Figure key={i} x={30 + i * 17} y={118 - i * 1.4} s={0.9} ink={ink} />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 64, 5, 0.35)}
        <circle cx="318" cy="34" r="16" fill={ink} opacity="0.2" />
        <path d="M 0 84 Q 80 70 160 84 T 320 82 T 400 86 V 150 H 0 Z" fill={ink} opacity="0.12" />
        {ground(122)}{ppl}
        {[[90, 124], [200, 112], [290, 106]].map(([x, y], i) => <g key={i}><rect x={x} y={y - 12} width="26" height="12" fill={ink} /><circle cx={x + 5} cy={y + 2} r="4.5" fill={paper} stroke={ink} strokeWidth="1.6" /><circle cx={x + 21} cy={y + 2} r="4.5" fill={paper} stroke={ink} strokeWidth="1.6" /></g>)}
        {[60, 130, 250, 340].map((x, i) => <path key={i} d={`M ${x} ${20 + (i % 2) * 10} l 5 -3 l 5 3 M ${x + 14} ${26 + (i % 2) * 8} l 4 -3 l 4 3`} stroke={ink} strokeWidth="1.2" fill="none" />)}</g>;
    }
    case "riders": {
      const r = [];
      for (let i = 0; i < 7; i++) r.push(<Horse key={i} x={34 + i * 54} y={92 + ((i * 5) % 3) * 4} s={1.05} ink={ink} paper={paper} rider />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 74, 4, 0.45)}<path d="M 0 112 Q 100 104 200 112 T 400 110 V 150 H 0 Z" fill={ink} opacity="0.88" />{r}
        <path d="M 10 122 q 40 -8 80 0 M 120 126 q 50 -10 110 0 M 250 122 q 50 -8 120 -2" stroke={paper} strokeWidth="1.4" fill="none" opacity="0.6" /></g>;
    }
    case "ships": {
      const people = [];
      for (let i = 0; i < 12; i++) people.push(<Figure key={i} x={34 + i * 11} y={102} s={0.75} ink={ink} />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 64, 5, 0.35)}
        <path d="M 0 108 H 400 V 150 H 0 Z" fill={ink} opacity="0.25" />{[112, 122, 132, 142].map((y) => <path key={y} d={`M 0 ${y} q 12 -5 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} fill="none" stroke={ink} strokeWidth="1" opacity="0.7" />)}
        <rect x="20" y="104" width="190" height="8" fill={ink} />{people}
        <path d="M 230 108 L 244 86 H 386 L 392 108 Z" fill={ink} /><rect x="262" y="66" width="12" height="20" fill={ink} /><rect x="300" y="60" width="12" height="26" fill={ink} /><rect x="338" y="70" width="40" height="16" fill={ink} />
        <path d="M 268 66 q -4 -14 8 -22 M 306 60 q -4 -16 10 -26" stroke={ink} strokeWidth="6" fill="none" opacity="0.4" />
        <path d="M 330 86 V 40 M 372 86 V 46" stroke={ink} strokeWidth="2" /></g>;
    }
    case "ice": {
      const f = [];
      for (let i = 0; i < 14; i++) f.push(<Figure key={i} x={20 + i * 26} y={132 - ((i * 7) % 4) * 6} s={0.6 + (i % 3) * 0.08} ink={ink} />);
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 52, 5, 0.4)}
        <rect x="20" y="62" width="360" height="12" fill={ink} /><rect x="30" y="50" width="16" height="14" fill={ink} /><rect x="120" y="46" width="16" height="18" fill={ink} /><rect x="290" y="48" width="16" height="16" fill={ink} /><rect x="352" y="52" width="16" height="12" fill={ink} />
        <rect x="190" y="44" width="40" height="22" fill={ink} /><path d="M 196 44 a 14 14 0 0 1 28 0 z" fill={ink} /><path d="M 210 30 v -12 M 205 24 h 10" stroke={ink} strokeWidth="2" />
        <path d="M 0 80 H 400 V 150 H 0 Z" fill={ink} opacity="0.12" />
        {[88, 100, 112, 124, 136].map((y, i) => <path key={y} d={`M ${i * 20} ${y} h ${180 + (i * 37) % 120}`} stroke={ink} strokeWidth="0.8" opacity="0.5" />)}{f}</g>;
    }
    case "farm": {
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 76)}
        <path d="M 250 24 l 7 16 l 16 -8 l -9 14 l 16 8 l -19 2 l 4 16 l -12 -12 l -12 12 l 2 -16 l -19 -2 l 16 -8 l -9 -14 l 16 8 z" fill={ink} opacity="0.85" />
        {ground(112)}<rect x="110" y="70" width="130" height="44" fill={ink} /><path d="M 96 72 L 175 36 L 254 72 Z" fill={ink} /><rect x="206" y="28" width="12" height="26" fill={ink} />
        {[130, 160, 190].map((x) => <rect key={x} x={x} y="84" width="16" height="16" fill={paper} />)}<rect x="214" y="92" width="14" height="22" fill={paper} />
        {[40, 70, 310, 350].map((x, i) => <g key={x}><path d={`M ${x} 114 V ${70 - (i % 2) * 8}`} stroke={ink} strokeWidth="4" /><path d={`M ${x} ${84 - (i % 2) * 8} l -14 -16 M ${x} ${90 - (i % 2) * 8} l 14 -14 M ${x} ${100 - (i % 2) * 8} l -12 -12`} stroke={ink} strokeWidth="2" fill="none" /></g>)}
        <path d="M 270 116 H 390 M 280 106 V 126 M 310 106 V 126 M 340 106 V 126 M 370 106 V 126" stroke={ink} strokeWidth="2" /></g>;
    }
    case "telegraph": {
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 70, 5, 0.35)}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 0 ${20 + i * 7} Q 120 ${46 + i * 8} 260 ${64 + i * 3}`} fill="none" stroke={ink} strokeWidth="1" />)}
        <path d="M 40 130 V 10 M 22 20 H 58 M 26 30 H 54" stroke={ink} strokeWidth="4" fill="none" /><path d="M 150 130 V 36 M 138 42 H 162" stroke={ink} strokeWidth="3" fill="none" /><path d="M 220 130 V 52 M 212 56 H 228" stroke={ink} strokeWidth="2.4" fill="none" />
        {ground(120)}<rect x="250" y="76" width="110" height="46" fill={ink} /><path d="M 240 78 L 305 52 L 370 78 Z" fill={ink} />
        {[268, 296, 324].map((x) => <rect key={x} x={x} y="88" width="14" height="14" fill={paper} />)}<rect x="340" y="98" width="12" height="24" fill={paper} />
        <path d="M 384 124 V 40 M 376 48 l 18 -6 v 12 z" stroke={ink} strokeWidth="3" fill={ink} /></g>;
    }
    case "cart": {
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 62, 5, 0.35)}{ground(112, 0.3)}
        {[[40, 60], [320, 70]].map(([x, w], i) => <g key={i}><rect x={x} y={86} width={w} height="26" fill={ink} /><path d={`M ${x - 8} 88 L ${x + w / 2} 66 L ${x + w + 8} 88 Z`} fill={ink} /><rect x={x + 10} y="94" width="10" height="10" fill={paper} /></g>)}
        {[[120, 1], [250, -1]].map(([x, d], i) => <g key={i}><rect x={x} y={92} width="70" height="14" fill={ink} /><circle cx={x + 14} cy="116" r="11" fill={paper} stroke={ink} strokeWidth="3" /><circle cx={x + 56} cy="116" r="11" fill={paper} stroke={ink} strokeWidth="3" />
          {[0, 1, 2].map((k) => <ellipse key={k} cx={x + 14 + k * 22} cy="86" rx="11" ry="9" fill={ink} stroke={paper} strokeWidth="1.2" />)}
          <Horse x={x + (d > 0 ? 100 : -30)} y={104} s={0.8} d={d} ink={ink} paper={paper} /></g>)}</g>;
    }
    case "wall": {
      return <g><rect width="400" height="150" fill={paper} />{hatch(4, 68, 4, 0.5)}
        <path d="M 0 82 H 400 V 150 H 0 Z" fill={ink} opacity="0.2" />{[96, 108, 120, 132, 144].map((y) => <path key={y} d={`M 0 ${y} q 12 -4 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} stroke={ink} strokeWidth="0.8" fill="none" opacity="0.6" />)}
        <path d="M 0 92 H 400 V 116 H 0 Z" fill={ink} />
        <path d="M 30 92 V 62 H 130 V 92 M 80 62 V 50 M 230 92 V 70 H 330 V 92" stroke={ink} strokeWidth="6" fill="none" />
        {[70, 160, 250, 340].map((x) => <g key={x}><rect x={x} y="80" width="26" height="8" fill={paper} stroke={ink} strokeWidth="1.5" /><path d={`M ${x + 26} 82 l 16 -6`} stroke={paper} strokeWidth="3" /></g>)}
        <path d="M 120 36 l 5 12 l 12 -5 l -7 10 l 12 5 l -14 1 l 3 11 l -9 -8 l -8 8 l 2 -11 l -14 -1 l 12 -5 l -7 -10 l 12 5 z" fill={ink} opacity="0.8" /></g>;
    }
    default:
      return null;
  }
}

function Plate({ id, skin }) {
  const scene = PLATE_SCENES[id];
  if (!scene) return null;
  return (
    <figure className="mt-4" style={{ margin: 0, marginTop: "1rem" }}>
      <svg viewBox="0 0 400 150" role="img" aria-label={scene.alt} className="w-full h-auto block" style={{ border: `2px solid ${skin.dark ? skin.paperDim : skin.ink}`, background: skin.paper }}>
        <PlateArt id={id} skin={skin} />
      </svg>
      <figcaption className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>ILLUSTRATION. {scene.caption} Not a picture of the event itself.</figcaption>
    </figure>
  );
}

// Which scene goes with which report or ending.
const PLATE_FOR = {
  // 1917
  aprilCrisis17: "crowd", armyCommissars17: "trench", juneOffensive17: "trench", julyDays17: "crowd", supremeCommand17: "staff", moscowConference17: "crowd",
  kornilovAffair17: "train", directory17: "staff", democraticConference17: "crowd", octoberStand17: "palace",
  endingWinterPalaceFalls17: "palace", endingKornilovsRepublic17: "riders", endingDecreeCabinet17: "staff",
  // South Russia
  kornilovsDeath18: "farm", ekaterinodarAssault18: "column", afterEkaterinodar18: "column", moscowDirective19: "staff", kievConvergence19: "crowd",
  volgaThrust19: "riders", volgaOverextension19: "riders", rearSecurity19: "cart", peregonovka19: "cart", makhnosAftermath19: "cart", orelCulmination19: "train",
  cossackDesertion19: "riders", volgaCossackDesertion19: "riders", kubanCoup19: "staff", kubanRadaReorganized19: "staff", kharkovLine19: "trench",
  kharkovEncirclement19: "riders", afterTheCavalryStrike19: "riders", kubanQuotaAftermath19: "cart", novorossiysk20: "ships", voroshilovsCavalry20: "ships",
  moleRearguardFate20: "ships", wrangelsDismissal20: "staff", wrangelsReassignment20: "staff", sevastopolCouncil20: "ships", landLawDecision20: "cart",
  northernTauride20: "riders", wrangelsEnvoy20: "riders", crimeaDefensePrep20: "wall", frunzeOffer20: "telegraph",
  endingBizerte: "ships", endingTheCouncilAtSevastopol20: "ships", endingSecondNovorossiysk: "ships", endingArmyDissolved20: "column", endingCossackMutiny: "riders",
  endingTheArmyThatDidNotComeBack18: "column", endingTheLineThatBroke19: "trench",
  // Siberia
  omskCoup18: "telegraph", boldyrevsFirstWeek18: "staff", reluctanceAftermath18: "train", semyonovResponse18: "train", springOffensive19: "column",
  saratovJunction19: "train", exposedFlank19: "column", ufaCounteroffensive19: "trench", chelyabinskGrinder19: "trench", diterichsOverruled19: "staff",
  thirdArmySuccessor19: "staff", railPriority19: "train", janinsWord19: "telegraph", iceMarchDecision19: "column", eichesPursuit20: "column",
  irkutskUltimatum20: "telegraph", semyonovMerger20: "train", manchurianBorder20: "train", chitaFall20: "train",
  endingManchuria: "train", endingBoldyrevsOmsk18: "telegraph", endingOmskFalls19: "train", endingTheAdmiralAtIrkutsk20: "column", endingManchuriaEarly: "train",
  endingDispersedAtTheBorder: "column", endingColumnScattered20: "column", endingLegionWithdraws: "train",
  // Bolsheviks
  revvoensovietFormed18: "train", tsaritsynCrisis18: "train", tsaritsynAftermath18: "staff", stalinsRecall18: "staff", grainRequisition18: "cart", stalinsNewPosting18: "staff",
  supplyShortfall19: "cart", supplyRationingConsequence19: "staff", militaryOppositionCongress19: "crowd", congressFallout19: "staff", smirnovReassignment19: "staff",
  southernFrontPlan19: "staff", donbasMobilization19: "crowd", donbasAttrition19: "trench", reinforcedBattalionsTest19: "trench", cavalryArmyDebate19: "riders",
  distributedPursuit19: "riders", polishWar20: "riders", perekopAssault20: "wall", compressedEvacuation20: "ships", kronstadt21: "ice",
  endingIceBroken: "ice", endingTheVistula20: "riders", endingTheAutumnCrisis19: "staff", endingTheIsland21: "ice", endingHollowVictory21: "ice",
  endingUnlikelyPrecedent: "ice", endingCentralCommitteeMoves: "staff",
};
