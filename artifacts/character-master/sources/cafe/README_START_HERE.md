# ХАНИАД — Episode 1: Hürel's Café / 84-second Vertical Slice

**Build:** v1.0 · **Canon:** EP01 production-directed screenplay v2.1 + 10-episode Season v3.0. **Status: camera / environment / actor blocking prototype; not a completed animation.**

## What is included

- `3d/hurel_cafe_graybox_v1.glb` — importable, 1:1-metre café and forecourt blockout, with the counter, side store, stove, heater, truck/petrol-pump placeholders, 5 color-coded figures and 1998-style spatial assumptions. No finished textures or character rigs.
- `blender/build_hurel_cafe_animatic.py` — Blender-only scene builder: imports GLB, makes 11 shot cameras, cuts via timeline markers, animates simple proxy actor roots, sets baseline lighting and saves a `.blend` into `blender/`.
- `data/scene_manifest.json` — machine-readable canonical shot timing, cameras, dimensions, actor paths, continuity constraints.
- `data/shot_list.csv`, `data/recording_and_dialogue_cues.csv`, `data/sound_events.csv` — editorial, voice and sound-guide tables.
- `maps/cafe_floorplan_1m_grid.png`, `previews/shotboard_schematic.png` — **schematic diagrams** (not rendered storyboard frames).
- `docs/DIRECTORS_BOOK.md` — performance and pacing notes, craft priorities, known risks, acceptance tests.
- `docs/ASSET_AND_RIG_INTEGRATION.md` — instructions for importing the existing user-built character rigs, props and clothing.
- `docs/CONTINUITY_CHECK.md` — exact EP1/EP8 evidence and physical story constraints.
- `build_cafe_pack.py` — rebuild GLB/diagrams/JSON/shot CSV (standard Python + numpy, trimesh, Pillow).

## Blender build: 2 ways

**GUI**: Open Blender > Scripting > Text Editor > Open `blender/build_hurel_cafe_animatic.py` > Run Script.

**CLI**: From this project folder, run:

```bash
blender --background --python blender/build_hurel_cafe_animatic.py
```

This produces `blender/EP01_Hurel_Cafe_ANIMATIC_v1.blend` on **your** machine. A `.blend` was not generated inside this package because Blender is not installed in the authoring environment; the Python script has been syntax-tested, but **must be runtime-tested in Blender**.

Open the `.blend`, go to **camera view (Numpad 0)**, play frames **1–2016** at **24fps**. The 11 camera-cut markers are on the timeline. Start with image sequence preview at 1280×720, low samples. Do not render the whole 84-second sequence until spot-checking camera framing and scale.

## Scope of this 84-second scene

From Ganaa entering Hürel's café through the debt teasing, Hürel noticing Dasha, sudden contact, Ganaa's shout, and first physical reaction. Covers **spoken cues E01-D023 to E01-D033 exactly**. The truck chase, wrist bite, petrol spill, fire, and pickup are a **separate action-blocking test** and are not claimed as produced here.

All text in the dialogue cue CSV is copied from the previously approved v2.1 voice sheet. **Timing is provisional** until real voiced performances are available.

## Coordinate conventions

Metres; X east, Y north, Z up. Café interior measures **14m × 10m**, front entrance on south (Y=-5), kitchen to northwest, counter west, heater east, KAMAZ on south forecourt. These are proposed dimensions pending character scale and continuity tests, not historical measurements.

## Definition of prototype complete (NOT already passed)

1. Blender build runs without errors and all eleven camera cuts point at intended action.
2. Import at least one of the user's *actual character rigs*; foot placement and 1.65–1.9 m standing scale verified.
3. Every line E01-D023–D033 is delivered by a real voice and retimed; no missing dialogue and no rushed overlap.
4. Hürel/Dasha contact is feasible with hand, head and counter clearances; blocking preserves dramatic readability.
5. Ganaa's route from table to the south door is unobstructed.
6. The pre-fire café geometry, KAMAZ position, satchel zone and EP08 return are geographically consistent.
7. Render 4 representative frames and measure seconds/frame, memory and facial readability in final material tests.
8. Sound has licensed/original ambiences and Foley. Placeholder list is not a mix.

**First human review:** import GLB and attach Ganaa, Hürel and Dasha's real models; approve room width, counter height, and camera eyelines *before* any detailed prop modeling.
