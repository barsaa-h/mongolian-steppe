# ХАНИАД — quality, life & density master plan

*v1.0 · 2026-10-28 · companion to blender-map-master-plan.md*

## What this plan fixes

The sets read as **too minecrafty**: sharp un-beveled boxes, no corner shading,
few moving things, sparse props, big empty ground. Five work streams:

### A. De-blockify (geometry)
1. **Bevel everything static** through the Blender pass — `map-studio.py enhance`
   applies a 1-segment angle-limited bevel to every BASE mesh, re-exports. The
   razor-edge box look dies here.
2. **Replace remaining pure boxes in close view** where cheap: poles/fences stay
   (period-correct), but hero furniture gets bevels via A1; cylinders gain sides.
3. **Material response**: runtime Lambert stays flat, but each set's GLB keeps
   Blender-smoothed normals on curved parts (cans, bags, pipes) so highlights roll.

### B. Depth & lining (shading/atmosphere)
1. **Seam/AO lining in textures**: painted seams and edge grime in floors
   (linoleum tile gaps), grout already on tiles; wall bottoms already carry AO.
2. **Contact grounding**: every hero prop gets a baked darkening quad (soft AO
   decal) under/behind it in the Blender pass — kills the floating look.
3. **Layered air**: keep fog; add dust haze quads on the steppe horizon and
   interior light-shaft planes where a window exists.

### C. Movement & object logic (`src/ambientLife.js`)
A deterministic, time-driven ambient system (same pattern as smoke/laundry):
- **Swinging**: hanging signs, lanterns, cables/wires sag + sway; gates creak
  on hinges; curtains flap at open windows.
- **Rolling**: tumbleweeds crossing the steppe road; papers already tumble in town.
- **Weather**: dust devils (spiral sprite columns) that form, drift and die.
- **Traffic & fauna**: a car drives the avenue end-to-end and loops; stray dog
  wanders yard to yard; extra pedestrians walk the pavements; crows land/startle.
- Wired into the town map (world.js apply loop) and every film set's update.

### D. Density & missing assets (the "empty map" fix)
Town: parked cars along the avenue, crates/barrels/pallets at the store and
market, sheep flock outside town, horse riders on the ridge, ovoos (stone
cairns) on the hills, roadside milestones. Sets: per-script dressing where a
beat needs it (tea bowl + thermos + cooler for EP1's cab, party residue).

### E. Episode 1 completeness
Script location list → sets: freight yard ✓ · yard office ✓ · **border road ✗
(NEW: `ep1-border-road` — the Dasha pickup, tea bowl, "Собака")** · KAMAZ cab ✓
(hour-five) · roadside café ✓ · apartment party ✓. After this, every scripted
EP1 location is a playable scene.

## Order
1. `ep1-border-road` scene + script cues (E)
2. `ambientLife.js` + wiring into town + sets (C)
3. Town density pass (D)
4. Blender `enhance` bevel+AO pass over all 11 authored sets (A+B2)
5. Gates: tests, check, seek-through, screenshots (before/after)

## Gates
Unchanged: `npm test` + `npm run check` + zero-error seek-through on every
scene (with authored overrides active) + before/after screenshots + the PSX
check (720 lines, crunch, 1998).
