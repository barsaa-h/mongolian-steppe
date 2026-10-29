"""Draft cheek-contact blocking based on the existing driving study; not a performance."""
import bpy,math,sys
from pathlib import Path
from mathutils import Quaternion,Vector
from mathutils.bvhtree import BVHTree
out=Path(sys.argv[sys.argv.index('--')+1]).resolve()
if out.exists() and (not out.is_dir() or any(out.iterdir())):raise ValueError('Use a new or empty study directory')
out.mkdir(parents=True,exist_ok=True)
r=bpy.data.objects['Character.Rig'];assert r.get('cast_id')=='ganaa' and len(r.data.bones)==137
r.animation_data.action=bpy.data.actions['Driving_Block'];bpy.context.scene.frame_set(13);bpy.context.view_layer.update()
base={b.name:(b.location.copy(),b.rotation_quaternion.copy(),b.scale.copy()) for b in r.pose.bones}
o=bpy.data.objects['Body.Skin'].evaluated_get(bpy.context.evaluated_depsgraph_get());m=o.to_mesh();m.calc_loop_triangles();tree=BVHTree.FromPolygons([o.matrix_world@v.co for v in m.vertices],[tuple(t.vertices) for t in m.loop_triangles],all_triangles=True);hit,normal,idx,d=tree.find_nearest(Vector((-.08,-.45,.87)));o.to_mesh_clear()
normal=Vector((-.53999835,-.75573325,-.37049860)).normalized();print('CHEEK',hit[:],normal[:]);goal=hit+normal*.015
r.animation_data.action=None
for b in r.pose.bones:b.rotation_mode='QUATERNION'
def direct(name,direction):
 b=r.pose.bones[name];rest=b.bone.matrix_local.to_quaternion();pd=b.parent.matrix.to_quaternion()@b.parent.bone.matrix_local.to_quaternion().inverted() if b.parent else Quaternion();current=pd@rest
 b.rotation_quaternion=rest.inverted()@pd.inverted()@((current@Vector((0,1,0))).rotation_difference(Vector(direction).normalized())@current);bpy.context.view_layer.update()
side='R';wrist_goal=goal.copy()
for i in range(20):
 target=r.matrix_world.inverted()@wrist_goal;shoulder=r.pose.bones['upperarm01.R'].head.copy();distance=(target-shoulder).length
 a=sum(r.data.bones[n+'.R'].length for n in ('upperarm01','upperarm02'));b=sum(r.data.bones[n+'.R'].length for n in ('lowerarm01','lowerarm02'));assert abs(a-b)<distance<a+b,(distance,a,b)
 axis=(target-shoulder).normalized();pole=r.matrix_world.inverted()@Vector((-.43,-.35,.70));bend=pole-shoulder;bend-=axis*bend.dot(axis);bend.normalize();along=(a*a-b*b+distance*distance)/(2*distance);elbow=shoulder+axis*along+bend*math.sqrt(max(0,a*a-along*along))
 for n in ('upperarm01','upperarm02'):direct(n+'.R',elbow-shoulder)
 fore=r.pose.bones['lowerarm01.R']
 for n in ('lowerarm01','lowerarm02'):direct(n+'.R',target-fore.head)
 direct('wrist.R',(0,-.1,1));r.pose.bones['wrist.R'].rotation_quaternion @= Quaternion((0,1,0),-1.5);bpy.context.view_layer.update()
 palm=r.pose.bones['metacarpal2.R'];p=r.matrix_world@palm.head.lerp(palm.tail,.5);delta=goal-p;wrist_goal+=delta
 if delta.length<.0001:break
print('PALM',delta.length,'ITER',i)
for f in range(1,6):
 for j in range(1,4):r.pose.bones[f'finger{f}-{j}.R'].rotation_quaternion=Quaternion((1,0,0),.15 if j==1 else .2)
bpy.context.view_layer.update();impact={b.name:(b.location.copy(),b.rotation_quaternion.copy(),b.scale.copy()) for b in r.pose.bones}
action=bpy.data.actions.new('Cheek_Block');action.use_fake_user=True;r.animation_data.action=action
for seconds,pose in [(0,base),(21,base),(22.15,impact),(22.35,impact),(24.5,base),(30,base)]:
 for bone in r.pose.bones:
  bone.location,bone.rotation_quaternion,bone.scale=pose[bone.name]
  bone.keyframe_insert('location',frame=24*seconds);bone.keyframe_insert('rotation_quaternion',frame=24*seconds);bone.keyframe_insert('scale',frame=24*seconds)
# Remove Bezier overshoot from the temporary blocking, not a finished performance.
for slot in action.slots:
 for fc in action.layers[0].strips[0].channelbag(slot).fcurves:
  for key in fc.keyframe_points:key.interpolation='LINEAR'
r.animation_data.action=None
for b in r.pose.bones:b.location=(0,0,0);b.rotation_quaternion=(1,0,0,0);b.scale=(1,1,1)
bpy.context.scene.frame_set(0);bpy.context.preferences.filepaths.save_version=0;bpy.ops.wm.save_as_mainfile(filepath=str(out/'Character-Master.blend'))
coll=next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'));bpy.ops.object.select_all(action='DESELECT')
for obj in [r,*[o for o in coll.objects if o.type=='MESH']]:obj.select_set(True)
bpy.context.view_layer.objects.active=r
bpy.ops.export_scene.gltf(filepath=str(out/'character.glb'),use_selection=True,export_format='GLB',export_animations=True,export_animation_mode='ACTIONS',export_force_sampling=True,export_frame_range=False,export_extras=True,export_apply=True,export_morph=True)
print('CHEEK_BLOCK_DONE')
