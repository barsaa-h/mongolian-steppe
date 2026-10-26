"""Build one episode actor from the shared editable master, then add cast-specific art."""
import argparse
import json
import math
import random
import sys
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
REPO = ROOT.parents[1]
sys.path.insert(0, str(REPO / 'artifacts/character-master/scripts'))
import build_character as master
from dna import compile_dna, validate_dna
from appearance import apply_appearance, grey_color, rgb as color
from facial import add_expressions


def world_surface(obj):
    bpy.context.view_layer.update()
    evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh=evaluated.to_mesh()
    vertices=[evaluated.matrix_world@v.co for v in mesh.vertices]
    faces=[list(p.vertices) for p in mesh.polygons]
    evaluated.to_mesh_clear()
    return vertices,faces


def material(name, hexcode, roughness=.9):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color(hexcode),1)
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = mat.diffuse_color
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Specular IOR Level'].default_value = .15
    return mat


def recolor(obj, hexcode, *, plain=False):
    for index, original in enumerate(obj.data.materials):
        mat = original.copy()
        obj.data.materials[index] = mat
        shader = mat.node_tree.nodes.get('Principled BSDF')
        texture = next((n for n in mat.node_tree.nodes if n.type=='TEX_IMAGE'),None)
        for link in list(shader.inputs['Base Color'].links): mat.node_tree.links.remove(link)
        if texture and plain:
            ao = Path(bpy.path.abspath(texture.image.filepath)).with_name(Path(texture.image.filepath).name.replace('_diffuse','_ao'))
            if ao.is_file():
                texture.image=bpy.data.images.load(str(ao),check_existing=True)
                texture.image.pack()
        if texture:
            grey = mat.node_tree.nodes.new('ShaderNodeRGBToBW')
            multiply = mat.node_tree.nodes.new('ShaderNodeMixRGB')
            multiply.blend_type = 'MULTIPLY'
            multiply.inputs[0].default_value = 1
            multiply.inputs[2].default_value = (*color(hexcode),1)
            mat.node_tree.links.new(texture.outputs['Color'],grey.inputs[0])
            normalize = mat.node_tree.nodes.new('ShaderNodeMapRange')
            normalize.inputs['From Min'].default_value = 0
            normalize.inputs['From Max'].default_value = .35
            normalize.inputs['To Min'].default_value = .4
            normalize.inputs['To Max'].default_value = 1.15
            mat.node_tree.links.new(grey.outputs[0],normalize.inputs[0])
            mat.node_tree.links.new(normalize.outputs[0],multiply.inputs[1])
            mat.node_tree.links.new(multiply.outputs[0],shader.inputs['Base Color'])
        else:
            shader.inputs['Base Color'].default_value = (*color(hexcode),1)
        mat.name = obj.name+' | Cast fabric'


class Parts:
    def __init__(self, rig, collection):
        self.rig,self.collection = rig,collection
        self.inverse = rig.matrix_world.inverted()
    def mesh(self,name,vertices,faces,mat,bone='head'):
        data = bpy.data.meshes.new(name)
        data.from_pydata([self.inverse@Vector(v) for v in vertices],[],faces)
        data.update()
        obj=bpy.data.objects.new(name,data)
        self.collection.objects.link(obj)
        obj.parent=self.rig
        obj.data.materials.append(mat)
        obj['role']=name
        group=obj.vertex_groups.new(name=bone)
        group.add(list(range(len(vertices))),1,'REPLACE')
        modifier=obj.modifiers.new('Character skin','ARMATURE');modifier.object=self.rig
        for p in data.polygons:p.use_smooth=True
        return obj
    def sphere(self,name,center,scale,mat,bone='head'):
        vertices,faces=[],[]
        for j in range(13):
            latitude=math.pi*j/12
            for i in range(24):
                angle=2*math.pi*i/24
                vertices.append(tuple(center[k]+scale[k]*v for k,v in enumerate((math.sin(latitude)*math.cos(angle),math.sin(latitude)*math.sin(angle),math.cos(latitude)))))
        for j in range(12):
            for i in range(24):
                a=j*24+i;b=j*24+(i+1)%24;faces.append((a,a+24,b+24,b))
        return self.mesh(name,vertices,faces,mat,bone)
    def ribbon(self,name,points,width,mat,bone='spine04'):
        vertices=[]
        for point in points:
            vertices.extend([(point[0]-width/2,point[1],point[2]),(point[0]+width/2,point[1],point[2])])
        return self.mesh(name,vertices,[(i,i+1,i+3,i+2) for i in range(0,len(vertices)-2,2)],mat,bone)


def add_skin_details(profile,parts,height):
    skin=bpy.data.objects['Body.Skin']
    world,faces=world_surface(skin)
    tree=BVHTree.FromPolygons(world,faces)
    eye=parts.rig.matrix_world@parts.rig.data.bones['eye.L'].head_local
    eye_r=parts.rig.matrix_world@parts.rig.data.bones['eye.R'].head_local
    mid=(eye+eye_r)*.5
    spots=profile['pimples']
    rng=random.Random(profile['id'])
    red=material('Skin detail | restrained redness','#a66159')
    mark=material('Skin detail | healed pigmentation','#9c7563')
    count=0
    for i in range(spots):
        x=rng.choice([-1,1])*rng.uniform(.012,.029)*height
        z=mid.z+rng.uniform(-.035,.040)*height
        location,normal,_,_=tree.ray_cast(Vector((x,-height,z)),Vector((0,1,0)),height*2)
        if location is None:continue
        radius=rng.uniform(.0006,.00115)*height
        tangent=normal.cross(Vector((0,0,1))).normalized()
        bitangent=normal.cross(tangent).normalized()
        vertices=[location+normal*radius*.20]
        for j in range(12):
            a=j*math.tau/12
            vertices.append(location+normal*.00012*height+radius*(math.cos(a)*tangent+math.sin(a)*bitangent))
        obj=parts.mesh(f'Details.Blemish.{i+1:02}',vertices,[(0,1+j,1+(j+1)%12) for j in range(12)],red if i%3 else mark)
        obj['detail_type']='small pimple' if i%3 else 'healed blemish'
        count+=1
    return count


def add_age_wrinkles(dna,parts,height):
    """Thin skin-hugging age creases, recovered from the reviewed ganaa (7) and dulmaa (8) builds."""
    features=dna['age']['features'];years=dna['age']['years']
    if features['head_age']<.38:return 0
    skin=bpy.data.objects['Body.Skin']
    world,faces=world_surface(skin)
    tree=BVHTree.FromPolygons(world,faces)
    creases=material('Skin | soft age creases','#a08267',roughness=.95)
    creases.surface_render_method='DITHERED'
    creases.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value=.12
    rig=parts.rig
    eye_l=rig.matrix_world@rig.data.bones['eye.L'].head_local
    eye_r=rig.matrix_world@rig.data.bones['eye.R'].head_local
    span=(eye_l-eye_r).length
    count=0
    def ribbon(name,points):
        nonlocal count
        if len(points)<4:return
        rows=[points,[point+Vector((0,-.0002,.0004)) for point in points]]
        vertices=[vertex for row in rows for vertex in row]
        quad_faces=[(index,index+1,index+len(points)+1,index+len(points)) for index in range(len(points)-1)]
        parts.mesh(name,vertices,quad_faces,creases)
        count+=1
    per_side=2+(1 if features['head_age']>=.45 else 0)
    for eye in [eye_l,eye_r]:
        outward=1 if eye.x>=0 else -1
        for index in range(per_side):
            points=[]
            for column in range(12):
                t=column/11
                x=eye.x+outward*span*(.4+.55*t)
                z=eye.z-span*(.15+.3*index+.25*t)
                hit,normal,_,_=tree.ray_cast(Vector((x,-height,z)),Vector((0,1,0)),height*2)
                if hit is None:continue
                points.append(hit+normal*.0002)
            ribbon(f'Details.Wrinkle.Eye.{outward}.{index}',points)
    forehead=3-(1 if years>=60 else 0)
    mid=(eye_l+eye_r)*.5
    for index in range(forehead):
        points=[]
        for column in range(25):
            t=column/24
            x=(t-.5)*span*1.8
            z=mid.z+span*(.6+.24*index)
            hit,normal,_,_=tree.ray_cast(Vector((x,-height,z)),Vector((0,1,0)),height*2)
            if hit is None:continue
            points.append(hit+normal*.0004)
        ribbon(f'Details.Wrinkle.Forehead.{index+1}',points)
    return count

def skirt(parts,height,mat,*,deel=False):
    n=48; vertices=[];faces=[]
    waist=height*.53
    top=bpy.data.objects['Clothes.Top']
    fitted,_=world_surface(top)
    band=[v for v in fitted if height*.47<v.z<height*.55 and abs(v.x)<height*.25]
    waist_radius=max(abs(v.x) for v in band)+height*.003
    front,back=min(v.y for v in band)-height*.003,max(v.y for v in band)+height*.003
    center_y=(front+back)*.5;depth=(back-front)*.5
    for j in range(13):
        t=j/12;z=waist-height*(.38 if deel else .23)*t
        radius=waist_radius+height*((.012*math.sin(math.pi*t)+.025*t) if deel else .065*t)
        for i in range(n):
            angle=i*math.tau/n
            fold=height*.0018*math.sin(angle*12)*(t**.5)
            vertices.append(((radius+fold)*math.cos(angle),center_y+(depth+height*.025*t+fold)*math.sin(angle),z))
    for j in range(12):
        for i in range(n):
            a=j*n+i;b=j*n+(i+1)%n;faces.append((a,a+n,b+n,b))
    obj=parts.mesh('Clothes.DeelSkirt' if deel else 'Clothes.BirthdaySkirt',vertices,faces,mat,'root')
    solid=obj.modifiers.new('Cloth thickness','SOLIDIFY');solid.thickness=.0012
    return obj


def dress_details(profile,parts,height):
    accent=material('Aged warm trim',profile['accentColor'])
    if profile['wardrobe'] in ['deel','toddler-dress']:
        mat=material('Everyday cloth',profile['topColor'])
        skirt(parts,height,mat,deel=profile['wardrobe']=='deel')
        if profile['wardrobe']=='deel':
            top=bpy.data.objects['Clothes.Top']
            points,top_faces=world_surface(top)
            tree=BVHTree.FromPolygons(points,top_faces)
            line=[(.025,.79),(.12,.735),(.125,.57)]
            vertices=[]
            for segment in range(2):
                for i in range(15):
                    t=i/14;x=height*(line[segment][0]*(1-t)+line[segment+1][0]*t);z=height*(line[segment][1]*(1-t)+line[segment+1][1]*t)
                    for dx in [-height*.0025,height*.0025]:
                        hit,normal,_,_=tree.ray_cast(Vector((x+dx,-height,z)),Vector((0,1,0)),height*2)
                        if hit is not None:vertices.append(hit+Vector((0,-height*.004,0)))
            if len(vertices)>=8:parts.mesh('Clothes.DeelOverlap',vertices,[(i,i+1,i+3,i+2) for i in range(0,len(vertices)-2,2)],accent,'spine04')
            skirt_points,skirt_faces=world_surface(bpy.data.objects['Clothes.DeelSkirt'])
            waist_tree=BVHTree.FromPolygons(points+skirt_points,top_faces+[[i+len(points) for i in f] for f in skirt_faces])
            points += skirt_points
            band=[v for v in points if height*.48<v.z<height*.54 and abs(v.x)<height*.3]
            rx=max(abs(v.x) for v in band)+height*.008
            front,back=min(v.y for v in band)-height*.007,max(v.y for v in band)+height*.007
            vertices=[];faces=[]
            for j in range(2):
                for i in range(48):
                    angle=i*math.tau/48
                    direction=Vector((math.cos(angle),math.sin(angle),0))
                    center=Vector((0,(front+back)*.5,height*(.505+(j*2-1)*.019)))
                    hit,_,_,_=waist_tree.ray_cast(center+direction*height,-direction,height*2)
                    assert hit is not None,'Missing fitted sash surface'
                    vertices.append(hit+direction*height*.006)
            for i in range(48):faces.append((i,(i+1)%48,(i+1)%48+48,i+48))
            parts.mesh('Clothes.Sash',vertices,faces,accent,'root')
            neck=parts.rig.matrix_world@parts.rig.data.bones['neck01'].head_local
            vertices=[];faces=[]
            for j in range(2):
                for i in range(32):
                    angle=i*math.tau/32
                    vertices.append((neck.x+height*(.07 if j==0 else .045)*math.cos(angle),neck.y+height*(.064 if j==0 else .047)*math.sin(angle),neck.z+height*(-.025 if j==0 else .022)))
            for i in range(32):faces.append((i,(i+1)%32,(i+1)%32+32,i+32))
            collar=parts.mesh('Clothes.DeelCollar',vertices,faces,mat,'neck01')
            solid=collar.modifiers.new('Collar thickness','SOLIDIFY');solid.thickness=.002
    if profile['wardrobe']=='apron':
        cloth=material('Hurel | worn apron','#aaa08b')
        vertices=[]
        for j in range(10):
            t=j/9;z=height*(.78-.44*t);half=height*(.065+.075*t)
            for i in range(9):
                s=i/8;vertices.append(((s*2-1)*half,-height*(.122+.008*math.sin(s*math.pi))+.003*math.sin(j*2+i),z))
        faces=[]
        for j in range(9):
            for i in range(8):a=j*9+i;faces.append((a,a+1,a+10,a+9))
        parts.mesh('Clothes.Apron',vertices,faces,cloth,'spine05')
        for side in [-1,1]:parts.ribbon('Clothes.ApronStrap'+str(side),[(side*.055*height,-.09*height,.86*height),(side*.05*height,-.13*height,.75*height)],.014*height,cloth)
    if profile['id']=='altan':
        head=parts.rig.matrix_world@parts.rig.data.bones['head'].head_local
        center=(0,head.y,height*.984)
        vertices=[];faces=[];n=24
        for j in range(2):
            for i in range(n):
                a=math.tau*i/n;r=height*.071
                vertices.append((r*math.cos(a),center[1]+r*.84*math.sin(a),center[2]+j*height*(.025 if i%2==0 else .065)))
        for i in range(n):faces.append((i,(i+1)%n,(i+1)%n+n,i+n))
        parts.mesh('Props.PaperCrown',vertices,faces,material('Paper crown | ochre','#cba554'))
    if profile['hairstyle']=='cap':
        head=parts.rig.matrix_world@parts.rig.data.bones['head'].head_local
        parts.sphere('Clothes.GuardCap',(0,head.y,height*.978),(.063*height,.073*height,.025*height),material('Guard | wool cap','#333e46'))
    if profile['hairstyle']=='bun':
        head=parts.rig.matrix_world@parts.rig.data.bones['head'].head_local
        parts.sphere('Hair.Bun',(0,head.y+.065*height,head.z+.058*height),(.034*height,.026*height,.034*height),material('Dulmaa | grey bun',profile['hairColor']))
    if profile['id'] in ['ganaa','dasha']:
        side='R' if profile['id']=='ganaa' else 'L'
        bone=parts.rig.data.bones['lowerarm01.'+side]
        start,end=[parts.rig.matrix_world@v for v in (bone.head_local,bone.tail_local)]
        center=start.lerp(end,.76)
        cloth=material('Forearm scarf | worn linen','#82756a')
        axis=(end-start).normalized();u=axis.cross(Vector((0,1,0))).normalized();v=axis.cross(u).normalized()
        vertices=[];faces=[]
        for j in range(6):
            for i in range(24):
                angle=i*math.tau/24
                vertices.append(center+axis*height*.012*(j-2.5)+height*(.031 if profile['id']=='dasha' else .027)*(math.cos(angle)*u+math.sin(angle)*v))
        for j in range(5):
            for i in range(24):a=j*24+i;b=j*24+(i+1)%24;faces.append((a,b,b+24,a+24))
        obj=parts.mesh('Story.ForearmBandage',vertices,faces,cloth,bone.name)
        obj['states']='hour-five,turning' if profile['id']=='ganaa' else 'unwell,fed-runner'


def build(id,dna_path=None,destination=None):
    dna=validate_dna(json.loads(Path(dna_path or ROOT/'dna'/f'{id}.json').read_text()))
    if dna['id']!=id:raise ValueError('DNA id and requested id differ')
    profile=compile_dna(dna)
    output=Path(destination or ROOT/id).resolve()
    if dna_path is None:(ROOT/'recipes'/f'{id}.json').write_text(json.dumps(profile,ensure_ascii=False,indent=2)+'\n')
    report=master.build(profile['base'],output,render=False,eye_asset='high-poly',appearance=False)
    rig=bpy.data.objects['Character.Rig'];collection=next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
    bpy.context.view_layer.update()
    parts=Parts(rig,collection);height=profile['base']['height_m']
    recolor(bpy.data.objects['Clothes.Top'],profile['topColor'],plain=id in ['dulmaa','altan'])
    recolor(bpy.data.objects['Clothes.Bottom'],profile['bottomColor'])
    recolor(bpy.data.objects['Hair'],grey_color(profile['hairColor'],dna['hair']['greying']))
    if profile['wardrobe'] in ['dress','toddler-dress']:
        recolor(bpy.data.objects['Clothes.Bottom'],profile['topColor'])
    if profile['hairstyle'] in ['bun','bob']:
        hair=bpy.data.objects['Hair']
        import bmesh
        bm=bmesh.new();bm.from_mesh(hair.data)
        z=rig.data.bones['head'].head_local.z - (height/rig.scale.x*.04 if profile['hairstyle']=='bob' else 0)
        bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.z<z],context='VERTS');bm.to_mesh(hair.data);bm.free()
    detail_count=add_skin_details(profile,parts,height)
    dress_details(profile,parts,height)
    wrinkle_count=add_age_wrinkles(dna,parts,height)
    if profile['wardrobe'] in ['deel','toddler-dress']:
        bpy.data.objects.remove(bpy.data.objects['Clothes.Bottom'],do_unlink=True)
    if profile['wardrobe']=='deel':
        leather=material('Dulmaa | worn boots','#302b26')
        for side in ['L','R']:
            bone=rig.data.bones['lowerleg01.'+side]
            ankle=rig.matrix_world@bone.tail_local
            vertices=[];faces=[]
            for j in range(7):
                for i in range(24):
                    angle=i*math.tau/24
                    radius=height*(.044+.002*math.sin(j*2))
                    vertices.append((ankle.x+radius*math.cos(angle),ankle.y+radius*math.sin(angle),height*(.065+j*.021)))
            for j in range(6):
                for i in range(24):a=j*24+i;b=j*24+(i+1)%24;faces.append((a,b,b+24,a+24))
            parts.mesh('Clothes.BootShaft.'+side,vertices,faces,leather,bone.name)
    if profile['wardrobe']=='deel': assert bpy.data.objects.get('Clothes.DeelOverlap') is not None
    scene=bpy.context.scene;scene.name=profile['name']+' | Episode 1'
    rig['cast_id']=id;rig['script_age']=str(profile['scriptAge']);rig['casting']=profile['casting']
    rig['story_states']=json.dumps(profile['states']);rig['canonical_source']=profile['ageNote']
    bpy.data.texts.new('episode-recipe.json').write(json.dumps(profile,ensure_ascii=False,indent=2))
    guide=ROOT/'README.md'
    if guide.exists():bpy.data.texts.new('EPISODE_AGENT_GUIDE').write(guide.read_text())
    apply_appearance(dna,rig,collection,bake_material)
    # Bake native fabric nodes so the GLB uses the same portable diffuse appearance.
    meshes=[o for o in collection.objects if o.type=='MESH']
    for obj in meshes:
        if obj.name in {'Clothes.Top','Clothes.Bottom','Hair'}:
            bake_material(obj)
    expressions=add_expressions(dna,collection,rig)
    bpy.data.texts.new('DNA.json').write(json.dumps(dna,ensure_ascii=False,indent=2))
    rig['dna_hash']=profile['dnaHash'];rig['base_stage']=dna['base']
    bpy.context.view_layer.update()
    for obj in meshes:
        if obj.get('states'): obj.hide_render = profile['states'][0] not in obj['states'].split(',')
    master.stage(scene,output,height,rig)
    if id=='altan':
        scene.camera.data.ortho_scale=height*.44
        scene.render.filepath=str(output/'face.png')
        bpy.ops.render.render(write_still=True)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in [rig,*meshes]:obj.select_set(True)
    bpy.context.view_layer.objects.active=rig
    bpy.ops.export_scene.gltf(filepath=str(output/'character.glb'),use_selection=True,export_format='GLB',export_animations=True,export_animation_mode='ACTIONS',export_force_sampling=True,export_frame_range=False,export_extras=True,export_apply=True,export_morph=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output/'Character-Master.blend'))
    report.update(name=profile['name'],id=id,episode=1,scriptAge=profile['scriptAge'],skinSource=profile['base']['skin'],skinDetailCount=detail_count,wrinkleParts=wrinkle_count,storyStates=profile['states'],wardrobe=profile['wardrobe'],casting=profile['casting'])
    report['meshes']=[{'name':o.name,'role':o.get('role'),'vertices':len(o.data.vertices),'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in meshes]
    report['packedTextures']=[{'name':i.name,'size':list(i.size)} for i in bpy.data.images if i.packed_file and i.users]
    report.update(dnaHash=profile['dnaHash'],baseStage=dna['base'],expressions=expressions,sourceIndexMap=True)
    (output/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    (output/'episode-recipe.json').write_text(json.dumps(profile,ensure_ascii=False,indent=2)+'\n')
    (output/'dna.json').write_text(json.dumps(dna,ensure_ascii=False,indent=2)+'\n')
    assert detail_count==profile['pimples']
    assert report['fullBodyRetained'] and report['fingerBones']==30
    print('EPISODE_ACTOR_OK',id,detail_count,flush=True)


def bake_material(obj,size=1024):
    """Bake only fabric recoloring into a fresh atlas; preserve source UVs and skin maps."""
    bpy.context.scene.render.engine='CYCLES'
    bpy.context.scene.cycles.samples=1
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
    for mat in obj.data.materials:
        shader=mat.node_tree.nodes.get('Principled BSDF')
        image=bpy.data.images.new(obj.name+' | Cast albedo',size,size,alpha=True)
        node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;mat.node_tree.nodes.active=node
        bpy.ops.object.bake(type='DIFFUSE',pass_filter={'COLOR'},margin=8,use_clear=True)
        image.pack()
        for link in list(shader.inputs['Base Color'].links):mat.node_tree.links.remove(link)
        mat.node_tree.links.new(node.outputs['Color'],shader.inputs['Base Color'])


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('id');parser.add_argument('--dna',type=Path);parser.add_argument('--output',type=Path);args=parser.parse_args(sys.argv[sys.argv.index('--')+1:]);build(args.id,args.dna,args.output)
