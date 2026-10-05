// =============================================================================
// SAVES, RECORD AND SETTINGS — docs/SAVES.md
// =============================================================================
//
// Three things live in the browser's localStorage, each with its own key and its own
// schema version:
//   - the saved run (one slot): where the player was, so a closed tab can be resumed
//   - the war record: which nodes, advisers and endings have been seen, across runs
//   - settings: text size
// Everything is wrapped so that storage being unavailable (private windows, blocked
// site data, a test environment) degrades to "nothing persists this session" instead
// of an error. All of it is pure data in and out, so validators and node tests can
// exercise it without a browser.
//
// The rules for changing any of this are in docs/SAVES.md: renaming a node means an
// entry in NODE_ALIASES; changing what a save holds means bumping
// SAVE_SCHEMA_VERSION and adding SAVE_MIGRATIONS[oldVersion]. Never bump without the
// migration: with none, every player's saved run is discarded.
// =============================================================================

export const SAVE_KEY = "dispatches1914_save_v1";
export const RECORD_KEY = "dispatches1914_record_v1";
export const SETTINGS_KEY = "dispatches1914_settings_v1";

export const SAVE_SCHEMA_VERSION = 1;

// Old node id -> new node id. Add an entry whenever a node is renamed, so saves made before the rename still
// resume (see docs/SAVES.md). Empty today: no node has been renamed since saving began.
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
    s = { ...s, nodeId: aliasNode(s.nodeId), pendingNextId: aliasNode(s.pendingNextId) };
    if (Array.isArray(s.visited)) s.visited = s.visited.map(aliasNode);
  }
  return s;
}

// ---------- storage, guarded ----------

const memoryStore = new Map();

function localStore() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch (e) {
    /* blocked */
  }
  return null;
}

export function readJson(key) {
  try {
    const store = localStore();
    const raw = store ? store.getItem(key) : memoryStore.get(key) ?? null;
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function writeJson(key, value) {
  try {
    const raw = JSON.stringify(value);
    const store = localStore();
    if (store) store.setItem(key, raw);
    else memoryStore.set(key, raw);
    return true;
  } catch (e) {
    return false; // quota or blocked: persistence is a convenience, never a requirement
  }
}

export function removeKey(key) {
  try {
    const store = localStore();
    if (store) store.removeItem(key);
    else memoryStore.delete(key);
  } catch (e) {
    /* nothing to do */
  }
}

// ---------- the saved run ----------

/** What is stored for a run in progress. `pendingOutcome` (and `pendingRecord`, the historical note shown with it) are set while the player is on an outcome screen. */
export function snapshotRun({ campaignId, nodeId, flags, meters, hardState, visited, pendingNextId = null, pendingOutcome = null, pendingRecord = null }) {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    campaignId,
    nodeId,
    flags,
    meters,
    hardState,
    visited,
    pendingNextId,
    pendingOutcome,
    pendingRecord,
    savedAt: Date.now(),
  };
}

/** A save is only offered for resume if it parses, is a known version, and still resolves in the current content. */
export function validateSave(saved) {
  if (!saved || typeof saved !== "object") return false;
  if (saved.schemaVersion !== SAVE_SCHEMA_VERSION) return false;
  const campaign = CAMPAIGNS[saved.campaignId];
  if (!campaign || !saved.nodeId) return false;
  if (!saved.meters || typeof saved.meters !== "object" || !saved.flags || typeof saved.flags !== "object") return false;
  if (!saved.hardState || typeof saved.hardState !== "object") return false;
  if (!Array.isArray(saved.visited)) return false;
  try {
    const node = resolveNode(saved.nodeId, saved.flags, saved.meters, saved.hardState);
    if (!node || node.campaignId !== saved.campaignId) return false;
    if (saved.pendingNextId && !resolveNode(saved.pendingNextId, saved.flags, saved.meters, saved.hardState)) return false;
  } catch (e) {
    return false;
  }
  return true;
}

export function loadSavedRun() {
  const raw = readJson(SAVE_KEY);
  if (!raw) return null;
  const migrated = migrateSave(raw);
  if (migrated && validateSave(migrated)) return migrated;
  removeKey(SAVE_KEY); // stale or from a build that cannot be resumed: clear it rather than offer a broken Resume
  return null;
}

export function saveRun(snapshot) {
  return writeJson(SAVE_KEY, snapshot);
}

export function clearSavedRun() {
  removeKey(SAVE_KEY);
}

// ---------- the war record ----------

export const RECORD_SCHEMA_VERSION = 1;

export function emptyRecord() {
  return { schemaVersion: RECORD_SCHEMA_VERSION, nodes: {}, advisers: {}, endings: [], runs: 0, hardRuns: 0, xc: {} };
}

export function loadRecord() {
  const raw = readJson(RECORD_KEY);
  if (!raw || raw.schemaVersion !== RECORD_SCHEMA_VERSION) return emptyRecord();
  const merged = { ...emptyRecord(), ...raw };
  if (!merged.xc || typeof merged.xc !== "object" || Array.isArray(merged.xc)) merged.xc = {};
  return merged;
}

export function saveRecord(record) {
  return writeJson(RECORD_KEY, record);
}

const withAdded = (list, items) => {
  const have = new Set(list || []);
  const add = items.filter((x) => !have.has(x));
  return add.length ? [...(list || []), ...add] : list || [];
};

/** The player has seen this node (and met these advisers there). Returns a new record, or the same one if nothing is new. */
export function noteNodeSeen(record, campaignId, nodeId, adviserIds = []) {
  const nodes = withAdded(record.nodes[campaignId], [nodeId]);
  const advisers = withAdded(record.advisers[campaignId], adviserIds);
  if (nodes === record.nodes[campaignId] && advisers === record.advisers[campaignId]) return record;
  return { ...record, nodes: { ...record.nodes, [campaignId]: nodes }, advisers: { ...record.advisers, [campaignId]: advisers } };
}

/** A run has reached this ending. */
export function noteEnding(record, endingId, hardMode) {
  return {
    ...record,
    endings: withAdded(record.endings, [endingId]),
    runs: (record.runs || 0) + 1,
    hardRuns: (record.hardRuns || 0) + (hardMode ? 1 : 0),
  };
}

// ---------- echoes between commands ----------
//
// A choice in one command can leave a mark that another command reads. The marks are flags starting "xc_". They are
// remembered in the war record and handed to the next run as its starting flags. Every reader paragraph is written
// for the NON-historical value only, so a player who never departs from the record never sees an echo, and a fresh
// record plays exactly as before.

export const ECHOES = {
  xc_command1918: {
    label: "Allied command, spring 1918",
    historical: "unified",
    values: { unified: "Unified under Foch at Doullens, as it was.", national: "Left national: the Allied armies kept their separate commands." },
    setBy: "French GQG, British Empire", readBy: "German OHL (May and August 1918)",
  },
  xc_usw: {
    label: "Submarine warfare, 1917",
    historical: "unrestricted",
    values: { unrestricted: "Unrestricted from 1 February 1917, as it was.", restricted: "Held under prize rules: the United States stays out." },
    setBy: "German OHL", readBy: "British Empire (convoy, 1918 manpower), French GQG (May 1917)",
  },
  xc_marne_french: {
    label: "The French counterattack on the Marne",
    historical: "attacked",
    values: { attacked: "The flank was attacked, as it was.", delayed: "The withdrawal went on without a counterattack." },
    setBy: "French GQG", readBy: "German OHL (September 1914)",
  },
  xc_calais: {
    label: "The British under Nivelle, February 1917",
    historical: "accepted",
    values: { accepted: "Accepted under protest, as it was.", refused: "Refused: the British would not serve under a French general." },
    setBy: "British Empire", readBy: "French GQG (February 1917)",
  },
  xc_gorlice: {
    label: "The German plan for 1915 in the east",
    historical: "mackensen",
    values: { mackensen: "A breakthrough at Gorlice under Mackensen, as it was.", envelop: "A wide envelopment out of East Prussia and Courland." },
    setBy: "German OHL", readBy: "Austro-Hungarian AOK (April 1915)",
  },
  xc_caporetto: {
    label: "German help for Austria-Hungary, autumn 1917",
    historical: "sent",
    values: { sent: "German divisions sent to the Isonzo, as they were.", refused: "Guns and staff officers only." },
    setBy: "German OHL", readBy: "Austro-Hungarian AOK (September 1917)",
  },
};

/** Remember every xc_ flag a run has set. Returns the same record if nothing changed. */
export function noteEchoes(record, flags) {
  const xc = { ...(record.xc || {}) };
  let changed = false;
  for (const [k, v] of Object.entries(flags || {})) {
    if (k.startsWith("xc_") && xc[k] !== v) { xc[k] = v; changed = true; }
  }
  return changed ? { ...record, xc } : record;
}

/** The starting flags of a new run: the echoes already in the record. */
export function echoSeed(record) {
  return { ...(record.xc || {}) };
}

// ---------- settings ----------

export const TEXT_SIZES = ["s", "m", "l"];

export function defaultSettings() {
  return { schemaVersion: 1, textSize: "s", sound: false };
}

export function sanitizeSettings(raw) {
  const base = defaultSettings();
  if (!raw || typeof raw !== "object" || raw.schemaVersion !== 1) return base;
  return { ...base, textSize: TEXT_SIZES.includes(raw.textSize) ? raw.textSize : base.textSize, sound: raw.sound === true };
}

export function loadSettings() {
  return sanitizeSettings(readJson(SETTINGS_KEY));
}

export function saveSettings(settings) {
  return writeJson(SETTINGS_KEY, settings);
}

