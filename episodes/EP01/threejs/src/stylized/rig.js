// Canonical rig names. Today's cast only has part of this; missing names are skipped.
// GLTFLoader strips dots out of Object3D.name and keeps the authored name on userData.name.

const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'];
const FINGER_PREFIX = { thumb: 'thumb', index: 'f_index', middle: 'f_middle', ring: 'f_ring', pinky: 'f_pinky' };

function fingerAliases(finger, index, side) {
  const num = String(index).padStart(2, '0');
  const names = [`${finger}.${num}.${side}`, `${FINGER_PREFIX[finger]}.${num}.${side}`];
  if (finger === 'thumb' && index === 1) names.push(`thumb.${side}`);
  if (finger === 'thumb' && index === 2) names.push(`thumb.${side}_end`);
  return names;
}

function buildAliases() {
  const aliases = {
    pelvis: ['pelvis', 'hips', 'root'],
    spine: ['spine', 'spine01', 'spine05'],
    chest: ['chest', 'spine02', 'spine03'],
    neck: ['neck', 'neck01'],
    head: ['head'],
    jaw: ['jaw'],
    'eye.L': ['eye.L', 'eye_L'],
    'eye.R': ['eye.R', 'eye_R'],
    shoulder_left: ['shoulder_left', 'shoulder.L', 'clavicle.L'],
    shoulder_right: ['shoulder_right', 'shoulder.R', 'clavicle.R'],
    upper_arm_left: ['upper_arm_left', 'upper_arm.L', 'upperarm01.L'],
    upper_arm_right: ['upper_arm_right', 'upper_arm.R', 'upperarm01.R'],
    forearm_left: ['forearm_left', 'forearm.L', 'lowerarm01.L'],
    forearm_right: ['forearm_right', 'forearm.R', 'lowerarm01.R'],
    hand_left: ['hand_left', 'hand.L', 'wrist.L'],
    hand_right: ['hand_right', 'hand.R', 'wrist.R'],
    thigh_left: ['thigh_left', 'thigh.L', 'upperleg01.L'],
    thigh_right: ['thigh_right', 'thigh.R', 'upperleg01.R'],
    'shin.L': ['shin.L', 'shin_left', 'lowerleg01.L'],
    'shin.R': ['shin.R', 'shin_right', 'lowerleg01.R'],
    foot_left: ['foot_left', 'foot.L'],
    foot_right: ['foot_right', 'foot.R'],
    'toe.L': ['toe.L', 'toe1-1.L'],
    'toe.R': ['toe.R', 'toe1-1.R'],
  };
  for (const finger of FINGERS) {
    for (const index of [1, 2, 3]) {
      for (const side of ['L', 'R']) aliases[`${finger}.${String(index).padStart(2, '0')}.${side}`] = fingerAliases(finger, index, side);
    }
  }
  return aliases;
}

export const ALIASES = buildAliases();
export const CONTRACT_BONES = Object.keys(ALIASES);
export const CONTRACT_MORPHS = ['speak', 'blink', 'fear', 'hunger', 'resolve', 'gaze', 'smile', 'frown'];
export const HEAD_BONES = new Set(['neck', 'head', 'jaw', 'eye.L', 'eye.R']);

const PAIRS = [
  ['shoulder_left', 'shoulder_right'],
  ['upper_arm_left', 'upper_arm_right'],
  ['forearm_left', 'forearm_right'],
  ['hand_left', 'hand_right'],
  ['thigh_left', 'thigh_right'],
  ['shin.L', 'shin.R'],
  ['foot_left', 'foot_right'],
  ['toe.L', 'toe.R'],
  ['eye.L', 'eye.R'],
];

export function sideBones(side) {
  const left = side === 'L';
  return {
    side,
    shoulder: left ? 'shoulder_left' : 'shoulder_right',
    upper: left ? 'upper_arm_left' : 'upper_arm_right',
    fore: left ? 'forearm_left' : 'forearm_right',
    hand: left ? 'hand_left' : 'hand_right',
    thigh: left ? 'thigh_left' : 'thigh_right',
    shin: left ? 'shin.L' : 'shin.R',
    foot: left ? 'foot_left' : 'foot_right',
    toe: left ? 'toe.L' : 'toe.R',
    sign: left ? 1 : -1,
  };
}

export function mapBoneName(name, authoredSide, side) {
  if (!side || !authoredSide || side === authoredSide) return { name, mirrored: false };
  let mapped = name;
  for (const [left, right] of PAIRS) {
    if (name === left) mapped = right;
    else if (name === right) mapped = left;
  }
  if (mapped === name && name.endsWith('.L')) mapped = `${name.slice(0, -2)}.R`;
  else if (mapped === name && name.endsWith('.R')) mapped = `${name.slice(0, -2)}.L`;
  return { name: mapped, mirrored: mapped !== name || side !== authoredSide };
}

export function indexRig(group) {
  const byOriginal = new Map();
  const bones = [];
  group.traverse(object => {
    if (!object.isBone) return;
    bones.push(object);
    const original = object.userData.name || object.name;
    byOriginal.set(original, object);
    byOriginal.set(object.name, object);
  });
  const byCanonical = new Map();
  const missing = [];
  for (const name of CONTRACT_BONES) {
    let found = null;
    for (const alias of ALIASES[name]) {
      if (byOriginal.has(alias)) { found = byOriginal.get(alias); break; }
    }
    if (found) byCanonical.set(name, found);
    else missing.push(name);
  }
  return { bones, byCanonical, missing };
}
