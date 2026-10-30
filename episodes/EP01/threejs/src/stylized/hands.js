import { Euler, Quaternion } from 'three';
import { sideBones } from './rig.js';

// Contract: finger local +X curls toward the palm, local +Z spreads.
// Thumb curl is the opposite sign, matching the baked wheel grip on the current cast.
// The default pose is relaxed. Nothing in this table is a flat hand.

export const HAND_POSES = {
  relaxed: { curl: [0.32, 0.42, 0.28], spread: 0.06, thumb: [0.22, 0.18, 0.1], wrist: 0.12 },
  fist: { curl: [1.35, 1.45, 1.15], spread: 0.02, thumb: [0.55, 0.7, 0.35], wrist: 0.28 },
  grip_small: { curl: [0.95, 1.15, 0.85], spread: 0.04, thumb: [0.5, 0.55, 0.28], wrist: 0.22 },
  grip_cup: { curl: [0.55, 0.62, 0.4], spread: 0.14, thumb: [0.35, 0.3, 0.16], wrist: 0.18 },
  grip_wheel: { curl: [0.72, 0.88, 0.55], spread: 0.03, thumb: [0.42, 0.48, 0.22], wrist: 0.2 },
  pinch: { curl: [0.25, 0.2, 0.12], spread: 0.02, thumb: [0.65, 0.45, 0.2], wrist: 0.1, index: [0.85, 0.95, 0.6] },
  point: { curl: [1.25, 1.35, 1.05], spread: 0.02, thumb: [0.35, 0.25, 0.12], wrist: 0.08, index: [0.12, 0.08, 0.05] },
  open_spread: { curl: [0.1, 0.08, 0.06], spread: 0.28, thumb: [0.08, 0.06, 0.04], wrist: 0.06 },
  claw: { curl: [0.85, 1.15, 0.95], spread: 0.16, thumb: [0.48, 0.62, 0.35], wrist: 0.16 },
  hold_child_hand: { curl: [0.7, 0.82, 0.5], spread: 0.1, thumb: [0.52, 0.4, 0.18], wrist: 0.14 },
};

const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'];

function deltaQuat(x, y, z) {
  return new Quaternion().setFromEuler(new Euler(x, y, z, 'XYZ'));
}

function fingerCurl(pose, finger) {
  if (finger === 'thumb') return pose.thumb;
  if (finger === 'index' && pose.index) return pose.index;
  if (finger === 'index' && pose === HAND_POSES.point) return pose.index;
  return pose.curl;
}

export function applyHand(actor, side, poseName, weight = 1) {
  const pose = HAND_POSES[poseName] || HAND_POSES.relaxed;
  const base = HAND_POSES.relaxed;
  const blend = poseName === 'relaxed' ? 0 : Math.max(0, Math.min(1, weight));
  const spec = sideBones(side);
  const sign = spec.sign;
  let anyFinger = false;
  FINGERS.forEach((finger, fingerIndex) => {
    const fromCenter = fingerIndex - 2;
    for (let joint = 1; joint <= 3; joint++) {
      const name = `${finger}.${String(joint).padStart(2, '0')}.${side}`;
      const bone = actor.bone(name);
      if (!bone) continue;
      anyFinger = true;
      const curlSet = fingerCurl(pose, finger);
      const restSet = fingerCurl(base, finger);
      const curl = restSet[joint - 1] + (curlSet[joint - 1] - restSet[joint - 1]) * blend;
      const spreadPose = base.spread + (pose.spread - base.spread) * blend;
      const curlSign = finger === 'thumb' ? -1 : 1;
      const spreadSign = finger === 'thumb' ? sign : sign * Math.sign(fromCenter || sign);
      const amount = fromCenter === 0 && finger !== 'thumb' ? 0.25 : 1;
      bone.quaternion.multiply(deltaQuat(curlSign * curl, 0, spreadSign * spreadPose * amount * (finger === 'middle' ? 0.35 : 1))).normalize();
    }
  });
  const wrist = actor.bone(spec.hand);
  if (!wrist) return;
  // A rig with no finger bones still closes the wrist, so the hand never reads as a board.
  const wristScale = anyFinger ? 0.35 : 1;
  const wristCurl = (base.wrist + (pose.wrist - base.wrist) * blend) * wristScale;
  wrist.quaternion.multiply(deltaQuat(wristCurl, 0, 0)).normalize();
}
