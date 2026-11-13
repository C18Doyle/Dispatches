// ---------- THE APP SHELL (Dispatches WW2) ----------
// What sits around the files rather than in them: the settings (shown on the opening screen and in the in-run menu), the in-run menu
// with its three save slots, the war journal, the records across runs, the keyboard and controller, and the crash reports.

// The settings kept between visits, full screen, crash reports and the keyboard and controller are in src/shell-core.js (a module).

// ---- Settings ----
/**
 * The rows of the settings, on the opening screen and in the in-run menu. `idp` keeps the labels' ids apart when both could be on a page.
 * "Always let my staff plan battles" and "Keep crash reports" keep themselves; the rest belong to the app.
 */
function SettingsRows({ idp = "setting-", instantText, onToggleInstant, soundOn, onToggleSound, fontScale, onCycleFontScale, reducedMotion, onToggleReducedMotion, musicOn, onToggleMusic, musicVolume, onMusicVolumeChange, dyslexia, onToggleDyslexia, night, onToggleNight }) {
  const language = getLanguage();
  // "Always let my staff plan battles": off until asked for. The battle screens read the same key.
  const STAFF_KEY = "dispatchesWW2_staff_plans";
  const [staffAlways, setStaffAlways] = useState(() => {
    try {
      return window.localStorage.getItem(STAFF_KEY) === "1";
    } catch (e) {
      return false;
    }
  });
  function toggleStaffAlways() {
    const next = !staffAlways;
    setStaffAlways(next);
    try {
      if (next) window.localStorage.setItem(STAFF_KEY, "1");
      else window.localStorage.removeItem(STAFF_KEY);
    } catch (e) {
      /* storage can be blocked; the setting then lasts only until the page is closed */
    }
  }
  const [crashOn, setCrashOn] = useKeptSetting(CRASH_OPT_IN_KEY, false);
  const fs = useFullscreen();
  const toggleCls = "border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]";
  const labelCls = "text-xs uppercase tracking-[0.25em] font-bold text-[#000000]";
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  return (
    <>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "instant-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Instant text (skip typewriter)")}
          </span>
          <button
            onClick={onToggleInstant}
            aria-pressed={instantText}
            aria-labelledby={idp + "instant-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {instantText ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "sound-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Sound (typewriter, stamps, dice, battle reports)")}
          </span>
          <button
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-labelledby={idp + "sound-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {soundOn ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
          <span id={idp + "language-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Language")}
            {language !== "en" && (
              <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {t("Menus, buttons and help are translated. The story text is in English.")}
              </span>
            )}
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-labelledby={idp + "language-label"}
            className="border-2 border-black px-3 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} lang={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "textsize-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Text size")}
          </span>
          <button
            onClick={onCycleFontScale}
            aria-labelledby={idp + "textsize-label"}
            aria-label={t("Text size: {p}. Activate to cycle to the next size.", { p: fontScaleName(fontScale) })}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {fontScaleName(fontScale)}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "dyslexia-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Dyslexia-friendly typeface")}
          </span>
          <button
            onClick={onToggleDyslexia}
            aria-pressed={!!dyslexia}
            aria-labelledby={idp + "dyslexia-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {dyslexia ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "night-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Night reading (a dark page)")}
          </span>
          <button
            onClick={onToggleNight}
            aria-pressed={!!night}
            aria-labelledby={idp + "night-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {night ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "reducedmotion-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Reduce motion (stamp tilt, transitions)")}
          </span>
          <button
            onClick={onToggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-labelledby={idp + "reducedmotion-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {reducedMotion ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
          <span id={idp + "staff-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Always let my staff plan battles")}
            <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {t("The staff plan and fight every battle for you. Off by default.")}
            </span>
          </span>
          <button
            onClick={toggleStaffAlways}
            aria-pressed={staffAlways}
            aria-labelledby={idp + "staff-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {staffAlways ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span id={idp + "music-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {t("Music")}
            </span>
            <button
              onClick={onToggleMusic}
              aria-pressed={musicOn}
              aria-labelledby={idp + "music-label"}
              className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {musicOn ? t("On") : t("Off")}
            </button>
          </div>
          {musicOn && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
              aria-label={t("Music volume, currently {p} percent", { p: Math.round(musicVolume * 100) })}
              className="w-full accent-black"
            />
          )}
        </div>      {fs.can && (
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "fullscreen-label"} className={labelCls} style={mono}>
            {t("Full screen")}
          </span>
          <button onClick={fs.toggle} aria-pressed={fs.on} aria-labelledby={idp + "fullscreen-label"} className={toggleCls} style={mono}>
            {fs.on ? t("On") : t("Off")}
          </button>
        </div>
      )}
      <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
        <span id={idp + "crash-label"} className={labelCls} style={mono}>
          {t("Keep crash reports")}
          <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {t("If the file is damaged, keep a short report of what went wrong (the command, the report, the error, the browser and the language) on this machine, to copy or save and send to the developer. Off by default; nothing is sent by itself.")}
          </span>
        </span>
        <button onClick={() => setCrashOn(!crashOn)} aria-pressed={!!crashOn} aria-labelledby={idp + "crash-label"} className={toggleCls} style={mono}>
          {crashOn ? t("On") : t("Off")}
        </button>
      </div>
    </>
  );
}

// ---- The in-run menu ----
function ShellButton({ children, onClick, hotkey, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-hotkey={hotkey}
      aria-label={label}
      className="w-full text-left border-2 border-black px-4 py-3 text-xs uppercase tracking-[0.2em] font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] disabled:opacity-40"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {children}
    </button>
  );
}

/** A modal sheet over the game: the in-run menu and the war journal use it. Focus goes to its heading and returns on close. */
function ShellSheet({ title, onClose, children }) {
  const headingRef = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    if (headingRef.current) headingRef.current.focus();
    return () => {
      if (back && back.focus) back.focus();
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.75)] flex justify-center items-start overflow-y-auto px-4 py-8">
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white text-black w-full max-w-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl uppercase outline-none" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-black px-3 py-1 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {t("Close")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * The menu during a run: back to the file, the war journal, the three save slots (at a briefing, where a save is a clean place to
 * resume), save and leave for the opening screen, the settings, and the keys and controller buttons.
 */
function InRunMenu({ campaign, canSave, slots, onSaveSlot, onClose, onJournal, onSaveAndHome, settings }) {
  const [names, setNames] = useState({});
  const [savedTo, setSavedTo] = useState(null);
  const sectionHead = (s) => (
    <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mt-5 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {s}
    </div>
  );
  return (
    <ShellSheet title={t("Menu")} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <ShellButton onClick={onClose} hotkey="1">{t("1 · Back to the file")}</ShellButton>
        <ShellButton onClick={onJournal} hotkey="2">{t("2 · The war journal")}</ShellButton>
        <ShellButton onClick={onSaveAndHome} hotkey="3" disabled={!canSave}>{t("3 · Save and return to the opening screen")}</ShellButton>
      </div>

      {sectionHead(t("Save to a slot"))}
      {!canSave && (
        <p className="text-[13px] italic mb-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {t("A file can be saved to a slot at a briefing, before the order is given.")}
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {slots.map((s) => {
          const fallback = s.run ? s.run.slotName || CAMPAIGNS[s.run.campaignId]?.name : "";
          return (
            <li key={s.n} className="border-2 border-black p-2">
              <div className="text-[12px] mb-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {s.run
                  ? t("Slot {n}: {name}, {length} decisions", { n: s.n, name: fallback || t("unnamed"), length: (s.run.log || []).length })
                  : t("Slot {n}: empty", { n: s.n })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={40}
                  value={names[s.n] ?? ""}
                  onChange={(e) => setNames({ ...names, [s.n]: e.target.value })}
                  placeholder={t("Name (optional)")}
                  aria-label={t("Name for slot {n}", { n: s.n })}
                  disabled={!canSave}
                  className="flex-1 min-w-0 border-2 border-black px-2 py-1 text-[13px] disabled:opacity-40"
                  style={{ fontFamily: "'Courier Prime', monospace" }}
                />
                <button
                  onClick={async () => {
                    const ok = await onSaveSlot(s.n, (names[s.n] || "").trim() || `${campaign.name}`);
                    setSavedTo(ok ? s.n : -s.n);
                  }}
                  disabled={!canSave}
                  className="border-2 border-black px-3 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] disabled:opacity-40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {s.run ? t("Overwrite") : t("Save here")}
                </button>
              </div>
              {savedTo === s.n && <div role="status" className="text-[12px] mt-1 font-bold">{t("Saved.")}</div>}
              {savedTo === -s.n && <div role="status" className="text-[12px] mt-1 font-bold text-[#7a2e2e]">{t("The save failed: the browser's storage may be full or blocked.")}</div>}
            </li>
          );
        })}
      </ul>

      {sectionHead(t("Settings"))}
      <div className="flex flex-col gap-3">
        <SettingsRows idp="menu-setting-" {...settings} />
      </div>

      {sectionHead(t("Keys and controller"))}
      <dl className="text-[13px] grid grid-cols-[auto_1fr] gap-x-3 gap-y-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
        {[...KEY_HELP, ...PAD_HELP].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{k}</dt>
            <dd>{t(v)}</dd>
          </div>
        ))}
      </dl>
    </ShellSheet>
  );
}

// ---- The war journal ----
/** The orders given so far in this file, newest first: what was chosen, what the record did, the odds faced, and the allocations. */
function WarJournal({ campaign, log, flags, onClose }) {
  const entries = (log || []).map((e, i) => ({ ...e, n: i + 1 })).reverse();
  return (
    <ShellSheet title={t("War Journal")} onClose={onClose}>
      <p className="text-[13px] mb-3" style={{ fontFamily: "'Courier Prime', monospace" }}>
        {t("{name} · {length} {length, plural, one {order} other {orders}} on file", { name: campaign.name, length: entries.length })}
      </p>
      {campaign.id === "american" && allocationRecord(flags).length > 0 && (
        <div className="mb-4 border-2 border-black p-3">
          <div className="text-xs uppercase tracking-[0.25em] font-bold mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Allocation of effort")}
          </div>
          <EffortRecord flags={flags} accent={campaign.accent} />
        </div>
      )}
      {entries.length === 0 ? (
        <p className="text-[13px] italic" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {t("No order has been given yet.")}
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {entries.map((e) => (
            <li key={e.n} className="border-l-4 pl-3" style={{ borderColor: e.isHistorical ? "#2f6b3f" : campaign.accent }}>
              <div className="text-[11px] uppercase tracking-widest font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {t("{n}. {date}", { n: e.n, date: e.date || "" })}
              </div>
              <div className="text-[15px] font-bold" style={{ fontFamily: "Oswald, sans-serif" }}>
                {e.title}
              </div>
              <div className="text-[13px]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {e.label}
              </div>
              <div className="text-[12px] opacity-80 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {e.isHistorical ? t("As the record did.") : e.histLabel ? t("The record: {label}", { label: e.histLabel }) : t("The record has no order here.")}
                {typeof e.rollP === "number" ? " " + t("A roll: this outcome had a {p}% chance.", { p: Math.round(e.rollP * 100) }) : ""}
                {e.advisor ? " " + t("Advised by {name}.", { name: e.advisor }) : ""}
              </div>
            </li>
          ))}
        </ol>
      )}
    </ShellSheet>
  );
}

// ---- Records across runs ----
/**
 * The record by command and the orders most often taken against the record, for the opening screen's War Record. Read from the record
 * saveRunRecord keeps (part 45): byCommand (files closed, best rank) and departures (how often each report's record was departed from).
 * Wars closed before this was kept count in the totals above but not here.
 */
function RecordsByCommand({ record }) {
  if (!record) return null;
  const by = record.byCommand || {};
  const commands = Object.values(CAMPAIGNS).filter((c) => !c.hidden && !c.sourceOnly);
  const departures = Object.values(record.departures || {})
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const body = { fontFamily: "'Courier Prime', monospace" };
  return (
    <div className={`${paper} p-5`}>
      <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mb-2" style={mono}>
        {t("Records by Command")}
      </div>
      <table className="w-full text-[13px] text-[#000000]" style={body}>
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-widest" style={mono}>
            <th className="pr-2 font-bold">{t("Command")}</th>
            <th className="pr-2 font-bold">{t("Files closed")}</th>
            <th className="pr-2 font-bold">{t("Best rank")}</th>
            <th className="font-bold">{t("Endings")}</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((c) => {
            const r = by[c.id] || {};
            return (
              <tr key={c.id} className="border-t" style={{ borderColor: "#00000022" }}>
                <td className="pr-2 py-1 font-bold">{c.seal}</td>
                <td className="pr-2 py-1">{r.played || 0}</td>
                <td className="pr-2 py-1">{r.bestRank ? t(r.bestRank) : "—"}</td>
                <td className="py-1">{(r.endings || []).length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {departures.length > 0 && (
        <>
          <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mt-4 mb-1" style={mono}>
            {t("Where you most often depart from the record")}
          </div>
          <ol className="list-decimal pl-5 text-[13px] text-[#000000]" style={body}>
            {departures.map((d) => (
              <li key={d.campaign + d.title}>
                {t("{title} ({seal}): {count} {count, plural, one {time} other {times}}", { title: d.title, seal: CAMPAIGNS[d.campaign] ? CAMPAIGNS[d.campaign].seal : d.campaign, count: d.count })}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

// ---- The war replayed on the Pacific map ----
/**
 * The Pacific theatre map at the end of the war, with a replay: the map stepped through the date of every order given, about one a second,
 * each drawn with the flags and meters the file had then (history[i + 1] is the state after order i). The European map has the same on its
 * timeline (CheckpointMap, part 30).
 */
function PacificEndMap({ log, history, flags, meters, accent }) {
  const frames = (log || []).map((e, i) => ({ date: e.date, flags: (history && history[i + 1] && history[i + 1].flags) || flags, meters: (history && history[i + 1] && history[i + 1].meters) || meters }));
  const last = frames.length - 1;
  const [at, setAt] = useState(last);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    if (at >= last) {
      setPlaying(false);
      return undefined;
    }
    const id = setTimeout(() => setAt((i) => Math.min(i + 1, last)), 900);
    return () => clearTimeout(id);
  }, [playing, at, last]);
  if (last < 0) return null;
  const f = frames[Math.min(at, last)];
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  return (
    <div>
      <PACIFIC_MAP.PacificMap date={f.date} atEnd={at === last} flags={f.flags} meters={f.meters} accent={accent} />
      {last > 1 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (playing) return setPlaying(false);
              if (at >= last) setAt(0);
              setPlaying(true);
            }}
            aria-pressed={playing}
            aria-label={playing ? t("Pause the replay") : t("Show the war as a replay, one report at a time")}
            className="border-2 border-black px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={mono}
          >
            {playing ? t("❚❚ Pause") : t("▶ Replay the war")}
          </button>
          <input
            type="range"
            min={0}
            max={last}
            step={1}
            value={at}
            onChange={(e) => (setPlaying(false), setAt(parseInt(e.target.value, 10)))}
            aria-label={t("Timeline position {p} of {runTimelineLength}: {p2}{p3}", { p: at + 1, runTimelineLength: last + 1, p2: localiseDate(f.date) || "", p3: "" })}
            className="flex-1 accent-black"
            style={{ accentColor: accent }}
          />
          <span className="text-[10px] uppercase tracking-wider font-bold" style={{ ...mono, color: accent }}>
            {localiseDate(f.date)}
          </span>
        </div>
      )}
    </div>
  );
}

// ---- Archive photographs and music (Wikimedia Commons; assets/commons-manifest.json holds what was read at download) ----
// One photograph at the top of a key report's briefing, keyed by report id (so the British and American commands show the photograph of
// a report they share with SHAEF or CINCPAC). Each caption says when and where the photograph was taken, which is not always the report's
// own day; each credit is the one the licence asks for. Public domain: US Navy, US Coast Guard and Imperial War Museum (Crown copyright
// expired). CC BY-SA 3.0: Bundesarchiv and RIA Novosti, which ask for the archive, the image number and the licence.
const CC_BY_SA_3_DE = "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en";
const CC_BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/deed.en";
const ARCHIVE_PHOTOS = {
  caseYellow40: { caption: "A Panzer IV in France, June 1940.", credit: "Bundesarchiv, Bild 146-1981-070-15", license: "CC BY-SA 3.0 DE", licenseUrl: CC_BY_SA_3_DE },
  stalingradPocket: { caption: "Ruins in Stalingrad, October 1942.", credit: "Bundesarchiv, Bild 183-B22436 / Bauer-Altvater", license: "CC BY-SA 3.0 DE", licenseUrl: CC_BY_SA_3_DE },
  moscowDefense41: { caption: "Anti-aircraft gunners on a Moscow rooftop by the Kremlin, August 1941.", credit: "RIA Novosti archive, image 887721 / Oleg Knorring", license: "CC BY-SA 3.0", licenseUrl: CC_BY_SA_3 },
  kurskDefense43: { caption: "Soviet anti-tank riflemen under fire on the Kursk salient, July 1943.", credit: "RIA Novosti archive, image 4408 / Natalia Bode", license: "CC BY-SA 3.0", licenseUrl: CC_BY_SA_3 },
  tobruk42: { caption: "Italian M13/40 tanks in North Africa, May 1941.", credit: "Bundesarchiv, Bild 101I-783-0104-38 / Moosmüller", license: "CC BY-SA 3.0 DE", licenseUrl: CC_BY_SA_3_DE },
  alamein42: { caption: "Italian infantry on the march in North Africa, April 1941.", credit: "Bundesarchiv, Bild 101I-783-0104-09 / Moosmüller", license: "CC BY-SA 3.0 DE", licenseUrl: CC_BY_SA_3_DE },
  pearlHarbor41: { caption: "Japanese naval aircraft prepare to take off for Pearl Harbor, 7 December 1941.", credit: "US Navy photograph 80-G-182259, Naval History and Heritage Command", license: "Public domain", licenseUrl: null },
  midway42: { caption: "The battleship Yamato on trials, 30 October 1941. At Midway it carried Yamamoto's flag.", credit: "US Navy photograph 80-G-704702, Naval History and Heritage Command", license: "Public domain", licenseUrl: null },
  dunkirk40: { caption: "Troops queue on the beach at Dunkirk to be taken off, late May 1940.", credit: "Imperial War Museum, NYP 68075", license: "Public domain", licenseUrl: null },
  battleOfBritain40: { caption: "RAF pilots look over a shot-down German fighter. The photograph is filed with the Battle of Britain; its exact date is not recorded.", credit: "Royal Air Force official photographer, Imperial War Museum, CH 2064", license: "Public domain", licenseUrl: null },
  coralSeaMidwayAllied42: { caption: "USS Yorktown is hit by a torpedo at Midway, 4 June 1942.", credit: "US Navy photograph 80-G-414423, US National Archives", license: "Public domain", licenseUrl: null },
  omahaCrisis44: { caption: "Into the Jaws of Death: troops of the 1st Infantry Division wade ashore at Omaha Beach, 6 June 1944.", credit: "Robert F. Sargent, US Coast Guard", license: "Public domain", licenseUrl: null },
};
/** The music beyond the main score: all Holst's The Planets, in public-domain recordings by US military bands. */
const MUSIC_TRACKS = {
  menu: { src: "assets/music/menu-mars.ogg", type: 'audio/ogg; codecs="vorbis"', title: "Holst, Mars, the Bringer of War", by: "United States Air Force Band (Heritage of America Band)" },
  pacific: { src: "assets/music/pacific-neptune.opus", type: 'audio/ogg; codecs="opus"', title: "Holst, Neptune, the Mystic", by: "“The President's Own” United States Marine Band" },
  end: { src: "assets/music/end-saturn.opus", type: 'audio/ogg; codecs="opus"', title: "Holst, Saturn, the Bringer of Old Age", by: "“The President's Own” United States Marine Band" },
};
/**
 * The music for the screen: Mars on the opening screen, Neptune through the Japanese command's file, Saturn at the end of a war, and the
 * main score everywhere else. Opened from a file on disk (file://) the browser plays only the score built into the page (the tracks would
 * be silent through the volume control), and a browser that cannot play a track's format keeps the score too.
 */
function musicSrcFor(screen, campaignId) {
  const key = screen === "select" ? "menu" : screen === "end" ? "end" : campaignId === "japan" ? "pacific" : null;
  if (!key || typeof window === "undefined" || window.location.protocol === "file:") return MUSIC_TRACK_SRC;
  const track = MUSIC_TRACKS[key];
  try {
    const probe = document.createElement("audio");
    if (!probe.canPlayType || !probe.canPlayType(track.type)) return MUSIC_TRACK_SRC;
  } catch (e) {
    return MUSIC_TRACK_SRC;
  }
  return track.src;
}

/** A report's archive photograph, with its caption and credit, if it has one. */
function ArchivePhoto({ nodeId }) {
  const p = ARCHIVE_PHOTOS[nodeId];
  const [failed, setFailed] = useState(false);
  if (!p || failed) return null;
  return (
    <figure className="mb-4 border-2 border-black bg-[#f2ead9]">
      <img src={`assets/photos/${nodeId}.jpg`} alt={p.caption} loading="lazy" className="w-full h-auto block" style={{ filter: "grayscale(0.15) contrast(1.02)" }} onError={() => setFailed(true)} />
      <figcaption className="px-3 py-2 text-[12px] leading-snug text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
        {p.caption}
        <span className="block text-[10px] uppercase tracking-wider opacity-75 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {p.credit} ·{" "}
          {p.licenseUrl ? (
            <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {p.license}
            </a>
          ) : (
            p.license
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/** The credits for the photographs and the music, for the opening screen's Credits. */
function ArchiveCredits() {
  return (
    <div className="mt-3 text-[13px] leading-snug text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
      <p className="font-bold mb-1">{t("Photographs")}</p>
      <ul className="mb-3 list-disc pl-5">
        {Object.entries(ARCHIVE_PHOTOS).map(([id, p]) => (
          <li key={id}>
            {p.caption} {p.credit}, {p.licenseUrl ? <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{p.license}</a> : p.license}.
          </li>
        ))}
      </ul>
      <p className="font-bold mb-1">{t("Music")}</p>
      <ul className="list-disc pl-5">
        <li>{t("Main score: Hyteck9.")}</li>
        {Object.values(MUSIC_TRACKS).map((m) => (
          <li key={m.src}>
            {m.title}, {m.by}. {t("Public domain.")}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[12px] opacity-80">{t("Photographs and recordings from Wikimedia Commons. A CC BY-SA photograph may be reused under the same licence, with the credit given here.")}</p>
    </div>
  );
}

