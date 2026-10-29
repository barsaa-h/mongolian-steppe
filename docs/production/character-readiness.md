# Episode 1 character readiness

> **Historical 27 October readiness baseline and technical research.** Current [actor status](../../artifacts/character-master/production/STATUS.md), [jobs](../../artifacts/character-master/production/JOBS.md) and [source decisions](../../artifacts/character-master/production/SOURCES.md) supersede its pilot priority and older screenplay assumptions. Preserve the detailed evidence below; none of its studies automatically becomes an approved shot.

Baseline recorded 2026-10-27 from the working tree at `27444c372fb41444da5ee8138edb0228b43acf0b`. This is an inventory, not a release or a fresh QA pass. The working tree already contained scene, roster, film and asset changes. The dialogue master calls itself a cleaned draft for the next screenplay pass; its beat times below locate the breakdown and are not locked shot timings. See [dialogue](dialogue-master.md#ep-1--аягаа-хуваалц-share-the-bowl) and [series bible](series-bible.md#ep-1--share-the-bowl).

Design approval is separate from fit, animation, integration and shot approval. Ganaa's design is approved ([record](../../artifacts/episode-1-cast/ganaa-production-review.md)); the other 12 DNA designs are drafts. No DNA asset below is approved for a finished film shot. Each DNA link below leads to the source; its generated candidate lives at `artifacts/episode-1-cast/<id>/character.glb`. A separate [Ganaa technical candidate](../../assets/cast/candidates/ganaa/README.md) can be selected explicitly through the film loader; normal scenes still load `assets/cast/<id>.glb` for the legacy roster.

| DNA / identity | Outfit and story state | Script beats and required performance | Film / blockers |
| --- | --- | --- | --- |
| [ganaa](../../artifacts/episode-1-cast/dna/ganaa.json) | Work clothes; healthy, wrist bite and rag, HOUR 5, turning | Yard loading and satchel; drive, share bowl, brake, escape; wrist insert and wrapping; wheel, sheep and slap; eating, song and lap | Legacy in HOUR 5 and party; a DNA candidate loads explicitly at rest. Approved identity only; DNA rig has no authored film clips; fit, contact, makeup, speech and shot integration unproved. |
| [irina](../../artifacts/episode-1-cast/dna/irina.json) | Coat; normal | Yard office recording and cigarette; approach and hand satchel to Ganaa | Legacy yard actor. Draft; prop interaction, fit and speech unproved. |
| [dasha](../../artifacts/episode-1-cast/dna/dasha.json) | Coat and left forearm scarf; unwell, fed runner | Roadside pickup, passenger and bowl, eating; café lunge and truck chase | DNA draft; no DNA film integration, running/coat/scarf proof or final makeup. |
| [hurel](../../artifacts/episode-1-cast/dna/hurel.json) | Shirt and apron; normal / attack | Café service, speaking and attack | DNA draft; no DNA film integration; apron is rigidly attached and movement unproved. |
| [tsetsegmaa](../../artifacts/episode-1-cast/dna/tsetsegmaa.json) | Party outfit; normal | Greeting, cheek and forehead touch, speaking, birthday interaction | Legacy party actor. Draft; contacts, wardrobe and speech unproved. |
| [dulmaa](../../artifacts/episode-1-cast/dna/dulmaa.json) | Deel and boots; normal | Party conversation, notices wrist, reaction | DNA draft; no DNA film integration; deel motion and sitting unproved. |
| [sukhee](../../artifacts/episode-1-cast/dna/sukhee.json) | Party clothes; normal | Party conversation, eating and reactions | DNA draft; no DNA film integration; fit and speech unproved. |
| [altan](../../artifacts/episode-1-cast/dna/altan.json) | Birthday clothes and paper crown; normal | Climbs onto Ganaa's lap; seated interaction and look | Legacy party actor. Draft; child-specific skin, skirt, scale and contact unproved. |
| [yard-guard](../../artifacts/episode-1-cast/dna/yard-guard.json) | Guard clothes and cap; normal / attacked | Flashlight, keys, boxcar approach and attack | Legacy yard actor. Draft; props, fit and action unproved. |
| [yard-runner](../../artifacts/episode-1-cast/dna/yard-runner.json) | Work clothes; fed / standing | Yard attack, then stands by steam pipe | Anonymous casting instance, no legacy roster ID; yard currently uses procedural infected. Draft; action and integration unproved. |
| [party-young-man](../../artifacts/episode-1-cast/dna/party-young-man.json) | Guest outfit; normal | Party eating, conversation and reactions | Anonymous casting instance; party uses procedural guests. Draft; assignment, fit and crowd strategy unproved. |
| [party-young-woman](../../artifacts/episode-1-cast/dna/party-young-woman.json) | Guest outfit; normal | Party eating, conversation and reactions | Anonymous casting instance; party uses procedural guests. Draft; assignment, fit and crowd strategy unproved. |
| [party-older-man](../../artifacts/episode-1-cast/dna/party-older-man.json) | Guest outfit; normal | Party eating, conversation and reactions | Anonymous casting instance; party uses procedural guests. Draft; assignment, fit and crowd strategy unproved. |

The current roster has nine Episode 1 visible principal IDs and radio as a voice role. The off-screen crying baby is not assigned a visible body and is not established as Naran. The three guest identities do not represent all forty party guests. Assignment of the runner and guests to specific runtime instances is pending; no new canonical identity is implied.

## Evidence and unresolved continuity

- Saved [neutral lineup](../../artifacts/episode-1-cast/qa/lineup.png), [profiles and expressions](../../artifacts/episode-1-cast/qa/index.html), [diversity](../../artifacts/episode-1-cast/diversity-report.json), [native](../../artifacts/episode-1-cast/native-report.json) and [browser](../../artifacts/episode-1-cast/browser-report.json) reports are historical evidence, not fresh verification of this baseline. Shared smile narrows the eyes; brows and hairline need review. Garment movement has not been established by stills.
- The script specifies a wrist bite but does not specify the side; Dasha's scarf is explicitly on her left forearm. Choose Ganaa's side from the approved edit before finishing makeup. The script does not establish the exact moment or cause of Ganaa's bite. Do not invent one.
- Episode actor reports now record clip names and hashes inspected from the actual GLBs. `Talk_Check` is a technical exercise. Historic reports do not prove generator revision, source-asset hashes or a fresh verification, so they are not release gates. `controlMorphs` counts separate identity controls, not the `EXP.*` expression shapes.
- `review: approved` applies to Ganaa's identity design, not his wardrobe, animation or HOUR 5 shot. The QA page's general pending-review text and older README wording predate that approval.

## Before-change HOUR 5 reference

The current HOUR 5 uses legacy `assets/cast/ganaa.glb`, the `hour-five` clip and `assets/cast/cab.json`. The [working-tree scene patch](baselines/2026-10-27-scene-changes.patch) preserves the pre-existing changes to `src/scenes.js` and `src/sceneStages.js` relative to the baseline commit; it is not a complete snapshot of all pre-existing work. The existing [contact test](../../tests/cast-pose.test.mjs) checks wheel grips within 0.006 scene units at its sampled times and cheek contact within 0.012 at 22.15 s, plus a seek repeat. These are legacy reference expectations, not evidence that the DNA character meets them.

| Baseline file | SHA-256 |
| --- | --- |
| `assets/cast/ganaa.glb` | `2f779e2b62c68135a9f9610627bb13f57a78e63ff267fa713610c9328d795c0e` |
| `assets/cast/cab.json` | `85cf4a1701c7ba51d7894405f1f65de0b646364423d4b782bada14ec79808201` |
| `artifacts/episode-1-cast/ganaa/character.glb` | `0e0893c870eac2d2f20b4e750f6a8a3d8482f32ee4d007ff0fd61c7538bd0ea8` |
| `artifacts/episode-1-cast/dna/ganaa.json` (file bytes) | `8d5d47f6a11731e40369a9640df918284b7dca90a72565d205d737df359c33b4` |
| `src/scenes.js` | `b11fbd4954a5581ffaecc4d6a5c7627441993a14ef87a030f61f6ad152f610f3` |
| `src/sceneStages.js` | `3d0f2d58289bc36b411eb3ed33c6833c8cfc6b8f9e743de5cf5a30b850a71c79` |
| `src/filmTimeline.js` | `79a1e500fe31539351742b70026c669dec28f6f5e7286c6e2828f6ee6c3cd1b3` |
| `src/character.js` | `51a07f8a3bf2c243885fbc8e435cee28ec530f3b5c70869dfae2d2d33bb67896` |
| `tests/cast-pose.test.mjs` | `5914201963d80834fd7de0eee4c50db6a2c6fc85fbb10a90f0de3a66f67e8dbe` |

The file-byte DNA hash above differs in purpose from the normalized DNA fingerprint in the actor report. No fresh film render or full dependency snapshot was captured here; retain the current legacy assets and working tree until a visual baseline and candidate are checked.

### Candidate renderer diagnostic

The explicit `film.html?ganaa=dna-candidate` preview loads the DNA candidate into the actual HOUR 5 stage at rest; it is not an authored driver animation. The [browser evidence](../../artifacts/episode-1-cast/ganaa-pilot-qa/browser-report.json) records the candidate file hash, available clips, rig and material checks, and repeated out-of-order seek. [Legacy reference](../../artifacts/episode-1-cast/ganaa-pilot-qa/legacy-cab.png) and [candidate at the same camera](../../artifacts/episode-1-cast/ganaa-pilot-qa/candidate-cab.png) make the missing seated pose visible: the standing candidate's head is outside the frame, and wheel contacts cannot be evaluated. The [lowered smile image](../../artifacts/episode-1-cast/ganaa-pilot-qa/candidate-lowered-smile.png) moves the whole actor down solely for face inspection; it is not a seated pose. Its sharp hairline, thin brows and narrowed eyes remain visible. No mouth/speech or seated contact is approved by these captures. The actor still needs a baked driving pose/performance and calibrated contacts before a real pilot render.

### Draft driving block

A separate [editable driving block](../../artifacts/episode-1-cast/ganaa-driver-study/README.md) places the shared-rig Ganaa in a provisional seated position and exports a held test clip. The actual [shot frame](../../artifacts/episode-1-cast/ganaa-pilot-qa/driver-block-8.png) now includes his head; the [wrist insert](../../artifacts/episode-1-cast/ganaa-pilot-qa/driver-block-2.3.png) shows open fingers and does not establish a grip or readable bandage. The test measures wrist positions, not palm contact, and cannot establish usable performance or garment deformation. The legacy shot remains in use.

The Ganaa study's native source and neutral-expression checks passed, and the cast-wide matching-material lineup and profile checks were refreshed for all 13. The separate regional distance report passed all 78 pairs (closest 0.086742; threshold 0.055). The [lineup and individual profiles](../../artifacts/episode-1-cast/qa/index.html) remain visual review material; twelve designs are still drafts. These checks do not approve the blocked driving pose.

### Draft wheel-grip study

A separate [grip study](../../artifacts/episode-1-cast/ganaa-grip-study/README.md) bends the fingers and tests the actual skinned hand vertices against the wheel tube. The earlier block had 43 vertices per hand over 1 mm inside the tube; this held study has none at its sampled frame, and its nearest sampled vertices lie about 0.21 mm from the ideal tube surface. This is not proof of hand-to-wheel contact or a visually acceptable grip: the [wrist insert](../../artifacts/episode-1-cast/ganaa-grip-study/shot-2.3.png) shows a sleeve gap, hidden bandage and incomplete finger wrap. Triangle crossings and changing poses still need inspection. The study is not loaded by the film.

### Story state and wrist framing

The DNA candidate now starts in `healthy` and uses the asset’s story-state metadata to show its bandage for `hour-five` and `turning`; this is visibility only, not final makeup. The candidate wrist insert now looks toward the right side, where the existing artistic bandage is placed; the script does not specify the bite side. The [right-side study frame](../../artifacts/episode-1-cast/ganaa-grip-study/shot-right-2.3.png) still shows an obscured bandage and cuff opening. Rest-pose source inspection finds most right forearm skin masked beneath the jacket: any rolled-sleeve variant must restore appropriate skin from the complete body and refit the sleeve, rather than simply cutting the runtime garment.

### Exposed forearm research

A disposable [rolled-sleeve probe](../../artifacts/episode-1-cast/research/rolled-sleeve-research.md) restored skin and fitted the wrap while retaining the tested expression targets and full authoring source. The held-pose wrap-to-skin distances improved, but the [shot](../../artifacts/episode-1-cast/research/rolled-sleeve-probe.png) still fails visually: the cuff and wrist deform poorly and the wrap is not readable. This research is not a generator feature or release asset.

## HOUR 5 continuity clarification

The dialogue master places the exposed bite and crawling line before HOUR 5, then says Ganaa wraps it in a rag. At HOUR 5 the line has reached his elbow. The experimental wrist studies show a bare bite and a shorter moving line in the HOUR 5 camera; they are visual probes and contradict that sequence. The candidate player starts a tagged line fully revealed for HOUR 5, but the draft still lacks the elbow-length line and rag and is not continuity-ready. The exact wrist side and final edit remain unapproved.
