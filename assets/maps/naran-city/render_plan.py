from pathlib import Path
import json,importlib.util,csv
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
root=Path(__file__).resolve().parent
data=json.loads((root/'town-layout.json').read_text())
rows={r['location_id']:r for r in csv.DictReader((root.parents[2]/'artifacts/character-master/sources/world/data/naran_locations.csv').open(encoding='utf-8-sig'))}
fig,ax=plt.subplots(figsize=(15,14),facecolor='#17211f');fig.subplots_adjust(left=.045,right=.985,top=.90,bottom=.065)
ax.set_facecolor('#253029');ax.set_aspect('equal');ax.set_xlim(-1650,1650);ax.set_ylim(-1500,1500)
ax.set_xticks(range(-1500,1501,500));ax.set_yticks(range(-1500,1501,500));ax.tick_params(colors='#9baea2',labelsize=9);ax.grid(color='#859383',alpha=.12,lw=.7)
for sp in ax.spines.values():sp.set_color('#607268')
for b in data['building_footprints']:
    ax.add_patch(Rectangle((b['x']-b['w']/2,b['y']-b['d']/2),b['w'],b['d'],facecolor='#899b83',edgecolor='none',alpha=.75,zorder=3))
for road in data['roads']:
    ax.plot(*zip(*road['points']),color='#bcc7b7',lw=1.55 if road['width_m']>6 else .85,alpha=.8,zorder=2)
ax.plot(*zip(*data['arrival_route']),color='#e8b26d',lw=2.7,zorder=4,label='Episode 1 arrival • 2.67 km within town')
offsets={'N01':(15,-20),'N02':(25,-8),'N03':(-112,13),'N04':(-85,-34),'N05':(0,22),'N06':(-35,-37),'N07':(-75,28),'N08':(-85,-18),'N09':(-128,-15),'N10':(-100,-20),'N11':(-125,-55),'N12':(20,22),'N13':(-78,-30),'N14':(18,8),'N15':(15,22),'N16':(20,12),'N17':(-85,-30),'N18':(-45,22),'N19':(20,8),'N20':(20,18)}
for id,p in data['locations'].items():
    x,y=p[:2];color='#e8b26d' if id in ['N12','N19'] else '#b9d1d0'
    ax.scatter([x],[y],s=23 if id not in ['N12','N19'] else 42,color=color,edgecolor='#15231e',linewidth=.6,zorder=5)
    ax.annotate(id+'  '+rows[id]['english_name'],(x,y),xytext=offsets[id],textcoords='offset points',color='#f2ede0',fontsize=9,arrowprops={'arrowstyle':'-','color':'#94a79b','lw':.65},bbox={'boxstyle':'round,pad=.2','fc':'#17211f','ec':'none','alpha':.94},zorder=6)
ax.plot([-1500,-1000],[-1365,-1365],color='#f2ede0',lw=3);ax.text(-1250,-1425,'500 m',ha='center',color='#f2ede0',fontsize=11)
ax.annotate('N',xy=(1450,1390),xytext=(1450,1190),ha='center',color='#f2ede0',fontsize=18,arrowprops={'arrowstyle':'-|>','color':'#f2ede0','lw':2})
ax.set_xlabel('East / west of central square (metres)',color='#aabbaf',labelpad=10)
ax.set_ylabel('North / south of central square (metres)',color='#aabbaf',labelpad=10)
fig.text(.045,.962,'KHANIAD — NARAN / FULL-SIZE TOWN',color='#f2ede0',fontsize=24,weight='bold')
fig.text(.045,.935,'3.3 × 3.0 km • 20 registered locations • proposed spatial layout • Episode 1 route highlighted',color='#aabbaf',fontsize=12)
leg=ax.legend(loc='lower right',facecolor='#17211f',edgecolor='none',labelcolor='#f2ede0',fontsize=10)
fig.text(.045,.018,'Fictional production geography, not GPS. Road strokes widened for legibility; footprints are native layout records.',color='#aabbaf',fontsize=10)
fig.savefig(root/'previews/town-plan-readable.png',dpi=160,facecolor=fig.get_facecolor());fig.savefig(root/'previews/town-plan-readable.svg',facecolor=fig.get_facecolor())
print('Readable native-layout plan saved.')
