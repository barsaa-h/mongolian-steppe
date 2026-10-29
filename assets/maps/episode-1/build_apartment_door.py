"""Add the EP01 apartment kitchen door, hall bench, actor marks and proof cameras.

The leaf opens inward (toward -X). The hinge is the north jamb and the latch is
the south edge, so Ganaa's right hand meets the gap and his bitten left wrist
stays at the hinge. The bench is visible in the corridor. Its EP02 pose is the
empty ANCHOR.BENCH_BRACE: a diagonal wedge from the hall face of the leaf to the
solid wall south of the living-room door. Run with:

    blender -b EP01-Map.blend --python build_apartment_door.py
"""
from pathlib import Path
import bpy, bmesh, math
from mathutils import Matrix, Vector

HINGE = Vector((-1.526, 1.980, 0.0))
LEAF_T, LEAF_W, LEAF_H = 0.04, 0.90, 2.00
LEAF_OFFSET = Vector((0.0, -LEAF_W / 2, 1.02))
BENCH_DEPTH = 0.30
BENCH_HEIGHT = 0.40
WALLS = {'Home.KitchenDoor', 'Home.KitchenDoor.001', 'Home.KitchenDoor.002'}
BEDROOM_EXIT = [(-2.4, 5.3), (-0.85, 5.15), (-0.85, 0.35), (-0.8, -0.55)]
# South of the birthday chairs, through the living-room door, then the corridor.
LIVING_EXIT = [(3.8, 1.35), (0.55, 1.35), (-0.85, 1.35), (-0.85, 0.35), (-0.8, -0.55)]


def activate(scene):
    window = getattr(bpy.context, 'window', None)
    if window is not None:
        window.scene = scene
    bpy.context.view_layer.update()
    return scene


def link(obj, coll):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    coll.objects.link(obj)
    return obj


def project_uv(mesh):
    uv = mesh.uv_layers.active or mesh.uv_layers.new()
    for poly in mesh.polygons:
        axes = sorted(range(3), key=lambda a: abs(poly.normal[a]))[:2]
        for li in poly.loop_indices:
            co = mesh.vertices[mesh.loops[li].vertex_index].co
            uv.data[li].uv = (co[axes[0]] * 0.65, co[axes[1]] * 0.65)


def new_object(name, mesh, coll, mat, collision):
    obj = bpy.data.objects.new(name, mesh)
    link(obj, coll)
    if mat:
        mesh.materials.append(mat)
    project_uv(mesh)
    obj['collision'] = collision
    obj['tier'] = 'HERO' if collision else 'MID'
    return obj


def add_box(bm, center, size):
    geom = bmesh.ops.create_cube(bm, size=1.0)
    for v in geom['verts']:
        v.co.x = center[0] + v.co.x * size[0]
        v.co.y = center[1] + v.co.y * size[1]
        v.co.z = center[2] + v.co.z * size[2]


def mesh_from_bm(name, bm):
    me = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    return me


def box_object(name, center, size, mat, coll, collision=True):
    bm = bmesh.new()
    add_box(bm, (0, 0, 0), size)
    obj = new_object(name, mesh_from_bm(name, bm), coll, mat, collision)
    obj.location = center
    return obj


def parent_keep(obj, parent, location, rotation=(0, 0, 0)):
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = location
    obj.rotation_euler = rotation
    obj.scale = (1, 1, 1)
    return obj


def qa_material(name, rgb):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bs = mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*rgb, 1)
    for socket in ('Emission Color', 'Emission'):
        if socket in bs.inputs:
            bs.inputs[socket].default_value = (*rgb, 1)
            break
    if 'Emission Strength' in bs.inputs:
        bs.inputs['Emission Strength'].default_value = 2.0
    mat.diffuse_color = (*rgb, 1)
    return mat


def wipe():
    doomed = []
    for obj in bpy.data.objects:
        name = obj.name
        if name.startswith(('ANCHOR.', 'Home.Check_', 'QA.')):
            doomed.append(obj)
        elif name.startswith('Home.KitchenDoor') and name not in WALLS:
            doomed.append(obj)
        elif name == 'Home.LowBench':
            doomed.append(obj)
    for obj in doomed:
        mesh = obj.data if obj.type == 'MESH' else None
        bpy.data.objects.remove(obj, do_unlink=True)
        if mesh and mesh.users == 0:
            bpy.data.meshes.remove(mesh)


def build_leaf(wood, walls):
    """Closed wooden panel door. The grooves are 4 mm deep and do not pierce the leaf."""
    bm = bmesh.new()
    index = {}

    def v(p):
        vert = index.get(p)
        if vert is None:
            vert = bm.verts.new(p)
            index[p] = vert
        return vert

    def f(pts):
        bm.faces.new([v(p) for p in pts])

    xo = LEAF_T / 2
    xi = 0.016
    y_s, y_si = -LEAF_W / 2, -LEAF_W / 2 + 0.08
    y_ni, y_n = LEAF_W / 2 - 0.08, LEAF_W / 2
    z_b, z_bi = -LEAF_H / 2, -LEAF_H / 2 + 0.10
    z_mb, z_mt = -0.05, 0.05
    z_ti, z_t = LEAF_H / 2 - 0.10, LEAF_H / 2
    bands = (z_b, z_bi, z_mb, z_mt, z_ti, z_t)
    panel_bands = {1, 3}

    # Perimeter faces are split on the same bands as the stiles and rails.
    # One big quad would leave T-junctions, and those edges render as slits.
    for i in range(len(bands) - 1):
        z0, z1 = bands[i], bands[i + 1]
        f([(xo, y_s, z0), (xo, y_s, z1), (-xo, y_s, z1), (-xo, y_s, z0)])
        f([(xo, y_n, z0), (-xo, y_n, z0), (-xo, y_n, z1), (xo, y_n, z1)])
    for y0, y1 in ((y_s, y_si), (y_si, y_ni), (y_ni, y_n)):
        f([(-xo, y0, z_b), (-xo, y1, z_b), (xo, y1, z_b), (xo, y0, z_b)])
        f([(-xo, y0, z_t), (xo, y0, z_t), (xo, y1, z_t), (-xo, y1, z_t)])

    def side(sign):
        outer = sign * xo
        inner = sign * xi
        flip = sign < 0

        def q(pts):
            f(list(reversed(pts)) if flip else pts)

        def front(y0, y1, z0, z1, x):
            q([(x, y0, z0), (x, y1, z0), (x, y1, z1), (x, y0, z1)])

        for i in range(len(bands) - 1):
            z0, z1 = bands[i], bands[i + 1]
            front(y_s, y_si, z0, z1, outer)
            front(y_ni, y_n, z0, z1, outer)
            if i not in panel_bands:
                front(y_si, y_ni, z0, z1, outer)
                continue
            front(y_si, y_ni, z0, z1, inner)
            # Reveal walls close the groove. They face the panel, not the room behind it.
            q([(inner, y_si, z0), (outer, y_si, z0), (outer, y_ni, z0), (inner, y_ni, z0)])
            q([(inner, y_si, z1), (inner, y_ni, z1), (outer, y_ni, z1), (outer, y_si, z1)])
            q([(inner, y_si, z0), (inner, y_si, z1), (outer, y_si, z1), (outer, y_si, z0)])
            q([(inner, y_ni, z0), (outer, y_ni, z0), (outer, y_ni, z1), (inner, y_ni, z1)])

    side(1)
    side(-1)
    bm.normal_update()
    open_edges = [e for e in bm.edges if len(e.link_faces) != 2]
    if open_edges:
        raise SystemExit(f'kitchen door leaf is not a closed shell: {len(open_edges)} open edges')
    bad_normals = []
    for face in bm.faces:
        c = face.calc_center_median()
        n = face.normal
        if abs(n.x) > 0.9:
            ok = n.x * c.x > 0
        elif abs(n.y) > 0.9:
            # Outer stiles point out. The groove walls point into the panel.
            ok = (n.y * c.y > 0) if abs(c.y) > 0.40 else (n.y * c.y < 0)
        elif abs(c.z) > 0.95:
            ok = n.z * c.z > 0
        else:
            # Groove top points down into the panel; groove bottom points up into it.
            def near(a, b):
                return abs(a - b) < 1e-4
            ok = (n.z > 0 and (near(c.z, z_bi) or near(c.z, z_mt))) or (n.z < 0 and (near(c.z, z_mb) or near(c.z, z_ti)))
        if not ok:
            bad_normals.append((tuple(round(v, 3) for v in c), tuple(round(v, 3) for v in n)))
    if bad_normals:
        raise SystemExit(f'kitchen door leaf normals face inward: {bad_normals}')
    mesh = mesh_from_bm('Home.KitchenDoorLeaf', bm)
    tris = sum(len(p.vertices) - 2 for p in mesh.polygons)
    if tris > 3000:
        raise SystemExit(f'kitchen door leaf exceeds the triangle budget: {tris}')
    print('LEAF tris', tris, 'verts', len(mesh.vertices))
    return new_object('Home.KitchenDoorLeaf', mesh, walls, wood, True)


def build_knob(name, metal, walls):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.028, radius2=0.028, depth=0.032)
    rot = Matrix.Rotation(math.pi / 2, 3, 'Y')
    for v in bm.verts:
        v.co = rot @ v.co
    return new_object(name, mesh_from_bm(name, bm), walls, metal, False)


def build_rose(name, metal, walls):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.042, radius2=0.042, depth=0.006)
    rot = Matrix.Rotation(math.pi / 2, 3, 'Y')
    for v in bm.verts:
        v.co = rot @ v.co
    return new_object(name, mesh_from_bm(name, bm), walls, metal, False)


def build_pin(metal, walls):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=10, radius1=0.012, radius2=0.012, depth=2.0)
    return new_object('Home.KitchenDoorPin', mesh_from_bm('Home.KitchenDoorPin', bm), walls, metal, False)


def build_bench(length, wood, props):
    bm = bmesh.new()
    half = length / 2
    add_box(bm, (0, 0, 0.16), (BENCH_DEPTH, length, 0.08))
    for sx in (-1, 1):
        for sy in (-1, 1):
            add_box(bm, (sx * (BENCH_DEPTH / 2 - 0.05), sy * (half - 0.08), -0.04), (0.05, 0.05, 0.32))
    obj = new_object('Home.LowBench', mesh_from_bm('Home.LowBench', bm), props, wood, True)
    obj.location = (-0.112 - BENCH_DEPTH / 2, 2.16 + half, BENCH_HEIGHT / 2)
    obj['length_m'] = length
    obj['brace_resists'] = 'outward'
    obj['brace_does_not_resist'] = 'inward'
    return obj


def assert_leaf_solid(scene, leaf):
    """A ray through every panel, rail and stile must hit wood, not the room beyond."""
    activate(scene)
    deps = bpy.context.evaluated_depsgraph_get()
    # The hall knob and rose sit on the stile. A hit on either is still wood-and-metal, not a hole.
    hardware = {'Home.KitchenDoorLeaf', 'Home.KitchenDoorKnobHall', 'Home.KitchenDoorRoseHall'}
    holes = []
    for y in (-0.41, -0.20, 0.0, 0.20, 0.41):
        for z in (-0.85, -0.47, -0.08, 0.0, 0.08, 0.47, 0.88, 0.95):
            origin = leaf.matrix_world @ Vector((0.12, y, z))
            direction = (leaf.matrix_world.to_3x3() @ Vector((-1.0, 0.0, 0.0))).normalized()
            hit, point, _normal, _index, obj, _matrix = scene.ray_cast(deps, origin, direction, distance=0.25)
            local = leaf.matrix_world.inverted() @ point if hit else None
            if (not hit or obj is None or obj.name not in hardware or local is None
                    or local.x < -0.005 or local.x > 0.08
                    or abs(local.y - y) > 0.06 or abs(local.z - z) > 0.06):
                holes.append((round(y, 3), round(z, 3), None if obj is None else obj.name))
    if holes:
        raise SystemExit(f'door leaf has see-through gaps: {holes}')
    print('LEAF solid samples', 40)


def marker(name, loc, coll, beat):
    obj = bpy.data.objects.new(name, None)
    coll.objects.link(obj)
    obj.location = loc
    obj.empty_display_type = 'ARROWS'
    obj.empty_display_size = 0.45
    obj['role'] = 'layout anchor, not an actor'
    obj['beat'] = beat
    return obj


def camera(name, pos, target, coll_scene, lens, proves):
    data = bpy.data.cameras.new(name)
    obj = bpy.data.objects.new(name, data)
    coll_scene.collection.objects.link(obj)
    obj.location = pos
    obj.rotation_euler = (Vector(target) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    data.sensor_fit = 'HORIZONTAL'
    data.lens = lens
    data.clip_start = 0.05
    data.clip_end = 80
    obj['proves'] = proves
    return obj


def ribbon(name, points, half, z, mat, coll):
    pts = [Vector((p[0], p[1], 0)) for p in points]
    sides = []
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)])
        d.z = 0
        if d.length < 1e-6:
            d = Vector((1, 0, 0))
        d.normalize()
        sides.append(Vector((-d.y, d.x, 0)) * half)
    bm = bmesh.new()
    left, right = [], []
    for p, side in zip(pts, sides):
        left.append(bm.verts.new((p.x + side.x, p.y + side.y, z)))
        right.append(bm.verts.new((p.x - side.x, p.y - side.y, z)))
    bm.verts.ensure_lookup_table()
    for i in range(len(pts) - 1):
        bm.faces.new((left[i], left[i + 1], right[i + 1], right[i]))
    obj = new_object(name, mesh_from_bm(name, bm), coll, mat, False)
    obj.hide_render = True
    return obj


def fan(name, origin, points, z, mat, coll):
    bm = bmesh.new()
    hub = bm.verts.new((origin[0], origin[1], z))
    ring = [bm.verts.new((p[0], p[1], z)) for p in points]
    bm.verts.ensure_lookup_table()
    for a, b in zip(ring, ring[1:]):
        bm.faces.new((hub, a, b))
    obj = new_object(name, mesh_from_bm(name, bm), coll, mat, False)
    obj.hide_render = True
    return obj


def build():
    scene = activate(bpy.data.scenes['EP01_Apartment'])
    wipe()
    wood = bpy.data.materials['EP01.wood']
    metal = bpy.data.materials['EP01.metal']
    walls = bpy.data.collections['HOME | walls and openings']
    props = bpy.data.collections['HOME | furniture and story props']
    anchors = bpy.data.collections['HOME | action anchors']
    qa = bpy.data.collections.get('HOME | QA overlays')
    if qa is None:
        qa = bpy.data.collections.new('HOME | QA overlays')
    if qa.name not in scene.collection.children:
        scene.collection.children.link(qa)
    qa.hide_render = True
    qa.hide_viewport = False

    hinge = bpy.data.objects.new('Home.KitchenDoorHinge', None)
    link(hinge, walls)
    hinge.empty_display_type = 'PLAIN_AXES'
    hinge.empty_display_size = 0.2
    hinge.location = HINGE
    hinge['opens'] = 'inward'
    hinge['open_angle_deg'] = -90.0
    hinge['open_angle_min_deg'] = -90.0
    hinge['open_angle_max_deg'] = 0.0
    hinge['hinge_side'] = 'north'
    hinge['latch_side'] = 'south'
    try:
        hinge.id_properties_ui('open_angle_deg').update(
            min=-90.0, max=0.0,
            description='Safe hinge Z rotation in degrees. 0 is closed. Negative opens inward, toward -X, into the kitchen.')
    except Exception as exc:
        print('id_properties_ui', exc)

    leaf = build_leaf(wood, walls)
    parent_keep(leaf, hinge, LEAF_OFFSET)
    pin = build_pin(metal, walls)
    parent_keep(pin, hinge, (0, 0, 1.02))
    # Knobs sit on the latch stile, clear of the panel groove.
    for name, x in (('Home.KitchenDoorKnobHall', 0.036), ('Home.KitchenDoorKnobKitchen', -0.036)):
        parent_keep(build_knob(name, metal, walls), leaf, (x, -0.41, 0.03))
    for name, x in (('Home.KitchenDoorRoseHall', 0.023), ('Home.KitchenDoorRoseKitchen', -0.023)):
        parent_keep(build_rose(name, metal, walls), leaf, (x, -0.41, 0.03))

    # Jambs and head fill the 1.05 m x 2.25 m opening. Stops sit on the corridor
    # side of the leaf so a push from the hall swings it toward -X.
    box_object('Home.KitchenDoorJambSouth', (-1.5, 1.0275, 1.015), (0.22, 0.055, 2.03), wood, walls)
    box_object('Home.KitchenDoorJambNorth', (-1.5, 2.0225, 1.015), (0.22, 0.055, 2.03), wood, walls)
    box_object('Home.KitchenDoorHead', (-1.5, 1.525, 2.14), (0.22, 1.05, 0.22), wood, walls)
    box_object('Home.KitchenDoorStopSouth', (-1.479, 1.0775, 1.025), (0.038, 0.045, 1.95), wood, walls)
    box_object('Home.KitchenDoorStopNorth', (-1.479, 1.9775, 1.025), (0.038, 0.035, 1.95), wood, walls)
    box_object('Home.KitchenDoorStopHead', (-1.479, 1.53, 2.035), (0.038, 0.86, 0.02), wood, walls)

    activate(scene)
    corners = [leaf.matrix_world @ Vector(c) for c in leaf.bound_box]
    hall_x = max(c.x for c in corners)
    leaf_y0 = min(c.y for c in corners)
    leaf_y1 = max(c.y for c in corners)
    if not hall_x < -1.5:
        raise SystemExit(f'closed leaf crosses x=-1.5: {hall_x}')
    # Latch-side contact on the hall face, and the solid wall just south of the living door.
    p_door = Vector((hall_x, leaf_y0 + 0.04, BENCH_HEIGHT / 2))
    p_wall = Vector((-0.11, 0.88, BENCH_HEIGHT / 2))
    delta = Vector((p_wall.x - p_door.x, p_wall.y - p_door.y, 0))
    length = delta.length
    direction = delta / length
    center = (Vector((p_door.x, p_door.y, 0)) + Vector((p_wall.x, p_wall.y, 0))) / 2
    center.z = BENCH_HEIGHT / 2
    psi = math.atan2(-direction.x, direction.y)

    bench = build_bench(length, wood, props)
    brace = marker('ANCHOR.BENCH_BRACE', center, anchors, 'EP02 bench braced on the hall face of the kitchen door')
    brace.rotation_euler = (0, 0, psi)
    bench['brace_location'] = list(center)
    bench['brace_euler_z_deg'] = math.degrees(psi)

    marks = {
        'ANCHOR.GANAA_MITTENS': ((1.40, 2.70, 0), 'mittens, living room, with Altan'),
        'ANCHOR.GANAA_STEP_TO_CRY': ((0.90, 3.15, 0), 'involuntary step toward the bedroom cry'),
        'ANCHOR.GANAA_INSIDE_BRACE': ((-2.10, 1.42, 0), 'inside the kitchen, right hand on the latch edge'),
        'ANCHOR.ALTAN_MITTENS': ((1.05, 2.35, 0), 'mittens, living room'),
        'ANCHOR.ALTAN_EXIT': ((-0.85, 0.18, 0), 'pulled to the front door'),
        'ANCHOR.TSETSEGMAA_STOPS_TUNGALAG': ((-0.55, 3.90, 0), 'stops Tungalag short of the bedroom'),
        'ANCHOR.TSETSEGMAA_PULLS_ALTAN': ((-0.60, 0.50, 0), 'pulls Altan toward the exit'),
        'ANCHOR.DULMAA_HOLDS_DOOR': ((-0.80, -0.12, 0), 'holds the apartment front door open'),
        'ANCHOR.TUNGALAG_TO_BEDROOM': ((-0.70, 4.25, 0), 'heading for the bedroom'),
        'ANCHOR.TUNGALAG_INFANT': ((-2.85, 5.75, 0), 'at the infant, after the kitchen door is shut'),
        'ANCHOR.SUKHEE_APPROACH': ((0.55, 1.55, 0), 'approaches the kitchen door from the living room'),
        'ANCHOR.SUKHEE_PUSH': ((-0.90, 1.50, 0), 'turns the hall knob and pushes'),
        'ANCHOR.GUEST_BRACE_BENCH': ((-0.45, 1.50, 0), 'braces the bench against the door'),
        'ANCHOR.GUEST_LIVING_1': ((1.70, 2.20, 0), 'living-room guest'),
        'ANCHOR.GUEST_LIVING_2': ((3.90, 4.35, 0), 'living-room guest'),
        'ANCHOR.GUEST_LIVING_3': ((2.10, 4.55, 0), 'living-room guest'),
        'ANCHOR.MITTEN_2_TABLE': ((3.15, 3.40, 0.84), 'second mitten on the cake table'),
    }
    for name, (loc, beat) in marks.items():
        marker(name, loc, anchors, beat)

    # Standing shots use 1.58 m and an 18 mm lens. check_b and check_d are 20 mm
    # high views. check_f is the high kitchen view of the open leaf.
    camera('Home.Check_a', (-0.55, 1.55, 1.58), (-1.55, 1.35, 0.90), scene, 18,
           'From Sükhee\'s push position: corridor floor, frame, knob and the leaf')
    camera('Home.Check_b', (-0.70, 2.85, 2.20), (-0.85, 1.05, 0.35), scene, 20,
           'Both ends of the braced bench: hall face of the leaf and the opposite wall')
    camera('Home.Check_c', (-4.20, 4.20, 1.58), (-2.50, 5.55, 0.72), scene, 18,
           'From the bedroom: infant blanket on the bed, and the door back to the corridor')
    camera('Home.Check_d', (-0.2, -4.4, 11.5), (-0.6, 1.8, 0.1), scene, 20,
           'Exit route: living-room door, corridor, front door, landing and stairs')
    camera('Home.Check_e', (3.4, 1.0, 1.58), (-1.4, 1.6, 1.0), scene, 18,
           'Living-room crowd at eye height, through the doorway to the closed kitchen door')
    camera('Home.Check_f', (-3.2, 0.85, 2.30), (-1.3, 1.75, 0.55), scene, 18,
           'Fully open leaf stays inside the kitchen and the corridor floor stays clear')

    arc = []
    for i in range(19):
        hinge.rotation_euler.z = math.radians(-90.0 * i / 18)
        activate(scene)
        arc.append(leaf.matrix_world @ Vector((0, -LEAF_W / 2, 0)))
    hinge.rotation_euler.z = 0.0
    activate(scene)
    orange = qa_material('QA.arc', (0.86, 0.32, 0.06))
    blue = qa_material('QA.brace', (0.12, 0.32, 0.82))
    green = qa_material('QA.exit_bedroom', (0.12, 0.62, 0.24))
    yellow = qa_material('QA.exit_living', (0.86, 0.72, 0.12))
    fan('QA.SwingFan', (HINGE.x, HINGE.y), arc, 0.025, orange, qa)
    ribbon('QA.SwingArc', arc, 0.035, 0.04, orange, qa)
    ribbon('QA.ExitBedroom', BEDROOM_EXIT, 0.06, 0.045, green, qa)
    ribbon('QA.ExitLiving', LIVING_EXIT, 0.06, 0.05, yellow, qa)
    ghost = box_object('QA.Brace', (0, 0, 0), (BENCH_DEPTH, length, 0.02), blue, qa, False)
    ghost.location = (center.x, center.y, 0.06)
    ghost.rotation_euler = (0, 0, psi)
    ghost.hide_render = True

    worst = -1e9
    for i in range(19):
        hinge.rotation_euler.z = math.radians(-90.0 * i / 18)
        activate(scene)
        xs = [(leaf.matrix_world @ Vector(c)).x for c in leaf.bound_box]
        worst = max(worst, max(xs))
    hinge.rotation_euler.z = 0.0
    activate(scene)
    if not worst < -1.5:
        raise SystemExit(f'sweep crosses x=-1.5: {worst}')
    if hinge.animation_data or leaf.animation_data:
        raise SystemExit('door was keyed')

    scene['layout_status'] = 'Kitchen door opens inward on the north hinge; hall bench and EP02 brace anchor'
    scene['kitchen_door_opens'] = 'inward'
    assert_leaf_solid(scene, leaf)
    print('LEAF hall_x', round(hall_x, 4), 'y', round(leaf_y0, 4), round(leaf_y1, 4))
    print('BENCH length', round(length, 4), 'rest', tuple(round(v, 3) for v in bench.location), 'brace_z_deg', round(math.degrees(psi), 2))
    print('SPAN straight', round(-0.11 - hall_x, 4), 'centerline 1.5', 'diagonal', round(length, 4))
    print('SWEEP max_x', round(worst, 4))
    print('MARKS', len(marks))


if __name__ == '__main__':
    build()
    bpy.ops.wm.save_mainfile()
    print('SAVED', bpy.data.filepath)
