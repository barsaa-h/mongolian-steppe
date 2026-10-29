"""Deterministic art choices; protected story geography comes from the existing registry."""
from pathlib import Path
import importlib.util,math,random
spec=importlib.util.spec_from_file_location('naran_base_layout',Path(__file__).resolve().parents[1]/'layout.py');L=importlib.util.module_from_spec(spec);spec.loader.exec_module(L)
SEED=19981128

def smooth(t):
    t=max(0,min(1,t));return t*t*(3-2*t)

def height(x,y):
    base=L.height(x,y)
    pad=1
    for r in L.LOCATIONS.values():
        dx=max(0,abs(x-float(r['x_m_east']))-(18 if r['location_id'] in ['N11','N17'] else max(18,float(r['placeholder_width_m'])/2)))
        dy=max(0,abs(y-float(r['y_m_north']))-(18 if r['location_id'] in ['N11','N17'] else max(18,float(r['placeholder_depth_m'])/2)))
        pad=min(pad,smooth(math.hypot(dx,dy)/70))
    valley=-2.8*math.exp(-((x-(-910+100*math.sin(y/800)))/150)**2)
    hills=sum(h*math.exp(-((x-cx)/rx)**2-((y-cy)/ry)**2) for cx,cy,h,rx,ry in [(-3000,1600,170,1250,1500),(1100,3900,230,2300,1150),(3800,-1800,185,1450,1800),(-4200,-3200,100,1800,1450)])
    outer=smooth(max((abs(x)-1400)/1100,(abs(y)-1250)/1100))
    return base+pad*(valley+outer*hills)

FARM_ROADS=[('Grain farm track',3.4,[(1100,860),(1210,900),(1210,1480),(750,1480)]),('Western field track',3.4,[(-40,900),(-520,900),(-520,1500)])]
DISTRICTS=[('Civic/commerce',[-450,-160,100,300]),('Apartment microdistrict',[150,-540,550,-285]),('Ger/house compounds',[-1420,-830,-975,-470]),('East mixed residential',[100,290,620,620]),('West workshop residential',[-600,-510,-160,-240]),('Hospital services',[680,240,990,510]),('Heat/grain/rail',[0,650,1440,1100]),('Agricultural fringe',[-1400,900,1820,1600])]
SCHOOL_FOOTPATH=[(-720,-202),(-674,-202),(-674,-315),(-760,-340)]
# This frontage reaches its road around the neighboring .058 compound.
HOUSEHOLD_APPROACH_WAYPOINTS={'Household.062':[(-980,-775)]}

def approach_conflicts(parcels):
    """Exact convex-polygon overlap: a 1m-wide foot approach must clear other yards."""
    def bounds(poly):return min(x for x,y in poly),min(y for x,y in poly),max(x for x,y in poly),max(y for x,y in poly)
    plots=[(p['id'],p['polygon'],bounds(p['polygon'])) for p in parcels];blocked=[]
    for p in parcels:
        path=p.get('approach',[p['gate'],p['road_edge']])
        for a,b in zip(path,path[1:]):
            length=math.dist(a,b)
            if length<.001:continue
            nx=-(b[1]-a[1])*.5/length;ny=(b[0]-a[0])*.5/length
            strip=[(a[0]+nx,a[1]+ny),(b[0]+nx,b[1]+ny),(b[0]-nx,b[1]-ny),(a[0]-nx,a[1]-ny)];box=bounds(strip)
            for id,poly,pbox in plots:
                if id==p['id'] or box[2]<pbox[0] or pbox[2]<box[0] or box[3]<pbox[1] or pbox[3]<box[1]:continue
                separated=False
                for shape in [strip,poly]:
                    for c,d in zip(shape,shape[1:]+shape[:1]):
                        vx,vy=-(d[1]-c[1]),d[0]-c[0];aa=[x*vx+y*vy for x,y in strip];bb=[x*vx+y*vy for x,y in poly]
                        if max(aa)<=min(bb)+1e-6 or max(bb)<=min(aa)+1e-6:separated=True;break
                    if separated:break
                if not separated:blocked.append({'household':p['id'],'crosses':id,'segment':[a,b]})
    return blocked
FIELDS=[{'name':'western fallow','center':(-960,1180),'size':(780,560),'use':'fallow'}, {'name':'north wheat stubble','center':(820,1300),'size':(580,340),'use':'harvested_wheat'}, {'name':'east wheat stubble','center':(1570,1280),'size':(430,450),'use':'harvested_wheat'}]
BUSINESSES=[{'id':'B01','use':'food','label':'ХҮНС','xy':(-316,-82),'reuse':'market'}, {'id':'B02','use':'bread','label':'ТАЛХ','xy':(-289,-82),'reuse':'market'}, {'id':'B03','use':'vehicle_parts','label':'СЭЛБЭГ','xy':(-262,-82),'reuse':'market'}, {'id':'B04','use':'pharmacy','label':'ЭМИЙН САН','xy':(-235,-82),'reuse':'market'}, {'id':'B05','use':'canteen','label':'ГУАНЗ','xy':(-112,108),'reuse':None}, {'id':'B06','use':'kiosk','label':'ТҮЦ','xy':(-43,-26),'reuse':None}, {'id':'B07','use':'food','label':'ХҮНС','xy':(221,-436.6),'reuse':'apartment_window'}, {'id':'B08','use':'kiosk','label':'ТҮЦ','xy':(-308,-123),'reuse':None}]


def household_profile(index):
    rng=random.Random(SEED+index*1709);family=index%6
    return {'family':['timber_care','ger_fuel','repair_trade','mixed_family','brick_garden','patched_extension'][family], 'condition':['maintained','ordinary','ordinary','maintained','maintained','patched'][family], 'width':rng.uniform(15.0,18.0),'depth':rng.uniform(17.6,19.0),'skew':rng.uniform(-.6,.6),'fuel':True,'shed':family!=1,'vegetable_plot':family==4,'mixed':family==3}
