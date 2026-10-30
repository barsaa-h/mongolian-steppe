# Brief M01 — Real motion capture on our characters: B23 mitten shot v2 (three.js)

**Decision (user approved):** three.js is our render engine; body movement comes from **motion capture**, not hand-typed joint angles.
- The T01 test (`episodes/EP01/threejs/`) proved the speed: 0.012 s per frame on the GPU.
- Its movement read **robotic**: the arms flail like a puppet's.
- **We also still see Altan's back.** In both the Godot and three.js tests the cameras or actors face the wrong way.

## Inputs
- **Mocap:** `assets/sources/mocap-cmu/bvh/*.bvh`, 25 CMU clips; read `assets/sources/mocap-cmu/README.md` for what each one is. The licence is free, with no restrictions.
- **The three.js test to build on:** `episodes/EP01/threejs/`: `index.html`, `src/shot.js`, `src/anim.js` (its life layers are useful as additive layers on top of mocap), `render.mjs`, `analyze.py`, README. Note its fix: GLTFLoader strips dots from bone names.
- **Actors:** `artifacts/episode-1-cast/{ganaa,altan,party-guest-01,party-guest-02}/character.glb`, the 137-joint MPFB rig.
- **Room, cameras and anchors:** as in T01, with `episodes/EP01/godot/inputs/b23_cams.json` and the Blender reference stills `episodes/EP01/godot/inputs/blender_v0.1/`.

## 1. Retargeting: `episodes/EP01/threejs/src/retarget.js` + `tools/bake_mocap.mjs`
- Load the BVH with three.js `BVHLoader` (`three/addons/loaders/BVHLoader.js`).
- Map the CMU skeleton to the MPFB bone names: hips, spine chain, neck, head, clavicles, upper and lower arms, hands, legs and feet; fingers stay on our rest or relaxed pose.
- Retarget **as rotations relative to each skeleton's rest pose**, compensating for the different rest orientations (the CMU T-pose vs the MPFB A-pose). `SkeletonUtils.retargetClip` is a starting point; check it, because a naive copy produces twisted limbs.
- Scale the root translation by the hip-height ratio. **Altan is a 0.95 m 3-year-old:** scale her strides and root motion to her size.
- Resample 120 → 24 fps.
- **Bake** the reusable clips to `episodes/EP01/threejs/clips/<name>.json` (THREE.AnimationClip JSON): kneel, hand_over, take_object, converse_A, converse_B, sip, laugh, wait_normal, wait_old, walk, sit_talk.
- **Test:** `tools/retarget_check.mjs` renders a 3×4 lineup sheet `compare/retarget_lineup.png`: each baked clip at 3 times on Ganaa, with a CMU stick-figure overlay or side by side. **Look at it.** No elbows bending backwards, no candy-wrapper wrists, no knees through the floor, feet planted when they should be.

## 2. B23 mitten shot v2 (8 s, 24 fps)
Build it from mocap **layered and blended**: lower body from one clip, upper body from another, with crossfades of 0.3–0.6 s plus additive life layers.
- **Ganaa:**
  - kneeling or crouching at child height (lower body from 22_03/23_03, the kneeling comforter);
  - his right arm and hand offer the red mitten (the arm from 22_13/23_13, the soda pass, adjusted so the hand reaches Altan's hand height);
  - his **left arm stays low and back, close to his body**, sleeve down. It's an override on the left arm chain: a still, slightly guarded arm, not a T-pose.
  - At 6–8 s, Altan reaches for his left hand, and he draws it back and away: a small, clear move.
  - His head is aimed at Altan the whole time (an additive look-at).
- **Altan:**
  - stands, receives with both hands (the soda-receive side, retargeted and scaled to the child), and pulls the mitten onto her right hand (an approximate hand-to-hand motion is fine);
  - she looks up at Ganaa;
  - small toddler weight shifts.
- **Guests:**
  - guest 1 converses (18_08) toward guest 2;
  - guest 2 holds and sips a cup (137_26 or 13_09), on different phases.
- **Props:** the mitten is parented to the right hand of whoever holds it, and switches hands at the hand-over frame.

## 3. Fix the cameras and facing (blocking)
- In T01 and G01, CAM_B23_S001 shows **Altan's back**.
- Find the real cause:
  - the Blender camera looks down its local −Z, with Y up;
  - our conversion is (x, y, z) → (x, z, −y), and the rotation must be converted the same way;
  - the actors also need to face the way they do in the Blender shot file.
- Verify by rendering **CAM_B23_S001 at t=4 s side by side with `inputs/blender_v0.1/still_B23_S001.png`**: the composition must match, with Altan's face visible on the left and Ganaa on the right, as in Blender.
- Then render S004 as well.

## 4. Render and evidence
- Run your build and checks with SwiftShader if Chromium starts in your sandbox. T01 found it doesn't (`sandbox_host_linux ... Operation not permitted`). **Don't stop because of that:** finish everything and leave `render.mjs --gpu` ready. **The manager runs the GPU render.**
- `render.mjs` must also write:
  - `compare/B23_v2_motion_strip.png`: 8 frames, one per second;
  - `compare/compare_B23_v2.png`: Blender v0.1 | T01 | v2 for S001 and S004;
  - the MP4 `compare/B23_S001_v2.mp4` at 1920×1080.
  - Make frame capture faster than T01's 0.8 s/frame: read the canvas with `toDataURL` or `readPixels` in batches, or stream PNGs; that's optional.
- Keep `analyze.py`. Replace the adjacent-frame motion metric with a **joint-motion metric** (the mean world-space movement of the hand and head joints per second, logged from the page), which measures motion better than pixels.

## Allowed paths
- `episodes/EP01/threejs/**`.
- Read-only: everything else. Don't edit actors, mocap sources or `package.json`.

## Report
- The retarget approach and bone map.
- The clips baked.
- Each lineup problem found and fixed.
- The camera-facing root cause.
- The joint-motion numbers.
- The exact GPU command.
- Honest weak spots.
