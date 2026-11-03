# E10 round 3 (DeepSeek): road + hospital fixes

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E10` (v015, r11 delivered). Source `assets/maps/episode-1/build_road_hospital_ps2.py`, checks `check_road_hospital_ps2.py`, renders `render_road_hospital_ps2.py`, stills `previews/road-hospital-ps2/`. Continue numbering (v016+, r12+). Open `r11-contact.jpg` first.

## Manager review of r11
1. **The lettering is upside down (flipped vertically), not just "blocky".** Both signs read «ЭWНЭЛЭL» instead of «ЭМНЭЛЭГ»: М shows as W and Г shows as L. That is the classic image-row order bug in your 5×7 bitmap font (glyph rows written bottom-to-top, or the texture's V flipped). Fix it at the source, then prove it: render a close-up of each sign and a test strip «ЭМНЭЛЭГ АБВГДЕЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ 0123456789 →» and check every glyph against its correct shape. Add a check that renders/samples the glyph texture and asserts Г's bar is at the top (not the bottom) and М's peaks point up.
2. **Cab shot:** the hard, pixelated vertical bars over the left and centre of the frame (dirt smudge / dithering on the windshield, A-pillar strip) read as a render bug. Make the windshield dirt soft and subtle (low alpha, gentle gradient at the bottom edge, wiper arcs), keep the A-pillar a clean dark shape.
3. **Reflection shot:** the stand-in bust is too opaque and too sharp: it should be a faint ghost in the glass (about 20–35 % visibility), with the night road visible through it. Keep it a preview-only stand-in excluded from the GLB.
4. **Road wide:** the sheep read as glowing lumps. Lower the wool's value at night, keep a dim cab/headlight rim only where the light actually hits, and make a few silhouettes (heads up, legs) readable.
5. Keep everything else: the junction, lane, gate and stop shots are good (keep their composition and the queue).

Keep all checks passing. Story facts: no traffic lights, no pharmacy.

## Rules
- Blender only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only in `assets/maps/episode-1/` (road/hospital files, new blend versions, the two GLBs, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image; re-export both GLBs from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence (include `r*-contact.jpg` and the font test strip), and what still looks wrong.
