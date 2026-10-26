"""Portable skin layers and independently editable hair, brow and eye appearance."""
import math
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from dna import resolve_appearance

ROOT = Path(__file__).resolve().parents[1]
TEXTURES = ROOT / 'textures'

def rgb(hexcode):
    values = [int(hexcode[i:i+2], 16) / 255 for i in (1, 3, 5)]
    return tuple(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values)

def grey_color(hexcode, amount):
    channels = [int(hexcode[i:i+2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(v * (1 - amount) + 170 * amount):02x}' for v in channels)

def pack_image(path, colorspace='sRGB'):
    image = bpy.data.images.load(str(path), check_existing=True)
    image.pack()
    image.colorspace_settings.name = 'Non-Color' if colorspace == 'Non-Color' else 'sRGB'
    return image

def texture_node(tree, image):
    nodes = tree.nodes if hasattr(tree, 'nodes') else tree
    node = nodes.new('ShaderNodeTexImage')
    node.image = image
    node.interpolation = 'Linear'
    return node

def apply_appearance(dna, rig, collection, bake):
    look = resolve_appearance(dna)
    finish_brows(look, rig)
    finish_hair(dna, rig)
    finish_eyes(look, rig, collection)
    add_skin(dna, look, rig, collection, bake)

def finish_hair(dna, rig):
    hair = bpy.data.objects['Hair']
    head = rig.data.bones['head'].head_local
    for vertex in hair.data.vertices:
        vertex.co.x *= dna['hair']['volume']
        vertex.co.y = head.y + (vertex.co.y - head.y) * dna['hair']['volume']
        vertex.co.z = head.z + (vertex.co.z - head.z) * dna['hair']['length']

def finish_brows(look, rig):
    brows = bpy.data.objects['Eyebrows']
    settings = look['brows']
    deform_brows(brows, settings)
    seat_brows(brows, bpy.data.objects['Body.Skin'], rig)
    material = brows.data.materials[0]
    tree = material.node_tree
    shader = tree.nodes.get('Principled BSDF')
    texture = next(node for node in tree.nodes if node.type == 'TEX_IMAGE')
    style = TEXTURES / 'brows' / f"{settings['style']}.png"
    if style.is_file():
        texture.image = pack_image(style)
    for socket in ('Alpha', 'Base Color'):
        for link in list(shader.inputs[socket].links):
            tree.links.remove(link)
    shade = rgb(settings['color'])
    brightest = max(shade) or 1
    tint = tree.nodes.new('ShaderNodeMixRGB')
    tint.blend_type = 'MULTIPLY'
    tint.inputs[0].default_value = 1
    tint.inputs[2].default_value = (*(channel / brightest for channel in shade), 1)
    tree.links.new(texture.outputs['Color'], tint.inputs[1])
    color = tint.outputs[0]
    if settings['greying']:
        grey = tree.nodes.new('ShaderNodeMixRGB')
        grey.blend_type = 'MIX'
        grey.inputs[0].default_value = settings['greying']
        grey.inputs[2].default_value = (*rgb('#aaaaaa'), 1)
        tree.links.new(color, grey.inputs[1])
        color = grey.outputs[0]
    tree.links.new(color, shader.inputs['Base Color'])
    density = tree.nodes.new('ShaderNodeMath')
    density.operation = 'MULTIPLY'
    density.inputs[1].default_value = settings['density']
    tree.links.new(texture.outputs['Alpha'], density.inputs[0])
    tree.links.new(density.outputs[0], shader.inputs['Alpha'])
    material.surface_render_method = 'DITHERED'
    shader.inputs['Roughness'].default_value = .92
    shader.inputs['Specular IOR Level'].default_value = .04

def deform_brows(brows, settings):
    for side in (-1, 1):
        group = [vertex for vertex in brows.data.vertices if vertex.co.x * side > 0]
        if len(group) < 4:
            continue
        inner = min(group, key=lambda vertex: abs(vertex.co.x))
        span = max(1e-6, max(abs(vertex.co.x - inner.co.x) for vertex in group))
        mid_z = sum(vertex.co.z for vertex in group) / len(group)
        for vertex in group:
            along = abs(vertex.co.x - inner.co.x) / span
            thickness = settings['thickness'] * ((1 - along) * settings['head_thickness'] + along * settings['tail_thickness'])
            thickness *= 1 + settings['thickness_asymmetry'] * side
            vertex.co.z = mid_z + (vertex.co.z - mid_z) * thickness
            vertex.co.z += math.sin(along * math.pi) * settings['arch'] * span * .18
            vertex.co.x = inner.co.x + (vertex.co.x - inner.co.x) * (1 + (settings['tail_length'] - 1) * along)

def seat_brows(brows, body, rig):
    bpy.context.view_layer.update()
    polygons = [tuple(polygon.vertices) for polygon in body.data.polygons]
    tree = BVHTree.FromPolygons([body.matrix_world @ vertex.co for vertex in body.data.vertices], polygons)
    inverse = brows.matrix_world.inverted()
    for vertex in brows.data.vertices:
        world = brows.matrix_world @ vertex.co
        origin = world + Vector((0, -.08, 0))
        hit, normal, _index, _distance = tree.ray_cast(origin, Vector((0, 1, 0)), .16)
        if hit is None:
            continue
        gap = (hit - world).length
        if .0004 < gap < .008:
            vertex.co = inverse @ (hit + normal * .0012)

def finish_eyes(look, rig, collection):
    eyes = bpy.data.objects['Eyes']
    settings = look['eyes']
    for polygon in eyes.data.polygons:
        polygon.use_smooth = True
    material = eyes.data.materials[0]
    tree = material.node_tree
    shader = tree.nodes.get('Principled BSDF')
    texture = next(node for node in tree.nodes if node.type == 'TEX_IMAGE')
    painted = prepared_eye(settings)
    texture.image = pack_image(painted)
    for link in list(shader.inputs['Base Color'].links):
        tree.links.remove(link)
    tint = tree.nodes.new('ShaderNodeMixRGB')
    tint.blend_type = 'MULTIPLY'
    tint.inputs[0].default_value = 1
    tint.inputs[2].default_value = (*rgb(settings['sclera_tint']), 1)
    tree.links.new(texture.outputs['Color'], tint.inputs[1])
    tree.links.new(tint.outputs[0], shader.inputs['Base Color'])
    aim_irises(eyes, settings['iris_scale'])
    normal_path = TEXTURES / 'eyes' / 'normal.png'
    if normal_path.is_file():
        normal_tex = texture_node(tree, pack_image(normal_path, 'Non-Color'))
        normal = tree.nodes.new('ShaderNodeNormalMap')
        normal.inputs['Strength'].default_value = .65
        tree.links.new(normal_tex.outputs['Color'], normal.inputs['Color'])
        tree.links.new(normal.outputs['Normal'], shader.inputs['Normal'])
    # Coat is what turns the low-poly highlight into a hard polygon. Wetness stays in roughness and the baked catchlight.
    shader.inputs['Roughness'].default_value = .48 - .2 * settings['wetness']
    shader.inputs['Specular IOR Level'].default_value = .34
    shader.inputs['Coat Weight'].default_value = 0
    stock = bpy.data.objects.get('Eyelashes')
    if stock:
        bpy.data.objects.remove(stock, do_unlink=True)
    if settings['lash_density'] > .05:
        add_lashes(rig, collection, settings['lash_density'])
    eyes['eye_finish'] = 'Painted iris, soft catchlight, cornea shell, no sharp coat'

def prepared_eye(settings):
    from PIL import Image, ImageDraw
    painted = TEXTURES / 'eyes' / f"{settings['color']}.png"
    if painted.is_file() and abs(settings['pupil_size'] - 1) <= .05:
        return painted
    source = painted if painted.is_file() else ROOT.parents[1] / 'assets/sources/makehuman-core/eyes/materials' / f"{settings['color']}_eye.png"
    image = Image.open(source).convert('RGBA')
    pixels = image.load()
    width, height = image.size
    dark = []
    for y in range(0, height, 2):
        for x in range(0, width, 2):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 200 and red + green + blue < 80:
                dark.append((x, y))
    left = [point for point in dark if point[0] < width / 2] or [(width * .29, height * .72)]
    right = [point for point in dark if point[0] >= width / 2] or [(width * .71, height * .30)]
    centers = (
        (sum(point[0] for point in left) / len(left), sum(point[1] for point in left) / len(left)),
        (sum(point[0] for point in right) / len(right), sum(point[1] for point in right) / len(right)),
    )
    radius = 70
    cx, cy = centers[0]
    while radius < 180 and cx + radius < width:
        red, green, blue, _alpha = pixels[int(cx + radius), int(cy)]
        if red + green + blue > 420 and abs(red - green) < 40:
            break
        radius += 1
    pupil = radius * .2 * settings['pupil_size']
    limbal = settings['limbal_darkness']
    for y in range(height):
        for x in range(width):
            nearest = min(centers, key=lambda point: (point[0] - x) ** 2 + (point[1] - y) ** 2)
            distance = math.hypot(x - nearest[0], y - nearest[1])
            red, green, blue, alpha = pixels[x, y]
            if distance < pupil:
                pixels[x, y] = (8, 6, 6, 255)
            elif distance < radius * .22 * 1.35 and settings['pupil_size'] < 1 and red + green + blue < 80:
                pixels[x, y] = (78, 46, 28, 255)
            elif radius * .75 < distance < radius:
                shade = (distance - radius * .75) / (radius * .25) * limbal
                pixels[x, y] = tuple(int(channel * (1 - .55 * shade)) for channel in (red, green, blue)) + (255,)
    if settings['catchlight'] > 0:
        draw = ImageDraw.Draw(image, 'RGBA')
        for center in centers:
            highlight = (center[0] - radius * .28, center[1] - radius * .32)
            alpha = int(70 * settings['catchlight'])
            draw.ellipse((highlight[0] - 10, highlight[1] - 6, highlight[0] + 10, highlight[1] + 6), fill=(255, 250, 244, alpha))
    destination = Path('/tmp') / f"eye-{settings['color']}-{settings['pupil_size']:.2f}-{settings['limbal_darkness']:.2f}.png"
    image.save(destination)
    return destination

def aim_irises(eyes, scale):
    """The fitted eye's front faces do not all land on the iris. Stamp the iris on the faces that look at the camera."""
    mesh = eyes.data
    layer = mesh.uv_layers.active
    if layer is None:
        return
    view = Vector((0, -1, 0))
    spread = .42 / max(.7, scale)
    for polygon in mesh.polygons:
        for loop_index, vertex_index in zip(polygon.loop_indices, polygon.vertices):
            vertex = mesh.vertices[vertex_index]
            if vertex.normal.dot(view) < .15:
                continue
            center = Vector((0.295, 0.291)) if vertex.co.x >= 0 else Vector((0.698, 0.700))
            layer.data[loop_index].uv = center + Vector((vertex.normal.x, vertex.normal.z)) * spread

def scale_iris(eyes, scale):
    if abs(scale - 1) < 1e-4:
        return
    samples = [loop.uv.copy() for loop in eyes.data.uv_layers.active.data]
    centers = []
    for seed in (Vector((.29, .29)), Vector((.70, .70))):
        near = [uv for uv in samples if (uv - seed).length < .08] or [min(samples, key=lambda uv: (uv - seed).length_squared)]
        centers.append(sum(near, Vector((0, 0))) / len(near))
    for loop in eyes.data.uv_layers.active.data:
        center = min(centers, key=lambda point: (loop.uv - point).length_squared)
        loop.uv = center + (loop.uv - center) / scale

def cornea_catchlight(catchlight):
    from PIL import Image, ImageDraw, ImageFilter
    image = Image.new('RGBA', (1024, 1024), (255, 250, 244, 0))
    draw = ImageDraw.Draw(image, 'RGBA')
    alpha = int(90 * max(0, min(1, catchlight)))
    for center in ((0.29 * 1024, 0.72 * 1024), (0.71 * 1024, 0.30 * 1024)):
        draw.ellipse((center[0] - 28, center[1] - 18, center[0] + 22, center[1] + 14), fill=(255, 252, 248, alpha))
    image = image.filter(ImageFilter.GaussianBlur(6))
    destination = Path('/tmp') / f'cornea-catch-{catchlight:.2f}.png'
    image.save(destination)
    return destination

def add_cornea(eyes, collection, catchlight):
    if bpy.data.objects.get('Eyes.Cornea'):
        return
    cornea = eyes.copy()
    cornea.data = eyes.data.copy()
    cornea.name = 'Eyes.Cornea'
    cornea['role'] = 'Eyes.Cornea'
    collection.objects.link(cornea)
    look = Vector((0, -1, 0))
    for vertex in cornea.data.vertices:
        if vertex.normal.dot(look) < .25:
            continue
        vertex.co += vertex.normal * .0008
    # Keep the shell, but drop the back so it does not double the hidden hemisphere.
    import bmesh
    mesh = bmesh.new()
    mesh.from_mesh(cornea.data)
    faces = [face for face in mesh.faces if face.normal.dot(look) < .2]
    if faces and len(faces) < len(mesh.faces) * .8:
        bmesh.ops.delete(mesh, geom=faces, context='FACES')
    mesh.to_mesh(cornea.data)
    mesh.free()
    if len(cornea.data.polygons) < 20:
        bpy.data.objects.remove(cornea, do_unlink=True)
        return
    material = bpy.data.materials.new('Eyes | Cornea catchlight')
    material.use_nodes = True
    material.surface_render_method = 'BLENDED'
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (1, .98, .94, 1)
    shader.inputs['Roughness'].default_value = .12
    shader.inputs['Specular IOR Level'].default_value = .2
    shader.inputs['Alpha'].default_value = .18 * max(0, catchlight)
    shader.inputs['Coat Weight'].default_value = 0
    cornea.data.materials.clear()
    cornea.data.materials.append(material)
    catch = cornea_catchlight(catchlight)
    node = texture_node(material.node_tree, pack_image(catch))
    material.node_tree.links.new(node.outputs['Color'], shader.inputs['Base Color'])
    material.node_tree.links.new(node.outputs['Alpha'], shader.inputs['Alpha'])

def add_lashes(rig, collection, density):
    if bpy.data.objects.get('Eyelashes.Fine'):
        return
    body = bpy.data.objects['Body.Skin']
    material = bpy.data.materials.new('Eyelashes | Fine')
    material.use_nodes = True
    material.surface_render_method = 'DITHERED'
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*rgb('#241c18'), 1)
    shader.inputs['Alpha'].default_value = .35 + .5 * density
    shader.inputs['Roughness'].default_value = .8
    for side, bone_name in ((-1, 'eye.R'), (1, 'eye.L')):
        bone = rig.data.bones[bone_name].head_local
        chosen = []
        for vertex in body.data.vertices:
            point = vertex.co
            if (point - bone).length > .018 or point.z < bone.z or point.y > bone.y:
                continue
            chosen.append(point.copy())
        if len(chosen) < 6:
            continue
        chosen.sort(key=lambda point: point.x)
        step = max(1, len(chosen) // 10)
        points = chosen[::step][:10]
        vertices = []
        for point in points:
            vertices.append((point.x, point.y - .001, point.z))
            vertices.append((point.x, point.y - .001, point.z + .004 * density))
        faces = [(index, index + 1, index + 3, index + 2) for index in range(0, len(vertices) - 2, 2)]
        mesh = bpy.data.meshes.new(f'Eyelashes.Fine.{side}')
        mesh.from_pydata(vertices, [], faces)
        mesh.materials.append(material)
        obj = bpy.data.objects.new('Eyelashes.Fine', mesh)
        obj['role'] = 'Eyelashes.Fine'
        collection.objects.link(obj)
        group = obj.vertex_groups.new(name='head')
        group.add(list(range(len(mesh.vertices))), 1, 'REPLACE')
        modifier = obj.modifiers.new('Character skin', 'ARMATURE')
        modifier.object = rig

def add_skin(dna, look, rig, collection, bake):
    source = next(obj for obj in bpy.data.objects if obj.name.startswith('SOURCE.Body'))
    skin = source.data.materials[0]
    nodes = skin.node_tree.nodes
    links = skin.node_tree.links
    shader = nodes.get('Principled BSDF')
    settings = look['skin']
    texture = next(node for node in nodes if node.type == 'TEX_IMAGE')
    albedo = TEXTURES / 'skin' / f"{settings['asset']}_albedo.png"
    if albedo.is_file():
        texture.image = pack_image(albedo)
    uv = nodes.new('ShaderNodeTexCoord')
    color = texture.outputs['Color']
    color = mix_color(nodes, links, color, (settings['tone'],) * 3, 1, 'MULTIPLY')
    head = mask_image(nodes, links, uv, TEXTURES / 'skin' / 'head_mask.png')
    if settings['undertone']:
        warm = rgb('#c4a07a') if settings['undertone'] > 0 else rgb('#d5c7bc')
        color = mix_color(nodes, links, color, warm, scale_socket(nodes, links, head, abs(settings['undertone']) * .35), 'MIX')
    cheek = mask_image(nodes, links, uv, TEXTURES / 'skin' / 'cheek_mask.png')
    if settings['ruddiness'] and cheek is not None:
        color = mix_color(nodes, links, color, rgb('#b16c60'), scale_socket(nodes, links, cheek, settings['ruddiness'] * .45), 'MIX')
    if settings['age_lines']:
        lines = image_factor(nodes, links, uv, TEXTURES / 'skin' / 'age_lines.png')
        if lines is not None:
            color = mix_color(nodes, links, color, rgb('#8d6b5e'), scale_socket(nodes, links, lines, settings['age_lines']), 'MIX')
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 46
    noise.inputs['Detail'].default_value = 2
    links.new(uv.outputs['UV'], noise.inputs['Vector'])
    if settings['freckles'] and head is not None:
        spots = math_node(nodes, links, 'GREATER_THAN', noise.outputs['Fac'], .72)
        color = mix_color(nodes, links, color, rgb('#8a6851'), scale_socket(nodes, links, scale_socket(nodes, links, spots, head), min(1, settings['freckles'] / 40)), 'MIX')
    beard = dna['facial_hair']
    if beard['style'] == 'stubble' and beard['coverage'] and head is not None:
        dots = math_node(nodes, links, 'GREATER_THAN', noise.outputs['Fac'], .58)
        color = mix_color(nodes, links, color, rgb(grey_color('#4c3d32', beard['greying'])), scale_socket(nodes, links, scale_socket(nodes, links, dots, head), beard['coverage'] * .55), 'MIX')
    links.new(color, shader.inputs['Base Color'])
    normal_path = TEXTURES / 'skin' / f"{settings['asset']}_normal.png"
    if normal_path.is_file():
        normal_tex = texture_node(nodes, pack_image(normal_path, 'Non-Color'))
        links.new(uv.outputs['UV'], normal_tex.inputs['Vector'])
        normal = nodes.new('ShaderNodeNormalMap')
        normal.inputs['Strength'].default_value = .35 + settings['pores'] * .9
        links.new(normal_tex.outputs['Color'], normal.inputs['Color'])
        links.new(normal.outputs['Normal'], shader.inputs['Normal'])
    rough_path = TEXTURES / 'skin' / f"{settings['asset']}_roughness.png"
    if rough_path.is_file():
        rough_tex = texture_node(nodes, pack_image(rough_path, 'Non-Color'))
        links.new(uv.outputs['UV'], rough_tex.inputs['Vector'])
        rough = nodes.new('ShaderNodeMath')
        rough.operation = 'SUBTRACT'
        links.new(rough_tex.outputs['Color'], rough.inputs[0])
        rough.inputs[1].default_value = settings['oiliness'] * .12
        links.new(rough.outputs[0], shader.inputs['Roughness'])
    else:
        shader.inputs['Roughness'].default_value = .78
    shader.inputs['Specular IOR Level'].default_value = .18
    shader.inputs['Subsurface Weight'].default_value = .04
    shader.inputs['Subsurface Scale'].default_value = .012
    temp = source.copy()
    temp.data = source.data.copy()
    temp.name = 'Skin layer bake'
    collection.objects.link(temp)
    temp.hide_viewport = temp.hide_render = False
    temp.hide_set(False)
    temp.data.materials[0] = skin.copy()
    bpy.ops.object.select_all(action='DESELECT')
    temp.select_set(True)
    bpy.context.view_layer.objects.active = temp
    bpy.ops.object.shape_key_remove(all=True, apply_mix=True)
    for modifier in list(temp.modifiers):
        if modifier.type == 'MASK' and modifier.vertex_group == 'body' and not modifier.invert_vertex_group:
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        else:
            temp.modifiers.remove(modifier)
    bake(temp, size=2048)
    baked = temp.data.materials[0]
    baked_shader = baked.node_tree.nodes.get('Principled BSDF')
    if normal_path.is_file():
        baked_normal = texture_node(baked.node_tree, pack_image(normal_path, 'Non-Color'))
        normal = baked.node_tree.nodes.new('ShaderNodeNormalMap')
        normal.inputs['Strength'].default_value = .35 + settings['pores'] * .9
        baked.node_tree.links.new(baked_normal.outputs['Color'], normal.inputs['Color'])
        baked.node_tree.links.new(normal.outputs['Normal'], baked_shader.inputs['Normal'])
    for obj in collection.objects:
        if obj.type == 'MESH' and obj.get('role') in ['Body', 'Hands.L', 'Hands.R']:
            obj.data.materials[0] = baked
    bpy.data.objects.remove(temp, do_unlink=True)

def mix_color(nodes, links, base, tone, factor, blend):
    node = nodes.new('ShaderNodeMixRGB')
    node.blend_type = blend
    links.new(base, node.inputs[1])
    node.inputs[2].default_value = (*tone, 1)
    plug(links, factor, node.inputs[0])
    return node.outputs[0]

def plug(links, value, socket):
    if isinstance(value, (float, int)):
        socket.default_value = value
    else:
        links.new(value, socket)

def math_node(nodes, links, operation, left, right):
    node = nodes.new('ShaderNodeMath')
    node.operation = operation
    plug(links, left, node.inputs[0])
    plug(links, right, node.inputs[1])
    return node.outputs[0]

def scale_socket(nodes, links, socket, factor):
    return math_node(nodes, links, 'MULTIPLY', socket, factor)

def mask_image(nodes, links, uv, path):
    if not path.is_file():
        return None
    node = texture_node(nodes, pack_image(path, 'Non-Color'))
    links.new(uv.outputs['UV'], node.inputs['Vector'])
    separate = nodes.new('ShaderNodeSeparateColor')
    links.new(node.outputs['Color'], separate.inputs['Color'])
    return separate.outputs['Red']

def image_factor(nodes, links, uv, path):
    if not path.is_file():
        return None
    node = texture_node(nodes, pack_image(path))
    links.new(uv.outputs['UV'], node.inputs['Vector'])
    return node.outputs['Alpha']
