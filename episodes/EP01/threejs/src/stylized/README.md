# Stylized actor controller

Reusable performance for the low-poly cast (`assets/cast/<id>.glb`) in the EP01 three.js look. A pose is a pure function of time. `pose(t)` does not read a clock, and calling it again at the same `t` repeats the same quaternions.

Layers run in this order: clip crossfade, placement, gesture body keys, hands, arm IK, breath and weight shift, foot plant, arm IK again, look, gesture head keys, face, sick tremor.

Missing bones and morphs are skipped and recorded once (`bone:jaw`, `morph:smile`). Today's cast has no jaw, no eye bones, no `smile` / `frown`, and only a partial finger set. `speak` is present and is not reported missing.

## Shot files

`episodes/EP01/threejs/shots/DEMO.json` places the actors. Each actor has a cue list:

```json
{ "actor": "ganaa", "cues": [
  { "t": 0.0, "do": "face", "mix": "tired", "w": 0.6 },
  { "t": 0.35, "do": "lookAt", "target": "altan.head" },
  { "t": 2.15, "do": "gesture", "name": "kneel_to_child", "side": "R" },
  { "t": 3.55, "do": "give", "prop": "mitten", "hand": "R", "to": "altan.hand.R", "dur": 1.5 },
  { "t": 5.2, "do": "gesture", "name": "hide_wrist_behind_back", "side": "L" },
  { "t": 8.8, "do": "say", "dur": 1.8, "intensity": 0.85 }
]}
```

Verbs: `face`, `lookAt`, `gesture`, `give`, `take`, `say`, `walkTo`, `turnTo`, `sit`, `stand`, `kneel`, `reach`, `hand`, `sick`. `w` and `weight` are the same field. An unknown verb throws. A missing bone does not.

Yaw 0 faces world +Z. Home yaw and path heading both use `atan2(dx, dz)` (`yawToward` in `math.js`).

## Add a gesture or a hand pose

Gestures live in `gestures.js`. A gesture is a duration plus bone tracks `[time, pitchX, yawY, rollZ]`, sampled with smootherstep. Head keys start later than the spine; hand IK starts later than the body. `+X` nods down, `+Y` yaws toward character-left. Set `side` when the gesture is one-handed so a cue can mirror it. `hold: true` keeps a pose (kneel, wrist behind the back) after the track fades.

Hand poses live in `hands.js`: `relaxed`, `fist`, `grip_small`, `grip_cup`, `grip_wheel`, `pinch`, `point`, `open_spread`, `claw`, `hold_child_hand`. The default is `relaxed`, which already has curl. Finger `+X` curls toward the palm (thumb is the opposite sign). `+Z` is spread, matching the rig contract Codex is building. On today's single middle finger that spread reads inward.

## What works

- Idle and walk crossfade through `AnimationMixer`, with each action's time set explicitly.
- `walkTo` turns in place, travels a polyline, then settles to idle. Stride used for the cycle is 0.46 m.
- `turnTo`, `sit`, `stand`, `kneel` ease through a weight shift before the pose lands. Kneel drop is `min(0.5, leg * 0.66)`. Measured hip-to-ankle is 0.72 m on Ganaa, 0.60 m on Tsetsegmaa, 0.25 m on Altan, so a child is not dropped by an adult amount.
- Two-bone arm IK and a foot plant. Standing feet lock to the rest ankles after the breath, so they do not skate. During a walk the clip's own foot keys are replanted instead.
- Look: eyes would lead by ~120 ms and the head arrives 150–250 ms later. With no eye bones, the head/neck carry it and `gaze` takes a little of the yaw. Saccades every 0.4–2 s. Blink every 2–6 s, heavier when `sick` is high, plus an extra blink on a fast head turn.
- Face mixes: `warm`, `tired`, `worried`, `angry`, `afraid`, `pain_hidden`, `hungry_blank`, `laugh`. `say(t, dur, intensity)` drives `speak` with a syllable rhythm. The jaw bone is absent, so the mouth is the morph only.
- Props parent to a hand at a local offset and switch parent when the give's smoothstep crosses 0.55. Both hands aim at a point between the two focus points for that window.
- The 12 s demo is only those cues. Ganaa walks in from the hall, kneels on the right knee, gives the mitten with the right hand, hides the left wrist, and Tsetsegmaa speaks. Her line `Хүүхээ, юу өгөөд байгаа юм бэ?` is an HTML caption. It is not burned into `png()`.

## What is still stiff

- The preview walk and idle are in-place cycles. Travel slides against the feet. The 0.46 m stride is a time warp, not a matched step.
- Standing lock ignores idle leg keys on purpose. If a future idle shifts a foot, the plant will pull it back.
- Kneel, sit and crouch are analytic. Ganaa's pelvis drops about 0.47 m (hip ends near 0.30 m). His head stays well above Altan's standing head (about 0.62 m). He cannot meet her eyes.
- The spine is `spine` + `chest`, so a bend is broad.
- Gestures are authored curves, not captured acting. Overlapping ones add their rotations.
- Give / take meet at chest focus points, not at the fingertips. The mitten pops from one palm offset to the other at the handoff.
- No lipsync. `say` will be replaced when audio exists.
- Male hands are `f_middle.01` plus `thumb.01` / `thumb.02`. Female and child hands are a thumb chain (`thumb.L`, `thumb.L_end`) plus wrist curl. They read as a closed mitt, not as fingers.
- Sick tremor is a small rotation on the head and hands after IK (about 0.006 rad times `sick`). The hand origin stays on the IK target.

## Tested

`node episodes/EP01/threejs/tools/stylized_check.mjs` loads `assets/cast/ganaa.glb`, `tsetsegmaa.glb` and `altan.glb` with meshes stripped and morph-weight tracks removed. It checks seek determinism, finite unit quaternions, all 30 gestures on the male, the female and the child, IK error under 2 cm, standing feet under 1 cm of drift, and missing bones reported instead of thrown.

This sandbox did not launch Chromium. The GPU stills are for the manager:

```
node episodes/EP01/threejs/src/stylized/render-stylized.mjs --gpu --stills
```

That writes `episodes/EP01/threejs/compare/stylized/t0.4.png` through `t9.6.png` (times 0.4, 2.2, 3.4, 4.8, 6.4, 9.6). Without `--stills` it writes a 12 s 1080p24 mp4. `demo.html` exposes `window.stylized = { frame(i), totalFrames, png() }` and only uses `performance.now()` when the URL has no `capture` flag.
