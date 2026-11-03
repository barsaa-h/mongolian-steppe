# P03 round 4 (DeepSeek): finish the KAMAZ

You continue a job another worker started in this worktree (`~/ms-workers/P03`); it ran out of quota mid-round. **Its last state:**
- `assets/props/kamaz/build_kamaz.py` and `check_kamaz.py`, versioned blends up to the newest `KAMAZ_v0xx.blend`;
- previews `assets/props/kamaz/previews/r12-*` (the last full round), `r13-*`, and a partial `r14-*`.

It had just moved the passenger interior camera. Find the newest version, read `previews/report.md`, and open the r12–r14 images before you start. You can view images: **open every render you make and judge it.** Continue versions from the newest number; never overwrite one.

The user saw r12 and said: "looks great but little fixing needs". The fix list below is the round the previous worker didn't finish.

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
At least 3 rounds (`r15-*`, `r16-*`, `r17-*`), all 8 views. Open and judge every image. Update `previews/report.md` honestly. **Use your full budget**; failures are yours to debug.
