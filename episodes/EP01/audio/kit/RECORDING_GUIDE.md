# EP01 self-voicing guide

Record final dialogue after the animation is finished. The short test in TEST_SESSION.md can happen now.

## Setup

- Pick a quiet room with soft furnishings. Keep the mic one hand-span from your mouth every time.
- Record unprocessed 48 kHz / 24-bit WAV. Turn off effects and automatic processing while recording.
- At the start of every session, record 10 seconds of room tone: stay quiet with the same setup.

## Record

1. Work on one character per session. Read their voice card and warm up gently. Keep rhythm, placement and any accent consistent.
2. Follow the checklist in session and beat order. Perform the source direction; blank directions leave room for your judgment. Intensity is derived from direction text, not a performance instruction from the script; review it yourself. A blank layering cell does not rule out layers. The kitchen-door overlay calls cue 196 a shout: use the layers there too.
3. Save one file per cue and take in `episodes/EP01/audio/dialogue/`, for example `EP01-VO-001_take01.wav`, then `EP01-VO-001_take02.wav`. Mark the chosen take in the checklist. Keep room tone separately.
4. The source leaves the actor ID blank for Sükhee, the dispatcher and the radio. The checklist assigns `sukhee`, `dispatcher` and `radio` based on their named speakers; the latter two are voice-only session labels. Cards and voice choices are suggestions, not locked casting. Where only one cue exists, its card has one reference line.

## Stay unrecognisable

Give each role a different speaking style: change rhythm, placement or accent without forcing it. Also change timbre in post. Never publish raw takes. Ask someone who knows your voice to listen blind to the processed clips and report whether they recognise you. Audacity, Praat and voice conversion do not guarantee anonymity; repeat the blind test before release.

## Fear without screaming

Never strain your voice. Record three layers: (1) a close-mic breathy line, (2) a separate short gasp or strained exhale made gently, and (3) an effect mixed underneath. In the mix, compression and volume automation can add intensity. Stop if anything hurts.

## Free tools to test

- **Audacity:** record, then audition pitch and EQ on a copy.
- **Praat:** try Change Gender; for female roles, formant ratio around 1.1 is a starting point, not a rule.
- **RVC / Seed-VC:** test voice conversion later using only models and reference voices you have rights to use. RVC needs substantial clean target audio and is slow on CPU; Seed-VC is experimental and its repository was archived in November 2025. Female and child roles will need conversion tests; pitch alone can sound artificial, especially for Altan.
