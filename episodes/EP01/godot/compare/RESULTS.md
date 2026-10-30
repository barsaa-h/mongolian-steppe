# G01 round 2 — B23 Godot scene ready for manager GPU run

**Worker scope complete: scene authored and checked headless. GPU timings and visual verdict are PENDING MANAGER RUN.** No Godot still or clip has been rendered in this sandbox. No display/GPU probe was repeated. The earlier `probe-*.log` files describe the previous round, not this scene's performance.

## Run outside the sandbox

From the worktree root, with the manager's normal display/GPU access:

```sh
bash episodes/EP01/godot/render.sh
```

The script sets `XDG_CONFIG_HOME`, `XDG_DATA_HOME` and `XDG_CACHE_HOME` below `episodes/EP01/godot/.godot-home/`. It copies the five upstream GLBs into ignored `imports/`, imports them headless, rebuilds the scene, validates it, then runs GPU captures sequentially. No Blender, paid API, installation, Git operation or source-asset edit is involved. `GODOT` can override the executable; it defaults to `/home/barsaa/.local/bin/godot` (tested version `4.7.2.stable.official.ed1daf0bf`). Python/Pillow, ffmpeg/ffprobe, GNU time and timeout are already installed.

Every job writes `compare/logs/<step>.log` and a wall-clock measurement in `compare/timings.txt` (TSV). Failed jobs do not prevent later jobs. The runner exits nonzero after all jobs if anything failed. Each GPU process has a timeout; raw captures remain in ignored `out/` for diagnosis. Fresh capture targets are cleared before each attempt so a failed render cannot reuse an old image/video. Encodes are skipped after a failed capture.

Stills seek directly to 4.0 s, wait three GPU draw completions, save a viewport PNG and quit. Clips use Movie Maker AVI, `--fixed-fps 24`, a 192-frame command-line guard and the scene's own 8 s auto-quit. ffmpeg makes silent H.264/yuv420p MP4s at CRF 18, with Rec.709 tags and faststart. Output checks require the exact requested dimensions and 192 frames / 24 fps / 8 s. Timing includes scene/resource startup and movie writing; encode time is a separate row. It is a cold-process offline benchmark, not a claim of interactive viewport fps.

## Expected output evidence (not present until manager renders)

| Output under `compare/` | Capture |
| --- | --- |
| `B23_S001_godot.png` | Forward+ / Vulkan, 1920×1080, S001 at 4 s |
| `B23_S004_godot.png` | Forward+ / Vulkan, 1920×1080, S004 at 4 s |
| `B23_S001_godot.mp4` | Forward+ / Vulkan, 1920×1080, 8 s |
| `B23_S001_godot_540p.mp4` | Forward+ / Vulkan, 960×540, 8 s |
| `B23_S001_godot_540p_mobile.mp4` | Mobile / Vulkan, 960×540, 8 s |
| `B23_S001_godot_540p_opengl3.mp4` | Compatibility / OpenGL 3, 960×540, 8 s |
| `compare_B23.png` | Two labelled rows, Blender left / Godot right, S001 then S004 |
| `timings.txt` | All steps, seconds, exit codes, frame count and effective capture fps |

The OpenGL job explicitly selects `gl_compatibility` as well as `opengl3`; it is a fallback-renderer test, not Mobile running on OpenGL. The comparison labels Godot's Forward+ 1080p clip wall time divided by 192 as seconds/frame. The supplied Blender images have no measured timing metadata, so their labels say **time/frame not supplied**. The brief's approximate Blender 7–8 s/frame figure is not a new benchmark measured here.

## Timings — PENDING MANAGER RUN

Fill from `timings.txt` after checking each job's exit code and its GPU/device log. Do not use software-device results as Iris Xe timings without explicitly labelling them.

| Renderer / driver | Resolution | Frames | Render wall seconds | Effective fps | Encode seconds | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Forward+ / Vulkan | 1920×1080 | 192 | **PENDING** | **PENDING** | **PENDING** | Not GPU-run |
| Forward+ / Vulkan | 960×540 | 192 | **PENDING** | **PENDING** | **PENDING** | Not GPU-run |
| Mobile / Vulkan | 960×540 | 192 | **PENDING** | **PENDING** | **PENDING** | Not GPU-run |
| Compatibility / OpenGL 3 | 960×540 | 192 | **PENDING** | **PENDING** | **PENDING** | Not GPU-run |
| Forward+ S001 still | 1920×1080 | 1 | **PENDING** | — | — | Not GPU-run |
| Forward+ S004 still | 1920×1080 | 1 | **PENDING** | — | — | Not GPU-run |

## Scene and artistic choices

`scenes/B23_S001.tscn` instances the original apartment and four actors. `tools/build_scene.gd` is its reproducible authoring source. Imported GLBs and extracted textures are local copies, not alternate character masters. DNA, facial identity, topology and shared rigs are unchanged.

- Ganaa uses `ANCHOR.GANAA_MITTENS`; Altan uses `ANCHOR.ALTAN_MITTENS`. They face one another. Two background guests use `ANCHOR.GUEST_LIVING_2` and `_3` to stand behind the exchange (artistic staging choice).
- A non-looping `AnimationPlayer` clip, `B23_Mitten_Offer`, has keys at 0, 4 and 8 s. Ganaa crouches through root lowering and bent hip/knee bones, with feet retained near the floor. His right hand makes a small offer/lift and returns; the left wrist stays behind and away from Altan. Altan reaches forward; guests lower their rest-pose arms. This is a minimal rig/blocking test, not finished performance animation.
- The offered red mitten and gauze are scene-owned `BoneAttachment3D` nodes linked to `wrist.R` and `wrist.L`. They survive packing/reloading and follow each sampled pose. The second red mitten is at `ANCHOR.MITTEN_2_TABLE`. Rib meshes suggest knitting; they are simple shot props.
- Altan's existing paper crown and `Clothes_BirthdaySkirt` import are retained. No actor regeneration or identity approval is implied.
- The existing table, cake, three candles, plates and cups are reused. Added dressing: tablecloth with side drops, three emissive candle flames and one small candle light, six muted balloons and strings, a visible ceiling bulb.
- Lighting choices: shadowed warm ceiling OmniLight, cool window fill and warm hall bounce; warm ambient fill, Filmic tonemapping, SSAO and candle glow. A screen shader adds subtle deterministic grain and vignette. No volumetric fog: the indoor birthday test does not need it. Renderer feature parity and shader appearance await GPU inspection.
- All JSON anchors are included as converted markers. Both requested cameras come directly from the JSON, with no framing changes. No dialogue, music or lip-sync was added; the render test is silent.

## Camera conversion — checked against JSON

Blender point `(x, y, z)` becomes Godot `(x, z, -y)`. The same rotation premultiplies all three camera basis columns; the camera's local -Z viewing convention is preserved. At 16:9, vertical FOV is `2 atan((sensor_mm / (16/9)) / (2 lens_mm))` with `KEEP_HEIGHT`.

| Camera | Blender location | Godot location | Vertical FOV |
| --- | --- | --- | --- |
| CAM_B23_S001 | (0.28, 0.95, 0.78) | (0.28, 0.78, -0.95) | 32.2688° |
| CAM_B23_S004 | (0.30, 0.70, 1.10) | (0.30, 1.10, -0.70) | 32.2688° |

Validation compares all three basis columns and position within 0.00001 and FOV within 0.0001°. At 0/4/8 s, Ganaa's head-bone height is 1.0263 m; his left-wrist distance to Altan's floor mark is 1.0402 m, versus 0.5945 / 0.6145 / 0.5945 m for the right wrist. These distances establish asymmetric blocking, not visual proof of occlusion or skin/cloth collision clearance.

## Import findings and headless evidence

Evidence: [`../diagnostics/validation.json`](../diagnostics/validation.json), [`logs/build.log`](logs/build.log), [`logs/validate.log`](logs/validate.log), [`logs/inspect-imports.log`](logs/inspect-imports.log), [`logs/runtime-8s.log`](logs/runtime-8s.log), [`logs/runtime-S004.log`](logs/runtime-S004.log), [`logs/runner-self-test.log`](logs/runner-self-test.log).

| Import | Rig | Meshes with morph targets | Technical source clips |
| --- | --- | --- | --- |
| Ganaa | 137 bones | 27 | Deformation_Check, Talk_Check |
| Altan | 137 bones | 14 | Deformation_Check, Talk_Check |
| party-guest-01 | 137 bones | 14 | Deformation_Check, Talk_Check |
| party-guest-02 | 137 bones | 14 | Deformation_Check, Talk_Check |

All seven additive `EXP.*` targets remain on each actor: smile, frown, blink and A/E/O/M visemes. All 14 named bones required by the body pose exist on every actor. The saved clip has 549 tracks with three keys each; midpoint motion and recovery at 8 s are checked. Source test clips are retained but not autoplayed. Morph retention is evidence for a future face-animation converter; no Mongolian phoneme accuracy, deformation quality or final lip-sync readiness is claimed.

Skin diffuse/normal maps, eye texture, fitted costume meshes and hair alpha materials import as Godot resources. Skin has an albedo texture and an enabled normal map; hair uses transparency and an albedo texture. The eye-region wetline material is a separate untextured material. Actual hair sorting, skin shading, eyes, shadows and blend-shape deformation must be inspected on GPU. Blender-specific subsurface scattering and procedural material layers do not have a demonstrated visual match here.

The first headless import requested tangent generation for solid-color accessory meshes without UVs. Project-local import settings now disable **extra** tangent generation and automatic LOD generation; the supplied UVs, normals, existing tangents and source geometry are retained. The subsequent import completed with exit 0 and no UV/tangent errors. This sandbox denies the editor's TCP listeners, so `logs/import.log` contains `_sock == -1` / `ERR_CANT_CREATE` editor socket messages despite successful imports. The saved scene build, validation and normal headless runtime logs have no script/resource errors. No GPU/display claim is made from a headless run.

The runner failure-isolation self-test uses an explicitly failing Godot stub in an automatically removed `out/runner-test-*` directory. It confirmed nine Godot jobs were attempted despite failures (import/build/validate, two stills, four clips), all render variants logged timings, encodes skipped failed captures, comparison still attempted, and final exit 1. It did not create fake scene images or videos. The comparison's separate in-memory self-test checked the two-row image layout.

## Visual verdict — PENDING MANAGER INSPECTION

**PENDING:** Inspect both Godot stills, the contact sheet and all renderer variants before making a quality or renderer decision. The worker viewed the supplied Blender S001 reference only; there are no worker-generated Godot frames to inspect.

Record:

- Warm family flat versus dark basement: **PENDING**.
- Faces readable, eyes correct, skin non-waxy: **PENDING**.
- Hair alpha/shadows and cherry dress intact: **PENDING**.
- Right mitten reads and makes plausible hand contact: **PENDING**.
- Left wrist concealed from Altan; no foot/cloth/body collisions: **PENDING**.
- Grain, glow, SSAO, vignette and fallback differences: **PENDING**.
- Camera/framing match and honest quality tradeoff versus Blender: **PENDING**.
- Speed/quality recommendation for the full pipeline: **PENDING**.

## Full pipeline conversion work still needed

1. Automate the manager's Blender camera/anchor export, including sensor fit, render aspect, focal length and animated transforms; keep the coordinate conversion covered by these checks.
2. Re-export the current room/actors upstream when authoring assets change; keep scene-local import settings and preserve skinning, morphs and named bones. This test copies existing GLBs; it never edits their sources.
3. Convert Blender actions/shot timing to Godot clips or glTF animations, including hand grips, props, root motion, contacts and door state. This 8 s offer is authored in Godot and is not a conversion of the whole birthday edit.
4. Map the approved look and Blender material layers to renderer-supported Godot materials/lights, with separate GPU image review for skin, eyes and transparent hair. Benchmark with the measured hardware/device stated.
5. After recorded voices exist, convert the additive face tracks and retime shots. No new character pipeline or estimated-text lip-sync is needed.

Department task tables outside `episodes/EP01/godot/` were not edited because the worker brief permits this folder only. Character/design approval, shot approval, GPU timings and the production renderer choice remain with the manager/human.

References used for engine APIs: [Movie Maker](https://docs.godotengine.org/en/4.5/tutorials/animation/creating_movies.html), [external skeleton bone attachments](https://docs.godotengine.org/en/4.6/classes/class_boneattachment3d.html).
