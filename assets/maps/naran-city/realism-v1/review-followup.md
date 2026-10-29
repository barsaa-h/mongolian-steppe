# Independent follow-up — corrected geometry and first eight after views

What this change does: keeps the existing town and its story geography while adding a continuous hill horizon, working agricultural fringe, household services and differentiated apartment details. The biggest visible improvement is the disappearance of the finite terrain edge; the finer everyday-life additions are present but less legible in the wide review views.

## Review boundary

Reviewed all eight `previews/after/*.png` images dated 29 October, 18:08–18:13, all eight corresponding before images, the master-map PNG, corrected sources and the 18:11 native QA report. The report passes **31 checks** and names blend hash `282eacf355eaf5e51b2b86ee522ecde6103676249f56e0b571d1ad417824de35`. The scene was saved again during review for the pending palette correction, so that report is evidence for the preceding saved version, not certification of the final pending revision. Reran six layout tests: all pass.

The source now converts display sRGB palette colors to linear shader values. The images inspected here precede that patch. Pale roads/fences in those images are therefore **not filed as an unresolved palette defect**.

## Original findings resolved

1. Hospital shed is relocated to `(945,390)`; actual solid-route check has zero hits in 22,485 samples.
2. School path now goes around the east side of N07; new path check reports zero blocked vertices and the layout test covers the detour.
3. All 34 roof vents have native support checks; maximum measured absolute gap is about `0.000002 m`.
4. Ground verification checks the replacement image and packed data rather than the retired name.
5. The apartment authoring now has actual facade/roof branches, and catalog entries list their treatments. This resolves the metadata-only variant claim.

## Necessary correction before delivery

**P2 — Both school gateway signboards are unsupported** (`upgrade_realism.py:424–426`). Each board spans X ±3.5 m while its uprights stand at X ±4.5 m with inner faces at ±4.4 m. No crossbar connects them, leaving a 0.9 m air gap at each end of the board. Add one crossbar reaching the uprights or widen the board to span them. This is a verified source-geometry defect; the eight views do not show either gateway close enough to expose it clearly. Keep the clear walking/vehicle opening below it.

After the remaining edits, regenerate the matching views and native QA against the final saved-file hash. The pending palette revision must not inherit an older green report without revalidation.

## Visual corrections recommended for this pass

- **Restore timber construction cues in the replacement fences** (`upgrade_realism.py:220–225`). Before images show planked wood with visible joints and varied boards; the replacement is one uninterrupted box per edge, plus spaced posts. In the market foreground and ger-street view it reads as a smooth panel wall. Color correction alone cannot restore the missing joints. Reuse the existing timber material/detail or add restrained plank seams/boards for the wood families, while keeping sheet-metal families solid. This is a visible loss of existing detail, not a road/collision bug.
- **Give the four market identities readable contrast** (`upgrade_realism.py:366–369`). Cream lettering sits directly on the tan shop facade below the awning. The supplied market and street views do not clearly communicate food, bread, parts and pharmacy; the native manifest does. A dark backing strip at the existing sign position is a small fix. Check a closer supplementary view before claiming readable signage. The current fixed comparison cameras should remain unchanged.

## Further art refinement and qualified claims

- Apartment roof details are now genuinely different, but the apartment overview still reads as a regularly spaced family of almost identical shells. Household layouts have more belongings, eight mixed ger/house parcels, fence colors and small shape variation; the long regular street rows remain apparent. Say **reduced repetition through local treatments**, not unique architecture for every block or a fully organic settlement. Do not silently move the protected town to address this.
- The market has plausible ordinary goods/service categories and the agriculture view now shows fields, a pen, grain handling and freight. The fixed agriculture view crops much of the close farm-workshop/equipment area, while the eight views do not closely show the water points, fuel reserve or school/hospital gateways. A detail/catalog sheet can demonstrate those additions; the comparison views alone cannot prove their functional completeness.
- Several remaining surfaces are visually broad and simple: field rows are clean parallel strips, roadside edges are straight, courtyard spaces are large, and local repair patterns are sparse. These are art-refinement targets for grounded period horror, not newly discovered story-route regressions. Native geometry counts and category totals cannot approve atmosphere, visual distinctiveness or historical accuracy.
- The town reads intact and inhabited through practical windows and maintained buildings. Disabled outbreak collections provide separation; their existence is not proof that later-state dressing has been authored.
- Period-specific vehicle models, signs, daily weather, actor-scale blocking, hospital four-zone timing and actual gate/latch operation still require the existing human production reviews. This review does not approve canon or final art.

## Verdict

The original five findings are resolved in the corrected version. Fix the unsupported school signs, finish the pending palette pass, improve fence/sign legibility where practical, and bind final verification to the final saved scene. Present the result as a reviewed exterior realism iteration with the remaining visual and blocking limits above.

Not checked: Blender was not opened or modified; no runtime, actor animation or final post-palette render review. Risk: a green static QA report does not establish complete pedestrian/service-path clearance or final human art approval.
