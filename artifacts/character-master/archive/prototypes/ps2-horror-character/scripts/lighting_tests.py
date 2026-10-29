import bpy
from mathutils import Vector
import common as C

SPECS={
 'Cold Exterior':((.050,.070,.100),.42,[((-2,-3,5),250,3.5,(.58,.72,1.)),((2,1,3),120,2,(.60,.76,1.)),((2,-4,2),28,3,(.72,.78,.89))]),
 'Overhead Interior':((.06,.07,.07),.12,[((.20,-.40,3.0),95,.8,(.85,.92,.84)),((-2,-3,2),10,2,(.70,.80,.90))]),
 'Dark Side':((.035,.043,.052),.12,[((-1.5,-1,1.95),45,.7,(.76,.85,1.)),((2,-2,2),3,2,(.72,.79,.9))]),
 'Restrained Warm':((.052,.045,.042),.22,[((.9,-2,2.4),60,1.1,(1.,.67,.41)),((-2,2,3),55,2,(.55,.68,.86)),((-2,-2,2),7,2,(.80,.75,.67))])
}

def create(ctx):
    camera=C.camera('PS2 | Horror portrait',(1.1,-3.5,1.78),(0,-.01,1.66),.76,ctx['studio'])
    scenes={}
    for name,(bg,strength,lights) in SPECS.items():
        scene=bpy.data.scenes.new('PS2 | Light · '+name)
        scene.collection.children.link(ctx['collection'])
        coll=bpy.data.collections.new('PS2 | Lighting · '+name);scene.collection.children.link(coll)
        coll.objects.link(camera)
        world=bpy.data.worlds.new(scene.name);world.use_nodes=True;scene.world=world
        world.node_tree.nodes['Background'].inputs['Color'].default_value=(*bg,1)
        world.node_tree.nodes['Background'].inputs['Strength'].default_value=strength
        for i,(loc,power,size,color) in enumerate(lights):
            data=bpy.data.lights.new(name+' '+str(i),'AREA');data.energy=power;data.size=size;data.color=color
            ob=bpy.data.objects.new('PS2 | '+data.name,data);coll.objects.link(ob);ob.location=loc
            ob.rotation_euler=(Vector((0,0,1.65))-ob.location).to_track_quat('-Z','Y').to_euler()
        scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
        scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG'
        scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
        scene.camera=camera;scene.render.fps=24;scenes[name]=scene.name
    return scenes
