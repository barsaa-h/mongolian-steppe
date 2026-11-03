# CS04 round 2 (Codex): now FIX it; diagnosis is done

**Your run ends the moment you send a final message.** Don't send one until every deliverable below exists and you've looked at it. Last run you stopped after the diagnosis with "No source fix is ready for review". That's not acceptable twice. Your budget is for implementing, rendering and iterating.

## Your own diagnosis (confirmed by the manager)
- The atlas (`artifacts/stylized-cast-qa/cs04/ganaa-atlas-0.png`) has a **rectangular skin-coloured hairline strip** and **residual source beard**.
- The face is **smoother and lighter** than the ears and jaw, and the painted features are **high-contrast**.
- The three.js facecheck can't run in your sandbox (Chromium blocked), so **use Eevee for every sheet** (your `check-eevee.py` works through the wrapper; the EGL warnings are harmless).

## Do now, in order
1. **One skin for the whole head.**
   - In `recolor_texture`/`clean_face`, recolour *all* skin texels (face, ears, neck, scalp edge) from one roster skin colour, keeping only gentle, consistent baked shading.
   - Match the face's value and noise to the ears and jaw. Don't flatten the face more than the rest.
   - Remove the residual source beard everywhere unless the roster asks for stubble.
2. **Hairline:** replace the rectangular strip with a soft, irregular hairline (feathered over 3–6 atlas px at 256 scale), with no blocky temple patches.
3. **Softer features** in `ps2_face.py` defaults and `face_art`:
   - thinner, lower-contrast liner;
   - eye whites close to skin (not light grey);
   - lips only slightly darker and redder than skin, with no outline;
   - brows as broken strokes, a little lighter.

   Keep the Mongolian features: single lid or inner fold, flat wide bridge, full cheeks.
4. **Feather every mask edge** (Gaussian, not hard ellipses).
5. **Check alignment.** Compare `ps2_face.LANDMARKS` against where the mesh's eye sockets, nose and mouth actually project in UV, and fix any offset.
6. **Children's clothes** (task 2 below).
7. Rebuild ganaa, tsetsegmaa, dulmaa, altan and two more roster adults. Run `npm test`. Render the sheets in Eevee. Look at them, fix, and repeat for **at least 3 rounds**.

---

# The original brief (still in force), included in full

**Worker:** Codex. Read `AGENTS.md` first. EP01's cast is the low-poly **Vinrax-based PS2 cast** built by `scripts/build-cast.py` from `assets/cast/roster.json`. This worktree (`~/ms-workers/CS04`) already contains the manager's latest merged state:
- painted Mongolian faces: `scripts/ps2_face.py`, plus `recolor_texture`, `face_art`, `paint_face`, `reshape_face` and `face_details` in `build-cast.py`;
- the new five-finger hands and finger rig: `build_hands`, `assets/cast/hand-poses.json`;
- a child body: `child_body`, and the toddler mapping in `point_shape`.

The current renders are `artifacts/stylized-cast-qa/cs04/6-cast-faces-and-hands.png` and `7-altan-child.png`. **Open them first.**

## The user's verdict
> "current one looks weird, like glued another face on top of it"

The painted face reads as a **mask stuck onto the head**, not as the character's own face. Find out exactly why, by looking at the atlas and at renders from the front, 3/4 and profile, and fix it at the source. Likely causes to check (verify each; don't assume):
1. **The skin doesn't match across the head.** `clean_face` recolours and flattens the face region, while the sides of the head, ears, neck, scalp edge and hands keep the source texture's darker baked shading and hue. That leaves a visible boundary at the cheeks and jaw and around the ears. **All skin (face, ears, neck, scalp line, hands, legs) must come from one skin colour with consistent value**, with gentle baked shading (darker under the jaw, in the ear hollow, at the hairline), so the face blends into the head.
2. **The painted features are too large or graphic for the low-poly head:** big dark eyes with heavy liner, crisp outlined lips, a hard brow. On a 512² atlas viewed with nearest filtering, that reads as a sticker. Tone them down so they sit in the skin: softer liner, eye whites not pure light, lips only slightly darker than skin, brows broken into strokes. **Keep them Mongolian** (single lid or inner fold, flat wide nose bridge, full cheeks). Use the settings in `ps2_face.DEFAULTS` and `face_art`; change the painter if needed.
3. **Mask edges:** the feature masks and the hair-exclusion rule leave hard rectangular/elliptical edges, the hairline is cut sharp, and Ganaa has blocky tan patches at the temples. Feather every edge, and make the hairline a soft, irregular transition.
4. **Geometry vs paint:** the painted eyes, mouth and nose must sit on the mesh's own eye sockets, mouth line and nose (`ps2_face.LANDMARKS` vs the actual UV/mesh positions). If the paint is offset from the geometry, the face looks pasted on, so fix the landmarks or the reshape.
5. **Lighting:** the face may look flat and bright compared with the shaded side planes. Keep the painted shading subtle and let the real lighting shade the planes.

**The bar:** at front, 3/4 and profile, under neutral light and under a dim warm SH2-style key, the face reads as part of the same head and skin as the ears and neck, like a good PS2 character (Silent Hill 2 style technique: painted, not pasted). Use SH2 *techniques* only, never its assets.

## Task 2: children's clothes
Altan (3) now has a child body, but `clothes(profile)` still dresses her as a small woman: a waist-cinched fitted dress and adult heeled shoes. For `kind == 'child'`, build:
- a straight, loose smock/dress or a small padded **deel** (no waist, A-line, sleeves to the wrists);
- thick leggings or tights;
- **flat felt boots** (gutal or Soviet valenki style, no heels).

Check the coughing boy and Sarnai (also children in `roster.json`) get child clothes too. Clothes must skin to the rig and must not intersect the body in `idle`/`walk`.

## Optional, only if the above is done: Altan's height
Altan is 3 years old, but `roster.json` has `"height": 0.76` (a 1-year-old's height). **Don't change it.** The user decides. Just note in the report how she looks at 0.95 m if you test it.

## Deliverables
- Fixes in `scripts/build-cast.py` and `scripts/ps2_face.py`, and `assets/cast/roster.json` only for `faceArt` tweaks. Keep everything else working: hands, finger rig, morphs (`speak blink fear hunger resolve gaze smile frown`, each delta ≤ 1 cm), animations, `npm test` (currently 75/75).
- Rebuild **ganaa, tsetsegmaa, dulmaa, altan**, plus one more adult man and one more woman from the roster of your choice, to prove the fix is general.
- In `artifacts/stylized-cast-qa/cs04/`:
  - `faces-before-after.png`: before (the current state) vs after, at front, 3/4 and profile for each rebuilt actor;
  - `faces-sh2-light.png`: the same actors under a dim warm key and dark fill;
  - `children-clothes.png`: Altan front and 3/4 (plus the coughing boy and Sarnai if rebuilt);
  - `report.md`: the root causes you found (with evidence), what you changed, morph deltas, test output, and what still looks wrong.

  Keep each round's images. Do at least 3 render → look → fix rounds and **look at every image**.

## Rendering
- **Blender Eevee:** via the wrapper below. Fine for all sheets.
- **Or the GPU three.js review tool** in `.cache/cs04/facecheck.mjs`:
  - usage: `node .cache/cs04/facecheck.mjs <out.png> tex <glb> [<glb> …]` with env `VIEWS=front,tq,profile,body,bodytq SIZE=420`;
  - it shows the GLB exactly as the episode renderer will;
  - if your sandbox can't launch its browser, use Eevee and say so.

## Rules
- Blender headless only via `bash .cache/cs04/run_blender.sh --python <script> -- <args>`. It adds `-b`, uses your own lock, and runs a safe runner that always exits Blender. Run it in the foreground and wait; never interrupt a build. Never use the Blender MCP. Build actors with `--python scripts/build-cast.py -- <id> [<id> …]`.
- Write only `scripts/build-cast.py`, `scripts/ps2_face.py`, `assets/cast/roster.json` (`faceArt` only), the rebuilt actors' `assets/cast/<id>.glb` and new `<id>_v0xx.blend`, and `artifacts/stylized-cast-qa/cs04/**`. No commits.
- Don't change the hand/rig functions (`build_hands`, `hand_dimensions`, finger poses) unless a face/clothes fix truly requires it; say so if you do.
- **Failures are yours to debug, not reasons to stop. Use your full budget.**
