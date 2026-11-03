# V01 (DeepSeek): the voice-recording script for the user

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E09` (subtitles `episodes/EP01/subs/lines.json`, panels `episodes/EP01/threejs/panels/B*.json`, lip-sync tool, edit tool are yours). **The user voices every role in EP01 themself** (197 lines, Mongolian and Russian; adults, an old woman, a 3-year-old, Russian characters). They record at home with one microphone. Make recording fast, organised and hard to get wrong.

## Sources
`artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv` (cue, speaker, direction, exact text), the v4.2 script, `lines.json` (timing per cue from the panels), `artifacts/character-master/production/EP01-v4-CAST.md` (who each character is, age).

## Build `episodes/EP01/recording/`
1. `RECORDING_GUIDE.md`: setup (quiet room, blanket booth trick, phone/USB mic distance ~15–20 cm, pop filter from a sock, 48 kHz 24-bit WAV mono, record 2–3 s room tone per session, levels peaking around −12 dBFS, no processing), file naming (`EP01-VO-###.wav`, one take per file, extra takes `EP01-VO-###_t2.wav`), where to put files (`audio/vo/`), then the one-command pipeline (lip-sync + retime + subs + edit) the tools already support. Free recording software suggestions (Audacity) with exact settings.
2. **Character voice sheets** (`characters.md`): for every speaking role: age, temperament, voice placement (pitch/rasp/pace/energy), a reference line to "find the voice" before each session, what to avoid (no cartoon voices; for Altan: a small natural child voice, not "cute", recorded softly and maybe pitched up slightly in post: give exact `ffmpeg` `asetrate/atempo/rubberband`-style command if pitch-shifting is needed, and say when NOT to). Swearing stays real.
3. **Session plan** (`sessions.md`): lines grouped **by character** (record all of one voice together), then by intensity (calm first, screams last to save the voice), with estimated session lengths; the cue ids per session; screams/shouts (B16–B18, B23–B26) in their own last session with vocal-safety tips.
4. **Russian help**: every Russian line with **stress marks** (á é ó…), a Latin pronunciation guide, and a natural Mongolian gloss, plus notes on tricky sounds (ы, щ, soft signs). Irina, Dasha, the yard guard, dispatcher, Pasha etc. Accents: Irina is a Russian epidemiologist (native), Dasha native Russian, Ganaa speaks Russian with a Mongolian accent (that's correct for him).
5. **Cue sheet** per session (`sheets/session-##.md` and a printable `sheets/all.html`, big readable type, dark background, phone-friendly): cue id, character, direction, the exact text (protected lines exactly as written: «Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад... идчихсэн шүү дээ. Ямар алных нь томуу вэ...»), the panel duration target ("about 3.5 s"), the previous line (for context) and a checkbox.
6. `tools/vo-check.mjs`: scans `audio/vo/` → reports missing cues, wrong sample rate/bit depth, clipping, too quiet (< −30 dBFS peak), duration vs target (±40 %), leading/trailing silence > 1 s; writes `out/vo-report.md`. Test it on the test WAVs in `audio/vo-test/`.

## Rules
- Write only `episodes/EP01/recording/**`, `episodes/EP01/threejs/tools/vo-check.mjs` (+ a test), `out/vo-report.md`. No commits. Don't touch `AGENTS.md`. No Blender. View only PNG/JPEG images.
- Text must match the manifest byte-for-byte (lint it). Profanity uncensored.
- `npm test` must pass.
- Final `## Report:` with files, the session plan summary (sessions × minutes × cues), and doubts.
