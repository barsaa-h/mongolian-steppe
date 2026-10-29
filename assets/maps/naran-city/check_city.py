"""Check the saved Naran layout and its recorded geometry evidence."""
from pathlib import Path
import csv, hashlib, json, struct

ROOT=Path(__file__).resolve().parent
assert (ROOT/'Naran-City-Master.blend').is_file(), 'Full-size Naran native source is missing'
report=json.loads((ROOT/'qa-report.json').read_text())
assert report['passed'] and all(c['passed'] for c in report['checks'].values()),report
assert hashlib.sha256((ROOT/'Naran-City-Master.blend').read_bytes()).hexdigest()==report['source_sha256'], 'Native source changed since QA'
registry=ROOT.parents[2]/'artifacts/character-master/sources/world/data/naran_locations.csv'
assert hashlib.sha256(registry.read_bytes()).hexdigest()==report['registry_sha256'], 'Location source changed since QA'
assert hashlib.sha256((ROOT/'layout.py').read_bytes()).hexdigest()==report['layout_source_sha256'], 'Street/elevation source changed since QA'
assert len(report['locations'])==20
for row in csv.DictReader(registry.open(encoding='utf-8-sig')):
    actual=report['locations'][row['location_id']]
    assert abs(actual[0]-float(row['x_m_east']))<.01 and abs(actual[1]-float(row['y_m_north']))<.01
data=(ROOT/'glb/naran-city.glb').read_bytes()
assert hashlib.sha256(data).hexdigest()==report['export_sha256'], 'GLB changed since QA'
magic,version,size=struct.unpack_from('<4sII',data)
assert magic==b'glTF' and version==2 and size==len(data)
n,kind=struct.unpack_from('<II',data,12);doc=json.loads(data[20:20+n])
assert len(doc['scenes'])==1 and doc['scenes'][0]['name']=='NARAN_City' and doc.get('meshes')
assert not doc.get('skins') and not doc.get('cameras')
assert all('bufferView' in im or im.get('uri','').startswith('data:') for im in doc.get('images',[])), 'Export has an external image dependency'
print(f"Naran source, 20 locations, static GLB and {len(report['checks'])} native layout checks pass.")
