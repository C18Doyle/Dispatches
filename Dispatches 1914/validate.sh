#!/usr/bin/env bash
# Full validation suite. Spec §11 ship gate.
FILE=${1:-dispatches-greatwar.jsx}
FAIL=0
for v in check-node-ids check-dates check-rolls check-commander-timing \
         check-classification check-flag-values check-gates check-bulletins \
         check-anachronisms check-text-integrity check-claims walk-historical check-historical-ending check-prose-length check-quotations check-maps check-advisor-coverage check-will-labels check-meta-language check-rank check-glossary check-battles check-themes check-asks check-briefings check-order-notes check-live-voice check-conditions check-ui-copy check-consistency check-wire check-events check-intel check-trust check-mapops check-ground check-risks check-documents; do
  node "$v.js" "$FILE" || FAIL=1
done
node check-continuity.js "$FILE"   # advisory, never fails the build
echo "---"
[ $FAIL -eq 0 ] && echo "SUITE PASS" || echo "SUITE FAIL"
exit $FAIL
