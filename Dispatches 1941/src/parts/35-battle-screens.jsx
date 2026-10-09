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
    const strandFor = (c) => (c.strand && c.meter ? strandReadout(c.meter, flags || {}, meters).find((r) => r.id === c.strand) : null);
    return Object.fromEntries(
      categories.map((c) => [c.id, strandFor(c) ? { name: strandFor(c).name, band: strandFor(c).band, level: strandFor(c).level, mult: STRAND_LEVEL_MULT[strandFor(c).level] } : null])
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

  // Pool size: a base of 5 effort chits, plus one bonus chit per meter (readiness/pipeline/
  // initiative) standing above +2 — "extra resources should directly help," as a bigger toolkit
  // rather than a gate. Round 9: frozen at mount, because the staff assessment below spends
  // Initiative on this very screen — without the freeze, buying an assessment at Initiative +3
  // would drop the meter to +2, shrink the pool by one mid-plan, and could leave the player with
  // more chits placed than the pool now allows.
  const [bonusMeters] = useState(() => (resume && Array.isArray(resume.bonusMeters) ? resume.bonusMeters : ["readiness", "pipeline", "initiative"].filter((m) => (meters[m] || 0) > 2)));
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
      return window.localStorage.getItem("dispatches1941_staff_plans") === "1";
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

        {campaign.dynamic && <MeterPanel meters={meters} flags={flags} prev={null} />}

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
              <li>You have a pool of effort: five points, plus one for each of Readiness, Pipeline and Initiative above +2. Each point gives an arm more weight.</li>
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
                  {strandInfo[cat.id] && strandInfo[cat.id].level !== 3 && (
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
      return window.localStorage.getItem("dispatches1941_staff_plans") === "1";
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

  const meterNames = { readiness: "Readiness", pipeline: "Pipeline", initiative: "Initiative" };
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
              Held back, {plan.reserves === 1 ? "it stays" : "they stay"} in hand{plan.reserves >= 2 ? ", and a reserve of two or more that comes home intact earns back a point of Readiness" : ""}
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
                {plan.reserves >= 2 && <> Spent here, they do not come home intact, so the point of Readiness a reserve earns back is lost.</>}
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
                    window.localStorage.removeItem("dispatches1941_staff_plans");
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

