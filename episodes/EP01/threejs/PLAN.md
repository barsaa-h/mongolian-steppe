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
