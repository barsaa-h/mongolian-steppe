# E02 round 5 (Codex): café detail pass

Continue in this worktree from `EP01-Map_v012.blend` and `assets/maps/episode-1/build_cafe_r5.py`. Keep all checks passing (`check_cafe_r5.py`: guard, fitting ≤ 1.5 m, 2 chains, rear path, ≤ 25k tris, ≤ 12 textures, nearest filtering, no mipmaps, café scene only). Blender only via `bash .cache/e02/run_blender.sh --python <script> -- <args>` (your own lock; a safe runner always exits Blender). Run it in the foreground and wait. Write only under `assets/maps/episode-1/`, with no commits, and never overwrite a saved version.

The manager reviewed `r8-*`. **Good:** warm windows, plank walls, the dial pump, shelves and bulb. It now reads as PS2. **Still weak, in order of importance:**
1. **The snow is a flat white plane.** Paint a dirty snow texture: grey-brown tyre ruts, footpaths trodden to the door, darker slush near the door and the pump, and lumpy drifts along the walls and the guard. Add a little low geometry noise.
2. **The sign** isn't visible in any view. Make it big and readable in the exterior and forecourt shots: hand-painted «ХООЛНЫ ГАЗАР», hanging from a beam on **two visible chains**, crooked, lit by the door bulb.
3. **The room is empty.** Add:
   - a **pechka stove** with a pipe to the ceiling, glowing (the heater from the original graybox);
   - coats and hats on wall hooks by the door;
   - a curtain on the back door;
   - a radio and a thermos on the counter;
   - a wall calendar and a faded poster;
   - bowls and a teapot on the tables;
   - a crate of bottles;
   - a broom.
   Every view should have something in the foreground.
4. **The exposed electrical fitting** by the pump must read clearly: a grey junction box on a short post with a loose, sagging black cable. It should be visible in `forecourt-road`.
5. **The rear yard:** the outhouse is good. Add the coal pile (black lumps), two rusty barrels, a wood stack and a board fence. The long white strip looks like a road marking, so turn it into a trodden snow path.
6. **Atmosphere for the stills only:** a bit of world fog/volume in the preview renders so the far edge fades to black-blue, as SH2 does.

Process: at least 3 rounds (`r9-*`, `r10-*`, `r11-*`; `v013`+). Open and judge every image, and keep each round's previews. Update `previews/cafe-ps2/report.md` honestly. Failures are yours to debug, not reasons to stop. **Use your full budget.**
