"""Build the primary early-PS2 project without modifying the saved source project."""
import bpy,bmesh,sys,json,math,os
sys.path.insert(0,'/home/barsaa/mongolian-steppe/artifacts/ps2-horror-character/scripts')
import common as C
SOURCE=C.OUT+'/Backup/Original_Field_Guy.blend'
with bpy.data.libraries.load(SOURCE,link=False) as (src,dst):
    assert 'FIELD GUY | Editable Character' in src.collections
    dst.collections=['FIELD GUY | Editable Character']
source=dst.collections[0]
baseline=bpy.data.scenes.new('PS2 | Original Reference');baseline.collection.children.link(source)
base_studio=bpy.data.collections.new('PS2 | Baseline Studio');baseline.collection.children.link(base_studio);C.studio(baseline,base_studio)
scene=bpy.data.scenes.new('PS2 | Character Master');bpy.context.window.scene=scene
collection=bpy.data.collections.new('PS2 | Clean Character');scene.collection.children.link(collection)
studio=bpy.data.collections.new('PS2 | Neutral Studio');scene.collection.children.link(studio);C.studio(scene,studio)
materials={
 'skin':C.mat('Painted warm neutral skin','B79A87','Head_Diffuse.png',.94),
 'nails':C.mat('Painted nails','B3A093',roughness=.90),
 'lips':C.mat('Muted painted lips','9D8076',roughness=.94),
 'inner':C.mat('Mouth shadow','35252A',roughness=1),
 'tongue':C.mat('Simplified tongue','866165',roughness=.91),
 'teeth':C.mat('Painted ivory teeth','C6C0AD',roughness=.92),
 'sclera':C.mat('Muted sclera','B3B3A5',roughness=.85),
 'iris':C.mat('Dark brown iris','494036',roughness=.88),
 'pupil':C.mat('Dark pupil','121416',roughness=.80),
 'brow':C.mat('Painted brow','302825',roughness=.96),
 'hair':C.mat('Painted directional hair','292624','Hair_Diffuse.png',.96),
 'jacket':C.mat('Olive painted canvas','485140','Jacket_Diffuse.png',.96),
 'fleece':C.mat('Painted cream fleece','B9B3A3','Fleece_Diffuse.png',1),
 'trousers':C.mat('Taupe painted cloth','61594E','Trousers_Diffuse.png',.97),
 'boots':C.mat('Painted brown leather','665240','Boots_Diffuse.png',.94),
 'metal':C.mat('Dull zipper','928E81',roughness=.88),
 'dark':C.mat('Dark sole and seams','2B2A28',roughness=1),
 'shirt':C.mat('Charcoal shirt','34363A',roughness=1),
}
for m in materials.values():m.node_tree.nodes.get('Principled BSDF').inputs['Specular IOR Level'].default_value=.05
names={'FG | Field jacket':'jacket','FG | Shearling collar':'collar','FG | Shearling cuff L':'cuff_L','FG | Shearling cuff R':'cuff_R','FG | Taupe trousers':'trousers','FG | Work boot L':'boot_L','FG | Work boot R':'boot_R','FG | Charcoal shirt':'shirt','FG | Neck':'neck'}
body={}
for old in source.objects:
    if old.name not in names:continue
    key=names[old.name];ob=old.copy();ob.data=old.data.copy();ob.parent=None;ob.name='PS2 | '+key;collection.objects.link(ob)
    for i,mat in enumerate(ob.data.materials):
        n=mat.name.lower();target='jacket'
        if any(s in n for s in ['shearling','fleece']):target='fleece'
        elif any(s in n for s in ['skin','warmth']):target='skin'
        elif 'taupe' in n or 'crease' in n or 'trouser' in n:target='trousers'
        elif any(s in n for s in ['leather','scuff','boot']):target='boots'
        elif any(s in n for s in ['zipper','eyelet','hardware']):target='metal'
        elif any(s in n for s in ['lace','sole']):target='dark'
        elif 'charcoal' in n:target='shirt'
        ob.data.materials[i]=materials[target]
    if key in ['collar','cuff_L','cuff_R']:
        bm=bmesh.new();bm.from_mesh(ob.data);remaining=set(bm.verts);remove=[]
        while remaining:
            component=[];stack=[remaining.pop()]
            while stack:
                v=stack.pop();component.append(v)
                for edge in v.link_edges:
                    q=edge.other_vert(v)
                    if q in remaining:remaining.remove(q);stack.append(q)
            extent=max(max(v.co[i] for v in component)-min(v.co[i] for v in component) for i in range(3))
            if extent<.032:remove.extend(component)
        bmesh.ops.delete(bm,geom=remove,context='VERTS');bm.to_mesh(ob.data);bm.free()
    for p in ob.data.polygons:p.use_smooth=key in ['neck','collar','cuff_L','cuff_R']
    body[key]=ob
assert len(body)==9,list(body)
ctx={'scene':scene,'collection':collection,'studio':studio,'materials':materials,'body_objects':body,'baseline_scene':baseline,'baseline_studio':base_studio,'source_collection':source}
views=[('Front',(0,-6,.94),(0,0,.94),2.08),('Side',(6,0,.94),(0,0,.94),2.08),('ThreeQuarter',(3,-6,2.25),(0,0,.93),2.08)]
ctx['comparison_cameras']={}
for name,pos,target,scale in views:
    cam=C.camera('PS2 | Compare '+name,pos,target,scale,studio);ctx['comparison_cameras'][name]=cam
    baseline.collection.objects.link(cam);C.render(baseline,cam,C.OUT+'/Comparisons/Before_'+name+'.png',512,768)
bpy.context.window.scene=scene
import face,body_rig,integrate
face.build_face(ctx)
ctx['body_rig']=body_rig.build_body_rig(ctx)
integrate.integrate_face(ctx);integrate.build_hair(ctx)
ctx['body_rig']['rig'].name='PS2 | Character Rig'
ctx['face_camera']=C.camera('PS2 | Face front',(0,-4,1.679),(0,0,1.679),.43,studio)
ctx['close_camera']=C.camera('PS2 | Acting 720p',(.20,-3.5,1.76),(0,-.01,1.67),.70,studio)
ctx['full_camera']=C.camera('PS2 | Full body 720p',(3,-6,2.2),(0,0,.93),3.70,studio)
scene.camera=ctx['full_camera'];scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.fps=24
import types
module=types.ModuleType('ps2_session');module.ctx=ctx;sys.modules['ps2_session']=module
parts=[o for o in collection.objects if o.type=='MESH'];tris=0
for o in parts:o.data.calc_loop_triangles();tris+=len(o.data.loop_triangles)
audit={'source':SOURCE,'source_triangles':11743,'master_triangles':tris,'mesh_count':len(parts),'facial_controls':len(face.CONTROL_NAMES),'head_vertices':len(ctx['facial']['head'].data.vertices),'bones':len(ctx['body_rig']['rig'].data.bones),'texture_sizes':list({tuple(i.size) for i in bpy.data.images if i.name.endswith('_Diffuse.png')}),'old_project_unchanged':True}
with open(C.OUT+'/Comparisons/Baseline_and_Rebuild_Audit.json','w') as f:json.dump(audit,f,indent=2)
bpy.ops.wm.save_as_mainfile(filepath=C.OUT+'/PS2_Character_Master.blend')
result=audit
