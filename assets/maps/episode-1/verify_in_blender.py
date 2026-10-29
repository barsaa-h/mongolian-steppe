"""Inspect actual Episode 1 meshes, export static sets, and bind QA to file hashes."""
from pathlib import Path
import bpy, math, json, hashlib
from mathutils import Vector
ROOT=Path('/home/barsaa/mongolian-steppe/assets/maps/episode-1')
SCENES={'EP01_Cafe':'cafe','EP01_BorderRoad':'border-road','EP01_FreightYard':'freight-yard','EP01_Apartment':'apartment'}


def obstacles(name,z):
    s=bpy.data.scenes[name];bpy.context.window.scene=s;bpy.context.view_layer.update();out=[]
    for o in s.objects:
        if o.type!='MESH' or not o.get('collision'):continue
        corners=[o.matrix_world@Vector(c) for c in o.bound_box]
        lo=[min(c[k] for c in corners) for k in range(3)];hi=[max(c[k] for c in corners) for k in range(3)]
        if lo[2]<z<hi[2]:out.append((o.name,lo,hi))
    return out


def walk(name,points):
    hits=set()
    for z in [.35,.95,1.75]:
        obs=obstacles(name,z)
        for a,b in zip(points,points[1:]):
            n=max(2,math.ceil(math.dist(a,b)/.08))
            for i in range(n+1):
                p=[a[k]+(b[k]-a[k])*i/n for k in range(2)]
                for ob,lo,hi in obs:
                    if lo[0]-.30<p[0]<hi[0]+.30 and lo[1]-.30<p[1]<hi[1]+.30:hits.add(ob)
    return {'passed':not hits,'sample_step_m':.08,'radius_m':.30,'heights_m':[.35,.95,1.75],'obstacles':sorted(hits),'points':points}


def opening(name,y,z,start,end):
    obs=obstacles(name,z);steps=round((end-start)/.005);clear=[]
    for i in range(steps+1):
        x=start+(end-start)*i/steps
        clear.append(not any(lo[0]<x<hi[0] and lo[1]<y<hi[1] for _,lo,hi in obs))
    run=best=0
    for free in clear:
        run=run+1 if free else 0;best=max(best,run)
    return max(0,best-1)*.005


def entry_support():
    s=bpy.data.scenes['EP01_Apartment'];bpy.context.window.scene=s;bpy.context.view_layer.update()
    deps=bpy.context.evaluated_depsgraph_get();missing=[]
    for i in range(41):
        y=-.8+1.1*i/40
        hit,point,_,_,_,_=s.ray_cast(deps,Vector((-.8,y,.25)),Vector((0,0,-1)),distance=.3)
        if not hit or abs(point.z)>.02:missing.append(round(y,4))
    return {'passed':not missing,'sample_x_m':-.8,'sample_y_range_m':[-.8,.3],'samples':41,'unsupported_y_m':missing}


def office_sightline():
    s=bpy.data.scenes['EP01_FreightYard'];bpy.context.window.scene=s;bpy.context.view_layer.update()
    cam=s.objects['Yard.OfficeView'];direction=cam.matrix_world.to_quaternion()@Vector((0,0,-1))
    hit,point,_,_,obj,_=s.ray_cast(bpy.context.evaluated_depsgraph_get(),cam.location,direction,distance=30)
    return {'passed':bool(hit and obj.name.startswith('Boxcar.')),'first_hit':obj.name if hit else None,'hit_point_m':list(point) if hit else None}


def verify_export():
    report={'passed':False,'scenes':{},'clearances':{},'limits':'Static mesh/AABB samples; not moving-rig contact, final art, or shot approval.'}
    c=report['clearances']
    c['cafe_attack_route']=walk('EP01_Cafe',[(3.7,1.15),(1.5,1.55),(-1.3,1.8)])
    c['cafe_escape_route']=walk('EP01_Cafe',[(-.3,-2.2),(.6,-3),(.6,-6.1),(-3.5,-13.7)])
    c['cafe_staff_exit']=walk('EP01_Cafe',[(6,.75),(8,.75),(9.6,2.7),(9.6,4.2)])
    c['apartment_bedroom_to_living']=walk('EP01_Apartment',[(-2.5,5.2),(-.75,5.2),(-.75,1.5),(.65,1.5)])
    c['apartment_exit_route']=walk('EP01_Apartment',[(-.75,1.5),(-.8,-.8)])
    width=min(opening('EP01_Cafe',y,1,-1,2.2) for y in [-5.4,-5.11,-4.9])
    c['cafe_front_door']={'passed':width>=1.79,'measured_width_m':round(width,3),'required_width_m':1.8,'tolerance_m':.01}
    width=opening('EP01_FreightYard',-1.4,2,-3,3)
    c['yard_boxcar_opening']={'passed':width>=2.19,'measured_width_m':round(width,3),'required_width_m':2.2,'tolerance_m':.01}
    road=next(o for o in bpy.data.scenes['EP01_BorderRoad'].objects if o.name.startswith('Road.asphalt'))
    xs=[v.co.x for v in road.data.vertices if abs(v.co.y)<.001];width=max(xs)-min(xs)
    c['border_road_width']={'passed':abs(width-6.6)<.001,'measured_width_m':width}
    steps=[o for o in bpy.data.scenes['EP01_Apartment'].objects if o.name.startswith(('Stair.FlightA','Stair.FlightB'))]
    heights=sorted(o.location.z+o.dimensions.z/2 for o in steps)
    maxrise=max(b-a for a,b in zip(heights,heights[1:]))
    c['apartment_stair']={'passed':len(steps)==18 and maxrise<.18,'steps':len(steps),'max_rise_m':maxrise,'clear_width_m':1.2}
    c['apartment_entry_support']=entry_support()
    c['yard_office_sightline']=office_sightline()
    assert all(x['passed'] for x in c.values()),c
    textures=[im for im in bpy.data.images if im.name.startswith('EP01.')]
    assert textures and all(im.packed_file and max(im.size)<=256 for im in textures)
    (ROOT/'glb').mkdir(exist_ok=True)
    for name,slug in SCENES.items():
        s=bpy.data.scenes[name];bpy.context.window.scene=s;bpy.context.view_layer.update()
        objs=[o for o in s.objects if o.type=='MESH'];tris=[];finite=True
        for o in objs:
            evaluated=o.evaluated_get(bpy.context.evaluated_depsgraph_get());me=evaluated.to_mesh()
            tris.append(sum(len(f.vertices)-2 for f in me.polygons))
            finite=finite and all(math.isfinite(x) for v in me.vertices for x in v.co)
            evaluated.to_mesh_clear()
        assert finite and max(tris)<=3000,(name,max(tris))
        for o in s.objects:o.select_set(o.type=='MESH')
        path=ROOT/'glb'/f'{slug}.glb'
        bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,use_active_scene=True,use_renderable=True,export_apply=True,export_cameras=False,export_lights=False)
        report['scenes'][name]={'mesh_objects':len(objs),'triangles':sum(tris),'max_object_triangles':max(tris),'finite_geometry':finite,'packed_textures':True,'export':str(path.relative_to(ROOT)),'export_sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    bpy.context.window.scene=bpy.data.scenes['EP01_Cafe'];bpy.context.scene.camera=bpy.data.objects['Cafe.Exterior']
    for area in bpy.context.screen.areas:
        if area.type=='VIEW_3D':
            area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.shading.type='MATERIAL'
    if 'Scene' in bpy.data.scenes and set(o.name for o in bpy.data.scenes['Scene'].objects)=={'Cube','Camera','Light'}:
        for o in list(bpy.data.scenes['Scene'].objects):bpy.data.objects.remove(o,do_unlink=True)
        bpy.data.scenes.remove(bpy.data.scenes['Scene'])
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'EP01-Map.blend'))
    report['source_sha256']=hashlib.sha256((ROOT/'EP01-Map.blend').read_bytes()).hexdigest();report['passed']=True
    (ROOT/'qa-report.json').write_text(json.dumps(report,indent=2)+'\n')
    return report
