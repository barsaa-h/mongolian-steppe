"""Build selected actors, at most three background Blender processes at a time."""
import concurrent.futures
import json
import subprocess
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
ids=sys.argv[1:] or [p['id'] for p in json.loads((ROOT/'cast.json').read_text())]
sys.path.insert(0,str(REPO/'artifacts/character-master/scripts'))
from dna import compile_dna,validate_dna,diversity_report
characters=[validate_dna(json.loads(p.read_text())) for p in sorted((ROOT/'dna').glob('*.json'))]
report=diversity_report(characters)
(ROOT/'diversity-report.json').write_text(json.dumps(report,indent=2)+'\n')
if not report['passed']:raise ValueError('Cast faces too similar; inspect diversity-report.json')
profiles={d['id']:compile_dna(d) for d in characters}
old=json.loads((ROOT/'cast.json').read_text())
(ROOT/'cast.json').write_text(json.dumps([{k:v for k,v in profiles[p['id']].items() if k!='base'} for p in old],ensure_ascii=False,indent=2)+'\n')
logs=ROOT/'build-logs';logs.mkdir(exist_ok=True)
def build(id):
    with (logs/(id+'.log')).open('w') as log:
        result=subprocess.run(['blender','-b','--factory-startup','--python-exit-code','1','-t','6','--python',str(ROOT/'scripts/build_actor.py'),'--',id],cwd=REPO,stdout=log,stderr=subprocess.STDOUT)
    assert result.returncode==0 and 'EPISODE_ACTOR_OK' in (logs/(id+'.log')).read_text(),f'{id} failed; read build-logs/{id}.log'
    print('BUILT',id,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    list(pool.map(build,ids))
