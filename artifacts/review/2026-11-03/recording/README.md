# EP01 recording package

Everything needed to record the 197 EP01 voice cues at home, alone, with one
microphone.

- **`RECORDING_GUIDE.md`** — room, mic, levels, Audacity settings, file names,
  the one-command pipeline, and how to read `out/vo-report.md`.
- **`characters.md`** — every speaking role: age, temperament, voice placement,
  a reference line, what to avoid. Includes the Altan pitch-shift command and
  the limits on when not to use it.
- **`sessions.md`** — ten sessions grouped by character, calm first, screams
  last, with cue ids, speech totals, booked minutes and vocal-safety notes.
- **`russian.md`** — all 44 Russian cues with stress marks, a Latin reading
  guide, a Mongolian gloss, and notes on `ы`, `щ` and the soft sign.
- **`sheets/session-01.md` … `session-10.md`** — the cue sheet to keep open
  while recording: cue id, character, direction, exact text, panel target,
  previous line, and a checkbox.
- **`sheets/all.html`** — the same sheet as one printable, phone-friendly dark
  page.
- **`tools/make-sheets.mjs`** — regenerates the sheets from the manifest and
  checks that every cue is assigned once.
- **`tools/pipeline.sh`** — check → retime → lip-sync → subtitles → sync master.

The checker itself is `episodes/EP01/threejs/tools/vo-check.mjs`. It writes
`out/vo-report.md`.

Quick start:

```sh
# 1. read the guide, then record one session into audio/vo/
# 2. check it
node episodes/EP01/threejs/tools/vo-check.mjs
# 3. when a session is done, run the whole pipeline
bash episodes/EP01/recording/tools/pipeline.sh
```

Regenerate the sheets after a manifest change:

```sh
node episodes/EP01/recording/tools/make-sheets.mjs
node episodes/EP01/recording/tools/make-sheets.mjs --check
```
