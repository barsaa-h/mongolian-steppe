"""Small reusable expression assets and a silent four-second phoneme study."""
import bpy, math
import face

def key_controls(ctl, frame):
    for name in face.CONTROL_NAMES:
        ctl.keyframe_insert('["'+name+'"]', frame=frame, group='Facial controls')

def create(ctx):
    ctl=ctx['facial']['controls'];scene=ctx['scene']
    ctl.animation_data_create();poses={}
    for name in face.EMOTIONS:
        action=bpy.data.actions.new('PS2_Face_'+name.replace(' ','_'))
        action.use_fake_user=True;ctl.animation_data.action=action
        face.set_expression(ctx,name);key_controls(ctl,1)
        action.asset_mark();action.asset_data.description='Restrained '+name.lower()+' facial control pose'
        action.asset_data.tags.new('PS2 facial pose');poses[name]=action.name
    action=bpy.data.actions.new('PS2_Dialogue_Face');action.use_fake_user=True
    ctl.animation_data.action=action
    # shortcut: authored phonemes have no audio track; retime against recorded speech for final dialogue.
    phonemes={1:{},7:{'MBP':.75},11:{'AA':.48},16:{'EE':.40},21:{'OH':.40},26:{'MBP':.80},30:{'AA':.52},35:{'EE':.32},40:{},45:{'OH':.40},50:{'AA':.58},55:{'EE':.44},60:{'MBP':.85},65:{'OH':.55},70:{'AA':.42},75:{'EE':.35},80:{'MBP':.72},85:{},96:{}}
    for frame,values in phonemes.items():
        scene.frame_set(frame);face.set_expression(ctx,'Sadness',.36)
        for name in ['AA','EE','OH','MBP']:ctl[name]=values.get(name,0.)
        ctl['GazeYaw']=.10*math.sin((frame-1)*math.pi/96)
        key_controls(ctl,frame)
    for frame,val in [(1,0),(23,0),(25,1),(27,0),(66,0),(68,1),(70,0),(96,0)]:
        for name in ['Blink_L','Blink_R']:
            ctl[name]=float(val);ctl.keyframe_insert('["'+name+'"]',frame=frame,group='Blinks')
    action.asset_mark();action.asset_data.description='Four-second silent speech-shape study with restrained sadness, two blinks and eye direction'
    action.asset_data.tags.new('PS2 dialogue')
    for layer in action.layers:
        for strip in layer.strips:
            for bag in strip.channelbags:
                for curve in bag.fcurves:
                    for p in curve.keyframe_points:p.interpolation='LINEAR'
    ctl.animation_data.action=None;face.set_expression(ctx,'Neutral');scene.frame_set(1)
    assert len(poses)==10 and len(face.CONTROL_NAMES)==20
    return {'poses':poses,'dialogue':action.name,'frames':[1,96],'fps':24,'audio':False,'note':'Silent phoneme and facial performance study; no recorded dialogue was supplied.'}

def dialogue_body(ctx):
    import body_rig,body_animations
    rig=ctx['body_rig']['rig'];scene=ctx['scene'];rig.animation_data_create()
    action=bpy.data.actions.new('PS2_Dialogue_Body');action.use_fake_user=True
    rig.animation_data.action=action
    controls=[b.name for b in rig.pose.bones if b.name not in ['jaw','eye.L','eye.R'] and not b.name.startswith(('upper_arm.','forearm.','hand.','thigh.','shin.','foot.','toe.'))]
    for frame in range(1,97,3):
        scene.frame_set(frame);body_rig.reset_pose(rig)
        body_animations._breathing(rig,(frame-1)/96)
        rig.pose.bones['head'].rotation_euler=(.018*math.sin(frame*.060),.035*math.sin(frame*.040),.014*math.sin(frame*.035))
        body_animations._key_controls(rig,controls,frame)
    action.asset_mark();action.asset_data.description='Small head movement and breathing to accompany the silent facial study'
    rig.animation_data.action=None;body_rig.reset_pose(rig);scene.frame_set(1)
    return action.name
