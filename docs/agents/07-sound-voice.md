# 07 — Sound & voice agent

**Mission:** support the user while they voice every role themselves, then make Naran sound inhabited and make silence frightening. Own the dialogue pipeline, effects, ambience, original music and the mix.

**Owns:** `assets/sound/` (effects library, ambiences, music, the family song), `episodes/*/audio/` (dialogue per cue ID, stems, mix), `src/filmSound.js` (the legacy HOUR-5 procedural score).
**Inputs:** the [197-cue recording manifest](../../artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv) (`EP01-VO-###`), the [v4.3 timing pack](../../artifacts/character-master/sources/story/v4.3-timing/), and 08's edit decision list.

## Timing (user decisions, 29 Oct 2026)
- **This department mostly waits until the animation is finished (M7).** Before then, the only sound work is optional, silent-animatic placeholders: room tone and a few effects marking cues the edit needs (the infant crying, the door thud, the kitchen-door sound).
- **The user voices every role personally.** No ElevenLabs or other TTS. Nothing may depend on a paid service.
- **Music:** original only, developed together with the rest of the sound after the animation.

## Sound rules from the scripts
- **No trailer score.** The first 30 seconds of the cold open have no music. They are rail couplings, an idling diesel, a key impact, steam hiss.
- **Ordinary sound tells you how life works:** grit underfoot, wood splitting, a radio under an open window, market bargaining, the bus starter.
- **The radio** keeps saying "flu", and the official wording is part of the story (beats 03, 09, 19).
- **The family song** is an *original*, simple, off-key tune that Ganaa half-sings with Altan's name in it. It stops mid-phrase in beat 24, and its absence returns in EP02. Use no copyrighted song or melody (the earlier "The Chain" idea is out).
- **Beat 17:** a chair scrape and the truck starter, *then* a scream. **Beat 26:** an exhale, a sharp unnatural inhale, cut to black, a spoon clinking once, then silence. **Horror doesn't need screaming.** Close-mic breath and urgency carry it.
- Russian lines get Mongolian `[хадмал]` subtitles burned in. A full Mongolian SRT and an English SRT are uploaded separately to YouTube.

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| V01 | **Self-voicing kit** (prepare before M7) | A per-character voice card (age, rhythm, pitch range, a reference line from the script). A recording guide: a quiet room, a consistent mic distance, 48 kHz/24-bit WAV, one file per cue ID `EP01-VO-###_take##.wav`, a room-tone take per session. A recording checklist generated from the manifest, grouped by character so one session covers one voice. | **done** 30 Oct (Codex): episodes/EP01/audio/kit/ |
| V02 | **Voice-distinction tests** | Audition free, local tools on the user's test lines: Audacity pitch + EQ, Praat formant shift, RVC / Seed-VC voice conversion (only with models the user has rights to). Score each for naturalness and for how distinct the voices sound from one another, with the female adult roles especially in mind. Tell the user honestly that none of these guarantees anonymity. | open |
| V02a | **Disguise and no-scream constraints** (from the user's ChatGPT thread) | The user does not want to be recognised and cannot scream at home. Disguise = a different performance style per role *plus* timbre change; never publish a raw take. Starting presets to test, not to lock: Ganaa −1…−2 st + EQ; Hürel +1…+2 st, more nasal and faster; Tsetsegmaa +4…+7 st with formant ratio ≈1.1 (Praat Change Gender) or female-target conversion; Altan: pitch alone will sound artificial, so use voice conversion or a consenting performer. Fear and attacks are recorded as three layers: a close-mic breathy line, a short gasp or strained exhale, and an effect mixed underneath. Compression and automation make them intense; never strain the voice. RVC wants ≥10 min of clean target audio and runs slowly on CPU. Seed-VC needs only 1–30 s of reference audio but its repo was archived in Nov 2025, so treat it as experimental. Pass test: a person who knows the user's voice listens blind and reports. | open |
| V03 | **Ingest + retime** (M7) | Takes land in `episodes/EP01/audio/dialogue/`. A script checks that every manifest cue has a take, flags missing ones, and reports measured durations to 08 so the shots can be retimed. | open |
| V04 | **The family song** | Melody, hummed and half-sung takes by the user, plus versions: whole, broken off, hummed alone | open |
| V05 | **Ambience beds** | Freight yard pre-dawn, border queue, Naran morning market, apartment party (12–18 people, plus earlier visitors implied), café, livestock cab at night, hospital gate | open (after M6) |
| V06 | **Effects library** | Every effect named in v4.2's directions: keys, flashlight, steam, the dictaphone and rewind, bus starter, kettle, KAMAZ starter/heater/rattles, the bowl on the dash, chair and table, the electrical arc and fire, sheep, bone crack, the door thud/handle/plate scrape, the infant crying. Use free-licensed (CC0/CC-BY, with credits) or self-recorded Foley. | open (after M6) |
| V07 | **Original music** | Sparse and restrained: a theme that also works inside the scene where possible (the radio, the family song). No generic horror stingers. Every cue must be cleared: either composed for the series or under a licence that allows YouTube monetisation. | open (after M6) |
| V08 | **YouTube mix** | Stems for dialogue, effects, ambience and music. −14 LUFS integrated, true peak ≤ −1 dBTP, 48 kHz. Check it on laptop speakers and on headphones. | open (M9) |
| V09 | **EP02 sound** | Hospital: fluorescent hum, the backup-power change-over, the corridor evacuation, the heavy door | open (M10) |

## Rules
- The manifest cue ID is the only key. Never rename a file by hand.
- Every dialogue file records its take number and any processing chain applied.
- Keep the protected lines exactly as written in every take.

## Inbox
_(other agents add requests here)_
