# A01 round 2 (DeepSeek): make the sound kit work on laptop/phone speakers

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You continue your sound kit in `~/ms-workers/E09` (`audio/kit/`, `audio/gen/`, `LISTEN.md`, `mix.json`). Your own report said: KAMAZ cab beds and `dread_low`/`door_finale` are sub-heavy and vanish on small speakers; the party/crowd beds only work very quiet; `steppe_wind` is bright noise wash; `cafe_attack_pulse` is low-heavy and mechanical; some close SFX (hinges, dog, glass) sound synthetic. Most viewers will watch on laptops and phones.

## Do
1. **Speaker-safe low end:** for every bed/cue with most energy < 120 Hz, add controlled harmonics (soft saturation / a "missing fundamental" layer around 120–400 Hz) so the engine/drone is felt on a 2-inch speaker while the sub stays for headphones. Verify with a **laptop-speaker simulation** (high-pass 180 Hz + low-pass 12 kHz + a small-speaker resonance) and measure that the perceived loudness (LUFS) of each sound through the simulation drops by no more than ~6 dB vs full range. Write `audio/gen/speaker_sim.py` and a table in `LISTEN.md`.
2. **Crowd/party beds:** make the murmur read as people: syllable-rate modulation (3–6 Hz), formant movement per "voice", several overlapping voices at different distances, occasional laughs (breath bursts), cutlery/glass clinks, a door, without intelligible words.
3. **Steppe wind:** fewer bright hiss, more low howl and gust shape (slow amplitude/pitch envelopes, a whistling resonance through gaps), with quiet lulls.
4. **cafe_attack_pulse:** a clearer rhythmic pulse (metallic hits, a filtered heartbeat-like thump), mid-range presence; still original, not a trailer.
5. **Close SFX that read synthetic:** improve hinges (stick-slip friction model), glass (inharmonic modal partials + noise shards), dog (a far bark from a formant source); keep the rest.
6. Rebuild the kit, rerun the analyser (seams, durations), the B01–B03 dry-run mix (ebur128 numbers through full range **and** through the speaker sim), refresh spectrograms, and a new 100 s listening montage `audio/kit/listen-r2.mp3` (same order as before: freight yard, apartment night, café, KAMAZ moving, steppe wind, dread_low, cold_morning, birthday_warmth_wrong, cafe_attack_pulse, door_finale; 10 s each, short fades).

## Rules
- Write only `audio/**`, `out/master/**`. No commits. Don't touch `AGENTS.md`. No Blender. View only PNG/JPEG images.
- `npm test` must pass.
- Final `## Report:` with files, measurements (before/after table), evidence, and what still sounds wrong.
