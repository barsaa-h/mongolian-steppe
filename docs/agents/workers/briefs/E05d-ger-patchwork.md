# Brief E05d — Ger district patchwork ONLY (round 3, same worktree)

Two rounds didn't produce the core algorithm: ger coverage is 13%, against a target of at least 70%. **This round does one thing: the ger district subdivision.** Ignore apartments, residential, garages and clutter polish this round. Don't remove what exists for them; just don't work on them.

## Implement `subdivide_ger_district()` in `assets/maps/naran-city/realism-v2/organic_layout.py`
Write it as a self-contained function with helpers (polygon area, split by line, inset, separating-axis overlap). Use the standard library plus numpy.

1. **Input polygon:** the `Ger/house compounds` district rectangle from `realism_layout.DISTRICTS`, made irregular by moving each corner 10–25 m. Clip it against the protected arterials (`Ger approach`, `South distributor`, etc. from `layout.ROADS`) with a 6 m setback, by cutting the polygon along those road lines and keeping the pieces.
2. **Recursive split:** function `split(poly, depth)`.
   - Cut perpendicular to the longest axis, rotated by a random ±8–20°, at 35–65% of its length.
   - If `depth < LANE_DEPTH` (about 3–4 levels, chosen so that blocks are about 60–120 m), the cut becomes a **lane**: offset both halves by `lane_width/2`, with `lane_width` from 3.5–6 m, and record the lane centre line clipped to the parent polygon.
   - Below that depth, the cut is a **shared fence line** with no gap.
   - Stop when the polygon area is under `A_target`, drawn per polygon from 150–1100 m² (khashaa of about 12–35 m sides).
   - Reject cuts that create a slab thinner than 7 m.
3. **Post-pass:**
   - Merge about 10% of adjacent leaf pairs that share an edge longer than 8 m.
   - Mark 3–8% of leaves as `empty_lot`.
   - Every non-empty leaf must touch a lane, or reach one through a 1.2 m gap passage; record a `gate` point on the lane edge.
4. **Lane graph:** join lane segments at their endpoints and intersections, and connect the lane network to `Ger approach` and `South distributor` at 2 or more points. Lanes may dead-end.
5. **Yard contents, as rectangles with a separating-axis check, all inside the yard:**
   - a main dwelling (a ger of about 6–7 m diameter as an octagon, and/or a house of 6–10 m × 5–8 m) placed against the north or west fence;
   - a privy of about 1.2 × 1.2 m in a far corner;
   - a coal and wood pile near the dwelling door;
   - a shed with 60% probability;
   - extra items depending on the condition tier.
6. **Condition tier per yard:** a seeded draw with spatial clustering, for example a smooth noise field plus noise; poorer towards the outer edge and the drainage.

Replace the old ger parcels in `city-layout-v002.json` with this output, using the same schema keys. Keep the protected checks.

## Tests (in `test_organic_layout.py`; all must pass)
- Ger coverage of at least 0.70.
- No two parcels overlap; parcel-to-lane overlap is 0 (lanes are gaps).
- Every non-empty parcel's gate lies on a lane edge (within 0.5 m).
- The lane graph is connected and touches the arterials at 2 or more points.
- Item footprints lie inside their parcel and don't overlap each other.
- The heading std and axis-aligned share metrics from round 2 stay in range.
- Determinism.

## Images
- Regenerate `plan-ger.png` (v001 vs v002) and `plan-ger-closeup.png` at about 6 px/m, **drawing the actual footprints**: fence polygons, dwellings, ger circles, privies, piles.
- Look at the close-up. It must read as a dense, irregular patchwork with branching lanes. If not, tune the parameters and repeat.

## Report
Include the metric values, parcel counts by tier, the number of lanes and dead ends, and the image paths. Allowed paths: `assets/maps/naran-city/realism-v2/**`.
