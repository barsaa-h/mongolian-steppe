"""Render a built character in the story's lighting and assemble a review sheet beside its reference.

    blender -b --factory-startup --python lookdev.py -- <built actor dir> <sheet.png> [reference id]

Panels: reference photo | studio front | studio profile | party tungsten | café fluorescent | night cab.
Characters are judged in the light they will be seen in, not only in the neutral studio light.
"""
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
REFERENCES = ROOT / 'references'
SIZE = (640, 800)


def rest_pose(rig):
    """The saved build keeps the Deformation_Check clip and talk test on the rig and face."""
    for obj in [rig] + [o for o in bpy.data.objects if o.type == 'MESH' and o.data.shape_keys]:
        data = obj.data.shape_keys if obj.type == 'MESH' else obj
        if data.animation_data:
            data.animation_data.action = None
    for bone in rig.pose.bones:
        bone.matrix_basis.identity()
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and obj.data.shape_keys:
            for key in obj.data.shape_keys.key_blocks[1:]:
                if key.name.startswith('EXP.'):
                    key.value = 0


def light(name, kind, energy, color, location, target, size=.5):
    data = bpy.data.lights.new(name, kind)
    data.energy, data.color = energy, color
    if kind == 'AREA':
        data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - Vector(location)).to_track_quat('-Z', 'Y').to_euler()
    obj['lookdev'] = True
    return obj


def setup(name, head):
    scene = bpy.context.scene
    for obj in list(bpy.data.objects):
        if obj.get('lookdev'):
            bpy.data.objects.remove(obj, do_unlink=True)
    studio = name == 'studio'
    for obj in bpy.data.objects:
        if obj.type == 'LIGHT' and not obj.get('lookdev'):
            obj.hide_render = not studio
    world = scene.world or bpy.data.worlds.new('World')
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get('Background')
    h = Vector(head)
    if name == 'party':
        # Bare ceiling bulb in a crowded concrete flat; warm, a little from above and to the side.
        light('Party bulb', 'POINT', 60, (1, .72, .45), h + Vector((.6, -.9, 1.1)), h)
        light('Party bounce', 'AREA', 25, (1, .8, .6), h + Vector((-1, -.6, -.2)), h, 1.5)
        background.inputs[0].default_value, background.inputs[1].default_value = (.08, .05, .03, 1), .25
    elif name == 'cafe':
        # Overhead fluorescent tube, cool-green, flat and unflattering.
        light('Cafe tube', 'AREA', 90, (.85, 1, .9), h + Vector((0, -.5, 1.2)), h, 1.2)
        light('Cafe window', 'AREA', 20, (.8, .85, 1), h + Vector((-1.2, -.3, .2)), h, 1)
        background.inputs[0].default_value, background.inputs[1].default_value = (.06, .07, .06, 1), .3
    elif name == 'cab':
        # Night truck cab: faint moonlight through the side window, warm dashboard glow from below.
        light('Cab moon', 'AREA', 12, (.55, .65, 1), h + Vector((1.1, -.2, .5)), h, .8)
        light('Cab dash', 'AREA', 6, (1, .6, .3), h + Vector((0, -.5, -.45)), h, .4)
        background.inputs[0].default_value, background.inputs[1].default_value = (.01, .012, .02, 1), .1
    else:
        background.inputs[0].default_value, background.inputs[1].default_value = (.05, .055, .06, 1), 1


def render(path, head, angle, distance=.62):
    scene = bpy.context.scene
    camera = scene.camera
    camera.data.type, camera.data.lens = 'PERSP', 85
    target = Vector(head)
    camera.location = target + Vector((math.sin(angle) * distance, -math.cos(angle) * distance, 0))
    camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def main(folder, sheet, reference_id=None):
    folder, sheet = Path(folder), Path(sheet)
    bpy.ops.wm.open_mainfile(filepath=str(folder / 'Character-Master.blend'))
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x, scene.render.resolution_y = SIZE
    scene.view_settings.view_transform = 'AgX'
    rig = bpy.data.objects['Character.Rig']
    rest_pose(rig)
    left = rig.matrix_world @ rig.data.bones['eye.L'].head_local
    right = rig.matrix_world @ rig.data.bones['eye.R'].head_local
    head = (left + right) / 2 + Vector((0, .03, -.035))
    work = sheet.parent / (sheet.stem + '-panels')
    work.mkdir(parents=True, exist_ok=True)
    panels = []
    for name, angle in [('studio', 0), ('studio', math.pi / 2), ('party', .55), ('cafe', .55), ('cab', .7)]:
        setup(name, head)
        path = work / f'{name}-{len(panels)}.png'
        render(path, head, angle)
        panels.append((name if angle != math.pi / 2 else 'profile', path))
    compose(sheet, panels, reference_id or rig.get('cast_id') or folder.name)


def compose(sheet, panels, reference_id):
    from PIL import Image, ImageDraw
    width, height = SIZE
    reference = next(iter(sorted((REFERENCES / reference_id).glob('*.*'))), None) if (REFERENCES / reference_id).is_dir() else None
    columns = ([('reference', reference)] if reference else []) + panels
    out = Image.new('RGB', (width * len(columns), height + 40), (20, 22, 25))
    draw = ImageDraw.Draw(out)
    for index, (label, path) in enumerate(columns):
        image = Image.open(path).convert('RGB')
        if label == 'reference':
            scale = height / image.height
            image = image.resize((int(image.width * scale), height))
            left = max(0, (image.width - width) // 2)
            image = image.crop((left, 0, left + width, height))
        out.paste(image, (index * width, 40))
        draw.text((index * width + 12, 12), label, fill=(235, 235, 235))
    out.save(sheet)
    print('LOOKDEV_SHEET', sheet, flush=True)


if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 1:]
    main(*args)
