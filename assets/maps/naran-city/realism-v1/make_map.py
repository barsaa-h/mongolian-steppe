"""Production map from preserved roads/anchors and the version's functional systems."""
from pathlib import Path
import json,math
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle,Polygon
import realism_layout as R
ROOT=Path(__file__).resolve().parent
manifest=json.loads((ROOT/'city-manifest.json').read_text())
fig=plt.figure(figsize=(18,15),facecolor='#192521');ax=fig.add_axes([.055,.09,.68,.81]);ax.set_facecolor('#303b30');ax.set_aspect('equal');ax.set_xlim(-1800,1900);ax.set_ylim(-1550,1670)
for name,b in manifest['districts']:
    xmin,ymin,xmax,ymax=b;ax.add_patch(Rectangle((xmin,ymin),xmax-xmin,ymax-ymin,facecolor='#819175',alpha=.12,edgecolor='#9baa89',lw=.8))
    ax.text(xmin+12,ymax-12,name.replace(' residential','\nresidential').replace(' microdistrict','\nmicrodistrict'),color='#c8d2bb',fontsize=6.5,va='top',alpha=.9)
for f in manifest['fields']:
    x,y=f['center'];w,d=f['size'];ax.add_patch(Rectangle((x-w/2,y-d/2),w,d,facecolor='#8d7a45' if f['use']=='harvested_wheat' else '#615a43',hatch='///',edgecolor='#ab9563',lw=.7,alpha=.6));ax.text(x,y,f['name'],ha='center',color='#e4d6b0',fontsize=9)
for p in manifest['parcels']:ax.add_patch(Polygon(p['polygon'],facecolor='#999781',edgecolor='#c4c0a3',lw=.25,alpha=.5))
base=json.loads((ROOT.parent/'town-layout.json').read_text())
for b in base['building_footprints']:
    if b['name']=='Household':continue
    ax.add_patch(Rectangle((b['x']-b['w']/2,b['y']-b['d']/2),b['w'],b['d'],facecolor='#b2baa3',edgecolor='none',alpha=.9))
colors={'oldasphalt':'#c8c5af','gravel':'#aaa28b','dirt':'#957e5c'}
for name,width,ps in R.L.ROADS+R.FARM_ROADS:
    family=manifest['road_families'].get('Road.'+name,'dirt');ax.plot(*zip(*ps),color=colors[family],lw=1.7 if family=='oldasphalt' else .85,zorder=3)
ax.plot(*zip(*R.L.ARRIVAL),color='#e7a763',lw=2.5,zorder=4)
ys=list(range(-1400,1501,20));ax.plot([-910+100*math.sin(y/800) for y in ys],ys,color='#738b87',lw=2,alpha=.7)
offsets={'N01':(12,-20),'N02':(35,3),'N03':(-100,12),'N04':(-85,-34),'N05':(0,23),'N06':(-25,-30),'N07':(-70,28),'N08':(-70,-20),'N09':(-110,-15),'N10':(-95,-18),'N11':(-110,-45),'N12':(24,23),'N13':(-75,-28),'N14':(16,8),'N15':(-70,28),'N16':(15,13),'N17':(-75,-35),'N18':(-45,20),'N19':(20,8),'N20':(22,15)}
for id,r in R.L.LOCATIONS.items():
    x,y=float(r['x_m_east']),float(r['y_m_north']);ax.scatter(x,y,s=23,color='#eedebd',edgecolor='#24352c',lw=.6,zorder=5)
    ax.annotate(id+' '+r['english_name'],(x,y),xytext=offsets[id],textcoords='offset points',color='#f2ede0',fontsize=8.7,arrowprops={'arrowstyle':'-','color':'#c5cfb4','lw':.6},bbox={'boxstyle':'round,pad=.2','fc':'#192521','ec':'none','alpha':.9},zorder=6)
for b in manifest['businesses']:
    x,y=b['xy'];ax.scatter(x,y,s=20,color='#e1c368',marker='s',zorder=7)
    if b['id']=='B07':ax.annotate('B07',(x,y),xytext=(-25,14),textcoords='offset points',fontsize=8,color='#e1c368',arrowprops={'arrowstyle':'-','color':'#e1c368','lw':.6},zorder=8)
ax.add_patch(Rectangle((-1650,-1500),3300,3000,fill=False,ls='--',ec='#bac4ae',lw=.9))
ax.plot([-1550,-1050],[-1390,-1390],color='#f2ede0',lw=3);ax.text(-1300,-1465,'500 m',ha='center',color='#f2ede0',fontsize=11)
ax.annotate('N',xy=(1750,850),xytext=(1750,650),color='#f2ede0',ha='center',fontsize=20,arrowprops={'arrowstyle':'-|>','color':'#f2ede0','lw':2})
ax.set_xticks(range(-1500,1801,500));ax.set_yticks(range(-1500,1601,500));ax.tick_params(colors='#b1bba7');ax.grid(color='#bcc6b2',alpha=.09);ax.set_xlabel('X east / west of square · metres',color='#bac4ae');ax.set_ylabel('Y north / south of square · metres',color='#bac4ae')
for sp in ax.spines.values():sp.set_color('#667761')
fig.text(.055,.956,'KHANIAD — NARAN / REALISM MASTER MAP v001',fontsize=23,weight='bold',color='#f2ede0')
fig.text(.055,.925,'Late November 1998 · fictional 3.3 × 3.0 km production town · protected N01–N20 geography',fontsize=12,color='#b8c3ac')
fig.text(.76,.87,'EVERYDAY SYSTEMS',fontsize=15,weight='bold',color='#f2ede0')
y=.83
for b in manifest['businesses']:
    fig.text(.76,y,b['id']+'  '+b['label'],fontsize=12,color='#e4c779');fig.text(.76,y-.017,b['use'].replace('_',' '),fontsize=9,color='#c2cbb6');y-=.049
fig.text(.76,.446,'Civic commerce detail · B07 on main map',fontsize=8.5,color='#e4c779')
detail=fig.add_axes([.76,.30,.205,.137]);detail.set_facecolor('#303b30');detail.set_xlim(-345,-10);detail.set_ylim(-148,155)
for name,width,ps in R.L.ROADS:
    family=manifest['road_families'].get('Road.'+name,'dirt');detail.plot(*zip(*ps),color=colors[family],lw=1,zorder=1)
for b in manifest['businesses']:
    if b['id']=='B07':continue
    x,y=b['xy'];detail.scatter(x,y,s=14,color='#e1c368',marker='s');detail.annotate(b['id'],(x,y),xytext=(0,8 if b['id']!='B03' else -13),textcoords='offset points',ha='center',fontsize=7,color='#f2ede0')
detail.set_xticks([]);detail.set_yticks([])
for sp in detail.spines.values():sp.set_color('#667761')
fig.text(.76,.275,'Road families',fontsize=12,color='#f2ede0')
fig.text(.76,.25,'Pale — old main asphalt\nGrey — gravel / residential\nOchre — dirt / farm tracks\nAmber — legacy arrival study (2.67 km)\nBlue-grey — seasonal drainage',fontsize=10,color='#b8c3ac',linespacing=1.7,va='top')
fig.text(.76,.11,'411 household parcels\n6 household families / 8 mixed ger-house yards\n3 agricultural fields / working grain edge',fontsize=10,color='#d9dfca',linespacing=1.6)
fig.text(.055,.035,'All original landmark XY and 60 road alignments retained; farm tracks and neighborhood services are artistic additions. Not GPS or approved action blocking.',fontsize=10,color='#b8c3ac')
fig.savefig(ROOT/'Naran-Master-Map-v001.png',dpi=160,facecolor=fig.get_facecolor());svg=ROOT/'Naran-Master-Map-v001.svg';fig.savefig(svg,facecolor=fig.get_facecolor());svg.write_text('\n'.join(line.rstrip() for line in svg.read_text().splitlines())+'\n');print('Revised town master map saved.')
