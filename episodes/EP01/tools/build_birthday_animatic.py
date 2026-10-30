#!/usr/bin/env python3
"""Build the silent EP01 birthday + kitchen-door layout animatic.

Links the apartment and the cast. Does not append, and does not save the map
or any actor file. Regenerates:

    episodes/EP01/shots/EP01_BIRTHDAY_ANIMATIC_v0.1.blend

Run headless, one Blender at a time:

    blender -b --factory-startup --python episodes/EP01/tools/build_birthday_animatic.py -- build-stills
    blender -b episodes/EP01/shots/EP01_BIRTHDAY_ANIMATIC_v0.1.blend --python episodes/EP01/tools/build_birthday_animatic.py -- render 1 720
    blender -b episodes/EP01/shots/EP01_BIRTHDAY_ANIMATIC_v0.1.blend --python episodes/EP01/tools/build_birthday_animatic.py -- encode

Preview renders are 50% of 1920x1080 (960x540), Eevee, every other frame held
(animation on twos). Mouths stay neutral. The infant is never given a body.
"""
import csv
import math
import os
import shutil
import subprocess
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Quaternion, Vector

ROOT = Path(__file__).resolve().parents[3]
MAP = ROOT / 'assets/maps/episode-1/EP01-Map.blend'
CAST = ROOT / 'artifacts/episode-1-cast'
SHOTS_DIR = ROOT / 'episodes/EP01/shots'
BLEND_V01 = SHOTS_DIR / 'EP01_BIRTHDAY_ANIMATIC_v0.1.blend'
# Poses, the purged ghost door and the crack camera live in v0.12.
# v0.13 only moves CAM_B23_GIVE and CAM_B26_S003 onto the cameras the stills used.
# build() writes this path, so it must not be an existing version.
BLEND = SHOTS_DIR / 'EP01_BIRTHDAY_ANIMATIC_v0.14.blend'
RENDERS = ROOT / 'episodes/EP01/renders/animatic_v0.1'
ANIMATIC = ROOT / 'episodes/EP01/animatic'
STILLS_V02 = ANIMATIC / 'stills_v0.2'
SET_DIR = ROOT / 'assets/maps/episode-1/sets'
SHOTLIST = ROOT / 'episodes/EP01/shotlist.csv'
FONT = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')

FPS = 24
DOOR_AT = 91.0  # seconds: 90s birthday + 1s black
TOTAL_SECONDS = 155.0
GAP_START = 90 * FPS + 1          # 2161
DOOR_START = int(DOOR_AT * FPS) + 1  # 2185
# Hard cut while the leaf is still under 10 degrees. Last picture frame is 3708.
BLACK_CUT = int(round((DOOR_AT + 63.5) * FPS)) + 1  # 3709
TOTAL_FRAMES = int(TOTAL_SECONDS * FPS)  # 3720

# Negative hinge Z opens the leaf inward, toward -X, into the kitchen.
# He enters around 86–88s. The leaf stays ajar through B25_S001, shuts in
# B25_S002, then gives under 10° on the push and is still shut when we cut.
DOOR_KEYS = [
    (0.0, 0.0),
    (81.0, 0.0),
    (83.5, -15.0),
    (86.0, -40.0),
    (89.0, -28.0),
    (93.0, -18.0),
    (99.0, -24.0),
    (103.0, -12.0),
    (104.5, -6.0),
    (106.0, 0.0),
    (149.0, 0.0),
    (150.0, -2.0),
    (151.0, -5.0),
    (152.5, -7.5),
    (154.5, -8.0),
    (155.0, -8.0),
]

# shot, t0, t1, seconds offset, lens mm, camera xyz, look xyz
# Child-height lens only on the opening wide. Handles are marker labels;
# the cut itself is the shot range. B25_S002 and B26_S004 have no handles.
SHOTS = [
    # West of the pair, child height. A south camera only sees Ganaa's back.
    ('B23_S001', 0, 8, 0, 35, (0.28, 0.95, 0.78), (1.55, 2.40, 0.85), 12),
    ('B23_S002', 8, 16, 0, 50, (0.35, 1.40, 0.95), (1.12, 2.05, 0.70), 12),
    ('B23_S003', 16, 26, 0, 50, (0.22, 0.85, 1.02), (1.15, 2.15, 0.82), 12),
    ('B23_S004', 26, 40, 0, 35, (0.30, 0.70, 1.10), (1.45, 2.30, 0.85), 12),
    ('B23_S005', 40, 58, 0, 50, (0.40, 1.20, 0.95), (1.08, 2.08, 0.78), 12),
    ('B24_S001', 58, 67, 0, 35, (0.85, 1.05, 1.50), (1.75, 2.25, 1.35), 12),
    ('B24_S002', 67, 79, 0, 85, (0.45, 0.40, 1.08), (1.15, 2.00, 0.95), 12),
    # West of the pair, inside the corridor, so the stop reads in profile instead of two backs.
    # West side of the corridor, across the pair, so both profiles and the reaching arm read.
    ('B24_S003', 79, 90, 0, 28, (-1.22, 4.00, 1.48), (-0.42, 3.95, 1.22), 12),
    # Profile from the south: his face is against the leaf, so the lens sits beside it.
    ('B25_S001', 0, 12, DOOR_AT, 40, (-1.92, 0.96, 1.48), (-2.05, 1.72, 1.52), 12),
    ('B25_S002', 12, 15, DOOR_AT, 45, (-1.88, 0.98, 1.46), (-2.02, 1.70, 1.50), 0),
    # Landing, looking in. A north-living camera cannot see the hall and the table
    # through the x=0 wall at once.
    ('B25_S003', 15, 28, DOOR_AT, 35, (-1.65, -1.40, 1.50), (0.15, 2.30, 1.05), 12),
    ('B26_S001', 28, 39, DOOR_AT, 35, (3.55, 5.60, 1.62), (3.60, 1.70, 1.15), 12),
    # Living side of the doorway. The landing cannot see SUKHEE_APPROACH past the south wall.
    # He is still walking to the door here. Frame the approach, not a posed portrait.
    ('B26_S002', 39, 50, DOOR_AT, 50, (0.15, 1.10, 1.42), (1.10, 1.55, 1.30), 12),
    ('B26_S003', 50, 58, DOOR_AT, 85, (-1.05, 1.55, 0.95), (-0.82, 0.25, 0.75), 12),
    ('B26_S004', 58, 64, DOOR_AT, 85, (-0.70, 2.40, 1.42), (-1.35, 1.20, 1.02), 0),
]

# Appended only where the written shot cannot be staged literally.
LAYOUT_NOTES = {
    'B23_S001': 'Layout: Ganaa crouches just south of the table because ANCHOR.GANAA_MITTENS sits inside the tabletop. Camera stands west of the pair; from the south the wide only saw his back.',
    'B23_S002': 'Layout: camera stands west of the hands. The south 50mm was the back of his coat.',
    'B24_S001': 'Layout: camera is southwest of Tungalag so her face reads. From the east the 35mm was the back of her hair.',
    'B24_S003': 'Layout v0.2: 28mm from the west side of the corridor, across the pair. They stand about 0.7 m apart so the stop is an outstretched arm between two profiles, not two noses. The v0.1 camera looked up the hall at their backs past the wall edge.',
    'B25_S001': 'Layout v0.2: 40mm profile from inside the kitchen, south of him. He stands off the leaf so the face and the bracing shoulder read beside the door. A lens between his face and the open leaf sat inside his shoulder. The v0.1 50mm was a green sleeve on the leaf.',
    'B25_S002': 'Layout v0.2: 45mm, same profile, on the shut inward leaf. Face and shoulder.',
    'B25_S003': 'Layout v0.2: Dulmaa stands inside the front-door opening, hands in front of her. Tsetsegmaa waits up the corridor with her arms down; a pointing arm went through the east jamb. v0.1 planted Dulmaa in the south wall. Camera stays on the landing.',
    'B26_S001': 'Layout: camera is east of the table so Sukhee is in the room before he approaches. The south living camera left him behind the lens.',
    'B26_S002': 'Layout v0.2: Sükhee is mid-stride toward the kitchen door, hunched, arms heavy, smile shape held off. He is not standing with his hands on his hips. The push is B26_S004.',
    'B26_S003': 'Layout: 85mm is in the corridor on Altan at the exit, one mitten on. The second mitten stays on the cake table. A living-room camera at this lens sat in the doorway wall. v0.2 still: Dulmaa stands between that lens and Altan, so the frame is Dulmaa\'s torso. Altan is against the south door with one mitten on; her face does not clear Dulmaa.',
    'B26_S004': 'Layout v0.2: the 85mm stays on the knob. The extra still B26_door_fraction is a 16mm from just above the kitchen counter, south of the latch, so the inward crack and the dark gap read beside Ganaa\'s braced shoulder. Farther west the leaf\'s shut face hides the hall, because an 8 degree inward swing barely clears the jamb. Tsetsegmaa stands north of that doorway so she is not the shoulder in the crack.',
}

CONTROL = ['spine03', 'spine04', 'spine05', 'neck01']
for _side in ('L', 'R'):
    for _name in ('upperleg01', 'upperleg02', 'lowerleg01', 'lowerleg02', 'foot',
                  'upperarm01', 'upperarm02', 'lowerarm01', 'lowerarm02'):
        CONTROL.append(f'{_name}.{_side}')

# Eight guests, eight actions. Periods and offsets differ so no two cycles match.
# xy is the rig origin (feet). Seated guests sit just in front of a stool or chair.
GUESTS = [
    ('party-guest-01', (0.85, 4.55), (2.2, 3.2), 'talk', 8.0, 0.0),
    ('party-guest-02', (1.70, 4.00), (1.70, 3.1), 'sip', 9.2, 0.7),
    ('party-guest-03', (4.35, 1.85), (2.7, 2.6), 'laugh', 7.2, 0.3),
    ('party-guest-04', (4.12, 3.80), (2.7, 3.4), 'eat', 10.0, 1.1),
    ('party-guest-05', (1.85, 0.95), (1.15, 2.05), 'plate', 8.4, 1.6),
    ('party-guest-06', (0.48, 3.45), (0.95, 2.15), 'photo', 10.8, 0.4),
    ('party-guest-07', (5.02, 2.85), (2.7, 3.0), 'cross', 12.4, 2.1),
    ('party-guest-08', (2.85, 0.78), (1.05, 2.10), 'watch', 7.6, 0.9),
]

# Same cameras as v0.1, so the before/after pairs match frame and lens.
BEFORE_AFTER = ('B23_S001', 'B23_S004', 'B24_S001', 'B26_S001')

PLANT = {}


def fsec(t):
    return int(round(t * FPS)) + 1


def yaw_toward(src, dst):
    dx = dst[0] - src[0]
    dy = dst[1] - src[1]
    if abs(dx) + abs(dy) < 1e-6:
        return 0.0
    # Rest pose faces -Y. Yaw maps that axis onto (dx, dy).
    return math.atan2(dx, -dy)


def route(samples):
    """Expand (t, xy, face, pose, moving) into keyed samples with walk steps."""
    out = []
    for i, (t, xy, face, pose, moving) in enumerate(samples):
        if not moving or i == 0:
            out.append((t, xy, face, pose, None))
            continue
        t0, xy0 = samples[i - 1][0], samples[i - 1][1]
        dist = math.hypot(xy[0] - xy0[0], xy[1] - xy0[1])
        n = max(1, int(round(dist / 0.42)))
        n = max(n, int(round((t - t0) / 0.55)))
        for k in range(1, n + 1):
            u = k / n
            pos = (xy0[0] + (xy[0] - xy0[0]) * u, xy0[1] + (xy[1] - xy0[1]) * u)
            if k < n and dist >= 0.35:
                face_k = (pos[0] + (xy[0] - xy0[0]), pos[1] + (xy[1] - xy0[1]))
                # Keep a carried posture. A heavy walk was reverting to a straight stand.
                carried = pose if pose in {'heavy', 'push', 'brace', 'door', 'stop'} else 'stand'
                out.append((t0 + (t - t0) * u, pos, face_k, carried, k % 2))
            else:
                out.append((t0 + (t - t0) * u, pos, face, pose, None))
    return out


def actor_routes():
    # Ganaa gives with the right hand. The left stays back, then braces on the hinge side.
    ganaa = route([
        (0.0, (1.25, 1.75), (0.90, 2.20), 'offer', False),
        (13.0, (1.25, 1.75), (0.90, 2.20), 'hold', False),
        (58.0, (1.25, 1.75), (0.90, 2.20), 'hold', False),
        (66.0, (1.22, 1.78), (0.90, 2.10), 'withdraw', False),
        (78.0, (1.22, 1.78), (0.40, 3.4), 'withdraw', False),
        (80.0, (1.22, 1.78), (0.90, 3.15), 'stand', False),
        (81.6, (0.90, 3.15), (0.20, 4.4), 'stand', True),
        (83.8, (0.35, 1.65), (-0.9, 1.55), 'stand', True),
        (85.4, (-0.85, 1.52), (-1.9, 1.48), 'stand', True),
        (87.8, (-1.90, 1.48), (-2.4, 1.48), 'stand', True),
        (90.4, (-2.25, 1.85), (-1.45, 1.55), 'brace', True),
        (149.0, (-2.25, 1.85), (-1.45, 1.55), 'brace', False),
        (154.0, (-2.18, 1.82), (-1.45, 1.50), 'brace', False),
        (155.0, (-2.18, 1.82), (-1.45, 1.50), 'brace', False),
    ])
    # Altan stays at the table through the evacuation wide (B25_S003 ends at 119s)
    # and is at the exit for the 85mm (B26_S003, from 141s).
    altan = route([
        (0.0, (0.90, 2.20), (1.25, 1.75), 'reach', False),
        (14.0, (0.90, 2.20), (1.25, 1.75), 'mitten', False),
        (64.0, (0.90, 2.20), (1.25, 1.75), 'mitten', False),
        (70.0, (1.02, 2.02), (1.22, 1.78), 'reach', True),
        (79.0, (0.92, 2.18), (1.22, 1.78), 'mitten', True),
        (120.0, (0.92, 2.18), (-0.6, 0.5), 'mitten', False),
        (128.0, (0.20, 1.20), (-0.7, 0.3), 'stand', True),
        (136.0, (-0.85, 0.22), (-0.4, 1.4), 'mitten', True),
        (155.0, (-0.85, 0.22), (-0.4, 1.4), 'mitten', False),
    ])
    tsetsegmaa = route([
        (0.0, (2.55, 4.15), (1.10, 2.00), 'stand', False),
        (64.0, (2.55, 4.15), (1.10, 2.00), 'stand', False),
        (68.0, (1.20, 1.55), (-0.6, 1.6), 'stand', True),
        (73.0, (-0.70, 2.40), (-0.6, 3.9), 'stand', True),
        (78.0, (-0.35, 3.55), (-0.55, 4.25), 'stop', True),
        (86.0, (-0.35, 3.55), (-0.55, 4.25), 'stop', False),
        (90.0, (-0.60, 2.20), (-0.6, 0.5), 'stand', True),
        (94.0, (-0.55, 2.85), (-0.40, 1.50), 'stand', False),
        (155.0, (-0.55, 2.85), (-0.40, 1.50), 'stand', False),
    ])
    tungalag = route([
        (0.0, (1.70, 2.20), (1.05, 1.55), 'stand', False),
        (67.0, (1.70, 2.20), (0.40, 1.70), 'stand', False),
        (72.0, (0.30, 1.60), (-0.9, 2.4), 'stand', True),
        (76.0, (-0.85, 2.80), (-0.8, 4.3), 'stand', True),
        (79.0, (-0.55, 4.25), (-0.35, 3.55), 'stand', True),
        (88.0, (-0.55, 4.25), (-0.35, 3.55), 'stand', False),
        (114.0, (-0.70, 4.25), (-1.4, 5.2), 'stand', False),
        (120.0, (-1.35, 5.05), (-2.4, 5.4), 'stand', True),
        (155.0, (-1.35, 5.05), (-2.4, 5.4), 'stand', False),
    ])
    dulmaa = route([
        (0.0, (3.95, 1.15), (2.40, 2.60), 'stand', False),
        (98.0, (3.95, 1.15), (1.2, 1.1), 'stand', False),
        (104.0, (1.40, 1.20), (-0.7, 0.2), 'stand', True),
        (109.0, (-0.85, 0.72), (-0.80, 0.15), 'door', True),
        (155.0, (-0.85, 0.72), (-0.80, 0.15), 'door', False),
    ])
    # Heavy, blank, already walking during B26_S002. The push is the last beat.
    # Through the store doorway's sightline at B26_S001, then toward the kitchen.
    sukhee = route([
        (0.0, (4.40, 0.62), (2.6, 2.2), 'heavy', False),
        (118.0, (4.40, 0.62), (3.5, 1.55), 'heavy', False),
        (124.5, (3.55, 1.55), (-1.4, 1.45), 'heavy', True),
        (130.0, (2.30, 1.55), (-1.45, 1.40), 'heavy', True),
        (136.5, (1.15, 1.52), (-1.50, 1.30), 'heavy', True),
        (142.0, (0.15, 1.50), (-1.55, 1.15), 'heavy', True),
        (147.5, (-0.78, 1.48), (-1.55, 1.12), 'push', True),
        (155.0, (-0.84, 1.46), (-1.55, 1.12), 'push', False),
    ])
    return {
        'ganaa': ganaa,
        'altan': altan,
        'tsetsegmaa': tsetsegmaa,
        'cousin': tungalag,
        'dulmaa': dulmaa,
        'sukhee': sukhee,
    }


def set_direction(rig, name, direction):
    bone = rig.pose.bones[name]
    rest = bone.bone.matrix_local.to_quaternion()
    if bone.parent:
        parent_delta = bone.parent.matrix.to_quaternion() @ bone.parent.bone.matrix_local.to_quaternion().inverted()
    else:
        parent_delta = Quaternion()
    current = parent_delta @ rest
    desired = (current @ Vector((0, 1, 0))).rotation_difference(Vector(direction).normalized()) @ current
    bone.rotation_mode = 'QUATERNION'
    bone.rotation_quaternion = rest.inverted() @ parent_delta.inverted() @ desired
    bpy.context.view_layer.update()


def euler_x(rig, name, degrees):
    bone = rig.pose.bones[name]
    bone.rotation_mode = 'XYZ'
    bone.rotation_euler = (math.radians(degrees), 0.0, 0.0)
    quat = bone.rotation_euler.to_quaternion()
    bone.rotation_mode = 'QUATERNION'
    bone.rotation_quaternion = quat


def reset_pose(rig):
    for name in CONTROL:
        bone = rig.pose.bones.get(name)
        if bone is None:
            continue
        bone.rotation_mode = 'QUATERNION'
        bone.rotation_quaternion = (1.0, 0.0, 0.0, 0.0)
        bone.location = (0.0, 0.0, 0.0)


def crouch_legs(rig):
    # Thigh -75 / shin +120 planted to about 1.08 m head height on Ganaa.
    for side in ('L', 'R'):
        euler_x(rig, f'upperleg01.{side}', -75)
        euler_x(rig, f'upperleg02.{side}', -26)
        euler_x(rig, f'lowerleg01.{side}', 120)
        euler_x(rig, f'lowerleg02.{side}', 30)
        euler_x(rig, f'foot.{side}', -8)


def walk_legs(rig, phase):
    for side, forward in (('L', phase == 0), ('R', phase == 1)):
        thigh = -32 if forward else 16
        shin = 40 if forward else 6
        euler_x(rig, f'upperleg01.{side}', thigh)
        euler_x(rig, f'upperleg02.{side}', thigh * 0.35)
        euler_x(rig, f'lowerleg01.{side}', shin)
        euler_x(rig, f'lowerleg02.{side}', shin * 0.25)
        euler_x(rig, f'foot.{side}', -shin * 0.35)


def aim_arm(rig, side, offset, bend=None):
    bpy.context.view_layer.update()
    shoulder = rig.pose.bones[f'upperarm01.{side}'].head.copy()
    target = shoulder + Vector(offset)
    upper = sum(rig.data.bones[f'{n}.{side}'].length for n in ('upperarm01', 'upperarm02'))
    lower = sum(rig.data.bones[f'{n}.{side}'].length for n in ('lowerarm01', 'lowerarm02'))
    delta = target - shoulder
    if delta.length < 1e-4:
        return
    reach = min(max(delta.length, abs(upper - lower) + 0.02), upper + lower - 0.02)
    target = shoulder + delta.normalized() * reach
    axis = (target - shoulder).normalized()
    sign = 1.0 if side == 'L' else -1.0
    if bend is None:
        bend = Vector((sign * 0.45, 0.22, 0.04))
    else:
        bend = Vector(bend)
    bend -= axis * bend.dot(axis)
    if bend.length < 1e-5:
        bend = Vector((sign, 0.2, 0.0))
    bend.normalize()
    along = (upper ** 2 - lower ** 2 + reach ** 2) / (2 * reach)
    elbow = shoulder + axis * along + bend * math.sqrt(max(0.0, upper ** 2 - along ** 2))
    # Twist bones (02) stay at rest. Aiming them spins the hand into a knot.
    set_direction(rig, f'upperarm01.{side}', elbow - shoulder)
    forearm = rig.pose.bones[f'lowerarm01.{side}'].head
    set_direction(rig, f'lowerarm01.{side}', target - forearm)


def hang_arm(rig, side, swing=0.0):
    """Arm beside the body. The old default bend stuck every elbow out like hands on hips."""
    sign = 1.0 if side == 'L' else -1.0
    aim_arm(
        rig, side, (sign * 0.16, 0.05 + swing, -0.52),
        bend=(sign * 0.10, -0.40, -0.12),
    )


def nod(rig, degrees):
    if 'neck01' in rig.pose.bones:
        euler_x(rig, 'neck01', degrees)


def turn_head(rig, nod_deg, yaw_deg):
    """Nod (X) and yaw (Z) on the neck. Positive Z turns the face toward his right."""
    bone = rig.pose.bones.get('neck01')
    if bone is None:
        return
    bone.rotation_mode = 'XYZ'
    bone.rotation_euler = (math.radians(nod_deg), 0.0, math.radians(yaw_deg))
    quat = bone.rotation_euler.to_quaternion()
    bone.rotation_mode = 'QUATERNION'
    bone.rotation_quaternion = quat


def sit_legs(rig):
    for side in ('L', 'R'):
        euler_x(rig, f'upperleg01.{side}', -88)
        euler_x(rig, f'upperleg02.{side}', -20)
        euler_x(rig, f'lowerleg01.{side}', 95)
        euler_x(rig, f'lowerleg02.{side}', 18)
        euler_x(rig, f'foot.{side}', 8)


def apply_pose(rig, pose, phase):
    reset_pose(rig)
    if pose in {'offer', 'hold', 'withdraw', 'eat', 'sip'}:
        crouch_legs(rig) if pose not in {'eat', 'sip'} else sit_legs(rig)
    elif phase is not None and pose not in {'talk', 'laugh', 'plate', 'photo', 'cross', 'watch'}:
        walk_legs(rig, phase)
    aimed = set()

    def arm(side, offset, bend=None):
        aim_arm(rig, side, offset, bend)
        aimed.add(side)

    if pose == 'brace':
        euler_x(rig, 'spine05', 12)
        euler_x(rig, 'spine04', 7)
        nod(rig, 8)
        # Right hand to the latch edge. Left stays on his left, the hinge side.
        arm('R', (0.02, -0.34, -0.08))
        arm('L', (0.16, 0.06, -0.18))
    elif pose == 'offer':
        arm('R', (-0.02, -0.32, -0.22))
        arm('L', (0.18, 0.06, -0.20))
    elif pose == 'hold':
        arm('R', (-0.04, -0.22, -0.16))
        arm('L', (0.18, 0.06, -0.18))
    elif pose == 'withdraw':
        arm('R', (-0.06, -0.16, -0.16))
        arm('L', (0.20, 0.10, 0.08))
        nod(rig, -6)
    elif pose == 'reach':
        arm('R', (0.0, -0.22, -0.06))
    elif pose == 'mitten':
        arm('R', (0.02, -0.16, -0.08))
    elif pose == 'stop':
        arm('R', (0.06, -0.32, 0.08))
        nod(rig, 4)
    elif pose == 'point':
        arm('R', (0.02, -0.32, 0.02))
    elif pose == 'push':
        euler_x(rig, 'spine05', 16)
        euler_x(rig, 'spine04', 10)
        nod(rig, 14)
        arm('R', (0.02, -0.36, -0.04))
        arm('L', (0.06, -0.34, -0.06))
    elif pose == 'heavy':
        euler_x(rig, 'spine05', 20)
        euler_x(rig, 'spine04', 12)
        euler_x(rig, 'spine03', 6)
        nod(rig, 16)
        arm('R', (-0.08, -0.10, -0.42), bend=(-0.12, -0.25, -0.2))
        arm('L', (0.10, -0.08, -0.44), bend=(0.12, -0.25, -0.2))
    elif pose == 'door':
        # Both hands stay in front of her. A forward reach put the right hand through the south wall.
        arm('R', (0.06, -0.12, -0.28), bend=(-0.06, -0.20, -0.06))
        arm('L', (-0.06, -0.10, -0.28), bend=(0.06, -0.20, -0.06))
        nod(rig, 8)
    elif pose == 'talk':
        guest_arms(rig, 'talk', phase if isinstance(phase, float) else 0.0)
        return
    elif pose in {'sip', 'laugh', 'eat', 'plate', 'photo', 'cross', 'watch'}:
        guest_arms(rig, pose, phase if isinstance(phase, float) else 0.0)
        return
    if 'L' not in aimed:
        hang_arm(rig, 'L')
    if 'R' not in aimed:
        hang_arm(rig, 'R')


def guest_arms(rig, action, u):
    """One cycle position, 0..1. Each action uses a different limb and a different u."""
    wave = math.sin(u * math.tau)
    if action == 'talk':
        euler_x(rig, 'spine05', 6 * wave)
        hang_arm(rig, 'L', swing=0.03 * wave)
        aim_arm(rig, 'R', (-0.04 + 0.10 * wave, -0.26, 0.02 + 0.20 * wave), bend=(-0.35, 0.12, 0.15))
    elif action == 'sip':
        lift = max(0.0, wave)
        hang_arm(rig, 'L')
        aim_arm(rig, 'R', (-0.04, -0.18, -0.20 + 0.48 * lift), bend=(-0.25, 0.05, 0.15))
        nod(rig, 10 * lift)
    elif action == 'laugh':
        euler_x(rig, 'spine05', -16 - 6 * wave)
        euler_x(rig, 'spine04', -8)
        nod(rig, -12)
        aim_arm(rig, 'R', (-0.16, -0.12, -0.05), bend=(-0.4, 0.05, 0.1))
        hang_arm(rig, 'L', swing=0.04 * wave)
    elif action == 'eat':
        lift = max(0.0, math.sin(u * math.tau))
        hang_arm(rig, 'L')
        aim_arm(rig, 'R', (-0.02, -0.16, -0.18 + 0.40 * lift), bend=(-0.22, 0.08, 0.12))
        nod(rig, 8 * lift)
    elif action == 'plate':
        aim_arm(rig, 'R', (-0.06, -0.24, -0.12), bend=(-0.2, 0.15, 0.05))
        aim_arm(rig, 'L', (0.06, -0.22, -0.14), bend=(0.2, 0.15, 0.05))
        euler_x(rig, 'spine05', 4)
    elif action == 'photo':
        aim_arm(rig, 'R', (-0.02, -0.24, 0.16 + 0.04 * wave), bend=(-0.25, 0.1, 0.2))
        aim_arm(rig, 'L', (0.08, -0.20, 0.10), bend=(0.2, 0.1, 0.15))
    elif action == 'cross':
        euler_x(rig, 'spine05', 4)
        aim_arm(rig, 'R', (0.10, -0.16, 0.02), bend=(-0.28, 0.05, 0.12))
        aim_arm(rig, 'L', (-0.10, -0.16, 0.00), bend=(0.28, 0.05, 0.12))
    elif action == 'watch':
        euler_x(rig, 'spine05', 6)
        nod(rig, 4 + 3 * wave)
        aim_arm(rig, 'R', (-0.04, -0.18, -0.16), bend=(-0.15, -0.2, -0.05))
        aim_arm(rig, 'L', (0.04, -0.16, -0.18), bend=(0.15, -0.2, -0.05))


def toe_offset(rig):
    bpy.context.view_layer.update()
    zs = []
    for side in ('L', 'R'):
        bone = rig.pose.bones[f'toe1-1.{side}']
        zs.append((rig.matrix_world @ bone.head).z - rig.location.z)
        zs.append((rig.matrix_world @ bone.tail).z - rig.location.z)
    return 0.012 - min(zs)


def pose_on(rig, pose, phase):
    apply_pose(rig, pose, phase)
    # Walk steps change the foot height. A cycling guest action does not.
    plant_phase = None if isinstance(phase, float) else phase
    key = (rig.name, pose, plant_phase)
    if key not in PLANT:
        rig.location.z = 0.0
        PLANT[key] = toe_offset(rig)
    rig.location.z = PLANT[key]


def key_rig(rig, frame):
    rig.keyframe_insert('location', frame=frame)
    rig.keyframe_insert('rotation_euler', frame=frame)
    for name in CONTROL:
        bone = rig.pose.bones.get(name)
        if bone is None:
            continue
        bone.keyframe_insert('rotation_quaternion', frame=frame)


def iter_fcurves(action):
    """Blender 5 stores curves on strip.channelbags. channelbag() is a method."""
    if action is None:
        return
    layers = getattr(action, 'layers', None)
    if layers:
        for layer in layers:
            for strip in layer.strips:
                bags = getattr(strip, 'channelbags', None)
                if bags is None or callable(bags):
                    continue
                for bag in bags:
                    curves = getattr(bag, 'fcurves', None)
                    if curves is None or callable(curves):
                        continue
                    yield from curves
        return
    curves = getattr(action, 'fcurves', None)
    if curves is not None and not callable(curves):
        yield from curves


def force_interp(action, mode):
    count = 0
    for curve in iter_fcurves(action):
        count += 1
        for point in curve.keyframe_points:
            point.interpolation = mode
    if count == 0:
        print('WARN no fcurves on', getattr(action, 'name', action), flush=True)
    return count


def link_collections(path, names):
    with bpy.data.libraries.load(str(path), link=True) as (src, dst):
        have = list(src.collections)
        missing = [name for name in names if name not in have]
        if missing:
            raise SystemExit(f'missing {missing} in {path}; collections: {have}')
        dst.collections = list(names)
    # Assignments become real IDs when the with-block exits.
    loaded = list(dst.collections)
    linked = []
    for coll in loaded:
        if coll is None or isinstance(coll, str):
            raise SystemExit(f'link failed for {coll!r} from {path}')
        bpy.context.scene.collection.children.link(coll)
        linked.append(coll)
    return linked


def link_actor(cast_id):
    path = CAST / cast_id / 'Character-Master.blend'
    if not path.is_file():
        raise SystemExit(f'missing actor blend: {path}')
    coll = link_collections(path, ['CHARACTER | Modular meshes'])[0]
    override = coll.override_hierarchy_create(
        bpy.context.scene, bpy.context.view_layer, do_fully_editable=False)
    if override is None:
        raise SystemExit(f'override failed for {cast_id}')
    override.name = f'CAST.{cast_id}'
    # The linked collection is a second, unposed body at the origin. It was the
    # hand sticking through the front wall in B25_S003.
    root = bpy.context.scene.collection
    if coll is not override and coll.name in root.children:
        root.children.unlink(coll)
        print(f'UNLINK origin body {cast_id}', flush=True)
    raw = list(override.all_objects)
    objects = [obj for obj in raw if obj is not None]
    if len(objects) != len(raw):
        print(f'WARN {cast_id} null objects {len(raw) - len(objects)} of {len(raw)}', flush=True)
    meshes = sum(1 for obj in objects if obj.type == 'MESH')
    if meshes < 8:
        raise SystemExit(f'{cast_id} override has only {meshes} meshes')
    rig = next(obj for obj in objects if obj.type == 'ARMATURE')
    rig.name = f'RIG.{cast_id}'
    rig.rotation_mode = 'XYZ'
    if rig.animation_data:
        rig.animation_data.action = None
    for obj in objects:
        if obj.type != 'MESH':
            continue
        keys = obj.data.shape_keys
        if keys is not None and keys.animation_data:
            try:
                keys.animation_data.action = None
            except (AttributeError, RuntimeError):
                pass
        if keys is not None:
            for block in keys.key_blocks:
                try:
                    block.value = 0.0
                except (AttributeError, RuntimeError):
                    pass
        if obj.get('role') == 'Story.ForearmBandage' or 'ForearmBandage' in obj.name:
            # The shipped wrap is on lowerarm01.R. The bite is the left wrist.
            obj.hide_render = True
            obj.hide_viewport = True
    return rig


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def add_box(name, dims, rgba, coll):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    coll.objects.link(obj)
    obj.scale = dims
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = rgba
    mesh.materials.append(mat)
    return obj


def add_light(name, location, target, energy, size, color):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


def add_camera(name, location, target, lens):
    data = bpy.data.cameras.new(name)
    data.lens = lens
    data.clip_start = 0.02 if lens >= 85 else 0.05
    data.clip_end = 80
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


def configure_render(scene):
    scene.render.fps = FPS
    scene.render.fps_base = 1.0
    scene.frame_start = 1
    scene.frame_end = TOTAL_FRAMES
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGB'
    scene.render.film_transparent = False
    scene.render.use_motion_blur = False
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.use_simplify = True
    scene.render.simplify_subdivision_render = 0
    scene.render.simplify_subdivision = 0
    scene.render.filepath = str(RENDERS / 'f_')
    ee = scene.eevee
    if hasattr(ee, 'taa_render_samples'):
        ee.taa_render_samples = 4
    if hasattr(ee, 'taa_samples'):
        ee.taa_samples = 4
    for attr in ('use_raytracing', 'use_bloom', 'use_volumetric_shadows'):
        if hasattr(ee, attr):
            setattr(ee, attr, False)


def picture_frame(frame):
    if frame % 2 == 0:
        return False
    if 1 <= frame <= 90 * FPS:
        return True
    if DOOR_START <= frame < BLACK_CUT:
        return True
    return False


def latest_dressing():
    files = list(SET_DIR.glob('EP01_Apartment_BirthdayDressing_v*.blend'))
    if not files:
        raise SystemExit(f'no birthday dressing blend in {SET_DIR}')

    def version(path):
        return int(path.stem.rsplit('_v', 1)[-1])

    return max(files, key=version)


def drop_linked_original(scene, name):
    """override_hierarchy_create leaves the linked collection in the scene.

    The override collection also keeps those linked objects. On the kitchen
    door the copy stayed shut, so the inward crack never opened. Unlink the
    collection and pull every non-override object out of every collection.
    The map file is not saved.
    """
    ghosts = [
        coll for coll in scene.collection.children
        if coll.name == name and coll.library is not None and not coll.override_library
    ]
    for coll in ghosts:
        scene.collection.children.unlink(coll)
        print('UNLINK ghost', name, flush=True)
    doomed = []
    seen = set()
    for coll in bpy.data.collections:
        if coll.name != name:
            continue
        for obj in coll.objects:
            if obj.library is None or obj.override_library is not None:
                continue
            if obj.as_pointer() in seen:
                continue
            seen.add(obj.as_pointer())
            doomed.append(obj)
    for obj in doomed:
        # The source collection is linked, so its membership cannot change.
        # The local override is what still draws the copy.
        for coll in list(bpy.data.collections):
            if coll.library is not None:
                continue
            for member in list(coll.objects):
                if member == obj:
                    coll.objects.unlink(member)
        print('PURGE', obj.name, flush=True)
    if not ghosts and not doomed:
        print('UNLINK none', name, flush=True)


def hide_greybox(scene):
    """Hide the map's placeholder cake, candles and radio. The map file is not saved."""
    furniture = bpy.data.collections['HOME | furniture and story props']
    furniture.override_hierarchy_create(scene, bpy.context.view_layer, do_fully_editable=False)
    drop_linked_original(scene, 'HOME | furniture and story props')
    hidden = []
    for obj in bpy.data.objects:
        if obj.name.startswith(('Birthday.Cake', 'Birthday.Candle', 'Home.Radio')):
            # hide_render on a linked override does not survive the save. Scale does.
            obj.scale = (0.0001, 0.0001, 0.0001)
            obj.location.z = -8.0
            obj.hide_render = True
            obj.hide_viewport = True
            obj.keyframe_insert('scale', frame=1)
            obj.keyframe_insert('location', frame=1)
            obj.keyframe_insert('hide_render', frame=1)
            hidden.append(obj.name)
    print('HIDE', ' '.join(hidden) or 'none', flush=True)
    if not any(name.startswith('Birthday.Cake') for name in hidden):
        print('WARN greybox cake was not found', flush=True)


def add_mitten(name, coll):
    """Child-size knitted mitten: red body, white cuff, a thumb. Returns every part."""
    red = (0.78, 0.06, 0.08, 1)
    cuff_color = (0.93, 0.90, 0.84, 1)
    body = add_box(name, (0.090, 0.140, 0.042), red, coll)
    cuff = add_box(f'{name}.Cuff', (0.096, 0.030, 0.048), cuff_color, coll)
    thumb = add_box(f'{name}.Thumb', (0.030, 0.048, 0.028), red, coll)
    cuff.parent = body
    cuff.location = (0.0, -0.072, 0.0)
    thumb.parent = body
    thumb.location = (0.055, 0.015, 0.0)
    return [body, cuff, thumb]


def parent_bone(obj, rig, bone, location, rotation):
    obj.parent = rig
    obj.parent_type = 'BONE'
    obj.parent_bone = bone
    obj.location = location
    obj.rotation_euler = rotation


def hide_keys(parts, hidden, frame):
    for obj in parts:
        obj.hide_render = hidden
        obj.hide_viewport = hidden
        obj.keyframe_insert('hide_render', frame=frame)
        obj.keyframe_insert('hide_viewport', frame=frame)


def set_expression(cast_id, values):
    """Drive face shape keys when the override allows it. Prints what stuck."""
    coll = bpy.data.collections.get(f'CAST.{cast_id}')
    if coll is None:
        print('SHAPE missing collection', cast_id, flush=True)
        return
    stuck = []
    for obj in coll.all_objects:
        if getattr(obj, 'type', None) != 'MESH' or obj.data.shape_keys is None:
            continue
        blocks = obj.data.shape_keys.key_blocks
        for name, value in values.items():
            block = blocks.get(name)
            if block is None:
                continue
            try:
                block.value = value
                block.keyframe_insert('value', frame=1)
                stuck.append(f'{name}={value}')
            except (AttributeError, RuntimeError) as exc:
                print('SHAPE FAIL', cast_id, obj.name, name, exc, flush=True)
        if stuck and obj.data.shape_keys.animation_data and obj.data.shape_keys.animation_data.action:
            force_interp(obj.data.shape_keys.animation_data.action, 'CONSTANT')
    print('SHAPE', cast_id, ' '.join(stuck) or 'none', flush=True)


def place_keys(rig, keys):
    """Location and yaw first, then the pose, so the plant and the aim see this facing."""
    for t, xy, face, pose, phase in keys:
        rig.location.x = xy[0]
        rig.location.y = xy[1]
        yaw = yaw_toward(xy, face)
        if phase is None and pose in {'stand', 'hold', 'heavy', 'mitten', 'brace', 'withdraw'}:
            yaw += 0.03 * math.sin(t * 0.6)
            rig.location.x += 0.012 * math.sin(t * 0.7)
            rig.location.y += 0.010 * math.sin(t * 0.5 + 1.1)
        rig.rotation_euler = (0.0, 0.0, yaw)
        bpy.context.view_layer.update()
        pose_on(rig, pose, phase)
        key_rig(rig, fsec(t))
    if rig.animation_data and rig.animation_data.action:
        force_interp(rig.animation_data.action, 'BEZIER')


def build():
    import time
    bpy.ops.wm.read_homefile(use_empty=True)
    scene = bpy.context.scene
    scene.name = 'EP01_BIRTHDAY_ANIMATIC'
    configure_render(scene)
    world = bpy.data.worlds.new('LayoutNight')
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes['Background']
    background.inputs['Color'].default_value = (0.09, 0.045, 0.025, 1)
    background.inputs['Strength'].default_value = 0.08
    scene.view_settings.view_transform = 'AgX'
    scene.view_settings.look = 'None'
    scene.view_settings.exposure = 0.15
    # Practicals live in Dress.Birthday. These four grey washes flattened v0.1.

    link_collections(MAP, [
        'HOME | walls and openings',
        'HOME | furniture and story props',
        'HOME | landing stair and courtyard',
        'HOME | action anchors',
    ])
    dressing = latest_dressing()
    link_collections(dressing, ['Dress.Birthday'])
    print('DRESSING', dressing.name, flush=True)
    hide_greybox(scene)
    walls = bpy.data.collections['HOME | walls and openings']
    walls.override_hierarchy_create(scene, bpy.context.view_layer, do_fully_editable=False)
    drop_linked_original(scene, 'HOME | walls and openings')
    hinge = bpy.data.objects['Home.KitchenDoorHinge']
    if hinge.override_library is None:
        raise SystemExit('kitchen door hinge did not become an override')
    hinge.rotation_mode = 'XYZ'
    for seconds, degrees in DOOR_KEYS:
        if degrees < -10.0 and seconds >= DOOR_AT + 58.0:
            raise SystemExit(f'push opens past 10 degrees at {seconds}s ({degrees})')
        hinge.rotation_euler = (0.0, 0.0, math.radians(degrees))
        hinge.keyframe_insert('rotation_euler', frame=fsec(seconds))
    if hinge.animation_data and hinge.animation_data.action:
        force_interp(hinge.animation_data.action, 'BEZIER')

    layout = bpy.data.collections.new('LAYOUT')
    scene.collection.children.link(layout)
    linen = (0.55, 0.48, 0.36, 1)
    # Spare mitten. Anchor z is 0.84; the body is 4cm thick, so the centre sits on the cloth.
    table_parts = add_mitten('PROP.MittenTable', layout)
    table_parts[0].location = (3.15, 3.40, 0.862)
    table_parts[0].rotation_euler = (0.0, 0.0, math.radians(24))

    rigs = {}
    started = time.time()
    for cast_id in ('ganaa', 'altan', 'tsetsegmaa', 'dulmaa', 'cousin', 'sukhee'):
        rigs[cast_id] = link_actor(cast_id)
        print('LINKED', cast_id, flush=True)
    guest_rigs = []
    for cast_id, xy, face, action, period, offset in GUESTS:
        rig = link_actor(cast_id)
        guest_rigs.append((rig, xy, face, action, period, offset, cast_id))
        print('LINKED', cast_id, flush=True)

    routes = actor_routes()
    for cast_id, keys in routes.items():
        t0 = time.time()
        place_keys(rigs[cast_id], keys)
        print(f'BLOCKED {cast_id} {len(keys)} keys {time.time() - t0:.1f}s', flush=True)

    for rig, xy, face, action, period, offset, cast_id in guest_rigs:
        t0 = time.time()
        yaw = yaw_toward(xy, face)
        keys = []
        step = period / 2.0
        t = 0.0
        while t < 155.0 - 1e-6:
            u = ((t + offset) / period) % 1.0
            keys.append((t, xy, face, action, u))
            t += step
        keys.append((155.0, xy, face, action, ((155.0 + offset) / period) % 1.0))
        # place_keys adds a weight-shift only for named poses. Guests pass a float phase.
        for t, xy_k, face_k, pose, phase in keys:
            rig.location.x = xy_k[0]
            rig.location.y = xy_k[1]
            rig.rotation_euler = (0.0, 0.0, yaw + 0.05 * math.sin(phase * math.tau))
            bpy.context.view_layer.update()
            pose_on(rig, pose, phase)
            key_rig(rig, fsec(t))
        if rig.animation_data and rig.animation_data.action:
            force_interp(rig.animation_data.action, 'BEZIER')
        print(f'GUEST {cast_id} {action} {len(keys)} keys {time.time() - t0:.1f}s', flush=True)
    report_spacing(routes, guest_rigs)

    # Left-wrist wrap. The actor file's bandage is on the right forearm and stays hidden.
    wrap = add_box('PROP.LeftWristWrap', (1, 1, 1), linen, layout)
    wrap.scale = (0.038, 0.016, 0.038)
    parent_bone(wrap, rigs['ganaa'], 'wrist.L', (0.0, 0.015, 0.0), (0.0, 0.0, 0.0))

    # In the right palm. Bone Y runs toward the fingers.
    offered = add_mitten('PROP.MittenOffered', layout)
    parent_bone(
        offered[0], rigs['ganaa'], 'wrist.R',
        (0.0, 0.045, 0.012), (0.0, 0.0, 0.0),
    )
    worn = add_mitten('PROP.MittenWorn', layout)
    parent_bone(
        worn[0], rigs['altan'], 'wrist.R',
        (0.0, 0.040, 0.010), (0.0, 0.0, 0.0),
    )
    handoff = fsec(12.5)
    for frame, offered_hide, worn_hide in (
        (1, False, True), (handoff, False, True), (handoff + 1, True, False), (TOTAL_FRAMES, True, False),
    ):
        hide_keys(offered, offered_hide, frame)
        hide_keys(worn, worn_hide, frame)
    for obj in offered + worn:
        if obj.animation_data and obj.animation_data.action:
            force_interp(obj.animation_data.action, 'CONSTANT')

    # Props so the guest actions read at 960px. Parent to the hand that holds them.
    cup = add_box('PROP.GuestCup', (0.045, 0.045, 0.055), (0.86, 0.88, 0.82, 1), layout)
    plate = add_box('PROP.GuestPlate', (0.14, 0.11, 0.012), (0.90, 0.88, 0.78, 1), layout)
    bowl = add_box('PROP.GuestBowl', (0.07, 0.07, 0.035), (0.82, 0.78, 0.62, 1), layout)
    camera_box = add_box('PROP.GuestCamera', (0.07, 0.04, 0.045), (0.08, 0.08, 0.08, 1), layout)
    by_action = {action: rig for rig, _xy, _face, action, _p, _o, _id in guest_rigs}
    parent_bone(cup, by_action['sip'], 'wrist.R', (0.0, 0.09, 0.02), (math.radians(80), 0.0, 0.0))
    parent_bone(bowl, by_action['eat'], 'wrist.R', (0.0, 0.08, 0.0), (math.radians(70), 0.0, 0.0))
    parent_bone(plate, by_action['plate'], 'wrist.L', (0.02, 0.10, 0.0), (math.radians(75), 0.0, 0.0))
    parent_bone(camera_box, by_action['photo'], 'wrist.R', (0.0, 0.08, 0.02), (math.radians(80), 0.0, 0.0))

    set_expression('sukhee', {'EXP.smile': 0.0, 'EXP.frown': 0.55})
    watch_id = next(cast_id for _rig, _xy, _face, action, _p, _o, cast_id in guest_rigs if action == 'watch')
    laugh_id = next(cast_id for _rig, _xy, _face, action, _p, _o, cast_id in guest_rigs if action == 'laugh')
    set_expression(watch_id, {'EXP.smile': 0.5, 'EXP.frown': 0.0})
    set_expression(laugh_id, {'EXP.smile': 0.65, 'EXP.frown': 0.0})
    print(f'POSED {time.time() - started:.1f}s', flush=True)

    black = add_box('PROP.Black', (6.0, 0.4, 4.0), (0, 0, 0, 1), layout)
    black.location = (-8.0, -12.8, 1.2)
    cam_black = add_camera('CAM_BLACK', (-8.0, -12.0, 1.2), (-8.0, -12.8, 1.2), 35)
    cam_black.data.clip_end = 4

    cameras = {}
    for shot, t0, t1, offset, lens, loc, look, handle in SHOTS:
        cam = add_camera(f'CAM_{shot}', loc, look, lens)
        cameras[shot] = cam
        start = fsec(offset + t0)
        scene.timeline_markers.new(shot, frame=start).camera = cam
        if handle:
            inn = start - handle
            if inn >= 1:
                scene.timeline_markers.new(f'IN_{shot}', frame=inn)
            out = fsec(offset + t1) + handle
            if out <= TOTAL_FRAMES:
                scene.timeline_markers.new(f'OUT_{shot}', frame=out)
    # Extra stills. These do not replace the 15 shot cameras.
    # The first give placement sat inside his coat. Use the west 50 mm that frames the handoff.
    add_camera('CAM_B23_GIVE', (0.35, 1.40, 0.95), (1.12, 2.05, 0.70), 50)
    add_camera('CAM_B23_ON', (0.42, 1.20, 0.98), (1.00, 2.10, 0.72), 50)
    # South-west in the kitchen, wide enough that the inward crack, the dark gap and his shoulder share the frame.
    add_camera('CAM_B26_FRACTION', (-2.40, 0.55, 1.48), (-1.62, 1.40, 1.15), 16)
    add_camera('CAM_WIDE_A', (0.55, 0.65, 1.58), (2.6, 3.2, 1.1), 24)
    add_camera('CAM_WIDE_B', (4.35, 4.55, 1.58), (2.2, 2.4, 1.0), 24)
    add_camera('CAM_WIDE_C', (-0.45, 1.50, 1.58), (2.5, 3.0, 1.05), 24)
    scene.timeline_markers.new('GAP', frame=GAP_START).camera = cam_black
    scene.timeline_markers.new('CUT_BLACK', frame=BLACK_CUT).camera = cam_black
    scene.camera = cameras['B23_S001']
    scene['animatic'] = 'v0.2'
    scene['kitchen_door_opens'] = 'inward'
    scene['picture'] = '960x540 Eevee on twos; 1920x1080 settings, preview percentage 50'
    scene['infant'] = 'unframed; no infant mesh'

    audit_positions()

    # Prove the push stays inside the kitchen and under 10 degrees.
    leaf = bpy.data.objects['Home.KitchenDoorLeaf']
    for seconds, degrees in DOOR_KEYS:
        if seconds < DOOR_AT + 58.0:
            continue
        scene.frame_set(fsec(seconds))
        xs = [(leaf.matrix_world @ Vector(corner)).x for corner in leaf.bound_box]
        print(f'DOOR t={seconds:.1f} deg={degrees:.1f} leaf_x {min(xs):.3f}..{max(xs):.3f}', flush=True)
        if max(xs) > -1.45:
            raise SystemExit('leaf crossed into the hall during the push')

    SHOTS_DIR.mkdir(parents=True, exist_ok=True)
    RENDERS.mkdir(parents=True, exist_ok=True)
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))
    for lib in bpy.data.libraries:
        lib.filepath = bpy.path.relpath(bpy.path.abspath(lib.filepath))
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))
    print('SAVED', BLEND, flush=True)
    for lib in bpy.data.libraries:
        print('LIB', lib.filepath, flush=True)
    update_shotlist()
    write_combined_srt()


def audit_positions():
    """Print where everyone is at each shot's middle frame. Warn if Ganaa's
    left wrist is the one reaching toward Altan during the mitten shots."""
    scene = bpy.context.scene
    altan = bpy.data.objects['RIG.altan']
    ganaa = bpy.data.objects['RIG.ganaa']
    close_shots = {'B23_S001', 'B23_S002', 'B23_S003', 'B23_S004', 'B24_S002'}
    for shot, t0, t1, offset, _lens, _loc, _look, _handle in SHOTS:
        frame = fsec(offset + (t0 + t1) / 2.0)
        if shot == 'B26_S004':
            frame = min(frame, BLACK_CUT - 1)
        scene.frame_set(frame)
        bits = []
        for name in ('ganaa', 'altan', 'tsetsegmaa', 'cousin', 'dulmaa', 'sukhee'):
            rig = bpy.data.objects[f'RIG.{name}']
            head = rig.matrix_world @ rig.pose.bones['head'].head
            bits.append(f'{name}({rig.location.x:.2f},{rig.location.y:.2f},h{head.z:.2f})')
        left = ganaa.matrix_world @ ganaa.pose.bones['wrist.L'].head
        right = ganaa.matrix_world @ ganaa.pose.bones['wrist.R'].head
        print(
            f'AUDIT {shot} f={frame} ' + ' '.join(bits)
            + f' gL({left.x:.2f},{left.y:.2f},{left.z:.2f})'
            + f' gR({right.x:.2f},{right.y:.2f},{right.z:.2f})',
            flush=True,
        )
        if shot in close_shots:
            al = altan.matrix_world.translation
            d_left = (Vector((left.x, left.y)) - Vector((al.x, al.y))).length
            d_right = (Vector((right.x, right.y)) - Vector((al.x, al.y))).length
            print(f'WRIST {shot} dL={d_left:.2f} dR={d_right:.2f}', flush=True)
            if d_left + 0.04 < d_right:
                print(f'WARN {shot} left wrist is closer to Altan than the right', flush=True)


def report_spacing(routes, guest_rigs):
    """Warn when two bodies share a point. Guests are fixed; family is sampled."""
    marks = []
    for cast_id, keys in routes.items():
        for t, xy, _face, _pose, _phase in keys:
            if t in (0.0, 33.0, 84.5, 112.5, 124.5, 135.5, 152.0) or abs(t - 0) < 1e-6:
                marks.append((t, cast_id, xy))
    for _rig, xy, _face, action, _period, _offset, cast_id in guest_rigs:
        marks.append((0.0, f'{cast_id}:{action}', xy))
    close = []
    for i, (t1, a, xy1) in enumerate(marks):
        for t2, b, xy2 in marks[i + 1:]:
            if abs(t1 - t2) > 0.6 and not (t1 == 0.0 and t2 == 0.0):
                continue
            dist = math.hypot(xy1[0] - xy2[0], xy1[1] - xy2[1])
            if dist < 0.55:
                close.append(f'{a}/{b}@{t1:.0f}s {dist:.2f}m')
    print('CLOSE', ' | '.join(close) if close else 'none under 0.55m', flush=True)


def update_shotlist():
    lens_for = {
        'B24_S003': '28 mm MS',
        'B25_S001': '40 mm MCU profile',
        'B25_S002': '45 mm MCU profile',
    }
    with SHOTLIST.open(encoding='utf-8', newline='') as handle:
        reader = csv.DictReader(handle)
        fields = reader.fieldnames
        rows = list(reader)
    wanted = {shot[0] for shot in SHOTS}
    seen = set()
    for row in rows:
        if row['shot'] not in wanted:
            continue
        seen.add(row['shot'])
        row['status'] = 'layout'
        if row['shot'] in lens_for:
            row['lens'] = lens_for[row['shot']]
        base = row['notes']
        for marker in (' Layout v0.2:', ' Layout:'):
            if marker in base:
                base = base.split(marker)[0]
        base = base.rstrip()
        extra = LAYOUT_NOTES.get(row['shot'])
        row['notes'] = f'{base} {extra}' if extra else base
    if seen != wanted:
        raise SystemExit(f'shotlist missing {sorted(wanted - seen)}')
    with SHOTLIST.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    print('SHOTLIST', len(seen), 'rows -> layout', flush=True)


def write_combined_srt():
    def parse(path):
        blocks = []
        raw = path.read_text(encoding='utf-8').strip().split('\n\n')
        for block in raw:
            lines = block.splitlines()
            if len(lines) < 3:
                continue
            blocks.append((lines[1], '\n'.join(lines[2:])))
        return blocks

    def shift(stamp, seconds):
        h, m, rest = stamp.split(':')
        s, ms = rest.split(',')
        total = int(h) * 3600 + int(m) * 60 + int(s) + seconds
        ms_i = int(ms)
        hh, rem = divmod(int(total), 3600)
        mm, ss = divmod(rem, 60)
        return f'{hh:02}:{mm:02}:{ss:02},{ms_i:03}'

    cues = [(stamp, text, 0.0) for stamp, text in parse(ANIMATIC / 'birthday_90s.mn.srt')]
    cues += [(stamp, text, DOOR_AT) for stamp, text in parse(ANIMATIC / 'door_64s.mn.srt')]
    lines = []
    for index, (stamp, text, offset) in enumerate(cues, 1):
        start, end = [part.strip() for part in stamp.split('-->')]
        lines.append(f'{index}\n{shift(start, offset)} --> {shift(end, offset)}\n{text}\n')
    path = ANIMATIC / 'EP01_BIRTHDAY_ANIMATIC_v0.1.srt'
    path.write_text('\n'.join(lines), encoding='utf-8')
    print('SRT', path, len(cues), flush=True)
    return path


def use_scene(scene):
    window = getattr(bpy.context, 'window', None)
    if window is not None:
        window.scene = scene


def render_fraction():
    scene = bpy.data.scenes['EP01_BIRTHDAY_ANIMATIC']
    use_scene(scene)
    scene.render.resolution_percentage = 50
    scene.render.image_settings.file_format = 'PNG'
    scene.frame_set(BLACK_CUT - 2)
    scene.camera = scene.objects['CAM_B26_S004']
    path = RENDERS / 'still_door_fraction.png'
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    print('STILL door_fraction frame', BLACK_CUT - 2, flush=True)


def render_stills(only=()):
    scene = bpy.data.scenes['EP01_BIRTHDAY_ANIMATIC']
    use_scene(scene)
    scene.render.resolution_percentage = 50
    scene.render.image_settings.file_format = 'PNG'
    RENDERS.mkdir(parents=True, exist_ok=True)
    for shot, t0, t1, offset, lens, _loc, _look, _handle in SHOTS:
        if only and shot not in only:
            continue
        frame = fsec(offset + (t0 + t1) / 2.0)
        if shot == 'B26_S004':
            frame = min(frame, BLACK_CUT - 1)
        scene.frame_set(frame)
        scene.camera = scene.objects[f'CAM_{shot}']
        path = RENDERS / f'still_{shot}.png'
        scene.render.filepath = str(path)
        bpy.ops.render.render(write_still=True)
        print('STILL', shot, 'frame', frame, 'lens', lens, 'cam', tuple(round(v, 2) for v in scene.camera.location), flush=True)
    if not only:
        # Last odd picture frame of the push, just before the cut.
        scene.frame_set(BLACK_CUT - 2)
        scene.camera = scene.objects['CAM_B26_S004']
        path = RENDERS / 'still_door_fraction.png'
        scene.render.filepath = str(path)
        bpy.ops.render.render(write_still=True)
        print('STILL door_fraction frame', BLACK_CUT - 2, flush=True)
        contact_sheet()


def contact_sheet():
    from PIL import Image, ImageDraw, ImageFont
    cells = []
    for shot, _t0, _t1, _offset, lens, _loc, _look, _handle in SHOTS:
        path = RENDERS / f'still_{shot}.png'
        if not path.is_file():
            print('SHEET missing', path, flush=True)
            return
        cells.append((shot, f'{lens} mm', path))
    font = ImageFont.truetype(str(FONT), 28) if FONT.is_file() else ImageFont.load_default()
    cell_w, cell_h, label_h, cols = 960, 540, 46, 5
    rows = math.ceil(len(cells) / cols)
    sheet = Image.new('RGB', (cols * cell_w, rows * (cell_h + label_h)), (16, 16, 16))
    draw = ImageDraw.Draw(sheet)
    for i, (shot, lens, path) in enumerate(cells):
        image = Image.open(path).convert('RGB')
        if image.size != (cell_w, cell_h):
            image = image.resize((cell_w, cell_h))
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + label_h)
        sheet.paste(image, (x, y))
        draw.rectangle((x, y + cell_h, x + cell_w, y + cell_h + label_h), fill=(10, 10, 10))
        draw.text((x + 14, y + cell_h + 8), f'{shot}  {lens}', fill=(245, 240, 226), font=font)
    out = ANIMATIC / 'contact_sheet_v0.1.png'
    sheet.save(out)
    print('SHEET', out, flush=True)


def render_span(start, end):
    scene = bpy.data.scenes['EP01_BIRTHDAY_ANIMATIC']
    use_scene(scene)
    scene.render.resolution_percentage = 50
    # Layout animatic. Two samples keeps the on-2s pass inside the night.
    if hasattr(scene, 'eevee'):
        scene.eevee.taa_render_samples = 2
    scene.render.image_settings.file_format = 'PNG'
    RENDERS.mkdir(parents=True, exist_ok=True)
    import time
    for frame in range(start, end + 1):
        if not picture_frame(frame):
            continue
        path = RENDERS / f'f_{frame:05d}.png'
        if path.is_file() and path.stat().st_size > 0:
            continue
        scene.frame_set(frame)
        scene.render.filepath = str(path)
        t0 = time.time()
        bpy.ops.render.render(write_still=True)
        print(f'FRAME {frame} {time.time() - t0:.2f}s', flush=True)


def ass_time(stamp):
    h, m, rest = stamp.split(':')
    s, ms = rest.split(',')
    return f'{int(h)}:{int(m):02}:{int(s):02}.{int(ms) // 10:02}'


def write_ass(srt_path):
    events = []
    for block in srt_path.read_text(encoding='utf-8').strip().split('\n\n'):
        lines = block.splitlines()
        if len(lines) < 3:
            continue
        start, end = [part.strip() for part in lines[1].split('-->')]
        text = '\\N'.join(lines[2:])
        events.append(f'Dialogue: 0,{ass_time(start)},{ass_time(end)},Default,,0,0,0,,{text}')
    header = '''[Script Info]
ScriptType: v4.00+
PlayResX: 960
PlayResY: 540
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,DejaVu Sans,22,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,2,0,2,28,28,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
    path = RENDERS / 'animatic_v0.1.ass'
    path.write_text(header + '\n'.join(events) + '\n', encoding='utf-8')
    return path


def encode():
    if shutil.which('ffmpeg') is None:
        raise SystemExit('ffmpeg is not on PATH')
    RENDERS.mkdir(parents=True, exist_ok=True)
    birthday = []
    door = []
    missing = []
    for frame in range(1, TOTAL_FRAMES + 1):
        if not picture_frame(frame):
            continue
        path = RENDERS / f'f_{frame:05d}.png'
        if not path.is_file():
            missing.append(frame)
            continue
        (birthday if frame < DOOR_START else door).append(path)
    if missing:
        raise SystemExit(f'missing {len(missing)} frames, first {missing[:8]}')
    seq = RENDERS / 'seq'
    if seq.exists():
        shutil.rmtree(seq)
    (seq / 'birthday').mkdir(parents=True)
    (seq / 'door').mkdir(parents=True)
    for folder, frames in (('birthday', birthday), ('door', door)):
        for index, src in enumerate(frames, 1):
            os.symlink(src, seq / folder / f'{index:05d}.png')
    gap = seq / 'gap.mp4'
    tail = seq / 'tail.mp4'
    part_b = seq / 'birthday.mp4'
    part_d = seq / 'door.mp4'
    silent = seq / 'silent.mp4'
    commands = [
        ['ffmpeg', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=960x540:r=24:d=1',
         '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', str(gap)],
        ['ffmpeg', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=960x540:r=24:d=0.5',
         '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', str(tail)],
        ['ffmpeg', '-y', '-framerate', '12', '-i', str(seq / 'birthday' / '%05d.png'),
         '-r', '24', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', str(part_b)],
        ['ffmpeg', '-y', '-framerate', '12', '-i', str(seq / 'door' / '%05d.png'),
         '-r', '24', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', str(part_d)],
    ]
    for command in commands:
        subprocess.check_call(command)
    concat = seq / 'list.txt'
    concat.write_text(''.join(
        f"file '{path}'\n" for path in (part_b, gap, part_d, tail)
    ), encoding='utf-8')
    subprocess.check_call([
        'ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', str(silent),
    ])
    srt = ANIMATIC / 'EP01_BIRTHDAY_ANIMATIC_v0.1.srt'
    if not srt.is_file():
        write_combined_srt()
    ass = write_ass(srt)
    out = ANIMATIC / 'EP01_BIRTHDAY_ANIMATIC_v0.1.mp4'
    # libass treats ':' and '\' specially. The renders path has neither.
    subtitle = str(ass).replace('\\', '\\\\').replace(':', '\\:')
    fonts = str(FONT.parent).replace('\\', '\\\\').replace(':', '\\:')
    subprocess.check_call([
        'ffmpeg', '-y', '-i', str(silent),
        '-vf', f"subtitles='{subtitle}':fontsdir='{fonts}'",
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', str(out),
    ])
    probe = subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', str(out),
    ], text=True).strip()
    print('MP4', out, 'duration', probe, flush=True)
    for label, seconds in (('spot_065', 6.5), ('spot_750', 75.0), ('spot_1425', 142.5)):
        dest = RENDERS / f'{label}.png'
        subprocess.check_call([
            'ffmpeg', '-y', '-ss', str(seconds), '-i', str(out), '-frames:v', '1', str(dest),
        ])
        print('SPOT', dest, flush=True)


def move_cameras():
    """Retarget cameras already in the open blend. Posing stays as blocked."""
    scene = bpy.data.scenes['EP01_BIRTHDAY_ANIMATIC']
    use_scene(scene)
    for shot, _t0, _t1, _offset, lens, loc, look, _handle in SHOTS:
        cam = scene.objects[f'CAM_{shot}']
        cam.location = loc
        cam.data.lens = lens
        look_at(cam, look)
        print('CAMERA', shot, tuple(round(v, 2) for v in loc), flush=True)
    bpy.ops.wm.save_mainfile()
    update_shotlist()
    print('CAMERAS saved', flush=True)


MOMENT = {
    'B23_S001': 't=4s offer',
    'B23_S002': 't=12s hands',
    'B23_S003': 't=21s song',
    'B23_S004': 't=33s tune',
    'B23_S005': 't=49s laugh falls away',
    'B24_S001': 't=62s crying',
    'B24_S002': 't=73s sleeve',
    'B24_S003': 't=84s she stops her',
    'B25_S001': 't=97s face and shoulder',
    'B25_S002': 't=104s door shut',
    'B25_S003': 't=112s evacuation',
    'B26_S001': 't=124s he is in the room',
    'B26_S002': 't=135s he approaches',
    'B26_S003': 't=145s one mitten',
    'B26_S004': 't=152s the knob',
}

EXTRAS = (
    ('CAM_B23_GIVE', 8.0, 'B23_mitten_give', '50 mm', 't=8s mitten in the right hand'),
    ('CAM_B23_ON', 20.0, 'B23_mitten_on', '50 mm', 't=20s mitten on Altan'),
    ('CAM_B26_FRACTION', None, 'B26_door_fraction', '16 mm', 'crack, dark gap, braced shoulder'),
    ('CAM_WIDE_A', 33.0, 'room_wide_A', '24 mm', 'eye height, southwest'),
    ('CAM_WIDE_B', 33.0, 'room_wide_B', '24 mm', 'eye height, northeast'),
    ('CAM_WIDE_C', 33.0, 'room_wide_C', '24 mm', 'eye height, hall door'),
)


def _label_sheet(cells, out):
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype(str(FONT), 26) if FONT.is_file() else ImageFont.load_default()
    cell_w, cell_h, label_h, cols = 960, 540, 52, 5
    rows_n = math.ceil(len(cells) / cols)
    sheet = Image.new('RGB', (cols * cell_w, rows_n * (cell_h + label_h)), (16, 16, 16))
    draw = ImageDraw.Draw(sheet)
    for i, (title, path) in enumerate(cells):
        image = Image.open(path).convert('RGB')
        if image.size != (cell_w, cell_h):
            image = image.resize((cell_w, cell_h))
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + label_h)
        sheet.paste(image, (x, y))
        draw.rectangle((x, y + cell_h, x + cell_w, y + cell_h + label_h), fill=(10, 10, 10))
        draw.text((x + 12, y + cell_h + 12), title, fill=(245, 240, 226), font=font)
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out)
    print('SHEET', out, flush=True)


def contact_sheet_v02():
    cells = []
    for shot, _t0, _t1, _offset, lens, _loc, _look, _handle in SHOTS:
        path = STILLS_V02 / f'{shot}.png'
        if not path.is_file():
            print('SHEET missing', path, flush=True)
            return
        cells.append((f'{shot}   {lens} mm   {MOMENT[shot]}', path))
    for _cam, _t, name, lens, moment in EXTRAS:
        path = STILLS_V02 / f'{name}.png'
        if not path.is_file():
            print('SHEET missing', path, flush=True)
            return
        cells.append((f'{name}   {lens}   {moment}', path))
    _label_sheet(cells, ANIMATIC / 'contact_sheet_v0.2.png')


def before_after_v02():
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype(str(FONT), 26) if FONT.is_file() else ImageFont.load_default()
    cell_w, cell_h, label_h = 960, 540, 40
    sheet = Image.new('RGB', (cell_w * 2, (cell_h + label_h) * len(BEFORE_AFTER)), (16, 16, 16))
    draw = ImageDraw.Draw(sheet)
    for row, shot in enumerate(BEFORE_AFTER):
        old = RENDERS / f'still_{shot}.png'
        new = STILLS_V02 / f'{shot}.png'
        if not old.is_file() or not new.is_file():
            print('PAIR missing', old, new, flush=True)
            return
        for col, (path, tag) in enumerate(((old, 'v0.1'), (new, 'v0.2'))):
            image = Image.open(path).convert('RGB')
            if image.size != (cell_w, cell_h):
                image = image.resize((cell_w, cell_h))
            x = col * cell_w
            y = row * (cell_h + label_h)
            sheet.paste(image, (x, y + label_h))
            draw.rectangle((x, y, x + cell_w, y + label_h), fill=(10, 10, 10))
            draw.text((x + 12, y + 8), f'{shot}  {tag}  same frame, same camera', fill=(245, 240, 226), font=font)
    out = ANIMATIC / 'before_after_v0.2.png'
    sheet.save(out)
    print('PAIR', out, flush=True)


def render_v02(only=()):
    import time
    scene = bpy.data.scenes['EP01_BIRTHDAY_ANIMATIC']
    use_scene(scene)
    scene.render.resolution_percentage = 50
    scene.render.image_settings.file_format = 'PNG'
    if hasattr(scene, 'eevee') and hasattr(scene.eevee, 'taa_render_samples'):
        scene.eevee.taa_render_samples = 4
    STILLS_V02.mkdir(parents=True, exist_ok=True)
    jobs = []
    for shot, t0, t1, offset, lens, _loc, _look, _handle in SHOTS:
        frame = fsec(offset + (t0 + t1) / 2.0)
        if shot == 'B26_S004':
            frame = min(frame, BLACK_CUT - 1)
        jobs.append((shot, frame, f'CAM_{shot}', STILLS_V02 / f'{shot}.png', lens))
    for cam, seconds, name, lens, _moment in EXTRAS:
        frame = BLACK_CUT - 2 if seconds is None else fsec(seconds)
        jobs.append((name, frame, cam, STILLS_V02 / f'{name}.png', lens))
    # A marker bound to a camera steals the view on every frame change.
    # Extras (wides, the mitten inserts, the door crack) were rendering as
    # whichever shot owned that frame. Unbind for the still, then put it back.
    bound = [(marker, marker.camera) for marker in scene.timeline_markers]
    for marker, _camera in bound:
        marker.camera = None
    try:
        for name, frame, cam_name, path, lens in jobs:
            if only and name not in only:
                continue
            scene.frame_set(frame)
            scene.camera = scene.objects[cam_name]
            scene.render.filepath = str(path)
            t0 = time.time()
            bpy.ops.render.render(write_still=True)
            print(
                f'STILL {name} f={frame} lens={lens} cam={scene.camera.name} '
                f'{time.time() - t0:.1f}s',
                flush=True,
            )
    finally:
        for marker, camera in bound:
            marker.camera = camera


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    command = args[0] if args else 'build'
    if command == 'build':
        build()
    elif command == 'build-stills':
        build()
        render_stills(args[1:])
        if len(args) > 1:
            render_fraction()
            contact_sheet()
    elif command == 'stills':
        render_stills(args[1:])
    elif command == 'move-cameras':
        move_cameras()
        if len(args) > 1:
            render_stills(args[1:])
            render_fraction()
            contact_sheet()
    elif command == 'render':
        render_span(int(args[1]), int(args[2]))
    elif command == 'encode':
        encode()
    elif command == 'sheet':
        contact_sheet()
    elif command == 'stills-v02':
        render_v02(args[1:])
        if len(args) == 1:
            contact_sheet_v02()
            before_after_v02()
    elif command == 'sheets-v02':
        contact_sheet_v02()
        before_after_v02()
    else:
        raise SystemExit(f'unknown command {command}')


if __name__ == '__main__':
    main()
