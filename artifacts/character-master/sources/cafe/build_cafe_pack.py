#!/usr/bin/env python3
"""Rebuild EP01 Hurel cafe proxy GLB and schematic floorplan without Blender."""
import os, json, csv, math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import trimesh
from trimesh.visual.material import PBRMaterial

ROOT=Path(__file__).resolve().parent
DATA=ROOT/'data'; MAPS=ROOT/'maps'; G3=ROOT/'3d'; PREV=ROOT/'previews'
for p in (DATA,MAPS,G3,PREV):p.mkdir(parents=True,exist_ok=True)

SHOTS=[
 ('SH01',0,6,'EXT. establishing / ordinary life','(13,-25,6)','(0,-2,1.8)',28,'Truck forecourt, café sign; no ominous move','WIND, ROAD, KAMAZ IDLE',''),
 ('SH02',6,14,'Hürel calls from counter','(2.5,-2.0,1.7)','(-1.6,1.8,1.65)',50,'Recognize Ganaa; old friends, loud','E01-D023','SPOON, STOVE'),
 ('SH03',14,23,'Ganaa sits / joking','(-4.1,-1.8,1.75)','(-1.3,-1.1,1.55)',55,'Casual counter-joke, no sitcom beat','E01-D024','SEAT SCRAPE'),
 ('SH04',23,32,'Counter two-shot','(0.9,0.4,2.1)','(-1.4,1.2,1.5)',40,'Dry debt joke, old routine','E01-D025;E01-D026','COUNTER, CUTLERY'),
 ('SH05',32,40,'Hürel notices Dasha','(-2.3,0.2,1.6)','(2.8,0.8,1.55)',65,'Quiet jab; no flirtatious staging','E01-D027;E01-D028','OVEN HISS'),
 ('SH06',40,49,'Ganaa fends off teasing','(-2.5,2.0,1.75)','(-1.3,-1.3,1.6)',58,'Two quick replies; defensive not furious','E01-D029;E01-D030','CARD FLAP'),
 ('SH07',49,57,'Hürel smiles / room continues','(0.5,-1.1,1.55)','(-1.6,1.8,1.6)',50,'Banter ends; eye drift to heater','E01-D031','DRIVER CHUCKLE'),
 ('SH08',57,64,'Dasha close: steam & stillness','(5.7,-1.3,1.68)','(3.7,1.25,1.6)',75,'Steam catches attention; chair scrapes','', 'CHAIR SCRAPE; ROOM TONE TAIL'),
 ('SH09',64,70,'Hürel reaches / sudden contact','(0.8,3.0,1.8)','(-1.4,1.8,1.55)',42,'Human reaction, one sudden movement; no slow motion','E01-D032','FABRIC; METAL TRAY; IMPACT'),
 ('SH10',70,77,'Ganaa frozen -> shout','(-0.5,-3.3,1.55)','(-1.3,-1.1,1.5)',68,'1-beat shock, then raw cry; E01-D033','E01-D033','ROOM NOISE DUCK; FIRST SHOUT'),
 ('SH11',77,84,'Chairs overturn / cut into next scene','(3.2,-2.8,2.2)','(-0.5,0.65,1.25)',36,'Ganaa grabs a chair; exit line of action established','', 'CHAIR FALL; FOOTSTEPS; CUT'),
]
assert SHOTS[0][1] ==0 and SHOTS[-1][2]==84 and all(a[2]==b[1] for a,b in zip(SHOTS,SHOTS[1:]))
jsonshots=[]
for s in SHOTS:
 def coord(ss): return [float(x) for x in ss.strip('()').split(',')]
 id,start,end,title,loc,target,lens,action,vo,sfx=s
 jsonshots.append(dict(id=id,start_sec=start,end_sec=end,start_frame=start*24+1,end_frame=end*24,description=title,camera_m=coord(loc),target_m=coord(target),lens_mm=lens,acting=action,vo_cues=[x for x in vo.split(';') if x.startswith('E01')],sound=sfx))

positions={'GANAA':(-1.3,-1.45),'HUREL':(-1.6,1.8),'DASHA':(3.7,1.15),'DRIVER_A':(-4.15,-1.2),'DRIVER_B':(-4.75,-2.4)}
# With positive Z up; scene center is floor center. All lengths are metres.
layout={
 'package':'EP01_HUREL_CAFE_VERTICAL_SLICE_v1.0','story_canon':'EP01 v2.1 line IDs + Season v3.0',
 'fps':24,'start_frame':1,'end_frame':2016,'duration_seconds':84,
 'axis':'X east / Y north / Z up; unit = 1 metre','scene_origin':'Cafe interior center at floor level',
 'interior_m':{'x_min':-7,'x_max':7,'y_min':-5,'y_max':5,'wall_height':3.1},
 'front_door':{'opening_x':[-0.3,1.5],'south_wall_y':-5,'opening_width_m':1.8,'opening_height_m':2.25},
 'service_gap':{'counter_end_x':-2.0,'hurel_position':[-1.6,1.8],'dasha_approach_position':[3.7,1.15]},
 'initial_actor_proxy_xy':{k:list(v) for k,v in positions.items()},
 'signage':['ХҮРЭЛИЙН ГУАНЗ','БУУЗ'],
 'continuity':{'fuel':'Forecourt dispenser petrol, KAMAZ engine diesel; independent fuels. No truck impact in 84s slice.',
 'irina_satchel':'Remains in KAMAZ cab; never placed in cafe.',
 'dasha':'Bandaged left forearm; infection spread from pre-existing bite; shared bowl does not infect Ganaa.',
 'ganaa':'Bitten at drivers door AFTER this 84-second slice; not yet bitten in cafe interior.',
 'later_return':'EP08 visit must reuse building footprint, side store and char states.'},
 'shots':jsonshots,
 'blocking_waypoints':{
 'DASHA':[[0,3.7,1.15],[57,3.7,1.15],[62,3.5,1.25],[65,1.5,1.55],[67,-1.2,1.75],[70,-1.55,1.75],[84,-1.55,1.75]],
 'HUREL':[[0,-1.6,1.8],[62,-1.6,1.8],[64,-1.4,1.8],[66,-1.25,1.8],[84,-1.25,1.8]],
 'GANAA':[[0,-1.3,-1.45],[69,-1.3,-1.45],[73,-1.3,-1.45],[77,-0.9,-1.6],[81,0.3,-0.6],[84,0.85,0.3]]
 },
 'risk_notes':['Dialogue durations are provisional until recorded Mongolian performances arrive.',
 'Hürel/Dasha neck contact must be validated against actual character rigs.',
 'Actor meshes in GLB are static markers; Blender build script creates animating actors.',
 'Truck impact, fire and EP08 ruins deliberately outside this 84s slice.']
}
(DATA/'scene_manifest.json').write_text(json.dumps(layout,ensure_ascii=False,indent=2),encoding='utf8')
with (DATA/'shot_list.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['shot_id','start_s','end_s','start_frame','end_frame','camera_xyz_m','target_xyz_m','lens_mm','description','acting_direction','voice_ids','sound_cues'])
 for s in jsonshots:w.writerow([s['id'],s['start_sec'],s['end_sec'],s['start_frame'],s['end_frame'],str(s['camera_m']),str(s['target_m']),s['lens_mm'],s['description'],s['acting'],';'.join(s['vo_cues']),s['sound']])

# GLB graybox: building + set dressing + immobile crew-markers.
scene=trimesh.Scene(); object_count=0
COL={'slab':(85,86,79,255),'wall':(134,130,115,255),'roof':(64,64,65,255),'counter':(100,68,43,255),'wood':(120,83,51,255),'metal':(100,100,102,255),'glazing':(90,145,167,255),'heat':(135,65,38,255),'asphalt':(54,55,55,255),'petrol':(131,125,75,255),'truck':(64,84,94,255),'ganaa':(197,151,87,255),'hurel':(111,180,112,255),'dasha':(181,95,102,255),'extra':(112,148,190,255),'black':(39,38,37,255)}

def add(mesh,name,col):
 global object_count
 mesh.visual.vertex_colors=np.tile(np.array(COL[col],dtype=np.uint8),(len(mesh.vertices),1))
 scene.add_geometry(mesh,node_name=name,geom_name=name)
 object_count+=1

def cube(name,xyz,ext,col):
 mesh=trimesh.creation.box(extents=ext);mesh.apply_translation(xyz);add(mesh,name,col)

def cyl(name,xyz,r,h,col,sections=12):
 mesh=trimesh.creation.cylinder(radius=r,height=h,sections=sections);mesh.apply_translation(xyz);add(mesh,name,col)

cube('FLOOR_Cafe', (0,0,-0.13),(14.4,10.4,0.25),'slab')
cube('GROUND_Asphalt',(0,-19,-0.24),(45,28,0.19),'asphalt')
cube('GROUND_Back',(0,9,-0.24),(37,8,0.19),'slab')
cube('WALL_North',(0,5.04,1.55),(14.2,.24,3.1),'wall')
cube('WALL_East',(7.04,0,1.55),(.24,10.2,3.1),'wall')
cube('WALL_West',(-7.04,0,1.55),(.24,10.2,3.1),'wall')
# Facade with central opening and south windows: lower sills and upper lintels.
# Window voids 2.2m wide. Sill at .85m, head at 2.35m, visible sightlines.
for name,a,b in [('OuterL',-7,-5.2),('InnerL',-3.0,-.3),('InnerR',1.5,3.2),('OuterR',5.4,7)]:
 cube('WALL_Facade_'+name,((a+b)/2,-5.04,1.55),(b-a,.24,3.1),'wall')
for win,x in [('L',-4.1),('R',4.3)]:
 cube('WALL_Window_Sill_'+win,(x,-5.04,.42),(2.2,.24,.84),'wall')
 cube('WALL_Window_Lintel_'+win,(x,-5.04,2.72),(2.2,.24,.76),'wall')
cube('WALL_DoorLintel',(0.6,-5.04,2.74),(1.8,.26,.7),'wall')
cube('DOOR_Open_Leaf',(1.65,-4.54,1.05),(.07,.92,2.1),'wood')
# Large windows as blue-glass framed shallow panels; prefer camera interior side to avoid glass masking shots.
for x in (-4.1,4.3):
 cube(f'WINDOW_Sill_{x}',(x,-5.31,.9),(2.25,.14,.10),'wood')
# Roof as its own removable group, Blender toggle.
cube('ROOF_Liftable',(0,0,3.25),(14.45,10.45,.18),'roof')
# Interior partition enclosing rear kitchen, with open aisle near x=-2.7.
cube('KITCHEN_Partition',(-5.2,2.85,1.4),(3.45,.18,2.8),'wall')
cube('KITCHEN_BackCounter',(-5.2,3.95,.7),(3,.85,1.1),'wood')
cube('COUNTER_Bar',(-4.0,1.6,.56),(4,0.72,1.1),'counter')
cube('COUNTER_Top',(-4.0,1.6,1.13),(4.2,.85,.10),'wood')
cube('STOVE_Buuz',( -5.9,4.05,.65),(.84,.84,1.2),'metal')
cyl('POT_Buuz',(-5.9,4.05,1.48),.39,.32,'metal')
cube('HEATER_Side',(6,2.2,.75),(.7,1.1,1.5),'heat')
cube('RADIATOR_Back',(4.9,4.86,.75),(2.4,.22,1.45),'metal')
for j,(x,y) in enumerate([(-1.3,-0.5),(-4.3,-1.5),(3.3,-.9)],1):
 cube(f'TABLE_{j}',(x,y,.72),(1.6,.86,.12),'wood')
 for k,(dx,dy) in enumerate([(-.55,-.78),(.55,.78)],1):
  cube(f'CHAIR_{j}_{k}',(x+dx,y+dy,.39),(.48,.45,.73),'wood')
for i,(x,y) in enumerate([(-3.85,1.6),(-3.1,1.6),(-4.55,1.6)],1):cyl(f'PROPS_PotCup_{i}',(x,y,1.25),.11,.18,'metal')
# Repositioned chairs and table accessories for cam framing.
cyl('PROP_EnamelBowl',(-1.0,-.4,.9),.17,.1,'metal')
cube('PROP_HurelDebtBook',(-2.6,1.7,1.22),(.28,.22,.05),'wood')
cube('PROPS_CoalBin',(5.75,3.0,.25),(.6,.65,.5),'metal')
# EP08: store/side window and oil drums to ground later search.
cube('ANNEX_SideStore',(10,1,1.45),(5,5,2.9),'wall')
cube('ANNEX_StoreDoor',(7.55,1,1),(.15,1.25,2),'wood')
cube('KAMAZ_Chassis',(-1.9,-17.3,1.0),(2.45,6.5,.85),'truck')
cube('KAMAZ_Cab',(-1.9,-15.2,2.07),(2.45,2.05,2.05),'truck')
cube('KAMAZ_Cargo',(-1.9,-19.0,2.2),(2.5,3.0,2.4),'metal')
for ax in (-2.9,-.9):
 for ay in (-15.4,-18,-19.6):cyl(f'WHEEL_{ax}_{ay}',(ax,ay,.54),.52,.32,'black')
cube('PUMP_Petrol',(9.4,-16.0,.95),(.9,.75,1.9),'petrol')
cube('PUMP_Island',(9.4,-16.0,.19),(2.4,2.2,.38),'wall')
for idx,x in enumerate([7.0,11.5]):cyl(f'BOLLARD_{idx}',(x,-16,.45),.18,.90,'metal')
cube('SIGN_Cafe_Frame',(0,-5.15,3.68),(4.2,.18,.62),'wood')
# Static silhouettes (glb inspect). Separate animated proxies in Blender should replace these.
for who,(x,y) in positions.items():
 color={'GANAA':'ganaa','HUREL':'hurel','DASHA':'dasha'}.get(who,'extra')
 cyl('ACTOR_STATIC_'+who+'_TORSO',(x,y,.93),.29,1.15,color)
 cyl('ACTOR_STATIC_'+who+'_HEAD',(x,y,1.67),.21,.35,color)

out=G3/'hurel_cafe_graybox_v1.glb';out.write_bytes(scene.export(file_type='glb'))

# Floor plan vector-like PNG: calibrated top down.
W,H=1900,1750;bg=(245,243,235);im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
try:
 f20=ImageFont.truetype(fontpath,24); f13=ImageFont.truetype(fontpath,18); ftitle=ImageFont.truetype(fontpath,38)
except Exception: f20=f13=ftitle=ImageFont.load_default()
S=46; ox=950;oy=680
def xy(x,y):return (int(ox+x*S),int(oy-y*S))
def rect(x0,y0,x1,y1,col,outline=None,width=2):
 p1=xy(x0,y1);p2=xy(x1,y0);d.rectangle([p1,p2],fill=col,outline=outline,width=width)
def label(x,y,txt,col=(35,38,45),font=f13):d.text(xy(x,y),txt,font=font,fill=col)
# Forecourt background
rect(-12,-22,14,-6,(227,228,222))
rect(-7,-5,7,5,(255,252,241))
# tile meter grid
for i in range(-12,15):d.line([xy(i,-22),xy(i,7)],fill=(226,225,220),width=1)
for i in range(-22,8):d.line([xy(-12,i),xy(14,i)],fill=(226,225,220),width=1)
# walls
for pa,pb in [((-7,-5),(-.3,-5)),((1.5,-5),(7,-5)),((-7,-5),(-7,5)),((7,-5),(7,5)),((-7,5),(7,5))]:
 d.line([xy(*pa),xy(*pb)],fill=(58,62,67),width=10)
rect(-6.95,2.75,-3.3,2.94,(89,89,92));rect(-6.0,1.25,-2,1.95,(152,111,74))
rect(-6.5,3.5,-5.5,4.5,(112,117,117));rect(5.6,1.7,6.6,2.7,(193,120,83))
for cx,cy in [(-1.3,-.5),(-4.3,-1.5),(3.3,-.9)]:rect(cx-.8,cy-.43,cx+.8,cy+.43,(180,146,102))
rect(9.9,-1.5,12.4,3.5,(157,160,167))
rect(-3.2,-20.55,-.6,-14,(96,123,142));rect(8.95,-16.4,9.85,-15.65,(196,186,109))
# Actors
acols={'GANAA':(214,141,66),'HUREL':(54,142,89),'DASHA':(185,77,85),'DRIVER_A':(86,114,171),'DRIVER_B':(86,114,171)}
for who,(x,y) in positions.items():
 p=xy(x,y);d.ellipse((p[0]-15,p[1]-15,p[0]+15,p[1]+15),fill=acols[who],outline=(37,38,40),width=2)
 label(x+.35,y+.18,who,(20,24,24),f13)
# Attack path
path=[(3.7,1.15),(1.5,1.55),(-1.25,1.8)]
d.line([xy(*p) for p in path],fill=(165,48,56),width=6,joint='curve')
for p in path[1:]:d.ellipse([tuple(v-6 for v in xy(*p)),tuple(v+6 for v in xy(*p))],fill=(165,48,56))
# captions
label(-6.4,4.5,'KITCHEN',(50,50,50),f13)
label(-6,2.0,'COUNTER',(255,255,255),f13)
label(4.5,3.5,'HEATER',(42,42,42),f13)
label(-4,-8,'PARKING / FORECOURT',(58,58,61),f20)
label(8,-17.4,'PETROL PUMP',(58,58,61),f13)
label(-2,-21,'KAMAZ DIESEL',(250,250,250),f13)
label(8.5,4.1,'SIDE STORE EP08',(58,58,61),f13)
d.text((60,55),'HUREL CAFE | EP01 SET PLAN v1.0',font=ftitle,fill=(35,39,47))
d.text((60,104),'1 grid = 1 metre • local Naran cafe coordinates • set geometry is proposed, not approved',font=f13,fill=(75,78,84))
d.text((62,H-70),'RED PATH: DASHA TO HUREL | Entry south, counter at west, heater east | Reference: EP01 v2.1',font=f13,fill=(80,80,80))
im.save(MAPS/'cafe_floorplan_1m_grid.png')
# Shotboard contact sheet schematic incl timed shot data. Not pretending final renders.
PW,PH=560,270; cols=2; rows=6
sheet=Image.new('RGB',(cols*PW,rows*PH),(240,240,237));dd=ImageDraw.Draw(sheet)
for ix,s in enumerate(jsonshots):
 cx=(ix%2)*PW;cy=(ix//2)*PH
 dd.rectangle((cx+10,cy+10,cx+PW-12,cy+PH-12),fill=(31,36,43))
 dd.rectangle((cx+22,cy+24,cx+PW-24,cy+PH-88),fill=(89,92,92))
 # abstract actor points within contained box; shows blocking/coverage not visual shot proof
 for who,(x,y) in positions.items():
  px=int(cx+PW/2+x*18);py=int(cy+112-y*11)
  color=acols[who]
  dd.ellipse([px-11,py-11,px+11,py+11],fill=color,outline=(245,245,245),width=2)
 # camera and focus markers
 x,y,_=s['camera_m'];tx,ty,_=s['target_m']
 mx=int(cx+PW/2 + max(-9,min(9,x))*18);my=int(cy+112 - max(-6,min(6,y))*11)
 mt=int(cx+PW/2+max(-9,min(9,tx))*18);nt=int(cy+112-max(-6,min(6,ty))*11)
 dd.line((mx,my,mt,nt),fill=(255,220,83),width=3)
 dd.text((cx+29,cy+29),f"{s['id']} • {s['start_sec']:02d}–{s['end_sec']:02d}s",font=f20,fill='white')
 dd.text((cx+28,cy+PH-73),s['description'][:53],font=f13,fill=(235,235,235))
 dd.text((cx+28,cy+PH-43),f"VO: {','.join(s['vo_cues']) or 'none'}",font=f13,fill=(181,193,201))
sheet.save(PREV/'shotboard_schematic.png')
print('Created',out,'objects',object_count,'shots',len(jsonshots),'duration',layout['duration_seconds'])
