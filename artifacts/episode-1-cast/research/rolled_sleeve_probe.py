"""Temporary rolled-sleeve research; research only; inspect all pose and material failures before use."""
import bpy, bmesh, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'artifacts/character-master/scripts'))
from build_character import extract_faces
rig=bpy.data.objects['Character.Rig'];assert rig.get('cast_id')=='ganaa' and bpy.data.actions.get('Driving_Block');collection=next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'));source.users_collection[0].hide_viewport=False
original=bpy.data.objects['Body.Skin'];skin_material=original.data.materials[0]
# Transfer existing facial deltas by the generator's stable source-vertex IDs.
original_ids=[v.value for v in original.data.attributes['source_vertex'].data]
old_keys=original.data.shape_keys;old_basis=old_keys.key_blocks['Basis'];expression_deltas={}
for key in old_keys.key_blocks:
 if key.name.startswith('EXP.'):
  expression_deltas[key.name]={source_id:(key.data[i].co-old_basis.data[i].co).copy() for i,source_id in enumerate(original_ids)}
assert len(expression_deltas)==7
old_action=old_keys.animation_data.action;old_slot=old_keys.animation_data.action_slot
top=bpy.data.objects['Clothes.Top'];bandage=bpy.data.objects['Story.ForearmBandage']
arm=rig.data.bones['lowerarm01.R'].head_local;wrist=rig.data.bones['wrist.R'].head_local;axis=(wrist-arm).normalized();length=(wrist-arm).length
def coordinate(v):
 d=v-arm;t=d.dot(axis);return t/length,(d-axis*t).length
# Work only on duplicates in this unsaved probe.
body=source.copy();body.data=source.data.copy();collection.objects.link(body);body.name='Probe.FullSkin';body.parent=rig;body.matrix_parent_inverse=original.matrix_parent_inverse.copy();body.matrix_basis=original.matrix_basis.copy();body.hide_set(False);body.hide_render=False
for m in body.modifiers:
 if m.type=='ARMATURE':m.object=rig
bpy.ops.object.select_all(action='DESELECT');body.select_set(True);bpy.context.view_layer.objects.active=body
bpy.ops.object.shape_key_remove(all=True,apply_mix=True)
group=body.vertex_groups['Delete.male_casualsuit05'];ids=[]
for v in body.data.vertices:
 t,rad=coordinate(v.co)
 if .38<t<1.15 and rad<.11/rig.scale.x:ids.append(v.index)
group.remove(ids);print('UNMASK',len(ids))
for m in list(body.modifiers):
 if m.type=='MASK':bpy.ops.object.modifier_apply(modifier=m.name)
# Cut sleeve at a conservative location, with overlapping exposed skin beneath cuff.
bm=bmesh.new();bm.from_mesh(top.data);deleted=[]
for f in bm.faces:
 t,rad=coordinate(f.calc_center_median())
 if .53<t<1.3 and rad<.12/rig.scale.x:deleted.append(f)
print('TRIM',len(deleted));bmesh.ops.delete(bm,geom=deleted,context='FACES');bm.to_mesh(top.data);bm.free();top.data.update()
# Replace the runtime body and hands together so the shared seam stays exact.
faces={'L':set(),'R':set()}
for p in body.data.polygons:
 for side in ['L','R']:
  amount=sum(g.weight for i in p.vertices for g in body.data.vertices[i].groups if (name:=body.vertex_groups[g.group].name)=='wrist.'+side or (name.startswith(('finger','metacarpal')) and name.endswith('.'+side)))
  if amount/len(p.vertices)>.5:faces[side].add(p.index)
allfaces=set(range(len(body.data.polygons)))
for name in ['Body.Skin','Hands.L','Hands.R']:bpy.data.objects.remove(bpy.data.objects[name],do_unlink=True)
for side in ['L','R']:
 o=extract_faces(body,faces[side],'Hands.'+side,collection);o['role']='Hands.'+side
skin=extract_faces(body,allfaces-faces['L']-faces['R'],'Body.Skin',collection);skin['role']='Body';skin.data.materials.clear();skin.data.materials.append(skin_material)
new_ids=[v.value for v in skin.data.attributes['source_vertex'].data]
assert set(original_ids).issubset(new_ids), 'Existing facial topology disappeared'
basis=skin.shape_key_add(name='Basis',from_mix=False)
for name,deltas in expression_deltas.items():
 key=skin.shape_key_add(name=name,from_mix=False)
 for i,source_id in enumerate(new_ids):
  if source_id in deltas:key.data[i].co=basis.data[i].co+deltas[source_id]
skin.data.shape_keys.animation_data_create();skin.data.shape_keys.animation_data.action=old_action;skin.data.shape_keys.animation_data.action_slot=old_slot

# Use the existing shaded, baked skin on every new part.
for side in ['L','R']:
 hand=bpy.data.objects['Hands.'+side];hand.data.materials.clear();hand.data.materials.append(skin.data.materials[0])
bpy.data.objects.remove(body,do_unlink=True)
# Move existing cloth closer to wrist and narrow it; this remains an artistic prototype.
center=sum((v.co for v in bandage.data.vertices),Vector())/len(bandage.data.vertices);goal=arm+axis*(length*.73)
for vert in bandage.data.vertices:
 d=vert.co-center;vert.co=goal+d-axis*d.dot(axis)*.5
from mathutils.bvhtree import BVHTree
# Fit to the regenerated skin and interpolate its deform weights.
base_meshes=[skin,bpy.data.objects['Hands.R']];points=[];triangles=[];source_weights=[]
for part in base_meshes:
 part.data.calc_loop_triangles();offset=len(points)
 points.extend(v.co.copy() for v in part.data.vertices)
 source_weights.extend([{part.vertex_groups[g.group].name:g.weight for g in v.groups if rig.data.bones.get(part.vertex_groups[g.group].name)} for v in part.data.vertices])
 triangles.extend([tuple(offset+i for i in tri.vertices) for tri in part.data.loop_triangles])
tree=BVHTree.FromPolygons(points,triangles,all_triangles=True)
for group in list(bandage.vertex_groups):bandage.vertex_groups.remove(group)
groups={}
for vertex in bandage.data.vertices:
 hit,normal,idx,distance=tree.find_nearest(vertex.co)
 assert hit is not None and distance < .08
 a,b,c=[points[i] for i in triangles[idx]];v0=b-a;v1=c-a;v2=hit-a
 d00=v0.dot(v0);d01=v0.dot(v1);d11=v1.dot(v1);d20=v2.dot(v0);d21=v2.dot(v1);denom=d00*d11-d01*d01
 assert abs(denom)>1e-14
 w1=(d11*d20-d01*d21)/denom;w2=(d00*d21-d01*d20)/denom;weights={}
 for source_index,weight in zip(triangles[idx],[1-w1-w2,w1,w2]):
  for name,value in source_weights[source_index].items():weights[name]=weights.get(name,0)+weight*value
 weights=sorted(((name,value) for name,value in weights.items() if value>0),key=lambda x:-x[1])[:4];total=sum(value for _,value in weights);assert total>0
 for name,value in weights:
  if name not in groups:groups[name]=bandage.vertex_groups.new(name=name)
  groups[name].add([vertex.index],value/total,'REPLACE')
 vertex.co=hit+normal*(.0015/rig.scale.x)
bandage.data.update();bandage.hide_render=False
source.users_collection[0].hide_viewport=True
rig.animation_data.action=bpy.data.actions['Driving_Block'];bpy.context.scene.frame_set(13)
bpy.context.view_layer.update()
print('PROBE_COUNTS',len(skin.data.vertices),len(bpy.data.objects['Hands.R'].data.vertices))
# Save separately; never replace the approved source.
out=Path(sys.argv[sys.argv.index('--')+1]).resolve();
if out.exists() and (not out.is_dir() or any(out.iterdir())):raise ValueError('Use a new or empty research directory')
out.mkdir(parents=True,exist_ok=True)
rig.animation_data.action=None
for bone in rig.pose.bones:
 bone.location=(0,0,0);bone.rotation_quaternion=(1,0,0,0);bone.scale=(1,1,1)
bpy.context.scene.frame_set(1);bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(out/'Character-Master.blend'))
bpy.ops.object.select_all(action='DESELECT')
meshes=[o for o in collection.objects if o.type=='MESH']
for obj in [rig,*meshes]:obj.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(out/'character.glb'),use_selection=True,export_format='GLB',export_animations=True,export_animation_mode='ACTIONS',export_force_sampling=True,export_frame_range=False,export_extras=True,export_apply=True,export_morph=True)
print('ROLLED_PROBE_OK')
