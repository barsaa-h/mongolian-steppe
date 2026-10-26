import bpy,math,json
from mathutils import Vector
import common as C

def bind(ob,rig,bone):
    ob.vertex_groups.clear();g=ob.vertex_groups.new(name=bone);g.add(list(range(len(ob.data.vertices))),1,'REPLACE')
    mod=ob.modifiers.new('Cinematic skeleton','ARMATURE');mod.object=rig;mod.use_deform_preserve_volume=True;ob.parent=rig

def link_driver(dst,source):
    d=dst.driver_add('value').driver;d.type=source.type;d.expression=source.expression
    for old in source.variables:
        new=d.variables.new();new.name=old.name;new.type=old.type
        for i,target in enumerate(old.targets):
            new.targets[i].id=target.id;new.targets[i].data_path=target.data_path
            if old.type=='TRANSFORMS':
                new.targets[i].bone_target=target.bone_target;new.targets[i].transform_type=target.transform_type;new.targets[i].transform_space=target.transform_space

def integrate_face(ctx):
    f=ctx['facial'];rig=ctx['body_rig']['rig'];ctl=f['controls'];bpy.context.view_layer.objects.active=rig
    bpy.ops.object.mode_set(mode='EDIT')
    for side,co in f['eye_centers'].items():
        b=rig.data.edit_bones['eye.'+side];b.head=co;b.tail=Vector(co)+Vector((0,-.025,0))
    rig.data.edit_bones['jaw'].head=(0,.017,1.635);rig.data.edit_bones['jaw'].tail=(0,-.054,1.593)
    bpy.ops.object.mode_set(mode='OBJECT')
    for ob in [f['head'],f['cavity']]+f['brows']+f['ears']+f['teeth']['upper']:bind(ob,rig,'head')
    for ob in f['teeth']['lower']+[f['tongue']]:bind(ob,rig,'jaw')
    for side,objects in f['eyes'].items():
        for ob in objects:bind(ob,rig,'eye.'+side)
        bind(bpy.data.objects['PS2 | Tear duct.'+side],rig,'head')
    # Visible lash rims duplicate their source deformation exactly, including the blink corrective.
    head=f['head'];meta=f['meta'];lash_polys=[]
    for p in head.data.polygons:
        tags=[meta[i] for i in p.vertices]
        if all(t.get('kind')=='lid' and t.get('ring') in [3,4] and math.sin(t['angle'])>.02 for t in tags):lash_polys.append(tuple(p.vertices))
    used=sorted({i for p in lash_polys for i in p});remap={old:i for i,old in enumerate(used)}
    lash=C.mesh('PS2 | Subtle upper lash rims',[tuple(head.data.vertices[i].co+Vector((0,-.00025,0))) for i in used],[tuple(remap[i] for i in p) for p in lash_polys],ctx['materials']['brow'],ctx['collection'])
    for source in head.data.shape_keys.key_blocks:
        key=lash.shape_key_add(name=source.name, from_mix=False)
        for j,i in enumerate(used):key.data[j].co=source.data[i].co+Vector((0,-.00025,0))
        if source.name!='Basis':
            path=source.path_from_id('value');curve=next((d for d in head.data.shape_keys.animation_data.drivers if d.data_path==path),None)
            if curve:link_driver(key,curve.driver)
    bind(lash,rig,'head');f['lashes']=lash
    jaw=rig.pose.bones['jaw'];jaw.rotation_mode='XYZ';d=jaw.driver_add('rotation_euler',0).driver
    for name,prop in f['jawvars'].items():
        var=d.variables.new();var.name=name;var.type='SINGLE_PROP';var.targets[0].id=ctl;var.targets[0].data_path='["'+prop+'"]'
    d.expression='0.30*('+f['jawexpr']+')'
    for side in ['L','R']:
        b=rig.pose.bones['eye.'+side];b.rotation_mode='XYZ'
        for axis,prop,factor in [(0,'GazePitch',.25),(2,'GazeYaw',.28)]:
            d=b.driver_add('rotation_euler',axis).driver
            var=d.variables.new();var.name='g';var.type='SINGLE_PROP';var.targets[0].id=ctl;var.targets[0].data_path='["'+prop+'"]';d.expression=f'g*{factor}'
    # Keep hand texture neutral; it uses no facial landmarks or facial atlas noise.
    for ob in ctx['body_rig']['hands']:
        if not ob.data.uv_layers:ob.data.uv_layers.new(name='UVMap')
        uv=ob.data.uv_layers.active
        for p in ob.data.polygons:
            for li in p.loop_indices:uv.data[li].uv=(.50,.14)
        for mod in ob.modifiers:
            if mod.type=='SUBSURF':mod.levels=1;mod.render_levels=1
    ctl.parent=rig
    bpy.context.view_layer.update()
    return f

def build_hair(ctx):
    coll=ctx['collection'];m=ctx['materials'];rig=ctx['body_rig']['rig'];objects=[]
    # A recessed underlayer only fills small inter-clump gaps, with no exposed smooth helmet.
    vs=[];fs=[];n=24
    for level in range(4):
        for j in range(n):
            a=math.tau*j/n;c=math.cos(a)
            if level==0:z=1.699+.046*max(c,0)-.038*max(-c,0);rx=.083;ry=.094
            elif level==1:z=1.758;rx=.074;ry=.087
            elif level==2:z=1.789;rx=.045;ry=.060
            else:z=1.800;rx=.009;ry=.016
            vs.append((rx*math.sin(a),.012-ry*c,z))
    for i in range(3):
        for j in range(n):a=i*n+j;b=i*n+(j+1)%n;fs.append((a,b,b+n,a+n))
    fs.append(tuple(3*n+j for j in range(n)))
    base=C.mesh('PS2 | Hair · recessed roots',vs,fs,m['hair'],coll);objects.append(base)
    def lock(name,path,widths,heights):
        verts=[];sides=6
        for i,p in enumerate(path):
            tangent=(Vector(path[min(i+1,len(path)-1)])-Vector(path[max(0,i-1)])).normalized()
            normal=Vector((p[0],p[1]-.009,(p[2]-1.69)*.65)).normalized()
            u=tangent.cross(normal).normalized();v=u.cross(tangent).normalized()
            for j in range(sides):
                a=math.tau*j/sides;verts.append(tuple(Vector(p)+u*widths[i]*math.cos(a)+v*heights[i]*math.sin(a)))
        faces=[]
        for i in range(len(path)-1):
            for j in range(sides):a=i*sides+j;b=i*sides+(j+1)%sides;faces.append((a,b,b+sides,a+sides))
        faces.extend([tuple(reversed(range(sides))),tuple((len(path)-1)*sides+j for j in range(sides))])
        ob=C.mesh(name,verts,faces,m['hair'],coll,smooth=False)
        uv=ob.data.uv_layers.active
        for p in ob.data.polygons:
            for li in p.loop_indices:
                vi=ob.data.loops[li].vertex_index;uv.data[li].uv=((vi%sides)/(sides-1),(vi//sides)/(len(path)-1))
        objects.append(ob)
    # Directional primary clumps sweep from the crown into a short asymmetric fringe.
    for i,x in enumerate([-.058,-.031,-.003,.028,.057]):
        path=[(x*.28,.040,1.790),(x*.62,.013,1.811+.003*math.sin(i)),(x,-.029,1.791),(x+.008,-.063+abs(x)*.20,1.758),(x+.013,-.074+abs(x)*.30,1.737+.006*(i%3))]
        lock('PS2 | Hair · crown fringe '+str(i+1),path,[.007,.014,.015,.012,.0018],[.004,.010,.010,.006,.0015])
    for side,sign in [('L',1),('R',-1)]:
        for i in range(2):
            y=-.030+i*.065
            path=[(sign*.018,y+.020,1.789),(sign*.054,y+.011,1.779),(sign*.079,y,1.740),(sign*.085,y-.004,1.700-.004*(i%2))]
            lock('PS2 | Hair · temple '+side+str(i),path,[.006,.013,.014,.003],[.004,.008,.007,.002])
    for i,x in enumerate([-.055,-.020,.020,.055]):
        path=[(x*.4,.044,1.786),(x*.7,.080,1.764),(x,.100-abs(x)*.18,1.713),(x+.004,.093-abs(x)*.20,1.668+.006*(i%2))]
        lock('PS2 | Hair · nape layer '+str(i),path,[.007,.014,.014,.002],[.005,.008,.008,.0015])
    # Two smaller front groupings interrupt the repeated clump rhythm without spaghetti strands.
    for i,x in enumerate([-.030,.035]):
        lock('PS2 | Hair · secondary fringe '+str(i),[(x-.01,-.044,1.779),(x,-.071,1.757),(x+.012,-.079,1.735)],[.008,.007,.001],[.004,.004,.001])
    for ob in objects:bind(ob,rig,'head')
    ctx['hair']=objects
    return objects
