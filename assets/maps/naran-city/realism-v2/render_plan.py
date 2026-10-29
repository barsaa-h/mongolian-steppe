"""Draw matching-scale v001 and v002 planning views, not Blender renders."""
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw
import organic_layout as O

ROOT = Path(__file__).resolve().parent
v1 = json.loads((ROOT.parent/'realism-v1/city-manifest.json').read_text())
v2 = O.generate()
TIERS = {'poor':'#a85c45', 'patched':'#a85c45', 'ordinary':'#c4a16b', 'maintained':'#7c9b68', 'better_off':'#5c83a1'}


def draw_panel(draw, bounds, xoff, version):
    xmin,ymin,xmax,ymax = bounds
    scale = min(690/(xmax-xmin), 650/(ymax-ymin))
    def xy(p): return (xoff+20+(p[0]-xmin)*scale, 50+(ymax-p[1])*scale)
    data = v2 if version == 2 else {'roads':[{'points':ps,'width':w} for _,w,ps in O.L.ROADS], 'lanes':[], 'parcels':v1['parcels'], 'clutter':[], 'apartments':[]}
    for road in data['roads']+data['lanes']:
        draw.line([xy(p) for p in road['points']], fill='#6c6961' if road in data['roads'] else '#a08665', width=max(1,round(road['width']*scale)))
    for p in data['parcels']:
        draw.polygon([xy(v) for v in p['polygon']],fill=TIERS.get(p['condition'],'#c4a16b'),outline='#594d3b')
    if version == 2:
        for item in data['clutter']:
            x,y=xy(item['xy']); draw.ellipse((x-1,y-1,x+1,y+1), fill='#292723')
        for apt in data['apartments']:
            x,y=apt['xy']; w=apt['length']; d=apt['depth']
            angle=math.radians(apt['rotation_degrees'])
            def corner(u,v):
                return xy((x+u*math.cos(angle)-v*math.sin(angle), y+u*math.sin(angle)+v*math.cos(angle)))
            draw.polygon([corner(-w/2,-d/2),corner(w/2,-d/2),corner(w/2,d/2),corner(-w/2,d/2)],fill='#d9d0b9',outline='#514c45')
            if apt['shape'] == 'L':
                draw.polygon([corner(-w/2,d/2),corner(-w/2+d,d/2),corner(-w/2+d,d/2+22),corner(-w/2,d/2+22)],fill='#d9d0b9',outline='#514c45')
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
    draw.text((20,690),'Poor / patched: red   Ordinary: ochre   Maintained: green   Better-off: blue   Roads: grey   Lanes: brown',fill='#222222')
    image.save(ROOT/name)

ITEM_COLORS = {'ger':'#f0e8ce', 'house':'#604238', 'small_timber_house':'#604238',
               'privy':'#9c2826', 'coal_bin':'#262927', 'firewood':'#e3ac50',
               'shed':'#7e7870', 'vegetable_plot':'#5b6240', 'laundry_line':'#ddd2c1'}


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
    render_ger()
