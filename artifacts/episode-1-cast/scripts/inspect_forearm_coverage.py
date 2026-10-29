"""Inspect approximate right forearm coverage in an opened Ganaa source.

This is a rest-pose spatial histogram, not a garment clearance check.
"""
import bpy
from collections import Counter
from mathutils import Vector
rig=bpy.data.objects['Character.Rig'];r=rig.data.bones
start=rig.matrix_world@r['lowerarm01.R'].head_local;end=rig.matrix_world@r['wrist.R'].head_local;axis=end-start;length=axis.length;axis.normalize()
assert length > .05
print('arm length',round(length,4),'elbow',tuple(start),'wrist',tuple(end))
source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'));source.users_collection[0].hide_viewport=False
for m in source.modifiers:
 if m.type=='MASK':m.show_viewport=False
bpy.context.view_layer.update()
for obj in [source,bpy.data.objects['Body.Skin'],bpy.data.objects['Hands.R'],bpy.data.objects['Clothes.Top'],bpy.data.objects['Story.ForearmBandage']]:
 evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=evaluated.to_mesh();hist=Counter()
 for v in mesh.vertices:
  point=evaluated.matrix_world@v.co;t=(point-start).dot(axis)/length;distance=(point-start-axis*((point-start).dot(axis))).length
  if -.1<=t<1.2 and distance<.13:hist[int(t*10)//2*2]+=1
 print(obj.name,sorted(hist.items()))
 evaluated.to_mesh_clear()
