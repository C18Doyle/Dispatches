const SAVE_KEY = "dispatches1922_save_v1";
const SAVE_SCHEMA_VERSION = 1;

function readSave() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== SAVE_SCHEMA_VERSION) return null;
    if (!parsed.campaignId || !CAMPAIGNS[parsed.campaignId]) return null;
    if (!parsed.nodeId || !parsed.meters || !parsed.flags || !Array.isArray(parsed.visitedNodes)) return null;
    // Defensive: a save pointing at a node id that no longer exists (content
    // edited out from under an old save) should be discarded, not crash the
    // resume.
    try {
      const node = CAMPAIGNS[parsed.campaignId].resolveNode(parsed.nodeId, parsed.flags, parsed.meters);
      if (!node) return null;
    } catch (e) {
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeSave(snapshot) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, ...snapshot }));
  } catch (e) {
    // best-effort only — quota exceeded, storage disabled, private window.
    // Never blocks play.
  }
}

function clearSave() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    // best-effort
  }
}

// Round 23: a persistent discovery log, separate from the single-slot save
// above. The save is cleared the moment a run ends (see clearSave() calls
// in handleContinueFromOutcome) — that's correct for "resume where you left
// off," but it means nothing survives a completed run to answer "what has
// this player actually found," which is exactly what WarRecordScreen's
// atlas/endings-gallery counts were silently promising and not delivering
// (they showed everything ever WRITTEN, not anything about a given
// player). This key accumulates across every run, every campaign, forever
// — an unlock log, not a resumable state — and is never cleared by
// clearSave().
const DISCOVERY_KEY = "dispatches1922_discovered_v1";
const DISCOVERY_SCHEMA_VERSION = 1;

function readDiscovery() {
  const empty = { schemaVersion: DISCOVERY_SCHEMA_VERSION, nodes: {}, endings: {} };
  try {
    const raw = window.localStorage.getItem(DISCOVERY_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== DISCOVERY_SCHEMA_VERSION) return empty;
    return {
      schemaVersion: DISCOVERY_SCHEMA_VERSION,
      nodes: parsed.nodes && typeof parsed.nodes === "object" ? parsed.nodes : {},
      endings: parsed.endings && typeof parsed.endings === "object" ? parsed.endings : {},
    };
  } catch (e) {
    return empty;
  }
}

/** Marks one id discovered under `kind` ("nodes" | "endings") for a campaign
 * and persists it. Returns the updated log (or null on a storage failure —
 * best-effort, never blocks play), so callers can setDiscovery(result)
 * directly instead of re-reading storage. */
function addDiscovered(current, campaignId, kind, id) {
  if (!id) return current;
  const already = current[kind][campaignId] && current[kind][campaignId][id];
  if (already) return current;
  const next = {
    ...current,
    [kind]: {
      ...current[kind],
      [campaignId]: { ...(current[kind][campaignId] || {}), [id]: true },
    },
  };
  try {
    window.localStorage.setItem(DISCOVERY_KEY, JSON.stringify(next));
  } catch (e) {
    // best-effort only — the in-memory state below still updates for this
    // session even if persistence fails.
  }
  return next;
}

export function App() {
  const [screen, setScreen] = useState("records");
  const [campaignId, setCampaignId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [resolvedText, setResolvedText] = useState("");
  const [resolvedAftermath, setResolvedAftermath] = useState("");
  // Explicit deltas from the choice just made, so the Outcome screen can
  // state plainly what changed (or that nothing did) instead of relying on
  // the player to notice a bar shifting by 1-2 points out of a ±10 range —
  // "historical = zero impact" is correct by design, but looks identical to
  // a broken meter if nothing on screen says so directly.
  const [lastDeltas, setLastDeltas] = useState({ triangle: {} });
  // Every node id this run has actually passed through, in order — feeds the
  // front map. Reset on campaign start, appended to every time a real
  // (non-ending) node is reached.
  const [visitedNodes, setVisitedNodes] = useState([]);
  // Settings — persist for the session only, deliberately NOT part of the
  // save/resume snapshot below (round 22): these are viewer display
  // preferences, not run state, and bundling them into a run save would mean
  // resuming a saved game could silently change how the CURRENT session's
  // settings look. textSize and reduceMotion are fully wired
  // (root font-size scale; stamp-tilt/rotation transforms skipped).
  // instantText is wired into TypewriterText below. sound and music are
  // real, visible toggles with no audio assets behind them yet — scaffolded
  // honestly, not faked as functional.
  const [textSize, setTextSize] = useState("normal"); // 'small' | 'normal' | 'large'
  const [reduceMotion, setReduceMotion] = useState(false);
  const [instantText, setInstantText] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [meters, setMeters] = useState(null);
  const [hardModeValue, setHardModeValue] = useState(0);
  const [hardModeMaxed, setHardModeMaxed] = useState(false);
  // Hard mode is opt-in, off by default — selected per campaign on
  // WarRoomScreen, not a background process that runs during every regular
  // playthrough regardless of whether the player chose it.
  const [hardModeEnabled, setHardModeEnabled] = useState(false);
  // Accumulated flags from every choice made this run, keyed by whatever
  // name each node's setFlags object uses. Every choice in every campaign
  // has defined setFlags since the first node was written — the engine
  // never actually collected them into anything until now, so nothing that
  // referenced "does the player's earlier choice matter here" could
  // actually check that. This is what makes ending variance possible.
  const [flags, setFlagsState] = useState({});
  // Lazily read once on mount — a save written by a previous visit to this
  // page (same browser, same artifact origin). null if none, malformed, or
  // storage unavailable; readSave() never throws.
  const [savedRun, setSavedRun] = useState(() => readSave());
  // Round 23: persistent discovery log — see addDiscovered()'s comment.
  // Never reset by handleStart or cleared by clearSave(); only ever grows.
  const [discovery, setDiscovery] = useState(() => readDiscovery());

  // Persist only from the two fully-reconstructable screens (see the save
  // helpers' comment above). Runs after every render where one of these
  // values actually changed, so it stays current without a dedicated write
  // call at every setter site.
  useEffect(() => {
    if (!campaignId || !nodeId || !meters || (screen !== "briefing" && screen !== "bulletin")) return;
    writeSave({
      campaignId,
      nodeId,
      meters,
      flags,
      visitedNodes,
      hardModeValue,
      hardModeMaxed,
      hardModeEnabled,
      screen,
      savedAt: Date.now(),
    });
    // Not tracked in savedRun state here — that state is only what the
    // RESUME banner reads, and it's refreshed explicitly on return to the
    // records screen (toRecords) rather than on every single write, which
    // would re-render the menu constantly for no visible reason while a
    // run is in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, nodeId, meters, flags, visitedNodes, hardModeValue, hardModeMaxed, hardModeEnabled, screen]);

  function handleResume() {
    const save = readSave();
    if (!save) { setSavedRun(null); return; }
    setCampaignId(save.campaignId);
    setNodeId(save.nodeId);
    setMeters(save.meters);
    setFlagsState(save.flags);
    setVisitedNodes(save.visitedNodes);
    setHardModeValue(save.hardModeValue || 0);
    setHardModeMaxed(!!save.hardModeMaxed);
    setHardModeEnabled(!!save.hardModeEnabled);
    setScreen(save.screen === "bulletin" ? "bulletin" : "briefing");
    // Backfill discovery for a save written before this log existed, or any
    // node the save/discovery writes otherwise missed — cheap, idempotent
    // (addDiscovered no-ops on an id already marked), and means resuming an
    // old save doesn't silently understate what this player has found.
    setDiscovery((prev) => {
      let next = prev;
      for (const nid of save.visitedNodes) next = addDiscovered(next, save.campaignId, "nodes", nid);
      return next;
    });
  }

  function toRecords() {
    // Refresh the resume banner's own state against what's actually on
    // disk — a run that just reached an ending clears its save (below) and
    // the banner should disappear the moment the player is back at the menu.
    setSavedRun(readSave());
    setScreen("records");
    setCampaignId(null);
  }

  function handleStart(id) {
    const c = CAMPAIGNS[id];
    setCampaignId(id);
    setMeters({ ...c.initialMeters });
    setHardModeValue(0); // capital spent so far — 0 means all 5 points available
    setHardModeMaxed(false);
    setFlagsState({});
    setVisitedNodes([c.start]);
    setNodeId(c.start);
    setScreen("briefing");
    setDiscovery((prev) => addDiscovered(prev, id, "nodes", c.start));
  }

  function handleChoose(choice, node) {
    // Defensive: the UI already hides the order button for a gated choice,
    // but if this ever gets called for one anyway, refuse rather than
    // silently apply an order the player wasn't actually shown as available.
    if (typeof choice.gate === "function" && !choice.gate(meters)) return;
    const c = CAMPAIGNS[campaignId];
    // All the arithmetic (roll, impact, clamp, capital, destination) lives in logic.ts.
    const res = resolveChoice({
      choice,
      meters,
      campaign: c,
      hardModeEnabled,
      hardModeValue,
      rand: Math.random,
      helpers: { applyImpact, clampTriangle },
    });
    // Explicit deltas (post-clamp) so the Outcome screen can say plainly what changed.
    setLastDeltas({ triangle: res.triangleDeltas });
    setMeters(res.meters);
    setHardModeValue(res.hardModeValue);
    setHardModeMaxed(res.hardModeMaxed);
    setFlagsState((prev) => ({ ...prev, ...res.newFlags }));
    const destination = res.destination;
    if (destination && destination !== "END_STUB") {
      setVisitedNodes((prev) => (prev.includes(destination) ? prev : [...prev, destination]));
      // `destination` can itself be an ending id; res.discoveryKind classifies it so an ending
      // reached this way still lands in the endings half of the discovery log.
      setDiscovery((prev) => addDiscovered(prev, campaignId, res.discoveryKind, destination));
    }
    setResolvedText(res.text);
    setResolvedAftermath(res.aftermath);
    setScreen("outcome");
    setNodeId(destination);
  }

  function handleContinueFromOutcome() {
    const c = CAMPAIGNS[campaignId];
    const next = afterOutcome({ campaign: c, nodeId, flags, meters, hardModeMaxed });
    if (next.screen === "ending") {
      if (next.hardCollapse) {
        // Hard-mode collapse takes priority over whatever node was actually next.
        setNodeId(next.endingId);
        setDiscovery((prev) => addDiscovered(prev, campaignId, "endings", next.endingId));
      }
      setScreen("ending");
      clearSave(); // run is over — nothing left to resume
    } else if (next.screen === "end") {
      setScreen("end");
      clearSave(); // demo chain ends here — same "run is over" case
    } else {
      setScreen(next.screen);
    }
  }

  function handleContinueFromBulletin() {
    setScreen("briefing");
  }

  return (
    <div className="w-full h-full min-h-screen font-sans">
      <FontImports />
      <TextScaleStyle textSize={textSize} />
      {screen === "records" && (
        <RecordsListScreen
          onOpen={(id) => { setCampaignId(id); setHardModeEnabled(false); setScreen("detail"); }}
          onOpenWarRecord={() => setScreen("warrecord")}
          onOpenSettings={() => setScreen("settings")}
          savedRun={savedRun}
          onResume={handleResume}
        />
      )}
      {screen === "warrecord" && (
        <WarRecordScreen onClose={toRecords} onOpenSection={setScreen} discovery={discovery} />
      )}
      {screen === "atlas" && <DiscoveryAtlasScreen onClose={() => setScreen("warrecord")} discovery={discovery} />}
      {screen === "endingsgallery" && <EndingsGalleryScreen onClose={() => setScreen("warrecord")} discovery={discovery} />}
      {screen === "dossiers" && <CommandDossiersScreen onClose={() => setScreen("warrecord")} />}
      {screen === "glossary" && <GlossaryScreen onClose={() => setScreen("warrecord")} />}
      {screen === "settings" && (
        <SettingsScreen
          textSize={textSize}
          setTextSize={setTextSize}
          reduceMotion={reduceMotion}
          setReduceMotion={setReduceMotion}
          instantText={instantText}
          setInstantText={setInstantText}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          onClose={() => setScreen("records")}
        />
      )}
      {screen === "howtoread" && <HowToReadScreen onClose={() => setScreen("warrecord")} />}
      {screen === "detail" && (
        <CampaignDetailScreen
          campaignId={campaignId}
          onEnter={(id, hardMode) => { setHardModeEnabled(hardMode); setScreen("warroom"); }}
          onClose={toRecords}
        />
      )}
      {screen === "warroom" && (
        <WarRoomScreen
          campaignId={campaignId}
          hardModeEnabled={hardModeEnabled}
          onClose={toRecords}
          onStart={handleStart}
        />
      )}
      {screen === "bulletin" && meters && (
        <BulletinScreen
          campaignId={campaignId}
          nodeId={nodeId}
          flags={flags}
          meters={meters}
          onContinue={handleContinueFromBulletin}
        />
      )}
      {screen === "briefing" && meters && (
        <BriefingScreen
          campaignId={campaignId}
          nodeId={nodeId}
          meters={meters}
          flags={flags}
          hardModeEnabled={hardModeEnabled}
          hardModeValue={hardModeValue}
          instantText={instantText}
          reduceMotion={reduceMotion}
          onChoose={handleChoose}
          onClose={toRecords}
          onOpenMap={() => setScreen("map")}
          onOpenTimeline={() => setScreen("timeline")}
        />
      )}
      {screen === "map" && (
        <FrontMapScreen
          campaignId={campaignId}
          visitedNodes={visitedNodes}
          skin={skinFor(campaignId)}
          onClose={() => setScreen("briefing")}
        />
      )}
      {screen === "timeline" && (
        <TimelineScreen
          campaignId={campaignId}
          visitedNodes={visitedNodes}
          flags={flags}
          meters={meters}
          skin={skinFor(campaignId)}
          onClose={() => setScreen("briefing")}
        />
      )}
      {screen === "outcome" && (
        <OutcomeScreen
          campaignId={campaignId}
          resolvedText={resolvedText}
          aftermath={resolvedAftermath}
          meters={meters}
          hardModeValue={hardModeValue}
          hardModeMaxed={hardModeMaxed}
          hardModeEnabled={hardModeEnabled}
          deltas={lastDeltas}
          onContinue={handleContinueFromOutcome}
          onClose={toRecords}
        />
      )}
      {screen === "ending" && (
        <EndingScreen campaignId={campaignId} endingId={nodeId} flags={flags} visitedNodes={visitedNodes} instantText={instantText} onClose={toRecords} />
      )}
      {screen === "end" && <EndStubScreen onClose={toRecords} />}
    </div>
  );
}

export default App;
