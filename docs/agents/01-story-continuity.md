# 01 — Story & continuity agent

**Mission:** keep every department building the *same* story. Turn the scripts into tables that other agents can follow: clocks, states, cast and cues. Find plot holes before they become shots.

**Owns:** `docs/production/continuity/`, `episodes/*/script/`, new versioned story files (`sources/story/*_vX.Y_*.md`) **only when the user asks for a rewrite**.
**Never:** edit the original story files, invent canon silently, or "fix" dialogue without the user's approval. Don't touch the protected line.

## Inputs
v4.2 script, v4.0 beat sheet, EP02 v4.0/v4.1, v3 bible (sections III infection rules, V continuity ledger), [SOURCES.md](../../artifacts/character-master/production/SOURCES.md), [logic audit](../../artifacts/character-master/sources/story/khaniad-v3-logic-audit-and-story-changes.md).

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| S01 | **EP01 diegetic clock** `EP01-clock.csv` | One row per event: departure, border, Dasha pickup, café arrival, wrist bite, livestock ride, Naran drop-off (~29 km), hospital sign, apartment arrival, bone crack, song, door. Columns: beat, screen time, story clock, location, light/weather. It must satisfy the v3 incubation rule (hand bite: a variable delay of up to about 12 hours, losing control near 21:00) and match the light changes in the v4.2 directions. Flag every conflict. | open |
| S02 | **Cast reconciliation for v4.2** `EP01-cast-v4.2.md` | Map every speaking/visible role in v4.2 to an actor ID in [EP01-v4-CAST](../../artifacts/character-master/production/EP01-v4-CAST.md). New in v4.2: Tungalag (= `cousin`), Pasha the Russian loader (= `yard-loader`), bus driver, passenger, boy, kiosk seller, neighbor at the door, older neighbor woman, car driver, Hürel's kitchen helper, second driver (who runs out the back door), bleeding man at the hospital gate, orderly (ЖИЖҮҮР), dispatcher (voice), radio (voice). Cut: the pharmacist (v4.2 has no pharmacy). Hand the list to 02. | open |
| S03 | **v4.2 cue sheet** `episodes/EP01/script/EP01-v4.2-cues.csv` | Line ID `E01-B<beat>-L<nn>`, speaker, language (MN/RU), text, subtitle text (the Russian lines' `[хадмал]`), performance note, `[SILENCE]` beats as their own rows. It replaces the v2.1 IDs for EP01. | open |
| S04 | **State tables** `EP01-states.md` | Per beat and per character: wounds (Dasha's forearm bandage; Ganaa's wrist: clean → bitten → wrapped → soaked; sweat and fever), clothing (torn bloody sleeve, Altan's paper crown, one mitten on and the other on the table), and props (satchel behind the seat, the mittens parcel in his coat, the bowl, the mutton parcel). | open |
| S05 | **Staging rules for physical problems** | Record the beat sheet's approval gates 3–4 as rules for 03 and 08. Apartment: the kitchen door opens **inward into the kitchen**, has no lock, can be braced from inside and pushed from the hall, the bedroom is within earshot of the table, and the stair exit works but is crowded. Café: the collision, the concrete guard, the electrical arc that lights the fuel vapor, a *localized* fire, and a cab that stays recognizably intact with the satchel safe. | open |
| S06 | **Open-question log** `OPEN.md` | Track SOURCES.md items 2–7, the EP02 plot-hole questions 1–8 and the master plan's user decisions. Each entry gets an owner, options and a recommendation. | open |
| S07 | **EP02 clock + states** | The same products as S01–S04 for EP02 00:00–05:20. Sükhee's bite is on the upper arm (torso-adjacent rules). Paths: Tungalag and the infant, and who leaves the apartment. | open (after S01–S04) |
| S08 | **Screening kit** for M4 | The beat sheet's blind-screening questions and the EP02 cliffhanger test, as a printable form and a way to record results | open |

## Rules
- A sample line in a treatment is **not** locked dialogue. Only v4.2 is current for EP01.
- When a source contradicts itself, preserve both versions, label the contradiction, and recommend one. Never rewrite it silently.
- Infection: entry only by bite, deep scratch or blood into a wound. The delay depends on the bite's location. Infected sprint for 2–3 minutes, then seek heat. Cold slows them; heat revives them.

## Inbox
_(other agents add requests here)_
