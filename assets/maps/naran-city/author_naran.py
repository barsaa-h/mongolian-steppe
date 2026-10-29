"""Author Naran through Blender MCP. Existing scene files are never overwritten."""
from pathlib import Path
import bpy, math, random, json, importlib.util
from mathutils import Vector, Matrix

ROOT=Path('/home/barsaa/mongolian-steppe/assets/maps/naran-city')
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
L=load('naran_layout',ROOT/'layout.py')
ep=load('episode_environment_helpers',ROOT.parent/'episode-1/author_episode1.py')
ep.ROOT=ROOT
KIT={};COL={};BUILDINGS=[];COUNTS={};TEMPLATES={}


def box(name,loc,size,mat,coll,collision=True):
    x,y,z=[a/2 for a in size]
    vs=[(-x,-y,-z),(x,-y,-z),(x,y,-z),(-x,y,-z),(-x,-y,z),(x,-y,z),(x,y,z),(-x,y,z)]
    fs=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    o=ep.mesh(name,vs,fs,mat,coll,collision);o.location=loc;return o


def marker(name,loc,coll):
    o=bpy.data.objects.new(name,None);coll.objects.link(o);o.location=loc;o.empty_display_type='CIRCLE';o.empty_display_size=5;return o


def beam(name,a,b,width,mat,coll):
    a,b=Vector(a),Vector(b);o=box(name,(a+b)/2,(width,width,(b-a).length),mat,coll,False)
    o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o


def cache_templates():
    for kind,root in KIT.items():
        parts=[]
        for o in root.children_recursive:
            if o.type!='MESH':continue
            transform=o.matrix_parent_inverse@o.matrix_basis;parent=o.parent
            while parent!=root:
                assert parent is not None,o.name
                transform=parent.matrix_parent_inverse@parent.matrix_basis@transform;parent=parent.parent
            parts.append((o.data,o.name,transform))
        TEMPLATES[kind]=parts


def kit(kind,x,y,coll,angle=0,z=None,scale=1):
    COUNTS[kind]=COUNTS.get(kind,0)+1
    root=marker(f'{kind}.{COUNTS[kind]:03}',(x,y,L.height(x,y)+.08 if z is None else z),coll)
    root.rotation_euler.z=angle;root.scale=(scale,scale,scale);root['reused_source']=kind
    for data,name,transform in TEMPLATES[kind]:
        o=bpy.data.objects.new(root.name+'.'+name,data);coll.objects.link(o);o.parent=root
        o.matrix_basis=transform;o['template_part']=name;o['reused_source']=kind;o['collision']=kind in ['House','Ger'] or kind.startswith('Apartment')
    return root


def road(name,ps,width,mat='asphalt',coll=None):
    coll=coll or COL['roads'];verts=[];faces=[];dist=0
    for a,b in zip(ps,ps[1:]):
        length=math.dist(a,b);n=max(1,math.ceil(length/12));nx=-(b[1]-a[1])/length;ny=(b[0]-a[0])/length
        start=len(verts)
        for i in range(n+1):
            t=i/n;x=a[0]+(b[0]-a[0])*t;y=a[1]+(b[1]-a[1])*t
            for side in [-1,1]:
                xx=x+side*nx*width/2;yy=y+side*ny*width/2
                verts.append((xx,yy,L.height(xx,yy)+.19))
        for i in range(n):
            k=start+2*i;faces.append((k,k+1,k+3,k+2))
    o=ep.mesh(name,verts,faces,mat,coll,False);o['width_m']=width;o['centerline_json']=json.dumps(ps);return o


def footprint(name,x,y,w,d,coll):
    BUILDINGS.append({'name':name,'x':x,'y':y,'w':w,'d':d})
    z=L.height(x,y)+.08
    o=box(name+'.Foundation',(x,y,z-.4),(w,d,.8),'concrete',coll);o['building_footprint']=True
    return z


def institution(id,w=None,d=None,floors=2,mat='plaster'):
    r=L.LOCATIONS[id];x=float(r['x_m_east']);y=float(r['y_m_north']);w=w or float(r['placeholder_width_m']);d=d or float(r['placeholder_depth_m'])
    c=COL['institutions'];z=footprint(id,x,y,w,d,c);h=floors*3.1
    box(id+'.Shell',(x,y,z+h/2),(w,d,h),mat,c)
    box(id+'.Plinth',(x,y,z+.4),(w+.1,d+.1,.8),'concrete',c)
    box(id+'.Roof',(x,y,z+h+.16),(w+.6,d+.6,.32),'metal',c)
    for f in range(floors):
        for dx in range(3,int(w)-2,4):
            xx=x-w/2+dx
            if f==0 and abs(xx-x)<2:continue
            box(id+'.Window',(xx,y-d/2-.045,z+f*3.1+1.8),(1.45,.10,1.6),'blue',c,False)
            box(id+'.WindowSill',(xx,y-d/2-.14,z+f*3.1+.98),(1.65,.25,.10),'concrete',c,False)
            box(id+'.RearWindow',(xx,y+d/2+.045,z+f*3.1+1.8),(1.45,.10,1.6),'blue',c,False)
    box(id+'.Door',(x,y-d/2-.08,z+1.1),(1.8,.16,2.2),'dark',c,False)
    box(id+'.Canopy',(x,y-d/2-.85,z+2.5),(3.8,1.8,.16),'metal',c)
    box(id+'.EntryPad',(x,y-d/2-1.1,z+.035),(4,2.3,.07),'concrete',c,False)
    label=ep.label(id+'.Sign',r['mongolian_name'],(x,y-d/2-.16,z+2.7),.48,c,mat='cream')
    return x,y,z,w,d,h


def start():
    assert 'NARAN_City' not in bpy.data.scenes, 'Use the native file for edits; do not overwrite the authored city.'
    assert not (ROOT/'Naran-City-Master.blend').exists(), 'Master already exists; open it for edits instead of replacing it.'
    s=ep.scene('NARAN_City');s['scope']='Full-size fictional Naran / spatial development / Episode 1 priority'
    s['source']='Naran World Bible v1.0 and naran_locations.csv';s['town_frame_m']=[3300,3000]
    for key,title in [('terrain','01 TERRAIN'),('roads','02 CONNECTED STREETS'),('institutions','03 INSTITUTION EXTERIORS'),('apartments','04 APARTMENT NEIGHBORHOOD'),('ger','05 GER AND HOUSEHOLDS'),('infill','06 TOWN INFILL'),('industry','07 INDUSTRY AND RAIL'),('detail','08 EPISODE 1 STREET DETAIL'),('network','09 POWER AND HEAT NETWORKS'),('tech','90 LOCATION AND ROUTE ANCHORS'),('annotation','91 PLAN LABELS'),('templates','99 REUSED ASSET TEMPLATES')]:COL[key]=ep.collection('NARAN | '+title)
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'source/existing-map-kit.glb'))
    imported=set(bpy.data.objects)-before
    for o in imported:
        for c in list(o.users_collection):c.objects.unlink(o)
        COL['templates'].objects.link(o)
        if o.name.startswith('Kit.'):KIT[o.name.removeprefix('Kit.')]=o
    bpy.context.view_layer.update();assert len(KIT)==17,sorted(KIT)
    cache_templates()
    COL['templates'].hide_render=True;COL['templates'].hide_viewport=True
    for id,r in L.LOCATIONS.items():
        x=float(r['x_m_east']);y=float(r['y_m_north'])
        o=marker('LOC.'+id,(x,y,L.height(x,y)),COL['tech']);o['english_name']=r['english_name'];o['episodes']=r['episode_appearance']
    frame=marker('TownFrame.3300x3000',(0,0,0),COL['tech']);frame['bounds_xy']=list(L.BOUNDS)
    for ix in range(22):
        for iy in range(20):
            vs=[];fs=[]
            for j in range(9):
                for i in range(9):
                    x=-1650+(ix+i/8)*150;y=-1500+(iy+j/8)*150;vs.append((x,y,L.height(x,y)))
            for j in range(8):
                for i in range(8):
                    k=j*9+i;fs.append((k,k+1,k+10,k+9))
            ep.mesh(f'Terrain.{ix:02}.{iy:02}',vs,fs,'earth',COL['terrain'],False)
    for name,width,ps in L.ROADS:
        road('Shoulder.'+name,ps,width+2.4,'concrete');road('Road.'+name,ps,width)
        bpy.data.objects['Shoulder.'+name].location.z=-.05
    for i,p in enumerate(L.ARRIVAL):marker(f'EP01.Arrival.{i:02}',(*p,L.height(*p)+.3),COL['tech'])
    marker('EP01.Dropoff',(420,-390,L.height(420,-390)+.2),COL['tech'])
    road('EP01.EntryWalk',L.FOOT_ENTRY,3,'concrete',COL['detail'])
    s['collection_names_json']=json.dumps({k:c.name for k,c in COL.items()})
    return {'scene':s.name,'kit_assets':len(KIT),'road_alignments':len(L.ROADS),'terrain_tiles':440}


def landmarks():
    for id,floors in [('N02',2),('N03',1),('N04',3),('N05',2),('N07',3),('N08',1),('N09',2),('N20',1)]:institution(id,floors=floors)
    # Public square and market remain open spaces rather than solid placeholder blocks.
    z=L.height(0,0)+.08;box('N01.Square',(0,0,z),(72,64,.16),'concrete',COL['institutions'],False)
    for x in [-25,25]:
        for y in [-20,20]:kit('Bench',x,y,COL['institutions'])
    pole=ep.cyl('N01.Flagpole',(22,18,L.height(22,18)+6),.09,12,'metal',COL['institutions'])
    for i,mat in enumerate(['red','blue','red']):box('N01.Flag',(22.45+i*.65,18,L.height(22,18)+10.4),(.65,.025,1.25),mat,COL['institutions'],False)
    # All large compounds retain their source extent and registered center.
    for id in ['N06','N10','N13','N14','N15']:
        r=L.LOCATIONS[id];x=float(r['x_m_east']);y=float(r['y_m_north']);w=float(r['placeholder_width_m']);d=float(r['placeholder_depth_m'])
        box(id+'.YardPad',(x,y,L.height(x,y)-.08),(w,d,.16),'concrete',COL['industry'],False)
    x,y,z,w,d,h=institution('N06',w=64,d=36,floors=4,mat='rust')
    for dx in [-30,30]:
        ep.cyl('N06.Chimney',(x+dx,y+25,z+29),3.1,58,'rust',COL['industry'],12)
        for zz in [18,36,52]:ep.cyl('N06.StackBand',(x+dx,y+25,z+zz),3.18,1.2,'cream',COL['industry'],12)
    for i in range(8):box('N06.CoalBay',(1290+i*10,725,z+.65),(7,9,1.3),'dark',COL['industry'])
    institution('N15',floors=2,mat='rust')
    for dx in [-27,-9,9,27]:ep.cyl('N15.GrainSilo',(710+dx,985,L.height(710+dx,985)+8),6,16,'metal',COL['industry'],12)
    institution('N13',w=100,d=28,floors=1,mat='blue')
    for dx in range(-40,41,20):box('N13.GarageBay',(-330+dx,-574.1,L.height(-330,-560)+1.6),(6,.1,3.1),'dark',COL['industry'],False)
    for dx in [-30,0,30]:ep.cyl('N14.FuelTank',(945+dx,-400,L.height(945+dx,-400)+3),3,12,'metal',COL['industry'],12,(0,math.pi/2,0))
    for i in range(24):
        x=-320+(i%8)*12;y=-62+(i//8)*12;kit('Stall',x,y,COL['institutions'],math.pi)
    for x in [-310,-280,-250]:kit('Car',x,-101,COL['institutions'])
    # Four-floor Ganaa exterior and surrounding 3–5-floor blocks reuse the map kit.
    apartments=[(420,-370),(235,-340),(305,-340),(375,-340),(475,-340),(235,-430),(315,-430),(395,-430),(475,-430),(235,-495),(315,-495),(395,-495),(475,-495)]
    for i,(x,y) in enumerate(apartments):
        footprint('N12' if i==0 else f'Apartment.{i:02}',x,y,46,18,COL['apartments'])
        o=kit('Apartment',x,y,COL['apartments']);o['location_id']='N12' if i==0 else 'N11'
        shade_apartment(o,i)
        if i==0:o.name='N12.GanaaExterior';o['interior_reference']='assets/maps/episode-1/EP01-Map.blend / EP01_Apartment; floor alignment pending'
    for x,y in [(235,-375),(315,-375),(395,-375),(475,-375),(235,-450),(315,-450),(395,-450),(475,-450)]:kit('Bench',x,y,COL['detail'])
    for x in [210,505]:kit('Dumpster',x,-400,COL['detail'])
    for x in [280,355,435]:kit('Car',x,-397,COL['detail'])
    # North rail margin is distinct from the Episode 1 Ulan-Ude yard.
    for dy in [-4,4]:
        for offset in [-.76,.76]:box('N16.Rail',(90,1070+dy+offset,L.height(90,1070)+.25),(500,.075,.14),'metal',COL['industry'],False)
        for x in range(-155,340,3):box('N16.Sleeper',(x,1070+dy,L.height(x,1070)+.11),(.23,2.25,.16),'wood',COL['industry'],False)
    box('N16.CrossingDeck',(-40,1070,L.height(-40,1070)+.17),(7.5,15,.16),'wood',COL['industry'],False)
    for i in range(4):
        x=80+i*35;z=L.height(x,1070)+1.8;box('N16.FreightWagon',(x,1074,z),(12,2.8,3),'rust',COL['industry'])
    # Gate signs mark a local exit, not the regional checkpoint thirteen km away.
    for id,label in [('N18','НАРАН'),('N19','НАРАН')]:
        r=L.LOCATIONS[id];x=float(r['x_m_east']);y=float(r['y_m_north']);z=L.height(x,y)
        for dx in [-5,5]:box(id+'.Post',(x+dx,y,z+3.5),(.25,.25,7),'concrete',COL['detail'])
        box(id+'.SignBoard',(x,y,z+6.5),(10.5,.3,1.1),'blue',COL['detail'],False)
        ep.label(id+'.Lettering',label,(x,y-.18,z+6.1),.8,COL['detail'])
    access_details()
    courtyard_detail()
    return {'landmark_anchors':20,'apartment_blocks':len(apartments),'institution_footprints':len(BUILDINGS)}


def shade_apartment(root,index):
    tints=[(1,.97,.91,1),(.82,.9,.96,1),(.9,.94,.84,1),(1,.89,.82,1)]
    for o in COL['apartments'].objects:
        if o.parent!=root or o.type!='MESH':continue
        spans=[max(v.co[k] for v in o.data.vertices)-min(v.co[k] for v in o.data.vertices) for k in range(3)]
        if spans[0]<42 or spans[1]<12 or spans[2]<10:continue
        o.data=o.data.copy();m=o.data.materials[0].copy();m.name=f'Naran.Facade.{index:02}';o.data.materials[0]=m
        bs=m.node_tree.nodes.get('Principled BSDF');socket=bs.inputs['Base Color'];tint=tints[index%4]
        if socket.is_linked:
            original=socket.links[0].from_socket;mix=m.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=tint
            m.node_tree.links.new(original,mix.inputs[1]);m.node_tree.links.new(mix.outputs[0],socket)
        else:socket.default_value=tuple(socket.default_value[k]*tint[k] for k in range(4))


def courtyard_detail():
    c=COL['detail']
    for o in list(COL['apartments'].objects):
        if o.type!='EMPTY' or o.get('reused_source')!='Apartment':continue
        x,y=o.location.x,o.location.y;_,q,width=L.nearest_road(x,y-10)
        road('Apartment.FrontWalk',[(x,y-9.5),(x,q[1])],2.4,'concrete',c)
        road('Apartment.FrontApron',[(x-21,y-10),(x+21,y-10)],2.8,'concrete',c)
    for x in [450,459]:
        z=L.height(x,-365);box('N12.DryingPost',(x,-365,z+1.25),(.08,.08,2.5),'metal',c,False)
    beam('N12.DryingLine',(450,-365,L.height(450,-365)+2.3),(459,-365,L.height(459,-365)+2.3),.012,'dark',c)
    for i,mat in enumerate(['cloth','blue','cloth','red']):box('N12.DryingCloth',(451+i*1.8,-365,L.height(451,-365)+1.6),(1.1,.025,1.2),mat,c,False)
    z=L.height(427,-386)
    for dx in [-1,1]:box('N12.NoticePost',(427+dx,-386,z+1),(.08,.08,2),'wood',c,False)
    box('N12.NoticeBoard',(427,-386,z+1.65),(2.6,.12,.9),'blue',c,False)
    ep.label('N12.Address','НАРАН · 12',(427,-386.08,z+1.54),.19,c)
    for x,y in [(402,-384),(444,-383)]:
        kit('Barrel',x,y,c);kit('Crate',x+1,y+.4,c)
    cam=ep.camera('Naran.GanaaEntrance',(402,-408,3.8),(420,-371,2.7),38);cam.data.clip_end=12000


def access_details():
    c=COL['institutions']
    for id,face,end in [('N07','north',(-720,-202)),('N08','north',(-760,-340)),('N05','east',(880,350))]:
        r=L.LOCATIONS[id];x=float(r['x_m_east']);y=float(r['y_m_north']);w=float(r['placeholder_width_m']);d=float(r['placeholder_depth_m']);z=L.height(x,y)+.08
        if face=='north':
            box(id+'.NorthDoor',(x,y+d/2+.08,z+1.1),(1.8,.16,2.2),'dark',c,False)
            road(id+'.AccessWalk',[(x,y+d/2+.15),end],2.2,'concrete',COL['detail'])
        else:
            box(id+'.EastDoor',(x+w/2+.08,y,z+1.1),(.16,1.8,2.2),'dark',c,False)
            road(id+'.AccessWalk',[(x+w/2+.15,y),end],2.2,'concrete',COL['detail'])


def resume():
    s=bpy.data.scenes['NARAN_City'];bpy.context.window.scene=s
    COL.update({k:bpy.data.collections[v] for k,v in json.loads(s['collection_names_json']).items()})
    KIT.update({o.name.removeprefix('Kit.'):o for o in COL['templates'].objects if o.name.startswith('Kit.')})
    BUILDINGS.extend(json.loads(s.get('building_footprints_json','[]')))
    COUNTS.update(json.loads(s.get('reuse_counts_json','{}')))
    cache_templates()


def free_plot(x,y,w=18,d=18):
    if L.road_distance(x,y)<math.hypot(w,d)/2+1:return False
    reserved=BUILDINGS.copy()
    for id in ['N01','N06','N10','N13','N14','N15']:
        r=L.LOCATIONS[id];reserved.append({'x':float(r['x_m_east']),'y':float(r['y_m_north']),'w':max(80,float(r['placeholder_width_m'])),'d':max(65,float(r['placeholder_depth_m']))})
    return not any(abs(x-b['x'])<(w+b['w'])/2+3 and abs(y-b['y'])<(d+b['d'])/2+3 for b in reserved)


def household(x,y,angle,house=False):
    c=COL['ger'] if x<-950 and y<-400 else COL['infill']
    if c==COL['infill']:
        distance,point,width=L.nearest_road(x,y);angle=math.atan2(point[0]-x,-(point[1]-y))
    z=L.height(x,y)+.08
    root=marker('Household',(x,y,z),c);root.rotation_euler.z=angle;root['household']=True
    # Shared source meshes are linked; each yard remains individually editable.
    def placed(kind,dx,dy,rot=0):
        xx=x+dx*math.cos(angle)-dy*math.sin(angle);yy=y+dx*math.sin(angle)+dy*math.cos(angle)
        return kit(kind,xx,yy,c,angle+rot,z=z)
    placed('House' if house else 'Ger',0,1)
    for dx in [-7,7]:placed('Fence',dx,0,math.pi/2)
    placed('Fence',0,7)
    for dx in [-4.3,4.3]:placed('Fence',dx,-7).scale.x=5.4/14
    placed('Gate',0,-7)
    if c==COL['infill']:
        road('Household.AccessWalk',[(x+math.sin(angle)*7.2,y-math.cos(angle)*7.2),(point[0]+(x-point[0])*(width/2+1.2)/distance,point[1]+(y-point[1])*(width/2+1.2)/distance)],1.2,'concrete',COL['detail'])
    placed('Barrel',5,-3);placed('Crate',-5,-4)
    for i in range(3):
        xx=x+(-4+i*.7)*math.cos(angle)-4.8*math.sin(angle);yy=y+(-4+i*.7)*math.sin(angle)+4.8*math.cos(angle)
        box('Household.Fuel',(xx,yy,z+.28),(.55,.8,.5),'wood',c,False)
    BUILDINGS.append({'name':'Household','x':x,'y':y,'w':20,'d':20})
    return root


def housing():
    rng=random.Random(19981128);ger_count=urban_count=0
    for x in range(-1390,-970,22):
        for y in range(-815,-480,22):
            xx=x+rng.uniform(-1.3,1.3);yy=y+rng.uniform(-1.3,1.3)
            if free_plot(xx,yy,20,20):household(xx,yy,0,house=(ger_count%4==0));ger_count+=1
    for name,width,ps in L.ROADS[:4]:
        for a,b in zip(ps,ps[1:]):
            length=math.dist(a,b);dx=(b[0]-a[0])/length;dy=(b[1]-a[1])/length
            for i in range(1,math.ceil(length/34)):
                t=i*34/length
                if t>=1:continue
                px=a[0]+(b[0]-a[0])*t;py=a[1]+(b[1]-a[1])*t
                if not (-1050<px<900 and -700<py<650):continue
                for side in [-1,1]:
                    off=23+rng.uniform(-2,3);x=px-dy*side*off;y=py+dx*side*off
                    if not free_plot(x,y,20,20):continue
                    household(x,y,math.atan2(dy*side,dx*side),house=True);urban_count+=1
    # Shared courtyard play equipment, with gaps between apartment blocks.
    c=COL['detail'];x=275;y=-420;z=L.height(x,y)+.1
    box('Courtyard.Sandbox',(x,y,z+.12),(4,3,.24),'wood',c)
    box('Courtyard.Sand',(x,y,z+.25),(3.6,2.6,.02),'earth',c,False)
    for dx in [-3,3]:
        for dy in [-1,1]:beam('Courtyard.SwingLeg',(x+dx,y+6+dy,z),(x+dx,y+6,z+2.8),.08,'metal',c)
    beam('Courtyard.SwingTop',(x-3,y+6,z+2.8),(x+3,y+6,z+2.8),.1,'blue',c)
    for dx in [-1.4,1.4]:
        box('Courtyard.SwingSeat',(x+dx,y+6,z+.55),(.7,.3,.06),'wood',c,False)
        for sx in [-.3,.3]:beam('Courtyard.SwingChain',(x+dx+sx,y+6,z+.55),(x+dx+sx,y+6,z+2.8),.015,'metal',c)
    for x,y,angle in [(-46,1090,math.pi),(440,-402,0),(-295,-125,0)]:kit('BusStop',x,y,c,angle)
    for x,y in [(-1130,-575),(-1320,-750),(-1020,-490)]:kit('WaterKiosk',x,y,c)
    # Correct west gate orientation to span its east-west road.
    center=Vector((-1300,-210,0));rot=Matrix.Rotation(math.pi/2+.1,3,'Z')
    for o in c.objects:
        if o.name.startswith('N18.'):
            o.location=center+rot@(o.location-center);o.rotation_euler.z+=math.pi/2+.1
    # The north-facing arrival sees the lettering from outside town.
    o=bpy.data.objects['N19.Lettering'];o.location.y+=.36;o.rotation_euler.z=math.pi
    # Rail surfaces follow the same sampled terrain rather than a flat floating beam.
    for o in list(COL['industry'].objects):
        if o.name.startswith('N16.Rail'):bpy.data.objects.remove(o,do_unlink=True)
    for dy in [-4,4]:
        for offset in [-.76,.76]:road('N16.RailCap',[(-160,1070+dy+offset),(340,1070+dy+offset)],.075,'metal',COL['industry'])
    # Keep the route's concrete footway flush with the reused entrance pad.
    o=bpy.data.objects.get('EP01.EntryWalk')
    if o:bpy.data.objects.remove(o,do_unlink=True)
    road('EP01.EntryWalk',L.FOOT_ENTRY,3,'concrete',COL['detail'])
    bpy.context.scene['household_counts_json']=json.dumps({'ger_district':ger_count,'urban_street_houses':urban_count})
    return {'ger_district_households':ger_count,'urban_street_households':urban_count}


def wire(a,b,c):
    ps=[]
    for i in range(7):
        t=i/6;ps.append((a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t-.65*math.sin(math.pi*t)))
    for p,q in zip(ps,ps[1:]):beam('Power.ConnectedWire',p,q,.018,'dark',c)


def power_line(width,ps,c):
    chain=[]
    for a,b in zip(ps,ps[1:]):
        length=math.dist(a,b);n=max(1,math.ceil(length/60));nx=-(b[1]-a[1])/length;ny=(b[0]-a[0])/length
        for i in range(n):
            t=(i+.5)/n;x=a[0]+(b[0]-a[0])*t+nx*(width/2+2.5);y=a[1]+(b[1]-a[1])*t+ny*(width/2+2.5)
            if L.road_distance(x,y)<1.5 or min(math.dist((x,y),(-40,1180)),math.dist((x,y),(-1300,-210)))<12:continue
            z=L.height(x,y)+.08;kit('Pole',x,y,c,z=z);chain.append((x,y,z+9.45))
    for a,b in zip(chain,chain[1:]):wire(a,b,c)
    return len(chain),max(0,len(chain)-1)


def networks_and_landscape():
    c=COL['network'];pole_count=0;wire_spans=0
    for _,width,ps in [L.ROADS[i] for i in [0,1,2,22,23,26]]:
        poles,spans=power_line(width,ps,c);pole_count+=poles;wire_spans+=spans
    heating=[(1330,755),(1330,700),(1250,670),(1100,600),(960,500),(920,430),(900,350),(810,350),(810,250),(670,80),(620,-260),(520,-320),(420,-320),(420,-362)]
    for a,b in zip(heating,heating[1:]):
        pa=(*a,L.height(*a)-1);pb=(*b,L.height(*b)-1)
        o=beam('Heat.BuriedMain',pa,pb,.35,'rust',c);o['buried']=True
    for x,y in [(1330,755),(960,470),(810,300),(420,-362)]:
        beam('Heat.Riser',(x,y,L.height(x,y)-1),(x,y,L.height(x,y)+1.2),.35,'rust',c)
        box('Heat.InspectionCover',(x+1,y,L.height(x,y)+.04),(1.2,1.2,.08),'metal',c,False)
    rng=random.Random(217)
    # A backdrop extends the actual terrain beyond the production frame.
    for ix in range(-9,9):
        for iy in range(-8,8):
            x0=ix*300;y0=iy*300
            if -1650<=x0 and x0+300<=1650 and -1500<=y0 and y0+300<=1500:continue
            vs=[];fs=[]
            for j in range(5):
                for i in range(5):
                    x=x0+i*75;y=y0+j*75;vs.append((x,y,L.height(x,y)-.08))
            for j in range(4):
                for i in range(4):
                    k=j*5+i;cx=x0+(i+.5)*75;cy=y0+(j+.5)*75
                    if not (-1650<cx<1650 and -1500<cy<1500):fs.append((k,k+1,k+6,k+5))
            ep.mesh('Horizon.Terrain',vs,fs,'earth',COL['terrain'],False)
    def larch(x,y,h):
        z=L.height(x,y);box('Larch.Trunk',(x,y,z+h*.45),(.16,.16,h*.9),'wood',COL['detail'],False)
        for j in range(3):
            r=h*(.22-j*.035);zz=z+h*(.4+j*.17);vs=[(x,y,zz+h*.4)]
            vs.extend((x+math.cos(i*math.tau/7)*r,y+math.sin(i*math.tau/7)*r,zz) for i in range(7))
            ep.mesh('Larch.Crown',vs,[(0,i+1,(i+1)%7+1) for i in range(7)]+[tuple(range(7,0,-1))],'grass',COL['detail'],False)
    for i in range(135):
        x=rng.choice([-1,1])*rng.uniform(1470,2250);y=rng.uniform(650,1900)
        if L.road_distance(x,y)>14:larch(x,y,rng.uniform(5.5,11))
    for i in range(28):
        x=rng.choice([-1,1])*rng.uniform(1450,2150);y=rng.uniform(-1200,1500)
        if L.road_distance(x,y)>16:kit('Rock',x,y,COL['detail'],rng.uniform(0,math.tau),scale=rng.uniform(1,3))
    for x,y in [(260,-405),(290,-405),(355,-405),(440,-410),(490,-410),(205,-355),(510,-355)]:larch(x,y,6)
    # Sparse sheltered frost is a local condition; the base town remains intact Day 0.
    for i in range(36):
        x=rng.uniform(-1400,1400);y=rng.uniform(-1100,1100)
        if L.road_distance(x,y)<12:continue
        z=L.height(x,y)+.03;vs=[(x,y,z)]
        vs.extend((x+math.cos(k*math.tau/8)*rng.uniform(2,4),y+math.sin(k*math.tau/8)*rng.uniform(4,8),z) for k in range(8))
        ep.mesh('Weather.ShelteredFrost',vs,[(0,k+1,(k+1)%8+1) for k in range(8)],'frost',COL['detail'],False)
    return {'power_poles':pole_count,'connected_wire_spans':wire_spans,'heating_main_m':sum(math.dist(a,b) for a,b in zip(heating,heating[1:]))}


def presentation():
    s=bpy.context.scene;s.render.resolution_x=1600;s.render.resolution_y=1000;s.view_settings.exposure=.65
    ep.daylight();s.world.node_tree.nodes['Background'].inputs[1].default_value=.55
    cams=[('Naran.Overview',(2500,-3100,2350),(0,50,0),46,4600),('Naran.Apartment',(595,-660,150),(355,-410,3),44,None),('Naran.Arrival',(-220,1260,80),(80,340,4),44,None),('Naran.GerDistrict',(-1530,-1000,155),(-1200,-650,1),43,None),('Naran.Plan',(0,0,4500),(0,0,0),40,3700)]
    for name,pos,target,lens,ortho in cams:
        cam=ep.camera(name,pos,target,lens,ortho);cam.data.clip_end=12000
    s.camera=bpy.data.objects['Naran.Apartment']
    COL['annotation'].hide_render=True;COL['annotation'].hide_viewport=True
    for id,r in L.LOCATIONS.items():
        x=float(r['x_m_east']);y=float(r['y_m_north'])
        ep.label('Plan.'+id,id+'  '+r['english_name'],(x,y-35,L.height(x,y)+25),34,COL['annotation'],rot=(0,0,0))
    ep.label('Plan.North','N ↑',(1470,1300,20),60,COL['annotation'],rot=(0,0,0))
    ep.label('Plan.Scale','500 m',(-1150,-1370,20),32,COL['annotation'],rot=(0,0,0))
    box('Plan.500mScale',(-1150,-1320,20),(500,6,1),'cream',COL['annotation'],False)
    s['building_footprints_json']=json.dumps(BUILDINGS);s['reuse_counts_json']=json.dumps(COUNTS)
    s['arrival_route_json']=json.dumps(L.ARRIVAL);s['phase']='Spatial development; Episode 1 priority; no final shot approval'
    for image in bpy.data.images:
        if image.source=='FILE' and image.users and not image.packed_file:image.pack()
    (ROOT/'previews').mkdir(exist_ok=True)
    # Write only this scene and its dependencies; the Episode 1 source stays intact.
    bpy.data.libraries.write(str(ROOT/'Naran-City-Master.blend'),{s},fake_user=True,compress=True)
    return {'source':str(ROOT/'Naran-City-Master.blend'),'reuse_counts':COUNTS,'objects':len(s.objects)}
