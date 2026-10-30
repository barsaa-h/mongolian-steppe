import { AnimationMixer, Euler, LoopRepeat, Quaternion, Vector3 } from 'three';
import { bodyPose, localToWorld } from './body.js';
import { gestureByName } from './gestures.js';
import { applyHand } from './hands.js';
import { plantFoot, reachArm } from './ik.js';
import { applyFace, applyLife, applyLook, applyTremor, gestureLocalTarget, lookSpeed } from './layers.js';
import { clamp, seedFromId, smooth, smoother } from './math.js';
import { CONTRACT_MORPHS, HEAD_BONES, indexRig, mapBoneName } from './rig.js';

function sampleKeys(keys, time) {
  if (!keys?.length) return [0, 0, 0];
  if (time <= keys[0][0]) return keys[0].slice(1);
  const last = keys[keys.length - 1];
  if (time >= last[0]) return last.slice(1);
  let index = 0;
  while (index < keys.length - 2 && time > keys[index + 1][0]) index++;
  const a = keys[index];
  const b = keys[index + 1];
  const u = smoother((time - a[0]) / Math.max(1e-5, b[0] - a[0]));
  return [0, 1, 2].map(axis => a[axis + 1] + (b[axis + 1] - a[axis + 1]) * u);
}

function trackEnvelope(spec, instance, t) {
  const dur = instance.dur ?? spec.dur;
  const local = t - instance.t;
  if (local < 0) return 0;
  const fadeIn = smooth(clamp(local / 0.1));
  if (local <= dur) return fadeIn;
  return fadeIn * (1 - smooth(clamp((local - dur) / 0.2)));
}

// StylizedActor.pose(t) is a pure function of t and the directives registered
// before it. It does not read a wall clock and does not depend on earlier pose calls.
export class StylizedActor {
  constructor(group, options = {}) {
    this.id = options.id || group.name || 'actor';
    this.group = group;
    this.seed = options.seed ?? seedFromId(this.id);
    this.ground = options.ground || 0;
    this.stage = null;
    this.diagnostics = [];
    this._reported = new Set();
    this.events = [];
    this.gestures = [];
    this.reaches = [];
    this.looks = [];
    this.faces = [];
    this.lines = [];
    this.handCues = [];
    this.sicks = [];
    this.transfers = [];
    this._order = 0;
    this.morphValues = {};
    this.morphMeshes = [];
    this.morphNames = new Set(options.morphNames || []);
    const indexed = indexRig(group);
    this.byCanonical = indexed.byCanonical;
    this.rest = new Map();
    for (const bone of indexed.bones) {
      this.rest.set(bone, { p: bone.position.clone(), q: bone.quaternion.clone(), s: bone.scale.clone() });
    }
    for (const name of indexed.missing) this.record('bone', name);
    group.traverse(object => {
      if (!object.morphTargetDictionary) return;
      this.morphMeshes.push(object);
      for (const name of Object.keys(object.morphTargetDictionary)) this.morphNames.add(name);
    });
    for (const name of CONTRACT_MORPHS) if (!this.morphNames.has(name)) this.record('morph', name);
    this._measureLocals();
    this.home = {
      position: options.home ? new Vector3(options.home.position[0], options.home.position[1], options.home.position[2]) : group.position.clone(),
      yaw: options.home ? options.home.yaw || 0 : group.rotation.y,
    };
    this.mixer = new AnimationMixer(group);
    this.actions = {};
    for (const clip of options.clips || []) {
      if (!clip || this.actions[clip.name]) continue;
      const action = this.mixer.clipAction(clip);
      action.setLoop(LoopRepeat, Infinity);
      action.enabled = true;
      action.play();
      action.setEffectiveWeight(0);
      this.actions[clip.name] = action;
    }
    this._resetBones();
    if (Object.keys(this.actions).length) this.mixer.update(0);
  }

  record(kind, name) {
    const key = `${kind}:${name}`;
    if (this._reported.has(key)) return;
    this._reported.add(key);
    this.diagnostics.push(key);
  }

  bone(name) {
    if (this.byCanonical.has(name)) return this.byCanonical.get(name);
    this.record('bone', name);
    return null;
  }

  world(name) {
    const bone = this.byCanonical.get(name);
    return bone ? bone.getWorldPosition(new Vector3()) : new Vector3();
  }

  flatForward(yaw = this.group.rotation.y) {
    return new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  }

  flatLeft(yaw = this.group.rotation.y) {
    return new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  }

  translateBoneWorld(bone, delta) {
    if (!bone || delta.lengthSq() < 1e-12) return;
    const parent = bone.parent;
    if (!parent) { bone.position.add(delta); return; }
    parent.updateWorldMatrix(true, false);
    bone.position.copy(parent.worldToLocal(bone.getWorldPosition(new Vector3()).add(delta)));
    bone.updateWorldMatrix(false, true);
  }

  clearDirectives() {
    this.events = [];
    this.gestures = [];
    this.reaches = [];
    this.looks = [];
    this.faces = [];
    this.lines = [];
    this.handCues = [];
    this.sicks = [];
    this.transfers = [];
  }

  walkTo(path, speed = 0.8, t = 0) {
    const points = (path || []).map(point => Array.isArray(point) ? point : [point.x, point.y, point.z]);
    this.events.push({ type: 'walkTo', t, path: points, speed, order: this._order++ });
    return this;
  }

  turnTo(target, t = 0) {
    this.events.push({ type: 'turnTo', t, target, order: this._order++ });
    return this;
  }

  sit(seat, t = 0, dur = 1.05) {
    const point = Array.isArray(seat) ? seat : [seat.x, seat.y, seat.z];
    this.events.push({ type: 'sit', t, seat: point, dur, order: this._order++ });
    return this;
  }

  stand(t = 0, dur = 0.9) {
    this.events.push({ type: 'stand', t, dur, order: this._order++ });
    return this;
  }

  kneel(t = 0, options = {}) {
    this.events.push({ type: 'kneel', t, side: options.side || 'R', dur: options.dur ?? 1.15, order: this._order++ });
    return this;
  }

  gesture(name, t = 0, options = {}) {
    gestureByName(name);
    this.gestures.push({ name, t, side: options.side || null, dur: options.dur, order: this._order++ });
    return this;
  }

  reach(hand, target, options = {}) {
    this.reaches.push({ hand, target, t: options.t ?? 0, dur: options.dur ?? 0.8, weight: options.weight ?? 1, order: this._order++ });
    return this;
  }

  setHand(hand, pose, t = 0, weight = 1, dur = null) {
    this.handCues.push({ hand, pose, t, w: weight, dur, order: this._order++ });
    return this;
  }

  lookAt(target, t = 0) {
    this.looks.push({ target, t, order: this._order++ });
    return this;
  }

  face(mix, weight = 1, t = 0, dur = null) {
    this.faces.push({ mix, w: weight, t, dur, order: this._order++ });
    return this;
  }

  say(t, dur = 1.2, intensity = 0.8) {
    this.lines.push({ t, dur, intensity });
    return this;
  }

  setSick(amount, t = 0) {
    this.sicks.push({ t, w: clamp(amount, 0, 1) });
    return this;
  }

  give(spec, t = 0) {
    this.transfers.push({ role: 'give', prop: spec.prop, hand: spec.hand || 'R', other: spec.to, t, dur: spec.dur ?? 1.2, order: this._order++ });
    return this;
  }

  take(spec, t = 0) {
    this.transfers.push({ role: 'take', prop: spec.prop, hand: spec.hand || 'R', other: spec.from, t, dur: spec.dur ?? 1.2, order: this._order++ });
    return this;
  }

  sickAt(t) {
    let amount = 0;
    for (const item of this.sicks) if (item.t <= t) amount = item.w;
    return amount;
  }

  bodyAt(t) {
    const pose = bodyPose(this, t);
    pose.position.y += this.ground;
    return pose;
  }

  resolvePoint(target, t) {
    if (!target) return this.home.position.clone();
    if (typeof target === 'function') return target(t);
    if (target.isVector3) return target.clone();
    if (Array.isArray(target)) return new Vector3(target[0], target[1] || 0, target[2] || 0);
    if (typeof target === 'string' && this.stage) return this.stage.resolve(target, t);
    return this.home.position.clone();
  }

  focusPoint(tOrPose, name = 'head') {
    const pose = typeof tOrPose === 'number' ? this.bodyAt(tOrPose) : tOrPose;
    const key = name.startsWith('hand') ? 'chest' : (name === 'eyes' ? 'head' : name);
    const local = (this.restLocal.get(key) || new Vector3(0, this.legLength || 1, 0)).clone();
    if (name === 'hand_right') { local.x -= 0.12; local.y -= 0.06; local.z += 0.16; }
    if (name === 'hand_left') { local.x += 0.12; local.y -= 0.06; local.z += 0.16; }
    if (name === 'eyes') local.y += 0.04;
    local.y -= pose.drop || 0;
    if (name === 'head' || name === 'eyes') local.z += (pose.lean || 0) * 0.12;
    return localToWorld(local, pose);
  }

  pose(t) {
    const pose = this.bodyAt(t);
    this.group.position.copy(pose.position);
    this.group.rotation.set(0, pose.yaw, 0);
    this.group.updateMatrixWorld(true);
    this._sampleBase(t, pose);
    this.group.updateMatrixWorld(true);
    // Standing plants are the rest ankles in the placed frame, so idle keys and
    // the weight shift cannot skate them. A walk keeps the clip's own plant.
    const useClipFeet = pose.walk > 0.02;
    const planted = {
      L: useClipFeet && this.byCanonical.has('foot_left') ? this.world('foot_left') : this._restFoot('L', pose),
      R: useClipFeet && this.byCanonical.has('foot_right') ? this.world('foot_right') : this._restFoot('R', pose),
    };
    this._applyDrop(pose);
    this._applyGestureTracks(t, false);
    this._applyHands(t);
    this._applyArms(t, pose);
    applyLife(this, t, this.sickAt(t), pose);
    this.group.updateMatrixWorld(true);
    this._applyFeet(pose, planted);
    this._applyArms(t, pose);
    const look = this._activeLook(t);
    const target = look ? this.resolvePoint(look.target, t) : null;
    const speed = target ? lookSpeed(this, target, look.t, t, pose) : 0;
    if (target) applyLook(this, target, look.t, t, pose);
    this._applyGestureTracks(t, true);
    applyFace(this, t, pose, speed);
    applyTremor(this, t, this.sickAt(t));
    this.group.updateMatrixWorld(true);
    return this;
  }

  _measureLocals() {
    const position = this.group.position.clone();
    const yaw = this.group.rotation.y;
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.group.updateMatrixWorld(true);
    this.restLocal = new Map();
    for (const [name, bone] of this.byCanonical) this.restLocal.set(name, bone.getWorldPosition(new Vector3()));
    const hip = this.restLocal.get('pelvis');
    const foot = this.restLocal.get('foot_left') || this.restLocal.get('foot_right');
    this.legLength = hip && foot ? hip.distanceTo(foot) : 0.7;
    this.group.position.copy(position);
    this.group.rotation.y = yaw;
    this.group.updateMatrixWorld(true);
  }

  _resetBones() {
    for (const [bone, rest] of this.rest) {
      bone.position.copy(rest.p);
      bone.quaternion.copy(rest.q);
      bone.scale.copy(rest.s);
    }
  }

  _sampleBase(t, pose) {
    this._resetBones();
    const walkWeight = this.actions.walk ? pose.walk : 0;
    if (!this.actions.walk && pose.walk > 0) this.record('clip', 'walk');
    if (!this.actions.idle) this.record('clip', 'idle');
    const layers = [];
    if (this.actions.idle) layers.push({ name: 'idle', weight: 1 - walkWeight, time: t });
    if (this.actions.walk && walkWeight > 0) layers.push({ name: 'walk', weight: walkWeight, time: pose.walkTime });
    for (const action of Object.values(this.actions)) action.stop();
    const sum = layers.reduce((total, layer) => total + layer.weight, 0);
    if (!(sum > 0)) return;
    for (const layer of layers) {
      const action = this.actions[layer.name];
      const duration = Math.max(1e-4, action.getClip().duration);
      let time = ((layer.time % duration) + duration) % duration;
      if (time > duration - 1e-4) time = 0;
      action.enabled = true;
      action.paused = false;
      action.setLoop(LoopRepeat, Infinity);
      action.play();
      action.time = time;
      action.setEffectiveWeight(layer.weight / sum);
    }
    this.mixer.update(0);
  }

  _applyDrop(pose) {
    const pelvis = this.bone('pelvis');
    let drop = pose.drop || 0;
    if (pose.sit > 0.001 && pose.sitY != null && pelvis) {
      const hip = pelvis.getWorldPosition(new Vector3());
      const target = pose.sitY + Math.min(0.1, this.legLength * 0.15);
      drop = Math.max(0, (hip.y - target) * pose.sit);
    }
    if (pelvis && drop > 0) {
      const back = this.flatForward(pose.yaw).multiplyScalar(-0.06 * pose.kneel + 0.03 * pose.crouch);
      this.translateBoneWorld(pelvis, new Vector3(0, -drop, 0).add(back));
    }
    if (pelvis && pose.shift) this.translateBoneWorld(pelvis, this.flatLeft(pose.yaw).multiplyScalar(pose.shift));
    const lean = pose.lean || 0;
    for (const [name, scale] of [['spine', 0.45], ['chest', 0.7]]) {
      const bone = this.bone(name);
      if (!bone || lean <= 0) continue;
      bone.quaternion.multiply(new Quaternion().setFromEuler(new Euler(lean * scale, 0, 0, 'XYZ'))).normalize();
    }
  }

  _gestureSide(spec, instance) {
    const authored = spec.side;
    const requested = instance.side || authored;
    return { mirror: !!(authored && requested && requested !== authored), authored, requested };
  }

  _restFoot(side, pose) {
    const name = side === 'L' ? 'foot_left' : 'foot_right';
    const local = this.restLocal.get(name);
    return local ? localToWorld(local, pose) : null;
  }

  _applyGestureTracks(t, headOnly) {
    for (const instance of this.gestures) {
      if (instance.t > t) continue;
      const spec = gestureByName(instance.name);
      const weight = trackEnvelope(spec, instance, t);
      if (weight <= 0) continue;
      const { mirror } = this._gestureSide(spec, instance);
      for (const [boneName, keys] of Object.entries(spec.tracks)) {
        const mapped = mapBoneName(boneName, spec.side || 'R', mirror ? (instance.side || spec.side) : (spec.side || 'R'));
        const name = mirror ? mapped.name : boneName;
        const isHead = HEAD_BONES.has(name) || HEAD_BONES.has(boneName);
        if (isHead !== headOnly) continue;
        const bone = this.bone(name);
        if (!bone) continue;
        const [x, y, z] = sampleKeys(keys, t - instance.t);
        const turn = new Quaternion().setFromEuler(new Euler(x * weight, (mirror ? -y : y) * weight, (mirror ? -z : z) * weight, 'XYZ'));
        bone.quaternion.multiply(turn).normalize();
      }
    }
  }

  _handChoice(side, t) {
    let pose = 'relaxed';
    let weight = 1;
    let since = -Infinity;
    for (const instance of this.gestures) {
      if (instance.t > t) continue;
      const spec = gestureByName(instance.name);
      if (!spec.hands) continue;
      const { mirror } = this._gestureSide(spec, instance);
      const authored = mirror ? (side === 'L' ? 'R' : 'L') : side;
      const chosen = spec.hands[authored];
      if (!chosen) continue;
      const envelope = spec.hold ? (t >= instance.t ? 1 : 0) : trackEnvelope(spec, instance, t);
      if (envelope > 0.001 && instance.t >= since) {
        pose = chosen;
        weight = envelope;
        since = instance.t;
      }
    }
    const cues = this.handCues.filter(cue => cue.hand === side && cue.t <= t).sort((a, b) => a.t - b.t);
    const cue = cues[cues.length - 1];
    if (cue && cue.t >= since && !(cue.dur != null && t > cue.t + cue.dur)) {
      pose = cue.pose;
      weight = (cue.w ?? 1) * smooth(clamp((t - cue.t) / 0.18));
    }
    return { pose, weight };
  }

  _applyHands(t) {
    for (const side of ['L', 'R']) {
      const choice = this._handChoice(side, t);
      applyHand(this, side, choice.pose, choice.weight);
    }
  }

  _ikFromGestures(t, pose) {
    const byHand = { L: null, R: null };
    for (const instance of this.gestures) {
      if (instance.t > t) continue;
      const spec = gestureByName(instance.name);
      const { mirror, authored, requested } = this._gestureSide(spec, instance);
      const nearName = name => mirror ? mapBoneName(name, authored, requested).name : name;
      for (const track of spec.ik || []) {
        const local = t - instance.t;
        const keys = track.keys;
        if (!keys.length || local < keys[0].t) continue;
        const last = keys[keys.length - 1];
        let weight = 0;
        let from = last;
        let to = last;
        let blend = 1;
        if (local >= last.t) {
          const held = track.hold || (spec.hold && track.hold);
          if (!held) {
            weight = last.w * (1 - smooth(clamp((local - last.t) / 0.2)));
          } else weight = last.w;
          if (weight <= 0) continue;
        } else {
          let index = 0;
          while (index < keys.length - 2 && local > keys[index + 1].t) index++;
          from = keys[index];
          to = keys[index + 1];
          blend = smoother((local - from.t) / Math.max(1e-4, to.t - from.t));
          weight = from.w + (to.w - from.w) * blend;
        }
        const hand = mirror ? (track.hand === 'L' ? 'R' : 'L') : track.hand;
        const start = gestureLocalTarget(this, { ...from, near: nearName(from.near) }, pose, mirror);
        const end = gestureLocalTarget(this, { ...to, near: nearName(to.near) }, pose, mirror);
        if (!start || !end) continue;
        const target = start.lerp(end, blend);
        if (!byHand[hand] || instance.t >= byHand[hand].t) byHand[hand] = { t: instance.t, target, weight };
      }
    }
    return byHand;
  }

  _transferTarget(transfer, t) {
    const shaped = smooth(clamp((t - transfer.t) / Math.max(0.05, transfer.dur)));
    const selfName = transfer.hand === 'L' ? 'hand_left' : 'hand_right';
    const from = this.focusPoint(t, selfName);
    const otherId = typeof transfer.other === 'string' ? transfer.other.split('.')[0] : null;
    const other = otherId && this.stage ? this.stage.actors.get(otherId) : null;
    const otherHand = typeof transfer.other === 'string' && transfer.other.includes('.L') ? 'hand_left'
      : typeof transfer.other === 'string' && transfer.other.endsWith('.R') ? 'hand_right' : selfName;
    const to = other ? other.focusPoint(t, otherHand) : from;
    return from.clone().lerp(to, 0.18 + 0.67 * shaped);
  }

  _transferWeight(transfer, t) {
    const u = clamp((t - transfer.t) / Math.max(0.05, transfer.dur));
    if (u <= 0 || u >= 1) return 0;
    return smooth(clamp(u / 0.22)) * (u > 0.8 ? 1 - smooth((u - 0.8) / 0.2) : 1);
  }

  _applyArms(t, pose) {
    const gestureIk = this._ikFromGestures(t, pose);
    for (const side of ['L', 'R']) {
      let target = null;
      let weight = 0;
      const gesture = gestureIk[side];
      if (gesture && gesture.weight > 0) { target = gesture.target; weight = gesture.weight; }
      let reach = null;
      for (const item of this.reaches) {
        if (item.hand !== side || t < item.t || t > item.t + item.dur) continue;
        if (!reach || item.t >= reach.t) reach = item;
      }
      if (reach) {
        const u = clamp((t - reach.t) / Math.max(0.05, reach.dur));
        const reachWeight = smooth(clamp(u / 0.2)) * (u > 0.78 ? 1 - smooth((u - 0.78) / 0.22) : 1) * reach.weight;
        if (reachWeight > 0) {
          target = this.resolvePoint(reach.target, t);
          weight = reachWeight;
        }
      }
      for (const transfer of this.transfers) {
        if (transfer.hand !== side || t < transfer.t || t > transfer.t + transfer.dur) continue;
        const transferWeight = this._transferWeight(transfer, t);
        if (transferWeight > weight) {
          target = this._transferTarget(transfer, t);
          weight = transferWeight;
        }
      }
      if (target && weight > 0.001) reachArm(this, side, target, weight);
    }
  }

  _applyFeet(pose, planted) {
    for (const side of ['L', 'R']) {
      const plantedFoot = planted[side];
      if (!plantedFoot) continue;
      let target = plantedFoot.clone();
      let mode = 'forward';
      if (pose.kneel > 0.001 && side === (pose.kneelSide || 'R')) {
        const tucked = plantedFoot.clone()
          .addScaledVector(this.flatForward(pose.yaw), -0.16 * pose.kneel)
          .addScaledVector(this.flatLeft(pose.yaw), (side === 'L' ? -1 : 1) * 0.045 * pose.kneel);
        tucked.y = plantedFoot.y;
        target = plantedFoot.clone().lerp(tucked, pose.kneel);
        if (pose.kneel > 0.4) mode = 'down';
      } else if (pose.sit > 0.05) {
        const seated = new Vector3(pose.position.x, plantedFoot.y, pose.position.z)
          .addScaledVector(this.flatForward(pose.yaw), 0.16 + 0.08 * pose.sit)
          .addScaledVector(this.flatLeft(pose.yaw), side === 'L' ? 0.07 : -0.07);
        seated.y = plantedFoot.y;
        target = plantedFoot.clone().lerp(seated, pose.sit);
      }
      plantFoot(this, side, target, mode);
    }
  }

  _activeLook(t) {
    let look = null;
    for (const item of this.looks) if (item.t <= t && (!look || item.t >= look.t)) look = item;
    return look;
  }

  zeroMorphs() { this.morphValues = {}; }

  addMorph(name, value) {
    if (!this.morphNames.has(name)) { this.record('morph', name); return; }
    this.morphValues[name] = clamp((this.morphValues[name] || 0) + value, 0, 1);
  }

  flushMorphs() {
    for (const mesh of this.morphMeshes) {
      if (!mesh.morphTargetInfluences) continue;
      mesh.morphTargetInfluences.fill(0);
      for (const [name, value] of Object.entries(this.morphValues)) {
        const index = mesh.morphTargetDictionary[name];
        if (index !== undefined) mesh.morphTargetInfluences[index] = clamp(value, 0, 1);
      }
    }
  }
}
