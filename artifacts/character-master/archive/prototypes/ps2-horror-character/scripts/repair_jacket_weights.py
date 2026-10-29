"""Weight-only jacket repair. Import is inert; apply(ctx) never saves a blend."""

import bpy
from mathutils import Vector

from body_rig import _smooth, _torso_weights


def _components(mesh):
    adjacent = [set() for _ in mesh.vertices]
    for edge in mesh.edges:
        a, b = edge.vertices
        adjacent[a].add(b)
        adjacent[b].add(a)
    remaining = set(range(len(adjacent)))
    result = []
    while remaining:
        seed = min(remaining)
        remaining.remove(seed)
        pending, indices = [seed], []
        while pending:
            vertex = pending.pop()
            indices.append(vertex)
            for other in adjacent[vertex] & remaining:
                remaining.remove(other)
                pending.append(other)
        result.append(indices)
    return result


def _limb_weights(point, arm):
    side = "L" if point.x >= 0 else "R"
    forearm = 1 - _smooth(1.105, 1.255, point.z)
    values = {name: weight * (1 - arm) for name, weight in _torso_weights(point.z).items()}
    values["upper_arm." + side] = arm * (1 - forearm)
    values["forearm." + side] = arm * forearm
    return values


def _shell_weights(point):
    # The source shell fuses the sleeves to the broad torso below the armpits.
    shoulder = _smooth(1.31, 1.43, point.z)
    cuff = 1 - _smooth(1.03, 1.20, point.z)
    inner = (.255 - .020 * cuff) * (1 - shoulder) + .155 * shoulder
    outer = (.315 - .040 * cuff) * (1 - shoulder) + .255 * shoulder
    arm = _smooth(inner, outer, abs(point.x))
    sleeve_depth = 1 - _smooth(.075, .105, abs(point.y))
    arm *= sleeve_depth * (1 - shoulder) + shoulder
    return _limb_weights(point, arm)


def apply(ctx):
    """Repair clean jacket, torn copy, and dirt overlay by the same vertex indices.

    Required context: body_rig.rig. body_objects.jacket is optional for saved scenes.
    Only vertex-group weights change; mesh coordinates, keys, modifiers and actions stay intact.
    """
    rig = ctx["body_rig"]["rig"]
    source = ctx.get("body_objects", {}).get("jacket") or bpy.data.objects["PS2 | jacket"]
    targets = [source]
    for name in ("PS2 | Torn left sleeve variant", "PS2 | Jacket dirt decal"):
        target = bpy.data.objects.get(name)
        if target:
            if len(target.data.vertices) != len(source.data.vertices):
                raise ValueError(name + " no longer matches the jacket vertex-index contract")
            targets.append(target)
    basis = source.data.shape_keys.key_blocks[0].data if source.data.shape_keys else source.data.vertices
    transform = rig.matrix_world.inverted() @ source.matrix_world
    points = [transform @ vertex.co for vertex in basis]
    weights, descriptions = [None] * len(points), []
    components = _components(source.data)
    for indices in components:
        center = sum((points[index] for index in indices), Vector()) / len(indices)
        low = [min(points[index][axis] for index in indices) for axis in range(3)]
        high = [max(points[index][axis] for index in indices) for axis in range(3)]
        shell = low[0] < -.30 and high[0] > .30 and high[2] - low[2] > .40
        sleeve_detail = (abs(center.x) > .22 and (low[0] > .18 or high[0] < -.18)
                         and max(abs(low[1]), abs(high[1])) < .105)
        kind = "fused torso/sleeve shell" if shell else ("sleeve trim" if sleeve_detail else "torso trim/pocket")
        for index in indices:
            point = points[index]
            weights[index] = (_shell_weights(point) if shell or sleeve_detail
                              else _torso_weights(point.z))
        descriptions.append({"kind": kind, "vertices": len(indices),
                             "center": list(center), "min": low, "max": high})
    deform_names = {bone.name for bone in rig.data.bones if bone.use_deform}
    for target in targets:
        for group in list(target.vertex_groups):
            if group.name in deform_names:
                target.vertex_groups.remove(group)
        groups = {}
        for index, values in enumerate(weights):
            total = sum(values.values())
            if total <= 0:
                raise ValueError("Empty jacket skin weights at vertex " + str(index))
            for name, weight in values.items():
                if weight > .000001:
                    if name not in groups:
                        groups[name] = target.vertex_groups.new(name=name)
                    groups[name].add([index], weight / total, "REPLACE")
        target.update_tag()
    bpy.context.view_layer.update()
    return {"objects": [target.name for target in targets], "vertices_each": len(points),
            "components": descriptions,
            "method": "Component-aware torso attachments and restricted outer-sleeve weights",
            "limits": ["The source joins torso and sleeves below the armpits; extreme arm elevation still stretches that shared topology."]}
