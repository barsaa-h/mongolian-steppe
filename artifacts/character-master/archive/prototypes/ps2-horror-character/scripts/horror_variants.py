"""Optional low-poly horror variants. Import is inert; create(ctx) never saves a blend."""
from pathlib import Path
import json
import math

import bpy
import bmesh
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
COLLECTION = "PS2 | Horror Variants"
CONTROL = "PS2 | HORROR_CONTROLS"


def _drive(owner, path, controls, prop, expression):
    driver = owner.driver_add(path).driver
    driver.type = "SCRIPTED"
    for variable in list(driver.variables):
        driver.variables.remove(variable)
    variable = driver.variables.new()
    variable.name = "switch"
    variable.type = "SINGLE_PROP"
    variable.targets[0].id = controls
    variable.targets[0].data_path = f'["{prop}"]'
    driver.expression = expression


def _visibility(obj, controls, prop, variant=True):
    for path in ("hide_render", "hide_viewport"):
        _drive(obj, path, controls, prop, "switch < 0.5" if variant else "switch >= 0.5")


def _copy(source, name, collection):
    obj = source.copy()
    obj.data = source.data.copy()
    obj.name = name
    collection.objects.link(obj)
    return obj


def _filter_faces(obj, keep):
    """Remove only faces so copied shape keys, UVs and skin weights retain vertex order."""
    count = len(obj.data.vertices)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.faces.ensure_lookup_table()
    bmesh.ops.delete(bm, geom=[face for face in bm.faces if face.index not in keep], context="FACES_ONLY")
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    assert len(obj.data.vertices) == count
    if obj.data.shape_keys:
        assert all(len(key.data) == count for key in obj.data.shape_keys.key_blocks)


def _offset(obj, delta):
    if obj.data.shape_keys:
        for key in obj.data.shape_keys.key_blocks:
            for vertex in key.data:
                vertex.co += delta
    else:
        for vertex in obj.data.vertices:
            vertex.co += delta


def _material(name, color, texture=None, alpha=False):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (*color, 1)
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = .95
    shader.inputs["Specular IOR Level"].default_value = .02
    if texture:
        image = bpy.data.images.load(str(ROOT / "Textures" / texture), check_existing=True)
        image.pack()
        node = mat.node_tree.nodes.new("ShaderNodeTexImage")
        node.image = image
        node.interpolation = "Linear"
        mat.node_tree.links.new(node.outputs["Color"], shader.inputs["Base Color"])
        if alpha:
            mat.node_tree.links.new(node.outputs["Alpha"], shader.inputs["Alpha"])
            if hasattr(mat, "surface_render_method"):
                mat.surface_render_method = "DITHERED"
    return mat


def _assign(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)
    for polygon in obj.data.polygons:
        polygon.material_index = 0


def _bind(obj, rig, bone):
    obj.parent = rig
    group = obj.vertex_groups.new(name=bone)
    group.add(list(range(len(obj.data.vertices))), 1, "REPLACE")
    modifier = obj.modifiers.new("Horror variant skeleton", "ARMATURE")
    modifier.object = rig
    modifier.use_deform_preserve_volume = True


def _new_mesh(name, vertices, faces, collection, material):
    mesh = bpy.data.meshes.new(name + " Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    _assign(obj, material)
    return obj


def repair_head_patch_uv(obj):
    """Use the diffuse/decal atlas contract, not a local 0-1 crop of the patch."""
    basis = obj.data.shape_keys.key_blocks[0].data if obj.data.shape_keys else obj.data.vertices
    uv = obj.data.uv_layers.active or obj.data.uv_layers.new(name="UVMap")
    for polygon in obj.data.polygons:
        for li in polygon.loop_indices:
            p = basis[obj.data.loops[li].vertex_index].co
            uv.data[li].uv = (.5 + p.x / .20, (p.z - 1.53) / .28)
    obj["decal_uv_contract"] = "Full-head atlas: u=.5+x/.20; v=(z-1.53)/.28; Basis coordinates"
    obj.data.update()


def repair_face_decal_shading(obj, source):
    """Match the carrier's normals so a translucent patch cannot read as a raised bandage."""
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    modifier = obj.modifiers.get("Match underlying face normals")
    if modifier is None:
        modifier = obj.modifiers.new("Match underlying face normals", "DATA_TRANSFER")
    modifier.object = source
    modifier.use_loop_data = True
    modifier.data_types_loops = {"CUSTOM_NORMAL"}
    modifier.loop_mapping = "POLYINTERP_NEAREST"
    modifier.mix_mode = "REPLACE"
    modifier.mix_factor = 1.0
    obj.visible_shadow = False


def repair_face_decal_surface(obj, source):
    """Resync every facial key after carrier edits; a gaunt-delta-only repair leaves intersections."""
    assert len(obj.data.vertices) == len(source.data.vertices)
    offset = Vector((0, -.0009, 0))
    source_keys = source.data.shape_keys.key_blocks
    for vertex, point in zip(obj.data.vertices, source_keys[0].data):
        vertex.co = point.co + offset
    for key in obj.data.shape_keys.key_blocks:
        source_key = source_keys[key.name]
        for point, original in zip(key.data, source_key.data):
            point.co = original.co + offset
    repair_head_patch_uv(obj)
    repair_face_decal_shading(obj, source)
    if "bruise" in obj.name.lower() and obj.data.materials:
        mat = obj.data.materials[0]
        nodes, links = mat.node_tree.nodes, mat.node_tree.links
        image = next(node for node in nodes if node.type == "TEX_IMAGE")
        shader = nodes.get("Principled BSDF")
        tint = nodes.get("Bruise painted tint") or nodes.new("ShaderNodeMixRGB")
        tint.name = "Bruise painted tint"
        tint.blend_type = "MULTIPLY"
        tint.inputs[0].default_value = 1.0
        tint.inputs[2].default_value = (.80, .55, 1.10, 1)
        links.new(image.outputs["Color"], tint.inputs[1])
        links.new(tint.outputs[0], shader.inputs["Base Color"])
        opacity = nodes.get("Bruise opacity") or nodes.new("ShaderNodeMath")
        opacity.name = "Bruise opacity"
        opacity.operation = "MULTIPLY"
        opacity.use_clamp = True
        opacity.inputs[1].default_value = 1.6
        links.new(image.outputs["Alpha"], opacity.inputs[0])
        links.new(opacity.outputs[0], shader.inputs["Alpha"])
    obj.data.update()


def _head_patch(source, name, texture, center, radius, controls, prop, collection):
    obj = _copy(source, name, collection)
    keep = set()
    for polygon in source.data.polygons:
        p = polygon.center
        if p.y < -.02 and abs(p.x - center[0]) < radius[0] and abs(p.z - center[1]) < radius[1]:
            keep.add(polygon.index)
    assert keep, name
    _filter_faces(obj, keep)
    _assign(obj, _material(name + " Paint", (.2, .1, .1), texture, True))
    repair_face_decal_surface(obj, source)
    _visibility(obj, controls, prop)
    return obj


def _cap(name, outline, collection, rig, bone, materials, reverse=False):
    center = sum((Vector(p) for p in outline), Vector()) / len(outline)
    vertices = list(outline) + [tuple(center + (Vector(p) - center) * .24) for p in outline]
    n = len(outline)
    faces = [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)]
    faces.append(tuple(n + i for i in range(n)))
    if reverse:
        faces = [tuple(reversed(face)) for face in faces]
    obj = _new_mesh(name, vertices, faces, collection, materials[0])
    obj.data.materials.append(materials[1])
    obj.data.polygons[-1].material_index = 1
    _bind(obj, rig, bone)
    return obj


def create(ctx):
    """Create separate variants and return JSON-safe metadata; clean mesh data stays intact.

    Required context: scene, facial.head, body_rig.rig. Body objects may be supplied
    in body_objects; persisted scenes can instead resolve their stable object names.
    """
    if bpy.data.collections.get(COLLECTION):
        raise ValueError(COLLECTION + " already exists; refusing duplicate variant build")
    scene, head, rig = ctx["scene"], ctx["facial"]["head"], ctx["body_rig"]["rig"]
    jacket = ctx.get("body_objects", {}).get("jacket") or bpy.data.objects["PS2 | jacket"]
    hand, nails = bpy.data.objects["Hand.L"], bpy.data.objects["Nails.L"]
    sources = (head, jacket, hand, nails)
    before = {obj.name: (obj.data, len(obj.data.vertices), len(obj.data.polygons),
                        tuple(mat.name for mat in obj.data.materials)) for obj in sources}
    collection = bpy.data.collections.new(COLLECTION)
    scene.collection.children.link(collection)
    controls = bpy.data.objects.new(CONTROL, None)
    collection.objects.link(controls)
    controls.empty_display_type = "PLAIN_AXES"
    controls.empty_display_size = .09
    controls.parent = rig
    controls.location = (.55, .04, 1.50)
    properties = {
        "Zombie": "Swap the clean head for a gaunt painted zombie head; original facial controls remain active.",
        "FaceBruise": "Optional painted face bruise.",
        "FaceBlood": "Optional painted dried blood at the mouth corner.",
        "BodyDirt": "Optional painted dirt on the jacket front.",
        "TornSleeve": "Swap the clean jacket for its prepared left-sleeve hole variant.",
        "DetachWristL": "Replace the left hand with a matching capped separation variant.",
        "WristSeparation": "Translate the detached hand/nails/cap away from the wrist. Requires DetachWristL=1."}
    for prop, description in properties.items():
        controls[prop] = 0.0
        controls.id_properties_ui(prop).update(min=0.0, max=1.0, description=description)

    zombie = _copy(head, "PS2 | Zombie head variant", collection)
    zombie_mat = _material("PS2 | Zombie painted diffuse", (.35, .34, .28), "Zombie_Head_Diffuse.png")
    zombie.data.materials[0] = zombie_mat
    if not zombie.data.shape_keys:
        zombie.shape_key_add(name="Basis", from_mix=False)
    gaunt = zombie.shape_key_add(name="Horror_Gaunt", from_mix=False)
    affected = 0
    for index, vertex in enumerate(zombie.data.shape_keys.key_blocks[0].data):
        p = vertex.co
        envelope = math.exp(-.5 * (((abs(p.x) - .049) / .017) ** 2 + ((p.z - 1.640) / .020) ** 2))
        front = max(0, min(1, (-p.y - .005) / .04))
        amount = envelope * front
        gaunt.data[index].co = p + Vector((-math.copysign(.0018, p.x), .0040, -.0008)) * amount
        affected += amount > .05
    _drive(gaunt, "value", controls, "Zombie", "switch")
    _visibility(zombie, controls, "Zombie")
    _visibility(head, controls, "Zombie", False)
    # Copy facial keys and drivers before changing visibility, so decals follow acting and gaunt cheeks.
    bruise = _head_patch(zombie, "PS2 | Face bruise decal", "BruiseDecalRGBA.png",
                         (-.035, 1.653), (.040, .041), controls, "FaceBruise", collection)
    blood = _head_patch(zombie, "PS2 | Face blood decal", "BloodDecalRGBA.png",
                        (.026, 1.601), (.017, .033), controls, "FaceBlood", collection)

    dirt = _copy(jacket, "PS2 | Jacket dirt decal", collection)
    keep = {p.index for p in jacket.data.polygons
            if p.center.y < -.06 and abs(p.center.x) < .16 and 1.035 < p.center.z < 1.26}
    assert keep
    _filter_faces(dirt, keep)
    _offset(dirt, Vector((0, -.001, 0)))
    uv = dirt.data.uv_layers.active or dirt.data.uv_layers.new(name="UVMap")
    for polygon in dirt.data.polygons:
        for li in polygon.loop_indices:
            p = dirt.data.vertices[dirt.data.loops[li].vertex_index].co
            uv.data[li].uv = (.5 + p.x / .32, (p.z - 1.035) / .225)
    _assign(dirt, _material("PS2 | Jacket painted dirt", (.2, .18, .12), "DirtDecalRGBA.png", True))
    _visibility(dirt, controls, "BodyDirt")

    torn = _copy(jacket, "PS2 | Torn left sleeve variant", collection)
    removed = {p.index for p in jacket.data.polygons if .265 < p.center.x < .325
               and 1.080 < p.center.z < 1.155 and p.center.y < -.055}
    assert removed
    _filter_faces(torn, set(range(len(jacket.data.polygons))) - removed)
    _visibility(torn, controls, "TornSleeve")
    _visibility(jacket, controls, "TornSleeve", False)
    # A flat dark backing prevents seeing through the whole opposite sleeve wall.
    lining = _new_mesh("PS2 | Torn sleeve dark backing",
                      [(.260, -.046, 1.070), (.326, -.050, 1.075), (.329, -.049, 1.162), (.262, -.046, 1.160)],
                      [(0, 1, 2, 3)], collection,
                      _material("PS2 | Sleeve exposed lining", (.035, .039, .030)))
    _bind(lining, rig, "forearm.L")
    _visibility(lining, controls, "TornSleeve")

    detached = _copy(hand, "PS2 | Detachable left hand", collection)
    detached_nails = _copy(nails, "PS2 | Detached left nails", collection)
    top = max(hand.data.polygons, key=lambda p: p.center.z)
    assert top.center.z > .93
    outline = [tuple(hand.data.vertices[i].co) for i in top.vertices]
    wound = _material("PS2 | Flat painted cut tissue", (.20, .064, .055))
    bone = _material("PS2 | Flat painted cut center", (.43, .36, .25))
    hand_cap = _cap("PS2 | Left hand cut cap", outline, collection, rig, "hand.L", (wound, bone))
    _offset(hand_cap, Vector((0, 0, .0004)))
    body_cap = _cap("PS2 | Left wrist cut cap", outline, collection, rig, "forearm.L", (wound, bone), True)
    _offset(body_cap, Vector((0, 0, -.0004)))
    for obj in (detached, detached_nails, hand_cap, body_cap):
        _visibility(obj, controls, "DetachWristL")
    for obj in (hand, nails):
        _visibility(obj, controls, "DetachWristL", False)
    for obj in (detached, detached_nails, hand_cap):
        for axis, amount in ((0, .18), (2, -.10)):
            driver = obj.driver_add("location", axis).driver
            driver.type = "SCRIPTED"
            for name, prop in (("enabled", "DetachWristL"), ("gap", "WristSeparation")):
                variable = driver.variables.new()
                variable.name = name
                variable.type = "SINGLE_PROP"
                variable.targets[0].id = controls
                variable.targets[0].data_path = f'["{prop}"]'
            driver.expression = f"enabled*gap*{amount}"

    bpy.context.view_layer.update()
    for obj in sources:
        data, vertices, polygons, materials = before[obj.name]
        assert obj.data == data and len(data.vertices) == vertices and len(data.polygons) == polygons
        assert tuple(mat.name for mat in data.materials) == materials
    assert zombie.data.shape_keys != head.data.shape_keys
    assert len(zombie.data.shape_keys.key_blocks) == len(head.data.shape_keys.key_blocks) + 1
    source_drivers = len(head.data.shape_keys.animation_data.drivers)
    assert len(zombie.data.shape_keys.animation_data.drivers) == source_drivers + 1
    result = {
        "collection": collection.name, "controls": controls.name, "properties": properties,
        "default": "All switches and separation amount are zero; clean character is visible.",
        "zombie": {"object": zombie.name, "gaunt_key": gaunt.name, "affected_vertices": affected,
                   "preserved_expression_keys": len(head.data.shape_keys.key_blocks), "preserved_drivers": source_drivers},
        "decals": [bruise.name, blood.name, dirt.name],
        "torn_sleeve": {"object": torn.name, "removed_polygons": len(removed), "backing": lining.name},
        "wrist": {"side": "L", "hand": detached.name, "nails": detached_nails.name,
                  "matching_caps": [hand_cap.name, body_cap.name], "cap_plane_z_m": float(top.center.z),
                  "separation_translation_m": [.18, 0, -.10]},
        "clean_meshes_materials_preserved": True,
        "clean_object_changes": "Only hide_viewport/hide_render visibility drivers for variant swaps.",
        "limits": ["Prepared alternate wrist/hand only; other body cut zones are not created.",
                   "Detached hand retains its original finger/hand rig deformation and adds an object offset; "
                   "independent free-fall animation needs baking or a dedicated prop rig.",
                   "Matching wrist caps sit under the retained fleece cuff and require a shot-specific camera check.",
                   "Decals follow copied expression keys and body weights; transparent patches need render verification.",
                   "Torn sleeve is a prepared polygon hole and flat lining, not cloth simulation or exposed anatomy.",
                   "Unused mesh vertices are intentionally retained on patches to preserve all deformation indices."]}
    folder = ROOT / "Horror_Variants"
    folder.mkdir(exist_ok=True)
    (folder / "Horror_Variants_Metadata.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


def self_check(ctx):
    """Exercise visibility and deformation in the loaded disposable scene; never save it."""
    result = create(ctx)
    controls = bpy.data.objects[CONTROL]
    original = ctx["facial"]["head"]
    zombie = bpy.data.objects[result["zombie"]["object"]]
    assert not original.hide_render and zombie.hide_render
    for prop, name in (("FaceBruise", "PS2 | Face bruise decal"),
                       ("FaceBlood", "PS2 | Face blood decal"),
                       ("BodyDirt", "PS2 | Jacket dirt decal")):
        controls[prop] = 1.0
        controls.update_tag()
        bpy.context.scene.frame_set(bpy.context.scene.frame_current)
        bpy.context.view_layer.update()
        assert not bpy.data.objects[name].hide_render and zombie.hide_render, prop
        controls[prop] = 0.0
    for prop in result["properties"]:
        controls[prop] = 1.0
    controls.update_tag()
    bpy.context.scene.frame_set(bpy.context.scene.frame_current)
    bpy.context.view_layer.update()
    assert original.hide_render and not zombie.hide_render
    assert not bpy.data.objects[result["torn_sleeve"]["object"]].hide_render
    detached = bpy.data.objects[result["wrist"]["hand"]]
    assert abs(detached.location.x - .18) < 1e-6 and abs(detached.location.z + .10) < 1e-6
    keys = zombie.data.shape_keys.key_blocks
    assert abs(keys["Horror_Gaunt"].value - 1) < 1e-6
    depsgraph = bpy.context.evaluated_depsgraph_get()
    for obj in bpy.data.collections[COLLECTION].objects:
        if obj.type != "MESH":
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        assert all(math.isfinite(co) for vertex in mesh.vertices for co in vertex.co), obj.name
        evaluated.to_mesh_clear()
    for prop in result["properties"]:
        controls[prop] = 0.0
    controls.update_tag()
    bpy.context.scene.frame_set(bpy.context.scene.frame_current)
    bpy.context.view_layer.update()
    assert not original.hide_render and zombie.hide_render
    result["background_self_check"] = "PASS: zero/enabled/reset visibility, gaunt key, hand offset, finite evaluated vertices; no blend saved."
    (ROOT / "Horror_Variants" / "Horror_Variants_Test.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import scene_access
    bpy.context.window.scene = bpy.data.scenes["PS2 | Character Master"]
    print(json.dumps(self_check(scene_access.context()), indent=2))
