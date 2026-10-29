"""Episode 1 environment authoring, run in Blender through Blender MCP.
Layout choices follow the recovered EP1 v2.1 / world v1 / cafe v1 plans.
Outputs are a separate native source and static GLBs; runtime assets stay intact.
"""
from pathlib import Path
import bpy, math, json, random
import numpy as np
from mathutils import Vector

ROOT = Path('/home/barsaa/mongolian-steppe/assets/maps/episode-1')
COLORS = {'plaster':(.48,.44,.35), 'wood':(.25,.16,.095), 'concrete':(.31,.30,.27),
          'metal':(.22,.25,.25), 'rust':(.30,.20,.13), 'cloth':(.31,.29,.23),
          'asphalt':(.14,.15,.15), 'earth':(.32,.29,.21), 'grass':(.37,.35,.23),
          'frost':(.62,.66,.64), 'cream':(.68,.66,.53), 'blue':(.18,.27,.31),
          'dark':(.075,.08,.075), 'red':(.35,.14,.10)}


def material(kind):
    name='EP01.'+kind
    if name in bpy.data.materials:return bpy.data.materials[name]
    m=bpy.data.materials.new(name);m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Roughness'].default_value=.88
    bs.inputs['Specular IOR Level'].default_value=.16
    base=COLORS[kind];m.diffuse_color=(*base,1)
    rng=np.random.default_rng(830+list(COLORS).index(kind));s=128
    pix=np.ones((s,s,4),dtype=np.float32)
    yy,xx=np.mgrid[:s,:s];noise=rng.normal(0,.009,(s,s))
    if kind=='wood':noise+=.055*np.sin(yy*.43+np.sin(xx*.1))-.1*(yy%32<2)
    if kind=='plaster':noise-=.08*np.exp(-yy/24);noise-=.035*(xx%51<2)*(yy<56)
    if kind in ('metal','rust'):noise+=.025*np.cos(xx*math.pi/8)
    if kind=='concrete':noise-=.05*((xx%32<1)|(yy%32<1))
    for k in range(3):pix[:,:,k]=np.clip(base[k]+noise,0,1)
    image=bpy.data.images.new(name, width=s,height=s,alpha=True)
    image.pixels.foreach_set(pix.ravel());image.file_format='PNG'
    (ROOT/'textures').mkdir(parents=True,exist_ok=True)
    image.filepath_raw=str(ROOT/'textures'/f'{kind}.png');image.save();image.pack()
    tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;tex.interpolation='Closest'
    m.node_tree.links.new(tex.outputs['Color'],bs.inputs['Base Color'])
    return m


def scene(name):
    if name in bpy.data.scenes:raise ValueError('Scene already exists: '+name)
    s=bpy.data.scenes.new(name);bpy.context.window.scene=s
    s.unit_settings.system='METRIC';s.unit_settings.scale_length=1
    s.render.engine='BLENDER_EEVEE';s.render.resolution_x=1280;s.render.resolution_y=720
    s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.fps=24
    s.world=bpy.data.worlds.new(name+'.World');s.world.use_nodes=True
    s.world.node_tree.nodes['Background'].inputs[0].default_value=(.38,.43,.48,1)
    s.world.node_tree.nodes['Background'].inputs[1].default_value=.45
    s.view_settings.view_transform='AgX';s['scope']='Episode 1 only; proposed layout, no character/shot approval'
    s['axes']='metres; X east, Y north, Z up';s['source']='EP1 production direction v2.1 / Naran world v1 / cafe v1'
    return s


def collection(name):
    c=bpy.data.collections.new(name);bpy.context.scene.collection.children.link(c);return c


def tag(o,name,mat,coll,collision=True):
    o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    coll.objects.link(o)
    if mat:o.data.materials.append(material(mat))
    o['collision']=collision;o['tier']='HERO' if collision else 'MID'
    if o.type=='MESH':
        uv=o.data.uv_layers.active or o.data.uv_layers.new()
        for p in o.data.polygons:
            axes=sorted(range(3),key=lambda a:abs(p.normal[a]))[:2]
            for li in p.loop_indices:
                co=o.data.vertices[o.data.loops[li].vertex_index].co
                uv.data[li].uv=(co[axes[0]]*.65,co[axes[1]]*.65)
    return o


def box(name,loc,size,mat,coll,collision=True,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object
    o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    tag(o,name,mat,coll,collision)
    if bevel:
        mod=o.modifiers.new('Worn edges','BEVEL');mod.width=bevel;mod.segments=1
        mod.affect='EDGES';o.modifiers.new('Corner normals','WEIGHTED_NORMAL')
    return o


def cyl(name,loc,r,depth,mat,coll,verts=12,rotation=None,collision=False):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=depth,location=loc)
    o=bpy.context.object
    if rotation:o.rotation_euler=rotation
    return tag(o,name,mat,coll,collision)


def beam(name,a,b,width,mat,coll):
    a,b=Vector(a),Vector(b);o=box(name,(a+b)/2,(width,width,(b-a).length),mat,coll,False)
    o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o


def mesh(name,verts,faces,mat,coll,collision=False):
    me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update()
    o=bpy.data.objects.new(name,me);coll.objects.link(o);return tag(o,name,mat,coll,collision)


def label(name,text,loc,size,coll,rot=(math.pi/2,0,0),mat='cream'):
    bpy.ops.object.text_add(location=loc,rotation=rot);o=bpy.context.object
    o.data.body=text;o.data.size=size;o.data.align_x='CENTER';o.data.resolution_u=1
    font=Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
    if font.exists():o.data.font=bpy.data.fonts.get('DejaVuSans') or bpy.data.fonts.load(str(font))
    bpy.ops.object.convert(target='MESH');return tag(bpy.context.object,name,mat,coll,False)


def camera(name,pos,target,lens=40,ortho=None):
    data=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,data)
    bpy.context.scene.collection.objects.link(o);o.location=pos
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
    data.lens=lens;data.clip_end=1000
    if ortho:data.type='ORTHO';data.ortho_scale=ortho
    return o


def light(name,pos,target,energy=900,size=10,color=(1,.85,.65)):
    d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;d.color=color
    o=bpy.data.objects.new(name,d);bpy.context.scene.collection.objects.link(o);o.location=pos
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()


def daylight():
    d=bpy.data.lights.new('Late autumn sun','SUN');d.energy=1.7;d.angle=.24
    o=bpy.data.objects.new('Late autumn sun',d);bpy.context.scene.collection.objects.link(o)
    o.rotation_euler=(.55,-.4,-.55);light('Overcast fill',(0,-12,22),(0,0,0),1500,30,(.73,.82,1))


def ground(coll,center=(0,0),size=(100,100),height=None):
    height=height or (lambda x,y: -.18+.08*math.sin(x*.23)*math.cos(y*.17))
    # Tiles keep the terrain below the per-piece budget instead of one giant mesh.
    for ix in range(4):
        for iy in range(4):
            vs=[];fs=[]
            for j in range(11):
                for i in range(11):
                    x=center[0]-size[0]/2+(ix+i/10)*size[0]/4
                    y=center[1]-size[1]/2+(iy+j/10)*size[1]/4
                    vs.append((x,y,height(x,y)))
            for j in range(10):
                for i in range(10):
                    k=j*11+i;fs.append((k,k+1,k+12,k+11))
            mesh(f'Ground.{ix}.{iy}',vs,fs,'earth',coll)


def table(name,x,y,coll,w=1.6,d=.85):
    box(name+'.Top',(x,y,.76),(w,d,.08),'wood',coll,True,.018)
    for dx in [-w/2+.12,w/2-.12]:
        for dy in [-d/2+.12,d/2-.12]:box(name+'.Leg',(x+dx,y+dy,.37),(.07,.07,.74),'metal',coll)


def chair(name,x,y,coll,angle=0):
    objs=[box(name+'.Seat',(x,y,.44),(.44,.43,.065),'wood',coll)]
    for dx in [-.17,.17]:
        for dy in [-.16,.16]:objs.append(box(name+'.Leg',(x+dx,y+dy,.22),(.045,.045,.44),'metal',coll))
    for dx in [-.17,.17]:objs.append(box(name+'.BackSupport',(x+dx,y-.18,.67),(.045,.045,.46),'metal',coll))
    objs.append(box(name+'.Back',(x,y-.18,.85),(.44,.055,.18),'wood',coll))
    for o in objs:
        v=o.location-Vector((x,y,0));v.rotate(__import__('mathutils').Matrix.Rotation(angle,3,'Z'))
        o.location=Vector((x,y,0))+v;o.rotation_euler.z=angle


def opening_wall(name,axis,at,start,end,lo,hi,coll,h=3.1,mat='plaster',bottom=0,top=2.25):
    # The opening is actual missing wall geometry, including its lintel/sill.
    def piece(s,e,z,depth):
        loc=((s+e)/2,at,z) if axis=='X' else (at,(s+e)/2,z)
        size=(e-s,.22,depth) if axis=='X' else (.22,e-s,depth)
        return box(name,loc,size,mat,coll)
    piece(start,lo,h/2,h);piece(hi,end,h/2,h)
    if top<h:piece(lo,hi,(top+h)/2,h-top)
    if bottom>0:piece(lo,hi,bottom/2,bottom)


def markers(points,coll):
    coll.hide_render=True
    for name,pos in points.items():
        o=bpy.data.objects.new(name,None);coll.objects.link(o);o.location=pos
        o.empty_display_type='ARROWS';o.empty_display_size=.45;o['role']='layout anchor, not an actor'


def build_cafe():
    s=scene('EP01_Cafe');arch=collection('CAFE | architecture');props=collection('CAFE | furniture and story props')
    site=collection('CAFE | forecourt and landscape');roof=collection('CAFE | removable roof');tech=collection('CAFE | layout anchors')
    ground(site,(0,-15),(100,100))
    box('Cafe.Floor',(0,0,-.12),(14,10,.24),'concrete',arch)
    box('Cafe.North',(0,5.11,1.55),(14.22,.22,3.1),'plaster',arch)
    opening_wall('Cafe.StaffWall','Y',7.11,-5,5,.15,1.35,arch)
    box('Cafe.West',(-7.11,0,1.55),(.22,10.22,3.1),'plaster',arch)
    # South frontage: two real windows and the 1.8m entrance.
    spans=[(-7,-5.2),(-3,-.3),(1.5,3.2),(5.4,7)]
    for a,b in spans:box('Cafe.FrontPier',((a+b)/2,-5.11,1.55),(b-a,.22,3.1),'plaster',arch)
    box('Cafe.DoorLintel',(.6,-5.11,2.675),(1.8,.22,.85),'plaster',arch)
    for x in [-4.1,4.3]:
        box('Cafe.WindowSill',(x,-5.11,.425),(2.2,.22,.85),'plaster',arch)
        box('Cafe.WindowLintel',(x,-5.11,2.725),(2.2,.22,.75),'plaster',arch)
        for dx in [-1.12,1.12]:box('Cafe.WindowFrame',(x+dx,-5.24,1.6),(.055,.07,1.56),'wood',arch,False)
        for z in [.85,2.35]:box('Cafe.WindowFrame',(x,-5.24,z),(2.3,.07,.06),'wood',arch,False)
        box('Cafe.WindowMullion',(x,-5.24,1.6),(.045,.07,1.5),'wood',arch,False)
        # Mesh glass is very faint so shot eyelines remain readable.
        glass=box('Cafe.WindowGlass',(x,-5.14,1.6),(2.16,.018,1.46),'cream',arch,False)
        gm=bpy.data.materials.get('EP01.Glass')
        if not gm:
            gm=bpy.data.materials.new('EP01.Glass');gm.use_nodes=True;bs=gm.node_tree.nodes.get('Principled BSDF')
            bs.inputs['Base Color'].default_value=(.5,.64,.7,1);bs.inputs['Alpha'].default_value=.12
            gm.surface_render_method='DITHERED';gm.diffuse_color=(.5,.64,.7,.12)
        glass.data.materials.clear();glass.data.materials.append(gm)
    # Open leaves lie outside the clear entrance, with hinges as real authoring pivots.
    for x,ang in [(-.34,-math.pi/2),(1.54,math.pi/2)]:
        pivot=bpy.data.objects.new('Cafe.DoorHinge',None);arch.objects.link(pivot);pivot.location=(x,-5.18,0)
        leaf=box('Cafe.OpenDoor',(0,0,1.075),(.88,.055,2.15),'blue',arch)
        leaf.parent=pivot;leaf.location=(.44 if x<0 else -.44,0,1.075);pivot.rotation_euler.z=ang
    # Staff exit connects to the side store rather than a painted-on door.
    box('Store.Floor',(9.65,1,-.1),(5,5,.2),'concrete',arch)
    box('Store.East',(12.26,1,1.45),(.22,5.22,2.9),'plaster',arch)
    box('Store.South',(9.65,-1.61,1.45),(5.22,.22,2.9),'plaster',arch)
    opening_wall('Store.BackExit','X',3.61,7.15,12.26,9.1,10.2,arch,h=2.9)
    box('Store.WestLower',(7.11,-.73,1.45),(.22,1.35,2.9),'plaster',arch)
    # Roof panels and exposed rafters can be hidden together for plan inspection.
    for side in [-1,1]:
        panel=box('Cafe.RoofPanel',(0,side*2.65,3.56),(15,5.5,.12),'metal',roof,False)
        panel.rotation_euler.x=-side*.16
    for x in [-6,-3,0,3,6]:beam('Cafe.Rafter',(x,-5,3.04),(x,5,3.04),.12,'wood',roof)
    box('Cafe.Counter',(-4,1.6,.54),(4,.72,1.08),'blue',props)
    box('Cafe.CounterTop',(-4,1.6,1.13),(4.2,.85,.10),'wood',props,True,.018)
    for x in [-5.4,-4.2,-3]:
        box('Counter.Drawer',(x,1.225,.75),(1.05,.04,.34),'wood',props,False)
        box('Counter.Handle',(x,1.19,.75),(.18,.03,.035),'metal',props,False)
    box('Kitchen.Partition',(-5.2,2.85,1.4),(3.45,.15,2.8),'plaster',arch)
    box('Kitchen.Worktop',(-5.2,4.1,.84),(3.1,.75,.12),'wood',props)
    box('Kitchen.Stove',(-5.9,3.9,.55),(.84,.84,1.1),'dark',props)
    for z in [1.2,1.4]:cyl('Kitchen.BuuzSteamer',(-5.9,3.9,z),.34,.2,'metal',props,16)
    cyl('Kitchen.PotLid',(-5.9,3.9,1.52),.37,.055,'metal',props,16)
    cyl('Kitchen.LidHandle',(-5.9,3.9,1.59),.07,.08,'dark',props)
    box('Heater.Body',(6,2.2,.64),(.65,.9,1.25),'rust',props,True,.025)
    box('Heater.FireDoor',(6,1.73,.55),(.44,.06,.45),'dark',props,False)
    cyl('Heater.Flue',(6,2.3,2.25),.08,2,'metal',props)
    for x in [4,4.35,4.7,5.05]:box('Radiator.Rib',(x,4.86,.64),(.15,.22,1),'cream',props)
    for i,(x,y) in enumerate([(-1.3,-.5),(-4.3,-1.5),(3.3,-.9)]):
        table(f'Table.{i}',x,y,props)
        chair(f'Chair.{i}.S',x,y-.9,props)
        chair(f'Chair.{i}.N',x,y+.9,props,math.pi)
        for dx in [-.35,.35]:
            cyl('Enamel.TeaCup',(x+dx,y,.85),.07,.12,'cream',props)
            cyl('Enamel.Plate',(x+dx,y+.15,.815),.14,.025,'cream',props,16)
    # Dasha's heater-side chair is south of her clear rise/attack route.
    chair('Dasha.Chair',3.7,.6,props)
    box('Story.DebtLedger',(-2.7,1.6,1.205),(.26,.19,.04),'cloth',props,False)
    box('Story.LedgerPaper',(-2.7,1.6,1.228),(.23,.17,.003),'cream',props,False)
    box('Cafe.Sign',(0,-5.3,3.35),(6.2,.13,.7),'blue',props,False)
    label('Cafe.SignLetters','ХҮРЭЛИЙН ГУАНЗ',(0,-5.38,3.16),.40,props)
    box('Cafe.Menu',(-6.6,-5.3,1.65),(.65,.08,.9),'dark',props,False)
    label('Cafe.MenuLetters','БУУЗ',(-6.6,-5.36,1.7),.15,props)
    box('Forecourt.Apron',(1,-16,-.07),(37,23,.12),'asphalt',site)
    box('Petrol.Island',(9.4,-16,.14),(2.4,2.2,.28),'concrete',site)
    box('Petrol.Dispenser',(9.4,-16,1.02),(.74,.65,1.75),'cream',site,True,.025)
    box('Petrol.Display',(9.4,-16.34,1.47),(.52,.025,.30),'dark',site,False)
    label('Petrol.Label','БЕНЗИН',(9.4,-16.36,.88),.105,site,mat='dark')
    for x in [8,10.8]:cyl('Petrol.Bollard',(x,-16,.4),.12,.8,'rust',site,collision=True)
    hose=[(9.8,-16,1.65),(10.15,-16,.9),(10,-16,.4),(9.8,-16,.7)]
    for a,b in zip(hose,hose[1:]):beam('Petrol.Hose',a,b,.035,'dark',site)
    # Explicit vehicle proxy: placement and sightline reference, no final vehicle claim.
    box('PROXY.KAMAZ.Chassis',(-1.9,-17.3,.9),(2.45,6.5,.4),'dark',site)
    box('PROXY.KAMAZ.Cab',(-1.9,-15.2,1.95),(2.45,2.05,1.85),'blue',site)
    box('PROXY.KAMAZ.Windscreen',(-1.9,-14.16,2.25),(1.95,.035,.65),'dark',site,False)
    box('PROXY.KAMAZ.Cargo',(-1.9,-19.05,1.9),(2.45,3.15,1.7),'cloth',site)
    for x in [-3.08,-.72]:
        for y in [-15.2,-18.6,-19.7]:cyl('PROXY.KAMAZ.Wheel',(x,y,.55),.5,.28,'dark',site,12,(0,math.pi/2,0))
    # Keep props outside the attack/escape and forecourt movement lanes.
    for i in range(4):cyl('CoalBucket',(6.3,3.4+i*.28,.18),.12,.36,'metal',props)
    for x in [-5,-4.3,-3.6]:box('Store.Crate',(x,4.4,.22),(.55,.5,.44),'wood',props)
    for x in [-17,17]:
        cyl('Power.Pole',(x,-22,4),.11,8,'wood',site)
        beam('Power.Crossarm',(x-1,-22,7.6),(x+1,-22,7.6),.09,'wood',site)
    for x0 in [-.4,.4]:
        for a in range(8):
            xa=-17+a*4.25;xb=xa+4.25
            za=7.55-.45*math.sin(math.pi*(xa+17)/34)
            zb=7.55-.45*math.sin(math.pi*(xb+17)/34)
            beam('Power.Cable',(xa,-22+x0,za),(xb,-22+x0,zb),.018,'dark',site)
    box('Highway',(0,-34,-.025),(100,6.6,.08),'asphalt',site)
    for x in range(-45,46,8):box('Highway.Line',(x,-34,.025),(3,.09,.006),'cream',site,False)
    markers({'GANAA':(-1.3,-1.45,0),'HUREL':(-1.6,1.8,0),'DASHA':(3.7,1.15,0),
             'KAMAZ_DRIVER_DOOR':(-3.45,-15.2,0),'SATCHEL_PROTECTED_ZONE':(-2,-16,1.8)},tech)
    daylight();light('Cafe.WarmPractical',(0,0,2.95),(0,0,0),450,5,(1,.65,.36))
    light('Cafe.WindowKey',(0,-8,4),(0,1,1),700,7,(.7,.8,1))
    s.camera=camera('Cafe.Exterior',(23,-33,14),(1,-7,1),39)
    camera('Cafe.Interior',(5.7,-3.7,2.25),(-2,1.65,1.25),24)
    camera('Cafe.Plan',(1,-2,37),(1,-2,0),ortho=43)
    s['door_clear_width_m']=1.8;s['layout_status']='14x10m proposed; real openings and sampled movement lanes'
    return {'scene':s.name,'objects':len(s.objects)}


def build_border():
    s=scene('EP01_BorderRoad');land=collection('ROAD | terrain');road=collection('ROAD | carriageway and shoulder');detail=collection('ROAD | sparse roadside');tech=collection('ROAD | pickup anchors')
    def route(y):return 2.5*math.sin(y/70),.18+.0015*y
    def height(x,y):
        cx,z=route(y);distance=abs(x-cx)
        return z-.10+max(0,distance-5)*.025+max(0,distance-10)*.025*math.sin(y*.025+x*.018)
    ground(land,(0,0),(220,360),height)
    for lo,hi,mat in [(-3.3,3.3,'asphalt'),(-4.6,-3.3,'earth'),(3.3,4.6,'earth')]:
        vs=[];fs=[]
        for y in range(-180,181,6):
            cx,z=route(y);vs.extend([(cx+lo,y,z),(cx+hi,y,z)])
        for i in range(60):k=i*2;fs.append((k,k+1,k+3,k+2))
        mesh('Road.'+mat,vs,fs,mat,road)
    for y in range(-170,171,12):
        x,z=route(y);box('Road.FadedMark',(x,y,z+.012),(.09,3,.008),'cream',road,False)
    rng=random.Random(321)
    for i in range(65):
        y=rng.uniform(-170,170);cx,z=route(y);x=cx+rng.choice([-1,1])*rng.uniform(5.5,70)
        if i%4==0:
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=rng.uniform(.22,.6),location=(x,y,height(x,y)))
            rock=tag(bpy.context.object,'Road.ShoulderStone','concrete',detail,False);rock.scale.z=.6
        else:
            for a in range(3):beam('Grass.DryStem',(x,y,height(x,y)),(x+.1*math.sin(a*2.1),y+.1*math.cos(a*2.1),height(x,y)+.3),.018,'grass',detail)
    for y in [-150,-85,-20,45,110,175]:
        x,z=route(y);x+=11
        cyl('Road.PowerPole',(x,y,height(x,y)+4),.12,8,'wood',detail)
        beam('Road.Crossarm',(x-.9,y,z+7.7),(x+.9,y,z+7.7),.08,'wood',detail)
    # Roadside frost is confined to shaded ditches, not a uniform winter blanket.
    for y in [-80,-50,-20,10,40]:
        x,z=route(y);box('Ditch.Frost',(x-5.3,y,height(x-5.3,y)+.012),(.7,7,.015),'frost',detail,False)
    x,z=route(18)
    box('Road.SignPost',(x+6.2,18,z+1.2),(.09,.09,2.4),'metal',detail)
    box('Road.NaranSign',(x+6.2,18,z+2.15),(2.2,.1,.65),'blue',detail,False)
    label('Road.NaranLetters','НАРАН',(x+6.2,17.94,z+2.03),.32,detail)
    markers({'DASHA_PICKUP':(4.3,0,.18),'KAMAZ_STOP':(0,-2,.18),'CAB_WINDOW_REFERENCE':(1.3,-2,2)},tech)
    daylight();s.camera=camera('Road.PickupEstablish',(20,-42,8),(0,12,1),45)
    camera('Road.PickupEye',(1.4,-4,2.1),(4.3,0,1.6),38)
    camera('Road.Plan',(0,0,220),(0,0,0),ortho=230)
    s['carriageway_width_m']=6.6;s['layout_status']='Local pickup set; travel distances are in the source route ledger'
    return {'scene':s.name,'objects':len(s.objects)}


def build_yard():
    s=scene('EP01_FreightYard');site=collection('YARD | ground and rails');car=collection('YARD | open boxcar');office=collection('YARD | office');details=collection('YARD | equipment');tech=collection('YARD | action anchors')
    ground(site,(0,0),(90,65),lambda x,y:-.13+.035*math.sin(x*.8)*math.cos(y*.7))
    for y in [0,7]:
        for dy in [-.76,.76]:box('Rail.Steel',(0,y+dy,.14),(70,.075,.16),'metal',site)
        for x in range(-34,35):box('Rail.Sleeper',(x,y,.025),(.24,2.3,.14),'wood',site)
    box('Boxcar.Deck',(0,0,1.04),(12,2.7,.2),'wood',car)
    box('Boxcar.Rear',(0,1.4,2.35),(12,.15,2.6),'rust',car)
    for x in [-6,6]:box('Boxcar.End',(x,0,2.35),(.16,2.85,2.6),'rust',car)
    opening_wall('Boxcar.OpenSide','X',-1.4,-6,6,-1.1,1.1,car,h=3.65,mat='rust',bottom=1.14,top=3.5)
    box('Boxcar.Roof',(0,0,3.73),(12.25,3,.16),'metal',car)
    box('Boxcar.SlidDoor',(2.35,-1.52,2.32),(2.3,.09,2.6),'rust',car)
    for x in range(-5,6):box('Boxcar.SideRib',(x,1.51,2.35),(.06,.06,2.5),'metal',car,False)
    for x in [-4.4,-3.4,3.4,4.4]:
        for y in [-.85,.85]:cyl('Boxcar.Wheel',(x,y,.55),.45,.12,'dark',car,12,(math.pi/2,0,0))
    box('Office.Floor',(-10,-9,.05),(6,4,.18),'concrete',office)
    box('Office.West',(-13.1,-9,1.45),(.2,4.2,2.8),'blue',office)
    box('Office.East',(-6.9,-9,1.45),(.2,4.2,2.8),'blue',office)
    opening_wall('Office.WindowWall','X',-6.9,-13.1,-6.9,-11.1,-9.1,office,h=2.85,mat='blue',bottom=1.05,top=2.3)
    opening_wall('Office.DoorWall','X',-11.1,-13.1,-6.9,-9.9,-8.9,office,h=2.85,mat='blue')
    box('Office.Roof',(-10,-9,2.95),(6.6,4.6,.16),'metal',office)
    table('Office.Desk',-10,-8.1,office,1.5,.7);chair('Office.Chair',-10,-9,office)
    box('Story.CassetteRecorder',(-10.3,-8.1,.86),(.26,.16,.10),'dark',office,False)
    for x in [-10.36,-10.24]:cyl('Recorder.Reel',(x,-8.1,.918),.025,.006,'cream',office)
    box('Office.Logbook',(-9.7,-8.1,.82),(.3,.22,.025),'cream',office,False)
    for y in range(-16,19,4):
        cyl('Steam.Support',(-17,y,.7),.07,1.4,'rust',details)
        cyl('Steam.Pipe',(-17,y,1.3),.11,4.05,'metal',details,12,(math.pi/2,0,0))
    for y in [-18,18]:
        for x in range(-32,33,4):
            box('Fence.Post',(x,y,1),(.10,.10,2),'wood',details)
            beam('Fence.Rail',(x,y,.7),(x+4,y,.7),.07,'wood',details)
            beam('Fence.Rail',(x,y,1.6),(x+4,y,1.6),.07,'wood',details)
    for x,y in [(-20,-11),(-22,-12),(16,-8),(18,10)]:
        box('Cargo.Crate',(x,y,.45),(1.3,1.1,.9),'wood',details,True,.02)
        for z in [.1,.8]:box('Cargo.Strap',(x,y,z),(1.34,1.14,.05),'metal',details,False)
    for x,y in [(-22,-4),(22,5)]:
        box('Floodlight.Mast',(x,y,4.4),(.18,.18,8.8),'metal',details)
        box('Floodlight.Head',(x,y,8.5),(.65,.4,.35),'cream',details)
        light('Yard.Floodlight',(x,y,8.5),(0,0,0),500,1.6,(.7,.82,1))
    markers({'GUARD_START':(0,-12,0),'BOXCAR_DOOR':(0,-1.8,0),'RUNNER_END':(-17,5,0),'IRINA_WINDOW':(-10,-7.5,0),'LOADING_AREA':(18,-10,0)},tech)
    daylight();s.world.node_tree.nodes['Background'].inputs[1].default_value=.18
    light('Office.WarmLight',(-10,-9,2.6),(-10,-8,0),140,2,(1,.58,.27))
    s.camera=camera('Yard.Establish',(23,-27,11),(0,0,1.4),43)
    camera('Yard.DoorView',(0,-7,1.75),(0,0,2),36)
    camera('Yard.OfficeView',(-12.5,-9.7,1.7),(-3,0,1.6),31)
    s['boxcar_opening_m']=2.2;s['layout_status']='Fictional Ulan-Ude yard; real open side door and office sightline'
    return {'scene':s.name,'objects':len(s.objects)}


def build_apartment():
    s=scene('EP01_Apartment');walls=collection('HOME | walls and openings');props=collection('HOME | furniture and story props');stairs=collection('HOME | landing stair and courtyard');roof=collection('HOME | removable ceiling');tech=collection('HOME | action anchors')
    box('Home.Floor',(.3,3.65,-.12),(10.2,7.3,.24),'wood',walls)
    # Exterior shell: entry in south wall, windows in living room and bedroom.
    opening_wall('Home.South','X',-.11,-4.8,5.4,-1.3,-.3,walls,h=2.7)
    box('Home.North',(.3,7.41,1.35),(10.42,.22,2.7),'plaster',walls)
    opening_wall('Home.East','Y',5.51,0,7.3,1,3,walls,h=2.7,bottom=.9,top=2.25)
    opening_wall('Home.West','Y',-4.91,0,7.3,4.6,6.4,walls,h=2.7,bottom=.9,top=2.25)
    # Corridor x=-1.5..0. Door openings are in the real wall meshes.
    opening_wall('Home.LivingDoor','Y',0,0,5.1,.9,2.1,walls,h=2.7)
    opening_wall('Home.KitchenDoor','Y',-1.5,0,3.5,1,2.05,walls,h=2.7)
    opening_wall('Home.BedroomDoor','Y',-1.5,3.5,7.3,4.65,5.65,walls,h=2.7)
    box('Home.KitchenBedroom',(-3.15,3.5,1.35),(3.3,.16,2.7),'plaster',walls)
    opening_wall('Home.StoreDoor','X',5.1,2.3,5.4,3.2,4.15,walls,h=2.7)
    opening_wall('Home.BathDoor','X',5.1,0,2.3,.55,1.4,walls,h=2.7)
    box('Home.BathEast',(2.3,6.2,1.35),(.16,2.2,2.7),'plaster',walls)
    box('Home.Ceiling',(.3,3.65,2.78),(10.2,7.3,.16),'cream',roof,False)
    roof.hide_render=True;roof.hide_viewport=True
    table('Birthday.Table',2.7,3.1,props,2.7,1.3)
    for x,y,angle in [(1,3.1,-math.pi/2),(4.4,3.1,math.pi/2),(2,2,0),(3.4,2,0),(2,4.2,math.pi),(3.4,4.2,math.pi)]:chair('Birthday.Chair',x,y,props,angle)
    for x,y in [(1.9,2.8),(3,2.8),(2.4,3.5),(3.4,3.5)]:
        cyl('Birthday.Plate',(x,y,.82),.16,.025,'cream',props,16)
        cyl('Birthday.Cup',(x+.2,y,.87),.055,.12,'cream',props)
    cyl('Birthday.Cake',(2.7,3.1,.9),.23,.15,'cream',props,16)
    for x,y in [(2.58,3.05),(2.75,2.98),(2.76,3.2)]:cyl('Birthday.Candle',(x,y,1.04),.013,.12,'red',props,8)
    box('Home.Sofa',(4.8,.9,.36),(.7,1.5,.7),'cloth',props,True,.04)
    box('Home.Radio',(4.9,4.6,.9),(.55,.25,.30),'wood',props,False)
    box('Kitchen.Counter',(-3.15,.55,.44),(3.1,.65,.88),'blue',props)
    cyl('Kitchen.Kettle',(-3,.55,1.03),.13,.24,'metal',props)
    box('Bedroom.Bed',(-3.65,6.1,.35),(1.5,1.9,.65),'cloth',props,True,.035)
    box('Bedroom.InfantBlanket',(-3.65,5.8,.72),(.7,.65,.08),'cream',props,False)
    box('Bedroom.CoatPile',(-3.4,4.1,.28),(1.4,.6,.5),'cloth',props,False,.04)
    box('Home.ShoeRack',(-4.2,.65,.23),(.6,1.0,.45),'wood',props)
    box('Home.Landing',(-.75,-1.1,-.1),(2.5,2.2,.2),'concrete',stairs)
    # Measurable L-shaped access: two 9-step flights, 1.2m clear width.
    for i in range(9):
        box('Stair.FlightA',(-2.13-i*.27,-1.1,-.083-i/6),(.28,1.2,.1667),'concrete',stairs)
        box('Stair.FlightB',(-4.55,-1.83-i*.27,-1.583-i/6),(1.2,.28,.1667),'concrete',stairs)
    box('Stair.HalfLanding',(-4.55,-1.1,-1.5),(1.2,1.2,.2),'concrete',stairs)
    box('Stair.Courtyard',(-3,-5.4,-3.1),(12,6,.2),'concrete',stairs)
    beam('Stair.HandrailA',(-1.8,-1.75,.9),(-4.55,-1.75,-.6),.06,'metal',stairs)
    beam('Stair.HandrailB',(-5.2,-1.6,-.6),(-5.2,-4.65,-2.1),.06,'metal',stairs)
    markers({'GANAA_SEAT':(1,3.1,0),'ALTAN_GIFT':(1,2.2,0),'GUEST_INFANT_AUDIO':(-3.65,5.8,.85),'ENTRY':(-.8,-.8,0),'COURTYARD_EXIT':(-4.55,-4.9,-3)},tech)
    daylight();light('Home.WarmPractical',(2.4,2.8,2.55),(2.4,2.8,0),260,3,(1,.62,.3))
    light('Home.WindowFill',(7,2.5,3),(2,2.5,1),160,3,(.65,.76,1))
    s.camera=camera('Home.Cutaway',(13,-15,16),(.2,2,.2),42)
    camera('Home.Party',(4.9,.5,1.65),(1.5,3.3,1),25)
    camera('Home.Plan',(.2,2,20),(.2,2,0),ortho=15)
    s['layout_status']='Proposed full floor with separate guest-infant bedroom, kitchen, corridor and stair'
    return {'scene':s.name,'objects':len(s.objects)}


def finish_details():
    bpy.context.window.scene=bpy.data.scenes['EP01_Cafe']
    roof=bpy.data.collections['CAFE | removable roof']
    if not bpy.data.objects.get('Store.Roof'):box('Store.Roof',(9.65,1,3),(5.45,5.45,.13),'metal',roof,False)
    s=bpy.data.scenes['EP01_BorderRoad'];bpy.context.window.scene=s
    c=bpy.data.collections['ROAD | sparse roadside'];land=bpy.data.collections['ROAD | terrain']
    def route(y):return 2.5*math.sin(y/70),.18+.0015*y
    def height(x,y):
        cx,z=route(y);d=abs(x-cx)
        return z-.10+max(0,d-5)*.025+max(0,d-10)*(.07+.035*math.sin(y*.025+x*.018))
    for o in land.objects:
        for v in o.data.vertices:v.co.z=height(v.co.x,v.co.y)
    poles=[(2.5*math.sin(y/70)+11,y,.18+.0015*y+7.7) for y in [-150,-85,-20,45,110,175]]
    for a,b in zip(poles,poles[1:]):
        for offset in [-.65,.65]:
            ps=[]
            for i in range(9):
                t=i/8;ps.append((a[0]+(b[0]-a[0])*t+offset,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t-.7*math.sin(math.pi*t)))
            for p,q in zip(ps,ps[1:]):beam('Road.SaggingWire',p,q,.018,'dark',c)
    # Low distant larch silhouettes and irregular frost patches avoid a flat horizon.
    rng=random.Random(792)
    for i in range(24):
        x=rng.choice([-1,1])*rng.uniform(40,95);y=rng.uniform(20,170);z=height(x,y)
        h=rng.uniform(3.5,6)
        cyl('Road.LarchTrunk',(x,y,z+h*.48),.11,h,'wood',c,8)
        for j in range(3):
            bpy.ops.mesh.primitive_cone_add(vertices=7,radius1=1.1-j*.25,radius2=.08,depth=1.7,location=(x,y,z+h*.45+j*.9))
            tag(bpy.context.object,'Road.LarchCrown','grass',c,False)
    for o in [o for o in list(s.objects) if o.name.startswith('Ditch.Frost')]:bpy.data.objects.remove(o,do_unlink=True)
    for y in [-80,-50,-20,10,40]:
        x,z=route(y);vs=[(x-5.3,y,height(x-5.3,y)+.018)]
        for i in range(9):
            a=i*math.tau/8;xx=x-5.3+(.35+rng.random()*.2)*math.cos(a);yy=y+(3+rng.random())*math.sin(a)
            vs.append((xx,yy,height(xx,yy)+.018))
        mesh('Ditch.IrregularFrost',vs,[(0,i,i+1) for i in range(1,9)],'frost',c)
    # Update plant/stone bases after the terrain refinement.
    for o in c.objects:
        if o.name.startswith('Road.Larch') or o.name.startswith('Ditch.'):continue
        if o.name.startswith('Road.ShoulderStone'):o.location.z=height(o.location.x,o.location.y)
        if o.name.startswith('Grass.DryStem'):
            x,y=o.location.x,o.location.y;cx,z=route(y);d=abs(x-cx)
            old=z-.10+max(0,d-5)*.025+max(0,d-10)*.025*math.sin(y*.025+x*.018)
            o.location.z+=height(x,y)-old
    bpy.context.window.scene=bpy.data.scenes['EP01_Apartment'];c=bpy.data.collections['HOME | landing stair and courtyard']
    rail=bpy.data.objects['Stair.HandrailB'];bpy.data.objects.remove(rail,do_unlink=True)
    beam('Stair.HandrailB',(-5.2,-1.72,-.6),(-5.2,-4.13,-1.933),.06,'metal',c)
    for x,z in [(-2.1,0),(-3.3,-.75),(-4.5,-1.5)]:beam('Stair.RailPostA',(x,-1.7,z),(x,-1.7,z+.9),.045,'metal',c)
    for y,z in [(-1.83,-1.5),(-2.91,-2.17),(-3.99,-2.83)]:beam('Stair.RailPostB',(-5.2,y,z),(-5.2,y,z+.9),.045,'metal',c)
    return {'details':'Connected roadside wires, background larch/frost, stair rail posts and staff-store roof'}
