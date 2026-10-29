# Naran v002 — E05d ger subdivision study

Artistic layout choices, seed `19981128`, in metres. This round replaces only ger parcels, lanes and their contents. Protected roads, N01–N20 anchors, arrival/foot-entry routes, apartments, garages, desire paths, and every non-ger parcel, lane and clutter record are preserved. The two ger `arterial_connection` records reuse existing protected road centre lines; they do not add or move roads.

Regenerate the dataset and the two ger plans from the repository root:

```sh
python3 assets/maps/naran-city/realism-v2/organic_layout.py
python3 assets/maps/naran-city/realism-v2/render_plan.py --ger-only
python3 -m unittest discover -s assets/maps/naran-city/realism-v2 -p 'test_*.py' -v
```

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

Verification: the v002 layout suite passes 12 tests, including coverage, zero parcel/road/lane overlaps, 6 m arterial setbacks, minimum yard width, gates, connected graph, item containment/collisions, angular metrics, merging, protected geometry and determinism. The original v1 layout suite passes 7 tests; `npm test` passes 24 tests. See [v002 test log](qa-E05d-tests.log) and [v1 test log](qa-E05d-v1-tests.log). Seed 23 also generates a different layout successfully; arbitrary seeds have not been exhaustively audited.

**Full phase A and phase B remain incomplete.** This round did not change apartment/residential placement, garage rows, courtyard life, road wear, wire sag or non-ger clutter fitting. Those existing records remain proposals, including non-ger clutter without collision-checked footprints. The other four comparison images were not regenerated. No Blender build, 3D fit check, story-set ground-truth survey or shot blocking review was run. N12 still has its registered 43 × 13 m footprint, position and entrance; full scene-transform verification remains for phase B.

Phase B can reuse v1 `firewood`, `coal_bin`, `privy`, `shed`, `small_timber_house`, `hay_stack`, `tractor`, and `farm_trailer` from `REALISM | 99 NEW MODULE LIBRARY`, plus source ger, house, car and pole families where suitable. Fence/gate variations, garage rows, vehicle-specific variants, water cans, laundry, dogs, scrap, tyres, dishes, livestock pens and sagging wires still need production asset and fit review. These mappings do not establish compatible 3D footprints or historical accuracy.
