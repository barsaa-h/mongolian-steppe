# E10 (Codex): the night livestock road + the hospital gate, PS2 / Silent Hill 2 style

You build **two small new sets** in this worktree (`~/ms-workers/E10`). Read `AGENTS.md`, `docs/agents/03-environments.md` (the rows "Livestock truck road + sheep" and "Hospital gate / sign", task E03, Rules), `docs/agents/04-props-vehicles.md` (the livestock truck), `docs/agents/05-look-lighting.md`, and the beat sheet `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` (beats 19, 20), all read-only. For technique and look, study the finished sibling set `/home/barsaa/ms-workers/E07/assets/maps/episode-1/build_freightyard_ps2.py` and its previews `/home/barsaa/ms-workers/E07/assets/maps/episode-1/previews/freightyard-ps2/r12-contact.jpg` (read-only; copy techniques, not files).

## Story (never change)
- **Beat 19, night, the approach to Naran:**
  - Ganaa rides as the passenger in a **livestock truck** (a cab for two plus a slatted sheep cargo bed and a radio).
  - **Sheep block the road**, with a streetlamp junction at the town edge; he stares at one animal's throat.
  - He sees **his face in the side glass**: the passenger window must reflect, so give it a reflective glass material plus `ANCHOR.reflection_cam`.
- **Beat 20, in town, on foot:**
  - the medical lane with a **hand-painted hospital arrow sign**;
  - the **hospital gate** with a queue of tired families;
  - **a guard/orderly's post** where people are asked about injuries.
  - Ganaa walks toward it, stops and turns home. **No pharmacy scene** (cut from the map notes).
- **Place:** Naran outskirts, November 1998. **No traffic lights anywhere.**

## Build (two scenes)
1. **`EP01_LivestockRoad`:**
   - a 120 m stretch of night steppe road (cracked asphalt and gravel shoulder), a snow-dusted steppe, low hills as silhouettes, telegraph poles;
   - a **single streetlamp junction** at the town edge with a bus-stop sign;
   - a **flock of 25–40 low-poly sheep** (instanced, 3 pose variants, `ANCHOR.sheep_throat` on one), plus `ANCHOR.herder`;
   - the **livestock truck**: a GAZ-53 style rounded cab plus a slatted wooden cargo bed with sheep inside, a cab interior for two (bench, dash, radio, the reflective passenger window), headlights with `LIGHT.headlight_*`. Make it a separate object set with `ANCHOR.driver`, `ANCHOR.passenger_ganaa`, `ANCHOR.radio`.
2. **`EP01_HospitalGate`:**
   - a short medical lane: a concrete fence with a metal gate, a small gatehouse/guard post with a lit window and a chair;
   - the **hand-painted arrow sign** «ЭМНЭЛЭГ →» (artistic choice);
   - a single-storey hospital building with a few lit windows, a porch and a lamp;
   - a bench, trodden snow, a bare tree, power poles;
   - queue marks `ANCHOR.queue_01…08` (families, some sitting), `ANCHOR.guard`, `ANCHOR.ganaa_stop` (where he stops) and `ANCHOR.ganaa_turn` (toward home);
   - `LIGHT.*` for every practical.
- **Budget:** each scene ≤ 25k tris, ≤ 12 textures (atlas), 64–256 px pixel textures with painted grime, nearest filtering, no mipmaps.

## Deliverables
- `assets/maps/episode-1/build_road_hospital_ps2.py`: build both scenes, saved as new versions `assets/maps/episode-1/EP01-Map_road_v001.blend` (then `v002`…). Never overwrite `EP01-Map.blend` or a version.
- `glb/EP01_LivestockRoad_ps2.glb` and `glb/EP01_HospitalGate_ps2.glb`: one scene each.
- `check_road_hospital_ps2.py`: budgets, sheep count, the truck is separate with both seat anchors, the passenger glass is reflective, the gate opens, queue anchors don't overlap, **no traffic lights**, and the existing `check_map.py` still passes.
- In `previews/road-hospital-ps2/`, stills at 960×540 (Eevee, night, fog):
  - the road wide with the truck's headlights on the flock;
  - from the cab passenger seat through the windshield at the sheep;
  - the passenger window reflection;
  - the streetlamp junction;
  - the hospital lane with the arrow sign;
  - the gate and queue;
  - Ganaa's stop mark looking at the queue.

  Keep each round (`r1-*`, `r2-*`, …). Open and judge every image.
- `previews/road-hospital-ps2/report.md`: check output, budgets, what each round fixed, and what still looks weak.

## Process
At least 3 build → render → look → fix rounds.

## Rules
- Blender headless only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` (it adds `-b`, your own lock, and a safe runner that always exits Blender). Run it in the foreground and wait. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits.
- **Failures are yours to debug, not reasons to stop. Use your full budget.**
