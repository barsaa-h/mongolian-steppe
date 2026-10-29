# 02 — Characters agent

**Mission:** give every person on screen a distinct, human, 1998-plausible body and face. Each needs a T0 close-up version, a T2 crowd version, and every wound and costume state the story needs.

**Owns:** `artifacts/character-master/`, `artifacts/episode-1-cast/`, `assets/cast/`.
**Read first:** [AGENTS.md](../../AGENTS.md), [DNA.md](../../artifacts/character-master/DNA.md), [GUIDE.md](../../artifacts/character-master/GUIDE.md), [STATUS](../../artifacts/character-master/production/STATUS.md), [JOBS C01–C14](../../artifacts/character-master/production/JOBS.md), the [base models plan](../plans/2026-10-28-base-models-plan.md), the [realism and variety plan](../plans/2026-10-28-realism-and-variety-plan.md) and the [character development plan](../plans/2026-10-28-character-development-plan.md).

## Priority now
M2 birthday slice: Ganaa, Tsetsegmaa, Altan (CH02 first, if Base C can be ready; otherwise use the current draft as a stand-in), Dulmaa, Tungalag + infant prop, Sükhee. Body and costume first; face polish comes after the voices.

## Where things stand (29 Oct 2026)
- 43 EP01 actors are built, QA'd and published (`assets/cast/dna/*.glb`, `loadCharacter({id, assetVersion:"dna"})`).
- **Ganaa is approved** (Base M, new eyes, brows on the brow bone). The other 42 are `draft`.
- The Ganaa studies (driver, grip, wrist, cheek, shoulder, cuff, dialogue) and the HOUR-5 film are **kept**. They are engineering evidence, not current shots.
- Known limits: 9 MakeHuman hair meshes; bare legs/white socks under skirts; approximate child faces; GLBs about 17 MB each with no LOD; only test clips; Base C (child) is not finished, so Altan's body is provisional.

## Fixed decisions (don't re-ask)
- Follow the fixed approach: MakeHuman/MPFB 2.0.18, complete topology, shared 137-bone rig, keep identity/age/expression separate, and give each character 2–3 signature traits.
- Proportions: "as human as possible", never stretched. Each character gets a **different eye-area type**.
- Dulmaa is Tsetsegmaa's mother: shared cheekbones, other features distinct.
- No T-shirts or logo outfits (`female_casualsuit01/02`, `male_worksuit01`). `short03` hair is a long fringe. Hair length < 1 sinks into the scalp.
- The legacy `bold` character is retired. Naran (EP02) gets a real infant body built on a new infant base.

## Tasks

| ID | Task | Acceptance | Status |
| --- | --- | --- | --- |
| CH01 | **Apply the v4.2 cast** (from story S02) | New DNA for roles that are visible but have no actor yet (bus driver, kiosk seller, Hürel's helper, bleeding man at the gate, etc.). Rename `cousin` → Tungalag in metadata. Pasha is Russian (adjust his DNA ethnicity cues). Retire the pharmacist from EP01 publishing; keep the files. Run all QA and the distinctiveness checks. | DNA drafts done (Codex); builds + sharper signature traits + user review pending |
| CH02 | **Base C finished → Altan rebuilt** | Toddler proportions (3 years), an age-appropriate skin atlas instead of the adult one, mitten-sized hands, paper crown fit. User review. | open |
| CH03 | **Café trio review (C04)** | Ganaa + Hürel + Dasha: neutral lineup, profiles, dressed views. User approves Hürel and Dasha. | open |
| CH04 | **T0 hero variant** (supports the M3 look test) | Per hero actor (Ganaa, Tsetsegmaa, Altan, Dulmaa, Hürel, Dasha, Irina, Sükhee): 4K skin with pores and redness, sclera veins and wet eye line, hand detail, 1 level of subdivision, and a hair card/strand upgrade for close-ups. One switch on the same rig, with no change to identity. | open |
| CH05 | **T2 crowd LOD** | Decimated LODs (≤ 5k tris) with 512 textures for background actors. GLB ≤ 2 MB. Same rig and the same silhouette as T0/T1. | open |
| CH06 | **Story states** (from S04) | Shape-key/decal/material layers: Dasha's left-forearm bandage; Ganaa's **left-wrist** bite → wrap → soaked wrap; the torn bloody sleeve; fever (sweat sheen, flushed cheeks, a damp collar on the yard runner); Sükhee's upper-arm bite (EP02). States stack on any actor without a rebuild. | open |
| CH07 | **1998 winter wardrobe pass** | Padded coats, deels, fur hats, felt boots, Soviet work jackets (Bataa's heating-plant jacket), Irina's practical Russian clothing. Fix the bare-leg/white-sock skirt problem with thick tights or trousers. Check the garments in sitting and reaching poses. | open |
| CH08 | **Hair library expansion** | Perms, side parts, headscarves, a grey bun (Dulmaa), a toddler's hair. Close-ups need hair that reads as hair. | open |
| CH09 | **Face performance rig check** (lip-sync itself waits for the user's recordings, M8) | Visemes for Mongolian and Russian, blink, the eye-narrowing smile fix, a breath/jaw "unnatural inhale" for beat 26, and a return to neutral. Hand off to 06. | open |
| CH10 | **EP02 principals** (M10) | Oyun, Bolor, Narantsetseg, infant Naran (new base I), extra hospital staff. Run the full DNA + QA for each. | open |
| CH11 | **EP03–06 principal drafts** | Lkhagva, Sarantuya, Anu, Munkh, Erdene, Bayar, Narantuya, Tsogt, Sarnai, Dorj. DNA drafts only, no publishing yet. | open |

## QA required before showing anything
Run the neutral matching-material lineup and profile, the expressions and their return to neutral, the animation and export checks, and the distinctiveness check. Show the user the lineup and profiles and **name the visible failures**. Fix shared defects in shared controls, then re-check every actor they affect.

## Inbox
_(other agents add requests here)_
