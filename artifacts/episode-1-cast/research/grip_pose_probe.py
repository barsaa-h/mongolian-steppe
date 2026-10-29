"""Create a disposable driving-pose study from the approved Ganaa authoring file.

This is blocking, not a finished or approved performance. The target is a palm
proxy, and vertex clearance does not establish finger contact with the wheel.
"""
import hashlib
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Quaternion, Vector

ROOT = Path(__file__).resolve().parents[3]
CAB = json.loads((ROOT / 'assets/cast/cab.json').read_text())
output = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
if output.exists() and (not output.is_dir() or any(output.iterdir())):
    raise ValueError('Use a new or empty study directory; existing files are not overwritten')
output.mkdir(parents=True, exist_ok=True)
source_sha256 = hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest()
rig = bpy.data.objects['Character.Rig']
assert rig.get('cast_id') == 'ganaa' and len(rig.data.bones) == 137
if rig.animation_data:
    rig.animation_data.action = None
for bone in rig.pose.bones:
    bone.location = (0, 0, 0)
    bone.rotation_mode = 'QUATERNION'
    bone.rotation_quaternion = (1, 0, 0, 0)
    bone.scale = (1, 1, 1)
bpy.context.view_layer.update()

root = rig.pose.bones['root']
# Artistic blocking position based on the legacy cab; it must be reviewed in shot.
seat = Vector((0, -.22, .22))
root.location = root.bone.matrix_local.to_3x3().inverted() @ (rig.matrix_world.inverted() @ seat - root.bone.head_local)
bpy.context.view_layer.update()


def set_direction(name, direction):
    bone = rig.pose.bones[name]
    rest = bone.bone.matrix_local.to_quaternion()
    parent_delta = bone.parent.matrix.to_quaternion() @ bone.parent.bone.matrix_local.to_quaternion().inverted() if bone.parent else Quaternion()
    current = parent_delta @ rest
    desired = (current @ Vector((0, 1, 0))).rotation_difference(Vector(direction).normalized()) @ current
    bone.rotation_quaternion = rest.inverted() @ parent_delta.inverted() @ desired
    bpy.context.view_layer.update()


rise = math.sqrt(CAB['wheelRadius'] ** 2 - CAB['gripX'] ** 2)
center = Vector(CAB['wheelCenter']) - Vector(CAB['driverOrigin'])
errors = {}
for side, sign in [('L', 1), ('R', -1)]:
    for prefix in ['upperleg01', 'upperleg02']:
        set_direction(prefix + '.' + side, (sign * .06, -1, -.04))
    for prefix in ['lowerleg01', 'lowerleg02']:
        set_direction(prefix + '.' + side, (sign * .02, -.15, -1))
    set_direction('foot.' + side, (0, -1, -.15))
    target_world = Vector((center.x + sign * CAB['gripX'], -(center.z + rise * math.sin(CAB['wheelTilt'])), center.y + rise * math.cos(CAB['wheelTilt'])))
    target_world += -.0814318515522079 * Vector((0, -math.cos(CAB['wheelTilt']), -math.sin(CAB['wheelTilt'])))
    wrist_goal = target_world.copy()
    for iteration in range(12):
        target = rig.matrix_world.inverted() @ wrist_goal
        shoulder = rig.pose.bones['upperarm01.' + side].head.copy()
        distance = (target - shoulder).length
        upper_length = sum(rig.data.bones[name + '.' + side].length for name in ['upperarm01', 'upperarm02'])
        lower_length = sum(rig.data.bones[name + '.' + side].length for name in ['lowerarm01', 'lowerarm02'])
        assert abs(upper_length - lower_length) < distance < upper_length + lower_length
        axis = (target - shoulder).normalized()
        pole = rig.matrix_world.inverted() @ Vector((sign * .39630395509479016, -.46159029422485653, .5772805556361189))
        bend = pole - shoulder
        bend -= axis * bend.dot(axis)
        bend.normalize()
        along = (upper_length ** 2 - lower_length ** 2 + distance ** 2) / (2 * distance)
        elbow = shoulder + axis * along + bend * math.sqrt(max(0, upper_length ** 2 - along ** 2))
        for prefix in ['upperarm01', 'upperarm02']:
            set_direction(prefix + '.' + side, elbow - shoulder)
        forearm = rig.pose.bones['lowerarm01.' + side]
        for prefix in ['lowerarm01', 'lowerarm02']:
            set_direction(prefix + '.' + side, target - forearm.head)
        forearm = rig.pose.bones['lowerarm02.' + side]
        natural = (forearm.tail - forearm.head).normalized()
        tangent = Vector((-sign * rise, -CAB['gripX'] * math.sin(CAB['wheelTilt']), CAB['gripX'] * math.cos(CAB['wheelTilt']))).normalized()
        set_direction('wrist.' + side, natural.lerp(tangent, .4714354185481958).normalized())
        rig.pose.bones['wrist.' + side].rotation_quaternion @= Quaternion((0, 1, 0), -sign * 2.5141292594720963)
        bpy.context.view_layer.update()
        metacarpal = rig.pose.bones['metacarpal2.' + side]
        palm = rig.matrix_world @ metacarpal.head.lerp(metacarpal.tail, .5)
        delta = target_world - palm
        wrist_goal += delta
        if delta.length < .0001: break
    for finger in range(2, 6):
        for joint, angle in [(1, .8220580251862972), (2, .904263827704927), (3, .575440617630408)]:
            rig.pose.bones[f'finger{finger}-{joint}.{side}'].rotation_quaternion = Quaternion((1, 0, 0), angle)
    for joint, angle in [(1, .328823210074519), (2, .411029012593149), (3, .246617407555889)]:
        rig.pose.bones[f'finger1-{joint}.{side}'].rotation_quaternion = Quaternion((1, 0, 0), angle)
    if "--individual-fingers" in sys.argv:
        # Artistic contact probe; each digit needs its own curl around the rim.
        angles = {
            1: (-.245035, 1.219437, .395441),
            2: (1.247799, .091423, .259261),
            3: (.791466, .353049, .658591),
            4: (.751241, .903728, .130053),
            5: (.355657, .528297, .558532),
        }
        rig.pose.bones['metacarpal4.' + side].rotation_quaternion = Quaternion((1, 0, 0), .452778) @ Quaternion((0, 0, 1), sign * .054085)
        for finger, rotations in angles.items():
            for joint, angle in enumerate(rotations, 1):
                rig.pose.bones[f'finger{finger}-{joint}.{side}'].rotation_quaternion = Quaternion((1, 0, 0), angle)
    bpy.context.view_layer.update()
    errors[side] = delta.length
    print('PALM PROXY', side, 'error', delta.length, 'iterations', iteration+1)
    assert delta.length < .001

rig.animation_data_create()
action = bpy.data.actions.new('Driving_Block')
action.use_fake_user = True
rig.animation_data.action = action
for frame in (1, 25):
    for bone in rig.pose.bones:
        bone.keyframe_insert('location', frame=frame)
        bone.keyframe_insert('rotation_quaternion', frame=frame)
        bone.keyframe_insert('scale', frame=frame)
rig.animation_data.action = None
for bone in rig.pose.bones:
    bone.location = (0, 0, 0)
    bone.rotation_quaternion = (1, 0, 0, 0)
    bone.scale = (1, 1, 1)
bpy.context.scene.frame_set(1)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(output / 'Character-Master.blend'))
collection = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
meshes = [o for o in collection.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig, *meshes]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(output / 'character.glb'), use_selection=True, export_format='GLB', export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True, export_frame_range=False, export_extras=True, export_apply=True, export_morph=True)
(output / 'study-report.json').write_text(json.dumps({'status': 'draft blocking, not a performance', 'sourceBlendSha256': source_sha256, 'glbSha256': hashlib.sha256((output / 'character.glb').read_bytes()).hexdigest(), 'blenderVersion': bpy.app.version_string, 'palmProxyTargetErrorM': errors, 'palmContactsChecked': False}, indent=2) + '\n')
print('GRIP_POSE_PROBE_OK', json.dumps(errors), flush=True)
