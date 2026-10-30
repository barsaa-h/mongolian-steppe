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
