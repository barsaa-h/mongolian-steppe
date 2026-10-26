"""Render all master preset QA passes and assemble the default-character lineup."""
import concurrent.futures
import html
import json
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
REPO = ROOT.parents[1]
sys.path.insert(0, str(HERE))
from dna import FACE_CONTROLS, diversity_report

IDS = ['default', 'male', 'heavy', 'slim-tall', 'child']
NAMES = {'default': 'Default', 'male': 'Male', 'heavy': 'Heavy', 'slim-tall': 'Slim Tall', 'child': 'Child'}
output = ROOT / 'qa'

def recipe(folder):
    return json.loads((folder / 'character.json').read_text())

def face_profile(recipe, id):
    """Expand a partial recipe face into the comparable full control vector the distance metric expects."""
    face = {name: recipe.get('face', {}).get(name, 0) for name in FACE_CONTROLS}
    macro_age = recipe['body']['age']
    years = round(1 + 48 * macro_age if macro_age <= .5 else 25 + (macro_age - .5) * 130)
    base = 'child' if macro_age < .3 else 'elder' if macro_age > .75 else 'adult'
    return {'id': id, 'face': face, 'base': base, 'age': {'years': years}, 'body': {'height_m': recipe['height_m'], 'weight': recipe['body']['weight']}}

def build(id):
    log_path = ROOT / 'build-logs' / f'{id}-qa.log'
    log_path.parent.mkdir(exist_ok=True)
    with log_path.open('w') as log:
        subprocess.run(['blender', '-b', '--factory-startup', '--python-exit-code', '1', '-t', '4', '--python', str(HERE / 'qa_actor.py'), '--', str(ROOT / id)], cwd=REPO, stdout=log, stderr=subprocess.STDOUT, check=True)
    print('QA', id, flush=True)

if __name__ == '__main__':
    output.mkdir(exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(build, IDS))
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
    lineup = Image.new('RGB', (1024, 304 * ((len(IDS) + 3) // 4)), (24, 28, 28))
    draw = ImageDraw.Draw(lineup)
    reports = []
    expressions = ['smile', 'frown', 'blink', 'viseme_A', 'viseme_E', 'viseme_O', 'viseme_M']
    cards = []
    for i, id in enumerate(IDS):
        name = NAMES[id]
        x, y = (i % 4) * 256, (i // 4) * 304
        photo = Image.open(ROOT / id / 'qa' / 'front.png').convert('RGB').resize((256, 256), Image.Resampling.LANCZOS)
        lineup.paste(photo, (x, y))
        draw.text((x + 10, y + 261), name, font=font, fill=(225, 224, 215))
        draw.text((x + 10, y + 285), id, font=small, fill=(163, 173, 165))
        report = json.loads((ROOT / id / 'qa' / 'report.json').read_text())
        assert report['passed'], f"{id} QA failed: {report}"
        reports.append({'id': id, **report})
        def image(export):
            return f'<a href="../{id}/qa/{export}.png"><img loading="lazy" alt="{html.escape(name)} · {export}" src="../{id}/qa/{export}.png"></a>'
        traits = ', '.join(f'{control.replace("_", " ")} {value:+.2f}' for control, value in sorted(recipe(ROOT / id).get('face', {}).items(), key=lambda item: abs(item[1]), reverse=True)[:3])
        cards.append(f'<article><h2>{html.escape(name)}</h2><p>Signature face controls: {html.escape(traits)}</p><div class="views">' + ''.join(image(n) for n in ['front', 'three-quarter', 'profile']) + f'</div><details><summary>Expressions and mouth shapes</summary><div class="expressions">' + ''.join(image(n) for n in expressions) + '</div></details></article>')
    lineup.save(output / 'lineup.png')
    ImageOps.grayscale(lineup).save(output / 'lineup-grayscale.png')
    profiles = [face_profile(recipe(ROOT / id), id) for id in IDS]
    diversity = diversity_report(profiles)
    assert diversity['passed'], 'Default characters are too close; change the named regions'
    (output / 'distance-report.json').write_text(json.dumps(diversity, indent=2) + '\n')
    rows = ''.join(f'<tr><td>{p["a"]}</td><td>{p["b"]}</td><td>{p["distance"]:.4f}</td><td>{", ".join(p["changeGroups"])}</td></tr>' for p in diversity['pairs'])
    document = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Character master · Default face QA</title><style>:root{color-scheme:dark;font:15px system-ui;background:#161c1b;color:#e0e3da}body{max-width:1200px;margin:auto;padding:28px}a{color:#c4d4b6}h1{font:36px Georgia,serif}p{line-height:1.6;color:#b9c5b7}img{width:100%;display:block}article{border-top:1px solid #465345;padding:22px 0}.views{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.expressions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}summary{padding:20px 0;cursor:pointer}table{border-collapse:collapse;width:100%;font-size:12px}th,td{text-align:left;padding:8px;border-bottom:1px solid #465345}.scroll{overflow:auto}.lineups{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:650px){body{padding:16px}.lineups{grid-template-columns:1fr}.expressions{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><header><a href="../">← Master inspector</a><h1>Default characters without costume</h1><p>All five presets use the same matte materials and framing, with hair and clothing hidden. The grayscale lineup removes color cues. Identity comes from the face controls alone.</p><p>Technical checks passed. Creative approval remains pending human review.</p></header><div class="lineups"><a href="lineup.png"><img alt="Matching-material bald head lineup" src="lineup.png"></a><a href="lineup-grayscale.png"><img alt="Grayscale matching-material bald head lineup" src="lineup-grayscale.png"></a></div><h2>Closest face parameter pairs</h2><p>Equal-weight RMS by facial region; age, ancestry, skin, hair and clothing excluded.</p><div class="scroll"><table><thead><tr><th>Character</th><th>Nearest character</th><th>Distance</th><th>Most similar regions</th></tr></thead><tbody>''' + rows + '''</tbody></table></div><p><a href="distance-report.json">Complete distance report</a></p>''' + ''.join(cards) + '</html>'
    (output / 'index.html').write_text(document)
    (output / 'report.json').write_text(json.dumps({'passed': True, 'characters': reports, 'diversityPassed': diversity['passed'], 'humanReview': 'pending'}, indent=2) + '\n')
    print('MASTER_QA_OK', len(reports), flush=True)
