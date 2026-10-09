function WarRoomScreen({ campaign, mode, onEnter, onBack }) {
  const modeInfo = warRoomModeInfo(mode);
  const screenRef = useRef(null);
  const [historicallyAccurate, setHistoricallyAccurate] = useState(true);
  const hasForks = (DIVERGENCE_FORKS[campaign.id] || []).length > 0;
  useEffect(() => {
    if (screenRef.current) screenRef.current.focus();
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="main"
        aria-label={`${campaign.name} war room`}
        className={`${paper} w-full max-w-lg p-8 text-center focus:outline-none`}
        style={campaignPaperStyle(campaign.id, campaign.accent)}
      >
        <Stamp text={campaign.seal} color={campaign.accent} campaignId={campaign.id} />
        <h1
          className="text-3xl mt-5 mb-1 leading-tight"
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
        >
          {campaign.name}
        </h1>
        <div
          className="text-xs uppercase tracking-[0.25em] font-bold mb-6"
          style={{ color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {modeInfo.label}
        </div>
        <p
          className="text-[14px] leading-relaxed mb-8 text-[#000000] opacity-80"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          {modeInfo.note}
        </p>
        {campaign.intro && (
          <div
            className="mb-8 border-t-2 pt-5 text-left"
            style={{ borderColor: campaign.accent }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2 opacity-60"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Where the war is at
            </div>
            <p
              className="text-[13px] leading-relaxed italic text-[#000000] opacity-85"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              {campaign.intro}
            </p>
          </div>
        )}
        {LEADER_QUOTES[campaign.id] && (
          <div className="mb-8 text-left">
            <p
              className="text-[15px] leading-relaxed italic text-[#000000]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              "{LEADER_QUOTES[campaign.id].quote}"
            </p>
            <p
              className="text-[11px] uppercase tracking-[0.2em] font-bold mt-2 text-right"
              style={{ color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              — {LEADER_QUOTES[campaign.id].name}
            </p>
          </div>
        )}
        {hasForks && (
          <label
            className="mb-6 flex items-center gap-2 text-left text-[12px] leading-snug text-[#000000] opacity-85 cursor-pointer select-none"
            style={{ fontFamily: "'Courier Prime', monospace" }}
          >
            <input
              type="checkbox"
              checked={historicallyAccurate}
              onChange={(e) => setHistoricallyAccurate(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-label="Historically accurate opponent"
            />
            <span>
              Historically accurate opponent. Unchecked, a small number of genuinely contested
              moments this campaign touches may play out differently than they did historically
              discovered in play, never announced in advance.
            </span>
          </label>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onEnter(hasForks ? historicallyAccurate : true)}
            className="w-full border-2 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold text-[#ffffff] transition-colors duration-150"
            style={{ borderColor: campaign.accent, backgroundColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Enter the War Room
          </button>
          <button
            onClick={onBack}
            className="w-full border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctrineScreen({ campaign, onSelect }) {
  const doctrines = DOCTRINES[campaign.id] || [];
  const screenRef = useRef(null);
  useEffect(() => {
    if (screenRef.current) screenRef.current.focus();
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div ref={screenRef} tabIndex={-1} role="main" aria-label="Grand strategy directive" className="w-full max-w-4xl focus:outline-none">
        <div className="text-center mb-8">
          <Stamp text={campaign.seal} color={campaign.accent} campaignId={campaign.id} />
          <h1
            className="text-2xl sm:text-3xl mt-4 mb-2 text-[#ffffff] leading-tight"
            style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
          >
            Three Commanders, One Doctrine
          </h1>
          <p
            className="text-[13px] sm:text-[14px] text-[#ffffff] opacity-70 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Courier Prime', monospace" }}
          >
            Three senior commanders are pressing incompatible cases for how this war gets fought
            from here. Only one gets the resources to actually set doctrine. Whoever loses this
            argument doesn't stop arguing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {doctrines.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelect(d)}
              className="text-left border-2 p-5 transition-colors duration-150 hover:bg-[#000000] group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
              style={{ backgroundColor: "#f6efdf", borderColor: campaign.accent }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.25em] font-bold mb-1"
                style={{ color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {d.subtitle}
              </div>
              <h2
                className="text-xl mb-1 text-[#000000] group-hover:text-[#ffffff] leading-tight"
                style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
              >
                {d.title}
              </h2>
              <div
                className="text-[11px] uppercase tracking-widest font-bold mb-3 text-[#000000] group-hover:text-[#ffffff] opacity-60"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {d.advisor} argues
              </div>
              <p
                className="text-[13px] italic leading-relaxed mb-3 text-[#000000] group-hover:text-[#ffffff] opacity-90"
                style={{ fontFamily: "'Courier Prime', monospace" }}
              >
                {d.position}
              </p>
              <p
                className="text-[12px] leading-relaxed mb-4 text-[#000000] group-hover:text-[#ffffff] opacity-70"
                style={{ fontFamily: "'Courier Prime', monospace" }}
              >
                {d.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: campaign.accent + "55" }}>
                {["readiness", "pipeline", "initiative"].map((k) => {
                  const v = d.impact[k];
                  if (!v) return null;
                  return (
                    <span
                      key={k}
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 border"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        borderColor: v > 0 ? "#2f4a3a" : "#7a2e2e",
                        color: v > 0 ? "#2f4a3a" : "#7a2e2e",
                      }}
                    >
                      {k.slice(0, 4)} {v > 0 ? "+" + v : v}
                    </span>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PressReportScreen({ campaignId, event, onContinue }) {
  const content = (PRESS_CONTENT[event] || {})[campaignId];
  const screenRef = useRef(null);
  useEffect(() => {
    if (screenRef.current) screenRef.current.focus();
  }, []);
  if (!content) return null; // no copy defined for this event/campaign pairing — fails safe rather than showing a broken screen

  const tint = campaignId === "japan" ? "#f6efdf" : "#eef2f6";
  const isJapan = campaignId === "japan";
  const headlineFont = isJapan ? "'Noto Serif JP', serif" : "'PT Serif', serif";

  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-center justify-center px-4 py-10">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="main"
        aria-label={`Press report: ${content.headline}`}
        className="bg-white text-black w-full max-w-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] outline-none"
      >
        <div className="h-[5px]" style={{ background: tint, borderTop: "1px solid #141414", borderBottom: "1px solid #141414" }} />
        <div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-y-1 px-6 py-3 text-[10.5px] uppercase tracking-[0.08em] border-b-[6px] border-double border-black"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span>{content.volLine}</span>
          <span>{content.dateLine}</span>
          <span>{content.priceLine}</span>
        </div>
        <div className="text-center px-6 pt-5 pb-4 border-b-[3px] border-black">
          {isJapan ? (
            <div className="font-black text-[22px] tracking-[0.3em] mb-1.5" style={{ fontFamily: headlineFont }}>
              {content.theWord}
            </div>
          ) : (
            <span className="block text-[20px] tracking-[0.3em] mb-0.5" style={{ fontFamily: headlineFont }}>
              {content.theWord}
            </span>
          )}
          <h1 className="font-bold text-[44px] sm:text-[52px] leading-none m-0" style={{ fontFamily: headlineFont, fontWeight: isJapan ? 900 : 700 }}>
            {content.masthead}
          </h1>
          <div className="text-[10px] tracking-[0.25em] uppercase mt-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {content.mastheadSub}
          </div>
        </div>
        <div className="px-6 pt-5 pb-4 border-b border-black">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {content.kicker}
          </div>
          <h2 className="font-bold text-[32px] sm:text-[38px] leading-[1.05] m-0 mb-2.5" style={{ fontFamily: headlineFont, fontWeight: isJapan ? 900 : 700 }}>
            {content.headline}
          </h2>
          <div className="text-[16px] sm:text-[17px] leading-snug max-w-[92%]" style={{ fontFamily: "'PT Serif', serif", fontStyle: isJapan ? "normal" : "italic" }}>
            {content.deck}
          </div>
        </div>
        <div
          className="flex flex-col sm:flex-row sm:justify-between gap-y-1 px-6 py-2 text-[10px] uppercase tracking-[0.1em] border-b-2 border-black text-[#444]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span>{content.bylineLeft}</span>
          <span>{content.bylineRight}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 px-6 pt-4 pb-2">
          {content.columns.map((col, i) => (
            <div key={i} className={`px-0 sm:px-3.5 ${i === 1 ? "sm:border-l sm:border-[#cfcac0]" : ""}`}>
              <div
                className="font-semibold text-[13px] uppercase tracking-[0.02em] border-b border-black pb-1 mb-2.5"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {col.head}
              </div>
              {col.paras.map((p, j) => (
                <p key={j} className="text-[13px] leading-relaxed mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <div
            className="border border-black h-[110px] flex items-center justify-center text-[10px] uppercase tracking-[0.15em] text-[#5a5548]"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              background: "repeating-linear-gradient(45deg, #b8b3a8 0, #b8b3a8 1px, transparent 1px, transparent 3px), #d9d4c8",
            }}
          >
            {content.photoLabel}
          </div>
          <div className="text-[9.5px] tracking-[0.05em] text-[#555] mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {content.photoCaption}
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onContinue}
            className="w-full border-2 border-black py-3 text-[13px] font-semibold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Historical Divergence Mode's reveal screen — deliberately NOT PressReportScreen's full
// newspaper mockup. Unlike PRESS_CONTENT's five hand-authored bulletins, nobody at the time
// announced any of this: it's framed as an uncertain intelligence footnote (a signals
// analysis note, a debrief fragment) reaching the player's own staff, proportionate to a
// short reveal rather than a front page. See DIVERGENCE_HEADLINES for the copy.
function DivergenceRevealScreen({ campaign, headline, onContinue }) {
  const screenRef = useRef(null);
  useEffect(() => {
    if (screenRef.current) screenRef.current.focus();
  }, []);
  if (!headline) return null;
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="main"
        aria-label={`Intelligence note: ${headline.headline}`}
        className={`${paper} w-full max-w-lg p-7 focus:outline-none`}
        style={campaignPaperStyle(campaign.id, campaign.accent)}
      >
        <div
          className="flex items-baseline justify-between pb-2 mb-4"
          style={{ borderBottom: `2px solid ${campaign.accent}` }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {campaign.id === "japan" ? "IGHQ: Signals Section" : "CINCPAC: Fleet Intelligence"}
          </div>
          <div className="text-[10px] text-[#555] shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {headline.month} {headline.year}
          </div>
        </div>
        <h2
          className="text-[22px] leading-tight mb-2.5 text-[#000000]"
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
        >
          {headline.headline}
        </h2>
        <p className="text-[13.5px] leading-relaxed mb-4 text-[#000000] opacity-85" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {headline.dek}
        </p>
        <div
          className="text-[9px] pt-2 mb-5 text-[#666]"
          style={{ borderTop: "1px dashed #999", fontFamily: "'IBM Plex Mono', monospace" }}
        >
          UNCONFIRMED: CIRCULATED FOR STAFF AWARENESS ONLY
        </div>
        <button
          onClick={onContinue}
          className="w-full border-2 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold text-[#ffffff] transition-colors duration-150"
          style={{ borderColor: campaign.accent, backgroundColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function SelectScreen({ onPick, onResume, instantText, onToggleInstant, soundOn, onToggleSound, fontScale, onSetFontScale, reducedMotion, onToggleReducedMotion, sfxVolume, onSetSfxVolume, musicVolume, onSetMusicVolume }) {
  const [record, setRecord] = useState(null);
  const [advisorSearch, setAdvisorSearch] = useState("");
  const [activeRun, setActiveRun] = useState(null);
  const [expandedCampaign, setExpandedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState("dossiers");
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
          if (isValidSave(parsed)) {
            setActiveRun(parsed);
          } else {
            // Stale save — most likely from before a node was renamed or removed in a
            // later content pass. Clear it quietly rather than offer a "Resume" button
            // that would crash past the ErrorBoundary once clicked.
            clearActiveRun();
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
          Dispatches 1941
        </h1>
        <div className="mx-auto mt-3 mb-3 h-[2px] w-40 bg-[#ffffff]" />
        <p
          className="text-[#ffffff] max-w-md mx-auto text-[15px]"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          Uncommon valor was a common virtue.
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
              {activeRun.mode === "fanatical" ? " · ⚔ Fanatical Resolve" : activeRun.mode === "coalition" ? " · ★ Coalition Resolve" : ""} · {(activeRun.log || []).length} decisions on
              file: resume where you left off.
            </p>
          </button>
        )}
        {Object.values(CAMPAIGNS)
          .filter((c) => !c.hidden)
          .map((c) => {
            const expanded = expandedCampaign === c.id;
            return (
            <div
              key={c.id}
              className={`${paper} text-left flex flex-col gap-3 transition-all duration-150`}
            >
              <button
                onClick={() => setExpandedCampaign(expanded ? null : c.id)}
                className="text-left p-5 flex items-start justify-between gap-2 w-full"
                aria-expanded={expanded}
                aria-label={`${c.name}, ${c.dates}. ${expanded ? "Collapse" : "Expand"} details.`}
              >
                <div>
                  <Stamp text={c.seal} color={c.accent} />
                  <h2
                    className="text-lg mt-3 leading-tight"
                    style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
                  >
                    {c.name}
                  </h2>
                  <div
                    className="text-xs uppercase tracking-widest mt-1 text-[#000000] font-semibold"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {c.dates}
                  </div>
                </div>
                <span
                  className="text-lg text-[#000000] shrink-0 mt-1"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  aria-hidden="true"
                >
                  {expanded ? "▾" : "▸"}
                </span>
              </button>
              {!expanded && (
                <p
                  className="text-[13px] leading-snug text-[#000000] opacity-70 px-5 pb-5 -mt-3"
                  style={{ fontFamily: "'Courier Prime', monospace" }}
                >
                  {c.teaser}
                  {DEMO_BUILD && c.id === "alliedPacific" && (
                    <span className="block mt-1 font-bold uppercase tracking-widest text-[11px]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      🔒 Full version only
                    </span>
                  )}
                </p>
              )}
              {expanded && (
              <div className="px-5 pb-5 flex flex-col gap-3">
              <p
                className="text-[15px] leading-snug text-[#000000]"
                style={{ fontFamily: "'Courier Prime', monospace" }}
              >
                {c.brief}
              </p>
              <div
                className="text-[11px] uppercase tracking-widest border-t-2 pt-2 text-[#000000] font-semibold"
                style={{ borderColor: c.accent, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {(NODE_ATLAS[c.id] || []).length} decisions · {ENDINGS_GALLERY.filter((e) => e.campaign === c.seal).length} endings · contested outcomes
              </div>
              <div className="flex gap-2 flex-wrap">
                {DEMO_BUILD && c.id === "alliedPacific" ? (
                  <button
                    disabled
                    className="border-2 border-dashed px-3 py-2 text-xs uppercase tracking-widest font-bold opacity-40 cursor-not-allowed"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: c.accent, color: c.accent }}
                  >
                    Open Command: 🔒 full version
                  </button>
                ) : (
                  <button
                    onClick={() => onPick(c.id, "open")}
                    className="border-2 border-black px-3 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Open Command
                  </button>
                )}
                {c.id === "japan" &&
                  (HARD_MODES_ENABLED ? (
                    <button
                      onClick={() => onPick(c.id, "fanatical")}
                      className="border-2 px-3 py-2 text-xs uppercase tracking-widest font-bold hover:text-[#ffffff] transition-colors duration-150"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        borderColor: "#5c1a1a",
                        color: "#5c1a1a",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#5c1a1a")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      ⚔ Fanatical Resolve Mode
                    </button>
                  ) : (
                    <button
                      disabled
                      className="border-2 border-dashed px-3 py-2 text-xs uppercase tracking-widest font-bold opacity-40 cursor-not-allowed"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#5c1a1a", color: "#5c1a1a" }}
                    >
                      ⚔ Fanatical Resolve Mode: 🔒 full version
                    </button>
                  ))}
                {c.id === "alliedPacific" &&
                  (HARD_MODES_ENABLED ? (
                    <button
                      onClick={() => onPick(c.id, "coalition")}
                      className="border-2 px-3 py-2 text-xs uppercase tracking-widest font-bold hover:text-[#ffffff] transition-colors duration-150"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        borderColor: "#28497a",
                        color: "#28497a",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#28497a")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      ★ Coalition Resolve Mode
                    </button>
                  ) : (
                    <button
                      disabled
                      className="border-2 border-dashed px-3 py-2 text-xs uppercase tracking-widest font-bold opacity-40 cursor-not-allowed"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#28497a", color: "#28497a" }}
                    >
                      ★ Coalition Resolve Mode: 🔒 full version
                    </button>
                  ))}
              </div>
              {c.id === "japan" && (
                <p className="text-[11px] italic text-[#000000] opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
                  Fanatical Resolve Mode: no rewind, decisions final, no meter dashboard, only staff reports.
                  Pragmatic, non-dogmatic choices draw insubordination out of 5: let it max out and the run
                  ends in a coup, not a defeat.
                  {!HARD_MODES_ENABLED && " Included in the full downloadable version."}
                </p>
              )}
              {c.id === "alliedPacific" && (
                <p className="text-[11px] italic text-[#000000] opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
                  Coalition Resolve Mode: no rewind, decisions final. Tracks Coalition Resolve between
                  Washington, London, Chongqing, and Canberra: every choice that overrides a partner's
                  strong objection costs something, and a badly frayed coalition can no longer greenlight
                  its boldest unilateral gambles.
                  {!HARD_MODES_ENABLED && " Included in the full downloadable version."}
                </p>
              )}
              </div>
              )}
            </div>
            );
          })}

        {Object.values(CAMPAIGNS)
          .filter((c) => c.hidden)
          .map((c) => (
            <div
              key={c.id}
              className={`${paper} text-left p-5 opacity-50 select-none relative overflow-hidden`}
              style={campaignPaperStyle(c.id, c.accent)}
              aria-disabled="true"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Stamp text={c.seal} color={c.accent} />
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

        <div className={`${paper}`}>
          <div className="flex border-b-[3px] border-black" role="tablist" aria-label="Reference sections">
            {[
              { id: "dossiers", label: "Dossiers" },
              { id: "records", label: "Records" },
              { id: "settings", label: "Settings" },
            ].map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex-1 py-3 text-[10.5px] uppercase tracking-[0.15em] font-bold border-r border-black last:border-r-0"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  backgroundColor: activeTab === t.id ? "#ffffff" : "#e8e6e0",
                  color: "#000000",
                  opacity: activeTab === t.id ? 1 : 0.6,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-5">
        {activeTab === "records" && (
          <div className="flex flex-col gap-3">
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
                {r.mode === "fanatical" ? "⚔ " : r.mode === "coalition" ? "★ " : ""}{r.label || "War concluded"}: ended {r.endDate || "—"}
              </div>
            ))}
          </div>
        )}
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Objectives · {(record && record.objectives ? record.objectives.length : 0)} of {OBJECTIVES.length}
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
                    <span className="font-bold text-[#000000]">{e.label}</span>
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
        <details className={`${paper} p-5`}>
          <summary
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Discovery Atlas: {Math.min(discovered, NODE_TOTAL)} of {NODE_TOTAL} situation reports
          </summary>
          <div className="mt-3">
            {[
              { key: "japan", label: "IGHQ: Japanese Command" },
              { key: "alliedPacific", label: "CINCPAC: Allied Pacific Command" },
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
        )}

        {activeTab === "dossiers" && (
          <div className="flex flex-col gap-3">
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
            <input
              type="text"
              value={advisorSearch}
              onChange={(e) => setAdvisorSearch(e.target.value)}
              placeholder="Search by name or role..."
              aria-label="Search advisors by name or role"
              className="w-full mb-4 px-3 py-2 border-2 border-black text-[13px]"
              style={{ fontFamily: "'Courier Prime', monospace", backgroundColor: "#f6efdf" }}
            />
            {[
              { key: "japan", label: "Japanese High Command" },
              { key: "alliedPacific", label: "Allied Pacific Command" },
            ].map((grp) => {
              const q = advisorSearch.trim().toLowerCase();
              const members = Object.entries(ADVISOR_DOSSIERS)
                .filter(([, d]) => d.faction === grp.key)
                .filter(([name, d]) => !q || name.toLowerCase().includes(q) || d.role.toLowerCase().includes(q))
                .map(([name, d]) => ({ name, ...d, count: (record && record.advisors && record.advisors[name]) || 0 }))
                .sort((a, b) => a.rank - b.rank || b.count - a.count || a.name.localeCompare(b.name));
              if (members.length === 0) return null;
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
                        {d.summary}
                      </p>
                    </details>
                  ))}
                </div>
              );
            })}
            {advisorSearch.trim() &&
              !Object.entries(ADVISOR_DOSSIERS).some(
                ([name, d]) =>
                  name.toLowerCase().includes(advisorSearch.trim().toLowerCase()) ||
                  d.role.toLowerCase().includes(advisorSearch.trim().toLowerCase())
              ) && (
                <p className="text-[13px] italic text-[#000000] opacity-60" style={{ fontFamily: "'Courier Prime', monospace" }}>
                  No advisors match "{advisorSearch.trim()}".
                </p>
              )}
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
              { key: "japan", label: "Japanese High Command" },
              { key: "alliedPacific", label: "Allied Pacific Command" },
            ].map((grp) => (
              <details key={grp.key} className="mb-2 border-l-4 pl-2" style={{ borderColor: "#00000033" }}>
                <summary
                  className="text-[12px] uppercase tracking-widest font-bold text-[#000000] cursor-pointer select-none py-1"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {grp.label}
                </summary>
                <div className="mt-1">
                  {CONTEXT_NOTES[grp.key].map((c, i) => (
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
            How to Read These Reports
          </summary>
          <div
            className="mt-3 text-[14px] leading-relaxed text-[#000000]"
            style={{ fontFamily: "'Courier Prime', monospace" }}
          >
            <p className="mb-2">
              <b>Meters.</b> Readiness, Pipeline, and Initiative track your strategic position against the
              historical baseline (zero). They gate collapses, foreclose options, and decide when your war ends.
            </p>
            <p className="mb-2">
              <b>⚄ Contested.</b> A handful of decisions are disputed by historians. These roll
              the same choice can break differently, and rewinding re-rolls them.
            </p>
            <p className="mb-2">
              <b>Projected scenarios.</b> Anything beyond the historical record is labelled as reasoned
              projection and never claims to be what happened.
            </p>
            <p>
              <b>⚠ Speculative.</b> A very small number of branches go further: past reasoned projection
              into territory the scholarly consensus argues against. These carry a distinct amber warning,
              exist only through chains of low-probability rolls, and the file computes and shows you exactly
              how unlikely the path you walked was.
            </p>
          </div>
        </details>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex flex-col gap-3">
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Instant text (skip typewriter)
          </span>
          <button
            onClick={onToggleInstant}
            aria-pressed={instantText}
            aria-label={`Instant text: ${instantText ? "on" : "off"}`}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {instantText ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Sound (typewriter, stamps, dice)
          </span>
          <button
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-label={`Sound: ${soundOn ? "on" : "off"}`}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {soundOn ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Text size
          </span>
          <div className="flex gap-1" role="group" aria-label="Text size">
            {[
              { v: 0.875, label: "A-" },
              { v: 1, label: "A" },
              { v: 1.125, label: "A+" },
              { v: 1.25, label: "A++" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => onSetFontScale(opt.v)}
                aria-pressed={fontScale === opt.v}
                aria-label={`Text size ${opt.label}`}
                className="border-2 border-black px-3 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
                style={{ fontFamily: "'IBM Plex Mono', monospace", backgroundColor: fontScale === opt.v ? "#000000" : "transparent", color: fontScale === opt.v ? "#ffffff" : "#000000" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Reduced motion (skip stamp animation)
          </span>
          <button
            onClick={onToggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-label={`Reduced motion: ${reducedMotion ? "on" : "off"}`}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {reducedMotion ? "On" : "Off"}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-4`}>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            SFX volume
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={(e) => onSetSfxVolume(parseInt(e.target.value, 10))}
            aria-label={`SFX volume: ${sfxVolume}%`}
            className="w-full"
          />
          <span className="text-xs font-bold text-[#000000] w-10 text-right" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {sfxVolume}%
          </span>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-4`}>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Music volume
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => onSetMusicVolume(parseInt(e.target.value, 10))}
            aria-label={`Music volume: ${musicVolume}%`}
            className="w-full"
          />
          <span className="text-xs font-bold text-[#000000] w-10 text-right" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {musicVolume}%
          </span>
        </div>
        <p className="text-[11px] italic text-[#4a4438] px-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
          No soundtrack is loaded yet: this slider is wired and ready for when one is.
        </p>
        <div className={`${paper} p-4`}>
          <div
            className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mb-2"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Credits
          </div>
          <div className="text-sm leading-relaxed text-[#4a4438]" style={{ fontFamily: "'Courier Prime', monospace" }}>
            <p>Design, writing, and development: Craig Doyle</p>
            <p className="mt-2 italic">Music: three themes planned (menu, IGHQ, CINCPAC), not yet composed. See the volume note above.</p>
            <p className="mt-4 italic">
              Every decision here is drawn from an actual historical record or a reasoned
              extension of one, argued by the people who actually argued it.
            </p>
          </div>
        </div>
          </div>
        )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Approximate rank/title for advisor attribution — general wartime rank/role, not
// checked against the specific date of each individual quote (several of these
// officers were promoted during the war, e.g. Nimitz to Fleet Admiral in Dec 1944,
// Spruance between Vice Admiral and Admiral). Treat as reasonable, not verified per
// instance, before relying on it for a specific node's historical precision.
const ADVISOR_TITLE = {
  Nimitz: "Adm.", King: "Adm.", Spruance: "Adm.",
  MacArthur: "Gen.", Marshall: "Gen.", Stilwell: "Gen.",
  Yamamoto: "Adm.", Nagano: "Adm.", Ugaki: "Adm.", Toyoda: "Adm.", Yonai: "Adm.",
  Tojo: "Gen.", Sugiyama: "Gen.", Umezu: "Gen.",
  Togo: "F.M.", // Shigenori Togo, Foreign Minister (see ADVISOR_TITLE_BY_DATE)
  // Extended this session — the same 62 advisors quoted throughout the file had no
  // title mapping at all, rendering as bare surnames while these 15 got proper rank
  // prefixes, an inconsistency of omission rather than editorial choice. Same standard
  // as above: reasonable general-period titles, not individually verified against the
  // exact date of every quote.
  Halsey: "Adm.", Fletcher: "Adm.", Ghormley: "Adm.", Mitscher: "Adm.", Pye: "Adm.",
  Lockwood: "Adm.", "Holland Smith": "Gen.", Kenney: "Gen.", Arnold: "Gen.",
  Eichelberger: "Gen.", Wainwright: "Gen.", LeMay: "Gen.", Doolittle: "Gen.",
  Groves: "Gen.", Layton: "Capt.",
  Kido: "Marquis", // Lord Keeper of the Privy Seal, not a military rank
  Konoe: "P.M.", Suzuki: "P.M.", Matsuoka: "F.M.", Anami: "Gen.", Terauchi: "F.M.",
  Kuribayashi: "Gen.", Kurita: "Adm.", Kusaka: "Adm.", Nagumo: "Adm.", Nomura: "Adm.",
  Onishi: "Adm.", Ozawa: "Adm.", Tanaka: "Adm.", Kawabe: "Gen.", Horii: "Gen.",
  Iida: "Gen.", Imamura: "Gen.", Inoue: "Adm.", Koga: "Adm.", Sakurai: "Gen.",
  Ariizumi: "Capt.",
  Sato: "Amb.", // Naotake Sato, wartime ambassador to Moscow
  Roosevelt: "Pres.", Truman: "Pres.", Churchill: "P.M.", Attlee: "P.M.",
  Curtin: "P.M.", Osmeña: "Pres.",
  Stimson: "Sec.", Hull: "Sec.", Knox: "Sec.", McCloy: "Sec.", Biddle: "A.G.",
  Acheson: "Mr.", Davies: "Mr.", Hurley: "Amb.", Grew: "Amb.",
  Kistiakowsky: "Dr.", Franck: "Dr.", Compton: "Dr.",
  Webb: "Justice", // Sir William Webb, president of the Tokyo Tribunal
  Slim: "Gen.", Blamey: "Gen.",
};
// Titles that depend on the month: [from, until, title], year-month. An empty title means the person held no post worth naming then.
const ADVISOR_TITLE_BY_DATE = {
  Togo: [["1941-10", "1942-09", "F.M."], ["1942-10", "1945-03", ""], ["1945-04", "1945-08", "F.M."], ["1945-09", "1950-12", ""]], // Foreign Minister, twice
  Terauchi: [["1900-01", "1943-05", "Gen."], ["1943-06", "1946-12", "F.M."]], // Field Marshal from June 1943
  Hull: [["1933-03", "1944-11", "Sec."], ["1944-12", "1950-12", ""]], // resigned as Secretary of State in November 1944
  Hurley: [["1940-01", "1944-10", "Gen."], ["1944-11", "1945-11", "Amb."]], // Ambassador to China from November 1944
  Grew: [["1932-06", "1941-12", "Amb."], ["1942-01", "1944-11", ""], ["1944-12", "1945-08", "Under Sec."]], // Under Secretary of State from December 1944
};
const ADVISOR_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** A node date ("SEPTEMBER 1940", "JUNE – JULY 1942", "1943 – 1944", "1945") as months since year 0: { start, end }, or null. */
function advisorDateRange(date) {
  if (typeof date !== "string") return null;
  const years = [...date.matchAll(/(19\d{2})/g)].map((m) => parseInt(m[1], 10));
  if (!years.length) return null;
  const months = [...date.toUpperCase().matchAll(/JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/g)].map((m) => ADVISOR_MONTHS.indexOf(m[0]));
  const start = years[0] * 12 + (months.length ? months[0] : 0);
  return { start, end: Math.max(start, years[years.length - 1] * 12 + (months.length ? months[months.length - 1] : 11)) };
}
const advisorYm = (s) => parseInt(s.slice(0, 4), 10) * 12 + parseInt(s.slice(5), 10) - 1;
function advisorAttribution(name, date) {
  let title = ADVISOR_TITLE[name];
  const dated = ADVISOR_TITLE_BY_DATE[name];
  const r = dated && advisorDateRange(date);
  if (r) {
    const hit = dated.find(([from, until]) => r.start <= advisorYm(until) && r.end >= advisorYm(from));
    if (hit) title = hit[2];
  }
  return title ? `${title} ${name}` : name;
}

function MeterBar({ label, value, danger }) {
  // Zero-centered diverging bar on the real -10..+10 clamp used throughout the
  // campaign logic. Rebuilt after the first version used <span> elements for the bar
  // track and fill — spans are display:inline by default, and inline elements ignore
  // explicit height entirely (plain CSS, not a Tailwind issue), which is why every
  // bar rendered as an undifferentiated black rectangle regardless of value. Using
  // <div> elements (block-level, height applies correctly) and two half-width flex
  // containers instead of absolute-position percentage math, which is more robust.
  const clamped = Math.max(-10, Math.min(10, value));
  const magnitude = Math.min(100, (Math.abs(clamped) / 10) * 100); // 0-100%, distance from zero
  const fillColor = danger ? "#7a2e2e" : "#000000";
  return (
    <div
      className="flex items-center gap-3 text-xs w-full"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      role="group"
      aria-label={`${label}: ${value > 0 ? `+${value}` : value}${danger ? ", warning threshold" : ""}`}
    >
      <div className="w-24 shrink-0 uppercase tracking-wider text-[#000000] font-semibold" aria-hidden="true">{label}</div>
      <div className="relative flex-1 h-4 border-2 border-black flex" aria-hidden="true">
        <div className="w-1/2 h-full flex justify-end overflow-hidden">
          {clamped < 0 && <div style={{ width: `${magnitude}%`, height: "100%", backgroundColor: fillColor }} />}
        </div>
        <div className="w-1/2 h-full flex justify-start overflow-hidden">
          {clamped > 0 && <div style={{ width: `${magnitude}%`, height: "100%", backgroundColor: fillColor }} />}
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 bg-black" style={{ width: "2px", marginLeft: "-1px" }} />
      </div>
      <div className="w-9 shrink-0 text-right font-bold" style={{ color: danger ? "#7a2e2e" : "#000000" }} aria-hidden="true">
        {value > 0 ? `+${value}` : value}
        {danger ? " ⚠" : ""}
      </div>
    </div>
  );
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS = MONTH_NAMES.map((m) => m.toUpperCase());

// Extract the latest 4-digit year from a date string (e.g. "JULY - NOVEMBER 1942", "1942 - 1943").
function yearFrom(text, fallback) {
  const years = String(text).match(/19\d\d/g);
  return years ? parseInt(years[years.length - 1], 10) : fallback;
}

// Resource-modulated probability: a meter in good shape nudges a contested roll toward the
// favorable outcome, capped at a ±10 percentage-point swing from the historical baseline —
// resource stewardship should matter at the margin without letting players "solve" genuinely
// disputed history. Always clamped to [5, 95] so no roll ever becomes a certainty.
function modWeight(base, meterVal, cap) {
  cap = cap || 10;
  const swing = Math.max(-cap, Math.min(cap, (meterVal || 0) * 2));
  return Math.max(5, Math.min(95, base + swing));
}

// ---------- PAPER WEAR SYSTEM ----------
// Three independent, stacking signals tied to the logistics triangle — never a single
// "worst meter" switch, so nothing flips abruptly when a different meter becomes the
// worst one. Severity caps at -5 on every axis: dragging a meter past -5 changes
// nothing further, so players don't need to bottom out a meter to see the full effect.
// Prototyped and tuned interactively before being wired in here — redaction in
// particular is deliberately light-touch (short/connector words are never touched) so
// this stays atmosphere, never a reading obstacle.
function wearTier(v) {
  // Calibrated against the meters' actual [-10, 10] clamp. Previously capped its own
  // input at -5, meaning everything from -5 down to the real floor at -10 rendered
  // identically — the same dead-zone problem the gate thresholds had before that got
  // fixed, just never revisited here after the clamp changed. Now spans the full range,
  // with a genuinely distinct catastrophic tier for the bottom of it rather than treating
  // "bad" and "as bad as this file can possibly get" the same.
  const c = Math.max(-10, v || 0);
  if (c >= 4) return 2; // strong
  if (c >= -1) return 1; // healthy/neutral
  if (c >= -4) return 0; // strained
  if (c >= -7) return -1; // severe
  return -2; // catastrophic, reached at -8 through the floor at -10
}

// Reflects the logistics triangle back into the prose itself, not just gates and warning
// boxes. Picks whichever single meter is currently furthest from healthy and returns one
// short, varied line for it — deliberately just one line, appended to the situation text,
// so it reads as a staff note woven into the report rather than a mechanical readout.
// A simple hash of the node id rotates which line is used so the same meter state doesn't
// always produce identical wording across different nodes in the same run.
const METER_FLAVOR = {
  readiness: {
    "-2": [
      "This force is no longer absorbing losses, it's simply recording them.",
      "Staff planning has stopped projecting readiness forward. There's nothing left to project.",
      "The gap between what's ordered and what's actually fieldable is now the whole report.",
    ],
    "-1": [
      "Casualty reports are arriving faster than replacements can be trained.",
      "Unit cohesion is fraying under sustained losses.",
      "Field commanders are reporting readiness gaps this staff hasn't planned around.",
    ],
    "0": [
      "Losses are running ahead of replacements.",
      "Readiness reports have been trending the wrong direction for weeks.",
    ],
    "2": [
      "Units report readiness above anything staff planning assumed at this stage.",
      "Morale and materiel are both running ahead of expectations.",
    ],
  },
  pipeline: {
    "-2": [
      "There is no pipeline left to describe, only what's already on hand and what isn't coming.",
      "Supply officers have stopped estimating shortfalls and started estimating how long the current stock lasts.",
      "Every allocation request now competes for tonnage that doesn't exist yet.",
    ],
    "-1": [
      "Convoys are arriving late and light, when they arrive at all.",
      "Fuel allocation requests are going unanswered further up the chain.",
      "Supply officers describe the current tonnage as unsustainable past this quarter.",
    ],
    "0": [
      "Supply officers are already flagging shortfalls down the line.",
      "Tonnage is arriving thinner than the operation was actually planned around.",
    ],
    "2": [
      "Tonnage is arriving ahead of every projection this staff drew up.",
      "Supply lines are running with a surplus nobody budgeted for.",
    ],
  },
  initiative: {
    "-2": [
      "This command isn't setting the pace or reacting to it anymore. It's simply absorbing what happens.",
      "There is no operational tempo left to describe as behind schedule. There is no schedule.",
    ],
    "-1": [
      "This command is reacting to events rather than setting their pace.",
      "The operational tempo has slipped well behind whatever timetable this started with.",
    ],
    "0": [
      "Operational tempo is slipping behind the timetable this staff set for itself.",
      "This command is a step behind events more often than it would like to admit.",
    ],
    "2": [
      "This command is dictating the tempo of this war, not answering someone else's.",
      "Every report from the field says the initiative is still firmly held.",
    ],
  },
};

function meterFlavorLine(meters, seed) {
  meters = meters || {};
  const entries = [
    ["readiness", meters.readiness],
    ["pipeline", meters.pipeline],
    ["initiative", meters.initiative],
  ];
  // Pick the single worst (most negative) or, failing that, most positive meter.
  let worst = null;
  for (const [name, val] of entries) {
    const t = wearTier(val || 0);
    if (t !== 1 && (worst === null || Math.abs(val || 0) > Math.abs(worst[1]))) {
      worst = [name, val || 0, t];
    }
  }
  if (!worst) return ""; // everything healthy — no flavor line needed
  const [name, , tier] = worst;
  const lines = METER_FLAVOR[name][String(tier)];
  if (!lines) return "";
  let hash = 0;
  for (let i = 0; i < String(seed).length; i++) hash = (hash * 31 + String(seed).charCodeAt(i)) >>> 0;
  return lines[hash % lines.length];
}

function redactText(text, frac) {
  if (!frac) return text;
  const words = text.split(" ");
  return words
    .map((w, i) => {
      if (w.replace(/[^a-zA-Z]/g, "").length < 5) return w; // never redact short/connector words
      const seed = (i * 37 + w.length * 13) % 100;
      return seed < frac * 100 ? "█".repeat(Math.max(2, w.length - 1)) : w;
    })
    .join(" ");
}

function readinessRedactFrac(readiness) {
  const rt = wearTier(readiness);
  return rt === 2 ? 0 : rt === 1 ? 0 : rt === 0 ? 0.045 : rt === -1 ? 0.13 : 0.24;
}

function PaperWear({ meters }) {
  const rt = wearTier(meters.readiness);
  const pt = wearTier(meters.pipeline);
  const it = wearTier(meters.initiative);
  const stainOpacity = pt === 2 ? 0 : pt === 1 ? 0 : pt === 0 ? 0.55 : pt === -1 ? 0.85 : 1;
  return (
    <>
      {pt <= 0 && (
        <>
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 55, left: 30, width: 130, height: 100,
              background: "radial-gradient(circle, rgba(101,74,32,0.4) 0%, rgba(101,74,32,0.22) 42%, rgba(101,74,32,0) 74%)",
              mixBlendMode: "multiply", opacity: stainOpacity,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 200, right: 10, width: 150, height: 115,
              background: "radial-gradient(circle, rgba(101,74,32,0.4) 0%, rgba(101,74,32,0.22) 42%, rgba(101,74,32,0) 74%)",
              mixBlendMode: "multiply", opacity: stainOpacity * 0.9,
            }}
          />
        </>
      )}
      {pt <= -1 && (
        <>
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              bottom: 40, left: 40, width: 160, height: 120,
              background: "radial-gradient(circle, rgba(101,74,32,0.4) 0%, rgba(101,74,32,0.22) 42%, rgba(101,74,32,0) 74%)",
              mixBlendMode: "multiply", opacity: stainOpacity,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 130, left: 130, width: 100, height: 90,
              background: "radial-gradient(circle, rgba(101,74,32,0.4) 0%, rgba(101,74,32,0.22) 42%, rgba(101,74,32,0) 74%)",
              mixBlendMode: "multiply", opacity: stainOpacity * 0.8,
            }}
          />
        </>
      )}
      {rt <= -1 && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: 90, right: 18, transform: "rotate(-6deg)",
            fontFamily: "'Courier Prime', monospace", fontStyle: "italic",
            fontSize: 13, color: "#7a2e2e", opacity: 0.8, maxWidth: 110, lineHeight: 1.2,
          }}
        >
          check losses,<br />unsustainable?
        </div>
      )}
      {rt <= -2 && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: 0, width: 0, height: 0,
            borderStyle: "solid", borderWidth: "38px 38px 0 0",
            borderColor: "#d8cba4 transparent transparent transparent",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      )}
      {it <= -1 && (
        <div className="absolute pointer-events-none" style={{ top: -10, left: 30, width: 26, transform: "rotate(-8deg)" }}>
          <svg viewBox="0 0 26 46" width="26" height="46">
            <path d="M8 4 L8 34 A5 5 0 0 0 18 34 L18 10 A3 3 0 0 0 12 10 L12 30" fill="none" stroke="#8a8478" strokeWidth="2.5" />
          </svg>
        </div>
      )}
      {it <= -1 && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0, right: 0, width: 0, height: 0,
            borderStyle: "solid", borderWidth: "0 0 46px 46px",
            borderColor: "transparent transparent #d8cba4 transparent",
            boxShadow: "-2px -2px 6px rgba(0,0,0,0.15)",
          }}
        />
      )}
    </>
  );
}

function filingStampRotation(initiative) {
  const it = wearTier(initiative);
  return it >= 2 ? 0 : it === 1 ? -2 : it === 0 ? -6 : -12;
}

function filingStatusNote(initiative) {
  const it = wearTier(initiative);
  return it >= 1 ? "" : it === 0 ? " · filed with minor delay" : " · filed late, out of sequence";
}

// Independent of meters entirely — tied to the in-game year. Japan's actual wartime
// paper stock visibly degraded as the war went on; this is a slow background signal
// that reads on every report regardless of how any single campaign is going.
function seasonalPaperFilter(year) {
  const y = Math.max(1941, Math.min(1945, year || 1941));
  const t = (y - 1941) / 4; // 0 at the war's start, 1 by 1945
  const saturate = 1 - t * 0.22;
  const contrast = 1 - t * 0.07;
  const brightness = 1 - t * 0.05;
  return `saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
}

function SeasonalGrain({ year }) {
  const y = Math.max(1941, Math.min(1945, year || 1941));
  const t = (y - 1941) / 4;
  if (t <= 0) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: t * 0.16,
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.5) 0.5px, transparent 0.5px), radial-gradient(circle at 60% 70%, rgba(0,0,0,0.5) 0.5px, transparent 0.5px), radial-gradient(circle at 85% 15%, rgba(0,0,0,0.5) 0.5px, transparent 0.5px)",
        backgroundSize: "6px 6px, 9px 9px, 7px 7px",
        mixBlendMode: "multiply",
      }}
    />
  );
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

// ---------- PACIFIC THEATER SITUATION BOARD (abstract, theater-grouped — not a geographic map) ----------

// Currently unused — no component in this file reads THEATERS. Also incomplete even on
// its own terms: missing palau, pearlHarbor, midway, attu, and sovietFarEast (5 of the
// ~24 real MAP_REGIONS entries), including one added well after this list was written.
// Flagged rather than silently completed or removed, since it's unclear whether this
// was meant to be wired into a future "jump to theater" navigation feature or is safe
// to delete — matches the same "flag, don't silently fix dead code" pattern used
// elsewhere in this file (see the iron-mode notes).
const THEATERS = [
  { label: "HOME WATERS", lines: ["HOME WATERS"], ids: ["japan", "formosa", "okinawa"] },
  { label: "NORTHEAST ASIA", lines: ["NORTHEAST ASIA"], ids: ["china", "manchuria"] },
  { label: "SOUTHEAST ASIA & CBI", lines: ["SOUTHEAST ASIA", "& CBI"], ids: ["indochina", "thailand", "burma", "india"] },
  { label: "MARITIME SOUTHEAST ASIA", lines: ["MARITIME S.E. ASIA"], ids: ["malaya", "indies", "philippines"] },
  { label: "SOUTHWEST PACIFIC", lines: ["SOUTHWEST PACIFIC"], ids: ["newGuinea", "solomons", "australia"] },
  { label: "CENTRAL PACIFIC", lines: ["CENTRAL PACIFIC"], ids: ["gilberts", "marshalls", "marianas", "iwoJima"] },
];

// Used to be x/y too (real equirectangular-projection positions, not schematic
// guesses — same projection: scaleX≈7.15, scaleY≈7.19, origin 79°E/53°N). Superseded by
// PacificMap's real coastline/border geometry (assets/maps/pacific-regions.json, built
// by tools/build_pacific_map_geometry.py from Natural Earth data): 17 of these 24 ids
// now render as real country-shaped polygons, with a label/edge-anchor point computed
// from that real geometry (the polygon's own area-weighted centroid) rather than a
// hand-placed guess; the other 7 — kind: "pin" below — have no clean modern
// country-level polygon (Manchuria isn't a country any more, Okinawa/Iwo Jima are
// sub-national Japanese territory, Pearl Harbor/Midway/Attu are small features a
// country-outline dataset doesn't resolve) and stay as status-colored discs, same as
// every region used to be, just now positioned by real verified lat/long instead of a
// schematic guess — see PIN_SOURCES in that same build script for the coordinates.
const MAP_REGIONS = [
  { id: "japan", name: "Japan", kind: "polygon" },
  { id: "formosa", name: "Formosa", kind: "polygon" },
  { id: "okinawa", name: "Okinawa", kind: "pin" },
  { id: "china", name: "China", kind: "polygon" },
  { id: "manchuria", name: "Manchuria", kind: "pin" },
  { id: "indochina", name: "Indochina", kind: "polygon" },
  { id: "thailand", name: "Thailand", kind: "polygon" },
  { id: "burma", name: "Burma", kind: "polygon" },
  { id: "india", name: "India", kind: "polygon" },
  { id: "malaya", name: "Malaya", kind: "polygon" },
  { id: "indies", name: "Dutch E. Indies", kind: "polygon" },
  { id: "philippines", name: "Philippines", kind: "polygon" },
  { id: "newGuinea", name: "New Guinea", kind: "polygon" },
  { id: "solomons", name: "Solomons", kind: "polygon" },
  { id: "australia", name: "Australia", kind: "polygon" },
  { id: "gilberts", name: "Gilberts", kind: "polygon" },
  { id: "marshalls", name: "Marshalls", kind: "polygon" },
  { id: "marianas", name: "Marianas", kind: "polygon" },
  { id: "iwoJima", name: "Iwo Jima", kind: "pin" },
  { id: "pearlHarbor", name: "Pearl Harbor", kind: "pin" },
  { id: "midway", name: "Midway", kind: "pin" },
  { id: "attu", name: "Attu / Aleutians", kind: "pin" },
  { id: "sovietFarEast", name: "Vladivostok", kind: "pin" },
  { id: "palau", name: "Palau", kind: "polygon" },
];

// Circa-1940 population, driving node size. Two figures verified by search this
// project (Formosa ≈35,800 km² land / Philippines ≈300,000 km² land were the
// land-area figures checked earlier; population figures below for China, India,
// Japan, Indies, Thailand, Philippines, Burma, Indochina, and Australia came from a
// checked circa-1939/40 population table). Palau added later, also checked by
// search: by 1941 the Japanese South Seas Mandate population there was roughly
// 24,000 settlers against about 6,000 native Palauans, a real, documented ~4:1
// ratio — total below reflects that combined figure. The rest — small islands,
// outposts, and Vladivostok — are documented general-knowledge figures, not
// individually re-searched. china/india use whole-country totals standing in for a
// theater within them, a real scale mismatch worth knowing about, not hidden.
const POPULATION = {
  attu: 45, midway: 200, pearlHarbor: 500, iwoJima: 1100, palau: 30000, marshalls: 12000, gilberts: 32000,
  solomons: 120000, marianas: 130000, sovietFarEast: 206000, okinawa: 574000, newGuinea: 1500000,
  malaya: 4300000, formosa: 5870000, australia: 7100000, burma: 15500000, philippines: 16100000,
  thailand: 16400000, indochina: 24664000, manchuria: 43000000, indies: 68000000, japan: 73000000,
  india: 395000000, china: 500000000,
};

function sizeTier(id) {
  if (POPULATION[id] >= 200000000) return "massive"; // China, India — a real 5-7x gap over anything else here
  const rest = Object.entries(POPULATION).filter(([k]) => POPULATION[k] < 200000000).sort((a, b) => a[1] - b[1]).map((e) => e[0]);
  const idx = rest.indexOf(id);
  const third = Math.ceil(rest.length / 3);
  if (idx < third) return "small";
  if (idx < third * 2) return "medium";
  return "large";
}
// Australia's population genuinely lands it at "medium," but a continent reading as a
// small dot next to countries a fraction of its landmass looked wrong regardless of
// what the population figure says — a disclosed exception, not a data change.
const SIZE_OVERRIDE = { australia: "large" };
function tierFor(id) { return SIZE_OVERRIDE[id] || sizeTier(id); }
function mapRadiusFor(tier) { return tier === "massive" ? 38 : tier === "large" ? 22 : tier === "medium" ? 15 : 10; }

// Schematic connectivity graph, not real historical convoy routes — a plausible
// network, classified land vs. sea by whether the two regions actually share a land
// border. sovietFarEast's two edges tie directly to the five Kantokuen/Soviet nodes.
const MAP_EDGES = [
  ["manchuria", "china", "land"], ["china", "japan", "water"], ["japan", "formosa", "water"], ["formosa", "china", "water"],
  ["formosa", "okinawa", "water"], ["okinawa", "japan", "water"], ["china", "indochina", "land"], ["indochina", "thailand", "land"],
  ["thailand", "burma", "land"], ["burma", "india", "land"], ["indochina", "malaya", "land"], ["malaya", "indies", "water"],
  ["indies", "philippines", "water"], ["philippines", "formosa", "water"], ["philippines", "newGuinea", "water"],
  ["newGuinea", "solomons", "water"], ["solomons", "australia", "water"], ["japan", "iwoJima", "water"], ["iwoJima", "marianas", "water"],
  ["marianas", "marshalls", "water"], ["marshalls", "gilberts", "water"], ["gilberts", "solomons", "water"], ["marianas", "philippines", "water"],
  ["japan", "attu", "water"], ["pearlHarbor", "midway", "water"], ["midway", "marianas", "water"], ["pearlHarbor", "solomons", "water"],
  ["sovietFarEast", "manchuria", "land"], ["sovietFarEast", "japan", "water"],
  ["philippines", "palau", "water"], ["palau", "newGuinea", "water"],
];

// A route only functions for a side if both ends are actually held (or safely
// puppet-held) by that side; mixed control or either end contested severs it.
function edgeViability(statusA, statusB) {
  const axisSide = (s) => s === "axis" || s === "axisAllied";
  const alliedSide = (s) => s === "allied";
  if (axisSide(statusA) && axisSide(statusB)) return "axis";
  if (alliedSide(statusA) && alliedSide(statusB)) return "allied";
  return "severed";
}

const STATUS_COLORS = {
  axis: "#5c1a1a",
  axisAllied: "#a8562b",
  allied: "#28497a",
  neutral: "#a8a08c",
  contested: "#c9a227",
};

const STATUS_LABELS = {
  axis: "Japanese-controlled",
  axisAllied: "Japanese puppet / occupied ally",
  allied: "Allied-controlled / liberated",
  neutral: "Neutral / not yet contested",
  contested: "Contested",
};

const MAP_YEAR_STATUS = {
  1940: {
    japan: "axis", formosa: "axis", okinawa: "axis", manchuria: "axis",
    china: "contested", indochina: "neutral", thailand: "neutral", burma: "neutral", india: "allied",
    malaya: "neutral", indies: "neutral", philippines: "neutral",
    newGuinea: "neutral", solomons: "neutral", australia: "allied",
    gilberts: "neutral", marshalls: "axis", marianas: "axis", iwoJima: "axis", palau: "axis",
    pearlHarbor: "allied", midway: "allied", attu: "neutral", sovietFarEast: "neutral",
  },
  1941: {
    japan: "axis", formosa: "axis", okinawa: "axis", manchuria: "axis",
    china: "contested", indochina: "axis", thailand: "axisAllied", burma: "neutral", india: "allied",
    malaya: "contested", indies: "neutral", philippines: "contested",
    newGuinea: "neutral", solomons: "neutral", australia: "allied",
    gilberts: "contested", marshalls: "axis", marianas: "axis", iwoJima: "axis", palau: "axis",
    pearlHarbor: "allied", midway: "allied", attu: "neutral", sovietFarEast: "neutral",
  },
  1942: {
    japan: "axis", formosa: "axis", okinawa: "axis", manchuria: "axis",
    china: "contested", indochina: "axis", thailand: "axisAllied", burma: "axis", india: "allied",
    malaya: "axis", indies: "axis", philippines: "axis",
    newGuinea: "contested", solomons: "contested", australia: "allied",
    gilberts: "axis", marshalls: "axis", marianas: "axis", iwoJima: "axis", palau: "axis",
    pearlHarbor: "allied", midway: "allied", attu: "axis", sovietFarEast: "neutral",
  },
  1943: {
    japan: "axis", formosa: "axis", okinawa: "axis", manchuria: "axis",
    china: "contested", indochina: "axis", thailand: "axisAllied", burma: "contested", india: "allied",
    malaya: "axis", indies: "axis", philippines: "axis",
    newGuinea: "contested", solomons: "contested", australia: "allied",
    gilberts: "contested", marshalls: "axis", marianas: "axis", iwoJima: "axis", palau: "axis",
    pearlHarbor: "allied", midway: "allied", attu: "allied", sovietFarEast: "neutral",
  },
  1944: {
    japan: "axis", formosa: "axis", okinawa: "axis", manchuria: "axis",
    china: "contested", indochina: "axis", thailand: "axisAllied", burma: "contested", india: "allied",
    malaya: "axis", indies: "axis", philippines: "contested",
    newGuinea: "allied", solomons: "allied", australia: "allied",
    // Palau: the real Peleliu/Angaur landings (Operation Stalemate II) happened
    // September–November 1944 — "contested" here reflects the actual historical
    // battle taking place within this year, not a clean axis/allied flip.
    gilberts: "allied", marshalls: "allied", marianas: "allied", iwoJima: "axis", palau: "contested",
    pearlHarbor: "allied", midway: "allied", attu: "allied", sovietFarEast: "neutral",
  },
  1945: {
    japan: "contested", formosa: "contested", okinawa: "allied", manchuria: "contested",
    china: "contested", indochina: "contested", thailand: "contested", burma: "allied", india: "allied",
    malaya: "contested", indies: "contested", philippines: "allied",
    newGuinea: "allied", solomons: "allied", australia: "allied",
    // Palau stays "contested" rather than flipping to "allied" even in the baseline —
    // a real, checked historical fact, not a simplification: Peleliu and Angaur were
    // captured, but the main island Babeldaob and the mandate capital at Koror, where
    // most of the population and the wider Japanese garrison actually was, were
    // bypassed and left isolated for the rest of the war, never formally retaken.
    gilberts: "allied", marshalls: "allied", marianas: "allied", iwoJima: "allied", palau: "contested",
    pearlHarbor: "allied", midway: "allied", attu: "allied", sovietFarEast: "allied",
  },
};

// Tier 2 — the map reads the run's own divergences. First-slice coverage: the major
// named forks this build currently has content for. Extend as more nodes are added.
function mapOverrides(year, flags, meters) {
  flags = flags || {};
  meters = meters || {};
  const o = {};
  const notes = [];
  const regionNotes = {}; // region id -> explanation text, for tap-to-explain on individual chits
  function set(region, status, note) {
    o[region] = status;
    if (note) {
      notes.push(note);
      regionNotes[region] = note;
    }
  }
  if (flags.openingVector === "southBlitz" && year === 1941) {
    set("philippines", "contested", "No Pearl Harbor strike on this path: the Pacific Fleet's battleships and carriers remain intact at Hawaii (projection).");
  }
  if (flags.midwayResult === "disaster" && year >= 1942) {
    if (year >= 1943) set("solomons", "allied", "Four Japanese fleet carriers and their veteran air crews were lost in a single morning at Midway: a loss the carrier air training pipeline never fully replaces.");
    else notes.push("Four Japanese fleet carriers and their veteran air crews were lost in a single morning at Midway: a loss the carrier air training pipeline never fully replaces.");
  }
  if (flags.midwayPath === "diverted" && year === 1942) {
    set("solomons", "contested", "The carrier force struck at the Australia supply line instead of Midway: an undefeated Japanese carrier fleet remains at large (projection).");
    set("australia", "allied", "The carrier force struck at the Australia supply line instead of Midway: an undefeated Japanese carrier fleet remains at large (projection).");
  }
  if (flags.midwayAlliedResult === "decisive" && year >= 1942) {
    notes.push("Midway's decisive result, as it happened: four Japanese fleet carriers destroyed for one American loss.");
  }
  if (flags.midwayAlliedPath === "conservative" && year === 1942) {
    notes.push("The Midway ambush was declined: Japan's carrier fleet sails home undefeated (projection).");
  }
  if (flags.leytePath === "abandonPhilippines" && year >= 1944) {
    set("philippines", "axis", "The Philippines were conceded without a fleet action at Leyte: the oil route from the Indies is cut months ahead of the historical timetable (projection).");
    set("indies", "contested", "The Philippines were conceded without a fleet action at Leyte: the oil route from the Indies is cut months ahead of the historical timetable (projection).");
  }
  if (flags.philippinesPath === "bypassFormosa" && year >= 1944) {
    set("philippines", "contested", "Formosa was seized in place of the Philippines: Filipino civilians remain under occupation through the war's final year (projection).");
    set("formosa", "contested", "Formosa was seized in place of the Philippines: Filipino civilians remain under occupation through the war's final year (projection).");
  }
  if (flags.endgamePath === "surrenderInquiry" && year === 1945)
    notes.push("A conditional surrender inquiry opened through neutral channels ahead of the historical timetable (projection).");
  if (flags.endgameAlliedPath === "blockade" && year === 1945) {
    set("japan", "contested", "Operation Downfall was set aside for naval encirclement and air blockade: no invasion of the home islands was attempted (projection).");
  }
  // Correctness fix, not just an enrichment: the 1945 baseline unconditionally shows Iwo
  // Jima as allied-controlled, which is true for the compressed/extended/fullSupport
  // branches (all of which are real invasions, just on different timelines or with
  // different naval-gunfire support) but false for "skipped" — King's real historical
  // argument, acted on here, means nobody lands on the island at all. Without this
  // override the map would show a location as captured that the game's own narrative
  // explicitly says was bypassed.
  if (flags.iwoJimaAlliedPath === "skipped" && year >= 1945) {
    set("iwoJima", "axis", "Iwo Jima was bypassed entirely rather than invaded: King's real argument that the island wasn't worth the cost, acted on here. Kuribayashi's tunnel network was never tested because nobody landed to test it.");
  }
  // Guadalcanal/Solomons: all three guadalcanalPath branches (commit, earlyWithdraw,
  // drumResupply) eventually route toward Japan losing the island — this matches the
  // real history and the baseline's own eventual 1944 shift to allied control, so most
  // of these don't need a status override, only notes for texture. The one genuine
  // timeline shift is earlyWithdraw, whose own outcome text says explicitly that
  // conceding early hands the Americans a forward airfield "months ahead of schedule" —
  // earlyPerimeter43 (the node this branch routes to) is dated 1943, not 1944, so the
  // map should reflect the region flipping a full year earlier on this specific branch.
  if (flags.guadalcanalPath === "earlyWithdraw" && year >= 1943) {
    set("solomons", "allied", "Guadalcanal was conceded early rather than fought over for six months: the perimeter falls back to Bougainville and Rabaul, handing American planners a forward airfield roughly a year ahead of the historical timetable (projection).");
  }
  if (flags.guadalcanalNavalResult === "disaster" && year === 1942) {
    notes.push("The November 1942 naval battles for Guadalcanal went worse than history's own close-run version: reinforcement convoys caught with less warning, more of the destroyer force lost in a single week than the historical campaign's attrition rate.");
  }
  if (flags.guadalcanalPath === "drumResupply" && year === 1943) {
    notes.push("Destroyer resupply runs to Guadalcanal were abandoned entirely in favor of improvised drum-floats, a real historical method: the garrison held on at the barest possible margin before the eventual withdrawal.");
  }
  // Kantokuen/Siberia: the single largest territorial divergence this game models —
  // Japan invading the Soviet Far East instead of, or in addition to, the Southern
  // Operation — had zero map representation before this pass, despite being a real,
  // years-long alternate front with its own full node cluster
  // (hokushinDebate41 -> kantokuenOffensive41 -> siberianReckoning42 -> twoFrontStrain44
  // -> kantokuenFinalWord46). sovietFarEast is "neutral" in the baseline for every year
  // except 1945 (the real Soviet declaration of war) — on this branch it should show
  // Japan actually crossing into and fighting over that territory years earlier.
  if (flags.hokushinPath === "north" && year === 1941) {
    set("sovietFarEast", "contested", "The Kwantung Army crosses into Soviet territory instead of standing Kantokuen down: the single largest departure from the historical record this whole counterfactual makes (projection).");
  }
  if (flags.siberianPath === "holdGains" && year >= 1942) {
    set("sovietFarEast", "axis", "Japan dug in to hold its Siberian gains through the winter rather than withdraw: a real, ongoing second front against the Soviet Union, fought alongside the war against America and Britain (projection).");
  }
  if (flags.siberianPath === "pressWest" && year >= 1942) {
    set("sovietFarEast", "axis", "The Kwantung Army pressed west toward a Trans-Siberian rail link-up with German forces, a real Axis war aim (per Ribbentrop's own July 1941 telegram) neither side's actual logistics could reach: the deepest push into Soviet territory this counterfactual makes (projection).");
  }
  if (flags.siberianPath === "withdraw" && year >= 1942) {
    set("sovietFarEast", "neutral", "The Kwantung Army withdrew back to the original Manchurian border after a single hard winter: the gamble conceded without the underlying argument for it ever being conceded (projection).");
  }
  // China: the baseline holds China flat at "contested" every year regardless of what
  // actually happens there, but this game models a real, well-documented divergence —
  // a fully-resourced Ichi-Go (mainlandPath, japan side) creates "the largest
  // contiguous Japanese-held territory of the entire war" per ichiGoTriumph44's own
  // text, a real overland corridor from Manchuria to French Indochina, larger than the
  // historical partial version. All three mainlandPath values (both/ichiGoOnly/
  // bothResourced) achieve this same stronger-than-historical Ichi-Go — the difference
  // between them is what happens to the Burma front (U-Go), not to China itself.
  if (flags.mainlandPath && year >= 1944) {
    set("china", "axis", "A fully-resourced Ichi-Go offensive creates the largest contiguous Japanese-held territory of the entire war: an overland corridor from Manchuria to French Indochina, larger than the historical partial version (projection).");
  }
  // Allied-side China: chinaCrisisResult reflects whether material support to
  // Communist forces actually blunted Ichi-Go's advance or arrived too late to matter.
  if (flags.chinaCrisisResult === "blunted" && year >= 1944) {
    set("china", "contested", "Material support reaching Communist forces in the north blunts, though doesn't stop, Ichi-Go's advance: real pressure on Japanese supply lines that slows the offensive below its historical scale (projection).");
  }
  if (flags.chinaCrisisResult === "tooLittle" && year >= 1944) {
    set("china", "axis", "Material support to Communist forces arrives too late and too thin to meaningfully change a five-hundred-thousand-man offensive's trajectory: Ichi-Go succeeds largely as it did historically (projection).");
  }
  // Burma: rangoonAlliedPath/rangoonDefendResult and overlandPath are deliberately
  // notes-only, not status overrides — both nodes' own situation text says the
  // territorial outcome (Rangoon falls in 1942, Burma is reconquered by 1945) happens
  // regardless of the choice made. A color override here would misrepresent what the
  // game's own narrative says is actually contested: cost and timing, not control.
  if (flags.rangoonAlliedPath === "defend" && flags.rangoonDefendResult === "worthIt" && year === 1942) {
    notes.push("The Chinese divisions committed to Rangoon's defense bought real extra weeks before the city fell, letting more of the wider Burma garrison reach India intact than the historical retreat managed.");
  }
  if (flags.rangoonAlliedPath === "defend" && flags.rangoonDefendResult === "wasted" && year === 1942) {
    notes.push("Rangoon fell on very nearly the historical timetable regardless: the Chinese divisions committed to its defense were mauled holding a city British planning had already written off.");
  }
  if (flags.overlandPath === "ledoRoad" && year === 1945) {
    notes.push("The Ledo Road reached China in early 1945, a genuine engineering achievement, though one that arrived so late its actual strategic contribution was modest against the Hump airlift's own tonnage.");
  }
  // Australia: the baseline hardcodes "allied" every year, correct for every branch
  // except one — the japan-side Australia invasion thread's "beachhead" result, whose
  // own outcome text says Japanese troops hold a strip of coastline for "several
  // weeks" before it's overrun. Year-level granularity can't represent "several weeks"
  // precisely, but showing 1942 specifically as contested (not extending further,
  // since the text is explicit the beachhead doesn't last) is the closer approximation
  // — the alternative, leaving Australia "allied" throughout, would flatly contradict
  // this branch's own established outcome.
  if (flags.australiaResult === "beachhead" && year === 1942) {
    set("australia", "contested", "A Japanese beachhead near Darwin holds for several weeks before Allied forces overrun it: a real, if temporary, foothold no supply line could have sustained indefinitely (projection).");
  }
  if (flags.australiaResult === "disaster" && year === 1942) {
    notes.push("A Japanese landing attempt near Darwin fails before establishing anything: escort thinned past the point of covering the transports, the operation collapsing before it could commit.");
  }
  // Palau region added since this note was first written — see MAP_REGIONS,
  // POPULATION, MAP_EDGES, and MAP_YEAR_STATUS above for the new territory itself.
  // peleliuPath === "cancelled" means "the Palaus garrison... stays exactly where it
  // is, bypassed" — nobody ever lands, so unlike the baseline (which shows "contested"
  // for 1944–1945, reflecting the real historical Peleliu/Angaur landings), this
  // branch should show the region staying "axis" straight through, since neither
  // Peleliu nor any part of Palau is ever invaded on this path.
  if (flags.peleliuPath === "cancelled" && year >= 1944) {
    set("palau", "axis", "Halsey's recommendation to cancel the landing is acted on: the roughly 10,900-man Japanese garrison across the Palaus is never invaded at all, bypassed and left to wither without supply or reinforcement, unlike the historical Peleliu/Angaur landings this projection replaces.");
  }
  // ironBottomPath (the accelerated-Iwo-Jima consequence of Peleliu's cancellation) DOES
  // map cleanly onto the existing iwoJima region, since it's a timing shift on a place
  // already on the map. Both accelerated outcomes (success/costly) end with the same
  // territorial result — Japan loses the island — just months ahead of the historical
  // February 1945 date and at different cost; only "held" (Nimitz's caution) keeps the
  // original historical timetable, which already matches the baseline.
  if (flags.ironBottomPath === "accelerated" && flags.ironBottomResult === "success" && year === 1944) {
    set("iwoJima", "allied", "Iwo Jima is taken months ahead of the historical February 1945 date, using the divisions freed by Peleliu's cancellation while the garrison's tunnel network is still unfinished (projection).");
  }
  if (flags.ironBottomPath === "accelerated" && flags.ironBottomResult === "costly" && year === 1944) {
    set("iwoJima", "allied", "Iwo Jima is taken months ahead of the historical February 1945 date, but at close to the same cost as the historical assault: the reasons the original timetable waited turn out to have been real ones (projection).");
  }
  return { o, notes, regionNotes };
}

// ---------- MAP: NODE-TO-REGION CONTEXT ----------
// Which theater a given briefing node is actually about, so the map can highlight the
// region under discussion instead of presenting every territory at equal visual weight.
// Deliberately a partial list — only nodes with an unambiguous single-region focus are
// included; nodes about doctrine, personnel, or multi-theater strategy are left unmapped
// rather than forced into a misleading highlight.
const NODE_REGION_HINTS = {
  // Added in this pass — each checked against title/context, and the less-obvious
  // ones (Ichi-Go, Doolittle airmen, Typhoon Cobra) verified against real sources
  // rather than guessed from the title alone. Deliberately NOT exhaustive: nodes about
  // Washington/Tokyo policy decisions with no single theater (Tripartite Pact, the Hull
  // Note, Casablanca, Tehran, internment, Pacific-First doctrine debates) are left
  // unhinted on purpose — forcing a region onto a node that isn't about one would be
  // the same dishonesty flagged earlier about inventing addressee data.
  chinaPeaceQuestion40: ["china"],
  hokushinDebate41: ["manchuria", "sovietFarEast"],
  doolittleAirmen42: ["china"], // verified: captured crews came down in Zhejiang/Jiangxi
  coralSea42: ["newGuinea"], // Port Moresby is the actual objective in this node
  keGoWithdrawal43: ["solomons"], // Ke-Go was the Guadalcanal evacuation
  yamamotoDeath43: ["solomons"], // shot down over Bougainville
  ichiGoTriumph44: ["china"], // verified: fought across Henan/Hunan/Guangxi
  kantokuenFinalWord46: ["manchuria", "sovietFarEast"],
  curtinsTurn42: ["australia"], // Curtin was Australia's wartime PM
  coralSeaMidwayAllied42: ["midway"], // despite the id, this node's title and content are about Midway itself (Station HYPO, Yorktown's 72-hour repair), not Coral Sea/Port Moresby — the prior hint here ("newGuinea") and the comment claiming "Midway itself has no MAP_REGIONS entry" were both stale; midway has had its own MAP_REGIONS entry all along
  bismarckSea43: ["newGuinea"], // convoy destroyed en route to Lae
  halseyTyphoon44: ["philippines"], // verified: 300mi east of the Philippines, supporting the Leyte invasion
  halseyAftermath44: ["philippines"],
  yamamotoIntercept43: ["solomons"], // intercepted near Bougainville
  yamamotoSurvives43: ["pearlHarbor"], // CINCPAC staff-level policy question, not tied to a battle location
  stilwellUltimatum44: ["china"],
  stilwellPreserved44: ["china"],
  hiroshima45: ["japan"],
  kyotoTargetDebate45: ["japan"],
  kyotoStruck45: ["japan"],
  nagasaki45: ["japan"],
  nagasakiDelayed45: ["japan"],
  radiationDisclosure45: ["japan"],
  peleliuDecision44: ["palau"],
  peleliuForcesRedirected44: ["palau"],
  pearlHarbor41: ["pearlHarbor"],
  midway42: ["midway"],
  attu43: ["attu"],
  kokodaTrail42: ["newGuinea"],
  kokodaTrailAllied42: ["newGuinea"],
  guadalcanal42: ["solomons"],
  guadalcanalAllied42: ["solomons"],
  earlyPerimeter43: ["solomons"],
  australiaLanding42: ["australia"],
  wakeIslandRelief41: ["marshalls"],
  burmaRangoon42: ["burma"],
  rangoonRetreatAllied42: ["burma"],
  burmaReconquest45: ["burma"],
  overlandChina44: ["china"],
  chinaCrisisAllied44: ["china"],
  chinasWarAlone43: ["china"],
  britainsCalculus43: ["india", "burma"],
  japanUnopposed43: ["japan"],
  chinaCivilWarShadow43: ["china"],
  dutchExileCalculus44: ["indies"],
  warWithoutAmerica45: ["manchuria"],
  philippineSea44: ["marianas"],
  philippineSeaAllied44: ["marianas"],
  onishiKamikaze44: ["philippines"],
  leyteGulf44: ["philippines"],
  kuritaAtLeyte44: ["philippines"],
  leyteBeachheadAftermath44: ["philippines"],
  philippinesFormosaAllied44: ["philippines", "formosa"],
  quezonsSuccessor44: ["philippines"],
  corregidorEvacuation42: ["philippines"],
  macArthurTension44: ["philippines"],
  macArthurAftermath44: ["philippines"],
  iwoJima45: ["iwoJima"],
  iwoJimaAllied45: ["iwoJima"],
  okinawa45: ["okinawa"],
  okinawaAllied45: ["okinawa"],
  siberianReckoning42: ["manchuria", "sovietFarEast"],
  kantokuenOffensive41: ["manchuria", "sovietFarEast"],
  indochinaOccupation41: ["indochina"],
  centralPacificDrive43: ["gilberts", "marshalls"],
  theTarawaQuestion43: ["gilberts"],
  savoIslandReckoning42: ["solomons"],
  operationFsCulmination42: ["australia"],
  severSupplyLine42: ["australia"],
  unhinderedSouth42: ["indies", "malaya"],
  japanStrikesAgain42: ["indies", "malaya"],
  sovietHokkaido45: ["japan", "sovietFarEast"],
  newWorldOrder45: ["japan"],
  coldWarOpening48: ["japan"],
  aQuietEmpire45: ["indies", "malaya"],
};

// Real coastline/border/region geometry for PacificMap, fetched once and cached —
// built ahead of time by tools/build_pacific_map_geometry.py from Natural Earth data
// into assets/maps/pacific-regions.json (see that script's own header comment for the
// full account of what's a direct real-country match, what's a historical grouping of
// more than one modern country, and what's a status-colored disc rather than a
// polygon). Same fetch-and-cache pattern Dispatches 1940 uses for its own
// assets/maps/regions.json, for the same reason: this geometry never changes at
// runtime, so there's no reason to pay for or repeat the fetch/parse per mount.
let pacificRegionGeometryPromise = null;
function loadPacificRegionGeometry() {
  if (!pacificRegionGeometryPromise) {
    pacificRegionGeometryPromise = fetch("assets/maps/pacific-regions.json")
      .then((r) => r.json())
      .catch((e) => {
        pacificRegionGeometryPromise = null; // let the next mount retry rather than sticking on a failed fetch
        throw e;
      });
  }
  return pacificRegionGeometryPromise;
}

// Builds an SVG path "d" string from a set of already-projected [x,y] rings — the
// geometry JSON stores pixel coordinates directly (pre-projected at build time by the
// same script), so unlike 1940's regionPathD this needs no live lon/lat math, just the
// ring-to-path join.
function ringsPathD(rings) {
  return (rings || [])
    .map((ring) => (ring.length ? `M${ring[0][0]},${ring[0][1]} L${ring.map((p) => `${p[0]},${p[1]}`).join(" ")} Z` : ""))
    .filter(Boolean)
    .join(" ");
}

function PacificMap({ year, accent, flags, meters, nodeId }) {
  const maxYear = Math.max(1939, Math.min(1945, year));
  const [scrubYear, setScrubYear] = useState(maxYear);
  const clampedYear = Math.max(1939, Math.min(maxYear, scrubYear));
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [geometryFailed, setGeometryFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    loadPacificRegionGeometry()
      .then((g) => { if (!cancelled) setGeometry(g); })
      .catch(() => { if (!cancelled) setGeometryFailed(true); });
    return () => { cancelled = true; };
  }, []);
  const base = MAP_YEAR_STATUS[clampedYear] || MAP_YEAR_STATUS[1940];
  const { o, notes, regionNotes } = mapOverrides(clampedYear, flags, meters);
  const statuses = { ...base, ...o };
  const usedStatuses = [...new Set(Object.values(statuses))];
  const nameOf = (id) => (MAP_REGIONS.find((r) => r.id === id) || {}).name || id;
  const highlightRegions = (nodeId && NODE_REGION_HINTS[nodeId]) || [];
  // Labels flagged to render below the region instead of above, to keep the crowded
  // Japan/Formosa/Okinawa/Iwo Jima/Attu cluster legible — checked by actual pixel
  // distance during prototyping, not eyeballed.
  const LABEL_BELOW = { formosa: true, thailand: true, iwoJima: true, attu: true };

  const VBW = 960;
  const VBH = 650;

  const header = (
    <div
      className="text-[11px] uppercase tracking-widest text-[#000000] font-semibold mb-1 flex items-center justify-between flex-wrap gap-2"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <span>Pacific Situation · End of {clampedYear} · Theater Map</span>
      {maxYear > 1939 && (
        <span className="flex items-center gap-2 normal-case tracking-normal font-normal">
          <input
            type="range"
            min={1939}
            max={maxYear}
            value={clampedYear}
            onChange={(e) => { setScrubYear(Number(e.target.value)); setSelectedRegion(null); }}
            aria-label={`View year: ${clampedYear}`}
            className="w-28 sm:w-40 accent-current"
            style={{ accentColor: accent }}
          />
          {clampedYear !== maxYear && (
            <button
              onClick={() => setScrubYear(maxYear)}
              className="text-[10px] uppercase tracking-widest border px-2 py-[2px]"
              style={{ borderColor: accent, color: accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Back to {maxYear}
            </button>
          )}
        </span>
      )}
    </div>
  );

  // Real coastline geometry hasn't arrived (or failed to load) yet — the region label
  // points, polygon shapes, and pin positions below all come from it, so there's
  // nothing honest to draw without it. Fails safe to a plain loading/error state rather
  // than falling back to the old schematic dot positions, which would silently
  // contradict this map's own "real geography" framing.
  if (!geometry) {
    return (
      <div className="mb-2">
        {header}
        <div
          className="w-full border-[3px] flex items-center justify-center"
          style={{ background: "#e3d5ae", borderColor: "#3a2a18", aspectRatio: `${VBW} / ${VBH}` }}
        >
          <p className="text-[12px] text-[#3a2a18]" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {geometryFailed ? "Theater map unavailable this session." : "Loading theater map…"}
          </p>
        </div>
      </div>
    );
  }

  const regionById = {};
  MAP_REGIONS.forEach((r) => {
    const src = r.kind === "pin" ? geometry.pins[r.id] : geometry.regions[r.id];
    if (src) regionById[r.id] = { ...r, label: src.label, rings: src.rings };
  });

  return (
    <div className="mb-2">
      {header}
      <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full border-[3px]" style={{ background: "#e3d5ae", borderColor: "#3a2a18" }}>
        <defs>
          <pattern id="hexTexture" width="16" height="27.7" patternUnits="userSpaceOnUse">
            <path
              d="M8 0 L16 4.6 L16 13.85 L8 18.5 L0 13.85 L0 4.6 Z M8 18.5 L16 23.1 L16 27.7 M0 23.1 L8 18.5 M8 0 L8 -4.6"
              fill="none"
              stroke="#3a2a1830"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Ocean */}
        <rect x="0" y="0" width={VBW} height={VBH} fill="#e3d5ae" />
        <rect x="0" y="0" width={VBW} height={VBH} fill="url(#hexTexture)" opacity="0.25" />

        {/* Real coastlines/borders for every landmass in view that isn't itself one of
            this game's colorable regions: geographic context, not interactive. */}
        {geometry.backdrop.map((country) => (
          <path key={country.name} d={ringsPathD(country.rings)} fill="#d8cba8" stroke="#8a7a5c" strokeWidth="0.6" />
        ))}

        {/* Faint lat/long reference grid: also a real WWII navigational-chart convention */}
        {[100, 120, 140, 160, 180, 200].map((lon) => {
          const x = 40 + (lon - 79) * 7.15;
          return <line key={lon} x1={x} y1={0} x2={x} y2={VBH} stroke="#3a2a18" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.15" />;
        })}
        {[-20, 0, 20, 40].map((lat) => {
          const y = 30 + (53 - lat) * 7.19;
          return (
            <line
              key={lat}
              x1={0}
              y1={y}
              x2={VBW}
              y2={y}
              stroke="#3a2a18"
              strokeWidth={lat === 0 ? "0.75" : "0.5"}
              strokeDasharray={lat === 0 ? "" : "2 4"}
              opacity={lat === 0 ? "0.25" : "0.15"}
            />
          );
        })}

        {[
          [4, 4, 1, 1],
          [VBW - 4, 4, -1, 1],
          [4, VBH - 4, 1, -1],
          [VBW - 4, VBH - 4, -1, -1],
        ].map(([x, y, dx, dy], i) => (
          <path
            key={i}
            d={`M ${x} ${y + dy * 20} L ${x} ${y} L ${x + dx * 20} ${y}`}
            fill="none"
            stroke="#3a2a18"
            strokeWidth="3"
          />
        ))}

        {MAP_EDGES.map(([a, b, kind], i) => {
          const ra = regionById[a], rb = regionById[b];
          if (!ra || !rb) return null;
          const viability = edgeViability(statuses[a] || "neutral", statuses[b] || "neutral");
          const stroke = viability === "axis" ? "#5c1a1a" : viability === "allied" ? "#28497a" : "#5b6472";
          const opacity = viability === "severed" ? 0.35 : 0.75;
          return (
            <line
              key={i}
              x1={ra.label[0]} y1={ra.label[1]} x2={rb.label[0]} y2={rb.label[1]}
              stroke={stroke}
              strokeWidth={kind === "land" ? 2.5 : 2}
              strokeDasharray={kind === "water" ? "4 4" : ""}
              opacity={opacity}
            />
          );
        })}

        {/* The 17 regions with a real country-shaped polygon: status-colored fill,
            country border redrawn on top of the color so it stays legible. */}
        {MAP_REGIONS.filter((r) => r.kind === "polygon").map((region) => {
          const id = region.id;
          const reg = regionById[id];
          if (!reg) return null;
          const status = statuses[id] || "neutral";
          const isHighlighted = highlightRegions.includes(id);
          const hasNote = !!regionNotes[id];
          const d = ringsPathD(reg.rings);
          const [lx, ly] = reg.label;
          const labelBelow = LABEL_BELOW[id];
          const labelY = labelBelow ? ly + 16 : ly - 10;
          return (
            <g
              key={id}
              onClick={() => hasNote && setSelectedRegion(selectedRegion === id ? null : id)}
              onKeyDown={(e) => {
                if (hasNote && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
                  e.preventDefault();
                  setSelectedRegion(selectedRegion === id ? null : id);
                }
              }}
              style={{ cursor: hasNote ? "pointer" : "default" }}
              role={hasNote ? "button" : undefined}
              tabIndex={hasNote ? 0 : undefined}
              aria-label={hasNote ? `${nameOf(id)}: ${STATUS_LABELS[status]}. Tap for why.` : `${nameOf(id)}: ${STATUS_LABELS[status]}`}
            >
              <title>{`${nameOf(id)}: ${STATUS_LABELS[status]}${hasNote ? " (tap for why)" : ""}`}</title>
              <path d={d} fill={STATUS_COLORS[status]} fillOpacity="0.88" stroke="#241a10" strokeWidth="1" />
              {isHighlighted && <path d={d} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="6 3" />}
              <text
                x={lx} y={labelY}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#241a10"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {nameOf(id)}
              </text>
              {hasNote && <circle cx={lx + 12} cy={ly - 10} r="4" fill="#241a10" opacity="0.85" />}
            </g>
          );
        })}

        {/* The 7 regions with no clean modern-country polygon (see MAP_REGIONS'
            comment): same status-colored disc every region used to be, positioned by
            real verified lat/long over the real coastline backdrop instead of a
            schematic guess over blank paper. */}
        {MAP_REGIONS.filter((r) => r.kind === "pin").map((region) => {
          const id = region.id;
          const reg = regionById[id];
          if (!reg) return null;
          const status = statuses[id] || "neutral";
          const lightFill = status === "neutral" || status === "contested";
          const tier = tierFor(id);
          const r = mapRadiusFor(tier);
          const isHighlighted = highlightRegions.includes(id);
          const hasNote = !!regionNotes[id];
          const [x, y] = reg.label;
          const labelBelow = LABEL_BELOW[id];
          const labelY = labelBelow ? y + r + 12 : y - r - 6;
          return (
            <g
              key={id}
              onClick={() => hasNote && setSelectedRegion(selectedRegion === id ? null : id)}
              onKeyDown={(e) => {
                if (hasNote && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
                  e.preventDefault();
                  setSelectedRegion(selectedRegion === id ? null : id);
                }
              }}
              style={{ cursor: hasNote ? "pointer" : "default" }}
              role={hasNote ? "button" : undefined}
              tabIndex={hasNote ? 0 : undefined}
              aria-label={hasNote ? `${nameOf(id)}: ${STATUS_LABELS[status]}. Tap for why.` : `${nameOf(id)}: ${STATUS_LABELS[status]}`}
            >
              <title>{`${nameOf(id)}: ${STATUS_LABELS[status]}${hasNote ? " (tap for why)" : ""}`}</title>
              {isHighlighted && (
                <circle cx={x} cy={y} r={r + 5} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="6 3" />
              )}
              <circle cx={x} cy={y} r={r} fill={STATUS_COLORS[status]} stroke="#241a10" strokeWidth="1.5" />
              <text
                x={x} y={labelY}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#241a10"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {nameOf(id)}
              </text>
              {hasNote && <circle cx={x + r - 3} cy={y - r + 3} r="4" fill={lightFill ? "#241a10" : "#f0e6cc"} opacity="0.85" />}
            </g>
          );
        })}

        <rect x={VBW - 230} y={VBH - 56} width="216" height="42" fill="#e3d5ae" stroke="#3a2a18" strokeWidth="2" />
        <text x={VBW - 220} y={VBH - 40} fontSize="9" fontWeight="700" fill="#3a2a18" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          THEATER MAP
        </text>
        <text x={VBW - 220} y={VBH - 27} fontSize="8" fill="#3a2a18" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          REAL COASTLINES · SMALLER POINTS SIZED BY POPULATION
        </text>
      </svg>
      {selectedRegion && regionNotes[selectedRegion] && (
        <div
          className="mt-2 p-3 border-2 text-[12px] leading-relaxed"
          style={{ borderColor: accent, backgroundColor: "#f6efdf", fontFamily: "'Courier Prime', monospace" }}
        >
          <strong style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{nameOf(selectedRegion)}:</strong> {regionNotes[selectedRegion]}
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {usedStatuses.map((s) => (
          <div key={s} className="flex items-center gap-1 text-[11px] text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span
              className="inline-block w-3 h-3 border border-black"
              style={{ background: STATUS_COLORS[s] }}
            />
            {STATUS_LABELS[s]}
          </div>
        ))}
      </div>
      {notes.map((n, i) => (
        <p
          key={i}
          className="text-[11px] mt-1 text-[#000000] font-semibold border-l-4 pl-2"
          style={{ borderColor: accent || "#7a2e2e", fontFamily: "'Courier Prime', monospace" }}
        >
          ◈ {n}
        </p>
      ))}
    </div>
  );
}

function Typewriter({ text, instant, soundOn }) {
  const [shown, setShown] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) {
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
  }, [text, instant]);
  const done = shown >= text.length;
  return (
    <p
      onClick={() => setShown(text.length)}
      onKeyDown={(e) => {
        if (!done && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
          e.preventDefault();
          setShown(text.length);
        }
      }}
      role={done ? undefined : "button"}
      tabIndex={done ? undefined : 0}
      className="leading-relaxed mb-6 text-[16px] text-[#000000] cursor-pointer"
      style={{ fontFamily: "'Courier Prime', monospace", whiteSpace: "pre-line" }}
      title={done ? undefined : "Click to reveal instantly"}
      aria-label={text}
    >
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {!done && <span className="opacity-70">▌</span>}
      </span>
    </p>
  );
}

function cohesionLabel(c) {
  const v = c || 0;
  if (v >= 3) return "Solid";
  if (v >= 0) return "Workable";
  if (v >= -2) return "Strained";
  return "Fraying";
}

function BriefingScreen({ campaign, stage, nodeId, meters, flags, reportNumber, pastStages, hasSeenProjectedBadge, log, mode, favor, instantText, soundOn, onChoose, onRewind, onSave, onHome }) {
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | failed
  const iron = mode === "iron";
  const purge = mode === "fanatical";
  const coalition = mode === "coalition";
  const noRewind = iron || purge || coalition;
  const screenRef = useRef(null);
  useEffect(() => {
    // Move focus to the new briefing on every node change so screen reader users get a
    // clear signal that the screen advanced, instead of silently staying wherever the
    // previous "Choose" button was. tabIndex={-1} on the target makes it programmatically
    // focusable without adding it to the normal tab order.
    if (screenRef.current) screenRef.current.focus();
    // focus() alone only scrolls the minimum distance needed to bring the target into
    // view, which can leave the page mid-scroll if the previous stage's outcome text
    // was long enough that the player had scrolled well past the top to reach the
    // choice they picked. Scroll to the true top explicitly instead of relying on that.
    const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [stage.title]);
  useEffect(() => {
    const onKey = (e) => {
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= stage.choices.length) {
        const c = stage.choices[n - 1];
        if (!(iron && c.favor && c.favor > favor)) onChoose(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    if (!soundOn || !campaign.dynamic) return;
    playAmbientRumble(meters);
    if (noRewind && readinessRedactFrac(meters.readiness) > 0) {
      const t = setTimeout(() => playPaperRustle(), 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.title, soundOn]);
  const isHistorical = stage.historicalRecord !== false;
  const total = meters.readiness + meters.pipeline + meters.initiative;
  const warnings = [];
  if (campaign.dynamic) {
    if (meters.readiness <= -5)
      warnings.push("STAFF NOTE: Readiness has broken down. Units cannot absorb another major commitment.");
    else if (meters.readiness <= -3)
      warnings.push("STAFF NOTE: Readiness is running dangerously thin.");
    if (meters.pipeline <= -6)
      warnings.push("STAFF NOTE: The supply pipeline has collapsed. Offensive operations are no longer sustainable.");
    else if (meters.pipeline <= -4)
      warnings.push("STAFF NOTE: Pipeline integrity critically low. Further offensive options may be foreclosed.");
    if (total >= 3)
      warnings.push("STAFF NOTE: The force remains coherent. A sustained campaign may yet be within reach.");
  }
  const showReview = campaign.dynamic && reportNumber > 1 && (reportNumber - 1) % 4 === 0 && log.length > 0;
  const comparableSoFar = log.filter((e) => e.histSum != null);
  const matchedSoFar = comparableSoFar.filter((e) => e.isHistorical).length;
  const briefingYear = yearFrom(stage.date, 1941);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-center justify-center px-4 py-10">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="main"
        aria-label={`${stage.date}. ${stage.title}`}
        className={`${paper} w-full max-w-2xl p-6 sm:p-8 relative overflow-hidden`}
        style={{
          ...briefingMessageFormStyle(campaign.id, campaign.accent),
          filter: campaign.dynamic ? seasonalPaperFilter(briefingYear) : "none",
          outline: "none",
        }}
      >
        {campaign.dynamic && <SeasonalGrain year={briefingYear} />}
        {campaign.dynamic && <PaperWear meters={meters} />}
        {campaign.id === "japan" && (
          // Decorative only, matches JN-25 intercept-sheet texture from the reference
          // prototype. Deterministic from nodeId so it doesn't reshuffle on re-render,
          // not a real cipher and not meant to be read as one.
          <div
            className="text-[10px] tracking-[0.2em] mb-2 pb-2 border-b border-dashed border-black opacity-50"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {codeGroupStrip(nodeId)}
          </div>
        )}
        <div
          className="grid gap-0 mb-2 border-2 border-black text-[#000000]"
          style={{ gridTemplateColumns: campaign.id === "japan" ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr", fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <div className="px-2 py-1 border-r border-black">
            <div className="text-[7px] uppercase tracking-wide opacity-60 leading-none">
              {campaign.id === "japan" ? "Date (Shōwa / Western)" : "Precedence"}
            </div>
            <div className="text-[11px] font-semibold leading-tight" style={campaign.id !== "japan" ? { color: "#a33322" } : undefined}>
              {campaign.id === "japan" ? messageFormDate(stage.date) : stage.directive ? "P: PRIORITY" : "R: ROUTINE"}
            </div>
          </div>
          <div className="px-2 py-1 border-r border-black">
            <div className="text-[7px] uppercase tracking-wide opacity-60 leading-none">
              {campaign.id === "japan" ? "Report No." : "Date"}
            </div>
            <div className="text-[11px] font-semibold leading-tight">
              {campaign.id === "japan" ? `No. ${reportNumber}` : messageFormDate(stage.date)}
            </div>
          </div>
          {campaign.id !== "japan" && (
            <div className="px-2 py-1 border-r border-black">
              <div className="text-[7px] uppercase tracking-wide opacity-60 leading-none">Report No.</div>
              <div className="text-[11px] font-semibold leading-tight">No. {reportNumber}{campaign.dynamic && filingStatusNote(meters.initiative)}</div>
            </div>
          )}
          <div className="px-2 py-1">
            <div className="text-[7px] uppercase tracking-wide opacity-60 leading-none">Classification</div>
            <div className="text-[10px] font-semibold leading-tight">
              {classificationLevel(meters)}
            </div>
          </div>
        </div>

        {(() => {
          const addr = resolveAddressee(campaign.id, nodeId);
          return (
            <div
              className="mb-2 pb-2 border-b border-black text-[10px] leading-snug"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {campaign.id === "japan" ? (
                <>
                  <div><b className="uppercase tracking-wide mr-2">Originator</b>{addr.originator}</div>
                  <div><b className="uppercase tracking-wide mr-2">Addressee</b>{addr.addressee}</div>
                </>
              ) : (
                <>
                  <div><b className="uppercase tracking-wide mr-2">FM</b>{addr.fm}</div>
                  <div><b className="uppercase tracking-wide mr-2">TO</b>{addr.to}</div>
                </>
              )}
            </div>
          );
        })()}

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div style={{ transform: campaign.dynamic ? `rotate(${filingStampRotation(meters.initiative)}deg)` : "none" }}>
            <Stamp text={campaign.seal} color={campaign.accent} campaignId={campaign.id} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
            >
              {saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : saveState === "failed" ? "Save failed, please retry" : ""}
            </div>
            <button
              onClick={onHome}
              className="border-2 border-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Home
            </button>
          </div>
        </div>

        {campaign.dynamic && <Timeline date={stage.date} accent={campaign.accent} />}

        {campaign.dynamic && (
          <details className="mb-3 border-2 border-black px-3 py-1.5">
            <summary
              className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Show Pacific Situation
            </summary>
            <div className="mt-3">
              <PacificMap
                year={yearFrom(stage.date, 1941)}
                flags={flags}
                meters={meters}
                accent={campaign.accent}
                nodeId={nodeId}
              />
            </div>
          </details>
        )}

        {campaign.dynamic && !iron && (
          <div className="mb-3">
            <div className="flex flex-col gap-1.5 border-2 border-black px-3 py-2">
              <MeterBar label="Readiness" value={meters.readiness} danger={meters.readiness <= -3} />
              <MeterBar label="Pipeline" value={meters.pipeline} danger={meters.pipeline <= -2} />
              <MeterBar label="Initiative" value={meters.initiative} danger={false} />
            </div>
            <div
              className="text-[10px] uppercase tracking-wider opacity-50 mt-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              A plus reading means better supplied and running ahead of schedule. A minus reading means the reverse.
            </div>
          </div>
        )}
        {campaign.dynamic && purge && (
          <div
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4 border-2 px-3 py-2 text-[11px] sm:text-xs uppercase tracking-widest font-bold"
            style={{ borderColor: "#5c1a1a", color: "#5c1a1a", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>Fanatical Resolve Mode: no dashboard, no rewind</span>
            <span>
              Insubordination: {"●".repeat(Math.min(5, flags.suspicion || 0))}
              {"○".repeat(Math.max(0, 5 - (flags.suspicion || 0)))} ({flags.suspicion || 0}/5)
            </span>
          </div>
        )}
        {campaign.dynamic && coalition && (
          <div
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4 border-2 px-3 py-2 text-[11px] sm:text-xs uppercase tracking-widest font-bold"
            style={{ borderColor: "#28497a", color: "#28497a", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>Coalition Resolve Mode: no rewind</span>
            <span>Coalition Resolve: {cohesionLabel(flags.cohesion)}</span>
          </div>
        )}

        {warnings.map((w, i) => (
          <p
            key={i}
            className="text-[13px] mb-2 border-2 px-3 py-2 font-bold uppercase tracking-wide"
            style={{
              borderColor: w.includes("coherent") ? "#000000" : "#7a2e2e",
              color: w.includes("coherent") ? "#000000" : "#7a2e2e",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {w}
          </p>
        ))}

        {showReview && (
          <div className="mb-4 mt-2 border-2 border-black px-3 py-3">
            <div
              className="text-xs uppercase tracking-[0.25em] mb-1 font-bold text-[#000000]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Strategic Review · {log.length} decisions on file
            </div>
            <p className="text-[13px] text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {!iron &&
                (total >= 3
                  ? "Overall position: ahead of the historical baseline. "
                  : total <= -3
                  ? "Overall position: behind the historical baseline. "
                  : "Overall position: broadly tracking the historical record. ")}
              You have matched the historical decision at {matchedSoFar} of {comparableSoFar.length} comparable
              points so far.
            </p>
          </div>
        )}

        {(stage.speculative || flags.speculativePath) ? (
          hasSeenProjectedBadge ? (
            <div className="mb-4 text-[11px] uppercase tracking-widest font-bold opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#7a5b1e" }}>
              ⚠ Still speculative
            </div>
          ) : (
            <div className="mb-4">
              <span
                className="inline-block border-[3px] px-2 py-1 text-xs uppercase tracking-widest font-bold"
                style={{ fontFamily: "'IBM Plex Mono', monospace", borderColor: "#b08d3f", color: "#7a5b1e" }}
              >
                ⚠ Speculative: beyond what evidence supports
              </span>
            </div>
          )
        ) : !isHistorical ? (
          hasSeenProjectedBadge ? (
            <div className="mb-4 text-[11px] uppercase tracking-widest font-bold opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Projected, continued
            </div>
          ) : (
            <div className="mb-4">
              <span
                className="inline-block border-2 border-black px-2 py-1 text-xs uppercase tracking-widest font-bold"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Projected Scenario: beyond the historical record
              </span>
            </div>
          )
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
          {stage.date}
        </div>
        <h2
          className="text-3xl mb-4 text-[#000000]"
          style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
        >
          {stage.title}
        </h2>
        <Typewriter
          text={(() => {
            const base = noRewind ? redactText(stage.situation, readinessRedactFrac(meters.readiness)) : stage.situation;
            if (!campaign.dynamic || stage.noFlavor) return base;
            const flavor = meterFlavorLine(meters, stage.title);
            return flavor ? base + " " + flavor : base;
          })()}
          instant={instantText}
          soundOn={soundOn}
        />

        <div
          className="text-xs uppercase tracking-[0.25em] mb-3 pb-2 border-b-2 border-black text-[#000000] font-semibold"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {campaign.id === "japan" ? "Decoded Text Follows" : "BT"}
        </div>
        <div className="flex flex-col mb-6 border-2 border-black">
          {stage.choices.map((choice, i) => {
            // Ordinal prefix per campaign convention: A/B/C for the Navy message
            // form, traditional 甲/乙/丙 ordinals for the IGHQ signal sheet, matching
            // the two reference mockups rather than a generic numbered list.
            const ordinalsAllied = ["A", "B", "C", "D", "E", "F"];
            const ordinalsIghq = ["甲", "乙", "丙", "丁", "戊", "己"];
            const ordinal = (campaign.id === "japan" ? ordinalsIghq : ordinalsAllied)[i] || i + 1;
            return (
            <button
              key={i}
              onClick={() => onChoose(i)}
              disabled={(iron && choice.favor && choice.favor > favor) || !!choice.disabledReason}
              className={`text-left px-4 py-3 text-[#000000] [@media(hover:hover)]:hover:bg-[#000000] [@media(hover:hover)]:hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#000000] ${i > 0 ? "border-t-2 border-black" : ""}`}
              style={{
                textDecoration: (iron && choice.favor && choice.favor > favor) || choice.disabledReason ? "line-through" : "none",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <span
                className="font-semibold block text-[14px] leading-snug"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {ordinal}. {choice.label}
              </span>
              {iron && choice.favor && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  ⚔ Costs {choice.favor} political capital{choice.favor > favor ? ": insufficient" : ""}
                </span>
              )}
              {purge && choice.setFlags && choice.setFlags.suspicion !== undefined && (() => {
                const delta = choice.setFlags.suspicion - (flags.suspicion || 0);
                if (delta === 0) return null;
                return (
                  <span
                    className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", color: delta > 0 ? "#7a2e2e" : "#2e5a2e" }}
                  >
                    {delta > 0 ? `⚠ Raises suspicion +${delta} (of 5)` : `Lowers suspicion ${delta}`}
                  </span>
                );
              })()}
              {coalition && choice.setFlags && choice.setFlags.cohesion !== undefined && (() => {
                const delta = choice.setFlags.cohesion - (flags.cohesion || 0);
                if (delta === 0) return null;
                return (
                  <span
                    className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", color: delta < 0 ? "#7a2e2e" : "#2e5a2e" }}
                  >
                    {delta < 0 ? `⚠ Strains cohesion ${delta} (floor −6)` : `Builds cohesion +${delta}`}
                  </span>
                );
              })()}
              {choice.disabledReason && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  ⛔ Unavailable: {choice.disabledReason}
                </span>
              )}
              {choice.gateCheck && !choice.disabledReason && (
                <span
                  className="inline-block mt-1 mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px] opacity-60"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#2e5a2e" }}
                  title={`Needs ${choice.gateCheck.meter} above ${choice.gateCheck.threshold}: currently ${meters[choice.gateCheck.meter]}`}
                >
                  ✓ {choice.gateCheck.label} check passed
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
              {choice.attested ? (
                <span
                  className="block text-[12px] italic mt-2 pl-2 opacity-80 group-hover:opacity-100"
                  style={{ borderLeft: "2px solid currentColor" }}
                >
                  “{choice.attested.text}”: {advisorAttribution(choice.attested.by, stage.date)}
                </span>
              ) : (
                choice.advisor && (
                  <span
                    className="block text-[12px] italic mt-2 pl-2 opacity-80 group-hover:opacity-100"
                    style={{ borderLeft: "2px solid currentColor" }}
                  >
                    {advisorAttribution(choice.advisor.name, stage.date)} argues: {choice.advisor.position}
                  </span>
                )
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

        <div
          className="text-center text-[10px] uppercase tracking-[0.3em] pt-2 pb-1 mb-4 border-t-2 border-black opacity-60"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {campaign.id === "japan" ? "End of Message" : "BT · NNNN"}
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

function OutcomeScreen({ campaign, stage, choiceIndex, rollIndex, meters, onProceed, isLast, soundOn }) {
  const choice = stage.choices[choiceIndex];
  const eff = effectiveChoice(choice, rollIndex);
  const screenRef = useRef(null);
  useEffect(() => {
    if (screenRef.current) screenRef.current.focus();
  }, []);
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
        ["Readiness", eff.impact.readiness || 0],
        ["Pipeline", eff.impact.pipeline || 0],
        ["Initiative", eff.impact.initiative || 0],
      ].filter(([, v]) => v !== 0)
    : [];
  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-center justify-center px-4 py-10">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="main"
        aria-label="After Action Report"
        className={`${paper} w-full max-w-2xl p-6 sm:p-8`}
        style={{ ...campaignPaperStyle(campaign.id, campaign.accent), outline: "none" }}
      >
        <h1
          style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
        >
          After Action Report
        </h1>
        <Stamp text="After Action Report" color={campaign.accent} campaignId={campaign.id} />
        <div
          className="text-xs uppercase tracking-[0.25em] mt-4 mb-1 text-[#000000] font-semibold"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {stage.date} · Order Given
        </div>
        <p
          className="italic mb-4 text-[16px] text-[#000000] font-medium"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          "{choice.label}"
        </p>

        {eff.variantTitle && (
          <div
            className="mb-4 border-2 border-black px-3 py-2 text-[13px] uppercase tracking-widest font-bold text-[#000000]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {choice.concealRoll ? eff.variantTitle : `⚄ Contested decision: resolved: ${eff.variantTitle}`}
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

        <p
          className="leading-relaxed text-[16px] mb-6 text-[#000000]"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          {eff.outcome}
        </p>

        {eff.impact && campaign.dynamic && meters && (
          <div className="mb-8">
            <div
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 text-[#000000] opacity-60"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Current Standing
            </div>
            <div className="flex flex-wrap gap-4 border-2 border-black px-3 py-2">
              <MeterBar label="Readiness" value={meters.readiness} danger={meters.readiness <= -4} />
              <MeterBar label="Pipeline" value={meters.pipeline} danger={meters.pipeline <= -4} />
              <MeterBar label="Initiative" value={meters.initiative} />
            </div>
          </div>
        )}

        <button
          onClick={onProceed}
          className="border-2 px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
          style={{ borderColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
        >
          {isLast ? "Close the File" : "Next Report"}
        </button>
      </div>
    </div>
  );
}

// Shown in demo builds when the player has used up their 6 allowed choices without
// reaching a real ending yet — see demoChoiceCount and the interception in proceed().
// Deliberately NOT treated as an ending: no run-record save, no objectives/endings-gallery
// credit, since a build-imposed content wall isn't a narrative outcome the way a real
// ending is.
function DemoWallScreen({ campaign, onHome, onRestart }) {
  const screenRef = useRef(null);
  useEffect(() => {
    if (screenRef.current) screenRef.current.focus();
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10 text-center">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="main"
        aria-label="Demo ends here"
        className={`${paper} w-full max-w-lg p-8 text-center focus:outline-none`}
        style={{ ...campaignPaperStyle(campaign.id, campaign.accent), outline: "none" }}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
          The Demo Ends Here
        </h1>
        <p className="text-[15px] leading-relaxed mb-4" style={{ fontFamily: "'Courier Prime', monospace" }}>
          Six decisions is as far as this demo goes, whichever direction they took you. The
          full IGHQ campaign continues for years and dozens more decisions from wherever this
          run left off, plus the entire CINCPAC campaign from the Allied side, not available
          in this demo at all.
        </p>
        <p className="text-[13px] leading-relaxed mb-6 opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
          71 named endings across both campaigns. This run has seen six decisions of one.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onHome}
            className="border-2 border-black px-4 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Return to Menu
          </button>
          <button
            onClick={onRestart}
            className="border-2 border-black px-4 py-3 text-xs uppercase tracking-widest font-bold opacity-70 hover:opacity-100 hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Play a Different Path
          </button>
        </div>
      </div>
    </div>
  );
}

function EndScreen({ campaign, flags, meters, log, pastStages, rewinds, mode, favor, newlyEarnedObjectives, onRestart, onSwitch, onRewind }) {
  const [copied, setCopied] = useState(false);
  const screenRef = useRef(null);
  useEffect(() => {
    // Move focus to the ending screen on mount so screen reader users get an immediate,
    // clear signal the run has ended, matching the same pattern BriefingScreen uses on
    // every node change rather than leaving focus silently on the last "Choose" button.
    if (screenRef.current) screenRef.current.focus();
  }, []);
  const total = campaign.dynamic ? meters.readiness + meters.pipeline + meters.initiative : 0;
  const epilogueText = useMemo(
    () => (typeof campaign.epilogue === "function" ? campaign.epilogue(flags, meters) : campaign.epilogue),
    [campaign, flags, meters]
  );
  const removedFromCommand = flags.purged || flags.relieved;
  // No Pacific content sets a "front collapse" path variant (that was Europe-specific);
  // kept as an inert false rather than ripping out its two downstream references.
  const collapsed = false;
  const comparable = log.filter((e) => e.histSum != null);
  const outperformed = comparable.filter((e) => e.sum > e.histSum).length;
  const matchedHistory = comparable.filter((e) => e.isHistorical).length;

  const outRate = comparable.length ? outperformed / comparable.length : 0;
  let rank;
  if (removedFromCommand) {
    rank = flags.purged ? "Deposed by the Hardliners" : "Relieved: Coalition Collapsed";
  } else if (outRate >= 0.6 && total >= 3) {
    rank = "Better Than the Historical Record";
  } else if (outRate >= 0.4) {
    rank = "The Fireman";
  } else if (matchedHistory / (comparable.length || 1) >= 0.7) {
    rank = "Staff College Case Study";
  } else {
    rank = "A Different Command";
  }

  const rolls = log.filter((e) => e.rollP != null);
  const compound = rolls.reduce((a, e) => a * e.rollP, 1);
  const compoundPct =
    compound >= 0.1 ? Math.round(compound * 100) + "%" : compound >= 0.001 ? (compound * 100).toFixed(1) + "%" : "under 0.1%";

  const earnedObjectives = campaign.dynamic
    ? evaluateObjectives({ campaignId: campaign.id, flags, meters, log, rewinds, mode, favor })
    : [];

  const advisorTally = {};
  log.forEach((e) => {
    if (e.advisor) advisorTally[e.advisor] = (advisorTally[e.advisor] || 0) + 1;
  });
  const topAdvisors = Object.entries(advisorTally).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const notTakenTally = {};
  log.forEach((e) => {
    (e.notTakenAdvisors || []).forEach((name) => {
      notTakenTally[name] = (notTakenTally[name] || 0) + 1;
    });
  });
  // Only surface an advisor whose counsel you actually passed over more often than you
  // took anyone's advice at all — a single pass-over out of one decision isn't a pattern.
  const voicesNotHeard = Object.entries(notTakenTally)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-center justify-center px-4 py-10">
      <div
        ref={screenRef}
        tabIndex={-1}
        role="region"
        aria-label="Final situation report"
        className={`${paper} w-full max-w-2xl p-6 sm:p-8 focus:outline-none`}
        style={campaignPaperStyle(campaign.id, campaign.accent)}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <Stamp text={removedFromCommand ? "Command Terminated" : collapsed ? "Front Collapsed" : "File Closed"} color={campaign.accent} campaignId={campaign.id} />
          {campaign.dynamic && (
            <div
              className="border-2 px-2 py-1 text-xs uppercase tracking-widest font-bold text-[#000000]"
              style={{ borderColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
            >
              {rank}
            </div>
          )}
        </div>
        {log && log.length > 0 && (
          <div
            className="mt-2 text-xs uppercase tracking-[0.25em] font-bold text-[#000000]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            End of hostilities: {log[log.length - 1].date}
          </div>
        )}
        {campaign.dynamic && (() => {
          // campaign.projectedEnd does not exist on either 1941 campaign (checked directly —
          // it's undefined on both), so this section was already dead/hidden code before this
          // fix, not just cosmetically broken. Falls back to the most recent real date this
          // playthrough actually reached: the last decision log entry's date, or 1945 if the
          // log is empty. PacificMap's own built-in year slider (1939 through this year) already
          // approximates the player's journey via mapOverrides' year-gated conditions on the
          // final flags — a second, separate "opening state" map would be redundant with that
          // existing scrubber, not additive.
          const lastLogDate = log && log.length ? log[log.length - 1].date : null;
          return (
            <details className="mt-3 mb-2">
              <summary
                className="text-xs uppercase tracking-[0.25em] font-semibold text-[#000000] cursor-pointer select-none py-1"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Pacific Situation: the war actually fought
              </summary>
              <PacificMap
                year={yearFrom(lastLogDate, 1945)}
                flags={flags}
                meters={meters}
                accent={campaign.accent}
              />
            </details>
          );
        })()}
        {(() => {
          const label = campaign.positionLabel
            ? campaign.positionLabel(flags, meters)
            : collapsed
            ? "Collapse Ahead of Schedule"
            : total <= 1
            ? "Essentially the Historical Outcome"
            : "Resistance Prolonged";
          return (
            <>
              <h2
                className="text-3xl sm:text-4xl mt-4 mb-1 text-[#000000] leading-tight"
                style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}
              >
                {label}
              </h2>
              <div
                className="inline-block mb-2 border-2 px-3 py-1 text-xs uppercase tracking-widest font-bold"
                style={(() => {
                  const cls = classifyEnding(label);
                  const color = cls === "Major Victory" ? "#1f5c2e" : cls === "Minor Victory" ? "#3a7a4a" : cls === "Contested Outcome" ? "#7a6a2e" : cls === "Minor Defeat" ? "#8a4a2e" : "#7a2e2e";
                  return { fontFamily: "'IBM Plex Mono', monospace", borderColor: color, color };
                })()}
              >
                {classifyEnding(label)}
              </div>
              <div
                className="text-xs uppercase tracking-[0.25em] font-semibold mb-4 opacity-60"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {campaign.name}, {campaign.dates}
              </div>
            </>
          );
        })()}
        {campaign.dynamic && (
          <div className="mb-4">
            <div className="flex flex-col gap-1.5 border-2 border-black px-3 py-2">
              <MeterBar label="Readiness" value={meters.readiness} />
              <MeterBar label="Pipeline" value={meters.pipeline} />
              <MeterBar label="Initiative" value={meters.initiative} />
            </div>
            <div
              className="text-[10px] uppercase tracking-wider opacity-50 mt-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              A plus reading means better supplied and running ahead of schedule. A minus reading means the reverse.
            </div>
          </div>
        )}
        <p
          className="leading-relaxed mb-6 text-[16px] text-[#000000]"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        >
          {epilogueText}
        </p>

        {topAdvisors.length > 0 && (
          <div className="mb-6">
            <div
              className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold"
              style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Council Followed
            </div>
            <p className="text-sm text-[#000000] font-medium" style={{ fontFamily: "'Courier Prime', monospace" }}>
              Most trusted advisor:{" "}
              <span className="font-bold">
                {topAdvisors[0][0]} ({topAdvisors[0][1]} {topAdvisors[0][1] === 1 ? "council" : "councils"})
              </span>
              {topAdvisors.length > 1 && (
                <span>
                  {" "}
                  · also heeded {topAdvisors
                    .slice(1)
                    .map(([name, n]) => `${name} (${n})`)
                    .join(", ")}
                </span>
              )}
            </p>
          </div>
        )}

        {voicesNotHeard.length > 0 && (
          <div className="mb-6">
            <div
              className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold"
              style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Voices Not Heard
            </div>
            <p className="text-sm text-[#000000] font-medium" style={{ fontFamily: "'Courier Prime', monospace" }}>
              Passed over most often:{" "}
              <span className="font-bold">
                {voicesNotHeard.map(([name, n]) => `${name} (${n})`).join(", ")}
              </span>
            </p>
          </div>
        )}

        {earnedObjectives.length > 0 && (
          <div className="mb-6">
            <div
              className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold"
              style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Objectives Achieved
            </div>
            {earnedObjectives.map((id) => {
              const o = OBJECTIVES.find((x) => x.id === id);
              const isNew = (newlyEarnedObjectives || []).includes(id);
              return o ? (
                <div
                  key={id}
                  className="text-sm text-[#000000] border-l-4 pl-2 mb-1"
                  style={{ borderColor: isNew ? "#b08d3f" : "#00000033", fontFamily: "'Courier Prime', monospace" }}
                >
                  ★ <b>{o.title}</b>
                  {isNew && (
                    <span
                      className="ml-2 text-[10px] uppercase tracking-widest font-bold px-1"
                      style={{ backgroundColor: "#b08d3f", color: "#000000", fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      New
                    </span>
                  )}
                  {" "}{o.desc}
                </div>
              ) : null;
            })}
          </div>
        )}

        {campaign.dynamic && rolls.length > 0 && (
          <div className="mb-6">
            <div
              className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold"
              style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              The Dice You Rolled
            </div>
            <p className="text-sm text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              This war passed through {rolls.length} contested {rolls.length === 1 ? "outcome" : "outcomes"}. The
              compound likelihood of the exact path you walked: <b>~{compoundPct}</b>.
              {rewinds > 0 && ` Reached across ${rewinds} ${rewinds === 1 ? "rewind" : "rewinds"}, the dice were not obliged to repeat themselves, and didn't.`}
              {flags.speculativePath &&
                " Portions of this path are marked speculative: the odds above are a statement of how far it stands from what the evidence supports."}
            </p>
          </div>
        )}

        {log.length > 0 && (
          <details className="mb-6">
            <summary
              className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold cursor-pointer select-none"
              style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Command Timeline · {log.filter((e) => !e.isHistorical).length}{" "}
              {log.filter((e) => !e.isHistorical).length === 1 ? "divergence" : "divergences"} from the record
            </summary>
            <div className="mt-2 border-l-2 pl-4" style={{ borderColor: campaign.accent }}>
              {log.map((e, i) => (
                <div key={i} className="mb-3 relative">
                  <span
                    className="absolute -left-[23px] top-[2px] text-[13px]"
                    style={{ color: e.isHistorical ? "#00000055" : campaign.accent }}
                  >
                    {e.isHistorical ? "·" : "◆"}
                  </span>
                  <div className="text-[10px] uppercase tracking-widest text-[#000000] opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {e.date}: {e.title}
                  </div>
                  <div
                    className={`text-[13px] text-[#000000] ${e.isHistorical ? "" : "font-bold"}`}
                    style={{ fontFamily: "'Courier Prime', monospace" }}
                  >
                    {e.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] italic text-[#000000] opacity-60 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
              ◆ marks decisions that departed from the historical record.
            </p>
          </details>
        )}

        {campaign.dynamic && comparable.length > 0 && (
          <details className="mb-6">
            <summary
              className="text-xs uppercase tracking-[0.25em] mb-2 border-t-2 pt-4 text-[#000000] font-semibold cursor-pointer select-none"
              style={{ borderColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Scorecard vs. History · matched {matchedHistory}/{comparable.length}, out-positioned {outperformed}/{comparable.length}
            </summary>
            <p
              className="text-sm mb-3 mt-2 text-[#000000] font-medium"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              You chose the historical option at {matchedHistory} of {comparable.length} comparable decision
              points, and out-positioned the historical choice at {outperformed} of {comparable.length}.
            </p>
            <div className="flex flex-col gap-2">
              {comparable.map((e, i) => (
                <div
                  key={i}
                  className="text-[13px] leading-snug text-[#000000] border-l-4 pl-2"
                  style={{
                    borderColor: campaign.accent,
                    fontFamily: "'Courier Prime', monospace",
                  }}
                >
                  <span className="font-bold">
                    {e.sum > e.histSum ? "▲" : e.sum < e.histSum ? "▼" : "＝"} {e.title}
                  </span>{" "}
                  · you: {e.label}
                  {!e.isHistorical && <span> · history: {e.histLabel}</span>}
                </div>
              ))}
            </div>
          </details>
        )}

        <details className="border-t-2 pt-4 mb-6" style={{ borderColor: campaign.accent }} open>
          <summary
            className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Decision Log
          </summary>
          <ol className="space-y-2 mt-3">
            {log.map((entry, i) => (
              <li
                key={i}
                className="text-sm leading-snug text-[#000000] font-medium"
                style={{ fontFamily: "'Courier Prime', monospace" }}
              >
                <span className="text-[#000000] font-semibold">{entry.date}</span>
                {entry.label}
              </li>
            ))}
          </ol>
        </details>

        {pastStages && pastStages.length > 0 && (
          <details className="border-t-2 pt-3 mb-6" style={{ borderColor: campaign.accent }}>
            <summary
              className="text-xs uppercase tracking-[0.25em] text-[#000000] font-semibold cursor-pointer select-none"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
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
          <button
            onClick={() => {
              const modeLabel = mode === "fanatical" ? " · ⚔ Fanatical Resolve Mode" : mode === "coalition" ? " · ⚔ Coalition Resolve Mode" : "";
              const endingLabelForShare = campaign.positionLabel ? campaign.positionLabel(flags, meters) : "Unknown";
              const shareText = [
                "DISPATCHES 1941: After-Action Report",
                campaign.name + modeLabel,
                "Rank: " + rank,
                "Ending: " + endingLabelForShare + " (" + classifyEnding(endingLabelForShare) + ")",
                comparable.length > 0
                  ? "Matched history " + matchedHistory + "/" + comparable.length + " · Outperformed at " + outperformed
                  : null,
                rolls.length > 0
                  ? "Dice: " + rolls.length + " contested outcomes, path likelihood ~" + compoundPct + (rewinds > 0 ? " across " + rewinds + " rewinds" : ", no rewinds")
                  : null,
                topAdvisors.length > 0 ? "Most trusted advisor: " + topAdvisors[0][0] + " (" + topAdvisors[0][1] + ")" : null,
                earnedObjectives.length > 0
                  ? "Objectives: " + earnedObjectives.map((id) => (OBJECTIVES.find((x) => x.id === id) || {}).title).filter(Boolean).join(", ")
                  : null,
              ]
                .filter(Boolean)
                .join("\n");
              try {
                navigator.clipboard.writeText(shareText).then(
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
            onClick={() => {
              try {
                const endingLabel = campaign.positionLabel ? campaign.positionLabel(flags, meters) : "Unknown Ending";
                const fullEpilogue = campaign.epilogue ? campaign.epilogue(flags, meters) : "";
                // First one or two sentences, not the full multi-hundred-word epilogue — a
                // short, real excerpt gives the card actual texture without needing the
                // whole card redesigned around a long block of prose. Sentence-boundary
                // aware (splits on ". " followed by a capital letter, not just any period,
                // so abbreviations and decimals inside a sentence don't cause a false split).
                let epilogueExcerpt = "";
                if (fullEpilogue) {
                  // Many endings across both campaigns share a generic "A war that opened
                  // at Pearl Harbor, and..." scene-setting prefix before the actual
                  // choice-specific payload — grabbing the first sentence as written meant
                  // the card usually just showed this same boilerplate, truncated mid-clause
                  // before ever reaching anything distinguishing. Skip forward to the first
                  // known "arrival" verb phrase (reaches its, ends with, converges toward,
                  // runs its full course) when one appears early, so the excerpt starts at
                  // the actual payload instead of the shared framing every ending opens with.
                  let excerptSource = fullEpilogue;
                  if (/^A war that /.test(excerptSource)) {
                    const transition = excerptSource.match(/\b(reaches its|ends with|ends the way|converges (back )?toward|runs its full course)\b/i);
                    if (transition && transition.index <= 220) {
                      const rest = excerptSource.slice(transition.index).trim();
                      excerptSource = rest.charAt(0).toUpperCase() + rest.slice(1);
                    }
                  }
                  const sentences = excerptSource.match(/[^.!?]+[.!?]+(?=\s+[A-Z]|\s*$)/g) || [excerptSource];
                  epilogueExcerpt = sentences.slice(0, 2).join(" ").trim();
                  if (epilogueExcerpt.length > 220) {
                    epilogueExcerpt = sentences[0] ? sentences[0].trim() : epilogueExcerpt.slice(0, 220).trim() + "…";
                  }
                }
                const dataUrl = renderShareCard({
                  campaign,
                  endingLabel,
                  epilogueExcerpt,
                  rank,
                  meters,
                  mode,
                  matchedHistory,
                  comparableCount: comparable.length,
                  outperformed,
                  topAdvisor: topAdvisors.length > 0 ? topAdvisors[0][0] : null,
                  compoundPct: rolls.length > 0 ? compoundPct : null,
                });
                downloadShareCard(dataUrl, `dispatches-1941-${campaign.id}-ending.png`);
              } catch (e) {
                // Canvas generation failing shouldn't break the end screen — the plain-text
                // copy button above still works as a fallback.
              }
            }}
            className="border-2 px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ borderColor: campaign.accent, fontFamily: "Oswald, sans-serif" }}
          >
            Download Share Card
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

// ---------- SAVE SCHEMA VERSIONING ----------
// Bumped whenever a change could make an old save unsafe to resume — most commonly,
// node ids being renamed or removed (this has happened repeatedly across content
// passes). A stale save must never be allowed to reach setPosition() unvalidated:
// resolveStage() on a node id that no longer exists returns null, and rendering
// BriefingScreen against a null stage crashes past the ErrorBoundary's ability to
// recover gracefully. Validate first; if it fails, clear the save quietly rather than
// show the player a broken "Resume" button or an error screen.
const SAVE_SCHEMA_VERSION = 1;

// Old node id -> new node id. Add an entry whenever a node is renamed, so saves made before the rename still
// resume (see docs/SAVES.md). Empty today: no node has been renamed since the schema version was introduced.
const NODE_ALIASES = {};
// SAVE_MIGRATIONS[n] upgrades a save from schema version n to n + 1. Add one whenever SAVE_SCHEMA_VERSION is
// bumped, so an update upgrades players' saves instead of wiping them. A save with no way forward is discarded.
const SAVE_MIGRATIONS = {};
const aliasNode = (id) => (typeof id === "string" && Object.prototype.hasOwnProperty.call(NODE_ALIASES, id) ? NODE_ALIASES[id] : id);

/** Upgrades a parsed save to the current schema and applies node aliases. Returns null if it cannot be used. */
function migrateSave(saved) {
  if (!saved || typeof saved !== "object") return null;
  let version = saved.schemaVersion;
  if (!Number.isInteger(version) || version < 1 || version > SAVE_SCHEMA_VERSION) return null; // unknown, or from a newer build
  let s = saved;
  while (version < SAVE_SCHEMA_VERSION) {
    const step = SAVE_MIGRATIONS[version];
    if (!step) return null;
    s = step(s);
    version += 1;
    if (!s || typeof s !== "object") return null;
    s.schemaVersion = version;
  }
  if (Object.keys(NODE_ALIASES).length) {
    s = { ...s, position: aliasNode(s.position) };
    if (Array.isArray(s.visited)) s.visited = s.visited.map(aliasNode);
    if (Array.isArray(s.history)) s.history = s.history.map((h) => (h && typeof h === "object" ? { ...h, position: aliasNode(h.position) } : h));
  }
  return s;
}

function isValidSave(saved) {
  if (!saved || typeof saved !== "object") return false;
  if (saved.schemaVersion !== SAVE_SCHEMA_VERSION) return false;
  const campaign = CAMPAIGNS[saved.campaignId];
  if (!campaign) return false;
  // Demo builds only ever create a save with campaignId "japan" and demoChoiceCount <= 6 —
  // but if a demo and full build ever shared browser storage (same origin), a save made in
  // the full game could otherwise resume the demo straight into CINCPAC content, or past the
  // choice cap, that the demo build's own UI never lets a player reach directly. Reject
  // rather than silently honor a save that couldn't have been produced by this build.
  if (DEMO_BUILD && (saved.campaignId !== "japan" || (saved.demoChoiceCount || 0) > 6)) return false;
  try {
    const stage = resolveStage(campaign, saved.position, saved.flags || {}, saved.meters || EMPTY_METERS);
    if (!stage || !stage.choices || stage.choices.length === 0) return false;
  } catch (e) {
    return false;
  }
  return true;
}


const ADVISOR_DOSSIERS = {
  Konoe: { role: "Prime Minister (1937–39, 1940–41)", summary: "Presided over the China war's early escalation and, in January 1938, declared his government would no longer deal with Chiang Kai-shek's government at all, foreclosing settlement while relatively generous terms were still available, a decision many historians consider one of the war's more consequential unforced errors. Resigned in October 1941 rather than confirm the war decision Tojo's cabinet ultimately made; took his own life in December 1945 rather than face the Tokyo tribunal.", faction: "japan", rank: 1 },
  Umezu: { role: "General: Chief of the Army General Staff", summary: "One of the war ministry's most committed holdouts against surrender in 1945, reportedly among the last senior officers to accept the Emperor's decision even after it was made. Signed the instrument of surrender on behalf of the Army anyway; convicted at the Tokyo tribunal and died in prison in 1949.", faction: "japan", rank: 1 },
  Onishi: { role: "Vice Admiral: First Air Fleet commander", summary: "Proposed organizing suicide attacks as formal Navy doctrine in October 1944, arguing a First Air Fleet reduced to barely thirty operational aircraft had no other way to meaningfully strike an American carrier force. Took his own life the day after Japan's surrender broadcast, leaving a letter apologizing to the pilots he had sent to die.", faction: "japan", rank: 2 },
  Yonai: { role: "Admiral: former Prime Minister, Navy Minister", summary: "Opposed the Tripartite Pact and the drift toward war with the United States before it began, real, documented skepticism that never translated into a concrete peace initiative he or anyone else in government actually attempted before 1945. Served as Navy Minister through the war's end and supported the surrender; died in 1948, largely out of public life.", faction: "japan", rank: 1 },
  Koga: { role: "Admiral: Yamamoto's successor as Combined Fleet Commander-in-Chief", summary: "Inherited command after Yamamoto's death in April 1943 with a fleet already past the point where any single commander's tactical skill could offset the production gap it faced. Died in an air accident in March 1944 en route to a staff conference, in circumstances almost as poorly documented as Yamamoto's own death was well documented.", faction: "japan", rank: 2 },
  Matsuoka: { role: "Foreign Minister (1940–41)", summary: "Championed the Tripartite Pact with Germany and Italy as a deterrent against American intervention, then pursued a neutrality pact with the Soviet Union on similar logic, a diplomatic style built around dramatic gestures colleagues increasingly found erratic. Removed from office in 1941 partly over his handling of Soviet relations; died in 1946 while on trial at the Tokyo tribunal, before a verdict was reached.", faction: "japan", rank: 2 },
  Tojo: { role: "War Minister, later Prime Minister (1941–44)", summary: "A firm advocate of the Indochina occupation and the war decision as War Minister, he became Prime Minister in October 1941 and personally confirmed the deadline that led to Pearl Harbor at the Imperial Conference that December. Removed as Prime Minister in July 1944 after Saipan fell; convicted at the Tokyo tribunal and executed in 1948.", faction: "japan", rank: 1 },
  Nomura: { role: "Ambassador to the United States (1941)", summary: "A retired admiral sent to Washington specifically for his known moderation, he conducted the Hull-Nomura talks through 1941 trying to find terms both governments could accept, working against a deadline he was never fully informed about. Survived the war, later serving in the postwar House of Councillors; died in 1964.", faction: "japan", rank: 2 },
  Kuribayashi: { role: "Lieutenant General: Iwo Jima garrison commander", summary: "Abandoned the beach-defense doctrine that had failed at every prior island in favor of a deep tunnel network built to bleed an invasion for as long as physically possible, in a battle he privately told his staff he did not expect to survive. Killed in the battle's final days, March 1945; his body was never conclusively identified.", faction: "japan", rank: 3 },
  Horii: { role: "Major General: South Seas Detachment commander", summary: "Led the overland push toward Port Moresby across the Kokoda Track, reaching within thirty miles of the objective before a collapsing supply line forced a withdrawal IGHQ ordered over his own preference to press on. Drowned crossing the Kumusi River during the detachment's retreat in November 1942.", faction: "japan", rank: 3 },
  Imamura: { role: "Lieutenant General: Eighth Area Army commander", summary: "Took command of Japan's New Guinea and Solomons theater after the Kokoda campaign's collapse, generally favoring consolidation and supply discipline over the more aggressive commitments some subordinates preferred. Survived the war; convicted of war crimes related to his command's conduct and served a prison sentence; died in 1968.", faction: "japan", rank: 2 },
  Yamamoto: { role: "Admiral: Commander in Chief, Combined Fleet", summary: "Architect of the Pearl Harbor strike, and privately its most consistent skeptic about what it could actually buy, having studied at Harvard and toured American industry, and said so in terms his own staff found unwelcome. Warned Tokyo he could run wild for six months but promised nothing beyond that, a prediction the war's actual timeline bore out with uncomfortable precision. Killed in April 1943 when American fighters, guided by intercepted and decoded travel plans, shot down his aircraft over Bougainville, a targeted strike his own staff argued against for fear of confirming Japan's code was broken.", faction: "japan", rank: 0 },
  Nagano: { role: "Admiral: Chief of the Navy General Staff", summary: "Signed off on the Pearl Harbor plan after resisting it, and oversaw the Navy's argument for prioritizing the Southern Resource Area over a Hawaii strike in early planning. Died in American custody in 1947 while on trial at the Tokyo tribunal, before a verdict was reached.", faction: "japan", rank: 1 },
  Nagumo: { role: "Vice Admiral: First Air Fleet commander", summary: "Led the Pearl Harbor strike force and the Midway invasion fleet, a battleship officer given command of the Navy's carriers more for seniority than for any enthusiasm about naval aviation. Commanded the garrison on Saipan in 1944; took his own life as the island fell rather than be captured.", faction: "japan", rank: 1 },
  Inoue: { role: "Vice Admiral: Fourth Fleet, South Seas", summary: "One of the more openly skeptical senior officers about the war's odds against American industrial capacity, and an early advocate of land-based naval air power over the battleship doctrine most peers still favored. Survived the war in a training command; died in 1975, remembered as one of the more clear-eyed strategic minds Japan didn't fully listen to.", faction: "japan", rank: 2 },
  Ugaki: { role: "Rear Admiral: Chief of Staff, Combined Fleet", summary: "Yamamoto's closest staff officer and diarist, whose wartime journal remains one of the most detailed insider accounts of Imperial Navy decision-making. Led a final kamikaze sortie on the day of Japan's surrender broadcast, in defiance of the ceasefire; killed in the attack.", faction: "japan", rank: 2 },
  Tanaka: { role: "Rear Admiral: Destroyer Squadron 2, 'Tokyo Express'", summary: "Ran the night resupply and reinforcement runs to Guadalcanal with a tactical skill his American opponents came to respect, under conditions of near-total air inferiority. Relieved after criticizing high command's Guadalcanal strategy too openly; survived the war and died in 1969.", faction: "japan", rank: 3 },
  Kurita: { role: "Vice Admiral: First Diversion Attack Force, Leyte Gulf", summary: "Commanded the battleship force that broke through San Bernardino Strait at Leyte and then withdrew short of the invasion beaches, a decision made on incomplete information that historians still debate. Survived the war in a training post; gave few interviews about Leyte before his death in 1977.", faction: "japan", rank: 2 },
  Toyoda: { role: "Admiral: Commander in Chief, Combined Fleet (1944–45)", summary: "Oversaw the Sho-Go plans and the fleet's final operations, inheriting a navy with barely enough fuel left to conduct them. Tried at the Tokyo tribunal and acquitted; died in 1957.", faction: "japan", rank: 1 },
  Anami: { role: "General: Army Minister", summary: "The war ministry's leading holdout against surrender in August 1945, arguing the home islands' defense could still make an invasion politically unbearable for the Allies. Took his own life the night before the surrender broadcast, leaving a note apologizing for his 'great crime.'", faction: "japan", rank: 1 },
  Togo: { role: "Foreign Minister (1941–42, 1945)", summary: "Argued against the Pearl Harbor timing's diplomatic handling in 1941 and, returning to office in 1945, pushed the peace faction's case through the war's final, deadlocked cabinet meetings. Convicted at the Tokyo tribunal for his role in the war's opening; died in prison in 1950.", faction: "japan", rank: 2 },
  Sato: { role: "Ambassador to the Soviet Union", summary: "Cabled Tokyo repeatedly in the war's final weeks expressing frustration at Moscow's unreadable silence in response to Japan's real approach for peace mediation, without knowing the Soviets had already committed to entering the war at Yalta. Survived the war, later serving in postwar Japanese diplomatic and political roles; died in 1975.", faction: "japan", rank: 2 },
  Yoshida: { role: "Diplomat and postwar political figure", summary: "A career diplomat with real prewar doubts about war with the Anglo-American powers, who went on to serve as Prime Minister and architect of Japan's postwar economic rebuilding under American occupation and Cold War alignment. Served as Prime Minister for most of 1946–54; died in 1967, regarded as the chief architect of postwar Japan's recovery.", faction: "japan", rank: 2 },
  Sugiyama: { role: "General: Army Chief of Staff", summary: "Oversaw Army planning through the war's opening expansion, consistently more optimistic about timelines than events subsequently justified. Took his own life in September 1945 rather than face the occupation's reckoning.", faction: "japan", rank: 2 },
  Iida: { role: "Lieutenant General: Fifteenth Army, Burma", summary: "Drove the invasion of Burma at a pace prewar staff studies had rated impassable, cutting the Burma Road and China's last land supply route within weeks of crossing the frontier. Later commanded occupation forces in Sumatra; survived the war and died in 1980.", faction: "japan", rank: 3 },
  Sakurai: { role: "Lieutenant General: 33rd Division, Burma", summary: "Commanded one of Fifteenth Army's two divisions through the Rangoon campaign and the subsequent push toward India. Continued in Burma theater command through the war's later reversals; details of his postwar life are sparsely recorded.", faction: "japan", rank: 4 },
  Kawabe: { role: "General: Burma Area Army commander", summary: "Held nominal authority over Mutaguchi's U-Go offensive and harbored serious private doubts about its logistics that he ultimately failed to act on before the campaign's launch. Relieved of command amid U-Go's collapse; survived the war and later served in Japan's postwar Self-Defense Forces advisory circles.", faction: "japan", rank: 3 },
  Slim: { role: "Lieutenant General: Burma Corps, later Fourteenth Army", summary: "Led the near-thousand-mile fighting retreat from Burma into India in 1942, then rebuilt the shattered force into the Fourteenth Army that broke Japan's U-Go offensive at Imphal and Kohima two years later. Later Chief of the Imperial General Staff and Governor-General of Australia; widely regarded as one of the war's most capable field commanders; died in 1970.", faction: "alliedPacific", rank: 1 },
  Stilwell: { role: "Lieutenant General: U.S. commander, China-Burma-India theater", summary: "Commanded American forces in the CBI theater while serving simultaneously as Chiang Kai-shek's chief of staff, a dual role that put him in near-constant friction with Chiang over strategy, supply priority, and command of Chinese forces. Recalled from China in October 1944 at Chiang's explicit demand after their relationship broke down entirely; died in 1946.", faction: "alliedPacific", rank: 2 },
  Davies: { role: "Foreign Service officer: Yan'an observer group", summary: "A State Department China hand attached to the Dixie Mission, the first American observer group to reach Communist-held territory, whose reports argued Communist forces were fighting the Japanese occupation more effectively than the Nationalist front. Caught up in the McCarthy-era loyalty investigations of the 1950s and dismissed from the Foreign Service; formally exonerated decades later; died in 1999.", faction: "alliedPacific", rank: 4 },
  Ozawa: { role: "Vice Admiral: Mobile Fleet", summary: "Commanded Japan's last carrier force at the Philippine Sea and served as the Sho-Go decoy at Leyte, widely regarded by both sides as one of the Imperial Navy's more capable tacticians working with steadily diminishing means. Survived the war; declined most interview requests and died in 1966.", faction: "japan", rank: 2 },
  Kusaka: { role: "Rear Admiral: Chief of Staff, Combined Fleet air operations", summary: "A senior carrier-doctrine planner involved in the Pearl Harbor strike and subsequent carrier operations' staff work. Survived the war in a home-defense post; died in 1971.", faction: "japan", rank: 3 },
  Spruance: { role: "Admiral: Fifth Fleet commander", summary: "A famously unflappable, methodical commander who took the Fifth Fleet through the Marianas, Iwo Jima, and Okinawa, generally favoring the more conservative operational choice available to him over the bolder one. Later President of the Naval War College and ambassador to the Philippines; died in 1969.", faction: "alliedPacific", rank: 1 },
  Arnold: { role: "General: Commanding General, Army Air Forces", summary: "Built the wartime Army Air Forces from a fraction of its final size and championed strategic bombing doctrine throughout, though its actual execution against Japan's dispersed industry increasingly diverged from what he'd originally envisioned. The only Air Force officer ever to hold five-star rank; died in 1950.", faction: "alliedPacific", rank: 1 },
  Acheson: { role: "Assistant Secretary of State", summary: "Administered the July 1941 freezing order on Japanese assets, interpreting the licensing system strictly enough that it functioned as a near-total oil embargo in practice, reportedly beyond what Roosevelt had explicitly intended. Later Secretary of State under Truman, a principal architect of the Marshall Plan and NATO; died in 1971.", faction: "alliedPacific", rank: 3 },
  Grew: { role: "Ambassador to Japan (1932–41)", summary: "Spent a decade watching Japanese politics shift toward the military faction and warned Washington repeatedly through 1941 that an oil embargo severe enough to threaten Japan's survival would strengthen the case for war rather than deter it. Later Under Secretary of State; died in 1965.", faction: "alliedPacific", rank: 3 },
  Halsey: { role: "Vice Admiral: Task Force 16, Doolittle Raid escort", summary: "Commanded the carrier task force that launched the Doolittle Raid, and made the call to launch early once the force was spotted by a Japanese picket boat rather than risk the carriers searching for a better position. Later commanded the Third Fleet through the war's final years; died in 1959.", faction: "alliedPacific", rank: 2 },
  Doolittle: { role: "Lieutenant Colonel: commander, Tokyo Raid", summary: "Led the sixteen-bomber raid on Tokyo that carried his name, personally flying the lead aircraft despite holding a rank that made the mission's actual risk to him a matter of real internal debate beforehand. Promoted to Brigadier General immediately after the raid and awarded the Medal of Honor; later commanded the Eighth Air Force; died in 1993.", faction: "alliedPacific", rank: 2 },
  Stimson: { role: "Secretary of War", summary: "Oversaw the Manhattan Project's military administration and personally removed Kyoto from the atomic target list over the objections of officers who considered it operationally ideal, on cultural and historical grounds he was unwilling to compromise on even under wartime pressure. Retired shortly after the war's end; died in 1950.", faction: "alliedPacific", rank: 1 },
  Groves: { role: "Major General: director, Manhattan Project", summary: "Ran the Manhattan Project's military side with a famously singular focus on the mission's success, favoring target selection criteria that preserved the bomb's effects as a clean, measurable baseline over cities already damaged by conventional bombing. Left the Army in 1948; died in 1970.", faction: "alliedPacific", rank: 2 },
  Compton: { role: "Physicist: Manhattan Project, National Defense Research Committee", summary: "A Nobel laureate and member of the Scientific Panel that advised the Interim Committee in June 1945 and recommended using the bomb on Japan without a prior demonstration. Later chancellor of Washington University in St. Louis; died in 1962.", faction: "alliedPacific", rank: 3 },
  Franck: { role: "Physicist: chairman of the committee that wrote the Franck Report", summary: "A Nobel laureate who chaired the Manhattan Project scientists whose June 1945 report urged a demonstration of the atomic bomb before any use on a populated city, a minority position among the scientists and officials the Interim Committee consulted. Died in 1964.", faction: "alliedPacific", rank: 3 },
  Blamey: { role: "General: Commander, Allied Land Forces, Australia", summary: "Backed his commanders' fighting-withdrawal strategy on the Kokoda Track against considerable pressure from MacArthur, who read the retreat as a failure of Australian fighting quality rather than the sound tactical choice historians now generally consider it. Australia's only field marshal; died in 1951.", faction: "alliedPacific", rank: 2 },
  Mitscher: { role: "Vice Admiral: Task Force 58 carrier commander", summary: "Argued for an aggressive pursuit of Ozawa's fleet at the Philippine Sea over Spruance's more protective posture, a disagreement about carrier doctrine that recurred in various forms for the rest of the war. Later commanded fast carrier task forces through the war's end; died in 1947.", faction: "alliedPacific", rank: 2 },
  Roosevelt: { role: "President of the United States", summary: "Set Allied war aims at the Casablanca Conference in January 1943, announcing unconditional surrender as declared policy against Germany, Italy, and Japan alike, citing the perceived mistake of the 1918 armistice that let German militarists later claim they were never truly defeated. Committed the United States to Europe First at Arcadia weeks after Pearl Harbor, a priority the Pacific command spent the whole war arguing hadn't been given enough of the resources it was owed. Died in office in April 1945, four months before Japan's surrender; did not live to see the war he'd shaped end.", faction: "alliedPacific", rank: 0 },
  Curtin: { role: "Prime Minister of Australia", summary: "Publicly declared in December 1941 that Australia looked to America rather than Britain for its defense, and defied Churchill's attempt to redirect Australian troops to Burma in early 1942, insisting they return home instead. Died in office in July 1945, weeks before the war he'd spent it directing Australia through actually ended.", faction: "alliedPacific", rank: 1 },
  Churchill: { role: "Prime Minister of the United Kingdom", summary: "Pushed hard to keep Australian divisions committed to the wider Commonwealth war effort even as Singapore fell and Australia's own home defense looked increasingly urgent, straining the Australian-British relationship badly enough that Curtin looked to Washington instead. Argued consistently for Europe First at every Allied conference, a priority he and Roosevelt agreed on more readily than either did with their own Pacific commanders. Voted out of office in a landslide in July 1945, before the war he'd led Britain through actually ended; returned as Prime Minister in 1951; died in 1965.", faction: "alliedPacific", rank: 0 },
  Biddle: { role: "Attorney General", summary: "Opposed the forced removal of Japanese Americans from the West Coast, arguing the Justice Department had no evidence to support the military necessity claim being used to justify it, and lost the argument to the War Department. Later served as the American judge at the Nuremberg trials; died in 1968.", faction: "alliedPacific", rank: 1 },
  Marshall: { role: "General: Army Chief of Staff", summary: "The organizer of the wartime Army from a fraction of its final size, and the strongest voice for the Europe First doctrine confirmed at Arcadia, arguing Germany was the only enemy capable of winning the war outright before America was ready to stop it. Later revived a seriously argued 1945 proposal to use gas against Japanese cave defenses during the planned home-islands invasion, a proposal Truman ultimately declined. Author of the postwar Marshall Plan bearing his name; awarded the Nobel Peace Prize in 1953, the only career soldier to receive it.", faction: "alliedPacific", rank: 0 },
  King: { role: "Fleet Admiral: Commander in Chief, U.S. Fleet", summary: "Fought the Navy's corner in every Europe First conference and kept the Pacific resourced despite the formal priority, a persistent and occasionally abrasive advocate for a theater he felt was chronically underweighted. Retired in 1945; died in 1956.", faction: "alliedPacific", rank: 1 },
  Nimitz: { role: "Fleet Admiral: Commander in Chief, Pacific Fleet", summary: "Took command days after Pearl Harbor, when American morale and the fleet's own material state were both at their lowest point of the war, and staked its remaining three carriers on codebreaking intelligence at Midway, a wager that became the Pacific war's turning point. Balanced Central Pacific island-hopping against MacArthur's Southwest Pacific priorities for years without the command structure ever fully resolving which theater actually came first. Accepted the Japanese surrender aboard USS Missouri; later Chief of Naval Operations; died in 1966, remembered as uncommonly unflappable even by his own command's standards.", faction: "alliedPacific", rank: 0 },
  Fletcher: { role: "Rear Admiral: Task Force 17", summary: "Commanded the American carrier forces at both Coral Sea and Midway, cautious with his ships in a war that could not yet afford to lose them carelessly. Later commanded the North Pacific Force; died in 1973.", faction: "alliedPacific", rank: 2 },
  Pye: { role: "Vice Admiral: acting Commander in Chief, Pacific Fleet", summary: "Held temporary command of the Pacific Fleet in the weeks after Pearl Harbor and made the actual decision to recall the Wake Island relief force, a call that remains one of the most argued-over of the early Pacific war. Reverted to his prior command after Nimitz's arrival; died in 1959.", faction: "alliedPacific", rank: 2 },
  Ghormley: { role: "Vice Admiral: South Pacific Area commander", summary: "Oversaw the planning for the Guadalcanal landing on a compressed and under-resourced timetable he privately doubted was adequate. Relieved of command in October 1942 amid the campaign's darkest weeks; served in administrative posts for the war's remainder; died in 1958.", faction: "alliedPacific", rank: 3 },
  "Holland Smith": { role: "Lieutenant General: V Amphibious Corps", summary: "A leading advocate of direct amphibious assault over bypass strategy, and the Marine Corps' most influential voice on fortified-atoll doctrine through the Central Pacific campaign. Retired after the war with the nickname 'Howlin' Mad' intact; died in 1967.", faction: "alliedPacific", rank: 2 },
  MacArthur: { role: "General: Supreme Commander, Southwest Pacific Area", summary: "Left the Philippines in 1942 promising to return, and spent two years making both the strategic and moral case for doing so over the Navy's preference for bypassing them entirely. Accepted the Japanese surrender and administered the postwar occupation of Japan; relieved of Korean War command in 1951; died in 1964.", faction: "alliedPacific", rank: 1 },
  Kenney: { role: "General: Commander, Fifth Air Force", summary: "Developed and championed low-altitude skip-bombing tactics against Japanese shipping, applied with devastating effect at the Bismarck Sea, one of the most lopsided air-versus-naval engagements of the war. Later commanded Far East Air Forces; retired from the Air Force in 1951; died in 1977.", faction: "alliedPacific", rank: 2 },
  Osmeña: { role: "President of the Philippine Commonwealth government-in-exile", summary: "Succeeded Manuel Quezon as president when Quezon died in August 1944, weeks before the Leyte landing, and waded ashore beside MacArthur in a moment the newsreels used to represent a leader who wasn't there to see it. Served as President until losing the 1946 election shortly after the Philippines gained independence; died in 1961.", faction: "alliedPacific", rank: 2 },
  Wainwright: { role: "Lieutenant General: Philippines commander after MacArthur's evacuation", summary: "Inherited command of the doomed Bataan and Corregidor garrisons after MacArthur left for Australia, and was ultimately forced to surrender the largest American force in history to that point. Survived brutal Japanese captivity for the rest of the war; present at the formal Japanese surrender in 1945; died in 1953.", faction: "alliedPacific", rank: 2 },
  Sutherland: { role: "Major General: MacArthur's Chief of Staff", summary: "Ran MacArthur's Southwest Pacific Area headquarters with a famously controlling grip on what reached the general's desk, to the point other senior officers routinely complained of having to go through him rather than around him. Fell out of favor after the war over a personal scandal involving an Australian officer; died in 1966.", faction: "alliedPacific", rank: 2 },
  Webb: { role: "President of the International Military Tribunal for the Far East", summary: "Presided over the Tokyo war crimes trials and was known to be personally frustrated by the political decision to exempt Hirohito from prosecution despite testimony implicating the imperial government at every level below the throne. Returned to the Australian judiciary after the tribunal concluded; died in 1972.", faction: "alliedPacific", rank: 2 },
  Eichelberger: { role: "General: Eighth Army commander under MacArthur", summary: "Took Buna in a grinding 1942 campaign MacArthur's headquarters publicly credited to MacArthur himself, a lasting source of friction between the two men that never became open insubordination. Commanded occupation forces in Japan after the war; died in 1961.", faction: "alliedPacific", rank: 2 },
  Attlee: { role: "British Prime Minister (from July 1945)", summary: "Won the 1945 general election by landslide against Churchill and inherited Britain's role in the Pacific war's final weeks and the postwar settlement that followed, generally favoring more shared Allied authority over occupied Japan than the arrangement the United States actually pursued. Led Britain's postwar Labour government through 1951, including creation of the National Health Service; died in 1967.", faction: "alliedPacific", rank: 1 },
  LeMay: { role: "Major General: XXI Bomber Command", summary: "Directed the incendiary bombing campaign against Japanese cities and was among the strongest advocates that blockade and air power alone might force surrender without a home-islands invasion. Later led Strategic Air Command and served as Air Force Chief of Staff; died in 1990.", faction: "alliedPacific", rank: 2 },
};

const OBJECTIVES = [
  { id: "historian", title: "The Historical Officer", desc: "Match the historical decision at every comparable point in a run." },
  { id: "betterThanHistory", title: "Better Than the Record", desc: "Outperform the historical choice at 60%+ of comparable points." },
  { id: "forcePreserved", title: "The Force Preserved", desc: "Finish a war with Readiness at +4 or better." },
  { id: "againstOdds", title: "Against the Odds", desc: "Complete a war whose exact dice path had under 20% compound likelihood." },
  { id: "coup", title: "Recalled by the Hardliners", desc: "In Fanatical Resolve Mode, find out what happens when insubordination maxes out." },
  { id: "heldTheLine", title: "Held the Line", desc: "Complete a war under Fanatical Resolve Mode without being deposed." },
  { id: "quietPragmatism", title: "Quiet Pragmatism", desc: "In Fanatical Resolve Mode, take the non-dogmatic path at every opportunity and still hold command." },
  { id: "grandAlliance", title: "The Grand Alliance", desc: "Finish a war under Coalition Resolve Mode with the coalition strongly intact." },
  { id: "papersOverCracks", title: "Paper Over the Cracks", desc: "Finish a war under Coalition Resolve Mode with the coalition critically frayed, and hold it together anyway." },
  { id: "japanHistorian", title: "By the Book, IGHQ", desc: "Complete a Japanese war matching the historical record at every comparable decision." },
  { id: "alliedPacificHistorian", title: "By the Book, CINCPAC", desc: "Complete an Allied Pacific war matching the historical record at every comparable decision." },
  { id: "speculativeFile", title: "The Speculative File", desc: "Reach an ending built entirely on a fork the historical record never took." },
  { id: "bothSeats", title: "Both Sides of the Pacific", desc: "Complete a war from both IGHQ and Allied Pacific Command." },
  { id: "longShotDivergence", title: "Against Every Expectation", desc: "Reach a non-historical ending by a dice path with under 20% compound likelihood." },
  { id: "threeDoctrines", title: "The Complete Strategist", desc: "Select three different grand strategy doctrines across separate wars." },
  { id: "commandWithoutItsCommander", title: "The General Who Wasn't There", desc: "Reach an occupation authority decided without MacArthur present to make it." },
  { id: "roadNotTaken", title: "The Demonstration Attempted", desc: "Reach an ending on the path where the atomic demonstration was actually tried." },
  { id: "wellTraveled", title: "A Well-Traveled File", desc: "Visit at least 40 distinct situation reports across all your wars." },
];

function evaluateObjectives(ctx) {
  const { campaignId, flags, meters, log, rewinds, mode } = ctx;
  const comparable = (log || []).filter((e) => e.histSum != null);
  const matched = comparable.filter((e) => e.isHistorical).length;
  const outperformed = comparable.filter((e) => e.sum > e.histSum).length;
  const rolls = (log || []).filter((e) => e.rollP != null);
  const compound = rolls.reduce((a, e) => a * e.rollP, 1);
  const earned = [];
  if (comparable.length >= 4 && matched / comparable.length >= 0.95) earned.push("historian");
  if (campaignId === "japan" && comparable.length >= 4 && matched / comparable.length >= 0.95) earned.push("japanHistorian");
  if (campaignId === "alliedPacific" && comparable.length >= 4 && matched / comparable.length >= 0.95) earned.push("alliedPacificHistorian");
  if (comparable.length >= 4 && outperformed / comparable.length >= 0.6) earned.push("betterThanHistory");
  if ((meters.readiness || 0) >= 4) earned.push("forcePreserved");
  if (rolls.length >= 1 && compound < 0.2) earned.push("againstOdds");
  if (mode === "fanatical" && !flags.purged) earned.push("heldTheLine");
  if (flags.purged) earned.push("coup");
  if (mode === "coalition" && (flags.cohesion || 0) >= 3) earned.push("grandAlliance");
  if (mode === "coalition" && (flags.cohesion || 0) <= -4 && !flags.relieved) earned.push("papersOverCracks");
  const altFlags = [
    flags.openingVector === "southBlitz",
    flags.coralSeaPath === "consolidate",
    flags.midwayPath === "diverted",
    flags.guadalcanalPath === "earlyWithdraw",
    flags.leytePath === "abandonPhilippines",
    flags.arcadiaPath === "pacificParity",
    flags.midwayAlliedPath === "conservative",
    flags.guadalcanalAlliedPath === "delay",
    flags.centralPacificPath === "assault",
    flags.centralPacificPath === "hybrid",
    flags.philippinesPath === "bypassFormosa",
    flags.endgameAlliedPath === "blockade",
    flags.endgameAlliedPath === "both",
    flags.endgameAlliedPath === "accelerated",
    flags.mainlandPath === "bothResourced",
    flags.endgamePath === "surrenderInquiry",
    !!flags.washingtonPath,
    !!flags.fsPath,
    !!flags.fsAlliedPath,
  ];
  if (altFlags.some(Boolean)) earned.push("speculativeFile");
  if (altFlags.some(Boolean) && rolls.length >= 1 && compound < 0.2) earned.push("longShotDivergence");
  if (flags.occupationPath === "singleAuthority" || flags.occupationPath === "councilStructure")
    earned.push("commandWithoutItsCommander");
  if (flags.demonstrationPath === "attempt") earned.push("roadNotTaken");
  return earned;
}


async function withRetry(fn, attempts = 3, delayMs = 250) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

async function saveActiveRun(payload) {
  try {
    await withRetry(() => window.storage.set("ww2-command-active", JSON.stringify(payload)));
    return true;
  } catch (e) {
    return false;
  }
}

async function clearActiveRun() {
  try {
    await withRetry(() => window.storage.delete("ww2-command-active"));
  } catch (e) {
    // nothing to clear
  }
}

async function saveRunRecord(campaign, flags, meters, visited, mode, log, rewinds, favor) {
  try {
    let record = { runs: [], nodes: [] };
    try {
      const existing = await window.storage.get("ww2-command-record");
      if (existing && existing.value) record = JSON.parse(existing.value);
    } catch (e) {
      // no existing record — first run
    }
    const objectivesBefore = new Set(record.objectives || []);
    record.runs = (record.runs || []).slice(-24);
    record.runs.push({
      when: Date.now(),
      label: campaign.positionLabel ? campaign.positionLabel(flags, meters) : null,
      endDate: log && log.length > 0 ? log[log.length - 1].date : null,
      mode: mode || "open",
    });
    record.nodes = [...new Set([...(record.nodes || []), ...visited])];
    const earned = evaluateObjectives({ campaignId: campaign.id, flags, meters, log, rewinds, mode, favor });
    record.objectives = [...new Set([...(record.objectives || []), ...earned])];
    record.campaignsPlayed = [...new Set([...(record.campaignsPlayed || []), campaign.id])];
    if (record.campaignsPlayed.length >= 2 && !record.objectives.includes("bothSeats"))
      record.objectives.push("bothSeats");
    if (flags.doctrinePath) {
      record.doctrinesPlayed = [...new Set([...(record.doctrinesPlayed || []), flags.doctrinePath])];
      if (record.doctrinesPlayed.length >= 3 && !record.objectives.includes("threeDoctrines"))
        record.objectives.push("threeDoctrines");
    }
    if (record.nodes.length >= 40 && !record.objectives.includes("wellTraveled"))
      record.objectives.push("wellTraveled");
    const advisors = record.advisors || {};
    (log || []).forEach((e) => {
      if (e.advisor) advisors[e.advisor] = (advisors[e.advisor] || 0) + 1;
    });
    record.advisors = advisors;
    await withRetry(() => window.storage.set("ww2-command-record", JSON.stringify(record)), 5, 400);
    const newlyEarned = (record.objectives || []).filter((id) => !objectivesBefore.has(id));
    return newlyEarned;
  } catch (e) {
    return [];
  }
}

function resolveStage(campaign, position, flags, meters) {
  return campaign.dynamic
    ? campaign.resolveNode(position, flags, meters)
    : campaign.getStage(position, flags, meters);
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Nothing to report to — this is a client-only artifact. Keeping the error
    // visible in the console is the best available diagnostic for a bug report.
    console.error("WW2 Command crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          tabIndex={-1}
          ref={(el) => el && el.focus()}
          className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10 text-center focus:outline-none"
        >
          <div className="bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full max-w-md p-8">
            <h2 className="text-2xl mb-3" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}>
              The File Was Damaged
            </h2>
            <p className="text-[14px] leading-relaxed mb-6 text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              Something in this session went wrong in a way the game couldn't recover from on its own.
              Your progress autosaves as you play, so reloading should return you to the menu with a
              "War in Progress" option to resume close to where you left off.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full border-2 border-black px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

