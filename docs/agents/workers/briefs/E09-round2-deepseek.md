# E09 round 2 (DeepSeek): market street polish

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E09`. Source: `assets/maps/episode-1/build_market_ps2.py` (v012 delivered), checks in `check_market_ps2.py`, renders via `render_market_ps2.py`, stills in `assets/maps/episode-1/previews/market-ps2/`. Look at `r6-*.png` first. Continue numbering (v013+, r7+).

## Manager review of r6 (good base: fog, bus, kiosk, clinic sign all read). Fix:
1. **Ground is too clean and too bright.** The snow/pavement is a flat near-white that kills the fog and the SH2 mood. Lower its value, add dirty grey slush, tyre ruts down the road edges, footpaths trodden brown-grey, ash/coal stains near stove pipes, patchy snow at wall bases. The road must not look like a fresh render plane.
2. **The stalled car reads as a van.** Make it a recognisable late-Soviet sedan (Zhiguli/Moskvich-like three-box: low bonnet, cabin, boot, 4 wheels, bumpers, round headlights), faded colour, snow on roof. Under ~800 tris, no brand logos.
3. **Market stalls:** the hanging red "crystals" don't read as meat. Make hanging mutton halves/ribs (or remove them) and put recognisable goods on tables: sacks, felt boots, thermoses, bread, cigarettes in cartons, cabbage. Tarps get thickness and sag. Add stools, a stove barrel with smoke, crates under tables.
4. **Bus stop shot:** reframe so the shelter bench and the PAZ bus both read in one frame (move camera or the bus a little forward along the kerb; keep the push lane clear).
5. **Tsetsegmaa POV:** the dark post with a round head in the foreground is unreadable. Identify it; either make it read clearly (e.g. a standpipe/water pump with ice) or move it out of the frame.
6. **PAZ bus:** windows are flat grey panels. Give them dark glass with frost/dirt and a hint of seats inside; add destination plate, wipers, mirrors, mud spray on the lower skirt.
7. **Morning vs midday:** make them clearly different (morning: low cold blue light, longer shadows, lamps still on; midday: higher flat grey overcast, lamps off).

Keep all 21 checks passing (no traffic lights, push lane clear, shutter pivot, BUS.PAZ separate, triangle budget ≤35000, textures ≤ check limit). Story facts: no traffic lights in Naran 1998.

## Rules
- Blender only via `bash .cache/e09/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only in `assets/maps/episode-1/` (market files, new blend versions, GLB `glb/EP01_Market_ps2.glb`, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image. Re-export the GLB from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence stills, and what still looks wrong.
