"""Artistic layout proposals; positions are metres in the original town coordinates."""
import importlib.util
import json
import math
import random
import heapq
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('base_layout', ROOT.parent / 'layout.py')
L = importlib.util.module_from_spec(spec)
spec.loader.exec_module(L)
SEED = 19981128
LANE_DEPTH = 3
spec = importlib.util.spec_from_file_location('realism_layout', ROOT.parent / 'realism-v1/realism_layout.py')
R = importlib.util.module_from_spec(spec)
spec.loader.exec_module(R)


def protected_roads():
    return [r for r in L.ROADS if not r[0].startswith(('Ger lane ', 'Ger street ', 'East residential ', 'West residential '))]


def overlap(a, b):
    """Convex polygon intersection, allowing shared boundaries."""
    if any(max(p[i] for p in a) <= min(p[i] for p in b)+1e-7 or
           max(p[i] for p in b) <= min(p[i] for p in a)+1e-7 for i in (0,1)):
        return False
    for poly in (a, b):
        for p, q in zip(poly, poly[1:] + poly[:1]):
            axis = (p[1] - q[1], q[0] - p[0])
            ap = [v[0]*axis[0] + v[1]*axis[1] for v in a]
            bp = [v[0]*axis[0] + v[1]*axis[1] for v in b]
            if max(ap) <= min(bp) + 1e-7 or max(bp) <= min(ap) + 1e-7:
                return False
    return True


def strip(a, b, width):
    dx, dy = b[0]-a[0], b[1]-a[1]
    length = math.hypot(dx, dy)
    ux, uy = dx/length, dy/length
    nx, ny = -uy*width/2, ux*width/2
    return [[a[0]-ux*width/2+nx,a[1]-uy*width/2+ny], [b[0]+ux*width/2+nx,b[1]+uy*width/2+ny], [b[0]+ux*width/2-nx,b[1]+uy*width/2-ny], [a[0]-ux*width/2-nx,a[1]-uy*width/2-ny]]


def polygon_area(poly):
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(poly,poly[1:]+poly[:1])))/2


def clip_line(poly, normal, offset):
    """Keep dot(point, normal) >= offset (convex half-plane clipping)."""
    out = []
    for a,b in zip(poly,poly[1:]+poly[:1]):
        da = a[0]*normal[0]+a[1]*normal[1]-offset
        db = b[0]*normal[0]+b[1]*normal[1]-offset
        if da >= -1e-9:
            out.append(list(a))
        if (da < -1e-9 and db > 1e-9) or (db < -1e-9 and da > 1e-9):
            t = da/(da-db)
            out.append([a[i]+t*(b[i]-a[i]) for i in (0,1)])
    return out if len(out) >= 3 and polygon_area(out) > 1e-7 else []


def split_by_line(poly, normal, offset, gap=0):
    return (clip_line(poly, normal, offset+gap/2),
            clip_line(poly, [-n for n in normal], -offset+gap/2))


def inset(poly, margin):
    out = poly
    for a,b in zip(poly,poly[1:]+poly[:1]):
        length = math.dist(a,b)
        if length < 1e-8:
            continue
        n = [(a[1]-b[1])/length,(b[0]-a[0])/length]
        out = clip_line(out,n,a[0]*n[0]+a[1]*n[1]+margin)
    return out


def subtract_polygon(poly, cutter):
    """Convex pieces of poly minus a convex CCW cutter; no hull approximation."""
    if not overlap(poly,cutter):
        return [poly]
    out, remainder = [], poly
    for a,b in zip(cutter,cutter[1:]+cutter[:1]):
        n = [a[1]-b[1],b[0]-a[0]]
        inside, outside = split_by_line(remainder,n,a[0]*n[0]+a[1]*n[1])
        if outside:
            out.append(outside)
        remainder = inside
        if not remainder:
            break
    return out


def corridor(a,b,width):
    # strip() is clockwise; clipping helpers use counterclockwise polygons.
    return list(reversed(strip(a,b,width)))


def project(p,a,b):
    dx,dy = b[0]-a[0],b[1]-a[1]
    if dx*dx+dy*dy < 1e-16:
        return list(a)
    t = max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)))
    return [a[0]+t*dx,a[1]+t*dy]


def intersection(a,b,c,d):
    u,v = [b[i]-a[i] for i in (0,1)], [d[i]-c[i] for i in (0,1)]
    det = u[0]*v[1]-u[1]*v[0]
    if abs(det) < 1e-9:
        return None
    w = [c[i]-a[i] for i in (0,1)]
    t,s = (w[0]*v[1]-w[1]*v[0])/det, (w[0]*u[1]-w[1]*u[0])/det
    if -1e-8 <= t <= 1+1e-8 and -1e-8 <= s <= 1+1e-8:
        return [a[i]+t*u[i] for i in (0,1)]


def lane_graph(lanes):
    segments = [(l['id'],a,b) for l in lanes for a,b in zip(l['points'],l['points'][1:])]
    points = {tuple(round(v,6) for v in p) for _,a,b in segments for p in (a,b)}
    for i,(_,a,b) in enumerate(segments):
        for _,c,d in segments[i+1:]:
            p = intersection(a,b,c,d)
            if p:
                points.add(tuple(round(v,6) for v in p))
    ordered = sorted(points)
    ids = {p:i for i,p in enumerate(ordered)}
    edges = []
    for lane,a,b in segments:
        on = sorted((p for p in ordered if L.distance_segment(p,a,b) < 2e-6), key=lambda p:math.dist(a,p))
        edges.extend({'nodes':[ids[p],ids[q]],'lane':lane} for p,q in zip(on,on[1:]) if math.dist(p,q) > 1e-5)
    return {'nodes':[{'id':i,'xy':list(p)} for i,p in enumerate(ordered)], 'edges':edges}


def graph_components(graph):
    adjacency = {n['id']:set() for n in graph['nodes']}
    for edge in graph['edges']:
        a,b = edge['nodes']
        adjacency[a].add(b)
        adjacency[b].add(a)
    unseen, groups = set(adjacency), []
    while unseen:
        todo, group = [min(unseen)], set()
        while todo:
            n = todo.pop()
            if n in unseen:
                unseen.remove(n)
                group.add(n)
                todo.extend(adjacency[n]-group)
        groups.append(group)
    return groups


def hull(points):
    points = sorted(set(tuple(p) for p in points))
    def cross(a,b,c):
        return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    def chain(ps):
        out = []
        for p in ps:
            while len(out)>1 and cross(out[-2],out[-1],p) <= 1e-8:
                out.pop()
            out.append(p)
        return out
    return [list(p) for p in chain(points)[:-1]+chain(points[::-1])[:-1]]


def shared_edge(a,b):
    longest = 0
    for p,q in zip(a,a[1:]+a[:1]):
        length = math.dist(p,q)
        if length < 1e-7:
            continue
        u = [(q[i]-p[i])/length for i in (0,1)]
        for r,s in zip(b,b[1:]+b[:1]):
            if all(abs((v[0]-p[0])*u[1]-(v[1]-p[1])*u[0]) < 1e-6 for v in (r,s)):
                ts = [sum((v[i]-p[i])*u[i] for i in (0,1)) for v in (r,s)]
                longest = max(longest,min(length,max(ts))-max(0,min(ts)))
    return longest


def gate_on_lane(poly, lanes):
    """Find a positive-length shared fence/lane edge, including dead-end caps."""
    bounds = [(min(p[i] for p in poly),max(p[i] for p in poly)) for i in (0,1)]
    for lane in lanes:
        radius = lane['width']*.71
        if any(max(p[i] for p in lane['points'])+radius < bounds[i][0]-1e-6 or
               min(p[i] for p in lane['points'])-radius > bounds[i][1]+1e-6 for i in (0,1)):
            continue
        for a,b in zip(lane['points'],lane['points'][1:]):
            shape = corridor(a,b,lane['width'])
            if shared_edge(poly,shape) < .8:
                continue
            for c,d in zip(poly,poly[1:]+poly[:1]):
                p = [(c[i]+d[i])/2 for i in (0,1)]
                # Clip a long fence edge to the actual lane edge before choosing the gate.
                for e,f in zip(shape,shape[1:]+shape[:1]):
                    if L.distance_segment(e,c,d)<1e-6 and L.distance_segment(f,c,d)<1e-6:
                        p = [(e[i]+f[i])/2 for i in (0,1)]
                    else:
                        ends = [v for v in (c,d,e,f) if L.distance_segment(v,c,d)<1e-6 and L.distance_segment(v,e,f)<1e-6]
                        if len(ends)<2 or math.dist(ends[0],ends[-1])<.8:
                            continue
                        p = [(ends[0][i]+ends[-1][i])/2 for i in (0,1)]
                    if abs(L.distance_segment(p,a,b)-lane['width']/2) < 1e-5:
                        return lane['id'], p
    return None


def yard_items(parcel, rng, residential=False, garden=False):
    poly, placed = parcel['polygon'], []
    edge = max(zip(poly,poly[1:]+poly[:1]),key=lambda ab:(ab[0][1]+ab[1][1])/2)
    angle = math.atan2(edge[1][1]-edge[0][1],edge[1][0]-edge[0][0])
    angle = (angle+math.pi/2)%math.pi-math.pi/2
    def place(kind,w,d,preference,octagon=False):
        if octagon:
            d = w
            shape = [[w/2*math.cos(i*math.pi/4),w/2*math.sin(i*math.pi/4)] for i in range(8)]
        else:
            shape = [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]]
        shape = [[x*math.cos(angle)-y*math.sin(angle),x*math.sin(angle)+y*math.cos(angle)] for x,y in shape]
        feasible = poly
        for a,b in zip(poly,poly[1:]+poly[:1]):
            length = math.dist(a,b)
            if length < 1e-8:
                continue
            n = [(a[1]-b[1])/length,(b[0]-a[0])/length]
            bound = sum(a[i]*n[i] for i in (0,1))-min(sum(v[i]*n[i] for i in (0,1)) for v in shape)+.25
            feasible = clip_line(feasible,n,bound)
        if not feasible:
            return None
        center = [sum(v[i] for v in feasible)/len(feasible) for i in (0,1)]
        candidates = feasible+[center]
        for _ in range(100):
            a,b = rng.sample(feasible,2)
            t,s = rng.random(),rng.random()
            candidates.append([center[i]*(1-t)+(a[i]*s+b[i]*(1-s))*t for i in (0,1)])
        for xy in sorted(candidates,key=preference):
            footprint = [[xy[i]+v[i] for i in (0,1)] for v in shape]
            if not any(overlap(footprint,item['footprint']) for item in placed):
                item = {'type':kind,'xy':xy,'rotation':angle,'scale':1,'width':w,'depth':d,
                        'footprint':footprint,'parcel':parcel['id']}
                if residential and kind=='zhiguli':
                    item['parking'] = 'private_yard'
                placed.append(item)
                return item
        return None
    north = rng.random()<.5
    preference = (lambda p:-p[1]+.05*p[0]) if north else (lambda p:p[0]-.05*p[1])
    ger = False if residential else rng.random()<.6
    main = place('ger' if ger else 'house',rng.uniform(6,7) if ger else rng.uniform(6,11) if residential else rng.uniform(6,10),rng.uniform(6,9) if residential else rng.uniform(5,8),preference,ger)
    if main is None:
        main = place('house' if residential else 'ger',6,6,preference,not residential)
    if main is None:
        raise ValueError(f"Dwelling cannot fit {parcel['id']}")
    radius = main['width']/2 if main['type']=='ger' else main['depth']/2
    main['door'] = [main['xy'][0]+math.sin(angle)*radius,main['xy'][1]-math.cos(angle)*radius]
    required = [place('privy',1.2,1.2,lambda p:-math.dist(p,main['xy'])),
                place('coal_bin',1.6,1.2,lambda p:math.dist(p,main['door'])),
                place('firewood',2,1,lambda p:math.dist(p,main['door']))]
    if any(item is None for item in required):
        raise ValueError(f"Required yard items cannot fit {parcel['id']}")
    if rng.random()<(.72 if residential else .6):
        place('shed',2.4,3,lambda p:-math.dist(p,main['door']))
    extras = {'poor':[('scrap',1.5,1),('tyres',.9,.9)],
              'ordinary':[('water_cans',.8,.6)],
              'maintained':[('vegetable_plot',3,2),('laundry_line',3,.5)],
              'better_off':[('vegetable_plot',4,3),('zhiguli',3.8,1.6)]}
    if residential:
        extras = {tier:[item for item in kinds if item[0]!='vegetable_plot'] for tier,kinds in extras.items()}
        if garden and place('vegetable_plot',3,2,lambda p:math.dist(p,parcel['gate'])) is None:
            raise ValueError(f"Garden cannot fit {parcel['id']}")
    for kind,w,d in extras[parcel['condition']]:
        place(kind,w,d,lambda p:math.dist(p,parcel['gate']))
    return placed


def subdivide_ger_district(seed=SEED):
    """Artistic BSP khashaa patchwork; all dimensions are metres, all draws seeded."""
    rng = random.Random(seed)
    xmin,ymin,xmax,ymax = next(b for name,b in R.DISTRICTS if name=='Ger/house compounds')
    boundary = []
    for x,y in ((xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)):
        # Artistic choice: move outward so the perturbed boundary retains the reference district.
        angle = math.atan2(y-(ymin+ymax)/2,x-(xmin+xmax)/2)+rng.uniform(-.4,.4)
        distance = rng.uniform(10,25)
        boundary.append([x+math.cos(angle)*distance,y+math.sin(angle)*distance])
    pieces = [boundary]
    for _,width,points in protected_roads():
        for a,b in zip(points,points[1:]):
            cut = corridor(a,b,width+12)
            pieces = [part for poly in pieces for part in subtract_polygon(poly,cut)]
    pieces = [p for p in pieces if polygon_area(p)>=150 and inset(p,4)]
    arterial_area = sum(polygon_area(p) for p in pieces)
    lanes, leaves = [], []
    def add_lane(points,width,role):
        lane = {'id':f'ger_lane_{len(lanes):03}','district':'ger','width':width,
                'points':[list(p) for p in points],'surface':'dirt','role':role}
        lanes.append(lane)
        return lane
    # These links reuse existing arterial centre lines, joining entrances across their setbacks.
    add_lane([[-1100,-470],[-1100,-600],[-1100,-720],[-1100,-780]],3.5,'arterial_connection')
    south = next(ps for name,_,ps in protected_roads() if name=='South distributor')
    add_lane([[-1420,-850+230*130/550],south[1],[-975,-720+125*180/340]],3.5,'arterial_connection')
    def split(poly,depth):
        target = rng.uniform(150,1100)
        if polygon_area(poly)<target:
            leaves.append(poly)
            return
        coords = np.asarray(poly)
        _,vectors = np.linalg.eigh(np.cov(coords.T))
        axis = vectors[:,-1]
        for _ in range(32):
            angle = math.radians(rng.choice((-1,1))*rng.uniform(8,20))
            normal = [axis[0]*math.cos(angle)-axis[1]*math.sin(angle),axis[0]*math.sin(angle)+axis[1]*math.cos(angle)]
            projections = [sum(p[i]*normal[i] for i in (0,1)) for p in poly]
            offset = min(projections)+(max(projections)-min(projections))*rng.uniform(.35,.65)
            width = rng.uniform(3.5,6) if depth<LANE_DEPTH else 0
            halves = split_by_line(poly,normal,offset,width)
            # Insetting by 3.5 rejects <7m slabs; the larger core also fits a dwelling.
            if any(polygon_area(p)<150 or not inset(p,4) for p in halves):
                continue
            if width:
                hits = []
                for a,b in zip(poly,poly[1:]+poly[:1]):
                    da,db = [sum(v[i]*normal[i] for i in (0,1))-offset for v in (a,b)]
                    if da*db<0:
                        hits.append([a[i]+da/(da-db)*(b[i]-a[i]) for i in (0,1)])
                if len(hits)!=2:
                    continue
                existing = [(a,b) for lane in lanes for a,b in zip(lane['points'],lane['points'][1:])]
                direction = [(hits[1][i]-hits[0][i])/math.dist(*hits) for i in (0,1)]
                for i,p in enumerate(hits):
                    extended = [p[j]+direction[j]*(24 if i else -24) for j in (0,1)]
                    joins = [q for a,b in existing if (q:=intersection(p,extended,a,b)) is not None]
                    if joins:
                        hits[i] = min(joins,key=lambda q:math.dist(p,q))
                # Prefer a parent-network endpoint as the start of the polyline.
                hits.sort(key=lambda p:min(L.distance_segment(p,a,b) for a,b in existing))
                add_lane(hits,width,'lane')
            for part in halves:
                split(part,depth+1)
            return
        leaves.append(poly)
    for poly in pieces:
        depth = max(0,LANE_DEPTH-max(1,round(math.log2(polygon_area(poly)/6400))))
        split(poly,depth)
    split_area = sum(polygon_area(p) for p in leaves)
    # Only convex unions are accepted, so SAT stays exact after merging shared fences.
    initial_leaves = len(leaves)
    desired_merges = round(initial_leaves*.1)
    candidates = []
    for i,a in enumerate(leaves):
        for j in range(i+1,len(leaves)):
            b = leaves[j]
            if shared_edge(a,b)>8:
                merged = hull(a+b)
                if abs(polygon_area(merged)-polygon_area(a)-polygon_area(b))<1e-5:
                    candidates.append((i,j,merged))
    rng.shuffle(candidates)
    used, merged_polys = set(), []
    for i,j,merged in candidates:
        if i not in used and j not in used and len(merged_polys)<desired_merges:
            used.update((i,j))
            merged_polys.append(merged)
    leaves = [p for i,p in enumerate(leaves) if i not in used]+merged_polys
    graph = lane_graph(lanes)
    while len(graph_components(graph))>1:
        groups = graph_components(graph)
        anchor = groups[0]
        nodes = graph['nodes']
        _,a,b = min((math.dist(nodes[i]['xy'],nodes[j]['xy']),nodes[i]['xy'],nodes[j]['xy'])
                    for i in anchor for group in groups[1:] for j in group)
        add_lane([a,b],rng.uniform(3.5,6),'lane_connection')
        graph = lane_graph(lanes)
    def carve(polys,shape):
        return [part for poly in polys for part in subtract_polygon(poly,shape)
                if polygon_area(part)>=120 and inset(part,3.5)]
    for lane in lanes:
        for a,b in zip(lane['points'],lane['points'][1:]):
            leaves = carve(leaves,corridor(a,b,lane['width']))
    lane_area = sum(polygon_area(p) for p in leaves)
    # Route 1.2m passages along shared fences, preserving the interior of each yard.
    vertices = sorted(set(tuple(round(v,7) for v in p) for poly in leaves for p in poly))
    adjacency = {v:set() for v in vertices}
    yard_edges = []
    for poly in leaves:
        edges = set()
        for a,b in zip(poly,poly[1:]+poly[:1]):
            on = sorted((v for v in vertices if L.distance_segment(v,a,b)<1e-6),key=lambda v:math.dist(a,v))
            for u,v in zip(on,on[1:]):
                if math.dist(u,v)>.001:
                    adjacency[u].add(v)
                    adjacency[v].add(u)
                    edges.add((u,v))
        yard_edges.append(edges)
    distance,previous,sources,queue = {},{},{},[]
    for v in vertices:
        joins = [(math.dist(v,q),q) for lane in lanes for a,b in zip(lane['points'],lane['points'][1:])
                 if abs(L.distance_segment(v,a,b)-lane['width']/2)<1e-5
                 for q in [project(v,a,b)]]
        if joins:
            cost,q = min(joins)
            distance[v],sources[v] = cost,q
            heapq.heappush(queue,(cost,v))
    while queue:
        cost,u = heapq.heappop(queue)
        if cost>distance[u]+1e-8:
            continue
        for v in sorted(adjacency[u]):
            new = cost+math.dist(u,v)
            if new<distance.get(v,math.inf)-1e-8:
                distance[v],previous[v] = new,u
                heapq.heappush(queue,(new,v))
    selected,entrances = set(),set()
    for poly,edges in zip(leaves,yard_edges):
        if gate_on_lane(poly,lanes):
            continue
        choices = [(distance.get(u,math.inf)+math.dist(u,v),u,v) for u,v in edges if math.dist(u,v)>5]
        choices += [(distance.get(v,math.inf)+math.dist(u,v),v,u) for u,v in edges if math.dist(u,v)>5]
        cost,u,v = min(choices)
        if not math.isfinite(cost):
            raise ValueError('Fence component has no lane access')
        selected.add(tuple(sorted((u,v))))
        while u in previous:
            v = previous[u]
            selected.add(tuple(sorted((u,v))))
            u = v
        entrances.add(u)
    passages = []
    for v in sorted(entrances):
        passages.append(add_lane([sources[v],v],1.2,'gap_passage'))
    for a,b in sorted(selected,key=lambda ab:(min(distance[ab[0]],distance[ab[1]]),ab)):
        if distance[a]>distance[b]:
            a,b = b,a
        passages.append(add_lane([a,b],1.2,'gap_passage'))
    def trim_passage(leaves,shape):
        trimmed = []
        for poly in leaves:
            if not overlap(poly,shape):
                trimmed.append(poly)
                continue
            # A passage follows a fence: inset that fence instead of fragmenting its yard at caps.
            outside = [clip_line(poly,[b[1]-a[1],a[0]-b[0]],a[0]*b[1]-b[0]*a[1])
                       for a,b in zip(shape,shape[1:]+shape[:1])]
            part = max(outside,key=polygon_area)
            if polygon_area(part)>=120 and inset(part,3.5):
                trimmed.append(part)
        return trimmed
    for lane in passages:
        leaves = trim_passage(leaves,corridor(*lane['points'],lane['width']))
    # Junction caps can shorten a frontage; give those yards a short fence-side spur.
    for _ in range(200):
        blocked = next((p for p in leaves if not gate_on_lane(p,lanes)),None)
        if blocked is None:
            break
        choices = []
        for a,b in zip(blocked,blocked[1:]+blocked[:1]):
            length = math.dist(a,b)
            if length<5:
                continue
            u = [(b[i]-a[i])/length for i in (0,1)]
            n = [-u[1],u[0]]
            p = [(a[i]+b[i])/2-n[i]*.6 for i in (0,1)]
            for lane in lanes:
                for c,d in zip(lane['points'],lane['points'][1:]):
                    q = project(p,c,d)
                    if sum((q[i]-p[i])*n[i] for i in (0,1))<=1e-7:
                        choices.append((math.dist(p,q),q,p,[p[i]+u[i]*min(4,length/2-.7) for i in (0,1)]))
        _,q,p,end = min(choices)
        lane = add_lane([q,p,end],1.2,'gap_passage')
        for a,b in zip(lane['points'],lane['points'][1:]):
            leaves = trim_passage(leaves,corridor(a,b,1.2))
    else:
        raise ValueError('Fence-side access repair did not converge')
    parcels,clutter = [], []
    scores = []
    for poly in leaves:
        x,y = [sum(p[i] for p in poly)/len(poly) for i in (0,1)]
        edge = min(x-xmin,xmax-x,y-ymin,ymax-y)/100
        drainage = math.exp(-((x-(-910+100*math.sin(y/800)))/110)**2)
        scores.append(.25*math.sin(x/70)+.2*math.cos(y/85)+.3*edge-.5*drainage+rng.gauss(0,.55))
    rank = {i:n/len(leaves) for n,i in enumerate(sorted(range(len(leaves)),key=lambda i:scores[i]))}
    empty = set(rng.sample(range(len(leaves)),round(len(leaves)*.055)))
    for i,poly in enumerate(leaves):
        condition = 'poor' if rank[i]<.30 else 'ordinary' if rank[i]<.70 else 'maintained' if rank[i]<.92 else 'better_off'
        lane,gate = gate_on_lane(poly,lanes)
        parcel = {'id':f'ger_parcel_{i:03}','district':'ger','lane':lane,'polygon':poly,
                  'gate':gate,'road_edge':gate[:],'approach':[gate,gate[:]],'condition':condition,
                  'contents':[],'status':'empty_lot' if i in empty else 'occupied'}
        if i not in empty:
            items = yard_items(parcel,rng)
            parcel['contents'] = [item['type'] for item in items]
            clutter.extend(items)
        parcels.append(parcel)
    return {'parcels':parcels,'lanes':lanes,'clutter':clutter,'ger_lane_graph':lane_graph(lanes),
            'ger_subdivision':{'boundary':boundary,'lane_depth':LANE_DEPTH,'initial_leaves':initial_leaves,
                               'merged_pairs':len(merged_polys),'arterial_setback':6,'passage_width':1.2,
                               'arterial_clipped_area':arterial_area,'split_area':split_area,
                               'lane_carved_area':lane_area}}


def _legacy_generate(seed, ger_clutter):
    rng = random.Random(seed)
    roads = []
    for name, width, points in protected_roads():
        surface = 'asphalt_cracked' if name in ('North approach', 'West avenue', 'East avenue', 'South distributor') else 'gravel'
        segments = []
        for a, b in zip(points, points[1:]):
            puddles = [[round(a[0]*.4+b[0]*.6, 2), round(a[1]*.4+b[1]*.6, 2)]] if rng.random() < .22 else []
            segments.append({'surface':surface, 'shoulder':'gravel' if surface.startswith('asphalt') else 'dirt', 'shoulder_width':round(rng.uniform(.5, 1.8), 2), 'potholes':puddles, 'puddles':puddles if rng.random()<.5 else [], 'markings':'faded_remnants' if name in ('West avenue','East avenue') and rng.random()<.15 else 'none'})
        roads.append({'name':name, 'width':width, 'points':[list(p) for p in points], 'segments':segments})
    # Dead-end branches start on protected roads; bends are artistic drainage/frontage choices.
    branches = [
        ('ger', [(-1100,-510),(-1140,-488),(-1180,-470),(-1225,-480),(-1270,-465),(-1320,-485),(-1385,-477)]),
        ('ger', [(-1100,-600),(-1155,-582),(-1210,-605),(-1260,-590),(-1305,-570),(-1360,-585),(-1390,-570)]),
        ('ger', [(-1100,-690),(-1140,-672),(-1175,-650),(-1220,-662),(-1255,-640),(-1305,-650),(-1350,-635)]),
        ('ger', [(-1100,-780),(-1155,-765),(-1200,-745),(-1245,-755),(-1285,-735),(-1330,-745),(-1370,-730)]),
        ('ger', [(-1100,-600),(-1060,-583),(-1020,-603),(-980,-595)]),
        ('east', [(-60,310),(65,320),(130,305),(205,330),(275,312),(345,340),(420,325),(490,350),(570,335)]),
        ('east', [(350,650),(350,600),(315,565),(330,510),(315,450),(340,400),(345,340)]),
        ('east', [(345,340),(360,385),(420,405),(480,390),(550,420),(600,405)]),
        ('west', [(-66.07142857,-335),(-130,-335),(-180,-330),(-240,-315),(-300,-335),(-365,-320),(-430,-345),(-500,-330),(-580,-345)]),
        ('west', [(-365,-320),(-380,-370),(-365,-420),(-390,-480)]),
    ]
    lanes = [{'id':f'lane_{i:02}', 'district':d, 'width':round(rng.uniform(3,6),2), 'points':[list(p) for p in ps], 'surface':'dirt' if d=='ger' else 'gravel'} for i,(d,ps) in enumerate(branches)]
    landmarks = {k:[float(v['x_m_east']),float(v['y_m_north']),L.height(float(v['x_m_east']),float(v['y_m_north']))] for k,v in L.LOCATIONS.items()}
    road_strips = [strip(a, b, r['width']+1) for r in roads+lanes for a,b in zip(r['points'],r['points'][1:])]
    parcels, clutter = [], []
    for lane in lanes:
        for a, b in zip(lane['points'], lane['points'][1:]):
            length = math.dist(a,b)
            dx,dy = (b[0]-a[0])/length,(b[1]-a[1])/length
            for side in (-1,1):
                cursor = 4.0
                while cursor < length-12:
                    width = rng.uniform(10,24)
                    if cursor+width > length-3: break
                    depth = rng.uniform(10,30)
                    nx,ny = -dy*side,dx*side
                    offset = lane['width']/2+1
                    def point(t, d): return [round(a[0]+dx*t+nx*d,3),round(a[1]+dy*t+ny*d,3)]
                    poly = [point(cursor,offset), point(cursor+width,offset), point(cursor+width-rng.uniform(0,3),offset+depth), point(cursor+rng.uniform(0,3),offset+depth)]
                    gate = point(cursor+width/2,offset)
                    edge = point(cursor+width/2,lane['width']/2)
                    if not any(overlap(poly, p) for p in road_strips) and not any(overlap(poly, p['polygon']) for p in parcels):
                        tier = rng.choices(['poor','ordinary','maintained','better_off'], [30,40,22,8])[0]
                        empty = rng.random()<.06
                        contents = [] if empty else (['ger','small_timber_house','privy','coal_bin','firewood'] if lane['district']=='ger' and rng.random()<.55 else ['house','privy','coal_bin','firewood'])
                        parcel = {'id':f'parcel_{len(parcels):03}', 'district':lane['district'], 'lane':lane['id'], 'polygon':poly, 'gate':gate, 'road_edge':edge, 'approach':[gate,edge], 'condition':tier, 'contents':contents, 'status':'empty' if empty else 'occupied'}
                        parcels.append(parcel)
                        for kind in contents:
                            xy=point(cursor+width*rng.uniform(.25,.75),offset+depth*rng.uniform(.25,.7))
                            if lane['district']=='ger': ger_clutter.add(len(clutter))
                            clutter.append({'type':kind,'xy':xy,'rotation':round(rng.uniform(-math.pi,math.pi),3),'scale':1})
                    cursor += width+rng.uniform(1,5)
    apartments = []
    positions = [(235,-340),(305,-340),(375,-340),(475,-340),(235,-430),(315,-430),(395,-430),(475,-430),(235,-495),(315,-495),(395,-495),(475,-495),(160,337.5),(480,562.5),(320,487.5),(560,412.5),(420,-370)]
    for i, xy in enumerate(positions):
        if i == 3:
            continue
        if i == 2:
            xy = (425, -340)
        hero = xy == (420,-370)
        sections = 4 if hero else rng.randint(3,4)
        apartments.append({'id':'N12' if hero else f'apartment_{i:02}', 'xy':list(xy), 'sections':sections, 'length':43 if hero else (100 if i == 2 else sections*13.4), 'depth':13, 'storeys':4 if hero else rng.choice([4,5]), 'rotation_degrees':0 if hero else round(rng.choice([-1,1])*rng.uniform(3,8),1), 'shape':'merged_pair' if i == 2 else ('L' if i in (9,14) else 'slab'), 'condition':rng.choice(['ordinary','maintained','weathered']), 'stains':rng.randint(1,5), 'enclosed_balconies':rng.randint(0,5), 'laundry':rng.randint(0,4), 'antennas':rng.randint(1,4), 'entrance':'original' if hero else rng.choice(['repainted','patched','worn']), 'entry':[420,-379.2] if hero else None})
    garages = [{'id':f'garage_row_{i}', 'xy':xy, 'type':kind, 'units':units, 'rotation_degrees':rot, 'parking':'dirt'} for i,(xy,kind,units,rot) in enumerate([([280,-555],'metal',7,0),([485,-565],'brick',5,3),([570,440],'metal',5,8),([-535,-390],'metal',6,-4)])]
    paths = [{'points':points, 'surface':'dirt', 'width':1.2} for points in [[[-720,-202],[-674,-202],[-674,-315],[-760,-340]],[[-275,-135],[-330,-100],[-370,-60]],[[170,-390],[220,-370],[250,-340]],[[-1100,-690],[-1040,-655],[-980,-630]]]]
    extras = ['water_cans','laundry_line','dog','tyres','scrap','shed','utility_pole','chimney','vegetable_plot','uaz','moskvich','zhiguli','satellite_dish']
    for p in parcels:
        if p['status'] == 'empty': continue
        x=sum(v[0] for v in p['polygon'])/4; y=sum(v[1] for v in p['polygon'])/4
        for kind in rng.sample(extras, rng.randint(2,4)):
            if kind == 'satellite_dish' and rng.random()>.08: continue
            if p['district']=='ger': ger_clutter.add(len(clutter))
            clutter.append({'type':kind,'xy':[round(x,2),round(y,2)],'rotation':round(rng.uniform(-math.pi,math.pi),3),'scale':1})
    for xy in [(1100,1250),(-1100,1250),(1500,1300)]:
        for i,kind in enumerate(['hay_stack','livestock_pen','tractor','farm_trailer']):
            clutter.append({'type':kind,'xy':[xy[0]+i*9,xy[1]],'rotation':0,'scale':1})
    return {'version':'v002', 'seed':seed, 'artistic_choices':True, 'landmarks':landmarks, 'routes':{'arrival':[list(p) for p in L.ARRIVAL], 'foot_entry':[list(p) for p in L.FOOT_ENTRY]}, 'roads':roads, 'lanes':lanes, 'parcels':parcels, 'apartments':apartments, 'desire_paths':paths, 'clutter':clutter, 'garages':garages}



def rectangle(xy,w,d,angle=0):
    c,s = math.cos(angle),math.sin(angle)
    return [[xy[0]+x*c-y*s,xy[1]+x*s+y*c] for x,y in ((-w/2,-d/2),(w/2,-d/2),(w/2,d/2),(-w/2,d/2))]


def footprint_distance(first,second):
    best = math.inf
    for a in first:
        for b in second:
            if overlap(a,b):
                return 0
            best = min(best,*(L.distance_segment(p,u,v) for p in a for u,v in zip(b,b[1:]+b[:1])),
                       *(L.distance_segment(p,u,v) for p in b for u,v in zip(a,a[1:]+a[:1])))
    return best


def landmark_footprints():
    # N11/N17 are district extents, while N12 is represented by its block record.
    return [rectangle([float(r['x_m_east']),float(r['y_m_north'])],float(r['placeholder_width_m']),float(r['placeholder_depth_m']))
            for key,r in L.LOCATIONS.items() if key not in ('N01','N11','N12','N17')]


def subdivide_residential(district,bounds,roads,seed):
    """Jittered BSP blocks and varying lane-facing yard strips; no grid scaffold."""
    rng = random.Random(seed)
    xmin,ymin,xmax,ymax = bounds
    boundary = []
    for x,y in ((xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)):
        angle = math.atan2(y-(ymin+ymax)/2,x-(xmin+xmax)/2)+rng.uniform(-.45,.45)
        if district=='apartment_south':
            # The south distributor bounds a tapering strip: its old track peels southeast.
            angle = {(xmin,ymax):math.pi+.45,(xmax,ymax):-.45,
                     (xmin,ymin):-1.7,(xmax,ymin):-.06}[(x,y)]
        distance = rng.uniform(35,40) if district=='apartment_south' else rng.uniform(15,40)
        boundary.append([x+math.cos(angle)*distance,y+math.sin(angle)*distance])
    corners = [p[:] for p in boundary]
    if district=='apartment_south':
        boundary = hull(boundary+[[(xmin+xmax)/2,ymax+4]])
    else:
        # Unequal shoulders bend the perimeter; the north edge follows the industry road.
        boundary = hull(boundary+[[xmin-rng.uniform(35,40),ymin+(ymax-ymin)*.35],
                                  [xmax+rng.uniform(35,40),ymin+(ymax-ymin)*.65]])
        if district=='east':
            boundary = clip_line(boundary,[50,-390],50*(-40)-390*600+4.8*math.hypot(50,390))
    lanes,blocks,cuts = [],[],[]
    def add(points,name=None,role='residential_lane'):
        lane = {'id':f'{district}_lane_{len(lanes):03}','district':district,'width':4.8,
                'points':points,'surface':'dirt','role':role}
        if name:
            lane['name'] = name
        lanes.append(lane)
    add(boundary+[boundary[0]],role='boundary_lane')
    connections = [r for r in L.ROADS if r[0].startswith('East residential' if district=='east' else 'West residential') and 'connection' in r[0]] if district!='apartment_south' else []
    for name,_,points in connections:
        ps = [list(p) for p in points]
        add(ps,name)
        p = ps[-1] if district=='east' else ps[0]
        _,q = min((math.dist(p,q),q) for l in lanes[:-1] for a,b in zip(l['points'],l['points'][1:]) for q in [project(p,a,b)])
        if math.dist(p,q)>1e-6:
            add([p,q])
    # Artistic old tracks aim at the retained junctions, splitting rather than crossing a grid.
    track = {'east':[[-60,310],[650,670]],'west':[[-760,-540],[-120,-220]],
             'apartment_south':[[170,-530],[550,-680]]}[district]
    add(track,role='old_track')
    pieces = [inset(boundary,2.4)]
    blockers = [corridor(a,b,r['width']+1) for r in roads for a,b in zip(r['points'],r['points'][1:])]+landmark_footprints()
    for shape in blockers+[corridor(*track,4.8)]:
        pieces = [p for old in pieces for p in subtract_polygon(old,shape) if polygon_area(p)>=220 and inset(p,4.5)]
    def split(poly):
        area = polygon_area(poly)
        if area<rng.uniform(4500,10500):
            blocks.append(poly)
            return
        _,vectors = np.linalg.eigh(np.cov(np.asarray(poly).T))
        axis = vectors[:,-1]
        for _ in range(32):
            jitter = rng.choice((-1,1))*rng.uniform(8,20)
            angle = math.atan2(axis[1],axis[0])+math.radians(jitter)
            normal = [math.cos(angle),math.sin(angle)]
            values = [sum(p[i]*normal[i] for i in (0,1)) for p in poly]
            fraction = rng.uniform(.35,.65)
            offset = min(values)+(max(values)-min(values))*fraction
            halves = split_by_line(poly,normal,offset,4.8)
            if any(polygon_area(p)<1300 or not inset(p,10) for p in halves):
                continue
            hits = []
            for a,b in zip(poly,poly[1:]+poly[:1]):
                da,db = [sum(v[i]*normal[i] for i in (0,1))-offset for v in (a,b)]
                if da*db<0:
                    hits.append([a[i]+da/(da-db)*(b[i]-a[i]) for i in (0,1)])
            if len(hits)!=2:
                continue
            direction = [(hits[1][i]-hits[0][i])/math.dist(*hits) for i in (0,1)]
            for j,p in enumerate(hits):
                end = [p[i]+direction[i]*(12 if j else -12) for i in (0,1)]
                joins = [q for l in lanes for a,b in zip(l['points'],l['points'][1:]) if (q:=intersection(p,end,a,b)) is not None]
                if joins:
                    hits[j] = min(joins,key=lambda q:math.dist(p,q))
            add(hits)
            cuts.append({'jitter_degrees':jitter,'split_fraction':fraction})
            for p in halves:
                split(p)
            return
        blocks.append(poly)
    for p in pieces:
        split(p)
    graph = lane_graph(lanes)
    while len(graph_components(graph))>1:
        groups,nodes = graph_components(graph),graph['nodes']
        _,a,b = min((math.dist(nodes[i]['xy'],nodes[j]['xy']),nodes[i]['xy'],nodes[j]['xy'])
                    for i in groups[0] for group in groups[1:] for j in group)
        add([a,b])
        graph = lane_graph(lanes)
    block_areas = [polygon_area(p) for p in blocks]
    shapes = [corridor(a,b,l['width']) for l in lanes for a,b in zip(l['points'],l['points'][1:])]
    for shape in shapes:
        blocks = [p for old in blocks for p in subtract_polygon(old,shape) if polygon_area(p)>=180 and inset(p,4.5)]
    yards = []
    for block in blocks:
        remainder = [block]
        # Cut strips from the longest frontages first, leaving non-overlapping corner yards.
        for a,b in sorted(zip(block,block[1:]+block[:1]),key=lambda ab:-math.dist(*ab)):
            length = math.dist(a,b)
            if length<15:
                continue
            u = [(b[i]-a[i])/length for i in (0,1)]
            n = [-u[1],u[0]]
            offset = sum(a[i]*n[i] for i in (0,1))+rng.uniform(28,38)
            strips,next_remainder = [],[]
            for poly in remainder:
                core,front = split_by_line(poly,n,offset)
                if core:
                    next_remainder.append(core)
                if front:
                    strips.append(front)
            remainder = next_remainder
            for front in strips:
                fronts = []
                for c,d in zip(front,front[1:]+front[:1]):
                    for shape in shapes:
                        for e,f in zip(shape,shape[1:]+shape[:1]):
                            ends = [v for v in (c,d,e,f) if L.distance_segment(v,c,d)<1e-6 and L.distance_segment(v,e,f)<1e-6]
                            if len(ends)>=2:
                                v,w = max(((v,w) for v in ends for w in ends),key=lambda pair:math.dist(*pair))
                                fronts.append((math.dist(v,w),v,w))
                if not fronts:
                    continue
                length,v,w = max(fronts)
                if length<15:
                    continue
                tangent = [(w[i]-v[i])/length for i in (0,1)]
                start = sum(v[i]*tangent[i] for i in (0,1))
                count = max(math.ceil(length/30),min(round(length/22),math.floor(length/15)))
                cursor,remaining = start,length
                for j in range(count):
                    left = count-j-1
                    width = rng.uniform(max(15,remaining-30*left),min(30,remaining-15*left)) if left else remaining
                    end = cursor+width
                    poly = front if j==0 else clip_line(front,tangent,cursor)
                    if left:
                        poly = clip_line(poly,[-t for t in tangent],-end)
                    cursor,remaining = end,remaining-width
                    if polygon_area(poly)>=180 and inset(poly,4.5):
                        yards.append(poly)
    frontages = []
    for poly in yards:
        choices = [(max(shared_edge(poly,corridor(a,b,l['width'])) for a,b in zip(l['points'],l['points'][1:])),l) for l in lanes]
        suitable = [l for width,l in sorted(choices,key=lambda pair:-pair[0]) if 15-1e-6<=width<=30+1e-6]
        gate = gate_on_lane(poly,suitable)
        if gate:
            frontages.append((poly,gate))
    yards = [p for p,_ in frontages]
    gardens = set(rng.sample(range(len(yards)),round(len(yards)*.3)))
    scores = [rng.gauss(0,.55)+.2*math.sin(sum(v[0] for v in p)/len(p)/70)+.15*math.cos(sum(v[1] for v in p)/len(p)/85) for p in yards]
    rank = {i:n/len(yards) for n,i in enumerate(sorted(range(len(yards)),key=lambda i:scores[i]))}
    parcels,items = [],[]
    for i,(poly,(lane,gate)) in enumerate(frontages):
        tier = 'poor' if rank[i]<.22 else 'ordinary' if rank[i]<.62 else 'maintained' if rank[i]<.9 else 'better_off'
        p = {'id':f'{district}_parcel_{i:03}','district':district,'polygon':poly,'lane':lane,
             'gate':gate,'road_edge':gate[:],'approach':[gate,gate[:]],'condition':tier,'status':'occupied','fence':'timber_patched'}
        contents = yard_items(p,rng,residential=True,garden=i in gardens)
        p['contents'] = [item['type'] for item in contents]
        parcels.append(p)
        items.extend(contents)
    return parcels,lanes,items,{'bounds':bounds,'boundary':boundary,'perturbed_corners':corners,'area':(xmax-xmin)*(ymax-ymin),
                                'block_areas':block_areas,'cuts':cuts,'yard_depth_range':[28,38]}


def restore_roadside(data,seed,obstacles):
    """Restore v001 frontage ribbons, reserving each fitted yard before the next."""
    rng = random.Random(seed)
    old = json.loads((ROOT.parent/'realism-v1/city-manifest.json').read_text())['parcels']
    centers = [[sum(v[i] for v in p['polygon'])/len(p['polygon']) for i in (0,1)] for p in old]
    segments = [(r['name'],a,b) for r in data['roads'] for a,b in zip(r['points'],r['points'][1:])]
    frontages = {}
    for c in centers:
        name,a,b = min(segments,key=lambda row:L.distance_segment(c,row[1],row[2]))
        frontages.setdefault((name,tuple(a),tuple(b)),[]).append(c)
    road_shapes = [corridor(a,b,r['width']) for r in data['roads']+data['lanes'] for a,b in zip(r['points'],r['points'][1:])]
    blockers = road_shapes+obstacles+[p['polygon'] for p in data['parcels']]
    restored = []
    for road in data['roads']:
        lane = {'id':f'roadside_{len(data["lanes"]):03}','district':'roadside','name':road['name'],
                'points':road['points'],'width':road['width'],'surface':'dirt','role':'roadside_frontage'}
        for a,b in zip(road['points'],road['points'][1:]):
            length = math.dist(a,b)
            u = [(b[i]-a[i])/length for i in (0,1)]
            for side in (-1,1):
                n = [-u[1]*side,u[0]*side]
                targets = [sum((c[i]-a[i])*u[i] for i in (0,1)) for c in frontages.get((road['name'],tuple(a),tuple(b)),[])
                           if L.distance_segment(c,a,b)<60 and 0<sum((c[i]-a[i])*n[i] for i in (0,1))<60]
                if not targets:
                    continue
                cursor = max(2,min(targets)-22)
                stop = min(length-2,max(targets)+22)
                while cursor+14<stop:
                    width = min(rng.uniform(14,28),stop-cursor)
                    depth = rng.uniform(22,38)
                    def point(t,d): return [a[i]+u[i]*t+n[i]*d for i in (0,1)]
                    edge = road['width']/2
                    poly = hull([point(cursor,edge),point(cursor+width,edge),
                                 point(cursor+width-rng.uniform(0,2),edge+depth),point(cursor+rng.uniform(0,2),edge+depth)])
                    pieces = [poly]
                    for shape in blockers:
                        pieces = [p for old_poly in pieces for p in subtract_polygon(old_poly,shape)]
                        if not pieces:
                            break
                    for poly in pieces:
                        frontage = max(shared_edge(poly,corridor(c,d,lane['width'])) for c,d in zip(lane['points'],lane['points'][1:]))
                        gate = gate_on_lane(poly,[lane])
                        if not (14-1e-6<=frontage<=28+1e-6 and polygon_area(poly)>=200 and inset(poly,4.5) and gate):
                            continue
                        p = {'id':f'roadside_parcel_{len(restored):03}','district':'roadside','polygon':poly,
                             'lane':lane['id'],'gate':gate[1],'road_edge':gate[1][:],'approach':[gate[1],gate[1][:]],
                             'condition':rng.choices(['poor','ordinary','maintained','better_off'],[30,40,22,8])[0],
                             'status':'occupied','fence':'timber_patched','road':road['name']}
                        items = yard_items(p,rng,residential=True,garden=rng.random()<.3)
                        p['contents'] = [i['type'] for i in items]
                        data['parcels'].append(p)
                        data['clutter'].extend(items)
                        restored.append(p)
                        blockers.append(poly)
                    cursor += width+rng.uniform(2,9)
        if any(p['lane']==lane['id'] for p in restored):
            data['lanes'].append(lane)
    data['removed_with_reason'] = []
    data['restored_roadside_plots'] = len(restored)


def apartment_blocks(seed,hero):
    rng = random.Random(seed)
    # Artistic choices: three street bands; the northern band forms two-sided courts.
    sites = [(220,-317,3,16,5,'L',-1),(305,-326,4,15,-4,'slab',-1),
             (441,-320,6,16,4,'merged_pair',-1),(270,-367,4,16,-6,'slab',1),
             (216,-417,3,14,5,'slab',1),(293,-426,4,15,-7,'slab',1),
             (391,-425,5,15,3,'slab',-1),(480,-434,3,14,-5,'slab',-1),
             (218,-504,3,14,-4,'L',1),(322,-488,5,15,6,'slab',1),
             (454,-504,6,15,-3,'slab',1)]
    blocks = []
    for i,(x,y,sections,section_length,rotation,shape,side) in enumerate(sites):
        length,depth = sections*section_length,12
        angle = math.radians(rotation)
        def transform(p):
            return [x+p[0]*math.cos(angle)-p[1]*math.sin(angle),y+p[0]*math.sin(angle)+p[1]*math.cos(angle)]
        parts = [rectangle([0,0],length,depth)]
        if shape=='L':
            parts.append(rectangle([-length/2+depth/2,side*(depth/2+8)],depth,16))
        if shape=='merged_pair':
            parts = [rectangle([-length/4,0],length/2,depth),rectangle([length/4,3],length/2,depth)]
        entries = [transform([-length/2+(n+.5)*section_length,side*depth/2+(3 if shape=='merged_pair' and n>=sections/2 else 0)]) for n in range(sections)]
        if shape=='L':
            entries[0] = transform([-length/2+depth/2,side*(depth/2+16)])
        blocks.append({'id':f'apartment_{i:02}','xy':[x,y],'sections':sections,'section_length':section_length,
                       'length':length,'depth':depth,'storeys':rng.choice([4,5]),'rotation_degrees':rotation,
                       'shape':shape,'footprints':[[transform(v) for v in part] for part in parts],
                       'condition':rng.choice(['ordinary','maintained','weathered']),'stains':rng.randint(1,5),
                       'enclosed_balconies':rng.randint(2,12),'laundry':rng.randint(2,8),'antennas':rng.randint(2,6),
                       'entrance':rng.choice(['repainted','patched','worn']),'entrances':entries,'courtyard_side':side,
                       'courtyard':'north' if y>-390 else 'middle' if y>-460 else 'south'})
    hero.update({'footprints':[rectangle(hero['xy'],hero['length'],hero['depth'])],
                 'entrances':[hero['entry']],'courtyard_side':-1,'courtyard':'north'})
    blocks.append(hero)
    return blocks


def extend_town(data,seed):
    rng = random.Random(seed+400)
    data['parcels'] = [p for p in data['parcels'] if p['district']=='ger']
    data['lanes'] = [l for l in data['lanes'] if l['district']=='ger']
    data['clutter'] = [i for i in data['clutter'] if i.get('parcel','').startswith('ger_parcel_')]
    data['residential_subdivision'] = {}
    for j,(district,bounds) in enumerate([('east',[100,290,620,620]),('west',[-600,-510,-160,-240]),('apartment_south',[180,-610,510,-540])]):
        parcels,lanes,items,meta = subdivide_residential(district,bounds,data['roads'],seed+100+j)
        data['parcels'].extend(parcels)
        data['lanes'].extend(lanes)
        data['clutter'].extend(items)
        data['residential_subdivision'][district] = meta
    data['apartments'] = apartment_blocks(seed+200,next(a for a in data['apartments'] if a['id']=='N12'))
    roads = [corridor(a,b,r['width']) for r in data['roads']+data['lanes'] for a,b in zip(r['points'],r['points'][1:])]
    routes = [corridor(a,b,2) for points in data['routes'].values() for a,b in zip(points,points[1:])]
    structures = landmark_footprints()+[f for a in data['apartments'] for f in a['footprints']]
    parcels = [p['polygon'] for p in data['parcels']]
    occupied = [i['footprint'] for i in data['clutter']]
    # Broad-phase bins keep the final rejection pass cheap on the production laptop.
    bins = {}
    def cells(shape):
        return [(x,y) for x in range(math.floor(min(p[0] for p in shape)/32),math.floor(max(p[0] for p in shape)/32)+1)
                for y in range(math.floor(min(p[1] for p in shape)/32),math.floor(max(p[1] for p in shape)/32)+1)]
    def reserve(shape):
        for key in cells(shape):
            bins.setdefault(key,[]).append(shape)
    for shape in roads+routes+structures+occupied+parcels:
        reserve(shape)
    def free(shape):
        candidates = {id(s):s for key in cells(shape) for s in bins.get(key,[])}
        return not any(overlap(shape,s) for s in candidates.values())
    data['garages'] = []
    # Waste strips: two apartment flanks, two market edges and two plant approaches.
    for j,(xy,units,angle,road_name) in enumerate([([145,-338],8,90,'Apartment west lane'),([545,-431],7,90,'Apartment west lane'),
                                                ([-350,-151],10,0,'West avenue'),([-170,-151],8,0,'West avenue'),
                                                ([1080,550],9,90,'Plant access'),([1175,652],10,0,'Plant access')]):
        a = math.radians(angle)
        footprint = rectangle(xy,units*3.5,6,a)
        road = next(r for r in data['roads'] if r['name']==road_name)
        _,q = min((math.dist(xy,q),q) for u,v in zip(road['points'],road['points'][1:]) for q in [project(xy,u,v)])
        distance = math.dist(xy,q)
        toward = [(q[k]-xy[k])/distance for k in (0,1)]
        apron_center = [xy[k]+toward[k]*(3+(distance-3)/2) for k in (0,1)]
        apron = rectangle(apron_center,units*3.5,distance-3,a)
        # The apron touches its road; only the boxes must stay off the carriageway.
        if not free(footprint) or any(overlap(apron,s) for s in structures+occupied+parcels):
            raise ValueError(f'Garage {j} does not fit')
        boxes = [rectangle([xy[0]+(n-(units-1)/2)*3.5*math.cos(a),xy[1]+(n-(units-1)/2)*3.5*math.sin(a)],3.5,6,a) for n in range(units)]
        data['garages'].append({'id':f'garage_row_{j}','xy':xy,'units':units,'box_size':[3.5,6],
                                'type':'brick' if j%2 else 'metal','rotation_degrees':angle,'footprint':footprint,
                                'boxes':boxes,'apron':apron,'access':[apron_center,q],'road':road_name,'parking':'dirt'})
        structures.extend([footprint,apron])
        reserve(footprint)
        reserve(apron)
    def place(kind,w,d,bounds,owner=None,angle=0):
        for _ in range(4000):
            xy = [rng.uniform(bounds[0]+w/2,bounds[2]-w/2),rng.uniform(bounds[1]+d/2,bounds[3]-d/2)]
            shape = rectangle(xy,w,d,angle)
            if free(shape):
                item = {'type':kind,'xy':xy,'width':w,'depth':d,'rotation':angle,'scale':1,'footprint':shape}
                if owner:
                    item['courtyard'] = owner
                data['clutter'].append(item)
                occupied.append(shape)
                reserve(shape)
                return item
        raise ValueError(f'Cannot fit {kind} in {owner or bounds}')
    data['courtyards'] = []
    data['desire_paths'] = [p for p in data['desire_paths'] if p['points']!=[[170,-390],[220,-370],[250,-340]]]
    for name,bounds in [('north',[183,-380,506,-299]),('middle',[182,-451,508,-399]),('south',[182,-521,508,-469])]:
        courtyard = {'id':name,'bounds':bounds}
        # Desire paths cut the lane corners; endpoints stop at the carriageway edge.
        paths = []
        top,bottom = (-290,-390) if name=='north' else (-390,-460) if name=='middle' else (-460,-530)
        for cx,cy,sx,sy in [(170,top,1,-1),(520,top,-1,-1),(170,bottom,1,1),(520,bottom,-1,1)]:
            for length in (22,28,34,40):
                points = [[cx+sx*3,cy+sy*length],[cx+sx*(length/2+1),cy+sy*(length/2+1)],[cx+sx*length,cy+sy*3]]
                shape = hull([v for a,b in zip(points,points[1:]) for v in corridor(a,b,.8)])
                if not free(shape):
                    continue
                item = {'type':'desire_path','xy':points[1],'width':.8,'depth':length,'rotation':0,'scale':1,
                        'footprint':shape,'points':points,'courtyard':name}
                data['clutter'].append(item)
                occupied.append(shape)
                reserve(shape)
                paths.append({'points':points,'width':.8,'surface':'dirt','courtyard':name})
                break
            if len(paths)==4:
                break
        if len(paths)<2:
            raise ValueError(f'Not enough corner paths in {name}')
        courtyard['desire_paths'] = paths
        data['desire_paths'].extend(paths)
        for kind,w,d,count in [('playground_frame',5,3,1),('bench',2,.65,4),('rubbish_point',3,2,1),('laundry_line',7,.7,2)]:
            for _ in range(count):
                place(kind,w,d,bounds,name)
        pipe = place('heat_pipe',19,3,bounds,name)
        x,y = pipe['xy']
        pipe['points'] = [[x-8.5,y-.75],[x+8.5,y-.75],[x+8.5,y+.75]]
        pipe['clearance'] = .6
        courtyard['heat_pipe'] = {'points':pipe['points'],'diameter':.3,'clearance':.6}
        # Parking patches are reservations; cars are fitted inside their own patch.
        count = rng.randint(6,8)
        patch = place('parking_patch',count*3+1,6,bounds,name)
        data['clutter'].remove(patch)
        occupied.remove(patch['footprint'])
        courtyard['parking_patch'] = patch['footprint']
        for n in range(count):
            xy = [patch['xy'][0]+(n-(count-1)/2)*3,patch['xy'][1]]
            kind = ('uaz','moskvich','zhiguli')[n%3]
            car = {'type':kind,'xy':xy,'rotation':math.pi/2,'width':4.4,'depth':1.8,'scale':1,
                   'footprint':rectangle(xy,4.4,1.8,math.pi/2),'courtyard':name,'parking':'dirt_patch',
                   'condition':'rusting' if n%4==0 else 'used'}
            data['clutter'].append(car)
            occupied.append(car['footprint'])
            reserve(car['footprint'])
        data['courtyards'].append(courtyard)
    before = len(data['clutter'])
    restore_roadside(data,seed+500,structures+routes+[i['footprint'] for i in data['clutter'] if 'parcel' not in i])
    for p in data['parcels']:
        if p['district']=='roadside':
            reserve(p['polygon'])
    for item in data['clutter'][before:]:
        reserve(item['footprint'])
    # Final variable-radius Poisson rejection pass, after every solid reservation.
    sizes = {'water_cans':(.8,.6,8),'laundry_line':(5,.6,20),'dog':(1.1,.5,12),'tyres':(1.3,1.3,14),
             'scrap':(2,1.5,18),'shed':(3,3,30),'utility_pole':(.6,.6,32),'chimney':(.7,.7,20),
             'vegetable_plot':(4,3,35),'uaz':(4.4,1.8,25),'moskvich':(4.2,1.7,25),'zhiguli':(4.1,1.7,25),
             'satellite_dish':(1,1,100),'hay_stack':(3,3,35),'livestock_pen':(6,5,50),
             'tractor':(4,2.4,40),'farm_trailer':(4,2.5,35),'car_shell':(4.4,1.8,70)}
    data['clutter_min_spacing'] = {k:v[2] for k,v in sizes.items()}
    for kind,(w,d,spacing) in sizes.items():
        accepted = []
        target = 6 if kind in ('dog','car_shell','satellite_dish') else 22
        for _ in range(12000):
            if len(accepted)>=target:
                break
            if kind=='dog':
                center = [-275,-80] if rng.random()<.5 else rng.choice(data['garages'])['xy']
                xy = [center[0]+rng.uniform(-55,55),center[1]+rng.uniform(-55,55)]
            elif kind in ('hay_stack','livestock_pen','tractor','farm_trailer','car_shell'):
                xy = [rng.uniform(-1500,1500),rng.choice([-1,1])*rng.uniform(850,1350)]
            else:
                xy = [rng.uniform(-1450,1450),rng.uniform(-1050,1250)]
            angle = rng.uniform(-math.pi,math.pi)
            shape = rectangle(xy,w,d,angle)
            if any(math.dist(xy,p)<spacing for p in accepted) or not free(shape):
                continue
            if kind in ('uaz','moskvich','zhiguli'):
                if not any(0<=min(L.distance_segment(xy,a,b) for a,b in zip(r['points'],r['points'][1:]))-r['width']/2<=5 for r in data['roads']):
                    continue
            item = {'type':kind,'xy':xy,'rotation':angle,'width':w,'depth':d,'scale':1,'footprint':shape,'pass':'poisson'}
            if kind=='car_shell':
                item['condition'] = 'burnt' if len(accepted)%2 else 'abandoned'
            if kind in ('uaz','moskvich','zhiguli'):
                item['parking'] = 'shoulder'
            accepted.append(xy)
            data['clutter'].append(item)
            occupied.append(shape)
            reserve(shape)
        if len(accepted)<target:
            raise ValueError(f'Poisson pass only placed {len(accepted)}/{target} {kind}')

def generate(seed=SEED):
    # Preserve round 3 ger records exactly; later passes have independent random streams.
    ger_clutter = set()
    data = _legacy_generate(seed,ger_clutter)
    ger = subdivide_ger_district(seed)
    data['parcels'] = [p for p in data['parcels'] if p['district']!='ger']+ger['parcels']
    data['lanes'] = [l for l in data['lanes'] if l['district']!='ger']+ger['lanes']
    data['clutter'] = [p for i,p in enumerate(data['clutter']) if i not in ger_clutter]+ger['clutter']
    data.update({k:v for k,v in ger.items() if k not in ('parcels','lanes','clutter')})
    extend_town(data,seed)
    return data

if __name__ == '__main__':
    (ROOT/'city-layout-v002.json').write_text(json.dumps(generate(), indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
