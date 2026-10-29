"""Small, deterministic exterior props; dimensions are metres and front is -Y.

All designs are artistic generic interpretations, not identified historical models.
Run this file to validate the library and refresh its adjacent dimensions catalog.
"""
import json
import math
from pathlib import Path

MATERIALS = {'wood', 'weatheredwood', 'bluepaint', 'metal', 'rust', 'coal',
             'cream', 'glass', 'hay', 'rubber', 'brick', 'plaster', 'redpaint'}


def part(op, pos, size, mat, rotation=None):
    item = dict(op=op, pos=pos, size=size, mat=mat)
    if rotation is not None:
        item['rotation'] = rotation
    return item


def bar(a, b, diameter, mat='metal'):
    delta = tuple(b[i] - a[i] for i in range(3))
    length = math.sqrt(sum(v * v for v in delta))
    return part('cylinder', tuple((a[i] + b[i]) / 2 for i in range(3)),
                (diameter, diameter, length), mat,
                (0, math.acos(delta[2] / length), math.atan2(delta[1], delta[0])))


def models() -> dict[str, list[dict]]:
    p = part
    horizontal = (0, math.pi / 2, 0)
    result = {}
    result['firewood'] = [p('box', (0, 0, .08), (1.45, .85, .16), 'weatheredwood')]
    for row, count in enumerate((5, 4, 3)):
        for i in range(count):
            result['firewood'].append(p('cylinder', (0, (i - (count-1)/2)*.19, .25+row*.17),
                                        (.18, .18, 1.25), 'wood', horizontal))
    result['coal_bin'] = [p('box', (0, 0, .08), (1.8, 1.3, .16), 'weatheredwood'),
                          p('box', (0, .6, .55), (1.8, .1, 1.1), 'weatheredwood'),
                          p('box', (-.85, 0, .55), (.1, 1.3, 1.1), 'weatheredwood'),
                          p('box', (.85, 0, .55), (.1, 1.3, 1.1), 'weatheredwood'),
                          p('box', (0, -.6, .25), (1.8, .1, .5), 'weatheredwood'),
                          p('roof', (0, 0, .51), (1.55, 1.05, .7), 'coal')]
    result['privy'] = [p('box', (0, 0, 1), (1.1, 1.2, 2), 'weatheredwood'),
                       p('roof', (0, 0, 2.05), (1.22, 1.32, .1), 'metal'),
                       p('box', (0, -.615, .96), (.69, .05, 1.88), 'wood'),
                       p('box', (.25, -.655, .95), (.045, .04, .12), 'metal'),
                       p('box', (0, -.65, 1.72), (.32, .025, .085), 'metal')]
    result['shed'] = [p('box', (0, 0, 1.1), (3, 2, 2.2), 'weatheredwood'),
                     p('roof', (0, 0, 2.43), (3.2, 2.2, .46), 'metal'),
                     p('box', (0, -1.03, 1), (1.5, .06, 2), 'wood'),
                     p('box', (0, -1.075, 1), (.035, .025, 2), 'metal'),
                     p('box', (.12, -1.1, 1), (.07, .035, .18), 'metal')]
    result['small_timber_house'] = [p('box', (0, 0, .14), (6, 4.4, .28), 'brick'),
                                   p('box', (0, 0, 1.58), (5.8, 4.2, 2.6), 'weatheredwood'),
                                   p('roof', (0, 0, 3.48), (6.2, 4.6, 1.2), 'metal'),
                                   p('box', (-1.75, -2.13, 1.28), (.88, .06, 2), 'bluepaint'),
                                   p('box', (-1.75, -2.38, .16), (1.1, .55, .32), 'wood'),
                                   p('box', (1.8, .65, 3.75), (.38, .42, 1.3), 'brick')]
    for x in (-.35, 1.65):
        result['small_timber_house'].extend([
            p('box', (x, -2.14, 1.68), (1.15, .1, 1.2), 'cream'),
            p('box', (x, -2.2, 1.68), (.99, .035, 1.04), 'glass'),
            p('box', (x, -2.23, 1.68), (.045, .03, 1.04), 'cream'),
            p('box', (x, -2.23, 1.68), (.99, .03, .045), 'cream')])
    for y in (-.7, .8):
        result['small_timber_house'].extend([
            p('box', (2.94, y, 1.68), (.1, 1, 1.2), 'cream'),
            p('box', (3, y, 1.68), (.03, .84, 1.04), 'glass')])
    result['hay_stack'] = [p('box', (0, 0, .08), (2.6, 1.8, .16), 'weatheredwood'),
                           p('box', (0, 0, .72), (2.4, 1.6, 1.28), 'hay'),
                           p('roof', (0, 0, 1.62), (2.4, 1.6, .52), 'hay')]
    result['water_cart'] = [p('box', (0, 0, .61), (1.35, 1.8, .13), 'weatheredwood'),
                            p('cylinder', (0, .1, 1.03), (.9, .9, 1.1), 'metal', (math.pi/2, 0, 0)),
                            p('box', (0, -.86, .77), (.65, .15, .18), 'weatheredwood'),
                            bar((-.5, -.75, .6), (-.38, -2.1, .85), .065, 'wood'),
                            bar((.5, -.75, .6), (.38, -2.1, .85), .065, 'wood')]
    for x in (-.73, .73):
        result['water_cart'].extend([p('cylinder', (x, .32, .43), (.86, .86, .12), 'rubber', horizontal),
                                     p('cylinder', (x, .32, .43), (.59, .59, .14), 'metal', horizontal)])
    bicycle = []
    for y in (-.68, .68):
        rim = [(0, y + .32*math.cos(i*math.tau/12), .34 + .32*math.sin(i*math.tau/12))
               for i in range(12)]
        bicycle += [bar(rim[i],rim[(i+1)%12],.035,'rubber') for i in range(12)]
        bicycle += [bar(rim[i],rim[i+6],.012,'metal') for i in (0,1,3,4)]
    for a, b in [((0,-.68,.34),(0,-.44,1.02)), ((0,-.44,1.02),(0,.28,.98)),
                 ((0,.28,.98),(0,.68,.34)), ((0,.68,.34),(0,.08,.35)),
                 ((0,.08,.35),(0,.28,.98)), ((0,.08,.35),(0,-.44,1.02)),
                 ((0,-.44,1.02),(0,-.52,1.13)),
                 ((-.28,-.52,1.13),(.28,-.52,1.13)), ((0,.28,.98),(0,.3,1.08)),
                 ((-.16,.08,.35),(.16,.08,.35))]:
        bicycle.append(bar(a,b,.034,'metal'))
    bicycle.extend([p('box', (0,.31,1.09), (.22,.3,.06), 'rubber'),
                    p('box', (-.19,.08,.35), (.15,.1,.035), 'rubber'),
                    p('box', (.19,.08,.35), (.15,.1,.035), 'rubber'),
                    bar((0,.28,.55),(.26,.4,.02),.025)])
    result['bicycle'] = bicycle
    tractor = [p('box', (0,-.08,.68), (1.1,3.25,.22), 'metal'),
               p('box', (0,-.87,1.26), (1.05,1.6,.78), 'bluepaint'),
               p('box', (0,-1.7,1.24), (.87,.06,.56), 'metal'),
               p('box', (0,-1.83,.7), (1.35,.18,.19), 'metal'),
               p('box', (0,.65,1.93), (1.3,1.25,1.15), 'cream'),
               p('box', (0,.65,2.56), (1.5,1.43,.12), 'bluepaint'),
               p('box', (0,-.005,2.06), (1.1,.04,.69), 'glass'),
               p('box', (0,1.295,2.06), (1.1,.04,.69), 'glass'),
               p('cylinder', (.4,-.78,2.01), (.075,.075,1.05), 'metal'),
               p('box', (-.69,.65,1.26), (.32,1.48,.1), 'bluepaint'),
               p('box', (.69,.65,1.26), (.32,1.48,.1), 'bluepaint')]
    for x in (-.67,.67):
        tractor.extend([p('box', (x,.65,2.06), (.035,1.03,.69), 'glass'),
                        p('box', (x,.65,2.05), (.055,.055,.76), 'cream')])
    for x in (-.82,.82):
        for y,z,d,w in [(.85,.72,1.44,.36),(-1.18,.46,.92,.24)]:
            tractor.extend([p('cylinder',(x,y,z),(d,d,w),'rubber',horizontal),
                            p('cylinder',(x*1.025,y,z),(d*.47,d*.47,w+.025),'rust',horizontal)])
    for x in (-.37,.37):
        tractor.append(p('cylinder',(x,-1.75,1.46),(.19,.19,.07),'cream',(math.pi/2,0,0)))
    result['tractor'] = tractor
    result['farm_trailer'] = [p('box',(0,0,.85),(1.95,3,.17),'weatheredwood'),
                              p('box',(0,0,.69),(.85,3,.18),'metal'),
                              p('box',(0,1.46,1.23),(1.95,.08,.62),'bluepaint'),
                              p('box',(0,-1.46,1.23),(1.95,.08,.62),'bluepaint'),
                              p('box',(-.935,0,1.23),(.08,3,.62),'bluepaint'),
                              p('box',(.935,0,1.23),(.08,3,.62),'bluepaint'),
                              bar((-.7,-1.4,.69),(0,-2.65,.51),.09),
                              bar((.7,-1.4,.69),(0,-2.65,.51),.09)]
    for x in (-1.04,1.04):
        result['farm_trailer'].extend([p('cylinder',(x,.35,.46),(.92,.92,.24),'rubber',horizontal),
                                       p('cylinder',(x*1.015,.35,.46),(.43,.43,.26),'rust',horizontal)])
    result['loading_pallet'] = [p('box',(x,0,.075),(.12,.9,.15),'weatheredwood') for x in (-.48,0,.48)]
    result['loading_pallet'] += [p('box',(0,y,.18),(1.2,.13,.06),'wood') for y in (-.38,-.19,0,.19,.38)]
    result['repair_bench'] = [p('box',(0,0,.87),(1.8,.7,.12),'weatheredwood'),
                             p('box',(0,.1,.25),(1.55,.45,.08),'wood'),
                             p('box',(.52,-.12,1.01),(.3,.22,.16),'metal'),
                             p('box',(.52,-.29,1.08),(.35,.08,.12),'metal'),
                             bar((.52,-.35,.97),(.52,-.35,1.21),.025)]
    result['repair_bench'] += [p('box',(x,y,.43),(.1,.1,.86),'wood') for x in (-.76,.76) for y in (-.24,.24)]
    result['sandpit'] = [p('box',(0,0,.07),(2.6,2.6,.14),'cream')]
    for x in (-1.35,1.35):
        result['sandpit'].append(p('box',(x,0,.18),(.14,2.8,.36),'weatheredwood'))
    for y in (-1.35,1.35):
        result['sandpit'].append(p('box',(0,y,.18),(2.56,.14,.36),'weatheredwood'))
    result['climbing_frame'] = []
    for x in (-.72,.72):
        for y in (-1.1,1.1):
            result['climbing_frame'].append(bar((x,y,0),(x,y,1.95),.065,'bluepaint'))
        result['climbing_frame'].append(bar((x,-1.1,1.95),(x,1.1,1.95),.065,'bluepaint'))
    for y in (-1.1,1.1):
        for z in (.34,.68,1.02,1.36,1.7,1.95):
            result['climbing_frame'].append(bar((-.72,y,z),(.72,y,z),.045,'redpaint'))
    for y in (-.66,-.22,.22,.66):
        result['climbing_frame'].append(bar((-.72,y,1.95),(.72,y,1.95),.045,'redpaint'))
    return result


def bounds(parts):
    """Conservative bounds from rotated primitive boxes, including roof peaks."""
    lower, upper = [math.inf]*3, [-math.inf]*3
    for item in parts:
        rx, ry, rz = item.get('rotation', (0, 0, item.get('rot', 0)))
        sx,cx,sy,cy,sz,cz = math.sin(rx),math.cos(rx),math.sin(ry),math.cos(ry),math.sin(rz),math.cos(rz)
        rotation = ((cz*cy, cz*sy*sx-sz*cx, cz*sy*cx+sz*sx),
                    (sz*cy, sz*sy*sx+cz*cx, sz*sy*cx-cz*sx), (-sy,cy*sx,cy*cx))
        half = [sum(abs(rotation[i][j])*item['size'][j]/2 for j in range(3)) for i in range(3)]
        for i in range(3):
            lower[i] = min(lower[i], item['pos'][i]-half[i])
            upper[i] = max(upper[i], item['pos'][i]+half[i])
    return lower, upper


def self_check():
    library = models()
    assert len(library) == 14 and library == models()
    for name, parts in library.items():
        assert 1 <= len(parts) <= (50 if name in ('tractor','bicycle') else 30), name
        for item in parts:
            assert item['op'] in ('box','cylinder','roof') and item['mat'] in MATERIALS, name
            assert len(item['pos']) == len(item['size']) == 3, name
            assert all(math.isfinite(v) for v in (*item['pos'],*item['size'],*item.get('rotation',()))), name
            assert all(v > 0 for v in item['size']), name
        low, high = bounds(parts)
        assert low[2] >= -.04 and .1 < high[2] < 5, (name,low,high)
        assert all(.1 < high[i]-low[i] < 7 for i in range(3)), (name,low,high)
    return library


PURPOSES = {
    'firewood': 'Household winter fuel stacked on ground bearers.',
    'coal_bin': 'Open household coal storage with a low shovelling front.',
    'privy': 'Simple detached timber household toilet.',
    'shed': 'Small domestic tool and fuel store with paired doors.',
    'small_timber_house': 'Single-storey timber home with painted door, framed windows and chimney.',
    'hay_stack': 'Covered-shape loose hay reserve on timber bearers.',
    'water_cart': 'Hand-drawn two-wheel water tank cart.',
    'bicycle': 'Utilitarian upright bicycle with a simple diamond frame.',
    'tractor': 'Generic older blue agricultural tractor with enclosed cab.',
    'farm_trailer': 'Single-axle timber-sided agricultural trailer and tow drawbar.',
    'loading_pallet': 'Reusable timber loading pallet.',
    'repair_bench': 'Outdoor timber repair workbench with a small metal vice.',
    'sandpit': 'Timber-edged communal play sandpit.',
    'climbing_frame': 'Painted steel ladder and overhead-rung playground frame.',
}


if __name__ == '__main__':
    library = self_check()
    catalog = []
    for name, parts in library.items():
        low, high = bounds(parts)
        catalog.append(dict(name=name, dimensions_m=dict(zip(('width','depth','height'),
                            (round(high[i]-low[i],3) for i in range(3)))),
                            purpose=PURPOSES[name],
                            period_status='Artistic interpretation for late-November 1998; no specific model or provenance claimed.',
                            artistic_generic=True, part_count=len(parts)))
    Path(__file__).with_name('prop-catalog.json').write_text(json.dumps(catalog,indent=2)+'\n')
    print(f'Validated {len(library)} deterministic props; wrote prop-catalog.json')
