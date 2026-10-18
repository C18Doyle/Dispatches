// =============================================================================
// THE FRONT SCREENS: THE COMMANDS, THE BRIEFING, HOW TO PLAY, SETTINGS
// =============================================================================
//
// The menu lists the six commands by side, so that it is plain which is which; the briefing that follows a choice says where the command
// stands and what seat the player holds, and is where the file is set up (the difficulty and whether the battles are planned by hand);
// How to play, reached from Settings, holds what the game is and what it leaves out; Settings holds what is kept on the device.
// The text is in 66-briefings.jsx and 60-glossary.jsx.

// The free demo (build.mjs makes it with DEMO_BUILD true): one command, its first DEMO_DECISIONS orders, the standard file only, and an ending screen that
// points to the full game. The French command is the demo because its first six orders carry the whole game in small: contested orders, the staff's
// beliefs, the Marne as an Order of Battle, and a front that moves. RIG is the battle rig (DEV_RIG true, dist/rig): a menu entry that opens any battle at once.
const DEMO = DEMO_BUILD;
const DEMO_COMMAND = "gqg";
const DEMO_DECISIONS = 6;
const FULL_GAME_URL = "https://dispatches.itch.io/dispatches-1914";
const RIG = DEV_RIG;

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

function MenuScreen({ onPick, onRecord, onSettings, onRig, savedRun, onResume, onDiscard, record }) {
  const saved = useMemo(() => {
    if (!savedRun) return null;
    try {
      return resolveNode(savedRun.nodeId, savedRun.flags, savedRun.meters, savedRun.hardState);
    } catch (e) {
      return null;
    }
  }, [savedRun]);
  const card = (cid) => {
    const c = CAMPAIGNS[cid];
    const b = BRIEFINGS[cid];
    const playable = Object.keys(c.nodes).length > 0 && (!DEMO || cid === DEMO_COMMAND);
    const p = commandProgress(record, cid);
    return (
      <button key={cid} className="dg-cmd" disabled={!playable} onClick={() => playable && onPick(cid)}>
        <span className="dg-cmd-band" style={{ background: CAMPAIGN_BANDS[cid] }} aria-hidden="true" />
        <span className={"dg-cmd-seal" + (c.seal.length > 4 ? " long" : "")} aria-hidden="true">{c.seal}</span>
        <span className="dg-cmd-body">
          <span className="dg-cmd-nation">{b.nation}</span>
          <span className="dg-cmd-quote">{"\u201C"}{b.quote.text}{"\u201D"}</span>
          <span className="dg-cmd-by">{b.quote.by}</span>
          <span className="dg-cmd-meta">
            {nodeDate(cid, c.span.from)}
            {p.best ? ` \u00B7 best rank ${p.best}` : ""}
          </span>
          {DEMO && cid !== DEMO_COMMAND && <span className="dg-cmd-locked">In the full game</span>}
        </span>
      </button>
    );
  };
  return (
    <main {...rootProps(null, "menu")}>
      <h1 className="dg-title">DISPATCHES<br />1914</h1>
      <p className="dg-sub">{"\u201C"}This war, like the next war, is a war to end war.{"\u201D"}</p>
      <p className="dg-sub-by">David Lloyd George<span>1916</span></p>
      <hr className="dg-rule" />
      {DEMO && <p className="dg-demo-note"><b>Free demo.</b> Play the first {DEMO_DECISIONS} orders of the French command. The full game has six commands and 71 endings.</p>}

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

      {SIDES.map((side) => (
        <section key={side.id} aria-label={side.label}>
          <h2 className="dg-sect">{side.label}</h2>
          {side.ids.map(card)}
        </section>
      ))}

      <nav className="dg-nav" aria-label="The game">
        <button className="dg-navbtn" onClick={onRecord}><b>War record</b></button>
        <button className="dg-navbtn" onClick={onSettings}><b>Settings</b></button>
        {RIG && <button className="dg-navbtn" onClick={onRig}><b>Battle rig</b></button>}
      </nav>
    </main>
  );
}

const MODE_ROWS = [{ id: "easy", label: "Easy mode" }, { id: "standard", label: "Standard" }, { id: "hard", label: "Hard mode" }];

/** What a file's mode changes, as short bullets (the numbers are INTEL.checks and INTEL.hardChecks, 68-intel.jsx, and the command's own erosion track). */
function modeBullets(mode, c) {
  const track = c.hardMode.description.charAt(0).toLowerCase() + c.hardMode.description.slice(1).replace(/\.$/, "");
  if (mode === "easy") return ["Each order shows what it will do to the meters", "The staff's reading is plain, with no fog", "The last order can be taken back", "The highest rank is out of reach"];
  if (mode === "hard") return [`An erosion track: ${track}`, `${INTEL.hardChecks} checks on the staff's beliefs, not ${INTEL.checks}`, "Some endings are reached only here"];
  return ["Orders show their odds in words", `${INTEL.checks} checks on the staff's beliefs`, "An order cannot be taken back"];
}

function BriefingScreen({ campaignId, mode, onMode, settings, onSettings, onEnter, onBack }) {
  const c = CAMPAIGNS[campaignId];
  const b = BRIEFINGS[campaignId];
  const first = useMemo(() => resolveNode(c.startNode, {}, emptyMeters(), emptyHardState()), [campaignId]);
  const bullets = modeBullets(mode, c);
  return (
    <main {...rootProps(campaignId, "briefing")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow">
        <span>{c.docLabel}</span>
        <button className="dg-btn" onClick={onBack}>Back to the commands</button>
      </div>
      <h1 className="dg-title dg-title-sm">{b.nation}</h1>
      <p className="dg-sub">{b.title} · {nodeDate(campaignId, c.span.from)}</p>
      <hr className="dg-rule" />

      <h2 className="dg-sect">Where things stand</h2>
      {b.standing.map((p, i) => <p key={i} className="dg-prose dg-brief">{p}</p>)}
      <FrontMapPanel campaignId={campaignId} node={first} visited={[]} />

      <h2 className="dg-sect">Your seat</h2>
      <p className="dg-prose dg-brief">{b.seat}</p>

      <h2 className="dg-sect">Set up the file</h2>
      {!DEMO && (
        <>
          <div className="dg-seg" role="group" aria-label="Difficulty">
            {MODE_ROWS.map((row) => (
              <button key={row.id} className="dg-mode" data-mode={row.id} aria-pressed={mode === row.id} onClick={() => onMode(row.id)}>
                {b.modes[row.id] && <span className="dg-mode-name">{b.modes[row.id]}</span>}
                <span className="dg-mode-tag">{row.label}</span>
              </button>
            ))}
          </div>
          <ul className="dg-bullets" data-mode={mode} aria-live="polite">
            {bullets.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </>
      )}
      <label className={"dg-planstamp" + (settings.battles !== false ? " on" : "")}>
        <input type="checkbox" checked={settings.battles !== false} onChange={(e) => onSettings({ ...settings, battles: e.target.checked })} />
        <span className="dg-planstamp-text">Take control of battle planning</span>
        <span className="dg-planstamp-mark" aria-hidden="true">{settings.battles !== false ? "Approved" : "Left to the staff"}</span>
      </label>

      <button className="dg-btn dg-go" onClick={onEnter}>Enter the war room</button>
    </main>
  );
}

/** Reads a report aloud with the browser's own voice, where it has one. */
function ReadAloud({ id, text }) {
  const [on, setOn] = useState(false);
  const can = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
  useEffect(() => () => { try { if (can) window.speechSynthesis.cancel(); } catch (e) { /* no voice here */ } }, [id]);
  if (!can) return null;
  const toggle = () => {
    const ss = window.speechSynthesis;
    if (on) { ss.cancel(); setOn(false); return; }
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.95;
    u.onend = () => setOn(false);
    u.onerror = () => setOn(false);
    ss.cancel();
    ss.speak(u);
    setOn(true);
  };
  return <button className="dg-btn dg-read" onClick={toggle}>{on ? "Stop reading" : "Read aloud"}</button>;
}

/** The end of the free demo: where the file stops, and what the full game is. */
function DemoEndScreen({ campaignId, onHome }) {
  const c = CAMPAIGNS[campaignId];
  return (
    <main {...rootProps(campaignId, "demoend")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow"><span>{c.docLabel} · END OF THE DEMO</span></div>
      <h1 className="dg-node-title">The demo ends here</h1>
      <p className="dg-prose dg-lede">You have given the first {DEMO_DECISIONS} orders of the French command, from the covering of the frontier to the race to the sea. The war has four years to run, and the file goes on to Verdun, the Nivelle offensive, the mutinies and the armistice.</p>
      <p className="dg-prose">The full game has six headquarters (German, French, Russian, British, Austro-Hungarian and Ottoman), over 200 decisions and 71 endings, with real documents at the head of the reports, the Order of Battle, and the Easy and Hard files.</p>
      <p><a className="dg-btn dg-go dg-link" href={FULL_GAME_URL} target="_blank" rel="noopener noreferrer">Get the full game</a></p>
      <button className="dg-btn" onClick={onHome}>Back to the commands</button>
    </main>
  );
}

/** The battle rig (a dev build only): every Order of Battle in a list, to open at once with the enemy's setup, the strain on the command and the mode chosen. */
function BattleRigScreen({ onFight, onBack }) {
  const list = Object.values(BATTLES);
  const [pick, setPick] = useState({});
  const [strain, setStrain] = useState("mid");
  const [easy, setEasy] = useState(false);
  const LEVEL = { low: -4, mid: 0, high: 4 };
  const meters = { manpower: LEVEL[strain], munitions: LEVEL[strain], will: LEVEL[strain] };
  return (
    <main {...rootProps(null, "rig")}>
      <div className="dg-filerow"><span /><button className="dg-btn" onClick={onBack}>Back</button></div>
      <h1 className="dg-title dg-title-sm">Battle rig</h1>
      <p className="dg-note">Each battle opens at its own report. The settings below apply to all.</p>
      <div className="dg-seg" role="group" aria-label="The meters">
        {[["low", "Meters low"], ["mid", "Meters level"], ["high", "Meters high"]].map(([id, label]) => (
          <button key={id} aria-pressed={strain === id} onClick={() => setStrain(id)}>{label}</button>
        ))}
      </div>
      <label className="dg-check"><input type="checkbox" checked={easy} onChange={(e) => setEasy(e.target.checked)} /><span>Easy mode (the hints show)</span></label>
      {list.map((cfg) => {
        const host = buildNodeAtlas()[cfg.host.node];
        return (
          <section key={cfg.id} className="dg-rigrow" style={{ "--accent": "var(--acc-" + cfg.campaign + ")" }}>
            <div className="meta">{CAMPAIGNS[cfg.campaign].shortName}{host ? " · " + nodeDate(cfg.campaign, host.date) : ""}</div>
            <div className="t">{cfg.title.replace("Order of Battle: ", "")}</div>
            <label className="dg-rigsel">
              <span>The enemy</span>
              <select value={pick[cfg.id] || ""} onChange={(e) => setPick({ ...pick, [cfg.id]: e.target.value })}>
                <option value="">Drawn at random</option>
                {cfg.postures.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <button className="dg-btn" onClick={() => onFight({ cfg, postureId: pick[cfg.id] || null, meters, easy })}>Fight this battle</button>
          </section>
        );
      })}
    </main>
  );
}

function HowToScreen({ onBack }) {
  return (
    <main {...rootProps(null, "howto")}>
      <div className="dg-filerow"><span /><button className="dg-btn" onClick={onBack}>Back</button></div>
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
const FONT_ROWS = [["theme", "The look's own"], ["typewriter", "Typewriter"], ["plain", "Plain and clear"], ["dyslexia", "Dyslexia-friendly"]];

function SettingsScreen({ settings, onSettings, onBack, onHowTo }) {
  const size = Math.max(0, TEXT_SIZES.indexOf(settings.textSize));
  const set = (patch) => onSettings({ ...settings, ...patch });
  return (
    <main {...rootProps(null, "settings")}>
      <div className="dg-filerow"><span /><button className="dg-btn" onClick={onBack}>Back</button></div>
      <h1 className="dg-title dg-title-sm">Settings</h1>
      <hr className="dg-rule" />
      <nav className="dg-nav" aria-label="Help">
        <button className="dg-navbtn" onClick={onHowTo}><b>How to play</b></button>
      </nav>

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
              <button key={id} className="dg-sw" aria-pressed={(settings.theme || DEFAULT_THEME) === id} onClick={() => set({ theme: id, themeSet: true })}>
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
      </div>
      <div className="dg-setting">
        <div className="dg-count">Motion</div>
        <div className="dg-seg" role="group" aria-label="Motion">
          {MOTION_ROWS.map(([id, label]) => (
            <button key={id} aria-pressed={(settings.motion || "auto") === id} onClick={() => set({ motion: id })}>{label}</button>
          ))}
        </div>
        <p className="dg-note">Reduce motion stops the marching front line, the stamp and the moving dials.</p>
      </div>
      <div className="dg-setting">
        <button className="dg-btn" onClick={() => set({ font: "plain", spacing: "roomy", measure: "narrow", motion: "reduced" })}>Easy reading: plain type, roomy spacing, narrow lines, no motion</button>
      </div>

      <h2 className="dg-sect">Playing</h2>
      <div className="dg-setting">
        <div className="dg-count">Signing a risky order</div>
        <div className="dg-seg" role="group" aria-label="Signing a risky order">
          {[[false, "Tap to sign"], [true, "Hold to sign"]].map(([v, label]) => (
            <button key={label} aria-pressed={(settings.signHold === true) === v} onClick={() => set({ signHold: v })}>{label}</button>
          ))}
        </div>
      </div>
      <div className="dg-setting">
        <div className="dg-count">Music</div>
        <div className="dg-seg" role="group" aria-label="Music">
          {[["On", true], ["Off", false]].map(([label, v]) => (
            <button key={label} aria-pressed={(settings.music !== false) === v} onClick={() => set({ music: v })}>{label}</button>
          ))}
        </div>
        {settings.music !== false && (
          <>
            <label id="dg-music-l" htmlFor="dg-music" className="dg-count">Volume: {Math.round((settings.musicVolume ?? 0.5) * 100)} per cent</label>
            <input id="dg-music" type="range" className="dg-range" min="0" max="20" step="1" value={Math.round((settings.musicVolume ?? 0.5) * 20)}
              aria-labelledby="dg-music-l" aria-valuetext={Math.round((settings.musicVolume ?? 0.5) * 100) + " per cent"}
              onChange={(e) => set({ musicVolume: Number(e.target.value) / 20 })} />
          </>
        )}
      </div>
      <div className="dg-setting">
        <div className="dg-count">Sound</div>
        <div className="dg-seg" role="group" aria-label="Sound">
          {[["Off", false, false], ["Typewriter", true, false], ["Atmosphere", true, true]].map(([label, snd, atm]) => (
            <button key={label} aria-pressed={settings.sound === snd && Boolean(settings.atmosphere) === atm} onClick={() => set({ sound: snd, atmosphere: atm })}>{label}</button>
          ))}
        </div>
        <p className="dg-note">Typewriter is the key and the stamp. Atmosphere adds guns, wind and rain.</p>
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
