# Brief E05c — City v002 phase A, round 2 (same worktree, continue your work)

The manager reviewed your round-1 `realism-v2/` output. Thanks for the honest "partial" report. **Keep the module structure, then fix the following.** This is still pure Python, **no Blender**. The full original brief is in `docs/agents/workers/briefs/E05b-city-organic-layout-v002.md` (it's in your worktree); everything in it still applies.

## What the plan images show
1. **Ger district (`plan-ger.png`):** it reads as four parallel wavy "strings of beads", with yards hanging off isolated lanes, large empty bands between rows, and lanes that don't connect to each other. Some yards overlap each other (top row). A real Mongolian ger district is a **contiguous patchwork**: fenced yards packed edge to edge, sharing fence lines, with a **branching** lane network between blocks and occasional leftover gaps and empty plots. The district should cover the area at least as densely as v001 did.
2. **Apartments (`plan-apartments.png`):** essentially unchanged. The same row-aligned rectangles, now smaller, no rotation, no L-shapes or merged pairs, no garages or courtyard life, and the private houses south of the lane disappeared.
3. Clutter can overlap. Dwelling footprints aren't checked.

## Required method (use this or something demonstrably at least as good)
**Ger district: subdivide, don't place.**
- Start from the district polygon, as in `DISTRICTS` in `realism_layout.py`, clipped against the protected arterials with a setback.
- **Recursively split** polygons with slightly angled cut lines: jitter of ±8–20° from the longer axis, split position 35–65%. Pick the cut that follows terrain or drainage where possible.
- At the upper levels, some cuts become **lanes**: leave a 3–6 m gap and record the lane centre line. The result is a branching tree of lanes with a few loops and dead ends. Every leaf block then splits further into **khashaa** of 8–40 m sides that share boundaries; no gaps between neighbours except lanes, and 3–8% leftover or empty lots.
- Merge about 10% of neighbouring khashaa pairs and split about 10% unevenly.
- Every khashaa gets a gate on a lane edge. Lanes connect to the network.
- Place dwellings **against a fence line** (usually north, for wind), rarely centred. Place the ger and/or house, a privy in a far corner, coal and wood by the door, and a shed.
- Each item's footprint must lie inside its yard and must not overlap any other item. Use simple rectangles with a separating-axis test; you already have one in v1.

**Residential (east, west): the same subdivision idea at house-plot scale.** Plots of 15–30 m, streets bent from the old grid lines, and connections to the arterials kept. Add **garage rows** (6–14 Soviet metal or brick boxes) on 3–6 waste strips near the apartments and the market.

**Apartments: one record per block.**
- Sections 3–6, giving 40–110 m length.
- Rotation ±3–8° off the street, alternated, plus 1–2 L-shaped corners and one merged pair.
- 4–5 storeys, a stain/condition tier, `enclosed_balconies` count, `laundry`, `antennas`.
- **N12 stays exactly as registered.**
- Courtyard life between blocks: a playground frame, benches, a rubbish point, a dirt parking patch with 3–8 cars, a coal/heat pipe run above ground, desire paths cutting the corners.
- Restore the private houses south of the lane as subdivided plots.

**Clutter:** a final pass with Poisson-disc spacing (minimum distance by type) and no overlap with footprints, roads (except cars parked on shoulders) or other clutter.

## Tests to add or extend
- No two parcels overlap, and no parcel overlaps a road or lane buffer.
- No dwelling, shed or clutter footprint overlaps another or leaves its parcel.
- Every lane connects to the network (graph connectivity).
- Ger-district **coverage**: the parcel area inside the district polygon is ≥ 70%.
- **Not-a-grid metric:** the standard deviation of lane segment headings is greater than 15°, and fewer than 40% of parcel edges are within 5° of the axis-aligned directions.
- Apartment rotations are non-zero for at least 80% of blocks, except N12.
- Protected landmarks and arterial centre lines are unchanged (keep this).
- Determinism (keep this).

## Images
Regenerate all plan PNGs. Add a **1:1 close-up** `plan-ger-closeup.png` at about 6 px/m showing about 150 m × 100 m, with yard contents drawn. **Look at each image.** If the ger district doesn't read like an aerial photo of an Ulaanbaatar or aimag-centre ger district (dense patchwork, branching lanes) at a glance, iterate before reporting.

## Done when
- All tests pass, the v1 tests still pass, and `npm test` passes.
- The README and PHASE_B_TODO are updated.
- The report includes the counts, the metric values (coverage, heading std, axis-aligned share) and the image paths.

## Allowed paths
`assets/maps/naran-city/realism-v2/**` only.
