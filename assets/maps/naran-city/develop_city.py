"""Second town pass. Load author_naran.py and resume() before calling develop()."""
import numpy as np


def import_apartment_variants():
    if all(kind in KIT for kind in ['Apartment3','Apartment5']):return
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'source/existing-map-kit.glb'))
    added=set(bpy.data.objects)-before;keep=set()
    for kind in ['Apartment3','Apartment5']:
        root=next(o for o in added if o.name=='Kit.'+kind)
        KIT[kind]=root;keep.add(root);keep.update(root.children_recursive)
    for o in keep:
        for c in list(o.users_collection):c.objects.unlink(o)
        COL['templates'].objects.link(o)
    bpy.data.batch_remove(ids=added-keep);bpy.context.view_layer.update();cache_templates()


def neighborhood_blocks():
    for name,width,ps in L.NEIGHBORHOOD_ROADS:
        existing=bpy.data.objects.get('Road.'+name)
        if existing:existing.data.materials[0]=ep.material('earth' if width<4 else 'asphalt')
        else:
            road('Shoulder.'+name,ps,width+2.4,'concrete');bpy.data.objects['Shoulder.'+name].location.z=-.05
            road('Road.'+name,ps,width,'earth' if width<4 else 'asphalt')
    for kind,x,y in [('Apartment3',160,337.5),('Apartment5',320,487.5),('Apartment3',480,562.5),('Apartment5',560,412.5)]:
        footprint('Infill.'+kind,x,y,52,20,COL['apartments']);kit(kind,x,y,COL['apartments'])
        road('Infill.ApartmentWalk',[(x,y-10),(x,y-37.5)],2.4,'concrete',COL['detail'])
    count=0
    for xmin,xmax,ymin,ymax in [(140,585,320,585),(-560,-195,-470,-265)]:
        for x in range(xmin,xmax,24):
            for y in range(ymin,ymax,24):
                dist,q,width=L.nearest_road(x,y)
                if dist>29 or not free_plot(x,y,20,20):continue
                household(x,y,0,house=(count%5!=0));count+=1
    bpy.context.scene['new_residential_households']=count
    return count


def face_street_houses():
    # A new side street can become an existing house's nearest frontage.
    homes=[o for o in COL['infill'].objects if o.get('household')]
    items=[o for o in COL['infill'].objects if (o.type=='EMPTY' and o.get('reused_source')) or o.name.startswith('Household.Fuel')]
    paths=[o for o in COL['detail'].objects if o.name.startswith('Household.AccessWalk')]
    for home in homes:
        x,y=home.location.x,home.location.y;distance,q,width=L.nearest_road(x,y)
        angle=math.atan2(q[0]-x,-(q[1]-y));change=angle-home.rotation_euler.z
        if abs(change)>.0001:
            rot=Matrix.Rotation(change,3,'Z')
            for o in items:
                if math.hypot(o.location.x-x,o.location.y-y)<10:
                    o.location=home.location+rot@(o.location-home.location);o.rotation_euler.z+=change
            home.rotation_euler.z=angle
        front=(x+math.sin(angle)*7.2,y-math.cos(angle)*7.2)
        for path in list(paths):
            start=json.loads(path['centerline_json'])[0]
            if math.dist((x,y),start)<8 and math.dist(front,start)>.3:
                paths.remove(path);bpy.data.objects.remove(path,do_unlink=True)
                road('Household.AccessWalk',[front,(q[0]+(x-q[0])*(width/2+1.2)/distance,q[1]+(y-q[1])*(width/2+1.2)/distance)],1.2,'concrete',COL['detail'])


def paint_ground_atlas():
    size=512;yy,xx=np.mgrid[:size,:size];x=-2700+xx*5400/(size-1);y=-2400+yy*4800/(size-1)
    nearest=np.full((size,size),1e8)
    for _,width,ps in L.ROADS:
        for a,b in zip(ps,ps[1:]):
            dx=b[0]-a[0];dy=b[1]-a[1];t=np.clip(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy),0,1)
            nearest=np.minimum(nearest,np.hypot(x-a[0]-t*dx,y-a[1]-t*dy)-width/2)
    rng=np.random.default_rng(281198)
    noise=.025*np.sin(x/170)*np.cos(y/230)+.015*np.sin(x/63+y/87)+rng.normal(0,.005,(size,size))
    compaction=np.exp(-np.maximum(nearest,0)**2/(2*12**2))
    pix=np.ones((size,size,4),dtype=np.float32)
    for k,(dry,soil) in enumerate(zip([.48,.465,.34],[.39,.365,.29])):pix[:,:,k]=np.clip(dry+noise+(soil-dry)*compaction,0,1)
    previous=bpy.data.images.get('Naran.GroundAtlas')
    image=bpy.data.images.new('Naran.GroundAtlas.Paint',width=size,height=size,alpha=True)
    image.colorspace_settings.name='sRGB';image.pixels.foreach_set(pix.ravel())
    (ROOT/'textures').mkdir(exist_ok=True);image.filepath_raw=str(ROOT/'textures/town-ground.png');image.file_format='PNG';image.save()
    # Reload the saved PNG so an old packed buffer cannot survive a repaint.
    packed=bpy.data.images.load(image.filepath_raw,check_existing=False);packed.pack()
    if previous:previous.user_remap(packed);bpy.data.images.remove(previous)
    bpy.data.images.remove(image);packed.name='Naran.GroundAtlas'
    return packed


def ground_surface():
    image=paint_ground_atlas()
    m=bpy.data.materials.new('Naran.ForestSteppeGround');m.use_nodes=True;bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Roughness'].default_value=1;bs.inputs['Specular IOR Level'].default_value=.1
    tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;tex.interpolation='Linear';m.node_tree.links.new(tex.outputs['Color'],bs.inputs['Base Color'])
    for o in COL['terrain'].objects:
        o.data.materials.clear();o.data.materials.append(m)
        uv=o.data.uv_layers.active
        for p in o.data.polygons:
            for li in p.loop_indices:
                co=o.data.vertices[o.data.loops[li].vertex_index].co;uv.data[li].uv=((co.x+2700)/5400,(co.y+2400)/4800)
    # Every fenced home gets a terrain-following, compacted yard surface.
    for home in [o for o in bpy.context.scene.objects if o.get('household')]:
        x,y=home.location.x,home.location.y;angle=home.rotation_euler.z;vs=[]
        for dx,dy in [(-6.8,-6.8),(6.8,-6.8),(6.8,6.8),(-6.8,6.8)]:
            xx=x+dx*math.cos(angle)-dy*math.sin(angle);yy=y+dx*math.sin(angle)+dy*math.cos(angle);vs.append((xx,yy,L.height(xx,yy)+.035))
        ep.mesh('Yard.CompactedSurface',vs,[(0,1,2,3)],'earth',COL['detail'],False)
    for o in COL['roads'].objects:
        if o.name.startswith(('Road.Ger lane','Road.Ger street')):o.data.materials[0]=ep.material('earth')


def civic_and_market():
    c=COL['detail'];road('Civic.PublicWalk',[(-36,0),(-48,0),(-48,140),(-120,140)],2.4,'concrete',c)
    for x in [-31,31]:
        for y in [-25,25]:
            z=L.height(x,y);box('Square.Planter',(x,y,z+.25),(3.2,2.2,.5),'concrete',c,False)
            box('Square.DormantBed',(x,y,z+.51),(2.8,1.8,.02),'earth',c,False)
    for x in [-32,32]:
        road('Square.PavingSeam',[(x,-30),(x,30)],.1,'dark',c)
    for y in [-30,-15,0,15,30]:road('Square.PavingSeam',[(-34,y),(34,y)],.08,'dark',c)
    z=L.height(-18,23)
    for dx in [-1.5,1.5]:box('Square.NoticePost',(-18+dx,23,z+1.25),(.12,.12,2.5),'metal',c,False)
    box('Square.NoticeBoard',(-18,23,z+1.85),(3.4,.12,1.1),'blue',c,False)
    ep.label('Square.NoticeText','ЗАРЛАЛ',(-18,22.92,z+1.7),.34,c)
    for x,y in [(-30,-26),(30,-26),(-30,26),(30,26)]:kit('Pole',x,y,c)
    # Small market frontage reads as a working food/repair economy.
    for i,text in enumerate(['ХҮНС','ТАЛХ','ЗАСВАР','АХУЙН БАРАА']):
        x=-316+i*27;y=-82;z=L.height(x,y)
        footprint('Market.Shop',x,y,20,10,c);box('Market.ShopBody',(x,y,z+1.65),(20,10,3.3),'plaster',c)
        vs=[(x-10.4,y-5.4,z+3.3),(x+10.4,y-5.4,z+3.3),(x+10.4,y+5.4,z+3.3),(x-10.4,y+5.4,z+3.3),(x-10.4,y,z+4.8),(x+10.4,y,z+4.8)]
        ep.mesh('Market.ShopRoof',vs,[(0,1,5,4),(4,5,2,3),(0,4,3),(1,2,5)],'metal',c,False)
        box('Market.ShopDoor',(x,y-5.1,z+1.1),(1.1,.12,2.2),'blue',c,False)
        for dx in [-6,-3,3,6]:box('Market.ShopWindow',(x+dx,y-5.08,z+1.8),(1.8,.1,1.5),'blue',c,False)
        ep.label('Market.ShopSign',text,(x,y-5.12,z+2.6),.52,c)
        for j in range(3):kit('Crate',x-5+j,y-7,c)
        road('Market.ShopWalk',[(x,y-5.4),(x,-118)],2,'concrete',c)
    for x in [-327,-214]:
        kit('Dumpster',x,-102,c)
        for i in range(3):kit('Barrel',x,-99+i*1.1,c)
    road('Market.FrontWalk',[(-329,-118),(-221,-118)],3,'concrete',c)


def road_detail_and_utilities():
    c=COL['detail']
    for name,width,ps in L.ROADS[:4]:
        vs=[];fs=[]
        for a,b in zip(ps,ps[1:]):
            length=math.dist(a,b);dx=(b[0]-a[0])/length;dy=(b[1]-a[1])/length
            for start in range(5,int(length)-7,22):
                p=(a[0]+dx*start,a[1]+dy*start);q=(p[0]+dx*8,p[1]+dy*8);k=len(vs)
                for x,y in [(p[0]-dy*.055,p[1]+dx*.055),(p[0]+dy*.055,p[1]-dx*.055),(q[0]+dy*.055,q[1]-dx*.055),(q[0]-dy*.055,q[1]+dx*.055)]:vs.append((x,y,L.height(x,y)+.208))
                fs.append((k,k+1,k+2,k+3))
        ep.mesh('Road.WornCenterDashes',vs,fs,'cream',c,False)
    for x in [210,290,370,450,505]:
        kit('Car',x,-467,c)
        road('Courtyard.ParkingBay',[(x-3,-468),(x+3,-468)],.08,'cream',c)
    for name,width,ps in L.NEIGHBORHOOD_ROADS:
        if 'north-south' not in name:continue
        power_line(width,ps,COL['network'])
    beam('Heat.BoilerAnnexTap',(960,470,L.height(960,470)-1),(960,500,L.height(960,500)-1),.35,'rust',COL['network'])


def develop():
    s=bpy.context.scene;assert not s.get('development_pass_2'), 'Second pass is already present; edit the native scene.'
    import_apartment_variants();count=neighborhood_blocks();face_street_houses();ground_surface();civic_and_market();road_detail_and_utilities()
    s['building_footprints_json']=json.dumps(BUILDINGS);s['reuse_counts_json']=json.dumps(COUNTS);s['development_pass_2']=True
    s['phase']='Town/residential development pass; Episode 1 detail priority; final art and acting pending'
    for name,pos,target,lens in [('Naran.Center',(160,-340,140),(-95,50,2),44),('Naran.Residential',(760,60,220),(340,445,2),43),('Naran.Market',(-175,-175,10),(-275,-80,2),38)]:
        cam=ep.camera(name,pos,target,lens);cam.data.clip_end=12000
    bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'Naran-City-Master.blend'),compress=True)
    return {'additional_households':count,'street_alignments':len(L.ROADS),'apartment_blocks':COUNTS['Apartment']+COUNTS['Apartment3']+COUNTS['Apartment5'],'objects':len(s.objects)}
