# E11 round 2 (DeepSeek): dispatch office props

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E08`: the dispatch office (`build_dispatch_ps2.py`, `check_dispatch_ps2.py`, `render_dispatch_ps2.py`, `previews/dispatch-ps2/`, r8 delivered). Continue numbering. Don't change the shop files.

## Manager review of r8
Good: the room mood (wide, reverse), the wall colours, the window bars, the sign «ДИСПЕТЧЕРСКАЯ», «ГРАФИК», the calendar, the typewriter. All Russian text reads correctly.

Fix:
1. **The recorder is a reel-to-reel deck, but the script says CASSETTE.** Irina rewinds a cassette and wraps two cassette tapes. Build a Soviet portable **cassette** recorder (Электроника-302 style: a flat box with a carry handle, a cassette door with a clear window on top/front, piano keys, a round speaker grille, a VU meter). The **cassette inside must be visible through the window**, with its two small spools as separate objects (they spin). The spool close-up shot must frame the cassette window. The two loose cassettes on the desk should read as cassettes (clear shell, label, two hubs), plus their cases.
2. **The phone is unreadable** (looks like a small turntable). Make a clear Soviet rotary desk phone: a body with the dial on the front slope, a **handset lying in the cradle on top** (separate object), a coiled cord to the handset, a cord to the wall.
3. **Envelope:** «ЖИЖҮҮР» uses a Y with a crossbar (that's Kazakh Ұ). Mongolian **Ү** is a plain Y with a straight stem, no crossbar. Make the address look handwritten in ballpoint (slightly slanted, uneven, blue/black ink), still clearly «Наран / жижүүр эмч» (lower-case handwriting is fine). Re-check every glyph in a close-up.
4. **Window view:** the yard is the weakest part. Make 2–3 wagons read (silhouettes with doors and wheels lit by sodium lamps), sodium lamp heads with a glow, one strong steam column from a pipe, falling-snow specks optional.
5. The satchel is fine; add a strap and worn edges if cheap.

Keep all checks passing (budgets, anchors/cams, spools and the handset as separate objects, the lamp is a light).

## Rules
- Blender only via `bash .cache/e08/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only the dispatch files. No commits. Don't touch `EP01-Map.blend`, the shop files or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image; re-export the GLB from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence (contact sheet + text sheet + recorder/phone close-ups), and what still looks wrong.
