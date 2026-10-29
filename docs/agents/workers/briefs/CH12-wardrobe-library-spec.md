# Brief CH12 — Wardrobe library spec for 1998 Naran (no Blender, a planning document)

**Department:** characters (`docs/agents/02-characters.md`). **Problem:** the character generator has only 14 clothing assets in `assets/sources/makehuman-core/clothes/` (male_casualsuit01–06, male_worksuit01, male_elegantsuit01, female_casualsuit01–02, female_elegantsuit01, female_sportsuit01, shoes02–03), and 24 of the 25 EP01 actors use `male_casualsuit05` or a recolour of it. A late-November 1998 provincial Mongolian town needs period clothing: deels, quilted and padded coats, fur hats, Soviet workwear, school uniforms, felt boots. This job writes the **spec and the production plan** for a wardrobe library. Modelling comes later as Blender jobs.

## Read first
- `docs/agents/00-production-master-plan.md` §2: the look tiers. Crowds are T2 with low-poly and 256–512 px textures; close-ups are T0.
- `docs/agents/02-characters.md`
- `artifacts/character-master/DNA.md`: the `clothing` fields and how clothing is applied.
- `artifacts/character-master/production/EP01-cast-v4.2.md`: the roles.
- `artifacts/character-master/sources/world/NARAN_WORLD_BIBLE_v1.0.md`
- `episodes/EP01/script/EP01-states.md`: clothing states such as the torn sleeve, the coat on or off, and the paper crown.
- Look at how the builder applies a clothing asset (`artifacts/episode-1-cast/scripts/build_actor.py` and the shared scripts it imports): proxy or mesh, fitting to the shared 137-bone rig, materials. That tells you what format a new garment must be in. **Don't modify these scripts.**

## Deliverable: `artifacts/character-master/production/WARDROBE_LIBRARY_SPEC.md`
1. **Period research summary.** What people in a provincial aimag centre wore in late autumn 1998, by group: drivers and labourers, market traders, office and civil workers, pensioners, women at home, schoolchildren and toddlers, medical staff, police and officials, Russian visitors.
   - Distinguish everyday deel use (often older and rural people, and women) from Soviet and post-Soviet Western clothing.
   - You can't browse the web. Use what you know, **mark each claim as "common knowledge, to verify" or as an artistic choice**, and list what to check with the user, who is Mongolian.
2. **Garment list**, about 25–40 items. For each:
   - name (Mongolian + English) and category (outer, mid, head, foot, accessory);
   - which roles and groups use it;
   - male/female/child fit;
   - tier needs (T2 crowd mesh vs T0 hero detail);
   - colour and material notes;
   - wear states: clean, worn, torn sleeve, bloodied;
   - priority: **P1** = needed for M2–M5 EP01, **P2** = later.
   Include at least:
   - a winter deel (with sash), a quilted vatnik-style jacket, a sheepskin coat, a long wool coat;
   - work overalls, a padded driver's jacket;
   - fur hats (malgai and ushanka), a knitted hat, a headscarf;
   - felt boots and gutal, rubber boots;
   - a school uniform, a toddler snowsuit;
   - a medical white coat and cap, a police uniform;
   - a party/best outfit for the birthday;
   - Altan's mittens, which are a hero prop on a child hand;
   - Ganaa's driver jacket, with the left sleeve over the bitten wrist.
3. **Role assignment table:** every EP01 actor ID → a proposed outfit (garment IDs + colours), so that no two actors in the same scene read alike. Check scene by scene with the cast file.
4. **Production approach.** How to make these garments so they fit the shared rig and the MakeHuman/MPFB pipeline:
   - MakeHuman `.mhclo` proxies vs custom meshes;
   - what's free and licence-compatible: the MakeHuman community asset licences (CC0/CC-BY);
   - what has to be modelled.
   - A **build order** of the P1 items for Blender jobs (one per 3–5 garments), each with acceptance checks: rig fit through the base action set, no clipping in the A-pose and the sitting/reaching poses, a triangle budget per tier.
5. **Questions for the user**: at most 6, for example how common deels were in their town in 1998.

## Done when
The spec exists, every EP01 actor is in the assignment table, the P1 list is ready to turn into Blender briefs, and `npm test` passes.

## Allowed paths
`artifacts/character-master/production/WARDROBE_LIBRARY_SPEC.md` only.
