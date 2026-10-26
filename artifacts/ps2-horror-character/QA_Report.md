# Character QA report

Source: `PS2_Character_Master.blend`
Checked: 2026-10-25T15:19:31.894052+00:00
SHA-256: `59e502fbbde1e794ad7046d2a1266488a6b4fdebf23e5f3770eb86b81bc6365e`

The source .blend was opened in a fresh background process and never saved.

## Structural and functional checks

- PASS: 20 expected face controls.
- PASS: 23 head blocks including basis and four correctives.
- PASS: 89-bone character rig.
- PASS: no character Subdivision modifiers.
- ADVISORY: suggested 6000–12000 triangle budget.
- PASS: active character diffuse images are 512 px and loaded.
- PASS: character images packed with valid paths.
- PASS: every visible character mesh follows the rig.
- PASS: deform weights normalized within 0.0001.
- PASS: neutral coordinates finite and human-sized.
- PASS: 20 facial controls produce finite bounded motion.
- PASS: signed facial controls remain bounded.
- PASS: 10 emotion presets remain finite below 0.05 m.
- PASS: BlinkWide correctives have ZERO displacement outside eyelids.
- PASS: full blink plus EyeWide 0.75 equals full blink within 0.000001 m.
- PASS: reset returns geometry to neutral.
- PASS: 11 body blocking presets remain finite and bounded.
- PASS: 20 expected Action assets have finite keyed channels.
- PASS: master and four lighting scenes have 720p cameras at 24fps.
- PASS: all seven horror controls saved at zero.
- PASS: enabled horror variants finite with working wrist separation.
- PASS: horror visibility swaps work in render and viewport.
- PASS: saved dialogue and full-body clips evaluate finite with motion.
- PASS: drivers valid with resolvable targets.
- PASS: source .blend unchanged.

Character: 65 meshes, 7112 vertices, 12676 triangles.
Drivers checked: 197. Maximum full-blink/wide difference: 1.19441893e-07 m.

## Issues

- suggested 6000–12000 triangle budget: `12676`

## Preview art review

- The previews show a recognizable ordinary man in the green jacket, white collar, trousers and boots, with a restrained low-poly silhouette and diffuse shading.
- The rebuilt face has distinct nose, lips, eyelids and small human-proportioned eyes; it avoids photorealistic pores and modern glossy PBR skin.
- In the reviewed previews the neutral face reads somewhat mannequin-like: broad smooth cheek planes, straight dark brows, sparse painted facial variation and clean symmetry reduce the psychological-horror characterfulness.
- The hair has directional angular clumps, but its crown mass remains quite chunky; the large flat white collar also pulls attention from the face.
- Hair_Coverage_QA.png confirms the formerly visible light scalp gap near the right crown is closed in the tested three-quarter view.
- Shock_Clearance_QA.png shows a smooth chin-to-neck boundary during the tested open-jaw shock pose, with no earlier scalloped intersection visible. This frame does not establish every possible combined pose is collision-free.
- These current stills establish a suitable retro direction, not a full artistic match to the brief. Rendered animation acceptance is separate.

## Pending and limits

- Saved dialogue and full-body clips were sampled numerically. Rendered-frame review is recorded separately in Delivery_Acceptance.md; encoded-video checks are in Delivery_Manifest.json.
- Horror controls and swaps were tested numerically; rendered horror review is recorded in Delivery_Acceptance.md. No engine export is claimed.
- Bounded meshes do not prove every combined pose is collision-free. Extreme underarm deformation and shot-specific contacts still need animator polish.
- The raw body_rig.set_pose helper presets are not ground-corrected: crouch, kneel, sit, crawl and fall extend below Z=0. These helpers are separate from the saved Action assets; sampled FullBody_Test geometry stays above Z=0.

Full per-control, preset, weight and corrective measurements are in QA_Report.json.
