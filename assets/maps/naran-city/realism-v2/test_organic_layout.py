import importlib.util
import json
import math
import statistics
from collections import Counter
import unittest
from pathlib import Path

PATH = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('organic_layout', PATH / 'organic_layout.py')
O = importlib.util.module_from_spec(spec)
spec.loader.exec_module(O)

class OrganicLayoutTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = O.generate()

    def test_deterministic_and_protected(self):
        a = self.data
        self.assertEqual(json.dumps(a, sort_keys=True), json.dumps(O.generate(), sort_keys=True))
        self.assertEqual(a,json.loads((PATH/'city-layout-v002.json').read_text()))
        roads = {r['name']: r['points'] for r in a['roads']}
        for name, width, points in O.protected_roads():
            self.assertEqual(roads[name], [list(p) for p in points])
            self.assertEqual(next(r['width'] for r in a['roads'] if r['name']==name), width)
        self.assertEqual(a['routes']['arrival'], [list(p) for p in O.L.ARRIVAL])
        self.assertEqual(a['routes']['foot_entry'], [list(p) for p in O.L.FOOT_ENTRY])
        for key, row in O.L.LOCATIONS.items():
            self.assertEqual(a['landmarks'][key][:2], [float(row['x_m_east']), float(row['y_m_north'])])
        self.assertNotIn('traffic_light', json.dumps(a).lower())

    def test_parcels_clear_roads_and_each_other(self):
        data = self.data
        parcels = data['parcels']
        self.assertGreater(len(parcels), 100)
        strips = [O.strip(a,b,r['width']) for r in data['roads']+data['lanes'] for a,b in zip(r['points'],r['points'][1:])]
        for i, p in enumerate(parcels):
            self.assertFalse(any(O.overlap(p['polygon'], q) for q in strips), p['id'])
            self.assertFalse(any(O.overlap(p['polygon'], q['polygon']) for q in parcels[i+1:]), p['id'])
            lane = next(l for l in data['lanes'] if l['id'] == p['lane'])
            self.assertAlmostEqual(min(O.L.distance_segment(p['road_edge'], a,b) for a,b in zip(lane['points'],lane['points'][1:])),lane['width']/2,delta=.002)
            if math.dist(p['gate'], p['road_edge']) > .001:
                approach = O.strip(p['gate'], p['road_edge'], 0.5)
                self.assertFalse(any(O.overlap(approach,q['polygon']) for q in parcels if q is not p),p['id'])

    def test_ger_access_and_footprints(self):
        data = self.data
        yards = [p for p in data['parcels'] if p['district'] == 'ger']
        items = [i for i in data['clutter'] if i.get('parcel') in {p['id'] for p in yards}]
        self.assertGreater(len(items), len(yards)*3)
        empty = [p for p in yards if p['status'] == 'empty_lot']
        self.assertGreaterEqual(len(empty)/len(yards), .03)
        self.assertLessEqual(len(empty)/len(yards), .08)
        for p in yards:
            contents = [i for i in items if i['parcel'] == p['id']]
            if p['status'] == 'empty_lot':
                self.assertFalse(contents)
                continue
            lane = next(l for l in data['lanes'] if l['id'] == p['lane'])
            distance = min(O.L.distance_segment(p['gate'],a,b) for a,b in zip(lane['points'],lane['points'][1:]))
            self.assertAlmostEqual(distance, lane['width']/2, delta=.5, msg=p['id'])
            self.assertLess(min(O.L.distance_segment(p['gate'],a,b) for a,b in zip(p['polygon'],p['polygon'][1:]+p['polygon'][:1])), .01)
            kinds = {i['type'] for i in contents}
            self.assertTrue(kinds & {'ger','house','small_timber_house'}, p['id'])
            self.assertTrue({'privy','coal_bin','firewood'} <= kinds, p['id'])
            for j, item in enumerate(contents):
                for v in item['footprint']:
                    crosses = [(b[0]-a[0])*(v[1]-a[1])-(b[1]-a[1])*(v[0]-a[0])
                               for a,b in zip(p['polygon'],p['polygon'][1:]+p['polygon'][:1])]
                    self.assertTrue(all(c >= -1e-6 for c in crosses) or all(c <= 1e-6 for c in crosses), (p['id'],item['type']))
                self.assertFalse(any(O.overlap(item['footprint'], other['footprint']) for other in contents[j+1:]), (p['id'],item['type']))

    def test_ger_setbacks_and_subdivision(self):
        yards = [p for p in self.data['parcels'] if p['district']=='ger']
        buffers = [O.strip(a,b,r['width']+12) for r in self.data['roads'] for a,b in zip(r['points'],r['points'][1:])]
        for p in yards:
            self.assertFalse(any(O.overlap(p['polygon'],buffer) for buffer in buffers),p['id'])
            for a,b in zip(p['polygon'],p['polygon'][1:]+p['polygon'][:1]):
                length = math.dist(a,b)
                if length<1e-7:
                    continue
                projections = [(v[0]*(a[1]-b[1])+v[1]*(b[0]-a[0]))/length for v in p['polygon']]
                self.assertGreaterEqual(max(projections)-min(projections),7-1e-6,p['id'])
        meta = self.data['ger_subdivision']
        self.assertAlmostEqual(meta['merged_pairs']/meta['initial_leaves'],.1,delta=.02)
        self.assertTrue(any(O.shared_edge(p['polygon'],q['polygon'])>8 for j,p in enumerate(yards) for q in yards[j+1:]))
        for lane in self.data['lanes']:
            if lane['district']=='ger':
                if lane['role']=='gap_passage':
                    self.assertEqual(lane['width'],1.2)
                else:
                    self.assertTrue(3.5<=lane['width']<=6)

    def test_ger_graph_connected_and_arterials(self):
        graph = self.data.get('ger_lane_graph')
        self.assertIsNotNone(graph, 'Ger lanes need an explicit joined graph')
        adjacency = {n['id']:set() for n in graph['nodes']}
        nodes = {n['id']:n['xy'] for n in graph['nodes']}
        lanes = {l['id']:l for l in self.data['lanes']}
        self.assertEqual({e['lane'] for e in graph['edges']}, {l['id'] for l in self.data['lanes'] if l['district']=='ger'})
        for edge in graph['edges']:
            a,b = edge['nodes']
            self.assertGreater(math.dist(nodes[a],nodes[b]), .001)
            adjacency[a].add(b)
            adjacency[b].add(a)
            lane = lanes[edge['lane']]
            for n in (a,b):
                self.assertLess(min(O.L.distance_segment(nodes[n],u,v) for u,v in zip(lane['points'],lane['points'][1:])), .001)
        reached, todo = set(), [next(iter(adjacency))]
        while todo:
            n = todo.pop()
            if n not in reached:
                reached.add(n)
                todo.extend(adjacency[n]-reached)
        self.assertEqual(reached, set(adjacency))
        contacts = {name:set() for name in ('Ger approach','South distributor')}
        for n in graph['nodes']:
            for road in self.data['roads']:
                if road['name'] in contacts and min(O.L.distance_segment(n['xy'],a,b) for a,b in zip(road['points'],road['points'][1:])) < .001:
                    contacts[road['name']].add(n['id'])
        self.assertTrue(all(contacts.values()))
        self.assertGreaterEqual(len(set.union(*contacts.values())),2)

    def test_subdivision_varies_with_seed(self):
        self.assertNotEqual(O.generate(23)['parcels'], self.data['parcels'])

    def test_ger_district_coverage(self):
        parcels = [p for p in self.data['parcels'] if p['district'] == 'ger']
        def area(poly):
            return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(poly,poly[1:]+poly[:1])))/2
        def clip(poly, axis, bound, sign):
            out = []
            for a, b in zip(poly, poly[1:] + poly[:1]):
                da, db = sign*(a[axis]-bound), sign*(b[axis]-bound)
                if da >= 0:
                    out.append(a)
                if (da < 0 < db) or (db < 0 < da):
                    t = da/(da-db)
                    out.append([a[i]+t*(b[i]-a[i]) for i in (0,1)])
            return out
        clipped = []
        for p in parcels:
            poly = p['polygon']
            for axis, bound, sign in [(0,-1420,1),(0,-975,-1),(1,-830,1),(1,-470,-1)]:
                poly = clip(poly,axis,bound,sign) if poly else []
            clipped.append(poly)
        self.assertGreaterEqual(sum(area(p) for p in clipped if p)/(445*360), .70)

    def test_ger_angles(self):
        data = self.data
        headings = [((math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))+90) % 180)-90
                    for lane in data['lanes'] if lane['district'] == 'ger'
                    for a,b in zip(lane['points'],lane['points'][1:])]
        edges = [math.degrees(math.atan2(b[1]-a[1],b[0]-a[0])) % 90
                 for p in data['parcels'] if p['district'] == 'ger'
                 for a,b in zip(p['polygon'],p['polygon'][1:]+p['polygon'][:1])]
        self.assertGreater(statistics.pstdev(headings), 15)
        self.assertLess(sum(min(a,90-a) <= 5 for a in edges)/len(edges), .4)

    def test_apartment_geometry_and_hero(self):
        apartments = self.data['apartments']
        hero = next(a for a in apartments if a['id'] == 'N12')
        self.assertEqual((hero['xy'], hero['length'], hero['depth'], hero['rotation_degrees'], hero['entry']), ([420, -370], 43, 13, 0, [420, -379.2]))
        others = [a for a in apartments if a['id'] != 'N12']
        self.assertTrue(all(40 <= a['length'] <= 110 for a in others))
        self.assertGreaterEqual(sum(a['rotation_degrees'] != 0 for a in others) / len(others), .8)
        self.assertGreaterEqual(sum(a['shape'] == 'L' for a in others), 1)
        self.assertTrue(any(a['shape'] == 'merged_pair' for a in others))

    def test_lanes_connect(self):
        data = self.data
        connected = data['roads'][:]
        remaining = data['lanes'][:]
        while remaining:
            eligible = [lane for lane in remaining if any(
                min(O.L.distance_segment(c,a,b),O.L.distance_segment(d,a,b),
                    O.L.distance_segment(a,c,d),O.L.distance_segment(b,c,d))<.001
                or O.intersection(a,b,c,d) is not None
                for c,d in zip(lane['points'],lane['points'][1:])
                for road in connected for a,b in zip(road['points'],road['points'][1:]))]
            self.assertTrue(eligible, [lane['id'] for lane in remaining])
            for lane in eligible:
                connected.append(lane)
                remaining.remove(lane)

    def test_tiers_are_mixed(self):
        parcels = self.data['parcels']
        counts = Counter(p['condition'] for p in parcels)
        for tier, low, high in [('poor',.20,.40),('ordinary',.30,.50),('maintained',.12,.32),('better_off',.03,.15)]:
            self.assertGreaterEqual(counts[tier]/len(parcels),low)
            self.assertLessEqual(counts[tier]/len(parcels),high)
        def center(p): return [sum(v[i] for v in p['polygon'])/len(p['polygon']) for i in (0,1)]
        same = sum(p['condition'] == min((q for q in parcels if q is not p), key=lambda q:math.dist(center(p),center(q)))['condition'] for p in parcels)
        self.assertLess(same/len(parcels),.55)

    def test_e05e_residential_coverage_and_connections(self):
        for district in ('east','west','apartment_south'):
            meta = self.data['residential_subdivision'][district]
            yards = [p for p in self.data['parcels'] if p['district']==district]
            xmin,ymin,xmax,ymax = meta['bounds']
            area = 0
            for p in yards:
                poly = p['polygon']
                for normal,offset in [([1,0],xmin),([-1,0],-xmax),([0,1],ymin),([0,-1],-ymax)]:
                    poly = O.clip_line(poly,normal,offset)
                area += O.polygon_area(poly)
            self.assertGreaterEqual(area/meta['area'], .65)
            lanes = [l for l in self.data['lanes'] if l['district']==district]
            self.assertEqual(len(O.graph_components(O.lane_graph(lanes))),1)
            self.assertTrue(all(4<=l['width']<=6 for l in lanes))
            for p in yards:
                self.assertIsNotNone(O.gate_on_lane(p['polygon'],lanes),p['id'])
                lane = next(l for l in lanes if l['id']==p['lane'])
                frontage = max(O.shared_edge(p['polygon'],O.corridor(a,b,lane['width'])) for a,b in zip(lane['points'],lane['points'][1:]))
                self.assertTrue(15-1e-6<=frontage<=30+1e-6,(p['id'],frontage))
                items = [i for i in self.data['clutter'] if i.get('parcel')==p['id']]
                self.assertTrue({'house','privy','coal_bin'} <= {i['type'] for i in items},p['id'])
                house = next(i for i in items if i['type']=='house')
                self.assertTrue(6<=house['width']<=11)
                for item in items:
                    self.assertAlmostEqual(sum(O.polygon_area(q) for q in O.subtract_polygon(item['footprint'],p['polygon'])),0,delta=1e-6)
            garden_fraction = sum('vegetable_plot' in p['contents'] for p in yards)/len(yards)
            self.assertAlmostEqual(garden_fraction,.3,delta=.025)
        for name,_,points in O.L.ROADS:
            if name in ('East residential north connection','East residential west connection','West residential east connection'):
                self.assertEqual(next(l['points'] for l in self.data['lanes'] if l.get('name')==name),[list(p) for p in points])

    def test_e05f_residential_not_a_grid(self):
        for district in ('east','west','apartment_south'):
            with self.subTest(district=district):
                lanes = [l for l in self.data['lanes'] if l['district']==district]
                yards = [p for p in self.data['parcels'] if p['district']==district]
                headings = [(math.degrees(math.atan2(b[1]-a[1],b[0]-a[0]))+90)%180-90
                            for l in lanes for a,b in zip(l['points'],l['points'][1:])]
                edges = [math.degrees(math.atan2(b[1]-a[1],b[0]-a[0]))%90
                         for p in yards for a,b in zip(p['polygon'],p['polygon'][1:]+p['polygon'][:1])]
                self.assertGreater(statistics.pstdev(headings),15)
                self.assertLess(sum(min(a,90-a)<=5 for a in edges)/len(edges),.4)
                meta = self.data['residential_subdivision'][district]
                areas = meta['block_areas']
                self.assertGreater(max(areas)/min(areas),2)
                self.assertTrue(any(l['role']=='old_track' for l in lanes))
                self.assertTrue(meta['cuts'])
                for cut in meta['cuts']:
                    self.assertTrue(8<=abs(cut['jitter_degrees'])<=20)
                    self.assertTrue(.35<=cut['split_fraction']<=.65)
                x,y,xx,yy = meta['bounds']
                for before,after in zip(((x,y),(xx,y),(xx,yy),(x,yy)),meta['perturbed_corners']):
                    self.assertTrue(15<=math.dist(before,after)<=40)

    def test_e05f_v001_households_preserved(self):
        old = json.loads((PATH.parent/'realism-v1/city-manifest.json').read_text())['parcels']
        removed = self.data.get('removed_with_reason',[])
        self.assertFalse(removed,'No household removals are justified by this brief')
        for household in old:
            c = [sum(v[i] for v in household['polygon'])/len(household['polygon']) for i in (0,1)]
            distances = []
            for p in self.data['parcels']:
                poly = p['polygon']
                crosses = [(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
                           for a,b in zip(poly,poly[1:]+poly[:1])]
                inside = all(t>=-1e-6 for t in crosses) or all(t<=1e-6 for t in crosses)
                distances.append(0 if inside else min(O.L.distance_segment(c,a,b) for a,b in zip(poly,poly[1:]+poly[:1])))
            self.assertLessEqual(min(distances),30,household['id'])

    def test_e05f_roadside_frontages(self):
        ribbons = [p for p in self.data['parcels'] if p['district']=='roadside']
        self.assertGreater(len(ribbons),100)
        widths,depths = [],[]
        for p in ribbons:
            lane = next(l for l in self.data['lanes'] if l['id']==p['lane'])
            frontage = max(O.shared_edge(p['polygon'],O.corridor(a,b,lane['width'])) for a,b in zip(lane['points'],lane['points'][1:]))
            self.assertTrue(14-1e-6<=frontage<=28+1e-6,(p['id'],frontage))
            self.assertIsNotNone(O.gate_on_lane(p['polygon'],[lane]))
            self.assertIn('house',p['contents'])
            widths.append(frontage)
            depths.append(O.polygon_area(p['polygon'])/frontage)
        self.assertGreater(max(widths)-min(widths),8)
        self.assertGreater(max(depths)-min(depths),8)

    def test_e05f_courtyard_life(self):
        for c in self.data['courtyards']:
            kinds = Counter(i['type'] for i in self.data['clutter'] if i.get('courtyard')==c['id'])
            self.assertEqual(kinds['bench'],4)
            self.assertTrue(6<=sum(kinds[k] for k in ('uaz','moskvich','zhiguli'))<=8)
            self.assertTrue(2<=len(c['desire_paths'])<=4)

    def test_e05e_ger_frozen(self):
        import hashlib
        d = self.data
        subset = {k:[i for i in d[k] if i.get('district')=='ger' or (k=='clutter' and i.get('parcel','').startswith('ger_parcel_'))] for k in ('parcels','lanes','clutter')}
        subset.update({k:d[k] for k in ('ger_lane_graph','ger_subdivision')})
        self.assertEqual(hashlib.sha256(json.dumps(subset,sort_keys=True).encode()).hexdigest(),'17fa580b5245f953fbefd9379305f3eb890dc5e2bb5356542e532dd944bb8d4f')
        self.assertIn({'points':[[-1100,-690],[-1040,-655],[-980,-630]],'surface':'dirt','width':1.2},d['desire_paths'])

    def test_e05e_apartment_clearances(self):
        apartments = self.data['apartments']
        for i,a in enumerate(apartments):
            for b in apartments[i+1:]:
                self.assertGreaterEqual(O.footprint_distance(a['footprints'],b['footprints']),12-1e-6,(a['id'],b['id']))
            for road in self.data['roads']+self.data['lanes']:
                shapes = [O.corridor(u,v,road['width']) for u,v in zip(road['points'],road['points'][1:])]
                self.assertGreaterEqual(O.footprint_distance(a['footprints'],shapes),6-1e-6,(a['id'],road.get('name',road.get('id'))))
            if a['id']!='N12':
                self.assertTrue(3<=a['sections']<=6)
                self.assertTrue(14<=a['section_length']<=18)
                self.assertAlmostEqual(a['length'],a['sections']*a['section_length'])
                self.assertTrue(3<=abs(a['rotation_degrees'])<=8)
            self.assertTrue(a['entrances'])
            for entry in a['entrances']:
                if a['id']!='N12':
                    self.assertAlmostEqual(min(O.L.distance_segment(entry,u,v) for part in a['footprints'] for u,v in zip(part,part[1:]+part[:1])),0,delta=1e-6)
        hero = next(a for a in apartments if a['id']=='N12')
        self.assertEqual(hero['entry'],self.data['routes']['foot_entry'][-1])
        obstacles = [f for a in apartments for f in a['footprints']]+[i['footprint'] for i in self.data['clutter'] if not i.get('parcel','').startswith('ger_')]+[g['footprint'] for g in self.data['garages']]
        for route in self.data['routes'].values():
            for u,v in zip(route,route[1:]):
                self.assertFalse(any(O.overlap(O.corridor(u,v,2),f) for f in obstacles))

    def test_e05e_garages_courtyards_and_clutter(self):
        data = self.data
        self.assertTrue(4<=len(data['garages'])<=8)
        for j,g in enumerate(data['garages']):
            self.assertTrue(6<=g['units']<=14)
            self.assertEqual(len(g['boxes']),g['units'])
            self.assertEqual(g['box_size'],[3.5,6])
            solid = [p['polygon'] for p in data['parcels']]+[f for a in data['apartments'] for f in a['footprints']]+O.landmark_footprints()
            self.assertFalse(any(O.overlap(g['footprint'],s) or O.overlap(g['apron'],s) for s in solid))
            for other in data['garages'][j+1:]:
                self.assertFalse(any(O.overlap(a,b) for a in (g['footprint'],g['apron']) for b in (other['footprint'],other['apron'])))
            for r in data['roads']+data['lanes']:
                self.assertFalse(any(O.overlap(g['footprint'],O.corridor(a,b,r['width'])) for a,b in zip(r['points'],r['points'][1:])))
            for item in data['clutter']:
                self.assertFalse(O.overlap(item['footprint'],g['apron']))
            self.assertLess(O.footprint_distance([g['apron']], [O.corridor(a,b,r['width']) for r in data['roads']+data['lanes'] for a,b in zip(r['points'],r['points'][1:])]),1e-6)
        for c in data['courtyards']:
            items = [i for i in data['clutter'] if i.get('courtyard')==c['id']]
            kinds = Counter(i['type'] for i in items)
            self.assertEqual(kinds['playground_frame'],1)
            self.assertTrue(2<=kinds['bench']<=4)
            self.assertEqual(kinds['rubbish_point'],1)
            self.assertTrue(3<=sum(kinds[k] for k in ('uaz','moskvich','zhiguli'))<=8)
            self.assertTrue(kinds['laundry_line'])
            self.assertTrue(2<=len(c['desire_paths'])<=4)
            self.assertEqual(c['heat_pipe']['clearance'],.6)
            self.assertGreaterEqual(len(c['heat_pipe']['points']),3)
            pipe = next(i for i in items if i['type']=='heat_pipe')
            obstacles = [i['footprint'] for i in data['clutter'] if i is not pipe]+[f for a in data['apartments'] for f in a['footprints']]+[g['footprint'] for g in data['garages']]
            for u,v in zip(pipe['points'],pipe['points'][1:]):
                self.assertGreaterEqual(O.footprint_distance([O.corridor(u,v,.3)],obstacles),.6-1e-6)
        items = data['clutter']
        roads = [O.corridor(a,b,r['width']) for r in data['roads']+data['lanes'] for a,b in zip(r['points'],r['points'][1:])]
        structures = [f for a in data['apartments'] for f in a['footprints']]+[g['footprint'] for g in data['garages']]+O.landmark_footprints()
        for j,item in enumerate(items):
            self.assertIn('footprint',item)
            self.assertFalse(any(O.overlap(item['footprint'],s) for s in roads+structures),(j,item['type']))
            self.assertFalse(any(O.overlap(item['footprint'],q['footprint']) for q in items[j+1:]),(j,item['type']))
            if item.get('pass')=='poisson':
                spacing = data['clutter_min_spacing'][item['type']]
                self.assertTrue(all(math.dist(item['xy'],q['xy'])>=spacing for q in items[:j] if q['type']==item['type'] and q.get('pass')=='poisson'))
        self.assertTrue(any(i['type']=='dog' for i in items))
        self.assertTrue(any(i['type']=='car_shell' for i in items))

    def test_polygon_helpers(self):
        square = [[0,0],[10,0],[10,10],[0,10]]
        a,b = O.split_by_line(square,[1,0],4,2)
        self.assertAlmostEqual(O.polygon_area(a),50)
        self.assertAlmostEqual(O.polygon_area(b),30)
        self.assertAlmostEqual(O.polygon_area(O.inset(square,1)),64)
        self.assertFalse(O.overlap(square,[[10,0],[12,0],[12,2],[10,2]]))
        self.assertTrue(O.overlap(square,[[9,0],[12,0],[12,2],[9,2]]))
        self.assertEqual(O.intersection([0,0],[10,0],[5,-1],[5,1]),[5,0])
        self.assertEqual(O.footprint_distance([square],[[[13,0],[15,0],[15,2],[13,2]]]),3)
        self.assertEqual(O.footprint_distance([square],[square]),0)

if __name__ == '__main__':
    unittest.main()
