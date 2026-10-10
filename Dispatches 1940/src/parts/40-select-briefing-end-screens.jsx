function SelectScreen({ onChooseCampaign, onResume, onStartGrand, instantText, onToggleInstant, soundOn, onToggleSound, fontScale, onCycleFontScale, reducedMotion, onToggleReducedMotion, musicOn, onToggleMusic, musicVolume, onMusicVolumeChange }) {
  const [record, setRecord] = useState(null);
  const [activeRun, setActiveRun] = useState(null);
  // "Always let my staff plan battles": off until asked for. The battle screens read the same key.
  const STAFF_KEY = "dispatches1940_staff_plans";
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
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("ww2-command-record");
        if (result && result.value) setRecord(JSON.parse(result.value));
      } catch (e) {
        setRecord(null);
      }
      try {
        const active = await window.storage.get("ww2-command-active");
        if (active && active.value) {
          const parsed = migrateSave(JSON.parse(active.value));
          if (isValidActiveRun(parsed)) {
            setActiveRun(parsed);
          } else {
            setActiveRun(null);
            clearActiveRun(); // stale/incompatible save — clean it up rather than leave it dangling
          }
        }
      } catch (e) {
        setActiveRun(null);
      }
    })();
  }, []);

  const runs = record ? record.runs || [] : [];
  const discovered = record ? (record.nodes || []).length : 0;
  const endings = record ? [...new Set(runs.map((r) => r.label).filter(Boolean))] : [];
  const earnedObjectiveCount = record && record.objectives ? record.objectives.length : 0;
  const objectivesComplete =
    !!record && !!record.objectives && OBJECTIVES.every((o) => record.objectives.includes(o.id));

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-8">
        <div
          className="text-[#ffffff] uppercase tracking-[0.35em] text-xs mb-3 font-semibold"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Restricted: Command Eyes Only
        </div>
        <h1
          className="text-[#ffffff] text-4xl sm:text-6xl uppercase tracking-wide"
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}
        >
          Dispatches 1940
        </h1>
        {DEMO_BUILD && (
          <div
            className="inline-block mt-2 border-2 px-3 py-1 uppercase tracking-[0.2em] text-[11px] font-bold"
            style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#e39a9a", color: "#e39a9a" }}
          >
            Free Demo: OKW Command Only
          </div>
        )}
        <div className="mx-auto mt-3 mb-3 h-[2px] w-40 bg-[#ffffff]" />
        <p
          className="text-[#ffffff] max-w-md mx-auto text-[15px]"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          Choose a high command and endeavor to lead your armies to victory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        {activeRun && CAMPAIGNS[activeRun.campaignId] && (
          <button
            onClick={() => onResume(activeRun)}
            className={`${paper} text-left p-5 hover:-translate-y-1 transition-transform duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]`}
          >
            <div
              className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mb-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              ↻ War in Progress
            </div>
            <p className="text-[14px] text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {CAMPAIGNS[activeRun.campaignId].name}
              {activeRun.mode && activeRun.mode !== "open"
                ? ` · ${warRoomModeInfo(activeRun.mode, activeRun.campaignId).label}`
                : ""}{" "}
              ·{" "}
              {(activeRun.log || []).length} decisions on file: resume where you left off.
              {activeRun.battle && (() => { const t = KEY_BATTLE_TITLES.find((x) => x.id === activeRun.battle.configId); return t ? ` You were part way through ${t.title}.` : ""; })()}
            </p>
          </button>
        )}
        {Object.values(CAMPAIGNS)
          .filter((c) => !c.hidden)
          .map((c) => {
            const unlocked = !DEMO_BUILD || DEMO_UNLOCKED_CAMPAIGNS.includes(c.id);
            const body = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Stamp text={c.seal} color={c.accent} campaignId={c.id} />
                    <h2 className="text-2xl mt-3 leading-tight" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}>
                      {c.name}
                    </h2>
                    <div className="text-xs uppercase tracking-widest mt-1 text-[#000000] font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {c.dates}
                    </div>
                  </div>
                  <span aria-hidden="true" className="text-lg text-[#000000] shrink-0 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {unlocked ? "▸" : null}
                  </span>
                </div>
                <p className="text-[14px] leading-snug text-[#000000] mt-3" style={{ fontFamily: "'Courier Prime', monospace" }}>
                  {c.brief}
                </p>
                <div className="text-[11px] uppercase tracking-widest border-t-2 pt-2 mt-3 text-[#000000] font-semibold" style={{ borderColor: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {{ german: "20–35+ decisions", soviet: "25–30+ decisions", allied: "25–30+ decisions", italy: "~30 decisions" }[c.id] || "decisions"}
                  {unlocked ? "" : " · included in the full version"}
                </div>
              </>
            );
            return unlocked ? (
              <button
                key={c.id}
                onClick={() => onChooseCampaign(c.id)}
                className={`${paper} text-left p-5 hover:-translate-y-1 transition-transform duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]`}
              >
                {body}
              </button>
            ) : (
              <div key={c.id} className={`${paper} text-left p-5 opacity-60 select-none`} aria-disabled="true">
                {body}
              </div>
            );
          })}

        {Object.values(CAMPAIGNS)
          .filter((c) => c.hidden)
          .map((c) => (
            <div
              key={c.id}
              className={`${paper} text-left p-5 opacity-50 select-none relative overflow-hidden`}
              aria-disabled="true"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Stamp text={c.seal} color={c.accent} campaignId={c.id} />
                  <h2
                    className="text-xl mt-3 leading-tight"
                    style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
                  >
                    {c.name}
                  </h2>
                </div>
                <div
                  className="border-[3px] border-black px-2 py-1 uppercase tracking-[0.2em] text-[10px] font-bold rotate-[6deg]"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Sealed: In Preparation
                </div>
              </div>
            </div>
          ))}

        {GRAND_CAMPAIGN_ENABLED && (
          <button
            onClick={onStartGrand}
            className="border-2 border-dashed text-left p-5 hover:-translate-y-1 transition-transform duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ borderColor: "#b08d3f", background: "#fffdf7" }}
          >
            <div
              className="text-xs uppercase tracking-[0.25em] font-bold mb-1"
              style={{ color: "#b08d3f", fontFamily: "'IBM Plex Mono', monospace" }}
            >
              ⚑ Prototype: Internal Only
            </div>
            <h2 className="text-xl leading-tight text-[#000000]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}>
              Grand Campaign
            </h2>
            <p className="text-[13px] mt-1 text-[#000000] opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
              German → Soviet → Allied, chained: how your German war went seeds how your Soviet
              war starts, and so on. Fixed order, Standard Issue rules only. Not in the itch
              build: this entry point only exists in this dev build.
            </p>
          </button>
        )}

        {objectivesComplete && (
          <div className={`${paper} p-5`} style={{ borderTop: "4px solid #b08d3f" }}>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div
                className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Command Record: Closed File
              </div>
              <Stamp text="Full Clearance" color="#b08d3f" campaignId="allied" />
            </div>
            <p
              className="text-[14px] leading-relaxed text-[#000000] whitespace-pre-line"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              {FULL_CLEARANCE_DEBRIEF}
            </p>
          </div>
        )}

        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.3em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            War Record
          </summary>
          <div className="mt-3 flex flex-col gap-3">
        {runs.length > 0 && (
          <div className={`${paper} p-5`}>
            <div
              className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mb-2"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Command Record
            </div>
            <p className="text-[14px] text-[#000000] mb-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {runs.length} {runs.length === 1 ? "war" : "wars"} fought · {Math.min(discovered, NODE_TOTAL)} of{" "}
              {NODE_TOTAL} situation reports discovered · {endings.length}{" "}
              {endings.length === 1 ? "ending" : "endings"} reached
            </p>
            {runs.slice(-3).reverse().map((r, i) => (
              <div
                key={i}
                className="text-[12px] text-[#000000] border-l-4 pl-2 mb-1"
                style={{ borderColor: "#7a2e2e", fontFamily: "'Courier Prime', monospace" }}
              >
                {r.mode === "iron" ? "⚔ " : r.mode === "purge" ? "☭ " : r.mode === "coalition" ? "★ " : r.mode === "axis" ? "⚖ " : ""}{r.label || "War concluded"}: ended {r.endDate || "—"}{r.rank ? ` · ${r.rank}` : ""}
              </div>
            ))}
          </div>
        )}
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Objectives · {earnedObjectiveCount} of {OBJECTIVES.length}{objectivesComplete ? " · ★ full clearance" : ""}
          </summary>
          <div className="mt-3">
            {OBJECTIVES.map((o) => {
              const done = record && record.objectives && record.objectives.includes(o.id);
              return (
                <div
                  key={o.id}
                  className="text-[13px] text-[#000000] border-l-4 pl-2 mb-2"
                  style={{
                    borderColor: done ? "#b08d3f" : "#00000033",
                    opacity: done ? 1 : 0.6,
                    fontFamily: "'Courier Prime', monospace",
                  }}
                >
                  {done ? "★" : "☆"} <b>{o.title}</b>: {o.desc}
                </div>
              );
            })}
          </div>
        </details>
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Endings Gallery: {ENDINGS_GALLERY.filter((e) => endings.includes(e.label)).length} of {ENDINGS_GALLERY.length} named endings
          </summary>
          <div className="mt-3">
            {ENDINGS_GALLERY.map((e, i) => {
              const found = endings.includes(e.label);
              return (
                <div key={i} className="flex items-baseline gap-2 mb-1 text-[13px]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#000000] opacity-50 w-14 shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {e.campaign}
                  </span>
                  {found ? (
                    <>
                      <span className="font-bold text-[#000000]">{e.label}</span>
                      <EndingTierBadge tier={e.tier} />
                    </>
                  ) : (
                    <span className="text-[#000000] opacity-60">Not yet reached: <i>{e.hint}</i></span>
                  )}
                </div>
              );
            })}
            {endings.filter((l) => !ENDINGS_GALLERY.some((e) => e.label === l)).length > 0 && (
              <p className="text-[12px] italic mt-2 text-[#000000] opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
                + {endings.filter((l) => !ENDINGS_GALLERY.some((e) => e.label === l)).length} other{" "}
                {endings.filter((l) => !ENDINGS_GALLERY.some((e) => e.label === l)).length === 1 ? "conclusion" : "conclusions"} reached.
              </p>
            )}
          </div>
        </details>
        {/* Round 22: the Battle Record: every Order of Battle fought, with the enemy setups met, the best
            result, and what the player did last time (commander and field decisions). A log, not a
            hint: the setups are drawn at random, so having met one says nothing about the next. */}
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Battle Record: {KEY_BATTLE_TITLES.filter((b) => record?.battles?.[b.id]).length} of {KEY_BATTLE_TITLES.length} battles fought
          </summary>
          <div className="mt-3">
            {KEY_BATTLE_TITLES.map((b) => {
              const r = record?.battles?.[b.id];
              const roster = KEY_BATTLE_POSTURES[b.id] || [];
              const commander = r?.last?.commander ? (KEY_BATTLE_COMMANDERS[b.id] || []).find((c) => c.id === r.last.commander) : null;
              return (
                <div key={b.id} className="border-l-4 pl-2 mb-3" style={{ borderColor: r ? "#b08d3f" : "#00000033", fontFamily: "'Courier Prime', monospace" }}>
                  <div className="text-[13px] text-[#000000]">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 mr-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {b.seal}
                    </span>
                    {r ? <b>{b.title}</b> : <span className="opacity-40">████████████</span>}
                  </div>
                  {r && (
                    <div className="text-[12px] text-[#000000] leading-snug">
                      <div>
                        Fought {r.fought} {r.fought === 1 ? "time" : "times"} · won {r.won} · best result: {r.best === "clean" ? "a clean win" : r.best === "costly" ? "a costly win" : r.best === "marginal" ? "a close loss" : "a heavy loss"}
                      </div>
                      <div>
                        Enemy setups met: {r.setups.length} of {roster.length}
                        {r.setups.length > 0 && <> ({r.setups.map((id) => roster.find((p) => p.id === id)?.name || id).join("; ")})</>}
                      </div>
                      {r.last && (
                        <div className="opacity-80">
                          Last time: {r.last.won ? "won" : "lost"}
                          {commander ? `, under ${commander.name}` : ""}
                          {r.last.decisions && r.last.decisions.length > 0 ? `. Field decision: ${r.last.decisions.join("; ")}` : ""}.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </details>
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Discovery Atlas: {Math.min(discovered, NODE_TOTAL)} of {NODE_TOTAL} situation reports
          </summary>
          <div className="mt-3">
            {[
              { key: "german", label: "OKW: German Command" },
              { key: "soviet", label: "STAVKA: Soviet Command" },
              { key: "allied", label: "SHAEF: Allied Command" },
              { key: "italy", label: "COMANDO SUPREMO: Italy" },
            ].map((grp) => {
              const nodes = NODE_ATLAS[grp.key] || [];
              const seen = nodes.filter((n) => (record?.nodes || []).includes(n.id)).length;
              return (
                <details key={grp.key} className="mb-2 border-l-4 pl-2" style={{ borderColor: "#00000033" }}>
                  <summary
                    className="text-[12px] uppercase tracking-widest font-bold text-[#000000] cursor-pointer select-none py-1"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {grp.label} · {seen}/{nodes.length}
                  </summary>
                  <div className="mt-1">
                    {nodes.map((n) => {
                      const found = (record?.nodes || []).includes(n.id);
                      return (
                        <div key={n.id} className="flex items-baseline gap-2 text-[12px] mb-[2px]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                          <span className="text-[10px] text-[#000000] opacity-50 w-32 shrink-0 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                            {n.date}
                          </span>
                          {found ? (
                            <span className="text-[#000000]">{n.title}</span>
                          ) : (
                            <span className="text-[#000000] opacity-40">████████████</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </details>
          </div>
        </details>

        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.3em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Dossiers
          </summary>
          <div className="mt-3 flex flex-col gap-3">
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Command Dossiers · The Advisors
          </summary>
          <div className="mt-3">
            <p className="text-[12px] italic mb-3 text-[#000000] opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
              Every voice at your map table was a real person. Councils followed are tallied across all your
              wars. Quotes in the game are plausible historical fiction; the fates below are the record.
            </p>
            {[
              { key: "german", label: "German High Command" },
              { key: "soviet", label: "Soviet High Command" },
              { key: "allied", label: "Western Allied Command" },
              { key: "italy", label: "Italian High Command" },
            ].map((grp) => {
              const members = Object.entries(ADVISOR_DOSSIERS)
                .filter(([, d]) => d.faction === grp.key)
                .map(([name, d]) => ({ name, ...d, count: (record && record.advisors && record.advisors[name]) || 0 }))
                .sort((a, b) => a.rank - b.rank || b.count - a.count || a.name.localeCompare(b.name));
              return (
                <div key={grp.key} className="mb-4">
                  <div
                    className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#000000] mb-2 border-b-2 pb-1"
                    style={{ borderColor: "#00000022", fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {grp.label}
                  </div>
                  {members.map((d) => (
                    <details key={d.name} className="mb-2 border-l-4 pl-2" style={{ borderColor: d.count > 0 ? "#b08d3f" : "#00000033" }}>
                      <summary
                        className="text-[13px] font-bold text-[#000000] cursor-pointer select-none py-1"
                        style={{ fontFamily: "'Courier Prime', monospace" }}
                      >
                        {d.name}: {d.role}
                        {d.count > 0 ? ` · ${d.count} ${d.count === 1 ? "council" : "councils"} followed` : ""}
                      </summary>
                      <p className="text-[13px] text-[#000000] mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
                        {d.bio}
                      </p>
                      <p className="text-[13px] text-[#000000] mt-1 italic" style={{ fontFamily: "'Courier Prime', monospace" }}>
                        {d.fate}
                      </p>
                    </details>
                  ))}
                </div>
              );
            })}
          </div>
        </details>
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Context: Key Events of the War
          </summary>
          <div className="mt-3">
            {[
              { key: "german", label: "German High Command" },
              { key: "soviet", label: "Soviet High Command" },
              { key: "allied", label: "Western Allied Command" },
              { key: "italy", label: "Italian High Command" },
            ].map((grp) => (
              <details key={grp.key} className="mb-2 border-l-4 pl-2" style={{ borderColor: "#00000033" }}>
                <summary
                  className="text-[12px] uppercase tracking-widest font-bold text-[#000000] cursor-pointer select-none py-1"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {grp.label}
                </summary>
                <div className="mt-1">
                  {(CONTEXT_NOTES[grp.key] || []).map((c, i) => (
                    <p key={i} className="text-[13px] leading-snug text-[#000000] mb-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
                      <b>{c.term}</b>: {c.note}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>

        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Glossary: {GLOSSARY.length} terms
          </summary>
          <GlossaryList />
        </details>

        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            How to Read the Reports
          </summary>
          <div
            className="mt-3 text-[14px] leading-relaxed text-[#000000]"
            style={{ fontFamily: "'Courier Prime', monospace" }}
          >
            <p className="mb-2">
              <b>Meters.</b> Manpower, Matériel, and Initiative track your strategic position against the historical
              baseline (zero). They gate collapses, foreclose options, and decide when your war ends. Matériel is the one number the rules use for fuel, ammunition, steel, shipping and rail together; the three small readings under each meter (open one with its ▸ button) show where your decisions have been putting the weight.
            </p>
            <p className="mb-2">
              <b>⚄ Contested.</b> A handful of decisions are honestly disputed by historians. These roll
              the same choice can break differently, and rewinding re-rolls them.
            </p>
            <p className="mb-2">
              <b>Projected scenarios.</b> Anything beyond the historical record is labelled as reasoned
              projection and never claims to be what happened.
            </p>
            <p>
              <b>⚠ Speculative.</b> A very small number of branches go further: past reasoned projection
              into territory the scholarly consensus argues against. These carry a distinct amber warning,
              exist only through chains of low-probability rolls, and this campaign computes and shows you exactly
              how unlikely the path you walked was.
            </p>
          </div>
        </details>
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            The Holocaust
          </summary>
          <div className="mt-3">
            <p className="text-[13px] leading-snug mb-3 text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              This game is about the decisions of high commands. The Holocaust is not one of them, and that is deliberate. The murder of millions of people must never become a choice, a meter or a score, or something to be won or lost, so it has been kept out of the game's decisions. It is set apart here so that it is remembered for what it was: not a side event of the war, but a crime committed against real people, each with a name, a family and a life.
            </p>
            <p className="text-[13px] leading-snug mb-3 text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              From 1933 the Nazi state persecuted the Jews of Germany and took away their rights, property and livelihoods. The Nuremberg Laws followed in 1935 and the November pogrom in 1938. After the invasion of Poland in 1939, Jews were forced into ghettos. From June 1941, behind the armies that invaded the Soviet Union, mobile killing units, helped by police and army units, murdered Jewish men, women and children by shooting. In January 1942 officials met at Wannsee to coordinate the deportation and murder of the Jews of Europe, and killing centres such as Chełmno, Bełżec, Sobibór, Treblinka and Auschwitz-Birkenau were built and used for that purpose. About six million Jews were murdered, around two thirds of the Jews of Europe.
            </p>
            <p className="text-[13px] leading-snug mb-3 text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              The Nazis and their collaborators also murdered Roma and Sinti, disabled people, Soviet prisoners of war, Polish and other civilians, and many others. Soviet and Western Allied armies reached the camps between 1944 and 1945 and found the survivors and the dead. Italy took part too: Jews were persecuted under the racial laws from 1938 and, after the German occupation in 1943, deported.
            </p>
            <p className="text-[13px] leading-snug mb-3 text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              To learn more, and to read the names of those who were murdered, see Yad Vashem, the World Holocaust Remembrance Center (yadvashem.org).
            </p>
          </div>
        </details>
          </div>
        </details>

        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.3em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Settings
          </summary>
          <div className="mt-3 flex flex-col gap-3">
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id="setting-instant-label" className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Instant text (skip typewriter)
          </span>
          <button
            onClick={onToggleInstant}
            aria-pressed={instantText}
            aria-labelledby="setting-instant-label"
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {instantText ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id="setting-sound-label" className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Sound (typewriter, stamps, dice, battle reports)
          </span>
          <button
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-labelledby="setting-sound-label"
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {soundOn ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id="setting-textsize-label" className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Text size
          </span>
          <button
            onClick={onCycleFontScale}
            aria-labelledby="setting-textsize-label"
            aria-label={`Text size: ${fontScale <= 0.9 ? "Small" : fontScale >= 1.15 ? "Large" : "Normal"}. Activate to cycle to the next size.`}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {fontScale <= 0.9 ? "Small" : fontScale >= 1.15 ? "Large" : "Normal"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id="setting-reducedmotion-label" className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Reduce motion (stamp tilt, transitions)
          </span>
          <button
            onClick={onToggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-labelledby="setting-reducedmotion-label"
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {reducedMotion ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
          <span id="setting-staff-label" className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Always let my staff plan battles
            <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
              The staff plan and fight every battle for you. Off by default.
            </span>
          </span>
          <button
            onClick={toggleStaffAlways}
            aria-pressed={staffAlways}
            aria-labelledby="setting-staff-label"
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {staffAlways ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span id="setting-music-label" className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Music
            </span>
            <button
              onClick={onToggleMusic}
              aria-pressed={musicOn}
              aria-labelledby="setting-music-label"
              className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {musicOn ? "On" : "Off"}
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
              aria-label={`Music volume, currently ${Math.round(musicVolume * 100)} percent`}
              className="w-full accent-black"
            />
          )}
        </div>
          </div>
        </details>

        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.3em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Credits
          </summary>
          <div
            className="mt-3 text-[14px] leading-relaxed text-[#000000] opacity-70"
            style={{ fontFamily: "'Courier Prime', monospace" }}
          >
            <p className="not-italic mb-2">Developer: Craig Doyle</p>
            <p className="not-italic">Music: Hyteck9</p>
          </div>
        </details>

      </div>
    </div>
  );
}

// The three meters (manpower, fuel, initiative) are clamped to [-10, 10] wherever they're updated (see
// chooseOption's setMeters). A bar is one positioned block, so a change in the value moves it. With `from` (the
// value before the last decision) it opens at the old reading, marks it with a thin tick, and slides to the new
// one. Only the bar moves; the figures in the text never change, so the words on the page are the same at every
// moment. The app's reduced-motion setting and the system one both shorten the slide to nothing. `min` and `max`
// (kept symmetrical about zero) let the same bar draw a tracker with its own scale (Coalition Cohesion, German Trust).
function MeterBar({ label, value, danger, showBar = true, from, min = -10, max = 10, tag, valueLabel }) {
  const clamp = (n) => Math.max(min, Math.min(max, n));
  const clamped = clamp(value);
  const hasFrom = typeof from === "number";
  const moved = hasFrom && from !== value;
  const [arrived, setArrived] = useState(!hasFrom);
  useEffect(() => {
    if (arrived) return undefined;
    if (typeof requestAnimationFrame !== "function") {
      setArrived(true);
      return undefined;
    }
    const id = requestAnimationFrame(() => setArrived(true));
    return () => cancelAnimationFrame(id);
  }, [arrived]);
  const shown = hasFrom && !arrived ? clamp(from) : clamped;
  const unit = 50 / Math.max(-min, max);
  const fmt = (n) => (n > 0 ? "+" + n : String(n));
  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 uppercase tracking-wider text-[#000000] font-semibold shrink-0">{label}</span>
      {showBar && (
        <div
          className="relative flex-1 h-3 border border-black bg-[#e3d5ae] overflow-hidden"
          role="img"
          aria-label={`${label}: ${valueLabel || fmt(value)} on a scale from ${fmt(min)} to ${fmt(max)}${moved ? `, ${value > from ? "up" : "down"} from ${fmt(from)}` : ""}${danger ? ", critical" : ""}`}
        >
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: `${50 + Math.min(0, shown) * unit}%`,
              width: `${Math.abs(shown) * unit}%`,
              backgroundColor: shown >= 0 ? "#2f6b3f" : "#7a2e2e",
              transition: "left 800ms cubic-bezier(0.2, 0.8, 0.2, 1), width 800ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 800ms",
            }}
          />
        </div>
      )}
      <span className={`font-bold text-right shrink-0 whitespace-nowrap ${valueLabel ? "w-32" : "w-10"}`} style={{ color: danger ? "#7a2e2e" : "#000000" }}>
        {valueLabel || fmt(value)}
        {danger && !tag ? " ⚠" : ""}
      </span>
    </div>
    {/* The figures column is one width whatever it holds, so the bar is always the same size. A warning, when there is one, goes on a line of its own. */}
    {tag ? (
      <div className="text-[10px] uppercase tracking-wider font-bold mt-[2px]" style={{ paddingLeft: 88, color: /critical|dangerous/i.test(tag) ? "#7a2e2e" : "#8a5a1a" }}>
        {/critical|dangerous/i.test(tag) ? <span aria-hidden="true">⚠ </span> : null}
        {tag}
      </div>
    ) : null}
    </div>
  );
}

// A small up or down marker, green for better and red for worse, that also says so in words.
function ChangePill({ up }) {
  const colour = up ? "#2f6b3f" : "#7a2e2e";
  return (
    <>
      <span aria-hidden="true" className="inline-block border px-1 text-[10px] leading-tight font-bold" style={{ borderColor: colour, color: colour }}>
        {up ? "▲" : "▼"}
      </span>
      <span className="sr-only">{up ? " improved" : " worsened"}</span>
    </>
  );
}

const METER_ROWS = [
  { key: "manpower", label: "Manpower", dangerAt: -3 },
  { key: "fuel", label: "Matériel", dangerAt: -2 },
  { key: "initiative", label: "Initiative", dangerAt: null },
];
const BAND_COLOURS = ["#7a2e2e", "#7a2e2e", "#8a5a1a", "#000000", "#28497a"];
// Which meter panels are open. Kept while the page is open (so they stay as the player left them from one report to the next) and
// cleared when a run starts, so every new game opens with them closed. Not stored: it used to be, and a panel opened once stayed open for good.
let meterPanelsOpen = {};
function closeMeterPanels() {
  meterPanelsOpen = {};
}

// A word for a meter that has fallen far enough to matter, shown beside the bar even when it is closed. (Not for a merely low one: the bar says that.)
function meterDangerTag(v) {
  return v <= -8 ? "Critical" : v <= -5 ? "Dangerous" : null;
}

// What the staff say about a meter, shown inside its panel. { text, grave }: grave notes are drawn in red.
function meterStaffNotes(key, meters, flags) {
  const out = [];
  const total = meters.manpower + meters.fuel + meters.initiative;
  if (key === "manpower") {
    if (meters.manpower <= -4) out.push({ grave: true, text: "STAFF NOTE: Reserves are at breaking point. The front cannot absorb another major loss." });
    else if (meters.manpower <= -3) out.push({ grave: true, text: "STAFF NOTE: Manpower reserves are running dangerously thin." });
    if (total >= 3) out.push({ grave: false, text: "STAFF NOTE: The army remains coherent. A sustained final defense may yet be within reach." });
  }
  if (key === "fuel") {
    if (meters.fuel <= -8) out.push({ grave: true, text: "STAFF NOTE: Matériel is exhausted on every count. Formations are fighting on what they carry, and no offensive order has anything behind it." });
    else if (meters.fuel <= -3) out.push({ grave: true, text: "STAFF NOTE: Matériel stocks are exhausted. Offensive operations are no longer possible." });
    else if (meters.fuel <= -2) out.push({ grave: true, text: "STAFF NOTE: Matériel reserves critically low. Further offensive options may be foreclosed." });
  }
  if (key === "initiative" && meters.initiative >= 5) out.push({ grave: true, text: "STAFF NOTE: The war is running years ahead of its historical schedule. Whatever comes next arrives early." });
  return out;
}

// The three meters on the briefing screen. Each has a button that opens the micro-states behind it (see
// METER_STRANDS in logic.ts) with a status word, a green or red marker on any that moved since the last decision
// (`prev` is the state before it), and the staff's notes on that meter. Which are open is remembered.
function MeterPanel({ meters, flags, prev }) {
  const [open, setOpen] = useState(() => meterPanelsOpen);
  function toggle(key) {
    setOpen((o) => {
      meterPanelsOpen = { ...o, [key]: !o[key] };
      return meterPanelsOpen;
    });
  }
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2 border-2 border-black px-3 py-2">
        {METER_ROWS.map(({ key, label, dangerAt }) => {
          const v = meters[key];
          const isOpen = !!open[key];
          const rows = strandReadout(key, flags || {}, meters);
          const before = prev && prev.meters ? strandReadout(key, prev.flags || {}, prev.meters) : null;
          const notes = meterStaffNotes(key, meters, flags);
          const panelId = `meter-panel-${key}`;
          return (
            <div key={key}>
              <div className="flex items-center gap-1">
                <div className="flex-1 min-w-0">
                  <MeterBar label={label} value={v} from={prev && prev.meters ? prev.meters[key] : undefined} danger={dangerAt != null && v <= dangerAt} tag={meterDangerTag(v)} />
                </div>
                <button
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="shrink-0 w-8 h-8 flex items-center justify-center border border-black text-[11px] font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">{isOpen ? "▾" : "▸"}</span>
                  <span className="sr-only">{isOpen ? `Hide what is behind ${label}` : `Show what is behind ${label}`}</span>
                </button>
              </div>
              {isOpen && (
                <div id={panelId} role="group" aria-label={`${label}: what is behind it`} className="mt-1 mb-1 pl-0 sm:pl-[5.5rem]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  <ul className="flex flex-col gap-[3px]">
                    {rows.map((r, i) => {
                      // An arrow only where the band word changed or the reading moved by two or more, so it says something specific.
                      const dRaw = before ? r.score - before[i].score : 0;
                      const d = before && (before[i].level !== r.level || Math.abs(dRaw) >= 2) ? dRaw || r.level - before[i].level : 0;
                      return (
                        <li key={r.id} className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wider">
                          <span className="opacity-80">{r.name}</span>
                          <span className="flex items-center gap-1 font-bold" style={{ color: BAND_COLOURS[r.level] }}>
                            {r.level === 0 ? <span aria-hidden="true">⚠ </span> : null}
                            {r.band}
                            {d !== 0 ? <ChangePill up={d > 0} /> : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {notes.map((n, i) => (
                    <p key={i} className="mt-2 text-[11px] leading-snug border-l-4 pl-2 font-bold uppercase tracking-wide" style={{ borderColor: n.grave ? "#7a2e2e" : "#000000" }}>
                      {n.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS = MONTH_NAMES.map((m) => m.toUpperCase());

// Extract the latest 4-digit year from a date string (e.g. "JULY - NOVEMBER 1942", "1942 - 1943").
// Per-campaign report terminology, verified against real WWII usage before shipping (not
// invented for flavor): Lagebericht was the Wehrmacht's actual daily situation-report term;
// Weisung was Hitler/OKW's real term for numbered directives (Weisung Nr. 21 = the actual
// Barbarossa directive); Gefechtsbericht is the standard German equivalent of an after-action
// report. Оперативная сводка (opersvodka) was Sovinformburo's own real daily-bulletin term,
// confirmed against archived bulletin titles. Directiva/donesenie are common enough vocabulary
// to use with confidence, but carry an English gloss alongside regardless, same safety margin
// as the War Room cards, in case of any imprecision. SITREP and After Action Report are already
// standard real English military usage, so they're unchanged.
const CAMPAIGN_REPORT_TERMS = {
  german: { situation: "Lagebericht", directive: "Weisung", outcome: "Gefechtsbericht" },
  soviet: { situation: "Оперсводка", directive: "Директива", outcome: "Донесение" },
  allied: { situation: "SITREP", directive: "Theater Directive", outcome: "After Action Report" },
  italy: { situation: "Bollettino", directive: "Direttiva", outcome: "Rapporto" },
};
function campaignReportLabel(campaignId, kind) {
  const terms = CAMPAIGN_REPORT_TERMS[campaignId];
  return (terms && terms[kind]) || (kind === "outcome" ? "After Action Report" : kind === "directive" ? "Theater Directive" : "Situation Report");
}

// Truncates at the last complete sentence within budget rather than a hard character cut, so
// preview text never ends mid-word (e.g. "...the Reich. Y…"). Falls back to the last full word
// if no sentence fits, and only appends the ellipsis when something was actually cut.
function truncateBrief(text, maxLen) {
  if (text.length <= maxLen) return text;
  const window = text.slice(0, maxLen);
  const lastSentence = window.lastIndexOf(". ");
  if (lastSentence > maxLen * 0.4) return text.slice(0, lastSentence + 1);
  const lastSpace = window.lastIndexOf(" ");
  return text.slice(0, lastSpace > 0 ? lastSpace : maxLen) + "…";
}

// Wire bulletins: real, verified events from fronts a given campaign isn't itself tracking,
// flashed occasionally between reports. Deliberately avoids the handful of events this file
// already covers as dedicated nodes in one or more campaigns (Torch, Stalingrad's encirclement,
// D-Day, Bagration, the Warsaw Uprising, the Ardennes, July 20th) — the point is texture the
// player's own node graph doesn't supply, not a rehash of it. Not cross-checked against every
// one of this file's 171 nodes exhaustively, only against the ones already known to be major
// dedicated threads.
const WIRE_HEADLINES = [
  { id: "italy-declares", year: 1940, month: "JUNE", headline: "Italy Declares War, Strikes Southern France", dek: "Mussolini's forces cross the Alps as the French collapse continues in the north. Italian gains reported minimal against fortified positions." },
  { id: "battle-of-britain", year: 1940, month: "SEPTEMBER", headline: "RAF and Luftwaffe Losses Mount Over Southern England", dek: "Daylight air battles over Kent and Sussex continue for a third week. Both air ministries claim favorable exchange ratios; neither claim is independently verifiable." },
  { id: "lend-lease", year: 1941, month: "MARCH", headline: "US Congress Passes Lend-Lease Act", dek: "Washington authorizes material aid to Britain without direct combat entry. Isolationist opposition in Congress was substantial but did not prevail." },
  { id: "singapore-falls", year: 1942, month: "FEBRUARY", headline: "Singapore Falls to Japanese Forces", dek: "Garrison of over 80,000 troops surrenders. Churchill calls it the worst disaster in British military history." },
  { id: "midway", year: 1942, month: "JUNE", headline: "Naval Battle Reported Near Midway Atoll", dek: "Both Tokyo and Washington claim a victory in the Pacific. Ship losses on both sides remain unconfirmed pending fuller reports." },
  { id: "tunisia-surrenders", year: 1943, month: "MAY", headline: "Axis Forces in Tunisia Surrender", dek: "Remaining German and Italian forces in North Africa lay down arms. Over 250,000 taken prisoner in the campaign's final weeks." },
  { id: "italy-armistice", year: 1943, month: "SEPTEMBER", headline: "Italy Signs Armistice With the Allies", dek: "Rome's surrender announced by radio as German forces move to disarm Italian garrisons across the peninsula and the Balkans. Fighting reported between former co-belligerents in several sectors." },
  { id: "anzio-landings", year: 1944, month: "JANUARY", headline: "Allied Forces Land at Anzio", dek: "A surprise amphibious landing south of Rome aims to outflank the stalled Italian front. Beachhead reported secured; advance inland not yet confirmed." },
  { id: "rome-falls", year: 1944, month: "JUNE", headline: "Rome Falls to Allied Forces", dek: "The first Axis capital to be liberated, taken largely intact after German forces withdraw north. Celebrations reported in the streets within hours of entry." },
  { id: "v1-rockets", year: 1944, month: "JUNE", headline: "German Rocket Bombs Strike London", dek: "Unmanned flying bombs reported over southern England for the first time. Damage and casualty figures not yet released." },
  { id: "paris-liberated", year: 1944, month: "AUGUST", headline: "Paris Liberated", dek: "Free French forces enter the city as German garrison surrenders. Scenes of celebration reported throughout the capital." },
  { id: "yalta", year: 1945, month: "FEBRUARY", headline: "Allied Leaders Conclude Conference at Yalta", dek: "Roosevelt, Churchill, and Stalin conclude talks on the war's final phase and Europe's postwar shape. Full communiqué not yet released." },
  { id: "germany-surrenders", year: 1945, month: "MAY", headline: "Germany Surrenders Unconditionally", dek: "Instruments of surrender signed at Reims and Berlin end the war in Europe. Celebrations reported across Allied capitals; fighting continues in the Pacific." },
];
const WIRE_AGENCY = {
  german: { name: "DNB", sub: "Deutsches Nachrichtenbüro" },
  soviet: { name: "СОВИНФОРМБЮРО", sub: "Sovinformburo" },
  allied: { name: "REUTER", sub: "via Stars and Stripes" },
  italy: { name: "STEFANI", sub: "Agenzia Stefani" },
};
// Deterministic but varied, and never repeats a headline already shown this run: picks among
// headlines whose year is at or before the current node's year AND that aren't in seenIds. If
// everything eligible has already been shown, returns null so the bulletin is skipped that turn
// rather than repeating — a repeat read as a real bug, not a feature, so this is a hard rule.
function pickWireHeadline(currentYear, seedStr, seenIds) {
  const seen = seenIds || [];
  const eligible = WIRE_HEADLINES.filter((h) => h.year <= currentYear && !seen.includes(h.id));
  if (!eligible.length) return null;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  return eligible[hash % eligible.length];
}
// Occasional, not predictable: roughly 1 in 7 reports, using the same hash-of-node-id approach
// so it's stable per node but doesn't fall on a fixed schedule the player could anticipate.
function shouldShowWireBulletin(nodeId) {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) hash = (hash * 17 + nodeId.charCodeAt(i)) >>> 0;
  return hash % 7 === 0;
}

function yearFrom(text, fallback) {
  const years = String(text).match(/19\d\d/g);
  return years ? parseInt(years[years.length - 1], 10) : fallback;
}

// Per-campaign date formatting, applied only where it's a straightforward reformat of data
// that's already there — never inventing day-level precision the source string doesn't have.
// Untouched: date ranges, seasons ("AUTUMN 1942"), and anything that doesn't match the exact
// pattern cleanly, so nothing gets silently mangled.
const MONTH_LIST = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
// Lets the time meter visibly shift a node's own displayed date — matches the convention every
// campaign's ending prose actually uses (projectedEnd / epilogue): positive time is the cautious,
// manpower-conserving path, which consistently resolves LATER than the historical date ("the
// price of choices that spent time to save men"); negative time is the costlier, faster path,
// which resolves EARLIER ("bought with a faster, costlier advance"). So positive time here shifts
// displayed dates later, negative time earlier — the same direction as the eventual ending, not
// the opposite of it. Purely cosmetic: it only touches the date STAMP shown to the player, never
// the underlying node id, flags, or game logic, which all still key off the node's real canonical
// date. Scaled gently (0.6 months per meter point, so the full ±10 range shifts at most ~±6
// months) so it reads as "the pace is having a visible effect" rather than dates jumping around
// unrecognizably. Only applies to the clean "MONTH YEAR" pattern — ranges, seasons, and exact-day
// dates are left alone rather than risk producing something incoherent.
// Which way a campaign's initiative pushes its calendar. Initiative means one thing everywhere —
// you are setting the terms rather than answering them — but the calendar consequence is not the
// same for everyone. For STAVKA and SHAEF, dictating events brings the end forward. For OKW, which
// cannot win outright, dictating events means the war runs longer on its own terms. Same meter,
// same meaning, opposite calendar sign, and each campaign's projectedEnd uses the same rule.
function campaignPaceDirection(campaignId) {
  // STAVKA and SHAEF: pressing the tempo brings the end forward, so their displayed dates shift
  // earlier as initiative rises. OKW returns 0 deliberately — its duration is not a function of
  // initiative (see the note in the German projectedEnd), so shifting its dispatch dates by the
  // meter would assert a relationship the campaign does not actually have.
  if (campaignId === "german") return 0;
  return -1;
}

function shiftDateForPace(dateStr, initiativeValue, campaignId) {
  const m = dateStr.match(/^([A-Z]+) (\d{4})$/);
  if (!m || !MONTH_LIST.includes(m[1]) || !initiativeValue) return dateStr;
  const shift = Math.round((initiativeValue || 0) * 0.6);
  if (shift === 0) return dateStr;
  let idx = MONTH_LIST.indexOf(m[1]) + shift * campaignPaceDirection(campaignId);
  let year = parseInt(m[2], 10);
  while (idx < 0) { idx += 12; year -= 1; }
  while (idx > 11) { idx -= 12; year += 1; }
  return `${MONTH_LIST[idx]} ${year}`;
}

const MONTH_ROMAN = {
  JANUARY: "I", FEBRUARY: "II", MARCH: "III", APRIL: "IV", MAY: "V", JUNE: "VI",
  JULY: "VII", AUGUST: "VIII", SEPTEMBER: "IX", OCTOBER: "X", NOVEMBER: "XI", DECEMBER: "XII",
};
const MONTH_ABBR_DTG = {
  JANUARY: "JAN", FEBRUARY: "FEB", MARCH: "MAR", APRIL: "APR", MAY: "MAY", JUNE: "JUN",
  JULY: "JUL", AUGUST: "AUG", SEPTEMBER: "SEP", OCTOBER: "OCT", NOVEMBER: "NOV", DECEMBER: "DEC",
};
function formatDateForCampaign(dateStr, campaignId) {
  if (campaignId === "german") {
    // Wehrmacht correspondence convention: Roman-numeral month, period-separated.
    const m = dateStr.match(/^([A-Z]+) (\d{4})$/);
    if (m && MONTH_ROMAN[m[1]]) return `${MONTH_ROMAN[m[1]]}.${m[2]}`;
  } else if (campaignId === "soviet") {
    // Soviet order convention: trailing "г." (abbreviation for "год", year).
    return dateStr.replace(/(\d{4})$/, "$1 г.");
  } else if (campaignId === "allied") {
    // Allied/US military date-time-group ordering: DD MON YYYY, only when a real day is known.
    const m = dateStr.match(/^([A-Z]+) (\d{1,2}), (\d{4})$/);
    if (m && MONTH_ABBR_DTG[m[1]]) return `${m[2]} ${MONTH_ABBR_DTG[m[1]]} ${m[3]}`;
  }
  return dateStr;
}

// Lightweight staff-branch routing tag on the outcome screen. Classified by keyword signal in
// the node's own title/situation text — real WWII staffs split intelligence, operations, and
// political/security matters into distinct branches, and this surfaces which kind of decision
// just happened rather than treating every choice as generic "command." Defaults to Operations,
// since most wargame decisions are exactly that.
const STAFF_BRANCH_LABELS = {
  german: { ops: "IA · OPERATIONS", intel: "IC · INTELLIGENCE", political: "ADJ. · POLITICAL" },
  soviet: { ops: "ОПЕРАТИВНЫЙ ОТДЕЛ", intel: "РАЗВЕДОТДЕЛ", political: "ОСОБЫЙ ОТДЕЛ" },
  allied: { ops: "G-3 · OPERATIONS", intel: "G-2 · INTELLIGENCE", political: "G-1 · POLICY" },
  italy: { ops: "UFF. OPERAZIONI", intel: "SIM · INFORMAZIONI", political: "UFF. POLITICO-MILITARE" },
};
const STAFF_BRANCH_INTEL_WORDS = ["intelligence", "assessment", "estimate", "reconnaissance", "signals", "decrypt", "informant", "aerial photograph", "fho", "ultra", "enigma", "spy"];
const STAFF_BRANCH_POLITICAL_WORDS = ["purge", "nkvd", "gestapo", "political", "coalition", "diplomatic", "diplomacy", "conference", "cabinet", "parliament", "cohesion", "alliance", "propaganda", "armistice", "terms", "plot"];
function classifyStaffBranch(stage) {
  const text = ((stage.title || "") + " " + (stage.situation || "")).toLowerCase();
  if (STAFF_BRANCH_POLITICAL_WORDS.some((w) => text.includes(w))) return "political";
  if (STAFF_BRANCH_INTEL_WORDS.some((w) => text.includes(w))) return "intel";
  return "ops";
}

// Resource-modulated probability: a meter in good shape nudges a contested roll toward the
// favorable outcome, capped at a ±10 percentage-point swing from the historical baseline —
// resource stewardship should matter at the margin without letting players "solve" outright
// disputed history. Always clamped to [5, 95] so no roll ever becomes a certainty.
function modWeight(base, meterVal, cap) {
  cap = cap || 10;
  const swing = Math.max(-cap, Math.min(cap, (meterVal || 0) * 2));
  return Math.max(5, Math.min(95, base + swing));
}

function Timeline({ date, accent }) {
  const year = yearFrom(date, 1940);
  let month = 6;
  for (let m = 0; m < 12; m++) {
    if (date.toUpperCase().includes(MONTHS[m])) {
      month = m + 1;
      break;
    }
  }
  const pos = Math.min(100, Math.max(0, (((year - 1940) * 12 + (month - 1)) / 71) * 100));
  return (
    <div className="mb-4 select-none">
      <div className="relative h-[3px] bg-black w-full">
        <div
          className="absolute top-[-5px] text-[11px] font-bold"
          style={{ left: `calc(${pos}% - 5px)`, color: accent, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          ▼
        </div>
      </div>
      <div
        className="flex justify-between text-[10px] mt-1 text-[#000000] font-semibold"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {[1940, 1941, 1942, 1943, 1944, 1945].map((y) => (
          <span key={y}>{y}</span>
        ))}
      </div>
    </div>
  );
}

// ---------- CONTINENTAL SITUATION BOARD (abstract, theater-grouped — not a geographic map) ----------

const THEATERS = [
  { label: "SCANDINAVIA & THE NORTH", lines: ["SCANDINAVIA", "& THE NORTH"], ids: ["norway", "sweden", "finland", "denmark"] },
  { label: "BRITISH ISLES", lines: ["BRITISH ISLES"], ids: ["britain", "ireland"] },
  { label: "WESTERN EUROPE", lines: ["WESTERN EUROPE"], ids: ["france", "benelux", "switzerland"] },
  { label: "IBERIA", lines: ["IBERIA"], ids: ["iberia"] },
  { label: "CENTRAL EUROPE", lines: ["CENTRAL EUROPE"], ids: ["germany", "poland", "czechia", "austria", "hungary"] },
  { label: "THE EAST", lines: ["THE EAST"], ids: ["baltics", "ussrLeningrad", "ussrBelarus", "ussrMoscow", "ussrUkraine", "ussrDon", "ussrCaucasus", "ussrNorthRear", "ussrUrals", "ussrAsia", "romania"] },
  { label: "SOUTHERN EUROPE", lines: ["SOUTHERN EUROPE"], ids: ["italy", "yugoslavia", "greece", "albania", "bulgaria"] },
  { label: "MEDITERRANEAN", lines: ["MEDITERRANEAN", "& N. AFRICA"], ids: ["nwAfrica", "libya", "egypt", "turkey", "malta"] },
];

// x/y are schematic positions on a 900x620 canvas for the node-graph map view —
// arranged for legibility rather than strict cartographic accuracy (the same
// approach the Pacific title uses). They only affect the graph view; the chit
// board ignores them entirely.
const MAP_REGIONS = [
  { id: "norway", name: "Norway", x: 452, y: 70 },
  { id: "sweden", name: "Sweden", x: 532, y: 86 },
  { id: "finland", name: "Finland", x: 626, y: 66 },
  { id: "denmark", name: "Denmark", x: 450, y: 176 },
  { id: "britain", name: "Britain", x: 236, y: 200 },
  { id: "ireland", name: "Ireland", x: 140, y: 212 },
  { id: "france", name: "France", x: 276, y: 348 },
  { id: "benelux", name: "Benelux", x: 370, y: 258 },
  { id: "switzerland", name: "Switz.", x: 392, y: 350 },
  { id: "iberia", name: "Iberia", x: 176, y: 452 },
  { id: "germany", name: "Germany", x: 474, y: 268 },
  { id: "poland", name: "Poland", x: 592, y: 240 },
  { id: "czechia", name: "Czechia", x: 516, y: 326 },
  { id: "austria", name: "Austria", x: 486, y: 388 },
  { id: "hungary", name: "Hungary", x: 588, y: 376 },
  { id: "baltics", name: "Baltics", x: 664, y: 158 },
  // Round 14: "ussr" split into three army-group zones (path B of
  // docs/specs/eastern-front-subdivision.md); round 25 split those into nine (see
  // tools/split-ussr-zones.mjs and the MAP_TIMELINE comment). Schematic positions keep the real
  // geography's order, north above south and west left of east: Leningrad & Karelia above
  // Belorussia and Central Russia, Ukraine, the Don and the Caucasus below them, and the three
  // Soviet rear zones (Northern Russia, Volga & Urals, Central Asia) on the far right.
  { id: "ussrLeningrad", name: "Leningrad", x: 750, y: 84 },
  { id: "ussrNorthRear", name: "N. Russia", x: 850, y: 60 },
  { id: "ussrBelarus", name: "Belorussia", x: 722, y: 200 },
  { id: "ussrMoscow", name: "Central Russia", x: 812, y: 190 },
  { id: "ussrUrals", name: "Volga-Urals", x: 852, y: 268 },
  { id: "ussrUkraine", name: "Ukraine", x: 738, y: 312 },
  { id: "ussrDon", name: "Don & Volga", x: 822, y: 330 },
  { id: "ussrCaucasus", name: "Caucasus", x: 800, y: 410 },
  { id: "ussrAsia", name: "Central Asia", x: 858, y: 400 },
  { id: "romania", name: "Romania", x: 686, y: 396 },
  { id: "italy", name: "Italy", x: 436, y: 470 },
  { id: "yugoslavia", name: "Yugoslavia", x: 566, y: 452 },
  { id: "greece", name: "Greece", x: 624, y: 522 },
  { id: "nwAfrica", name: "Fr. N. Africa", x: 250, y: 566 },
  { id: "libya", name: "Libya", x: 470, y: 580 },
  { id: "egypt", name: "Egypt", x: 682, y: 586 },
  { id: "turkey", name: "Turkey", x: 740, y: 470 },
  { id: "albania", name: "Albania", x: 548, y: 500 },
  { id: "bulgaria", name: "Bulgaria", x: 668, y: 452 },
  { id: "malta", name: "Malta", x: 460, y: 528 },
];

// Adjacency for the node-graph view: land borders, plus one deliberate exception.
// Sea crossings are otherwise omitted — a line from Britain to France or Italy to
// Libya reads as a land connection and misrepresents the geography, which matters in
// a theater where the Channel and the Mediterranean were the defining obstacles.
// The exception is Denmark–Norway: the Skagerrak is a short crossing and was the
// actual Weserübung invasion route, and without it the whole Scandinavian cluster
// floats disconnected from the continent.
const MAP_GRAPH_EDGES = [
  ["norway", "sweden"], ["sweden", "finland"], ["finland", "ussrLeningrad"],
  ["norway", "denmark"], ["denmark", "germany"],
  ["france", "benelux"], ["france", "iberia"],
  ["france", "switzerland"], ["france", "italy"], ["benelux", "germany"],
  ["germany", "switzerland"], ["germany", "czechia"], ["germany", "poland"],
  ["germany", "austria"], ["czechia", "poland"], ["czechia", "austria"],
  ["austria", "hungary"], ["austria", "italy"], ["hungary", "romania"],
  ["hungary", "yugoslavia"], ["poland", "baltics"],
  // Round 14: Poland's Kresy (see POLAND_1938) bordered both Belarus and Ukraine; the
  // Baltic states bordered Russia toward Leningrad and the Lithuania-Belarus approach toward
  // Minsk. Round 25: the same borders for the nine zones, plus the land borders between the
  // zones themselves (the Caucasus touches Turkey; Ukraine and the Caucasus meet only across
  // the Kerch strait, and sea lanes are left out).
  ["poland", "ussrBelarus"], ["poland", "ussrUkraine"],
  ["baltics", "ussrLeningrad"], ["baltics", "ussrBelarus"], ["baltics", "ussrMoscow"],
  ["ussrLeningrad", "ussrMoscow"], ["ussrLeningrad", "ussrNorthRear"],
  ["ussrBelarus", "ussrMoscow"], ["ussrBelarus", "ussrUkraine"],
  ["ussrMoscow", "ussrUkraine"], ["ussrMoscow", "ussrDon"], ["ussrMoscow", "ussrUrals"], ["ussrMoscow", "ussrNorthRear"],
  ["ussrNorthRear", "ussrUrals"], ["ussrUkraine", "ussrDon"], ["ussrDon", "ussrCaucasus"], ["ussrDon", "ussrUrals"],
  ["ussrDon", "ussrAsia"], ["ussrUrals", "ussrAsia"], ["turkey", "ussrCaucasus"],
  ["romania", "ussrUkraine"], ["romania", "yugoslavia"],
  ["yugoslavia", "greece"], ["yugoslavia", "italy"], ["nwAfrica", "libya"],
  ["libya", "egypt"], ["greece", "turkey"],
  ["bulgaria", "romania"], ["bulgaria", "yugoslavia"], ["bulgaria", "greece"], ["bulgaria", "turkey"],
  ["albania", "yugoslavia"], ["albania", "greece"],
];

// Disc size tiers for the graph view — a rough sense of each region's weight in
// this theater (population, industry, and the size of the forces involved),
// not literal land area. Britain and the USSR read large; Switzerland and the
// Baltics read small. Purely cosmetic: nothing else reads these values.
const MAP_REGION_SIZE = {
  germany: "massive",
  // Round 14: the old single "massive" ussr tier doesn't cleanly divide three ways —
  // each zone individually is closer to the weight of the other "large" combatant
  // regions (population, industry, forces involved) than to Germany's own "massive"
  // tier. Round 25: of the nine zones the two that carried the most of the war, Central
  // Russia and Ukraine, stay "large"; the other fronts and the Soviet rear are "medium" (the
  // "small" tier also draws a status dot beside the label, which only a tiny island needs).
  ussrMoscow: "large", ussrUkraine: "large",
  ussrLeningrad: "medium", ussrBelarus: "medium", ussrDon: "medium", ussrCaucasus: "medium",
  ussrNorthRear: "medium", ussrUrals: "medium", ussrAsia: "medium",
  france: "large", britain: "large", italy: "large", poland: "large",
  egypt: "medium", romania: "medium", yugoslavia: "medium", iberia: "medium",
  hungary: "medium", czechia: "medium", austria: "medium", norway: "medium",
  sweden: "medium", finland: "medium", libya: "medium", nwAfrica: "medium",
  greece: "medium", benelux: "medium", baltics: "small", denmark: "small",
  ireland: "small", switzerland: "small", turkey: "medium",
  bulgaria: "small", albania: "small", malta: "small",
};
function mapDiscRadius(id) {
  const tier = MAP_REGION_SIZE[id] || "medium";
  return tier === "massive" ? 26 : tier === "large" ? 22 : tier === "medium" ? 17 : 13;
}

// A handful of nodes (Switzerland/Tannenbaum, the Japan-direction and Pearl Harbor
// diplomatic nodes, the Stockholm and Bern back-channels, Tehran, and the Australia/
// Pacific-pressure nodes) have no honest match among MAP_REGIONS' 18 keys — there is no
// Switzerland, Japan, USA, Sweden, Iran, Australia, Finland, or Pacific region on this
// board. Those are left without a highlight rather than pinned to a misleading stand-in
// region; everything else got an audited, best-fit assignment this pass (see the V6
// "close the NODE_HIGHLIGHT_REGIONS gaps" work).
const NODE_HIGHLIGHT_REGIONS = {
  german: {
  norway40: ["norway"],
  caseYellow40: ["france", "benelux"],
  caseYellowOriginal40: ["france", "benelux"],
  compressedInvasionWindow40: ["britain"],
  dunkirk: ["france"],
  channel: ["britain"],
  balkans: ["yugoslavia", "greece"],
  hessFlight41: ["britain"],
  crete41: ["greece"],
  bismarckBreakout41: ["britain"],
  sealionDisaster40: ["britain"],
  barbarossa41: ["ussrLeningrad", "ussrBelarus", "ussrMoscow", "ussrUkraine"],
  suezFirst41: ["egypt"],
  barbarossaAutumn41: ["ussrLeningrad", "ussrBelarus", "ussrMoscow", "ussrUkraine"],
  moscowFalls41: ["ussrMoscow"],
  volgaOverreach42: ["ussrMoscow", "ussrUrals"],
  sovietFracture42: ["ussrMoscow", "ussrUrals"],
  fractureResolution42: ["ussrMoscow"],
  east42Launch: ["ussrLeningrad", "ussrBelarus", "ussrMoscow", "ussrUkraine"],
  armedTruce41: ["britain"],
  mediterranean41: ["libya", "egypt"],
  iberianQuestion42: ["iberia"],
  bomberWar43: ["germany"],
  easternQuestion44: ["poland"],
  atomicReckoning45: ["germany"],
  moscowKiev: ["ussrMoscow", "ussrUkraine"],
  doubleEnvelopment: ["ussrBelarus", "ussrUkraine"],
  exposedFlank: ["ussrBelarus", "ussrMoscow", "ussrUkraine"],
  typhoon: ["ussrMoscow"],
  staticEast: ["ussrMoscow", "ussrUkraine"],
  atlanticWall43: ["france"],
  herkules42: ["malta", "libya", "egypt"],
  suezOpening42: ["egypt"],
  caseBlue: ["ussrDon", "ussrCaucasus"],
  torch42: ["nwAfrica"],
  maltaAftermath: ["libya", "egypt"],
  britishCrisis42: ["britain"],
  crisisResolution42: ["britain"],
  elAlamein: ["egypt"],
  stalingradPocket: ["ussrDon"],
  easternCollapse1943: ["ussrDon", "ussrUkraine"],
  blackMay: ["britain"],
  atlanticAttrition43: ["britain"],
  reconstituted: ["italy", "yugoslavia"],
  kursk: ["ussrDon", "ussrMoscow"],
  kurskBreach43: ["ussrDon"],
  kurskAftermath43: ["ussrDon"],
  twoFires1943: ["italy", "ussrUkraine"],
  italyPartisans: ["italy"],
  dnieperStabilized: ["ussrUkraine"],
  firmestLine43: ["ussrUkraine"],
  normandy: ["france"],
  bagration44: ["ussrBelarus", "ussrUkraine", "poland"],
  eastStand44: ["poland"],
  collapse1944: ["poland", "ussrBelarus"],
  centerArmyPreserved44: ["poland"],
  july20Plot44: ["germany"],
  gestapoInquiry44: ["germany"],
  arnhem44: ["benelux"],
  ardennes: ["benelux", "france"],
  hungaryGamble45: ["hungary"],
  rhineDefense45: ["germany"],
  reichStand45: ["germany"],
  westWall45: ["germany"],
  fortressNorth45: ["norway"],
  oderDefense45: ["germany", "poland"],
  berlinDefense45: ["germany"],
  finalWeek45: ["germany"],
  flensburg45: ["germany", "denmark"],
  alpineRedoubt45: ["austria", "germany"],
  sealionAftermath40: ["britain"],
  volgaAftermath42: ["ussrMoscow", "ussrUrals"],
  gibraltarStalled42: ["iberia"],
  suezHorizon42: ["egypt"],
  uranverein43: ["germany"],
  invasionQuestion44: ["france"],
  lodgmentReduction44: ["france"],
  moscowRace41: ["ussrMoscow"],
  heydrichReprisals42: ["germany"],
  westArmisticeAftermath42: ["france"],
  vlasov43: ["ussrLeningrad"],
  expandedOffensive43: ["ussrDon", "ussrUkraine"],
  mussoliniRescue43: ["italy"],
  italianLine43: ["italy"],
  vWeaponsProduction44: ["britain", "benelux"],
  normandyCounterattack44: ["france"],
  normandyConsolidation44: ["france"],
  romaniaDefects44: ["romania"],
  july20PlotFails44: ["germany"],
  rommelFate44: ["germany"],
  hitlerDead44: ["germany"],
  valkyrieGovernment44: ["germany"],
  caenAttrition: ["france"],
  falaiseGerman: ["france"],
  backhandBlow43: ["ussrUkraine", "ussrDon"],
  },
  soviet: {
  border41: ["baltics", "ussrLeningrad", "ussrBelarus", "ussrUkraine"],
  smolensk41: ["ussrMoscow", "ussrUkraine"],
  industrialShortfall42: ["ussrMoscow", "ussrUrals"],
  leningrad41: ["ussrLeningrad"],
  evacuateIndustry41: ["ussrMoscow", "ussrUrals"],
  moscowPanic41: ["ussrMoscow"],
  specialSection41: ["ussrMoscow"],
  lendLease42: ["ussrLeningrad", "ussrNorthRear", "ussrCaucasus"],
  order227_42: ["ussrDon"],
  stalingradStreets42: ["ussrDon"],
  escapedRemnants43: ["ussrDon"],
  southernPursuit43: ["ussrDon", "ussrUkraine"],
  partisans43: ["ussrBelarus", "ussrMoscow"],
  eastPrussia45: ["baltics", "poland"],
  berlinRivalryIncident45: ["germany"],
  berlinAssault45: ["germany"],
  moscowDefense41: ["ussrMoscow"],
  autumnWeight42: ["ussrMoscow", "ussrDon"],
  caucasusDefense42: ["ussrCaucasus"],
  rzhev42: ["ussrMoscow"],
  stalingradCounter42: ["ussrDon"],
  southernVacuum43: ["ussrDon", "ussrUkraine"],
  vacuumOverreach43: ["ussrUkraine", "ussrDon"],
  kharkov43: ["ussrUkraine"],
  quietSector43: ["ussrMoscow"],
  katynRevelation43: ["poland"],
  kurskDefense43: ["ussrDon", "ussrMoscow"],
  preemptResult43: ["ussrDon"],
  axis43: ["ussrMoscow", "ussrUkraine"],
  smolenskGates43: ["ussrMoscow", "ussrBelarus"],
  dnieperRace43: ["ussrUkraine"],
  easternWallBreach43: ["ussrUkraine"],
  bagrationSoviet44: ["poland", "ussrBelarus"],
  warsawUprising44: ["poland"],
  warsawRelief44: ["poland"],
  balkans44: ["bulgaria", "yugoslavia", "romania"],
  athensRace44: ["greece"],
  athensStandoff44: ["greece"],
  polishQuestion45: ["poland"],
  vistulaOder45: ["poland"],
  maskingForceQuestion45: ["baltics", "poland"],
  berlinRace45: ["germany"],
  rostovAftermath43: ["ussrDon", "ussrCaucasus"],
  katynBreak43: ["ussrMoscow", "poland"],
  berlinFeb45: ["germany"],
  finnishArmistice44: ["finland"],
  brodyCounterstroke41: ["ussrUkraine"],
  yelnya41: ["ussrMoscow"],
  winterGeneral42: ["ussrMoscow", "ussrLeningrad", "ussrUkraine"],
  rzhevVyazma42: ["ussrMoscow"],
  smolenskThaw42: ["ussrMoscow"],
  kharkov42: ["ussrUkraine"],
  westernOffensive42: ["ussrMoscow", "ussrBelarus"],
  leningrad44: ["ussrLeningrad"],
  rightBank44: ["ussrUkraine"],
  crimea44: ["ussrUkraine"],
  iasiKishinev44: ["romania"],
  budapest44: ["hungary"],
  balatonVienna45: ["hungary", "austria"],
  prague45: ["czechia"],
  },
  allied: {
  narvik40: ["norway"],
  dunkirk40: ["france"],
  halifaxCrisis40: ["britain"],
  battleOfBritain40: ["britain"],
  europeFirst42: ["britain"],
  atlanticConvoys42: ["britain"],
  secondFront42: ["france"],
  untestedDoctrine44: ["france"],
  darlanDeal42: ["nwAfrica"],
  casablanca43: ["nwAfrica"],
  sicilyHusky43: ["italy"],
  italyOrOverlord43: ["italy"],
  normandy44: ["france"],
  marketGarden44: ["benelux"],
  anvilDragoon44: ["france"],
  ljubljanaGap44: ["yugoslavia", "austria"],
  viennaStandoff44: ["austria"],
  ardennesResponse44: ["benelux"],
  bulgeExploited44: ["benelux"],
  yaltaFeb45: ["poland"],
  berlinDecision45: ["germany"],
  dieppe42: ["france"],
  bomberDirective43: ["germany"],
  dodecanese43: ["greece"],
  turkishQuestion44: ["turkey"],
  turkishBelligerence44: ["turkey"],
  anzio44: ["italy"],
  romeDividend44: ["italy"],
  gothicLineEarly44: ["italy"],
  overlordPrep44: ["france"],
  falaise44: ["france"],
  eisenhowerIntervenes44: ["france"],
  scheldt44: ["benelux"],
  stalinTestsTheFront45: ["germany"],
  strategicBombing45: ["germany"],
  germanyOccupation45: ["germany"],
  pq17_1942: ["norway"],
  arnhemPerimeter44: ["benelux"],
  gapStalled44: ["france"],
  westernCollapse45: ["germany"],
  berlinRace45: ["germany"],
  aegeanReckoning43: ["greece"],
  anzioSiege44: ["italy"],
  omahaCrisis44: ["france"],
  omahaIsolated44: ["france"],
  omahaBreakthroughLate44: ["france"],
  omahaToehold44: ["france"],
  compassGreece41: ["libya", "greece"],
  greeceFalls41: ["greece"],
  crete41: ["greece"],
  aidRussia41: ["ussrLeningrad", "ussrNorthRear"],
  crusader41: ["libya", "egypt"],
  },
  italy: {
    nonBelligerence40: ["italy"],
    extendedHoldout40: ["italy", "france"],
    britainAloneQuestion40: ["italy", "britain"],
    enduringNeutrality40: ["italy"],
    germanPressure41: ["italy", "germany"],
    neutralItalyOccupied42: ["italy", "germany"],
    neutralItalyEnd45: ["italy"],
    alpsFront40: ["italy", "france"],
    medStrategy40: ["malta", "italy", "libya", "egypt"],
    gibraltarGambit40: ["iberia", "italy"],
    gibraltarResolution40: ["iberia"],
    greeceDecision40: ["albania", "greece"],
    tarantoDoctrine40: ["italy"],
    greeceWinter40: ["albania", "greece"],
    compass40: ["libya", "egypt"],
    germanRescue41: ["libya", "greece"],
    matapan41: ["greece"],
    yugoslaviaBalkans41: ["yugoslavia", "greece"],
    convoyWarMalta41: ["malta", "italy", "libya"],
    herculesExecution41: ["malta", "italy", "libya"],
    maltaRetake41: ["malta", "italy", "libya"],
    rommelAdvance41: ["libya", "egypt"],
    tobruk42: ["libya"],
    alamein42: ["egypt"],
    torchTunisia42: ["nwAfrica", "libya"],
    tunisiaCollapse43: ["nwAfrica"],
    homeFrontBombing43: ["italy"],
    sicilyHusky43: ["italy"],
    mussoliniCoup43: ["italy"],
    romeStandoff43: ["italy"],
    factionSplit43: ["italy"],
    germanExploitation43: ["italy", "germany"],
    civilConflictEnd43: ["italy"],
    armisticeNegotiation43: ["italy"],
    armisticeAnnounce43: ["italy"],
    twoItalies43: ["italy"],
    salernoAvalanche43: ["italy"],
    imiCrisis43: ["italy", "germany"],
    vaticanChannel44: ["italy"],
    imiOutcome44: ["italy", "germany"],
    monteCassino44: ["italy"],
    romeLiberation44: ["italy"],
    clnLiaison44: ["italy"],
    gothicLine44: ["italy"],
    coBelligerentEnding45: ["italy", "germany"],
    monteLungo43: ["italy"],
    adriaticRoad44: ["italy"],
    combatGroups44: ["italy"],
    partisanWinter44: ["italy"],
    groupsCommand45: ["italy"],
    springOffensive45: ["italy"],
    saloRepublic43: ["italy"],
    alpenvorlandQuestion43: ["italy", "germany"],
    civilWarPartisans44: ["italy"],
    gothicLineRSI44: ["italy"],
    rsiCollapse45: ["italy"],
  },
};


// Round: soviet was #8a2f1f, a dark brick-red-brown sitting only ~51 RGB-distance from axis's
// #5c1a1a — close enough that the two read as the same color at a glance on the theater map
// (Craig: "soviet controlled... looks the same as Germany"). Replaced with a brighter, more
// saturated true red (~108 RGB-distance from axis, nearly double the old separation), checked
// against every other status color too so the swap doesn't just trade one collision for
// another — closest neighbor is axisAllied's orange-brown at ~55, which reads as a clearly
// different hue (red vs. orange) even though the raw distance is similar in magnitude.
const STATUS_COLORS = {
  axis: "#5c1a1a",
  axisAllied: "#a8562b",
  soviet: "#c62828",
  allied: "#28497a",
  neutral: "#a8a08c",
  contested: "#c9a227",
  divided: "url(#divideGradient)",
};

const STATUS_LABELS = {
  axis: "Axis-occupied",
  axisAllied: "Axis partner / puppet",
  soviet: "Soviet-controlled",
  allied: "Allied-controlled / liberated",
  neutral: "Neutral",
  contested: "Contested",
  divided: "Divided occupation",
};


// Round 25: the nine Eastern Front zones (see MAP_TIMELINE in 30-warroom-and-maps.jsx, which holds the dates and
// the reasons) no longer share one value, as the three army-group zones of round 14 did. At each year-end: 1939-40 all
// Soviet; 1941 and 1942 Belorussia and Ukraine in German hands, Leningrad, Central Russia and the Don contested (and the
// Caucasus too from July 1942); 1943 Central Russia and the Don cleared, Belorussia and Ukraine contested with the front
// inside them, Leningrad still contested; 1944-45 all Soviet. The rear (Northern Russia, Volga & Urals, Central Asia) is
// Soviet in every year. What a fork changes, such as Moscow falling, a stalled Case Blue or an early Dnieper, still comes
// from mapOverrides() below and now moves only the zone it happened in. check-map.mjs keeps this table and the timeline
// in step.
const MAP_YEAR_STATUS = {
  1939: {
    germany: "axis", poland: "contested", britain: "allied", ireland: "neutral", france: "allied",
    benelux: "neutral", denmark: "neutral", norway: "neutral", sweden: "neutral", switzerland: "neutral",
    italy: "neutral", czechia: "axis", austria: "axis", baltics: "neutral", hungary: "axisAllied",
    romania: "neutral", yugoslavia: "neutral", greece: "neutral", finland: "contested", ussrLeningrad: "soviet", ussrNorthRear: "soviet", ussrBelarus: "soviet", ussrMoscow: "soviet", ussrUrals: "soviet", ussrUkraine: "soviet", ussrDon: "soviet", ussrCaucasus: "soviet", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "allied", libya: "axisAllied", egypt: "allied", turkey: "neutral",
    albania: "axisAllied", bulgaria: "neutral", malta: "allied",
  },
  1940: {
    germany: "axis", poland: "axis", britain: "allied", ireland: "neutral", france: "axisAllied",
    benelux: "axis", denmark: "axis", norway: "axis", sweden: "neutral", switzerland: "neutral",
    italy: "axisAllied", czechia: "axis", austria: "axis", baltics: "soviet", hungary: "axisAllied",
    romania: "axisAllied", yugoslavia: "neutral", greece: "contested", finland: "neutral", ussrLeningrad: "soviet", ussrNorthRear: "soviet", ussrBelarus: "soviet", ussrMoscow: "soviet", ussrUrals: "soviet", ussrUkraine: "soviet", ussrDon: "soviet", ussrCaucasus: "soviet", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "axisAllied", libya: "axisAllied", egypt: "contested", turkey: "neutral",
    albania: "axisAllied", bulgaria: "neutral", malta: "allied",
  },
  1941: {
    germany: "axis", poland: "axis", britain: "allied", ireland: "neutral", france: "axisAllied",
    benelux: "axis", denmark: "axis", norway: "axis", sweden: "neutral", switzerland: "neutral",
    italy: "axisAllied", czechia: "axis", austria: "axis", baltics: "axis", hungary: "axisAllied",
    romania: "axisAllied", yugoslavia: "axis", greece: "axis", finland: "axisAllied", ussrLeningrad: "contested", ussrNorthRear: "soviet", ussrBelarus: "axis", ussrMoscow: "contested", ussrUrals: "soviet", ussrUkraine: "axis", ussrDon: "contested", ussrCaucasus: "soviet", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "axisAllied", libya: "contested", egypt: "allied", turkey: "neutral",
    albania: "axisAllied", bulgaria: "axisAllied", malta: "allied",
  },
  1942: {
    germany: "axis", poland: "axis", britain: "allied", ireland: "neutral", france: "axis",
    benelux: "axis", denmark: "axis", norway: "axis", sweden: "neutral", switzerland: "neutral",
    italy: "axisAllied", czechia: "axis", austria: "axis", baltics: "axis", hungary: "axisAllied",
    romania: "axisAllied", yugoslavia: "contested", greece: "axis", finland: "axisAllied", ussrLeningrad: "contested", ussrNorthRear: "soviet", ussrBelarus: "axis", ussrMoscow: "contested", ussrUrals: "soviet", ussrUkraine: "axis", ussrDon: "contested", ussrCaucasus: "contested", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "allied", libya: "contested", egypt: "allied", turkey: "neutral",
    albania: "contested", bulgaria: "axisAllied", malta: "allied",
  },
  1943: {
    germany: "axis", poland: "axis", britain: "allied", ireland: "neutral", france: "axis",
    benelux: "axis", denmark: "axis", norway: "axis", sweden: "neutral", switzerland: "neutral",
    italy: "contested", czechia: "axis", austria: "axis", baltics: "axis", hungary: "axisAllied",
    romania: "axisAllied", yugoslavia: "contested", greece: "axis", finland: "axisAllied", ussrLeningrad: "contested", ussrNorthRear: "soviet", ussrBelarus: "contested", ussrMoscow: "soviet", ussrUrals: "soviet", ussrUkraine: "contested", ussrDon: "soviet", ussrCaucasus: "soviet", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "allied", libya: "allied", egypt: "allied", turkey: "neutral",
    albania: "contested", bulgaria: "axisAllied", malta: "allied",
  },
  1944: {
    germany: "axis", poland: "contested", britain: "allied", ireland: "neutral", france: "allied",
    benelux: "contested", denmark: "axis", norway: "axis", sweden: "neutral", switzerland: "neutral",
    italy: "contested", czechia: "axis", austria: "axis", baltics: "soviet", hungary: "contested",
    romania: "soviet", yugoslavia: "contested", greece: "allied", finland: "contested", ussrLeningrad: "soviet", ussrNorthRear: "soviet", ussrBelarus: "soviet", ussrMoscow: "soviet", ussrUrals: "soviet", ussrUkraine: "soviet", ussrDon: "soviet", ussrCaucasus: "soviet", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "allied", libya: "allied", egypt: "allied", turkey: "neutral",
    albania: "allied", bulgaria: "soviet", malta: "allied",
  },
  1945: {
    germany: "divided", poland: "soviet", britain: "allied", ireland: "neutral", france: "allied",
    benelux: "allied", denmark: "allied", norway: "allied", sweden: "neutral", switzerland: "neutral",
    italy: "allied", czechia: "soviet", austria: "divided", baltics: "soviet", hungary: "soviet",
    romania: "soviet", yugoslavia: "allied", greece: "allied", finland: "neutral", ussrLeningrad: "soviet", ussrNorthRear: "soviet", ussrBelarus: "soviet", ussrMoscow: "soviet", ussrUrals: "soviet", ussrUkraine: "soviet", ussrDon: "soviet", ussrCaucasus: "soviet", ussrAsia: "soviet",
    iberia: "neutral", nwAfrica: "allied", libya: "allied", egypt: "allied", turkey: "allied",
    albania: "allied", bulgaria: "soviet", malta: "allied",
  },
};

// Tier 2 — the map reads the run's own divergences.
// `dayKey` (a node's own day, see nodeDayKey) lets an override start and stop on a real date; without it (the
// Continental Situation panel, which shows year-end snapshots) the year decides.
function mapOverrides(year, flags, meters, dayKey) {
  flags = flags || {};
  meters = meters || {};
  const o = {};
  const notes = [];
  const since = (y, m, d) => (dayKey != null ? dayKey > y * 10000 + m * 100 + d : year >= y);
  const before = (y, m, d) => !since(y, m, d);
  const note = (text, regions) => notes.push({ text, regions });
  // Round 25: the Eastern Front is nine zones, not three. EAST_FRONT are the five that the German invasion crossed in 1941,
  // EAST_ALL adds the Caucasus, which only the 1942 offensive reached; the Soviet rear never changes.
  const EAST_FRONT = ["ussrLeningrad", "ussrBelarus", "ussrMoscow", "ussrUkraine", "ussrDon"];
  const EAST_ALL = [...EAST_FRONT, "ussrCaucasus"];
  const setZones = (ids, status) => ids.forEach((z) => { o[z] = status; });
  // Round 17 (Craig, after scrubbing the new map timeline: "France doesn't start blue," "Russia
  // seems to turn after the Balkans question," "Italy should start neutral then join"). The
  // France/Balkans symptoms were the year-capping bug fixed in CheckpointMap itself (every
  // per-decision snapshot needs the same "show through the end of last year, not the one still
  // in progress" cap the live view always applied — see that component's own comment). This
  // Italy/USSR pair is the other half: two headline transitions that, before this round, only
  // ever moved when the coarse year-end baseline (MAP_YEAR_STATUS) happened to catch up — up to
  // a full calendar year after the decision that actually caused them. Flag-driven, so they
  // flip the moment the decision resolves regardless of what the baseline year says yet.
  if (flags.italyEntry && flags.italyEntry !== "neutral" && year <= 1942) {
    // Bounded to 1942 deliberately — from 1943 the armistice/civil-war split (sicilyHusky43
    // onward) is real and already correctly reflected by the year-end baseline itself
    // (MAP_YEAR_STATUS has Italy "contested" in 1943/44, "allied" by 1945); an unconditional
    // override here would paper back over that split. Excludes "neutral" — Round 19's extended
    // non-belligerence branch never joins the Axis at all, handled in its own block below.
    o.italy = "axisAllied";
  }
  // Round 19: the extended non-belligerence branch. Runs AFTER the block above so its own
  // assignment wins regardless of check order — kept as a separate, explicitly-commented block
  // rather than folded into the exclusion above so each of the branch's three end states gets
  // its own visible note.
  if (flags.italyEntry === "neutral") {
    o.italy = "neutral";
    if (!flags.neutralItalyPressure) {
      note("Rome never declared: the historical June 1940 entry window closed with Italy still non-belligerent (projection).", ["italy"]);
    }
  }
  if (flags.neutralItalyPressure === "tolerated") {
    o.italy = "neutral";
    note("Berlin's pressure against a neutral Italy never escalated past complaint: the country sat out the entire war (projection).", ["italy"]);
  }
  if (flags.neutralItalyPressure === "coerced" && !flags.neutralItalyEnd) {
    o.italy = "neutral";
    note("Germany is moving to compel compliance from a neutral Italy that never fought for the Axis or against it: still unresolved (projection).", ["italy"]);
  }
  if (flags.neutralItalyEnd === "submit") {
    o.italy = "axisAllied";
    note("Faced with Berlin's ultimatum, Rome submitted rather than resist: occupied and compliant, without ever having fought a war on Germany's behalf (projection).", ["italy"]);
  }
  if (flags.neutralItalyEnd === "resist") {
    o.italy = "contested";
    note("Comando Supremo refused Berlin's ultimatum: a country that spent two years avoiding this war is fighting one now, against its former ally instead of beside it (projection).", ["italy"]);
  }
  if (flags.barbarossa === "launched" && year === 1941) {
    // The historical path (Halder's choice, June 22 1941) — no note, since this isn't a
    // divergence from the record and shouldn't earn a dashed "why is this diverged" border.
    // Whole-front invasion (Finland to Romania — see barbarossa41's own situation text). Round 25:
    // the dated timeline of the nine zones already says exactly what happened, zone by zone, so
    // the historical path needs no override (the old all-zones "contested" would have hidden that
    // Belorussia and Ukraine were German-held by the autumn).
  }
  if (flags.barbarossa === "medFirst" && year === 1941) {
    setZones(EAST_FRONT, "contested");
    note("Barbarossa launched in autumn instead of June, after a summer Mediterranean campaign first: the invasion is underway, just months behind the historical schedule (projection).", EAST_FRONT);
  }
  if (flags.reichStand === "west" && year >= 1945) {
    // Austria's real 1945 split ran roughly east-west (Soviet zone east, the three Western
    // Allied zones — and Vienna itself split four ways). A west-weighted final defense means
    // the east gave first; tipping all of Austria Soviet is the visual this note describes.
    // (The original o.czechia = "soviet" here was a no-op — MAP_YEAR_STATUS[1945].czechia is
    // already "soviet", so the note had nothing to actually show.)
    o.austria = "soviet";
    note("The west-weighted final defense let Soviet forces take all of Austria rather than share it: the postwar dividing line sits further west than the historical map (projection).", ["austria"]);
  }
  if (flags.reichStand === "east" && year >= 1945) {
    // The mirror case: German defense weighted east means the west collapses faster, so
    // Anglo-American forces get further than the historical meeting line. Real US troops did
    // reach western Bohemia in 1945 and stopped short of liberating it fully — tipping Czechia
    // to "allied" is the plausible visual for "they went further this time."
    o.czechia = "allied";
    note("The deliberately opened western front let Anglo-American forces advance deeper into Czechoslovakia than the historical meeting line (projection).", ["czechia"]);
  }
  if (flags.reichStand === "north" && year >= 1945) {
    o.norway = "axis";
    note("Festung Norwegen: an intact German army of 350,000 or more in Norway outlasted the continental war, so the occupation has not ended here (projection).", ["norway"]);
  }
  if (flags.sealion === "launched" && year === 1940)
    note("The Channel crossing was attempted and failed: Britain unconquered, at heavy German cost.", ["britain"]);
  if (flags.tannenbaum40 === "invade" && year >= 1940) {
    o.switzerland = flags.tannenbaumOutcome === "quagmire" && year <= 1941 ? "contested" : "axis";
    note(
      flags.tannenbaumOutcome === "quagmire"
        ? "Switzerland was invaded rather than left neutral: the Alpine Réduit kept organized resistance alive well past the lowland occupation (projection)."
        : "Switzerland was invaded rather than left neutral (projection).",
      ["switzerland"]
    );
  }
  if (flags.pathVariant === "noBarbarossa") {
    setZones(EAST_ALL, "soviet");
    if (year >= 1941 && year <= 1944) {
      o.france = "axis";
      o.benelux = "axis";
      if (year === 1944)
        note("No eastern front on this path: the Soviet border stays quiet, and no cross-Channel invasion has been attempted against an undistracted Wehrmacht (projection).", [...EAST_ALL, "france", "benelux"]);
    }
    if (year >= 1945) {
      o.germany = "allied"; o.austria = "allied"; o.czechia = "allied"; o.poland = "allied";
      o.france = "allied"; o.benelux = "allied"; o.denmark = "allied"; o.norway = "allied"; o.italy = "allied";
      note("Occupation follows a war with no eastern front: the historical Soviet zone never forms (projection).", ["germany", "austria", "czechia", "poland", "france", "benelux", "denmark", "norway", "italy"]);
    }
  }
  if (flags.moscowCaptured && year >= 1941 && year <= 1944) {
    // Round 14: Moscow itself sits in the Central Russia zone (ussrMoscow) — the zone split means this can finally
    // say so instead of tipping the whole former "ussr" blob axis over one city falling. Kuibyshev, where the
    // government goes, is in the Volga & Urals zone and stays Soviet.
    o.ussrMoscow = "axis";
    note("Moscow itself is under Axis occupation; the Soviet government continues from Kuibyshev (projection).", ["ussrMoscow"]);
  }
  // Round 20 (Craig: "more map improvements — ensuring each country changes correctly"). Two
  // real, choice-driven eastern-front divergences that predate any Historical Divergence fork
  // and had no map reflection at all: kurskBreach43's "exploited" branch — the single best
  // tactical eastern result this campaign reaches outside a fork or a rare diplomatic roll — and
  // dnieperStabilized's sealed/conceded choice (the exact Kiev-area crossing Open Question #13
  // flagged as having no dedicated region at the time; ussrUkraine is now a direct, not just
  // coarse, match for it — round 14's zone split, unlike forkEastAfricaSlow's Egypt proxy for
  // East Africa below, which still has no dedicated region of its own).
  if (flags.kurskBreach === "exploited" && year === 1943) {
    // Kursk sits in the Don & Volga zone (ussrDon; tools/split-ussr-zones.mjs checks it against a list of named
    // places) — round 14 narrowed this from the old whole-blob "ussr", round 25 from the old South zone.
    o.ussrDon = "axisAllied";
    note("The early Kursk strike's breach was pushed rather than banked: a rare, genuine eastern gain the historical July offensive never had the room to attempt (projection).", ["ussrDon"]);
  }
  if (flags.dnieper === "sealed" && year === 1943) {
    o.ussrUkraine = "axisAllied";
    note("The last mobile reserve sealed the Dnieper crossing near Kiev: the firmest eastern line this campaign reaches, at the cost of what that reserve could have done in the west instead (projection).", ["ussrUkraine"]);
  }
  // dnieper === "conceded" gets no status change: its own outcome text frames it as a real but
  // local setback, not a country-level shift — the Ukraine zone is already "contested" by default from August 1943,
  // and forcing a drop to "soviet" here would overstate what a single crossing near Kiev
  // cost. Note-only, same principle as forkLuftwaffeShift above.
  if (flags.dnieper === "conceded" && year === 1943) {
    note("The Dnieper crossing near Kiev was let through rather than sealed, to preserve the reserve for the west: a real, local eastern setback ahead of the historical timeline (projection).", ["ussrUkraine"]);
  }
  if (flags.suez41 === "taken" && year >= 1941 && year <= 1942) {
    o.egypt = "axis";
    note("Suez and Egypt fell to the Mediterranean-first summer of 1941 (projection).", ["egypt"]);
  }
  if (flags.med42 === "malta" && year >= 1942 && year <= 1943) {
    // A stronger call than maltaPath below (Malta actually captured, not just contested skies)
    // — a more Axis-favorable Western Desert supply picture is the plausible visual. Malta
    // itself (a real MAP_REGION since round 8) flips Axis here — the flag literally means the
    // island fell.
    o.malta = "axis";
    o.libya = "axisAllied";
    o.egypt = "contested";
    note("Malta is in Axis hands: the central Mediterranean convoy war inverted (projection).", ["malta", "libya", "egypt"]);
  }
  if (flags.herculesResult === "fell") {
    // Italy campaign's own Malta arc — distinct from the German campaign's med42 flag above.
    // malta40 marks the early, more speculative 1940 invasion; without it, the fall came via
    // the historically-planned Operation Hercules a year later instead. maltaRetaken (set at
    // maltaRetake41, winter 1941-42) reverses this from 1942 on if Britain's counter-effort wins.
    const sinceYear = flags.malta40 === "fell" ? 1940 : 1941;
    const retakenYear = 1942;
    if (flags.maltaRetaken && year >= retakenYear) {
      o.malta = "contested";
      o.libya = "contested";
      note("Malta changed hands twice (taken by Italy, then retaken by a determined British counter-effort over the winter of 1941-42) and the convoy war to Libya reverted with it (projection).", ["malta", "libya"]);
    } else if (year >= sinceYear) {
      o.malta = "axis";
      o.libya = "axisAllied";
      note(
        flags.malta40 === "fell"
          ? "Malta fell to an Italian invasion in the summer of 1940: years before the historical war ever seriously put the island at risk (projection)."
          : "Malta fell to Operation Hercules in 1941: the invasion the historical Comando Supremo planned for a year and never actually ordered (projection).",
        ["malta", "libya"]
      );
    }
  }
  if (flags.gibraltarTaken === "success" && year >= 1941) {
    o.iberia = "axisAllied";
    note("Spain entered the war and Gibraltar fell in early 1941: Italian shipments to Madrid succeeded where the real Hitler-Franco meeting at Hendaye failed, closing the Mediterranean's western mouth (projection).", ["iberia"]);
  }
  if (flags.maltaPath && year === 1943) {
    o.malta = "axis";
    o.libya = "contested";
    o.egypt = "contested";
    note("The supplied desert war runs on past its historical end date (projection).", ["malta", "libya", "egypt"]);
  }
  if (flags.pathVariant === "earlyCollapse" && year >= 1943) {
    o.poland = "soviet"; o.germany = "contested"; o.czechia = "contested";
    setZones(EAST_ALL, "soviet");
    note("The eastern front has collapsed roughly two years ahead of the historical schedule (projection).", ["poland", "germany", "czechia", ...EAST_ALL]);
  }
  if (flags.pathVariant === "collapse44" && year >= 1944) {
    o.poland = "soviet"; o.germany = "contested";
    setZones(EAST_ALL, "soviet");
    note("General collapse in the east, roughly nine months ahead of the historical schedule (projection).", ["poland", "germany", ...EAST_ALL]);
  }
  if (flags.eastStand && year === 1944)
    note("Army Group Center retreats as an army: the eastern line anchors in better order than the historical rout (projection).", ["poland"]);
  if (flags.eastern44 === "preempt" && year >= 1944) {
    o.poland = "contested";
    note("The 1944 preemptive eastern war rages along the old demarcation line (projection).", ["poland"]);
  }
  if ((meters.initiative || 0) >= 4 && year >= 1945 && flags.pathVariant !== "noBarbarossa") {
    o.germany = "contested";
    note("Organized resistance continues past the historical May 1945 surrender (projection).", ["germany"]);
  }

  // Historical Divergence Mode's 12 forks (DIVERGENCE_FORKS) — until this pass, none of these
  // flags were read here at all. A couple nudge probability weights toward other outcome flags
  // this function already reads (forkMoscowHolds → moscowCaptured above), but most had no path
  // to the map whatsoever: a divergent run and a fully-historical one rendered identically.
  // Each gets a modest, historically-plausible nudge in its own reveal year (see
  // DIVERGENCE_HEADLINES for exact dates) — deliberately lighter-touch than the pathVariant/
  // reichStand overrides above, so this block runs first: a genuine structural divergence
  // should win if it happens to touch the same region/year as a fork's smaller nudge.
  //
  // Two of a campaign's three forks CAN share both a year and a region (soviet's
  // forkBarbarossaDelay and forkKievPush both touch the eastern zones in 1941, in opposite
  // directions) — they're rolled independently, so this is a real possible combination, not
  // a bug. Last write wins, same as every other pair of conditions in this function;
  // forkKievPush is ordered second so it prevails, since it's the more narratively decisive
  // of the two. Round 14: forkKievPush only touches ussrMoscow (its own text is about the
  // direct drive on Moscow reaching further, explicitly because the historical Kiev detour
  // through the south didn't happen this time) — so it no longer actually collides with
  // forkBarbarossaDelay's all-three-zone assignment the way the comment above used to
  // describe; kept because the ordering guarantee is still real and still matters whenever a
  // future fork's zone(s) do overlap.
  if (flags.forkNorwayHeld && year === 1940) {
    o.norway = "contested";
    note("Allied resistance around Narvik held on longer than history recorded: the occupation wasn't complete by year's end (projection).", ["norway"]);
  }
  if (flags.forkMoscowHolds && year === 1941 && !flags.moscowCaptured) {
    o.ussrMoscow = "axis";
    note("Weaker-than-historical Siberian reinforcement left the approach to Moscow more exposed this autumn (projection).", ["ussrMoscow"]);
  }
  if (flags.forkTorchShift && year === 1942) {
    o.nwAfrica = "contested";
    note("A weather-delayed landing fleet meant French North Africa wasn't secured by year's end the way the historical timeline had it (projection).", ["nwAfrica"]);
  }
  if (flags.forkBarbarossaDelay && year === 1941) {
    // A slower opening across the whole invasion front — every front zone, same as
    // barbarossa/medFirst above.
    setZones(EAST_FRONT, "soviet");
    note("A slower opening than the historical invasion gave the frontier armies more time to organize a defense (projection).", EAST_FRONT);
  }
  if (flags.forkKievPush && year === 1941) {
    // Round 14: this fork's own text is specifically "no southern turn toward Kiev — the
    // direct drive on the capital reached further" — the gain is Central Russia's (Moscow's
    // approach), and explicitly NOT Ukraine's, since the whole point is that Kiev wasn't
    // taken this way. Only ussrMoscow moves; ussrUkraine stays at its 1941 baseline.
    o.ussrMoscow = "axis";
    note("No southern turn toward Kiev: the direct drive on the capital reached further than the historical detour allowed (projection).", ["ussrMoscow"]);
  }
  if (flags.forkStalingradConsolidate && year === 1942) {
    // Stalingrad sits in the Don & Volga zone.
    o.ussrDon = "soviet";
    note("The pause short of Stalingrad's outskirts gave the defense more time to consolidate than the historical record shows (projection).", ["ussrDon"]);
  }
  if (flags.forkNarvikHeld && year === 1940) {
    o.norway = "contested";
    note("The Narvik garrison's reinforcement held: Norway's occupation wasn't complete by year's end on this run (projection).", ["norway"]);
  }
  // Round 24 (Norway never moved with the decisions about it). The German campaign's own choice at Weserübung and the
  // Allied campaign's at Narvik, each read here. The historical choices (a full seizure; the evacuation) are the
  // calendar baseline and need no override.
  if (flags.norway === "limited" && since(1940, 4, 9) && before(1942, 1, 1)) {
    o.norway = "contested";
    note("Only the ore ports were taken: with the surface fleet held back and Narvik left alone, Norway was never fully occupied in the first year the way the historical landings made it (projection).", ["norway"]);
  }
  if (flags.narvik40 === "hold" && since(1940, 4, 9) && before(1941, 1, 1)) {
    o.norway = "contested";
    note("Narvik was held and reinforced instead of evacuated, so organized resistance in Norway outlasted the historical June collapse (projection).", ["norway"]);
  }
  // Round 24: other decisions that plainly decided a country's fate and never reached the map.
  if (flags.vichy === "restrained" && since(1942, 11, 11) && before(1944, 6, 6)) {
    o.france = "axisAllied";
    note("The Free Zone was left nominally Vichy rather than occupied in November 1942, so the demarcation line stayed in place until the landings (projection).", ["france"]);
  }
  if (flags.darlanDeal42 === "refuse" && since(1942, 11, 8) && before(1943, 1, 1)) {
    o.nwAfrica = "contested";
    note("Darlan's ceasefire was refused, so resistance in French North Africa went on unit by unit past the first days of Torch (projection).", ["nwAfrica"]);
  }
  if (flags.turkishQuestion44 === "press" && since(1944, 6, 1)) {
    o.turkey = "allied";
    note("Ankara was pressed into belligerence months before its historical February 1945 declaration, mostly symbolic even then (projection).", ["turkey"]);
  }
  if (flags.tripoli41 === "taken" && since(1941, 3, 15) && before(1943, 1, 23)) {
    o.libya = "allied";
    note("Tripoli was reached in March 1941, before the Afrika Korps could hold it, so Libya was cleared of the Axis almost two years ahead of the historical January 1943 (projection).", ["libya"]);
  }
  if (flags.earlyDnieper43 && since(1943, 8, 31)) {
    o.ussrUkraine = "soviet";
    note("The reserve pressed straight past Kharkov to the Dnieper crossings, so Ukraine was cleared months ahead of the historical schedule (projection).", ["ussrUkraine"]);
  }
  // Round 25: with Central Russia and Belorussia now separate zones, the speculative first-year branch of the Soviet
  // campaign can show where the front is. Smolensk retaken in April 1942 clears Central Russia, 17 months before the real
  // Smolensk operation; the second break in the centre in the winter of 1942 then carries the front into Belorussia,
  // a year and a half ahead of Bagration.
  if (flags.smolenskTaken42 && since(1942, 4, 15)) {
    o.ussrMoscow = "soviet";
    note("Smolensk was retaken in April 1942, seventeen months before it was in the real war, and the front left Central Russia for the Belorussian border (projection).", ["ussrMoscow"]);
  }
  if (flags.fastWest42 && since(1942, 12, 31)) {
    o.ussrMoscow = "soviet";
    o.ussrBelarus = "contested";
    note("The centre was broken a second time in the winter of 1942, so the front left the Moscow and Smolensk country for good and stood in Belorussia a year and a half ahead of Bagration (projection).", ["ussrMoscow", "ussrBelarus"]);
  }
  // forkLuftwaffeShift (raids stay concentrated on airfields rather than shifting to cities) has
  // no map effect: Britain has no lower state than "allied" to fall to and no higher one to
  // rise to in this schema. Its stakes are about how narrow the margin was — exactly what its
  // ending title ("Fighter Command, Nearly Spent") already carries — so forcing a color change
  // here would invent a distinction the model can't actually support. A legitimate note-only
  // case, same as sealion === "launched" above.
  if (flags.forkArnhemLucky && year === 1944) {
    o.benelux = "allied";
    note("No SS armor near the drop zones: the corridor held, and the Netherlands were further along toward liberation by year's end than the historical record shows (projection).", ["benelux"]);
  }
  if (flags.forkGreeceResistance && year === 1940) {
    o.greece = "neutral";
    note("Firmer-than-historical resistance on the Greek frontier kept the invasion from gaining a real foothold by year's end (projection).", ["greece"]);
  }
  if (flags.forkEastAfricaSlow && year === 1941) {
    // East Africa itself isn't a tracked region on this map — Egypt (the Commonwealth's
    // regional base) is the closest honest proxy for "forces tied down there instead of
    // reinforcing the Western Desert."
    o.egypt = "contested";
    note("A slower Commonwealth advance in East Africa tied down forces that would otherwise have reinforced the Western Desert, leaving Egypt less secure than the historical record shows (projection).", ["egypt"]);
  }
  if (flags.forkMaltaWeak && year === 1941) {
    o.libya = "axisAllied";
    note("Lighter interference from Malta kept the African convoys running better than history recorded, leaving Libya more securely supplied (projection).", ["libya"]);
  }

  // Round 20 (Craig: "build 2 new speculative forks on the alternative history mode per
  // campaign") — same lighter-touch treatment as the block above, in each campaign's fork order.
  if (flags.forkPanthersFixed && flags.kurskResult === "breach" && year === 1943) {
    o.ussrDon = "axisAllied";
    note("Without the historical Panther engine-fire losses, the Kursk breakthrough pressed further east before the season turned (projection).", ["ussrDon"]);
  }
  if (flags.forkCaucasusThin && flags.caseBlue === "both" && year === 1942) {
    o.ussrDon = "axisAllied";
    o.ussrCaucasus = "axisAllied";
    note("A thinner-than-expected Soviet reserve let the southern front hold both the Stalingrad and Caucasus axes longer than the historical overextension allowed (projection).", ["ussrDon", "ussrCaucasus"]);
  }
  // forkRzhevThin has no map effect: it doesn't change what Operation Mars achieves (the
  // choice's own outcome text stays the historical failure regardless), only that the failure
  // went unexplained rather than inevitable. Its stakes are the irony, not the territory — a
  // legitimate note-only case, same as forkLuftwaffeShift above.
  if (flags.forkDeceptionSeen && flags.bagration44soviet === "full" && year === 1944) {
    o.poland = "contested";
    note("German reconnaissance flagged the real concentration areas before Bagration launched: the advance to Warsaw's approaches drew a sharper, more contested response than the historical surprise allowed for (projection).", ["poland"]);
  }
  if (flags.forkAnzioWeak && year === 1944) {
    o.italy = "contested";
    note("A lighter-than-expected coastal garrison opposite the landing beaches left the Anzio bridgehead's opening weeks less precarious than the historical record shows (projection).", ["italy"]);
  }
  if (flags.forkRhodesWeak && year === 1943) {
    o.greece = "contested";
    note("A weaker Rhodes garrison than the planning estimates assumed left the wider Dodecanese improvisation on firmer footing than the historical record shows (projection).", ["greece"]);
  }
  if (flags.forkDesertGap && year === 1940) {
    o.libya = "contested";
    note("A more continuous line between the fortified camps west of Sidi Barrani slowed the opening British push further than the historical record shows (projection).", ["libya"]);
  }
  // forkFleetFast has no map effect: Taranto's battleships being repaired ahead of schedule is
  // a naval readiness question, not a territorial one, and the theater it would matter most to
  // (convoy escort strength) has no tracked region of its own beyond what forkMaltaWeak already
  // covers. A legitimate note-only case, same as forkLuftwaffeShift above.

  // Round 18 (Craig: "Can you check for these errors on the other campaigns especially where
  // Germany would be winning or losing territories separately from the nodes shown to the
  // player"). Everything above this point reads only German-campaign flags (plus the small
  // Italy-only set added in Round 17) — Soviet, Allied and Italy's own major decisions had zero
  // effect on the map. Comprehensive pass per Craig's own choice, after reading every branch
  // point in all three campaigns: the overwhelming majority of Soviet/Allied/Italy nodes are
  // historicalRecord:true (outcome preserved regardless of choice — pace, casualties and
  // politics differ, not who holds what) and correctly need no override at all. These seven
  // blocks are the genuine exceptions — real territorial divergences, almost all gated behind a
  // historicalRecord:false/speculative:true branch and often an uncertain roll on top of that.
  if (flags.finlandOutcome === "occupation" && year >= 1944) {
    o.finland = "soviet";
    note("Finland was pressed into direct Soviet occupation rather than left to a negotiated armistice: brought into the Soviet sphere the way the Baltic states were, not the way Finland actually was (projection).", ["finland"]);
  }
  if (flags.balkans44soviet === "greece" && flags.athensStandoff44 === "hold" && year >= 1944) {
    o.greece = "contested";
    note("Soviet forces held Athens rather than withdrawing when the British landing found the city already occupied: Greece's postwar alignment is a live, contested argument here, not the settled British sphere the historical percentages agreement produced (projection).", ["greece"]);
  }
  if (flags.polishQuestion45 === "standApart" && year >= 1945) {
    o.poland = "contested";
    note("An independent, London-loyal Home Army held apart rather than being absorbed into the Soviet-recognized Polish forces: Poland's postwar alignment is genuinely contested here, not the settled Soviet sphere the historical record shows (projection).", ["poland"]);
  }
  if (flags.berlinFeb45 && year >= 1945) {
    o.germany = "soviet";
    note("A rare, deep breakthrough put Soviet spearheads into Berlin roughly three weeks ahead of the historical assault, before Seelow Heights could be dug in: the city falls in March here, weeks before the Western Allies are anywhere near it (projection).", ["germany"]);
  }
  if (flags.westernCollapse45 && year >= 1945) {
    o.germany = "contested";
    note("Army Group B's mass surrender in the Ruhr collapsed the western front roughly six weeks ahead of the historical schedule while the eastern front was still being fought: Germany's status this spring is a genuine east/west split, not yet the war's actual, later four-power settlement (projection).", ["germany"]);
  }
  if (flags.viennaStandoff44 && year === 1944) {
    o.austria = "contested";
    note("Western Allied forces reached Vienna's approaches ahead of Soviet forces: a genuine alt-history first, though the historical record's own logic still applies once 1945's conference settles the zones: the city ends up divided either way (projection).", ["austria"]);
  }
  if (flags.coupResponse === "backMussolini" && year === 1943) {
    // No o.italy assignment needed — MAP_YEAR_STATUS already has Italy "contested" for 1943,
    // which happens to be the right color for the right reason here too. What the baseline
    // color doesn't convey on its own is *why*: this branch's Italy is contested because a
    // minority of the officer corps fought other Italians over the King's dismissal, a road
    // essentially no one in the documented July 1943 record actually took — not the ordinary
    // occupation/armistice uncertainty the same color represents on the historical path. A
    // note-only entry, same pattern as sealion === "launched" above.
    note("A minority of the officer corps rallied to Mussolini against the King rather than accept his dismissal: Italy's contested status this year reflects a documented-nowhere internal military conflict, not simply the historical transition's occupation-control uncertainty (projection).", ["italy"]);
  }

  return { o, notes };
}



// Node-graph rendering of the same theater state the chit board shows: each region is a
// disc at its schematic coordinate, edges are borders/sea lanes, and the current node's
// highlighted regions get a ring. Reads the identical statuses object as the board, so the
// two views can never disagree about who holds what.
function TheaterGraph({ statuses, highlightSet, divergedRegions, selectedRegion, setSelectedRegion, nameOf, notesForRegion, nodeId }) {
  const VBW = 900;
  const VBH = 620;
  const posOf = (id) => MAP_REGIONS.find((r) => r.id === id);

  return (
    <svg
      viewBox={`0 0 ${VBW} ${VBH}`}
      className="w-full h-auto border-2 border-[#3a2a18]"
      role="img"
      aria-label={`Theater map showing ${MAP_REGIONS.length} regions and their current control status`}
    >
      <defs>
        {/* STATUS_COLORS.divided refers to url(#divideGradient). Without this def the fill
            resolves to nothing and divided regions: Germany and Austria at the end of 1945,
            the two the whole postwar settlement turns on: rendered as empty circles. */}
        <linearGradient id="divideGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={STATUS_COLORS.allied} />
          <stop offset="50%" stopColor={STATUS_COLORS.allied} />
          <stop offset="50%" stopColor={STATUS_COLORS.soviet} />
          <stop offset="100%" stopColor={STATUS_COLORS.soviet} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={VBW} height={VBH} fill="#e3d5ae" />
      {/* Full ruled border, with the corner brackets kept inside it as a map-case detail. */}
      <rect
        x="3"
        y="3"
        width={VBW - 6}
        height={VBH - 6}
        fill="none"
        stroke="#3a2a18"
        strokeWidth="2"
      />
      <rect
        x="8"
        y="8"
        width={VBW - 16}
        height={VBH - 16}
        fill="none"
        stroke="#3a2a18"
        strokeWidth="0.75"
        opacity="0.55"
      />
      {[
        [10, 10, 1, 1],
        [VBW - 10, 10, -1, 1],
        [10, VBH - 10, 1, -1],
        [VBW - 10, VBH - 10, -1, -1],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M ${x} ${y + dy * 16} L ${x} ${y} L ${x + dx * 16} ${y}`}
          fill="none"
          stroke="#3a2a18"
          strokeWidth="3"
        />
      ))}

      {MAP_GRAPH_EDGES.map(([a, b], i) => {
        const ra = posOf(a);
        const rb = posOf(b);
        if (!ra || !rb) return null;
        return (
          <line
            key={i}
            x1={ra.x}
            y1={ra.y}
            x2={rb.x}
            y2={rb.y}
            stroke="#3a2a18"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.45"
          />
        );
      })}

      {MAP_REGIONS.map((r) => {
        const status = statuses[r.id] || "neutral";
        const isHighlighted = highlightSet.has(r.id);
        const isDiverged = divergedRegions.has(r.id);
        const isSelected = selectedRegion === r.id;
        const radius = mapDiscRadius(r.id) + (isHighlighted ? 4 : 0);
        return (
          <g
            key={r.id}
            role={isDiverged ? "button" : undefined}
            tabIndex={isDiverged ? 0 : undefined}
            aria-label={
              isDiverged
                ? `${r.name}: ${STATUS_LABELS[status] || status}, diverged from history. ${isSelected ? "Selected. Activate to deselect." : "Activate to select."}`
                : undefined
            }
            style={{ cursor: isDiverged ? "pointer" : "default" }}
            onClick={isDiverged ? () => setSelectedRegion(isSelected ? null : r.id) : undefined}
            onKeyDown={
              isDiverged
                ? (e) => {
                    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                      e.preventDefault();
                      setSelectedRegion(isSelected ? null : r.id);
                    }
                  }
                : undefined
            }
            className={isDiverged ? "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]" : undefined}
          >
            <circle
              cx={r.x}
              cy={r.y}
              r={radius}
              fill={STATUS_COLORS[status] || STATUS_COLORS.neutral}
              stroke={isHighlighted ? "#b08d3f" : "#3a2a18"}
              strokeWidth={isHighlighted ? 4 : 1.5}
              strokeDasharray={isDiverged ? "5 3" : undefined}
            />
            <text
              x={r.x}
              y={r.y + radius + 13}
              textAnchor="middle"
              fontSize="11"
              fontWeight={isHighlighted ? "700" : "500"}
              fill="#3a2a18"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {r.name}
            </text>
          </g>
        );
      })}

      {/* Arrival pulse: a decorative ring that expands and fades once, over the currently
          highlighted region(s), when the player reaches a new node. This board is a fixed
          schematic rather than a pannable survey map (see the compass-rose note below), so
          there's no literal camera to zoom with: this is that same idea's honest equivalent:
          draw the eye to where the decision is, without pretending the layout has geographic
          precision it doesn't. Keyed on nodeId so React remounts (and the CSS animation
          replays) every time the node changes, even revisiting the same region back-to-back.
          Respects the app's existing reducedMotion override, which zeroes all animation
          durations globally: no separate check needed here. */}
      {[...highlightSet].map((id) => {
        const r = posOf(id);
        if (!r) return null;
        return (
          <circle
            key={`pulse-${id}-${nodeId || "static"}`}
            className="map-pulse-ring"
            cx={r.x}
            cy={r.y}
            r={mapDiscRadius(id)}
            fill="none"
            stroke="#b08d3f"
            strokeWidth="3"
            aria-hidden="true"
          />
        );
      })}

      {/* Compass rose, bottom right. Drawn last so it sits over the graph, and deliberately
          small and low-contrast: this is a schematic of theater control, not a survey map, and
          a loud compass would overclaim geographic precision the layout does not have. */}
      <g transform={`translate(${VBW - 58}, ${VBH - 56})`} opacity="0.78" aria-hidden="true">
        <circle cx="0" cy="0" r="28" fill="#e3d5ae" stroke="#3a2a18" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="22" fill="none" stroke="#3a2a18" strokeWidth="0.6" opacity="0.6" />
        {/* Minor points at 45 degrees */}
        {[45, 135, 225, 315].map((deg) => (
          <line
            key={deg}
            x1="0"
            y1="0"
            x2={Math.sin((deg * Math.PI) / 180) * 19}
            y2={-Math.cos((deg * Math.PI) / 180) * 19}
            stroke="#3a2a18"
            strokeWidth="0.5"
            opacity="0.55"
          />
        ))}
        {/* North needle: filled east half, hollow west half: the conventional split rose */}
        <path d="M 0 -21 L 6 0 L 0 5.5 Z" fill="#3a2a18" />
        <path d="M 0 -21 L -6 0 L 0 5.5 Z" fill="#e3d5ae" stroke="#3a2a18" strokeWidth="0.7" />
        {/* South tail */}
        <path d="M 0 21 L 4 3 L 0 5.5 Z" fill="#3a2a18" opacity="0.45" />
        <path d="M 0 21 L -4 3 L 0 5.5 Z" fill="#e3d5ae" stroke="#3a2a18" strokeWidth="0.6" opacity="0.7" />
        <text
          x="0"
          y="-31"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#3a2a18"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          N
        </text>
      </g>
    </svg>
  );
}

// Round 11 (Craig: "The map wasn't visible from the map option. The idea is this replaces
// the nodes contential situation that is there at the moment... don't remove the nodes map
// from the build yet just don't make it visible once replaced by the more geographically
// accurate map"): the schematic node-graph map below (EuropeMap) is superseded, on the live
// briefing screen, by the real-geography CheckpointMap. Kept in the codebase and still used
// for the post-campaign "Continental Situation — the Europe this war made" summary further
// down; only the mid-briefing "Show Continental Situation" panel is switched off.
const SHOW_LEGACY_SCHEMATIC_MAP = false;

function EuropeMap({ year, accent, flags, meters, highlightRegions, maxYear, resolved, nodeId }) {
  // MAP_YEAR_STATUS entries are year-END snapshots, so the entry for the node's own year
  // already contains the outcome of decisions the player hasn't made yet — showing it
  // mid-briefing leaks the answer (Norway reads "axis" before the invasion is ordered).
  // While a decision is still pending we therefore cap at the previous year's close, which
  // is genuinely settled history from the player's perspective. Once the choice is
  // committed (resolved), the node's own year unlocks.
  const rawMax = Math.max(1939, Math.min(1945, maxYear || 1945));
  const cappedMax = resolved ? rawMax : Math.max(1939, rawMax - 1);
  const initialYear = Math.max(1939, Math.min(cappedMax, year));
  const [scrubYear, setScrubYear] = useState(initialYear);
  const [selectedRegion, setSelectedRegion] = useState(null);
  // Re-center the board on the node's own year whenever the caller passes a new one (a new
  // briefing, or the end screen's final year) — the player can still drag freely from there,
  // but never past cappedMax: mid-campaign that's the current node's year, so scrubbing can't
  // reveal territorial outcomes the player's own run hasn't reached yet.
  useEffect(() => {
    setScrubYear(Math.max(1939, Math.min(cappedMax, year)));
    setSelectedRegion(null);
  }, [year, cappedMax]);

  const clampedYear = scrubYear;
  const base = MAP_YEAR_STATUS[clampedYear] || MAP_YEAR_STATUS[1940];
  const { o, notes } = mapOverrides(clampedYear, flags, meters);
  const statuses = { ...base, ...o };
  const usedStatuses = [...new Set(Object.values(statuses))];
  const nameOf = (id) => (MAP_REGIONS.find((r) => r.id === id) || {}).name || id;
  const highlightSet = new Set(highlightRegions || []);
  const divergedRegions = new Set(notes.flatMap((n) => n.regions || []));
  const notesForRegion = (id) => notes.filter((n) => (n.regions || []).includes(id));

  const CHIT_W = 128;
  const CHIT_H = 46;
  const GAP_X = 10;
  const ROW_H = 74;
  const LABEL_W = 190;
  const PAD = 18;
  const VBW = 900;
  const VBH = PAD * 2 + THEATERS.length * ROW_H;

  return (
    <div className="mb-2">
      <div
        className="text-[11px] uppercase tracking-widest text-[#000000] font-semibold mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Continental Situation: End of {clampedYear} · Theater Map
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#000000] opacity-60 shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          1939
        </span>
        <input
          type="range"
          min="1939"
          max={cappedMax}
          step="1"
          value={scrubYear}
          onChange={(e) => {
            setScrubYear(parseInt(e.target.value, 10));
            setSelectedRegion(null);
          }}
          aria-label={`Scrub the theater status board by year, currently ${scrubYear}, up to ${cappedMax}`}
          className="flex-1 accent-black"
        />
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#000000] opacity-60 shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {cappedMax}
        </span>
      </div>

      <p className="sr-only">
        Theater status board, end of {clampedYear}.{" "}
        {THEATERS.flatMap((theater) =>
          theater.ids.map((id) => `${nameOf(id)}: ${STATUS_LABELS[statuses[id] || "neutral"]}`)
        ).join(". ")}
        {notes.length > 0 ? ". " + notes.map((n) => n.text).join(". ") : ""}
      </p>
      <TheaterGraph
        statuses={statuses}
        highlightSet={highlightSet}
        divergedRegions={divergedRegions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        nameOf={nameOf}
        notesForRegion={notesForRegion}
        nodeId={nodeId}
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {usedStatuses.map((s) => (
          <div key={s} className="flex items-center gap-1 text-[11px] text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span
              className="inline-block w-3 h-3 border border-black"
              style={{ background: s === "divided" ? "linear-gradient(90deg, " + STATUS_COLORS.allied + " 50%, " + STATUS_COLORS.soviet + " 50%)" : STATUS_COLORS[s] }}
            />
            {STATUS_LABELS[s]}
          </div>
        ))}
        {divergedRegions.size > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span aria-hidden="true">{"\u25C6"}</span>
            Diverges from the plain historical status
          </div>
        )}
      </div>
      {selectedRegion && notesForRegion(selectedRegion).length > 0 && (
        <div className="mt-2 border-2 px-2 py-1" style={{ borderColor: accent || "#7a2e2e" }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {nameOf(selectedRegion)}
          </p>
          {notesForRegion(selectedRegion).map((n, i) => (
            <p key={i} className="text-[12px] text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {n.text}
            </p>
          ))}
        </div>
      )}
      {notes.map((n, i) => (
        <p
          key={i}
          className="text-[11px] mt-1 text-[#000000] font-semibold border-l-4 pl-2"
          style={{ borderColor: accent || "#7a2e2e", fontFamily: "'Courier Prime', monospace" }}
        >
          ◈ {n.text}
        </p>
      ))}
    </div>
  );
}

// --- Paper wear system: three independent, stacking visual effects tied to the resource
// triangle (Manpower / Fuel / Initiative). Ported from the Pacific build's Readiness / Pipeline /
// Initiative system — same tier framework, same caps. Nothing here reads a combined "worst
// meter" signal; each axis computes and renders its own tier independently.
function meterSeverityTier(value) {
  if (value >= 3) return "strong";
  if (value >= -1) return "healthy";
  if (value >= -4) return "strained";
  if (value >= -7) return "severe";
  return "catastrophic"; // -8 to -10 — meaningfully distinct from "severe", not a flat repeat of it
}

// --- Meter narrative notes: the same severity read the paper-wear visuals use, expressed as
// prose. Only fires when the single worst (or single best) axis actually crosses into
// "strained"/"max" or "strong" — a healthy middle ground stays silent so this doesn't become
// noise on every routine decision. Rotates two phrasings per axis/direction/campaign so a long
// crisis or a long run of strength doesn't repeat the identical sentence at every stop.
const METER_NOTES = {
  german: {
    manpower: {
      bad: [
        "This month's replacement drafts didn't close the gap the casualty lists opened.",
        "Replacement drafts are no longer closing the gap the casualty lists open.",
      ],
      critical: ["Replacement drafts scheduled for this month never arrived. Divisions are filling rifle gaps with cooks and clerks."],
      good: [
        "Manpower reserves are, unusually, ahead of what the campaign actually needs.",
        "The replacement pipeline has, unusually, gotten ahead of the casualty lists.",
      ],
    },
    fuel: {
      bad: [
        "Matériel allocations are being argued over by army groups that all need the same tanker cars.",
        "The matériel ledger has crossed from tight into constrained.",
      ],
      critical: ["Panzer crews are siphoning tanks from disabled vehicles to keep the rest moving."],
      good: [
        "Matériel stocks have, for the moment, stopped dictating what the staff can even propose.",
        "The matériel picture is unusually generous for this stage of the war.",
      ],
    },
    initiative: {
      bad: [
        "Every order this month has been a response to something the enemy did first.",
        "OKW is no longer choosing where this war is fought: it is being told, and arriving late.",
      ],
      critical: ["Nothing on this front is being decided here any more. The staff is a relay for other people's decisions."],
      good: [
        "The enemy is conforming to this headquarters' movements rather than the reverse: a position the Reich has not held in some time.",
        "The operational tempo belongs to OKW this month, and every front is answering it rather than setting it.",
      ],
    },
  },
  soviet: {
    manpower: {
      bad: [
        "Replacement drafts are arriving thinner than the casualty lists they're meant to answer.",
        "Front commanders have started reporting understrength divisions as routine, not exception.",
      ],
      critical: ["Divisions go into the line the hour they detrain, whether they're ready or not."],
      good: [
        "Replacement drafts have, atypically, arrived ahead of what the front actually lost.",
        "Manpower reserves are unusually deep for this stage of the war.",
      ],
    },
    fuel: {
      bad: [
        "Matériel allocations are being fought over by fronts that all consider their own axis decisive.",
        "The matériel ledger has moved from tight to truly short.",
      ],
      critical: ["Trucks are being pushed off the road and abandoned for lack of fuel to keep them moving."],
      good: [
        "Matériel stocks are, unusually, not the limiting factor on what Stavka can order.",
        "The matériel picture is better than the historical campaign generally had it.",
      ],
    },
    initiative: {
      bad: [
        "Every operation this season has been a reaction: the Germans move, and Stavka answers.",
        "The front is dictating to Stavka rather than the other way round, and it has been for months.",
      ],
      critical: ["Nothing is being initiated from this building. Every order leaving it is a response to something already lost."],
      good: [
        "The Germans are conforming to Stavka's timetable now, committing reserves where they are told to rather than where they choose.",
        "The tempo of this war belongs to the Red Army now, and the enemy is spending his reserves answering it.",
      ],
    },
  },
  allied: {
    manpower: {
      bad: [
        "Replacement drafts are arriving thinner than the casualty lists they're meant to answer.",
        "Divisions are being reported understrength as routine now, not exception.",
      ],
      critical: ["Replacement centers are sending men forward with days, not weeks, of training behind them."],
      good: [
        "Replacement drafts have, against the usual pattern, kept pace with what the campaign has actually spent.",
        "Manpower reserves are unusually deep for this stage of the campaign.",
      ],
    },
    fuel: {
      bad: [
        "Matériel and supply allocations are being argued over by armies that all consider their own axis decisive.",
        "The supply picture has moved from tight to short.",
      ],
      critical: ["Quartermasters are rationing fuel by the truckload now, unit by unit, day by day."],
      good: [
        "Matériel and supply stocks are, this time, not the limiting factor on what SHAEF can authorize.",
        "The logistics picture is better than the historical campaign generally had it.",
      ],
    },
    initiative: {
      bad: [
        "SHAEF is reacting this month, to the weather, to the enemy, to its own supply position, in roughly that order.",
        "Every decision reaching this headquarters arrives already shaped by something that happened without it.",
      ],
      critical: ["Nothing is being initiated from SHAEF. The staff is managing consequences and calling it planning."],
      good: [
        "The German command is responding to Allied movements rather than setting any of its own: the position every plan since 1942 assumed and none delivered until now.",
        "The alliance is choosing where this war goes next rather than discovering it after the fact.",
      ],
    },
  },
  italy: {
    manpower: {
      bad: [
        "Replacement drafts are arriving thinner than the casualty lists they're meant to answer: the mobilization tables never accounted for a war run this long.",
        "Divisions are being reported understrength as a matter of course, not exception.",
      ],
      critical: ["Whole formations exist now only on the order-of-battle chart Comando Supremo keeps for the newspapers."],
      good: [
        "Manpower reserves are, unusually, ahead of what this stage of the war has actually cost.",
        "The replacement pipeline has, against the usual pattern, kept pace with the casualty lists.",
      ],
    },
    fuel: {
      bad: [
        "The convoy losses to Malta's aircraft and submarines are outrunning what any single month's shipping can replace.",
        "Matériel allocations are being argued over by fronts that all consider their own theater decisive.",
      ],
      critical: ["Tanks and trucks in the desert are being cannibalized for parts because no convoy has reached port in weeks."],
      good: [
        "Matériel and supply stocks are, for the moment, not the limiting factor on what this command can actually order.",
        "The convoy picture is better than the historical campaign generally had it.",
      ],
    },
    initiative: {
      bad: [
        "Every order leaving this headquarters this month has been a response to something Berlin, London, or the calendar decided first.",
        "Comando Supremo is no longer setting this war's terms: it is being informed of them, often after the fact.",
      ],
      critical: ["Nothing on any front is being decided from this building any more. The staff is a relay for other commands' decisions."],
      good: [
        "This command is dictating terms this month rather than answering them: a position Rome has held rarely, and not for long, in this war.",
        "The operational tempo belongs to Comando Supremo for once, and the fronts are answering it rather than setting it.",
      ],
    },
  },
};

function meterNarrativeNote(campaignId, meters, seed) {
  const notes = METER_NOTES[campaignId];
  if (!notes || !meters) return "";
  const axes = [
    ["manpower", meters.manpower],
    ["fuel", meters.fuel],
    ["initiative", meters.initiative],
  ];
  // Find the single worst bad axis first (priority: whichever is furthest negative and
  // crosses into strained/severe/catastrophic), else the single best good axis (furthest
  // positive, strong).
  let worst = null;
  for (const [axis, val] of axes) {
    const tier = meterSeverityTier(val);
    if (tier === "strained" || tier === "severe" || tier === "catastrophic") {
      if (!worst || val < worst.val) worst = { axis, val, dir: "bad" };
    }
  }
  if (!worst) {
    for (const [axis, val] of axes) {
      if (meterSeverityTier(val) === "strong") {
        if (!worst || val > worst.val) worst = { axis, val, dir: "good" };
      }
    }
  }
  if (!worst) return "";
  const axisNotes = notes[worst.axis];
  const isCatastrophic = worst.dir === "bad" && meterSeverityTier(worst.val) === "catastrophic";
  const variants = (isCatastrophic && axisNotes.critical) || axisNotes[worst.dir];
  const idx = Math.abs((seed || 0) + worst.val) % variants.length;
  return variants[idx];
}

const REDACTION_PCT = { strong: 0, healthy: 0, strained: 0.045, severe: 0.09, catastrophic: 0.18 };
const TIME_ROTATION_DEG = { strong: 0, healthy: -2, strained: -6, severe: -10, catastrophic: -15 };
const FILING_NOTE = { strong: "", healthy: "", strained: "filed with minor delay", severe: "filed late, out of sequence", catastrophic: "filed out of sequence, pages missing" };

// Redacts a light percentage of eligible words (5+ letters only, so sentence structure stays
// readable) with block characters. Deterministic per call — callers memoize on [text, severity]
// so it doesn't reshuffle mid-typewriter-animation or on unrelated re-renders.
function redactWearText(text, severity) {
  const pct = REDACTION_PCT[severity] || 0;
  if (!pct || !text) return text;
  const tokens = text.split(/(\s+)/);
  const eligible = [];
  tokens.forEach((t, i) => {
    if (t.replace(/[^A-Za-z]/g, "").length >= 5) eligible.push(i);
  });
  const numToRedact = Math.round(eligible.length * pct);
  if (numToRedact <= 0) return text;
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const chosen = new Set(shuffled.slice(0, numToRedact));
  return tokens
    .map((t, i) => {
      if (!chosen.has(i)) return t;
      const m = t.match(/^(\W*)([A-Za-z]+)(\W*)$/);
      if (!m) return t;
      return m[1] + "█".repeat(m[2].length) + m[3];
    })
    .join("");
}

function WearPaperclipTornCorner({ show }) {
  if (!show) return null;
  return (
    <div aria-hidden="true">
      <div
        className="absolute pointer-events-none"
        style={{ top: 0, right: 0, width: 36, height: 36, background: "linear-gradient(135deg, transparent 50%, #000 50%)", opacity: 0.06, zIndex: 1 }}
      />
      <div className="absolute pointer-events-none" style={{ top: -10, left: 18, width: 14, height: 34, zIndex: 3 }}>
        <svg viewBox="0 0 14 34" width="14" height="34">
          <path
            d="M7 2 C11 2 13 5 13 9 L13 24 C13 28 10 31 7 31 C4 31 2 29 2 26 L2 10 C2 8 3 7 5 7 C7 7 8 8 8 10 L8 23"
            fill="none"
            stroke="#5a5a5a"
            strokeWidth="2"
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}

function Typewriter({ text, instant, soundOn }) {
  const [reduceMotion, setReduceMotion] = useState(() => {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  });
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduceMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  const effectiveInstant = instant || reduceMotion;
  const [shown, setShown] = useState(effectiveInstant ? text.length : 0);
  useEffect(() => {
    if (effectiveInstant) {
      setShown(text.length);
      return;
    }
    setShown(0);
    const step = Math.max(3, Math.ceil(text.length / 120));
    let tick = 0;
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= text.length) {
          clearInterval(id);
          return text.length;
        }
        tick++;
        if (soundOn && tick % 3 === 0) playClack();
        return Math.min(text.length, s + step);
      });
    }, 16);
    return () => clearInterval(id);
  }, [text, effectiveInstant]);
  const done = shown >= text.length;
  // Glossary terms: once the text has finished, the first mention of each is underlined with dots and opens a note.
  // The words on the page do not change; the same paragraph is read aloud as before (the status line above), and the
  // full list is under "Glossary" on the title screen.
  const spans = useMemo(() => glossarySpans(text), [text]);
  const [openTerm, setOpenTerm] = useState(null);
  useEffect(() => setOpenTerm(null), [text]);
  const pieces = [];
  if (done && spans.length) {
    let at = 0;
    for (const sp of spans) {
      if (sp.start > at) pieces.push(text.slice(at, sp.start));
      const word = text.slice(sp.start, sp.end);
      pieces.push(
        <button
          key={sp.start}
          type="button"
          tabIndex={-1}
          aria-label={`Show meaning of ${GLOSSARY[sp.idx].term}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpenTerm((o) => (o === sp.idx ? null : sp.idx));
          }}
          className="inline p-0 m-0 bg-transparent text-inherit border-b border-dotted border-[#000000] cursor-help"
          style={{ font: "inherit", textAlign: "inherit" }}
        >
          {word}
        </button>
      );
      at = sp.end;
    }
    if (at < text.length) pieces.push(text.slice(at));
  }
  const note = openTerm != null ? GLOSSARY[openTerm] : null;
  return (
    <>
      <p className="sr-only" role="status">
        {text}
      </p>
      <p
        aria-hidden="true"
        onClick={() => setShown(text.length)}
        className={`leading-relaxed text-[16px] text-[#000000] cursor-pointer ${note ? "mb-2" : "mb-6"}`}
        style={{ fontFamily: "'Courier Prime', monospace", whiteSpace: "pre-line" }}
        title={done ? undefined : "Click to reveal instantly"}
      >
        {done && spans.length ? pieces : text.slice(0, shown)}
        {!done && <span className="opacity-70">▌</span>}
      </p>
      {note && (
        <div role="note" className="mb-6 border-l-4 pl-3 py-1 text-[13px] leading-snug text-[#000000]" style={{ borderColor: "#b08d3f", fontFamily: "'Courier Prime', monospace" }}>
          <b>{note.term}</b>: {note.text}
          <button
            type="button"
            onClick={() => setOpenTerm(null)}
            aria-label={`Close the note on ${note.term}`}
            className="ml-2 px-1 border border-black text-[11px] uppercase tracking-wider hover:bg-[#000000] hover:text-[#ffffff]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

// Easy Command's choice-impact preview. Only lists meters the choice actually moves — a choice
// that's purely narrative (sets a flag, no impact object at all) reads as "No meter change"
// rather than a row of zeroes, so it's visually distinct from a choice that costs exactly nothing
// on every axis by design.
function formatImpactPreview(impact) {
  if (!impact) return "No meter change";
  const parts = [];
  if (impact.manpower) parts.push(`Manpower ${impact.manpower > 0 ? "+" : ""}${impact.manpower}`);
  if (impact.fuel) parts.push(`Matériel ${impact.fuel > 0 ? "+" : ""}${impact.fuel}`);
  if (impact.initiative) parts.push(`Initiative ${impact.initiative > 0 ? "+" : ""}${impact.initiative}`);
  return parts.length ? parts.join(", ") : "No meter change";
}

function cohesionLabel(c) {
  const v = c || 0;
  if (v >= 3) return "Solid";
  if (v >= 0) return "Workable";
  if (v >= -2) return "Strained";
  return "Fraying";
}

function BriefingScreen({ campaign, stage, nodeId, meters, flags, reportNumber, pastStages, log, mode, favor, instantText, soundOn, controlBattles = true, onChoose, onRewind, onSave, onHome, seenWireHeadlines, lastSeenMapStatuses, onStatusesChange, history }) {
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | failed
  const [showMap, setShowMap] = useState(false);
  const easy = mode === "easy";
  const iron = mode === "iron";
  const purge = mode === "purge";
  const coalition = mode === "coalition";
  const axis = mode === "axis";
  const noRewind = iron || purge || coalition || axis;
  // The state before the last decision: the entry before this node's own in the run's history.
  const prev = history && history.length >= 2 ? history[history.length - 2] : null;
  const headingRef = useRef(null);
  useEffect(() => {
    // Runs on every new node — both a fresh mount (the normal briefing -> outcome -> next-
    // briefing cycle) and a same-mount update (rewinding to an earlier decision, which changes
    // reportNumber/stage without unmounting this screen). Without an explicit reset, whatever
    // scroll position the previous screen left behind carries over, and on a card taller than
    // the viewport that can land the player mid-page instead of at the title.
    window.scrollTo({ top: 0, left: 0 });
    if (headingRef.current) headingRef.current.focus();
  }, [reportNumber, stage]);
  useEffect(() => {
    const onKey = (e) => {
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= displayOrder.length) {
        const trueIdx = displayOrder[n - 1];
        const c = stage.choices[trueIdx];
        if (!(iron && c.favor && c.favor > favor)) onChoose(trueIdx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  // With Sound on, a soft note goes with each direction the meters moved since the last decision.
  useEffect(() => {
    if (!soundOn || !prev || !prev.meters) return undefined;
    const diffs = ["manpower", "fuel", "initiative"].map((k) => (meters[k] || 0) - (prev.meters[k] || 0));
    const timers = [];
    if (diffs.some((d) => d > 0)) timers.push(setTimeout(() => playMeter(true), 350));
    if (diffs.some((d) => d < 0)) timers.push(setTimeout(() => playMeter(false), diffs.some((d) => d > 0) ? 550 : 350));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportNumber]);
  const isHistorical = stage.historicalRecord !== false;
  const total = meters.manpower + meters.fuel + meters.initiative;
  // Führer Mode has no dashboard, so the staff's notes stand on the page; every other mode keeps them inside the
  // meter panel, beside the meter they are about.
  const warnings = campaign.dynamic && iron ? ["manpower", "fuel", "initiative"].flatMap((k) => meterStaffNotes(k, meters, flags)) : [];
  const showReview = campaign.dynamic && log.length > 0;
  const comparableSoFar = log.filter((e) => e.histSum != null);
  const matchedSoFar = comparableSoFar.filter((e) => e.isHistorical).length;
  const manpowerSev = campaign.dynamic ? meterSeverityTier(meters.manpower) : "strong";
  const timeSev = campaign.dynamic ? meterSeverityTier(meters.initiative) : "strong";
  const displayOrder = useMemo(() => {
    // Deterministic per node-visit shuffle (Fisher-Yates seeded on reportNumber + the node's
    // own situation text) — stable while this node is on screen, varies visit to visit, so
    // there's no learnable pattern in where any particular choice tends to appear.
    const order = stage.choices.map((_, i) => i);
    let seed = (reportNumber || 0) * 2654435761 + stage.situation.length;
    for (let i = order.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, [stage.choices, stage.situation, reportNumber]);
  const redactedSituation = useMemo(
    () => (campaign.dynamic && mode !== "open" && mode !== "easy" ? redactWearText(stage.situation, manpowerSev) : stage.situation),
    [stage.situation, manpowerSev, campaign.dynamic, mode]
  );
  const situationWithNote = useMemo(() => {
    if (!campaign.dynamic) return redactedSituation;
    const note = meterNarrativeNote(campaign.id, meters, reportNumber);
    return note ? redactedSituation + "\n\n" + note : redactedSituation;
  }, [redactedSituation, campaign.dynamic, campaign.id, meters.manpower, meters.fuel, meters.initiative, reportNumber]);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-start justify-center px-4 py-10">
      <div
        className={`${paper} w-full max-w-[600px] p-6 sm:p-8 relative overflow-hidden`}
        style={campaignPaperStyle(campaign.id, campaign.accent)}
      >
        {campaign.dynamic && <WearPaperclipTornCorner show={timeSev === "catastrophic"} />}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div style={{ display: "inline-block", transform: `rotate(${campaign.dynamic ? TIME_ROTATION_DEG[timeSev] : 0}deg)` }}>
            <Stamp text={campaign.seal} color={campaign.accent} campaignId={campaign.id} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              ref={headingRef}
              tabIndex={-1}
              role="heading"
              aria-level="1"
              className="text-xs uppercase tracking-widest text-[#000000] font-semibold outline-none"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {campaign.dynamic ? campaignReportLabel(campaign.id, stage.directive ? "directive" : "situation") : stage.directive ? "Theater Directive" : "Situation Report"} · No. {reportNumber}
              {campaign.dynamic && FILING_NOTE[timeSev] && (
                <span className="opacity-50 italic normal-case tracking-normal"> · {FILING_NOTE[timeSev]}</span>
              )}
            </div>
            <button
              onClick={async () => {
                setSaveState("saving");
                const ok = await onSave();
                setSaveState(ok ? "saved" : "failed");
                setTimeout(() => setSaveState("idle"), 2000);
              }}
              className="border-2 border-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : saveState === "failed" ? "Save failed: retry" : "Save"}
            </button>
            <button
              onClick={onHome}
              className="border-2 border-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Home
            </button>
          </div>
        </div>
        {showMap && (
          <CheckpointMap
            campaign={campaign}
            year={yearFrom(stage.date, 1940)}
            flags={flags}
            meters={meters}
            resolved={false}
            seenWireHeadlines={seenWireHeadlines || []}
            onClose={() => setShowMap(false)}
            nodeId={nodeId}
            lastSeenMapStatuses={lastSeenMapStatuses}
            onStatusesChange={onStatusesChange}
            history={history}
            review={showReview ? (!iron ? (total >= 3 ? " · ahead of the historical baseline" : total <= -3 ? " · behind the historical baseline" : " · tracking the historical record") : "") + (comparableSoFar.length > 0 ? ` · history matched at ${matchedSoFar} of ${comparableSoFar.length} points` : "") : null}
          />
        )}

        {campaign.dynamic && <Timeline date={stage.date} accent={campaign.accent} />}

        {/* Round 13 (Craig: "Can the map being moved into one of the old continental theatre
            bar in the main node section"): this bar used to open the old schematic
            "Show Continental Situation" node-graph map (EuropeMap: see
            SHOW_LEGACY_SCHEMATIC_MAP above; still used by the post-campaign summary screen,
            just not here). It now opens the real-geography Checkpoint Map instead, from the
            same position in the briefing flow the old bar held: replacing the small toolbar
            "Map" button above, not adding a second entry point alongside it. */}
        {campaign.dynamic && (
          <button
            onClick={() => setShowMap(true)}
            className="w-full text-left mb-4 border-2 border-black px-3 py-2 text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Show Theater Map
          </button>
        )}
        {SHOW_LEGACY_SCHEMATIC_MAP && campaign.dynamic && (
          <details className="mb-4 border-2 border-black px-3 py-2">
            <summary
              className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Show Continental Situation
            </summary>
            <div className="mt-3">
              <EuropeMap
                year={yearFrom(stage.date, 1940)}
                maxYear={yearFrom(stage.date, 1940)}
                flags={flags}
                meters={meters}
                accent={campaign.accent}
                highlightRegions={(NODE_HIGHLIGHT_REGIONS[campaign.id] || {})[nodeId]}
                nodeId={nodeId}
                resolved={false}
              />
            </div>
          </details>
        )}

        {campaign.dynamic && !iron && <MeterPanel meters={meters} flags={flags} prev={prev} />}
        {campaign.dynamic && iron && (
          <div
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4 border-2 px-3 py-2 text-[11px] sm:text-xs uppercase tracking-widest font-bold"
            style={{ borderColor: "#7a2e2e", color: "#7a2e2e", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>Führer Mode</span>
            <span style={{ color: "#000000" }} className="whitespace-nowrap">
              Political capital {"●".repeat(Math.max(0, favor))}
              {"○".repeat(Math.max(0, 5 - favor))} ({favor}/5)
            </span>
          </div>
        )}
        {campaign.dynamic && purge && (
          <div
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4 border-2 px-3 py-2 text-[11px] sm:text-xs uppercase tracking-widest font-bold"
            style={{ borderColor: "#7a2e2e", color: "#7a2e2e", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>NKVD Mode</span>
            <span style={{ color: "#000000" }} className="whitespace-nowrap">
              Suspicion {"●".repeat(Math.min(5, flags.suspicion || 0))}
              {"○".repeat(Math.max(0, 5 - (flags.suspicion || 0)))} ({flags.suspicion || 0}/5)
            </span>
          </div>
        )}
        {campaign.dynamic && coalition && (
          <div className="mb-4 border-2 px-3 py-2" style={{ borderColor: "#7a2e2e" }}>
            <div className="text-[11px] sm:text-xs uppercase tracking-widest font-bold" style={{ color: "#7a2e2e", fontFamily: "'IBM Plex Mono', monospace" }}>
              Yalta Mode
            </div>
            <div className="mt-1">
              <MeterBar label="Cohesion" value={flags.cohesion || 0} min={-6} max={6} danger={(flags.cohesion || 0) <= -3} valueLabel={`${(flags.cohesion || 0) > 0 ? "+" : ""}${flags.cohesion || 0} ${cohesionLabel(flags.cohesion)}`} />
            </div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Coalition Cohesion, from -6 to +6. At -6 the alliance relieves you of command.
            </div>
          </div>
        )}
        {campaign.dynamic && axis && (
          <div className="mb-4 border-2 px-3 py-2" style={{ borderColor: "#7a2e2e" }}>
            <div className="text-[11px] sm:text-xs uppercase tracking-widest font-bold" style={{ color: "#7a2e2e", fontFamily: "'IBM Plex Mono', monospace" }}>
              Axis Mode
            </div>
            <div className="mt-1">
              <MeterBar label="Trust" value={flags.trust || 0} min={-5} max={5} danger={(flags.trust || 0) <= -3} valueLabel={`${(flags.trust || 0) > 0 ? "+" : ""}${flags.trust || 0} ${cohesionLabel(flags.trust)}`} />
            </div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              German Trust, from -5 to +5. At -5 Berlin supersedes the command.
            </div>
          </div>
        )}

        {warnings.map((w, i) => (
          <p
            key={i}
            className="text-[13px] mb-2 border-2 px-3 py-2 font-bold uppercase tracking-wide text-[#000000]"
            style={{ borderColor: w.grave ? "#7a2e2e" : "#000000", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {w.text}
          </p>
        ))}

        {(stage.alternateHistory || flags.alternateHistoryPath) ? (
          <div className="mb-4">
            <span
              className="inline-block border-[4px] px-2 py-1 text-xs uppercase tracking-widest font-bold"
              style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#7a2e2e", color: "#7a2e2e" }}
            >
              ⚠⚠ Alternate History: invented, not argued by historians
            </span>
          </div>
        ) : (stage.speculative || flags.speculativePath) ? (
          <div className="mb-4">
            <span
              className="inline-block border-[3px] px-2 py-1 text-xs uppercase tracking-widest font-bold"
              style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#b08d3f", color: "#7a5b1e" }}
            >
              ⚠ Speculative: beyond what evidence supports
            </span>
          </div>
        ) : !isHistorical ? (
          <div className="mb-4">
            <span
              className="inline-block border-2 border-black px-2 py-1 text-xs uppercase tracking-widest font-bold"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Projected Scenario: beyond the historical record
            </span>
          </div>
        ) : null}

        {stage.meanwhile && (
          <p
            className="text-[13px] italic mb-4 border-l-4 pl-3 text-[#000000]"
            style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}
          >
            {stage.meanwhile}
          </p>
        )}

        <div
          className="text-xs uppercase tracking-[0.25em] mb-1 text-[#000000] font-semibold"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {formatDateForCampaign(shiftDateForPace(stage.date, meters.initiative, campaign.id), campaign.id)}
        </div>
        <h2
          className="text-3xl mb-4 text-[#000000]"
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
        >
          {stage.title}
        </h2>
        <Typewriter text={situationWithNote} instant={instantText} soundOn={soundOn} />

        <div
          className="text-xs uppercase tracking-[0.25em] mb-3 text-[#000000] font-semibold"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Issue Order
        </div>
        <div className="flex flex-col gap-3 mb-6">
          {displayOrder.map((i) => {
            const choice = stage.choices[i];
            return (
            <button
              key={i}
              onClick={() => onChoose(i)}
              disabled={(iron && choice.favor && choice.favor > favor) || !!choice.disabledReason}
              className="text-left border-2 px-4 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#000000]"
              style={{
                borderColor: (iron && choice.favor && choice.favor > favor) || choice.disabledReason ? "#9a9a9a" : campaign.accent,
                textDecoration: (iron && choice.favor && choice.favor > favor) || choice.disabledReason ? "line-through" : "none",
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              <span className="font-medium block">{choice.label}</span>
              {easy && choice.historical && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#3a6b4f", color: "#3a6b4f" }}
                >
                  <span aria-hidden="true">◆ </span>What the record shows happened
                </span>
              )}
              {easy && !choice.uncertain && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px] opacity-70"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">Δ </span>{formatImpactPreview(choice.impact)}
                </span>
              )}
              {easy && choice.uncertain && !choice.concealRoll && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px] opacity-70"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">Δ </span>
                  {choice.uncertain.map((v, vi) => `${v.title}: ${formatImpactPreview(v.impact || choice.impact)}`).join(" · ")}
                </span>
              )}
              {easy && choice.uncertain && choice.concealRoll && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px] opacity-70"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">Δ </span>Outcome genuinely uncertain, not even the preview can tell you this one
                </span>
              )}
              {iron && choice.favor && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">⚔ </span>Costs {choice.favor} political capital{choice.favor > favor ? ": insufficient" : ""}
                </span>
              )}
              {choice.disabledReason && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">⛔ </span>Unavailable: {choice.disabledReason}
                </span>
              )}
              {!choice.disabledReason && choice.checkLabel && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px] opacity-60"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <span aria-hidden="true">✓ </span>{choice.checkLabel} check passed
                </span>
              )}
              {/* Round 4 (Craig: "we need a way when selecting the node that the choice will
                  lead to battle planning"): the Order of Battle screen used to arrive with no
                  warning: a player picking this choice had no way to know it wasn't a normal
                  one-tap decision. Unconditional (not mode-gated like the Easy-mode preview
                  badges above) since this is need-to-know regardless of difficulty: it changes
                  what tapping the button actually does, not just what it previews. */}
              {KEY_BATTLE_SUBGAME_ENABLED && controlBattles && !choice.disabledReason && choice.keyBattleSubgame && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: campaign.accent, color: campaign.accent }}
                >
                  <span aria-hidden="true">⚑ </span>Leads to battle planning
                </span>
              )}
              {coalition && typeof choice.cohesionDelta === "number" && choice.cohesionDelta !== 0 && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {choice.cohesionDelta > 0 ? "▲" : "▼"} {choice.cohesionDelta > 0 ? "+" : ""}
                  {choice.cohesionDelta} Coalition Cohesion
                </span>
              )}
              {purge && typeof choice.suspicionDelta === "number" && choice.suspicionDelta !== 0 && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {choice.suspicionDelta > 0 ? "▲" : "▼"} {choice.suspicionDelta > 0 ? "+" : ""}
                  {choice.suspicionDelta} Suspicion
                </span>
              )}
              {axis && typeof choice.trustDelta === "number" && choice.trustDelta !== 0 && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {choice.trustDelta > 0 ? "▲" : "▼"} {choice.trustDelta > 0 ? "+" : ""}
                  {choice.trustDelta} German Trust
                </span>
              )}
              {choice.attested ? (
                <span className="block text-[13px] italic mt-1 opacity-80 group-hover:opacity-100">
                  “{choice.attested.text}”: {choice.attested.by}
                </span>
              ) : (
                choice.advisor && (
                  <span className="block text-[13px] italic mt-1 opacity-80 group-hover:opacity-100">
                    {choice.advisor.name.charAt(0).toUpperCase() + choice.advisor.name.slice(1)} argues: {choice.advisor.position}
                  </span>
                )
              )}
              {choice.strain && choice.strain.points > 0 && (
                <span className="block mt-1 text-[12px] font-bold" style={{ color: "#7a2e2e", fontFamily: "'IBM Plex Mono', monospace" }}>
                  <span aria-hidden="true">▼ </span>
                  Strain: {choice.strain.causes.length ? choice.strain.causes.join(" and ") + " short" : "supplies short"}
                  {choice.concealRoll ? ", and the odds are worse for it" : `, so the odds are ${choice.strain.points} points worse for it`}
                </span>
              )}
              {choice.uncertain && !choice.concealRoll && (
                <span
                  className="inline-block mt-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  ⚄ Contested: {" "}
                  {choice.uncertain
                    .map((v) => {
                      const total = choice.uncertain.reduce((a, x) => a + x.weight, 0);
                      return `${Math.round((v.weight / total) * 100)}% ${v.title}`;
                    })
                    .join(" / ")}
                </span>
              )}
            </button>
            );
          })}
        </div>

        {!noRewind && pastStages && pastStages.length > 0 && (
          <details className="border-t-2 pt-3" style={{ borderColor: campaign.accent }}>
            <summary
              className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Reconsider an Earlier Decision
            </summary>
            <p
              className="text-[12px] italic mt-2 text-[#000000] opacity-70"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              Note: contested decisions re-roll on a rewound timeline: history is not obliged to repeat
              itself.
            </p>
            <div className="flex flex-col gap-2 mt-3">
              {pastStages.map((p) => (
                <button
                  key={p.index}
                  onClick={() => onRewind(p.index)}
                  className="text-left border px-3 py-2 text-xs text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
                  style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}
                >
                  ↺ Rewind to {p.date}: {p.title}
                </button>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Key Battle Subgame prototype (KEY_BATTLE_SUBGAME_ENABLED only). Sits between choosing a
// keyBattleSubgame-flagged option and that choice's uncertain[] roll actually being thrown.
// Round 9 flow (Craig's items #1, #2, #7): this screen now only BUILDS the plan — allocation,
// commander, approach, and any chits deliberately left unplaced as a reserve — and hands it to
// BattleSimulationScreen. The roll itself no longer happens at commit; it happens at the end of
// the battle report, after the mid-battle reserve decision, so that decision can actually change
// the odds rather than decorate a result that was already decided. See chooseOption.
function BattleAllocationScreen({ campaign, config, meters, flags, mode, soundOn, onCommit, onSpendInitiative, easyMode, resume, onDraft, onSaveLeave }) {
  const headingRef = useRef(null);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (headingRef.current) headingRef.current.focus();
  }, []);

  // Round 9: categories are per battle now (Omaha's are not Kursk's) — see keyBattleCategories.
  const categories = keyBattleCategories(config);
  // Round 23 (strands bite): an arm that draws on a Matériel strand (category.strand) carries more or
  // less weight as that strand reads Plentiful, Adequate, Strained or Short. Read once, as the pool is.
  const [strandInfo] = useState(() => {
    if (resume && resume.strandInfo) return resume.strandInfo;
    const byId = Object.fromEntries(materielReadout(flags || {}, meters).map((r) => [r.id, r]));
    const strandFor = (c) => (c.strand ? byId[STRAND_ALIAS[c.strand] || c.strand] : null);
    return Object.fromEntries(
      categories.map((c) => [c.id, strandFor(c) ? { name: strandFor(c).name, band: strandFor(c).band, mult: STRAND_BAND_MULT[strandFor(c).band] } : null])
    );
  });
  const strandMults = Object.fromEntries(categories.map((c) => [c.id, strandInfo[c.id] ? strandInfo[c.id].mult : 1]));

  // Round 4 (Craig: "could we have a commander selection option which had a modifier on one of
  // the four categories"). Null = no selection ("no particular emphasis," the honest default).
  // Keyed by config.id against KEY_BATTLE_COMMANDERS; battles without a roster render no
  // commander section at all rather than an empty one.
  const commanderRoster = KEY_BATTLE_COMMANDERS[config.id] || [];
  // Round 23: in a campaign's hard mode a battle can carry orders from above (config.hardRule): a
  // locked approach or commander, officers who are not available, or a ban on giving ground. The
  // locks are applied here and the ban on giving ground in the report.
  const hardRule = HARD_MODE_NAMES[mode] ? config.hardRule || null : null;
  const commanderBarred = (id) => !!hardRule && ((hardRule.lockCommander && hardRule.lockCommander !== id) || (hardRule.forbidCommanders || []).includes(id));
  const [commanderId, setCommanderId] = useState(resume ? resume.commanderId ?? null : hardRule?.lockCommander ?? null);
  const selectedCommander = commanderRoster.find((c) => c.id === commanderId) || null;

  // Round 4 follow-up (Craig: "let's make this one between the two tactical choices"). Forced
  // pick, no default: the Commit button stays disabled until one is chosen for any battle with
  // a roster entry.
  const approachRoster = KEY_BATTLE_APPROACHES[config.id] || [];
  const [approachId, setApproachId] = useState(resume ? resume.approachId ?? null : hardRule?.lockApproach ?? null);
  const selectedApproach = approachRoster.find((a) => a.id === approachId) || null;

  // Round 9, item #1: the enemy's hidden posture for THIS attempt at this battle, drawn once per
  // screen instance (lazy initializer) and never shown directly — only one line of intelligence
  // hints at it (postureHint), and it's revealed as the "contact" beat of the battle report.
  // A resumed battle keeps the enemy setup it was saved with, so saving and loading cannot be used to redraw it.
  const restorePosture = (id) => (KEY_BATTLE_POSTURES[config.id] || []).find((p) => p.id === id) || null;
  const [posture] = useState(() => (resume && resume.postureId && restorePosture(resume.postureId)) || pickKeyBattlePosture(config.id, undefined, config.phases ? 1 : undefined));
  // Round 22 (twists): a battle fought in phases (config.phases, a list of phase names) draws a
  // second hidden posture for its second phase. The plan is weighed against the average of the
  // two, and the report reveals the second one half way through — so intelligence about the first
  // phase is only part of the picture, which is exactly what fighting an outbound leg and a bomb
  // run, or a morning raid and an afternoon raid, is like.
  const phaseNames = config.phases || null;
  const [posture2] = useState(() => (resume && resume.posture2Id && restorePosture(resume.posture2Id)) || (phaseNames && posture ? pickKeyBattlePosture(config.id, posture.id, 2) : null));
  // Mean posture multiplier for a category: the first posture's alone for an ordinary battle.
  function postureMultFor(catId) {
    const m1 = posture?.modifiers?.[catId] ?? 1;
    return posture2 ? (m1 + (posture2.modifiers?.[catId] ?? 1)) / 2 : m1;
  }
  // Round 22 (explainer): the first Order of Battle a player meets arrives after one or two
  // decisions, so the first one opens with a short plain-language guide, shut on every later visit.
  const [introOpen] = useState(() => {
    try {
      return !window.localStorage.getItem("dispatches1940_battle_intro_seen");
    } catch {
      return true;
    }
  });
  const [guideOpen, setGuideOpen] = useState(introOpen);
  useEffect(() => {
    try {
      window.localStorage.setItem("dispatches1940_battle_intro_seen", "1");
    } catch {
      /* storage can be blocked; the guide then simply opens every time */
    }
  }, []);
  // Round 10, Craig's item #4: the intelligence summary is wrong one time in four — the hint is
  // then drawn from a DIFFERENT posture than the real one, so a player who reads the intel
  // perfectly still gets fooled sometimes, the way a general would. Whether it was right is
  // told after the battle (the battle report's after-action notes), never before.
  // Round 13, item #3: factored out to drawIntel() so the paid Reconnaissance Pass (requestRecon,
  // below) can redraw the same hint at a lower error rate instead of duplicating this logic.
  function drawIntel(errorRate) {
    if (!posture) return null;
    const roster = KEY_BATTLE_POSTURES[config.id] || [];
    const others = roster.filter((p) => p.id !== posture.id && (!config.phases || p.only !== 2));
    const wrong = others.length > 0 && Math.random() < errorRate;
    const source = wrong ? others[Math.floor(Math.random() * others.length)] : posture;
    const hint = source.hints.length ? source.hints[Math.floor(Math.random() * source.hints.length)] : null;
    return { hint, hintPostureId: source.id, correct: !wrong };
  }
  // Round 13, item #8 (minor difficulty tie-in): Easy Command's own text already promises "full
  // [meter] visibility" as its whole training-wheels premise — extending that to the subgame's
  // one piece of hidden information means the free hint is simply never wrong in Easy, at 0
  // error rate rather than the usual 1-in-4. Standard and the hard modes are untouched.
  const [intel, setIntel] = useState(() => (resume && resume.intel !== undefined ? resume.intel : drawIntel(easyMode ? 0 : KEY_BATTLE_INTEL_ERROR_RATE)));
  const postureHint = intel?.hint || null;
  // Round 13, item #3: a Recon Pass is a one-shot, paid redraw of the same hint at
  // KEY_BATTLE_RECON_ERROR_RATE instead of the free hint's rate. Gated the same way the staff
  // assessment is gated below (needs Initiative to spend, one use per screen instance — buying
  // a second look at the same ground has diminishing returns the design isn't trying to model).
  const [reconUsed, setReconUsed] = useState(!!(resume && resume.reconUsed));
  function requestRecon() {
    if (reconUsed || (meters.initiative || 0) <= 0 || !posture) return;
    setIntel(drawIntel(KEY_BATTLE_RECON_ERROR_RATE));
    setReconUsed(true);
    if (onSpendInitiative) onSpendInitiative();
    if (soundOn) playRadio();
  }

  // Pool size: a base of 5 effort chits, plus one bonus chit per meter (manpower/fuel/
  // initiative) standing above +2 — "extra resources should directly help," as a bigger toolkit
  // rather than a gate. Round 9: frozen at mount, because the staff assessment below spends
  // Initiative on this very screen — without the freeze, buying an assessment at Initiative +3
  // would drop the meter to +2, shrink the pool by one mid-plan, and could leave the player with
  // more chits placed than the pool now allows.
  const [bonusMeters] = useState(() => (resume && Array.isArray(resume.bonusMeters) ? resume.bonusMeters : ["manpower", "fuel", "initiative"].filter((m) => (meters[m] || 0) > 2)));
  const poolSize = 5 + bonusMeters.length;

  const [allocation, setAllocation] = useState(() => Object.fromEntries(categories.map((c) => [c.id, (resume && resume.allocation && resume.allocation[c.id]) || 0])));
  const spent = Object.values(allocation).reduce((a, v) => a + v, 0);
  const remaining = poolSize - spent;

  function addEffort(catId) {
    if (remaining <= 0) return;
    if (soundOn) playTick(true);
    setAllocation((a) => ({ ...a, [catId]: a[catId] + 1 }));
  }
  function removeEffort(catId) {
    if (allocation[catId] > 0 && soundOn) playTick(false);
    setAllocation((a) => (a[catId] > 0 ? { ...a, [catId]: a[catId] - 1 } : a));
  }
  // Round 22 (quick placement): one tap for an even split, one for a clean slate. An even split of a
  // pool that doesn't divide leaves the remainder unplaced, as the reserve.
  function spreadEvenly() {
    const each = Math.floor(poolSize / categories.length);
    setAllocation(Object.fromEntries(categories.map((c) => [c.id, each])));
  }
  function clearAll() {
    setAllocation(Object.fromEntries(categories.map((c) => [c.id, 0])));
  }

  // Round 3 (Craig): a battle isn't a spreadsheet — the same push doesn't land the same way
  // twice. Rolled once per screen instance and applied as a +/-30% jitter on that category's
  // base effectiveness, shown only as a banded readiness phrase (see readiness()).
  const [jitter] = useState(() => Object.fromEntries(categories.map((c) => [c.id, resume && resume.jitter && resume.jitter[c.id] ? resume.jitter[c.id] : 0.7 + Math.random() * 0.6])));
  function approachModifier(catId) {
    return selectedApproach?.modifiers?.[catId] ?? 0;
  }
  // Per-chit weight for a category: jittered base effectiveness, plus the commander's flat
  // bonus and the approach's flat modifier (both known facts going in, so un-jittered) — then,
  // round 9, the whole thing scaled by the hidden enemy posture, which blunts or opens an arm no
  // matter who leads it (see KEY_BATTLE_POSTURES for why it has to scale the whole weight).
  function effectiveWeight(catId, commander = selectedCommander, approach = selectedApproach) {
    return battleArmWeight({ config, catId, jitter: jitter[catId], commander, approach, posture, posture2, strandMult: strandMults[catId] });
  }
  function weightsMap(commander = selectedCommander, approach = selectedApproach) {
    return Object.fromEntries(categories.map((c) => [c.id, effectiveWeight(c.id, commander, approach)]));
  }
  // Bottom/middle/top third of the jitter range — a coarse signal, not the number itself. Does
  // NOT reflect the enemy posture: readiness is about your own formations, the posture is about
  // the enemy's, and only the intelligence line (or a paid staff assessment) speaks to that.
  function readiness(catId) {
    const j = jitter[catId];
    if (j < 0.9) return "reports uncertain";
    if (j > 1.1) return "in good order";
    return "holding to plan";
  }

  // Round 9, Craig's item #7: "a button... get staff assessment on plan but it costs one
  // initiative." A verdict in words only — never a number or a percentage, since round 6
  // removed the odds-range panel precisely because a spreadsheet readout made the screen feel
  // wrong. What the Initiative actually buys is real information: the verdict is computed with
  // the TRUE weights, hidden posture included, and the one specific pointer it adds can point at
  // exactly the thing the player can't otherwise see (the enemy being strongest where they're
  // heaviest, or an arm the posture favors that they've underused). Re-buyable; marked stale as
  // soon as the plan changes after it was given.
  const [assessment, setAssessment] = useState(resume ? resume.assessment || null : null);
  const planKey = JSON.stringify([allocation, commanderId, approachId]);

  // Round 23 (item 7, "let your staff plan it"): the whole battle handed to the staff. Commander,
  // approach and placement come from staffPlanFor; the report then runs itself (see autoplay in
  // BattleSimulationScreen). A standing setting does it every time.
  // The standing choice lives in the main Settings ("Always let my staff plan battles"), off by default.
  const [staffAlways] = useState(() => {
    try {
      return window.localStorage.getItem("dispatches1940_staff_plans") === "1";
    } catch {
      return false;
    }
  });
  function letStaffPlan() {
    const allowedCommanders = commanderRoster.filter((c) => !commanderBarred(c.id) || c.id === hardRule?.lockCommander);
    const allowedApproaches = hardRule?.lockApproach ? approachRoster.filter((a) => a.id === hardRule.lockApproach) : approachRoster;
    const plan = staffPlanFor({
      config,
      categories,
      poolSize,
      strandMults,
      commanders: hardRule?.lockCommander ? allowedCommanders.filter((c) => c.id === hardRule.lockCommander) : allowedCommanders,
      approaches: allowedApproaches,
      postures: KEY_BATTLE_POSTURES[config.id] || [],
      commanderRequired: !!hardRule?.lockCommander,
    });
    if (!plan) return;
    const commander = commanderRoster.find((c) => c.id === plan.commanderId) || null;
    const approach = approachRoster.find((a) => a.id === plan.approachId) || null;
    if (soundOn) playStamp();
    onCommit({
      allocation: plan.allocation,
      reserves: 0,
      poolSize,
      weights: weightsMap(commander, approach),
      commanderId: plan.commanderId,
      approachId: plan.approachId,
      postureId: posture?.id ?? null,
      posture2Id: posture2?.id ?? null,
      intel: null,
      assessment: null,
      autoplay: true,
    });
  }
  const autoStarted = useRef(false);
  useEffect(() => {
    if (staffAlways && !autoStarted.current && !resume) {
      autoStarted.current = true;
      letStaffPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Round 10, item #4: reliability is set by Initiative at the moment of asking (before paying
  // for it) — see staffReliability. When the roll says the staff get it wrong, their verdict is
  // shifted one or two bands from the truth and their specific pointer is replaced with a
  // plausible but unfounded one. The player is only told which it was after the battle.
  const reliability = staffReliability(meters.initiative);
  const BAND_TEXT = [
    "The staff think this plan is strong. They would send it as written.",
    "Sound, the staff say, but not overwhelming.",
    "The staff are uneasy. This plan will move the line, but not far.",
    "The staff advise against this plan. As written, it leaves you worse off than doing nothing.",
  ];
  // One Initiative buys the staff's review of the plan: a verdict on it against what the enemy really has (which
  // may be wrong, at the staff's reliability), and a war game of it against two setups the enemy might show (which
  // cannot say which one he has). Re-buyable; marked stale as soon as the plan changes after it was given.
  function requestStaffReview() {
    if (spent === 0) return;
    const accurate = Math.random() * 100 < reliability;
    if (onSpendInitiative) onSpendInitiative();
    if (soundOn) playRadio();
    const contributions = computeBattleContributions(categories, allocation, weightsMap(), poolSize);
    const bonus = clampBattleBonus(sumBattleContributions(contributions));
    const trueBand = bonus >= 20 ? 0 : bonus >= 10 ? 1 : bonus >= 0 ? 2 : 3;
    let shownBand = trueBand;
    if (!accurate) {
      const step = Math.random() < 0.7 ? 1 : 2;
      const dir = Math.random() < 0.5 ? -1 : 1;
      shownBand = trueBand + dir * step;
      if (shownBand < 0 || shownBand > 3) shownBand = trueBand - dir * step;
      shownBand = Math.max(0, Math.min(3, shownBand));
      if (shownBand === trueBand) shownBand = trueBand === 0 ? 1 : trueBand - 1;
    }
    const text = BAND_TEXT[shownBand];
    const pm = (id) => postureMultFor(id);
    const neglected = categories.filter((c) => contributions[c.id] < 0);
    const heaviest = categories.reduce((m, c) => ((allocation[c.id] || 0) > (allocation[m.id] || 0) ? c : m), categories[0]);
    const underused = categories
      .filter((c) => pm(c.id) > 1 && (allocation[c.id] || 0) < poolSize / 4)
      .sort((a, b) => pm(b.id) - pm(a.id))[0];
    let detail = null;
    if (neglected.length) {
      detail = `They single out ${neglected.map((c) => c.name).join(" and ")}, left uncovered.`;
    } else if ((allocation[heaviest.id] || 0) > 0 && pm(heaviest.id) < 1) {
      detail = `Intelligence suggests the enemy is strongest exactly where you are heaviest: ${heaviest.name}.`;
    } else if (underused) {
      detail = `They think ${underused.name} deserves more than it's getting.`;
    }
    if (!accurate) {
      // A wrong read points somewhere plausible but unfounded.
      const decoy = categories[Math.floor(Math.random() * categories.length)];
      detail = `They think ${decoy.name} deserves more than it's getting.`;
    }
    if (remaining > 0) {
      detail = (detail ? detail + " " : "") + `${remaining} ${remaining === 1 ? "point of effort is" : "points of effort are"} being held back as a reserve.`;
    }
    // The war game: two setups drawn at random from those the enemy might show.
    let runs = [];
    const scenarios = battleScenarios(config, KEY_BATTLE_POSTURES[config.id] || []);
    if (scenarios.length) {
      const first = Math.floor(Math.random() * scenarios.length);
      let second = scenarios.length > 1 ? Math.floor(Math.random() * (scenarios.length - 1)) : first;
      if (second >= first && scenarios.length > 1) second += 1;
      const picks = first === second ? [scenarios[first]] : [scenarios[first], scenarios[second]];
      runs = picks.map((sc) => {
        const weights = Object.fromEntries(
          categories.map((c) => [
            c.id,
            battleArmWeight({ config, catId: c.id, jitter: jitter[c.id], commander: selectedCommander, approach: selectedApproach, posture: sc.posture, posture2: sc.posture2, strandMult: strandMults[c.id] }),
          ])
        );
        const gamed = clampBattleBonus(sumBattleContributions(computeBattleContributions(categories, allocation, weights, poolSize)));
        const label = sc.posture ? (sc.posture2 ? sc.posture.name + ", then " + sc.posture2.name : sc.posture.name) : "the enemy as briefed";
        const verdict = gamed >= 20 ? "held firm" : gamed >= 10 ? "held, but with strain" : gamed >= 0 ? "barely moved the line" : "broke down";
        return { label, verdict };
      });
    }
    setAssessment({ text, detail, key: planKey, accurate, shownBand, trueBand, reliability, runs });
  }

  // Round 22 (item 3): the plan as one plain sentence. Names the weighted arms, the commander and
  // approach if chosen, the reserve, and any arm left with nothing in it.
  const planSummary = (() => {
    if (spent === 0) return "No effort committed yet.";
    const placed = categories.filter((c) => allocation[c.id] > 0).sort((a, b) => allocation[b.id] - allocation[a.id]);
    const bare = categories.filter((c) => allocation[c.id] === 0);
    const parts = [`Weight on ${placed.map((c) => `${c.name} (${allocation[c.id]})`).join(", ")}.`];
    if (selectedCommander) parts.push(`${selectedCommander.name} in command.`);
    if (selectedApproach) parts.push(`Approach: ${selectedApproach.name}.`);
    if (remaining > 0) parts.push(`${remaining} ${remaining === 1 ? "point" : "points"} of effort held in reserve.`);
    if (bare.length) parts.push(`Nothing placed in ${bare.map((c) => c.name).join(", ")}.`);
    return parts.join(" ");
  })();

  // Everything a saved game needs to put this screen back exactly as it stands: the plan so far, the
  // hidden setup the enemy was dealt, the intelligence already bought and the readings already given.
  const draft = { commanderId, approachId, postureId: posture?.id ?? null, posture2Id: posture2?.id ?? null, intel, reconUsed, bonusMeters, allocation, jitter, strandInfo, assessment };
  const draftKey = JSON.stringify(draft);
  useEffect(() => {
    if (onDraft) onDraft(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);
  const [saveNote, setSaveNote] = useState("");
  async function saveAndLeave() {
    setSaveNote("");
    const ok = await onSaveLeave();
    if (ok === false) setSaveNote("The save did not go through, so you have not left the field. Your orders are unchanged.");
  }

  const labelStyle = { fontFamily: "'IBM Plex Mono', monospace" };
  const bodyStyle = { fontFamily: "'Courier Prime', monospace" };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-start justify-center px-4 py-10">
      <div
        className={`${paper} w-full max-w-[600px] p-6 sm:p-8`}
        style={{ ...campaignPaperStyle(campaign.id, campaign.accent), fontFamily: "'Courier Prime', monospace" }}
      >
        <div className="text-xs uppercase tracking-[0.25em] mb-1 text-[#000000] font-semibold" style={labelStyle}>
          Order of Battle: Before Committing
        </div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl sm:text-3xl mb-3 text-[#000000] focus:outline-none"
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
        >
          {config.title}
        </h2>
        <p className="text-sm mb-4 text-[#000000]">{config.flavor}</p>

        {campaign.dynamic && mode !== "iron" && <MeterPanel meters={meters} flags={flags} prev={null} />}

        {/* Round 24: the two things a player may want before anything else sit together at the top: the short guide,
            and the way to skip the planning altogether. */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setGuideOpen((v) => !v)}
            aria-expanded={guideOpen}
            aria-controls="oob-guide"
            className="text-left border-2 px-3 py-2 text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
            style={{ borderColor: campaign.accent }}
          >
            <span className="block text-xs uppercase tracking-widest font-bold" style={labelStyle}>
              How it works
            </span>
            <span className="block text-[11px] opacity-80">{guideOpen ? "Hide the guide" : "A short guide"}</span>
          </button>
          <button
            onClick={letStaffPlan}
            className="text-left border-2 px-3 py-2 text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
            style={{ borderColor: campaign.accent }}
          >
            <span className="block text-xs uppercase tracking-widest font-bold" style={labelStyle}>
              Let Your Staff Plan It
            </span>
            <span className="block text-[11px] opacity-80">Skip the planning</span>
          </button>
        </div>
        {guideOpen && (
          <div id="oob-guide" className="mb-4 border px-3 py-2" style={{ borderColor: campaign.accent }}>
            <ul className="list-disc pl-5 text-[13px] leading-snug text-[#000000]" style={bodyStyle}>
              <li>You have a pool of effort: five points, plus one for each of Manpower, Matériel and Initiative above +2. Each point gives an arm more weight.</li>
              <li>Weight on one arm helps, but a bare arm costs you: a battle punishes a gap.</li>
              <li>Name one field commander, who strengthens one arm, and pick one tactical approach, which strengthens one arm and weakens another.</li>
              <li>The enemy's setup is hidden. A line of intelligence hints at it and is wrong about one time in four. Reconnaissance and a staff review cost Initiative.</li>
              <li>Effort left unplaced is a reserve to commit at the decisive hour, once you have seen the enemy's hand. It counts for less than planned effort.</li>
              <li>You may be asked for a field decision during the battle.</li>
              <li>Letting the staff plan it costs nothing: they fight the battle for you, without field decisions.</li>
              <li>None of this decides the result. It moves the odds on the roll.</li>
            </ul>
          </div>
        )}

        {/* Round 22: the day's known ground and weather (config.conditions), set out in words once;
            the per-arm effect is the italic note on the category it touches. */}
        {config.conditions && (
          <p className="text-[13px] leading-snug mb-4 text-[#000000]" style={bodyStyle}>
            <span className="text-[11px] uppercase tracking-widest font-bold mr-1" style={labelStyle}>
              Ground and weather
            </span>
            {config.conditions}
          </p>
        )}
        {phaseNames && (
          <p className="text-[13px] leading-snug mb-4 text-[#000000]" style={bodyStyle}>
            <span className="text-[11px] uppercase tracking-widest font-bold mr-1" style={labelStyle}>
              Fought in two phases
            </span>
            {phaseNames[0]}, then {phaseNames[1]}. The enemy's setup can change between them, and the plan has to hold through both.
          </p>
        )}
        {/* Round 22 (twists): a defensive battle's counterattack counts for more, and a battle's own
            attrition rules (frostbite, exposure) are stated up front, so that no cost is a surprise. */}
        {config.counterScale > 1 && (
          <p className="text-[13px] leading-snug mb-4 text-[#000000]" style={bodyStyle}>
            <span className="text-[11px] uppercase tracking-widest font-bold mr-1" style={labelStyle}>
              A defensive battle
            </span>
            the enemy's blow is the main event here, and the counterattack counts for half as much again.
          </p>
        )}
        {config.attrition && config.attrition.length > 0 && (
          <p className="text-[13px] leading-snug mb-4 text-[#000000]" style={bodyStyle}>
            <span className="text-[11px] uppercase tracking-widest font-bold mr-1" style={labelStyle}>
              Known hazards
            </span>
            {config.attrition
              .map((a) => `${a.atLeast} or more points of effort in ${categories.find((c) => c.id === a.category)?.name || a.category} will cost ${a.meter} (${a.reason.toLowerCase()})`)
              .join("; ")}
            .
          </p>
        )}

        {hardRule && (
          <p className="text-[13px] leading-snug mb-4 text-[#000000] border-l-4 pl-3" style={{ ...bodyStyle, borderColor: "#7a2e2e" }}>
            <span className="text-[11px] uppercase tracking-widest font-bold mr-1" style={{ ...labelStyle, color: "#7a2e2e" }}>
              {HARD_MODE_NAMES[mode]}: orders from above:
            </span>
            {hardRule.text}
          </p>
        )}

        {postureHint && (
          <div className="mb-6 border-l-4 pl-3" style={{ borderColor: campaign.accent }}>
            <div className="text-[11px] uppercase tracking-widest font-bold text-[#000000] opacity-80" style={labelStyle}>
              Intelligence Summary{phaseNames ? `: ${phaseNames[0]}` : ""}
            </div>
            <p className="text-[13px] leading-snug italic text-[#000000]" style={bodyStyle}>
              {postureHint}
            </p>
            {/* Round 13, item #3: a paid second look, same shape as the staff assessment button
                further down: spend Initiative for a materially sharper (not perfect) read. Not
                offered in Easy Command (item #8): the free hint there is already accurate, so a
                Recon Pass would just be spending Initiative on nothing. */}
            {!reconUsed && !easyMode && (
              <button
                onClick={requestRecon}
                disabled={(meters.initiative || 0) <= 0}
                className="mt-2 text-[11px] uppercase tracking-widest underline disabled:opacity-40 disabled:cursor-not-allowed text-[#000000] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                style={labelStyle}
              >
                Call for a Reconnaissance Pass: costs 1 Initiative
              </button>
            )}
            {reconUsed && (
              <p className="mt-2 text-[11px] uppercase tracking-widest opacity-60 text-[#000000]" style={labelStyle}>
                Reconnaissance pass called in.
              </p>
            )}
          </div>
        )}

        {/* Round 8 (Craig, looking at the iOS picker sheet round 7's <select> produced): back
            to the button/card grid; commander roster capped at 3. */}
        {commanderRoster.length > 0 && (
          <div className="mb-6">
            <div role="heading" aria-level="3" className="text-xs uppercase tracking-[0.2em] mb-2 text-[#000000] font-semibold" style={labelStyle}>
              Field Command
            </div>
            <div role="group" aria-label="Field commander" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setCommanderId(null)}
                disabled={!!hardRule?.lockCommander}
                aria-pressed={commanderId === null}
                className="text-left border px-3 py-2 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                style={
                  commanderId === null
                    ? { borderColor: campaign.accent, backgroundColor: campaign.accent, color: "#ffffff" }
                    : { borderColor: campaign.accent, color: "#000000" }
                }
              >
                <div className="text-sm font-semibold">
                  {commanderId === null && <span aria-hidden="true">✓ </span>}No particular emphasis
                </div>
                <div className="text-[11px] opacity-80">Command as planned, no single lever favored.</div>
              </button>
              {commanderRoster.map((cmd) => {
                const cat = categories.find((c) => c.id === cmd.category);
                const selected = commanderId === cmd.id;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => setCommanderId(cmd.id)}
                    disabled={commanderBarred(cmd.id)}
                    aria-pressed={selected}
                    className="text-left border px-3 py-2 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                    style={
                      selected
                        ? { borderColor: campaign.accent, backgroundColor: campaign.accent, color: "#ffffff" }
                        : { borderColor: campaign.accent, color: "#000000" }
                    }
                  >
                    <div className="text-sm font-semibold">
                      {selected && <span aria-hidden="true">✓ </span>}
                      {cmd.name}
                    </div>
                    <div className="text-[11px] opacity-80">
                      {cmd.role}: favors {cat ? cat.name : cmd.category}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedCommander && (
              <p className="text-[13px] leading-snug italic mt-2 text-[#000000]" style={bodyStyle}>
                {selectedCommander.note}
              </p>
            )}
          </div>
        )}

        {approachRoster.length > 0 && (
          <div className="mb-6">
            <div role="heading" aria-level="3" className="text-xs uppercase tracking-[0.2em] mb-2 text-[#000000] font-semibold" style={labelStyle}>
              Tactical Approach: Choose One
            </div>
            <div role="group" aria-label="Tactical approach" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {approachRoster.map((appr) => {
                const selected = approachId === appr.id;
                return (
                  <button
                    key={appr.id}
                    onClick={() => setApproachId(appr.id)}
                    disabled={!!hardRule?.lockApproach && hardRule.lockApproach !== appr.id}
                    aria-pressed={selected}
                    className="text-left border px-3 py-2 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                    style={
                      selected
                        ? { borderColor: campaign.accent, backgroundColor: campaign.accent, color: "#ffffff" }
                        : { borderColor: campaign.accent, color: "#000000" }
                    }
                  >
                    <div className="text-sm font-semibold">
                      {selected && <span aria-hidden="true">✓ </span>}
                      {appr.name}
                    </div>
                    <div className="text-[11px] opacity-80">{appr.subtitle}</div>
                  </button>
                );
              })}
            </div>
            {selectedApproach ? (
              <p className="text-[13px] leading-snug italic mt-2 text-[#000000]" style={bodyStyle}>
                {selectedApproach.note}
              </p>
            ) : (
              <p className="text-[13px] leading-snug mt-2 text-[#000000] opacity-70" style={bodyStyle}>
                Pick one: the offensive can't run on both doctrines at once.
              </p>
            )}
          </div>
        )}

        <div role="heading" aria-level="3" aria-live="polite" className="text-xs uppercase tracking-[0.2em] mb-1 text-[#000000] font-semibold" style={labelStyle}>
          Effort in reserve: {remaining} of {poolSize}
          {bonusMeters.length > 0 && (
            <span className="normal-case font-normal"> · {bonusMeters.length} extra from the standing of your logistics</span>
          )}
        </div>
        <p className="text-[12px] leading-snug mb-3 text-[#000000] opacity-80" style={bodyStyle}>
          Effort you leave unplaced goes in as a reserve you can commit once you see how the fighting goes. It arrives late and counts for less than planned effort.
        </p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={spreadEvenly}
            aria-label="Spread effort evenly"
            className="flex-1 border px-3 py-2 text-[11px] uppercase tracking-widest font-semibold text-[#000000] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
            style={{ borderColor: campaign.accent, ...labelStyle }}
          >
            Spread effort evenly
          </button>
          <button
            onClick={clearAll}
            disabled={spent === 0}
            aria-label="Clear all effort"
            className="flex-1 border px-3 py-2 text-[11px] uppercase tracking-widest font-semibold text-[#000000] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
            style={{ borderColor: campaign.accent, ...labelStyle }}
          >
            Clear all effort
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {categories.map((cat) => (
            <div key={cat.id} className="border px-4 py-3" style={{ borderColor: campaign.accent }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#000000]">
                  {cat.name}
                  {/* Round 13, item #6: a visible (not hidden, unlike posture) ground-conditions
                      note: the flavor paragraph already told the player about the mud; this ties
                      that text to the specific category it actually affects. */}
                  {config.terrainNotes?.[cat.id] && (
                    <span className="ml-1 text-[11px] font-normal italic opacity-60">({config.terrainNotes[cat.id]})</span>
                  )}
                  {strandInfo[cat.id] && strandInfo[cat.id].band !== "Adequate" && (
                    <span className="ml-1 text-[11px] font-normal italic opacity-60">
                      ({strandInfo[cat.id].name}: {strandInfo[cat.id].band})
                    </span>
                  )}
                </span>
                {/* Round 8 (Craig: "'in good order' and 'reports uncertain' aren't clear in what
                    they are doing"): the bare phrase read as ambiguous: readiness of what,
                    exactly? A "Readiness:" label anchors it to the category it sits next to,
                    without spelling out the hidden jitter roll it's actually a coarse signal
                    for (see readiness() above: that's staying a band, not a number, on
                    purpose). */}
                <span className="text-xs text-[#000000] opacity-70 italic">Readiness: {readiness(cat.id)}</span>
              </div>
              {/* Round 4 (Craig, testing on mobile: "tap add and minus with the plus signing
                  moving along the screen from left to right"): tapping a filled square to
                  remove it worked on desktop but gave no visible affordance on a touch screen,
                  and the "+" button's position shifted every time the row filled or wrapped.
                  Fixed layout now: a minus button pinned left, a fill track (empty-to-filled,
                  left to right) scaled to the actual pool size so the same track reads
                  identically across all four categories, and a plus button pinned right
                  neither button moves regardless of how much effort is placed. */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeEffort(cat.id)}
                  disabled={allocation[cat.id] <= 0}
                  aria-label={`Remove effort from ${cat.name}`}
                  className="w-11 h-11 flex-none flex items-center justify-center border-2 text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                  style={{ borderColor: campaign.accent, color: campaign.accent }}
                  title={allocation[cat.id] <= 0 ? "Nothing placed here to take back" : undefined}
                >
                  −
                </button>
                <div className="flex-1 flex items-center gap-1 min-w-0" aria-hidden="true">
                  {Array.from({ length: poolSize }).map((_, k) => (
                    <span
                      key={k}
                      className="flex-1 h-5 border-2 min-w-[10px]"
                      style={
                        k < allocation[cat.id]
                          ? { borderColor: campaign.accent, backgroundColor: campaign.accent }
                          : { borderColor: campaign.accent, opacity: 0.35 }
                      }
                    />
                  ))}
                </div>
                <span
                  role="status"
                  aria-label={`${cat.name}: ${allocation[cat.id]} of effort placed`}
                  className="w-6 text-center text-sm font-bold flex-none"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {allocation[cat.id]}
                </span>
                <button
                  onClick={() => addEffort(cat.id)}
                  disabled={remaining <= 0}
                  aria-label={`Add effort to ${cat.name}`}
                  className="w-11 h-11 flex-none flex items-center justify-center border-2 text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                  style={{ borderColor: campaign.accent, color: campaign.accent }}
                  title={remaining <= 0 ? "No effort left to place: take some back from another arm first" : undefined}
                >
                  +
                </button>
              </div>
              {/* Round 24: the staff's situation report and the order of battle are one disclosure now. What actually
                  happened is for after the battle, not for the planning. */}
              {(config.categoryContext?.[cat.id] || config.orderOfBattle?.[cat.id]) && (
                <details className="mt-2">
                  <summary className="text-[11px] uppercase tracking-widest font-bold text-[#000000] opacity-70 cursor-pointer select-none" style={labelStyle}>
                    Situation and order of battle
                  </summary>
                  {config.categoryContext?.[cat.id] && (
                    <p className="text-[13px] leading-snug text-[#000000] mt-1 italic" style={bodyStyle}>
                      {config.categoryContext[cat.id]}
                    </p>
                  )}
                  {config.orderOfBattle?.[cat.id] && (
                    <ul className="mt-1 list-disc pl-5 text-[13px] leading-snug text-[#000000]" style={bodyStyle}>
                      {config.orderOfBattle[cat.id].units.map((u, k) => (
                        <li key={k}>{u}</li>
                      ))}
                    </ul>
                  )}
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4 border px-4 py-3" style={{ borderColor: campaign.accent }}>
          <button
            onClick={requestStaffReview}
            aria-describedby="staff-work-why"
            disabled={spent === 0}
            className="w-full border-2 px-4 py-2 text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#000000] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
            style={{ borderColor: campaign.accent, ...bodyStyle }}
          >
            Ask the staff to review the plan: costs 1 Initiative
          </button>
          {assessment && (
            <div className="mt-3">
              <p className="text-[13px] leading-snug italic text-[#000000]" style={bodyStyle}>
                {assessment.text}
              </p>
              {assessment.detail && (
                <p className="text-[13px] leading-snug text-[#000000] mt-1" style={bodyStyle}>
                  {assessment.detail}
                </p>
              )}
              {(assessment.runs || []).map((r, i) => (
                <p key={i} className="text-[13px] leading-snug text-[#000000] mt-1" style={bodyStyle}>
                  Against <i>{r.label}</i>, the plan {r.verdict}.
                </p>
              ))}
              {(assessment.runs || []).length > 0 && (
                <p className="text-[12px] leading-snug italic opacity-70 text-[#000000] mt-1" style={bodyStyle}>
                  The staff also war-gamed the plan against setups the enemy might show. They cannot say which one he has.
                </p>
              )}
              {assessment.key !== planKey && (
                <p className="text-[11px] uppercase tracking-widest text-[#000000] opacity-70 mt-1" style={labelStyle}>
                  Reviewed before your latest changes
                </p>
              )}
            </div>
          )}
          {spent === 0 && (
            <p id="staff-work-why" className="text-[12px] leading-snug mt-2 text-[#000000]" style={bodyStyle}>
              Place some effort first: the staff need a plan to look at.
            </p>
          )}
          <p className="text-[11px] uppercase tracking-widest text-[#000000] opacity-70 mt-2" style={labelStyle}>
            Initiative now: {meters.initiative > 0 ? "+" : ""}
            {meters.initiative} · Staff reliability: {reliability}%
          </p>
        </div>

        {/* Round 22 (item 3, a plan summary): the plan in one plain sentence, so the player can read back
            what they are about to commit to without decoding the bars. */}
        <div className="mb-4 border-l-4 pl-3" style={{ borderColor: campaign.accent }}>
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#000000] opacity-80" style={labelStyle}>
            Your plan so far
          </div>
          <p className="text-[13px] leading-snug text-[#000000]" style={bodyStyle}>
            {planSummary}
          </p>
        </div>

        <button
          onClick={() => {
            if (soundOn) playStamp();
            onCommit({
              allocation,
              reserves: remaining,
              poolSize,
              weights: weightsMap(),
              commanderId: selectedCommander?.id ?? null,
              approachId: selectedApproach?.id ?? null,
              postureId: posture?.id ?? null,
              posture2Id: posture2?.id ?? null,
              // Round 10: carried forward so the battle report can say, afterwards, whether the
              // intelligence and the last staff assessment were right.
              intel: intel ? { hintPostureId: intel.hintPostureId, correct: intel.correct } : null,
              assessment: assessment
                ? {
                    accurate: assessment.accurate,
                    shownBand: assessment.shownBand,
                    trueBand: assessment.trueBand,
                    reliability: assessment.reliability,
                    stale: assessment.key !== planKey,
                  }
                : null,
            });
          }}
          disabled={(approachRoster.length > 0 && !selectedApproach) || spent === 0}
          className="w-full border-2 px-4 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#000000]"
          style={{ borderColor: campaign.accent, ...bodyStyle }}
        >
          {approachRoster.length > 0 && !selectedApproach
            ? "Choose a Tactical Approach First"
            : spent === 0
            ? "Commit Some Effort First"
            : remaining > 0
            ? `Commit to Battle: ${remaining} held in reserve`
            : "Commit to Battle"}
        </button>
        {onSaveLeave && (
          <>
            <button onClick={saveAndLeave} className="w-full mt-3 text-center text-xs uppercase tracking-widest opacity-70 underline text-[#000000] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px" style={labelStyle}>
              Save and leave the field: pick this battle up later
            </button>
            <p role="status" className="text-[12px] leading-snug mt-1 text-[#7a2e2e]" style={bodyStyle}>
              {saveNote}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// The battle report. Design history in brief: round 6 replaced a static result screen with an animated reveal; round 7
// made it one tug-of-war bar with each beat a REAL per-category contribution; round 8 kept every report line on
// screen as a log; round 9 added the contact beat, the decisive hour and motion; round 10 the dispatch times, the
// enemy counterattack and the after-action notes. Round 24 made it run on its own: a Start button at the top, the
// newest dispatch above the older ones, a pause, and a stop for every decision. Positions before the verdict replay
// chooseOption's own nudge math against the base weights; the verdict itself is forced to the resolved weights, so
// the bar can never disagree with OutcomeScreen. uncertain[0] is the favorable break, uncertain[1] the unfavorable one.
// How long the report waits between one dispatch and the next, in milliseconds, when it is running on its own.
const BATTLE_BEAT_MS = 2600;
// Effort committed at the decisive hour arrives late. Mirrors KEY_BATTLE_RESERVE_MULT.
const COUNTER_WORDS = { repulsed: "thrown back", heldAtCost: "held, at a cost", broke: "a break-through", gaveGround: "ground given up" };

function BattleSimulationScreen({ campaign, config, mode, plan, baseWeights, uncertain, result, soundOn, instantText, reducedMotion, onResolve, onContinue, onSaveLeave, resumed }) {
  const headingRef = useRef(null);
  const categories = keyBattleCategories(config);
  const postures = KEY_BATTLE_POSTURES[config.id] || [];
  const posture = postures.find((p) => p.id === plan.postureId) || null;
  // Round 22: a battle fought in phases has a second posture, revealed after the category beats.
  const posture2 = postures.find((p) => p.id === plan.posture2Id) || null;
  const phaseNames = config.phases || null;
  const latestPosture = posture2 || posture;
  const commander = (KEY_BATTLE_COMMANDERS[config.id] || []).find((c) => c.id === plan.commanderId) || null;
  const approach = (KEY_BATTLE_APPROACHES[config.id] || []).find((a) => a.id === plan.approachId) || null;
  const hasReserve = (plan.reserves || 0) > 0;
  const times = config.reportTimes || null;
  const ca = config.counterattack || null;
  const severityBase = ca ? ca.severity?.[latestPosture?.id] || 1 : 1;
  // Round 22: field decisions (config.decisions) — see battleDecisionEffect. Made in order, after the
  // category beats and before the decisive hour.
  const decisions = config.decisions || [];
  const [decisionChoices, setDecisionChoices] = useState({}); // { decisionId: optionId }
  const decisionEffects = decisions
    .filter((d) => decisionChoices[d.id])
    .map((d) => ({ d, option: d.options.find((o) => o.id === decisionChoices[d.id]), eff: battleDecisionEffect(d.options.find((o) => o.id === decisionChoices[d.id]), latestPosture?.id) }));
  const decisionBonus = decisionEffects.reduce((a, x) => a + x.eff.bonus, 0);
  const severity = Math.max(1, Math.min(3, severityBase + decisionEffects.reduce((a, x) => a + x.eff.severity, 0)));
  const decidedCount = decisionEffects.length;
  const nextDecision = decisions.find((d) => !decisionChoices[d.id]) || null;
  const counterScale = config.counterScale || 1;
  // Round 23: under a hard mode's orders from above, the line may not give ground (Order No. 227).
  const noGiveGround = !!(HARD_MODE_NAMES[mode] && config.hardRule && config.hardRule.noGiveGround);

  const planContrib = computeBattleContributions(categories, plan.allocation, plan.weights, plan.poolSize);
  const orderedCatIds = [...categories]
    .sort((a, b) => Math.abs(planContrib[a.id] || 0) - Math.abs(planContrib[b.id] || 0))
    .map((c) => c.id);

  // Must mirror chooseOption's nudge exactly.
  function pctFor(total) {
    const b = Math.max(-KEY_BATTLE_BONUS_CLAMP, Math.min(KEY_BATTLE_BONUS_CLAMP, total));
    const w0 = Math.max(2, Math.min(98, baseWeights[0] + b));
    const w1 = Math.max(2, Math.min(98, baseWeights[1] - b));
    return Math.round((w0 / (w0 + w1)) * 100);
  }

  const [reserveChoice, setReserveChoice] = useState(null); // null | "hold" | catId
  const [counterChoice, setCounterChoice] = useState(null); // null | "head" | "give" | "reserve"
  const reserveAlloc = reserveChoice && reserveChoice !== "hold" ? { [reserveChoice]: plan.reserves } : {};
  const finalContrib = computeBattleContributions(categories, plan.allocation, plan.weights, plan.poolSize, reserveAlloc);
  const reserveTotal = sumBattleContributions(finalContrib);
  const counterStrengthBase = ca ? (plan.allocation[ca.category] || 0) + (reserveAlloc[ca.category] || 0) : 0;
  const canThrowReserve = reserveChoice === "hold" && hasReserve;

  // counterScale (default 1) is a defensive battle's way of saying the enemy's blow is the main
  // event: every swing of the counterattack counts that many times.
  function counterOutcome(choice) {
    if (!ca || !choice) return null;
    if (choice === "give") return { result: "gaveGround", swing: -2 * severity * counterScale };
    const strength = counterStrengthBase + (choice === "reserve" ? plan.reserves : 0);
    if (strength >= 2 + severity) return { result: "repulsed", swing: 4 * counterScale };
    if (strength >= 1) return { result: "heldAtCost", swing: -3 * severity * counterScale };
    return { result: "broke", swing: -5 * severity * counterScale };
  }
  const counter = counterOutcome(counterChoice);
  const finalTotal = reserveTotal + decisionBonus + (counter ? counter.swing : 0);

  const beats = [{ kind: "open", position: 50 }];
  if (posture) beats.push({ kind: "contact", position: 50 });
  let cum = 0;
  orderedCatIds.forEach((id, i) => {
    cum += planContrib[id] || 0;
    beats.push({ kind: "cat", catId: id, catOrder: i, position: pctFor(cum) });
  });
  if (posture2) beats.push({ kind: "contact2", position: pctFor(cum) });
  const lastCatIndex = beats.length - 1;
  let decCum = cum;
  decisionEffects.forEach((x) => {
    decCum += x.eff.bonus;
    beats.push({ kind: "decision", decId: x.d.id, position: pctFor(decCum) });
  });
  if (reserveChoice) beats.push({ kind: "reserve", position: pctFor(reserveTotal + decisionBonus) });
  if (counterChoice) beats.push({ kind: "counter", position: pctFor(finalTotal) });
  const lastBeat = beats.length - 1;

  const [flashupLines] = useState(() => {
    const pool = config?.flashups || {};
    const lines = {};
    for (const c of categories) {
      const options = pool[c.id] || [];
      lines[c.id] = options.length ? options[Math.floor(Math.random() * options.length)] : null;
    }
    return lines;
  });
  // Round 12 (Craig's item #5, "richer dispatch text"): idleLines used to be a single fixed
  // string per category — every replay that left an arm uncommitted saw the exact same sentence.
  // Now a small pool per category, same pattern as flashupLines above, picked once per screen
  // instance so it doesn't flicker on re-render. Still accepts a bare string for any battle
  // config that hasn't been converted to a pool, so nothing breaks if one is added later without
  // the array wrapper.
  const [idleLine] = useState(() => {
    const pool = config?.idleLines || {};
    const lines = {};
    for (const c of categories) {
      const options = pool[c.id];
      if (Array.isArray(options)) lines[c.id] = options.length ? options[Math.floor(Math.random() * options.length)] : null;
      else lines[c.id] = options || null;
    }
    return lines;
  });

  function timeFor(beat) {
    if (beat.kind === "decision") return decisions.find((d) => d.id === beat.decId)?.time || null;
    if (!times) return null;
    if (beat.kind === "cat") return times.cats?.[beat.catOrder] || null;
    return times[beat.kind] || null;
  }
  function bodyFor(beat) {
    if (beat.kind === "open") return approach?.reportLine || "The attack goes in.";
    if (beat.kind === "contact") return posture.reveal;
    if (beat.kind === "contact2") return posture2.reveal;
    if (beat.kind === "decision") {
      const x = decisionEffects.find((e) => e.d.id === beat.decId);
      return x?.option?.reportLine || x?.option?.name || "";
    }
    if (beat.kind === "reserve") {
      if (reserveChoice === "hold") return "The reserve stays back.";
      const cat = categories.find((c) => c.id === reserveChoice);
      const plugged = (plan.allocation[reserveChoice] || 0) === 0;
      return `The reserve goes in behind ${cat?.name || reserveChoice}${plugged ? ", into the gap left there" : ""}.`;
    }
    if (beat.kind === "counter") {
      const lead = counterChoice === "reserve" ? "The held reserve goes in against the counterattack. " : "";
      return lead + (ca.results[counter.result] || "");
    }
    const cat = categories.find((c) => c.id === beat.catId);
    if ((plan.allocation[beat.catId] || 0) === 0) {
      return idleLine[beat.catId] || `${cat?.name || beat.catId}: nothing committed.`;
    }
    if (commander && commander.category === beat.catId && commander.reportLine) return commander.reportLine;
    return flashupLines[beat.catId] || `${cat?.name || beat.catId} holds its ground.`;
  }
  function labelFor(beat) {
    if (beat.kind === "contact" && phaseNames) return phaseNames[0];
    if (beat.kind === "contact2") return phaseNames ? phaseNames[1] : null;
    if (beat.kind === "decision") return decisions.find((d) => d.id === beat.decId)?.title || null;
    if (beat.kind !== "cat") return null;
    return categories.find((c) => c.id === beat.catId)?.name || null;
  }

  const [beatIndex, setBeatIndex] = useState(0);
  const [phase, setPhase] = useState("running"); // "running" | "decision" | "reserve" | "counter" | "resolving"
  // Round 24: the report runs on its own once started, newest dispatch at the top, and stops for a decision.
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const done = !!result;
  // With instant text or reduced motion on, and for a battle the staff fight, the report does not wait between dispatches.
  const instant = !!instantText || !!reducedMotion || !!plan.autoplay;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (headingRef.current) headingRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (result && soundOn) playVerdict(result.ri === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const reserveDecided = !hasReserve || !!reserveChoice;
  const counterDecided = !ca || !!counterChoice;

  function afterNotes() {
    const notes = [];
    if (plan.autoplay) notes.push("Your staff planned and fought this battle without you.");
    // Round 22 (item 7): what the player's orders were worth, as military intelligence would put it —
    // an estimate to the nearest five points, and of the change the plan made, never of the odds.
    const basePct = Math.round((baseWeights[0] / (baseWeights[0] + baseWeights[1])) * 100);
    const gain = pctFor(finalTotal) - basePct;
    const gainRounded = Math.round(Math.abs(gain) / 5) * 5;
    notes.push(
      gainRounded === 0
        ? "Military intelligence believes your orders made little difference to our chance of victory."
        : gain > 0
        ? `Military intelligence believes your orders improved our chance of victory by about ${gainRounded} points.`
        : `Military intelligence believes your orders cost us about ${gainRounded} points of our chance of victory.`
    );
    if (plan.intel && posture) {
      const hinted = postures.find((p) => p.id === plan.intel.hintPostureId);
      notes.push(
        plan.intel.correct
          ? "The intelligence summary was right."
          : `The intelligence summary was wrong. It pointed to ${hinted ? hinted.name.toLowerCase() : "something else"}; the enemy's real setup was ${posture.name.toLowerCase()}.`
      );
    }
    if (plan.assessment) {
      const a = plan.assessment;
      const shown = STAFF_VERDICT_BANDS[a.shownBand];
      const truth = STAFF_VERDICT_BANDS[a.trueBand];
      let line = a.accurate
        ? `The staff review held up: they called the plan ${shown}, and it was.`
        : `The staff review was wrong. They called the plan ${shown}; it was ${truth}.`;
      line += ` (Staff reliability at the time: ${a.reliability}%.)`;
      if (a.stale) line += " It was given on an earlier version of the plan.";
      notes.push(line);
    }
    return notes;
  }

  function resolve() {
    if (phase === "resolving" || done) return;
    setPhase("resolving");
    const finalAllocation = Object.fromEntries(
      categories.map((c) => [c.id, (plan.allocation[c.id] || 0) + (reserveAlloc[c.id] || 0)])
    );
    // Round 13 fix: was categories.find() — the FIRST neglected category, in category-declaration
    // order, regardless of how badly it was neglected. That's arbitrary text-picking (fine when
    // only echo texture read it) but wrong once a grade needs to know severity. Now picks the
    // WORST shortfall (most negative contribution), and neglectedAll is kept for the count.
    const neglectedAll = categories.filter((c) => (finalContrib[c.id] || 0) < 0);
    const neglected = neglectedAll.length
      ? neglectedAll.reduce((worst, c) => ((finalContrib[c.id] || 0) < (finalContrib[worst.id] || 0) ? c : worst))
      : null;
    const flagsOut = {};
    if (counter) flagsOut[`${config.id}Counter`] = counter.result;
    if (neglected) flagsOut[`${config.id}PlanNeglected`] = neglected.id;
    if (neglectedAll.length) flagsOut[`${config.id}NeglectedCount`] = neglectedAll.length;
    if (plan.commanderId) flagsOut[`${config.id}PlanCommander`] = plan.commanderId;
    if (plan.autoplay) flagsOut[`${config.id}Staff`] = true;
    // Round 22: which way each field decision went, kept as a flag for later text.
    for (const x of decisionEffects) {
      flagsOut[`${config.id}Dec_${x.d.id}`] = x.option.id;
      flagsOut[`${config.id}DecNote_${x.d.id}`] = `${x.d.title}: ${x.option.name}`;
    }
    // The enemy setup(s) met, for the War Record's Battle Record.
    if (plan.postureId) flagsOut[`${config.id}Posture`] = plan.postureId;
    if (plan.posture2Id) flagsOut[`${config.id}Posture2`] = plan.posture2Id;
    onResolve({
      bonus: clampBattleBonus(finalTotal),
      extraLines: decisionEffects.flatMap((x) => x.eff.lines),
      finalAllocation,
      contributions: finalContrib,
      reservesHeld: reserveChoice === "hold" && counterChoice !== "reserve" ? plan.reserves : 0,
      poolSize: plan.poolSize,
      counter: counter ? { category: ca.category, result: counter.result } : null,
      flagsOut,
      notes: afterNotes(),
    });
  }
  function advance() {
    if (beatIndex < lastCatIndex) {
      setBeatIndex((b) => b + 1);
      if (soundOn) playRadio();
    } else if (nextDecision) {
      setBeatIndex(lastCatIndex + decidedCount);
      setPhase("decision");
    } else if (!reserveDecided) {
      setBeatIndex(lastCatIndex + decidedCount);
      setPhase("reserve");
    } else if (!counterDecided) {
      setBeatIndex(lastBeat);
      setPhase("counter");
    } else {
      setBeatIndex(lastBeat);
      resolve();
    }
  }
  function chooseDecision(d, optionId) {
    setDecisionChoices((c) => ({ ...c, [d.id]: optionId }));
    setBeatIndex(lastCatIndex + decidedCount + 1);
    setPhase("running");
    if (soundOn) playDice();
  }
  function chooseReserve(choice) {
    setReserveChoice(choice);
    setBeatIndex(lastCatIndex + decidedCount + 1);
    setPhase("running");
    if (soundOn) playDice();
  }
  function chooseCounter(choice) {
    setCounterChoice(choice);
    setBeatIndex(lastCatIndex + decidedCount + (reserveChoice ? 2 : 1));
    setPhase("running");
    if (soundOn) playDice();
  }
  function skip() {
    setStarted(true);
    if (nextDecision) {
      setBeatIndex(lastCatIndex + decidedCount);
      setPhase("decision");
    } else if (!reserveDecided) {
      setBeatIndex(lastCatIndex + decidedCount);
      setPhase("reserve");
    } else if (!counterDecided) {
      setBeatIndex(lastBeat);
      setPhase("counter");
    } else {
      setBeatIndex(lastBeat);
      resolve();
    }
  }
  function startBattle() {
    setStarted(true);
    if (soundOn) playRumble();
  }
  // The report moves itself along: one dispatch after another with a gap between, until a decision stops it.
  useEffect(() => {
    if (!started || paused || done || phase !== "running") return undefined;
    const t = setTimeout(advance, instant ? 0 : BATTLE_BEAT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, paused, done, phase, beatIndex, decisionChoices, reserveChoice, counterChoice]);

  // Round 23 (item 7): a battle the staff plan runs itself. One step per pass, so each choice is made
  // from the state the one before it left: the field decisions, the counterattack, then the verdict.
  const autoResolved = useRef(false);
  useEffect(() => {
    if (!plan.autoplay || done || autoResolved.current) return;
    if (nextDecision) {
      setDecisionChoices((c) => ({ ...c, [nextDecision.id]: staffDecisionOption(nextDecision, postures, config).id }));
      return;
    }
    if (!counterDecided) {
      setCounterChoice(noGiveGround || counterStrengthBase >= 2 + severity ? "head" : "give");
      return;
    }
    autoResolved.current = true;
    setBeatIndex(lastBeat);
    resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.autoplay, decisionChoices, counterChoice, done]);
  const [staffStillOn, setStaffStillOn] = useState(() => {
    try {
      return window.localStorage.getItem("dispatches1940_staff_plans") === "1";
    } catch {
      return false;
    }
  });

  const total = result ? result.weights.reduce((a, v) => a + v, 0) : 1;
  const finalPct = result ? result.weights.map((w) => Math.round((w / total) * 100)) : null;
  const won = result ? result.ri === 0 : false;
  const shownIndex = Math.min(beatIndex, lastBeat);
  // Round 10: at the verdict the bar settles on what HAPPENED, not on the odds it was fought at.
  // With odds hidden, a loss shown with the bar two-thirds toward your side read as a
  // contradiction (caught in round-10 screenshots). A win pushes the boundary at least to 85, a
  // loss back to at most 15, so the last movement is the decision itself.
  const position = done ? (won ? Math.max(finalPct[0], 85) : Math.min(finalPct[0], 15)) : started || plan.autoplay ? beats[shownIndex].position : 50;
  const visibleBeats = started || done || plan.autoplay ? beats.slice(0, shownIndex + 1) : [];
  const verdicts = config.verdicts || ["The Attack Succeeds", "The Attack Fails"];

  // Motion (round 9, item #9 — movement only).
  const prevPosRef = useRef(50);
  const delta = position - prevPosRef.current;
  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    const d = position - prevPosRef.current;
    prevPosRef.current = position;
    if (d <= -6) {
      setShaking(true);
      if (soundOn) playRumble();
      const t = setTimeout(() => setShaking(false), 450);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [position]);
  const moveMs = 400 + Math.min(Math.abs(delta), 25) * 32;
  const moveEase = delta > 0 ? "cubic-bezier(0.34, 1.35, 0.64, 1)" : "cubic-bezier(0.55, 0, 0.35, 1)";
  const barTransition = `width ${moveMs}ms ${moveEase}`;

  const meterNames = { manpower: "Manpower", fuel: "Matériel", initiative: "Initiative" };
  const labelStyle = { fontFamily: "'IBM Plex Mono', monospace" };
  const bodyStyle = { fontFamily: "'Courier Prime', monospace" };
  const caCat = ca ? categories.find((c) => c.id === ca.category) : null;
  const choiceBtn = "text-left border px-3 py-2 hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150" + " focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px";
  const [saveNote, setSaveNote] = useState("");
  async function saveAndLeave() {
    setSaveNote("");
    const ok = await onSaveLeave();
    if (ok === false) setSaveNote("The save did not go through, so you have not left the field. Your orders are unchanged.");
  }
  // When a decision, the decisive hour or the counterattack comes up, focus goes to it, so a keyboard or a
  // screen reader lands on the question and not on a button that has just gone. After the verdict it goes to the
  // heading, which now reads the verdict.
  const panelRef = useRef(null);
  const sawPanel = useRef(false);
  useEffect(() => {
    if (done) {
      if (headingRef.current) headingRef.current.focus();
    } else if (phase === "decision" || phase === "reserve" || phase === "counter") {
      sawPanel.current = true;
      if (panelRef.current) panelRef.current.focus();
    } else if (sawPanel.current && headingRef.current) {
      headingRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, done]);
  // The roll has not been made until the verdict, so a battle can be put down at any point before it.
  const canSaveHere = !!onSaveLeave && !done && phase !== "resolving" && !plan.autoplay;

  // --- words for the decisive hour and the counterattack: where things stand, and what each choice does ---
  const standing = position >= 65 ? "strongly in your favour" : position >= 55 ? "leaning your way" : position > 45 ? "evenly balanced" : position > 35 ? "leaning against you" : "strongly against you";
  const carrying = categories.filter((c) => (plan.allocation[c.id] || 0) > 0 && (planContrib[c.id] || 0) > 0).map((c) => c.name);
  const short = categories.filter((c) => (plan.allocation[c.id] || 0) > 0 && (planContrib[c.id] || 0) <= 0).map((c) => c.name);
  const bare = categories.filter((c) => (plan.allocation[c.id] || 0) === 0).map((c) => c.name);
  const listWords = (xs) => (xs.length <= 1 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1]);
  const reserveStatus = (c) => {
    const n = plan.allocation[c.id] || 0;
    return n === 0 ? "nothing there yet, so this would close a gap" : (planContrib[c.id] || 0) > 0 ? `already carrying the attack, with ${n} ${n === 1 ? "point" : "points"}` : `${n} ${n === 1 ? "point" : "points"} there, and still short`;
  };
  const counterNow = counterOutcome("head");
  const counterWithReserve = canThrowReserve ? counterOutcome("reserve") : null;
  const needed = 2 + severity;

  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-start justify-center px-4 py-10">
      <div className={`${paper} w-full max-w-[600px] p-6 sm:p-8`} style={{ ...campaignPaperStyle(campaign.id, campaign.accent), fontFamily: "'Courier Prime', monospace" }}>
        <div className="text-xs uppercase tracking-[0.25em] mb-1 opacity-70" style={labelStyle}>
          Battle Report
        </div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className={`text-2xl sm:text-3xl focus:outline-none ${done && config.verdictGrades && result.planCosts?.grade ? "mb-1" : "mb-4"}`}
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, color: done ? (won ? "#3a6b4f" : "#8a3a3a") : undefined }}
        >
          {done
            ? verdicts[won ? 0 : 1]
            : phase === "decision"
            ? "A Field Decision"
            : phase === "reserve"
            ? "The Decisive Hour"
            : phase === "counter"
            ? "Enemy Counterattack"
            : !started && !plan.autoplay
            ? config.title
            : "The Battle Unfolds"}
        </h2>
        {/* Round 13, Craig's item #1 ("graded outcomes, not strict binary win/lose"): a second
            line under the verdict heading, grading the SAME win/loss on plan quality: clean vs.
            costly win, marginal vs. total loss, from computeBattlePlanCosts's grade (see its own
            comment for the exact thresholds). Falls back to nothing (not a generic sentence) when
            a battle config has no verdictGrades text yet, so this never half-renders for a future
            battle that hasn't had its grade copy written. */}
        {done && config.verdictGrades && result.planCosts?.grade && (
          <p className="text-sm italic mb-4 opacity-80" style={bodyStyle}>
            {config.verdictGrades[result.planCosts.grade]}
          </p>
        )}

        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold opacity-70" style={labelStyle}>
          <span>Your Forces</span>
          <span>Enemy Forces</span>
        </div>
        <div className={`relative mb-4 ${shaking ? "bar-shake" : ""}`}>
          <div
            className="w-full h-8 border-2 overflow-hidden flex"
            style={{ borderColor: campaign.accent }}
            role="img"
            aria-label={`Balance of the battle: ${standing}`}
          >
            <div className="h-full" style={{ width: `${position}%`, backgroundColor: campaign.accent, transition: barTransition }} />
            <div className="h-full" style={{ width: `${100 - position}%`, backgroundColor: "#5a2a2a", transition: barTransition }} />
          </div>
          <div
            aria-hidden="true"
            className="absolute"
            style={{ top: -5, bottom: -5, width: 4, left: `calc(${position}% - 2px)`, transition: `left ${moveMs}ms ${moveEase}` }}
          >
            <span key={`${shownIndex}-${done ? 1 : 0}`} className="boundary-pulse block w-full h-full" style={{ backgroundColor: "#1a1a1a" }} />
          </div>
        </div>

        {/* The control stays at the top: Start before the battle, Pause (and a way to skip) while it runs. */}
        {!done && phase === "running" && !plan.autoplay && (
          <div className="mb-4">
            {!started ? (
              <>
                {resumed && (
                  <p className="text-[12px] leading-snug mb-2 italic opacity-80" style={bodyStyle}>
                    You are back at the front. Your orders stand as you gave them, and the report begins again from its first line.
                  </p>
                )}
                <p className="text-[13px] leading-snug mb-2" style={bodyStyle}>
                  Your orders are given. The reports will come in on their own, newest at the top, and the battle stops when it needs a decision from you.
                </p>
                <button
                  onClick={startBattle}
                  className="w-full border-2 px-4 py-3 hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                  style={{ borderColor: campaign.accent, ...bodyStyle }}
                >
                  Start battle
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  className="flex-1 border-2 px-3 py-2 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                  style={{ borderColor: campaign.accent, ...labelStyle }}
                >
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={skip}
                  className="flex-1 border px-3 py-2 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                  style={{ borderColor: campaign.accent, ...labelStyle }}
                >
                  Skip to the verdict
                </button>
              </div>
            )}
          </div>
        )}

        {/* A decision stops the battle. The panel sits where the control was, above the reports. */}
        {!done && phase === "decision" && nextDecision && (
          <div ref={panelRef} tabIndex={-1} role="group" aria-label="A field decision" className="mb-5 border-2 p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]" style={{ borderColor: campaign.accent }}>
            <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={labelStyle}>
              {nextDecision.time ? `${nextDecision.time}` : ""}
              {nextDecision.title}
            </p>
            <p className="text-sm mb-3" style={bodyStyle}>
              {nextDecision.prompt}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {nextDecision.options.map((o) => (
                <button key={o.id} onClick={() => chooseDecision(nextDecision, o.id)} className={choiceBtn} style={{ borderColor: campaign.accent }}>
                  <div className="text-sm font-semibold">{o.name}</div>
                  {o.note && <div className="text-[11px] opacity-80">{o.note}</div>}
                </button>
              ))}
            </div>
          </div>
        )}
        {!done && phase === "reserve" && (
          <div ref={panelRef} tabIndex={-1} role="group" aria-label="The decisive hour" className="mb-5 border-2 p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]" style={{ borderColor: campaign.accent }}>
            <p className="text-[13px] leading-snug mb-2" style={bodyStyle}>
              {times?.reserve ? <span className="font-bold mr-1" style={labelStyle}>{times.reserve}</span> : null}
              The battle stands at the point where it will be decided, and the line is {standing}.
              {carrying.length > 0 && <> {listWords(carrying)} {carrying.length === 1 ? "is" : "are"} carrying the attack.</>}
              {short.length > 0 && <> {listWords(short)} {short.length === 1 ? "is" : "are"} short of what {short.length === 1 ? "it needs" : "they need"}.</>}
              {bare.length > 0 && <> Nothing was committed to {listWords(bare)}.</>}
            </p>
            <p className="text-[13px] leading-snug mb-2" style={bodyStyle}>
              {plan.reserves} {plan.reserves === 1 ? "point of effort was" : "points of effort were"} held back for this hour.
              Committed now, {plan.reserves === 1 ? "it arrives" : "they arrive"} late and count for three quarters of what planned effort would have counted for.
              Held back, {plan.reserves === 1 ? "it stays" : "they stay"} in hand{plan.reserves >= 2 ? ", and a reserve of two or more that comes home intact earns back a point of Manpower" : ""}
              {ca ? ", and can still be thrown at an enemy counterattack if one comes" : ""}.
            </p>
            <p className="text-[12px] leading-snug mb-3 italic opacity-80" style={bodyStyle}>
              Where do you commit {plan.reserves === 1 ? "it" : "them"}, or do you hold?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((c) => (
                <button key={c.id} onClick={() => chooseReserve(c.id)} className={choiceBtn} style={{ borderColor: campaign.accent }}>
                  <div className="text-sm font-semibold">Commit to {c.name}</div>
                  <div className="text-[11px] opacity-80">{reserveStatus(c)}</div>
                </button>
              ))}
              <button onClick={() => chooseReserve("hold")} className={choiceBtn} style={{ borderColor: campaign.accent }}>
                <div className="text-sm font-semibold">Hold the reserve</div>
                <div className="text-[11px] opacity-80">Keep it back for whatever comes next.</div>
              </button>
            </div>
          </div>
        )}
        {!done && phase === "counter" && (
          <div ref={panelRef} tabIndex={-1} role="group" aria-label="Enemy counterattack" className="mb-5 border-2 p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]" style={{ borderColor: campaign.accent }}>
            <p className="text-sm mb-2 italic" style={bodyStyle}>
              {times?.counter ? <span className="font-bold not-italic mr-1" style={labelStyle}>{times.counter}</span> : null}
              {ca.warn[severity] || ca.warn[1]}
            </p>
            <p className="text-[13px] leading-snug mb-2" style={bodyStyle}>
              It will fall on {caCat?.name || ca.category}, where you have {counterStrengthBase} {counterStrengthBase === 1 ? "point" : "points"} of effort.
              Held head-on, it takes {needed} or more to throw the attack back cleanly. With fewer it is held at a cost, and with none it breaks through.
              As things stand, standing and fighting would mean {COUNTER_WORDS[counterNow.result]}.
            </p>
            {canThrowReserve && (
              <p className="text-[13px] leading-snug mb-2" style={bodyStyle}>
                You still hold {plan.reserves} {plan.reserves === 1 ? "point" : "points"} in reserve. Thrown in here {plan.reserves === 1 ? "it brings" : "they bring"} the strength to {counterStrengthBase + plan.reserves}, which would mean {COUNTER_WORDS[counterWithReserve.result]}.
                {plan.reserves >= 2 && <> Spent here, they do not come home intact, so the point of Manpower a reserve earns back is lost.</>}
              </p>
            )}
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => chooseCounter("head")} className={choiceBtn} style={{ borderColor: campaign.accent }}>
                <div className="text-sm font-semibold">Meet it head-on</div>
                <div className="text-[11px] opacity-80">Stand and fight with what is there: {COUNTER_WORDS[counterNow.result]}.</div>
              </button>
              {!noGiveGround && (
                <button onClick={() => chooseCounter("give")} className={choiceBtn} style={{ borderColor: campaign.accent }}>
                  <div className="text-sm font-semibold">Give ground and hold what you can</div>
                  <div className="text-[11px] opacity-80">A smaller loss, and a certain one. It costs a point of Initiative.</div>
                </button>
              )}
              {noGiveGround && (
                <p className="text-[12px] leading-snug italic opacity-80" style={bodyStyle}>
                  {HARD_MODE_NAMES[mode]}: the order is to hold. The line may not give ground.
                </p>
              )}
              {canThrowReserve && (
                <button onClick={() => chooseCounter("reserve")} className={choiceBtn} style={{ borderColor: campaign.accent }}>
                  <div className="text-sm font-semibold">Throw the held reserve at it</div>
                  <div className="text-[11px] opacity-80">
                    {plan.reserves} more {plan.reserves === 1 ? "point" : "points"} of effort alongside the {caCat?.name || ca.category} already there: {COUNTER_WORDS[counterWithReserve.result]}.
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
        {!done && phase === "resolving" && (
          <p className="mb-4 text-sm italic opacity-70" style={bodyStyle}>
            Waiting on the last reports…
          </p>
        )}

        {/* The reports, newest first. Each new one is added at the top and the older ones move down. */}
        <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Battle report" className="mb-5 flex flex-col gap-3">
          {[...visibleBeats]
            .map((b, idx) => ({ b, idx }))
            .reverse()
            .map(({ b, idx }) => {
              const t = timeFor(b);
              const label = labelFor(b);
              const newest = idx === visibleBeats.length - 1 && !done;
              return (
                <p key={idx} className={`dispatch-line text-sm ${newest ? "flashup-line" : "opacity-60"}`} style={bodyStyle}>
                  {t && (
                    <span className="font-bold not-italic mr-1" style={labelStyle}>
                      {t}
                    </span>
                  )}
                  {label && <span className="font-bold">{label}: </span>}
                  <span className="italic">{bodyFor(b)}</span>
                </p>
              );
            })}
        </div>

        {done && (
          <>
            {result.notes && result.notes.length > 0 && (
              <div className="mb-4 border-l-4 pl-3" style={{ borderColor: campaign.accent }}>
                <div className="text-[11px] uppercase tracking-widest font-bold mb-1" style={labelStyle}>
                  After-Action Notes
                </div>
                {result.notes.map((n, i) => (
                  <p key={i} className="text-[13px] leading-snug mb-1" style={bodyStyle}>
                    {n}
                  </p>
                ))}
              </div>
            )}
            {result.planCosts && result.planCosts.lines.length > 0 && (
              <div className="mb-5 border-2 px-3 py-2" style={{ borderColor: campaign.accent }}>
                <div className="text-[11px] uppercase tracking-widest font-bold mb-1" style={labelStyle}>
                  What the Plan Cost
                </div>
                {/* Every meter that has a reason is listed, even at a net of zero: otherwise a
                    cost and a refund on the same meter would cancel into silence. */}
                {Object.entries(result.planCosts.totals)
                  .filter(([m]) => result.planCosts.lines.some((l) => l.meter === m))
                  .map(([m, v]) => (
                    <p key={m} className="text-[13px] leading-snug" style={bodyStyle}>
                      <span className="font-bold">
                        {meterNames[m]} {v > 0 ? "+" : v === 0 ? "±" : ""}
                        {v}
                      </span>{": "}
                      {result.planCosts.lines.filter((l) => l.meter === m).map((l) => l.reason).join("; ")}
                    </p>
                  ))}
              </div>
            )}
            {categories.some((c) => config.orderOfBattle?.[c.id]?.real) && (
              <details className="mb-5 border px-3 py-2" style={{ borderColor: campaign.accent }}>
                <summary className="text-[11px] uppercase tracking-widest font-bold cursor-pointer select-none" style={labelStyle}>
                  What actually happened
                </summary>
                <div className="mt-2 flex flex-col gap-2">
                  {categories
                    .filter((c) => config.orderOfBattle?.[c.id]?.real)
                    .map((c) => (
                      <p key={c.id} className="text-[12px] leading-snug" style={bodyStyle}>
                        <b>{c.name}.</b> {config.orderOfBattle[c.id].real}
                      </p>
                    ))}
                </div>
              </details>
            )}
            <button
              onClick={onContinue}
              className="w-full border-2 px-4 py-3 hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
              style={{ borderColor: campaign.accent, ...bodyStyle }}
            >
              See the Full Report →
            </button>
            {plan.autoplay && staffStillOn && (
              <button
                onClick={() => {
                  try {
                    window.localStorage.removeItem("dispatches1940_staff_plans");
                  } catch {
                    /* nothing to clear */
                  }
                  setStaffStillOn(false);
                }}
                className="w-full mt-2 text-center text-xs uppercase tracking-widest opacity-70 underline focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px"
                style={labelStyle}
              >
                Plan my own battles from now on
              </button>
            )}
          </>
        )}
        {canSaveHere && (
          <>
            <button onClick={saveAndLeave} className="w-full mt-4 text-center text-xs uppercase tracking-widest opacity-70 underline focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] active:translate-y-px" style={labelStyle}>
              Save and leave the field: the report starts again from its first line
            </button>
            <p role="status" className="text-[12px] leading-snug mt-1 text-[#7a2e2e]" style={bodyStyle}>
              {saveNote}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function OutcomeScreen({ campaign, stage, choiceIndex, rollIndex, meters, flags, history, mode, onProceed, isLast, soundOn, resolvedWeights, planCosts, battleNotes }) {
  const choice = stage.choices[choiceIndex];
  // The state before this decision is the last entry of the history (it is added to when the player goes on).
  const priorSnap = history && history.length ? history[history.length - 1] : null;
  const eff = effectiveChoice(choice, rollIndex);
  const headingRef = useRef(null);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (headingRef.current) headingRef.current.focus();
  }, [stage, choiceIndex, rollIndex]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") onProceed();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    if (soundOn) playStamp();
  }, []);
  const deltas = eff.impact
    ? [
        ["Manpower", eff.impact.manpower || 0],
        ["Matériel", eff.impact.fuel || 0],
        ["Initiative", eff.impact.initiative || 0],
      ].filter(([, v]) => v !== 0)
    : [];
  const outcomeNote = campaign.dynamic ? meterNarrativeNote(campaign.id, meters, choiceIndex) : "";
  const outcomeWithNote = outcomeNote ? eff.outcome + "\n\n" + outcomeNote : eff.outcome;
  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-start justify-center px-4 py-10">
      <div className={`${paper} w-full max-w-[600px] p-6 sm:p-8`} style={campaignPaperStyle(campaign.id, campaign.accent)}>
        <Stamp text={campaignReportLabel(campaign.id, "outcome")} color={campaign.accent} campaignId={campaign.id} />
        {(campaign.id === "german" || campaign.id === "soviet") && (
          <div
            className="text-[10px] uppercase tracking-widest opacity-70 mt-1"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {campaign.id === "german" ? "Combat / After-Action Report" : "Report / Dispatch"}
          </div>
        )}
        <div className="flex items-center justify-between mt-4 mb-1">
          <div
            ref={headingRef}
            tabIndex={-1}
            role="heading"
            aria-level="1"
            className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold outline-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {formatDateForCampaign(shiftDateForPace(stage.date, meters.initiative, campaign.id), campaign.id)} · Order Given
          </div>
          <div
            className="text-[9px] uppercase tracking-[0.14em] font-bold shrink-0"
            style={{ color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace", opacity: 0.75 }}
          >
            {STAFF_BRANCH_LABELS[campaign.id]?.[classifyStaffBranch(stage)]}
          </div>
        </div>
        <p
          className={choice.historical ? "italic mb-1 text-[16px] text-[#000000] font-medium" : "italic mb-4 text-[16px] text-[#000000] font-medium"}
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          "{choice.label}"
        </p>
        {choice.historical && (
          <div
            className="inline-block mb-4 border-2 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] font-bold select-none"
            style={{
              borderColor: campaign.accent,
              color: campaign.accent,
              fontFamily: "'IBM Plex Mono', monospace",
              transform: "rotate(-2deg)",
            }}
            title="This is what the historical record shows actually happened."
          >
            ✓ Historical Choice
          </div>
        )}

        {/* Round 10 (Craig: a general wouldn't know the option he didn't get): after a Key
            Battle Subgame battle (resolvedWeights set) this box is not shown at all: no odds,
            no alternative outcome. The battle report already gave the verdict in the battle's
            own words. Every ordinary concealRoll/contested choice elsewhere is unchanged. */}
        {eff.variantTitle && !(choice.concealRoll && resolvedWeights) && (
          <div
            className="mb-4 border-2 border-black px-3 py-2 text-[13px] font-bold text-[#000000]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {choice.concealRoll ? (
              // Hidden-information choice type: the odds were withheld before the choice (see
              // the BriefingScreen guard on choice.uncertain && !choice.concealRoll) because the
              // situation prose frames this as a genuine period intelligence gap, not ordinary
              // game-mechanical randomness. The reveal happens here, after the fact, once — the
              // "consistent post-hoc reveal" this choice type exists to formalize.
              //
              // Round 8 (Craig, looking at this exact block after a Key Battle Subgame battle:
              // "The two bits of grey text need to be removed - hidden at the time, and the is
              // run"): scoped to resolvedWeights being set, i.e. only when this reveal follows a
              // subgame battle. For those, BattleSimulationScreen already announced the odds and
              // the verdict one screen ago — by the time the player reaches this screen "hidden
              // at the time" is simply false (they've already seen it) and "This run: X" repeats
              // what the simulation screen's own headline already said. For every OTHER
              // concealRoll choice in the game (nine of them, none behind a subgame), this is
              // still the first and only reveal, so both lines stay — removing them there would
              // be a real loss, not decluttering.
              resolvedWeights ? (
                <div className="uppercase tracking-widest">
                  {(() => {
                    const total = resolvedWeights.reduce((a, x) => a + x, 0);
                    return choice.uncertain
                      .map((v, vi) => `${Math.round((resolvedWeights[vi] / total) * 100)}% ${v.title}`)
                      .join(" / ");
                  })()}
                </div>
              ) : (
                <>
                  <div className="uppercase tracking-widest text-[10px] opacity-60 mb-1">
                    ⚄ Hidden at the time: the odds you couldn't see
                  </div>
                  <div className="uppercase tracking-widest">
                    {choice.uncertain
                      .map((v, vi) => `${Math.round((v.weight / choice.uncertain.reduce((a, x) => a + x.weight, 0)) * 100)}% ${v.title}`)
                      .join(" / ")}
                  </div>
                  <div className="uppercase tracking-widest text-[10px] opacity-60 mt-1">This run: {eff.variantTitle}</div>
                </>
              )
            ) : (
              <div className="uppercase tracking-widest">⚄ Contested decision: resolved: {eff.variantTitle}</div>
            )}
          </div>
        )}

        {deltas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {deltas.map(([label, v]) => (
              <span
                key={label}
                className="inline-block border-2 px-2 py-1 text-xs uppercase tracking-widest font-bold"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  borderColor: v > 0 ? "#2f4a3a" : "#7a2e2e",
                  color: v > 0 ? "#2f4a3a" : "#7a2e2e",
                }}
              >
                {v > 0 ? "▲" : "▼"} {label} {v > 0 ? "+" + v : v}
              </span>
            ))}
          </div>
        )}
        {/* Round 9: a Key Battle Subgame plan's own cost (see computeBattlePlanCosts), applied
            to the meters alongside the outcome's impact above: shown separately so the player
            can tell the battle's historical consequence from the price of how they fought it. */}
        {battleNotes && battleNotes.length > 0 && (
          <div className="mb-4 border-l-4 pl-3" style={{ borderColor: campaign.accent }}>
            <div
              className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              After-action notes
            </div>
            {battleNotes.map((n, i) => (
              <p key={i} className="text-[13px] leading-snug text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {n}
              </p>
            ))}
          </div>
        )}
        {planCosts && Object.values(planCosts.totals).some((v) => v !== 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="text-[10px] uppercase tracking-widest font-bold opacity-70"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              The plan's own cost:
            </span>
            {Object.entries(planCosts.totals)
              .filter(([, v]) => v !== 0)
              .map(([m, v]) => (
                <span
                  key={m}
                  className="inline-block border-2 px-2 py-1 text-xs uppercase tracking-widest font-bold"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    borderColor: v > 0 ? "#2f4a3a" : "#7a2e2e",
                    color: v > 0 ? "#2f4a3a" : "#7a2e2e",
                  }}
                >
                  {v > 0 ? "▲" : "▼"} {m === "manpower" ? "Manpower" : m === "fuel" ? "Matériel" : "Initiative"} {v > 0 ? "+" + v : v}
                </span>
              ))}
          </div>
        )}

        <p
          className="leading-relaxed text-[16px] mb-6 text-[#000000]"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          {outcomeWithNote}
        </p>

        {campaign.dynamic && mode !== "iron" && flags && (
          <div className="mb-2">
            <div className="text-[11px] uppercase tracking-widest font-bold opacity-70 mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Where you stand now
            </div>
            <MeterPanel meters={meters} flags={flags} prev={priorSnap} />
          </div>
        )}

        <button
          onClick={onProceed}
          className="border-2 px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
          style={{ borderColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
        >
          {isLast ? "Final Report" : "Next Report"}
        </button>
      </div>
    </div>
  );
}

function EndScreen({ campaign, flags, meters, log, pastStages, rewinds, mode, favor, onRestart, onSwitch, onRewind, grandChain, onContinueGrand, history, position, seenWireHeadlines }) {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef(null);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (headingRef.current) headingRef.current.focus();
  }, [campaign.id, flags]);
  const total = campaign.dynamic ? meters.manpower + meters.fuel + meters.initiative : 0;
  const epilogueText = useMemo(
    () => (typeof campaign.epilogue === "function" ? campaign.epilogue(flags, meters) : campaign.epilogue),
    [campaign, flags, meters]
  );
  const collapsed = flags.pathVariant === "earlyCollapse" || flags.pathVariant === "collapse44";
  const removedFromCommand = flags.purged || flags.relieved || flags.dismissed || flags.superseded;
  const comparable = log.filter((e) => e.histSum != null);
  const outperformed = comparable.filter((e) => e.sum > e.histSum).length;
  const matchedHistory = comparable.filter((e) => e.isHistorical).length;
  const departed = log.filter((e) => !e.isHistorical).length;
  const rolls = log.filter((e) => e.rollP != null);
  const compound = rolls.reduce((a, e) => a * e.rollP, 1);
  const compoundPct =
    compound >= 0.1 ? Math.round(compound * 100) + "%" : compound >= 0.001 ? (compound * 100).toFixed(1) + "%" : "under 0.1%";
  const earnedObjectives = campaign.dynamic
    ? evaluateObjectives({ campaignId: campaign.id, flags, meters, log, rewinds, mode, favor })
    : [];
  const rating = useMemo(() => (campaign.dynamic ? buildRating(campaign, flags, meters, log, mode, rewinds, favor) : null), [campaign, flags, meters, log, mode, rewinds, favor]);
  const advisorTally = {};
  log.forEach((e) => {
    if (e.advisor) advisorTally[e.advisor] = (advisorTally[e.advisor] || 0) + 1;
  });
  const topAdvisors = Object.entries(advisorTally).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const manpowerSev = campaign.dynamic ? meterSeverityTier(meters.manpower) : "strong";
  const timeSev = campaign.dynamic ? meterSeverityTier(meters.initiative) : "strong";
  const redactedEpilogue = useMemo(
    () => (campaign.dynamic && mode !== "open" && mode !== "easy" ? redactWearText(epilogueText, manpowerSev) : epilogueText),
    [epilogueText, manpowerSev, campaign.dynamic, mode]
  );
  // Multi-stage ending, second stage: roughly a year past the date epilogue() names. Only the
  // four dynamic campaigns carry oneYearLater(); static/demo campaigns simply omit this section.
  const oneYearLaterText = useMemo(
    () => (typeof campaign.oneYearLater === "function" ? campaign.oneYearLater(flags, meters) : null),
    [campaign, flags, meters]
  );
  const redactedOneYearLater = useMemo(
    () => (oneYearLaterText && campaign.dynamic && mode !== "open" && mode !== "easy" ? redactWearText(oneYearLaterText, manpowerSev) : oneYearLaterText),
    [oneYearLaterText, manpowerSev, campaign.dynamic, mode]
  );
  // The officers this run actually leaned on already carry a researched fate in ADVISOR_DOSSIERS.
  const legacyAdvisors = topAdvisors
    .map(([name, n]) => [name, n, ADVISOR_DOSSIERS[name]])
    .filter(([, , dossier]) => dossier && dossier.fate);
  const endingLabel = campaign.positionLabel
    ? campaign.positionLabel(flags, meters)
    : collapsed
    ? "Collapse Ahead of Schedule"
    : total <= 1
    ? "Essentially the Historical Outcome"
    : "Resistance Prolonged";
  const galleryEntry = ENDINGS_GALLERY.find((e) => e.label === endingLabel);
  const endStamp = campaign.projectedEnd ? campaign.projectedEnd(flags, meters).stamp : null;
  const fmtSigned = (n) => (n > 0 ? "+" + n : String(n));
  const likelihoodSentence =
    rolls.length > 0
      ? `The war passed through ${rolls.length} contested ${rolls.length === 1 ? "outcome" : "outcomes"}, and the path you walked had a likelihood of about ${compoundPct}.` +
        (rewinds > 0 ? ` You reached it across ${rewinds} ${rewinds === 1 ? "rewind" : "rewinds"}.` : "")
      : "";
  const pathNote = flags.alternateHistoryPath
    ? "Parts of this path are marked alternate history: invented beyond the point where any serious historian's argument would follow."
    : flags.speculativePath
    ? "Parts of this path are marked speculative: beyond what the evidence supports."
    : "";
  // The summary a player can copy and share: plain lines, in the order a reader wants them.
  const shareText = () => {
    const lines = [
      "DISPATCHES 1940: After-Action Report",
      `${campaign.name} · ${warRoomModeInfo(mode || "open", campaign.id).label}`,
      "",
      rating ? `Command rank: ${rating.rank} (${rating.score}/100)` : null,
      `Ending: ${endingLabel}${galleryEntry ? ` [${galleryEntry.tier}]` : ""}${endStamp ? ` · end of hostilities ${endStamp}` : ""}`,
      campaign.dynamic ? `Standing at the end: Manpower ${fmtSigned(meters.manpower)}, Matériel ${fmtSigned(meters.fuel)}, Initiative ${fmtSigned(meters.initiative)}` : null,
      comparable.length > 0
        ? `Judgement: chose the historical option at ${matchedHistory} of ${comparable.length} comparable decisions and out-positioned it at ${outperformed}`
        : null,
    ];
    const battles = battleSummaryLines(flags);
    if (battles.length) {
      lines.push("Battles:");
      battles.forEach((b) => lines.push("  " + b));
    }
    lines.push(
      rolls.length > 0 ? `Contested outcomes: ${rolls.length} (path likelihood about ${compoundPct})${rewinds > 0 ? `, across ${rewinds} rewinds` : ", no rewinds"}` : null,
      topAdvisors.length > 0 ? `Advisers heeded most: ${topAdvisors.map(([n, c]) => `${n} (${c})`).join(", ")}` : null,
      earnedObjectives.length > 0 ? `Objectives: ${earnedObjectives.map((id) => (OBJECTIVES.find((x) => x.id === id) || {}).title).filter(Boolean).join(", ")}` : null
    );
    return lines.filter((l) => l !== null).join("\n");
  };
  const sectionHead = (text) => (
    <div
      className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold"
      style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {text}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-start justify-center px-4 py-10">
      <div
        className={`${paper} w-full max-w-[600px] p-6 sm:p-8 relative overflow-hidden`}
        style={campaignPaperStyle(campaign.id, campaign.accent)}
      >
        {campaign.dynamic && <WearPaperclipTornCorner show={timeSev === "catastrophic"} />}
        <div style={{ display: "inline-block", transform: `rotate(${campaign.dynamic ? TIME_ROTATION_DEG[timeSev] : 0}deg)` }}>
          <Stamp text={removedFromCommand ? "Command Terminated" : collapsed ? "Front Collapsed" : "File Closed"} color={campaign.accent} campaignId={campaign.id} />
        </div>
        {grandChain && (
          <div
            className="mt-2 inline-block border-2 px-2 py-1 text-[10px] uppercase tracking-[0.2em] font-bold"
            style={{ borderColor: campaign.accent, color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Grand Campaign (prototype): Leg {grandChain.index + 1} of {grandChain.order.length}
            {grandChain.index + 1 >= grandChain.order.length ? ": Complete" : ""}
          </div>
        )}
        <div className="flex items-start gap-2 flex-wrap mt-4 mb-1">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl sm:text-4xl text-[#000000] leading-tight outline-none"
            style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
          >
            {endingLabel}
          </h2>
          {galleryEntry && (
            <span className="mt-2">
              <EndingTierBadge tier={galleryEntry.tier} />
            </span>
          )}
        </div>
        <div className="text-xs uppercase tracking-[0.25em] font-semibold mb-1 opacity-70" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {campaign.name}, {campaign.dates}
        </div>
        {endStamp && (
          <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            End of hostilities: {endStamp}
            {campaign.dynamic && FILING_NOTE[timeSev] && <span className="opacity-70 italic normal-case tracking-normal"> · {FILING_NOTE[timeSev]}</span>}
          </div>
        )}

        <div className="mb-6">
          {campaign.dynamic && oneYearLaterText && (
            <div className="text-xs uppercase tracking-[0.25em] mb-2 text-[#000000] font-semibold opacity-70" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Immediate Aftermath
            </div>
          )}
          <p className="leading-relaxed text-[16px] text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {redactedEpilogue}
          </p>
        </div>
        {campaign.dynamic && oneYearLaterText && (
          <div className="mb-6">
            {sectionHead("One Year Later")}
            <p className="leading-relaxed text-[15px] text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {redactedOneYearLater}
            </p>
          </div>
        )}

        {campaign.projectedEnd && campaign.dynamic && (
          <details className="mb-6">
            <summary className="text-xs uppercase tracking-[0.25em] font-semibold text-[#000000] cursor-pointer select-none py-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              The Theater Map at the end of the war
            </summary>
            <CheckpointMap
              embedded
              campaign={campaign}
              year={yearFrom(endStamp, 1945)}
              flags={flags}
              meters={meters}
              resolved
              seenWireHeadlines={seenWireHeadlines || []}
              nodeId={position}
              history={history}
              endDate={endStamp.replace(/\s*\(.*\)\s*$/, "")}
            />
          </details>
        )}

        {rating && (
          <div className="mb-6 border-2 px-4 py-3" style={{ borderColor: campaign.accent }}>
            <div className="text-xs uppercase tracking-[0.25em] font-semibold opacity-70" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Command rank
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-4xl leading-tight text-[#000000]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}>
                {rating.rank}
              </div>
              <div className="text-xs uppercase tracking-widest font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {rating.score} of 100
              </div>
            </div>
            <div className="flex gap-1 my-2" aria-hidden="true">
              {COMMAND_RANKS.map((r, k) => (
                <span key={r} title={r} className="flex-1 h-2 border" style={{ borderColor: campaign.accent, backgroundColor: k <= rating.rankIndex ? campaign.accent : "transparent" }} />
              ))}
            </div>
            <div className="flex justify-between text-[9px] uppercase tracking-wider opacity-70 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }} aria-hidden="true">
              <span>Private</span>
              <span>General</span>
            </div>
            <ul className="flex flex-col gap-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {rating.parts.map((p) => (
                <li key={p.id} className="flex items-baseline justify-between gap-3 text-[13px] leading-snug text-[#000000] border-l-4 pl-2" style={{ borderColor: p.word === "Strong" ? "#2f6b3f" : p.word === "Weak" ? "#7a2e2e" : "#8a5a1a" }}>
                  <span>
                    <b>{p.label}.</b> {p.fact}.
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-widest font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {p.word}
                  </span>
                </li>
              ))}
            </ul>
            {rating.capped && (
              <p className="mt-2 text-[12px] italic text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {rating.capped}
              </p>
            )}
          </div>
        )}

        {campaign.dynamic && (
          <div className="mb-6">
            {sectionHead("Where the Command Ended")}
            <MeterPanel meters={meters} flags={flags} prev={null} />
          </div>
        )}

        {(topAdvisors.length > 0 || legacyAdvisors.length > 0) && (
          <div className="mb-6">
            {sectionHead("Your Advisers")}
            {topAdvisors.length > 0 && (
              <p className="text-sm text-[#000000] font-medium mb-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
                Most heeded: <span className="font-bold">{topAdvisors[0][0]} ({topAdvisors[0][1]} {topAdvisors[0][1] === 1 ? "council" : "councils"})</span>
                {topAdvisors.length > 1 && <span> · also {topAdvisors.slice(1).map(([name, n]) => `${name} (${n})`).join(", ")}</span>}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {legacyAdvisors.map(([name, , dossier]) => (
                <p key={name} className="text-[13px] leading-snug text-[#000000] border-l-4 pl-2" style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}>
                  <span className="font-bold">{name}</span>
                  {dossier.role ? <span className="opacity-70"> ({dossier.role})</span> : null}: {dossier.fate}
                </p>
              ))}
            </div>
          </div>
        )}

        {earnedObjectives.length > 0 && (
          <div className="mb-6">
            {sectionHead("Objectives Achieved")}
            {earnedObjectives.map((id) => {
              const o = OBJECTIVES.find((x) => x.id === id);
              return o ? (
                <div key={id} className="text-sm text-[#000000] border-l-4 pl-2 mb-1" style={{ borderColor: "#b08d3f", fontFamily: "'Courier Prime', monospace" }}>
                  ★ <b>{o.title}</b>: {o.desc}
                </div>
              ) : null;
            })}
          </div>
        )}

        {log.length > 0 && (
          <div className="mb-6">
            {sectionHead("How You Commanded")}
            <p className="text-sm text-[#000000] mb-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {comparable.length > 0
                ? `You chose the historical option at ${matchedHistory} of ${comparable.length} comparable decisions and out-positioned it at ${outperformed}. `
                : ""}
              {departed > 0 ? `${departed} of your ${log.length} decisions departed from the record. ` : `All ${log.length} of your decisions followed the record. `}
              {likelihoodSentence} {pathNote}
            </p>
            <details>
              <summary className="text-xs uppercase tracking-[0.2em] font-bold text-[#000000] cursor-pointer select-none py-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                The {log.length} decisions, in order
              </summary>
              <ol className="mt-2 border-l-2 pl-4 flex flex-col gap-3" style={{ borderColor: campaign.accent }}>
                {log.map((e, i) => (
                  <li key={i} className="relative">
                    <span aria-hidden="true" className="absolute -left-[23px] top-[2px] text-[13px]" style={{ color: e.isHistorical ? "#00000055" : campaign.accent }}>
                      {e.isHistorical ? "·" : "◆"}
                    </span>
                    <div className="text-[10px] uppercase tracking-widest text-[#000000] opacity-70" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {e.date}: {e.title}
                    </div>
                    <div className={`text-[13px] text-[#000000] ${e.isHistorical ? "" : "font-bold"}`} style={{ fontFamily: "'Courier Prime', monospace" }}>
                      {e.label}
                    </div>
                    {e.histSum != null && (
                      <div className="text-[12px] text-[#000000] opacity-80" style={{ fontFamily: "'Courier Prime', monospace" }}>
                        {e.sum > e.histSum ? "▲ out-positioned the record" : e.sum < e.histSum ? "▼ cost more than the record's choice" : "＝ as the record's choice would have"}
                        {!e.isHistorical && e.histLabel ? ` · history: ${e.histLabel}` : ""}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
              <p className="text-[11px] italic text-[#000000] opacity-70 mt-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
                ◆ marks a decision that departed from the historical record.
              </p>
            </details>
          </div>
        )}

        {pastStages && pastStages.length > 0 && (
          <details className="border-t-2 pt-3 mb-6" style={{ borderColor: campaign.accent }}>
            <summary className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Reconsider an Earlier Decision
            </summary>
            <div className="flex flex-col gap-2 mt-3">
              {pastStages.map((p) => (
                <button
                  key={p.index}
                  onClick={() => onRewind(p.index)}
                  className="text-left border px-3 py-2 text-xs text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
                  style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}
                >
                  ↺ Rewind to {p.date}: {p.title}
                </button>
              ))}
            </div>
          </details>
        )}

        <div className="flex flex-wrap gap-3">
          {grandChain && grandChain.index + 1 < grandChain.order.length && (
            <button
              onClick={onContinueGrand}
              className="border-2 px-5 py-2 uppercase tracking-widest text-sm font-bold text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
              style={{ borderColor: campaign.accent, backgroundColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
            >
              Continue Grand Campaign: {CAMPAIGNS[grandChain.order[grandChain.index + 1]].name} →
            </button>
          )}
          <button
            onClick={() => {
              try {
                navigator.clipboard.writeText(shareText()).then(
                  () => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  },
                  () => setCopied(false)
                );
              } catch (e) {
                setCopied(false);
              }
            }}
            className="border-2 px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ borderColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
          >
            {copied ? "✓ Copied" : "Copy After-Action Summary"}
          </button>
          <button
            onClick={onRestart}
            className="border-2 px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ borderColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
          >
            Replay This Command
          </button>
          <button
            onClick={onSwitch}
            className="border-2 border-[#000000] px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Choose Another Theater
          </button>
        </div>
      </div>
    </div>
  );
}
