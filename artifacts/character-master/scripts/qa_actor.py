"""Render matching bald head QA, turnaround and facial tests from a saved character."""
import argparse
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from facial import EXPRESSIONS,set_expression

def render_qa(folder):
    folder=Path(folder);bpy.ops.wm.open_mainfile(filepath=str(folder/'Character-Master.blend'))
    collection=next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
    rig=bpy.data.objects['Character.Rig'];scene=bpy.context.scene;scene.frame_set(1)
    output=folder/'qa';output.mkdir(exist_ok=True)
    for obj in collection.objects:
        if obj.type!='MESH':continue
        if obj.data.shape_keys and obj.data.shape_keys.animation_data:obj.data.shape_keys.animation_data.action=None
    body=bpy.data.objects['Body.Skin'];basis=[v.co.copy() for v in body.data.vertices]
    results={}
    for name in EXPRESSIONS:
        set_expression(collection,name)
        obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=obj.to_mesh()
        assert all(math.isfinite(c) for v in mesh.vertices for c in v.co)
        motion=max((v.co-basis[v.index]).length for v in mesh.vertices)
        assert motion>1e-6,'Expression did not move: '+name
        results[name]={'maxMotionM':motion*rig.scale.x}
        obj.to_mesh_clear()
    set_expression(collection)
    obj=body.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=obj.to_mesh()
    recovery=max((v.co-basis[v.index]).length for v in mesh.vertices);obj.to_mesh_clear()
    assert recovery<1e-6,'Neutral identity drift'
    source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))
    full=source.copy();full.data=source.data.copy();full.name='QA.FullBody';collection.objects.link(full)
    full.parent=rig;full.matrix_parent_inverse=body.matrix_parent_inverse.copy();full['role']='Body'
    full.hide_render=full.hide_viewport=False;full.hide_set(False)
    for modifier in list(full.modifiers):
        if modifier.type=='MASK' and not (modifier.vertex_group=='body' and not modifier.invert_vertex_group):full.modifiers.remove(modifier)
        elif modifier.type=='ARMATURE':modifier.object=rig
    body.hide_render=True;body=full
    def material(name,color):
        mat=bpy.data.materials.new(name);mat.diffuse_color=(*color,1)
        shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=mat.diffuse_color;shader.inputs['Roughness'].default_value=.85
        return mat
    clay=material('QA | Identical neutral clay',(.37,.36,.34));eye_clay=material('QA | Identical eyes',(.56,.55,.52));brow_clay=material('QA | Identical brow color',(.065,.06,.055))
    for obj in collection.objects:
        if obj.type!='MESH':continue
        role=obj.get('role');obj.hide_render=role not in ['Body','Eyes','Eyebrows','Teeth','Tongue']
        if role=='Body' and obj!=full:obj.hide_render=True
        if not obj.hide_render:
            obj.data.materials.clear();obj.data.materials.append(eye_clay if role=='Eyes' else brow_clay if role=='Eyebrows' else clay)
            for p in obj.data.polygons:p.material_index=0
    dna=json.loads((folder/'dna.json').read_text());height=dna['body']['height_m']
    eye=(rig.matrix_world@rig.data.bones['eye.L'].head_local+rig.matrix_world@rig.data.bones['eye.R'].head_local)*.5
    evaluated=body.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=evaluated.to_mesh()
    world=[body.matrix_world@v.co for v in mesh.vertices];evaluated.to_mesh_clear()
    top=max(v.z for v in world)
    low=eye.z-height*(.17 if dna['base']=='child' else .125);head_height=top-low
    points=[v for v in world if v.z>low and abs(v.x)<height*.15]
    center=Vector((0,(min(v.y for v in points)+max(v.y for v in points))*.5,(top+low)*.5));camera=scene.camera
    camera.data.type='ORTHO';camera.data.ortho_scale=max(head_height,max(v.y for v in points)-min(v.y for v in points))*1.25
    scene.render.engine='CYCLES';scene.cycles.samples=12;scene.cycles.use_denoising=True
    scene.render.resolution_x=scene.render.resolution_y=512
    scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG'
    for obj in scene.objects:
        if obj.type=='LIGHT':obj.data.color=(1,1,1)
    def render(name,angle=0):
        camera.location=center+Vector((math.sin(angle)*height,-math.cos(angle)*height,0))
        camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
        scene.render.filepath=str(output/(name+'.png'));bpy.ops.render.render(write_still=True)
    for name,angle in [('front',0),('three-quarter',math.pi*.23),('profile',math.pi*.5)]:render(name,angle)
    for name in EXPRESSIONS:
        set_expression(collection,name);render(name)
    set_expression(collection)
    report={'passed':True,'views':['front','three-quarter','profile'],'expressions':results,'neutralRecoveryM':recovery*rig.scale.x,'identicalMaterials':True,'hairAndClothesHidden':True,'animationClip':'Talk_Check','humanReview':'pending'}
    (output/'report.json').write_text(json.dumps(report,indent=2)+'\n')
    print('DNA_QA_OK',folder.name,flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('folder',type=Path);args=parser.parse_args(sys.argv[sys.argv.index('--')+1:]);render_qa(args.folder.resolve())
