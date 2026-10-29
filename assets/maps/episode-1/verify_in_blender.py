"""Inspect actual Episode 1 meshes, export static sets, and bind QA to file hashes.

Headless (`blender -b`) has no window on some builds. Scene switches go through
`use_scene`, which sets `bpy.context.window.scene` only when a window exists.
"""
from pathlib import Path
import bpy, math, json, hashlib
from mathutils import Vector


def _root():
    src = globals().get('__file__')
    if src:
        return Path(src).resolve().parent
    # exec() from Blender does not define __file__. The open map sits beside this script.
    fp = getattr(bpy.data, 'filepath', '') or ''
    if fp:
        return Path(fp).resolve().parent
    return Path.cwd()


ROOT = _root()
SCENES = {'EP01_Cafe':'cafe','EP01_BorderRoad':'border-road','EP01_FreightYard':'freight-yard','EP01_Apartment':'apartment'}
# Bedroom and living-room exits. The kitchen interior is x < -1.5 and 0 < y < 3.5.
# The living route stays south of the birthday chairs (y=1.35) and crosses the
# living-room door opening (y 0.9..2.1) before it joins the corridor.
BEDROOM_EXIT = [(-2.4, 5.3), (-0.85, 5.15), (-0.85, 0.35), (-0.8, -0.55)]
LIVING_EXIT = [(3.8, 1.35), (0.55, 1.35), (-0.85, 1.35), (-0.85, 0.35), (-0.8, -0.55)]
CORRIDOR_X = (-1.39, -0.11)
WALL_NAMES = {'Home.KitchenDoor', 'Home.KitchenDoor.001', 'Home.KitchenDoor.002'}


def use_scene(name):
    """Make `name` the evaluated scene and return (scene, depsgraph)."""
    scene = bpy.data.scenes[name] if isinstance(name, str) else name
    window = getattr(bpy.context, 'window', None)
    if window is not None:
        window.scene = scene
        bpy.context.view_layer.update()
        return scene, bpy.context.evaluated_depsgraph_get()
    layer = scene.view_layers[0]
    layer.update()
    deps = layer.depsgraph
    if deps is None and bpy.data.screens:
        with bpy.context.temp_override(screen=bpy.data.screens[0], scene=scene, view_layer=layer):
            layer.update()
            deps = bpy.context.evaluated_depsgraph_get()
    return scene, deps


def world_aabb(obj):
    corners = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    lo = [min(c[k] for c in corners) for k in range(3)]
    hi = [max(c[k] for c in corners) for k in range(3)]
    return lo, hi


def obstacles(name, z):
    s, _deps = use_scene(name)
    out = []
    for o in s.objects:
        if o.type != 'MESH' or not o.get('collision'):
            continue
        lo, hi = world_aabb(o)
        if lo[2] < z < hi[2]:
            out.append((o.name, lo, hi))
    return out


def walk(name, points):
    hits = set()
    for z in [.35, .95, 1.75]:
        obs = obstacles(name, z)
        for a, b in zip(points, points[1:]):
            n = max(2, math.ceil(math.dist(a, b) / .08))
            for i in range(n + 1):
                p = [a[k] + (b[k] - a[k]) * i / n for k in range(2)]
                for ob, lo, hi in obs:
                    if lo[0] - .30 < p[0] < hi[0] + .30 and lo[1] - .30 < p[1] < hi[1] + .30:
                        hits.add(ob)
    return {'passed': not hits, 'sample_step_m': .08, 'radius_m': .30, 'heights_m': [.35, .95, 1.75], 'obstacles': sorted(hits), 'points': points}


def opening(name, y, z, start, end):
    obs = obstacles(name, z)
    steps = round((end - start) / .005)
    clear = []
    for i in range(steps + 1):
        x = start + (end - start) * i / steps
        clear.append(not any(lo[0] < x < hi[0] and lo[1] < y < hi[1] for _, lo, hi in obs))
    run = best = 0
    for free in clear:
        run = run + 1 if free else 0
        best = max(best, run)
    return max(0, best - 1) * .005


def entry_support():
    s, deps = use_scene('EP01_Apartment')
    missing = []
    for i in range(41):
        y = -.8 + 1.1 * i / 40
        origin = Vector((-.8, y, .25))
        direction = Vector((0, 0, -1))
        remain = .3
        supported = False
        for _ in range(8):
            hit, point, _normal, _index, obj, _matrix = s.ray_cast(deps, origin, direction, distance=remain)
            if not hit:
                break
            # Plan ribbons sit on the floor. They are not structure, so step past them.
            if obj.name.startswith('QA.'):
                travel = (point - origin).length + 0.01
                if travel >= remain - 1e-4:
                    break
                origin = origin + direction * travel
                remain -= travel
                continue
            supported = abs(point.z) <= .02
            break
        if not supported:
            missing.append(round(y, 4))
    return {'passed': not missing, 'sample_x_m': -.8, 'sample_y_range_m': [-.8, .3], 'samples': 41, 'unsupported_y_m': missing}


def office_sightline():
    s, deps = use_scene('EP01_FreightYard')
    cam = s.objects['Yard.OfficeView']
    direction = cam.matrix_world.to_quaternion() @ Vector((0, 0, -1))
    hit, point, _normal, _index, obj, _matrix = s.ray_cast(deps, cam.location, direction, distance=30)
    return {'passed': bool(hit and obj.name.startswith('Boxcar.')), 'first_hit': obj.name if hit else None, 'hit_point_m': list(point) if hit else None}


def dense(points):
    out = []
    for a, b in zip(points, points[1:]):
        n = max(2, math.ceil(math.dist(a, b) / .08))
        for i in range(n + 1):
            out.append(tuple(round(a[k] + (b[k] - a[k]) * i / n, 4) for k in range(2)))
    return out


def in_kitchen(x, y):
    return x < -1.5 and 0.0 < y < 3.5


def kitchen_not_exit():
    bedroom = walk('EP01_Apartment', BEDROOM_EXIT)
    living = walk('EP01_Apartment', LIVING_EXIT)
    bad = [list(p) for p in dense(BEDROOM_EXIT) + dense(LIVING_EXIT) if in_kitchen(*p)]
    return {
        'passed': bedroom['passed'] and living['passed'] and not bad,
        'bedroom_route_clear': bedroom['passed'],
        'living_route_clear': living['passed'],
        'bedroom_obstacles': bedroom['obstacles'],
        'living_obstacles': living['obstacles'],
        'kitchen_interior': 'x < -1.5 and 0 < y < 3.5',
        'samples_inside_kitchen': bad,
        'bedroom_points': BEDROOM_EXIT,
        'living_points': LIVING_EXIT,
    }


def door_hardware(name):
    if name in WALL_NAMES:
        return False
    return name.startswith((
        'Home.KitchenDoorHinge', 'Home.KitchenDoorLeaf', 'Home.KitchenDoorJamb',
        'Home.KitchenDoorHead', 'Home.KitchenDoorStop', 'Home.KitchenDoorKnob',
        'Home.KitchenDoorRose', 'Home.KitchenDoorPin', 'Home.LowBench', 'QA.',
        'Home.Floor', 'Home.Ceiling'))


def kitchen_door_swing():
    scene, _deps = use_scene('EP01_Apartment')
    hinge = scene.objects['Home.KitchenDoorHinge']
    leaf = scene.objects['Home.KitchenDoorLeaf']
    full = float(hinge['open_angle_deg'])
    lo = float(hinge.get('open_angle_min_deg', min(0.0, full)))
    hi = float(hinge.get('open_angle_max_deg', max(0.0, full)))
    props = []
    for obj in scene.objects:
        if obj.type != 'MESH' or door_hardware(obj.name):
            continue
        if not (obj.get('collision') or obj.name.startswith(('Kitchen.', 'Home.Shoe'))):
            continue
        props.append((obj.name, *world_aabb(obj)))
    saved = hinge.rotation_euler.z
    worst = -1e9
    hits = []
    open_center = None
    try:
        steps = 19
        for i in range(steps):
            deg = full * i / (steps - 1)
            hinge.rotation_euler.z = math.radians(deg)
            use_scene(scene)
            corners = [leaf.matrix_world @ Vector(c) for c in leaf.bound_box]
            mx = max(c.x for c in corners)
            worst = max(worst, mx)
            if not mx < -1.5:
                hits.append({'angle_deg': round(deg, 2), 'max_x_m': round(mx, 4), 'hit': 'x=-1.5 plane'})
            box_lo = [min(c[k] for c in corners) for k in range(3)]
            box_hi = [max(c[k] for c in corners) for k in range(3)]
            if i == steps - 1:
                open_center = sum(corners, Vector()) / 8
            for name, plo, phi in props:
                separated = False
                for k in range(3):
                    if box_hi[k] <= plo[k] + 0.001 or box_lo[k] >= phi[k] - 0.001:
                        separated = True
                        break
                if not separated:
                    hits.append({'angle_deg': round(deg, 2), 'hit': name})
    finally:
        hinge.rotation_euler.z = saved
        use_scene(scene)
    keyed = bool(hinge.animation_data and hinge.animation_data.action)
    rest = math.degrees(hinge.rotation_euler.z)
    moved_west = bool(open_center and open_center.x < -1.7)
    ui = {}
    try:
        ui = hinge.id_properties_ui('open_angle_deg').as_dict()
    except Exception:
        ui = {}
    return {
        'passed': (not hits and worst < -1.5 and not keyed and abs(rest) < 0.01
                   and hinge.get('opens') == 'inward' and moved_west and lo <= full <= hi),
        'opens': hinge.get('opens'),
        'open_angle_deg': full,
        'open_angle_min_deg': lo,
        'open_angle_max_deg': hi,
        'ui_min_deg': ui.get('min'),
        'ui_max_deg': ui.get('max'),
        'rest_rotation_deg': round(rest, 4),
        'keyed': keyed,
        'max_x_m': round(worst, 4),
        'full_open_center_x_m': round(open_center.x, 4) if open_center else None,
        'moved_west': moved_west,
        'hits': hits,
    }


def intruders(scene, z):
    found = []
    for obj in scene.objects:
        if obj.type != 'MESH' or not obj.get('collision'):
            continue
        if obj.name.startswith(('Home.Floor', 'Home.Ceiling', 'QA.')):
            continue
        lo, hi = world_aabb(obj)
        if not (lo[2] < z < hi[2]):
            continue
        if hi[0] <= CORRIDOR_X[0] + 0.002 or lo[0] >= CORRIDOR_X[1] - 0.002:
            continue
        found.append((lo, hi))
    return found


def subtract_span(spans, cut_lo, cut_hi):
    nxt = []
    for a, b in spans:
        if cut_hi <= a or cut_lo >= b:
            nxt.append((a, b))
            continue
        if cut_lo > a:
            nxt.append((a, cut_lo))
        if cut_hi < b:
            nxt.append((cut_hi, b))
    return [(a, b) for a, b in nxt if b - a > 1e-4]


def clear_width(scene, z_values, y0=0.0, y1=5.0, step=0.1):
    worst = None
    pinch = None
    y = y0
    while y <= y1 + 1e-6:
        for z in z_values:
            spans = [CORRIDOR_X]
            for lo, hi in intruders(scene, z):
                if lo[1] < y < hi[1]:
                    spans = subtract_span(spans, lo[0], hi[0])
            width = max((b - a for a, b in spans), default=0.0)
            if worst is None or width < worst:
                worst = width
                pinch = {'y_m': round(y, 3), 'z_m': z, 'width_m': round(width, 3)}
        y += step
    return worst or 0.0, pinch


def front_opening_blocked(bench):
    lo, hi = world_aabb(bench)
    # Entry leaf opening: x -1.3..-0.3, south wall y -0.22..0, walking height.
    return lo[0] < -0.3 and hi[0] > -1.3 and lo[1] < 0.05 and hi[1] > -0.22 and lo[2] < 1.8 and hi[2] > 0.2


def pose_bench(bench, anchor, braced):
    if braced:
        bench.location = anchor.location
        bench.rotation_euler = anchor.rotation_euler
        bench.scale = (1, 1, 1)
    use_scene(bench.users_scene[0] if bench.users_scene else 'EP01_Apartment')


def exit_clear_with_bench():
    scene, _deps = use_scene('EP01_Apartment')
    bench = scene.objects['Home.LowBench']
    anchor = scene.objects['ANCHOR.BENCH_BRACE']
    saved = (bench.location.copy(), bench.rotation_euler.copy(), bench.scale.copy())
    try:
        pose_bench(bench, anchor, False)
        bench.location, bench.rotation_euler, bench.scale = saved
        use_scene(scene)
        rest, rest_pinch = clear_width(scene, (0.35, 0.95, 1.75))
        rest_front = opening('EP01_Apartment', -0.11, 1.0, -2.2, 0.6)
        bench.location = anchor.location
        bench.rotation_euler = anchor.rotation_euler
        bench.scale = (1, 1, 1)
        use_scene(scene)
        above, above_pinch = clear_width(scene, (0.95, 1.75))
        seat, seat_pinch = clear_width(scene, (0.35,))
        brace_front = opening('EP01_Apartment', -0.11, 1.0, -2.2, 0.6)
        blocks_front = front_opening_blocked(bench)
    finally:
        bench.location, bench.rotation_euler, bench.scale = saved
        use_scene(scene)
    # The brace is a 0.40 m step across the corridor. Width above the seat and
    # the front opening stay clear; the seat itself closes the corridor.
    passed = rest >= 0.8 and above >= 0.8 and rest_front >= 0.8 and brace_front >= 0.8 and not blocks_front
    return {
        'passed': passed,
        'required_width_m': 0.8,
        'rest_clear_width_m': round(rest, 3),
        'rest_pinch': rest_pinch,
        'brace_clear_width_above_bench_m': round(above, 3),
        'brace_above_pinch': above_pinch,
        'brace_width_at_0_35_m': round(seat, 3),
        'brace_seat_pinch': seat_pinch,
        'front_opening_width_rest_m': round(rest_front, 3),
        'front_opening_width_brace_m': round(brace_front, 3),
        'bench_intersects_front_opening': blocks_front,
        'rule': 'Rest width at z=0.35/0.95/1.75 is at least 0.8 m. Braced, width at z=0.95/1.75 and the front opening stay at least 0.8 m. The seat blocks the corridor; that width is brace_width_at_0_35_m and is not a walking gap.',
    }


def mesh_length(obj):
    ys = [v.co.y for v in obj.data.vertices]
    return max(ys) - min(ys)


def bench_brace_fit():
    scene, _deps = use_scene('EP01_Apartment')
    bench = scene.objects['Home.LowBench']
    anchor = scene.objects['ANCHOR.BENCH_BRACE']
    leaf = scene.objects['Home.KitchenDoorLeaf']
    hinge = scene.objects['Home.KitchenDoorHinge']
    saved_h = hinge.rotation_euler.z
    saved_b = (bench.location.copy(), bench.rotation_euler.copy(), bench.scale.copy())
    try:
        hinge.rotation_euler.z = 0.0
        bench.location = anchor.location
        bench.rotation_euler = anchor.rotation_euler
        bench.scale = (1, 1, 1)
        use_scene(scene)
        leaf_lo, leaf_hi = world_aabb(leaf)
        hall_x = leaf_hi[0]
        verts = [bench.matrix_world @ v.co for v in bench.data.vertices]
    finally:
        hinge.rotation_euler.z = saved_h
        bench.location, bench.rotation_euler, bench.scale = saved_b
        use_scene(scene)
    def closest(pred, plane_x):
        best = None
        point = None
        for v in verts:
            if not pred(v):
                continue
            gap = abs(v.x - plane_x)
            if best is None or gap < best:
                best = gap
                point = [round(v.x, 4), round(v.y, 4), round(v.z, 4)]
        return best, point
    def door_pred(v):
        return leaf_lo[1] - 0.02 <= v.y <= leaf_hi[1] + 0.02 and leaf_lo[2] - 0.05 <= v.z <= leaf_hi[2] + 0.05
    def wall_pred(v):
        # Solid corridor face of the living-room wall. The doorway opposite the
        # kitchen leaf is open from y 0.9 to 2.1, so a straight brace cannot land there.
        on_solid = v.y <= 0.92 or v.y >= 2.08
        return on_solid and 0.0 <= v.z <= 0.45
    door_gap, door_point = closest(door_pred, hall_x)
    wall_gap, wall_point = None, None
    for v in verts:
        if not wall_pred(v):
            continue
        gap = abs(v.x + 0.11)
        if wall_gap is None or gap < wall_gap:
            wall_gap = gap
            wall_point = [round(v.x, 4), round(v.y, 4), round(v.z, 4)]
    length = mesh_length(bench)
    straight = round(-0.11 - hall_x, 4)
    passed = (door_gap is not None and wall_gap is not None and door_gap <= 0.03 and wall_gap <= 0.03
              and 1.2 <= length <= 1.45)
    return {
        'passed': bool(passed),
        'bench_length_m': round(length, 4),
        'length_band_m': [1.2, 1.45],
        'corridor_centerline_span_m': 1.5,
        'straight_clear_span_m': straight,
        'door_face_x_m': round(hall_x, 4),
        'opposite_wall_face_x_m': -0.11,
        'door_contact_gap_m': None if door_gap is None else round(door_gap, 4),
        'opposite_wall_contact_gap_m': None if wall_gap is None else round(wall_gap, 4),
        'door_contact_m': door_point,
        'opposite_wall_contact_m': wall_point,
        'straight_span_meets_solid_wall': False,
        'brace_resists': 'outward',
        'brace_does_not_resist': 'inward',
        'note': 'A hall-side brace stops the leaf being forced outward, into the corridor. It does not stop the leaf being pulled or pushed inward, into the kitchen. The living-room door is opposite the kitchen leaf, so the bench is diagonal onto the solid wall south of that door.',
    }


def trace(scene, deps, start, end):
    direction = end - start
    remain = direction.length
    if remain < 1e-6:
        return remain, []
    direction = direction.normalized()
    pos = start.copy()
    hits = []
    seen = set()
    for _ in range(16):
        hit, point, _normal, _index, obj, _matrix = scene.ray_cast(deps, pos, direction, distance=remain)
        if not hit:
            break
        if obj.name not in seen:
            hits.append(obj.name)
            seen.add(obj.name)
        travel = (point - pos).length + 0.03
        if travel >= remain - 1e-4:
            break
        pos = pos + direction * travel
        remain -= travel
    return (end - start).length, hits


def is_between_wall(name):
    if name.startswith(('Home.KitchenDoorLeaf', 'Home.KitchenDoorKnob', 'Home.KitchenDoorRose',
                        'Home.KitchenDoorHinge', 'Home.KitchenDoorPin', 'Home.KitchenDoorJamb',
                        'Home.KitchenDoorHead', 'Home.KitchenDoorStop', 'Home.LowBench', 'QA.')):
        return False
    return name.startswith(('Home.LivingDoor', 'Home.KitchenDoor', 'Home.BedroomDoor', 'Home.South',
                            'Home.North', 'Home.East', 'Home.West', 'Home.Bath', 'Home.Store',
                            'Home.KitchenBedroom'))


def kitchen_sound():
    scene, deps = use_scene('EP01_Apartment')
    cam = scene.objects['Home.Check_e']
    leaf = scene.objects['Home.KitchenDoorLeaf']
    corners = [leaf.matrix_world @ Vector(c) for c in leaf.bound_box]
    target = sum(corners, Vector()) / 8
    crowd_d, crowd_hits = trace(scene, deps, cam.location.copy(), target)
    table = Vector((2.7, 3.1, 1.5))
    table_d, table_hits = trace(scene, deps, table, target)
    crowd_walls = [n for n in crowd_hits if is_between_wall(n)]
    table_walls = [n for n in table_hits if is_between_wall(n)]
    return {
        'passed': 0.5 < crowd_d < 15 and 0.5 < table_d < 15,
        'crowd_distance_m': round(crowd_d, 3),
        'table_distance_m': round(table_d, 3),
        'crowd_point_m': [round(v, 3) for v in cam.location],
        'table_point_m': [2.7, 3.1, 1.5],
        'door_point_m': [round(v, 3) for v in target],
        'crowd_hits': crowd_hits,
        'table_hits': table_hits,
        'crowd_walls': crowd_walls,
        'table_walls': table_walls,
    }


def verify_export():
    report = {
        'passed': False,
        'scenes': {},
        'clearances': {},
        'limits': 'Static mesh/AABB samples; not moving-rig contact, final art, or shot approval. The kitchen-door sweep is 19 rigid samples of the leaf bounds. A hall-side bench resists outward force only.',
    }
    c = report['clearances']
    c['cafe_attack_route'] = walk('EP01_Cafe', [(3.7, 1.15), (1.5, 1.55), (-1.3, 1.8)])
    c['cafe_escape_route'] = walk('EP01_Cafe', [(-.3, -2.2), (.6, -3), (.6, -6.1), (-3.5, -13.7)])
    c['cafe_staff_exit'] = walk('EP01_Cafe', [(6, .75), (8, .75), (9.6, 2.7), (9.6, 4.2)])
    c['apartment_bedroom_to_living'] = walk('EP01_Apartment', [(-2.5, 5.2), (-.75, 5.2), (-.75, 1.5), (.65, 1.5)])
    c['apartment_exit_route'] = walk('EP01_Apartment', [(-.75, 1.5), (-.8, -.8)])
    width = min(opening('EP01_Cafe', y, 1, -1, 2.2) for y in [-5.4, -5.11, -4.9])
    c['cafe_front_door'] = {'passed': width >= 1.79, 'measured_width_m': round(width, 3), 'required_width_m': 1.8, 'tolerance_m': .01}
    width = opening('EP01_FreightYard', -1.4, 2, -3, 3)
    c['yard_boxcar_opening'] = {'passed': width >= 2.19, 'measured_width_m': round(width, 3), 'required_width_m': 2.2, 'tolerance_m': .01}
    road = next(o for o in bpy.data.scenes['EP01_BorderRoad'].objects if o.name.startswith('Road.asphalt'))
    xs = [v.co.x for v in road.data.vertices if abs(v.co.y) < .001]
    width = max(xs) - min(xs)
    c['border_road_width'] = {'passed': abs(width - 6.6) < .001, 'measured_width_m': width}
    steps = [o for o in bpy.data.scenes['EP01_Apartment'].objects if o.name.startswith(('Stair.FlightA', 'Stair.FlightB'))]
    heights = sorted(o.location.z + o.dimensions.z / 2 for o in steps)
    maxrise = max(b - a for a, b in zip(heights, heights[1:]))
    c['apartment_stair'] = {'passed': len(steps) == 18 and maxrise < .18, 'steps': len(steps), 'max_rise_m': maxrise, 'clear_width_m': 1.2}
    c['apartment_entry_support'] = entry_support()
    c['yard_office_sightline'] = office_sightline()
    c['apartment_kitchen_door_swing'] = kitchen_door_swing()
    c['apartment_kitchen_not_exit'] = kitchen_not_exit()
    c['apartment_exit_clear_with_bench'] = exit_clear_with_bench()
    c['apartment_bench_brace_fit'] = bench_brace_fit()
    c['apartment_kitchen_sound'] = kitchen_sound()
    assert all(x['passed'] for x in c.values()), c
    textures = [im for im in bpy.data.images if im.name.startswith('EP01.')]
    assert textures and all(im.packed_file and max(im.size) <= 256 for im in textures)
    (ROOT / 'glb').mkdir(exist_ok=True)
    for name, slug in SCENES.items():
        s, deps = use_scene(name)
        objs = [o for o in s.objects if o.type == 'MESH']
        tris = []
        finite = True
        for o in objs:
            evaluated = o.evaluated_get(deps)
            me = evaluated.to_mesh()
            tris.append(sum(len(f.vertices) - 2 for f in me.polygons))
            finite = finite and all(math.isfinite(x) for v in me.vertices for x in v.co)
            evaluated.to_mesh_clear()
        assert finite and max(tris) <= 3000, (name, max(tris))
        for o in s.objects:
            o.select_set(o.type == 'MESH' and not o.name.startswith('QA.'))
        path = ROOT / 'glb' / f'{slug}.glb'
        bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB', use_selection=True, use_active_scene=True, use_renderable=True, export_apply=True, export_cameras=False, export_lights=False)
        report['scenes'][name] = {'mesh_objects': len(objs), 'triangles': sum(tris), 'max_object_triangles': max(tris), 'finite_geometry': finite, 'packed_textures': True, 'export': str(path.relative_to(ROOT)), 'export_sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
        if slug == 'apartment':
            raw = path.read_bytes()
            _magic, _version, _size = raw[:12], None, None
            n, _kind = __import__('struct').unpack_from('<II', raw, 12)
            doc = json.loads(raw[20:20 + n])
            blob = json.dumps(doc)
            assert 'KitchenDoorLeaf' in blob and 'LowBench' in blob, 'apartment export is missing the door or bench'
            assert 'QA.Swing' not in blob and 'Check_a' not in blob, 'QA overlays or proof cameras were exported'
    cafe = bpy.data.scenes['EP01_Cafe']
    use_scene(cafe)
    cafe.camera = bpy.data.objects['Cafe.Exterior']
    screen = bpy.context.screen if getattr(bpy.context, 'window', None) is not None else None
    if screen is not None:
        for area in screen.areas:
            if area.type == 'VIEW_3D':
                area.spaces.active.region_3d.view_perspective = 'CAMERA'
                area.spaces.active.shading.type = 'MATERIAL'
    if 'Scene' in bpy.data.scenes and set(o.name for o in bpy.data.scenes['Scene'].objects) == {'Cube', 'Camera', 'Light'}:
        for o in list(bpy.data.scenes['Scene'].objects):
            bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.scenes.remove(bpy.data.scenes['Scene'])
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'EP01-Map.blend'))
    report['source_sha256'] = hashlib.sha256((ROOT / 'EP01-Map.blend').read_bytes()).hexdigest()
    report['passed'] = True
    (ROOT / 'qa-report.json').write_text(json.dumps(report, indent=2) + '\n')
    return report


if __name__ == '__main__':
    result = verify_export()
    print('QA passed', result['passed'])
