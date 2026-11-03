# E12 (DeepSeek): border checkpoint and truck queue, PS2 set

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E10` (you built the road + hospital here; reuse that approach and your fixed 5×7 Cyrillic font from `build_road_hospital_ps2.py`). **Don't change the road/hospital files.** Make new ones: `build_border_ps2.py`, `check_border_ps2.py`, `render_border_ps2.py`, `EP01-Map_border_v001.blend`…, `glb/EP01_Border_ps2.glb`, `previews/border-ps2/`.

## Story (beat 08, 0:50, "Border / Lost time")
EXT. BORDER CHECKPOINT AND LONG ROAD — DAY, HOURS PASS. Russia → Mongolia road checkpoint (Kyakhta–Altanbulag type), winter 1998. Ganaa (KAMAZ driver) waits in a slow truck queue. Paperwork passes across a counter window; a tired Russian official asks «Накладная где?»; Ganaa finds the paper in the wrong pocket; a stamp goes missing. Trucks inch along. Late low sun replaces morning glare (the set must work in **two lights: morning glare and late golden-hour sun**). Inside the cab he re-wraps a pair of mittens; a satchel slips behind his seat.

## What to build (Silent Hill 2-style techniques only; never its assets)
- A two-lane road through a checkpoint: a striped **barrier arm** (red/white, pivoted as a separate object), a small **customs booth/hut** with a sliding service window and a counter shelf outside (paper is passed here), a concrete **inspection canopy** over one lane, a low brick/concrete admin building with a few windows, chain-link and concrete-post fences, a watchtower or flagpoles (no national flags in detail: plain faded cloth), lamp posts, a weigh-bridge plate on the road.
- Signs (Russian, correct, checked glyph by glyph): «ТАМОЖНЯ», «СТОП», «КОНТРОЛЬ». Mongolian side far away can show «ГААЛЬ» faintly. **No traffic lights** (story fact, the hut has no signal lights either).
- **A queue of 4–6 trucks** (simple low-poly 1990s Soviet trucks, cargo trucks with tarps, one fuel tanker; ≤ 1200 tris each, varied colours, dirt, snow on roofs) and space for Ganaa's KAMAZ (`ANCHOR.kamaz_queue`, the manager places the KAMAZ GLB there; leave a 9 × 3 m gap). Snow-covered steppe and low hills behind, telegraph poles, ruts and slush.
- Inside the booth window: a desk, papers, a stamp pad, a kettle, a calendar «1998», a small heater glow.
- Anchors: `ANCHOR.kamaz_queue`, `ANCHOR.kamaz_window` (driver window height ~2.4 m), `ANCHOR.official_window`, `ANCHOR.barrier`, `CAM.*` for the shots.
- Budget: ≤ 35000 triangles, ≤ 14 textures (≤ 512², nearest filter), clean GLB (1 scene, no preview-only nodes).

## Shots (960×540 Eevee previews in both lights where marked)
1. wide: the queue toward the barrier (morning + late sun);
2. Ganaa's POV from the cab window height at `ANCHOR.kamaz_window` toward the booth window (the official's hands/papers zone visible);
3. the booth window close: the counter shelf, papers, the stamp pad;
4. the barrier arm and the sign (late sun);
5. a long-lens shot down the queue, trucks compressed, heat haze/exhaust;
6. the sign text close-up for the glyph check.

## Checks (`check_border_ps2.py`)
Budgets, anchors/cams, the KAMAZ gap is clear (9 × 3 m), the barrier arm is a separate object with its pivot at the post, no traffic-light names or three-lamp signal clusters, the GLB parses.

## Rules
- Blender only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only the new border files listed above. No commits. Don't touch `EP01-Map.blend`, the road/hospital files or `AGENTS.md`.
- At least 4 render → look → fix rounds; look at every image. Re-export the GLB from the final blend.
- Final `## Report:` with files, commands + check output, evidence (contact sheet + sign close-up), and what still looks wrong.
