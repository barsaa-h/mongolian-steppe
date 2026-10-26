"""Read-only export check in a disposable background Blender process."""
import bpy, json, os
from mathutils import Vector
OUT='/home/barsaa/mongolian-steppe/artifacts/psx-casual-guy'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=OUT+'/casual-guy.glb')
parts=[o for o in bpy.context.scene.objects if o.type=='MESH']
assert len(parts)==120,len(parts)
assert all(o.data.uv_layers for o in parts)
assert all(not o.data.validate() for o in parts)
triangles=0
for o in parts:
    o.data.calc_loop_triangles();triangles+=len(o.data.loop_triangles)
assert triangles==6313,triangles
assert not any('Car' in o.name for o in bpy.context.scene.objects)
images={node.image for obj in parts for mat in obj.data.materials if mat and mat.use_nodes for node in mat.node_tree.nodes if node.type=='TEX_IMAGE' and node.image}
assert len(images)==12,len(images)
for im in images:
    assert len(im.pixels[:])==im.size[0]*im.size[1]*4 and im.size[0]>0,im.name
    assert im.has_data,im.name
with bpy.data.libraries.load(OUT+'/casual-guy.blend',link=False) as (src,dst):
    dst.collections=['STUDIO | Cameras and Lighting']
    dst.worlds=['CG | muted studio']
scene=bpy.context.scene
scene.collection.children.link(dst.collections[0]);scene.world=dst.worlds[0]
scene.camera=bpy.data.objects['Camera | full body']
scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
scene.view_settings.view_transform='AgX'
scene.render.resolution_x=600;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.render.filepath=OUT+'/export-roundtrip.png'
bpy.ops.render.render(write_still=True)
report={'glb_import_passed':True,'mesh_validation_passed':True,'triangles':triangles,'meshes':len(parts),'textures_loaded':True}
with open(OUT+'/export-check.json','w') as f:json.dump(report,f,indent=2)
print('ASSET_CHECK '+json.dumps(report))
