# E12 round 2 (DeepSeek): border checkpoint, from clean highway to 1998 border post

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your own work in `~/ms-workers/E10`: the border set (`build_border_ps2.py`, `check_border_ps2.py`, `render_border_ps2.py`, `previews/border-ps2/`, r9 delivered). Continue numbering. Don't change the road/hospital files.

## Manager review of r9
Good: the layout (queue → canopy → barrier), the booth counter with papers and stamp pad, the «ТАМОЖНЯ» sign, the watchtower, the 1998 calendar.

Fix:
1. **It reads as a clean modern highway.** A 1998 Russian–Mongolian road border post is worn: patched, cracked asphalt with potholes and slush, packed snow at the edges, no fresh crisp dashed lane lines (at most faded, broken remnants), fewer lamp posts (only a few at the post itself, none down the empty road), a narrower road (2 lanes ≈ 7 m), sagging wires, a few concrete blocks, oil stains under the queue, litter, a dog-eared notice board. Break the perfect symmetry.
2. **The trucks read as crates from behind.** Seen from the rear/3/4 they must read as trucks: visible cabs above the cargo, wheels and mudflaps, rear lights, number plates (blank/plain), tarp ropes, exhaust pipes with a puff. Vary them: a ZIL-130 type, a GAZ-53 type, a KAMAZ-like cargo truck, a fuel tanker, a Ural-type flatbed. Snow on roofs and tarps.
3. **Golden hour is just a sepia filter.** Make the late light a real low sun: a warm, low key from the side casting long blue shadows across the road, warm rims on trucks, a cooler blue sky toward the opposite side, dark interiors. Morning: cold, bright, white glare with short shadows. Two clearly different lights, not a tint.
4. **The STOP sign:** in Russia in 1998 the octagonal stop sign (sign 2.5) reads **«STOP» in Latin letters**, not «СТОП». Fix it.
5. **The small text above «ТАМОЖНЯ»** is garbled and cropped. Either a correct short line («ПУНКТ ПРОПУСКА» / «КЯХТА») fully in frame, or remove it. Check every glyph.
6. Wide shots: don't crop the nearest truck at the bottom edge.

Keep all checks passing (budgets, anchors/cams, the 9 × 3 m KAMAZ gap, the barrier pivot, no traffic lights).

## Rules
- Blender only via `bash .cache/e10/run_blender.sh --python <script> -- <args>` in the foreground. Never the Blender MCP. Don't name scripts after stdlib modules.
- Write only the border files. No commits. Don't touch `EP01-Map.blend`, the road/hospital files or `AGENTS.md`.
- At least 3 render → look → fix rounds; look at every image; re-export the GLB from the final blend.
- Final `## Report:` with changed files, commands + check output, evidence (contact sheet in both lights + sign close-ups), and what still looks wrong.
