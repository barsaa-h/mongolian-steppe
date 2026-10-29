"""Retract the upper throat during speech so the rotating chin stays clear."""
import bpy
from mathutils import Vector

def apply(ctx):
    ob=bpy.data.objects['PS2 | neck'];keys=ob.data.shape_keys.key_blocks
    if 'Jaw_Clearance' in keys:return
    basis=keys['Basis'];key=ob.shape_key_add(name='Jaw_Clearance',from_mix=False)
    affected=0
    for i,v in enumerate(basis.data):
        p=v.co
        top=max(0.,min(1.,(p.z-1.515)/.030))
        front=max(0.,min(1.,(.030-p.y)/.060))
        key.data[i].co=p+Vector((-p.x*.18*top,.033*top*front,-.004*top*front))
        affected+=top*front>.01
    d=key.driver_add('value').driver
    for name,prop in {'j':'JawOpen','a':'AA','e':'EE','o':'OH','c':'MBP'}.items():
        v=d.variables.new();v.name=name;v.type='SINGLE_PROP';v.targets[0].id=ctx['facial']['controls'];v.targets[0].data_path='["'+prop+'"]'
    d.expression='max(0,min(.85,j+.38*a+.12*e+.38*o-.4*c))'
    assert affected>0
    return affected
