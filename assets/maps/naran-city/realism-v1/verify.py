"""Read-only native validation; never runs the original master-saving exporter."""
import bpy,json,hashlib,math,time,importlib.util,resource
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path(__file__).resolve().parent;BASE=ROOT.parent

def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m


def point_inside(point,polygon):
    x,y=point;inside=False
    for a,b in zip(polygon,polygon[1:]+polygon[:1]):
        if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:inside=not inside
    return inside



def vent_support(s):
    vents=s.objects['R.Roof vents'];roots=[o for o in s.objects if o.type=='EMPTY' and o.get('reused_source','').startswith('Apartment')];trees={};gaps=[]
    for root in roots:
        vs=[];fs=[]
        for o in root.children:
            if o.type!='MESH':continue
            n=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);fs.extend(tuple(n+i for i in p.vertices) for p in o.data.polygons)
        trees[root.name]=BVHTree.FromPolygons(vs,fs)
    for start in range(0,len(vents.data.vertices),8):
        points=[vents.matrix_world@v.co for v in list(vents.data.vertices)[start:start+8]];x=sum(p.x for p in points)/8;y=sum(p.y for p in points)/8;bottom=min(p.z for p in points)
        root=min(roots,key=lambda o:math.hypot(o.location.x-x,o.location.y-y));hit=trees[root.name].ray_cast(Vector((x,y,root.location.z+25)),Vector((0,0,-1)),30)[0]
        gaps.append({'root':root.name,'gap_m':None if hit is None else bottom-hit.z})
    return {'passed':all(g['gap_m'] is not None and abs(g['gap_m'])<.08 for g in gaps),'count':len(gaps),'gaps':gaps}


def school_path_check(s):
    path=s.objects['R.School yard footpath'];blocked=[]
    for v in path.data.vertices:
        point=path.matrix_world@v.co
        for name in ['N07.Shell','N08.Shell']:
            o=s.objects[name];bounds=[o.matrix_world@Vector(p) for p in o.bound_box]
            if min(p.x for p in bounds)<point.x<max(p.x for p in bounds) and min(p.y for p in bounds)<point.y<max(p.y for p in bounds):blocked.append([name,point.x,point.y])
    return {'passed':not blocked,'blocked_vertices':blocked[:10],'blocked_count':len(blocked)}

def verify():
    started=time.perf_counter();R=load('realism_layout_qa',ROOT/'realism_layout.py');baseline=json.loads((ROOT/'baseline-audit.json').read_text());manifest=json.loads((ROOT/'city-manifest.json').read_text());s=bpy.data.scenes['NARAN_City'];bpy.context.window.scene=s;bpy.context.view_layer.update()
    old=load('naran_base_checks',BASE/'verify_in_blender.py');old.L.height=R.height
    result=old.checks();c=result['checks']
    atlas=bpy.data.images.get('Naran.RealismGround');active_material=bpy.data.materials.get('Naran.Realism.ForestSteppeGround')
    bound=bool(atlas and active_material and any(n.type=='TEX_IMAGE' and n.image==atlas for n in active_material.node_tree.nodes))
    packed=bool(bound and atlas.packed_file)
    surface=c['residential_blocks_and_ground_surface'];surface['ground_atlas_packed']=packed;surface['ground_atlas']='Naran.RealismGround';surface['passed']=bool(packed and surface['new_street_alignments'] and surface['three_floor_blocks'] and surface['five_floor_blocks'])
    from array import array
    pixels=array('f',[0])*len(atlas.pixels) if atlas else array('f')
    if atlas:atlas.pixels.foreach_get(pixels)
    means=[sum(pixels[k::4])/(len(pixels)/4) for k in range(3)] if pixels else []
    c['painted_ground_has_color']={'passed':len(means)==3 and all(v>.1 for v in means),'mean_rgb':means,'active_image':'Naran.RealismGround'}
    c['apartment_roof_vents_supported']=vent_support(s)
    c['school_footpath_avoids_buildings']=school_path_check(s)
    c['original_master_untouched']={'passed':hashlib.sha256((BASE/'Naran-City-Master.blend').read_bytes()).hexdigest()==baseline['sha256'] and hashlib.sha256((ROOT/'source/Naran-City-Before.blend').read_bytes()).hexdigest()==baseline['sha256'],'baseline_sha256':baseline['sha256']}
    changed=[name for name,p in baseline['locations'].items() if (s.objects[name].location-Vector(p)).length>.001]
    c['landmark_xyz_preserved']={'passed':not changed,'changed':changed}
    changed=[name for name,r in baseline['roads'].items() if name not in s.objects or json.loads(s.objects[name]['centerline_json'])!=r['points'] or s.objects[name]['width_m']!=r['width']]
    c['original_street_alignments_preserved']={'passed':not changed,'changed':changed}
    hero=s.objects['N12.GanaaExterior'];prior=next(r for r in baseline['asset_roots'] if r['name']=='N12.GanaaExterior')
    c['episode1_exterior_preserved']={'passed':(hero.location-Vector(prior['loc'])).length<.001 and max(abs(v-1) for v in hero.scale)<.0001,'scale':list(hero.scale),'position':list(hero.location)}
    parcels=manifest['parcels'];families={p['family'] for p in parcels};mixed=sum(p['mixed_ger_house'] for p in parcels);conditions={k:sum(p['condition']==k for p in parcels) for k in ['maintained','ordinary','patched']}
    c['household_variation_and_systems']={'passed':len(parcels)==len(baseline['households']) and len(families)>=6 and mixed>=5 and conditions['maintained']>50 and conditions['patched']<len(parcels)*.4 and all(p.get('fuel') and p.get('water') and p.get('sanitation') for p in parcels),'families':sorted(families),'mixed_house_ger':mixed,'condition_counts':conditions,'parcels':len(parcels)}
    byid={p['id']:p for p in parcels};outside=[];checked=0
    for o in s.objects:
        id=o.get('household_id')
        if not id or o.type!='MESH':continue
        checked+=1;polygon=byid[id]['polygon']
        for corner in o.bound_box:
            v=o.matrix_world@Vector(corner)
            if not point_inside((v.x,v.y),polygon):outside.append(o.name);break
    c['household_modules_fit_parcels']={'passed':not outside,'checked_modules':checked,'outside_modules':outside[:25],'outside_count':len(outside)}
    reversed_approaches=[]
    for parcel in parcels:
        path=parcel.get('approach',[parcel['gate'],parcel['road_edge']])
        if any(point_inside((a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t),parcel['polygon']) for a,b in zip(path,path[1:]) for t in [.02,.1,.3,.6,.9]):reversed_approaches.append(parcel['id'])
    c['household_approaches_stay_outside_own_yards']={'passed':not reversed_approaches,'parcels':len(parcels),'reversed_approaches':reversed_approaches}
    approach_hits=R.approach_conflicts(parcels)
    c['household_approaches_clear_neighbor_yards']={'passed':not approach_hits,'width_m':1,'conflicts':approach_hits}
    uses={b['use'] for b in manifest['businesses']}
    c['ordinary_economic_services']={'passed':{'bread','food','pharmacy','vehicle_parts','canteen','kiosk'}<=uses and len(manifest['fields'])>=3,'businesses':len(manifest['businesses']),'uses':sorted(uses),'agricultural_fields':len(manifest['fields'])}
    c['three_road_families']={'passed':{'dirt','gravel','oldasphalt'}<=set(manifest['road_families'].values()),'families':sorted(set(manifest['road_families'].values()))}
    # Test actual new solid meshes at three vehicle-body lanes, including batched fences.
    solids=[o for o in s.objects if o.type=='MESH' and o.name.startswith('R.') and not any(coll.hide_render for coll in o.users_collection) and not any(coll.name.endswith('10 LANDSCAPE AND DRAINAGE') for coll in o.users_collection)]
    vs=[];fs=[]
    for o in solids:
        n=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);fs.extend(tuple(n+i for i in p.vertices) for p in o.data.polygons)
    tree=BVHTree.FromPolygons(vs,fs);blocked=[];samples=0
    for road in [o for o in s.objects if o.name.startswith('Road.') and o.get('centerline_json') and not any(c.hide_render for c in o.users_collection)]:
        ps=json.loads(road['centerline_json'])
        for a,b in zip(ps,ps[1:]):
            length=math.dist(a,b);n=max(1,math.ceil(length/4));nx=-(b[1]-a[1])/length;ny=(b[0]-a[0])/length
            for i in range(n+1):
                t=i/n;x=a[0]+(b[0]-a[0])*t;y=a[1]+(b[1]-a[1])*t
                for side in [-.9,0,.9]:
                    xx=x+nx*side;yy=y+ny*side;samples+=1;hit=tree.ray_cast(Vector((xx,yy,R.height(xx,yy)+.5)),Vector((0,0,1)),3.05)[0]
                    if hit is not None:blocked.append([road.name,round(xx,2),round(yy,2),round(hit.z,2)])
    c['new_solid_details_clear_vehicle_routes']={'passed':not blocked,'samples':samples,'blocked':blocked[:30],'blocked_count':len(blocked)}
    actor=json.loads(s['actor_scale_reference_json']);c['existing_actor_scale']={'passed':1.6<actor['height_m']<1.8 and not actor['scale_changed'],**actor}
    outer=s.objects.get('R.ContinuousLandscape');span=[max(v.co[k] for v in outer.data.vertices)-min(v.co[k] for v in outer.data.vertices) for k in [0,1]] if outer else []
    c['continuous_landscape_extent']={'passed':span==[20000,20000],'extent_m':span}
    c['landscape_material_join']={'passed':bool(outer and outer.data.materials[0]==active_material and outer.data.uv_layers.active and all(n.extension=='EXTEND' for n in active_material.node_tree.nodes if n.type=='TEX_IMAGE')),'material':outer.data.materials[0].name if outer else None,'has_uv':bool(outer and outer.data.uv_layers.active)}
    disabled=[coll for coll in bpy.data.collections if coll.name.startswith('REALISM | 80 ')]
    c['intact_state_and_separate_outbreak_layers']={'passed':len(disabled)==4 and all(coll.hide_render for coll in disabled),'disabled_layers':[coll.name for coll in disabled]}
    meshes=[o for o in s.objects if o.type=='MESH'];visible=[o for o in meshes if not o.hide_render and not any(coll.hide_render for coll in o.users_collection)]
    result.update({'passed':all(v['passed'] for v in c.values()),'source_sha256':hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest(),'filepath':bpy.data.filepath,'version':'realism-v001','geometry':{'mesh_objects_all':len(meshes),'visible_mesh_objects':len(visible),'unique_visible_meshes':len({o.data for o in visible}),'triangles_visible':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in visible)},'performance':{'validation_seconds':round(time.perf_counter()-started,3),'peak_rss_mib':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/1024,'blender':bpy.app.version_string},'limits':'Static spatial/material checks and rendered comparisons; no gameplay frame-rate, final actor/medical escape animation, exact period prop model or human art approval.'})
    (ROOT/'qa-report.json').write_text(json.dumps(result,indent=2)+'\n');print('REALISM_QA',json.dumps({'passed':result['passed'],'checks':len(c),'failed':{k:v for k,v in c.items() if not v['passed']},'geometry':result['geometry'],'performance':result['performance']}));return result

if __name__=='__main__':
    result=verify()
    assert result['passed'],'Realism validation failed; inspect qa-report.json'
