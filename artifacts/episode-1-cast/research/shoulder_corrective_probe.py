"""Experimental, shot-specific jacket corrective; not a reusable garment fit."""
import bpy
import sys
from pathlib import Path
from mathutils import Vector

output = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
if output.exists() and (not output.is_dir() or any(output.iterdir())):
    raise ValueError('Use a new or empty study directory')
output.mkdir(parents=True, exist_ok=True)
rig = bpy.data.objects['Character.Rig']
top = bpy.data.objects['Clothes.Top']
assert rig.get('cast_id') == 'ganaa' and len(rig.data.bones) == 137
assert bpy.data.actions.get('Cheek_Block') and not top.data.shape_keys

# Bake the existing thickness first: the GLB exporter cannot retain this morph through solidify.
bpy.ops.object.select_all(action='DESELECT')
top.select_set(True)
bpy.context.view_layer.objects.active = top
for modifier in list(top.modifiers):
    if modifier.type == 'SOLIDIFY':
        bpy.ops.object.modifier_apply(modifier=modifier.name)
top.data.update()
top.shape_key_add(name='Basis')
key = top.shape_key_add(name='ShoulderReach')
center = Vector((-.14, .014, 1.35))
changed = 0
for vertex in top.data.vertices:
    distance = (vertex.co-center).length
    if distance < .075:
        key.data[vertex.index].co += vertex.normal * (.015 * (1-(distance/.075)**2)**2)
        changed += 1
assert changed > 10
keys = top.data.shape_keys
keys.animation_data_create()
keys.animation_data.action = bpy.data.actions['Cheek_Block']
for seconds, value in [(0, 0), (21, 0), (21.5, 1), (23.5, 1), (24.5, 0), (30, 0)]:
    key.value = value
    key.keyframe_insert('value', frame=seconds*24)
bag = keys.animation_data.action.layers[0].strips[0].channelbag(keys.animation_data.action_slot)
for curve in bag.fcurves:
    for point in curve.keyframe_points:
        point.interpolation = 'LINEAR'
key.value = 0
bpy.context.scene.frame_set(0)
bpy.context.view_layer.update()
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(output / 'Character-Master.blend'))
collection = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig, *(item for item in collection.objects if item.type == 'MESH')]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(output / 'character.glb'), use_selection=True, export_format='GLB',
                          export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
                          export_frame_range=False, export_extras=True, export_apply=True, export_morph=True)
print('SHOULDER_CORRECTIVE_PROBE_OK', changed, flush=True)
