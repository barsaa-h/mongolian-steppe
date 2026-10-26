"""Render evidence from the saved master; never writes the blend."""
import bpy,sys,json
from pathlib import Path
OUT=Path(__file__).resolve().parent.parent;sys.path.insert(0,str(OUT/'scripts'))
import scene_access,common as C,face,body_rig
ctx=scene_access.context();scene=ctx['scene'];bpy.context.window.scene=scene
rig=ctx['body_rig']['rig'];ctl=ctx['facial']['controls']
job=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'stills'
for ob in (rig,ctl):
    if ob.animation_data:ob.animation_data.action=None
body_rig.reset_pose(rig);face.set_expression(ctx,'Neutral')
scene.render.threads_mode='FIXED';scene.render.threads=12

if job in ['stills','expressions']:
    if job=='stills':
        for name,camera in ctx['comparison_cameras'].items():
            C.render(scene,camera,str(OUT/'Comparisons'/('After_'+name+'.png')))
        C.render(scene,ctx['close_camera'],str(OUT/'Comparisons'/'After_Face_720p.png'),1280,720)
    for name in face.EMOTIONS:
        face.set_expression(ctx,name)
        C.render(scene,ctx['close_camera'],str(OUT/'Expressions'/(name.replace(' ','_')+'_720p.png')),1280,720)
    if job=='stills':
        face.set_expression(ctx,'Sadness',.45)
        (OUT/'Lighting_Tests').mkdir(exist_ok=True)
        for name in ['Cold Exterior','Overhead Interior','Dark Side','Restrained Warm']:
            light_scene=bpy.data.scenes['PS2 | Light · '+name]
            light_scene.render.threads_mode='FIXED';light_scene.render.threads=12
            C.render(light_scene,light_scene.camera,str(OUT/'Lighting_Tests'/(name.replace(' ','_')+'_720p.png')),1280,720)
elif job in ['dialogue','body']:
    folder=OUT/'Animation_Tests'/(job+'_frames');folder.mkdir(exist_ok=True)
    if job=='dialogue':
        ctl.animation_data.action=bpy.data.actions['PS2_Dialogue_Face']
        rig.animation_data.action=bpy.data.actions['PS2_Dialogue_Body']
        camera=ctx['close_camera']
    else:
        rig.animation_data.action=bpy.data.actions['PS2_FullBody_Test']
        camera=ctx['full_camera'];face.set_expression(ctx,'Exhaustion',.40)
    scene.cycles.samples=8 if job=='body' else 12
    for index,frame in enumerate(range(1,97,2),1):
        scene.frame_set(frame);bpy.context.view_layer.update()
        C.render(scene,camera,str(folder/f'{index:04d}.png'),1280,720)
    print('DELIVERY_ANIMATION_DONE',job,48,flush=True)
elif job=='horror':
    hc=bpy.data.objects['PS2 | HORROR_CONTROLS']
    for prop in ['Zombie','FaceBruise','FaceBlood','BodyDirt','TornSleeve','DetachWristL']:hc[prop]=1.
    hc['WristSeparation']=1.;hc.update_tag();bpy.context.view_layer.update()
    face.set_expression(ctx,'Vacant Zombie')
    C.render(scene,ctx['close_camera'],str(OUT/'Horror_Variants'/'Zombie_Injuries_720p.png'),1280,720)
    C.render(scene,ctx['full_camera'],str(OUT/'Horror_Variants'/'Torn_Separation_720p.png'),1280,720)
else:raise ValueError(job)
print('DELIVERY_RENDER_DONE',job,flush=True)
