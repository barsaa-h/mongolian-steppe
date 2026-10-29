# ХАНИАД — VO Timing & ElevenLabs Recording Pack v4.3

**What this is:** Performable **90-second birthday scene** plus a separate **64-second kitchen-door follow-up**, both drawn from the approved read-through v4.2 without rewriting the core dialogue. Also included: a **full Episode 1 dialogue manifest** extracted from the v4.2 script, with source actor directions, so you can record the remaining scenes consistently.

## Start here
1. Open `01_BIRTHDAY_WARMTH_90s.md` and generate the **spoken** prompts one by one (each also exists as `.txt` in `ElevenLabs_v3_v4_One_Cue_Per_File/`). Use distinct suitable Mongolian voices for Ganaa, Tsetsegmaa, Altan, Tungalag, etc. Child-like TTS is a temporary audition only.
2. Open `VOICE_EDIT_TIMELINE_v4.3.csv`. Place each exported file at its marked target **IN** time. These are targets only: adjust to recordings rather than time-stretching speech excessively.
3. If needed, continue with `02_KITCHEN_DOOR_64s.md` for Ending B's complete physical/dialogue handoff.
4. Use `EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv` for all other Episode 1 speech cues; it intentionally keeps original dialogue without artificially adding emotion to every line.

## Pauses and model compatibility
- **Eleven v3 / v4:** use `[softly]`, `[warmly]`, `[short pause]`, `[pause]`, etc. in **one speaker only** per generation. These prompt tags shape performance, but exact silence lengths are **not guaranteed**.
- **Eleven Multilingual v2 / Flash / Turbo:** DO NOT paste bracket tags; they may be spoken literally. Instead strip the tags and use punctuation and supported `<break time="0.4s" />` for limited pauses (e.g., `Чамд. <break time="0.4s" /> Өмсөөд үз.`). For Mongolian, prefer a model and voice you have actually auditioned for Mongolian pronunciation.
- For **precise** 0.2s, 0.4s, or 1s gaps, create separate clips and place exact silence in the editor (Blender VSE, Audacity or REAPER). For human conversation, sometimes overlap lines slightly rather than inserting silence everywhere.
- Do **not** use `[music]`, sound-effect notes or physical stage directions as speech prompts. Record them in the edit.
- Don't stretch every word apart. The authentic rhythm is mostly **fast ordinary speech**, with hesitation at decisions and the ending.

## Production status
- This is a **performance timing plan**, not synthesized audio and not proof of a 25-minute runtime.
- No voice sample generated in this package; past ElevenLabs requests were rate-limited.
- Preserve the apartment door action: it opens **into the kitchen** and Sükhee must **push** it.
- The birthday song must be an **original** short tune or a licensed/public-domain one.
- These two passes are intentionally *not* a single compressed 90s scene; compressing all of Acts V/VI to 90 seconds would destroy the emotional pacing.
