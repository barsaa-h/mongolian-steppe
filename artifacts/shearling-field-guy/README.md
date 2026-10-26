# Shearling field-jacket character

The supplied art brief is implemented as an editable 3D character plus a three-view pixel turnaround.

- `field-guy.blend`: authoritative editable model and presentation scenes. All textures and the finished turnaround image are packed. The supplied prompt is saved in a Blender Text datablock.
- `field-guy.glb`: character only, with seven embedded textures and nearest-neighbor texture filtering.
- `field-guy-turnaround.png`: 1168 × 784 delivery sheet, front / left-facing profile / back, near-black #0e0e10 background.
- `field-guy-turnaround-native.png`: 292 × 196 pixel canvas before exact 4× nearest-neighbor enlargement.
- `sheet-inspection-hd.png`: unpixelated Blender render used for inspection and nearest pixel sampling.

The adult character is approximately 1.80 m tall and 6.68 heads tall, with 11,743 triangles across 13 editable mesh parts. The outfit has four bellows pockets, a center zipper, thick shearling collar and turned cuffs, a charcoal crew neck, taupe pressed trousers, and lace-up leather work boots with lug soles. The hands are relaxed and turned toward the thighs.

Open the **FIELD GUY | Model** scene to orbit and edit the single character. The **FIELD GUY | Pixel Turnaround** scene uses three linked instances of that same model, orthographic framing, and consistent soft lighting. The previous casual character and car scenes are preserved.

To refresh the sheet after editing, render the turnaround scene to `sheet-inspection-hd.png`, then run `python3 finish_sheet.py`. The finisher samples to 292 × 196, adds restrained color dithering, composites a solid background, and enlarges exactly 4× without smoothing. It asserts the dimensions, pixel replication, and aligned silhouettes.

`verify_asset.py` checks a fresh GLB import in background Blender. Results are in `export-check.json`.

This is a modular static character, with no armature, animations, expression shapes, or game-engine integration. Rigging and deformation cleanup are separate work.
