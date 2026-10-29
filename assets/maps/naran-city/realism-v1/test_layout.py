import math, unittest
import realism_layout as R

class RealismLayoutTests(unittest.TestCase):
    def test_landmark_ground_and_story_routes_preserved(self):
        for r in R.L.LOCATIONS.values():
            x,y=float(r['x_m_east']),float(r['y_m_north'])
            self.assertAlmostEqual(R.height(x,y),R.L.height(x,y),places=7)
        self.assertEqual(R.L.ARRIVAL[-1],(420,-390))
        self.assertEqual(R.L.FOOT_ENTRY[-1],(420,-379.2))
    def test_landscape_continues_beyond_existing_edges(self):
        for x,y in [(2700,350),(-2700,-900),(550,2400),(550,-2400)]:
            self.assertLess(abs(R.height(x+.1,y)-R.height(x-.1,y)),.2)
        self.assertGreater(max(R.height(x,y) for x,y in [(-3000,1600),(1100,3900),(3800,-1800)]),100)
    def test_roads_remain_drivable(self):
        for _,_,points in R.L.ROADS+R.FARM_ROADS:
            for a,b in zip(points,points[1:]):
                n=max(1,math.ceil(math.dist(a,b)/8));prev=R.height(*a)
                for i in range(1,n+1):
                    p=tuple(a[k]+(b[k]-a[k])*i/n for k in [0,1]);z=R.height(*p)
                    self.assertLess(abs(z-prev)/(math.dist(a,b)/n),.08);prev=z
    def test_household_families_are_deterministic_and_useful(self):
        families={R.household_profile(i)['family'] for i in range(100)}
        self.assertGreaterEqual(len(families),6)
        for i in range(100):
            p=R.household_profile(i);self.assertEqual(p,R.household_profile(i))
            self.assertIn(p['condition'],['maintained','ordinary','patched'])
            self.assertTrue(p['fuel']);self.assertGreaterEqual(p['width'],14)
    def test_school_footpath_goes_around_buildings(self):
        for a,b in zip(R.SCHOOL_FOOTPATH,R.SCHOOL_FOOTPATH[1:]):
            for i in range(101):
                x=a[0]+(b[0]-a[0])*i/100;y=a[1]+(b[1]-a[1])*i/100
                self.assertFalse(-758.5<x<-681.5 and -254.5<y<-205.5)
                self.assertFalse(-782.5<x<-737.5 and -375.5<y<-344.5)
    def test_commerce_covers_everyday_systems(self):
        uses={b['use'] for b in R.BUSINESSES}
        self.assertTrue({'bread','food','pharmacy','vehicle_parts','canteen','kiosk'}.issubset(uses))
        self.assertGreaterEqual(len(R.DISTRICTS),7)
    def test_approach_width_clears_neighbor_fences(self):
        own={'id':'a','polygon':[(-2,-2),(2,-2),(2,0),(-2,0)],'gate':(0,0),'road_edge':(0,10)}
        neighbor={'id':'b','polygon':[(.4,3),(3,3),(3,6),(.4,6)],'gate':(3,6),'road_edge':(3,10)}
        self.assertTrue(R.approach_conflicts([own,neighbor]))
        own['approach']=[(0,0),(-1,2),(-1,8),(0,10)]
        self.assertFalse(R.approach_conflicts([own,neighbor]))

if __name__=='__main__':unittest.main()
