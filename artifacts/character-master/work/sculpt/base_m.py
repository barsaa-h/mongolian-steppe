"""Base M: shared corrections that make any Mongolian adult man read as a real person.

Built on a neutral man (all identity sliders at zero) and saved as sculpt/base-m.target. Tuned against
references/base-m and references/base-profiles. Run:
    blender -b --factory-startup --python base_m.py -- <neutral actor build dir>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import bpy
import sculpt
from mathutils import Vector

bpy.ops.wm.open_mainfile(filepath=str(Path(sys.argv[sys.argv.index('--') + 1]) / 'Character-Master.blend'))
body = sculpt.source_body()
sculpt.prepare(body)
L, R = sculpt.landmark('eye.L', body), sculpt.landmark('eye.R', body)
span = (L - R).length
mid = (L + R) / 2

# Profile depth: the stock Asian macro reads flat, with the mouth ahead of the nose.
for target, weight in [
    ('nose/nose-scale-depth-incr', .45), ('nose/nose-trans-forward', .2), ('nose/nose-scale-horiz-incr', .45),
    ('nose/nose-width1-incr', .35), ('nose/nose-width2-incr', .3), ('nose/nose-width3-incr', .25), ('nose/nose-flaring-incr', .2),
    ('mouth/mouth-trans-backward', .45), ('mouth/mouth-scale-depth-decr', .35),
    ('mouth/mouth-upperlip-volume-decr', .25), ('mouth/mouth-lowerlip-volume-decr', .15),
    ('chin/chin-prominent-incr', .35), ('chin/chin-prognathism-incr', .15),
    ('eyebrows/eyebrows-trans-forward', .15), ('forehead/forehead-scale-vert-decr', .35),
    # Lids: lower lid meets the iris, a soft single lid and inner-corner fold (references/base-m).
    ('eyes/l-eye-height1-incr', .3), ('eyes/r-eye-height1-incr', .3),
    ('eyes/l-eye-height2-decr', .4), ('eyes/r-eye-height2-decr', .4),
    # Relaxed closed mouth: the stock neutral leaves the lips parted.
    ('mouth/mouth-upperlip-middle-down', .35), ('mouth/mouth-lowerlip-middle-up', .35),
    ('mouth/mouth-upperlip-ext-down', .15), ('mouth/mouth-lowerlip-ext-up', .15),
    ('expression/units/asian/mouth-compression', .35),
    ('eyes/l-eye-eyefold-down', .3), ('eyes/r-eye-eyefold-down', .3),
    ('eyes/l-eye-epicanthus-out', .25), ('eyes/r-eye-epicanthus-out', .25),
]:
    sculpt.add_target(target, weight, body)

# Low but present nasal bridge between the eyes (references: visible bridge in three-quarter and profile).
bridge = Vector((0, mid.y, mid.z - span * .12))
sculpt.smooth(bridge, span * .4, .4, 2, body=body)

print('BASE_M', sculpt.export('base-m', body), flush=True)
