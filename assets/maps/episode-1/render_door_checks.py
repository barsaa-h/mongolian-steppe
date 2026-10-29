"""Render the apartment door proof views. Does not save the blend.

    blender -b EP01-Map.blend --python render_door_checks.py

Stills are 960x540, Eevee (Workbench if Eevee is unavailable). The ceiling stays
hidden. check_a_open25 is the EP01 freeze at 25 degrees. check_b poses the bench
on ANCHOR.BENCH_BRACE. check_d shows the coloured exit ribbons. check_f opens
the leaf to its full inward angle. plan.png shows the swing arc, the brace and
the two exit routes. Poses are restored in memory only. A contact sheet is
written beside the stills.

Set DOOR_CHECKS to a space-separated list of still names (without .png) to
render only those views.
"""
from pathlib import Path
import os
import bpy
import math

ROOT = Path(__file__).resolve().parent if globals().get('__file__') else Path(bpy.data.filepath).resolve().parent
OUT = ROOT / 'previews' / 'door-checks'
ROUTES = ('QA.ExitBedroom', 'QA.ExitLiving')
SHEET = (
    ('check_a.png', "a: Sükhee's push view, closed"),
    ('check_a_open25.png', 'a open 25°: leaf swings into the kitchen'),
    ('check_b.png', 'b: braced bench, door to opposite wall'),
    ('check_c.png', 'c: bedroom, infant blanket, way out'),
    ('check_d.png', 'd: exit route, living room to stairs'),
    ('check_e.png', 'e: crowd view through to the kitchen door'),
    ('check_f.png', 'f: fully open, leaf stays in the kitchen'),
    ('plan.png', 'plan: swing, brace and both exits'),
)


def activate(scene):
    window = getattr(bpy.context, 'window', None)
    if window is not None:
        window.scene = scene
    bpy.context.view_layer.update()
    return scene


def want(name):
    only = os.environ.get('DOOR_CHECKS', '').split()
    return not only or name in only


def show_routes(scene, qa, visible):
    qa.hide_render = not visible
    for name in ROUTES:
        obj = scene.objects.get(name)
        if obj is None:
            continue
        obj.hide_render = not visible
        # The strips are 12 cm wide. A stronger emission keeps them readable
        # in the high cutaway without changing the saved materials.
        mat = obj.active_material
        if mat is not None and mat.node_tree is not None:
            bsdf = mat.node_tree.nodes.get('Principled BSDF')
            socket = bsdf.inputs.get('Emission Strength') if bsdf else None
            if socket is not None:
                socket.default_value = 12.0 if visible else 2.0


def contact_sheet():
    from PIL import Image, ImageDraw, ImageFont
    missing = [name for name, _label in SHEET if not (OUT / name).is_file()]
    if missing:
        print('CONTACT skipped, missing', missing)
        return
    font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    font = ImageFont.truetype(font_path, 28) if Path(font_path).is_file() else ImageFont.load_default()
    cell_w, cell_h, label_h = 960, 540, 48
    cols = 4
    sheet = Image.new('RGB', (cols * cell_w, 2 * (cell_h + label_h)), (18, 18, 18))
    draw = ImageDraw.Draw(sheet)
    for i, (name, label) in enumerate(SHEET):
        image = Image.open(OUT / name).convert('RGB')
        if image.size != (cell_w, cell_h):
            image = image.resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + label_h)
        sheet.paste(image, (x, y))
        draw.rectangle((x, y + cell_h, x + cell_w, y + cell_h + label_h), fill=(12, 12, 12))
        draw.text((x + 14, y + cell_h + 8), label, fill=(245, 240, 226), font=font)
    path = OUT / 'contact_sheet.png'
    sheet.save(path)
    print('WROTE', path)


def main():
    scene = activate(bpy.data.scenes['EP01_Apartment'])
    OUT.mkdir(parents=True, exist_ok=True)
    ceiling = bpy.data.collections.get('HOME | removable ceiling')
    if ceiling is not None:
        ceiling.hide_render = True
    for obj in scene.objects:
        if obj.name.startswith('Home.Ceiling'):
            obj.hide_render = True

    engine = 'BLENDER_EEVEE'
    try:
        scene.render.engine = engine
    except TypeError:
        engine = 'BLENDER_WORKBENCH'
        scene.render.engine = engine
    if hasattr(scene, 'eevee') and hasattr(scene.eevee, 'taa_render_samples'):
        scene.eevee.taa_render_samples = 16
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False

    hinge = scene.objects['Home.KitchenDoorHinge']
    bench = scene.objects['Home.LowBench']
    anchor = scene.objects['ANCHOR.BENCH_BRACE']
    qa = bpy.data.collections['HOME | QA overlays']
    hinge_z = hinge.rotation_euler.z
    bench_loc = bench.location.copy()
    bench_rot = bench.rotation_euler.copy()
    qa_hide = qa.hide_render
    qa_obj_hide = {o.name: o.hide_render for o in qa.objects}

    def still(name):
        scene.render.filepath = str(OUT / name)
        bpy.ops.render.render(write_still=True)
        print('WROTE', scene.render.filepath, 'engine', scene.render.engine)

    try:
        hinge.rotation_euler.z = 0.0
        activate(scene)
        scene.camera = scene.objects['Home.Check_a']
        if want('check_a'):
            still('check_a.png')

        hinge.rotation_euler.z = math.radians(-25.0)
        activate(scene)
        if want('check_a_open25'):
            still('check_a_open25.png')

        hinge.rotation_euler.z = 0.0
        bench.location = anchor.location
        bench.rotation_euler = anchor.rotation_euler
        activate(scene)
        scene.camera = scene.objects['Home.Check_b']
        if want('check_b'):
            still('check_b.png')

        bench.location = bench_loc
        bench.rotation_euler = bench_rot
        activate(scene)
        scene.camera = scene.objects['Home.Check_c']
        if want('check_c'):
            still('check_c.png')

        show_routes(scene, qa, True)
        activate(scene)
        scene.camera = scene.objects['Home.Check_d']
        if want('check_d'):
            still('check_d.png')
        show_routes(scene, qa, False)

        scene.camera = scene.objects['Home.Check_e']
        if want('check_e'):
            still('check_e.png')

        hinge.rotation_euler.z = math.radians(float(hinge['open_angle_deg']))
        activate(scene)
        scene.camera = scene.objects['Home.Check_f']
        if want('check_f'):
            still('check_f.png')

        hinge.rotation_euler.z = 0.0
        qa.hide_render = False
        for obj in qa.objects:
            obj.hide_render = False
        activate(scene)
        scene.camera = scene.objects['Home.Plan']
        if want('plan'):
            still('plan.png')
        # A partial re-render still refreshes the sheet from the eight stills on disk.
        contact_sheet()
    finally:
        hinge.rotation_euler.z = hinge_z
        bench.location = bench_loc
        bench.rotation_euler = bench_rot
        qa.hide_render = qa_hide
        for obj in qa.objects:
            obj.hide_render = qa_obj_hide.get(obj.name, True)
        activate(scene)
        print('RESTORED hinge_z', round(math.degrees(hinge.rotation_euler.z), 4),
              'bench', tuple(round(v, 3) for v in bench.location))


if __name__ == '__main__':
    main()
