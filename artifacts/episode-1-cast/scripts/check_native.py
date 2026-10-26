"""Validate actual native cast files; refresh embedded episode instructions."""
import json
import math
import sys
from pathlib import Path
import bpy
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parents[1]/'artifacts/character-master/scripts'))
from dna import compile_dna,fingerprint
from facial import EXPRESSIONS,set_expression
profiles=json.loads((ROOT/'cast.json').read_text())
results=[]
for profile in profiles:
    id=profile['id'];folder=ROOT/id
    bpy.ops.wm.open_mainfile(filepath=str(folder/'Character-Master.blend'))
    bpy.context.preferences.filepaths.save_version=0
    rig=bpy.data.objects['Character.Rig']
    assert rig['cast_id']==id
    assert len(rig.data.bones)==137 and sum(b.name.startswith('finger') for b in rig.data.bones)==30
    source=next(o for o in bpy.data.objects if o.name.startswith('SOURCE.Body'))
    assert len(source.data.vertices)==19158 and len(source.data.shape_keys.key_blocks)>1
    authoring=next(c for c in bpy.data.collections if c.name.startswith('AUTHORING'))
    assert authoring.hide_viewport and authoring.hide_render
    collection=next(c for c in bpy.data.collections if c.name.startswith('CHARACTER'))
    meshes=[o for o in collection.objects if o.type=='MESH']
    roles={o.get('role') for o in meshes}
    assert {'Body','Hands.L','Hands.R','Clothes.Top','Hair','Eyes','Shoes'}<=roles
    eyes=bpy.data.objects['Eyes']
    assert len(eyes.data.vertices)>500 and all(p.use_smooth for p in eyes.data.polygons)
    shader=eyes.data.materials[0].node_tree.nodes.get('Principled BSDF')
    assert .15<=shader.inputs['Roughness'].default_value<=.4
    assert shader.inputs['Specular IOR Level'].default_value>=.3
    assert 'Eyelashes' not in roles
    required={'altan':'Props.PaperCrown','hurel':'Clothes.Apron','dulmaa':'Clothes.DeelCollar','yard-guard':'Clothes.GuardCap','dasha':'Story.ForearmBandage'}
    if id in required:assert required[id] in roles
    report=json.loads((folder/'report.json').read_text())
    recipe=json.loads((ROOT/'recipes'/(id+'.json')).read_text())
    dna=json.loads((ROOT/'dna'/(id+'.json')).read_text())
    assert recipe==compile_dna(dna)
    assert json.loads((folder/'dna.json').read_text())==dna
    assert rig['dna_hash']==report['dnaHash']==fingerprint(dna)
    assert bpy.data.actions.get('Talk_Check') is not None
    body=bpy.data.objects['Body.Skin']
    assert body.data.attributes.get('source_vertex') is not None
    assert set('EXP.'+name for name in EXPRESSIONS)<=set(body.data.shape_keys.key_blocks.keys())
    actions=[]
    for obj in meshes:
        if obj.data.shape_keys and obj.data.shape_keys.animation_data:
            animation=obj.data.shape_keys.animation_data;actions.append((animation,animation.action,animation.action_slot));animation.action=None
    neutral=[v.co.copy() for v in body.data.vertices]
    for name in EXPRESSIONS:
        set_expression(collection,name)
        evaluated=body.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=evaluated.to_mesh()
        assert max((v.co-neutral[v.index]).length for v in mesh.vertices)>1e-6,name
        assert all(math.isfinite(c) for v in mesh.vertices for c in v.co)
        evaluated.to_mesh_clear()
    set_expression(collection)
    for animation,action,slot in actions:animation.action=action;animation.action_slot=slot
    assert report['id']==id and report['scriptAge']==profile['scriptAge']
    assert report['skinDetailCount']==profile['pimples']
    if profile['skinLook'] in ['elder','weathered','tired']:assert report['wrinkleParts']>=3
    if id=='altan':assert report['headHeightFraction']>.11 and not report['skinDetailCount'] and not report['wrinkleParts']
    if id=='dasha':assert 'lowerarm01.L' in bpy.data.objects['Story.ForearmBandage'].vertex_groups
    if id=='ganaa':assert 'lowerarm01.R' in bpy.data.objects['Story.ForearmBandage'].vertex_groups
    images=[i for i in bpy.data.images if i.users>0 and i.source in ['FILE','GENERATED'] and i.type=='IMAGE']
    assert images and all(i.packed_file for i in images), 'Unpacked image dependency: '+id
    for frame in [1,25,49]:
        bpy.context.scene.frame_set(frame)
        depsgraph=bpy.context.evaluated_depsgraph_get()
        for obj in meshes:
            evaluated=obj.evaluated_get(depsgraph);mesh=evaluated.to_mesh()
            assert all(all(math.isfinite(c) for c in v.co) for v in mesh.vertices),obj.name
            evaluated.to_mesh_clear()
    bpy.context.scene.frame_set(1)
    for name,text in [('EPISODE_AGENT_GUIDE',(ROOT/'README.md').read_text()),('episode-recipe.json',json.dumps(recipe,ensure_ascii=False,indent=2))]:
        document=bpy.data.texts.get(name) or bpy.data.texts.new(name);document.clear();document.write(text)
    bpy.ops.wm.save_as_mainfile(filepath=str(folder/'Character-Master.blend'))
    results.append({'id':id,'meshes':len(meshes),'sourceVertices':19158,'bones':137,'fingerBones':30,'packedImages':len(images),'blemishes':report['skinDetailCount'],'wrinkleParts':report['wrinkleParts'],'eyeVertices':len(eyes.data.vertices),'stockLashCardsRemoved':True,'poses':[1,25,49]})
(ROOT/'native-report.json').write_text(json.dumps({'passed':True,'blender':bpy.app.version_string,'results':results},indent=2)+'\n')
print('EPISODE_NATIVE_OK',len(results),flush=True)
