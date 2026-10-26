"""Rebuild editable Vinrax-derived cast sources and embedded GLBs with Blender.

Run: blender --background --factory-startup --python scripts/build-cast.py -- ganaa
Omit IDs to rebuild every visible roster entry. Original downloaded sources stay intact.
"""
import bpy
import bmesh
import math
import json
import sys
import hashlib
from pathlib import Path
from mathutils import Vector, Matrix, Quaternion
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/cast'
FPS = 24
REPORT = []
CAB = json.loads((OUT / "cab.json").read_text())


def rgb(value):
    return tuple(int(value[i:i+2], 16) / 255 for i in (1, 3, 5))


def material(name, color, roughness=.92):
    m = bpy.data.materials.new(name)
    linear=tuple(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in rgb(color))
    m.diffuse_color = (*linear, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = m.diffuse_color
    p.inputs['Roughness'].default_value = roughness
    return m


def reset():
    bpy.context.preferences.filepaths.save_version=0
    bpy.ops.object.mode_set(mode='OBJECT') if bpy.context.object and bpy.context.object.mode != 'OBJECT' else None
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for collection in [bpy.data.actions, bpy.data.materials, bpy.data.meshes, bpy.data.armatures, bpy.data.images]:
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)
    bpy.context.scene.render.fps = FPS


def skin_object(obj, bone='head'):
    obj.vertex_groups.new(name=bone).add(list(range(len(obj.data.vertices))), 1, 'REPLACE')
    mod = obj.modifiers.new('Editable armature deformation', 'ARMATURE')
    mod.object = RIG
    obj.parent = RIG
    return obj


def mesh(name, verts, faces, mat, bone='head'):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    skin_object(obj, bone)
    return obj


def ellipsoid(name, center, scale, mat, bone='head', segments=12, rings=6):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.data.materials.append(mat)
    skin_object(obj, bone)
    return obj


def strip(name, points, radius, mat, bone='head'):
    verts, faces = [], []
    for point in points:
        for j in range(6):
            angle = j * math.tau / 6
            verts.append(tuple(Vector(point) + Vector((math.cos(angle)*radius, math.sin(angle)*radius, 0))))
    for i in range(len(points)-1):
        for j in range(6):
            a=i*6+j; b=i*6+(j+1)%6
            faces.append((a,b,b+6,a+6))
    return mesh(name, verts, faces, mat, bone)


def bone_aliases(female):
    aliases = {'hips':'pelvis','shoulder.L':'shoulder_left','shoulder.R':'shoulder_right',
               'upper_arm.L':'upper_arm_left','upper_arm.R':'upper_arm_right',
               'forearm.L':'forearm_left','forearm.R':'forearm_right','hand.L':'hand_left','hand.R':'hand_right',
               'thigh.L':'thigh_left','thigh.R':'thigh_right','foot.L':'foot_left','foot.R':'foot_right'}
    if female:
        for before, after in aliases.items():
            if before not in RIG.data.bones:
                continue
            RIG.data.bones[before].name = after
            if before in BODY.vertex_groups:
                BODY.vertex_groups[before].name = after


def point_shape(v, profile, old_height):
    v = Vector(v)
    t = v.z / old_height
    width, depth = profile['build']
    young = profile['kind'] == 'child'
    # A toddler's head and trunk occupy more of its height than an adult's.
    if young:
        toddler = profile['height'] < .8
        knots = [(0,0),(.48,.38 if toddler else .43),(.80,.70 if toddler else .76),(1,1)]
        for (a,b),(c,d) in zip(knots,knots[1:]):
            if t <= c:
                mapped = b+(t-a)/(c-a)*(d-b)
                break
        else:
            mapped=t
        xscale = .98 if toddler else .90
        v.x *= width*xscale*(1.26 if t>.80 else 1)
        v.y *= depth*(1.25 if t>.80 else 1)
        v.z=mapped*old_height
    else:
        body_blend = max(0, min(1, (t-.42)/.20)) * max(0,min(1,(.86-t)/.08))
        v.x *= 1+(width-1)*body_blend
        v.y *= 1+(depth-1)*body_blend
    return v * (profile['height']/old_height)


def recolor_texture(profile, female):
    source=bpy.data.images.load(str(ROOT/('assets/sources/vinrax-female/secretary_tex.png' if female else 'assets/male_casual/man_tex.png')),check_existing=True)
    image = source.copy()
    image.name = profile['id']+'-Vinrax-atlas'
    w,h=image.size
    pixels=np.array(image.pixels[:],dtype=np.float32).reshape(h,w,4)
    yy,xx=np.mgrid[0:h,0:w]; x=xx/w; y=yy/h
    r,g,b=pixels[:,:,0],pixels[:,:,1],pixels[:,:,2]
    masks={}
    if female:
        masks['hair']=(y>.66)&(r>g*.99)&(g>b*1.12)&~((x<.32)&(y<.88))
        masks['cloth']=(r>g*1.4)&(r>b*1.35)&(y<.68)
        masks['trousers']=(y<.18)&(x<.64)
        masks['skin']=((x<.30)&(y>.54)&(y<.89))|((x>.64)&(x<.77)&(y<.34)&(r>g*1.08))
    else:
        masks['hair']=(x>.55)&(y>.89)
        masks['cloth']=((x<.55)&(y>.68))|((x>.36)&(x<.68)&(y>.36)&(y<.56))
        masks['trousers']=(x<.36)&(y<.68)
        masks['skin']=((x>.56)&(y>.49)&(y<.89))|((x>.34)&(x<.70)&(y<.36))
    colors={'hair':profile['hair'],'cloth':profile['colors']['cloth'],'trousers':profile['colors']['trousers'],'skin':profile['skin']}
    for name,mask in masks.items():
        lum=pixels[:,:,:3].mean(axis=2)
        reference=.55 if name=='skin' else .30
        shading=np.clip(lum/reference,.35,1.65)
        pixels[:,:,:3][mask]=(np.array(rgb(colors[name]))[None,:]*shading[mask,None]).clip(0,1)
    if not female and profile['hairStyle'] in ['receding','bald']:
        forehead=(x>.55)&(x<.80)&(y>.875)
        pixels[:,:,:3][forehead]=np.array(rgb(profile['skin']))[None,:]*.92
    if not female and (profile['kind'] in ['teenMale','child'] or (profile['age'] is not None and profile['age']<=23)):
        # The adult source atlas has a goatee; young cast members use a clean chin and authored lips.
        chin=(x>.595)&(x<.775)&(y>.665)&(y<.762)
        light=np.clip(pixels[:,:,:3].mean(axis=2),0,1)
        pixels[:,:,:3][chin]=np.array(rgb(profile['skin']))[None,:]*(.83+.20*light[chin,None])
    image.pixels[:]=pixels.ravel()
    image.pack()
    for mat in BODY.data.materials:
        mat.name=profile['id']+'-original-atlas-material'
        if mat.use_nodes:
            for node in mat.node_tree.nodes:
                if node.type=='TEX_IMAGE':
                    node.image=image
                    node.interpolation='Closest'
            p=mat.node_tree.nodes.get('Principled BSDF')
            if p:
                p.inputs['Roughness'].default_value=.92
                for link in list(p.inputs['Alpha'].links):mat.node_tree.links.remove(link)
                p.inputs['Alpha'].default_value=1
    return image


def uv_position(uv):
    layer=BODY.data.uv_layers.active.data
    BODY.data.calc_loop_triangles()
    target=Vector(uv)
    closest=None
    for triangle in BODY.data.loop_triangles:
        coords=[Vector(layer[i].uv) for i in triangle.loops]
        a,b,c=coords; d=(b-a).cross(c-a)
        if abs(d)<1e-9: continue
        u=(target-a).cross(c-a)/d; v=(b-a).cross(target-a)/d
        if u>=-.001 and v>=-.001 and u+v<=1.001:
            return BODY.data.vertices[triangle.vertices[0]].co*(1-u-v)+BODY.data.vertices[triangle.vertices[1]].co*u+BODY.data.vertices[triangle.vertices[2]].co*v
        for coord,vertex in zip(coords,triangle.vertices):
            distance=(coord-target).length
            if closest is None or distance<closest[0]: closest=(distance,BODY.data.vertices[vertex].co.copy())
    return closest[1]


def reshape_face(profile, female):
    face=profile['face']; head_z=RIG.data.bones['head'].head_local.z
    top=max(v.co.z for v in BODY.data.vertices)
    head_h=top-head_z
    for vertex in BODY.data.vertices:
        v=vertex.co
        if v.z<head_z-.045*S: continue
        q=(v.z-head_z)/max(head_h,.01)
        jaw=math.exp(-((q-.03)/.29)**2)
        cheek=math.exp(-((q-.40)/.20)**2)
        v.x*=face['width']*(1+(face['jaw']-1)*jaw+(face['cheekbone']-1)*cheek)
        if v.y<-.02*S:
            central=math.exp(-(v.x/(.035*S))**2)
            nose=math.exp(-((q-.40)/.22)**2)
            v.y-=central*nose*(face['nose']-1)*.10*S
            if .43<q<.73:
                v.x*=1+(face['eyeSpacing']-1)*.55
                v.z+=(face['brow']-1)*.025*S
        if (profile['age'] or 35)>43:
            v.y+=jaw*.006*S
            v.z-=jaw*.006*S
    # Source UV anchors put the opening on the actual textured lips rather than an estimated head box.
    mouth=uv_position((.165,.742) if female else (.69,.715))
    eyes=[uv_position(uv) for uv in ([(.075,.856),(.20,.856)] if female else [(.639,.825),(.718,.825)])]
    return mouth,eyes,top


def face_details(profile, female, mouth, eyes, top):
    flesh=material('skin '+profile['id'],profile['skin'])
    lips=material('lips '+profile['id'],'#714841')
    dark=material('mouth interior '+profile['id'],'#251d1b')
    whites=material('eye wetness '+profile['id'],'#c9b8a2',.35)
    iris=material('dark irises '+profile['id'],'#201b18',.3)
    mouth.y-=.004*S
    m=ellipsoid('mouth-opening',mouth,(.029*S,.005*S,.0015*S),dark)
    m.shape_key_add(name='Basis');key=m.shape_key_add(name='speak')
    for vertex in key.data:
        vertex.co.z=mouth.z+(vertex.co.z-mouth.z)*8
        vertex.co.y-=.003*S
    for name in ['blink','fear','hunger','resolve']:
        key=m.shape_key_add(name=name)
        if name=='hunger':
            for vertex in key.data: vertex.co.z=mouth.z+(vertex.co.z-mouth.z)*3
    # Lips contain volume, with the lower lip following jaw opening.
    for side in [-1,1]:
        lip=ellipsoid('upper-lip' if side>0 else 'lower-lip',mouth+Vector((0,-.002*S,side*.0025*S)),(.029*S,.005*S,.002*S),lips)
        lip.shape_key_add(name='Basis');key=lip.shape_key_add(name='speak')
        for vertex in key.data: vertex.co.z+=side*.010*S
    for i,eye in enumerate(eyes):
        eye.y-=.003*S
        ellipsoid('eye-white-'+str(i),eye+Vector((0,-.003*S,0)),(.015*S,.004*S,.006*S),whites)
        pupil=ellipsoid('iris-'+str(i),eye+Vector((0,-.0075*S,0)),(.006*S,.002*S,.0054*S),iris)
        pupil.shape_key_add(name='Basis');gaze=pupil.shape_key_add(name='gaze')
        for vertex in gaze.data:vertex.co.x+=.006*S
        lid=ellipsoid('eyelid-'+str(i),eye+Vector((0,.020*S,0)),(.020*S,.0038*S,.001*S),flesh)
        lid.shape_key_add(name='Basis');key=lid.shape_key_add(name='blink')
        for vertex in key.data:
            vertex.co.z=eye.z+(vertex.co.z-eye.z)*8
            vertex.co.y-=.038*S
        brow=eye+Vector((0,-.001*S,.015*S))
        eyebrow=strip('brow-'+str(i),[brow+Vector((-.018*S,0,0)),brow+Vector((0,-.002*S,.003*S)),brow+Vector((.018*S,0,-.001*S))],.002*S,material('brow '+str(i),profile['hair']))
        eyebrow.shape_key_add(name='Basis')
        for expression in ['fear','hunger','resolve']:
            key=eyebrow.shape_key_add(name=expression)
            for vertex in key.data:
                inner=1-min(1,abs(vertex.co.x)/max(abs(eye.x)+.018*S,.001))
                vertex.co.z+=(.010 if expression=='fear' else -.006 if expression=='hunger' else -.003)*S*inner

    BODY.shape_key_add(name='Basis')
    for name in ['speak','blink','fear','hunger','resolve']:
        key=BODY.shape_key_add(name=name)
        for vertex in key.data:
            v=vertex.co; dist=((v.x-mouth.x)/(.065*S))**2+((v.z-mouth.z)/(.05*S))**2
            front=max(0,min(1,(-v.y)/(S*.05)))
            if name=='speak' and v.z<mouth.z+.004*S:
                v.z-=math.exp(-dist)*.014*S*front
                v.y+=math.exp(-dist)*.003*S*front
            if name=='hunger' and dist<4: v.y-=math.exp(-dist)*.004*S*front
            if name=='fear' and v.z>mouth.z+.025*S: v.z+=.004*S*front
            if name=='resolve' and dist<3: v.x*=1.018
            if name=='blink':
                for eye in eyes:
                    d=((v.x-eye.x)/(.03*S))**2+((v.z-eye.z)/(.018*S))**2
                    v.z+=(eye.z-v.z)*math.exp(-d)*front*.75
    if profile['id']=='ganaa' or (profile['age'] or 0)>=45:
        wrinkle=material('aged face crease '+profile['id'],'#725c4d')
        middle=(eyes[0]+eyes[1])/2
        for j in range(2):
            z=middle.z+(.035+j*.012)*S
            strip('forehead-crease-'+str(j),[(middle.x-.041*S,middle.y+.006*S,z),(middle.x,middle.y-.001*S,z+.002*S),(middle.x+.041*S,middle.y+.006*S,z)],.0008*S,wrinkle)
        for eye in eyes:
            outward=1 if eye.x>0 else -1
            for j in [-1,1]:
                strip('eye-corner-crease',[(eye.x+outward*.016*S,eye.y+.002*S,eye.z),(eye.x+outward*.028*S,eye.y+.006*S,eye.z+j*.008*S)],.0008*S,wrinkle)
    return flesh


def hairstyle(profile, top):
    style=profile['hairStyle']; mat=material('hair '+profile['id'],profile['hair'])
    head=RIG.data.bones['head'].head_local
    cy=head.y+.008*S; rx=.100*S*profile['face']['width']; ry=.090*S
    cz=top-.115*S
    if style=='bald': return
    verts=[]; faces=[]; segments=16; rings=5
    for i in range(rings):
        phi=.12+(i/(rings-1))*1.35
        for j in range(segments):
            theta=j*math.tau/segments
            # Front is -Y. Receding hair removes the central crown/forehead arc.
            verts.append((math.sin(phi)*math.cos(theta)*rx,cy+math.sin(phi)*math.sin(theta)*ry,cz+math.cos(phi)*.12*S))
    for i in range(rings-1):
        for j in range(segments):
            theta=(j+.5)*math.tau/segments
            if style=='receding' and math.sin(theta)<.25 and i<3: continue
            a=i*segments+j;b=i*segments+(j+1)%segments
            faces.append((a,b,b+segments,a+segments))
    mesh(style+'-scalp',verts,faces,mat)
    if style=='bun':
        ellipsoid('tied-hair-bun',(0,cy+.105*S,cz+.04*S),(.055*S,.045*S,.05*S),mat)
    if style=='braid':
        for i in range(9):
            ellipsoid('braid-'+str(i),((.009 if i%2 else -.009)*S,cy+.09*S,cz-(.04+i*.025)*S),(.026*S*(1-i*.04),.023*S,.025*S),mat)
    if style in ['bob','long']:
        length=.12 if style=='bob' else .29
        for side in [-1,1]:
            ellipsoid(style+'-side-lock',(side*rx*.88,cy+.012*S,cz-length*S*.4),(.035*S,.075*S,length*S),mat)
        ellipsoid(style+'-back',(0,cy+.072*S,cz-length*S*.4),(.088*S,.032*S,length*S),mat)
    if style=='cap':
        hat=material('cap cloth',profile['colors']['cloth'])
        ellipsoid('cap-crown',(0,cy,top+.005*S),(.108*S,.095*S,.036*S),hat)
        ellipsoid('cap-brim',(0,cy-.094*S,top-.008*S),(.097*S,.075*S,.009*S),hat)


def clothes(profile):
    outfit=profile['outfit']; cloth=material('garment '+profile['id'],profile['colors']['cloth']);trim=material('trim '+profile['id'],profile['colors']['trim'])
    chest=RIG.data.bones['chest'].head_local.z; neck=RIG.data.bones['neck'].head_local.z
    pelvis=RIG.data.bones['pelvis'].head_local.z; width=.17*S*profile['build'][0]
    depth=.085*S*profile['build'][1]
    if profile['kind'] in ['adultFemale','teenFemale','child']:
        torso_groups={g.index for g in BODY.vertex_groups if g.name in ['pelvis','spine','chest']}
        torso=[v.co for v in BODY.data.vertices if pelvis-.12*S<v.co.z<chest+.05*S and sum(g.weight for g in v.groups if g.group in torso_groups)>.75]
        if torso:
            width=max(width,max(abs(v.x) for v in torso)*1.035)
            depth=max(depth,max(abs(v.y) for v in torso)*1.03)
    if outfit in ['jacket','coat','suit','uniform','medical','nurse','school','tracksuit','deel']:
        cloth_index=len(BODY.data.materials);BODY.data.materials.append(cloth)
        arm_indices={g.index for g in BODY.vertex_groups if g.name.startswith(('upper_arm','forearm'))}
        hand_indices={g.index for g in BODY.vertex_groups if g.name.startswith(('hand','thumb','f_middle'))}
        rolled=BODY.vertex_groups.get('forearm_left') if profile['id']=='ganaa' else None
        for polygon in BODY.data.polygons:
            verts=[BODY.data.vertices[i] for i in polygon.vertices]
            arm=sum(sum(g.weight for g in v.groups if g.group in arm_indices) for v in verts)/len(verts)
            hand=sum(sum(g.weight for g in v.groups if g.group in hand_indices) for v in verts)/len(verts)
            bare=sum(sum(g.weight for g in v.groups if rolled and g.group==rolled.index) for v in verts)/len(verts)
            if arm>.45 and hand<.3 and bare<.5:polygon.material_index=cloth_index
    if outfit in ['coat','deel','dress','medical','nurse','apron']:
        bottom=pelvis-(.26 if outfit in ['coat','deel','dress'] else .15)*S
        verts=[]
        for z,spread in [(bottom,1.04),(pelvis,.85),(chest,.88)]:
            for i in range(12):
                a=i*math.tau/12;verts.append((math.cos(a)*width*spread,math.sin(a)*depth*1.15,z))
        garment=mesh(outfit+'-hem',verts,[(i*12+j,i*12+(j+1)%12,(i+1)*12+(j+1)%12,(i+1)*12+j) for i in range(2) for j in range(12)],cloth,'pelvis')
        if outfit=='deel':
            strip('deel-cross-lapel',[(-width*.8,-depth,neck-.02*S),(width*.35,-depth-.012*S,chest),(width*.35,-depth-.008*S,pelvis)],.010*S,trim,'chest')
            ellipsoid('deel-sash',(0,0,pelvis+.04*S),(width*1.02,depth*1.2,.025*S),trim,'pelvis')
    if outfit in ['jacket','coat','suit','uniform','medical','nurse','school','tracksuit']:
        for side in [-1,1]:
            # Closed jacket collar, raised lapels and pocket make silhouettes distinct from a deel.
            mesh('collar-'+str(side),[(side*.025*S,-depth*.7,neck),(side*.082*S,-depth*1.1,neck-.025*S),(side*.055*S,-depth*1.25,neck-(.12 if outfit=='suit' else .07)*S)],[(0,1,2)],trim,'chest')
            if outfit in ['jacket','coat','uniform','medical']:
                z=chest-.045*S
                strip('pocket-seam-'+str(side),[(side*width*.35,-depth-.014*S,z),(side*width*.77,-depth-.010*S,z)],.0025*S,trim,'chest')
        strip('front-closure',[(0,-depth-.009*S,pelvis+.025*S),(0,-depth-.013*S,chest+.10*S)],.003*S,trim,'spine')
        if outfit in ['suit','school']:
            tie=material('tie '+profile['id'],'#352a28')
            mesh('tie',[(0,-depth-.02*S,neck-.045*S),(-.018*S,-depth-.022*S,chest+.02*S),(0,-depth-.026*S,chest-.055*S),(.018*S,-depth-.022*S,chest+.02*S)],[(0,1,2,3)],tie,'chest')
    if profile['id']=='ganaa':
        worn=material('worn jacket patches','#68675b')
        for side in ['left','right']:
            elbow=RIG.data.bones['forearm_'+side].head_local
            ellipsoid('worn-elbow-'+side,elbow+Vector((0,.025*S,0)),(.030*S,.009*S,.055*S),worn,'forearm_'+side)
        # Visible old cloth binding on the bitten wrist; infection is staged, not a body tint.
        hand=RIG.data.bones['hand_left'].head_local
        ellipsoid('wrist-bandage',hand,(.055*S,.050*S,.042*S),material('aged wrist bandage','#b5a58a'),'forearm_left')
        forearm=RIG.data.bones['forearm_left']
        infection=material('wrist red line','#8f342c')
        points=[hand.lerp(forearm.head_local,u)+Vector((0,-.051*S,0)) for u in [.08,.26,.46,.65,.85]]
        strip('advancing-red-line',points,.003*S,infection,'forearm_left')


def make_infant(profile):
    global RIG,BODY,S
    S=profile['height']/.44
    bpy.ops.object.armature_add()
    RIG=bpy.context.object;RIG.name=profile['id']+'-rig';RIG.data.bones[0].name='pelvis'
    bpy.ops.object.mode_set(mode='EDIT')
    pelvis=RIG.data.edit_bones['pelvis'];pelvis.head=(0,0,.13*S);pelvis.tail=(0,0,.27*S)
    head=RIG.data.edit_bones.new('head');head.head=(0,0,.31*S);head.tail=(0,0,.40*S);head.parent=pelvis
    bpy.ops.object.mode_set(mode='OBJECT')
    blanket=material('infant blanket',profile['colors']['cloth'])
    BODY=ellipsoid('swaddled-body',(0,.01*S,.19*S),(.09*S*profile['build'][0],.065*S,.18*S),blanket,'pelvis')
    ellipsoid('newborn-head',(0,-.006*S,.365*S),(.063*S,.058*S,.070*S),material('newborn skin',profile['skin']),'head')
    seam=material('swaddle folds',profile['colors']['trim'])
    for i in range(3):
        strip('swaddle-fold-'+str(i),[(-.065*S,-.041*S,(.17+i*.035)*S),(.063*S,-.042*S,(.20+i*.035)*S)],.003*S,seam,'pelvis')
    for side in [-1,1]:
        strip('newborn-closed-eye',[(side*.023*S-.009*S,-.060*S,.379*S),(side*.023*S+.009*S,-.061*S,.379*S)],.0015*S,material('closed eye','#4e3c33'))
    ellipsoid('newborn-mouth',(0,-.065*S,.352*S),(.009*S,.002*S,.003*S),material('newborn lips','#754b42'))


def box(name, center, size, mat, bone='chest'):
    x,y,z=center;dx,dy,dz=[n/2 for n in size]
    verts=[(x+a*dx,y+b*dy,z+c*dz) for a,b,c in [(-1,-1,-1),(-1,-1,1),(-1,1,-1),(-1,1,1),(1,-1,-1),(1,-1,1),(1,1,-1),(1,1,1)]]
    return mesh(name,verts,[(0,4,6,2),(1,3,7,5),(0,1,5,4),(2,6,7,3),(0,2,3,1),(4,5,7,6)],mat,bone)


def role_props(profile,top):
    identity=profile['id'];chest=RIG.data.bones['chest'].head_local;neck=RIG.data.bones['neck'].head_local
    dark=material('equipment '+identity,'#292d2c');metal=material('equipment metal '+identity,'#73756e')
    if identity=='anu':
        hand=RIG.data.bones['hand_right'].head_local
        p=hand+Vector((0,-.052*S,-.025*S))
        box('Hi8-camcorder',p,(.065*S,.14*S,.061*S),dark,'hand_right')
        ellipsoid('Hi8-lens',p+Vector((0,-.076*S,0)),(.022*S,.012*S,.022*S),metal,'hand_right')
        box('Hi8-viewfinder',p+Vector((.03*S,.025*S,.043*S)),(.034*S,.05*S,.02*S),dark,'hand_right')
    if identity in ['oyun','tsolmon']:
        points=[(-.045*S,-.083*S,neck.z-.015*S),(-.072*S,-.11*S,chest.z+.04*S),(0,-.12*S,chest.z-.055*S),(.072*S,-.11*S,chest.z+.04*S),(.045*S,-.083*S,neck.z-.015*S)]
        strip('stethoscope',points,.004*S,dark,'chest')
        ellipsoid('stethoscope-bell',(0,-.125*S,chest.z-.055*S),(.018*S,.005*S,.018*S),metal,'chest')
    if identity=='bolor':
        # Cap stays below the original head top so character scale remains stable.
        box('night-nurse-cap',(0,.015*S,top-.018*S),(.16*S,.095*S,.035*S),material('nurse cap','#d4d1bb'),'head')
    if identity=='narantuya':
        hand=RIG.data.bones['hand_left'].head_local
        points=[hand+Vector((.055*S+math.sin(i/12*math.pi)*.09*S,-.025*S,(i/12-.5)*.62*S)) for i in range(13)]
        bow=material('wooden bow','#69533b');strip('archers-bow',points,.008*S,bow,'hand_left')
        strip('bow-string',[points[0],points[-1]],.001*S,metal,'hand_left')
    if identity in ['erdene','bayar','jargal']:
        p=Vector((.07*S,-.12*S,chest.z-.05*S))
        box('rifle-stock',p+Vector((0,0,-.14*S)),(.045*S,.04*S,.20*S),material('rifle wood','#67503b'),'chest')
        box('rifle-receiver',p,(.035*S,.04*S,.14*S),dark,'chest')
        box('rifle-barrel',p+Vector((0,0,.20*S)),(.014*S,.015*S,.26*S),dark,'chest')
        strip('rifle-sling',[(-.13*S,-.09*S,neck.z-.035*S),(.12*S,-.14*S,chest.z-.21*S)],.009*S,material('canvas sling','#797459'),'chest')
    if identity=='irina':
        p=RIG.data.bones['hand_right'].head_local+Vector((0,-.03*S,-.025*S))
        box('cassette-dictaphone',p,(.043*S,.027*S,.075*S),dark,'hand_right')
        box('record-button',p+Vector((0,-.016*S,.02*S)),(.008*S,.005*S,.008*S),material('record red','#8b3529'),'hand_right')


def normalize_height(profile):
    global S
    meshes=[o for o in bpy.data.objects if o.type=='MESH']
    bottom=min(v.co.z for o in meshes for v in o.data.vertices)
    top=max(v.co.z for o in meshes for v in o.data.vertices)
    factor=profile['height']/(top-bottom)
    matrix=Matrix.Scale(factor,4) @ Matrix.Translation((0,0,-bottom))
    for obj in meshes:obj.data.transform(matrix,shape_keys=True)
    bpy.context.view_layer.objects.active=RIG
    bpy.ops.object.mode_set(mode='EDIT')
    positions=[(b.name,b.head.copy(),b.tail.copy(),b.use_connect) for b in RIG.data.edit_bones]
    for bone in RIG.data.edit_bones:bone.use_connect=False
    for name,head,tail,connected in positions:
        bone=RIG.data.edit_bones[name];bone.head=matrix @ head;bone.tail=matrix @ tail
    for name,head,tail,connected in positions:RIG.data.edit_bones[name].use_connect=connected
    bpy.ops.object.mode_set(mode='OBJECT')
    S*=factor
    assert abs(max(v.co.z for o in meshes for v in o.data.vertices)-profile['height'])<1e-5


def load_actor(profile):
    global RIG,BODY,S
    reset()
    if profile['kind']=='infant':
        make_infant(profile)
        normalize_height(profile)
        return
    female=profile['kind'] in ['adultFemale','teenFemale'] or profile['id']=='altan'
    path=ROOT/('assets/sources/vinrax-female/female_secretary.fbx' if female else 'assets/male_casual/male_casual.fbx')
    bpy.ops.import_scene.fbx(filepath=str(path))
    RIG=next(o for o in bpy.data.objects if o.type=='ARMATURE')
    BODY=next(o for o in bpy.data.objects if o.type=='MESH')
    RIG.name=profile['id']+'-rig';BODY.name=profile['id']+'-body'
    for obj in [BODY,RIG]:
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
        bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    bone_aliases(female)
    old_height=max(v.co.z for v in BODY.data.vertices)
    S=profile['height']/old_height
    for vertex in BODY.data.vertices: vertex.co=point_shape(vertex.co,profile,old_height)
    bpy.context.view_layer.objects.active=RIG
    bpy.ops.object.mode_set(mode='EDIT')
    positions=[(b.name,b.head.copy(),b.tail.copy(),b.use_connect) for b in RIG.data.edit_bones]
    for bone in RIG.data.edit_bones:bone.use_connect=False
    for name,head,tail,connected in positions:
        bone=RIG.data.edit_bones[name]
        bone.head=point_shape(head,profile,old_height);bone.tail=point_shape(tail,profile,old_height)
    for name,head,tail,connected in positions:RIG.data.edit_bones[name].use_connect=connected
    bpy.ops.object.mode_set(mode='OBJECT')
    RIG.animation_data_clear()
    recolor_texture(profile,female)
    mouth,eyes,top=reshape_face(profile,female)
    if female:
        # Keep facial UV detail, but give clothing/legs clean material regions instead of reusing stocking pixels.
        torso=material('fitted cloth '+profile['id'],profile['colors']['cloth'])
        legs=material('trousers '+profile['id'],profile['colors']['trousers'])
        skin=material('leg skin '+profile['id'],profile['skin'])
        shoes=material('shoes '+profile['id'],'#302b26')
        indices=[]
        for mat in [torso,legs,skin,shoes]:
            indices.append(len(BODY.data.materials));BODY.data.materials.append(mat)
        head_height=RIG.data.bones['head'].head_local.z
        pelvis_height=RIG.data.bones['pelvis'].head_local.z
        hands={g.index for g in BODY.vertex_groups if g.name.startswith(('hand','thumb'))}
        for polygon in BODY.data.polygons:
            verts=[BODY.data.vertices[i] for i in polygon.vertices]
            center=sum((v.co for v in verts),Vector())/len(verts)
            hand_weight=sum(sum(g.weight for g in v.groups if g.group in hands) for v in verts)/len(verts)
            if center.z>head_height-.015*S or hand_weight>.35:continue
            polygon.material_index=indices[3] if center.z<.065*S else indices[2] if profile['outfit']=='dress' and center.z<pelvis_height-.22*S else indices[1] if center.z<pelvis_height-.10*S else indices[0]
    if profile['id']=='altan':
        # A toddler gets a rounded head and small nose rather than a scaled adult facial atlas.
        head=RIG.data.bones['head'].head_local
        bm=bmesh.new();bm.from_mesh(BODY.data);bm.verts.ensure_lookup_table()
        remove=[face for face in bm.faces if all(v.co.z>head.z-.015*S for v in face.verts)]
        bmesh.ops.delete(bm,geom=remove,context='FACES_ONLY');bm.to_mesh(BODY.data);bm.free()
        center=head+Vector((0,0,.050))
        flesh=material('toddler skin',profile['skin'])
        ellipsoid('toddler-round-head',center,(.082,.065,.088),flesh,'head',16,8)
        ellipsoid('toddler-small-nose',center+Vector((0,-.065,-.003)),(.012,.010,.012),flesh,'head')
        mouth=center+Vector((0,-.065,-.030));eyes=[center+Vector((x,-.061,.018)) for x in [-.027,.027]]
        top=center.z+.088
        hair=material('toddler bob',profile['hair'])
        for side in [-1,1]:ellipsoid('toddler-side-hair',(side*.073,.006,center.z+.002),(.020,.055,.075),hair,'head')
        ellipsoid('toddler-hair-crown',(0,.012,center.z+.065),(.084,.065,.031),hair,'head')
    face_details(profile,female,mouth,eyes,top)
    if profile['id']!='altan':hairstyle(profile,top)
    clothes(profile)
    role_props(profile,top)
    normalize_height(profile)
    RIG['credit']='PSX Casual Male Character and PSX Female Secretary Character by Vinrax; original geometry/UV atlas edited for KHANIAD.'
    RIG['profile']=json.dumps(profile,ensure_ascii=False)
    RIG['front']='+Z after glTF Y-up export'


def clear_pose():
    for bone in RIG.pose.bones:
        bone.rotation_mode='QUATERNION';bone.location=(0,0,0);bone.rotation_quaternion=(1,0,0,0);bone.scale=(1,1,1)


def rotate(name, axis, angle):
    if name in RIG.pose.bones:
        RIG.pose.bones[name].rotation_quaternion=Quaternion(axis,angle)


def set_world_direction(name, direction):
    bone=RIG.pose.bones[name]
    rest=bone.bone.matrix_local.to_quaternion()
    current=bone.parent.matrix.to_quaternion() @ bone.parent.bone.matrix_local.to_quaternion().inverted() @ rest if bone.parent else rest
    world=current @ Vector((0,1,0))
    desired=world.rotation_difference(Vector(direction).normalized()) @ current
    parent_delta=bone.parent.matrix.to_quaternion() @ bone.parent.bone.matrix_local.to_quaternion().inverted() if bone.parent else Quaternion()
    bone.rotation_quaternion=rest.inverted() @ parent_delta.inverted() @ desired
    bpy.context.view_layer.update()


def key_pose(frame):
    for bone in RIG.pose.bones:
        bone.keyframe_insert(data_path='location',frame=frame)
        bone.keyframe_insert(data_path='rotation_quaternion',frame=frame)
        bone.keyframe_insert(data_path='scale',frame=frame)


def shape_values(frame, **values):
    for obj in bpy.data.objects:
        if obj.type!='MESH' or not obj.data.shape_keys: continue
        for key in obj.data.shape_keys.key_blocks:
            if key.name=='Basis': continue
            key.value=values.get(key.name,0)
            key.keyframe_insert(data_path='value',frame=frame)


def stash_clip(name, end):
    targets=[RIG]+[o.data.shape_keys for o in bpy.data.objects if o.type=='MESH' and o.data.shape_keys]
    for target in targets:
        if not target.animation_data or not target.animation_data.action:continue
        action=target.animation_data.action;action.name=name+'-'+target.name
        track=target.animation_data.nla_tracks.new();track.name=name
        strip=track.strips.new(name,1,action)
        strip.action_frame_start=1;strip.action_frame_end=end
        target.animation_data.action=None
        track.mute=True
    clear_pose()
    for obj in bpy.data.objects:
        if obj.type=='MESH' and obj.data.shape_keys:
            for k in obj.data.shape_keys.key_blocks:k.value=0


def preview_clips(profile):
    for name,duration in [('idle',3)]+([] if profile['kind']=='infant' else [('walk',1),('wave',3),('cough',3)]):
        end=round(duration*FPS)+1
        for frame in range(1,end+1,3):
            clear_pose();t=(frame-1)/FPS;phase=t*math.tau
            if profile['kind']=='infant':
                rotate('head',(1,0,0),.035*math.sin(t*2));RIG.pose.bones['pelvis'].scale=(1,1,1+.012*math.sin(t*3))
            else:
                rotate('chest',(1,0,0),.013*math.sin(t*2.3))
                rotate('head',(0,1,0),.025*math.sin(t*.9))
                if name=='walk':
                    for sign,side in [(1,'left'),(-1,'right')]:
                        rotate('thigh_'+side,(1,0,0),sign*.32*math.sin(phase))
                        rotate('shin.'+('L' if side=='left' else 'R'),(1,0,0),max(0,-sign*math.sin(phase))*.48)
                        rotate('upper_arm_'+side,(1,0,0),-sign*.22*math.sin(phase))
                if name=='wave':
                    set_world_direction('upper_arm_right',(-.7,0,.7));set_world_direction('forearm_right',(-.2,-.1,1))
                    rotate('hand_right',(0,0,1),.22*math.sin(t*9))
                if name=='cough':
                    intensity=max(0,math.sin(math.pi*t/duration))
                    rotate('chest',(1,0,0),.12*intensity*(1+.25*math.sin(t*15)))
                    set_world_direction('upper_arm_right',(-.1,-.9,-.2));set_world_direction('forearm_right',(.1,-.3,1))
            key_pose(frame)
            shape_values(frame,blink=1 if .12<(t%2.7)<.23 else 0,speak=.12 if name=='cough' else 0)
        key_pose(end);shape_values(end)
        stash_clip(name,end)


def contact_marker(name, bone, point):
    obj=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(obj)
    obj.parent=RIG;obj.parent_type='BONE';obj.parent_bone=bone
    # Bone-parented objects inherit the tail origin in Blender.
    matrix=RIG.data.bones[bone].matrix_local.copy();matrix.translation=RIG.data.bones[bone].tail_local
    obj.matrix_basis=matrix.inverted() @ Matrix.Translation(Vector(point))
    obj.empty_display_size=.012
    return obj


def ganaa_performance():
    clear_pose()
    # IK is an authoring constraint only; every sampled deform pose is baked below.
    controls={};constraints=[];palm_offsets={}
    for side,sign in [('left',1),('right',-1)]:
        hand=RIG.data.bones['hand_'+side]
        palm=(hand.head_local+hand.tail_local)*.5+Vector((0,-.012*S,0))
        marker=contact_marker('grip-'+side,'hand_'+side,palm)
        palm_offsets[side]=hand.matrix_local.inverted() @ palm
        target=bpy.data.objects.new('IK-wrist-'+side,None);bpy.context.collection.objects.link(target);target.hide_render=True
        constraint=RIG.pose.bones['forearm_'+side].constraints.new('IK');constraint.target=target;constraint.chain_count=2;constraint.use_tail=True
        pole=bpy.data.objects.new('IK-elbow-'+side,None);bpy.context.collection.objects.link(pole);pole.location=(sign*.47,.12,.48)
        constraint.pole_target=pole;constraint.pole_angle=math.pi/2 if side=='left' else -math.pi/2
        constraint.mute=True
        controls[side]=(target,pole);constraints.append(constraint)
    head=RIG.data.bones['head'].head_local
    cheek_rest=head+Vector((-.072*S,-.070*S,.025*S))
    contact_marker('cheek-contact','head',cheek_rest)
    end=30*FPS+1;poses=[];max_errors={'left':0,'right':0};impact_error=0
    def blend(t,a,b):return max(0,min(1,(t-a)/(b-a)))
    def smooth(t,a,b):
        x=blend(t,a,b);return x*x*(3-2*x)
    for frame in range(1,end+1):
        t=(frame-1)/FPS;clear_pose()
        # Pelvis at chair seat; forward thighs, knees roughly right angled, feet on pedals.
        pelvis=RIG.pose.bones['pelvis'];rest=pelvis.bone.head_local
        delta=Vector((0,-.22,.22))-rest
        pelvis.location=pelvis.bone.matrix_local.to_3x3().inverted() @ delta
        lean=.24+.055*smooth(t,13,16)-.035*smooth(t,24.2,28)
        recoil=math.exp(-((t-22.35)/.22)**2)
        rotate('spine',(1,0,0),lean)
        rotate('chest',(1,0,0),.015+lean*.4-recoil*.06+.008*math.sin(t*2.4)+.0025*math.sin(t*19))
        laugh_nod=.09*math.exp(-((t-7.05)/.22)**2)+.055*math.exp(-((t-7.75)/.25)**2)
        set_world_direction('head',(0,-.10+laugh_nod+.004*math.sin(t*17),1))
        head_yaw=.12*(smooth(t,6.65,7.15)-smooth(t,8.8,9.45))-.13*(smooth(t,16,17.5)-smooth(t,20.3,21.2))+.11*recoil+.016*math.sin(t*.8)
        RIG.pose.bones['head'].rotation_quaternion @= Quaternion((0,1,0),head_yaw)
        bpy.context.view_layer.update()
        for side,sign in [('left',1),('right',-1)]:
            set_world_direction('thigh_'+side,(sign*.10,-1,-.08))
            set_world_direction('shin.'+('L' if side=='left' else 'R'),(sign*.03,-.34,-1))
            set_world_direction('foot_'+side,(0,-1,-.12))
        # The cab wheel was lowered after measuring the actor's real seated eye height.
        rise=math.sqrt(CAB['wheelRadius']**2-CAB['gripX']**2)
        center=Vector(CAB['wheelCenter'])-Vector(CAB['driverOrigin'])
        targets={side:Vector((center.x+sign*CAB['gripX'], -(center.z+rise*math.sin(CAB['wheelTilt'])),center.y+rise*math.cos(CAB['wheelTilt']))) for side,sign in [('left',1),('right',-1)]}
        if 21.35<t<24.2:
            cheek=RIG.pose.bones['head'].matrix @ (RIG.data.bones['head'].matrix_local.inverted() @ cheek_rest)
            wheel=targets['right'];anticipation=Vector((-.30,-.38,.85));backswing=cheek+Vector((-.24,.015,.035));contact=cheek.copy()
            if t<21.65:targets['right']=wheel.lerp(anticipation,smooth(t,21.35,21.65))
            elif t<21.88:targets['right']=anticipation.lerp(backswing,smooth(t,21.65,21.88))
            elif t<22.15:targets['right']=backswing.lerp(contact,smooth(t,21.88,22.15))
            elif t<22.27:targets['right']=contact
            elif t<23.5:targets['right']=contact.lerp(anticipation,smooth(t,22.27,23.5))
            else:targets['right']=anticipation.lerp(wheel,smooth(t,23.5,24.2))
        for side,sign in [('left',1),('right',-1)]:
            # Hand's longitudinal axis follows the rim tangent; fingers bend around it.
            hand=RIG.pose.bones['hand_'+side]
            direction=Vector((-sign*.18,-.6,-.8)).normalized()
            desired=Vector((0,1,0)).rotation_difference(direction)
            rotation=desired
            grip=targets[side]
            target,pole=controls[side]
            wrist=grip-rotation @ palm_offsets[side]
            target.location=wrist
            upper=RIG.pose.bones['upper_arm_'+side]
            lower=RIG.pose.bones['forearm_'+side]
            shoulder=upper.matrix.translation.copy()
            axis=wrist-shoulder;distance=axis.length;axis.normalize()
            length1=upper.bone.length;length2=lower.bone.length
            assert abs(length1-length2)+.0001<distance<length1+length2-.0001, f'Unreachable wrist target {side} t={t:.3f}: distance={distance:.4f}, lengths={length1:.4f},{length2:.4f}, shoulder={tuple(shoulder)}, wrist={tuple(wrist)}'
            along=(length1*length1-length2*length2+distance*distance)/(2*distance)
            bend=pole.location-shoulder; bend-=axis*bend.dot(axis);bend.normalize()
            elbow=shoulder+axis*along+bend*math.sqrt(max(0,length1*length1-along*along))
            set_world_direction('upper_arm_'+side,elbow-shoulder)
            set_world_direction('forearm_'+side,wrist-lower.matrix.translation)
            parent=hand.parent.matrix.to_quaternion();rest_local=hand.parent.bone.matrix_local.inverted() @ hand.bone.matrix_local
            hand.rotation_quaternion=rest_local.to_quaternion().inverted() @ parent.inverted() @ rotation
            for finger in ['f_middle.01.'+('L' if side=='left' else 'R'),'thumb.01.'+('L' if side=='left' else 'R'),'thumb.02.'+('L' if side=='left' else 'R')]:
                rotate(finger,(1,0,0),.48 if 'middle' in finger else -.25)
            bpy.context.view_layer.update()
        # Keep source skeleton transforms: store visual matrices before removing authoring IK.
        poses.append({bone.name:bone.matrix.copy() for bone in RIG.pose.bones})
        for side in ['left','right']:
            actual=RIG.pose.bones['hand_'+side].matrix @ palm_offsets[side]
            if side=='left' or t<21.35 or t>24.2:max_errors[side]=max(max_errors[side],(actual-targets[side]).length)
            if side=='right' and abs(t-22.15)<1/FPS:impact_error=(actual-targets[side]).length
    assert max(max_errors.values()) < .004, 'Wheel contact IK did not converge: '+str(max_errors)
    for bone in RIG.pose.bones:
        for constraint in list(bone.constraints):bone.constraints.remove(constraint)
    for frame,pose in enumerate(poses,1):
        for bone in RIG.pose.bones:
            bone.matrix_basis=bone.bone.convert_local_to_pose(pose[bone.name],bone.bone.matrix_local,parent_matrix=pose[bone.parent.name] if bone.parent else Matrix.Identity(4),parent_matrix_local=bone.parent.bone.matrix_local if bone.parent else Matrix.Identity(4),invert=True)
        bpy.context.view_layer.update();key_pose(frame)
        t=(frame-1)/FPS
        cues=any(a<=t<=b for a,b in [(6.7,12.9),(17,20.9),(21.4,23.8),(24,27.8)])
        speak=(.16+.52*abs(math.sin(t*10.7))+.12*math.sin(t*19)**2) if cues else .02
        if any(abs(t-pause)<.10 for pause in [7.9,9.45,10.8,12.15,18.1,19.6,22.0,24.65,26.5]):speak=.025
        shape_values(frame,speak=speak,gaze=.7*(smooth(t,16,17.5)-smooth(t,20.5,21.3)),blink=1 if .09<(t%3.8)<.19 else 0,fear=.24*(smooth(t,6.7,7.2)-smooth(t,12.3,13))+.42*smooth(t,13,16)*(1-smooth(t,23,24)),hunger=.65*(smooth(t,16,17)-smooth(t,20.5,21.3)),resolve=.65*smooth(t,24,28))
    stash_clip('hour-five',end)
    for target,pole in controls.values():
        target['authoring_only']='IK targets used while baking; exported animation contains deform bone keys.'
        pole['authoring_only']='Elbow pole used while baking.'
    RIG['performance_contact_error_m']=json.dumps(max_errors)
    RIG['slap_contact_error_m']=impact_error
    return {'wheelContactMaxError':max_errors,'slapContactError':impact_error,'duration':30,'fps':24}


def export_actor(profile):
    load_actor(profile)
    preview_clips(profile)
    performance=ganaa_performance() if profile['id']=='ganaa' else None
    clear_pose();bpy.context.scene.frame_set(1)
    # Inactive tracks keep the editable source in standing rest; the runtime selects clips explicitly.
    for target in [RIG]+[o.data.shape_keys for o in bpy.data.objects if o.type=='MESH' and o.data.shape_keys]:
        if target.animation_data:
            for track in target.animation_data.nla_tracks:track.mute=True
    bpy.context.scene.frame_start=1;bpy.context.scene.frame_end=30*FPS+1 if performance else 3*FPS+1
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/(profile['id']+'.blend')))
    for target in [RIG]+[o.data.shape_keys for o in bpy.data.objects if o.type=='MESH' and o.data.shape_keys]:
        if target.animation_data:
            for track in target.animation_data.nla_tracks:track.mute=False
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type in ['MESH','ARMATURE'] or obj.name in ['grip-left','grip-right','cheek-contact']:obj.select_set(True)
    bpy.context.view_layer.objects.active=RIG
    bpy.ops.export_scene.gltf(filepath=str(OUT/(profile['id']+'.glb')),export_format='GLB',use_selection=True,export_yup=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_merge_animation='NLA_TRACK',export_force_sampling=True,export_frame_range=False,export_nla_strips=True,export_morph=True,export_morph_animation=True,export_def_bones=True,export_rest_position_armature=True,export_extras=True,export_image_format='AUTO',export_optimize_animation_size=True,export_anim_slide_to_zero=True)
    glb=(OUT/(profile['id']+'.glb')).read_bytes();length=int.from_bytes(glb[12:16],'little');data=json.loads(glb[20:20+length])
    assert data.get('skins'),profile['id']+' missing skin'
    assert any(a['name']=='idle' for a in data.get('animations',[])),profile['id']+' missing idle'
    if profile['kind']!='infant':assert any('speak' in m.get('extras',{}).get('targetNames',[]) for m in data['meshes'])
    assert all(i.get('bufferView') is not None for i in data.get('images',[]))
    report={'id':profile['id'],'glbBytes':len(glb),'sha256':hashlib.sha256(glb).hexdigest(),'nativeSource':profile['id']+'.blend','animations':[a['name'] for a in data.get('animations',[])],'height':profile['height'],'source':'original swaddled infant' if profile['kind']=='infant' else 'Vinrax female secretary' if profile['kind'] in ['adultFemale','teenFemale'] or profile['id']=='altan' else 'Vinrax casual male','performance':performance}
    print('CAST_EXPORTED',json.dumps(report),flush=True)
    return report


roster=json.loads((OUT/'roster.json').read_text())
ids=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
selected=[a for a in roster if a['kind']!='voice' and (not ids or a['id'] in ids)]
assert selected,'No visible roster IDs selected'
selected.sort(key=lambda a: a['id']!='ganaa')
report_path=OUT/'asset-report.json'
existing=json.loads(report_path.read_text()).get('assets',[]) if report_path.exists() else []
for actor in selected:
    report=export_actor(actor)
    existing=[r for r in existing if r['id']!=actor['id']]+[report]
    report_path.write_text(json.dumps({'builder':'scripts/build-cast.py','blender':bpy.app.version_string,'credit':'PSX Casual Male Character and PSX Female Secretary Character by Vinrax; credit required.','limits':['Roster-authored low-poly geometry edits; no scanned likenesses.','Quaternius download unavailable due to official Google Drive quota.','Only roster-appropriate simple costume pieces; not every staging prop is modeled.'],'assets':existing},indent=2,ensure_ascii=False)+'\n')
