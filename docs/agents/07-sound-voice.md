# 07 — Sound & voice agent

**Mission:** make Naran sound inhabited, then make silence frightening. Own the dialogue recordings, the effects, the ambience and the mix.

**Owns:** `assets/sound/` (effects library, ambiences, the family song), `episodes/*/audio/` (dialogue per line ID, stems, mix), `src/filmSound.js` (the legacy HOUR-5 procedural score).
**Inputs:** 01's v4.2 cue sheet (S03), 08's edit decision list and shot timings.

## Sound rules from the scripts
- **No trailer score.** The first 30 seconds of the cold open have no music. They are rail couplings, an idling diesel, a key impact, steam hiss.
- **Ordinary sound tells you how life works:** grit underfoot, wood splitting, a radio under an open window, market bargaining, the bus starter.
- **The radio** keeps saying "flu", and the official wording is part of the story (beats 03, 09, 19).
- **The family song** is an *original*, simple, off-key tune that Ganaa half-sings with Altan's name in it. It stops mid-phrase in beat 24, and its absence returns in EP02.
- **Beat 17:** a chair scrape and the truck starter, *then* a scream. **Beat 26:** an exhale, a sharp unnatural inhale, cut to black, a spoon clinking once, then silence. No scream.
- Russian lines get Mongolian `[хадмал]` subtitles. Mongolian lines can get optional English subtitles for festivals.

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| V01 | **Voice plan** (needs the user's decision 00 §7.2) | Casting list per role: native Mongolian performers, Russian speakers for Irina, Dasha, Pasha, the guard, the dispatcher and the border official. Recording spec: 48 kHz/24-bit WAV, one file per line ID. If synthetic placeholders are allowed for the animatic, label every file `TEMP_` and replace it before M5. | open |
| V02 | **Scratch read for M3/M4** | All v4.2 lines recorded or temped, then a timed table read. Report the measured runtime against 25:00 to 01 and 08. | open |
| V03 | **The family song** | Melody, a sung take by Ganaa's voice (and Altan humming it), plus versions: whole, broken off, hummed alone | open |
| V04 | **Ambience beds** | Freight yard pre-dawn, border queue, Naran morning market, apartment party (12–18 people, plus earlier visitors implied), café, livestock cab at night, hospital gate | open |
| V05 | **Effects library** | Every effect named in v4.2's directions: keys, flashlight, steam, the dictaphone and rewind, bus starter, kettle, KAMAZ starter/heater/rattles, the bowl on the dash, chair and table, the electrical arc and fire, sheep, bone crack, the door thud/handle/plate scrape, the infant crying | open |
| V06 | **Mix spec** | Stems (dialogue, effects, ambience, music). The loudness target depends on the delivery target (00 §7.4): −14 LUFS for streaming, −23/−24 for broadcast and festivals. Subtitles as SRT/VTT, generated from the cue sheet. | open |
| V07 | **EP02 sound** | Hospital: fluorescent hum, backup-power change-over, the corridor evacuation, the heavy door | open (M6) |

## Rules
- Line IDs from S03 are the only key. Never rename a file by hand.
- Every dialogue file records its performer, take and whether it is TEMP.
- Keep the protected line exactly as written, in every take.

## Inbox
_(other agents add requests here)_
