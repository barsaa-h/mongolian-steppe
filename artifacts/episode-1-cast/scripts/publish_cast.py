"""Publish built DNA actors: refresh their canonical folders and the runtime GLBs the film loads.

    python3 artifacts/episode-1-cast/scripts/publish_cast.py --from ~/.cache/khaniad-builds --tag r1 [id ...]

For each id (default: every DNA file) the build at <from>/<id>-<tag> must match the current DNA
fingerprint. Its folder replaces artifacts/episode-1-cast/<id>/ (generated output only), and its
character.glb is copied to assets/cast/dna/<id>.glb and listed in assets/cast/dna/manifest.json,
which src/cast.js reads for loadCharacter({assetVersion: "dna"}). Design approval stays in the DNA.
"""
import argparse
import hashlib
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
sys.path.insert(0, str(REPO / 'artifacts/character-master/scripts'))
from config import OUTPUT_MARKER
from dna import fingerprint, validate_dna

RUNTIME = REPO / 'assets/cast/dna'


def kind(dna):
    if dna['base'] == 'child':
        return 'child'
    sex = 'Male' if dna['sex'] == 'male' else 'Female'
    return ('teen' if dna['age']['years'] < 18 else 'adult') + sex


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--from', dest='source', type=Path, required=True)
    parser.add_argument('--tag', required=True)
    parser.add_argument('ids', nargs='*')
    args = parser.parse_args()
    ids = args.ids or sorted(p.stem for p in (ROOT / 'dna').glob('*.json'))
    RUNTIME.mkdir(parents=True, exist_ok=True)
    manifest_path = RUNTIME / 'manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    for cast_id in ids:
        dna = validate_dna(json.loads((ROOT / 'dna' / f'{cast_id}.json').read_text()))
        build = args.source.expanduser() / f'{cast_id}-{args.tag}'
        built = json.loads((build / 'dna.json').read_text())
        if fingerprint(built) != fingerprint(dna):
            raise SystemExit(f'{cast_id}: build {build} does not match the current DNA; rebuild it first')
        if not (build / 'qa' / 'report.json').exists():
            raise SystemExit(f'{cast_id}: no QA report in {build}; run qa_actor.py first')
        canonical = ROOT / cast_id
        if canonical.exists():
            if any(canonical.iterdir()) and not (canonical / OUTPUT_MARKER).is_file():
                raise SystemExit(f'{cast_id}: {canonical} is not a generated output folder; not replacing it')
            shutil.rmtree(canonical)
        shutil.copytree(build, canonical)
        glb = RUNTIME / f'{cast_id}.glb'
        shutil.copyfile(build / 'character.glb', glb)
        data = glb.read_bytes()
        manifest[cast_id] = {
            'name': dna['name'], 'file': glb.name, 'kind': kind(dna), 'episodes': [dna['episode']],
            'category': dna['category'], 'wardrobe': dna['clothing']['wardrobe'], 'heightM': dna['body']['height_m'],
            'age': dna['script_age'] if dna['script_age'] is not None else dna['age']['years'], 'traits': dna['signature_traits'],
            'review': dna['review'], 'dnaHash': fingerprint(dna), 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data),
        }
        print('published', cast_id, round(len(data) / 1e6, 1), 'MB')
    manifest_path.write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
