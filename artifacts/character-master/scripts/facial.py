"""Additive expression shapes on the neutral identity, with source-index correspondence."""
import gzip
import json
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.kdtree import KDTree
from dna import FACE_CONTROLS

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
    calm_blink(body, rig)
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

def calm_blink(body, rig):
    """Take the outward puff out of the lid closure so a blink is a crease, not a swollen roll."""
    keys=body.data.shape_keys
    if not keys or 'EXP.blink' not in keys.key_blocks:
        return
    blink=keys.key_blocks['EXP.blink']
    basis=keys.key_blocks[blink.relative_key.name]
    centers=[rig.data.bones[name].head_local for name in ('eye.L','eye.R') if name in rig.data.bones]
    if not centers:
        return
    for index, vertex in enumerate(body.data.vertices):
        if min((vertex.co-center).length for center in centers)>.035:
            continue
        delta=blink.data[index].co-basis.data[index].co
        puff=delta.dot(vertex.normal)
        if puff>0:
            blink.data[index].co-=vertex.normal*puff*.85

def add_control_morphs(body):
    """Export the named face controls as live morphs on a zeroed base. Cast identity stays baked."""
    attribute=body.data.attributes.get('source_vertex')
    if attribute is None:
        return []
    index_of={}
    for index, item in enumerate(attribute.data):
        index_of.setdefault(item.value, []).append(index)
    if not body.data.shape_keys:
        body.shape_key_add(name='Basis', from_mix=False)
    names=[]
    for name, control in FACE_CONTROLS.items():
        for label, paths in (('pos', control['positive']), ('neg', control['negative'])):
            if not paths:
                continue
            key=body.shape_key_add(name=f'FACE.{name}.{label}', from_mix=False)
            apply_targets(key, paths, index_of)
            key.value=0
            names.append(key.name)
    return names

def apply_targets(key, paths, index_of):
    for path in paths:
        with gzip.open(TARGETS/(path+'.target.gz'), 'rt') as stream:
            for line in stream:
                parts=line.split()
                if len(parts)<4 or parts[0].startswith('#'):
                    continue
                try:
                    index=int(parts[0]); x=float(parts[1]); z=float(parts[2]); y=float(parts[3])
                except ValueError:
                    continue
                for vertex in index_of.get(index, ()):
                    point=key.data[vertex]
                    point.co.x+=x
                    point.co.y-=y
                    point.co.z+=z
