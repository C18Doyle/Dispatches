function WW2CommandInner() {
  const [screen, setScreen] = useState("select");
  // Counts choices made in the current demo run (Japan campaign only). At 6, the demo
  // wall shows instead of continuing to a 7th decision — a flat cap rather than the
  // earlier node-enumeration approach, which had to be recomputed by hand any time new
  // content was added and had already missed one whole branch once (Kantokuen). A count
  // is structurally immune to that failure mode: it doesn't care which nodes exist.
  const [demoChoiceCount, setDemoChoiceCount] = useState(0);
  const [pendingPressEvent, setPendingPressEvent] = useState(null);
  const [pendingDivergenceReveal, setPendingDivergenceReveal] = useState(null);
  // Ids of divergence forks already shown to the player this run — a fork has exactly one
  // reveal point (its revealNode), so this exists purely to guard against ever showing the
  // same reveal twice (e.g. if a rewind revisits the node).
  const [seenDivergenceReveals, setSeenDivergenceReveals] = useState([]);
  const [campaignId, setCampaignId] = useState(null);
  const [position, setPosition] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState(null);
  const [rollIndex, setRollIndex] = useState(null);
  const [rewinds, setRewinds] = useState(0);
  const [newlyEarnedObjectives, setNewlyEarnedObjectives] = useState([]);
  const [mode, setMode] = useState("open");
  const [favor, setFavor] = useState(5);
  const [defiance, setDefiance] = useState(0);
  const [instantText, setInstantText] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [fontScale, setFontScale] = useState(1); // 0.875 | 1 | 1.125 | 1.25
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [sfxVolume, setSfxVolumeState] = useState(70);
  const [musicVolume, setMusicVolumeState] = useState(70);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.fontSize = `${fontScale * 100}%`;
    }
  }, [fontScale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("reduce-motion", reducedMotion);
    }
  }, [reducedMotion]);

  function changeSfxVolume(pct) {
    setSfxVolumeState(pct);
    setSfxVolume(pct);
  }
  function changeMusicVolume(pct) {
    setMusicVolumeState(pct);
    setMusicVolume(pct);
  }
  // Snapshot of the stage the player chose from. Dynamic stages re-resolve from flags and
  // meters, and a choice's own impact can remove a meter-gated choice from the re-resolved
  // list (e.g. a choice that needs pipeline >= 6 and costs 3). The outcome screen and
  // proceed() must read the stage as it was when the choice was made.
  const [outcomeStage, setOutcomeStage] = useState(null);
  const [log, setLog] = useState([]);
  const [flags, setFlags] = useState({});
  const [meters, setMeters] = useState(EMPTY_METERS);
  const [history, setHistory] = useState([]);
  const [visited, setVisited] = useState([]);

  const campaign = campaignId ? CAMPAIGNS[campaignId] : null;
  const stage = useMemo(() => {
    if (!campaign) return null;
    // Necessity rule lives in logic.ts (playableStage): a node can never dead-end.
    return playableStage(resolveStage(campaign, position, flags, meters), mode, favor);
  }, [campaign, position, flags, meters, mode, favor]);

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

  function pickCampaign(id, playMode = "open") {
    const camp = CAMPAIGNS[id];
    const startPos = camp.dynamic ? camp.start : 0;
    setMode(playMode);
    setFavor(5);
    setDefiance(0);
    clearActiveRun();
    setCampaignId(id);
    if (soundOn) switchMusic(id);
    const seedFlags = startFlags(playMode);
    setPosition(startPos);
    setChoiceIndex(null);
    setRollIndex(null);
    setLog([]);
    setFlags(seedFlags);
    setMeters(EMPTY_METERS);
    setHistory([{ position: startPos, flags: seedFlags, meters: EMPTY_METERS, log: [] }]);
    setVisited([String(startPos)]);
    setRewinds(0);
    setDemoChoiceCount(0);
    setScreen("warroom");
  }

  function enterWarRoom(historicallyAccurate = true) {
    // Historical Divergence Mode: unticking the War Room checkbox rolls this campaign's
    // forks (independent 50/50s, see rollDivergenceForks) once, up front. Neither of the
    // two current forks anchors to the campaign's own start node (both reveal further in),
    // so unlike 1940 there's no start-node special case needed here — the merged flags
    // just sit quietly until proceed() reaches the relevant revealNode.
    if (!historicallyAccurate && campaignId && DIVERGENCE_FORKS[campaignId]) {
      const forkFlags = rollDivergenceForks(campaignId);
      if (Object.keys(forkFlags).length) {
        setFlags((f) => ({ ...f, ...forkFlags }));
      }
    }
    setScreen("briefing");
  }

  function selectDoctrine(doctrine) {
    setMeters((prev) => applyDoctrineImpact(prev, doctrine.impact));
    setFlags((prev) => ({ ...prev, doctrinePath: doctrine.id }));
    setScreen("briefing");
  }

  function dismissPress() {
    // Pure context, not a choice — no meter or flag effects, just returns to the normal flow.
    setPendingPressEvent(null);
    setScreen("briefing");
  }

  function dismissDivergence() {
    // Also pure context — no meter or flag effects here either, the fork's actual gameplay
    // weight was already applied back at the choice that rolled it. Marks the reveal seen
    // so it can never fire twice for this run (see seenDivergenceReveals).
    if (pendingDivergenceReveal) {
      setSeenDivergenceReveals((prev) => [...prev, pendingDivergenceReveal.id]);
    }
    setPendingDivergenceReveal(null);
    setScreen("briefing");
  }

  function chooseOption(i) {
    const picked = stage.choices[i];
    if (picked.uncertain && soundOn) playDice();
    const res = resolveChoice({ stage, index: i, mode, favor, defiance, flags, meters, rand: Math.random });
    if (!res) return;
    setFavor(res.favor);
    setDefiance(res.defiance);
    setFlags(res.flags);
    setMeters(res.meters);
    setRollIndex(res.rollIndex);
    setChoiceIndex(i);
    setOutcomeStage(stage);
    if (DEMO_BUILD && campaignId === "japan") setDemoChoiceCount((n) => n + 1);
    setScreen("outcome");
  }

  function proceed() {
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

    // Demo build wall: intercept before any position/history state changes, so the
    // player stays parked at their last playable node rather than landing on a 7th
    // decision. A real ending (isEnd) is never overridden by this.
    if (DEMO_BUILD && campaignId === "japan" && !isEnd && demoChoiceCount >= 6) {
      setScreen("demoWall");
      return;
    }

    setOutcomeStage(null);
    if (!isEnd) {
      const newHistory = [...history, { position: nextPos, flags, meters, log: newLog }];
      setHistory(newHistory);
      const newVisited = nextVisited(visited, nextPos);
      setVisited(newVisited);
      setPosition(nextPos);
      setChoiceIndex(null);
      setRollIndex(null);
      const arrival = arrivalScreen({
        dynamic: !!campaign.dynamic,
        campaignId,
        position,
        nextPos,
        flags,
        forks: DIVERGENCE_FORKS,
        events: SPECIAL_EVENTS,
        seenReveals: seenDivergenceReveals,
      });
      if (arrival.divergenceForkId) {
        setPendingDivergenceReveal(DIVERGENCE_HEADLINES[arrival.divergenceForkId]);
        setPendingPressEvent(null);
        setScreen("divergence");
      } else {
        setPendingPressEvent(arrival.pressEvent);
        setScreen(arrival.screen);
      }
      // Autosave every 3rd decision (plus always on manual Save / Home) — the storage API is
      // rate-limited, and saving on every single choice was very likely exhausting it over a
      // real play session, which is the most probable cause of saves silently failing.
      if (newLog.length % 3 === 0) {
        saveActiveRun({
          schemaVersion: SAVE_SCHEMA_VERSION,
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
          demoChoiceCount,
        });
      }
    } else {
      clearActiveRun();
      saveRunRecord(campaign, flags, meters, visited, mode, newLog, rewinds, favor).then((newlyEarned) => {
        setNewlyEarnedObjectives(newlyEarned || []);
      });
      setScreen("end");
    }
  }

  async function manualSave() {
    return await saveActiveRun({
      schemaVersion: SAVE_SCHEMA_VERSION,
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
      demoChoiceCount,
    });
  }

  async function goHome() {
    const ok = await manualSave();
    setScreen("select");
    if (soundOn) switchMusic("menu");
    return ok;
  }

  async function toggleSound() {
    if (!soundOn) {
      const ok = await enableSound();
      setSoundOn(ok);
      if (ok) switchMusic(campaignId || "menu");
    } else {
      setSoundOn(false);
      stopMusic();
    }
  }

  function resumeRun(saved) {
    setCampaignId(saved.campaignId);
    if (soundOn) switchMusic(saved.campaignId);
    setMode(saved.mode || "open");
    setFavor(saved.favor != null ? saved.favor : 5);
    setDefiance(saved.defiance != null ? saved.defiance : 0);
    setPosition(saved.position);
    setFlags(saved.flags || {});
    setMeters(saved.meters || EMPTY_METERS);
    setLog(saved.log || []);
    setVisited(saved.visited || []);
    setRewinds(saved.rewinds || 0);
    setDemoChoiceCount(saved.demoChoiceCount || 0);
    setHistory(saved.history || [{ position: saved.position, flags: saved.flags, meters: saved.meters, log: saved.log }]);
    setChoiceIndex(null);
    setRollIndex(null);
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
    if (soundOn) switchMusic("menu");
    setPosition(0);
    setChoiceIndex(null);
    setRollIndex(null);
    setLog([]);
    setFlags({});
    setMeters(EMPTY_METERS);
    setHistory([]);
  }

  const pastStages =
    campaign && history.length > 1
      ? history.slice(0, -1).map((snap, k) => {
          const s = resolveStage(campaign, snap.position, snap.flags, snap.meters);
          return { index: k, date: s.date, title: s.title };
        })
      : [];
  const hasSeenProjectedBadge =
    campaign && history.length > 1
      ? history.slice(0, -1).some((snap) => {
          const s = resolveStage(campaign, snap.position, snap.flags, snap.meters);
          return s && s.historicalRecord === false;
        })
      : false;

  return (
    <>
      <style>{ARBITRARY_CSS}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Courier+Prime:ital@0;1&family=IBM+Plex+Mono:wght@400;500;700&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Noto+Serif+JP:wght@700;900&display=swap');
        @keyframes stampIn {
          0% { transform: scale(2.4) rotate(-14deg); opacity: 0; }
          65% { transform: scale(0.94) rotate(-3deg); opacity: 1; }
          100% { transform: scale(1) rotate(-3deg); opacity: 1; }
        }
        .stamp-in { animation: stampIn 0.35s ease-out both; }
        .reduce-motion .stamp-in { animation: none !important; }
        .reduce-motion * { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        @media (prefers-reduced-motion: reduce) {
          .stamp-in { animation: none !important; }
          * { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        }
      `}</style>
      {screen === "select" && <SelectScreen onPick={pickCampaign} onResume={resumeRun} instantText={instantText} onToggleInstant={() => setInstantText((v) => !v)} soundOn={soundOn} onToggleSound={toggleSound} fontScale={fontScale} onSetFontScale={setFontScale} reducedMotion={reducedMotion} onToggleReducedMotion={() => setReducedMotion((v) => !v)} sfxVolume={sfxVolume} onSetSfxVolume={changeSfxVolume} musicVolume={musicVolume} onSetMusicVolume={changeMusicVolume} />}
      {screen === "warroom" && campaign && (
        <WarRoomScreen campaign={campaign} mode={mode} onModeChange={(m) => pickCampaign(campaign.id, m)} onEnter={enterWarRoom} onBack={() => setScreen("select")} />
      )}
      {screen === "doctrine" && campaign && (
        <DoctrineScreen campaign={campaign} onSelect={selectDoctrine} />
      )}
      {screen === "press" && campaign && pendingPressEvent && (
        <PressReportScreen campaignId={campaign.id} event={pendingPressEvent} onContinue={dismissPress} />
      )}
      {screen === "divergence" && campaign && pendingDivergenceReveal && (
        <DivergenceRevealScreen campaign={campaign} headline={pendingDivergenceReveal} onContinue={dismissDivergence} />
      )}
      {screen === "briefing" && campaign && stage && (
        <BriefingScreen
          campaign={campaign}
          stage={stage}
          nodeId={position}
          meters={meters}
          flags={flags}
          reportNumber={history.length}
          prevSnap={history.length > 1 ? history[history.length - 2] : null}
          pastStages={pastStages}
          hasSeenProjectedBadge={hasSeenProjectedBadge}
          log={log}
          mode={mode}
          favor={favor}
          instantText={instantText}
          soundOn={soundOn}
          onChoose={chooseOption}
          onRewind={rewindTo}
          onSave={manualSave}
          onHome={goHome}
        />
      )}
      {screen === "outcome" && campaign && displayStage && (
        <OutcomeScreen
          campaign={campaign}
          stage={displayStage}
          choiceIndex={choiceIndex}
          rollIndex={rollIndex}
          meters={meters}
          flags={flags}
          prevSnap={history.length ? history[history.length - 1] : null}
          onProceed={proceed}
          soundOn={soundOn}
          isLast={campaign.dynamic ? displayStage.choices[choiceIndex].next === "END" : position + 1 >= campaign.length}
        />
      )}
      {screen === "demoWall" && campaign && (
        <DemoWallScreen campaign={campaign} onHome={goHome} onRestart={restart} />
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
          history={history}
          newlyEarnedObjectives={newlyEarnedObjectives}
          onRestart={restart}
          onSwitch={switchCampaign}
          onRewind={rewindTo}
        />
      )}
    </>
  );
}

export default function WW2Command() {
  return (
    <ErrorBoundary>
      <WW2CommandInner />
    </ErrorBoundary>
  );
}
