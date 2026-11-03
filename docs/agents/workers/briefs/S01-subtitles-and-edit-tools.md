# S01 (DeepSeek): subtitles (Mongolian + English) and the edit/conform tool

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E09`, right after your panel breakdown (`episodes/EP01/threejs/panels/B01–B26.json`, `BREAKDOWN.md`, `tools/panels-lint.mjs`: 384 panels, 197 lines, 25:00).

## Sources (law)
- Dialogue: `artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv` (197 cues, `exact_spoken_dialogue_from_v4.2`) and the script `artifacts/character-master/sources/story/EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md` (Russian lines carry their Mongolian subtitle in `[хадмал: …]`).
- Voice: real slang and swearing, no "children's show" polish, no self-narration. **Profanity uncensored** (e.g. «Пизда» stays; in English use the equivalent strength, e.g. "fuck"/"cunt"-level as appropriate to context, not "darn").
- Protected lines verbatim in Mongolian: «Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад... идчихсэн шүү дээ. Ямар алных нь томуу вэ...» and «…Пизда.»

## Build
1. **Subtitle data** `episodes/EP01/subs/lines.json`: per cue: id, beat, speaker, language spoken (mn/ru), original text, Mongolian subtitle text (for Russian lines, from the script's хадмал; for Mongolian lines, none by default: Mongolian-speaking audience), **English subtitle** (your translation: natural, colloquial 1998 voice, keep register and swearing; character names in English transliteration: Ganaa, Tsetsegmaa, Altan, Dulmaa, Hürel, Irina, Dasha, Sükhee…), and timing **from the panels** (the panel(s) carrying the lineId: start = panel start + small offset, end ≤ panel end; long lines split across two subtitle events at a natural pause; 42 chars/line max, 2 lines max, ≥ 1.0 s on screen, ≤ 17 chars/s for English; flag violations).
2. **`episodes/EP01/threejs/tools/subs.mjs`**: writes `out/subs/EP01.mn.srt` (Russian lines only, Mongolian subtitles), `EP01.en.srt` (all lines in English), and `EP01.en.ass` styled for burn-in (a plain, slightly warm white, soft shadow, PS2-era-appropriate font available offline, e.g. DejaVu Sans / Liberation Sans; bottom margin safe for 16:9). Re-timing support: given a `timings.json` of real VO take durations per cue (when the user records), shift panels/subs accordingly (document the format).
3. **`episodes/EP01/threejs/tools/edit.mjs`** (ffmpeg conform; no paid services): input = rendered panel frames or per-panel clips in `out/render/<BEAT>/<panelId>/%05d.png` (or `.mp4`), VO WAVs `audio/vo/<cue>.wav`, SFX/ambience/music stems listed in an `audio/mix.json`, and the subs; output = `out/master/EP01_master_1080p24.mp4` (H.264 high, yuv420p, 24 fps, AAC 48 kHz), loudness-normalised to **−14 LUFS integrated, true peak ≤ −1 dBTP** (two-pass `loudnorm`), optional burn-in of the `.ass`, transitions from the panel data (cut, fade to black with durations), and a 4K Lanczos upscale variant with grain re-added. Missing media → placeholders (black frame with the panel id, room-tone silence) so the tool always runs end to end.
4. **Dry run**: make tiny placeholder inputs (generated colour frames per panel at 320×180, silent WAVs with a beep at each cue start) and run `edit.mjs` end to end for beats B01–B03 → `out/master/dryrun_B01-B03.mp4`; check with `ffprobe` (duration matches the panel sum, 24 fps), `ffmpeg -af ebur128` (loudness) and burn-in visible on a grabbed frame.
5. A test `tools/subs-check.mjs`: every cue has an English subtitle; the protected lines are verbatim in `mn`; no censored profanity (`*`, `f**k`, "darn" for «пизда»…); timing rules; SRT parses.

## Rules
- No Blender, never the Blender MCP. Don't change the panels' timings except via the documented retiming path; don't change the story files.
- Write only `episodes/EP01/subs/**`, `episodes/EP01/threejs/tools/subs.mjs`, `edit.mjs`, `subs-check.mjs`, `out/subs/**`, `out/master/**`, placeholder media under `out/dryrun/**`. No commits. Don't touch `AGENTS.md`.
- `npm test` must still pass.
- Final `## Report:` with files, commands + output (ffprobe/ebur128 numbers), evidence (a grabbed burn-in frame, 20 sample English lines including the protected/profane ones), and doubts (any translation choices you're unsure of).
