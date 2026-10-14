import { evalCondition } from "@dispatches/engine";
import type { GameState } from "@dispatches/engine";
import type { SeatMap } from "./seat";

type PlaceState = "held" | "sealed" | "safe" | null;

/**
 * A sketch of the journey, redrawn from the state: where the scene is set, which lairs are held, sealed or safe. The drawing is for the eye; the list under it says
 * the same in words, so nothing depends on seeing the picture.
 */
export default function RouteMap({ map, state, headingId }: { map: SeatMap; state: GameState; headingId: string }) {
  const at = map.at[state.currentNodeId] ?? map.defaultAt;
  const place = (id: string) => map.places.find((p) => p.id === id);
  const stateOf = (id: string): PlaceState => {
    let s: PlaceState = null;
    for (const r of map.states) if (r.place === id && evalCondition(r.when, state)) s = r.state;
    return s;
  };
  const fill = (s: PlaceState) => (s === "sealed" ? "fill-blood-bright" : s === "held" ? "fill-verdigris-bright" : s === "safe" ? "fill-brass" : "fill-ink-soft");
  const described = map.places
    .map((p) => ({ p, s: stateOf(p.id) }))
    .filter((x) => x.s || x.p.id === at);
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="font-heading text-sm uppercase tracking-widest text-blood font-bold mb-1">
        {map.heading}
      </h2>
      <p className="font-heading text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft mb-2">{map.note}</p>
      <svg viewBox="0 0 100 90" className="w-full h-auto" aria-hidden="true" focusable="false">
        {map.routes.map(([a, b]) => {
          const pa = place(a);
          const pb = place(b);
          if (!pa || !pb) return null;
          return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="stroke-ink-soft" strokeWidth="0.5" strokeDasharray="1.6 1.2" />;
        })}
        {map.places.map((p) => {
          const s = stateOf(p.id);
          const here = p.id === at;
          const labelLeft = p.x > 70;
          return (
            <g key={p.id}>
              {here && <circle cx={p.x} cy={p.y} r="4.6" className="fill-none stroke-ink" strokeWidth="0.7" />}
              <circle cx={p.x} cy={p.y} r="2.4" className={fill(s)} />
              <text x={labelLeft ? p.x - 4 : p.x + 4} y={p.y + 1.1} textAnchor={labelLeft ? "end" : "start"} fontSize="3.2" className="fill-ink" stroke="rgb(236,231,214)" strokeWidth="1.1" strokeLinejoin="round" style={{ fontFamily: "Cinzel, Georgia, serif", paintOrder: "stroke" }}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="mt-2 space-y-0.5 text-sm text-ink/90">
        {described.map(({ p, s }) => (
          <li key={p.id}>
            <span className="font-semibold">{p.label}</span>
            {p.id === at ? ", where you are" : ""}
            {s ? `: ${map.stateLabels[s]}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
