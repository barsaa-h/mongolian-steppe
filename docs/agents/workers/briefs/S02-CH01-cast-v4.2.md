# Brief S02 + CH01a — Reconcile the EP01 cast with the v4.2 script and draft DNA for the missing roles

**Departments:** story (S02 in `docs/agents/01-story-continuity.md`) and characters (CH01 in `docs/agents/02-characters.md`).
**Why now:** the current cast list was made from the v4.0 *beat sheet*. The locked dialogue is now the **v4.2 script**, which adds roles, names some (the cousin is Tungalag; the Russian loader is Pasha) and cuts others (no pharmacy). The birthday vertical slice (M2) needs a correct roster.

**No Blender in this job.** Another worker is using Blender. Don't run `build_actor.py`, `build_all.py` or anything else that launches Blender. DNA drafting and compiling are pure Python (`artifacts/character-master/scripts/dna.py`), so use only those.

## Read first
1. `artifacts/character-master/DNA.md`: the whole workflow, the DNA fields, the identity rules and the `dna.py` commands.
2. `AGENTS.md`, the "Character work" section: every character needs a full DNA with an individual face, age, body, skin and 2–3 visible signature traits.
3. `artifacts/character-master/production/EP01-v4-CAST.md`: the current cast (v4.0).
4. `artifacts/character-master/sources/story/EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md`: **the authority** for who appears and what they say.
5. `artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv`: every speaking cue with its speaker. Use it to make sure no speaking role is missed.
6. `artifacts/episode-1-cast/cast.json` and `artifacts/episode-1-cast/dna/*.json`: the existing actors.

## Part 1 — S02: `artifacts/character-master/production/EP01-cast-v4.2.md` (new file)
- Make one table of **every speaking or visible role in v4.2**, with these columns: v4.2 name as written (Mongolian/Russian + Latin), actor ID, scenes, number of lines (from the manifest), script facts (only what v4.2 states), status (`existing` / `renamed` / `new draft` / `voice only`).
- Known changes to verify against the script:
  - Tungalag = `cousin`
  - Pasha, the Russian loader = `yard-loader`
  - new roles: bus driver, passenger, boy, kiosk seller, neighbour at the door, older neighbour woman, car driver, Hürel's kitchen helper, second driver (who runs out the back door), bleeding man at the hospital gate, orderly (ЖИЖҮҮР)
  - voice only: dispatcher and radio
- If v4.2 shows things differently from this list, **the script wins**. Note each difference.
- **Cut:** the pharmacist (v4.2 has no pharmacy). Keep the files, and mark the role `cut in v4.2` in the table.
- Check whether Nyamka, Bataa and Togoo still appear in v4.2 under those names. Record what the script actually says.
- Add a section **"M2 birthday slice roster"**: the roles needed for the birthday 90 s + kitchen door 64 s (see `artifacts/character-master/sources/story/v4.3-timing/01_BIRTHDAY_WARMTH_90s.md` and `02_KITCHEN_DOOR_64s.md`). For each role, give its actor ID and whether a built actor folder already exists in `artifacts/episode-1-cast/<id>/`. Note that the infant has no actor yet.
- Keep script facts and artistic choices clearly separate: label every age or look you choose as an artistic choice.

## Part 2 — CH01a: DNA drafts for the new visible roles (no builds)
- For every **visible** role with no actor, create `artifacts/episode-1-cast/dna/<new-id>.json` with `dna.py draft`, using an existing DNA of the right base as the template. Pass a distinct `--seed` and `--against artifacts/episode-1-cast/dna`, and re-roll any draft that's too close to the cast.
  - Use kebab-case IDs: `bus-driver`, `kiosk-seller`, `hurel-helper`, `gate-bleeding-man`, `orderly`, and so on.
  - A role that's voice only or only seen from far away doesn't need DNA. List it in the table instead.
- Then edit each draft by hand to fit the script: age, base (M/F/C), clothing era (Naran, 1998, autumn, working people) and **2–3 visible signature traits** that tell the viewer who they are. Then run `dna.py compile` on each file to validate it, writing the recipe to `/tmp`.
- `cousin`: change the display name or metadata to **Tungalag**. Keep the ID `cousin` so the built files and links don't break.
- `yard-loader`: this is **Pasha, Russian**. Adjust the palette and casting labels in his DNA to match, the way Irina and Dasha are handled (see the note on casting labels in DNA.md).
- Add a matching entry to `artifacts/episode-1-cast/cast.json` for each new draft, following the existing entries' shape. Leave anything about built output paths absent or marked unbuilt, as appropriate.
- All new DNA stays `draft`. Only the user approves.

## Done when
- `dna.py compile` succeeds for every new or edited DNA file. Paste the command and the result lines.
- The distance or distinctiveness output from `draft --against` shows no new face too close to an existing one. Paste it.
- `npm test` passes.
- The report lists: the new IDs, the roles left without DNA and why, the differences you found between v4.0 and v4.2, and the M2 roster with what still needs a Blender build.

## Allowed paths
- New file `artifacts/character-master/production/EP01-cast-v4.2.md`
- `artifacts/episode-1-cast/dna/*.json` (new files, plus edits to `cousin.json` and `yard-loader.json` only)
- `artifacts/episode-1-cast/cast.json`

Nothing else. Never edit anything under `artifacts/character-master/sources/`.
