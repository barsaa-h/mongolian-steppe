# Modern PSX casual guy

Open `casual-guy.blend` and select the **PSX Casual Guy** scene (already active). The **CHARACTER | Casual Guy** collection holds the editable model; **STUDIO | Cameras and Lighting** holds the presentation setup. The pre-existing car remains in the original **Scene**.

- Height: approximately 1.81 m; 6,313 triangles.
- Casual olive overshirt, ecru tee, charcoal trousers, suede sneakers, and wristwatch.
- Modeled face, individual fingers, 128 × 128 face paint, and 64 × 64 pixel material textures. All textures are packed.
- Full-body, front, and face-detail cameras included.
- `casual-guy.glb` contains only the character and embedded textures, with nearest-neighbor sampling.
- `casual-guy-full.png` and `casual-guy-face.png` are the final presentation renders.

The editable `.blend` is the authoritative source. This is a modular static model; it has no armature, animation, expression shapes, or animation deformation topology. No game-engine integration was performed.

`verify_roundtrip.py` imports the GLB in a disposable Blender process, validates the meshes and textures, and renders it using the saved studio setup. Results are in `export-check.json` and `export-roundtrip.png`.
