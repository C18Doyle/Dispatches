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
      className="w-full h-auto max-h-32 text-current" style={{ opacity: 0.85 }}
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
  emblem: (
    <Plate>
      {/* the deerstalker */}
      <path d="M80 62C80 38 98 26 122 26S164 38 164 62" />
      <path d="M72 64H172" />
      <path d="M72 64C60 66 50 70 46 77 62 77 76 73 84 67M172 64C184 66 194 70 198 77 182 77 168 73 160 67" />
      <path d="M102 30C98 44 98 56 100 64M142 30C146 44 146 56 144 64" strokeWidth="0.9" />
      <path d="M116 27C108 17 101 22 105 28 109 33 115 29 118 27M128 27C136 17 143 22 139 28 135 33 129 29 126 27" />
      <circle cx="122" cy="27" r="2.2" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${108 + i * 9} 44l5 5-5 5-5-5Z`} strokeWidth="0.7" opacity="0.7" />
      ))}
      {/* the pipe, and its smoke */}
      <path d="M150 92C132 99 112 96 94 88" strokeWidth="2.2" />
      <path d="M148 92c0-9 8-14 18-11l2 14c-8 4-18 2-20-3Z" />
      <path d="M154 78c-4-6 3-9-1-15M162 76c-4-7 3-10-1-17" strokeWidth="0.8" opacity="0.7" />
      {/* the glass */}
      <circle cx="62" cy="92" r="11" />
      <circle cx="62" cy="92" r="8" strokeWidth="0.7" />
      <path d="M70 100l14 8" strokeWidth="3.2" />
      <path d="M56 88c2-3 6-3 9 0" strokeWidth="0.7" />
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
  portrait: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <rect x="82" y="8" width="76" height="86" />
      <rect x="88" y="14" width="64" height="74" strokeWidth="0.7" />
      <ellipse cx="120" cy="46" rx="22" ry="28" strokeWidth="0.9" />
      <path d="M106 40c4-10 22-10 28 0M112 46c2-2 4-2 6 0M124 46c2-2 4-2 6 0" strokeWidth="1" />
      <path d="M114 58c4 4 12 4 16 0" strokeWidth="1" />
      <path d="M100 88c2-14 12-18 20-18s18 4 20 18" />
      <path d="M96 22c6-8 14-10 24-10M144 22c-6-8-14-10-24-10" strokeWidth="0.8" />
      <path d="M166 70l14-8 14 8-14 30Z" />
      <path d="M180 62v38M170 76l10 6 10-6" strokeWidth="0.7" />
      <path d="M44 100V88h22v12M40 88h30" />
      <path d="M52 88V70M56 88V74M60 88V70" strokeWidth="0.8" />
    </Plate>
  ),
  strongbox: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <rect x="64" y="46" width="112" height="50" />
      <path d="M64 62h112M64 56h112" strokeWidth="0.8" />
      <path d="M64 46C64 34 80 28 120 28s56 6 56 18" />
      <rect x="112" y="54" width="16" height="18" />
      <circle cx="120" cy="62" r="3" />
      <path d="M120 65v4" strokeWidth="1.6" />
      <path d="M76 96v4h12v-4M152 96v4h12v-4" />
      <path d="M136 30l22-18 10 8-18 18Z" strokeWidth="1" />
      <path d="M142 26l12-9" strokeWidth="0.6" />
      <path d="M190 80h16a6 6 0 1 1 0 12h-16Z" />
      <path d="M190 86h-18M176 86v6M182 86v4" />
    </Plate>
  ),
  envelope: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <rect x="58" y="26" width="124" height="68" />
      <path d="M58 26l62 44 62-44M58 94l46-40M182 94l-46-40" />
      <circle cx="120" cy="70" r="9" />
      <path d="M114 72l2-8 4 5 4-5 2 8Z" strokeWidth="0.8" />
      <circle cx="196" cy="40" r="16" />
      <circle cx="196" cy="40" r="13" strokeWidth="0.6" />
      <path d="M196 40V30M196 40l8 4" />
      <path d="M190 24l-3-5M202 24l3-5" strokeWidth="0.8" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <path key={i} d={`M${196 + Math.cos((i * Math.PI) / 6) * 13} ${40 + Math.sin((i * Math.PI) / 6) * 13}l${Math.cos((i * Math.PI) / 6) * -2} ${Math.sin((i * Math.PI) / 6) * -2}`} strokeWidth="0.6" />
      ))}
    </Plate>
  ),
  snake: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M200 6V30" />
      <path d="M196 30h8l-2 6h-4Z" />
      <path d="M200 36c0 12-6 20-6 30M200 36c-2 12 4 20 4 30" strokeWidth="1" />
      <path d="M60 94c-12 0-16-12-6-18s24-2 34 4 24 8 34 2 14-16 24-22 20-4 24 6-6 14-18 12" strokeWidth="2.4" />
      <path d="M142 62c8-6 22-6 28 2" strokeWidth="2.4" />
      <path d="M170 64l-4-8 10-2 8 6-8 8Z" />
      <circle cx="176" cy="60" r="1.3" fill="currentColor" stroke="none" />
      <path d="M184 62l8 2M184 62l8-2" strokeWidth="0.8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${70 + i * 14} ${90 - (i % 2) * 6}l3 3M${74 + i * 14} ${84 - (i % 2) * 6}l-3 3`} strokeWidth="0.7" />
      ))}
      <path d="M30 100V70M26 70h16" />
      <rect x="24" y="48" width="24" height="16" />
      <path d="M28 52h16M28 56h16M28 60h16" strokeWidth="0.7" />
    </Plate>
  ),
  candle: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M96 100V54h24V100M90 100h36" />
      <path d="M108 54V44" strokeWidth="1.4" />
      <path d="M104 44c4-4 8-4 8 0" strokeWidth="0.8" />
      <path d="M108 40c-6-8 4-12-2-22M114 38c-6-8 4-12-2-22" strokeWidth="0.8" opacity="0.7" />
      <rect x="148" y="24" width="52" height="40" />
      <path d="M148 34h52M148 44h52M148 54h52M162 24v40M176 24v40M188 24v40" strokeWidth="0.8" />
      <path d="M174 64v16" />
      <path d="M168 80h12" />
      <path d="M60 100c10-6 24-6 34 0" strokeWidth="0.8" />
      <path d="M30 100l8-30 8 30M34 90h8" />
    </Plate>
  ),
  bag: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M62 96V56c0-6 4-10 10-10h96c6 0 10 4 10 10v40Z" />
      <path d="M62 70h116" strokeWidth="0.8" />
      <path d="M98 46V38c0-6 4-8 10-8h24c6 0 10 2 10 8v8" />
      <rect x="112" y="64" width="16" height="14" />
      <circle cx="120" cy="71" r="2" />
      <circle cx="196" cy="84" r="9" />
      <circle cx="218" cy="84" r="9" />
      <path d="M205 84h4M187 84l-10-4M227 84l8-4" />
      <path d="M180 100c4-8 14-8 18 0" strokeWidth="0.8" />
    </Plate>
  ),
  goose: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M52 76c0-16 14-26 34-26 12 0 20 4 28 8 8-6 10-18 6-28l-6-10 12 0c6 10 8 22 6 34 8 6 16 10 28 12-6 14-20 26-44 26-34 0-64-4-64-16Z" strokeWidth="1.2" />
      <path d="M126 22l22 4-22 6Z" />
      <circle cx="123" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M96 100V90M106 100V90M92 100h10M102 100h10" />
      <path d="M72 74c10 2 22 2 32-2M78 80c8 2 18 2 28-2" strokeWidth="0.7" />
      <path d="M178 38l10-12 10 12-10 20Z" />
      <path d="M178 38h20M188 26l-4 12M188 26l4 12" strokeWidth="0.7" />
      <path d="M200 84c4-8 12-8 16 0 4-8 12-8 16 0" strokeWidth="0.8" />
      <circle cx="208" cy="82" r="1.6" />
      <circle cx="224" cy="82" r="1.6" />
    </Plate>
  ),
  cuffs: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <circle cx="90" cy="60" r="22" />
      <circle cx="90" cy="60" r="16" strokeWidth="0.8" />
      <path d="M72 74l-8 10M108 74l8 10" />
      <rect x="62" y="82" width="16" height="10" />
      <rect x="102" y="82" width="16" height="10" />
      <path d="M78 87h24" strokeDasharray="3 3" />
      <circle cx="154" cy="60" r="22" />
      <circle cx="154" cy="60" r="16" strokeWidth="0.8" />
      <path d="M136 74l-8 10M172 74l8 10" />
      <path d="M190 30l14-16 14 16-14 28Z" />
      <path d="M190 30h28M204 14l-6 16M204 14l6 16" strokeWidth="0.7" />
    </Plate>
  ),
  hat: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M62 80c0-26 8-40 36-40s36 14 36 40" />
      <path d="M50 80h96" />
      <path d="M50 80c-6 4-4 10 6 12h84c10-2 12-8 6-12" />
      <path d="M62 72h72" strokeWidth="0.7" />
      <path d="M72 58l6 4M78 52l8 8M112 58l6 4" strokeWidth="0.7" opacity="0.7" />
      <path d="M160 70c14 2 26 2 40-2l10 18-30 8-24-4Z" />
      <path d="M170 74l30-2" strokeWidth="0.7" />
      <path d="M200 40l8-10 8 10-8 16Z" strokeDasharray="2 2" />
      <path d="M208 30l-4 10M208 30l4 10" strokeWidth="0.6" strokeDasharray="2 2" />
    </Plate>
  ),
  vault: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <circle cx="120" cy="54" r="40" />
      <circle cx="120" cy="54" r="33" strokeWidth="0.8" />
      <circle cx="120" cy="54" r="8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${120 + Math.cos((i * Math.PI) / 3) * 8} ${54 + Math.sin((i * Math.PI) / 3) * 8}L${120 + Math.cos((i * Math.PI) / 3) * 30} ${54 + Math.sin((i * Math.PI) / 3) * 30}`} />
      ))}
      <path d="M80 54H70M160 54h10M120 14V6M120 94v6" />
      <path d="M40 100v-14h24v14M44 86V76h16v10" strokeWidth="0.9" />
      <path d="M176 100v-8h30v8M182 92v-12h18v12" strokeWidth="0.9" />
      <circle cx="191" cy="74" r="4" />
    </Plate>
  ),
  tunnel: (
    <Plate>
      <path d="M0 60H240" strokeWidth="0.8" />
      <path d="M0 68H240" strokeWidth="0.5" />
      <path d="M70 60l8 8M110 60l8 8M150 60l8 8M190 60l8 8" strokeWidth="0.6" />
      <path d="M98 60l-6 14M142 60l6 14" />
      <path d="M92 74h56" strokeWidth="0.8" />
      <path d="M96 60h48l-4 12H100Z" strokeDasharray="3 2" />
      <path d="M100 72v18c0 6 4 10 8 10h24c4 0 8-4 8-10V72" />
      <path d="M108 80h24M108 88h24" strokeWidth="0.7" />
      <path d="M184 20l4 40M180 20h16" />
      <path d="M180 20c-4-8 2-14 8-14s12 6 8 14Z" />
      <path d="M40 98c10-4 20-4 30 0M170 98c10-4 20-4 30 0" strokeWidth="0.8" />
    </Plate>
  ),
  book: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M56 90V30l64-6 64 6v60l-64-6Z" />
      <path d="M120 24v60" />
      <path d="M62 34l54-4v52l-54 4ZM124 30l54 4v52l-54-4Z" strokeWidth="0.6" />
      <path d="M78 60c-6 0-6-12 0-12h8c8 0 8 10 0 10h-8c8 0 8 12 0 12h-8" strokeWidth="1.4" />
      <path d="M142 42h28M142 50h28M142 58h20" strokeWidth="0.7" />
      <path d="M194 98c0-8 8-10 20-10s20 2 20 10Z" />
      <path d="M198 92h32M202 96h24" strokeWidth="0.6" />
      <circle cx="214" cy="82" r="5" />
    </Plate>
  ),
  flames: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M30 100V64h40v36M80 100V54h40v46M130 100V68h44v32M184 100V60h36v40" />
      <path d="M44 64V52h12v12M96 54V42h14v12M148 68V56h14v12" strokeWidth="0.9" />
      <path d="M96 52c-6-10 4-14 0-26 10 6 14 14 10 24 6-4 8-10 6-18 10 10 8 22 0 34Z" strokeWidth="1.2" />
      <path d="M148 66c-4-8 4-12 0-20 8 4 12 10 8 18 4-2 6-8 4-14 8 8 6 18 0 24Z" strokeWidth="1.2" />
      <path d="M196 58c-4-8 4-12 0-20 8 4 12 10 8 18 4-2 6-8 4-14 8 8 6 18 0 24Z" strokeWidth="1.2" />
      <path d="M60 40c-4-6 2-8 0-14M70 36c-4-6 2-8 0-14" strokeWidth="0.8" opacity="0.7" />
      <path d="M36 74h8M36 84h8M92 66h8M92 76h8M92 86h8M140 78h8M140 88h8M192 70h8M192 80h8" strokeWidth="1" />
    </Plate>
  ),
  ship: (
    <Plate>
      <path d="M0 100c20-6 40-6 60 0s40 6 60 0 40-6 60 0 40 6 60 0" strokeWidth="1" />
      <path d="M20 90c20-6 40-6 60 0s40 6 60 0 40-6 60 0" strokeWidth="0.6" opacity="0.7" />
      <path d="M54 78h132l-14 14H70Z" />
      <path d="M70 78V62h96v16M82 62V50h72v12" />
      <path d="M96 50V30h16v20M128 50V34h12v16" />
      <path d="M92 30h24M126 34h16" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={80 + i * 16} cy="70" r="2.6" />
      ))}
      <path d="M104 26c-6-6 4-10-2-16M112 24c-6-6 4-10-2-16M134 28c-6-6 4-10-2-16" strokeWidth="0.8" opacity="0.7" />
      <path d="M186 78V40M186 40h12" />
      <path d="M26 82h24M20 78h20" strokeWidth="0.7" />
    </Plate>
  ),
  rifle: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M0 80L30 70 60 78l30-22 28 14 30-30 40 20 22-12v52H0Z" strokeWidth="1" />
      <path d="M130 40V96M142 44V96M154 42V96" strokeWidth="1.2" />
      <path d="M44 38l110-14" strokeWidth="1.6" />
      <path d="M44 38l-12 8 4 8 10-4Z" />
      <path d="M154 24l12-2M162 20l4 4" strokeWidth="0.9" />
      <circle cx="186" cy="48" r="10" />
      <path d="M186 38V58M176 48h20" strokeWidth="0.7" />
      <path d="M200 60c4-8 4-16 0-24" strokeWidth="0.7" strokeDasharray="2 2" />
    </Plate>
  ),
  cord: (
    <Plate>
      <path d="M0 100H240" strokeWidth="0.6" />
      <path d="M20 40c20-10 40-10 60 0 12 6 22 6 30 4" />
      <path d="M20 48c20-10 40-10 60 0 12 6 22 6 30 4" />
      <path d="M20 56c20-10 40-10 60 0 12 6 22 6 30 4" />
      <path d="M110 44l12 6-10 2 10 6M110 52l10 8-8 0 10 8M110 60l12 4-6 4" strokeWidth="0.8" />
      <path d="M130 62c8 4 20 4 36 0 20-6 40-6 56 0" />
      <path d="M130 70c8 4 20 4 36 0 20-6 40-6 56 0" />
      <path d="M130 78c8 4 20 4 36 0 20-6 40-6 56 0" />
      <path d="M118 66l-4 14M126 70l2 16" strokeWidth="0.7" opacity="0.7" />
      <text x="50" y="22" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle" style={{ fontFamily: "Rokkitt, Georgia, serif" }}>HOURS</text>
      <text x="120" y="22" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle" style={{ fontFamily: "Rokkitt, Georgia, serif" }}>HANDS</text>
      <text x="190" y="22" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle" style={{ fontFamily: "Rokkitt, Georgia, serif" }}>WIRES</text>
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
    case "TRANSITION_BOHEMIA":
      return "envelope";
    case "TRANSITION_BAND":
      return "telegram";
    case "TRANSITION_CARBUNCLE":
    case "TRANSITION_LEAGUE":
      return "newspaper";
    case "CRISIS_EVIDENCE":
      return "magnifier";
    case "CRISIS_NERVE":
      return "lamp";
    case "CRISIS_HOURS":
      return "train";
    case "CRISIS_HANDS":
      return "note";
    case "CRISIS_WIRES":
      return "telegram";
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
    case "ENDING_CRISIS_STRAND":
      return "cord";
    case "ENDING_NET_CLOSES":
      return "yard";
    case "ENDING_NAPOLEON_ESCAPES":
      return "ship";
    case "ENDING_THE_WOMAN":
      return "portrait";
    case "ENDING_THE_STRONGBOX":
      return "strongbox";
    case "ENDING_THE_KING_WAITS":
      return "envelope";
    case "ENDING_THE_BAND_RETURNS":
      return "snake";
    case "ENDING_THE_WHISTLE_MISSED":
      return "candle";
    case "ENDING_THE_DOCTOR_LIVES":
      return "bag";
    case "ENDING_THE_CHRISTMAS_MERCY":
      return "goose";
    case "ENDING_THE_STONE_RETURNED":
      return "cuffs";
    case "ENDING_THE_STONE_LOST":
      return "hat";
    case "ENDING_THE_LEAGUE_DISSOLVED":
      return "vault";
    case "ENDING_THE_TUNNEL_OPEN":
      return "tunnel";
    case "ENDING_THE_ENCYCLOPAEDIA":
      return "book";
    case "ENDING_THE_FALL":
      return "falls";
    case "ENDING_FATAL_SHOT":
    case "ENDING_WATSON_STANDS":
      return "rifle";
    case "ENDING_REASON_OF_STATE":
    case "ENDING_HER_MAJESTYS_SERVICE":
      return "crown";
    case "ENDING_THE_SECOND_LEDGER":
      return "ledger";
    case "ENDING_PRIVATE_WAR":
      return "wharf";
    case "ENDING_BAKER_STREET_BURNS":
      return "flames";
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

/** The plate on a card (ink on paper) or, with tone="light", on the dark ground (the title screen). */
export function PlateView({ id, tone = "ink" }: { id: PlateId; tone?: "ink" | "light" }) {
  return <div className={`mb-4 mx-auto max-w-xs ${tone === "light" ? "text-brass-bright" : ""}`}>{PLATES[id]}</div>;
}
