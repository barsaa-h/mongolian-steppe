# E09 round 3 (DeepSeek): market street, the road surface

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E09` (r15 delivered). Continue numbering (new blend versions, r16+). Open the `r15-*` stills first.

## Manager review of r15
Better: darker ground, the bus stop now shows bench + bus together, the stalls and mutton read, the saloon car reads from the side, morning vs midday differ, the clinic frontage is good.

**One big new defect: the road slush reads as white graphic marks.** In street-wide, push-lane and the POV, the road is covered in hard-edged white rectangles, dashes, hooks and squiggles. They look like painted road markings or glyphs, not slush. Fix:
- Tyre ruts = **two continuous dark wet bands per lane** running the length of the road (soft edges, slightly wavy), with packed grey-white snow between and beside them, not dashes.
- Slush and snow edges along the kerbs = soft irregular **blobs with feathered alpha**, darker and greyer than fresh snow, not rectangles. No shapes with straight edges or right angles on the ground anywhere except kerbs, manholes and drains.
- A few dark wet patches and potholes with ice, irregular.
- Lower the overall contrast on the road: the whitest ground value ≤ about 70 % of the sky's value in the fog.
- Hide the 1.5 m atlas repeat (rotate/scale variation, a second larger-scale grime layer).

Small: in the push-lane shot, frame the car from the front three-quarter so the saloon reads (bonnet, windscreen, roof, boot); keep the push lane clear.

Keep all checks passing (no traffic lights, push lane clear, shutter pivot, BUS.PAZ separate, budgets).

## Rules
- Blender only via `bash .cache/e09/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only in `assets/maps/episode-1/` (market files, new blend versions, `glb/EP01_Market_ps2.glb`, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image; re-export the GLB from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence stills, and what still looks wrong.
