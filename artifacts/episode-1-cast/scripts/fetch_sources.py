"""Fetch selected original CC0 core files using ZIP range requests and CRC verification."""
import concurrent.futures
import hashlib
import io
import json
import struct
import urllib.request
import zipfile
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DEST = ROOT / 'assets/sources/makehuman-core'
URL = 'https://files.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip'
SIZE = 280737770
PREFIXES = [f'{category}/{name}/' for category, names in {
    'skins': ['middleage_asian_male','middleage_asian_female','old_asian_male','old_asian_female','middleage_caucasian_female','young_caucasian_male'],
    'hair': ['short01','short03','short04','bob02','braid01','long01','ponytail01'],
    'clothes': ['male_casualsuit03','male_casualsuit04','male_casualsuit05','male_casualsuit06','male_worksuit01','male_elegantsuit01','female_elegantsuit01','female_sportsuit01'],
    'eyes': ['high-poly'],
}.items() for name in names]

def read_range(first, last):
    request = urllib.request.Request(URL, headers={'Range': f'bytes={first}-{last}'})
    with urllib.request.urlopen(request, timeout=90) as response:
        assert response.status == 206, 'Range support is required'
        result = response.read()
    assert len(result) == last - first + 1
    return result

def fetch(info):
    destination = DEST / info.filename
    assert destination.resolve().is_relative_to(DEST.resolve())
    if destination.exists():
        data = destination.read_bytes()
        assert len(data) == info.file_size and zlib.crc32(data) == info.CRC
    else:
        start = info.header_offset + SIZE - 65536
        block = read_range(start, min(SIZE-1, start + info.compress_size + 1023))
        signature, _, flag, method, _, _, crc, _, _, name_len, extra_len = struct.unpack_from('<4s5H3L2H', block)
        assert signature == b'PK\x03\x04' and not flag & 1
        compressed = block[30+name_len+extra_len:30+name_len+extra_len+info.compress_size]
        data = zlib.decompress(compressed, -15) if method == 8 else compressed
        assert len(data) == info.file_size and zlib.crc32(data) == info.CRC, info.filename
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
    print(info.filename, flush=True)
    return {'path': info.filename, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}

if __name__ == '__main__':
    tail = read_range(SIZE-65536, SIZE-1)
    archive = zipfile.ZipFile(io.BytesIO(tail))
    selected = [info for info in archive.infolist() if not info.is_dir() and any(info.filename.startswith(prefix) for prefix in PREFIXES)]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        files = list(pool.map(fetch, selected))
    (DEST / 'episode-1-file-manifest.json').write_text(json.dumps({'url': URL, 'archiveBytes': SIZE, 'license': 'CC0-1.0', 'files': files}, indent=2)+'\n')
    print('SOURCES_OK', len(files), flush=True)
