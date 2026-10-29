# Brief E05e — Residential, apartments, garages and clutter (round 4, same worktree)

The ger patchwork from round 3 was **accepted and merged** (77% coverage, connected lanes, collision-checked yards). Good work. Now apply the same quality to the rest of the town. Keep everything from round 3 as it is.

## 1. East and west residential neighbourhoods
- Reuse your subdivision code at house-plot scale: plots of 15–30 m, a lane depth that gives blocks of about 70–110 m, and lanes 4–6 m wide that bend away from the old v001 grid lines.
- Keep the connections to the arterials (`East residential north connection`, `East residential west connection`, `West residential east connection`) at their existing points.
- Each plot gets a house (6–11 m), often an outbuilding, a fence, a small garden for 30% of plots, a coal pile and a privy. Use the same tier logic, slightly better-off on average than the ger district.
- Coverage of at least 65%. Every gate sits on a lane.

## 2. Apartment microdistrict (district `Apartment microdistrict`, the area between the apartment lanes)
- One record per block:
  - sections 3–6 (about 14–18 m per section), giving the length;
  - 4–5 storeys;
  - a rotation of ±3–8° off the nearest street, varied between neighbours;
  - 1–2 L-shaped corner blocks and 1 merged pair;
  - condition and stain tiers;
  - `enclosed_balconies`, `laundry` and `antennas` counts;
  - entrance positions on the courtyard side.
- **N12, Ganaa's block, stays exactly at its registered position and rotation, with its entrance `FOOT_ENTRY`.** Test this.
- Blocks keep at least 12 m of clearance from each other and at least 6 m from roads. The `ARRIVAL` route and the N12 entrance stay clear.
- **Courtyard life per courtyard:**
  - a playground frame, 2–4 benches, a rubbish point;
  - a dirt parking patch with 3–8 cars (UAZ, Moskvich, Zhiguli, a few rusting);
  - an above-ground heat pipe run, drawn as a polyline with 0.6 m clearance;
  - laundry lines;
  - 2–4 desire paths cutting the corners.
- **Restore the private houses south of the apartment lane** (v001 had them; round 2 lost them) as subdivided plots.

## 3. Garages
- 4–8 rows of Soviet metal or brick garages (6–14 boxes each, about 3.5 × 6 m) on waste strips near the apartments, the market and the plant access.
- Each row has a dirt apron in front, reachable from a road or lane.

## 4. Clutter, town-wide
- A final Poisson-disc pass with a minimum spacing per type.
- Nothing may overlap footprints, roads or other clutter, except parked cars, which belong on shoulders or aprons.
- Types: as in round 2, plus stray dogs near the market and garages, and a few burnt or abandoned car shells on the fringes.
- No traffic lights.

## Tests to add (all tests must pass)
- Residential coverage of at least 0.65; no overlaps; gates on lanes; a connected lane graph.
- Apartment checks: block clearance, road setback, rotation variety (at least 80% non-zero excluding N12), **N12 unchanged**, and the ARRIVAL and FOOT_ENTRY route corridors (2 m) clear.
- Garage rows are reachable and don't overlap anything.
- Clutter has no overlaps.
- Determinism.

## Images
- Regenerate `plan-east-residential.png`, `plan-apartments.png`, `plan-market-centre.png` and `plan-v001-vs-v002.png`.
- Add `plan-apartments-closeup.png` at about 4 px/m, drawing real footprints: blocks as polygons, cars, benches, pipe runs, garages.
- **Look at each image.** The apartments must read as a lived-in late-Soviet microdistrict, not rows of identical slabs. Iterate if they don't.

## Report
Include the metrics, counts and image paths. Update `README.md` and `PHASE_B_TODO.md`. Allowed paths: `assets/maps/naran-city/realism-v2/**`.
