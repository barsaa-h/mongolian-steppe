"""Run with Blender --background --factory-startup --python-exit-code 1 --python."""
import bpy,json
OUT='/home/barsaa/mongolian-steppe/artifacts/shearling-field-guy'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=OUT+'/field-guy.glb')
parts=[o for o in bpy.context.scene.objects if o.type=='MESH']
assert len(parts)==13,len(parts)
triangles=0
for o in parts:
    assert not o.data.validate(),o.name
    assert o.data.uv_layers,o.name
    o.data.calc_loop_triangles();triangles+=len(o.data.loop_triangles)
assert triangles==11743,triangles
images={n.image for o in parts for m in o.data.materials if m and m.use_nodes for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image}
assert len(images)==7,len(images)
for im in images:
    assert len(im.pixels[:])==im.size[0]*im.size[1]*4 and im.size[0]>0,im.name
assert not any('Car' in o.name for o in parts)
assert not any(o.type=='ARMATURE' for o in bpy.context.scene.objects)
report={'glb_reimport_passed':True,'valid_meshes':len(parts),'triangles':triangles,'embedded_textures_loaded':len(images),'unrigged':True}
with open(OUT+'/export-check.json','w') as f:json.dump(report,f,indent=2)
print('ASSET_CHECK '+json.dumps(report))
