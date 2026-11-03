# RESUME

Your previous run of this job was killed by a session restart at about 21:54 before you could report. **Inspect what you already built in this worktree first** (files, latest versions, logs under `.cache/`, previews), keep it, continue numbering from where you stopped, and finish the job. Only view PNG/JPEG images. The full brief follows.

# E06 round 3 (DeepSeek): the apartment, ready for the birthday and the door finale

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E06`, continuing the apartment set another worker built (`assets/maps/episode-1/build_apartment_ps2.py`, `build_apartment_second_pass.py`, `check_apartment_ps2.py`, latest `EP01-Map_apt_v010.blend`, previews `assets/maps/episode-1/previews/apartment-ps2/`, GLB `glb/EP01_Apartment_ps2.glb`). Read them first; continue numbering (v011+, new round prefix). The Blender wrapper is in `.cache/` (use the `run_blender.sh` there).

## Why
The apartment carries the most screen time: B05, B10 (late morning/afternoon), B21–B26 (the birthday evening and the kitchen-door ending). Story (law): `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md` (beats 05, 10, 21–26) and the v4.2 script. **Facts:** the kitchen door opens **inward** (into the kitchen) and has **no lock**; the infected **push/slam** doors (no handles); a visiting cousin's **infant sleeps in the bedroom** (audible from the birthday table); ~40 visitors over the evening, **12–18 visible late guests**, using the adjacent **stair landing** and kitchen; the entry/stair escape must be genuinely usable but crowded; handmade, slightly uneven birthday decorations; mismatched bowls.

## Do
1. **Bedroom** is too dark to read: a dim bedside lamp + window light, the infant's cot/bundle spot (`ANCHOR.infant_cot`), coats piled on the bed (Dulmaa manages coats).
2. **Kitchen door** hero: verify swing direction (inward into the kitchen), no lock/latch hardware, a worn handle, a gap at the bottom, paint wear at push height; `ANCHOR.kitchen_door_push` on the hall side, `ANCHOR.kitchen_inside`; the door is a separate object with its hinge pivot (so the player can animate the push).
3. **Party population anchors:** 18 `ANCHOR.guest_##` marks (standing, sitting at the table, leaning in the doorway, on the stair landing, two in the kitchen), plus `ANCHOR.altan_table`, `ANCHOR.altan_door_watch` (she checks the hallway when footsteps come up), `ANCHOR.ganaa_kneel` (gives the mittens), `ANCHOR.tsetsegmaa_*`, `ANCHOR.dulmaa_kitchen`, `ANCHOR.sukhee_handle` (opens the kitchen door handle in B26).
4. **Stair landing**: make sure it exists and is dressed (shoes, coats on hooks, a neighbour's door, a dim bulb, cold), reachable from the entry.
5. **Day state** (B05/B10): curtains open, window light, decorations half-finished (B10 prep), table not yet set; **night state** (B21–B26): full party dressing. Two collections or a `STATE.day` / `STATE.night` switch in the GLB (document it), both exported.
6. **Cameras** `CAM.*` for: the birthday table wide, Altan at the table, the hallway toward the entry, the kitchen door from the hall, the kitchen door from inside the kitchen, the landing, the bedroom.
7. Run the existing checks, extend them (door swings inward, no lock objects, anchors present, both states), render each camera in both states (960×540), a contact sheet per state, and look at every image. At least 3 render → look → fix rounds. Re-export the GLB (with lights, cameras and empties exported: `export_lights=True`, cameras on, empties kept).

## Rules
- Blender only via the wrapper in `.cache/` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules. View only PNG/JPEG images.
- Write only `assets/maps/episode-1/` apartment files (builders, new blend versions, the apartment GLB, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- Final `## Report:` with files, commands + check output, evidence (both contact sheets), what still looks wrong.
