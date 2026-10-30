import { Matrix4, PerspectiveCamera, Vector3 } from 'three';
export const fromBlender=([x,y,z])=>new Vector3(x,z,-y);
export function shotCamera(spec) {
  const camera=new PerspectiveCamera(2*Math.atan(spec.sensor_mm/(16/9)/(2*spec.lens_mm))*180/Math.PI,16/9,.025,30);
  // Camera local axes already agree (-Z view, +Y up): convert the world basis only.
  camera.applyMatrix4(new Matrix4().makeRotationX(-Math.PI/2).multiply(new Matrix4().set(...spec.matrix_world.flat())));
  camera.updateMatrixWorld(true);return camera;
}
