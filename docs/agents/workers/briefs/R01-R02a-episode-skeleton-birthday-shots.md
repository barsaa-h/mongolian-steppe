# Brief R01 + R02a — EP01 episode skeleton and the birthday/door shot plan (no Blender)

**Department:** layout, edit & render (`docs/agents/08-layout-edit-render.md`, tasks R01 and the planning half of R02). **Milestone:** M2, the birthday vertical slice: a **silent, subtitle-timed** animatic of the 90 s birthday scene plus the 64 s kitchen-door scene. Voices come much later (M7), when the user records every role, so **every dialogue shot needs handles** (spare frames) for retiming.

**No Blender in this job.** Another worker is using it. This job produces files, data and small scripts only.

## Read first
1. `docs/agents/00-production-master-plan.md` §2–§3: the look tiers T0/T1/T2, the YouTube delivery spec (1920×1080, 24 fps) and the animation-first pipeline.
2. `docs/agents/08-layout-edit-render.md`: the shot file convention and the `shotlist.csv` columns.
3. The timing for the two scenes:
   - `artifacts/character-master/sources/story/v4.3-timing/VOICE_EDIT_TIMELINE_v4.3.csv`: 19 birthday cues and 13 door cues, with in/out times, speaker, mood, blocking and editor notes.
   - `01_BIRTHDAY_WARMTH_90s.md` and `02_KITCHEN_DOOR_64s.md` in the same folder.
4. `artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv`: the official cue IDs `EP01-VO-###`. These are the only IDs used downstream.
5. `artifacts/character-master/sources/story/EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md`, beats 21–26, and `artifacts/character-master/sources/story/EP01_25min_Scene_Beats_v4.0.csv`, which holds the 26 beats.
6. `artifacts/character-master/sources/story/v4.2-pack/ENDING_B_EP02_APARTMENT_BLOCKING_v4.2.md`: the locked door beats.
7. `assets/maps/episode-1/README.md`: the apartment set `EP01_Apartment` in `EP01-Map.blend`. Its actor marks are empties named:
   `ANCHOR.GANAA_MITTENS ANCHOR.ALTAN_MITTENS ANCHOR.MITTEN_2_TABLE ANCHOR.GANAA_STEP_TO_CRY ANCHOR.TUNGALAG_TO_BEDROOM ANCHOR.TSETSEGMAA_STOPS_TUNGALAG ANCHOR.GANAA_INSIDE_BRACE ANCHOR.DULMAA_HOLDS_DOOR ANCHOR.TSETSEGMAA_PULLS_ALTAN ANCHOR.ALTAN_EXIT ANCHOR.TUNGALAG_INFANT ANCHOR.SUKHEE_APPROACH ANCHOR.SUKHEE_PUSH ANCHOR.BENCH_BRACE ANCHOR.GUEST_BRACE_BENCH ANCHOR.GUEST_LIVING_1..3`
   The existing set cameras are `Home.Party`, `Home.Check_a`…`Home.Check_f` and `Home.Plan`.

## Story rules that matter here
- Ganaa's bitten wrist is the **left** one. He keeps it away from Altan; his right is his "good hand".
- The kitchen door opens **inward**. Sükhee turns the knob and **pushes**.
- **Cut to black at the EP01 end before the door actually opens.** The door only "opens a fraction". No bite is shown in EP01.
- The infected never use door handles.
- Altan is a 3-year-old girl.
- Tungalag's infant is only heard (crying from the bedroom). There's no infant model, so never frame the infant.
- Lens and blocking serve the subtext: warm and wider for the party, tighter as Ganaa's control slips. No cheap jump scares, and `[SILENCE]` or ROOM cues are held, not filled.

## Deliverables
1. **Episode skeleton** `episodes/EP01/`:
   - Folders `shots/`, `animatic/`, `edit/`, `script/`, and `renders/` (git-ignored already via `episodes/*/renders/`; check that).
   - A short `episodes/EP01/README.md` explaining the folders, the shot naming `B<beat>_S<nnn>`, and that shot `.blend` files will **link** the set and actors.
2. **`episodes/EP01/shotlist.csv`** with the columns from 08's plan: shot, beat, start/end, lens, tier, location, time of day, actors, props, line IDs, renderer, status, approval.
   - **Beat-level rows for all 26 beats** (shot = `B<nn>_S000`, a placeholder) with location, time of day (from `artifacts/character-master/sources/story/v4.2-pack/STORY_CLOCK_INFECTION_LOGIC_v4.2.md`), main actors and status `planned`.
   - **Full shot breakdown for the birthday 90 s and the door 64 s**, in the beats they belong to (check the v4.2 script for which beats those are). Each shot needs:
     - start/end on the v4.3 timeline (scene-relative, plus `HH:MM:SS:FF` at 24 fps), and **handles of 12 frames at each end of every dialogue shot**;
     - a lens in mm and a shot size (WS/MS/MCU/CU/ECU);
     - the tier (T0 for face and hand close-ups such as the mitten hand-off, the left wrist and the door handle; otherwise T1);
     - the actors with the anchor each one starts on;
     - props (mittens, paper crown, cake, bench, door);
     - the line IDs as **EP01-VO-### from the manifest**: match each timeline cue to a manifest cue by its spoken text, and list any cue that doesn't match;
     - the renderer `eevee`;
     - status `layout-planned`.
   - Aim for roughly 14–22 shots across the two scenes. Write a one-line camera intent per shot in a `notes` column, for example "MCU Ganaa at child height, right hand offers mitten, left sleeve down over the wrist".
3. **Subtitles:** `episodes/EP01/animatic/birthday_90s.mn.srt` and `door_64s.mn.srt`, in Mongolian, exactly as spoken in the timeline. **Never alter dialogue**: protected lines and swearing stay exactly as written. ROOM/DOOR/SFX cues get no subtitle. Leave English subtitles for later; don't translate.
4. **A generator script** `episodes/EP01/tools/build_birthday_plan.py` (standard library only), which makes the SRTs and the birthday/door rows from the source CSVs, so the plan can be regenerated after the user's voice recordings change the timings. Commit the output it produces. Hand-written camera notes may live in a small `episodes/EP01/tools/birthday_camera_notes.csv` that the generator merges in.
5. **A test** `tests/episode-plan.test.mjs` (node:test, like the existing `tests/*.test.mjs`) that checks:
   - every timeline cue appears in exactly one shot;
   - the shots in each scene tile its duration with no gaps or overlaps (excluding handles);
   - every line ID exists in the manifest;
   - the SRT cue count equals the number of spoken (non-ROOM/DOOR/SFX) cues.

## Done when
- `python3 episodes/EP01/tools/build_birthday_plan.py` regenerates identical files.
- `npm test` passes, including the new test.
- The report lists the shot count per scene, any timeline↔manifest mismatches, and anything in the v4.3 timing that conflicts with the v4.2 blocking spec.

## Allowed paths
`episodes/EP01/**` and `tests/episode-plan.test.mjs`. Nothing else. Never edit `artifacts/character-master/sources/`.
