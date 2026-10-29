# Blender map studio: import exported set GLBs, organize/lint, round-trip,
# and author quality enhancements. Run inside Blender 5.2:
#   blender --background --factory-startup --python scripts/map-studio.py -- <cmd> ...
# Commands:
#   import-base <sceneId>              import assets/maps/glb/base/<id>.glb -> BASE collection, save blend
#   roundtrip <sceneId>                export the BASE collection straight back (round-trip proof)
#   lint <sceneId>                     triangle budgets per tier (HERO/MID/BG by name table)
#   pilot <sceneId>                    ep7 pilot: soot + crack decals + trash authored on top
#   library <outDir>                   author the detail library pieces as GLBs
import bpy
import sys
import math
import random
import os
import numpy as np
import mathutils

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
cmd = argv[0] if argv else "help"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BUDGETS = {"HERO": 3000, "MID": 800, "BG": 200}
# Name prefixes that carry the HERO tier in each set (close-shot pieces).
HERO_NAMES = ("boiler", "firebox", "pipe", "door", "nursery", "cot", "tub", "desk",
              "sandbag", "windshield", "counter", "cake", "lantern", "hatch")


def scene_tris(objs):
    return sum(len(o.data.polygons) for o in objs if o.type == "MESH" and o.data)


def collection(name):
    coll = bpy.data.collections.get(name)
    if not coll:
        coll = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(coll)
    return coll


def move_to(objs, coll):
    for o in objs:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        coll.objects.link(o)


def do_import_base():
    scene_id = argv[1]
    path = os.path.join(ROOT, "assets", "maps", "glb", "base", f"{scene_id}.glb")
    pre = {o.name for o in bpy.context.scene.objects}  # factory startup Cube/Light/Camera
    bpy.ops.import_scene.gltf(filepath=path)
    for name in pre:
        obj = bpy.data.objects.get(name)
        if obj:
            bpy.data.objects.remove(obj, do_unlink=True)
    move_to([o for o in bpy.context.scene.objects if o.type in ("MESH", "EMPTY")], collection("BASE"))
    tris = scene_tris(bpy.data.collections["BASE"].objects)
    print(f"IMPORTED {scene_id}: {len(bpy.data.collections['BASE'].objects)} objects, {tris} tris")
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "assets", "maps", f"{scene_id}.blend"))


def open_set(scene_id):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT, "assets", "maps", f"{scene_id}.blend"))
    return bpy.data.collections.get("BASE")


def do_roundtrip():
    scene_id = argv[1]
    coll = open_set(scene_id)
    out = os.path.join(ROOT, "assets", "maps", "glb", "authored", f"{scene_id}.glb")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in coll.objects:
        o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, use_selection=True, export_format="GLB")
    print(f"ROUNDTRIP {scene_id} -> {out}")


def do_lint():
    scene_id = argv[1]
    coll = open_set(scene_id)
    violations = []
    for o in coll.objects:
        if o.type != "MESH":
            continue
        tris = len(o.data.polygons)
        tier = "HERO" if any(o.name.lower().startswith(n) for n in HERO_NAMES) else "MID"
        limit = BUDGETS[tier]
        if tris > limit:
            violations.append(f"{o.name}: {tris} tris > {tier} {limit}")
    print("LINT", scene_id, "OK" if not violations else "VIOLATIONS:")
    for v in violations:
        print("  -", v)


def make_image(name, size, painter):
    img = bpy.data.images.get(name) or bpy.data.images.new(name, size, size, alpha=True)
    px = np.zeros((size, size, 4), dtype=np.float32)
    painter(px, size)
    img.pixels.foreach_set(px.ravel())
    img.filepath_raw = os.path.join(ROOT, "assets", "maps", "textures", f"{name}.png")
    os.makedirs(os.path.dirname(img.filepath_raw), exist_ok=True)
    img.file_format = "PNG"
    img.save()
    img.reload()
    return img


def paint_cracks(px, size):
    px[:, :, 3] = 0
    px[:, :, 0:3] = 0.09
    for _ in range(9):
        x, y = random.uniform(0, size), random.uniform(0, size)
        angle = random.uniform(0, math.tau)
        for _ in range(int(size * 0.5)):
            angle += random.uniform(-0.5, 0.5)
            x = (x + math.cos(angle) * 2) % size
            y = (y + math.sin(angle) * 2) % size
            w = random.uniform(0.8, 2.2)
            xi, yi = int(x), int(y)
            px[max(0, yi - 1):yi + 2, max(0, xi - 1):xi + 2, 3] = np.maximum(
                px[max(0, yi - 1):yi + 2, max(0, xi - 1):xi + 2, 3], 0.75)
            px[max(0, yi - 1):yi + 2, max(0, xi - 1):xi + 2, 0:3] = 0.07 + random.uniform(0, 0.05)
            void(w)


def void(_):
    pass


def paint_soot(px, size):
    px[:, :, 3] = 0
    px[:, :, 0:3] = 0.035
    for _ in range(30):
        cx, cy = random.uniform(0, size), random.uniform(0, size)
        r = random.uniform(size * 0.04, size * 0.16)
        yy, xx = np.mgrid[0:size, 0:size]
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        a = np.clip(1 - d / r, 0, 1) ** 1.6 * random.uniform(0.35, 0.8)
        px[:, :, 3] = np.minimum(1, px[:, :, 3] + a)


def decal(name, img, w, d, x, y, z, rot):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(-w / 2, -d / 2, 0), (w / 2, -d / 2, 0), (w / 2, d / 2, 0), (-w / 2, d / 2, 0)], [], [(0, 1, 2, 3)])
    mesh.update()
    uv = mesh.uv_layers.new()
    for i, loop in enumerate(uv.data):
        vx, vy = mesh.vertices[i].co.x, mesh.vertices[i].co.y
        loop.uv = ((vx + w / 2) / w, (vy + d / 2) / d)
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.blend_method = "BLEND"
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    shader = nt.nodes.new("ShaderNodeBsdfPrincipled")
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    nt.links.new(tex.outputs["Color"], shader.inputs["Base Color"])
    nt.links.new(tex.outputs["Alpha"], shader.inputs["Alpha"])
    nt.links.new(shader.outputs[0], out.inputs[0])
    mesh.materials.append(mat)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = (x, y, z)
    obj.rotation_euler = (0, 0, rot)
    return obj


def trash_bag(rand):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.16)
    obj = bpy.context.active_object
    for v in obj.data.vertices:
        v.co += v.normal * rand.uniform(-0.05, 0.06)
    for p in obj.data.polygons:
        p.use_smooth = True
    obj.scale = (1, 0.8, 0.62 + rand.uniform(0, 0.3))
    obj.rotation_euler = (rand.uniform(-0.2, 0.2), rand.uniform(-0.2, 0.2), rand.uniform(0, math.tau))
    return obj


def crushed_can(rand):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.13, vertices=10)
    obj = bpy.context.active_object
    for v in obj.data.vertices:
        if v.co.z > 0:
            v.co.x *= rand.uniform(0.6, 1.1)
            v.co.y *= rand.uniform(0.6, 1.1)
        v.co += v.normal * rand.uniform(-0.006, 0.006)
    for p in obj.data.polygons:
        p.use_smooth = True
    obj.rotation_euler = (math.pi / 2 + rand.uniform(-0.3, 0.3), 0, rand.uniform(0, math.tau))
    return obj


def do_library():
    out_dir = os.path.join(ROOT, "assets", "maps", "glb", "library")
    os.makedirs(out_dir, exist_ok=True)
    rand = random.Random(4102)
    pieces = {
        "trash-bag": lambda: trash_bag(rand),
        "crushed-can": lambda: crushed_can(rand),
    }
    for name, build in pieces.items():
        for o in list(bpy.data.objects):
            bpy.data.objects.remove(o, do_unlink=True)
        obj = build()
        obj.select_set(True)
        bpy.ops.export_scene.gltf(filepath=os.path.join(out_dir, f"{name}.glb"),
                                  use_selection=True, export_format="GLB")
        print(f"LIBRARY {name}: {len(obj.data.polygons)} tris")
    # Crack + soot textures for decal planes at runtime and in Blender.
    make_image("cracks", 256, paint_cracks)
    make_image("soot", 256, paint_soot)
    print("LIBRARY textures: cracks.png, soot.png")


# Per-set trash/crack scatter presets: (kind, x, y, z-rot) in set coordinates.
SCATTER = {
    "ep1-yard": [
        ("cracks", 2.5, 1.2, 0.4), ("cracks", -6.5, -2.0, 1.9), ("cracks", 9.5, -1.0, 2.8),
        ("bag", 9.0, -4.2, 0), ("bag", -11.0, 5.0, 0), ("bag", 4.0, 7.2, 0),
        ("can", 9.5, -3.8, 0), ("can", -10.6, 5.4, 0), ("can", 4.6, 6.9, 0),
        ("bag", -3.0, 8.0, 0), ("can", -2.4, 7.6, 0), ("bag", 12.2, 0.6, 0),
    ],
    "ep1-truckstop": [
        ("cracks", 6.0, -2.0, 0.3), ("cracks", 2.0, 0.2, 1.7), ("cracks", 9.0, -3.2, 2.6),
        ("bag", -5.0, -3.2, 0), ("bag", -2.0, -1.0, 0), ("can", -4.5, -2.8, 0),
        ("bag", 11.0, 3.2, 0), ("can", 10.4, 2.8, 0), ("bag", 8.4, -3.0, 0),
        ("can", 6.2, -0.6, 0),
    ],
    "ep2-nursery": [
        ("cracks", 0.2, 2.0, 0.5), ("cracks", -0.9, -6.0, 2.1), ("cracks", 3.2, -18.0, 1.2),
        ("bag", 1.6, 2.1, 0), ("can", 1.1, 2.3, 0), ("bag", -0.9, -6.6, 0),
    ],
    "ep3-governor": [
        ("cracks", 2.4, -5.0, 0.8), ("cracks", -6.0, -3.0, 2.2),
        ("bag", 5.6, -4.2, 0), ("can", 5.2, -3.8, 0),
    ],
    "ep4-school": [
        ("cracks", 0.2, -6.0, 0.6), ("cracks", -3.8, -14.0, 1.8), ("cracks", 6.0, -16.0, 2.5),
        ("bag", 1.4, -6.6, 0), ("can", 0.9, -6.9, 0), ("bag", -4.6, -12.4, 0),
    ],
    "ep5-cordon": [
        ("cracks", 0.0, 2.6, 0.4), ("cracks", -2.4, 4.0, 1.6), ("cracks", 3.2, -4.0, 2.4),
        ("bag", 1.8, 3.4, 0), ("bag", -3.4, 4.6, 0), ("can", 2.2, 3.0, 0),
        ("can", -2.9, 4.2, 0),
    ],
    "ep6-gorge": [
        ("cracks", 0.4, -6.0, 1.1), ("cracks", -2.2, -2.0, 2.3),
        ("bag", -2.6, -3.4, 0), ("can", -2.1, -3.0, 0),
    ],
    "ep9-cabin": [
        ("cracks", 0.0, 0.6, 0.7),
        ("can", 0.5, 0.62, 0),
    ],
    "ep1-apartment": [
        ("cracks", 0.4, 0.6, 0.9), ("cracks", 2.0, 1.2, 2.1),
        ("can", 2.6, 0.4, 0), ("can", -2.4, 1.6, 0), ("bag", 2.8, 1.9, 0),
    ],
    "ep10-dzud": [
        ("cracks", 2.2, -3.6, 1.3),
    ],
}

def do_scatter():
    scene_id = argv[1]
    coll = open_set(scene_id)
    enhance = collection("ENHANCE")
    rand = random.Random(hash(scene_id) & 0xffff)
    cracks = make_image("cracks", 256, paint_cracks)
    n = 0
    for kind, x, y, rot in SCATTER.get(scene_id, []):
        if kind == "cracks":
            obj = decal(f"cracks-{n}", cracks, 2.0, 1.5, x, y, 0.046 + n * 0.0004, rot)
            enhance.objects.link(obj)
            n += 1
        else:
            obj = trash_bag(rand) if kind == "bag" else crushed_can(rand)
            obj.location = (x, y, 0.12 if kind == "bag" else 0.055)
            enhance.objects.link(obj)
    out = os.path.join(ROOT, "assets", "maps", "glb", "authored", f"{scene_id}.glb")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in list(bpy.context.scene.objects):
        if o.type == "MESH":
            o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, use_selection=True, export_format="GLB")
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "assets", "maps", f"{scene_id}.blend"))
    print(f"SCATTER {scene_id}: {n + len([1 for k,_,_,_ in SCATTER.get(scene_id, []) if k != 'cracks'])} pieces -> {out}")


def do_enhance():
    scene_id = argv[1]
    coll = open_set(scene_id)
    enhance = collection("ENHANCE")
    dark = make_image("grounding", 64, paint_grounding)
    beveled = 0
    grounded = 0
    n = len(enhance.objects)
    for o in coll.objects:
        if o.type != "MESH":
            continue
        bevel = o.modifiers.new("bevel", "BEVEL")
        bevel.width = 0.012
        bevel.segments = 1
        bevel.limit_method = "ANGLE"
        bevel.angle_limit = math.radians(32)
        beveled += 1
        bb = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
        xs = [v.x for v in bb]
        ys = [v.y for v in bb]
        zs = [v.z for v in bb]
        w = max(xs) - min(xs)
        d = max(zs) - min(zs)
        h = max(ys) - min(ys)
        if min(ys) < 0.08 and 0.25 < w < 3.2 and 0.25 < d < 3.2 and h > 0.15 and w * d < 6:
            quad = decal(f"ground-{n}", dark, w * 1.18, d * 1.18,
                         (min(xs) + max(xs)) / 2, (min(zs) + max(zs)) / 2,
                         0.011 + n * 0.0003, 0)
            enhance.objects.link(quad)
            n += 1
            grounded += 1
    out = os.path.join(ROOT, "assets", "maps", "glb", "authored", f"{scene_id}.glb")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in list(bpy.context.scene.objects):
        if o.type == "MESH":
            o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, use_selection=True, export_format="GLB")
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "assets", "maps", f"{scene_id}.blend"))
    print(f"ENHANCE {scene_id}: {beveled} beveled, {grounded} grounded -> {out}")


def paint_grounding(px, size):
    px[:, :, 0:3] = 0.16
    yy, xx = np.mgrid[0:size, 0:size]
    d = np.sqrt((xx - size / 2) ** 2 + (yy - size / 2) ** 2) / (size / 2)
    px[:, :, 3] = np.clip(1 - d, 0, 1) ** 1.4 * 0.55


def do_pilot():
    scene_id = argv[1]
    bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT, "assets", "maps", f"{scene_id}.blend"))
    coll = collection("ENHANCE")
    rand = random.Random(7700)
    cracks = make_image("cracks", 256, paint_cracks)
    soot = make_image("soot", 256, paint_soot)

    # Soot decals on the boiler faces, floor crack decals, trash scatter.
    placements = [("soot", soot, 1.6, 1.4, -1.55, -0.83, 0.05, 0),
                  ("soot", soot, 1.2, 1.0, -1.0, -0.83, 0.05, 0.3),
                  ("cracks", cracks, 2.4, 1.8, 0.4, 0.6, 0.045, 0.4),
                  ("cracks", cracks, 1.8, 1.4, -1.8, 1.4, 0.045, 1.9),
                  ("cracks", cracks, 2.0, 1.5, 1.9, -1.2, 0.045, 2.8)]
    for name, img, w, d, x, y, z, rot in placements:
        coll.objects.link(decal(f"{name}-{len(coll.objects)}", img, w, d, x, y, z, rot))

    bag_spots = [(2.4, 2.3), (2.7, 1.9), (-2.3, 1.9), (0.1, 2.4)]
    for i, (x, y) in enumerate(bag_spots):
        bag = trash_bag(rand)
        bag.location = (x, y, 0.12)
        coll.objects.link(bag)
        if i % 2 == 0:
            can = crushed_can(rand)
            can.location = (x + rand.uniform(-0.4, 0.4), y + rand.uniform(-0.3, 0.3), 0.06)
            coll.objects.link(can)
            can2 = crushed_can(rand)
            can2.location = (x + rand.uniform(-0.5, 0.5), y + rand.uniform(-0.4, 0.3), 0.05)
            coll.objects.link(can2)

    # Bevel the boiler shell and pipes so the hero reads less razor-sharp.
    for o in bpy.data.collections["BASE"].objects:
        if o.type == "MESH" and o.name.lower().startswith(("box", "cylinder")):
            bevel = o.modifiers.new("bevel", "BEVEL")
            bevel.width = 0.02
            bevel.segments = 1
            bevel.limit_method = "ANGLE"

    out = os.path.join(ROOT, "assets", "maps", "glb", "authored", f"{scene_id}.glb")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in list(bpy.context.scene.objects):
        if o.type == "MESH":
            o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, use_selection=True, export_format="GLB")
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "assets", "maps", f"{scene_id}.blend"))
    print(f"PILOT {scene_id} -> {out}")


if cmd == "import-base":
    do_import_base()
elif cmd == "roundtrip":
    do_roundtrip()
elif cmd == "lint":
    do_lint()
elif cmd == "library":
    do_library()
elif cmd == "scatter":
    do_scatter()
elif cmd == "enhance":
    do_enhance()
elif cmd == "pilot":
    do_pilot()
else:
    print(__doc__)
