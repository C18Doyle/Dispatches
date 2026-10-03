# Bugs and findings from the refactor (2026-10)

Everything found while moving the five games onto the shared engine and test kit, and what happened to each. "Shipped"
means the bug was in the game players had; "tooling" means it was in our own scripts or CI.

## Shipped-game bugs that are fixed
| Game | Bug | Effect on players | Fix |
|---|---|---|---|
| 1941 | A choice gated on a meter whose own impact dropped the meter below the gate made the stage re-resolve, and the outcome looked up a choice that no longer existed | Crash (past the error boundary) or the outcome screen showing a different choice than the one picked | Outcome and log read the stage the player faced (`seenStage`) |
| 1941 | End-screen log (roll odds, passed-over counts) used the re-resolved stage | Wrong odds shown in the after-action log | Same snapshot |
| 1940 | Same stale-stage problem | Outcome could show the wrong choice's result | Same snapshot |
| 1940 | Same, in the end-screen log odds | Wrong odds in the log | Same snapshot |
| 1922 | A roll outcome's own `next` was ignored unless the choice had none | `kornilovAffair17` crashed (4 of 48 recorded runs); endings "The Army That Did Not Come Back" and "The Admiral at Irkutsk" could never be reached | Roll outcomes route to their own `next` |
| 1922 | Ending "A Hollow Victory" (Bolsheviks) needed two flags that sit on opposite branches | Unreachable ending | Reachable after an assault on Kronstadt following either decision (you chose this); 5 seeded runs now end there |
| 1940 | **The game saved through `window.storage`, which only exists in Claude's artifact environment, and never defined it** | On itch.io and Windows: no Resume, no war record | localStorage-backed `window.storage` added (as 1941 already had); save tests and a migration helper added |
| 1940 | Discovery Atlas listed 205 of 250 situation reports | Atlas counts could never reach 250/250 | 45 missing nodes added |
| 1914 | WAR RECORD card on the menu was wider than the screen (missing `box-sizing`) | 20px of sideways scrolling on phones | Fixed |
| 1914, 1922, 1940 | Desktop layouts were 760px, full width, and 672px | Inconsistent; the 600px mobile-first column was not applied | 600px column on desktop for all three; phones unchanged |
| 1922 | 9px header label "FILE NO. 1922" below the 4.5:1 contrast ratio | Hard to read for some players | Slightly darker colour |

## Tooling and CI bugs that are fixed
| Where | Bug | Fix |
|---|---|---|
| CI (Windows) | Windows checked files out with CRLF line endings and 1914's `roundtrip` test failed | `.gitattributes` forces LF |
| Build guards | Timestamp-based "edited by hand" checks tripped on every second build | Content-based guards |
| 1940 | The audit extractor was broken by the music import | Extractor stubs fixed |
| 1922 | `monte-carlo.js` copied the old routing, so its numbers were wrong | Rewritten on the real game logic (`monte-carlo.mjs`); now names endings by title |
| Several | Windows-only scripts (`mkdir -p`, `cp`, `zip`, `/tmp`) | Made cross-platform |
| Refactor | First JSON conversion judged "plain data" by sampling and changed 10 runs | Converter now reads the source; baseline caught it before anything shipped |

## Open findings (not changed: they need a decision)
| Game | Finding | Why it is open |
|---|---|---|
| 1922 | Hard-mode endings for South Russia (`endingCossackMutiny`) and the Bolsheviks (`endingCentralCommitteeMoves`) cannot fire: capital is capped at 5 but one path can spend at most 4 (South Russia) or 3 (Bolsheviks). Siberia's fires | Balance decision: lower the cap per campaign or add capital-spending choices |
| All | Moderate accessibility findings (no `main` landmark, no `h1`, some heading-order) | Markup changes across every game; none are serious |
| 1914 | Its own CLAUDE.md lists an independent fact-check of every historical claim as the remaining gate before shipping | Your call before release (see docs/WORKFLOW.md) |
| 1914 | In-game title and file number say "1918" while the folder and package are "1914" | Naming decision |
| 1940 | Orphan check takes about 2 minutes (seeded random walks) | Slower CI; acceptable for now |

## False alarms (looked like bugs, were not)
- 1940: five nodes "never reached in random walks" (`specialSection41`, `tehran43`, ...) are hard-mode-only nodes; the check now starts runs in hard mode too.
- 1922: "ending never reached" lists were endings reached through a redirecting node (`kronstadtReckoning21` resolves to one of several endings); they are now matched by title.
- 1914: four "unreachable" endings were the hard-mode forced endings and one meter threshold at -10.
