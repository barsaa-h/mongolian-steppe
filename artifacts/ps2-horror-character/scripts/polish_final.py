"""Final restrained crown silhouette and brow arch, applied once."""
import bpy,math

def apply(ctx):
    head=ctx['facial']['head']
    if head.get('final_crown_polish'):return
    # Compress the tall crown without adding geometry or changing expressive deltas.
    for key in head.data.shape_keys.key_blocks:
        for v in key.data:
            if v.co.z>1.75:v.co.z=1.75+(v.co.z-1.75)*.78
    for ob in ctx['hair']:
        for v in ob.data.vertices:
            if v.co.z>1.75:v.co.z=1.75+(v.co.z-1.75)*.78
    for ob in ctx['facial']['brows']:
        for key in ob.data.shape_keys.key_blocks:
            for v in key.data:v.co.z+=.0013*math.exp(-((abs(v.co.x)-.041)/.015)**2)
    head['final_crown_polish']=True
