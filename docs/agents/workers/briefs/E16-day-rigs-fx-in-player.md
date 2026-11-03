# E16 (DeepSeek): day lighting rigs + FX in the panel player + render B01 and B11

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E08` (your registry, `loadSet`, unified exporter, panel player). Read `src/panel/README.md` and your latest reports.

## 1. Day rigs
The full-episode panel breakdown (another worker) found that the **apartment, café and KAMAZ cab only have a night rig**, but B05/B10 (apartment) are late morning/afternoon, B11–B13 (KAMAZ cab) afternoon, B15–B18 (café) late afternoon. Add `day`/`afternoon`/`late_afternoon` rigs in the registry (and lights in `loadSet`) for those sets: daylight through windows (cool sky fill + a warm low sun key where windows face it), interior practicals off or weak; keep the SH2 mood (dark corners, contrast). If a set's GLB lacks window light positions, place them from the window geometry. Render a day/night pair from each set's main cams → `out/sets/daynight-<id>.jpg`.

## 2. FX in the player
Copy the FX kit from `~/ms-workers/E09/episodes/EP01/threejs/src/fx/` (read-only there) into `episodes/EP01/threejs/src/fx/` here, extend `panels/schema.json`'s `fx` to the kit's effects (`breath, steam, smoke, snow, fogCards, dust, flicker, flashlight, headlights, heatShimmer, flash, shake, lensDirt`) with their options (anchor/actor attachment, seed, density…), and make the player create/update/dispose them deterministically per panel.

## 3. Render two more beats as stills
Write/adjust `panels/B01.json` (freight yard predawn: the guard, the wagon, the figure, flashlight spinning into gravel, the swinging key, steam pipe; **no spectacular kill**) and `panels/B11.json` (KAMAZ cab, afternoon: Ganaa offers his enamel tea bowl to Dasha; steam from the tea). Base them on the full breakdown in `~/ms-workers/E09/episodes/EP01/threejs/panels/B01.json` and `B11.json` (read-only; keep their line ids and durations, fix any anchor/cam that doesn't exist). Cast: use the current `assets/cast/*.glb` (yard-guard, ganaa; for the figure and Dasha use the closest existing actor: the cast is being rebuilt by another worker, so don't polish faces). Hero props: copy the needed GLBs from `~/ms-workers/E10/assets/props/hero/glb/` (enamel_bowl_tea, flashlight_lit, keys) into `assets/props/hero/glb/` here.
Contact sheets `out/panels/B01/contact.jpg`, `out/panels/B11/contact.jpg`; look at every frame and fix framing/scale/lighting (3 rounds).

## Rules
- No Blender needed except to re-export a set if you must add light empties (then via `bash .cache/e08/run_blender.sh` in the foreground). Never the Blender MCP.
- Write only in this worktree: `episodes/EP01/threejs/src/{sets,panel,fx}/**`, `panels/**`, `tools/**` (panel/set tools), `out/**`, `assets/props/hero/glb/**`, set GLBs if re-exported. No commits. Don't touch `AGENTS.md` or the cast.
- `npm test`, `stylized_check.mjs`, `panel-check.mjs`, `set-check.mjs` must pass.
- Final `## Report:` with files, commands + output, evidence, what still looks wrong.
