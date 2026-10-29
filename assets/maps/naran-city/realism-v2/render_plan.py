"""Draw matching-scale v001 and v002 planning views, not Blender renders."""
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw
import organic_layout as O

ROOT = Path(__file__).resolve().parent
v1 = json.loads((ROOT.parent/'realism-v1/city-manifest.json').read_text())
v2 = json.loads((ROOT/'city-layout-v002.json').read_text())
TIERS = {'poor':'#a85c45', 'patched':'#a85c45', 'ordinary':'#c4a16b', 'maintained':'#7c9b68', 'better_off':'#5c83a1'}


ITEM_COLORS = {'ger':'#f0e8ce','house':'#604238','small_timber_house':'#604238',
               'privy':'#9c2826','coal_bin':'#262927','firewood':'#e3ac50','shed':'#7e7870',
               'vegetable_plot':'#5b6240','laundry_line':'#e7dfc9','bench':'#97684a',
               'playground_frame':'#9c5140','rubbish_point':'#5c7060','uaz':'#63765a',
               'moskvich':'#8c9291','zhiguli':'#a57c4d','car_shell':'#5e4235','dog':'#322b25'}


def draw_town(draw,data,xy,scale):
    for courtyard in data['courtyards']:
        draw.polygon([xy(v) for v in courtyard['parking_patch']],fill='#aa9472',outline='#8c775e')
    for row in data['garages']:
        draw.polygon([xy(v) for v in row['apron']],fill='#ac9575',outline='#8d785e')
        for box in row['boxes']:
            draw.polygon([xy(v) for v in box],fill='#7e8b89' if row['type']=='metal' else '#966d59',outline='#504e44')
    for item in data['clutter']:
        kind = item['type']
        if kind in ('heat_pipe','desire_path'):
            draw.line([xy(p) for p in item['points']],fill='#8a4f38' if kind=='heat_pipe' else '#b5a17e',
                      width=max(1,round((.45 if kind=='heat_pipe' else .8)*scale)),joint='curve')
            if kind=='heat_pipe' and scale>=2:
                for p in item['points']:
                    x,y = xy(p)
                    draw.rectangle((x-2,y-2,x+2,y+2),fill='#5c4f44')
            continue
        color = '#8e5e3e' if item.get('condition')=='rusting' else ITEM_COLORS.get(kind,'#6c746b')
        draw.polygon([xy(v) for v in item['footprint']],fill=color,outline='#4c4436')
        if scale>=2 and kind in ('uaz','moskvich','zhiguli','car_shell'):
            c = item['xy']
            window = O.rectangle(c,item['width']*.45,item['depth']*.75,item['rotation'])
            draw.polygon([xy(v) for v in window],fill='#444e50')
        if scale>=2 and kind=='playground_frame':
            a,b,c,d = [xy(v) for v in item['footprint']]
            draw.line([a,c],fill='#d3b384',width=2)
            draw.line([b,d],fill='#d3b384',width=2)
        if scale>=2 and kind=='laundry_line':
            a,b = item['footprint'][:2]
            draw.line([xy(a),xy(b)],fill='#4f5149',width=1)
            for t in (.2,.4,.6,.8):
                x,y = xy([a[k]*(1-t)+b[k]*t for k in (0,1)])
                draw.rectangle((x-2,y-1,x+2,y+4),fill='#c6cfba')
    for apt in data['apartments']:
        color = {'weathered':'#b9b1a2','ordinary':'#d5cdb9','maintained':'#dcd8c7'}[apt['condition']]
        for part in apt['footprints']:
            draw.polygon([xy(v) for v in part],fill=color,outline='#4e4c42',width=max(1,round(scale*.4)))
        for j,entry in enumerate(apt['entrances']):
            x,y = xy(entry)
            r = max(1,scale*.65)
            draw.ellipse((x-r,y-r,x+r,y+r),fill='#c5a64f',outline='#4e4c42')
        if scale>=1.7:
            x,y = xy(apt['xy'])
            label = 'N12 - fixed' if apt['id']=='N12' else f"{apt['sections']}s / {apt['storeys']}f / {apt['rotation_degrees']:+}deg"
            draw.text((x-len(label)*3,y-5),label,fill='#343a35')
        if scale>=3:
            # Facade markers retain the block's actual orientation and footprint scale.
            angle = math.radians(apt['rotation_degrees'])
            x,y = apt['xy']
            for n in range(apt['enclosed_balconies']):
                t = (n+.5)/max(1,apt['enclosed_balconies'])
                u,v = (t-.5)*apt['length'],apt['depth']/2
                p = [x+u*math.cos(angle)-v*math.sin(angle),y+u*math.sin(angle)+v*math.cos(angle)]
                px,py = xy(p)
                draw.rectangle((px-2,py-1,px+2,py+1),fill='#687c78')
            for n in range(apt['antennas']):
                u = ((n+1)/(apt['antennas']+1)-.5)*apt['length']
                px,py = xy([x+u*math.cos(angle),y+u*math.sin(angle)])
                draw.line((px,py-5,px,py+3),fill='#5b5a50')
                draw.line((px-3,py-3,px+3,py-3),fill='#5b5a50')
    for p in data['parcels']:
        x,y = xy(p['gate'])
        if scale>=1:
            draw.ellipse((x-1.5,y-1.5,x+1.5,y+1.5),fill='#f4df9b')
    for route in data['routes'].values():
        draw.line([xy(p) for p in route],fill='#207575',width=max(1,round(2*scale)))


def render_apartments_closeup():
    bounds,scale = (125,-625,565,-278),4
    xmin,ymin,xmax,ymax = bounds
    image = Image.new('RGB',(round((xmax-xmin)*scale)+40,round((ymax-ymin)*scale)+120),'#ded6bf')
    draw = ImageDraw.Draw(image)
    def xy(p): return (20+(p[0]-xmin)*scale,60+(ymax-p[1])*scale)
    for road in v2['roads']+v2['lanes']:
        if road.get('role')=='roadside_frontage':
            continue
        for a,b in zip(road['points'],road['points'][1:]):
            draw.polygon([xy(p) for p in O.corridor(a,b,road['width'])],fill='#6c6961' if road in v2['roads'] else '#a08665')
    for p in v2['parcels']:
        draw.polygon([xy(v) for v in p['polygon']],fill=TIERS[p['condition']],outline='#655239')
    draw_town(draw,v2,xy,scale)
    for courtyard in v2['courtyards']:
        items = [i for i in v2['clutter'] if i.get('courtyard')==courtyard['id']]
        cars = sum(i['type'] in ('uaz','moskvich','zhiguli') for i in items)
        benches = sum(i['type']=='bench' for i in items)
        x,y,xx,yy = courtyard['bounds']
        draw.text(xy([(x+xx)/2-35,yy-7]),
                  f"{courtyard['id'].upper()} | {cars} cars / {benches} benches / {len(courtyard['desire_paths'])} walks",fill='#565347')
    draw.rectangle((0,0,image.width,50),fill='#ded6bf')
    draw.text((20,15),'NARAN 1998 | apartment microdistrict | measured footprints | 4 px/m | N up',fill='#222222')
    draw.rectangle((0,image.height-48,image.width,image.height),fill='#ded6bf')
    draw.text((20,image.height-38),'Gold dots: entrances | teal: ARRIVAL / FOOT_ENTRY | rust lines: heat pipes | green/grey/ochre: period cars',fill='#222222')
    draw.text((20,image.height-20),'Garages: divided boxes + dirt aprons | courtyard frames, benches, bins and laundry | south: restored private houses',fill='#222222')
    image.save(ROOT/'plan-apartments-closeup.png')


def draw_panel(draw, bounds, xoff, version):
    xmin,ymin,xmax,ymax = bounds
    scale = min(690/(xmax-xmin), 650/(ymax-ymin))
    def xy(p): return (xoff+20+(p[0]-xmin)*scale, 50+(ymax-p[1])*scale)
    data = v2 if version == 2 else {'roads':[{'points':ps,'width':w} for _,w,ps in O.L.ROADS], 'lanes':[], 'parcels':v1['parcels'], 'clutter':[], 'apartments':[]}
    for road in data['roads']+data['lanes']:
        if road.get('role')=='roadside_frontage':
            continue
        draw.line([xy(p) for p in road['points']], fill='#6c6961' if road in data['roads'] else '#a08665', width=max(1,round(road['width']*scale)))
    for key,row in O.L.LOCATIONS.items():
        if key in ('N01','N11','N12','N17'):
            continue
        center = [float(row['x_m_east']),float(row['y_m_north'])]
        shape = O.rectangle(center,float(row['placeholder_width_m']),float(row['placeholder_depth_m']))
        draw.polygon([xy(p) for p in shape],fill='#a6a397',outline='#514c45')
        if xmin<center[0]<xmax and ymin<center[1]<ymax and scale>=.7:
            x,y = xy(center)
            draw.text((x-9,y-4),key,fill='#32362e')
    for p in data['parcels']:
        draw.polygon([xy(v) for v in p['polygon']],fill=TIERS.get(p['condition'],'#c4a16b'),outline='#594d3b')
    if version == 2:
        draw_town(draw,data,xy,scale)
    else:
        for x,y in [(235,-340),(305,-340),(375,-340),(475,-340),(235,-430),(315,-430),(395,-430),(475,-430),(235,-495),(315,-495),(395,-495),(475,-495),(420,-370)]:
            draw.polygon([xy((x-21.5,y-6.5)),xy((x+21.5,y-6.5)),xy((x+21.5,y+6.5)),xy((x-21.5,y+6.5))],fill='#d9d0b9',outline='#514c45')
    draw.text((xoff+20,15),f'v00{version}  |  {scale:.2f} px/m',fill='#222222')


def render(name, bounds):
    image=Image.new('RGB',(1460,720),'#ded6bf')
    draw=ImageDraw.Draw(image)
    for offset, version in [(0,1),(730,2)]:
        panel = Image.new("RGB", (730,720), "#ded6bf")
        draw_panel(ImageDraw.Draw(panel),bounds,0,version)
        image.paste(panel,(offset,0))
    draw = ImageDraw.Draw(image)
    draw.line((730,0,730,720),fill='#ffffff',width=2)
    draw.rectangle((0,680,1460,720),fill='#ded6bf')
    draw.text((20,690),'Yards: red poor / ochre ordinary / green maintained / blue better-off | grey registry shells, roads | brown lanes | teal story route',fill='#222222')
    image.save(ROOT/name)



def ger_panel(bounds, version):
    xmin,ymin,xmax,ymax = bounds
    scale,margin = 6,30
    panel = Image.new('RGB',(round((xmax-xmin)*scale)+2*margin,round((ymax-ymin)*scale)+100),'#ded6bf')
    draw = ImageDraw.Draw(panel)
    def xy(p):
        return (margin+(p[0]-xmin)*scale,60+(ymax-p[1])*scale)
    data = v2 if version==2 else {'roads':[{'points':ps,'width':w} for _,w,ps in O.L.ROADS],
                                 'lanes':[], 'parcels':v1['parcels'], 'clutter':[]}
    for road in data['roads']+data['lanes']:
        if road.get('role')=='roadside_frontage':
            continue
        draw.line([xy(p) for p in road['points']],fill='#6c6961' if road in data['roads'] else '#a08665',width=max(1,round(road['width']*scale)),joint='curve')
    for p in data['parcels']:
        if version==2 and p['district']!='ger':
            continue
        draw.polygon([xy(v) for v in p['polygon']],fill='#b9ad8e' if p.get('status')=='empty_lot' else TIERS[p['condition']],outline='#554638',width=2)
    for item in data['clutter']:
        if 'footprint' not in item:
            continue
        if not (xmin-15<item['xy'][0]<xmax+15 and ymin-15<item['xy'][1]<ymax+15):
            continue
        color = ITEM_COLORS.get(item['type'],'#567987')
        draw.polygon([xy(v) for v in item['footprint']],fill=color,outline='#39362f',width=1)
        if item['type']=='ger':
            # The circle is inscribed in the checked octagonal footprint.
            radius = item['width']/2*math.cos(math.pi/8)*scale
            x,y = xy(item['xy'])
            draw.ellipse((x-radius,y-radius,x+radius,y+radius),fill=color,outline='#777263',width=1)
            draw.ellipse((x-2,y-2,x+2,y+2),fill='#7b6b50')
        if item['type']=='firewood':
            vertices = item['footprint']
            for t in (.25,.5,.75):
                a = [vertices[0][i]*(1-t)+vertices[1][i]*t for i in (0,1)]
                b = [vertices[3][i]*(1-t)+vertices[2][i]*t for i in (0,1)]
                draw.line([xy(a),xy(b)],fill='#8b6031',width=1)
        if 'door' in item:
            x,y = xy(item['door'])
            draw.ellipse((x-2,y-2,x+2,y+2),fill='#ead65d')
    for p in data['parcels']:
        if version==2 and p['district']=='ger' and p['status']=='occupied':
            x,y = xy(p['gate'])
            draw.ellipse((x-3,y-3,x+3,y+3),fill='#f8e5a9',outline='#423c30')
    draw.rectangle((0,0,panel.width,50),fill='#ded6bf')
    title = 'v002 | checked footprints + gates' if version==2 else 'v001 | original fence polygons (item footprints absent from manifest)'
    draw.text((margin,15),title+' | 6 px/m | N up',fill='#222222')
    draw.rectangle((0,panel.height-32,panel.width,panel.height),fill='#ded6bf')
    draw.text((margin,panel.height-24),'Yards: red poor / ochre ordinary / green maintained / blue better-off | cream ger / brown house / red privy / black coal / gold wood',fill='#222222')
    return panel


def render_ger():
    bounds = (-1450,-855,-945,-445)
    panels = [ger_panel(bounds,v) for v in (1,2)]
    image = Image.new('RGB',(panels[0].width*2+4,panels[0].height),'#ffffff')
    for i,panel in enumerate(panels):
        image.paste(panel,(i*(panel.width+4),0))
    image.save(ROOT/'plan-ger.png')
    ger_panel((-1350,-650,-1150,-500),2).save(ROOT/'plan-ger-closeup.png')


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--ger-only',action='store_true',help='Regenerate only the E05d ger evidence')
    args = parser.parse_args()
    if not args.ger_only:
        for name,bounds in [('plan-v001-vs-v002.png',(-1650,-1500,1650,1500)),('plan-east-residential.png',(-80,280,640,670)),('plan-apartments.png',(130,-580,570,-270)),('plan-market-centre.png',(-480,-180,80,310))]:
            render(name,bounds)
        render_apartments_closeup()
    else:
        render_ger()
