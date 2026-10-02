#!/usr/bin/env bash
# Full validation suite. Spec §11 ship gate.
FILE=${1:-dispatches-greatwar.jsx}
FAIL=0
for v in check-node-ids check-dates check-rolls check-commander-timing \
         check-classification check-flag-values check-gates check-bulletins \
         walk-historical check-advisor-coverage check-will-labels check-meta-language; do
  node "$v.js" "$FILE" || FAIL=1
done
node check-continuity.js "$FILE"   # advisory, never fails the build
echo "---"
[ $FAIL -eq 0 ] && echo "SUITE PASS" || echo "SUITE FAIL"
exit $FAIL
