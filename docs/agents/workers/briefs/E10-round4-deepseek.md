# E10 round 4 (DeepSeek): finish the pixel font and the last road/hospital notes

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E10` (v019, r15 delivered). Continue numbering (v020+, r16+). Open `previews/road-hospital-ps2/r15-contact.jpg` and `r15-font.png` first.

## Manager review of r15
Orientation is fixed (Г's bar on top, М's peaks up). Good. Remaining:
1. **Э and З are the same glyph** in your 5×7 font (both a flat "3"). Make them distinct: **Э** = rounded left/top/bottom corners (no corner pixels), a short middle bar pointing left from the right stroke, a straight right side; **З** = two stacked bowls pinched in the middle (the middle bar touches the right side only, top and bottom bowls rounded on the right). Look at real Cyrillic Э and З and match them.
2. **Ү (Mongolian Ue) looks like Ч / 4.** It must be a Y with a straight vertical stem: two diagonals meeting at the middle, then a straight stem down. **Ө** must be an O with a horizontal middle bar (not an 8). Check **Ж, Ш, Щ, Ы, Ю, Я** too: each must be recognisable.
3. Also check **У** (diagonals then a hook down-left), **Д** (feet below the baseline), **Ц/Щ** (tail).
4. Render the test strip again (all letters with Ө and Ү in their places: «АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ», digits, arrow) at a large size, and look at each glyph. Add each fixed glyph to your check (e.g. assert Э's top-left corner pixel is empty and З's middle-left pixel is empty).
5. **The facade plate «ЭМНЭЛЭГ»** is unreadable at the gate/stop cameras: higher contrast (dark letters on a pale plate or pale on dark), slightly larger letters, a dim lamp above it.
6. **Sheep in road_wide** still glow: drop the wool value further where the headlight doesn't hit and give 3–4 front sheep readable heads/legs.
7. The reflection ghost is better; leave it.

Keep all checks passing. No traffic lights, no pharmacy.

## Rules
- Blender only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only in `assets/maps/episode-1/` (road/hospital files, new blend versions, both GLBs, previews). No commits. Don't touch `EP01-Map.blend` or `AGENTS.md`.
- At least 2 render → look → fix rounds; look at every image; re-export both GLBs from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence (contact sheet, font strip, sign + plate close-ups), and what still looks wrong.
