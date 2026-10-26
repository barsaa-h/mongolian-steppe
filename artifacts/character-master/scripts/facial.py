"""Additive expression shapes on the neutral identity, with source-index correspondence."""
import gzip
import json
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.kdtree import KDTree

ROOT=Path(__file__).resolve().parents[1]
TARGETS=ROOT.parents[1]/'assets/sources/mpfb2-2.0.18/mpfb/data/targets'
EXPRESSIONS=json.loads((ROOT/'dna/expressions.json').read_text())

def source_map(path,count):
    rows=[];reading=False
    for line in path.read_text().splitlines():
        parts=line.split()
        if not parts or parts[0].startswith('#'):continue
        if parts[0]=='verts':reading=True;continue
        if not reading:continue
        try:values=[float(v) for v in parts]
        except ValueError:break
        if len(values)==1:rows.append([(int(values[0]),1)])
        elif len(values)==9:rows.append([(int(values[i]),values[i+3]) for i in range(3)])
        else:break
        if len(rows)==count:return rows
    raise ValueError(f'Incomplete fitted source mapping: {path}')

def set_expression(collection,name='neutral',weight=1):
    for obj in collection.objects:
        if obj.type!='MESH' or not obj.data.shape_keys:continue
        for key in obj.data.shape_keys.key_blocks:
            if key.name.startswith('EXP.'):key.value=weight if key.name=='EXP.'+name else 0
    bpy.context.view_layer.update()

def add_expressions(dna,collection,rig):
    source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))
    body=bpy.data.objects['Body.Skin']
    attribute=body.data.attributes.get('source_vertex')
    assert attribute and len(attribute.data)==len(body.data.vertices),'Missing source-index correspondence'
    nearest=KDTree(len(body.data.vertices))
    body_ids=[v.value for v in attribute.data]
    for v in body.data.vertices:nearest.insert(v.co,body_ids[v.index])
    nearest.balance()
    meshes=[o for o in collection.objects if o.type=='MESH' and o.get('role') in ['Body','Eyebrows','Teeth','Tongue'] or o.type=='MESH' and o.name.startswith('Details.')]
    maps={}
    for obj in meshes:
        attr=obj.data.attributes.get('source_vertex')
        if attr:maps[obj.name]=[[(v.value,1)] for v in attr.data]
        elif obj.get('source_asset'):maps[obj.name]=source_map(ROOT.parents[1]/'assets/sources/makehuman-core'/obj['source_asset'],len(obj.data.vertices))
        else:maps[obj.name]=[[(nearest.find(v.co)[1],1)] for v in obj.data.vertices]
        obj.shape_key_add(name='Basis',from_mix=False)
    family='caucasian' if dna['ancestry_preset']=='slavic' else 'asian'
    eye_distance=(rig.data.bones['eye.L'].head_local-rig.data.bones['eye.R'].head_local).length
    head_scale=min(1.4,max(.45,eye_distance/.062))
    for name,units in EXPRESSIONS.items():
        deltas={}
        for unit,weight in units.items():
            with gzip.open(TARGETS/'expression/units'/family/(unit+'.target.gz'),'rt') as stream:
                for line in stream:
                    if not line.strip() or line.startswith('#'):continue
                    i,x,z,y=line.split();index=int(i)
                    delta=Vector((float(x),-float(y),float(z)))*(.1*weight*head_scale)
                    deltas[index]=deltas.get(index,Vector())+delta
        full=source.shape_key_add(name='EXP.'+name,from_mix=False)
        for index,delta in deltas.items():full.data[index].co+=delta
        full.value=0
        for obj in meshes:
            key=obj.shape_key_add(name='EXP.'+name,from_mix=False)
            for vertex,weights in zip(key.data,maps[obj.name]):
                for index,weight in weights:
                    if index in deltas:vertex.co+=deltas[index]*weight
            key.value=0
    set_expression(collection)
    keys=body.data.shape_keys
    for frame,name in [(1,'neutral'),(9,'viseme_M'),(17,'viseme_A'),(25,'viseme_E'),(33,'viseme_O'),(41,'blink'),(49,'neutral')]:
        for key in keys.key_blocks:
            if key.name.startswith('EXP.'):
                key.value=1 if key.name=='EXP.'+name else 0
                key.keyframe_insert('value',frame=frame)
    action=keys.animation_data.action;action.name='Talk_Check'
    slot=keys.animation_data.action_slot
    for obj in meshes:
        if obj==body:continue
        obj.data.shape_keys.animation_data_create();obj.data.shape_keys.animation_data.action=action
        obj.data.shape_keys.animation_data.action_slot=slot
    bpy.context.scene.frame_set(1)
    rig['expressions']=json.dumps(['neutral',*EXPRESSIONS])
    rig['expression_workflow']='EXP.* keys are additive to this identity. Neutral means all EXP weights zero.'
    return list(EXPRESSIONS)
