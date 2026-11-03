# E02 (Codex): Hürel's café + forecourt as a PS2 / Silent Hill 2 set

**Worker:** Codex. Read `AGENTS.md`, `docs/agents/03-environments.md` (row "Hürel's café", tasks E02/E04, Rules), `docs/agents/05-look-lighting.md`, the S05 café staging rule in `docs/agents/01-story-continuity.md`, and `assets/maps/episode-1/README.md`. Read the EP01 beat sheet/script for beats 15–18 under `artifacts/character-master/sources/story/` (read-only).

## Goal
Turn the `EP01_Cafe` graybox in `assets/maps/episode-1/EP01-Map.blend` into a shootable **PS2-era set**: low-poly, small pixel textures (64–256 px, `Closest` filtering, no mipmaps), baked or vertex-colour grime. It should look like a 1998 Mongolian roadside café at night in cold fog. Lighting and fog belong to three.js later; you author geometry, materials, light **marks** and anchors. Use Silent Hill 2 *techniques* only (darkness, motivated practical lights, fog hiding the far set), never its assets.

## Contents (story facts: don't change them)
- The interior keeps the measured 14 × 10 m shell, the counter, the heater and the ledger. Add the card table, stools, a samovar/kettle on the counter, a calendar, a stove pipe, and steamed windows (a translucent frosted material).
- **Forecourt:** the fuel dispenser, an **exposed electrical fitting right next to the dispenser** (the arc source), the **concrete guard** in front of it, the café sign hanging **on two chains**, frozen ruts, a snow edge. The KAMAZ collision line is measured from the existing KAMAZ proxy; leave a satchel-safe zone in the cab area.
- **Rear:** a rear door and a small service yard (coal pile, barrels, an outhouse silhouette).
- `ANCHOR.*` empties for each actor mark and camera position the beats need, and `LIGHT.*` empties for the practical lights (the bulb over the door, the counter lamp, the heater glow, the sign).
- Budget: the whole set ≤ 25k tris, ≤ 12 textures. Nothing is visible beyond ~40 m (fog), so don't model it.

## Deliverables
- A new script `assets/maps/episode-1/build_cafe_ps2.py` that builds this into the `EP01_Cafe` scene. **Save as a new file** `assets/maps/episode-1/EP01-Map_v002.blend`; never overwrite `EP01-Map.blend`.
- Export `assets/maps/episode-1/glb/EP01_Cafe_ps2.glb` (the active scene only, no characters).
- Extend `check_map.py` (or add `check_cafe.py`) with checks for: the guard between the collision line and the dispenser, the fitting within 1.5 m of the dispenser, the sign's two chains, the rear door being reachable, and the tri/texture budget.
- In `assets/maps/episode-1/previews/cafe-ps2/`, stills ≤ 960×540 (Eevee, dim moody preview light): the exterior wide, the forecourt from the road, the counter, the card table, the rear door. **Look at every image** and fix what looks wrong.
- `assets/maps/episode-1/previews/cafe-ps2/report.md`: what you built, the check output, and what still looks weak.

## Rules
- Blender headless only, through `bash .cache/e02/run_blender.sh --python <script> -- <args>` (it adds `-b`, `-noaudio`, `timeout 900`, and the shared lock; another worker shares the lock, so `WAITING_FOR_BLENDER_LOCK` is normal). End scripts with `sys.stdout.flush(); import os; os._exit(0)`. **Never leave a Blender process running.** Never use the Blender MCP.
- Write only under `assets/maps/episode-1/` (the new files above and the check script). No commits.
- **Failures are yours to debug, not reasons to stop.** Use your full budget. Build → render → look → fix, at least 3 rounds.
