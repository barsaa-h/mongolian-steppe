"""Draft HOUR 5 wrist rag and elbow-length line; side and appearance are provisional."""
import bpy
import json
import math
import sys
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

output = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
if output.exists() and (not output.is_dir() or any(output.iterdir())):
    raise ValueError('Use a new or empty study directory')
output.mkdir(parents=True, exist_ok=True)
rig = bpy.data.objects['Character.Rig']
assert rig.get('cast_id') == 'ganaa' and len(rig.data.bones) == 137
collection = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
parts = [bpy.data.objects['Body.Skin'], bpy.data.objects['Hands.R']]
arm = rig.data.bones['lowerarm01.R'].head_local
wrist = rig.data.bones['wrist.R'].head_local
axis = (wrist-arm).normalized()
length = (wrist-arm).length
radial_zero = (Vector((0, 0, 1))-axis*axis.z).normalized()
tangent = axis.cross(radial_zero).normalized()


def surface_tree(objects, restrict_arm=False):
    points, triangles, source_weights = [], [], []
    for obj in objects:
        obj.data.calc_loop_triangles()
        offset = len(points)
        points.extend(vertex.co.copy() for vertex in obj.data.vertices)
        source_weights.extend([{obj.vertex_groups[g.group].name: g.weight for g in vertex.groups
                                if rig.data.bones.get(obj.vertex_groups[g.group].name)} for vertex in obj.data.vertices])
        for triangle in obj.data.loop_triangles:
            if restrict_arm:
                center = sum((obj.data.vertices[i].co for i in triangle.vertices), Vector()) / 3
                delta = center-arm
                along = delta.dot(axis)
                if not (-.15 < along/length < 1.2 and (delta-axis*along).length < .11):
                    continue
            triangles.append(tuple(offset+i for i in triangle.vertices))
    assert triangles
    return BVHTree.FromPolygons(points, triangles, all_triangles=True), points, triangles, source_weights


def project(data, along, direction, across=0, offset=.003):
    tree, points, triangles, source_weights = data
    origin = arm+axis*(along*length)+tangent*across+direction*.10
    hit, normal, index, distance = tree.ray_cast(origin, -direction, .20)
    assert hit is not None and distance < .15, (along, across, distance)
    a, b, c = [points[i] for i in triangles[index]]
    v0, v1, v2 = b-a, c-a, hit-a
    d00, d01, d11, d20, d21 = v0.dot(v0), v0.dot(v1), v1.dot(v1), v2.dot(v0), v2.dot(v1)
    denominator = d00*d11-d01*d01
    assert abs(denominator) > 1e-14
    beta = (d11*d20-d01*d21)/denominator
    gamma = (d00*d21-d01*d20)/denominator
    combined = {}
    for source, factor in zip(triangles[index], (1-beta-gamma, beta, gamma)):
        for name, value in source_weights[source].items():
            combined[name] = combined.get(name, 0)+factor*value
    selected = sorted(((name, value) for name, value in combined.items() if value > 0), key=lambda pair: -pair[1])[:4]
    total = sum(value for _, value in selected)
    assert total > 0
    return hit+normal*offset, [(name, value/total) for name, value in selected]


def create_mesh(name, role, vertices, faces, weights, materials):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.parent = rig
    obj.matrix_parent_inverse = parts[0].matrix_parent_inverse.copy()
    obj.matrix_basis = parts[0].matrix_basis.copy()
    obj['role'] = role
    for material in materials:
        mesh.materials.append(material)
    groups = {}
    for index, vertex_weights in enumerate(weights):
        for group_name, weight in vertex_weights:
            if group_name not in groups:
                groups[group_name] = obj.vertex_groups.new(name=group_name)
            groups[group_name].add([index], weight, 'REPLACE')
    obj.modifiers.new('Character skin', 'ARMATURE').object = rig
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    return obj


# Three overlapping, slightly irregular cloth strips over the wrist bite.
skin = surface_tree(parts)
rag_vertices, rag_faces, rag_weights = [], [], []
segments = 48
for band in range(3):
    for row in range(2):
        for i in range(segments):
            angle = math.tau*i/segments
            direction = radial_zero*math.cos(angle)+tangent*math.sin(angle)
            t = .745+band*.07+row*.105+.012*math.sin(angle+.8*band)
            point, weights = project(skin, t, direction, offset=.0035+band*.0008+.0005*math.sin(5*angle+band))
            rag_vertices.append(point)
            rag_weights.append(weights)
    first = band*segments*2
    for i in range(segments):
        rag_faces.append((first+i, first+(i+1)%segments, first+segments+(i+1)%segments, first+segments+i))
rag_materials = []
for index, color in enumerate([(.38,.31,.24,1), (.42,.35,.27,1), (.39,.32,.25,1)]):
    mat = bpy.data.materials.new('Research.RagFabric.'+str(index))
    mat.diffuse_color = color
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = color
    shader.inputs['Roughness'].default_value = .92
    rag_materials.append(mat)
rag = create_mesh('Research.WristRag', 'Story.WristRag', rag_vertices, rag_faces, rag_weights, rag_materials)
rag['states'] = 'hour-five,turning'
for index, polygon in enumerate(rag.data.polygons):
    polygon.material_index = index // segments

# Build the line on a temporary full body so it continues beneath the sleeve to the elbow.
source = next(obj for obj in bpy.data.objects if obj.name.startswith('SOURCE.Body'))
source_collection = source.users_collection[0]
source_collection.hide_viewport = False
full = source.copy()
full.data = source.data.copy()
collection.objects.link(full)
full.hide_render = False
full.hide_viewport = False
full.hide_set(False)
bpy.ops.object.select_all(action='DESELECT')
full.select_set(True)
bpy.context.view_layer.objects.active = full
bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
full_skin = surface_tree([full], restrict_arm=True)
line_vertices, line_faces, line_weights = [], [], []
line_segments = 84
for i in range(line_segments+1):
    t = .86-.84*i/line_segments
    across = .0018*math.sin(i*.14)
    for side in [-1, 1]:
        point, weights = project(full_skin, t, radial_zero, across+side*.0008, .0008/rig.scale.x)
        line_vertices.append(point)
        line_weights.append(weights)
for i in range(line_segments):
    line_faces.append((2*i, 2*i+1, 2*i+3, 2*i+2))
old_line = bpy.data.objects['Research.InfectionLine']
line_material = old_line.data.materials[0]
bpy.data.objects.remove(old_line, do_unlink=True)
line = create_mesh('Research.InfectionLine', 'Story.InfectionLine', line_vertices, line_faces, line_weights, [line_material])
line['states'] = 'bite-reveal,hour-five,turning'
line['reveal_segments'] = line_segments
bpy.data.objects.remove(full, do_unlink=True)
source_collection.hide_viewport = True
bite = bpy.data.objects['Research.WristBite']
bite['states'] = 'bite-reveal'
states = json.loads(rig['story_states'])
if 'bite-reveal' not in states:
    states.insert(1, 'bite-reveal')
rig['story_states'] = json.dumps(states)
assert len(line_faces) == line_segments and len(rag_faces) == 3*segments
bpy.context.scene.frame_set(0)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(output/'Character-Master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig, *(item for item in collection.objects if item.type == 'MESH')]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(output/'character.glb'), use_selection=True, export_format='GLB',
                          export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
                          export_frame_range=False, export_extras=True, export_apply=True, export_morph=True)
print('HOUR5_RAG_PROBE_OK', len(rag_vertices), len(line_vertices), line_segments, flush=True)
