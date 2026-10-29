"""Signed distance to the circular steering-wheel tube in scene units."""
import math


def signed_distance_to_torus(point, center, normal, radius, tube_radius):
    delta = [a - b for a, b in zip(point, center)]
    axial = sum(a * b for a, b in zip(delta, normal))
    radial = math.sqrt(max(0, sum(a * a for a in delta) - axial * axial))
    return math.hypot(radial - radius, axial) - tube_radius
