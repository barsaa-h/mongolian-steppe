# FX01 (DeepSeek): three.js atmosphere + FX kit for the motion comic

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E09` (you built the market street here; your final GLB is `assets/maps/episode-1/glb/EP01_Market_ps2.glb`). EP01 renders in **three.js** as a Silent Hill 2-style "living panels" motion comic: each panel is a composed frame held 2–8 s, and it must **never look frozen**. Read `episodes/EP01/threejs/PLAN.md`, `README.md`, `src/look.js`, `src/panels.js`, `render-panels.mjs`. Use SH2 *techniques* only, never its assets.

## Build `episodes/EP01/threejs/src/fx/` (ES modules, three r186 as in the repo, no new npm deps)
Each effect: `create<Name>(scene, opts) → { update(t, dt), dispose(), group }`, deterministic from a `seed` (frame-exact re-renders: same t → same image), cheap enough for 1080p24 on an integrated GPU.
1. **breath** — cold-breath vapour puffs from a mouth anchor (Object3D), timed by `rate` or explicit `puffAt` times; soft sprite, rises and fades in ~1.2 s.
2. **steam** — a column/plume from a point (heating pipe, kettle, tea bowl, manhole): rising, curling, wind-bent, density/colour options.
3. **smoke** — chimney/stove-pipe coal smoke, darker, wider, slow.
4. **snow** — falling snow in a camera-attached volume (only what the camera sees), density/wind/flake size; plus **blowing ground snow** drift near the floor.
5. **fogCards** — drifting layered fog sheets for depth (SH2's moving fog), soft-particle fade where they meet geometry (depth-aware) and the camera.
6. **dust** — floating dust motes in a light beam (interiors).
7. **flicker** — wraps an existing light (point/spot) + optional emissive mesh: tungsten wobble, fluorescent stutter (on/off bursts), dying-bulb modes.
8. **flashlight** — a spotlight cone with a visible soft beam (volumetric-looking cone mesh), handheld sway, swing/spin mode (the guard's flashlight spinning into gravel in beat 01).
9. **headlights** — a pair of beams + glow sprites for a vehicle node, with fog scattering look.
10. **heatShimmer** — a screen-space distortion region (exhaust, stove top) usable as a post pass or a local quad.
11. **lensDirt / grain / flash** — a flash frame (white/red hit for action bursts), a camera shake helper (seeded), and a film grain/dirt overlay if `look.js` doesn't already provide them (reuse `look.js` when it does; don't duplicate).

## Demo + stills
- `episodes/EP01/threejs/tools/fx-stills.mjs`: renders (headless Chromium; GPU flags `--use-angle=vulkan --enable-features=Vulkan --ignore-gpu-blocklist`; shell `~/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`; Playwright `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`) each effect in a small test scene **and** in your market set GLB (load it with GLTFLoader directly: snow + fog cards + chimney smoke + breath on a placeholder head at a bus-stop spot + steam from a manhole), through the episode look (`createLook`).
- For each effect write a 6-frame strip at t = 0, 0.4, 0.8, 1.2, 1.6, 2.0 s (`out/fx/<name>-strip.jpg`) so motion is visible in stills, plus `out/fx/market-atmosphere.jpg` (3 frames) and a 4-second 24 fps clip `out/fx/market-atmosphere.mp4` (ffmpeg; this is a motion test, allowed here).
- `episodes/EP01/threejs/tools/fx-check.mjs` (node): determinism (render the same t twice → identical pixels for 2 effects, via the page), every module exports the API, no NaN positions after 600 updates.

## Rules
- No Blender needed. Never the Blender MCP.
- Write only `episodes/EP01/threejs/src/fx/**`, `tools/fx-stills.mjs`, `tools/fx-check.mjs`, `out/fx/**` (and a page under `out/fx/` if you need one). Don't change `look.js`, `panels.js` or other sources. No commits. Don't touch `AGENTS.md`.
- `npm test` must still pass.
- Look at every strip. At least 3 render → look → tune rounds; the effects must read as real cold air, steam, snow and fog in 1998 Mongolia, not as game particles (no hard sprite edges, no visible tiling, no uniform spacing).
- Final `## Report:` with files, commands + output, evidence, and what still looks wrong.
