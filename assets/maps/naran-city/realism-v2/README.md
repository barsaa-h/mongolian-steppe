# Naran v002 — E05f manager-review fixes

Artistic 2D layout choices for late November 1998, seed `19981128`, coordinates and footprints in metres. This pass replaces the residential grid scaffold, restores v001 roadside households, and raises courtyard furnishing counts. It does not publish a Blender scene. The accepted E05d ger dataset and its two images are unchanged. N01–N20, protected roads, N12, ARRIVAL and FOOT_ENTRY remain protected by regression tests.

## Regenerate and check

Run from the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 assets/maps/naran-city/realism-v2/organic_layout.py
PYTHONDONTWRITEBYTECODE=1 python3 assets/maps/naran-city/realism-v2/render_plan.py
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s assets/maps/naran-city/realism-v2 -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s assets/maps/naran-city/realism-v1 -p 'test_layout.py' -v
npm test
```

The renderer reads saved JSON; regenerate that first. Default rendering refreshes the five town plans. `--ger-only` explicitly refreshes the accepted ger plans. Standard library geometry, existing NumPy and Pillow only; no new dependencies or services.

## Residential layout

[qa-E05f-metrics.json](qa-E05f-metrics.json) records the delivery seed. **Coverage is clipped to the original reference rectangle** before dividing by its area: outward boundary extensions cannot inflate this result. This also corrects the E05e test's coverage calculation.

| District | House plots | Clipped coverage | Lane heading std | Axis-aligned edge share | BSP block area range |
| --- | ---: | ---: | ---: | ---: | ---: |
| East | 249 | 77.35% | 58.19° | 15.49% | 1,613–9,046 m² |
| West | 186 | 77.66% | 57.10° | 18.87% | 2,051–7,879 m² |
| Apartment south | 41 | 76.44% | 61.16° | 8.09% | 2,052–4,909 m² |

Each district has one connected lane graph. Tests require coverage ≥65%, heading std >15°, axis-aligned edge share <40%, and at least a 2:1 block area spread. Headings use the same signed undirected convention as the ger test; edge share counts polygon edges within 5° of an axis. The heading test alone can admit orthogonal grids, so it is paired with the edge-share check and visual inspection.

The residential pass reuses ger convex clipping, PCA longest-axis selection, ±8–20° recursive cuts and 35–65% split positions. Cuts reserve 4.8 m lanes. Block areas are measured before junction-cap carving. Each district has an artistic diagonal old track aimed at an existing junction; cuts terminate on the parent network. The 7 / 6 / 5-sided district outlines start with corner movements of 15–40 m. The east north edge follows the industry-road alignment; the south strip stays below the South distributor and tapers toward its old track. The three named east/west connections retain their original points.

Blocks are partitioned into non-overlapping, 28–38 m deep perimeter strips. Plot subdivision measures actual lane frontage rather than a strip's bounding box, keeping angled corner land instead of discarding it. Residential gates have 15–30 m frontages. Each yard has a 6–11 m house, privy, coal and firewood, often a shed; 30% have gardens. Existing yard containment and collision checks remain in use.

## Restored roadside housing

**299 subdivided roadside plots**: 80 North approach, 56 West avenue, 59 East avenue, 100 South distributor, 2 Civic north lane and 2 Apartment west lane. Each original household is associated with its nearest retained road segment, avoiding duplicate ribbons along nearby parallel lanes. The new plots face that road, with 14–28 m irregular frontages, 22–38 m proposed depths, tapered rear fences and 2–9 m gaps. Clipping can shorten rear depths around retained buildings and reservations. Parcels, roads, story routes, apartment blocks, garage aprons and courtyard objects are reserved before fitting ribbons; final clutter is fitted afterward.

The independent preservation test checks all **411 v001 household centres**, using the vertex mean of each original fence polygon. **300 lie inside a v002 parcel; 111 are within 30 m; the worst distance is 17.00 m.** There are no uncovered centres and `removed_with_reason` is explicitly empty. This is the brief's spatial preservation check, not a one-to-one identity mapping between old and new families.

Road-frontage lane records reference retained road centrelines for gate/access checks; the renderer skips these aliases so they cannot paint asphalt as dirt.

## Apartments, courtyards and retained work

The 12 E05e apartment records remain: two L corners, one merged pair, varied rotated slabs and fixed N12. N12 is at `[420,-370]`, rotation `0`, footprint `43 × 13 m`, four storeys, entrance `[420,-379.2]`. Apartment clearance ≥12 m, road setback ≥6 m and the two 2 m story-route corridors remain tested. The six garage rows / 52 boxes retain their reservations and access.

North / middle / south courtyards now have **6 / 7 / 6 cars**, **4 benches each**, **4 / 4 / 2 desire paths**, one playground frame, one rubbish point, two laundry lines and a heat-pipe polyline each. Paths are reserved before furniture; pipe clearance remains 0.6 m. The close-up draws real footprints at **4 px/m** and labels each courtyard's measured counts. All counts are within the round-4 ranges; the blocked south corners remain at two walks rather than cutting through a solid.

The final dataset contains **7,557 clutter and yard records**. The final Poisson pass still rejects footprints against roads, parcels, registered buildings, apartments, garages, routes and earlier clutter. No traffic lights, paid services, source edits or new dependencies.

## Evidence and verification

All five town images were regenerated and visually inspected after the final dataset and renderer changes. The east plan reads as unequal diagonal blocks, the south strip no longer repeats two rows, and roadside ribbons are visible along the original approaches.

Regenerated town evidence:

- [plan-east-residential.png](plan-east-residential.png) — diagonal track, unequal branching blocks and irregular perimeter, alongside v001.
- [plan-apartments.png](plan-apartments.png) — restored south strip and retained apartment forms.
- [plan-apartments-closeup.png](plan-apartments-closeup.png) — measured furniture, vehicles, entrances, pipe runs and garages at 4 px/m.
- [plan-market-centre.png](plan-market-centre.png) — roadside ribbons and retained commerce shells.
- [plan-v001-vs-v002.png](plan-v001-vs-v002.png) — town-wide preservation comparison.

The v002 suite passes **20 tests in 88.994 s**, including the accepted ger SHA, N12/routes, saved JSON equality, deterministic regeneration and seed 23. The unchanged v1 suite passes **7 tests in 0.077 s**; `npm test` passes **24 tests, 0 failures** (1.823 s). `git diff --check` is clean.

Validation logs: `qa-E05f-tests.log`, `qa-E05f-v1-tests.log`, `qa-E05f-npm-tests.log`. `qa-E05f-red.log` captures the new tests failing on the reviewed round-4 implementation. The metrics file is a snapshot; refresh it from regenerated geometry when changing the seed or generator. E05d/E05e metrics remain historical evidence.

## Remaining work

These are schematic plans, not production 3D proof. No Blender build/render, mesh fitting, materials, winter dressing, vehicle turning, actor blocking or historical asset review was performed. Only the delivery seed and existing seed-23 regression are tested; arbitrary seeds are not exhaustively audited. Manager art review remains open. Road wear and utility-wire sag remain preliminary.

Phase B can reuse v1 `firewood`, `coal_bin`, `privy`, `shed`, `small_timber_house`, `hay_stack`, `tractor`, and `farm_trailer` from `REALISM | 99 NEW MODULE LIBRARY`, plus suitable source ger, house, car and pole families. Fence/gate variants, garages, vehicle variants, water cans, laundry, dogs, scrap, tyres, dishes, livestock pens and sagging wires still need production fitting/material review.

## Accepted E05d ger study — preserved

`subdivide_ger_district()` uses standard-library geometry and NumPy for the longest-axis calculation. It perturbs the four `realism_layout.DISTRICTS` corners by 10–25 m and clips against retained roads with a 6 m setback from the carriageway edge. Moving corners outward is an artistic choice, preserving the reference district's extent. Recursive cuts use ±8–20° jitter and 35–65% split positions. The top three levels reserve 3.5–6 m lanes, adjusting the starting depth of smaller road-clipped pieces toward roughly 80 m blocks. Further cuts share fences; target areas are drawn from 150–1100 m², rejecting cuts without an 8 m core. There are 43 accepted convex adjacent-pair merges from 429 original leaves (10.02%).

Access passages follow a shortest-path tree through shared fence edges. They are 1.2 m wide, have explicit centre lines and carved gaps, and connect to the vehicle lanes. Junction repairs provide short fence-side spurs where a passage cap shortened a frontage. All surviving yards retain at least a 7 m core. Conservative convex clipping leaves some unused wedges at junctions; those gaps are excluded from coverage. The graph splits lane segments at intersections and endpoints, including collinear junctions.

Ger contents have a `parcel` owner and actual `footprint`, width, depth and rotation, retaining the existing clutter keys. Every occupied yard has a 6–7 m octagonal ger or a 6–10 m × 5–8 m house against its north/west fence, a far-corner privy, coal and wood near the dwelling door, and tier-dependent extras. Sheds occur in 61.96% of occupied yards. SAT rejects item collisions and half-plane fitting keeps all footprints inside fences. Condition ranking combines a smooth field, outer-edge/drainage penalties and seeded noise. Empty yards use `status: empty_lot`.

Measured E05d results are in [qa-E05d-metrics.json](qa-E05d-metrics.json):

| Measurement | Result |
| --- | ---: |
| Coverage inside the original 445 × 360 m district | **77.34%** (123,897.58 m²) |
| Ger parcels | **389** |
| Poor / ordinary / maintained / better-off | **117 / 156 / 85 / 31** |
| Empty lots | **21** (5.40%) |
| Vehicle lanes / connecting lanes / reused arterial links | **18 / 6 / 2** |
| Pedestrian passage segment records | **641** |
| All ger lane records | **667** |
| Joined graph nodes / edges / components | **809 / 839 / 1** |
| Dead ends, including pedestrian spurs | **164** |
| Contacts with Ger approach / South distributor | **6 / 8** |
| Lane heading standard deviation | **49.28°** (axial headings −90°…90°) |
| Parcel edges within 5° of an axis | **18.91%** |
| Remaining shared fence pairs longer than 8 m | **222** |
| Checked ger item footprints | **2,292** |

The large passage count is a count of short fence-edge segments, not separate vehicle streets. Their `role` distinguishes them from vehicle lanes. `ger_lane_graph` contains joined nodes and lane-owned edges; `ger_subdivision` records the boundary and subdivision measurements.

Evidence: [plan-ger.png](plan-ger.png) compares v001 and v002 at 6 px/m; [plan-ger-closeup.png](plan-ger-closeup.png) shows a 200 × 150 m crop at the same scale. Both were visually inspected: the new district reads as a dense irregular patchwork with branching lanes and narrow fence passages. Cream octagons/circles are gers, brown rectangles houses, red privies, black coal and gold striped firewood; pale gate dots lie on lane edges. The v001 manifest contains fence polygons but no item footprints, so its comparison panel explicitly shows fences only. No inferred v001 dwelling footprints are presented as measured geometry.

At E05d acceptance: the v002 layout suite passed 12 tests, including coverage, zero parcel/road/lane overlaps, 6 m arterial setbacks, minimum yard width, gates, connected graph, item containment/collisions, angular metrics, merging, protected geometry and determinism. The original v1 layout suite passes 7 tests; `npm test` passes 24 tests. See [v002 test log](qa-E05d-tests.log) and [v1 test log](qa-E05d-v1-tests.log). Seed 23 also generates a different layout successfully; arbitrary seeds have not been exhaustively audited.
