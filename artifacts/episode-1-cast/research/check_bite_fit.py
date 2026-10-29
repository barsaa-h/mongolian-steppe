"""Measure draft makeup against skin in three isolated rig poses."""
import json
import bpy
from mathutils import Quaternion
from mathutils.bvhtree import BVHTree

rig = bpy.data.objects['Character.Rig']
rig.animation_data.action = None
result = {}
for label, angle in [('neutral', 0), ('elbow_bend', .7), ('forearm_twist', -.7)]:
    for bone in rig.pose.bones:
        bone.location = (0, 0, 0)
        bone.rotation_mode = 'QUATERNION'
        bone.rotation_quaternion = (1, 0, 0, 0)
        bone.scale = (1, 1, 1)
    if label == 'elbow_bend':
        rig.pose.bones['lowerarm01.R'].rotation_quaternion = Quaternion((1, 0, 0), angle)
    if label == 'forearm_twist':
        rig.pose.bones['lowerarm02.R'].rotation_quaternion = Quaternion((0, 1, 0), angle)
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    points, faces = [], []
    for name in ['Body.Skin', 'Hands.R']:
        obj = bpy.data.objects[name].evaluated_get(depsgraph)
        mesh = obj.to_mesh()
        mesh.calc_loop_triangles()
        offset = len(points)
        points.extend(obj.matrix_world @ vertex.co for vertex in mesh.vertices)
        faces.extend(tuple(offset + index for index in tri.vertices) for tri in mesh.loop_triangles)
        obj.to_mesh_clear()
    skin = BVHTree.FromPolygons(points, faces, all_triangles=True)
    result[label] = {}
    for name in ['Research.WristBite', 'Research.InfectionLine']:
        obj = bpy.data.objects[name].evaluated_get(depsgraph)
        mesh = obj.to_mesh()
        world = [obj.matrix_world @ vertex.co for vertex in mesh.vertices]
        distances = [skin.find_nearest(point)[3] for point in world]
        mesh.calc_loop_triangles()
        layer = BVHTree.FromPolygons(world, [tuple(tri.vertices) for tri in mesh.loop_triangles], all_triangles=True)
        result[label][name] = {'maxDistanceM': max(distances), 'over3mm': sum(d > .003 for d in distances),
                               'surfaceIntersections': len(skin.overlap(layer))}
        obj.to_mesh_clear()
print('BITE_FIT', json.dumps(result))
