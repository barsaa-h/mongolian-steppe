# Ganaa rolled cuff — draft study

This study adds a folded edge to the exposed right sleeve of the shoulder-corrected cheek block. It is a provisional artistic choice: the script requires a sleeve to ride up but does not identify which wrist. It is not a finished costume, a shared MHCLO garment, or an approved film asset.

The research script finds the original 17-vertex cut edge in the retained pre-thickness jacket, verifies its correspondence with the baked jacket, and makes a separate four-ring cuff using the edge's existing deform weights and fabric material. This avoids manually editing generated output and leaves the complete body and existing rig intact. The cuff, skin and jacket remain separate meshes. The fold is still simple and its appearance, UV treatment, silhouette and behavior in other poses need review; the bite art, hand pose and shot acting remain unfinished.

At the sampled wrist and cheek poses, the greatest distance from a cuff attachment-row vertex to the jacket surface was 1.45 mm. No cuff-to-skin surface triangle intersections were found across 123 samples: the wrist insert at 2.3 seconds, the impact at 22.15, and 121 frames from 20–25 seconds. The test checks discrete native poses and one-way nearest-vertex distance; it does not prove continuous clearance, containment, absence of seams from every view, or behavior in other shots. The separate head-only contact test still reports no hand–face crossings in its samples.

The exported GLB retains normalized cuff skin weights, the shoulder corrective morph and its deterministic `Cheek_Block` animation. The native file reopens with the full 19,158-vertex authoring body, 137-bone rig and packed textures. The [wrist frame](cuff-wrist-shot.png) and [reach frame](cuff-reach-shot.png) use the film camera with this study substituted for the candidate. The [motion preview](cuff-motion-preview.mp4) is silent and contains the unfinished 21–24.5 second action, not a final film export.

To reproduce in a new or empty directory:

```sh
blender -b artifacts/episode-1-cast/ganaa-shoulder-study/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/cuff_probe.py -- /tmp/ganaa-cuff-study
blender -b /tmp/ganaa-cuff-study/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/check_cuff_motion.py
blender -b /tmp/ganaa-cuff-study/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/check_cheek_block.py
node --test tests/ganaa-cuff-study.test.mjs
```

The saved draft at `artifacts/episode-1-cast/ganaa-cuff-study/` has source SHA-256 `486ef425592a870a6db10bad6ed6d7d1446da0808e37966f8df61859b65e6812` and GLB SHA-256 `5703583ba063a46f5cb210572010d26d8704deb6bfd2c90ac3599493f1ed5005`. It does not replace the normal candidate. Before reuse, construct and validate an editable shared garment variant, test the other required poses and cameras, and obtain shot and design review.
