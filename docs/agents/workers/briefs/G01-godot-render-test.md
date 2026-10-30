# Brief G01 — Godot real-time render test: one birthday shot (B23 mittens)

**Why:** Blender Eevee renders our animatic at about 7–8 s per frame on this laptop (Intel Iris Xe, 14 GB RAM), even at 2–4 samples, so a 90 s scene takes hours. The user wants "best quality and instant render". We're testing whether **Godot 4** can be the staging and render engine while Blender stays the authoring tool (characters, sets, animation). This is a **decision test**: be honest about quality as well as speed.

## Tools
- Godot **4.7.2** at `/home/barsaa/.local/bin/godot`. A display exists (`DISPLAY=:0`, Wayland, `/dev/dri/renderD128`, Mesa Iris Xe, OpenGL 4.6 / Vulkan).
- **No Blender is needed, and don't run it.** Everything comes from the glTF that already exists.
- **The sandbox makes `~/.config`, `~/.local/share` and `~/.cache` read-only.** Point Godot at writable folders inside the worktree:
  - set `XDG_CONFIG_HOME`, `XDG_DATA_HOME` and `XDG_CACHE_HOME` to `episodes/EP01/godot/.godot-home/...` (git-ignore it);
  - use `--headless --import` for importing.
- **If rendering can't reach the GPU from the sandbox** (Movie Maker needs a real rendering device), try the `--rendering-driver opengl3` and `vulkan` options. If it still fails, **stop and report the exact error**. Don't fake it with software rendering without saying so; the manager will run the render command.

## Inputs
- **Room:** `assets/maps/episode-1/glb/apartment.glb`. It's an older export; the kitchen door may be missing, which is fine for B23.
- **Actors:** `artifacts/episode-1-cast/{ganaa,altan,party-guest-01,party-guest-02}/character.glb`.
  - Altan was just rebuilt (cherry dress). Check what's inside: rig, shape keys, animations.
  - Ganaa's DNA files are about 16 MB; that's fine.
- **Cameras and anchors:** `episodes/EP01/godot/inputs/b23_cams.json`, exported by the manager from the Blender shot file.
  - It has the world matrices of CAM_B23_S001…S005, the lens and sensor, and the ANCHOR.* locations.
  - **Blender is Z-up and glTF/Godot is Y-up:** convert (x, y, z) → (x, z, −y) and the camera basis to match. Godot uses vertical FOV: compute it from lens_mm and sensor_mm at 16:9.
- **Blender reference frames, same cameras:** `episodes/EP01/godot/inputs/blender_v0.1/still_B23_S001.png`, `still_B23_S004.png`.
- **Shot notes:** the B23 rows in `episodes/EP01/shotlist.csv`.
- **Story rules:**
  - Ganaa's **left** wrist is bandaged and kept away from Altan; he gives the mitten with his **right** hand.
  - Altan, 3, is in a paper crown.
  - The mood is a warm, crowded family flat at night in 1998 Mongolia, and the warmth must read.

## Build: `episodes/EP01/godot/` (a Godot project)
1. **`scenes/B23_S001.tscn`:** the apartment, Ganaa crouching at child height, Altan in front of him, two guests behind, cameras CAM_B23_S001 and S004 placed from the JSON.
   - **Posing:** if the glTF skeleton imports, pose key bones (crouch, the right arm offering, the left arm tucked back) in an `AnimationPlayer` with an 8 s clip, 2–4 keys. A simple pose is enough; the rig is the test.
   - If posing fails, keep the rest pose and report why.
2. **Simple dressing so the light test is fair:**
   - a table with a tablecloth, a cake with 3 candles (emissive flames plus a small OmniLight);
   - a few plates and cups, 6 balloons, one pair of red knitted mittens (child-size, simple meshes).
3. **Lighting for our look,** a PS2-era horror world but **warm inside:**
   - a warm ceiling lamp (OmniLight with shadows), cool dark-blue window light, a little fill;
   - ambient occlusion (SSAO), glow on the candles, a subtle film grain and vignette;
   - light volumetric fog only if it helps;
   - tonemap AgX or Filmic.
   - Try the **Forward+** renderer first. If it's too slow or fails on Iris Xe, try **Mobile**, and report both.
4. **Render with Movie Maker:** `godot --path episodes/EP01/godot --write-movie out/B23_S001.avi --fixed-fps 24 res://scenes/B23_S001.tscn`, or a PNG sequence, at **1920×1080**. Run the 8 s shot through once and quit automatically at the end (a script calls `get_tree().quit()`).
   - **Measure the wall-clock time** and the effective fps.
   - Also measure 960×540 for a direct comparison with Blender.
   - Encode to H.264 MP4 with ffmpeg (`out/` stays git-ignored except the final MP4 and PNGs below).
5. **Deliverables** in `episodes/EP01/godot/compare/`:
   - `B23_S001_godot.png` and `B23_S004_godot.png`: mid-shot frames at 1920×1080.
   - `compare_B23.png`: Blender v0.1 vs Godot side by side for both shots, labelled with the render time per frame.
   - `B23_S001_godot.mp4`, the 8 s clip.
   - `RESULTS.md`:
     - the timings table (1080p and 540p, Forward+ and Mobile);
     - what imported cleanly and what broke (materials, hair transparency, skin, shape keys and lip-sync readiness, the rig);
     - the converter steps a full pipeline would need, e.g. automatic camera and anchor export from Blender, and glTF re-export of the actors and room;
     - an honest quality verdict vs Blender, with the weak spots.

**Look at your own frames** before reporting:
- Is the room warm, not a basement?
- Do the faces read?
- Is the left wrist hidden from Altan?
- Do the mittens read?
- Are there broken materials (hair black or opaque, skin waxy, eyes white)? Fix what you can in import settings or material overrides; Godot material overrides are fine.

## Allowed paths
`episodes/EP01/godot/**` only, plus a `.gitignore` entry inside that folder. Don't touch actors, the map or other episodes files.

## Report
The standard format, plus the timings table and the image paths at the top.
