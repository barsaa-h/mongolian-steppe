import { Vector3 } from 'three';
import { clamp, smooth, yawToward } from './math.js';

const VERBS = new Set([
  'face', 'lookAt', 'gesture', 'give', 'take', 'say', 'walkTo', 'turnTo',
  'sit', 'stand', 'kneel', 'reach', 'hand', 'sick',
]);

function weightOf(cue, fallback = 1) {
  return cue.w ?? cue.weight ?? fallback;
}

// One shot file is a list of timed verbs. Unknown verbs throw; missing bones do not.
export function applyCueSheet(actor, sheet, stage = null) {
  for (const cue of sheet?.cues || []) {
    const t = cue.t ?? 0;
    if (!VERBS.has(cue.do)) throw new Error(`Unknown cue ${cue.do}`);
    if (cue.do === 'face') actor.face(cue.mix, weightOf(cue), t, cue.dur ?? null);
    else if (cue.do === 'lookAt') actor.lookAt(cue.target, t);
    else if (cue.do === 'gesture') actor.gesture(cue.name, t, { side: cue.side || null, dur: cue.dur });
    else if (cue.do === 'give') {
      actor.give({ prop: cue.prop, hand: cue.hand || 'R', to: cue.to, dur: cue.dur }, t);
      if (stage && cue.prop && cue.to) stage.handoffFromCue(cue, actor.id);
    } else if (cue.do === 'take') actor.take({ prop: cue.prop, hand: cue.hand || 'R', from: cue.from || cue.to, dur: cue.dur }, t);
    else if (cue.do === 'say') actor.say(t, cue.dur ?? 1.2, cue.intensity ?? weightOf(cue, 0.8));
    else if (cue.do === 'walkTo') actor.walkTo(cue.path || [], cue.speed ?? 0.8, t);
    else if (cue.do === 'turnTo') actor.turnTo(cue.target, t);
    else if (cue.do === 'sit') actor.sit(cue.seat, t, cue.dur);
    else if (cue.do === 'stand') actor.stand(t, cue.dur);
    else if (cue.do === 'kneel') actor.kneel(t, { side: cue.side || 'R', dur: cue.dur });
    else if (cue.do === 'reach') actor.reach(cue.hand || 'R', cue.target, { t, dur: cue.dur ?? 0.8, weight: weightOf(cue) });
    else if (cue.do === 'hand') actor.setHand(cue.hand || 'R', cue.pose || 'relaxed', t, weightOf(cue), cue.dur ?? null);
    else if (cue.do === 'sick') actor.setSick(weightOf(cue, cue.amount ?? 0), t);
  }
  return actor;
}

// Home yaw faces either a point or the end of this actor's walkTo path.
export function blockingYaw(home, face, sheet) {
  let target = face;
  if (face === 'path') {
    const walk = (sheet?.cues || []).find(cue => cue.do === 'walkTo');
    target = walk?.path?.[walk.path.length - 1] || home;
  }
  if (!target || Math.hypot(target[0] - home[0], target[2] - home[2]) < 1e-4) return 0;
  return yawToward(home[0], home[2], target[0], target[2]);
}

function handName(token) {
  if (token === 'L' || token === 'hand.L' || token === 'hand_left') return 'hand_left';
  if (token === 'R' || token === 'hand.R' || token === 'hand_right') return 'hand_right';
  if (token === 'chest' || token === 'head' || token === 'eyes') return token;
  return 'head';
}

function parseTarget(spec) {
  const parts = String(spec).split('.');
  const id = parts[0];
  const rest = parts.slice(1).join('.');
  return { id, name: handName(rest || 'head') };
}

// Stage owns actor order and prop parents. pose(t) samples every actor, then sticks props.
// Actor look targets go through focus points, so the sample order does not change the pose.
export class Stage {
  constructor() {
    this.actors = new Map();
    this.props = new Map();
    this.handoffs = [];
    this._depth = 0;
  }

  addActor(actor) {
    actor.stage = this;
    this.actors.set(actor.id, actor);
    return this;
  }

  addProp(id, object, options = {}) {
    this.props.set(id, {
      id,
      object,
      holder: options.holder || null,
      hand: options.hand || 'R',
      offset: options.offset || [0, 0.045, 0.02],
    });
    return this;
  }

  handoff(propId, fromId, fromHand, toId, toHand, t, dur = 1.2) {
    this.handoffs.push({ propId, fromId, fromHand, toId, toHand, t, dur });
    return this;
  }

  handoffFromCue(cue, fromId) {
    const to = parseTarget(cue.to);
    this.handoff(cue.prop, fromId, cue.hand || 'R', to.id, cue.to.includes('.L') ? 'L' : 'R', cue.t ?? 0, cue.dur ?? 1.2);
  }

  resolve(spec, t) {
    if (!spec) return new Vector3();
    if (spec.isVector3) return spec.clone();
    if (Array.isArray(spec)) return new Vector3(spec[0] || 0, spec[1] || 0, spec[2] || 0);
    if (this._depth > 3) return new Vector3();
    const parsed = parseTarget(spec);
    const actor = this.actors.get(parsed.id);
    if (!actor) return new Vector3();
    this._depth += 1;
    try {
      return actor.focusPoint(t, parsed.name);
    } finally {
      this._depth -= 1;
    }
  }

  pose(t) {
    for (const actor of this.actors.values()) actor.pose(t);
    this._stickProps(t);
    return this;
  }

  _holderAt(prop, t) {
    let holder = prop.holder;
    let hand = prop.hand;
    for (const hop of this.handoffs) {
      if (hop.propId !== prop.id || t < hop.t) continue;
      const u = clamp((t - hop.t) / Math.max(0.05, hop.dur));
      const passed = u >= 1 || smooth(u) >= 0.55;
      holder = passed ? hop.toId : hop.fromId;
      hand = passed ? hop.toHand : hop.fromHand;
    }
    return { holder, hand };
  }

  _stickProps(t) {
    for (const prop of this.props.values()) {
      const { holder, hand } = this._holderAt(prop, t);
      const actor = holder ? this.actors.get(holder) : null;
      const bone = actor ? actor.bone(hand === 'L' ? 'hand_left' : 'hand_right') : null;
      if (!bone) continue;
      if (prop.object.parent !== bone) bone.add(prop.object);
      prop.object.position.set(prop.offset[0], prop.offset[1], prop.offset[2]);
      prop.object.updateMatrix();
    }
  }
}
