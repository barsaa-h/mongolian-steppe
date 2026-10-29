# Brief CH01b — Sharpen, build and QA the new v4.2 cast

**Department:** characters (`docs/agents/02-characters.md`, task CH01, second half). The DNA drafts for the v4.2 roles were made by another worker and reviewed: they compile and pass the distance check. **Their signature traits are too generic** ("Short hair", "Brown coat"), and none of them have been built yet. You are the only job using Blender right now.

## Read first
1. `AGENTS.md`, the "Character work" section, and `artifacts/character-master/DNA.md`, all of it, especially "Identity, age and performance" and "QA and review".
2. `artifacts/character-master/production/EP01-cast-v4.2.md`: the reconciled cast, with script facts per role.
3. `artifacts/character-master/sources/story/EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md`: read each role's scene before writing its traits.

## Actors in scope
- **New drafts:** `bus-driver`, `bus-passenger`, `kiosk-boy` (base child, 7), `kiosk-seller`, `door-neighbour`, `older-neighbour-woman`, `car-driver`, `second-driver`, `gate-bleeding-man`, `orderly`.
- **Edited, needs a rebuild:** `cousin` (now named Tungalag) and `yard-loader` (now Pasha, Russian).

## Step 1 — Sharpen the signature traits (DNA edits only)
For each of the 12, rewrite the 2–3 signature traits so that a viewer could pick that person out of a crowd and the traits come from **who they are in the script**, not from generic clothing. **At least one trait per actor must be a face or body feature.** Clothing doesn't establish identity (see AGENTS.md).
- Make the matching face, body and age parameter changes so the traits are actually visible in the build: a trait written in the DNA must show in the render.
- **Examples of the level wanted (artistic choices; label them so):**
  - The bleeding man at the hospital gate: a forearm he keeps cradling, with a bandage showing when he pulls back the sleeve. The wound must be on his own arm, not a bite on the **left wrist**, which is Ganaa's mark.
  - The orderly: deep eye bags and a night-shift slump.
  - Pasha: a broad Russian face, a broken nose, a big loader's hands and shoulders.
- Keep the script facts exactly as they are in the cast table. Ages and looks you choose are artistic choices.
- Re-run `dna.py compile` on each file, then `dna.py report artifacts/episode-1-cast/dna artifacts/episode-1-cast/diversity-report.json`. Nothing may drop below the threshold.

## Step 2 — Build
- Build each actor with `build_actor.py` as DNA.md shows (`blender -b --factory-startup --python-exit-code 1 -t 6 --python artifacts/episode-1-cast/scripts/build_actor.py -- <id>`).
- **One Blender process at a time.** This laptop has 14 GB of RAM.
- If a draft has no `cast.json` entry or output path the builder needs, check how `build_all.py` and `cast.json` define existing background actors (for example `party-guest-01`), and follow that pattern.
- Save the build logs where the existing logs live (`artifacts/episode-1-cast/build-logs/`).

## Step 3 — QA, as DNA.md prescribes
Run, and paste the result tails:
- `python3 artifacts/character-master/scripts/test_dna.py`
- `python3 artifacts/episode-1-cast/scripts/test_recipes.py`
- the `dna.py report` above
- `python3 artifacts/episode-1-cast/scripts/qa_all.py`, which renders the neutral clay lineup, profiles and expression sheets
- `check_native.py` headless

If `qa_all.py` renders the whole cast and is too slow, see whether it accepts actor IDs. If it doesn't, run it once at the end. Skip `check_browser.mjs` if it can't run inside your sandbox, and say so.

## Step 4 — A review sheet for the user
Make `artifacts/episode-1-cast/qa/v4.2-new-cast-review.png`:
- the 12 actors in **neutral clay, front + profile**, labelled with ID and role;
- a second row with the dressed or skinned build.

Look at it yourself:
- If two faces read as the same person, or a trait isn't visible, change the DNA and rebuild before reporting.
- Check that the 7-year-old `kiosk-boy` reads as a child, not a small adult.

All DNA stays `draft`. Only the user approves.

## Done when
- All 12 build without errors and QA passes.
- The review sheet exists.
- `npm test` passes.
- The report lists each actor's final traits, any QA failures and how you fixed them, plus remaining doubts.

## Allowed paths
- `artifacts/episode-1-cast/dna/<the 12 ids>.json`
- `artifacts/episode-1-cast/<the 12 ids>/` (build output)
- `artifacts/episode-1-cast/cast.json`
- `artifacts/episode-1-cast/build-logs/`
- `artifacts/episode-1-cast/qa/`
- `artifacts/episode-1-cast/diversity-report.json`

Don't touch other actors' DNA or folders, `artifacts/character-master/sources/`, or the shared generator in `artifacts/character-master/scripts/`. If the generator has a bug, report it instead of patching it.
