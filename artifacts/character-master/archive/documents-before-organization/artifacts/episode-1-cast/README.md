# ХАНИАД — Episode 1 cast development

Thirteen editable 3D designs for **АЯГАА ХУВААЛЦ / Share the Bowl**, autumn 1998.
The complete available dialogue master (Episodes 1–5) and series bible were read
before casting. [Research and continuity notes](research/appearance-notes.md)
separate source facts from appearance decisions.

Character anatomy and appearance now come from **`dna/<id>.json`**. Read the
[shared DNA workflow](../character-master/DNA.md) for the 60 facial controls,
age/body baselines, material libraries, deterministic drafting and review rules.
[Open the matching-material face QA](qa/index.html) to compare identities without
hair/clothing cues, inspect profiles and expressions, and read the distance report.
Ganaa’s DNA design is approved; the other 12 remain drafts for human creative
review. Design approval does not establish readiness for a film shot.

## Cast

| ID | Script identity / exact age | Design focus |
| --- | --- | --- |
| ganaa | Ганаа, 46 | Stockier trucker, work jacket, broad face, weathered skin |
| irina | Ирина Ковалева, 54 | Lean epidemiologist, bob, muted coat, tired older face |
| dasha | Даша, 24 | Lean hitchhiker, long hair, subtle blemishes, left forearm scarf |
| hurel | Хүрэл, 50s, exact age unstated | Fuller cook, shirt and apron, age creases |
| tsetsegmaa | Цэцэгмаа, 30 | Adult face, tied-back hair, muted party outfit, mild skin texture |
| dulmaa | Дулмаа, 65 | Aged anatomy and skin, grey bun, practical deel and boots |
| sukhee | Сүхээ, exact age unstated | Fuller neighbour, striped shirt, individual jaw/nose |
| altan | Алтан, 3 | Toddler geometry, modest birthday outfit, paper crown |
| yard-guard | Харуул, 50s, exact age unstated | Tired guard, practical jacket and wool cap |
| yard-runner | Unnamed opening infected | Lean adult runner; no invented speaking identity |
| party-young-man | Anonymous young-adult guest | Different facial proportions, restrained acne |
| party-young-woman | Anonymous young-adult guest | Different head outline, restrained acne |
| party-older-man | Anonymous older guest | Aged face, grey hair, ordinary suit |

The three guest designs can be reused for background casting; they do not claim
that the forty party guests are thirteen people. The radio and off-screen crying
baby have no new visible actor. That baby is not Naran, who is born in Episode 2.

## Open the cast

With the local preview server running, open:

`http://127.0.0.1:5180/artifacts/episode-1-cast/`

If it is stopped, run `artifacts/episode-1-cast/launch.sh` from the repository
root, or run that script by its absolute path. Keep the terminal running. Use
HTTP rather than opening index.html as a local file. The existing server on 5180
can serve both this cast and the reusable master.

The portrait board and selector open one GLB at a time. Inspect body, face/neck,
hands, wireframe and the short deformation test. The story appearance selector
previews Ganaa's healthy / HOUR 5 / turning states and Dasha's unwell / fed state.
These are **fever-color and bandage-visibility references**, not finished
infection makeup, a crawling red-line simulation, or story animation.

## Agent editing

Each `dna/<id>.json` is authoritative. `recipes/<id>.json` is compiled output:

- `face` and `asymmetry` set identity. `age.years` and `age.features` add age;
  `script_age` retains the canonical exact age, or null when unstated.
- `body` controls size and silhouette. `skin`, `hair`, `brows`, `eyes` and
  `facial_hair` control appearance independently. `skin.pimples` uses an ID seed;
  `skin.look` values `weathered`, `tired`, `elder` add soft age creases for adults.
- `clothing` selects fitted assets, costume adapters and colors. `signature_traits`
  describes 2–3 visible identifying features. Keep `review` at draft until approved.

From the repository root:

```sh
blender -b --factory-startup --python-exit-code 1 -t 8 \
  --python artifacts/episode-1-cast/scripts/build_actor.py -- ganaa
```

This rebuilds **that actor's generated folder**, replacing manual edits there.
Keep manual sculpt/paint revisions in a sibling file or change the DNA and
builder. The original `assets/cast/`, film rigs, old LISA study and existing master
presets are preserved. Native files and GLBs are stored in `<id>/`:
`Character-Master.blend`, `character.glb`, `report.json`, `dna.json`, `episode-recipe.json`,
`full.png`, and `face.png`.

All actors use the shared 137-bone rig with 30 finger bones. The hidden AUTHORING
collection retains the full editable body and active shape targets. The visible
collection keeps skin, hands, clothes, hair, eyes and role-specific pieces separate.
Covered skin is removed only from the export copy to prevent clothing penetration;
regenerate from the complete source after replacing a garment.

Facial blemishes and soft age creases are separate head-skinned detail meshes.
They can be deleted, moved, recolored or replaced in Blender. The age-specific
skin atlases retain their original UV alignment. Hair and fabric recoloring is
baked into fresh packed diffuse maps for consistent portable GLB rendering.
The saved native file embeds the DNA, compiled recipe and guide. Edit DNA and
rebuild; changes made only to compiled recipes are replaced on the next build.

The face revision gives every actor a face design note and individual eyelid,
inner-fold, cheek, jaw, nose and mouth targets. Mongolian roles have stronger
individual East Asian features; Irina and Dasha retain their previous casting
at the user's request. These are artistic designs, not ethnic measurements.
Smooth fitted high-poly eyes replace the coarse eyeballs, with less saturated
irises and a separate moist surface finish. Stock long lash cards are removed
from the visible/export copy because they produced dark spikes around the lids;
the original source lashes remain in AUTHORING. The eye dependency and hashes
are recorded in `assets/sources/makehuman-core/episode-1-eye-manifest.json`.

`Story.ForearmBandage` has a `states` custom property. Its render visibility is
set for the first recipe state in Blender; the inspector handles state visibility
in Three.js. Set it explicitly when staging native story shots. Other fever
colors in the inspector are preview material multipliers, not saved alternate
native skin maps. Native animators should author shot makeup as a separate pass.

## Checks

```sh
python3 artifacts/episode-1-cast/scripts/test_recipes.py
CHROMIUM_EXECUTABLE_PATH=/opt/brave.com/brave/brave \
  node artifacts/episode-1-cast/scripts/check_browser.mjs
blender -b --factory-startup --python-exit-code 1 -t 8 \
  --python artifacts/episode-1-cast/scripts/check_native.py
```

The native and browser reports record actual exported geometry, textures, rig,
weights, wrist boundary shading, toddler proportions, required props and states.
Visual inspection includes face/body renders and a portrait comparison board.

## Provenance and limits

Graphical bases, age-specific skin maps, fitted source clothes, hair and rigs are
CC0 MakeHuman assets; MPFB code is GPL-3.0-or-later. Dependency licenses, hashes
and the additional selected-file manifest remain in `assets/sources/`.
Reference photographs informed the designs and were not copied onto the meshes.
The attempted built-in image generation was rejected; no generated skin image
from that attempt is included. No paid Tripo job was used.

These are original fictional cast designs, not scans, ethnic averages or exact
Silent Hill 2 characters. Period evidence informs individual casting choices;
wrinkles/acne are human age and skin details, not ethnicity indicators. Exact
unstated ages, facial likenesses, guard ancestry and anonymous guests remain
explicit design choices. Adult source skin atlases underlie the technical base;
Altan has no added adult creases, stubble, makeup or acne, but a dedicated
child-specific skin-paint pass can improve the toddler further.

Garments/role pieces have an editable first fitting. Simple skirts and apron use
basic rig attachment and need shot-specific deformation work for large steps,
running, sitting and contact. Hair uses a modest polygon budget and can need
silhouette refinement in close shots. There is no finished dialogue animation,
phonetic lip sync, cloth simulation, complete prop kit, crowd performance budget
or PS2 LOD pass. Existing episode animation does not automatically load this
new development cast; integration follows character design review.
