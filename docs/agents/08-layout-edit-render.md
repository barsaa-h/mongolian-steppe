# 08 — Layout, edit & render agent

**Mission:** turn the script into shots. That covers cameras, staging, the animatic, the render farm on this one laptop, and the edit. Shot files are where every department's work comes together.

**Owns:** `episodes/EP01/` (`shots/`, `animatic/`, `edit/`, `renders/` (git-ignored), `shotlist.csv`), `scripts/render-*`, `scripts/inspect-*`, the legacy film player (`film.html`, `src/film.js`, `src/scenes.js`, `src/scenePlayer.js`, `src/filmTimeline.js`).
**Inputs:** 01's clock/states/cues, the 03 sets, the 02 actors, the 04 props, the 05 rigs and grade, the 06 actions, the 07 audio.

## Shot file convention
`episodes/EP01/shots/B<beat>_S<nnn>.blend` (or one file per beat with a scene per shot). Each shot **links** the location, actors, props and light rig, and holds only the camera, actions and overrides. Every shot has a tier (T0/T1/T2) in `shotlist.csv`, which decides which actor/prop variant and which renderer it uses.

`shotlist.csv` columns: shot, beat, start/end (screen time), lens, tier, location, time of day, actors, props, line IDs, renderer, status (layout / anim / light / render / final), approval.

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| R01 | **Episode skeleton** | `episodes/EP01/` layout, `.gitignore` entries for renders, an empty `shotlist.csv` with the 26 beats, and a shot-file template that links the grade and a light rig | open |
| R02 | **Café shot list (M3)** | Beats 15–17 broken into shots from the v4.2 directions. Reuse the [café package](../../artifacts/character-master/sources/cafe/README_START_HERE.md) camera ideas, re-cut to v4.2, and mark which shots are T0 | open |
| R03 | **Café layout + playblast** | Cameras in the `EP01_Cafe` set with 02's real rigs. Measure eyelines, seat heights and doors (JOBS C05). Grey playblast with the scratch audio. | open |
| R04 | **Café proof render (M3)** | Lit, graded and rendered. Time and memory per frame recorded, compared with 05's L05 budget. User shot review. | open |
| R05 | **Full EP01 animatic (M4)** | Do the three test sections first (03:20–05:50, 14:25–18:30, 21:05–25:00), then all 26 beats as grey layout with the scratch read. Export an MP4 + SRT. If a section drags in the silent table read, tighten it before environments get final detail. | open |
| R06 | **Render pipeline** | A background-Blender batch script (one job at a time, resumable by frame range, writes EXR or PNG to `episodes/EP01/renders/<shot>/`), a Three.js deterministic export for T2 shots (extend `scripts/render-film.mjs`), and a contact sheet per shot | open |
| R07 | **Edit & conform** | An edit decision list from `shotlist.csv`, assembled with ffmpeg (or Blender VSE), synced to 07's stems, delivered at 1080p24 with SRT subtitles. The final runtime is whatever the cut needs: never speed actors up to hit 25:00. | open |
| R08 | **Blind screening (M4)** | Run 01's S08 kit and file the results | open |
| R09 | **Legacy film upkeep** | Keep `film.html?scene=hour-five` working while the Ganaa studies are still in use. It is a technical reference, not EP01. | ongoing |

## Rules
- Lens and blocking serve the subtext: wide for the town's routine, tighter as Ganaa's day narrows. Cut to black at beat 26 *before the door opens*.
- Don't show a full zombie kill in beat 01: the flashlight spins into the gravel and the key swings.
- Each shot's status moves forward only on evidence: a playblast, a frame, and the user's approval for `final`.

## Inbox
_(other agents add requests here)_
