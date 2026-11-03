# EP01 voice-recording guide

You are the whole cast: 197 lines, Mongolian and Russian, adults, an old woman,
a three-year-old, and several Russian characters. This guide is built so a
single person with one microphone at home can record the episode in ten short
sessions without losing a file or a cue.

Read this once before the first session. Then use `sessions.md` to book the
work, `characters.md` to find each voice, `russian.md` for the Russian lines,
and `sheets/session-XX.md` (or the printable `sheets/all.html`) while recording.

## 1. What you need

- One microphone: a USB mic, a dynamic stage mic through an interface, or a
  phone. A phone is acceptable if it records PCM/WAV, or if you convert the
  result (section 6). A USB mic is easier to keep at a fixed distance.
- Closed-back headphones for listening back. Do not monitor through speakers
  while recording.
- A quiet room with soft surfaces. A bed, a wardrobe full of clothes, curtains
  and a carpet are your friends.
- A duvet or thick blanket. The cheapest booth is the duvet-over-the-head
  trick: sit at the edge of the bed, hang the duvet over your head and the mic
  stand so it forms a tent open at the back. Do not wrap the mic itself.
- A sock or a thin foam cover as a pop filter. Stretch a clean sock over a
  small hoop or the mic grille; keep 3–5 cm between the sock and the capsule.
- Water at room temperature. Not ice-cold, not coffee before a scream session.
- A notebook or this cue sheet, a pen, and a way to play a reference line.

## 2. The room

1. Choose the smallest room with the most soft furniture. Avoid kitchens and
   bathrooms (hard reflections), and avoid a room with a fridge, boiler or
   ventilation hum.
2. Turn off fans, extractors, notifications and the fridge if it is in the
   same room. Put the phone in airplane mode if it is not the recorder.
3. Close the window. Outside traffic in Naran is part of the story, not part of
   the take. Record the town later.
4. Put the mic in the middle of the room, not against a wall, and not in a
   corner. A duvet behind you and a mattress or sofa in front of you kills most
   of the boxiness.
5. Record 2–3 seconds of room tone at the start of every session, at the same
   gain as the takes. Save it as `audio/vo/roomtone/session-01.wav` (and so on).
   The edit needs it to fill gaps and to match the room.

## 3. Microphone and levels

- Distance: **15–20 cm** from the mouth. Put a hand span between your lips and
  the grille. Stay there; do not lean in for shouts.
- Angle: speak slightly **across** the capsule, not straight into it. Aim the
  mic at the corner of your mouth, 10–20° off axis. This softens plosives.
- Pop filter: the sock goes between you and the mic. For loud lines, add
  another 5 cm of distance rather than turning the gain down mid-session.
- Gain: set it once per session so ordinary speech peaks around **−12 dBFS**
  (acceptable window −18 to −9 dBFS). A scream may go a little higher; it must
  never touch 0 dBFS. If it does, lower the gain and redo the line.
- No processing while recording: no noise reduction, no compressor, no EQ, no
  de-esser, no reverb, no "voice enhance", no automatic gain control. Record
  the raw voice; the mix does the rest.
- Format: **48 kHz, 24-bit, mono WAV**. Not 44.1 kHz, not 16-bit, not stereo,
  not MP3/M4A for the primary take.
- Headphones: closed-back, one ear half off if you need to hear yourself
  naturally. Do not let the headphones bleed into the mic.

A phone held at 15–20 cm will move. Put it on a stand or a stack of books. If
the phone applies automatic gain, make a test recording and watch the waveform:
if the level pumps between words, the take is unusable for lip-sync.

## 4. File naming and where files go

```
audio/vo/
  EP01-VO-001.wav          primary take, one cue per file
  EP01-VO-001_t2.wav       second take (backup; the pipeline uses the primary)
  EP01-VO-001_t3.wav       third take, if needed
  roomtone/session-01.wav  2–3 s of the room, same gain
  roomtone/session-02.wav
```

Rules:

- The cue id is the file name. `EP01-VO-004.wav`, never `irina_again.wav`.
- One cue per file. Do not record two lines into one file, even if they are
  short and adjacent.
- A new attempt is a new file: `_t2`, `_t3`. Listen to both; if `_t2` is better,
  rename the current primary to `EP01-VO-004_t1.wav`, then rename `_t2` to the
  primary name. Keep the old one as a backup take.
- A file with a suffix is always a backup. The pipeline only looks for
  `EP01-VO-###.wav`, so exactly one take per cue carries the bare name.
- Do not put music, room tone or a slate in a cue file. Trim the slate.
- Keep the original take. Do not normalize, limit or noise-reduce the file you
  hand to the pipeline. If you must clean it, keep the raw file and make a
  cleaned copy elsewhere.
- Back up `audio/vo/` after every session. Two copies, one outside the laptop.

## 5. Audacity settings (free)

Audacity is enough. Current versions (3.4 and later) put the device settings
under **Audio Setup → Audio Settings**; older versions use the device toolbar.

1. **Audio host:** ALSA (Linux) or the native host on your system.
2. **Recording device:** your microphone, not "default" if the default is the
   laptop mic. Test both once.
3. **Recording channels:** **1 (Mono)**.
4. **Project sample rate:** **48000 Hz**.
5. **Default sample format:** **24-bit**.
6. Turn off **Transport → Transport Options → Software Playthrough** (you will
   hear yourself delayed and will start compensating).
7. Turn off **Effect → Volume and Compression → Normalize** on recording. Do
   not enable "Automatically detect and normalize" in recording preferences.
8. Record with **Transport → Record** (R). One track per session is fine; use
   **Tracks → Add New → Label Track** and press Ctrl+B at the start of each cue
   to write the cue id into the label track. This is the fastest way to keep
   takes apart.
9. Listen back at a comfortable level. Select a take, **Effect → Amplify** only
   to *measure* the peak; do not apply it unless the file is below −30 dBFS and
   you have decided to fix the whole session. The checker will tell you.

Export one cue at a time:

- Select the cue region (label track makes this quick).
- **File → Export → Export Selected Audio…**
- Format: **WAV (Microsoft)**
- Encoding: **Signed 24-bit PCM**
- Sample rate: **48000 Hz**
- Channels: **Mono**
- File name: the cue id, e.g. `EP01-VO-004.wav`.

Save the Audacity project per session (`.aup3`) as a safety net. The WAVs are
the deliverable; the project is so you can find a better take later.

If Audacity is not available, Ocenaudio and Reaper (evaluation) can do the
same. Do not use an online "AI voice cleaner": it will change the timing and
break lip-sync.

## 6. Phone-only fallback

Record with a voice recorder that can write WAV. If it can only write M4A,
convert each take without changing the performance:

```sh
ffmpeg -i take.m4a -ar 48000 -ac 1 -c:a pcm_s24le audio/vo/EP01-VO-004.wav
```

Then check it:

```sh
node episodes/EP01/threejs/tools/vo-check.mjs --dir audio/vo
```

Phone recorders often apply automatic gain, a high-pass filter and noise
reduction. If the waveform looks pumped or the room sounds like a phone call,
the take will still lip-sync, but the voice will not match the other sessions.
Use the phone only for scratch takes if a USB mic is available.

## 7. Recording a cue without wasting time

1. Say the cue id once: **"Session 3, cue 017."** Then pause for one second.
   This is your slate; trim it later. It is faster than checking a file name
   after every take.
2. Read the previous line silently, then play the scene in your head. The
   previous line is printed on the cue sheet for exactly this.
3. Record the line. Let the last word land; do not cut the breath after it.
   Leave 0.3–0.5 s of silence at the head and tail. Do not leave 2 s.
4. Listen once. Ask three questions: Is it the right character? Is the text
   exact? Is the level in the window? If yes, move on. Do not audition ten
   versions of a 2-second line.
5. If the line is wrong, record `_t2` immediately, while the voice is in the
   same place. Do not come back to it at the end of the session.
6. Tick the box on the sheet and write the take number if you used one.

The protected lines must be recorded exactly as written, including the
ellipses and the profanity:

> «Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад... идчихсэн шүү дээ. Ямар алных нь томуу вэ...»

> «…Пизда.»

Do not clean up the swearing. Do not add or remove a word to make it flow.
If you fluff it, the take is `_t2`, not an edit of the text.

## 8. The one-command pipeline

The tools already exist; the recording package only adds the checker and the
staging step for the edit manifest. After a session, run:

```sh
bash episodes/EP01/recording/tools/pipeline.sh
```

That one command:

1. runs `vo-check.mjs` on `audio/vo` and refuses to continue on a blocking
   format/clipping problem (`--strict`);
2. writes the measured take lengths to `episodes/EP01/subs/timings.json`;
3. runs the lip-sync tool on the real takes;
4. retimes the subtitles and panels to the takes;
5. assembles a sync master at `out/master/EP01_vo_sync.mp4` against the
   current render (dry-run frames by default), without the 4K pass.

Useful overrides:

```sh
VO=audio/vo \
RENDER=episodes/EP01/threejs/out/render \
OUT=out/master/EP01_vo_sync.mp4 \
bash episodes/EP01/recording/tools/pipeline.sh
```

The individual steps, if you want to run them by hand:

```sh
# 1. check and measure
node episodes/EP01/threejs/tools/vo-check.mjs \
  --timings-out episodes/EP01/subs/timings.json

# 2. lip-sync from the takes (writes episodes/EP01/lipsync/)
node episodes/EP01/threejs/tools/lipsync.mjs --vo audio/vo

# 3. retime panels + subtitles (writes episodes/EP01/threejs/out/subs/)
node episodes/EP01/threejs/tools/subs.mjs \
  --timings episodes/EP01/subs/timings.json

# 4. assemble with the retimed sheet
node episodes/EP01/threejs/tools/edit.mjs \
  --audio episodes/EP01/threejs/out/vo-audio \
  --lines episodes/EP01/threejs/out/subs/lines.retimed.json \
  --render episodes/EP01/threejs/out/dryrun/render \
  --out out/master/EP01_vo_sync.mp4 --no-4k
```

Step 4 uses the staging directory that `pipeline.sh` creates. If you run the
edit by hand without it, the shipped `audio/mix.json` still points its `voDir`
at the old dry-run folder; copy `audio/mix.json`, set `"voDir": "vo"`, and put
the takes (or a symlink) next to it.

### Reading `out/vo-report.md`

The checker writes a report after every run:

- **Blockers**: wrong sample rate, wrong bit depth, wrong channel count,
  clipping, unreadable file, silent take. Fix before the pipeline.
- **Warnings**: peak below −30 dBFS, duration more than ±40 % from the panel
  target, more than 1 s of leading or trailing silence. Listen and decide.
- **Missing cues**: grouped by beat. A missing cue is silent in the edit.
- **Extra takes**: `_t2` files. They are not used until you promote one.

The panel target is a guide, not a stopwatch. Natural speech often lands within
±20 %. A 0.5 s cue that comes out at 0.8 s is a warning, not a failure; the
subtitle retime will follow the take.

## 9. Listening checks

Before you close a session:

- Play the take through the headphones at the level you will mix at. Is the
  character recognisably the same person as the last session?
- Check the first and last 0.5 s. Is there a chair creak, a lip smack, a car?
  Re-record rather than trying to repair it.
- Check sibilance on Russian `с/ш/щ` and Mongolian `с/ш`. If it stings, move
  the mic 2 cm further away or angle it more; do not de-ess the raw take.
- Check plosives on `п/б/т/д`. The sock and the off-axis angle should handle
  them. If not, re-record with more distance.
- Does the line still match the cue sheet word for word? Read it once against
  the sheet.

## 10. Vocal health and schedule

- Ten sessions, not one. The plan puts calm material first and screams last.
- No more than 50 minutes of booked studio time in the scream session, and
  stop earlier if the voice feels scratchy.
- Warm up for five minutes before every session: hum, lip trills, a few
  exaggerated yawns, read one paragraph aloud.
- Water at room temperature. Avoid dairy and very cold drinks immediately
  before a take; they thicken the throat.
- Do not whisper a scream. A recorded shout is supported breath, not a
  shredded throat. Use the vocal-safety notes in `sessions.md`.
- If a session goes badly, stop. A tired voice is not a performance; it is a
  file you will re-record.

## 11. Copyright and sources

The dialogue is the approved v4.2 read-through, taken from
`artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv`.
Do not rewrite it, do not censor it, and do not add lines. The protected lines
are checked by the existing subtitle lint. Original music only; no library or
generated track from a paid service.

## 12. Session checklist

- [ ] Room quiet, phone in airplane mode, fridge/fan off
- [ ] Mic at 15–20 cm, off-axis, sock pop filter
- [ ] 48 kHz / 24-bit / mono, peaks around −12 dBFS
- [ ] 2–3 s room tone saved for this session
- [ ] Cue sheet open at the right session
- [ ] Previous line read for context
- [ ] Cue id slated before each take, then trimmed
- [ ] Text exact, profanity intact, protected lines untouched
- [ ] Every cue ticked, every file named `EP01-VO-###.wav`
- [ ] One listen-back pass, no processing
- [ ] `vo-check` run and report read
- [ ] Backup copied off the laptop
