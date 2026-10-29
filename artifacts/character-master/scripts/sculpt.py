"""Sculpt layers on the complete MakeHuman topology, saved as .target files the DNA builder can load.

A layer is the difference between a SCULPT shape key and the SCULPT.REST key (the character's shape
when the layer was started), so it adds cleanly on top of the identity sliders and other layers.

    blender -b --factory-startup --python sculpt.py -- prepare <built actor dir> <work .blend>
    blender -b --factory-startup --python sculpt.py -- export <work .blend> <layer name>

In a live Blender session, import this module and call prepare()/export() or the region operations.
Work files belong in artifacts/character-master/work/sculpt/, never inside a generated actor folder.
"""
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.kdtree import KDTree

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
SCULPT = HERE.parent / 'sculpt'


_SERVICES = {}


def services():
    """MPFB registers its Blender classes once per session; reuse the loaded services."""
    if not _SERVICES:
        from build_character import load_mpfb
        _SERVICES.update(load_mpfb())
    return _SERVICES


def source_body():
    return next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))


def prepare(body=None):
    """Freeze the current mix as SCULPT.REST and start an empty SCULPT layer on top of it."""
    body = body or source_body()
    keys = body.data.shape_keys.key_blocks
    for name in ['SCULPT', 'SCULPT.REST']:
        if name in keys:
            body.shape_key_remove(keys[name])
    for key in body.data.shape_keys.key_blocks:
        key.mute = False
    rest = body.shape_key_add(name='SCULPT.REST', from_mix=True)
    rest.value = 0
    sculpt = body.shape_key_add(name='SCULPT', from_mix=True)
    sculpt.relative_key = rest
    sculpt.value = 1
    body.active_shape_key_index = len(body.data.shape_keys.key_blocks) - 1
    return sculpt


def layer(body=None):
    body = body or source_body()
    return body.data.shape_keys.key_blocks['SCULPT']


def rest_points(body=None):
    body = body or source_body()
    return [v.co.copy() for v in body.data.shape_keys.key_blocks['SCULPT.REST'].data]


def landmark(name, body=None):
    """Rest-space position of a rig bone head (eye.L, jaw, head, ...), in the body's local space."""
    body = body or source_body()
    rig = body.find_armature() or next(o for o in bpy.data.objects if o.type == 'ARMATURE' and o.name.startswith('SOURCE.Rig'))
    world = rig.matrix_world @ rig.data.bones[name].head_local
    return body.matrix_world.inverted() @ world


def falloff(distance, radius):
    t = max(0.0, 1.0 - distance / radius)
    return t * t * (3 - 2 * t)


def push(center, radius, offset, *, mirror=False, front_only=True, body=None):
    """Move a soft region by `offset` (local units). `mirror` repeats it on the other side of x=0."""
    body = body or source_body()
    key = layer(body)
    rest = rest_points(body)
    centers = [(Vector(center), Vector(offset))]
    if mirror:
        centers.append((Vector((-center[0], center[1], center[2])), Vector((-offset[0], offset[1], offset[2]))))
    for index, point in enumerate(rest):
        for c, o in centers:
            d = (point - c).length
            if d < radius and (not front_only or point.y <= c.y + radius * .5):
                key.data[index].co += o * falloff(d, radius)


def inflate(center, radius, amount, *, mirror=False, body=None):
    """Move a soft region along its surface normals (positive = fuller, negative = hollower)."""
    body = body or source_body()
    key = layer(body)
    rest = rest_points(body)
    normals = [v.normal.copy() for v in body.data.vertices]
    centers = [Vector(center)] + ([Vector((-center[0], center[1], center[2]))] if mirror else [])
    for index, point in enumerate(rest):
        for c in centers:
            d = (point - c).length
            if d < radius:
                key.data[index].co += normals[index] * amount * falloff(d, radius)


def smooth(center, radius, strength=.5, iterations=2, *, mirror=False, body=None):
    """Relax the layer's surface in a region; removes lumps left by scripted pushes."""
    body = body or source_body()
    key = layer(body)
    neighbors = [[] for _ in body.data.vertices]
    for edge in body.data.edges:
        a, b = edge.vertices
        neighbors[a].append(b)
        neighbors[b].append(a)
    rest = rest_points(body)
    centers = [Vector(center)] + ([Vector((-center[0], center[1], center[2]))] if mirror else [])
    chosen = [i for i, p in enumerate(rest) if any((p - c).length < radius for c in centers)]
    for _ in range(iterations):
        current = [v.co.copy() for v in key.data]
        for i in chosen:
            if not neighbors[i]:
                continue
            average = sum((current[j] for j in neighbors[i]), Vector()) / len(neighbors[i])
            weight = strength * max(falloff((rest[i] - c).length, radius) for c in centers)
            key.data[i].co = current[i].lerp(average, weight)


def add_target(path, weight, body=None):
    """Bake an upstream MakeHuman target (e.g. 'nose/nose-scale-depth-incr') into the sculpt layer."""
    from build_character import LIBRARY
    body = body or source_body()
    temporary = services()['TargetService'].load_target(body, str(LIBRARY / 'data/targets' / (path + '.target.gz')), weight=1, name='SCULPT.TMP')
    basis = body.data.shape_keys.key_blocks[0]
    key = layer(body)
    for index, point in enumerate(temporary.data):
        key.data[index].co += (point.co - basis.data[index].co) * weight
    body.shape_key_remove(temporary)


def export(name, body=None):
    """Write SCULPT - SCULPT.REST as artifacts/character-master/sculpt/<name>.target."""
    target_service = services()['TargetService']
    body = body or source_body()
    info = target_service.get_shape_key_as_dict(body, 'SCULPT')
    SCULPT.mkdir(exist_ok=True)
    path = SCULPT / (name + '.target')
    # MPFB's writer rounds to 3 decimals (1 mm here), which steps subtle sculpts. Same MakeHuman
    # axis convention (x, z, -y), written at 0.01 mm.
    lines = [f'{i} {x:.5f} {z:.5f} {-y:.5f}' for i, x, y, z in info['vertices']]
    path.write_text(f'# sculpt layer {name}; MakeHuman target over the complete source topology\n' + '\n'.join(lines) + '\n')
    return {'path': str(path), 'vertices': len(info['vertices'])}


if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 1:]
    if args[0] == 'prepare':
        bpy.ops.wm.open_mainfile(filepath=str(Path(args[1]) / 'Character-Master.blend'))
        prepare()
        Path(args[2]).parent.mkdir(parents=True, exist_ok=True)
        bpy.ops.wm.save_as_mainfile(filepath=str(Path(args[2]).resolve()))
        print('SCULPT_PREPARED', args[2], flush=True)
    elif args[0] == 'export':
        bpy.ops.wm.open_mainfile(filepath=str(Path(args[1]).resolve()))
        print('SCULPT_EXPORTED', export(args[2]), flush=True)
    else:
        raise SystemExit('usage: prepare <actor dir> <work.blend> | export <work.blend> <layer>')
