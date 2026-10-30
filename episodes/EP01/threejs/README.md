# M01 — B23 mitten shot v2, real CMU mocap

Status: implementation and CPU checks complete; **visual/render delivery is partial**. Chromium exits before opening a page in this worker's sandbox (`sandbox_host_linux.cc:41`, `shutdown: Operation not permitted`). No v2 MP4, skinned lineup or rendered v2 comparison is claimed. Existing `*_three*` images/videos are T01 evidence and remain untouched.

All changes stay in this directory, uncommitted. No actor, source BVH, package manifest, production plan or original story was edited. No Blender, paid service or new dependency was used.

## Manager commands

Run from repository root:

```sh
node episodes/EP01/threejs/tools/bake_mocap.mjs
node episodes/EP01/threejs/tools/retarget_check.mjs
node episodes/EP01/threejs/tools/performance_check.mjs
node episodes/EP01/threejs/anim.test.mjs
python3 episodes/EP01/threejs/analyze.py --self-test
python3 episodes/EP01/threejs/analyze.py --node
node episodes/EP01/threejs/tools/retarget_check.mjs --gpu
node episodes/EP01/threejs/render.mjs --gpu --preview
node episodes/EP01/threejs/render.mjs --gpu
```

The last line is the exact full GPU render command. Inspect the preceding skinned lineup and preview first. Default `render.mjs` uses SwiftShader; `--gpu` selects ANGLE Vulkan and rejects a software device. `CHROMIUM_EXECUTABLE_PATH` and `PLAYWRIGHT_MODULE` retain T01's overrides. No HTTP listener is necessary: Playwright routes a virtual origin to repository files. For interactive playback, serve the repository root and open `/episodes/EP01/threejs/`.

The render command produces:

- `compare/B23_S001_v2.mp4`: 192 native 1920×1080 frames at 24 fps, ffprobe assertions; also `_540p.mp4`.
- `compare/B23_S001_v2.png` and `B23_S004_v2.png`: frame 96, **t=4s**.
- `compare/compare_B23_v2.png`: Blender v0.1 | preserved T01 | v2, S001 and S004. Prior reference/T01 frames are labeled with their differing/unspecified times.
- `compare/B23_v2_motion_strip.png`: one frame per second, 0–7s.
- `compare/joint-motion-page.json` and `joint-motion-metrics.json`: actual page joint traces and metres/second.
- `compare/timings_v2_gpu.txt`, `device_v2_gpu.json`, `validation-v2.json`.

Canvas PNG data are captured directly with `toDataURL`, avoiding Playwright screenshots. Speed improvement is **unmeasured** here. Render timing includes `gl.finish`; capture wall time includes PNG serialization and disk writes. Preview and each lineup panel are 960×540. Full capture writes PNGs under ignored `out/`, inside the worktree.

## Retargeting

`src/retarget.js` loads no renderer and works in Node and the browser. `tools/bake_mocap.mjs` parses the supplied BVHs using the installed three.js `BVHLoader`. All 11 names are baked at 24 fps as genuine THREE.AnimationClip JSON; Ganaa's canonical clips live directly under `clips/`, and the three other rigs have their own rest/proportion-correct variants. `clips/manifest.json` records source, time range, hip ratio, floor correction, heading, mirror and bone map. The first 0.25s of capture calibration is omitted. Source clips remain unchanged.

Bone map (target → CMU):

| MPFB | CMU |
| --- | --- |
| root | Hips |
| spine05, spine03, spine01 | LowerBack, Spine, Spine1 |
| neck01, neck02, head | Neck, Neck1, Head |
| clavicle.L/R | Left/RightShoulder |
| upperarm01.L/R | Left/RightArm |
| lowerarm01.L/R | Left/RightForeArm |
| wrist.L/R | Left/RightHand |
| upperleg01.L/R | Left/RightUpLeg |
| lowerleg01.L/R | Left/RightLeg |
| foot.L/R | Left/RightFoot |

MPFB's extra shoulder, twist, pelvis, intermediate spine and finger bones keep their local rest transforms. Original dotted names are read through `userData.name`; baked track bindings use GLTFLoader's sanitized node names.

For each mapped bone, align its target rest direction to the CMU rest direction with a rest calibration quaternion `C`. Then compute `targetWorld = headingInverse × sourceWorld × inverse(sourceRestWorld) × C`, convert through the **current target parent's inverse world rotation**, and normalize. This also handles MPFB's intermediate bones and its A-pose versus CMU's T-pose. The first moving hip heading establishes forward +Z. The rest world frame preserves roll while anatomical segment directions correct the rest-pose swing. This is not a direct local-quaternion copy.

Root translations use the target/source standing hip-height ratio. Altan's hip is 0.4570m versus Ganaa's 0.9189m: her root travel is **0.49737×** his for the same source. No actor mesh is rescaled. A constant per-clip vertical correction puts the lowest toe at its authored floor clearance, retaining captured vertical changes; shot-specific IK locks planted ankles. Baked reusable walk clips retain their scaled travel; this stationary shot pins horizontal root placement and removes captured heading turns, while retaining captured hip pitch and roll.

Baked sources:

```text
kneel       23_03       hand_over    22_13 (mirrored to offer RIGHT)
take_object 23_13       converse_A   18_08
converse_B  19_08       sip          137_26
laugh       13_14       wait_normal  137_28
wait_old    137_32      walk         136_20
sit_talk    86_15
```

## Shot performance and facing

`src/motion.js` is shared by the page and the Node check. Ganaa's lower body samples the kneeling section of 23_03; his upper body uses the mirrored soda pass from the start, avoiding the comforter's sideways torso lean. Altan uses her scaled standing capture plus the receive upper body. Guests layer conversation/sip on different idle phases. Crossfades are 0.4–0.5s. Existing breathing, blink and wrist life are additive; head look-at follows the other actor. IK corrects hand contact, Ganaa's guarded LEFT arm and its withdrawal, Altan's approximate hand-to-hand fitting and reach, and planted feet. Wrist world rotations from mocap survive the IK correction. Guest 2's captured sip gets a hand-to-mouth contact correction at 4.1–6.9s. These contact targets and their timing are artistic choices; captured joint rotations provide the base body performance.

The red mitten is truly parented to the holder's RIGHT wrist and changes parent at frame 84 (3.5s). Both grip transforms are calibrated from the same world-space prop position/orientation at transfer, avoiding an attachment jump. The cup is parented to guest 2's right wrist with a calibrated initially upright frame.

**Facing diagnosis:** the camera conversion in T01 was already correct. Blender cameras and three.js both view local −Z with +Y up, so the world matrix is left-multiplied by `Rx(-pi/2)`; conjugating it would be wrong. Tests verify the converted camera forward vector as well as position (rotation vector error <1.3e-8). MPFB faces +Z, as shown by eye/head rest landmarks. T01's Altan yaw 1.48 points away from the camera. Also, the supplied standing marks put the actors almost on one camera ray; facing Altan directly toward Ganaa on those marks exposes her back.

Artistic reconstruction: move Ganaa 0.75m toward the front of the room, in three.js +Z, while leaving cameras and Altan's mark unchanged. Derive both yaws from their new relative positions. At t=4s the projection puts Altan left of Ganaa and her face toward the camera in S001 and S004 (face/camera dots about 0.226 and 0.377). The original Blender shot/evaluated actor transforms are **not supplied**, so this is a reference-guided reconstruction, not a claim that those transforms were recovered. Pixel/composition matching still needs the GPU comparison.

## Checks actually run and inspected

- Bake: 44 actor-specific clips, 11 canonical names, 24 fps. See `compare/bake-log.txt`.
- Real rig tests: all four 137-joint hierarchies; original names, limb contact, repeatable seek and life. These load hierarchy/skin joint declarations only, without textures or mesh buffers.
- Retarget check: all clip samples finite, normalized quaternions and uniform 24 fps; ankle origins above floor; upper/lower limb directions match CMU at three sampled times within 0.002rad (observed maximum about 0.000046rad). See `compare/retarget-check.txt` and `.json`.
- **Inspected** the 3×4 CPU bone sheet, `compare/retarget_skeleton_lineup.png`: orange MPFB, cyan CMU, three times per clip. `retarget_lineup.png` is currently the same explicitly labeled diagnostic. The GPU lineup command replaces that requested filename with neutral-material skinned actors plus cyan CMU figures. Bone drawings cannot prove wrist skin deformation or clothing contact.
- Initial lineup findings fixed: rest-axis mismatch addressed with direction/rest-world calibration; original left-handed pass mirrored to RIGHT; initial feet hovered by roughly 5–10cm, corrected with a per-clip floor offset. A stricter gaze test also caught a bad head landmark: MPFB special01 points backward, not up; head calibration now preserves the authored frame. Starting Ganaa's upper pass immediately avoids a sideways comforter lean during the initial blend. First handoff gap ~5.4cm, reduced to below 0.01mm by choosing a jointly reachable contact. Knees remain above floor in the shot; planted ankle drift is below 0.01mm in the hierarchy check. Full visual elbow/wrist acceptance remains open.
- Shot: 193 samples including the exact 8s endpoint; deterministic seek; contact <2.5cm (observed ~0.003mm); LEFT withdrawal ~20.1cm; knee minimum ~5.8cm; finite world joints; whole-shot partner gaze error <0.05rad (observed <0.000003rad). See `compare/performance-check.txt` and `camera-check.json`.
- esbuild bundles both browser entry points successfully into ignored `out/build/`; syntax checks pass. No full repository build/test was run because it is outside this isolated change's verification scope.
- Metric self-check: synthetic 1m/s joint motion produces eight 1m/s bins; still joints produce zero. No synthetic rendered scene is used as evidence.

CPU hierarchy joint-motion means (mean path speed of head and both wrists): Ganaa ~0.079m/s, Altan ~0.079m/s, guest 1 ~0.196m/s, guest 2 ~0.232m/s; see `compare/joint-motion-node-metrics.json` for exact current values and eight per-second bins. These use the same poses and seeds as the page but are **not browser measurements**. A successful full render logs and analyzes its own page traces; adjacent pixel differences and the old Godot ratio are removed.

## Remaining limitations

Chromium launch blocks all browser visual checks and v2 image/video delivery here. Inspect the neutral skinned lineup, both preview cameras and full playback on the manager's GPU before acceptance. Candy-wrapper wrists, sleeve coverage, elbow silhouettes, hand/mitten mesh overlap, cup grip/tilt, foot soles and room occlusion are not visually verified. Fingers retain the supplied rest pose rather than closing around props. Toddler timing is an approximation from adult capture, scaled to child proportions; fitting the mitten is approximate IK. The reconstructed actor placement may need adjustment against the Blender reference. There is no voice, lip sync or sound in this silent test.
