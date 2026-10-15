// =============================================================================
// BATTLE SCREENS
// =============================================================================
//
// The Order of Battle screen (61-battle.jsx, 62-battles.jsx) and the report that follows it. The screen draws the enemy's setup once,
// hidden, and shows one line of intelligence about it; the report names the real setup, says how far the plan moved the odds, and tells
// what happened on the day in each arm.

const GRADE_WORDS = {
  clean: "A clean battle: every arm had its part, and the plan was won.",
  costly: "A costly victory: the plan was won, but an arm was left short or a heavy commitment was paid for.",
  marginal: "A plan that held, and a battle that did not go its way.",
  total: "A plan that gave out: two or more arms were left short, and the battle was lost.",
};

const GRADE_SHORT = { clean: "A clean battle", costly: "A costly victory", marginal: "A plan that held, and a battle that did not go its way", total: "A plan that gave out" };

/** The first day's word: how the plan sits on the enemy that was really met. */
function dayOneWord(bonus) {
  return bonus >= 5 ? "The first day went well: the plan fits the enemy that was met."
    : bonus <= -5 ? "The first day went badly: the plan was made for another enemy."
    : "The first day was even: the plan neither fits the enemy nor fails against it.";
}

/** The second day: the enemy is known, a few counters can be moved, and a stance is chosen. */
function BattleDayTwo({ campaignId, config, choice, meters, plan, posture, intel, pool, onCommit, onBack }) {
  const c = CAMPAIGNS[campaignId];
  const [stance, setStance] = useState("hold");
  const [delta, setDelta] = useState({});
  const alloc = plan.allocation;
  const d = (id) => delta[id] || 0;
  const hand = -Object.values(delta).reduce((a, v) => a + v, 0);
  const movedOut = Object.values(delta).reduce((a, v) => a + Math.max(0, -v), 0);
  const out = [];
  const into = [];
  for (const k of config.categories) {
    for (let i = 0; i < -d(k.id); i++) out.push(k.id);
    for (let i = 0; i < d(k.id); i++) into.push(k.id);
  }
  const moves = out.map((from, i) => ({ from, to: into[i] })).filter((m) => m.to);
  const final = { ...plan, second: { stance, moves } };
  const dayOne = battleBonus(config, plan, posture, pool);
  const odds = useMemo(() => battlePlanOdds(choice, config, final, posture, pool, meters), [stance, delta]);
  const was = useMemo(() => battlePlanOdds(choice, config, plan, posture, pool, meters), []);
  const contributions = battleContributions(config, battleSecondPlan(final), posture, pool);
  const bump = (id, step) => setDelta((x) => ({ ...x, [id]: (x[id] || 0) + step }));
  const stanceOf = (id) => BATTLE_STANCES.find((x) => x.id === id);
  return (
    <main {...rootProps(campaignId, "battle")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow">
        <span>ORDER OF BATTLE</span>
        <button className="dg-btn" onClick={onBack}>Change the plan</button>
      </div>
      <h1 className="dg-node-title">{config.title}</h1>
      <section aria-label="The first day">
        <h2 className="dg-order">The first day</h2>
        <div className="dg-bulletin">
          <div className="h">REPORT FROM THE FIELD</div>
          The enemy was {posture ? posture.name.charAt(0).toLowerCase() + posture.name.slice(1) : "not what was expected"}.
          {intel && intel.shown && posture && intel.shown.id !== posture.id ? " The staff's intelligence summary had described another setup." : " The staff's intelligence summary was right."}
        </div>
        <p className="dg-prose">{dayOneWord(dayOne)}</p>
        <p className="dg-note">The odds on the plan as issued: {was.word}.</p>
      </section>

      <section aria-label="The second day">
        <h2 className="dg-order">The second day</h2>
        <p className="dg-note">Now that the enemy is known, up to {BATTLE_SHIFT_MAX} counters may be moved from one arm to another. A counter moved now is worth {BATTLE_SECOND_GAIN} times what it would have been in the dark, less {BATTLE_SHIFT_COST} point of weight for the confusion. Then say how the day is to be fought.</p>
        {config.categories.map((k) => (
          <div key={k.id} className="dg-bt-arm">
            <div className="dg-bt-head">
              <b>{k.name}</b>
              <span className="dg-bt-ctl">
                <button className="dg-btn" aria-label={"Take a counter out of " + k.name} disabled={!(alloc[k.id] + d(k.id) > 0) || movedOut >= BATTLE_SHIFT_MAX} onClick={() => bump(k.id, -1)}>−</button>
                <span className="dg-bt-n" aria-label={k.name + ": " + (alloc[k.id] + d(k.id)) + " counters"}>{alloc[k.id] + d(k.id)}</span>
                <button className="dg-btn" aria-label={"Put a counter into " + k.name} disabled={hand <= 0} onClick={() => bump(k.id, 1)}>+</button>
              </span>
            </div>
            <p className="dg-note" style={{ marginBottom: 6 }}>{contributions[k.id] < 0 ? "This arm is short against the enemy that was met." : "This arm is holding its own."}</p>
          </div>
        ))}
        <p className="dg-note" role="status" aria-live="polite">{hand > 0 ? hand + " counter" + (hand === 1 ? "" : "s") + " in hand: put them into an arm." : moves.length ? moves.length + " counter" + (moves.length === 1 ? "" : "s") + " moved." : "No counters moved."}</p>
        <div role="group" aria-label="Stance" className="dg-bt-pick">
          {BATTLE_STANCES.map((x) => (
            <button key={x.id} className="dg-choice dg-opt" aria-pressed={stance === x.id} onClick={() => setStance(x.id)}>
              <div className="lab">{x.name}</div>
              <div className="dg-quote">{x.note}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="dg-bt-bar" role="group" aria-label="The second day">
        <div className="dg-bt-stat">
          <span className="dg-bt-k">The odds</span>
          <b>{odds.word}</b>
          <small>{stanceOf(stance).name}{moves.length ? "; " + moves.length + " moved" : ""}</small>
        </div>
        <button className="dg-choice dg-issue" disabled={hand !== 0} onClick={() => onCommit(final)}>
          <div className="lab">Carry on to the second day</div>
          {hand !== 0 && <div className="dg-cost">Put the counters in hand into an arm</div>}
        </button>
      </div>
    </main>
  );
}

function BattleScreen({ campaignId, config, choice, meters, easy, onCommit, onBack }) {
  const c = CAMPAIGNS[campaignId];
  const pool = useMemo(() => battlePoolSize(meters), [meters]);
  const [posture] = useState(() => pickBattlePosture(config));
  const [intel] = useState(() => battleIntel(config, posture));
  const [committed, setCommitted] = useState(null); // the plan as issued: the second day follows
  const empty = useMemo(() => Object.fromEntries(config.categories.map((k) => [k.id, 0])), [config]);
  const [allocation, setAllocation] = useState(empty);
  const [commanderId, setCommanderId] = useState(null);
  const [approachId, setApproachId] = useState(null);
  const hasCommanders = (config.commanders || []).length > 0;
  const needsApproach = (config.approaches || []).length > 0;
  // the steps, in the order a staff takes them: who leads, how it is fought, where the effort goes
  const steps = useMemo(() => [hasCommanders && "officer", needsApproach && "approach", "counters"].filter(Boolean), [hasCommanders, needsApproach]);
  const [si, setSi] = useState(0);
  const step = steps[si];
  const placed = config.categories.reduce((s, k) => s + (allocation[k.id] || 0), 0);
  const left = pool - placed;
  const ready = left === 0 && (!needsApproach || approachId);
  const commander = (config.commanders || []).find((x) => x.id === commanderId) || null;
  const approach = (config.approaches || []).find((x) => x.id === approachId) || null;
  const bump = (id, d) => setAllocation((a) => {
    const n = (a[id] || 0) + d;
    if (n < 0 || (d > 0 && left <= 0)) return a;
    return { ...a, [id]: n };
  });
  const byStaff = () => {
    const s = staffPlanFor(config, pool);
    setAllocation({ ...empty, ...s.allocation });
    setApproachId(s.approachId);
    setCommanderId(null);
    setSi(steps.length - 1);
  };
  const plan = { allocation, commanderId, approachId, postureId: posture ? posture.id : null, pool };
  // the odds on the staff's own reading of the enemy: the staff's plan, and the plan in hand once it is complete
  const shown = intel.shown || null;
  const staffOdds = useMemo(() => (choice ? battlePlanOdds(choice, config, null, shown, pool, meters) : null), [choice, config, shown, pool, meters]);
  const myOdds = useMemo(() => (choice && ready ? battlePlanOdds(choice, config, plan, shown, pool, meters) : null), [choice, config, shown, pool, meters, ready, allocation, commanderId, approachId]);
  const weights = easy ? Object.fromEntries(config.categories.map((k) => [k.id, battleArmWeight(config, k.id, commander, approach, null)])) : null;
  const summary = {
    officer: commander ? `${commander.name}` : "No particular emphasis",
    approach: approach ? approach.name : "Not chosen yet",
    counters: `${placed} of ${pool} placed`,
  };
  const heading = { officer: "Name an officer", approach: "Choose the approach", counters: "Place the counters" };
  const last = si === steps.length - 1;
  const next = () => setSi((i) => Math.min(steps.length - 1, i + 1));
  if (committed) {
    return <BattleDayTwo campaignId={campaignId} config={config} choice={choice} meters={meters} plan={committed} posture={posture} intel={intel} pool={pool}
      onCommit={onCommit} onBack={() => setCommitted(null)} />;
  }
  return (
    <main {...rootProps(campaignId, "battle")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow">
        <span>ORDER OF BATTLE</span>
        <button className="dg-btn" onClick={onBack}>Back to the order</button>
      </div>
      <h1 className="dg-node-title">{config.title}</h1>
      <p className="dg-ask"><b>The task.</b> Plan the battle in {steps.length} {steps.length === 1 ? "step" : "steps"}, or let the staff plan it and change what you like.</p>
      <p className="dg-prose">{config.flavor}</p>
      <details>
        <summary className="dg-sum">Conditions on the day</summary>
        <p className="dg-note">{config.conditions}</p>
      </details>

      <div className="dg-bulletin">
        <div className="h">INTELLIGENCE SUMMARY</div>
        {intel.shown ? intel.shown.intel : "Nothing is known of the enemy's setup."}
        <div className="dg-note" style={{ marginTop: 6, marginBottom: 0 }}>The staff's reading is right about three times in four.</div>
      </div>

      <p><button className="dg-btn" onClick={byStaff}>Let the staff plan it</button>{" "}
        <button className="dg-btn" onClick={() => { setAllocation(empty); setCommanderId(null); setApproachId(null); setSi(0); }}>Clear the plan</button></p>

      <ol className="dg-steps" aria-label="The steps of the plan">
        {steps.map((s, i) => (
          <li key={s} className={i === si ? "now" : i < si || (s === "counters" && ready) ? "done" : ""}>
            <button className="dg-step" aria-current={i === si ? "step" : undefined} onClick={() => setSi(i)}>
              <span className="dg-step-n">{i + 1}</span>
              <span className="dg-step-t"><b>{heading[s]}</b><small>{summary[s]}</small></span>
            </button>
          </li>
        ))}
      </ol>

      <section aria-label={heading[step]}>
        <h2 className="dg-order">{heading[step]}</h2>
        {step === "officer" && (
          <>
            <p className="dg-note">A named officer adds weight to the arm he really led. You may name none.</p>
            <div role="group" aria-label="Commander" className="dg-bt-pick">
              <button className="dg-choice dg-opt" aria-pressed={commanderId === null} onClick={() => setCommanderId(null)}>
                <div className="lab">No particular emphasis</div>
              </button>
              {config.commanders.map((m) => (
                <button key={m.id} className="dg-choice dg-opt" aria-pressed={commanderId === m.id} onClick={() => setCommanderId(m.id)}>
                  <div className="lab">{m.name}, {m.role}</div>
                  <div className="dg-quote">{m.note}</div>
                </button>
              ))}
            </div>
          </>
        )}
        {step === "approach" && (
          <div role="group" aria-label="Approach" className="dg-bt-pick">
            {config.approaches.map((a) => (
              <button key={a.id} className="dg-choice dg-opt" aria-pressed={approachId === a.id} onClick={() => setApproachId(a.id)}>
                <div className="lab">{a.name}</div>
                <div className="dg-quote">{a.note}</div>
              </button>
            ))}
          </div>
        )}
        {step === "counters" && (
          <>
            <p className="dg-note" role="status" aria-live="polite">
              {left > 0 ? `${left} of ${pool} counters left to place.` : `All ${pool} counters are placed.`} An arm left with less than its fair share costs the plan.
            </p>
            {config.categories.map((k) => (
              <div key={k.id} className="dg-bt-arm">
                <div className="dg-bt-head">
                  <b>{k.name}</b>
                  <span className="dg-bt-ctl">
                    <button className="dg-btn" aria-label={`Fewer in ${k.name}`} disabled={!allocation[k.id]} onClick={() => bump(k.id, -1)}>−</button>
                    <span className="dg-bt-n" aria-label={`${k.name}: ${allocation[k.id] || 0} counters`}>{allocation[k.id] || 0}</span>
                    <button className="dg-btn" aria-label={`More in ${k.name}`} disabled={left <= 0} onClick={() => bump(k.id, 1)}>+</button>
                  </span>
                </div>
                <p className="dg-note" style={{ marginBottom: 6 }}>{k.context}</p>
                {easy && <p className="dg-note" style={{ marginBottom: 6 }}>Easy mode: each counter here carries {weights[k.id].toFixed(1)} before the enemy's setup.</p>}
                <details>
                  <summary className="dg-sum">The formations</summary>
                  <ul className="dg-bt-units">{k.units.map((u) => <li key={u}>{u}</li>)}</ul>
                </details>
              </div>
            ))}
          </>
        )}
      </section>

      <div className="dg-bt-bar" role="group" aria-label="Your plan">
        <div className="dg-bt-stat">
          <span className="dg-bt-k">Counters</span>
          <b aria-live="polite">{left} left</b>
        </div>
        <div className="dg-bt-stat">
          <span className="dg-bt-k">The odds</span>
          <b>{myOdds ? myOdds.word : "Plan not complete"}</b>
          {staffOdds && <small>The staff's plan: {staffOdds.word}</small>}
        </div>
        {last ? (
          <button className="dg-choice dg-issue" disabled={!ready} onClick={() => { setCommitted(plan); if (window.scrollTo) window.scrollTo(0, 0); }}>
            <div className="lab">Issue the plan</div>
            {!ready && <div className="dg-cost">{left > 0 ? `Place the remaining ${left} counters` : "Choose the approach"}</div>}
          </button>
        ) : (
          <button className="dg-btn dg-next" onClick={next}>Next: {heading[steps[si + 1]].toLowerCase()}</button>
        )}
      </div>
    </main>
  );
}

/** The after-action report shown with the outcome of a battle. `battle` is chooseNext's result.battle with the plan added. */
function BattleReport({ battle }) {
  const config = BATTLES[battle.id];
  if (!config) return null;
  const posture = (config.postures || []).find((p) => p.id === battle.posture);
  const plan = battle.plan;
  const placed = plan ? config.categories.filter((k) => plan.allocation[k.id]).map((k) => `${k.name} ${plan.allocation[k.id]}`).join(", ") : null;
  const commander = plan && (config.commanders || []).find((m) => m.id === plan.commanderId);
  const approach = plan && (config.approaches || []).find((a) => a.id === plan.approachId);
  const second = plan && plan.second;
  const secondLine = second && (second.stance !== "hold" || (second.moves && second.moves.length))
    ? "The second day: " + (second.stance === "press" ? "the attack was pressed" : second.stance === "steady" ? "the line was steadied" : "the plan was held") + (second.moves && second.moves.length ? ", and " + second.moves.length + (second.moves.length === 1 ? " counter was" : " counters were") + " moved once the enemy was known" : "") + "."
    : null;
  const moved = battle.bonus === 0 ? "The plan did as the staff's would have: the odds were the record's." : battle.bonus > 0
    ? `The plan moved the odds ${battle.bonus} points toward the better outcome.` : `The plan moved the odds ${-battle.bonus} points away from the better outcome.`;
  return (
    <section className="dg-bt-report" aria-label="After-action report">
      <h2 className="dg-order">After-action report</h2>
      {posture && <p className="dg-prose" style={{ marginBottom: 8 }}>The enemy's setup was this: {posture.name}.</p>}
      {plan && <p className="dg-note">The plan: {placed}{approach ? `; ${approach.name.toLowerCase()}` : ""}{commander ? `; ${commander.name} named` : ""}.</p>}
      {secondLine && <p className="dg-note">{secondLine}</p>}
      <p className="dg-prose" style={{ marginBottom: 8 }}>{moved}</p>
      <p className="dg-prose" style={{ marginBottom: 8 }}>{GRADE_WORDS[battle.grade]}</p>
      {battle.lines.length > 0 && (
        <ul className="dg-bt-units">
          {battle.lines.map((l, i) => <li key={i}>{l.reason}: {l.delta > 0 ? "+" : "−"}1 {CAMPAIGNS[config.campaign] ? meterLabels(config.campaign)[l.meter] : l.meter}</li>)}
        </ul>
      )}
      <details>
        <summary className="dg-sum">What happened on the day</summary>
        {config.categories.map((k) => (
          <p key={k.id} className="dg-note"><b>{k.name}.</b> {k.real}</p>
        ))}
      </details>
    </section>
  );
}
