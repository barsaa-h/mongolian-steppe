# Character master for agents

For new cast work, use the [character DNA workflow](DNA.md): semantic face/body
controls, separate age and expression layers, constrained drafting and face QA.
The episode cast now reads `../episode-1-cast/dna/`; its recipes are generated.
The presets below remain the low-level master interface.

This is the reusable character source. Edit a JSON recipe and rebuild; the viewer
is only for inspection. Start with `presets/default.json`. The earlier LISA study
remains in `../lisa-study/`; this master uses independent MakeHuman assets.

## Build

From the repository root, with Blender on PATH:

```sh
blender -b --factory-startup --python-exit-code 1 -t 8 \
  --python artifacts/character-master/scripts/build_character.py -- \
  artifacts/character-master/presets/default.json \
  artifacts/character-master/my-character
```

Copy the recipe before editing. Use a new output directory. The generator only
reuses a nonempty directory containing its `.character-master-output` marker.
Rebuilding replaces the generated files there, including manual Blender edits.
Add `--no-render` after the output directory to skip the two studio PNGs.
The pinned MPFB code is loaded for that background process; no global add-on
installation is needed. Opening the resulting Blender file needs no MPFB add-on.

Outputs: `Character-Master.blend`, `character.glb`, the resolved `character.json`,
a QA-facing `dna.json`, `report.json`, and (unless skipped) `full.png` and
`face.png`. Textures are packed. The GLB loads with Three.js `GLTFLoader` and
includes the `Deformation_Check` clip, the `Talk_Check` viseme/blink clip, the
seven additive `EXP.*` expression morphs and the named `FACE.*` control morphs
for every preset.

## Recipe fields

All `body` values are finite numbers from 0 to 1. Keep every field in the example.

| Field | Meaning |
| --- | --- |
| `name` | Plain name, up to 64 letters, digits, spaces, hyphens or underscores |
| `height_m` | Final body height in meters, 0.65–2.30; distinct from proportion targets |
| `body.gender` | Upstream female-to-male anatomy blend, 0–1 |
| `body.age` | Sculpted age progression; child anchor 0.1875, young adult 0.5, old 1; not years |
| `body.weight` | Low-to-high body weight |
| `body.muscle` | Low-to-high muscularity |
| `body.proportions` | Upstream proportion blend; neutral 0.5 |
| `body.height` | Short-to-tall body proportions before final meter scaling; neutral 0.5 |
| `body.race` | Upstream `asian`, `african`, `caucasian` target families; weights must sum to 1 |
| `skin`, `hair`, `outfit`, `shoes` | Local asset identifiers from `asset-inventory.json` |
| `targets` | Optional additional shape targets, mapping inventory paths to weights 0–1 |
| `tints` | Optional `hair`, `outfit`, `shoes` colors as `#rrggbb`, multiplied with diffuse maps |
| `face` | Optional named face controls from `dna/controls.json`, signed -1..1 (0..1 for one-way head shapes); compiled additively into the targets |
| `asymmetry` | Optional right-side offsets for paired face controls, -0.25..0.25; each needs its base control in `face` |
| `age` | Optional additive age features `head_age`, `eye_bags_left`, `eye_bags_right`, `sagging`, `lip_thinning`, `brow_droop`, 0..1 |
| `eyes`, `brows`, `skin_detail`, `facial_hair`, `hair_dna` | Optional appearance overrides merged over the generator defaults; allowed keys and ranges follow the [DNA workflow](DNA.md) (`dna.py validate_recipe_extras`) |

All override fields are optional; leaving them out keeps the previous look. The
five shipped presets are distinct identities built only from these fields —
compare `presets/*.json`.

For example, replace `targets: {}` with:

```json
"targets": { "nose/nose-volume-incr": 0.35 }
```

`target-inventory.json` lists 808 detailed targets for face, neck, hands, limbs
and body. Use the exact identifier, without `.target.gz`. These targets are
additive: opposed targets or extreme combinations can produce poor anatomy.
Skin is chosen separately from anatomy; it does not automatically switch with
age or gender. The supplied skin textures are adult source textures, including
on the clothed child example. A finished child asset needs age-specific texture
art as well as the supplied child geometry.

Five recipes demonstrate default female anatomy, male, heavier male, slim/tall,
and child proportions — each with its own face vector, age features, eyes, brows
and skin layers, so no two examples share an identity. The child uses age
targets, a fitted rig and refitted clothes, rather than shrinking an adult
model. This is a useful editable base; it is not a complete wardrobe or an
assertion that every target combination fits. Known limits: the supplied skin
textures are adult source atlases even on the child example, the eyebrow
source textures are pencil-thin strokes, and stubble uses a procedural beard
region without a dedicated painted mask.

## Blender edit points

- **AUTHORING | Complete body and fitted source assets** is hidden. It retains
  the full 19,158-vertex body, editable active shape keys, original fitted outfit,
  accessories and source rig. Keep its body vertex order if using upstream
  targets. The external target inventory is loaded by the generator; all 808
  targets are not preloaded into every saved file.
- **CHARACTER | Modular meshes** is the visible export: `Body.Skin`, `Hands.L`,
  `Hands.R`, `Clothes.Top`, `Clothes.Bottom`, `Shoes`, `Hair`, `Eyes`, `Eyebrows`,
  `Eyelashes`, `Teeth`, `Tongue`, and `Character.Rig`.
- Neck and head come from the same anatomical surface. Hands preserve their
  wrist positions and skin weights; each hand has five articulated fingers.
  There are 137 bones, including 30 finger bones. Visible meshes use at most
  four normalized bone influences per vertex.
- Clothes have their own surfaces and materials, with fabric edge thickness.
  This core outfit originally joins shirt and trousers: the generator separates
  them at the fitted waist. They are separate objects, not independently authored
  universal garment patterns.
- Covered body faces are removed **only from the render copy** using the source
  outfit masks. This prevents skin protruding through the shirt. Deleting clothes
  from the GLB will reveal missing covered skin. Change clothes/proportions in the
  recipe and regenerate from the complete native source.
- `Deformation_Check` is a short elbow, knee and finger bend test. It is not a
  finished walk, an IK control rig or a hand-posed fist. Use the rest pose for edits.
- The native file embeds its recipe and this guide in Text Editor datablocks.

Manual sculpting, UV painting and garment replacement can be done in Blender.
Recipe regeneration does not preserve manual edits. For a new garment, first
fit/skin it to the complete source body and supply appropriate coverage masks;
add it to the local core asset tree using the standard MHCLO format. Included
assets, not arbitrary third-party garments, are the tested fitting scope.

## Inspection and checks

Start the local preview from any directory:

```sh
/home/barsaa/mongolian-steppe/artifacts/character-master/launch.sh
```

Keep that terminal running, then open
`http://127.0.0.1:5180/artifacts/character-master/`. If the server is stopped,
the preview cannot load. This command serves the repository on localhost only.
The inspector
provides five generated examples, neck/face and hand views, a bend test and a
wireframe view. Every example exposes DNA sliders seeded from its own recipe;
face sliders add to the baked identity from the recipe value. Eye, brow and
skin texture changes download as DNA and are applied by rebuilding.

Each character folder's `qa/` holds the matching-material bald head turnaround
and expression sheet. Rebuild the full set with:

```sh
python3 artifacts/character-master/scripts/qa_all.py
```

It renders front/three-quarter/profile and expression views per character,
assembles `qa/lineup.png` plus a grayscale counterpart, and fails when two
default characters' face controls are too close (`qa/distance-report.json`).

```sh
python3 artifacts/character-master/scripts/test_config.py
node --check artifacts/character-master/viewer.js
CHROMIUM_EXECUTABLE_PATH=/opt/brave.com/brave/brave \
  node artifacts/character-master/scripts/check_browser.mjs
```

The browser check requires Playwright (the bundled Codex runtime is supported)
and the repository server at `http://127.0.0.1:5180`. It checks the actual GLBs,
weights, moving skinned vertices, separate meshes, proportion differences,
expression morphs and the talk clip on every example.
`browser-report.json` and `native-report.json` record verification results.

## Sources and limits

Pinned source: [MPFB 2.0.18](https://github.com/makehumancommunity/mpfb2/tree/v2.0.18)
in `assets/sources/mpfb2-2.0.18/`. The Python add-on is GPL-3.0-or-later; the
MakeHuman graphical assets are CC0. Upstream licenses remain alongside the
source. Selected [official core assets](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html)
are in `assets/sources/makehuman-core/` with source URL, archive range metadata
and per-file hashes. See the [upstream license explanation](https://www.makehumancommunity.org/about/license.html).
No LISA game mesh or game texture is included in this master.

The default currently has roughly 47,000 triangles before garment edge modifiers
and uses diffuse textures up to 2K. This prioritizes editable anatomy and close
inspection; it is not a PS2-budget character or a pixel-perfect Silent Hill 2
reconstruction. Lighting, texture painting, hairstyle, costume design and later
LOD baking determine the final art direction. Extreme shapes and new garments
still require visual fit checks. The supplied examples do not prove every blend.
