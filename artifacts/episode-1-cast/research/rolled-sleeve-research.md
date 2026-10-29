# Rolled sleeve and exposed skin — research, not a film asset

The current outfit masks the forearm under its sleeve. A disposable probe restores a region of skin from the full authoring body, removes part of the right sleeve, and fits the existing wrap to the skin with interpolated deform weights. Its placement and proportions are exploratory art choices; the script does not establish the bite side. It produces a separate source and GLB, and leaves the approved source untouched.

The [shot image](rolled-sleeve-probe.png) fails visual review: the cuff is crude, the wrist silhouette bulges, and the wrap is not readable. The result has not been integrated into the shared generator or registered as a reusable MHCLO outfit. It is not approved for use in the film.

In the held driving pose, nearest distances from the fitted wrap vertices to the skin were approximately 0.5–2.0 mm. This is a one-direction, vertex-to-surface measurement, not proof against intersections or floating throughout motion. Native reopening retained the full 19,158-vertex source body and 137-bone rig; the GLB retained the seven body expression targets and `Talk_Check`. The neutral face, profile and smile QA renders matched the existing grip study pixel-for-pixel, and neutral recovery passed. The earlier first probe lost the body morph targets; the research script now transfers their deltas by source-vertex ID and refuses to proceed if existing IDs disappear. These checks do not approve the cuff, wrap, face in motion, or garment deformation.

To reproduce in a new or empty folder:

```sh
blender -b artifacts/episode-1-cast/ganaa-grip-study/Character-Master.blend --python-exit-code 1 -t 6 \
  --python artifacts/episode-1-cast/research/rolled_sleeve_probe.py -- /tmp/ganaa-rolled-probe-new
```

The [measurement and file hashes](rolled-sleeve-probe-report.json) describe the examined run, not future rebuilds. Next work must use the shared builder and editable garment sources, construct a plausible cuff, restore the skin mask as part of the variant, and validate animation, facial shapes, body coverage and the actual shot framing before proposing a replacement.
