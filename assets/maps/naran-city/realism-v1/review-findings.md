# Independent realism review — initial saved version

What this change does: develops the existing Naran exterior with household services, shops, agriculture, institutional boundaries and an extended landscape. The original native master and registered story geography remain protected.

Reviewed saved blend SHA-256: `f555ada16c377dbdd7bda07c9af067bd1effa8aa99eaedf1d188bd18f7e3a0ee`. The initial `qa-report.json` names this same hash. Findings below describe this reviewed version, before any author corrections.

## Must fix

1. **Hospital shed obstructs East avenue — P1** (`upgrade_realism.py:388`). The shed at `(910,310)` overlaps the registered road. Native QA reports three solid hits at approximately `(910.43–911.21,309.35–310.98)`. Move it into a clear service-yard pocket and rerun actual solid-route checks. Leaving it breaks protected vehicle access.

2. **School yard path runs through the school — P2** (`upgrade_realism.py:384`). The first segment runs from `(-720,-202)` to `(-720,-315)`, directly through N07's shell spanning X `[-757,-683]`, Y `[-253,-207]`. Route it around the shell and connect to the existing workshop approach. Native road checks do not cover this batched footpath, so a passing road report would not resolve it.

3. **All added apartment vents float above their roofs — P2** (`upgrade_realism.py:237–242`). The code uses nominal heights `12.4/9.3/15.5`; the preserved Apartment/Apartment3/Apartment5 kit surfaces at both vent positions are `11.22/8.42/14.02`. The vent bottoms are `12.425/9.325/15.525`, leaving air gaps of `1.205/.905/1.505` metres. These measurements come from decoding the original kit's actual triangles, including local hierarchy transforms, and sampling at each vent position for X scales `.9/1/1.05`. Place vents on the actual roof surfaces. N12 is affected too.

4. **The reused ground test rejects the intended replacement texture — P2** (`verify.py:21–22`, inherited `../verify_in_blender.py:137–143`). The old test requires an image named `Naran.GroundAtlas`, while this pass deliberately binds `Naran.RealismGround`. Native QA fails `residential_blocks_and_ground_surface` despite all used images passing the packed-texture check. Validate the replacement image actually bound to the ground material, including nonempty pixel content, instead of requiring the retired name or simply suppressing the check.

## Should fix

5. **Apartment catalog labels overstate the implemented variants — P2** (`upgrade_realism.py:239–247,261`). Five facade names and three roof names are assigned, but every block receives the same vent, plinth-strip and runoff-strip placements; only plinth material varies with `i % 3`, independently of the facade labels. In particular, `patched_metal` is a label without a corresponding new roof treatment. Report actual differences, or implement each claimed treatment. The catalog should not present unused category names as visible variants.

## Coverage and limits

- Read all five implementation/check modules, both JSON manifests, baseline audit, plan, story ledger and period-research note; traced inherited authoring and validation helpers.
- Read the first native QA report. It passes preserved anchor XYZ, original road geometry, N12 root transform, template-part transforms, road support/grade, source hashes and household-module parcel containment. It fails the shed obstruction and old atlas-name check above.
- Ran the five layout unit tests: all pass. Decoded original source GLB triangles without opening or modifying Blender to verify the roof-height mismatch.
- No source edits, exports, Blender processes, or scene writes performed. This report is the only authored file.
- No after images existed at review time. Did not approve art, historical specificity, final crowd/vehicle/medical blocking, or runtime performance. Parcel containment is not a full pairwise collision or grounding proof, and category counts are not proof of visual distinctiveness.

Verdict: fix 1–4 before delivery and make the catalog in 5 accurate. Rerun final saved-file QA and inspect all matching after views after corrections.

Not checked: final renders and actor-level blocking. Risk: initial native QA is currently red and does not cover every added pedestrian/service path.
