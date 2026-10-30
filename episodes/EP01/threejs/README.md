# T01 — B23 three.js movement test

**Status: blocked at Chromium launch. No rendered evidence or performance/quality acceptance.**
All work is uncommitted and confined to this directory. No original GLB, Godot file, package manifest, production plan or source was changed. No Blender or paid service was used.

## Run on the manager's machine

```sh
node episodes/EP01/threejs/anim.test.mjs
python3 episodes/EP01/threejs/analyze.py --self-test
node episodes/EP01/threejs/render.mjs --preview
node episodes/EP01/threejs/render.mjs
node episodes/EP01/threejs/render.mjs --gpu
```

The last line is the exact GPU timing command. It selects ANGLE Vulkan and refuses a reported SwiftShader/llvmpipe device. Set `CHROMIUM_EXECUTABLE_PATH` if the automatically discovered cached Chromium is unsuitable. `PLAYWRIGHT_MODULE` can override the repository's existing Playwright runtime path. The capture runner serves a virtual local origin through Playwright routing, so it does not need a listening web server. For interactive playback, serve the repository root and open `/episodes/EP01/threejs/`.

`--preview` writes five 960×540 stills and joint diagnostics under ignored `out/`; inspect them before an expensive full pass. The default and GPU runs capture 192 **native 1920×1080** frames and 192 **native 960×540** frames, with device scale 1. No resolution scaling is used at capture. `ffprobe` asserts width, height, frame count and 24 fps. The page exposes `renderFrame(i, shot='S001')` and always sets t=i/24; it does not depend on elapsed playback time. Frames are PNGs under ignored `out/`. GPU videos have `_gpu` suffixes; comparison stills show the most recent completed run.

The runner checks all 192 posed frames for finite sampled skinned vertices, repeatable seek, full rigs, hand travel and camera positions before capture. These browser checks have **not run**. Render timing includes pose, postprocessing and `gl.finish`; capture wall time additionally includes screenshots and disk output. Launch/load/compile and encoding have separate entries. Analysis measures adjacent decoded RGB frames at the same 960×540 size for both engines and emits eight per-second bins. Grain is static, to avoid inflating motion by changing pixel noise. Its acceptance guard requires at least 2× the newly measured Godot baseline; this is an explicit operational interpretation of “far above,” not an artistic approval.

## Actual checks and blocker

`node anim.test.mjs`: exit 0; synthetic limb/pose checks and all four real rig hierarchies pass. The real GLB hierarchy is parsed with mesh references removed **in memory only**, so these tests exercise bones and transforms, not mesh deformation or material loading.

```text
ANIM_OK: ease bounds, two-bone contact, repeatable seek, normalized quaternion
REAL_RIG_OK ganaa 137 joints, contact error < 0.1 mm, pose restore, life finite
REAL_RIG_OK altan 137 joints, contact error < 0.1 mm, pose restore, life finite
REAL_RIG_OK party-guest-01 137 joints, contact error < 0.1 mm, pose restore, life finite
REAL_RIG_OK party-guest-02 137 joints, contact error < 0.1 mm, pose restore, life finite
METRIC_OK: synthetic alternating black/white, 191 differences, eight second bins >250/255
```

`node --check src/shot.js` and `node --check render.mjs`: exit 0. The metric test encodes a temporary, explicitly synthetic alternating black/white clip, verifies its measurement, then deletes it. It is not scene evidence.

`node render.mjs --preview`: exit 1. Initial server binding was denied (`listen EPERM`). Replaced the server with in-process request routing. The configured Playwright wanted missing browser revision 1234; discovery now finds installed revision 1248. With that installed binary, both preview and final capture attempts exit 1 **before a page opens**:

```text
FATAL:content/browser/sandbox_host_linux.cc:41
Check failed: . shutdown: Operation not permitted (1)
browserType.launch: Target page, context or browser has been closed
```

`compare/launch-errors.txt` contains the real final launch log. `compare/timings.txt` records failure rather than invented timings. No GPU pass was attempted.

| SwiftShader pass | Frames rendered | Render s/frame | Capture s/frame |
| --- | ---: | ---: | ---: |
| 1920×1080 | 0 | unavailable — launch blocked | unavailable |
| 960×540 | 0 | unavailable — launch blocked | unavailable |

Scene motion metric and per-second motion: **unavailable**. The brief's ~1.5/255 Godot figure is not a measurement from this worker. Requested MP4s, stills, comparison board and motion strip do not exist; `analyze.py` will produce the latter two and motion JSON/TSV after a successful capture.

## Implementation and import findings

- `src/anim.js`: named per-bone quaternion offsets from each rig's rest pose, eased blending, separate deterministic breathing (3.2–3.9 s), hip sway, target head rotation, existing `EXP.blink` and seeded hand drift. Limb targets are solved against actual joint origins, avoiding assumptions about MPFB local axes.
- **Confirmed and fixed by real-hierarchy tests:** GLTFLoader sanitizes dotted joint names (`wrist.R` etc.). The animation dictionary uses `userData.name`, the preserved original name. Candle lookup uses the same original-name convention.
- `src/shot.js`: unchanged exported camera matrices with Blender Z-up → glTF Y-up conversion; the two-shot is not reframed. Actor-facing angles are an **artistic camera cheat**, intended to expose Altan's face as in the Blender references. Facing is **not visually verified**.
- Art choices: approximately 0.5 m crouch, a red ribbed mitten with a handoff blend at 3.25–3.5 s, half-step and catch-up foot motion, two-hand fitting gesture, then Ganaa's left-hand withdrawal. Left hand has separate low/back targets. Blinks use only additive expression morphs. Guest poses use staggered gestures and 3/6.5 s cup lifts. Source technical clips are retained but never played.
- Local room dressing adds a ceiling slab because the exported room has no ceiling, tablecloth, balloons, bulb and candle glows. Warm shadowed point light, blue window light, fill, ACES, static fine grain and vignette are included. SSAO was deferred: its cost and appearance cannot be judged before a basic render works.
- Source GLTF materials/maps and all skinned clothing are retained. **No green-jacket fix is claimed:** texture loading, lighting, sleeve coverage, transparency, skinning and colour require a real frame. No source character was regenerated or approved.

## Quality verdict and engine choice

**Unassessed.** I inspected the supplied Blender/Godot comparison, but could not inspect any three.js frame or playback. The code is a handoff candidate, not an accepted shot. The intended contact, cup grip, mitten fitting, facial visibility, withdrawn left wrist, shoulders, wrists, clothing penetration and foot planting must be checked in the preview and motion strip.

I would keep Blender for final hero animation/close shots under the production plan and treat three.js as a deterministic preview/render candidate. There is no measured basis from this run to rank three.js against Godot for speed or image quality. Body motion must be authored in any engine.
