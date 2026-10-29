# Brief V01 — Self-voicing kit for the user (no Blender, no audio processing)

**Department:** sound & voice (`docs/agents/07-sound-voice.md`, tasks V01 and V02a). The user will **voice every role themselves**, after the animation is finished:
- They're a native Mongolian speaker.
- Paid TTS is out.
- They don't want their voice recognised.
- They can't scream at home.
- They have no female voice of their own; female and child roles will need voice conversion later.

This kit makes recording easy and consistent. It's for a person, not a machine: write in plain, short English, and keep all Mongolian and Russian dialogue **exactly** as written.

## Read first
1. `docs/agents/07-sound-voice.md`, all of it, especially V01, V02 and V02a (the disguise and no-scream rules, and the starting presets).
2. `episodes/EP01/script/EP01-cues.csv`: the 197 cues with `actor_id`, language and direction.
3. `artifacts/character-master/production/EP01-cast-v4.2.md`: who each role is.
4. `artifacts/character-master/sources/story/v4.3-timing/01_BIRTHDAY_WARMTH_90s.md` and `02_KITCHEN_DOOR_64s.md`: performance directions for the test scenes.
5. The "Dialogue voice" rules in `docs/agents/01-story-continuity.md`: natural, rough Mongolian, no polishing.

## Deliverables (all under `episodes/EP01/audio/kit/`)
1. **`RECORDING_GUIDE.md`**, at most 2 pages:
   - **Setup:** a quiet room, soft furnishings, the same mic distance every time (one hand-span), 48 kHz/24-bit WAV, no processing while recording, and 10 s of room tone at the start of every session.
   - **Workflow:** one character per session, so the voice stays consistent.
   - **File naming:** `EP01-VO-###_take##.wav` into `episodes/EP01/audio/dialogue/`.
   - **Disguise:** a different way of speaking per role (rhythm, placement, accent) plus timbre change in post. Never publish raw takes. Do a blind listener test with someone who knows the user's voice.
   - **No-scream technique:** three layers. A close-mic breathy line, a separate short gasp or strained exhale, and an effect mixed underneath. Never strain the voice.
   - **Free tools:** Audacity (recording plus pitch/EQ), Praat (Change Gender, formant ratio about 1.1 as a starting point for female roles), RVC/Seed-VC (later tests, models the user has rights to only). State honestly that none of these guarantees anonymity.
2. **`voice-cards/<actor_id>.md`**, one per speaking role:
   - who they are (from the cast file, in 2 lines);
   - age;
   - rhythm and energy;
   - pitch-direction starting preset (from V02a, marked "starting point, test it");
   - how they differ from the closest other voice the user also plays;
   - 2 reference lines copied exactly from the cues;
   - the number of cues.
   Principals get the full card. One-to-two-line roles get a 4-line mini card.
3. **`recording-checklist.csv`**: every cue grouped by character (the session order), then by beat. Columns:
   - `session`, `actor_id`, `cue`, `beat`, `language`, `line` (exact), `direction`;
   - `intensity`: calm, tense or panic; derived from the direction text and labelled as derived;
   - `layering`: `yes` where the direction implies screaming or attack sounds that should use the no-scream layers;
   - `done` (empty), `take_file` (empty).
   Generate it with a small standard-library script `episodes/EP01/tools/make_recording_checklist.py` from `EP01-cues.csv`, so it can be regenerated.
4. **`TEST_SESSION.md`**: a 10-minute first test for *before* the animation is done, to pick the voice pipeline early:
   - 15–20 s of Ganaa and 15–20 s of Tsetsegmaa from the birthday scene;
   - the exact cue IDs and lines;
   - what to try in Audacity and Praat;
   - how to compare the results: naturalness, Mongolian pronunciation, artefacts, recognisability.

## Done when
- The script regenerates the checklist identically.
- Every one of the 197 cues appears exactly once in the checklist, with text byte-identical to `EP01-cues.csv`. Add this check to the script, run it and paste the output.
- There's one voice card per speaking `actor_id`.
- `npm test` passes.

## Allowed paths
`episodes/EP01/audio/kit/**` and `episodes/EP01/tools/make_recording_checklist.py`. Nothing else.
