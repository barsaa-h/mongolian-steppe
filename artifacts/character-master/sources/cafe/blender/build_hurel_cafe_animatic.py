"""EP01 Hurel café: turn included GLB + shot manifest into a Blender animated shot-blocking project.

Usage (in Blender): Scripting > Text Editor > Open this file > Run Script
Or: blender --background --python blender/build_hurel_cafe_animatic.py

Requires Blender with the glTF 2.0 importer (normally bundled). No external addons.
Creates/overwrites `blender/EP01_Hurel_Cafe_ANIMATIC_v1.blend`.
Not a final performance: colored figures are scaled, animated blocking proxies.
"""
import bpy, json, math
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parent.parent
manifest=json.loads((ROOT/'data'/'scene_manifest.json').read_text(encoding='utf-8'))
source=ROOT/'3d'/'hurel_cafe_graybox_v1.glb'
if not source.exists():raise FileNotFoundError(source)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
bpy.ops.import_scene.gltf(filepath=str(source))

# Build scene grouping and keep proxy meshes from obscuring our animated proxies.
for ob in bpy.data.objects:
 if ob.name.startswith('ACTOR_STATIC_'):
  ob.hide_render=True
  ob.hide_set(True)

# Explicit scene settings are a lightweight baseline, not an approved render preset.
try:scene.render.engine='BLENDER_EEVEE_NEXT'
except Exception:
 try:scene.render.engine='BLENDER_EEVEE'
 except Exception:pass
scene.render.resolution_x=1280
scene.render.resolution_y=720
scene.render.resolution_percentage=100
scene.render.fps=manifest['fps']
scene.frame_start=1
scene.frame_end=manifest['end_frame']
scene.render.image_settings.file_format='PNG'
scene.render.filepath=str(ROOT/'previews'/'blender_frame_')
scene.camera=None
scene.world=bpy.data.worlds.new('WORLD_LateAutumn_Overcast')
scene.world.use_nodes=True
node=scene.world.node_tree.nodes.get('Background')
node.inputs['Color'].default_value=(.17,.18,.21,1)
node.inputs['Strength'].default_value=.35

# Add own collection for cameras and animated character placeholders.
def collection(name):
 col=bpy.data.collections.new(name)
 scene.collection.children.link(col)
 return col
camcol=collection('Cameras_EP01')
actorcol=collection('REPLACE_WITH_OWN_RIGS')
lightscol=collection('Lighting_Proxy')

def attach(obj,col):
 for c in list(obj.users_collection): c.objects.unlink(obj)
 col.objects.link(obj)

def mkmat(name,color):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name)
 m.diffuse_color=(*color,1)
 m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 if bs:bs.inputs['Base Color'].default_value=(*color,1)
 return m
colors={'GANAA':(.75,.47,.22),'HUREL':(.23,.55,.28),'DASHA':(.72,.29,.32),'DRIVER_A':(.25,.4,.75),'DRIVER_B':(.25,.4,.75)}

# Character root empties are the attach points for the user's real rigged meshes.
roots={}
for who,point in manifest['initial_actor_proxy_xy'].items():
 root=bpy.data.objects.new('RIG_ANCHOR_'+who,None)
 actorcol.objects.link(root)
 root.empty_display_type='ARROWS'
 root.empty_display_size=.55
 root.location=(point[0],point[1],0)
 roots[who]=root

 # Visible stage proxies - intentionally not a facial animation substitute.
 bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=.29,depth=1.13)
 ob=bpy.context.object;ob.name='PROXY_'+who+'_BODY';attach(ob,actorcol)
 ob.parent=root; ob.location=(0,0,1.05); ob.data.materials.append(mkmat('M_'+who,colors[who]))
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,radius=.21)
 head=bpy.context.object;head.name='PROXY_'+who+'_HEAD';attach(head,actorcol)
 head.parent=root;head.location=(0,0,1.76);head.data.materials.append(mkmat('M_'+who,colors[who]))

# Position keyframes as waypoints for blocking; characters hold before action.
for who,points in manifest['blocking_waypoints'].items():
 root=roots[who]
 for t,x,y in points:
  root.location=(x,y,0)
  root.keyframe_insert(data_path='location',frame=round(t*scene.render.fps)+1,group='BLOCKING')
 if root.animation_data and root.animation_data.action:
  for fc in root.animation_data.action.fcurves:
   for kp in fc.keyframe_points:kp.interpolation='LINEAR'

# Interior roof visible for exterior introduction, removed after 6s for camera / rig access.
for ob in bpy.data.objects:
 if ob.name.startswith('ROOF_Liftable'):
  ob.hide_render=False;ob.keyframe_insert(data_path='hide_render',frame=1)
  ob.hide_render=True;ob.keyframe_insert(data_path='hide_render',frame=145)

# Camera cuts with explicit optical targets, and frame bounds in names.
for sh in manifest['shots']:
 camdata=bpy.data.cameras.new(sh['id']+'_Lens')
 cam=bpy.data.objects.new(sh['id']+'_'+sh['description'].split('/')[0][:28].replace(' ','_'),camdata)
 camcol.objects.link(cam)
 cam.location=sh['camera_m']
 direction=Vector(sh['target_m'])-cam.location
 cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
 camdata.lens=sh['lens_mm']
 camdata.sensor_width=36
 camdata.clip_end=400
 camdata.dof.use_dof=False
 marker=scene.timeline_markers.new(sh['id']+f"_{sh['start_sec']:02d}s",frame=sh['start_frame'])
 marker.camera=cam
 if scene.camera is None:scene.camera=cam

# Broad soft natural overcast (not uniform blue moonlight) and warm café practicals.
def area(name,loc,energy,color,size,target):
 dat=bpy.data.lights.new(name,'AREA');dat.energy=energy;dat.color=color;dat.shape='DISK';dat.size=size
 ob=bpy.data.objects.new(name,dat);lightscol.objects.link(ob);ob.location=loc
 ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
 return ob
area('LIGHT_Interior_Practical',(-1,0,2.88),410,(1.0,.70,.42),5.0,(-1,0,0))
area('LIGHT_Heater_East',(5.5,2.0,2.4),110,(1.0,.41,.19),2.0,(4.5,1.2,1.1))
area('LIGHT_Window_Cold',(1,-9,5.0),800,(.67,.77,1.0),10.0,(0,-1,1))
area('LIGHT_Outside_Sky',(6,-17,12),900,(.77,.84,1.0),14.0,(0,-11,0))

# Floor edges, basic tracking and room sounds should be replaced by real takes.
scene.frame_set(1)
scene.render.film_transparent=False
scene['CANON']='EP01 production-directed v2.1 (E01-D023..E01-D033), against Season v3.0'
scene['STATUS']='CAMERA + RIG BLOCKOUT ONLY; do not render as final animation'
scene['START_TIMECODE']='00:00:00:00'
scene['DURATION']='00:01:24:00 @24fps'
scene['EP08_REUSE']='Same geometry; preserve counter, ledger and KAMAZ wreck positions'
scene['SOUND']='See data/sound_events.csv; no real audio has been recorded or attached'

output=ROOT/'blender'/'EP01_Hurel_Cafe_ANIMATIC_v1.blend'
output.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(output))
print('Saved',output,'shots',len(manifest['shots']),'frames',scene.frame_end)
