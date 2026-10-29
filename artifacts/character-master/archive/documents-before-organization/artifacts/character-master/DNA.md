# Character DNA workflow

Use `artifacts/episode-1-cast/dna/<id>.json` as the editable source of truth
for the 13 episode cast actors. The five master presets in
`artifacts/character-master/presets/` carry the same identity system at recipe
level: optional `face`, `asymmetry`, `age`, `eyes`, `brows`, `skin_detail`,
`facial_hair` and `hair_dna` fields compile through the same
`scripts/dna.py` controls. The episode recipes, Blender scenes, GLBs and
previews are generated outputs. Changing a face means changing its DNA and
regenerating, rather than sculpting one output or swapping its hairstyle.
Ganaa’s episode DNA has human design approval; the other 12 episode identities
and the five master presets remain drafts for human creative review.

## Adopted foundation

Keep the pinned MPFB 2.0.18 / MakeHuman core mesh, fitted assets and 137-bone rig.
The full authoring body retains 19,158 vertices. All generated actors share the
same topology convention, skin UVs and animation bone names; each export has its
own fitted geometry. A DNA build automates regeneration, not manual modelling.
The [official license](https://www.makehumancommunity.org/about/license.html)
separates GPL code from CC0 graphical core assets. Third-party additions need
their own license check. No paid generation service is needed for this system.

The child, adult and elder files in `dna/bases/` are starting configurations on
the shared topology. The child uses pediatric macro shapes and larger head/body
proportions, not an adult uniformly scaled down. Elder anatomy is an adult age
morph. Age years map to the upstream 1–25 / 25–90 progression; changing age leaves
the face identity vector intact. The lower-level legacy presets remain usable.

## DNA fields

| Field | What the agent edits |
| --- | --- |
| `face` | All 60 named controls in `dna/controls.json`; signed -1..1, or 0..1 for one-way head shapes |
| `asymmetry` | Right-side offsets for paired face controls; -0.25..0.25; combined value stays -1..1 |
| `age` | Artistic age in years and separate head age, bags, sagging, lip thinning and brow droop |
| `script_age` | Canonical exact screenplay age, or null when unstated; do not invent a canon age |
| `base` | child 2–8, adult 9–59, elder 60–90 |
| `sex` | male/female macro baseline; other individual appearance comes from the full parameters |
| `body` | Height in metres, weight, muscle, proportions, shoulders, chest, belly, hips, limb thickness, posture |
| `skin` | CC0 source atlas, tone, undertone, ruddiness, freckles, pores, oiliness, age lines, pimple count and weathering. Missing new fields keep the previous look. |
| `hair` | Fitted asset/style, color, greying, length and volume |
| `brows` | Style, head and tail thickness, arch, tail length, density and asymmetry, plus color and greying. Face controls still supply angle, height and depth. |
| `eyes` | Iris color, iris scale, pupil size, limbal ring, veins, catchlight, wetness, lash density and sclera tint. The fitted eye stays separate from the lids. |
| `facial_hair` | none or procedural stubble with coverage and greying |
| `clothing` | Fitted outfit/shoes and the shared costume adapter, plus fabric colors |
| `signature_traits` | Two or three visible identifying features, verified in the render |
| `source` | Script facts and reference pointers; distinguish canon from artistic choices |
| `states` | Story appearance states; generated background drafts start at normal |
| `review` | draft; approved only after explicit human acceptance |

`dna/library.json` lists the available fitted clothing, eye, brow and accessory
choices. It has 15 hair style recipes made from nine source meshes; cropped/bun
variants apply actual length/volume/cut geometry changes. They are not 15 separate
source hairstyles. The current accessory set is the episode cap, crown and scarf;
new shot props still require their own assets.

`dna/palettes.json` supplies overlapping fictional art-direction ranges and
upstream macro weights. Mongolian/Buryat-inspired/Slavic labels are casting
choices, not measured ethnic averages or a way to infer ancestry. Every draft
varies independent face controls. Irina and Dasha retain the user's earlier
casting decision.

## Generate, edit and build

From `/home/barsaa/mongolian-steppe`:

```sh
# Validate/compile an edited DNA file; recipes are build output.
python3 artifacts/character-master/scripts/dna.py compile \
  artifacts/episode-1-cast/dna/ganaa.json /tmp/ganaa-recipe.json

# Create a deterministic background draft; re-roll if too close to the cast.
python3 artifacts/character-master/scripts/dna.py draft \
  artifacts/episode-1-cast/dna/ganaa.json /tmp/guest-14.json \
  --id guest-14 --seed 14 --against artifacts/episode-1-cast/dna

# Build an existing actor from its authoritative DNA.
blender -b --factory-startup --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/scripts/build_actor.py -- ganaa

# Build a new draft into a separate owned output folder.
blender -b --factory-startup --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/scripts/build_actor.py -- guest-14 \
  --dna /tmp/guest-14.json --output /tmp/guest-14-output
```

The script-to-DNA step is agent work: read the script, extract a cast entry,
record known facts and unknowns, write a brief with 2–3 visible signature traits,
then fill the full DNA file. The draft CLI randomizes a validated template within
art ranges; it does not infer canon facts from prose or generate a likeness.
For an extra to join the cast gallery, add its DNA and matching cast entry.
`build_all.py <id>...` validates the full DNA collection and checks distances
before building selected actors. With no arguments it rebuilds the gallery cast.

The builder replaces generated files inside its destination. Keep manual edits
in a sibling file, or encode them in the shared system/DNA. Existing unrelated
folders are protected by the master output marker. Copying a DNA file alone does
not automatically accept the design or replace a film actor.

## Identity, age and performance

Identity and age are baked into each generated neutral export. The complete
source retains its editable identity/age target stack. Visible facial meshes
have seven additive `EXP.*` shape keys: smile, frown, blink and A/E/O/M mouth
shapes. Zero expression weights recover the neutral identity. Eyebrows, teeth,
tongue and skin detail meshes receive corresponding morphs. Eyeballs stay
separate and the lid surface blinks over them.

Native files and GLBs include `Deformation_Check` and `Talk_Check`. These are
technical test clips, not a finished walk, language-specific viseme library or
dialogue performance. The actor inspector exposes face tests and the talk/blink
clip. Agents using Three.js can call `window.__master.setExpression(name, weight)`
and `setPerformance(true|false)` in the local inspector. The GLB itself exposes
standard morph targets and animation clips for scene integration.

Skin color layers and micro-normal detail are baked once from the complete body
so separate hands and body use the same filled UV atlas. Native skin also uses
subtle subsurface scattering; the portable GLB uses PBR diffuse/normal/roughness,
so the web renderer does not reproduce Blender's skin scattering exactly.
Stubble and freckles are procedural material layers; pimples and the existing
soft age lines remain editable skinned detail meshes.

## QA and review

For the five master presets, `qa_all.py` renders the matching-material bald
lineup, turnarounds and expression sheets, and checks that no two default
characters share a face:

```sh
python3 artifacts/character-master/scripts/qa_all.py
```

For the episode cast:

```sh
python3 artifacts/character-master/scripts/test_dna.py
python3 artifacts/episode-1-cast/scripts/test_recipes.py
python3 artifacts/character-master/scripts/dna.py report \
  artifacts/episode-1-cast/dna artifacts/episode-1-cast/diversity-report.json
python3 artifacts/episode-1-cast/scripts/qa_all.py
blender -b --factory-startup --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/scripts/check_native.py
CHROMIUM_EXECUTABLE_PATH=/opt/brave.com/brave/brave \
  node artifacts/episode-1-cast/scripts/check_browser.mjs
```

The browser check uses the installed Brave on this workstation. Omit
`CHROMIUM_EXECUTABLE_PATH` to use Playwright's own installed Chromium instead.

`qa_all.py` renders every actor with the same neutral clay materials, no hair or
clothing in the head view, and the same view/framing rules. It assembles a lineup,
grayscale lineup, front/three-quarter/profile views and expression sheets in
`artifacts/episode-1-cast/qa/`. The native checks require actual morph movement,
finite geometry and exact neutral recovery; browser checks exercise the exported
morphs, talk clip, rig, textures, hand seams, state controls and download links.

The regional RMS distance report ignores age, ancestry, hair, clothing and skin
color. A near pair fails the build and names similar regions to change. Named
principal identities are never silently rerolled. Passing parameter distance
is not proof of a good likeness: inspect the clay lineup and profiles, then
review costume/skin renders and movement. Record remaining defects. Keep DNA
at draft until the human accepts the design; approval is not inferred from a
successful render, code check or parameter score.
