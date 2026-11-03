# E15 (DeepSeek): the panel player: actors in sets, as living panels

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E08`, where you built the set registry, `loadSet.js` and the unified exporter (E13/E14). Now the core of the episode: the **panel player**. Read `episodes/EP01/threejs/PLAN.md`, the plan file's style section below, `src/stylized/README.md` (the actor controller: cue verbs, gestures, hands, IK, look, face), `src/look.js`, `src/panels.js` (an older 6-panel sample), `render-panels.mjs`.

## The style ("living panels", SH2 techniques only)
Each **panel** is one composed frame held 2–8 s, cut to the dialogue. Actors are posed (clip + frame or controller cues), IK fixes hands/feet, faces carry an expression mix; the panel is **alive, never frozen**: breathing, blinks, eye saccades, small head drift, flickering practicals, drifting fog, grain; the camera does a slow push/pan/drift (true 3D parallax). Action is told in **bursts** of 3–8 quick panels with shake, flash frames and hard cuts. Talking = the speaker's close panel with a jaw/`speak` flap. Transitions: hard cut, fade to black.

## Build
1. **Panel format** `episodes/EP01/threejs/panels/<BEAT>.json`: `{ beat, panels: [ { id, dur, location, time, camera{ cam | pos,target,fov, move{ type: push|pan|drift|static, amount, ease } }, actors: [ { id, anchor | pos/yaw, clip?, frame?, cues: [...controller cues...], hands?, look?, face? } ], props: [ { glb, attach: actor.hand.R | anchor | pos } ], fx: [ ... ], lineIds: [], transition: cut|fade, shake?, flash? } ] }`. Write a JSON schema `panels/schema.json` and validate in a check.
2. **`src/panel/player.js`**: loads the set via `loadSet`, the actors (`assets/cast/<id>.glb`) via the stylized controller, places them at anchors, attaches props, runs the camera move, and renders any panel at any time `t` **deterministically** (seekable: same `t` → same image). Expose `window.panelPlayer.capture(beat, panelId, t)`.
3. **`tools/panel-stills.mjs`**: for a beat, one still per panel (at mid-time) + a contact sheet `out/panels/<BEAT>/contact.jpg` with panel id, duration and line ids under each frame. Headless Chromium like your set-stills tool.
4. **`tools/panel-check.mjs`** (node): schema-valid, every location/anchor/actor/prop exists, every lineId covered, durations sum, no actor's feet below the floor / intersecting the set at its anchor (simple raycast down), finite poses.
5. **Two test beats** (stills only, no video):
   - **B02 — dispatch office (0:45), Irina alone**: 6–9 panels: the cassette rewinding (spool close-up, using the set's spool objects spinning), Irina at the desk comparing timestamps, dialing the rotary phone (handset lifted: the handset is a separate object), the hang-up, wrapping the cassettes, the envelope, the satchel's wire clasp, the final spool close-up. Lines (Russian, for lineIds only): `B02-01` «Мне нужен ответственный. Сейчас.», `B02-02` (dispatcher, phone) «Утром перезвоните.», `B02-03` «Уже утро. Вы сообщение передали?», `B02-04` «Наран. Дежурному врачу.».
   - **B15 — Hürel's café, Ganaa and Hürel talking at the counter**: 6–8 panels, a two-shot, singles for each speaker with `say`, reaction close-ups, Hürel wiping the counter / pushing extra food across. Use lineIds `B15-01`… placeholders.
   Cast GLBs to use (newest faces, already copied in): `ganaa`, `hurel`, `irina` (+ `tsetsegmaa`, `altan`, `dulmaa` available).
6. **Look at every contact sheet** and fix framing, scale (actors vs set: door heights, desk heights; Irina must sit at the desk properly, hands on the desk/phone), lighting on faces (motivated by the set's practicals; faces must be readable but dark-moody), and intersections. At least 3 render → look → fix rounds.

## Rules
- Reuse the controller (`src/stylized/`), `loadSet`, `look.js`, `retarget.js`; don't fork them. If the controller needs a small fix (e.g. a sit-at-desk pose), add it there with a test and say so.
- Write only `episodes/EP01/threejs/src/panel/**`, `panels/**`, `tools/panel-stills.mjs`, `tools/panel-check.mjs`, `out/panels/**`, small fixes in `src/stylized/**` and `src/sets/**` (with tests). No Blender. Never the Blender MCP. No commits. Don't touch `AGENTS.md`.
- `npm test` and `node episodes/EP01/threejs/tools/stylized_check.mjs` must still pass.
- Final `## Report:` with files, commands + output, evidence (both contact sheets), and what still looks wrong.
