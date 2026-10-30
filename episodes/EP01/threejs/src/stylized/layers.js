import { Euler, Quaternion, Vector3 } from 'three';
import { angleDiff, blinkAt, clamp, hash01, saccadeAt, smooth, syllable, weightShiftAt } from './math.js';
import { localToWorld } from './body.js';

export const EXPRESSION_MIXES = {
  warm: { smile: 0.45, resolve: 0.12, speak: 0.06 },
  tired: { blink: 0.28, hunger: 0.12, frown: 0.15, speak: 0.04 },
  worried: { fear: 0.55, frown: 0.2, gaze: 0.15 },
  angry: { frown: 0.7, resolve: 0.45, fear: 0.1 },
  afraid: { fear: 0.9, gaze: 0.2, frown: 0.15 },
  pain_hidden: { fear: 0.22, resolve: 0.5, frown: 0.18, blink: 0.12 },
  hungry_blank: { hunger: 0.85, gaze: 0.05 },
  laugh: { smile: 0.7, speak: 0.35, resolve: 0.15 },
};

function rotateLocal(bone, x, y, z, weight = 1) {
  if (!bone || weight <= 0) return;
  const turn = new Quaternion().setFromEuler(new Euler(x * weight, y * weight, z * weight, 'XYZ'));
  bone.quaternion.multiply(turn).normalize();
}

export function aimAngles(actor, target, pose) {
  const origin = actor.focusPoint(pose, 'head');
  const to = target.clone().sub(origin);
  const left = actor.flatLeft(pose.yaw);
  const forward = actor.flatForward(pose.yaw);
  const yaw = Math.atan2(to.dot(left), to.dot(forward));
  const horizontal = Math.hypot(to.dot(left), to.dot(forward));
  const pitch = Math.atan2(-to.y, Math.max(0.05, horizontal));
  return { yaw, pitch };
}

function limited(value, max) {
  return clamp(value, -max, max);
}

// Eyes take the aim immediately. Neck and head arrive 150–250 ms later.
export function applyLook(actor, target, since, t, pose) {
  if (!target) return { yaw: 0, pitch: 0, speed: 0 };
  const lag = 0.15 + (actor.seed % 100) / 100 * 0.1;
  const now = aimAngles(actor, target, pose);
  const saccade = saccadeAt(Math.max(0, t), actor.seed + 19);
  const eyeU = smooth(clamp((t - since) / 0.12));
  const headU = smooth(clamp((t - since - lag) / 0.28));
  const eyeYaw = limited(now.yaw + saccade.yaw, 0.45) * eyeU;
  const eyePitch = limited(now.pitch + saccade.pitch, 0.32) * eyeU;
  const headYaw = limited(now.yaw + saccade.yaw * 0.25, 0.7) * headU;
  const headPitch = limited(now.pitch + saccade.pitch * 0.2, 0.55) * headU;
  rotateLocal(actor.bone('neck'), headPitch * 0.4, headYaw * 0.35, 0);
  rotateLocal(actor.bone('head'), headPitch * 0.75, headYaw * 0.8, 0);
  rotateLocal(actor.bone('eye.L'), eyePitch, eyeYaw, 0);
  rotateLocal(actor.bone('eye.R'), eyePitch, eyeYaw, 0);
  if (!actor.bone('eye.L') && !actor.bone('eye.R')) {
    const gaze = clamp(0.5 + eyeYaw * 0.9, 0, 1);
    actor.addMorph('gaze', gaze * eyeU);
  }
  const earlier = aimAngles(actor, target, pose);
  const before = t - 0.08;
  let speed = 0;
  if (before > since) {
    const pastTarget = target;
    const past = aimAngles(actor, pastTarget, pose);
    // The target can move. Compare the aimed yaw at this pose against a lagged weight.
    speed = Math.abs(angleDiff(past.yaw * smooth(clamp((before - since - lag) / 0.28)), now.yaw * headU)) / 0.08;
  }
  void earlier;
  return { yaw: headYaw, pitch: headPitch, speed };
}

export function applyLife(actor, t, sick, pose) {
  const breathePeriod = 3.25 + sick * 1.35;
  const breathe = Math.sin((t * Math.PI * 2) / breathePeriod + actor.seed * 0.017);
  const depth = 0.012 * (1 + sick * 0.35);
  rotateLocal(actor.bone('chest'), depth * breathe, 0, depth * 0.35 * breathe);
  rotateLocal(actor.bone('spine'), depth * 0.45 * breathe, 0.006 * Math.sin(t * 0.7 + actor.seed), 0.008 * Math.sin(t * 0.45 + actor.seed * 0.2));
  rotateLocal(actor.bone('shoulder_left'), depth * 0.5 * breathe, 0, 0);
  rotateLocal(actor.bone('shoulder_right'), depth * 0.5 * breathe, 0, 0);
  const shift = weightShiftAt(t, actor.seed);
  const pelvis = actor.bone('pelvis');
  if (pelvis) {
    const lateral = actor.flatLeft(pose.yaw).multiplyScalar((0.012 * shift + (pose.shift || 0)) * (1 - pose.walk));
    actor.translateBoneWorld(pelvis, lateral);
  }
  rotateLocal(actor.bone('spine'), 0, 0, 0.018 * shift * (1 - pose.walk));
  const fidget = 0.04 + sick * 0.02;
  for (const side of ['L', 'R']) {
    for (const finger of ['thumb', 'index', 'middle', 'ring', 'pinky']) {
      const bone = actor.bone(`${finger}.01.${side}`);
      if (!bone) continue;
      const phase = hash01(actor.seed + side.charCodeAt(0) + finger.length) * 6;
      rotateLocal(bone, fidget * Math.sin(t * (1.3 + sick) + phase), 0, fidget * 0.35 * Math.sin(t * 0.9 + phase));
    }
  }
}

export function applyTremor(actor, t, sick) {
  if (!(sick > 0)) return;
  const amount = 0.006 * sick;
  rotateLocal(actor.bone('head'), amount * Math.sin(t * 9.1 + actor.seed), amount * 0.7 * Math.sin(t * 11.3), amount * 0.4 * Math.sin(t * 8.4));
  rotateLocal(actor.bone('hand_left'), amount * 1.3 * Math.sin(t * 10.7), amount * Math.sin(t * 12.1 + 1), 0);
  rotateLocal(actor.bone('hand_right'), amount * 1.1 * Math.sin(t * 11.5 + 2), amount * Math.sin(t * 9.7), 0);
}

export function faceWeights(actor, t) {
  const ordered = actor.faces.filter(face => face.t <= t).sort((a, b) => a.t - b.t);
  const weights = {};
  if (!ordered.length) return weights;
  const current = ordered[ordered.length - 1];
  const previous = ordered[ordered.length - 2];
  const fade = smooth(clamp((t - current.t) / 0.25));
  const currentMix = EXPRESSION_MIXES[current.mix] || {};
  const previousMix = previous ? EXPRESSION_MIXES[previous.mix] || {} : {};
  const names = new Set([...Object.keys(currentMix), ...Object.keys(previousMix)]);
  for (const name of names) {
    const from = (previousMix[name] || 0) * (previous ? (previous.w ?? 1) : 0);
    const to = (currentMix[name] || 0) * (current.w ?? 1);
    if (current.dur != null && t > current.t + current.dur) continue;
    weights[name] = from * (1 - fade) + to * fade;
  }
  return weights;
}

export function speakAmount(actor, t) {
  let amount = 0;
  for (const line of actor.lines) amount = Math.max(amount, syllable(t, line.t, line.dur, line.intensity));
  return amount;
}

export function applyFace(actor, t, pose, lookSpeed) {
  actor.zeroMorphs();
  const weights = faceWeights(actor, t);
  for (const [name, value] of Object.entries(weights)) actor.addMorph(name, value);
  const bucket = Math.floor(t * 2.5);
  actor.addMorph('hunger', 0.02 * (hash01(actor.seed + bucket * 1.7) - 0.5));
  const speak = speakAmount(actor, t);
  if (speak > 0) actor.addMorph('speak', speak);
  let blink = blinkAt(t, actor.seed + 3, actor.sickAt(t));
  if (lookSpeed > 1.15) blink = Math.max(blink, Math.sin(Math.min(1, lookSpeed * 0.05) * Math.PI));
  // One blink across a large turn, held for a short deterministic window.
  if (lookSpeed > 1.1) {
    const u = clamp((lookSpeed - 1.1) / 1.5);
    blink = Math.max(blink, Math.sin(u * Math.PI) * 0.85);
  }
  if (blink > 0) actor.addMorph('blink', Math.max(weights.blink || 0, blink));
  const jaw = actor.bone('jaw');
  if (jaw && speak > 0) rotateLocal(jaw, speak * 0.38, 0, 0);
  actor.flushMorphs();
  return { speak, blink };
}

export function lookSpeed(actor, target, since, t, pose) {
  if (!target || t < since) return 0;
  const now = aimAngles(actor, target, pose);
  const pastPose = pose;
  const past = aimAngles(actor, target, pastPose);
  // Speed from the lag envelope, so a new look still blinks as the head starts moving.
  const lag = 0.15 + (actor.seed % 100) / 100 * 0.1;
  const headNow = smooth(clamp((t - since - lag) / 0.28));
  const headPast = smooth(clamp((t - 0.08 - since - lag) / 0.28));
  return Math.abs(angleDiff(past.yaw * headPast, now.yaw * headNow)) / 0.08;
}

export function gestureLocalTarget(actor, key, pose, mirror) {
  const near = actor.restLocal.get(key.near);
  if (!near) {
    actor.record('bone', key.near);
    return null;
  }
  const offsetX = mirror ? -key.offset[0] : key.offset[0];
  const local = near.clone();
  local.x += offsetX;
  local.y += key.offset[1] - pose.drop;
  local.z += key.offset[2] + pose.lean * 0.08;
  return localToWorld(local, pose);
}
