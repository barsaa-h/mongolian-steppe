import * as THREE from "three";

const UP = new THREE.Vector3(0, 1, 0);
const RUN = 6.4;
const SPRINT = 12;
const FLY = 18;
const FLY_SPRINT = 34;

// FBX rest pose: thigh_right sits at −x, thigh_left at +x, so
// up × (right − left) = +z. The mounted model is not rotated, so the
// character group's local +z is the face. Facing direction d uses
// rotation.y = atan2(d.x, d.z).
export const CHARACTER_FRONT = new THREE.Vector3(0, 0, 1);

export function flatBasis(camera) {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  const lookY = forward.y;
  forward.y = 0;
  if (forward.lengthSq() < 1e-8) forward.set(0, 0, -1);
  else forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, UP);
  return { forward, right, lookY };
}

export function exploreStep(state, input, dt, groundAt, blocked) {
  const flying = input.flyToggle ? !state.flying : state.flying;
  const speed = flying
    ? (input.sprint ? FLY_SPRINT : FLY)
    : (input.sprint ? SPRINT : RUN);
  let mx = input.flatForward.x * input.forward + input.flatRight.x * input.strafe;
  let mz = input.flatForward.z * input.forward + input.flatRight.z * input.strafe;
  const planar = Math.hypot(mx, mz);
  if (planar > 1) {
    mx /= planar;
    mz /= planar;
  }
  let x = state.x + mx * speed * dt;
  let z = state.z + mz * speed * dt;
  if (!flying && blocked && planar > 0.05 && blocked(x, z)) {
    if (!blocked(x, state.z)) z = state.z;
    else if (!blocked(state.x, z)) x = state.x;
    else {
      x = state.x;
      z = state.z;
    }
  }
  x = THREE.MathUtils.clamp(x, -210, 210);
  z = THREE.MathUtils.clamp(z, -210, 210);
  const ground = groundAt(x, z);
  let y = state.y;
  if (flying) {
    const climb = input.ascend + Math.max(0, input.lookY) * Math.max(0, input.forward);
    y += climb * speed * dt;
    y = Math.max(ground + 0.04, Math.min(90, y));
  } else if (state.y > ground + 0.2) {
    y = Math.max(ground, state.y - 22 * dt);
  } else {
    y = ground;
  }
  const moving = planar > 0.08;
  const yaw = moving ? Math.atan2(mx, mz) : state.yaw;
  return {
    x,
    y,
    z,
    yaw,
    flying,
    moving,
    motion: !flying && moving && y <= ground + 0.08 ? "walk" : "idle",
  };
}
