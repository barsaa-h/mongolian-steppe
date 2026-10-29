"""Develop the existing town in a separate version. Run stages geography/details in Blender."""
from pathlib import Path
import bpy,math,json,random,sys,importlib.util,time
import numpy as np
from mathutils import Vector,Matrix,Euler
OUT=Path(__file__).resolve().parent;BASE=OUT.parent

def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
R=load('realism_layout',OUT/'realism_layout.py')
A=load('realism_author_helpers',BASE/'author_naran.py');A.resume();A.ep.ROOT=OUT
S=bpy.context.scene
C={};M={};BATCH={};MODELS={};OBSTACLES=[];BUSINESS=[];PARCELS=[];CATALOG=[]
COLORS={'wood':(.29,.20,.125),'weatheredwood':(.32,.30,.255),'bluepaint':(.18,.25,.27),'metal':(.28,.29,.275),'rust':(.32,.225,.155),'coal':(.065,.062,.055),'cream':(.61,.58,.48),'glass':(.17,.23,.24),'hay':(.43,.36,.20),'rubber':(.07,.073,.068),'brick':(.35,.23,.16),'plaster':(.47,.455,.40),'redpaint':(.30,.16,.12),'gravel':(.285,.27,.235),'dirt':(.25,.225,.18),'oldasphalt':(.185,.185,.175),'repair':(.21,.205,.18),'frost':(.60,.62,.59),'deadgrass':(.40,.37,.26),'stain':(.255,.25,.22)}


def collection(key):
    name='REALISM | '+key
    if name not in bpy.data.collections:c=bpy.data.collections.new(name);S.collection.children.link(c)
    C[key]=bpy.data.collections[name];return C[key]


def material(name):
    if name in M:return M[name]
    key='Naran.Realism.'+name
    # The palette uses display sRGB, like the painted atlas; shader colors are linear.
    rgba=tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in COLORS[name])+(1,)
    m=bpy.data.materials.get(key) or bpy.data.materials.new(key);m.use_nodes=True;m.diffuse_color=rgba
    bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=rgba;bs.inputs['Roughness'].default_value=.95;bs.inputs['Specular IOR Level'].default_value=.08
    M[name]=m;return m


def geometry_part(part):
    w,d,h=part['size'];x,y,z=w/2,d/2,h/2;op=part['op']
    if op=='box':
        vs=[(-x,-y,-z),(x,-y,-z),(x,y,-z),(-x,y,-z),(-x,-y,z),(x,-y,z),(x,y,z),(-x,y,z)];fs=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    elif op=='roof':
        vs=[(-x,-y,-z),(x,-y,-z),(x,y,-z),(-x,y,-z),(-x,0,z),(x,0,z)];fs=[(0,1,5,4),(4,5,2,3),(0,4,3),(1,2,5),(0,3,2,1)]
    else:
        assert op=='cylinder';n=10;vs=[(x*math.cos(i*math.tau/n),y*math.sin(i*math.tau/n),zz) for zz in [-z,z] for i in range(n)];fs=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    rot=Euler(part.get('rotation',(0,0,part.get('rot',0)))).to_matrix();pos=Vector(part['pos'])
    return [rot@Vector(v)+pos for v in vs],fs


def batch(name,pos,size,mat,coll,angle=0,op='box',rotation=None):
    part={'op':op,'pos':pos,'size':size,'rot':angle}
    if rotation:part['rotation']=rotation
    vs,fs=geometry_part(part);key=(coll.name,mat,name);buff=BATCH.setdefault(key,[[],[]]);n=len(buff[0]);buff[0].extend(vs);buff[1].extend(tuple(n+i for i in face) for face in fs)


def flush():
    for (coll,mat,name),(vs,fs) in BATCH.items():
        me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new('R.'+name,me);bpy.data.collections[coll].objects.link(o);me.materials.append(material(mat));o['purpose']=name;o['development_layer']='S0'
    BATCH.clear()


def model_library():
    library=load('realism_prop_library',OUT/'prop_library.py');c=collection('99 NEW MODULE LIBRARY');c.hide_render=True;c.hide_viewport=True
    for name,parts in library.models().items():
        verts=[];faces=[];indices=[];mats=[]
        for part in parts:
            vs,fs=geometry_part(part);n=len(verts);verts.extend(vs);faces.extend(tuple(n+i for i in face) for face in fs)
            if part['mat'] not in mats:mats.append(part['mat'])
            indices.extend([mats.index(part['mat'])]*len(fs))
        me=bpy.data.meshes.new('Module.'+name);me.from_pydata(verts,[],faces);me.update()
        for mat in mats:me.materials.append(material(mat))
        for face,idx in zip(me.polygons,indices):face.material_index=idx
        o=bpy.data.objects.new('Module.'+name,me);c.objects.link(o);MODELS[name]=me
        CATALOG.append({'variant':name,'source':'new procedural module','parts':len(parts),'triangles':sum(len(p.vertices)-2 for p in me.polygons),'shared_mesh':me.name})


def prop(kind,x,y,c,angle=0,z=None):
    o=bpy.data.objects.new('R.'+kind,MODELS[kind]);c.objects.link(o);o.location=(x,y,R.height(x,y)+.08 if z is None else z);o.rotation_euler.z=angle;o['variant_family']=kind;o['development_layer']='S0';return o


def line(name,points,width,mat,c,lift=.04):
    vs=[];fs=[]
    for a,b in zip(points,points[1:]):
        length=math.dist(a,b)
        if length<.01:continue
        n=max(1,math.ceil(length/5));nx=-(b[1]-a[1])/length;ny=(b[0]-a[0])/length;k=len(vs)
        for i in range(n+1):
            t=i/n;x=a[0]+(b[0]-a[0])*t;y=a[1]+(b[1]-a[1])*t
            for side in [-1,1]:
                xx=x+nx*width/2*side;yy=y+ny*width/2*side;vs.append((xx,yy,R.height(xx,yy)+lift))
        for i in range(n):q=k+2*i;fs.append((q,q+1,q+3,q+2))
    key=(c.name,mat,name);buff=BATCH.setdefault(key,[[],[]]);n=len(buff[0]);buff[0].extend(vs);buff[1].extend(tuple(n+i for i in f) for f in fs)


def local(x,y,angle,dx,dy):return x+dx*math.cos(angle)-dy*math.sin(angle),y+dx*math.sin(angle)+dy*math.cos(angle)


def text(name,body,x,y,z,size,c,angle=0):
    o=A.ep.label('R.'+name,body,(x,y,z),size,c);o.rotation_euler.z=angle;return o


def retained(objects):
    c=C.get('98 RETAINED REPLACED DETAIL') or collection('98 RETAINED REPLACED DETAIL');c.hide_render=True;c.hide_viewport=True
    for o in objects:
        for old in list(o.users_collection):old.objects.unlink(o)
        c.objects.link(o)



def landscape_geometry():
    xs=list(range(-10000,-2700,200))+list(range(-2700,2701,75))+list(range(2800,10001,200));ys=list(range(-10000,-2400,200))+list(range(-2400,2401,75))+list(range(2600,10001,200));vs=[(x,y,R.height(x,y)-.08) for y in ys for x in xs];fs=[];nx=len(xs)
    for j in range(len(ys)-1):
        for i in range(nx-1):
            if -2700<(xs[i]+xs[i+1])/2<2700 and -2400<(ys[j]+ys[j+1])/2<2400:continue
            k=j*nx+i;fs.append((k,k+1,k+1+nx,k+nx))
    return vs,fs



def bind_landscape_ground():
    o=bpy.data.objects['R.ContinuousLandscape'];ground=bpy.data.materials['Naran.Realism.ForestSteppeGround'];o.data.materials.clear();o.data.materials.append(ground)
    uv=o.data.uv_layers.active or o.data.uv_layers.new()
    for li,loop in enumerate(o.data.loops):
        co=o.data.vertices[loop.vertex_index].co;uv.data[li].uv=((co.x+2700)/5400,(co.y+2400)/4800)
    for node in ground.node_tree.nodes:
        if node.type=='TEX_IMAGE':node.extension='EXTEND'

def refresh_landscape():
    o=bpy.data.objects['R.ContinuousLandscape'];vs,fs=landscape_geometry();me=bpy.data.meshes.new('Continuous outer landscape');me.from_pydata(vs,[],fs);me.update()
    for m in o.data.materials:me.materials.append(m)
    o.data=me
    for p in me.polygons:p.use_smooth=True
    if bpy.data.materials.get('Naran.Realism.ForestSteppeGround'):bind_landscape_ground()

def geography():
    assert not S.get('realism_geography'),'Geography already authored.'
    c=collection('10 LANDSCAPE AND DRAINAGE');t=time.perf_counter()
    templates=A.COL['templates']
    for o in list(S.objects):
        if o.parent or templates in o.users_collection or o.type in ['CAMERA','LIGHT']:continue
        if o.type=='MESH' and o.location.length<.0001:
            if o.data.users>1:o.data=o.data.copy()
            for v in o.data.vertices:v.co.z+=R.height(v.co.x,v.co.y)-R.L.height(v.co.x,v.co.y)
        else:o.location.z+=R.height(o.location.x,o.location.y)-R.L.height(o.location.x,o.location.y)
    A.L.height=R.height
    # A finite, connected ground surface continues beyond all current camera horizons.
    vs,fs=landscape_geometry()
    me=bpy.data.meshes.new('Continuous outer landscape');me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new('R.ContinuousLandscape',me);c.objects.link(o);me.materials.append(material('deadgrass'))
    for p in me.polygons:p.use_smooth=True
    # Paint land use into the ground, keeping roads and uses readable without micro-noise.
    size=1024;yy,xx=np.mgrid[:size,:size];x=-2700+xx*5400/(size-1);y=-2400+yy*4800/(size-1);rng=np.random.default_rng(R.SEED)
    noise=.018*np.sin(x/170)*np.cos(y/210)+.012*np.sin(x/57+y/73)+rng.normal(0,.005,(size,size));pix=np.ones((size,size,4),dtype=np.float32)
    for k,v in enumerate([.405,.385,.335]):pix[:,:,k]=v+noise
    drainage=np.exp(-((x-(-910+100*np.sin(y/800)))/85)**2)
    for k in range(3):pix[:,:,k]-=.025*drainage
    for f in R.FIELDS:
        cx,cy=f['center'];w,d=f['size'];mask=(abs(x-cx)<w/2)&(abs(y-cy)<d/2)
        for k,v in enumerate([.36,.32,.235] if f['use']=='harvested_wheat' else [.29,.275,.245]):pix[:,:,k]=np.where(mask,v+noise,pix[:,:,k])
    nearest=np.full((size,size),1e6)
    for _,width,ps in R.L.ROADS+R.FARM_ROADS:
        for a,b in zip(ps,ps[1:]):
            dx=b[0]-a[0];dy=b[1]-a[1];tt=np.clip(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy),0,1);nearest=np.minimum(nearest,np.hypot(x-a[0]-tt*dx,y-a[1]-tt*dy)-width/2)
    compact=np.exp(-np.maximum(nearest,0)**2/60)
    for k in range(3):pix[:,:,k]-=compact*.035
    im=bpy.data.images.new('Realism ground paint',width=size,height=size,alpha=True);im.colorspace_settings.name='sRGB';im.pixels.foreach_set(np.clip(pix,0,1).ravel());(OUT/'textures').mkdir(exist_ok=True);im.filepath_raw=str(OUT/'textures/ground.png');im.file_format='PNG';im.save();packed=bpy.data.images.load(im.filepath_raw,check_existing=False);packed.name='Naran.RealismGround';packed.pack();bpy.data.images.remove(im)
    ground=bpy.data.materials['Naran.ForestSteppeGround'].copy();ground.name='Naran.Realism.ForestSteppeGround'
    for node in ground.node_tree.nodes:
        if node.type=='TEX_IMAGE':node.image=packed
    for o in A.COL['terrain'].objects:
        o.data.materials.clear();o.data.materials.append(ground)
    bind_landscape_ground()
    for name,width,ps in R.FARM_ROADS:
        A.road('Road.'+name,ps,width,'earth',A.COL['roads'])
    for o in A.COL['roads'].objects:
        if not o.name.startswith('Road.'):continue
        if not o.get('centerline_json'):retained([o]);continue
        family='dirt' if 'Ger ' in o.name or 'farm track' in o.name or 'field track' in o.name else 'oldasphalt' if any(n in o.name for n in ['North approach','West avenue','East avenue','South distributor']) else 'gravel'
        o.data.materials.clear();o.data.materials.append(material(family));o['road_family']=family
    S.world.node_tree.nodes['Background'].inputs[0].default_value=(.48,.53,.58,1);S.world.node_tree.nodes['Background'].inputs[1].default_value=.48
    for o in S.objects:
        if o.type=='LIGHT' and o.data.type=='SUN':o.rotation_euler=(1.12,-.15,-.65);o.data.energy=2.0;o.data.angle=.09
    S['realism_geography']=True;S['baseline_sha256']=json.loads((OUT/'baseline-audit.json').read_text())['sha256'];S['realism_geography_seconds']=time.perf_counter()-t
    save()


def save():
    for o in bpy.context.selected_objects:o.select_set(False)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Naran-City-Realism-v001.blend'),compress=True)


def parcels():
    c=collection('20 HOUSEHOLD LIFE');fences=collection('21 PARCEL BOUNDARIES');rng=random.Random(R.SEED)
    homes=sorted([o for o in S.objects if o.get('household')],key=lambda o:(round(o.location.y,1),round(o.location.x,1)))
    # Assign existing free-standing kit roots to their actual nearest household once.
    buckets={}
    for home in homes:buckets.setdefault((math.floor(home.location.x/25),math.floor(home.location.y/25)),[]).append(home)
    owned={h.name:[] for h in homes}
    for coll in [A.COL['ger'],A.COL['infill']]:
        for o in list(coll.objects):
            if o.type!='EMPTY' or o.get('reused_source') not in ['House','Ger','Fence','Gate','Barrel','Crate']:continue
            ix,iy=math.floor(o.location.x/25),math.floor(o.location.y/25);near=[h for a in range(ix-1,ix+2) for b in range(iy-1,iy+2) for h in buckets.get((a,b),[])]
            if not near:continue
            home=min(near,key=lambda h:(h.location-o.location).length)
            if math.hypot(home.location.x-o.location.x,home.location.y-o.location.y)<11:owned[home.name].append(o)
    hide=[o for coll in [A.COL['ger'],A.COL['infill'],A.COL['detail']] for o in coll.objects if o.name.startswith(('Household.Fuel','Household.AccessWalk','Yard.CompactedSurface'))]
    retained(hide)
    for index,home in enumerate(homes):
        x,y,z=home.location
        _,front,_=R.L.nearest_road(x,y);ang=math.atan2(front[1]-y,front[0]-x)+math.pi/2
        home.rotation_euler.z=ang
        p=R.household_profile(index);w,d,skew=p['width'],p['depth'],p['skew'];family=p['family'];home['realism_family']=family;home['condition']=p['condition']
        assets=owned[home.name];dwelling=next((o for o in assets if o.get('reused_source') in ['House','Ger']),None);assert dwelling,home.name
        kind=dwelling['reused_source'];mixed=p['mixed'] and kind=='Ger'
        dx,dy=(-3.0,2.0) if mixed else (rng.uniform(-.55,.55),rng.uniform(.7,1.4))
        xx,yy=local(x,y,ang,dx,dy);dwelling.location=(xx,yy,R.height(xx,yy)+.08);dwelling.rotation_euler.z=ang
        # Fence/yard geometry changes, while the existing dwelling and its mesh remain.
        for o in assets:
            source=o['reused_source']
            if source=='Fence':retained([o,*o.children_recursive])
            if source=='Gate':
                xx,yy=local(x,y,ang,0,-d/2);o.location=(xx,yy,R.height(xx,yy)+.08);o.rotation_euler.z=ang
            if source in ['Barrel','Crate']:
                xx,yy=local(x,y,ang,3.7 if source=='Barrel' else -6.5,-6.1);o.location=(xx,yy,R.height(xx,yy)+.08)
        corners=[(-w/2,-d/2),(w/2,-d/2),(w/2+skew,d/2-.35),(-w/2+.35,d/2)]
        verts=[(*local(x,y,ang,*v),R.height(*local(x,y,ang,*v))+.035) for v in corners]
        buff=BATCH.setdefault((c.name,'dirt','Compacted household yards'),[[],[]]);n=len(buff[0]);buff[0].extend(verts);buff[1].append(tuple(n+i for i in range(4)))
        segments=[(corners[1],corners[2]),(corners[2],corners[3]),(corners[3],corners[0]),(corners[0],(-1.65,-d/2)),((1.65,-d/2),corners[1])]
        mat=['wood','weatheredwood','weatheredwood','bluepaint','wood','rust'][index%6];fheight=[1.55,1.35,1.6,1.6,1.5,1.4][index%6]
        for a,b in segments:
            pa,pb=local(x,y,ang,*a),local(x,y,ang,*b);length=math.dist(pa,pb);center=((pa[0]+pb[0])/2,(pa[1]+pb[1])/2);theta=math.atan2(pb[1]-pa[1],pb[0]-pa[0])
            if mat=='rust':batch('Household fence '+mat,(*center,R.height(*center)+fheight/2),(length,.085,fheight),mat,fences,theta)
            else:
                count=math.ceil(length/.42)
                for j in range(count):
                    t=(j+.5)/count;px=pa[0]+(pb[0]-pa[0])*t;py=pa[1]+(pb[1]-pa[1])*t
                    bh=fheight+rng.uniform(-.08,.025)*(1.5 if p['condition']=='patched' else .3)
                    batch('Timber fence boards '+mat,(px,py,R.height(px,py)+bh/2),(length/count-.016,.065,bh),mat,fences,theta)
            for j in range(max(1,math.ceil(length/2.4))+1):
                t=j/max(1,math.ceil(length/2.4));px=pa[0]+(pb[0]-pa[0])*t;py=pa[1]+(pb[1]-pa[1])*t;batch('Fence posts', (px,py,R.height(px,py)+fheight/2),(.12,.12,fheight+.16),'weatheredwood',fences,ang)
        def at(model,dx,dy,turn=0):
            xx,yy=local(x,y,ang,dx,dy);o=prop(model,xx,yy,c,ang+turn);o['household_id']=home.name;return o
        at('firewood',-5.2,-6.1);at('coal_bin',5.55,-5.9)
        at('privy',-6.0 if mixed else 6.15,d/2-1.1)
        if mixed:at('small_timber_house',3.8,3.3)
        elif p['shed']:at('shed',-4.75,d/2-1.25)
        if family=='repair_trade':at('repair_bench',0,d/2-1)
        if family in ['timber_care','brick_garden'] and index%3==0:at('bicycle',-3.0,-6.3,math.pi/2)
        if p['vegetable_plot']:
            for j in range(4):
                pts=[local(x,y,ang,-1.6+j*.6,6.5),local(x,y,ang,-1.6+j*.6,8.2)];line('Dormant vegetable beds',pts,.18,'repair',c,.06)
        gate=local(x,y,ang,0,-d/2);door=local(x,y,ang,dx+(.4 if kind=='House' else 0),dy+(-4.6 if kind=='House' else -2.65))
        line('Gate to dwelling footpaths',[gate,door],.9,'gravel',c,.05)
        distance,q,width=R.L.nearest_road(*gate);edge=(q[0]+(gate[0]-q[0])*(width/2+.4)/distance,q[1]+(gate[1]-q[1])*(width/2+.4)/distance)
        approach=[gate,*R.HOUSEHOLD_APPROACH_WAYPOINTS.get(home.name,[]),edge]
        line('Household roadside shortcuts',approach,1,'dirt',c,.065)
        PARCELS.append({'id':home.name,'family':family,'condition':p['condition'],'main_dwelling':kind,'mixed_ger_house':mixed,'polygon':[list(local(x,y,ang,*v)) for v in corners],'gate':list(gate),'door':list(door),'road_edge':list(edge),'approach':[list(p) for p in approach],'fuel':'wood and coal','sanitation':'yard privy','water':'lidded container / communal kiosk'})
    S['realism_parcel_count']=len(PARCELS)



def apartment_surface(root,index,c):
    x,y,z=root.location;kind=root['reused_source'];length={'Apartment':43,'Apartment3':38,'Apartment5':48}[kind];dep=11 if kind=='Apartment3' else 13;scale=root.scale.x
    # The retained builder uses 2.8m floors; these roof surfaces were checked in the kit triangles.
    h={'Apartment':11.22,'Apartment3':8.42,'Apartment5':14.02}[kind]
    facade=root['facade_family'];roof=root['roof_family'];treatments=[]
    for dx in [-length*.32,length*.32]:
        batch('Roof vents',(x+dx,y+1,z+h+.625),(.38,.38,1.25),'metal',c)
        batch('Vent weather caps',(x+dx,y+1,z+h+1.25),(.7,.7,.12),'rust',c)
    if roof=='flat_service':
        batch('Roof service hatches',(x-length*.25,y-2,z+h+.06),(1.3,1.2,.12),'metal',c);treatments.append('flush service hatch')
    elif roof=='vent_renewal':
        batch('Renewed roof duct covers',(x+length*.22,y-2,z+h+.22),(2.2,1.5,.44),'bluepaint',c);treatments.append('renewed duct cover')
    else:
        for dx in [-length*.23,length*.23]:batch('Roof sheet repairs',(x+dx,y+2.7,z+h+.035),(4,2.4,.035),'rust',c)
        treatments.append('two metal roof repair sheets')
    for dx in [-length*.35,length*.18]:batch('Facade plinth repairs',(x+dx,y-dep/2-.09,z+.5),(5.2,.025,.65),'cream' if facade=='cared_for' else 'plaster',c)
    if facade=='cared_for':
        for dx in [-.85,.85]:batch('Repainted entrance jambs',(x+dx,y-dep/2-.17,z+1.15),(.1,.055,2.3),'bluepaint',c)
        batch('Repainted entrance lintel',(x,y-dep/2-.17,z+2.35),(1.8,.055,.1),'bluepaint',c);treatments.append('renewed entrance trim')
    elif facade=='panel_repairs':
        for dx in [-length*.18,length*.27]:batch('Vertical panel joint repairs',(x+dx*scale,y-dep/2-.085,z+3.65),(.33,.025,5.1),'plaster',c)
        treatments.append('vertical panel-joint repairs')
    elif facade=='weather_streaks':
        for f in range(3):
            for dx in [-length*.22,length*.22]:batch('Sill runoff',(x+dx*scale,y-dep/2-.09,z+f*2.8+.43),(.3,.025,.52),'stain',c)
        treatments.append('runoff beneath six sills')
    elif facade=='partial_repaint':
        batch('Partial facade repaint',(x,y-dep/2-.11,z+.43),(length*scale,.025,.34),'bluepaint',c)
        batch('Gable repair plaster',(x+length/2*scale+.045,y+2.7,z+3.05),(.035,2.8,4.5),'cream',c);treatments.append('repainted plinth and gable patch')
    else:
        for dx in [-((length/2-2.2)/2),((length/2-2.2)/2)]:
            xx=x+dx*scale;yy=y-dep/2-.16
            for side in [-1,1]:
                batch('Repaired timber window frames',(xx+side*.69*scale,yy,z+1.55),(.065,.065,1.65),'cream',c)
                batch('Repaired timber window frames',(xx,yy,z+1.55+side*.8),(1.44*scale,.065,.065),'cream',c)
            batch('Window curtain replacements',(xx-.42*scale,yy+.015,z+1.55),(.24*scale,.02,1.46),'cream',c)
        treatments.append('two repaired timber window frames and curtains')
    root['realism_surface_treatments_json']=json.dumps(treatments)
    return treatments

def apartments():
    c=collection('30 APARTMENT COURTYARDS');roots=sorted([o for o in A.COL['apartments'].objects if o.type=='EMPTY' and o.get('reused_source','').startswith('Apartment')],key=lambda o:o.name)
    for i,root in enumerate(roots):
        x,y,z=root.location;hero=root.name=='N12.GanaaExterior';length={'Apartment':43,'Apartment3':38,'Apartment5':48}[root['reused_source']]
        if not hero:root.scale.x=[.9,1,1.05][i%3]
        root['facade_family']=['cared_for','panel_repairs','weather_streaks','partial_repaint','mixed_windows'][i%5];root['roof_family']=['flat_service','vent_renewal','patched_metal'][i%3]
        treatments=apartment_surface(root,i,c)
        # Courtyard services stay north of the body, away from the south-side arrival lane.
        sy=y+12.5
        prop('shed',x-11,sy,c);prop('bicycle',x+6,y-8.5,c,math.pi/2)
        batch('Service shelter pad',(x-11,sy,R.height(x-11,sy)+.06),(5.5,3.3,.12),'gravel',c)
        for dx in [-17,15]:
            px=x+dx;py=y-11.8
            line('Walked courtyard links',[(px,py),(x,py),(x,y-9.5)],1.2,'dirt',c,.06)
        if i%4==0:
            prop('sandpit',x+10,y+13,c);prop('climbing_frame',x+16,y+13,c)
        if i%3==0:
            # A shared rack, built for practical courtyard use.
            for dx in [-2,2]:batch('Carpet rack posts',(x+dx,y+12,z+1.25),(.08,.08,2.5),'metal',c)
            batch('Carpet rack rail',(x,y+12,z+2.5),(4.2,.08,.08),'metal',c)
        CATALOG.append({'variant':root['reused_source']+' / '+root['facade_family']+' / '+root['roof_family'],'source':'existing apartment kit with additive repairs/services','hero_preserved':hero,'location':[x,y],'treatments':treatments})
    # EP1 arrival pocket stays open; cars occupy marked shoulders, never the entry walk.
    for x,y in [(185,-447),(280,-447),(365,-447),(503,-447)]:
        car=A.kit('Car',x,y,c,angle=math.pi/2);car['purpose']='courtyard parking'
        line('Worn parking aprons',[(x-3,y),(x+3,y)],2.4,'repair',c,.07)


def road_wear_and_landscape():
    c=C['10 LANDSCAPE AND DRAINAGE'];rng=random.Random(R.SEED+70)
    for name,width,ps in R.L.ROADS+R.FARM_ROADS:
        main=name in [r[0] for r in R.L.ROADS[:4]];dirt='Ger ' in name or 'track' in name
        for a,b in zip(ps,ps[1:]):
            length=math.dist(a,b);ux=(b[0]-a[0])/length;uy=(b[1]-a[1])/length;nx=-uy;ny=ux
            for k in range(1,max(1,int(length/85))):
                t=k/max(1,int(length/85));x=a[0]+(b[0]-a[0])*t;y=a[1]+(b[1]-a[1])*t
                if main:
                    span=rng.uniform(3,8);line('Traffic asphalt patches',[(x-ux*span/2+nx*.5,y-uy*span/2+ny*.5),(x+ux*span/2+nx*.5,y+uy*span/2+ny*.5)],rng.uniform(1,2.1),'repair',c,.208)
                    if k%3==0:
                        line('Shoulder breakup',[(x+nx*(width/2-.25),y+ny*(width/2-.25)),(x+ux*6+nx*(width/2+.1),y+uy*6+ny*(width/2+.1))],.17,'dirt',c,.215)
            if dirt:
                for side in [-.73,.73]:line('Compacted wheel ruts',[(a[0]+nx*side,a[1]+ny*side),(b[0]+nx*side,b[1]+ny*side)],.21,'repair',c,.205)
            if dirt and length>25:
                side=width/2+1.5;line('Roadside drainage',[(a[0]+nx*side,a[1]+ny*side),(b[0]+nx*side,b[1]+ny*side)],.5,'stain',c,.055)
    # Drainage follows one coherent shallow swale west of town, not random depressions.
    ps=[(-910+100*math.sin(y/800),y) for y in range(-1400,1501,25)];line('Seasonal drainage bed',ps,7,'stain',c,.025)
    for y in range(-1350,1451,75):
        x=-910+100*math.sin(y/800)
        for side in [-1,1]:
            for j in range(8):
                xx=x+side*rng.uniform(7,18);yy=y+rng.uniform(-25,25);z=R.height(xx,yy)
                batch('Dry grass at drainage', (xx,yy,z+.16),(.035,.5,.32),'deadgrass',c,rng.random()*math.pi)
    # Lee-side frost is discontinuous; no imposed story blizzard or universal deep snow.
    for home in PARCELS:
        poly=home['polygon'];p=poly[2];q=poly[3]
        line('Fence lee frost',[(p[0],p[1]-.3),(q[0],q[1]-.3)],.42,'frost',c,.065)
    # Sparse northern forest-steppe at the distant hill shoulders, with bare local trees.
    for i in range(220):
        x=rng.uniform(-2900,1900);y=rng.uniform(1750,3300)
        if R.height(x,y)<30:continue
        z=R.height(x,y);h=rng.uniform(4,9)
        batch('Distant trunks',(x,y,z+h/2),(.16,.16,h),'weatheredwood',c)
        for j in range(3):batch('Sparse larch silhouette',(x,y,z+h*(.42+j*.18)),(h*(.42-j*.08),h*(.42-j*.08),h*.45),'deadgrass',c,op='roof')


def shop_shell(x,y,w,d,c,condition='ordinary',label='',id=''):
    z=R.height(x,y)+.08
    batch('Small commerce walls',(x,y,z+1.35),(w,d,2.7),'plaster',c)
    batch('Small commerce pitched roof',(x,y,z+3.05),(w+.6,d+.5,.8),'metal',c,op='roof')
    batch('Shop entrance',(x+w*.26,y-d/2-.025,z+1.05),(1.05,.06,2.1),'bluepaint',c)
    batch('Shop display glazing',(x-w*.18,y-d/2-.035,z+1.55),(w*.32,.055,1.1),'glass',c)
    batch('Shop signboard',(x,y-d/2-.08,z+2.48),(w*.8,.12,.45),'bluepaint',c)
    if label:text('Business '+id,label,x,y-d/2-.16,z+2.31,min(.36,w*.065),c)
    OBSTACLES.append({'name':id or 'shop','x':x,'y':y,'w':w+.6,'d':d+.5,'purpose':'commerce'})
    return z


def commerce_and_civic():
    c=collection('40 SHOPS AND DAILY SERVICES');retained([o for o in A.COL['detail'].objects if o.name.startswith('Market.ShopSign')])
    for index,b in enumerate(R.BUSINESSES):
        x,y=b['xy'];z=R.height(x,y)+.08;reuse=b['reuse']
        if reuse=='market':
            batch('Market identity signboards',(x,y-5.27,z+2.65),(8.5,.10,.75),'bluepaint',c)
            text('Market '+b['id'],b['label'],x,y-5.34,z+2.41,.9,c)
            batch('Shop sun hoods',(x,y-5.8,z+3.17),(11 if index%2 else 14,1.6,.11),'rust' if index==2 else 'metal',c,rotation=(.08,0,0))
            for dx in [-6,6]:batch('Old shutter panels',(x+dx,y-5.15,z+1.6),(1.45,.055,1.5),['weatheredwood','bluepaint','metal','cream'][index],c)
            prop('loading_pallet',x-6,y-7.5,c)
            if b['use']=='bread':
                for j in range(3):batch('Bread delivery crates',(x-3+j*.55,y-6.8,z+.45),(.48,.6,.9),'wood',c)
            if b['use']=='vehicle_parts':prop('repair_bench',x+5,y-7.3,c)
            access=[(x,y-5.3),(x,-118)];size=[20,10]
        elif reuse=='apartment_window':
            batch('Converted service window sign',(x,y-.035,z+2.6),(4.8,.12,.48),'bluepaint',c)
            text('Converted flat shop',b['label'],x,y-.1,z+2.43,.35,c)
            line('Shop queue footpath',[(x,y-1),(x,-445)],1.4,'gravel',c,.08);size=[4.8,1];access=[(x,y-1),(x,-445)]
        else:
            kiosk=b['use']=='kiosk';w,d=(4.2,2.8) if kiosk else (14,9)
            shop_shell(x,y,w,d,c,label=b['label'],id=b['id']);size=[w,d]
            if b['id']=='B05':
                access=[(x,y-d/2),(x,140)];prop('loading_pallet',x-9,y+1,c)
                # Side service route returns to the north lane without crossing the canteen.
                access=[(x,y-d/2),(x-9,y-d/2-2),(x-9,140)]
            elif b['id']=='B06':access=[(x,y-d/2),(x,-36),(0,-36)]
            else:access=[(x,y-d/2),(x,-131.5)]
            line('Commerce foot access',access,1.4,'gravel',c,.07)
            batch('Kiosk counter',(x-.8,y-d/2-.45,z+.9),(1.6,.65,.12),'weatheredwood',c)
        marker=A.marker('BUSINESS.'+b['id'],(x,y,z),c);marker['use']=b['use'];marker['label']=b['label'];marker['period_status']='generic artistic choice; Cyrillic review pending'
        BUSINESS.append({**b,'size':size,'access':access,'supply':'market delivery / local shop network'})
    # Goods handling and maintenance have dedicated space, not random clutter.
    prop('farm_trailer',-278,-108,c,math.pi/2);prop('loading_pallet',-263,-106,c)
    for x,y in [(-46,-23),(-296,-123),(-1130,-580),(-1320,-755),(-1020,-495)]:
        prop('water_cart',x,y,c);line('Water collection worn approach',[(x,y),(x+1,y-4)],1.3,'gravel',c,.075)
    for x,y in [(-1130,-575),(-1320,-750),(-1020,-490)]:
        z=R.height(x,y)
        batch('Water kiosk ice edge',(x+2,y-2,z+.045),(1.2,.8,.025),'frost',c)
        text('Water point','УС',x,y-1.65,z+2.15,.4,c)
    for x,y in [(-18,-20),(19,-20),(-18,19),(19,19)]:
        A.kit('Bench',x,y,c);line('Used square crossings',[(x,y),(0,-32)],1.2,'gravel',c,.10)
    # A reserved waiting/turning area is visible beside, rather than across, the road.
    line('Market bus waiting surface',[(-315,-126),(-290,-126)],2.8,'gravel',c,.065)
    for x in [-312,-305]:A.kit('Bench',x,-128,c)


def perimeter_with_gaps(name,xmin,ymin,xmax,ymax,gaps,c,height=1.65):
    edges=[((xmin,ymin),(xmax,ymin),'south'),((xmax,ymin),(xmax,ymax),'east'),((xmax,ymax),(xmin,ymax),'north'),((xmin,ymax),(xmin,ymin),'west')]
    for a,b,side in edges:
        length=math.dist(a,b);n=math.ceil(length/2.5)
        for i in range(n):
            p=(a[0]+(b[0]-a[0])*(i+.5)/n,a[1]+(b[1]-a[1])*(i+.5)/n)
            if any(s==side and abs((p[0] if side in ['north','south'] else p[1])-at)<width/2+length/n for s,at,width in gaps):continue
            theta=math.atan2(b[1]-a[1],b[0]-a[0]);z=R.height(*p)
            batch(name+' fence panel',(*p,z+height/2),(length/n,.06,height),'metal',c,theta)
            batch(name+' fence post',(*p,z+height/2),(.1,.1,height+.1),'metal',c)


def institutions():
    c=collection('50 INSTITUTION GROUNDS')
    # The north public gap and south workshop/service gap preserve existing access lanes.
    perimeter_with_gaps('School yard',-795,-390,-665,-190,[('north',-720,9),('south',-760,9),('west',-310,9)],c)
    for x,y,label in [(-720,-191,'2-Р СУРГУУЛЬ'),(-760,-389,'ЦЕХ')]:
        z=R.height(x,y);batch('School gateway sign',(x,y,z+3.85),(7,.10,.5),'bluepaint',c);text('School sign',label,x,y-.08,z+3.70,.4,c)
        # Uprights and latch sit beyond the 6m clear opening.
        for dx in [-4.5,4.5]:batch('School gateposts',(x+dx,y,z+2.0),(.2,.2,4),'metal',c)
        batch('School gateway crossbars',(x,y,z+3.85),(9.2,.16,.16),'metal',c)
        batch('School visible gate latch',(x+4.25,y,z+1.25),(.3,.15,.08),'metal',c)
    # A clear supervised yard connects the separate main school and workshop.
    line('School yard footpath',R.SCHOOL_FOOTPATH,2.3,'gravel',c,.07)
    line('School service gate escape link',[(-760,-390),(-760,-408),(-825,-408),(-825,-310),(-810,-310)],1.5,'gravel',c,.07)
    prop('sandpit',-684,-315,c);prop('climbing_frame',-684,-325,c)
    perimeter_with_gaps('Hospital service wall',700,270,989,507,[('south',760,12),('south',715,10),('south',909,16),('west',300,11),('east',350,12),('north',960,12)],c,1.7)
    for x,y in [(945,390),(975,485)]:prop('shed',x,y,c)
    line('Hospital service yard markings',[(930,430),(970,445)],2.8,'gravel',c,.08)
    text('Hospital service','ҮЙЛЧИЛГЭЭ',975,485-1.15,R.height(975,485)+1.7,.26,c)
    # Keep the hospital gap/four-zone problem explicit; no new corridor or magic escape.
    S['hospital_blocking_status']='Exteriors only; original routes retained. Four-zone interior and medical timing require review.'
    S['school_gate_status']='Exterior public/service gaps and visible latch; actor/camera handoff not approved.'


def agriculture_and_industry():
    c=collection('60 AGRICULTURE AND WORK YARDS');rng=random.Random(R.SEED+300)
    for f in R.FIELDS:
        x,y=f['center'];w,d=f['size']
        for dx in range(int(-w/2+4),int(w/2),7):
            points=[(x+dx,y-d/2+3),(x+dx+1.3,y+d/2-3)]
            line('Harvested stubble rows' if f['use']=='harvested_wheat' else 'Fallow tillage',points,.35,'hay' if f['use']=='harvested_wheat' else 'dirt',c,.045)
        # Headlands remain open for turning machinery, not dotted with arbitrary buildings.
    for x,y in [(1150,1040),(1160,1040),(1170,1040)]:prop('hay_stack',x,y,c)
    shop_shell(1155,995,24,12,c,label='ЗАСВАР',id='FarmRepair')
    prop('tractor',1147,1020,c,.2);prop('farm_trailer',1151,1028,c,.2);prop('repair_bench',1145,985,c)
    line('Farm workshop access',[(1155,986),(1180,986),(1210,986)],4.6,'dirt',c,.08)
    perimeter_with_gaps('Livestock yard',1095,1030,1135,1075,[('east',1040,7)],c,1.25)
    prop('hay_stack',1105,1066,c)
    for x in [1101,1112,1123]:batch('Livestock feed trough',(x,1060,R.height(x,1060)+.42),(3.2,.65,.7),'weatheredwood',c)
    # Modest sheep silhouettes are grouped around fodder; no animals in the center streets.
    for i in range(9):
        x=1101+(i%3)*8+rng.uniform(-1,1);y=1041+(i//3)*6;z=R.height(x,y)
        batch('Sheep body',(x,y,z+.65),(1.1,.55,.65),'cream',c)
        batch('Sheep head',(x-.65,y,z+.8),(.35,.32,.4),'coal',c)
        for dx in [-.35,.35]:
            for dy in [-.19,.19]:batch('Sheep legs',(x+dx,y+dy,z+.22),(.07,.07,.45),'coal',c)
    # Coal delivery and plant maintenance use the existing compound; plant identity unchanged.
    for x,y in [(1375,710),(1383,710),(1375,725)]:
        batch('Plant coal stockpile',(x,y,R.height(x,y)+1.1),(9,8,2.2),'coal',c,op='roof')
    prop('farm_trailer',1390,700,c);prop('repair_bench',1375,700,c)
    line('Plant maintenance access',[(1330,700),(1390,700),(1390,740)],5.2,'gravel',c,.08)
    for x in [690,715,740]:
        batch('Grain loading ramp',(x,904,R.height(x,904)+.5),(13,5,1),'plaster',c);prop('loading_pallet',x,909,c)
    # Short warehouse access spurs join the registered siding, preserving its atmosphere-only role.
    for x in [-130,-90,40]:
        z=R.height(x,1066)+.65
        batch('Freight wagon body',(x,1066,z+1.65),(13,2.9,3.2),'rust' if x<0 else 'weatheredwood',c)
        batch('Freight wagon roof',(x,1066,z+3.3),(13.2,3.1,.3),'metal',c)
        for dx in [-4.3,4.3]:
            for dy in [-.85,.85]:batch('Freight wheel silhouettes',(x+dx,1066+dy,z-.22),(.8,.25,.8),'coal',c)
    for ry in [1066,1074]:
        for x in range(-145,351,8):batch('Rail sleepers',(x,ry,R.height(x,ry)+.04),(.24,3.2,.16),'weatheredwood',c)
    for x in [210,255]:
        shop_shell(x,1025,28,14,c,id='RailStore');prop('loading_pallet',x-8,1035,c)
        line('Freight loading access',[(x,1017),(x,1000),(350,1000),(350,650)],5.4,'gravel',c,.07)
    S['realism_fields_json']=json.dumps(R.FIELDS)


def scale_reference():
    c=collection('90 EXISTING ACTOR SCALE REFERENCE');c.hide_render=True
    path=BASE.parents[2]/'artifacts/episode-1-cast/ganaa/character.glb'
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(path));added=set(bpy.data.objects)-before
    rig=next(o for o in added if o.type=='ARMATURE');actor={rig,*rig.children_recursive}
    # Keep only the imported actor hierarchy, excluding unrelated importer helper objects.
    bpy.data.batch_remove(ids=added-actor);added=actor
    for o in added:
        for old in list(o.users_collection):old.objects.unlink(o)
        c.objects.link(o)
    roots=[o for o in added if o.parent not in added]
    for o in roots:o.location+=Vector((419,-383,R.height(419,-383)+.08))
    bpy.context.view_layer.update();points=[o.matrix_world@Vector(v) for o in added if o.type=='MESH' for v in o.bound_box]
    height=max(p.z for p in points)-min(p.z for p in points)
    S['actor_scale_reference_json']=json.dumps({'source':str(path.relative_to(BASE.parents[2])),'height_m':height,'authored_height_m':1.7,'scale_changed':False,'rendered_in_production_views':False})
    assert 1.60<height<1.80,height


def details():
    assert S.get('realism_geography') and not S.get('realism_details'),'Use the geography checkpoint once.'
    t=time.perf_counter();A.L.height=R.height;refresh_landscape()
    for name in COLORS:material(name)
    collection('10 LANDSCAPE AND DRAINAGE');model_library();parcels();apartments();commerce_and_civic();institutions();agriculture_and_industry();road_wear_and_landscape();flush();scale_reference()
    for name in ['S1 ALERT','S2 OUTBREAK DAMAGE','S3 AFTERMATH','S4 HARD WINTER']:
        c=collection('80 '+name);c.hide_render=True;c.hide_viewport=True
    reviews=load('realism_review_cameras',OUT/'review.py');reviews.install_cameras();S.camera=bpy.data.objects['Review.entrance'];S.view_settings.exposure=.5
    A.COL['annotation'].hide_render=True
    S['reuse_counts_json']=json.dumps(A.COUNTS);S['realism_details']=True;S['realism_details_seconds']=time.perf_counter()-t
    manifest={'version':'Naran-City-Realism-v001','seed':R.SEED,'baseline_sha256':S['baseline_sha256'],'districts':R.DISTRICTS,'businesses':BUSINESS,'parcels':PARCELS,'fields':R.FIELDS,'new_obstacles':OBSTACLES,'variants':CATALOG,'actor_scale_reference':json.loads(S['actor_scale_reference_json']),'road_families':{o.name:o.get('road_family','dirt') for o in A.COL['roads'].objects if o.name.startswith('Road.') and o.get('centerline_json')},'narrative_changes':'No N01–N20 XY, existing road centerlines, arrival/foot-entry or local Episode1 source changed. School/hospital exterior perimeter gaps added; final blocking remains unapproved.','weather_assumption':'Intact S0 late-November dry cold, shallow lee frost; exact 1998 daily weather unverified.'}
    (OUT/'city-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');(OUT/'variant-catalog.json').write_text(json.dumps(CATALOG,indent=2)+'\n')
    save();print('REALISM_DETAILS_SAVED',json.dumps({'parcels':len(PARCELS),'mixed':sum(p['mixed_ger_house'] for p in PARCELS),'businesses':len(BUSINESS),'objects':len(S.objects)}))

if __name__=='__main__':
    stage=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'geography'
    if stage=='geography':geography()
    elif stage=='details':details()
