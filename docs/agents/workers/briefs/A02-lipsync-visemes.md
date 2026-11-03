# A02 (DeepSeek): local lip-sync: audio → mouth/jaw tracks for every line

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue in `~/ms-workers/E09` (subtitles, `edit.mjs`, the sound kit). The user will record all 197 voice lines (`audio/vo/<cue>.wav`, cue ids `EP01-VO-###` as in `episodes/EP01/subs/lines.json`). The characters need mouths that move with the voice, **locally, no paid service, no downloads**. Mongolian and Russian speech; the text of each line is known.

## Build
1. `episodes/EP01/threejs/tools/lipsync.mjs` (node; you may shell out to `ffmpeg` for decoding/filtering; no new npm deps): for each `audio/vo/<cue>.wav`, produce `episodes/EP01/lipsync/<cue>.json` at 24 fps (and 60 fps option): per frame `{ open, wide, round, closed }` in 0..1 plus a discrete viseme label (`rest, MBP, AI, E, O, U, FV, L, S`), from:
   - an energy envelope (RMS, attack-fast/release-slow smoothing) → jaw `open`;
   - spectral shape per frame (your own FFT in JS, bands/centroid/formant-ish peaks F1/F2) → `wide` (E/I), `round` (O/U), closures for plosives (MBP: short silence before a burst) and fricatives (S/Ш/Ж/Ф/В: high-band noise, mouth narrow);
   - **text alignment**: use the line's text (Cyrillic, Mongolian has Ө Ү too) to map letters → expected visemes, then align them to the audio's syllable nuclei (energy peaks) with a simple DTW so vowels land where the voice has them; fall back to audio-only if alignment confidence is low.
   - Silence/breath → mouth closed with a small relaxed gap; anticipation: the mouth starts shaping ~2 frames before sound (coarticulation smoothing).
2. Mapping to our rigs: `speak` morph (all current GLBs) gets `open`; when a GLB also has `smile`/`frown`/visemes or a `jaw` bone, drive them too (`wide` → a little `smile`, `round` → a pucker if available). Write `src/stylized/lipsync.js` (or a small adapter the controller can use: the controller's `say` verb currently fakes a syllable rhythm; add a `say` option `lipsync: '<cue>'` that reads the JSON). Keep it deterministic and seekable.
3. Test data: there is no real VO yet. Generate test speech-like WAVs locally for 10 lines: either `espeak-ng` if installed (`which espeak-ng`), or your own formant synthesiser (vowel formants + noise bursts from the text) so the analyser has realistic structure; put them in `audio/vo-test/` (clearly test-only).
4. `tools/lipsync-check.mjs`: runs the analyser on the test WAVs: mouth closed during silences, open peaks aligned with vowel nuclei (±2 frames), MBP closures present for «м/б/п» letters, determinism, timing matches the WAV length. Plot strips (PNG via a tiny canvas-free renderer: write a PPM/PNG with your own encoder or via ffmpeg) `out/lipsync/<cue>.png` showing waveform + tracks + viseme labels.
5. Hook into `edit.mjs`/`TIMINGS.md` docs: when the user's WAVs land, one command builds all lip-sync tracks.

## Rules
- Write only `episodes/EP01/threejs/tools/lipsync*.mjs`, `episodes/EP01/lipsync/**`, `episodes/EP01/threejs/src/stylized/lipsync.js` (+ the minimal `say` option in `src/stylized/` with a test), `audio/vo-test/**`, `out/lipsync/**`. No commits. Don't touch `AGENTS.md`. No Blender.
- `npm test` and `tools/stylized_check.mjs` must still pass.
- Final `## Report:` with files, commands + output, evidence strips, and doubts (accuracy on Mongolian/Russian, what would improve it).
