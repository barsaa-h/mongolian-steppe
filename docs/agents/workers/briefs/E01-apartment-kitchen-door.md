# Brief E01 — Apartment kitchen door, bench, actor marks, proof views

**Department:** environments (`docs/agents/03-environments.md`, task E01). **Milestone:** M2, the birthday vertical slice.
**Why it matters:** the EP01 ending (~21:00) and the first 45 s of EP02 happen at this door. Right now the apartment's kitchen door is only a hole in the wall, so the scene can't be staged.

## Read first (in this order)
1. `artifacts/character-master/sources/story/v4.2-pack/ENDING_B_EP02_APARTMENT_BLOCKING_v4.2.md`: the locked physical beats. This is the spec.
2. `assets/maps/episode-1/README.md`, then `build_apartment()` in `assets/maps/episode-1/author_episode1.py` (around line 388), to see how the apartment was built and named.
3. `assets/maps/episode-1/verify_in_blender.py` and `check_map.py`: the existing QA.

## Current layout (measured from the code; metres, X east, Y north, Z up)
- **Corridor:** x −1.5…0, entry in the south wall at x −1.3…−0.3, landing and stairs to the south.
- **Kitchen:** west of the corridor, y 0…3.5. Its door opening is in the wall at **x = −1.5, y 1.0…2.05**, 2.05 m high. The counter runs along the south wall (y ≈ 0.2…0.9).
- **Bedroom:** west of the corridor, y 3.5…7.3. Its door is at x = −1.5, y 4.65…5.65.
- **Living room:** east of the corridor (x > 0). Its door is at x = 0, y 0.9…2.1. The birthday table is at (2.7, 3.1).
- **Existing anchors:** `GANAA_SEAT`, `ALTAN_GIFT`, `GUEST_INFANT_AUDIO`, `ENTRY`, `COURTYARD_EXIT`.

## Gotchas in the existing scripts (fix them, keep behaviour)
- All three scripts hard-code `/home/barsaa/mongolian-steppe/...`. You work in a worktree, so **change them to paths relative to the script file** (`Path(__file__).resolve().parent`). For `exec()` use from Blender, keep a fallback the same way.
- `verify_in_blender.py` uses `bpy.context.window.scene = …`, which is `None` under `blender -b`. Make it work headless, for example by setting `bpy.context.window.scene` only when a window exists and otherwise passing the scene explicitly. Headless must work: `blender -b EP01-Map.blend --python-expr "..."`.

## Build (edit `EP01-Map.blend`, scene `EP01_Apartment`, in place; git keeps the old version)
Follow the file's naming (`Home.*`, `Kitchen.*`, collections `HOME | …`). Keep triangle budgets: at most 3000 per object, as `check_map.py` requires.

1. **Kitchen door leaf.**
   - Make a door frame (jambs + head) in the opening. Add a hinge empty `Home.KitchenDoorHinge` with the leaf `Home.KitchenDoorLeaf` parented to it, so rotating the hinge's Z opens the door.
   - The leaf is about 0.9 m × 2.0 m × 0.04 m, painted wood, Soviet-era.
   - It **opens INWARD into the kitchen** (toward −X). The door stop is on the side that makes a push from the corridor open it.
   - Put the **hinge on the north jamb (y ≈ 2.05) and the latch on the south side.** Ganaa faces the door from inside, so the latch edge falls at his **right** hand: his good hand braces, and his bitten **left** wrist stays away from the gap.
   - Fit a knob or lever on both faces. Sükhee "turns the knob and pushes".
   - Add custom properties on the hinge: `open_angle_deg` with the safe range, and `opens: "inward"`.
   - Keyframe nothing. Leave the leaf closed at rest.
2. **Low wooden bench `Home.LowBench`.**
   - About 1.2–1.4 m long, about 0.40 m high, a plain wooden bench.
   - It must already be **visible in EP01** (no prop that appears from nowhere), so put it in the corridor or entry near the coats and shoes, where guests could sit to take off boots. It must **not narrow the exit route** below 0.8 m.
   - Also add an empty `ANCHOR.BENCH_BRACE` showing the EP02 brace pose: the bench on the **hall side** of the closed leaf, legs wedged against the opposite corridor wall (x = 0). The corridor is 1.5 m wide.
   - Measure whether the bench length fits that span, and report the numbers.
   - **Physics note to report honestly:** a brace on the hall side stops the leaf being forced *outward* (an infected body slamming the door toward the hall). It does **not** stop the leaf being pulled *inward*. Model it as the spec says, and state in your report exactly what it can and cannot resist. Don't change the story to solve it.
3. **12–18 actor marks** as empties named `ANCHOR.<WHO>_<BEAT>`, made the way `markers()` makes them (ARROWS, in `HOME | action anchors`). At least:
   - Ganaa: in the living room at the mittens beat, the involuntary step toward the bedroom sound, and the inside brace.
   - Altan: at the mittens beat, then at the exit.
   - Tsetsegmaa: stopping Tungalag, then pulling Altan out.
   - Dulmaa: holding the front door.
   - Tungalag: heading for the bedroom, and at the infant.
   - Sükhee: approaching, then pushing.
   - A guest bracing the bench.
   - 2–3 guest positions in the living room.
   - Mark the second mitten's spot on the cake table: `ANCHOR.MITTEN_2_TABLE`.
4. **Six proof cameras** `Home.Check_a` … `Home.Check_f`, one per check (a)–(f) in the spec's "Blocker" section, each framed so a person can judge it.
   - (e) is a sound check, so frame the kitchen door from the living-room crowd position and record the straight-line distance plus the walls in between, as numbers in the report.
   - Also add a plan camera render that shows the door swing arc, the bench brace and the exit routes drawn as simple coloured strips or curves in a hidden-in-final-render collection `HOME | QA overlays`.

## Automated checks (add to `verify_in_blender.py`, record in `qa-report.json`, assert in `check_map.py`)
- `apartment_kitchen_door_swing`: the leaf's swept volume from 0° to its full open angle stays inside the kitchen (x < −1.5) and hits no kitchen prop.
- `apartment_kitchen_not_exit`: the bedroom → entry and living room → entry routes don't cross the kitchen interior. Extend the existing route-sampling approach.
- `apartment_exit_clear_with_bench`: the exit route keeps at least 0.8 m clear width both with the bench at rest and with the bench in the brace pose.
- `apartment_bench_brace_fit`: the bench length versus the corridor span, and the contact points (door face and opposite wall).
- Keep all 11 existing checks passing.

## Renders (evidence for the manager)
- Use Eevee or Workbench, 960×540, saved to `assets/maps/episode-1/previews/door-checks/check_a.png` … `check_f.png` and `plan.png`. Hide the ceiling.
- Make a second set with the door at 25° open (the EP01 freeze, "opens a fraction"): `check_a_open25.png`.
- Re-export `glb/apartment.glb` through the verify script, so the hashes in `qa-report.json` match.

## Done when
- `python3 assets/maps/episode-1/check_map.py` passes and `npm test` passes.
- The renders exist.
- The report gives numbers for the swing, the brace fit, the clear widths and the (e) distance.

## Allowed paths
`assets/maps/episode-1/**` only. Don't touch `assets/maps/naran-city/`, `src/`, `artifacts/`, or other docs.
