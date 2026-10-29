"""Extract release facts from an exported GLB, without implying artistic approval."""
import hashlib
import json
import struct
from datetime import datetime, timezone
from pathlib import Path


def export_facts(path):
    path = Path(path)
    data = path.read_bytes()
    magic, version, length, json_length, chunk_type = struct.unpack_from('<4sIIII', data)
    if magic != b'glTF' or version != 2 or length != len(data) or chunk_type != 0x4e4f534a:
        raise ValueError(f'Invalid GLB: {path}')
    document = json.loads(data[20:20 + json_length])
    clips = [animation.get('name', '') for animation in document.get('animations', [])]
    return {
        'glbSha256': hashlib.sha256(data).hexdigest(),
        'clips': clips,
        'talkCheck': 'Talk_Check' in clips,
        'exportInspectedAt': datetime.now(timezone.utc).isoformat(),
    }
