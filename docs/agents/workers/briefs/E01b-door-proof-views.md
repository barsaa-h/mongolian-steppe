# Brief E01b — Fix the kitchen door proof views (round 2 of E01)

You already did E01 in this worktree. The manager re-ran `check_map.py` and `npm test` (both pass) and confirmed the other three scenes are untouched. **The geometry, checks and numbers are accepted. Don't redo them.** Read your round-1 work in `assets/maps/episode-1/build_apartment_door.py`, `render_door_checks.py` and `verify_in_blender.py` first.

New story rule since round 1: **the infected never use door handles; they push and slam.** The hall-side bench brace therefore holds against Ganaa slamming outward, which is the intent. You don't need to argue the physics again.

## What to fix

1. **Make the door leaf solid.** In the renders, the kitchen door leaf shows see-through horizontal slits, like glass or gaps between the panels. It must be a **solid painted wooden panel door**, with no glass and no see-through gaps. Glass would break the story, because an infected slamming it would smash through. Keep the knob on both faces and the hinge setup. Re-check the triangle budget.

2. **Re-frame the six proof cameras** so that a person who has never seen the set understands each check from one image.
   - Use eye height of about 1.5–1.65 m and 18–28 mm lenses, and keep the subject plus its context in frame.
   - Don't put cameras against a surface. No frame may be more than about 40% wall.

   | Camera | Required in frame |
   | --- | --- |
   | `check_a` | Taken from Sükhee's push position in the corridor, looking at the kitchen door. You see the corridor floor, the door frame, the knob, and enough of the corridor walls to read where you are. Render it **closed** and **at 25° open** (`check_a_open25.png`). In the open render, the dark gap and the leaf edge moving away *into the kitchen* must be obvious. |
   | `check_b` | Both ends of the braced bench in one frame: the bench touching the **hall face of the kitchen door** and its other end on the opposite wall. Use a wide, high corner view if needed. |
   | `check_c` | From the bedroom doorway: the bed with the infant blanket, and the route back out to the corridor. |
   | `check_d` | A readable view of the whole exit route: living-room door → corridor → front door → landing/stairs. Use a cutaway (ceiling hidden) from high three-quarters, plus coloured route overlay strips if they help. |
   | `check_e` | From the living-room crowd position toward the kitchen door, at standing eye height: the open living-room doorway, the corridor and the closed kitchen door visible beyond. |
   | `check_f` | The door **fully open (−90°)** inside the kitchen, framed from the corridor or a high angle, so you can see that the open leaf stays inside the kitchen and the corridor floor stays clear. |

3. **Add a contact sheet** `previews/door-checks/contact_sheet.png`: all eight images in a grid, each with a short text label (for example "a: Sükhee's push view, closed"). You can build it with Blender's compositor or Python with Pillow if it's installed; check first.

4. **A staging note for the animation team.** With the bench braced, the corridor is closed at seat height and people step over a 0.40 m seat. Add a short "Staging order" paragraph to `assets/maps/episode-1/README.md`:
   - Tungalag with the infant and the first exit group pass the kitchen door **before** the bench goes in.
   - Only Sükhee and the injured guests step over it.

## Renders and checks
- Use Eevee at 960×540 with the ceiling hidden, as before. Look at every image yourself and re-frame any that fail the table above before you report.
- Re-run `verify_in_blender.py` headless so the QA hashes match the saved blend and the GLB. Then run `python3 assets/maps/episode-1/check_map.py` and `npm test`.
- Leave the door closed and the bench at rest when you save.

## Allowed paths
`assets/maps/episode-1/**` only. End with the standard report.
