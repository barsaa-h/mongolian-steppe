"""Base C: shared corrections that make a young Mongolian child read as a real child, not a shrunk adult.

Built on a neutral three-year-old (all identity sliders at zero) and saved as sculpt/base-c.target.
Tuned against references/base-c. Run:
    blender -b --factory-startup --python base_c.py -- <neutral child build dir>
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import bpy
import sculpt

bpy.ops.wm.open_mainfile(filepath=str(Path(sys.argv[sys.argv.index('--') + 1]) / 'Character-Master.blend'))
body = sculpt.source_body()
sculpt.prepare(body)

for target, weight in [
    # Small closed mouth with soft lips; the stock child mouth is an adult shape, parted over the teeth.
    # (A stronger compression and lower-lip lift read as a pout; user review 2026-10-29.)
    ('expression/units/asian/mouth-compression', .3), ('mouth/mouth-scale-horiz-decr', .3),
    ('mouth/mouth-upperlip-volume-decr', .15), ('mouth/mouth-lowerlip-volume-decr', .3), ('mouth/mouth-trans-backward', .25),
    ('mouth/mouth-upperlip-middle-down', .3),
    # Short button nose with a low bridge, tip turned slightly up.
    ('nose/nose-scale-vert-decr', .45), ('nose/nose-point-up', .3), ('nose/nose-scale-depth-decr', .2),
    ('nose/nose-nostrils-width-decr', .2),
    # Round full cheeks.
    ('cheek/l-cheek-volume-incr', .2), ('cheek/r-cheek-volume-incr', .2),
    ('cheek/l-cheek-trans-up', .25), ('cheek/r-cheek-trans-up', .25),
    ('cheek/l-cheek-bones-decr', .2), ('cheek/r-cheek-bones-decr', .2),
    # Slightly larger eyes with a soft fold and the lower lid meeting the iris.
    ('eyes/l-eye-scale-incr', .2), ('eyes/r-eye-scale-incr', .2),
    ('eyes/l-eye-height1-incr', .25), ('eyes/r-eye-height1-incr', .25),
    ('eyes/l-eye-eyefold-down', .25), ('eyes/r-eye-eyefold-down', .25),
    ('eyes/l-eye-epicanthus-out', .35), ('eyes/r-eye-epicanthus-out', .35),
    # Smaller ears, set closer to the head.
    ('ears/l-ear-scale-decr', .35), ('ears/r-ear-scale-decr', .35),
    ('ears/l-ear-wing-decr', .3), ('ears/r-ear-wing-decr', .3),
    # Soft, short chin: keeps the lower face light.
    ('chin/chin-prominent-decr', .2), ('chin/chin-height-decr', .25), ('head/head-fat-decr', .15),
]:
    sculpt.add_target(target, weight, body)

print('BASE_C', sculpt.export('base-c', body), flush=True)
