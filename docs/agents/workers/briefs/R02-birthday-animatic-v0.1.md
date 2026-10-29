# Brief R02 — EP01_BIRTHDAY_ANIMATIC_v0.1 (Blender, the M2 vertical slice)

**Department:** layout, edit & render (`docs/agents/08-layout-edit-render.md`, R02). **This is the project's first real animation test**: a **silent, subtitle-timed** animatic of the 90 s birthday scene plus the 64 s kitchen-door scene, in grey or simple-material layout. Its purpose is to judge staging, cameras and pacing: does the audience feel warmth for Ganaa, and does it turn frightening without cheap scares? **It is not final animation, lighting or lip-sync.** Voices come much later, from the user.

You're the only Blender job right now. Run one Blender process at a time, Eevee only, at **960×540 for previews**.

## Inputs (all in the repo)
- **Shot plan:** the rows in `episodes/EP01/shotlist.csv` with `scene` = birthday/door (15 shots, B23_S001…B26_S004): start/end, 12-frame handles, lens, tier, actors, props, line IDs and one-line camera intent in `notes`. **This is your shot list.** If a shot can't work as written, change it, and record why in the report and in the `notes` column.
- **Subtitles:** `episodes/EP01/animatic/birthday_90s.mn.srt` and `door_64s.mn.srt`.
- **Set:** `assets/maps/episode-1/EP01-Map.blend`, scene `EP01_Apartment`. It has the kitchen door (`Home.KitchenDoorHinge`, which opens inward with negative Z), the bench (`Home.LowBench`), and the `ANCHOR.*` actor marks: GANAA_MITTENS, ALTAN_MITTENS, MITTEN_2_TABLE, GANAA_STEP_TO_CRY, TUNGALAG_TO_BEDROOM, TSETSEGMAA_STOPS_TUNGALAG, GANAA_INSIDE_BRACE, DULMAA_HOLDS_DOOR, TSETSEGMAA_PULLS_ALTAN, ALTAN_EXIT, TUNGALAG_INFANT, SUKHEE_APPROACH, SUKHEE_PUSH, GUEST_LIVING_1..3, and others.
- **Actors:** `artifacts/episode-1-cast/<id>/Character-Master.blend` for ganaa, altan, tsetsegmaa, dulmaa, cousin (= Tungalag), sukhee, plus 3–6 `party-*` guests. They share the 137-bone rig.
- Story context: `artifacts/character-master/sources/story/v4.3-timing/01_BIRTHDAY_WARMTH_90s.md` and `02_KITCHEN_DOOR_64s.md`, the blocking spec `artifacts/character-master/sources/story/v4.2-pack/ENDING_B_EP02_APARTMENT_BLOCKING_v4.2.md`, and `episodes/EP01/script/EP01-states.md`.

## Story rules (hard)
- Ganaa's bitten wrist is the **left** one: wrapped, sleeve pulled down. He gives the mitten with his **right** hand and keeps the left away from Altan.
- Altan is a 3-year-old girl. She ends with **one mitten on**; the second stays on the table at `ANCHOR.MITTEN_2_TABLE`.
- Tungalag's infant is **never framed**; it's only heard, as a marker for now.
- The kitchen door opens **inward**. Ganaa steps inside and pulls it shut, bracing with his right hand and shoulder. Sükhee turns the knob and **pushes**. The door gives a fraction (under 10°), then **cut to black before it opens or any bite**.
- Infected don't use handles (not relevant yet: Ganaa is still fighting the infection).
- No jump scares. Hold the ROOM/DOOR cues.

## Build
1. **`episodes/EP01/shots/EP01_BIRTHDAY_ANIMATIC_v0.1.blend`:**
   - **Link**, don't append, the apartment scene and the actor collections, so set and actor fixes flow through. If linking a rigged actor breaks posing, use library overrides; check how the existing Ganaa studies (`artifacts/episode-1-cast/scripts/block_ganaa_*.py`) set up and pose actors, and reuse that.
   - Use 24 fps, 1920×1080 output settings (preview renders at 50%), and one scene with timeline markers per shot, or one camera per shot bound with markers.
   - Write it as a build script, `episodes/EP01/tools/build_birthday_animatic.py`, run headless, so it can be regenerated.
2. **Cameras:** one per shot named `CAM_<shot>`, with the lens from the shot list, at a believable height (child height where the notes say so), and composition matching the `notes`. Keep handles: the shot's camera holds 12 frames before and after its range.
3. **Body blocking, deliberately rough** (poses on key frames, stepped or Bezier, about 1 key per 0.5–1 s):
   - each actor starts on their anchor;
   - Ganaa sits or crouches at child height for the mittens, hands the mitten over, pulls the left hand away when Altan reaches for it, steps toward the cry, veers into the kitchen, and braces;
   - Tsetsegmaa stops Tungalag, then pulls Altan;
   - Dulmaa goes to the front door;
   - Sükhee approaches and pushes;
   - the door hinge is animated for the fraction-open moment.
   Mouths stay neutral; there's no lip-sync.
   Guests stand at their anchors, with small idle shifts at most.
4. **Subtitles burned in:** Mongolian, from the SRTs, at the right times. Use Blender VSE text strips or composite them in ffmpeg. Use a readable font with Cyrillic: check that a font with Mongolian Cyrillic (ө, ү) is available, for example DejaVu Sans.
5. **Output** (`episodes/EP01/animatic/`):
   - `EP01_BIRTHDAY_ANIMATIC_v0.1.mp4`: both scenes back to back, about 154 s plus a 1 s black gap, 960×540, H.264, silent. Render with Eevee to PNG frames in `episodes/EP01/renders/animatic_v0.1/` (git-ignored), then encode with ffmpeg. Render in chunks; it's fine to render on 2s (every other frame, held) to save time, but say so.
   - `contact_sheet_v0.1.png`: one frame from the middle of each shot, labelled with the shot ID and lens.
   - Update `status` to `layout` in the shot list for the shots you made.

## Self-check before reporting
- Watch the frames yourself, via the contact sheet plus spot frames:
  - Is every actor where the shot says?
  - Is no camera inside a wall?
  - Are the faces visible when the notes say CU or MCU?
  - Is the left wrist kept away from Altan?
  - Is there one mitten on and one on the table?
  - Does the door open inward only a fraction before the black?
- Check the subtitle timing against the SRT on 3 spot frames.
- `npm test` passes, and the existing `assets/maps/episode-1/check_map.py` still passes. You must not save over the map; it's linked.

## Allowed paths
- `episodes/EP01/shots/**`, `episodes/EP01/tools/build_birthday_animatic.py`
- `episodes/EP01/animatic/**`
- `episodes/EP01/shotlist.csv` (only the status/notes of these 15 rows)
- `episodes/EP01/renders/**` (ignored)

Don't modify actor folders, the map or sources. Report the measured runtime, the render time, the shots you changed, and honest weak spots.
