#!/usr/bin/env python3
"""Dress the EP01 apartment for Altan's birthday. Does not open EP01-Map.blend.

Writes a new versioned file under sets/ and never overwrites an older one:

    assets/maps/episode-1/sets/EP01_Apartment_BirthdayDressing_v###.blend

The file holds one collection, Dress.Birthday: wallpaper, a wall carpet,
the сервант, the table spread, balloons, practical lights. Coordinates match
EP01_Apartment (metres, X east, Y north, Z up).

    flock /home/barsaa/ms-workers/.blender.lock \\
        blender -b --factory-startup --python assets/maps/episode-1/build_birthday_dressing.py -- build

`preview` links the map read-only, renders three eye-height wides, and does
not save the map.
"""
import math
import sys
from pathlib import Path

import bpy
import bmesh
import numpy as np
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[3]
MAP = ROOT / 'assets/maps/episode-1/EP01-Map.blend'
SET_DIR = ROOT / 'assets/maps/episode-1/sets'
PREVIEW = ROOT / 'episodes/EP01/renders/dressing_preview'
FONT = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')

# Living-room inner faces. Wall meshes are 0.22 thick, centred on the author grid.
SOUTH_Y = 0.012
EAST_X = 5.385
NORTH_Y = 4.972
WEST_X = 0.125
CEILING = 2.68
TABLE = (2.7, 3.1)
TABLE_TOP = 0.812


def next_path():
    SET_DIR.mkdir(parents=True, exist_ok=True)
    found = list(SET_DIR.glob('EP01_Apartment_BirthdayDressing_v*.blend'))
    numbers = []
    for path in found:
        stem = path.stem.rsplit('_v', 1)[-1]
        if stem.isdigit():
            numbers.append(int(stem))
    version = (max(numbers) + 1) if numbers else 1
    return SET_DIR / f'EP01_Apartment_BirthdayDressing_v{version:03d}.blend', version


def latest_path():
    found = sorted(SET_DIR.glob('EP01_Apartment_BirthdayDressing_v*.blend'))
    blends = [path for path in found if path.stem.rsplit('_v', 1)[-1].isdigit()]
    if not blends:
        raise SystemExit('no birthday dressing blend; run build first')
    return blends[-1]


def material(name, color, rough=0.78, emit=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    rgba = (color[0], color[1], color[2], alpha)
    bsdf.inputs['Base Color'].default_value = rgba
    bsdf.inputs['Roughness'].default_value = rough
    for key in ('Emission Color', 'Emission'):
        if key in bsdf.inputs and emit > 0:
            bsdf.inputs[key].default_value = (color[0], color[1], color[2], 1)
            break
    for key in ('Emission Strength',):
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = emit
    if alpha < 1.0:
        for key in ('Alpha',):
            if key in bsdf.inputs:
                bsdf.inputs[key].default_value = alpha
        for attr in ('blend_method', 'surface_render_method'):
            if hasattr(mat, attr):
                try:
                    setattr(mat, attr, 'BLEND')
                except TypeError:
                    pass
    return mat


def image_material(name, image, rough=0.86, closest=True):
    mat = material(name, (1, 1, 1), rough=rough)
    tree = mat.node_tree
    tex = tree.nodes.new('ShaderNodeTexImage')
    tex.image = image
    tex.interpolation = 'Closest' if closest else 'Linear'
    tex.extension = 'REPEAT'
    tree.links.new(tex.outputs['Color'], tree.nodes['Principled BSDF'].inputs['Base Color'])
    return mat


def new_image(name, pixels, width, height):
    image = bpy.data.images.new(name, width=width, height=height, alpha=True)
    image.pixels.foreach_set(np.ascontiguousarray(pixels, dtype=np.float32).ravel())
    image.pack()
    return image


def stripe_wallpaper(name, ground, stripe, flower):
    size = 128
    pix = np.zeros((size, size, 4), dtype=np.float32)
    rng = np.random.default_rng(abs(hash(name)) % 10_000)
    yy, xx = np.mgrid[:size, :size]
    band = ((xx // 32) % 2) == 0
    base = np.array(ground)
    alt = np.array(stripe)
    pix[:, :, :3] = np.where(band[:, :, None], alt, base)
    pix[:, :, :3] += rng.normal(0, 0.012, (size, size, 3))
    # A few tired flowers so the paper is not only a stripe.
    for cx, cy in ((24, 28), (56, 78), (96, 40), (40, 100), (88, 96), (72, 20)):
        disk = (xx - cx) ** 2 + (yy - cy) ** 2 < 36
        pix[disk, :3] = flower
        petal = (xx - cx) ** 2 + (yy - cy) ** 2 < 12
        pix[petal, :3] = np.clip(np.array(flower) + 0.18, 0, 1)
    pix[:, :, 3] = 1
    pix[:, :, :3] = np.clip(pix[:, :, :3], 0, 1)
    return new_image(name, pix, size, size)


def carpet_image():
    size = 128
    pix = np.zeros((size, size, 4), dtype=np.float32)
    yy, xx = np.mgrid[:size, :size]
    cx = cy = (size - 1) / 2
    dx = (xx - cx) / size
    dy = (yy - cy) / size
    r = np.sqrt(dx ** 2 + dy ** 2)
    maroon = np.array((0.38, 0.07, 0.08))
    wine = np.array((0.55, 0.12, 0.12))
    gold = np.array((0.62, 0.42, 0.18))
    pix[:, :, :3] = maroon
    border = (xx < 8) | (xx > size - 9) | (yy < 8) | (yy > size - 9)
    pix[border, :3] = gold
    inner = (xx < 14) | (xx > size - 15) | (yy < 14) | (yy > size - 15)
    pix[inner & ~border, :3] = wine
    med = (np.abs(dx) + np.abs(dy) < 0.22) & (r > 0.06)
    pix[med, :3] = wine + 0.08
    pix[r < 0.06, :3] = gold
    # Repeat diamonds, the cheap machine-carpet look.
    cell = ((xx // 16) + (yy // 16)) % 2 == 0
    motif = (np.abs((xx % 16) - 8) + np.abs((yy % 16) - 8) < 5) & (r > 0.28)
    pix[motif & cell, :3] = gold * 0.85
    pix[:, :, 3] = 1
    return new_image('Dress.CarpetTex', pix, size, size)


def oilcloth_image():
    size = 64
    pix = np.zeros((size, size, 4), dtype=np.float32)
    yy, xx = np.mgrid[:size, :size]
    check = ((xx // 8) + (yy // 8)) % 2 == 0
    pix[:, :, :3] = np.where(check[:, :, None], (0.78, 0.22, 0.18), (0.93, 0.86, 0.72))
    pix[:, :, 3] = 1
    return new_image('Dress.OilclothTex', pix, size, size)


def calendar_image():
    size = 64
    pix = np.zeros((size, size, 4), dtype=np.float32)
    pix[:, :, :3] = (0.86, 0.82, 0.70)
    pix[:14, :, :3] = (0.45, 0.12, 0.12)
    yy, xx = np.mgrid[:size, :size]
    lines = (yy > 18) & ((yy % 8) < 1)
    cols = (xx % 9) < 1
    pix[lines | (cols & (yy > 18)), :3] = (0.25, 0.18, 0.14)
    pix[:, :, 3] = 1
    return new_image('Dress.CalendarTex', pix, size, size)


def sign_image():
    from PIL import Image, ImageDraw, ImageFont
    image = Image.new('RGB', (512, 128), (214, 186, 132))
    draw = ImageDraw.Draw(image)
    draw.rectangle((6, 6, 505, 121), outline=(120, 48, 36), width=4)
    font = ImageFont.truetype(str(FONT), 42) if FONT.is_file() else ImageFont.load_default()
    text = 'Төрсөн өдрийн мэнд'
    box = draw.textbbox((0, 0), text, font=font)
    width = box[2] - box[0]
    height = box[3] - box[1]
    draw.text(((512 - width) / 2, (128 - height) / 2 - 6), text, fill=(92, 28, 24), font=font)
    raw = np.asarray(image).astype(np.float32) / 255.0
    pix = np.zeros((128, 512, 4), dtype=np.float32)
    pix[:, :, :3] = raw
    pix[:, :, 3] = 1
    # Blender images are bottom-up.
    return new_image('Dress.SignTex', pix[::-1], 512, 128)


def link_only(obj, coll):
    for holder in list(obj.users_collection):
        holder.objects.unlink(obj)
    coll.objects.link(obj)
    return obj


def add_box(name, loc, dims, mat, coll):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.scale = dims
    mesh.materials.append(mat)
    coll.objects.link(obj)
    return obj


def add_cyl(name, loc, radius, depth, mat, coll, verts=10):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=radius, radius2=radius, depth=depth)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    mesh.materials.append(mat)
    coll.objects.link(obj)
    return obj


def add_uv_sphere(name, loc, radius, mat, coll, u=8, v=6):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=u, v_segments=v, radius=radius)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    mesh.materials.append(mat)
    coll.objects.link(obj)
    return obj


def add_cone(name, loc, radius, depth, mat, coll):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=radius, radius2=0.0, depth=depth)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    mesh.materials.append(mat)
    coll.objects.link(obj)
    return obj


def set_uv(obj, tiles_per_meter=1.0, full=False):
    """UVs in metres so a shared wallpaper tile does not stretch with the wall."""
    mesh = obj.data
    if not mesh.uv_layers:
        mesh.uv_layers.new(name='UVMap')
    layer = mesh.uv_layers.active.data
    sx, sy, sz = (abs(v) for v in obj.scale)
    for poly in mesh.polygons:
        normal = poly.normal
        for li in poly.loop_indices:
            co = mesh.vertices[mesh.loops[li].vertex_index].co
            if abs(normal.z) >= 0.5:
                u, v = (co.x + 0.5) * sx, (co.y + 0.5) * sy
                span_u, span_v = sx, sy
            elif abs(normal.x) >= 0.5:
                u, v = (co.y + 0.5) * sy, (co.z + 0.5) * sz
                span_u, span_v = sy, sz
            else:
                u, v = (co.x + 0.5) * sx, (co.z + 0.5) * sz
                span_u, span_v = sx, sz
            if full:
                u = u / max(span_u, 1e-4)
                v = v / max(span_v, 1e-4)
            else:
                u *= tiles_per_meter
                v *= tiles_per_meter
            layer[li].uv = (u, v)


def panel(name, loc, dims, mat, coll, tiles=0.0, full=False):
    obj = add_box(name, loc, dims, mat, coll)
    if tiles or full:
        set_uv(obj, tiles_per_meter=tiles or 1.0, full=full)
    return obj


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def add_light(name, loc, target, energy, size, color, coll):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    obj.location = loc
    coll.objects.link(obj)
    look_at(obj, target)
    return obj


def build():
    bpy.ops.wm.read_homefile(use_empty=True)
    scene = bpy.context.scene
    scene.name = 'EP01_BirthdayDressing'
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    coll = bpy.data.collections.new('Dress.Birthday')
    scene.collection.children.link(coll)

    paper = image_material('Dress.Wallpaper', stripe_wallpaper(
        'Dress.WallpaperTex', (0.78, 0.70, 0.56), (0.55, 0.28, 0.32), (0.62, 0.18, 0.22)))
    kitchen_paper = image_material('Dress.KitchenPaper', stripe_wallpaper(
        'Dress.KitchenTex', (0.62, 0.64, 0.52), (0.48, 0.55, 0.46), (0.32, 0.42, 0.30)))
    hall_paper = image_material('Dress.HallPaper', stripe_wallpaper(
        'Dress.HallTex', (0.58, 0.52, 0.44), (0.48, 0.40, 0.36), (0.40, 0.28, 0.26)))
    carpet_mat = image_material('Dress.Carpet', carpet_image(), rough=0.92)
    cloth_mat = image_material('Dress.Oilcloth', oilcloth_image(), rough=0.55)
    calendar_mat = image_material('Dress.Calendar', calendar_image(), closest=False)
    sign_mat = image_material('Dress.Sign', sign_image(), rough=0.7, closest=False)

    wood = material('Dress.Wood', (0.34, 0.20, 0.10), 0.7)
    wood_dark = material('Dress.WoodDark', (0.16, 0.09, 0.05), 0.55)
    glass = material('Dress.Glass', (0.75, 0.86, 0.84), 0.08, emit=0.15)
    crystal = material('Dress.Crystal', (0.85, 0.90, 0.92), 0.05)
    china = material('Dress.China', (0.86, 0.84, 0.78), 0.35)
    gold = material('Dress.Brass', (0.62, 0.46, 0.18), 0.4)
    maroon = material('Dress.Maroon', (0.42, 0.08, 0.09), 0.8)
    red = material('Dress.Red', (0.70, 0.10, 0.10), 0.6)
    cream = material('Dress.Cream', (0.90, 0.84, 0.70), 0.7)
    white = material('Dress.White', (0.92, 0.90, 0.84), 0.65)
    green = material('Dress.Plant', (0.18, 0.38, 0.16), 0.8)
    pot = material('Dress.Pot', (0.45, 0.22, 0.14), 0.8)
    metal = material('Dress.Iron', (0.18, 0.20, 0.18), 0.45)
    night = material('Dress.Night', (0.02, 0.04, 0.10), 0.9, emit=0.35)
    shade = material('Dress.Shade', (1.0, 0.78, 0.42), 0.4, emit=2.2)
    cake_mat = material('Dress.Cake', (0.93, 0.78, 0.62), 0.55)
    icing = material('Dress.Icing', (0.96, 0.62, 0.68), 0.4)
    candle = material('Dress.Candle', (0.85, 0.78, 0.45), 0.5)
    flame = material('Dress.Flame', (1.0, 0.72, 0.25), 0.3, emit=6.0)
    salad_potato = material('Dress.Potato', (0.86, 0.78, 0.42), 0.7)
    salad_carrot = material('Dress.Carrot', (0.86, 0.42, 0.12), 0.65)
    salad_meat = material('Dress.MeatSalad', (0.72, 0.42, 0.36), 0.7)
    dough = material('Dress.Dough', (0.90, 0.82, 0.68), 0.75)
    fried = material('Dress.Fried', (0.72, 0.48, 0.16), 0.6)
    sausage = material('Dress.Sausage', (0.62, 0.28, 0.26), 0.55)
    bread = material('Dress.Bread', (0.70, 0.50, 0.26), 0.8)
    apple = material('Dress.Apple', (0.62, 0.10, 0.10), 0.45)
    orange = material('Dress.Orange', (0.90, 0.48, 0.08), 0.5)
    bottle_green = material('Dress.Soda', (0.15, 0.38, 0.22), 0.2)
    bottle_clear = material('Dress.Vodka', (0.80, 0.84, 0.82), 0.08)
    juice = material('Dress.Juice', (0.85, 0.55, 0.15), 0.25)
    thermos = material('Dress.Thermos', (0.55, 0.08, 0.08), 0.4)
    napkin = material('Dress.Napkin', (0.88, 0.86, 0.78), 0.9)
    gift_a = material('Dress.GiftA', (0.15, 0.32, 0.55), 0.6)
    gift_b = material('Dress.GiftB', (0.55, 0.18, 0.22), 0.6)
    ribbon = material('Dress.Ribbon', (0.85, 0.75, 0.25), 0.4)
    coat_colors = [
        material('Dress.Coat0', (0.10, 0.16, 0.22)),
        material('Dress.Coat1', (0.22, 0.16, 0.10)),
        material('Dress.Coat2', (0.28, 0.08, 0.08)),
        material('Dress.Coat3', (0.12, 0.12, 0.12)),
    ]
    balloon_colors = [
        material('Dress.BalRed', (0.75, 0.08, 0.10), 0.35),
        material('Dress.BalYellow', (0.85, 0.70, 0.12), 0.35),
        material('Dress.BalBlue', (0.12, 0.28, 0.62), 0.35),
        material('Dress.BalGreen', (0.12, 0.48, 0.22), 0.35),
        material('Dress.BalWhite', (0.90, 0.88, 0.80), 0.35),
        material('Dress.BalOrange', (0.85, 0.40, 0.08), 0.35),
        material('Dress.BalPink', (0.80, 0.35, 0.45), 0.35),
    ]
    garland_colors = [
        material('Dress.Gar0', (0.70, 0.12, 0.12)),
        material('Dress.Gar1', (0.85, 0.70, 0.20)),
        material('Dress.Gar2', (0.15, 0.35, 0.60)),
        material('Dress.Gar3', (0.20, 0.48, 0.22)),
    ]
    candy_colors = [
        material('Dress.Sweet0', (0.80, 0.15, 0.20)),
        material('Dress.Sweet1', (0.15, 0.45, 0.75)),
        material('Dress.Sweet2', (0.85, 0.65, 0.15)),
        material('Dress.Sweet3', (0.45, 0.20, 0.55)),
    ]
    screen = material('Dress.Screen', (0.05, 0.08, 0.12), 0.3)
    doily = material('Dress.Doily', (0.92, 0.90, 0.84), 0.8)
    slipper = material('Dress.Slipper', (0.35, 0.16, 0.12), 0.8)
    shoe = material('Dress.Shoe', (0.08, 0.07, 0.07), 0.6)
    book = material('Dress.Book', (0.15, 0.22, 0.38), 0.8)
    photo = material('Dress.Photo', (0.45, 0.32, 0.24), 0.6)
    frame = material('Dress.Frame', (0.30, 0.18, 0.08), 0.5)
    tulle = material('Dress.Tulle', (0.92, 0.90, 0.84), 0.9, alpha=0.55)
    drape = material('Dress.Drape', (0.40, 0.16, 0.16), 0.85)
    rug = material('Dress.Rug', (0.40, 0.08, 0.08), 0.9)
    string = material('Dress.String', (0.75, 0.72, 0.60), 0.8)
    bowl = material('Dress.Bowl', (0.82, 0.80, 0.74), 0.45)
    cup_colors = [
        material('Dress.Cup0', (0.80, 0.78, 0.70)),
        material('Dress.Cup1', (0.30, 0.40, 0.48)),
        material('Dress.Cup2', (0.55, 0.20, 0.16)),
        material('Dress.Cup3', (0.85, 0.82, 0.55)),
    ]

    # --- wallpaper, cut around the openings the cameras walk through ---
    def wall(name, loc, dims, mat):
        panel(name, loc, dims, mat, coll, tiles=0.65)

    # Living room, south wall (solid on this side of the flat).
    wall('Dress.Paper.LivSouth', (2.75, SOUTH_Y, 1.32), (5.0, 0.015, 2.55), paper)
    # East wall around the window (opening y=1..3, z=0.9..2.25).
    wall('Dress.Paper.LivEastLow', (EAST_X, 2.55, 0.44), (0.015, 4.7, 0.84), paper)
    wall('Dress.Paper.LivEastHigh', (EAST_X, 2.55, 2.46), (0.015, 4.7, 0.40), paper)
    wall('Dress.Paper.LivEastSouth', (EAST_X, 0.55, 1.55), (0.015, 0.75, 1.30), paper)
    wall('Dress.Paper.LivEastNorth', (EAST_X, 4.00, 1.55), (0.015, 1.85, 1.30), paper)
    # North wall around the bath door (x 0.55-1.4) and the store door (x 3.2-4.15).
    wall('Dress.Paper.LivNorthWest', (0.34, NORTH_Y, 1.32), (0.32, 0.015, 2.50), paper)
    wall('Dress.Paper.LivNorthMid', (2.30, NORTH_Y, 1.32), (1.55, 0.015, 2.50), paper)
    wall('Dress.Paper.LivNorthEast', (4.75, NORTH_Y, 1.32), (1.05, 0.015, 2.50), paper)
    # West wall of the living room around the door (opening y=0.9..2.1).
    wall('Dress.Paper.LivWestSouth', (WEST_X, 0.48, 1.32), (0.015, 0.70, 2.50), paper)
    wall('Dress.Paper.LivWestNorth', (WEST_X, 3.50, 1.32), (0.015, 2.55, 2.50), paper)
    wall('Dress.Paper.LivWestLintel', (WEST_X, 1.50, 2.46), (0.015, 1.15, 0.40), paper)

    # Corridor, both long walls, cut for the three doors.
    wall('Dress.Paper.HallEastLow', (-0.125, 0.48, 1.32), (0.015, 0.70, 2.50), hall_paper)
    wall('Dress.Paper.HallEastNorth', (-0.125, 3.55, 1.32), (0.015, 2.70, 2.50), hall_paper)
    wall('Dress.Paper.HallEastLintel', (-0.125, 1.50, 2.46), (0.015, 1.15, 0.40), hall_paper)
    wall('Dress.Paper.HallWestSouth', (-1.375, 0.50, 1.32), (0.015, 0.85, 2.50), hall_paper)
    wall('Dress.Paper.HallWestMid', (-1.375, 2.75, 1.20), (0.015, 1.30, 2.20), hall_paper)
    wall('Dress.Paper.HallWestBed', (-1.375, 4.05, 1.32), (0.015, 1.15, 2.50), hall_paper)
    wall('Dress.Paper.HallWestNorth', (-1.375, 6.45, 1.32), (0.015, 1.40, 2.50), hall_paper)

    # Kitchen, duller paper, kept off the door leaf's swing (the east wall is the door).
    wall('Dress.Paper.KitSouth', (-3.15, 0.12, 1.32), (3.1, 0.015, 2.50), kitchen_paper)
    wall('Dress.Paper.KitWest', (-4.78, 1.70, 1.32), (0.015, 3.1, 2.50), kitchen_paper)
    wall('Dress.Paper.KitNorth', (-3.15, 3.38, 1.32), (3.1, 0.015, 2.50), kitchen_paper)

    # Wall carpet on the solid span between the bath door and the store door.
    panel('Dress.Carpet', (2.30, NORTH_Y - 0.03, 1.28), (1.45, 0.02, 1.65), carpet_mat, coll, full=True)
    panel('Dress.Sign', (2.30, NORTH_Y - 0.055, 2.28), (1.15, 0.01, 0.28), sign_mat, coll, full=True)
    # Artistic choice: a handwritten paper sign. See REFERENCE_1990s_birthday.md.
    frame_obj = panel('Dress.Calendar', (0.55, NORTH_Y - 0.03, 1.85), (0.28, 0.01, 0.38), calendar_mat, coll, full=True)
    frame_obj['note'] = 'wall calendar'

    # Rug under the birthday table. Thin, so feet stay on the floor plane.
    rug_obj = add_cyl('Dress.Rug', (2.65, 3.05, 0.008), 1.0, 0.012, rug, coll, verts=16)
    rug_obj.scale = (1.7, 1.15, 1.0)

    # --- сервант against the east wall, north of the window ---
    panel('Dress.Stenka.Back', (5.22, 3.85, 0.95), (0.10, 1.15, 1.85), wood, coll)
    panel('Dress.Stenka.SideS', (5.08, 3.32, 0.95), (0.22, 0.06, 1.85), wood, coll)
    panel('Dress.Stenka.SideN', (5.08, 4.38, 0.95), (0.22, 0.06, 1.85), wood, coll)
    panel('Dress.Stenka.Base', (5.08, 3.85, 0.32), (0.26, 1.02, 0.62), wood_dark, coll)
    panel('Dress.Stenka.Top', (5.08, 3.85, 1.80), (0.26, 1.02, 0.10), wood, coll)
    panel('Dress.Stenka.Interior', (5.14, 3.85, 1.18), (0.12, 0.90, 0.90), wood_dark, coll)
    # Open mullions. A solid glass slab reads as a white panel in Eevee.
    panel('Dress.Stenka.Mullion', (4.96, 3.85, 1.20), (0.018, 0.04, 0.72), wood, coll)
    panel('Dress.Stenka.RailTop', (4.96, 3.85, 1.54), (0.018, 0.96, 0.035), wood, coll)
    panel('Dress.Stenka.RailLow', (4.96, 3.85, 0.86), (0.018, 0.96, 0.035), wood, coll)
    for index, y in enumerate((3.45, 3.70, 4.05, 4.30)):
        add_cyl(f'Dress.Crystal.{index}', (5.10, y, 1.15), 0.035, 0.14, crystal, coll, verts=8)
    add_cyl('Dress.Teapot', (5.12, 3.85, 0.62), 0.07, 0.10, china, coll, verts=8)
    panel('Dress.Books', (5.14, 4.35, 0.48), (0.16, 0.18, 0.22), book, coll)
    panel('Dress.Frame', (4.95, 3.40, 1.72), (0.02, 0.16, 0.20), frame, coll)
    panel('Dress.FramePhoto', (4.94, 3.40, 1.72), (0.01, 0.12, 0.15), photo, coll)

    # Television, doily, cassette, in the northeast corner clear of the store door.
    panel('Dress.TvStand', (4.62, 4.74, 0.28), (0.70, 0.34, 0.54), wood_dark, coll)
    panel('Dress.Doily', (4.62, 4.74, 0.56), (0.48, 0.26, 0.012), doily, coll)
    panel('Dress.Tv', (4.62, 4.74, 0.82), (0.52, 0.22, 0.40), wood_dark, coll)
    panel('Dress.TvScreen', (4.50, 4.74, 0.84), (0.01, 0.36, 0.26), screen, coll)
    panel('Dress.Cassette', (4.95, 4.74, 0.62), (0.16, 0.22, 0.08), wood, coll)

    # Window: night, radiator, plants, tulle, drapes.
    panel('Dress.Night', (5.72, 2.00, 1.55), (0.02, 2.15, 1.45), night, coll)
    panel('Dress.Radiator', (5.22, 2.00, 0.38), (0.10, 1.35, 0.55), metal, coll)
    for index in range(6):
        panel(f'Dress.RadiatorFin.{index}', (5.18, 1.45 + index * 0.22, 0.40), (0.04, 0.03, 0.48), metal, coll)
    for index, y in enumerate((1.35, 2.00, 2.65)):
        add_cyl(f'Dress.Pot.{index}', (5.22, y, 0.98), 0.07, 0.10, pot, coll, verts=8)
        add_uv_sphere(f'Dress.Plant.{index}', (5.22, y, 1.12), 0.10, green, coll)
    panel('Dress.DrapeSouth', (5.28, 0.92, 1.55), (0.04, 0.28, 1.35), drape, coll)
    panel('Dress.DrapeNorth', (5.28, 3.08, 1.55), (0.04, 0.28, 1.35), drape, coll)
    panel('Dress.TulleSouth', (5.24, 1.40, 1.55), (0.015, 0.45, 1.25), tulle, coll)
    panel('Dress.TulleNorth', (5.24, 2.60, 1.55), (0.015, 0.45, 1.25), tulle, coll)

    # Sofa throw, so the greybox sofa reads as a seat with a blanket.
    panel('Dress.SofaThrow', (4.80, 0.90, 0.74), (0.62, 1.35, 0.06), maroon, coll)
    panel('Dress.Cushion', (4.95, 0.45, 0.85), (0.18, 0.32, 0.22), cream, coll)

    # Stool brought in for the guest who eats. Seat matches the animatic mark.
    add_cyl('Dress.StoolSeat', (4.45, 3.80, 0.44), 0.16, 0.05, wood, coll, verts=8)
    for index, (dx, dy) in enumerate(((-0.10, -0.10), (0.10, -0.10), (0.0, 0.11))):
        add_cyl(f'Dress.StoolLeg.{index}', (4.45 + dx, 3.80 + dy, 0.21), 0.02, 0.42, wood_dark, coll, verts=6)
    add_cyl('Dress.StoolSpare', (0.55, 4.78, 0.42), 0.14, 0.04, wood, coll, verts=8)

    # --- the table. Full, already eaten from. Cake in front of Altan's west seat. ---
    panel('Dress.Oilcloth', (TABLE[0], TABLE[1], TABLE_TOP), (2.78, 1.36, 0.012), cloth_mat, coll, tiles=2.2)
    add_cyl('Dress.Cake', (1.72, 2.95, 0.92), 0.22, 0.16, cake_mat, coll, verts=12)
    add_cyl('Dress.Icing', (1.72, 2.95, 1.02), 0.23, 0.045, icing, coll, verts=12)
    for index, (dx, dy) in enumerate(((-0.05, 0.02), (0.05, 0.02), (0.0, -0.05))):
        add_cyl(f'Dress.Candle.{index}', (1.72 + dx, 2.95 + dy, 1.10), 0.010, 0.11, candle, coll, verts=6)
        add_uv_sphere(f'Dress.Flame.{index}', (1.72 + dx, 2.95 + dy, 1.17), 0.018, flame, coll, u=6, v=4)

    def bowl_of(name, loc, fill, radius=0.13):
        add_cyl(name + '.Bowl', (loc[0], loc[1], TABLE_TOP + 0.045), radius, 0.07, bowl, coll, verts=10)
        add_cyl(name, (loc[0], loc[1], TABLE_TOP + 0.08), radius * 0.82, 0.045, fill, coll, verts=10)

    bowl_of('Dress.PotatoSalad', (2.25, 2.62), salad_potato)
    bowl_of('Dress.CarrotSalad', (2.65, 2.58), salad_carrot, 0.12)
    bowl_of('Dress.MeatSalad', (3.05, 2.62), salad_meat, 0.12)
    # Buuz: a plate of domes. Khuushuur: flatter golden discs beside them.
    add_cyl('Dress.BuuzPlate', (2.45, 3.42, TABLE_TOP + 0.02), 0.22, 0.03, cream, coll, verts=12)
    for index, (dx, dy) in enumerate(((-0.06, 0.02), (0.02, 0.05), (0.07, -0.01), (-0.02, -0.05), (0.06, 0.04))):
        add_uv_sphere(f'Dress.Buuz.{index}', (2.45 + dx * 1.3, 3.42 + dy * 1.3, TABLE_TOP + 0.065), 0.048, dough, coll, u=6, v=4)
    add_cyl('Dress.KhuushuurPlate', (1.95, 3.35, TABLE_TOP + 0.02), 0.12, 0.02, cream, coll, verts=10)
    for index, (dx, dy) in enumerate(((-0.03, 0.0), (0.03, 0.02), (0.0, -0.03))):
        add_cyl(f'Dress.Khuushuur.{index}', (1.95 + dx, 3.35 + dy, TABLE_TOP + 0.045), 0.035, 0.012, fried, coll, verts=8)
    bowl_of('Dress.Boortsog', (3.55, 2.85), fried, 0.11)
    add_cyl('Dress.SausagePlate', (3.45, 3.15, TABLE_TOP + 0.02), 0.11, 0.02, cream, coll, verts=10)
    for index in range(4):
        add_cyl(f'Dress.Sausage.{index}', (3.38 + (index % 2) * 0.06, 3.10 + (index // 2) * 0.05, TABLE_TOP + 0.04),
                0.028, 0.012, sausage, coll, verts=8)
    panel('Dress.Bread', (3.15, 2.85, TABLE_TOP + 0.035), (0.16, 0.10, 0.04), bread, coll)
    bowl_of('Dress.Candy', (3.62, 3.42), cream, 0.10)
    for index in range(6):
        add_box(f'Dress.Sweet.{index}', (3.55 + (index % 3) * 0.035, 3.38 + (index // 3) * 0.04, TABLE_TOP + 0.09),
                (0.018, 0.012, 0.012), candy_colors[index % 4], coll)
    # (3.15, 3.40) stays clear for ANCHOR.MITTEN_2_TABLE.
    for index, (x, y) in enumerate(((2.70, 3.18), (2.88, 3.08), (3.55, 3.02))):
        add_uv_sphere(f'Dress.Apple.{index}', (x, y, TABLE_TOP + 0.05), 0.04, apple, coll, u=6, v=4)
    add_uv_sphere('Dress.Orange.0', (2.58, 3.22, TABLE_TOP + 0.05), 0.04, orange, coll, u=6, v=4)
    add_uv_sphere('Dress.Orange.1', (2.78, 3.28, TABLE_TOP + 0.045), 0.035, orange, coll, u=6, v=4)
    # Keep (3.15, 3.40) clear: that is ANCHOR.MITTEN_2_TABLE.
    add_cyl('Dress.Soda', (2.15, 3.48, TABLE_TOP + 0.11), 0.035, 0.18, bottle_green, coll, verts=8)
    add_cyl('Dress.Juice', (2.55, 3.52, TABLE_TOP + 0.10), 0.035, 0.16, juice, coll, verts=8)
    add_cyl('Dress.Vodka', (3.85, 3.15, TABLE_TOP + 0.12), 0.032, 0.20, bottle_clear, coll, verts=8)
    panel('Dress.VodkaLabel', (3.82, 3.15, TABLE_TOP + 0.12), (0.01, 0.03, 0.05), white, coll)
    add_cyl('Dress.Thermos', (3.75, 2.62, TABLE_TOP + 0.12), 0.055, 0.20, thermos, coll, verts=10)
    add_cyl('Dress.ThermosCap', (3.75, 2.62, TABLE_TOP + 0.23), 0.04, 0.03, metal, coll, verts=8)
    for index, (x, y) in enumerate(((1.95, 2.75), (2.40, 2.85), (3.40, 2.55), (1.60, 3.15))):
        add_cyl(f'Dress.Cup.{index}', (x, y, TABLE_TOP + 0.05), 0.028, 0.055, cup_colors[index], coll, verts=8)
    for index, (x, y, rot) in enumerate(((2.10, 2.70, 0.4), (2.90, 2.75, 1.2), (3.30, 2.70, 0.2), (1.80, 2.85, 2.0))):
        bit = panel(f'Dress.Napkin.{index}', (x, y, TABLE_TOP + 0.02), (0.06, 0.045, 0.006), napkin, coll)
        bit.rotation_euler.z = rot
    for index, (x, y) in enumerate(((2.20, 3.05), (2.80, 2.95), (3.20, 3.05), (1.90, 3.05))):
        panel(f'Dress.Crumb.{index}', (x, y, TABLE_TOP + 0.018), (0.012, 0.008, 0.004), bread, coll)

    # Presents on the floor just north of where Altan sits, clear of the west cameras.
    panel('Dress.GiftA', (0.62, 2.62, 0.07), (0.18, 0.14, 0.10), gift_a, coll)
    panel('Dress.GiftARibbon', (0.62, 2.62, 0.125), (0.19, 0.02, 0.012), ribbon, coll)
    panel('Dress.GiftB', (0.82, 2.82, 0.055), (0.14, 0.12, 0.08), gift_b, coll)
    panel('Dress.GiftBRibbon', (0.82, 2.82, 0.10), (0.02, 0.13, 0.012), ribbon, coll)

    # Hall: coats against the kitchen wall, south of the kitchen door. Slippers inside.
    for index, (dx, dy, dz, sx, sy) in enumerate((
            (0.0, 0.0, 0.12, 0.42, 0.32),
            (0.06, 0.05, 0.28, 0.36, 0.28),
            (-0.04, 0.02, 0.40, 0.30, 0.24),
            (0.02, -0.04, 0.50, 0.22, 0.18),
    )):
        coat = panel(f'Dress.Coat.{index}', (-1.18 + dx, 0.48 + dy, dz), (sx, sy, 0.16), coat_colors[index], coll)
        coat.rotation_euler.z = 0.2 * index
    panel('Dress.Scarf', (-1.05, 0.55, 0.58), (0.28, 0.08, 0.04), red, coll)
    for index, (x, y) in enumerate(((-0.55, 0.32), (-0.38, 0.42), (0.20, 0.28), (0.38, 0.22))):
        mat = slipper if index < 3 else shoe
        panel(f'Dress.ShoeL.{index}', (x - 0.04, y, 0.025), (0.07, 0.14, 0.04), mat, coll)
        panel(f'Dress.ShoeR.{index}', (x + 0.05, y + 0.02, 0.025), (0.07, 0.14, 0.04), mat, coll)

    # Balloons. High ones and two on the floor, none in a doorway or on the table.
    balloons = [
        ((0.45, 4.55, 1.95), 0, (0.4, 4.70, 2.35)),
        ((1.15, 4.85, 1.85), 1, (1.15, 4.95, 2.25)),
        ((3.15, 4.82, 1.90), 2, (3.15, 4.95, 2.30)),
        ((5.15, 3.55, 1.95), 3, (5.30, 3.55, 2.30)),
        ((5.15, 1.55, 1.85), 4, (5.30, 1.55, 2.20)),
        ((0.55, 2.15, 1.85), 5, (0.35, 2.15, 2.30)),
        ((2.70, 2.05, 1.95), 6, (2.70, 2.05, 2.40)),
        ((3.55, 3.85, 1.90), 0, (3.55, 3.95, 2.30)),
        ((4.95, 0.35, 0.16), 1, None),
        ((1.55, 1.55, 0.16), 2, None),
    ]
    for index, (loc, color, tape) in enumerate(balloons):
        bal = add_uv_sphere(f'Dress.Balloon.{index}', loc, 0.16 if loc[2] > 1 else 0.13, balloon_colors[color], coll)
        bal.scale = (1.0, 1.0, 0.92 + (index % 3) * 0.05)
        bal.rotation_euler.y = ((index % 5) - 2) * 0.08
        if tape is not None:
            panel(f'Dress.Tape.{index}', tape, (0.04, 0.04, 0.012), cream, coll)
            mid = ((loc[0] + tape[0]) / 2, (loc[1] + tape[1]) / 2, (loc[2] + 0.11 + tape[2]) / 2)
            add_cyl(f'Dress.BalloonString.{index}', mid, 0.004, abs(tape[2] - loc[2]), string, coll, verts=4)
        else:
            add_cyl(f'Dress.BalloonString.{index}', (loc[0], loc[1], 0.05), 0.003, 0.08, string, coll, verts=4)

    def garland(name, x0, x1, y, z, sag, count):
        for index in range(count):
            t = index / (count - 1)
            x = x0 + (x1 - x0) * t
            zz = z - sag * math.sin(t * math.pi)
            flag = add_cone(f'{name}.{index}', (x, y, zz), 0.045, 0.07, garland_colors[index % 4], coll)
            flag.rotation_euler.x = math.radians(90)

    garland('Dress.GarlandNorth', 0.45, 5.05, 4.35, 2.48, 0.16, 18)
    garland('Dress.GarlandSouth', 0.55, 4.90, 2.15, 2.50, 0.12, 16)

    # Ceiling lamp: four shades, the warmest pool in the flat.
    panel('Dress.LampCanopy', (TABLE[0], TABLE[1], 2.58), (0.12, 0.12, 0.04), gold, coll)
    add_cyl('Dress.LampStem', (TABLE[0], TABLE[1], 2.42), 0.012, 0.28, gold, coll, verts=6)
    shade_points = ((2.45, 2.90), (2.95, 2.90), (2.45, 3.30), (2.95, 3.30))
    for index, (x, y) in enumerate(shade_points):
        arm = panel(f'Dress.LampArm.{index}', ((TABLE[0] + x) / 2, (TABLE[1] + y) / 2, 2.40),
                    (abs(x - TABLE[0]) + 0.02, 0.015, 0.015), gold, coll)
        arm.rotation_euler.y = 0.3 if x < TABLE[0] else -0.3
        shade_obj = add_cone(f'Dress.LampShade.{index}', (x, y, 2.28), 0.09, 0.12, shade, coll)
        shade_obj.rotation_euler.x = math.radians(180)
        add_light(f'Dress.LampBulb.{index}', (x, y, 2.22), (x, y, 1.2), 80, 0.18, (1.0, 0.72, 0.42), coll)
    # Key, fill, window, hall, kitchen. The table key is the warmest.
    add_light('Dress.KeyTable', (2.65, 2.55, 2.42), (2.5, 3.0, 0.9), 520, 1.6, (1.0, 0.74, 0.48), coll)
    add_light('Dress.FillSouth', (1.2, 0.8, 2.2), (2.2, 2.6, 1.1), 140, 2.4, (1.0, 0.82, 0.64), coll)
    add_light('Dress.FillEast', (4.6, 2.2, 2.15), (2.4, 3.0, 1.2), 70, 1.8, (1.0, 0.80, 0.62), coll)
    add_light('Dress.WindowCool', (6.1, 2.0, 1.8), (4.8, 2.0, 1.3), 36, 1.4, (0.55, 0.66, 0.95), coll)
    add_light('Dress.HallCool', (-0.75, 2.4, 2.35), (-0.75, 2.0, 1.0), 42, 1.6, (0.68, 0.74, 0.92), coll)
    add_light('Dress.KitchenWarm', (-3.0, 2.2, 2.30), (-2.2, 1.45, 1.3), 110, 1.3, (1.0, 0.76, 0.52), coll)
    add_light('Dress.LandingCool', (-0.6, -1.3, 2.1), (-0.7, 0.2, 0.8), 28, 1.5, (0.55, 0.62, 0.85), coll)

    path, version = next_path()
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(path))
    print('SAVED', path, 'v', version, 'objects', len(coll.objects), flush=True)
    warn_clearances(coll)
    return path


def warn_clearances(coll):
    """Print props that sit in a doorway or on the kitchen-door swing."""
    blocked = (
        ('front-door', (-1.35, -0.25), (-0.25, 0.20), 0.4),
        ('living-door', (-0.15, 0.85), (0.20, 2.15), 1.6),
        ('kitchen-swing', (-2.55, 0.95), (-1.45, 2.10), 2.0),
        ('kitchen-door', (-1.70, 0.95), (-1.35, 2.10), 2.0),
        ('bedroom-door', (-1.70, 4.60), (-1.30, 5.70), 2.0),
    )
    for obj in coll.objects:
        if obj.type != 'MESH':
            continue
        loc = obj.location
        for name, (x0, y0), (x1, y1), zmax in blocked:
            if x0 <= loc.x <= x1 and y0 <= loc.y <= y1 and loc.z <= zmax:
                print(f'WARN {obj.name} in {name} at {tuple(round(v, 2) for v in loc)}', flush=True)


def preview():
    path = latest_path()
    bpy.ops.wm.read_homefile(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    if hasattr(scene.eevee, 'taa_render_samples'):
        scene.eevee.taa_render_samples = 8
    with bpy.data.libraries.load(str(MAP), link=True) as (src, dst):
        dst.collections = [
            name for name in (
                'HOME | walls and openings',
                'HOME | furniture and story props',
                'HOME | landing stair and courtyard',
            ) if name in src.collections
        ]
    for coll in dst.collections:
        scene.collection.children.link(coll)
    with bpy.data.libraries.load(str(path), link=True) as (src, dst):
        dst.collections = ['Dress.Birthday']
    for coll in dst.collections:
        scene.collection.children.link(coll)
    world = bpy.data.worlds.new('PreviewNight')
    scene.world = world
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.03, 0.02, 0.015, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.08
    views = {
        'wide_A': ((0.55, 0.65, 1.58), (2.6, 3.2, 1.1)),
        'wide_B': ((4.35, 4.55, 1.58), (2.2, 2.4, 1.0)),
        'wide_C': ((-0.45, 1.50, 1.58), (2.5, 3.0, 1.05)),
    }
    PREVIEW.mkdir(parents=True, exist_ok=True)
    for name, (loc, look) in views.items():
        data = bpy.data.cameras.new(name)
        data.lens = 24
        data.clip_start = 0.05
        cam = bpy.data.objects.new(name, data)
        cam.location = loc
        scene.collection.objects.link(cam)
        look_at(cam, look)
        scene.camera = cam
        scene.render.filepath = str(PREVIEW / f'{name}.png')
        bpy.ops.render.render(write_still=True)
        print('PREVIEW', name, flush=True)


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['build']
    command = args[0]
    if command == 'build':
        build()
    elif command == 'preview':
        preview()
    elif command == 'build-preview':
        build()
        preview()
    else:
        raise SystemExit(f'unknown command {command}')


if __name__ == '__main__':
    main()
