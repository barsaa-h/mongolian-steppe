import * as THREE from "three";

export const MOTIONS = ["idle", "walk", "wave", "rest"];

export function createCharacterAnimator(model) {
  model.updateMatrixWorld(true);
  const bones = new Map();
  model.traverse((bone) => {
    if (!bone.isBone) return;
    const parentRotation = bone.parent.getWorldQuaternion(new THREE.Quaternion());
    bones.set(bone.name, {
      bone, rest: bone.quaternion.clone(), scale: bone.scale.clone(),
      parentRotation, parentInverse: parentRotation.clone().invert(),
    });
  });
  let motion = "idle";
  let time = 0;
  const delta = new THREE.Quaternion();
  const angles = new THREE.Euler();

  function rotate(name, x = 0, y = 0, z = 0) {
    const item = bones.get(name);
    if (!item) return;
    delta.setFromEuler(angles.set(x, y, z));
    delta.premultiply(item.parentInverse).multiply(item.parentRotation);
    item.bone.quaternion.copy(delta).multiply(item.rest);
  }

  return {
    setMotion(value) {
      if (!MOTIONS.includes(value)) throw new Error(`Unknown motion: ${value}`);
      motion = value;
      time = 0;
    },
    update(dt) {
      if (!Number.isFinite(dt) || dt < 0) throw new Error("Animation delta must be finite and nonnegative");
      time += Math.min(dt, 0.1);
      for (const item of bones.values()) {
        item.bone.quaternion.copy(item.rest);
        item.bone.scale.copy(item.scale);
      }
      if (motion === "rest") return { blink: 0 };
      const breath = Math.sin(time * 2.1);
      rotate("spine", breath * 0.008);
      rotate("head", Math.sin(time * 0.9) * 0.018, Math.sin(time * 0.45) * 0.065);
      const chest = bones.get("chest");
      if (chest) chest.bone.scale.y *= 1 + breath * 0.006;

      if (motion === "walk") {
        const stride = Math.sin(time * 5.4);
        rotate("thigh_left", stride * 0.4);
        rotate("thigh_right", -stride * 0.4);
        rotate("shinL", -Math.max(0, -stride) * 0.58);
        rotate("shinR", -Math.max(0, stride) * 0.58);
        rotate("foot_left", Math.max(0, -stride) * 0.16);
        rotate("foot_right", Math.max(0, stride) * 0.16);
        rotate("upper_arm_left", -stride * 0.23);
        rotate("upper_arm_right", stride * 0.23);
        rotate("chest", 0, stride * 0.035);
      } else if (motion === "wave") {
        rotate("upper_arm_right", -0.2, 0, -2.15);
        rotate("forearm_right", -0.3, Math.sin(time * 5) * 0.22, -0.35);
        rotate("hand_right", 0, 0, Math.sin(time * 6) * 0.16);
        rotate("head", 0, -0.1);
      } else {
        rotate("upper_arm_left", Math.sin(time * 1.4) * 0.018, 0, 0.012);
        rotate("upper_arm_right", -Math.sin(time * 1.4) * 0.018, 0, -0.012);
      }
      const phase = time % 4.7;
      const blink = phase > 3.9 && phase < 4.08 ? Math.sin((phase - 3.9) / 0.18 * Math.PI) : 0;
      return { blink };
    },
  };
}
