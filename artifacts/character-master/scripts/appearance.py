"""Portable skin layers and independently editable hair, brow and eye appearance."""
import bpy
from mathutils import Vector

def rgb(hexcode):
    values=[int(hexcode[i:i+2],16)/255 for i in (1,3,5)]
    return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values)

def grey_color(hexcode,amount):
    channels=[int(hexcode[i:i+2],16) for i in (1,3,5)]
    return '#'+''.join(f'{round(v*(1-amount)+170*amount):02x}' for v in channels)

def apply_appearance(dna,rig,collection,bake):
    brows=bpy.data.objects['Eyebrows']
    for side in [-1,1]:
        vertices=[v for v in brows.data.vertices if v.co.x*side>0]
        mid=sum(v.co.z for v in vertices)/len(vertices)
        for v in vertices:v.co.z=mid+(v.co.z-mid)*dna['brows']['thickness']
    mat=brows.data.materials[0];shader=mat.node_tree.nodes.get('Principled BSDF')
    for link in list(shader.inputs['Base Color'].links):mat.node_tree.links.remove(link)
    shader.inputs['Base Color'].default_value=(*rgb(grey_color(dna['brows']['color'],dna['brows']['greying'])),1)
    hair=bpy.data.objects['Hair'];head=rig.data.bones['head'].head_local
    for v in hair.data.vertices:
        v.co.x*=dna['hair']['volume'];v.co.y=head.y+(v.co.y-head.y)*dna['hair']['volume']
        v.co.z=head.z+(v.co.z-head.z)*dna['hair']['length']
    eyes=bpy.data.objects['Eyes'];scale=dna['eyes']['iris_scale']
    for uv in eyes.data.uv_layers.active.data:
        center=min([Vector((.735,.72)),Vector((.28,.27))],key=lambda p:(uv.uv-p).length_squared)
        uv.uv=center+(uv.uv-center)/scale
    eye_shader=eyes.data.materials[0].node_tree.nodes.get('Principled BSDF')
    tint=eyes.data.materials[0].node_tree.nodes.new('ShaderNodeMixRGB');tint.blend_type='MULTIPLY';tint.inputs[0].default_value=1
    tint.inputs[2].default_value=(*rgb(dna['eyes']['sclera_tint']),1)
    color=eye_shader.inputs['Base Color'].links[0].from_socket
    eyes.data.materials[0].node_tree.links.new(color,tint.inputs[1]);eyes.data.materials[0].node_tree.links.new(tint.outputs[0],eye_shader.inputs['Base Color'])
    add_skin(dna,rig,collection,bake)

def add_skin(dna,rig,collection,bake):
    source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))
    skin=source.data.materials[0];nodes=skin.node_tree.nodes;links=skin.node_tree.links
    shader=nodes.get('Principled BSDF');color=shader.inputs['Base Color'].links[0].from_socket
    geometry=nodes.new('ShaderNodeNewGeometry');xyz=nodes.new('ShaderNodeSeparateXYZ');links.new(geometry.outputs['Position'],xyz.inputs[0])
    height=dna['body']['height_m']
    def math_node(operation,a,b):
        node=nodes.new('ShaderNodeMath');node.operation=operation
        for i,value in enumerate([a,b]):
            if isinstance(value,(float,int)):node.inputs[i].default_value=value
            else:links.new(value,node.inputs[i])
        return node.outputs[0]
    def multiply_color(base,tone,factor,blend='MIX'):
        node=nodes.new('ShaderNodeMixRGB');node.blend_type=blend
        links.new(base,node.inputs[1]);node.inputs[2].default_value=(*tone,1)
        if isinstance(factor,(float,int)):node.inputs[0].default_value=factor
        else:links.new(factor,node.inputs[0])
        return node.outputs[0]
    color=multiply_color(color,(dna['skin']['tone'],)*3,1,'MULTIPLY')
    eye=(rig.matrix_world@rig.data.bones['eye.L'].head_local+rig.matrix_world@rig.data.bones['eye.R'].head_local)*.5
    head_mask=math_node('MULTIPLY',math_node('GREATER_THAN',xyz.outputs['Z'],eye.z-height*.085),math_node('LESS_THAN',xyz.outputs['Y'],eye.y))
    cheek_mask=math_node('MULTIPLY',head_mask,math_node('LESS_THAN',xyz.outputs['Z'],eye.z-height*.006))
    color=multiply_color(color,rgb('#b16c60'),math_node('MULTIPLY',cheek_mask,dna['skin']['ruddiness']*.25))
    noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=380;noise.inputs['Detail'].default_value=2
    links.new(geometry.outputs['Position'],noise.inputs['Vector'])
    if dna['skin']['freckles']:
        spots=math_node('GREATER_THAN',noise.outputs['Fac'],.73-dna['skin']['freckles']*.0008)
        color=multiply_color(color,rgb('#8a6851'),math_node('MULTIPLY',math_node('MULTIPLY',spots,head_mask),.32))
    beard=dna['facial_hair']
    if beard['style']=='stubble' and beard['coverage']:
        lower=math_node('MULTIPLY',head_mask,math_node('LESS_THAN',xyz.outputs['Z'],eye.z-height*.034))
        dots=math_node('GREATER_THAN',noise.outputs['Fac'],.52)
        color=multiply_color(color,rgb(grey_color('#4c3d32',beard['greying'])),math_node('MULTIPLY',math_node('MULTIPLY',dots,lower),beard['coverage']*.6))
    links.new(color,shader.inputs['Base Color'])
    bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=dna['skin']['detail'];bump.inputs['Distance'].default_value=.00035
    links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],shader.inputs['Normal'])
    shader.inputs['Subsurface Weight'].default_value=.035
    shader.inputs['Subsurface Scale'].default_value=.012
    shader.inputs['Roughness'].default_value=.86
    temp=source.copy();temp.data=source.data.copy();temp.name='Skin layer bake';collection.objects.link(temp)
    temp.hide_viewport=temp.hide_render=False;temp.hide_set(False)
    temp.data.materials[0]=skin.copy()
    bpy.ops.object.select_all(action='DESELECT');temp.select_set(True);bpy.context.view_layer.objects.active=temp
    bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
    for modifier in list(temp.modifiers):
        if modifier.type=='MASK' and modifier.vertex_group=='body' and not modifier.invert_vertex_group:bpy.ops.object.modifier_apply(modifier=modifier.name)
        else:temp.modifiers.remove(modifier)
    bake(temp,size=2048)
    baked=temp.data.materials[0];shader=baked.node_tree.nodes.get('Principled BSDF')
    normal_image=bpy.data.images.new(dna['id']+' | Skin detail normal',2048,2048,alpha=False);normal_image.colorspace_settings.name='Non-Color'
    node=baked.node_tree.nodes.new('ShaderNodeTexImage');node.image=normal_image;baked.node_tree.nodes.active=node
    bpy.ops.object.bake(type='NORMAL',margin=8,use_clear=True);normal_image.pack()
    normal=baked.node_tree.nodes.new('ShaderNodeNormalMap');baked.node_tree.links.new(node.outputs['Color'],normal.inputs['Color']);baked.node_tree.links.new(normal.outputs['Normal'],shader.inputs['Normal'])
    for obj in collection.objects:
        if obj.type=='MESH' and obj.get('role') in ['Body','Hands.L','Hands.R']:obj.data.materials[0]=baked
    bpy.data.objects.remove(temp,do_unlink=True)
