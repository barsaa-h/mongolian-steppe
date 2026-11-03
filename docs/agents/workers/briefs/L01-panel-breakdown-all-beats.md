# L01 (DeepSeek): the panel breakdown for all 26 beats of EP01

**You run non-interactively: a message without a tool call ENDS your run.** Never announce a next step as a message; just do it. Your only text-only message is the final `## Report:`.

You work in `~/ms-workers/E09` (you built the market set and the FX kit here). This job is **layout/editing on paper as data**: turn the whole 25-minute EP01 into a list of "living panels" in the episode's panel format. The renderer (panel player) is being built by another worker; you write the data it will play.

## Read first
- Story (law): `artifacts/character-master/sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md`, `EP01_v4.2_FULL_SCRIPT_READTHROUGH_CANDIDATE.md`, `EP01_25min_Scene_Beats_v4.0.csv`, and the v4.3 timing + VO cue manifest under `artifacts/character-master/sources/story/v4.3-timing/` (line ids and durations come from there; if no line ids exist, create `Bxx-nn` ids in script order and list them).
- Cast list: `artifacts/character-master/production/EP01-v4-CAST.md` (use roster ids; new roles not yet built use the ids from that list).
- Panel format: `episodes/EP01/threejs/panels/schema.json`; examples `panels/_ref/B02.json`, `panels/_ref/B15.json` (a worker's first test panels: follow their style of cues/camera).
- Sets: `episodes/EP01/threejs/src/sets/registry.json` (location ids, every `ANCHOR.*` and `CAM.*` per set; use only names that exist; if a beat needs an anchor that doesn't exist, use `pos`/`yaw` and list the missing anchor in your report).
- Effects available: `episodes/EP01/threejs/src/fx/` (your own kit: breath, steam, smoke, snow, fogCards, dust, flicker, flashlight, headlights, heatShimmer, flash/shake).
- Hero props (being built): enamel tea bowl, mittens (wrapped/unwrapped), Irina's satchel, paper crown, paper candles, birthday table set, debt notebook, flashlight + key ring, family photo, waybill + stamp: refer to them as `prop:<name>`.

## The style
SH2-style "living panels": each panel one composed frame held 2–8 s; slow camera push/pan/drift; action in **bursts** of 3–8 quick panels (0.4–1.5 s) with shake/flash/hard cuts (café attack B15–B18, the bite, the crash, the run, the birthday/door ending B23–B26); talking = the speaker's close panel; Russian lines get subtitles. Fixed composed cameras, darkness, motivated light, fog. Never show what the story says not to show (e.g. beat 01: no spectacular zombie kill; use the flashlight spinning into gravel and the key swinging).

## Story facts (law; check every panel against them)
Left-wrist bite (Ganaa's left wrist); the kitchen door opens **inward** and has **no lock**; the infected **push/slam** doors only (they don't use handles); **no traffic lights** in Naran 1998; protected lines verbatim: «Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад... идчихсэн шүү дээ. Ямар алных нь томуу вэ...» and «…Пизда.»; profanity uncensored; **no pharmacy scene**; the enamel bowl is **not** how the infection passes.

## Deliverables
- `episodes/EP01/threejs/panels/B01.json` … `B26.json`, valid against the schema, each beat's panel durations summing to the beat's runtime (±2 s) from the beat sheet; every line id covered exactly once, in order.
- `episodes/EP01/threejs/tools/panels-lint.mjs` (node): schema validity, durations vs the beat sheet, line coverage, every location/anchor/cam exists in the registry, story-fact lint (e.g. no `pharmacy` location, no `traffic` objects, the bite panel references the **left** wrist, the kitchen-door panels push inward), and a summary table.
- `episodes/EP01/threejs/panels/BREAKDOWN.md`: per beat: panel count, total time, the hero panels, bursts, what assets/anchors are missing (a to-do list for the set/prop/cast workers), and any story ambiguity you resolved (state the choice as an artistic choice).
- Run the lint; output must pass.

## Rules
- Data only: no rendering needed, no Blender, never the Blender MCP.
- Write only `episodes/EP01/threejs/panels/B*.json`, `panels/BREAKDOWN.md`, `tools/panels-lint.mjs`. Don't change the schema, registry or story files. No commits. Don't touch `AGENTS.md`.
- Final `## Report:` with files, the lint output summary, total panel count and runtime, the missing-asset list, and doubts.
