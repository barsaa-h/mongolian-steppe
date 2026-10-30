# Brief T01 — three.js test: the B23 mitten shot with REAL MOVEMENT

**Why:** the user watched the Godot test (`episodes/EP01/godot/compare/B23_S001_godot.mp4`) and said **"when I play the video it's just a picture."**
- The measured mean frame difference is ~1.5/255: the people barely move.
- The real cause isn't the engine. Our actors have no motion: their glTF has only `Deformation_Check` and `Talk_Check` clips, and the Godot test keyed tiny bone rotations.
- The user wants to try **three.js** (`three@0.186.1` is already in `package.json`). This test must prove **both**: three.js render speed and quality, **and believable body movement**.

## Inputs
- Room `assets/maps/episode-1/glb/apartment.glb`.
- Actors `artifacts/episode-1-cast/{ganaa,altan,party-guest-01,party-guest-02}/character.glb`: the 137-joint MakeHuman/MPFB rig, with the same skeleton for everyone.
- Cameras and anchors: `episodes/EP01/godot/inputs/b23_cams.json` (Blender Z-up → glTF Y-up: (x, y, z) → (x, z, −y)).
- **Learn from the Godot test's mistakes** (read `episodes/EP01/godot/compare/RESULTS.md`, its scene and scripts):
  - the cameras looked at Altan's back instead of her face (an axis or facing error);
  - Ganaa's green jacket turned black (material import);
  - there was a blue hole in the ceiling;
  - the 1080p output came out at 960×540.
  - Check the facing of every actor and camera against the Blender reference stills in `episodes/EP01/godot/inputs/blender_v0.1/`.
- The Godot dressing (cake, candles, balloons, mittens) can be rebuilt as simple three.js meshes.

## Movement (the main point)
Write a small keyframe-animation layer: `episodes/EP01/threejs/src/anim.js`.
- Named poses as per-bone quaternion offsets from the rest pose, blended over time with ease-in/out.
- Plus **always-on life layers** for everyone:
  - breathing (chest/spine, 3–4 s period);
  - weight shift (hips sway, a different period per actor);
  - head look-at toward a target (Altan, Ganaa, or each other);
  - blinks if the shape keys exist;
  - small random hand drift.
  - Each actor gets a different seed and phase.

**The 8 s B23 action:**
1. **0–2 s:** Ganaa, already crouched at child height in front of Altan, lifts his **right** hand holding a red mitten toward her. His **left** arm stays tucked low and back, sleeve down (bitten wrist).
2. **2–4 s:** Altan steps half a step closer, reaches with both hands and takes the mitten; her head tilts.
3. **4–6 s:** Altan pulls the mitten onto her right hand (an approximate hand-to-hand motion is fine). Ganaa's head follows her and his shoulders soften.
4. **6–8 s:** Altan reaches for Ganaa's **left** hand. He draws it back and away, a small, clear move, and his face stays toward her.
5. **Guests:** guest 1 talks with hand gestures, turned to guest 2. Guest 2 sips from a cup (lifts it at ~3 s and ~6.5 s).

**Acceptance:** the motion must be clearly visible at playback. Report the mean absolute frame difference across the clip, which must be far above the Godot clip's ~1.5. Also report a per-second motion graph or numbers.

Watch for broken skinning: candy-wrapper wrists and shoulders punching through clothes. Keep rotations moderate, and check the clothing meshes follow the skeleton (they're skinned in the glb).

## Look
- Warm ceiling lamp (PointLight with shadows), cool blue window, fill.
- Candles: emissive, plus a small light.
- ACES or AgX tone mapping, SSAO if cheap (`three/addons` postprocessing), a subtle film grain and vignette.
- **Our target is the PS2-era horror look, warm inside.** No grain noise from sampling.

## Render
- `episodes/EP01/threejs/render.mjs`: Playwright (see `artifacts/episode-1-cast/scripts/check_browser.mjs` for how this repo launches Chromium) loads the page.
- **Deterministic time:** the page exposes `renderFrame(i)`, which sets t = i/24, poses everything, and renders. The script captures 192 frames at **1920×1080** (and a 960×540 pass) to `out/`, then encodes with ffmpeg to `compare/B23_S001_three.mp4`.
- Time everything. Write `compare/timings.txt`.
- **GPU:** your sandbox likely only has SwiftShader (CPU). That's fine for building and checking. Make `render.mjs` take `--gpu` (launch args for real GPU: `--use-angle=vulkan` or `--use-gl=egl`, headless=new); **the manager runs the GPU timing pass**. Record your SwiftShader timings too.
- Stills: `compare/B23_S001_three.png` and `compare/B23_S004_three.png` (frame 96).
- `compare/compare_B23_three.png`: Blender v0.1 | Godot | three.js for S001 and S004, labelled with the time per frame.
- `compare/motion_strip.png`: 8 frames, one per second, of S001, to prove movement.

**Look at your own frames and the motion strip before reporting.** Altan's face must be visible (we look at her face, not her back), the mitten must be visible, and the left wrist must stay away from her.

## Allowed paths
`episodes/EP01/threejs/**` only (with `.gitignore` for `out/`). Don't edit actors, the map, the Godot test or `package.json` (import three from the root `node_modules`).

## Report
- The timings table (SwiftShader).
- The motion metric.
- What broke on import and how you fixed it.
- The exact GPU command for the manager.
- An honest quality verdict, and which engine you'd pick and why.
