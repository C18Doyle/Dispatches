import type { ReactNode } from "react";

/**
 * Line-art plates for the newspaper cards, the telegrams and the endings: drawn with strokes only, in the ink colour of the card they sit
 * on, so they take the theme and need no files. They are decorative (hidden from a screen reader); every card already says in words
 * what the plate shows.
 */

function Plate({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 110"
      className="w-full h-auto max-h-32 text-ink/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const hatch = (x: number, y: number, w: number, n: number, gap = 3) =>
  Array.from({ length: n }, (_, i) => <line key={i} x1={x} y1={y + i * gap} x2={x + w} y2={y + i * gap} strokeWidth="0.6" opacity="0.6" />);

export const PLATES = {
  baker: (
    <Plate>
      <path d="M0 100H240" />
      <rect x="40" y="22" width="160" height="78" />
      <path d="M34 22H206M44 22V14H196V22" />
      <rect x="62" y="6" width="10" height="16" />
      <rect x="168" y="6" width="10" height="16" />
      {[62, 108, 154].map((x) => (
        <g key={x}>
          <rect x={x} y="32" width="24" height="24" />
          <path d={`M${x + 12} 32V56M${x} 44H${x + 24}`} strokeWidth="0.8" />
        </g>
      ))}
      <rect x="62" y="66" width="24" height="22" />
      <rect x="154" y="66" width="24" height="22" />
      <path d="M108 100V72a12 12 0 0 1 24 0V100" />
      <path d="M112 100V74a8 8 0 0 1 16 0V100M120 66V100" strokeWidth="0.7" />
      <text x="120" y="64" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none" style={{ fontFamily: "Cinzel, Georgia, serif" }}>221B</text>
      <path d="M102 100V96H138V100" strokeWidth="0.8" />
      <path d="M222 100V50M217 50H227L225 40H219Z" />
      <path d="M214 34l-6-4M230 34l6-4M222 32V26" strokeWidth="0.8" />
      {hatch(46, 92, 50, 3, 2.5)}
    </Plate>
  ),
  yard: (
    <Plate>
      <path d="M0 100H240" />
      <path d="M30 100V40h60V100M30 40l30-20 30 20" />
      <path d="M44 100V76a8 8 0 0 1 16 0V100M62 100V76a8 8 0 0 1 16 0V100" />
      <rect x="40" y="48" width="12" height="14" />
      <rect x="68" y="48" width="12" height="14" />
      <path d="M130 100V60h70V100" />
      <path d="M130 60l35-16 35 16" />
      <rect x="140" y="68" width="14" height="16" />
      <rect x="176" y="68" width="14" height="16" />
      <path d="M158 100V84h14V100" />
      {/* a police lantern */}
      <path d="M110 30h12l2 6v18l-4 4h-8l-4-4V36Z" />
      <path d="M116 30v-5M112 25h8" />
      <path d="M110 44h12M116 36v16" strokeWidth="0.7" />
    </Plate>
  ),
  newspaper: (
    <Plate>
      <path d="M40 94L52 16H188l12 78Z" />
      <path d="M52 16L40 94M188 16l12 78" strokeWidth="0.8" />
      <rect x="66" y="24" width="108" height="12" />
      <path d="M72 30h96" strokeWidth="2" />
      {[0, 1, 2].map((c) => (
        <g key={c}>{hatch(66 + c * 38, 44, 32, 12, 4)}</g>
      ))}
      <rect x="66" y="44" width="32" height="14" />
      <path d="M66 44l32 14M98 44L66 58" strokeWidth="0.6" />
    </Plate>
  ),
  telegram: (
    <Plate>
      <path d="M0 100H240" />
      <path d="M200 100V6M186 14H214M190 24H210" />
      <path d="M186 14C150 22 120 12 60 20M214 14C230 18 238 22 240 24M190 24C160 32 120 24 60 30" strokeWidth="0.8" />
      <rect x="22" y="40" width="110" height="56" />
      <path d="M22 52H132" />
      <text x="77" y="49" fontSize="6.5" textAnchor="middle" fill="currentColor" stroke="none" style={{ fontFamily: "Cinzel, Georgia, serif" }}>TELEGRAM</text>
      {hatch(30, 60, 94, 6, 5)}
      <path d="M30 88h40" strokeWidth="1.8" />
    </Plate>
  ),
  note: (
    <Plate>
      <path d="M60 90L52 24l60-6 70 8-10 64Z" />
      <path d="M72 38c8-3 14 2 22-1s14 2 22-1 12 3 20 0" strokeWidth="1.8" />
      <path d="M70 52c10-2 16 3 26 0s16 2 26-1 12 2 22 0M72 66c8-2 14 2 22 0s14 2 24-1" strokeWidth="1.8" />
      <path d="M150 78l30-28 5 5-30 28-9 3Z" />
      <path d="M180 50l5 5" />
    </Plate>
  ),
  train: (
    <Plate>
      <path d="M0 98H240" strokeWidth="1" />
      <path d="M0 102H240" strokeWidth="0.5" />
      <path d="M30 86V52h70V40H72V30h30V40" />
      <path d="M30 52h-8V70h8M100 52h44v34M30 86h120" />
      <path d="M122 34h14l-3 8h-8Z" />
      <circle cx="50" cy="90" r="11" />
      <circle cx="82" cy="90" r="11" />
      <circle cx="126" cy="92" r="7" />
      <path d="M50 90h32M126 92h-6" strokeWidth="0.8" />
      <rect x="150" y="50" width="70" height="36" />
      <rect x="158" y="58" width="16" height="14" />
      <rect x="182" y="58" width="16" height="14" />
      <circle cx="166" cy="92" r="6" />
      <circle cx="204" cy="92" r="6" />
      <path d="M112 28c-6-8 4-12-2-20M124 26c-6-8 4-12-2-20M136 28c-4-8 6-12 0-20" strokeWidth="0.8" opacity="0.7" />
    </Plate>
  ),
  falls: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M0 70L40 24l24 28 30-40 34 46 30-30 40 46 42-22v52H0Z" strokeWidth="1" />
      <path d="M118 36V96M130 40V96M142 38V96" strokeWidth="1.4" />
      <path d="M110 36H152" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${106 + i * 11} ${98 - (i % 2) * 3}c4-6 8-6 12 0`} strokeWidth="0.8" />
      ))}
      <path d="M40 70c10-4 22-4 34 0" strokeWidth="0.8" opacity="0.7" />
      <path d="M166 62h30v4h-30Z" />
      <circle cx="176" cy="54" r="3" />
      <path d="M176 57v8M172 60l8 0M176 65l-3 6M176 65l3 6" strokeWidth="0.9" />
      {hatch(0, 88, 100, 4, 3)}
    </Plate>
  ),
  club: (
    <Plate>
      <path d="M0 100H240" />
      <path d="M30 100V40h60V100M30 40h60M60 40V26h12" />
      <path d="M38 100V60h44V100M46 100V70h28V100" strokeWidth="0.8" />
      <path d="M44 86c4 4 4 8 0 12M60 84c6 6 6 12 0 16M74 86c-4 4-4 8 0 12" strokeWidth="1.3" />
      <path d="M130 100V70c0-8 4-14 14-14h30c10 0 14 6 14 14v30" />
      <path d="M126 82h8v18M214 82h-8v18M140 56V44c0-6 6-10 14-10h20c8 0 14 4 14 10v12" />
      <path d="M144 72h58" strokeWidth="0.8" />
      <circle cx="116" cy="30" r="12" />
      <path d="M116 30V22M116 30l6 4" />
      <path d="M104 18l-4-6M128 18l4-6" strokeWidth="0.8" />
    </Plate>
  ),
  magnifier: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <circle cx="104" cy="52" r="30" />
      <circle cx="104" cy="52" r="25" strokeWidth="0.7" />
      <path d="M126 74l40 28" strokeWidth="5" />
      <path d="M92 40c6-6 18-6 24 0M96 66c8 6 18 4 24-4" strokeWidth="0.7" />
      {/* a footprint under the glass, and a crack across it */}
      <path d="M96 38c-4 6-2 14 4 16 6 2 8-6 6-12s-8-8-10-4Z" />
      <path d="M92 60c0 3 2 5 5 5s4-3 3-6-8-3-8 1Z" />
      <path d="M80 30l12 20-8 8 14 18" strokeWidth="1.1" />
    </Plate>
  ),
  lamp: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M120 100V40M112 100h16M116 92h8" />
      <path d="M108 40h24l-4-14h-16Z" />
      <path d="M116 26l4-6 4 6M120 20V14" />
      <path d="M114 34h12M120 28v12" strokeWidth="0.7" />
      <ellipse cx="120" cy="32" rx="46" ry="28" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.7" />
      <ellipse cx="120" cy="34" rx="78" ry="48" strokeWidth="0.5" strokeDasharray="1 6" opacity="0.5" />
      <path d="M20 84c20-8 36 4 60-2s40 6 60 0 40 4 60-2 24 2 40-2" strokeWidth="0.7" opacity="0.7" />
      <path d="M0 92c30-6 50 4 80-2" strokeWidth="0.6" opacity="0.6" />
    </Plate>
  ),
  wharf: (
    <Plate>
      <path d="M0 80H240M0 92H240" strokeWidth="0.7" />
      <path d="M0 100c20-4 30 4 50 0s30 4 50 0 30 4 50 0 30 4 50 0 20 2 40-2" strokeWidth="0.6" opacity="0.7" />
      {[10, 36, 62, 88].map((x) => (
        <path key={x} d={`M${x} 80V98`} strokeWidth="2.2" />
      ))}
      <path d="M120 80V30h100V80" />
      <path d="M120 30l50-18 50 18" />
      <rect x="132" y="42" width="14" height="14" />
      <rect x="160" y="42" width="14" height="14" />
      <rect x="188" y="42" width="14" height="14" />
      <path d="M156 80V62h16V80" />
      <path d="M180 22v-8h8" strokeWidth="0.8" />
      <path d="M40 76c8-14 24-14 32 0Z" />
      <path d="M52 62V40M52 40l10 8" />
    </Plate>
  ),
  cab: (
    <Plate>
      <path d="M0 98H240" strokeWidth="0.8" />
      <path d="M76 90V54h44V90M120 54V42h-20V54" />
      <path d="M76 54c0-14 10-22 22-22s22 8 22 22" />
      <circle cx="84" cy="92" r="14" />
      <circle cx="112" cy="92" r="9" />
      <path d="M84 92l-9-6M84 92l9 6M84 92v-14M84 92v14" strokeWidth="0.6" />
      <path d="M120 70h40l12 12h-52" />
      <path d="M172 82l12-16 8 6-2 18" />
      <path d="M184 66l8-14 6 4" />
      <path d="M190 52h8l4-8" />
      <path d="M96 22l6-6 6 6M102 16V8" strokeWidth="0.8" />
      <path d="M20 94h30M10 90h24" strokeWidth="0.6" opacity="0.6" />
    </Plate>
  ),
  stick: (
    <Plate>
      <path d="M0 90c30-8 50-24 80-26s46 8 70 4 54-12 90-4v50H0Z" />
      <path d="M60 72c8-4 18-4 26 0M100 70l12-4M150 76l14-4" strokeWidth="0.8" />
      <path d="M120 66L96 14" strokeWidth="2.4" />
      <path d="M92 14c-2-6 4-10 8-8" strokeWidth="1.2" />
      <rect x="134" y="62" width="22" height="12" rx="2" />
      <path d="M138 62v12M152 62v12" strokeWidth="0.6" />
      <path d="M0 40c30 0 40 20 70 20" strokeWidth="0.6" opacity="0.6" />
      {hatch(0, 100, 240, 3, 3)}
    </Plate>
  ),
  chess: (
    <Plate>
      <path d="M20 96h200" />
      <path d="M80 96V84c0-4 4-6 8-6h-2c-6-6-6-16 2-22l-2-6c-4-6 0-14 8-14s12 8 8 14l-2 6c8 6 8 16 2 22h-2c4 0 8 2 8 6v12Z" />
      <path d="M84 84h28" strokeWidth="0.8" />
      <path d="M150 96V86h30V96M154 86l4-34h18l4 34M150 52h30M154 52V44h6V52M164 52V44h6V52" />
      <path d="M170 38V26M164 32h12" />
      {hatch(24, 98, 192, 2, 3)}
    </Plate>
  ),
  ledger: (
    <Plate>
      <path d="M50 90V30l70-6 70 6v60l-70-6Z" />
      <path d="M120 24v60" />
      {hatch(60, 40, 52, 9, 5)}
      {hatch(128, 40, 52, 9, 5)}
      <path d="M62 48h20M138 60h28M138 72h14" strokeWidth="1.8" />
      <path d="M54 94l66 6 66-6" strokeWidth="0.8" />
    </Plate>
  ),
  crown: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M60 96V50l60-24 60 24V96" />
      <path d="M60 50h120M80 50V96M100 50V96M120 50V96M140 50V96M160 50V96" strokeWidth="0.9" />
      <path d="M100 26l20-18 20 18" />
      <path d="M52 100h136M56 96h128" />
      <path d="M116 14h8M120 10v8" strokeWidth="1.2" />
    </Plate>
  ),
} as const;

export type PlateId = keyof typeof PLATES;

/** Which plate a card shows. */
export function plateForInterlude(id: string): PlateId | null {
  switch (id) {
    case "LORE_CITY_MISFORTUNES":
    case "CRISIS_STANDING":
    case "TRANSITION_HIATUS":
      return "newspaper";
    case "TRANSITION_YARD":
      return "telegram";
    case "TRANSITION_STREET":
      return "note";
    case "TRANSITION_CONTINENT":
      return "train";
    case "TRANSITION_REICHENBACH":
      return "falls";
    case "TRANSITION_MYCROFT":
      return "club";
    case "CRISIS_EVIDENCE":
      return "magnifier";
    case "CRISIS_NERVE":
      return "lamp";
    default:
      return null;
  }
}

export function plateForEnding(id: string): PlateId {
  switch (id) {
    case "ENDING_CRISIS_EVIDENCE":
      return "magnifier";
    case "ENDING_CRISIS_STANDING":
      return "newspaper";
    case "ENDING_CRISIS_NERVE":
      return "lamp";
    case "ENDING_NET_CLOSES":
    case "ENDING_NAPOLEON_ESCAPES":
      return "yard";
    case "ENDING_REASON_OF_STATE":
    case "ENDING_HER_MAJESTYS_SERVICE":
      return "crown";
    case "ENDING_THE_SECOND_LEDGER":
      return "ledger";
    case "ENDING_PRIVATE_WAR":
    case "ENDING_BAKER_STREET_BURNS":
      return "wharf";
    case "ENDING_THE_COMPACT":
      return "chess";
    case "ENDING_THE_RETURN":
      return "baker";
    case "ENDING_THE_EMPTY_GRAVE":
      return "cab";
    default:
      return "stick";
  }
}

export function PlateView({ id }: { id: PlateId }) {
  return <div className="mb-4 mx-auto max-w-xs">{PLATES[id]}</div>;
}
