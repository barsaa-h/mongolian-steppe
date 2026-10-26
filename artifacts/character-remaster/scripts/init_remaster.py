import bpy,bmesh,sys,os,math
sys.path.insert(0,'/home/barsaa/mongolian-steppe/artifacts/character-remaster/scripts')
import common as C
assert 'CM | Cinematic Master' not in bpy.data.scenes
scene=bpy.data.scenes.new('CM | Cinematic Master');bpy.context.window.scene=scene
collection=bpy.data.collections.new('CM | Clean Character');scene.collection.children.link(collection)
studio=bpy.data.collections.new('CM | Studio');scene.collection.children.link(studio)
C.studio(scene,studio)
materials={
 'skin':C.mat('Neutral warm skin','BA9984','Head_BaseColor.png',.72),
 'nails':C.mat('Natural nails','B99F93',roughness=.65),
 'lips':C.mat('Muted lips','9C756C',roughness=.70),
 'inner':C.mat('Mouth interior','331B20',roughness=.88),
 'tongue':C.mat('Tongue','925F61',roughness=.58),
 'teeth':C.mat('Warm teeth','D0C8B5',roughness=.46),
 'sclera':C.mat('Sclera ivory','C1C0AE',roughness=.32),
 'iris':C.mat('Dark brown iris','44362D',roughness=.34),
 'pupil':C.mat('Pupil','121315',roughness=.22),
 'brow':C.mat('Brown black brows','29231F',roughness=.86),
 'hair':C.mat('Directional hair','292321','Hair_BaseColor.png',.80),
 'jacket':C.mat('Olive weathered canvas','485241','Jacket_BaseColor.png',.90),
 'fleece':C.mat('Shearling fibers','C5BCA9','Shearling_BaseColor.png',.96),
 'trousers':C.mat('Taupe cloth','61574D','Trousers_BaseColor.png',.88),
 'boots':C.mat('Worn boot leather','68503D','Boots_BaseColor.png',.73),
 'metal':C.mat('Aged brass hardware','9A9588',roughness=.48),
 'dark':C.mat('Dark sole and stitching','2B2A28',roughness=.95),
 'shirt':C.mat('Charcoal jersey','34353A',roughness=.91),
}
p=materials['skin'].node_tree.nodes.get('Principled BSDF');p.inputs['Subsurface Weight'].default_value=.035;p.inputs['Subsurface Radius'].default_value=(1,.42,.25)
for key,file in [('skin','Head_Roughness.png'),('hair','Hair_Roughness.png')]:
    m=materials[key];im=bpy.data.images.load(C.OUT+'/Character_Textures/'+file,check_existing=True);im.colorspace_settings.name='Non-Color';im.pack()
    n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=im;m.node_tree.links.new(n.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'])

source=bpy.data.collections['FIELD GUY | Editable Character']
names={'FG | Field jacket':'jacket','FG | Shearling collar':'collar','FG | Shearling cuff L':'cuff_L','FG | Shearling cuff R':'cuff_R','FG | Taupe trousers':'trousers','FG | Work boot L':'boot_L','FG | Work boot R':'boot_R','FG | Charcoal shirt':'shirt','FG | Neck':'neck'}
body={}
for old in source.objects:
    if old.name not in names:continue
    key=names[old.name];ob=old.copy();ob.data=old.data.copy();ob.parent=None;ob.name='CM | '+key;collection.objects.link(ob)
    for i,mat in enumerate(ob.data.materials):
        n=mat.name.lower()
        target='jacket'
        if any(s in n for s in ['shearling','fleece']):target='fleece'
        elif any(s in n for s in ['skin','warmth']):target='skin'
        elif 'taupe' in n or 'crease' in n or 'trouser' in n:target='trousers'
        elif any(s in n for s in ['leather','scuff','boot']):target='boots'
        elif any(s in n for s in ['zipper','eyelet','hardware']):target='metal'
        elif any(s in n for s in ['lace','sole','pupil']):target='dark'
        elif 'charcoal' in n:target='shirt'
        ob.data.materials[i]=materials[target]
    if key in ['collar','cuff_L','cuff_R']:
        # Retain fabric backing; remove isolated popcorn-shaped prototype fleece blobs.
        bm=bmesh.new();bm.from_mesh(ob.data);remain=set(bm.verts);remove=[]
        while remain:
            comp=[];stack=[remain.pop()]
            while stack:
                v=stack.pop();comp.append(v)
                for e in v.link_edges:
                    q=e.other_vert(v)
                    if q in remain:remain.remove(q);stack.append(q)
            bounds=[max(v.co[i] for v in comp)-min(v.co[i] for v in comp) for i in range(3)]
            if max(bounds)<.032:remove.extend(comp)
        bmesh.ops.delete(bm,geom=remove,context='VERTS');bm.to_mesh(ob.data);bm.free()
        bevel=ob.modifiers.new('Soft fabric backing edges','BEVEL');bevel.width=.002;bevel.segments=2;bevel.limit_method='ANGLE'
        bevel.angle_limit=.65
    if key=='neck':
        for v in ob.data.vertices:v.co.z=1.49+(v.co.z-1.49)*1.06
    for p in ob.data.polygons:p.use_smooth=key not in ['jacket','trousers']
    body[key]=ob
ctx={'scene':scene,'collection':collection,'studio':studio,'materials':materials,'body_objects':body}
result={'scene':scene.name,'retained_body_parts':list(body),'materials':len(materials)}
