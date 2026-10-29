import bpy
def context():
    scene=bpy.data.scenes['PS2 | Character Master']
    return {'scene':scene,'collection':bpy.data.collections['PS2 | Clean Character'],
      'studio':bpy.data.collections['PS2 | Neutral Studio'],
      'facial':{'head':bpy.data.objects['PS2 | Head · facial loops'],'controls':bpy.data.objects['PS2 | FACE_CONTROLS']},
      'body_rig':{'rig':bpy.data.objects['PS2 | Character Rig']},
      'face_camera':bpy.data.objects['PS2 | Face front'],
      'close_camera':bpy.data.objects['PS2 | Acting 720p'],
      'full_camera':bpy.data.objects['PS2 | Full body 720p'],
      'comparison_cameras':{n:bpy.data.objects['PS2 | Compare '+n] for n in ['Front','Side','ThreeQuarter']},
      'baseline_scene':bpy.data.scenes['PS2 | Original Reference']}
