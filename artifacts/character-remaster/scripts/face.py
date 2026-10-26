"""Locally reconstructed, loop-based face and performance controls."""
import bpy,math,json
from mathutils import Vector,Matrix
import common as C

CONTROL_NAMES=[
 'Blink_L','Blink_R','EyeWide_L','EyeWide_R','Squint_L','Squint_R',
 'UpperLid_L','UpperLid_R','LowerLid_L','LowerLid_R',
 'BrowInnerUp_L','BrowInnerUp_R','BrowOuterUp_L','BrowOuterUp_R',
 'BrowDown_L','BrowDown_R','BrowSqueeze_L','BrowSqueeze_R',
 'JawOpen','MouthClose','Smile_L','Smile_R','Frown_L','Frown_R',
 'LipPress','LipStretch','LipPucker','MouthRound','UpperLipRaise','LowerLipDepress',
 'MouthLeft','MouthRight','CheekRaise_L','CheekRaise_R','CheekCompress_L','CheekCompress_R',
 'NoseWrinkle','AsymTension_L','AsymTension_R','Pain_L','Pain_R',
 'AA','EE','OH','OO','FV','MBP','L','WQ',
 'GazeYaw_L','GazeYaw_R','GazePitch_L','GazePitch_R']

EMOTIONS={
 'Neutral':{},
 'Quiet Sadness':{'BrowInnerUp_L':.50,'BrowInnerUp_R':.45,'UpperLid_L':-.30,'UpperLid_R':-.25,'Frown_L':.33,'Frown_R':.30,'LipPress':.18},
 'Fear':{'EyeWide_L':.72,'EyeWide_R':.80,'BrowInnerUp_L':.60,'BrowInnerUp_R':.58,'BrowOuterUp_L':.35,'BrowOuterUp_R':.40,'JawOpen':.42,'LipStretch':.30,'CheekCompress_L':.22,'CheekCompress_R':.18},
 'Anger':{'BrowDown_L':.78,'BrowDown_R':.70,'BrowSqueeze_L':.65,'BrowSqueeze_R':.65,'Squint_L':.24,'Squint_R':.20,'LipPress':.40,'AsymTension_L':.25,'NoseWrinkle':.22},
 'Shock':{'EyeWide_L':1,'EyeWide_R':.95,'BrowInnerUp_L':.85,'BrowInnerUp_R':.85,'BrowOuterUp_L':.75,'BrowOuterUp_R':.70,'JawOpen':.82,'MouthRound':.35},
 'Grief':{'BrowInnerUp_L':.90,'BrowInnerUp_R':.80,'Squint_L':.50,'Squint_R':.35,'Frown_L':.70,'Frown_R':.62,'JawOpen':.26,'UpperLipRaise':.25,'AsymTension_R':.27,'CheekRaise_L':.18},
 'Physical Pain':{'Blink_L':.65,'Blink_R':.82,'BrowDown_L':.65,'BrowDown_R':.70,'BrowSqueeze_L':.80,'BrowSqueeze_R':.70,'NoseWrinkle':.55,'Pain_L':.65,'Pain_R':.50,'LipPress':.38},
 'Subtle Happiness':{'Smile_L':.45,'Smile_R':.40,'CheekRaise_L':.40,'CheekRaise_R':.35,'Squint_L':.12,'Squint_R':.10,'BrowOuterUp_L':.08,'BrowOuterUp_R':.08},
 'Exhaustion':{'UpperLid_L':-.65,'UpperLid_R':-.48,'LowerLid_L':.18,'LowerLid_R':.15,'JawOpen':.08,'Frown_L':.10,'GazePitch_L':-.22,'GazePitch_R':-.20},
 'Vacant Zombie':{'UpperLid_L':-.42,'UpperLid_R':.18,'JawOpen':.28,'MouthRight':.25,'Frown_L':.25,'GazeYaw_L':.32,'GazeYaw_R':-.18,'GazePitch_L':-.10,'GazePitch_R':.08},
}

def interp(z,points):
    for (a,x),(b,y) in zip(points,points[1:]):
        if z<=b:return x+(y-x)*max(0,min(1,(z-a)/(b-a)))
    return points[-1][1]

def width(z):return interp(z,[(1.548,.038),(1.561,.058),(1.58,.072),(1.61,.082),(1.65,.088),(1.685,.086),(1.715,.083),(1.75,.080),(1.775,.067),(1.793,.039),(1.800,.009)])
def frontdepth(z):return interp(z,[(1.548,.052),(1.58,.070),(1.62,.076),(1.66,.079),(1.69,.076),(1.725,.082),(1.76,.076),(1.79,.046),(1.80,.012)])
def front_y(x,z):
    rx=width(z);r=min(.9999,abs(x)/rx)
    y=.009-frontdepth(z)*math.sqrt(max(0,1-r*r))
    y-=.004*math.exp(-((abs(x)-.050)/.023)**2-((z-1.657)/.020)**2)
    y+=.0035*math.exp(-((abs(x)-.035)/.018)**2-((z-1.686)/.013)**2)
    y-=.009*math.exp(-(x/.012)**2-((z-1.682)/.035)**2)
    y-=.030*math.exp(-(x/.0145)**2-((z-1.648)/.012)**2)
    y-=.009*math.exp(-((abs(x)-.015)/.007)**2-((z-1.642)/.008)**2)
    return y

def driver(ob,path,control,expression=None,variables=None):
    d=ob.driver_add(path).driver;d.type='SCRIPTED'
    if variables is None:variables={'v':control}
    for var,prop in variables.items():
        v=d.variables.new();v.name=var;v.type='SINGLE_PROP';v.targets[0].id=control_object;v.targets[0].data_path='["'+prop+'"]'
    d.expression=expression or 'v'

def add_key(ob,name,func,controls):
    if not ob.data.shape_keys:ob.shape_key_add(name='Basis')
    base=ob.data.shape_keys.key_blocks[0];key=ob.shape_key_add(name=name)
    for i,v in enumerate(base.data):key.data[i].co=func(Vector(v.co),i)
    key.slider_min=-1 if name.startswith(('UpperLid','LowerLid')) else 0
    key.slider_max=1
    d=key.driver_add('value').driver;d.type='SCRIPTED'
    v=d.variables.new();v.name='v';v.type='SINGLE_PROP';v.targets[0].id=controls;v.targets[0].data_path='["'+name+'"]';d.expression='v'
    return key

def build_face(ctx):
    global control_object
    coll=ctx['collection'];m=ctx['materials']
    controls=bpy.data.objects.new('CM | FACE_CONTROLS',None);coll.objects.link(controls);controls.empty_display_type='SPHERE';controls.empty_display_size=.06;controls.location=(.25,-.12,1.68)
    control_object=controls
    for name in CONTROL_NAMES:
        controls[name]=0.0
        signed=name.startswith(('UpperLid','LowerLid','Gaze'))
        controls.id_properties_ui(name).update(min=-1 if signed else 0,max=1,description=name.replace('_',' '))
    controls['Guide']='Custom Properties: independent facial controls; pose library and visemes included. Controls drive shapes, jaw and eye bones.'

    zs=[1.548,1.561,1.576,1.589,1.600,1.610,1.620,1.630,1.642,1.647,1.651,1.655,1.668,1.676,1.684,1.692,1.700,1.710,1.724,1.740,1.756,1.772,1.786,1.797,1.800]
    xn=[-1+i*.1 for i in range(21)];vs=[];meta=[];fs=[];fm=[]
    def vert(co,tag=None):
        vs.append(tuple(co));meta.append(tag or {});return len(vs)-1
    def face(indices,material=0):fs.append(tuple(indices));fm.append(material)
    grid=[]
    for z in zs:
        row=[]
        for u in xn:
            x=width(z)*u;row.append(vert((x,front_y(x,z),z),{'kind':'skin'}))
        grid.append(row)
    er0=zs.index(1.655);er1=zs.index(1.710);mr0=zs.index(1.600);mr1=zs.index(1.630)
    holes=[(3,9,er0,er1,'R'),(11,17,er0,er1,'L'),(6,14,mr0,mr1,'mouth')]
    for r in range(len(zs)-1):
        for c in range(20):
            if any(c0<=c<c1 and r0<=r<r1 for c0,c1,r0,r1,label in holes):continue
            face((grid[r][c],grid[r][c+1],grid[r+1][c+1],grid[r+1][c]))
    # Back hemisphere is welded to both temple boundaries of the frontal grid.
    back=[]
    for r,z in enumerate(zs):
        row=[grid[r][-1]];rx=width(z);ry=frontdepth(z)*1.12
        for j in range(1,12):
            a=math.pi*j/12;row.append(vert((rx*math.cos(a),.009+ry*math.sin(a),z),{'kind':'back'}))
        row.append(grid[r][0]);back.append(row)
    for r in range(len(zs)-1):
        for j in range(12):face((back[r][j],back[r][j+1],back[r+1][j+1],back[r+1][j]))
    ring_bottom=grid[0]+back[0][1:-1];ring_top=grid[-1]+back[-1][1:-1]
    face(tuple(reversed(ring_bottom)));face(tuple(ring_top))

    def boundary(c0,c1,r0,r1):
        return [grid[r0][c] for c in range(c0,c1+1)]+[grid[r][c1] for r in range(r0+1,r1+1)]+[grid[r1][c] for c in range(c1-1,c0-1,-1)]+[grid[r][c0] for r in range(r1-1,r0,-1)]
    eye_centers={};mouth_ring=[]
    for c0,c1,r0,r1,label in holes:
        outer=boundary(c0,c1,r0,r1);old=outer;count=len(outer)
        if label!='mouth':
            cx=width(1.684)*(.4 if label=='L' else -.4);cz=1.684;cy=-.046
            eye_centers[label]=(cx,cy,cz)
            # Match the rectangular grid boundary to three concentric anatomical eyelid loops.
            for k,(rx,top,bottom) in enumerate([(.024,.016,.0135),(.0195,.0095,.0075),(.0165,.0065,.0048),(.0160,.0062,.0045)],1):
                ring=[]
                for i,oi in enumerate(outer):
                    ox,oy,oz=vs[oi];a=math.atan2((oz-cz)/.016,(ox-cx)/.0172)
                    dx=rx*math.cos(a);dz=(top if math.sin(a)>=0 else bottom)*math.sin(a)
                    if k==1:y=front_y(cx+dx,cz+dz)-.001
                    else:y=cy-math.sqrt(max(.000012,.018**2-dx**2-dz**2))-.0012+(0.0009 if k==4 else 0)
                    ring.append(vert((cx+dx,y,cz+dz),{'kind':'lid','side':label,'ring':k,'angle':a,'center':(cx,cy,cz)}))
                for i in range(count):face((old[i],old[(i+1)%count],ring[(i+1)%count],ring[i]))
                old=ring
        else:
            cz=1.6145
            for k,(rx,rz) in enumerate([(.033,.014),(.030,.0065),(.026,.00015),(.0255,.0002)],1):
                ring=[]
                for i,oi in enumerate(outer):
                    ox,oy,oz=vs[oi];a=math.atan2((oz-cz)/.015,(ox)/.033)
                    x=rx*math.cos(a);z=cz+rz*math.sin(a)
                    y=front_y(x,z)-(.001 if k==1 else .006 if k==2 else .0055 if k==3 else -.0015)
                    ring.append(vert((x,y,z),{'kind':'mouth','ring':k,'angle':a}))
                for i in range(count):face((old[i],old[(i+1)%count],ring[(i+1)%count],ring[i]),1 if k>=2 and k<=3 else 0)
                old=ring
            mouth_ring=old
    # Delete unused grid vertices before shape keys exist.
    used=sorted({i for f in fs for i in f});remap={old:new for new,old in enumerate(used)}
    vs=[vs[i] for i in used];meta=[meta[i] for i in used];fs=[tuple(remap[i] for i in f) for f in fs];mouth_ring=[remap[i] for i in mouth_ring]
    head=C.mesh('CM | Head · facial loops',vs,fs,m['skin'],coll)
    head.data.materials.append(m['lips'])
    for p,mi in zip(head.data.polygons,fm):p.material_index=mi
    # A few intentional planar changes preserve the retro silhouette without coarse face blocks.
    for p in head.data.polygons:p.use_smooth=True
    head['topology']='Welded eye and lip annuli; real socket and oral openings. No subdivision required.'

    def g(x,c,s):return math.exp(-((x-c)/s)**2)
    def sideweight(x,side):return max(0,min(1,.5+(x/(.018 if side=='L' else -.018))))
    def mouthweight(v):return g(v.x,0,.048)*g(v.z,1.615,.038)*max(0,min(1,(-v.y+.015)/.05))
    def delta(v,i,name):
        tag=meta[i];q=v.copy();x,y,z=v;mw=mouthweight(v)
        for side in ['L','R']:
            sign=1 if side=='L' else -1;sw=sideweight(x,side);cx=sign*width(1.684)*.4
            ew=g(x,cx,.025)*g(z,1.686,.026)*max(0,min(1,(-y+.015)/.045))
            lid=tag.get('kind')=='lid' and tag.get('side')==side
            if name in ['Blink_'+side,'EyeWide_'+side,'Squint_'+side,'UpperLid_'+side,'LowerLid_'+side] and lid:
                k=tag['ring'];w=[0,.20,.60,1,1][k];cz=1.684;dx=x-cx;upper=z>=cz
                if name=='Blink_'+side:
                    target=cz-.0008+.0008*max(0,1-(dx/.017)**2);q.z=z+(target-z)*w
                elif name=='EyeWide_'+side:q.z=z+(z-cz)*(.95 if upper else .65)*w
                elif name=='Squint_'+side:q.z=z+(cz-z)*.52*w
                elif name=='UpperLid_'+side and upper:q.z+=.006*w
                elif name=='LowerLid_'+side and not upper:q.z+=.004*w
                if k>=2:q.y=-.046-math.sqrt(max(.000010,.018**2-dx**2-(q.z-cz)**2))-.0012+(0.0009 if k==4 else 0)
            if name.startswith('Brow') and name.endswith('_'+side):
                bw=g(z,1.711,.020)*g(x,cx,.031)*max(0,min(1,(-y+.02)/.06))
                inner=g(x,sign*.017,.025);outer=g(x,sign*.056,.028)
                if 'InnerUp' in name:q.z+=.007*bw*inner
                elif 'OuterUp' in name:q.z+=.006*bw*outer
                elif 'Down' in name:q.z-=.005*bw;q.y-=.001*bw
                elif 'Squeeze' in name:q.x-=sign*.003*bw;q.y-=.002*bw
            if name=='Smile_'+side:
                w=g(x,sign*.028,.022)*g(z,1.615,.025)*sw; q.x+=sign*.0055*w;q.z+=.007*w;q.y-=.0015*w
            if name=='Frown_'+side:
                w=g(x,sign*.026,.024)*g(z,1.615,.024)*sw;q.z-=.0065*w;q.x-=sign*.001*w
            if name=='CheekRaise_'+side:
                w=g(x,sign*.048,.032)*g(z,1.655,.028)*sw;q.z+=.005*w;q.y-=.003*w
            if name=='CheekCompress_'+side:
                w=g(x,sign*.048,.03)*g(z,1.65,.035)*sw;q.x-=sign*.003*w;q.y+=.002*w
            if name in ['AsymTension_'+side,'Pain_'+side]:
                w=g(x,sign*.030,.038)*g(z,1.638,.049)*sw;q.z+=.0035*w;q.x+=sign*.002*w;q.y-=.0015*w
        if name=='JawOpen':
            if tag.get('kind')=='mouth':w=.04 if math.sin(tag['angle'])>0 else min(1,.35+.65*abs(math.sin(tag['angle'])))
            else:w=max(0,min(1,(1.652-z)/.045))*max(0,min(1,(-y+.07)/.08))
            pivot=Vector((0,.017,1.635));turned=pivot+Matrix.Rotation(.43,3,'X')@(v-pivot)
            q=v+(turned-v)*w
        elif name=='MouthClose':
            if tag.get('kind')=='mouth':q.z=1.6145+(z-1.6145)*.12;q.y-=.0005
        elif name in ['LipPress','MBP']:
            if tag.get('kind')=='mouth':q.z=1.6145+(z-1.6145)*(.25 if tag.get('ring',0)>=2 else .7);q.y-=.0015
        elif name in ['LipStretch','EE']:
            q.x+=x*.23*mw;q.z+=(z-1.6145)*.10*mw
        elif name in ['LipPucker','OO','WQ']:
            q.x-=x*.27*mw;q.y-=.007*mw
            if name!='LipPucker' and tag.get('kind')=='mouth':q.z=1.6145+(z-1.6145)*2.2
        elif name in ['MouthRound','OH']:
            q.x-=x*.18*mw
            if tag.get('kind')=='mouth':q.z=1.6145+(z-1.6145)*2.8
        elif name in ['UpperLipRaise','AA']:
            q.z+=.005*g(z,1.622,.009)*g(x,0,.030)*mw
            if name=='AA':q.x+=x*.08*mw
        elif name=='LowerLipDepress':q.z-=.005*g(z,1.609,.009)*mw
        elif name=='FV':q.z+=.0045*g(z,1.608,.008)*mw;q.y-=.0015*mw
        elif name=='L':q.x+=x*.05*mw
        elif name=='MouthLeft':q.x-=.006*mw
        elif name=='MouthRight':q.x+=.006*mw
        elif name=='NoseWrinkle':
            nw=g(x,0,.024)*g(z,1.65,.020)*max(0,min(1,(-y+.015)/.06));q.z+=.003*nw;q.y-=.002*nw
        return q

    head_keys=[n for n in CONTROL_NAMES if not n.startswith('Gaze')]
    for name in head_keys:add_key(head,name,lambda v,i,n=name:delta(v,i,n),controls)
    # Jaw opening receives speech contributions, so skin, lower teeth and tongue agree.
    jawvars={'j':'JawOpen','a':'AA','e':'EE','o':'OH','u':'OO','f':'FV','l':'L','w':'WQ','c':'MouthClose'}
    jawexpr='max(0,min(1,j+.50*a+.18*e+.45*o+.28*u+.10*f+.22*l+.12*w-.6*c))'
    d=head.data.shape_keys.key_blocks['JawOpen'].driver_add('value').driver
    while d.variables:d.variables.remove(d.variables[0])
    for n,prop in jawvars.items():
        var=d.variables.new();var.name=n;var.type='SINGLE_PROP';var.targets[0].id=controls;var.targets[0].data_path='["'+prop+'"]'
    d.expression=jawexpr
    # Correctives resolve the two common combinations rather than relying on additive extremes.
    for side in ['L','R']:
        name='Corrective_BlinkWide_'+side;key=head.shape_key_add(name=name)
        for i,v in enumerate(head.data.shape_keys.key_blocks[0].data):
            base=Vector(v.co);tag=meta[i]
            if tag.get('kind')=='lid' and tag.get('side')==side:
                wide=delta(base,i,'EyeWide_'+side)-base;key.data[i].co=base-wide
        d=key.driver_add('value').driver
        for n,prop in [('b','Blink_'+side),('w','EyeWide_'+side)]:
            var=d.variables.new();var.name=n;var.type='SINGLE_PROP';var.targets[0].id=controls;var.targets[0].data_path='["'+prop+'"]'
        d.expression='b*w'
        key=head.shape_key_add(name='Corrective_OpenSmile_'+side)
        for i,v in enumerate(head.data.shape_keys.key_blocks[0].data):
            base=Vector(v.co);sw=sideweight(base.x,side);w=mouthweight(base)*sw
            key.data[i].co=base+Vector((0,.001*w,-.002*w))
        d=key.driver_add('value').driver
        for n,prop in [('j','JawOpen'),('s','Smile_'+side)]:
            var=d.variables.new();var.name=n;var.type='SINGLE_PROP';var.targets[0].id=controls;var.targets[0].data_path='["'+prop+'"]'
        d.expression='j*s'

    # Eye spheres, radial iris caps and pupils are real geometry and rotate about the eye bone.
    eyes={}
    for side,center in eye_centers.items():
        cx,cy,cz=center;objects=[]
        objects.append(C.ellipsoid('CM | Eyeball.'+side,center,(.018,.018,.017),m['sclera'],coll,32,20))
        for name,radius,material in [('Iris',.0055,m['iris']),('Pupil',.0026,m['pupil'])]:
            verts=[(cx,cy-.018-.0003,cz)]
            for j in range(32):
                a=math.tau*j/32;dx=radius*math.cos(a);dz=radius*math.sin(a);y=cy-math.sqrt(.018**2-dx**2-dz**2)-(.00035 if name=='Iris' else .0005)
                verts.append((cx+dx,y,cz+dz))
            ob=C.mesh('CM | '+name+'.'+side,verts,[(0,1+j,1+(j+1)%32) for j in range(32)],material,coll);objects.append(ob)
        # A tiny wet meniscus and tear duct complete the corners without oversized lashes.
        duct=C.ellipsoid('CM | Tear duct.'+side,(cx+(-.0158 if side=='L' else .0158),-.053,cz-.0002),(.0015,.001,.0013),m['lips'],coll,8,4)
        eyes[side]=objects
    # Eyebrows are a thin sculpted strip with independent moving sections.
    brows=[]
    for side in ['L','R']:
        sign=1 if side=='L' else -1;verts=[]
        for i in range(7):
            x=sign*(.014+i*.007);z=1.708+.0015*math.sin(i*math.pi/6)
            for dz in [-.0016,.0016]:verts.append((x,front_y(x,z+dz)-.0025,z+dz))
        brow=C.mesh('CM | Brow.'+side,verts,[(i*2,i*2+1,i*2+3,i*2+2) for i in range(6)],m['brow'],coll)
        for name in ['BrowInnerUp_'+side,'BrowOuterUp_'+side,'BrowDown_'+side,'BrowSqueeze_'+side]:
            def bf(v,i,n=name):
                q=v.copy();t=(abs(v.x)-.014)/.042
                if 'InnerUp' in n:q.z+=.010*(1-t)
                elif 'OuterUp' in n:q.z+=.009*t
                elif 'Down' in n:q.z-=.006*(.8+.2*(1-t));q.y-=.001
                else:q.x-=sign*.004*(1-t);q.z-=.001
                q.y=front_y(q.x,q.z)-.0025
                return q
            add_key(brow,name,bf,controls)
        brows.append(brow)

    # Oral cavity: continuous dark tunnel and real dental arches.
    inner_vs=[];angles=[meta[i]['angle'] for i in mouth_ring];count=len(angles)
    for k in range(3):
        for a in angles:
            if k==0:co=Vector(vs[mouth_ring[len(inner_vs)%count]]);co.y+=.002
            elif k==1:co=Vector((.030*math.cos(a),-.039,1.6145+.022*math.sin(a)))
            else:co=Vector((.021*math.cos(a),-.010,1.617+.017*math.sin(a)))
            inner_vs.append(tuple(co))
    inner_fs=[]
    for k in range(2):
        for i in range(count):a=k*count+i;b=k*count+(i+1)%count;inner_fs.append((a,b,b+count,a+count))
    inner_fs.append(tuple(2*count+i for i in range(count)))
    cavity=C.mesh('CM | Oral cavity',inner_vs,inner_fs,m['inner'],coll)
    cavity.shape_key_add(name='Basis');key=cavity.shape_key_add(name='JawOpen')
    for i,v in enumerate(key.data):
        base=Vector(inner_vs[i]);a=angles[i%count];w=(.25+.75*max(0,-math.sin(a)))*(1 if i<count else .55)
        pivot=Vector((0,.017,1.635));v.co=base+(pivot+Matrix.Rotation(.43,3,'X')@(base-pivot)-base)*w
    d=key.driver_add('value').driver
    for n,prop in jawvars.items():
        var=d.variables.new();var.name=n;var.type='SINGLE_PROP';var.targets[0].id=controls;var.targets[0].data_path='["'+prop+'"]'
    d.expression=jawexpr
    teeth={'upper':[],'lower':[]}
    for row,z in [('upper',1.6205),('lower',1.607)]:
        for i,x in enumerate([-.022,-.016,-.010,-.0035,.0035,.010,.016,.022]):
            y=-.066+abs(x)*.38
            ob=C.ellipsoid('CM | '+row.title()+' tooth '+str(i+1),(x,y,z),(.0031,.0032,.0046),m['teeth'],coll,8,5)
            teeth[row].append(ob)
    tongue=C.ellipsoid('CM | Tongue',(0,-.044,1.601),(.017,.018,.004),m['tongue'],coll,20,8)
    add_key(tongue,'L',lambda v,i:v+Vector((0,-.003,.009*math.exp(-((v.y+.059)/.018)**2))),controls)
    # Ears retain identity but have a clear helix, antihelix and concha.
    ears=[]
    for sign in [-1,1]:
        x=sign*.011;z=1.641
        nostril=C.ellipsoid('CM | Nostril '+str(sign),(x,front_y(x,z)-.001,z),(.0027,.0012,.0011),m['inner'],coll,10,5)
        ears.append(nostril)
    for side in ['L','R']:
        sign=1 if side=='L' else -1
        ear=C.ellipsoid('CM | Ear.'+side,(sign*.086,.007,1.675),(.012,.018,.026),m['skin'],coll,16,10);ears.append(ear)
        concha=C.ellipsoid('CM | Concha.'+side,(sign*.091,-.007,1.675),(.005,.002,.013),m['lips'],coll,12,6);ears.append(concha)

    # Persist the data used by QA, rather than assuming shape names imply functionality.
    info={'controls':CONTROL_NAMES,'shape_keys':list(head.data.shape_keys.key_blocks.keys()),'head_vertices':len(head.data.vertices),'head_quads':sum(len(p.vertices)==4 for p in head.data.polygons),'eyes':eye_centers,'mouth_opening':True,'eyelid_loops':4,'lip_loops':4,'emotions':EMOTIONS}
    with open(C.OUT+'/Character_Expressions/Facial_System.json','w') as f:json.dump(info,f,indent=2)
    text=bpy.data.texts.new('CM | Emotion and Viseme Poses');text.write(json.dumps(EMOTIONS,indent=2))
    ctx['facial']={'head':head,'controls':controls,'eyes':eyes,'brows':brows,'ears':ears,'cavity':cavity,'teeth':teeth,'tongue':tongue,'eye_centers':eye_centers,'jawvars':jawvars,'jawexpr':jawexpr,'meta':meta,'info':info}
    return ctx['facial']

def set_expression(ctx,name,amount=1):
    ctl=ctx['facial']['controls']
    for key in CONTROL_NAMES:ctl[key]=0.
    for key,value in EMOTIONS[name].items():ctl[key]=float(value*amount)
    ctl.update_tag();bpy.context.view_layer.update()
