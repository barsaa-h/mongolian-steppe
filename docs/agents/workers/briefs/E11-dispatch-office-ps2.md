# E11 (DeepSeek): Ulan-Ude freight dispatch office, PS2 set

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E08` (you built Nyamka's shop here; reuse its approach: `assets/maps/episode-1/build_shop_ps2.py`, `check_shop_ps2.py`, `render_shop_ps2.py`). **Don't change the shop files.** Make new ones: `build_dispatch_ps2.py`, `check_dispatch_ps2.py`, `render_dispatch_ps2.py`, `EP01-Map_dispatch_v001.blend`…, `glb/EP01_Dispatch_ps2.glb`, `previews/dispatch-ps2/`.

## Story (beat 02, 0:45, "A warning with nowhere to go")
INT. FREIGHT DISPATCH OFFICE — PRE-DAWN, Ulan-Ude (Russia), winter 1998. POV: Irina (a Russian rail inspector). She sits at a desk, rewinds a **cassette** in a portable recorder, compares handwritten timestamps, **dials a landline** (a rotary phone); an exhausted dispatcher hangs up on her. She wraps two labelled cassette tapes in cloth, puts them with two copied reports into a worn satchel whose clasp is closed **with wire**, and writes «Наран / жижүүр эмч» on an envelope. Outside the window: the freight yard predawn (sodium lamps, wagons, steam from a pipe). The last shot is a close-up of the spinning tape spool.

## What to build (Silent Hill 2-style techniques only; never its assets)
- A small, shabby late-Soviet railway office, about 4 × 5 m, ceiling 3 m: painted lower walls (green or blue-grey) and pale upper walls with peeling paint and stains; a linoleum floor worn through at the desk; a cast-iron radiator under the window; a double-glazed wooden window with frost at the corners and the yard visible outside.
- **Desk** (Irina's mark `ANCHOR.irina_desk`), wooden chair; on the desk: a portable cassette recorder (Soviet style, with visible spools and a hinged lid), a rotary phone with a coiled cord, two cassettes, two stapled copied reports, an envelope, a worn leather satchel, a cloth, pencil, ashtray, a glass of tea in a metal holder (подстаканник), a desk lamp (the only warm light).
- Wall: a schedule board, a yard map of tracks, a calendar from 1998 (Russian text), a wall clock showing about 5:40, a coat hook with a coat, a safe or filing cabinet, a kettle on a stool, a second desk with a typewriter.
- Lighting: the desk lamp (warm tungsten), cold blue-grey dawn through the window, orange sodium yard lamps outside, a flickering fluorescent tube (off or very dim). Dark corners.
- Text: Russian Cyrillic only, short and correct (e.g. «ГРАФИК», «ДИСПЕТЧЕРСКАЯ», «1998»). The envelope text «Наран / жижүүр эмч» can be handwriting-like. **Check every glyph** in a close-up render (no flipped or swapped letters; Э ≠ З, Г's bar on top).
- Budget: ≤ 20000 triangles, ≤ 12 textures (≤ 512² each, nearest-filter PS2 look), clean GLB for three.js.
- Anchors: `ANCHOR.irina_desk`, `ANCHOR.irina_window`, `ANCHOR.door`, `CAM.*` empties for the shots below.

## Shots (960×540 Eevee previews, then a contact sheet)
1. wide from the door, Irina's desk lit by the lamp, window behind;
2. over-the-shoulder at the desk: phone, recorder, papers;
3. tape-spool close-up (the cassette spools must read; final cut to a bicycle wheel);
4. envelope + satchel with the wire clasp close-up;
5. window: the yard outside predawn with sodium lamps and wagons;
6. a reverse angle from the window toward the door.

## Checks (`check_dispatch_ps2.py`)
Triangle/texture budgets, anchors and cams present, the GLB parses (1 scene, no preview-only nodes), cassette spools are separate objects (so they can spin), the phone receiver is a separate object, and the desk lamp is a light.

## Rules
- Blender only via `bash .cache/e08/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only the new dispatch files listed above. No commits. Don't touch `EP01-Map.blend`, the shop files or `AGENTS.md`.
- At least 4 render → look → fix rounds; look at every image. Re-export the GLB from the final blend.
- Final `## Report:` with files, commands + check output, evidence (contact sheet + text close-up), and what still looks wrong.
