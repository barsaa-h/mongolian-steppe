import bpy, math, os, json
from mathutils import Vector
OUT='/home/barsaa/mongolian-steppe/artifacts/ps2-horror-character'

def linear(c):return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
def mat(name,h,texture=None,roughness=.82):
    m=bpy.data.materials.new('PS2 | '+name);m.use_nodes=True
    col=tuple(int(h[i:i+2],16)/255 for i in (0,2,4));m.diffuse_color=(*[linear(x) for x in col],1)
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=m.diffuse_color
    p.inputs['Roughness'].default_value=roughness;p.inputs['Specular IOR Level'].default_value=.25
    if texture:
        im=bpy.data.images.load(OUT+'/Textures/'+texture,check_existing=True);im.pack()
        n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=im;n.interpolation='Linear'
        m.node_tree.links.new(n.outputs['Color'],p.inputs['Base Color'])
    return m

def mesh(name,vs,fs,material,coll,smooth=True):
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();assert not me.validate(),name
    ob=bpy.data.objects.new(name,me);coll.objects.link(ob)
    if material:me.materials.append(material)
    uv=me.uv_layers.new(name='UVMap')
    for p in me.polygons:
        p.use_smooth=smooth
        for li in p.loop_indices:
            co=me.vertices[me.loops[li].vertex_index].co;uv.data[li].uv=(.5+co.x/.20,(co.z-1.53)/.28)
    return ob

def ellipsoid(name,c,r,material,coll,n=24,rows=12):
    vs=[(c[0],c[1],c[2]-r[2])]
    for i in range(1,rows):
        a=math.pi*i/rows
        for j in range(n):
            t=math.tau*j/n;vs.append((c[0]+r[0]*math.sin(a)*math.sin(t),c[1]-r[1]*math.sin(a)*math.cos(t),c[2]-r[2]*math.cos(a)))
    vs.append((c[0],c[1],c[2]+r[2]));fs=[(0,1+(j+1)%n,1+j) for j in range(n)]
    for i in range(rows-2):
        for j in range(n):a=1+i*n+j;b=1+i*n+(j+1)%n;fs.append((a,b,b+n,a+n))
    last=1+(rows-2)*n;fs.extend([(last+j,last+(j+1)%n,len(vs)-1) for j in range(n)])
    return mesh(name,vs,fs,material,coll)

def camera(name,loc,target,scale,coll,perspective=False):
    data=bpy.data.cameras.new(name);ob=bpy.data.objects.new(name,data);coll.objects.link(ob);ob.location=loc
    ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
    data.type='PERSP' if perspective else 'ORTHO';data.ortho_scale=scale;data.lens=60
    return ob

def studio(scene,coll,mode='neutral'):
    w=bpy.data.worlds.new('PS2 | '+mode);w.use_nodes=True;scene.world=w
    bg=w.node_tree.nodes['Background'];bg.inputs['Color'].default_value=(.09,.10,.12,1);bg.inputs['Strength'].default_value=.65
    specs=[('Key',(-3,-4,5),320,4,(1,.94,.86)),('Fill',(3,-2,3),160,4,(.80,.88,1)),('Back',(1,3,4),190,3,(.85,.91,1))]
    for name,loc,power,size,color in specs:
        d=bpy.data.lights.new('PS2 | '+mode+' '+name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
        o=bpy.data.objects.new(d.name,d);coll.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1.1))-o.location).to_track_quat('-Z','Y').to_euler()
    scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
    scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
    scene.render.film_transparent=False;scene.render.resolution_percentage=100

def render(scene,camera,path,x=512,y=768):
    scene.camera=camera;scene.render.resolution_x=x;scene.render.resolution_y=y;scene.render.filepath=path
    bpy.context.window.scene=scene;bpy.ops.render.render(write_still=True,scene=scene.name)
