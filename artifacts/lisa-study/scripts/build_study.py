"""Build the separate LISA art study; run with blender -b --python this_file."""
import bpy
import bmesh
import hashlib
import json
import math
from pathlib import Path
from mathutils import Vector

OUT = Path(__file__).resolve().parents[1]
SOURCE = OUT / 'LISA-original.gltf'
ATLAS = OUT / 'Textures/night-shift-atlas.png'

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
scene = bpy.context.scene
scene.name = 'NIGHT SHIFT | Character'
mesh = next(o for o in scene.objects if o.type == 'MESH' and len(o.data.vertices) > 100)
rig = next(o for o in scene.objects if o.type == 'ARMATURE')
source_actions = list(bpy.data.actions)
assert len(source_actions) == 18
assert len(rig.data.bones) == 21
for index, action in enumerate(source_actions, 1):
    action.name = f'LISA_source_{index:02d}'
    action.use_fake_user = True
if rig.animation_data:
    rig.animation_data.action = None
    for track in rig.animation_data.nla_tracks:
        track.mute = True
for bone in rig.pose.bones:
    bone.matrix_basis.identity()
for ob in list(scene.objects):
    if ob.type == 'MESH' and ob != mesh:
        bpy.data.objects.remove(ob, do_unlink=True)

root = bpy.data.objects.new('NIGHT SHIFT | Axis and metre conversion', None)
scene.collection.objects.link(root)
for ob in [o for o in scene.objects if o.parent is None and o != root]:
    ob.parent = root
root.rotation_euler.y = math.pi
root.scale = (1.70 / 412.7709,) * 3
bpy.context.view_layer.update()
points = [mesh.matrix_world @ Vector(c) for c in mesh.bound_box]
root.location.z -= min(p.z for p in points)

# Weld split source vertices while keeping the per-corner palette UVs intact.
bm = bmesh.new()
bm.from_mesh(mesh.data)
bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.015)
bm.to_mesh(mesh.data)
bm.free()
bpy.context.view_layer.objects.active = mesh
bpy.ops.object.select_all(action='DESELECT')
mesh.select_set(True)
subdivision = mesh.modifiers.new('One contour refinement pass', 'SUBSURF')
subdivision.levels = 1
subdivision.boundary_smooth = 'PRESERVE_CORNERS'
bpy.ops.object.modifier_move_up(modifier=subdivision.name)
bpy.ops.object.modifier_apply(modifier=subdivision.name)
for vertex in mesh.data.vertices:
    weights = [(g.group, g.weight) for g in vertex.groups if g.weight > 0]
    total = sum(weight for _, weight in weights)
    assert total > 0, f'Unweighted vertex {vertex.index}'
    for group, weight in weights:
        mesh.vertex_groups[group].add([vertex.index], weight / total, 'REPLACE')
for polygon in mesh.data.polygons:
    polygon.use_smooth = True
mesh.name = 'NIGHT SHIFT | Refined LISA body'
rig.name = 'NIGHT SHIFT | Source 21-joint rig'

material = mesh.data.materials[0]
material.name = 'NIGHT SHIFT | Painted diffuse'
nodes = material.node_tree.nodes
shader = nodes.get('Principled BSDF')
image_node = next(n for n in nodes if n.type == 'TEX_IMAGE')
image_node.image = bpy.data.images.load(str(ATLAS), check_existing=True)
image_node.image.pack()
image_node.interpolation = 'Linear'
shader.inputs['Roughness'].default_value = 1
shader.inputs['Metallic'].default_value = 0
shader.inputs['Specular IOR Level'].default_value = .08
for link in list(shader.inputs['Alpha'].links):
    material.node_tree.links.remove(link)
shader.inputs['Alpha'].default_value = 1
material.use_backface_culling = True

# The source cap shares palette shapes with shoes; sample ivory cloth instead.
uv = mesh.data.uv_layers.active.data
cap_faces = 0
for polygon in mesh.data.polygons:
    center_uv = sum((uv[i].uv for i in polygon.loop_indices), Vector((0, 0))) / len(polygon.loop_indices)
    if int(center_uv.x * 4) == 1 and int((1 - center_uv.y) * 3) == 2 and polygon.center.z < -410:
        for index in polygon.loop_indices:
            position = mesh.data.vertices[mesh.data.loops[index].vertex_index].co
            uv[index].uv = (1150 / 2048 + (position.x + 22) / 44 * 170 / 2048,
                           1 - (10 + (position.z + 428) / 26 * 80) / 768)
        cap_faces += 1
assert cap_faces > 0

scene.world = bpy.data.worlds.new('NIGHT SHIFT | Charcoal studio')
scene.world.use_nodes = True
background = scene.world.node_tree.nodes['Background']
background.inputs['Color'].default_value = (.035, .041, .044, 1)
background.inputs['Strength'].default_value = .65
for name, location, energy, size, color in [
    ('Key', (-2.5, -4, 4), 210, 3, (1, .94, .86)),
    ('Fill', (3, -2, 2), 85, 3, (.78, .86, 1)),
    ('Rim', (1, 3, 3.5), 180, 2, (.74, .86, .94)),
]:
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.size, data.color = energy, size, color
    ob = bpy.data.objects.new(name, data)
    scene.collection.objects.link(ob)
    ob.location = location
    ob.rotation_euler = (Vector((0, 0, 1)) - ob.location).to_track_quat('-Z', 'Y').to_euler()

camera_data = bpy.data.cameras.new('Presentation camera')
camera = bpy.data.objects.new('Presentation camera', camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera_data.type = 'ORTHO'
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.view_settings.view_transform = 'Standard'
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'

def frame_camera(location, target, scale):
    camera.location = location
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera_data.ortho_scale = scale

for name, location, target, scale, resolution in [
    ('portrait', (.12, -3, 1.55), (0, 0, 1.49), .62, (1000, 1000)),
    ('front', (0, -4, .95), (0, 0, .87), 1.94, (720, 1080)),
    ('three-quarter', (.9, -4, 1.13), (0, 0, .88), 1.94, (720, 1080)),
    ('back', (0, 4, .95), (0, 0, .87), 1.94, (720, 1080)),
]:
    frame_camera(location, target, scale)
    scene.render.resolution_x, scene.render.resolution_y = resolution
    scene.render.filepath = str(OUT / f'{name}.png')
    bpy.ops.render.render(write_still=True)

frame_camera((.9, -4, 1.13), (0, 0, .88), 1.94)
scene.render.resolution_x, scene.render.resolution_y = 720, 1080
scene.render.filepath = '//three-quarter.png'
scene.render.fps = 24
scene.frame_start, scene.frame_end = 0, 619
root['Source'] = 'LISA-original.gltf supplied by user; Silent Hill 1-derived reference'
root['Status'] = 'Non-commercial derivative art study; not an original production character'
root['Changes'] = 'Welded topology, contour refinement, normalized interpolated skinning, repainted diffuse'
root['Limit'] = 'Source body clips retained; no new facial acting rig or hand animation'
bpy.ops.object.select_all(action='DESELECT')
for ob in [root, rig, mesh]:
    ob.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(
    filepath=str(OUT / 'night-shift.glb'), export_format='GLB', use_selection=True,
    export_animations=True, export_animation_mode='ACTIONS', export_frame_range=False,
    export_force_sampling=True, export_skins=True, export_extras=True,
)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'Night-Shift.blend'))
triangles = sum(len(p.vertices) - 2 for p in mesh.data.polygons)
assert triangles == 4896, triangles
assert all(abs(sum(g.weight for g in v.groups) - 1) < 1e-5 for v in mesh.data.vertices)
report = {
    'sourceSHA256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'sourceTriangles': 816, 'studyTriangles': triangles,
    'studyVertices': len(mesh.data.vertices), 'bones': len(rig.data.bones),
    'sourceActions': [{'name': a.name, 'frames': list(a.frame_range)} for a in source_actions],
    'textureSize': list(image_node.image.size), 'normalizedWeights': True,
    'packedTexture': bool(image_node.image.packed_file),
    'capFacesRemapped': cap_faces,
}
(OUT / 'build-report.json').write_text(json.dumps(report, indent=2) + '\n')
print('STUDY_BUILD_OK', json.dumps(report), flush=True)
