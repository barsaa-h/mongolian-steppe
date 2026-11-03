# E08 round 2 (DeepSeek): Nyamka's shop polish

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E08` (v017, r8 delivered). Source `assets/maps/episode-1/build_shop_ps2.py`, checks `check_shop_ps2.py`, renders `render_shop_ps2.py`, stills `previews/shop-ps2/`. Continue numbering (v018+, r9+). Open `r8-contact.jpg` and `report.md` first.

## Manager review of r8 (good base: the room, the green dado, the shutter, the evening courtyard all read well)
1. **The sign is misspelt.** It shows «ДЗЛГҮҮР»: the second letter is drawn as a "З/3", not «Э». It must read «ДЭЛГҮҮР» (Э = a reversed C with a middle bar pointing left into the bowl). Also the stray red tick marks under/around the letters read as glitches: either make them clear paint drips/chips or remove them. Render a close-up of the sign and check every glyph; if you use a bitmap font, render a test strip «АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ» and verify Э vs З, Ү, Ө, and that nothing is flipped.
2. **Counter close-up:** the objects are unreadable: the white block with three white rods, the blue/red blocks, the loose white sticks. Make clear 1998 shop props: a wooden abacus (сампин) with beads on rods, a dial scale with weights, a receipt book with carbon, a jar of sweets, a pack of cigarettes, a tea brick, matches. Each must read at the close-up camera.
3. **Shelf goods** read as blocky labels at the wide: give them silhouettes (jars with lids, bottles with necks, tins, sacks, bread loaves, tea bricks, vodka bottles), varied colours, some gaps; a 1998 shop half-empty, not a grid.
4. **Scale** reads lamp-like at the wide: make it a recognisable Soviet dial counter scale.
5. **Frost window from inside:** too bright and flat; add frost gradient, dirt at the corners, a bit of the street seen through the clear middle.
6. **Courtyard:** the left foreground dark mass is unreadable: either light it a little (a spill from a window) or make it a clear shape (coal pile, woodstack under snow).
7. **Smoke:** if the alpha cards read as sheets, remove them (leave the `FX.smoke_vent` empty); no fake sheets in the frame.

Keep all checks passing and the triangle/texture budgets.

## Rules
- Blender only via `bash .cache/e08/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only in `assets/maps/episode-1/` (shop files, new blend versions, `glb/EP01_Shop_ps2.glb`, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image; re-export the GLB from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence (contact sheet + sign close-up + font strip), and what still looks wrong.
