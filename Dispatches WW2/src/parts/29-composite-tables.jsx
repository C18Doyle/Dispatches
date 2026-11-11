// ---------- THE BRITISH AND AMERICAN COMMANDS IN THE SHARED TABLES (Dispatches WW2) ----------
// The two commands of part 16 play reports from SHAEF's and CINCPAC's files, so the command-level tables take their rows from those two:
// the atlas (the reports a command owns, in date order), the context notes, the divergence forks whose reveal is one of its reports, and its
// modes and war-room quotation. Report-level tables (maps, the staff's reading, events, conditions) are read under the source file's id
// through campaignView, so they need nothing here.
const COMPOSITE_COMMANDS = ["british", "american"];
for (const cmd of COMPOSITE_COMMANDS) {
  const own = (id) => compositeOwns(cmd, id);
  NODE_ATLAS[cmd] = [...(NODE_ATLAS.allied || []), ...(NODE_ATLAS.alliedPacific || [])].filter((e) => own(e.id)).sort((a, b) => trackMonth(a.date) - trackMonth(b.date));
  CONTEXT_NOTES[cmd] = [...(CONTEXT_NOTES.allied || []), ...(CONTEXT_NOTES.alliedPacific || [])];
  DIVERGENCE_FORKS[cmd] = [...(DIVERGENCE_FORKS.allied || []), ...(DIVERGENCE_FORKS.alliedPacific || [])].filter((f) => !f.revealNode || own(f.revealNode));
}
HARD_MODE_OF.british = "coalition";
HARD_MODE_OF.american = "coalition";
EASY_MODE_NAMES.british = T("Defiant Command");
EASY_MODE_NAMES.american = T("Mark 14 Command");
CAMPAIGN_WAR_ROOM_QUOTE.british = CAMPAIGN_WAR_ROOM_QUOTE.allied;
CAMPAIGN_WAR_ROOM_QUOTE.american = CAMPAIGN_WAR_ROOM_QUOTE.alliedPacific;

