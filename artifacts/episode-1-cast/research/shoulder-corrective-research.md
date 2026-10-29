# Ganaa jacket shoulder corrective — draft study

The cheek-contact block exposed a skin-colored patch on the right shoulder. A ray in the film camera hit `Body.Skin` in front of `Clothes.Top`; the corresponding body vertices were already visible in the original generated character, so the exposed-wrist mask did not create this patch. Nearby jacket and skin vertices have different shoulder influence weights. A local transfer of body weights to the garment enlarged the visible patch in the test frame and was rejected.

This separate study moves a small area of the jacket outward through a `ShoulderReach` morph and animates the morph with the draft `Cheek_Block`. It fades in from 21 to 21.5 seconds, stays on through 23.5, and returns to zero by 24.5. The shape and timing are provisional shot-specific art choices, not a general garment fit. The original complete body and rig are retained, the original source and film asset are untouched, and the fabric thickness modifier is baked in this study before adding the morph so the GLB exporter retains it. The unchanged source with its editable modifier remains in `ganaa-cheek-study`.

The [before](shoulder-before.png) and [after](shoulder-after.png) images are taken at 23 seconds through the film camera. A diagnostic 8-by-8 ray grid over the suspect screen region against the actor found 20 body-first hits before and one after at 23 seconds; at 21.5 it found five before and zero after. At 20, 24 and 25 seconds the corrective had the same sampled counts as the baseline. These are sparse camera-specific samples against the actor only, not full-image coverage or proof of collision-free clothing. The corrective changes the shoulder silhouette and still needs close visual review; it has not been checked for other wardrobe classes or movements.

The exported corrective is in the same GLB animation as the arm and returns to zero after seeking. The native check retained the 137-bone rig, 19,158-vertex authoring body and packed textures. The head-only check retained the previous cheek-contact result over 123 sampled poses. Those checks do not test garment-to-body clearance throughout motion, nor do they approve the performance. The rough cuff, visible bite art and hand obscuring the face remain open.

To reproduce in a new or empty folder:

```sh
blender -b artifacts/episode-1-cast/ganaa-cheek-study/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/shoulder_corrective_probe.py -- /tmp/ganaa-shoulder-study
blender -b /tmp/ganaa-shoulder-study/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/check_cheek_block.py
node --test tests/ganaa-shoulder-study.test.mjs
# With npm start running, compare the same 8-by-8 camera region:
node artifacts/episode-1-cast/research/check_shoulder_view.mjs "$PWD/artifacts/episode-1-cast/ganaa-cheek-study/character.glb"
node artifacts/episode-1-cast/research/check_shoulder_view.mjs "$PWD/artifacts/episode-1-cast/ganaa-shoulder-study/character.glb"
```

The saved draft at `artifacts/episode-1-cast/ganaa-shoulder-study/` has source SHA-256 `ca67cbcaaaa84127bdfacf8c5a260fbf56f91d6691adf9acb6a7714d6226be50` and GLB SHA-256 `de2be7c23123b848f8655636c17a773f46af024dfb40663acd25ffec13bce43b`. This is not an approved or published film asset. The next fit pass must validate the full dressed motion and other affected characters before incorporating any general solution into shared garment sources.
