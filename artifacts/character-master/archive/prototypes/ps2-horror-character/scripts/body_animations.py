"""Keyed PS2-style body blocking clips; import has no scene side effects.

The walking clips travel in armature-space -Y. Root stays still, pelvis travels,
and root-parented IK feet remain fixed through each stance interval.
"""

import math

import bpy
from mathutils import Vector

import body_rig


def _ease(value):
    t = max(0.0, min(1.0, value))
    return t * t * (3 - 2 * t)


def _rotate(rig, name, x=0, y=0, z=0):
    rig.pose.bones[name].rotation_euler = (x, y, z)


def _move(rig, name, x=0, y=0, z=0):
    bone = rig.pose.bones[name]
    bone.location = bone.bone.matrix_local.to_3x3().inverted() @ Vector((x, y, z))


def _grip(rig, amount, side=None):
    for hand in ((side,) if side else ("L", "R")):
        for finger in body_rig.FINGERS:
            for index, bend in enumerate((.70, 1.05, .68), 1):
                _rotate(rig, f"{finger}.{index:02d}.{hand}",
                        -amount * bend * (.55 if finger == "thumb" else 1))


def _planted(rig, pelvis_y=0, pelvis_z=-.025, offsets=None):
    _move(rig, "pelvis", y=pelvis_y, z=pelvis_z)
    for side in ("L", "R"):
        rig[f"leg_IK_FK.{side}"] = 1.0
        x, y, z = (offsets or {}).get(side, (0, 0, 0))
        _move(rig, "foot_IK." + side, x=x, y=y, z=z)
        _move(rig, "leg_pole." + side, y=pelvis_y)


def _walk(rig, t, stride=.32, lift=.035, running=False):
    """One full stride: left swings in the first half; right in the second."""
    first = _ease(t * 2)
    second = _ease(t * 2 - 1)
    left_y = stride * .25 - stride * first
    right_y = -stride * .25 - stride * second
    left_z = lift * math.sin(math.pi * min(1, t * 2))
    right_z = lift * math.sin(math.pi * max(0, t * 2 - 1))
    phase = math.tau * t
    drop = -.075 if running else -.030
    bob = (.009 if running else .004) * (1 - math.cos(phase * 2))
    _planted(rig, -stride * t, drop + bob,
             {"L": (0, left_y, left_z), "R": (0, right_y, right_z)})
    _rotate(rig, "pelvis", y=.015 * math.sin(phase), z=.009 * math.sin(phase))
    _rotate(rig, "spine", x=.075 if running else .018, y=-.018 * math.sin(phase))
    _rotate(rig, "chest", y=.025 * math.sin(phase))
    for side, sign in body_rig.SIDES:
        swing = (.34 if running else .16) * math.sin(phase) * sign
        _rotate(rig, "FK_upper_arm." + side, swing, z=-.035 * sign)
        _rotate(rig, "FK_forearm." + side, -.70 if running else -.15)
        _rotate(rig, "FK_hand." + side, -.025)


def _demo(rig, frame):
    if frame <= 48:
        _walk(rig, (frame - 1) / 47)
        return
    _planted(rig, -.32, -.030,
             {"L": (0, -.24, 0), "R": (0, -.40, 0)})
    reach = _ease((frame - 49) / 19)
    release = 1 - .45 * _ease((frame - 89) / 7)
    grip = _ease((frame - 68) / 13) * release
    breath = math.sin((frame - 49) * math.tau / 44)
    shiver = .004 * math.sin((frame - 49) * 2.3) * reach
    _rotate(rig, "spine", x=.018 + .025 * reach)
    _rotate(rig, "chest", x=.010 * breath, z=shiver)
    _rotate(rig, "neck", x=.010 * breath, z=-shiver)
    _rotate(rig, "head", y=-.055 * reach)
    _rotate(rig, "FK_upper_arm.R", x=-.96 * reach, z=.08 * reach)
    _rotate(rig, "FK_forearm.R", x=-.15 - .34 * reach)
    _rotate(rig, "FK_upper_arm.L", x=-.52 * reach, z=-.06 * reach)
    _rotate(rig, "FK_forearm.L", x=-.15 - .52 * reach)
    _grip(rig, grip * .78)


def _fall(rig, t):
    anticipation = _ease(t / .26)
    impact = _ease((t - .25) / .60)
    body_rig.set_pose(rig, "fear", anticipation * (1 - impact) * .65)
    _rotate(rig, "root", x=1.48 * impact, y=.06 * impact, z=-.07 * impact)
    _move(rig, "root", z=.13 * impact)
    for side, sign in body_rig.SIDES:
        _rotate(rig, "FK_upper_arm." + side, -.65 * impact, z=-.33 * sign * impact)
        _rotate(rig, "FK_forearm." + side, -.36 * impact)
        _rotate(rig, "FK_shin." + side, .25 * impact)
    _rotate(rig, "neck", x=-.08 * impact)


def _crawl(rig, t):
    body_rig.set_pose(rig, "crawl")
    phase = math.tau * t
    _move(rig, "root", y=-.20 * t)
    _rotate(rig, "spine", x=1.05)
    _rotate(rig, "neck", x=-.24)
    for side, sign in body_rig.SIDES:
        swing = .11 * math.sin(phase) * sign
        _rotate(rig, "FK_upper_arm." + side, x=-.94 + swing)
        _rotate(rig, "FK_forearm." + side, x=-.13 - .08 * (1 + sign * math.cos(phase)))
        _rotate(rig, "FK_thigh." + side, x=-1.32 - swing)
        _rotate(rig, "FK_shin." + side, x=1.45 + .10 * sign * math.sin(phase))
    _grip(rig, .10)


def _combat(rig, t):
    _planted(rig, pelvis_z=-.055,
             offsets={"L": (.028, -.045, 0), "R": (-.028, .045, 0)})
    _grip(rig, .88)
    for side, sign in body_rig.SIDES:
        center = .30 if side == "L" else .70
        strike = max(0, 1 - abs(t - center) / .16)
        strike = _ease(strike)
        _rotate(rig, "FK_upper_arm." + side, x=-.58 - .62 * strike, z=-.13 * sign)
        _rotate(rig, "FK_forearm." + side, x=-1.03 + .85 * strike)
    _rotate(rig, "chest", x=.05, y=.09 * math.sin(math.tau * t))
    _rotate(rig, "head", x=-.035, y=-.04 * math.sin(math.tau * t))


def _zombie(rig, t):
    _walk(rig, t, stride=.24, lift=.012)
    _rotate(rig, "spine", x=.17)
    _rotate(rig, "neck", x=.20, z=.065)
    _rotate(rig, "head", y=.035 * math.sin(math.tau * t), z=-.04)
    _rotate(rig, "FK_upper_arm.L", x=-.48, z=-.09)
    _rotate(rig, "FK_upper_arm.R", x=-.34, z=.05)
    _rotate(rig, "FK_forearm.L", x=-.31)
    _rotate(rig, "FK_forearm.R", x=-.44)
    _grip(rig, .30 + .07 * math.sin(math.tau * t))


def _breathing(rig, t):
    _planted(rig)
    breath = math.sin(math.tau * t)
    shiver = .0035 * math.sin(16 * math.tau * t)
    _rotate(rig, "chest", x=.012 * breath, z=shiver)
    _rotate(rig, "spine", x=.014 + .005 * breath)
    _rotate(rig, "neck", x=.010 * breath, z=-shiver * .70)
    for side, sign in body_rig.SIDES:
        _rotate(rig, "clavicle." + side, z=sign * (.006 * breath + shiver))
        _rotate(rig, "FK_upper_arm." + side, x=-.025, z=-sign * (.035 + shiver))
        _rotate(rig, "FK_forearm." + side, x=-.13)


def _curves(action):
    # Blender 5 actions store F-curves in the slot's channel bag.
    for layer in action.layers:
        for strip in layer.strips:
            if strip.type == "KEYFRAME":
                for bag in strip.channelbags:
                    yield from bag.fcurves


def _key_controls(rig, controls, frame):
    for name in controls:
        bone = rig.pose.bones[name]
        bone.keyframe_insert("location", frame=frame, group=name)
        bone.keyframe_insert("rotation_euler", frame=frame, group=name)
    for side, _ in body_rig.SIDES:
        for limb in ("arm", "leg"):
            rig.keyframe_insert(f'["{limb}_IK_FK.{side}"]', frame=frame, group="IK FK switches")


def _evaluated_min_z(meshes):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    minimum = math.inf
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        try:
            for vertex in mesh.vertices:
                z = (evaluated.matrix_world @ vertex.co).z
                if not math.isfinite(z):
                    raise ValueError("Non-finite evaluated geometry in " + obj.name)
                minimum = min(minimum, z)
        finally:
            evaluated.to_mesh_clear()
    return None if minimum == math.inf else minimum


def _ground_frame(rig, meshes, frame):
    """Lift the entire FK pose vertically; root rotation must not tilt this offset."""
    bpy.context.view_layer.update()
    minimum = _evaluated_min_z(meshes)
    if minimum is None:
        return None
    lift = max(0.0, .002 - minimum)
    if lift:
        root = rig.pose.bones["root"]
        armature_delta = rig.matrix_world.inverted().to_3x3() @ Vector((0, 0, lift))
        root.location += root.bone.matrix_local.to_3x3().inverted() @ armature_delta
        root.keyframe_insert("location", frame=frame, group="root")
        rig.update_tag()
        bpy.context.view_layer.update()
    corrected = _evaluated_min_z(meshes)
    if corrected < -.002:
        raise ValueError(f"Floor correction failed at frame {frame}: {corrected:.6f} m")
    return {"frame": frame, "raw_minimum_z_m": minimum,
            "lift_m": lift, "corrected_minimum_z_m": corrected}


def create_body_actions(ctx):
    """Create eight reusable keyed Action assets and activate the 96-frame test.

    Returns JSON-safe action names, ranges, keyed frames, and foot-plant intervals.
    This is intentionally simple character blocking, not a motion-capture library.
    """
    rig, scene = ctx["body_rig"]["rig"], ctx["scene"]
    if rig.type != "ARMATURE":
        raise TypeError("ctx['body_rig']['rig'] must be an armature")
    ground_meshes = [obj for obj in scene.objects
                     if obj.type == "MESH" and obj.find_armature() == rig]
    controls = [bone.name for bone in rig.pose.bones
                if bone.name in ("root", "pelvis", "spine", "chest", "neck", "head")
                or bone.name.startswith(("FK_", "clavicle.", "toe_ctrl.", *body_rig.FINGERS))
                or "_IK." in bone.name or "_pole." in bone.name]
    rig.animation_data_create()
    scene.render.fps, scene.render.fps_base = 24, 1.0
    specs = (
        ("FullBody_Test", 96, _demo, False, "Two planted-foot steps, reach, grip, breathing and shiver"),
        ("WalkLoop", 49, lambda r, f: _walk(r, (f - 1) / 48), True, "Gentle walk with planted stance feet and 0.32 m travel per cycle"),
        ("RunLoop", 33, lambda r, f: _walk(r, (f - 1) / 32, 1.10, .075, True), True, "Hesitant run blocking with planted stance feet and 1.10 m travel per cycle"),
        ("Fall", 49, lambda r, f: _fall(r, (f - 1) / 48), False, "Anticipation and controlled forward fall"),
        ("Crawl", 49, lambda r, f: _crawl(r, (f - 1) / 48), True, "Low crawl blocking; contact polishing remains shot specific"),
        ("Combat", 49, lambda r, f: _combat(r, (f - 1) / 48), True, "Two restrained fist strikes with planted feet"),
        ("Zombie", 73, lambda r, f: _zombie(r, (f - 1) / 72), True, "Slow planted-foot shuffle with hunched asymmetry"),
        ("Breathing_Shiver", 73, lambda r, f: _breathing(r, (f - 1) / 72), True, "Small chest movement and shoulder shiver with stable feet"),
    )
    metadata, created = {}, {}
    for name, end, pose, loop, description in specs:
        action = bpy.data.actions.new("PS2_" + name)
        action.use_fake_user = True
        action["ps2_body_generated"] = True
        rig.animation_data.action = action
        frames = sorted(set(range(1, end + 1, 2)) | {end, min(48, end), min(49, end)})
        if name == "FullBody_Test":
            frames = sorted(set(frames) | {24, 25, 48, 49, 68, 81, 89})
        if name in ("Fall", "Crawl"):
            frames = list(range(1, end + 1))
        grounding = []
        for frame in frames:
            scene.frame_set(frame)
            body_rig.reset_pose(rig)
            pose(rig, frame)
            rig.update_tag()
            _key_controls(rig, controls, frame)
            if name in ("Fall", "Crawl"):
                sample = _ground_frame(rig, ground_meshes, frame)
                if sample:
                    grounding.append(sample)
        for curve in _curves(action):
            for key in curve.keyframe_points:
                key.interpolation = "LINEAR"
            if loop:
                cycles = curve.modifiers.new("CYCLES")
                cycles.mode_before = cycles.mode_after = (
                    "REPEAT_OFFSET" if curve.data_path.endswith(".location") else "REPEAT")
        action.asset_mark()
        action.asset_data.description = description + "; editable PS2-style blocking action, 24 fps."
        action.asset_data.tags.new("PS2")
        action.asset_data.tags.new("Body blocking")
        created[name] = action
        metadata[name] = {"name": action.name, "frame_start": 1, "frame_end": end,
                          "keyed_frames": frames, "loop": loop, "asset": True,
                          "channels": sum(1 for _ in _curves(action)), "description": description}
        if name in ("Fall", "Crawl"):
            metadata[name]["floor_correction"] = {
                "ground_z_m": 0.0, "clearance_m": .002,
                "evaluated_meshes": len(ground_meshes), "samples": grounding,
                "status": "corrected" if grounding else "no_bound_meshes_to_measure"}
    metadata["FullBody_Test"]["foot_plants"] = {
        "R": [[1, 24], [49, 96]], "L": [[25, 96]]}
    rig.animation_data.action = created["FullBody_Test"]
    scene.frame_start, scene.frame_end = 1, 96
    scene.frame_set(1)
    rig.update_tag()
    bpy.context.view_layer.update()
    return {"actions": metadata, "active_action": created["FullBody_Test"].name,
            "fps": 24, "forward_axis": "armature-space -Y",
            "travel_m": {"FullBody_Test": .32, "WalkLoop": .32, "RunLoop": 1.10, "Zombie": .24},
            "limits": ["Blocking actions need shot-specific timing and contact polishing.",
                       "The crawl uses FK limbs; hand and knee contacts are approximate.",
                       "Travel loops repeat with location offsets; use NLA or extract root motion for engine export."]}
