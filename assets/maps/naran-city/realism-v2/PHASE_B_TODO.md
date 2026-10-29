# Phase B checklist — blocked pending phase A completion

- [x] E05d ger subdivision, access and collision-checked yard footprints: 77.34% coverage, 389 parcels; inspect `plan-ger.png`, `plan-ger-closeup.png` and `qa-E05d-metrics.json`. Pure 2D layout evidence.
- [ ] Complete the remaining phase A work: apartment/residential layouts, non-ger footprint fitting, garages, courtyard life and other incomplete items in README; refresh their comparisons before building the full dataset.
- [ ] Build JSON into a new `Naran-City-Realism-v002.blend`, preserving v001 and the separate EP01 sets. Keep N12 and story access fixed; use reusable v1 modules where suitable and create the missing modules listed in README.
- [ ] Make matching review renders from all eight v1 cameras, and inspect them against v001.
- [ ] Record actual triangle counts and runtime measurements, make LODs and audit T2 texture sizes (256–512 pixels); the production plan sets a 5k-triangle ceiling for each crowd actor, but does not specify a numeric town-wide triangle ceiling. Agree a measured scene budget before claiming compliance.
- [ ] Re-run v1 `test_layout.py`, `verify.py`, `review.py`, relevant geometry/approach, landmark, road support/grade, roof support, routes, school and hospital clearance checks, and review any failures in the new scene. Verify door/actor/vehicle blocking separately.
