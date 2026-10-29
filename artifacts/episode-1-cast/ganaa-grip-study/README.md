# Ganaa wheel-grip study — draft

This editable source and GLB are a held blocking study derived from the approved Ganaa source, not an approved performance or film release. The original candidate and prior driving block remain unchanged. `Driving_Block` contains a one-second held pose. The palm target is an internal metacarpal-based proxy, and the orientation and finger bends are artistic blocking choices, not established physical contacts.

[HOUR 5 view](shot-8.png) and [right-wrist insert](shot-right-2.3.png) show the result in the actual film stage. The hand is closer to the rim, but the wrist/sleeve gap is conspicuous, the bandage is hidden, and individual fingers do not yet convincingly wrap the rim. Foot placement, garment deformation, motion and slap remain unverified. This is not the final driving pose.

The [wheel measurement](wheel-clearance.json) samples actual skinned hand vertices in Blender against the ideal circular tube used by the film. At the held frame, neither hand has sampled vertices more than 1 mm inside the tube; the nearest vertex is about 0.21 mm from its surface. Finger bone tips are approximately 3–22 mm from the surface. **A vertex test cannot detect every triangle intersection, prove skin-to-wheel palm contact, or establish a believable grip.** The film wheel has only 16 radial segments, so rendered geometry can differ from this ideal torus.

Reproduce into a new or empty directory:

```sh
blender -b artifacts/episode-1-cast/ganaa/Character-Master.blend --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/scripts/block_ganaa_grip.py -- /tmp/ganaa-grip-study-new

blender -b artifacts/episode-1-cast/ganaa-grip-study/Character-Master.blend --python-exit-code 1 \
  --python artifacts/episode-1-cast/scripts/check_driver_wheel.py
```

`tests/ganaa-grip-study.test.mjs` repeats the sampled clearance calculation against the actual exported GLB. The legacy HOUR 5 actor remains the default; no identity or shot approval was changed.

The current mask removes most forearm skin under the jacket, so rolling the sleeve in a shot needs a regenerated exposed-skin variant. `inspect_forearm_coverage.py` reports approximate rest-pose forearm coverage; it does not measure sleeve fit or prove an exposed variant.
