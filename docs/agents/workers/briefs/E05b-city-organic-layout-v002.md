# Brief E05b — Naran city v002, phase A: break the grid (layout data only, no Blender)

**Department:** environments (`docs/agents/03-environments.md`, E05a city realism / E04 tiers). **The user's complaint, in their words:** the city is "too organized, too clean". Earlier they asked for:
- apartments that each look different, some merged;
- ger districts that aren't all the same, some poor ("woods falls out");
- roads that aren't too fresh, with cracks;
- "random things" that make it lived-in;
- garages and lots of old cars;
- farmers a little outside the centre;
- **no traffic lights** (1998).

**This is phase A: the layout and the data, generated in pure Python and reviewed as 2D plans.** Phase B, building it in Blender, is a separate job after the user sees your plan. **Don't run Blender.** Another worker is using it, and the laptop has 14 GB of RAM.

## The manager's diagnosis (verify it yourself in the code and `realism-v1/previews/comparisons/comparison-sheet.jpg`)
- `assets/maps/naran-city/layout.py`:
  - the ger district is a perfect 5×4 orthogonal grid of lanes at an exact 90 m spacing (`Ger lane …`, `Ger street …`);
  - both residential neighbourhoods are perfect grids at 80 m × 75 m (`NEIGHBORHOOD_ROADS`).
- `realism-v1/realism_layout.py` `household_profile()`:
  - plots are almost identical (15–18 m wide, 17.6–19 m deep, skew ±0.6 m);
  - condition cycles deterministically by `index % 6`, so only 1 in 6 is "patched" and the pattern repeats;
  - one dwelling sits centred in each square plot.
- Apartment blocks: identical slabs in rows, all the same orientation and spacing, clean and white.
- Roads: crisp asphalt with fresh white centre lines, sharp edges, no shoulders, potholes or dirt tracks. Open ground is uniform, with no desire paths.

## Read first
- `artifacts/character-master/sources/world/NARAN_CITY_REALISM_AGENT_MASTER_PROMPT_v1.1.md` and `NARAN_CITY_AGENT_QA_SHOT_CHECKLIST_v1.1.md`: the city realism brief. **Follow it.**
- `artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md`: the town's geography and life.
- `assets/maps/naran-city/realism-v1/README.md`, `PRODUCTION-HANDOFF.md`, `CHANGES.md` and `CATALOG.md`: what v001 did and what it protects.
- `assets/maps/naran-city/layout.py`, `realism-v1/realism_layout.py`, `realism-v1/upgrade_realism.py` and `realism-v1/test_layout.py`.
- `artifacts/character-master/sources/world/data/naran_locations.csv`: the **20 registered landmarks**.

## Protected (must not move)
- All 20 registered landmark positions (XYZ), and the story routes: `ARRIVAL`, `FOOT_ENTRY`, the hospital lanes and the apartment N12 entrance.
- The arterial roads: North approach, West/East avenues, South distributor, civic lanes, hospital lanes, plant/grain/fuel access, apartment lanes. You may roughen their **edges and surfaces** in the data (shoulder width, wear zones), but not their centre lines.
- The `EP01_*` sets in `assets/maps/episode-1/` are separate. Don't touch them.

## Free to change (artistic layout, labelled as artistic choices)
- **Ger district:**
  - Replace the orthogonal lane grid with **organic lanes**: lanes that bend and follow the terrain and drainage, dead ends, irregular widths of 3–6 m, and lanes that kink around compounds.
  - Make the khashaa (fenced yards) vary strongly: 8–40 m sides, irregular quadrilaterals, shared fence lines, merged and subdivided plots, odd leftover gaps, a few empty or abandoned plots.
  - Dwellings sit off-centre, usually against a fence line, often with a ger *and* a small house, sheds, an outhouse and coal/wood piles.
  - Use a mix of condition tiers chosen by a seeded random draw weighted by area, **not** `index % N`: poor (missing boards, patched sheet metal, leaning fence), ordinary, maintained, better-off (brick house, painted fence, garage).
- **Residential neighbourhoods:** keep their connections to the arterials, but jitter and bend the inner streets, vary the block sizes, and add alleys, garages (rows of Soviet metal or brick garages), and dirt parking.
- **Apartment microdistrict:**
  - Give each block its own data: length (3–6 sections), storeys (4–5), small rotation offsets (±3–8°), an occasional L-shape or merged pair, the condition and stains, enclosed balconies, laundry, rooftop antennas, entrance details.
  - Keep N12, Ganaa's block, where it is, with its entrance.
- **Road surface data:** per road segment record condition (asphalt cracked, asphalt potholed, gravel, dirt), shoulder type, potholes and puddle positions, and **no lane markings** except maybe faded remnants on the main avenue. Add **desire paths** (worn dirt tracks across open ground between busy points).
- **Clutter and life placement data**, seeded and denser near homes, shops and lanes:
  - coal and wood piles, water cans, laundry lines, dogs;
  - rusted or abandoned cars (UAZ, Moskvich, Zhiguli), tyres, scrap, sheds, satellite dishes (rare in 1998);
  - utility poles with sagging wires, chimneys (for later smoke), small vegetable plots;
  - on the outskirts, farm yards with hay, livestock pens and machinery.
- Everything must be **deterministic from a seed**.

## Deliverables (new folder `assets/maps/naran-city/realism-v2/`; don't edit v1 files)
1. `organic_layout.py`, standard library plus numpy and Pillow (both installed), which imports the base `layout.py` registry and produces `city-layout-v002.json`. It contains: roads (centre lines, widths, surface segments), lanes, parcels (polygons, condition, contents), apartment blocks, desire paths, a clutter list (type, xy, rotation, scale) and garages.
2. `render_plan.py`: makes 2D plan PNGs with Pillow.
   - `plan-v001-vs-v002.png`: side-by-side whole town, same scale.
   - Zooms at the same scale for v001 vs v002: ger district, east residential, apartment microdistrict, market/centre.
   - Colour by condition tier, roads by surface, clutter as small dots.
3. `test_organic_layout.py` (unittest), checking:
   - protected landmarks and arterial centre lines are unchanged from v001;
   - no parcel overlaps another parcel or a road;
   - every parcel has a gate reachable from a lane (reuse v1's approach-clearance idea);
   - lanes connect into the road network (no orphan lanes);
   - the condition-tier distribution is within the target ranges and spatially mixed, not periodic (for example, a neighbour-correlation test);
   - **there are no traffic lights**;
   - determinism: the same seed gives a byte-identical JSON.
4. `README.md` (short): what changed versus v001, the seed, the counts per category, and how phase B should consume the JSON (object types → existing v1 prop modules in the `99 NEW MODULE LIBRARY` collection where possible; list the new modules phase B must model).
5. `PHASE_B_TODO.md`: an exact checklist for the Blender pass, in this order:
   - build from the JSON into a new `Naran-City-Realism-v002.blend` (never overwrite v001);
   - matching review renders from the same 8 cameras;
   - a triangle/performance budget per the T2 tier;
   - which v1 checks to re-run.

## Done when
- `python3 -m unittest assets/maps/naran-city/realism-v2/test_organic_layout.py` passes.
- The existing `realism-v1/test_layout.py` still passes.
- `npm test` passes.
- The plan PNGs exist. **Look at them yourself:** if the v002 ger district still reads as a grid at a glance, iterate before reporting.
- The report includes the counts (parcels by tier, clutter by type, garages, desire paths) and the paths of the plan images.

## Allowed paths
`assets/maps/naran-city/realism-v2/**` only.
