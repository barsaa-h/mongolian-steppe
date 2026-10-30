# T01 execution record

Approved spec: ../godot inputs and docs/agents/workers/briefs/T01-threejs-render-test.md.
Scope: only this folder; no actor/map edits, dependencies, commits or paid services.

- [ ] Load supplied GLBs; retain exact camera matrices and correct actor facing.
- [ ] Bake named per-bone quaternion offsets with two-bone limb aiming, interpolate with eased time, add deterministic life layers.
- [ ] Check seek determinism, skinning, distinct phases, hand travel/contact/withdrawal and camera conversion.
- [ ] Inspect preview frames, correct defects, capture 192 native frames at each resolution and encode.
- [ ] Measure adjacent-frame RGB differences, per-second differences, wall/render/capture timings; inspect strip and comparisons.

Artistic choices: camera-friendly three-quarter actor facing, simple red knitted prop, approximate mitten fitting, silent performance. No new character identities or asset regeneration.

## Outcome

- Animation layer and runner/analysis implementation prepared.
- Real hierarchy and algorithm tests: passed (compare/checks.txt).
- Fixed original-name lookup after confirming GLTFLoader strips dots.
- Browser capture: blocked before page creation by sandbox socket shutdown denial (compare/launch-errors.txt).
- Ruling: virtual-origin routing replaces local HTTP binding because the sandbox denies listening sockets; no asset duplication is needed.
- No motion metric, scene timings or visual acceptance. No synthetic scene evidence was substituted.
- No independent review or GPU run. Manager must inspect previews before full capture and review all uncommitted changes.

# M01 execution record

Approved design: M01 mocap/three.js brief supplied by the manager. All writes stay here; no commits or branch operations.

- [x] Inspect department plans, T01, camera input, BVH loader and real rig hierarchy.
- [x] Bake rest/world-frame retargeted CMU clips at 24 fps for all four actors; mirror the offer to RIGHT; scale child root travel.
- [x] Inspect CPU 3×4 source/target bone sheet; correct floor offset and shared hand contact.
- [x] Layer captured upper/lower body; preserve life layers, planted feet, guarded LEFT wrist, transfer, reach and withdrawal.
- [x] Test camera position and −Z direction; reconstruct actor-facing placement with Altan visible on the left.
- [x] Replace pixel differences with physical hand/head path speed, with CPU/page trace sources kept distinct.
- [x] Preserve T01 evidence; prepare direct canvas PNG capture, requested v2 output names, GPU lineup and ffprobe-verified MP4 path.
- [ ] Manager GPU: inspect neutral skinned lineup, S001/S004 at 4s, contact/wardrobe/prop defects, then capture full 1080p24 MP4, strip and Blender|T01|v2 board.

Partial delivery: Chromium cannot launch in the sandbox. Logs, numerical checks and measured hierarchy motion are in `compare/`; README gives exact manager commands and distinguishes existing T01 evidence from M01 diagnostics.
