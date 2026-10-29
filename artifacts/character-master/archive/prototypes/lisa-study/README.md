# Night Shift — LISA-derived character study

The editable result is [Night-Shift.blend](Night-Shift.blend), with a skinned,
embedded-texture [night-shift.glb](night-shift.glb). The Three.js comparison
viewer is at `http://127.0.0.1:5180/artifacts/lisa-study/` while the local server
is running. From the repository root, `python3 -m http.server 5180 --bind
127.0.0.1` starts it again. The same directory also works on the existing
project's development server. No dependency or main application changes are
required.

This is a local, non-commercial derivative art study. It is based directly on
the supplied LISA model, not a newly authored original character and not a
pixel-exact Silent Hill 2 reproduction. Team Silent / Konami created the
underlying game character. The museum explicitly restricts commercial reuse of
its game assets. Its MIT source-code license and Murugo's MIT tool license do
not license the game artwork.

## What the supplied sources contain

| Source | Verified contents | Practical use |
| --- | --- | --- |
| `Misc-Game-Research-SHPS2-Blender2.9-20220215.zip` | Research source, MDL/ANM/DDS/PACK importers, PS2 memory/texture decoding utilities; no character model library | Understand original transforms, UVs, skin weights, transparency and morph data |
| Same name, `.tar.gz` | Same 39 regular-file payloads as the ZIP; archive structure also includes shared-code links | Alternate packaging, not another character pack |
| `SHPS2-Blender2.9-20220215.zip` | Packaged `io_sh2_sh3` add-on, Windows `.pyd`/DLLs and Python 3.9 runtime components | Old Windows/Blender import path; cannot be installed unchanged into this Linux/Blender 5.2 environment |
| `LISA.gltf` | 866 exported vertices, 816 triangles, one 21-joint skin, 18 clips all named `LS.ANM`, one embedded 1024×384 PNG | Immediately usable skinned reference; original copied byte-for-byte |
| [Silent Hill Museum](https://silenthillmuseum.org/) | Three.js renderer for original SH1/SH2/SH3 files, documented import/export behavior and material advice | Primary rendering/reference source |

The supplied glTF names its mesh `sh1model`; its geometry, LISA animation data
and palette atlas match the museum's SH1 path. It is an SH1 baseline, not an
original SH2-quality facial mesh. The archive date is preserved in the source
filenames; its README still describes an older Blender API and unsupported SH2
`.CLS` facial animation. No old add-on or binary was installed or executed.
File sizes and hashes are recorded in [source-manifest.json](source-manifest.json).

## What the research changed

The atlas contains four columns and three rows of 256×128 palette tiles. Many
UV islands recur with different palettes: one appearance is skin, another is
red fabric, another is ivory. Painting the same clothing design into every
tile produces a shirt on the neck and cardigan panels on the skirt. An initial
draft exposed that failure and was rejected after rendering it on the mesh.

The selected texture uses a faithful atlas repaint followed by a limited color
pass: dark brown hair, petrol teal cardigan with ivory lapels, warm ivory uniform
and charcoal shoes. The cap's UVs sample ivory cloth because its source palette
shapes overlap the shoes. Face landmarks and the rest of the original UV layout are retained as closely as
the generative repaint allows. The final atlas is 2048×768; each repeated tile
is 512×256. That is not a dedicated 2K face map.

The new mesh welds split source vertices while preserving per-corner UVs, then
uses one Catmull–Clark pass to soften the facial contour, cap, hair and clothing.
The result has **4,896 triangles**. Interpolated weights are normalized. This
adds contour resolution but does not replace the face with authored eye/mouth
loops. Merely increasing triangle count is not equivalent to creating SH2
facial anatomy.

The original 21 joints and all 18 animation clips are retained. Exported names
are `LISA_source_01` through `LISA_source_18`; their semantic actions are not
invented. The viewer synchronizes clip time and uses matching camera and light
for both models. It restores the original skeleton to its bind pose before normalizing
scale; the study already opens in its bind pose; the supplied glTF's default crossed-arm pose is different from that bind
pose. The low-resolution toggle changes render resolution only; it does not
emulate PS2 hardware.

Materials use painted diffuse color, full roughness, very low specularity,
linear sampling for the study and the source's nearest sampling for comparison.
No normal map, metallic response, subdivision at runtime, skin subsurface
scattering or texture-based skin pores are added. Blender presentation uses
neutral soft lighting and the Standard view transform.

## Rebuild and check

```sh
blender -b -t 8 --python artifacts/lisa-study/scripts/build_study.py
python3 -m http.server 5180 --bind 127.0.0.1
# In another terminal, with Playwright available:
node artifacts/lisa-study/scripts/check_viewer.mjs
```

The builder imports the preserved glTF into an independent background Blender
process. It never opens or overwrites the existing green-jacket project or the
main cast. It writes packed Blender/GLB assets, four rendered views, and
`build-report.json`. It checks source clip/joint counts, exported triangle count
and normalized weights. The viewer check loads the actual GLB in Chromium,
checks all 18 clips, samples both models' skinned vertices at four times per
clip (144 deformation samples), and exercises comparison, playback, time
scrubbing, lighting, low resolution, and mobile layout. Results and screenshots
are saved beside the study.

The selected texture was made with the **built-in ImageGen tool**, not the
CLI/API fallback. Exact prompts, including the rejected draft, are in
[texture-prompts.json](texture-prompts.json). The selected files live in
`Textures/`; the Blender file packs the final map and the GLB embeds it.

## Artistic and production limits

This is visibly more detailed than the supplied low-poly reference, but is still
a derivative refinement. Facial texture alignment is approximate; the cheek,
neck and hair seams remain visible at close range. There is no new facial
rig, oral cavity, animated eyelids, independent fingers, dialogue lip sync,
cloth collision or polished animation library. The source clips still carry
their original timing and motion. The native hand/skirt topology remains
simplified. Production use would need an independently authored identity and
asset rights, deliberate eye/mouth topology and shot-specific deformation work.

Further primary references inspected:

- [Murugo's source](https://github.com/Murugo/Misc-Game-Research): `import_mdl.py`
  describes bone matrices, helper weights, normal transforms, UV conversion,
  palette texture decoding and morph records. The archived importer uses a
  zero-specular material and has older shader socket names.
- [Museum source](https://github.com/dreamingmoths/silent-hill-museum): SH2 model
  code sets linear texture filters; its fragment shader reads the indexed
  palette, applies alpha testing and uses simple diffuse lighting. Its SH1
  animation table includes LISA. These are rendering references, not a method
  for automatically generating a new artist-quality face.

No claim of exact SH2 pixel matching, finished facial acting, commercial asset
permission, or validation on physical PS2 hardware is made.
