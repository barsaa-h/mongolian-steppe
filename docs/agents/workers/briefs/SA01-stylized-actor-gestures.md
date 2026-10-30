# Brief SA01: Stylized actor controller + gesture library (three.js)

**Worker:** Grok. **Priority:** #1, in parallel with Codex CS01 (the character builder). EP01 must be animated within one week.

## Why
EP01 is now made with the **stylized low-poly cast** (`assets/cast/<id>.glb`, built by `scripts/build-cast.py`), rendered in three.js with the SH2-style look in `episodes/EP01/threejs/src/look.js`.

The HOUR-5 prototype (`output/film/khaniad-hour-five.mp4`, code in `src/film*.js`, `src/scenePlayer.js`, `src/character.js`) proved this style feels alive. It has one strong keyed gesture (the slap), constant world motion, and quick cuts.

What we lack is a **reusable way to make any character move in any shot**: talk, look, gesture, use their hands, sit, walk, react. Build that.

## Read first
- `docs/agents/workers/briefs/A01-performance-system.md`. This is the design reference written for the old MPFB rig. Adopt its layer model; **ignore its MPFB bone names.**
- `src/character.js` (how the legacy GLBs load, their clips `idle walk wave cough` and morphs `speak blink fear hunger resolve gaze`).
- `episodes/EP01/threejs/src/panels.js`: the current shot page, deterministic `frame(i)`, IK in `src/anim.js` (`solveLimb`), look in `src/look.js`.

## Rig contract (Codex is rebuilding the cast to exactly this)
```
pelvis spine chest neck head jaw eye.L eye.R
shoulder_left upper_arm_left forearm_left hand_left      (and _right)
thumb.01-03.L index.01-03.L middle.01-03.L ring.01-03.L pinky.01-03.L   (and .R)
thigh_left shin.L foot_left toe.L                          (and _right / .R)
finger bones: local +X = curl toward palm, local +Z = spread
morphs: speak blink fear hunger resolve gaze smile frown
```
Today's GLBs only partly match: they have `f_middle.01.L`, `thumb.01.L`, no `jaw`, and no eye bones. **Missing bones and morphs must be skipped silently** (record them once in a diagnostics list), so the code works now and gets better when the new cast lands. GLTFLoader strips dots from node names, so map names through `userData.name` as `retarget.js` does.

## Build: `episodes/EP01/threejs/src/stylized/` (ES modules, no new npm deps)
1. **`actor.js`: `class StylizedActor`**. It is deterministic: everything is a pure function of time `t`. Calling `pose(t)` repeatedly, in any order, gives identical results. The layers, evaluated in order:
   - **Base:** `AnimationMixer` clip sampling with crossfades (set the time explicitly; never use a wall clock).
   - **Placement:** `walkTo(path, speed)` along a polyline with the walk clip, turn-in-place first, then stop and settle. `turnTo(target)`. `sit(seatPos)`, `stand()`, `kneel()`, each with a weight-shift transition.
   - **IK:** two-bone arm IK to world targets with an animated weight (`reach`, `touch`, `give/take` a prop, `hand on table`, `hand to face`). Foot lock while standing.
   - **Hands:** a pose library: `relaxed, fist, grip_small, grip_cup, grip_wheel, pinch, point, open_spread, claw, hold_child_hand`, blended per hand. **Never flat.** The default is `relaxed`.
   - **Look:** eyes lead and the head/neck follow 150–250 ms later, with limits. Saccades every 0.4–2 s while fixating. Blink every 2–6 s plus on big head turns.
   - **Face:** expression mixes (`warm, tired, worried, angry, afraid, pain_hidden, hungry_blank, laugh`) from the morphs. `say(start, dur, intensity)` drives the jaw/`speak` with a syllable-like rhythm (it gets replaced by real audio later).
   - **Life (always on):** breathing, weight shift every 3–8 s, idle sway, finger fidgets. `sick` (0..1) adds tremor, heavier blinking and a slower breath.
   - **Props:** attach to a hand with an offset, and hand off between actors on a given time.
2. **`gestures.js`: about 30 named gestures** as small keyframed bone-rotation clips relative to rest, which can be layered on top of any base:
   `nod, shake_head, shrug, point_at, wave_off, scratch_head, rub_face, hand_on_chest, arms_cross, hands_in_pockets, lean_on_table, pour_tea, drink_from_bowl, eat_buuz, smoke, cough, wipe_brow, hide_wrist_behind_back, check_wrist, flinch, startle, slap_own_cheek, push_door, hold_door_shut, grab_wrist, hug_child, pick_up_child, kneel_to_child, laugh, cry_quietly`.
   Each has anticipation → action → settle timing (overlapping action: the hands lag the body, the head lags the hands), not linear interpolation.
3. **`cues.js`: shots as data.** A `shots/<SHOT>.json` cue list per actor is interpreted into the layers above:
```json
{ "actor": "ganaa", "cues": [
  { "t": 0.0, "do": "face", "mix": "tired", "w": 0.6 },
  { "t": 0.3, "do": "lookAt", "target": "altan.head" },
  { "t": 1.0, "do": "gesture", "name": "kneel_to_child" },
  { "t": 2.2, "do": "give", "prop": "mitten", "hand": "R", "to": "altan.hand.R", "dur": 1.4 },
  { "t": 4.0, "do": "gesture", "name": "hide_wrist_behind_back", "side": "L" },
  { "t": 5.1, "do": "say", "dur": 1.8 }
]}
```
4. **`demo.html` + `src/stylized/demo.js`:** load `ganaa`, `tsetsegmaa` and `altan` from `assets/cast/` into `assets/maps/episode-1/glb/apartment.glb`. Play a 12 s test scene built only from cues. Ganaa comes in, sees Altan, kneels, gives the mitten, she takes it, he hides his left wrist, Tsetsegmaa watches and says something.
   - Use `createLook()` from `../look.js` and expose `window.stylized={frame(i),totalFrames,png()}` like `panels.js`.

## Tests (Node, no browser needed)
`episodes/EP01/threejs/tools/stylized_check.mjs` loads real GLB hierarchies (as `anim.test.mjs` does) and asserts:
- seek determinism;
- finite quaternions;
- every gesture runs on both a male and a female actor;
- IK contact error < 2 cm;
- feet stay locked while standing (< 1 cm drift);
- missing bones are reported, not thrown.

## Rules
- Only write `episodes/EP01/threejs/src/stylized/**`, `episodes/EP01/threejs/shots/**`, `episodes/EP01/threejs/tools/stylized_check.mjs` and `episodes/EP01/threejs/demo.html`. Don't touch `scripts/build-cast.py` or `assets/cast/**`; Codex owns them. No commits, no new dependencies, no Blender, no paid services.
- Chromium may not launch in your sandbox; that is fine. The manager runs the GPU renders. Make `demo.html` render deterministically, and give the exact command, e.g. a `render-panels.mjs`-style script `render-stylized.mjs --gpu --stills`.
- Report honestly in `episodes/EP01/threejs/src/stylized/README.md`: what works, what was tested, what is still stiff.
