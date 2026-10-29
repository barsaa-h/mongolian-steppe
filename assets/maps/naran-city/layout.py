"""Fictional metric town geography; source IDs stay at their registered XY."""
from pathlib import Path
import csv, math

ROOT=Path(__file__).resolve().parent
REGISTRY=ROOT.parents[2]/'artifacts/character-master/sources/world/data/naran_locations.csv'
LOCATIONS={r['location_id']:r for r in csv.DictReader(REGISTRY.open(encoding='utf-8-sig'))}
BOUNDS=(-1650,1650,-1500,1500)

# Street alignments are artistic choices. End spurs outside the building shells.
ROADS=[
 ('North approach',6.6,[(-40,1500),(-40,1180),(-40,1070),(-40,600),(-60,360),(-60,240),(-60,140),(-60,-55),(-60,-135),(-60,-250),(-80,-530),(-80,-1500)]),
 ('West avenue',6.6,[(-1650,-230),(-1300,-210),(-1100,-170),(-850,-120),(-500,-135),(-275,-135),(-60,-135)]),
 ('East avenue',6.6,[(-60,-55),(250,80),(480,120),(680,200),(1120,410),(1650,575)]),
 ('South distributor',6.6,[(-1650,-850),(-1100,-720),(-760,-540),(-330,-610),(-80,-530),(170,-530),(335,-530),(520,-530),(710,-450),(1015,-450),(1650,-430)]),
 ('Civic south lane',4.8,[(-405,140),(-370,140),(-120,140),(-60,140)]),
 ('Civic north lane',4.8,[(-405,140),(-405,240),(-270,240),(-120,240),(-60,240)]),
 ('Governor entrance',3.6,[(-120,140),(-120,157)]),
 ('Radio entrance',3.6,[(-270,240),(-270,249)]),
 ('Police entrance',3.6,[(-370,140),(-370,181)]),
 ('Market loading',4.8,[(-275,-135),(-275,-118)]),
 ('School access',4.8,[(-850,-120),(-800,-175),(-720,-175),(-720,-202)]),
 ('School escape lane',3.6,[(-800,-175),(-810,-310),(-760,-310),(-760,-340)]),
 ('Garage access',4.8,[(-330,-610),(-330,-602)]),
 ('Hospital public lane',6.6,[(680,200),(700,250),(720,250),(760,250),(810,250),(900,250),(920,310),(920,350),(920,430),(960,445)]),
 ('Hospital west service',3.6,[(720,250),(715,300),(715,340)]),
 ('Hospital entrance',3.6,[(760,250),(760,274)]),
 ('Maternity service',3.6,[(920,350),(880,350)]),
 ('Boiler approach',3.6,[(960,445),(960,454)]),
 ('Plant access',6.6,[(1120,410),(1100,600),(1250,670),(1330,670),(1330,700)]),
 ('Grain access',4.8,[(1100,600),(1100,860),(710,860),(710,899)]),
 ('North industry link',4.8,[(-40,600),(350,650),(690,760),(710,860)]),
 ('Fuel access',4.8,[(1015,-450),(945,-450),(945,-438)]),
 ('Apartment west lane',4.8,[(170,-530),(170,-460),(170,-390),(170,-290),(335,-290),(520,-290),(520,-390),(520,-460),(520,-530)]),
 ('Apartment courtyard',4.8,[(170,-390),(250,-390),(335,-390),(420,-390),(520,-390)]),
 ('Apartment south lane',4.8,[(170,-460),(335,-460),(520,-460)]),
 ('East apartment link',4.8,[(520,-530),(710,-450)]),
 ('Ger approach',4.8,[(-1100,-170),(-1100,-400),(-1100,-510),(-1100,-600),(-1100,-690),(-1100,-720),(-1100,-780)]),
]
for y in [-510,-600,-690,-780]:
    ROADS.append((f'Ger lane {abs(y)}',3.6,[(x,y) for x in [-1370,-1280,-1190,-1100,-1010]]))
for x in [-1370,-1280,-1190,-1010]:
    ROADS.append((f'Ger street {abs(x)}',3.6,[(x,y) for y in [-510,-600,-690,-780]]))

NEIGHBORHOOD_ROADS=[]
for x in range(120,601,80):NEIGHBORHOOD_ROADS.append((f'East residential north-south {x}',3.6,[(x,y) for y in [300,375,450,525,600]]))
for y in range(300,601,75):NEIGHBORHOOD_ROADS.append((f'East residential east-west {y}',3.6,[(x,y) for x in range(120,601,80)]))
NEIGHBORHOOD_ROADS.extend([('East residential north connection',4.8,[(350,650),(350,600)]),('East residential west connection',4.8,[(-60,310),(120,310)])])
for x in range(-580,-179,80):NEIGHBORHOOD_ROADS.append((f'West residential north-south {x}',3.6,[(x,y) for y in [-490,-410,-330,-250]]))
for y in [-490,-410,-330,-250]:NEIGHBORHOOD_ROADS.append((f'West residential east-west {y}',3.6,[(x,y) for x in range(-580,-179,80)]))
NEIGHBORHOOD_ROADS.append(('West residential east connection',4.8,[(-180,-330),(-130,-335),(-66.07142857,-335)]))
ROADS.extend(NEIGHBORHOOD_ROADS)

ARRIVAL=[(-40,1500),(-40,1180),(-40,1070),(-40,600),(-60,360),(-60,240),(-60,140),(-60,-55),(-60,-135),(-60,-250),(-80,-530),(170,-530),(170,-460),(170,-390),(250,-390),(335,-390),(420,-390)]
FOOT_ENTRY=[(420,-390),(420,-379.2)]


def smooth(x):
    x=max(0,min(1,x));return x*x*(3-2*x)


def height(x,y):
    core=8*max(0,x/1330)**1.3+1.1*math.sin(x/300)*math.sin(y/360)
    rim=smooth(max(abs(x)-1400,abs(y)-1250)/650)
    return core+rim*(15+8*math.sin(x/400)**2+5*math.cos(y/430)**2)


def distance_segment(p,a,b):
    dx,dy=b[0]-a[0],b[1]-a[1];d=dx*dx+dy*dy
    t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)) if d else 0
    return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)


def road_distance(x,y):
    return min(distance_segment((x,y),a,b)-width/2 for _,width,ps in ROADS for a,b in zip(ps,ps[1:]))


def nearest_road(x,y):
    best=None
    for _,width,ps in ROADS:
        for a,b in zip(ps,ps[1:]):
            dx=b[0]-a[0];dy=b[1]-a[1];t=max(0,min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)))
            q=(a[0]+t*dx,a[1]+t*dy);dist=math.dist((x,y),q)
            if best is None or dist<best[0]:best=(dist,q,width)
    return best
