import { Vector3 } from 'three';
import { angleDiff, clamp, lerpAngle, smooth, yawToward } from './math.js';
import { gestureByName } from './gestures.js';

const STRIDE = 0.46;

function cloneState(state) {
  return {
    position: state.position.clone(),
    yaw: state.yaw,
    mode: state.mode,
    walk: state.walk,
    walkTime: state.walkTime,
    kneel: state.kneel,
    crouch: state.crouch,
    sit: state.sit,
    sitY: state.sitY,
    kneelSide: state.kneelSide,
    poseKind: state.poseKind,
    poseTime: state.poseTime,
    shift: state.shift,
  };
}

function rise(elapsed, dur) {
  const shiftEnd = Math.max(0.18, dur * 0.28);
  const drop = smooth(clamp((elapsed - shiftEnd * 0.55) / Math.max(0.2, dur - shiftEnd * 0.55)));
  const sway = Math.sin(Math.min(1, Math.max(0, elapsed) / shiftEnd) * Math.PI);
  return { drop, sway };
}

function polyline(start, path) {
  const points = [start.clone()];
  for (const point of path || []) {
    const next = new Vector3(point[0], start.y, point[2] ?? point[1]);
    if (next.distanceTo(points[points.length - 1]) > 0.02) points.push(next);
  }
  return points;
}

function walkState(start, path, speed, elapsed) {
  const points = polyline(start.position, path);
  if (points.length < 2) return { ...cloneState(start), mode: 'stand', walk: 0 };
  const heading = yawToward(points[0].x, points[0].z, points[1].x, points[1].z);
  const angle = angleDiff(start.yaw, heading);
  const turnDur = Math.abs(angle) < 0.08 ? 0 : clamp(Math.abs(angle) / 2.4, 0.16, 1.3);
  if (elapsed < turnDur) {
    const turn = smooth(elapsed / Math.max(turnDur, 1e-4));
    return { ...cloneState(start), yaw: lerpAngle(start.yaw, heading, turn), mode: 'turn', walk: 0, walkTime: 0 };
  }
  const moving = elapsed - turnDur;
  let remaining = moving * speed;
  let length = 0;
  for (let i = 0; i < points.length - 1; i++) length += points[i].distanceTo(points[i + 1]);
  if (remaining >= length) {
    const extra = (remaining - length) / Math.max(speed, 0.05);
    const settle = smooth(clamp(extra / 0.4));
    const end = points[points.length - 1];
    const prev = points[points.length - 2];
    const endYaw = yawToward(prev.x, prev.z, end.x, end.z);
    return {
      ...cloneState(start),
      position: end.clone(),
      yaw: endYaw,
      mode: settle > 0.99 ? 'stand' : 'settle',
      walk: 1 - settle,
      walkTime: length / STRIDE,
    };
  }
  let cursor = remaining;
  for (let i = 0; i < points.length - 1; i++) {
    const seg = points[i].distanceTo(points[i + 1]);
    if (cursor <= seg || i === points.length - 2) {
      const u = seg < 1e-5 ? 1 : cursor / seg;
      const point = points[i].clone().lerp(points[i + 1], Math.min(1, u));
      const yaw = yawToward(points[i].x, points[i].z, points[i + 1].x, points[i + 1].z);
      const fade = smooth(clamp(moving / 0.22));
      return { ...cloneState(start), position: point, yaw, mode: 'walk', walk: fade, walkTime: remaining / STRIDE };
    }
    cursor -= seg;
  }
  return cloneState(start);
}

function applyEvent(state, event, elapsed) {
  if (event.type === 'walkTo') return walkState(state, event.path, event.speed ?? 0.8, elapsed);
  if (event.type === 'turnTo') {
    const dur = event.dur ?? clamp(Math.abs(angleDiff(state.yaw, event.yaw)) / 2.2, 0.2, 1.2);
    const turn = smooth(clamp(elapsed / dur));
    return { ...cloneState(state), yaw: lerpAngle(state.yaw, event.yaw, turn), mode: turn > 0.99 ? 'stand' : 'turn', walk: 0 };
  }
  if (event.type === 'kneel' || event.type === 'crouch') {
    const dur = event.dur ?? (event.type === 'kneel' ? 1.15 : 1.0);
    const { drop, sway } = rise(elapsed, dur);
    const next = cloneState(state);
    next.mode = event.type;
    next.poseKind = event.type;
    next.poseTime = event.t;
    next.kneel = event.type === 'kneel' ? drop : 0;
    next.crouch = event.type === 'crouch' ? drop : state.crouch * (1 - drop);
    next.sit = state.sit * (1 - drop);
    next.kneelSide = event.side || 'R';
    next.shift = (event.side === 'L' ? 1 : -1) * 0.04 * sway;
    next.walk = 0;
    return next;
  }
  if (event.type === 'sit') {
    const dur = event.dur ?? 1.05;
    const { drop, sway } = rise(elapsed, dur);
    const seat = event.seat;
    const next = cloneState(state);
    next.position = state.position.clone().lerp(new Vector3(seat[0], state.position.y, seat[2]), drop);
    next.sit = drop;
    next.sitY = seat[1];
    next.kneel = state.kneel * (1 - drop);
    next.crouch = state.crouch * (1 - drop);
    next.mode = 'sit';
    next.poseKind = 'sit';
    next.poseTime = event.t;
    next.shift = 0.03 * sway;
    next.walk = 0;
    return next;
  }
  if (event.type === 'stand') {
    const dur = event.dur ?? 0.9;
    const { drop, sway } = rise(elapsed, dur);
    const next = cloneState(state);
    next.kneel = state.kneel * (1 - drop);
    next.crouch = state.crouch * (1 - drop);
    next.sit = state.sit * (1 - drop);
    next.mode = drop > 0.99 ? 'stand' : 'standing';
    next.poseKind = 'stand';
    next.poseTime = event.t;
    next.shift = state.shift * (1 - drop) + sway * 0.02;
    next.walk = 0;
    return next;
  }
  return cloneState(state);
}

export function placementAt(home, events, t, prepare) {
  const sorted = [...events].sort((a, b) => a.t - b.t || a.order - b.order);
  let state = {
    position: home.position.clone(),
    yaw: home.yaw,
    mode: 'stand',
    walk: 0,
    walkTime: 0,
    kneel: 0,
    crouch: 0,
    sit: 0,
    sitY: null,
    kneelSide: 'R',
    poseKind: 'stand',
    poseTime: -Infinity,
    shift: 0,
  };
  for (let i = 0; i < sorted.length; i++) {
    const event = sorted[i];
    if (event.t > t) break;
    const nextT = i + 1 < sorted.length ? sorted[i + 1].t : Infinity;
    const elapsed = Math.min(t, nextT) - event.t;
    const prepared = prepare ? prepare(event, state) : event;
    state = applyEvent(state, prepared, elapsed);
  }
  return state;
}

function poseAmount(spec, instance, t) {
  const dur = instance.dur ?? spec.dur;
  const riseTime = Math.max(0.35, dur * 0.62);
  const raised = smooth(clamp((t - instance.t) / riseTime));
  if (t < instance.t) return 0;
  if (spec.hold) return raised;
  if (t <= instance.t + dur) return raised;
  return raised * (1 - smooth(clamp((t - instance.t - dur) / 0.3)));
}

// Placement and a held gesture can both ask for a kneel. The later one wins.
export function bodyPose(actor, t) {
  const place = placementAt(actor.home, actor.events, t, (event, state) => {
    if (event.type !== 'turnTo' || event.yaw != null) return event;
    const point = actor.resolvePoint(event.target, event.t);
    return { ...event, yaw: yawToward(state.position.x, state.position.z, point.x, point.z) };
  });
  let gesturePose = null;
  for (const instance of actor.gestures) {
    if (instance.t > t) continue;
    let spec;
    try { spec = gestureByName(instance.name); } catch { continue; }
    if (!spec.pose) continue;
    const amount = poseAmount(spec, instance, t);
    const alive = spec.hold ? t >= instance.t : amount > 0.001;
    if (!alive) continue;
    if (!gesturePose || instance.t >= gesturePose.t) gesturePose = { t: instance.t, pose: spec.pose, amount, side: instance.side || spec.side || 'R' };
  }
  const gestureWins = gesturePose && gesturePose.t >= place.poseTime;
  const kneel = gestureWins && gesturePose.pose === 'kneel' ? gesturePose.amount : place.kneel;
  const crouch = gestureWins && gesturePose.pose === 'crouch' ? gesturePose.amount : place.crouch;
  const kneelSide = gestureWins && gesturePose.pose === 'kneel' ? gesturePose.side : place.kneelSide;
  const kneelAmount = gestureWins && gesturePose.pose !== 'kneel' ? place.kneel * (1 - gesturePose.amount) : kneel;
  const leg = Math.max(actor.legLength || 0.45, 0.18);
  const drop = Math.min(0.5, leg * 0.66) * kneelAmount + Math.min(0.32, leg * 0.42) * crouch + place.sit * Math.min(0.34, leg * 0.45);
  return {
    position: place.position.clone(),
    yaw: place.yaw,
    walk: place.walk,
    walkTime: place.walkTime,
    kneel: kneelAmount,
    crouch,
    sit: place.sit,
    sitY: place.sitY,
    kneelSide: kneelSide || 'R',
    shift: place.shift,
    mode: place.mode,
    drop,
    lean: 0.45 * kneelAmount + 0.3 * crouch + 0.16 * place.sit,
  };
}

export function localToWorld(local, pose) {
  const c = Math.cos(pose.yaw);
  const s = Math.sin(pose.yaw);
  return new Vector3(
    pose.position.x + local.x * c + local.z * s,
    pose.position.y + local.y,
    pose.position.z - local.x * s + local.z * c,
  );
}
