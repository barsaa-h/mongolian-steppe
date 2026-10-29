"""Measure the current Driving_Block pose against the film's steering-wheel tube.

Run with Blender opening a study .blend. Vertex samples can miss a face crossing;
this measurement does not replace a visual or continuous collision check.
"""
import json
import math
import sys
from pathlib import Path
import bpy

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE))
from wheel_clearance import signed_distance_to_torus

cab = json.loads((ROOT / 'assets/cast/cab.json').read_text())
# The film uses TorusGeometry(..., 0.025, ...) in src/winter.js.
tube_radius = .025
center3 = [a - b for a, b in zip(cab['wheelCenter'], cab['driverOrigin'])]
center = (center3[0], -center3[2], center3[1])
normal = (0, -math.cos(cab['wheelTilt']), -math.sin(cab['wheelTilt']))
rig = bpy.data.objects['Character.Rig']
rig.animation_data.action = bpy.data.actions['Driving_Block']
bpy.context.scene.frame_set(13)
results = {}
for side in ['L', 'R']:
    obj = bpy.data.objects['Hands.' + side]
    evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh = evaluated.to_mesh()
    distances = [signed_distance_to_torus(evaluated.matrix_world @ v.co, center, normal, cab['wheelRadius'], tube_radius) for v in mesh.vertices]
    evaluated.to_mesh_clear()
    tips = {}
    for finger in range(1, 6):
        tip = rig.matrix_world @ rig.pose.bones[f'finger{finger}-3.{side}'].tail
        tips[str(finger)] = signed_distance_to_torus(tip, center, normal, cab['wheelRadius'], tube_radius)
    results[side] = {
        'verticesInsideOver1mm': sum(d < -.001 for d in distances),
        'deepestVertexPenetrationM': max(0, -min(distances)),
        'closestVertexToSurfaceM': min(abs(d) for d in distances),
        'fingerBoneTipSignedDistancesM': tips,
    }
print('WHEEL_CLEARANCE ' + json.dumps({'frame': 13, 'tubeRadiusM': tube_radius, 'vertexSamplingOnly': True, 'hands': results}), flush=True)
