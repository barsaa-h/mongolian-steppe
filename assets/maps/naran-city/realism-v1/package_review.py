"""Assemble unchanged render pairs, a readable catalog and measured delivery report."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,platform
ROOT=Path(__file__).resolve().parent
read=lambda f:json.loads((ROOT/f).read_text())
qa=read('qa-report.json');blend=ROOT/'Naran-City-Realism-v001.blend'
sha=hashlib.sha256(blend.read_bytes()).hexdigest()
assert qa['passed'] and qa['source_sha256']==sha,'Reopen and verify the final saved scene first.'
names=['aerial','apartment','ger-district','market','entrance','street','ger-street','agriculture']
times=read('after-render-times.json');beforetimes=read('before-render-times.json')
assert set(times['seconds'])==set(names)
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(fontpath,24);small=ImageFont.truetype(fontpath,18)
out=ROOT/'previews/comparisons';out.mkdir(exist_ok=True)
sheet=Image.new('RGB',(2560,80+4*438),'#192521');sd=ImageDraw.Draw(sheet)
sd.text((20,12),'NARAN v001 — identical camera positions / BEFORE left, AFTER right',font=font,fill='#f2ede0')
sd.text((20,45),'Lighting and materials change. Native art draft; not actor blocking or final art approval.',font=small,fill='#c6ceb9')
for index,name in enumerate(names):
    ims=[]
    for stage in ['before','after']:
        p=ROOT/'previews'/stage/(name+'.png');assert p.exists()
        if stage=='after':assert p.stat().st_mtime>blend.stat().st_mtime,'Stale after render: '+name
        im=Image.open(p).convert('RGB');assert im.size==(1280,800);ims.append(im)
    pair=Image.new('RGB',(2560,854),'#192521');d=ImageDraw.Draw(pair)
    d.text((18,12),name.replace('-',' ').upper()+' / BEFORE',font=font,fill='#f2ede0');d.text((1298,12),'AFTER / Naran realism v001',font=font,fill='#e3c87c')
    pair.paste(ims[0],(0,54));pair.paste(ims[1],(1280,54));pair.save(out/(name+'.jpg'),quality=94)
    x=(index%2)*1280;y=80+(index//2)*438
    for col,im in enumerate(ims):sheet.paste(im.resize((640,400),Image.Resampling.LANCZOS),(x+col*640,y+30))
    sd.text((x+12,y+3),name.replace('-',' ').upper()+' / BEFORE',font=small,fill='#f2ede0');sd.text((x+652,y+3),'AFTER',font=small,fill='#e3c87c')
sheet.save(out/'comparison-sheet.jpg',quality=93)
manifest=read('city-manifest.json');catalog=read('variant-catalog.json');props=read('prop-catalog.json')
lines=['# Building and prop catalog — v001','',
'Existing project meshes remain the source for the town buildings. New modules are generic low-poly artistic interpretations, not verified historical product models. All dimensions below are metres.','',
'## Reused source families','',
'The inherited instance register contains the following 17 types. Counts include retained/hidden originals (notably fences) and are not a count of rendered assets. Meshes and the original master remain available.','',
'| Family | Instance register |','|---|---:|']
for key,count in qa['checks']['existing_assets_reused']['instances'].items():lines.append(f'| {key} | {count} |')
lines+=['','## New shared prop modules','','Each module is built once and linked into households or work yards; small contextual additions are batched.','',
'| Module | Width × depth × height | Triangles / shared mesh | Purpose |','|---|---|---:|---|']
tri={c['variant']:c.get('triangles') for c in catalog if c.get('triangles') is not None}
for p in props:
    d=p['dimensions_m'];dims=' × '.join(f'{d[k]:g}' for k in ['width','depth','height'])
    lines.append(f"| {p['name']} | {dims} | {tri[p['name']]} | {p['purpose']} |")
lines+=['','## Constrained household treatments','','Six recurring households: timber care, ger/fuel, repair trade, mixed family, brick/garden and patched extension. Existing main dwelling type is retained; a family name is a treatment category and does not convert every existing house into that construction type. All plots have fuel, water storage, a gate/door link and sanitation. Sheds, gardens, workbenches and bikes follow the family. Eight ger plots also receive a timber house. Wood/painted timber uses separate boards; rust metal remains panelled.','',
'## Apartment combinations actually authored','','The original three/four/five-floor kit silhouettes remain recognizable. Five facade treatments and three roof treatments are combined across 17 blocks; these are additive variants, not 17 distinct building series. Roof vents fit the actual 2.8 m-floor source kits.','',
'| Existing kit / treatment family | XY | Actual additions |','|---|---|---|']
for c in catalog:
    if 'treatments' in c:
        xy=', '.join(f'{v:g}' for v in c['location']);lines.append(f"| {c['variant']} | {xy} | {'; '.join(c['treatments'])} |")
lines+=['','## Commerce, roads and occupation','','Four reused market shops + canteen + two kiosks + converted apartment window. Uses and exact coordinates are in `city-manifest.json` and the master-map inset. Road materials separate old asphalt, gravel and compacted dirt. Local footpaths, repair patches, frost pockets, institution gates and agricultural work surfaces are contextual batched meshes.','',
'No traffic signals, LEDs, modern branded fleets or destruction modules were added. Exact vehicle years, shop goods/lettering, architectural series and final close-up finish still need review.']
(ROOT/'CATALOG.md').write_text('\n'.join(lines)+'\n')
base=read('baseline-audit.json');geom=qa['geometry'];perf=qa['performance']
lines=['# Native performance and verification — v001','',f"Final saved file SHA-256: `{sha}`.",'',
f"Blender {perf['blender']}, Linux {platform.machine()}; background Eevee, 1280 × 800. This is an observed run on this host, not a cross-machine benchmark. Native validation used two CPU threads; final comparison rendering used four. GPU/driver identity and interactive viewport frame rate were not measured.",'',
'| Measurement | Result |','|---|---:|',f"| Compressed native file | {blend.stat().st_size/1024**2:.2f} MiB |",f"| Original scene mesh objects, including hidden assets | {base['meshes']:,} |",f"| Original triangles, including hidden assets | {base['triangles']:,} |",f"| Updated mesh objects, including hidden assets | {geom['mesh_objects_all']:,} |",f"| Updated visible mesh objects | {geom['visible_mesh_objects']:,} |",f"| Updated unique visible mesh datablocks | {geom['unique_visible_meshes']:,} |",f"| Updated visible triangles | {geom['triangles_visible']:,} |",f"| Read-only native validation | {perf['validation_seconds']:.3f} s |",f"| Validation peak resident memory | {perf['peak_rss_mib']:.1f} MiB |",f"| Final eight-render peak resident memory | {times['peak_rss_mib']:.1f} MiB |",f"| Final render calls, total (excludes load/exit overhead) | {sum(times['seconds'].values()):.3f} s |",'',
'Original and updated triangle scopes differ (all versus visible); do not treat these rows as a measured percentage increase. Timber-board silhouettes cost additional geometry; linked prop meshes and batching limit new object overhead. Hidden source/replaced assets remain editable and inflate total datablock counts.','',
'| Identical camera | Before render seconds | After render seconds |','|---|---:|---:|']
for name in names:lines.append(f"| {name} | {beforetimes['seconds'][name]:.3f} | {times['seconds'][name]:.3f} |")
lines+=['','Times include ordinary scene/render preparation and concurrent host activity. They are not a controlled speed comparison; the before and after processes ran at different times.','',
'## Verification evidence','',f"- **{len(qa['checks'])}/{len(qa['checks'])} reopened native checks passed** for the SHA above. See `qa-report.json` for full measurements and sampling limits.",
f"- All 20 anchor XYZ and all 60 original road names/widths/centerlines preserved; two connected farm tracks added. Maximum sampled grade {qa['checks']['road_grade']['max_grade_percent']:.2f}% against the 8% layout limit.",
f"- {qa['checks']['new_solid_details_clear_vehicle_routes']['samples']:,} sampled body-lane rays found no new solid obstruction; 252 inherited utility poles remain clear of streets.",
'- All 34 roof vents supported; the school path avoids the school/workshop shells; new household modules fit their own parcel polygons; every recorded gate approach stays outside its own yard, and its full 1 m strip clears neighboring yard polygons.',
'- Original native master and byte-identical backup retain SHA `d2ca395f9c1642cb8fb7aa6e2253b4b4e1b19839d1eefddc5734078c1a19f9c0`.',
'- Seven layout unit tests and the 14-module deterministic self-check passed. Existing Episode 1 native/export preservation checker passed. Project Node test suite passed 73/73 tests; the realism pass does not change runtime code.',
'- Eight matching before/after images exist and were visually inspected; independent reviews and corrections are retained alongside this report.',
'', '## Organization and practical limits','',
'New work is separated into landscape, parcels, apartments, services, institutions and agricultural/work-yard collections. Linked modules share geometry; batched mesh islands can be edited by purpose/material. Packed images keep the native file portable. Existing and new templates plus replaced original details are hidden, not discarded.','',
'This scene is heavier than the compact playable map. No runtime export replacement, LOD/streaming, actor crowd performance, interactive viewport FPS, exhaustive collisions or full door/vehicle dynamics were measured. Institutions remain exterior shells. Numerical checks do not approve historical specificity, art, medical timing, actor blocking or story continuity.']
(ROOT/'PERFORMANCE.md').write_text('\n'.join(lines)+'\n')
delivery={'version':'Naran-City-Realism-v001','status':'exterior art draft; human approval outstanding','scene':blend.name,'scene_sha256':sha,'original_master_sha256':base['sha256'],'native_checks_passed':len(qa['checks']),'comparison_views':names,'resolution':times['resolution'],'preserved':'20 landmark XYZ, 60 original roads, Episode 1 arrival/entry and original source sets','limits':'CHANGES.md','render_files':{name:hashlib.sha256((ROOT/'previews/after'/(name+'.png')).read_bytes()).hexdigest() for name in names}}
(ROOT/'delivery-manifest.json').write_text(json.dumps(delivery,indent=2)+'\n')
print('Packaged eight matching pairs, contact sheet, catalog and measured report for',sha)
