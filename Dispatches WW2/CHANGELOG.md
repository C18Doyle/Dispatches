# Dispatches WW2 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. The histories of the two games this one joins are in
`../Dispatches 1940/CHANGELOG.md` and `../Dispatches 1941/CHANGELOG.md`.

## 0.1.0 (unreleased)

### Added
- **One game, six commands.** Dispatches 1940 (OKW, STAVKA, SHAEF, Comando Supremo) and Dispatches 1941 (IGHQ, CINCPAC) are one game: the six commands are on one opening screen, share one war record, one set of settings, the seven languages of the interface and their own saves (new storage keys, so a 1940 or 1941 save is never read or overwritten).
- **The same three meters everywhere.** The Pacific commands' Readiness and Pipeline are now Manpower and Matériel, as in Europe; Initiative is unchanged. Each command keeps its own readings under them (IGHQ and CINCPAC: Training, Forces and Morale; Fuel & Oil, Shipping and Industry).
- **The Pacific commands play as they did.** Each command plays by its own game's rules (src/rules.ts): the Pacific commands keep 1941's rolls, strain, arrears, trust, hard modes (Fanatical Resolve for IGHQ, Coalition Resolve for CINCPAC) and their nine battles; the European commands are 1940's.
- **The Pacific map in the European map's tones.** The map under each Pacific report and the theatre map at the end of the war are 1941's, drawn in the European staff map's colours: the same sea, land, status colours at half strength, hatch for contested ground and serif place names. Night reading darkens both alike.
- **The Pacific commands' events.** 1941's fourteen state-driven events appear between reports on the special-dispatch screen.
- **War-room letterheads** for IGHQ and CINCPAC, with Yamamoto's and Roosevelt's words.
