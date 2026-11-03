# P03 round 2 (Codex): KAMAZ, from block-out to hero truck

Continue in this worktree from `assets/props/kamaz/KAMAZ_v006.blend` and `build_kamaz.py`. Keep `check_kamaz.py` passing (budgets: exterior ≤ 6k tris, cab ≤ 4k, ≤ 8 textures, nearest filtering, no mipmaps; the seat matches `cab.json` within 3 cm; the 40 × 30 × 15 cm satchel fits behind the seat; both doors swing 70° clear; disabled ≠ intact). Blender only via `bash .cache/p03/run_blender.sh --python <script> -- <args>` (your own lock; a safe runner always exits Blender), in the foreground. Write only under `assets/props/kamaz/`, with no commits, and never overwrite a version (continue `v007`+). The look is PS2 / Silent Hill 2: low-poly, small pixel textures with painted grime, using SH2 techniques only, with no real-brand logos.

## Manager review of r4–r6
**Good:** the 6×4 layout, the tarp bed, the round headlights, the cracked windshield, the doors, the budgets.

**Fix, in order:**
1. **The steering wheel lies flat on the dash, like a plate.** A KAMAZ wheel is big (~50 cm), thin and **steeply raked, about 20–30° from vertical**, on a column coming out of the floor/dash in front of the driver seat. Rebuild the dash as a proper Soviet dash: a slanted instrument panel with round gauges, an ashtray, a glovebox, a radio, the heater vent box on the passenger side, plus a gear lever on the floor and pedals.
2. **The cab silhouette is a plain box.** Shape it like a KAMAZ-5320 cab: slightly sloped front with rounded corners, a **two-piece windshield** with a centre pillar, a separate grille panel under the windshield with horizontal slats, the bumper with the headlights *in the bumper*, the cab roof slightly overhanging, round mirrors on long arms, steps under each door, and a cab colour band. Keep it low-poly (bevel the corners with 1–2 segments, no smooth subdivision).
3. **The interior is empty and too dark to read.** Add:
   - seat cushions with stitched panels (a texture), a torn patch;
   - a rug or sheepskin on the seat, as Mongolian drivers often have;
   - a small hanging charm or prayer cloth (khadag) from the mirror;
   - a thermos, papers on the dash, an old cassette radio;
   - a curtain behind the seats over the sleeper gap, with **the satchel space behind the seat visible** in the passenger view.
   Add a dim dome light so the interior reads at night.
4. **The disabled state barely differs from intact.** After the café collision: the **front-left corner pushed in** (the bumper bent back, the left headlight smashed and dark, the grille panel cracked and hanging), the windshield cracked across the driver side, the left front tyre flat (squashed), the cab tilted about 3° forward-left, steam/coolant stains, and a door ajar. Not burned out. The cab must stay intact enough for the satchel.
5. **Grime and age.** The paint is too clean and even. Paint mud splash up the lower 40 cm, rust at the seams and wheel arches, faded paint on the roof, and a dirty tarp with sag lines and patches. Make the number plate a Mongolian-style plate with made-up characters.
6. **Night lighting** in the moody previews: the headlights cast real cones onto the ground, plus a cold moon fill and a dark background. The studio view stays neutral grey.

## Process
At least 3 rounds (`r7-*`, `r8-*`, `r9-*`), each with all 8 views: front 3/4, side, rear, studio, disabled front, disabled close, interior from the driver door, and interior from the passenger seat. Open and judge each image. Update `previews/report.md` honestly. Failures are yours to debug, not reasons to stop. **Use your full budget.**
