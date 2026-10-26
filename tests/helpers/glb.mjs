import { readFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Pose/geometry checks do not require a GPU or image decoder; keep the actual binary mesh and animation data.
export async function readGeometryGLB(id) {
  const source = await readFile(new URL(`../../assets/cast/${id}.glb`, import.meta.url));
  const length = source.readUInt32LE(12);
  const json = JSON.parse(source.toString('utf8', 20, 20 + length));
  json.materials = (json.materials || []).map(material => ({ name: material.name }));
  delete json.images; delete json.textures;
  const encoded = Buffer.from(JSON.stringify(json));
  const padding = (4 - encoded.length % 4) % 4;
  const jsonChunk = Buffer.concat([encoded, Buffer.alloc(padding, 32)]);
  const binary = source.subarray(20 + length);
  const header = Buffer.alloc(20);
  header.write('glTF'); header.writeUInt32LE(2, 4);
  header.writeUInt32LE(20 + jsonChunk.length + binary.length, 8);
  header.writeUInt32LE(jsonChunk.length, 12); header.write('JSON', 16);
  const rebuilt = Buffer.concat([header, jsonChunk, binary]);
  return new GLTFLoader().parseAsync(rebuilt.buffer.slice(rebuilt.byteOffset, rebuilt.byteOffset + rebuilt.byteLength), '');
}
