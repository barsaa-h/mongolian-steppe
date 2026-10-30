# Brief A01 — The performance system: make every character able to move, down to tiny things (three.js)

**The user's words:** *"our animation looks so bad, the main thing lacking is movement. We need better structure for moving our characters, from everywhere, even tiny things."* This is the **#1 priority** of the project.

Today's state is in `episodes/EP01/threejs/`:
- `src/retarget.js` and `clips/` hold CMU mocap retargeted to our 137-bone MPFB rig (44 baked clips).
- `src/motion.js` and `src/anim.js` are ad-hoc per-shot code.
- The result (`compare/B23_S001_v2.mp4`, `compare/B23_v2_motion_strip.png`) reads stiff:
  - Ganaa towers instead of kneeling;
  - the left-hand pull-back is a big swing;
  - Altan's mitten-on reads as crossed arms;
  - hands are flat, faces are frozen, eyes don't move.

**Build a reusable system, not another one-off shot.**

## What the rig gives you (verified by the manager)
- **Bones:** 137 joints, including `eye.L`/`eye.R`, `jaw`, the tongue, and full fingers (`finger1-1.L` … `finger5-3.R`). Note GLTFLoader strips dots from names; `retarget.js` already handles that.
- **Morph targets on the face:** only `EXP.blink`, `EXP.smile`, `EXP.frown` and the visemes `A`/`E`/`M`/`O`, for now. A parallel Grok job is adding ~36 FACS-style expression units (brows inner-up, eye-slit, mouth-corner-puller, nose-elevation, …) to the actors. **Read morph names dynamically and use whatever exists**, so the new units work when they arrive.

## Build: `episodes/EP01/threejs/src/perform/` (an ES module library)
Each actor gets an `Actor` controller that evaluates **layers in order** each frame, deterministically from time t:

1. **Base body:** mocap clips from a **catalog** (`clips/catalog.json`: name, source BVH, tags, frame ranges, loopable, contact frames).
   - Crossfades, time-warp (speed and ease), and mirroring (left↔right).
   - Partial-body masks: lower, upper, left arm, right arm, spine, head.
2. **Locomotion and placement:**
   - `walkTo(anchor or point, {speed, style})`: path, turn-in-place before walking, stride matched to speed, foot planting, stop and settle.
   - `turnTo(target)`.
   - Height changes: `kneel`, `crouch`, `sit(on object)`, `stand`, each with a believable transition (weight shift first).
3. **IK:**
   - Two-bone arm IK to world targets, with a pole vector, for `reach`, `touch`, `holdOut` and `give`/`take`. Hand orientation is controllable.
   - Foot IK keeps feet on the floor during kneel and crouch, so the hips can lower without knees going through the floor.
   - The IK blend weight is animated in and out.
4. **Hands:** a hand-pose library (relaxed, slight curl, grip-small for a mitten, grip-cup, pinch, point, fist, open-splayed, tense-claw, child-grab), blended per hand. Thumbs included. No flat hands, ever: the default is relaxed curl.
5. **Look:**
   - Head, neck and **eyes** aim at a target (an actor's eyes, a hand, a prop, a point), with per-joint limits.
   - Eyes lead, then the head follows with a 100–250 ms lag.
   - **Saccades:** small random eye jumps every 0.4–2 s while fixating.
   - Blinks: on a 2–6 s interval, plus one on every big head turn.
6. **Face:**
   - an expression mixer (named mixes of morphs, e.g. `warm_smile_small`, `worried`, `pain_hidden`, `fear`, `blank`);
   - `say(lineId, start, dur)` drives a simple jaw plus viseme flap now, with real lip-sync later;
   - micro-expressions as tiny noisy offsets.
7. **Life (always on, scaled per character):**
   - breathing (chest/shoulders, rate varies with state: calm, upset, fever);
   - weight shifts;
   - idle sway;
   - finger fidgets;
   - **sick Ganaa:** a slight tremor and a heavier blink rate as a state parameter.
8. **Props:** attach to a hand bone with an offset, and hand off between actors on a frame.

**Shot timelines as data:** `shots/<SHOT>.json`, a per-actor cue list. For example:

```json
{ "actor": "ganaa", "cues": [
  { "t": 0.0, "do": "kneel", "dur": 1.2 },
  { "t": 0.4, "do": "lookAt", "target": "altan.eyes" },
  { "t": 1.5, "do": "give", "prop": "mitten_R", "hand": "R", "to": "altan.hand.R", "dur": 1.6 },
  { "t": 6.2, "do": "guard", "hand": "L", "amount": 0.3 },
  { "t": 0.0, "do": "face", "mix": "warm_smile_small", "weight": 0.6 }
]}
```

- Writing a shot = writing cues. Keep `render.mjs`, `index.html` and the camera code working with this.
- Add a **debug overlay** mode (skeleton, IK targets, look lines, contacts) for checking.

## Proof (the manager renders on the GPU; your sandbox can't, as before)
1. **`shots/MOTION_TEST.json`**, a 16 s single-actor showcase with Ganaa in the apartment:
   - walks 3 m to a mark, stops and settles, turns;
   - kneels;
   - reaches with his right hand to a point at child height and holds out an object (grip-small);
   - looks around (eyes first, then head);
   - blinks;
   - stands back up;
   - picks up a cup from the table (grip-cup) and sips;
   - all the while breathing and with live hands.
   - Cameras: one wide, one medium.
2. **`shots/B23_S001.json` v3:** the mitten shot rebuilt with cues.
   - Ganaa **really kneels** (one knee down, the other up, hips low, so his eyes are at Altan's eye height).
   - The camera puts **Ganaa's face** in three-quarter view (add a new camera `CAM_B23_S001b` if needed, and keep the original too).
   - The right hand gives the mitten.
   - The left hand stays low and close; at 6–7 s, when Altan reaches for it, he draws it back by only 10–15 cm and turns his wrist away.
   - Altan takes the mitten with a child-grab and pushes her hand into it: one hand holds the cuff, the other pushes in. No crossed arms.
   - She looks at the mitten, then up at his face, and smiles small, if the morphs allow.
3. **`render.mjs --gpu --shot <name>`** renders MP4, a motion strip (1 frame per second), and a debug-overlay strip.
4. **Tests (Node, headless math only):**
   - IK reaches its target within 1 cm;
   - feet stay planted with under 2 cm drift during kneel;
   - no knee below the floor;
   - eyes stay within limits;
   - determinism (the same t gives the same pose);
   - every catalog clip loads and evaluates;
   - shot JSON schema validation.
   - Add them to `npm test` only if they run in under 10 s; otherwise give them their own command.

## Rules
- Don't edit actor files, the mocap sources or `package.json`. Write only in `episodes/EP01/threejs/**`.
- If you need more CMU clips (2,500+ are listed in `assets/sources/mocap-cmu/cmu-mocap-index-text.txt`), you can't download them, so **list the exact clip IDs and why** in the report; the manager fetches them.
- Write `episodes/EP01/threejs/PERFORM.md`: how to write a shot (the cue reference), and how to add a clip or a hand pose.

## Report
- The architecture.
- Test output.
- The exact GPU commands for the two shots.
- Honest weak spots.
- The clip IDs you need.
