"""Read-only master audit. Run: blender -b MASTER.blend -P scripts/verify_project.py.

Only QA_Report.json and QA_Report.md are written; the loaded .blend is never saved.
"""
import datetime
import hashlib
import json
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
import face
import body_rig

source = Path(bpy.data.filepath)
digest = hashlib.sha256(source.read_bytes()).hexdigest()
scene = bpy.data.scenes['PS2 | Character Master']
bpy.context.window.scene = scene
rig = scene.objects['PS2 | Character Rig']
ctl = scene.objects['PS2 | FACE_CONTROLS']
head = scene.objects['PS2 | Head · facial loops']
clean = bpy.data.collections['PS2 | Clean Character']
meshes = [o for o in clean.all_objects if o.type == 'MESH' and o.name != 'Rig_Control_Shape']
horror = bpy.data.collections.get('PS2 | Horror Variants')
horror_meshes = [o for o in horror.all_objects if o.type == 'MESH'] if horror else []
horror_ctl = scene.objects.get('PS2 | HORROR_CONTROLS')
saved_horror_values = {k: horror_ctl[k] for k in horror_ctl.keys()
                       if isinstance(horror_ctl[k], (float, int))} if horror_ctl else {}
checks = []
report = {'source': str(source), 'source_sha256': digest,
          'checked_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'scene': scene.name, 'checks': checks}


def check(name, passed, details, severity='error'):
    checks.append({'name': name, 'passed': bool(passed), 'severity': severity, 'details': details})


def bounds(coords):
    return {'min': [min(v[a] for v in coords) for a in range(3)],
            'max': [max(v[a] for v in coords) for a in range(3)]}


def update():
    ctl.update_tag()
    rig.update_tag()
    bpy.context.view_layer.update()


def reset():
    for name in face.CONTROL_NAMES:
        ctl[name] = 0.0
    update()


def geometry(objects):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    result = {}
    for obj in objects:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        result[obj.name] = [evaluated.matrix_world @ v.co for v in mesh.vertices]
        evaluated.to_mesh_clear()
    return result


def max_delta(a, b):
    return max(((v - w).length for name in a for v, w in zip(a[name], b[name])), default=0.0)


def finite(coords):
    return all(math.isfinite(c) for points in coords.values() for v in points for c in v)


# Isolate live controls from any later delivered animation, in memory only.
for owner in [rig, ctl] + [o.data.shape_keys for o in meshes if o.data.shape_keys]:
    if owner.animation_data:
        owner.animation_data.action = None
        for track in owner.animation_data.nla_tracks:
            track.mute = True
body_rig.reset_pose(rig)
reset()

actual_controls = sorted(k for k in ctl.keys() if isinstance(ctl[k], (float, int)))
check('20 expected face controls', set(actual_controls) == set(face.CONTROL_NAMES), actual_controls)
keys = head.data.shape_keys.key_blocks
check('23 head blocks including basis and four correctives', len(keys) == 23,
      {'count': len(keys), 'names': list(keys.keys()), 'vertices': len(head.data.vertices)})
check('89-bone character rig', len(rig.data.bones) == 89, len(rig.data.bones))
subdivisions = [(o.name, m.name) for o in meshes for m in o.modifiers if m.type == 'SUBSURF']
check('no character Subdivision modifiers', not subdivisions, subdivisions)

triangles = 0
for obj in meshes:
    obj.data.calc_loop_triangles()
    triangles += len(obj.data.loop_triangles)
report['character'] = {'mesh_objects': len(meshes), 'triangles': triangles,
                       'vertices': sum(len(o.data.vertices) for o in meshes)}
check('suggested 6000–12000 triangle budget', 6000 <= triangles <= 12000, triangles, 'advisory')

used_images = {}
for obj in meshes + horror_meshes:
    for mat in obj.data.materials:
        if mat and mat.use_nodes:
            for node in mat.node_tree.nodes:
                if node.type == 'TEX_IMAGE' and node.image:
                    im = node.image
                    used_images[im.name] = {'size': list(im.size), 'packed': bool(im.packed_file),
                                           'path': im.filepath, 'has_data': im.has_data}
check('active character diffuse images are 512 px and loaded', bool(used_images) and all(
    d['size'] == [512, 512] and d['has_data'] for d in used_images.values()), used_images)
check('character images packed with valid paths', all(d['packed'] and
      Path(bpy.path.abspath(d['path'])).is_file() for d in used_images.values()), used_images)

binding_issues, weight_issues = [], []
deform = {b.name for b in rig.data.bones if b.use_deform}
for obj in meshes:
    bound = any(m.type == 'ARMATURE' and m.object == rig for m in obj.modifiers)
    bone_parent = obj.parent == rig and obj.parent_type == 'BONE'
    if not bound and not bone_parent:
        binding_issues.append({'object': obj.name, 'parent': obj.parent.name if obj.parent else None,
                               'parent_type': obj.parent_type, 'vertices': len(obj.data.vertices)})
    if bound:
        groups = {g.index for g in obj.vertex_groups if g.name in deform}
        sums = [sum(g.weight for g in v.groups if g.group in groups) for v in obj.data.vertices]
        bad = [i for i, s in enumerate(sums) if not math.isfinite(s) or abs(s - 1.0) > 1e-4]
        if bad:
            weight_issues.append({'object': obj.name, 'bad_count': len(bad), 'indices_sample': bad[:10],
                                  'min_sum': min(sums), 'max_sum': max(sums)})
check('every visible character mesh follows the rig', not binding_issues, binding_issues)
check('deform weights normalized within 0.0001', not weight_issues, weight_issues)

baseline = geometry(meshes)
allcoords = [v for points in baseline.values() for v in points]
neutral_bounds = bounds(allcoords)
check('neutral coordinates finite and human-sized', finite(baseline) and
      max(neutral_bounds['max'][a] - neutral_bounds['min'][a] for a in range(3)) < 2.5 and
      all(abs(c) < 10 for v in allcoords for c in v), neutral_bounds)

face_meshes = [head, scene.objects['PS2 | neck'], scene.objects['PS2 | Subtle upper lash rims'],
               scene.objects['PS2 | Brow.L'], scene.objects['PS2 | Brow.R'],
               *[o for o in meshes if any(t in o.name for t in ('Eyeball.', 'Iris.', 'Pupil.', 'tooth', 'Tongue', 'Oral cavity'))]]
face_baseline = geometry(face_meshes)
tests = []
for name in face.CONTROL_NAMES:
    reset()
    ctl[name] = 1.0
    update()
    current = geometry(face_meshes)
    displacement = max_delta(current, face_baseline)
    tests.append({'control': name, 'value': 1.0, 'max_displacement_m': displacement,
                  'finite': finite(current), 'responds': displacement > 1e-7})
reset()
check('20 facial controls produce finite bounded motion', all(
    t['finite'] and t['responds'] and t['max_displacement_m'] < .05 for t in tests), tests)

signed_tests = []
for name in ('EyeWide', 'BrowTilt', 'GazeYaw', 'GazePitch'):
    reset()
    ctl[name] = -1.0
    update()
    current = geometry(face_meshes)
    signed_tests.append({'control': name, 'value': -1.0, 'finite': finite(current),
                         'max_displacement_m': max_delta(current, face_baseline)})
check('signed facial controls remain bounded', all(
    t['finite'] and t['max_displacement_m'] < .05 for t in signed_tests), signed_tests)

emotion_tests = []
for name, values in face.EMOTIONS.items():
    reset()
    for prop, value in values.items():
        ctl[prop] = float(value)
    update()
    current = geometry(face_meshes)
    emotion_tests.append({'pose': name, 'finite': finite(current),
                          'max_displacement_m': max_delta(current, face_baseline)})
check('10 emotion presets remain finite below 0.05 m', len(emotion_tests) == 10 and all(
    t['finite'] and t['max_displacement_m'] < .05 for t in emotion_tests), emotion_tests)

corrective_tests = []
basis = keys['Basis']
wide = keys['EyeWide']
for side, sign in (('L', 1), ('R', -1)):
    key = keys['Corrective_BlinkWide_' + side]
    moved = [i for i in range(len(basis.data)) if tuple(key.data[i].co) != tuple(basis.data[i].co)]
    # EyeWide is authored exclusively on eyelid loops, so its support is an exact persisted mask.
    outside = [i for i in moved if sign * basis.data[i].co.x <= 0 or
               tuple(wide.data[i].co) == tuple(basis.data[i].co)]
    off_eye_box = [i for i in moved if not (
        abs(basis.data[i].co.x - sign * .0344) < .025 and
        abs(basis.data[i].co.z - 1.684) < .018 and basis.data[i].co.y < -.025)]
    cancellation_error = max(((key.data[i].co - basis.data[i].co) +
                              (wide.data[i].co - basis.data[i].co)).length for i in moved)
    corrective_tests.append({'side': side, 'nonzero_vertices': len(moved),
        'outside_eyelid_vertices': len(outside), 'outside_eye_box': len(off_eye_box),
        'nonzero_basis_bounds': bounds([basis.data[i].co for i in moved]),
        'wide_cancellation_error_m': cancellation_error})
check('BlinkWide correctives have ZERO displacement outside eyelids', all(
    t['nonzero_vertices'] > 0 and t['outside_eyelid_vertices'] == 0 and t['outside_eye_box'] == 0 and
    t['wide_cancellation_error_m'] < 1e-7 for t in corrective_tests), corrective_tests)

reset()
ctl['Blink_L'] = ctl['Blink_R'] = 1.0
update()
blink = geometry([head, scene.objects['PS2 | Subtle upper lash rims']])
ctl['EyeWide'] = .75
update()
blink_wide = geometry([head, scene.objects['PS2 | Subtle upper lash rims']])
blink_error = max_delta(blink, blink_wide)
# One float32 ULP near the 1.684 m eyes is 1.19e-7 m; allow accumulated evaluation rounding.
check('full blink plus EyeWide 0.75 equals full blink within 0.000001 m', finite(blink_wide) and blink_error < 1e-6,
      {'max_difference_m': blink_error})
reset()
check('reset returns geometry to neutral', max_delta(geometry(face_meshes), face_baseline) < 1e-7,
      {'max_difference_m': max_delta(geometry(face_meshes), face_baseline)})

pose_tests = []
for name in ('walking', 'reach', 'crouch', 'kneel', 'sit', 'crawl', 'fall', 'limp', 'tool_grip', 'fear', 'exhaustion'):
    body_rig.set_pose(rig, name)
    update()
    coords = geometry(meshes)
    points = [v for values in coords.values() for v in values]
    pose_tests.append({'pose': name, 'finite': finite(coords), 'bounds': bounds(points),
                       'bounded': all(abs(c) < 10 for v in points for c in v)})
body_rig.reset_pose(rig)
reset()
check('11 body blocking presets remain finite and bounded', all(
    t['finite'] and t['bounded'] for t in pose_tests), pose_tests)

expected_actions = {'PS2_Face_' + n.replace(' ', '_') for n in face.EMOTIONS} | {
    'PS2_' + n for n in ('FullBody_Test', 'WalkLoop', 'RunLoop', 'Fall', 'Crawl', 'Combat',
                         'Zombie', 'Breathing_Shiver', 'Dialogue_Face', 'Dialogue_Body')}
actions = {}
for name in sorted(expected_actions):
    action = bpy.data.actions.get(name)
    curves = [c for layer in action.layers for strip in layer.strips
              for bag in strip.channelbags for c in bag.fcurves] if action else []
    points = [p for c in curves for p in c.keyframe_points]
    facial = name.startswith('PS2_Face_') or name == 'PS2_Dialogue_Face'
    owner = ctl if facial else rig
    invalid_paths = []
    for curve in curves:
        try:
            owner.path_resolve(curve.data_path)
        except Exception:
            invalid_paths.append(curve.data_path)
    expected_paths = {'["' + n + '"]' for n in face.CONTROL_NAMES} if facial else {
        'pose.bones["pelvis"].location', 'pose.bones["head"].rotation_euler'}
    actions[name] = {'asset': bool(action and action.asset_data), 'channels': len(curves),
                     'keyframes': len(points), 'finite': all(math.isfinite(x) for p in points for x in p.co),
                     'invalid_paths': invalid_paths,
                     'expected_paths_keyed': expected_paths <= {c.data_path for c in curves},
                     'range': list(action.frame_range) if action else None}
check('20 expected Action assets have finite keyed channels', len(expected_actions) == 20 and all(
    a['asset'] and a['channels'] > 0 and a['keyframes'] > 0 and a['finite'] and
    not a['invalid_paths'] and a['expected_paths_keyed'] for a in actions.values()), actions)

scene_checks = []
for name in ['PS2 | Character Master'] + ['PS2 | Light · ' + n for n in (
        'Cold Exterior', 'Overhead Interior', 'Dark Side', 'Restrained Warm')]:
    target = bpy.data.scenes.get(name)
    scene_checks.append({'scene': name, 'camera': target.camera.name if target and target.camera else None,
        'camera_in_scene': bool(target and target.camera and target.camera.name in target.objects),
        'resolution': [target.render.resolution_x, target.render.resolution_y, target.render.resolution_percentage] if target else None,
        'fps': target.render.fps / target.render.fps_base if target else None})
check('master and four lighting scenes have 720p cameras at 24fps', all(
    s['camera_in_scene'] and s['resolution'] == [1280, 720, 100] and s['fps'] == 24 for s in scene_checks), scene_checks)

expected_horror = {'Zombie', 'FaceBruise', 'FaceBlood', 'BodyDirt', 'TornSleeve', 'DetachWristL', 'WristSeparation'}
check('all seven horror controls saved at zero', set(saved_horror_values) == expected_horror and
      all(v == 0 for v in saved_horror_values.values()), saved_horror_values)
swap_checks = []
if horror_ctl:
    swaps = {
        'Zombie': (['PS2 | Zombie head variant'], ['PS2 | Head · facial loops']),
        'FaceBruise': (['PS2 | Face bruise decal'], []),
        'FaceBlood': (['PS2 | Face blood decal'], []),
        'BodyDirt': (['PS2 | Jacket dirt decal'], []),
        'TornSleeve': (['PS2 | Torn left sleeve variant', 'PS2 | Torn sleeve dark backing'], ['PS2 | jacket']),
        'DetachWristL': (['PS2 | Detachable left hand', 'PS2 | Detached left nails',
                         'PS2 | Left hand cut cap', 'PS2 | Left wrist cut cap'], ['Hand.L', 'Nails.L'])}
    for prop, (variant_names, clean_names) in swaps.items():
        variants = [scene.objects[n] for n in variant_names]
        originals = [scene.objects[n] for n in clean_names]
        zero_ok = all(o.hide_render and o.hide_viewport for o in variants) and all(
            not o.hide_render and not o.hide_viewport for o in originals)
        horror_ctl[prop] = 1.0
        horror_ctl.update_tag()
        update()
        enabled_ok = all(not o.hide_render and not o.hide_viewport for o in variants) and all(
            o.hide_render and o.hide_viewport for o in originals)
        swap_checks.append({'switch': prop, 'baseline': zero_ok, 'enabled': enabled_ok})
        horror_ctl[prop] = 0.0
        horror_ctl.update_tag()
        update()
    for prop in expected_horror:
        horror_ctl[prop] = 1.0
    horror_ctl.update_tag()
    update()
    variant_coords = geometry(horror_meshes)
    detached = scene.objects['PS2 | Detachable left hand']
    check('enabled horror variants finite with working wrist separation', finite(variant_coords) and
          abs(detached.location.x - .18) < 1e-6 and abs(detached.location.z + .10) < 1e-6,
          {'finite': finite(variant_coords), 'detached_location': list(detached.location)})
    for prop in expected_horror:
        horror_ctl[prop] = 0.0
    horror_ctl.update_tag()
    update()
check('horror visibility swaps work in render and viewport', len(swap_checks) == 6 and all(
    s['baseline'] and s['enabled'] for s in swap_checks), swap_checks)

clip_samples = []
for name in ('Dialogue', 'FullBody_Test'):
    reset()
    body_rig.reset_pose(rig)
    rig.animation_data.action = bpy.data.actions['PS2_Dialogue_Body' if name == 'Dialogue' else 'PS2_FullBody_Test']
    ctl.animation_data.action = bpy.data.actions['PS2_Dialogue_Face'] if name == 'Dialogue' else None
    first = None
    for frame in (1, 12, 24, 25, 26, 48, 64, 68, 80, 96):
        scene.frame_set(frame)
        update()
        coords = geometry(meshes)
        if first is None:
            first = coords
        points = [v for values in coords.values() for v in values]
        clip_samples.append({'clip': name, 'frame': frame, 'finite': finite(coords),
            'bounded': all(abs(c) < 10 for v in points for c in v),
            'motion_from_frame_1_m': max_delta(coords, first), 'bounds': bounds(points)})
    rig.animation_data.action = None
    ctl.animation_data.action = None
check('saved dialogue and full-body clips evaluate finite with motion', all(
    s['finite'] and s['bounded'] for s in clip_samples) and all(any(
    s['clip'] == name and s['motion_from_frame_1_m'] > .001 for s in clip_samples)
    for name in ('Dialogue', 'FullBody_Test')), clip_samples)
body_rig.reset_pose(rig)
reset()
scene.frame_set(1)

driver_issues, driver_count = [], 0
for owner in list(scene.objects) + [o.data.shape_keys for o in meshes + horror_meshes if o.data.shape_keys]:
    if not owner.animation_data:
        continue
    for curve in owner.animation_data.drivers:
        driver_count += 1
        reasons = []
        if not curve.driver.is_valid:
            reasons.append('driver.is_valid is false')
        for variable in curve.driver.variables:
            for target in variable.targets:
                if target.id is None:
                    reasons.append('missing target ID')
                elif variable.type == 'SINGLE_PROP':
                    try:
                        target.id.path_resolve(target.data_path)
                    except Exception as exc:
                        reasons.append(str(exc))
                elif variable.type == 'TRANSFORMS' and target.bone_target and (
                    target.id.type != 'ARMATURE' or target.bone_target not in target.id.pose.bones):
                    reasons.append('missing transform bone')
        if reasons:
            driver_issues.append({'owner': owner.name, 'path': curve.data_path, 'reasons': reasons})
check('drivers valid with resolvable targets', not driver_issues,
      {'count': driver_count, 'issues': driver_issues})

check('source .blend unchanged', hashlib.sha256(source.read_bytes()).hexdigest() == digest, digest)
report['passed'] = all(c['passed'] or c['severity'] == 'advisory' for c in checks)
report['pending_delivery_work'] = [
    'Saved dialogue and full-body clips were sampled numerically. Rendered-frame review is recorded separately in Delivery_Acceptance.md; encoded-video checks are in Delivery_Manifest.json.',
    'Horror controls and swaps were tested numerically; rendered horror review is recorded in Delivery_Acceptance.md. No engine export is claimed.',
    'Bounded meshes do not prove every combined pose is collision-free. Extreme underarm deformation and shot-specific contacts still need animator polish.',
    'The raw body_rig.set_pose helper presets are not ground-corrected: crouch, kneel, sit, crawl and fall extend below Z=0. These helpers are separate from the saved Action assets; sampled FullBody_Test geometry stays above Z=0.']
report['visual_review'] = {
    'reviewed': ['Expressions/Neutral_720p.png', 'Comparisons/After_ThreeQuarter.png',
                 'Comparisons/Hair_Coverage_QA.png', 'Expressions/Shock_Clearance_QA.png'],
    'preview_mtimes_utc': {name: datetime.datetime.fromtimestamp((ROOT / name).stat().st_mtime, datetime.timezone.utc).isoformat()
                          for name in ['Expressions/Neutral_720p.png', 'Comparisons/After_ThreeQuarter.png',
                                       'Comparisons/Hair_Coverage_QA.png', 'Expressions/Shock_Clearance_QA.png']},
    'notes': [
        'The previews show a recognizable ordinary man in the green jacket, white collar, trousers and boots, with a restrained low-poly silhouette and diffuse shading.',
        'The rebuilt face has distinct nose, lips, eyelids and small human-proportioned eyes; it avoids photorealistic pores and modern glossy PBR skin.',
        'In the reviewed previews the neutral face reads somewhat mannequin-like: broad smooth cheek planes, straight dark brows, sparse painted facial variation and clean symmetry reduce the psychological-horror characterfulness.',
        'The hair has directional angular clumps, but its crown mass remains quite chunky; the large flat white collar also pulls attention from the face.',
        'Hair_Coverage_QA.png confirms the formerly visible light scalp gap near the right crown is closed in the tested three-quarter view.',
        'Shock_Clearance_QA.png shows a smooth chin-to-neck boundary during the tested open-jaw shock pose, with no earlier scalloped intersection visible. This frame does not establish every possible combined pose is collision-free.',
        'These current stills establish a suitable retro direction, not a full artistic match to the brief. Rendered animation acceptance is separate.']}
(ROOT / 'QA_Report.json').write_text(json.dumps(report, indent=2))
lines = ['# Character QA report', '', f'Source: `{source.name}`',
         f'Checked: {report["checked_utc"]}', f'SHA-256: `{digest}`', '',
         'The source .blend was opened in a fresh background process and never saved.', '',
         '## Structural and functional checks', '']
for entry in checks:
    status = 'PASS' if entry['passed'] else ('ADVISORY' if entry['severity'] == 'advisory' else 'FAIL')
    lines.append(f'- {status}: {entry["name"]}.')
lines += ['', f'Character: {len(meshes)} meshes, {report["character"]["vertices"]} vertices, {triangles} triangles.',
          f'Drivers checked: {driver_count}. Maximum full-blink/wide difference: {blink_error:.9g} m.', '',
          '## Issues', '']
for entry in checks:
    if not entry['passed']:
        lines.append(f'- {entry["name"]}: `{json.dumps(entry["details"])}`')
lines += ['', '## Preview art review', ''] + ['- ' + n for n in report['visual_review']['notes']]
lines += ['', '## Pending and limits', ''] + ['- ' + n for n in report['pending_delivery_work']]
lines += ['', 'Full per-control, preset, weight and corrective measurements are in QA_Report.json.', '']
(ROOT / 'QA_Report.md').write_text('\n'.join(lines))
print('QA_RESULT=' + json.dumps({'passed': report['passed'], 'failed': [c['name'] for c in checks if not c['passed'] and c['severity'] == 'error'],
                               'advisories': [c['name'] for c in checks if not c['passed'] and c['severity'] == 'advisory'],
                               'triangles': triangles, 'drivers': driver_count, 'report': str(ROOT / 'QA_Report.json')}))
if not report['passed']:
    raise SystemExit(1)
