# P04 round 2 (DeepSeek): hero props fixes + the remaining props

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your hero props kit in `~/ms-workers/E10` (`assets/props/hero/`; your previous run was cut off by a restart just before its report: inspect `assets/props/hero/glb/`, `previews/hero-props-contact.jpg`, `previews/hero-props-text.jpg` and your scripts first, re-run `check_hero_props.py`, continue numbering).

## Manager review of the contact sheet (good: enamel bowl + tea, mittens pair + parcel, keys, flashlight, paper crown, photo, waybill + stamp all read)
Fix:
1. **Satchel reads as a box/suitcase.** A worn leather document satchel is soft: a flap that folds over the front, rounded sagging corners, a gusset, a shoulder strap, the clasp closed with twisted wire; it should slump slightly when standing.
2. **Debt notebook cover** shows «8P»: a Soviet school notebook cover reads «ТЭМДЭГЛЭЛ» or «ДЭВТЭР» (Mongolian) or is plain with a ruled label; check every glyph. The open pages: pencil columns of names and amounts, legible but handwritten-like.
3. **Birthday table:** the boortsog read as random lumps; make recognisable fried dough pieces (twisted/rectangular, golden brown), add aaruul (dried curd), candies, a few mismatched enamel/porcelain bowls and glasses, paper candles; the thermos OK.
4. **Remaining props** the panel breakdown needs (each its own GLB, same rules, real scale): tea cup (faceted Soviet glass in a metal holder), plate, spoon, plastic/metal water bottle, a cloth (folded rag, for Hürel's counter), a **swaddled infant bundle** (blanket-wrapped, just a bundle with a tiny face hint, mostly heard in the story), a **bicycle** (Soviet single-speed, ≤ 2500 tris, wheels as separate objects so they can spin: a market-street bike, its spinning wheel is a cut), and the **birthday meat dish** (boiled mutton on a plate).

## Rules
- Blender only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP.
- Write only `assets/props/hero/**`. No commits. Don't touch `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image. Updated contact + text sheets.
- Final `## Report:` with files, check output, evidence, what still looks wrong.
