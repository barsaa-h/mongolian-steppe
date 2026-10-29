# Brief S01 + S03 + S04 + S06 — EP01 story tables (milestone M1, no Blender)

**Department:** story & continuity (`docs/agents/01-story-continuity.md`). These tables are what the animators and layout check against, so an actor never ends up with the wrong wound, prop or mitten in a shot. **Accuracy beats completeness:** every row must trace to the script or a source file. Put anything you are unsure of in OPEN.md instead of guessing.

**No Blender.** Story files under `artifacts/character-master/sources/` are originals: **never edit them**.

## Read first
1. `docs/agents/01-story-continuity.md`: the task rows S01, S03, S04 and S06, and the rules (dialogue voice, infection rules, door handles).
2. `artifacts/character-master/sources/story/v4.2-pack/STORY_CLOCK_INFECTION_LOGIC_v4.2.md`: the working clock and its "fix before lock" items.
3. `artifacts/character-master/sources/story/EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md`: **the authority** for what happens.
4. `artifacts/character-master/sources/story/EP01_25min_Scene_Beats_v4.0.csv`: the 26 beats.
5. `artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv`: the 197 cues.
6. `artifacts/character-master/production/SOURCES.md` (its open items 2–7), `artifacts/character-master/production/EP01-cast-v4.2.md` (actor IDs), `artifacts/character-master/sources/story/v4.2-pack/QA_FINDINGS_AND_FIXES_v4.2.md`, and the EP02 handoff files in `artifacts/character-master/sources/story/` (for S06's EP02 questions).
7. `episodes/EP01/shotlist.csv`: the beat-level rows already exist. Don't edit it; your tables feed it later.

## Fixed facts (never contradict them)
- Ganaa is bitten on the **left wrist** at about 16:35. The kitchen door moment is at about 21:00.
- Infected never use door handles.
- Altan is a 3-year-old girl. At the end she wears one mitten; the other stays by the cake.
- The satchel stays in the disabled KAMAZ. It is disabled, not burned out.
- Tungalag's infant is not Naran.
- Naran in 1998 has no traffic lights.

## Deliverables (all under `episodes/EP01/script/`)
1. **S01 `EP01-clock.csv`.** One row per beat (26) with these columns:
   - `beat`, `title`, `story_time_start` and `story_time_end` (diegetic clock, HH:MM)
   - `elapsed_since_bite` (blank before the bite)
   - `location`
   - `light`: dawn, day, dusk, night or interior practical; take it from the script and the clock, and note your assumptions
   - `weather`
   - `ganaa_infection_stage`, in the clock file's own terms
   - `source`: the file and section each value comes from
   Mark derived values with `~`. Put the clock file's seven "fix before lock" items into OPEN.md (item 4). Add one open check: whether the drop-off-to-apartment walk fits the city plan.
2. **S03 `EP01-cues.csv`.** A derived copy of the manifest with every original column unchanged, plus:
   - `language`: mn, ru or mixed, detected from the text and directions;
   - `subtitle_mn`: for Russian lines, the burned-in `[хадмал]` Mongolian subtitle *if the script provides one*; otherwise mark it `TODO-translate` and **don't invent a translation**;
   - `actor_id`, from the cast reconciliation;
   - `take_file` and `take_notes`, left empty for the user's recordings later.
   Then add a check (Python standard library, `episodes/EP01/tools/check_cues.py`) that the derived file has all 197 cues in order, with original text byte-identical to the manifest.
3. **S04 `EP01-states.md`.** Per beat, for every principal on screen (Ganaa, Tsetsegmaa, Altan, Dulmaa, Dasha, Hürel, Irina, Sükhee, Tungalag):
   - **wounds/body**: Ganaa's wrist clean → bitten → wrapped → soaked, plus sweat, fever, pallor and eyes; Dasha's forearm bandage;
   - **clothing**: torn or bloody sleeve, coat on or off, Altan's paper crown, which mitten is where;
   - **props carried or placed**: the satchel, the mittens parcel in his coat, the bowl, the mutton parcel.
   Use a compact table per beat, or one big table. Every state change cites the script line or direction that causes it. If the script is silent, write "unstated" and put a question in OPEN.md if it matters for a shot.
4. **S06 `episodes/EP01/script/OPEN.md`.** The open-question log. Each entry has: id, question, why it matters (which shot or department), options, a **recommendation**, an owner (story, characters, environments, props, look, animation, sound, layout or **user**) and a status. Include:
   - SOURCES.md items 2–7;
   - the clock's "fix before lock" items;
   - the EP02 plot-hole questions from the EP02 handoff (numbered there as 1–8; check);
   - anything you hit while building the tables.
   Don't re-open decisions already made (the facts above, the door rule, PS2-era look, animation-first, the user voices everything later).

## Done when
- `python3 episodes/EP01/tools/check_cues.py` passes.
- `npm test` passes.
- The report lists: how many clock values are derived (`~`), how many states are "unstated", the OPEN.md entries tagged owner=user (these become questions for the user), and any contradiction you found between the v4.2 script, the clock and the beat CSV.

## Allowed paths
`episodes/EP01/script/**` and `episodes/EP01/tools/check_cues.py`. Nothing else.
