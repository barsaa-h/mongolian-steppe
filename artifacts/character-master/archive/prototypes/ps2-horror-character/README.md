# Early-PS2 horror character

Open **PS2_Character_Master.blend** in Blender 5.2 or newer. The live Blender project was built through the Blender MCP connection. Its active scene is `PS2 | Character Master`, with a clean neutral character and a 720p full-body camera.

The latest supplied **Main_Brief.md** is the art direction: the original 2001 early-PS2 psychological-horror technique, while retaining this character's identity and green winter outfit. This is an original stylized reconstruction, not an extracted game asset or a recreation of James Sunderland.

## What is included

- A rebuilt face with welded eye and mouth loops, eyelids, eyeballs, iris/pupil surfaces, nostril shadows, a small mouth opening, oral cavity, teeth and tongue.
- Twenty facial controls, ten saved expression actions, jaw/eye bones and a four-second silent speech-shape study.
- Short polygon hair clumps over a closed scalp underlayer; painted directional texture.
- Cleaner green jacket, simplified cream fleece, taupe trousers, brown boots and articulated low-poly hands.
- An 89-bone body rig, normalized skinning, local joint-volume correctives, IK/FK controls and eight editable movement blocking actions.
- Seven optional horror controls: zombie skin/gauntness, bruise, blood, dirt, torn sleeve, left wrist separation and its offset amount. All default to zero.
- Four editable lighting scenes: cold exterior, overhead interior, dark side and restrained warm. These supplement the neutral studio.
- Packed 512px painted diffuse maps, also supplied in `Textures/`. No skin pores, hair particles, subdivision or subsurface skin shading.

## Find the controls

Select `PS2 | FACE_CONTROLS` and open **Object Properties → Custom Properties**. Most values run from 0 to 1. `EyeWide`, `BrowTilt`, `GazeYaw` and `GazePitch` also accept negative values. Negative EyeWide narrows the eyes. Controls are independently keyable.

The twenty controls are Blink_L, Blink_R, EyeWide, BrowInnerUp, BrowOuterUp, BrowDown, BrowTilt, JawOpen, Smile_L, Smile_R, Frown, LipPress, LipRound, LipStretch, GazeYaw, GazePitch, AA, EE, OH and MBP. MBP closes the lips; the other three speech controls supply basic vowel shapes. A blink/wide corrective prevents the widened lids from breaking a full blink.

To use an expression, select FACE_CONTROLS, change a Dope Sheet to **Action Editor**, and select `PS2_Face_Neutral`, Sadness, Fear, Anger, Shock, Grief, Pain, Subtle_Smile, Exhaustion or Vacant_Zombie. These are single-pose actions. Unlink the action with its X before making manual property changes, otherwise the action will overwrite them when the frame changes.

Select `PS2 | Character Rig` in Pose Mode to animate the body. Root, pelvis, spine, chest, neck and head provide body motion. `FK_upper_arm`, `FK_forearm`, `FK_hand`, `FK_thigh`, `FK_shin` and `FK_foot` control the limbs. Each name ends in .L or .R. Finger controls have three segments, for example `index.01.L`. `hand_IK`, `foot_IK`, `arm_pole` and `leg_pole` provide IK targets.

The rig's custom properties `arm_IK_FK.L/R` and `leg_IK_FK.L/R` use **0 = FK, 1 = IK**. Match both sets of controls before switching; an automatic snap operator is not installed. Full names and corrective coverage are in Rig_Metadata.json.

## Play the tests

All authored actions use 24fps. The rendered videos sample every other source frame and play at 12fps: 48 frames, four seconds, 1280×720. This is a preview sampling choice; the editable actions retain their keyed source timing.

For dialogue, assign `PS2_Dialogue_Face` to FACE_CONTROLS and `PS2_Dialogue_Body` to Character Rig. Set the timeline to frames 1–96 and play. It is a silent phoneme/performance study, not lip-sync to a recorded line.

For the body test, unlink the facial action, assign `PS2_FullBody_Test` to Character Rig and play frames 1–96. The test contains two small planted-foot steps, a reach, finger grip, breathing and shivering.

Other body actions are `PS2_WalkLoop` (1–49), `PS2_RunLoop` (1–33), `PS2_Fall` (1–49), `PS2_Crawl` (1–49), `PS2_Combat` (1–49), `PS2_Zombie` (1–73) and `PS2_Breathing_Shiver` (1–73). Actions are also marked as assets. Travel loops use location offsets; use the NLA or extract root motion when adapting them to a game engine.

## Optional horror variants

Select `PS2 | HORROR_CONTROLS` and use its Object Custom Properties. Set Zombie, FaceBruise, FaceBlood, BodyDirt or TornSleeve to 1 to enable that prepared variant. Set DetachWristL to 1, then animate WristSeparation from 0 to 1 to move the capped left hand away. The clean meshes are retained and restored when switches return to zero. The alternate meshes live in `PS2 | Horror Variants`.

The wrist demonstration retains finger/hand bone deformation and adds an object offset. For a freely falling detached prop, bake it to an independent prop rig. Other cut zones are not prepared. The torn sleeve is a polygon opening with a flat lining; it does not simulate cloth.

## Evidence and limits

`Comparisons/` contains matching-camera, matching-neutral-light front, side, three-quarter and facial before/after renders. `Expressions/` contains ten 720p expression stills. `Lighting_Tests/`, `Animation_Tests/` and `Horror_Variants/` hold the other evidence. QA_Report.md and QA_Report.json record fresh saved-file checks; Body_Action_Test.json records foot-plant and fall/crawl clearance measurements.

The clean character has **12,676 triangles**, 676 above the suggested 12k starting budget. The brief permits a small acting-related overage. Hidden optional variants and the preserved reference are additional geometry.

The face still has broad, simplified cheek planes and the collar is visually prominent. These remain artistic limitations compared with hand-sculpted original-game character art. The motion clips are usable blocking, not a polished motion-capture library: extreme clothing folds, crawl hand/knee contacts, grip contact and shot-specific timing need animator polish. Correctives preserve volume; there is no cloth/collision simulation. Speech is silent. No game-engine export or runtime compatibility is claimed.

The original field-guy .blend is preserved in the read-only `Backup/Original_Field_Guy.blend`; its SHA-256 matches the source. Earlier projects were left in their original directories. The saved .blend is the authoritative edited artifact; construction scripts are included for inspection, with some final sculpt refinements made directly through MCP.
