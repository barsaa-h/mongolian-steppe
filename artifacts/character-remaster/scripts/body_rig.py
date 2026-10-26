"""Editable body rig and procedural replacement hands for the character remaster.

All coordinates are world-space metres. Run in Blender; no scene is changed on import.
IK/FK properties use 0 = FK, 1 = IK. Call reset_pose before changing a pose preset.
"""

import math

import bpy
from mathutils import Vector


SIDES = (("L", 1.0), ("R", -1.0))
FINGERS = ("index", "middle", "ring", "pinky", "thumb")


def _smooth(a, b, value):
    t = max(0.0, min(1.0, (value - a) / (b - a)))
    return t * t * (3.0 - 2.0 * t)


def _segment_distance(point, start, end):
    delta = end - start
    t = max(0.0, min(1.0, (point - start).dot(delta) / delta.length_squared))
    return (point - start - delta * t).length


def _finger_paths(side):
    s = 1.0 if side == "L" else -1.0
    paths = {}
    for name, offset, length, radius in (
        ("index", -.025, .078, .0084),
        ("middle", -.0085, .087, .0087),
        ("ring", .009, .081, .0082),
        ("pinky", .025, .063, .0072),
    ):
        base_z = .844 + (0.0 if name in ("middle", "ring") else .004)
        x = s * (.342 + offset)
        points = [Vector((x, -.033, base_z))]
        for fraction, curl in ((.44, -.004), (.76, -.013), (1.0, -.025)):
            spread = offset * fraction * .12
            points.append(Vector((x + s * spread, -.033 + curl, base_z - length * fraction)))
        paths[name] = (points, radius)
    paths["thumb"] = ([Vector((s * .313, -.037, .895)),
                       Vector((s * .294, -.044, .878)),
                       Vector((s * .282, -.051, .858)),
                       Vector((s * .277, -.061, .840))], .0105)
    return paths


def _new_mesh(name, vertices, faces, collection, material):
    mesh = bpy.data.meshes.new(name + "_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    if material:
        mesh.materials.append(material)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    return obj


def _add_rings(vertices, faces, rings):
    start = len(vertices)
    count = len(rings[0])
    for ring in rings:
        vertices.extend(tuple(v) for v in ring)
    faces.append(tuple(start + i for i in reversed(range(count))))
    for row in range(len(rings) - 1):
        a = start + row * count
        b = a + count
        for col in range(count):
            nxt = (col + 1) % count
            faces.append((a + col, a + nxt, b + nxt, b + col))
    faces.append(tuple(start + (len(rings) - 1) * count + i for i in range(count)))


def _hand_mesh(side, collection, materials):
    s = 1.0 if side == "L" else -1.0
    vertices, faces = [], []
    rings = []
    for z, width, depth, x, y in (
        (.936, .021, .014, .334, -.028),
        (.919, .023, .014, .335, -.029),
        (.900, .029, .0155, .338, -.031),
        (.880, .036, .017, .340, -.032),
        (.859, .038, .015, .342, -.032),
        (.843, .035, .012, .342, -.033),
        (.837, .030, .009, .342, -.034),
    ):
        ring = []
        for i in range(24):
            angle = i * math.tau / 24
            cos, sin = math.cos(angle), math.sin(angle)
            # Slightly squared palm, softer thenar pad on the thumb side.
            px = math.copysign(abs(cos) ** .72, cos) * width
            py = math.copysign(abs(sin) ** .88, sin) * depth
            if px < 0 and sin < 0:
                py *= 1.10
            ring.append((s * (x + px), y + py, z))
        rings.append(ring)
    _add_rings(vertices, faces, rings)
    paths = _finger_paths(side)
    for name, (points, radius) in paths.items():
        rings = []
        for segment in range(3):
            axis = (points[segment + 1] - points[segment]).normalized()
            dorsal = Vector((0, 1, 0))
            dorsal = (dorsal - axis * dorsal.dot(axis)).normalized()
            across = dorsal.cross(axis).normalized()
            for step in range(4):
                t = step / 4
                progress = (segment + t) / 3
                center = points[segment].lerp(points[segment + 1], t)
                taper = 1 - .29 * progress
                knuckle = 1 + .09 * math.exp(-((t - .04) / .22) ** 2)
                width = radius * taper * knuckle
                depth = width * (.80 if name != "thumb" else .88)
                rings.append([center + across * (math.cos(i * math.tau / 16) * width)
                              + dorsal * (math.sin(i * math.tau / 16) * depth)
                              for i in range(16)])
        axis = (points[-1] - points[-2]).normalized()
        dorsal = (Vector((0, 1, 0)) - axis * axis.y).normalized()
        across = dorsal.cross(axis).normalized()
        for distance, scale in ((-.0015, .70), (.001, .50), (.0026, .16)):
            center = points[-1] + axis * distance
            rings.append([center + across * (math.cos(i * math.tau / 16) * radius * scale)
                          + dorsal * (math.sin(i * math.tau / 16) * radius * .8 * scale)
                          for i in range(16)])
        _add_rings(vertices, faces, rings)
    hand = _new_mesh("Hand." + side, vertices, faces, collection, materials["skin"])
    bpy.context.view_layer.objects.active = hand
    hand.select_set(True)
    remesh = hand.modifiers.new("Continuous palm and finger webbing", "REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = .0013
    remesh.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier=remesh.name)
    smooth = hand.modifiers.new("Soften skin junctions", "SMOOTH")
    smooth.factor = .55
    smooth.iterations = 3
    bpy.ops.object.modifier_apply(modifier=smooth.name)
    reduction = hand.modifiers.new("Keep curved finger silhouettes", "DECIMATE")
    reduction.ratio = .22
    bpy.ops.object.modifier_apply(modifier=reduction.name)
    hand.select_set(False)
    vertices, faces = [], []
    nail_bones = []
    for name, (points, radius) in paths.items():
        start = len(vertices)
        axis = (points[-1] - points[-2]).normalized()
        dorsal = (Vector((0, 1, 0)) - axis * axis.y).normalized()
        across = dorsal.cross(axis).normalized()
        length = (points[-1] - points[-2]).length * .72
        center = points[-1] - axis * (length * .57)
        for row in range(6):
            t = row / 5
            end_taper = .60 + .40 * math.sin(math.pi * t) ** .4
            for col in range(9):
                u = (col / 8 - .5) * 2
                p = center + axis * ((t - .5) * length)
                p += across * (u * radius * .60 * end_taper)
                p += dorsal * (radius * .59 + (1 - u * u) * .00125)
                vertices.append(tuple(p))
                nail_bones.append(f"{name}.03.{side}")
        for row in range(5):
            for col in range(8):
                a = start + row * 9 + col
                faces.append((a, a + 1, a + 10, a + 9))
    nails = _new_mesh("Nails." + side, vertices, faces, collection, materials["nails"])
    solidify = nails.modifiers.new("Nail edge", "SOLIDIFY")
    solidify.thickness = .00035
    return hand, nails, paths, nail_bones


def _make_skeleton(collection):
    data = bpy.data.armatures.new("Steppe_Production_Skeleton")
    rig = bpy.data.objects.new("Steppe_Body_Rig", data)
    collection.objects.link(rig)
    rig.show_in_front = True
    data.display_type = "OCTAHEDRAL"
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    specs = {}

    def bone(name, head, tail, parent=None, deform=True, connected=False):
        b = data.edit_bones.new(name)
        b.head, b.tail = head, tail
        if parent:
            b.parent = data.edit_bones[parent]
            b.use_connect = connected
        b.use_deform = deform
        specs[name] = (Vector(head), Vector(tail))
        return b

    bone("root", (0, 0, .02), (0, 0, .22), deform=False)
    bone("pelvis", (0, 0, .88), (0, 0, .995), "root")
    bone("spine", (0, 0, .995), (0, 0, 1.205), "pelvis", connected=True)
    bone("chest", (0, 0, 1.205), (0, 0, 1.455), "spine", connected=True)
    bone("neck", (0, 0, 1.455), (0, 0, 1.565), "chest", connected=True)
    bone("head", (0, 0, 1.565), (0, 0, 1.765), "neck", connected=True)
    bone("jaw", (0, .017, 1.625), (0, -.054, 1.593), "head")
    for side, s in SIDES:
        bone("eye." + side, (s * .035, -.064, 1.683),
             (s * .035, -.099, 1.683), "head")
        bone("clavicle." + side, (s * .055, 0, 1.425),
             (s * .20, 0, 1.425), "chest")
        arm = [((s * .20, 0, 1.425), (s * .278, -.005, 1.18)),
               ((s * .278, -.005, 1.18), (s * .334, -.028, .925)),
               ((s * .334, -.028, .925), (s * .342, -.033, .844))]
        leg = [((s * .10, 0, .90), (s * .116, -.007, .52)),
               ((s * .116, -.007, .52), (s * .122, .025, .17)),
               ((s * .122, .025, .17), (s * .122, -.135, .07))]
        for limb, chain, names, parent in (
            ("arm", arm, ("upper_arm", "forearm", "hand"), "clavicle." + side),
            ("leg", leg, ("thigh", "shin", "foot"), "pelvis"),
        ):
            for prefix in ("", "FK_", "MCH_"):
                previous = parent
                for index, (name, (head, tail)) in enumerate(zip(names, chain)):
                    key = prefix + name + "." + side
                    bone(key, head, tail, previous, deform=not prefix,
                         connected=index > 0)
                    previous = key
            target = "hand_IK." + side if limb == "arm" else "foot_IK." + side
            bone(target, chain[2][0], chain[2][1], "root", False)
            pole = list(chain[1][0])
            pole[1] = -.58 if limb == "arm" else -.63
            bone(limb + "_pole." + side, pole,
                 (pole[0], pole[1], pole[2] + .09), "root", False)
        bone("toe." + side, (s * .122, -.135, .07),
             (s * .122, -.215, .06), "foot." + side)
        bone("toe_ctrl." + side, (s * .122, -.135, .07),
             (s * .122, -.215, .06), "foot." + side, False)
        for finger, (points, _) in _finger_paths(side).items():
            parent = "hand." + side
            for segment in range(3):
                key = f"{finger}.{segment + 1:02d}.{side}"
                bone(key, points[segment], points[segment + 1], parent, True,
                     connected=segment > 0)
                parent = key
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.select_set(False)
    return rig, specs


def _property_driver(owner, property_name, rig, switch):
    driver = owner.driver_add(property_name).driver
    driver.type = "SCRIPTED"
    variable = driver.variables.new()
    variable.name = "switch"
    variable.type = "SINGLE_PROP"
    variable.targets[0].id = rig
    variable.targets[0].data_path = f'["{switch}"]'
    driver.expression = "switch"


def _controls(rig, collection):
    categories = {name: rig.data.collections.new(name) for name in
                  ("Body and fingers", "FK controls", "IK controls", "Deform", "Mechanism")}
    shape = _new_mesh("Rig_Control_Shape", [(.50 * math.cos(i * math.tau / 24),
                      .50 * math.sin(i * math.tau / 24), 0) for i in range(24)],
                      [], collection, None)
    shape.data.edges.add(24)
    for i, edge in enumerate(shape.data.edges):
        edge.vertices = (i, (i + 1) % 24)
    shape.hide_render = True
    shape.hide_set(True)
    for b in rig.data.bones:
        p = rig.pose.bones[b.name]
        p.rotation_mode = "XYZ"
        if b.name.startswith("MCH_"):
            category = "Mechanism"
            b.hide = True
        elif b.name.startswith("FK_"):
            category = "FK controls"
        elif "_IK." in b.name or "_pole." in b.name:
            category = "IK controls"
        elif b.name.startswith(("upper_arm.", "forearm.", "hand.", "thigh.", "shin.", "foot.", "toe.")):
            category = "Deform"
            b.hide = True
        else:
            category = "Body and fingers"
        categories[category].assign(b)
        if category not in ("Mechanism", "Deform"):
            p.custom_shape = shape
            p.custom_shape_scale_xyz = (1.4, 1.4, 1.4)
            p.color.palette = "THEME04" if b.name.endswith(".L") else (
                "THEME03" if b.name.endswith(".R") else "THEME09")
            if b.name not in ("root", "pelvis") and "_IK." not in b.name and "_pole." not in b.name:
                p.lock_location = (True, True, True)
            p.lock_scale = (True, True, True)
    for side, _ in SIDES:
        for limb, names, target in (
            ("arm", ("upper_arm", "forearm", "hand"), "hand_IK." + side),
            ("leg", ("thigh", "shin", "foot"), "foot_IK." + side),
        ):
            switch = f"{limb}_IK_FK.{side}"
            rig[switch] = 0.0
            rig.id_properties_ui(switch).update(min=0.0, max=1.0,
                description="0 FK; 1 IK. Match controls before switching in animation.")
            solver = rig.pose.bones["MCH_" + names[1] + "." + side].constraints.new("IK")
            solver.name = limb.title() + " two-bone IK"
            solver.target = rig
            solver.subtarget = target
            solver.pole_target = rig
            solver.pole_subtarget = limb + "_pole." + side
            solver.chain_count = 2
            solver.use_stretch = False
            for key in names[:2]:
                rig.pose.bones["MCH_" + key + "." + side].ik_stretch = 0.0
            rotation = rig.pose.bones["MCH_" + names[2] + "." + side].constraints.new("COPY_ROTATION")
            rotation.name = "IK end orientation"
            rotation.target, rotation.subtarget = rig, target
            for name in names:
                p = rig.pose.bones[name + "." + side]
                for prefix in ("FK_", "MCH_"):
                    c = p.constraints.new("COPY_TRANSFORMS")
                    c.name = "FK" if prefix == "FK_" else "IK blend"
                    c.target = rig
                    c.subtarget = prefix + name + "." + side
                    if prefix == "MCH_":
                        _property_driver(c, "influence", rig, switch)
            rig.pose.bones["FK_" + names[1] + "." + side].lock_rotation[1] = True
        c = rig.pose.bones["toe." + side].constraints.new("COPY_ROTATION")
        c.target, c.subtarget = rig, "toe_ctrl." + side
        c.target_space = c.owner_space = "LOCAL"
    bpy.context.view_layer.update()
    # Find each chain's rest pole angle from the actual Blender solver orientation.
    for side, _ in SIDES:
        for limb, joint in (("arm", "forearm"), ("leg", "shin")):
            p = rig.pose.bones[f"MCH_{joint}.{side}"]
            solver = next(c for c in p.constraints if c.type == "IK")
            rest = rig.data.bones[f"MCH_{joint}.{side}"].head_local
            best_angle, best_error = 0.0, float("inf")
            for step in range(72):
                solver.pole_angle = -math.pi + step * math.tau / 72
                bpy.context.view_layer.update()
                error = (p.head - rest).length_squared
                if error < best_error:
                    best_angle, best_error = solver.pole_angle, error
            solver.pole_angle = best_angle
    bpy.context.view_layer.update()
    return {"switches": [f"{limb}_IK_FK.{side}" for side, _ in SIDES for limb in ("arm", "leg")],
            "switch_convention": "0 = FK, 1 = IK; match controls before animating a switch",
            "root": "root", "body": ["pelvis", "spine", "chest", "neck", "head"],
            "ik": [name for name in rig.pose.bones.keys() if "_IK." in name or "_pole." in name],
            "fk": [name for name in rig.pose.bones.keys() if name.startswith("FK_")],
            "fingers": [f"{finger}.{i:02d}.{side}" for side, _ in SIDES for finger in FINGERS for i in (1, 2, 3)],
            "control_shape": shape.name}


def _torso_weights(z):
    chest = _smooth(1.12, 1.29, z)
    pelvis = 1 - _smooth(.97, 1.10, z)
    return {"pelvis": pelvis, "spine": (1 - pelvis) * (1 - chest), "chest": (1 - pelvis) * chest}


def _weights_for_body(semantic, p):
    side = "L" if p.x >= 0 else "R"
    if semantic.startswith("cuff"):
        side = semantic[-1]
        hand = 1 - _smooth(.925, .965, p.z)
        return {"forearm." + side: 1 - hand * .35, "hand." + side: hand * .35}
    if semantic == "collar":
        neck = _smooth(1.43, 1.51, p.z) * .75
        return {"chest": 1 - neck, "neck": neck}
    if semantic == "neck":
        head = _smooth(1.535, 1.61, p.z)
        return {"neck": 1 - head, "head": head}
    if semantic.startswith("boot"):
        side = semantic[-1]
        shin = _smooth(.12, .25, p.z)
        toe = (1 - _smooth(-.18, -.10, p.y)) * (1 - shin)
        return {"shin." + side: shin, "foot." + side: 1 - shin - toe, "toe." + side: toe}
    if semantic == "trousers":
        pelvis = _smooth(.78, .91, p.z)
        shin = 1 - _smooth(.45, .59, p.z)
        return {"pelvis": pelvis, "thigh." + side: (1 - pelvis) * (1 - shin),
                "shin." + side: (1 - pelvis) * shin}
    torso = _torso_weights(p.z)
    if semantic in ("jacket",) or "sleeve" in semantic:
        sleeve_x = .20 + .134 * max(0, min(1, (1.425 - p.z) / .50))
        arm = _smooth(sleeve_x - .066, sleeve_x - .018, abs(p.x))
        arm *= 1 - _smooth(1.43, 1.49, p.z)
        forearm = 1 - _smooth(1.105, 1.255, p.z)
        for name in torso:
            torso[name] *= 1 - arm
        torso["upper_arm." + side] = arm * (1 - forearm)
        torso["forearm." + side] = arm * forearm
    return torso


def _bind(obj, rig, weights):
    world = obj.matrix_world.copy()
    obj.parent = rig
    obj.matrix_world = world
    for modifier in list(obj.modifiers):
        if modifier.type == "ARMATURE":
            obj.modifiers.remove(modifier)
    for name in rig.data.bones.keys():
        group = obj.vertex_groups.get(name)
        if group:
            obj.vertex_groups.remove(group)
    groups = {}
    for vertex, values in zip(obj.data.vertices, weights):
        total = sum(max(0.0, weight) for weight in values.values())
        if total <= 0:
            raise ValueError(f"Unweighted vertex {vertex.index} in {obj.name}")
        for name, weight in values.items():
            if weight > .00001:
                group = groups.get(name)
                if group is None:
                    group = groups[name] = obj.vertex_groups.new(name=name)
                group.add([vertex.index], weight / total, "REPLACE")
    modifier = obj.modifiers.new("Production dual-quaternion skin", "ARMATURE")
    modifier.object = rig
    modifier.use_deform_preserve_volume = True
    # Skin before subdivision so small joint corrections stay smooth.
    obj.modifiers.move(len(obj.modifiers) - 1, 0)


def _hand_weights(p, side, paths):
    if p.z > .903:
        forearm = _smooth(.916, .938, p.z)
        return {"hand." + side: 1 - forearm, "forearm." + side: forearm}
    candidates = []
    for name, (points, radius) in paths.items():
        for index in range(3):
            distance = _segment_distance(p, points[index], points[index + 1])
            candidates.append((distance, f"{name}.{index + 1:02d}.{side}", name, index))
    closest = min(candidates)
    name = closest[2]
    points, radius = paths[name]
    base_influence = _smooth(.007, .025, points[0].z - p.z)
    if name == "thumb":
        base_influence = _smooth(.002, .021, (p - points[0]).length) if closest[0] < radius * 1.7 else 0
    if closest[0] > radius * 2.2:
        return {"hand." + side: 1.0}
    values = {"hand." + side: 1 - base_influence}
    local = [(d, bone) for d, bone, finger, _ in candidates if finger == name]
    raw = [(math.exp(-((d / .010) ** 2)), bone) for d, bone in local]
    total = sum(value for value, _ in raw)
    for value, bone in raw:
        values[bone] = base_influence * value / max(total, 1e-16)
    return values


def _corrective(obj, rig, name, bone, center, radius, amount, threshold=.22):
    if not obj.data.shape_keys:
        obj.shape_key_add(name="Basis")
    key = obj.shape_key_add(name=name)
    world = obj.matrix_world
    inv = world.inverted().to_3x3()
    center = Vector(center)
    changed = 0
    for vertex in obj.data.vertices:
        p = world @ vertex.co
        distance = (p - center).length
        if distance < radius:
            delta = p - center
            delta.z *= .25
            if delta.length > .0001:
                delta.normalize()
                envelope = (1 - (distance / radius) ** 2) ** 2
                key.data[vertex.index].co += inv @ (delta * amount * envelope)
                changed += 1
    if not changed:
        obj.shape_key_remove(key)
        return None
    driver = key.driver_add("value").driver
    driver.type = "SCRIPTED"
    for axis, transform in (("x", "ROT_X"), ("y", "ROT_Y"), ("z", "ROT_Z")):
        variable = driver.variables.new()
        variable.name = axis
        variable.type = "TRANSFORMS"
        target = variable.targets[0]
        target.id, target.bone_target = rig, bone
        target.transform_type = transform
        target.transform_space = "LOCAL_SPACE"
        target.rotation_mode = "XYZ"
    driver.expression = f"min(1,max(0,(abs(x)+abs(y)+abs(z)-{threshold})/1.2))"
    return {"object": obj.name, "key": key.name, "bone": bone,
            "affected_vertices": changed, "maximum_displacement_m": amount}


def build_body_rig(ctx):
    """Build in ctx['collection']; copied body meshes are modified in place.

    Returns the rig, four hand/nail meshes, and JSON-safe controls/correctives metadata.
    ctx must contain scene, collection, materials (skin/nails), and body_objects.
    """
    for name in ("scene", "collection", "materials", "body_objects"):
        if name not in ctx:
            raise KeyError("body rig context missing " + name)
    for name in ("skin", "nails"):
        if name not in ctx["materials"]:
            raise KeyError("body rig material missing " + name)
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="DESELECT")
    for obj in ctx["body_objects"].values():
        if obj.type != "MESH":
            raise TypeError("body_objects must contain copied mesh objects")
        if obj.data.users > 1:
            obj.data = obj.data.copy()
    rig, specs = _make_skeleton(ctx["collection"])
    controls = _controls(rig, ctx["collection"])
    for semantic, obj in ctx["body_objects"].items():
        _bind(obj, rig, [_weights_for_body(semantic, obj.matrix_world @ v.co) for v in obj.data.vertices])
    hands, corrections = [], []
    for side, s in SIDES:
        hand, nails, paths, nail_bones = _hand_mesh(side, ctx["collection"], ctx["materials"])
        _bind(hand, rig, [_hand_weights(v.co, side, paths) for v in hand.data.vertices])
        _bind(nails, rig, [{bone: 1.0} for bone in nail_bones])
        subdivision = hand.modifiers.new("Skin surface", "SUBSURF")
        subdivision.levels = 1
        subdivision.render_levels = 2
        hands.extend((hand, nails))
        correction = _corrective(hand, rig, "Wrist_volume." + side, "hand." + side,
                                  (s * .334, -.028, .925), .033, .003)
        if correction:
            corrections.append(correction)
        definitions = (
            ("jacket", "Shoulder_volume", "upper_arm", (s * .20, 0, 1.425), .12, .009),
            ("jacket", "Elbow_volume", "forearm", (s * .278, -.005, 1.18), .09, .007),
            ("trousers", "Hip_volume", "thigh", (s * .10, 0, .90), .13, .008),
            ("trousers", "Knee_volume", "shin", (s * .116, -.007, .52), .10, .007),
            ("cuff_" + side, "Cuff_volume", "hand", (s * .334, -.028, .925), .06, .004),
        )
        for semantic, name, bone, center, radius, amount in definitions:
            obj = ctx["body_objects"].get(semantic)
            if obj:
                correction = _corrective(obj, rig, name + "." + side, bone + "." + side,
                                          center, radius, amount)
                if correction:
                    corrections.append(correction)
    for semantic in ("neck", "collar"):
        obj = ctx["body_objects"].get(semantic)
        if obj:
            correction = _corrective(obj, rig, "Neck_volume", "neck", (0, 0, 1.49), .105, .004)
            if correction:
                corrections.append(correction)
    reset_pose(rig)
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    assert all(name in rig.pose.bones for name in ("root", "head", "jaw", "eye.L", "eye.R"))
    assert all(obj.vertex_groups and any(m.type == "ARMATURE" for m in obj.modifiers) for obj in hands)
    return {"rig": rig, "hands": hands, "controls": controls,
            "correctives": {"shape_keys": corrections, "method": "Pose-driven local volume recovery",
                "limits": ["Analytical clothing weights require shot-specific polishing for extreme folds.",
                           "Correctives recover joint volume; they do not simulate cloth or collisions.",
                           "IK/FK switching requires control matching; no snap operator is installed.",
                           "Hands use voxel-unified production geometry, not manually retopologized quad loops."]}}


def reset_pose(rig):
    """Clear pose transforms and restore all four limb switches to FK."""
    for bone in rig.pose.bones:
        bone.location = (0, 0, 0)
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = (0, 0, 0)
        bone.scale = (1, 1, 1)
    for side, _ in SIDES:
        for limb in ("arm", "leg"):
            rig[f"{limb}_IK_FK.{side}"] = 0.0
    bpy.context.view_layer.update()


def set_pose(rig, name, strength=1.0):
    """Apply a compact FK blocking pose, in radians; these are not animation clips."""
    if name not in ("walking", "reach", "crouch", "kneel", "sit", "crawl", "fall", "limp",
                    "tool_grip", "fear", "exhaustion"):
        raise ValueError("Unknown body pose: " + name)
    reset_pose(rig)
    strength = float(strength)

    def rotate(bone, x=0, y=0, z=0):
        rig.pose.bones[bone].rotation_euler = tuple(strength * v for v in (x, y, z))

    def move(bone, x=0, y=0, z=0):
        p = rig.pose.bones[bone]
        world_delta = Vector((x, y, z)) * strength
        p.location = p.bone.matrix_local.to_3x3().inverted() @ world_delta

    for side, s in SIDES:
        if name == "walking":
            rotate("FK_thigh." + side, -.34 * s)
            rotate("FK_shin." + side, .30 if s > 0 else .10)
            rotate("FK_upper_arm." + side, .24 * s)
            rotate("FK_forearm." + side, -.13)
        elif name == "reach":
            rotate("FK_upper_arm." + side, -1.23, 0, -.13 * s)
            rotate("FK_forearm." + side, -.22)
        elif name in ("crouch", "sit", "crawl"):
            rotate("FK_thigh." + side, -1.13 if name != "crawl" else -1.38)
            rotate("FK_shin." + side, 1.65 if name == "crouch" else 1.42)
            rotate("FK_foot." + side, -.35)
            if name == "crawl":
                rotate("FK_upper_arm." + side, -1.12)
                rotate("FK_forearm." + side, -.12)
        elif name == "kneel":
            rotate("FK_thigh." + side, -.25 if side == "L" else -1.25)
            rotate("FK_shin." + side, 1.65 if side == "L" else 1.0)
            rotate("FK_foot." + side, -.75 if side == "L" else -.25)
        elif name == "fall":
            rotate("FK_upper_arm." + side, -.80, 0, -.65 * s)
            rotate("FK_forearm." + side, -.70)
            rotate("FK_thigh." + side, -.34 * s)
            rotate("FK_shin." + side, .50)
        elif name == "limp":
            rotate("FK_thigh." + side, -.24 if side == "L" else .10)
            rotate("FK_shin." + side, .72 if side == "L" else .12)
            rotate("FK_upper_arm." + side, .05, 0, -.10 * s)
        elif name == "tool_grip":
            rotate("FK_upper_arm." + side, -.35, 0, -.12 * s)
            rotate("FK_forearm." + side, -1.15)
            for finger in FINGERS:
                for index, bend in enumerate((.70, 1.05, .68), 1):
                    rotate(f"{finger}.{index:02d}.{side}", -bend if finger != "thumb" else -bend * .55)
        elif name == "fear":
            rotate("FK_upper_arm." + side, -.73, 0, -.30 * s)
            rotate("FK_forearm." + side, -1.23)
            rotate("FK_thigh." + side, -.25)
            rotate("FK_shin." + side, .38)
        elif name == "exhaustion":
            rotate("FK_upper_arm." + side, -.18, 0, -.06 * s)
            rotate("FK_forearm." + side, -.32)
            rotate("FK_thigh." + side, -.18)
            rotate("FK_shin." + side, .28)
    if name in ("crouch", "sit", "kneel", "crawl"):
        move("pelvis", z={"crouch": -.38, "sit": -.39, "kneel": -.38, "crawl": -.52}[name])
        rotate("spine", .20 if name != "crawl" else .65)
    if name in ("fear", "exhaustion"):
        rotate("spine", .13 if name == "fear" else .30)
        rotate("neck", .15 if name == "fear" else .24)
    if name == "fall":
        rotate("root", .85, .15, -.25)
        move("root", z=-.40)
    if name == "limp":
        rotate("pelvis", 0, .08, -.08)
    bpy.context.view_layer.update()
