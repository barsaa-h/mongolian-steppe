// Node checks for the stylized actor. No browser, no textures.
//   node episodes/EP01/threejs/tools/stylized_check.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { StylizedActor } from '../src/stylized/actor.js';
import { applyCueSheet, blockingYaw, Stage } from '../src/stylized/cues.js';
import { GESTURE_NAMES, gestureByName } from '../src/stylized/gestures.js';
import { EXPRESSION_MIXES } from '../src/stylized/layers.js';

const REQUIRED = [
  'nod', 'shake_head', 'shrug', 'point_at', 'wave_off', 'scratch_head', 'rub_face', 'hand_on_chest',
  'arms_cross', 'hands_in_pockets', 'lean_on_table', 'pour_tea', 'drink_from_bowl', 'eat_buuz', 'smoke',
  'cough', 'wipe_brow', 'hide_wrist_behind_back', 'check_wrist', 'flinch', 'startle', 'slap_own_cheek',
  'push_door', 'hold_door_shut', 'grab_wrist', 'hug_child', 'pick_up_child', 'kneel_to_child', 'laugh', 'cry_quietly',
];

assert.equal(GESTURE_NAMES.length, 30);
assert.deepEqual([...GESTURE_NAMES].sort(), [...REQUIRED].sort());
assert.throws(() => gestureByName('not-a-gesture'), /Unknown gesture/);

function packGLB(json, binaryChunk) {
  const encoded = Buffer.from(JSON.stringify(json));
  const padding = (4 - (encoded.length % 4)) % 4;
  const jsonChunk = Buffer.concat([encoded, Buffer.alloc(padding, 0x20)]);
  const header = Buffer.alloc(20);
  header.write('glTF', 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(20 + jsonChunk.length + binaryChunk.length, 8);
  header.writeUInt32LE(jsonChunk.length, 12);
  header.write('JSON', 16);
  return Buffer.concat([header, jsonChunk, binaryChunk]);
}

async function loadCast(id) {
  const source = await readFile(new URL(`../../../../assets/cast/${id}.glb`, import.meta.url));
  assert.equal(source.toString('ascii', 0, 4), 'glTF');
  const jsonLength = source.readUInt32LE(12);
  const json = JSON.parse(source.toString('utf8', 20, 20 + jsonLength));
  const morphNames = [...new Set((json.meshes || []).flatMap(mesh => mesh.extras?.targetNames || []))];
  const animations = (json.animations || []).map(animation => ({
    ...animation,
    channels: animation.channels.filter(channel => channel.target?.path !== 'weights'),
  })).filter(animation => animation.channels.length);
  const hierarchy = {
    asset: json.asset,
    scene: json.scene,
    scenes: json.scenes,
    nodes: json.nodes.map(node => {
      const copy = { ...node };
      delete copy.mesh;
      delete copy.skin;
      delete copy.camera;
      delete copy.extensions;
      return copy;
    }),
    skins: (json.skins || []).map(skin => ({ name: skin.name, joints: skin.joints, skeleton: skin.skeleton })),
    animations,
    accessors: json.accessors,
    bufferViews: json.bufferViews,
    buffers: json.buffers,
  };
  const packed = packGLB(hierarchy, source.subarray(20 + jsonLength));
  const gltf = await new GLTFLoader().parseAsync(packed.buffer.slice(packed.byteOffset, packed.byteOffset + packed.byteLength), '');
  return { gltf, morphNames };
}

function makeActor(loaded, id, home = { position: [0, 0, 0], yaw: 0 }) {
  return new StylizedActor(loaded.gltf.scene, {
    id,
    clips: loaded.gltf.animations,
    morphNames: loaded.morphNames,
    home,
  });
}

function finiteBones(actor, label) {
  for (const [bone] of actor.rest) {
    const q = bone.quaternion;
    assert.ok(Number.isFinite(q.x + q.y + q.z + q.w), `${label} non-finite ${bone.name}`);
    assert.ok(Math.abs(q.length() - 1) < 1e-4, `${label} non-unit ${bone.name} ${q.length()}`);
    assert.ok(Number.isFinite(bone.position.x + bone.position.y + bone.position.z), `${label} non-finite position`);
  }
  assert.ok(Number.isFinite(actor.group.position.x + actor.group.position.y + actor.group.position.z), `${label} group`);
}

function signature(actor) {
  actor.group.updateMatrixWorld(true);
  const bones = [];
  for (const [bone] of actor.rest) {
    const position = bone.getWorldPosition(new Vector3());
    bones.push({
      q: bone.quaternion.clone(),
      p: [position.x, position.y, position.z],
    });
  }
  return {
    bones,
    group: [actor.group.position.x, actor.group.position.y, actor.group.position.z, actor.group.rotation.y],
    morph: JSON.stringify(actor.morphValues),
  };
}

function sameSignature(a, b, label) {
  assert.equal(a.bones.length, b.bones.length, label);
  assert.equal(a.morph, b.morph, `${label} morphs`);
  for (let i = 0; i < 4; i++) assert.ok(Math.abs(a.group[i] - b.group[i]) < 1e-5, `${label} group ${i}`);
  for (let i = 0; i < a.bones.length; i++) {
    const dot = Math.abs(a.bones[i].q.dot(b.bones[i].q));
    assert.ok(Math.abs(dot - 1) < 1e-5, `${label} quat ${i} dot ${dot}`);
    for (let axis = 0; axis < 3; axis++) {
      assert.ok(Math.abs(a.bones[i].p[axis] - b.bones[i].p[axis]) < 1e-5, `${label} pos ${i}.${axis}`);
    }
  }
}

const loaded = {};
for (const id of ['ganaa', 'tsetsegmaa', 'altan']) loaded[id] = await loadCast(id);
console.log('LOADED', Object.fromEntries(Object.entries(loaded).map(([id, item]) => [id, item.gltf.animations.map(clip => clip.name)])));

const ganaa = makeActor(loaded.ganaa, 'ganaa');
assert.ok(ganaa.diagnostics.includes('bone:jaw'), ganaa.diagnostics.join(','));
assert.ok(ganaa.diagnostics.includes('bone:eye.L'), ganaa.diagnostics.join(','));
assert.ok(ganaa.diagnostics.includes('morph:smile'));
assert.ok(ganaa.diagnostics.includes('morph:frown'));
assert.ok(!ganaa.diagnostics.includes('morph:speak'), ganaa.diagnostics.filter(item => item.startsWith('morph')).join(','));
assert.equal(ganaa.bone('jaw'), null);
assert.equal(ganaa.bone('no-such-bone'), null);
assert.ok(ganaa.diagnostics.includes('bone:no-such-bone'));

// Facing: asset left is +X at yaw 0, and a +Z path walks toward +Z.
ganaa.pose(0);
const leftFoot = ganaa.world('foot_left');
const rightFoot = ganaa.world('foot_right');
assert.ok(leftFoot.x > rightFoot.x, `left foot should sit at +X, got L ${leftFoot.x} R ${rightFoot.x}`);
ganaa.walkTo([[0, 0, 2]], 0.8, 0);
ganaa.pose(1.2);
assert.ok(ganaa.group.position.z - 0 > 0.4, `walk displacement ${ganaa.group.position.z}`);
const arrived = ganaa.group.position.clone();
ganaa.pose(5);
const settled = ganaa.group.position.clone();
ganaa.pose(7.5);
assert.ok(settled.distanceTo(ganaa.group.position) < 1e-4, 'walk should hold the end of the path');
assert.ok(settled.distanceTo(arrived) > 0.4, 'arrival is past the mid-walk sample');
console.log('WALK_OK', settled.toArray().map(value => value.toFixed(3)).join(','));

ganaa.clearDirectives();
const feet = [];
for (const time of [0, 0.5, 1.7, 3.2, 5.5, 8.1]) {
  ganaa.pose(time);
  finiteBones(ganaa, `stand ${time}`);
  feet.push({ L: ganaa.world('foot_left').clone(), R: ganaa.world('foot_right').clone() });
}
for (const sample of feet) {
  assert.ok(sample.L.distanceTo(feet[0].L) < 0.01, `left foot drift ${sample.L.distanceTo(feet[0].L)}`);
  assert.ok(sample.R.distanceTo(feet[0].R) < 0.01, `right foot drift ${sample.R.distanceTo(feet[0].R)}`);
}
console.log('FEET_OK', feet[0].L.toArray().map(value => value.toFixed(3)).join(','));

ganaa.clearDirectives();
ganaa.pose(0);
const pelvisHigh = ganaa.world('pelvis').y;
const supportBefore = ganaa.world('foot_left').clone();
ganaa.kneel(0.1, { side: 'R', dur: 1.1 });
ganaa.pose(1.6);
assert.ok(pelvisHigh - ganaa.world('pelvis').y > 0.05, `pelvis drop ${pelvisHigh - ganaa.world('pelvis').y}`);
assert.ok(ganaa.world('foot_left').distanceTo(supportBefore) < 0.01, `support foot moved ${ganaa.world('foot_left').distanceTo(supportBefore)}`);
console.log('KNEEL_OK', (pelvisHigh - ganaa.world('pelvis').y).toFixed(3));

const cast = {
  ganaa,
  tsetsegmaa: makeActor(loaded.tsetsegmaa, 'tsetsegmaa'),
  altan: makeActor(loaded.altan, 'altan'),
};

function checkReach(actor, label) {
  actor.clearDirectives();
  actor.pose(0);
  const target = actor.world('hand_right').clone().add(new Vector3(0, 0.06, 0.08));
  actor.reach('R', target, { t: 0, dur: 2, weight: 1 });
  actor.pose(1);
  const error = actor.world('hand_right').distanceTo(target);
  assert.ok(error < 0.02, `${label} IK error ${error}`);
  finiteBones(actor, `${label} reach`);
  console.log('IK_OK', label, error.toFixed(5));
}
checkReach(cast.ganaa, 'ganaa');
checkReach(cast.tsetsegmaa, 'tsetsegmaa');

function checkGestures(actor) {
  const id = actor.id;
  for (const name of GESTURE_NAMES) {
    actor.clearDirectives();
    actor.gesture(name, 0);
    const duration = gestureByName(name).dur;
    for (const time of [0, 0.16, duration * 0.45, duration * 0.85, duration + 0.25]) {
      actor.pose(time);
      finiteBones(actor, `${id} ${name} @${time.toFixed(2)}`);
    }
  }
  actor.clearDirectives();
  actor.gesture('nod', 0);
  actor.pose(0);
  const headRest = actor.bone('head').quaternion.clone();
  actor.pose(0.5);
  const turned = actor.bone('head').quaternion.angleTo(headRest);
  assert.ok(turned > 0.05, `${id} nod moved the head ${turned}`);
  console.log('GESTURES_OK', id, 'nod', turned.toFixed(3));
}
for (const actor of Object.values(cast)) checkGestures(actor);

ganaa.clearDirectives();
ganaa.lookAt(new Vector3(1, 1.2, -0.2), 0);
ganaa.pose(0.02);
const early = ganaa.bone('head').quaternion.clone();
ganaa.pose(0.45);
const late = ganaa.bone('head').quaternion.angleTo(early);
assert.ok(late > 0.02, `head should follow the eyes, delta ${late}`);
console.log('LOOK_OK', late.toFixed(3));

ganaa.clearDirectives();
for (const mix of Object.keys(EXPRESSION_MIXES)) {
  ganaa.face(mix, 0.7, 0);
  ganaa.say(0.1, 0.8, 0.6);
  ganaa.pose(0.4);
  finiteBones(ganaa, mix);
}
ganaa.clearDirectives();
ganaa.say(0.2, 1.4, 0.9);
ganaa.pose(0.7);
assert.ok((ganaa.morphValues.speak || 0) > 0.05, `speak morph ${ganaa.morphValues.speak}`);
for (const actor of [cast.ganaa, cast.tsetsegmaa, cast.altan]) {
  actor.clearDirectives();
  actor.pose(0.2);
  const curled = ['middle.01.L', 'thumb.01.L', 'hand_left']
    .filter(name => actor.byCanonical.has(name))
    .map(name => actor.bone(name).quaternion.angleTo(actor.rest.get(actor.bone(name)).q));
  assert.ok(Math.max(...curled) > 0.08, `${actor.id} hand stayed flat ${curled}`);
  actor.gesture('point_at', 0, { side: actor.byCanonical.has('middle.01.L') ? 'L' : 'R' });
  actor.pose(0.45);
  finiteBones(actor, `${actor.id} mirrored point`);
}
ganaa.clearDirectives();
ganaa.setSick(0.8, 0);
ganaa.pose(1.2);
finiteBones(ganaa, 'sick');
console.log('FACE_OK', Object.keys(EXPRESSION_MIXES).join(','));

function scrambled(actor) {
  actor.clearDirectives();
  actor.walkTo([[0.4, 0, 1.1]], 0.7, 0);
  actor.lookAt(new Vector3(0.2, 1.1, 1.4), 0.2);
  actor.face('worried', 0.5, 0);
  actor.gesture('shrug', 0.4);
  actor.say(0.6, 1.1, 0.7);
  actor.setHand('R', 'point', 0.5);
  const times = [0.15, 1.05, 2.4, 0.15];
  const first = [];
  for (const time of times) {
    actor.pose(time);
    first.push(signature(actor));
  }
  for (const time of [2.4, 0.15, 1.05, 3.3, 0.15]) actor.pose(time);
  const again = signature(actor);
  sameSignature(first[0], again, `${actor.id} seek`);
  actor.pose(1.05);
  sameSignature(first[1], signature(actor), `${actor.id} mid`);
}

const stage = new Stage();
for (const actor of Object.values(cast)) stage.addActor(actor);
for (const actor of Object.values(cast)) scrambled(actor);
console.log('SEEK_OK');

// Demo cue sheet on the real rigs: finite, Ganaa travels, then stays while kneeling.
const demo = JSON.parse(await readFile(new URL('../shots/DEMO.json', import.meta.url)));
const demoStage = new Stage();
const demoActors = {};
for (const actorDef of demo.actors) {
  const sheet = JSON.parse(await readFile(new URL(`../shots/${actorDef.sheet}`, import.meta.url)));
  const actor = cast[actorDef.id];
  actor.clearDirectives();
  actor.home.position.set(actorDef.home[0], actorDef.home[1], actorDef.home[2]);
  actor.home.yaw = blockingYaw(actorDef.home, actorDef.face, sheet);
  actor.stage = demoStage;
  demoStage.addActor(actor);
  applyCueSheet(actor, sheet, demoStage);
  demoActors[actorDef.id] = actor;
}
const prop = new Group();
demoStage.addProp('mitten', prop, { holder: 'ganaa', hand: 'R', offset: [0, 0.045, 0.02] });
demoStage.pose(0.4);
const enteredFrom = demoActors.ganaa.group.position.clone();
demoStage.pose(2.0);
assert.ok(demoActors.ganaa.group.position.distanceTo(enteredFrom) > 0.4, 'demo walk');
for (const time of [0, 2.2, 3.4, 4.8, 6.4, 9.6, 11.5]) {
  demoStage.pose(time);
  for (const actor of Object.values(demoActors)) finiteBones(actor, `demo ${actor.id} ${time}`);
}
demoStage.pose(4.2);
assert.ok(demoActors.ganaa.world('pelvis').y < demoActors.ganaa.world('head').y, 'still upright enough to have a head');
demoStage.pose(3.2);
const earlyHolder = prop.parent;
demoStage.pose(4.8);
assert.ok(earlyHolder, 'mitten has a hand before the handoff completes');
assert.notEqual(prop.parent, earlyHolder, 'mitten changes hands during the give');
console.log('DEMO_CUES_OK', demoActors.ganaa.group.position.toArray().map(value => value.toFixed(3)).join(','));

// Two sample orders of the same stage time stay identical.
const forward = {};
demoStage.pose(4.8);
for (const [id, actor] of Object.entries(demoActors)) forward[id] = signature(actor);
demoStage.pose(1.1);
demoStage.pose(9.0);
demoStage.pose(4.8);
for (const [id, actor] of Object.entries(demoActors)) sameSignature(forward[id], signature(actor), `demo order ${id}`);
console.log('STYLIZED_OK');
