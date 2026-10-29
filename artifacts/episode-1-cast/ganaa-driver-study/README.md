# Ganaa driving block — draft

This editable Blender file and GLB are a **static pose study**, not an approved film performance or replacement for the published candidate. They were generated from the existing approved Ganaa source without changing his identity or DNA. `Driving_Block` is a one-second repeating clip with a held pose; `Deformation_Check` and `Talk_Check` remain technical exercises.

The blocking places the pelvis approximately at the cab seat and aims wrists toward the legacy wheel targets. [study-report.json](study-report.json) records the exported GLB hash, source Blender-file hash and wrist target error. A wrist point is not a palm contact: fingers remain open, and the model does not grip the wheel. The cab screenshots at [8 seconds](../ganaa-pilot-qa/driver-block-8.png) and [wrist insert](../ganaa-pilot-qa/driver-block-2.3.png) are a technical preview using this study in place of the candidate response. They are not a film export or approval.

To reproduce into a **new or empty** folder (the script refuses to overwrite an existing nonempty folder):

```sh
blender -b artifacts/episode-1-cast/ganaa/Character-Master.blend --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/scripts/block_ganaa_driver.py -- /tmp/ganaa-driver-study-new

blender -b artifacts/episode-1-cast/ganaa-driver-study/Character-Master.blend \
  --python-exit-code 1 --python artifacts/episode-1-cast/scripts/check_driver_study.py
```

The chair position and elbow poles are artistic blocking choices from the legacy cab, not script facts. The short clip has no breathing, steering, blink, dialogue, slap or hand/finger animation. Palm-to-wheel and cheek contact, foot/pedal placement, cloth penetration, seated floor clearance, bandage visibility, makeup and shot lighting still require calibration and review. [Front](blocked-front.png) and [profile](blocked-profile.png) studio views show the full held pose; their mouth shape is from the separate technical talk action, not approved dialogue. Native source reopening confirmed the full authoring body, rig, packed images and finite geometry at three samples. The original legacy HOUR 5 actor remains the default.

Verification on 2026-10-27: the native source reopened with 19 visible meshes, 137 bones, 19,158 source-body vertices, packed images and finite posed geometry at frames 1, 13 and 25. The exported GLB's held block passed the wrist and repeated-seek test in `tests/ganaa-driver-block.test.mjs`. The separate neutral face check passed seven expressions and neutral recovery; the refreshed cast-wide clay lineup and all profiles passed their automated checks. The 78-pair face-distance report passed with a 0.055 threshold; this is not a human design approval. Ganaa's prior identity approval remains valid and does not approve this pose or any film shot.
