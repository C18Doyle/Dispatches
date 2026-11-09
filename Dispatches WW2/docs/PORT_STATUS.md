# Porting Dispatches 1941 into Dispatches WW2: status

What of 1941 is in WW2, what is not yet, and what was changed on the way. The plan beyond the port is `COMMANDS.md`.

## In

| From 1941 | In WW2 | Notes |
|---|---|---|
| The two commands (`japan`, `alliedPacific`), 151 reports | `src/parts/14-campaign-japan.jsx`, `15-campaign-alliedpacific.jsx`, `src/data/alliedPacific.nodes.json` | Meters renamed: Readiness to Manpower (`manpower`), Pipeline to Matériel (`fuel`). |
| The rules (`src/logic.ts`) | `src/logic-pacific.ts`, chosen by `src/rules.ts` | Unchanged but for the meter names. |
| The nine battles | `src/parts/26-battles-pacific.jsx` | On 1940's Order of Battle engine and registries, as in 1941. |
| The map layer (regions, timeline, places, fronts, orders, ReportMap, PacificMap) | `src/parts/33-pacific-map.jsx` (closure `PACIFIC_MAP`), `assets/maps/pacific-regions.json` | Drawn in the European map's tones. Mounted under each Pacific report and on the end screen. |
| Atlas, context notes, divergence forks and headlines, the staff's reading | merged into WW2's tables | |
| Adviser dossiers (64) | `ADVISOR_DOSSIERS` in `45-dossiers-objectives.jsx` | `summary` became `bio`. Five names in both games (Stimson, Roosevelt, Churchill, Marshall, King) keep WW2's entry. |
| State-driven events (14) | `PACIFIC_STATE_EVENTS` in `35-events.jsx` | Shown on the special-dispatch screen. |
| Hard modes (Fanatical Resolve, Coalition Resolve), easy names (Shinano, Mark 14) | `HARD_MODE_OF`, `warRoomModeInfo`, the briefing's suspicion count | Translated in six languages. |
| War-room letterheads and quotations | `WarRoomDocIGHQ`, `WarRoomDocCINCPAC`, `CAMPAIGN_WAR_ROOM_QUOTE` | |
| Claims registers | `claims/quotations.json` and `claims/staffs-reading.json` (merged), `claims/pacific-*.json` (copied) | |

## Not yet

- **1941's press reports** (`SPECIAL_EVENTS` with `pressEvent`, the PressReportScreen) and the **doctrine choice** at the start (DoctrineScreen, `DOCTRINES`, `applyDoctrineImpact`) are not shown. A Pacific file starts without a doctrine.
- **1941's divergence reveal screen**: a Pacific divergence is told by a wire headline, as in the European commands.
- **1941's first-run guide, glossary underlines (GlossText), paper wear and seasonal grain** are not shown.
- **The war record's objectives and the endings gallery** do not list the Pacific objectives (1941's OBJECTIVES) or endings yet.
- **The Pacific advisers' dates** are not audited in WW2: 1941 dates them by tenure (`tests/adviser-tenures.json`, `ADVISOR_TITLE_BY_DATE`), and that audit and the dated titles are not ported. 1940's fate-based audit covers the European commands only.
- **1941's own audits** (check-rolls, check-glossary, check-battle-balance for the Pacific battles' registries, check-map for the Pacific timeline, test:branch-nodes, test:battle-hosts, test:state-events) are not run in WW2.
- **The conditions line** has no weather for Pacific reports (their places are in `PACIFIC_MAP.MAP_PLACES`, which the climate table does not read).
- **The interface strings of the Pacific screens** (the map's legends and buttons) are English only: the seven languages cover the European screens and the new mode names (improvement 2 in COMMANDS.md).
- **The engine equivalence test** (`packages/engine/tests/campaign-equivalence.test.mjs`) checks 1940's and 1941's own rule files, which WW2's `logic.ts` and `logic-pacific.ts` copy; WW2 is not listed there.
- **Releases**: no itch.io pages, no `itch.json` entry, not in `release.yml`.
