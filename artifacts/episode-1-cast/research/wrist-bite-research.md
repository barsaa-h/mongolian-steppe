# Ganaa wrist bite — exploratory makeup

The Episode 1 dialogue says Ganaa's sleeve rides up, revealing a clean bite on his wrist and a thin red line beginning to crawl before HOUR 5. He then wraps it in a rag; at HOUR 5 the line has reached his elbow. It does not identify a side. The right wrist and the placement, size and pattern in this probe are provisional artistic choices, not established script facts.

This is a separate experiment using the exposed-skin and finger-contact probes. It removes the earlier placeholder wrap and projects skinned bite marks and a line onto the skin. It does not replace the approved identity, the shared generator, or any film asset. The marks are currently schematic dots and a uniform line; the cuff remains visibly cut, and the camera obscures the hand. The line-growth test described below is provisional. It is not an approved shot or finished makeup.

In the 1280×720 film camera, the marks and line are visible in [this frame](wrist-bite-probe.png). A native proximity check measured a maximum mark-to-skin vertex distance below 1 mm and no surface intersections in neutral, an independently posed elbow bend, and an independently posed forearm twist. This samples three poses and cannot establish continuous motion quality or rule out all forms of intersection. The recreated native file retained the 137-bone rig and 19,158-vertex source body. Its exported body, eyebrows, teeth and tongue retained the seven expression morph names and the three technical clips. A browser check confirmed the separate makeup mesh hides in `healthy`, shows in `hour-five`, and hides on resetting to `healthy`; the separate growth test below uses a newer version with distinct bite and line meshes.

Reproduce into new or empty folders:

```sh
blender -b artifacts/episode-1-cast/ganaa/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/grip_pose_probe.py -- /tmp/ganaa-grip-research --individual-fingers
blender -b /tmp/ganaa-grip-research/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/rolled_sleeve_probe.py -- /tmp/ganaa-exposed-research
blender -b /tmp/ganaa-exposed-research/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/wrist_bite_probe.py -- /tmp/ganaa-bite-research
blender -b /tmp/ganaa-bite-research/Character-Master.blend --python-exit-code 1 -t 4 --python artifacts/episode-1-cast/research/check_bite_fit.py
```

## Provisional line growth

The current research builder exports the bite and line as separate skinned meshes. The candidate HOUR 5 film path now starts with the tagged line fully revealed, consistent with the dialogue placing it at the elbow before this scene. A separate manual test reveals it in 30 steps to explore the earlier bite beat. The study line is still too short to reach the elbow and lacks the rag; it does not satisfy HOUR 5 continuity. The character loader clones and owns the line geometry before changing its draw range so another instance cannot share that change. It tests the exported triangle order, clamps the reveal outside the interval, and checks that seeking forward, backward and back to the same time returns the same draw count. The [24 fps preview](wrist-line-growth-probe.mp4) holds the camera and pose at 2.3 seconds to isolate the effect; it is not an animated performance or a film export.

With the development server running, reproduce the actual browser experiment against the GLB generated above:

```sh
node artifacts/episode-1-cast/research/check_line_growth.mjs /tmp/ganaa-bite-research/character.glb /tmp/ganaa-growth /tmp/ganaa-growth-frames
ffmpeg -framerate 24 -i /tmp/ganaa-growth-frames/%03d.png -c:v libx264 -pix_fmt yuv420p /tmp/ganaa-growth.mp4
```

The candidate player sets the tagged line to its fully revealed state at the start of HOUR 5; it does not animate the earlier bite reveal. The checked browser run explicitly substitutes the separate draft study into the candidate request; the normal candidate and legacy film assets have not been replaced. Thirty discrete segments create visible stepping, the appearance is schematic, and the head and body performance is held. The state switch, three-pose proximity test, and out-of-order seek test are technical evidence, not creative approval or continuous collision coverage. Next: refine the bite and cuff using editable shared sources, refine the reveal once timing and side are agreed, and evaluate the whole animated arm in native and runtime views before publishing.

## Saved draft study

The separate, reproducible study is stored at `artifacts/episode-1-cast/ganaa-wrist-study/`. It is not an approved or published film asset. Its saved `.blend` SHA-256 is `79e0fc263de9a61e3a3f035b32a5f45c5062c1f3c039ebd0e1db78113751551f` and its GLB SHA-256 is `e5fb2e526e4b0e5d405b95ce645a3000573fcad714fb4fa380a58e78ec208280`. The native study check reopened the source and confirmed the 137-bone rig and full 19,158-vertex authoring body. The candidate browser test uses a route substitution to check this GLB without replacing the normal candidate.

The film camera footage and old growth reel were rendered as visual experiments. They show an exposed bite and a growing short line during HOUR 5, which conflicts with the dialogue and must not be used as final continuity. The line length, rag, earlier reveal and exact approved edit remain open.
