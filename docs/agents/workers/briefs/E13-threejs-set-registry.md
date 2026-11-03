# E13 (DeepSeek): put every EP01 set into three.js, the way the episode will render it

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E08`. The episode renders in **three.js** (`episodes/EP01/threejs/`; read `PLAN.md`, `README.md`, `src/panels.js`, `src/look.js`, `src/camera.js`, `render-panels.mjs`). The sets were built in Blender by several workers and exported as GLBs, but **nobody has looked at them in three.js yet.** Blender lights and Eevee fog don't come through glTF the same way, so the sets may look nothing like their Eevee previews. That's your job.

## Sets (all already copied into this worktree)
`assets/maps/episode-1/glb/`: `EP01_Cafe_ps2.glb`, `EP01_Apartment_ps2.glb`, `EP01_FreightYard_ps2.glb`, `EP01_Market_ps2.glb`, `EP01_Shop_ps2.glb`, `EP01_Dispatch_ps2.glb`, `EP01_Border_ps2.glb`, `EP01_HospitalGate_ps2.glb`, `EP01_LivestockRoad_ps2.glb`; and `assets/props/kamaz/glb/KAMAZ_intact.glb`, `KAMAZ_disabled.glb`. (Market and border are still being polished elsewhere; newer copies will replace these files later, so read everything from the GLB itself, never hard-code geometry.)

## Build
1. **`episodes/EP01/threejs/src/sets/registry.json`**: one entry per location id (`cafe`, `apartment`, `freight_yard`, `market`, `shop`, `dispatch`, `border`, `hospital_gate`, `livestock_road`, plus `kamaz_cab` using the KAMAZ GLB): `glb`, `anchors` (every `ANCHOR.*` node name found in the GLB, with world position), `cams` (every `CAM.*` node: position, target/quaternion, fov from the glTF camera if present), `lightRig` and `fog` presets (below), and `notes`.
2. **`episodes/EP01/threejs/src/sets/loadSet.js`**: `loadSet(scene, id, {time})` loads the GLB and returns `{root, anchors, cams, lights}`. It must:
   - apply the PS2 texture rule used by `panels.js` (filtered textures, not PSX), shadows on;
   - recreate the lighting per set in three.js from the registry's `lightRig` (glTF `KHR_lights_punctual` lights if exported: check intensities, Blender watts → three.js candela usually need rescaling; plus emissive practicals: lamp bulbs, windows, signs);
   - apply fog per set (FogExp2 colour/density) and background;
   - support `time` variants where the set has them (market morning/midday, border morning/late, shop day/evening).
3. **`episodes/EP01/threejs/tools/set-stills.mjs`**: renders, for every set, a still from **each `CAM.*`** through the episode look (`createLook` from `src/look.js`) at 960×540, and writes `episodes/EP01/threejs/out/sets/<id>/<cam>.png` + a contact sheet per set + one overview sheet `out/sets/all-sets.jpg`. Use headless Chromium like `render-panels.mjs` does (GPU: `--use-angle=vulkan --enable-features=Vulkan --ignore-gpu-blocklist`; the shell is at `~/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`, Playwright at `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`). If the GPU won't start in your sandbox, fall back to SwiftShader and say so.
4. **Compare** each three.js still to that set's Eevee preview (paths: `assets/maps/episode-1/previews/<set>-ps2/` in the original worktrees under `~/ms-workers/E02, E06, E07, E09, E10, E08` (read-only for you)). Tune `lightRig`/`fog` so the three.js version keeps the mood: dark Silent Hill 2 interiors with motivated practicals, foggy exteriors. Write `out/sets/compare-<id>.jpg` (Eevee | three.js side by side).
5. A test `episodes/EP01/threejs/tools/set-check.mjs` (node, no browser): every registry GLB exists and parses, every listed anchor/cam exists in its GLB, no GLB has preview-only nodes (`Preview.*`, `StandIn.*`), no traffic-light names.

## Report the GLB problems you find
Missing textures, black materials, lights that didn't export, cameras missing, wrong scale/orientation, huge files, alpha problems (frost, fog cards, smoke). List them per set in `out/sets/report.md`, fixable in three.js (fix it in `loadSet`) vs needs a Blender re-export (just report).

## Rules
- No Blender needed. If you must inspect a GLB, use node (parse the JSON chunk) or three.js. Never the Blender MCP.
- Write only `episodes/EP01/threejs/src/sets/**`, `episodes/EP01/threejs/tools/set-stills.mjs`, `tools/set-check.mjs`, `episodes/EP01/threejs/out/sets/**`. Don't modify the GLBs or other source files. No commits. Don't touch `AGENTS.md`.
- `npm test` must still pass.
- Look at every still. At least 3 render → look → tune rounds.
- Final `## Report:` with files, commands + output, evidence (all-sets sheet + compare sheets), and the per-set problem list.
