"""Native audit and fixed-camera comparisons. Run in Blender with -- audit|before|after."""
import bpy,json,time,sys,hashlib,resource
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parent
VIEWS=[
 ('aerial',(-2200,-2650,1750),(0,0,0),46,4200),
 ('apartment',(595,-660,150),(335,-410,3),44,None),
 ('ger-district',(-1530,-1000,155),(-1180,-650,3),43,None),
 ('market',(-175,-175,10),(-275,-80,2),38,None),
 ('entrance',(402,-408,3.8),(420,-371,2.7),38,None),
 ('street',(-195,-146,1.7),(-280,-112,2.1),36,None),
 ('ger-street',(-1110,-640,1.7),(-1160,-615,2),38,None),
 ('agriculture',(1350,1250,100),(760,1050,2),42,None),
]

def install_cameras():
    s=bpy.context.scene
    for name,pos,target,lens,ortho in VIEWS:
        name='Review.'+name;o=bpy.data.objects.get(name)
        if not o:
            d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);s.collection.objects.link(o)
        o.location=pos;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();o.data.lens=lens;o.data.clip_end=30000
        o.data.type='ORTHO' if ortho else 'PERSP'
        if ortho:o.data.ortho_scale=ortho
    s.render.resolution_x=1280;s.render.resolution_y=800;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'


def audit():
    s=bpy.context.scene;bpy.context.view_layer.update()
    meshes=[o for o in s.objects if o.type=='MESH']
    roots=[o for o in s.objects if o.type=='EMPTY' and o.get('reused_source')]
    report={'filepath':bpy.data.filepath,'sha256':hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest(),'unit_scale':s.unit_settings.scale_length,'objects':len(s.objects),'meshes':len(meshes),'unique_meshes':len({o.data for o in meshes}),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes),'locations':{o.name:list(o.location) for o in s.objects if o.name.startswith('LOC.')},'roads':{o.name:{'width':o['width_m'],'points':json.loads(o['centerline_json'])} for o in s.objects if o.name.startswith('Road.') and o.get('centerline_json')},'arrival':list(json.loads(s['arrival_route_json'])) if 'arrival_route_json' in s else None,'households':[{'name':o.name,'loc':list(o.location),'angle':o.rotation_euler.z} for o in s.objects if o.get('household')],'asset_roots':[{'name':o.name,'kind':o['reused_source'],'loc':list(o.location),'angle':o.rotation_euler.z} for o in roots],'collections':{c.name:len(c.objects) for c in bpy.data.collections},'peak_rss_mib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/1024}
    return report


def render(stage):
    install_cameras();s=bpy.context.scene;times={}
    for slug,*_ in VIEWS:
        s.camera=bpy.data.objects['Review.'+slug];s.render.filepath=str(ROOT/'previews'/stage/(slug+'.png'));t=time.perf_counter();bpy.ops.render.render(write_still=True);times[slug]=round(time.perf_counter()-t,3)
    (ROOT/(stage+'-render-times.json')).write_text(json.dumps({'resolution':[1280,800],'engine':s.render.engine,'seconds':times,'peak_rss_mib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/1024},indent=2)+'\n')

if __name__=='__main__':
    mode=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'audit'
    if mode=='audit':(ROOT/'baseline-audit.json').write_text(json.dumps(audit(),indent=2)+'\n');print('AUDIT_SAVED')
    elif mode in ['before','after']:render(mode)
