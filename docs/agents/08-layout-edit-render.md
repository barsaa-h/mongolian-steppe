# 08 — Layout, edit & render agent

**Mission:** turn the script into shots. That covers cameras, staging, the animatic, the render farm on this one laptop, and the edit. Shot files are where every department's work comes together.

**Owns:** `episodes/EP01/` (`shots/`, `animatic/`, `edit/`, `renders/` (git-ignored), `shotlist.csv`), `scripts/render-*`, `scripts/inspect-*`, the legacy film player (`film.html`, `src/film.js`, `src/scenes.js`, `src/scenePlayer.js`, `src/filmTimeline.js`).
**Inputs:** 01's clock/states/cues, the 03 sets, the 02 actors, the 04 props, the 05 rigs and grade, the 06 actions, the 07 audio (which arrives only after the animation, at M7).

## Shot file convention
`episodes/EP01/shots/B<beat>_S<nnn>.blend` (or one file per beat with a scene per shot). Each shot **links** the location, actors, props and light rig, and holds only the camera, actions and overrides. Every shot has a tier (T0/T1/T2) in `shotlist.csv`, which decides which actor/prop variant and which renderer it uses.

`shotlist.csv` columns: shot, beat, start/end (screen time), lens, tier, location, time of day, actors, props, line IDs, renderer, status (layout / anim / light / render / final), approval.

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| R01 | **Episode skeleton** | `episodes/EP01/` layout, `.gitignore` entries for renders, a `shotlist.csv` with the 26 beats, and a shot-file template (16:9, 1920×1080, 24 fps) that links the grade and a light rig | **done** 29 Oct (Codex) |
| R02 | **Birthday vertical slice (M2, first)** `episodes/EP01/shots/EP01_BIRTHDAY_ANIMATIC_v0.1.blend` | Uses 03's corrected apartment (E01) and stand-in or real rigs for Ganaa, Tsetsegmaa, Altan, Dulmaa, Tungalag + the infant, Sükhee. Shot list with camera thumbnails. A silent **90 s birthday** edit and a **64 s door** follow-up, timed from the [v4.3 timeline](../../artifacts/character-master/sources/story/v4.3-timing/VOICE_EDIT_TIMELINE_v4.3.csv), with burned-in subtitles and shot handles. Camera views proving door checks (a)–(f) from the [blocking spec](../../artifacts/character-master/sources/story/v4.2-pack/ENDING_B_EP02_APARTMENT_BLOCKING_v4.2.md). An unresolved-collision list. Viewport/Eevee preview quality, not a final render. **User review.** | open |
| R03 | **Café action slice (M4)** | Beats 15–18 as 60–90 s of physical action in `EP01_Cafe`. Reuse the [café package](../../artifacts/character-master/sources/cafe/README_START_HERE.md) camera ideas, re-cut to v4.2. Measure eyelines, seat heights and doors (JOBS C05). | open |
| R04 | **Full EP01 silent animatic (M5)** | All 26 beats in grey layout, with subtitles from the manifest and handles on every dialogue shot. An MP4 + SRT with the measured runtime reported. Don't pad toward 25:00: per the [pacing audit](../../artifacts/character-master/sources/story/v4.2-pack/PACING_AND_TABLE_READ_AUDIT_v4.2.md), a shorter, compelling pilot is better. Run the blind screening (01's S08). | open |
| R05 | **Retime to the user's voices (M7)** | Using 07's measured take durations, adjust holds and handles while keeping natural overlaps and pauses. Record every change in the shot list. | open |
| R06 | **Render pipeline** | A background-Blender batch script (one job at a time, resumable by frame range, writes PNG/EXR to `episodes/EP01/renders/<shot>/`), a Three.js deterministic export for T2 shots (extend `scripts/render-film.mjs`), and a contact sheet per shot. Render in manageable chunks. | open |
| R07 | **Edit, conform, YouTube master (M9)** | An edit decision list from `shotlist.csv`, assembled with ffmpeg or the Blender VSE, synced to 07's stems. 1080p24 finish → 4K upscale upload master + Mongolian/English SRT, per 00 §2. The final runtime is whatever the cut needs: never speed actors up. | open |
| R08 | **Legacy film upkeep** | Keep `film.html?scene=hour-five` working while the Ganaa studies are still in use. It is a technical reference, not EP01. | ongoing |

## Rules
- Lens and blocking serve the subtext: wide for the town's routine, tighter as Ganaa's day narrows. Cut to black at beat 26 *before the door opens*.
- Don't show a full zombie kill in beat 01: the flashlight spins into the gravel and the key swings.
- Each shot's status moves forward only on evidence: a playblast, a frame, and the user's approval for `final`.

## Inbox
_(other agents add requests here)_
