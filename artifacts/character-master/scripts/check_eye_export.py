"""Check that the GLB preserves the original eye image and brow transparency."""
import json
import struct
import sys
from pathlib import Path

path = Path(sys.argv[1])
with path.open('rb') as stream:
    header = stream.read(20)
    assert header[:4] == b'glTF' and header[16:20] == b'JSON', 'Not a GLB JSON chunk'
    gltf = json.loads(stream.read(struct.unpack('<I', header[12:16])[0]))

materials = gltf['materials']
eye = next(material for material in materials if material['name'].startswith(('brown |', 'brownlight |', 'blue |', 'bluegreen |', 'grey |', 'green |')))
brow = next(material for material in materials if material['name'].startswith('eyebrow001 |'))
texture = gltf['textures'][eye['pbrMetallicRoughness']['baseColorTexture']['index']]
image = gltf['images'][texture['source']]
assert image['name'] in {name + '_eye' for name in ('brown', 'brownlight', 'blue', 'bluegreen', 'grey', 'green')}, 'Eye image was replaced by an artifact-prone bake'
assert brow['alphaMode'] == 'BLEND', 'Brow texture edges were clipped'
print('EYE_EXPORT_OK')
