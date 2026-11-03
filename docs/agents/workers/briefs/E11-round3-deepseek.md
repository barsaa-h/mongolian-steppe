# E11 round 3 (DeepSeek): dispatch office, last two fixes

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E08`: the dispatch office (r9 delivered). Continue numbering. Don't change the shop files.

## Manager review of r9
Good: the rotary phone (great), the loose cassettes on the desk, the recorder body with keys/VU/speaker, the yard through the window (red wagon, rails, lamp), the satchel.

Fix:
1. **The cassette in the recorder is 3× too big**, so the spool close-up reads as a reel-to-reel deck again. Use a **real-size cassette** (about 100 × 64 mm, hubs about 42 mm apart, visible tape windows, label), the same model as the loose cassettes on the desk. Get the close-up by moving the camera in and narrowing the FOV (macro framing), not by scaling the prop. Change the spool-spacing check to the real size. The spools stay separate objects that can spin.
2. **The envelope handwriting:** the second «ү» in «жижүүр» jumps above the baseline. Keep a slight hand-written wobble but put every letter on one baseline with a consistent x-height; Ү is a Y with a straight stem (no crossbar), both Ү the same size. Check «Наран» on the first line too (fully visible in the close-up).

Keep all checks passing.

## Rules
- Blender only via `bash .cache/e08/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP.
- Write only the dispatch files. No commits. Don't touch `EP01-Map.blend`, the shop files or `AGENTS.md`.
- At least 2 render → look → fix rounds; look at every image; re-export the GLB.
- Final `## Report:` with changed files, check output, evidence (spool close-up, envelope close-up, contact sheet), what still looks wrong.
