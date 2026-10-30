# Brief CH03 — Faces that read as real Mongolian people, not aliens, plus a full expression set

**The user's words:** *"our character design, some characters look fucking alien, like Altan."* This is the project's **#2 priority**, next to movement (a Codex job is building the movement system in three.js at the same time; it reads the face morph targets you add).

Read `AGENTS.md` (Character work) and `artifacts/character-master/DNA.md` first. Blender headless only, **always through the lock**: `flock /home/barsaa/ms-workers/.blender.lock <blender> -b ...`. Build command: `blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/episode-1-cast/scripts/build_actor.py -- <id> [--dna file --output dir]`, about 50 s per actor. QA: `artifacts/character-master/scripts/qa_actor.py -- artifacts/episode-1-cast/<id>`.

## The manager's diagnosis
See `artifacts/episode-1-cast/<id>/face.png` for altan, ganaa, tsetsegmaa, dulmaa, cousin, sukhee, hurel and party-guest-01.

**Altan (3, the worst):**
- Toddler proportions are wrong.
  - A real 3-year-old has a big cranium, so the forehead is high and the head is wide at the top. The eyes sit **at or below the vertical midline** of the head.
  - The nose is short and small with a low, soft bridge. The mouth is small with full lips. The cheeks are full and round, low on the face. The chin is small and soft. The neck is short.
- Ours reads as an adult face shrunk onto a child body:
  - the eyes are slit-like and set wide;
  - a **vertical pinch or crease runs down the nose bridge**, an artifact to find and remove (check `inner_lid_fold`, the caruncle and nose-bridge values, and the child-base interaction);
  - the lips are lumpy and the skin is flat and waxy.

**Everyone:**
- **Eyes:** narrow and dark, with no catchlight and no wet shine, so they read as dead or beady. Mongolian eyes have an epicanthic fold and often a single eyelid, but they are not slits, and the iris is visible.
  - Check `eye_opening`, `upper_lid_fold`, `eye_size`, the iris scale, the eye material (cornea specular, the sclera not pure white, a slightly darker limbal ring), the lash and wet-line visibility, and the eye-socket shadow.
- **Skin:** flat mannequin skin.
  - Add subtle colour variation: warmer cheeks, nose and ears; slightly darker around the eyes; lips with real colour; roughness variation (T-zone shinier).
  - The PS2 target is fine with simple texturing, but **flat single-colour skin is what reads as "alien" or plastic**.
- **Faces:** many read wide and flat in the same way. Mongolian faces vary (broad cheekbones, long faces, round faces, angular faces). Use the DNA ranges for real variety.

## Work
1. **Measure before guessing.** Write `artifacts/character-master/scripts/face_landmarks.py`, run headless. From fixed MakeHuman base-mesh vertex indices it reports, per actor:
   - the eye line height as a fraction of head height (crown to chin);
   - the interocular distance and the eye width relative to face width;
   - nose length and width;
   - mouth width;
   - the lower-face height.
   Compare with typical human proportion ranges for the age (adult vs 3-year-old) and flag outliers. Put this into `qa/face-proportions.md`.
2. **3 variants per principal:** altan, ganaa, tsetsegmaa, cousin (Tungalag), dulmaa, sukhee.
   - Each variant stays faithful to the character's DNA traits and story facts.
   - Variants differ in their fixes, e.g. A = a conservative fix, B = more natural proportions, C = a bolder change.
   - Build them to scratch outputs inside your worktree (`--output`), and **don't overwrite the actor folders** until the user picks.
   - Render each variant twice: the standard face and front clay views, plus a **"warm room" view**, with warm key light from above-front, a dim fill and a 50 mm lens at eye height, like our birthday shots.
   - Deliver `artifacts/episode-1-cast/qa/face-variants-<id>.png`: 3 columns (A/B/C) × rows (face colour, warm room, front clay, three-quarter clay, smile), each labelled with a one-line description of what changed.
3. **Expression units.** MPFB ships FACS-style expression targets in `assets/sources/mpfb2-2.0.18/mpfb/data/targets/expression/units/asian/` (~36: eye closure, slit and opened-up per side; brow down, inner-up, outer-up and up per side; mouth compression, corner-puller, depression, elevation, open, pursing, retraction, upward-retraction; nose dilation and elevation; neck platysma; …).
   - Extend the shared builder (`build_actor.py`, or the module that makes the `EXP.*` keys; find where `EXP.smile` comes from) to add them as shape keys named `FACS.<unit-name>`, transferred to child meshes the way the existing EXP keys are (lashes, brows, wet line), and exported in `character.glb` as morph targets.
   - Keep the existing `EXP.*` keys unchanged (other code uses them).
   - Verify by loading the glb in Python (the morph target names, or `targetNames`).
4. **Shared fixes go in shared code.** If eyes and skin are wrong for everyone, fix the shared material and eye setup once (AGENTS.md: "Improve the shared controls, fitting, libraries or material layers when a defect affects multiple characters"). Show a before/after for 4 actors: `qa/shared-eye-skin-before-after.png`.

## Checks
- `dna.py report` must report `passed: True` for every variant DNA (put the variant DNA files in your scratch folder).
- `test_dna.py`, `test_recipes.py` and `npm test` pass on the committed state.
- Every image is **looked at by you**. Ask of each face: "does this look like a real Mongolian person from a 1998 aimag centre, of this age?"

## Allowed paths
- `artifacts/character-master/scripts/**` (the new landmark script, shared material and eye fixes, expression-unit support);
- `artifacts/episode-1-cast/scripts/build_actor.py` and the modules it imports;
- `artifacts/episode-1-cast/qa/**`;
- a scratch folder `artifacts/episode-1-cast/_variants/`, git-ignored inside, except for the final variant DNA JSONs;
- **no edits to `artifacts/episode-1-cast/<id>/` or `dna/<id>.json`** until the user chooses variants.

## Report
- The proportion findings.
- What each variant changes.
- The shared fixes.
- Proof the expression units exist (names and count).
- Image paths.
- Blender time.
- Honest weak spots.
