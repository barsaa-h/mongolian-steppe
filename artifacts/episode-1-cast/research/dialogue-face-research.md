# Ganaa text-timed face block — draft

This study adds an exploratory face pass to the cuff and cheek-contact block. It preserves the approved neutral identity and uses the seven existing additive `EXP.*` shapes. The input cue texts and intervals are read directly from `src/filmTimeline.js`; the five Ganaa cues are recorded in the output `dialogue-cues.json`. Blink and frown timing are temporary artistic choices.

There is no recorded voice in this study. Mouth shapes are mapped approximately from written Cyrillic characters and distributed uniformly within each subtitle cue. This is rough editorial blocking, not Mongolian phonetic analysis, accurate articulation, voice synchronization, or a final acting pass. The two-second [silent preview](dialogue-block-preview.mp4) uses the film camera at 7–9 seconds, with the draft GLB substituted for the normal candidate. It is not a final film render. The body remains mostly held; breathing, head and gaze performance, a convincing slap and the final voice remain open.

The exported `Cheek_Block` retains its 30-second body animation and shoulder corrective while adding independent expression tracks to the body, eyebrows, teeth, tongue and skin details. The existing `Talk_Check` remains a separately playable technical clip. The GLB check verifies that each Ganaa cue has some mouth movement, non-speaking sample times return mouth shapes to zero, blink and frown can combine at impact, the four major facial meshes retain all seven shape names, and out-of-order seeks repeat. These checks do not judge expression quality or intelligibility.

The newly rendered matching-material [front](../ganaa-dialogue-study/qa/front.png), [profile](../ganaa-dialogue-study/qa/profile.png), smile, blink and A-viseme images match the current approved Ganaa QA images pixel-for-pixel; all seven expression checks and neutral recovery passed. The existing [cast lineup](../qa/lineup.png) and [all cast profiles](../qa/index.html) remain the comparison board. Native reopening retained the 137-bone rig, 19,158-vertex full authoring body and packed textures. The cuff and head-only cheek-contact checks still report no surface crossings in their 123 sampled poses; these checks do not establish continuous clearance.

## Continuity warning

The dialogue master places the exposed bite and crawling line before HOUR 5. Ganaa wraps the wrist in a rag, and the line has reached his elbow by HOUR 5. The draft visual studies show a bare wrist and a shorter line in the HOUR 5 camera, so they do **not** satisfy that continuity. The candidate runtime now sets a tagged line fully revealed at the start of HOUR 5 instead of growing it in that scene. The draft still lacks the rag and elbow-length line, and the wrist side and exact edit need review.

Reproduce into a new or empty directory:

```sh
blender -b artifacts/episode-1-cast/ganaa-cuff-study/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/dialogue_face_probe.py -- /tmp/ganaa-dialogue-study
node --test tests/ganaa-dialogue-study.test.mjs
# With npm start running, render a silent two-second study excerpt:
node artifacts/episode-1-cast/research/render_cheek_block.mjs "$PWD/artifacts/episode-1-cast/ganaa-dialogue-study/character.glb" /tmp/dialogue-block-preview.mp4 7 48
```

The saved draft at `artifacts/episode-1-cast/ganaa-dialogue-study/` has source SHA-256 `e473215e7b2a00e0f980530f9ca266c6805fd41a8379118f937d6b6553ffbb94` and GLB SHA-256 `fda56814325c1e2386141173853e05cdc73d16c8a192eee43ef8149bbee7b1b6`. It does not replace the normal candidate. Final speech requires an approved recording and a performance pass timed to that audio.
