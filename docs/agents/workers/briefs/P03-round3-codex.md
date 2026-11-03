# P03 round 3 (Codex): KAMAZ, final polish

The user reviewed the KAMAZ (r12): "looks great but little fixing needs". Continue in this worktree from `assets/props/kamaz/KAMAZ_v012.blend` and `build_kamaz.py`. Keep `check_kamaz.py` passing:
- exterior ≤ 6k tris, cab ≤ 4k tris, ≤ 8 textures, nearest filtering, no mipmaps;
- the seat matches `cab.json` within 3 cm;
- the 40 × 30 × 15 cm satchel fits behind the seat;
- both doors swing 70° clear;
- disabled differs from intact.

Blender only via `bash .cache/p03/run_blender.sh --python <script> -- <args>` (your own lock; a safe runner always exits Blender), in the foreground. Write only under `assets/props/kamaz/`, with no commits, and never overwrite a version (`v013`+). The look is PS2 / Silent Hill 2, with no real-brand logos.

## Fix list
1. **The cab is still a plain box.** The KAMAZ-5320 cab is its identity:
   - a front face **slightly raked back** (~8°);
   - **rounded vertical front corners** (1–2 bevel segments);
   - a **two-piece windshield** with a centre pillar, wider than tall;
   - a **separate dark grille panel** below the windshield with 5–6 horizontal slats;
   - a **thick bumper with the round headlights set into it**, plus small turn signals;
   - a roof visor or overhang lip;
   - a vertical exhaust stack behind the cab;
   - cab steps under each door;
   - a door shape with the classic lower window line.
   Compare the 3/4 front against your own memory of a KAMAZ-5320 and fix proportions until it reads as one instantly.
2. **The passenger interior view is broken** (the camera sits inside the seat or wall and shows brown blocks). Place the camera at the passenger's eye height (~1.95 m above ground in the cab), looking across at the driver seat and the dash, with the satchel space behind the seat visible.
3. **Interior readability:** a warmer dim dome light. Make the sheepskin on the seat, the khadag hanging from the mirror, the thermos, papers and cassette radio clearly visible in the driver-door view.
4. **The tarp** reads as a stiff grey box: give it sag between the hoops, tie-down ropes at the side, patches and dirt.
5. **Disabled:** make the damage read at a glance from the 3/4 front:
   - the front-left corner visibly crushed back (≥ 15 cm);
   - the bumper twisted;
   - the left headlight dark and dangling;
   - the grille cracked;
   - the windshield cracked across the driver side;
   - the flat tyre squashed;
   - a coolant/steam stain on the ground.
   Not burned.
6. **Grime:** more mud up the lower cab and wheels, and rust streaks under the mirrors and door seams.

## Process
At least 2 rounds (`r13-*`, `r14-*`), all 8 views. Open and judge every image. Update `previews/report.md` honestly. **Use your full budget**; failures are yours to debug.
