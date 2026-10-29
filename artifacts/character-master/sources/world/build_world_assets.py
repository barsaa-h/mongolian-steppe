from pathlib import Path
import csv, json, math, random
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Polygon, FancyArrowPatch
import numpy as np
import trimesh
from trimesh.creation import box
from trimesh.visual.color import hex_to_rgba

ROOT=Path(__file__).parent
M=ROOT/'maps'; D=ROOT/'data'; G=ROOT/'3d'
for p in [M,D,G]:p.mkdir(parents=True, exist_ok=True)

# Everything in this set is a fictional production coordinate, NOT a real-world lat/long.
locs=[
('N01','Central Square','Төв талбай',0,0,0,0,'EP3, EP5','Municipal plaza / announcement'),
('N02','Governor Office','Засаг даргын байр',-120,170,36,18,'EP3','Two-floor masonry building'),
('N03','Radio Office','Радио холбооны байр',-270,260,25,15,'EP3, EP9','Switchboard, archive, fax'),
('N04','Naran Hospital','Наран эмнэлэг',760,300,70,44,'EP2, EP7','West service lane, east maternity wing'),
('N05','Maternity Wing','Төрөх тасаг',840,350,35,28,'EP2, EP7','Locked corridor / nursery access'),
('N06','Heating Plant','Дулааны станц',1330,755,130,95,'EP2, EP6–7','Two stacks, live heat, ash yard'),
('N07','School No.2','2-р сургууль',-720,-230,74,46,'EP4','Emergency shelter'),
('N08','School Workshop','Сургуулийн цех',-760,-360,42,28,'EP4','Separated cough shelter'),
('N09','Police Office','Цагдаагийн байр',-370,195,33,20,'EP2–5','Intake and escort'),
('N10','Town Market','Зах',-275,-80,115,65,'EP1, EP3','Stalls, delivery bay'),
('N11','Naran Apartments','Наран хороолол',335,-410,260,175,'EP1–2','3–5 floor block cluster'),
('N12','Ganaa Apartment','Ганаагийн байр',420,-370,43,13,'EP1','Main party set, four-floor block'),
('N13','Municipal Garage','Авто гарааш',-330,-560,115,75,'EP3','UAZ convoy departure'),
('N14','Fuel Store','Түлшний агуулах',945,-400,115,65,'EP3','Heating reserve and guard post'),
('N15','Grain Warehouse','Үр тарианы агуулах',710,940,100,66,'EP3','Agrarian industry silhouette'),
('N16','Rail Siding','Төмөр замын зогсоол',90,1070,500,26,'EP1 atmosphere','Rail yard, nonfunctional scene transit'),
('N17','Ger District','Гэр хороолол',-1180,-650,440,350,'EP3–5','Fences, coal smoke, water kiosk'),
('N18','Town West Gate','Баруун гарц',-1300,-210,18,12,'EP5, EP6','Toward bypass/checkpoint'),
('N19','Town North Gate','Хойд гарц',-40,1180,18,12,'EP1, EP8','Toward border highway'),
('N20','Hospital Boiler Annex','Эмнэлгийн бойлер',960,470,29,24,'EP2, EP7','Oyun hideout / rear door'),
]
with (D/'naran_locations.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f); w.writerow(['location_id','english_name','mongolian_name','x_m_east','y_m_north','placeholder_width_m','placeholder_depth_m','episode_appearance','production_purpose']);w.writerows(locs)

segments=[
('R01','Ulan-Ude → Altanbulag border','Paved international road',235,'4–6 h + border formalities; scripted timing requires customs plan','External reference, not invented'),
('R02','Border → Hürel café','Main highway',23,'25–40 min on late-1990s truck route','Fictional estimate'),
('R03','Hürel café → Upper Junction','Main highway backtrack',2,'4–8 min plus salvage/loading','Fictional estimate'),
('R04','Upper Junction → Naran north entrance','Main highway',27,'35–55 min','Fictional estimate'),
('R05','Naran → West cordon','West/south town road',13,'25–40 min by vehicle; longer by foot','Fictional estimate'),
('R06','West cordon → Failed South Post','Agricultural road',38,'1.5–3 h if passable','Fictional estimate'),
('R07','Upper Junction → Old Repeater','Gravel service road',18,'45–80 min under dry conditions','Fictional estimate'),
('R08','Old Repeater → Lower Bridge','Gravel track and valley switchbacks',29,'1.5–3 h before damage','Fictional estimate'),
('R09','Lower Bridge → Warm Cut','Narrow culvert / warm industrial cut',6,'20–50 min with obstruction','Fictional estimate'),
('R10','Warm Cut → Cold Station','Upper grade and exposed traverse',20,'1–3 h by working vehicle, longer/impassable in blizzard','Fictional estimate'),
('R11','Failed South Post → Lower Bridge','Agricultural bypass and old track',64,'One long day or more with diversions','Fictional estimate'),
]
with (D/'regional_routes.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f);w.writerow(['id','route_segment','surface','distance_km','planning_time','grounding']);w.writerows(segments)

assets=[
('BLD-001','Soviet apartment 4-floor modular shell','architecture','N11 N12','A','6 facades + stair module','S0 S1 S2 S3','Main Ganaa scene, 1:1 playable interior'),
('BLD-002','Central hospital shell + maternity wing','architecture','N04 N05','A','Exterior + playable corridor set','S0 S1 S2 S3','Must test evacuation and blocked access'),
('BLD-003','School No.2 + workshop','architecture','N07 N08','A','Exterior + gym/corridor/stair + workshop','S0 S1 S2 S3','Gate/fence/annex physically coherent'),
('BLD-004','Hürel café and forecourt','architecture','RG04','A','Playable kitchen, counter, windows, roof','S0 S2 S3','EP1 wreck must match EP8 return'),
('BLD-005','Heating plant + pipe network','architecture','N06','A','Stacks + boiler + access lane','S0 S1 S3','Sightline to hospital and carpark'),
('BLD-006','Governor municipal office','architecture','N02','B','Office, radio room and garage view','S0 S1 S2','Ground the authority and evacuation'),
('BLD-007','Cold Station insulated shelter','architecture','RG10','A','Two rooms vestibule and generator','S0 S4','Final capacity test'),
('BLD-008','Warm Cut culvert + bridge','architecture','RG09','A','Playable road + heat pipe + drainage','S0 S3 S4','Auditable alternate paths'),
('VEH-001','KAMAZ diesel truck','vehicle','RG04','A','Cab interior, wheel, burned variant','S0 S2 S3','EP1 to EP8 matching damage'),
('VEH-002','UAZ-452 ambulance gasoline','vehicle','N13 RG08 RG10','A','Van, doors, interior, supplies','S0 S1 S3 S4','4.4m x 1.94m x ~2.1m design baseline'),
('VEH-003','Civilian truck / ride home','vehicle','RG04 N19','A','Cab + daylight / night option','S0 S1','Ganaa ride after crash'),
('VEH-004','Bayar patrol jeep','vehicle','N18 RG09','B','Staging-ready + worn variant','S0 S3','Do not teleport jeep'),
('PROP-001','Irina satchel + evidence cassettes','prop','RG04','A','Openable flap + labels + undamaged option','S0 S3','Must survive café fire in cab'),
('PROP-002','Hürel debt ledger + buuz bill','prop','RG04','A','Close-up readable Mongolian writing','S0 S3','Emotional EP8 callback'),
('PROP-003','Altan mittens and birthday gift','prop','N12','A','Close-up quality, washable/dirty versions','S0 S2 S3','Human continuity'),
('PROP-004','Anu Hi8 camera + tape set','prop','N07 RG08','A','Physical buttons, tape/battery swaps','S0 S1 S3','Date/recording timer correctness'),
('PROP-005','Medical chart, door key, triage cards','prop','N04','A','Credible formats and variants','S0 S1 S2','Hospital physical logic'),
('PROP-006','Governor stamped medical fax','prop','N02 N03 RG09','A','Dates, stamp, chain of custody','S0 S1 S3','Different from Irina tape'),
('PROP-007','Portable radio, watch and map','prop','N12 RG07 RG10','A','Analog, legible display','S0 S3','Sarnai observation and station forecasts'),
('PROP-008','Fuel drums gasoline/diesel labeled','prop','N13 RG04 RG09','A','Separate fuel markings and capacity','S0 S1 S3','No diesel into gasoline UAZ'),
('PROP-009','Newborn carrier + formula + flasks','prop','N04 VEH-002 RG10','A','Secured transport and continuity states','S0 S3 S4','Nursery/transport realism'),
('PROP-010','School register / shelter assignment sheets','prop','N07','B','Handwritten, period-safe ink/paper','S0 S1 S2','Visual social hierarchy'),
('ENV-001','Power poles, cables, lamps','environment','all town','A','3 variants with day/night emission','S0 S1 S2 S3','Networks must connect'),
('ENV-002','Ger and fenced yard modules','environment','N17','B','5 fence segments, gate, stove, coal','S0 S1 S2 S3','Habitation not empty props'),
('ENV-003','Larch/pine/brush dry grass set','environment','region','B','Seasonal dry/winter variants','S0 S3 S4','Northern forest-steppe'),
('ENV-004','Bus stop / 1998 sign kit','environment','N01 N10 N18','B','Mongolian lettering, aging variants','S0 S1 S2 S3','No modern iconography'),
('ENV-005','District heating pipes + valves','environment','N06 N04 RG09','A','Connected segments + leaks and frost','S0 S1 S3 S4','Heat location rules'),
('FX-001','Breath / steam / frost decals','effect','all','A','Density from temp and exertion','S0 S1 S2 S3 S4','No uniform fog everywhere'),
('FX-002','Infection RED GREY WHITE variants','effect','all','A','Character material presets','S1 S2 S3 S4','Matched to exertion & temperature'),
('FX-003','Fire/char/water/snow damage','effect','RG04 N12 RG10','A','Progressive decals and removable props','S2 S3 S4','Repeatable continuity'),
('AUDIO-001','Industrial town ambience loops','audio','N06 N01 N04','A','Distinct day/night states','S0 S1 S2 S3','Steam/hiss/relays/transformer'),
('AUDIO-002','Rural ambience loops','audio','region','A','Wind, horse harness, frozen soil','S0 S3 S4','Avoid constant horror drones'),
]
with (D/'asset_inventory.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f);w.writerow(['asset_id','asset','type','location_refs','priority','model_or_variant_scope','world_states','notes']);w.writerows(assets)

# Map art palette
C=dict(bg='#0B1520',box='#142838',ink='#F2EDE4',muted='#A7BDC8',accent='#E0B365',green='#7CABA3',red='#E17D70',road='#CFCCBA',water='#4F8DA7',rail='#849BA6')
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'svg.fonttype':'none'})

def frame(ax,title,sub,xlim,ylim):
 ax.set_xlim(*xlim); ax.set_ylim(*ylim);ax.set_aspect('equal');ax.set_facecolor(C['bg']);ax.set_xticks([]);ax.set_yticks([])
 for sp in ax.spines.values():sp.set_visible(False)
 ax.set_title(title,loc='left',color=C['ink'],fontsize=20,fontweight='bold',pad=28)
 ax.text(0,1.01,sub,transform=ax.transAxes,color=C['muted'],fontsize=10,va='bottom')
 ax.text(.98,.02,'FICTIONAL PRODUCTION GEOGRAPHY  •  NOT GPS',ha='right',va='bottom',transform=ax.transAxes,color=C['muted'],fontsize=7)

def road(ax,coords,c=C['road'],lw=2.6,ls='-',label=None):
 x,y=zip(*coords);ax.plot(x,y,color='#0A141D',lw=lw+3,alpha=.65,zorder=1);ax.plot(x,y,color=c,lw=lw,linestyle=ls,zorder=2,solid_capstyle='round')

def pin(ax,xy,title,num,c=None,align='left',off=(2.8,1.5)):
 x,y=xy;c=c or C['accent']
 ax.scatter([x],[y],s=125,c=c,edgecolors=C['bg'],linewidth=1.5,zorder=4)
 ax.text(x,y,str(num),ha='center',va='center',fontsize=8,fontweight='bold',color=C['bg'],zorder=5)
 ax.text(x+off[0],y+off[1],title,color=C['ink'],fontsize=10,weight='medium',ha=align,zorder=5,bbox={'facecolor':C['bg'],'edgecolor':'none','pad':1.7,'alpha':.78})

fig,ax=plt.subplots(figsize=(14,9),facecolor=C['bg']);fig.subplots_adjust(left=.05,right=.97,top=.85,bottom=.07)
frame(ax,'REGIONAL ROAD & STORY MAP','NARAN / northern Mongolia inspired • distances are invented planning assumptions',(-72,54),(-67,116))
# regional in kilometres purely schematic nodes and scale not cartographic
N=(13,-9); BORDER=(16,74); CAFE=(15,39); J=(13.5,35.5); REP=(-12,50); BR=(-38,61); WC=(-49,76); STAT=(-60,100); CHECK=(-16,-28); POST=(1,-54); WEST=(-29,8)
ax.fill_between(np.linspace(-72,-20,70), 110-2*np.sin(np.linspace(0,4,70)),116,alpha=.13,color=C['green'])
road(ax,[BORDER,(15,61),CAFE,J,(13,9),N],lw=3.8)
road(ax,[J,(4,42),REP,(-26,52),BR,WC,(-55,88),STAT],c=C['accent'],lw=3.6)
road(ax,[N,(-4,-18),CHECK,(1,-42),POST],c=C['green'],lw=3.1)
road(ax,[POST,(-11,-44),(-38,-14),(-55,19),(-51,43),BR],c=C['green'],lw=2.6,ls='--')
road(ax,[N,(1,-5),WEST,REP],c=C['muted'],lw=1.7,ls=':')
ax.scatter([-58,-49,-42],[94,83,67],c=C['red'],s=100,alpha=.15)
pin(ax,BORDER,'Altanbulag border',1,off=(3,3));pin(ax,CAFE,"Hürel's café",2,off=(3,2));pin(ax,J,'Upper Junction',3,off=(4,-5));pin(ax,N,'NARAN TOWN',4,off=(4,1));pin(ax,CHECK,'West cordon',5,off=(-12,3));pin(ax,POST,'Failed south post',6,off=(4,3));pin(ax,REP,'Old repeater',7,off=(4,3));pin(ax,BR,'Lower bridge',8,off=(-22,-5));pin(ax,WC,'Warm Cut',9,c=C['red'],off=(3,4));pin(ax,STAT,'COLD STATION',10,c=C['green'],off=(4,4))
ax.text(30,102,'N ↑',color=C['ink'],fontsize=15,weight='bold')
ax.text(21,-14,'EP1/8  highway\nEP5     checkpoint\nEP6/7  return to town\nEP9     bypass rendezvous\nEP10   final traverse',color=C['muted'],fontsize=10,va='top',linespacing=1.8,bbox={'facecolor':C['box'],'pad':9,'edgecolor':'none'})
fig.savefig(M/'01_region_story_map.png',dpi=190,facecolor=fig.get_facecolor());fig.savefig(M/'01_region_story_map.svg',facecolor=fig.get_facecolor());plt.close(fig)

# Town blueprint: route corridors and footprints accurate in local meter coordinates
fig,ax=plt.subplots(figsize=(15,12),facecolor=C['bg']);fig.subplots_adjust(left=.045,right=.975,top=.88,bottom=.06)
frame(ax,'NARAN TOWN • BLOCKOUT MASTER','1 unit = 1 metre in the GLB and CSV • plan positions are placeholders',(-1610,1680),(-1450,1530))
ax.add_patch(Rectangle((-1650,-1200),850,1050,color='#244039',alpha=.48,zorder=0))
ax.add_patch(Rectangle((650,500),990,870,color='#2B3B37',alpha=.3,zorder=0))
ax.plot([-1500,1650],[-1160,-1210],color=C['water'],lw=14,alpha=.6,zorder=0)
for yy in [1035,1061]: ax.plot([-1550,1510],[yy,yy],color=C['rail'],lw=1.3,linestyle='--',zorder=0)
road(ax,[(-20,1560),(-20,980),(15,740),(-30,330),(0,0),(-80,-420),(-20,-1400)],lw=10)
road(ax,[(-1540,-180),(-1110,-170),(-740,-120),(-360,-50),(0,0),(480,120),(1120,410),(1600,575)],lw=7)
road(ax,[(-1560,-850),(-1100,-720),(-760,-540),(-320,-560),(250,-530),(750,-420),(1600,-430)],lw=7)
road(ax,[(-720,-230),(-620,20),(-370,195),(-120,170),(0,0),(340,-410),(760,300),(1330,755)],c='#A6AB9C',lw=4.3)
road(ax,[(760,300),(920,310),(960,470),(1330,755)],c=C['accent'],lw=3,ls='--')
road(ax,[(-800,-400),(-800,-230),(-720,-230)],lw=2.4)
road(ax,[(760,300),(750,100),(335,-410)],lw=3)
# building footprints with priority
dim={row[0]:row for row in locs}
for id,name,mg,x,y,w,h,ep,desc in locs:
 if id in ('N01','N16','N17','N18','N19','N11'):continue
 color=C['accent'] if id in ('N04','N05','N06','N07','N08','N12') else C['green']
 ax.add_patch(Rectangle((x-w/2,y-h/2),w,h,facecolor=color,edgecolor=C['bg'],lw=.6,zorder=3,alpha=.9))
 if id not in ('N05','N08','N20'):
  ax.text(x+25,y+40,id,fontsize=9,color=C['ink'],weight='bold',zorder=6)
# scaled blocks around apartments/school
for x,y,w,h in [(230,-380,48,16),(300,-440,48,16),(460,-480,48,16),(490,-340,48,16),(575,-355,48,16),(-1040,-530,48,23),(-1120,-740,23,15),(-1300,-520,28,18),(-1360,-670,25,16)]:
 ax.add_patch(Rectangle((x-w/2,y-h/2),w,h,facecolor='#617D79',alpha=.75,zorder=3))
labels=[(-150,170,'Governor'),(-330,350,'Radio bureau'),(770,450,'Hospital / Maternity'),(1290,910,'Heating plant'),(-910,-220,'School No. 2'),(-955,-390,'Workshop'),(360,-600,'Naran apartments'),(-1310,-1000,'Ger district'),(-510,-700,'Garage'),(985,-620,'Fuel store'),(790,1055,'Rail + grain')]
for x,y,lbl in labels:
 ax.text(x,y,lbl,color=C['ink'],fontsize=10,bbox={'facecolor':C['bg'],'alpha':.7,'pad':1.2,'edgecolor':'none'},zorder=7)
ax.plot([-1500,-1000],[-1370,-1370],color=C['ink'],lw=2)
ax.text(-1250,-1340,'500 metres',ha='center',color=C['muted'],fontsize=10)
ax.text(1480,1300,'N ↑',ha='center',color=C['ink'],fontsize=15,fontweight='bold')
fig.savefig(M/'02_naran_town_plan.png',dpi=180,facecolor=fig.get_facecolor());fig.savefig(M/'02_naran_town_plan.svg',facecolor=fig.get_facecolor());plt.close(fig)

# Hospital study schematic: designed for film blocking, not clinical building compliance
fig,ax=plt.subplots(figsize=(14,8.7),facecolor=C['bg']);fig.subplots_adjust(left=.055,right=.97,top=.83,bottom=.07)
frame(ax,'HOSPITAL • MATERNITY ESCAPE STUDY','Schematic study: actor access and blocked door must be tested in Blender',(-4,66),(-7,36))
rooms=[
 (0,10,17,23,'ER / intake',C['green']),
 (17,10,17,23,'Main corridor',C['road']),
 (34,18,14,15,'Maternity ward',C['red']),
 (34,9,14,9,'Nursery',C['accent']),
 (48,18,14,15,'Operating room',C['green']),
 (48,9,14,9,'Laundry / vestibule',C['accent']),
 (14,-1,20,11,'Service corridor',C['road']),
 (38,-1,24,10,'Boiler rear exit',C['green']),
]
for x,y,w,h,t,c in rooms:
 ax.add_patch(Rectangle((x,y),w,h,linewidth=1.6,edgecolor=C['muted'],facecolor=c,alpha=.22))
 ax.text(x+w/2,y+h/2,t,ha='center',va='center',color=C['ink'],fontsize=10)
for x,y,label in [(34,24,'D1'),(48,23,'D2'),(48,14,'D3'),(60,9,'EXIT'),(18,8,'D4')]:
 ax.scatter(x,y,c=C['accent'],s=60,zorder=5);ax.text(x+0.8,y+1.1,label,color=C['ink'],fontsize=9)
ax.plot([55,56,58,62,64],[19,16,14,13,10],lw=2.8,color=C['accent'],linestyle='--',zorder=6)
ax.text(39,31,'BREACH: red zone, blocked by infected',color=C['red'],fontsize=9,weight='bold')
ax.text(41,3,'Oyun + Naran → laundry exit',color=C['accent'],fontsize=10)
ax.text(2,0,'Tsetsegmaa/Altan: separate town-side triage exit\nNot inside the locked maternity pocket',color=C['muted'],fontsize=9)
ax.text(2,34,'WEST / ambulance',color=C['muted'],fontsize=9)
ax.text(57,1,'EAST / yard',color=C['muted'],fontsize=9)
ax.text(64,34,'N ↑',color=C['ink'],ha='right',fontsize=14)
fig.savefig(M/'03_hospital_escape_study.png',dpi=190,facecolor=fig.get_facecolor());fig.savefig(M/'03_hospital_escape_study.svg',facecolor=fig.get_facecolor());plt.close(fig)

# GLB: actual 1:1 geometry, useful as reference, NOT a detailed level
scene=trimesh.Scene()
def cube(name,center,extents,color):
 mesh=box(extents=extents);mesh.apply_translation(center);mesh.visual.face_colors=hex_to_rgba(color);scene.add_geometry(mesh,node_name=name,geom_name=name)
def pipe(name,start,end,width=8,col='#7D8881'):
 x1,y1=start;x2,y2=end
 dx=x2-x1;dy=y2-y1; L=math.hypot(dx,dy)
 mesh=box(extents=[L,width,.14]);mesh.apply_transform(trimesh.transformations.rotation_matrix(math.atan2(dy,dx),[0,0,1]));mesh.apply_translation([(x1+x2)/2,(y1+y2)/2,.05]);mesh.visual.face_colors=hex_to_rgba(col);scene.add_geometry(mesh,node_name=name)
# ground plate simple, object heights all assumed
cube('NARAN_ground_reference',(0,0,-.16),(3300,3000,.2),'#2D403A')
roads=[((-1500,-180),(0,0)),((0,0),(1600,575)),((-20,1500),(-20,980)),((-20,980),(0,0)),((0,0),(-20,-1400)),((-1560,-850),(-760,-540)),((-760,-540),(-320,-560)),((-320,-560),(750,-420)),((750,-420),(1600,-430)),((-720,-230),(-120,170)),((-120,170),(0,0)),((0,0),(760,300)),((760,300),(1330,755))]
for i,(st,en) in enumerate(roads,1):pipe(f'ROAD_{i:02}',st,en,width=14 if i<6 else 8)
for id,name,mg,x,y,w,d,ep,desc in locs:
 if id in ('N01','N11','N16','N17','N18','N19'):continue
 h={'N02':11,'N03':5,'N04':11,'N05':5,'N06':21,'N07':12,'N08':5,'N09':7,'N10':3,'N12':13,'N13':4,'N14':6,'N15':12,'N20':4}.get(id,5)
 cube(id+'_'+name.replace(' ','_'),(x,y,h/2),(w,d,h),'#D3A763' if id in ('N04','N05','N06','N07','N12') else '#719C95')
# 4-storey apartment pattern around N11
for i,(x,y) in enumerate([(200,-360),(260,-450),(340,-470),(455,-495),(500,-332),(570,-380),(320,-340)],1):cube(f'APARTMENT_MOD_{i:02}',(x,y,6.4),(49,15,12.8),'#AAB5A6')
# Ger district huts as simplistic proxies (not finished models)
random.seed(917)
for i in range(60):
 x=random.uniform(-1400,-880); y=random.uniform(-1030,-420)
 cube(f'GER_PLACEHOLDER_{i:02}',(x,y,1.35),(6,6,2.7),'#7A8E80')
# industrial poles and two chimneys
for i,(x,y) in enumerate([(1290,780),(1350,780)],1):cube(f'CHIMNEY_{i}',(x,y,29),(7,7,58),'#9C7771')
scene.export(G/'naran_town_blockout_v1.glb')
(D/'naran_scene_manifest.json').write_text(json.dumps({'units':'meters','axes':'X east, Y north, Z up','origin':'Naran town central square (0,0,0)','fictional':True,'hero_locations':[{'id':r[0],'name':r[1],'x_m':r[3],'y_m':r[4]} for r in locs],'note':'GLB is geometry-only 1:1 placeholders, no interiors/characters/textures'},ensure_ascii=False,indent=2),encoding='utf-8')
print('Assets built:',[(str(p.relative_to(ROOT)),p.stat().st_size) for p in list(M.glob('*'))+[G/'naran_town_blockout_v1.glb']])
