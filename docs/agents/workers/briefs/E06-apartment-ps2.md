# E06 (Codex): Ganaa's apartment as a PS2 / Silent Hill 2 set (birthday night)

**Worker:** Codex. Read `AGENTS.md`, `docs/agents/03-environments.md` (the apartment row and task E01, which is done: topology, the door and the bench brace), `docs/agents/05-look-lighting.md`, `assets/maps/episode-1/README.md`, and **`artifacts/character-master/sources/story/v4.2-pack/ENDING_B_EP02_APARTMENT_BLOCKING_v4.2.md`** (the locked physical rules), all read-only. Existing builders: `assets/maps/episode-1/build_apartment_door.py` and `build_birthday_dressing.py`; the scene `EP01_Apartment` in `EP01-Map.blend`.

## Goal
Turn the existing apartment (after the E01 door work and birthday dressing) into a shootable **PS2-era set**: a small 1998 Soviet-built apartment in a Mongolian town on a cold November night, crowded with 12–18 birthday guests. Make it low-poly, with 64–256 px pixel textures and painted grime (nearest filtering, no mipmaps), using Silent Hill 2 *techniques* only (darkness, motivated practical light, a claustrophobic corridor).

## Story facts (never change)
- The topology is exactly as in the blocking spec: living room, then a short corridor, then the front door, then the landing. The bedroom and the kitchen door open off the corridor. The kitchen is not an exit.
- The **kitchen door opens inward into the kitchen**, has a handle and **no lock**, can be braced from inside, and is pushed from the hall. It must not swing into the evacuation path.
- The bedroom is within earshot of the birthday table. The stair exit works but is crowded.
- Keep every existing E01 check (`check_map.py` and the door checks) passing.

## Dress it (keep the existing layout and marks)
- **Living room:** a long birthday table for 12–18 (mismatched chairs and stools, a cloth, mismatched bowls, a cake, a saucepan, salads, bottles, a paper crown); a wall carpet (a Mongolian/Soviet patterned rug on the wall); a sideboard with glass doors and dishes; a CRT TV on a stand; a sofa pushed back; homemade paper decorations and a hand-written birthday sign; curtains; a ceiling lamp with a fabric shade.
- **Corridor:** a shoe rack overflowing with boots, a coat pile on hooks, a small mirror, the low bench (it already exists), a bare bulb, an electricity meter box, and peeling wallpaper.
- **Kitchen:** a gas stove with pots, a kettle, a small table, a sink with dishes, a calendar, a window with frost, and a cold, dim fluorescent or bulb light.
- **Bedroom:** a bed with a blanket, a wardrobe, a child's toys (Altan is 3), a window.
- **Landing:** a concrete stair, a scratched door with padding, a dim bulb.
- Also: light marks (`LIGHT.*` empties) for every practical light, plus actor/camera `ANCHOR.*` marks kept from E01.
- **Budget:** the whole apartment ≤ 30k tris, ≤ 14 textures (use atlases).

## Deliverables
- A new builder `assets/maps/episode-1/build_apartment_ps2.py`, run after the existing ones. Save **new versions** `assets/maps/episode-1/EP01-Map_apt_v001.blend` (then `v002`…). Never overwrite `EP01-Map.blend` or any version.
- Export `assets/maps/episode-1/glb/EP01_Apartment_ps2.glb` (the apartment scene only, no characters, nearest filtering, no mipmaps).
- `check_apartment_ps2.py`: the E01 door and topology checks still pass, the budgets hold, and the table seats ≥ 12.
- In `assets/maps/episode-1/previews/apartment-ps2/`, stills ≤ 960×540 (Eevee, warm party light in the living room, a cold corridor, a dark kitchen): living room wide, the table close, corridor toward the front door, the kitchen door from the hall, the kitchen from inside looking at the door, the bedroom, and the landing. Keep each round's images (`r1-*`, `r2-*`, …). Open and judge every one.
- `previews/apartment-ps2/report.md`: check output, budgets, what each round fixed, and what still looks weak.

## Process
At least 3 build → render → look → fix rounds. It must feel lived-in, poor, warm and crowded at the table, and cold and threatening in the corridor and kitchen.

## Rules
- Blender headless only via `bash .cache/e06/run_blender.sh --python <script> -- <args>` (your own lock; a safe runner always exits Blender, even on errors). Run it in the foreground and wait. Never use the Blender MCP.
- Write only under `assets/maps/episode-1/`. No commits.
- **Failures are yours to debug, not reasons to stop. Use your full budget.**
