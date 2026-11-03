# CS02 round 3 (DeepSeek): hands that read as real hands

You are continuing work another worker started in this worktree (`~/ms-workers/CS02`). **Keep what works:** the 30-bone finger rig (`thumb/index/middle/ring/pinky.01–.03.L/.R`, local +X curls toward the palm, +Z spreads), `assets/cast/hand-poses.json`, about 430 tris per hand, and `npm test` passing (24/24). Read `artifacts/stylized-cast-qa/cs02/report.md` and look at `artifacts/stylized-cast-qa/cs02/ganaa-r3-sheet.jpg` first. You can view images: **open every render you make and judge it critically before moving on.**

The user's words: the hands "look so bad, not even like a real hand". The look is PS2 / Silent Hill 2 low-poly: simple, but the silhouette must be a believable hand.

## What is wrong now (manager review of the r3 sheet)
1. **The palm is a flat hexagonal box** with hard edges and a sharp step to the fingers. Make it a rounded slab: about as wide as it is long (adult male: ~8.5 cm wide, ~9.5 cm long, ~2.5–3 cm thick at the heel, ~2 cm at the knuckles). Give it a slightly domed back, a slight cup inside, a **thenar pad** (a bulge at the thumb base), and a wrist that tapers smoothly into the forearm/sleeve. Use smooth normals (auto-smooth ~40°), not faceted flat shading.
2. **The thumb is a long, thin, curved spike** (very visible in the `*-thumb.png` side views). The thumb must be **short and thick**: base as thick as the index finger, ~6 cm total visible length for an adult man, 2 phalanges plus a metacarpal that is *inside the palm mass*, leaving the palm from the side, low, near the wrist. In `relaxed`, it lies near the index finger at ~30°, slightly in front of the palm, with its tip near the index finger's middle joint.
3. **The fingers end in sharp points.** Fingertips must be blunt and rounded (a cap of 1–2 rings, not a cone). Fingers are nearly the same thickness along their length (taper ≤ 20%). Lengths: middle ~8 cm > ring ≈ index > pinky ~6 cm, and the knuckle line is an arc (the middle knuckle is furthest out).
4. **`fist` is a grooved block.** In a fist, the fingers curl fully (~90° at each of the three joints), the fingertips tuck into the palm, the knuckles form the front edge, and the thumb lies across the middle phalanges of the index/middle fingers. Check it from the back, palm and thumb side.
5. **`spread`:** keep the fan (~10–15° between neighbours), with the thumb out ~50°. Mirror correctly on the left hand.
6. **`idle`** (`ganaa-r3-idle.png`): the arms hang straight like a mannequin, and the **left hand shows a white blob**. Find the cause (a stray prop, a mesh with no material, the old hand not removed, or bad weights) and fix it. Idle pose: arms 10–15° away from the body, elbows bent ~10°, palms facing the thighs, fingers in `relaxed`, shoulders down.
7. **Skin shading:** no stripes. Use one soft darker crease line at each joint on the palm side, a slightly lighter knuckle on the back, and nails as a subtle lighter patch on the back of each fingertip. Use the roster `skin` colour. It must read with `Closest` filtering.
8. **The child (`altan`, 3 years old):** shorter, chubbier fingers (length ×0.75, thickness ×1.1 relative to the scaled adult), a puffier palm.

## Approach (suggested)
Build one well-shaped **reference hand** procedurally in a function (e.g. `build_hand(side, scale, child=False)`), check it alone in close-up renders until it looks right, and only then fit it to the actors. Iterate: build → render → look → fix. Expect 5–10 iterations; that is the job.

## Deliverables
Rebuild **ganaa, tsetsegmaa, altan, dulmaa**. In `artifacts/stylized-cast-qa/cs02/`, produce:
- `<id>-r4-sheet.jpg` per actor: both hands × `relaxed`, `fist`, `grip`, `spread`, `pinch`, `point`, each from the back, the palm and the thumb side. Use a neutral key + fill on plain grey.
- `<id>-r4-idle.png`: the full body, front and 3/4.
- An updated `report.md`: what changed, tris per hand, the bone convention, and **what still looks wrong**, honestly.

## Rules
- Blender headless only: `bash .cache/cs02/run_blender.sh --python <script> -- <args>` (this already adds `-b`). It takes the shared lock; if it prints `WAITING_FOR_BLENDER_LOCK`, another job is running, so wait. End your own Blender scripts with `import os; os._exit(0)`, and flush print output first (`sys.stdout.flush()`). **Never leave a Blender process running.**
- Write only `scripts/build-cast.py` (your hand/rig/idle functions and their one-line call hooks), `assets/cast/hand-poses.json`, `assets/cast/*.glb|*.blend` for the four actors, and `artifacts/stylized-cast-qa/cs02/**`. **Don't touch** `recolor_texture`, `reshape_face`, `face_details`, `hairstyle` or the `altan` block in `load_actor`: the manager is rewriting them in another branch, and your work must merge cleanly.
- `npm test` must still pass.
- **Failures are yours to debug, not reasons to stop.** Stop only if Blender cannot start at all. Use your full budget, and look at every image you render.
