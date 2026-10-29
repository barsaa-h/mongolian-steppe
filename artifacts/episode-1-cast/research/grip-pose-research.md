# Ganaa driving grip pose probe

Draft technical research; this is not an approved shot or performance. The pose is an artistic choice and does not change Ganaa's identity or the film's selected character.

The earlier grip study bends each wrist approximately 101.17° relative to its forearm. A search over arm and hand poses found the reproducible probe below, with a 46.21° direction difference on each side. At the held frame, the nearest sampled hand vertex is approximately 0.05 mm from the analytic wheel surface; no sampled hand vertex is more than 1 mm inside it. The farthest finger bone tip is about 25 mm from the surface. This is a vertex sample against an idealized wheel, not a triangle intersection or a contact test.

The shot close-up shows that the fingers still sit behind the rim instead of visibly wrapping around it. The cuff and wrist bandage are also unresolved. The held pose is blocking only: it contains no steering, body performance or shot animation. Do not promote it to the film as a finished grip.

Reproduce in a new or empty directory:

```sh
blender -b artifacts/episode-1-cast/ganaa/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/grip_pose_probe.py -- /tmp/ganaa-grip-pose-repro
blender -b /tmp/ganaa-grip-pose-repro/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/scripts/check_driver_study.py
blender -b /tmp/ganaa-grip-pose-repro/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/scripts/check_driver_wheel.py
```

The native study check reports 137 bones and the full 19,158-vertex authoring body. The images alongside this note show the exploratory pose in the current shot camera. The next step is to solve and inspect actual finger-to-rim contact and repair the cuff and bandage before animating the hands.

## Individual-finger contact experiment

The optional `--individual-fingers` variant sets individual joint angles and adjusts the little-finger palm joint. Its measured held pose places sampled vertices from each of the ten digits within 1 mm of the film's faceted rim. No hand/wheel surface triangle intersections were reported at that frame. These are proximity and surface-intersection measurements, not proof of pressure, convincing contact, containment, or collision-free movement. The selected close-up still hides most of the fingers behind the rim, so a convincing grip has not been established visually. The cuff and bandage remain unresolved.

The diagnostic reconstructs the film's 16-by-5 torus surface from `cab.json` and `src/winter.js`; update the diagnostic if the wheel's mesh resolution or tube radius changes. Finger samples are vertices with more than 0.5 weight on that finger's joints. The intersection check uses evaluated hand and wheel surfaces and includes a synthetic crossing sanity check.

```sh
blender -b artifacts/episode-1-cast/ganaa/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/grip_pose_probe.py -- /tmp/ganaa-individual-fingers-v3 --individual-fingers
blender -b /tmp/ganaa-individual-fingers-v3/Character-Master.blend --python-exit-code 1 -t 3 --python artifacts/episode-1-cast/research/check_finger_contact.py
```

The new option is research-only and does not alter the film candidate or default study. A new empty output directory is required.
