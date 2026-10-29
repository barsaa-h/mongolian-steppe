# Episode 1 character status

## 2026-10-29: EP01 v4.0 cast built and published

The final script is the 25-minute [beat sheet v4.0](../sources/story/EP01_AyaGaa_Huvaalts_25min_Beat_Sheet_v4.0.md).
Its full cast is in [EP01-v4-CAST.md](EP01-v4-CAST.md).

- **43 actors** have full DNA, are built, have passed QA, and are published: 24 named/featured roles,
  10 party guests, 6 town people and 3 children.
  - Canonical folders: `artifacts/episode-1-cast/<id>/`.
  - Runtime GLBs: `assets/cast/dna/<id>.glb`, with hashes in `manifest.json`.
  - Builders: `scripts/make_background_cast.py` (background DNA) and `scripts/publish_cast.py`
    (refuses builds that don't match the DNA or lack QA).
- **Runtime:**
  - `loadCharacter({id, assetVersion: "dna"})` loads any published actor.
  - The character studio lists them under "EP01 pilot cast".
  - The legacy roster and the HOUR 5 film are unchanged.
  - Tested in `tests/dna-cast.test.mjs` and in a headless Brave studio load.
- **Shared system** (see [base models plan](../../../docs/plans/2026-10-28-base-models-plan.md)):
  - Double target load fixed.
  - Bases M, F and C as sculpt layers.
  - Eyes: lashes, pupils, sclera, the iris pit filled.
  - Brows on the measured brow bone.
  - Stubble shadow; eye-shape types.
  - Soft hairline, padded coats, plain deels.
- **Checks:** all 43 pass QA (expressions, neutral recovery, export) and all 903 face pairs pass the
  distance check. Clay and textured lineups are in `artifacts/character-master/review/2026-10-29-ep01-full-cast-*`.
- **Approval:** the user approved Ganaa's look. The other 42 are `draft` until the user approves them.
- **Known limits:**
  - Hair is still MakeHuman's 9 meshes (no perms, side parts or headscarves).
  - Women in skirts show bare legs and white socks.
  - Child faces are approximate.
  - GLBs are ~17 MB each (no crowd LOD yet).
  - Only the `Deformation_Check`/`Talk_Check` clips exist: no walk, sit or acting performances.
  - Café blocking (C05–C09) not started.

## Earlier status (27–28 October)

Updated 28 October 2026. The user's **about 40% complete** estimate describes work in progress; it is not a measured completion score. The shared character system and Ganaa's chosen identity are the foundation. Episode 1 is ready for layout and acting development; finished-shot readiness has not been established.

## What exists

- One shared MakeHuman/MPFB generator, facial DNA controls, age/body baselines, material libraries and fitted assets.
- Thirteen Episode 1 DNA files and generated native/GLB actors. Ganaa's identity is approved; twelve designs need human review.
- Five master examples for regression checks across proportions and age. These are test fixtures, not competing designs.
- Saved neutral clay lineup, profiles, expressions, distinctiveness reports, native and browser checks. These are prior evidence; no character rebuild or new visual sign-off happened during this organization.
- Separate Ganaa driving, grip, wrist, cheek, shoulder, cuff and dialogue studies. They contain useful technical work, but are not approved current-screenplay performances.
- A legacy runtime cast and film excerpt that still power the application. Keep them until individual replacements pass their scene checks.

## Active cast

All links below use the `episode-1` shortcut to the existing canonical cast folder. Edit `dna/<id>.json`; generated `<id>/` files are replaceable output.

| Actor | Identity review | Existing source/output | Next required proof |
| --- | --- | --- | --- |
| Ganaa, 46 | Approved identity | [DNA](../../episode-1-cast/dna/ganaa.json), [native](../../episode-1-cast/ganaa/Character-Master.blend), [GLB](../../episode-1-cast/ganaa/character.glb) | Healthy café sitting, banter, gaze, chair and escape; later wrist/rag continuity, livestock passenger and birthday. |
| Hürel, 50s | Draft; exact age unstated | [DNA](../../episode-1-cast/dna/hurel.json), [build](../../episode-1-cast/hurel/) | Café work and speech, reach toward Dasha, neck/hand contact; apron deformation. |
| Dasha, 24 | Draft | [DNA](../../episode-1-cast/dna/dasha.json), [build](../../episode-1-cast/dasha/) | Passenger and shared bowl; café sitting, rise, approach and attack; left scarf/coat fit. |
| Irina, 54 | Draft | [DNA](../../episode-1-cast/dna/irina.json), [build](../../episode-1-cast/irina/) | Recorder/cigarette handling and satchel handoff, Russian performance. |
| Tsetsegmaa, 30 | Draft | [DNA](../../episode-1-cast/dna/tsetsegmaa.json), [build](../../episode-1-cast/tsetsegmaa/) | Greeting, jaw/wrist touch and birthday concern; later survival retained in season breakdown. |
| Dulmaa, 65 | Draft | [DNA](../../episode-1-cast/dna/dulmaa.json), [build](../../episode-1-cast/dulmaa/) | Deel walking/sitting, inspecting wrist and reaching for cloth. |
| Sükhee | Draft; exact age unstated | [DNA](../../episode-1-cast/dna/sukhee.json), [build](../../episode-1-cast/sukhee/) | Seated banter, cup/food contact and change in reaction. |
| Altan, 3 | Draft | [DNA](../../episode-1-cast/dna/altan.json), [build](../../episode-1-cast/altan/) | Child skin and dress, walking/climbing/lap contact, gift and mitten handling. |
| Yard guard, 50s | Draft; exact age unstated | [DNA](../../episode-1-cast/dna/yard-guard.json), [build](../../episode-1-cast/yard-guard/) | Flashlight, key, freight door and attack response. |
| Yard runner | Draft anonymous instance | [DNA](../../episode-1-cast/dna/yard-runner.json), [build](../../episode-1-cast/yard-runner/) | Mapped sprint, attack, exhaustion and standing near heat. |
| Young male guest | Draft anonymous instance | [DNA](../../episode-1-cast/dna/party-young-man.json), [build](../../episode-1-cast/party-young-man/) | Assign a visible party instance; sitting/eating/reactions. |
| Young female guest | Draft anonymous instance | [DNA](../../episode-1-cast/dna/party-young-woman.json), [build](../../episode-1-cast/party-young-woman/) | Assign a visible party instance; sitting/eating/reactions. |
| Older male guest | Draft anonymous instance | [DNA](../../episode-1-cast/dna/party-older-man.json), [build](../../episode-1-cast/party-older-man/) | Assign a visible party instance; sitting/eating/reactions. |

The new Episode 1 also needs the **freight loader, two café drivers and livestock driver** assigned to visible roles. They do not yet have dedicated Episode 1 DNA in this pool. Reconcile existing legacy profiles and shot visibility before making new bodies. Radio and the off-screen crying guest infant need audio assignments. Three guest designs do not cover forty unique close-up party guests.

## Review material and known failures

- [Neutral lineup](../../episode-1-cast/qa/lineup.png), [all profiles and expressions](../../episode-1-cast/qa/index.html), [face distances](../../episode-1-cast/diversity-report.json), [saved native report](../../episode-1-cast/native-report.json), [saved browser report](../../episode-1-cast/browser-report.json).
- Shared smile/lid behavior narrows the eyes; brows and straight hairlines still need review. Child skin remains an adult source atlas requiring an age-appropriate pass.
- Apron/deel/skirt and layered sleeves need movement proof. A successful neutral render does not establish dressed motion or hand/prop clearance.
- Wrist, cuff and dialogue studies remain provisional. The approved identity does not approve their costume states, audio, motion or camera shots.
- Runtime scene migration, recorded voices, retimed lip sync and final rendered scene approval remain open.

See [jobs](JOBS.md) for execution order and [source decisions](SOURCES.md) for story changes that make some older studies obsolete as shots.
