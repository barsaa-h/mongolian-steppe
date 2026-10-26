"""Inspect saved masters in background Blender; refresh their embedded agent guide."""
import json
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
results = []
for name in ['default', 'male', 'heavy', 'slim-tall', 'child']:
    folder = ROOT / name
    bpy.ops.wm.open_mainfile(filepath=str(folder / 'Character-Master.blend'))
    bpy.context.preferences.filepaths.save_version = 0
    source = next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))
    assert len(source.data.vertices) == 19158
    assert len(source.data.shape_keys.key_blocks) > 1
    source_collection = next(c for c in bpy.data.collections if c.name.startswith('AUTHORING'))
    assert source_collection.hide_render and source_collection.hide_viewport
    rig = bpy.data.objects['Character.Rig']
    assert len(rig.data.bones) == 137
    assert sum(b.name.startswith('finger') for b in rig.data.bones) == 30
    visible = next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
    roles = {o.get('role') for o in visible.objects if o.type == 'MESH'}
    assert {'Hands.L', 'Hands.R', 'Clothes.Top', 'Clothes.Bottom', 'Body'} <= roles
    images = [i for i in bpy.data.images if i.source == 'FILE' and i.users > 0]
    assert images and all(i.packed_file for i in images), 'External texture dependency'
    assert not any('lisa' in i.name.lower() for i in images)
    scene = bpy.context.scene
    for frame in [1, 25, 49]:
        scene.frame_set(frame)
        depsgraph = bpy.context.evaluated_depsgraph_get()
        for obj in visible.objects:
            if obj.type != 'MESH':
                continue
            evaluated = obj.evaluated_get(depsgraph)
            mesh = evaluated.to_mesh()
            assert all(all(__import__('math').isfinite(v) for v in vertex.co) for vertex in mesh.vertices)
            evaluated.to_mesh_clear()
    scene.frame_set(1)
    guide = bpy.data.texts.get('AGENT_README') or bpy.data.texts.new('AGENT_README')
    guide.clear()
    guide.write((ROOT / 'README.md').read_text())
    bpy.ops.wm.save_as_mainfile(filepath=str(folder / 'Character-Master.blend'))
    results.append({'id': name, 'sourceVertices': len(source.data.vertices), 'sourceShapeKeys': len(source.data.shape_keys.key_blocks), 'bones': len(rig.data.bones), 'packedImages': len(images), 'posesChecked': [1,25,49], 'roles': sorted(roles)})
    if name == 'default':
        camera = scene.camera
        hand = rig.matrix_world @ rig.data.bones['wrist.L'].head_local
        hand += Vector((.025, 0, -.045))
        camera.data.ortho_scale = .29
        camera.location = hand + Vector((.10, -.7, .10))
        camera.rotation_euler = (hand-camera.location).to_track_quat('-Z', 'Y').to_euler()
        scene.render.resolution_x = scene.render.resolution_y = 900
        scene.render.filepath = str(folder / 'hand.png')
        bpy.ops.render.render(write_still=True)
        scene.frame_set(25)
        scene.render.filepath = str(folder / 'hand-bend.png')
        bpy.ops.render.render(write_still=True)
(ROOT / 'native-report.json').write_text(json.dumps({'passed': True, 'blenderVersion': bpy.app.version_string, 'results': results}, indent=2) + '\n')
print('NATIVE_CHECK_OK', json.dumps(results), flush=True)
