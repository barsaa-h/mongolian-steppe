import bpy, math
rig=bpy.data.objects['Character.Rig'];source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))
assert len(rig.data.bones)==137 and len(source.data.vertices)==19158
assert all(bpy.data.actions.get(n) is not None for n in ['Driving_Block','Talk_Check','Deformation_Check'])
collection=next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
meshes=[o for o in collection.objects if o.type=='MESH']
images=[i for i in bpy.data.images if i.users and i.source in ['FILE','GENERATED'] and i.type=='IMAGE']
assert images and all(i.packed_file for i in images)
rig.animation_data.action=bpy.data.actions['Driving_Block']
for f in [1,13,25]:
 bpy.context.scene.frame_set(f)
 for obj in meshes:
  evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=evaluated.to_mesh();assert all(math.isfinite(v) for vertex in mesh.vertices for v in vertex.co);evaluated.to_mesh_clear()
print('DRIVER_STUDY_NATIVE_OK',len(meshes),len(rig.data.bones),len(source.data.vertices))
