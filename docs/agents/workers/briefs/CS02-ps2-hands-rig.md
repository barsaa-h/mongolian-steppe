# Brief CS02: real hands and the shared finger rig for the PS2 (Vinrax) cast

**Worker:** Codex. **Priority:** #1. The user's own words about the HOUR-5 Ganaa: "hands needs visible ... ganaa's hand is looks so bad like not even looks like real hand".

## Context
- The user's final decision (31 Oct 2026): the EP01 cast is the low-poly **Vinrax-based cast** from `scripts/build-cast.py` + `assets/cast/roster.json` (the HOUR-5 look). Read `AGENTS.md`.
- In parallel, the manager (Claude) is rewriting the **face, eyes, mouth, hair and the child head** in the same file. **Don't edit** `recolor_texture`, `reshape_face`, `face_details`, `hairstyle` or the `altan` block in `load_actor`. Put your work in new functions (e.g. `build_hands`, `finger_rig`, `relaxed_idle`) and call them from `load_actor`/`preview_clips` with one-line hooks, so the two changes merge cleanly.

## Tasks
1. **Finger rig, identical names on both bases** (the male source has a single finger bone; the female has only a thumb):
   ```
   hand_left / hand_right (existing)
   thumb.01-03.L  index.01-03.L  middle.01-03.L  ring.01-03.L  pinky.01-03.L   (and .R)
   ```
   Each bone rolls so that **local +X curls the finger toward the palm** and **local +Z spreads it**. Put the convention in the report. Remove or rename the old `f_middle.01`, `thumb.L` and `*_end` bones, and keep their weights meaningful. `assets/sources/vadacross-psx-character/` has a finger-rig reference (free to use).
2. **A low-poly five-finger hand** replacing the paddle hands on both bases:
   - **Budget:** 300–500 tris per hand.
   - **Proportions:** the palm is about as long as the middle finger. The thumb leaves the *side* of the palm at the heel, not the end.
   - **Fingers:** 3 segments each, a 5–6-sided cross-section, rounded tips, slightly tapered. Finger lengths: middle > ring ≈ index > pinky.
   - **Skinning:** smooth to the finger bones, so the knuckles bend without collapsing. Join it to the forearm/sleeve without a gap; if a seam is unavoidable, the cuff covers it.
   - **Texture:** skin from the roster `skin` colour, with a slightly darker knuckle/nail line painted into a small atlas area or vertex colour. It must still read with `Closest` filtering.
   - **Scale:** the hand scales with the actor (adults, teens, children). The mittens stay a separate prop.
3. **Rest pose and `idle`:** a relaxed natural curl (fingers slightly bent, thumb relaxed), arms down 10–15° from the body, a slight elbow bend, shoulders down. No A-pose or T-pose in `idle`.
4. **Hand poses as shape-free bone presets** in a small JSON (`assets/cast/hand-poses.json`): `relaxed`, `fist`, `grip` (cylinder ~3.5 cm), `point`, `spread`, `pinch`. The three.js side will use them.
5. Rebuild **ganaa, dulmaa, tsetsegmaa** (the male base, the female base, and a second woman). Keep `hour-five`/`idle`/`walk`/`wave`/`cough` working; re-key `hour-five`'s hands on the new rig if it used the old finger bone.

## Rules
- Blender headless only, through **`bash .cache/cs02/run_blender.sh <args>`** (it keeps Blender's user folder inside the worktree, adds `-noaudio` and `timeout 900`, and takes the shared lock). Example: `bash .cache/cs02/run_blender.sh --python scripts/build-cast.py -- ganaa`.
- **End your own Blender scripts with `import os; os._exit(0)`** after saving. **Never leave a Blender process running**; if you interrupt one, make sure it's gone, because it holds the shared lock.
- Write only `scripts/build-cast.py`, `assets/cast/**` and `artifacts/stylized-cast-qa/**`. No commits. `npm test` must pass; if a test pins the old rig, update it and say so.
- **Failures are yours to debug, not reasons to stop.** Stop only if Blender cannot start at all. Use your full budget. Look at every image you render.

## Evidence (`artifacts/stylized-cast-qa/cs02/`)
- `<id>-hands.png` for each rebuilt actor: both hands at about 1080p close-up, in relaxed / fist / grip / spread / pinch, under a neutral key + fill on a plain grey background.
- `<id>-idle.png`: the full-body idle, front and 3/4.
- `report.md`: bone axis convention, tris per hand, what changed, and **what still looks wrong**, honestly.
