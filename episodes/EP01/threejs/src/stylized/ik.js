import { Vector3 } from 'three';
import { solveLimb } from '../anim.js';
import { sideBones } from './rig.js';

function finiteQuat(bone) {
  const q = bone.quaternion;
  return Number.isFinite(q.x) && Number.isFinite(q.y) && Number.isFinite(q.z) && Number.isFinite(q.w);
}

// Two-bone IK. solveLimb aims the end joint origin at the world target.
// A collapsed pole is nudged so the bend stays defined instead of going NaN.
export function solveTwoBone(upper, lower, end, target, pole) {
  if (!upper || !lower || !end || !target || !pole) return false;
  upper.updateWorldMatrix(true, true);
  const start = upper.getWorldPosition(new Vector3());
  const middle = lower.getWorldPosition(new Vector3());
  const tip = end.getWorldPosition(new Vector3());
  if (start.distanceTo(middle) < 1e-4 || middle.distanceTo(tip) < 1e-4) return false;
  if (start.distanceTo(target) < 1e-5) return true;
  const axis = target.clone().sub(start);
  if (axis.lengthSq() < 1e-10) return false;
  axis.normalize();
  const bend = pole.clone().sub(start);
  bend.addScaledVector(axis, -bend.dot(axis));
  const safePole = bend.lengthSq() < 1e-8 ? pole.clone().add(new Vector3(0, 0.35, 0.15)) : pole;
  const upperRest = upper.quaternion.clone();
  const lowerRest = lower.quaternion.clone();
  solveLimb(upper, lower, end, target, safePole);
  if (!finiteQuat(upper) || !finiteQuat(lower)) {
    upper.quaternion.copy(upperRest);
    lower.quaternion.copy(lowerRest);
    return false;
  }
  upper.quaternion.normalize();
  lower.quaternion.normalize();
  end.updateWorldMatrix(true, true);
  return true;
}

export function armPole(actor, side) {
  const spec = sideBones(side);
  const upper = actor.bone(spec.upper);
  const origin = upper ? upper.getWorldPosition(new Vector3()) : actor.group.getWorldPosition(new Vector3());
  const left = actor.flatLeft();
  const forward = actor.flatForward();
  return origin.clone().addScaledVector(left, spec.sign * 0.28).addScaledVector(forward, -0.22);
}

export function reachArm(actor, side, target, weight = 1) {
  if (!(weight > 0) || !target) return false;
  const spec = sideBones(side);
  const upper = actor.bone(spec.upper);
  const lower = actor.bone(spec.fore);
  const hand = actor.bone(spec.hand);
  if (!upper || !lower || !hand) return false;
  hand.updateWorldMatrix(true, false);
  const current = hand.getWorldPosition(new Vector3());
  const goal = current.clone().lerp(target, weight);
  return solveTwoBone(upper, lower, hand, goal, armPole(actor, side));
}

export function footPole(actor, side, mode = 'forward') {
  const spec = sideBones(side);
  const thigh = actor.bone(spec.thigh);
  const origin = thigh ? thigh.getWorldPosition(new Vector3()) : actor.group.getWorldPosition(new Vector3());
  if (mode === 'down') return origin.clone().add(new Vector3(0, -0.45, 0)).addScaledVector(actor.flatForward(), -0.05);
  return origin.clone().addScaledVector(actor.flatForward(), 0.38).addScaledVector(actor.flatLeft(), spec.sign * 0.04);
}

export function plantFoot(actor, side, target, mode = 'forward') {
  const spec = sideBones(side);
  return solveTwoBone(actor.bone(spec.thigh), actor.bone(spec.shin), actor.bone(spec.foot), target, footPole(actor, side, mode));
}
