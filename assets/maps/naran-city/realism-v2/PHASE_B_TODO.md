# Phase B checklist — E05f 2D corrections; 3D build remains open

- [x] Preserve accepted E05d ger geometry, graph, metadata, contents, desire path and both images; regression SHA checked in the suite.
- [x] Replace residential grids with jittered BSP blocks, irregular road-following outlines and diagonal old tracks. East / west / apartment-south: 249 / 186 / 41 plots; clipped reference coverage 77.35% / 77.66% / 76.44%; connected access and original named connections.
- [x] Add not-a-grid tests to all three residential districts: heading std 58.19° / 57.10° / 61.16°, axis edge shares 15.49% / 18.87% / 8.09%. Test cut jitter, varying split positions, corner displacement and genuine block-size variance.
- [x] Restore 299 road-facing plots with 14–28 m frontages, varying depths and gaps. All 411 v001 centres are inside a new parcel or within 17.00 m; explicit removal list empty.
- [x] Raise courtyard life: north / middle / south 6 / 7 / 6 cars; 4 benches each; 4 / 4 / 2 corner paths; playground, rubbish, laundry and heat pipes retained. N12, story corridors, 12 blocks and 6 garage rows / 52 boxes retained.
- [x] Regenerate and visually inspect the five requested town images; close-up retains 4 px/m footprints and adds courtyard counts. Evidence and measured definitions: README and `qa-E05f-metrics.json`.
- [x] Final verification: v002 20 tests / 88.994 s; v1 7 tests / 0.077 s; application 24 tests / 0 failures; `git diff --check` clean. Full output retained in `qa-E05f-*-tests.log` / `qa-E05f-tests.log`.
- [ ] Manager review of the schematic plans and artistic choices. Production 3D and look approval remain separate.
- [ ] Build JSON into a new versioned `Naran-City-Realism-v002_v###.blend`, preserving v001 and the separate EP01 sets. Preserve all story anchors, N12 and routes. Reuse suitable v1 modules and create the missing asset families listed in README. Fit actual meshes to the checked footprint records, including L wings, stepped merged pair and pipe supports.
- [ ] Match actual fence gates to lane edges, orient courtyard entrances toward usable walks, prove parking and garage driving access, and review pipe clearance in 3D. Keep N12's existing transform and hero entrance exact.
- [ ] Make matching Eevee review renders from all eight v1 cameras, and inspect them against v001. Winter dressing, materials and shot blocking require separate checks.
- [ ] Record actual triangle counts and runtime measurements, make LODs and audit T2 texture sizes (256–512 pixels); the production plan sets a 5k-triangle ceiling for each crowd actor but no numeric town-wide triangle ceiling. Agree a measured scene budget before claiming compliance.
- [ ] Re-run v1 `test_layout.py`, `verify.py`, `review.py`, relevant geometry/approach, landmark, road support/grade, roof support, routes, school and hospital clearance checks in the new scene. Verify door/actor/vehicle blocking separately.
