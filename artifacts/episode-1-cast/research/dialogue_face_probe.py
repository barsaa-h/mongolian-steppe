"""Text-timed facial blocking only: not recorded-voice lip sync or an approved performance."""
import bpy
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
output = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
if output.exists() and (not output.is_dir() or any(output.iterdir())):
    raise ValueError('Use a new or empty study directory')
output.mkdir(parents=True, exist_ok=True)
rig = bpy.data.objects['Character.Rig']
assert rig.get('cast_id') == 'ganaa' and len(rig.data.bones) == 137
collection = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
body = bpy.data.objects['Body.Skin']
keys = body.data.shape_keys
names = ['smile', 'frown', 'blink', 'viseme_A', 'viseme_E', 'viseme_O', 'viseme_M']
assert all('EXP.' + name in keys.key_blocks for name in names)
# Keep the independent technical talk clip after the draft switches to the shot action.
assert keys.animation_data.action.name == 'Talk_Check'
talk_action = keys.animation_data.action
talk_slot = keys.animation_data.action_slot
talk_action.use_fake_user = True
cues = json.loads(subprocess.check_output(
    ['node', '--input-type=module', '-e', "import {CUES} from './src/filmTimeline.js'; console.log(JSON.stringify(CUES));"],
    cwd=ROOT, text=True))
cues = [cue for cue in cues if cue['speaker'] == 'ГАНАА']
assert len(cues) == 5 and all(0 <= cue['start'] < cue['end'] <= 30 for cue in cues)
action = bpy.data.actions['Cheek_Block']
keys.animation_data.action = action
# Timeline entries are independent additive weights; none changes neutral identity.
events = {name: {0.0: 0.0, 30.0: 0.0} for name in names}

def add(name, time, value):
    events[name][round(time, 6)] = value

# Uniform text spacing is deliberately provisional and must be replaced by a voice-timed pass.
visemes = {'а':'viseme_A', 'я':'viseme_A', 'э':'viseme_E', 'е':'viseme_E', 'и':'viseme_E', 'ы':'viseme_E',
           'о':'viseme_O', 'ө':'viseme_O', 'у':'viseme_O', 'ү':'viseme_O', 'ю':'viseme_O', 'ё':'viseme_O',
           'м':'viseme_M', 'б':'viseme_M', 'п':'viseme_M'}
for cue in cues:
    text = [ch for ch in cue['text'].lower() if ch.isalpha()]
    assert text
    step = (cue['end']-cue['start'])/len(text)
    for name in ['viseme_A', 'viseme_E', 'viseme_O', 'viseme_M']:
        add(name, cue['start'], 0)
        add(name, cue['end'], 0)
    for index, char in enumerate(text):
        if char not in visemes:
            continue
        center = cue['start'] + (index+.5)*step
        width = min(.075, step*.42)
        add(visemes[char], center-width, 0)
        add(visemes[char], center, .62)
        add(visemes[char], center+width, 0)
# Restrained temporary expression and separate blink tests.
for time, value in [(0,0),(6.2,0),(7,.28),(12.8,.22),(14,0),(17,.18),(20.8,.27),(22.15,.42),(23.3,.28),(27.8,.12),(28.5,0),(30,0)]:
    add('frown', time, value)
for center in [5.5, 8.9, 13.8, 18.4, 22.15, 26.3]:
    add('blink', center-.09, 0)
    add('blink', center, .8)
    add('blink', center+.11, 0)
for name in names:
    key = keys.key_blocks['EXP.' + name]
    for time, value in sorted(events[name].items()):
        key.value = value
        key.keyframe_insert('value', frame=time*24)
slot = keys.animation_data.action_slot
bag = action.layers[0].strips[0].channelbag(slot)
for curve in bag.fcurves:
    for point in curve.keyframe_points:
        point.interpolation = 'LINEAR'
face_parts = []
for obj in collection.objects:
    if obj.type != 'MESH' or obj == body or not obj.data.shape_keys:
        continue
    other = obj.data.shape_keys
    if not all('EXP.' + name in other.key_blocks for name in names):
        continue
    other.animation_data_create()
    other.animation_data.action = action
    other.animation_data.action_slot = slot
    face_parts.append(obj.name)
assert {'Eyebrows', 'Teeth', 'Tongue'}.issubset(face_parts)
# Keep the technical clip available in export without mixing it into the shot.
for obj in [body, *(bpy.data.objects[name] for name in face_parts)]:
    animation = obj.data.shape_keys.animation_data
    track = animation.nla_tracks.new()
    track.name = 'Talk_Check'
    strip = track.strips.new('Talk_Check', 1, talk_action)
    strip.action_slot = talk_slot
    track.mute = True
for name in names:
    keys.key_blocks['EXP.' + name].value = 0
bpy.context.scene.frame_set(0)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(output / 'Character-Master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig, *(item for item in collection.objects if item.type == 'MESH')]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(output / 'character.glb'), use_selection=True, export_format='GLB',
                          export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
                          export_frame_range=False, export_extras=True, export_apply=True, export_morph=True)
(output / 'dialogue-cues.json').write_text(json.dumps({'status': 'text-timed blocking; no voice sync', 'cues': cues}, ensure_ascii=False, indent=2) + '\n')
print('DIALOGUE_FACE_PROBE_OK', len(cues), len(face_parts), flush=True)
