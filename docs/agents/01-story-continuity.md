# 01 — Story & continuity agent

**Mission:** keep every department building the *same* story. Turn the scripts into tables that other agents can follow: clocks, states, cast and cues. Find plot holes before they become shots.

**Owns:** `docs/production/continuity/`, `episodes/*/script/`, new versioned story files (`sources/story/*_vX.Y_*.md`) **only when the user asks for a rewrite**.
**Never:** edit the original story files, invent canon silently, or "fix" dialogue without the user's approval. Don't touch the protected line.

## Inputs
**New, 29 Oct:** the [`v4.2-pack/`](../../artifacts/character-master/sources/story/v4.2-pack/) (story clock, kitchen-door blocking, QA fixes, pacing audit) and the [`v4.3-timing/`](../../artifacts/character-master/sources/story/v4.3-timing/) pack (197-cue manifest, the birthday 90 s and door 64 s timing, the editing timeline). Also: v4.2 script, v4.0 beat sheet, EP02 v4.0/v4.1, v3 bible (sections III infection rules, V continuity ledger), [SOURCES.md](../../artifacts/character-master/production/SOURCES.md), [logic audit](../../artifacts/character-master/sources/story/khaniad-v3-logic-audit-and-story-changes.md).

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| S01 | **EP01 diegetic clock** `EP01-clock.csv` | Convert the [working clock](../../artifacts/character-master/sources/story/v4.2-pack/STORY_CLOCK_INFECTION_LOGIC_v4.2.md) into CSV (bite ~16:35 on the **left wrist**, kitchen door ~21:00, about 4 h 25 m). Add columns for beat, light and weather. Carry its seven "fix before lock" items into OPEN.md. One open check: whether the drop-off-to-apartment walk fits the city plan. | **done** 29 Oct (Codex): episodes/EP01/script/ |
| S02 | **Cast reconciliation for v4.2** `EP01-cast-v4.2.md` | Map every speaking/visible role in v4.2 to an actor ID in [EP01-v4-CAST](../../artifacts/character-master/production/EP01-v4-CAST.md). New in v4.2: Tungalag (= `cousin`), Pasha the Russian loader (= `yard-loader`), bus driver, passenger, boy, kiosk seller, neighbor at the door, older neighbor woman, car driver, Hürel's kitchen helper, second driver (who runs out the back door), bleeding man at the hospital gate, orderly (ЖИЖҮҮР), dispatcher (voice), radio (voice). Cut: the pharmacist (v4.2 has no pharmacy). Hand the list to 02. | **done** 29 Oct (Codex): [EP01-cast-v4.2.md](../../artifacts/character-master/production/EP01-cast-v4.2.md) |
| S03 | **v4.2 cue sheet** | **It already exists:** the [recording manifest](../../artifacts/character-master/sources/story/v4.3-timing/EP01_FULL_v4.2_DIALOGUE_RECORDING_MANIFEST.csv) has 197 cues `EP01-VO-001…`. Use those IDs everywhere. Add the missing columns (language, subtitle text for the Russian lines, the user's recording-take column) in a derived file `episodes/EP01/script/EP01-cues.csv`. Never change the source manifest. | **done** 29 Oct (Codex): episodes/EP01/script/ |
| S04 | **State tables** `EP01-states.md` | Per beat and per character: wounds (Dasha's forearm bandage; Ganaa's wrist: clean → bitten → wrapped → soaked; sweat and fever), clothing (torn bloody sleeve, Altan's paper crown, one mitten on and the other on the table), and props (satchel behind the seat, the mittens parcel in his coat, the bowl, the mutton parcel). | **done** 29 Oct (Codex): episodes/EP01/script/ |
| S05 | **Staging rules for physical problems** (the [door blocking spec](../../artifacts/character-master/sources/story/v4.2-pack/ENDING_B_EP02_APARTMENT_BLOCKING_v4.2.md) already defines 10 locked physical intentions and checks (a)–(f). EP02 braces the door with a **low bench**, not a stool.) | Record the beat sheet's approval gates 3–4 as rules for 03 and 08. Apartment: the kitchen door opens **inward into the kitchen**, has no lock, can be braced from inside and pushed from the hall, the bedroom is within earshot of the table, and the stair exit works but is crowded. Café: the collision, the concrete guard, the electrical arc that lights the fuel vapor, a *localized* fire, and a cab that stays recognizably intact with the satchel safe. | open |
| S06 | **Open-question log** `OPEN.md` | Track SOURCES.md items 2–7, the EP02 plot-hole questions 1–8 and the master plan's user decisions. Each entry gets an owner, options and a recommendation. | **done** 29 Oct (Codex): episodes/EP01/script/ |
| S07 | **EP02 clock + states** | The same products as S01–S04 for EP02 00:00–05:20. Sükhee's bite is on the upper arm (torso-adjacent rules). Paths: Tungalag and the infant, and who leaves the apartment. | open (after S01–S04) |
| S08 | **Screening kit** for M5 | The beat sheet's blind-screening questions and the EP02 cliffhanger test, as a printable form and a way to record results | open |

## Rules
- A sample line in a treatment is **not** locked dialogue. Only v4.2 is current for EP01.
- When a source contradicts itself, preserve both versions, label the contradiction, and recommend one. Never rewrite it silently.
- Infection: entry only by bite, deep scratch or blood into a wound. The delay depends on the bite's location. Infected sprint for 2–3 minutes, then seek heat. Cold slows them; heat revives them.
- **Infected don't use door handles** (user decision, 29 Oct 2026). They throw their body toward sound, heat and food, so they push or slam a door; they never turn a knob or pull a door open. An inward-opening door is therefore the safe side: in EP02 the hall-side bench brace holds against Ganaa slamming outward, and he can't open the kitchen door himself. Any later scene where an infected gets through a door needs a physical reason: the door is pushed open, already ajar, or broken.
- **Dialogue voice** (the user's corrections in the earlier ChatGPT dialogue thread, `~/can you improve my dialogue.txt`):
  - Write it the way Mongolians actually talk: real slang and swearing where people would swear.
  - The user rejected a "polished" pass as a "child show". Never sand the edges off.
  - No one narrates the plot or their symptoms to themselves. The cut sheep-scene line «Боль, Ганаа! Боль!…» is the example of what not to write.
  - Inner monologue is salt: rare, short, or none.
  - Humour is spread across several characters, each in their own way, and not everyone is sarcastic. Bayar is cruel without telling jokes.
  - Ordinary townspeople, such as the always-drunk street group, get life and lines of their own.

## Inbox
_(other agents add requests here)_

- **03 environments, 29 Oct — S01/S05 route reconciliation:** [Naran realism handoff](../../assets/maps/naran-city/realism-v1/PRODUCTION-HANDOFF.md) preserves the old 2.67 km north-entry/direct-apartment route as regression evidence. It does not implement v4.2 beat20's clinic-junction drop-off → hospital arrow/queue → home decision. Please record the current local route/time in the continuity contract before E03/shot blocking; keep N01–N20 geography. The older realism story audit also cites v2.1 EP01 and needs a versioned authority addendum. Current map notes now specify 12–18 late-party actors and no pharmacist scene.
