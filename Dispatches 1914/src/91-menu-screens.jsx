// =============================================================================
// THE FRONT SCREENS: THE COMMANDS, THE BRIEFING, HOW TO PLAY, SETTINGS
// =============================================================================
//
// The menu lists the six commands by side, so that it is plain which is which; the briefing that follows a choice says where the command
// stands, what seat the player holds and what they will be asked, and is where the file is set up (the difficulty and whether the battles
// are planned by hand); How to play holds what the game is and what it leaves out; Settings holds what is kept on the device.
// The text is in 66-briefings.jsx and 60-glossary.jsx.

const SIDES = [
  { id: "central", label: "The Central Powers", ids: ["ohl", "aok", "otto"] },
  { id: "entente", label: "The Entente", ids: ["gqg", "stavka", "bef"] },
];

/** What the war record says of one command, for its card: reports seen and the best rank. */
function commandProgress(record, cid) {
  const seen = (record.nodes[cid] || []).length;
  const best = (record.best || {})[cid];
  return { seen, best: best ? best.rank : null };
}

function MenuScreen({ onPick, onRecord, onHowTo, onSettings, savedRun, onResume, onDiscard, record }) {
  const saved = useMemo(() => {
    if (!savedRun) return null;
    try {
      return resolveNode(savedRun.nodeId, savedRun.flags, savedRun.meters, savedRun.hardState);
    } catch (e) {
      return null;
    }
  }, [savedRun]);
  const nodesSeen = Object.values(record.nodes).reduce((n, l) => n + l.length, 0);
  const card = (cid) => {
    const c = CAMPAIGNS[cid];
    const b = BRIEFINGS[cid];
    const playable = Object.keys(c.nodes).length > 0;
    const p = commandProgress(record, cid);
    const decisions = Object.values(c.nodes).filter((n) => !n.ending).length;
    return (
      <button key={cid} className="dg-cmd" disabled={!playable} onClick={() => playable && onPick(cid)}>
        <span className="dg-cmd-band" style={{ background: CAMPAIGN_BANDS[cid] }} aria-hidden="true" />
        <span className="dg-cmd-seal" aria-hidden="true">{c.seal}</span>
        <span className="dg-cmd-body">
          <span className="dg-cmd-nation">{b.nation}</span>
          <span className="dg-cmd-name">{b.title}</span>
          <span className="dg-cmd-native">{c.name} · {c.seat}</span>
          <span className="dg-cmd-pitch">{b.pitch}</span>
          <span className="dg-cmd-meta">
            {nodeDate(cid, c.span.from, true)} to {nodeDate(cid, c.span.to, true)} · {decisions} decisions
            {p.best ? ` · best rank ${p.best}` : p.seen ? " · begun" : ""}
          </span>
        </span>
      </button>
    );
  };
  return (
    <main {...rootProps(null, "menu")}>
      <div className="dg-filerow"><span>File No. 1914</span><span className="r">Restricted</span></div>
      <h1 className="dg-title">DISPATCHES<br />1914</h1>
      <p className="dg-sub">Six headquarters of the First World War. Pick one, read the briefing, and give the orders it gave.</p>
      <hr className="dg-rule" />

      {saved && (
        <section className="dg-banner" aria-label="Saved file">
          <p>
            <b>File in progress.</b> {CAMPAIGNS[savedRun.campaignId].shortName} · {nodeDate(savedRun.campaignId, saved.date)} · {saved.title}
            {savedRun.hardState.enabled ? " · hard mode" : savedRun.easy ? " · easy mode" : ""}
          </p>
          <p className="small">Starting a new file replaces this one.</p>
          <button className="dg-btn" onClick={onResume}>Resume file</button>{" "}
          <button className="dg-btn" onClick={onDiscard}>Discard</button>
        </section>
      )}

      {nodesSeen === 0 && (
        <p className="dg-first">
          New here? How to play takes two minutes. <button className="dg-btn" onClick={onHowTo}>How to play</button>
        </p>
      )}

      {SIDES.map((side) => (
        <section key={side.id} aria-label={side.label}>
          <h2 className="dg-sect">{side.label}</h2>
          {side.ids.map(card)}
        </section>
      ))}

      <h2 className="dg-sect">The game</h2>
      <nav className="dg-nav" aria-label="The game">
        <button className="dg-navbtn" onClick={onHowTo}><b>How to play</b><span>Reading a report, orders and risk, battles, what the game leaves out</span></button>
        <button className="dg-navbtn" onClick={onRecord}>
          <b>War record</b>
          <span>{nodesSeen} of {nodeTotal()} reports seen · {record.endings.length} of {buildEndings().length} endings found</span>
        </button>
        <button className="dg-navbtn" onClick={onSettings}><b>Settings</b><span>Text size, colours, type, spacing, motion, sound and signing</span></button>
      </nav>
    </main>
  );
}

const MODE_ROWS = [
  { id: "easy", label: "Easy mode", text: "Shows what each order will do to the meters, marks the order the command really gave, and lets you take back the last order. It cannot reach the highest rank." },
  { id: "standard", label: "Standard", text: "Every command plays on the same triangle of manpower, munitions and will. Nothing is shown in advance." },
  { id: "hard", label: "Hard mode", text: null },
];

function BriefingScreen({ campaignId, mode, onMode, settings, onSettings, onEnter, onBack, onHowTo }) {
  const c = CAMPAIGNS[campaignId];
  const b = BRIEFINGS[campaignId];
  const labels = meterLabels(campaignId);
  const first = useMemo(() => resolveNode(c.startNode, {}, emptyMeters(), emptyHardState()), [campaignId]);
  const modeText = (row) => (row.id === "hard" ? `Adds an erosion track: ${c.hardMode.description.charAt(0).toLowerCase()}${c.hardMode.description.slice(1)} At the limit your freedom to choose ends and a fixed ending follows.` : row.text);
  const manpower = METER_STRANDS.manpower.map((s) => s.name).join(", ");
  const munitions = METER_STRANDS.munitions.map((s) => s.name).join(", ");
  return (
    <main {...rootProps(campaignId, "briefing")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow">
        <span>{c.docLabel}</span>
        <button className="dg-btn" onClick={onBack}>Back to the commands</button>
      </div>
      <p className="dg-count">{b.title}</p>
      <h1 className="dg-title dg-title-sm">{b.nation}</h1>
      <p className="dg-sub">{c.name} · {c.seat}<br />{nodeDate(campaignId, c.span.from)} to {nodeDate(campaignId, c.span.to)}</p>
      <hr className="dg-rule" />

      <h2 className="dg-sect">Where things stand</h2>
      {b.standing.map((p, i) => <p key={i} className="dg-prose dg-brief">{p}</p>)}
      <FrontMapPanel campaignId={campaignId} node={first} visited={[]} />

      <h2 className="dg-sect">Your seat</h2>
      <p className="dg-prose dg-brief">{b.seat}</p>

      <h2 className="dg-sect">What you will be asked</h2>
      <p className="dg-prose dg-brief">The first report is dated {nodeDate(campaignId, first.date)}, at {first.city}. {b.question}</p>
      <p className="dg-note">Three meters carry the cost of every order. <b>{labels.manpower}</b> is the army and the officers who lead it ({manpower.toLowerCase()}). <b>{labels.munitions}</b> is what feeds it ({munitions.toLowerCase()}). <b>{labels.will}</b> is {c.willMeaning.charAt(0).toLowerCase()}{c.willMeaning.slice(1)}</p>
      <p className="dg-note"><button className="dg-btn" onClick={onHowTo}>How to play</button></p>

      <h2 className="dg-sect">Set up the file</h2>
      <div className="dg-seg" role="group" aria-label="Difficulty">
        {MODE_ROWS.map((row) => (
          <button key={row.id} aria-pressed={mode === row.id} onClick={() => onMode(row.id)}>{row.label}</button>
        ))}
      </div>
      <p className="dg-note" aria-live="polite">
        {modeText(MODE_ROWS.find((r) => r.id === mode))}
        {mode === "easy" && EASY_NAMES[campaignId] ? ` In this command easy mode is called ${EASY_NAMES[campaignId]}.` : ""}
      </p>
      <label className="dg-check">
        <input type="checkbox" checked={settings.battles !== false} onChange={(e) => onSettings({ ...settings, battles: e.target.checked })} />
        <span>Take control of battle planning. {settings.battles !== false
          ? "The battles that have an Order of Battle (" + Object.keys(BATTLES).length + " in all) open on a planning screen: you place the counters, name a commander and choose the approach."
          : "Switched off, those battles are rolled as ordinary orders, at the same odds as the staff's plan."}</span>
      </label>

      <button className="dg-btn dg-go" onClick={onEnter}>Enter the war room</button>
    </main>
  );
}

function HowToScreen({ onBack }) {
  return (
    <main {...rootProps(null, "howto")}>
      <div className="dg-filerow"><span>File No. 1914</span><button className="dg-btn" onClick={onBack}>Back</button></div>
      <h1 className="dg-title dg-title-sm">How to play</h1>
      <hr className="dg-rule" />
      <nav className="dg-jumps" aria-label="On this page">
        {[...HOW_TO, { id: "leaves", title: "What the game leaves out" }].map((s) => <a key={s.id} href={"#howto-" + s.id} onClick={(e) => { e.preventDefault(); const h = document.getElementById("howto-" + s.id); if (h) { h.scrollIntoView({ block: "start" }); h.focus({ preventScroll: true }); } }}>{s.title}</a>)}
      </nav>
      {HOW_TO.map((s) => (
        <section key={s.id}>
          <h2 id={"howto-" + s.id} tabIndex={-1} className="dg-sect">{s.title}</h2>
          {s.paras.map((p, i) => <p key={i} className="dg-prose dg-brief">{p}</p>)}
        </section>
      ))}
      <section>
        <h2 id="howto-leaves" tabIndex={-1} className="dg-sect">What the game leaves out</h2>
        {LEAVES_OUT.map((p, i) => <p key={i} className="dg-prose dg-brief">{p}</p>)}
      </section>
      <button className="dg-btn" onClick={onBack}>Back</button>
    </main>
  );
}

const SPACING_ROWS = [["standard", "Standard"], ["roomy", "Roomy"], ["wide", "Wide"]];
const MEASURE_ROWS = [["standard", "Standard"], ["narrow", "Narrow"]];
const MOTION_ROWS = [["auto", "Follow my device"], ["reduced", "Reduce motion"]];
const FONT_ROWS = [["theme", "The look's own"], ["typewriter", "Typewriter"], ["plain", "Plain and clear"]];

function SettingsScreen({ settings, onSettings, onBack }) {
  const size = Math.max(0, TEXT_SIZES.indexOf(settings.textSize));
  const set = (patch) => onSettings({ ...settings, ...patch });
  return (
    <main {...rootProps(null, "settings")}>
      <div className="dg-filerow"><span>File No. 1914</span><button className="dg-btn" onClick={onBack}>Back</button></div>
      <h1 className="dg-title dg-title-sm">Settings</h1>
      <hr className="dg-rule" />
      <p className="dg-note">Kept on this device only.</p>

      <h2 className="dg-sect">Reading</h2>
      <div className="dg-setting">
        <label id="dg-size-l" htmlFor="dg-size" className="dg-count">Text size: {TEXT_SIZE_LABELS[TEXT_SIZES[size]]}</label>
        <input id="dg-size" type="range" className="dg-range" min="0" max={TEXT_SIZES.length - 1} step="1" value={size}
          aria-labelledby="dg-size-l" aria-valuetext={TEXT_SIZE_LABELS[TEXT_SIZES[size]]}
          onChange={(e) => set({ textSize: TEXT_SIZES[Number(e.target.value)] })} />
        <div className="dg-ticks" aria-hidden="true">{TEXT_SIZES.map((s) => <span key={s}>{TEXT_SIZE_LABELS[s]}</span>)}</div>
        <p className="dg-prose dg-sample">The Chief of the General Staff has four days of rail capacity and six corps to move.</p>
      </div>
      <div className="dg-setting">
        <div className="dg-count">Colours</div>
        <div className="dg-swatches" role="group" aria-label="Colours">
          {["sepia", "paper", "night", "contrast", "auto"].map((id) => {
            const t = id === "auto" ? null : THEME_TOKENS[id].base;
            return (
              <button key={id} className="dg-sw" aria-pressed={(settings.theme || DEFAULT_THEME) === id} onClick={() => set({ theme: id })}>
                <span className="dg-sw-chip" aria-hidden="true" style={t ? { background: t.paper, color: t.ink, borderColor: t.ink } : { background: "linear-gradient(90deg,#1c1a17 50%,#f4efe2 50%)", color: "#888" }}>Aa</span>
                <span>{THEME_LABELS[id]}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="dg-setting">
        <div className="dg-count">Type</div>
        <div className="dg-seg" role="group" aria-label="Type">
          {FONT_ROWS.map(([id, label]) => (
            <button key={id} aria-pressed={(settings.font || "theme") === id} onClick={() => set({ font: id })}>{label}</button>
          ))}
        </div>
      </div>

      <div className="dg-setting">
        <div className="dg-count">Line spacing</div>
        <div className="dg-seg" role="group" aria-label="Line spacing">
          {SPACING_ROWS.map(([id, label]) => (
            <button key={id} aria-pressed={(settings.spacing || "standard") === id} onClick={() => set({ spacing: id })}>{label}</button>
          ))}
        </div>
      </div>
      <div className="dg-setting">
        <div className="dg-count">Line length</div>
        <div className="dg-seg" role="group" aria-label="Line length">
          {MEASURE_ROWS.map(([id, label]) => (
            <button key={id} aria-pressed={(settings.measure || "standard") === id} onClick={() => set({ measure: id })}>{label}</button>
          ))}
        </div>
        <p className="dg-note">A narrow line keeps the report to about thirty-four characters across, which is easier to track on a wide screen.</p>
      </div>
      <div className="dg-setting">
        <div className="dg-count">Motion</div>
        <div className="dg-seg" role="group" aria-label="Motion">
          {MOTION_ROWS.map(([id, label]) => (
            <button key={id} aria-pressed={(settings.motion || "auto") === id} onClick={() => set({ motion: id })}>{label}</button>
          ))}
        </div>
        <p className="dg-note">Follow my device obeys the system setting. Reduce motion stops the marching front line on the map, the stamp, the reports sliding in and the dials moving, whatever the system says.</p>
      </div>
      <div className="dg-setting">
        <button className="dg-btn" onClick={() => set({ font: "plain", spacing: "roomy", measure: "narrow", motion: "reduced" })}>Easy reading: plain type, roomy spacing, narrow lines, no motion</button>
      </div>

      <h2 className="dg-sect">Playing</h2>
      <div className="dg-setting">
        <div className="dg-count">Signing a risky order</div>
        <div className="dg-seg" role="group" aria-label="Signing a risky order">
          {[[true, "Hold to sign"], [false, "Tap to sign"]].map(([v, label]) => (
            <button key={label} aria-pressed={(settings.holdToSign !== false) === v} onClick={() => set({ holdToSign: v })}>{label}</button>
          ))}
        </div>
        <p className="dg-note">A contested order is signed by holding the button for a moment. Tap to sign does it at once, for a keyboard or a hand that cannot hold.</p>
      </div>
      <div className="dg-setting">
        <div className="dg-count">Sound</div>
        <div className="dg-seg" role="group" aria-label="Sound">
          {[["Off", false, false], ["Typewriter", true, false], ["Atmosphere", true, true]].map(([label, snd, atm]) => (
            <button key={label} aria-pressed={settings.sound === snd && Boolean(settings.atmosphere) === atm} onClick={() => set({ sound: snd, atmosphere: atm })}>{label}</button>
          ))}
        </div>
        <p className="dg-note">Typewriter is the key and the stamp. Atmosphere adds distant guns, wind and rain for the command in play, and small sounds for a cable, a seal and a signature.</p>
      </div>

      <h2 className="dg-sect">Dates</h2>
      <div className="dg-setting">
        <p className="dg-note dg-fixed"><b>Calendar: United Kingdom.</b> Every date is written as in the UK, 4 August 1914, and reckoned in the Western calendar. The Russian command's Old Style dates and the Ottoman Rumi dates are converted. This cannot be changed.</p>
      </div>

      <div className="dg-setting">
        <button className="dg-btn" onClick={() => onSettings(defaultSettings())}>Return all settings to the defaults</button>
      </div>
      <button className="dg-btn" onClick={onBack}>Back</button>
    </main>
  );
}
