"""Draft right-wrist makeup on an exposed-skin probe; not a film asset."""
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

out = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
if out.exists() and (not out.is_dir() or any(out.iterdir())):
    raise ValueError('Use a new or empty research directory')
out.mkdir(parents=True, exist_ok=True)
rig = bpy.data.objects['Character.Rig']
assert rig.get('cast_id') == 'ganaa' and len(rig.data.bones) == 137
collection = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
parts = [bpy.data.objects['Body.Skin'], bpy.data.objects['Hands.R']]
points, triangles, source_weights = [], [], []
for part in parts:
    part.data.calc_loop_triangles()
    offset = len(points)
    points.extend(v.co.copy() for v in part.data.vertices)
    source_weights.extend([{part.vertex_groups[g.group].name: g.weight for g in v.groups
                            if rig.data.bones.get(part.vertex_groups[g.group].name)} for v in part.data.vertices])
    triangles.extend(tuple(offset + i for i in tri.vertices) for tri in part.data.loop_triangles)
tree = BVHTree.FromPolygons(points, triangles, all_triangles=True)
a = rig.data.bones['lowerarm01.R'].head_local
wrist = rig.data.bones['wrist.R'].head_local
axis = (wrist - a).normalized()
length = (wrist - a).length
radial = (Vector((0, 0, 1)) - axis * axis.z).normalized()
tangent = axis.cross(radial).normalized()
vertices, faces, weights = [], [], []


def surface(t, across):
    start = a + axis * (t * length) + tangent * across + radial * .09
    hit, normal, index, distance = tree.ray_cast(start, -radial, .18)
    assert hit is not None and distance < .14, (t, across, distance)
    p, q, r = [points[i] for i in triangles[index]]
    v0, v1, v2 = q-p, r-p, hit-p
    d00, d01, d11 = v0.dot(v0), v0.dot(v1), v1.dot(v1)
    denominator = d00*d11-d01*d01
    assert abs(denominator) > 1e-14
    d20, d21 = v2.dot(v0), v2.dot(v1)
    b = (d11*d20-d01*d21)/denominator
    c = (d00*d21-d01*d20)/denominator
    result = {}
    for source, factor in zip(triangles[index], (1-b-c, b, c)):
        for name, value in source_weights[source].items():
            result[name] = result.get(name, 0) + factor * value
    result = sorted(((name, value) for name, value in result.items() if value > 0), key=lambda pair: -pair[1])[:4]
    total = sum(value for _, value in result)
    assert total > 0
    vertices.append(hit + normal * (.0008 / rig.scale.x))
    weights.append([(name, value/total) for name, value in result])
    return len(vertices)-1


# Two small arcs of tooth marks and a thin line toward the elbow: art study only.
for row in (-1, 1):
    for i in range(6):
        across = (i - 2.5) * .0043
        center_t = .89 + row * (.0065 + .18 * across * across / .014) / length
        center = surface(center_t, across)
        ring = [surface(center_t + .0017 * math.cos(j*math.tau/12)/length,
                        across + .0014 * math.sin(j*math.tau/12)) for j in range(12)]
        faces.extend((center, ring[j], ring[(j+1)%12]) for j in range(12))
bite_vertex_count = len(vertices)
bite_face_count = len(faces)
line = []
for i in range(31):
    t = .86 - .25*i/30
    across = .0018 * math.sin(i*.38)
    line.append((surface(t, across-.0008), surface(t, across+.0008)))
for i in range(len(line)-1):
    faces.append((line[i][0], line[i][1], line[i+1][1], line[i+1][0]))

material = bpy.data.materials.new('Research.BiteRed')
material.diffuse_color = (.24, .025, .018, 1)
material.use_nodes = True
material.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = material.diffuse_color
material.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value = .72

# Separate objects allow the red line to be revealed without hiding the bite.
for name, start, end, object_faces in [
    ('WristBite', 0, bite_vertex_count, faces[:bite_face_count]),
    ('InfectionLine', bite_vertex_count, len(vertices), faces[bite_face_count:]),
]:
    mesh = bpy.data.meshes.new('Research.' + name)
    mesh.from_pydata(vertices[start:end], [], [tuple(index-start for index in face) for face in object_faces])
    mesh.update()
    obj = bpy.data.objects.new('Research.' + name, mesh)
    collection.objects.link(obj)
    obj.parent = rig
    obj.matrix_parent_inverse = parts[0].matrix_parent_inverse.copy()
    obj.matrix_basis = parts[0].matrix_basis.copy()
    obj['role'] = 'Story.' + name
    obj['states'] = 'hour-five,turning'
    if name == 'InfectionLine':
        obj['reveal_segments'] = len(line) - 1
    groups = {}
    for index, skin_weights in enumerate(weights[start:end]):
        for group_name, value in skin_weights:
            if group_name not in groups:
                groups[group_name] = obj.vertex_groups.new(name=group_name)
            groups[group_name].add([index], value, 'REPLACE')
    modifier = obj.modifiers.new('Skin Deform', 'ARMATURE')
    modifier.object = rig
    mesh.materials.append(material)
bpy.data.objects.remove(bpy.data.objects['Story.ForearmBandage'], do_unlink=True)
assert len(vertices) == len(weights) and len(faces) > 100
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(out / 'Character-Master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for item in [rig, *(o for o in collection.objects if o.type == 'MESH')]:
    item.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(out / 'character.glb'), use_selection=True, export_format='GLB',
                          export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
                          export_frame_range=False, export_extras=True, export_apply=True, export_morph=True)
print('WRIST_BITE_PROBE_OK', len(vertices), len(faces), flush=True)
