function WW2CommandInner() {
  const [screen, setScreen] = useState("select");
  const [campaignId, setCampaignId] = useState(null);
  const [position, setPosition] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState(null);
  const [rollIndex, setRollIndex] = useState(null);
  // Key Battle Subgame prototype: null outside one of these battles, otherwise
  // { index, config } for the choice awaiting the Order of Battle allocation screen. See
  // chooseOption and BattleAllocationScreen.
  const [pendingBattle, setPendingBattle] = useState(null);
  // Round 4 (Craig: "we need a battle simulation screen which after selecting them will show
  // if we have won or lost", "the choices still don't feel linked to the outcome"). Set once a
  // subgame-resolved choice's roll has actually happened — { weights, ri, uncertain } — and
  // read by both BattleResultScreen (the new reveal-and-verdict beat) and OutcomeScreen (whose
  // existing concealRoll "odds you couldn't see" reveal previously recomputed percentages from
  // choice.uncertain[].weight directly, which is the PRE-subgame weight — a real accuracy gap
  // this state also fixes, not just a UI addition: without it, a subgame-resolved battle's
  // outcome screen showed the wrong odds). Cleared in proceed(), so it can never leak into a
  // later, unrelated concealRoll choice's own reveal.
  const [pendingBattleResult, setPendingBattleResult] = useState(null);
  // Saving inside a battle. battleDraftRef holds the planning screen's plan as it stands (the screen reports
  // every change), and battleResume carries a battle put back from a save: { stage, draft } or null. See
  // battleSnapshot, restoreBattleSave and the two battle screens' resume props.
  const battleDraftRef = useRef(null);
  const [battleResume, setBattleResume] = useState(null);
  const [rewinds, setRewinds] = useState(0);
  const [mode, setMode] = useState("open");
  // Grand Campaign prototype: null outside a Grand Campaign run, otherwise
  // { order: GRAND_CAMPAIGN_ORDER, index }. See pickCampaign/startGrandCampaign/
  // continueGrandCampaign below.
  const [grandChain, setGrandChain] = useState(null);
  const [favor, setFavor] = useState(5);
  const [defiance, setDefiance] = useState(0);
  const [instantText, setInstantText] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Round 11 (Craig: "The music didn't play during the game"): on by default (previously
  // false, matching the sound-effects toggle's deliberately silent-until-asked pattern — right
  // for typewriter clacks/stamps, wrong for a game score nobody would think to go looking for
  // in a collapsed Settings panel). Still toggleable off for anyone who doesn't want it.
  const [musicOn, setMusicOn] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const FONT_SCALES = [0.9, 1, 1.15];
  function cycleFontScale() {
    setFontScale((s) => {
      const idx = FONT_SCALES.indexOf(s);
      return FONT_SCALES[(idx + 1) % FONT_SCALES.length];
    });
  }
  const [log, setLog] = useState([]);
  const [flags, setFlags] = useState({});
  const [meters, setMeters] = useState(EMPTY_METERS);
  const [history, setHistory] = useState([]);
  // Snapshot of the stage the player chose from (see seenStage below).
  const [outcomeStage, setOutcomeStage] = useState(null);
  const [visited, setVisited] = useState([]);
  const [seenWireHeadlines, setSeenWireHeadlines] = useState([]);
  const [pendingWireHeadline, setPendingWireHeadline] = useState(null);
  // Region statuses as of the last time the Checkpoint Map was closed, this run — null
  // means "never opened yet" (no flash on first open). Lives up here rather than inside
  // BriefingScreen because BriefingScreen itself remounts on every new node in the normal
  // briefing -> outcome -> next-briefing cycle, which would otherwise reset "last seen" on
  // every single decision and make every region flash as "changed" on every map open.
  const [lastSeenMapStatuses, setLastSeenMapStatuses] = useState(null);

  // Key Battle Subgame prototype: dev-only quick-launch so a battle can be tested without
  // playing through the whole campaign first (Craig, 2026-09-19: "a prototype to test without
  // running through the whole campaign"). ?testBattle=<node id> on the dev build's URL (e.g.
  // index.html?testBattle=kursk) jumps straight into that node in the German campaign's War
  // Room, seeded with all three meters at +5 so the chit pool's meter-standing bonus chit is
  // visible too, not just the mechanic at its bare minimum. Also reads window.__TEST_BATTLE__ —
  // a plain global set by an inline <script> before this bundle loads — as an alternative to the
  // query string, since a mobile-testing host (Craig: "give me a link to an artifact so I can
  // test on mobile") may not reliably forward query params through to this page's own
  // location.search. Gated by the same __KEY_BATTLE_SUBGAME__ flag as the subgame itself, so
  // this can never fire in a shipped build regardless of what query string or global someone
  // sets. Not wired to any menu — debug-only, and only meaningful on an unlisted dev build where
  // the flag is true in the first place.
  useEffect(() => {
    if (!KEY_BATTLE_SUBGAME_ENABLED) return;
    const testNode =
      window.__TEST_BATTLE__ || new URLSearchParams(window.location.search).get("testBattle");
    if (!testNode) return;
    // Round 9: a second battle (Omaha) lives in the Allied campaign, so the launcher needs to
    // know which campaign to open. window.__TEST_CAMPAIGN__ / ?testCampaign= override; otherwise
    // inferred for the known battle nodes, defaulting to German (Kursk) as before.
    const testCampaign =
      window.__TEST_CAMPAIGN__ ||
      new URLSearchParams(window.location.search).get("testCampaign") ||
      (testNode === "omahaCrisis44" ? "allied" : "german");
    clearActiveRun();
    const seedMeters = { manpower: 5, fuel: 5, initiative: 5 };
    setMode("open");
    setFavor(5);
    setDefiance(0);
    setCampaignId(testCampaign);
    setPosition(testNode);
    setChoiceIndex(null);
    setRollIndex(null);
    setLog([]);
    setFlags({});
    setMeters(seedMeters);
    setHistory([{ position: testNode, flags: {}, meters: seedMeters, log: [] }]);
    setVisited([String(testNode)]);
    setRewinds(0);
    setSeenWireHeadlines([]);
    setPendingWireHeadline(null);
    setLastSeenMapStatuses(null);
    setScreen("warroom");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const campaign = campaignId ? CAMPAIGNS[campaignId] : null;
  const stage = useMemo(() => {
    if (!campaign) return null;
    // Führer Mode necessity rule lives in logic.ts (playableStage).
    return playableStage(resolveStage(campaign, position, flags, meters), mode, favor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, position, flags, meters, mode]);

  // The stage the player chose from. A dynamic stage re-resolves from flags and meters as soon as the
  // choice applies its impact, which can drop or shift a meter-gated choice and changes the roll odds
  // the stage computes from meters. proceed() reads this snapshot, so the picked choice, its next
  // node and the after-action log (end-screen odds, "passed over" counts) reflect what the player faced.
  const seenStage = outcomeStage || stage;
  // What the outcome/battle-result screens render: exactly the live stage as before (so their text and
  // labels are unchanged), except when the live list no longer holds the picked choice, then the snapshot.
  const displayStage = (() => {
    if (!outcomeStage) return stage;
    const live = stage && stage.choices ? stage.choices[choiceIndex] : null;
    const snap = outcomeStage.choices[choiceIndex];
    return live && snap && live.label === snap.label ? stage : outcomeStage;
  })();

  // `seed`, when provided (Grand Campaign only), is a { seedFlags, seedMeters } pair from
  // GRAND_CAMPAIGN_SEEDS — merged on top of the normal defaults rather than replacing them, so
  // e.g. a hard-mode seedFlags.hardMode still applies alongside any legacy flags.
  function pickCampaign(id, playMode = "open", seed = null) {
    const camp = CAMPAIGNS[id];
    const startPos = camp.dynamic ? camp.start : 0;
    setMode(playMode);
    setFavor(5);
    setDefiance(0);
    clearActiveRun();
    setCampaignId(id);
    const baseSeedFlags = startFlags(playMode);
    const seedFlags = seed ? { ...baseSeedFlags, ...seed.seedFlags } : baseSeedFlags;
    const rawSeedMeters = seed && seed.seedMeters ? { ...EMPTY_METERS, ...seed.seedMeters } : EMPTY_METERS;
    const seedMeters = {
      manpower: Math.max(-10, Math.min(10, rawSeedMeters.manpower)),
      fuel: Math.max(-10, Math.min(10, rawSeedMeters.fuel)),
      initiative: Math.max(-10, Math.min(10, rawSeedMeters.initiative)),
    };
    setPosition(startPos);
    setChoiceIndex(null);
    setRollIndex(null);
    setLog([]);
    setFlags(seedFlags);
    setMeters(seedMeters);
    setHistory([{ position: startPos, flags: seedFlags, meters: seedMeters, log: [] }]);
    setVisited([String(startPos)]);
    setRewinds(0);
    setSeenWireHeadlines([]);
    setPendingWireHeadline(null);
    setLastSeenMapStatuses(null);
    setScreen("warroom");
  }

  // Grand Campaign prototype (GRAND_CAMPAIGN_ENABLED only). `grandChain` is null outside a
  // Grand Campaign run, otherwise { order: GRAND_CAMPAIGN_ORDER, index }. Both functions live
  // here rather than as bare helpers because they need setGrandChain + pickCampaign together.
  function startGrandCampaign() {
    setGrandChain({ order: GRAND_CAMPAIGN_ORDER, index: 0 });
    pickCampaign(GRAND_CAMPAIGN_ORDER[0], "open");
  }

  function continueGrandCampaign(finishedCampaignId, finishedFlags, finishedMeters) {
    if (!grandChain) return;
    const nextIndex = grandChain.index + 1;
    const nextId = grandChain.order[nextIndex];
    if (!nextId) return; // last leg already finished — EndScreen handles that case itself
    const seedFn = GRAND_CAMPAIGN_SEEDS[`${finishedCampaignId}_${nextId}`];
    const seed = seedFn ? seedFn({ flags: finishedFlags, meters: finishedMeters }) : null;
    setGrandChain({ order: grandChain.order, index: nextIndex });
    pickCampaign(nextId, "open", seed);
  }

  // `historicallyAccurate` comes from the new War Room checkbox (see WarRoomScreen). When false,
  // roll this campaign's Historical Divergence Mode forks now, silently — the player is never
  // told which fired. Most forks are only discovered later, at their own revealNode, via the
  // existing wire-trigger check in chooseOption below. The one exception: German, Soviet, and
  // Allied each happen to have one fork sitting on the campaign's own START node (norway40,
  // border41, narvik40) — chooseOption's check never runs for the very first node a player sees
  // (nothing chose their way into it), so that one case is handled here instead, using the same
  // WireBulletin/pendingWireHeadline plumbing.
  function enterWarRoom(historicallyAccurate = true) {
    if (!historicallyAccurate && campaignId && DIVERGENCE_FORKS[campaignId]) {
      const forkFlags = rollDivergenceForks(campaignId);
      if (Object.keys(forkFlags).length) {
        setFlags((f) => ({ ...f, ...forkFlags }));
        const startFork = DIVERGENCE_FORKS[campaignId].find(
          (fk) => fk.revealNode === campaign.start && forkFlags[fk.flag]
        );
        const headline = startFork ? DIVERGENCE_HEADLINES[startFork.id] : null;
        if (headline) {
          setPendingWireHeadline(headline);
          setScreen("wire");
          return;
        }
      }
    }
    setScreen("briefing");
  }

  function chooseOption(i, subgamePayload) {
    const choice = stage.choices[i];
    if (mode === "iron" && choice.favor && choice.favor > favor) return;
    // Key Battle Subgame prototype: intercept before anything else resolves (favor spend,
    // impact, the roll itself) and hand off to the Order of Battle allocation screen. The
    // second call — with subgamePayload defined — is the real resolution and falls through to
    // the normal logic below, now with that screen's result folded into the roll.
    if (KEY_BATTLE_SUBGAME_ENABLED && choice.keyBattleSubgame && subgamePayload === undefined) {
      // Round 9: base weights captured here so the battle report can replay the nudge before the
      // roll exists — the roll now happens at the END of the report (see onResolve), not at
      // commit, so the mid-battle reserve decision can still change it.
      setPendingBattle({
        index: i,
        label: choice.label,
        config: choice.keyBattleSubgame,
        baseWeights: (choice.uncertain || []).map((u) => u.weight),
      });
      battleDraftRef.current = null;
      setBattleResume(null);
      setPendingBattleResult(null);
      setScreen("battleAllocation");
      return;
    }
    // Round 6: onCommit now hands back the full planning picture (bonus, allocation, commander,
    // approach), not just a bare number. `subgamePayload` is only undefined on the intercept call
    // above; once defined (even with bonus: 0) this is the real resolution. All the arithmetic
    // (roll, subgame nudge, plan costs, flags, ceilings, meters) lives in logic.ts.
    if (choice.uncertain && soundOn) playDice();
    const res = resolveChoice({
      stage,
      index: i,
      mode,
      favor,
      defiance,
      flags,
      meters,
      rand: Math.random,
      subgame: subgamePayload,
      planCostsFor: (ri) =>
        computeBattlePlanCosts({
          categories: keyBattleCategories(choice.keyBattleSubgame),
          finalAllocation: subgamePayload.finalAllocation,
          poolSize: subgamePayload.poolSize,
          contributions: subgamePayload.contributions || {},
          won: ri === 0,
          reservesHeld: subgamePayload.reservesHeld || 0,
          counter: subgamePayload.counter || null,
          extraLines: subgamePayload.extraLines || [],
          attrition: choice.keyBattleSubgame.attrition || null,
        }),
    });
    if (!res) return;
    setFavor(res.favor);
    setDefiance(res.defiance);
    setFlags(res.flags);
    setMeters(res.meters);
    setRollIndex(res.rollIndex);
    setChoiceIndex(i);
    setOutcomeStage(stage);
    // A subgame-resolved roll stays on the battle report, which is already showing. The real,
    // post-allocation weights also go forward to OutcomeScreen's own reveal, and planCosts to its
    // impact box.
    if (res.battle) {
      setPendingBattleResult({
        weights: res.battle.weights,
        ri: res.rollIndex,
        uncertain: choice.uncertain,
        baseWeights: res.battle.baseWeights,
        planCosts: res.battle.planCosts,
        notes: subgamePayload.notes || [],
      });
      setScreen("battleResult");
    } else {
      setScreen("outcome");
    }
  }

  function proceed() {
    // Leaving the outcome screen behind — clear any subgame result so it can never leak into a
    // later, unrelated concealRoll choice's own "odds you couldn't see" reveal.
    if (pendingBattleResult) setPendingBattleResult(null);
    const seen = seenStage;
    const choice = seen.choices[choiceIndex];
    const newLog = [...log, buildLogEntry(seen, choiceIndex, rollIndex)];
    setLog(newLog);

    const { nextPos, isEnd } = nextPosition({
      dynamic: !!campaign.dynamic,
      length: campaign.length,
      position,
      choice,
      rollIndex,
      mode,
      flags,
    });

    setOutcomeStage(null);
    if (!isEnd) {
      const newHistory = [...history, { position: nextPos, flags, meters, log: newLog }];
      setHistory(newHistory);
      const newVisited = nextVisited(visited, nextPos);
      setVisited(newVisited);
      setPosition(nextPos);
      setChoiceIndex(null);
      setRollIndex(null);
      const nextStage = resolveStage(campaign, nextPos, flags, meters);
      // Historical Divergence Mode reveal check runs first and, when it matches, wins outright —
      // it's deterministic (this fork fired, this is its one reveal point) rather than the
      // probabilistic ~1-in-7 real-news check below. seenWireHeadlines is shared with the real
      // Wire Bulletin list; onContinue below already pushes whichever id was shown into it.
      const divergeFork = arrivalFork({
        dynamic: !!campaign.dynamic,
        campaignId,
        nextPos,
        flags,
        forks: DIVERGENCE_FORKS,
        seenWireIds: seenWireHeadlines,
      });
      const wantsWire = !!divergeFork || (campaign.dynamic && nextStage && shouldShowWireBulletin(String(nextPos)));
      const headline = divergeFork
        ? DIVERGENCE_HEADLINES[divergeFork.id]
        : wantsWire
        ? pickWireHeadline(yearFrom(nextStage.date, 1940), String(nextPos), seenWireHeadlines)
        : null;
      if (headline) {
        setPendingWireHeadline(headline);
        setScreen("wire");
      } else {
        setScreen("briefing");
      }
      // Autosave every 3rd decision (plus always on manual Save / Home) — the storage API is
      // rate-limited, and saving on every single choice was very likely exhausting it over a
      // real play session, which is the most probable cause of saves silently failing.
      if (newLog.length % 3 === 0) {
        saveActiveRun({
          version: SAVE_VERSION,
          campaignId,
          mode,
          favor: mode === "iron" && choice.favor ? favor - choice.favor : favor,
          defiance,
          position: nextPos,
          flags,
          meters,
          log: newLog,
          visited: newVisited,
          rewinds,
          history: newHistory,
        });
      }
    } else {
      clearActiveRun();
      saveRunRecord(campaign, flags, meters, visited, mode, newLog, rewinds, favor);
      setScreen("end");
    }
  }

  // The battle in hand, if there is one that can be put down: the planning screen, or the report before its
  // verdict. After the verdict the roll is made and its effects applied, so a save there would count them twice.
  function battleSnapshot() {
    if (!pendingBattle) return null;
    const head = { label: pendingBattle.label, configId: pendingBattle.config.id, baseWeights: pendingBattle.baseWeights };
    if (screen === "battleAllocation" && battleDraftRef.current) return { stage: "allocation", ...head, draft: battleDraftRef.current };
    if (screen === "battleResult" && !pendingBattleResult && pendingBattle.plan) return { stage: "report", ...head, plan: pendingBattle.plan };
    return null;
  }

  async function manualSave() {
    return await saveActiveRun({
      battle: battleSnapshot() || undefined,
      version: SAVE_VERSION,
      campaignId,
      mode,
      favor,
      defiance,
      position,
      flags,
      meters,
      log,
      visited,
      rewinds,
      history,
    });
  }

  async function goHome() {
    const ok = await manualSave();
    setScreen("select");
    return ok;
  }

  // "Save and leave the field": the battle goes into the save, and the player leaves for the menu only once
  // the save has gone through.
  async function leaveBattleSaved() {
    const ok = await manualSave();
    if (!ok) return false;
    setPendingBattle(null);
    setPendingBattleResult(null);
    setBattleResume(null);
    setScreen("select");
    return true;
  }

  // Closing the tab or switching away mid-battle writes the same save, so the plan and the enemy's setup
  // are not lost to the last autosave. Reads the latest render through a ref.
  const battleExitSave = useRef(null);
  battleExitSave.current = () => {
    if (battleSnapshot()) manualSave();
  };
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") battleExitSave.current();
    };
    const onHide = () => battleExitSave.current();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  async function toggleSound() {
    if (!soundOn) {
      const ok = await enableSound();
      setSoundOn(ok);
    } else {
      setSoundOn(false);
    }
  }

  // Background music (assets/theme.mp3, wired in and on by default — see musicOn above).
  // Fades in/out over ~1.2s rather than snapping on, per the "shouldn't feel intrusive" brief.
  //
  // Round 11 fix (Craig: "The music didn't play during the game"): browsers refuse
  // HTMLMediaElement.play() until the page has seen a user gesture, so the very first attempt
  // below — fired by this effect on mount, before the player has clicked anything — was silently
  // rejected every time, and because the effect only re-runs when musicOn/musicVolume change,
  // nothing ever retried it: with musicOn already true at mount, neither value goes on to change
  // on its own, so the play() call that mount fired was the only one that was ever going to
  // happen. `enableSound` next door sidesteps this the same way every game with a sound-effects
  // toggle does — gate playback behind a click on the toggle itself, which IS the gesture — but
  // that only works if a player finds and clicks the toggle; it doesn't fire anything on its own.
  // Fixed by also listening for the page's first genuine gesture (click/keydown/touchstart, once)
  // and retrying play() then if music is still meant to be on but hasn't actually started.
  //
  // Round 13 fix (Craig: "the music settings don't work on changing the volume or stopping the
  // music"): two separate bugs, both traced to the original fade loop ramping
  // HTMLMediaElement.volume directly. First, pause() was only ever called once the fade had
  // ramped el.volume down to ~0 — but iOS Safari deliberately makes .volume a no-op (Apple wants
  // the hardware buttons as the only volume control), so on iOS the ramp never moved, the target
  // was never reached, and pause() never fired: toggling music off did nothing audible at all.
  // Second, and for the same underlying reason, the volume slider had nothing to actually turn —
  // .volume silently ignores every assignment on iOS. Fixed by routing the <audio> element
  // through a Web Audio GainNode (source -> gain -> destination) and fading/reading *that* node's
  // gain instead of el.volume; a GainNode operates on the real audio signal rather than the
  // restricted element property, so it's respected on iOS the same as everywhere else. pause() is
  // now also called immediately when musicOn goes false, independent of whether any fade has
  // finished — stopping no longer depends on a ramp that might never converge.
  const musicRef = useRef(null);
  const audioGraphRef = useRef(null); // { ctx, gain } once built; null if Web Audio is unavailable
  function getMusicGraph() {
    const el = musicRef.current;
    if (!el) return null;
    if (audioGraphRef.current) return audioGraphRef.current;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null; // no Web Audio support — the el.volume fallback below still applies
      const ctx = new Ctx();
      const gain = ctx.createGain();
      ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
      audioGraphRef.current = { ctx, gain };
      return audioGraphRef.current;
    } catch (e) {
      return null; // e.g. a browser that blocks AudioContext construction entirely
    }
  }
  useEffect(() => {
    const el = musicRef.current;
    if (!el) return;
    if (!musicOn) {
      el.pause(); // unconditional — never gated behind a fade that might not converge
      return;
    }
    const graph = getMusicGraph();
    if (graph && graph.ctx.state === "suspended") graph.ctx.resume().catch(() => {});
    let raf;
    const fade = () => {
      if (graph) {
        const current = graph.gain.gain.value;
        const diff = musicVolume - current;
        if (Math.abs(diff) < 0.01) {
          graph.gain.gain.value = musicVolume;
          return;
        }
        graph.gain.gain.value = current + diff * 0.08;
      } else {
        // Web Audio unavailable — fall back to the native property. Works everywhere it's ever
        // going to work; iOS Safari ignores it regardless of which path sets it.
        const diff = musicVolume - el.volume;
        if (Math.abs(diff) < 0.01) {
          el.volume = musicVolume;
          return;
        }
        el.volume += diff * 0.08;
      }
      raf = requestAnimationFrame(fade);
    };
    el.play().catch(() => {}); // ignored here: the first-gesture listener below retries
    fade();
    return () => cancelAnimationFrame(raf);
  }, [musicOn, musicVolume]);

  // First-gesture fallback: if music is supposed to be on but the mount-time (or toggle-time)
  // play() got blocked by the browser's autoplay policy, one real click/key/touch anywhere on
  // the page is enough to satisfy it — retry then, once, rather than leaving music silent for
  // the rest of the session. The AudioContext behind the GainNode above needs the same kind of
  // unlock (it can start "suspended" until a real gesture happens), so this resumes that too.
  useEffect(() => {
    const el = musicRef.current;
    if (!el) return;
    const tryResume = () => {
      const graph = audioGraphRef.current;
      if (graph && graph.ctx.state === "suspended") graph.ctx.resume().catch(() => {});
      if (musicOn && el.paused) el.play().catch(() => {});
    };
    const opts = { once: true, capture: true };
    document.addEventListener("pointerdown", tryResume, opts);
    document.addEventListener("keydown", tryResume, opts);
    document.addEventListener("touchstart", tryResume, opts);
    return () => {
      document.removeEventListener("pointerdown", tryResume, opts);
      document.removeEventListener("keydown", tryResume, opts);
      document.removeEventListener("touchstart", tryResume, opts);
    };
  }, [musicOn]);

  function resumeRun(saved) {
    setCampaignId(saved.campaignId);
    setMode(saved.mode || "open");
    setFavor(saved.favor != null ? saved.favor : 5);
    setDefiance(saved.defiance != null ? saved.defiance : 0);
    setPosition(saved.position);
    setFlags(saved.flags || {});
    setMeters(saved.meters || EMPTY_METERS);
    setLog(saved.log || []);
    setVisited(saved.visited || []);
    setRewinds(saved.rewinds || 0);
    setHistory(saved.history || [{ position: saved.position, flags: saved.flags, meters: saved.meters, log: saved.log }]);
    setChoiceIndex(null);
    setRollIndex(null);
    const battle = restoreBattleSave(saved);
    if (battle) {
      battleDraftRef.current = battle.draft;
      setBattleResume({ stage: battle.stage, draft: battle.draft });
      setPendingBattleResult(null);
      setOutcomeStage(null);
      setPendingBattle(battle.pending);
      setScreen(battle.stage === "report" ? "battleResult" : "battleAllocation");
      return;
    }
    setScreen("briefing");
  }

  function rewindTo(k) {
    const snap = history[k];
    if (!snap) return;
    setRewinds((r) => r + 1);
    setFlags(snap.flags);
    setMeters(snap.meters);
    setLog(snap.log);
    setPosition(snap.position);
    setChoiceIndex(null);
    setRollIndex(null);
    setOutcomeStage(null);
    setHistory(history.slice(0, k + 1));
    setScreen("briefing");
  }

  function restart() {
    pickCampaign(campaignId, mode);
  }

  function switchCampaign() {
    clearActiveRun();
    setScreen("select");
    setCampaignId(null);
    setPosition(0);
    setChoiceIndex(null);
    setRollIndex(null);
    setLog([]);
    setFlags({});
    setMeters(EMPTY_METERS);
    setHistory([]);
    setGrandChain(null); // leaving to the menu always exits any in-progress Grand Campaign chain
  }

  const pastStages =
    campaign && history.length > 1
      ? history.slice(0, -1).map((snap, k) => {
          const s = resolveStage(campaign, snap.position, snap.flags, snap.meters);
          return { index: k, date: s.date, title: s.title };
        })
      : [];

  return (
    <div style={{ zoom: fontScale }}>
      <style>{ARBITRARY_CSS}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Courier+Prime:ital@0;1&family=IBM+Plex+Mono:wght@400;500;700&family=Caveat:wght@500;600&display=swap');
        @keyframes stampIn {
          0% { transform: scale(2.4) rotate(-14deg); opacity: 0; }
          65% { transform: scale(0.94) rotate(-3deg); opacity: 1; }
          100% { transform: scale(1) rotate(-3deg); opacity: 1; }
        }
        .stamp-in { animation: stampIn 0.35s ease-out both; }
        @keyframes mapArrivalPulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .map-pulse-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: mapArrivalPulse 0.9s ease-out forwards;
        }
        @keyframes flashupFade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        /* Round 9 fix: this used to end at opacity 0 (a round-6 leftover, when a flashup was a
           transient one-liner) with fill-mode both — so ever since round 8 made the report a
           persistent log, the NEWEST line faded out 650ms after appearing. Now fades in and
           stays. */
        .flashup-line { animation: flashupFade 450ms ease-out both; }
        /* Round 9 motion (Craig's item #9, movement only): boundary marker pulse on every beat,
           and a short shake when a beat swings the bar hard against the player. Both CSS, so the
           reducedMotion override below neutralizes them. */
        @keyframes boundaryPulse {
          0% { transform: scaleY(1.8); }
          100% { transform: scaleY(1); }
        }
        .boundary-pulse { animation: boundaryPulse 600ms ease-out both; transform-origin: center; }
        @keyframes barShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        .bar-shake { animation: barShake 420ms ease-in-out; }
      `}</style>
      {reducedMotion && (
        <style>{`
          .stamp-in { animation: none !important; }
          *, *::before, *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        `}</style>
      )}
      <audio ref={musicRef} src={MUSIC_TRACK_SRC} loop preload="none" />
      {screen === "select" && <SelectScreen onPick={pickCampaign} onResume={resumeRun} onStartGrand={startGrandCampaign} instantText={instantText} onToggleInstant={() => setInstantText((v) => !v)} soundOn={soundOn} onToggleSound={toggleSound} fontScale={fontScale} onCycleFontScale={cycleFontScale} reducedMotion={reducedMotion} onToggleReducedMotion={() => setReducedMotion((v) => !v)} musicOn={musicOn} onToggleMusic={() => setMusicOn((v) => !v)} musicVolume={musicVolume} onMusicVolumeChange={setMusicVolume} />}
      {screen === "warroom" && campaign && (
        <WarRoomScreen campaign={campaign} mode={mode} onEnter={enterWarRoom} onBack={() => setScreen("select")} />
      )}
      {screen === "wire" && campaign && pendingWireHeadline && (
        <WireBulletin
          campaign={campaign}
          headline={pendingWireHeadline}
          onContinue={() => {
            setSeenWireHeadlines((prev) => [...prev, pendingWireHeadline.id]);
            setPendingWireHeadline(null);
            setScreen("briefing");
          }}
        />
      )}
      {screen === "battleAllocation" && campaign && pendingBattle && (
        <BattleAllocationScreen
          campaign={campaign}
          config={pendingBattle.config}
          meters={meters}
          flags={flags}
          mode={mode}
          soundOn={soundOn}
          // Round 13, Craig's item #8 ("wire the subgame into difficulty — something minor is
          // fine"). Deliberately small: doesn't touch allocation math, postures, or the roll —
          // just extends Easy Command's existing "training wheels... full visibility" philosophy
          // (warRoomModeInfo's own "easy" text) to the one piece of hidden information the
          // subgame has, the free intelligence hint. See BattleAllocationScreen's drawIntel call.
          easyMode={mode === "easy"}
          onSpendInitiative={() =>
            setMeters((m) => ({ ...m, initiative: Math.max(-10, Math.min(10, m.initiative - 1)) }))
          }
          resume={battleResume && battleResume.stage === "allocation" ? battleResume.draft : null}
          onDraft={(d) => {
            battleDraftRef.current = d;
          }}
          onSaveLeave={leaveBattleSaved}
          onCommit={(plan) => {
            setPendingBattle((pb) => ({ ...pb, plan }));
            setPendingBattleResult(null);
            setBattleResume(null);
            setScreen("battleResult");
            // The plan is as good as made once committed: save it, so closing the page mid-report does not
            // send the player back to an earlier autosave.
            saveActiveRun({
              battle: { stage: "report", label: pendingBattle.label, configId: pendingBattle.config.id, baseWeights: pendingBattle.baseWeights, plan },
              version: SAVE_VERSION,
              campaignId,
              mode,
              favor,
              defiance,
              position,
              flags,
              meters,
              log,
              visited,
              rewinds,
              history,
            });
          }}
        />
      )}
      {screen === "battleResult" && campaign && displayStage && pendingBattle && pendingBattle.plan && (
        <BattleSimulationScreen
          campaign={campaign}
          mode={mode}
          config={pendingBattle.config}
          plan={pendingBattle.plan}
          baseWeights={pendingBattle.baseWeights}
          uncertain={displayStage.choices[pendingBattle.index].uncertain}
          result={pendingBattleResult}
          soundOn={soundOn}
          resumed={!!(battleResume && battleResume.stage === "report")}
          onSaveLeave={leaveBattleSaved}
          onResolve={(payload) => chooseOption(pendingBattle.index, payload)}
          onContinue={() => {
            setPendingBattle(null);
            setScreen("outcome");
          }}
        />
      )}
      {screen === "briefing" && campaign && stage && (
        <BriefingScreen
          campaign={campaign}
          stage={stage}
          nodeId={position}
          meters={meters}
          flags={flags}
          reportNumber={history.length}
          pastStages={pastStages}
          log={log}
          mode={mode}
          favor={favor}
          instantText={instantText}
          soundOn={soundOn}
          onChoose={chooseOption}
          onRewind={rewindTo}
          onSave={manualSave}
          onHome={goHome}
          seenWireHeadlines={seenWireHeadlines}
          lastSeenMapStatuses={lastSeenMapStatuses}
          onStatusesChange={setLastSeenMapStatuses}
          history={history}
        />
      )}
      {screen === "outcome" && campaign && displayStage && (
        <OutcomeScreen
          campaign={campaign}
          stage={displayStage}
          choiceIndex={choiceIndex}
          rollIndex={rollIndex}
          meters={meters}
          onProceed={proceed}
          soundOn={soundOn}
          isLast={campaign.dynamic ? displayStage.choices[choiceIndex].next === "END" : position + 1 >= campaign.length}
          resolvedWeights={pendingBattleResult ? pendingBattleResult.weights : null}
          planCosts={pendingBattleResult ? pendingBattleResult.planCosts : null}
          battleNotes={pendingBattleResult ? pendingBattleResult.notes : null}
        />
      )}
      {screen === "end" && campaign && (
        <EndScreen
          campaign={campaign}
          flags={flags}
          meters={meters}
          log={log}
          pastStages={pastStages}
          rewinds={rewinds}
          mode={mode}
          favor={favor}
          onRestart={restart}
          onSwitch={switchCampaign}
          onRewind={rewindTo}
          grandChain={grandChain}
          onContinueGrand={() => continueGrandCampaign(campaign.id, flags, meters)}
        />
      )}
    </div>
  );
}

export default function WW2Command() {
  return (
    <ErrorBoundary>
      <WW2CommandInner />
    </ErrorBoundary>
  );
}
