# Delivery review

The final master, QA_Report.json and Delivery_Manifest.json have matching SHA-256 values. The preserved original backup was also checked against the original field-guy source and matches byte for byte.

## Verified

- Fresh Blender process: the final master passes all hard structural/functional checks. Twenty facial controls, ten expression actions, eight body blocking actions, two dialogue actions, 89 bones and 197 drivers are present. Skin weights normalize. Textures are loaded and packed. All seven horror controls are saved at zero.
- Principal stills: neutral, sadness, fear, anger, shock, grief, pain, exhaustion, subtle smile and vacant zombie; matching front/side/three-quarter and facial comparisons; cold, overhead, side and warm lighting.
- Both MP4s: every source PNG decoded successfully; 48 frames each, 1280×720, H.264, 12fps, four seconds, no audio. Both encoded files also passed a complete ffmpeg decode without errors. Editable actions use 24fps; previews sample alternate frames.
- Facial preview: sampled rendered frames and the eight-frame filmstrip show a blink, basic mouth changes, gaze changes and small head motion. The tested open-jaw chin/throat intersection is corrected. The crown gap is closed in the reviewed neutral and zombie renders.
- Body preview: sampled rendered frames and the final filmstrip show two steps, a reach, finger curl and small upper-body motion. Component-aware jacket weights removed the large dangling torso/cuff points seen in the first reach render. Foot-plant measurements are in Body_Action_Test.json; repaired-jacket floor checks are in Animation_Tests/Jacket_Weight_Repair_Test.json.
- Horror renders: the zombie head, painted bruise/blood, prepared sleeve opening and detached left hand are visible. The former light cheek patch was caused by intersecting copied shape keys; the corrected render shows a soft purple bruise. The cap on the detached wrist is visible at its small scale; the body-side cap remains largely under the retained fleece cuff.

## Practical limits

This is an editable PS2-inspired reconstruction. Its broad smooth cheek planes, chunky crown silhouette and prominent collar remain artistic limitations; the images do not establish an exact match to hand-authored Silent Hill 2 character art.

The clean model is 12,676 triangles: 676 over the proposed 12k starting budget, within the brief's allowance for a modest acting-related overage. Optional hidden variants and the preserved reference add geometry outside that clean-model count.

Motion clips are blocking. Extreme arm elevation still stretches the original fused underarm topology; crawl hand/knee contacts, grips against props and timing need shot-specific animator work. The numeric checks and sampled frames do not establish collision-free behavior for every possible control combination. Raw body_rig.set_pose helper presets are not the delivered ground-corrected actions and may need manual ground placement.

Dialogue is a silent speech-shape study, not synchronization to a supplied recording. Only the left wrist has a prepared capped separation variant; detached free-fall would require baking or a prop rig. There is no cloth simulation, physics damage system or validated game-engine export.
