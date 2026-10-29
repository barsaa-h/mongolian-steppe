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


def yard_items(parcel, rng):
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
                placed.append(item)
                return item
        return None
    north = rng.random()<.5
    preference = (lambda p:-p[1]+.05*p[0]) if north else (lambda p:p[0]-.05*p[1])
    ger = rng.random()<.6
    main = place('ger' if ger else 'house',rng.uniform(6,7) if ger else rng.uniform(6,10),rng.uniform(5,8),preference,ger)
    if main is None:
        main = place('ger',6,6,preference,True)
    if main is None:
        raise ValueError(f"Dwelling cannot fit {parcel['id']}")
    radius = main['width']/2 if main['type']=='ger' else main['depth']/2
    main['door'] = [main['xy'][0]+math.sin(angle)*radius,main['xy'][1]-math.cos(angle)*radius]
    required = [place('privy',1.2,1.2,lambda p:-math.dist(p,main['xy'])),
                place('coal_bin',1.6,1.2,lambda p:math.dist(p,main['door'])),
                place('firewood',2,1,lambda p:math.dist(p,main['door']))]
    if any(item is None for item in required):
        raise ValueError(f"Required yard items cannot fit {parcel['id']}")
    if rng.random()<.6:
        place('shed',2.4,3,lambda p:-math.dist(p,main['door']))
    extras = {'poor':[('scrap',1.5,1),('tyres',.9,.9)],
              'ordinary':[('water_cans',.8,.6)],
              'maintained':[('vegetable_plot',3,2),('laundry_line',3,.5)],
              'better_off':[('vegetable_plot',4,3),('zhiguli',3.8,1.6)]}
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


def generate(seed=SEED):
    # Retain the old RNG sequence so every non-ger record stays unchanged this round.
    ger_clutter = set()
    data = _legacy_generate(seed,ger_clutter)
    ger = subdivide_ger_district(seed)
    data['parcels'] = [p for p in data['parcels'] if p['district']!='ger']+ger['parcels']
    data['lanes'] = [l for l in data['lanes'] if l['district']!='ger']+ger['lanes']
    data['clutter'] = [p for i,p in enumerate(data['clutter']) if i not in ger_clutter]+ger['clutter']
    data.update({k:v for k,v in ger.items() if k not in ('parcels','lanes','clutter')})
    return data

if __name__ == '__main__':
    (ROOT/'city-layout-v002.json').write_text(json.dumps(generate(), indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
