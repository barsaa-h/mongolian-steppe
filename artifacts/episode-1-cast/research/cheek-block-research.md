# Ganaa cheek-contact blocking study

This is a draft technical study derived from `ganaa-wrist-study`; it is not an approved shot, an authored acting performance, or a replacement for the normal film asset. The existing approved identity and full authoring topology are retained. The held driver pose and the cheek-contact location/orientation are artistic approximations.

The separate `Cheek_Block` clip lasts exactly 30 seconds. It holds the driving pose through 21 seconds, brings the right hand to the face at 22.15 seconds, holds through 22.35, and returns by 24.5. The left wrist remains at its driving pose in these samples. All other body motion, dialogue, face performance and cloth motion remain unfinished. The animation uses linear interpolation as blocking and does not yet have a readable slap or recoil. In the shot, the hand obscures the face and a shoulder opening appears in the jacket. The open cuff and bite art also remain unfinished.

At 22.15 seconds the nearest sampled right-hand vertex is 1.19 mm from head-weighted skin; nine hand vertices are within 5 mm, and the sampled head and hand surfaces report no triangle intersections. The same surface check reported no crossings at 121 evenly spaced frames from 20–25 seconds, plus the 22.15 and 22.35 impact samples. It does not check containment, between-frame collisions, other body surfaces, clothing, or convincing contact; the head region is selected from the head vertex group, not the whole face. The original diagnostic accidentally included the wrist seam and reported false intersections against the hand itself; the current check isolates the head.

The generated GLB's absolute-time seek test checks its 30-second duration, right-hand excursion and return, stable left wrist, and out-of-order seeking. Native reopening confirmed 137 bones, the full 19,158-vertex source body, packed images and finite geometry in the existing driving test. The browser reel below is silent, uses the film camera and candidate loader with the study substituted by the test, and is not a final film render.

```sh
blender -b artifacts/episode-1-cast/ganaa-wrist-study/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/cheek_block_probe.py -- /tmp/ganaa-cheek-study
blender -b /tmp/ganaa-cheek-study/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/check_cheek_block.py
node --test tests/ganaa-cheek-study.test.mjs
# Start npm start before the preview render.
node artifacts/episode-1-cast/research/render_cheek_block.mjs "$PWD/artifacts/episode-1-cast/ganaa-cheek-study/character.glb" /tmp/cheek-block-preview.mp4
```

The saved draft's source SHA-256 is `f6dea35b04f0dbf2498a49030746dfd4b993ebb95195beb3a75c26f1995276ac`; its GLB SHA-256 is `7f8a63021e6825791d731152d5407458ee770ad0b51b35f1e183b5e430edc153`. Next steps are to correct the jacket's shoulder and cuff, make the contact and recoil readable at the chosen camera, and author actual breathing, gaze, expression, speech and other shot motion before testing and offering a finished performance for review.
