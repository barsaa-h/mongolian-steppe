"""Check actual city meshes before exporting and binding QA to saved hashes."""
from pathlib import Path
import bpy, json, math, hashlib, importlib.util
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path('/home/barsaa/mongolian-steppe/assets/maps/naran-city')
spec=importlib.util.spec_from_file_location('naran_layout',ROOT/'layout.py');L=importlib.util.module_from_spec(spec);spec.loader.exec_module(L)


def surface_tree(objects):
    vs=[];fs=[]
    for o in objects:
        n=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices)
        fs.extend(tuple(n+i for i in p.vertices) for p in o.data.polygons)
    return BVHTree.FromPolygons(vs,fs)


def intersects(a,b,c,d):
    if min(L.distance_segment(p,u,v) for p,u,v in [(a,c,d),(b,c,d),(c,a,b),(d,a,b)])<.01:return True
    rx,ry=b[0]-a[0],b[1]-a[1];sx,sy=d[0]-c[0],d[1]-c[1];den=rx*sy-ry*sx
    if abs(den)<1e-9:return False
    t=((c[0]-a[0])*sy-(c[1]-a[1])*sx)/den;u=((c[0]-a[0])*ry-(c[1]-a[1])*rx)/den
    return 0<=t<=1 and 0<=u<=1


def asset_part_check(s):
    expected={}
    templates=bpy.data.collections['NARAN | 99 REUSED ASSET TEMPLATES']
    for root in templates.objects:
        if not root.name.startswith('Kit.'):continue
        parts={}
        for o in root.children_recursive:
            if o.type!='MESH':continue
            m=o.matrix_parent_inverse@o.matrix_basis;parent=o.parent
            while parent!=root:m=parent.matrix_parent_inverse@parent.matrix_basis@m;parent=parent.parent
            parts[o.name]=m
        expected[root.name.removeprefix('Kit.')]=parts
    errors=[];count=0
    for root in s.objects:
        if root.type!='EMPTY' or not root.get('reused_source'):continue
        parts=expected[root['reused_source']]
        for o in root.children:
            if o.type!='MESH':continue
            name=o.get('template_part') or o.name.split('.',2)[2];target=parts.get(name);count+=1
            if target is None or max(abs(o.matrix_basis[i][j]-target[i][j]) for i in range(4) for j in range(4))>1e-4:errors.append(o.name)
    return {'passed':not errors,'checked_parts':count,'incorrect_parts':errors[:20],'incorrect_count':len(errors)}


def checks():
    s=bpy.data.scenes['NARAN_City'];bpy.context.window.scene=s;bpy.context.view_layer.update();c={}
    locs={id:list(s.objects['LOC.'+id].location) for id in L.LOCATIONS}
    c['registered_locations']={'passed':all(abs(locs[id][0]-float(r['x_m_east']))<.01 and abs(locs[id][1]-float(r['y_m_north']))<.01 for id,r in L.LOCATIONS.items()),'count':len(locs)}
    core=[o for o in s.objects if o.name.startswith('Terrain.')]
    points=[o.matrix_world@v.co for o in core for v in o.data.vertices]
    extent=[max(p[k] for p in points)-min(p[k] for p in points) for k in [0,1]]
    c['metric_town_frame']={'passed':extent==[3300,3000] and s.unit_settings.scale_length==1,'extent_m':extent}
    terrain=surface_tree([o for o in s.objects if o.type=='MESH' and o.name.startswith(('Terrain.','Horizon.Terrain'))])
    asphalt=[o for o in s.objects if o.name.startswith('Road.') and o.get('centerline_json')]
    roads=[]
    for o in asphalt:
        ps=json.loads(o['centerline_json']);roads.append((o.name,o['width_m'],ps))
    assert intersects((0,0),(10,0),(5,-1),(5,1)) and not intersects((0,0),(1,0),(2,-1),(2,1))
    adjacency={i:set() for i in range(len(roads))}
    for i,(_,_,ps) in enumerate(roads):
        for j in range(i):
            qs=roads[j][2]
            if any(intersects(a,b,c,d) for a,b in zip(ps,ps[1:]) for c,d in zip(qs,qs[1:])):adjacency[i].add(j);adjacency[j].add(i)
    start=next(i for i,r in enumerate(roads) if r[0]=='Road.North approach');reached={start};pending=[start]
    while pending:
        node=pending.pop()
        for neighbor in adjacency[node]-reached:reached.add(neighbor);pending.append(neighbor)
    c['all_streets_connected']={'passed':len(reached)==len(roads),'street_alignments':len(roads),'unreachable':[roads[i][0] for i in adjacency if i not in reached]}
    road_tree=surface_tree(asphalt)
    buried=[];total=0;maxgrade=0
    for name,width,ps in roads:
        for a,b in zip(ps,ps[1:]):
            n=max(1,math.ceil(math.dist(a,b)/4))
            for i in range(n+1):
                t=max(.001/math.dist(a,b),min(1-.001/math.dist(a,b),i/n));x=a[0]+(b[0]-a[0])*t;y=a[1]+(b[1]-a[1])*t;origin=Vector((x,y,150));direction=Vector((0,0,-1))
                tp=terrain.ray_cast(origin,direction)[0];rp=road_tree.ray_cast(origin,direction)[0];total+=1
                if tp is None or rp is None or tp.z>rp.z-.015:buried.append([name,round(x,2),round(y,2)])
                if i<n and rp is not None:
                    tt=min(1-.001/math.dist(a,b),(i+1)/n);xx=a[0]+(b[0]-a[0])*tt;yy=a[1]+(b[1]-a[1])*tt
                    next_rp=road_tree.ray_cast(Vector((xx,yy,150)),direction)[0]
                    if next_rp is not None:maxgrade=max(maxgrade,abs(next_rp.z-rp.z)/math.dist((x,y),(xx,yy)))
    c['roads_above_actual_terrain']={'passed':not buried,'samples':total,'buried_samples':buried[:15]}
    c['road_grade']={'passed':maxgrade<.08,'max_grade_percent':maxgrade*100,'limit_percent':8}
    # Actual object bounds at vehicle height; spatial buckets keep a large scene cheap.
    buckets={}
    for o in s.objects:
        if o.type!='MESH' or not o.get('collision'):continue
        corners=[o.matrix_world@Vector(p) for p in o.bound_box]
        lo=[min(p[k] for p in corners) for k in range(3)];hi=[max(p[k] for p in corners) for k in range(3)]
        for ix in range(math.floor(lo[0]/50),math.floor(hi[0]/50)+1):
            for iy in range(math.floor(lo[1]/50),math.floor(hi[1]/50)+1):buckets.setdefault((ix,iy),[]).append((o.name,lo,hi))
    collisions=set()
    for name,width,ps in roads:
        for a,b in zip(ps,ps[1:]):
            n=max(1,math.ceil(math.dist(a,b)/3))
            for i in range(n+1):
                x=a[0]+(b[0]-a[0])*i/n;y=a[1]+(b[1]-a[1])*i/n;z=L.height(x,y)
                obs=buckets.get((math.floor(x/50),math.floor(y/50)),[])
                for ob,lo,hi in obs:
                    if lo[0]-1.2<x<hi[0]+1.2 and lo[1]-1.2<y<hi[1]+1.2 and any(lo[2]<z+dz<hi[2] for dz in [.65,2,3.5]):collisions.add((name,ob))
    c['vehicle_routes_clear']={'passed':not collisions,'body_radius_m':1.2,'obstacles':sorted(collisions)}
    poles=[o for o in s.objects if o.type=='EMPTY' and o.get('reused_source')=='Pole']
    blocked=[o.name for o in poles if min(L.distance_segment((o.location.x,o.location.y),a,b)-width/2 for _,width,ps in roads for a,b in zip(ps,ps[1:]))<.3]
    c['utility_poles_clear_of_streets']={'passed':not blocked,'pole_count':len(poles),'blocked_poles':blocked,'pavement_clearance_m':.3}
    c['reused_asset_part_transforms']=asset_part_check(s)
    route_missing=[];route_length=0
    for a,b in zip(L.ARRIVAL,L.ARRIVAL[1:]):
        route_length+=math.dist(a,b);n=max(1,math.ceil(math.dist(a,b)/3))
        for i in range(n+1):
            p=[a[k]+(b[k]-a[k])*i/n for k in [0,1]]
            if not any(min(L.distance_segment(p,u,v) for u,v in zip(ps,ps[1:]))<width/2-.4 for _,width,ps in roads):route_missing.append(p)
    c['episode1_arrival_connected']={'passed':not route_missing,'road_length_m':route_length,'uncovered_samples':route_missing[:5]}
    front_errors=[];gates=[o for o in s.objects if o.type=='EMPTY' and o.get('reused_source')=='Gate']
    for o in s.objects:
        if not o.get('household') or '06 TOWN INFILL' not in o.users_collection[0].name:continue
        nearest=min(gates,key=lambda g:(g.location-o.location).length)
        p=o.location;best=None
        for _,_,ps in roads:
            for a,b in zip(ps,ps[1:]):
                dx=b[0]-a[0];dy=b[1]-a[1];t=max(0,min(1,((p.x-a[0])*dx+(p.y-a[1])*dy)/(dx*dx+dy*dy)))
                q=Vector((a[0]+t*dx,a[1]+t*dy,p.z));d=(q-p).length
                if best is None or d<best[0]:best=(d,q)
        if (nearest.location-p).dot(best[1]-p)<=0:front_errors.append(o.name)
    c['street_house_gates_face_road']={'passed':not front_errors,'reversed_households':front_errors[:20]}
    names=['N07.NorthDoor','N08.NorthDoor','N05.EastDoor']
    c['school_workshop_maternity_access']={'passed':all(n in s.objects for n in names),'expected_visible_doors':names}
    ims=[im for im in bpy.data.images if im.users and im.type=='IMAGE']
    c['textures_packed']={'passed':bool(ims) and all(im.packed_file for im in ims),'images':len(ims)}
    reused=json.loads(s['reuse_counts_json']);c['existing_assets_reused']={'passed':len(reused)>=15 and all(n>0 for n in reused.values()),'instances':reused}
    finite=all(math.isfinite(x) for o in s.objects if o.type=='MESH' for v in o.data.vertices for x in v.co)
    c['finite_geometry']={'passed':finite}
    developed=[o for o in s.objects if o.name.startswith('Road.East residential') or o.name.startswith('Road.West residential')]
    atlas=bpy.data.images.get('Naran.GroundAtlas')
    c['residential_blocks_and_ground_surface']={'passed':bool(developed and atlas and atlas.packed_file and reused.get('Apartment3') and reused.get('Apartment5')),'new_street_alignments':len(developed),'ground_atlas_packed':bool(atlas and atlas.packed_file),'three_floor_blocks':reused.get('Apartment3',0),'five_floor_blocks':reused.get('Apartment5',0)}
    if atlas:
        from array import array
        pixels=array('f',[0])*len(atlas.pixels);atlas.pixels.foreach_get(pixels)
        means=[sum(pixels[k::4])/(len(pixels)/4) for k in range(3)]
        c['painted_ground_has_color']={'passed':all(v>.1 and math.isfinite(v) for v in means),'mean_rgb':means}
    return {'passed':all(v['passed'] for v in c.values()),'checks':c,'locations':locs}


def verify_export():
    report=checks();assert report['passed'],{k:v for k,v in report['checks'].items() if not v['passed']}
    s=bpy.context.scene;templates=bpy.data.collections['NARAN | 99 REUSED ASSET TEMPLATES']
    for o in s.objects:o.select_set(o.type=='MESH' and templates not in o.users_collection and not o.name.startswith('Plan.'))
    (ROOT/'glb').mkdir(exist_ok=True);out=ROOT/'glb/naran-city.glb'
    bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,use_active_scene=True,use_renderable=True,export_apply=True,export_cameras=False,export_lights=False)
    s.camera=bpy.data.objects['Naran.Apartment'];bpy.data.collections['NARAN | 91 PLAN LABELS'].hide_render=True
    for area in bpy.context.screen.areas if bpy.context.screen else []:
        if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'Naran-City-Master.blend'),compress=True)
    report['source_sha256']=hashlib.sha256((ROOT/'Naran-City-Master.blend').read_bytes()).hexdigest()
    report['export_sha256']=hashlib.sha256(out.read_bytes()).hexdigest();report['registry_sha256']=hashlib.sha256(L.REGISTRY.read_bytes()).hexdigest()
    report['layout_source_sha256']=hashlib.sha256((ROOT/'layout.py').read_bytes()).hexdigest()
    (ROOT/'town-layout.json').write_text(json.dumps({'locations':report['locations'],'roads':[{'name':o.name,'width_m':o['width_m'],'points':json.loads(o['centerline_json'])} for o in s.objects if o.name.startswith('Road.') and o.get('centerline_json')],'building_footprints':json.loads(s['building_footprints_json']),'arrival_route':L.ARRIVAL,'units':'metres / X east Y north Z up'},indent=2)+'\n')
    report['geometry']={'mesh_objects':sum(o.type=='MESH' for o in s.objects),'unique_meshes':len({o.data.name for o in s.objects if o.type=='MESH'}),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in s.objects if o.type=='MESH')}
    report['limits']='Spatial development and static samples; no live player integration, interior alignment, vehicles/actors or final look approval.'
    (ROOT/'qa-report.json').write_text(json.dumps(report,indent=2)+'\n');return report
