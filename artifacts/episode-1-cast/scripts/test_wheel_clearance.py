import math
import unittest
from wheel_clearance import signed_distance_to_torus


class WheelClearanceTests(unittest.TestCase):
    def test_signed_distance_to_wheel_surface(self):
        center = (0, 0, 0)
        normal = (0, 0, 1)
        self.assertAlmostEqual(signed_distance_to_torus((.265, 0, 0), center, normal, .24, .025), 0)
        self.assertAlmostEqual(signed_distance_to_torus((.24, 0, 0), center, normal, .24, .025), -.025)
        self.assertAlmostEqual(signed_distance_to_torus((.24, 0, .035), center, normal, .24, .025), .01)
        self.assertAlmostEqual(signed_distance_to_torus((0, .265, 0), center, normal, .24, .025), 0)

    def test_translated_tilted_wheel(self):
        angle = -1.05
        center = (.1, -.66, .5)
        normal = (0, -math.cos(angle), -math.sin(angle))
        point = (center[0] + .24, center[1] + .025 * normal[1], center[2] + .025 * normal[2])
        self.assertAlmostEqual(signed_distance_to_torus(point, center, normal, .24, .025), 0)

if __name__ == '__main__':
    unittest.main()
