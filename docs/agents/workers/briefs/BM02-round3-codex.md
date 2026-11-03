# BM02 round 3 (Codex): continue Grok's PS2 exporter in this worktree

Grok ran out of credit partway through. **Keep its work** (`scripts/ps2_export.py`, `scripts/ps2_check.mjs`, `assets/cast/ps2/*`, `qa/bm02/*`) and continue. **Don't start over.**

## How to run Blender here
- `bash .cache/bm02/run_blender.sh <blender args>`. It keeps Blender's user folder inside this worktree (MPFB logs there), waits on the shared lock, and adds `timeout 900` and `-noaudio`.
- End every Blender script with `import os; os._exit(0)` after saving, so Blender cannot hang on exit and keep the lock. **Never leave a Blender process running.** If you interrupt one, make sure it's gone.
- `EGL_BAD_MATCH` is a harmless warning.
- Builds/caches go in `.cache/bm02/`. Never use `~/.config`, `~/.cache` or `/tmp`.

## How to work
This is a long job; use your full budget. **Failures are yours to debug, not reasons to stop.** Stop only if Blender cannot start at all. Look at every image you render before calling something fixed. Write `report.md` before you run out.

## Manager review of your current panels
1. **`*-vs-source.png`: the PS2 actor is nearly invisible.** It's translucent, the head and face are missing, and it's brown all over. Check that the materials are opaque (`alphaMode OPAQUE` except the hair cards with `MASK`, no `BLEND`), that the atlas is actually bound, and that the head isn't culled or dropped by decimation.
2. **Hands are spiky claws** (`ganaa-hands.png`). The fingers are single sharp wedges. Protect the hand during decimation: keep ≥ ~400 tris per hand, with a 4–6-sided cross-section per finger segment, rounded fingertips, and a palm with thickness. Compare relaxed/fist/spread/pinch against the source hand: it must read as a human hand at 1080p in a close-up. This was the user's #1 complaint about the old cast.
3. **Hair is a translucent helmet** with bright stray strand lines across the forehead. Hair must be opaque, dark (`#0d0b0a`–`#1a1512`), and follow the skull with a real hairline. Use cards with alpha-*test* (MASK, cutoff ~0.5) and no visible card edges or strands floating off the skin.
4. **Faces are smeared and blurry,** with lids that read as cuts. Give the face more of the atlas (≥ 25% of the 1024 atlas for head + face) and keep the eye/lid/lip loops during decimation.
5. **The QA background** (a brown diagonal pattern) hides the silhouette. Render QA on a plain neutral mid-grey background with a soft key + fill, and add one panel in the SH2 look (`episodes/EP01/threejs/src/look.js`, fog, dark) for the real test.
6. **Mouths:** confirm there is exactly one mouth in `speak` (no painted mouth under the modelled one).

Then finish Dulmaa (her `dulmaa-hands.png` is 0 bytes), and write `report.md` (triangle counts per part, atlas layout, morph mapping, what's still wrong).

Note: the bases are being rebuilt in parallel (BM01). These four actors are only test inputs; don't tune the exporter to their specific faces.

**Budget your turns:** fix 1–3 first. Write `report.md` before you run out.

---
# Original brief
# Brief BM02: PS2 export: turn any built DNA actor into a low-poly, painted, animation-ready GLB

**Worker:** Grok. **Priority:** #1, in parallel with Codex BM01 (base models).

## Why
EP01 is rendered in three.js with a **Silent Hill 2 / PS2-era look**: dark practical light, fog, grain, a muted grade (see `episodes/EP01/threejs/src/look.js`, `panels.js` and the stills in `episodes/EP01/threejs/compare/panels/`).

The user found the realistic MPFB characters too realistic and too much work. A downloaded low-poly PSX man looked right in style, but wasn't Mongolian and had paddle hands, stuck-on eyes, two mouths and helmet hair.

We keep the **DNA/MPFB system** as the source of identity and anatomy (Codex is improving the bases in BM01). **You build the conversion stage** that outputs the PS2 version of any actor. It must be automatic, so every character in the season can go through it.

## Input / output
- **Input:** a built actor folder, `artifacts/episode-1-cast/<id>/` (`Character-Master.blend`, `character.glb`, `dna.json`). Develop on `ganaa`, `tsetsegmaa`, `altan` and `dulmaa`.
- **Output:** `assets/cast/ps2/<id>.glb` + `assets/cast/ps2/<id>.json` (report), built by
  `blender -b --python artifacts/character-master/scripts/ps2_export.py -- <id> [--build-dir DIR]`.

## Requirements
1. **Geometry:**
   - Adults ≈ 6–9k tris, children ≈ 5–7k.
   - **Protect the face and hands:** keep eye, lid, mouth and nose loops, and keep each finger as its own geometry. Decimate the body, legs and clothes hardest.
   - Merge the clothing layers into the body where they're hidden. No interpenetration at rest or in the test poses.
   - Silhouettes stay clean: no faceting on cheeks or shoulders that reads as broken. Use smooth normals with a few hard edges where useful.
2. **Textures:** one ≤ 1024² atlas per actor, baked from the full build (skin, clothes, eyes).
   - **The PS2 painted pass:** bake the AO and the lighting-independent cavity into the albedo, slightly simplify the colour, sharpen the features (lid line, brows, lip line), and keep the eyes dark and readable.
   - **No photo-noise skin.** Faces must read at 540p.
   - Linear filtering (the PS2 look, not PSX), plus mipmaps.
3. **Hair:** convert the MPFB hair into **low-poly hair cards/shells with an alpha strand texture**. Requirements:
   - a soft hairline painted onto the scalp in the atlas;
   - no helmet edge;
   - no floating shell;
   - alpha-test or alpha-hash that renders correctly in three.js.
4. **Rig:** reduce the 137 bones to the **animation contract** that the three.js performance system (`episodes/EP01/threejs/src/stylized/rig.js`, from job SA01) already expects:
```
pelvis spine chest neck head jaw eye.L eye.R
shoulder_left upper_arm_left forearm_left hand_left        (and _right)
thumb.01-03.L index.01-03.L middle.01-03.L ring.01-03.L pinky.01-03.L   (and .R)
thigh_left shin.L foot_left toe.L                           (and _right / .R)
finger bones: local +X = curl toward palm, local +Z = spread
```
   - Transfer the weights from the merged MPFB bones (e.g. spine01–05 → spine/chest) and smooth them.
   - Check that elbows, knees, wrists, finger curl and jaw open deform acceptably.
5. **Face:**
   - morph targets `blink speak smile frown fear hunger resolve gaze`, mapped from the actor's MPFB expressions/visemes (`EXP.*`);
   - jaw open on the `jaw` bone;
   - eyes rotate on `eye.L/R` with the lids following through blink.
   - One mouth only.
6. **Clips:** include `idle` (a relaxed standing pose, arms down, never A-pose) and `walk`, retargeted from `episodes/EP01/threejs/clips/` (CMU) or authored. The SA01 system handles everything else at runtime.
7. **The GLB loads in three.js** with GLTFLoader (skinned mesh, morphs, clips, embedded textures). `npm test` must still pass.

## Checks (`artifacts/character-master/scripts/ps2_check.py` or `.mjs`)
- tri count within budget;
- every contract bone present;
- every listed morph present, and neutral recovers;
- the atlas is ≤ 1024²;
- no vertex weighted to a deleted bone;
- the finger-curl test pose has no inverted faces at the knuckles.

## Rules
- Blender headless only, through the **new lock**:
  `timeout 900 flock -w 600 /home/barsaa/ms-workers/.blender-v2.lock blender -b --factory-startup --python-exit-code 1 --python ...`. Never use the Blender MCP; the user's open Blender belongs to another session.
- Builds go in `~/.cache/khaniad-builds/<id>-ps2` (never `/tmp`).
- Write only: `artifacts/character-master/scripts/ps2_export.py`, `ps2_check.*`, `assets/cast/ps2/**`, `artifacts/character-master/qa/bm02/**`. Don't edit DNA, bases, `build_character.py`, the published cast or `episodes/`; BM01 (Codex) owns those. No commits.

## Evidence (`artifacts/character-master/qa/bm02/`)
- For each test actor, rendered with Eevee in dark warm practical light with fog, close to the episode look:
  - `<id>-face.png` (neutral + speak + smile + blink);
  - `<id>-hands.png` (relaxed, fist, open, pinch);
  - `<id>-body.png` (idle front + 3/4);
  - `<id>-vs-source.png` (MPFB source beside the PS2 version).
- `report.md`: tri counts, atlas sizes, the bone map, and **what still looks wrong**.
