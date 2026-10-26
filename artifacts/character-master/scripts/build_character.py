"""Agent entry point: blender -b --factory-startup --python this_file -- preset.json output_dir."""
import argparse
import importlib.util
import json
import math
import os
import sys
import types
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
LIBRARY = ROOT / 'assets/sources/mpfb2-2.0.18/mpfb'
ASSETS = ROOT / 'assets/sources/makehuman-core'
sys.path.insert(0, str(HERE))
from config import validate_config, validate_output_directory, OUTPUT_MARKER

def load_mpfb():
    import bpy
    name = 'bl_ext.character_master.mpfb'
    for parent in ['bl_ext', 'bl_ext.character_master']:
        if parent not in sys.modules:
            module = types.ModuleType(parent)
            module.__path__ = []
            sys.modules[parent] = module
    spec = importlib.util.spec_from_file_location(name, LIBRARY / '__init__.py', submodule_search_locations=[str(LIBRARY)])
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    bpy.context.preferences.use_preferences_save = False
    bpy.context.preferences.addons.new().module = name
    module.register()
    services = module.MPFB_CONTEXTUAL_INFORMATION['SERVICES']
    module.set_preference('mpfb_second_root', str(ASSETS))
    services['LocationService'].update_second_root()
    return services

def read_material(path, tint=None):
    """Use the source diffuse map with a simple, portable painted material."""
    import bpy
    values = {}
    for line in path.read_text().splitlines():
        if line.strip() and not line.lstrip().startswith('#'):
            parts = line.split(maxsplit=1)
            if len(parts) == 2:
                values[parts[0]] = parts[1]
    material = bpy.data.materials.new(path.stem + ' | Painted diffuse')
    material.use_nodes = True
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Roughness'].default_value = .93
    shader.inputs['Specular IOR Level'].default_value = .10
    shader.inputs['Metallic'].default_value = 0
    if 'diffuseTexture' in values:
        texture_path = (path.parent / values['diffuseTexture']).resolve()
        if not texture_path.is_relative_to(ASSETS.resolve()):
            raise ValueError(f'Texture outside the asset root: {texture_path}')
        image = bpy.data.images.load(str(texture_path), check_existing=True)
        image.pack()
        texture = material.node_tree.nodes.new('ShaderNodeTexImage')
        texture.image, texture.interpolation = image, 'Linear'
        color = texture.outputs['Color']
        if tint:
            multiply = material.node_tree.nodes.new('ShaderNodeMixRGB')
            multiply.blend_type = 'MULTIPLY'
            multiply.inputs[0].default_value = 1
            rgb = [int(tint[i:i+2], 16) / 255 for i in (1, 3, 5)]
            linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
            multiply.inputs[2].default_value = (*linear, 1)
            material.node_tree.links.new(color, multiply.inputs[1])
            color = multiply.outputs[0]
        material.node_tree.links.new(color, shader.inputs['Base Color'])
        if values.get('transparent') == 'True':
            material.surface_render_method = 'DITHERED'
            cutoff = material.node_tree.nodes.new('ShaderNodeMath')
            cutoff.operation = 'GREATER_THAN'
            cutoff.inputs[1].default_value = .35
            material.node_tree.links.new(texture.outputs['Alpha'], cutoff.inputs[0])
            material.node_tree.links.new(cutoff.outputs[0], shader.inputs['Alpha'])
    else:
        shader.inputs['Base Color'].default_value = (.2, .15, .10, 1)
    material.use_backface_culling = False
    return material

def extract_faces(source, face_indices, name, collection):
    import bpy
    import bmesh
    obj = source.copy()
    obj.data = source.data.copy()
    obj.name = name
    collection.objects.link(obj)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    normals = [tuple(vertex.normal) for vertex in source.data.vertices]
    original_index = bm.verts.layers.int.new('original_index')
    for index, vertex in enumerate(bm.verts):
        vertex[original_index] = index
    bm.faces.ensure_lookup_table()
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.index not in face_indices], context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    kept_normals = [normals[vertex[original_index]] for vertex in bm.verts]
    bm.verts.layers.int.remove(original_index)
    bm.to_mesh(obj.data)
    bm.free()
    # Preserve the continuous source shading across separately editable wrist/waist cuts.
    obj.data.normals_split_custom_set_from_vertices(kept_normals)
    return obj

def build(config, destination, *, render=True, eye_asset='low-poly'):
    validate_config(config, ASSETS, LIBRARY / 'data/targets')
    destination = validate_output_directory(Path(destination).resolve())
    import bpy
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.preferences.filepaths.save_version = 0
    services = load_mpfb()
    HumanService = services['HumanService']
    TargetService = services['TargetService']
    ExportService = services['ExportService']
    ObjectService = services['ObjectService']
    macro = TargetService.get_default_macro_info_dict()
    macro.update(config['body'])
    if macro['age'] < .34:
        macro['cupsize'] = 0
    body = HumanService.create_human(macro_detail_dict=macro)
    source_index=body.data.attributes.new('source_vertex','INT','POINT')
    source_index.data.foreach_set('value',list(range(len(body.data.vertices))))
    for target, weight in config['targets'].items():
        TargetService.load_target(body, str(LIBRARY / 'data/targets' / (target + '.target.gz')), weight=weight)
    body.name = 'SOURCE.Body | Complete editable topology'
    skin = ASSETS / 'skins' / config['skin'] / (config['skin'] + '.mhmat')
    body.data.materials.clear()
    body.data.materials.append(read_material(skin))
    for polygon in body.data.polygons:
        polygon.material_index = 0
        polygon.use_smooth = True
    rig = HumanService.add_builtin_rig(body, 'default_no_toes')
    rig.name = 'SOURCE.Rig | Refit after source edits'
    bpy.context.view_layer.update()
    evaluated = body.evaluated_get(bpy.context.evaluated_depsgraph_get())
    complete_mesh = evaluated.to_mesh()
    complete_points = [v.co.copy() for v in complete_mesh.vertices]
    evaluated.to_mesh_clear()
    low_z, high_z = min(v.z for v in complete_points), max(v.z for v in complete_points)
    body_height = high_z - low_z
    waist = [v.x for v in complete_points if abs(v.z - (low_z + body_height * .53)) < body_height * .025 and abs(v.x) < body_height * .24]
    waist_width = max(waist) - min(waist)
    head_fraction = (high_z - rig.data.bones['head'].head_local.z) / body_height
    equipped = []
    for category, asset, asset_type, role in [
        ('eyes', eye_asset, 'Eyes', 'Eyes'),
        ('eyebrows', 'eyebrow001', 'Eyebrows', 'Eyebrows'),
        ('eyelashes', 'eyelashes01', 'Eyelashes', 'Eyelashes'),
        ('teeth', 'teeth_base', 'Teeth', 'Teeth'),
        ('tongue', 'tongue01', 'Tongue', 'Tongue'),
        ('hair', config['hair'], 'Hair', 'Hair'),
        ('clothes', config['outfit'], 'Clothes', 'Clothes.Outfit'),
        ('clothes', config['shoes'], 'Clothes', 'Shoes'),
    ]:
        asset_file = ASSETS / category / asset / (asset + '.mhclo')
        obj = HumanService.add_mhclo_asset(str(asset_file), body, asset_type=asset_type, subdiv_levels=0, material_type='GAMEENGINE')
        material_line = next(line.split(maxsplit=1)[1] for line in asset_file.read_text().splitlines() if line.startswith('material '))
        material_file = (asset_file.parent / material_line).resolve()
        obj.data.materials.clear()
        obj.data.materials.append(read_material(material_file, config.get('tints', {}).get({'Hair': 'hair', 'Clothes.Outfit': 'outfit', 'Shoes': 'shoes'}.get(role))))
        for polygon in obj.data.polygons:
            polygon.material_index = 0
        obj['role'] = role
        obj['source_asset'] = str(asset_file.relative_to(ASSETS))
        equipped.append(obj)
    HumanService.refit(body)

    source_collection = bpy.data.collections.new('AUTHORING | Complete body and fitted source assets')
    bpy.context.scene.collection.children.link(source_collection)
    for obj in [rig, body, *equipped]:
        for collection in list(obj.users_collection):
            collection.objects.unlink(obj)
        source_collection.objects.link(obj)
    render_collection = bpy.data.collections.new('CHARACTER | Modular meshes')
    bpy.context.scene.collection.children.link(render_collection)
    visible_rig = ExportService.create_character_copy(body, name_suffix='_visible', place_in_collection=render_collection)
    visible_body = ObjectService.find_object_of_type_amongst_nearest_relatives(visible_rig, 'Basemesh')
    visible_rig.name = 'Character.Rig'
    visible_body.name = 'Body.Skin'
    visible_body['role'] = 'Body'
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = visible_body
    visible_body.select_set(True)
    bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
    # Outfit masks hide covered skin in the render copy; the authoring body stays complete.
    ExportService.bake_modifiers_remove_helpers(visible_body, bake_masks=True, bake_subdiv=True)
    source_collection.hide_render = source_collection.hide_viewport = True
    bpy.context.view_layer.update()
    factor = config['height_m'] / body_height
    visible_rig.scale = rig.scale = (factor,) * 3
    source_collection.hide_viewport = False
    rig.hide_set(True)
    source_collection.hide_viewport = True

    surface = BVHTree.FromPolygons([v.co for v in visible_body.data.vertices], [list(p.vertices) for p in visible_body.data.polygons])
    corrections = {}
    for obj in list(render_collection.objects):
        if obj.type != 'MESH' or obj == visible_body:
            continue
        role = obj.get('role', '')
        obj.name = role
        if role in ['Clothes.Outfit', 'Shoes']:
            corrected = 0
            for vertex in obj.data.vertices:
                location, normal, _, distance = surface.find_nearest(vertex.co)
                if location is not None and distance < .035 / factor:
                    signed = (vertex.co - location).dot(normal)
                    clearance = .004 / factor
                    if signed < clearance:
                        vertex.co += normal * (clearance - signed)
                        corrected += 1
            corrections[role] = corrected
            solidify = obj.modifiers.new('Fabric edge thickness', 'SOLIDIFY')
            solidify.thickness = .0015 / factor
            solidify.offset = 1

    outfit = next(o for o in render_collection.objects if o.get('role') == 'Clothes.Outfit')
    adjacency = [set() for _ in outfit.data.vertices]
    for edge in outfit.data.edges:
        first, second = edge.vertices
        adjacency[first].add(second)
        adjacency[second].add(first)
    regions, visited = {}, set()
    for vertex in outfit.data.vertices:
        if vertex.index in visited:
            continue
        stack, component = [vertex.index], []
        visited.add(vertex.index)
        while stack:
            index = stack.pop()
            component.append(index)
            for neighbor in adjacency[index] - visited:
                visited.add(neighbor)
                stack.append(neighbor)
        mean_height = sum(outfit.data.vertices[i].co.z for i in component) / len(component)
        role = 'Clothes.Top' if mean_height > body_height * .53 else 'Clothes.Bottom'
        regions.update((i, role) for i in component)
    top_faces = {p.index for p in outfit.data.polygons if regions[p.vertices[0]] == 'Clothes.Top'}
    if len(top_faces) < 100 or len(top_faces) > len(outfit.data.polygons) - 100:
        # Some core outfits stitch shirt and trousers together; split at the fitted waist.
        waist_plane = visible_rig.data.bones['spine05'].tail_local.z
        top_faces = {p.index for p in outfit.data.polygons if p.center.z > waist_plane}
    for role in ['Clothes.Top', 'Clothes.Bottom']:
        faces = top_faces if role == 'Clothes.Top' else set(range(len(outfit.data.polygons))) - top_faces
        assert len(faces) > 100, f'Outfit needs separate top and bottom surfaces: {role}'
        part = extract_faces(outfit, faces, role, render_collection)
        part['role'] = role
    bpy.data.objects.remove(outfit, do_unlink=True)

    # Expose hands as modules without breaking the complete authoring topology.
    hand_faces = {'L': set(), 'R': set()}
    for polygon in visible_body.data.polygons:
        for side in ['L', 'R']:
            amount = 0
            for index in polygon.vertices:
                for group in visible_body.data.vertices[index].groups:
                    name = visible_body.vertex_groups[group.group].name
                    if name == 'wrist.' + side or (name.startswith(('finger', 'metacarpal')) and name.endswith('.' + side)):
                        amount += group.weight
            if amount / len(polygon.vertices) > .5:
                hand_faces[side].add(polygon.index)
    all_faces = set(range(len(visible_body.data.polygons)))
    for side, faces in hand_faces.items():
        assert len(faces) > 100, f'Missing hand topology: {side}'
        hand = extract_faces(visible_body, faces, 'Hands.' + side, render_collection)
        hand['role'] = 'Hands.' + side
    skin_body = extract_faces(visible_body, all_faces - hand_faces['L'] - hand_faces['R'], 'Body.Skin', render_collection)
    bpy.data.objects.remove(visible_body, do_unlink=True)
    skin_body.name = 'Body.Skin'
    meshes = [o for o in render_collection.objects if o.type == 'MESH']
    for obj in meshes:
        for vertex in obj.data.vertices:
            weights = [(g.group, g.weight) for g in vertex.groups if visible_rig.data.bones.get(obj.vertex_groups[g.group].name) and g.weight > 0]
            weights.sort(key=lambda item: item[1], reverse=True)
            total = sum(weight for _, weight in weights[:4])
            assert total > 0, f'Unweighted vertex: {obj.name}/{vertex.index}'
            keep = {group for group, _ in weights[:4]}
            for group, weight in weights:
                if group in keep:
                    obj.vertex_groups[group].add([vertex.index], weight / total, 'REPLACE')
                else:
                    obj.vertex_groups[group].remove([vertex.index])
    bpy.context.view_layer.update()
    points = [obj.matrix_world @ Vector(corner) for obj in meshes for corner in obj.bound_box]
    visible_rig.location.z -= min(p.z for p in points)

    scene = bpy.context.scene
    scene.name = config['name'] + ' | Character Master'
    scene.render.fps = 24
    action = bpy.data.actions.new('Deformation_Check')
    visible_rig.animation_data_create()
    visible_rig.animation_data.action = action
    for frame, amount in [(1, 0), (25, 1), (49, 0)]:
        for bone in visible_rig.pose.bones:
            bone.rotation_mode = 'XYZ'
            bone.rotation_euler = (0, 0, 0)
            if bone.name.startswith('finger'):
                bone.rotation_euler.x = .65 * amount
            elif bone.name.startswith('lowerarm01'):
                bone.rotation_euler.x = -.65 * amount
            elif bone.name.startswith('lowerleg01'):
                bone.rotation_euler.x = -.35 * amount
            bone.keyframe_insert('rotation_euler', frame=frame, group=bone.name)
    action.use_fake_user = True
    scene.frame_start, scene.frame_end = 1, 49
    scene.frame_set(1)
    visible_rig['configuration'] = json.dumps(config)
    visible_rig['workflow'] = 'Edit JSON and regenerate. Complete editable body and targets are in the AUTHORING collection.'
    bpy.data.texts.new('character.json').write(json.dumps(config, indent=2))
    bpy.data.texts.new('AGENT_README').write((HERE.parent / 'README.md').read_text() if (HERE.parent / 'README.md').exists() else 'Use scripts/build_character.py with presets/default.json; retain full authoring topology.')
    destination.mkdir(parents=True, exist_ok=True)
    (destination / OUTPUT_MARKER).write_text('character-master-v1\n')
    (destination / 'character.json').write_text(json.dumps(config, indent=2) + '\n')

    if render:
        stage(scene, destination, config['height_m'], visible_rig)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in [visible_rig, *meshes]:
        obj.hide_set(False)
        obj.select_set(True)
    bpy.context.view_layer.objects.active = visible_rig
    bpy.ops.export_scene.gltf(filepath=str(destination / 'character.glb'), use_selection=True, export_format='GLB',
        export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
        export_frame_range=False, export_extras=True, export_apply=True, export_morph=False)
    bpy.ops.wm.save_as_mainfile(filepath=str(destination / 'Character-Master.blend'))
    report = {'name': config['name'], 'bodyHeightM': body_height * factor, 'sourceBodyVertices': len(body.data.vertices),
        'headHeightFraction': head_fraction, 'waistWidthM': waist_width * factor,
        'sourceShapeKeys': len(body.data.shape_keys.key_blocks), 'rigBones': len(visible_rig.data.bones),
        'fingerBones': sum(b.name.startswith('finger') for b in visible_rig.data.bones),
        'garmentCorrections': corrections, 'fullBodyRetained': True, 'renderBodyUsesClothingMasks': True,
        'meshes': [{'name': o.name, 'role': o.get('role'), 'vertices': len(o.data.vertices),
            'triangles': sum(len(p.vertices) - 2 for p in o.data.polygons)} for o in meshes],
        'packedTextures': [{'name': i.name, 'size': list(i.size)} for i in bpy.data.images if i.packed_file]}
    assert report['rigBones'] == 137 and report['fingerBones'] == 30
    assert abs(report['bodyHeightM'] - config['height_m']) < .001
    (destination / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print('CHARACTER_BUILD_OK', json.dumps(report), flush=True)
    return report

def stage(scene, destination, height, rig):
    import bpy
    from mathutils import Vector
    studio = bpy.data.collections.new('STUDIO | Inspection lighting')
    scene.collection.children.link(studio)
    scene.world = bpy.data.worlds.new('Charcoal studio')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.035, .045, .046, 1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = .65
    for name, location, energy, size, color in [('Key', (-3, -4, 5), 300, 4, (1, .94, .86)), ('Fill', (3, -2, 3), 130, 3, (.8, .9, 1)), ('Rim', (1, 3, 4), 220, 3, (.78, .9, 1))]:
        data = bpy.data.lights.new(name, 'AREA')
        data.energy, data.size, data.color = energy, size, color
        obj = bpy.data.objects.new(name, data)
        studio.objects.link(obj)
        obj.location = location
        obj.rotation_euler = (Vector((0, 0, height * .6)) - obj.location).to_track_quat('-Z', 'Y').to_euler()
    data = bpy.data.cameras.new('Inspection camera')
    camera = bpy.data.objects.new('Inspection camera', data)
    studio.objects.link(camera)
    scene.camera = camera
    data.type = 'ORTHO'
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True
    scene.view_settings.view_transform = 'Standard'
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGB'
    scene.render.resolution_percentage = 100
    head = rig.matrix_world @ rig.data.bones['head'].head_local
    eye = rig.matrix_world @ rig.data.bones['eye.L'].head_local
    for name, location, target, scale, resolution in [
        ('full', (height * .55, -height * 3, height * .72), (0, 0, height * .52), height * 1.2, (900, 1100)),
        ('face', (height * .08, -height * 2, eye.z + .02), (0, head.y, eye.z - .04), height * .32, (1000, 1000)),
    ]:
        camera.location = location
        camera.rotation_euler = (Vector(target) - camera.location).to_track_quat('-Z', 'Y').to_euler()
        data.ortho_scale = scale
        scene.render.resolution_x, scene.render.resolution_y = resolution
        scene.render.filepath = str(destination / (name + '.png'))
        bpy.ops.render.render(write_still=True)
    scene.render.filepath = '//face.png'

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('config', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--no-render', action='store_true')
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
    configuration = json.loads(args.config.read_text())
    build(configuration, args.output.resolve(), render=not args.no_render)
