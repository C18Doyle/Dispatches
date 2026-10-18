import { SCENE_DATES } from "./calendar_dates";

/**
 * The calendar tab: where the scene you are in falls in the winter and spring of 1891, and how long to the next date that matters on your road.
 * Dates are written the UK way (4 January 1891) wherever they are shown.
 */

const DAY = 86400000;
const START = Date.UTC(1891, 0, 1);
const WINDOW = 84; // days drawn: twelve weeks, starting three weeks before the scene
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Milestone {
  date: string;
  label: string;
  /** Roads (branch ids) this date matters on; absent means all of them. */
  roads?: string[];
}

export const MILESTONES: Milestone[] = [
  { date: "1891-01-04", label: "The first thread" },
  { date: "1891-04-24", label: "The Professor calls" },
  { date: "1891-04-27", label: "Monday's raids" },
  { date: "1891-05-01", label: "The Cabinet Room", roads: ["MYCROFT"] },
  { date: "1891-05-04", label: "The Reichenbach Falls", roads: ["WEB", "CONTINENT"] },
  { date: "1891-05-05", label: "The Limehouse wharf", roads: ["STREET"] },
  { date: "1891-06-08", label: "The trial", roads: ["YARD"] },
  { date: "1891-06-19", label: "The house in Hackney", roads: ["YARD"] },
];

const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
export const formatDate = (iso: string) => {
  const t = new Date(parse(iso));
  return `${WEEKDAYS[t.getUTCDay()]} ${t.getUTCDate()} ${MONTH_NAMES[t.getUTCMonth()]} ${t.getUTCFullYear()}`;
};
const dayOf = (iso: string) => Math.round((parse(iso) - START) / DAY);

export function CalendarView({ nodeId, branch }: { nodeId: string; branch: string }) {
  const iso = SCENE_DATES[nodeId];
  if (!iso) return null;
  const today = dayOf(iso);
  const mine = MILESTONES.filter((m) => !m.roads || m.roads.includes(branch));
  const upcoming = mine.find((m) => dayOf(m.date) >= today);
  const toNext = upcoming ? dayOf(upcoming.date) - today : null;
  const away = today > 190;
  const from = Math.max(0, today - 21);
  const x = (day: number) => 12 + ((Math.max(from, Math.min(from + WINDOW, day)) - from) / WINDOW) * 336;
  const inWindow = (day: number) => day >= from && day <= from + WINDOW;
  const label =
    away && iso >= "1894" ? "April 1894" : away ? (iso.startsWith("1892") ? "Spring 1892" : "1893") : formatDate(iso);
  return (
    <div>
      <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-1">The Calendar</p>
      <p className="text-base font-semibold mb-2">{label}</p>
      {away ? (
        <p className="text-sm text-ink/85">The years away. The case is closed in London, and the calendar has stopped counting days.</p>
      ) : (
        <>
          <svg viewBox="0 0 360 86" className="w-full h-auto text-ink" aria-hidden="true" focusable="false">
            <line x1="12" y1="46" x2="348" y2="46" stroke="currentColor" strokeWidth="1.5" />
            {Array.from({ length: WINDOW + 1 }, (_v, i) => from + i)
              .filter((d) => new Date(START + d * DAY).getUTCDay() === 1)
              .map((d) => {
                const t = new Date(START + d * DAY);
                return (
                  <g key={d}>
                    <line x1={x(d)} y1="41" x2={x(d)} y2="51" stroke="currentColor" strokeWidth="1" />
                    <text x={x(d)} y="62" fontSize="7" textAnchor="middle" fill="currentColor" opacity="0.7" style={{ fontFamily: "Rokkitt, Georgia, serif" }}>
                      {t.getUTCDate()} {MONTH_NAMES[t.getUTCMonth()].slice(0, 3)}
                    </text>
                  </g>
                );
              })}
            {mine.filter((m) => inWindow(dayOf(m.date))).map((m, i) => (
              <g key={m.date}>
                <path d={`M${x(dayOf(m.date))} 40l4 6-4 6-4-6Z`} fill={dayOf(m.date) < today ? "#6b4f24" : "#7b2a1d"} />
                <text
                  x={x(dayOf(m.date))}
                  y={i % 2 ? 76 : 32}
                  fontSize="7.5"
                  textAnchor={x(dayOf(m.date)) > 300 ? "end" : x(dayOf(m.date)) < 60 ? "start" : "middle"}
                  fill="currentColor"
                  style={{ fontFamily: "Rokkitt, Georgia, serif" }}
                >
                  {m.label}
                </text>
              </g>
            ))}
            <path d={`M${x(today)} 22l-4-8h8Z`} fill="#b8893f" stroke="#241b13" strokeWidth="0.8" />
            <line x1={x(today)} y1="22" x2={x(today)} y2="46" stroke="#b8893f" strokeWidth="1.2" strokeDasharray="2 2" />
          </svg>
          {upcoming && (
            <p className="text-sm text-ink/90 mt-1">
              {toNext === 0 ? "Today: " : toNext === 1 ? "Tomorrow: " : `In ${toNext} days: `}
              <span className="font-semibold">{upcoming.label}</span>, {formatDate(upcoming.date)}.
            </p>
          )}
          <ul className="mt-2 text-xs text-ink/75 space-y-0.5">
            {mine.map((m) => (
              <li key={m.date} className={dayOf(m.date) < today ? "line-through opacity-60" : ""}>
                {formatDate(m.date)}: {m.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
