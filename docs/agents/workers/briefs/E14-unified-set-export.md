# E14 (DeepSeek): one exporter for all EP01 sets (lights, anchors, cameras survive into three.js)

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E08`, right after your E13 job (read your `episodes/EP01/threejs/out/sets/report.md`). You found that the set GLBs lose things on export: 6 sets have no `KHR_lights_punctual`, dispatch lost every `ANCHOR.*`/`LIGHT.*`/`CAM.*` node, no set exported a camera, and the café copy was stale (the manager has now copied E02's v016 GLB into `assets/maps/episode-1/glb/EP01_Cafe_ps2.glb`).

## Build `assets/maps/episode-1/export_set_glb.py`
A Blender script that opens a set's **final source .blend read-only** and writes a clean three.js GLB **into this worktree** (`assets/maps/episode-1/glb/EP01_<Set>_ps2.glb`, overwriting the copies):
- exports `KHR_lights_punctual` (all lights the set uses for its look), **cameras** (`CAM.*`), and **empties** (`ANCHOR.*`, `LIGHT.*`, `FX.*`, `CAM.*` targets) as nodes, with their names;
- keeps the per-builder exclusions: read each builder's own export function and exclude what it excludes (`Preview.*`, `StandIn.*`, Eevee fog volumes, preview-only exhaust/smoke, review-only figures);
- keeps texture/material settings as each builder had them; Y-up; apply modifiers;
- logs node counts by kind (mesh, light, camera, empty) and the output size;
- never saves the source .blend.

## Source blends (final versions; read-only paths in other worktrees)
- café: `~/ms-workers/E02/assets/maps/episode-1/EP01-Map_v016.blend` (builder in E02's `assets/maps/episode-1/`)
- apartment: `~/ms-workers/E06/assets/maps/episode-1/EP01-Map_apt_v010.blend`
- freight yard: `~/ms-workers/E07/assets/maps/episode-1/EP01-Map_yard_v017.blend`
- market: the **latest** `~/ms-workers/E09/assets/maps/episode-1/EP01-Map_market_v*.blend` (still being polished: export the newest at the time you run, and say which)
- shop: the latest `EP01-Map_shop_v*.blend` and dispatch: `EP01-Map_dispatch_v014.blend` (both in this worktree)
- border: `~/ms-workers/E10/assets/maps/episode-1/EP01-Map_border_v020.blend`; hospital gate + livestock road: the latest `~/ms-workers/E10/assets/maps/episode-1/EP01-Map_road_v*.blend` (two GLBs from one blend: follow E10's builder for how it splits them)
- KAMAZ: `~/ms-workers/P03/assets/props/kamaz/KAMAZ_v020.blend` → `assets/props/kamaz/glb/KAMAZ_intact.glb` / `KAMAZ_disabled.glb` (follow P03's builder for the variants)

If a source .blend is missing what its builder's preview had (e.g. a set's lights were made only at render time), recreate them in your exporter from the builder's code and say so.

## Then
1. Update `episodes/EP01/threejs/src/sets/registry.json` + `loadSet.js` to prefer the GLB's own lights/anchors/cameras (keep your registry tuning as overrides where needed). Light intensity scale: keep one documented conversion.
2. Re-run `tools/set-check.mjs` (extend it: every set has ≥1 light, every `ANCHOR.*` the story needs exists; dispatch: `ANCHOR.irina_desk`, `ANCHOR.irina_window`, `ANCHOR.door`), and `tools/set-stills.mjs --times=all`. New `out/sets/all-sets.jpg` and compare sheets.
3. **Sign check:** you reported mirrored lettering on the shop, dispatch and hospital signs. The manager's review of the Eevee previews shows «ДЭЛГҮҮР» and «ЭМНЭЛЭГ» reading correctly from the front, so check whether your review cameras are looking at the **back** of a single plane / double-sided sign. Render each sign straight from its front (normal side) in three.js. If it really is mirrored from the front, report the object and the fix (don't edit the builders); if it's only the back, make the backs of signs single-sided or give them a blank back in the exporter.
4. `npm test` must pass.

## Rules
- Blender only via `bash .cache/e08/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only: `assets/maps/episode-1/export_set_glb.py`, the GLBs in `assets/maps/episode-1/glb/` and `assets/props/kamaz/glb/` in this worktree, `episodes/EP01/threejs/src/sets/**`, `tools/set-check.mjs`, `tools/set-stills.mjs`, `out/sets/**`. Never write into other worktrees. No commits. Don't touch `AGENTS.md`.
- Look at every still. At least 2 export → render → look rounds.
- Final `## Report:` with files, commands + output (node counts per GLB), evidence, the sign verdict, and what still looks wrong.
