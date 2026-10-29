"""Check the head-weighted skin against the right hand in the draft cheek block."""
import json
import bpy
from mathutils.bvhtree import BVHTree

rig = bpy.data.objects['Character.Rig']
rig.animation_data.action = bpy.data.actions['Cheek_Block']
body = bpy.data.objects['Body.Skin']
head_group = body.vertex_groups['head'].index
head_vertices = {vertex.index for vertex in body.data.vertices
                 if any(group.group == head_group and group.weight > 0 for group in vertex.groups)}
results = {}
for seconds in sorted({*(20 + frame / 24 for frame in range(121)), 22.15, 22.35}):
    frame = seconds * 24
    bpy.context.scene.frame_set(int(frame), subframe=frame-int(frame))
    depsgraph = bpy.context.evaluated_depsgraph_get()
    trees = []
    for name in ['Body.Skin', 'Hands.R']:
        obj = bpy.data.objects[name].evaluated_get(depsgraph)
        mesh = obj.to_mesh()
        mesh.calc_loop_triangles()
        points = [obj.matrix_world @ vertex.co for vertex in mesh.vertices]
        triangles = [tuple(triangle.vertices) for triangle in mesh.loop_triangles
                     if name != 'Body.Skin' or (all(points[i].z > .75 and abs(points[i].x) < .14 for i in triangle.vertices)
                     and any(i in head_vertices for i in triangle.vertices))]
        assert triangles
        trees.append((BVHTree.FromPolygons(points, triangles, all_triangles=True), points))
        obj.to_mesh_clear()
    head, hand = trees
    distances = [head[0].find_nearest(point)[3] for point in hand[1]]
    results[seconds] = {'nearestM': min(distances), 'verticesWithin5mm': sum(d < .005 for d in distances),
                        'surfaceIntersections': len(head[0].overlap(hand[0]))}
impact = results[22.15]
assert impact['nearestM'] < .006 and impact['verticesWithin5mm'] > 0, impact
collision_frames = {str(time): item['surfaceIntersections'] for time, item in results.items() if item['surfaceIntersections']}
print('CHEEK_BLOCK_QA', json.dumps({'samples': len(results), 'impact': impact, 'crossingFrames': collision_frames}), flush=True)
