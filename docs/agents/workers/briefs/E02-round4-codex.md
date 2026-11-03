# E02 round 4 (Codex): finish the café look (continue round 3)

**What happened last round:** you built `EP01-Map_v007.blend` with `build_cafe_r5.py`, but `check_cafe_r5.py` failed (18 textures > 12; 9,829 tris is fine) and then Blender hung. **That hang is fixed:** `.cache/e02/run_blender.sh` now runs every `--python` script through a safe runner that always exits Blender, even on an error. It uses your own lock (`~/ms-workers/.blender-e02.lock`), so nothing else blocks you. Run Blender in the foreground and wait; never cancel a run because of the lock.

## Do, in order
1. Fix the texture count: **atlas** the new textures into ≤ 12 (e.g. one 256² "props" atlas, one "ground/snow" atlas), keeping nearest filtering and no mipmaps. Build → `v008`. Run the check until it passes.
2. Render the previews `r5-*` (exterior wide, forecourt from the road, counter, card table, rear door + yard, and a new over-the-shoulder view from the front door into the room). **Open every image and judge it.**
3. Do at least 2 more fix rounds (`r6-*`, `r7-*`; `v009`, `v010`…) against the round-3 fix list below, and keep each round's images.
4. Update `assets/maps/episode-1/previews/cafe-ps2/report.md` honestly.

---

# Round-3 fix list and rules (still in force), included in full

Continue in this worktree (`~/ms-workers/E02`) from `EP01-Map_v006.blend` and `assets/maps/episode-1/build_cafe_ps2.py`. Your checks pass (guard, fitting 0.73 m, 2 chains, rear path, 8,172 tris, 12 textures); keep them passing.

The manager reviewed `previews/cafe-ps2/r4-*.png`. **The layout is right; the set reads as an empty clean block-out.** It's an EP01 hero location (the attack happens here), so it needs to look like a real, poor, frozen roadside café in rural Mongolia in 1998, seen in the PS2 / Silent Hill 2 style (low-poly, small pixel textures with painted grime, darkness and practical light).

## Fix list
1. **Snow and cold.** The ground is clean blue-grey with a few white flakes. Add packed dirty snow on the ground with frozen tyre ruts; snow drifts against the walls and the guard; snow on the roof edge; icicles along the eaves (a few low-poly wedges); frost at the bottom of the windows.
2. **Grime on every surface.** The walls are flat beige and the roof is clean. Paint the textures: water streaks under the eaves, soot above the door and stove pipe, a dark dirt band along the bottom of the walls, peeling paint/patches, rust on the dispenser and the pole. 64–256 px, **painted into the texture or vertex colour**, still crisp with nearest filtering.
3. **The sign must visibly hang on two chains** from a bracket/beam (it currently looks fixed flat to the wall). Hand-painted Cyrillic sign text («ХООЛНЫ ГАЗАР» or «ЦАЙНЫ ГАЗАР»; label it an artistic choice), slightly crooked.
4. **The forecourt dispenser** is a clean box. Make it a Soviet-style pump: an old, rounded top, a dial face, a hose hanging on a hook, rust and dents. Make the exposed electrical fitting clearly readable (a junction box with a loose cable next to it).
5. **Light:** add a warm bulb over the front door (with a cone of light on the snow), warm light spilling from the windows onto the snow, a cold weak moon fill, and a dark sky. The exterior must be readable but dark: the café is the warm island in a black, cold steppe.
6. **Interior:** the walls are bare. Add a stove (a metal or brick pechka) with its pipe running to the ceiling, a hanging bare bulb, a calendar and a poster, a shelf of jars/bottles behind the counter, a thermos and bowls, coats on hooks, a curtain at the back door, a worn linoleum floor pattern, and the ledger on the counter.
7. **The rear yard** isn't established. Add a coal pile, two rusty barrels, firewood, a frozen outhouse silhouette and a fence of boards. Render a rear view that shows the yard *and* the door.
8. **The steamed windows** should glow from the inside (warm, blurred and frosted) when seen from outside.

Keep: ≤ 25k tris, ≤ 12 textures (atlas them if you need more), nearest filtering, no mipmaps, only the café scene in the GLB, and save new versions (`v007`+), never overwriting old ones.

## Process
At least 3 build → render → **look at each image** → fix rounds. Name the previews `r5-*`, `r6-*`, `r7-*`, and add a 6th view: an over-the-shoulder shot from the front door looking into the room. Update `report.md` honestly: what each round fixed, the check output, and what still looks weak.

## Rules (unchanged)
- Blender headless only via `bash .cache/e02/run_blender.sh --python <script> -- <args>` (your own lock). Run it in the foreground and wait. End scripts with `sys.stdout.flush(); import os; os._exit(0)`. Never leave Blender running. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits.
- Failures are yours to debug. **Use your full budget.**
