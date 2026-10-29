"""Sample draft cuff-to-sleeve and cuff-to-skin geometry during the cheek block."""
import json
import bpy
from mathutils.bvhtree import BVHTree

rig = bpy.data.objects['Character.Rig']
rig.animation_data.action = bpy.data.actions['Cheek_Block']
edge_count = bpy.data.objects['Research.Cuff']['edge_vertices']
assert edge_count > 2
result = []
for time in sorted({*(20 + frame/24 for frame in range(121)), 2.3, 22.15}):
    frame = time*24
    bpy.context.scene.frame_set(int(frame), subframe=frame-int(frame))
    depsgraph = bpy.context.evaluated_depsgraph_get()
    data = {}
    for name in ['Clothes.Top', 'Body.Skin', 'Hands.R', 'Research.Cuff']:
        obj = bpy.data.objects[name].evaluated_get(depsgraph)
        mesh = obj.to_mesh()
        mesh.calc_loop_triangles()
        points = [obj.matrix_world @ vertex.co for vertex in mesh.vertices]
        triangles = [tuple(tri.vertices) for tri in mesh.loop_triangles]
        assert triangles
        data[name] = (BVHTree.FromPolygons(points, triangles, all_triangles=True), points)
        obj.to_mesh_clear()
    cuff = data['Research.Cuff']
    intersections = sum(len(cuff[0].overlap(data[name][0])) for name in ['Body.Skin', 'Hands.R'])
    gaps = [data['Clothes.Top'][0].find_nearest(point)[3] for point in cuff[1][:edge_count]]
    result.append({'time': time, 'seamMaxM': max(gaps), 'skinIntersections': intersections})
crossings = {str(item['time']): item['skinIntersections'] for item in result if item['skinIntersections']}
max_gap = max(item['seamMaxM'] for item in result)
assert max_gap < .003, f'Cuff edge floats up to {max_gap}m from sleeve'
assert not crossings, f'Cuff crosses the skin at sampled times: {crossings}'
print('CUFF_QA', json.dumps({'samples': len(result), 'maxSeamGapM': max_gap, 'skinCrossingFrames': crossings}), flush=True)
