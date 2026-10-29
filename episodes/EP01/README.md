# EP01 episode plan

`shots/` holds future B<beat>_S<nnn>.blend files; each will link the set, actors, props and lighting rather than append them. `animatic/` holds subtitle tracks and future edits; `edit/` holds edit project files; `script/` holds production script material; `renders/` holds ignored render output. `tools/` contains the plan generator and its editorial camera choices.

Shotlist S000 rows are beat placeholders using the v4.0 episode target times, not an established edit. Other rows use scene-relative v4.3 times at 24 fps, with exclusive end times and 12-frame handles on dialogue shots. Handles may extend beyond the scene boundaries. Regenerate with `python3 episodes/EP01/tools/build_birthday_plan.py`; cue groups in the camera notes are editorial choices and should be reviewed when timings change. Delivery is 1920×1080 at 24 fps. The apartment source is `assets/maps/episode-1/EP01-Map.blend`, scene `EP01_Apartment`.
