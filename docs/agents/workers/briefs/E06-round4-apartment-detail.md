# E06 round 4 (DeepSeek): apartment: from blocks to things

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E06` (apartment, r16 delivered: `previews/apartment-ps2/r16-day-contact.png`, `r16-night-contact.png`). Continue numbering. Only view PNG/JPEG images.

## Manager review of r16
Good: the birthday table wide (paper lanterns, bunting, the rug, mismatched chairs) has real atmosphere; the anchors, door facts and both states are in.

Fix (everything that is still a box):
1. **Coats** on the hooks (hall, landing) are flat coloured slabs. Make hanging coats: shoulders over the hook, sleeves, hems, a fur collar or two, a hat on a hook, scarves; on the bed (bedroom) a pile of real coats (draped shapes), not boxes.
2. **The birthday cake** is a giant drum (≈ 40 cm). A 1998 home birthday sweet is small (~22 cm, a store/home sponge with cream and jam, or a tray of pastries) with 3 paper/wax candles (Altan turns **3**). Use the hero props from `~/ms-workers/E10/assets/props/hero/glb/` (read-only: `birthday_table.glb`, `enamel_bowl*.glb`, `plate.glb`, `tea_cup.glb`, `paper_crown.glb`, `infant_bundle.glb`, `birthday_meat_dish.glb`): import/append them (GLB import in Blender) and place them on the table so the table reads as boortsog, meat, salads, aaruul, candies, tea, mismatched bowls.
3. **Shoes** at the entry are flat tiles: real pairs (felt boots, winter boots, children's shoes), some snowy/wet with a puddle.
4. **Kitchen door shots:** the hall-side frame is mostly a wall texture; frame the door with its handle and the gap, the hallway leading to it, warm party light spilling from one side and dark kitchen beyond; inside-kitchen shot: the door from inside (hinges visible on the kitchen side since it opens inward), the stove, a window, a dish rack, a heating pipe.
5. **Bedroom:** still too dark and blocky (the coat pile, a box-like bed). A real bed with a quilt, the infant bundle (hero prop) in a nest of blankets at `ANCHOR.infant_cot`, a bedside lamp casting a warm pool, a wall rug, a wardrobe.
6. **Day landing** too bright (luma ~140): a dim stairwell with a window at the half-landing; cold light, paint peeling, a radiator.
7. Wallpaper: the large pixel-flower pattern reads blotchy close up: a smaller-scale repeat, slightly faded.

Keep all checks passing (door swings inward, no lock objects, anchors, both states), triangle/texture budgets (raise only if you must; say so). Re-export the GLB with lights/cameras/empties.

## Rules
- Blender only via the wrapper in `.cache/` in the foreground. Never the Blender MCP.
- Write only the apartment files in `assets/maps/episode-1/`. No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image.
- Final `## Report:` with files, check output, evidence (both contact sheets), what still looks wrong.
