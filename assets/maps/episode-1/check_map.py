from pathlib import Path
import json,struct,hashlib
root=Path('/home/barsaa/mongolian-steppe/assets/maps/episode-1')
assert (root/'EP01-Map.blend').is_file(), 'Episode 1 map source is missing'
report=json.loads((root/'qa-report.json').read_text())
assert report['passed'],report
assert hashlib.sha256((root/'EP01-Map.blend').read_bytes()).hexdigest()==report['source_sha256'], 'Native source changed since QA'
assert set(report['scenes'])=={'EP01_Cafe','EP01_BorderRoad','EP01_FreightYard','EP01_Apartment'}
for scene in report['scenes'].values():
 assert scene['finite_geometry'] and scene['packed_textures']
 assert scene['max_object_triangles']<=3000
for key in ['cafe_front_door','cafe_attack_route','cafe_escape_route','cafe_staff_exit','apartment_bedroom_to_living','apartment_exit_route','apartment_entry_support','apartment_stair','yard_boxcar_opening','yard_office_sightline','border_road_width']:
 assert report['clearances'][key]['passed'],(key,report['clearances'][key])
for name in ['cafe','border-road','freight-yard','apartment']:
 data=(root/'glb'/f'{name}.glb').read_bytes();magic,version,size=struct.unpack_from('<4sII',data)
 assert magic==b'glTF' and version==2 and size==len(data)
 n,kind=struct.unpack_from('<II',data,12);doc=json.loads(data[20:20+n])
 assert doc.get('meshes') and not doc.get('skins')
 expected={'cafe':'EP01_Cafe','border-road':'EP01_BorderRoad','freight-yard':'EP01_FreightYard','apartment':'EP01_Apartment'}[name]
 assert len(doc.get('scenes',[]))==1 and doc['scenes'][0].get('name')==expected, f'{name} contains unrelated scenes'
 entry=next(x for x in report['scenes'].values() if x['export']==f'glb/{name}.glb')
 assert hashlib.sha256(data).hexdigest()==entry['export_sha256'], 'GLB changed since QA'
print('Episode 1 map source, four GLBs, geometry budgets and physical route checks pass.')
