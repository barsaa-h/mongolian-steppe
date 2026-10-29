"""Draft rolled cuff from a retained sleeve edge; this is not a shared wardrobe asset."""
import bmesh
import bpy
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
output = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
if output.exists() and (not output.is_dir() or any(output.iterdir())):
    raise ValueError('Use a new or empty study directory')
output.mkdir(parents=True, exist_ok=True)
rig = bpy.data.objects['Character.Rig']
top = bpy.data.objects['Clothes.Top']
assert rig.get('cast_id') == 'ganaa' and len(rig.data.bones) == 137
collection = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
source_path = ROOT / 'artifacts/episode-1-cast/ganaa-cheek-study/Character-Master.blend'
with bpy.data.libraries.load(str(source_path), link=False) as (available, requested):
    assert 'Clothes.Top' in available.objects
    requested.objects = ['Clothes.Top']
source = requested.objects[0]
arm = rig.data.bones['lowerarm01.R'].head_local
axis = rig.data.bones['wrist.R'].head_local - arm
length = axis.length
axis.normalize()
bm = bmesh.new()
bm.from_mesh(source.data)
bm.verts.ensure_lookup_table()


def coordinate(vertex):
    delta = vertex.co-arm
    along = delta.dot(axis)
    return along/length, (delta-axis*along).length*rig.scale.x


edges = [edge for edge in bm.edges if edge.is_boundary and all(.35 < coordinate(v)[0] < .75 and coordinate(v)[1] < .12 for v in edge.verts)]
adjacency = {}
for edge in edges:
    a, b = (v.index for v in edge.verts)
    adjacency.setdefault(a, []).append(b)
    adjacency.setdefault(b, []).append(a)
assert len(edges) == len(adjacency) and all(len(neighbors) == 2 for neighbors in adjacency.values()), 'Expected one closed sleeve edge'
order = [min(adjacency)]
previous = None
while True:
    current = order[-1]
    next_vertex = min(v for v in adjacency[current] if v != previous)
    if next_vertex == order[0]:
        break
    assert next_vertex not in order, 'Sleeve edge is not a single loop'
    order.append(next_vertex)
    previous = current
assert len(order) == len(adjacency)
bm.free()
# The shoulder study bakes solidify; validate the source-to-baked vertex correspondence.
source_ids = source.data.attributes['source_vertex'].data
top_ids = top.data.attributes['source_vertex'].data
assert all(source_ids[i].value == top_ids[i].value and (source.data.vertices[i].co-top.data.vertices[i].co).length < .003 for i in order)

vertices, faces, vertex_weights = [], [], []
count = len(order)
for along, outward in [(-.002, .001), (-.007, .0045), (-.027, .0045), (-.032, .0015)]:
    for index in order:
        vertex = top.data.vertices[index]
        delta = vertex.co-arm
        radial = (delta-axis*delta.dot(axis)).normalized()
        vertices.append(vertex.co+axis*along+radial*outward)
        weights = [(top.vertex_groups[group.group].name, group.weight) for group in vertex.groups
                   if rig.data.bones.get(top.vertex_groups[group.group].name)]
        weights = sorted(weights, key=lambda pair: -pair[1])[:4]
        total = sum(weight for _, weight in weights)
        assert total > 0
        vertex_weights.append([(name, weight/total) for name, weight in weights])
for row in range(3):
    for index in range(count):
        faces.append((row*count+index, row*count+(index+1)%count,
                      (row+1)*count+(index+1)%count, (row+1)*count+index))
mesh = bpy.data.meshes.new('Research.Cuff')
mesh.from_pydata(vertices, [], faces)
mesh.update()
obj = bpy.data.objects.new('Research.Cuff', mesh)
collection.objects.link(obj)
obj.parent = rig
obj.matrix_parent_inverse = top.matrix_parent_inverse.copy()
obj.matrix_basis = top.matrix_basis.copy()
obj['role'] = 'Clothes.RolledCuff'
obj['edge_vertices'] = count
mesh.materials.append(top.data.materials[0])
groups = {}
for index, weights in enumerate(vertex_weights):
    for name, weight in weights:
        if name not in groups:
            groups[name] = obj.vertex_groups.new(name=name)
        groups[name].add([index], weight, 'REPLACE')
obj.modifiers.new('Character skin', 'ARMATURE').object = rig
uvs = {}
layer = top.data.uv_layers.active
assert layer is not None
for polygon in top.data.polygons:
    for loop_index in polygon.loop_indices:
        index = top.data.loops[loop_index].vertex_index
        if index in adjacency and index not in uvs:
            uvs[index] = layer.data[loop_index].uv.copy()
assert len(uvs) == count
uv = mesh.uv_layers.new(name='UVMap')
for polygon in mesh.polygons:
    polygon.use_smooth = True
    for loop_index in polygon.loop_indices:
        uv.data[loop_index].uv = uvs[order[mesh.loops[loop_index].vertex_index % count]]
bpy.data.objects.remove(source, do_unlink=True)
bpy.context.scene.frame_set(0)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(output / 'Character-Master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for item in [rig, *(item for item in collection.objects if item.type == 'MESH')]:
    item.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(output / 'character.glb'), use_selection=True, export_format='GLB',
                          export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
                          export_frame_range=False, export_extras=True, export_apply=True, export_morph=True)
print('CUFF_PROBE_OK', count, len(vertices), len(faces), flush=True)
