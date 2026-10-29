# Base models and cast redevelopment plan

Created 2026-10-28. Status: **proposed, waiting for your go-ahead.** Follows the
[character development plan](2026-10-28-character-development-plan.md) and the shared eye/brow fixes
of the same date. Ganaa's approved identity is the quality reference.

## 0. Root cause found during B1 (2026-10-28)

`build_character.py` loaded every face target **twice** (`head-round` plus `head-round.001`, and so
on), so every DNA face control has been built at double strength since commit `3a8c6d8`. That doubling
is the main reason the cast looked stretched and inflated. It is fixed; the builder now asserts that no
target is loaded twice. **Every existing actor, including the approved Ganaa, was approved or
reviewed at double strength**, so all of them need a fresh look after rebuilding.

B1 tooling is done: `scripts/sculpt.py` (prepare / push / inflate / smooth / export), an optional DNA
`sculpt` field loading `artifacts/character-master/sculpt/<layer>.target`, and a verified round trip
(4.831 mm sculpt in, 4.831 mm out; QA expressions, neutral recovery, 137-joint GLB and clips intact).

### B2 progress: Base M v1 (2026-10-28)

`work/sculpt/base_m.py` builds `sculpt/base-m.target` on a neutral man (all identity sliders 0),
tuned against `references/base-m` and `base-profiles`. It provides:

- **Profile depth:** nose projection and width, the mouth set back behind the nose, a defined chin.
- **Lids:** the lower lid meets the iris, a soft fold, a light inner-corner fold.
- **Closed relaxed lips:** the stock neutral mouth is parted and shows the teeth.
- **Lower forehead,** with a moderate brow ridge.

It has been applied to Ganaa, Hürel, Sükhee and the yard guard as `sculpt: {"base-m": 1}`; all four
read as real men in profile while keeping their own identities.

Shared fixes made along the way:

- **Brow color:** `finish_brows` used to normalize the color to its hue, so every brow rendered
  mid-brown. It now uses the true color, which means **DNA brow colors must be re-picked** (Mongolian
  characters: near-black, about `#15110e`) during B6.
- **`brown` eye color** darkened.

Open on Base M:

- A faint highlight band on the brow ridge.
- Brows are thin vertically (card height).
- Skin tone is warmer and pinker than the references.
- Hair (B5).

## 1. Why everyone looks like one stretched person

The review lineup confirms what you saw. The causes are structural:

| Cause | What it does |
| --- | --- |
| One generic base head for everyone | Each identity is the same MakeHuman head with ~60 slider offsets. Sliders change **proportions** (width, length, roundness), not **structure**: eyelid folds, cheek fat pads, nasolabial folds, brow bone, lip edges, ear shape. |
| Only 60 of 1,258 available shape targets used | The finer targets for those forms are installed but never driven. |
| Five photo skin textures shared by 13 people | Each photo carries its source person's own face marks, so different heads wear the same face skin. |
| Nine helmet-like hair meshes | Identical hard hairlines on everyone; no 1998 styles. |
| Same eyes, teeth, lips and expressions on everyone | No individual detail where people actually look first. |
| Life story absent from the face | Nothing shows trucker, cook, herder, teenager or drinker. |

More slider tuning cannot fix this. It needs better bases, plus detail layers on top.

## 2. The approach: three hero base models plus detail layers

Build **three hand-finished base heads/bodies**, all on the existing MakeHuman topology. Keeping the
topology keeps everything that already works: the 137-bone rig, the expressions, the clothes fitting,
the UVs and the GLB export. MPFB can save a sculpted shape key as a `.target` file, so each base and
each character's personal sculpt plugs into the current DNA builder.

```
character = base model (M / F / C)
          + identity sliders (existing DNA, now with more targets)
          + personal sculpt layer (.target: nose, lids, cheeks, ears; unique per character)
          + age / life layers (wrinkles, acne, weathering, scars, moles, stubble)
          + skin set from that base's library
          + hair from the new 1998 hair library
```

| Base | Covers | Starting point |
| --- | --- | --- |
| **M: Mongolian adult man** | Ganaa, Hürel, Sükhee, Tsogt, Lkhagva, Bayar, Erdene; teen boys and elder men via layers | **Ganaa** (the approved face) |
| **F: Mongolian adult woman** | Tsetsegmaa, Oyun, Narantuya, Sarantuya, Bolor, Narantsetseg; Anu (teen) and Dulmaa (elder) via layers | New hero sculpt |
| **C: child, ages 3–12** | Altan, Sarnai, the cordon boy, schoolchildren | New sculpt with child proportions, not a shrunk adult |

- **Russian characters** (Irina, Dasha, the yard guard if cast Russian) get a Slavic structure layer on
  base M or F rather than a fourth base.
- **The infant (Naran)** stays a separate real-infant body (Phase D4 of the main plan). Base C does not
  cover newborns.
- **Teens and elders** are layers, not bases. Aging the structure (fat-pad descent, skin thinning,
  bone prominence) as a layer is what makes 16 and 65 look different, rather than a stretched 40.

## 3. What makes a base "finished" (the Ganaa bar)

Each base must pass all of these before any character is built on it:

1. **Sculpted secondary forms:** eyelid crease and fold variants (single, hooded, inner fold),
   tear trough, cheek fat pads, nasolabial area, philtrum, lip borders, chin pad, brow bone, ear
   cartilage. Structure, not just proportions.
2. **Skin set at 4K:** albedo, normal, roughness and cavity maps painted for this base, with no baked-in
   marks from another person. Stored as separable layers so marks can be switched per character.
3. **Expressions:** smile without the eyes collapsing, blink without swelling, a brow-worry shape and
   Mongolian speech mouth shapes. Neutral must recover exactly (existing check).
4. **Five or more test faces that read as different people** in the clay lineup at thumbnail size
   (a squint test), in addition to the numeric distance report.
5. **Both renderers:** a Blender close-up and a Three.js mid shot, with GLB size within the budget set
   by the café render test.
6. **Your approval** of the base before any character is built on it.

## 4. Detail layer library (built once, shared by all bases)

| Layer | Contents | Used for |
| --- | --- | --- |
| Age | Forehead lines, crow's feet, nasolabial and marionette folds, neck rings, under-eye hollows, thinning lips, age spots; strength 0–1 per zone | 40+; strongest on Dulmaa and Dorj |
| Weather / steppe life | Wind-reddened cheeks, sun-darkened forehead with a hat line, chapped lips, squint lines, rough hands | Herders, drivers, guards, outdoor workers |
| Teen | Forehead and chin acne, oily T-zone, early fuzz on the lip, razor bumps on boys who shave | Anu, Munkh, Erdene, school pupils |
| Habit | Smoker's teeth and lip lines, drinker's broken capillaries and red nose, cook's burn marks | Irina, Sükhee, Hürel |
| Marks | Moles, scars, a broken-and-healed nose, cauliflower ear, pierced ears | Per character |
| Facial hair | Stubble, sparse moustache and chin hair, grey stubble | Adult men |
| Teeth | Normal, gaps, crowding, gold crowns (common in 1990s Mongolia), worn teeth | Speaking roles |
| Makeup (1998) | Party lipstick, light powder | Tsetsegmaa and the party guests |
| Story states | Bite wounds, fever flush, infected red line, frost, blood, dirt | Continuity ledger states |

**Hair library (1998):** short side part, crew cut, conscript buzz, receding, comb-over, women's perm,
bob, low bun, braid(s), ponytail, and hair under a headscarf or hat. Each has a soft hairline painted
on the scalp skin and real hair-card edges instead of a helmet edge.

## 5. Character redevelopment: who each person is

**Script facts** come from the screenplay and DNA sources and stay fixed. **Artistic choices** are
proposals, labelled, for you to accept or change. Every character keeps 2–3 visible signature traits.

### Episode 1

| Character | Script facts | Vibe | Artistic features (proposed) |
| --- | --- | --- | --- |
| **Ganaa** 46 (M) | KAMAZ trucker, husband and father | Generous, proud, joking | Keep the approved face. Add driver's squint lines, a windburned left cheek (the driver's-window side), chapped lips, rough hands, a slight receding hairline. |
| **Hürel** 50s (M) | Café cook, stained apron | Warm host, loud, sweaty | Heavy but not balloon-faced. Steam-flushed shiny face, small burn scars on the forearms, gold crown on a canine, sparse moustache, thinning hair under a cook's cap. |
| **Dasha** 24 (F + Slavic) | Russian hitchhiker, left-forearm injury, becomes a runner | Lying, exhausted, frightened | Gaunt cheeks, dark under-eyes, fever flush over pale skin, cracked lips, greasy hair pulled back, bitten nails. |
| **Irina** 54 (F + Slavic) | Russian epidemiologist, cigarette, dictaphone | Sharp, exhausted, urgent | Smoker's lip lines and teeth, deep frown line between the brows, short practical greying hair, reading-glasses mark on the nose. |
| **Tsetsegmaa** 30 (F) | Ganaa's wife, mother of Altan | Tired, warm, observant | Natural face with party lipstick, 1990s perm, slight dark circles from motherhood, one small mole as a trait. |
| **Dulmaa** 65 (F, elder) | Mother-in-law, notices the wrist | Sharp-eyed, traditional | Deep weathered wrinkles, age spots, sun-darkened skin, grey hair in a bun under a scarf, one gold tooth. |
| **Sükhee** 50s (M) | Drunk neighbour | Loud, sloppy, funny | Drinker's red nose and broken capillaries, puffy eyelids, unshaven, messy comb-over. |
| **Altan** 3 (C) | Girl in a paper crown | Shy, sleepy, sweet | Round toddler cheeks without the current puffiness, rosy winter cheeks, wispy fine hair in two tiny pigtails with ribbons, toddler skin (no adult texture). |
| **Yard guard** 50s (M) | Russian-speaking guard, tired | Bored, cold, slow | Grey stubble, broken capillaries from the cold, heavy bags under the eyes, flattened hat hair. |
| **Yard runner** (M) | Anonymous; attacks | Infected, feral | Wiry build, chapped and frost-damaged skin, fever flush and the infected states. |
| **Party guests** ×3 | Anonymous | Ordinary party energy | One young man with a teen-acne remnant and a buzz cut, one young woman with a perm and lipstick, one older man with a gold tooth and a deel. |

### Episodes 2–6 principals (DNA drafts start now, per your earlier answer)

| Character | Facts | Proposed features |
| --- | --- | --- |
| **Oyun** 38 (F) | Doctor; carries guilt in stillness | Tired eyes, no makeup, low bun, faint frown line, clean short nails |
| **Anu** 16 (F teen) | Holds the camera to avoid eye contact | Forehead and chin acne, ponytail, chapped lips, bitten cuticles |
| **Munkh** 15 (M teen) | Thin, hunched, smoke cough | Acne, a thin first moustache, hollow cheeks, dark circles |
| **Erdene** 19 (M teen) | Conscript, too-young tense face | Conscript buzz cut, razor bumps, cold-reddened ears and nose |
| **Tsogt** 40 (M) | Herder; few words, huge careful hands | Deep sun and wind weathering, squint lines, hat line, big rough hands |
| **Sarnai** 10 (C) | Counts everything; rides racing horses | Wind-chapped red cheeks (classic steppe-child cheeks), braids, a small scar on the chin |
| **Dorj** 71 (M elder) | Retired wrestler | Cauliflower ear, flattened nose, thick neck, deep wrinkles, short white hair |
| **Lkhagva** 58 (M) | Governor; calm, evasive | Well-fed and smooth-skinned (an indoor life), neat side part dyed black, faint glasses marks |
| **Bayar** 35 (M) | Lieutenant, easy grin, cruel | Gold tooth that shows in the grin, neat moustache, small scar through one eyebrow |
| **Narantuya** 27 (F) | Archer | Weathered outdoor skin, a long braid, calm steady eyes |

## 6. Phases

| Phase | Work | Exit gate |
| --- | --- | --- |
| **B0. References and style bar** (1–2 sessions) | Reference board: 1990s Mongolian people by age and region, clothing and hair of the era. No real person's likeness is copied. Agree on how realistic to go: grounded realism, not stylized or PSX. | You approve the board and the bar. |
| **B1. Tooling** | Custom `.target` support in the DNA (base + personal sculpt layer); expand controls toward the unused targets; layer system for skin marks; hairline painting; a distinctiveness check that includes sculpt layers. | One character round-trips: sculpt → `.target` → DNA build → rig, expressions and GLB intact. |
| **B2. Base M from Ganaa** | Lift Ganaa's shape into Base M; sculpt the secondary forms; paint a new 4K skin set; fix expressions. | Ganaa rebuilt on Base M is still Ganaa (you re-approve). Five test men read as different people. |
| **B3. Base F** | Hero female sculpt; first character Tsetsegmaa. | You approve; five test women read as different people. |
| **B4. Base C** | Child sculpt; Altan and Sarnai. | You approve; ages 3 and 10 read correctly. |
| **B5. Layers and hair library** | Section 4. | Each layer shown on all three bases at three strengths. |
| **B6. Rebuild the Episode 1 cast** | Each person gets a character sheet (section 5), then DNA v2 plus personal sculpt, layers and hair, then QA, then your review. | Each character individually approved; lineup squint test passes. |
| **B7. Episodes 2–6 principals** | Same process. | Same. |

Then the café proof (C05–C09 in the main plan) runs with the rebuilt Ganaa, Hürel and Dasha.

## 7. Being honest about the sculpting

- **What I can do well:** the tooling, driving all 1,258 targets, scripted region sculpts (moving
  vertex regions as shape keys), painting procedural skin layers (wrinkles, acne, capillaries,
  weathering), hair-card generation, QA, and builds.
- **Where a human hand is better:** the final organic polish of each base sculpt. Scripted sculpting
  gets about 80% of the way there. Each base gets its last 20% best from someone in Blender's
  sculpt mode, with the MCP connection used to load and check the results. You or an artist can do
  that pass, or I can push further by script and we accept a slightly lower ceiling.
- **Skin textures:** better 4K source skins may need new CC0 or properly licensed scans. Every new
  asset gets the same license check as the existing ones (`docs/asset-sources.md`).

## 8. Decisions (answered 2026-10-28)

1. **Three bases (M, F, C)** with Slavic and age as layers: approved.
2. **Fidelity: keep the current level** (enough detail to show everything, not high-end realism).
   Spend the effort on **human proportions and structure**. The current faces read stretched and
   uncanny; "as human as possible" is the acceptance test, not texture resolution. 2K skin maps are
   enough; 4K is not required.
3. **Claude does all the sculpting** (script-driven, checked in renders). No artist pass is planned.
4. **References:** none on hand. The user will generate fictional references from
   [`references/PROMPTS.md`](../../artifacts/character-master/references/PROMPTS.md) and drop them
   into `references/<id>/`. Base-model variety sheets come first.
5. **Section 5 features:** accepted in direction. The priority is looking like real people; marks and
   layers are secondary to correct proportions.
