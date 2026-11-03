# P04 (DeepSeek): EP01 hero props kit, PS2 style

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E10` (you built the road/hospital and border sets here; reuse your scripting, material and render approach and your checked Cyrillic font). **Don't change the set files.** New files: `assets/props/hero/build_hero_props.py`, `check_hero_props.py`, `render_hero_props.py`, `assets/props/hero/hero_props_v001.blend`…, one GLB per prop in `assets/props/hero/glb/<name>.glb`, previews in `assets/props/hero/previews/`.

## Why
EP01 is a Silent Hill 2-style motion comic told in close panels. These props carry the story (they're the episode's motifs) and are seen **in close-up**, held in hands, so each must read instantly and look of its time (Mongolia/Russia, winter 1998). Use SH2 *techniques* only (painted textures, motivated light), never its assets.

## Props (each its own GLB, real-world scale in metres, origin at a sensible grip/rest point, Y-up after export)
1. **Enamel tea bowl** (the title prop «АЯГАА ХУВААЛЦ»): an **enamel** steel bowl (not porcelain), white or pale blue with a dark-blue rim, a few chips showing black steel, a faint brown tea stain on one side of the rim. ~13 cm across. A second variant with tea inside (milk tea colour, `Tea` as a separate object).
2. **Child's mittens, a pair** (Ganaa's present for Altan): small knitted wool mittens (red or blue with a simple white pattern, cuff ribbing), linked by a string; variant A wrapped in brown paper with string, variant B unwrapped; one mitten slightly bigger. ~12 cm long.
3. **Irina's satchel**: worn brown leather document satchel, the clasp closed **with wire**, a shoulder strap; variant open with two copied reports and two cassettes wrapped in cloth inside.
4. **Paper crown** (Altan's birthday): handmade, uneven, coloured paper with drawn points.
5. **Paper candles / birthday table set**: handmade paper candles, a plate of boortsog (fried dough), a few **mismatched** bowls and cups, a cheap birthday sweet (cake/cookie box), a thermos.
6. **Shop debt notebook** (Nyamka): a school notebook with a soft card cover, open variant with pencilled columns of names and figures (Mongolian Cyrillic, handwriting-like; check every glyph), and a pencil.
7. **Guard's flashlight and key ring**: a Soviet metal flashlight (lit variant with emissive lens), a ring of large keys (the key swings against a wagon door in beat 01: make the key ring a separate object with its pivot at the ring).
8. **Ganaa's photo**: a small worn family photo (Ganaa, Tsetsegmaa, Altan as simple painted silhouettes/blurred faces, no real people) tucked behind a sun visor; the photo as a separate quad.
9. **Накладная (waybill)** and a **rubber stamp** + stamp pad for the border.

## Budgets
Each prop ≤ 1500 triangles (the crown/notebook ≤ 500), textures ≤ 256² (512² only for the notebook page and photo), nearest-filter friendly, one GLB per prop, no lights/cameras inside the prop GLBs, clean names (`PROP.<name>`, sub-parts `PROP.<name>.<part>`).

## Previews
Render each prop on a neutral dark table under a warm practical key (like a kitchen lamp) at 960×540: one hero 3/4 close-up and one in-context shot at hand scale (a simple hand stand-in or a 10 cm ruler for scale). Contact sheet `previews/hero-props-contact.jpg`, a text close-up sheet for the notebook/waybill/stamp.

## Checks (`check_hero_props.py`)
Every GLB parses, tri/texture budgets, real-world dimensions within ±20 % of the stated sizes, the key ring and the tea are separate objects, no preview-only nodes.

## Rules
- Blender only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only `assets/props/hero/**`. No commits. Don't touch `EP01-Map.blend`, the set files or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image.
- Final `## Report:` with files, commands + check output, evidence (contact sheet + text sheet), and what still looks wrong.
